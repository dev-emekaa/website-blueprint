# Accessibility

The site works for everyone: people using a keyboard, a screen reader, a zoomed screen, a slow hand, or a phone in sunlight. The standard is WCAG 2.2 level AA. It is also the law in many places, a ranking input, and the same work that makes a site usable for everyone else.

## Principles

- **Built in, not bolted on.** Semantic HTML does most of the work. ARIA is added only where HTML has no element for the job, and a wrong ARIA attribute is worse than none.
- **Everything works with a keyboard.** Every action a mouse can take, Tab and Enter can take, in a sensible order, with the focus always visible.
- **Checked by a tool and by a person.** `pnpm check` runs axe on every page; it catches about a third of problems. The keyboard pass and the screen-reader read catch the rest.
- **A finding cites the criterion.** An accessibility issue names the WCAG 2.2 success criterion it fails, or the task a visitor cannot complete. Best practices beyond AA are recommendations, labelled as such.

## Structure

- Landmarks: one `header`, one `nav` (named if there are two), one `main`, one `footer`. Sections with headings; `aside` for genuinely aside content.
- One `h1` per page; heading levels in order with none skipped. Headings describe the content below them, so a screen-reader user can navigate by them.
- A skip link to `main` is the first focusable element, visible on focus.
- `<html lang>` is set. Content in another language is marked with `lang`.
- Reading order in the DOM matches the visual order; CSS never reorders content that must be read in sequence.

## Text and contrast

- Contrast measured on the rendered pair: 4.5:1 for text, 3:1 for large text (at least 24px, or 18.5px bold), 3:1 for UI boundaries and icons that carry meaning, and 3:1 between the focus ring and everything next to it.
- Text over images is measured at the worst point under it, or gets a scrim.
- Colour is never the only signal: an error has a message, a link in prose has an underline, a selected tab has more than a colour.
- Text can be resized to 200% and the page reflows at 320px with no horizontal scroll and nothing cut off. Text spacing can be increased without loss.
- Nothing readable is below 13px; form inputs are at least 16px on phones, so iOS doesn't zoom.

## Keyboard and focus

- Focus is visible on every interactive element: the browser's ring, or a replacement at least as visible with an offset. `outline: none` only with a verified replacement.
- Focus order follows the visual order. No positive `tabindex`. Dialogs trap focus while open and return it on close; nothing else traps it.
- Focus is never hidden under a sticky header (2.4.11): `scroll-padding-top` matches the header's height.
- Hover and focus content (tooltips, menus) can be dismissed with Escape, hovered without disappearing, and persists until dismissed.

## Interactive elements

- Buttons are `<button>`; links are `<a href>`. A link goes somewhere; a button does something. Neither is a `div` with a click handler.
- Every control has an accessible name: visible text, a label, or `aria-label` on an element that supports it (never on a `div` or `span`). Icon-only buttons have a name that says what they do.
- Targets are at least 24×24 CSS pixels (2.5.8), and 44×44 on phones where they sit near other targets.
- Custom components (accordion, tabs, dialog, menu) follow the ARIA pattern for that widget — which is why those come from the restyled shadcn primitives rather than being written by hand.
- Nothing requires a precise gesture: a swipe has a button alternative; drag has a click alternative.

## Forms

- Every field has a visible `<label>`; a placeholder is not a label. Related fields are grouped with `fieldset` and `legend`.
- Fields carry a valid `autocomplete` value (1.3.5): name, email, tel, street-address, postal-code.
- Errors are identified in text beside the field, linked with `aria-describedby`, the field marked `aria-invalid`, and focus moved to the first invalid field on submit. The error says how to fix it (`content`).
- Submit is never disabled for validation. While pending it is `aria-disabled` and keeps its label, so focus doesn't fall off it.
- Success and failure are announced: the confirmation is a live region that existed before the message arrived (`role="status"`), or focus moves to it.

## Images and media

- Every image has `alt`: a description of what it shows and why it's there, from the copy deck, or empty for decoration. A missing `alt` is worse than an empty one.
- Charts and infographics have a text equivalent next to them. Canvas and WebGL content that carries meaning has one too; decorative canvas is hidden from assistive technology.
- Video has captions; audio has a transcript. Nothing autoplays with sound.
- Split or animated text keeps the full string on the parent and hides the fragments from assistive technology.

## Motion

- `prefers-reduced-motion` is respected: the page is in its finished state; only opacity fades may remain. Parallax, autoplaying loops and scroll-driven sequences stop.
- Nothing flashes more than three times a second. Anything moving, blinking or auto-updating for more than five seconds has a visible pause (2.2.2), muted hero video included.
- Pinned and scroll-driven sections never trap a keyboard user; Tab leaves them, and anchor links land correctly.
- The native cursor is never hidden. Cursor effects are additions for fine pointers only.

## Checked how

- **Every page, in `pnpm check`:** axe with zero serious or critical violations; heading order; landmarks; `lang`; contrast of rendered text; target sizes; reflow at 320px.
- **Before `Checked`, by hand:** a full keyboard pass through the page and any form; a screen-reader read of the first screen and the form (VoiceOver or NVDA); the reduced-motion pass; 200% zoom.
- **A finding** names the criterion, the element, and the fix, and is `/site-fix`'s to resolve.
