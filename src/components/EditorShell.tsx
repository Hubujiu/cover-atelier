import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, DownloadSimple, ImageSquare } from "@phosphor-icons/react";
import { ControlPanel } from "./ControlPanel";
import { CoverCanvas } from "./CoverCanvas";
import { defaultCoverState } from "../lib/defaults";
import { exportCover } from "../lib/exportCover";
import { loadLocalFont } from "../lib/fontLoader";
import type { CoverState, LocalFont } from "../types";

function isSupportedImage(file: File): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return ["png", "jpg", "jpeg", "webp"].includes(extension ?? "") || ["image/png", "image/jpeg", "image/webp"].includes(file.type);
}

export function EditorShell() {
  const [state, setState] = useState<CoverState>(defaultCoverState);
  const [localFonts, setLocalFonts] = useState<LocalFont[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const backgroundUrlRef = useRef<string | null>(null);
  const fontUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      if (backgroundUrlRef.current) URL.revokeObjectURL(backgroundUrlRef.current);
      fontUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const updateState = useCallback((patch: Partial<CoverState>) => {
    setState((current) => ({ ...current, ...patch }));
    setError(null);
    setNotice(null);
  }, []);

  const handleImageFile = useCallback((file: File) => {
    if (!isSupportedImage(file)) {
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
    setIsExporting(true);
    setError(null);
    setNotice("正在生成 PNG...");
    try {
      await document.fonts.ready;
      await exportCover(state);
      setNotice("PNG 已保存到本机下载目录");
    } catch (exportError) {
      setNotice(null);
      setError(exportError instanceof Error ? exportError.message : "导出失败，请重试。");
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, state]);

  return (
    <div className="app-shell">
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
          <button className="export-button" type="button" onClick={handleExport} disabled={isExporting}>
            <DownloadSimple size={18} weight="bold" />
            {isExporting ? "生成中" : "导出 PNG"}
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
  );
}
