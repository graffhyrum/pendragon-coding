import type { CollectionEntry } from 'astro:content';

import type { SidebarSections } from '../types/sidebarSections';
import { toSlug } from './slugify';

export function buildBlogSidebarSections(
	items: CollectionEntry<'blog'>[],
): SidebarSections {
	return [
		{
			title: 'All Posts',
			content: items.map((item) => ({
				title: item.data.title,
				link: [{ href: `#${toSlug(item.data.title)}` }],
			})),
		},
	];
}
