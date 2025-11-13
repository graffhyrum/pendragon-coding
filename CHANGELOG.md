# pendragon-coding

## 2.2.0

### Minor Changes

- 07b899c: Implement HTMX-based navigation with HATEOAS pattern for seamless page transitions

  This release introduces a modern navigation system using HTMX that provides a single-page application experience while maintaining progressive enhancement and SEO-friendly fallbacks.

  **New Features:**

  - HTMX-powered navigation that swaps content without full page reloads
  - Smooth transitions between pages using HTMX's built-in transition system
  - Browser history and URL preservation with `hx-push-url`
  - Seven new API endpoints (`/api/*.html`) returning HTML fragments for HTMX requests
  - Progressive enhancement: navigation works with and without JavaScript

  **Improvements:**

  - Fixed animation stutter by eliminating conflicting CSS animations during HTMX transitions
  - Added `noAnimation` prop system to Skills and Skill components for conditional animation control
  - Faster page navigation with reduced bandwidth usage (only content updates, not full page)
  - Maintained SEO compatibility with full-page fallbacks for search engine crawlers

  **Code Quality Refactors:**

  - Refactored Navigation component to use data-driven link array, reducing code from ~93 lines to ~38 lines
  - Extracted HTMX configuration into reusable constants for maintainability
  - Created ApiContentLayout wrapper to eliminate duplication across API endpoints
  - Improved code maintainability: adding/removing navigation links now requires only updating the data array

  **Technical Details:**

  - Navigation links use `hx-get`, `hx-target`, `hx-swap`, and `hx-push-url` attributes
  - Original page routes remain unchanged for direct access and SEO
  - API endpoints share components with full pages, ensuring consistency
  - HTMX library (already included) is now actively utilized
  - Centralized HTMX configuration through constants and shared layout components

### Patch Changes

- 2749b2a: Fix Astro v5 deprecation warning by moving ContentTemplate type out of src/content/ directory. The src/content/ directory is reserved for content collections, so TypeScript interfaces have been moved to src/types/ where they belong.
- 89e1eaf: Fix gist script rendering on My Work page by using Astro's set:html directive

## 2.1.1

### Patch Changes

- Adding 5-Minute DevOps to the bookshelf

## 2.1.0

### Minor Changes

- Adds transitions and animations to the site styling

## 2.0.0

### Major Changes

- 9958e84: Update changeset to v4
- 9958e84: Update Biome to v2

### Minor Changes

- 5243fa5: upgrade Astro to 5.15.5 and @types/node to 24.10.0

### Patch Changes

- 9958e84: Updated page styling. Increased side margins and adjusted responsive layouts.

## 1.1.1

### Patch Changes

- Refactor blog layout and skills components
- Update accessibility and fix minor typos in blog content

## 1.1.0

### Minor Changes

↑ @astrojs/check 0.8.3 → 0.9.4
↑ @astrojs/tailwind 5.1.3 → 5.1.4
↑ @changesets/cli 2.27.10 → 2.27.11
↑ @types/node 20.17.9 → 22.10.7
↑ astro 4.16.17 → 5.1.7
↑ caniuse-lite 1.0.30001687 → 1.0.30001692
↑ tailwindcss 3.4.16 → 3.4.17
↑ typescript 5.7.2 → 5.7.3

## 1.0.4

### Patch Changes

- 8df7188: Dependency Updates
  ↑ @astrojs/check 0.8.3 → 0.9.4
  ↑ @astrojs/tailwind 5.1.0 → 5.1.4
  ↑ @astrojs/ts-plugin 1.8.0 → 1.10.4
  ↑ @types/node 20.14.2 → 22.10.5
  ↑ astro 4.10.0 → 5.1.3
  ↑ tailwindcss 3.4.4 → 3.4.17
  ↑ typescript 5.4.5 → 5.7.2
- b9612b9: style: add biome, first linter pass

## 1.0.3

### Patch Changes

- 85b2af1: add changeset for version control
