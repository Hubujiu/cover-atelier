import { describe, expect, it } from "vitest";
import {
  createAvifCalibrationImageData,
  estimateAvifDuration,
  formatDuration,
  formatEstimateRange,
} from "./avifEstimate";

describe("AVIF duration estimation", () => {
  it("creates a same-ratio calibration sample from the full image", () => {
    const source = {
      width: 4,
      height: 2,
      data: new Uint8ClampedArray([
        1, 2, 3, 255, 4, 5, 6, 255, 7, 8, 9, 255, 10, 11, 12, 255,
        13, 14, 15, 255, 16, 17, 18, 255, 19, 20, 21, 255, 22, 23, 24, 255,
      ]),
    } as ImageData;

    const sample = createAvifCalibrationImageData(source, 2);

    expect(sample.width).toBe(2);
    expect(sample.height).toBe(1);
    expect([...sample.data]).toEqual([1, 2, 3, 255, 7, 8, 9, 255]);
  });

  it("returns a deliberately broad, rounded estimate range", () => {
    expect(estimateAvifDuration(2_000, 320 * 180, 1600 * 900)).toEqual({
      minSeconds: 30,
      maxSeconds: 100,
    });
  });

  it("formats elapsed time and estimate ranges for people", () => {
    expect(formatDuration(42)).toBe("42 秒");
    expect(formatDuration(72)).toBe("1 分 12 秒");
    expect(formatEstimateRange({ minSeconds: 30, maxSeconds: 100 })).toBe("约 30 秒～1 分 40 秒");
  });
});
