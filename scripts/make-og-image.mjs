/**
 * Generate public/og-image.jpg (1200×630) from the homepage clock-tower photograph.
 *
 * Usage: node scripts/make-og-image.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { configurePlaywrightBrowsersPath, launchChromium } from './lib/playwright-env.mjs';

configurePlaywrightBrowsersPath();

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = path.join(ROOT, 'scripts', 'og-image', 'template.html');
const BACKGROUND = path.join(ROOT, 'src', 'assets', 'clock-tower.jpg');
const OUT = path.join(ROOT, 'public', 'og-image.jpg');
const MAX_BYTES = 300 * 1024;

if (!fs.existsSync(BACKGROUND)) {
  console.error(`Missing background photo: ${BACKGROUND}`);
  process.exit(1);
}

const ext = path.extname(BACKGROUND).toLowerCase();
const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
const backgroundDataUrl = `data:${mime};base64,${fs.readFileSync(BACKGROUND).toString('base64')}`;
const playfairDataUrl = `data:font/woff2;base64,${fs.readFileSync(path.join(ROOT, 'public', 'fonts', 'playfair-display-latin-400-normal.woff2')).toString('base64')}`;
const robotoDataUrl = `data:font/woff2;base64,${fs.readFileSync(path.join(ROOT, 'public', 'fonts', 'roboto-latin-400-normal.woff2')).toString('base64')}`;
const html = fs
  .readFileSync(TEMPLATE, 'utf8')
  .replace('__BACKGROUND_SRC__', backgroundDataUrl)
  .replace('__PLAYFAIR_SRC__', playfairDataUrl)
  .replace('__ROBOTO_SRC__', robotoDataUrl);

const browser = await launchChromium();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  if (document.fonts?.ready) await document.fonts.ready;
  await Promise.all(
    [...document.images].map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve, reject) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', reject, { once: true });
          }),
    ),
  );
});
await new Promise((resolve) => setTimeout(resolve, 150));

let quality = 82;
let buffer;
for (; quality >= 55; quality -= 4) {
  buffer = await page.screenshot({ type: 'jpeg', quality });
  if (buffer.byteLength <= MAX_BYTES) break;
}
await browser.close();

if (!buffer) {
  console.error('Screenshot failed');
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buffer);

const kb = (buffer.byteLength / 1024).toFixed(1);
if (buffer.byteLength > MAX_BYTES) {
  console.error(`FAIL: ${OUT} is ${kb}KB (limit 300KB)`);
  process.exit(1);
}

console.log(`Wrote ${OUT} (${kb}KB, jpeg quality ${quality}, 1200×630)`);
