# Post-Mortem: 96fc3e20-8f57-4354-bb42-2822908f62d5

**Date**: 2026-04-01
**Status**: Completed

## Executive Summary

Dispatched Ralph to clear the WCAG contrast queue. Three beads were closed autonomously in ~28 minutes: 404 page contrast (both modes), myWork sidebar contrast, and a Shiki syntax-highlight contrast spike. The spike timed out once (15-min limit) before succeeding on retry. All quality gates passed at close.

## Bead Outcomes

- Closed: pendragon-coding-j2u (404 contrast), pendragon-coding-ute (myWork sidebar), pendragon-coding-3g8 (Shiki SPIKE)
- Opened: none
- Modified: none

## What Went Well

1. **Ralph handled all three beads without intervention** — Zero human touchpoints between dispatch and final report. The spike retry was automatic.
2. **Spike findings were actionable and self-contained** — The spike correctly identified that the CSS override was already applied (comment token ratio 4.77:1), and that remaining failures were in diff-language blocks unused by the blog. Closed cleanly with no follow-on bead required.
3. **/done caught changeset quote drift** — The j2u bead re-introduced single quotes in the changeset YAML. The /done phase caught and fixed it before committing.

## What Could Improve

1. **Spike bead timeout (15 min) is tight for enumeration work**
   - **Impact**: The 3g8 spike hit the 15-minute ceiling on first attempt and had to retry, adding ~15 minutes to total runtime.
   - **Mitigation**: Consider raising spike-type bead timeout to 25 minutes, or flag spike beads with a longer-timeout hint in ralph.ts dispatch logic.

2. **Changeset quote drift from worktree agents**
   - **Impact**: Ralph subprocesses write changesets without inheriting the double-quote convention enforced by prior fix commit.
   - **Mitigation**: The changeset YAML format (`"pkg": patch`) should be enforced by a PostToolUse hook or a pre-commit lint rule on `.changeset/*.md` files.

## Key Decisions

| Decision                                                       | Rationale                                          | Outcome                        |
| -------------------------------------------------------------- | -------------------------------------------------- | ------------------------------ |
| Let Ralph handle all three beads without grooming intervention | All beads were already groomed; queue was clean    | All three closed successfully  |
| Fix changeset quote drift in /done rather than creating a bead | Mechanical one-line fix, no design judgment needed | Fixed inline, no bead overhead |

## Lessons Learned

### Applicable Everywhere

- Spike beads doing enumeration work may need a longer timeout than the default 15-minute ceiling — they legitimately require reading many files before producing output.

### Specific to This Work

- The Shiki contrast investigation confirmed that CSS `::highlight()` overrides are the correct remediation path (Option A), and that only the comment token needed fixing — already done. The remaining two failing token types (`carriage-return`, `markup.ignored`) are not reachable from Astro's blog pages.

## Remediation

### Remediation Hierarchy

1. **Hook (Tier 1)**: Add a PostToolUse hook on `Write` that rejects `.changeset/*.md` files containing single-quoted package names. Pattern: `^'[^']+': (patch|minor|major)`.
   - **Test**: Write a changeset with `'pendragon-coding': patch` — hook should block with exit 2.
   - **Bypass mode**: Survives worktree isolation (hook fires on the parent session's Write).

2. **Script (Tier 2)**: Update ralph.ts dispatch to pass `--timeout 1500000` (25 min) for beads with the `spike` label.
   - **Test**: Dry-run a spike bead and verify the timeout flag appears in the dispatch log.
   - **Bypass mode**: Only applies when dispatched via ralph.ts.

### Skill Coverage

Skills relevant to this session: agile-workflow:ralph-bead, done, post-mortem
Skills actually loaded: agile-workflow:ralph-bead, done, post-mortem
Gap: none

### Infrastructure Actions

- `.claude/hooks/` — add changeset quote linter (PostToolUse on Write, pattern match `.changeset/*.md`)
- `~/.claude/scripts/ralph.ts` — add spike-label timeout override

## Follow-up Actions

- [ ] Hook: changeset YAML quote enforcement (`.changeset/*.md` single-quote → block)
- [ ] Script: ralph.ts spike timeout override (spike label → 25 min)

## Candidate Rules (for cm reflect)

- **Pattern**: "Spike beads with enumeration scope regularly exceed 15-minute ralph timeout — dispatch with extended ceiling or accept one retry" (source: this post-mortem)

## cm Feedback

No cm rules were active for this session.

## Related Threads

- Previous ralph WCAG run: docs/post-mortems/post-mortem-2026-03-31-ralph-bead-wcag-contrast.md
- Spike bead: pendragon-coding-3g8
