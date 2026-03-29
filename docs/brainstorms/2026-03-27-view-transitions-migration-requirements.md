---
date: 2026-03-27
topic: view-transitions-migration
---

# Replace HTMX Navigation with Astro View Transitions

## Problem Frame

The site uses HTMX for SPA-like page navigation, requiring a dual-endpoint pattern: every content page has both a full-page render (e.g., `/bookshelf.astro`) and a matching API fragment endpoint (e.g., `/api/bookshelf.html.astro`). This creates maintenance overhead (6 mirror files), reinit fragility (sidebar and theme toggle must re-initialize after every `htmx:afterSwap`), and ~47KB of client JS for a problem Astro solves natively with View Transitions.

## Requirements

**Navigation Migration**

- R1. Replace HTMX navigation with Astro's `<ClientRouter />` component added to `BaseLayout.astro`
- R2. Convert all navigation links from `hx-get`/`hx-target`/`hx-swap`/`hx-push-url` to standard `<a href>` tags
- R3. Remove the `api` field from `NAV_LINKS` in `config/navigation.ts` and simplify `NAVIGATION_CONFIG` to remove HTMX dependency

**HTMX Removal**

- R4. Delete `public/scripts/htmx.min.js` and the `<script is:inline>` tag loading it from `BaseLayout.astro`
- R5. Delete `src/config/htmx.ts` entirely
- R6. Delete all 6 API fragment endpoints in `src/pages/api/`
- R7. Remove `htmx:afterSwap` event listeners from `ThemeToggle.astro` and any references in sidebar initialization

**Script Lifecycle Migration**

- R8. Replace `htmx:afterSwap` reinit in `ThemeToggle.astro` with `astro:after-swap` event listener (fires after View Transitions DOM swap)
- R9. Replace sidebar initialization trigger: use `astro:page-load` event (replaces `DOMContentLoaded` when View Transitions are enabled) to call `initSidebar()`
- R10. Add scroll-to-top behavior via `astro:after-swap` event handler (View Transitions do not auto-restore scroll position)

**Animation**

- R11. Use Astro's default cross-fade animation between pages (no custom `transition:animate` directives needed)

## Success Criteria

- All page navigation works via standard links with View Transitions cross-fade
- No HTMX artifacts remain in the codebase (no `hx-*` attributes, no htmx.min.js, no API fragment endpoints, no htmx config)
- Theme toggle and sidebar continue to function correctly after page transitions
- Browser back/forward buttons work correctly
- `aria-current="page"` still marks the active navigation link
- Existing e2e tests pass (with updates to remove HTMX-specific assertions)

## Scope Boundaries

- No custom per-element transition animations (default fade only)
- No new features — this is a pure migration/simplification
- Sidebar behavior (hover states, mobile toggle, smooth scroll) unchanged beyond lifecycle event swap
- No changes to page content, styling, or layout structure

## Key Decisions

- **Remove HTMX entirely**: Clean break. No htmx.min.js retained "just in case." Can be re-added if a real interactive use case arises.
- **Delete all API fragment endpoints**: They exist solely for HTMX partial swaps and serve no purpose after migration.
- **Default fade animation**: Zero-configuration cross-fade. Custom transitions are out of scope.

## Dependencies / Assumptions

- Astro 5.16.6 ships `<ClientRouter />` as a stable feature (verified against docs)
- The `fallback` prop on `<ClientRouter />` handles browsers without native View Transitions support

## Outstanding Questions

### Deferred to Planning

- [Affects R9][Technical] Does `initSidebar()` need to be refactored for idempotency under `astro:page-load`, or is it already safe to call multiple times? (Current code comment says "idempotent" but it adds event listeners without removing old ones)
- [Affects R8][Technical] The ThemeToggle uses `cloneNode(true)` + `replaceChild` to avoid duplicate listeners — verify this pattern still works correctly with View Transitions' DOM swap behavior
- [Affects R10][Needs research] Should scroll restoration use `astro:after-swap` (resets before render) or `astro:page-load` (after full load)? Docs show `astro:after-swap` but performance implications may differ
- [Affects e2e][Technical] The e2e test `sidebar.test.ts` asserts HTMX attributes on navigation links — needs updating to assert standard `<a href>` links instead

## Next Steps

`Resolve Before Planning` is empty.

-> `/ce:plan` for structured implementation planning
