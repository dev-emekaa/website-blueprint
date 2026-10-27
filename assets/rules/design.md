# Design

What makes a website look like one business and no other, and still work for the visitor. `DESIGN.md` holds this site's decisions; this file is the standard they are made to. Words are in `content`; the page's argument is in `conversion`.

## Principles

- **Ground every choice in the subject.** The business's materials, place, vocabulary, numbers and rituals are where distinctive choices come from. A children's dentist and an insurance broker share nothing visually. Before any colour is chosen, list eight to twelve things only this business has, and build from them.
- **One signature, a system with character, moments where earned.** A visitor remembers one thing: the signature, on the page most visitors enter through. Every page carries a system — type, colour, rhythm, imagery treatment, motion — that could only be this business; that is where distinctiveness lives, and a weak system is what makes a site bland. A page gets its own smaller moment, built from the signature's vocabulary, only when its content calls for one: a case study, a flagship product, a process. Pages whose job is completing an action — contact, pricing, booking — stay quiet.
- **The competitor test.** If the direction, the signature or the hero would work unchanged on the nearest competitor's site, it is a category idea, not this business's. Revise it.
- **Restraint is a budget, not a mood.** Boldness is spent in one place and paid for with discipline everywhere else. Cut any decoration that doesn't serve the brief.
- **Defaults are not choices.** The tells below are legitimate for some brief. They are used only when the plan names them and says why.

## The hero

The first screen says what this is, who it's for, and what to do — in HTML text, visible at first paint, on a phone. One `h1` of at least 32px that says what the business does (if the headline is the name, a line under it explains). The primary action is in the first screen. Open with the most characteristic thing in this business's world: a headline, an image, a demonstration, a moment. The big-number-with-a-small-label hero, the centred statement over a screenshot, and the gradient wash are defaults; use one only if it is the best choice here and say so.

## Typography

- One or two families, chosen for this subject, never the ones reached for on every project. Two families is the norm; never two in one headline.
- Five sizes at most; two or three do the visible work. Display at least 3× body on desktop. Big type does not need to be bold.
- Body 16–20px, line-height 1.5–1.6, measure 60–75 characters (hard limit 88). Headings 1.1–1.3. The size floors are `accessibility`'s: nothing readable below 13px, inputs at least 16px on phones.
- Display over 40px: tracking −0.02 to −0.05em. Uppercase labels, where used at all, +0.03 to +0.05em and short.
- `text-wrap: balance` on headings, `pretty` on paragraphs; `tabular-nums` on prices and numbers in columns.
- Space above a heading is at least twice the space below it.
- Typographic tells: accenting one word in a headline with italic, bold or colour; all caps for labels; a tracked-out eyebrow above every heading.

## Colour

- One ground (most of the screen), one ink, one accent that carries the action and at most one other thing. Status colours only where the site has status.
- Two tiers of tokens: primitives (`--stone-700`) never appear in components; semantic tokens (`text-muted`, `bg-surface`) do. The brand colour is `accent`.
- Contrast measured on the rendered pair, against the painted background behind it, at the ratios `accessibility` sets. Running text in full ink, not grey. Solid fills on the step that passes with white text, which is usually darker than the one that looks right.
- Surfaces separate by a small lightness step, by space, or by a thick bar — not by a hairline on everything and not by a shadow under everything.
- Dark mode, where the brief wants it, is designed: lower accent chroma, a tinted deep ground rather than black, re-measured contrast. Never the light palette inverted.

## Layout

- Responsive from 320px with no horizontal scroll at any width; that is the reflow threshold — a 1280px screen at 400% zoom. Text columns keep a max width; imagery may run full-bleed.
- Margins equal on both sides at every width, 16–20px on phones. Text aligns to two or three left edges on a page; six means nothing was decided.
- Space between groups is at least twice the space within them. Section gaps on desktop are generous (roughly 120–240px) and clearly larger than gaps inside a section.
- No two neighbouring sections share a layout shape; a shape used three times on a page is a template. Each layout family (split, grid, full-width statement, list) at most once per page.
- Structure is information: borders, numbering, dividers and labels encode something about the content. Numbered markers only for a real sequence.
- A void is placed, never left: text in one half means an image, figure or list in the other.
- The footer is a designed close, not four columns of links.

## Images

- One dominant image beats six small ones. Hero media, where used, fills at least half the first screen. Two aspect ratios carry most of the site.
- Only display text sits over a picture — a headline, one line, one action — with contrast measured where the text sits and a neutral scrim over the text area only. Body text never sits on a picture.
- Treatment is page-wide: untouched, greyscale, or darkened. No device mock-ups, duotones, grain, vignettes or tilted frames.
- Provenance ladder: the owner's own → generated to a prompt → licensed stock, credited → drawn → none. A found picture is never presented as the owner's premises, team or work.
- Until a generated image arrives, its slot holds a flat placeholder in a palette neutral at the final dimensions, labelled with its file name — never a stock photo, so it can't be mistaken for a choice.

## Motion

- Every animation is justifiable in one sentence as hierarchy, story, feedback or state change. One orchestrated moment lands; fade-up on every section and hover on every card reads as machine-made.
- Tokens: a duration scale and named easings, so the site moves with one character. Press ~150ms, hover ~200ms, reveals 600–900ms, staggers 60–100ms and at most four steps. No bounce or overshoot unless the brand is playful.
- Reveals fire once, near the viewport edge, with small travel. Nothing in view stays hidden beyond a second; the headline is readable within 1.2 seconds of load.
- No preloader, no gate, no hidden cursor, no scroll hijack. Smooth scrolling only when choreography needs it, and never under reduced motion.
- Under `prefers-reduced-motion`, the page is its finished state; opacity fades may remain. The pause rule and the rest are `accessibility`'s.

## Expressive sites

When the brief's ambition is bold or experimental, the same rules hold with more room:

- **The signature moment** is designed as a storyboard: its trigger, each state, durations, and what it becomes on each device tier. It demonstrates the product, the craft or the place; it never competes with the primary action at a decision point.
- **Device tiers**, each designed: *full* (capable hardware, fine pointer) gets everything; *reduced* (phones, weaker devices) the same idea lighter, with every hover given a tap or scroll equivalent; *static* (reduced motion, Save-Data, no WebGL) a designed still version. The hero text and the primary action never depend on WebGL or JavaScript.
- Pinned and scroll-driven sections never trap a keyboard or a visitor on the way to the action. Split text keeps the full string readable to assistive technology. Sound is opt-in and off by default.

## The tells

These appear in generated work regardless of subject. Each is used only when the plan names it and gives the reason.

**Visual defaults:** warm cream ground with high-contrast serif and a terracotta accent; near-black with one acid accent; the broadsheet (hairlines, zero radius, dense columns); the SaaS card kit (identical rounded cards, one radius everywhere, the same soft shadow under each, gradient washes); icon-in-a-circle feature cards; pill badges; gradient text; glass pills for navigation; glowing orbs and mesh gradients; noise over everything; a 3D blob with no connection to the business; emoji as icons.

**Template chrome:** tracked-out caps eyebrows; meta strings joined with middle dots; `WORD — fragment` labels; tinted near-black standing in for black; a monospace face for small labels; an arrow appended to every link and button; agency micro-meta (local time, coordinates, "scroll").

**Expressive defaults:** a blob cursor or "view" circle; magnetic buttons; split-text fade-up on every heading; a preloader counting to 100; a horizontal-scroll gallery; a logo marquee; nested double-bezel cards; smooth scrolling by reflex.

Removal is not enough. A page with none of these and nothing of its own is still generic. The cure is the subject inventory and the system, not the absence of tells.
