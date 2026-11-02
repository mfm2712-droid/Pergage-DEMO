# Hardening log (technical pass, preview only)

Scope: robustness, launch gating, accessibility, privacy boundaries, mobile. No deploys, no external accounts.

## Changes
- API: contact and scorecard routes reject non JSON (415), bodies over 10 KB (413, enforced while streaming), malformed JSON (400), control characters and over-long fields; responses are `Cache-Control: no-store`; nothing is stored, logged or echoed.
- Launch gating: `lib/launch.mjs` is the single source. Indexable only with SITE_LAUNCH=true AND VERCEL_ENV=production AND a valid https NEXT_PUBLIC_SITE_URL. `X-Robots-Tag` rules never overlap; robots.txt disallows `/` in preview and only `/api/` after launch; sitemap is empty until launch and excludes draft pages (/privacy, /about, /insights).
- Provisional gate: `PROVISIONAL:` comments and `provisional()` entries are listed by `npm run check:launch`; `npm run build` fails when SITE_LAUNCH=true while any remain.
- Security headers: nosniff, referrer policy, X-Frame-Options, Permissions-Policy. No CSP yet (needs final providers).
- Forms: per-field errors, focus management, intent preselected from the founding-partner link, request timeouts, honest "Request" labels while no booking exists.
- CSS: contrast fixes, visible focus rings (including the radio scale), 44px mobile nav targets, header wrapping on small screens.
- Founder credential "Dr Paul O’Connell CEng" removed from rendered text and Person JSON-LD (kept in PROVISIONAL comments) until Paul confirms.

## Checks
- `npm run test:preview` against a running server (`BASE_URL`, `EXPECT_INDEXABLE`).
- `npm run check:launch` lists provisional items.

## Not verified
- Contrast over the hero photograph (images are loaded from a third-party host; see the report).
- Real screen reader testing; a CSP; fonts are referenced but not loaded.
