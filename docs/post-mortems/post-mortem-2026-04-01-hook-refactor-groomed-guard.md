# Post-Mortem: Hook refactor + groomed-status-guard

**Date**: 2026-04-01
**Status**: Completed

## Executive Summary

Session completed the `bead-creation-guard.ts` prefix-extraction fix that began in the prior context, wrote a new `groomed-status-guard.ts` PostToolUse hook, then ran `/quality:simplify-review`. The simplify pass extracted duplicate code into `lib/br-config.ts` and `lib/hook-runtime.ts`; the expert review found two Red findings (missing TTY guard in lib readStdin, `??` operator silently dropping the text fallback in `extractBeadIdFromStdout`) and two Yellow findings that were fixed inline. Final state: 143 tests passing, zero new TS errors.

## Bead Outcomes

<!-- From: br diff (Phase 0c) -->

- Closed: none (hook work is infrastructure, not bead-tracked)
- Opened: none
- Modified: none

## What Went Well

1. **simplify-review caught two silent bugs** — COR-001 (lib `readStdin` lacked TTY guard — all hook consumers would hang if invoked from a terminal) and COR-002 (`??` short-circuit silently discarded the `Created issue:` text fallback when a non-bead JSON `id` field appeared first). Neither was obvious from code review alone.

2. **lib extraction design** — Checking existing lib files before writing new code revealed that `InputParseError`, `NotApplicable`, and `readStdin` were already in `lib/hook-runtime.ts`. Both hooks had independently copy-pasted them. Extracting `getIssuePrefix()` into a new `lib/br-config.ts` completes the shared infrastructure without over-centralizing.

3. **Hook auto-rewrite of groomed-status-guard** — A PostToolUse hook rewrote the initial `groomed-status-guard.ts` design from "auto-transition to open" to "block with exit 2 and direct operator." The new design is strictly better: observable, operator-auditable, and consistent with guard semantics. Accepting the rewrite without reverting was the right call.

4. **`beforeAll` guard for br-config-dependent tests** — The `extractBeadId` tests that call `br config list --json` internally were restructured with `beforeAll` to fetch the project prefix and `if (!brPrefix) return` guards. This makes the integration tests skip gracefully in environments without a configured project rather than failing with confusing errors.

## What Could Improve

1. **State uncertainty from prior-session summary** — The session summary said `extractBeadIdFromStdout` had been rejected and still needed fixing, but the file already had the fix applied. Reading the actual file (not just the summary) before deciding what to do would have saved the initial confusion.
   - **Impact**: A few minutes of unnecessary re-checking and a failed Edit attempt.
   - **Mitigation**: Always read the file before trusting the summary's description of its current state. Summary describes the last _attempted_ edit, not necessarily the current on-disk state.

2. **Pre-existing TS errors in scripts/ discovered late** — The `scripts/bead-creation-guard.test.ts` had pre-existing Effect type errors that only surfaced after `bunx tsc --noEmit`. These were distinct from the files I changed but appeared in the same output.
   - **Impact**: Required a baseline check (`git stash`) to confirm the errors were pre-existing, adding extra steps.
   - **Mitigation**: Run `bunx tsc --noEmit` at session start as part of pre-flight to establish a clean baseline before making changes.

3. **TTY guard placed in consumers instead of the lib** — `groomed-status-guard.ts` added a local `readStdin` with a TTY guard rather than fixing `lib/hook-runtime.ts`. The expert review had to surface this as a Red finding before the fix was applied globally.
   - **Impact**: Any hook using the lib version was silently vulnerable to TTY hangs.
   - **Mitigation**: When writing a hook that duplicates a lib function for safety reasons, the right action is to fix the lib, not add a local override.

## Key Decisions

| Decision                                                       | Rationale                                                                                       | Outcome                                                             |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Extract to `lib/br-config.ts` rather than inline               | `getIssuePrefix` was copy-pasted; a third hook would triple the duplication                     | Clean shared module, both hooks now import                          |
| Add TTY guard to `lib/hook-runtime.ts readStdin`               | Guard needed by all consumers, not just groomed-status-guard                                    | All hooks now safe from TTY hang                                    |
| Fix `extractBeadIdFromStdout` with `candidates.find()`         | `??` only falls back on null, not validation failure; need to try all candidates                | Text fallback now correctly tried when JSON id fails pattern        |
| Accept groomed-status-guard rewrite (block vs auto-transition) | Block + direct is observable and operator-auditable; auto-transition is a silent state mutation | Hook now exit 2 on blocked bead with `br update` command in message |
| Word-boundary regex for `isBrCreate`                           | Plain `includes()` matches `xbr create`; `\b` is consistent with `isGroomedLabelAdd`            | Prevents substring false-positives                                  |

## Lessons Learned

### Applicable Everywhere

- **`??` operator does not provide fallback when the LHS is non-null but fails downstream validation.** If two sources provide candidates that each require validation, use `[a, b].filter(Boolean).find(validate)` rather than `a ?? b`. The `??` pattern only falls back on `null`/`undefined`, not on a value that doesn't pass a later check.

- **TTY guards belong in shared lib functions, not in consumers.** If `Bun.stdin.text()` hangs on a TTY, adding a guard in one hook while others import the unguarded lib version creates an asymmetry that will be missed. Fix the lib; all consumers inherit the fix.

- **When creating a hook that redefines a lib function for a safety reason, treat that as a signal to fix the lib**, not to maintain a local override. A local override is copy-paste that diverges over time.

- **Read the actual file before trusting a summarized description of its state.** Session summaries describe the last _attempted_ edit, which may or may not have been applied. File state is authoritative.

### Specific to This Work

- **Guard hooks should block-and-direct (exit 2) rather than auto-mutate state.** A hook that silently transitions `blocked → open` without operator awareness creates a ghost transition. Exit 2 with a `br update <id> --status open` command gives the operator full control and an audit trail.

- **When writing hooks that call `br config list --json` internally, integration tests must guard on `br` availability.** Use `beforeAll` to fetch the project prefix and `if (!brPrefix) return` guards in tests that require it. This prevents tests from failing in environments without a configured project.

## Remediation

### Remediation Hierarchy (mandatory)

| Tier | Mechanism                | Properties                                     | Example                                                   |
| ---- | ------------------------ | ---------------------------------------------- | --------------------------------------------------------- |
| 1    | **Hook**                 | Deterministic, zero context cost, always fires | groomed-status-guard.ts exits 2 on blocked bead           |
| 2    | **Script**               | Deterministic, invoked by hooks                | lib/br-config.ts shared prefix utility                    |
| 3    | **Skill/command update** | Loaded on demand                               | hook-authoring skill could document TTY guard requirement |
| 4    | **CLAUDE.md rule**       | Non-deterministic, always-loaded               | Last resort only                                          |

**Applied in this session (Tier 1-2)**:

- Added TTY guard to `lib/hook-runtime.ts readStdin()`
- Fixed `extractBeadIdFromStdout` fallback via `candidates.find()`
- Word-boundary regex in `isBrCreate`
- Extracted `lib/br-config.ts`

**Tier 3 — hook-authoring skill update** (deferred):

- The `hook-authoring` skill could be updated to explicitly document: "Always add TTY guard to any function calling `Bun.stdin.text()`" and "Shared lib functions that read stdin must guard against TTY in the lib, not in consumers."

### Verification

- `bun test` in `~/.claude/plugins/agile-workflow/hooks/`: 143 pass, 0 fail ✓
- `bunx tsc --noEmit` at `~/.claude/`: only pre-existing `scripts/` Effect type errors ✓

### Skill Coverage

Skills relevant to this session: hook-authoring, testing-patterns, typescript, bun
Skills actually loaded: hook-authoring (via skill system prompt context)
Gap: typescript skill not explicitly loaded; testing-patterns not loaded

### Skill Gaps

- `hook-authoring` skill: add explicit guidance on TTY guard placement (lib, not consumer)
- `testing-patterns` skill: add note on `beforeAll` guard pattern for integration tests with external CLI dependencies

### Infrastructure Actions (non-rule)

All infrastructure actions were applied in-session:

- `lib/hook-runtime.ts:179` — TTY guard added to `readStdin()`
- `lib/br-config.ts` — new shared module created
- `hooks/bead-creation-guard.ts:309-320` — `candidates.find()` fallback
- `hooks/groomed-status-guard.ts` — new hook registered in `hooks.json`

## Follow-up Actions

- [ ] Update `hook-authoring` skill: document TTY guard rule (guard in lib, not consumer)
- [ ] Fix pre-existing Effect type errors in `scripts/bead-creation-guard.test.ts` (TS2345: `runPromise` requires `never` error channel — use `Effect.orDie` or `Effect.either`)

## Candidate Rules (for cm reflect)

- **Pattern**: "When extracting shared hook code to a lib, fix safety guards (TTY, etc.) in the lib itself — don't leave guards in consumers while the lib is unguarded." (source: this post-mortem)
- **Pattern**: "Use `candidates.filter(Boolean).find(validate)` instead of `a ?? b` when two sources both need validation — `??` only falls back on null, not validation failure." (source: this post-mortem)
- **Pattern**: "Guard hooks should exit 2 and direct the operator (block-and-direct) rather than auto-mutate state — preserves observability and operator audit trail." (source: this post-mortem)

## cm Feedback

[cass: helpful b-mmco5ulf-6hlse7 b-mn8drryl-lukkvv]

## cm Session Close

```bash
cm mark b-mmco5ulf-6hlse7 --helpful --json
cm mark b-mn8drryl-lukkvv --helpful --json
```

## Related Threads

- Prior session: 217bf7d7 (auto-coinforge — source of fixes applied here)
- Session: 0c9dd058-638f-429f-8709-a2e9ce6ec22d (prior half of this work, grooming + initial hook fixes)
