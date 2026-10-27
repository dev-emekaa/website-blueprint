# Testing

What "checked" means for a page and for the site. The tools are in `tech-stack`; which pipeline runs what is in `ci-cd`. A content site has little logic to unit-test; its risks are a broken page, a slow page, a page someone can't use, a form that doesn't deliver, and a search result that doesn't appear. The checks target those.

## Principles

- **Check the rendered page, not the code.** Most checks run in a real browser against a built page at several widths, because that is what the visitor gets.
- **Every page, every time.** `pnpm check` takes the list of pages from the sitemap, so a new page is checked without anyone adding it.
- **One command.** `pnpm check` runs everything below and fails on any gate. A page is `Checked` only when it passes.

## The checks

| Check | Tool | Gate |
| --- | --- | --- |
| Types, lint, format | `tsc`, ESLint with `jsx-a11y`, Prettier | No errors |
| Build | `next build` | Succeeds; no warnings about dynamic rendering on a page meant to be static |
| HTML validity | `html-validate` on the built pages | No errors |
| Performance | Lighthouse through the check script, mobile settings, three runs, the median, each page | Performance ≥ 90; LCP ≤ 2.5 s, CLS ≤ 0.1; JS and page-weight budgets from `performance` |
| Accessibility | `@axe-core/playwright` on each page, plus heading order, landmarks, `lang`, target sizes | Zero serious or critical violations |
| Reflow | Playwright at 320px | No horizontal scroll, nothing clipped |
| Links | The check script for internal links, images and the Open Graph image; `linkinator` for external links | No broken internal links or images; external 4xx and 5xx reported |
| Metadata | A script over each page's `<head>` | Unique title and description within length; canonical; Open Graph image resolves; one `h1` |
| Structured data | Parsed from each page's JSON-LD | Parses; the type matches the plan's SEO map; the required fields for that type are present (the builders are typed with `schema-dts` at compile time, which is where the shapes are enforced) |
| Security headers | Fetched from the preview or production | Every header in `security` present with the expected value |
| Forms | Playwright: fill and submit each form to the test destination | Validation messages appear; success state renders; the test inbox receives it |
| Screenshots | The check script at 320, 390, 768, 1280 and 1920, each page, light and dark where supported | Saved for review; compared with the approved design by `/site-build` |
| Redirects *(redesign)* | The check script with `--redirects` | Every old URL reaches its target in one hop |
| Dependencies | `pnpm audit` | No known high or critical vulnerability (`security`) |

## By hand

Tools find only part of the accessibility problems (`accessibility` → Checked how) and none of the design ones. Before a page is `Checked`:

- **Look at the screenshots** at every width against the approved export: hero, one interior section, the footer.
- **Keyboard pass:** Tab through the page and any form; focus visible everywhere, order sensible, nothing trapped, Escape closes what it should.
- **Screen-reader read** of the first screen and the form.
- **Reduced motion** on: the page is its finished state. **200% zoom:** nothing lost.
- **A phone**, real where possible: tap targets, the hero, the form.

## When

| When | What runs |
| --- | --- |
| Before commit | Types, lint, format |
| Every pull request | Everything, against the Vercel preview |
| Before `Checked` | Everything, plus the checks by hand |
| `/site-launch` | Everything against production, plus forms to the real destination and the analytics events |
| After launch | `/site-audit` on a schedule the owner chooses; at least after any dependency update that touches rendering |

## Fixtures

- Forms in checks post to a test destination (`tech-stack` → Environments), never to the real inbox or CRM.
- Lighthouse runs three times per page and takes the median, because single runs vary.
- Screenshots and reports are kept in `.checks/` and ignored by git; the approved exports in `docs/design/screens/` are the reference. CI keeps each production deploy's `report.json` as a workflow artifact, so a regression has its "before".
