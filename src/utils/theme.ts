/**
 * Theme contract — single source of truth for theme constants.
 * Head.astro and ThemeToggle.astro use is:inline scripts that cannot import
 * this module, so they duplicate these values. The sync guard test in
 * theme.test.ts verifies they stay in sync.
 */
export const THEME_STORAGE_KEY = 'theme' as const;
export const DARK_CLASS = 'dark' as const;
