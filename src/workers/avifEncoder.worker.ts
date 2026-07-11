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
  options: AvifEncodeOptions;
};

type AvifEncodeResponse =
  | { type: "success"; buffer: ArrayBuffer }
  | { type: "error"; message: string };

type AvifWorkerScope = {
  onmessage: ((event: MessageEvent<AvifEncodeRequest>) => void) | null;
  postMessage: (message: AvifEncodeResponse, transfer?: Transferable[]) => void;
};

const workerScope = globalThis as unknown as AvifWorkerScope;

workerScope.onmessage = async (event) => {
  try {
    const { imageData, options } = event.data;
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
