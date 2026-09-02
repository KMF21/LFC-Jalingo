import HeroSlider, { HeroSlide } from "@/components/HeroSlider";
import ServiceTimes from "@/components/ServiceTimes";
import QuickLinksRow from "@/components/QuickLinksRow";
import MinistriesTeaser from "@/components/MinistriesTeaser";
import AboutTeaser from "@/components/AboutTeaser";
import EventsRow, { EventItem } from "@/components/EventsRow";
import FeaturedSermon, { FeaturedSermonData } from "@/components/FeaturedSermon";
import InvolvementGrid from "@/components/InvolvementGrid";
import GivingBand from "@/components/GivingBand";
import { safeFetch, HOMEPAGE_HERO_QUERY, FEATURED_SERMON_QUERY, UPCOMING_EVENTS_QUERY } from "@/lib/sanity";

// Fallback content — used until a real Sanity project + real documents
// exist (see .env.example and the "Design system" section of the README).
// Once real heroSlide/sermon/event documents are published, these are
// never reached; safeFetch only falls back on an empty/failed query.
const fallbackHeroSlides: HeroSlide[] = [
  {
    _key: "1",
    title: "Welcome to Living Faith",
    accentWord: "Church, Jalingo",
    subtitle: "New Ground, Mile Six Bypass Road, Dinyavoh",
    imageUrl: "/images/lfchurch.jpg",
    ctaLabel: "Plan your visit",
    ctaHref: "/visit",
  },
  {
    _key: "2",
    title: "A word for your",
    accentWord: "liberation",
    subtitle: "Listen to our latest sermons, free to stream or download",
    imageUrl: "/images/congregation.jpg",
    ctaLabel: "Browse sermons",
    ctaHref: "/sermons",
  },
];

const fallbackFeaturedSermon: FeaturedSermonData = {
  title: "Sermon title",
  preacher: "Pst Jesse Dazema",
  date: "20 Jul 2026",
  audioUrl: "",
  durationSeconds: undefined,
  pdfUrl: "#",
};

const fallbackEvents: EventItem[] = [
  { slug: "mid-year-praise", title: "Mid Year Praise — Next Level Praise", date: "12 Jul", category: "Youth Alive" },
  { slug: "cell-growth-workshop", title: "Cell Growth & Replication Workshop", date: "26 Jul", category: "Leadership" },
  { slug: "communion-service", title: "Holy Communion Service", date: "02 Aug", category: "Sunday Service" },
];

export default async function HomePage() {
  const [heroSlides, featuredSermon, events] = await Promise.all([
    safeFetch<HeroSlide[]>(HOMEPAGE_HERO_QUERY, fallbackHeroSlides),
    safeFetch<FeaturedSermonData>(FEATURED_SERMON_QUERY, fallbackFeaturedSermon),
    safeFetch<EventItem[]>(UPCOMING_EVENTS_QUERY, fallbackEvents),
  ]);

  return (
    <main>
      <HeroSlider slides={heroSlides} />
      <ServiceTimes />
      <QuickLinksRow />
      <MinistriesTeaser />
      <AboutTeaser />
      <EventsRow events={events} />
      <FeaturedSermon sermon={featuredSermon} />
      <InvolvementGrid />
      <GivingBand />
    </main>
  );
}
