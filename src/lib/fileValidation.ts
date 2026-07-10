export type ImageFileLike = {
  name: string;
  type: string;
};

const supportedImageExtensions = ["png", "jpg", "jpeg", "webp", "avif"];
const supportedImageMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/avif"];

export function isSupportedImageFile(file: ImageFileLike): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return supportedImageExtensions.includes(extension) || supportedImageMimeTypes.includes(file.type);
}
