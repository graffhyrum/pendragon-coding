---
"pendragon-coding": minor
---

Add Playwright testing with basic sanity and accessibility tests

This change adds comprehensive test coverage using Playwright:
- Sanity tests for all pages (load tests, navigation, core content)
- Accessibility tests using axe-core (WCAG compliance, contrast, heading hierarchy)
- Test scripts in package.json (test, test:headed, test:ui, test:report)
