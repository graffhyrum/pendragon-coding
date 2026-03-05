---
"pendragon-coding": patch
---

fix: remove dark-mode text-shadow from ContentWithSidebarLayout

Removes the `html.dark body { text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }` block from
ContentWithSidebarLayout that was missed when the same rule was removed from BaseLayout.
Bookshelf, MyWork, Shoutouts, and Testimonials pages now render sharp text in dark mode.