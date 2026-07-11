import { useRef } from "react";
import {
  CheckCircle,
  ImageSquare,
  SlidersHorizontal,
  TextT,
  UploadSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import { localFontOptions } from "../lib/defaults";
import { StyledSelect } from "./StyledSelect";
import type { CoverState, LocalFont } from "../types";

type ControlPanelProps = {
  state: CoverState;
  localFonts: LocalFont[];
  error: string | null;
  notice: string | null;
  onChange: (patch: Partial<CoverState>) => void;
  onImageFile: (file: File) => void;
  onFontFile: (file: File) => void;
};

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  displayValue,
  numberInput,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  displayValue: string;
  numberInput?: {
    ariaLabel: string;
  };
  onChange: (value: number) => void;
}) {
  const handleNumberChange = (value: string) => {
    if (value === "") return;
    const nextValue = Number(value);
    if (Number.isFinite(nextValue)) {
      onChange(Math.min(max, Math.max(min, nextValue)));
    }
  };

  return (
    <label className="range-field">
      <span className="field-label-row">
        <span>{label}</span>
        <output>{displayValue}</output>
      </span>
      {numberInput ? (
        <span className="range-control">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
          />
          <input
            className="range-number"
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-label={numberInput.ariaLabel}
            onChange={(event) => handleNumberChange(event.target.value)}
          />
        </span>
      ) : (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      )}
    </label>
  );
}

export function ControlPanel({
  state,
  localFonts,
  error,
  notice,
  onChange,
  onImageFile,
  onFontFile,
}: ControlPanelProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="control-panel" aria-label="封面设置">
      <div className="panel-intro">
        <div className="panel-kicker">
          <SlidersHorizontal size={15} weight="bold" />
          <span>编辑设置</span>
        </div>
        <p>把一张图片，整理成一张有记忆点的封面。</p>
      </div>

      <section className="control-section">
        <div className="section-heading">
          <ImageSquare size={18} weight="duotone" />
          <h2>背景图片</h2>
        </div>
        <input
          ref={imageInputRef}
          className="visually-hidden"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onImageFile(file);
            event.target.value = "";
          }}
        />
        <button className="upload-button" type="button" onClick={() => imageInputRef.current?.click()}>
          <UploadSimple size={18} weight="bold" />
          <span>{state.backgroundName ? "更换背景图片" : "上传背景图片"}</span>
        </button>
        <p className="field-help">PNG、JPG、WebP 或 AVIF。图片只会留在当前页面中。</p>
        {state.backgroundName && <p className="file-name">{state.backgroundName}</p>}
      </section>

      <section className="control-section">
        <div className="section-heading">
          <TextT size={18} weight="duotone" />
          <h2>标题内容</h2>
        </div>
        <label className="text-field">
          <span>标题</span>
          <textarea
            value={state.title}
            rows={2}
            onChange={(event) => onChange({ title: event.target.value })}
          />
        </label>
        <label className="text-field">
          <span>副标题</span>
          <textarea
            value={state.subtitle}
            rows={2}
            onChange={(event) => onChange({ subtitle: event.target.value })}
          />
        </label>
      </section>

      <section className="control-section">
        <div className="section-heading">
          <span className="section-number">03</span>
          <h2>字体与颜色</h2>
        </div>
        <label className="text-field">
          <span>字体类型</span>
          <StyledSelect
            ariaLabel="字体类型"
            value={state.fontFamily}
            options={[
              ...localFontOptions,
              ...localFonts.map((font) => ({ value: font.family, label: `本地字体：${font.fileName}` })),
            ]}
            onChange={(value) => onChange({ fontFamily: value })}
          />
        </label>
        <input
          ref={fontInputRef}
          className="visually-hidden"
          type="file"
          accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onFontFile(file);
            event.target.value = "";
          }}
        />
        <button className="secondary-button" type="button" onClick={() => fontInputRef.current?.click()}>
          <UploadSimple size={16} weight="bold" />
          上传本地字体
        </button>
        <div className="inline-fields">
          <RangeField
            label="字号"
            value={state.fontSize}
            min={28}
            max={90}
            displayValue={`${state.fontSize}px`}
            onChange={(value) => onChange({ fontSize: value })}
          />
          <label className="color-field">
            <span>文字颜色</span>
            <span className="color-control">
              <input type="color" value={state.textColor} onChange={(event) => onChange({ textColor: event.target.value })} />
              <code>{state.textColor.toUpperCase()}</code>
            </span>
          </label>
        </div>
      </section>

      <section className="control-section">
        <div className="section-heading">
          <span className="section-number">04</span>
          <h2>玻璃横条</h2>
        </div>
        <RangeField
          label="横条宽度"
          value={state.stripWidth}
          min={30}
          max={100}
          displayValue={`${state.stripWidth}%`}
          numberInput={{ ariaLabel: "横条宽度数值" }}
          onChange={(value) => onChange({ stripWidth: value })}
        />
        <RangeField
          label="垂直位置"
          value={state.stripPositionY}
          min={25}
          max={75}
          displayValue={`${state.stripPositionY}%`}
          onChange={(value) => onChange({ stripPositionY: value })}
        />
        <RangeField
          label="透明度"
          value={Math.round(state.stripOpacity * 100)}
          min={10}
          max={70}
          displayValue={`${Math.round(state.stripOpacity * 100)}%`}
          onChange={(value) => onChange({ stripOpacity: value / 100 })}
        />
        <RangeField
          label="模糊程度"
          value={state.blurAmount}
          min={0}
          max={48}
          displayValue={`${state.blurAmount}px`}
          onChange={(value) => onChange({ blurAmount: value })}
        />
        <RangeField
          label="圆角"
          value={state.stripRadius}
          min={10}
          max={42}
          displayValue={`${state.stripRadius}px`}
          onChange={(value) => onChange({ stripRadius: value })}
        />
      </section>

      {(error || notice) && (
        <div className={`status-message ${error ? "status-error" : "status-success"}`} role={error ? "alert" : "status"}>
          {error ? <WarningCircle className="status-icon" size={16} weight="fill" /> : <CheckCircle className="status-icon" size={16} weight="fill" />}
          <span>{error ?? notice}</span>
        </div>
      )}
    </aside>
  );
}
