import { test, expect } from '@playwright/test';

test.describe('Sanity Tests - Page Load', () => {
	test('home page loads successfully', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/Joshua Pendragon/i);
		await expect(page.locator('h1')).toBeVisible();
	});

	test('blog page loads successfully', async ({ page }) => {
		await page.goto('/blog');
		await expect(page).toHaveTitle(/Blog/i);
		await expect(page.locator('h1')).toBeVisible();
	});

	test('bookshelf page loads successfully', async ({ page }) => {
		await page.goto('/bookshelf');
		await expect(page).toHaveTitle(/Bookshelf/i);
		await expect(page.locator('h1')).toBeVisible();
	});

	test('consultancy page loads successfully', async ({ page }) => {
		await page.goto('/consultancy');
		await expect(page).toHaveTitle(/Consultancy/i);
		await expect(page.locator('h1')).toBeVisible();
	});

	test('my work page loads successfully', async ({ page }) => {
		await page.goto('/myWork');
		await expect(page).toHaveTitle(/My Work/i);
		await expect(page.locator('h1')).toBeVisible();
	});

	test('shoutouts page loads successfully', async ({ page }) => {
		await page.goto('/shoutouts');
		await expect(page).toHaveTitle(/Shoutouts/i);
		await expect(page.locator('h1')).toBeVisible();
	});

	test('testimonials page loads successfully', async ({ page }) => {
		await page.goto('/testimonials');
		await expect(page).toHaveTitle(/Testimonials/i);
		await expect(page.locator('h1')).toBeVisible();
	});
});

test.describe('Sanity Tests - Navigation', () => {
	test('can navigate between pages using header links', async ({ page }) => {
		await page.goto('/');

		// Navigate to Blog
		await page.click('a[href="/blog"]');
		await expect(page).toHaveURL(/.*blog/);

		// Navigate to Bookshelf
		await page.click('a[href="/bookshelf"]');
		await expect(page).toHaveURL(/.*bookshelf/);

		// Navigate back to Home
		await page.click('a[href="/"]');
		await expect(page).toHaveURL(/\/$/);
	});

	test('header is present on all pages', async ({ page }) => {
		const pages = ['/', '/blog', '/bookshelf', '/consultancy', '/myWork', '/shoutouts', '/testimonials'];

		for (const pagePath of pages) {
			await page.goto(pagePath);
			await expect(page.locator('header')).toBeVisible();
		}
	});

	test('footer is present on all pages', async ({ page }) => {
		const pages = ['/', '/blog', '/bookshelf', '/consultancy', '/myWork', '/shoutouts', '/testimonials'];

		for (const pagePath of pages) {
			await page.goto(pagePath);
			await expect(page.locator('footer')).toBeVisible();
		}
	});
});

test.describe('Sanity Tests - Core Content', () => {
	test('home page displays key sections', async ({ page }) => {
		await page.goto('/');

		// Check for main content
		await expect(page.locator('main')).toBeVisible();

		// Check that page has meaningful content
		const bodyText = await page.textContent('body');
		expect(bodyText).toBeTruthy();
		expect(bodyText!.length).toBeGreaterThan(100);
	});

	test('pages return 200 status code', async ({ page }) => {
		const pages = ['/', '/blog', '/bookshelf', '/consultancy', '/myWork', '/shoutouts', '/testimonials'];

		for (const pagePath of pages) {
			const response = await page.goto(pagePath);
			expect(response?.status()).toBe(200);
		}
	});

	test('site does not have console errors on page load', async ({ page }) => {
		const consoleErrors: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		await page.goto('/');

		// Allow a brief moment for any async errors
		await page.waitForTimeout(1000);

		expect(consoleErrors).toHaveLength(0);
	});
});
