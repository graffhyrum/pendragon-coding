const EXCERPT_LENGTH = 200;

/**
 * Strip Markdown syntax from a string, returning plain text.
 * Handles headings, bold/italic, inline code, links, images,
 * HTML tags, blockquotes, code fences, and horizontal rules.
 */
function stripMarkdown(markdown: string): string {
	return (
		markdown
			// Remove code fences (``` ... ```)
			.replace(/```[\s\S]*?```/g, '')
			// Remove inline code
			.replace(/`[^`]*`/g, '')
			// Remove images ![alt](url)
			.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
			// Replace links [text](url) with just text
			.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
			// Remove HTML tags
			.replace(/<[^>]+>/g, '')
			// Remove headings (# ## ### etc.)
			.replace(/^#{1,6}\s+/gm, '')
			// Remove blockquote markers
			.replace(/^>\s*/gm, '')
			// Remove horizontal rules
			.replace(/^[-*_]{3,}\s*$/gm, '')
			// Remove bold/italic (*** ** * ___ __ _)
			.replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
			.replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
			// Collapse multiple whitespace/newlines into a single space
			.replace(/\s+/g, ' ')
			.trim()
	);
}

/**
 * Return an excerpt for a blog post card.
 *
 * Priority:
 * 1. If `description` is provided, return it verbatim.
 * 2. Otherwise strip Markdown from `body` and truncate to EXCERPT_LENGTH
 *    characters followed by an ellipsis if the stripped text is longer.
 */
export function getExcerpt(
	description: string | undefined,
	body: string | undefined,
): string {
	if (description) {
		return description;
	}

	if (!body) {
		return '';
	}

	const plain = stripMarkdown(body);

	if (plain.length <= EXCERPT_LENGTH) {
		return plain;
	}

	return `${plain.slice(0, EXCERPT_LENGTH)}...`;
}
