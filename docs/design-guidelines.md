# Design Guidelines

Visual design system and accessibility patterns for the pendragon-coding portfolio site.

## Color System

The site uses Tailwind's built-in green palette as its primary color scheme. Colors are applied directly through Tailwind utility classes on components.

### Light Mode

| Role       | Class              | Usage                      |
| ---------- | ------------------ | -------------------------- |
| Background | `bg-green-200`     | Page body background       |
| Text       | `text-green-900`   | Headings, accent text      |
| Borders    | `border-green-200` | Card and section dividers  |
| Body text  | `text-gray-900`    | Paragraph and content text |

### Dark Mode

| Role       | Class                 | Usage                                   |
| ---------- | --------------------- | --------------------------------------- |
| Background | `bg-green-950`        | Page body background                    |
| Text       | `text-green-100`      | Headings, accent text                   |
| Borders    | `border-green-700/80` | Card and section dividers (80% opacity) |
| Body text  | `text-gray-100`       | Paragraph and content text              |

### Green Palette Usage

Beyond the primary/accent tokens, components use additional green shades directly:

- `bg-green-800` -- heading backgrounds in light mode
- `text-green-*` -- various green shades for links, highlights, and decorative elements

The green color values come from Tailwind's default palette. No custom green shades are defined in `tailwind.config.js`.

## Typography

### Font Family

The site uses **Roboto** from Google Fonts as the primary typeface, applied via the `font-sans` utility class.

### Type Scale

Type scale applied via Tailwind utilities:

| Token        | Class       | Tailwind Size | Usage               |
| ------------ | ----------- | ------------- | ------------------- |
| `heading`    | `text-4xl`  | 2.25rem       | Page titles (h1)    |
| `subheading` | `text-xl`   | 1.25rem       | Section titles (h2) |
| `body`       | `text-lg`   | 1.125rem      | Body content        |
| `base`       | (composite) | --            | Default text style  |

### Line Height

All body text uses `leading-loose` (line-height: 2) for comfortable reading. This is part of the `base` typography token: `font-sans text-gray-900 dark:text-gray-100 leading-loose`.

## Dark Mode Implementation

Dark mode uses the **class strategy** (`darkMode: 'class'` in `tailwind.config.js`). The `dark` class is toggled on the `<html>` element.

### Initialization

Theme preference is loaded from `localStorage` in the `<Head>` component, executing before the page renders to prevent a flash of incorrect theme:

1. `Head.astro` includes an inline script that reads the stored theme preference
2. If a preference exists, the `dark` class is applied to `<html>` immediately
3. If no preference exists, the system default is used

### ThemeToggle Component

The toggle button in the header provides manual theme switching:

- Uses `role="switch"` with `aria-checked` for accessibility
- Toggles the `dark` class on `document.documentElement`
- Persists the choice to `localStorage`

### Authoring Dark Mode Styles

Use Tailwind's `dark:` variant prefix directly on elements:

```astro
<body class="bg-green-200 dark:bg-green-950 text-gray-900 dark:text-gray-100">
```

## Layout Patterns

### Page Structure

The site uses a flex-based layout with a sidebar on desktop:

```
+------------------------------------------+
| Header (navigation + theme toggle)       |
+----------+-------------------------------+
| Sidebar  | #main-content                 |
| (nav)    | (page content area)           |
|          |                               |
+----------+-------------------------------+
| Footer                                   |
+------------------------------------------+
```

### Responsive Behavior

- **Desktop (768px+)**: Sidebar visible alongside main content
- **Mobile (<768px)**: Sidebar collapses; navigation moves to header
- The 768px breakpoint controls the sidebar collapse transition

### Content Layout Modes

The `LayoutMode` type (`src/types/Layout.ts`) controls how content sections arrange their items:

| Mode            | Behavior                                        |
| --------------- | ----------------------------------------------- |
| `grid`          | Items in a responsive grid (cards side by side) |
| `single-column` | Items stacked vertically (full-width cards)     |

Content data files set `layoutMode` per section in their `ContentTemplate` data.

## Component Design

### Card Variants

The `CardVariant` type (`src/types/Card.ts`) defines two card presentations:

| Variant      | Usage                                   |
| ------------ | --------------------------------------- |
| `long-form`  | Full description visible, larger card   |
| `short-form` | Compact card with truncated description |

### Content Section Structure

Content pages follow a consistent pattern:

1. **ContentSection** -- wraps a section with title and subtitle
2. **SectionList** -- iterates over content items
3. **ContentCard** -- renders individual content items with links
4. **ContentContainer** -- layout wrapper applying the selected `LayoutMode`

### Skills Component

Skills use a separate data model (`SkillData` from `src/types/Skill.ts`) with image path, alt text, title, and documentation link. The Skills grid uses orientation-based responsive layout (`orientation: landscape`).

## Accessibility

### Skip Navigation

A skip-to-content link is the first focusable element on every page:

- Uses `sr-only` (visually hidden by default)
- Becomes visible on focus via `focus:` styles
- Links to `#main-content`

### Semantic HTML

| Element         | Usage                                      |
| --------------- | ------------------------------------------ |
| `role="main"`   | Main content area                          |
| `role="list"`   | Content card collections                   |
| `role="switch"` | Theme toggle button                        |
| `aria-checked`  | Theme toggle state (light/dark)            |
| `aria-label`    | Descriptive labels on interactive elements |

### Heading Hierarchy

Pages maintain a logical heading hierarchy:

- `h1` -- page title (one per page)
- `h2` -- section headings within content areas
- Heading elements are not skipped (no h1-to-h3 jumps)

### Focus Styles

Interactive elements use `focus-visible` styles to indicate keyboard focus without showing focus rings on mouse clicks. This follows the modern focus-visible pattern for better UX.

## Animation and Transitions

### Body Color Transition

The body element applies `transition-colors duration-300` for smooth color changes when toggling between light and dark mode.

### Headshot Hover Effect

The profile headshot on the home page uses a multi-property transition on hover:

```
transition-all duration-500
hover: scale + rotate + shadow
```

This creates a subtle interactive effect with scaling, rotation, and shadow depth changes.

### Navigation Link Underlines

Navigation links use a group-hover underline animation:

- A pseudo-element starts at `w-0`
- On `group-hover`, it transitions to `w-full`
- Creates a smooth underline-in effect from left to right

## Responsive Breakpoints

| Breakpoint               | Trigger     | Behavior                                      |
| ------------------------ | ----------- | --------------------------------------------- |
| `sm` (640px)             | Min-width   | Header layout adjustments                     |
| 768px                    | Min-width   | Sidebar becomes visible; mobile nav collapses |
| `orientation: landscape` | Media query | Skills grid switches to landscape layout      |

The site is mobile-first -- base styles target small screens, and breakpoints layer on desktop-specific layouts.

## HTMX Integration

The site uses HTMX for client-side navigation without full page reloads:

- Navigation links include `hx-get` attributes pointing to API partial endpoints (e.g., `/api/home.html`)
- Content swaps into `#main-content` using `innerHTML transition:true`
- View transitions provide smooth page-to-page animations
- Configuration is centralized in `src/config/htmx.ts`

## See Also

- [Code Standards](code-standards.md) -- component conventions and naming patterns
- [Configuration Guide](configuration-guide.md) -- Tailwind, oxlint, and oxfmt configuration details
