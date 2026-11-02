# Pergage build status — 2 November 2026

## Created

- Local private Git repository, branch `main`, initial commit `e8e4c4b`.
- Next.js/React/TypeScript project structure.
- First homepage and responsive visual system.
- Provisional scorecard flow for organisational and individual use, mirroring the V4 demo's eight-question journeys.
- Server-side calculation route with configurable definitions.
- Requirements trace and explicit launch boundaries.
- Proposal 04 / Midnight Gilt selected as the working visual base; Grok’s “v3” is treated as a refinement reference, not a proposal number.
- Founder / About and Insights / Articles routes added as provisional, no-invented-content scaffolding.
- Private preview APIs hardened with JSON type checks, body limits, `no-store` and noindex headers.

## Checked

- `npm run typecheck` passes.
- `npm run build` passes and generates the home, scorecard, privacy, Founder / About and Insights routes.
- `git diff --check` passes.
- Local API checks return clean `415`/`400` responses for malformed requests and `200` preview responses with `stored: false` for valid requests.
- Contact and scorecard API responses include `Cache-Control: no-store` and `X-Robots-Tag: noindex` in the preview.
- Local browser inspection confirms the skip link, logical heading order, navigation to Founder/Insights/Scorecards, framework list semantics and the founding-partner hash preselection after hydration.

## Not done / blocked by approval or ownership

- No GitHub remote repository was created: the available GitHub connector has no repository-creation operation, and the local `gh` credential is invalid.
- No Vercel project or deployment was created from this local preview: there is no confirmed Pergage-owned Vercel team/account yet.
- No domains, DNS, production hosting, purchases, analytics or personal-data storage were changed.
- Paul still needs to approve the Founder / About biography, official profile URLs, Insights content, final scorecard questions/scoring/results, booking provider and final privacy wording.
- The official Pergage reverse SVG logo is now stored at `public/assets/pergage-logo-reverse.svg` and used in the header/footer. Licensed/local Newsreader and Montserrat font assets are still not present; the preview uses a declared fallback stack until those assets are supplied.
- The Proposal 04 photographic treatment is implemented with stock-image URLs for this preview; replace them with Pergage-owned/licensed local files before production.
- A CMS, email/CRM destination, booking provider and analytics account are intentionally not connected.
