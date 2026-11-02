import type { Metadata } from "next";
import { insightEntries } from "../../content/insights";

export const metadata: Metadata = {
  title: "Insights | Pergage",
  description: "Pergage insights and articles on capable work and organisational improvement.",
  robots: { index: false, follow: false },
};

export default function InsightsPage() {
  // PROVISIONAL: placeholder page; the introduction about "human performance reliability" needs
  // Paul's confirmation, and no articles exist until he approves them.
  return (
    <main className="shell page-intro provisional-page">
      <div className="eyebrow">Pergage / Insights</div>
      <h1>Ideas for capable work.</h1>
      <p className="lede">
        A place for Paul’s future articles and perspectives on human performance reliability and
        organisational capability.
      </p>

      {insightEntries.length > 0 ? (
        <div className="insight-list" aria-label="Pergage articles">
          {insightEntries.map((entry) => (
            <article className="insight-card" key={entry.slug}>
              <div className="eyebrow">{entry.publishedAt ?? "Draft"}</div>
              <h2>{entry.title}</h2>
              <p>{entry.summary}</p>
              <a className="text-link" href={`/insights/${entry.slug}`}>Read the article <span>↗</span></a>
            </article>
          ))}
        </div>
      ) : (
        <section className="provisional-panel" aria-labelledby="insights-status">
          <div className="eyebrow" id="insights-status">Editorial structure ready</div>
          <h2>No articles published in this preview.</h2>
          <p>
            The section is ready for approved articles. Each future piece can carry its own title,
            description, author, date and clean URL through the chosen CMS.
          </p>
        </section>
      )}

      <a className="text-link" href="/about">Read the founder profile plan <span>↗</span></a>
    </main>
  );
}
