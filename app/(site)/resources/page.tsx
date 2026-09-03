import PageHero from "@/components/PageHero";
import ResourceCard, { ResourceListItem } from "@/components/ResourceCard";
import { safeFetch, RESOURCES_LIST_QUERY } from "@/lib/sanity";

const fallbackResources: ResourceListItem[] = [
  { slug: "the-miracle-seed", title: "The Miracle Seed", category: "Book", isFree: false, price: 1500 },
  { slug: "word-of-the-week", title: "Word of the Week — Consecration", category: "Devotional", isFree: true },
  { slug: "prayer-guidelines", title: "Prayer Guidelines", category: "Teaching Guide", isFree: true },
];

const categories = ["All", "Books", "Devotionals", "Teaching Guides", "Free"];

export default async function ResourcesPage() {
  const resources = await safeFetch<ResourceListItem[]>(RESOURCES_LIST_QUERY, fallbackResources);

  return (
    <main>
      <PageHero
        eyebrow="Resources"
        title="Books &"
        accentWord="publications"
        description="Download sermons, devotionals, and books — free, or for a stipulated amount."
      />
      <div className="container-content py-12">
      <div className="flex flex-wrap gap-2">
        {categories.map((c, i) => (
          <span
            key={c}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              i === 0 ? "bg-red text-paper" : "border border-ink/15 text-ink-muted"
            }`}
          >
            {c}
          </span>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {resources.map((r) => (
          <ResourceCard key={r.slug} resource={r} />
        ))}
      </div>
      </div>
    </main>
  );
}
