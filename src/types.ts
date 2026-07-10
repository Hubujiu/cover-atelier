export type CoverState = {
  backgroundUrl: string | null;
  backgroundName: string | null;
  title: string;
  subtitle: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  stripWidth: number;
  stripPositionY: number;
  stripOpacity: number;
  blurAmount: number;
  stripRadius: number;
  exportFormat: ExportFormat;
};

export type LocalFont = {
  family: string;
  objectUrl: string;
  fileName: string;
};

export type ExportFormat = "png" | "jpeg" | "webp" | "avif";
