import { describe, expect, test } from 'bun:test';

import { facebookShareUrl, linkedinShareUrl, xShareUrl } from './share-urls';

describe('linkedinShareUrl', () => {
	test('encodes url query param', () => {
		const postUrl = 'https://pendragon-coding.dev/blog/es6-classes';
		expect(linkedinShareUrl(postUrl)).toBe(
			'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fpendragon-coding.dev%2Fblog%2Fes6-classes',
		);
	});
});

describe('xShareUrl', () => {
	test('encodes url and title', () => {
		const postUrl = 'https://pendragon-coding.dev/blog/es6-classes';
		expect(xShareUrl(postUrl, 'ES6 Classes')).toBe(
			'https://twitter.com/intent/tweet?url=https%3A%2F%2Fpendragon-coding.dev%2Fblog%2Fes6-classes&text=ES6+Classes',
		);
	});

	test('encodes special characters in title', () => {
		const postUrl = 'https://pendragon-coding.dev/blog/foo';
		expect(xShareUrl(postUrl, 'A & B')).toContain('text=A+%26+B');
	});
});

describe('facebookShareUrl', () => {
	test('encodes url query param', () => {
		const postUrl = 'https://pendragon-coding.dev/blog/es6-classes';
		expect(facebookShareUrl(postUrl)).toBe(
			'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fpendragon-coding.dev%2Fblog%2Fes6-classes',
		);
	});
});
