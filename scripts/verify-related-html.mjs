const BASE = process.argv[2] ?? 'http://localhost:4322';

const cases = [
  {
    path: '/research/regional-center-shutdown-eb5-investor-protections',
    expectedDates: ['June 17, 2026', 'June 12, 2026', 'June 11, 2026'],
  },
  {
    path: '/research/f1-students/f1-to-eb5-green-card',
    expectedDates: ['June 23, 2026', 'June 17, 2026', 'June 12, 2026'],
  },
  {
    path: '/research/comparisons/h1b-vs-eb5-lifetime-cost-indian-chinese-students',
    expectedDates: ['June 23, 2026', 'June 12, 2026', 'June 11, 2026'],
  },
];

console.log(`=== RELATED POSTS HTML CHECK (${BASE}) ===\n`);
let failed = 0;

for (const { path, expectedDates } of cases) {
  const res = await fetch(`${BASE}${path}`);
  const html = await res.text();
  const section = html.match(/Related Articles[\s\S]*?<\/section>/)?.[0] ?? '';
  const dates = [...section.matchAll(/<span>([^<]*\d{4})<\/span>/g)].map((m) => m[1]);
  const ok =
    dates.length === 3 &&
    expectedDates.every((d, i) => dates[i] === d);
  console.log(path);
  console.log('  expected:', expectedDates.join(' | '));
  console.log('  rendered:', dates.join(' | '));
  console.log('  match:', ok ? 'PASS' : 'FAIL');
  console.log('');
  if (!ok) failed++;
}

process.exit(failed > 0 ? 1 : 0);
