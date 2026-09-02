import { defineField, defineType } from "sanity";

export default defineType({
  name: "sermon",
  title: "Sermon",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "preacher", title: "Preacher", type: "reference", to: [{ type: "leader" }] }),
    defineField({ name: "date", title: "Date preached", type: "date", validation: (r) => r.required() }),
    defineField({ name: "scripture", title: "Key scripture / reference", type: "string" }),
    defineField({ name: "series", title: "Series", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "body", title: "Teaching body (optional, for text-based notes)", type: "array", of: [{ type: "block" }] }),

    // --- Audio lives in Cloudflare R2, not Sanity's asset pipeline ---
    // Sanity holds metadata only. This field stores the public CDN URL
    // returned by the upload pipeline (see app/api/admin/upload-sermon),
    // e.g. https://sermons.lfcjalingo.org/sermons/2026/gateways-to-financial-dominion.mp3
    defineField({
      name: "audioUrl",
      title: "Audio URL (R2 / CDN)",
      type: "url",
      description: "Filled automatically by the admin upload tool. Do not upload audio directly into Sanity.",
    }),
    defineField({
      name: "durationSeconds",
      title: "Duration (seconds)",
      type: "number",
      description: "Optional — used to render the player's total time before the file loads.",
    }),

    // Optional: only renders on the frontend if populated.
    defineField({ name: "videoUrl", title: "Video URL (YouTube/Vimeo)", type: "url" }),

    // PDF sermon notes are low-volume and stay on Sanity's own asset
    // pipeline — only the audio moves to R2, per the cost/architecture
    // rationale (audio is the large, frequently-streamed asset; a PDF of
    // notes is not).
    defineField({ name: "pdfFile", title: "PDF notes (optional)", type: "file", options: { accept: "application/pdf" } }),

    defineField({ name: "featured", title: "Featured on homepage", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "title", subtitle: "date" },
  },
});
