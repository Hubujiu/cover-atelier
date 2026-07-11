type AvifModule = {
  encode: (data: ImageData, options?: { quality?: number; speed?: number; subsample?: number }) => Promise<ArrayBuffer>;
};

let encoderModulePromise: Promise<AvifModule> | null = null;

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
  encoderModulePromise ??= import("@jsquash/avif") as unknown as Promise<AvifModule>;
  const module = await encoderModulePromise;
  return module.encode(imageData, {
    quality: Math.round(quality * 100),
    speed: AVIF_ENCODE_OPTIONS.speed,
    subsample: AVIF_ENCODE_OPTIONS.subsample,
  });
}
