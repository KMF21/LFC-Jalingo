import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

/**
 * Fetches from Sanity but never throws and never returns an empty result —
 * falls back to placeholder content. This matters right now specifically
 * because no real Sanity project exists yet (see .env.example): every page
 * component below calls this instead of `sanityClient.fetch` directly, so
 * the site stays fully functional with placeholder data today, and starts
 * pulling real content automatically the moment a real project ID + real
 * documents exist — no further code changes needed at that point.
 */
export async function safeFetch<T>(query: string, fallback: T): Promise<T> {
  try {
    const data = await sanityClient.fetch<T>(query);
    if (data === null || data === undefined) return fallback;
    if (Array.isArray(data) && data.length === 0) return fallback;
    return data;
  } catch (err) {
    console.error("Sanity fetch failed, using fallback content:", err);
    return fallback;
  }
}

// Example GROQ queries — wire these into the page components once the
// Sanity dataset is populated. Kept here as the single source of truth for
// the schema's query shape.
export const HOMEPAGE_HERO_QUERY = `*[_type == "heroSlide"] | order(order asc){
  "_key": _id,
  title,
  accentWord,
  subtitle,
  "imageUrl": image.asset->url,
  ctaLabel,
  ctaHref
}`;

export const FEATURED_SERMON_QUERY = `*[_type == "sermon" && featured == true] | order(date desc)[0]{
  title,
  "preacher": preacher->name,
  date,
  audioUrl,
  durationSeconds,
  "pdfUrl": pdfFile.asset->url
}`;

export const BANK_ACCOUNTS_QUERY = `*[_type == "bankAccount"] | order(order asc){
  bankName,
  accountName,
  accountNumber,
  label
}`;

export const SERMONS_LIST_QUERY = `*[_type == "sermon"] | order(date desc){
  "slug": slug.current,
  title,
  "preacher": preacher->name,
  date,
  audioUrl,
  durationSeconds,
  "hasVideo": defined(videoUrl)
}`;

export const RESOURCES_LIST_QUERY = `*[_type == "resource"] | order(_createdAt desc){
  "slug": slug.current,
  title,
  category,
  isFree,
  price
}`;

export const MINISTRIES_LIST_QUERY = `*[_type == "ministry"] | order(order asc){
  "slug": slug.current,
  name,
  description,
  "imageUrl": image.asset->url,
  whatsappGroupLink
}`;

export const LEADERS_QUERY = `*[_type == "leader"] | order(order asc){
  name,
  role,
  "photoUrl": photo.asset->url,
  bio
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  address,
  serviceTimes,
  facebookUrl,
  whatsappUrl,
  paystackPublicKey
}`;

export const UPCOMING_EVENTS_QUERY = `*[_type == "event" && date >= now()] | order(date asc)[0...3]{
  "slug": slug.current,
  title,
  date,
  category,
  "imageUrl": image.asset->url
}`;

export const SERMON_BY_SLUG_QUERY = `*[_type == "sermon" && slug.current == $slug][0]{
  title,
  "preacher": preacher->name,
  date,
  scripture,
  body,
  audioUrl,
  durationSeconds,
  "pdfUrl": pdfFile.asset->url
}`;

export const RESOURCE_BY_SLUG_QUERY = `*[_type == "resource" && slug.current == $slug][0]{
  title,
  category,
  description,
  isFree,
  price,
  "fileUrl": file.asset->url
}`;

export const MINISTRY_BY_SLUG_QUERY = `*[_type == "ministry" && slug.current == $slug][0]{
  name,
  description,
  "imageUrl": image.asset->url,
  "galleryUrls": gallery[].asset->url,
  whatsappGroupLink
}`;
