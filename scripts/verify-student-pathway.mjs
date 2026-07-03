import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const BASE = process.env.BASE_URL || 'http://localhost:4321';
const PATH = '/pathways/f1-to-eb5-self-sponsored-green-card';
const results = [];

function pass(step, detail) {
  results.push({ step, status: 'PASS', detail });
  console.log(`✓ Step ${step}: PASS — ${detail}`);
}
function fail(step, detail) {
  results.push({ step, status: 'FAIL', detail });
  console.log(`✗ Step ${step}: FAIL — ${detail}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style');
      style.textContent = 'astro-dev-toolbar { display: none !important; pointer-events: none !important; }';
      document.head?.appendChild(style);
    });
  });

  async function closeTopModal() {
    const closeBtn = page.getByRole('button', { name: 'Close' }).first();
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click();
      await page.waitForTimeout(400);
    }
  }

  const consoleErrors = [];
  const hydrationWarnings = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') consoleErrors.push(text);
    if (/hydration|mismatch/i.test(text)) hydrationWarnings.push(text);
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  // Mock Formcarry for form submissions
  await page.route('**/formcarry.com/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ code: 200 }) });
  });

  // --- Step 2: Load page, check islands + Header ---
  await page.goto(`${BASE}${PATH}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);

  const headerVisible = await page.locator('header, nav').first().isVisible().catch(() => false);
  const headerText = await page.locator('a[aria-label="StudentEB5 Home"], a[href="/"]').first().count();
  const islands = await page.locator('astro-island').evaluateAll((els) =>
    els.map((el) => ({
      component: el.getAttribute('component-url') || el.getAttribute('component-export') || 'unknown',
      hydrate: el.getAttribute('client') || el.getAttribute('ssr') || '',
    })),
  );

  if (headerVisible || headerText > 0) {
    pass(2, `Header present (visible=${headerVisible}, home link count=${headerText}). Islands found: ${islands.length}`);
  } else {
    fail(2, 'Header not found — possible PageLayout issue');
  }

  const islandSummary = islands.map((i) => i.hydrate).join(', ');
  if (/load|visible/.test(islandSummary)) {
    pass(2, `Island hydration directives present: ${islandSummary}`);
  }

  if (consoleErrors.length === 0 && hydrationWarnings.length === 0) {
    pass(2, 'No console errors or hydration warnings on initial load');
  } else {
    fail(2, `Console errors: ${consoleErrors.join('; ') || 'none'}. Hydration: ${hydrationWarnings.join('; ') || 'none'}`);
  }

  // --- Step 3: InlineTuitionCalculator ---
  await page.locator('text=Tuition Savings Estimator').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const calcSection = page.locator('text=Tuition Savings Estimator').locator('..').locator('..');
  await calcSection.getByRole('combobox').nth(0).click();
  await page.getByRole('option', { name: 'Public (In-State)' }).click();
  await calcSection.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: '4 years' }).click();
  await page.getByRole('button', { name: 'Calculate My Savings' }).click();
  await page.waitForTimeout(500);

  const savingsText = await page.locator('text=Estimated Total Savings').locator('..').locator('p.text-3xl').first().textContent();
  const percentText = await page.locator('text=EB-5 Investment Offset').locator('..').locator('p.text-3xl').first().textContent();
  const expectedSavings = '$132,000';
  const expectedPercent = '17%';
  if (savingsText?.trim() === expectedSavings && percentText?.trim() === expectedPercent) {
    pass(3, `Savings=${savingsText}, Offset=${percentText} (public-instate × 4 years)`);
  } else {
    fail(3, `Expected ${expectedSavings}/${expectedPercent}, got ${savingsText?.trim()}/${percentText?.trim()}`);
  }

  // --- Step 4: Tuition trigger modal ---
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.locator('#student-lead-tuition-trigger').click();
  await page.waitForTimeout(400);
  const tuitionTitle = await page.locator('h2:has-text("Calculate Your Tuition Savings")').isVisible();
  if (tuitionTitle) {
    pass(4, 'StudentLeadModal opens in tuition mode with title "Calculate Your Tuition Savings"');
  } else {
    fail(4, 'Tuition modal title not visible');
  }

  // Close modal for next tests
  await closeTopModal();

  // --- Step 5: Tuition submit redirect ---
  await page.locator('#student-lead-tuition-trigger').click();
  await page.waitForTimeout(300);
  await page.locator('input[placeholder="Full name"]').fill('Test User');
  await page.locator('input[placeholder="Personal email"]').fill('test.verify@studenteb5-internal.test');
  const navPromise = page.waitForURL('**/tools/tuition-calculator**', { timeout: 10000 });
  await page.getByRole('button', { name: /Get My Results/ }).click();
  try {
    await navPromise;
    pass(5, 'Tuition modal submit navigates to /tools/tuition-calculator');
  } catch {
    fail(5, 'Did not redirect to /tools/tuition-calculator after tuition submit');
  }

  // Return to pathway page
  await page.goto(`${BASE}${PATH}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1000);

  // --- Step 6: Guide trigger modal ---
  await page.locator('#student-lead-guide-trigger').click();
  await page.waitForTimeout(400);
  const guideTitle = await page.locator('h2:has-text("Download the Student\'s EB-5 Guide")').isVisible();
  if (guideTitle) {
    pass(6, 'StudentLeadModal opens in guide mode with correct title');
  } else {
    fail(6, 'Guide modal title not visible');
  }

  // --- Step 7: Guide submit PDF + success ---
  let downloadTriggered = false;
  page.on('download', () => { downloadTriggered = true; });
  await page.locator('input[placeholder="Full name"]').fill('Guide Test');
  await page.locator('input[placeholder="Personal email"]').fill('guide.verify@studenteb5-internal.test');
  await page.getByRole('button', { name: /Download My Guide/ }).click();
  await page.waitForTimeout(1500);
  const successVisible = await page.locator('text=Your Guide Is Downloading!').isVisible();
  if (successVisible) {
    pass(7, 'Guide mode success state renders ("Your Guide Is Downloading!")');
  } else {
    fail(7, 'Guide success state not visible');
  }
  // Check PDF link was created (download may not fire in headless but href is set in code)
  const pdfExists = existsSync(join(process.cwd(), 'public', 'StudentEB5_Guide_2026.pdf'));
  if (pdfExists) {
    pass(7, `PDF asset exists at public/StudentEB5_Guide_2026.pdf (download event: ${downloadTriggered})`);
  } else {
    fail(7, 'PDF file missing from public/');
  }
  await closeTopModal();

  // --- Step 8: Eligibility modal ---
  await page.locator('#student-eligibility-trigger').scrollIntoViewIfNeeded();
  await page.locator('#student-eligibility-trigger').click();
  await page.waitForTimeout(400);
  const eligOpen = await page.locator('h2:has-text("Check Your Eligibility")').isVisible();
  const hasVisaField = await page.locator('text=Current Visa Status').count() > 0;
  const hasCountryField = await page.locator('input[placeholder*="country" i], input[placeholder*="Country" i]').count() > 0;
  if (eligOpen && hasVisaField) {
    pass(8, `StudentEligibilityModal open with eligibility fields (visa=${hasVisaField}, country=${hasCountryField})`);
  } else {
    fail(8, `Eligibility modal: open=${eligOpen}, visa field=${hasVisaField}`);
  }
  await closeTopModal();

  // --- Step 9: GiftedFundsModal ---
  await page.locator('#student-gifted-funds-trigger').scrollIntoViewIfNeeded();
  await page.locator('#student-gifted-funds-trigger').click();
  await page.waitForTimeout(500);
  const gfTitle = await page.locator('[role="dialog"]:has-text("See If Your Family Qualifies")').isVisible();
  const gfName = await page.locator('#gf-name').isVisible();
  if (gfTitle && gfName) {
    pass(9, 'GiftedFundsModal Radix Dialog open with gifted funds form (#gf-name visible)');
  } else {
    fail(9, `GiftedFundsModal: dialog=${gfTitle}, gf-name=${gfName}`);
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // --- Step 10: Sticky bar ---
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  const stickyVisible = await page.locator('.fixed.bottom-0').filter({ hasText: 'Get My Free Evaluation' }).evaluate(
    (el) => !el.classList.contains('translate-y-full'),
  );
  if (stickyVisible) {
    pass(10, 'Sticky bar visible after scroll past 600px (translate-y-0)');
  } else {
    fail(10, 'Sticky bar not visible after scroll');
  }
  await page.locator('.fixed.bottom-0 button:has-text("Get My Free Evaluation")').click();
  await page.waitForTimeout(800);
  const formInView = await page.evaluate(() => {
    const el = document.getElementById('consultation-form');
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  });
  if (formInView) {
    pass(10, 'Sticky CTA scrolls #consultation-form into view');
  } else {
    fail(10, '#consultation-form not in viewport after sticky CTA click');
  }

  // --- Step 11: Exit intent ---
  await page.evaluate(() => sessionStorage.removeItem('student-exit-intent-shown'));
  await page.goto(`${BASE}${PATH}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1000);
  await page.mouse.move(400, 5);
  await page.mouse.move(400, -5);
  await page.dispatchEvent('body', 'mouseout', { clientY: -5 });
  // Also trigger via document mouseout with clientY < 10
  await page.evaluate(() => {
    document.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, clientY: 5 }));
  });
  await page.waitForTimeout(800);
  const exitOpen = await page.locator('text=Before You Go').isVisible();
  if (exitOpen) {
    pass(11, 'StudentExitIntentPopup fired after exit intent (sessionStorage cleared)');
  } else {
    // Try direct mouse leave simulation
    await page.evaluate(() => {
      const handler = (e) => { if (e.clientY < 10) window.__exitFired = true; };
      document.addEventListener('mouseout', handler);
      document.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, clientY: 0, relatedTarget: null }));
    });
    const exitOpen2 = await page.locator('text=Before You Go').isVisible();
    if (exitOpen2) {
      pass(11, 'StudentExitIntentPopup fired on second mouseout attempt');
    } else {
      fail(11, 'Exit intent popup did not appear — may need manual browser test for mouseout edge case');
    }
  }
  if (await page.locator('text=Before You Go').isVisible()) {
    await page.getByRole('button', { name: 'Close' }).first().click();
  }

  // --- Step 12: StudentBottomForm ---
  await closeTopModal();
  await page.locator('#consultation-form').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.locator('#student-name').fill('Bottom Form Test');
  await page.locator('#student-email').fill('bottom.verify@studenteb5-internal.test');
  await page.locator('#consultation-form [aria-label="Select your visa status"]').click();
  await page.getByRole('option', { name: 'F-1' }).click();
  let formcarryHit = false;
  page.on('request', (req) => {
    if (req.url().includes('formcarry.com') && req.method() === 'POST') formcarryHit = true;
  });
  await page.locator('#consultation-form button[type="submit"]').click();
  await page.waitForTimeout(2000);
  const thankYou = await page.locator('#consultation-form').getByText('Thank You').isVisible();
  const toastVisible = await page.locator('[data-state="open"]').filter({ hasText: /./ }).count();
  if (thankYou) {
    pass(12, `StudentBottomForm submitted — success state visible (Formcarry POST intercepted: ${formcarryHit})`);
  } else if (toastVisible > 0) {
    pass(12, `Toast fired (Formcarry POST: ${formcarryHit})`);
  } else {
    fail(12, `Bottom form submit failed — thankYou=${thankYou}, formcarry=${formcarryHit}`);
  }

  // --- Step 13: Blog cards ---
  const blogLinks = await page.locator('section:has(h2:has-text("Relevant Blog Articles")) a[href*="/research/"]').all();
  const hrefs = await Promise.all(blogLinks.map((a) => a.getAttribute('href')));
  const expectedSlugs = [
    '/research/f1-students/f1-to-eb5-green-card',
    '/research/5-reasons-switch-h1b-to-eb5',
    '/research/ways-to-fund-eb5-investment-2026',
  ];
  const uniqueHrefs = [...new Set(hrefs.filter(Boolean))];
  if (uniqueHrefs.length === 3 && expectedSlugs.every((s) => uniqueHrefs.some((h) => h.includes(s.replace('/research/', ''))))) {
    pass(13, `Exactly 3 blog cards: ${uniqueHrefs.join(', ')}`);
  } else {
    fail(13, `Expected 3 blog cards with correct slugs, got ${uniqueHrefs.length}: ${uniqueHrefs.join(', ')}`);
  }

  // --- Step 14: LucideIcon SSR ---
  const heroSvg = await page.locator('#student-lead-tuition-trigger svg').count();
  const statSvg = await page.locator('text=$20K–$40K').locator('xpath=ancestor::div[contains(@class,"rounded-lg")]').locator('svg').count();
  const checkSvg = await page.locator('text=With an EB-5 Green Card').locator('..').locator('svg').count();
  if (heroSvg >= 1 && statSvg >= 1 && checkSvg >= 4) {
    pass(14, `LucideIcon SSR renders SVGs — hero=${heroSvg}, stat card=${statSvg}, hiring list=${checkSvg}`);
  } else {
    fail(14, `Lucide icons may be blank — hero=${heroSvg}, stat=${statSvg}, hiring=${checkSvg}`);
  }

  await browser.close();

  const failed = results.filter((r) => r.status === 'FAIL');
  console.log('\n--- SUMMARY ---');
  console.log(`Passed: ${results.filter((r) => r.status === 'PASS').length}, Failed: ${failed.length}`);
  if (failed.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
