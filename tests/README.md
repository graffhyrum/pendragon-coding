# Playwright Tests

This directory contains end-to-end tests for the Pendragon Coding portfolio site using Playwright.

## Test Types

### Sanity Tests (`sanity.spec.ts`)
Basic functionality tests including:
- Page load verification for all main pages
- Navigation between pages
- Presence of header/footer on all pages
- Core content validation
- HTTP 200 status code checks
- Console error detection

### Accessibility Tests (`accessibility.spec.ts`)
WCAG compliance tests using axe-core:
- Full accessibility scans for all pages
- HTML lang attribute validation
- Heading hierarchy checks
- Image alt text verification
- Link accessible name validation
- Color contrast (WCAG AA) validation

## Running Tests

### Prerequisites
Ensure Playwright browsers are installed:
```bash
bunx playwright install --with-deps chromium
```

If running in a sandboxed environment without sudo access, install browsers only (without system dependencies):
```bash
bunx playwright install chromium
```

### Test Commands

Run all tests (headless):
```bash
bun run test
```

Run tests with visible browser (for debugging):
```bash
bun run test:headed
```

Run tests in interactive UI mode:
```bash
bun run test:ui
```

View test report:
```bash
bun run test:report
```

## Configuration

Tests are configured in `playwright.config.ts`:
- Base URL: `http://localhost:4321`
- Test directory: `./tests`
- Browser: Chromium (Desktop Chrome)
- Reporter: HTML report
- Web server: Automatically builds and starts Astro preview server before tests

## CI/CD Integration

The webServer configuration in `playwright.config.ts` automatically:
1. Builds the Astro site (`bun run build`)
2. Starts the preview server (`bun run preview`)
3. Runs tests against the built site
4. Shuts down the server after tests complete

This ensures tests always run against the production build.

## Troubleshooting

If tests fail with "Page crashed" errors:
- Ensure Chromium system dependencies are installed (`bunx playwright install --with-deps chromium`)
- Check that the Astro preview server starts correctly
- Verify port 4321 is available
- Try running tests with `--headed` flag to see browser errors

If tests timeout:
- Check network connectivity to localhost
- Ensure the build completes successfully
- Increase timeout in `playwright.config.ts` if needed
