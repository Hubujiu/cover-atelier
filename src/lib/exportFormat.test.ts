import { describe, expect, it } from "vitest";
import { getExportConfig } from "./exportFormat";

describe("export format configuration", () => {
  it("maps every supported format to its MIME type and extension", () => {
    expect(getExportConfig("png")).toEqual({ label: "PNG", mimeType: "image/png", extension: "png" });
    expect(getExportConfig("jpeg")).toEqual({ label: "JPEG", mimeType: "image/jpeg", extension: "jpg", quality: 0.92 });
    expect(getExportConfig("webp")).toEqual({ label: "WebP", mimeType: "image/webp", extension: "webp", quality: 0.92 });
    expect(getExportConfig("avif")).toEqual({ label: "AVIF", mimeType: "image/avif", extension: "avif", quality: 0.92 });
  });
});
