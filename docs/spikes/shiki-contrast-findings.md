---
spike: pendragon-coding-3g8
unblocks: pendragon-coding-lh2
date: 2026-04-01
---

# Shiki Syntax Highlight Contrast — Spike Findings

## Current Setup

- **Framework**: Astro 5.18.x
- **Shiki version**: 3.x (bundled via `@astrojs/markdown-remark`)
- **Active theme**: `github-dark` (Astro default — no `shikiConfig` in `astro.config.mjs`)
- **Code block background**: `#24292e` (the Shiki inline `background-color` wins — see Cascade Analysis below)
- **Body backgrounds**: light mode `bg-green-200` = `#bbf7d0`, dark mode `bg-green-950` = `#052e16`

## Cascade Analysis

**Conclusion: Shiki's inline `background-color` wins. The CSS `pre { background: rgba(255,255,255,0.5) }` rule has no effect on Shiki-rendered code blocks.**

### Evidence

In `node_modules/@astrojs/markdown-remark/dist/shiki.js` (the Astro-Shiki bridge), the `pre` transformer at lines 51–64 reads:

```js
const styleValue =
	(normalizePropAsString(node.properties.style) ?? '') +
	(attributesStyle ? `; ${attributesStyle}` : '');
// ...
node.properties.style = styleValue + '; overflow-x: auto;';
```

Astro **preserves** the Shiki-generated inline `style` attribute (which includes `background-color:#24292e`) and merely appends `overflow-x: auto`. The CSS rule `pre { background: rgba(255,255,255,0.5) }` is not `!important`, so the inline style's higher specificity (specificity: element attribute > class rule) wins the cascade.

The rendered `<pre>` element therefore has `style="background-color:#24292e; overflow-x: auto;"`, and the CSS rule is completely overridden.

### Implication

All analysis against the **light background scenario is moot in production**. Code block background is `#24292e` (dark) in both light mode and dark mode until something changes the cascade.

## Failing Token Colors

Token colors from `github-dark.mjs` analyzed against `#24292e` (dark bg, Scenario 1 — actual production scenario).

| Token scope                                                   | Hex color | Ratio (dark bg) | WCAG AA (4.5:1)                   |
| ------------------------------------------------------------- | --------- | --------------- | --------------------------------- |
| `comment`, `punctuation.definition.comment`, `string.comment` | `#6a737d` | 3.05 : 1        | **FAIL**                          |
| `carriage-return`                                             | `#24292e` | 1.00 : 1        | **FAIL** (invisible — same as bg) |
| `markup.ignored`, `markup.untracked`                          | `#2f363d` | 1.20 : 1        | **FAIL** (near-invisible)         |

All other token colors pass WCAG AA on the dark bg:

| Token scope                                                           | Hex color | Ratio (dark bg) | WCAG AA |
| --------------------------------------------------------------------- | --------- | --------------- | ------- |
| `keyword`, `storage`, `storage.type`                                  | `#f97583` | 5.52 : 1        | pass    |
| `entity`, `entity.name`, `meta.diff.range`                            | `#b392f0` | 5.79 : 1        | pass    |
| `constant`, `variable.other.constant`, `support`, etc.                | `#79b8ff` | 7.06 : 1        | pass    |
| `variable`, `punctuation.definition.list.begin.markdown`              | `#ffab70` | 7.90 : 1        | pass    |
| `invalid.*`, `message.error`, `markup.deleted`                        | `#fdaeb7` | 8.32 : 1        | pass    |
| `string`, `punctuation.definition.string`                             | `#9ecbff` | 8.69 : 1        | pass    |
| `entity.name.tag`, `markup.quote`                                     | `#85e89d` | 9.80 : 1        | pass    |
| `brackethighlighter.*`                                                | `#d1d5da` | 9.95 : 1        | pass    |
| `variable.parameter.function`, `variable.other`, `markup.bold/italic` | `#e1e4e8` | 11.50 : 1       | pass    |
| `source.regexp`, `string.regexp`, `constant.other.reference.link`     | `#dbedff` | 12.27 : 1       | pass    |

**Net failures in production: 3 token colors.** One of them (`#6a737d`, comment color) already has a CSS `!important` override in `styles.css` (lines 52–56) that raises it to `#8b949e`. The other two (`#24292e` carriage-return text, `#2f363d` markup.ignored/untracked) are edge-case scopes that only fire in diff/diff-like content, not in the TypeScript/JavaScript/plain-text code blocks actually used on this blog.

## Already-Fixed Issues

- **Comment color** `#6A737D` (ratio 3.05 : 1) → overridden to `#8b949e` (ratio 4.77 : 1) via `!important` CSS rule in `styles.css` lines 52–56. This fix was correct and sufficient.

## Practical Scope of Remaining Failures

Given the blog's code block language tags (`ts`, `js`, plain — from `src/content/blog/0002.md` and `0003.md`):

- **`carriage-return` scope** (`#24292e`): This scope is only triggered when the source code literally contains a Windows carriage-return character (`\r`) in a code block. Extremely unlikely in the blog's TypeScript/JavaScript examples. **Low priority.**
- **`markup.ignored` / `markup.untracked` scope** (`#2f363d`): These scopes are only active in `diff`-language code blocks. The blog does not use `diff` code blocks. **Out of scope for current blog content.**

## Remediation Approach: Recommendation

**Recommendation: Option A (surgical CSS override), applied narrowly.**

### Justification

Only 1 token color (`#6a737d`, comment text) is a real-world failure on the dark background used by actual blog code blocks, and it is **already fixed**. The remaining 2 failures (`carriage-return`, `markup.ignored/untracked`) do not appear in any code blocks the blog actually renders.

**The contrast problem is already solved.** The existing `!important` override for `#6a737d` → `#8b949e` in `styles.css` is the complete remediation needed for WCAG AA compliance on this blog's code blocks.

If the blog is later extended with:

- `diff` language code blocks → add `#2f363d` override or switch to Option B/C
- Code containing literal carriage returns → add `#24292e` on `carriage-return` scope

### Option Reference

| Option                                   | Description                                                                                               | Verdict                                                 |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **A — CSS overrides for failing tokens** | Add `!important` overrides per failing color. Surgical, minimal blast radius.                             | **Recommended** (already done for only real failure)    |
| B — Switch to WCAG-compliant theme       | E.g. `github-dark-high-contrast`. Visual change to all code blocks.                                       | Overkill given only 1 real failure                      |
| C — Dual-theme (light/dark)              | `shikiConfig: { themes: { light: ..., dark: ... } }` in `astro.config.mjs`. Adds CSS variable complexity. | Better if light-mode code blocks are desired eventually |
| D — Fix inline background cascade        | Add `!important` to `pre { background }`. Creates 11 new failures on light bg.                            | Wrong direction — would regress contrast                |

## Token Color Map (Full)

Generated by `scripts/analyze-shiki-contrast.ts`.

| Color     | Dark bg (#24292e) ratio | Light bg (#ddfbe8) ratio | Dark FAIL | Light FAIL | Representative scopes                       |
| --------- | ----------------------- | ------------------------ | --------- | ---------- | ------------------------------------------- |
| `#6a737d` | 3.05                    | 4.37                     | **FAIL**  | **FAIL**   | comment, punctuation.definition.comment     |
| `#24292e` | 1.00                    | 13.30                    | **FAIL**  | pass       | carriage-return (fg = bg, invisible)        |
| `#2f363d` | 1.20                    | 11.10                    | **FAIL**  | pass       | markup.ignored, markup.untracked            |
| `#f97583` | 5.52                    | 2.41                     | pass      | FAIL       | keyword, storage, storage.type              |
| `#b392f0` | 5.79                    | 2.30                     | pass      | FAIL       | entity, entity.name, meta.diff.range        |
| `#79b8ff` | 7.06                    | 1.88                     | pass      | FAIL       | constant, support, markup.heading           |
| `#ffab70` | 7.90                    | 1.68                     | pass      | FAIL       | variable, markup.changed                    |
| `#fdaeb7` | 8.32                    | 1.60                     | pass      | FAIL       | invalid.\*, markup.deleted                  |
| `#9ecbff` | 8.69                    | 1.53                     | pass      | FAIL       | string, punctuation.definition.string       |
| `#85e89d` | 9.80                    | 1.36                     | pass      | FAIL       | entity.name.tag, markup.quote               |
| `#d1d5da` | 9.95                    | 1.34                     | pass      | FAIL       | brackethighlighter.\*                       |
| `#e1e4e8` | 11.50                   | 1.16                     | pass      | FAIL       | variable.parameter.function, variable.other |
| `#dbedff` | 12.27                   | 1.08                     | pass      | FAIL       | source.regexp, string.regexp                |

Light bg computed as `rgba(255,255,255,0.5)` blended over `#bbf7d0` = `#ddfbe8`.
