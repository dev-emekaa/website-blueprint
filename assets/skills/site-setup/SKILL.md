---
name: site-setup
description: Set up the site's foundation once, before the first page is designed or built — the Next.js project, the shell and section primitives, fonts and tokens, metadata and structured-data helpers, the form pipeline with delivery and spam protection, analytics with consent, security headers, the check suite, CI and Vercel, and the guide to the steps only the owner can do. Use after the plan is approved; re-run its token step after DESIGN.md exists.
---

# Site Setup

You are a senior frontend engineer setting up a website so that every page built on it is fast, findable, accessible and secure by default, without each page having to try. Everything here follows the rules: `tech-stack` for what, `coding-standards` for how, and `performance`, `seo`, `accessibility`, `security`, `analytics` and `testing` for what the foundation must guarantee.

## Read first

`docs/site-brief.md` and `docs/site-plan.md` (both approved — stop if not), `CLAUDE.md`, and the rules. The plan's services list is what you wire; nothing else.

## Step 1 — Plan → **wait for my approval**

State what exists, what will be created, and the decisions the plan leaves to you: the domain, the form destination and sender address, the analytics provider, whether a CMS is in scope. Check the current stable version of each tool rather than relying on memory, and say which versions the scaffold will use. Name every account I must open and every value I must supply. Nothing is written until I approve.

## Step 2 — Scaffold

- **The project per `tech-stack`:** Next.js with the App Router and `src/`, TypeScript strict, Tailwind, ESLint and Prettier as `coding-standards` says, a pre-commit hook for lint, format and types. pnpm with a committed lockfile.
- **The structure from `coding-standards`:** `app/(site)/` with the shell layout, `components/shell|sections|ui`, `content/`, `lib/`, `styles/globals.css`, `public/images/ATTRIBUTION.md`.
- **The shell:** skip link, header with the nav from the plan (or none, for a landing page), footer as a designed close with contact and legal links. Placeholders in neutral tokens until `DESIGN.md` exists.
- **Section primitives:** a `Section` wrapper carrying the rhythm tokens and the heading level; the `Field`, `Button` and restyle-ready shadcn primitives the plan's pages need (dialog, accordion, tabs) and no others.
- **Pages:** one route per planned page, each rendering a placeholder section list from its plan entry, so the site builds and the checks run from day one. A `not-found.tsx` with the 404 copy's structure.
- **Environment:** `lib/env.ts` validating every variable; `.env.example` naming each with a comment; `.env.local` ignored by git.
- **`next.config`:** `images.formats` with AVIF and WebP; the headers and redirects come in Steps 4 and 7.

## Step 3 — Tokens *(when `DESIGN.md` exists; otherwise placeholders, and re-run this step later)*

- Fonts through `next/font`, self-hosted, subset, with the size-adjusted fallback.
- `DESIGN.md`'s tokens as CSS variables in `globals.css` and as the Tailwind theme: colours in two tiers, the type scale, spacing and section rhythm, radius, motion durations and easings.
- Dark mode wired to the system only if `DESIGN.md` defines it.
- A dev-only `/design-check` route (absent in production) rendering the type scale, the palette with contrast, the buttons and fields in every state.

## Step 4 — SEO foundation

- `lib/seo.ts`: a `pageMetadata()` helper that applies the site defaults (site name, canonical base, default Open Graph image, Twitter card) and takes a page's title, description, path and image; typed JSON-LD builders for the types in the plan's SEO map (`Organization` or `LocalBusiness`, `WebSite`, `BreadcrumbList`, `Service`, `FAQPage`, …), rendered once per page.
- `app/sitemap.ts` and `app/robots.ts` generated from the content; `noindex` for the pages `seo` names.
- `app/opengraph-image.tsx` for the default social image, from the brand, not a logo on a gradient.
- The icons: `app/icon` and `apple-icon` from the brand mark, `app/manifest.ts` with the site name and colours, and `themeColor` in the `viewport` export.
- Redirects from the plan's map in `next.config`, permanent, none chained, none to the home page as a catch-all.
- One canonical host: `www` or not, per the brief; the other redirects, and so does the project's `.vercel.app` host (a `has: host` redirect in `next.config`), because Vercel keeps that address indexable beside the real domain.
- Redirects for a redesign from the plan's map, and the same map as `docs/infra/redirects.csv` (`old,new` per line) for the check script to verify.

## Step 5 — Forms

From the plan's forms, per `security` and `coding-standards`:

- One Zod schema per form, shared by the client and the Server Action.
- The action: validates, runs the spam checks, strips and length-limits every field, delivers through the plan's service (Resend to the inbox; a webhook to the CRM or calendar where named), retries once, and returns a typed result.
- Delivery goes to the test destination on local and preview, the real one in production (`tech-stack` → Environments), through environment variables. The spam checks are the ones `security` → Forms lists.
- The form component renders the copy deck's labels, errors, pending and confirmation states; the confirmation is a live region that exists before the message.
- A delivery failure shows the visitor another way to make contact and alerts me (Sentry, where installed; otherwise an email to the test inbox).

## Step 6 — Analytics and consent

Per `analytics` and the brief's choice: the provider's script loaded after interaction, in production only; `lib/analytics.ts` with `track()`; `docs/analytics-events.md` started with the events the plan's actions imply. Where the market requires consent for the chosen provider, a designed consent control that blocks the script until accepted and remembers the choice.

## Step 7 — Security

The headers from `security` in `next.config`, with the CSP in its static form unless the plan chose the nonce form, allowing exactly the origins the plan's services use. Sentry, server-side only unless the plan gave a reason for the browser SDK. `pnpm audit` in the checks. Confirm Vercel's `noindex` on previews rather than adding one.

## Step 8 — The check suite

`pnpm check` per `testing`, runnable against a local build or any URL:

- The core is the audit skill's bundled script, `.claude/skills/site-audit/scripts/check.mjs`, run with `--strict` so the budgets, headers and metadata are failures, not warnings: it renders every page from the sitemap at 320, 390, 768, 1280 and 1920, runs Lighthouse (three runs, the median) and axe, checks reflow, headers, metadata, structured data and links, keeps screenshots in `.checks/` (ignored by git), and exits non-zero on a failure. Add its packages as dev dependencies so it uses the project's copies: `playwright`, `@axe-core/playwright`, `lighthouse`, `chrome-launcher`.
- Around it: Playwright submitting each form to the test destination; `html-validate` on the built pages; the plan's structured-data types asserted per page; `linkinator` for external links; `pnpm audit`.
- For a redesign, `--redirects docs/infra/redirects.csv` verifies every old URL reaches its target in one hop.

## Step 9 — Pipelines and hosting

Per `ci-cd`: the PR workflow (types, lint, audit, build, then `pnpm check` against the Vercel preview), the post-deploy production check, and the optional scheduled audit. The Vercel project linked, with preview and production environments and their variables, production deploys from `main` only, previews with a `noindex` header.

## Step 10 — Infra guide

`docs/infra/infra-setup.md`: every step only I can do, in order, each with where to click and what value to copy where — the domain and DNS records, the email sending domain and its DNS, the form destination account, the analytics account, Search Console verification, the Vercel environment variables, and the Vercel firewall rate-limit rule on form submissions (`security` → Forms). Written so a non-technical owner can follow it.

## Step 11 — Verify and report

1. `pnpm build` and `pnpm check` pass on the placeholder site; the preview deploys from a PR and the checks run against it.
2. A test submission arrives in the test inbox from the preview.
3. Fill in `CLAUDE.md`: the dev and check commands, the URLs, the services configured.
4. Report: what was built, every decision made, every account and value still needed from me, and the next step — `/design-system` if `DESIGN.md` doesn't exist, otherwise `/site-copy`.
