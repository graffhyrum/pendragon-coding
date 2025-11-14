---
"pendragon-coding": patch
---

Refactor testimonials to use ContentSection component like myWork page

- Convert testimonials from Astro Content Collections to static TypeScript data file
- Update testimonials page to use ContentContainer and BaseLayout instead of CollectionPageLayout
- Remove individual testimonial markdown files and dynamic routing
- Update API testimonials endpoint to use static content approach
- Clean up obsolete TestimonialLayout and content collection configuration
- Update documentation to reflect new testimonials structure

This change makes testimonials consistent with other content pages (myWork, bookshelf) by using the same ContentSection/ContentCard architecture instead of content collections.