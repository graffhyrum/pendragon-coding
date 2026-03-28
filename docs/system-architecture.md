# System Architecture

## High-Level Architecture

```mermaid
flowchart LR
    subgraph Sources["Content Sources"]
        TS["TypeScript data files\n(bookshelf, myWork,\ntestimonials, shoutouts,\nskills)"]
        MD["Markdown blog posts\n(blog/0001-0003.md)"]
        Assets["WebP images\n(src/assets/)"]
    end

    subgraph Build["Astro Build"]
        Collections["Content Collections\n(Zod schema validation)"]
        Templates["Astro Components\n+ Layouts"]
        TW["Tailwind CSS v4\n(Vite plugin)"]
    end

    subgraph Output["Static Output"]
        HTML["Static HTML pages\n(full pages + API fragments)"]
        CSS["Compiled CSS"]
        JS["htmx.min.js\n(vendored)"]
    end

    subgraph Deploy["Delivery"]
        Netlify["Netlify CDN"]
    end

    subgraph Client["Browser"]
        DOM["Initial page load"]
        HTMX["HTMX navigation\n(fragment swaps)"]
    end

    TS --> Templates
    MD --> Collections --> Templates
    Assets --> Templates
    Templates --> HTML
    TW --> CSS
    HTML --> Netlify
    CSS --> Netlify
    JS --> Netlify
    Netlify --> DOM
    DOM --> HTMX
    HTMX -->|"hx-get /api/*.html"| Netlify
```

## Layout Hierarchy

```mermaid
flowchart TD
    Base["BaseLayout\n(root HTML shell:\nHead, Header, #main-content, Footer, HTMX script)"]

    BlogPost["BlogPostLayout\n(title, date, content slot)"]
    Collection["CollectionPageLayout\n(blog listing, optional sidebar)"]
    Markdown["MarkdownPostLayout\n(legacy: title, date, image, author)"]

    CWSL["ContentWithSidebarLayout\n(standalone full HTML:\nbookshelf, myWork,\ntestimonials, shoutouts)"]

    Api["ApiContentLayout\n(standalone fragment wrapper:\nno html/head/header/footer)"]

    BlogLegacy["BlogLayout\n(legacy fragment:\ntitle, date, content)"]

    Base --> BlogPost
    Base --> Collection
    Base --> Markdown

    CWSL -.-|"duplicates Base structure\n(renders own html/head/body)"| Base

    style Api fill:#f5f5dc,stroke:#999
    style BlogLegacy fill:#f5f5dc,stroke:#999
    style CWSL fill:#e8f5e9,stroke:#4caf50
    style Base fill:#e8f5e9,stroke:#4caf50
```

**Legend**: Green = actively used core layouts. Beige = standalone (no inheritance from BaseLayout). BlogLayout and MarkdownPostLayout are legacy layouts retained for backward compatibility.

## HTMX Navigation Flow

```mermaid
sequenceDiagram
    participant User
    participant Nav as Navigation Component
    participant HTMX as HTMX (client)
    participant CDN as Netlify CDN
    participant Api as ApiContentLayout
    participant Main as #main-content

    User->>Nav: Clicks nav link
    Note over Nav: Link has hx-get="/api/bookshelf.html"<br/>hx-target="#main-content"<br/>hx-swap="innerHTML transition:true"

    Nav->>HTMX: Intercepts click (hx-get)
    HTMX->>CDN: GET /api/bookshelf.html
    CDN->>Api: Serves static HTML fragment
    Api-->>HTMX: <div class="w-full mx-auto">...content...</div>
    HTMX->>Main: Swaps innerHTML of #main-content
    Note over Main: Content updates without full page reload

    Note over Nav: Fallback: if HTMX not loaded,<br/>href="/bookshelf/" triggers<br/>full page navigation
```

### HTMX Configuration

The HTMX behavior is centralized in `src/config/htmx.ts`:

```typescript
export const HTMX_CONFIG = {
    target: '#main-content',
    swap: 'innerHTML transition:true',
} as const;
```

Navigation links in `src/config/navigation.ts` define both the full-page `href` and the HTMX `api` path for each route. The `Navigation` component renders these as `<a>` elements with `hx-get`, `hx-target`, and `hx-swap` attributes.

### Endpoint Pairing

Every navigable page has a paired API endpoint:

| Full Page               | HTMX Fragment             |
| ----------------------- | ------------------------- |
| `/` (index.astro)       | `/api/home.html`          |
| `/bookshelf/`           | `/api/bookshelf.html`     |
| `/myWork/`              | `/api/myWork.html`        |
| `/shoutouts/`           | `/api/shoutouts.html`     |
| `/testimonials/`        | `/api/testimonials.html`  |
| `/blog/`                | `/api/blog.html`          |

Full pages render through `BaseLayout` or `ContentWithSidebarLayout` (complete HTML documents). API fragments render through `ApiContentLayout` (a plain `<div>` wrapper with no document shell).

## Content Data Flow

The `ContentTemplate` pattern provides a uniform rendering pipeline for four content sections:

```
ContentTemplate interface
    │
    ├── bookshelf.ts ─────┐
    ├── myWork.ts ─────────┤
    ├── testimonials.ts ───┤  Each exports ContentTemplate data
    └── shoutouts.ts ──────┘
                           │
                           ▼
              ContentWithSidebarLayout
              (or ApiContentLayout for fragments)
                           │
                    ┌──────┴──────┐
                    │             │
                 Sidebar    ContentContainer
                    │             │
               (section      ContentSection
                anchors)          │
                             SectionList
                                  │
                             ContentCard
                                  │
                              ui/Card
```

### ContentTemplate Interface

```typescript
interface ContentTemplate {
    sections: Array<{
        title: string;
        subtitle: string;
        layoutMode?: 'grid' | 'single-column';
        content: Array<{
            title: string;
            link: Link[];
            description: string;
        }>;
    }>;
}
```

Each content page passes its `ContentTemplate` data through the same component chain. The `Sidebar` component generates anchor links from section titles. The `layoutMode` property controls whether items render in a responsive grid or a single column.

## Page-to-Layout Mapping

| Page                    | Layout                      | Notes                              |
| ----------------------- | --------------------------- | ---------------------------------- |
| `index.astro`           | BaseLayout                  | Home page with skills showcase     |
| `bookshelf.astro`       | ContentWithSidebarLayout    | ContentTemplate data               |
| `myWork.astro`          | ContentWithSidebarLayout    | ContentTemplate data               |
| `testimonials.astro`    | ContentWithSidebarLayout    | ContentTemplate data               |
| `shoutouts.astro`       | ContentWithSidebarLayout    | ContentTemplate data               |
| `blog.astro`            | CollectionPageLayout        | Blog listing with optional sidebar |
| `blog/[...slug].astro`  | BlogPostLayout              | Individual blog post               |
| `api/home.html.astro`   | ApiContentLayout            | HTMX fragment                      |
| `api/bookshelf.html`    | ApiContentLayout            | HTMX fragment                      |
| `api/myWork.html`       | ApiContentLayout            | HTMX fragment                      |
| `api/shoutouts.html`    | ApiContentLayout            | HTMX fragment                      |
| `api/testimonials.html` | ApiContentLayout            | HTMX fragment                      |
| `api/blog.html`         | ApiContentLayout            | HTMX fragment                      |

## Routing Architecture

### File-Based Routing

Astro maps files in `src/pages/` to URL paths:

- `src/pages/index.astro` serves `/`
- `src/pages/bookshelf.astro` serves `/bookshelf/`
- `src/pages/api/home.html.astro` serves `/api/home.html`

### Dynamic Blog Routes

Blog posts use a catch-all route: `src/pages/blog/[...slug].astro`. This file queries the `blog` content collection and renders each post through `BlogPostLayout`. The slug is derived from the markdown filename (e.g., `0001.md` becomes `/blog/0001/`).

### API Endpoints

The `api/` directory contains `.html.astro` files that produce HTML fragments (not JSON). These exist solely for HTMX to fetch and swap into `#main-content`. They render the same content components as their full-page counterparts but wrap them in `ApiContentLayout` instead of a full document layout.

## Content Collection Schema

Blog posts are defined as an Astro content collection with a Zod schema in `src/content.config.ts`:

```typescript
const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.date(),
    }),
});
```

Blog markdown files live in `src/content/blog/` and are queried at build time via Astro's `getCollection('blog')` API.

A `testimonials` collection is also defined (with an optional empty schema) but content data is primarily managed through the TypeScript `ContentTemplate` pattern rather than markdown files.

## Dark Mode Architecture

Theme switching uses a class-based strategy:

1. **Initialization** (Head.astro): An inline `<script>` runs before first paint. It reads `localStorage.getItem('theme')` and sets `document.documentElement.classList` to `'dark'` or `'light'`. This prevents a flash of unstyled content (FOUC).
2. **Toggle** (ThemeToggle component): A button with `role="switch"` toggles the `dark` class on `<html>` and persists the choice to `localStorage`.
3. **Styling**: All dark-mode styles use Tailwind's `dark:` prefix (e.g., `dark:bg-green-950`, `dark:text-gray-100`).

## See Also

- [Project Overview](project-overview-pdr.md) -- technology decisions and rationale
- [Codebase Summary](codebase-summary.md) -- file inventory and dependency table
