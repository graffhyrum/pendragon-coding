---
'pendragon-coding': patch
---

fix(blog-sort): guard popstate handler registration against duplicate calls

Move popstate listener inside the INITIALIZED_ATTR guard so that calling
initBlogSort() multiple times (e.g. on htmx:afterSwap on the same element)
does not accumulate duplicate handlers. Adds DOM integration tests using
happy-dom covering AC1 (double-init does not double-fire) and AC2 (popstate
applies sort from URL on single init).

Closes pendragon-coding-0yf
