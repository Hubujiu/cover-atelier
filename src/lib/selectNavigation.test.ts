import { describe, expect, it } from "vitest";
import { getNextSelectIndex } from "./selectNavigation";

describe("select keyboard navigation", () => {
  it("wraps around when moving beyond either end", () => {
    expect(getNextSelectIndex(0, "previous", 4)).toBe(3);
    expect(getNextSelectIndex(3, "next", 4)).toBe(0);
  });

  it("moves one option in the requested direction", () => {
    expect(getNextSelectIndex(1, "previous", 4)).toBe(0);
    expect(getNextSelectIndex(1, "next", 4)).toBe(2);
  });
});
