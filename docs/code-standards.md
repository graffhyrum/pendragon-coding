# Code Standards

Standards and conventions for the pendragon-coding project (v2.6.1).

## Language and Runtime

- **TypeScript** in strict mode, extending `astro/tsconfigs/strict`
- **Bun** as the JavaScript runtime, package manager, and test runner
- `bun-types` included in `compilerOptions.types` for Bun API type support
- Astro TypeScript plugin (`@astrojs/ts-plugin`) enabled for `.astro` file support
- Native TypeScript checker via `tsgo --noEmit` (from `@typescript/native-preview`)

## Formatting Rules

All formatting is handled by [Biome](https://biomejs.dev/) v2.3.4. The configuration lives in `biome.json`.

| Setting          | Value    |
| ---------------- | -------- |
| Indentation      | Tabs     |
| Line endings     | Auto     |
| JS/TS quotes     | Single   |
| CSS formatting   | Disabled |
| CSS linting      | Disabled |
| Tailwind parsing | Enabled (`tailwindDirectives: true`) |
| Organize imports | Enabled (`source.organizeImports: "on"`) |

### File Exclusions

Biome ignores the following paths:

- `public/**/*.*` -- static files served as-is
- `src/styles/styles.css` -- Tailwind-generated stylesheet

### Linter Rules

Biome's `recommended` ruleset is enabled globally. No custom rule overrides apply to `.ts` or `.js` files.

## Astro-Specific Overrides

For `.astro`, `.svelte`, and `.vue` files, several rules are relaxed because Astro's compilation model can produce false positives:

| Rule                      | Setting | Reason                                      |
| ------------------------- | ------- | -------------------------------------------- |
| `style.useConst`          | Off     | Astro frontmatter `let` bindings are valid   |
| `style.useImportType`     | Off     | Astro processes imports at compile time      |
| `correctness.noUnusedVariables` | Off | Template-referenced vars appear unused to lint |
| `correctness.noUnusedImports`   | Off | Component imports used in templates          |

## Path Aliases

A single path alias is configured in `tsconfig.json`:

```
@assets/* --> src/assets/*
```

Use this alias in component imports to reference images and static assets without relative path navigation:

```typescript
import headshot from '@assets/headshot.webp';
```

## Component Conventions

### Astro Components

Astro components define a `Props` interface in the frontmatter and destructure with defaults:

```astro
---
interface Props {
  title: string;
  variant?: CardVariant;
}

const { title, variant = 'long-form' } = Astro.props;
---
```

- Props interfaces are defined inline in the frontmatter block, not imported from external files
- Default values are applied during destructuring
- Types like `CardVariant` and `LayoutMode` are imported from `src/types/`

### Component Organization

```
src/components/
  content/       -- Content display (ContentSection, SectionList, ContentCard, Skills)
  navigation/    -- Navigation and Sidebar
  ui/            -- Reusable primitives (Card, Skill)
```

Top-level components in `src/components/` handle page-level concerns (Header, Footer, Head, ThemeToggle).

## Content Data Conventions

Structured content uses the `ContentTemplate` interface (`src/types/ContentTemplate.ts`):

```typescript
export interface ContentTemplate {
  sections: Array<{
    title: string;
    subtitle: string;
    layoutMode?: 'grid' | 'single-column';
    content: Array<{
      title: string;
      link: Link[];
      description: string;
    }>;
  }>;
}
```

Content data files in `src/content/` (bookshelf, testimonials, shoutouts, myWork) export arrays or objects conforming to this interface. Blog posts are Markdown files in `src/content/blog/` with YAML frontmatter.

### Type Definitions

All shared types live in `src/types/`:

| File                 | Exports                           |
| -------------------- | --------------------------------- |
| `ContentTemplate.ts` | `ContentTemplate` interface       |
| `Card.ts`            | `CardVariant` type (`'long-form' \| 'short-form'`) |
| `Layout.ts`          | `LayoutMode` type and const enum (`'grid' \| 'single-column'`) |
| `Skill.ts`           | `SkillData` interface             |

## Image Standards

- All images use **WebP format** for optimal compression
- Images are stored in `src/assets/` (13 WebP files)
- Use Astro's `Image` component from `astro:assets` for automatic optimization:

```astro
---
import { Image } from 'astro:assets';
import headshot from '@assets/headshot.webp';
---
<Image src={headshot} alt="Joshua Pendragon" />
```

## Naming Conventions

| Category          | Convention  | Examples                              |
| ----------------- | ----------- | ------------------------------------- |
| Components        | PascalCase  | `ContentCard.astro`, `ThemeToggle.astro` |
| Types/Interfaces  | PascalCase  | `ContentTemplate`, `SkillData`        |
| Config modules    | camelCase   | `site.ts`, `navigation.ts`           |
| Utility functions | camelCase   | `entries.ts`                          |
| Content data      | camelCase   | `bookshelf.ts`, `testimonials.ts`     |
| Assets            | kebab-case  | `headshot.webp`                       |

## Quality Commands

### Individual Commands

| Command            | Purpose                                 |
| ------------------ | --------------------------------------- |
| `bun run format`   | Format code with Biome                  |
| `bun run lint`     | Lint and auto-fix with Biome            |
| `bun run check`    | Comprehensive Biome check (format + lint) |
| `bun run test`     | Run tests with Bun's test runner        |
| `bun run test:watch`    | Tests in watch mode                |
| `bun run test:coverage` | Tests with coverage reporting      |

### Combined Verification

```bash
bun vet
```

Runs the full quality pipeline in sequence: `tsgo --noEmit` (type checking) then `biome check --write .` (format + lint) then `bun test`. Use this as the default verification command before committing.

## Changeset Workflow

This project uses [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

1. After completing a unit of work, create a changeset:
   ```bash
   bunx changeset
   ```
2. Select the change type (major/minor/patch) and write a summary
3. The changeset file is committed alongside the code changes
4. To release: `bunx changeset version` updates `package.json` and `CHANGELOG.md`

Configuration (`.changeset/config.json`):
- Changelog format: `@changesets/cli/changelog`
- Auto-commit: disabled (manual commit required)
- Base branch: `main`
- Access: restricted

## See Also

- [Configuration Guide](configuration-guide.md) -- detailed breakdown of all config files
- [Design Guidelines](design-guidelines.md) -- visual design system and accessibility
