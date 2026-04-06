import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const modes = ['light', 'dark'] as const;
type ThemeMode = (typeof modes)[number];

const PAGES = [
	'/',
	'/blog/',
	'/bookshelf/',
	'/shoutouts/',
	'/testimonials/',
	'/myWork/',
	'/blog/0001',
	'/404.html',
] as const;
type PageUrl = (typeof PAGES)[number];

for (const url of PAGES) {
	for (const mode of modes) {
		test(`${url} has no contrast violations in ${mode} mode`, async ({
			page,
		}) => {
			await runContrastAudit(page, url, mode);
		});
	}
}

const AXE_EXCLUDES: Partial<Record<PageUrl, string[]>> = {
	'/myWork/': ['.gist'],
};

async function runContrastAudit(page: Page, url: PageUrl, mode: ThemeMode) {
	await page.goto(url);
	await disableTransitions(page);
	await setThemeMode(page, mode);
	await expect(page.locator('#main-content')).not.toHaveClass(/htmx-loading/);

	let axe = new AxeBuilder({ page }).withRules(['color-contrast']);
	for (const selector of AXE_EXCLUDES[url] ?? []) axe = axe.exclude(selector);
	const results = await axe.analyze();

	expect(
		results.violations,
		`Contrast violations on ${url} (${mode} mode):\n${JSON.stringify(results.violations, null, 2)}`,
	).toHaveLength(0);
}

async function disableTransitions(page: Page) {
	await page.addStyleTag({
		content:
			'*, *::before, *::after { transition: none !important; animation: none !important; }',
	});
}

async function setThemeMode(page: Page, mode: ThemeMode) {
	await page.evaluate((m: ThemeMode) => {
		localStorage.setItem('theme', m);
		localStorage.setItem('theme-explicit', 'true');
		if (m === 'dark') document.documentElement.classList.add('dark');
		else document.documentElement.classList.remove('dark');
	}, mode);
	if (mode === 'dark') {
		await expect(page.locator('html')).toHaveClass(/dark/);
	} else {
		await expect(page.locator('html')).not.toHaveClass(/dark/);
	}
}
