---
'pendragon-coding': patch
---

fix: exclude e2e tests from default `bun test` run

E2E tests require a running preview server and now only run when
explicitly targeted. Unit tests run cleanly via `bun test` and `bun vet`.
