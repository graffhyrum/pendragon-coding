const COPIED_RESET_MS = 2000;

function setCopiedState(button: HTMLButtonElement, copied: boolean): void {
	const copyIcon = button.querySelector('.share-bar__icon--copy');
	const checkIcon = button.querySelector('.share-bar__icon--check');
	const status = button
		.closest('.share-bar')
		?.querySelector('[data-share-status]');

	if (copyIcon) {
		copyIcon.classList.toggle('hidden', copied);
	}
	if (checkIcon) {
		checkIcon.classList.toggle('hidden', !copied);
	}
	if (status) {
		status.textContent = copied ? 'Link copied' : '';
	}
}

async function copyShareUrl(button: HTMLButtonElement): Promise<void> {
	const url = button.dataset.shareUrl;
	if (!url) {
		return;
	}

	const nav = button.ownerDocument?.defaultView?.navigator ?? navigator;

	try {
		await nav.clipboard.writeText(url);
		setCopiedState(button, true);
		window.setTimeout(() => setCopiedState(button, false), COPIED_RESET_MS);
	} catch {
		const status = button
			.closest('.share-bar')
			?.querySelector('[data-share-status]');
		if (status) {
			status.textContent = 'Copy failed';
		}
	}
}

export function initBlogShare(): void {
	const bar = document.querySelector('.share-bar');
	if (!bar || bar.getAttribute('data-blog-share-initialized') === 'true') {
		return;
	}
	bar.setAttribute('data-blog-share-initialized', 'true');

	const button = bar.querySelector<HTMLButtonElement>('[data-share-copy]');
	if (!button) {
		return;
	}
	button.addEventListener('click', () => {
		void copyShareUrl(button);
	});
}
