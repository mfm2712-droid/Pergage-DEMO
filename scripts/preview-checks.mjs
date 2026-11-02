#!/usr/bin/env node
/**
 * Black-box checks for the private preview. Run against a started server:
 *
 *   npm run build && npx next start -p 3100 &
 *   BASE_URL=http://127.0.0.1:3100 node scripts/preview-checks.mjs
 *
 * EXPECT_INDEXABLE=false (default): everything must stay out of search.
 * EXPECT_INDEXABLE=true: only for a deliberate launch-mode run; expects the
 * site to be indexable and the draft privacy page to remain noindex.
 *
 * No personal data is sent: every payload below is synthetic.
 */
const base = (process.env.BASE_URL ?? "http://127.0.0.1:3100").replace(/\/$/, "");
const expectIndexable = process.env.EXPECT_INDEXABLE === "true";

let failures = 0;
let passes = 0;

function check(name, condition, detail = "") {
  if (condition) {
    passes += 1;
    console.log(`PASS  ${name}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${name}${detail ? `  (${detail})` : ""}`);
  }
}

async function fetchWithOneRetry(url, init) {
  try {
    return await fetch(url, init);
  } catch {
    // After the server refuses an oversized streamed body it closes that keep-alive socket;
    // the next request can land on the dead socket. One retry opens a fresh connection, and a
    // server that has really crashed still fails the retry.
    return await fetch(url, { ...init, signal: AbortSignal.timeout(15000) });
  }
}

async function request(path, init = {}) {
  const response = await fetchWithOneRetry(`${base}${path}`, { redirect: "manual", signal: AbortSignal.timeout(15000), ...init });
  const text = await response.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not JSON */ }
  return { status: response.status, headers: response.headers, text, json };
}

const post = (path, body, headers = { "content-type": "application/json" }) =>
  request(path, { method: "POST", headers, body: typeof body === "string" ? body : JSON.stringify(body) });

// Sends a body as a stream so no Content-Length header is declared.
async function streamedPost(path, totalBytes) {
  const chunk = new TextEncoder().encode('{"x":"' + "a".repeat(1000));
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(chunk);
      for (let sent = chunk.length; sent < totalBytes; sent += 1000) controller.enqueue(new TextEncoder().encode("a".repeat(1000)));
      controller.enqueue(new TextEncoder().encode('"}'));
      controller.close();
    },
  });
  try {
    const response = await fetch(`${base}${path}`, { method: "POST", headers: { "content-type": "application/json" }, body, duplex: "half", signal: AbortSignal.timeout(15000) });
    await response.text();
    return { status: response.status };
  } catch {
    // The server may answer 413 and close the socket while the client is still sending.
    // That is the intended outcome, so it is reported as "closed" rather than as a crash.
    return { status: "closed" };
  }
}

const validContact = {
  name: "Test Person",
  organisation: "Test Org",
  email: "test@example.com",
  intent: "conversation",
  note: "Synthetic note",
  privacyConsent: "yes",
};

const validAnswers = {
  "org-01": 4,
  "org-02": 4,
  "org-03": 4,
  "org-04": 4,
  "org-05": 4,
  "org-06": 4,
  "org-07": 4,
  "org-08": 4,
};
const validScorecard = { type: "organisational", answers: validAnswers, scorecardAcknowledgement: true, scorecardConsent: true, newsletterOptIn: false };

async function contactChecks() {
  console.log("\n== /api/contact");
  let r = await post("/api/contact", validContact);
  check("valid request returns 200 ok", r.status === 200 && r.json?.ok === true, `status ${r.status}`);
  check("valid response is preview-only and not stored", r.json?.previewOnly === true && r.json?.stored === false);
  check("response does not echo personal data", !JSON.stringify(r.json ?? {}).includes("test@example.com") && !JSON.stringify(r.json ?? {}).includes("Test Person"));
  check("response is Cache-Control: no-store", /no-store/i.test(r.headers.get("cache-control") ?? ""), r.headers.get("cache-control") ?? "missing");
  check("api response carries noindex", /noindex/i.test(r.headers.get("x-robots-tag") ?? ""), r.headers.get("x-robots-tag") ?? "missing");

  r = await post("/api/contact", { ...validContact, newsletterOptIn: "yes" });
  check("newsletterOptIn 'yes' accepted", r.status === 200, `status ${r.status}`);
  r = await post("/api/contact", { ...validContact, newsletterOptIn: "maybe" });
  check("unrecognised newsletterOptIn never counts as an opt-in", r.status === 400 || (r.status === 200 && r.json?.newsletterOptIn === false), `status ${r.status}`);
  r = await post("/api/contact", validContact);
  check("missing newsletterOptIn means no opt-in", r.status === 200 && r.json?.newsletterOptIn === false);

  r = await post("/api/contact", "{not json");
  check("malformed JSON returns 400", r.status === 400, `status ${r.status}`);
  check("error responses are JSON with an error string", typeof r.json?.error === "string", r.text.slice(0, 60));
  for (const [label, payload] of [["array", "[]"], ["string", '"hello"'], ["null", "null"], ["number", "42"]]) {
    r = await post("/api/contact", payload);
    check(`JSON ${label} body returns 400`, r.status === 400, `status ${r.status}`);
  }
  r = await post("/api/contact", JSON.stringify(validContact), { "content-type": "text/plain" });
  check("wrong content type returns 415", r.status === 415, `status ${r.status}`);
  r = await post("/api/contact", JSON.stringify(validContact), {});
  check("missing content type returns 415", r.status === 415, `status ${r.status}`);

  r = await post("/api/contact", { ...validContact, name: 123 });
  check("non-string name returns 400, not 500", r.status === 400, `status ${r.status}`);
  check("400 names the invalid field", typeof r.json?.fields?.name === "string");
  r = await post("/api/contact", { ...validContact, email: { a: 1 } });
  check("object email returns 400, not 500", r.status === 400, `status ${r.status}`);
  r = await post("/api/contact", { ...validContact, name: "x".repeat(121) });
  check("name over 120 chars returns 400", r.status === 400, `status ${r.status}`);
  r = await post("/api/contact", { ...validContact, organisation: "x".repeat(161) });
  check("organisation over 160 chars returns 400", r.status === 400, `status ${r.status}`);
  r = await post("/api/contact", { ...validContact, note: "x".repeat(2001) });
  check("note over 2000 chars returns 400", r.status === 400, `status ${r.status}`);
  r = await post("/api/contact", { ...validContact, note: "x".repeat(2000) });
  check("note at exactly 2000 chars accepted", r.status === 200, `status ${r.status}`);
  for (const email of ["a@b", "no-at-sign", "a b@c.de", "@c.de", "a@.de"]) {
    r = await post("/api/contact", { ...validContact, email });
    check(`invalid email "${email}" returns 400`, r.status === 400, `status ${r.status}`);
  }
  r = await post("/api/contact", { ...validContact, name: "Bad\u0000Name" });
  check("control character in name returns 400", r.status === 400, `status ${r.status}`);
  r = await post("/api/contact", { ...validContact, name: "   " });
  check("blank name returns 400", r.status === 400, `status ${r.status}`);

  for (const intent of ["sales", "", 5, null, undefined]) {
    r = await post("/api/contact", { ...validContact, intent });
    check(`intent ${JSON.stringify(intent) ?? "missing"} returns 400`, r.status === 400, `status ${r.status}`);
  }
  r = await post("/api/contact", { ...validContact, intent: "founding-partner" });
  check("intent founding-partner accepted", r.status === 200, `status ${r.status}`);

  for (const consent of [undefined, "no", "", true, "YES"]) {
    r = await post("/api/contact", { ...validContact, privacyConsent: consent });
    check(`privacyConsent ${JSON.stringify(consent) ?? "missing"} returns 400`, r.status === 400, `status ${r.status}`);
  }

  r = await post("/api/contact", { ...validContact, note: "x".repeat(20000) });
  check("oversized body returns 413", r.status === 413, `status ${r.status}`);
  r = await streamedPost("/api/contact", 40000);
  check("oversized body without Content-Length is refused (413 or closed early)", r.status === 413 || r.status === "closed", `status ${r.status}`);

  r = await request("/api/contact");
  check("GET returns 405", r.status === 405, `status ${r.status}`);
}

async function scorecardChecks() {
  console.log("\n== /api/scorecards/calculate");
  let r = await post("/api/scorecards/calculate", validScorecard);
  check("valid organisational request returns 200", r.status === 200 && typeof r.json?.band === "string", `status ${r.status}`);
  check("valid response is not stored", r.json?.stored === false);
  check("response is Cache-Control: no-store", /no-store/i.test(r.headers.get("cache-control") ?? ""), r.headers.get("cache-control") ?? "missing");
  check("api response carries noindex", /noindex/i.test(r.headers.get("x-robots-tag") ?? ""), r.headers.get("x-robots-tag") ?? "missing");

  const individualAnswers = {
    "ind-01": 5,
    "ind-02": 5,
    "ind-03": 5,
    "ind-04": 5,
    "ind-05": 5,
    "ind-06": 5,
    "ind-07": 5,
    "ind-08": 5,
  };
  r = await post("/api/scorecards/calculate", { ...validScorecard, type: "individual", answers: individualAnswers });
  check("valid individual request returns 200", r.status === 200, `status ${r.status}`);

  for (const type of ["constructor", "__proto__", "toString", "hasOwnProperty", "", 7, null, ["organisational"]]) {
    r = await post("/api/scorecards/calculate", { ...validScorecard, type });
    check(`type ${JSON.stringify(type)} returns 400, not 500`, r.status === 400, `status ${r.status}`);
  }
  for (const [label, value] of [["zero", 0], ["six", 6], ["fraction", 3.5], ["string", "3"], ["null", null], ["negative", -1]]) {
    r = await post("/api/scorecards/calculate", { ...validScorecard, answers: { ...validAnswers, "org-03": value } });
    check(`answer value ${label} returns 400`, r.status === 400, `status ${r.status}`);
  }
  const { ["org-08"]: _omitted, ...missing } = validAnswers;
  r = await post("/api/scorecards/calculate", { ...validScorecard, answers: missing });
  check("missing answer returns 400", r.status === 400, `status ${r.status}`);
  for (const [label, answers] of [["array", [1, 2, 3, 4, 5]], ["string", "44444"], ["null", null]]) {
    r = await post("/api/scorecards/calculate", { ...validScorecard, answers });
    check(`answers as ${label} returns 400`, r.status === 400, `status ${r.status}`);
  }
  r = await post("/api/scorecards/calculate", { ...validScorecard, answers: { ...validAnswers, "unknown-question": 5 } });
  check("unknown answer ids never change the result", r.status === 400 || (r.status === 200 && r.json?.average === 4), `status ${r.status}, average ${r.json?.average}`);

  for (const field of ["scorecardAcknowledgement", "scorecardConsent"]) {
    for (const value of [false, undefined, "yes", 1, "true"]) {
      r = await post("/api/scorecards/calculate", { ...validScorecard, [field]: value });
      check(`${field}=${JSON.stringify(value) ?? "missing"} returns 400`, r.status === 400, `status ${r.status}`);
    }
  }
  r = await post("/api/scorecards/calculate", { ...validScorecard, newsletterOptIn: "yes" });
  check("non-boolean newsletterOptIn never counts as an opt-in", r.status === 400 || (r.status === 200 && r.json?.newsletterOptIn === false), `status ${r.status}`);
  r = await post("/api/scorecards/calculate", { ...validScorecard, newsletterOptIn: undefined });
  check("missing newsletterOptIn is treated as false", r.status === 200 && r.json?.newsletterOptIn === false, `status ${r.status}`);

  r = await post("/api/scorecards/calculate", "{oops");
  check("malformed JSON returns 400", r.status === 400, `status ${r.status}`);
  for (const payload of ["[]", "null", '"x"', "7"]) {
    r = await post("/api/scorecards/calculate", payload);
    check(`JSON body ${payload} returns 400`, r.status === 400, `status ${r.status}`);
  }
  r = await post("/api/scorecards/calculate", JSON.stringify(validScorecard), { "content-type": "text/plain" });
  check("wrong content type returns 415", r.status === 415, `status ${r.status}`);
  r = await post("/api/scorecards/calculate", { ...validScorecard, padding: "x".repeat(20000) });
  check("oversized body returns 413", r.status === 413, `status ${r.status}`);
  r = await streamedPost("/api/scorecards/calculate", 40000);
  check("oversized body without Content-Length is refused (413 or closed early)", r.status === 413 || r.status === "closed", `status ${r.status}`);
  r = await request("/api/scorecards/calculate");
  check("GET returns 405", r.status === 405, `status ${r.status}`);
}

function robotsMeta(html) {
  const match = html.match(/<meta name="robots" content="([^"]*)"/i);
  return match ? match[1] : null;
}

async function indexingChecks() {
  console.log(`\n== indexing (EXPECT_INDEXABLE=${expectIndexable})`);
  const robots = await request("/robots.txt");
  const sitemap = await request("/sitemap.xml");
  const pages = ["/", "/scorecards", "/scorecards/organisational", "/scorecards/individual"];
  const draftPages = ["/privacy", "/about", "/insights"];

  if (!expectIndexable) {
    check("robots.txt disallows everything", /Disallow:\s*\/\s*$/m.test(robots.text) && !/Allow:\s*\//.test(robots.text), robots.text.replace(/\n/g, " | "));
    check("robots.txt advertises no sitemap", !/Sitemap:/i.test(robots.text));
    check("sitemap.xml has no URLs", !/<url>/.test(sitemap.text));
    for (const path of [...pages, ...draftPages]) {
      const r = await request(path);
      check(`${path} meta robots is noindex`, /noindex/.test(robotsMeta(r.text) ?? ""), String(robotsMeta(r.text)));
      check(`${path} sends X-Robots-Tag noindex`, /noindex/i.test(r.headers.get("x-robots-tag") ?? ""), r.headers.get("x-robots-tag") ?? "missing");
    }
    const notFound = await request("/does-not-exist");
    check("404 page sends X-Robots-Tag noindex", /noindex/i.test(notFound.headers.get("x-robots-tag") ?? ""), `${notFound.status} ${notFound.headers.get("x-robots-tag") ?? "missing"}`);
  } else {
    check("robots.txt allows crawling", /Allow:\s*\//.test(robots.text), robots.text.replace(/\n/g, " | "));
    check("robots.txt blocks /api/", /Disallow:\s*\/api\//.test(robots.text));
    check("robots.txt points to the sitemap", /Sitemap:\s*https:\/\//.test(robots.text));
    check("sitemap.xml lists the public pages", pages.every((p) => sitemap.text.includes(`${p === "/" ? "" : p}</loc>`)));
    check("sitemap.xml excludes the draft pages", draftPages.every((p) => !sitemap.text.includes(p)));
    for (const path of pages) {
      const r = await request(path);
      check(`${path} meta robots is index`, /^index/.test(robotsMeta(r.text) ?? ""), String(robotsMeta(r.text)));
      check(`${path} has no X-Robots-Tag`, !r.headers.get("x-robots-tag"), r.headers.get("x-robots-tag") ?? "");
    }
    for (const path of draftPages) {
      const draft = await request(path);
      check(`draft ${path} stays noindex in the meta tag when launched`, /noindex/.test(robotsMeta(draft.text) ?? ""), String(robotsMeta(draft.text)));
      check(`draft ${path} sends X-Robots-Tag noindex when launched`, /noindex/i.test(draft.headers.get("x-robots-tag") ?? ""), draft.headers.get("x-robots-tag") ?? "missing");
    }
    const api = await post("/api/contact", validContact);
    check("api keeps noindex when launched", /noindex/i.test(api.headers.get("x-robots-tag") ?? "") && !/(^|,\s*)index\b/i.test(api.headers.get("x-robots-tag") ?? ""), api.headers.get("x-robots-tag") ?? "missing");
  }

  const home = await request("/");
  for (const [header, pattern] of [["x-content-type-options", /nosniff/i], ["referrer-policy", /strict-origin/i], ["x-frame-options", /deny|sameorigin/i]]) {
    check(`security header ${header} present`, pattern.test(home.headers.get(header) ?? ""), home.headers.get(header) ?? "missing");
  }
  check("X-Powered-By is not exposed", !home.headers.get("x-powered-by"));
}

try {
  await contactChecks();
  await scorecardChecks();
  await indexingChecks();
} catch (error) {
  failures += 1;
  console.log(`FAIL  checks aborted: ${error instanceof Error ? error.message : error}`);
}

console.log(`\n${passes} passed, ${failures} failed`);
process.exit(failures === 0 ? 0 : 1);
