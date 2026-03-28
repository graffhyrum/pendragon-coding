/**
 * Generate a URL-safe slug from a title string.
 * Single source of truth for all anchor ID generation across the site.
 */
export function toSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-');
}
