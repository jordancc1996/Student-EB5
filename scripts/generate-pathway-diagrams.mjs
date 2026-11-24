/**
 * Writes the seven pathway diagrams from src/data/program.ts.
 * Dates and rule names are read from that file. They are not typed again here.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const programPath = path.join(root, 'src/data/program.ts');
const source = fs.readFileSync(programPath, 'utf8');

function readConst(name) {
  const match = source.match(new RegExp(`export const ${name} = '([^']*)'`));
  if (!match) throw new Error(`Missing constant ${name} in src/data/program.ts`);
  return match[1];
}

function formatProgramDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const month = readConst('VISA_BULLETIN_LATEST_MONTH');
const setAside = readConst('EB5_SET_ASIDE_FINAL_ACTION');
const indiaDate = formatProgramDate(readConst('EB5_UNRESERVED_FINAL_ACTION_INDIA'));
const chinaDate = formatProgramDate(readConst('EB5_UNRESERVED_FINAL_ACTION_CHINA'));
const indiaRule = readConst('INDIA_REMITTANCE_RULE');
const chinaRule = readConst('CHINA_REMITTANCE_RULE');

const outDir = path.join(root, 'public/images/pathways');
fs.mkdirSync(outDir, { recursive: true });

const INK = '#262626';
const PAPER = '#FAF9F6';
const CARD = '#FFFFFF';
const DISPLAY = "Georgia, 'Palatino Linotype', Palatino, serif";
const SANS = "'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, sans-serif";

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function flowSvg(title, steps) {
  const width = 1200;
  const height = 360;
  const pad = 36;
  const gap = 22;
  const boxW = Math.floor((width - pad * 2 - gap * (steps.length - 1)) / steps.length);
  const boxH = 132;
  const boxY = 128;
  const parts = [];
  steps.forEach((step, index) => {
    const x = pad + index * (boxW + gap);
    parts.push(
      `<rect x="${x}" y="${boxY}" width="${boxW}" height="${boxH}" fill="${CARD}" stroke="${INK}" stroke-width="1.5"/>`,
    );
    const lines = step.lines;
    const startY = boxY + boxH / 2 - ((lines.length - 1) * 22) / 2 + 6;
    const tspans = lines
      .map((line, lineIndex) => {
        const dy = lineIndex === 0 ? 0 : 22;
        return `<tspan x="${x + boxW / 2}" dy="${dy}">${esc(line)}</tspan>`;
      })
      .join('');
    parts.push(
      `<text x="${x + boxW / 2}" y="${startY}" text-anchor="middle" font-family="${SANS}" font-size="16" fill="${INK}">${tspans}</text>`,
    );
    if (index < steps.length - 1) {
      const x1 = x + boxW + 2;
      const x2 = x + boxW + gap - 2;
      const y = boxY + boxH / 2;
      parts.push(
        `<line x1="${x1}" y1="${y}" x2="${x2 - 7}" y2="${y}" stroke="${INK}" stroke-width="1.5"/>`,
        `<polygon points="${x2 - 8},${y - 4} ${x2},${y} ${x2 - 8},${y + 4}" fill="${INK}"/>`,
      );
    }
  });
  return wrapSvg(width, height, title, parts.join('\n'));
}

function queueSvg(country, finalActionDate) {
  const width = 1200;
  const height = 420;
  const cardY = 120;
  const cardW = 520;
  const cardH = 200;
  const left = 56;
  const right = width - 56 - cardW;
  const cards = [
    { x: left, label: 'Set-aside final action', value: setAside, note: 'Rural, high-unemployment, and infrastructure' },
    { x: right, label: 'Unreserved final action', value: finalActionDate, note: country },
  ];
  const parts = cards.map((card) => {
    return [
      `<rect x="${card.x}" y="${cardY}" width="${cardW}" height="${cardH}" fill="${CARD}" stroke="${INK}" stroke-width="1.5"/>`,
      `<text x="${card.x + cardW / 2}" y="${cardY + 58}" text-anchor="middle" font-family="${SANS}" font-size="16" fill="${INK}">${esc(card.label)}</text>`,
      `<text x="${card.x + cardW / 2}" y="${cardY + 112}" text-anchor="middle" font-family="${DISPLAY}" font-size="32" fill="${INK}">${esc(card.value)}</text>`,
      `<text x="${card.x + cardW / 2}" y="${cardY + 156}" text-anchor="middle" font-family="${SANS}" font-size="15" fill="${INK}">${esc(card.note)}</text>`,
    ].join('\n');
  });
  parts.push(
    `<text x="${width / 2}" y="370" text-anchor="middle" font-family="${SANS}" font-size="15" fill="${INK}">${esc(month)} Visa Bulletin</text>`,
  );
  return wrapSvg(width, height, `EB-5 visa lines, ${country}`, parts.join('\n'));
}

function wrapSvg(width, height, title, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <title>${esc(title)}</title>
  <rect width="100%" height="100%" fill="${PAPER}"/>
  <text x="36" y="64" font-family="${DISPLAY}" font-size="28" fill="${INK}">${esc(title)}</text>
  ${body}
</svg>
`;
}

const diagrams = [
  {
    id: 'f1-eb5-timeline-india',
    file: 'f1-eb5-timeline-india.svg',
    width: 1200,
    height: 360,
    alt: 'Diagram of graduation, OPT, STEM OPT, a combined I-526E and I-485 filing, and an employment authorization document for an Indian student.',
    caption:
      'The diagram shows graduation, OPT, STEM OPT, a combined I-526E and I-485 filing, and an employment authorization document.',
    svg: flowSvg('F-1 to EB-5 timeline', [
      { lines: ['Graduation'] },
      { lines: ['OPT'] },
      { lines: ['STEM OPT'] },
      { lines: ['I-526E', 'and I-485'] },
      { lines: ['EAD'] },
    ]),
  },
  {
    id: 'f1-eb5-timeline-china',
    file: 'f1-eb5-timeline-china.svg',
    width: 1200,
    height: 360,
    alt: 'Diagram of graduation, OPT, STEM OPT, a combined I-526E and I-485 filing, and an employment authorization document for a Chinese student.',
    caption:
      'The diagram shows graduation, OPT, STEM OPT, a combined I-526E and I-485 filing, and an employment authorization document.',
    svg: flowSvg('F-1 to EB-5 timeline', [
      { lines: ['Graduation'] },
      { lines: ['OPT'] },
      { lines: ['STEM OPT'] },
      { lines: ['I-526E', 'and I-485'] },
      { lines: ['EAD'] },
    ]),
  },
  {
    id: 'gift-funds-india',
    file: 'gift-funds-india.svg',
    width: 1200,
    height: 360,
    alt: `Diagram of a parent gift moving through gift documents, the ${indiaRule}, the student, escrow, and the project.`,
    caption: `The diagram shows a parent gift moving through gift documents and the ${indiaRule} to the student, escrow, and the project.`,
    svg: flowSvg('How a parent gift reaches the project', [
      { lines: ['Parent'] },
      { lines: ['Gift', 'documents'] },
      { lines: indiaRule.split(' ') },
      { lines: ['Student'] },
      { lines: ['Escrow'] },
      { lines: ['Project'] },
    ]),
  },
  {
    id: 'gift-funds-china',
    file: 'gift-funds-china.svg',
    width: 1200,
    height: 360,
    alt: `Diagram of a parent gift moving through gift documents, the ${chinaRule}, the student, escrow, and the project.`,
    caption: `The diagram shows a parent gift moving through gift documents and the ${chinaRule} to the student, escrow, and the project.`,
    svg: flowSvg('How a parent gift reaches the project', [
      { lines: ['Parent'] },
      { lines: ['Gift', 'documents'] },
      { lines: chinaRule.split(' ') },
      { lines: ['Student'] },
      { lines: ['Escrow'] },
      { lines: ['Project'] },
    ]),
  },
  {
    id: 'visa-lines-india',
    file: 'visa-lines-india.svg',
    width: 1200,
    height: 420,
    alt: 'Diagram comparing the EB-5 set-aside final action with the unreserved final action date for India.',
    caption: `The diagram compares the set-aside final action, marked ${setAside} in the ${month} Visa Bulletin, with the unreserved final action date for India of ${indiaDate}.`,
    svg: queueSvg('India', indiaDate),
  },
  {
    id: 'visa-lines-china',
    file: 'visa-lines-china.svg',
    width: 1200,
    height: 420,
    alt: 'Diagram comparing the EB-5 set-aside final action with the unreserved final action date for China.',
    caption: `The diagram compares the set-aside final action, marked ${setAside} in the ${month} Visa Bulletin, with the unreserved final action date for China of ${chinaDate}.`,
    svg: queueSvg('China', chinaDate),
  },
  {
    id: 'h1b-eb5-status-india',
    file: 'h1b-eb5-status-india.svg',
    width: 1200,
    height: 360,
    alt: 'Diagram of an H-1B holder filing I-526E and I-485, then an employment authorization document and advance parole, then a green card.',
    caption:
      'The diagram shows an H-1B holder filing I-526E and I-485 together, then an employment authorization document and advance parole, then a green card.',
    svg: flowSvg('H-1B to EB-5 while keeping status', [
      { lines: ['H-1B'] },
      { lines: ['I-526E', 'and I-485'] },
      { lines: ['EAD and', 'advance parole'] },
      { lines: ['Green card'] },
    ]),
  },
];

const manifest = {};
for (const diagram of diagrams) {
  fs.writeFileSync(path.join(outDir, diagram.file), diagram.svg);
  manifest[diagram.id] = {
    src: `/images/pathways/${diagram.file}`,
    width: diagram.width,
    height: diagram.height,
    alt: diagram.alt,
    caption: diagram.caption,
  };
}

const manifestPath = path.join(root, 'src/data/pathwayDiagrams.json');
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${diagrams.length} diagrams and ${manifestPath}`);
