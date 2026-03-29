# Scout Context — pendragon-coding

**Commit**: a5c433e (2026-03-04)
**Scanned**: 2026-03-27

## Project Profile

- **Type**: Static portfolio/blog (Astro)
- **Version**: 2.6.1
- **Scale**: 222 files, ~3,300 LOC in src/
- **Tech**: Astro 5.16.6, Tailwind CSS v4, TypeScript strict, Bun, Biome 2.3.4
- **Deploy**: Netlify via GitHub Actions (tag-based)

## Source Structure

```
src/
├── components/           12 Astro files
│   ├── content/         4 (ContentSection, SectionList, ContentCard, Skills)
│   ├── navigation/      2 (Navigation, Sidebar-435L)
│   └── ui/              2 (Card, Skill)
├── layouts/             7 (BaseLayout, BlogLayout, BlogPostLayout, MarkdownPostLayout, CollectionPageLayout, ContentWithSidebarLayout, ApiContentLayout)
├── pages/               12 static + 6 API endpoints + 1 dynamic ([...slug])
├── content/             6 data files + 3 blog posts (blog/)
├── config/              4 (site.ts, navigation.ts, htmx.ts, styling.ts)
├── types/               4 (ContentTemplate.ts, Layout.ts, Card.ts, Skill.ts)
├── utils/               1 (entries.ts + entries.test.ts)
├── styles/              1 (styles.css — Tailwind v4 imports)
└── assets/              13 WebP images
```

## Key Patterns

- HTMX navigation: hx-get to /api/\*.html.astro, swap into #main-content
- ContentTemplate: TypeScript interface for structured data (myWork, bookshelf, testimonials, shoutouts)
- Content collections: Blog posts with Zod schema (title, date, description, author, tags)
- Dark mode: class-based, localStorage, Head.astro initialization
- Green theme: bg-green-950 dark, bg-green-200 light

## Dependencies

Runtime: @astrojs/check ^0.9.6
Dev: astro ^5.16.6, tailwindcss ^4.1.18, @tailwindcss/vite ^4.1.18, @biomejs/biome 2.3.4, typescript ^5.9.3, @types/bun ^1.3.5, happy-dom ^20.0.11, @changesets/cli ^2.29.8, @typescript/native-preview ^7.0.0-dev.20251218.3, caniuse-lite ^1.0.30001760
Vendored: htmx.min.js (public/scripts/)

## Signals Detected

- Deployment: .github/workflows/deploy.yml, release.yml, netlify.toml
- Design: UI components, Tailwind CSS, dark mode, accessibility
- Testing: bun:test, happy-dom, 1 test file
- Configuration: config/ directory, biome.json, tsconfig.json, multiple config files
- CI/CD: GitHub Actions (3 workflows)
- Versioning: Changesets with auto-tag flow
