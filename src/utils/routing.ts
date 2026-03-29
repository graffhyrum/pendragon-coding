/**
 * Determines if a navigation link should be marked as active.
 *
 * The home link (href="/") only activates on exact match to prevent
 * it from appearing active on every page. All other links activate
 * on exact match or when currentPath is a sub-path of href.
 *
 * Note: Trailing slashes are normalized — Netlify may strip them from currentPath.
 */
export function isRouteActive(href: string, currentPath: string): boolean {
	return (
		href === currentPath ||
		(href !== '/' && (currentPath + '/').startsWith(href + '/'))
	);
}
