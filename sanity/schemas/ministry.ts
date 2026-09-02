import { defineField, defineType } from "sanity";

export default defineType({
  name: "ministry",
  title: "Ministry / Department",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "image", title: "Image", type: "image" }),
    defineField({ name: "gallery", title: "Photo gallery", type: "array", of: [{ type: "image" }] }),
    // Reusable across any ministry — Youth Alive is the first to use it,
    // but Music, Ushering, or Prayer Band can each get their own link too.
    defineField({ name: "whatsappGroupLink", title: "WhatsApp group invite link", type: "url" }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
});
