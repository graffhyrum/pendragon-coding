export function linkedinShareUrl(url: string): string {
	return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export function xShareUrl(url: string, title: string): string {
	const params = new URLSearchParams({ url, text: title });
	return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function facebookShareUrl(url: string): string {
	return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}
