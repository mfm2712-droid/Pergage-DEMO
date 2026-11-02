import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founder / About | Pergage",
  description: "A provisional founder profile page for Pergage, awaiting verified details.",
  robots: { index: false, follow: false },
};

// PROVISIONAL: the whole page is a placeholder until Paul supplies verified biography, experience,
// qualifications and profile links. The sentence about search engines below is internal planning
// wording and should not stay on the public page.
export default function AboutPage() {
  return (
    <main className="shell page-intro provisional-page">
      {/* PROVISIONAL: the Person JSON-LD (name "Dr Paul O’Connell CEng", worksFor Pergage) is withheld until Paul
          confirms the exact name, title and post-nominals. "CEng" is a protected title and was not verified against a
          supplied source. Restore it with <StructuredData data={{ "@type": "Person", ... }} /> once confirmed. */}
      <div className="eyebrow">Pergage / Founder</div>
      {/* PROVISIONAL: heading previously read "Dr Paul O’Connell CEng"; see the note above. */}
      <h1>Founder profile</h1>
      <p className="lede">
        This founder profile is being prepared as part of Pergage’s professional presence.
      </p>

      <section className="provisional-panel" aria-labelledby="profile-status">
        <div className="eyebrow" id="profile-status">Awaiting approval</div>
        <h2>Only verified details will be published here.</h2>
        <p>
          The final page will bring together Paul’s approved biography, professional experience,
          qualifications and official profile links. This private preview does not invent or infer
          any of those details.
        </p>
        <p>
          When approved, this page will be the stable home for the founder profile and the
          Person–Organization relationship that Pergage wants search engines to understand.
        </p>
      </section>

      <a className="text-link" href="/insights">See the Insights structure <span>↗</span></a>
    </main>
  );
}
