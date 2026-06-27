/**
 * faqData.json → src/content/faq/*.md
 *
 * Data source: student-visa-launchpad-REFERENCE/_migration-notes/faqData.json
 * faqCategories is not in JSON — defined in src/lib/faq/categories.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FAQ_DIR = path.join(ROOT, 'src/content/faq');
const JSON_SOURCE = path.resolve(
  ROOT,
  '../student-visa-launchpad-REFERENCE/_migration-notes/faqData.json',
);

function loadFaqsFromJson() {
  return JSON.parse(fs.readFileSync(JSON_SOURCE, 'utf-8'));
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

function buildFrontmatter(faq) {
  const lines = ['---'];
  lines.push(`id: ${faq.id}`);
  lines.push(`slug: ${yamlQuote(faq.slug)}`);
  lines.push(`question: ${yamlQuote(faq.question)}`);
  lines.push(`metaTitle: ${yamlQuote(faq.metaTitle)}`);
  lines.push(`metaDescription: ${yamlQuote(faq.metaDescription)}`);
  lines.push(`category: ${yamlQuote(faq.category)}`);
  lines.push('keywords:');
  lines.push(toYamlArray(faq.keywords, 2));
  if (faq.links?.length) {
    lines.push('links:');
    for (const link of faq.links) {
      lines.push(`  - text: ${yamlQuote(link.text)}`);
      lines.push(`    url: ${yamlQuote(link.url)}`);
    }
  }
  if (faq.relatedFaqs?.length) {
    lines.push('relatedFaqs:');
    lines.push(toYamlArray(faq.relatedFaqs, 2));
  }
  lines.push('---');
  return lines.join('\n');
}

function migrate() {
  fs.mkdirSync(FAQ_DIR, { recursive: true });
  const faqs = loadFaqsFromJson();
  let written = 0;
  for (const faq of faqs) {
    const file = path.join(FAQ_DIR, `${faq.slug}.md`);
    const content = `${buildFrontmatter(faq)}\n${faq.answer}\n`;
    fs.writeFileSync(file, content, 'utf-8');
    written++;
    console.log(`Wrote ${faq.slug}.md`);
  }
  console.log(`\nDone: ${written}/${faqs.length} FAQ entries migrated.`);
}

migrate();
