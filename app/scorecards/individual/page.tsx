import type { Metadata } from "next";
import { ScorecardShell } from "../../../components/ScorecardShell";

export const metadata: Metadata = {
  title: "Individual Readiness | Pergage",
  description: "A private, provisional reflection on the conditions that support good work.",
};

export default function IndividualScorecardPage() {
  return <ScorecardShell type="individual" title="Individual Readiness" intro="A short reflection on the conditions and habits that help you perform well." />;
}
