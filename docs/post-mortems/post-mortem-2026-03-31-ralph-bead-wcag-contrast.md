# Post-Mortem: Ralph Bead Run — WCAG Contrast Remediation

**Date**: 2026-03-31
**Status**: Partial

## Executive Summary

Dispatched ralph-bead to autonomously close WCAG AA contrast remediation beads. 8 of 9 attempted beads closed successfully. One bead (`pendragon-coding-j2u` — 404 page contrast) timed out twice at the 15-minute limit and was reset to open for a future session. The orchestrator was externally killed mid-run (iteration 11) while retrying j2u.

## Bead Outcomes

- Closed: `pendragon-coding-v85`, `pendragon-coding-6hq`, `pendragon-coding-85e`, `pendragon-coding-ovg`, `pendragon-coding-1rb`, `pendragon-coding-lwh`, `pendragon-coding-5rp`, `pendragon-coding-bv6`
- Opened: none (j2u reset to open after timeout)
- Modified: `pendragon-coding-j2u` — in_progress → open (manual reset)

## What Went Well

1. **Parallel bead throughput** — 8 beads closed in ~80 minutes of autonomous execution with no human intervention between iterations.
2. **Timeout recovery** — ralph correctly reset `pendragon-coding-85e` after its first timeout and retried successfully; the pattern worked as designed.
3. **Manual reset correctness** — `br update pendragon-coding-j2u --status open` cleanly returned the timed-out bead to the queue without data loss.

## What Could Improve

1. **Double timeout on j2u** — `pendragon-coding-j2u` (404 page contrast) hit the 15-minute cap twice in succession before the session was killed.
   - **Impact**: Bead remains open; 404 page contrast work is incomplete.
   - **Mitigation**: Before dispatching beads likely to involve extensive E2E test runs, consider increasing ralph's timeout or splitting the bead into smaller units. Review whether j2u's acceptance criteria include an E2E step that causes the extended runtime.

2. **Uncommitted working-tree residue from failed bead** — j2u's partial changes (`src/pages/404.astro`, `src/components/ui/Card.astro`, `src/styles/styles.css`) remain in the working tree after the timeout and kill, blocking a clean working state.
   - **Impact**: Next session starting on a different bead must stash or review these changes.
   - **Mitigation**: ralph's timeout path should inspect and stash or revert partial changes before marking a bead as failed. This prevents cross-bead contamination.

## Key Decisions

| Decision                                      | Rationale                                               | Outcome                                                  |
| --------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| Run ralph with 20 iterations                  | 10 beads in queue; headroom for retries                 | Used 11 iterations (1 retry for 85e, 2 timeouts for j2u) |
| Reset j2u to open rather than closing partial | Incomplete E2E/contrast work shouldn't close as success | Correct — bead stays actionable                          |

## Lessons Learned

### Applicable Everywhere

- **Ralph timeout residue**: When a ralph-dispatched bead times out, partial working-tree changes may remain uncommitted. Before starting a new bead in the same tree, verify `git status --porcelain` is clean or explicitly stash.

### Specific to This Work

- **WCAG remediation beads with E2E gates run long**: Contrast fix beads that include Playwright E2E verification can easily exceed 15 minutes. Either increase ralph's per-bead timeout or split bead into "fix CSS" + "verify E2E" sub-beads.

## Remediation

### Remediation Hierarchy

| Tier | Mechanism      | Proposed Fix                                                                                                |
| ---- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| 3    | Skill update   | ralph-bead skill could document the timeout-residue risk and recommend `git status` check before restarting |
| 4    | CLAUDE.md rule | Not warranted — tier 3 sufficient                                                                           |

### Verification

- **Timeout residue**: After a ralph kill/timeout, run `git status --porcelain` — should show files only from the timed-out bead's scope.
- **j2u reopened**: `br show pendragon-coding-j2u --json | jq '.[0].status'` → `"open"`.

### Skill Coverage

Skills relevant: `agile-workflow:ralph-bead`, `agile-workflow:bead-cycle`
Skills loaded: `agile-workflow:ralph-bead`
Gap: none significant

### Infrastructure Actions

- Working-tree cleanup for j2u partial changes: needs manual `git stash` or review before next unrelated bead.

## Follow-up Actions

- [ ] Investigate why j2u consistently exceeds 15 min (E2E Playwright suite? build step?)
- [ ] Consider splitting j2u if root cause is E2E verification time

## Candidate Rules (for cm reflect)

- **Pattern**: "After a ralph bead timeout/kill, run `git status --porcelain` before starting new work — partial changes from the timed-out bead remain in the working tree" (source: this post-mortem)

## cm Feedback

[cass: helpful b-mmco5ulf-6hlse7]

## cm Session Close

```bash
cm mark b-mmco5ulf-6hlse7 --helpful --json
```

## Related Threads

- `pendragon-coding-j2u` — fix: 404 page link and text contrast in both modes (open, needs retry)
- Prior WCAG remediation session: commits d4f6bab, a9e3bc7, 4531fdd
