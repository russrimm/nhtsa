/**
 * Playwright screenshot script — captures every NHTSA Analyzer page
 * with realistic example lookups.
 *
 * Usage:  node scripts/screenshot.mjs
 * Output: screenshots/*.png
 */
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const BASE = 'http://localhost:5173';
const OUT  = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'screenshots');

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  ✓  ${name}.png`);
}

/** Wait for network quiet, but don't fail if it times out (APIs can be slow). */
async function idle(page, ms = 8000) {
  try { await page.waitForLoadState('networkidle', { timeout: ms }); }
  catch { /* tolerate timeout */ }
}

/**
 * Open the nth Radix UI combobox (0-based) and click the option
 * whose visible text starts with `text`.
 */
async function radixSelect(page, nth, text) {
  const triggers = page.locator('[role="combobox"]');
  await triggers.nth(nth).click();
  await page.waitForSelector('[role="option"]', { timeout: 6000 });
  // scroll the list so the item is visible, then click it
  await page.locator('[role="option"]').filter({ hasText: text }).first().scrollIntoViewIfNeeded();
  await page.locator('[role="option"]').filter({ hasText: text }).first().click();
  // small pause so downstream queries can fire
  await page.waitForTimeout(600);
}

(async () => {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport:    { width: 1440, height: 900 },
    colorScheme: 'light',
    locale:      'en-US',
  });
  const page = await ctx.newPage();

  // ── 1. Dashboard ─────────────────────────────────────────────────────────────
  console.log('1. Dashboard');
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await idle(page, 4000);
  await shot(page, '1-dashboard');

  // ── 2. VIN Decode — 1HGCM82633A004352 (2003 Honda Accord) ───────────────────
  console.log('2. VIN result');
  await page.goto(`${BASE}/vin/1HGCM82633A004352`, { waitUntil: 'domcontentloaded' });
  await idle(page, 12000);
  await page.waitForTimeout(2000);
  await shot(page, '2-vin-result');

  // ── 3. Vehicle Hub — 2022 Toyota Camry ──────────────────────────────────────
  console.log('3. Vehicle hub (2022 Toyota Camry)');
  await page.goto(`${BASE}/vehicle/2022/TOYOTA/CAMRY`, { waitUntil: 'domcontentloaded' });
  await idle(page, 14000);
  await page.waitForTimeout(3000);
  await shot(page, '3-vehicle-hub');

  // ── 4. Recalls — 2022 Toyota Camry ──────────────────────────────────────────
  console.log('4. Recalls');
  await page.goto(`${BASE}/recalls`, { waitUntil: 'domcontentloaded' });
  await idle(page, 4000);
  await radixSelect(page, 0, '2022');
  await idle(page, 6000);                       // wait for makes to load
  await radixSelect(page, 1, 'TOYOTA');
  await idle(page, 6000);                       // wait for models to load
  await radixSelect(page, 2, 'CAMRY');
  await idle(page, 10000);                      // wait for recall results
  await page.waitForTimeout(1500);
  await shot(page, '4-recalls');

  // ── 5. Complaints — 2022 Toyota Camry ───────────────────────────────────────
  console.log('5. Complaints');
  await page.goto(`${BASE}/complaints`, { waitUntil: 'domcontentloaded' });
  await idle(page, 4000);
  await radixSelect(page, 0, '2022');
  await idle(page, 6000);
  await radixSelect(page, 1, 'TOYOTA');
  await idle(page, 6000);
  await radixSelect(page, 2, 'CAMRY');
  await idle(page, 10000);
  await page.waitForTimeout(1500);
  await shot(page, '5-complaints');

  // ── 6. Safety Ratings — 2022 Toyota Camry ────────────────────────────────────
  console.log('6. Safety ratings');
  await page.goto(`${BASE}/ratings`, { waitUntil: 'domcontentloaded' });
  await idle(page, 4000);
  await radixSelect(page, 0, '2022');
  await idle(page, 6000);
  await radixSelect(page, 1, 'TOYOTA');
  await idle(page, 6000);
  await radixSelect(page, 2, 'CAMRY');
  await idle(page, 10000);
  await page.waitForTimeout(1500);
  await shot(page, '6-ratings');

  // ── 7. Car Seat Locator — ZIP 20590 (Washington DC / NHTSA HQ) ───────────────
  console.log('7. Car seat locator');
  await page.goto(`${BASE}/car-seat-locator`, { waitUntil: 'domcontentloaded' });
  await idle(page, 3000);
  await page.fill('input[inputmode="numeric"]', '20590');
  await page.press('input[inputmode="numeric"]', 'Enter');
  await idle(page, 12000);
  await page.waitForTimeout(2000);
  await shot(page, '7-car-seat-locator');

  // ── 8. Compare — seed localStorage then load the page ────────────────────────
  console.log('8. Vehicle compare');
  await page.evaluate(() => {
    localStorage.setItem('nhtsa.compare.v1', JSON.stringify([
      { year: 2022, make: 'TOYOTA', model: 'CAMRY'  },
      { year: 2023, make: 'HONDA',  model: 'ACCORD' },
      { year: 2022, make: 'FORD',   model: 'FUSION' },
    ]));
  });
  await page.goto(`${BASE}/compare`, { waitUntil: 'domcontentloaded' });
  await idle(page, 16000);
  await page.waitForTimeout(4000);
  await shot(page, '8-compare');

  // ── 9. About ─────────────────────────────────────────────────────────────────
  console.log('9. About');
  await page.goto(`${BASE}/about`, { waitUntil: 'domcontentloaded' });
  await idle(page, 3000);
  await shot(page, '9-about');

  await browser.close();
  console.log(`\nDone — screenshots saved to: ${OUT}`);
})();
