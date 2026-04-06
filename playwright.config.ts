import { defineConfig } from '@playwright/test';

const baseURL = 'http://localhost:4321';
export default defineConfig({
	testDir: 'src/e2e',
	testMatch: '**/*.spec.ts',
	use: {
		baseURL,
		trace:'on'
	},
	reporter:[['html', {open: 'never'}], ['list']],
	webServer: {
		command: 'bun run build && bun run preview',
		url: baseURL,
		reuseExistingServer: !process.env.CI,
	},
});
