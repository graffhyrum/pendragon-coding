/**
 * Spike tool: analyze-shiki-contrast.ts
 *
 * One-off research script for pendragon-coding-3g8.
 * Enumerates all token foreground colors in github-dark Shiki theme and
 * reports WCAG AA contrast failures against two background scenarios.
 *
 * Run with: bun run scripts/analyze-shiki-contrast.ts
 * Do NOT add to package.json or any test suite.
 */

// Inline import of the theme JSON to avoid ESM path resolution issues
// The theme file exports Object.freeze(JSON.parse("...")), so we re-read it.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// --- WCAG contrast math ---

function hexToRgb(hex: string): [number, number, number] | null {
	const clean = hex.replace('#', '');
	if (clean.length !== 6) return null;
	const r = parseInt(clean.slice(0, 2), 16);
	const g = parseInt(clean.slice(2, 4), 16);
	const b = parseInt(clean.slice(4, 6), 16);
	if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
	return [r, g, b];
}

function linearize(channel: number): number {
	const c = channel / 255;
	return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
	return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(l1: number, l2: number): number {
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

function contrastHexPair(fg: string, bg: string): number | null {
	const fgRgb = hexToRgb(fg);
	const bgRgb = hexToRgb(bg);
	if (!fgRgb || !bgRgb) return null;
	const fgL = relativeLuminance(...fgRgb);
	const bgL = relativeLuminance(...bgRgb);
	return contrastRatio(fgL, bgL);
}

/**
 * Compute the actual hex color when rgba(255,255,255,0.5) is blended over a base.
 * Formula: result = alpha * overlay + (1 - alpha) * base
 */
function blendRgbaOverHex(base: string): string | null {
	const baseRgb = hexToRgb(base);
	if (!baseRgb) return null;
	// rgba(255, 255, 255, 0.5)
	const alpha = 0.5;
	const r = Math.round(alpha * 255 + (1 - alpha) * baseRgb[0]);
	const g = Math.round(alpha * 255 + (1 - alpha) * baseRgb[1]);
	const b = Math.round(alpha * 255 + (1 - alpha) * baseRgb[2]);
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// --- Load and parse the github-dark theme ---

// This script was authored to run from inside a worktree at
// .claude/worktrees/<id>/scripts/, where ../../../../ resolves to the project
// root. Running it directly from scripts/ in the main checkout will fail.
// To re-run: copy to a worktree or adjust the relative path below.
const themePath = join(
	import.meta.dir,
	'../../../../node_modules/@shikijs/themes/dist/github-dark.mjs',
);

// The mjs file does: export default Object.freeze(JSON.parse("..."))
// We read the raw file and extract the JSON string from it.
const mjs = readFileSync(themePath, 'utf8');
const jsonMatch = mjs.match(/JSON\.parse\("(.+)"\)/s);
if (!jsonMatch) {
	console.error('Could not find JSON.parse in theme file');
	process.exit(1);
}

// Unescape the JSON string (it's a double-escaped JS string literal)
const jsonStr = JSON.parse(`"${jsonMatch[1]}"`);
const theme = JSON.parse(jsonStr);

// --- Extract colors ---

const darkBg: string = theme.colors['editor.background'] ?? '#24292e';

// Light mode: rgba(255,255,255,0.5) over #bbf7d0 (Tailwind green-200)
const GREEN_200 = '#bbf7d0';
const lightBg = blendRgbaOverHex(GREEN_200)!;

console.log(`Theme: ${theme.displayName} (${theme.name})`);
console.log(`Dark bg (Shiki inline wins): ${darkBg}`);
console.log(
	`Light bg (CSS pre rule wins, rgba(255,255,255,0.5) over ${GREEN_200}): ${lightBg}`,
);
console.log('');

// Collect all unique foreground colors with their scope names
const colorMap = new Map<string, string[]>(); // hex -> scope names

for (const tc of theme.tokenColors) {
	const fg = tc.settings?.foreground;
	if (!fg || !fg.startsWith('#')) continue;
	const normalized = fg.toLowerCase();
	const scopes: string[] = Array.isArray(tc.scope)
		? tc.scope
		: tc.scope
			? [tc.scope]
			: ['(no scope)'];
	if (!colorMap.has(normalized)) {
		colorMap.set(normalized, []);
	}
	colorMap.get(normalized)!.push(...scopes);
}

// Also include the default foreground
const defaultFg = theme.fg ?? theme.colors['editor.foreground'];
if (defaultFg) {
	const n = defaultFg.toLowerCase();
	if (!colorMap.has(n)) colorMap.set(n, ['(default foreground)']);
}

// --- Analyze and report ---

const WCAG_AA_NORMAL = 4.5;

type Result = {
	color: string;
	contrastDark: number | null;
	contrastLight: number | null;
	failsDark: boolean;
	failsLight: boolean;
	scopes: string[];
};

const results: Result[] = [];

for (const [color, scopes] of colorMap.entries()) {
	const contrastDark = contrastHexPair(color, darkBg);
	const contrastLight = contrastHexPair(color, lightBg);
	results.push({
		color,
		contrastDark,
		contrastLight,
		failsDark: contrastDark !== null && contrastDark < WCAG_AA_NORMAL,
		failsLight: contrastLight !== null && contrastLight < WCAG_AA_NORMAL,
		scopes,
	});
}

// Sort: failures first
results.sort((a, b) => {
	const aFail = (a.failsDark ? 1 : 0) + (a.failsLight ? 1 : 0);
	const bFail = (b.failsDark ? 1 : 0) + (b.failsLight ? 1 : 0);
	return bFail - aFail || (a.contrastDark ?? 99) - (b.contrastDark ?? 99);
});

console.log('=== WCAG AA Contrast Analysis (4.5:1 threshold) ===');
console.log('');
console.log(
	`${'Color'.padEnd(10)} | ${'Dark bg ratio'.padEnd(14)} | ${'Light bg ratio'.padEnd(15)} | ${'Dark FAIL'.padEnd(10)} | ${'Light FAIL'.padEnd(11)} | Scopes`,
);
console.log('-'.repeat(120));

for (const r of results) {
	const darkStr = r.contrastDark !== null ? r.contrastDark.toFixed(2) : 'N/A';
	const lightStr =
		r.contrastLight !== null ? r.contrastLight.toFixed(2) : 'N/A';
	const darkFail = r.failsDark ? 'FAIL' : 'pass';
	const lightFail = r.failsLight ? 'FAIL' : 'pass';
	const scopeStr =
		r.scopes.slice(0, 3).join(', ') +
		(r.scopes.length > 3 ? ` (+${r.scopes.length - 3})` : '');
	console.log(
		`${r.color.padEnd(10)} | ${darkStr.padEnd(14)} | ${lightStr.padEnd(15)} | ${darkFail.padEnd(10)} | ${lightFail.padEnd(11)} | ${scopeStr}`,
	);
}

console.log('');
const darkFailCount = results.filter((r) => r.failsDark).length;
const lightFailCount = results.filter((r) => r.failsLight).length;
const darkPassCount = results.filter((r) => !r.failsDark).length;
const lightPassCount = results.filter((r) => !r.failsLight).length;
console.log(
	`Summary — Dark bg: ${darkFailCount} FAIL, ${darkPassCount} pass | Light bg: ${lightFailCount} FAIL, ${lightPassCount} pass`,
);
console.log('');
console.log(
	'=== Failing colors on DARK bg (Scenario 1 — Shiki inline bg wins) ===',
);
for (const entry of results.filter((r) => r.failsDark)) {
	console.log(
		`  ${entry.color}  ratio=${entry.contrastDark?.toFixed(2)}  scopes: ${entry.scopes.join(', ')}`,
	);
}
console.log('');
console.log(
	'=== Failing colors on LIGHT bg (Scenario 2 — CSS pre rule wins) ===',
);
for (const entry of results.filter((r) => r.failsLight)) {
	console.log(
		`  ${entry.color}  ratio=${entry.contrastLight?.toFixed(2)}  scopes: ${entry.scopes.join(', ')}`,
	);
}
