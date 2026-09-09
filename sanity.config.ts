import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { projectId, dataset } from "./sanity/env";

// Unlike the public site's client (sanity/lib/client.ts), the Studio has
// no reasonable fallback mode — it cannot function at all without a real
// project ID and dataset, so it uses env.ts's throwing assertValue check
// (fails loudly and immediately) rather than degrading gracefully.
export default defineConfig({
  name: "lfc-jalingo-studio",
  title: "LFC Jalingo — Content Studio",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
