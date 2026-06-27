/**
 * Verify FAQ markdown body matches faqData.json answer byte-for-byte.
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

const faqs = JSON.parse(fs.readFileSync(JSON_SOURCE, 'utf-8'));
let passed = 0;
let failed = 0;

for (const faq of faqs) {
  const file = path.join(FAQ_DIR, `${faq.slug}.md`);
  const raw = fs.readFileSync(file, 'utf-8');
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').replace(/^\n/, '').trimEnd();
  const expected = faq.answer.trimEnd();
  if (body === expected) {
    passed++;
    console.log(`PASS ${faq.slug}`);
  } else {
    failed++;
    console.log(`FAIL ${faq.slug} (body length ${body.length} vs expected ${expected.length})`);
  }
}

console.log(`\n${passed}/${faqs.length} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
