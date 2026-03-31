/**
 * Integration tests for content rendering and sidebar API partials.
 *
 * Verifies:
 * - Gist embeds render in default card template, not testimonial blockquote
 * - Testimonials render with blockquote and quote icon
 * - API partials for sidebar pages include sidebar navigation
 * - API partials for non-sidebar pages do not include sidebar
 *
 * Requires preview server: bun run build && bun run preview
 * Tests are skipped gracefully when the server is not running.
 */
import { beforeAll, describe, expect, it } from 'bun:test';

const BASE_URL = 'http://localhost:4321';

async function fetchPage(path: string): Promise<string> {
	const res = await fetch(`${BASE_URL}${path}`);
	if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
	return res.text();
}

async function isServerRunning(): Promise<boolean> {
	try {
		const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(1000) });
		return res.ok;
	} catch {
		return false;
	}
}

let serverAvailable = false;

beforeAll(async () => {
	serverAvailable = await isServerRunning();
});

describe('content rendering', () => {
	let myWorkHtml: string;
	let testimonialsHtml: string;

	beforeAll(async () => {
		if (!serverAvailable) return;
		const results = await Promise.allSettled([
			fetchPage('/myWork/'),
			fetchPage('/testimonials/'),
		]);
		for (const result of results) {
			if (result.status === 'rejected') throw result.reason;
		}
		myWorkHtml = (results[0] as PromiseFulfilledResult<string>).value;
		testimonialsHtml = (results[1] as PromiseFulfilledResult<string>).value;
	});

	describe('gist embed regression', () => {
		it('myWork page contains gist script tags', () => {
			if (!serverAvailable) return;
			expect(myWorkHtml).toContain('gist.github.com');
		});

		it('gist content is NOT wrapped in testimonial blockquote', () => {
			if (!serverAvailable) return;
			const gistsSectionStart = myWorkHtml.indexOf('id="gists"');
			expect(gistsSectionStart).toBeGreaterThan(-1);

			const gistsSection = myWorkHtml.slice(gistsSectionStart);
			const nextSectionEnd = gistsSection.indexOf('</section>');
			const gistsContent =
				nextSectionEnd > 0
					? gistsSection.slice(0, nextSectionEnd)
					: gistsSection;

			expect(gistsContent).not.toContain('testimonial-card');
			expect(gistsContent).not.toContain('testimonial-quote-icon');
		});
	});

	describe('testimonial preservation', () => {
		it('testimonials page contains blockquote elements', () => {
			if (!serverAvailable) return;
			expect(testimonialsHtml).toContain('<blockquote');
		});

		it('testimonials page contains quote icon SVG', () => {
			if (!serverAvailable) return;
			expect(testimonialsHtml).toContain('testimonial-quote-icon');
		});

		it('testimonials page contains testimonial card class', () => {
			if (!serverAvailable) return;
			expect(testimonialsHtml).toContain('testimonial-card');
		});
	});
});

describe('sidebar in API partials', () => {
	let apiMyWork: string;
	let apiBookshelf: string;
	let apiTestimonials: string;
	let apiShoutouts: string;
	let apiHome: string;

	beforeAll(async () => {
		if (!serverAvailable) return;
		const results = await Promise.allSettled([
			fetchPage('/api/myWork.html'),
			fetchPage('/api/bookshelf.html'),
			fetchPage('/api/testimonials.html'),
			fetchPage('/api/shoutouts.html'),
			fetchPage('/api/home.html'),
		]);
		for (const result of results) {
			if (result.status === 'rejected') throw result.reason;
		}
		apiMyWork = (results[0] as PromiseFulfilledResult<string>).value;
		apiBookshelf = (results[1] as PromiseFulfilledResult<string>).value;
		apiTestimonials = (results[2] as PromiseFulfilledResult<string>).value;
		apiShoutouts = (results[3] as PromiseFulfilledResult<string>).value;
		apiHome = (results[4] as PromiseFulfilledResult<string>).value;
	});

	const sidebarPages = [
		{ name: 'myWork', getHtml: () => apiMyWork },
		{ name: 'bookshelf', getHtml: () => apiBookshelf },
		{ name: 'testimonials', getHtml: () => apiTestimonials },
		{ name: 'shoutouts', getHtml: () => apiShoutouts },
	];

	for (const { name, getHtml } of sidebarPages) {
		it(`/api/${name}.html includes sidebar navigation`, () => {
			if (!serverAvailable) return;
			expect(getHtml()).toContain('aria-label="Section navigation"');
		});
	}

	it('/api/home.html does NOT include sidebar navigation', () => {
		if (!serverAvailable) return;
		expect(apiHome).not.toContain('aria-label="Section navigation"');
	});
});
