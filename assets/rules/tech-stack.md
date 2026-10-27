# Tech Stack — Next.js · TypeScript

What the site is built with. Use the current stable release of each; the lockfile pins versions, not this file. Anything not listed is proposed in the plan with what it's for, what it costs, which account the owner must open, what data leaves the site, and the option rejected in its favour — never picked silently. If the need only appears mid-build, stop and ask.

The site is content: pages rendered at build time, a few forms, and a handful of services. It has no backend of its own. A product's logged-in app is built with the Web App and Backend Blueprints in their own repos; this site links to it.

## Core

| Need | Choice |
| --- | --- |
| Language · runtime | TypeScript in strict mode · Node.js, active LTS |
| Framework | Next.js, App Router, `src/` directory. Every page static at build; revalidation only for CMS content |
| Styling | Tailwind CSS, with the tokens from `DESIGN.md` as the theme |
| Components | shadcn/ui for primitives that need accessibility work done right (dialog, accordion, tabs, form fields) — copied into the repo and restyled to `DESIGN.md`. Shipping their defaults produces a generic site. Everything else is built by hand |
| Content | MDX and data files in the repo (`src/content/`) — versioned, reviewed, no service |
| Forms | React Hook Form · Zod · a Server Action that validates again and delivers |
| Images | `next/image`, with sources from stock APIs or generated per `/site-build` |
| Fonts | `next/font`, self-hosted, two families at most |
| Animation | CSS first (transitions, scroll-driven animations, View Transitions). Motion (`motion/react`) for component state and gestures |
| Icons | `lucide-react`, or the brand's own set |
| Metadata · structured data | Next's Metadata API · JSON-LD written by the project's `lib/seo` helpers, typed with `schema-dts` |
| Environment variables | `@t3-oss/env-nextjs` with Zod: validated at build, `NEXT_PUBLIC_` exposure explicit |
| Lint · format · types | ESLint (`eslint-config-next`, `eslint-plugin-jsx-a11y`) · Prettier with `prettier-plugin-tailwindcss` · `tsc` |
| Checks | Lighthouse CI · Playwright with `@axe-core/playwright` · `linkinator` · `html-validate` — all behind `pnpm check` (`testing`) |
| Package manager | pnpm, with a committed lockfile |

## Services

| Need | Default | When |
| --- | --- | --- |
| Hosting | Vercel: previews per pull request, production from `main` | Always |
| Form delivery | A transactional email API (Resend) to the owner's inbox, with a webhook to a CRM, calendar or messaging tool where the brief names one | Any form |
| Spam protection | Honeypot and a time-to-submit check, a rate limit per IP; Cloudflare Turnstile added only when spam still gets through | Any form |
| Analytics | A privacy-friendly, cookieless provider (Vercel Web Analytics, Plausible or Umami) — no consent banner needed in most places. GA4 only when the owner needs its ad integrations, with consent | Per `analytics`; "none" is allowed |
| Error tracking | `@sentry/nextjs` | Sites with forms or any server code |
| Email capture | The owner's email tool through its API or form endpoint | Only when the brief's action is "subscribe" |

## Added only when the trigger is met

| Tool | Trigger | Not for |
| --- | --- | --- |
| A CMS — Keystatic (git-based, free) or Sanity (hosted) | Non-technical people must add or edit content often: a blog, news, listings | Pages that change a few times a year — those are MDX edits |
| TanStack Query | Real server state: live availability, prices or inventory from an API | A static site; it would wrap nothing |
| Zustand | UI state shared across distant components: a multi-step quote flow, a configurator, a cart | Nav and dialog toggles, which are local state |
| GSAP with ScrollTrigger | Scroll-linked timelines, pinned sections, split text — the expressive sites `design` describes | Reveals and hovers, which CSS and Motion do |
| React Three Fiber + drei | 3D is the signature or the content | Decoration |
| Lenis | Scroll choreography that needs smoothing. Anchors, keyboard scrolling and focus must keep working; off under reduced motion | Smooth scrolling added by reflex |
| Rive or Lottie | Designed vector animation; Rive when it reacts to input | Anything CSS can do |
| `next-intl` | A second language | — |
| Booking, maps, payments, chat, search | The brief's primary action or content needs it | — |

Motion and GSAP never animate the same element. CSS scroll-driven animations and View Transitions are used first wherever they do the job without JavaScript.

## Environments

| | Local | Preview | Production |
| --- | --- | --- | --- |
| Where | `next dev` | Vercel, one per pull request | Vercel, the production domain |
| Forms deliver to | The owner's test inbox | The test inbox | The real destination |
| Analytics | Off | Off | On |
| Env values | `.env.local` | Vercel preview environment | Vercel production environment |

Environment values are baked in at build, so each environment is its own build.
