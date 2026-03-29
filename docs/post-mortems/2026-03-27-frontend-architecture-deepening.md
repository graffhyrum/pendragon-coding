# Post-Mortem: Frontend Architecture Deepening

**Date**: 2026-03-27
**Scope**: 4-module architecture refactoring + e2e test coverage

## What Was Done

Deepened 4 shallow modules following Ousterhout's "small interface, large hidden implementation" principle:

| Module                | Before                                                  | After                                                 | Bug fixes                                                                            |
| --------------------- | ------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Slug utility**      | 4 copies of same regex in 4 files                       | Single `toSlug()` in `src/utils/slugify.ts`           | Fixed CollectionPageLayout regex ordering bug                                        |
| **Component dedup**   | 4 duplicate component pairs                             | Canonical locations with consistent imports           | Restored missing HTMX navigation + active-page detection; fixed Card mobile overflow |
| **Sidebar dark mode** | 435-line monolith, broken `@media prefers-color-scheme` | ~150 lines, Tailwind `dark:` classes                  | Fixed dark mode not responding to toggle button                                      |
| **Sidebar script**    | 97-line inline `<script>`                               | Extracted `initSidebar()` in `src/scripts/sidebar.ts` | Added `htmx:afterSwap` re-initialization                                             |

**Net change**: -598 lines removed, +618 lines added (including 195 lines of new tests).
**Files deleted**: 5 (4 duplicate components + dead STYLING_CONFIG).
**Tests added**: 37 total (6 slugify + 4 theme sync-guard + 22 e2e + 5 existing).

## What Went Well

1. **Parallel worktree agents** for Modules A and B worked cleanly — no merge conflicts.
2. **Browser-based verification** with Playwright MCP caught real behavior (dark mode toggle, anchor matching, mobile sidebar positioning) before writing tests.
3. **Sweep subagents** caught a real bug (BlogCard slug mismatch) and 5 doc-drift issues that would have shipped stale.
4. **Theme sync-guard tests** — reading source files to verify inline `is:inline` scripts match exported constants is a good pattern for Astro's build-time/runtime split.

## What Could Improve

1. **BlogCard was missed in initial plan** — the slug extraction plan identified 4 files but BlogCard.astro had a 5th variant (`.replace(/ /g, '-')`). The call-site audit sweep caught it, but it should have been found during exploration.
2. **Doc drift is systematic** — the docs/ directory had multiple files referencing deleted code. A pre-commit check for deleted file references in docs would prevent this class of issue.
3. **No visual regression testing** — the Tailwind CSS migration (RGB values to utility classes) was verified by manual browser inspection and structural HTML tests, but color accuracy wasn't pixel-tested. For a portfolio site this is acceptable; for a product it would need visual snapshots.

## Decisions Made

- **Kept `is:inline` scripts as-is** in Head.astro and ThemeToggle.astro rather than trying to import from `theme.ts`. Astro's `is:inline` directive prevents module imports. Added sync-guard tests instead.
- **Kept scrollbar CSS as a `<style>` block** in Sidebar.astro — no Tailwind equivalent exists. Used `:global(.dark)` selector instead of `@media prefers-color-scheme`.
- **Modules C+D combined** into one commit since they both modified Sidebar.astro and are logically coupled.
