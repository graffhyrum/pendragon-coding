# Post-Mortem: pendragon-coding-cuw

**Date**: 2026-04-01
**Status**: Completed

## Executive Summary

Bead pendragon-coding-cuw extracted two inline Tailwind class string groups (`bg-green-800 text-green-50` for active buttons, `bg-green-900 text-green-300` for inactive) from `updateButtonStates()` into module-scope `as const` tuple constants. The extraction was clean and targeted — zero simplify findings, zero UBS findings. Expert review surfaced one yellow: the test suite asserts only on `aria-pressed` and DOM order, not on `classList.contains` for the extracted token values. That gap was deferred to bead pendragon-coding-3jb.

## Bead Outcomes

<!-- From: br diff (Phase 0c) -->
- Closed: pendragon-coding-cuw
- Opened: pendragon-coding-3jb (deferred test coverage gap)
- Modified: none

## What Went Well

1. **Mechanical extraction was precise** — spread syntax (`...ACTIVE_BUTTON_CLASSES`) naturally consumed the `as const` tuples with zero type changes needed; no intermediate variables, no shape changes to `updateButtonStates`.
2. **`as const` tuple typing** — the `as const` annotation keeps the literal types (`'bg-green-800'` etc.) rather than broadening to `string[]`, which prevents accidental mutations and documents intent at the type level.
3. **Zero surface-area change** — the diff touches only the declaration site and two call sites; DOM behaviour, public API, and test assertions are identical before and after. Low regression risk.
4. **Expert review caught the right gap at the right tier** — the single yellow (missing `classList.contains` assertions) was correctly deferred rather than silently accepted.

## What Could Improve

1. **Test coverage lagged behind the extracted constants**
   - **Impact**: The named constants `ACTIVE_BUTTON_CLASSES` / `INACTIVE_BUTTON_CLASSES` can drift from the DOM's actual class names without any test failing. The tokens are the specification; tests should pin them.
   - **Mitigation**: When extracting magic values to named constants, immediately add tests that `classList.contains` each token value for both the active and inactive states. This is the natural companion to the extraction — the constant names are only half the story; the values need a test-level anchor too.

## Root Cause Link

<!-- --session-id not provided; section omitted -->

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| `as const` on tuple arrays | Preserves literal types so TypeScript tracks the exact token strings, not `string[]` | Correct — spread accepts `readonly string[]` without widening |
| Defer classList.contains test coverage | Gap is real but low-risk for this tiny bead; creating pendragon-coding-3jb keeps the scope tight | Acceptable — bead created, risk is tracked |
| Module-scope constants (not exported) | These tokens are an implementation detail of `updateButtonStates`; no external consumer needs them | Correct — keeps the module API surface minimal |

## Lessons Learned

### Applicable Everywhere

- **[NEW] When extracting magic values to named constants, add value-pinning tests in the same commit** — the extraction half (renaming the inline literal) and the test half (asserting the value) are coupled. Leaving tests that only exercise behaviour without asserting on the extracted value creates a silent drift window.

### Specific to This Work

- **[NEW] For Tailwind class tokens used in `classList.add/remove`, `classList.contains` assertions are the canonical test anchor** — order-based assertions (first/last item in a list) do not verify which CSS classes were applied. The test must check `.contains('bg-green-800')` etc. directly.

## Remediation

### Remediation Hierarchy (mandatory)

| Tier | Mechanism | Properties | Example |
|------|-----------|------------|---------|
| 1 | **Hook** (PreToolUse / PostToolUse) | Deterministic, zero context cost, always fires | Block `br close` without commits |
| 2 | **Script** (shell/TS in .claude/scripts/) | Deterministic, invoked by hooks or commands | Validate worktree scope |
| 3 | **Skill/command update** | Loaded on demand, structured workflow | Add Phase 0 check to bead-cycle |
| 4 | **CLAUDE.md rule** | Non-deterministic, always-loaded context cost | Last resort only |

For the "missing value-pinning test on constant extraction" pattern:
- **Tier 3 is sufficient** — the `bead-cycle` skill's expert-review phase already catches this at yellow confidence. The lesson is already in the workflow; it just needs to be internalized. A cm-rule is appropriate to inject this reminder in future extraction sessions.
- No hook or script can mechanically enforce "write a test for the value of this constant" — it is a semantic coupling that requires intent.

### Verification

- **pendragon-coding-3jb**: add `classList.contains('bg-green-800')` and `classList.contains('text-green-50')` assertions for the active button state; `classList.contains('bg-green-900')` and `classList.contains('text-green-300')` for inactive. Run `bun test src/scripts/blog-sort.test.ts` — all tests pass.
- **Bypass mode**: test-only bead, no hooks involved. Does not survive `--no-verify` skip but that path is blocked by policy.

### Skill Coverage

<!-- From: ms suggest --machine --cwd . (Phase 0e) -->
Skills relevant to this session: api-integrations, github-cli, data-patterns (low confidence; none closely match this domain)
Skills actually loaded: post-mortem
Gap: no highly-relevant skill suggested for "extract Tailwind tokens to constants" — expected, this is a small mechanical refactor

### Skill Gaps

- No skill gaps identified. The pattern is simple enough that no skill was needed beyond the standard bead-cycle flow.

### Infrastructure Actions (non-rule)

None — bead pendragon-coding-3jb tracks the follow-up test coverage work.

## Follow-up Actions

- [ ] bead pendragon-coding-3jb: add `classList.contains` assertions for `ACTIVE_BUTTON_CLASSES` and `INACTIVE_BUTTON_CLASSES` token values

```bash
# Dedup check before creating bead (already created as pendragon-coding-3jb):
br show pendragon-coding-3jb --json 2>/dev/null | jq -r '.[0].status'
```

## Candidate Rules (for cm reflect)

- **Pattern**: "When extracting magic values to named constants, add value-pinning tests in the same commit — the extraction and the value assertion are coupled invariants" (source: pendragon-coding-cuw post-mortem)

## cm Feedback

No cm rules were directly exercised by this bead's implementation work.

## cm Session Close

```bash
# No cm marks needed — no rules surfaced during implementation
```

## Related Threads

- pendragon-coding-wf5 (refactor: extract reorderPosts and updateButtonStates)
- pendragon-coding-m3c (feat: DOM tests for applySort and initBlogSort)
- pendragon-coding-3jb (follow-up: classList.contains test coverage)
