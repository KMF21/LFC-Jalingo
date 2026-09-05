import { defineLive } from "next-sanity/live";
import { client } from "./client";

// This project doesn't use Draft Mode or Visual Editing, so there's no
// need to require a token just to get real-time updates to PUBLISHED
// content working — per Sanity's own guidance, passing `false` for both
// tokens explicitly opts out of draft-content fetching and silences the
// dev-mode warning, rather than crashing when SANITY_API_READ_TOKEN isn't
// set yet. If Draft Mode / Visual Editing is added later, set
// SANITY_API_READ_TOKEN (a Viewer-role token) in .env.local and it'll be
// picked up automatically below.
const readToken = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken || false,
  browserToken: readToken || false,
});
