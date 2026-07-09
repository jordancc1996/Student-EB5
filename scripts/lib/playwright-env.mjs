import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

export const PLAYWRIGHT_BROWSERS_PATH =
  process.env.PLAYWRIGHT_BROWSERS_PATH ||
  path.join(PROJECT_ROOT, 'node_modules', '.cache', 'ms-playwright');

/** Set before any `playwright` import so browsers resolve from the project cache. */
export function configurePlaywrightBrowsersPath() {
  process.env.PLAYWRIGHT_BROWSERS_PATH = PLAYWRIGHT_BROWSERS_PATH;
}

export async function launchChromium() {
  configurePlaywrightBrowsersPath();
  const { chromium } = await import('playwright');
  return chromium.launch();
}
