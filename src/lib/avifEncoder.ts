type AvifWorkerResponse =
  | { type: "success"; buffer: ArrayBuffer }
  | { type: "error"; message: string };

export const AVIF_ENCODE_OPTIONS = {
  quality: 60,
  speed: 0,
  // @jsquash/avif uses 3 for YUV 4:4:4 in its lossless path.
  subsample: 3,
} as const;

export async function encodeAvif(
  imageData: ImageData,
  quality = AVIF_ENCODE_OPTIONS.quality / 100,
): Promise<ArrayBuffer> {
  const worker = new Worker(new URL("../workers/avifEncoder.worker.ts", import.meta.url), { type: "module" });
  const options = {
    quality: Math.round(quality * 100),
    speed: AVIF_ENCODE_OPTIONS.speed,
    subsample: AVIF_ENCODE_OPTIONS.subsample,
  };

  return new Promise<ArrayBuffer>((resolve, reject) => {
    const finish = (callback: () => void) => {
      worker.terminate();
      callback();
    };

    worker.onmessage = (event: MessageEvent<AvifWorkerResponse>) => {
      const response = event.data;
      if (response.type === "success") {
        finish(() => resolve(response.buffer));
        return;
      }

      finish(() => reject(new Error(response.message)));
    };
    worker.onerror = () => finish(() => reject(new Error("AVIF 编码失败，请重试。")));

    worker.postMessage(
      {
        imageData: {
          data: imageData.data.buffer,
          width: imageData.width,
          height: imageData.height,
        },
        options,
      },
      [imageData.data.buffer],
    );
  });
}
