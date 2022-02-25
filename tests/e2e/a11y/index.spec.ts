import { test, expect, ViewportSize } from '@playwright/test';
import Axe from 'axe-core';
import { convertAxeToSarif } from 'axe-sarif-converter';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { repoRoot, pages, baseURL } from '../global.setup'

async function exportAxeAsSarifTestResult(sarifFileName: string, axeResults: Axe.AxeResults, browserName: string, viewport?: ViewportSize): Promise<void> {
  const sarifResults = convertAxeToSarif(axeResults);
  let testResultsDirectory = path.join(path.join(repoRoot, 'artifacts', 'test-results', 'a11y', browserName));
  if (viewport) {
    testResultsDirectory = path.join(testResultsDirectory, `${viewport.width}x${viewport.height}`)
  }
  await promisify(fs.mkdir)(testResultsDirectory, { recursive: true });
  const sarifResultFile = path.join(testResultsDirectory, sarifFileName);
  await promisify(fs.writeFile)(
    sarifResultFile,
    JSON.stringify(sarifResults, null, 2));
  console.log(`Exported axe results to ${sarifResultFile}`);
};

pages().forEach((pageUnderTest) => {
  const pageName = pageUnderTest.href.slice(0, pageUnderTest.href.length).replace(baseURL.href, '').split('/').join('_');
  test.describe('a11y', () => {
    test.describe.configure({ mode: 'parallel' });

    test.beforeEach(async ({ browser }) => {
      await browser.newPage();
    });
    
    test(pageUnderTest.pathname, async ({ browserName, page, viewport }) => {
      page.route(url => url.href !== pageUnderTest.href, (route) => route.abort('aborted'))
      await page.goto(pageUnderTest.href);
      await page.waitForLoadState('domcontentloaded');
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      await exportAxeAsSarifTestResult(`${pageName}.sarif`, accessibilityScanResults, browserName, viewport);
      expect(accessibilityScanResults.violations).toStrictEqual([]);
    });
  });
});

