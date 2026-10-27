"use client";

import { useState } from "react";
import { scorecardQuestions, type ScorecardType } from "../data/scorecards";

export function ScorecardShell({ type, title, intro }: { type: ScorecardType; title: string; intro: string }) {
  const questions = scorecardQuestions[type];
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ band: string; summary: string; average: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const complete = questions.every((question) => answers[question.id]);

  async function calculate() {
    setBusy(true);
    const response = await fetch("/api/scorecards/calculate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type, answers }) });
    const data = await response.json();
    setResult(data);
    setBusy(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (result) return <main className="shell result-page"><div className="eyebrow">{title} / Your reflection</div><h1>{result.band}</h1><p className="result-score">{result.average.toFixed(1)} <span>average response</span></p><div className="result-panel"><p>{result.summary}</p><p className="result-note">This is a free, partial reflection. A fuller breakdown can be explored in a conversation with Pergage.</p></div><div className="hero-actions"><a className="button button-dark" href="mailto:engage@pergage.com?subject=Pergage%20scorecard%20follow-up">Talk through the result <span>→</span></a><button className="text-link" onClick={() => setResult(null)}>Take it again <span>↻</span></button></div>{type === "individual" && <p className="health-note">This is a reflection tool, not a health assessment. If you have health concerns, speak to your GP or occupational health.</p>}</main>;

  return <main className="shell scorecard-page"><div className="eyebrow">Pergage scorecards / {type === "individual" ? "For me" : "For my organisation"}</div><h1>{title}</h1><p className="lede">{intro} Select the answer that feels most accurate today.</p><div className="question-list">{questions.map((question, index) => <fieldset className="question" key={question.id}><legend><span>{String(index + 1).padStart(2, "0")}</span>{question.text}</legend><div className="scale">{[1, 2, 3, 4, 5].map((value) => <label key={value} className={answers[question.id] === value ? "selected" : ""}><input type="radio" name={question.id} value={value} checked={answers[question.id] === value} onChange={() => setAnswers({ ...answers, [question.id]: value })} /><span>{value}</span><small>{value === 1 ? "Strongly disagree" : value === 5 ? "Strongly agree" : ""}</small></label>)}</div></fieldset>)}</div><div className="scorecard-submit"><p>{complete ? "Ready to see your reflection." : `${questions.length - Object.keys(answers).length} questions remaining`}</p><button className="button button-dark" disabled={!complete || busy} onClick={calculate}>{busy ? "Calculating…" : "See my result"} <span>↗</span></button></div>{type === "individual" && <p className="health-note">This is a reflection tool, not a health assessment. If you have health concerns, speak to your GP or occupational health.</p>}</main>;
}
