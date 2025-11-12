# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Astro, showcasing Joshua Pendragon's professional experience as a Software Development Engineer in Test (SDET). The site features a blog, skills showcase, testimonials, and a curated bookshelf of resources.

## Key Development Commands

### Development
- `bun run dev` - Start development server with hot reload
- `bun run start` - Alternative command for development server

### Building and Deployment
- `bun run build` - Build for production (includes pre-build type checking)
- `bun run preview` - Preview production build locally
- `bun run prebuild` - Run Astro type checking (automatically runs before build)

### Code Quality
- `bun run format` - Format code with Biome
- `bun run lint` - Lint and auto-fix code with Biome  
- `bun run check` - Run comprehensive Biome checks (format + lint)

### Versioning
- `bun run add_changeset` - Create a new changeset for version management
- `bun run version` - Update version and generate changelog from changesets

## Architecture

### Technology Stack
- **Framework**: Astro (static site generator)
- **Styling**: Tailwind CSS with custom green theme
- **TypeScript**: Strict configuration with Astro plugin
- **Runtime**: Bun for package management and development
- **Deployment**: Netlify (auto-deploys from main branch)
- **Code Quality**: Biome for formatting and linting

### Project Structure
- `src/layouts/` - Base layouts (BaseLayout, BlogLayout, MarkdownPostLayout, TestimonialLayout)
- `src/components/` - Reusable Astro components (Header, Footer, Navigation, Skills, etc.)
- `src/pages/` - File-based routing with Astro pages and markdown content
- `src/content/` - Content data (bookshelf.ts, shoutouts.ts) with TypeScript types
- `src/assets/` - Images and static assets optimized by Astro
- `public/` - Static files (favicon, scripts, styles)

### Content Management
- **Blog posts**: Markdown files in `src/pages/blog/` with frontmatter
- **Testimonials**: Markdown files in `src/pages/testimonials/` 
- **Bookshelf**: TypeScript data file (`src/content/bookshelf.ts`) using ContentTemplate interface
- **Skills**: Component-based with image assets and structured data

### Code Conventions
- **Indentation**: Tabs (configured in Biome)
- **Quotes**: Single quotes for JavaScript/TypeScript
- **CSS**: Disabled Biome formatting (Tailwind classes)
- **Images**: WebP format for optimization
- **TypeScript**: Strict mode with path aliases (`@assets/*` → `src/assets/*`)

### Important Files
- `biome.json` - Code formatting and linting configuration
- `astro.config.mjs` - Astro configuration with Tailwind integration
- `netlify.toml` - Deployment configuration for Netlify
- `src/content/types/ContentTemplate.ts` - TypeScript interfaces for content structure

## Development Notes

- The site uses a custom green color scheme (`bg-green-950`, `text-green-*`)
- HTMX is included for potential interactivity
- Images are processed through Astro's Image component for optimization
- The project uses Changesets for version management and changelog generation
- TypeScript paths are configured for easy asset imports
- Biome handles all code quality checks instead of separate ESLint/Prettier setup
- To be able to use bun, run `npm install -g bun`, then check that it is installed with `bun --version`, and , if necessary, if you’ve installed Bun but are seeing a command not found error, you may have to manually add the installation directory (~/.bun/bin) to your PATH.
- Generate a changeset entry for each unit of work completed.
