# Configuration Guide

Complete reference for all configuration files in the pendragon-coding project.

## astro.config.mjs

Minimal Astro configuration with Tailwind CSS v4 integration:

```javascript
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Key points:
- Tailwind CSS v4 is integrated via the `@tailwindcss/vite` Vite plugin (not the older `@astrojs/tailwind` integration)
- No explicit TypeScript configuration here -- strictness is inherited from `tsconfig.json`
- No output adapter configured -- the site builds as static HTML

## tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "paths": {
    "@assets/*": ["src/assets/*"]
  },
  "compilerOptions": {
    "types": ["bun-types"],
    "plugins": [
      { "name": "@astrojs/ts-plugin" }
    ]
  }
}
```

| Setting                    | Value                        | Purpose                                      |
| -------------------------- | ---------------------------- | -------------------------------------------- |
| `extends`                  | `astro/tsconfigs/strict`     | Astro's strict TS preset (strictest checks)  |
| `paths.@assets/*`          | `src/assets/*`               | Import alias for image/asset references      |
| `compilerOptions.types`    | `["bun-types"]`              | Bun runtime type definitions                 |
| `compilerOptions.plugins`  | `@astrojs/ts-plugin`         | IDE support for `.astro` files               |

The `astro/tsconfigs/strict` base enables `strict: true`, `strictNullChecks`, `noUncheckedIndexedAccess`, and other strict compiler flags.

## biome.json

Biome v2.3.4 handles all formatting and linting. Full breakdown:

### VCS Integration

```json
{
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  }
}
```

Biome respects `.gitignore` patterns when scanning files.

### File Scope

```json
{
  "files": {
    "ignoreUnknown": false,
    "includes": ["**", "!**/public/**/*.*", "!src/styles/styles.css"]
  }
}
```

- Processes all files by default
- Excludes `public/` directory (static assets served verbatim)
- Excludes `src/styles/styles.css` (Tailwind-generated, not hand-authored)

### Formatter

```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineEnding": "auto"
  }
}
```

### JavaScript/TypeScript

```json
{
  "javascript": {
    "formatter": {
      "quoteStyle": "single"
    }
  }
}
```

Single quotes for all JS/TS string literals.

### CSS

```json
{
  "css": {
    "formatter": { "enabled": false },
    "linter": { "enabled": false },
    "parser": { "tailwindDirectives": true }
  }
}
```

CSS formatting and linting are disabled because Tailwind utility classes produce non-standard CSS that Biome would incorrectly flag. The parser recognizes Tailwind directives (`@tailwind`, `@apply`, `@layer`).

### Import Organization

```json
{
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

Biome automatically organizes and sorts import statements.

### Linter

```json
{
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  }
}
```

The `recommended` ruleset is the only active configuration. No individual rule overrides for standard `.ts`/`.js` files.

### Framework File Overrides

For `.astro`, `.svelte`, and `.vue` files:

```json
{
  "overrides": [{
    "includes": ["**/*.svelte", "**/*.astro", "**/*.vue"],
    "linter": {
      "rules": {
        "style": {
          "useConst": "off",
          "useImportType": "off"
        },
        "correctness": {
          "noUnusedVariables": "off",
          "noUnusedImports": "off"
        }
      }
    }
  }]
}
```

These relaxations prevent false positives from Astro's template compilation model, where frontmatter variables and component imports are consumed in the template but invisible to static analysis.

## tailwind.config.js

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
```

| Setting    | Value      | Purpose                                           |
| ---------- | ---------- | ------------------------------------------------- |
| `content`  | `./src/**` | Scans all source files for Tailwind class usage    |
| `darkMode` | `'class'`  | Dark mode toggled by adding `class="dark"` to `<html>` |
| `theme`    | Default    | No custom theme extensions (uses Tailwind defaults) |
| `plugins`  | None       | No Tailwind plugins installed                      |

The green color scheme used throughout the site comes from Tailwind's built-in green palette (`green-200`, `green-800`, `green-950`, etc.), not from custom theme extensions.

## netlify.toml

```toml
[build]
  command = "bun run build"
  publish = "dist"
  ignore = "exit 0"

[context.production]
  ignore = "exit 0"

[context.branch-deploy]
  ignore = "exit 0"
```

| Setting                 | Value            | Purpose                                      |
| ----------------------- | ---------------- | -------------------------------------------- |
| `build.command`         | `bun run build`  | Runs Astro build with pre-build type checking |
| `build.publish`         | `dist`           | Astro's default output directory              |
| `ignore` (all contexts) | `exit 0`         | Disables Netlify's automatic deploy triggers  |

Auto-deploys are disabled across all contexts. Production deploys happen exclusively through GitHub Actions on version tags, not from branch pushes.

## Changeset Configuration

`.changeset/config.json`:

```json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}
```

| Setting                       | Value                      | Purpose                                      |
| ----------------------------- | -------------------------- | -------------------------------------------- |
| `changelog`                   | `@changesets/cli/changelog` | Default changelog format                    |
| `commit`                      | `false`                    | Changeset version bumps are not auto-committed |
| `access`                      | `restricted`               | Package is not published to npm              |
| `baseBranch`                  | `main`                     | Changesets compare against `main`            |
| `updateInternalDependencies`  | `patch`                    | Internal dep bumps use patch versions        |

## Environment Variables

This project does not use `.env` files. Bun auto-loads `.env` if present, but none exists in the repository.

Secrets are managed through GitHub Actions:

| Secret               | Purpose                        |
| -------------------- | ------------------------------ |
| `NETLIFY_AUTH_TOKEN`  | Netlify deployment API access  |
| `NETLIFY_SITE_ID`    | Target Netlify site identifier |

## Application Config Modules

Runtime configuration is centralized in `src/config/`. These modules export typed constants used by components and layouts.

### site.ts

```typescript
export const SITE_CONFIG = {
  title: 'Joshua Pendragon',
  description: 'Joshua Pendragon -- SDET / QA Engineer. Portfolio, blog, and curated resources.',
} as const;
```

Used by the `<Head>` component for `<title>` and meta description tags.

### navigation.ts

```typescript
export const NAV_LINKS = [
  { href: '/', api: '/api/home.html', label: 'Home' },
  { href: '/bookshelf/', api: '/api/bookshelf.html', label: 'Bookshelf' },
  { href: '/myWork/', api: '/api/myWork.html', label: 'My Work' },
  { href: '/shoutouts/', api: '/api/shoutouts.html', label: 'Shoutouts' },
  { href: '/testimonials/', api: '/api/testimonials.html', label: 'Testimonials' },
  { href: '/blog/', api: '/api/blog.html', label: 'Blog' },
] as const;

export const NAVIGATION_CONFIG = {
  htmx: HTMX_CONFIG,
  links: NAV_LINKS,
} as const;
```

Each link has both a standard `href` (full page navigation) and an `api` path (HTMX partial content endpoint). The `NAVIGATION_CONFIG` bundles links with HTMX settings for the Navigation component.

### htmx.ts

```typescript
export const HTMX_CONFIG = {
  target: '#main-content',
  swap: 'innerHTML transition:true',
} as const;
```

Configures HTMX to swap content into the `#main-content` element with view transitions enabled.

### styling.ts

```typescript
export const STYLING_CONFIG = {
  colors: {
    primary: { light: 'bg-green-200', dark: 'bg-green-950' },
    accent: { light: 'text-green-900', dark: 'text-green-100' },
    border: { light: 'border-green-200', dark: 'border-green-700/80' },
  },
  spacing: {
    container: 'px-4',
    section: 'm-4',
  },
  typography: {
    base: 'font-sans text-gray-900 dark:text-gray-100 leading-loose',
    heading: 'text-4xl',
    subheading: 'text-xl',
    body: 'text-lg',
  },
} as const;
```

Centralizes Tailwind class strings as typed constants. Components import from this module rather than hardcoding class strings, ensuring consistency across the design system.

## See Also

- [Code Standards](code-standards.md) -- formatting rules and quality commands
- [Design Guidelines](design-guidelines.md) -- visual design system built on these configurations
