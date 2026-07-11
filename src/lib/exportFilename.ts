const invalidFilenameCharacters = /[<>:"/\\|?*\u0000-\u001F]/g;

export function getExportFilename(title: string, extension: string): string {
  const safeTitle = title
    .trim()
    .replace(invalidFilenameCharacters, "_")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "")
    .slice(0, 120)
    .trim();

  return `${safeTitle || "cover-atelier"}.${extension}`;
}
