/**
 * Compare related FAQ order: local/preview vs live site.
 */
const LOCAL = process.argv[2] ?? 'http://localhost:4322';
const LIVE = 'https://www.studenteb5.com';

const pages = ['what-is-eb5-visa-program', 'family-members-included'];

function extractRelatedHrefs(html) {
  const relatedSection =
    html.match(/Related Questions[\s\S]*?(?=Still Have Questions|Consultation|footer)/i)?.[0] ?? '';
  return [...relatedSection.matchAll(/href="(?:https:\/\/www\.studenteb5\.com)?\/faq\/([^"]+)"/g)].map(
    (m) => m[1],
  );
}

console.log('=== LIVE vs LOCAL RELATED ORDER ===\n');
let failed = 0;

for (const slug of pages) {
  const [localRes, liveRes] = await Promise.all([
    fetch(`${LOCAL}/faq/${slug}`),
    fetch(`${LIVE}/faq/${slug}`),
  ]);
  const localHrefs = extractRelatedHrefs(await localRes.text());
  const liveHrefs = extractRelatedHrefs(await liveRes.text());
  const match =
    localHrefs.length === liveHrefs.length &&
    localHrefs.every((s, i) => s === liveHrefs[i]);

  console.log(`/faq/${slug}`);
  console.log(`  Live:  ${liveHrefs.join(' | ') || '(none)'}`);
  console.log(`  Local: ${localHrefs.join(' | ') || '(none)'}`);
  console.log(`  Order match: ${match ? 'PASS' : 'FAIL'}`);
  console.log('');

  if (!match) failed++;
}

process.exit(failed > 0 ? 1 : 0);
