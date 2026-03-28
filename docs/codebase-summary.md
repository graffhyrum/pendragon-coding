# Codebase Summary

## Directory Structure

```
pendragon-coding/
├── src/
│   ├── assets/              # 13 WebP images (headshots, skill icons, backgrounds)
│   ├── components/          # Reusable Astro components
│   │   ├── content/         # Content rendering: ContentCard, ContentSection, SectionList, Skills
│   │   ├── navigation/      # Navigation, Sidebar
│   │   └── ui/              # Primitives: Card, Skill
│   │   # Root: BlogCard, Card, ContentContainer, Footer, Head, Header,
│   │   #       Navigation, Skill, Skills, ThemeToggle
│   ├── config/              # Runtime constants: site, navigation, htmx, styling
│   ├── content/             # Data files + blog posts
│   │   ├── blog/            # Markdown blog posts (3 posts)
│   │   ├── bookshelf.ts     # Curated reading resources
│   │   ├── myWork.ts        # Portfolio projects
│   │   ├── skills.ts        # 10 skills with icon references
│   │   ├── testimonials.ts  # Professional recommendations
│   │   └── shoutouts.ts     # Content creator acknowledgments
│   ├── content.config.ts    # Astro content collection schemas (Zod)
│   ├── layouts/             # Page layout templates (7 layouts)
│   ├── pages/               # File-based routing
│   │   ├── api/             # HTMX HTML fragment endpoints (6 files)
│   │   └── blog/            # Dynamic blog routes ([...slug].astro)
│   ├── styles/              # styles.css (Tailwind v4 imports, dark mode, responsive)
│   ├── types/               # TypeScript interfaces: ContentTemplate, Layout, Card, Skill
│   └── utils/               # entries.ts + entries.test.ts
├── public/
│   ├── scripts/             # Vendored htmx.min.js
│   └── favicon.svg
├── tests/                   # Bun test files (*.test.ts)
├── docs/                    # Project documentation
├── astro.config.mjs         # Astro + Tailwind Vite plugin
├── .oxlintrc.json           # oxlint linter config
├── .oxfmtrc.json            # oxfmt formatter config
├── netlify.toml             # Netlify deployment config
├── package.json             # Scripts, dependencies (v2.6.1)
└── tsconfig.json            # TypeScript strict config with path aliases
```

## File Inventory by Category

### Pages (19 total)

| Category      | Count  | Files                                                                                |
| ------------- | ------ | ------------------------------------------------------------------------------------ |
| Static pages  | 6      | index, blog, bookshelf, myWork, shoutouts, testimonials                              |
| API endpoints | 6      | home.html, blog.html, bookshelf.html, myWork.html, shoutouts.html, testimonials.html |
| Dynamic       | 1      | blog/[...slug].astro (catch-all for individual blog posts)                           |
| **Total**     | **13** |                                                                                      |

### Layouts (7)

| Layout                       | Role                                                                    | Inherits From |
| ---------------------------- | ----------------------------------------------------------------------- | ------------- |
| **BaseLayout**               | Root HTML shell: `<html>`, Head, Header, `#main-content`, Footer, HTMX  | --            |
| **BlogPostLayout**           | Blog post rendering (title, date, content slot)                         | BaseLayout    |
| **CollectionPageLayout**     | Blog listing page with optional sidebar                                 | BaseLayout    |
| **ContentWithSidebarLayout** | Content pages (bookshelf, myWork, testimonials, shoutouts) with sidebar | standalone\*  |
| **ApiContentLayout**         | HTMX fragment wrapper (no `<html>`, no header/footer)                   | --            |
| **BlogLayout**               | Legacy blog post layout (fragment, no base)                             | --            |
| **MarkdownPostLayout**       | Legacy markdown layout with image support                               | BaseLayout    |

\*ContentWithSidebarLayout renders its own full HTML document (duplicates BaseLayout structure) rather than using `<BaseLayout>` as a wrapper.

### Components (18 .astro files)

| Directory                | Components                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| `components/`            | BlogCard, Card, ContentContainer, Footer, Head, Header, Navigation, Skill, Skills, ThemeToggle |
| `components/content/`    | ContentCard, ContentSection, SectionList, Skills                                               |
| `components/navigation/` | Navigation, Sidebar                                                                            |
| `components/ui/`         | Card, Skill                                                                                    |

Note: Some components exist at both root and subdirectory level (Navigation, Skills, Card, Skill). The subdirectory versions are the organized replacements; root-level copies may be legacy.

### Content Data (6 files + 3 blog posts)

| File              | Exports                             | Type              |
| ----------------- | ----------------------------------- | ----------------- |
| bookshelf.ts      | `ContentTemplate` data              | Curated reading   |
| myWork.ts         | `ContentTemplate` data              | Portfolio items   |
| testimonials.ts   | `ContentTemplate` data              | Recommendations   |
| shoutouts.ts      | `ContentTemplate` data              | Creator shoutouts |
| skills.ts         | Skills array (10 items with icons)  | Skill showcase    |
| content.config.ts | Zod schemas for blog + testimonials | Collection defs   |
| blog/0001.md      | Blog post                           | Markdown          |
| blog/0002.md      | Blog post                           | Markdown          |
| blog/0003.md      | Blog post                           | Markdown          |

### Configuration (4 files)

| File          | Purpose                                               |
| ------------- | ----------------------------------------------------- |
| site.ts       | Site title ("Joshua Pendragon") and meta description  |
| navigation.ts | Nav links array (href + API path + label) for 6 pages |
| htmx.ts       | HTMX target (`#main-content`) and swap mode           |
| styling.ts    | Semantic color, spacing, and typography constants     |

### Types (4 interfaces)

| File               | Exports                                                 |
| ------------------ | ------------------------------------------------------- |
| ContentTemplate.ts | `ContentTemplate` (sections array) and `Link` interface |
| Layout.ts          | Layout-related type definitions                         |
| Card.ts            | Card component prop types                               |
| Skill.ts           | Skill component prop types                              |

### Utils (1 module + test)

| File            | Purpose                               |
| --------------- | ------------------------------------- |
| entries.ts      | Utility functions for content entries |
| entries.test.ts | Tests for entries utilities           |

### Assets (13 WebP images)

Headshots (`headshot.webp`, `headshot_sm.webp`), skill icons (`playwright-logo.webp`, `ts_logo.webp`), background (`green_bg.webp`), and skill category illustrations (accessibility, automation, documentation, leadership, planning, process_improvement, project_management, public_speaking).

## Key Dependencies

| Package                 | Version       | Scope   | Purpose                                  |
| ----------------------- | ------------- | ------- | ---------------------------------------- |
| astro                   | ^5.16.6       | dev     | Static site generator framework          |
| tailwindcss             | ^4.1.18       | dev     | Utility-first CSS framework              |
| @tailwindcss/vite       | ^4.1.18       | dev     | Vite plugin for Tailwind v4              |
| oxlint                  | 1.57.0        | dev     | Code linter (OXC toolchain)              |
| oxfmt                   | 0.42.0        | dev     | Code formatter (OXC toolchain)           |
| typescript              | ^5.9.3        | dev     | TypeScript compiler                      |
| @typescript/native-prev | ^7.0.0-dev    | dev     | Native TS type checker (tsgo)            |
| @types/bun              | ^1.3.5        | dev     | Bun runtime type definitions             |
| happy-dom               | ^20.0.11      | dev     | Lightweight DOM implementation for tests |
| @changesets/cli         | ^2.29.8       | dev     | Version management and changelog         |
| caniuse-lite            | ^1.0.30001760 | dev     | Browser compatibility data               |
| @astrojs/check          | ^0.9.6        | runtime | Astro template diagnostics               |

## External Resources

| Resource     | Source           | Integration                                        |
| ------------ | ---------------- | -------------------------------------------------- |
| Google Fonts | fonts.google.com | Roboto font loaded in Head.astro                   |
| htmx.min.js  | Vendored         | `public/scripts/htmx.min.js`, loaded in BaseLayout |

## See Also

- [System Architecture](system-architecture.md) -- layout hierarchy, HTMX flow, rendering pipeline
- [Project Overview](project-overview-pdr.md) -- technology decisions and rationale
