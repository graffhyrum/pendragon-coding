---
'pendragon-coding': patch
---

Coordinate sort URL pushState with HTMX history: add htmx:historyRestore listener in navigation.ts to re-apply sort state on HTMX back/forward restores, and add hx-history="false" to the CollectionPageLayout main-content wrapper to prevent stale sorted DOM snapshots being cached.
