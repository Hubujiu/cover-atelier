import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { ExportProgress } from "../lib/exportProgress";
import { ExportProgressModal } from "./ExportProgressModal";

describe("ExportProgressModal", () => {
  it("renders export progress with accessible dialog semantics", () => {
    const progress: ExportProgress = {
      value: 58,
      label: "正在编码 AVIF",
    };

    const markup = renderToStaticMarkup(
      <ExportProgressModal
        fileName="封面-完整文件名.avif"
        formatLabel="AVIF"
        progress={progress}
      />,
    );

    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-modal="true"');
    expect(markup).toContain("正在导出封面");
    expect(markup).toContain("AVIF");
    expect(markup).toContain("封面-完整文件名.avif");
    expect(markup).toContain('title="封面-完整文件名.avif"');
    expect(markup).toContain("正在编码 AVIF");
    expect(markup).toContain("58%");
    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('aria-valuemin="0"');
    expect(markup).toContain('aria-valuemax="100"');
    expect(markup).toContain('aria-valuenow="58"');
    expect(markup).toContain("width:58%");
  });
});
