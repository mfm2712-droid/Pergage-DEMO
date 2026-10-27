# Pergage private prototype

This is a private, non-production first build for Pergage Ltd. It is intentionally not connected to `pergage.com`, any booking provider, a database, analytics, or a public deployment.

## Included in this first slice

- UK-English homepage and positioning based on Paul’s 27 October requirements.
- Services, approach and contact sections.
- Scorecard choice page.
- Working organisational and individual scorecard flows using provisional questions.
- Server-side calculation endpoint at `/api/scorecards/calculate`.
- Configurable question and result definitions in `data/scorecards.ts`.

## Explicitly pending approval

- Final logo, colours, copy, questions, weighting and result bands.
- Privacy notice, consent copy, retention/deletion workflow and controller/processor agreement.
- Pergage-owned accounts for GitHub, Vercel, booking and any data store.
- Google Meet/calendar integration and email notifications.
- Lead capture and persistence. No personal data is stored by this prototype.

## Local run

Install dependencies in a local development environment, then run `npm run dev`. The project is designed for a future private preview only; do not add production domains or secrets until Paul approves the provider setup.
