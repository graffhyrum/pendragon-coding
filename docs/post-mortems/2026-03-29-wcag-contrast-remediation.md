# Post-Mortem: WCAG AA Contrast Remediation

**Date**: 2026-03-29
**Session type**: Thread resume (from handoff.md)
**Commit**: `fix: complete WCAG AA contrast remediation across all pages`

## Executive Summary

Completed WCAG AA color contrast remediation across all 8 pages in both light and dark mode. Started from a handoff document (previous session achieved 3/16 passing). Ended at 16/16 passing.

## What Was Done

1. **Root cause fix**: Moved global `a` link rule from unlayered CSS to `@layer base`, allowing Tailwind utility classes to override the default blue link color. This was the systemic cause of most failures — buttons with `text-white`, cards with `text-green-*`, etc. were all being overridden by the higher-specificity unlayered blue link rule.

2. **Component-level fixes**: Darkened text colors across 7 components (Breadcrumb, Footer, Navigation, BlogPostLayout, 404, index, styles.css) from `text-green-300`/`text-green-600`/`text-green-700` to `text-green-800`/`text-green-900` to meet 4.5:1 contrast ratio on `bg-green-200`.

3. **Third-party overrides**: Added CSS overrides for Shiki code comment colors and GitHub Gist embed colors.

4. **Test infrastructure fix**: Added `disableTransitions()` helper to inject `transition: none !important` before theme toggle, eliminating false failures from mid-transition computed colors (the `transition-colors duration-300` on body was causing axe to read interpolated colors).

## What Went Well

- **Root cause analysis paid off**: Identifying the `@layer base` issue resolved ~80% of failures with a single CSS change, instead of scattering per-element `!important` overrides.
- **Custom audit script**: Writing a standalone Playwright script with fresh contexts per test and transition waits helped diagnose the difference between "real" failures and test infrastructure issues.
- **Iterative approach**: Fix → test → analyze remaining → fix worked efficiently.

## What Could Improve

- **Previous session's test infrastructure had the transition bug from the start**: The 300ms CSS transition on the body was always going to cause dark mode tests to see mid-transition colors. This should have been caught when the test was first written (previous session). A `disableTransitions` pattern is standard for axe-core testing.
- **The outline button class string is duplicated 3 times** across 404.astro and index.astro. Pre-existing duplication but worth extracting to a `.btn-outline-green` CSS class in a future cleanup.

## Follow-up Actions

- [ ] Clean up `handoff.md` and `test-results/` from working directory
- [ ] Consider extracting outline button CSS class (pre-existing duplication across 404/index)
- [ ] Update bead tracker: close beads for completed groups, update remaining bead status
