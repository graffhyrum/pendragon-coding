import { afterEach, beforeEach, describe, expect, test } from 'bun:test';

import { GlobalWindow } from 'happy-dom';

import { initBlogSort } from './blog-sort';
import { initNavigation } from './navigation';

/** Build a minimal blog DOM inside main-content. Returns the main-content element. */
function buildBlogDom(doc: Document): HTMLElement {
	const mainContent = doc.createElement('div');
	mainContent.id = 'main-content';
	mainContent.innerHTML = `
		<ul id="blog-post-list">
			<li data-sort-date="2024-01-01" data-sort-title="Alpha">Alpha</li>
			<li data-sort-date="2025-06-01" data-sort-title="Zeta">Zeta</li>
			<li data-sort-date="2023-05-15" data-sort-title="Beta">Beta</li>
		</ul>
		<div id="blog-sort-controls">
			<button data-sort="date">Date</button>
			<button data-sort="title">Title</button>
		</div>
	`;
	doc.body.appendChild(mainContent);
	return mainContent;
}

/** Return the text content of each <li> in order. */
function listOrder(doc: Document): string[] {
	return Array.from(
		doc.querySelectorAll<HTMLElement>('#blog-post-list li'),
	).map((el) => el.textContent?.trim() ?? '');
}

describe('initNavigation — htmx:afterSwap calls initBlogSort', () => {
	let happyWindow: GlobalWindow;

	beforeEach(() => {
		happyWindow = new GlobalWindow({ url: 'http://localhost/blog' });
		globalThis.window = happyWindow as unknown as typeof globalThis.window;
		globalThis.document =
			happyWindow.document as unknown as typeof globalThis.document;
		globalThis.requestAnimationFrame = happyWindow.requestAnimationFrame.bind(
			happyWindow,
		) as unknown as typeof globalThis.requestAnimationFrame;
		// instanceof HTMLElement must check against happy-dom's class, not the absent
		// browser built-in, so the click-handler guard recognises happy-dom elements.
		globalThis.HTMLElement =
			happyWindow.HTMLElement as unknown as typeof globalThis.HTMLElement;
	});

	afterEach(() => {
		happyWindow.close();
	});

	test('AC1: htmx:afterSwap initializes sort controls so buttons respond to clicks', () => {
		const doc = happyWindow.document as unknown as Document;
		const mainContent = buildBlogDom(doc);

		initNavigation();

		// Simulate HTMX content swap into main-content (use happy-dom's CustomEvent)
		doc.body.dispatchEvent(
			new happyWindow.CustomEvent('htmx:afterSwap', {
				detail: { target: mainContent },
			}) as unknown as Event,
		);

		// Sort controls are now initialized — clicking title button should reorder
		const titleBtn = doc.querySelector<HTMLButtonElement>(
			'button[data-sort="title"]',
		);
		expect(titleBtn).not.toBeNull();
		titleBtn!.click();

		expect(listOrder(doc)).toEqual(['Alpha', 'Beta', 'Zeta']);
	});

	test('AC2: htmx:afterSwap on /blog?sort=title renders posts in title-ascending order', () => {
		happyWindow.happyDOM.setURL('http://localhost/blog?sort=title');
		const doc = happyWindow.document as unknown as Document;
		const mainContent = buildBlogDom(doc);

		initNavigation();

		doc.body.dispatchEvent(
			new happyWindow.CustomEvent('htmx:afterSwap', {
				detail: { target: mainContent },
			}) as unknown as Event,
		);

		// initBlogSort reads ?sort=title and applies title-ascending sort immediately
		expect(listOrder(doc)).toEqual(['Alpha', 'Beta', 'Zeta']);
	});

	test('AC3: hard page load (initBlogSort called directly) initializes sort without HTMX', () => {
		const doc = happyWindow.document as unknown as Document;
		buildBlogDom(doc);

		// Simulate direct call on hard page load (as done in CollectionPageLayout.astro)
		initBlogSort();

		// Default sort is date-desc: Zeta (2025), Alpha (2024), Beta (2023)
		expect(listOrder(doc)).toEqual(['Zeta', 'Alpha', 'Beta']);
	});
});
