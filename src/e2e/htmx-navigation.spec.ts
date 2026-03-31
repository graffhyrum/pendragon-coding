/**
 * E2E tests for HTMX navigation with sidebar preservation.
 *
 * Verifies:
 * - Sidebar appears after HTMX navigation to a sidebar page
 * - Gist script tags are present in swapped content
 * - Sidebar updates when navigating between sidebar pages
 * - Browser back/forward restores correct content
 *
 * Runs at default Playwright viewport (1280×720) — sidebar uses
 * max-md:-translate-x-full which passes toBeVisible() at mobile
 * widths despite being off-screen.
 *
 * Requires: bun run build && bun run preview
 */
import { expect, test } from '@playwright/test';

const SIDEBAR_SELECTOR = 'aside[aria-label="Section navigation"]';

test.describe('HTMX navigation to sidebar page', () => {
	test('sidebar appears after navigating from home to My Work', async ({
		page,
	}) => {
		await page.goto('/');

		// Home page should not have a sidebar
		await expect(page.locator(SIDEBAR_SELECTOR)).not.toBeAttached();

		// Click My Work nav link (triggers HTMX swap)
		await page.getByRole('link', { name: 'My Work' }).click();

		// Sidebar becomes visible — serves as synchronization point
		await expect(page.locator(SIDEBAR_SELECTOR)).toBeVisible();
	});

	test('gist script tags are present after HTMX navigation', async ({
		page,
	}) => {
		await page.goto('/');
		await page.getByRole('link', { name: 'My Work' }).click();

		// Wait for sidebar as sync point
		await expect(page.locator(SIDEBAR_SELECTOR)).toBeVisible();

		// Gist scripts should be attached in the DOM (not visible — they're script tags)
		await expect(
			page.locator('script[src*="gist.github.com"]').first(),
		).toBeAttached();
	});
});

test.describe('HTMX navigation between sidebar pages', () => {
	test('sidebar updates when navigating from Bookshelf to Testimonials', async ({
		page,
	}) => {
		await page.goto('/bookshelf/');

		// Sidebar should be visible on bookshelf page
		await expect(page.locator(SIDEBAR_SELECTOR)).toBeVisible();

		// Click Testimonials nav link
		await page.getByRole('link', { name: 'Testimonials' }).click();

		// Use testimonial-specific content as sync point
		// (sidebar is visible on both pages, can't use it for synchronization)
		await expect(page.locator('blockquote').first()).toBeVisible();

		// Sidebar should still be present
		await expect(page.locator(SIDEBAR_SELECTOR)).toBeVisible();

		// Sidebar should contain testimonials section links
		await expect(page.locator(SIDEBAR_SELECTOR)).toContainText('Testimonials');
	});
});

test.describe('browser back/forward', () => {
	test('back button restores previous page after HTMX navigation', async ({
		page,
	}) => {
		await page.goto('/');

		// Navigate to My Work via HTMX
		await page.getByRole('link', { name: 'My Work' }).click();
		await expect(page.locator(SIDEBAR_SELECTOR)).toBeVisible();

		// Go back
		await page.goBack();

		// Home content should be restored (no sidebar)
		await expect(page.locator(SIDEBAR_SELECTOR)).not.toBeAttached({
			timeout: 5000,
		});
	});
});
