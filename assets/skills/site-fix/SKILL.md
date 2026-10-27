---
name: site-fix
description: Resolve one issue in the built site — a bug, design drift, a copy change, a performance regression, an accessibility or SEO finding, a content update, or an item from an audit — by reproducing it, classifying it, fixing it the cheapest right way, re-running the checks it touches and updating the doc it changes. Use any time after a page is Built, one issue per run.
---

# Site Fix

You are a careful engineer and editor who changes what exists without breaking what works. One issue per run; the docs and the page change together; the checks prove it.

## Inputs

The issue as I describe it, or an item from `docs/audits/`; the page's copy deck, design export and plan entry; `DESIGN.md`; the rules the issue falls under; `docs/pages.md`.

## Step 1 — Confirm it

Reproduce the issue before touching anything: open the page at the width it was reported at, run the check that would catch it, or compare with the export. State what you see. If it can't be reproduced, say so and stop.

Then confirm it against the docs: is the page doing what its deck and export say (a drift), or are the docs wrong (a change)? The answer decides what gets updated.

## Step 2 — Classify

| Kind | What it is | What changes |
| --- | --- | --- |
| Bug | Something broken: a form that doesn't send, a link, a layout at one width | The code |
| Design drift | The page no longer matches its export or `DESIGN.md` | The code — or the export, if I approve the new look |
| Copy change | New or corrected words, prices, hours, proof | The deck first, then the page |
| Content update | A new testimonial, team member, case study, post | `src/content/` and the deck; the plan if a section is new |
| Performance regression | A page under its budget: the before and after scores are the reproduction | The code: usually an image, a script or a dependency |
| Accessibility | A criterion failed, or a task a visitor can't complete | The code; the deck if labels or errors change |
| SEO | Metadata, structured data, a redirect, an indexing error from Search Console | The code or the content; the plan's SEO map if the intent changes |
| Security | A header, a CSP violation, a dependency advisory, spam getting through | The config or the pipeline |
| Design change | A section or page should look different | Back to `/site-build`'s design stage for that page, on its canvas when the tracker's link opens — not this skill |

A permission, a service or a dependency added to fix something is a plan change: raise it before adding it.

## Step 3 — Fix

- **The cheapest fix that is right**, in this order: delete what causes it; use the platform (the browser, Next, the primitive) instead of custom code; reuse an existing token or component; correct the value; add something new. Only when the earlier options don't work.
- The fix is surgical: it changes the page or component with the issue, not its neighbours. A change to a shared component is checked on every page that uses it.
- A copy change is made in the deck first, in the brand's voice, then rendered. A design-drift fix matches the export; if I approve the new look instead, the export is replaced (edited on the canvas when its link opens, otherwise redesigned from the export and `DESIGN.md`) and I approve the new one.
- Tokens are never changed to fix one page. A token that is wrong is a design-system change, raised with me.

## Step 4 — Verify

- Re-run the check that reproduced it, and `pnpm check` for the page (and every page a shared component touched).
- Look at the page at the widths the issue involved; for a performance fix, the score before and after.
- For an accessibility fix, the keyboard or screen-reader pass that exercises it.

## Step 5 — Docs and commit

Update what the fix changed: the copy deck, the design export, `src/content/`, `docs/analytics-events.md`, the plan's SEO map, `.env.example` and the infra guide for a config change. Note the change in the page's tracker row; the page stays `Live`. Commit the code and the docs together, and for an audit item, mark it resolved in the audit report.

## Report

Three lines: what the issue was and its kind, what changed and why that was the right fix, and what was verified. Anything the fix revealed but didn't resolve becomes its own issue.
