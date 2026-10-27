---
name: site-build
description: Design and build one page, or a batch — from its approved copy deck and DESIGN.md, the page is designed on the /design canvas for approval, built as designed with real images or labelled placeholders, given its metadata and structured data, screenshotted and critiqued at four widths, then checked. Use once the page is Written and the foundation exists; one page or a batch per session.
---

# Site Build

You are the design lead and the frontend engineer for this site, and the first critic of your own work. A page starts as approved words and an approved system and ends as a built page that passes every check. Two stages with a checkpoint between them: design, which I approve; then build.

## Inputs

| Input | What it gives you |
| --- | --- |
| `docs/copy/{page}.md`, approved | Every word, every section in order, the action, the meta, the alt text. Stop if not approved |
| `docs/site-plan.md` | The page's job, its claims and proof, its structured-data type, which pages carry the signature or a moment |
| `DESIGN.md` | How it looks and moves |
| `docs/pages.md` | The page's status and notes |
| The rules | `design`, `conversion`, `content`, `coding-standards`, `performance`, `seo`, `accessibility` |
| `CLAUDE.md` | The canvas, image providers, the dev and check commands |

Order: the home page first, because it carries the signature and sets the shared components; then the pages in the plan's order.

## Stage A — Design

### Step 1 — Read

The copy deck, the plan entry, and `DESIGN.md`. List the page's sections with their claim and the layout family each will use, so that no two neighbours share one and no family repeats on the page. Decide which section carries the signature or the page's moment, from the plan. For a page that already exists (a redesign of a built page), open its canvas from the tracker's link if the link still opens; otherwise design from its export and `DESIGN.md`.

### Step 2 — Design on the canvas

- **Invoke `/design`** with a brief: the business in one line, `DESIGN.md` (it reads it), the page's sections in order with their copy, the action, the signature or moment, and the references' lessons. Ask for the page at desktop and phone widths as separate artboards; the phone is its own composition, not the desktop squeezed.
- **Where `/design` is not available** (it is a research preview on paid Claude plans and needs Claude Code 2.1.234 or later), design the page as a static HTML prototype in `docs/design/screens/{page}/prototype/`, built from the real tokens, and open it for review the same way.
- **Judge it before showing me.** Look at it at both widths and answer: does it respect `DESIGN.md` token for token; does the first screen say what, for whom, why us, and the action; is the headline two lines on the phone; does every section make its claim with its proof beside it; is the layout equal-margined, with no void left and no shape repeated; does it carry any tell from `design` the plan didn't name; would it work unchanged for the competitor. Fix before presenting.
- **Present** with one line per section on what it does and any decision I should look at. I edit on the canvas or ask for changes; apply them, re-check, present again. A change that contradicts the copy, the plan or the system is raised, not silently applied.

### Step 3 — Approval and checkpoint

When I approve:

1. Screenshot every section of the approved artboards at desktop, and the phone version of any whose layout differs, into `docs/design/screens/{page}/`, named per `documentation-conventions` (the canvas has no per-section export; use the browser). These exports are the record of what I approved. Where the canvas was used, write its link in the page's tracker row; a later canvas edit counts only once I approve it and the screens are exported again.
2. Note under the tracker row anything the design decided that the copy must follow (a line that had to be shortened, a section merged).
3. Mark the page `Designed`. Commit. If the session continues, go to Stage B; otherwise report and stop.

## Stage B — Build

### Step 4 — Build plan → **wait for my approval**

Before code: the section components to add or reuse (with the file for each), the shared components this page changes, the data in `src/content/` it needs, the images with their source per Step 6, the structured-data type and the metadata, the analytics event, and any dependency with its reason. Gaps between the design and the copy or the plan are listed as questions.

### Step 5 — Build the page

- Sections in order, as Server Components taking their content from `src/content/`, matching the approved export; client leaves only where there is interaction or motion.
- Metadata through `lib/seo`'s helper from the deck's meta; the JSON-LD builder for the plan's type; the heading level passed to each section so the page has one `h1` and an unbroken order.
- The primary action wired: the form through the foundation's pipeline with the deck's copy, or the call or booking link; its analytics event on completion, recorded in `docs/analytics-events.md`.
- Motion from the tokens; the signature or moment built per its storyboard, loading after the hero text and behind the device tiers.
- Run the dev server and look at the page at 320, 390, 768, 1280 and 1920, light and dark where it exists, as you finish each section — a picture is worth a thousand tokens. The first page builds the shared components, so a mistake caught there doesn't spread.

### Step 6 — Images

For each slot in the deck, the source the plan named:

- **The owner's own**, where supplied: optimised and placed, credited in `ATTRIBUTION.md` as theirs.
- **Stock**, where a real-world subject suits: search Unsplash or Pexels through their APIs with the keys in `.env.local` (ask me for one if none is configured; both are free in minutes). Fetch three to five candidates, **look at them**, pick the one that matches `DESIGN.md`'s imagery rules and the slot's crop, record its link and photographer. Never as the business's own premises, team or work.
- **Generated**, where the image must match the system's illustration style or shows something stock can't: through the Gemini MCP when connected, with a prompt that states subject, composition, mood, colour direction from the tokens, aspect ratio and size, what must not appear. Look at the result; regenerate until it fits.
- **Neither available**: write the prompt into `docs/design/images.md` with the slot, file name, exact size and ratio, and build a flat placeholder in a palette neutral at the final dimensions, labelled `hero-workshop.webp · 1600×1000`. Tell me in the report; place the file when I add it.

After placing any image: resize the source to 2× its largest rendered width, set `sizes`, `fetchPriority="high"` and eager loading on the LCP image, `alt` from the deck, and look at the page again at every width — crop, focal point, contrast of any text over it, harmony with the palette. If an image itself doesn't work, say so with a revised prompt rather than forcing it.

### Step 7 — Check

1. Compare each section with its approved export at every width; fix drift in the page, or raise it if the export was wrong.
2. `pnpm check` for the page: performance budgets (re-run once real images are in), axe, reflow, links, metadata, structured data, the form to the test destination.
3. The checks by hand from `testing`: keyboard, screen reader on the first screen and the form, reduced motion, 200% zoom.
4. Mark the page `Built`, then `Checked` when everything passes. Commit. If `CLAUDE.md`'s `Production status` is already live, the page goes `Live` once it is merged and the post-deploy check passes.

### Step 8 — Report

The page's sections with their status, the images placed and their sources, any prompt waiting for a generated image, the proof still missing, and the next page. Keep it short.

## Whole-site build

Once every page is `Designed`, the build stage can run for all of them in one session: one build plan for the site, then the pages in order, each checked before the next. Stop at the first page whose checks fail and report.

## Opening the session

Say which page and which stage. State the `CLAUDE.md` values that change what you do: whether the canvas and image generation are available, where design references come from, which stock providers are configured. Ask for anything missing. Then start — don't summarise the workflow back to me.
