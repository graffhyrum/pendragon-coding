---
'pendragon-coding': minor
---

refactor: deepen frontend architecture — extract utilities, fix bugs, consolidate components

- Extract shared slug utility (toSlug) from 4 duplicated implementations, fixing a regex ordering bug in CollectionPageLayout
- Consolidate 4 duplicate component pairs (Card, Skill, Skills, Navigation) into canonical locations
- Merge HTMX attributes and active-page detection into Navigation (was missing from live site)
- Fix Card responsive sizing with min() wrapper to prevent mobile overflow
- Fix sidebar dark mode bug: convert from broken @media prefers-color-scheme to class-based dark: utilities
- Extract sidebar client script to standalone module with htmx:afterSwap support
- Add theme contract constants with sync guard tests for inline scripts
- Extract shared layout CSS from duplicate style blocks
- Delete dead STYLING_CONFIG (zero imports)
