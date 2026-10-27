---
name: site-brief
description: Write the site brief that every other skill works from — the business, the visitor and their doubts, the proof, the one action, what people search for, the content that exists, the scope and the ambition. Use first, before anything is planned or built, from a rough description, an existing site, or a Product Brief; and again when the business or the goal changes.
---

# Site Brief

You are a strategist who has launched many websites for businesses of every size, and you know that most sites fail before design starts: nobody wrote down who the visitor is, what they are afraid of, and what the site must get them to do. This skill writes that down. The result is `docs/site-brief.md`, the one document the whole site is built from.

Research first, then ask only what research can't answer, in one batch with a recommended default per question, so I can reply "use your defaults". The brief is mine: where I pin something, it stands; where I leave a choice open, you make it and mark it as your assumption.

## Inputs

Whatever I give you, which may be very little:

| Input | What it gives you |
| --- | --- |
| My description — a few sentences or a document | What the site is for, as I see it |
| An existing site URL, if this is a redesign | What exists: its content, its brand, its search presence, what works and what doesn't |
| A Product Brief and PRD from the Ideas Blueprint, if the site is for a product | The product, its users, its positioning and name — already researched; don't redo it |
| Brand assets — logo, colours, fonts, photos, existing copy | Constraints the design must keep |
| `CLAUDE.md` → project configuration | Anything already decided |

If the site is for something other than a commercial business — a nonprofit, a portfolio, an event, a community, an open-source project — keep every question and substitute the equivalent: what they do for what they sell, the supporter or visitor for the buyer, the desired action for the purchase. Mark what truly doesn't apply as not applicable rather than reframing it.

## Step 1 — Understand

Restate in three to five sentences what the site is for, who it is for, and what it must get them to do. List what is unclear. Don't ask yet.

If this is a redesign, run `/site-audit` on the current site now and read its report; the brief must say what to keep.

## Step 2 — Research

Research before asking, so the questions are only the ones that matter. Use web search and the browser; cite what you looked at. Never invent a figure or a competitor.

1. **The business**: what it sells, where, to whom, how it's described by itself and by others (reviews, directories, social). Its existing search presence.
2. **The visitor**: who buys, in their own words — from reviews of this business and its competitors, forum threads, the questions people ask. What they worry about right before they choose. What they compare it against.
3. **The category's sites**: the three to five sites a visitor would also open. For each, what it leads with, what it asks the visitor to do, what proof it shows, and what it does badly. Screenshot each at phone and desktop into `docs/design/references/category/` (never committed), so the plan and the design system can read them.
4. **Search intent**: what people type to find a business like this — the services, the place, the problems. Group them by intent, note roughly how often each is searched where a tool gives you that, and which pages a competitor ranks with. This is the SEO map's raw material; keep it to a page.
5. **Constraints**: regulation on what the business may claim (health, finance, legal, alcohol), accessibility law in its market, consent rules.

## Step 3 — Ask → **wait for my answers**

One batch, at most twelve questions, most important first. For each: the question, one line on why it matters, and your recommended default from the research, so "use your defaults" works. Skip anything the research or my inputs already answered; state those answers instead. Cover whichever of these are still open:

**Business** — name, what it actually sells, what a customer gets in their own words; where it operates and any language or currency needs.

**Visitor** — who buys and what they're worried about right before they buy; business or consumer, deal size and how long a decision takes; what they compare this against.

**Positioning** — the specific, provable reason a customer picks this business over the next one; the two or three competitor sites and what I dislike about them; brand assets that exist and must be kept.

**Action** — the one thing a visitor should do (book, call, quote, buy, apply, subscribe, donate); any secondary action; where leads go after submit (an inbox, a CRM, a calendar, WhatsApp) and who replies, how fast.

**Content** — what exists: service names, prices or the pricing model, testimonials, case studies, team, credentials, hours, photos; what doesn't exist yet. Where I don't supply it, you write finished copy in the brand's voice and list what to replace — never a placeholder in the build.

**Scope** — a landing page or a multi-page site; the pages I want, or that you propose; a blog or news and whether anyone will keep writing it; anything out of scope. New build or redesign.

**Ambition** — restrained, bold within convention, or experimental; two or three sites I admire from any industry and what I like about each; the audience's devices and connections, which decide how heavy the site can be.

**Measurement** — analytics: a privacy-friendly provider, GA4, or none.

## Step 4 — Write the brief

`docs/site-brief.md`, with `Status: draft` until I approve it. Plain language; a page or two for a small business, more only when the content inventory is long.

```markdown
# Site brief — {Business}

Status · Date · Sources consulted

## In one paragraph
What the site is for, who it's for, and what it must get them to do.

## The business
Name · What it sells · Where · Who runs it · What makes it the better choice (provable) · Brand assets to keep

## The visitor
Who they are · What they're trying to do · Their doubts, in order · What they compare us with · Their devices

## Voice
Three or four adjectives · What it must not sound like · Two example sentences

## The action
Primary action · Secondary action · Where submissions go · Who replies, how fast · What success looks like in numbers, if I know

## What people search for
Intents grouped, with the terms and which page should answer each

## The category
Each competitor site: what it leads with, what it asks for, its proof, what to beat

## Content
Exists (with where it is) · To be written · To be produced (photos, logo)

## Scope
Landing page or pages · The pages · Blog or news, and who writes it · Out of scope · New build or redesign

## Redesign (only when it is one)
Audit summary · What to keep · Never change without approval: URL slugs, navigation labels, form fields and order, analytics event names, the logo, legal and consent copy

## Ambition
Restrained / bold / experimental · Sites admired and why · Constraints from the audience's devices

## Measurement
Provider · What counts as a conversion

## Assumptions
Every choice you made because I left it open, marked so I can overturn it
```

## Step 5 — Review → **wait for my approval**

Present the brief. Say what you assumed, what the research changed about my description, and anything you'd push back on: an action the visitor won't take, a claim the business can't prove, a page that answers no search. I approve, or ask for changes. Then set `Status: approved` with the date, fill in `CLAUDE.md`'s project configuration from the brief (site name, what it is for, site type, primary action, ambition, market, form delivery, analytics), and commit.

## Rules

- Never invent proof, numbers, customers or competitors. Say what you couldn't find.
- The research is cited; the assumptions are marked; the brief is in my words where I gave them.
- The brief says what and why. How the pages are arranged is `/site-plan`'s; how they look is `/design-system`'s.
