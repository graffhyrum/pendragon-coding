import { describe, expect, test } from 'bun:test';

describe('Example Test Suite', () => {
	test('basic arithmetic', () => {
		expect(2 + 2).toBe(4);
		expect(10 - 5).toBe(5);
	});

	test('string operations', () => {
		const greeting = 'Hello, World!';
		expect(greeting).toContain('World');
		expect(greeting.toLowerCase()).toBe('hello, world!');
	});

	test('array operations', () => {
		const arr = [1, 2, 3, 4, 5];
		expect(arr).toHaveLength(5);
		expect(arr).toContain(3);
		expect(arr.filter((n) => n > 3)).toEqual([4, 5]);
	});

	test('async operations', async () => {
		const promise = Promise.resolve('success');
		await expect(promise).resolves.toBe('success');
	});

	test('object matching', () => {
		const user = {
			name: 'Joshua Pendragon',
			role: 'SDET',
		};
		expect(user).toHaveProperty('name');
		expect(user.role).toBe('SDET');
	});
});
