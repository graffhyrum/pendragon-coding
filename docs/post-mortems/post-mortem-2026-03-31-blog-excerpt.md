# Post-Mortem: Blog Post Previews with Excerpt Text

**Date**: 2026-03-31
**Bead**: pendragon-coding-6hq
**Status**: Completed (with inline fixup)

## Executive Summary

Replaced full Markdown rendering (`<Content/>`) in `BlogCard.astro` with a 200-character plain-text
excerpt. Added `src/utils/excerpt.ts` with a `getExcerpt(description, body)` utility and 18 unit
tests. Expert review found 2 red items (both fixed inline in a second commit) and 2 yellow items
(deferred to new beads). This was the first blog card excerpt feature in this codebase.

## Commits

- `94f3d60` — `feat: pendragon-coding-6hq — blog post previews with excerpt text`
- `21b604a` — `fixup: pendragon-coding-6hq — inline remediation for red findings`

---

## 1. What Was Built

**`src/utils/excerpt.ts`** — a single exported function `getExcerpt(description, body)` that:

1. Prefers `description` frontmatter when present and non-empty.
2. Falls back to stripping Markdown from `entry.body` via a private `stripMarkdown()` helper.
3. Truncates the source to 200 characters with a trailing ellipsis when exceeded.

The `stripMarkdown` helper removes code fences, inline code, images, links (preserving link text),
HTML tags, ATX headings, blockquote markers, horizontal rules, and bold/italic markers, then
collapses whitespace.

**`src/utils/excerpt.test.ts`** — 18 unit tests covering empty inputs, short/long descriptions,
Markdown stripping across all handled syntax forms, and the truncation boundary.

**`src/components/BlogCard.astro`** — replaced the `<Content/>` render with a `<p>` containing
the result of `getExcerpt(entry.data.description, entry.body)`.

---

## 2. What Went Well

1. **Utility-first design kept BlogCard clean** — isolating all excerpt logic in `excerpt.ts`
   meant `BlogCard.astro` required only a 4-line diff. The component stayed declarative; the
   complexity stayed in a testable pure function.

2. **Test-first approach caught edge cases early** — writing 18 unit tests before the expert
   review surfaced complete coverage of the `stripMarkdown` surface area. This reduced the number
   of defects the review could find in the stripping logic to zero.

3. **Plain-text fallback is correct for card context** — using `entry.body` (the raw Markdown
   source) as fallback rather than rendered HTML avoided any dependency on the Astro render
   pipeline at list-rendering time. The approach is simpler, faster, and produces clean output
   without a client-side renderer.

4. **Accepted scope boundary** — the setext heading stripping gap and word-boundary truncation
   were identified during implementation, deferred intentionally, and handed off as new beads
   rather than inflating this bead's scope.

---

## 3. What Needed Fixing

### Red finding 1: Long descriptions were not truncated

**What the expert review found**: When `description` was provided, the initial implementation
returned it verbatim without applying the 200-character cap. The acceptance criterion required all
excerpts to be capped at 200 characters regardless of source. A long description would overflow
the card layout.

**Why it was missed**: The initial implementation used two separate code paths — an early return
for `description` and a truncate-then-return path for `body`. The early-return path for
`description` never passed through the truncation logic. Tests validated that short descriptions
were returned correctly, but no test asserted that a description longer than 200 characters was
truncated.

**Fix**: The two code paths were unified into a single `source` variable
(`description || stripMarkdown(body ?? '')`), with a single truncation check applied to both.
This made the 200-character cap invariant across all input shapes.

**Test added**: A new test case asserting that a 250-character description is truncated to
200 characters plus an ellipsis.

### Red finding 2: Empty-string description fell through to body

**What the expert review found**: The original `if (description)` guard treated an empty-string
description as "no description" and fell through to the body. The review flagged this as
potentially unexpected behavior.

**Resolution**: Behavior was documented as intentional in both the JSDoc comment and an inline
comment (`// Non-empty description takes priority over body; empty string falls through`). An
empty-string `description` field in frontmatter is semantically equivalent to an absent field —
it would produce a blank card preview, which is worse than falling back to body text.

**Why it was missed**: The specification did not address the empty-string edge case explicitly.
This is a gap in acceptance criteria coverage, not a logic error.

---

## 4. Follow-up Items Created

| Item | Type | Rationale |
| ---- | ---- | --------- |
| Word-boundary truncation | New bead (yellow) | Current truncation cuts at exactly 200 chars, potentially mid-word. Truncating at the last word boundary before the limit is a UX improvement. |
| Setext heading stripping | New bead (yellow) | `stripMarkdown` handles ATX headings (`# Heading`) but not setext headings (underline style: `Heading\n=====`). Low-frequency in practice for this codebase. |

---

## 5. Lessons Learned

### Early-return branching creates invisible coverage gaps

When a function has multiple return paths, each path needs its own assertion for the invariant
that is supposed to apply globally. Here the 200-character cap was a global invariant, but the
early-return for `description` created a path where the invariant was never asserted. Unifying
branches before applying invariants (as the fixup did) makes global invariants structurally
impossible to skip.

**Pattern to apply**: When a function has N early-return paths and a global constraint, assert
the constraint on each path in tests — or unify the paths before the constraint so it applies
once.

### Acceptance criteria must explicitly address sentinel inputs

Empty string is a distinct case from `undefined`. If the spec is silent on `description: ""`
(empty string in frontmatter), the implementer and reviewer will disagree on what the correct
behavior is. Explicitly stating "empty string is treated as absent" in the AC eliminates this
ambiguity at definition time rather than at review time.

### Utility extraction is worth the extra file

`BlogCard.astro` previously contained ad-hoc rendering logic. Extracting `getExcerpt` to
`excerpt.ts` produced a testable, reusable function with 18 tests, compared to zero tests on the
inline logic it replaced. The cost was one extra file. This is a favorable trade for any
non-trivial transformation logic in a component.

---

## Related Files

- `src/utils/excerpt.ts` — excerpt utility
- `src/utils/excerpt.test.ts` — unit tests
- `src/components/BlogCard.astro` — consumer
