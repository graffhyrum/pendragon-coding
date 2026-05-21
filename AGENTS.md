# AGENTS.md

## Commands

- **Dev**: `bun run dev` or `bun run start` (`scripts/run-portless.ts` → portless → https://pendragon-coding.localhost)
- **Dev (direct)**: `bun run dev:app` or `PORTLESS=0 bun run dev:app` (Astro only, no proxy)
- **Build**: `bun run build` (includes type checking)
- **Lint**: `bun run lint` (oxlint auto-fix)
- **Format**: `bun run format` (oxfmt)
- **Check**: `bun run check` (format + lint)
- **Test all**: `bun run test`
- **Test single**: `bun test tests/filename.test.ts`
- **Test watch**: `bun run test:watch`
- **Test coverage**: `bun run test:coverage`
- **Check everything**: `bun vet` (format + lint + test)

## Code Style

- **Indentation**: Tabs
- **Quotes**: Single quotes for JS/TS
- **CSS**: Disabled formatting (Tailwind classes)
- **TypeScript**: Strict mode, path aliases `@assets/*`
- **Imports**: `import type` for interfaces, organize with oxfmt
- **Testing**: Bun test runner, `tests/*.test.ts` files
- **Images**: WebP format
- **Classes**: Revealing modules, no ES6 classes
- **Comments**: None unless requested
- **Error handling**: Standard try/catch, no custom patterns

## Development Notes

- The site uses a custom green color scheme (`bg-green-950`, `text-green-*`)
- HTMX is included for potential interactivity
- Images are processed through Astro's Image component for optimization
- The project uses Changesets for version management and changelog generation
- TypeScript paths are configured for easy asset imports
- oxlint + oxfmt handle all code quality checks (linting and formatting)
- Tests are written using Bun's built-in test runner with the `bun:test` module
- Unit test files should use the `.test.ts` extension
- To be able to use bun, run `npm install -g bun`, then check that it is installed with `bun --version`, and , if
  necessary, if you've installed Bun but are seeing a command not found error, you may have to manually add the
  installation directory (~/.bun/bin) to your PATH.
- Generate a changeset entry for each unit of work completed.

## Voice & Tone

Follow the rules in `docs/voice-dna.md` for all site content. Reference the writing samples (first three blog entries) for voice calibration. The Voice DNA is not optional: it defines how this site sounds, and violating it is a hard fail.

## GitHub CLI Usage

- **PR Description**: Use `--body-file <file>` to set PR descriptions with markdown content. Create a markdown file first, then use `gh pr edit <number> --body-file <file>` for proper formatting. Verify the description was applied correctly with `gh pr view <number>`, then clean up the markdown file.

## Agent Toolkit

### bv — Bead Triage (read-only, use robot flags only)

```bash
bv --robot-triage --format toon | toon -d   # Full triage: priority, health, quick wins
bv --robot-next --format toon | toon -d     # Single top pick
bv --robot-insights --format toon | toon -d # Graph metrics + cycle detection
bv --robot-plan --format toon | toon -d     # Parallel execution tracks
```

Never run bare `bv` — it opens an interactive TUI that blocks the session.

### br — Beads Issue Tracker

```bash
br ready --json                             # Next unblocked issue
br create "<title>" --type bug --priority p0 --label security --json
br update <id> --status in_progress --json
br close <id> --reason "Completed" --json
br list --json
br sync --flush-only                        # Export SQLite → JSONL (no auto git commit)
```

### toon — Token-Optimized Output

Pipe any `--robot-*` output through `toon -d` to decode token-efficient format back to JSON.
Add `--format toon` to bv commands; pipe to `toon -d` before passing to tools.

### ms — Skill Discovery

```bash
ms suggest --machine --cwd .               # Load context-relevant skills before starting
ms search "<query>" -m                     # Find skills by intent
ms load "<skill-name>"                     # Load a skill
```

Always run `ms suggest` at session start before implementing anything novel.

### cass — Session Search

```bash
cass search "<query>" --json --limit 5     # Find prior solutions
cass status                                # Index health check
```

Search before implementing to surface prior work from past sessions.

### gh — GitHub CLI

```bash
gh issue list --state open --json number,title,labels
gh pr create --title "<title>" --body "<body>"
gh pr view <number> --json state,reviews,checks
```

### ubs — Security Scanner

```bash
ubs --format=json --diff .                 # Scan only changed files (fast, for pre-commit)
ubs --format=json .                        # Full scan
ubs --staged                               # Scan staged files only
```

Run `ubs --diff` before every commit. Convert critical/high findings to P0/P1 beads.

### portless — Local dev URLs

Vendored from [vercel-labs/portless](https://github.com/vercel-labs/portless/tree/main/skills/portless) at v0.13.0. Read `.cursor/skills/portless/SKILL.md` (general) and `.cursor/skills/portless/reference.md` (this repo) before changing dev scripts or proxy setup.

- `bun run dev` runs Astro through portless; child processes get `PORTLESS_URL`
- Do not route `bun vet` / Playwright e2e through portless (preview on port 3456)
- Browser automation should open `PORTLESS_URL` or https://pendragon-coding.localhost

## Learned User Preferences

- Prefer Bun/TypeScript scripts over PowerShell for repo maintenance that calls GitHub APIs or must run on Windows without a full git checkout
- Theme-aware UI should use light-first base styles with `dark:` overrides on shared surfaces (cards, controls), not dark-only palettes that ignore `html.dark`
- Cursor `stop` hook runs `bun vet` as a session quality gate; treat vet failures as blocking before ending a session

## Learned Workspace Facts

- Do not use `:` in tracked file paths (including agent-generated distillation filenames); Git for Windows rejects them and blocks `git pull` / checkout on this repo's primary dev machine
- Record domain vocabulary in `UBIQUITOUS_LANGUAGE.md`; this repo does not use `CONTEXT.md`
- Colocate unit tests beside implementation as `src/**/*.test.ts` (there is no top-level `tests/` tree for unit tests)
- Production canonical site URL is `https://pendragon-coding.dev` (`Astro.site` in `astro.config.mjs`)
- Class-based theme toggles `dark` on `<html>`; `src/scripts/theme-init.ts` is the single source for Head inline FOUC script and ThemeToggle (keep toggle/refresh idempotent)
- Blog listing uses `CardList` with `layoutMode="single-column"` (one post per row); myWork/bookshelf/shoutouts use `CardList` grid via SectionList `layoutMode="grid"`
- `.gitattributes` enforces `* text=auto eol=lf`; phantom dirty files on Windows with empty diffs usually mean `core.autocrlf` / index stat drift, not real content changes
- Production: `release.yml` tags `origin/main` at `v*` then `workflow_call` `deploy.yml` (Actions build + Netlify API). `netlify.toml` `ignore = "exit 0"` skips Netlify Git builds on `main` — canceled/skipped Netlify deploys are expected, not build failures
- Manual production deploy: `gh workflow run "Deploy to Production" -f ref=...` (tag or branch); see `.cursor/skills/netlify-cli/` for deploy model details
