import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

type ThemeMode = 'light' | 'dark';

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

async function disableTransitions(page: Page): Promise<void> {
	await page.addStyleTag({
		content:
			'*, *::before, *::after { transition: none !important; animation: none !important; }',
	});
}

async function setThemeMode(page: Page, mode: ThemeMode): Promise<void> {
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

async function runContrastAudit(
	page: Page,
	url: string,
	mode: ThemeMode,
): Promise<void> {
	await page.goto(url);
	await disableTransitions(page);
	await setThemeMode(page, mode);
	await expect(page.locator('#main-content')).not.toHaveClass(/htmx-loading/);

	const results = await new AxeBuilder({ page })
		.withRules(['color-contrast'])
		.analyze();

	expect(
		results.violations,
		`Contrast violations on ${url} (${mode} mode):\n${JSON.stringify(results.violations, null, 2)}`,
	).toHaveLength(0);
}

for (const url of PAGES) {
	for (const mode of ['light', 'dark'] as const) {
		test(`${url} has no contrast violations in ${mode} mode`, async ({
			page,
		}) => {
			await runContrastAudit(page, url, mode);
		});
	}
}
