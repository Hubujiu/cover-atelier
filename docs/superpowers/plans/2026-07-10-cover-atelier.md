# Cover Atelier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully local, offline-capable React editor for creating 1600 × 900 blog covers from a local background image, glass title strip, editable copy, local fonts, and PNG export.

**Architecture:** A Vite React TypeScript single-page app keeps one `CoverState` object in the browser. The live editor is DOM/CSS so `backdrop-filter` and responsive layout behave naturally; a separate Canvas renderer consumes the same state for deterministic PNG export. No remote runtime assets, APIs, or persistence are used.

**Tech Stack:** Vite, React, TypeScript, native CSS, Phosphor Icons, Vitest for pure rendering math tests, Canvas 2D, `FontFace` for local font files.

---

## Project layout

- Create `package.json` with scripts for `dev`, `build`, `preview`, and `test`.
- Create `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, and `src/vite-env.d.ts` for the Vite TypeScript app.
- Create `src/types.ts` for the shared `CoverState` and font types.
- Create `src/lib/defaults.ts` for the default state, local font options, and clamp helpers.
- Create `src/lib/coverMath.ts` for cover cropping, line wrapping, and export geometry.
- Create `src/lib/fontLoader.ts` for loading and registering `.ttf`, `.otf`, and `.woff` files with `FontFace`.
- Create `src/lib/exportCover.ts` for the Canvas PNG renderer and local download.
- Create `src/components/EditorShell.tsx` for layout and top-level state.
- Create `src/components/ControlPanel.tsx` for image, text, type, and glass controls.
- Create `src/components/CoverCanvas.tsx` for the CSS live preview.
- Create `src/styles.css` for the dark studio surface, responsive layout, controls, and glass material.
- Create `src/main.tsx` and `src/App.tsx` for app bootstrapping.
- Create `src/lib/coverMath.test.ts` for deterministic crop and wrapping tests.
- Create `.gitignore` and keep `docs/superpowers/specs/2026-07-10-cover-atelier-design.md` in the repository.

## Task 1: Bootstrap the local repository and app shell

**Files:**
- Create: `D:/Workspace/AiProjects/cover-atelier/package.json`
- Create: `D:/Workspace/AiProjects/cover-atelier/index.html`
- Create: `D:/Workspace/AiProjects/cover-atelier/vite.config.ts`
- Create: `D:/Workspace/AiProjects/cover-atelier/tsconfig.json`
- Create: `D:/Workspace/AiProjects/cover-atelier/tsconfig.app.json`
- Create: `D:/Workspace/AiProjects/cover-atelier/tsconfig.node.json`
- Create: `D:/Workspace/AiProjects/cover-atelier/src/vite-env.d.ts`
- Create: `D:/Workspace/AiProjects/cover-atelier/.gitignore`

- [ ] **Step 1: Create the package manifest and scripts.** Use React 18+, Vite, TypeScript, `@vitejs/plugin-react`, `@phosphor-icons/react`, and Vitest. Scripts must be:

```json
{
  "name": "cover-atelier",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: Add Vite and TypeScript configuration.** Configure the React plugin, include `src`, use strict TypeScript, and set `noEmit` for app type-checking. Do not add a network asset alias or runtime proxy.

- [ ] **Step 3: Add the HTML entry and ignore generated files.** The HTML title must be `Cover Atelier`; `.gitignore` must ignore `node_modules`, `dist`, `.vite`, and local editor files.

- [ ] **Step 4: Install dependencies and run the empty build.** Run `npm install`, then `npm run build`. Expected result: exit code 0 and a `dist` directory.

- [ ] **Step 5: Commit the bootstrap.** Run:

```powershell
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json src/vite-env.d.ts .gitignore docs/superpowers/specs/2026-07-10-cover-atelier-design.md
git commit -m "chore: bootstrap cover atelier"
```

## Task 2: Define state, defaults, and pure geometry tests

**Files:**
- Create: `src/types.ts`
- Create: `src/lib/defaults.ts`
- Create: `src/lib/coverMath.ts`
- Create: `src/lib/coverMath.test.ts`

- [ ] **Step 1: Write the failing geometry tests.** Cover these exact behaviors:

```ts
import { describe, expect, it } from "vitest";
import { clamp, getCoverCrop, wrapText } from "./coverMath";

describe("cover geometry", () => {
  it("clamps the strip controls to their valid range", () => {
    expect(clamp(-1, 0, 100)).toBe(0);
    expect(clamp(44, 0, 100)).toBe(44);
    expect(clamp(101, 0, 100)).toBe(100);
  });

  it("crops a landscape source to a 16:9 cover rectangle", () => {
    expect(getCoverCrop(2400, 1200, 1600, 900)).toEqual({
      sx: 0,
      sy: 150,
      sw: 2400,
      sh: 900,
    });
  });

  it("wraps CJK and Latin text without exceeding the max width", () => {
    expect(wrapText("封面标题-1", 120, (value) => value.length * 24)).toEqual([
      "封面",
      "标题-1",
    ]);
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails.** Run `npm test -- src/lib/coverMath.test.ts`. Expected: FAIL because `coverMath.ts` does not yet export the three functions.

- [ ] **Step 3: Implement the state and geometry helpers.** `CoverState` must contain `backgroundUrl`, `backgroundName`, `title`, `subtitle`, `fontFamily`, `fontSize`, `textColor`, `stripWidth`, `stripPositionY`, `stripOpacity`, `blurAmount`, and `stripRadius`. `getCoverCrop` must center-crop any source image to the target ratio. `wrapText` must build lines by measuring each character or word with the provided callback.

- [ ] **Step 4: Add defaults and local font choices.** The defaults must be title `写下你的标题`, subtitle `Add a subtitle or tagline`, `system-ui`, font size `52`, white text, 78% strip width, 50% vertical position, 0.3 opacity, 24px blur, and 24px radius. Font choices must use local stacks only, including system sans, system serif, KaiTi fallback, and monospace.

- [ ] **Step 5: Run the test and verify it passes.** Run `npm test -- src/lib/coverMath.test.ts`. Expected: 3 tests passed.

- [ ] **Step 6: Commit the state foundation.** Run `git add src/types.ts src/lib/defaults.ts src/lib/coverMath.ts src/lib/coverMath.test.ts && git commit -m "feat: add cover state and geometry helpers"`.

## Task 3: Implement local image and font loading

**Files:**
- Create: `src/lib/fontLoader.ts`
- Modify: `src/components/EditorShell.tsx`

- [ ] **Step 1: Implement image selection with object URLs.** Accept PNG, JPEG, and WebP through a hidden file input. Reject files whose MIME type is not supported, set an inline error message, and keep the previous background unchanged. Revoke the previous object URL when a new one is accepted and during component cleanup.

- [ ] **Step 2: Implement local font loading.** `loadLocalFont(file)` must create a family name from the file name, construct `new FontFace(family, `url(${objectUrl})`)`, await `font.load()`, add it to `document.fonts`, and return `{ family, objectUrl }`. Revoke the object URL only after the font has been loaded into the document. Reject unsupported font MIME types and preserve the previously selected font on failure.

- [ ] **Step 3: Add file error and success status.** Errors must be rendered in the control panel, not thrown into the page. Successful image and font selection must update only the relevant state fields and leave title, subtitle, and glass values unchanged.

- [ ] **Step 4: Run type-check and tests.** Run `npm test` and `npm run build`. Expected: all tests pass and TypeScript/build exit with code 0.

- [ ] **Step 5: Commit local asset loading.** Run `git add src/lib/fontLoader.ts src/components/EditorShell.tsx && git commit -m "feat: add local image and font loading"`.

## Task 4: Build the live preview and control panel

**Files:**
- Create: `src/components/EditorShell.tsx`
- Create: `src/components/ControlPanel.tsx`
- Create: `src/components/CoverCanvas.tsx`
- Create: `src/App.tsx`
- Create: `src/main.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Build `CoverCanvas`.** Render a 16:9 preview with an image layer or CSS mountain placeholder. Use one `glass-strip` element whose width and vertical position derive from state. Use `backdrop-filter: blur(var(--blur)) saturate(145%)` plus a semi-transparent white fallback, a 1px border, a top highlight, and an inset shadow. Use `aria-label` on the preview and keep text content selectable only through the controls.

- [ ] **Step 2: Build labelled controls.** Every input must have a visible label above it. Add title and subtitle textareas, font select, local font upload, font size range, color input, strip width range, vertical position range, opacity range, blur range, and radius range. Each range must display its current value using human-readable units.

- [ ] **Step 3: Build `EditorShell` state updates.** Use a single `useState<CoverState>` and an `updateState` helper that merges partial state. Keep the panel controls and preview on the same state object. Use buttons with text labels and Phosphor icons only where an icon improves scanning.

- [ ] **Step 4: Add the desktop and mobile layout.** Desktop uses a compact left panel and larger right canvas. Under 768px, switch to one column with the canvas above the controls. Use `min-height: 100dvh`, CSS Grid, and explicit mobile styles. Do not add a scroll listener.

- [ ] **Step 5: Add the dark studio visual system.** Use off-black navy surfaces, a single muted coral accent for focus and primary action, consistent 14px panel radius and 10px control radius, high-contrast text, visible focus rings, and active button feedback. Do not use remote fonts, remote images, pure black, or purple gradients.

- [ ] **Step 6: Add reduced-motion and transparency fallbacks.** CSS transitions must be disabled under `prefers-reduced-motion: reduce`. Under `prefers-reduced-transparency: reduce`, replace backdrop blur with a more opaque white layer while preserving title contrast.

- [ ] **Step 7: Run the app and inspect the initial state.** Run `npm run dev -- --host 127.0.0.1`, open the local URL, and verify that the placeholder cover, default copy, and every control render without console errors.

- [ ] **Step 8: Commit the editor surface.** Run `git add src/App.tsx src/main.tsx src/components src/styles.css && git commit -m "feat: add cover editor interface"`.

## Task 5: Implement Canvas export

**Files:**
- Create: `src/lib/exportCover.ts`
- Modify: `src/components/EditorShell.tsx`
- Modify: `src/components/CoverCanvas.tsx`

- [ ] **Step 1: Implement background drawing.** `drawCoverImage(ctx, image, width, height)` must use `getCoverCrop` and draw the source image into a 1600 × 900 canvas. A missing background must draw the same CSS-inspired mountain placeholder with Canvas gradients and polygons so export remains usable before upload.

- [ ] **Step 2: Implement glass strip drawing.** Calculate the strip rectangle from width, position, and radius percentages. Clip the rounded rectangle, redraw the cropped background region with a Canvas blur filter when supported, overlay the configured white opacity, draw the border and top highlight, and restore the context afterward.

- [ ] **Step 3: Implement text drawing.** Await `document.fonts.ready`, use the selected family and size, wrap title and subtitle with `wrapText`, center each line, and apply the selected color. Title and subtitle must use separate line heights and a stable vertical gap.

- [ ] **Step 4: Implement local download.** Use `canvas.toBlob`, create an object URL, click a temporary anchor with a date-based filename, then revoke the URL and remove the anchor in a `finally` cleanup. Return a rejected promise with a user-facing error when Canvas or Blob creation fails.

- [ ] **Step 5: Connect the export button.** Disable the button while exporting, show a short inline status, preserve all state on failure, and allow another click after completion.

- [ ] **Step 6: Run tests and build.** Run `npm test` and `npm run build`. Expected: all tests pass, TypeScript succeeds, and Vite emits a production bundle.

- [ ] **Step 7: Commit export support.** Run `git add src/lib/exportCover.ts src/components/EditorShell.tsx src/components/CoverCanvas.tsx && git commit -m "feat: export covers as png"`.

## Task 6: Verify requirements and offline behavior

**Files:**
- Modify: `README.md`
- Modify: `src/styles.css` only if visual QA identifies a concrete issue.

- [ ] **Step 1: Add README instructions.** Document `npm install`, `npm run dev`, `npm run build`, `npm run preview`, supported local file types, and the fact that the built app uses no runtime network requests.

- [ ] **Step 2: Run the full local checks.** Run `npm test`, `npm run build`, and `git status --short`. Expected: tests pass, build exits 0, and only intended source/docs files are tracked.

- [ ] **Step 3: Test the browser workflow.** With the local server running, verify default state, upload of the provided PNG, title editing, font switching, local font loading, glass controls, PNG export, invalid file errors, desktop layout, mobile layout, and reduced-motion rendering.

- [ ] **Step 4: Test the offline artifact.** Run `npm run build`, stop network access if available, serve `dist` with the local preview server, and verify the page still loads, accepts a local image, and exports a local PNG. Inspect the built HTML and JS for accidental `http://` or `https://` asset references.

- [ ] **Step 5: Apply the design pre-flight.** Confirm the page is consistently dark, has one accent, uses one radius scale, has visible focus states, no em-dash copy, no decorative status dots, no remote dependencies, and no runtime scroll listener.

- [ ] **Step 6: Commit documentation and final verified source.** Run `git add README.md docs package.json package-lock.json src index.html vite.config.ts tsconfig*.json .gitignore && git commit -m "docs: document offline cover atelier workflow"`.

## Task 7: Prepare GitHub publishing

**Files:**
- No source changes unless the user supplies a different remote repository name or URL.

- [ ] **Step 1: Confirm the local repository is clean and identify the branch.** Run `git status -sb`, `git log --oneline -5`, and `git branch --show-current`. Expected: branch `main`, all intended work committed, no generated `dist` or `node_modules` tracked.

- [ ] **Step 2: Create or connect the remote only after the target is confirmed.** If no existing remote repository is supplied, use the user-approved name and visibility with `gh repo create`, then set `origin`. If an existing URL is supplied, run `git remote add origin <url>` and verify with `git remote -v`.

- [ ] **Step 3: Push the branch.** Run `git push -u origin main` and record the remote URL and commit SHA.

- [ ] **Step 4: Verify the remote branch.** Run `git ls-remote --heads origin main` and confirm the SHA matches the local `HEAD`.

