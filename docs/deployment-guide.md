# Deployment Guide

How pendragon-coding gets from source to production on Netlify.

## Deployment Model

Deploys happen **only** through GitHub Actions triggered by version tags (`v*`). Netlify's built-in auto-deploy is disabled across all contexts via `ignore = "exit 0"` in `netlify.toml` -- this causes Netlify's build hook to exit early and skip every automatic build. The only path to production is the tag-based GitHub Actions workflow.

## Release Pipeline

```mermaid
flowchart TD
    A[Developer runs bunx changeset] --> B[PR merged to main]
    B --> C[release.yml triggers]
    C --> D{Changesets action}
    D -->|unreleased changesets| E[Creates Version PR]
    D -->|Version PR merged| F[Publishes: updates package.json + CHANGELOG.md]
    F --> G[Creates git tag v{version}]
    G --> H[Tag push triggers deploy.yml]
    H --> I[bun install + bun run build]
    I --> J[nwtgck/actions-netlify@v3.0 deploys dist/ to Netlify]
    J --> K[pendragon-coding.netlify.app updated]
```

### Step-by-step

1. **Create a changeset** -- run `bunx changeset` and describe the change. This creates a markdown file in `.changeset/`.
2. **Merge PR to main** -- the `release.yml` workflow fires on every push to `main`.
3. **Changesets action** -- if unreleased changesets exist, the action opens a "Version Packages" PR that bumps `package.json` and updates `CHANGELOG.md`. If that PR is already open, it updates it.
4. **Merge the Version PR** -- Changesets publishes: it consumes the changeset files, finalizes the changelog, and commits the version bump.
5. **Tag creation** -- the release workflow creates a git tag `v{version}` and pushes it.
6. **Deploy** -- the tag push triggers `deploy.yml`, which checks out the code, installs dependencies with Bun, runs `bun run build`, and deploys the `dist/` directory to Netlify using `nwtgck/actions-netlify@v3.0`.

## GitHub Actions Workflows

### deploy.yml

| Field | Value |
|-------|-------|
| **Trigger** | Git tags matching `v*` |
| **Runner** | Ubuntu latest |
| **Steps** | Checkout -> Setup Bun -> `bun install` -> `bun run build` -> Deploy to Netlify |
| **Action** | `nwtgck/actions-netlify@v3.0` |
| **Secrets** | `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `GITHUB_TOKEN` |

### release.yml

| Field | Value |
|-------|-------|
| **Trigger** | Push to `main` |
| **Concurrency** | Serialized per workflow (prevents race conditions) |
| **Permissions** | Write access to `contents` and `pull-requests` |
| **Steps** | Checkout -> Setup Bun -> `bun install` -> Changesets action |
| **On publish** | Creates git tag `v{version}` and pushes, which triggers `deploy.yml` |

### opencode.yml

| Field | Value |
|-------|-------|
| **Trigger** | Issue comments containing `/oc` or `/opencode` |
| **Purpose** | AI code review integration |

## Pre-build Checks

The `prebuild` script runs automatically before `bun run build`:

```
tsgo --noEmit && bunx astro check
```

- `tsgo --noEmit` -- TypeScript type checking without emitting files
- `bunx astro check` -- Astro-specific template and configuration validation

If either check fails, the build aborts and the deploy does not proceed.

## Manual Deployment

To deploy a specific commit manually:

```bash
# Create and push a tag
git tag v2.6.2
git push origin v2.6.2
```

This triggers `deploy.yml` directly, bypassing the Changesets flow. Use this only for hotfixes or when the automated pipeline is not suitable.

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
- **Auto-deploy override**: All contexts set `ignore = "exit 0"`, which tells Netlify to skip its own build trigger entirely. Deploys are controlled exclusively by GitHub Actions.

## See Also

- [Testing Guide](testing-guide.md)
