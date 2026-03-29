import { describe, expect, test } from 'bun:test';

import { isRouteActive } from './routing';

describe('isRouteActive', () => {
	test('exact match activates the link', () => {
		expect(isRouteActive('/blog', '/blog')).toBe(true);
	});

	test('sub-path prefix activates the parent link', () => {
		expect(isRouteActive('/blog', '/blog/post-title')).toBe(true);
	});

	test('home route activates on exact match', () => {
		expect(isRouteActive('/', '/')).toBe(true);
	});

	test('home route does NOT activate on other pages', () => {
		expect(isRouteActive('/', '/blog')).toBe(false);
		expect(isRouteActive('/', '/about')).toBe(false);
	});

	test('unrelated routes do not activate each other', () => {
		expect(isRouteActive('/about', '/blog')).toBe(false);
		expect(isRouteActive('/blog', '/about')).toBe(false);
	});

	test('partial name overlap does not cause false positive', () => {
		// /blog should NOT activate for /blogging — trailing slash normalization prevents this
		expect(isRouteActive('/blog', '/blogging')).toBe(false);
	});

	test('trailing slash on currentPath still matches', () => {
		expect(isRouteActive('/blog', '/blog/')).toBe(true);
	});

	test('trailing slash on href still matches exact path', () => {
		// href with trailing slash: exact match only if currentPath also has it
		expect(isRouteActive('/blog/', '/blog/')).toBe(true);
	});

	test('trailing slash on href does not match bare currentPath', () => {
		// "/blog/" as href won't match "/blog" because "/blog/" !== "/blog"
		// and startsWith("/blog//") is false for "/blog/"
		expect(isRouteActive('/blog/', '/blog')).toBe(false);
	});
});
