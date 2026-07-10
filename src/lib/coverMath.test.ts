import { describe, expect, it } from "vitest";
import { clamp, getCoverCrop, wrapText } from "./coverMath";

describe("cover geometry", () => {
  it("clamps the strip controls to their valid range", () => {
    expect(clamp(-1, 0, 100)).toBe(0);
    expect(clamp(44, 0, 100)).toBe(44);
    expect(clamp(101, 0, 100)).toBe(100);
  });

  it("crops a landscape source to a 16:9 cover rectangle", () => {
    expect(getCoverCrop(2400, 1200, 1600, 900)).toEqual({
      sx: 133.33333333333348,
      sy: 0,
      sw: 2133.333333333333,
      sh: 1200,
    });
  });

  it("wraps CJK and Latin text without exceeding the max width", () => {
    expect(wrapText("封面标题-1", 96, (value) => value.length * 24)).toEqual([
      "封面标题",
      "-1",
    ]);
  });
});
