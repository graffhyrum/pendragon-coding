# Pendragon Coding

A portfolio website for Joshua Pendragon (SDET), built with Astro. Features a blog, skills showcase, testimonials, and a curated bookshelf of resources.

[![Netlify Status](https://api.netlify.com/api/v1/badges/27933604-1314-4903-bdaa-8e13c34e8122/deploy-status)](https://app.netlify.com/sites/pendragon-coding/deploys)

**Live site**: [pendragon-coding.netlify.app](https://pendragon-coding.netlify.app)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (JavaScript runtime and package manager)
- [Node.js](https://nodejs.org/) 24+ (for the portless dev proxy CLI)
- OpenSSL (Windows: `winget install -e --id ShiningLight.OpenSSL.Dev`; the installer often does **not** add `C:\Program Files\OpenSSL-Win64\bin` to PATH — `bun run dev` prepends it automatically, or add it permanently and restart the terminal)

### Install and Run

```bash
bun install
bunx portless trust   # once: trust local HTTPS CA (Windows may need an elevated terminal)
bun run dev
```

The dev server is available at **https://pendragon-coding.localhost** (HTTPS via [portless](https://github.com/vercel-labs/portless)).

To run Astro without the proxy: `PORTLESS=0 bun run dev:app` (plain `http://localhost:4321`).

### Quality Check

```bash
bun vet
```

Runs TypeScript type checking, oxlint linting, oxfmt formatting, and all tests in one command.

## Built with

- [Astro](https://astro.build/) -- static site generator
- [Bun](https://bun.sh/) -- runtime and package manager
- [TypeScript](https://www.typescriptlang.org/) -- strict mode
- [Tailwind CSS](https://tailwindcss.com/) -- v4, custom green theme

## Documentation

- [Deployment Guide](docs/deployment-guide.md) -- release pipeline, GitHub Actions workflows, manual deploy and rollback
- [Testing Guide](docs/testing-guide.md) -- test runner, patterns, quality pipeline, and coverage opportunities

## Updates and Versioning

This project uses [Changesets](https://github.com/changesets/changesets) for version management. The release flow is fully automated through GitHub Actions:

1. Run `bunx changeset` to describe a change
2. Merge to `main` -- the Changesets action opens or updates a Version PR
3. Merging the Version PR creates a git tag (`v{version}`)
4. The tag triggers a deploy to Netlify via GitHub Actions

See the [Deployment Guide](docs/deployment-guide.md) for the full pipeline details.

## Authors

- [Joshua Pendragon](https://github.com/graffhyrum)
