import type { ContentTemplate } from './types/ContentTemplate.ts';

const content: ContentTemplate = {
	sections: [
		{
			title: 'Shoutouts',
			subtitle:
				'Content creators that I love and admire.  I would not be where I am today without them. Thank you all!',
			content: [
				{
					title: 'Michael B Paulson AKA Primeagen, The',
					link: [
						{
							title: 'Youtube',
							href: 'https://www.youtube.com/@ThePrimeagen',
						},
					],
					description:
						'My favorite VIM content creator. BTW he works at Netflix, just so you know... Netflix btw... =D',
				},
				{
					title: 'Fireship',
					link: [
						{
							title: 'Main Website',
							href: 'https://fireship.io/',
						},
						{
							title: 'Youtube',
							href: 'https://www.youtube.com/c/fireship',
						},
					],
					description:
						'Succinct and entertaining tech news and code tutorials.',
				},
				{
					title: 'Robert Martin AKA Uncle Bob',
					link: [
						{
							title: 'Wiki Page',
							href: 'https://en.wikipedia.org/wiki/Robert_C._Martin',
						},
					],
					description:
						'A very old programmer, likes to talk about punch cards and Star Trek. He also invented 4/5ths of the SOLID principles or something. On an unrelated note, how do YOU feel about Test Driven Development?',
				},
				{
					title: 'Matt Pocock',
					link: [
						{
							title: 'Their Website',
							href: 'https://www.mattpocock.com/',
						},
					],
					description:
						"My favorite Typescript content creator (sorry Prime). Good youtube content and lots of useful code snippets that I've *definitely not stolen* for my gist page.",
				},
				{
					title: 'Triss AKA NoBoilerplate',
					link: [
						{
							title: 'Youtube',
							href: 'https://www.youtube.com/@NoBoilerplate',
						},
					],
					description:
						"Rust evangelist, ADHD life-hacker, and overall phenomenal content creator. Can't say enough good things. Thanks for telling me about Obsidian!",
				},
				{
					title: 'Jeremy Chone',
					link: [
						{
							title: 'His Website',
							href: 'https://jeremychone.com/',
						},
					],
					description:
						"My second favorite Rust content creator (sorry again, Prime. You got the first entry in the list, don't be mad.). I would have taken WAY longer to make this site without his content.",
				},
				{
					title: 'Kai Lentit AKA Programmers are also human',
					link: [
						{
							title: 'Twitter/X',
							href: 'https://twitter.com/kailentit',
						},
						{
							title: 'Youtube',
							href: 'https://www.youtube.com/@programmersarealsohuman5909',
						},
					],
					description: "Satirical Developer 'interviews'",
				},
				{
					title: 'Gleb Bahmutov',
					link: [
						{
							title: 'His Website',
							href: 'https://glebbahmutov.com/',
						},
					],
					description:
						'My favorite QA Engineering content creator. He made a ton of content on Cypress that kept me employed through my first QAE role.',
				},
				{
					title: 'Pathrise',
					link: [
						{
							title: 'Their Website',
							href: 'https://www.pathrise.com/',
						},
						{
							title: 'My Referral Link',
							href: 'https://www.pathrise.com?utm_campaign=pendragon.josh%40gmail.com&utm_source=fellow_referral&utm_medium=referral',
						},
					],
					description:
						"Pathrise is a career accelerator that works with students and professionals 1-on-1 so they can land their dream job in tech. If you're interested in working with any of the companies I've listed on my resume, I highly recommend you check them out. They're free until you get a job, and they have a 9.5/10 rating on Trustpilot.",
				},
			],
		},
	],
};

export default content;
