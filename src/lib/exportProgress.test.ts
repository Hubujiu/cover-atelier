import { describe, expect, it, vi } from "vitest";
import { exportCover } from "./exportCover";
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

  it("provides valid keys and non-empty labels for every stage", () => {
    const validKeys = new Set([
      "prepare",
      "load-image",
      "draw",
      "encode",
      "download",
      "complete",
    ]);

    for (const stage of getExportProgressStages("WebP", true)) {
      expect(validKeys.has(stage.key)).toBe(true);
      expect(stage.label.trim()).not.toBe("");
    }
  });

  it("reports the real callback sequence for a background-free PNG export", async () => {
    const progress: Array<{ value: number; label: string }> = [];
    const gradient = { addColorStop: vi.fn() };
    const context = {
      createLinearGradient: vi.fn(() => gradient),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      arcTo: vi.fn(),
      save: vi.fn(),
      clip: vi.fn(),
      restore: vi.fn(),
      stroke: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn(() => ({ width: 100 })),
    } as unknown as CanvasRenderingContext2D;
    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => context),
      toBlob: vi.fn((callback: BlobCallback) => callback(new Blob(["png"], { type: "image/png" }))),
    };
    const link = { click: vi.fn(), remove: vi.fn() };

    vi.stubGlobal("document", {
      body: { appendChild: vi.fn() },
      createElement: vi.fn((tagName: string) => (tagName === "canvas" ? canvas : link)),
    });
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:export"),
      revokeObjectURL: vi.fn(),
    });

    try {
      await exportCover(
        {
          backgroundUrl: null,
          backgroundName: null,
          title: "Title",
          subtitle: "Subtitle",
          fontFamily: "sans-serif",
          fontSize: 72,
          textColor: "#111111",
          stripWidth: 80,
          stripPositionY: 50,
          stripOpacity: 0.5,
          blurAmount: 8,
          stripRadius: 24,
          exportFormat: "png",
        },
        (value) => progress.push(value),
      );
    } finally {
      vi.unstubAllGlobals();
    }

    expect(progress).toEqual(
      getExportProgressStages("PNG", false).map(({ value, label }) => ({ value, label })),
    );
  });

  it("does not report download when the blob MIME type is unsupported", async () => {
    const progress: Array<{ value: number; label: string }> = [];
    const gradient = { addColorStop: vi.fn() };
    const context = new Proxy({} as Record<string, unknown>, {
      get: (_target, property) => {
        if (property === "createLinearGradient") return () => gradient;
        if (property === "measureText") return () => ({ width: 100 });
        return vi.fn();
      },
    }) as unknown as CanvasRenderingContext2D;
    const canvas = {
      getContext: vi.fn(() => context),
      toBlob: vi.fn((callback: BlobCallback) => callback(new Blob(["png"], { type: "image/webp" }))),
    };
    const link = { click: vi.fn(), remove: vi.fn() };

    vi.stubGlobal("document", {
      body: { appendChild: vi.fn() },
      createElement: vi.fn((tagName: string) => (tagName === "canvas" ? canvas : link)),
    });
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:export"),
      revokeObjectURL: vi.fn(),
    });

    await expect(
      exportCover(
        {
          backgroundUrl: null,
          backgroundName: null,
          title: "Title",
          subtitle: "Subtitle",
          fontFamily: "sans-serif",
          fontSize: 72,
          textColor: "#111111",
          stripWidth: 80,
          stripPositionY: 50,
          stripOpacity: 0.5,
          blurAmount: 8,
          stripRadius: 24,
          exportFormat: "png",
        },
        (value) => progress.push(value),
      ),
    ).rejects.toThrow();
    vi.unstubAllGlobals();

    expect(progress.map(({ value }) => value)).toEqual([0, 25, 58]);
  });
});
