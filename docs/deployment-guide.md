# Deployment Guide

How pendragon-coding gets from source to production on Netlify.

## Deployment Model

**Production** updates when `release.yml` finishes a **version release on `main`**: it tags `origin/main` at `v{package.json version}`, then calls `.github/workflows/deploy.yml` via `workflow_call` to build and upload `dist/` to Netlify (`nwtgck/actions-netlify`). Tags are **not** cut when Changesets only opens or updates the Version PR. Routine merges to `main` without a version bump do not deploy.

**Netlify’s Git-connected builder** is intentionally disabled for all contexts: `netlify.toml` sets `ignore = "exit 0"`, so Netlify **skips** every build triggered by pushes to `main` (or branches). You avoid a redundant Netlify build and deploy on every commit; the live site still updates when the tag pipeline finishes.

### Verifying a release

1. Merge the Version PR → **Release** runs on `main` with `hasChangesets=false` and no new Version PR number.
2. **Sync release tag on main** creates or moves `v{version}` to `origin/main` HEAD, then the **Deploy release** job runs `deploy.yml` (workflow_call).
3. In the Netlify UI, a **skipped/canceled** Git build for `main` is **expected**; look for a **successful** API deploy (message like `Deploy release v…`), not a completed Netlify “build from Git” for every `main` commit.

## Release Pipeline

```mermaid
flowchart TD
    A[Developer runs bunx changeset] --> B[PR merged to main]
    B --> C[release.yml triggers]
    C --> D{Changesets action}
    D -->|unreleased changesets| E[Creates Version PR]
    D -->|Version PR merged| F[Publishes: updates package.json + CHANGELOG.md]
    F --> G[Tags origin/main at v{version}]
    G --> H[release.yml calls deploy.yml]
    H --> I[bun install + bun run build]
    I --> J[nwtgck/actions-netlify@v3.0 deploys dist/ to Netlify]
    J --> K[pendragon-coding.netlify.app updated]
```

### Step-by-step

1. **Create a changeset** -- run `bunx changeset` and describe the change. This creates a markdown file in `.changeset/`.
2. **Merge PR to main** -- the `release.yml` workflow fires on every push to `main`.
3. **Changesets action** -- if unreleased changesets exist, the action opens a "Version Packages" PR that bumps `package.json` and updates `CHANGELOG.md`. If that PR is already open, it updates it.
4. **Merge the Version PR** -- Changesets publishes: it consumes the changeset files, finalizes the changelog, and commits the version bump.
5. **Tag sync** -- only when `hasChangesets=false`, no Version PR was opened in that run, and the job checks out `origin/main` (not `changeset-release/main`). Creates or moves `v{version}` to `main` HEAD; skips deploy if the tag already points at `main` HEAD.
6. **Deploy** -- `release.yml` invokes `deploy.yml` with `ref: refs/tags/v{version}` so production does not depend on Netlify Git builds or tag-push webhooks.

## GitHub Actions Workflows

### deploy.yml

| Field       | Value                                                                                                                               |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Trigger** | `workflow_call` from `release.yml`; manual **`workflow_dispatch`** with `ref` (e.g. `refs/heads/main`) and/or `tag` (e.g. `v2.9.0`) |
| **Runner**  | Ubuntu latest                                                                                                                       |
| **Steps**   | Checkout -> Setup Node 24 -> Setup Bun -> `bun install` -> `bun run build` -> Deploy to Netlify                                     |
| **Action**  | `nwtgck/actions-netlify@v3.0`                                                                                                       |
| **Secrets** | `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `GITHUB_TOKEN`                                                                             |

### release.yml

| Field           | Value                                                                                                                                                                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trigger**     | Push to `main`                                                                                                                                                                                                                                                    |
| **Concurrency** | Serialized per workflow (prevents race conditions)                                                                                                                                                                                                                |
| **Permissions** | Write access to `contents` and `pull-requests`                                                                                                                                                                                                                    |
| **Steps**       | Checkout -> Setup Bun -> `bun install` -> Changesets action -> sync tag on `origin/main` -> optional `deploy` job (`workflow_call`)                                                                                                                               |
| **Tag sync**    | Runs only when no pending changesets and no Version PR was created/updated in that run; always tags `origin/main`, never `changeset-release/main`. Deploy uses `workflow_call`, not tag-push webhooks. Set **`RELEASE_REPO_PAT`** so checkout/tag push use a PAT. |

### opencode.yml

| Field       | Value                                          |
| ----------- | ---------------------------------------------- |
| **Trigger** | Issue comments containing `/oc` or `/opencode` |
| **Purpose** | AI code review integration                     |

## Pre-build Checks

The `prebuild` script runs automatically before `bun run build`:

```
tsgo --noEmit && bunx astro check
```

- `tsgo --noEmit` -- TypeScript type checking without emitting files
- `bunx astro check` -- Astro-specific template and configuration validation

If either check fails, the build aborts and the deploy does not proceed.

### RCA: “Node.js v20.20.2 is not supported by Astro” in GitHub Actions

| What the log implies         | What actually failed                                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `tsgo --noEmit` printed last | `prebuild` runs `bun typecheck && bunx astro check`. `tsgo` finished; the next step is **`bunx astro check`**. |

**Proof (local tree):**

1. `package.json` `prebuild` is `bun typecheck && bunx astro check` — Astro runs in the second clause after typecheck.
2. `node_modules/astro/package.json` declares `"engines": { "node": ">=22.12.0" }`.
3. `node_modules/astro/bin/astro.mjs` starts with `#!/usr/bin/env node` and hardcodes `const engines = '>=22.12.0';` — the CLI is executed by **Node from `PATH`**, not the Bun runtime, so the runner’s default Node (historically **20.x** on `ubuntu-latest` when `setup-node` is missing) produces exactly: `Node.js v20.20.2 is not supported by Astro!`.

**Netlify logs** for this repo: Git builds are skipped by `ignore = "exit 0"`, so you will see “Canceled build due to no content change” / ignore exit 0 — that is **not** the same failure as the Actions log above. Production depends on `deploy.yml` succeeding after the tag push.

**Fix:** `deploy.yml` runs `actions/setup-node` with Node **24** (matches Netlify UI; satisfies Astro’s `>=22.12`) before `bun install` / `bun run build` so `node` on `PATH` satisfies Astro’s CLI. Bun remains the package manager and script runner.

## Manual Deployment

To deploy a specific commit manually:

```bash
gh workflow run "Deploy to Production" --repo graffhyrum/pendragon-coding -f ref=refs/heads/main
```

Or deploy an existing tag:

```bash
gh workflow run "Deploy to Production" --repo graffhyrum/pendragon-coding -f tag=v2.9.0
```

Use `ref=` when the tag points at the wrong commit; use `tag=` when the tag is correct.

## Rollback

Two approaches:

1. **Re-tag a previous commit** -- check out the known-good commit, tag it with a new version, and push the tag. The deploy workflow builds and deploys that commit.

   ```bash
   git checkout v2.6.0
   git tag v2.6.1-hotfix
   git push origin v2.6.1-hotfix
   ```

2. **Revert and re-release** -- revert the problematic commit on `main`, let Changesets create a new version, and deploy through the normal pipeline.

## Netlify Configuration

From `netlify.toml`:

- **Build command**: `bun run build`
- **Publish directory**: `dist/`
- **Ignore builds**: `ignore = "exit 0"` on `[build]`, `[context.production]`, and `[context.branch-deploy]` — Netlify **never** runs its own build for Git events; see [Netlify ignore builds](https://docs.netlify.com/build/configure-builds/ignore-builds/) (exit 0 skips the build). Production traffic is updated by **Actions** on tag deploys only.

## See Also

- [Testing Guide](testing-guide.md)
