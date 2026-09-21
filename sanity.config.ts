import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";
import { projectId, dataset } from "./sanity/env";

// visionTool (the GROQ playground) is deliberately NOT included here.
// Studio embedding was tried and reverted (see README's Versions section)
// after two separate real build failures tied to Next.js's bundler
// choking on Sanity Studio's Vite-oriented internals — a jsdom/parse5
// conflict from @sanity/vision, and later an "Unknown module type" error
// from @sanity/workbench (pulled in by structureTool). Studio now runs
// only via the standalone CLI (`npx sanity dev` / `sanity deploy`), which
// uses Vite and never has this problem. visionTool is safe to re-add in
// that standalone context if the GROQ playground is wanted — the risk
// was specific to Next.js bundling it, not to Sanity Studio itself.
//
// Unlike the public site's client (sanity/lib/client.ts), the Studio has
// no reasonable fallback mode — it cannot function at all without a real
// project ID and dataset, so it uses env.ts's throwing assertValue check
// (fails loudly and immediately) rather than degrading gracefully.
export default defineConfig({
  name: "lfc-jalingo-studio",
  title: "LFC Jalingo — Content Studio",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
