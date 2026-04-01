---
'pendragon-coding': patch
---

fix(a11y): blog sort button and prose link contrast for WCAG AA

- Sort button active state: `bg-green-600 text-white` (3.21:1) → `bg-green-800 text-green-50` (passes 4.5:1) in both light and dark modes
- `.content a` prose links: `text-blue-300` in light mode (1.5:1 on bg-green-200) → `text-blue-700` (passes 4.5:1); dark mode stays `text-blue-300`
- Closes pendragon-coding-we9: all 16 axe-core contrast audit tests pass across 8 pages × 2 modes
