import { defineField, defineType } from "sanity";

export default defineType({
  name: "bankAccount",
  title: "Bank Account",
  type: "document",
  fields: [
    defineField({ name: "bankName", title: "Bank name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "accountName", title: "Account name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "accountNumber", title: "Account number", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "label",
      title: "Label / purpose",
      type: "string",
      description: "e.g. General Account, Building Fund, Missions",
    }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  preview: {
    select: { title: "label", subtitle: "bankName" },
  },
});
