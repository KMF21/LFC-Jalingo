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
    defineField({
      name: "welcomeMessage",
      title: "Homepage welcome message (first-person)",
      type: "text",
      description:
        "Only used for the featured/primary pastor's homepage welcome section. This is different from 'Short bio' above — write it in his own voice as an actual welcome to the church (e.g. \"Welcome to Living Faith Church, Jalingo...\"), not a third-person description. IMPORTANT: this text renders publicly attributed to him by name — only publish real words he has reviewed and approved, never a draft or placeholder.",
    }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
