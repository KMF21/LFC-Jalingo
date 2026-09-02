import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "lfc-jalingo-studio",
  title: "LFC Jalingo — Content Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio", // 👈 Required for Next.js App Router subpath integration
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});