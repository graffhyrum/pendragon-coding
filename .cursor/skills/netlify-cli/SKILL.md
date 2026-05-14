---
name: netlify-cli
description: Netlify CLI for this repo — auth, link, dev, deploy, status, functions. Use when working with Netlify, pendragon-coding.netlify.app, netlify.toml, deploy previews, or local Netlify emulation.
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

Netlify runs an optional **ignore** command before building. **Exit 0 = cancel build** (“nothing to do”). **Exit 1 = run build**. A literal `ignore = "exit 0"` cancels **every** git-triggered build, which looks like a failed or “canceled” deploy in the UI. Use a real diff check (see [reference.md](reference.md)) or omit `ignore` if Netlify should build on git events.

**Build hooks** (per Netlify docs) can still trigger builds regardless of ignore — prefer hooks or `netlify deploy --trigger` when you need a build that must not be skipped.

## Repo deploy model

- **Releases**: Changesets on `main` → version PR → tag `v*` → `.github/workflows/deploy.yml` builds with Bun and deploys `dist/` via `NETLIFY_AUTH_TOKEN`.
- **Netlify git**: Builds when your Netlify site’s branch/context rules say so (no blanket `exit 0` in `netlify.toml`).

More commands, env vars, and official doc links: [reference.md](reference.md).
