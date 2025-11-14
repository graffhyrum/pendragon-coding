// UI configuration constants
export const UI_CONFIG = {
	// Animation classes
	animations: {
		fadeIn: 'animate-fade-in',
		scaleIn: 'animate-scale-in',
	},

	// Common delays for staggered animations
	animationDelays: {
		100: 'delay-100',
		200: 'delay-200',
		300: 'delay-300',
		400: 'delay-400',
	},

	// Breakpoints and responsive classes
	breakpoints: {
		sm: 'sm:',
		md: 'md:',
		lg: 'lg:',
		xl: 'xl:',
	},
} as const;
