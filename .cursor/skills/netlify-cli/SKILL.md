---
name: netlify-cli
description: Netlify CLI for this repo — auth, link, dev, deploy, status, functions; tag-only production via GHA and intentional `ignore = exit 0`. Use when working with Netlify, pendragon-coding.netlify.app, netlify.toml, deploy previews, canceled Netlify Git builds, or local Netlify emulation.
---

# Netlify CLI (pendragon-coding)

## Install

```bash
npm install -g netlify-cli
```

Prefer project-local: `bunx netlify <cmd>` (no global install).

## First-time auth and link

```bash
netlify login
netlify status
netlify link
```

`link` binds this repo to the site (writes `.netlify/state.json`; keep secrets out of git). Site id matches README badge / `NETLIFY_SITE_ID` in GitHub secrets.

## Common workflows

| Goal                                | Command                                             |
| ----------------------------------- | --------------------------------------------------- |
| Local dev with Netlify features     | `netlify dev`                                       |
| Serve built `dist/` like production | `netlify serve`                                     |
| Draft deploy (URL preview)          | `bun run build && netlify deploy --dir dist`        |
| Production from CLI                 | `bun run build && netlify deploy --prod --dir dist` |
| Who am I / linked site              | `netlify status` / `netlify status --json`          |

Build output for this Astro app is always `dist/` (see `netlify.toml`).

## Ignore builds (`netlify.toml`)

Netlify’s optional **ignore** command runs before a Git-triggered build: **exit 0 = skip build**, **non-zero = run build**.

**This repo** sets `ignore = "exit 0"` on all contexts so Netlify **never** runs its builder on routine `main` pushes. You will see skipped/canceled Netlify **Git** builds — that is intentional. **Production** updates when a `v*` tag triggers `.github/workflows/deploy.yml`, which builds in Actions and deploys `dist/` via the Netlify API.

To run Netlify’s builder for a branch (not this project’s default), change or remove `ignore` in `netlify.toml` or use [reference.md](reference.md) for diff-based ignore patterns.

**Build hooks** (Netlify docs) may still trigger builds regardless of `ignore` — use when you need an exception.

## Repo deploy model

- **Routine `main`**: No Netlify Git build (`exit 0` ignore).
- **Release**: Merge Version PR → `release.yml` publishes → pushes `v*` tag → `deploy.yml` builds and deploys to Netlify.
- **Manual**: `bun run build && netlify deploy --prod --dir dist` (CLI), or push a `v*` tag to trigger `deploy.yml`.

More commands, env vars, and official doc links: [reference.md](reference.md).
