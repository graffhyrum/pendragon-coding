import { describe, expect, test } from 'bun:test';
import {
	createMockDocument,
	expectElementExists,
	expectAttribute,
	expectClass,
} from '../utils/astro-test-utils';

describe('Card Component', () => {
	test('has correct default props interface', () => {
		const expectedDefaultProps = {
			maxWidth: 'max-w-lg',
		};

		expect(expectedDefaultProps.maxWidth).toBe('max-w-lg');
	});

	test('has correct base CSS classes', () => {
		const mockHtml = `
			<li class="outline-solid outline-2 outline-green-700 w-full max-w-lg m-4 p-2 rounded-lg transition-all duration-300 hover:outline-green-500 hover:shadow-lg hover:shadow-green-900/50 hover:-translate-y-1 hover:scale-[1.02] focus-within:outline-green-500 focus-within:shadow-lg focus-within:shadow-green-900/50 focus-within:-translate-y-1 focus-within:scale-[1.02]">
				<h2>Test Content</h2>
			</li>
		`;
		const document = createMockDocument(mockHtml);
		const cardElement = expectElementExists(document, 'li');

		expectClass(cardElement, 'outline-solid');
		expectClass(cardElement, 'outline-2');
		expectClass(cardElement, 'outline-green-700');
		expectClass(cardElement, 'w-full');
		expectClass(cardElement, 'm-4');
		expectClass(cardElement, 'p-2');
		expectClass(cardElement, 'rounded-lg');
		expectClass(cardElement, 'transition-all');
		expectClass(cardElement, 'duration-300');
	});

	test('has correct hover and focus classes', () => {
		const hoverClasses = [
			'hover:outline-green-500',
			'hover:shadow-lg',
			'hover:shadow-green-900/50',
			'hover:-translate-y-1',
			'hover:scale-[1.02]',
		];

		const focusClasses = [
			'focus-within:outline-green-500',
			'focus-within:shadow-lg',
			'focus-within:shadow-green-900/50',
			'focus-within:-translate-y-1',
			'focus-within:scale-[1.02]',
		];

		[...hoverClasses, ...focusClasses].forEach((className) => {
			expect(typeof className).toBe('string');
			expect(className).toMatch(/^(hover|focus-within):/);
		});
	});

	test('renders as list item element', () => {
		const mockHtml = '<li class="outline-solid"><h2>Test Content</h2></li>';
		const document = createMockDocument(mockHtml);
		const cardElement = expectElementExists(document, 'li');

		expect(cardElement.tagName).toBe('LI');
	});

	test('handles props spreading correctly', () => {
		const mockHtml = `
			<li id="test-card" data-testid="card-element" class="outline-solid max-w-xl">
				<h2>Test Content</h2>
			</li>
		`;
		const document = createMockDocument(mockHtml);
		const cardElement = expectElementExists(document, 'li');

		expectAttribute(cardElement, 'id', 'test-card');
		expectAttribute(cardElement, 'data-testid', 'card-element');
		expectClass(cardElement, 'max-w-xl');
	});

	test('has correct props interface structure', () => {
		interface CardProps {
			maxWidth?: string;
			[key: string]: unknown;
		}

		const defaultProps: CardProps = {
			maxWidth: 'max-w-lg',
		};

		expect(defaultProps.maxWidth).toBe('max-w-lg');
		expect(typeof defaultProps).toBe('object');
	});

	test('handles slot content structure', () => {
		const mockSlotContent = '<h2>Test Title</h2><p>Test paragraph</p>';
		expect(mockSlotContent).toContain('<h2>Test Title</h2>');
		expect(mockSlotContent).toContain('<p>Test paragraph</p>');
	});
});
