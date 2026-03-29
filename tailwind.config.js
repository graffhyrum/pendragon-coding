/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			boxShadow: {
				card: 'var(--shadow-card)',
				'card-hover': 'var(--shadow-card-hover)',
				heading: 'var(--shadow-heading)',
				'glow-green': 'var(--shadow-glow-green)',
				'glow-green-dark': 'var(--shadow-glow-green-dark)',
			},
			transitionDuration: {
				fast: 'var(--duration-fast)',
				normal: 'var(--duration-normal)',
				slow: 'var(--duration-slow)',
			},
			transitionTimingFunction: {
				default: 'var(--ease-default)',
				'in-out': 'var(--ease-in-out)',
				spring: 'var(--ease-spring)',
			},
		},
	},
	plugins: [],
};
