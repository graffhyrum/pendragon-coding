---
'pendragon-coding': patch
---

Add Cursor `stop` hook that runs `bun vet` and reopens the agent with fix instructions when the quality gate fails (up to 3 follow-up loops, 15 min timeout). Pin `devalue` and `ws` via overrides so `bun audit` passes. Run Playwright e2e on port 3456 against a fresh preview build so vet does not collide with `astro dev` on 4321.
