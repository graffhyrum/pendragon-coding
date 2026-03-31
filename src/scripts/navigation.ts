/**
 * Client-side HTMX navigation enhancements.
 * Handles: active link updates, loading indicator, error toasts,
 * and scroll-to-top after page swaps.
 *
 * Idempotent -- safe to call multiple times (e.g. on htmx:afterSwap).
 */

import { initSidebar } from './sidebar';

/** Tracks the URL of the last failed HTMX request for retry functionality */
let lastFailedUrl: string | null = null;

const ACTIVE_CLASSES = [
	'font-semibold',
	'text-green-700',
	'dark:text-green-300',
];
const TOAST_DURATION_MS = 5000;
const MAIN_CONTENT_SELECTOR = '#main-content';

/** Matches the SSR isActive logic from Navigation.astro */
function isLinkActive(linkHref: string, currentPath: string): boolean {
	if (linkHref === '/') return currentPath === '/';
	// Normalize both paths to have trailing slashes for prefix matching
	const normCurrent = currentPath.endsWith('/')
		? currentPath
		: `${currentPath}/`;
	const normHref = linkHref.endsWith('/') ? linkHref : `${linkHref}/`;
	return normCurrent.startsWith(normHref);
}

/** Update aria-current, active classes, and underline on all nav links */
function updateActiveLinks(currentPath: string): void {
	const navLinks =
		document.querySelectorAll<HTMLAnchorElement>('nav a[hx-get]');
	for (const link of navLinks) {
		const href =
			link.getAttribute('hx-push-url') ?? link.getAttribute('href') ?? '';
		const active = isLinkActive(href, currentPath);
		const underline = link.querySelector('span');

		if (active) {
			link.setAttribute('aria-current', 'page');
			link.classList.add(...ACTIVE_CLASSES);
			underline?.classList.add('w-full');
			underline?.classList.remove('w-0');
		} else {
			link.removeAttribute('aria-current');
			link.classList.remove(...ACTIVE_CLASSES);
			underline?.classList.remove('w-full');
			underline?.classList.add('w-0');
		}
	}
}

/** Show a thin progress bar at the top of #main-content */
function showLoadingState(): void {
	const main = document.querySelector<HTMLElement>(MAIN_CONTENT_SELECTOR);
	if (!main) return;
	main.classList.add('htmx-loading');

	// Avoid duplicate bars
	if (main.querySelector('.nav-progress-bar')) return;
	const bar = document.createElement('div');
	bar.className = 'nav-progress-bar';
	bar.setAttribute('role', 'progressbar');
	bar.setAttribute('aria-label', 'Loading page');
	main.prepend(bar);
}

function hideLoadingState(): void {
	const main = document.querySelector<HTMLElement>(MAIN_CONTENT_SELECTOR);
	if (!main) return;
	main.classList.remove('htmx-loading');
	main.querySelector('.nav-progress-bar')?.remove();
}

/** Retry the last failed HTMX navigation request */
function retryLastRequest(): void {
	if (!lastFailedUrl) return;
	const url = lastFailedUrl;
	lastFailedUrl = null;
	// Remove the toast before retrying
	document.querySelector('.nav-error-toast')?.remove();
	// Re-issue the request via htmx's JS API
	(
		window as unknown as {
			htmx: { ajax: (method: string, url: string, target: string) => void };
		}
	).htmx.ajax('GET', url, MAIN_CONTENT_SELECTOR);
}

/** Show an accessible error toast that auto-dismisses, with optional retry */
function showErrorToast(message: string): void {
	// Remove any existing toast to avoid stacking
	document.querySelector('.nav-error-toast')?.remove();

	const toast = document.createElement('div');
	toast.className = 'nav-error-toast';
	toast.setAttribute('role', 'alert');
	toast.setAttribute('aria-live', 'assertive');

	const text = document.createElement('span');
	text.textContent = message;

	const actions = document.createElement('span');
	actions.className = 'nav-error-toast-actions';

	// Retry button -- only shown when a failed URL is available
	if (lastFailedUrl) {
		const retryBtn = document.createElement('button');
		retryBtn.textContent = 'Retry';
		retryBtn.className = 'nav-error-toast-retry';
		retryBtn.setAttribute('aria-label', 'Retry failed request');
		retryBtn.addEventListener('click', retryLastRequest);
		actions.append(retryBtn);
	}

	const dismissBtn = document.createElement('button');
	dismissBtn.textContent = '\u00d7';
	dismissBtn.setAttribute('aria-label', 'Dismiss error');
	dismissBtn.className = 'nav-error-toast-dismiss';
	dismissBtn.addEventListener('click', () => toast.remove());

	actions.append(dismissBtn);
	toast.append(text, actions);
	document.body.append(toast);

	// Trigger reflow so CSS transition activates
	void toast.offsetHeight;
	toast.classList.add('visible');

	setTimeout(() => {
		toast.classList.remove('visible');
		// Wait for fade-out transition before removing from DOM
		setTimeout(() => toast.remove(), 300);
	}, TOAST_DURATION_MS);
}

function scrollMainToTop(): void {
	const main = document.querySelector<HTMLElement>(MAIN_CONTENT_SELECTOR);
	if (!main) return;
	main.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Wire up all HTMX event listeners. Call once on page load. */
export function initNavigation(): void {
	// Active link update after HTMX pushes URL into history
	document.body.addEventListener('htmx:pushedIntoHistory', () => {
		updateActiveLinks(window.location.pathname);
	});

	// Loading indicator
	document.body.addEventListener('htmx:beforeRequest', (evt) => {
		const target = (evt as CustomEvent).detail?.target;
		if (target?.id === 'main-content') {
			showLoadingState();
		}
	});

	document.body.addEventListener('htmx:afterRequest', (evt) => {
		const target = (evt as CustomEvent).detail?.target;
		if (target?.id === 'main-content') {
			hideLoadingState();
		}
	});

	// Error handling -- track failed URL for retry
	document.body.addEventListener('htmx:responseError', (evt) => {
		const detail = (evt as CustomEvent).detail;
		const status = detail?.xhr?.status ?? 'unknown';
		lastFailedUrl = detail?.requestConfig?.path ?? null;
		showErrorToast(`Failed to load page (${status}). Please try again.`);
	});

	document.body.addEventListener('htmx:sendError', (evt) => {
		const detail = (evt as CustomEvent).detail;
		lastFailedUrl = detail?.requestConfig?.path ?? null;
		showErrorToast(
			'Network error. Please check your connection and try again.',
		);
	});

	// Timeout-specific error message
	document.body.addEventListener('htmx:timeout', (evt) => {
		const detail = (evt as CustomEvent).detail;
		lastFailedUrl = detail?.requestConfig?.path ?? null;
		hideLoadingState();
		showErrorToast('Request timed out. Please try again.');
	});

	// Scroll to top + active link sync after content swap
	document.body.addEventListener('htmx:afterSwap', (evt) => {
		const target = (evt as CustomEvent).detail?.target;
		if (target?.id === 'main-content') {
			scrollMainToTop();
			updateActiveLinks(window.location.pathname);
			initSidebar();
		}
	});

	// Handle browser back/forward -- active links must update
	window.addEventListener('popstate', () => {
		updateActiveLinks(window.location.pathname);
	});
}
