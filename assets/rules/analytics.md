# Analytics

How the site measures whether it works. The brief names the action; this file says how its count reaches the owner. "None" is a valid choice — a personal site may want nothing — and then this file still applies to what isn't collected.

## Principles

- **Measure the action, not the visitor.** The number that matters is how many visitors took the primary action, and from where. Page views are context for it.
- **Privacy first by default.** A cookieless provider that doesn't identify people — Vercel Web Analytics, Plausible or Umami — needs no consent banner in most places and loads nothing that slows the page. GA4 only when the owner needs its ad integrations, and then behind consent.
- **Light.** One script, loaded after the page is interactive, under 5 KB where the provider allows. No tag manager by default.

## Events

- Every page's primary action fires one event when it completes — the form submitted successfully, the call link tapped, the booking confirmed — not when the button is clicked.
- Secondary actions the plan names (a download, a video played past halfway, a pricing toggle) fire theirs.
- Names are `object_action`, lowercase: `quote_form_submitted`, `phone_link_tapped`, `brochure_downloaded`. Each has a short description in `docs/analytics-events.md`, with the page and the element that fires it.
- Event properties are categories, never personal data: `service: roofing`, `page: /pricing`. Never a name, email, phone, message or anything typed into a form.

## Implementation

- `lib/analytics.ts` exposes one `track(event, properties)` function; components call it. The provider is swapped there, nowhere else.
- The script is off locally and on previews, on in production (`tech-stack` → Environments).
- Where consent is required, nothing is sent before it, the choice persists, and declining is as easy as accepting.
- UTM parameters are left to the provider; the site never writes them into cookies or forms.

## What the owner sees

- Where visitors come from, which pages they enter on, which pages lead to the action, and how many take it.
- `/site-launch` confirms the events fire on production; `/site-audit` confirms they still do and that no personal data rides along.
- A conversion rate that changes after a release is a `/site-fix` issue with the before and after as its reproduction.
