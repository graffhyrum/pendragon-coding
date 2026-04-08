import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		date: z.date(),
		description: z.string().optional(),
		author: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

const testimonials = defineCollection({
	loader: glob({ pattern: 'testimonials.ts', base: './src/content' }),
	schema: z.object({}).optional(),
});

export const collections = {
	blog,
	testimonials,
};
