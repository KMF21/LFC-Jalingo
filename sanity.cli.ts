/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

// Runs in Node (via the `sanity` CLI directly), not Vite's browser
// bundle — so, unlike sanity/env.ts, it doesn't strictly need the
// SANITY_STUDIO_ prefix, and accepts either naming rather than demanding
// one exact variable exist. This matters in practice: an earlier version
// of this file read NEXT_PUBLIC_SANITY_PROJECT_ID alone and that worked
// fine for `sanity deploy`, so requiring only the newer SANITY_STUDIO_
// name broke deploy for anyone who added the Studio-specific env fix to
// sanity/env.ts without separately duplicating it here. Checking both
// means either one being set is enough.
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "js9rrnye"
const dataset =
  process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production"

export default defineCliConfig({ api: { projectId, dataset } })
