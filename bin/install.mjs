#!/usr/bin/env node
/**
 * website-blueprint — install the website workflow into a project.
 * Zero dependencies. Idempotent: existing files are skipped unless --force.
 */
import { readdir, mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { homedir } from 'node:os';
import { ASSETS, RULES, DOC_DIRS, DOC_FILES, claudeTemplate } from '../lib/assets.mjs';

const CWD = process.cwd();
const MARKER = '<!-- website-blueprint:docs-map -->';

const c = { dim: s => `\x1b[2m${s}\x1b[0m`, b: s => `\x1b[1m${s}\x1b[0m`,
            g: s => `\x1b[32m${s}\x1b[0m`, y: s => `\x1b[33m${s}\x1b[0m`, r: s => `\x1b[31m${s}\x1b[0m` };

function parseArgs(argv) {
  const o = { cmd: argv[0], personal: false, force: false, dry: false };
  for (const a of argv.slice(1)) {
    if (a === '--personal') o.personal = true;
    else if (a === '--force') o.force = true;
    else if (a === '--dry-run') o.dry = true;
    else { console.error(c.r(`Unknown option: ${a}`)); process.exit(1); }
  }
  return o;
}

const written = [], skipped = [];
const show = dest => dest.startsWith(CWD) ? relative(CWD, dest) : dest;

async function put(dest, contents, { force, dry }) {
  if (existsSync(dest) && !force) { skipped.push(show(dest)); return; }
  if (!dry) { await mkdir(dirname(dest), { recursive: true }); await writeFile(dest, contents); }
  written.push(show(dest));
}

async function putFile(src, dest, opts) {
  if (existsSync(dest) && !opts.force) { skipped.push(show(dest)); return; }
  if (!opts.dry) { await mkdir(dirname(dest), { recursive: true }); await copyFile(src, dest); }
  written.push(show(dest));
}

/** Copies a skill folder with everything in it, including bundled scripts. */
async function putTree(src, dest, opts) {
  for (const entry of await readdir(src, { withFileTypes: true })) {
    const s = join(src, entry.name), d = join(dest, entry.name);
    if (entry.isDirectory()) await putTree(s, d, opts);
    else await putFile(s, d, opts);
  }
}

async function installSkills(opts) {
  const srcRoot = join(ASSETS, 'skills');
  const destRoot = opts.personal
    ? join(homedir(), '.claude', 'skills')
    : join(CWD, '.claude', 'skills');
  const names = (await readdir(srcRoot, { withFileTypes: true }))
    .filter(d => d.isDirectory()).map(d => d.name).sort();
  for (const name of names) await putTree(join(srcRoot, name), join(destRoot, name), opts);
  return names.length;
}

async function installRules(opts) {
  for (const f of RULES) await putFile(join(ASSETS, 'rules', f), join(CWD, '.claude', 'rules', f), opts);
}

/** docs/ holds the site's own content, so nothing here is ever overwritten, even with --force. */
async function installDocs(opts) {
  const keep = { ...opts, force: false };
  for (const d of DOC_DIRS) await put(join(CWD, 'docs', d, '.gitkeep'), '', keep);
  for (const [dest, src] of Object.entries(DOC_FILES)) {
    await putFile(join(ASSETS, 'templates', src), join(CWD, 'docs', dest), keep);
  }
}

/** Two folders must never be committed: the owner's reference screenshots, and the check output. */
async function installGitignore(opts) {
  const dest = join(CWD, '.gitignore');
  const lines = ['docs/design/references/', '.checks/'];
  const cur = existsSync(dest) ? await readFile(dest, 'utf8') : '';
  const add = lines.filter(l => !cur.split('\n').some(x => x.trim() === l));
  if (!add.length) { skipped.push('.gitignore (already lists the folders)'); return; }
  if (!opts.dry) await writeFile(dest, (cur ? cur.trimEnd() + '\n' : '') + '# website-blueprint: never committed\n' + add.join('\n') + '\n');
  written.push(cur ? '.gitignore (2 lines added)' : '.gitignore');
}

const docsMap = async () => `\n${MARKER}\n${await claudeTemplate()}`;

async function installClaudeMd(opts) {
  const dest = join(CWD, 'CLAUDE.md');
  if (existsSync(dest)) {
    const cur = await readFile(dest, 'utf8');
    if (cur.includes(MARKER)) { skipped.push('CLAUDE.md (already has the docs map)'); return; }
    if (!opts.dry) await writeFile(dest, cur.trimEnd() + '\n' + (await docsMap()));
    written.push('CLAUDE.md (docs map appended)');
  } else {
    await put(dest, `# Project instructions\n${await docsMap()}`, opts);
  }
}

function usage() {
  console.log(`
${c.b('website-blueprint')} — websites that inform and convert, built with Claude Code

${c.b('Usage')}
  npx github:dev-emekaa/website-blueprint init [options]

${c.b('Options')}
  --personal        Install skills to ~/.claude/skills instead of the project
  --force           Overwrite existing files ${c.dim('(default: skip them)')}
  --dry-run         Print what would change, write nothing

${c.b('What it writes')}
  .claude/skills/          10 skills
  .claude/rules/           13 rules
  docs/                    pages.md · copy · design · audits · infra
  CLAUDE.md                documentation map, project configuration
  .gitignore               docs/design/references/ and .checks/ added
`);
}

async function main() {
  const [major] = process.versions.node.split('.').map(Number);
  if (major < 22) { console.error(c.r(`Node 22+ required (found ${process.versions.node})`)); process.exit(1); }

  const opts = parseArgs(process.argv.slice(2));
  if (!opts.cmd || opts.cmd === 'help' || opts.cmd === '--help' || opts.cmd === '-h') { usage(); return; }
  if (opts.cmd !== 'init') { console.error(c.r(`Unknown command: ${opts.cmd}`)); usage(); process.exit(1); }

  console.log(`\n${c.b('website-blueprint')} → ${CWD}${opts.dry ? c.y('  (dry run)') : ''}\n`);

  const n = await installSkills(opts);
  await installRules(opts);
  await installDocs(opts);
  await installGitignore(opts);
  await installClaudeMd(opts);

  const label = opts.dry ? 'would write' : 'written';
  console.log(`${c.g(`${written.length} ${label}`)}${skipped.length ? c.dim(`, ${skipped.length} skipped`) : ''}\n`);
  for (const f of written) console.log(`  ${c.g('+')} ${f}`);
  if (skipped.length) {
    console.log(c.dim(`\n  skipped (already present — use --force to overwrite skills and rules; docs and CLAUDE.md are never overwritten):`));
    for (const f of skipped) console.log(c.dim(`  · ${f}`));
  }

  console.log(`
${c.b('Next')}
  1. Fill in the project configuration in ${c.dim('CLAUDE.md')}. Anything you leave blank,
     the skill that needs it asks for once.
  2. Start Claude Code and run ${c.b('/site-brief')} — tell it what the site is for.
  3. Then ${c.b('/site-plan')}, ${c.b('/site-setup')}, ${c.b('/design-system')} and ${c.b('/site-copy')},
     and ${c.b('/site-build')} for the first page.

  Already have a site you want to keep? Run ${c.b('/site-adopt')} instead.

  ${n} skills installed to ${c.dim(opts.personal ? '~/.claude/skills' : '.claude/skills')}${
    opts.personal ? c.y('\n  Note: personal skills are not read by cloud sessions or scheduled runs.') : ''}
`);
}

main().catch(e => { console.error(c.r(e.stack || e.message)); process.exit(1); });
