import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = path.resolve(__dirname, "../screenshots");

/**
 * Capture a named screenshot during a Playwright test.
 *
 * Screenshots are saved to `tests/browser/screenshots/` and are tracked
 * in git as visual evidence of application state.
 *
 * @param {import("@playwright/test").Page} page
 * @param {string} name - kebab-case name for the screenshot (e.g. "api-view-mode")
 */
export async function screenshot(page, name) {
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${name}.png`),
  });
}
