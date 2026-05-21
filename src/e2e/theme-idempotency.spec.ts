import { expect, test, type Page } from '@playwright/test';

type ThemeMode = 'light' | 'dark';

type StyleSnapshot = {
	bodyBg: string;
	cardBg: string;
	cardTitleColor: string;
};

async function setThemeMode(page: Page, mode: ThemeMode) {
	await page.evaluate((m: ThemeMode) => {
		localStorage.setItem('theme', m);
		localStorage.setItem('theme-explicit', 'true');
		if (m === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, mode);
}

async function captureCardStyles(page: Page): Promise<StyleSnapshot> {
	return page.evaluate(() => {
		const bodyBg = getComputedStyle(document.body).backgroundColor;
		const card = document.querySelector(
			'#blog-post-list .card-chrome',
		) as HTMLElement | null;
		const title = document.querySelector(
			'#blog-post-list .card-chrome .card-title',
		) as HTMLElement | null;
		return {
			bodyBg,
			cardBg: card ? getComputedStyle(card).backgroundColor : '',
			cardTitleColor: title ? getComputedStyle(title).color : '',
		};
	});
}

async function disableTransitions(page: Page) {
	await page.addStyleTag({
		content:
			'*, *::before, *::after { transition: none !important; animation: none !important; }',
	});
}

for (const startMode of ['light', 'dark'] as const) {
	test(`toggle then reload matches toggle palette (start ${startMode})`, async ({
		page,
	}) => {
		await page.goto('/blog/');
		await disableTransitions(page);
		await setThemeMode(page, startMode);
		await page.waitForLoadState('networkidle');

		const opposite: ThemeMode = startMode === 'light' ? 'dark' : 'light';
		await page.locator('#theme-toggle').click();
		if (opposite === 'dark') {
			await expect(page.locator('html')).toHaveClass(/dark/);
		} else {
			await expect(page.locator('html')).not.toHaveClass(/dark/);
		}

		const afterToggle = await captureCardStyles(page);

		await page.reload();
		await page.waitForLoadState('networkidle');
		await disableTransitions(page);
		if (opposite === 'dark') {
			await expect(page.locator('html')).toHaveClass(/dark/);
		} else {
			await expect(page.locator('html')).not.toHaveClass(/dark/);
		}

		const afterReload = await captureCardStyles(page);

		expect(afterReload.bodyBg).toBe(afterToggle.bodyBg);
		expect(afterReload.cardBg).toBe(afterToggle.cardBg);
		expect(afterReload.cardTitleColor).toBe(afterToggle.cardTitleColor);
	});
}
