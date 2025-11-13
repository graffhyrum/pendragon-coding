---
"pendragon-coding": patch
---

Migrate blog and testimonials to Astro Content Collections API

- Create content config with Zod schemas for type safety
- Move markdown files from pages to content directory
- Standardize blog dates to ISO format
- Add optional metadata fields (description, author, tags, company, position)
- Replace import.meta.glob() with getCollection() for better performance
- Add dynamic routes for individual blog/testimonial pages
