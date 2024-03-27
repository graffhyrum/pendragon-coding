import type {ContentTemplate} from "./types/ContentTemplate.ts";

const content: ContentTemplate = {
  sections: [
    {
      title: "Articles",
      subtitle: "Articles that I've read and found interesting.",
      content: [
        {
          title: "The Grug Brained Developer",
          link: [{
            href: "https://grugbrain.dev/",
          }],
          description: "A layman's guide to thinking like the self-aware smol brained. Complexity bad, you say now.",
        },
        {
          title: "HTMX on Locality of Behavior",
          link: [{
            href: "https://htmx.org/essays/locality-of-behaviour/",
          }],
          description: "An article on the tradeoffs of Separation of Concerns and Locality of Behavior.",
        },
        {
          title: "The Website vs. Web App Dichotomy Doesn't Exist",
          link: [{
            href: "https://jakelazaroff.com/words/the-website-vs-web-app-dichotomy-doesnt-exist",
          }],
          description: "An analysis of websites across two axes: Static vs Dynamic & Online vs Offline.",
        },
        {
          title: "As a JS Developer, ES6 Classes are what keep me up at night.",
          link: [{
            href: "https://www.toptal.com/javascript/es6-class-chaos-keeps-js-developer-up",
          }],
          description: "JavaScript is an oddball of a language with numerous approaches to almost any problem. When ES6 added the “class” keyword, did it save the day or just muddy the waters? In this article, Toptal Freelance JavaScript Developer Justen Robertson explores OOP in modern JS."
        },
        {
          title: "Uncle Bob on FP & OO",
          link: [{
            title: "First Article",
            href: "https://blog.cleancoder.com/uncle-bob/2014/11/24/FPvsOO.html"
          }, {
            title: "Second Article",
            href: "https://blog.cleancoder.com/uncle-bob/2018/04/13/FPvsOO.html"
          }],
          description: "Two articles from Robert Martin that talk about how FP and OO are not mutually exclusive, and how they might better be conceptualized to get the benefits of both in your projects."
        },
        {
          title: "Test IDs. Always.",
          link: [
            {href: "https://engineering.kablamo.com.au/posts/2020/test-ids-always/"}
          ],
          description: "'Why automation attributes are a non-negotiable part of web development.' A good primer on how and why to use test attributes for e2e tests."
        },
        {
          title: "Become an SDET Hero",
          link: [{
            href: "https://www.developerswhotest.com/episode-4-becoming-an-sdet-hero-with-andrew-knight/"
          }],
          description: 'A really insightful episode of the Developers who Test Podcast. Andrew Knight talks about distinguishing SDETs from Automation engineers and other developer roles.'
        },
        {
          title:"I'm a Developer, not a Compiler",
          link:[{href:"https://www.blobstreaming.org/im-a-developer-not-a-compiler/?utm_source=tldrwebdev"}],
          description:'A short blog post that nicely captures what I dislike most about the prevalent technical interview process. "Any question that takes 5 seconds to answer with Google/ChatGPT is not a good question." Amen.'
        }
      ],
    },
    {
      title: "Testing Tools",
      subtitle: "Tools for QA automation and software testing",
      content: [
        {
          title: "Playwright",
          link: [
            {
              href: "https://playwright.dev/",
            }
          ],
          description: "A Node.js library to automate Chromium, Firefox and WebKit with a single API. My go-to for Web UI and API test automation.",
        },
        {
          title: "Test Automation University",
          link: [{
            href: "https://testautomationu.applitools.com/",
          }],
          description: "An excellent, free, training resource for learning QA automation.",
        },
      ]
    },
    {
      title: "Cool Tools",
      subtitle: "Tools I like to use or think are interesting",
      content: [
        {
          title: "Photopea",
          link: [{
            href: "https://www.photopea.com/",
          }],
          description: "Free photo editing in the browser.",
        },
        {
          title: "Obsidian",
          link: [{
            href: "https://obsidian.md/",
          }],
          description: "Obsidian is the private and flexible writing app that adapts to the way you think.",
        },
        {
          title: "Transform Tools",
          link: [{
            href: "https://transform.tools",
          }],
          description: "A polyglot web converter. I found this especially useful when trying to infer undocumented API interfaces for testing."
        }
      ],
    },
    {
      title: "Disciplines",
      subtitle: "Disciplines that I'm interested in and want to learn more about.",
      content: [
        {
          title: "The Twelve Factor App",
          link: [{
            href: "https://12factor.net/",
          }],
          description: "A methodology for building modern, scalable, maintainable software-as-a-service apps.",
        },
      ],
    }
  ],
};

export default content;