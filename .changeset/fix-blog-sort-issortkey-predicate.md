---
'pendragon-coding': patch
---

fix(blog-sort): replace unsound SortKey cast with isSortKey type predicate

Adds a private `isSortKey` type predicate to guard `applySort`'s button
iteration loop, replacing the unsafe `as SortKey` cast. Buttons with
unrecognised `data-sort` attribute values are now skipped rather than
silently indexing `SORT_ANNOUNCEMENTS` with `undefined`.
