/**
 * Verify blog collection image paths resolve on disk and via Astro content layer.
 * Usage: node scripts/verify-blog-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

async function main() {
  const { getCollection } = await import(pathToFileURL(path.join(ROOT, '.astro/content.d.ts')).href).catch(
    () => import('astro:content'),
  );

  let entries;
  try {
    const astroContent = await import(
      pathToFileURL(path.join(ROOT, 'node_modules/astro/dist/content/index.js')).href
    );
    // Fallback: filesystem check only
    entries = null;
  } catch {
    entries = null;
  }

  // Filesystem verification from generated markdown frontmatter
  const blogDir = path.join(ROOT, 'src/content/blog');
  const mdFiles = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md')) mdFiles.push(full);
    }
  }
  walk(blogDir);

  const results = [];
  for (const file of mdFiles) {
    const text = fs.readFileSync(file, 'utf-8');
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) continue;
    const imageMatch = fm[1].match(/^image:\s*(.+)$/m);
    const heroMatch = fm[1].match(/^heroImage:\s*(.+)$/m);
    const slugMatch = fm[1].match(/^slug:\s*(.+)$/m);
    const slug = slugMatch?.[1]?.replace(/^"|"$/g, '') ?? path.relative(blogDir, file);

    for (const [field, raw] of [
      ['image', imageMatch?.[1]],
      ['heroImage', heroMatch?.[1]],
    ]) {
      if (!raw) continue;
      const rel = raw.trim().replace(/^"|"$/g, '');
      const abs = path.resolve(path.dirname(file), rel);
      const exists = fs.existsSync(abs);
      results.push({ slug, field, rel, abs, exists });
    }
  }

  console.log(`Checked ${mdFiles.length} markdown file(s):\n`);
  for (const r of results) {
    console.log(
      `${r.exists ? 'OK' : 'MISSING'}  ${r.slug}  ${r.field}: ${r.rel}`,
    );
    if (!r.exists) process.exitCode = 1;
  }

  // Astro content layer check (requires prior astro sync)
  try {
    const { getCollection: getCol } = await import('astro:content');
    const posts = await getCol('blog');
    console.log(`\nAstro getCollection('blog'): ${posts.length} entries`);
    for (const post of posts) {
      const img = post.data.image;
      const hero = post.data.heroImage;
      console.log(
        `  ${post.id}  image=${typeof img === 'object' ? img.src ?? '[ImageMetadata]' : img}${
          hero ? `  hero=${typeof hero === 'object' ? hero.src ?? '[ImageMetadata]' : hero}` : ''
        }`,
      );
    }
  } catch (err) {
    console.warn('\nSkipping astro:content import (run via astro):', err.message);
  }
}

main();
