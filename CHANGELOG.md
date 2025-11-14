# pendragon-coding

## 2.3.0

### Minor Changes

- c332da7: Add light and dark mode toggle with sliding animation

  Implemented a theme toggle component that allows users to switch between light and dark modes with a smooth sliding animation. The theme preference is persisted in localStorage and respects system preferences on first visit.

  **New Features:**

  - Theme toggle button with sliding animation positioned at the right edge of the header
  - Sun and moon icons that smoothly transition based on the selected theme
  - localStorage persistence to remember user's theme preference across sessions
  - System preference detection on first visit (respects `prefers-color-scheme`)
  - Smooth color transitions throughout the site when switching themes (300ms duration)

  **Improvements:**

  - Light mode uses a clean gray-50 background with dark text for improved readability during daytime
  - Dark mode maintains the existing green-950 background with light text optimized for low-light environments
  - Navigation underlines adapt to theme: green-600 in light mode, green-400 in dark mode
  - Footer links have theme-aware hover states for better visual feedback
  - Accessible implementation with proper ARIA attributes and keyboard focus states

  **Technical Details:**

  - Created ThemeToggle.astro component with inline script for theme management
  - Configured Tailwind CSS with class-based dark mode strategy
  - Added tailwind.config.js with dark mode enabled
  - Updated BaseLayout, Header, Navigation, and Footer components with dark mode variants
  - Theme toggle uses CSS transitions for smooth visual changes
  - Focus ring styling for keyboard navigation accessibility

### Patch Changes

- e5e448b: Add Bun test runner tooling to the project. Includes test scripts in package.json (test, test:watch, test:coverage), example test file demonstrating Bun's test syntax, and updated documentation in CLAUDE.md with testing commands and conventions.
- b090c8e: Add GitHub Action for opencode integration on issue comments

  - Add .github/workflows/opencode.yml to enable opencode AI assistance
  - Triggers on issue comments containing '/oc' or '/opencode' commands
  - Uses sst/opencode/github action with opencode/big-pickle model
  - Includes proper permissions for repository access

- 201f90b: Migrate blog and testimonials to Astro Content Collections API

  - Create content config with Zod schemas for type safety
  - Move markdown files from pages to content directory
  - Standardize blog dates to ISO format
  - Add optional metadata fields (description, author, tags, company, position)
  - Replace import.meta.glob() with getCollection() for better performance
  - Add dynamic routes for individual blog/testimonial pages
  - Fix BlogCard to display title and date in listings
  - Fix testimonials to show title, position, company, and href in listings

- 930f48e: Add article on DORA metrics misuse to bookshelf
- b090c8e: Refactor testimonials to use ContentSection component like myWork page

  - Convert testimonials from Astro Content Collections to static TypeScript data file
  - Update testimonials page to use ContentContainer and BaseLayout instead of CollectionPageLayout
  - Remove individual testimonial markdown files and dynamic routing
  - Update API testimonials endpoint to use static content approach
  - Clean up obsolete TestimonialLayout and content collection configuration
  - Update documentation to reflect new testimonials structure

  This change makes testimonials consistent with other content pages (myWork, bookshelf) by using the same ContentSection/ContentCard architecture instead of content collections.

- 4233ed8: Refactor SectionList, ContentSection, and CollectionPageLayout components to consolidate UL elements with their corresponding .map() calls, improving code organization and reducing separation of related rendering logic.
- cf991b0: Replace deprecated Astro.glob with import.meta.glob for future compatibility

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
