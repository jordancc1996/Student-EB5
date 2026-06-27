/**
 * researchPosts.json → src/content/blog/*.md
 *
 * Data source: student-visa-launchpad-REFERENCE/_migration-notes/researchPosts.json
 * (36/36 entries verified against BlogPost interface — not parsed from .ts source)
 *
 * Usage: node scripts/migrate-research-posts.mjs [--slugs=a,b] [--batch=0:6]
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

function loadPostsFromJson() {
  const raw = fs.readFileSync(JSON_SOURCE, 'utf-8');
  const data = JSON.parse(raw);
  return Object.values(data);
}

function assetBasename(imagePath) {
  if (!imagePath) return null;
  return path.basename(imagePath);
}

function resolveAssetPath(slug, basename) {
  const fileDir = path.dirname(path.join(BLOG_DIR, `${slug}.md`));
  const absoluteAsset = path.join(ROOT, 'src/assets', basename);
  const relative = path.relative(fileDir, absoluteAsset).replace(/\\/g, '/');
  return relative.startsWith('.') ? relative : `./${relative}`;
}

function yamlQuote(value) {
  if (
    value.includes(':') ||
    value.includes('#') ||
    value.includes('"') ||
    value.includes("'") ||
    value.includes('\n') ||
    value.startsWith(' ') ||
    value.endsWith(' ')
  ) {
    return JSON.stringify(value);
  }
  return value;
}

function toYamlArray(items, indent = 0) {
  const pad = ' '.repeat(indent);
  return items.map((item) => `${pad}- ${yamlQuote(item)}`).join('\n');
}

function buildFrontmatter(post) {
  const slug = post.slug;
  const lines = ['---'];
  lines.push(`id: ${post.id}`);
  lines.push(`slug: ${yamlQuote(slug)}`);
  lines.push(`title: ${yamlQuote(post.title)}`);
  lines.push(`metaTitle: ${yamlQuote(post.metaTitle)}`);
  lines.push(`metaDescription: ${yamlQuote(post.metaDescription)}`);
  lines.push(`excerpt: ${yamlQuote(post.excerpt)}`);
  lines.push(`date: ${yamlQuote(post.date)}`);
  if (post.updatedDate) lines.push(`updatedDate: ${yamlQuote(post.updatedDate)}`);
  lines.push(`category: ${yamlQuote(post.category)}`);
  lines.push(`readTime: ${yamlQuote(post.readTime)}`);
  lines.push(`image: ${yamlQuote(resolveAssetPath(slug, assetBasename(post.image)))}`);
  if (post.heroImage) {
    lines.push(
      `heroImage: ${yamlQuote(resolveAssetPath(slug, assetBasename(post.heroImage)))}`,
    );
  }
  lines.push(`imageAlt: ${yamlQuote(post.imageAlt)}`);
  lines.push(`author: ${yamlQuote(post.author)}`);
  lines.push('keywords:');
  lines.push(toYamlArray(post.keywords, 2));
  if (post.relatedPosts?.length) {
    lines.push('relatedPosts:');
    lines.push(toYamlArray(post.relatedPosts, 2));
  }
  lines.push('---');
  return lines.join('\n');
}

function writePost(post) {
  const outPath = path.join(BLOG_DIR, `${post.slug}.md`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${buildFrontmatter(post)}\n\n${post.content.trimEnd()}\n`, 'utf-8');
  return outPath;
}

const invoked =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invoked) {
  if (!fs.existsSync(JSON_SOURCE)) {
    console.error(`JSON source not found: ${JSON_SOURCE}`);
    process.exit(1);
  }

  const allPosts = loadPostsFromJson();

  if (allPosts.length !== 36) {
    console.warn(`Warning: JSON contains ${allPosts.length} posts (expected 36)`);
  }

  const args = process.argv.slice(2);
  const slugArg = args.find((a) => a.startsWith('--slugs='))?.split('=')[1];
  const batchArg = args.find((a) => a.startsWith('--batch='))?.split('=')[1];
  const cleanArg = args.includes('--clean');

  if (cleanArg) {
    function removeMd(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) removeMd(full);
        else if (entry.name.endsWith('.md')) fs.unlinkSync(full);
      }
    }
    if (fs.existsSync(BLOG_DIR)) removeMd(BLOG_DIR);
    console.log('Removed existing .md files from src/content/blog/');
  }

  let posts = allPosts;
  if (slugArg) {
    const slugs = new Set(slugArg.split(',').map((s) => s.trim()));
    posts = allPosts.filter((p) => slugs.has(p.slug));
  } else if (batchArg) {
    const [start, count] = batchArg.split(':').map(Number);
    posts = allPosts.slice(start, start + count);
  }

  const written = posts.map(writePost);
  console.log(`Source: ${path.relative(ROOT, JSON_SOURCE)}`);
  console.log(`Wrote ${written.length} file(s):`);
  for (const f of written) {
    console.log(`  ${path.relative(ROOT, f)}`);
  }
}

export { loadPostsFromJson, buildFrontmatter, writePost, resolveAssetPath };
