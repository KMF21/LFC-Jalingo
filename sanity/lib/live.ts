import { defineLive } from "next-sanity/live";
import { client } from "./client";

// A read token is optional for a public dataset, but recommended — it's
// what lets the Live Content API's real-time subscription work reliably
// (and is required at all if the dataset is set to private). Generate one
// at sanity.io/manage -> this project -> API -> Tokens -> Viewer
// permission, then set SANITY_API_READ_TOKEN in .env.local (server-only,
// never NEXT_PUBLIC_).
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    // The Live Content API needs the freshest data, not the CDN's cached
    // copy — apiCdn: false only affects this live-fetching client, not
    // the base `client` export above.
    apiCdn: false,
  }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
});
