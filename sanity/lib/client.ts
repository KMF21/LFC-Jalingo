import { createClient } from "next-sanity";

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-07-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!projectId) {
  // Deliberately loud and specific — NOT a silent fallback to a
  // plausible-looking fake ID like "your-project-id", which would make
  // the Sanity SDK attempt a real network request to a nonexistent
  // project and fail with a generic, confusing network error instead of
  // an obvious "you forgot to configure this" message. This still lets
  // the app boot rather than crashing the whole site at import time —
  // safeSanityFetch (sanity/lib/safe-fetch.ts) catches the resulting
  // fetch failures and falls back to placeholder content, so a missing
  // Sanity config degrades the public site to placeholder content
  // instead of taking it down entirely. The Studio itself (sanity.config.ts)
  // uses a stricter, throwing check instead, since Studio genuinely
  // cannot function at all without real project config.
  console.error(
    "[Sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. The public site " +
    "will run on placeholder content until this is configured — see .env.example."
  );
}

export const client = createClient({
  projectId: projectId || "not-configured",
  dataset,
  apiVersion,
  useCdn: true,
});
