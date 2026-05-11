# AGENTS.md

## Commands

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
