---
name: site-audit
description: Audit any website — this project's or a URL — across design, copy and conversion, SEO, performance, accessibility, security and measurement, by measuring the rendered pages with the bundled check script and reading the copy and screenshots yourself, then writing a scored report with a prioritised fix list where each item names the skill that fixes it. Use on a redesign candidate, a prospect's site, after launch, and on a schedule.
---

# Site Audit

You are a senior reviewer who judges a website the way its visitors and search engines meet it: by rendering it, reading it and measuring it, not by reading its code. The result is a report the owner can act on, in `docs/audits/{date}-{host}.md`: a score per area, what is wrong, why it costs them, and the fix in priority order.

Evidence, not taste. Every finding points at a page, an element or a measurement, and says what to do. "Not checked" is a status, never a finding.

## Inputs

| Input | What it gives you |
| --- | --- |
| The URL, or this project's production or preview URL | What to audit |
| `docs/site-brief.md` and `docs/site-plan.md`, when auditing this project | The visitor, the action, the argument each page should make, the SEO map — so the audit judges against intent, not generic goals |
| The rules | `conversion`, `content`, `design`, `seo`, `performance`, `accessibility`, `security`, `analytics` — the standards |
| `docs/audits/`, if an earlier audit exists | What changed since |

For a site without a brief (a prospect's, a redesign candidate), first write down in a few lines what the site appears to be for, who the visitor is, and what action it wants — the audit judges it against that, and says so.

## Step 1 — Measure

Run the bundled script against the site. From the project root (with `--personal` installs, the script is under `~/.claude/skills/` instead):

```bash
node .claude/skills/site-audit/scripts/check.mjs https://example.com
```

It renders each page (the URL, then the sitemap's pages or the links from the home page, up to 25 — `--pages N` to change, `--only-url` for one page) at 320, 390, 768, 1280 and 1920px, and writes to `.checks/{host}/{date}/`: `report.md` and `report.json` with the measurements and findings, `screens/` with a full-page screenshot per page and width, and `copy/` with each page's text. It needs Playwright, axe and Lighthouse; it uses copies it can resolve from the current folder, otherwise it installs them once into `~/.cache/site-check/`. `--no-lighthouse` skips the slow part for a quick pass; `--strict` turns the budget, header and metadata warnings into failures, which is how `pnpm check` runs it; `--redirects FILE` verifies a redesign's old URLs. The plain run is lenient by design: an audit of someone else's site will usually show many warnings, and the report, not the count, is the judgement.

It measures what can be measured: response and security headers; Lighthouse at mobile settings (three runs, the median); axe at phone and desktop; reflow; the `h1` and whether it fits two lines on a phone; title, description, canonical, Open Graph, language, structured data; fonts, small text, images without alt or size, fields with no label; the skip link; a visible action in the first screen on a phone; broken links and images, including the Open Graph image. Read `report.md` first.

## Step 2 — Look and read

The script can't judge design, copy or persuasion. You do, from `screens/` and `copy/`, page by page, phone first:

- **The first screen.** In one second: what is this, for whom, why them, what do I do? Which of the four is missing? Is the action visible? Is the headline readable in two lines?
- **The argument.** Walk the sections in order. Does each make a claim and prove it? Is the proof next to the doubt or quarantined at the bottom? Where does the visitor's next doubt go unanswered? Would this page read the same on the nearest competitor's site?
- **The copy.** The `content` rule as a checklist: the visitor's words or the company's; specific or vague; proof real or generic; CTAs that say what happens; banned words; reading level; voice consistent across pages; microcopy on the forms and the 404.
- **The design.** The `design` rule: margins, rhythm, hierarchy, one signature or many competing effects, the tells it carries, type and colour decisions or defaults, images that look chosen or stock-generic, motion that serves or performs. Squint at each screenshot: two or three masses, or noise?
- **The action.** Find the form or the contact path. How many fields? What happens after submit, and does the page say? Is contact within two clicks from every page?
- **By hand, in the browser** where you have one: a keyboard pass on the home page and the form; reduced motion; a real phone or an emulated one for the hero and the form.

For a redesign candidate also record what works and must be kept: the pages that rank, the brand elements people know, the conversion paths that already work.

## Step 3 — Score and rank

Score each area 0–10 against its rule, with the one sentence that justifies it:

| Area | What the score reflects |
| --- | --- |
| Conversion | The first screen, one action per page, proof beside doubt, the form, contact within reach |
| Copy | Clarity, the visitor's perspective, real proof, voice, microcopy |
| Design | Distinctiveness and discipline: the system, the signature, the tells, hierarchy, responsiveness |
| SEO | Intent per page, metadata, structured data, sitemap, links, indexing |
| Performance | The Core Web Vitals and budgets, images, fonts, scripts |
| Accessibility | WCAG 2.2 AA: the script's violations plus the keyboard and reading pass |
| Security | Headers, HTTPS, forms, third-party scripts, privacy page vs. services loaded |
| Measurement | Whether the action is counted, and privately |

Then one ranked fix list, severity first and reach second: a problem on every page outranks one on a single page; a broken form outranks a long title. One row per root cause with every location, not one per occurrence. Each row: the finding, the evidence (page, screenshot, measurement), the cost to the owner in plain words, the fix, and the skill that does it (`/site-fix` for most; `/site-copy` for a rewrite; `/site-build` for a redesigned page; `/design-system` for the system; `/site-plan` for structure).

## Step 4 — Write the report

`docs/audits/{yyyy-mm-dd}-{host}.md`:

```markdown
# Audit — example.com · 2026-10-27

## In one paragraph
What the site is for, how well it does it, the three things that would change the result most.

## Scores
| Area | Score | Why |

## Fix list, in order
| # | Finding | Where | Cost to you | Fix | Skill |

## What works
Keep these.

## Per page
/ · /services · … — the first-screen verdict, the argument's gaps, the measurements

## Not checked
What the audit could not cover and why (a login, a form that would send a real enquiry, a site behind a consent wall).

## Method
The script's run, the pages covered, the dates, the tools' versions.
```

Plain language throughout: the owner may not be technical. A finding says what a visitor experiences, then the technical cause.

## Step 5 — Report

Present the paragraph, the scores and the top five fixes. For this project, offer to start `/site-fix` on the first; for a redesign, say what the brief must keep; for a prospect, say what a rebuild would change. Don't fix anything in this run.
