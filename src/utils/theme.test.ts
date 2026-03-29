import { describe, expect, it } from 'bun:test';

import { DARK_CLASS, THEME_STORAGE_KEY } from './theme';

describe('theme contract sync guard', () => {
	it('Head.astro inline script uses the same storage key', async () => {
		const source = await Bun.file('src/components/Head.astro').text();
		expect(source).toContain(`localStorage.getItem('${THEME_STORAGE_KEY}')`);
	});

	it('Head.astro inline script uses the same dark class', async () => {
		const source = await Bun.file('src/components/Head.astro').text();
		expect(source).toContain(`classList.add('${DARK_CLASS}')`);
		expect(source).toContain(`classList.remove('${DARK_CLASS}')`);
	});

	it('ThemeToggle.astro inline script uses the same storage key', async () => {
		const source = await Bun.file('src/components/ThemeToggle.astro').text();
		expect(source).toContain(`'${THEME_STORAGE_KEY}'`);
	});

	it('ThemeToggle.astro inline script uses the same dark class', async () => {
		const source = await Bun.file('src/components/ThemeToggle.astro').text();
		expect(source).toContain(`'${DARK_CLASS}'`);
	});
});
