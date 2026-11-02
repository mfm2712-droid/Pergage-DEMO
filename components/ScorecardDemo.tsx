"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { scorecardQuestions, type ScorecardType } from "../data/scorecards";

type Stage = "intro" | "question" | "processing" | "results";

const scales = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
const individualScales = ["Rarely", "Sometimes", "About half the time", "Often", "Almost always"];
const areaNames: Record<ScorecardType, string[]> = {
  organisational: ["Clarity", "Agency", "Capability", "Feedback"],
  individual: ["Clarity", "Autonomy", "Support", "Growth"],
};

function average(values: number[]) {
  return values.length ? Math.round(((values.reduce((sum, value) => sum + value, 0) / values.length - 1) / 4) * 100) : 0;
}

function NetworkAnimation() {
  return (
    <svg className="score-demo__network" viewBox="0 0 320 220" aria-hidden="true">
      <g>
        {[[40, 60, 120, 25], [120, 25, 200, 70], [200, 70, 280, 30], [40, 60, 90, 145], [90, 145, 170, 150], [170, 150, 250, 130], [250, 130, 280, 30], [90, 145, 130, 205], [130, 205, 230, 205], [170, 150, 130, 205]].map(([x1, y1, x2, y2], index) => (
          <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} style={{ animationDelay: `${index * 0.12}s` }} />
        ))}
        {[[40, 60], [120, 25], [200, 70], [280, 30], [90, 145], [170, 150], [250, 130], [130, 205], [230, 205]].map(([cx, cy], index) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index === 5 ? 9 : 6} style={{ animationDelay: `${index * 0.15}s` }} />
        ))}
      </g>
    </svg>
  );
}

function RingAnimation() {
  return <div className="score-demo__ring"><span /></div>;
}

export function ScorecardDemo({ type }: { type: ScorecardType }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const questions = scorecardQuestions[type];
  const title = type === "organisational" ? "Organisational Readiness" : "Individual Readiness";
  const names = areaNames[type];
  const titleId = `score-demo-title-${type}`;

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (stage !== "question" || event.altKey || event.ctrlKey || event.metaKey) return;
      if (/^[1-5]$/.test(event.key)) choose(Number(event.key));
      if (event.key === "Enter" && answers[step]) next();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("score-demo-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("score-demo-open");
    };
  }, [open, stage, step, answers]);

  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setStage("intro");
    setStep(0);
    setAnswers([]);
  }

  function close() {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  }

  function choose(value: number) {
    setAnswers((current) => {
      const nextAnswers = [...current];
      nextAnswers[step] = value;
      return nextAnswers;
    });
  }

  function next() {
    if (!answers[step]) return;
    if (step < questions.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    setStage("processing");
    timer.current = setTimeout(() => setStage("results"), reducedMotion ? 650 : 2300);
  }

  function goBack() {
    if (stage === "question" && step > 0) setStep((current) => current - 1);
    else setStage("intro");
  }

  const score = useMemo(() => average(answers), [answers]);
  const areas = useMemo(() => names.map((name, index) => ({
    name,
    value: average(questions.map((_, questionIndex) => questionIndex % names.length === index ? (answers[questionIndex] ?? 3) : 0).filter(Boolean)),
  })), [answers, names, questions]);
  const band = score < 40 ? "Early foundations" : score < 70 ? "Building" : "Well established";
  const progressCount = answers.filter(Boolean).length;

  const intro = (
    <>
      <p className="score-demo__banner"><strong>Demo:</strong> example questions and results are fictitious, not the real tool.</p>
      <h2 id={titleId}>{title}</h2>
      <p className="score-demo__lede">{type === "organisational" ? "Eight example statements across four areas. Choose how far each one reflects your organisation today." : "Eight example statements about your own working conditions. Slide to show how often each one is true for you."}</p>
      <ul className="score-demo__facts">
        {type === "organisational" ? (
          <>
            <li><span>Who it is for</span>MDs and senior leaders</li>
            <li><span>Format</span>8 statements, one per screen</li>
            <li><span>Your answers</span>Stay on this page. Nothing is saved or sent.</li>
          </>
        ) : (
          <>
            <li><span>For</span>Individuals</li>
            <li><span>Format</span>8 statements, a slider for each</li>
            <li><span>Privacy</span>Stays on this page. Nothing is saved or sent.</li>
          </>
        )}
      </ul>
      <p className="score-demo__notice">This is a reflection tool, not a health assessment. If you have health concerns, speak to your GP or occupational health.</p>
      <div className="score-demo__actions"><button className="btn-gold" type="button" onClick={() => setStage("question")}><span>{type === "organisational" ? "Start the Scorecard" : "Begin the reflection"}</span><i aria-hidden="true">→</i></button><button className="btn-line" type="button" onClick={close}>Close</button></div>
    </>
  );

  const organisationalQuestion = (
    <>
      <p className="score-demo__banner"><strong>Demo:</strong> example questions and results are fictitious, not the real tool.</p>
      <div className="score-demo__progress"><p>Question {step + 1} of {questions.length}<span> · {names[step < 2 ? 0 : step < 4 ? 1 : step < 6 ? 2 : 3]}</span></p><div><span style={{ width: `${(step / questions.length) * 100}%` }} /></div></div>
      <fieldset className="score-demo__question"><legend>{questions[step].text}</legend><div className="score-demo__options">{scales.map((label, index) => <label key={label} className={answers[step] === index + 1 ? "is-selected" : ""}><input type="radio" name={`demo-${type}`} value={index + 1} checked={answers[step] === index + 1} onChange={() => choose(index + 1)} /><span>{index + 1}</span><small>{label}</small></label>)}</div></fieldset>
      <p className="score-demo__hint">Use the arrow keys or press 1 to 5, then Enter.</p>
      <div className="score-demo__actions score-demo__actions--between"><button className="btn-line" type="button" onClick={goBack}>{step === 0 ? "Back to intro" : "Back"}</button><button className="btn-gold" type="button" disabled={!answers[step]} onClick={next}><span>{step === questions.length - 1 ? "See example results" : "Next"}</span><i aria-hidden="true">→</i></button></div>
    </>
  );

  const individualQuestion = (
    <>
      <p className="score-demo__banner"><strong>Demo:</strong> example questions and results are fictitious, not the real tool.</p>
      <p className="score-demo__progress-label">Statement {step + 1} of {questions.length}<span> · {names[Math.floor(step / 2)]}</span></p>
      <h2 className="score-demo__statement">{questions[step].text}</h2>
      <label className="score-demo__slider-label" htmlFor={`ind-range-${step}`}>Move the slider</label>
      <input className="score-demo__slider" id={`ind-range-${step}`} type="range" min="1" max="5" step="1" value={answers[step] ?? 3} aria-label={questions[step].text} onChange={(event) => choose(Number(event.target.value))} />
      <div className="score-demo__slider-scale" aria-hidden="true">{individualScales.map((label) => <span key={label}>{label}</span>)}</div>
      <p className="score-demo__hint">Use the arrow keys or press 1 to 5, then Enter.</p>
      <div className="score-demo__actions score-demo__actions--between"><button className="btn-line" type="button" onClick={goBack}>{step === 0 ? "Back to intro" : "Previous"}</button><button className="btn-gold" type="button" disabled={!answers[step]} onClick={next}><span>{step === questions.length - 1 ? "Reflect on my answers" : "Continue"}</span><i aria-hidden="true">{step === questions.length - 1 ? "↗" : "→"}</i></button></div>
    </>
  );

  const processing = (
    <div className="score-demo__processing">
      {type === "organisational" ? <NetworkAnimation /> : <RingAnimation />}
      <h2 id={titleId}>{type === "organisational" ? "Connecting your answers…" : "Reflecting on your answers…"}</h2>
      <p className="score-demo__lede">{type === "organisational" ? "Mapping the four areas with placeholder logic to generate example results." : "Bringing the four themes together with placeholder logic."}</p>
    </div>
  );

  const results = (
    <>
      <p className="score-demo__banner"><strong>Demo:</strong> example questions and results are fictitious, not the real tool.</p>
      <p className="kicker">Example results</p><h2 id={titleId}>{title}</h2>
      <div className="score-demo__result-top"><div><strong>{score}</strong><span>/ 100</span><em>{band}</em></div>{type === "organisational" ? <div className="score-demo__radar" aria-label="Example scores by area">{areas.map((area) => <span key={area.name} style={{ height: `${Math.max(area.value, 6)}%` }} title={`${area.name}: ${area.value}`} />)}</div> : <div className="score-demo__gauge"><span style={{ height: `${Math.max(score, 6)}%` }} /></div>}</div>
      <ul className="score-demo__bars" aria-label="Example scores by area">{areas.map((area) => <li key={area.name}><span>{area.name}</span><i><b style={{ width: `${area.value}%` }} /></i><strong>{area.value}</strong></li>)}</ul>
      {type === "organisational" ? <><h3 className="score-demo__where">Where to look first (example)</h3><ul className="score-demo__where-list"><li><strong>I Clarity:</strong> share the reasons behind priorities with the teams affected, and check that people can link their daily work to them.</li><li><strong>II Agency:</strong> let the people closest to the work test small changes, and show them which of their ideas were acted on.</li></ul></> : null}
      <p className="score-demo__summary">{type === "organisational" ? "In this example, most conditions look supported. The opportunity is to measure them over time so gains are maintained, not rescued." : "This example suggests a useful starting point for a focused conversation. The final questions, scoring and result copy remain subject to Paul’s approval."}</p>
      <div className="score-demo__actions"><button className="btn-gold" type="button" onClick={reset}><span>Retake the demo</span><i aria-hidden="true">↻</i></button><a className="btn-line" href={`/scorecards/${type}`}>Open full reflection</a><button className="btn-line" type="button" onClick={close}>Close</button></div>
    </>
  );

  const stageContent = stage === "intro" ? intro : stage === "processing" ? processing : stage === "results" ? results : type === "organisational" ? organisationalQuestion : individualQuestion;
  const showIndividualRail = type === "individual" && stage === "question";

  const dialog = open ? (
    <div className={`score-demo__overlay score-demo__overlay--${type} score-demo__overlay--${stage}`} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section className={`score-demo score-demo--${type} score-demo--stage-${stage}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="score-demo__top">
          <p className="kicker">Scorecard demo · {title}</p>
          <button className="score-demo__close" type="button" onClick={close}>Close</button>
        </div>
        {showIndividualRail ? (
          <div className="score-demo__individual-grid">
            <aside className="score-demo__rail" aria-label="Your progress"><p>Your progress</p><ol>{questions.map((question, index) => <li className={index === step ? "is-current" : answers[index] ? "is-complete" : ""} key={question.id}><span>{index + 1}</span>{names[Math.floor(index / 2)]}</li>)}</ol><strong>{progressCount}/{questions.length}</strong></aside>
            <div className="score-demo__stage" aria-live="polite">{stageContent}</div>
          </div>
        ) : <div className="score-demo__stage" aria-live="polite">{stageContent}</div>}
      </section>
    </div>
  ) : null;

  return (
    <>
      <button className="btn-gold btn-gold--block" type="button" onClick={() => { reset(); setOpen(true); }}>
        <span>{type === "organisational" ? "Start the Organisational Scorecard" : "Start the Individual Scorecard"}</span><i aria-hidden="true">→</i>
      </button>

      {dialog && typeof document !== "undefined" ? createPortal(dialog, document.body) : null}
    </>
  );
}
