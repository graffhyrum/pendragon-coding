import { HTMX_CONFIG } from './htmx';

// Navigation links configuration
export const NAV_LINKS = [
	{ href: '/', api: '/api/home.html', label: 'Home' },
	{ href: '/bookshelf/', api: '/api/bookshelf.html', label: 'Bookshelf' },
	{ href: '/myWork/', api: '/api/myWork.html', label: 'My Work' },
	{ href: '/shoutouts/', api: '/api/shoutouts.html', label: 'Shoutouts' },
	{
		href: '/testimonials/',
		api: '/api/testimonials.html',
		label: 'Testimonials',
	},
	{ href: '/blog/', api: '/api/blog.html', label: 'Blog' },
] as const;

export const NAVIGATION_CONFIG = {
	htmx: HTMX_CONFIG,
	links: NAV_LINKS,
} as const;
