<div align="center">

# Cover Atelier

**A privacy-first blog cover maker that runs entirely in your browser.**

[Live Demo](https://hubujiu.github.io/cover-atelier/) · [中文说明](./README.zh-CN.md) · [Star the project](https://github.com/Hubujiu/cover-atelier)

</div>

![Cover Atelier editor showing a glassmorphism blog cover preview](./docs/assets/cover-atelier-editor.png)

## Highlights

- **Local by design.** Selected images and fonts remain in the current browser session.
- **Live editing.** Changes to the title, subtitle, typography, color, and glass strip immediately update the preview.
- **Local fonts.** Use installed system fonts or load TTF, OTF, WOFF, and WOFF2 files.
- **Flexible export.** Save a 1600 × 900 cover as PNG, JPEG, WebP, or AVIF.

## Workflow

1. Open the [live demo](https://hubujiu.github.io/cover-atelier/).
2. Choose a background and edit the cover.
3. Export the finished image in your preferred format.

## Privacy

Cover Atelier has no application backend and does not intentionally upload your selected image or font. These files remain in the current page session and are discarded when you refresh or close the page.

## Development

```powershell
npm install
npm run dev
```

```powershell
npm test
npm run build
```

## Roadmap

- Cover presets
- Common platform dimensions
- Automatic color suggestions
- Installable offline/PWA support

## License

[MIT](./LICENSE) © 2026 Hubujiu
