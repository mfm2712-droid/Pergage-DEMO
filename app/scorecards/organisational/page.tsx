import type { Metadata } from "next";
import { ScorecardShell } from "../../../components/ScorecardShell";

export const metadata: Metadata = {
  title: "Organisational Readiness | Pergage",
  description: "A private, provisional reflection on the conditions that help organisations stay capable.",
};

export default function OrganisationalScorecardPage() {
  return <ScorecardShell type="organisational" title="Organisational Readiness" intro="A short reflection on how well your organisation maintains its people’s capability." />;
}
