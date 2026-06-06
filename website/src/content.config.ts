import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  group: z.enum(['intro', 'install', 'concepts', 'guides', 'faq']),
  order: z.number(),
  draft: z.boolean().default(false),
});

const docsZh = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs-zh' }),
  schema: docSchema,
});

const docsEn = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs-en' }),
  schema: docSchema,
});

export const collections = { 'docs-zh': docsZh, 'docs-en': docsEn };
