import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const MODE = process.argv[3] ?? 'dev';
const PATH = '/pathways/h1b-60-day-clock';

const EXPECTED_BLOG_SLUGS = [
  'h1b-tech-layoffs-eb5-entrepreneurship',
  'eb5-lifeline-h1b-workers',
  '5-reasons-switch-h1b-to-eb5',
];

function hydrationIssues(errors) {
  return errors.filter(
    (e) =>
      /hydrat/i.test(e) ||
      /mismatch/i.test(e) ||
      /did not match/i.test(e) ||
      /Recoverable/i.test(e) ||
      /astro-island/i.test(e)
  );
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const consoleErrors = [];
const pageErrors = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(String(err)));

const results = {};

// Step 2: islands
await page.goto(`${BASE}${PATH}`, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);

const islands = [];
const islandCount = await page.locator('astro-island').count();
for (let i = 0; i < islandCount; i++) {
  const el = page.locator('astro-island').nth(i);
  const client = (await el.getAttribute('client')) ?? '(none)';
  const url = (await el.getAttribute('component-url')) ?? '';
  const name = url.split('/').pop()?.replace(/\.tsx$/, '').replace(/\.js$/, '') ?? `island-${i}`;
  islands.push({ name, client });
}

const hasHeader = islands.some((i) => i.name.toLowerCase().includes('header'));
results.step2 = {
  mode: MODE,
  islands,
  hasHeader,
  expectedIslands: {
    H1B60DayClockInteractive: islands.some((i) => i.name.includes('H1B60DayClockInteractive') && i.client === 'load'),
    ConsultationCTA: islands.some((i) => i.name.includes('ConsultationCTA') && i.client === 'visible'),
    Toaster: islands.some((i) => i.name.includes('toaster') && i.client === 'load'),
  },
  consoleErrors,
  pageErrors,
  hydrationIssues: hydrationIssues([...consoleErrors, ...pageErrors]),
  pass:
    !hasHeader &&
    islands.some((i) => i.name.includes('H1B60DayClockInteractive')) &&
    islands.some((i) => i.name.includes('ConsultationCTA')) &&
    islands.some((i) => i.name.includes('toaster')) &&
    hydrationIssues([...consoleErrors, ...pageErrors]).length === 0,
};

// Step 3: open modal via guide button
await page.locator('#guide-download-trigger').click();
await page.getByRole('heading', { name: 'Download the EB-5 Guide' }).waitFor({ state: 'visible', timeout: 10000 });
const modalVisible = true;
results.step3 = { modalVisible, pass: modalVisible };

// Step 4: form submit + formcarry + pdf
let formcarryStatus = 0;
let pdfRequested = false;
page.on('response', (resp) => {
  if (resp.url().includes('formcarry.com')) formcarryStatus = resp.status();
  if (resp.url().includes('StudentEB5_H1B_Guide_2026.pdf')) pdfRequested = true;
});

const modalForm = page.locator('form').filter({ has: page.getByPlaceholder('Occupation (e.g., Software Engineer)') });
await modalForm.getByPlaceholder('Full name').fill('Test User');
await modalForm.getByPlaceholder('Personal email').fill('test.user@company.com');
await modalForm.getByPlaceholder('Occupation (e.g., Software Engineer)').fill('Software Engineer');
const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
await modalForm.getByRole('button', { name: 'Get the Guide' }).click();
const download = await downloadPromise;
await page.waitForTimeout(2000);
results.step4 = {
  formcarryStatus,
  pdfDownloadTriggered: !!download || pdfRequested,
  downloadFilename: download ? download.suggestedFilename() : null,
  pass: formcarryStatus >= 200 && formcarryStatus < 300 && (!!download || pdfRequested),
};

// Step 5: success auto-close + scroll (wait for success message then 3s)
const successVisible = (await page.getByText('Your Guide Is Downloading!').count()) > 0;
await page.waitForTimeout(3500);
const modalClosed = (await page.getByRole('heading', { name: 'Download the EB-5 Guide' }).count()) === 0;
const consultationInView = await page.evaluate(() => {
  const el = document.getElementById('consultation-form');
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.top < window.innerHeight;
});
results.step5 = { successVisible, modalClosed, consultationInView, pass: successVisible && modalClosed };

// Step 6: exit intent - reload fresh, scroll down first, mouse leave document top
await page.goto(`${BASE}${PATH}`, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(800);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
await page.waitForTimeout(400);
await page.evaluate(() => {
  document.dispatchEvent(new MouseEvent('mouseleave', { clientY: 10, bubbles: false }));
});
await page.waitForTimeout(800);
const exitModalOpen = (await page.getByRole('heading', { name: 'Download the EB-5 Guide' }).count()) > 0;
results.step6 = { exitModalOpen, pass: exitModalOpen };

// Step 7: scroll to consultation via hero link
await page.goto(`${BASE}${PATH}`, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(500);
await page.locator('#consultation-form').waitFor({ state: 'attached', timeout: 15000 });
await page.getByRole('link', { name: 'Get Your Free Evaluation' }).click();
await page.waitForTimeout(2000);
const heroScrollToForm = await page.evaluate(() => {
  const el = document.getElementById('consultation-form');
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.top >= -80 && rect.top < window.innerHeight * 0.6;
});
results.step7 = { heroScrollToForm, pass: heroScrollToForm };

// Step 8: blog cards
const blogLinks = await page.locator('section:has(h2:text("Relevant Blog Articles")) a[href^="/research/"]').all();
const blogHrefs = [];
for (const link of blogLinks) {
  blogHrefs.push((await link.getAttribute('href')) ?? '');
}
results.step8 = {
  count: blogHrefs.length,
  hrefs: blogHrefs,
  slugs: blogHrefs.map((h) => h.replace('/research/', '')),
  pass: blogHrefs.length === 3 && EXPECTED_BLOG_SLUGS.every((s, i) => blogHrefs[i]?.includes(s)),
};

await browser.close();

console.log(JSON.stringify(results, null, 2));
