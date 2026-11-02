import { NextResponse } from "next/server";
import { hasControlCharacters, isOptIn, isPlainRecord, noStoreHeaders, readJsonBody } from "../../../lib/request";

export async function POST(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status, headers: noStoreHeaders });
  }

  if (!isPlainRecord(parsed.value)) {
    return NextResponse.json({ error: "Invalid conversation request" }, { status: 400, headers: noStoreHeaders });
  }

  const name = typeof parsed.value.name === "string" ? parsed.value.name.trim() : "";
  const organisation = typeof parsed.value.organisation === "string" ? parsed.value.organisation.trim() : "";
  const email = typeof parsed.value.email === "string" ? parsed.value.email.trim() : "";
  const intent = parsed.value.intent;
  const note = typeof parsed.value.note === "string" ? parsed.value.note.trim() : "";
  const privacyConsent = parsed.value.privacyConsent === "yes";
  const newsletterOptIn = isOptIn(parsed.value.newsletterOptIn);

  const fields: Record<string, string> = {};
  if (!name || name.length > 120 || hasControlCharacters(name)) fields.name = "Enter a name of 120 characters or fewer.";
  if (organisation.length > 160 || hasControlCharacters(organisation)) fields.organisation = "Use 160 characters or fewer.";
  if (!email || email.length > 254 || hasControlCharacters(email) || !/^\S+@\S+\.\S+$/.test(email)) fields.email = "Enter a valid email address.";
  if (note.length > 2000 || hasControlCharacters(note)) fields.note = "Use 2,000 characters or fewer.";
  if (intent !== "conversation" && intent !== "founding-partner") fields.intent = "Choose a conversation type.";
  if (!privacyConsent) fields.privacyConsent = "Consent is required to receive a reply.";

  if (Object.keys(fields).length > 0) {
    return NextResponse.json({ error: "Please check the highlighted fields.", fields }, { status: 400, headers: noStoreHeaders });
  }

  // Preview-only boundary: no email, CRM, database or booking provider is connected yet.
  return NextResponse.json({ ok: true, previewOnly: true, stored: false, newsletterOptIn }, { headers: noStoreHeaders });
}
