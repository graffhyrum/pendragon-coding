import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dir, '..', '..');

function readPackageVersion(): string {
	try {
		const raw = readFileSync(join(root, 'package.json'), 'utf8');
		const pkg = JSON.parse(raw) as { version?: string };
		if (typeof pkg.version !== 'string' || !pkg.version) {
			throw new Error('package.json missing version');
		}
		return pkg.version;
	} catch (e) {
		throw new Error('failed to read package.json', { cause: e });
	}
}

test('Footer embeds site version from package.json', () => {
	const version = readPackageVersion();
	const footer = readFileSync(
		join(root, 'src/components/Footer.astro'),
		'utf8',
	);
	expect(version).toMatch(/^\d+\.\d+\.\d+/);
	expect(footer).toContain("from '../../package.json'");
	expect(footer).toContain('{appVersion}');
	expect(footer.indexOf('Links:')).toBeLessThan(
		footer.indexOf('data-site-version'),
	);
});

test('built home page includes version in footer when dist exists', () => {
	const distIndex = join(root, 'dist', 'index.html');
	let html: string;
	try {
		html = readFileSync(distIndex, 'utf8');
	} catch {
		return;
	}
	const version = readPackageVersion();
	expect(html).toContain(`v${version}`);
	expect(html).toContain('data-site-version');
});
