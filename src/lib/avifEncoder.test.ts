import { afterEach, describe, expect, it, vi } from "vitest";
import { AVIF_ENCODE_OPTIONS, encodeAvif } from "./avifEncoder";

describe("AVIF encoder settings", () => {
  it("uses quality-first 4:4:4 encoding", () => {
    expect(AVIF_ENCODE_OPTIONS).toEqual({
      quality: 60,
      speed: 0,
      subsample: 3,
    });
  });

  it("runs encoding in a module worker", async () => {
    class FakeWorker {
      static latest: FakeWorker | null = null;
      onerror: ((event: ErrorEvent) => void) | null = null;
      onmessage: ((event: MessageEvent) => void) | null = null;
      payload: unknown;
      transfer: Transferable[] | undefined;

      constructor(public readonly script: URL, public readonly options: WorkerOptions) {
        FakeWorker.latest = this;
      }

      postMessage(payload: unknown, transfer?: Transferable[]) {
        this.payload = payload;
        this.transfer = transfer;
        queueMicrotask(() => this.onmessage?.({ data: { type: "success", buffer: new ArrayBuffer(4) } } as MessageEvent));
      }

      terminate() {}
    }

    vi.stubGlobal("Worker", FakeWorker);
    const imageData = {
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
    } as unknown as ImageData;

    const result = await encodeAvif(imageData, 0.6);

    expect(result.byteLength).toBe(4);
    expect(FakeWorker.latest?.script.pathname).toContain("avifEncoder.worker.ts");
    expect(FakeWorker.latest?.options).toEqual({ type: "module" });
    expect(FakeWorker.latest?.payload).toEqual({
      imageData: { data: imageData.data.buffer, width: 1, height: 1 },
      calibrationImageData: {
        data: expect.any(ArrayBuffer),
        width: 1,
        height: 1,
      },
      options: { quality: 60, speed: 0, subsample: 3 },
    });
    expect(FakeWorker.latest?.transfer).toEqual([imageData.data.buffer, expect.any(ArrayBuffer)]);
  });

  it("reports a stateless estimate from the calibration result", async () => {
    class FakeWorker {
      onerror: ((event: ErrorEvent) => void) | null = null;
      onmessage: ((event: MessageEvent) => void) | null = null;

      postMessage() {
        queueMicrotask(() => {
          this.onmessage?.({ data: { type: "estimate", calibrationMs: 2_000 } } as MessageEvent);
          this.onmessage?.({ data: { type: "success", buffer: new ArrayBuffer(4) } } as MessageEvent);
        });
      }

      terminate() {}
    }

    vi.stubGlobal("Worker", FakeWorker);
    const onEstimate = vi.fn();
    const imageData = {
      data: new Uint8ClampedArray(1600 * 900 * 4),
      width: 1600,
      height: 900,
    } as ImageData;

    await encodeAvif(imageData, 0.6, { onEstimate });

    expect(onEstimate).toHaveBeenCalledWith({ minSeconds: 30, maxSeconds: 100 });
  });

  it("has no hard timeout and only terminates a stalled worker when cancelled", async () => {
    class FakeWorker {
      static latest: FakeWorker | null = null;
      onerror: ((event: ErrorEvent) => void) | null = null;
      onmessage: ((event: MessageEvent) => void) | null = null;
      terminated = false;

      constructor() {
        FakeWorker.latest = this;
      }

      postMessage() {}

      terminate() {
        this.terminated = true;
      }
    }

    vi.useFakeTimers();
    vi.stubGlobal("Worker", FakeWorker);
    const controller = new AbortController();
    const imageData = {
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
    } as ImageData;
    const result = encodeAvif(imageData, 0.6, { signal: controller.signal }).then(
      () => "resolved",
      (error: Error) => error.name,
    );

    await vi.advanceTimersByTimeAsync(120_001);
    expect(FakeWorker.latest?.terminated).toBe(false);

    controller.abort();
    expect(await result).toBe("AbortError");
    expect(FakeWorker.latest?.terminated).toBe(true);
    vi.useRealTimers();
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
