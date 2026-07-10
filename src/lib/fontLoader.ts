import type { LocalFont } from "../types";

const supportedExtensions = ["ttf", "otf", "woff", "woff2"];

function getExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export async function loadLocalFont(file: File): Promise<LocalFont> {
  const extension = getExtension(file.name);
  if (!supportedExtensions.includes(extension)) {
    throw new Error("字体格式不支持，请选择 TTF、OTF 或 WOFF 文件。");
  }

  const objectUrl = URL.createObjectURL(file);
  const familyName = `Cover Local ${file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9\u4e00-\u9fff]+/g, " ").trim() || "Font"}`;
  const font = new FontFace(familyName, `url("${objectUrl}")`);

  try {
    await font.load();
    document.fonts.add(font);
    return {
      family: familyName,
      objectUrl,
      fileName: file.name,
    };
  } catch {
    URL.revokeObjectURL(objectUrl);
    throw new Error("字体加载失败，请确认文件没有损坏。");
  }
}
