---
title: 'refactor: Replace HTMX navigation with Astro View Transitions'
type: refactor
status: active
date: 2026-03-27
origin: docs/brainstorms/2026-03-27-view-transitions-migration-requirements.md
---

# refactor: Replace HTMX navigation with Astro View Transitions

## Overview

Remove HTMX as the site's navigation layer and replace it with Astro's built-in `<ClientRouter />` View Transitions component. This eliminates 6 API fragment endpoints, the htmx.min.js payload (~47KB), the dual-endpoint maintenance burden, and the fragile htmx:afterSwap reinit pattern. Navigation becomes standard `<a href>` links with cross-fade transitions handled by the framework.

## Problem Frame

The site uses HTMX to achieve SPA-like page navigation, requiring every content page to have both a full-page render and a matching API fragment endpoint. This dual-endpoint pattern has already drifted (blog API endpoint differs structurally from the blog page). The htmx:afterSwap reinit pattern requires sidebar and theme toggle to manually re-initialize after every swap — a fragile coupling. Astro 5.16.6 ships `<ClientRouter />` as a stable feature that solves the same problem natively. (see origin: `docs/brainstorms/2026-03-27-view-transitions-migration-requirements.md`)

## Requirements Trace

- R1. Add `<ClientRouter />` to `BaseLayout.astro` — replaces HTMX navigation
- R2. Convert nav links from `hx-get`/`hx-target`/`hx-swap`/`hx-push-url` to standard `<a href>`
- R3. Simplify `NAV_LINKS` to remove `api` field and HTMX dependency
- R4. Delete `public/scripts/htmx.min.js` and its `<script>` tags from both layouts
- R5. Delete `src/config/htmx.ts`
- R6. Delete all 6 API fragment endpoints in `src/pages/api/`
- R7. Remove `htmx:afterSwap` event listeners from ThemeToggle and Sidebar
- R8. Replace ThemeToggle reinit with `astro:after-swap` event
- R9. Replace sidebar init with `astro:page-load` event
- R10. Add scroll-to-top via `astro:after-swap` handler
- R11. Default cross-fade animation (no custom directives)

## Scope Boundaries

- No custom per-element transition animations
- No new features — pure migration/simplification
- Sidebar behavior unchanged beyond lifecycle event swap
- No changes to page content, styling, or layout structure
- `ApiContentLayout.astro` deleted along with its consumers (the API endpoints)

## Context & Research

### Relevant Code and Patterns

**HTMX Surface (complete inventory):**

- `src/config/htmx.ts` — HTMX_CONFIG constants (target, swap)
- `src/config/navigation.ts` — imports HTMX_CONFIG, NAV_LINKS has `api` field per link
- `src/components/navigation/Navigation.astro` — applies hx-get/hx-target/hx-swap/hx-push-url to each nav link
- `src/layouts/BaseLayout.astro:31` — loads `<script is:inline src="/scripts/htmx.min.js">`
- `src/layouts/ContentWithSidebarLayout.astro:31` — also loads htmx.min.js
- `src/components/navigation/Sidebar.astro:159` — `htmx:afterSwap` listener calls `initSidebar()`
- `src/components/ThemeToggle.astro:71` — `htmx:afterSwap` listener calls `setupThemeToggle()`
- `src/scripts/sidebar.ts:4` — JSDoc comment references htmx:afterSwap
- `public/scripts/htmx.min.js` — the library file itself
- `src/layouts/ApiContentLayout.astro` — wrapper div for API fragment endpoints
- `src/pages/api/` — 6 fragment endpoints (home, bookshelf, myWork, shoutouts, testimonials, blog)

**View Transitions (verified against Astro docs):**

- `<ClientRouter />` from `astro:transitions` — add to `<head>` for SPA navigation
- `astro:after-swap` — fires after DOM swap, before rendering (use for scroll reset and theme toggle reinit)
- `astro:page-load` — replaces `DOMContentLoaded` when View Transitions active (use for sidebar init)
- `fallback` prop controls degradation for browsers without native View Transition support
- Scroll restoration is NOT automatic — requires manual handler

**Existing patterns to preserve:**

- `aria-current="page"` on active nav links (Navigation.astro:19) — this works with standard `<a>` links unchanged
- Theme FOUC prevention script in Head.astro — runs before render, unaffected by this migration
- Skip-to-content link in BaseLayout.astro — unchanged

### External References

- Astro View Transitions docs: https://docs.astro.build/en/guides/view-transitions/
- `<ClientRouter />` API: https://docs.astro.build/en/reference/modules/astro-transitions/

## Key Technical Decisions

- **Remove HTMX entirely**: Clean break rather than keeping the script for hypothetical future use. The library can be re-added if a real interactive use case arises. This avoids the confusion of loading a library with no consumers.
- **Delete all API fragment endpoints**: They exist solely for HTMX partial swaps. With View Transitions, Astro handles full-page navigation with animated transitions natively — no fragment endpoints needed.
- **Use `astro:page-load` for sidebar, `astro:after-swap` for theme**: Sidebar needs full DOM availability (queries elements), so `astro:page-load` (fires after rendering). Theme toggle should update ARIA state after swap but before render to avoid flicker, so `astro:after-swap`.
- **Scroll reset via `astro:after-swap`**: Matches the pattern shown in Astro's official docs — reset scroll position to top after each navigation.
- **Consolidate layout HTMX loading**: Both `BaseLayout.astro` and `ContentWithSidebarLayout.astro` load htmx.min.js — both script tags are removed.

## Open Questions

### Resolved During Planning

- **Does `initSidebar()` handle duplicate event listeners?**: No — it calls `addEventListener` without removing old listeners. However, `astro:page-load` fires once per navigation (not repeatedly), and the sidebar DOM elements are replaced on each navigation, so old listeners are garbage-collected with the old DOM nodes. No refactoring needed.
- **ThemeToggle `cloneNode` pattern under View Transitions**: The ThemeToggle uses `cloneNode(true)` + `replaceChild` specifically to avoid duplicate listeners. Under View Transitions, the entire DOM is swapped, so `setupThemeToggle()` always operates on fresh DOM. The pattern remains safe.
- **Scroll reset event**: Astro docs explicitly show `astro:after-swap` for scroll reset with `window.scrollTo({ left: 0, top: 0, behavior: "instant" })`.

### Deferred to Implementation

- Whether `ContentWithSidebarLayout.astro` should be refactored to extend `BaseLayout.astro` (it currently duplicates the full HTML shell). Out of scope for this migration but worth noting — both layouts need the `<ClientRouter />` addition, but after migration only `BaseLayout` should need it if layouts are composed properly.

## Implementation Units

- [ ] **Unit 1: Add ClientRouter and scroll handler to BaseLayout**

**Goal:** Enable View Transitions site-wide by adding `<ClientRouter />` to the head and a scroll-to-top handler.

**Requirements:** R1, R10, R11

**Dependencies:** None

**Files:**

- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/Head.astro`

**Approach:**

- Import `ClientRouter` from `astro:transitions` in `Head.astro` and add `<ClientRouter />` inside `<head>`
- Add an inline script in `BaseLayout.astro` that listens for `astro:after-swap` and calls `window.scrollTo({ left: 0, top: 0, behavior: "instant" })`
- Also add `<ClientRouter />` to `ContentWithSidebarLayout.astro` (or import Head.astro which already includes it — verify the layout composition)

**Patterns to follow:**

- Astro docs View Transitions setup pattern
- Existing `<script is:inline>` pattern in Head.astro for FOUC prevention

**Test scenarios:**

- Happy path: After adding ClientRouter, navigating between pages should show a cross-fade transition instead of full page reload
- Happy path: After navigation, page scrolls to top
- Edge case: Browser back/forward buttons still work (hx-push-url removal doesn't break history)

**Verification:**

- `bun run build` succeeds
- Dev server shows cross-fade transitions between pages

---

- [ ] **Unit 2: Convert Navigation to standard links**

**Goal:** Remove all HTMX attributes from navigation links and simplify the navigation config.

**Requirements:** R2, R3

**Dependencies:** Unit 1

**Files:**

- Modify: `src/components/navigation/Navigation.astro`
- Modify: `src/config/navigation.ts`
- Delete: `src/config/htmx.ts`

**Approach:**

- In `navigation.ts`: remove `import { HTMX_CONFIG }` and the `htmx` field from `NAVIGATION_CONFIG`. Remove the `api` field from each NAV_LINKS entry.
- In `Navigation.astro`: remove `hx-get`, `hx-target`, `hx-swap`, `hx-push-url` attributes from the `<a>` tag. The `href` is already present and correct.
- Delete `src/config/htmx.ts` entirely (R5).

**Patterns to follow:**

- Standard Astro `<a href>` navigation pattern
- Keep `aria-current="page"` logic unchanged

**Test scenarios:**

- Happy path: Navigation links render as plain `<a href="/path/">` without hx-\* attributes
- Happy path: `aria-current="page"` still marks the active link correctly
- Happy path: Clicking a nav link navigates with View Transitions cross-fade

**Verification:**

- No `hx-` attributes in rendered HTML
- `aria-current="page"` works on each page
- Navigation between all 6 pages works

---

- [ ] **Unit 3: Migrate script lifecycle events**

**Goal:** Replace `htmx:afterSwap` listeners with Astro View Transition events for sidebar and theme toggle.

**Requirements:** R7, R8, R9

**Dependencies:** Unit 1

**Files:**

- Modify: `src/components/navigation/Sidebar.astro`
- Modify: `src/components/ThemeToggle.astro`
- Modify: `src/scripts/sidebar.ts` (JSDoc comment only)

**Approach:**

- In `Sidebar.astro` (line 159): replace `document.body.addEventListener('htmx:afterSwap', () => initSidebar())` with `document.addEventListener('astro:page-load', () => initSidebar())`
- In `ThemeToggle.astro` (line 71): replace `document.body.addEventListener('htmx:afterSwap', setupThemeToggle)` with `document.addEventListener('astro:after-swap', setupThemeToggle)`
- In `ThemeToggle.astro`: also update the DOMContentLoaded fallback pattern — with View Transitions active, `astro:page-load` replaces DOMContentLoaded. Consider simplifying the init pattern.
- In `sidebar.ts`: update JSDoc comment to remove htmx:afterSwap reference

**Patterns to follow:**

- Astro docs lifecycle events: `astro:page-load` for component initialization, `astro:after-swap` for pre-render state updates

**Test scenarios:**

- Happy path: Theme toggle works on initial page load
- Happy path: Theme toggle works after navigating to a different page via View Transitions
- Happy path: Sidebar mobile toggle works on initial load
- Happy path: Sidebar mobile toggle works after page navigation
- Happy path: Sidebar hover states and smooth scroll work after navigation
- Edge case: Theme state (dark/light) persists across navigations (localStorage)

**Verification:**

- Theme toggle functional on every page and after every navigation
- Sidebar functional on sidebar-bearing pages after navigation
- No console errors related to missing event targets

---

- [ ] **Unit 4: Delete HTMX artifacts**

**Goal:** Remove all HTMX files, scripts, and API fragment endpoints from the codebase.

**Requirements:** R4, R5, R6

**Dependencies:** Units 2, 3

**Files:**

- Delete: `public/scripts/htmx.min.js`
- Delete: `src/pages/api/home.html.astro`
- Delete: `src/pages/api/bookshelf.html.astro`
- Delete: `src/pages/api/myWork.html.astro`
- Delete: `src/pages/api/shoutouts.html.astro`
- Delete: `src/pages/api/testimonials.html.astro`
- Delete: `src/pages/api/blog.html.astro`
- Delete: `src/layouts/ApiContentLayout.astro`
- Delete: `src/config/htmx.ts` (if not already deleted in Unit 2)
- Modify: `src/layouts/BaseLayout.astro` (remove htmx script tag)
- Modify: `src/layouts/ContentWithSidebarLayout.astro` (remove htmx script tag)

**Approach:**

- Remove `<script is:inline src="/scripts/htmx.min.js"></script>` from both `BaseLayout.astro:31` and `ContentWithSidebarLayout.astro:31`
- Delete all files in `src/pages/api/` directory
- Delete `ApiContentLayout.astro` (only consumed by API endpoints)
- Delete `public/scripts/htmx.min.js`
- Verify no remaining imports of deleted files

**Patterns to follow:**

- Clean deletion — grep for references to each deleted file before removal

**Test scenarios:**

- Happy path: `bun run build` succeeds with no missing import errors
- Happy path: No `htmx` string appears in rendered HTML (except the bookshelf content link to htmx.org essay, which is content data, not framework usage)
- Edge case: The bookshelf.ts reference to `htmx.org/essays/locality-of-behaviour/` is content data and must NOT be deleted

**Verification:**

- `grep -r "htmx" src/ --include="*.astro" --include="*.ts"` returns only the bookshelf.ts content URL
- `bun run build` succeeds
- All pages load correctly in dev server

---

- [ ] **Unit 5: Update e2e tests**

**Goal:** Update e2e tests to reflect the new View Transitions architecture — remove HTMX-specific assertions and add View Transitions assertions.

**Requirements:** Affects e2e tests per origin doc

**Dependencies:** Units 1-4

**Files:**

- Modify: `src/e2e/sidebar.test.ts`

**Approach:**

- Remove the `HTMX attributes` describe block (lines 132-138) that asserts `hx-get`, `hx-target`, `hx-swap`, `hx-push-url`
- Remove the `htmx:afterSwap` assertion in theme toggle tests (lines 175-176)
- Replace with assertions that verify View Transitions are active: check for `<meta name="astro-view-transitions-enabled">` or the ClientRouter script presence
- Keep all other tests unchanged (dark mode, anchor integrity, mobile responsive, sidebar structure, active page detection, FOUC prevention)

**Patterns to follow:**

- Existing test style in sidebar.test.ts (fetch HTML, assert string presence)

**Test scenarios:**

- Happy path: All non-HTMX tests pass unchanged (dark mode, anchor integrity, mobile responsive, sidebar structure, active page detection, FOUC prevention)
- Happy path: New View Transitions assertion passes — rendered HTML contains View Transitions markers
- Happy path: Navigation test verifies `aria-current="page"` without requiring HTMX attributes
- Edge case: Theme toggle FOUC prevention test still passes (script is in Head.astro, unaffected)

**Verification:**

- `bun test` passes with all assertions green
- No test references `htmx` (except content URL in bookshelf data)

## System-Wide Impact

- **Interaction graph:** Navigation.astro links, Sidebar.astro init, ThemeToggle.astro init — all three touch the HTMX lifecycle and must be migrated together. No other components reference HTMX.
- **Error propagation:** If `<ClientRouter />` fails to load (e.g., import error), navigation falls back to standard full-page loads — safe degradation.
- **State lifecycle risks:** Theme state stored in localStorage is unaffected. Sidebar DOM state is recreated on each navigation (same as HTMX behavior). No persistent state risk.
- **API surface parity:** The 6 API fragment endpoints are being deleted, not replaced. No other consumers.
- **Unchanged invariants:** `aria-current="page"` detection, skip-to-content link, FOUC prevention, all page content and styling — these are explicitly unchanged.

## Risks & Dependencies

| Risk                                                   | Mitigation                                                                                                       |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| View Transitions browser support (Firefox behind flag) | `<ClientRouter />` has `fallback` prop that handles graceful degradation; site falls back to standard page loads |
| `initSidebar()` listener accumulation                  | Not a risk — View Transitions replace DOM on navigation, garbage-collecting old listeners                        |
| Breaking e2e tests                                     | Unit 5 explicitly handles test migration; tests are structural HTML assertions, not browser interaction tests    |
| Missing an HTMX reference during deletion              | Unit 4 includes a grep verification step to catch stragglers                                                     |

## Sources & References

- **Origin document:** [docs/brainstorms/2026-03-27-view-transitions-migration-requirements.md](docs/brainstorms/2026-03-27-view-transitions-migration-requirements.md)
- **Ideation:** [docs/ideation/2026-03-27-frontend-design-architecture-ideation.md](docs/ideation/2026-03-27-frontend-design-architecture-ideation.md)
- Astro View Transitions: https://docs.astro.build/en/guides/view-transitions/
- Astro ClientRouter API: https://docs.astro.build/en/reference/modules/astro-transitions/
