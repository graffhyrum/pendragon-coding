/**
 * Client-side tag filtering for the blog listing page.
 * Handles: badge toggle, URL sync (?tag= repeated params), empty-state, HTMX re-init.
 *
 * Idempotent -- safe to call multiple times (e.g. on htmx:afterSwap).
 * Re-init is guarded by data-tag-filter-initialized on the post list element.
 */

const POST_LIST_ID = 'blog-post-list';
const EMPTY_STATE_ID = 'blog-empty-state';
const INITIALIZED_ATTR = 'data-tag-filter-initialized';

/** Inactive badge Tailwind classes (applied as a joined string via classList) */
const BADGE_INACTIVE_CLASSES = [
	'bg-green-800',
	'text-green-200',
	'border-green-600',
	'hover:bg-green-700',
];

/** Active badge Tailwind classes */
const BADGE_ACTIVE_CLASSES = [
	'bg-green-400',
	'text-green-950',
	'border-green-400',
];

/** Read active tags from the current URL using getAll() for repeated ?tag= params */
export function getActiveTags(
	search: string = window.location.search,
): string[] {
	const params = new URLSearchParams(search);
	return params.getAll('tag');
}

/**
 * Returns true if a post (given its tag list) matches the active filter.
 * OR semantics: post matches if it has ANY active tag.
 * If activeTags is empty, all posts match.
 */
export function matchesFilter(
	postTags: string[],
	activeTags: string[],
): boolean {
	if (activeTags.length === 0) return true;
	return activeTags.some((t) => postTags.includes(t));
}

/**
 * Build a URL search string for the given tag set.
 * Uses repeated ?tag= params for multi-tag (URLSearchParams.append).
 */
export function buildTagUrl(
	tags: string[],
	basePath: string = '/blog',
): string {
	if (tags.length === 0) return basePath;
	const params = new URLSearchParams();
	for (const tag of tags) {
		params.append('tag', tag);
	}
	return `${basePath}?${params.toString()}`;
}

/** Toggle a tag in the active set; returns the updated set */
export function toggleTag(activeTags: string[], tag: string): string[] {
	if (activeTags.includes(tag)) {
		return activeTags.filter((t) => t !== tag);
	}
	return [...activeTags, tag];
}

/** Apply the active tag filter to the DOM: show/hide posts, update badges, toggle empty state */
function applyFilter(activeTags: string[]): void {
	const list = document.getElementById(POST_LIST_ID);
	const emptyState = document.getElementById(EMPTY_STATE_ID);
	if (!list) return;

	// Show/hide posts
	let visibleCount = 0;
	const items = list.querySelectorAll<HTMLElement>('li[data-tags]');
	for (const item of items) {
		const raw = item.getAttribute('data-tags') ?? '';
		// data-tags is comma-separated; filter out empty strings from posts with no tags
		const postTags = raw.length > 0 ? raw.split(',') : [];
		const visible = matchesFilter(postTags, activeTags);
		item.hidden = !visible;
		if (visible) visibleCount++;
	}

	// Update badge aria-pressed and visual state
	const badges = list.querySelectorAll<HTMLButtonElement>('button[data-tag]');
	for (const badge of badges) {
		const tag = badge.getAttribute('data-tag') ?? '';
		const active = activeTags.includes(tag);
		badge.setAttribute('aria-pressed', active ? 'true' : 'false');
		if (active) {
			badge.classList.remove(...BADGE_INACTIVE_CLASSES);
			badge.classList.add(...BADGE_ACTIVE_CLASSES);
		} else {
			badge.classList.remove(...BADGE_ACTIVE_CLASSES);
			badge.classList.add(...BADGE_INACTIVE_CLASSES);
		}
	}

	// Empty state
	if (emptyState) {
		emptyState.hidden = visibleCount > 0;
	}
}

/** Initialize (or re-initialize) the tag filter from URL state */
export function initTagFilter(): void {
	const list = document.getElementById(POST_LIST_ID);
	if (!list) return;

	// Apply filter state from URL unconditionally (idempotent read)
	const activeTags = getActiveTags();
	applyFilter(activeTags);

	// Only wire click handlers once per list element
	if (list.hasAttribute(INITIALIZED_ATTR)) return;
	list.setAttribute(INITIALIZED_ATTR, 'true');

	// Event delegation: single listener on the list catches all badge clicks
	list.addEventListener('click', (evt) => {
		const target = evt.target as HTMLElement;
		const badge = target.closest<HTMLButtonElement>('button[data-tag]');
		if (!badge) return;

		const tag = badge.getAttribute('data-tag');
		if (!tag) return;

		const current = getActiveTags();
		const next = toggleTag(current, tag);

		// Update URL without full navigation
		const url = buildTagUrl(next);
		window.history.pushState({}, '', url);

		applyFilter(next);
	});

	// Re-apply on browser back/forward within the page
	window.addEventListener('popstate', () => {
		applyFilter(getActiveTags());
	});
}
