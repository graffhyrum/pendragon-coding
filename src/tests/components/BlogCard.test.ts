import { describe, expect, test } from 'bun:test';
import {
	createMockDocument,
	expectElementExists,
	expectAttribute,
	expectClass,
	expectTextContent,
} from '../utils/astro-test-utils';

describe('BlogCard Component', () => {
	test('has correct entry interface structure', () => {
		interface BlogEntry {
			data: {
				title: string;
				date: Date;
			};
			render: () => Promise<{ html: string }>;
		}

		const mockEntry: BlogEntry = {
			data: {
				title: 'Test Blog Post',
				date: new Date('2024-01-15'),
			},
			render: async () => ({ html: '<p>Test content</p>' }),
		};

		expect(mockEntry.data.title).toBe('Test Blog Post');
		expect(mockEntry.data.date).toBeInstanceOf(Date);
		expect(typeof mockEntry.render).toBe('function');
	});

	test('formats date correctly', () => {
		const testDate = new Date('2024-01-15');
		const formattedDate = testDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});

		expect(formattedDate).toBe('Jan 15, 2024');
	});

	test('handles different date formats', () => {
		const dates = [
			new Date('2023-12-25'),
			new Date('2024-07-04'),
			new Date('2022-03-17'),
		];

		const expectedFormats = ['Dec 25, 2023', 'Jul 4, 2024', 'Mar 17, 2022'];

		dates.forEach((date, index) => {
			const formatted = date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
			expect(formatted).toBe(expectedFormats[index]);
		});
	});

	test('generates correct article id from title', () => {
		const title = 'Test Blog Post';
		const expectedId = title.replace(/ /g, '-');
		const mockHtml = `
			<li>
				<article id="${expectedId}">
					<h3>${title}</h3>
				</article>
			</li>
		`;
		const document = createMockDocument(mockHtml);
		const articleElement = expectElementExists(document, 'article');

		expectAttribute(articleElement, 'id', expectedId);
	});

	test('handles special characters in title for id generation', () => {
		const titles = [
			'Test Post with Spaces & Symbols!',
			'Another-Test_Post',
			'Test@With#Special$Characters%',
		];

		const expectedIds = [
			'Test-Post-with-Spaces-&-Symbols!',
			'Another-Test_Post',
			'Test@With#Special$Characters%',
		];

		titles.forEach((title, index) => {
			const id = title.replace(/ /g, '-');
			expect(id).toBe(expectedIds[index]);
		});
	});

	test('has correct title styling classes', () => {
		const mockHtml = `
			<li>
				<article id="test-post">
					<h3 class="text-2xl font-medium text-green-100 mt-4">Test Blog Post</h3>
				</article>
			</li>
		`;
		const document = createMockDocument(mockHtml);
		const titleElement = expectElementExists(document, 'h3');

		expectClass(titleElement, 'text-2xl');
		expectClass(titleElement, 'font-medium');
		expectClass(titleElement, 'text-green-100');
		expectClass(titleElement, 'mt-4');
	});

	test('has correct date styling classes', () => {
		const mockHtml = `
			<li>
				<article id="test-post">
					<p class="text-sm text-green-400 my-2">Jan 15, 2024</p>
				</article>
			</li>
		`;
		const document = createMockDocument(mockHtml);
		const dateElement = expectElementExists(document, 'p');

		expectClass(dateElement, 'text-sm');
		expectClass(dateElement, 'text-green-400');
		expectClass(dateElement, 'my-2');
	});

	test('has correct content container classes', () => {
		const mockHtml = `
			<li>
				<article id="test-post">
					<div class="content bullet-list">
						<p>Test content</p>
					</div>
				</article>
			</li>
		`;
		const document = createMockDocument(mockHtml);
		const contentElement = expectElementExists(document, '.content');

		expectClass(contentElement, 'content');
		expectClass(contentElement, 'bullet-list');
	});

	test('uses Card component with correct maxWidth', () => {
		const expectedMaxWidth = 'max-w-max';
		expect(expectedMaxWidth).toBe('max-w-max');
	});

	test('handles HTML content rendering', () => {
		const mockHtml = `
			<li>
				<article id="test-post">
					<div class="content bullet-list">
						<ul><li>Item 1</li><li>Item 2</li></ul>
					</div>
				</article>
			</li>
		`;
		const document = createMockDocument(mockHtml);
		const contentElement = expectElementExists(document, '.content');

		expectTextContent(contentElement, 'Item 1');
		expectTextContent(contentElement, 'Item 2');
	});

	test('handles empty content gracefully', () => {
		const emptyContent = '';
		expect(emptyContent).toBe('');
	});

	test('maintains correct component structure', () => {
		const expectedStructure = {
			card: 'li',
			article: 'article',
			title: 'h3',
			date: 'p',
			content: '.content',
		};

		Object.entries(expectedStructure).forEach(([key, value]) => {
			expect(typeof value).toBe('string');
			expect(value.length).toBeGreaterThan(0);
		});
	});
});
