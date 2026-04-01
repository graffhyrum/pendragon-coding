---
"pendragon-coding": patch
---

fix(excerpt): strip setext-style headings in blog excerpt markdown stripper

ATX headings (`# Heading`) were already stripped but setext headings (heading text
followed by `===` or `---` underlines) were not. The horizontal-rule regex was
stripping the underline while leaving the heading text orphaned. A new regex runs
before the horizontal-rule step to remove the heading text and its underline together.
