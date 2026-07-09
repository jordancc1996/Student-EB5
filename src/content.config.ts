import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog collection — mirrors BlogPost from src/data/researchPosts.ts.
 *
 * Field mapping notes (Stage 1):
 * - `content` is NOT frontmatter. It maps to the entry body (equivalent to
 *   BlogPost.content). Access via entry.body and pass to renderArticleContent().
 *   The body uses the project's custom line format (<intro>, # headings, etc.),
 *   not standard Markdown — do not use render() from astro:content for it.
 * - `image` and `heroImage` use Astro's image() helper. In frontmatter these
 *   become relative paths (e.g. image: ../../assets/blog-foo.jpg), not Vite
 *   import bindings like the current TS file uses.
 * - `date` / `updatedDate` stay as strings to preserve the human-readable
 *   format in researchPosts.ts (e.g. "June 23, 2026"), not ISO dates.
 * - `slug` is stored explicitly in frontmatter. The glob loader uses it as the
 *   collection entry id when present, supporting nested routes such as
 *   f1-students/f1-to-eb5-green-card.
 */
const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
  }),
  schema: ({ image }) =>
    z.object({
      id: z.number().int(),
      slug: z.string(),
      title: z.string(),
      metaTitle: z.string(),
      metaDescription: z.string(),
      excerpt: z.string(),
      date: z.string(),
      updatedDate: z.string().optional(),
      category: z.string(),
      readTime: z.string(),
      image: image(),
      heroImage: image().optional(),
      imageAlt: z.string(),
      author: z.string(),
      keywords: z.array(z.string()),
      relatedPosts: z.array(z.string()).optional(),
      tocLabels: z.record(z.string()).optional(),
    }),
});

const faqLinkSchema = z.object({
  text: z.string(),
  url: z.string(),
});

const faq = defineCollection({
  loader: glob({
    base: './src/content/faq',
    pattern: '**/*.{md,mdx}',
  }),
  schema: () =>
    z.object({
      id: z.number().int(),
      slug: z.string(),
      question: z.string(),
      metaTitle: z.string(),
      metaDescription: z.string(),
      keywords: z.array(z.string()),
      category: z.string(),
      links: z.array(faqLinkSchema).optional(),
      relatedFaqs: z.array(z.string()).optional(),
      tocLabels: z.record(z.string()).optional(),
    }),
});

export const collections = {
  blog,
  faq,
};
