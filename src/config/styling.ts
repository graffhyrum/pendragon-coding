// Styling configuration constants
export const STYLING_CONFIG = {
	// Color scheme
	colors: {
		primary: {
			light: 'bg-green-200',
			dark: 'bg-green-950',
		},
		accent: {
			light: 'text-green-900',
			dark: 'text-green-100',
		},
		border: {
			light: 'border-green-200',
			dark: 'border-green-700/80',
		},
	},

	// Spacing
	spacing: {
		container: 'px-4',
		section: 'm-4',
	},

	// Typography
	typography: {
		base: 'font-sans text-gray-900 dark:text-gray-100 leading-loose',
		heading: 'text-4xl',
		subheading: 'text-xl',
		body: 'text-lg',
	},
} as const;
