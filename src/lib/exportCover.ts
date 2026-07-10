import { getCoverCrop, wrapText } from "./coverMath";
import { getExportConfig } from "./exportFormat";
import { encodeAvif } from "./avifEncoder";
import type { CoverState } from "../types";

const EXPORT_WIDTH = 1600;
const EXPORT_HEIGHT = 900;

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawPlaceholder(ctx: CanvasRenderingContext2D): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, EXPORT_HEIGHT);
  gradient.addColorStop(0, "#9fb8c2");
  gradient.addColorStop(0.45, "#d7c4c4");
  gradient.addColorStop(1, "#14232d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

  ctx.fillStyle = "rgba(250, 221, 214, 0.32)";
  ctx.beginPath();
  ctx.moveTo(0, 235);
  ctx.bezierCurveTo(220, 170, 420, 330, 700, 245);
  ctx.bezierCurveTo(960, 170, 1120, 315, 1600, 218);
  ctx.lineTo(1600, 430);
  ctx.lineTo(0, 430);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#233641";
  ctx.beginPath();
  ctx.moveTo(0, 680);
  ctx.lineTo(280, 490);
  ctx.lineTo(440, 610);
  ctx.lineTo(670, 410);
  ctx.lineTo(900, 670);
  ctx.lineTo(1130, 480);
  ctx.lineTo(1600, 690);
  ctx.lineTo(1600, 900);
  ctx.lineTo(0, 900);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#0b1720";
  ctx.beginPath();
  ctx.moveTo(0, 785);
  ctx.lineTo(250, 620);
  ctx.lineTo(510, 760);
  ctx.lineTo(790, 550);
  ctx.lineTo(1040, 800);
  ctx.lineTo(1330, 630);
  ctx.lineTo(1600, 760);
  ctx.lineTo(1600, 900);
  ctx.lineTo(0, 900);
  ctx.closePath();
  ctx.fill();
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("背景图片读取失败，请重新选择图片。"));
    image.src = source;
  });
}

function drawBackground(ctx: CanvasRenderingContext2D, image: HTMLImageElement | null): void {
  if (!image) {
    drawPlaceholder(ctx);
    return;
  }

  const crop = getCoverCrop(image.naturalWidth, image.naturalHeight, EXPORT_WIDTH, EXPORT_HEIGHT);
  ctx.drawImage(image, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
}

function getStripRect(state: CoverState): { x: number; y: number; width: number; height: number } {
  const width = EXPORT_WIDTH * (state.stripWidth / 100);
  const height = 248;
  const x = (EXPORT_WIDTH - width) / 2;
  const y = Math.min(
    EXPORT_HEIGHT - height - 28,
    Math.max(28, EXPORT_HEIGHT * (state.stripPositionY / 100) - height / 2),
  );
  return { x, y, width, height };
}

function drawGlassStrip(
  ctx: CanvasRenderingContext2D,
  state: CoverState,
  image: HTMLImageElement | null,
): { x: number; y: number; width: number; height: number } {
  const rect = getStripRect(state);
  const radius = state.stripRadius * 1.4;

  ctx.save();
  roundedRectPath(ctx, rect.x, rect.y, rect.width, rect.height, radius);
  ctx.clip();

  if (image) {
    const crop = getCoverCrop(image.naturalWidth, image.naturalHeight, EXPORT_WIDTH, EXPORT_HEIGHT);
    ctx.filter = `blur(${state.blurAmount}px) saturate(145%)`;
    ctx.drawImage(image, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
    ctx.filter = "none";
  } else {
    ctx.fillStyle = "rgba(159, 184, 194, 0.52)";
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  ctx.fillStyle = `rgba(255, 255, 255, ${state.stripOpacity})`;
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  ctx.restore();

  ctx.save();
  roundedRectPath(ctx, rect.x, rect.y, rect.width, rect.height, radius);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.62)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  return rect;
}

function drawCenteredLines(
  ctx: CanvasRenderingContext2D,
  value: string,
  centerX: number,
  startY: number,
  maxWidth: number,
  font: string,
  lineHeight: number,
  color: string,
): number {
  if (!value.trim()) return 0;
  ctx.font = font;
  const lines = wrapText(value, maxWidth, (line) => ctx.measureText(line).width);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  lines.forEach((line, index) => ctx.fillText(line, centerX, startY + index * lineHeight));
  return lines.length * lineHeight;
}

export async function exportCover(state: CoverState): Promise<void> {
  const config = getExportConfig(state.exportFormat);
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("当前浏览器无法创建导出画布。");

  const image = state.backgroundUrl ? await loadImage(state.backgroundUrl) : null;
  drawBackground(ctx, image);
  const rect = drawGlassStrip(ctx, state, image);
  const centerX = rect.x + rect.width / 2;
  const titleSize = state.fontSize;
  const subtitleSize = Math.max(18, Math.round(state.fontSize * 0.43));
  const titleHeight = drawCenteredLines(
    ctx,
    state.title,
    centerX,
    rect.y + 56,
    rect.width - 140,
    `700 ${titleSize}px ${state.fontFamily}`,
    Math.round(titleSize * 1.18),
    state.textColor,
  );
  drawCenteredLines(
    ctx,
    state.subtitle,
    centerX,
    rect.y + 56 + titleHeight + 12,
    rect.width - 140,
    `500 ${subtitleSize}px ${state.fontFamily}`,
    Math.round(subtitleSize * 1.35),
    state.textColor,
  );

  const blob = state.exportFormat === "avif"
    ? new Blob([new Uint8Array(await encodeAvif(ctx.getImageData(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT), config.quality ?? 0.92))], { type: config.mimeType })
    : await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, config.mimeType, config.quality));
  if (!blob) throw new Error("图片生成失败，请重试。");
  if (state.exportFormat !== "avif" && blob.type !== config.mimeType) {
    throw new Error(`当前浏览器不支持 ${config.label} 导出，请选择其他格式。`);
  }

  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `cover-atelier-${new Date().toISOString().slice(0, 10)}.${config.extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
}
