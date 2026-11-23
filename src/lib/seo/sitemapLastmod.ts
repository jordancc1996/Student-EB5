import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function walk(dir: string, extension: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full, extension));
    else if (entry.name.endsWith(extension)) files.push(full);
  }
  return files;
}

function readSlug(file: string): string | null {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^slug:\s*["']?([^"'\r\n]+)["']?/m);
  return match?.[1]?.trim() ?? null;
}

/** Newest author date (YYYY-MM-DD) for each current path. Null when history is missing or shallow. */
function gitDates(): Map<string, string> | null {
  try {
    const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    if (shallow === 'true') return null;
    const log = execFileSync('git', ['log', '--format=%as', '--name-only'], {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
    const dates = new Map<string, string>();
    let date = '';
    for (const line of log.split(/\r?\n/)) {
      if (!line) continue;
      if (/^\d{4}-\d{2}-\d{2}$/.test(line)) {
        date = line;
        continue;
      }
      const file = line.trim().replace(/\\/g, '/');
      if (date && !dates.has(file)) dates.set(file, date);
    }
    return dates;
  } catch {
    return null;
  }
}

function pageSources(): Map<string, string> {
  const sources = new Map<string, string>();
  const pagesDir = path.join(ROOT, 'src/pages');
  for (const file of walk(pagesDir, '.astro')) {
    const rel = path.relative(pagesDir, file).replace(/\\/g, '/');
    if (rel.includes('[')) continue;
    let url = `/${rel.replace(/index\.astro$/, '').replace(/\.astro$/, '')}`;
    url = url.replace(/\/$/, '') || '/';
    sources.set(url, path.relative(ROOT, file).replace(/\\/g, '/'));
  }
  for (const file of walk(path.join(ROOT, 'src/content/blog'), '.md')) {
    const slug = readSlug(file);
    if (!slug) continue;
    sources.set(`/research/${slug}`, path.relative(ROOT, file).replace(/\\/g, '/'));
  }
  for (const file of walk(path.join(ROOT, 'src/content/faq'), '.md')) {
    const slug = readSlug(file);
    if (!slug) continue;
    sources.set(`/faq/${slug}`, path.relative(ROOT, file).replace(/\\/g, '/'));
  }
  const newsFile = 'src/data/newsArticles.ts';
  const newsText = fs.readFileSync(path.join(ROOT, newsFile), 'utf8');
  for (const match of newsText.matchAll(/slug:\s*'([^']+)'/g)) {
    sources.set(`/news/${match[1]}`, newsFile);
  }
  return sources;
}

let cached: Map<string, string> | null | undefined;

/** URL path to YYYY-MM-DD. Empty map when git history cannot be trusted. */
export function lastmodByPath(): Map<string, string> {
  if (cached !== undefined && cached !== null) return cached;
  const dates = gitDates();
  if (!dates) {
    cached = new Map();
    return cached;
  }
  const out = new Map<string, string>();
  for (const [url, file] of pageSources()) {
    const date = dates.get(file);
    if (date) out.set(url, date);
  }
  cached = out;
  return out;
}
