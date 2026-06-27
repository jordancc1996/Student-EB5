import fs from 'node:fs';

const ref = fs.readFileSync(
  'C:/Users/jorda/OneDrive/Documents/Projects/student-visa-launchpad-REFERENCE/src/pages/NewsArticle.tsx',
  'utf8'
);

function extract(sliceStart) {
  const section = ref.slice(sliceStart);
  const proseStart = '<div className="prose prose-lg max-w-[880px] mx-auto article-content">';
  const proseEnd = '            </div>\n\n            <Card className="mt-12 p-8 border-border bg-card">';
  const start = section.indexOf(proseStart);
  const end = section.indexOf(proseEnd, start);
  return section
    .slice(start + proseStart.length, end)
    .replace(/<Link to="([^"]+)">/g, '<a href="$1">')
    .replace(/<\/Link>/g, '</a>')
    .replace(/\r\n/g, '\n')
    .trim();
}

const files = [
  ['Eb5LandscapeMay2026Content.tsx', 0, 'src/components/news/Eb5LandscapeMay2026Content.tsx'],
  [
    'UscisAdjustmentMemoContent.tsx',
    ref.indexOf('const AdjustmentOfStatusMemoArticle'),
    'src/components/news/UscisAdjustmentMemoContent.tsx',
  ],
  [
    'JulyBulletinQ3Content.tsx',
    ref.indexOf('const JulyBulletinQ3Article'),
    'src/components/news/JulyBulletinQ3Content.tsx',
  ],
];

for (const [name, start, path] of files) {
  const expected = extract(start);
  const actualFile = fs.readFileSync(path, 'utf8');
  const match = actualFile.match(/<NewsArticleShell article=\{article\}>([\s\S]*)  <\/NewsArticleShell>/);
  const body = (match ? match[1] : '').trim();
  console.log(`${name}: verbatim match=${body === expected}`);
  if (body !== expected) {
    console.log(`  expected len=${expected.length} actual len=${body.length}`);
  }
}
