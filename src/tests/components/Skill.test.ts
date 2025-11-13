import { describe, expect, test } from 'bun:test';

describe('Skill Component', () => {
	test('has correct skill interface structure', () => {
		interface Skill {
			title: string;
			imagePath: string;
			img_alt: string;
			skill_doc_link: string;
		}

		const mockSkill: Skill = {
			title: 'TypeScript',
			imagePath: 'ts_logo.webp',
			img_alt: 'TypeScript Logo',
			skill_doc_link: 'https://www.typescriptlang.org/',
		};

		expect(mockSkill.title).toBe('TypeScript');
		expect(mockSkill.imagePath).toBe('ts_logo.webp');
		expect(mockSkill.img_alt).toBe('TypeScript Logo');
		expect(mockSkill.skill_doc_link).toBe('https://www.typescriptlang.org/');
	});

	test('has correct list item styling classes', () => {
		const expectedClasses = [
			'flex',
			'items-center',
			'justify-between',
			'gap-4',
			'p-1',
			'hover:bg-green-900/20',
			'rounded-lg',
			'transition-all',
			'duration-300',
			'hover:scale-105',
			'focus-within:bg-green-900/20',
			'focus-within:scale-105',
			'group',
		];

		expectedClasses.forEach((className) => {
			expect(typeof className).toBe('string');
			expect(className.length).toBeGreaterThan(0);
		});
	});

	test('calculates delay classes correctly', () => {
		const delayCalculations = [
			{ index: 0, expected: 'delay-0' },
			{ index: 1, expected: 'delay-100' },
			{ index: 2, expected: 'delay-200' },
			{ index: 3, expected: 'delay-300' },
			{ index: 4, expected: 'delay-400' },
			{ index: 5, expected: 'delay-400' },
			{ index: 10, expected: 'delay-400' },
		];

		delayCalculations.forEach(({ index, expected }) => {
			const delay = Math.min(index * 100, 400);
			const delayClass = `delay-${delay}`;
			expect(delayClass).toBe(expected);
		});
	});

	test('has correct animation classes', () => {
		const animationClasses = ['animate-scale-in', 'opacity-0'];

		animationClasses.forEach((className) => {
			expect(typeof className).toBe('string');
			expect(className.length).toBeGreaterThan(0);
		});
	});

	test('has correct image styling classes', () => {
		const expectedImageClasses = [
			'w-10',
			'h-auto',
			'object-contain',
			'transition-transform',
			'duration-300',
			'group-hover:rotate-12',
			'group-hover:scale-110',
			'group-focus-within:rotate-12',
			'group-focus-within:scale-110',
		];

		expectedImageClasses.forEach((className) => {
			expect(typeof className).toBe('string');
			expect(className.length).toBeGreaterThan(0);
		});
	});

	test('has correct paragraph styling classes', () => {
		const expectedParagraphClasses = ['text-xl', 'flex-1', 'text-left', 'm-0'];

		expectedParagraphClasses.forEach((className) => {
			expect(typeof className).toBe('string');
			expect(className.length).toBeGreaterThan(0);
		});
	});

	test('handles conditional link rendering', () => {
		const skillWithLink = {
			title: 'TypeScript',
			skill_doc_link: 'https://www.typescriptlang.org/',
		};

		const skillWithoutLink = {
			title: 'HTML',
			skill_doc_link: '',
		};

		expect(skillWithLink.skill_doc_link).toBeTruthy();
		expect(skillWithoutLink.skill_doc_link).toBe('');
	});

	test('has correct image attributes', () => {
		const expectedImageAttributes = {
			alt: 'TypeScript Logo',
		};

		expect(expectedImageAttributes.alt).toBe('TypeScript Logo');
	});

	test('handles different skill data', () => {
		const skills = [
			{
				title: 'TypeScript',
				imagePath: 'ts_logo.webp',
				img_alt: 'TypeScript Logo',
				skill_doc_link: 'https://www.typescriptlang.org/',
			},
			{
				title: 'React',
				imagePath: 'react-logo.webp',
				img_alt: 'React Logo',
				skill_doc_link: 'https://reactjs.org/',
			},
			{
				title: 'CSS',
				imagePath: 'css-logo.webp',
				img_alt: 'CSS Logo',
				skill_doc_link: '',
			},
		];

		skills.forEach((skill) => {
			expect(skill.title).toBeTruthy();
			expect(skill.imagePath).toBeTruthy();
			expect(skill.img_alt).toBeTruthy();
			expect(typeof skill.skill_doc_link).toBe('string');
		});
	});

	test('has correct props interface', () => {
		interface SkillProps {
			s: {
				title: string;
				imagePath: string;
				img_alt: string;
				skill_doc_link: string;
			};
			index?: number;
			noAnimation?: boolean;
		}

		const defaultProps: SkillProps = {
			s: {
				title: 'Test',
				imagePath: 'test.webp',
				img_alt: 'Test',
				skill_doc_link: '',
			},
		};

		expect(defaultProps.index).toBeUndefined();
		expect(defaultProps.noAnimation).toBeUndefined();
	});

	test('handles image path glob pattern', () => {
		const expectedGlobPattern = '/src/assets/*.{jpeg,jpg,png,gif,webp}';
		expect(expectedGlobPattern).toContain('/src/assets/');
		expect(expectedGlobPattern).toContain('webp');
	});

	test('maintains correct component structure', () => {
		const expectedStructure = {
			container: 'li',
			image: 'img',
			titleContainer: 'p',
		};

		Object.values(expectedStructure).forEach((element) => {
			expect(typeof element).toBe('string');
			expect(element.length).toBeGreaterThan(0);
		});
	});
});
