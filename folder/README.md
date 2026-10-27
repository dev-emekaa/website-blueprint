# Website Blueprint

Build websites that inform and convert with Claude Code — fast, findable, accessible, and unmistakably the business's own. For landing pages, business and marketing sites, portfolios, nonprofits, events and a product's marketing site. The site is briefed and planned before a word is written, the words before a pixel is designed, every page designed for your approval, and nothing goes live until it passes the checks for speed, search, accessibility and security. Nine skills and the rules behind them, for Next.js · TypeScript · Tailwind CSS, hosted on Vercel.

It is not for the logged-in part of a product; that is the **Web App Blueprint** and the **Backend Blueprint**. A product gets both: its marketing site from this one, its app from those.

---

## What's inside

```
website-blueprint/
  skills/                9 skills, one folder each (site-audit includes its check script)
  rules/                 the 13 rules every project uses
  templates/
    CLAUDE.md            the blocks to add to your project's CLAUDE.md
    docs/pages.md        the page tracker
```

---

## Install

Everything goes into your project's `.claude/` folder, which Claude Code reads. In a terminal, from your project's root — an empty folder is fine — set `BP` to wherever you unzipped this folder:

```bash
BP=~/Downloads/website-blueprint
mkdir -p .claude/rules docs/copy docs/design/screens docs/design/references docs/audits docs/infra
cp -R "$BP/skills" .claude/
cp "$BP"/rules/*.md .claude/rules/
cp "$BP/templates/docs/pages.md" docs/
```

Then:

1. **Add the CLAUDE.md blocks.** Paste `templates/CLAUDE.md` into your project's `CLAUDE.md` (create the file if there is none). Fill in what you can of the project configuration; anything you leave blank, the skill that needs it asks for once.
2. **Keep two folders out of git.** Add `docs/design/references/` (your reference screenshots) and `.checks/` (the check script's output) to `.gitignore`.
3. **Check it worked.** Start Claude Code and run `/context` — the rules appear under Memory files (`ci-cd.md` only once a deploy file is touched). Type `/` and the nine skills are listed.

> `.claude` is a hidden folder. To see it in Finder, press **Cmd + Shift + .**

**Commit `.claude/` with your project.** Cloud sessions and scheduled runs only read project skills, and the rules should travel with the code.

---

## Which skill when

**Building a new site**

1. `/site-brief` — tell it what the site is for: a few sentences, an existing site's URL, or a Product Brief. It researches, asks you once, and writes the brief for your approval.
2. `/site-plan` — every page, its one action, its argument, the SEO map, the services. For your approval.
3. `/site-setup` — the foundation, once.
4. `/design-system` — the signature and the system, for your approval; writes `DESIGN.md`.
5. `/site-copy` — every word of every page, for your approval, before any design.
6. `/site-build` — one page at a time: designed on the canvas for your approval, built, checked. The home page first.
7. `/site-launch` — everything checked on production, the domain, Search Console, the handover.

**Redesigning an existing site**

Start with `/site-brief` and give it the URL. It runs `/site-audit` first, records what to keep and what must not change, and the plan maps every old URL. The rest is the same; the launch verifies the redirects before cut-over.

**Afterwards**

- `/site-audit` — on this site after launch and on a schedule, or on any other site you're asked to look at. A scored report with a fix list.
- `/site-fix` — one issue at a time: a bug, a copy change, a new testimonial, a slow page, an audit item.
- A new page: `/site-plan` adds it, then `/site-copy` and `/site-build` for that page.

---

## The skills

**`/site-brief`** — Writes the brief every other skill works from: the business, the visitor and their doubts, the proof, the one action and where leads go, the voice, what people search for, the content that exists, the scope, the ambition. Researches first, asks once.

**`/site-plan`** — Turns the brief into the structure: every page with its job and its one action, each page's argument as claims with their proof, the SEO map, the content and asset plan, the services with their cost, the redirects for a redesign.

**`/site-setup`** — Builds the foundation: the Next.js project, the shell and section primitives, fonts and tokens, metadata and structured-data helpers, the form pipeline with spam protection and delivery, analytics with consent, security headers, the `pnpm check` suite, CI and Vercel, and the guide to the steps only you can do.

**`/design-system`** — Writes `DESIGN.md`: an inventory of what only this business has, research of the category's best sites — on Mobbin when it's connected, otherwise on the web, plus any screenshots you add — then a direction with one signature, checked against the AI-default tells and the competitor test, for your approval.

**`/site-copy`** — Every word before any design: headlines that survive a phone, each section's claim and proof, calls to action that say what happens, form labels, errors and confirmations, meta titles and descriptions, alt text. In the brand's voice, with real proof only.

**`/site-build`** — Designs a page from its copy deck on the `/design` canvas for your approval, builds it as designed, sources its images, wires its metadata, structured data and analytics event, critiques it at four widths, and runs the checks.

**`/site-launch`** — Every check on every page against production, forms to the real destination, analytics firing, the domain and redirects, Search Console, and a handover that says what was written versus supplied and what to improve next.

**`/site-audit`** — Audits any site: the bundled script measures every page at five widths; you read the copy and screenshots; the report scores each area and lists the fixes in order, each naming the skill that does it.

**`/site-fix`** — Resolves one issue: reproduce, classify, the cheapest right fix, the checks re-run, the docs updated.

---

## The rules

Loaded at the start of every session, except `ci-cd.md`, which loads only when a deploy file is touched.

- **`documentation-conventions.md`** — where every doc lives, the page tracker and its statuses.
- **`tech-stack.md`** — the stack, each extra tool with the trigger that earns it, the services and environments.
- **`coding-standards.md`** — static by default, server first, content as data; structure, images, fonts, styling, motion, forms, metadata.
- **`design.md`** — one signature, a system with character, moments where earned; type, colour, layout, images, motion; expressive sites; the tells.
- **`content.md`** — copy and microcopy that build trust and remove friction.
- **`conversion.md`** — one action per page, proof beside doubt, forms, pricing, landing pages.
- **`seo.md`** — one intent per page, metadata, structured data, sitemap, redirects, local businesses.
- **`performance.md`** — the budgets and how pages stay inside them.
- **`accessibility.md`** — WCAG 2.2 AA made concrete, and how it's checked.
- **`security.md`** — headers, forms under abuse, visitors' data, secrets, dependencies.
- **`analytics.md`** — the action counted, privately.
- **`testing.md`** — what "checked" means.
- **`ci-cd.md`** — previews with the full checks, `main` is production, the redesign cut-over.

---

**Requires** Claude Code and Node 22 or later. The `/design` canvas needs Claude Code 2.1.234 or later on a paid Claude plan (it is a research preview); without it the design skills work as HTML prototypes. Mobbin is optional. The audit script needs Playwright, axe and Lighthouse — the project has them, and outside a project the script installs them once. Updates replace these files — any edits you made to a skill or rule are overwritten, so keep your own changes in `CLAUDE.md` or new rule files.

© dev-emeka. All rights reserved. Licensed for use in your own projects; not for redistribution.
