# Living Faith Church, Jalingo — Website

Stack: **Next.js (App Router)** · **Sanity CMS** · **Motion** · **Tailwind CSS**

## What's in this scaffold

- **`app/`** — the homepage (`page.tsx`), root layout with fonts and global nav/footer shell.
- **`components/`** — the homepage building blocks: `HeroSlider`, `ServiceTimes`,
  `FeaturedSermon`, `MinistriesTeaser`, `GivingBand`, `Nav`, `Footer`, and the
  signature `FlameMark` (an animated SVG version of the church's globe-and-flame
  emblem, used as the one recurring motion motif instead of scattering effects
  everywhere).
- **`sanity/schemas/`** — content types for everything discussed: `sermon`
  (audio-first, optional video), `resource` (books/devotionals with a
  free/paid toggle per item), `ministry` (with a reusable WhatsApp group link
  field), `bankAccount` (repeatable — add as many as needed), `leader`,
  `heroSlide`, and `siteSettings`.
- **`lib/sanity.ts`** — the Sanity client plus the GROQ queries the homepage
  needs, ready to wire in once the dataset has real content.

## Design decisions baked in

- **Palette**: red and white/black as the primary system — matching the
  church's actual brand (see `resources.faithtabernacle.org.ng` and the
  national contact centre site), not a generic template palette. Deep red
  (`#7A1212`) to bright red (`#E23B2E`) powers the hero gradient, white/paper
  surfaces carry the rest of the page, black (`#111111`) anchors dark
  sections (Ministries, Footer), and a coral (`#FF6B52`) picks out accent
  words in headlines.
- **Type**: Poppins (display/headlines, bold/semibold) paired with Inter
  (body/UI) — a bold geometric sans matching the national site's actual
  typographic voice, set up via `next/font` in `app/layout.tsx`.
- **Motion**: restrained and purposeful — hero slide crossfades, staggered
  text entrance on the hero, hover reveals on ministry cards. No animation
  for its own sake.

## Before this is production-ready

1. **Create a Sanity project** (`npx sanity init` inside `sanity.config.ts`'s
   directory, or via sanity.io/manage) and drop the project ID/dataset into
   `.env.local` (see `.env.example`).
2. **Upload the real photos** you've gathered (church exterior, congregation,
   pastor, outreach) into Sanity as `heroSlide` and `leader`/`ministry`
   entries — the homepage currently points at placeholder paths in
   `app/page.tsx`.
3. **Connect every page to real data** — `app/sermons/`, `app/resources/`,
   `app/give/page.tsx`, `app/about/page.tsx`, `app/ministries/`, and
   `app/visit/page.tsx` currently use hardcoded placeholder arrays; swap in
   the matching query from `lib/sanity.ts` for each (`SERMONS_LIST_QUERY`,
   `RESOURCES_LIST_QUERY`, `BANK_ACCOUNTS_QUERY`, `LEADERS_QUERY`,
   `MINISTRIES_LIST_QUERY`, `SITE_SETTINGS_QUERY`) — every schema type now
   has a matching query, confirmed field-for-field against the schemas.
4. **Add a real Paystack public key** to `.env.local` — `PaystackButton` is
   fully wired to load the inline script and open the payment popup, it
   just needs `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` set.
5. **Wire up the form submissions** — `Plan Your Visit`, `Prayer Request`,
   and `Contact` forms currently just flip local state on submit (see the
   `TODO` comments in each). Decide how the church wants these routed —
   email, WhatsApp, or a Sanity document per submission — then connect a
   Next.js API route or a service like Resend/Formspree.
6. **Confirm the Youth Alive WhatsApp invite link** and add it to that
   ministry's `whatsappGroupLink` field in the Studio — every other
   ministry can reuse the same field once they have their own links too.

Every page in the agreed sitemap now has a working skeleton: Home, About,
Sermons (+ detail), Resources (+ detail/checkout), Ministries (+ detail),
Give, Visit, Contact, and Prayer Request.

## Versions — Next.js 16 / React 19 / Sanity Studio v6

As of August 2026, Next.js 14 is legacy — current stable is the 16.x line
(React 19 required since Next 15), and Sanity Studio's v5→v6 move also
requires React 19.2+. This scaffold targets:

- **Next.js** `^16.2.7`, **React** `^19.2.0`
- **Sanity Studio** `^6.0.0` (Vite 8 build tooling under the hood)
- **@sanity/client** `^7.26.2`
- **Node.js 20+** — required by both Next 16 and Studio v6 (see `engines`
  in `package.json`)

Two things worth knowing before you build on top of this:

1. **Dynamic route params are now async.** Since Next.js 15, `params` in
   any `[slug]` page is a `Promise`, not a plain object — every dynamic
   page in this scaffool (`sermons/[slug]`, `resources/[slug]`,
   `ministries/[slug]`) is already written as `async function` with
   `await params`. If you add more dynamic routes later, follow the same
   pattern or the build will error.
2. **Sanity Studio is deployed separately, not embedded at `/studio`.**
   This scaffold runs the Studio via `sanity dev` / `sanity deploy` from
   `sanity.config.ts` at the project root, rather than mounting it inside
   a Next.js App Router catch-all route. That's a deliberate choice, not
   an oversight — as of mid-2026 there's a known issue where Studio
   embedded inside a Next.js 16 App Router project (via `next-sanity`'s
   `NextStudio`) can 500 in Vercel production specifically, due to a
   jsdom/parse5 ESM conflict pulled in by `@sanity/vision`. Keeping the
   Studio as its own deployment sidesteps that entirely. If you later want
   an embedded `/studio` route for convenience, check the current status
   of that issue first.
3. **If you later add Sanity's live-preview (`<SanityLive>`)**, be aware
   Sanity's own docs flagged a request-volume issue when combining it with
   Next.js 16's default link-prefetch behavior (each prefetch can cascade
   into extra revalidation requests). Not relevant to this scaffold today
   since it doesn't use live preview, but worth checking `next-sanity`'s
   changelog before adding it.



Sermon audio is deliberately kept out of Sanity's own asset pipeline. Sanity
holds metadata only (`sermon.audioUrl` is a plain URL string); the actual
MP3 files live in **Cloudflare R2** and stream from R2's CDN — R2's free
egress is the whole point here, since it's what keeps costs near-zero even
if the sermon library gets shared widely.

**How it fits together:**

- `lib/r2.ts` — the R2 client (S3-compatible SDK) and `uploadSermonAudio()`,
  which writes to `sermons/{year}/{slug}.mp3` and returns the public CDN URL.
- `lib/transcode.ts` — `transcodeToMp3()`, which normalizes whatever format
  staff upload down to 96kbps mono MP3 using a bundled ffmpeg binary
  (`ffmpeg-static`) — the main lever on both storage size and bandwidth.
- `app/api/admin/upload-sermon/route.ts` — the Node.js (not Edge — ffmpeg
  needs a real binary) API route that ties transcode + upload together and
  hands back the CDN URL.
- `app/admin/upload-sermon/page.tsx` — the actual non-technical flow: staff
  pick a file, type a slug, click Upload, get a link back to paste into the
  sermon's Audio URL field in Sanity Studio. No R2 dashboard, no manual
  ffmpeg command.
- `components/AudioPlayer.tsx` — a thin wrapper around the native
  `<audio>` element. Browsers already support range-request streaming and
  seeking against a plain CDN URL, so no separate player library is needed.

**Before this works in production:**

1. Create the R2 bucket (`lfc-jalingo-sermons`) in the Cloudflare dashboard,
   enable public read access, and point a custom domain
   (e.g. `sermons.lfcjalingo.org`) at it for the CDN URL.
2. Generate R2 API credentials and drop them into `.env.local`
   (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`,
   `R2_PUBLIC_URL`) — see `.env.example`.
3. **Put real auth on `/admin/upload-sermon` and its API route** — both are
   unauthenticated in this scaffold (flagged with `TODO`s in each file). A
   shared-secret header checked in the API route is enough for a small
   church admin team; full user accounts are likely overkill here.
4. Sermons stay public-read by design (freely-given ministry content) —
   keep this distinct from `/resources`, where paid PDFs need real access
   control tied to payment status. Don't apply R2's public-bucket pattern
   to paid content, and don't add signed-URL complexity to sermons that
   don't need it.

**Rough cost shape:** at 96kbps, a sermon runs roughly 40–50MB per hour of
audio, so even a few hundred sermons is single-digit GBs — R2 storage cost
at that scale is a few cents a month, and egress stays free regardless of
how widely the library gets listened to.

## Design system v2 — homepage rebuild

The homepage, Nav, and Footer were rebuilt using structural cues from
reference church-site templates the client provided (First Church, Liquid
Church) — bento-style ministry grids, alternating dark/light banners, a
structured multi-column footer — while keeping the established LFC Jalingo
brand (red/white/black/coral, Poppins/Inter) rather than adopting the
references' own colors.

**New reusable components:**
- `components/Reveal.tsx` — the one scroll-triggered fade-up animation
  primitive, reused everywhere instead of one-off Motion config per
  component. `RevealGroup` + `revealItemVariants` staggers a set of siblings
  (grids, footer columns).
- `components/PageHero.tsx` — the eyebrow/bold-title/description pattern
  used consistently across every subpage hero, in `light` or `photo`
  (dark image-overlay) variants. **Not yet applied to About/Ministries/
  Visit/Contact — those still use their original inline headers pending the
  next design pass.**

**Rebuilt homepage sections:** `QuickLinksRow` (find-the-right-next-step
cards), `MinistriesTeaser` (asymmetric bento grid), `AboutTeaser` (dark
photo banner), `EventsRow` (needs the new `event` schema — see below),
`FeaturedSermon` (now a dark full-bleed banner), `InvolvementGrid` (2x2
next-steps), `GivingBand` (full-width banner instead of a thin link strip).

**New schema:** `event` (title, slug, date, image, category, description) —
add real events in the Studio and swap `EventsRow`'s placeholder array for
`sanityClient.fetch(UPCOMING_EVENTS_QUERY)`.

**Still on the original (pre-redesign) layout, pending the same treatment:**
~~About, Ministries (list + detail), Visit, Contact, Sermons, Resources.~~
**Update: all of these now use the v2 design system** — `PageHero` on every
subpage, `FeatureRow` (alternating image/text) on Ministries, `Accordion`
(solid-bar, Motion-animated) on Visit/Contact/About-Beliefs, `LeaderBio` +
`PillarsGrid` on About. Every page — including the sermon/resource detail
pages, Give, and Prayer Request — now uses the v2 design system:
`PageHero` at the top, `Reveal`-animated sections, and (on paid-resource
and giving flows) a `red-gradient` price header above the Paystack/bank
transfer card. The design pass is complete across the full sitemap.

**New reusable components added in this pass:** `Accordion.tsx`,
`FeatureRow.tsx`, `LeaderBio.tsx`, `PillarsGrid.tsx`.

## Content wiring: every page now fetches from Sanity

Every page component (Home, Sermons, Resources, Ministries, Give, About)
now calls its matching query from `lib/sanity.ts` instead of only holding
static placeholder arrays. Two things make this safe to ship before a real
Sanity project exists:

- **`safeFetch()`** (`lib/sanity.ts`) — wraps `sanityClient.fetch`, catches
  errors, and falls back to the same placeholder content each page used to
  hardcode. Detail pages (`[slug]` routes) use an equivalent inline
  try/catch since they need a query variable (`{ slug }`).
- **Nothing needs to change in the components once real data exists** — the
  moment a real `NEXT_PUBLIC_SANITY_PROJECT_ID` is set and real documents
  (with real photos) are published, `safeFetch` starts returning that data
  instead of the fallback automatically.

**Images specifically:** hero slides, leader/staff photos, ministry photos
and galleries, and event thumbnails all now render from
`image.asset->url` once uploaded in Sanity. Until then, they render as
empty placeholder boxes (ministry/event images) or the hardcoded
`/images/...` paths (hero) — neither of which exist as real files in this
scaffold, so uploading real photos to Sanity is the actual next step, not
adding files to `/public`.

A couple of small fixes worth knowing about if you're diffing against an
earlier version of this scaffold: `HOMEPAGE_HERO_QUERY` was requesting a
`_key` field that doesn't exist on standalone `heroSlide` documents (only
array items have `_key`) — fixed to alias `_id` instead. And the sermon
`body` field is Sanity portable text (rich blocks), not a plain string
array — `lib/portableText.ts` adds a minimal flattener for it; swap for
`@portabletext/react` later if the sermon notes need real rich formatting
(bold, lists, links).

## Local development

```bash
npm install
npm run dev
```

Sanity Studio (once a project ID is set) is typically run separately via
`npx sanity dev` from within the `sanity/` config, or embedded at a
`/studio` route if preferred later.
