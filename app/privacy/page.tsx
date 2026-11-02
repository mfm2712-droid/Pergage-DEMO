import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy information | Pergage",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  // PROVISIONAL: the whole page is draft preview information. The legal text, controller
  // details, lawful bases, retention and processors must come from Pergage and be reviewed
  // by a UK data protection adviser before launch.
  return (
    <main className="shell page-intro privacy-page">
      <div className="eyebrow">Pergage / Privacy information</div>
      <h1>Privacy, kept clear.</h1>
      <p className="lede">This is draft preview information and must be confirmed before launch.</p>
      <div className="privacy-copy">
        <h2>Preview boundary</h2>
        <p>This preview does not send contact requests to email, a CRM, a database or a booking provider. The scorecard result is calculated for the current session and is not stored by this preview. Analytics are disabled; the consent banner remains available for the future opt-in integration.</p>
        <h2>Information you choose to provide</h2>
        <p>The contact preview uses your name, organisation, email, selected intent and note only to validate the form flow locally. Please do not include health or personal details about individuals.</p>
        <h2>Before launch</h2>
        <p>Pergage will need to confirm its production contact, booking, analytics and CMS providers, controller details, lawful basis, retention wording, cookie choices and the final privacy notice before this site becomes public.</p>
      </div>
    </main>
  );
}
