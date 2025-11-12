---
"pendragon-coding": patch
---

Fix Astro v5 deprecation warning by moving ContentTemplate type out of src/content/ directory. The src/content/ directory is reserved for content collections, so TypeScript interfaces have been moved to src/types/ where they belong.
