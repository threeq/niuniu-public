import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  group: z.enum(['intro', 'install', 'concepts', 'guides', 'faq', 'privacy']),
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

const blogZh = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog-zh' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    keywords: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { 'docs-zh': docsZh, 'docs-en': docsEn, 'blog-zh': blogZh };
