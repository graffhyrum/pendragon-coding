import type { ContentTemplate } from '../types/ContentTemplate.ts';

const content: ContentTemplate = {
	sections: [
		{
			title: 'Articles',
			subtitle: "Articles that I've read and found interesting.",
			content: [
				{
					title: 'The Grug Brained Developer',
					link: [
						{
							href: 'https://grugbrain.dev/',
						},
					],
					description:
						"A layman's guide to thinking like the self-aware smol brained. Complexity bad, you say now.",
				},
				{
					title: 'HTMX on Locality of Behavior',
					link: [
						{
							href: 'https://htmx.org/essays/locality-of-behaviour/',
						},
					],
					description:
						'An article on the tradeoffs of Separation of Concerns and Locality of Behavior.',
				},
				{
					title: "The Website vs. Web App Dichotomy Doesn't Exist",
					link: [
						{
							href: 'https://jakelazaroff.com/words/the-website-vs-web-app-dichotomy-doesnt-exist',
						},
					],
					description:
						'An analysis of websites across two axes: Static vs Dynamic & Online vs Offline.',
				},
				{
					title: 'As a JS Developer, ES6 Classes are what keep me up at night.',
					link: [
						{
							href: 'https://www.toptal.com/javascript/es6-class-chaos-keeps-js-developer-up',
						},
					],
					description:
						'JavaScript is an oddball of a language with numerous approaches to almost any problem. When ES6 added the “class” keyword, did it save the day or just muddy the waters? In this article, Toptal Freelance JavaScript Developer Justen Robertson explores OOP in modern JS.',
				},
				{
					title: 'Uncle Bob on FP & OO',
					link: [
						{
							title: 'First Article',
							href: 'https://blog.cleancoder.com/uncle-bob/2014/11/24/FPvsOO.html',
						},
						{
							title: 'Second Article',
							href: 'https://blog.cleancoder.com/uncle-bob/2018/04/13/FPvsOO.html',
						},
					],
					description:
						'Two articles from Robert Martin that talk about how FP and OO are not mutually exclusive, and how they might better be conceptualized to get the benefits of both in your projects.',
				},
				{
					title: 'Test IDs. Always.',
					link: [
						{
							href: 'https://engineering.kablamo.com.au/posts/2020/test-ids-always/',
						},
					],
					description:
						"'Why automation attributes are a non-negotiable part of web development.' A good primer on how and why to use test attributes for e2e tests.",
				},
				{
					title: 'Become an SDET Hero',
					link: [
						{
							href: 'https://www.developerswhotest.com/episode-4-becoming-an-sdet-hero-with-andrew-knight/',
						},
					],
					description:
						'A really insightful episode of the Developers who Test Podcast. Andrew Knight talks about distinguishing SDETs from Automation engineers and other developer roles.',
				},
				{
					title: "I'm a Developer, not a Compiler",
					link: [
						{
							href: 'https://www.blobstreaming.org/im-a-developer-not-a-compiler/?utm_source=tldrwebdev',
						},
					],
					description:
						'A short blog post that nicely captures what I dislike most about the prevalent technical interview process. "Any question that takes 5 seconds to answer with Google/ChatGPT is not a good question." Amen.',
				},
				{
					title: 'How to actually use Node environment variables',
					link: [
						{
							href: 'https://medium.com/free-code-camp/heres-how-you-can-actually-use-node-environment-variables-8fdf98f53a0a',
						},
					],
					description:
						'A cheeky article (my favorite kind) on working with' +
						' process environment variables in Node.js. It sadly does not' +
						' mention the ability to extend the environment object with' +
						" declaration files, but it's still a good read.",
				},
				{
					title: 'Left to Right Programming',
					link: [{ href: 'https://graic.net/p/left-to-right-programming' }],
					description:
						'A short article about the benefits of languages with progressive disclosure patterns.',
				},
				{
					title: 'The Pit of Success',
					link: [
						{
							href: 'https://blog.codinghorror.com/falling-into-the-pit-of-success/',
						},
					],
					description:
						'"...a well-designed system makes it easy to do the right things and annoying (but not impossible) to do the wrong things."',
				},
				{
					title: '5-Minute DevOps',
					link: [
						{
							href: 'https://bdfinst.medium.com/5-minute-devops-solving-the-cd-talent-problem-1940302449ee',
						},
					],
					description:
						'A case study for how to do DevOps and CD, for real life!',
				},
			],
		},
		{
			title: 'Testing Tools',
			subtitle: 'Tools for QA automation and software testing',
			content: [
				{
					title: 'Playwright',
					link: [
						{
							href: 'https://playwright.dev/',
						},
					],
					description:
						'A Node.js library to automate Chromium, Firefox and WebKit with a single API. My go-to for Web UI and API test automation.',
				},
				{
					title: 'Test Automation University',
					link: [
						{
							href: 'https://testautomationu.applitools.com/',
						},
					],
					description:
						'An excellent, free, training resource for learning QA automation.',
				},
				{
					title: 'Testing Accessibility',
					link: [
						{
							href: 'https://testingaccessibility.com/',
						},
					],
					description:
						'A comprehensive resource for learning about accessibility testing and ensuring web applications are usable by everyone.',
				},
				{
					title: '"Getting started with QA Automation"',
					link: [
						{
							href: 'https://www.reddit.com/r/QualityAssurance/comments/mo5num/guide_getting_started_with_qa_automation/',
						},
					],
					description:
						'A good reddit post by u/Fissherin on r/QualityAssurance about how to 0 > 1 a QAE career',
				},
			],
		},
		{
			title: 'Cool Tools',
			subtitle: 'Tools I like to use or think are interesting',
			content: [
				{
					title: 'Photopea',
					link: [
						{
							href: 'https://www.photopea.com/',
						},
					],
					description: 'Free photo editing in the browser.',
				},
				{
					title: 'Obsidian',
					link: [
						{
							href: 'https://obsidian.md/',
						},
					],
					description:
						'Obsidian is the private and flexible writing app that adapts to the way you think.',
				},
				{
					title: 'Transform Tools',
					link: [
						{
							href: 'https://transform.tools',
						},
					],
					description:
						'A polyglot web converter. I found this especially useful when trying to infer undocumented API interfaces for testing.',
				},
				{
					title: 'DummyJSON',
					link: [{ href: 'https://dummyjson.com/' }],
					description: "'Free Fake REST API for Placeholder JSON Data",
				},
			],
		},
		{
			title: 'Disciplines',
			subtitle:
				"Disciplines that I'm interested in and want to learn more about.",
			content: [
				{
					title: 'The Twelve Factor App',
					link: [
						{
							href: 'https://12factor.net/',
						},
					],
					description:
						'A methodology for building modern, scalable, maintainable software-as-a-service apps.',
				},
				{
					title: 'Hexagonal Architecture',
					link: [
						{
							href: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/hexagonal-architecture.html',
						},
					],
					description:
						"I came to this pattern by way of Uncle Bob's 'Clean Architecture' book. I've used this pattern in several projects. It's a great way to protect yourself from tech debt.",
				},
			],
		},
		{
			title: 'Longform Content',
			subtitle:
				'Do you have too much time and not enough knowledge? Click a' +
				' link below for at least 30 minutes of curated, high-value' +
				' content! Act now while supplies last.',
			content: [
				{
					title: 'Staff Engineer @ Meta by Age 25 | Evan King',
					link: [
						{
							href: 'https://www.developing.dev/p/staff-engineer-meta-by-age-25-evan?r=2v0lru&utm_campaign=post&utm_medium=web&showWelcomeOnShare=false',
						},
					],
					description:
						'A 2 hr video between two Staff Engineers talking about their career trajectory and giving (good) advice.',
				},
				{
					title: 'How to Misuse and Abuse DORA metrics',
					link: [{ href: 'https://bryanfinster.com/whitepapers/dora-metrics' }],
					description:
						'"This article explains how organizations often misuse DORA metrics—deployment frequency, lead time, change-fail rate, and mean time to restore—by turning them into performance targets or vanity dashboards. It shows how these metrics are intended as signals to guide continuous improvement, not as goals in themselves. The paper urges leaders to pair DORA metrics with customer-value, culture, and sustainability measures, invest in trust and team learning, and focus on improving delivery processes rather than chasing numbers."',
				},
			],
		},
		{
			title: 'AI stuff',
			subtitle:
				'AI, so hot right now. Learn how to use it effectively and 200x your salary (probably)...',
			content: [
				{
					title: 'Some practical tips for building agentic AI systems',
					link: [
						{
							href: 'https://userjot.com/blog/best-practices-building-agentic-ai-systems',
						},
					],
					description:
						"I found a lot of value from this article. Hopefully it doesn't age out in 3 months.",
				},
			],
		},
	],
};

export default content;
