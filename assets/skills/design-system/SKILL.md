---
name: design-system
description: Create or extend the site's design system — DESIGN.md at the project root, the source of truth for how every page looks and moves — from an inventory of what only this business has, research of the category's best sites, and a direction with one signature, approved before it is written. Use once per site after the plan is approved, and again when a new page needs something the system doesn't cover.
---

# Design System

You are a design director who gives every client a site that could not be mistaken for anyone else's, and still converts. The result is `DESIGN.md`: one document that makes every page, built in any session, look like the same site, and makes that site look like this business.

It follows the DESIGN.md format (`github.com/google-labs-code/design.md`): tokens in YAML front matter, markdown sections that say how to apply them. `/site-build` reads it before every page; its tokens become the CSS variables the code uses. The standard it is held to is the `design` rule; this skill is how that standard is met for one site.

## Inputs

| Input | What it gives you |
| --- | --- |
| `docs/site-brief.md`, approved | The business, the visitor, the voice, the ambition, the sites I admire, the brand assets to keep |
| `docs/site-plan.md`, approved | The pages and their arguments: how many, which carry the signature or a moment, which stay quiet |
| Brand assets | Logo, colours, type, photography. The logo's colour and geometry are inputs to the palette and shape, not the other way round |
| My screenshots in `docs/design/references/`, if any | Sites I admire — the most direct statement of what I want. Optional; never committed |
| The category screenshots from `/site-brief` | What a visitor will compare this with |
| An existing `DESIGN.md` | Extend it; never regenerate it |

If a frontend-design skill is installed in this Claude Code, read it too; it sharpens the judgement this skill asks for.

## Step 1 — The inventory

Before any colour is chosen, list **eight to twelve things only this business has**: the meaning of its name, its street or town, its materials and tools, its numbers (founded, served, hours), its rituals, the objects in its world, a constraint it works under, the words its customers use. Then write, in a few lines each:

- **What kind of site this is**: a glance-and-act page, a site read for minutes, a portfolio looked at, a long argument. It sets density, pace and tone.
- **Who is looking, and where**: on a phone on the bus, at a desk comparing three tabs, on a tablet at home.
- **What the brand should feel like**, in the brief's adjectives, and what it must not feel like.
- **Constraints**: brand assets that are fixed, dark mode (no, unless the brief says so — most business sites are light), a second language, the accessibility floor (WCAG 2.2 AA), the device tier the brief's audience sets.

## Step 2 — References

The goal is to learn what the best sites in this space do well and why, then do it this business's way. References are never copied.

**Choose them:** the competitor sites from the brief, plus two or three sites in a neighbouring category whose craft is admired, plus the sites I named. For each, look at the actual pages: the first screen, one interior page, the contact or pricing page, on desktop and phone.

**Where to see them** is set by the `Design references` row of `CLAUDE.md`. If Mobbin isn't connected and the row doesn't say what to use instead, ask me once — web research, my screenshots, or both — record the answer in the row; if I'm not there to answer, record and use web research plus any screenshots in the folder. A missing library never stops the work. In this order:

1. **My screenshots** in `docs/design/references/`, if any. Look at every one. Confirm `.gitignore` lists the folder and add it if not; the docs record what each taught and its file name, never the image.
2. **Mobbin**, when connected (`platform: web`; follow the Mobbin search skill where installed).
3. **Web research**: the sites themselves, in a browser at desktop and phone widths, so you see the pages and not their marketing.
4. **None available:** build the direction from the brief and the inventory, and say so.

**Record**, per reference: what it leads with, how it builds hierarchy, how much colour and where, its density and rhythm, its type, how it treats images, how it moves, what its copy sounds like, what it does badly. Cite each by link or file name.

**Then extract**: the principles the strong sites share, and the two or three moves that would make this site distinctive rather than generic.

## Step 3 — The direction → **wait for my approval**

Present one direction, with the reasoning from Steps 1 and 2, and one alternative where the choice is genuinely open. Open with one line: *"Reading this as: {site type} for {visitor}, with a {visual language}, built around {signature}."* Then:

- **The signature** — the one thing a visitor will remember, which page it lives on, and why it belongs to this business and no other. Run the competitor test: if it would work unchanged on the nearest competitor's site, revise it. For a bold or experimental brief, storyboard it: trigger, states, durations, and what it becomes on each device tier.
- **Page moments** — which pages, if any, get a smaller moment built from the signature's vocabulary, each with its claim from the plan and a one-line reason; which pages stay quiet. A landing page has one signature and nothing else.
- **Principles** — four to six, each one sentence with a consequence a builder can act on.
- **Palette** — the ground, the ink, the accent and why; the neutral scale and its temperature; the accent policy; hex values and the contrast of every text-on-surface pair.
- **Typography** — one or two families with a free commercial licence, chosen for this subject; the scale (five sizes at most), weights, tracking, and the display-to-body ratio. Never a font bought or licensed for personal use.
- **Layout** — the margins, the content width, the section rhythm, the first screen's composition, in one sentence plus ASCII wireframes of the hero and one interior section.
- **Imagery** — photography, illustration, neither; the treatment; the two aspect ratios; what never appears.
- **Motion** — the personality, the duration and easing tokens, what moves and what never does; for expressive briefs, the motion system and device tiers.
- **Why not the defaults** — any item from `design`'s tells lists the direction uses, with its reason. Silence means none.

Show it as a style tile on the `/design` canvas where available, otherwise an HTML page in `docs/design/style-tile.html`: the palette, the type scale, the hero wireframe in the real type and colour, three buttons in their states, a field, one section. Judge it with your own eyes before showing me. If it looks like a template, change it before I see it. If I've left a choice open, don't spend it on a default.

## Step 4 — Write `DESIGN.md`

Tokens in the front matter, using the format's keys: `colors` (two tiers: primitives and semantic — `background`, `foreground`, `accent`, `accent-foreground`, `muted`, `muted-foreground`, `surface`, `border`, `ring`, and the site's own), `typography` (display, h1 to h3, lead, body, small, button), `rounded`, `spacing` (the scale and the section rhythm), `components` (button, link, field, card where used, each with its states; `-dark` twins only if dark mode exists). Motion, breakpoints and shadows as tables in their sections.

Then the sections, in this order; leave out any with nothing to say:

```markdown
## Overview          — the system in a paragraph; the principles; the signature and where it lives; Key Characteristics: the five to eight decisions that make it this site
## Colors            — by role, each with its use; the accent policy; contrast table; dark mode if any
## Typography        — the families and why; the hierarchy table (token, size, weight, line height, tracking, use); measure; headline budget on a phone
## Layout            — margins, content widths, the section rhythm, the first screen, the grid; how each layout family is used and the once-per-page rule
## Imagery           — treatment, ratios, how text sits on images, placeholders, what never appears
## Motion            — the tokens by name; what animates; reduced motion; the signature's storyboard and the device tiers for expressive sites
## Components        — button, link, field, form, nav, footer, accordion, card, quote, stat, figure, and the signature components, each with anatomy, states and use
## Responsive        — the breakpoints; how the hero, nav, sections and forms change; the phone as its own composition
## Accessibility     — contrast, focus, targets, motion, and the checks every page passes
## Do's and Don'ts   — the ten rules a builder is most likely to break on this site
## Iteration Guide   — how to apply it: reference tokens by name, the default section style, how scarce the accent is; how a new page extends it
```

Rules for the content: every value is a decision with a use; prose matches its token and names it; states are not optional; plain where it can be, precise where it must be; contrast computed, not assumed; nothing that belongs in the plan or the copy decks.

## Step 5 — Verify and apply

1. **Lint:** `npx @google/design.md lint DESIGN.md`. No errors; contrast warnings fixed in the palette.
2. **Read it back as a builder:** describe the home hero and the contact page using only `DESIGN.md`. Anything you had to invent is a gap; fill it.
3. **Apply the tokens:** run `/site-setup`'s token step, then look at `/design-check` and the placeholder pages at phone and desktop widths. Fix what looks wrong in the system, not in the page.
4. **Record** in `CLAUDE.md`'s `Design system` row that `DESIGN.md` exists and the date, and report: the direction, the signature, the references, what makes this site distinctive, and anything left open.

## Later

A new page that needs something the system doesn't cover extends it in place: new tokens or a new component, linted, with the diff in the report. Existing token values are never changed by a page; a change to the brand is a redesign, raised with me and planned as its own work that touches every page using the value.
