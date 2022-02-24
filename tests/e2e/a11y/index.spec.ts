import { test, expect } from '@playwright/test';
import * as Axe from 'axe-core';
import { convertAxeToSarif } from 'axe-sarif-converter';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const repoRoot: string = path.join(__dirname, '..', '..', '..');
const outputSiteBuildDir: string = path.join(repoRoot, 'src', 'public');

// SARIF is a general-purpose log format for code analysis tools.
//
// Exporting axe results as .sarif files lets our Azure Pipelines build results page show a nice visualization
// of any accessibility failures we find using the Sarif Results Viewer Tab extension
// (https://marketplace.visualstudio.com/items?itemName=sariftools.sarif-viewer-build-tab)
async function exportAxeAsSarifTestResult(sarifFileName: string, axeResults: Axe.AxeResults, browserName: string): Promise<void> {
  const sarifResults = convertAxeToSarif(axeResults);
  const testResultsDirectory = path.join(path.join(repoRoot, 'artifacts', 'test-results', 'a11y', browserName));
  await promisify(fs.mkdir)(testResultsDirectory, { recursive: true });
  const sarifResultFile = path.join(testResultsDirectory, sarifFileName);
  await promisify(fs.writeFile)(
    sarifResultFile,
    JSON.stringify(sarifResults, null, 2));
  console.log(`Exported axe results to ${sarifResultFile}`);
};

const getAllFiles = (dir: string): string[] =>
  fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);

getAllFiles(outputSiteBuildDir).filter((file) => path.extname(file) === '.html').forEach((pageUnderTest) => {
  const pageName = path.relative(outputSiteBuildDir, pageUnderTest).split('\\').join('_');
  test.describe('a11y', () => {  
    test.describe.configure({ mode: 'parallel' });

    test.beforeEach(async ({ browser }) => {
      const page = await browser.newPage();
      await page.goto(`file://${pageUnderTest}`);
      await page.waitForLoadState();
    });

    test(pageName, async ({ browserName, page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      await exportAxeAsSarifTestResult(`${pageName}.sarif`, accessibilityScanResults, browserName);
      expect(accessibilityScanResults.violations).toStrictEqual([]);
    });
  });
});
