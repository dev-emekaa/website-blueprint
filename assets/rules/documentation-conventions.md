# Documentation Conventions

Where everything about the site is written down, and how it stays true. Project specifics live in `CLAUDE.md`.

## Principles

- **The docs are the source; the code implements them.** A page is built from its copy deck and its approved design, never from memory of a conversation. When the code and a doc disagree, the doc is wrong or the code is — one of them is fixed in the same change.
- **One place per fact.** The business lives in the brief, the structure in the plan, the words in the copy decks, the look in `DESIGN.md`. A doc refers to another by name rather than repeating it.
- **Approval is recorded, not remembered.** A doc that needs sign-off carries `Status: approved` and the date at the top once it has it. Skills refuse to build on a doc that isn't approved.

## The documents

| Doc | Path | Written by | Approved? |
| --- | --- | --- | --- |
| Site brief | `docs/site-brief.md` | `/site-brief` | Yes |
| Site plan | `docs/site-plan.md` | `/site-plan` | Yes |
| Page tracker | `docs/pages.md` | `/site-plan` creates the rows; every skill updates its column | — |
| Design system | `DESIGN.md`, at the project root | `/design-system` | Yes |
| Style tile *(only without the canvas)* | `docs/design/style-tile.html` | `/design-system` | — |
| Copy decks | `docs/copy/{page}.md`, plus `docs/copy/shared.md` for the header, footer, forms and errors | `/site-copy` | Yes, per page |
| Approved designs | `docs/design/screens/{page}/` | `/site-build`: exports of the approved page, one folder per page | They are the approval |
| Image prompts | `docs/design/images.md` | `/site-build`, only when an image has to be generated outside the session | — |
| Design references | `docs/design/references/` | The owner, optionally: screenshots of sites they admire. Never committed | — |
| Category screenshots | `docs/design/references/category/` | `/site-brief`: the competitor sites at phone and desktop. Never committed | — |
| Redirect map *(redesign)* | `docs/infra/redirects.csv` | `/site-setup`, from the plan: `old,new` per line, verified by the check script | — |
| Design prototypes *(only without the canvas)* | `docs/design/screens/{page}/prototype/` | `/site-build` | — |
| Image attribution | `public/images/ATTRIBUTION.md` | `/site-build`: every image's source and author | — |
| Audits | `docs/audits/{yyyy-mm-dd}-{site}.md` | `/site-audit` | — |
| Launch record | `docs/launch.md` | `/site-launch` | — |
| Infra setup | `docs/infra/infra-setup.md` | `/site-setup`: hosting, domain, the accounts and steps only a person can do | — |
| Analytics events | `docs/analytics-events.md` | `/site-setup`, `/site-build`, `/site-fix` | — |
| Adoption report *(only on a site the blueprint didn't start)* | `docs/adoption-report.md` | `/site-adopt`: what it found, wrote and flagged. Docs it reconstructed carry a `Reverse-engineered … — verify` line until approved | — |

## The page tracker

`docs/pages.md` has one row per page: its path, its one primary action, its status, the date each status was reached, and notes (the `/design` canvas link, decisions the design made that the copy must follow). It never holds content: content lives in the docs.

### Statuses

Six values, in order. A page moves forward only through them.

| Status | Meaning |
| --- | --- |
| `Planned` | The page is in the approved plan with its job, its argument and its primary action. |
| `Written` | Its copy deck is approved. |
| `Designed` | Its design is approved and exported to `docs/design/screens/{page}/`. |
| `Built` | It is built as designed, with real images or labelled placeholders, its metadata and structured data in place. |
| `Checked` | The page passes `testing`'s checks, by script and by hand. |
| `Live` | It is on the production domain: recorded by `/site-launch`, or, for a page added after launch, by `/site-build` once it is merged and the post-deploy check passes. |

A change to a live page (`/site-fix`) keeps it `Live` and notes the change; a page that is redesigned goes back to `Written` until its new design is approved.

## Names

- Pages are named by their path: the home page is `home`, `/about` is `about`, `/services/roofing` is `services-roofing`. The same name is used for the copy deck, the design export folder and the tracker row.
- Design exports: `docs/design/screens/{page}/{nn}-{section}.png`, numbered top to bottom, with `-mobile` for the phone version of any section whose layout differs materially. On an adopted site, `as-adopted-{width}.png` per page until the page is redesigned and its exports replace them.
- Audits: dated, and named for the site audited, so audits of a prospect's site and of this one sit side by side.

## Session rules

- Read `CLAUDE.md`'s project configuration first. Anything blank that the task needs is asked for once, then written there.
- A skill whose input doc doesn't exist, or isn't approved, stops and says which one.
- Every doc change is committed with the code change it belongs to.
