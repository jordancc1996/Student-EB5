/**
 * Verify relatedFaqs slug resolution (id-ascending order, matching reference).
 */
const BASE = process.argv[2] ?? 'http://localhost:4321';

const slugIdMap = {
  'what-is-eb5-visa-program': 1,
  'minimum-investment-requirements': 2,
  'eb5-process-timeline': 3,
  'can-f1-students-apply-eb5': 4,
  'what-is-regional-center': 5,
  'family-members-included': 6,
  'business-failure-consequences': 7,
  'active-management-required': 8,
  'direct-vs-regional-center-eb5': 9,
  'how-studenteb5-can-help': 10,
  'h1b-self-sponsor-green-card-eb5': 11,
  'h1b-grace-period-eb5-options': 12,
  'rural-eb5-india-fastest-green-card': 13,
  'eb5-concurrent-filing-work-permit-timeline': 14,
  'parents-gift-eb5-investment-funds': 15,
  'child-aging-out-green-card-cspa-eb5': 16,
};

function expectedIdOrder(relatedSlugs) {
  return [...relatedSlugs]
    .map((slug) => ({ slug, id: slugIdMap[slug] }))
    .sort((a, b) => a.id - b.id)
    .map((x) => x.slug);
}

function extractRelatedHrefs(html) {
  const relatedSection =
    html.match(/Related Questions[\s\S]*?(?=Still Have Questions|<\/main>)/)?.[0] ?? '';
  return [...relatedSection.matchAll(/href="\/faq\/([^"]+)"/g)].map((m) => m[1]);
}

const cases = [
  {
    slug: 'what-is-eb5-visa-program',
    relatedSlugs: [
      'minimum-investment-requirements',
      'eb5-process-timeline',
      'can-f1-students-apply-eb5',
    ],
    expectLinksSection: true,
  },
  {
    slug: 'family-members-included',
    relatedSlugs: [
      'what-is-eb5-visa-program',
      'can-f1-students-apply-eb5',
      'minimum-investment-requirements',
    ],
    expectLinksSection: false,
  },
  {
    slug: 'h1b-grace-period-eb5-options',
    relatedSlugs: [
      'h1b-self-sponsor-green-card-eb5',
      'what-is-eb5-visa-program',
      'eb5-process-timeline',
    ],
    expectLinksSection: true,
  },
  {
    slug: 'how-studenteb5-can-help',
    relatedSlugs: [
      'what-is-eb5-visa-program',
      'can-f1-students-apply-eb5',
      'what-is-regional-center',
    ],
    expectLinksSection: true,
  },
  {
    slug: 'active-management-required',
    relatedSlugs: [
      'what-is-regional-center',
      'direct-vs-regional-center-eb5',
      'minimum-investment-requirements',
    ],
    expectLinksSection: true,
  },
];

console.log(`=== FAQ RELATED + LINKS CHECK (${BASE}) ===\n`);
let failed = 0;

for (const { slug, relatedSlugs, expectLinksSection } of cases) {
  const res = await fetch(`${BASE}/faq/${slug}`);
  const html = await res.text();
  const hasLinksSection = html.includes('Related Resources');
  const hrefs = extractRelatedHrefs(html);
  const expected = expectedIdOrder(relatedSlugs);

  const linksOk = hasLinksSection === expectLinksSection;
  const slugsSetOk =
    hrefs.length === relatedSlugs.length && relatedSlugs.every((s) => hrefs.includes(s));
  const slugsOrderOk =
    hrefs.length === expected.length && expected.every((s, i) => hrefs[i] === s);

  console.log(`/faq/${slug}`);
  console.log(`  HTTP: ${res.status}`);
  console.log(`  Related Resources section: ${hasLinksSection} (expected: ${expectLinksSection}) ${linksOk ? 'OK' : 'FAIL'}`);
  console.log(`  Expected related slugs (id order): ${expected.join(' | ')}`);
  console.log(`  Rendered related slugs: ${hrefs.join(' | ') || '(none)'}`);
  console.log(`  Related slug set match: ${slugsSetOk ? 'PASS' : 'FAIL'}`);
  console.log(`  Related slug order match: ${slugsOrderOk ? 'PASS' : 'FAIL'}`);
  console.log('');

  if (!linksOk || !slugsSetOk || !slugsOrderOk || res.status !== 200) failed++;
}

process.exit(failed > 0 ? 1 : 0);
