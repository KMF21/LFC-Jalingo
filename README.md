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
- **`sanity/lib/`** — the Sanity client, GROQ queries, and Live Content API
  setup (`client.ts`, `queries.ts`, `live.ts`, `safe-fetch.ts`, `image.ts`)
  — see "Sanity architecture" below for why this is structured this way.

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
3. ~~Connect every page to real data~~ — **done.** Every page fetches its
   matching query via `sanity/lib/safe-fetch.ts`, backed by
   `sanity/lib/queries.ts` (see "Content wiring" and "Sanity architecture"
   below).
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
2. **Sanity Studio runs as a standalone deployment, not embedded at
   `/studio`.** This has flip-flopped once already in this document's
   history, so here's the final state and why: Studio was briefly embedded
   at `app/studio/[[...tool]]/` using the raw `Studio` component, which
   surfaced two separate real build failures — first a known
   `@sanity/vision` jsdom/parse5 conflict (addressed by dropping
   `visionTool`), then an "Unknown module type" Turbopack error from
   `@sanity/workbench` (pulled in by `structureTool` itself, not
   removable the same way). That's not one unlucky package, it's a
   pattern: Sanity Studio v6 is built for Vite, and Next.js's bundler
   wasn't designed to bundle its internals. The embedded route has been
   removed. Studio now runs only via the standalone CLI —
   `npx sanity dev` for local editing, `npx sanity deploy` to publish it
   to its own `*.sanity.studio` URL — using `sanity.config.ts` at the
   project root, which Vite handles natively with none of these issues.
   `visionTool` is safe to re-add in that standalone context specifically,
   since the risk was Next.js bundling it, not Sanity Studio running it.
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

**Transcoding happens in the browser, not on the server — this changed.**
The original design ran ffmpeg server-side via `ffmpeg-static` +
`fluent-ffmpeg`, but that hit two separate real, blocking failures in
practice: pnpm's build-script approval blocking the binary download on
Windows, and — more importantly — no guarantee that whatever binary
worked in local dev would also work in Vercel's Linux serverless runtime.
That's not one unlucky package, it's the same pattern that broke the
embedded Sanity Studio route (see below): native, platform-specific
binaries are a bad fit for Next.js's build/runtime model. Rather than keep
patching around it, transcoding was moved to run via **ffmpeg.wasm**
entirely client-side, in the admin's browser tab, before the file is ever
uploaded — eliminating the native-binary dependency altogether, in dev and
in production, on every OS, permanently.

**How it fits together:**

- `public/ffmpeg/ffmpeg-core.js` + `ffmpeg-core.wasm` — the actual
  ffmpeg.wasm core (single-threaded build — deliberately not the
  multi-threaded variant, which would require COOP/COEP cross-origin
  isolation headers on the whole site just for this one admin page),
  self-hosted here rather than pulled from a third-party CDN at runtime,
  so this tool doesn't depend on an external service being up. ~31MB;
  that's fine as a one-time download on an occasional-use admin page, not
  something to add to a public-facing route.
- `app/admin/upload-sermon/page.tsx` — loads ffmpeg.wasm on demand, runs
  the same 96kbps mono MP3 conversion the old server-side step did, shows
  live progress, then uploads the already-compressed file. Staff still
  just pick a file, type a slug, click Upload — the compression step is
  invisible to them beyond a progress indicator.
- `app/api/admin/upload-sermon/route.ts` — much simpler now: checks the
  `x-admin-secret` header, then hands the (already-compressed) bytes
  straight to `uploadSermonAudio()`. No transcoding, no native binary, no
  particular runtime requirement beyond what the R2 SDK itself needs.
- `lib/r2.ts` — unchanged — the R2 client and `uploadSermonAudio()`, which
  writes to `sermons/{year}/{slug}.mp3` and returns the public CDN URL.
- `components/AudioPlayer.tsx` — unchanged — a thin wrapper around the
  native `<audio>` element for range-request streaming/seeking.

**Before this works in production:**

1. Create the R2 bucket (`lfc-jalingo-sermons`) in the Cloudflare dashboard,
   enable public read access, and point a custom domain
   (e.g. `sermons.lfcjalingo.org`) at it for the CDN URL.
2. Generate R2 API credentials and drop them into `.env.local`
   (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`,
   `R2_PUBLIC_URL`) — see `.env.example`.
3. Set `ADMIN_UPLOAD_SECRET` — the upload page and its API route already
   enforce this (fails closed if unset), it just needs a real value.
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

## Content wiring: every page fetches from Sanity via the Live Content API

Every page component (Home, Sermons, Resources, Ministries, Give, Visit,
About) fetches its data through `sanity/lib/`, which is structured as the
project's standing default for any Sanity CMS integration:

- **`sanity/lib/client.ts`** — the base `next-sanity` client.
- **`sanity/lib/live.ts`** — `defineLive({ client })`, exporting
  `sanityFetch` and `<SanityLive />`. This is what gives real-time updates
  when content changes in Studio — no manual revalidation, no webhooks,
  no polling. `<SanityLive />` is mounted once in `app/layout.tsx`.
- **`sanity/lib/queries.ts`** — every GROQ query and its matching
  TypeScript type, in one place.
- **`sanity/lib/safe-fetch.ts`** — `safeSanityFetch()` and
  `safeSanityFetchOne()`, a thin wrapper around `sanityFetch` that catches
  errors and falls back to placeholder content instead of throwing or
  rendering empty. This matters specifically because no real Sanity
  project exists yet: every page calls this instead of `sanityFetch`
  directly, so the site stays fully functional with placeholder data
  today, and starts pulling real, **live-updating** content automatically
  the moment a real project ID + real documents exist — no further code
  changes needed at that point.

**Images specifically:** hero slides, leader/staff photos, ministry photos
and galleries, and event thumbnails all render from `image.asset->url`
once uploaded in Sanity. Until then, they render as empty placeholder
boxes (ministry/event images) or the hardcoded `/images/...` paths (hero)
— neither of which exist as real files in this scaffold, so uploading
real photos to Sanity is the actual next step, not adding files to
`/public`.

A couple of fixes worth knowing about if you're diffing against an
earlier version of this scaffold: `HOMEPAGE_HERO_QUERY` was requesting a
`_key` field that doesn't exist on standalone `heroSlide` documents (only
array items have `_key`) — fixed to alias `_id` instead. And the sermon
`body` field is Sanity portable text (rich blocks), not a plain string
array — `lib/portableText.ts` adds a minimal flattener for it; swap for
`@portabletext/react` later if the sermon notes need real rich formatting
(bold, lists, links).

**Also wired:** the homepage's `ServiceTimes`, the Visit page's service
times/address/map, and the **Footer** (address, service times, Facebook/
WhatsApp links) — all pull from `siteSettings` via one shared
`FALLBACK_SITE_SETTINGS` constant in `sanity/lib/queries.ts`, so there's a
single source of truth instead of the same data typed in three places.
The Footer required making `app/layout.tsx` itself an async server
component, since it wraps every route and is the one place the Footer
renders from — and that's also where `<SanityLive />` is mounted.

**Deliberately still static, not a gap:** the Contact page's FAQ, the About
page's beliefs accordion and pillars grid, and the homepage's ministries
bento grid (which intentionally curates a fixed five rather than listing
everything — that's what `/ministries` is for). None of these have a
corresponding Sanity schema — they were built as fixed content because no
content type was ever defined for "FAQ entries" or "belief statements." If
you want those editable from Studio too, that's a schema-design decision
(a `faq` document type, etc.) rather than a wiring fix.

## Diagnosing "content isn't pulling from Sanity" + auto-populating known content

`safeSanityFetch()` (above) deliberately hides fetch failures behind
placeholder content — great for the site never breaking, bad for telling a
wrong project ID, an empty dataset, and a CORS block apart, since all
three look identical from the browser. Two scripts fix that:

1. **`node scripts/check-sanity.mjs`** — talks to Sanity directly via
   `@sanity/client` (not `next-sanity`/`sanityFetch` — this is a
   standalone Node script outside the Next.js app, so it doesn't need the
   Live Content API machinery). Reports whether the project ID is
   actually set (vs still the `.env.example` placeholder), whether the
   connection works at all (surfaces CORS errors explicitly, with the
   fix), and how many documents of each type exist. Run this first,
   always — it tells you which of the three problems you actually have.

2. **`SANITY_API_WRITE_TOKEN=sk... node scripts/seed.mjs`** — populates
   Sanity with every piece of real content already established for this
   project (leader names/roles, ministry descriptions, exact service
   times, and the two homepage hero slides — same copy that was
   hardcoded as the fallback, now editable in Studio) instead of
   retyping it into Studio by hand. Idempotent — safe to re-run after
   editing the data in the script. Auto-attaches photos too, if found at
   the `public/images/leaders/...` / `public/images/ministries/...` paths
   listed in the script — anything not found is logged so you know
   exactly which photos are still needed. Deliberately does **not**
   invent bank account numbers, Paystack keys, social links, or the
   pastor's `welcomeMessage` (seeded only as an unmistakable bracketed
   placeholder) — those are real financial/business details or words
   attributed to a real person, not something to fabricate.

Get a write token at sanity.io/manage → this project → API → Tokens →
Editor permission. Keep it server-side only (`SANITY_API_WRITE_TOKEN`,
never `NEXT_PUBLIC_`) and never commit it.

## Local development

```bash
npm install
npm run dev
```

Sanity Studio (once a project ID is set) is typically run separately via
`npx sanity dev` from within the `sanity/` config, or embedded at a
`/studio` route if preferred later.

## Latest additions: mobile hero fix, pastor welcome, founder section

- **Mobile hero image bug, fixed.** `HeroSlider` previously wrapped the
  photo in `hidden md:block` — a desktop-only side panel — so mobile
  visitors saw only the plain gradient, no photo at all. Rebuilt as one
  full-bleed image + gradient overlay at every breakpoint (stronger
  overlay on mobile, since there's no side panel absorbing darkness
  there).
- **`components/PastorWelcome.tsx`** — a homepage welcome section (photo +
  first-person message + name/title). Renders **nothing** until a real
  `leader.welcomeMessage` exists in Sanity — no placeholder or drafted
  text stands in, since this copy is publicly attributed to a real, named
  person and must be his own approved words. See the field description on
  `sanity/schemas/leader.ts` and the note in `scripts/seed.mjs` — this
  field is seeded only as an unmistakable bracketed placeholder, never a
  drafted quote.
- **`components/FounderSection.tsx`** — factual, text-only paragraph about
  Bishop David Oyedepo and Living Faith Church Worldwide on the About
  page, plus a one-line mention added to the homepage's `AboutTeaser`.
  Deliberately no photo (no licensed image of him to use) and no quoted
  "message" — biographical fact only, same reasoning as above applied to
  a more public figure.

## Sanity architecture: the Live Content API (defineLive), not plain fetch

This project's standing default for any Sanity integration is
`next-sanity`'s **Live Content API** (`defineLive`), not a plain
`@sanity/client` + manual `fetch()` call. The difference matters:

**Version matters here, concretely.** `defineLive`/`next-sanity/live` as
a stable subpath requires `next-sanity` **v13 or later** (which in turn
requires Next.js 16, React 19.2+, and `@sanity/client` 7.26.1+ — all
already satisfied by this project's other dependencies). An earlier
version of this scaffold pinned `next-sanity` to `^9.8.53`, which doesn't
reliably expose `next-sanity/live` — that caused a
`Module not found: Can't resolve 'next-sanity/live'` build error. If you
ever see that error again, check `package.json`'s `next-sanity` version
before anything else.

`sanity/lib/live.ts` also deliberately passes `serverToken: false,
browserToken: false` when `SANITY_API_READ_TOKEN` isn't set, rather than
throwing — this project doesn't use Draft Mode or Visual Editing, so a
token isn't required for real-time updates to published content to work.
If Draft Mode/Visual Editing gets added later, set that env var and it's
picked up automatically.

- **Plain `client.fetch()`** gets cached by Next.js like any other fetch.
  Without extra work (time-based revalidation, on-demand webhook
  revalidation, or `force-dynamic`), a Studio publish might not show up
  on the live site until the next deploy.
- **`sanityFetch()` from `defineLive`** automatically tags its requests
  and pushes updates to the browser in real time via `<SanityLive />` —
  publish something in Studio, and pages using `sanityFetch` reflect it
  without a redeploy or a manual cache-busting step.

Every page in this app uses the second approach, via
`sanity/lib/safe-fetch.ts`'s wrappers around `sanityFetch`. If you (or a
future contributor, or another AI session) ever add a new page or a new
query, **use `safeSanityFetch`/`safeSanityFetchOne` from
`sanity/lib/safe-fetch.ts`**, not a raw `client.fetch()` call — that's how
this consistency is maintained. The one correct exception is the
standalone Node scripts (`scripts/seed.mjs`, `scripts/check-sanity.mjs`),
which use `@sanity/client` directly since they run outside the Next.js
app entirely and have no use for live browser updates.

## Content updated in Studio but not showing on the site?

Two things to check, roughly in order of likelihood:

1. **Did you click Publish, not just save?** Studio autosaves as a
   *draft* (`drafts.<id>`), invisible to the standard published-content
   queries this app uses. Closing the edit panel isn't the same as
   publishing.
2. **Did you edit the right field?** `leader` documents have both a
   "Short bio" (`bio`, used on the About page) and a "Homepage welcome
   message" (`welcomeMessage`, used on Home) — easy to mix up.

Caching is generally *not* the culprit here, by design — every page uses
`sanityFetch` (via `safeSanityFetch`) from the Live Content API, which
pushes updates through `<SanityLive />` without needing a manual
`revalidate` value or a redeploy. If updates still aren't appearing, check
that `<SanityLive />` is actually mounted (`app/layout.tsx`) and that
`SANITY_API_READ_TOKEN` is set if your dataset is private.

To rule out the app entirely and check Sanity's actual data directly:
open Studio → the Vision tool (usually in the top toolbar) → paste in
the exact query from `sanity/lib/queries.ts` (e.g. `PASTOR_WELCOME_QUERY`)
→ run it. If it returns your content there, the data is correct and the
issue is in the app's fetch wiring. If it returns nothing, the problem is
in Studio (draft vs. published, or wrong field) — `scripts/check-sanity.mjs`
is the command-line equivalent of the same check.

## Repo audit fixes (this pass)

Pulled the actual repo via `codeload.github.com` (GitHub's zip-download
endpoint) rather than working from README prose, and found/fixed:

- **Deleted `app/(site)/about/upload-sermon/page.tsx`** — a duplicate of
  `app/admin/upload-sermon/page.tsx`, byte-for-byte, but nested under
  About instead of Admin. This meant the sermon-upload tool was reachable
  at an unintended, publicly-discoverable `/about/upload-sermon` URL in
  addition to the real one. The real one at `/admin/upload-sermon` is
  untouched and still fully functional.
- **Removed `visionTool()`** from `sanity.config.ts` and dropped the
  `@sanity/vision` dependency, then **removed the embedded `/studio`
  route entirely** (`app/studio/`) after it produced a second real build
  failure — Turbopack's "Unknown module type" on `@sanity/workbench` — on
  top of the jsdom/parse5 risk `visionTool` alone didn't fully address.
  Studio now runs only via the standalone CLI; see the Versions section
  above for the full explanation.
- **Deleted confirmed-dead files**: `lib/sanity.ts` (fully superseded by
  `sanity/lib/*`, grepped and confirmed unused anywhere), the empty
  default-stub `sanity/schemaTypes/` folder (real schemas load from
  `sanity/schemas/`, also confirmed via `sanity.config.ts`'s actual
  import), `components/MinistryCard.tsx` and `components/ServiceCard.tsx`
  (both confirmed unreferenced — superseded by `FeatureRow` and
  `ServiceTimesGrid`), and a stray 0-byte temp file that had been
  accidentally committed at repo root.
- **Confirmed, did not need to change:** `/admin/upload-sermon` and its
  API route already have real auth — an `x-admin-secret` header checked
  against `ADMIN_UPLOAD_SECRET`, failing closed (rejects everyone) if the
  env var isn't set, rather than failing open. This was already correctly
  implemented, not just a TODO.

## R2 setup progress + the transcoding pivot

**Update since this section was written:** the R2 bucket
(`lfc-jalingo-sermons`) has been created via the Cloudflare Developer
Platform connector and confirmed live. Public access + custom domain
(`R2_PUBLIC_URL`) and API credentials (`R2_ACCOUNT_ID`,
`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`) have all been generated and
are set in `.env.local` — same reminder as always: mirror them into your
hosting provider's environment variables too, or they won't reach
production.

**Also since this section was written:** server-side transcoding
(`ffmpeg-static` + `fluent-ffmpeg`, `lib/transcode.ts`) was replaced
entirely by client-side transcoding via ffmpeg.wasm, after it caused real
build/runtime failures that a native binary dependency was always at risk
of hitting differently in dev vs. production. See the "Sermon audio"
section above for the full explanation — `lib/transcode.ts` no longer
exists.

Remaining before this is fully production-ready:

1. **Test end-to-end.** Run `pnpm dev`, visit `/admin/upload-sermon`,
   enter `ADMIN_UPLOAD_SECRET`, upload a short test audio file, confirm it
   returns a real `pub-....r2.dev/sermons/...` (or your custom domain) URL,
   and confirm that URL actually plays in a browser.
2. **Mirror all env vars into production hosting** (Vercel etc.) — the
   five `R2_*` vars plus `ADMIN_UPLOAD_SECRET`, not just `.env.local`.
3. Optional hardening for later: real admin auth beyond the shared secret
   if the admin team grows past one or two trusted people.

The original numbered setup steps below are kept for reference / to
re-run if the bucket or credentials ever need regenerating from scratch.

Code-side, this is already fully wired (`lib/r2.ts`, the upload route +
page, the confirmed auth) — what's left is entirely Cloudflare-dashboard
work only the site owner can do:

1. **Create the R2 bucket.** Cloudflare dashboard → R2 → Create bucket →
   name it `lfc-jalingo-sermons` (matching `R2_BUCKET` in `.env.example`)
   or update the env var to match whatever name you choose.
2. **Enable public read access** on the bucket and point a custom domain
   at it (e.g. `sermons.lfcjalingo.org`) — R2 → the bucket → Settings →
   Public Access. This becomes `R2_PUBLIC_URL`.
3. **Generate R2 API credentials.** Cloudflare dashboard → R2 → Manage R2
   API Tokens → Create API Token, with read+write permissions scoped to
   this bucket. This gives you the Account ID, Access Key ID, and Secret
   Access Key for `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` /
   `R2_SECRET_ACCESS_KEY`.
4. **Set all five R2_* variables** in `.env.local` for local testing, AND
   in your hosting provider's environment variables (Vercel etc.) for
   production — same rule as the Sanity project ID: a value only in
   `.env.local` never reaches a deployed site.
5. **Generate `ADMIN_UPLOAD_SECRET`** too, if not already set — any long
   random string (`openssl rand -hex 32`), shared only with whoever
   manages sermon uploads.
6. Test end-to-end: visit `/admin/upload-sermon`, enter the secret, upload
   a short test audio file, confirm it returns a real CDN URL, and confirm
   that URL actually plays in a browser.
