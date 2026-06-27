import fs from 'fs';

const html = fs.readFileSync('dist/faq/h1b-grace-period-eb5-options/index.html', 'utf8');
const sec = html.match(/Related Questions[\s\S]*?(?=Still Have Questions|<\/main>)/)?.[0] ?? '';
const hrefs = [...sec.matchAll(/href="(?:https:\/\/[^"]+)?\/faq\/([^"]+)"/g)].map((m) => m[1]);

console.log('=== DIST FILE (built HTML, no browser) ===');
console.log('Section length:', sec.length);
console.log('/faq/ href count in section:', hrefs.length);
console.log('Slugs:', hrefs.join(' | '));
console.log('\n--- Raw section ---\n');
console.log(sec);
