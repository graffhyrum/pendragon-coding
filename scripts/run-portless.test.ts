import { describe, expect, test } from 'bun:test';

import {
	envWithOpenSslOnPath,
	opensslSearchDirs,
	pathDelimiter,
	prependPathDir,
	whichOpenSsl,
} from './run-portless';

describe('pathDelimiter', () => {
	test('uses semicolon on Windows and colon elsewhere', () => {
		if (process.platform === 'win32') {
			expect(pathDelimiter()).toBe(';');
		} else {
			expect(pathDelimiter()).toBe(':');
		}
	});
});

describe('prependPathDir', () => {
	test('prepends a directory to PATH with the platform delimiter', () => {
		const next = prependPathDir({ PATH: '/usr/bin' }, '/opt/openssl/bin');
		expect(next.PATH).toBe(`/opt/openssl/bin${pathDelimiter()}/usr/bin`);
	});
});

describe('opensslSearchDirs', () => {
	test('includes OPENSSL_BIN_DIR when set', () => {
		const previous = process.env.OPENSSL_BIN_DIR;
		process.env.OPENSSL_BIN_DIR = '/custom/openssl/bin';
		try {
			expect(opensslSearchDirs()[0]).toBe('/custom/openssl/bin');
		} finally {
			if (previous === undefined) delete process.env.OPENSSL_BIN_DIR;
			else process.env.OPENSSL_BIN_DIR = previous;
		}
	});
});

describe('envWithOpenSslOnPath', () => {
	test('returns env unchanged when openssl is already discoverable', () => {
		if (!Bun.which('openssl')) return;
		const base = { PATH: process.env.PATH, FOO: 'bar' };
		const next = envWithOpenSslOnPath(base);
		expect(next.PATH).toBe(base.PATH);
		expect(next.FOO).toBe('bar');
	});

	test('resolves openssl after prepending OPENSSL_BIN_DIR when present', () => {
		const resolved = Bun.which('openssl');
		if (!resolved) return;
		const dir = resolved.replace(/[/\\]openssl(\.exe)?$/i, '');
		const previous = process.env.OPENSSL_BIN_DIR;
		process.env.OPENSSL_BIN_DIR = dir;
		try {
			const next = envWithOpenSslOnPath({ PATH: '/nonexistent' });
			expect(whichOpenSsl(next)).toBeTruthy();
		} finally {
			if (previous === undefined) delete process.env.OPENSSL_BIN_DIR;
			else process.env.OPENSSL_BIN_DIR = previous;
		}
	});
});
