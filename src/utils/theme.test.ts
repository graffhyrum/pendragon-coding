import { describe, expect, it } from 'bun:test';

import { DARK_CLASS, THEME_EXPLICIT_KEY, THEME_STORAGE_KEY } from './theme';

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

	it('Head.astro inline script uses the same explicit-choice key', async () => {
		const source = await Bun.file('src/components/Head.astro').text();
		expect(source).toContain(`'${THEME_EXPLICIT_KEY}'`);
	});

	it('ThemeToggle.astro inline script uses the same explicit-choice key', async () => {
		const source = await Bun.file('src/components/ThemeToggle.astro').text();
		expect(source).toContain(`'${THEME_EXPLICIT_KEY}'`);
	});

	it('Head.astro does not write to localStorage on auto-detected theme', async () => {
		const source = await Bun.file('src/components/Head.astro').text();
		// The old bug: localStorage.setItem('theme', theme) ran on every page load.
		// Now the init script should NOT call setItem('theme') — only the toggle does.
		const setItemCalls = source.match(/localStorage\.setItem\(/g) || [];
		expect(setItemCalls.length).toBe(0);
	});
});
