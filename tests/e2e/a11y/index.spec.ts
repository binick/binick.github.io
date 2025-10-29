import { test, expect, ViewportSize, Page, BrowserContext } from '@playwright/test';
import { convertAxeToSarif } from 'axe-sarif-converter';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { repoRoot, pages, baseURL } from '../global.setup'

const testResultsDirectory = path.join(path.join(repoRoot, 'artifacts', 'test-results', 'a11y'));

async function exportAxeAsSarifTestResult(sarifFileName: string, axeResults: any, browserName: string, viewport?: ViewportSize): Promise<void> {
  const sarifResults = convertAxeToSarif(axeResults);
  let browserSpecificResultsDirectory = path.join(testResultsDirectory, browserName);
  if (viewport) {
    browserSpecificResultsDirectory = path.join(browserSpecificResultsDirectory, `${viewport.width}x${viewport.height}`)
  }
  await promisify(fs.mkdir)(browserSpecificResultsDirectory, { recursive: true });
  const sarifResultFile = path.join(browserSpecificResultsDirectory, sarifFileName);
  await promisify(fs.writeFile)(
    sarifResultFile,
    JSON.stringify(sarifResults, null, 2));
};

pages().forEach((pageUnderTest) => {
  let page: Page;
  let context: BrowserContext;
  const pageName = pageUnderTest.href.slice(0, pageUnderTest.href.length).replace(baseURL.href, '').split('/').join('_');
  test.describe('a11y', () => {
    test.describe.configure({ mode: 'parallel' });

    test.beforeAll(async ({ browser }) => {
      context = await browser.newContext();
    });

    test.beforeEach(async ({ browser }) => {
      page = await context.newPage();
    });

    test.afterEach(async () => {
      await page.close();
    });

    test.afterAll(async () => {
      await context.close();
    });

    test(pageUnderTest.pathname, async ({ browserName, viewport }, testInfo) => {
      await page.route(url => !url.href.startsWith(baseURL.href), (route) => route.abort('aborted'))
      await page.goto(pageUnderTest.href, { waitUntil: 'load' });
      const accessibilityScanResults: any = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      if (accessibilityScanResults.violations.length != 0) {
        await exportAxeAsSarifTestResult(`${pageName}.sarif`, accessibilityScanResults, browserName, viewport ?? undefined);
        await page.evaluate((violations: any[]) => {
          violations.forEach((v: any) => {
            v.nodes.forEach((n: any) => {
              n.target.forEach((selector: string) => {
                const el = document.querySelector(selector);
                if (el) {
                  (el as HTMLElement).style.outline = '3px solid red';
                  (el as HTMLElement).style.outlineOffset = '2px';
                }
              });
            });
          });
        }, accessibilityScanResults.violations);
        const screenshotPath = path.join(testResultsDirectory, `${pageName}-violations.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true, });
        await testInfo.attach('violations', { path: screenshotPath, contentType: 'image/png', });
      }

      expect(accessibilityScanResults.violations).toStrictEqual([]);
    });
  });
});

