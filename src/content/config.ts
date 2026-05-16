import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    description: z.string().optional(),
    draft: z.boolean().optional().default(false),
    series: z.string().optional(),
  }),
});

export const collections = { posts };
