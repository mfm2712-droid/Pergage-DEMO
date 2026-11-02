import { NextResponse } from "next/server";
import { resultBands, scorecardQuestions, type ScorecardType } from "../../../../data/scorecards";
import { isPlainRecord, noStoreHeaders, readJsonBody } from "../../../../lib/request";

export async function POST(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status, headers: noStoreHeaders });
  }
  if (!isPlainRecord(parsed.value)) {
    return NextResponse.json({ error: "Invalid scorecard submission" }, { status: 400, headers: noStoreHeaders });
  }

  const type = parsed.value.type;
  const answers = parsed.value.answers;
  const validType = type === "individual" || type === "organisational";
  const validAnswers = isPlainRecord(answers);
  const questions = validType ? scorecardQuestions[type as ScorecardType] : [];
  const knownIds = new Set(questions.map((question) => question.id));
  const hasOnlyKnownAnswers = validAnswers && Object.keys(answers).every((id) => knownIds.has(id));
  const completeAnswers = validAnswers && questions.every((question) => Number.isInteger(answers[question.id]) && Number(answers[question.id]) >= 1 && Number(answers[question.id]) <= 5);
  const scorecardAcknowledgement = parsed.value.scorecardAcknowledgement === true;
  const scorecardConsent = parsed.value.scorecardConsent === true;
  const newsletterOptIn = parsed.value.newsletterOptIn === true;

  if (!validType || !validAnswers || !hasOnlyKnownAnswers || !completeAnswers || !scorecardAcknowledgement || !scorecardConsent) {
    return NextResponse.json({ error: "Invalid scorecard submission" }, { status: 400, headers: noStoreHeaders });
  }
  const values = questions.map((question) => Number(answers[question.id]));
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const band = resultBands.find((candidate) => average >= candidate.min) ?? resultBands.at(-1)!;
  return NextResponse.json({ average, band: band.label, summary: band.summary, stored: false, newsletterOptIn }, { headers: noStoreHeaders });
}
