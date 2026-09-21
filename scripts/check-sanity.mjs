/**
 * Diagnoses why the site might not be showing real Sanity content.
 *
 * This talks to Sanity directly — bypassing Next.js and `safeFetch()`
 * entirely — because safeFetch deliberately swallows every failure and
 * falls back to placeholder content. That's good for the site never
 * breaking, but it also means a wrong project ID, an empty dataset, and a
 * blocked CORS origin all look identical from the browser: silent
 * placeholder content. This script tells you which one it actually is.
 *
 * Usage:
 *   node scripts/check-sanity.mjs
 *
 * Reads NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET from
 * .env.local (or the shell environment) — same variables the app itself
 * uses, so this checks the exact config the site is actually running with.
 */
import { createClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";

// Using the real `dotenv` package rather than a hand-rolled parser —
// an earlier version of this script parsed .env.local with a regex that
// didn't tolerate spaces around `=`, quoted values, or other things a
// normal .env file often has. dotenv handles all of that correctly.
const envResult = loadEnv({ path: ".env.local" });

console.log("--- .env.local file check ---");
if (envResult.error) {
  console.log("Could not read .env.local:", envResult.error.message);
  console.log("Most common cause on Windows: the file is actually named");
  console.log(".env.local.txt (Explorer hides known extensions by default).");
  console.log("Check with: Get-ChildItem -Force .env.local*");
} else {
  const keys = Object.keys(envResult.parsed || {});
  console.log(`Found .env.local — parsed ${keys.length} variable(s): ${keys.join(", ") || "(none)"}`);
}
console.log("");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

console.log("--- Sanity connectivity check ---");
console.log("Project ID:", projectId || "(not set)");
console.log("Dataset:   ", dataset);
console.log("");

if (!projectId || projectId === "your-project-id") {
  console.log("STOP HERE: NEXT_PUBLIC_SANITY_PROJECT_ID is not set to a real value.");
  console.log("This is the #1 cause of 'content not pulling from Sanity' — the app is");
  console.log("still pointed at the placeholder ID from .env.example.");
  console.log("Fix: run `npx sanity init` (or check sanity.io/manage) for your real");
  console.log("project ID, then set it in .env.local AND in your hosting provider's");
  console.log("environment variables (e.g. Vercel) — a value only in .env.local never");
  console.log("reaches a deployed site.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-07-01",
  useCdn: false, // bypass CDN cache for this check, to see live data
});

const docTypes = ["heroSlide", "leader", "ministry", "sermon", "resource", "bankAccount", "event", "siteSettings"];

try {
  for (const type of docTypes) {
    const count = await client.fetch(`count(*[_type == $type])`, { type });
    const flag = count === 0 ? "  <- EMPTY, this is why that page shows placeholder content" : "";
    console.log(`${type.padEnd(14)} ${count} document(s)${flag}`);
  }
  console.log("");
  console.log("If every count above is 0: the connection works, but nothing has been");
  console.log("published yet — run scripts/seed.mjs (see below) to populate known content.");
  console.log("");
  console.log("If this succeeded but the deployed SITE still shows placeholders: the");
  console.log("problem is environment variables not being set in your hosting provider");
  console.log("(Vercel etc.), not Sanity itself.");
} catch (err) {
  console.log("FETCH FAILED:", err.message);
  console.log("");
  console.log("Likely cause: CORS. Go to https://www.sanity.io/manage, select this");
  console.log("project -> API -> CORS Origins, and add your dev URL");
  console.log("(http://localhost:3000) and your production domain, with credentials");
  console.log("allowed if you query with a token.");
  process.exit(1);
}
