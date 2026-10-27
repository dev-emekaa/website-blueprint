# Performance

How fast the site is, and how that is kept. A slow site is distrusted and abandoned, mostly on phones, mostly before the business ever sees the visitor. Speed is built in by default and measured on every page.

## Budgets

Measured on a mid-range phone over a slow 4G connection, which is Lighthouse's mobile setting. These are gates in `pnpm check`, not aspirations.

| Measure | Budget | What it is |
| --- | --- | --- |
| LCP | ≤ 2.5 s | When the largest thing in the first screen has rendered |
| INP | ≤ 200 ms | How long the page takes to respond to a tap |
| CLS | ≤ 0.1 | How much the layout shifts while loading |
| Lighthouse performance | ≥ 90 on mobile, every page | |
| JavaScript per page | ≤ 150 KB compressed for a content site; ≤ 300 KB for an expressive one, loaded after first paint | |
| Page weight | ≤ 1.5 MB for the first screen's needs, images included | |

Placeholders make a page look faster than it is. The budgets are re-measured once real images and media are in.

## Static first

- Every page is generated at build and served from the CDN. No per-request rendering, no data fetching at request time, except form submissions.
- CMS content uses revalidation on a schedule or a webhook, never request-time fetching.

## Images

Images are most of a page's weight and usually its LCP element.

- `next/image` always, with `width` and `height`, and a `sizes` attribute that matches the layout at each breakpoint — without it the browser downloads the largest candidate.
- The first screen's main image has `priority` and is not lazy; everything below lazy-loads.
- Sources are resized to their largest rendered size at 2× and no larger than 2400px wide. Next serves AVIF and WebP.
- No image carries text that could be HTML. No carousel in the hero: it loads several images to show one.
- Video: short, muted, with a poster, paused off-screen, under 5 MB inline and under 10 MB for a hero loop. Never autoplay with sound.

## Fonts

- `next/font`, self-hosted, subset to the languages used, `display: swap`, with the size-adjusted fallback so text doesn't jump when the font loads.
- Two families at most; the weights actually used, not the whole family. Variable fonts where the design uses several weights.

## JavaScript

- Server Components by default; a client component is the smallest leaf that needs interaction. A page with no interaction ships almost no JavaScript.
- Third-party scripts load after the page is interactive (`next/script`, `afterInteractive` or `lazyOnload`), and only after consent where consent is required. Each one is named in the plan with its cost; a tag manager is never added by default.
- Heavy libraries — 3D, scroll choreography, maps, chat — load on demand, after first paint, behind a poster or a click, and never block the first screen.
- Bundle size is checked when a dependency is added; a dependency that adds more than 30 KB compressed to every page needs a reason in the plan.

## Layout stability

- Every image, embed and ad slot has reserved dimensions. Fonts use the fallback adjustment. Content never inserts itself above what the visitor is reading.
- Cookie banners and announcements, where they exist, don't push the page down after it has painted.

## Motion

Animation is paid for from the same budget. Only `transform`, `opacity` and `clip-path` animate; no scroll listeners; heavy effects behind the device tiers in `design`. A page with a signature moment still meets LCP, because the hero text is HTML and the moment loads after it.

## Caching and delivery

- Static pages and assets carry long cache headers with content hashes; HTML revalidates. Vercel's CDN does this for a static site without configuration; it is not undone with custom headers.
- No redirects on the hot path: the canonical URL serves directly, and internal links point at it.

## Measuring

- `pnpm check` runs Lighthouse on every page at mobile settings and fails under the budgets.
- After launch, Core Web Vitals are read from Search Console and from the analytics provider where it reports them: field data from real visitors, which is what ranks.
- A performance regression is a `/site-fix` issue: the page's score before and after is the reproduction.
