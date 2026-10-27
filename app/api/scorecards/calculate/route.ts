import { NextResponse } from "next/server";
import { resultBands, scorecardQuestions, type ScorecardType } from "../../../../data/scorecards";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { type?: ScorecardType; answers?: Record<string, number> } | null;
  const type = body?.type;
  const answers = body?.answers;
  if (!type || !answers || !scorecardQuestions[type] || scorecardQuestions[type].some((question) => !Number.isInteger(answers[question.id]) || answers[question.id] < 1 || answers[question.id] > 5)) {
    return NextResponse.json({ error: "Invalid scorecard submission" }, { status: 400 });
  }
  const values = scorecardQuestions[type].map((question) => answers[question.id]);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const band = resultBands.find((candidate) => average >= candidate.min) ?? resultBands.at(-1)!;
  return NextResponse.json({ average, band: band.label, summary: band.summary });
}
