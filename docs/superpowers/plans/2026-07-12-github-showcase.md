# GitHub Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Cover Atelier repository page into a bilingual, product-focused showcase with clear visuals, accurate privacy messaging, an open-source license, and discoverable GitHub metadata.

**Architecture:** Keep all presentation content in repository-native Markdown and image assets, with English as the root entry point and Chinese in a linked companion README. Preserve the application code unchanged; use GitHub's repository API only for About metadata and topics after the committed files have been verified.

**Tech Stack:** GitHub Flavored Markdown, PNG assets, Git, GitHub CLI/API, existing Vite/Vitest verification commands

---

## File structure

- Create `README.zh-CN.md`: Chinese product-facing README mirroring the English information architecture.
- Modify `README.md`: English product-facing repository entry point.
- Create `LICENSE`: MIT license for reuse and contribution clarity.
- Create `docs/assets/cover-atelier-editor.png`: primary product screenshot copied from the supplied clear desktop capture.
- Create `docs/assets/cover-atelier-export.png`: secondary export-progress screenshot, retained only if it is readable in rendered Markdown.
- Create `docs/assets/cover-atelier-social-preview.png`: 1280 by 640 social-preview artwork prepared from the product screenshot.
- Modify GitHub repository metadata through the API: description, homepage, and topics; no source file stores these settings.

### Task 1: Prepare and inspect visual assets

**Files:**
- Create: `docs/assets/cover-atelier-editor.png`
- Create: `docs/assets/cover-atelier-export.png`
- Create: `docs/assets/cover-atelier-social-preview.png`

- [ ] **Step 1: Create the asset directory**

Run:

```powershell
New-Item -ItemType Directory -Force docs\assets
```

Expected: `docs/assets` exists without changing application files.

- [ ] **Step 2: Copy the supplied screenshots**

Run:

```powershell
Copy-Item -LiteralPath 'C:\Users\Hubujiu\AppData\Local\Temp\codex-clipboard-cbc7ba30-123e-444d-aa6d-54bcd1676695.png' -Destination 'docs\assets\cover-atelier-editor.png'
Copy-Item -LiteralPath 'C:\Users\Hubujiu\AppData\Local\Temp\codex-clipboard-946bb5ac-6825-43f4-bb44-d5fe9959a9d2.png' -Destination 'docs\assets\cover-atelier-export.png'
```

Expected: both files exist and retain their original pixel dimensions.

- [ ] **Step 3: Inspect both images at full resolution**

Use the local image viewer on both assets. Keep `cover-atelier-export.png` only if the modal heading, progress label, and percentage remain readable when the image is displayed at approximately 900 CSS pixels wide; otherwise omit it from both READMEs while retaining it as a future reference asset.

- [ ] **Step 4: Generate the social-preview artwork**

Create a 1280 by 640 PNG using the clear editor screenshot as the only visual source. Use a dark navy background matching the product, a cropped editor view on the right, and this copy on the left:

```text
Cover Atelier
Private, polished blog covers.
Entirely in your browser.
```

Keep text inside a 60-pixel safe area. Do not add feature cards, decorative gradients, fake UI, or claims not present in the product.

- [ ] **Step 5: Verify asset properties**

Run:

```powershell
Add-Type -AssemblyName System.Drawing
Get-ChildItem docs\assets\*.png | ForEach-Object {
  $image = [System.Drawing.Image]::FromFile($_.FullName)
  try { [pscustomobject]@{ Name = $_.Name; Width = $image.Width; Height = $image.Height; Bytes = $_.Length } }
  finally { $image.Dispose() }
}
```

Expected: all files decode successfully and `cover-atelier-social-preview.png` is exactly 1280 by 640.

- [ ] **Step 6: Commit the visual assets**

```powershell
git add docs/assets
git commit -m "docs: add GitHub showcase artwork"
```

### Task 2: Add an explicit open-source license

**Files:**
- Create: `LICENSE`

- [ ] **Step 1: Create the MIT license**

Create `LICENSE` with the canonical MIT text, beginning with:

```text
MIT License

Copyright (c) 2026 Hubujiu
```

and including the complete permission grant and warranty disclaimer from the standard MIT license.

- [ ] **Step 2: Verify GitHub can identify the license**

Run after the file is committed and pushed, or validate locally before push with GitHub's license API after the later repository update. The expected repository license SPDX identifier is `MIT`.

- [ ] **Step 3: Commit the license**

```powershell
git add LICENSE
git commit -m "docs: license Cover Atelier under MIT"
```

### Task 3: Rewrite the English README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the developer-first opening with the product header**

Use this exact opening structure:

```markdown
<div align="center">

# Cover Atelier

**A privacy-first blog cover maker that runs entirely in your browser.**

[Live Demo](https://hubujiu.github.io/cover-atelier/) · [中文说明](./README.zh-CN.md) · [Star the project](https://github.com/Hubujiu/cover-atelier)

</div>

![Cover Atelier editor showing a glassmorphism blog cover preview](./docs/assets/cover-atelier-editor.png)
```

- [ ] **Step 2: Add the concise highlights and workflow**

Add four factual highlights:

- Local by design: images and fonts remain in the current browser session.
- Live editing: title, subtitle, typography, color, and glass-strip controls update the preview immediately.
- Local fonts: system fonts plus TTF, OTF, WOFF, and WOFF2 uploads.
- Flexible export: 1600 by 900 PNG, JPEG, WebP, or AVIF.

Add a three-step workflow: open the live demo, choose a background and edit the cover, export the result.

- [ ] **Step 3: Add privacy, development, roadmap, and license sections**

The privacy section must say that Cover Atelier has no application backend and does not intentionally upload the selected image or font. It must also state that those files remain in the current page session and are discarded when the page is refreshed or closed. Do not claim encryption, permanent offline availability, or zero network requests for the GitHub Pages document itself.

Retain these exact development commands:

```powershell
npm install
npm run dev
npm test
npm run build
```

Use a short roadmap with no dates: cover presets, common platform dimensions, automatic color suggestions, and installable offline/PWA support. Link the existing design and implementation-plan documents from a final development-notes paragraph.

- [ ] **Step 4: Link the MIT license**

End with:

```markdown
## License

[MIT](./LICENSE) © 2026 Hubujiu
```

- [ ] **Step 5: Check links and claims**

Run:

```powershell
rg -n "Live Demo|README.zh-CN.md|docs/assets/cover-atelier-editor.png|PNG|JPEG|WebP|AVIF|MIT" README.md
```

Expected: every required entry appears at least once and all relative targets exist.

- [ ] **Step 6: Commit the English README**

```powershell
git add README.md
git commit -m "docs: turn README into product showcase"
```

### Task 4: Add the Chinese README

**Files:**
- Create: `README.zh-CN.md`

- [ ] **Step 1: Mirror the product header in Chinese**

Use this opening structure:

```markdown
<div align="center">

# Cover Atelier

**一款完全在浏览器中运行、注重隐私的博客封面制作工具。**

[在线体验](https://hubujiu.github.io/cover-atelier/) · [English](./README.md) · [为项目点 Star](https://github.com/Hubujiu/cover-atelier)

</div>

![Cover Atelier 编辑器与玻璃拟态博客封面预览](./docs/assets/cover-atelier-editor.png)
```

- [ ] **Step 2: Mirror the same factual sections**

Write natural Chinese versions of `功能亮点`, `使用方法`, `隐私设计`, `本地开发`, `路线图`, and `许可证`. Preserve the same four highlights, three-step workflow, local-session boundary, commands, roadmap items, and MIT link from `README.md`.

- [ ] **Step 3: Check parity and links**

Run:

```powershell
rg -n "在线体验|README.md|docs/assets/cover-atelier-editor.png|PNG|JPEG|WebP|AVIF|MIT" README.zh-CN.md
```

Expected: every required entry appears and no command or supported format differs from the English README.

- [ ] **Step 4: Commit the Chinese README**

```powershell
git add README.zh-CN.md
git commit -m "docs: add Chinese product README"
```

### Task 5: Verify repository-native presentation

**Files:**
- Verify: `README.md`
- Verify: `README.zh-CN.md`
- Verify: `LICENSE`
- Verify: `docs/assets/*.png`

- [ ] **Step 1: Check Markdown targets and whitespace**

Run:

```powershell
$required = @('README.md', 'README.zh-CN.md', 'LICENSE', 'docs/assets/cover-atelier-editor.png', 'docs/assets/cover-atelier-social-preview.png')
$missing = $required | Where-Object { -not (Test-Path -LiteralPath $_) }
if ($missing) { throw "Missing required files: $($missing -join ', ')" }
git diff --check HEAD~4..HEAD
```

Expected: no missing files and no whitespace errors.

- [ ] **Step 2: Verify the live site**

Run:

```powershell
$response = Invoke-WebRequest -Uri 'https://hubujiu.github.io/cover-atelier/' -UseBasicParsing
if ($response.StatusCode -ne 200) { throw "Live demo returned $($response.StatusCode)" }
```

Expected: HTTP 200.

- [ ] **Step 3: Run the application regression suite**

Run:

```powershell
npm test
npm run build
```

Expected: all Vitest tests pass and the TypeScript/Vite production build exits with code 0.

- [ ] **Step 4: Confirm scope**

Run:

```powershell
git diff --name-only HEAD~4..HEAD
```

Expected: only `README.md`, `README.zh-CN.md`, `LICENSE`, and files under `docs/assets/` appear. The previously approved design and plan documents may appear outside this four-commit range, but no files under `src/` or `public/` may appear.

### Task 6: Update GitHub repository metadata

**Files:**
- Modify remotely: repository description, homepage, and topics

- [ ] **Step 1: Set the description and homepage**

Run:

```powershell
gh api --method PATCH repos/Hubujiu/cover-atelier -f description='Privacy-first blog cover maker with local fonts and PNG, JPEG, WebP, and AVIF export.' -f homepage='https://hubujiu.github.io/cover-atelier/'
```

Expected: the response contains the new `description` and `homepage` values.

- [ ] **Step 2: Set repository topics**

Run:

```powershell
gh api --method PUT repos/Hubujiu/cover-atelier/topics -H 'Accept: application/vnd.github+json' --input - <<'JSON'
{"names":["cover-generator","blog-cover","image-editor","offline-first","privacy-first","glassmorphism","react","typescript","canvas","avif"]}
JSON
```

When executing in PowerShell, provide the same JSON through a PowerShell here-string piped to `gh api --input -` rather than using Bash redirection.

Expected: the response returns the same ten topic names.

- [ ] **Step 3: Re-read and verify metadata**

Run:

```powershell
gh api repos/Hubujiu/cover-atelier --jq '{description, homepage, license: .license.spdx_id}'
gh api repos/Hubujiu/cover-atelier/topics --jq '.names'
```

Expected: the description and homepage match the approved values, the topics contain all ten names, and the license is `MIT` after the commits are pushed.

- [ ] **Step 4: Upload the social preview manually if connector coverage is unavailable**

Open the repository settings page, choose the Social preview edit action, and upload `docs/assets/cover-atelier-social-preview.png`. This is the only manual step; report it as pending if authenticated browser control is unavailable.

### Task 7: Final review and delivery

**Files:**
- Verify all changed presentation files and remote metadata

- [ ] **Step 1: Review the final repository diff**

Run:

```powershell
git status --short
git log -6 --oneline
git diff --stat origin/main..HEAD
```

Expected: the worktree is clean, commits are narrowly scoped, and the diff contains only documentation, license, and image assets.

- [ ] **Step 2: Report exactly what is local versus remote**

State whether commits are only local or have been pushed. Do not claim the public repository README, license detection, or social preview changed until the relevant push or GitHub setting update has succeeded.

