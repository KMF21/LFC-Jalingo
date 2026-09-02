import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "address", title: "Address", type: "string" }),
    defineField({
      name: "serviceTimes",
      title: "Service times",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "time", type: "string", title: "Time" },
            { name: "note", type: "string", title: "Note (e.g. interpreted in Hausa)" },
          ],
        },
      ],
    }),
    defineField({ name: "facebookUrl", title: "Facebook URL", type: "url" }),
    defineField({ name: "whatsappUrl", title: "WhatsApp URL", type: "url" }),
    defineField({ name: "paystackPublicKey", title: "Paystack public key", type: "string" }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
