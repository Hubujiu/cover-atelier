import type { ExportFormat } from "../types";

export type ExportConfig = {
  label: string;
  mimeType: string;
  extension: string;
  quality?: number;
};

export const exportFormatOptions: Array<{ value: ExportFormat; label: string }> = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
  { value: "avif", label: "AVIF" },
];

export function getExportConfig(format: ExportFormat): ExportConfig {
  switch (format) {
    case "jpeg":
      return { label: "JPEG", mimeType: "image/jpeg", extension: "jpg", quality: 0.92 };
    case "webp":
      return { label: "WebP", mimeType: "image/webp", extension: "webp", quality: 0.92 };
    case "avif":
      return { label: "AVIF", mimeType: "image/avif", extension: "avif", quality: 0.6 };
    case "png":
    default:
      return { label: "PNG", mimeType: "image/png", extension: "png" };
  }
}
