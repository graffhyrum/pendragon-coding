---
"pendragon-coding": patch
---

fix(excerpt): word-boundary truncation in blog excerpt utility

`getExcerpt` now cuts at the last complete word at or before 200 characters
instead of slicing at byte boundary. Falls back to character-boundary cut
when the first 200 characters contain no space. Trailing space at the cut
position is stripped before appending the ellipsis.
