# Security

Security policy for a public website. A content site holds no user accounts and little data, so the risks are specific: being abused as a relay for spam and attacks, leaking the visitors who do contact the business, being defaced through a dependency or a CMS, and the owner's reputation when any of that happens. The standard is small and absolute.

## Principles

- **Nothing runs per request except forms.** A static site has almost no attack surface; keep it that way. Server code exists only to validate and deliver submissions.
- **Treat every submission as hostile.** It is validated, limited, checked for automation and stripped before it goes anywhere.
- **Keep the visitor's data small and short-lived.** Collect the fewest fields, send them to the owner, and don't keep a copy the site doesn't need.
- **Secrets never reach the browser.** Anything that isn't `NEXT_PUBLIC_` stays on the server, in environment variables, never in the repo.

## Headers

Set once in `next.config` (or in `proxy.ts` when a nonce is needed) and verified by `pnpm check`:

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | `default-src 'self'`; styles, images, fonts, frames and connections each allowed only from the origins the plan names; `frame-ancestors 'none'`; `base-uri 'self'`; `form-action 'self'`. For scripts, see below |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Camera, microphone, geolocation and the rest denied unless a feature needs one |

**Scripts in the CSP.** Next.js renders small inline scripts on every page, so a static site cannot lock `script-src` to a nonce: nonces need a per-request render. The default for this blueprint is therefore a static site with `script-src 'self' 'unsafe-inline'` plus the named third-party origins, and everything else locked — the realistic best for a site with no user data. A nonce-based `script-src` (through `proxy.ts`, which makes every page dynamic) is a plan decision for a site that already renders per request. Either way, every third-party script, embed, font or image origin is an explicit CSP entry, added when the plan adds the service, and a CSP violation in the console is a bug.

## Forms

- The Server Action validates with the same Zod schema as the client, and rejects anything else; the client's validation is a convenience, not a defence.
- Spam and abuse: a hidden honeypot field that a human never fills; a minimum time between page load and submit; a rate limit per IP on the action; Turnstile only if those fail in practice. Rejections look like success to a bot and are logged.
- Submissions are stripped of control characters and length-limited before delivery. Nothing from a submission is rendered as HTML, used in an email subject or header unescaped, or passed to a shell.
- Delivery uses an API key held server-side. A delivery failure is retried once, then shown to the visitor as a failure with another way to make contact, and alerted to the owner.
- File uploads only where the brief needs them: typed, size-limited, scanned, stored in a bucket with no public listing, never on the server's disk.

## Visitors' data

- The site collects only what a form needs to reply. It doesn't store submissions itself unless the brief requires a log, and then with a retention period.
- No personal data in URLs, query strings, analytics events or error-tracking payloads. Error tracking scrubs form fields.
- The legal pages are written from the plan's service list, so they are true: a privacy page (what is collected, by which service, for how long, how to ask for its removal); an accessibility statement where the market requires one (public bodies, and businesses under the EU's accessibility law); terms where the site sells.
- Consent: a cookieless analytics provider needs no banner in most jurisdictions. Any service that sets cookies or fingerprints (GA4, ad pixels, embedded video with tracking) loads only after consent where the brief's market requires it, and the banner is designed, not the default of a consent vendor.

## Secrets and environment

- `.env.example` names every variable with a comment and no values. `.env.local` is ignored by git. Production values live in Vercel.
- `lib/env.ts` validates every variable at build, so a missing key fails the deploy rather than a visitor's form.
- Keys are scoped to the least a service allows: a send-only email key, a read-only CMS token for the build, a write token only for the webhook that revalidates.

## Third parties and supply chain

- Every dependency is from a known publisher, pinned by the lockfile, and updated by Dependabot with the PR checks as the gate. A dependency with a known high or critical vulnerability fails `pnpm check`.
- Scripts from third parties load only from their own origin with Subresource Integrity where the vendor publishes a hash, never inlined from a tag manager snippet.
- A CMS webhook that triggers revalidation verifies a secret; the CMS token used at build cannot write.
- Embeds (maps, video, calendars) are loaded in an iframe with the narrowest `allow`, or replaced with a static preview that loads the embed on click.

## Deployment

- Only the pipelines deploy; Vercel's dashboard is protected with two-factor authentication and the owner's account alone.
- Preview deployments are not indexable — Vercel sends `X-Robots-Tag: noindex` on them; `/site-launch` verifies it — and, where a redesign is confidential, protected with Vercel's password or authentication.
- The old site stays reachable until the redirects are verified on the new one.

## Audit

`/site-audit` checks the headers, the CSP, the form's behaviour under abuse, the dependency advisories and the privacy page against the services actually loaded. A gap is a finding with its fix.
