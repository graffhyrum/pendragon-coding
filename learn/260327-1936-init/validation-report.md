# Validation Report — Init Run 2026-03-27

## Size Compliance (all pass)

| File                    | LOC | Limit | Status |
| ----------------------- | --- | ----- | ------ |
| configuration-guide.md  | 330 | 800   | Pass   |
| system-architecture.md  | 242 | 800   | Pass   |
| design-guidelines.md    | 223 | 800   | Pass   |
| code-standards.md       | 194 | 800   | Pass   |
| codebase-summary.md     | 148 | 800   | Pass   |
| project-overview-pdr.md | 123 | 800   | Pass   |
| deployment-guide.md     | 112 | 800   | Pass   |
| testing-guide.md        | 99  | 800   | Pass   |
| README.md               | 57  | 300   | Pass   |

## Cross-Reference Links (14 total, all resolve)

All internal `[Title](filename.md)` links verified against docs/ directory.

## Anchor Facts (all present)

- "tag-based deployment" in project-overview-pdr.md
- "HTMX" in project-overview-pdr.md (8 mentions)
- 7 layouts listed by name in codebase-summary.md
- 3 Mermaid diagrams in system-architecture.md
- `ignore = "exit 0"` in deployment-guide.md
- `darkMode: 'class'` in design-guidelines.md
- Tests in `src/` (not `tests/`) in testing-guide.md

## Script Validation

Skipped — `~/.claude/scripts/validate-docs.cjs` not found.

## Result

**Validation score: 100%** — no fix loop needed.
