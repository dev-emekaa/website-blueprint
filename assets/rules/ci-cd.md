---
paths:
  - ".github/**"
  - "vercel.json"
  - "next.config.*"
  - "playwright.config.*"
  - ".env.example"
---

# CI/CD

How a change reaches the site. The checks are in `testing`; the environments are in `tech-stack`.

## Principles

- **Every pull request gets a preview and the full checks.** Nothing merges that doesn't pass `pnpm check` against its preview.
- **`main` is production.** A merge deploys. There is no staging: a static site's preview is an exact copy of what production will be, and the checks run against it.
- **Rollback is a redeploy.** Vercel keeps every production deployment; promoting the previous one takes seconds and is the first response to a broken release.
- **Content changes are code changes.** A copy edit goes through the same PR and checks, because a broken link or a title over length is the same bug whoever made it.

## Repo rules

- `main` is protected: no direct pushes, the checks required to merge.
- Squash merge, so every commit on `main` is one reviewed change.
- Vercel's production deploys come from `main` only; previews from every PR. Vercel sends `noindex` on preview URLs; the launch checks confirm it.
- Dependabot keeps dependencies and the pinned actions current; its PRs run the same checks.

## Pipelines

| Pipeline | Trigger | What it does |
| --- | --- | --- |
| **1. PR checks** | Pull request opened or updated | Types, lint, build; waits for the Vercel preview; runs `pnpm check` against it with forms to the test destination |
| **2. Production** | Merge to `main` | Vercel builds and deploys; a post-deploy job runs the check script against the production domain and keeps its `report.json` as a workflow artifact — the "before" for any later regression |
| **3. Scheduled audit** *(optional)* | Monthly, or as the owner sets | `pnpm check` against production, result posted as an issue when a gate fails — the site drifts as dependencies and content change |

### 1. PR checks

Required to merge. Target: under ten minutes.

1. Install from the lockfile, cached.
2. In parallel: types, lint and format, `pnpm audit`.
3. Build, to catch build-time errors early.
4. Wait for the Vercel preview, then run `pnpm check` against its URL.

### 2. Production

Vercel deploys on merge. The post-deploy job confirms the live site is what was checked: headers, metadata, sitemap reachable, no broken internal links, home page Lighthouse within budget. A failure alerts the owner and names the previous deployment to promote.

## Redesign cut-over

When this site replaces an existing one on the same domain:

1. The redirect map from the plan is in `next.config` and in `docs/infra/redirects.csv`; the check script's `--redirects` verifies every old URL on the preview before cut-over.
2. The domain moves in DNS to Vercel; the old host stays up until the redirects and the first crawl are verified.
3. `/site-launch` runs the full checks on the production domain, submits the sitemap, and watches Search Console for the first month.

## Environment values

- Preview and production are separate environments in Vercel; a preview never holds the production form destination or analytics key.
- A new variable is added to `.env.example`, `lib/env.ts` and both Vercel environments in the same PR, so the build validation never fails after merge.
