/**
 * Writes the seven pathway diagrams from src/data/program.ts.
 * Dates and rule names are read from that file. They are not typed again here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { extraSpecs } from './pathway-diagram-extras.mjs';

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

function readBool(name) {
  const match = source.match(new RegExp(`export const ${name} = (true|false)`));
  if (!match) throw new Error(`Missing boolean ${name} in src/data/program.ts`);
  return match[1] === 'true';
}

const month = readConst('VISA_BULLETIN_LATEST_MONTH');
const setAsidesCurrent = readBool('EB5_SET_ASIDES_CURRENT');
if (!setAsidesCurrent) {
  throw new Error('EB5_SET_ASIDES_CURRENT is false, so the queue diagram cannot say current');
}
const setAsideWord = 'current';
const indiaDate = formatProgramDate(readConst('EB5_UNRESERVED_FAD_INDIA'));
const chinaDate = formatProgramDate(readConst('EB5_UNRESERVED_FAD_CHINA'));
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

function flowSvg(title, steps, desc, svgTitle) {
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
  return wrapSvg(width, height, svgTitle || title, parts.join('\n'), desc, title);
}

function queueSvg(country, finalActionDate, desc) {
  const width = 1200;
  const height = 420;
  const cardY = 120;
  const cardW = 520;
  const cardH = 200;
  const left = 56;
  const right = width - 56 - cardW;
  const cards = [
    {
      x: left,
      lines: [
        'Set-aside (rural, high unemployment,',
        `infrastructure): ${setAsideWord}`,
        `${month} Visa Bulletin`,
      ],
    },
    {
      x: right,
      lines: [
        'Unreserved: final action date',
        finalActionDate,
        `${month} Visa Bulletin`,
      ],
    },
  ];
  const parts = cards.map((card) => {
    const lineSvg = card.lines
      .map((line, index) => {
        const y = cardY + 62 + index * 40;
        const family = index === 1 ? DISPLAY : SANS;
        const size = index === 1 ? 26 : 16;
        return `<text x="${card.x + cardW / 2}" y="${y}" text-anchor="middle" font-family="${family}" font-size="${size}" fill="${INK}">${esc(line)}</text>`;
      })
      .join('\n');
    return [
      `<rect x="${card.x}" y="${cardY}" width="${cardW}" height="${cardH}" fill="${CARD}" stroke="${INK}" stroke-width="1.5"/>`,
      lineSvg,
    ].join('\n');
  });
  parts.push(
    `<text x="${width / 2}" y="390" text-anchor="middle" font-family="${SANS}" font-size="15" fill="${INK}">A final action date is not a processing time.</text>`,
  );
  return wrapSvg(width, height, `EB-5 visa lines, ${country}`, parts.join('\n'), desc);
}

function wrapSvg(width, height, title, body, desc, heading) {
  const visible = heading || title;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <title>${esc(title)}</title>
  <desc>${esc(desc || title)}</desc>
  <rect width="100%" height="100%" fill="${PAPER}"/>
  <text x="36" y="64" font-family="${DISPLAY}" font-size="28" fill="${INK}">${esc(visible)}</text>
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
    alt: 'Diagram of graduation, OPT, STEM OPT, an I-526E filing, and work authorization for an Indian student.',
    caption:
      'The diagram shows graduation, OPT, STEM OPT, an I-526E filing, and work authorization for an Indian student.',
    svg: flowSvg(
      'F-1 to EB-5 timeline',
      [
        { lines: ['Graduation'] },
        { lines: ['OPT'] },
        { lines: ['STEM OPT'] },
        { lines: ['I-526E'] },
        { lines: ['Work', 'authorization'] },
      ],
      'Diagram of graduation, OPT, STEM OPT, an I-526E filing, and work authorization for an Indian student.',
    ),
  },
  {
    id: 'f1-eb5-timeline-china',
    file: 'f1-eb5-timeline-china.svg',
    width: 1200,
    height: 360,
    alt: 'Diagram of graduation, OPT, STEM OPT, an I-526E filing, and work authorization for a Chinese student.',
    caption:
      'The diagram shows graduation, OPT, STEM OPT, an I-526E filing, and work authorization for a Chinese student.',
    svg: flowSvg(
      'F-1 to EB-5 timeline',
      [
        { lines: ['Graduation'] },
        { lines: ['OPT'] },
        { lines: ['STEM OPT'] },
        { lines: ['I-526E'] },
        { lines: ['Work', 'authorization'] },
      ],
      'Diagram of graduation, OPT, STEM OPT, an I-526E filing, and work authorization for a Chinese student.',
    ),
  },
  {
    id: 'gift-funds-india',
    file: 'gift-funds-india.svg',
    width: 1200,
    height: 360,
    alt: `Diagram of a parent gift moving through gift documents and the ${indiaRule} to the student.`,
    caption: `The diagram shows a parent gift moving through gift documents and the ${indiaRule} to an Indian student.`,
    svg: flowSvg(
      'How a parent gift reaches the student',
      [
        { lines: ['Parent'] },
        { lines: ['Gift', 'documents'] },
        { lines: indiaRule.split(' ') },
        { lines: ['Student'] },
      ],
      `Diagram of a parent gift moving through gift documents and the ${indiaRule} to the student.`,
    ),
  },
  {
    id: 'gift-funds-china',
    file: 'gift-funds-china.svg',
    width: 1200,
    height: 360,
    alt: `Diagram of a parent gift moving through gift documents and the ${chinaRule} to the student.`,
    caption: `The diagram shows a parent gift moving through gift documents and the ${chinaRule} to a Chinese student.`,
    svg: flowSvg(
      'How a parent gift reaches the student',
      [
        { lines: ['Parent'] },
        { lines: ['Gift', 'documents'] },
        { lines: chinaRule.split(' ') },
        { lines: ['Student'] },
      ],
      `Diagram of a parent gift moving through gift documents and the ${chinaRule} to the student.`,
    ),
  },
  {
    id: 'visa-lines-india',
    file: 'visa-lines-india.svg',
    width: 1200,
    height: 420,
    alt: `Diagram comparing the EB-5 set-aside line, marked ${setAsideWord}, with the unreserved final action date for India.`,
    caption: `The diagram compares the set-aside line, marked ${setAsideWord} in the ${month} Visa Bulletin, with the unreserved final action date for India of ${indiaDate}.`,
    svg: queueSvg(
      'India',
      indiaDate,
      `Diagram comparing the EB-5 set-aside line, marked ${setAsideWord}, with the unreserved final action date for India.`,
    ),
  },
  {
    id: 'visa-lines-china',
    file: 'visa-lines-china.svg',
    width: 1200,
    height: 420,
    alt: `Diagram comparing the EB-5 set-aside line, marked ${setAsideWord}, with the unreserved final action date for China.`,
    caption: `The diagram compares the set-aside line, marked ${setAsideWord} in the ${month} Visa Bulletin, with the unreserved final action date for China of ${chinaDate}.`,
    svg: queueSvg(
      'China',
      chinaDate,
      `Diagram comparing the EB-5 set-aside line, marked ${setAsideWord}, with the unreserved final action date for China.`,
    ),
  },
  {
    id: 'h1b-eb5-status-india',
    file: 'h1b-eb5-status-india.svg',
    width: 1200,
    height: 360,
    alt: 'Diagram of an H-1B holder filing a separate I-526E petition and then a green card.',
    caption: 'The diagram shows an Indian H-1B holder filing a separate I-526E petition and then a green card.',
    svg: flowSvg(
      'H-1B and a separate EB-5 petition',
      [{ lines: ['H-1B'] }, { lines: ['I-526E'] }, { lines: ['Green card'] }],
      'Diagram of an H-1B holder filing a separate I-526E petition and then a green card.',
    ),
  },
];

function comparisonSvg(heading, columns, alt) {
  const width = 1200;
  const pad = 36;
  const gap = 24;
  const cardW = Math.floor((width - pad * 2 - gap * (columns.length - 1)) / columns.length);
  const cardH = 220;
  const cardY = 112;
  const parts = [];
  columns.forEach((column, index) => {
    const x = pad + index * (cardW + gap);
    const lines = [column.heading, ...column.lines];
    const lineSvg = lines
      .map((line, lineIndex) => {
        const y = cardY + (lineIndex === 0 ? 48 : 96 + (lineIndex - 1) * 34);
        const family = lineIndex === 0 ? DISPLAY : SANS;
        const size = lineIndex === 0 ? 22 : 16;
        return `<text x="${x + cardW / 2}" y="${y}" text-anchor="middle" font-family="${family}" font-size="${size}" fill="${INK}">${esc(line)}</text>`;
      })
      .join('\n');
    parts.push(
      `<rect x="${x}" y="${cardY}" width="${cardW}" height="${cardH}" fill="${CARD}" stroke="${INK}" stroke-width="1.5"/>`,
      lineSvg,
    );
  });
  const height = cardY + cardH + 40;
  return { svg: wrapSvg(width, height, alt, parts.join('\n'), alt, heading), width, height };
}

function checklistSvg(heading, steps, alt) {
  const width = 1200;
  const rowH = 64;
  const top = 108;
  const height = top + steps.length * rowH + 28;
  const parts = steps.map((step, index) => {
    const y = top + index * rowH;
    return [
      `<rect x="36" y="${y}" width="1128" height="52" fill="${CARD}" stroke="${INK}" stroke-width="1.5"/>`,
      `<text x="60" y="${y + 33}" font-family="${SANS}" font-size="18" fill="${INK}">${esc(step)}</text>`,
    ].join('\n');
  });
  return { svg: wrapSvg(width, height, alt, parts.join('\n'), alt, heading), width, height };
}

function builtDiagram(spec) {
  if (spec.kind === 'flow') {
    return {
      ...spec,
      width: 1200,
      height: 360,
      svg: flowSvg(spec.heading, spec.steps, spec.alt, spec.alt),
    };
  }
  if (spec.kind === 'comparison') {
    const drawn = comparisonSvg(spec.heading, spec.columns, spec.alt);
    return { ...spec, ...drawn };
  }
  if (spec.kind === 'checklist') {
    const drawn = checklistSvg(spec.heading, spec.steps, spec.alt);
    return { ...spec, ...drawn };
  }
  throw new Error(`Unknown diagram kind ${spec.kind}`);
}

const allDiagrams = diagrams.concat(extraSpecs.map(builtDiagram));

const manifest = {};
for (const diagram of allDiagrams) {
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
console.log(`Wrote ${allDiagrams.length} diagrams and ${manifestPath}`);
