---
name: site-adopt
description: Bring an existing website codebase under this blueprint — one built before it, or that I have just joined. Inventories the code, decides whether the stack fits, reconstructs the docs the other skills read (the brief from the live site, the plan from the pages, the copy decks from the live copy, DESIGN.md from the tokens in use, the page tracker) with each fact citing its source, and lists where the site departs from the rules as issues. Use once, on a site the blueprint didn't start; changes no code. For a site you will rebuild rather than keep, use /site-brief with its URL instead.
---

# Site Adopt

You are a senior engineer taking over a website nobody documented the way this blueprint expects. The other skills assume a site they started: a brief, a plan, copy decks, a design system, a tracker. This skill gives an existing site those, from its code and its live pages, so every later skill reads it exactly as it reads a site built here.

This is for a site that stays as it is and is improved from here. A site to be redesigned starts with `/site-brief` and its URL, which runs the audit and records what to keep; `/site-plan` then maps every old URL.

Two rules hold throughout. **Nothing is invented:** every reconstructed fact cites the code or the page it was read from. **Nothing in the code changes:** what the site does wrong becomes an issue, never a fix made here.

## Read first

`CLAUDE.md` if it exists, and the rules: `documentation-conventions`, `tech-stack`, `coding-standards`, `conversion`, `content`, `seo`, `performance`, `accessibility`, `security`.

## Step 1 — Inventory → **wait for my approval**

Run `/site-audit` on the live site first — with `--pages N` if it has more than 25 — and read the repository. Open every page at phone and desktop widths; never summarise a page you have not opened. Present:

- **Stack and shape:** framework and libraries with versions, how it runs, builds and deploys, where content lives (in the code, MDX, a CMS), the forms and where submissions go, analytics, the services in use.
- **What exists:** every page and its apparent job, the shared sections and components, the tokens or theme in use, the images and where they came from.
- **What is written down:** any brief, brand guide, docs or design files, and how far each matches the site.
- **How it is run:** tests or checks present or not, CI, environment validation, error tracking.
- **The audit's scores** and its top findings.
- **The brief's questions** — what the site can't tell: the voice, the ambition, where leads go, what people search for — asked here in one batch, with `/site-brief`'s research steps run as that skill describes.

Then the **stack verdict**, from `tech-stack` and `coding-standards`:

- **Same stack** — Next.js with the App Router under `src/`, static pages, Tailwind, pnpm, on Vercel: every skill applies.
- **Different stack** — anything else, a Next.js site in another shape included (Pages Router, pages rendered per request, no Tailwind, another host): the documentation skills still apply — `/site-brief`, `/site-plan`, `/site-copy`, `/design-system` and `/site-audit` are written for any site — but `/site-setup`, `/site-build`, `/site-launch` and `/site-fix` would write the wrong stack and are **off**. `/design-system` there writes and lints `DESIGN.md` and skips applying the tokens. A rebuild on the blueprint's stack goes through `/site-brief` as a redesign. Say which skills are on and off, and why.

I approve the inventory, the answers and the verdict, or correct them. Nothing but the audit's report is written before that.

## Step 2 — Reconstruct the docs

Each document is written to the format of the skill that owns it — with one addition: the line `Reverse-engineered from the site on {date} — verify` at the top of the body (after the YAML front matter in `DESIGN.md`), and a `source:` citation (a file and line, or a page URL) on every claim, section, token and tracker row — as a YAML comment beside each token in `DESIGN.md`. Marker and citations both come off when I approve the document in Step 4; the report keeps what each document was read from.

1. **The brief** — `docs/site-brief.md` in `/site-brief`'s form, from what the site says about the business, its visitor, its action and its proof, and from my Step 1 answers for the rest.
2. **The plan** — `docs/site-plan.md` in `/site-plan`'s form: every page with its job and primary action as built, each page's sections as the argument they make today (claims with their proof, or **proof needed**, the plan's own marker, so `/site-copy` lists it), the SEO map as the metadata and structured data stand, the services in use.
3. **The copy decks** — `docs/copy/{page}.md` and `shared.md` in `/site-copy`'s form, word for word: the rendered page for what it shows, the code for the states it shows only on interaction (errors, confirmations, the 404, consent), each cited, with the character counts that skill records.
4. **`DESIGN.md`** — in the format `/design-system` uses, from the tokens, type, spacing, components and motion the code actually has. Where the code has no decision, the section says so; `/design-system` can be run later to decide it. Lint it as that skill does.
5. **The baseline** — the audit's full-page screenshots of each page at each width, copied into `docs/design/screens/{page}/` as `as-adopted-{narrow|phone|tablet|desktop|wide}.png`. They are what `/site-fix` compares against and `/site-build` redesigns from, not a judgement of the design; a page redesigned through `/site-build` replaces them with its exports.
6. **The tracker** — `docs/pages.md`, every live page `Live` with the date adopted; a page that exists in code but isn't reachable is noted.
7. **Analytics events** — `docs/analytics-events.md` from the events the code fires, where analytics exist.

Work one page at a time, in the plan's order.

## Step 3 — Gaps and deviations

Two lists, with nothing changed:

- **Foundation gaps** — what `/site-setup` gives a new site and this one lacks: the metadata and structured-data helpers, sitemap and robots, the form pipeline with spam protection, analytics with consent, security headers, the `pnpm check` suite, the pipelines, the infra guide.
- **Deviations** — the audit's findings, plus where the code departs from `coding-standards`, `performance`, `accessibility`, `seo` and `security`, and where the copy and the pages fail `content` and `conversion`. Each finding: source, the rule it fails, severity, the fix.

Route each item on the same stack: a **`/site-setup` item** for a foundation gap — that skill takes stock of existing code and adds only what is missing; a **`/site-fix` item** for one change; a **`/site-copy` rewrite** for a page whose words fail; a **`/site-build` redesign** for a page whose design fails; a **design-system change** when the system itself is the problem — raised as `/design-system` → Later describes: planned as its own work that touches every page using the value, approved by me, then run through `/design-system` and `/site-build` for each page. On a stack the build skills are off for, the lists name no skill: they are findings for me, or for the brief of a rebuild.

## Step 4 — Approve, per page → **wait for my approval**

Present each page's reconstructed deck, plan entry and tracker row with their citations, shortest page first, then the brief and `DESIGN.md`, then the two lists. I confirm each document is true or correct it; marker and citations come off each approved document, and `Status: approved` with the date goes on, as its owning skill would set it — the brief, the plan, each deck and `DESIGN.md`. The lists are findings for the skills named in Step 3 to take from the report.

## Step 5 — Record

1. `CLAUDE.md`: the project configuration from the inventory and the brief — the **Stack** row with the verdict after it, `{what it is} — {blueprint's stack: all skills apply | not the blueprint's: documentation skills only; see docs/adoption-report.md}`; **Production status** as `live before adoption, {date}`; **Design system** as `DESIGN.md reconstructed {date}`; the commands and URLs; a row for `docs/adoption-report.md` in the documentation map. On a different stack, a note that `coding-standards` and `tech-stack` describe the blueprint's stack, not this code.
2. **`docs/adoption-report.md`:** the inventory, the verdict, what was written and from where (each document's citations), the audit's scores, the foundation gaps, the deviations with their routing, and what I should still verify by hand. Dated.
3. Commit the docs and the report.

## Report

A few lines: what the site is, which skills are on, how many pages were documented, the audit's scores, how many issues, and the next step — `/site-setup` for the foundation gaps, then `/site-fix` on the first issue, or `/site-copy` for the page whose words matter most; where the build skills are off, the report's lists, for me or for a rebuild's brief. From here the site is run like any other.

## Rules

- No code changes, no refactors, no "while I'm here". A deviation is a finding.
- No doc says what the site doesn't do. A decision the site doesn't carry — the voice, the ambition, a design rule — is asked, or left for the skill that owns it.
- Existing docs are inputs, not truth: the live site wins, and the disagreement is noted.
