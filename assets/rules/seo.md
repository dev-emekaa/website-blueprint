# SEO

How the site gets found. Search engines rank pages that answer what people search for, load fast, work on phones and are trusted. Most of that is the rest of this blueprint doing its job; this file is the part that is specific to search.

## Principles

- **One page, one intent.** Each page answers one thing people search for, named in the plan's SEO map. Two pages answering the same intent compete with each other; one page answering two intents answers neither well.
- **Write for the visitor; the engine follows.** Keyword stuffing, hidden text and doorway pages are penalised. The search term appears naturally in the title, the `h1` and the first paragraph because the page is about it.
- **Technical correctness is table stakes.** Metadata, structured data, a sitemap and clean URLs don't rank a page; their absence stops it ranking.
- **Speed and accessibility are ranking inputs.** Core Web Vitals (`performance`) and a usable mobile page (`accessibility`) count.

## Per page

| Element | Rule |
| --- | --- |
| URL | Lowercase, hyphens, the page's subject, no dates or IDs: `/services/boiler-repair`. Stable for the life of the site |
| `<title>` | Unique per page; subject first, business last; under about 60 characters |
| Meta description | Unique per page; the visitor's words; under about 155 characters. Written in the copy deck |
| `h1` | Exactly one, in the first screen, saying what the page is. Headings below it in order, with no level skipped |
| Canonical | Every page declares its own canonical URL; variants (trailing slash, query strings, `www`) redirect to it |
| Open Graph · Twitter | Title, description, a 1200×630 image per page, type, site name. The default image shows the business; the plan names pages that get their own |
| Images | `alt` from the copy deck; descriptive file names (`boiler-repair-edinburgh.webp`, not `IMG_4021.webp`) |
| Internal links | Every page is reachable from the nav or from another page's body in two clicks. Link text names the destination |
| Language | `<html lang>` set; `hreflang` only on a multilingual site |

## Site-wide

- `sitemap.xml` generated from the content at build, listing every indexable page with its last-modified date; `robots.txt` points to it and blocks nothing a visitor needs.
- Utility pages — thank-you, 404, search results, preview — are `noindex`.
- Redirects are permanent (308 or 301) and live in `next.config`. On a redesign, every old URL that had traffic or links maps to its nearest new page; none goes to the home page as a catch-all, and none chains.
- One domain: `www` or not, HTTPS always; the other redirects, and so does the hosting platform's own address for the site (`project.vercel.app`), which stays reachable beside the real domain.
- The site is fast and works on phones: `performance` and `accessibility` are not optional for ranking.

## Structured data

JSON-LD, built by `lib/seo`, one block per page, typed with `schema-dts`. Only types whose facts are true and visible on the page:

| Page | Type |
| --- | --- |
| Every page | `WebSite` (home only) · `BreadcrumbList` on pages below the top level |
| The business | `Organization`, or `LocalBusiness` (and its subtype: `Dentist`, `Plumber`, `Restaurant`) with address, hours, phone, geo and the same name as the storefront |
| A service | `Service` with provider and area served |
| A product | `Product` with offers; `AggregateRating` only from real reviews shown on the page |
| FAQ sections | `FAQPage` |
| Articles, posts | `Article` with author, dates and image |
| A person (portfolio) | `Person` |
| Events | `Event` with date, location, offers |

Structured data that describes something not on the page is spam. It is validated at `pnpm check` and, before launch, in Google's Rich Results test.

## Local businesses

- The name, address and phone are identical, character for character, on the site, in the structured data and on the Google Business Profile.
- One page per location where there is more than one, each with its own address, hours and map.
- The area served is named in copy where it is true, not sprinkled.

## Content that keeps ranking

- Pages answer the whole question: what it costs, how long it takes, what's included, what happens next. Thin pages that exist to hold a keyword are removed or merged.
- A blog or guides section only where the owner will keep writing; a dead blog signals a dead business. The plan decides, and the CMS trigger in `tech-stack` follows.
- Dates on content are real and updated when the content is.

## After launch

- Search Console verified, the sitemap submitted, and checked at launch and monthly for coverage errors, Core Web Vitals and manual actions.
- A redesign's old URLs are watched for 404s in the first month.
