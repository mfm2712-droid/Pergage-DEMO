# Pergage private prototype

This is a private, non-production first build for Pergage Ltd. It is intentionally not connected to `pergage.com`, any booking provider, a database, analytics, or a public deployment.

Working visual direction: **Proposal 04 / Midnight Gilt** from the Design Studio. The local preview is kept separate from production until the final content, integrations and launch checks are approved.

## Included in this first slice

- UK-English homepage and positioning based on Paul’s 27 October requirements.
- Services, approach and contact sections.
- Scorecard choice page.
- Working organisational and individual scorecard flows using provisional questions.
- Server-side calculation endpoint at `/api/scorecards/calculate`.
- Configurable question and result definitions in `data/scorecards.ts`.
- Visual cycle, three-zone model and performance pyramid from the Mission & Framework Brief.
- Separate scorecard consent and optional newsletter opt-in.
- Preview-only conversation form and consent banner; no external data transfer or storage.
- Local content-provider boundary and launch-gated `robots.txt` / sitemap.

## Explicitly pending approval

- Final logo, colours, copy, questions, weighting and result bands.
- Privacy notice, consent copy, retention/deletion workflow and controller/processor agreement.
- Pergage-owned accounts for GitHub, Vercel, booking and any data store.
- Google Meet/calendar integration and email notifications.
- Lead capture and persistence. No personal data is stored by this prototype.

See `docs/TECHNICAL_START.md` for the concrete handoff plan and current blockers.

## Local run

Install dependencies in a local development environment, then run `npm run dev`. The project is designed for a future private preview only; do not add production domains or secrets until Paul approves the provider setup.

## Launch gating and checks
See `docs/HARDENING_LOG.md` and `.env.example`. `npm run check:launch` lists provisional items; `npm run test:preview` runs black box checks against a running server.
