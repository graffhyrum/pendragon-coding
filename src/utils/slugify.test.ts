import { describe, expect, test } from 'bun:test';

import { toSlug } from './slugify';

describe('toSlug', () => {
	test('lowercases and hyphenates words', () => {
		expect(toSlug('Hello World')).toBe('hello-world');
	});

	test('strips special characters', () => {
		expect(toSlug("What's New in 2026?")).toBe('whats-new-in-2026');
	});

	test('collapses multiple spaces into a single hyphen', () => {
		expect(toSlug('Too   Many    Spaces')).toBe('too-many-spaces');
	});

	test('returns empty string for empty input', () => {
		expect(toSlug('')).toBe('');
	});

	test('passes through already-slugified input unchanged', () => {
		expect(toSlug('already-slugified')).toBe('already-slugified');
	});

	test('handles mixed case with numbers and symbols', () => {
		expect(toSlug('Chapter 3: The Final Act!')).toBe('chapter-3-the-final-act');
	});
});
