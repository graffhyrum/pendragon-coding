export function shouldSyncReleaseTag(input: {
	githubRef: string;
	hasChangesets: string;
	pullRequestNumber: string;
}): boolean {
	return (
		input.githubRef === 'refs/heads/main' &&
		input.hasChangesets === 'false' &&
		input.pullRequestNumber === ''
	);
}

export function tagPointsAtMainHead(tagSha: string, mainHeadSha: string): boolean {
	return tagSha === mainHeadSha;
}
