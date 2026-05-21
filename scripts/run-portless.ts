/** PATH list separator; Bun has no built-in — one platform probe is unavoidable. */
export function pathDelimiter(): string {
	return process.platform === 'win32' ? ';' : ':';
}

/** Extra directories to try when `openssl` is not on PATH (winget often skips PATH on Windows). */
function defaultOpenSslDirs(): string[] {
	if (process.platform !== 'win32') return [];
	return [
		'C:\\Program Files\\OpenSSL-Win64\\bin',
		'C:\\Program Files\\OpenSSL-Win32\\bin',
		'C:\\Program Files\\Git\\usr\\bin',
		'C:\\Program Files\\Git\\mingw64\\bin',
	];
}

export function opensslSearchDirs(): string[] {
	const fromEnv = process.env.OPENSSL_BIN_DIR?.trim();
	const extras = fromEnv ? [fromEnv] : [];
	return [...extras, ...defaultOpenSslDirs()];
}

export function prependPathDir(
	env: Record<string, string | undefined>,
	dir: string,
): Record<string, string | undefined> {
	const delim = pathDelimiter();
	const current = env.PATH ?? '';
	return { ...env, PATH: `${dir}${delim}${current}` };
}

export function whichOpenSsl(
	env: Record<string, string | undefined>,
): string | null {
	const path = env.PATH;
	if (!path) return Bun.which('openssl');
	return Bun.which('openssl', { PATH: path });
}

/** Augment PATH until `Bun.which('openssl')` succeeds, or return env unchanged. */
export function envWithOpenSslOnPath(
	env: Record<string, string | undefined>,
): Record<string, string | undefined> {
	if (whichOpenSsl(env)) return env;
	for (const dir of opensslSearchDirs()) {
		const next = prependPathDir(env, dir);
		if (whichOpenSsl(next)) return next;
	}
	return env;
}

async function runPortless(): Promise<number> {
	const repoRoot = `${import.meta.dir}/..`;
	const env = envWithOpenSslOnPath({ ...process.env });
	const proc = Bun.spawn({
		cmd: ['bun', 'x', 'portless'],
		cwd: repoRoot,
		env,
		stdin: 'inherit',
		stdout: 'inherit',
		stderr: 'inherit',
	});
	return proc.exited;
}

if (import.meta.main) {
	process.exit(await runPortless());
}
