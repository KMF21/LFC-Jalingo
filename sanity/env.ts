// This file runs inside Sanity Studio's own Vite-bundled browser code —
// a completely different build system from Next.js. Vite only inlines an
// env var into the browser bundle when its name matches Vite's configured
// prefix, and Sanity Studio's Vite setup defaults that prefix to
// `SANITY_STUDIO_`, not `NEXT_PUBLIC_` (that's a Next.js-only convention).
// Reading `process.env.NEXT_PUBLIC_...` here works in local `sanity dev`
// (Node can see real env vars there) but silently fails in a deployed
// `sanity deploy` bundle, since Vite never inlined that name at build
// time — hence "Missing environment variable" at runtime in production
// specifically. Use `import.meta.env.SANITY_STUDIO_...` instead, and set
// those SANITY_STUDIO_-prefixed variables in .env.local alongside the
// NEXT_PUBLIC_ ones (same values, different names for the two build
// systems) — see .env.example.
export const apiVersion =
  import.meta.env.SANITY_STUDIO_API_VERSION || '2026-09-02'

export const dataset = assertValue(
  import.meta.env.SANITY_STUDIO_DATASET || "production",
  'Missing environment variable: SANITY_STUDIO_DATASET'
)

export const projectId = assertValue(
  import.meta.env.SANITY_STUDIO_PROJECT_ID || "js9rrnye",
  'Missing environment variable: SANITY_STUDIO_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
