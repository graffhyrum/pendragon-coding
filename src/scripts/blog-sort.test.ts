import { describe, expect, test } from 'bun:test';

import {
	buildSortUrl,
	compareDateDesc,
	compareTitleAsc,
	getSortKey,
} from './blog-sort';

describe('getSortKey', () => {
	test('returns date for empty search', () => {
		expect(getSortKey('')).toBe('date');
	});

	test('returns date for no sort param', () => {
		expect(getSortKey('?tag=playwright')).toBe('date');
	});

	test('returns title for ?sort=title', () => {
		expect(getSortKey('?sort=title')).toBe('title');
	});

	test('returns date for ?sort=date', () => {
		expect(getSortKey('?sort=date')).toBe('date');
	});

	test('returns date for unrecognised sort value', () => {
		expect(getSortKey('?sort=foobar')).toBe('date');
	});
});

describe('buildSortUrl', () => {
	test('sets sort param on base path', () => {
		expect(buildSortUrl('title', '/blog', '')).toBe('/blog?sort=title');
	});

	test('sets sort=date on base path', () => {
		expect(buildSortUrl('date', '/blog', '')).toBe('/blog?sort=date');
	});

	test('preserves existing tag params', () => {
		const url = buildSortUrl('title', '/blog', '?tag=playwright&tag=testing');
		expect(url).toContain('sort=title');
		expect(url).toContain('tag=playwright');
		expect(url).toContain('tag=testing');
	});

	test('overwrites existing sort param', () => {
		const url = buildSortUrl('date', '/blog', '?sort=title');
		expect(url).toBe('/blog?sort=date');
	});
});

// Helper to create a minimal HTMLLIElement-like object for comparator tests
function makeItem(attrs: Record<string, string>): HTMLElement {
	const el = {
		attributes: attrs,
		getAttribute(name: string): string | null {
			return attrs[name] ?? null;
		},
	} as unknown as HTMLElement;
	return el;
}

describe('compareDateDesc', () => {
	test('orders newer date before older date', () => {
		const newer = makeItem({ 'data-sort-date': '2025-06-01' });
		const older = makeItem({ 'data-sort-date': '2024-01-15' });
		expect(compareDateDesc(newer, older)).toBeLessThan(0);
		expect(compareDateDesc(older, newer)).toBeGreaterThan(0);
	});

	test('returns 0 for equal dates', () => {
		const a = makeItem({ 'data-sort-date': '2025-01-01' });
		const b = makeItem({ 'data-sort-date': '2025-01-01' });
		expect(compareDateDesc(a, b)).toBe(0);
	});

	test('treats missing date as empty string (sorts last)', () => {
		const withDate = makeItem({ 'data-sort-date': '2025-01-01' });
		const noDate = makeItem({});
		// '2025-01-01' > '' → withDate comes first (negative result)
		expect(compareDateDesc(withDate, noDate)).toBeLessThan(0);
	});
});

describe('compareTitleAsc', () => {
	test('orders A before B alphabetically', () => {
		const a = makeItem({ 'data-sort-title': 'Apple' });
		const b = makeItem({ 'data-sort-title': 'Banana' });
		expect(compareTitleAsc(a, b)).toBeLessThan(0);
		expect(compareTitleAsc(b, a)).toBeGreaterThan(0);
	});

	test('returns 0 for equal titles', () => {
		const a = makeItem({ 'data-sort-title': 'Same' });
		const b = makeItem({ 'data-sort-title': 'Same' });
		expect(compareTitleAsc(a, b)).toBe(0);
	});

	test('is case-insensitive', () => {
		const lower = makeItem({ 'data-sort-title': 'apple' });
		const upper = makeItem({ 'data-sort-title': 'Apple' });
		expect(compareTitleAsc(lower, upper)).toBe(0);
	});

	test('treats missing title as empty string (sorts first)', () => {
		const withTitle = makeItem({ 'data-sort-title': 'Zebra' });
		const noTitle = makeItem({});
		// '' < 'zebra' → noTitle comes first (negative result)
		expect(compareTitleAsc(noTitle, withTitle)).toBeLessThan(0);
	});
});
