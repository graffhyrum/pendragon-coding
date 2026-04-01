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
			// Remove setext headings (heading text followed by === or --- underline)
			// Must run before horizontal rules so the heading text is removed along with the underline
			.replace(/^.+\n(?:=+|-+)[ \t]*$/gm, '')
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
 * 1. If `description` is a non-empty string, use it as the excerpt source.
 *    (Empty string is treated as absent — fall through to body.)
 * 2. Otherwise strip Markdown from `body` and use that as the source.
 *
 * In both cases the source is truncated to EXCERPT_LENGTH characters with an
 * ellipsis appended if the text exceeds that limit.
 */
export function getExcerpt(
	description: string | undefined,
	body: string | undefined,
): string {
	// Non-empty description takes priority over body; empty string falls through.
	const source = description || stripMarkdown(body ?? '');

	if (source.length <= EXCERPT_LENGTH) {
		return source;
	}

	const sliced = source.slice(0, EXCERPT_LENGTH);
	const lastSpace = sliced.lastIndexOf(' ');

	// AC2: no space in first EXCERPT_LENGTH chars — fall back to character boundary
	if (lastSpace === -1) {
		return `${sliced}...`;
	}

	// AC1/AC4: cut at last word boundary, stripping the trailing space
	return `${source.slice(0, lastSpace)}...`;
}
