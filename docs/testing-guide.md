# Testing Guide

How tests are structured and run in pendragon-coding.

## Test Runner

Tests use Bun's built-in test runner via the `bun:test` module. No external test framework (Jest, Vitest) is needed -- Bun provides `describe`, `it`/`test`, `expect`, and lifecycle hooks natively.

## Test Environment

[happy-dom](https://github.com/nicedayfor/happy-dom) (v20.0.11) is configured as the test environment, providing DOM simulation for any tests that need browser-like APIs without a real browser.

## Current Coverage

Test files (4 files, 37 tests):

- `src/utils/entries.test.ts` — 5 tests for the `getEntries()` typed utility function
- `src/utils/slugify.test.ts` — 6 tests for the `toSlug()` slug generation utility
- `src/utils/theme.test.ts` — 4 sync-guard tests verifying inline scripts match theme constants
- `src/e2e/sidebar.test.ts` — 22 E2E tests for sidebar, navigation, and theme (requires preview server)

Tests live alongside source files in `src/` using the `.test.ts` suffix -- not in a separate `tests/` directory.

## Test Patterns

Tests follow standard `describe`/`it` block structure with `expect()` matchers:

```typescript
import { describe, expect, it } from 'bun:test';
import { getEntries } from './entries';

describe('getEntries', () => {
	it('should return entries for a simple object', () => {
		const obj = { a: 1, b: 2 };
		const result = getEntries(obj);
		expect(result).toEqual([
			['a', 1],
			['b', 2],
		]);
	});
});
```

## Running Tests

| Command               | Purpose                        |
| --------------------- | ------------------------------ |
| `bun test`            | Run all tests once             |
| `bun test --watch`    | Re-run tests on file changes   |
| `bun test --coverage` | Run tests with coverage report |

## Writing New Tests

1. Create a `.test.ts` file next to the source file being tested (e.g., `src/utils/format.test.ts` for `src/utils/format.ts`).
2. Import test utilities from `bun:test`:
   ```typescript
   import { describe, expect, it } from 'bun:test';
   ```
3. Import the module under test with a relative path.
4. Use `describe` blocks to group related tests and `it` blocks for individual cases.

## Quality Pipeline

The project has two quality checkpoints:

### `bun vet` (development)

Runs the full quality suite:

```
bun typecheck && bun check && bun test
```

- `bun typecheck` -- TypeScript compiler check (`tsgo --noEmit`)
- `bun check` -- oxlint linting and oxfmt formatting
- `bun test` -- all test suites

Use `bun vet` as the primary command to verify code health during development.

### `prebuild` (CI / build)

Runs before every production build:

```
tsgo --noEmit && bunx astro check
```

This validates types and Astro templates but does **not** run tests. Tests are expected to pass via `bun vet` before pushing.

## Testing Opportunities

Areas where additional test coverage would add value:

- **Content data validation** -- verify that `bookshelf.ts` and `testimonials.ts` entries conform to the `ContentTemplate` interface and contain required fields
- **Config module correctness** -- test that Astro and Tailwind configurations resolve correctly
- **Utility functions** -- any new utilities added to `src/utils/` should ship with co-located tests
- **Component rendering** -- with happy-dom available, Astro component output could be snapshot-tested

## See Also

- [Deployment Guide](deployment-guide.md)
