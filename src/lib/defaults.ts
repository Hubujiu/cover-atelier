import type { CoverState } from "../types";

export const defaultCoverState: CoverState = {
  backgroundUrl: null,
  backgroundName: null,
  title: "写下你的标题",
  subtitle: "Add a subtitle or tagline",
  fontFamily: "system-ui",
  fontSize: 52,
  textColor: "#ffffff",
  stripWidth: 78,
  stripPositionY: 50,
  stripOpacity: 0.3,
  blurAmount: 24,
  stripRadius: 24,
};

export const localFontOptions = [
  {
    label: "系统无衬线",
    value: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  {
    label: "系统衬线",
    value: "Georgia, 'Times New Roman', serif",
  },
  {
    label: "楷体风格",
    value: "KaiTi, STKaiti, 'Kaiti SC', serif",
  },
  {
    label: "等宽字体",
    value: "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace",
  },
];
