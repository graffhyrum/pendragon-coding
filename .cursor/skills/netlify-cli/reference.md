# Netlify CLI — reference

Official guides: [CLI get started](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/), [local development](https://docs.netlify.com/api-and-cli-guides/cli-guides/local-development/), [functions](https://docs.netlify.com/api-and-cli-guides/cli-guides/manage-functions/), [VS Code debug](https://docs.netlify.com/api-and-cli-guides/cli-guides/debug-with-vscode/).

## Ignore builds

Doc: [Ignore builds](https://docs.netlify.com/build/configure-builds/ignore-builds).

- Custom command **exit 0** → Netlify **skips** the build (“no relevant changes” or intentional cancel).
- **Exit non-zero** (usually 1) → build **runs**.

Example mimicking default “skip only if repo unchanged between commits”:

```toml
[build]
	ignore = "git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF"
```

Scope paths after `$COMMIT_REF` if only certain directories should affect builds.

## Useful CLI commands

- `netlify init` — wire continuous deployment for a new or existing site.
- `netlify sites:list` / `netlify sites:create` — site management.
- `netlify env:list` / `netlify env:set` — managed environment variables.
- `netlify functions:list` / `netlify functions:invoke` — serverless debugging.
- `netlify deploy --json` — machine-readable output for scripts.
- `netlify api` — raw Open API calls (advanced).

## This project

| File / secret                           | Role                                            |
| --------------------------------------- | ----------------------------------------------- |
| `netlify.toml`                          | `bun run build`, publish `dist/`                |
| `.github/workflows/deploy.yml`          | Tag `v*` → Bun build → `nwtgck/actions-netlify` |
| `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` | GitHub Actions secrets for API deploy           |

When debugging “build canceled” on Netlify, read the deploy log line for **ignore command** and confirm `netlify.toml` does not force `exit 0` unless you truly want all git builds skipped.
