/**
 * Client-side sort controls for the blog listing page.
 * Handles: ?sort= URL param, button active state, DOM reorder, aria-live announcements.
 *
 * Idempotent — safe to call multiple times (e.g. on htmx:afterSwap).
 * Re-init is guarded by data-blog-sort-initialized on the post list element.
 */

export type SortKey = 'date' | 'title';

const POST_LIST_ID = 'blog-post-list';
const SORT_CONTROLS_ID = 'blog-sort-controls';
const INITIALIZED_ATTR = 'data-blog-sort-initialized';
const LIVE_REGION_ID = 'blog-sort-announcement';

const SORT_ANNOUNCEMENTS: Record<SortKey, string> = {
	date: 'Sorted by date, newest first',
	title: 'Sorted by title, A to Z',
};

/** Read sort key from the URL. Returns 'date' for missing or unrecognised values. */
export function getSortKey(search: string = window.location.search): SortKey {
	const params = new URLSearchParams(search);
	const raw = params.get('sort');
	if (raw === 'title') return 'title';
	return 'date';
}

/** Build URL with given sort key applied, preserving any existing ?tag= params. */
export function buildSortUrl(
	key: SortKey,
	basePath: string = '/blog',
	existingSearch: string = window.location.search,
): string {
	const params = new URLSearchParams(existingSearch);
	params.set('sort', key);
	return `${basePath}?${params.toString()}`;
}

/** Compare two list items by date (newest-first). */
export function compareDateDesc(a: HTMLElement, b: HTMLElement): number {
	const da = a.getAttribute('data-sort-date') ?? '';
	const db = b.getAttribute('data-sort-date') ?? '';
	// ISO 8601 strings sort lexicographically; reverse for newest-first
	if (da > db) return -1;
	if (da < db) return 1;
	return 0;
}

/** Compare two list items by title (A-Z). */
export function compareTitleAsc(a: HTMLElement, b: HTMLElement): number {
	const ta = (a.getAttribute('data-sort-title') ?? '').toLowerCase();
	const tb = (b.getAttribute('data-sort-title') ?? '').toLowerCase();
	if (ta < tb) return -1;
	if (ta > tb) return 1;
	return 0;
}

/** Get or create the aria-live region for sort announcements. */
function getOrCreateLiveRegion(): HTMLElement {
	let region = document.getElementById(LIVE_REGION_ID);
	if (!region) {
		region = document.createElement('div');
		region.id = LIVE_REGION_ID;
		region.setAttribute('aria-live', 'polite');
		region.setAttribute('aria-atomic', 'true');
		// Visually hidden but readable by screen readers
		region.className = 'sr-only';
		document.body.appendChild(region);
	}
	return region;
}

/** Announce a message to screen readers via the aria-live region. */
function announce(message: string): void {
	const region = getOrCreateLiveRegion();
	// Clear first so repeat announcements re-fire
	region.textContent = '';
	// Use rAF to ensure the DOM mutation is processed before setting text
	requestAnimationFrame(() => {
		region.textContent = message;
	});
}

/** Sort the post list DOM items in-place and announce the change. */
export function applySort(key: SortKey, shouldAnnounce = false): void {
	const list = document.getElementById(POST_LIST_ID);
	if (!list) return;

	const items = Array.from(
		list.querySelectorAll<HTMLElement>('li[data-sort-date]'),
	);
	const compareFn = key === 'title' ? compareTitleAsc : compareDateDesc;
	items.sort(compareFn);

	// Re-append in sorted order (moves existing nodes, no clone needed)
	for (const item of items) {
		list.appendChild(item);
	}

	// Update button active states
	const controls = document.getElementById(SORT_CONTROLS_ID);
	if (controls) {
		const buttons =
			controls.querySelectorAll<HTMLButtonElement>('button[data-sort]');
		for (const btn of buttons) {
			const btnKey = btn.getAttribute('data-sort') as SortKey;
			const isActive = btnKey === key;
			btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
			if (isActive) {
				btn.classList.add('bg-green-800', 'text-green-50');
				btn.classList.remove('bg-green-900', 'text-green-300');
			} else {
				btn.classList.remove('bg-green-800', 'text-green-50');
				btn.classList.add('bg-green-900', 'text-green-300');
			}
		}
	}

	if (shouldAnnounce) {
		announce(SORT_ANNOUNCEMENTS[key]);
	}
}

/** Initialize (or re-initialize) sort controls from URL state. */
export function initBlogSort(): void {
	const list = document.getElementById(POST_LIST_ID);
	if (!list) return;

	// Apply URL sort unconditionally (idempotent read), no announcement on init
	const key = getSortKey();
	applySort(key, false);

	// Only wire click handlers once per list element
	if (list.hasAttribute(INITIALIZED_ATTR)) return;
	list.setAttribute(INITIALIZED_ATTR, 'true');

	// Ensure live region exists in DOM before first interaction
	getOrCreateLiveRegion();

	const controls = document.getElementById(SORT_CONTROLS_ID);
	if (!controls) return;

	controls.addEventListener('click', (evt) => {
		const target = evt.target as HTMLElement;
		const btn = target.closest<HTMLButtonElement>('button[data-sort]');
		if (!btn) return;

		const sortKey = btn.getAttribute('data-sort') as SortKey;
		if (sortKey !== 'date' && sortKey !== 'title') return;

		// Update URL without navigation, preserving existing params
		const url = buildSortUrl(sortKey);
		window.history.pushState({}, '', url);

		applySort(sortKey, true);
	});

	// Re-apply on browser back/forward
	window.addEventListener('popstate', () => {
		applySort(getSortKey(), false);
	});
}
