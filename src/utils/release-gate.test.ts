import { describe, expect, test } from 'bun:test';
import { shouldSyncReleaseTag, tagPointsAtMainHead } from './release-gate';

describe('shouldSyncReleaseTag', () => {
	test('allows tag sync after version PR merge on main', () => {
		expect(
			shouldSyncReleaseTag({
				githubRef: 'refs/heads/main',
				hasChangesets: 'false',
				pullRequestNumber: '',
			}),
		).toBe(true);
	});

	test('blocks tag sync while changesets remain', () => {
		expect(
			shouldSyncReleaseTag({
				githubRef: 'refs/heads/main',
				hasChangesets: 'true',
				pullRequestNumber: '',
			}),
		).toBe(false);
	});

	test('blocks tag sync when version PR was opened or updated', () => {
		expect(
			shouldSyncReleaseTag({
				githubRef: 'refs/heads/main',
				hasChangesets: 'false',
				pullRequestNumber: '19',
			}),
		).toBe(false);
	});

	test('blocks tag sync off main', () => {
		expect(
			shouldSyncReleaseTag({
				githubRef: 'refs/heads/changeset-release/main',
				hasChangesets: 'false',
				pullRequestNumber: '',
			}),
		).toBe(false);
	});
});

describe('tagPointsAtMainHead', () => {
	test('detects aligned tag and main', () => {
		expect(tagPointsAtMainHead('abc', 'abc')).toBe(true);
		expect(tagPointsAtMainHead('abc', 'def')).toBe(false);
	});
});
