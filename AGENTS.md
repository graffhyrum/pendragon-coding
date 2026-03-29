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

<!-- bv-agent-instructions-v1 -->

---

## Beads Workflow Integration

This project uses [beads_rust](https://github.com/Dicklesworthstone/beads_rust) (br) for issue tracking. Issues are stored in `.beads/` (SQLite + JSONL) and tracked in git.

### Essential Commands

```bash
# View issues (launches TUI - avoid in automated sessions)
bv

# CLI commands for agents (use these instead)
br ready              # Show issues ready to work (no blockers)
br list --status=open # All open issues
br show <id>          # Full issue details with dependencies
br create --title="..." --type=task --priority=2
br update <id> --status=in_progress
br close <id> --reason="Completed"
br close <id1> <id2>  # Close multiple issues at once
br sync --flush-only  # Export SQLite → JSONL (does NOT auto-commit to git)
```

### Workflow Pattern

1. **Start**: Run `br ready` to find actionable work
2. **Claim**: Use `br update <id> --status=in_progress`
3. **Work**: Implement the task
4. **Complete**: Use `br close <id>`
5. **Sync**: Run `br sync --flush-only` then `git add .beads/ && git commit`

### Key Concepts

- **Dependencies**: Issues can block other issues. `br ready` shows only unblocked work.
- **Priority**: P0=critical, P1=high, P2=medium, P3=low, P4=backlog (use numbers, not words)
- **Types**: task, bug, feature, epic, question, docs
- **Blocking**: `br dep add <issue> <depends-on>` to add dependencies

### Session Protocol

**Before ending any session, run this checklist:**

```bash
git status              # Check what changed
git add <files>         # Stage code changes
br sync --flush-only    # Export beads to JSONL
git add .beads/         # Stage beads changes
git commit -m "..."     # Commit code + beads
git push                # Push to remote
```

### Best Practices

- Check `br ready` at session start to find available work
- Update status as you work (in_progress → closed)
- Create new issues with `br create` when you discover tasks
- Use descriptive titles and set appropriate priority/type
- Always `br sync --flush-only` + `git add .beads/` before ending session

<!-- end-bv-agent-instructions -->

<!-- BEGIN BEADS INTEGRATION -->

## Issue Tracking with br (beads)

**IMPORTANT**: This project uses **br (beads_rust)** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Why br?

- Dependency-aware: Track blockers and relationships between issues
- SQLite-backed: Fast local queries, no daemon required
- Agent-optimized: JSON output, ready work detection, discovered-from links
- Explicit sync: br never touches git — you control when to commit
- Prevents duplicate tracking systems and confusion

### Quick Start

**Check for ready work:**

```bash
br ready --json
```

**Create new issues:**

```bash
br create "Issue title" --description="Detailed context" -t bug|feature|task -p 0-4 --json
br create "Issue title" --description="What this issue is about" -p 1 --deps discovered-from:<parent-id> --json
```

**Claim and update:**

```bash
br update <id> --claim --json
br update <id> --priority 1 --json
```

**Complete work:**

```bash
br close <id> --reason "Completed" --json
```

### Issue Types

- `bug` - Something broken
- `feature` - New functionality
- `task` - Work item (tests, docs, refactoring)
- `epic` - Large feature with subtasks
- `chore` - Maintenance (dependencies, tooling)

### Priorities

- `0` - Critical (security, data loss, broken builds)
- `1` - High (major features, important bugs)
- `2` - Medium (default, nice-to-have)
- `3` - Low (polish, optimization)
- `4` - Backlog (future ideas)

### Workflow for AI Agents

1. **Check ready work**: `br ready` shows unblocked issues
2. **Claim your task atomically**: `br update <id> --claim`
3. **Work on it**: Implement, test, document
4. **Discover new work?** Create linked issue:
   - `br create "Found bug" --description="Details about what was found" -p 1 --deps discovered-from:<parent-id>`
5. **Complete**: `br close <id> --reason "Done"`

### Sync Model

br uses an explicit two-step sync — it never auto-commits to git:

- `br sync --flush-only` — exports SQLite database to `.beads/issues.jsonl`
- `br sync --import-only` — imports `.beads/issues.jsonl` into SQLite (after git pull)
- You must `git add .beads/` and commit manually after flushing

### Important Rules

- Use br for ALL task tracking
- Always use `--json` flag for programmatic use
- Link discovered work with `discovered-from` dependencies
- Check `br ready` before asking "what should I work on?"
- Do NOT create markdown TODO lists
- Do NOT use external issue trackers
- Do NOT duplicate tracking systems

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   br sync --flush-only
   git add .beads/
   git add <other files>
   git commit -m "..."
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

<!-- END BEADS INTEGRATION -->
