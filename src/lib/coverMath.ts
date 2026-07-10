export type CoverCrop = {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getCoverCrop(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): CoverCrop {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  if (sourceRatio > targetRatio) {
    const sw = sourceHeight * targetRatio;
    return {
      sx: (sourceWidth - sw) / 2,
      sy: 0,
      sw,
      sh: sourceHeight,
    };
  }

  const sh = sourceWidth / targetRatio;
  return {
    sx: 0,
    sy: (sourceHeight - sh) / 2,
    sw: sourceWidth,
    sh,
  };
}

export function wrapText(
  text: string,
  maxWidth: number,
  measure: (value: string) => number,
): string[] {
  const normalized = text.trim();
  if (!normalized) return [""];

  const tokens = normalized.includes(" ")
    ? normalized.split(/(\s+)/).filter(Boolean)
    : Array.from(normalized);
  const lines: string[] = [];
  let current = "";

  for (const token of tokens) {
    const next = current ? `${current}${token}` : token.trimStart();
    if (current && measure(next) > maxWidth) {
      lines.push(current.trim());
      current = token.trimStart();
    } else {
      current = next;
    }
  }

  if (current.trim()) lines.push(current.trim());
  return lines.length ? lines : [""];
}
