import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, DownloadSimple, ImageSquare } from "@phosphor-icons/react";
import { ControlPanel } from "./ControlPanel";
import { CoverCanvas } from "./CoverCanvas";
import { ExportProgressModal } from "./ExportProgressModal";
import { StyledSelect } from "./StyledSelect";
import { defaultCoverState } from "../lib/defaults";
import { exportCover } from "../lib/exportCover";
import { exportFormatOptions, getExportConfig } from "../lib/exportFormat";
import { getExportFilename } from "../lib/exportFilename";
import { isSupportedImageFile } from "../lib/fileValidation";
import { loadLocalFont } from "../lib/fontLoader";
import type { ExportProgress } from "../lib/exportProgress";
import type { CoverState, LocalFont } from "../types";

export function EditorShell() {
  const [state, setState] = useState<CoverState>(defaultCoverState);
  const [localFonts, setLocalFonts] = useState<LocalFont[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportSnapshot, setExportSnapshot] = useState<CoverState | null>(null);
  const appContentRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const backgroundUrlRef = useRef<string | null>(null);
  const fontUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      if (backgroundUrlRef.current) URL.revokeObjectURL(backgroundUrlRef.current);
      fontUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    const appContent = appContentRef.current;
    if (!appContent) return;

    if (isExporting) {
      appContent.setAttribute("inert", "");
    } else {
      appContent.removeAttribute("inert");
    }
  }, [isExporting]);

  const updateState = useCallback((patch: Partial<CoverState>) => {
    setState((current) => ({ ...current, ...patch }));
    setError(null);
    setNotice(null);
  }, []);

  const handleImageFile = useCallback((file: File) => {
    if (!isSupportedImageFile(file)) {
      setError("图片格式不支持，请选择 PNG、JPG 或 WebP 文件。");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      if (backgroundUrlRef.current) URL.revokeObjectURL(backgroundUrlRef.current);
      backgroundUrlRef.current = objectUrl;
      setState((current) => ({ ...current, backgroundUrl: objectUrl, backgroundName: file.name }));
      setError(null);
      setNotice("背景图片已更新");
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError("无法读取图片，请选择一张有效的图片文件。");
    };
    image.src = objectUrl;
  }, []);

  const handleFontFile = useCallback(async (file: File) => {
    setError(null);
    setNotice("正在加载字体...");
    try {
      const font = await loadLocalFont(file);
      fontUrlsRef.current.push(font.objectUrl);
      setLocalFonts((current) => [...current, font]);
      setState((current) => ({ ...current, fontFamily: font.family }));
      setNotice(`已加载字体：${font.fileName}`);
    } catch (fontError) {
      setNotice(null);
      setError(fontError instanceof Error ? fontError.message : "字体加载失败，请重试。");
    }
  }, []);

  const handleExport = useCallback(async () => {
    if (isExporting) return;
    const exportSnapshot = state;
    const exportConfig = getExportConfig(exportSnapshot.exportFormat);
    setIsExporting(true);
    setExportSnapshot(exportSnapshot);
    setError(null);
    setExportProgress({ value: 0, label: "准备画布" });
    setNotice(`正在生成 ${exportConfig.label}...`);
    try {
      await document.fonts.ready;
      await exportCover(exportSnapshot, setExportProgress);
      setNotice(`${exportConfig.label} 已保存到本机下载目录`);
    } catch (exportError) {
      setNotice(null);
      setError(exportError instanceof Error ? exportError.message : "导出失败，请重试。");
    } finally {
      setExportProgress(null);
      setExportSnapshot(null);
      setIsExporting(false);
      window.setTimeout(() => exportButtonRef.current?.focus(), 0);
    }
  }, [isExporting, state]);

  return (
    <div className="app-shell">
      <div ref={appContentRef} aria-busy={isExporting}>
      <header className="app-header">
        <div className="brand-lockup">
          <div className="brand-mark">CA</div>
          <div>
            <p className="brand-name">Cover Atelier</p>
            <p className="brand-caption">博客封面工作台</p>
          </div>
        </div>
        <div className="header-actions">
          <span className="canvas-spec">16:9 · 1600 × 900</span>
          <label className="format-picker">
            <span>格式</span>
            <StyledSelect
              ariaLabel="导出格式"
              value={state.exportFormat}
              options={exportFormatOptions}
              disabled={isExporting}
              onChange={(value) => updateState({ exportFormat: value as CoverState["exportFormat"] })}
            />
          </label>
          <button ref={exportButtonRef} className="export-button" type="button" onClick={handleExport} disabled={isExporting}>
            <DownloadSimple size={18} weight="bold" />
            {isExporting ? "生成中" : `导出 ${exportFormatOptions.find((format) => format.value === state.exportFormat)?.label ?? "PNG"}`}
            <ArrowUpRight size={15} weight="bold" />
          </button>
        </div>
      </header>

      <main className="editor-layout">
        <ControlPanel
          state={state}
          localFonts={localFonts}
          error={error}
          notice={notice}
          disabled={isExporting}
          onChange={updateState}
          onImageFile={handleImageFile}
          onFontFile={handleFontFile}
        />
        <section className="workspace" aria-label="封面预览区域">
          <div className="workspace-heading">
            <div>
              <p className="workspace-kicker"><ImageSquare size={15} weight="bold" /> 当前画布</p>
              <h1>让标题停在画面最重要的位置。</h1>
            </div>
            <p className="workspace-note">所有内容在本机处理</p>
          </div>
          <CoverCanvas state={state} />
        </section>
      </main>
      </div>
      {exportProgress && exportSnapshot ? (
        <ExportProgressModal
          progress={exportProgress}
          fileName={getExportFilename(exportSnapshot.title, getExportConfig(exportSnapshot.exportFormat).extension)}
          formatLabel={getExportConfig(exportSnapshot.exportFormat).label}
        />
      ) : null}
    </div>
  );
}
