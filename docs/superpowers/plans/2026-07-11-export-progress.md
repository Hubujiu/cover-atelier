# Export Progress Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a centered glass export progress modal that reports export stages and closes after the generated file downloads.

**Architecture:** Keep export orchestration in `exportCover`, expose a typed progress callback, and render progress UI in a focused `ExportProgressModal` component. `EditorShell` owns the current progress state, disables repeated export actions, and closes the modal on success or failure.

**Tech Stack:** React 18, TypeScript, Vitest, CSS, Playwright CLI, Vite/GitHub Pages.

---

### Task 1: Define and test export progress stages

**Files:**
- Create: `src/lib/exportProgress.ts`
- Test: `src/lib/exportProgress.test.ts`

- [ ] **Step 1: Write the failing test**

Add a test that imports `getExportProgressStages` and verifies that a background-image export reports the ordered stages `[0, 10, 25, 58, 92, 100]`, with the AVIF encoding label containing `AVIF`.

```ts
import { describe, expect, it } from "vitest";
import { getExportProgressStages } from "./exportProgress";

describe("export progress stages", () => {
  it("returns ordered progress for an AVIF export with a background", () => {
    const stages = getExportProgressStages("AVIF", true);

    expect(stages.map((stage) => stage.value)).toEqual([0, 10, 25, 58, 92, 100]);
    expect(stages[3].label).toContain("AVIF");
  });

  it("skips image loading when no background is selected", () => {
    const stages = getExportProgressStages("PNG", false);

    expect(stages.map((stage) => stage.value)).toEqual([0, 25, 58, 92, 100]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/exportProgress.test.ts`

Expected: FAIL because `src/lib/exportProgress.ts` does not exist.

- [ ] **Step 3: Implement the progress-stage module**

Create the shared type and deterministic stage builder:

```ts
export type ExportProgress = {
  value: number;
  label: string;
};

export type ExportProgressStage = ExportProgress & {
  key: "prepare" | "load-image" | "draw" | "encode" | "download" | "complete";
};

export function getExportProgressStages(formatLabel: string, hasBackground: boolean): ExportProgressStage[] {
  const stages: ExportProgressStage[] = [
    { key: "prepare", value: 0, label: "准备画布" },
  ];

  if (hasBackground) {
    stages.push({ key: "load-image", value: 10, label: "正在加载背景图片" });
    stages.push({ key: "draw", value: 25, label: "正在绘制背景、玻璃横条和文字" });
  } else {
    stages.push({ key: "draw", value: 25, label: "正在绘制默认背景、玻璃横条和文字" });
  }

  stages.push(
    { key: "encode", value: 58, label: `正在编码 ${formatLabel}` },
    { key: "download", value: 92, label: "正在准备下载文件" },
    { key: "complete", value: 100, label: "导出完成" },
  );

  return stages;
}
```

- [ ] **Step 4: Run the focused test**

Run: `npm test -- src/lib/exportProgress.test.ts`

Expected: 2 tests pass.

- [ ] **Step 5: Commit the progress-stage module**

```powershell
git add src/lib/exportProgress.ts src/lib/exportProgress.test.ts
git commit -m "test: define export progress stages"
```

### Task 2: Report progress from the export pipeline

**Files:**
- Modify: `src/lib/exportCover.ts`
- Test: `src/lib/exportProgress.test.ts`

- [ ] **Step 1: Extend the export function contract in the test**

Add a test-level expectation documenting that the caller receives `ExportProgress` objects from the stage list; use `getExportProgressStages` as the shared source so the callback and modal use the same labels and percentages.

```ts
it("exposes labels for every stage", () => {
  const stages = getExportProgressStages("WebP", true);

  expect(stages.every((stage) => stage.key && stage.label.length > 0)).toBe(true);
});
```

- [ ] **Step 2: Run the test to verify the new expectation**

Run: `npm test -- src/lib/exportProgress.test.ts`

Expected: PASS before changing the export pipeline because the stage model already supplies the typed events.

- [ ] **Step 3: Add the progress callback to `exportCover`**

Import `ExportProgress`, `ExportProgressCallback` (a function type `(progress: ExportProgress) => void`), and `getExportProgressStages`. Change the signature to:

```ts
export async function exportCover(
  state: CoverState,
  onProgress: ExportProgressCallback = () => undefined,
): Promise<void>
```

Inside the function, select the stage list with `getExportProgressStages(config.label, Boolean(state.backgroundUrl))`, report the first stage immediately, report the image-loading stage before `loadImage`, report the draw stage after `drawBackground` and `drawGlassStrip`/text drawing, report the encode stage before `encodeAvif` or `canvas.toBlob`, report the download stage after the blob is ready, and report the complete stage immediately after triggering the download. When no background exists, skip the image-loading stage. Do not change the existing image composition or encoding settings.

- [ ] **Step 4: Run the full unit test suite and build**

Run: `npm test; npm run build`

Expected: all existing tests pass and the production build succeeds.

- [ ] **Step 5: Commit the export callback**

```powershell
git add src/lib/exportProgress.ts src/lib/exportProgress.test.ts src/lib/exportCover.ts
git commit -m "feat: report export progress stages"
```

### Task 3: Build the modal component with an accessibility test

**Files:**
- Create: `src/components/ExportProgressModal.tsx`
- Create: `src/components/ExportProgressModal.test.tsx`

- [ ] **Step 1: Write the failing static-render test**

Render the component with a 58% AVIF progress object and assert the dialog, filename, progressbar semantics, percentage, and stage label are present:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ExportProgressModal } from "./ExportProgressModal";

describe("ExportProgressModal", () => {
  it("renders the export filename and accessible progress state", () => {
    const markup = renderToStaticMarkup(
      <ExportProgressModal
        fileName="背包问题-1.avif"
        formatLabel="AVIF"
        progress={{ value: 58, label: "正在编码 AVIF" }}
      />,
    );

    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-modal="true"');
    expect(markup).toContain("背包问题-1.avif");
    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('aria-valuenow="58"');
    expect(markup).toContain("正在编码 AVIF");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/ExportProgressModal.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the modal component**

Use props `{ fileName: string; formatLabel: string; progress: ExportProgress }`. Render a fixed backdrop, a glass card, a title “正在导出封面”, the format label, an ellipsized filename with the full name in `title`, the stage label, the percentage, and a `role="progressbar"` element whose `aria-valuenow` and inner fill width use `progress.value`.

- [ ] **Step 4: Run the focused component test**

Run: `npm test -- src/components/ExportProgressModal.test.tsx`

Expected: 1 test passes.

- [ ] **Step 5: Commit the modal component**

```powershell
git add src/components/ExportProgressModal.tsx src/components/ExportProgressModal.test.tsx
git commit -m "feat: add export progress modal"
```

### Task 4: Connect the modal to `EditorShell`

**Files:**
- Modify: `src/components/EditorShell.tsx`

- [ ] **Step 1: Add typed progress state**

Import `ExportProgressModal`, `getExportFilename`, `getExportConfig`, and `ExportProgress`. Add:

```tsx
const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
```

- [ ] **Step 2: Wire progress into `handleExport`**

At export start, set `setExportProgress({ value: 0, label: "准备字体" })`; after `document.fonts.ready`, call `exportCover(state, setExportProgress)`. Keep the existing `isExporting` guard and error handling. In `finally`, set `setExportProgress(null)` and `setIsExporting(false)` so the modal closes on both success and failure.

- [ ] **Step 3: Render the modal with the current filename**

Before the closing root `</div>`, render the modal only when `exportProgress` is non-null:

```tsx
{exportProgress && (
  <ExportProgressModal
    fileName={getExportFilename(state.title, getExportConfig(state.exportFormat).extension)}
    formatLabel={getExportConfig(state.exportFormat).label}
    progress={exportProgress}
  />
)}
```

The existing export button remains disabled through `isExporting`; the fixed backdrop prevents editing while the export is running.

- [ ] **Step 4: Run the full test suite and production builds**

Run: `npm test; npm run build; npm run build:pages; git diff --check`

Expected: all tests pass, both builds succeed, and there are no whitespace errors.

### Task 5: Style and verify the complete flow

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add the modal styles**

Add `.export-progress-backdrop`, `.export-progress-modal`, `.export-progress-header`, `.export-progress-format`, `.export-progress-file`, `.export-progress-meta`, `.export-progress-track`, `.export-progress-fill`, and `.export-progress-note` styles. Use a fixed full-screen dark translucent backdrop with `backdrop-filter`, a dark rounded glass card, coral progress fill, mobile-safe width `min(420px, calc(100vw - 32px))`, and `overflow-wrap:anywhere` for long filenames. Add a reduced-motion rule that disables the fill shimmer animation.

- [ ] **Step 2: Run local browser verification**

Start the app with `npm run dev -- --host 127.0.0.1 --port 4175`, open `http://127.0.0.1:4175/`, set the export format to AVIF, and click export. Verify that the modal shows the AVIF filename, percentage, progressbar semantics, and the “正在编码 AVIF” stage; verify the modal disappears after the download completes.

- [ ] **Step 3: Run final validation**

Run: `npm test; npm run build; npm run build:pages; git diff --check`

Expected: all tests pass and both builds succeed.

- [ ] **Step 4: Commit and publish**

```powershell
git add src/components/EditorShell.tsx src/components/ExportProgressModal.tsx src/components/ExportProgressModal.test.tsx src/lib/exportCover.ts src/lib/exportProgress.ts src/lib/exportProgress.test.ts src/styles.css
git commit -m "feat: show export progress modal"
git push origin main
```

- [ ] **Step 5: Verify GitHub Pages deployment**

Run `gh run list --repo Hubujiu/cover-atelier --workflow deploy-pages.yml --limit 1` and `gh run watch <run-id> --repo Hubujiu/cover-atelier --exit-status`. Then open `https://hubujiu.github.io/cover-atelier/?v=<commit>` and trigger an AVIF export to verify the deployed modal.
