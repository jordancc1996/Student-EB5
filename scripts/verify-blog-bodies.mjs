/**
 * Verify markdown body matches researchPosts.json content byte-for-byte.
 * Usage: node scripts/verify-blog-bodies.mjs [--slugs=a,b] [--all]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const JSON_SOURCE = path.resolve(
  ROOT,
  '../student-visa-launchpad-REFERENCE/_migration-notes/researchPosts.json',
);

function loadPostsBySlug() {
  const data = JSON.parse(fs.readFileSync(JSON_SOURCE, 'utf-8'));
  const map = new Map();
  for (const post of Object.values(data)) {
    map.set(post.slug, post);
  }
  return map;
}

function readMdBody(slug) {
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(mdPath)) return { error: 'missing file' };
  const text = fs.readFileSync(mdPath, 'utf-8');
  const parts = text.split('\n---\n');
  if (parts.length < 2) return { error: 'invalid frontmatter fence' };
  const body = parts
    .slice(1)
    .join('\n---\n')
    .replace(/^\n/, '')
    .trimEnd();
  return { body, mdPath };
}

const postsBySlug = loadPostsBySlug();
const args = process.argv.slice(2);
const allArg = args.includes('--all');
const slugArg = args.find((a) => a.startsWith('--slugs='))?.split('=')[1];

let slugs = slugArg
  ? slugArg.split(',').map((s) => s.trim())
  : allArg
    ? [...postsBySlug.keys()].sort()
    : [];

if (!slugs.length) {
  console.error('Provide --all or --slugs=...');
  process.exit(1);
}

let failed = 0;
for (const slug of slugs) {
  const post = postsBySlug.get(slug);
  if (!post) {
    console.log(`FAIL  ${slug}  (not in JSON)`);
    failed += 1;
    continue;
  }
  const result = readMdBody(slug);
  if (result.error) {
    console.log(`FAIL  ${slug}  (${result.error})`);
    failed += 1;
    continue;
  }
  const expected = post.content.trimEnd();
  const match = result.body === expected;
  if (match) {
    console.log(`OK    ${slug}  (${expected.length} chars)`);
  } else {
    console.log(
      `FAIL  ${slug}  json=${expected.length} md=${result.body.length} diff=${expected.length - result.body.length}`,
    );
    failed += 1;
  }
}

if (failed) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}

console.log(`\nAll ${slugs.length} slug(s) byte-identical.`);
