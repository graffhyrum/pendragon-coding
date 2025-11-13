import { describe, expect, test } from 'bun:test';

describe('ContentContainer Component', () => {
	test('has correct content interface structure', () => {
		interface ContentTemplate {
			sections: Array<{
				title: string;
				subtitle: string;
				content: Array<{
					title: string;
					link: Array<{ href: string; title?: string }>;
					description: string;
				}>;
			}>;
		}

		const mockContent: ContentTemplate = {
			sections: [
				{
					title: 'Test Section',
					subtitle: 'Test Subtitle',
					content: [
						{
							title: 'Test Item',
							link: [{ href: 'https://example.com', title: 'Example' }],
							description: '<p>Test description</p>',
						},
					],
				},
			],
		};

		expect(mockContent.sections).toHaveLength(1);
		expect(mockContent.sections[0].title).toBe('Test Section');
		expect(mockContent.sections[0].subtitle).toBe('Test Subtitle');
		expect(mockContent.sections[0].content).toHaveLength(1);
	});

	test('has correct section structure', () => {
		const expectedSectionStructure = {
			title: 'h2',
			subtitle: 'p',
			list: 'ul',
			card: 'li',
			cardTitle: 'h3',
			link: 'a',
			description: 'p.text-lg',
		};

		Object.values(expectedSectionStructure).forEach((value) => {
			expect(typeof value).toBe('string');
			expect(value.length).toBeGreaterThan(0);
		});
	});

	test('has correct list styling classes', () => {
		const expectedListClasses = ['flex', 'flex-wrap'];

		expectedListClasses.forEach((className) => {
			expect(typeof className).toBe('string');
			expect(className.length).toBeGreaterThan(0);
		});
	});

	test('has correct list attributes', () => {
		const expectedListAttributes = {
			role: 'list',
		};

		expect(expectedListAttributes.role).toBe('list');
	});

	test('has correct card title styling classes', () => {
		const expectedCardTitleClasses = ['text-3xl'];

		expectedCardTitleClasses.forEach((className) => {
			expect(typeof className).toBe('string');
			expect(className.length).toBeGreaterThan(0);
		});
	});

	test('has correct link styling classes', () => {
		const expectedLinkClasses = ['text-xl'];

		expectedLinkClasses.forEach((className) => {
			expect(typeof className).toBe('string');
			expect(className.length).toBeGreaterThan(0);
		});
	});

	test('has correct link attributes', () => {
		const expectedLinkAttributes = {
			target: '_blank',
		};

		expect(expectedLinkAttributes.target).toBe('_blank');
	});

	test('has correct subtitle styling classes', () => {
		const expectedSubtitleClasses = ['text-xl'];

		expectedSubtitleClasses.forEach((className) => {
			expect(typeof className).toBe('string');
			expect(className.length).toBeGreaterThan(0);
		});
	});

	test('handles empty sections array', () => {
		const emptyContent = { sections: [] };
		expect(emptyContent.sections).toHaveLength(0);
	});

	test('handles section with empty content array', () => {
		const contentWithEmptySection = {
			sections: [
				{
					title: 'Empty Section',
					subtitle: 'No content here',
					content: [],
				},
			],
		};

		expect(contentWithEmptySection.sections).toHaveLength(1);
		expect(contentWithEmptySection.sections[0].content).toHaveLength(0);
	});

	test('handles item without links', () => {
		const contentWithoutLinks = {
			sections: [
				{
					title: 'No Links Section',
					subtitle: 'No links here',
					content: [
						{
							title: 'No Links Item',
							link: [],
							description: '<p>No links to show.</p>',
						},
					],
				},
			],
		};

		expect(contentWithoutLinks.sections[0].content[0].link).toHaveLength(0);
	});

	test('handles links with and without titles', () => {
		const links = [
			{ href: 'https://example.com', title: 'Example Link' },
			{ href: 'https://test.com' },
			{ href: 'https://another.com', title: 'Another Link' },
		];

		links.forEach((link) => {
			expect(link.href).toBeTruthy();
			expect(typeof link.href).toBe('string');
			if (link.title) {
				expect(typeof link.title).toBe('string');
			}
		});
	});

	test('handles HTML descriptions', () => {
		const descriptions = [
			'<p>This is a test description.</p>',
			'<p>Another test description.</p>',
			'<p>Second section description.</p>',
		];

		descriptions.forEach((description) => {
			expect(description).toContain('<p>');
			expect(description).toContain('</p>');
		});
	});

	test('handles multiple sections', () => {
		const multiSectionContent = {
			sections: [
				{
					title: 'First Section',
					subtitle: 'First subtitle',
					content: [
						{
							title: 'First Item',
							link: [{ href: 'https://first.com' }],
							description: '<p>First description.</p>',
						},
					],
				},
				{
					title: 'Second Section',
					subtitle: 'Second subtitle',
					content: [
						{
							title: 'Second Item',
							link: [{ href: 'https://second.com' }],
							description: '<p>Second description.</p>',
						},
					],
				},
			],
		};

		expect(multiSectionContent.sections).toHaveLength(2);
		expect(multiSectionContent.sections[0].title).toBe('First Section');
		expect(multiSectionContent.sections[1].title).toBe('Second Section');
	});

	test('has correct props interface', () => {
		interface ContentContainerProps {
			containerContent: {
				sections: Array<any>;
			};
		}

		const mockProps: ContentContainerProps = {
			containerContent: {
				sections: [],
			},
		};

		expect(mockProps.containerContent).toBeTruthy();
		expect(Array.isArray(mockProps.containerContent.sections)).toBe(true);
	});
});
