import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { ExportProgress } from "../lib/exportProgress";
import { ExportProgressModal } from "./ExportProgressModal";

describe("ExportProgressModal", () => {
  it("renders export progress with accessible dialog semantics", () => {
    const progress: ExportProgress = {
      value: 58,
      label: "正在编码 AVIF",
      estimate: { minSeconds: 30, maxSeconds: 100 },
    };

    const markup = renderToStaticMarkup(
      <ExportProgressModal
        fileName="封面-完整文件名.avif"
        formatLabel="AVIF"
        progress={progress}
        showTiming
        onCancel={() => undefined}
      />,
    );

    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-modal="true"');
    expect(markup).toContain('tabindex="-1"');
    expect(markup).toContain('class="export-progress-backdrop"');
    expect(markup).toContain('class="export-progress-modal"');
    expect(markup).toContain('class="export-progress-header"');
    expect(markup).toContain('class="export-progress-format"');
    expect(markup).toContain('class="export-progress-file"');
    expect(markup).toContain('class="export-progress-meta"');
    expect(markup).toContain('class="export-progress-note"');
    expect(markup).toContain('class="export-progress-track"');
    expect(markup).toContain('class="export-progress-fill"');
    expect(markup).toContain("正在导出封面");
    expect(markup).toContain("AVIF");
    expect(markup).toContain("封面-完整文件名.avif");
    expect(markup).toContain('title="封面-完整文件名.avif"');
    expect(markup).toContain("正在编码 AVIF");
    expect(markup).toContain("预计约 30 秒～1 分 40 秒");
    expect(markup).toContain("已用时间 0 秒");
    expect(markup).toContain("取消导出");
    expect(markup).toContain('type="button"');
    expect(markup).toContain("58%");
    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('aria-label="导出进度"');
    expect(markup).toContain('aria-valuemin="0"');
    expect(markup).toContain('aria-valuemax="100"');
    expect(markup).toContain('aria-valuenow="58"');
    expect(markup).toContain("width:58%");
  });

  it("does not show AVIF timing controls for other export formats", () => {
    const markup = renderToStaticMarkup(
      <ExportProgressModal
        fileName="封面.png"
        formatLabel="PNG"
        progress={{ value: 58, label: "正在编码 PNG" }}
      />,
    );

    expect(markup).not.toContain("小样本测速");
    expect(markup).not.toContain("预计");
    expect(markup).not.toContain("已用时间");
    expect(markup).not.toContain("取消导出");
  });
});
