import { describe, expect, it } from "vitest";
import { getExportFilename } from "./exportFilename";

describe("export filename", () => {
  it("uses the title and selected extension", () => {
    expect(getExportFilename("背包问题-1", "png")).toBe("背包问题-1.png");
  });

  it("removes filesystem-invalid characters and falls back for an empty title", () => {
    expect(getExportFilename('  项目:/测试*  ', "avif")).toBe("项目__测试_.avif");
    expect(getExportFilename("   ", "png")).toBe("cover-atelier.png");
  });
});
