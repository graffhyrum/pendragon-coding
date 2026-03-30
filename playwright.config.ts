import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'src/e2e',
	testMatch: '**/*.spec.ts',
	use: {
		baseURL: 'http://localhost:4321',
	},
	webServer: {
		command: 'bun run build && bun run preview',
		url: 'http://localhost:4321',
		reuseExistingServer: !process.env.CI,
	},
});
