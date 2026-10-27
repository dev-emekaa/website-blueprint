# Coding Standards

How the site's code is written. The tools are in `tech-stack`; what the site must achieve is in `performance`, `accessibility`, `seo` and `security`. This file is how the code meets them by default, so each page doesn't have to try.

## Principles

- **Static by default.** Every page renders at build time. Nothing runs on a server per request except form submissions. A page that can't be static is a plan decision, not a shortcut.
- **Server first.** Pages, layouts and sections are Server Components. A component becomes a client component only to handle interaction or animation, and it is a leaf: the smallest piece that needs it.
- **Content is data.** Words live in the copy deck and in `src/content/`, never typed into JSX. A section component takes its content as props, so copy changes don't touch code.
- **Real content only.** No lorem ipsum, no placeholder names, no grey bars standing in for text. A missing image is a labelled placeholder (`design` → Images); missing copy is a question to the owner.

## Project structure

```
src/
  app/                      routes: one folder per page, page.tsx and its metadata
    (site)/                 the pages, sharing the shell layout
    sitemap.ts  robots.ts   generated from the content
    opengraph-image.tsx     the default social image; pages override where the plan says
  components/
    shell/                  header, nav, footer, skip link
    sections/               one component per section shape: hero, proof, steps, faq, cta …
    ui/                     primitives: button, field, dialog, accordion (restyled shadcn)
  content/                  the site's data: pages, services, testimonials, team, faq (MDX and TS)
  lib/
    seo.ts                  metadata and JSON-LD helpers
    forms/                  schemas, the server action, delivery, spam checks
    analytics.ts            the event helper
    env.ts                  validated environment variables
  styles/globals.css        the tokens from DESIGN.md as CSS variables and the Tailwind theme
public/
  images/                   optimised sources, with ATTRIBUTION.md
```

Dependency direction: `lib` ← `ui` ← `sections` ← `shell` ← `app`. Nothing imports upward.

## Pages and sections

- A page is a list of sections with their content, in the order the plan's argument gives. The page file holds no markup of its own beyond that.
- Each section component is one layout shape and takes typed props for its content. A new shape is added to `sections/` once and reused; a shape used three times on one page is a template, which `design` forbids.
- Headings are passed as a level, so a section renders `h2` where it sits under the page's `h1` and never guesses.
- The shell renders the skip link, the header, the page and the footer. The landing-page shell has no exploratory nav (`conversion`).

## Images

- Always `next/image` with explicit `width` and `height` (or `fill` in a sized container), a `sizes` attribute that matches the layout, and `alt` from the copy deck. The LCP image gets `fetchPriority="high"` and `loading="eager"` (`priority` is deprecated since Next.js 16); everything else lazy-loads.
- Sources in `public/images/` are sized per `performance` and recorded in `ATTRIBUTION.md`. Next serves AVIF and WebP from them once `images.formats` lists both in `next.config` (the default is WebP only).
- Background images that carry meaning are `<img>`, not CSS, so they get `alt` and lazy loading.

## Fonts

- `next/font` for every family, with the settings `performance` → Fonts gives, so text doesn't shift when the font arrives.
- Font variables on `<html>`; Tailwind reads them from the theme. No `<link>` to a font CDN.

## Styling

- Tokens from `DESIGN.md` are CSS variables in `globals.css` and the Tailwind theme. Components use semantic tokens (`text-muted`, `bg-surface`), never raw colour, size or font values.
- Spacing comes from the scale. Section rhythm is a token, so every page breathes the same way.
- Dark mode only when `DESIGN.md` defines it; then it follows the system with `color-scheme`, and every token has a value per scheme.
- Watch specificity: a class on a wrapper (`.section`) and one on an element (`.cta`) cancel each other, most often on padding and margin. Prefer utilities on the element itself.
- `100vh` is `100dvh`; `100vw` is `100%`; `1fr` in a grid that holds text is `minmax(0, 1fr)`; `scroll-padding-top` equals the sticky header's height.

## Motion

- Animate `transform`, `opacity` and `clip-path` only. Never layout properties.
- Hidden starting states live inside `@media (prefers-reduced-motion: no-preference)`, which is how `accessibility`'s reduced-motion rule is met: the page is simply in its finished state. Nothing above the fold waits for a scroll or a script.
- No scroll event listeners: `IntersectionObserver`, CSS scroll-driven animations, or the library's scroll hooks. Values driven by the pointer or scroll live in refs or motion values, never React state.
- Every animation cleans up on unmount. Animated components are client leaves; the page around them stays a Server Component.
- WebGL and heavy libraries load after first paint, behind a poster image, pause when off-screen or the tab is hidden, and are disposed when done.

## Forms

- One Zod schema per form, shared by the client and the Server Action. The action validates again, runs the spam checks, delivers, and returns a typed result the form renders.
- Fields use the project's `Field` primitive, so every input gets its label, description, error wiring and `autocomplete` value.
- The submit button behaves as `accessibility` → Forms says. Success and failure are rendered states with the copy deck's words, and the confirmation names the action the button named.

## Metadata and structured data

- Every page exports `metadata` (or `generateMetadata` for content pages) through `lib/seo`: title, description, canonical, Open Graph and Twitter. The helper applies the site-wide defaults, so a page sets only what differs.
- JSON-LD comes from `lib/seo`'s typed builders and is rendered once per page in a `<script type="application/ld+json">`. Which type each page gets is in the plan.

## Code style

- Named exports; one component per file; files in kebab-case, components in PascalCase.
- Props typed explicitly; no `any`; no `as` casts to silence the compiler.
- Comments say why, not what. A section's reason for existing is its claim in the plan, named in a one-line comment.
- Format on save; lint and types pass before every commit.
