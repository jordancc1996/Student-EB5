import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'src';
const EXCLUDE = ['researchPosts.ts.deprecated', 'node_modules'];

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (EXCLUDE.some((x) => p.includes(x))) continue;
    if (e.isDirectory()) walk(p, files);
    else if (/\.(astro|tsx|ts|md|mdx)$/.test(e.name)) files.push(p);
  }
  return files;
}

function routeFromFile(f) {
  const norm = f.replace(/\\/g, '/');
  if (norm.startsWith('src/pages/')) {
    let r = norm.replace('src/pages/', '').replace(/\.astro$/, '');
    if (r === 'index') return '/';
    if (r.endsWith('/index')) r = r.slice(0, -'/index'.length);
    return '/' + r;
  }
  if (norm.startsWith('src/content/blog/')) {
    const slug = norm.replace('src/content/blog/', '').replace(/\.md$/, '');
    return '/research/' + slug;
  }
  if (norm.startsWith('src/content/faq/')) {
    const slug = norm.replace('src/content/faq/', '').replace(/\.md$/, '');
    return '/faq/' + slug;
  }
  return null;
}

function sourceId(f) {
  const r = routeFromFile(f);
  return r ?? '@' + f.replace(/\\/g, '/');
}

const targets = {
  h1bPath: '/pathways/h1b-to-green-card',
  f1Path: '/pathways/f1-to-eb5-self-sponsored-green-card',
  grand: '/tools/grandfathering-countdown',
  opt: '/tools/opt-calculator',
  feas: '/tools/2026-eb5-investment-feasibility-calculator',
};

const inbound = Object.fromEntries(Object.values(targets).map((t) => [t, new Set()]));
const researchCross = {
  articlesWithOutbound: 0,
  articlesWithoutOutbound: 0,
  totalOutboundLinks: 0,
  articlesTotal: 0,
  noCrossSlugs: [],
};

const files = walk(ROOT);
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const src = sourceId(f);
  for (const t of Object.values(targets)) {
    if (text.includes(t) && src !== t) inbound[t].add(src);
  }
  if (f.replace(/\\/g, '/').startsWith('src/content/blog/')) {
    researchCross.articlesTotal++;
    const matches = text.match(/href=["']\/research\/[^"']+["']/g) ?? [];
    if (matches.length) {
      researchCross.articlesWithOutbound++;
      researchCross.totalOutboundLinks += matches.length;
    } else {
      researchCross.articlesWithoutOutbound++;
      researchCross.noCrossSlugs.push(src);
    }
  }
}

function summarizeInbound(t) {
  const sources = [...inbound[t]].sort();
  const routes = sources.filter((s) => s.startsWith('/') && !s.startsWith('@'));
  const components = sources.filter((s) => s.startsWith('@'));
  return { total: sources.length, routes: routes.length, components: components.length, routeList: routes };
}

console.log(JSON.stringify({
  inbound: Object.fromEntries(Object.values(targets).map((t) => [t, summarizeInbound(t)])),
  researchCross,
  homepage: (() => {
    const homeParts = [
      'src/pages/index.astro',
      'src/components/sections/HeroSection.astro',
      'src/components/sections/IntroSection.astro',
      'src/components/sections/PhilosophySection.astro',
      'src/components/sections/BenefitsSection.astro',
      'src/components/sections/PartnerCredibility.astro',
      'src/components/sections/CallToActionSection.astro',
      'src/components/Header.tsx',
    ];
    const text = homeParts.map((p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '')).join('\n');
    return {
      h1bPath: text.includes(targets.h1bPath),
      f1Path: text.includes(targets.f1Path),
      grand: text.includes(targets.grand),
      opt: text.includes(targets.opt),
      feas: text.includes(targets.feas),
      resourcesOrResearch: /href=["']\/(resources|research)/.test(text),
    };
  })(),
  faq: (() => {
    const faqFiles = files.filter((f) => f.replace(/\\/g, '/').startsWith('src/content/faq/'));
    let researchLinks = 0;
    let toolLinks = 0;
    let withResearch = 0;
    let withTools = 0;
    for (const f of faqFiles) {
      const t = fs.readFileSync(f, 'utf8');
      const r = (t.match(/\/research\//g) ?? []).length;
      const tl = (t.match(/\/tools\//g) ?? []).length;
      if (r) {
        withResearch++;
        researchLinks += r;
      }
      if (tl) {
        withTools++;
        toolLinks += tl;
      }
    }
    return { entries: faqFiles.length, withResearch, researchLinks, withTools, toolLinks };
  })(),
}, null, 2));
