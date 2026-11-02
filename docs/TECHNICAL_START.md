# Pergage technical start

Date: 2 November 2026

This branch is a private, preview-only Next.js/TypeScript build using **Proposal 04 / Midnight Gilt** as the working visual direction. It is not connected to production, analytics, a CRM, a booking provider or a CMS account.

## Implemented locally

- Homepage language leads with the elephant insight and the gardener/conditions idea.
- Visual framework for the `Teach & Coach → Trust → Agency → Ownership → Performance → Culture` cycle.
- Visual three-zone model and performance pyramid from the Mission & Framework Brief.
- Two scorecard entry points with eight provisional V4-mirroring questions per journey and simple example scoring, clearly labelled as demos.
- Separate scorecard-processing consent and optional newsletter opt-in.
- Essential-only / analytics consent banner boundary; no analytics script is active.
- Conversation form validation with a preview-only API response; no data is sent or stored.
- `robots.txt`, `sitemap.xml` and page metadata default to `noindex` until an explicit launch flag is set.
- Copy and integration boundaries remain local so a future CMS, booking provider and email provider can be added without embedding credentials in the site.

## Decisions still required

1. Record Paul's explicit approval of Proposal 04 / Midnight Gilt as the final design direction before production.
2. The exact production source repository must be confirmed. The Vercel deployment was uploaded by CLI and has no connected Git repository.
3. Paul must approve final copy, scorecard questions, scoring, result language and any founder/profile facts or external profile URLs.
4. Pergage must choose and own the CMS, booking provider, email/CRM destination, analytics account and privacy wording.
5. A Pergage-owned production Vercel project/domain and delegated developer access must be confirmed before deployment.

## Safe next sequence

1. Capture Paul's design choice and copy corrections.
2. Confirm or create the Pergage-owned Git repository and connect a separate Vercel preview project.
3. Replace provisional scorecards with approved questions, data-retention rules and result wording.
4. Connect the selected CMS, booking and email adapters with explicit environment variables and consent checks.
5. Run accessibility, mobile, typecheck, build and end-to-end form/scorecard checks in preview.
6. Only then prepare a production deployment and switch the launch flag.
