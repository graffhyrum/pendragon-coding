/**
 * E2E tests for sidebar, navigation, and theme functionality.
 *
 * Verifies the refactored architecture:
 * - Dark mode responds to class-based toggle (not @media prefers-color-scheme)
 * - Anchor links match between sidebar and content sections
 * - Mobile responsive sidebar behavior
 * - Navigation HTMX attributes and active-page detection
 * - Theme toggle and FOUC prevention
 *
 * Requires preview server: bun run build && bun run preview
 */
import { beforeAll, describe, expect, it } from 'bun:test';

const BASE_URL = 'http://localhost:4321';

async function fetchPage(path: string): Promise<string> {
	const res = await fetch(`${BASE_URL}${path}`);
	if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
	return res.text();
}

describe('sidebar e2e', () => {
	let bookshelfHtml: string;

	beforeAll(async () => {
		try {
			bookshelfHtml = await fetchPage('/bookshelf/');
		} catch {
			throw new Error(
				'Preview server not running on :4321. Run: bun run build && bun run preview',
			);
		}
	});

	describe('dark mode fix', () => {
		it('sidebar uses Tailwind dark: classes, not @media prefers-color-scheme', () => {
			expect(bookshelfHtml).toContain('dark:bg-emerald-900');
			expect(bookshelfHtml).toContain('dark:border-green-700');
			expect(bookshelfHtml).toContain('dark:text-green-100');
			expect(bookshelfHtml).not.toContain(
				'@media (prefers-color-scheme: dark)',
			);
		});

		it('section links have dark mode classes', () => {
			expect(bookshelfHtml).toContain('dark:text-green-200');
			expect(bookshelfHtml).toContain('dark:hover:bg-green-950');
		});

		it('content links have dark mode classes', () => {
			expect(bookshelfHtml).toContain('dark:text-green-400');
			expect(bookshelfHtml).toContain('dark:hover:bg-emerald-900');
		});
	});

	describe('anchor link integrity', () => {
		it('every sidebar section link has a matching section ID in content', () => {
			const sectionIds = [
				...bookshelfHtml.matchAll(/data-section="([^"]+)"/g),
			].map((m) => m[1]);

			expect(sectionIds.length).toBeGreaterThan(0);

			for (const id of sectionIds) {
				expect(bookshelfHtml).toContain(`id="${id}"`);
			}
		});

		it('every sidebar content link has a matching content ID', () => {
			const contentIds = [
				...bookshelfHtml.matchAll(/data-content="([^"]+)"/g),
			].map((m) => m[1]);

			expect(contentIds.length).toBeGreaterThan(0);

			for (const id of contentIds) {
				expect(bookshelfHtml).toContain(`id="${id}"`);
			}
		});

		it('slug format is lowercase alphanumeric with hyphens only', () => {
			const sectionIds = [
				...bookshelfHtml.matchAll(/data-section="([^"]+)"/g),
			].map((m) => m[1]);

			for (const id of sectionIds) {
				expect(id).toMatch(/^[a-z0-9-]+$/);
			}
		});
	});

	describe('mobile responsive', () => {
		it('sidebar has mobile-responsive Tailwind classes', () => {
			expect(bookshelfHtml).toContain('max-md:fixed');
			expect(bookshelfHtml).toContain('max-md:-translate-x-full');
			expect(bookshelfHtml).toContain('[&.open]:max-md:translate-x-0');
		});

		it('sidebar toggle button has correct ARIA attributes', () => {
			expect(bookshelfHtml).toContain('sidebar-toggle');
			expect(bookshelfHtml).toContain('aria-label="Toggle sidebar"');
			expect(bookshelfHtml).toContain('aria-expanded="false"');
		});

		it('toggle is hidden on desktop, visible on mobile', () => {
			expect(bookshelfHtml).toContain('hidden max-md:block');
		});
	});

	describe('sidebar structure', () => {
		it('has section navigation landmark', () => {
			expect(bookshelfHtml).toContain('aria-label="Section navigation"');
		});

		it('has section and content link CSS selectors for JS behavior', () => {
			expect(bookshelfHtml).toContain('section-link');
			expect(bookshelfHtml).toContain('content-link');
		});
	});
});

describe('navigation e2e', () => {
	let homeHtml: string;
	let bookshelfHtml: string;

	beforeAll(async () => {
		homeHtml = await fetchPage('/');
		bookshelfHtml = await fetchPage('/bookshelf/');
	});

	describe('HTMX attributes', () => {
		it('navigation links have HTMX swap attributes', () => {
			expect(homeHtml).toContain('hx-get=');
			expect(homeHtml).toContain('hx-target=');
			expect(homeHtml).toContain('hx-swap=');
			expect(homeHtml).toContain('hx-push-url=');
		});
	});

	describe('active page detection', () => {
		it('home page marks Home link as current', () => {
			expect(homeHtml).toMatch(/href="\/"\s[^>]*aria-current="page"/);
		});

		it('bookshelf page marks Bookshelf link as current', () => {
			expect(bookshelfHtml).toMatch(
				/href="\/bookshelf\/"\s[^>]*aria-current="page"/,
			);
		});

		it('non-active links do not have aria-current', () => {
			expect(homeHtml).not.toMatch(/href="\/bookshelf\/"[^>]*aria-current/);
		});
	});
});

describe('theme toggle e2e', () => {
	let homeHtml: string;

	beforeAll(async () => {
		homeHtml = await fetchPage('/');
	});

	it('theme toggle button exists with switch role', () => {
		expect(homeHtml).toContain('role="switch"');
		expect(homeHtml).toContain('Toggle dark mode');
	});

	it('FOUC prevention script references localStorage in head', () => {
		expect(homeHtml).toContain("localStorage.getItem('theme')");
		expect(homeHtml).toContain("classList.add('dark')");
	});

	it('theme toggle handles htmx:afterSwap for reinitialization', () => {
		expect(homeHtml).toContain('htmx:afterSwap');
	});
});

describe('content pages with sidebar', () => {
	const sidebarPages = [
		'/bookshelf/',
		'/myWork/',
		'/shoutouts/',
		'/testimonials/',
	];

	for (const path of sidebarPages) {
		it(`${path} renders sidebar with section navigation`, async () => {
			const html = await fetchPage(path);
			expect(html).toContain('aria-label="Section navigation"');
			expect(html).toContain('section-link');
		});
	}
});
