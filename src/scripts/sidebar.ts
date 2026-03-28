/**
 * Sidebar client-side behavior.
 * Handles mobile toggle, hover-based active tracking, and smooth scroll.
 * Idempotent — safe to call on htmx:afterSwap.
 */
export function initSidebar(): void {
	const sidebar = document.querySelector<HTMLElement>('.sidebar');
	const toggle = document.querySelector<HTMLButtonElement>('.sidebar-toggle');
	const sectionLinks =
		document.querySelectorAll<HTMLAnchorElement>('.section-link');
	const contentLinks =
		document.querySelectorAll<HTMLAnchorElement>('.content-link');

	// Mobile menu toggle
	if (toggle && sidebar) {
		toggle.addEventListener('click', () => {
			const isOpen = sidebar.classList.contains('open');
			sidebar.classList.toggle('open');
			toggle.setAttribute('aria-expanded', String(!isOpen));
		});
	}

	// Hover-based active state tracking
	function clearActiveStates(): void {
		for (const link of sectionLinks) {
			link.removeAttribute('data-active');
		}
		for (const link of contentLinks) {
			link.removeAttribute('data-active');
		}
	}

	for (const link of sectionLinks) {
		link.addEventListener('mouseenter', () => {
			clearActiveStates();
			link.setAttribute('data-active', 'true');
		});
	}

	for (const link of contentLinks) {
		link.addEventListener('mouseenter', () => {
			clearActiveStates();
			link.setAttribute('data-active', 'true');
		});
	}

	if (sidebar) {
		sidebar.addEventListener('mouseleave', () => {
			clearActiveStates();
		});
	}

	// Smooth scroll helper
	function scrollToAnchor(id: string | null): void {
		if (!id) return;
		const target = document.getElementById(id);
		if (!target) return;

		target.scrollIntoView({ behavior: 'smooth', block: 'start' });

		// Close mobile menu after navigation
		if (window.innerWidth <= 768 && sidebar && toggle) {
			sidebar.classList.remove('open');
			toggle.setAttribute('aria-expanded', 'false');
		}
	}

	for (const link of sectionLinks) {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			scrollToAnchor(link.getAttribute('data-section'));
		});
	}

	for (const link of contentLinks) {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			scrollToAnchor(link.getAttribute('data-content'));
		});
	}
}
