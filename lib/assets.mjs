/**
 * What website-blueprint ships, defined once — read by the installer and by the folder build.
 */
import { readFile } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ASSETS = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'assets');

export const STACK_LABEL = 'Next.js · TypeScript · Tailwind CSS · Vercel';

/** Every project gets all of these. ci-cd.md loads only when deploy files are touched. */
export const RULES = [
  'documentation-conventions.md',
  'tech-stack.md',
  'coding-standards.md',
  'design.md',
  'content.md',
  'conversion.md',
  'seo.md',
  'performance.md',
  'accessibility.md',
  'security.md',
  'analytics.md',
  'testing.md',
  'ci-cd.md',
];

/** Folders under docs/ the installer creates. */
export const DOC_DIRS = [
  'copy',
  'design/screens',
  'design/references',
  'audits',
  'infra',
];

/** Files under docs/ the installer creates from templates. */
export const DOC_FILES = { 'pages.md': 'pages.md' };

/** The CLAUDE.md blocks, with the stack filled in. */
export async function claudeTemplate() {
  const template = await readFile(join(ASSETS, 'templates', 'CLAUDE.md'), 'utf8');
  return template.replaceAll('{{STACK}}', STACK_LABEL);
}
