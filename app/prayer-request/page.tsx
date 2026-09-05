"use client";

import { useState } from "react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export default function PrayerRequestPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main>
      <PageHero
        eyebrow="Prayer request"
        title="We're praying"
        accentWord="with you"
        description="Share what's on your heart — our prayer team will stand with you in faith."
      />

      <section className="container-content max-w-lg pb-16">
        {submitted ? (
          <Reveal>
            <div className="rounded-2xl border border-ink/10 bg-paper-dim p-6 text-center">
              <p className="font-display text-lg font-semibold text-ink">Your request has been received</p>
              <p className="mt-2 text-sm text-ink-muted">We&rsquo;re standing in faith with you.</p>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: wire to an API route / Sanity `prayerRequest` document
                // once the church decides how these should be routed internally.
                setSubmitted(true);
              }}
              className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-paper-dim p-6"
            >
              <input
                required
                placeholder="Full name"
                className="h-11 rounded-full border border-ink/15 bg-paper px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red/30"
              />
              <input
                type="tel"
                placeholder="Phone number (optional)"
                className="h-11 rounded-full border border-ink/15 bg-paper px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red/30"
              />
              <textarea
                required
                placeholder="Your prayer request"
                rows={4}
                className="rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red/30"
              />
              <button
                type="submit"
                className="mt-1 h-11 rounded-full bg-red text-sm font-semibold text-paper transition hover:bg-red-deep"
              >
                Submit request
              </button>
            </form>
          </Reveal>
        )}
      </section>
    </main>
  );
}
