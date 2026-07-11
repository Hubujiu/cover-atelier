import { describe, expect, it } from "vitest";
import { AVIF_ENCODE_OPTIONS } from "./avifEncoder";

describe("AVIF encoder settings", () => {
  it("uses quality-first 4:4:4 encoding", () => {
    expect(AVIF_ENCODE_OPTIONS).toEqual({
      quality: 60,
      speed: 0,
      subsample: 3,
    });
  });
});
