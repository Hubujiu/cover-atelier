# Cover Atelier

一个完全离线的博客文章封面编辑器。

它支持：

- 上传本地 PNG、JPG 或 WebP 背景图
- 编辑标题和副标题
- 选择系统字体或上传本地 TTF、OTF、WOFF 字体
- 调整玻璃横条的宽度、位置、透明度、模糊和圆角
- 在浏览器本地导出 1600 × 900 PNG

## 开始使用

需要 Node.js 18 或更高版本。

```powershell
npm install
npm run dev
```

然后打开终端显示的本地地址。

## 构建离线版本

```powershell
npm run build
npm run preview
```

构建产物位于 `dist/`。页面运行时不请求外部图片、字体服务、后端接口或云存储。背景图和字体只存在于当前浏览器页面内存中，导出的 PNG 由本机 Canvas 生成。

## 检查

```powershell
npm test
npm run build
```

设计说明位于 `docs/superpowers/specs/2026-07-10-cover-atelier-design.md`，实施计划位于 `docs/superpowers/plans/2026-07-10-cover-atelier.md`。
