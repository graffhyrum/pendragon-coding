/**
 * Integration E2E spec for /blog — verifies that post previews, tag filtering,
 * and sort controls compose correctly.
 *
 * Blog posts at time of writing:
 *   0001.md — "The First Blog"         tags: resources, career   date: 2024-02-15
 *   0002.md — "Testing Auth in Playwright"  tags: playwright, testing  date: 2024-03-29
 *   0003.md — "ES6 Classes"            tags: javascript, typescript  date: 2024-06-06
 *
 * Tag filtering and sort are applied client-side by tag-filter.ts and blog-sort.ts
 * reading URL params on load, so tests must wait for JS to settle before asserting
 * visibility.
 *
 * Requires: bun run build && bun run preview (handled by playwright.config.ts webServer)
 */
import { expect, test } from '@playwright/test';

// Selector for all post card list items — each card is an <li data-tags="...">
const CARD_SELECTOR = 'ul#blog-post-list > li[data-tags]';
const EMPTY_STATE_SELECTOR = '#blog-empty-state';

test.describe('blog post card structure', () => {
	test('each post card has title, date, reading time badge, and non-empty excerpt', async ({
		page,
	}) => {
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(msg.text());
		});

		await page.goto('/blog');

		// Wait for JS to settle (tag filter + sort init run on DOMContentLoaded)
		await page.waitForLoadState('networkidle');

		const cards = page.locator(CARD_SELECTOR);
		const cardCount = await cards.count();
		expect(cardCount).toBeGreaterThan(0);

		for (let i = 0; i < cardCount; i++) {
			const card = cards.nth(i);

			// Title: h3 inside the article
			const title = card.locator('article h3');
			await expect(title).toBeVisible();
			const titleText = await title.textContent();
			expect(titleText?.trim().length).toBeGreaterThan(0);

			// Date element: <p> inside the flex row following the h3
			const dateEl = card.locator('article p.text-sm.text-green-300');
			await expect(dateEl).toBeVisible();
			const dateText = await dateEl.textContent();
			expect(dateText?.trim().length).toBeGreaterThan(0);

			// Reading time badge: <span aria-label="X minute read">
			const readingTimeBadge = card.locator('span[aria-label$="minute read"]');
			await expect(readingTimeBadge).toBeVisible();
			await expect(readingTimeBadge).toContainText('min read');

			// Excerpt: <p class="text-green-200 ..."> with non-empty text
			const excerpt = card.locator('article p.text-green-200');
			await expect(excerpt).toBeVisible();
			const excerptText = await excerpt.textContent();
			expect(excerptText?.trim().length).toBeGreaterThan(0);
		}

		expect(consoleErrors).toEqual([]);
	});

	test('post cards with tags have at least one tag badge visible', async ({
		page,
	}) => {
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(msg.text());
		});

		await page.goto('/blog');
		await page.waitForLoadState('networkidle');

		const cards = page.locator(CARD_SELECTOR);
		const cardCount = await cards.count();

		for (let i = 0; i < cardCount; i++) {
			const card = cards.nth(i);
			const dataTags = await card.getAttribute('data-tags');
			// Only check tag badge presence for cards that actually have tags
			if (dataTags && dataTags.length > 0) {
				const tagBadge = card.locator('button[data-tag]').first();
				await expect(tagBadge).toBeVisible();
			}
		}

		expect(consoleErrors).toEqual([]);
	});
});

test.describe('tag filtering', () => {
	test('?tag=playwright shows only posts with the playwright tag', async ({
		page,
	}) => {
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(msg.text());
		});

		await page.goto('/blog?tag=playwright');
		await page.waitForLoadState('networkidle');

		// "Testing Auth in Playwright" has the playwright tag — should be visible
		// data-sort-title is on the <li> card element itself (spread via Card.astro)
		const playwrightPost = page.locator(
			`${CARD_SELECTOR}[data-sort-title="Testing Auth in Playwright"]`,
		);
		await expect(playwrightPost).not.toHaveAttribute('hidden', /.*/);

		// "The First Blog" (tags: resources, career) — should be hidden
		const firstBlog = page.locator(
			`${CARD_SELECTOR}[data-sort-title="The First Blog"]`,
		);
		await expect(firstBlog).toHaveAttribute('hidden', '');

		// "ES6 Classes" (tags: javascript, typescript) — should be hidden
		const es6Post = page.locator(
			`${CARD_SELECTOR}[data-sort-title="ES6 Classes"]`,
		);
		await expect(es6Post).toHaveAttribute('hidden', '');

		// Empty state should NOT be shown (one post matches)
		await expect(page.locator(EMPTY_STATE_SELECTOR)).toHaveAttribute(
			'hidden',
			'',
		);

		expect(consoleErrors).toEqual([]);
	});

	test('?tag=nonexistent shows empty-state message', async ({ page }) => {
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(msg.text());
		});

		await page.goto('/blog?tag=nonexistent');
		await page.waitForLoadState('networkidle');

		// All cards should be hidden
		const cards = page.locator(CARD_SELECTOR);
		const cardCount = await cards.count();
		for (let i = 0; i < cardCount; i++) {
			await expect(cards.nth(i)).toHaveAttribute('hidden', '');
		}

		// Empty state should be visible
		const emptyState = page.locator(EMPTY_STATE_SELECTOR);
		await expect(emptyState).not.toHaveAttribute('hidden', /.*/);
		await expect(emptyState).toBeVisible();

		expect(consoleErrors).toEqual([]);
	});
});

test.describe('sort controls', () => {
	test('?sort=title lists posts A-Z by title', async ({ page }) => {
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(msg.text());
		});

		await page.goto('/blog?sort=title');
		await page.waitForLoadState('networkidle');

		const cards = page.locator(CARD_SELECTOR);
		const cardCount = await cards.count();
		expect(cardCount).toBeGreaterThan(1);

		// Collect rendered titles in DOM order
		const titles: string[] = [];
		for (let i = 0; i < cardCount; i++) {
			const titleEl = cards.nth(i).locator('article h3');
			const text = await titleEl.textContent();
			titles.push(text?.trim() ?? '');
		}

		// Verify titles are in ascending A-Z order
		for (let i = 1; i < titles.length; i++) {
			expect(titles[i - 1]!.toLowerCase() <= titles[i]!.toLowerCase()).toBe(
				true,
			);
		}

		expect(consoleErrors).toEqual([]);
	});
});
