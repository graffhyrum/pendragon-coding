import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.date(),
	}),
});

const testimonials = defineCollection({
	type: 'content',
	schema: z.object({}).optional(),
});

export const collections = {
	blog,
	testimonials,
};
