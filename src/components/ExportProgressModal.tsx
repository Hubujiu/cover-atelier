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
    <div role="dialog" aria-modal="true" aria-labelledby="export-progress-title">
      <h2 id="export-progress-title">正在导出封面</h2>
      <p>{formatLabel}</p>
      <p title={fileName}>{fileName}</p>
      <p>{progress.label}</p>
      <p>{progress.value}%</p>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.value}
      >
        <div style={{ width: `${progress.value}%` }} />
      </div>
    </div>
  );
}
