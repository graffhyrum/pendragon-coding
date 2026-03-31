/**
 * Unit tests for pure helper functions in tag-filter.ts.
 * DOM-dependent initTagFilter() is tested via interaction with a minimal JSDOM-style setup.
 */
import { describe, expect, test } from 'bun:test';

import {
	buildTagUrl,
	getActiveTags,
	matchesFilter,
	toggleTag,
} from './tag-filter';

describe('getActiveTags', () => {
	test('returns empty array when no tag params', () => {
		expect(getActiveTags('')).toEqual([]);
		expect(getActiveTags('?foo=bar')).toEqual([]);
	});

	test('returns single tag', () => {
		expect(getActiveTags('?tag=testing')).toEqual(['testing']);
	});

	test('returns multiple tags from repeated ?tag= params (getAll semantics)', () => {
		expect(getActiveTags('?tag=playwright&tag=testing')).toEqual([
			'playwright',
			'testing',
		]);
	});

	test('does NOT use .get() — a single .get() call would return only the first value', () => {
		// Verify that getActiveTags returns BOTH values, not just the first
		const result = getActiveTags('?tag=a&tag=b&tag=c');
		expect(result).toHaveLength(3);
		expect(result).toContain('a');
		expect(result).toContain('b');
		expect(result).toContain('c');
	});
});

describe('matchesFilter', () => {
	test('returns true when activeTags is empty (no filter)', () => {
		expect(matchesFilter([], [])).toBe(true);
		expect(matchesFilter(['typescript'], [])).toBe(true);
	});

	test('returns true when post has ANY active tag (OR semantics)', () => {
		expect(matchesFilter(['playwright', 'testing'], ['testing'])).toBe(true);
		expect(
			matchesFilter(['playwright', 'testing'], ['playwright', 'career']),
		).toBe(true);
	});

	test('returns false when post has none of the active tags', () => {
		expect(matchesFilter(['javascript'], ['playwright', 'testing'])).toBe(
			false,
		);
		expect(matchesFilter([], ['playwright'])).toBe(false);
	});

	test('returns true when post tags exactly match one active tag', () => {
		expect(matchesFilter(['typescript'], ['typescript'])).toBe(true);
	});
});

describe('buildTagUrl', () => {
	test('returns base path when no tags', () => {
		expect(buildTagUrl([])).toBe('/blog');
		expect(buildTagUrl([], '/blog')).toBe('/blog');
	});

	test('builds URL with single tag', () => {
		expect(buildTagUrl(['testing'])).toBe('/blog?tag=testing');
	});

	test('builds URL with multiple tags as repeated ?tag= params', () => {
		const url = buildTagUrl(['playwright', 'testing']);
		// URLSearchParams produces ?tag=playwright&tag=testing
		expect(url).toBe('/blog?tag=playwright&tag=testing');
	});

	test('uses custom base path when provided', () => {
		expect(buildTagUrl(['foo'], '/other')).toBe('/other?tag=foo');
	});
});

describe('toggleTag', () => {
	test('adds tag when not present', () => {
		const result = toggleTag([], 'testing');
		expect(result).toEqual(['testing']);
	});

	test('removes tag when already present', () => {
		const result = toggleTag(['testing', 'playwright'], 'testing');
		expect(result).toEqual(['playwright']);
	});

	test('does not mutate the original array', () => {
		const original = ['testing'];
		const result = toggleTag(original, 'playwright');
		expect(original).toEqual(['testing']); // unchanged
		expect(result).toEqual(['testing', 'playwright']);
	});

	test('removing the last tag returns an empty array', () => {
		expect(toggleTag(['testing'], 'testing')).toEqual([]);
	});
});
