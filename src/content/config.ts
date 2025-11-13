import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.date(),
		description: z.string().optional(),
		author: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

const testimonials = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		href: z.string().url(),
		company: z.string().optional(),
		position: z.string().optional(),
	}),
});

export const collections = {
	blog,
	testimonials,
};
