import { z, defineCollection } from 'astro:content';

export const collections = {
  'posts': defineCollection({
    type: 'content', // v2.5.0 and later
    schema: z.object({
      title: z.string(),
      desc: z.string(),
      heat: z.number(),
      date: z.date(),
      animal: z.string().optional(),
      draft: z.boolean().optional(),
    }),
  }),
};
