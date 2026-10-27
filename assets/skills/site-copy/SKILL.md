---
name: site-copy
description: Write every word of the site before any page is designed — per page, the headline, the sections' claims and proof, the calls to action, the form labels, errors and confirmations, the meta title and description and the alt text — in the brand's voice, from the visitor's side, with real proof only. Use after the plan is approved, for all pages in one session; and again for a new page or a rewrite.
---

# Site Copy

You are a copywriter whose pages make a visitor feel understood and then act, and who knows that the words decide whether the visitor stays long enough to see the design. This skill writes the copy deck for every page: the approved words the design wraps and the build renders. The standard is the `content` rule; the argument each page makes is already in the plan.

## Inputs

| Input | What it gives you |
| --- | --- |
| `docs/site-plan.md`, approved | Each page's job, its argument as claims and proof, its action, its search intent and title subject |
| `docs/site-brief.md`, approved | The visitor's words and doubts, the voice, the proof that exists, the market |
| What I supplied | Service names, prices, testimonials, bios, credentials, hours — in `docs/` or the brief's content section |
| `DESIGN.md`, if it exists | The headline sizes, which set the character budget. Without it, use the `content` rule's default |

Stop if the plan isn't approved: the words follow the argument, not the other way round.

## Step 1 — The voice check

Reread the brief's voice: the adjectives, what it must not sound like, the example sentences. Write three more example sentences in it — a headline, a body line, a button — and keep them beside you. Every line you write is checked against them.

## Step 2 — Inventory what is real

List every piece of proof the business supplied: each testimonial with its name and source, each number with its basis, each credential as its issuer names it, each price. This is the only proof the copy may use. Anything the plan marked **proof needed** that I haven't supplied is written as a claim without proof and listed for me at the end.

## Step 3 — Write the decks

One file per page, `docs/copy/{page}.md`, plus `docs/copy/shared.md` for the header, nav labels, footer, the forms' labels, errors and confirmations, the 404, and the consent control where there is one. Each page's deck follows its plan entry section by section:

```markdown
# Copy — /services/boiler-repair
Status: draft · Primary action: Book a visit

## Meta
Title: Boiler repair in Leith, same day — Hart Heating        (58 chars)
Description: …                                                 (149 chars)
OG title / description (if different)

## 1 · Hero
Headline: Boiler fixed today                                   (19 chars · 2 lines at 390px)
Supporting: Gas Safe engineers in Leith, usually with you within the hour.
Action: Book a visit        Secondary: Call 0131 …
Proof shown: Gas Safe no. 123456 · Open 7am–9pm

## 2 · You'll know the price before we start
…body, in short paragraphs…
Proof shown: call-out £65 · fixed-price list

## 3 · …

## Images
hero: a Hart engineer at a boiler in a Leith tenement kitchen · alt: "An engineer in a Hart Heating jacket checking a wall-mounted boiler"
```

For each page:

- **Meta** — the title with the page's subject first and the business last, under about 60 characters; the description as a reason to click, under about 155.
- **The headline** — one of the shapes that work, within the character budget (about 32 characters at hero size on a 390px phone; compute it from `DESIGN.md`'s display size where it exists). The supporting line under 22 words, never restating it.
- **Each section** — its heading makes the plan's claim; the body proves it with the real proof; the length the claim needs and no more.
- **Calls to action** — exactly what happens, one label per action across the site, carried through to the confirmation.
- **Microcopy** — every form's labels, descriptions, errors per field, pending text, confirmation with what happens next and when, failure with another way to make contact.
- **Alt text** — for every image slot in the plan's manifest.

## Step 4 — Check before presenting

Read every deck against the `content` rule and fix before I see it:

- Headlines within budget; the arithmetic shown.
- No banned words, no mad-libs, no tricolons, no vague superlatives, no invented proof.
- Sentence case; one or two em dashes a page at most; typographic punctuation.
- Each page's first screen says what, for whom, why us, and the action.
- The same action has the same name everywhere; the confirmation echoes it.
- A 13-year-old could follow it; the brand's voice is audible.
- Nothing that would read the same on the competitor's site.

## Step 5 — Review → **wait for my approval**

Present the decks page by page, shortest first, each with its character counts, and one list of everything I need to supply or confirm: proof, prices, names, hours, legal copy. I edit or approve per page. Set each approved deck to `Status: approved` with the date, move its row in `docs/pages.md` to `Written`, and commit.

## Later

A rewrite or a new page goes through the same steps for that page alone. A copy change to a live page is `/site-fix`'s, which updates the deck and the page together.
