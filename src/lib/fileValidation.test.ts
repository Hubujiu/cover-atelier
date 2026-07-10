import { describe, expect, it } from "vitest";
import { isSupportedImageFile } from "./fileValidation";

describe("image file validation", () => {
  it("accepts AVIF files by extension and MIME type", () => {
    expect(isSupportedImageFile({ name: "mountain.avif", type: "" })).toBe(true);
    expect(isSupportedImageFile({ name: "cover.bin", type: "image/avif" })).toBe(true);
  });

  it("keeps accepting the existing image formats", () => {
    expect(isSupportedImageFile({ name: "cover.png", type: "image/png" })).toBe(true);
    expect(isSupportedImageFile({ name: "cover.jpg", type: "image/jpeg" })).toBe(true);
    expect(isSupportedImageFile({ name: "cover.webp", type: "image/webp" })).toBe(true);
  });

  it("rejects unsupported image formats", () => {
    expect(isSupportedImageFile({ name: "cover.gif", type: "image/gif" })).toBe(false);
  });
});
