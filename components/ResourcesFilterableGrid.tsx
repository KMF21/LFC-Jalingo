// components/ResourcesFilterableGrid.tsx
"use client";

import { useState } from "react";
import ResourceCard, { ResourceListItem } from "./ResourceCard";

const filters = [
  { label: "All", match: () => true },
  { label: "Books", match: (r: ResourceListItem) => r.category === "Book" },
  { label: "Devotionals", match: (r: ResourceListItem) => r.category === "Devotional" },
  { label: "Teaching Guides", match: (r: ResourceListItem) => r.category === "Teaching Guide" },
  { label: "Free", match: (r: ResourceListItem) => r.isFree === true },
];

export default function ResourcesFilterableGrid({ resources }: { resources: ResourceListItem[] }) {
  const [activeLabel, setActiveLabel] = useState("All");
  const activeFilter = filters.find((f) => f.label === activeLabel) ?? filters[0];
  const visible = resources.filter(activeFilter.match);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setActiveLabel(f.label)}
            aria-pressed={activeLabel === f.label}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              activeLabel === f.label
                ? "bg-red text-paper"
                : "border border-ink/15 text-ink-muted hover:border-red hover:text-red"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {visible.map((r) => (
            <ResourceCard key={r.slug} resource={r} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-ink-muted">
          No resources in this category yet — check back soon.
        </p>
      )}
    </div>
  );
}