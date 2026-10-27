# website-blueprint

**Build websites that inform and convert with Claude Code — fast, findable, accessible, and unmistakably the business's own.**

For landing pages, business and marketing sites, portfolios, nonprofits, events and a product's marketing site. The site is briefed and planned before a word is written, the words are written before a pixel is designed, every page is designed for your approval, and nothing goes live until it passes the checks for speed, search, accessibility and security. Nine Claude Code skills and the rules behind them, for Next.js on Vercel.

**Not for** the logged-in part of a product: anything with user accounts and their data belongs in the [Web App Blueprint](https://github.com/dev-emekaa/web-app-blueprint) and the [Backend Blueprint](https://github.com/dev-emekaa/backend-blueprint). A product gets both: its marketing site from this blueprint, its app from those, in separate repos.

```bash
npx github:dev-emekaa/website-blueprint init
```

---

## Install

Run it in your project root — an empty folder is fine; `/site-setup` creates the project. Nothing to install first — `npx` fetches this repo and runs it.

```bash
npx github:dev-emekaa/website-blueprint init [options]
```

| Option | Effect |
| --- | --- |
| `--personal` | Install skills to `~/.claude/skills` instead of the project |
| `--force` | Overwrite existing files. Default is to skip them |
| `--dry-run` | Show what would change, write nothing |

There is one stack — Next.js, TypeScript, Tailwind CSS, Vercel — so there is no `--stack` option. Whether the site is restrained or expressive is a decision in the brief, not an install flag. Re-running is safe: existing files are skipped and listed.

### What it writes

```
.claude/
  skills/        9 skills (site-audit includes its check script)
  rules/         13 rules
CLAUDE.md        documentation map · project configuration
docs/
  pages.md       the page tracker
  copy/  design/screens/  design/references/  audits/  infra/
.gitignore       docs/design/references/ and .checks/ added, so they are never committed
```

### After installing

1. Fill in what you can of the **project configuration** in `CLAUDE.md`. Anything you leave blank, the skill that needs it asks for once.
2. Run `/site-brief` and tell it what the site is for — a few sentences, an existing site's URL, or a Product Brief. It researches, asks once, and writes the brief for your approval.
3. Run `/site-plan`, then `/site-setup`, `/design-system` and `/site-copy`, then `/site-build` for the first page.

Commit `.claude/` with your project: cloud sessions and scheduled runs only read project skills. `--personal` is for throwaway work.

### Updating

```bash
npx github:dev-emekaa/website-blueprint init --force
```

- Skills and rules are overwritten, including any edits you made — run it on a clean working tree and read the diff before committing.
- `CLAUDE.md` and `docs/` are never overwritten: they hold your site's content.
- To pin a version: `npx github:dev-emekaa/website-blueprint#v1.0.0 init`. If an update doesn't seem to land: `npm cache clean --force`.

---

## How a site gets built

Each step needs the one before it; a skill whose inputs don't exist, or aren't approved, stops and says so.

```
/site-brief      who the visitor is, what they doubt, what they must do          → docs/site-brief.md
 └─ /site-plan   every page, its one action, its argument, the SEO map           → docs/site-plan.md
     ├─ /site-setup       the foundation, once                                   → the project
     │   └─ /design-system   the signature, the system, DESIGN.md                → DESIGN.md
     └─ /site-copy        every word, before any design                          → docs/copy/
         └─ /site-build   per page: design for approval → build → check          → Designed · Built · Checked
             └─ /site-launch   every check on production, domain, handover       → Live

/site-audit — any site, any time: measured, read, scored, with a fix list
/site-fix   — one issue at a time, docs and page together
```

Each page moves through `docs/pages.md`: Planned → Written → Designed → Built → Checked → Live.

**A redesign** starts with `/site-audit` on the current site (the brief runs it), keeps what works, maps every old URL, and cuts over only once the redirects are verified.

---

## The skills

### `/site-brief`
Understands the business and the visitor: researches the business, its competitors' sites and what people search for, then asks you once — in one batch with a default per question — and writes the brief: the visitor and their doubts, the proof, the one action and where leads go, the voice, the content that exists, the scope and the ambition. Takes a few sentences, an existing site, or a Product Brief from the Ideas Blueprint.
**Writes** `docs/site-brief.md`

### `/site-plan`
Turns the brief into the site's structure for your approval: every page and its one job and action, each page's argument as claims with their proof in the order the visitor's doubts arise, the SEO map, the content and asset plan, the services the site needs with their cost, and the redirects for a redesign.
**Writes** `docs/site-plan.md`, the rows of `docs/pages.md`

### `/site-setup`
The foundation, once: the Next.js project, the shell and section primitives, fonts and tokens, the metadata and structured-data helpers, sitemap and robots, the form pipeline with spam protection and delivery, analytics with consent, security headers, the `pnpm check` suite, CI and Vercel, and a guide to the steps only you can do.
**Writes** the foundation, `docs/infra/infra-setup.md`

### `/design-system`
How the site looks and moves: inventories what only this business has, researches the category's best sites, proposes a direction with one signature — checked against the AI-default tells and the competitor test — for your approval, then writes `DESIGN.md` and applies its tokens to the code.
**Writes** `DESIGN.md`

### `/site-copy`
Every word, before any design: per page, the headline within the budget that survives a phone, each section's claim and proof, the calls to action, the form labels, errors and confirmations, the meta title and description, the alt text — in the brand's voice, from the visitor's side, with real proof only. What you must supply is listed in one place.
**Writes** `docs/copy/`

### `/site-build`
One page, or a batch: designs it from its copy deck on the `/design` canvas for your approval, builds it as designed, places images (stock looked at before use, generated, or an exact prompt with a placeholder at final size), wires its metadata, structured data and analytics event, critiques it at five widths before you see it, and runs the checks.
**Writes** the pages, `docs/design/screens/`, `docs/design/images.md`

### `/site-launch`
Takes the site live: every check on every page against production, the forms delivering to the real destination, analytics firing, the domain, the redirects, Search Console and the sitemap, and the handover — what was written versus supplied, where every image came from, what to improve next.
**Writes** `docs/launch.md`

### `/site-audit`
Audits any site — this one or a URL: the bundled script measures each page at five widths (Lighthouse, axe, headers, metadata, structured data, links, small text, the first screen), you read the copy and screenshots for conversion, copy and design, and the report scores each area with a prioritised fix list naming the skill that fixes each item.
**Writes** `docs/audits/`

### `/site-fix`
Resolves one issue: reproduces it, classifies it (bug, design drift, copy, content, performance, accessibility, SEO, security), fixes it the cheapest right way, re-runs the checks it touches, and updates the doc it changed.
**Writes** the fix, the docs it changes

---

## The rules

Loaded by Claude Code at the start of every session — except `ci-cd.md`, which loads only when deploy files are touched.

| Rule | Covers |
| --- | --- |
| `documentation-conventions.md` | Where every doc lives, the page tracker and its statuses, names |
| `tech-stack.md` | The core stack; each extra tool with the trigger that earns it; the services and environments |
| `coding-standards.md` | Static by default, server first, content as data; structure, images, fonts, styling, motion, forms, metadata |
| `design.md` | One signature, a system with character, moments where earned; the hero, type, colour, layout, images, motion; expressive sites; the tells |
| `content.md` | Copy and microcopy: the visitor's words, headlines within budget, calls to action, real proof, errors, 404, meta copy |
| `conversion.md` | One action per page, the first screen's four facts, proof beside doubt, forms, pricing, landing pages |
| `seo.md` | One intent per page, metadata, structured data by page type, sitemap, redirects, local businesses, after launch |
| `performance.md` | The budgets (LCP, INP, CLS, Lighthouse 90, JS and weight), static first, images, fonts, scripts, stability |
| `accessibility.md` | WCAG 2.2 AA made concrete: structure, contrast, keyboard and focus, controls, forms, media, motion, how it's checked |
| `security.md` | Headers and CSP, forms under abuse, visitors' data and consent, secrets, dependencies, deployment |
| `analytics.md` | The action counted, privately: provider, events, naming, what the owner sees |
| `testing.md` | What "checked" means: the `pnpm check` gates and the checks by hand |
| `ci-cd.md` | Previews with the full checks, `main` is production, rollback is a redeploy, the redesign cut-over |

---

## The folder version

A downloadable alternative to the installer, built from the same files:

```bash
npm run package
```

It writes `dist/website-blueprint/` and `dist/website-blueprint-v{version}.zip`. Its guide is `folder/README.md`.

### Releasing

```bash
npm version patch        # bumps package.json, commits and tags (patch · minor · major)
git push --follow-tags   # pushes the commit and the tag
```

The zip appears under the release's **Assets** as `website-blueprint-v{version}.zip` — that is the file to share, not the Source code archives. A tag that doesn't match `package.json` fails the build.

---

## Requires

- Node 22 or later, and Claude Code
- For the `/design` canvas: Claude Code 2.1.234 or later on a paid Claude plan (it is a research preview) — without it, `/design-system` and `/site-build` work as HTML prototypes instead
- Optional, for design research: Mobbin, connected through its MCP. Without it, the design skills research on the web, plus any screenshots you put in `docs/design/references/`
- For the audit script: Playwright, axe and Lighthouse — the project has them; outside a project the script installs them once

**License** proprietary — all rights reserved.
