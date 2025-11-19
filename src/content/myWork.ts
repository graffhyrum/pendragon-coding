import type { ContentTemplate } from '../types/ContentTemplate.ts';

const content: ContentTemplate = {
	sections: [
		{
			title: 'Projects',
			subtitle: 'This is a collection of projects that I have worked on.',
			layoutMode: 'grid',
			content: [
				{
					title: 'This website.',
					link: [
						{
							href: 'https://github.com/graffhyrum/pendragon-coding',
						},
					],
					description:
						'This website is built using Astro, Tailwind CSS, and Markdown. It is hosted on Netlify.',
				},
				{
					title: 'V1 of this Website',
					link: [
						{
							href: 'https://github.com/graffhyrum/pendragon-website',
						},
					],
					description:
						'The first version of this website,  built using Rust, Axum, and Askama.',
				},
				{
					title: 'Playwright JSON Summary Reporter',
					link: [
						{
							href: 'https://github.com/graffhyrum/playwright-json-summary-reporter',
						},
					],
					description:
						'A custom reporter for Playwright that outputs a JSON summary of test results. I contributed to this project by adding a new feature that allows the user to specify a custom output file path.',
				},
				{
					title: 'Playwright Project Showcase',
					link: [
						{
							href: 'https://github.com/graffhyrum/playwright-project-demo',
						},
					],
					description:
						'A Playwright test project showcase. Most of this code was used in or inspired by my professional work as an SDET. Key features include: custom, composed fixtures, multi-environment support with setup and teardown, and a custom reporter that outputs a JSON summary of test results for use in other integrations.',
				},
				{
					title: 'OvationCXM',
					link: [
						{
							href: 'https://www.ovationcxm.com/',
						},
					],
					description:
						'A customer experience management platform that helps businesses collect and analyze customer feedback. I contributed to this project by triaging (and sometimes fixing) bugs, and was the primary developer for the automated testing framework.',
				},
			],
		},
		{
			title: 'Gists',
			subtitle: 'This is a collection of gists that I have created.',
			layoutMode: 'single-column',
			content: [
				{
					title: 'Typescript - Recursive Partial Type',
					link: [
						{
							href: 'https://gist.github.com/graffhyrum/7f267cea2021ad4246be23ec5f6d4a4e',
						},
					],
					description:
						'<script is:inline src="https://gist.github.com/graffhyrum/7f267cea2021ad4246be23ec5f6d4a4e.js"></script>',
				},
				{
					title: "Typescript - 'One of' Type",
					link: [
						{
							href: 'https://gist.github.com/graffhyrum/d705dc05cf3890303dd9aa1c9598b08d',
						},
					],
					description:
						'<script is:inline src="https://gist.github.com/graffhyrum/d705dc05cf3890303dd9aa1c9598b08d.js"></script>',
				},
				{
					title: 'Typescript - Type-safe Entries',
					link: [
						{
							href: 'https://gist.github.com/graffhyrum/1253b24fbe80d5f508544736d83d9532',
						},
					],
					description:
						'<script is:inline src="https://gist.github.com/graffhyrum/1253b24fbe80d5f508544736d83d9532.js"></script>',
				},
				{
					title: 'Typescript - Branded Types',
					link: [
						{
							href: 'https://gist.github.com/graffhyrum/bdf39a9e7fe18876fcc1dabf11c92457',
						},
					],
					description:
						'<script is:inline src="https://gist.github.com/graffhyrum/bdf39a9e7fe18876fcc1dabf11c92457.js"></script>',
				},
				{
					title: 'Typescript - Retry Wrapper',
					link: [
						{
							href: 'https://gist.github.com/graffhyrum/ffb48dee28a7739d444e22791d95028f',
						},
					],
					description:
						'<script is:inline src="https://gist.github.com/graffhyrum/ffb48dee28a7739d444e22791d95028f.js"></script>',
				},
			],
		},
	],
};

export default content;
