---
name: site-launch
description: Take the site live — every check on every page against production, the forms delivering to the real destination, analytics firing, the domain, redirects and Search Console, then the handover that says what was written versus supplied, where every image came from, and what to improve next. Use once every page is Checked; and again for a relaunch after a redesign.
---

# Site Launch

You are the engineer and the producer of the launch. Nothing goes live on hope: every page is checked on the production build, the one action is proven end to end, and the owner leaves with a record of what they have.

## Inputs

`docs/pages.md` with every page `Checked` (stop at the first that isn't and say so), `docs/site-plan.md`, `docs/infra/infra-setup.md`, `CLAUDE.md`, and the rules `testing`, `ci-cd`, `seo`, `security`, `analytics`.

## Step 1 — Pre-launch → **wait for my go**

Against the latest Vercel preview of `main`, or the production domain before the DNS change for a redesign:

1. **`pnpm check` against the full site**, every page from the sitemap: performance budgets (with the real images in), accessibility, reflow, links, HTML, metadata, structured data, security headers, dependencies. Everything passes or is fixed first.
2. **Structured data** on each page type in Google's Rich Results test.
3. **Social previews**: the Open Graph image and text for the home page and each page the plan gave its own, checked in a preview tool.
4. **Forms end to end** to the *real* destination: a submission arrives in the inbox, CRM or calendar the brief named, in the form the owner will see; the confirmation renders; a bad submission shows its errors; the honeypot rejects a bot.
5. **Analytics**: on the preview, the event helper fires the primary action's event with the right name and properties and no personal data (in the provider's debug mode or the console; previews don't send). The live check is in Step 2.
6. **By hand**: the keyboard pass on the home page and the form; a real phone, mid-range, on cellular; reduced motion; 200% zoom.
7. **Redesign only**: every redirect from the plan's map resolves to its page with one hop; the never-change list is intact; the old site is still reachable.
8. **Legal**: the privacy page lists exactly the services loaded; the accessibility statement exists where required; the consent control works where required.
9. **Previews are `noindex`**: confirm the header on the preview URL.

List what passed, what was fixed, and what I must do: the DNS records from the infra guide, and any account not yet connected. Ask for the go.

## Step 2 — Go live

1. The domain: DNS to Vercel per the infra guide, the canonical host set, HTTPS confirmed, the other host redirecting.
2. Merge or promote the verified commit per `ci-cd`; the post-deploy check runs against the production domain and passes.
3. Search Console: the property verified, the sitemap submitted, the home page requested for indexing. For a redesign, the old sitemap removed and the change of address recorded where the domain changed.
4. Analytics confirmed live on the production domain: the first real page view and, with a test submission, the first event — then the test submission deleted from the owner's inbox or CRM.
5. Every page's row in `docs/pages.md` to `Live` with the date.

## Step 3 — Handover

`docs/launch.md`, written for the owner:

- **What's live**: the domain, the pages, the one action per page, where submissions go, where analytics are read.
- **The design in one page**: the signature, the principles, where the tokens live, what each major motion does and what changes on each device tier.
- **Written vs. supplied**: every piece of copy and proof you wrote because the owner didn't supply it, so they know what to replace with real material; every image with its source link and photographer, or the prompt that produced it.
- **What to do next**: the improvements that would matter most, in order; the proof still missing; the content worth adding.
- **How to change things**: a copy edit, a new page, an issue — which skill, and that every change goes through the checks.
- **The first month**: watch Search Console for coverage and 404s weekly; read the conversion count; run `/site-audit` at the end of the month.

Commit it. Report the launch in a few lines: the URL, the checks' results, what I still owe, and a reminder to open the site on a real phone.
