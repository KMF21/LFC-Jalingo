import { defineField, defineType } from "sanity";

export default defineType({
  name: "resource",
  title: "Resource (Book / Devotional)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["Book", "Devotional", "Teaching Guide"] },
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "coverImage", title: "Cover image", type: "image" }),
    defineField({ name: "file", title: "PDF file", type: "file", options: { accept: "application/pdf" }, validation: (r) => r.required() }),
    // Default to paid; a church admin can flip this to make any resource
    // free at any time (e.g. released free for an outreach or anniversary)
    // without touching code.
    defineField({ name: "isFree", title: "Free", type: "boolean", initialValue: false }),
    defineField({
      name: "price",
      title: "Price (₦)",
      type: "number",
      description: "Ignored when 'Free' is toggled on.",
      hidden: ({ document }) => Boolean(document?.isFree),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
