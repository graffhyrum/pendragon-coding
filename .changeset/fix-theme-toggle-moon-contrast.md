---
"pendragon-coding": patch
---

fix: theme toggle moon icon contrast in dark mode — add aria-hidden="true" to sun and moon SVG icons in ThemeToggle.astro; icons are decorative (button carries aria-label and aria-checked), marking them hidden removes them from axe-core contrast checks and correctly signals their presentational role
