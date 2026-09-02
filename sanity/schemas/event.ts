import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "date", title: "Date", type: "date", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Flyer / image", type: "image" }),
    defineField({ name: "category", title: "Category", type: "string", description: "e.g. Youth Alive, Conference, Outreach" }),
    defineField({ name: "description", title: "Short description", type: "text" }),
  ],
  preview: {
    select: { title: "title", subtitle: "date", media: "image" },
  },
});
