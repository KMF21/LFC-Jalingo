/**
 * Populates Sanity with the real content already established for LFC
 * Jalingo — leader names/roles, ministry descriptions, service times —
 * instead of requiring it to be retyped by hand into Studio field-by-field.
 *
 * Idempotent: every document uses a fixed, predictable `_id` and is written
 * with `createOrReplace`, so running this script twice updates the same
 * documents rather than duplicating them. Safe to re-run after editing the
 * DATA below.
 *
 * What this does NOT do, on purpose:
 *   - Bank account numbers: these are real financial details only the
 *     church can provide. Left as an empty array below — fill in the real
 *     ones before running, or add them by hand in Studio.
 *   - Sermon audio / resource PDFs: these are actual files, not text data,
 *     and go through their own upload flows (the admin sermon-upload tool
 *     for audio; Studio's file field for PDFs) — not this script.
 *   - Paystack key / social links in siteSettings: business details only
 *     the church has.
 *   - Leader `welcomeMessage` (the homepage pastor-welcome section): this
 *     text is publicly attributed to a real, named person, so it's seeded
 *     as an obvious bracketed placeholder — never a drafted quote that
 *     could pass as his actual words. Replace it in Studio with his real,
 *     approved message before the site goes live. See
 *     sanity/schemas/leader.ts and components/PastorWelcome.tsx.
 *
 * What this DOES do with images: if a file exists in public/images
 * matching the path listed next to each entry below, it uploads that file
 * as a Sanity asset and attaches it. If the file doesn't exist, that
 * document is still created — just without an image — and it's logged so
 * you know exactly which photos are still needed. The one exception is
 * hero slides: `heroSlide.image` is a required field in the schema (a
 * hero slide with no image doesn't make sense), so a hero slide is
 * skipped entirely, not created half-finished, if its image isn't found.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=sk... node scripts/seed.mjs
 *
 * Get a write token: sanity.io/manage -> this project -> API -> Tokens ->
 * Add API token -> permission "Editor". Treat it like a password — never
 * commit it.
 */
import { createClient } from "@sanity/client";
import { existsSync, createReadStream } from "fs";
import { config as loadEnv } from "dotenv";

// Same fix as scripts/check-sanity.mjs — a real .env parser instead of a
// hand-rolled regex that didn't tolerate spaces around `=` or quoted values.
loadEnv({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || projectId === "your-project-id") {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set — run scripts/check-sanity.mjs first.");
  process.exit(1);
}
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is not set. Get one from sanity.io/manage");
  console.error("(this project -> API -> Tokens -> Add API token -> Editor permission),");
  console.error("then run: SANITY_API_WRITE_TOKEN=sk... node scripts/seed.mjs");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-07-01", token, useCdn: false });

async function attachImageIfPresent(localPath) {
  if (!existsSync(localPath)) {
    console.log(`   (no image found at ${localPath} — creating without one)`);
    return undefined;
  }
  const asset = await client.assets.upload("image", createReadStream(localPath));
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

// --- Known content, gathered from the project conversation ---

const LEADERS = [
  { _id: "leader-jesse-dazema", name: "Pst Jesse Dazema", role: "State Pastor, Taraba", order: 1,
    bio: "Pst Jesse Dazema leads Living Faith Church across Taraba State, shepherding the church family in Jalingo with a heart for discipleship and community impact.",
    welcomeMessage: "[PLACEHOLDER — REPLACE BEFORE PUBLISHING. Ask Pst Jesse Dazema for his actual welcome message, in his own words, then paste it here and delete this bracketed text.]",
    imagePath: "public/images/leaders/jesse-dazema.jpg" },
  { _id: "leader-sunday-ushie", name: "Pst Sunday Ushie", role: "State Youth Pastor", order: 2,
    imagePath: "public/images/leaders/sunday-ushie.jpg" },
  { _id: "leader-godswill-akpabio", name: "Pst Godswill Akpabio", role: "Assistant State Youth Pastor", order: 3,
    imagePath: "public/images/leaders/godswill-akpabio.jpg" },
  { _id: "leader-zafira-ibrahim", name: "Zafira Ibrahim", role: "State Music Director", order: 4,
    imagePath: "public/images/leaders/zafira-ibrahim.jpg" },
  { _id: "leader-lucy-dazema", name: "Dcns. Lucy Dazema", role: "Guest Minister", order: 5,
    imagePath: "public/images/leaders/lucy-dazema.jpg" },
];

const HERO_SLIDES = [
  { _id: "hero-slide-1", order: 1,
    title: "Welcome to Living Faith", accentWord: "Church, Jalingo",
    subtitle: "New Ground, Mile Six Bypass Road, Dinyavoh",
    ctaLabel: "Plan your visit", ctaHref: "/visit",
    imagePath: "public/images/pastor-preaching.jpg" },
  { _id: "hero-slide-2", order: 2,
    title: "A word for your", accentWord: "liberation",
    subtitle: "Listen to our latest sermons, free to stream or download",
    ctaLabel: "Browse sermons", ctaHref: "/sermons",
    imagePath: "public/images/congregation.jpg" },
];

const MINISTRIES = [
  { _id: "ministry-youth-alive", name: "Youth Alive Fellowship", slug: "youth-alive", order: 1,
    description: "Empowering young people in faith, purpose, and community — through weekly fellowship, outreach, and mentorship.",
    imagePath: "public/images/ministries/youth-alive.jpg" },
  { _id: "ministry-music", name: "Choir / Music Department", slug: "music", order: 2,
    description: "Leads the congregation in praise, worship, and special ministration during services.",
    imagePath: "public/images/ministries/music.jpg" },
  { _id: "ministry-ushering", name: "Ushering / Hospitality Unit", slug: "ushering", order: 3,
    description: "Welcomes worshippers, manages seating, and attends to the congregation with warmth and courtesy.",
    imagePath: "public/images/ministries/ushering.jpg" },
  { _id: "ministry-prayer-band", name: "Prayer Band", slug: "prayer-band", order: 4,
    description: "Standing in intercession for the church, the community, and the nation.",
    imagePath: "public/images/ministries/prayer-band.jpg" },
  { _id: "ministry-crowd-control", name: "Crowd Control / Safety Unit", slug: "crowd-control", order: 5,
    description: "Coordinates orderly movement, parking, and general safety within and around the church premises.",
    imagePath: "public/images/ministries/crowd-control.jpg" },
  { _id: "ministry-sanctuary-keepers", name: "Sanctuary Keepers", slug: "sanctuary-keepers", order: 6,
    description: "Maintains the cleanliness and general upkeep of the auditorium and church facilities.",
    imagePath: "public/images/ministries/sanctuary-keepers.jpg" },
  { _id: "ministry-technical", name: "Technical and Multimedia Department", slug: "technical", order: 7,
    description: "Handles sound, livestreaming, projection, lighting, and recording for every service and program.",
    imagePath: "public/images/ministries/technical.jpg" },
  { _id: "ministry-medical", name: "Medical / First Aid Unit", slug: "medical", order: 8,
    description: "Provides immediate medical support and responds to emergencies during services and church programs.",
    imagePath: "public/images/ministries/medical.jpg" },
  { _id: "ministry-protocol", name: "Protocol and Security Unit", slug: "protocol", order: 9,
    description: "Coordinates guest ministers, VIP arrangements, and overall safety within the church environment.",
    imagePath: "public/images/ministries/protocol.jpg" },
  { _id: "ministry-visitation", name: "Visitation and Follow-Up / Assimilation Unit", slug: "visitation", order: 10,
    description: "Follows up with new converts and first-time worshippers, helping them settle in and grow in the faith.",
    imagePath: "public/images/ministries/visitation.jpg" },
  { _id: "ministry-evangelism", name: "Evangelism Unit", slug: "evangelism", order: 11,
    description: "Organizes outreach programs and neighborhood evangelism, carrying the gospel beyond the church walls.",
    imagePath: "public/images/ministries/evangelism.jpg" },
  { _id: "ministry-children-teens", name: "Children and Teenagers Church Department", slug: "children-teens", order: 12,
    description: "Nurtures the spiritual, social, and educational foundation of children and teenagers with age-appropriate teaching.",
    imagePath: "public/images/ministries/children-teens.jpg" },
  { _id: "ministry-wofbi", name: "Word Faith Bible Institute (WOFBI) / Believers' Foundation Class", slug: "wofbi", order: 13,
    description: "Runs foundational membership classes, water baptism preparation, and leadership training.",
    imagePath: "public/images/ministries/wofbi.jpg" },
  { _id: "ministry-outreach", name: "Outreach & Community Impact", slug: "outreach", order: 14,
    description: "Grain distribution, medical outreach, and community walks across Jalingo — reaching our city with practical love.",
    imagePath: "public/images/ministries/outreach.jpg" },
];

const SITE_SETTINGS = {
  _id: "siteSettings",
  _type: "siteSettings",
  address: "Mile Six Bypass Road (New Ground), Dinyavoh, Jalingo, Taraba State",
  serviceTimes: [
    { _type: "object", _key: "s1", label: "1st Service", time: "7:00 AM" },
    { _type: "object", _key: "s2", label: "2nd Service", time: "9:00 AM", note: "Interpreted in Hausa" },
    { _type: "object", _key: "s3", label: "Midweek Service", time: "Wed · 5:00 PM" },
  ],
};

async function run() {
  console.log(`Seeding project ${projectId} / dataset ${dataset}\n`);

  console.log("Site settings...");
  await client.createOrReplace(SITE_SETTINGS);
  console.log("  done\n");

  console.log("Hero slides...");
  for (const h of HERO_SLIDES) {
    const image = await attachImageIfPresent(h.imagePath);
    if (!image) {
      console.log(`  skipping "${h.title}" — no image found, a hero slide needs one to render properly`);
      continue;
    }
    await client.createOrReplace({
      _id: h._id,
      _type: "heroSlide",
      title: h.title,
      accentWord: h.accentWord,
      subtitle: h.subtitle,
      ctaLabel: h.ctaLabel,
      ctaHref: h.ctaHref,
      order: h.order,
      image,
    });
    console.log(`  "${h.title} ${h.accentWord}" — done`);
  }
  console.log("");

  console.log("Leaders...");
  for (const l of LEADERS) {
    const image = await attachImageIfPresent(l.imagePath);
    await client.createOrReplace({
      _id: l._id,
      _type: "leader",
      name: l.name,
      role: l.role,
      bio: l.bio,
      order: l.order,
      ...(image ? { photo: image } : {}),
      ...(l.welcomeMessage ? { welcomeMessage: l.welcomeMessage } : {}),
    });
    console.log(`  ${l.name} — done`);
  }
  console.log("");

  console.log("Ministries...");
  for (const m of MINISTRIES) {
    const image = await attachImageIfPresent(m.imagePath);
    await client.createOrReplace({
      _id: m._id,
      _type: "ministry",
      name: m.name,
      slug: { _type: "slug", current: m.slug },
      description: m.description,
      order: m.order,
      ...(image ? { image } : {}),
    });
    console.log(`  ${m.name} — done`);
  }

  console.log("\nSeed complete. Run `node scripts/check-sanity.mjs` to confirm document");
  console.log("counts, then reload the site — text content should now be live.");
}

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});