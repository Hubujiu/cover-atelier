import type { AvifDurationEstimate } from "./avifEstimate";

export type ExportProgress = {
  value: number;
  label: string;
  estimate?: AvifDurationEstimate;
};

export type ExportProgressStage = ExportProgress & {
  key: "prepare" | "load-image" | "draw" | "encode" | "download" | "complete";
};

export function getExportProgressStages(
  formatLabel: string,
  hasBackground: boolean,
): ExportProgressStage[] {
  const stages: ExportProgressStage[] = [
    { key: "prepare", value: 0, label: "准备画布" },
  ];

  if (hasBackground) {
    stages.push({ key: "load-image", value: 10, label: "正在加载背景图片" });
    stages.push({
      key: "draw",
      value: 25,
      label: "正在绘制背景、玻璃横条和文字",
    });
  } else {
    stages.push({
      key: "draw",
      value: 25,
      label: "正在绘制默认背景、玻璃横条和文字",
    });
  }

  stages.push(
    {
      key: "encode",
      value: 58,
      label: formatLabel === "AVIF" ? "正在估算 AVIF 所需时间" : `正在编码 ${formatLabel}`,
    },
    { key: "download", value: 92, label: "正在准备下载文件" },
    { key: "complete", value: 100, label: "导出完成" },
  );

  return stages;
}
