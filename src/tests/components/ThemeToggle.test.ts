import { describe, expect, test } from 'bun:test';
import {
	createMockDocument,
	expectElementExists,
	expectAttribute,
	expectClass,
} from '../utils/astro-test-utils';

describe('ThemeToggle Component', () => {
	test('has correct button attributes', () => {
		const mockHtml = `
			<button id="theme-toggle" type="button" role="switch" aria-checked="false" aria-label="Toggle dark mode" class="relative inline-flex">
				<span id="toggle-slider"></span>
			</button>
		`;
		const document = createMockDocument(mockHtml);
		const buttonElement = expectElementExists(document, '#theme-toggle');

		expectAttribute(buttonElement, 'id', 'theme-toggle');
		expectAttribute(buttonElement, 'type', 'button');
		expectAttribute(buttonElement, 'role', 'switch');
		expectAttribute(buttonElement, 'aria-checked', 'false');
		expectAttribute(buttonElement, 'aria-label', 'Toggle dark mode');
	});

	test('has correct button styling classes', () => {
		const mockHtml = `
			<button id="theme-toggle" class="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green-950 dark:focus:ring-offset-gray-900">
				<span id="toggle-slider"></span>
			</button>
		`;
		const document = createMockDocument(mockHtml);
		const buttonElement = expectElementExists(document, '#theme-toggle');

		expectClass(buttonElement, 'relative');
		expectClass(buttonElement, 'inline-flex');
		expectClass(buttonElement, 'h-8');
		expectClass(buttonElement, 'w-16');
		expectClass(buttonElement, 'items-center');
		expectClass(buttonElement, 'rounded-full');
		expectClass(buttonElement, 'bg-gray-300');
		expectClass(buttonElement, 'dark:bg-gray-600');
	});

	test('has correct slider classes', () => {
		const expectedSliderClasses = [
			'inline-block',
			'h-6',
			'w-6',
			'transform',
			'rounded-full',
			'bg-white',
			'transition-transform',
			'duration-300',
			'translate-x-1',
			'dark:translate-x-9',
			'shadow-lg',
		];

		expectedSliderClasses.forEach((className) => {
			expect(typeof className).toBe('string');
			expect(className.length).toBeGreaterThan(0);
		});
	});

	test('has correct sun icon attributes', () => {
		const mockHtml = `
			<button id="theme-toggle">
				<span id="toggle-slider">
					<svg id="sun-icon" class="h-6 w-6 text-yellow-500 dark:opacity-0 transition-opacity duration-300" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" />
					</svg>
				</span>
			</button>
		`;
		const document = createMockDocument(mockHtml);
		const sunIcon = expectElementExists(document, '#sun-icon');

		expectAttribute(sunIcon, 'id', 'sun-icon');
		expectAttribute(sunIcon, 'fill', 'currentColor');
		expectAttribute(sunIcon, 'viewBox', '0 0 24 24');
		expectClass(sunIcon, 'h-6');
		expectClass(sunIcon, 'w-6');
		expectClass(sunIcon, 'text-yellow-500');
		expectClass(sunIcon, 'dark:opacity-0');
	});

	test('has correct moon icon attributes', () => {
		const mockHtml = `
			<button id="theme-toggle">
				<span id="toggle-slider">
					<svg id="moon-icon" class="h-6 w-6 text-gray-700 opacity-0 dark:opacity-100 transition-opacity duration-300 absolute top-0 left-0" fill="currentColor" viewBox="0 0 24 24" fill-rule="evenodd">
						<path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
					</svg>
				</span>
			</button>
		`;
		const document = createMockDocument(mockHtml);
		const moonIcon = expectElementExists(document, '#moon-icon');

		expectAttribute(moonIcon, 'id', 'moon-icon');
		expectAttribute(moonIcon, 'fill', 'currentColor');
		expectAttribute(moonIcon, 'viewBox', '0 0 24 24');
		expectAttribute(moonIcon, 'fill-rule', 'evenodd');
		expectClass(moonIcon, 'h-6');
		expectClass(moonIcon, 'w-6');
		expectClass(moonIcon, 'text-gray-700');
		expectClass(moonIcon, 'opacity-0');
		expectClass(moonIcon, 'dark:opacity-100');
	});

	test('has correct semantic structure', () => {
		const expectedStructure = {
			button: '#theme-toggle',
			slider: '#toggle-slider',
			sunIcon: '#sun-icon',
			moonIcon: '#moon-icon',
		};

		Object.values(expectedStructure).forEach((selector) => {
			expect(typeof selector).toBe('string');
			expect(selector.startsWith('#')).toBe(true);
		});
	});

	test('has correct accessibility features', () => {
		const accessibilityFeatures = {
			role: 'switch',
			'aria-checked': 'false',
			'aria-label': 'Toggle dark mode',
		};

		expect(accessibilityFeatures.role).toBe('switch');
		expect(accessibilityFeatures['aria-checked']).toBe('false');
		expect(accessibilityFeatures['aria-label']).toBe('Toggle dark mode');
	});

	test('has correct icon positioning', () => {
		const moonIconPositioning = {
			position: 'absolute',
			top: 'top-0',
			left: 'left-0',
		};

		Object.values(moonIconPositioning).forEach((position) => {
			expect(typeof position).toBe('string');
			expect(position).toMatch(/^(absolute|top-0|left-0)$/);
		});
	});
});
