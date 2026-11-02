#!/usr/bin/env node
/**
 * Launch gate for provisional content.
 *
 * Anything that still needs an answer from Paul or from Pergage is marked in the source
 * with a "PROVISIONAL:" comment, or with the provisional(...) helper in content/site.ts.
 * This script lists them. It always exits 0 for a normal preview build, and exits 1 when a
 * launch is requested (SITE_LAUNCH=true or NEXT_PUBLIC_SITE_LAUNCH=true) or when run with
 * --strict, so a launch build cannot go out while provisional items remain.
 *
 * It runs automatically before `npm run build` (the "prebuild" script).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const scanned = ["app", "components", "content", "data", "lib"];
const extensions = [".ts", ".tsx", ".mjs"];
const strict = process.argv.includes("--strict");
const launchRequested = ["SITE_LAUNCH", "NEXT_PUBLIC_SITE_LAUNCH"].some((name) => String(process.env[name] ?? "").trim().toLowerCase() === "true");

function* walk(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (extensions.some((ext) => full.endsWith(ext))) yield full;
  }
}

const findings = [];
for (const dir of scanned) {
  for (const file of walk(join(root, dir))) {
    readFileSync(file, "utf8").split("\n").forEach((line, index) => {
      if (/PROVISIONAL:/.test(line) || /\bprovisional\(\s*["'`]/.test(line)) {
        findings.push({ file: relative(root, file), line: index + 1, text: line.trim().slice(0, 110) });
      }
    });
  }
}

const siteUrl = String(process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
console.log(`Provisional items: ${findings.length}`);
for (const finding of findings) console.log(`  ${finding.file}:${finding.line}  ${finding.text}`);

if (launchRequested && !/^https:\/\//.test(siteUrl)) {
  console.log("\nNote: launch is requested but NEXT_PUBLIC_SITE_URL is not a valid https URL, so the site will stay noindex.");
}

if ((launchRequested || strict) && findings.length > 0) {
  console.error(`\nBlocked: ${findings.length} provisional item(s) remain. Resolve or approve each one, remove its marker, then build again.`);
  process.exit(1);
}
console.log(findings.length ? "\nThis is expected for a private preview. They must be cleared before launch." : "\nNo provisional items remain.");
