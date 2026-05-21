import { defineConfig } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PORT ?? 3456);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
	testDir: 'src/e2e',
	testMatch: '**/*.spec.ts',
	use: {
		baseURL,
		trace: 'on',
	},
	reporter: [['html', { open: 'never' }], ['list']],
	webServer: {
		command: `bun run build && bunx astro preview --port ${port}`,
		url: baseURL,
		reuseExistingServer: false,
	},
});
