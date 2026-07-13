import { encode } from "@jsquash/avif";

type AvifEncodeOptions = {
  quality: number;
  speed: number;
  subsample: number;
};

type AvifEncodeRequest = {
  imageData: {
    data: ArrayBuffer;
    width: number;
    height: number;
  };
  calibrationImageData: {
    data: ArrayBuffer;
    width: number;
    height: number;
  };
  options: AvifEncodeOptions;
};

type AvifEncodeResponse =
  | { type: "success"; buffer: ArrayBuffer }
  | { type: "estimate"; calibrationMs: number }
  | { type: "error"; message: string };

type AvifWorkerScope = {
  onmessage: ((event: MessageEvent<AvifEncodeRequest>) => void) | null;
  postMessage: (message: AvifEncodeResponse, transfer?: Transferable[]) => void;
};

const workerScope = globalThis as unknown as AvifWorkerScope;

workerScope.onmessage = async (event) => {
  try {
    const { imageData, calibrationImageData, options } = event.data;
    await encode(new ImageData(1, 1), options);
    const calibrationData = new ImageData(
      new Uint8ClampedArray(calibrationImageData.data),
      calibrationImageData.width,
      calibrationImageData.height,
    );
    const calibrationStartedAt = performance.now();
    await encode(calibrationData, options);
    const calibrationMs = performance.now() - calibrationStartedAt;
    workerScope.postMessage({ type: "estimate", calibrationMs });

    const data = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
    const buffer = await encode(data, options);
    workerScope.postMessage({ type: "success", buffer }, [buffer]);
  } catch (error) {
    workerScope.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : "AVIF 编码失败",
    });
  }
};

export {};
