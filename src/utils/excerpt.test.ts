import { describe, expect, test } from 'bun:test';

import { getExcerpt } from './excerpt';

describe('getExcerpt', () => {
	test('returns description when present and short', () => {
		const description = 'A hand-written summary of the post.';
		const body =
			'# Heading\n\nSome **bold** content that is much longer than the description.';
		expect(getExcerpt(description, body)).toBe(description);
	});

	test('truncates description to 200 chars with ellipsis when it exceeds 200 chars', () => {
		const description = 'a'.repeat(201);
		const result = getExcerpt(description, 'some body');
		expect(result).toBe(`${'a'.repeat(200)}...`);
	});

	test('falls back to body when description is empty string', () => {
		expect(getExcerpt('', 'body content')).toBe('body content');
	});

	test('returns description even when body is undefined', () => {
		expect(getExcerpt('My description', undefined)).toBe('My description');
	});

	test('returns empty string when both description and body are undefined', () => {
		expect(getExcerpt(undefined, undefined)).toBe('');
	});

	test('returns empty string when description is undefined and body is empty', () => {
		expect(getExcerpt(undefined, '')).toBe('');
	});

	test('strips markdown headings from body', () => {
		const body = '# My Heading\n\nSome content here.';
		expect(getExcerpt(undefined, body)).toBe('My Heading Some content here.');
	});

	test('strips bold and italic markdown', () => {
		const body = 'This is **bold** and *italic* and ***both*** text.';
		expect(getExcerpt(undefined, body)).toBe(
			'This is bold and italic and both text.',
		);
	});

	test('strips inline code', () => {
		const body = 'Use `const x = 1` to declare.';
		// Inline code is removed; surrounding whitespace collapses to a single space
		expect(getExcerpt(undefined, body)).toBe('Use to declare.');
	});

	test('strips code fences', () => {
		const body = 'Intro.\n\n```ts\nconst x = 1;\n```\n\nOutro.';
		expect(getExcerpt(undefined, body)).toBe('Intro. Outro.');
	});

	test('replaces links with link text', () => {
		const body = 'Visit [my site](https://example.com) for more.';
		expect(getExcerpt(undefined, body)).toBe('Visit my site for more.');
	});

	test('strips images', () => {
		const body = 'Before ![alt text](image.png) after.';
		// Image is removed; surrounding whitespace collapses to a single space
		expect(getExcerpt(undefined, body)).toBe('Before after.');
	});

	test('strips HTML tags', () => {
		const body = 'Some <strong>bold</strong> and <em>italic</em> text.';
		expect(getExcerpt(undefined, body)).toBe('Some bold and italic text.');
	});

	test('strips blockquote markers', () => {
		const body = '> This is a quote.\n> Second line.';
		expect(getExcerpt(undefined, body)).toBe('This is a quote. Second line.');
	});

	test('returns full text without ellipsis when body is exactly 200 chars after stripping', () => {
		// 200 'a' characters — no truncation
		const plain = 'a'.repeat(200);
		expect(getExcerpt(undefined, plain)).toBe(plain);
		expect(getExcerpt(undefined, plain)).not.toContain('...');
	});

	test('truncates to 200 chars with ellipsis when body exceeds 200 chars after stripping', () => {
		const plain = 'a'.repeat(201);
		const result = getExcerpt(undefined, plain);
		expect(result).toBe(`${'a'.repeat(200)}...`);
		expect(result.length).toBe(203); // 200 chars + "..."
	});

	test('strips markdown before measuring length for truncation', () => {
		// Build a body whose stripped version is 210 characters
		// Use plain text so stripping is a no-op here
		const plain = 'word '.repeat(42); // 42 * 5 = 210 chars (with trailing space)
		const stripped = plain.trim(); // 209 chars
		const result = getExcerpt(undefined, plain);
		// Word-boundary truncation: last space in first 200 chars is at index 199
		// slice(0, 199) cuts just before that space → 39 complete words + 'word'
		expect(result.endsWith('...')).toBe(true);
		expect(result).toBe(`${stripped.slice(0, 199)}...`);
	});

	test('handles underscore bold/italic variants', () => {
		const body = 'This is __bold__ and _italic_ text.';
		expect(getExcerpt(undefined, body)).toBe('This is bold and italic text.');
	});

	test('AC1: cuts at last complete word when prose exceeds 200 chars', () => {
		// 'short ' repeated 31× = 186 chars; 'averylongword' from 186–198; space at 199; then overflow
		const short = 'short '.repeat(31); // 186 chars, trailing space at index 185
		const longWord = 'averylongword'; // 13 chars at indices 186–198
		const tail = ' more words here that push it over'; // space at 199, ensures > 200
		const body = short + longWord + tail;
		const result = getExcerpt(undefined, body);
		expect(result.endsWith('...')).toBe(true);
		// Cut at last space in slice(0,200) = index 199; content = short + longWord (no trailing space)
		expect(result).toBe(`${short + longWord}...`);
	});

	test('AC1 (simple): word-boundary cut leaves no mid-word suffix before ellipsis', () => {
		// 'word ' × 39 = 195 chars; last char is space at index 194; 'toolongword' starts at 195
		const prefix = 'word '.repeat(39); // 195 chars, trailing space at index 194
		const body = `${prefix}toolongword extra content`; // 'toolongword' straddles the 200-char mark
		const result = getExcerpt(undefined, body);
		// Last space in slice(0,200) is at index 194; slice(0,194) = prefix without trailing space
		expect(result).toBe(`${prefix.trimEnd()}...`);
	});

	test('AC4: trailing space at cut position is stripped before ellipsis', () => {
		// Space at index 199 (the last position in the 200-char slice)
		const body = `${'a'.repeat(199)} extra words that push past 200`;
		const result = getExcerpt(undefined, body);
		// lastIndexOf(' ') in slice(0,200) = 199; slice(0,199) = 'a'.repeat(199) — no trailing space
		expect(result).toBe(`${'a'.repeat(199)}...`);
		expect(result).not.toMatch(/ \.\.\./); // no space immediately before ellipsis
	});

	describe('setext headings (x9f)', () => {
		test('AC1: strips setext heading with === underline', () => {
			const body = 'My Heading\n==========\n\nBody text here.';
			expect(getExcerpt(undefined, body)).toBe('Body text here.');
		});

		test('AC2: strips setext heading with --- underline', () => {
			const body = 'My Heading\n----------\n\nBody text here.';
			expect(getExcerpt(undefined, body)).toBe('Body text here.');
		});

		test('AC3: strips mix of ATX and setext headings', () => {
			const body =
				'# ATX Heading\n\nSetext Heading\n==============\n\nBody text.';
			expect(getExcerpt(undefined, body)).toBe('ATX Heading Body text.');
		});

		test('AC4: preserves body text following setext heading', () => {
			const body = 'The Title\n=========\n\nThis is the body text.';
			expect(getExcerpt(undefined, body)).toBe('This is the body text.');
		});

		test('AC5: strips standalone --- as horizontal rule not setext underline', () => {
			const body = 'Before.\n\n---\n\nAfter.';
			expect(getExcerpt(undefined, body)).toBe('Before. After.');
		});
	});
});
