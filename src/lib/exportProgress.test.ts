import { describe, expect, it } from "vitest";
import { getExportProgressStages } from "./exportProgress";

describe("export progress stages", () => {
  it("returns ordered progress for an AVIF export with a background", () => {
    const stages = getExportProgressStages("AVIF", true);

    expect(stages.map((stage) => stage.value)).toEqual([0, 10, 25, 58, 92, 100]);
    expect(stages[3].label).toContain("AVIF");
  });

  it("skips image loading when no background is selected", () => {
    const stages = getExportProgressStages("PNG", false);

    expect(stages.map((stage) => stage.value)).toEqual([0, 25, 58, 92, 100]);
  });
});
