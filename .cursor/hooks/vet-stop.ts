/// <reference types="bun-types-no-globals/lib/index.d.ts" />

import { stdin } from 'bun';

const MAX_OUTPUT_CHARS = 8000;

interface StopHookInput {
	status: string;
	loop_count: number;
}

async function main(): Promise<number> {
	try {
		const input = JSON.parse(await stdin.text()) as StopHookInput;

		if (input.status !== 'completed') {
			console.log(JSON.stringify({}));
			return 0;
		}

		const proc = Bun.spawn(['bun', 'vet'], {
			stdout: 'pipe',
			stderr: 'pipe',
		});

		const [stdout, stderr, exitCode] = await Promise.all([
			new Response(proc.stdout).text(),
			new Response(proc.stderr).text(),
			proc.exited,
		]);

		if (exitCode === 0) {
			console.log(JSON.stringify({}));
			return 0;
		}

		const combined = [stdout, stderr]
			.filter((chunk) => chunk.length > 0)
			.join('\n')
			.trim();
		const output =
			combined.length > MAX_OUTPUT_CHARS
				? combined.slice(-MAX_OUTPUT_CHARS)
				: combined;

		console.log(
			JSON.stringify({
				followup_message: [
					'Quality gate failed: `bun vet` must exit 0 before this session can end.',
					'Fix every error and warning, then run `bun vet` again.',
					output.length > 0 ? `\n\`\`\`\n${output}\n\`\`\`` : '',
				].join(' '),
			}),
		);
		return 0;
	} catch (error) {
		console.error('[vet-stop] failed', error);
		console.log(
			JSON.stringify({
				followup_message:
					'Quality gate error: the vet stop hook crashed. Run `bun vet` manually, fix failures, and retry.',
			}),
		);
		return 0;
	}
}

const exitCode = await main();
process.exit(exitCode);
