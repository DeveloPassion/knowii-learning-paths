import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const modules = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/modules' }),
  schema: z.object({
    title: z.string(),
    product: z.string(),            // store-website product id, or a knowii-* pseudo id
    kind: z.enum(['kit', 'course', 'workshop', 'guide', 'tool', 'library', 'community', 'service', 'book', 'free']),
    time: z.string(),               // human estimate: "80 min", "2 weeks"
    format: z.string(),
    access: z.string().url().optional(),
    storeUrl: z.string().url().optional(),
    summary: z.string(),
  }),
});

const step = z.object({
  module: z.string(),
  note: z.string().optional(),
  optional: z.boolean().default(false),
});

const paths = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/paths' }),
  schema: z.object({
    title: z.string(),
    purchase: z.string(),           // what the customer bought, as they see it on the receipt
    products: z.array(z.string()),  // store-website ids covered by this path
    storeUrl: z.string().url().optional(),
    intro: z.string(),
    phases: z.array(z.object({ title: z.string(), when: z.string().optional(), steps: z.array(step) })),
    next: z.string().optional(),    // where to go once done (soft upgrade / community)
    order: z.number().default(100),
  }),
});

export const collections = { modules, paths };
