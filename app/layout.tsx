import type { Metadata } from "next";
import "./globals.css";
import { ConsentBanner } from "../components/ConsentBanner";
import { StructuredData } from "../components/StructuredData";
import { isIndexable, siteUrl } from "../lib/launch.mjs";


export const metadata: Metadata = {
  title: "Pergage | Engagement, engineered",
  description:
    "Pergage engineers the conditions that help people and organisations stay capable.",
  // Keep every preview out of search until Paul approves the design and launch setup.
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  robots: { index: isIndexable, follow: isIndexable },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Pergage",
            ...(siteUrl ? { url: siteUrl } : {}),
          }}
        />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <header className="nav" id="top">
          <div className="nav__pill">
            <a className="brand" href="/" aria-label="Pergage — back to top">
              <span className="logo"><img src="/assets/pergage-logo-reverse.svg" alt="Pergage" width="2851" height="859" /></span>
            </a>
            <nav className="nav__links" aria-label="Primary">
              <a href="/#approach">Approach</a>
              <a href="/#services">Services</a>
              <a href="/#method">Method</a>
              <a href="/#scorecards">Scorecards</a>
              <a href="/about">Founder</a>
              <a href="/insights">Insights</a>
              <a className="nav-cta" href="/#contact">Talk to us</a>
            </nav>
            <a className="nav__menu" href="/#contact" aria-label="Open menu">Menu</a>
          </div>
        </header>
        <div id="main-content">{children}</div>
        <ConsentBanner />
        {!isIndexable ? <div className="preview-strip" role="status">Private preview · no forms, analytics or booking connected · submissions are not stored.</div> : null}
        <footer className="site-footer">
          <div>
            <a className="brand" href="/" aria-label="Pergage home"><span className="logo"><img src="/assets/pergage-logo-reverse.svg" alt="Pergage" width="2851" height="859" /></span></a>
            <p>Engagement, engineered.</p>
          </div>
          <div className="footer-meta">
            <a href="mailto:engage@pergage.com">engage@pergage.com</a>
            <span>United Kingdom</span>
            <a href="/about">Founder</a>
            <a href="/insights">Insights</a>
            <a href="/privacy">Privacy</a>
          </div>
          <small>Founder details and external profile links will be added after Paul verifies them.</small>
        </footer>
      </body>
    </html>
  );
}
