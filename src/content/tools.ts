import type { ContentTemplate } from '../types/ContentTemplate.ts';

const content: ContentTemplate = {
	sections: [
		{
			title: 'Tools',
			subtitle:
				'Tools I use and recommend. These help me get things done.',
			contentKind: 'default',
			content: [
				{
					title: 'OxygenPDF',
					link: [
						{
							title: 'Website',
							href: 'https://oxygenpdf.com/',
						},
					],
					description:
						'Free online PDF editor and merger. Useful for quick PDF manipulations without installing software.',
				},
			],
		},
	],
};

export default content;