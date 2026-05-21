---
'pendragon-coding': patch
---

Route local dev through portless for a stable Local Dev URL (`https://pendragon-coding.localhost`). Add split `dev` / `dev:app` scripts, pin portless as a devDependency, bump Node engines to >=24, vendor the upstream portless agent skill, and prepend Windows OpenSSL to PATH via `scripts/run-portless.ts` when winget does not.
