import { defineField, defineType } from "sanity";

export default defineType({
  name: "leader",
  title: "Leader",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role / title", type: "string" }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      description: "Prefer an in-ministry photo (preaching, ministering) over a stiff studio headshot.",
    }),
    defineField({ name: "bio", title: "Short bio", type: "text" }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
