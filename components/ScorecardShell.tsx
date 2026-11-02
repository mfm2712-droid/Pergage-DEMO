"use client";

import { useEffect, useRef, useState } from "react";
import { scorecardQuestions, type ScorecardType } from "../data/scorecards";

export function ScorecardShell({ type, title, intro }: { type: ScorecardType; title: string; intro: string }) {
  const questions = scorecardQuestions[type];
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ band: string; summary: string; average: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [scorecardAcknowledgement, setScorecardAcknowledgement] = useState(false);
  const [scorecardConsent, setScorecardConsent] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [entryLoading, setEntryLoading] = useState(true);
  const complete = questions.every((question) => answers[question.id]);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setEntryLoading(false), reduceMotion ? 120 : 700);
    return () => window.clearTimeout(timer);
  }, []);

  // Move focus to the result so keyboard and screen reader users land on it.
  useEffect(() => {
    if (result) resultHeading.current?.focus();
  }, [result]);

  async function calculate() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/scorecards/calculate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type, answers, scorecardAcknowledgement, scorecardConsent, newsletterOptIn }), signal: AbortSignal.timeout(15000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to calculate this reflection");
      setResult(data);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    } catch {
      setError("The reflection could not be calculated. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (entryLoading) return <main className="shell scorecard-page scorecard-route-loading" aria-busy="true"><div className="score-demo__processing"><div className="score-demo__ring"><span /></div><h1>Opening your reflection…</h1><p className="lede">Preparing a private, provisional scorecard demo.</p></div></main>;

  if (result) return <main className="shell result-page"><div className="eyebrow">{title} / Your reflection</div><h1 ref={resultHeading} tabIndex={-1}>{result.band}</h1><p className="result-score">{result.average.toFixed(1)} <span>average response</span></p><div className="result-panel" role="status" aria-live="polite"><p>{result.summary}</p><p className="result-note">This is a free, partial reflection. A fuller breakdown can be explored in a conversation with Pergage.</p></div><div className="hero-actions"><a className="button button-dark" href="mailto:engage@pergage.com?subject=Pergage%20scorecard%20follow-up">Talk through the result <span>→</span></a><button className="text-link" onClick={() => setResult(null)}>Take it again <span>↻</span></button></div>{type === "individual" && <p className="health-note">This is a reflection tool, not a health assessment. If you have health concerns, speak to your GP or occupational health.</p>}</main>;

  return <main className="shell scorecard-page"><div className="eyebrow">Pergage scorecards / {type === "individual" ? "For me" : "For my organisation"}</div><h1>{title}</h1><p className="lede">{intro} Select the answer that feels most accurate today.</p><div className="question-list">{questions.map((question, index) => <fieldset className="question" key={question.id}><legend><span>{String(index + 1).padStart(2, "0")}</span>{question.text}</legend><div className="scale">{[1, 2, 3, 4, 5].map((value) => <label key={value} className={answers[question.id] === value ? "selected" : ""}><input type="radio" name={question.id} value={value} checked={answers[question.id] === value} onChange={() => setAnswers({ ...answers, [question.id]: value })} /><span>{value}</span><small>{value === 1 ? "Strongly disagree" : value === 5 ? "Strongly agree" : ""}</small></label>)}</div></fieldset>)}</div>{/* PROVISIONAL: consent, acknowledgement and newsletter wording is draft (including the promise that people can unsubscribe); the final legal text must come from Pergage. */}<div className="consent-panel"><label className="checkbox-row"><input type="checkbox" checked={scorecardAcknowledgement} onChange={(event) => setScorecardAcknowledgement(event.target.checked)} /><span>I understand this is a short reflection, not a diagnosis or individual advice.</span></label><label className="checkbox-row"><input type="checkbox" checked={scorecardConsent} onChange={(event) => setScorecardConsent(event.target.checked)} /><span>I consent to Pergage processing my answers to calculate this result. See the <a href="/privacy">preview privacy information</a>.</span></label><label className="checkbox-row"><input type="checkbox" checked={newsletterOptIn} onChange={(event) => setNewsletterOptIn(event.target.checked)} /><span>Optional: send me occasional Pergage updates. This choice is separate, and you can unsubscribe.</span></label></div><div className="scorecard-submit"><p aria-live="polite">{complete ? (scorecardAcknowledgement && scorecardConsent ? "Ready to see your reflection." : "Please confirm the reflection and processing choices.") : `${questions.length - Object.keys(answers).length} questions remaining`}</p><button className="button button-dark" disabled={!complete || !scorecardAcknowledgement || !scorecardConsent || busy} onClick={calculate}>{busy ? "Calculating…" : "See my result"} <span>↗</span></button></div>{error ? <p className="form-error" role="alert">{error}</p> : null}{type === "individual" && <p className="health-note">If you have health concerns, speak to your GP or occupational health. Pergage does not provide individual health advice.</p>}</main>;
}
