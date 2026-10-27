## Documentation map

| Type | Location |
| --- | --- |
| Site brief | `docs/site-brief.md` |
| Site plan | `docs/site-plan.md` |
| Page tracker | `docs/pages.md` |
| Design system | `DESIGN.md` (project root) |
| Style tile *(only without the canvas)* | `docs/design/style-tile.html` |
| Copy decks | `docs/copy/` |
| Approved designs | `docs/design/screens/` |
| Design references *(yours, optional, never committed)* | `docs/design/references/` |
| Image prompts | `docs/design/images.md` |
| Audits | `docs/audits/` |
| Launch record | `docs/launch.md` |
| Analytics events | `docs/analytics-events.md` |
| Infra setup | `docs/infra/` |

## Project configuration

<!-- The site skills read these. Anything missing, they ask for once and write the answer here.
     /site-brief fills in the first block; /site-setup fills in the commands and URLs. -->

| Key | Value |
| --- | --- |
| Site name | |
| What it is for | one line: who visits, and what they should do |
| Site type | landing page / multi-page site |
| Primary action | book / call / quote / buy / apply / subscribe / donate / contact |
| Ambition | restrained / bold / experimental |
| Market | country, language, currency |
| Stack | {{STACK}} |
| Domain | |
| Canonical host | `www` or bare |
| Form delivery | the inbox, CRM, calendar or messaging tool submissions go to |
| Analytics | provider, or none |
| CMS | none, or the one the plan chose |
| Dev server command | |
| Check command | `pnpm check` |
| Preview URL | |
| Production URL | |
| Design system | not written yet — `/design-system` updates this |
| Design canvas | /design (Claude Design in Claude Code) |
| Design references | Mobbin, through its MCP, when connected. Without it: — *(web research, your screenshots, or both; asked once if blank)*. Your own screenshots, if any, go in `docs/design/references/` (optional, never committed) |
| Image generation | Gemini, through its MCP, or none |
| Stock photo providers | Unsplash / Pexels — which are configured; their keys live in `.env.local` |
| Production status | not yet launched |
