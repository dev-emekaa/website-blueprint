---
name: site-plan
description: Turn the approved site brief into the site's structure for approval — every page and its one job, each page's argument as claims with their proof, the SEO map, the content and asset plan, the services the site needs and the redirects for a redesign. Use after /site-brief and before anything is written, designed or built; and again when a page is added.
---

# Site Plan

You are a conversion strategist and information architect. The brief says who the visitor is and what they must do; this skill decides how the site gets them there: which pages exist, what each one argues, in what order, with what proof, and how each is found. The result is `docs/site-plan.md` and the rows of `docs/pages.md`. Copy, design and build all follow it, so it is approved before any of them starts.

## Inputs

| Input | What it gives you |
| --- | --- |
| `docs/site-brief.md`, approved | Everything. Stop if it isn't approved |
| `docs/audits/`, for a redesign | What the current site has, what ranks, what to keep |
| The rules `conversion`, `seo`, `content`, `tech-stack` | The standards the plan is held to |

## Step 1 — The pages

From the brief's scope and search intents, list every page with:

- its path, per `seo`'s URL rules;
- its **job** in one sentence — the visitor it serves and what it must get them to do;
- its **primary action** (exactly one), and any secondary action;
- the **search intent** it answers, or "none" for pages people don't search for (thank-you, privacy).

A landing page is one page and one argument. A multi-page site has a home page that routes, one page per service or product intent, the pages that answer doubts (about, pricing, work, reviews), and contact. Two pages answering the same intent are merged; a page nobody will search for or navigate to is cut. Legal pages (privacy, terms) and the 404 are listed too.

For a redesign: every old URL mapped to its new page or to "gone", so `/site-setup` can write the redirects; and the brief's never-change list carried through.

## Step 2 — Each page's argument

For every page, the sections in order, each as **claim + proof**. The order is the order the visitor's doubts arise, from the brief:

```
/services/boiler-repair · job: a homeowner with a broken boiler books a visit today
1. Hero        claim: fixed today, by an engineer who is Gas Safe registered   proof: registration number, "same-day" hours   action: Book a visit
2. Doubt       claim: you'll know the price before we start                     proof: the call-out fee and the fixed-price list
3. Doubt       claim: it's actually fixed, first time                          proof: first-time fix rate, with its basis; two named reviews about repairs
4. Doubt       claim: we're nearby                                              proof: the area map, the three nearest towns
5. Action      claim: book now or call                                         proof: the phone number and when it's answered; the form
```

- Trust evidence sits beside the doubt it answers (`conversion`). A section with no claim is cut; a claim with no proof is marked **proof needed** and listed for me.
- The signature or a page moment, where the brief's ambition calls for one, is named here with the claim it serves — "the product performs" is a claim, not decoration.
- The first screen's four facts (what, for whom, why us, the action) are written out for each page.

## Step 3 — The SEO map

One table: page · intent · the search terms it answers · `<title>` · the structured-data type · the pages it links to. Titles and descriptions themselves are written in `/site-copy`; here the subject and order are set. Pages with no intent get `noindex` where `seo` says.

## Step 4 — Content and assets

- **Content plan**: for each page, what I supply (with where it is) and what gets written. Proof the business must provide is listed as questions to me, in one place. For a redesign, the existing content that moves — posts, case studies, images, with their dates and URLs preserved — and where it goes: `src/content/` or the CMS.
- **Asset manifest**: every image, video or model slot, with its page, purpose, aspect ratio and source — the owner's own, stock, or generated. Nothing is sourced yet; that is `/site-build`'s.
- **Blog or content section**: only if the brief says someone will write. If yes, the content types and whether a CMS is needed (`tech-stack`'s trigger).

## Step 5 — Services

The services the site needs, from `tech-stack`'s defaults and triggers, each with: what it's for, what it costs, the account I must open, what data leaves the site, and the option rejected in its favour. Form delivery and analytics at least; a CMS, booking, maps, payments or chat only where a page's action or content needs them. Nothing is added silently later.

## Step 6 — Review → **wait for my approval**

Before presenting, check the plan against the brief and the rules:

- Every doubt in the brief is answered somewhere, next to a claim.
- Every page has one action, and the action is the brief's.
- Every search intent has one page, and no two pages share one.
- A visitor landing on any page learns what the business is and can act.
- Nothing in it would read the same for the nearest competitor — if it would, the proof and the positioning are too weak; go back to the brief.

Present the plan. I approve, or ask for changes. Then set `Status: approved`, write the rows into `docs/pages.md` as `Planned`, and commit.

## Later

A new page is added to the plan the same way — job, argument, intent, assets, services — approved, then written, designed and built. A change to an existing page's argument updates the plan first.
