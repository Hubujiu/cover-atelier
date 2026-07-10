import type { CSSProperties } from "react";
import type { CoverState } from "../types";

type CoverCanvasProps = {
  state: CoverState;
};

export function CoverCanvas({ state }: CoverCanvasProps) {
  const style = {
    "--cover-font": state.fontFamily,
    "--strip-width": `${state.stripWidth}%`,
    "--strip-y": `${state.stripPositionY}%`,
    "--strip-opacity": state.stripOpacity,
    "--strip-blur": `${state.blurAmount}px`,
    "--strip-radius": `${state.stripRadius}px`,
  } as CSSProperties;

  return (
    <div className="cover-frame">
      <div className="cover-canvas" style={style} role="img" aria-label="博客封面预览">
        {state.backgroundUrl ? (
          <img className="cover-image" src={state.backgroundUrl} alt="已上传的背景图片" />
        ) : (
          <div className="cover-placeholder" aria-hidden="true" />
        )}
        <div className="cover-scrim" aria-hidden="true" />
        <div className="glass-strip">
          <div className="glass-copy">
            <h2>{state.title || "写下你的标题"}</h2>
            <p>{state.subtitle || "Add a subtitle or tagline"}</p>
          </div>
        </div>
      </div>
      <div className="canvas-caption">
        <span>实时预览</span>
        <span>1600 × 900</span>
      </div>
    </div>
  );
}
