import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import { GlobalWindow } from 'happy-dom';

import { initBlogShare } from './blog-share';

function buildShareBarDom(doc: Document): void {
	doc.body.innerHTML = `
		<aside class="share-bar" aria-label="Share this article">
			<p class="sr-only" data-share-status aria-live="polite"></p>
			<button type="button" data-share-copy data-share-url="https://pendragon-coding.dev/blog/es6-classes" aria-label="Copy link">
				<svg class="share-bar__icon share-bar__icon--copy" aria-hidden="true"></svg>
				<svg class="share-bar__icon share-bar__icon--check hidden" aria-hidden="true"></svg>
			</button>
		</aside>
	`;
}

describe('initBlogShare', () => {
	let happyWindow: GlobalWindow;
	let writeText: ReturnType<typeof mock>;

	beforeEach(() => {
		happyWindow = new GlobalWindow({
			url: 'http://localhost/blog/es6-classes',
		});
		globalThis.window = happyWindow as unknown as typeof globalThis.window;
		globalThis.document =
			happyWindow.document as unknown as typeof globalThis.document;
		globalThis.HTMLElement =
			happyWindow.HTMLElement as unknown as typeof globalThis.HTMLElement;

		writeText = mock(() => Promise.resolve());
		Object.defineProperty(happyWindow.navigator, 'clipboard', {
			value: { writeText },
			configurable: true,
		});
	});

	afterEach(() => {
		mock.restore();
		document.body.innerHTML = '';
	});

	test('copies canonical url and announces success', async () => {
		buildShareBarDom(document);
		initBlogShare();

		const button = document.querySelector(
			'[data-share-copy]',
		) as HTMLButtonElement | null;
		button?.click();

		await Promise.resolve();

		expect(writeText).toHaveBeenCalledWith(
			'https://pendragon-coding.dev/blog/es6-classes',
		);

		const status = document.querySelector('[data-share-status]');
		expect(status?.textContent).toBe('Link copied');

		const checkIcon = document.querySelector('.share-bar__icon--check');
		expect(checkIcon?.classList.contains('hidden')).toBe(false);
	});

	test('is idempotent', () => {
		buildShareBarDom(document);
		initBlogShare();
		initBlogShare();

		const bar = document.querySelector('.share-bar');
		expect(bar?.getAttribute('data-blog-share-initialized')).toBe('true');
	});
});
