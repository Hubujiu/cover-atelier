type AvifModule = {
  encode: (data: ImageData, options?: { quality?: number; speed?: number }) => Promise<ArrayBuffer>;
};

let encoderModulePromise: Promise<AvifModule> | null = null;

export async function encodeAvif(imageData: ImageData, quality = 0.92): Promise<ArrayBuffer> {
  encoderModulePromise ??= import("@jsquash/avif") as unknown as Promise<AvifModule>;
  const module = await encoderModulePromise;
  return module.encode(imageData, {
    quality: Math.round(quality * 100),
    speed: 6,
  });
}
