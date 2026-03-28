# Project Overview and Decision Record

## Project Identity

| Field       | Value                                                                 |
| ----------- | --------------------------------------------------------------------- |
| Name        | pendragon-coding                                                      |
| Version     | 2.6.1                                                                 |
| Owner       | Joshua Pendragon (graffhyrum)                                         |
| Live URL    | [pendragon-coding.netlify.app](https://pendragon-coding.netlify.app)  |
| Repository  | GitHub (graffhyrum/pendragon-coding)                                  |
| Description | Personal portfolio and blog for an SDET / QA Engineer                 |

The site showcases Joshua Pendragon's professional experience as a Software Development Engineer in Test. It includes a skills showcase, portfolio of work, curated bookshelf, testimonials, shoutouts to content creators, and a blog -- all rendered as a static site with HTMX-powered client-side navigation.

## Technology Stack

| Tool / Library          | Version        | Purpose                                              |
| ----------------------- | -------------- | ---------------------------------------------------- |
| Astro                   | ^5.16.6        | Static site generator (framework)                    |
| Tailwind CSS            | ^4.1.18        | Utility-first CSS framework                          |
| @tailwindcss/vite       | ^4.1.18        | Vite plugin for Tailwind v4 integration              |
| TypeScript              | ^5.9.3         | Static typing                                        |
| @typescript/native-prev | ^7.0.0-dev     | Native TS type checker (`tsgo`) for faster prebuild  |
| Bun                     | (runtime)      | JavaScript runtime, package manager, test runner     |
| @types/bun              | ^1.3.5         | Type definitions for Bun APIs                        |
| Biome                   | 2.3.4          | Linter and formatter (tabs, single quotes)           |
| @changesets/cli         | ^2.29.8        | Versioning and changelog generation                  |
| @astrojs/check          | ^0.9.6         | Astro template type checking                         |
| happy-dom               | ^20.0.11       | Lightweight DOM for tests                            |
| caniuse-lite            | ^1.0.30001760  | Browser compatibility data (Tailwind dependency)     |
| HTMX                    | (vendored)     | HTML-over-the-wire client-side navigation            |

## Project Decision Record (PDR)

### PDR-1: Astro over Next.js / Gatsby

**Decision**: Use Astro as the site framework.

**Context**: The site is a personal portfolio with static content. There is no user authentication, no database, and no server-side state. Content changes are infrequent and tied to releases.

**Rationale**:
- Astro ships zero JavaScript by default. Pages are pure HTML unless a component explicitly opts into client-side hydration. For a content-heavy portfolio, this means faster page loads and a smaller bundle.
- Astro's file-based routing and content collections provide a straightforward mapping from directory structure to URL paths.
- Next.js and Gatsby carry SSR/ISR infrastructure that would be dead weight here. Gatsby's GraphQL data layer adds complexity for what amounts to importing TypeScript arrays.

**Consequence**: Content is defined as TypeScript data files (`bookshelf.ts`, `skills.ts`, etc.) and Markdown (blog posts), both consumed directly by Astro components at build time.

### PDR-2: HTMX for client-side navigation

**Decision**: Use HTMX to swap page content without full-page reloads.

**Context**: Navigation links point to both a full page (`/bookshelf/`) and a parallel API endpoint (`/api/bookshelf.html`) that returns the same content as an HTML fragment (no `<html>`, `<head>`, or layout chrome).

**Rationale**:
- HTMX provides SPA-like navigation (smooth transitions, no white flash) using standard HTML attributes (`hx-get`, `hx-target`, `hx-swap`) rather than a JavaScript framework.
- Progressive enhancement: if HTMX fails to load, the `href` on each link still works as a normal navigation. Every page has a full-page equivalent.
- The vendored `htmx.min.js` in `public/scripts/` avoids a CDN dependency and locks the version.

**Consequence**: Every navigable page has a corresponding `api/*.html.astro` endpoint that renders through `ApiContentLayout` (a layout with no header/footer/scripts). The HTMX config is centralized in `src/config/htmx.ts` with target `#main-content` and swap mode `innerHTML transition:true`.

### PDR-3: Bun over Node

**Decision**: Use Bun as the project runtime.

**Rationale**:
- Bun's built-in test runner (`bun test`) eliminates the need for Jest or Vitest. Tests use `bun:test` imports directly.
- Bun natively runs TypeScript files without a separate compilation step.
- Package installation is faster than npm/yarn/pnpm.
- The `vet` script (`bun typecheck && bun check && bun test`) runs all quality gates in a single command.

**Consequence**: All scripts in `package.json` use `bun` or `bunx`. The project has no `node_modules/.bin` scripts that depend on Node-specific behavior.

### PDR-4: Biome over ESLint + Prettier

**Decision**: Use Biome as the single tool for formatting and linting.

**Rationale**:
- Biome replaces two tools (ESLint for linting, Prettier for formatting) with one, eliminating configuration conflicts between them.
- Biome is written in Rust and runs faster than the JavaScript-based alternatives.
- Configuration is a single `biome.json` file. The project uses tabs for indentation and single quotes for strings.

**Consequence**: CSS formatting is disabled in Biome (Tailwind utility classes don't benefit from CSS formatting rules). The `check` script runs both lint and format passes in one invocation.

### PDR-5: ContentTemplate pattern over a CMS

**Decision**: Define portfolio content as TypeScript data files conforming to the `ContentTemplate` interface, rather than using a headless CMS.

**Context**: Content sections (bookshelf, testimonials, shoutouts, my work) share a common structure: sections with titles, subtitles, and arrays of items that have a title, description, and links.

**Rationale**:
- Type safety: the `ContentTemplate` interface enforces structure at compile time. A CMS would require runtime validation.
- No external dependency: content lives in the repository, versioned with Git, reviewed in PRs.
- The shared interface enables reusable rendering components (`ContentSection`, `SectionList`, `ContentCard`) that work identically across all content pages.

**Consequence**: Adding a new content page means creating a `.ts` file that exports a `ContentTemplate`, a full page that uses `ContentWithSidebarLayout`, and an API endpoint that uses `ApiContentLayout`.

### PDR-6: Tailwind v4 with class-based dark mode

**Decision**: Use Tailwind CSS v4 with Vite plugin integration and class-based dark mode strategy.

**Rationale**:
- Tailwind v4 uses CSS-native `@import` and `@theme` directives instead of a `tailwind.config.js`, reducing configuration surface.
- Class-based dark mode (`dark:` prefix activated by a class on `<html>`) allows theme persistence via `localStorage`. A script in `Head.astro` reads the stored preference before first paint to prevent FOUC.
- The custom green color scheme (`bg-green-950`, `text-green-100`, etc.) is applied directly through Tailwind utilities -- no custom theme extension needed.

**Consequence**: Styling configuration is split between `src/styles/styles.css` (Tailwind imports, custom overrides) and `src/config/styling.ts` (semantic color/spacing/typography constants used in components).

### PDR-7: Tag-based deployment via Changesets

**Decision**: Use tag-based deployment through Changesets rather than continuous deployment from `main`.

**Rationale**:
- Controlled releases: changes accumulate on `main` and ship together when a version is explicitly bumped.
- Changesets generates a structured `CHANGELOG.md` from individual changeset entries, providing a human-readable release history.
- The deployment trigger is a Git tag, not a push to `main`. This decouples "merge to main" from "deploy to production."

**Consequence**: Contributors run `bun run add_changeset` for each unit of work. The `bun run version` command consumes pending changesets, bumps `package.json`, and updates the changelog. Netlify deploys are triggered by tag-based GitHub Actions, not by branch pushes.

## See Also

- [System Architecture](system-architecture.md) -- layout hierarchy, HTMX flow, content data pipeline
- [Codebase Summary](codebase-summary.md) -- file inventory, dependency table, directory structure
