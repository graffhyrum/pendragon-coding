# Portless — pendragon-coding reference

Repo-specific overlay. General portless usage: [SKILL.md](./SKILL.md) (vendored from [vercel-labs/portless v0.13.0](https://github.com/vercel-labs/portless/blob/v0.13.0/skills/portless/SKILL.md)).

## Re-vendor upstream skill

```bash
curl -fsSL "https://raw.githubusercontent.com/vercel-labs/portless/v0.13.0/skills/portless/SKILL.md" \
  -o .cursor/skills/portless/SKILL.md
```

Bump the tag when `package.json` `portless` version changes.

## This project

| Item                           | Value                                                                                                                                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Local Dev URL**              | https://pendragon-coding.localhost                                                                                                                                                                   |
| `package.json` `portless.name` | `pendragon-coding`                                                                                                                                                                                   |
| `dev` / `start`                | `portless` (runs `dev:app` via config)                                                                                                                                                               |
| `dev:app`                      | `bunx astro dev` (direct Astro)                                                                                                                                                                      |
| Bypass proxy                   | `PORTLESS=0 bun run dev:app`                                                                                                                                                                         |
| One-time HTTPS trust           | `bunx portless trust` (Windows: elevated terminal if needed)                                                                                                                                         |
| OpenSSL not on PATH            | Set `OPENSSL_BIN_DIR` to the `bin` directory (any OS). `bun run dev` uses [scripts/run-portless.ts](../../../scripts/run-portless.ts): `Bun.which('openssl')`, then prepends search dirs until found |
| Windows OpenSSL (winget)       | `winget install -e --id ShiningLight.OpenSSL.Dev`; default `C:\Program Files\OpenSSL-Win64\bin` is in the script’s Windows fallback list when not on PATH                                            |
| Permanent PATH (optional)      | `[Environment]::SetEnvironmentVariable('Path', 'C:\Program Files\OpenSSL-Win64\bin;' + [Environment]::GetEnvironmentVariable('Path','User'), 'User')` then restart terminal                          |
| Agent/browser base URL         | `PORTLESS_URL` or https://pendragon-coding.localhost                                                                                                                                                 |

## Do not use portless for

- `bun vet` / `bun fastvet` — unchanged; Playwright uses `astro preview` on port **3456** ([playwright.config.ts](../../../playwright.config.ts))
- Optional integration tests that expect preview on **4321** — manual `bun run build && bun run preview` only
- CI / GitHub Actions — no portless in deploy workflows

## Worktrees

Linked git worktrees get a branch-prefixed hostname automatically (e.g. `fix-ui.pendragon-coding.localhost`). No extra config.

## Fallback if HTTPS / port 443 fails

```bash
PORTLESS_HTTPS=0 bun run dev
# or
bunx portless proxy start -p 1355
bun run dev
```

Document in README only when needed; default is HTTPS on 443.
