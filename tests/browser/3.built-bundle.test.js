import { existsSync } from "fs";
import { writeFile, rm } from "fs/promises";
import { expect, test } from "@playwright/test";
import {
  BUNDLE_PATH,
  FIXTURE_PATH,
  FIXTURE_HTML,
  PREVIEW_URL,
} from "./helpers/built-bundle-fixture.js";

test.describe("3. Built bundle", () => {
  test.skip(!existsSync(BUNDLE_PATH), "run npm run build first");

  test.beforeAll(async () => {
    await writeFile(FIXTURE_PATH, FIXTURE_HTML);
  });

  test.afterAll(async () => {
    await rm(FIXTURE_PATH, { force: true });
  });

  test("renders a map from dist/waymark.js with the inlined worker (no dead-worker stall)", async ({
    page,
  }) => {
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });
    page.on("pageerror", (error) => {
      errors.push(String(error));
    });

    await page.goto(`${PREVIEW_URL}/built-bundle-test.html`);

    await expect(page.locator("canvas.maplibregl-canvas")).toBeVisible();

    await page.waitForFunction(() => Boolean(window.__instance));

    await expect
      .poll(() => page.evaluate(() => window.__mapLoaded), { timeout: 15000 })
      .toBe(true);

    expect(errors).toEqual([]);
  });
});
