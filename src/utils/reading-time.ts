const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time in minutes for a given body of text.
 * Returns ceil(wordCount / WORDS_PER_MINUTE), minimum 1.
 */
export function readingTime(body: string): number {
	// Split on whitespace, filter empty strings to count words
	const wordCount = body
		.trim()
		.split(/\s+/)
		.filter((w) => w.length > 0).length;
	return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
