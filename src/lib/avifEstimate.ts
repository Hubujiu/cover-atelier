export type AvifDurationEstimate = {
  minSeconds: number;
  maxSeconds: number;
};

export type AvifImageData = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

const CALIBRATION_WIDTH = 320;

function roundEstimate(seconds: number): number {
  const step = seconds <= 60 ? 5 : seconds <= 300 ? 10 : 30;
  return Math.max(step, Math.round(seconds / step) * step);
}

export function createAvifCalibrationImageData(
  source: ImageData,
  targetWidth = CALIBRATION_WIDTH,
): AvifImageData {
  const width = Math.max(1, Math.min(targetWidth, source.width));
  const height = Math.max(1, Math.round(source.height * (width / source.width)));
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    const sourceY = Math.min(source.height - 1, Math.floor(y * source.height / height));
    for (let x = 0; x < width; x += 1) {
      const sourceX = Math.min(source.width - 1, Math.floor(x * source.width / width));
      const sourceOffset = (sourceY * source.width + sourceX) * 4;
      const targetOffset = (y * width + x) * 4;
      data[targetOffset] = source.data[sourceOffset];
      data[targetOffset + 1] = source.data[sourceOffset + 1];
      data[targetOffset + 2] = source.data[sourceOffset + 2];
      data[targetOffset + 3] = source.data[sourceOffset + 3];
    }
  }

  return { data, width, height };
}

export function estimateAvifDuration(
  calibrationMs: number,
  calibrationPixels: number,
  outputPixels: number,
): AvifDurationEstimate {
  const scaledSeconds = Math.max(1, calibrationMs / 1000) * (outputPixels / calibrationPixels);
  const minSeconds = Math.max(15, roundEstimate(scaledSeconds * 0.6));
  const maxSeconds = Math.max(minSeconds + 10, roundEstimate(scaledSeconds * 2));
  return { minSeconds, maxSeconds };
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  if (seconds < 60) return `${seconds} 秒`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds === 0 ? `${minutes} 分钟` : `${minutes} 分 ${remainingSeconds} 秒`;
}

export function formatEstimateRange(estimate: AvifDurationEstimate): string {
  return `约 ${formatDuration(estimate.minSeconds)}～${formatDuration(estimate.maxSeconds)}`;
}
