import { FullConfig } from '@playwright/test';
import Koa from 'koa';
import serve from 'koa-static';
import * as fs from 'fs';
import * as path from 'path';

export const repoRoot: string = path.join(__dirname, '..', '..');

export const outputSiteBuildDir: string = path.join(repoRoot, 'artifacts', 'public');

export const app = new Koa();

export const baseURL: URL = new URL('http://localhost:3000');

export function pages(): URL[] {
  const getAllFiles = (dir: string): string[] => fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);
  const pages = [];
  getAllFiles(outputSiteBuildDir)
    .filter((file) => path.extname(file) === '.html')
    .map(file => file.replace(outputSiteBuildDir, baseURL.href).split(path.sep).join('/'))
    .forEach(value => pages.push(new URL(value)));
  return pages;
};

async function wireUp(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const url = new URL(baseURL);
  app.use(serve(outputSiteBuildDir));
  app.listen(url.port);
};
export default wireUp;
