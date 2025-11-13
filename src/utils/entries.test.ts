import { describe, expect, it } from 'bun:test';
import { type Entries, getEntries } from './entries';

describe('getEntries', () => {
	it('should return entries for simple object', () => {
		const obj = { a: 1, b: 2, c: 3 };
		const result = getEntries(obj);

		expect(result).toHaveLength(3);
		expect(result).toContainEqual(['a', 1]);
		expect(result).toContainEqual(['b', 2]);
		expect(result).toContainEqual(['c', 3]);
	});

	it('should return entries for object with mixed types', () => {
		const obj = { str: 'hello', num: 42, bool: true, arr: [1, 2, 3] };
		const result = getEntries(obj);

		expect(result).toHaveLength(4);
		expect(result).toContainEqual(['str', 'hello']);
		expect(result).toContainEqual(['num', 42]);
		expect(result).toContainEqual(['bool', true]);
		expect(result).toContainEqual(['arr', [1, 2, 3]]);
	});

	it('should return empty array for empty object', () => {
		const obj = {};
		const result = getEntries(obj);

		expect(result).toHaveLength(0);
		expect(result).toEqual([]);
	});

	it('should handle object with null/undefined values', () => {
		const obj = { a: null, b: undefined, c: 0 };
		const result = getEntries(obj);

		expect(result).toHaveLength(3);
		expect(result).toContainEqual(['a', null]);
		expect(result).toContainEqual(['b', undefined]);
		expect(result).toContainEqual(['c', 0]);
	});

	it('should preserve type information', () => {
		const obj = { name: 'test', count: 5 };
		const result: Entries<typeof obj> = getEntries(obj);

		expect(result).toEqual([
			['name', 'test'],
			['count', 5],
		]);
	});
});
