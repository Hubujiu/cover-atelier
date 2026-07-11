import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { defaultCoverState } from "../lib/defaults";
import { CoverCanvas } from "./CoverCanvas";

describe("CoverCanvas", () => {
  it("applies the selected text color to the preview canvas", () => {
    const markup = renderToStaticMarkup(
      <CoverCanvas state={{ ...defaultCoverState, textColor: "#ff0000" }} />,
    );

    expect(markup).toContain("--cover-text-color:#ff0000");
  });

  it("maps the selected font size to the responsive preview scale", () => {
    const markup = renderToStaticMarkup(
      <CoverCanvas state={{ ...defaultCoverState, fontSize: 64 }} />,
    );

    expect(markup).toContain("--cover-font-size:4cqw");
  });
});
