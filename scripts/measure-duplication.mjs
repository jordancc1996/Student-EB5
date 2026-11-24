/**
 * Sentence overlap for built pathway pages.
 *
 * Method (matches the country-page audit):
 * - Read dist/pathways/<slug>/index.html
 * - Take the <main> element
 * - Drop script and style, strip tags, decode entities, collapse whitespace
 * - Split on . ! or ? that is followed by whitespace (so "U.S." and "vs." end a sentence)
 * - Keep unique sentences of 8 or more words
 * - Pairwise percent is the share of the first page's sentences that also appear on the second
 * - "Any other" is the share that appears on at least one other dist/pathways page
 *
 * Run from the repo root after a production build: node scripts/measure-duplication.mjs
 * Add --detail to print each shared sentence and how many other pathway pages contain it.
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist/pathways');

const focus = [
  'eb5-for-indian-families',
  'eb5-for-chinese-families',
  'eb5-for-indian-students',
  'eb5-for-chinese-students',
  'eb5-for-indian-investors',
  'eb5-for-chinese-investors',
  'eb5-for-indian-h1b',
];

const pairs = [
  ['eb5-for-indian-families', 'eb5-for-chinese-families'],
  ['eb5-for-indian-students', 'eb5-for-chinese-students'],
  ['eb5-for-indian-investors', 'eb5-for-chinese-investors'],
];

function decode(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function sentencesFromHtml(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!main) return [];
  const body = decode(
    main[1]
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ').trim();
  const sentences = [];
  for (const part of body.split(/(?<=[.!?])\s+/)) {
    const sentence = part.replace(/\s+/g, ' ').trim().replace(/[.!?]+$/g, '').trim();
    const words = sentence.split(/\s+/).filter(Boolean);
    if (words.length >= 8) sentences.push(sentence);
  }
  return [...new Set(sentences)];
}

function wordsInMain(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!main) return 0;
  const body = decode(
    main[1]
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ').trim();
  return body.split(/\s+/).filter(Boolean).length;
}

function load(slug) {
  return fs.readFileSync(path.join(dist, slug, 'index.html'), 'utf8');
}

const pages = fs
  .readdirSync(dist, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(dist, entry.name, 'index.html')))
  .map((entry) => entry.name);

const bySlug = new Map(pages.map((slug) => [slug, sentencesFromHtml(load(slug))]));

function overlap(left, right) {
  const b = new Set(right);
  return left.filter((sentence) => b.has(sentence));
}

function pct(hit, total) {
  return total ? Math.round((hit / total) * 100) : 0;
}

console.log('Pairwise share (share of the first page\'s 8+ word <main> sentences that also appear on the second)');
const pairLabel = {
  'eb5-for-indian-families': 'Indian families',
  'eb5-for-chinese-families': 'Chinese families',
  'eb5-for-indian-students': 'Indian students',
  'eb5-for-chinese-students': 'Chinese students',
  'eb5-for-indian-investors': 'Indian investors',
  'eb5-for-chinese-investors': 'Chinese investors',
};
for (const [left, right] of pairs) {
  const shared = overlap(bySlug.get(left), bySlug.get(right));
  console.log(
    `${pairLabel[left]} vs ${pairLabel[right]}: ${pct(shared.length, bySlug.get(left).length)}% (${shared.length}/${bySlug.get(left).length})`,
  );
}

console.log('');
console.log('Share of each page\'s sentences that appear on any other pathway page');
for (const slug of focus) {
  const mine = bySlug.get(slug);
  const others = new Set();
  for (const [other, sentences] of bySlug) {
    if (other === slug) continue;
    for (const sentence of sentences) others.add(sentence);
  }
  const hit = mine.filter((sentence) => others.has(sentence)).length;
  console.log(
    `${slug}: ${pct(hit, mine.length)}% (${hit}/${mine.length}), words in main: ${wordsInMain(load(slug))}`,
  );
}

if (process.argv.includes('--detail')) {
  console.log('\n--- shared sentences ---');
  for (const slug of focus) {
    const mine = bySlug.get(slug);
    console.log(`\n## ${slug} (${mine.length})`);
    mine.forEach((sentence, index) => {
      const homes = [];
      for (const [other, sentences] of bySlug) {
        if (other !== slug && sentences.includes(sentence)) homes.push(other);
      }
      if (homes.length) {
        console.log(`${index + 1}. [${homes.length}] ${sentence}`);
      }
    });
  }
}
