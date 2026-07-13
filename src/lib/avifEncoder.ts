import {
  createAvifCalibrationImageData,
  estimateAvifDuration,
} from "./avifEstimate";
import type { AvifDurationEstimate } from "./avifEstimate";

type AvifWorkerResponse =
  | { type: "success"; buffer: ArrayBuffer }
  | { type: "estimate"; calibrationMs: number }
  | { type: "error"; message: string };

export const AVIF_ENCODE_OPTIONS = {
  quality: 60,
  speed: 0,
  // @jsquash/avif uses 3 for YUV 4:4:4 in its lossless path.
  subsample: 3,
} as const;

type EncodeAvifRuntimeOptions = {
  signal?: AbortSignal;
  onEstimate?: (estimate: AvifDurationEstimate) => void;
};

function createAbortError(): Error {
  const error = new Error("AVIF 导出已取消。");
  error.name = "AbortError";
  return error;
}

export async function encodeAvif(
  imageData: ImageData,
  quality = AVIF_ENCODE_OPTIONS.quality / 100,
  runtimeOptions: EncodeAvifRuntimeOptions = {},
): Promise<ArrayBuffer> {
  if (runtimeOptions.signal?.aborted) throw createAbortError();

  const worker = new Worker(new URL("../workers/avifEncoder.worker.ts", import.meta.url), { type: "module" });
  const calibrationImageData = createAvifCalibrationImageData(imageData);
  const options = {
    quality: Math.round(quality * 100),
    speed: AVIF_ENCODE_OPTIONS.speed,
    subsample: AVIF_ENCODE_OPTIONS.subsample,
  };

  return new Promise<ArrayBuffer>((resolve, reject) => {
    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      runtimeOptions.signal?.removeEventListener("abort", handleAbort);
      worker.terminate();
      callback();
    };

    const handleAbort = () => finish(() => reject(createAbortError()));

    worker.onmessage = (event: MessageEvent<AvifWorkerResponse>) => {
      const response = event.data;
      if (response.type === "estimate") {
        runtimeOptions.onEstimate?.(estimateAvifDuration(
          response.calibrationMs,
          calibrationImageData.width * calibrationImageData.height,
          imageData.width * imageData.height,
        ));
        return;
      }

      if (response.type === "success") {
        finish(() => resolve(response.buffer));
        return;
      }

      finish(() => reject(new Error(response.message)));
    };
    worker.onerror = () => finish(() => reject(new Error("AVIF 编码失败，请重试。")));

    runtimeOptions.signal?.addEventListener("abort", handleAbort, { once: true });

    worker.postMessage(
      {
        imageData: {
          data: imageData.data.buffer,
          width: imageData.width,
          height: imageData.height,
        },
        calibrationImageData: {
          data: calibrationImageData.data.buffer,
          width: calibrationImageData.width,
          height: calibrationImageData.height,
        },
        options,
      },
      [imageData.data.buffer, calibrationImageData.data.buffer],
    );
  });
}
