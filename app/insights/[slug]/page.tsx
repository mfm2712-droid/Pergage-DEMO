import { notFound } from "next/navigation";
import { insightEntries } from "../../../content/insights";

export function generateStaticParams() {
  return insightEntries.map((entry) => ({ slug: entry.slug }));
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = insightEntries.find((item) => item.slug === slug);
  if (!entry) notFound();

  return (
    <main className="shell page-intro">
      <div className="eyebrow">Pergage / Insights / {entry.publishedAt ?? "Draft"}</div>
      <h1>{entry.title}</h1>
      <p className="lede">{entry.summary}</p>
      <p className="provisional-copy">Article body will be added after Paul approves the content.</p>
    </main>
  );
}
