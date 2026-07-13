# Cover Atelier GitHub Showcase Design

## Goal

Turn the repository page into a concise product showcase that helps a first-time visitor understand Cover Atelier, try the live application, and decide whether to star or contribute to the project within a few seconds.

This change affects repository presentation only. It does not change the editor UI, export behavior, runtime dependencies, or application architecture.

## Audience and positioning

The primary audience is bloggers, independent creators, and developers who need attractive article covers without uploading private images or fonts to a remote service.

The primary positioning statement is:

> A privacy-first blog cover maker that runs entirely in your browser.

The supporting differentiators are:

- Images and fonts stay in the current browser session.
- Editing and export require no account or backend.
- Users can preview changes immediately.
- Exports support PNG, JPEG, WebP, and AVIF.

## README information architecture

The root `README.md` will become the English product-facing entry point. It will contain, in order:

1. Product name and one-sentence positioning.
2. Links to the live demo, Chinese documentation, and the repository star action.
3. A clear desktop product screenshot.
4. Four compact product highlights: local privacy, live editing, local fonts, and export formats.
5. A short three-step usage flow.
6. A privacy section that accurately describes in-memory local processing.
7. Development and verification commands.
8. A restrained roadmap based only on plausible next steps, without promising dates.
9. License information.

`README.zh-CN.md` will mirror the same structure in natural Chinese rather than mixing both languages into one long document. Each README will link to the other near the top.

Technical implementation details will remain concise. Existing design and implementation-plan documents will stay linked from the development section rather than occupying the product-facing introduction.

## Visual assets

The supplied clear desktop screenshot will be copied into `docs/assets/` and used as the primary README visual. The export-progress screenshot will be included only if it remains legible at normal README width; otherwise it will be omitted to avoid redundant or blurry presentation.

The primary screenshot will have useful alt text and will be referenced with a repository-relative path so it works in forks and local clones.

A separate 1280 by 640 social-preview image may be prepared from the existing product screenshot and a small amount of brand copy. Because GitHub's social-preview setting is repository metadata rather than a committed repository file, the prepared asset will be delivered in `docs/assets/` and its manual upload step will be documented if it cannot be configured through the available GitHub interface.

## Repository metadata

The repository should use:

- Homepage: `https://hubujiu.github.io/cover-atelier/`
- Description: `Privacy-first blog cover maker with local fonts and PNG, JPEG, WebP, and AVIF export.`
- Topics: `cover-generator`, `blog-cover`, `image-editor`, `offline-first`, `privacy-first`, `glassmorphism`, `react`, `typescript`, `canvas`, and `avif`

These metadata changes will be made only through an authenticated GitHub interface after the file changes are reviewed and verified.

## License

The repository will use the MIT License, with the copyright holder shown as Hubujiu and the current year. Both README files will identify the license and link to the committed `LICENSE` file.

## Quality and verification

The showcase work will be accepted when:

- Both README files render with valid relative links and readable image references.
- The live-demo link resolves to the deployed GitHub Pages site.
- The English and Chinese descriptions make the same factual claims.
- Privacy wording does not imply persistence, encryption, or network guarantees beyond the application's implemented behavior.
- Existing test and production build commands still pass, demonstrating that presentation-only changes did not disturb the application.
- The final repository diff contains no editor UI or runtime behavior changes.

## Out of scope

- Product UI redesign or new editor features.
- PWA support, templates, presets, or additional export formats.
- Automated release publication.
- Community files such as a code of conduct or contribution guide.
- A marketing website separate from the existing GitHub Pages application.
