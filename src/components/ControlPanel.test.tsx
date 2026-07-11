import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { defaultCoverState } from "../lib/defaults";
import { ControlPanel } from "./ControlPanel";

describe("ControlPanel", () => {
  it("exposes an exact numeric control for custom strip width", () => {
    const markup = renderToStaticMarkup(
      <ControlPanel
        state={defaultCoverState}
        localFonts={[]}
        error={null}
        notice={null}
        onChange={() => undefined}
        onImageFile={() => undefined}
        onFontFile={() => undefined}
      />,
    );

    expect(markup).toContain('aria-label="横条宽度数值"');
    expect(markup).toContain('value="78"');
  });

  it("disables every editing control while an export is running", () => {
    const markup = renderToStaticMarkup(
      <ControlPanel
        state={defaultCoverState}
        localFonts={[]}
        error={null}
        notice={null}
        disabled
        onChange={() => undefined}
        onImageFile={() => undefined}
        onFontFile={() => undefined}
      />,
    );

    expect(markup.match(/disabled=""/g)?.length).toBeGreaterThanOrEqual(8);
  });
});
