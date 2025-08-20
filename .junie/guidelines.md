Pendragon Coding — Development Guidelines

Audience: These notes are for contributors familiar with Astro, Tailwind, TypeScript, Bun, and modern web tooling. The focus is on project-specific behaviors and conventions.

1) Environment, Build and Configuration

Prerequisites
- Bun: Primary package manager and runtime. Verified with Bun v1.2.20 during preparation of these notes.
- Node.js: Required by some tooling and IDEs, but daily commands are executed via Bun.
- Git: Version control; Netlify auto-deploys on pushes to the default branch.

Install
- bun install — installs dependencies from package.json and bun.lock.

Core scripts (package.json)
- bun run dev — Starts Astro’s dev server (also aliased as start).
- bun run prebuild — astro check (type and diagnostics check).
- bun run build — astro build (outputs to dist/).
- bun run preview — Serves the built site locally from dist/.
- bun run format — bunx biome format --write .
- bun run lint — bunx biome lint --write . (autofixes where safe).
- bun run check — bunx biome check --write . (combined checks with writes).
- bun run add_changeset — bunx changeset (start a changeset entry).
- bun run version — bunx changeset version (apply versions/changelogs).

Astro configuration
- astro.config.mjs integrates Tailwind via @astrojs/tailwind; no other integrations or adapters configured. Static site by default.
- Netlify: netlify.toml uses command = "bun run build" and publish = "dist". No extra redirects/functions configured.

TypeScript configuration
- tsconfig.json extends astro/tsconfigs/strict for strictness across .astro and TS files.
- Path alias: @assets/* → src/assets/*.
- IDE support: @astrojs/ts-plugin is enabled in compilerOptions.plugins to improve type info inside .astro files.

Tailwind
- tailwind.config.ts: content globs include .astro, .html, .js(x), .ts(x), .vue, .md(x) within src/**. If styles appear missing, confirm file paths are under src/ and match these globs.
- Customization: Only fontFamily extensions currently (display/body → Roboto, sans-serif). No plugins enabled.

Biome (formatter, linter, organize imports)
- Tabs for indentation (formatter.indentStyle = tab).
- JavaScript quoteStyle = 'single'.
- CSS formatting and linting are disabled (CSS authored largely via Tailwind utilities).
- organizeImports.enabled = true.
- files.ignore includes public/**/*.*; Biome won’t act on public/ artifacts.
- Use bun run format and bun run lint before commits; bun run check can be used for a single-step pass.

Versioning and Changelog (Changesets)
- Use bun run add_changeset to create a changeset; follow the prompts.
- After merging multiple changesets, run bun run version to apply version bumps and update CHANGELOG.md. Push the changes.

2) Testing

Current status
- No dedicated third-party test framework is configured in package.json. For fast unit tests, use Bun’s built-in test runner (no extra deps). Astro component or E2E testing (e.g., Vitest/Playwright) is not set up.

How to run tests (Bun)
- Convention: Place tests anywhere named *.test.ts or *.test.js. A tests/ directory at the repo root is a reasonable default.
- Run: bun test
- Watch mode: bun test --watch
- Filter by name: bun test --grep "regex-or-substring"

Minimal example (verified locally)
- Example test file (removed after verification):
  - Path: tests/sample.test.ts
  - Content:
    `import { describe, it, expect } from 'bun:test';
    function add(a: number, b: number) { return a + b; }
    describe('sample math', () => {
      it('adds two numbers', () => {
        expect(add(2, 3)).toBe(5);
      });
    });`
- Command executed: bun test
- Observed: 1 pass, 0 fail using Bun v1.2.20. After validation, the temporary file was deleted to keep the repo clean.

Guidelines for adding tests
- Prefer colocated tests named *.test.ts near the module under test or use a centralized tests/ directory.
- Unit-level tests should use Bun’s test API: import { describe, it, expect } from 'bun:test'.
- Keep tests framework-agnostic; if more advanced assertions/mocking are needed later, consider adding Vitest explicitly and migrating tests incrementally.

Type checks as a gate
- bun run prebuild executes astro check. This performs project-wide diagnostics and is suitable as a fast pre-commit or pre-push guard alongside Biome.

3) Development Conventions & Tips

Astro & Components
- Keep components in src/components and pages in src/pages (standard Astro). Use .astro for UI composition, TypeScript for logic where appropriate.
- Prefer server-first patterns; add client:load/client:idle/client:visible only when interactivity is necessary.
- Asset alias: import static assets via @assets/* to leverage the tsconfig path mapping.

Styling
- Tailwind utilities are preferred; avoid long custom CSS where utilities suffice. Since CSS linting is disabled, rely on Tailwind + component structure to manage styles.
- Fonts: Uses Roboto for display/body; verify the font is available via CSS or system fallback.

Code style
- Tabs for indentation, single quotes for JS/TS, organized imports enforced by Biome.
- Run bun run format and bun run lint before pushing. Fixes are applied in-place due to --write.

Deployment
- Netlify builds with bun run build and publishes dist/. If adjusting output or using adapters, update netlify.toml accordingly.

Troubleshooting
- Missing styles: Ensure files live under src/ and match Tailwind content globs; restart dev server after adding new file types.
- TS/IDE issues inside .astro: Confirm the @astrojs/ts-plugin is active (tsconfig) and your editor supports Astro.
- Build failures on Netlify: Re-run locally with bun run build; verify that Tailwind and Astro versions match package.json and that node/bun versions on Netlify images are compatible.

Appendix: Handy commands
- Start dev: bun run dev
- Type check: bun run prebuild
- Lint/format: bun run check
- Build: bun run build
- Preview build: bun run preview
- Create a changeset: bun run add_changeset
- Apply versions: bun run version
