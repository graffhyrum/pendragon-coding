import { describe, expect, it } from 'bun:test';

import {
	DARK_CLASS,
	THEME_EXPLICIT_KEY,
	THEME_STORAGE_KEY,
} from '../utils/theme';
import {
	applyTheme,
	migrateStaleThemeKeys,
	oppositeTheme,
	persistTheme,
	resolveTheme,
} from './theme-init';

function mockStorage(initial: Record<string, string> = {}): {
	getItem: (key: string) => string | null;
	setItem: (key: string, value: string) => void;
	store: Record<string, string>;
} {
	const store = { ...initial };
	return {
		store,
		getItem: (key: string) => store[key] ?? null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
	};
}

describe('resolveTheme', () => {
	it('uses OS preference when explicit choice is absent', () => {
		const storage = mockStorage();
		expect(resolveTheme(storage, true)).toBe('dark');
		expect(resolveTheme(storage, false)).toBe('light');
	});

	it('uses stored theme when explicit is true', () => {
		const storage = mockStorage({
			[THEME_EXPLICIT_KEY]: 'true',
			[THEME_STORAGE_KEY]: 'light',
		});
		expect(resolveTheme(storage, true)).toBe('light');
	});

	it('defaults to light when explicit but theme missing', () => {
		const storage = mockStorage({ [THEME_EXPLICIT_KEY]: 'true' });
		expect(resolveTheme(storage, true)).toBe('light');
	});

	it('migrates orphan theme key to explicit', () => {
		const storage = mockStorage({ [THEME_STORAGE_KEY]: 'dark' });
		resolveTheme(storage, false);
		expect(storage.getItem(THEME_EXPLICIT_KEY)).toBe('true');
		expect(resolveTheme(storage, false)).toBe('dark');
	});
});

describe('applyTheme', () => {
	it('adds and removes dark class on documentElement', () => {
		const root = document.createElement('html');
		applyTheme(root, 'dark');
		expect(root.classList.contains(DARK_CLASS)).toBe(true);
		applyTheme(root, 'light');
		expect(root.classList.contains(DARK_CLASS)).toBe(false);
	});
});

describe('persistTheme', () => {
	it('writes theme and explicit keys', () => {
		const storage = mockStorage();
		persistTheme(storage, 'dark');
		expect(storage.store[THEME_STORAGE_KEY]).toBe('dark');
		expect(storage.store[THEME_EXPLICIT_KEY]).toBe('true');
	});
});

describe('migrateStaleThemeKeys', () => {
	it('does nothing when explicit already set', () => {
		const storage = mockStorage({
			[THEME_STORAGE_KEY]: 'light',
			[THEME_EXPLICIT_KEY]: 'true',
		});
		migrateStaleThemeKeys(storage);
		expect(storage.store[THEME_EXPLICIT_KEY]).toBe('true');
	});
});

describe('oppositeTheme', () => {
	it('flips light and dark', () => {
		expect(oppositeTheme('light')).toBe('dark');
		expect(oppositeTheme('dark')).toBe('light');
	});
});
