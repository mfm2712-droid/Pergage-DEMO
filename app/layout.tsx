import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pergage | Engagement, engineered",
  description:
    "Pergage engineers the conditions that help people and organisations stay capable.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <header className="site-header">
          <a className="wordmark" href="/" aria-label="Pergage home">
            PERGAGE<span>.</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="/#approach">Approach</a>
            <a href="/#services">Services</a>
            <a href="/scorecards">Scorecards</a>
            <a className="nav-cta" href="/#contact">Talk to us</a>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <a className="wordmark" href="/">PERGAGE<span>.</span></a>
            <p>Engagement, engineered.</p>
          </div>
          <div className="footer-meta">
            <a href="mailto:engage@pergage.com">engage@pergage.com</a>
            <a href="https://www.linkedin.com/in/pergage" target="_blank" rel="noreferrer">LinkedIn</a>
            <span>UK</span>
          </div>
          <small>Pergage Ltd. Registered in England and Wales, company number 17495158.</small>
        </footer>
      </body>
    </html>
  );
}
