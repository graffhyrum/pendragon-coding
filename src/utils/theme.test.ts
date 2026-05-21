import { describe, expect, it } from 'bun:test';

import { buildHeadInlineScript } from '../scripts/theme-init';
import { DARK_CLASS, THEME_EXPLICIT_KEY, THEME_STORAGE_KEY } from './theme';

describe('theme contract sync guard', () => {
	it('buildHeadInlineScript uses the same storage key', () => {
		const script = buildHeadInlineScript();
		expect(script).toContain(`'${THEME_STORAGE_KEY}'`);
	});

	it('buildHeadInlineScript uses the same dark class', () => {
		const script = buildHeadInlineScript();
		expect(script).toContain(`'${DARK_CLASS}'`);
		expect(script).toContain(`classList.add(DC)`);
		expect(script).toContain(`classList.remove(DC)`);
	});

	it('buildHeadInlineScript uses the same explicit-choice key', () => {
		const script = buildHeadInlineScript();
		expect(script).toContain(`'${THEME_EXPLICIT_KEY}'`);
	});

	it('ThemeToggle.astro uses theme-init module', async () => {
		const source = await Bun.file('src/components/ThemeToggle.astro').text();
		expect(source).toContain("from '../scripts/theme-init'");
		expect(source).toContain('setupThemeToggle');
		expect(source).not.toContain('classList.toggle');
	});

	it('buildHeadInlineScript does not write theme on auto-detect', () => {
		const script = buildHeadInlineScript();
		expect(script).not.toContain('setItem(SK');
	});
});
