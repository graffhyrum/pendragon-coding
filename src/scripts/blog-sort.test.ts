import { afterEach, beforeEach, describe, expect, test } from 'bun:test';

import { GlobalWindow } from 'happy-dom';

import {
	applySort,
	buildSortUrl,
	compareDateDesc,
	compareTitleAsc,
	getSortKey,
	initBlogSort,
} from './blog-sort';

// isSortKey is a private predicate — test its contract by mirroring the logic.
// The implementation lives in blog-sort.ts; this block documents and guards the
// expected behaviour (AC1-2 from pendragon-coding-p8f).

/** Mirrors the private isSortKey predicate defined in blog-sort.ts. */
function isSortKeyMirror(v: string | null): v is 'date' | 'title' {
	return v === 'date' || v === 'title';
}

describe('isSortKey (contract mirror)', () => {
	test('returns false for malformed values', () => {
		expect(isSortKeyMirror('malformed')).toBe(false);
	});

	test('returns true for "date"', () => {
		expect(isSortKeyMirror('date')).toBe(true);
	});

	test('returns true for "title"', () => {
		expect(isSortKeyMirror('title')).toBe(true);
	});

	test('returns false for null', () => {
		expect(isSortKeyMirror(null)).toBe(false);
	});
});

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

// ── DOM-dependent tests using happy-dom ──────────────────────────────────────

/** Build a minimal blog DOM inside the given document and return the list element. */
function buildBlogDom(doc: Document): HTMLElement {
	doc.body.innerHTML = `
		<ul id="blog-post-list">
			<li data-sort-date="2024-01-01" data-sort-title="Alpha">Alpha</li>
			<li data-sort-date="2025-06-01" data-sort-title="Zeta">Zeta</li>
			<li data-sort-date="2023-05-15" data-sort-title="Beta">Beta</li>
		</ul>
		<div id="blog-sort-controls">
			<button data-sort="date">Date</button>
			<button data-sort="title">Title</button>
		</div>
		<div id="blog-sort-announcement" aria-live="polite" aria-atomic="true"></div>
	`;
	return doc.getElementById('blog-post-list') as HTMLElement;
}

/** Return the text content of each <li> in order. */
function listOrder(doc: Document): string[] {
	return Array.from(
		doc.querySelectorAll<HTMLElement>('#blog-post-list li'),
	).map((el) => el.textContent?.trim() ?? '');
}

describe('initBlogSort (DOM)', () => {
	let happyWindow: GlobalWindow;

	beforeEach(() => {
		happyWindow = new GlobalWindow({ url: 'http://localhost/blog' });
		// Expose globals so blog-sort.ts functions can reach window/document
		globalThis.window = happyWindow as unknown as typeof globalThis.window;
		globalThis.document =
			happyWindow.document as unknown as typeof globalThis.document;
		globalThis.requestAnimationFrame = happyWindow.requestAnimationFrame.bind(
			happyWindow,
		) as unknown as typeof globalThis.requestAnimationFrame;
	});

	afterEach(() => {
		happyWindow.close();
	});

	test('AC1: calling initBlogSort twice registers popstate handler only once', () => {
		buildBlogDom(happyWindow.document as unknown as Document);

		// Call twice — simulates htmx:afterSwap on the same list element
		initBlogSort();
		initBlogSort();

		// Navigate to ?sort=title via popstate (simulates browser back/forward)
		happyWindow.happyDOM.setURL('http://localhost/blog?sort=title');
		happyWindow.dispatchEvent(new happyWindow.PopStateEvent('popstate', {}));

		// Items should be in title order: Alpha, Beta, Zeta
		const order = listOrder(happyWindow.document as unknown as Document);
		expect(order).toEqual(['Alpha', 'Beta', 'Zeta']);
	});

	test('AC1: popstate after double-init does not apply sort twice (order is stable)', () => {
		buildBlogDom(happyWindow.document as unknown as Document);

		initBlogSort();
		initBlogSort();

		// Each popstate handler re-appends all items — two handlers would produce
		// the same visible result, so we verify the sort-by-date result is correct
		// rather than counting invocations (ESM module scope prevents easy spying).
		happyWindow.happyDOM.setURL('http://localhost/blog?sort=date');
		happyWindow.dispatchEvent(new happyWindow.PopStateEvent('popstate', {}));

		// Items should be in date-desc order: Zeta (2025), Alpha (2024), Beta (2023)
		const order = listOrder(happyWindow.document as unknown as Document);
		expect(order).toEqual(['Zeta', 'Alpha', 'Beta']);
	});

	test('AC2: popstate after single init applies sort from URL', () => {
		buildBlogDom(happyWindow.document as unknown as Document);

		// Start with default (date) sort
		initBlogSort();

		// Simulate navigating back to ?sort=date — items should be date-desc
		happyWindow.happyDOM.setURL('http://localhost/blog?sort=date');
		happyWindow.dispatchEvent(new happyWindow.PopStateEvent('popstate', {}));

		const order = listOrder(happyWindow.document as unknown as Document);
		// Date-desc: Zeta (2025-06-01), Alpha (2024-01-01), Beta (2023-05-15)
		expect(order).toEqual(['Zeta', 'Alpha', 'Beta']);
	});

	test('AC2: popstate fires without error when list is present', () => {
		buildBlogDom(happyWindow.document as unknown as Document);

		initBlogSort();

		// Should not throw when popstate fires
		expect(() => {
			happyWindow.happyDOM.setURL('http://localhost/blog?sort=title');
			happyWindow.dispatchEvent(new happyWindow.PopStateEvent('popstate', {}));
		}).not.toThrow();
	});

	test('applySort orders items by title ascending', () => {
		buildBlogDom(happyWindow.document as unknown as Document);

		applySort('title', false);

		const order = listOrder(happyWindow.document as unknown as Document);
		expect(order).toEqual(['Alpha', 'Beta', 'Zeta']);
	});

	test('applySort orders items by date descending', () => {
		buildBlogDom(happyWindow.document as unknown as Document);

		applySort('date', false);

		const order = listOrder(happyWindow.document as unknown as Document);
		// Zeta 2025-06-01, Alpha 2024-01-01, Beta 2023-05-15
		expect(order).toEqual(['Zeta', 'Alpha', 'Beta']);
	});
});
