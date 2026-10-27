#!/usr/bin/env node
/**
 * check.mjs — measures a website the way a visitor and a search engine meet it.
 *
 *   node check.mjs <url> [--pages N] [--out DIR] [--no-lighthouse] [--only-url] [--strict] [--redirects FILE]
 *
 * For each page (the URL, then the pages its sitemap or links reach, up to --pages, default 25):
 *   · response and security headers, redirect chain
 *   · rendered in Chromium at 320, 390, 768, 1280 and 1920 px: screenshots, overflow, the h1, metadata,
 *     structured data, fonts, small text, images without alt or size, forms
 *   · axe accessibility violations at phone and desktop widths
 *   · Lighthouse at mobile settings, three runs, the median: scores, LCP, CLS, TBT, page weight, JavaScript
 *   · broken internal links across the site
 *
 * The gates are the blueprint's rules (performance, accessibility, seo, security, design, conversion).
 * Plain runs are lenient (budgets, headers and metadata are WARN) for auditing any site; --strict makes
 * them FAIL, which is how `pnpm check` runs it. --redirects FILE (lines of `old,new`) verifies that each
 * old URL reaches its target in one hop. Exits 1 when anything FAILs.
 *
 * Writes <out>/report.json, <out>/report.md, <out>/screens/*.png and <out>/copy/*.txt.
 * Needs playwright, @axe-core/playwright and lighthouse. It uses the project's copies when
 * it can resolve them from the current folder; otherwise it installs them once into ~/.cache/site-check/deps.
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { homedir } from 'node:os';
import { pathToFileURL } from 'node:url';

// ---------- arguments ----------
const args = process.argv.slice(2);
const url = args.find(a => !a.startsWith('--'));
if (!url) { console.error('Usage: node check.mjs <url> [--pages N] [--out DIR] [--no-lighthouse] [--only-url] [--strict] [--redirects FILE]'); process.exit(1); }
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const MAX_PAGES = Number(opt('--pages', 25));
const NO_LH = args.includes('--no-lighthouse');
const ONLY_URL = args.includes('--only-url');
const STRICT = args.includes('--strict');
const REDIRECTS = opt('--redirects', null);
let start = new URL(url);
const OUT = resolve(opt('--out', join('.checks', start.hostname, new Date().toISOString().slice(0, 10))));
await mkdir(join(OUT, 'screens'), { recursive: true });
await mkdir(join(OUT, 'copy'), { recursive: true });

// ---------- dependencies ----------
const need = ['playwright', '@axe-core/playwright', ...(NO_LH ? [] : ['lighthouse', 'chrome-launcher'])];
async function loadDeps() {
  const depDir = join(homedir(), '.cache', 'site-check', 'deps');
  const from = dir => createRequire(join(dir, 'package.json'));
  const load = async (req, n) => import(pathToFileURL(req.resolve(n)).href);
  const mods = {}, missing = [];
  mods.__cli = null;   // the CLI of the Playwright copy in use, so the matching Chromium build can be installed
  const cliOf = req => { try { return join(dirname(req.resolve('playwright/package.json')), 'cli.js'); } catch { return null; } };
  for (const n of need) {
    try { mods[n] = await load(from(process.cwd()), n); if (n === 'playwright') mods.__cli = cliOf(from(process.cwd())); continue; } catch { /* not in the project */ }
    try { mods[n] = await load(from(depDir), n); if (n === 'playwright') mods.__cli = cliOf(from(depDir)); continue; } catch { missing.push(n); }
  }
  if (missing.length) {
    console.log(`Installing ${missing.join(', ')} into ${depDir} (once)…`);
    await mkdir(depDir, { recursive: true });
    try { await access(join(depDir, 'package.json')); } catch { await writeFile(join(depDir, 'package.json'), '{"name":"site-check-deps","private":true}'); }
    execFileSync('npm', ['install', '--no-audit', '--no-fund', '--silent', ...missing], { cwd: depDir, stdio: 'inherit' });
    for (const n of missing) { mods[n] = await load(from(depDir), n); if (n === 'playwright') mods.__cli = cliOf(from(depDir)); }
  }
  return mods;
}
const deps = await loadDeps();
const { chromium } = deps.playwright.chromium ? deps.playwright : deps.playwright.default;
const axeMod = deps['@axe-core/playwright'];
const AxeBuilder = axeMod.AxeBuilder ?? axeMod.default?.AxeBuilder ?? axeMod.default;

// ---------- helpers ----------
const findings = [];          // { page, area, level: 'FAIL'|'WARN', text }
const F = (page, area, level, text) => findings.push({ page, area, level, text });
const G = (page, area, text) => F(page, area, STRICT ? 'FAIL' : 'WARN', text);   // a gate: WARN when auditing, FAIL under --strict
const same = u => { try { const x = new URL(u, start); return x.origin === start.origin ? x.href.split('#')[0] : null; } catch { return null; } };
const slug = u => new URL(u).pathname.replace(/\/$/, '') .replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home';

const REQUIRED_HEADERS = {
  'content-security-policy': v => v ? null : 'missing',
  'strict-transport-security': v => v && Number((v.match(/max-age=(\d+)/) || [])[1]) >= 31536000 ? null : 'missing or max-age under 1 year',
  'x-content-type-options': v => v === 'nosniff' ? null : 'should be nosniff',
  'referrer-policy': v => v ? null : 'missing',
  'permissions-policy': v => v ? null : 'missing',
};

async function fetchInfo(u) {
  const chain = [];
  let cur = u, res;
  for (let i = 0; i < 6; i++) {
    res = await fetch(cur, { redirect: 'manual', headers: { 'user-agent': 'site-check/1.0' } });
    chain.push({ url: cur, status: res.status });
    const loc = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && loc) { cur = new URL(loc, cur).href; continue; }
    break;
  }
  const headers = Object.fromEntries(res.headers.entries());
  return { chain, final: cur, status: res.status, headers };
}

// ---------- page measurement (runs in the browser) ----------
const probe = () => {
  const vh = innerHeight, vw = innerWidth;
  const text = el => (el?.textContent || '').trim().replace(/\s+/g, ' ');
  const prose = el => (el?.innerText || '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  const meta = n => document.querySelector(`meta[name="${n}"], meta[property="${n}"]`)?.content || '';
  const h1s = [...document.querySelectorAll('h1')];
  const h1 = h1s[0];
  const h1Rect = h1?.getBoundingClientRect();
  const h1Style = h1 && getComputedStyle(h1);
  const h1Lh = h1 ? (isNaN(parseFloat(h1Style.lineHeight)) ? parseFloat(h1Style.fontSize) * 1.2 : parseFloat(h1Style.lineHeight)) : 0;
  const h1Lines = h1 ? Math.round(h1Rect.height / h1Lh) : 0;
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => Number(h.tagName[1]));
  let skipped = false;
  for (let i = 1; i < headings.length; i++) if (headings[i] > headings[i - 1] + 1) skipped = true;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let small = 0, tiny = 0, n;
  const fonts = new Set();
  while ((n = walker.nextNode())) {
    if (!n.textContent.trim() || !n.parentElement) continue;
    const s = getComputedStyle(n.parentElement);
    if (s.display === 'none' || s.visibility === 'hidden') continue;
    const px = parseFloat(s.fontSize);
    if (px < 13) small++;
    if (px < 11) tiny++;
    fonts.add(s.fontFamily.split(',')[0].replace(/["']/g, '').trim());
  }
  const imgs = [...document.images];
  const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => {
    try { return JSON.parse(s.textContent); } catch { return { __invalid: true }; }
  });
  const ldTypes = ld.flatMap(b => b.__invalid ? ['(invalid JSON)'] : [].concat(b['@graph'] || b).map(x => x?.['@type']).flat()).filter(Boolean);
  const main = document.querySelector('main') || document.body;
  const firstScreenButton = [...document.querySelectorAll('a,button')].some(el => {
    const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    const inNav = !!el.closest('nav, header') && !/^(tel|mailto):/.test(el.getAttribute('href') || '');
    return !inNav && r.top < vh && r.height > 0 && (el.tagName === 'BUTTON' || s.display.includes('inline-block') || s.display === 'flex' || s.display === 'block');
  });
  const firstFocusable = document.querySelector('a[href], button, input, select, textarea');
  const skipLink = !!firstFocusable && firstFocusable.tagName === 'A' && /^#./.test(firstFocusable.getAttribute('href') || '') && !!document.querySelector(firstFocusable.getAttribute('href'));
  return {
    title: document.title, titleLen: document.title.length,
    description: meta('description'), descriptionLen: meta('description').length,
    canonical: document.querySelector('link[rel="canonical"]')?.href || '',
    og: { title: meta('og:title'), image: meta('og:image'), description: meta('og:description') },
    lang: document.documentElement.lang, viewport: !!document.querySelector('meta[name="viewport"]'),
    robots: meta('robots'),
    h1Count: h1s.length, h1Text: text(h1), h1Px: h1 ? parseFloat(h1Style.fontSize) : 0,
    h1InFirstScreen: !!h1 && h1Rect.top < vh && h1Rect.bottom > 0, h1Lines,
    headingSkipped: skipped, headingCount: headings.length,
    landmarks: { main: !!document.querySelector('main'), nav: !!document.querySelector('nav'), header: !!document.querySelector('header'), footer: !!document.querySelector('footer') },
    skipLink,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    small, tiny, fonts: [...fonts], fontCount: fonts.size,
    images: imgs.length,
    imagesNoAlt: imgs.filter(i => !i.hasAttribute('alt')).length,
    imagesNoSize: imgs.filter(i => (!i.getAttribute('width') || !i.getAttribute('height')) && getComputedStyle(i).position !== 'absolute').length,
    forms: document.forms.length,
    inputsNoLabel: [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]),textarea,select')]
      .filter(i => !i.labels?.length && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby')).length,
    firstScreenButton,
    ldTypes, ldInvalid: ld.some(b => b.__invalid),
    links: [...document.querySelectorAll('a[href]')].map(a => a.href),
    assets: [...new Set([...imgs.map(i => i.currentSrc || i.src), meta('og:image')].filter(Boolean))],
    words: prose(main).split(/\s+/).length,
    copy: prose(main).slice(0, 20000),
  };
};

// ---------- collect the pages ----------
async function discoverPages(browser) {
  const pages = new Set([start.href.split('#')[0]]);
  if (ONLY_URL) return [...pages];
  try {
    const sm = await fetch(new URL('/sitemap.xml', start)).then(r => r.ok ? r.text() : '');
    for (const m of sm.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) { const s = same(m[1]); if (s && !s.endsWith('.xml')) pages.add(s); }
  } catch { /* no sitemap */ }
  if (pages.size < 2) {
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    await p.goto(start.href, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
    const links = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href));
    for (const l of links) { const s = same(l); if (s && !/\.(pdf|jpg|png|zip)$/i.test(s)) pages.add(s); }
    await ctx.close();
  }
  return [...pages].slice(0, MAX_PAGES);
}

// ---------- run ----------
async function launchBrowser() {
  try { return await chromium.launch(); }
  catch (e) {
    if (!/Executable doesn't exist/.test(e.message)) throw e;
    console.log('Installing the Chromium build this Playwright needs (once)…');
    if (!deps.__cli) throw e;
    execFileSync(process.execPath, [deps.__cli, 'install', 'chromium'], { stdio: 'inherit' });
    return chromium.launch();
  }
}
const browser = await launchBrowser();
try {   // follow the first redirect (http → https, bare → www) so the site's real origin is audited
  const first = await fetchInfo(start.href);
  if (first.chain.length > 1 && new URL(first.final).hostname.replace(/^www\./, '') === start.hostname.replace(/^www\./, '')) start = new URL(first.final);
} catch { /* judged per page below */ }
const pages = await discoverPages(browser);
console.log(`Checking ${pages.length} page(s) on ${start.origin} → ${OUT}`);
const report = { site: start.origin, date: new Date().toISOString(), pages: [] };
const allLinks = new Set();
const allAssets = new Set();

for (const pageUrl of pages) {
  const name = slug(pageUrl);
  const entry = { url: pageUrl, name };
  console.log(`· ${pageUrl}`);

  // response + headers
  try {
    const info = await fetchInfo(pageUrl);
    entry.status = info.status; entry.chain = info.chain; entry.headers = info.headers;
    if (info.status >= 400) F(name, 'Response', 'FAIL', `HTTP ${info.status}`);
    if (info.chain.length > 2) G(name, 'SEO', `Redirect chain of ${info.chain.length - 1} hops`);
    const local = /^(localhost|127\.0\.0\.1)$/.test(start.hostname);
    if (!local && !/^https:/.test(info.final)) F(name, 'Security', 'FAIL', 'Not served over HTTPS');
    if (pageUrl === pages[0]) {   // headers are site-wide; judged once
      for (const [h, test] of Object.entries(REQUIRED_HEADERS)) {
        const why = test(info.headers[h]); if (why) G('site', 'Security', `Header ${h}: ${why}`);
      }
      const csp = info.headers['content-security-policy'] || '';
      if (csp && !/frame-ancestors/.test(csp) && !info.headers['x-frame-options']) G('site', 'Security', 'No frame-ancestors or X-Frame-Options: the page can be framed');
      if (/script-src[^;]*'unsafe-inline'/.test(csp)) G('site', 'Security', "CSP allows 'unsafe-inline' scripts");
    }
  } catch (e) { F(name, 'Response', 'FAIL', `Could not fetch: ${e.message}`); }

  // rendered at five widths
  entry.widths = {};
  const WIDTHS = [['narrow', 320, 568, true], ['phone', 390, 844, true], ['tablet', 768, 1024, true], ['desktop', 1280, 800, false], ['wide', 1920, 1080, false]];
  const overflowAt = [], smallAt = [];
  let axeRan = false;
  const axeById = new Map();
  for (const [label, width, height, mobile] of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, reducedMotion: 'no-preference' });
    const p = await ctx.newPage();
    try {
      await p.goto(pageUrl, { waitUntil: 'networkidle', timeout: 60000 });
      await p.waitForTimeout(1200);
      const m = await p.evaluate(probe);
      entry.widths[label] = m;
      await p.screenshot({ path: join(OUT, 'screens', `${name}-${label}.png`), fullPage: true });
      if (label === 'desktop') {
        await writeFile(join(OUT, 'copy', `${name}.txt`), `${pageUrl}\n\n${m.copy}\n`);
        m.links.forEach(l => { const s = same(l); if (s) allLinks.add(s); });
        m.assets.forEach(a => { try { allAssets.add(new URL(a, pageUrl).href); } catch { /* bad url */ } });
        if (!m.skipLink) F(name, 'Accessibility', 'WARN', 'No skip link to the main content as the first focusable element (2.4.1)');
        // page-level facts, judged once
        if (m.h1Count === 0) F(name, 'SEO', 'FAIL', 'No h1');
        if (m.h1Count > 1) G(name, 'SEO', `${m.h1Count} h1 elements`);
        if (!m.titleLen) F(name, 'SEO', 'FAIL', 'No <title>');
        else if (m.titleLen > 65) G(name, 'SEO', `Title is ${m.titleLen} characters; search results cut it around 60`);
        if (!m.descriptionLen) F(name, 'SEO', 'FAIL', 'No meta description');
        else if (m.descriptionLen > 160) G(name, 'SEO', `Meta description is ${m.descriptionLen} characters; cut around 155`);
        else if (m.descriptionLen < 50) F(name, 'SEO', 'WARN', `Meta description is only ${m.descriptionLen} characters: it won't give a reason to click`);
        if (!m.canonical) G(name, 'SEO', 'No canonical URL');
        if (!m.og.title || !m.og.image) G(name, 'SEO', 'Open Graph title or image missing: shared links show no preview');
        entry.lang = m.lang;
        if (!m.viewport) F(name, 'Performance', 'FAIL', 'No viewport meta tag');
        if (m.headingSkipped) F(name, 'Accessibility', 'WARN', 'Heading levels skip (for example h2 → h4)');
        if (!m.landmarks.main) F(name, 'Accessibility', 'WARN', 'No <main> landmark');
        if (m.ldInvalid) F(name, 'SEO', 'FAIL', 'A JSON-LD block does not parse');
        if (!m.ldTypes.length) G(name, 'SEO', 'No structured data');
        entry.imagesNoAlt = m.imagesNoAlt;
        if (m.imagesNoSize) F(name, 'Performance', 'WARN', `${m.imagesNoSize} image(s) without width and height: layout can shift`);
        if (m.inputsNoLabel) F(name, 'Accessibility', 'FAIL', `${m.inputsNoLabel} form field(s) with no label — a placeholder is not a label (3.3.2)`);
        if (m.fontCount > 3) F(name, 'Design', 'WARN', `${m.fontCount} font families in use: ${m.fonts.join(', ')}`);
        if (m.robots && /noindex/.test(m.robots)) F(name, 'SEO', 'WARN', 'Page is noindex');
      }
      if (m.overflow) overflowAt.push(width);
      if (m.small) smallAt.push({ label, small: m.small, tiny: m.tiny });
      if (label === 'phone') {
        if (m.h1Count && !m.h1InFirstScreen) F(name, 'Conversion', 'WARN', 'The h1 is not in the first screen on a phone');
        if (!m.firstScreenButton) F(name, 'Conversion', 'WARN', 'No visible action in the first screen on a phone');
        if (m.h1Lines > 2) F(name, 'Design', 'WARN', `The headline wraps to ${m.h1Lines} lines on a phone`);
        if (m.h1Px && m.h1Px < 32) F(name, 'Design', 'WARN', `The h1 is ${Math.round(m.h1Px)}px on a phone (the rule is 32 or more)`);
      }
      // axe at phone and desktop
      if (label === 'phone' || label === 'desktop') {
        try {
          const axe = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
          axeRan = true;
          m.axe = axe.violations.map(x => ({ id: x.id, impact: x.impact, help: x.help, nodes: x.nodes.length }));
          for (const x of axe.violations) {
            const cur = axeById.get(x.id) || { impact: x.impact, help: x.help, nodes: 0, at: [] };
            cur.nodes = Math.max(cur.nodes, x.nodes.length); cur.at.push(label); axeById.set(x.id, cur);
          }
        } catch (e) { F(name, 'Accessibility', 'WARN', `axe could not run at ${label}: ${e.message}`); }
      }
      delete m.copy; delete m.links; delete m.assets;
    } catch (e) { F(name, 'Response', 'FAIL', `Could not render at ${label}: ${e.message}`); }
    await ctx.close();
  }
  // judged once per page, across widths
  if (overflowAt.length) F(name, 'Accessibility', 'FAIL', `Horizontal scroll at ${overflowAt.join(', ')}px (1.4.10 reflow)`);
  if (smallAt.length) { const worst = smallAt.reduce((a, b) => b.small > a.small ? b : a); F(name, 'Design', worst.tiny ? 'FAIL' : 'WARN', `Up to ${worst.small} text node(s) under 13px${worst.tiny ? `, ${worst.tiny} under 11px` : ''} (${smallAt.map(x => x.label).join(', ')})`); }
  for (const [id, x] of axeById) F(name, 'Accessibility', ['critical', 'serious'].includes(x.impact) ? 'FAIL' : 'WARN', `axe ${id} (${x.impact}, ${x.nodes} element(s), ${x.at.join(' + ')}): ${x.help}`);
  if (!axeRan) {   // axe covers these when it runs
    if (entry.lang === '') F(name, 'Accessibility', 'FAIL', '<html> has no lang attribute (3.1.1)');
    if (entry.imagesNoAlt) F(name, 'Accessibility', 'FAIL', `${entry.imagesNoAlt} image(s) without an alt attribute (1.1.1)`);
  }

  // lighthouse, mobile
  if (!NO_LH) {
    try {
      const lighthouse = deps.lighthouse.default ?? deps.lighthouse;
      const chromeLauncher = deps['chrome-launcher'].launch ? deps['chrome-launcher'] : deps['chrome-launcher'].default;
      const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox'] });
      const runs = [];
      for (let i = 0; i < 3; i++) {
        const r = await lighthouse(pageUrl, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
        runs.push(r.lhr);
      }
      await chrome.kill();
      runs.sort((a, b) => a.categories.performance.score - b.categories.performance.score);
      const lhr = runs[1];   // the median run
      const a = lhr.audits;
      entry.lighthouse = {
        performance: Math.round(lhr.categories.performance.score * 100),
        accessibility: Math.round(lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100),
        lcpMs: Math.round(a['largest-contentful-paint']?.numericValue ?? 0),
        cls: Number((a['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3)),
        tbtMs: Math.round(a['total-blocking-time']?.numericValue ?? 0),
        weightKb: Math.round((a['total-byte-weight']?.numericValue ?? 0) / 1024),
        jsKb: Math.round((a['network-requests']?.details?.items ?? []).filter(x => x.resourceType === 'Script').reduce((s, x) => s + (x.transferSize ?? 0), 0) / 1024),
      };
      const L = entry.lighthouse;
      if (L.performance < 90) F(name, 'Performance', (STRICT || L.performance < 50) ? 'FAIL' : 'WARN', `Lighthouse performance ${L.performance} on mobile (budget 90)`);
      if (L.lcpMs > 2500) F(name, 'Performance', (STRICT || L.lcpMs > 4000) ? 'FAIL' : 'WARN', `LCP ${(L.lcpMs / 1000).toFixed(1)} s (budget 2.5 s)`);
      if (L.cls > 0.1) F(name, 'Performance', (STRICT || L.cls > 0.25) ? 'FAIL' : 'WARN', `CLS ${L.cls} (budget 0.1)`);
      if (L.tbtMs > 300) F(name, 'Performance', 'WARN', `Total blocking time ${L.tbtMs} ms: the page is slow to respond`);
      if (L.jsKb > 150) G(name, 'Performance', `${L.jsKb} KB of JavaScript transferred (budget 150 KB for a content site, 300 KB for an expressive one)`);
      if (L.weightKb > 1536) G(name, 'Performance', `Page weight ${(L.weightKb / 1024).toFixed(1)} MB (budget 1.5 MB)`);
      if (L.seo < 90) F(name, 'SEO', 'WARN', `Lighthouse SEO ${L.seo}`);
      if (L.bestPractices < 90) F(name, 'Security', 'WARN', `Lighthouse best practices ${L.bestPractices}: see the Lighthouse report for console errors, mixed content or deprecated APIs`);
    } catch (e) { F(name, 'Performance', 'WARN', `Lighthouse could not run: ${e.message}`); }
  }
  report.pages.push(entry);
}

// broken internal links
const checked = new Set(pages);
const toCheck = [...allLinks].filter(l => !checked.has(l) && !/^mailto:|^tel:/.test(l)).slice(0, 200);
const broken = [];
for (const l of toCheck) {
  try {
    let r = await fetch(l, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': 'site-check/1.0' } });
    if (r.status === 405 || r.status === 403) r = await fetch(l, { redirect: 'follow', headers: { 'user-agent': 'site-check/1.0' } });
    if (r.status >= 400) broken.push({ url: l, status: r.status });
  } catch (e) { broken.push({ url: l, status: e.message }); }
}
report.brokenLinks = broken;
for (const b of broken) F('site', 'SEO', 'FAIL', `Broken internal link ${b.url} (${b.status})`);
const brokenAssets = [];
for (const a of [...allAssets].slice(0, 300)) {
  try {
    let r = await fetch(a, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': 'site-check/1.0' } });
    if (r.status === 405 || r.status === 403) r = await fetch(a, { redirect: 'follow', headers: { 'user-agent': 'site-check/1.0' } });
    if (r.status >= 400) brokenAssets.push({ url: a, status: r.status });
  } catch (e) { brokenAssets.push({ url: a, status: e.message }); }
}
report.brokenAssets = brokenAssets;
for (const b of brokenAssets) F('site', 'SEO', 'FAIL', `Image does not load: ${b.url} (${b.status})`);

// a redesign's redirect map: every old URL reaches its target in one hop
if (REDIRECTS) {
  const rows = (await readFile(REDIRECTS, 'utf8')).split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#') && !/^old\s*,/i.test(l));
  const results = [];
  for (const row of rows) {
    const [oldPath, newPath] = row.split(',').map(x => x.trim());
    const from = new URL(oldPath, start).href, want = new URL(newPath, start).href;
    try {
      const r = await fetch(from, { redirect: 'manual', headers: { 'user-agent': 'site-check/1.0' } });
      const loc = r.headers.get('location') ? new URL(r.headers.get('location'), from).href : null;
      const ok = [301, 308].includes(r.status) && loc === want;
      results.push({ from, want, status: r.status, to: loc, ok });
      if (!ok) F('site', 'SEO', 'FAIL', `Redirect ${oldPath} → expected ${newPath}, got ${r.status}${loc ? ' → ' + loc.replace(start.origin, '') : ''}`);
    } catch (e) { results.push({ from, want, error: e.message, ok: false }); F('site', 'SEO', 'FAIL', `Redirect ${oldPath}: ${e.message}`); }
  }
  report.redirects = results;
  console.log(`Redirects: ${results.filter(r => r.ok).length}/${results.length} correct`);
}
report.findings = findings;
await browser.close();

// ---------- write ----------
await writeFile(join(OUT, 'report.json'), JSON.stringify(report, null, 2));
const by = (k) => findings.reduce((m, f) => ((m[f[k]] ??= []).push(f), m), {});
const fails = findings.filter(f => f.level === 'FAIL').length, warns = findings.length - fails;
let md = `# Site check — ${start.origin}\n\n${report.date.slice(0, 10)} · ${pages.length} page(s) · **${fails} FAIL** · ${warns} WARN\n\n`;
md += `| Page | Perf | A11y | SEO | LCP | CLS | JS | FAIL | WARN |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n`;
for (const p of report.pages) {
  const L = p.lighthouse || {}; const f = findings.filter(x => x.page === p.name);
  md += `| ${p.url.replace(start.origin, '') || '/'} | ${L.performance ?? '—'} | ${L.accessibility ?? '—'} | ${L.seo ?? '—'} | ${L.lcpMs != null ? (L.lcpMs / 1000).toFixed(1) + ' s' : '—'} | ${L.cls ?? '—'} | ${L.jsKb != null ? L.jsKb + ' KB' : '—'} | ${f.filter(x => x.level === 'FAIL').length} | ${f.filter(x => x.level === 'WARN').length} |\n`;
}
for (const [area, list] of Object.entries(by('area')).sort()) {
  md += `\n## ${area}\n\n`;
  for (const f of list.sort((a, b) => a.level.localeCompare(b.level))) md += `- **${f.level}** \`${f.page}\` — ${f.text}\n`;
}
if (report.redirects) md += `\n## Redirects\n\n${report.redirects.filter(r => r.ok).length} of ${report.redirects.length} old URLs reach their target in one hop.\n`;
md += `\nScreenshots: \`${join(OUT, 'screens')}\` · page text: \`${join(OUT, 'copy')}\` · raw data: \`${join(OUT, 'report.json')}\`\n`;
await writeFile(join(OUT, 'report.md'), md);
console.log(`\n${fails} FAIL, ${warns} WARN → ${join(OUT, 'report.md')}`);
process.exit(fails ? 1 : 0);
