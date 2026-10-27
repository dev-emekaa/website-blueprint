#!/usr/bin/env node
/**
 * Builds the downloadable folder version from the same assets the installer uses:
 *   dist/website-blueprint/            the folder
 *   dist/website-blueprint-v{version}.zip
 * Run with: npm run package
 */
import { cp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { ASSETS, RULES, DOC_FILES, claudeTemplate } from '../lib/assets.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));
const DIST = join(ROOT, 'dist');
const OUT = join(DIST, 'website-blueprint');
const ZIP = `website-blueprint-v${version}.zip`;

await rm(DIST, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

// Guide
await cp(join(ROOT, 'folder', 'README.md'), join(OUT, 'README.md'));

// Skills — one folder each, with any bundled scripts
await cp(join(ASSETS, 'skills'), join(OUT, 'skills'), { recursive: true });

// Rules
for (const f of RULES) await cp(join(ASSETS, 'rules', f), join(OUT, 'rules', f));

// Templates: the CLAUDE.md blocks and the docs files
await mkdir(join(OUT, 'templates'), { recursive: true });
await writeFile(join(OUT, 'templates', 'CLAUDE.md'), await claudeTemplate());
for (const [dest, src] of Object.entries(DOC_FILES)) {
  await cp(join(ASSETS, 'templates', src), join(OUT, 'templates', 'docs', dest));
}

// Zip
try {
  execFileSync('zip', ['-rqX', ZIP, 'website-blueprint', '-x', '*.DS_Store'], { cwd: DIST });
  console.log(`Built dist/website-blueprint/ and dist/${ZIP}`);
} catch {
  console.log('Built dist/website-blueprint/. The `zip` command was not found, so zip that folder yourself.');
}
