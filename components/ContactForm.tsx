"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Intent = "conversation" | "founding-partner";
type FieldKey = "name" | "organisation" | "email" | "intent" | "note" | "privacyConsent";
type FieldErrors = Partial<Record<FieldKey, string>>;

// Order used to move focus to the first invalid field.
const fieldOrder: FieldKey[] = ["name", "organisation", "email", "intent", "note", "privacyConsent"];

// PROVISIONAL: "Request" rather than "Book" because no booking provider is connected yet.
// Switch to "Book a conversation" once real booking exists and Pergage has approved it.
const submitLabels: Record<Intent, string> = {
  conversation: "Request a conversation",
  "founding-partner": "Send founding partner enquiry",
};

function intentFromHash(): Intent | null {
  if (window.location.hash === "#contact-form-founding-partner") return "founding-partner";
  if (window.location.hash === "#contact-form") return "conversation";
  return null;
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [intent, setIntent] = useState<Intent>("conversation");
  const successRef = useRef<HTMLDivElement>(null);

  // The "Become a founding partner" link points at #contact-form-founding-partner so
  // the form arrives with the right intent already chosen.
  useEffect(() => {
    function applyHash() {
      const fromHash = intentFromHash();
      if (fromHash) setIntent(fromHash);
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    if (status === "done") successRef.current?.focus();
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrors({});
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });
      if (response.ok) {
        setStatus("done");
        return;
      }
      let fields: FieldErrors = {};
      try {
        const data = await response.json();
        if (data && typeof data.fields === "object" && data.fields !== null) fields = data.fields as FieldErrors;
      } catch {
        // A non-JSON error body falls through to the generic message below.
      }
      const firstInvalid = fieldOrder.find((key) => fields[key]);
      if (response.status === 400 && firstInvalid) {
        setErrors(fields);
        setStatus("idle");
        requestAnimationFrame(() => document.getElementById(`contact-${firstInvalid}`)?.focus());
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="form-success" role="status" tabIndex={-1} ref={successRef}>
        <strong>Preview received.</strong>
        <p>
          This local build does not send or store your details. The production email or booking
          provider still needs to be chosen and connected under a Pergage-owned account.
        </p>
      </div>
    );
  }

  const invalid = (key: FieldKey) => (errors[key] ? true : undefined);
  const describedBy = (key: FieldKey, extra?: string) => [errors[key] ? `contact-${key}-error` : null, extra].filter(Boolean).join(" ") || undefined;
  const fieldError = (key: FieldKey) => errors[key] ? <small className="field-error" id={`contact-${key}-error`}>Error: {errors[key]}</small> : null;

  return (
    <>
      <span id="contact-form-founding-partner" className="form-anchor" />
      <form id="contact-form" className="contact-form" onSubmit={submit}>
        <label>
          Name
          <input id="contact-name" name="name" required autoComplete="name" maxLength={120} aria-invalid={invalid("name")} aria-describedby={describedBy("name")} />
          {fieldError("name")}
        </label>
        <label>
          Organisation
          <input id="contact-organisation" name="organisation" autoComplete="organization" maxLength={160} aria-invalid={invalid("organisation")} aria-describedby={describedBy("organisation")} />
          {fieldError("organisation")}
        </label>
        <label>
          Email
          <input id="contact-email" name="email" type="email" required autoComplete="email" maxLength={254} aria-invalid={invalid("email")} aria-describedby={describedBy("email")} />
          {fieldError("email")}
        </label>
        <label>
          What would you like to do?
          <select id="contact-intent" name="intent" value={intent} onChange={(event) => setIntent(event.target.value as Intent)} aria-invalid={invalid("intent")} aria-describedby={describedBy("intent")}>
            <option value="conversation">Book a conversation</option>
            <option value="founding-partner">Become a founding partner</option>
          </select>
          {fieldError("intent")}
        </label>
        <label>
          What would you like to talk about?
          <textarea id="contact-note" name="note" rows={4} maxLength={2000} aria-invalid={invalid("note")} aria-describedby={describedBy("note", "contact-note-help")} />
          <small id="contact-note-help">Please don&apos;t include health or personal details about individuals.</small>
          {fieldError("note")}
        </label>
        {/* PROVISIONAL: consent and newsletter wording is draft. The final legal text, the
            controller's details and the unsubscribe mechanism must come from Pergage. */}
        <label className="checkbox-row">
          <input id="contact-privacyConsent" name="privacyConsent" type="checkbox" value="yes" required aria-invalid={invalid("privacyConsent")} aria-describedby={describedBy("privacyConsent")} />
          <span>I consent to Pergage using these details to respond to this request. See the <a href="/privacy">preview privacy information</a>.</span>
        </label>
        {fieldError("privacyConsent")}
        <label className="checkbox-row">
          <input name="newsletterOptIn" type="checkbox" value="yes" />
          <span>Keep me informed about Pergage. Optional — separate from this request.</span>
        </label>
        <button className="button button-dark" disabled={status === "sending"}>
          {status === "sending" ? "Preparing…" : submitLabels[intent]} <span>→</span>
        </button>
        {status === "error" ? <p className="form-error" role="alert">Something went wrong and nothing was sent. Please try again.</p> : null}
      </form>
    </>
  );
}
