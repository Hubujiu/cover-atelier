import type { ExportProgress } from "../lib/exportProgress";

type ExportProgressModalProps = {
  fileName: string;
  formatLabel: string;
  progress: ExportProgress;
};

export function ExportProgressModal({
  fileName,
  formatLabel,
  progress,
}: ExportProgressModalProps) {
  return (
    <div
      className="export-progress-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-progress-title"
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
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.value}
        >
          <div className="export-progress-fill" style={{ width: `${progress.value}%` }} />
        </div>
      </div>
    </div>
  );
}
