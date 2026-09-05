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

// Deliberately separate from LEADERS_QUERY: this only returns something
// when a real, pastor-approved welcomeMessage exists. It explicitly
// excludes the bracketed placeholder seeded by scripts/seed.mjs too —
// not just empty/undefined — because this project has no draft/publish
// separation: whatever's in the dataset is exactly what the live site
// shows. PastorWelcome.tsx renders nothing at all until this query
// returns a real result. See sanity/schemas/leader.ts for why.
export const PASTOR_WELCOME_QUERY = `*[
  _type == "leader"
  && defined(welcomeMessage)
  && welcomeMessage != ""
  && !(welcomeMessage match "[PLACEHOLDER*")
] | order(order asc)[0]{
  name,
  role,
  "photoUrl": photo.asset->url,
  welcomeMessage
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  address,
  serviceTimes,
  facebookUrl,
  whatsappUrl,
  paystackPublicKey
}`;

export type ServiceTime = { label: string; time: string; note?: string };
export type SiteSettings = {
  address?: string;
  serviceTimes?: ServiceTime[];
  facebookUrl?: string;
  whatsappUrl?: string;
  paystackPublicKey?: string;
};

// Shared fallback — used by Home, Visit, and the root layout (for the
// Footer), so there's exactly one place this data lives instead of three
// copies that could quietly drift apart.
export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  address: "Mile Six Bypass Road (New Ground), Dinyavoh, Jalingo, Taraba State",
  serviceTimes: [
    { label: "1st Service", time: "7:00 AM" },
    { label: "2nd Service", time: "9:00 AM", note: "Interpreted in Hausa" },
    { label: "Midweek Service", time: "Wed · 5:00 PM" },
  ],
};

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
