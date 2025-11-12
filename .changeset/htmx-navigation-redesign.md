---
"pendragon-coding": minor
---

Implement HTMX-based navigation with HATEOAS pattern for seamless page transitions

This release introduces a modern navigation system using HTMX that provides a single-page application experience while maintaining progressive enhancement and SEO-friendly fallbacks.

**New Features:**
- HTMX-powered navigation that swaps content without full page reloads
- Smooth transitions between pages using HTMX's built-in transition system
- Browser history and URL preservation with `hx-push-url`
- Seven new API endpoints (`/api/*.html`) returning HTML fragments for HTMX requests
- Progressive enhancement: navigation works with and without JavaScript

**Improvements:**
- Fixed animation stutter by eliminating conflicting CSS animations during HTMX transitions
- Added `noAnimation` prop system to Skills and Skill components for conditional animation control
- Faster page navigation with reduced bandwidth usage (only content updates, not full page)
- Maintained SEO compatibility with full-page fallbacks for search engine crawlers

**Technical Details:**
- Navigation links use `hx-get`, `hx-target`, `hx-swap`, and `hx-push-url` attributes
- Original page routes remain unchanged for direct access and SEO
- API endpoints share components with full pages, ensuring consistency
- HTMX library (already included) is now actively utilized
