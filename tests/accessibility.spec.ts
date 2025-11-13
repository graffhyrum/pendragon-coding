import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
	test('home page should not have any automatically detectable accessibility issues', async ({
		page,
	}) => {
		await page.goto('/');

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('blog page should not have any automatically detectable accessibility issues', async ({
		page,
	}) => {
		await page.goto('/blog');

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('bookshelf page should not have any automatically detectable accessibility issues', async ({
		page,
	}) => {
		await page.goto('/bookshelf');

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('consultancy page should not have any automatically detectable accessibility issues', async ({
		page,
	}) => {
		await page.goto('/consultancy');

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('my work page should not have any automatically detectable accessibility issues', async ({
		page,
	}) => {
		await page.goto('/myWork');

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('shoutouts page should not have any automatically detectable accessibility issues', async ({
		page,
	}) => {
		await page.goto('/shoutouts');

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('testimonials page should not have any automatically detectable accessibility issues', async ({
		page,
	}) => {
		await page.goto('/testimonials');

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

test.describe('Accessibility Tests - Specific Rules', () => {
	test('all pages should have a valid lang attribute', async ({ page }) => {
		const pages = [
			'/',
			'/blog',
			'/bookshelf',
			'/consultancy',
			'/myWork',
			'/shoutouts',
			'/testimonials',
		];

		for (const pagePath of pages) {
			await page.goto(pagePath);

			const accessibilityScanResults = await new AxeBuilder({ page })
				.withRules(['html-has-lang'])
				.analyze();

			expect(accessibilityScanResults.violations).toEqual([]);
		}
	});

	test('all pages should have proper heading hierarchy', async ({ page }) => {
		const pages = [
			'/',
			'/blog',
			'/bookshelf',
			'/consultancy',
			'/myWork',
			'/shoutouts',
			'/testimonials',
		];

		for (const pagePath of pages) {
			await page.goto(pagePath);

			const accessibilityScanResults = await new AxeBuilder({ page })
				.withRules(['heading-order'])
				.analyze();

			expect(accessibilityScanResults.violations).toEqual([]);
		}
	});

	test('all images should have alt text', async ({ page }) => {
		const pages = [
			'/',
			'/blog',
			'/bookshelf',
			'/consultancy',
			'/myWork',
			'/shoutouts',
			'/testimonials',
		];

		for (const pagePath of pages) {
			await page.goto(pagePath);

			const accessibilityScanResults = await new AxeBuilder({ page })
				.withRules(['image-alt'])
				.analyze();

			expect(accessibilityScanResults.violations).toEqual([]);
		}
	});

	test('all links should have accessible names', async ({ page }) => {
		const pages = [
			'/',
			'/blog',
			'/bookshelf',
			'/consultancy',
			'/myWork',
			'/shoutouts',
			'/testimonials',
		];

		for (const pagePath of pages) {
			await page.goto(pagePath);

			const accessibilityScanResults = await new AxeBuilder({ page })
				.withRules(['link-name'])
				.analyze();

			expect(accessibilityScanResults.violations).toEqual([]);
		}
	});

	test('color contrast should meet WCAG AA standards', async ({ page }) => {
		const pages = [
			'/',
			'/blog',
			'/bookshelf',
			'/consultancy',
			'/myWork',
			'/shoutouts',
			'/testimonials',
		];

		for (const pagePath of pages) {
			await page.goto(pagePath);

			const accessibilityScanResults = await new AxeBuilder({ page })
				.withRules(['color-contrast'])
				.analyze();

			expect(accessibilityScanResults.violations).toEqual([]);
		}
	});
});
