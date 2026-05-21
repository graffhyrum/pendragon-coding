---
'pendragon-coding': patch
---

Fix release pipeline so tags are cut only on main after the Version PR merges, and production deploy runs from Release via workflow_call instead of relying on Netlify Git builds or tag webhook alone.
