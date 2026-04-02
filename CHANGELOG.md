# pendragon-coding

## 2.7.0

### Minor Changes

- b125efa: Add breadcrumb navigation component for multi-level page context (Home > Blog > Article Title)
- d90e7c4: feat: add visual system design tokens for shadows, transitions, and easing

  - Define shadow presets (card, card-hover, heading, glow-green) in Tailwind v4 @theme block
  - Define transition duration scale (fast/normal/slow) and easing curves (default/in-out/spring)
  - Mirror tokens in tailwind.config.js extend for editor intellisense support

- 74b4c32: Add Playwright-based WCAG AA contrast regression tests using axe-core. Tests 8 pages in both light and dark mode (16 test cases). Includes Playwright config, scoped tsconfig for Playwright types, and test:contrast npm script.
- d6bd63b: refactor: deepen frontend architecture — extract utilities, fix bugs, consolidate components

  - Extract shared slug utility (toSlug) from 4 duplicated implementations, fixing a regex ordering bug in CollectionPageLayout
  - Consolidate 4 duplicate component pairs (Card, Skill, Skills, Navigation) into canonical locations
  - Merge HTMX attributes and active-page detection into Navigation (was missing from live site)
  - Fix Card responsive sizing with min() wrapper to prevent mobile overflow
  - Fix sidebar dark mode bug: convert from broken @media prefers-color-scheme to class-based dark: utilities
  - Extract sidebar client script to standalone module with htmx:afterSwap support
  - Add theme contract constants with sync guard tests for inline scripts
  - Extract shared layout CSS from duplicate style blocks
  - Delete dead STYLING_CONFIG (zero imports)

- 18a19c7: Add visual feedback for HTMX navigation: loading indicator, error toasts, active link updates after swap, fade transitions, and scroll-to-top
- e1214be: Preserve sidebar in HTMX navigation: API partials now include the sidebar fragment so navigating between sidebar pages via HTMX keeps the section navigation visible. Fixes gist embed regression by introducing ContentKind type to distinguish testimonial blockquote rendering from default card rendering.

### Patch Changes

- 0b7183e: fix: exclude e2e tests from default `bun test` run

  E2E tests require a running preview server and now only run when
  explicitly targeted. Unit tests run cleanly via `bun test` and `bun vet`.

- 741c97c: fix: resolve remaining WCAG AA contrast violations on 404 page in both light and dark modes
- e2ffb40: fix: 404 page heading text contrast — ensure h2 "Page Not Found" uses gray-900/gray-100 for WCAG AA compliance in both light and dark modes
- bc17a2c: fix(a11y): blog sort button and prose link contrast for WCAG AA

  - Sort button active state: `bg-green-600 text-white` (3.21:1) → `bg-green-800 text-green-50` (passes 4.5:1) in both light and dark modes
  - `.content a` prose links: `text-blue-300` in light mode (1.5:1 on bg-green-200) → `text-blue-700` (passes 4.5:1); dark mode stays `text-blue-300`
  - Closes pendragon-coding-we9: all 16 axe-core contrast audit tests pass across 8 pages × 2 modes

- 8ad3546: fix(blog-sort): add initBlogSort to htmx:afterSwap init chain so sort controls work after HTMX navigation
- 396dcf2: fix(blog-sort): replace unsound SortKey cast with isSortKey type predicate

  Adds a private `isSortKey` type predicate to guard `applySort`'s button
  iteration loop, replacing the unsafe `as SortKey` cast. Buttons with
  unrecognised `data-sort` attribute values are now skipped rather than
  silently indexing `SORT_ANNOUNCEMENTS` with `undefined`.

- 85f9617: fix(blog-sort): guard popstate handler registration against duplicate calls

  Move popstate listener inside the INITIALIZED_ATTR guard so that calling
  initBlogSort() multiple times (e.g. on htmx:afterSwap on the same element)
  does not accumulate duplicate handlers. Adds DOM integration tests using
  happy-dom covering AC1 (double-init does not double-fire) and AC2 (popstate
  applies sort from URL on single init).

  Closes pendragon-coding-0yf

- a9e3bc7: fix: BlogLayout date text contrast — replace text-green-400 (1.44:1 on light background) with text-green-900 dark:text-green-400 achieving >= 4.5:1 WCAG AA in both light and dark modes
- d4f6bab: fix: card-internal date/role text contrast — upgrade role text from text-green-300 to text-green-200 and description text from text-green-300/80 to text-green-200 in ContentCard.astro to eliminate semi-transparent text and ensure WCAG AA contrast on both light and dark modes
- 004701f: fix: card background solid base and prose link contrast for WCAG AA — add bg-green-950 solid base to Card so semi-transparent gradient always renders on dark green; add .content a rule with blue-300 text achieving >=7.5:1 contrast on card backgrounds in both light and dark modes
- 49c7e26: Coordinate sort URL pushState with HTMX history: add htmx:historyRestore listener in navigation.ts to re-apply sort state on HTMX back/forward restores, and add hx-history="false" to the CollectionPageLayout main-content wrapper to prevent stale sorted DOM snapshots being cached.
- a3dff36: fix(excerpt): strip setext-style headings in blog excerpt markdown stripper

  ATX headings (`# Heading`) were already stripped but setext headings (heading text
  followed by `===` or `---` underlines) were not. The horizontal-rule regex was
  stripping the underline while leaving the heading text orphaned. A new regex runs
  before the horizontal-rule step to remove the heading text and its underline together.

- 1ef1801: fix: override Shiki github-dark comment token color for WCAG AA contrast

  Lightens comment token #6a737d to #8b949e on github-dark bg #24292e,
  achieving a 4.77:1 contrast ratio (WCAG AA requires 4.5:1).

- 729f26c: fix: improve sidebar content-link contrast from green-700 to green-800 for WCAG AA compliance on /myWork/ page
- 8e23770: fix: theme toggle moon icon contrast in dark mode — add aria-hidden="true" to sun and moon SVG icons in ThemeToggle.astro; icons are decorative (button carries aria-label and aria-checked), marking them hidden removes them from axe-core contrast checks and correctly signals their presentational role
- 429b417: fix(excerpt): word-boundary truncation in blog excerpt utility

  `getExcerpt` now cuts at the last complete word at or before 200 characters
  instead of slicing at byte boundary. Falls back to character-boundary cut
  when the first 200 characters contain no space. Trailing space at the cut
  position is stripped before appending the ellipsis.

- fc77431: Improve header layout responsiveness: stack vertically on mobile, show headshot at all breakpoints, responsive font sizes, and touch-friendly nav tap targets (min 48px)
- ab5582d: fix: remove dark-mode text-shadow from ContentWithSidebarLayout

  Removes the `html.dark body { text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }` block from
  ContentWithSidebarLayout that was missed when the same rule was removed from BaseLayout.
  Bookshelf, MyWork, Shoutouts, and Testimonials pages now render sharp text in dark mode.

- 2bf37e3: Fix WCAG AA color contrast violations across multiple components in light mode: h1/h2 headings on green-800 background, card-internal h3 headings and date/role text on dark gradient backgrounds, sidebar link colors and active states, BlogPostLayout date text, and skill category card opacity and text colors.

## 2.6.1

### Patch Changes

- 1f24d18: Reorganize bookshelf content into 5 themed sections (Engineering Culture, Architecture & Design, Testing & QA, Tooling, Deep Dives) for better navigation and discoverability

## 2.6.0

### Minor Changes

- 8857928: Add Testing Accessibility resource to bookshelf
- Add 5 new gists to portfolio showcase
  - Playwright Page & Component Object Model Template
  - ArkType Environment Variable Validation
  - Playwright Browser Console Error Fixture
  - ArkType + Neverthrow Type Validation Wrapper
  - TypeScript Custom Rule Validator

## 2.5.0

### Minor Changes

- 60e5a6e: Remove unused props from components to clean up interfaces and improve code maintainability.

## 2.4.1

### Patch Changes

- 124d897: Normalize line endings config in biome
- 9250868: Update dependencies and improve build scripts with bun typecheck

## 2.4.0

### Minor Changes

- 68d911f: Standardize object literal spacing and add DummyJSON tool to bookshelf content
- 68d911f: Enhanced sidebar navigation to include links to content items within each section. The sidebar now displays section titles with nested links that jump to specific content items within the page (not external links). Refactored active tracking to use mouse hover instead of scroll position for immediate visual feedback. Added smooth scrolling, hover-based active highlighting for both sections and content items, proper styling with hover effects and dark mode support. Content items now have unique IDs for precise anchor navigation. Added independent scrolling to sidebar with custom scrollbar styling and mobile responsiveness. Fixed blog page by enhancing existing CollectionPageLayout to conditionally show sidebar only for blog page, preserving all original styling and component architecture. Fixed bookshelf page sidebar height issue by implementing CSS custom properties to properly calculate sidebar height accounting for header and footer elements.
- 68d911f: Add anchor link support to content components for precise navigation. Content items now have unique IDs that enable sidebar navigation to jump directly to specific content within sections.
- 68d911f: Integrate sidebar layout across content pages. Bookshelf, myWork, shoutouts, and testimonials pages now use ContentWithSidebarLayout for improved navigation and content discovery.
- 68d911f: Enhance blog page with sidebar navigation. CollectionPageLayout now supports optional sidebar, and blog page displays post navigation for improved content browsing.
- 68d911f: Remove consultancy section and pages from the website, including navigation updates and page cleanup.

### Patch Changes

- 68d911f: Remove unnecessary animations and sticky positioning. Clean up visual inconsistencies by removing opacity delays from Skill component and sticky positioning from h3 elements.
- 6d4838c: Fix release workflow permissions to allow changesets action to create release branches and PRs.

## 2.3.1

### Patch Changes

- Remove animations and HTMX functionality from components. Clean up unused UI config file and improve script tags with is:inline attribute.
- 8c194b1: Configure CI/CD for tag-based deployments with automated releases. Production deploys only on version tags. Changeset release workflow automates version bumping and tagging.

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
