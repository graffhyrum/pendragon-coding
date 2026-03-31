import { describe, expect, test } from 'bun:test';

import { readingTime } from './reading-time';

describe('readingTime', () => {
	test('returns 1 for empty string', () => {
		expect(readingTime('')).toBe(1);
	});

	test('returns 1 for fewer than 200 words', () => {
		const body = 'word '.repeat(199).trim();
		expect(readingTime(body)).toBe(1);
	});

	test('returns 1 for exactly 200 words', () => {
		const body = 'word '.repeat(200).trim();
		expect(readingTime(body)).toBe(1);
	});

	test('returns 2 for 201 words', () => {
		const body = 'word '.repeat(201).trim();
		expect(readingTime(body)).toBe(2);
	});

	test('returns 2 for 400 words', () => {
		const body = 'word '.repeat(400).trim();
		expect(readingTime(body)).toBe(2);
	});

	test('returns 3 for 401 words', () => {
		const body = 'word '.repeat(401).trim();
		expect(readingTime(body)).toBe(3);
	});

	test('handles whitespace-only string as 0 words → returns 1', () => {
		expect(readingTime('   \n  \t  ')).toBe(1);
	});
});
