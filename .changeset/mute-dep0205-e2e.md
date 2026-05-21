---
'pendragon-coding': patch
---

Patch Playwright and @tailwindcss/node to use Node `module.registerHooks()` on Node 24+, removing DEP0205 deprecation noise during e2e (upstream: tailwindlabs/tailwindcss#20028, microsoft/playwright#40877).
