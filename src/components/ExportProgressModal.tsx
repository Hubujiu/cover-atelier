import { useEffect, useRef, useState } from "react";
import { X } from "@phosphor-icons/react";
import { formatDuration, formatEstimateRange } from "../lib/avifEstimate";
import type { ExportProgress } from "../lib/exportProgress";

type ExportProgressModalProps = {
  fileName: string;
  formatLabel: string;
  progress: ExportProgress;
  showTiming?: boolean;
  onCancel?: () => void;
};

export function ExportProgressModal({
  fileName,
  formatLabel,
  progress,
  showTiming = false,
  onCancel,
}: ExportProgressModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    dialogRef.current?.focus();
    if (!showTiming) return;

    const startedAt = performance.now();
    const intervalId = window.setInterval(() => {
      setElapsedSeconds(Math.floor((performance.now() - startedAt) / 1000));
    }, 1_000);
    return () => window.clearInterval(intervalId);
  }, [showTiming]);

  const keepFocusInsideDialog = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab" && cancelButtonRef.current) {
      event.preventDefault();
      cancelButtonRef.current.focus();
    }
  };

  return (
    <div
      className="export-progress-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-progress-title"
      tabIndex={-1}
      ref={dialogRef}
      onKeyDown={keepFocusInsideDialog}
    >
      <div className="export-progress-modal">
        <div className="export-progress-header">
          <h2 id="export-progress-title">正在导出封面</h2>
          <p className="export-progress-format">{formatLabel}</p>
          <p className="export-progress-file" title={fileName}>{fileName}</p>
        </div>
        <div className="export-progress-meta">
          <p className="export-progress-note">{progress.label}</p>
          <p className="export-progress-percent">{progress.value}%</p>
        </div>
        <div
          className="export-progress-track"
          role="progressbar"
          aria-label="导出进度"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.value}
        >
          <div className="export-progress-fill" style={{ width: `${progress.value}%` }} />
        </div>
        {showTiming ? (
          <div className="export-progress-timing">
            <p aria-live="polite">{progress.estimate ? `预计${formatEstimateRange(progress.estimate)}` : "正在进行小样本测速，稍后显示预计时间"}</p>
            <p>已用时间 {formatDuration(elapsedSeconds)}</p>
          </div>
        ) : null}
        {onCancel ? (
          <button
            ref={cancelButtonRef}
            className="export-cancel-button"
            type="button"
            onClick={onCancel}
          >
            <X size={16} weight="bold" />
            取消导出
          </button>
        ) : null}
      </div>
    </div>
  );
}
