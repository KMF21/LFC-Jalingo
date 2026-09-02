"use client";

import { useState } from "react";

export default function PlanVisitForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper-dim p-6 text-center">
        <p className="font-display text-lg font-semibold text-ink">We can&rsquo;t wait to see you!</p>
        <p className="mt-2 text-sm text-ink-muted">Someone from our team will reach out shortly.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire to an API route / email service once the church
        // decides how they want first-timer details routed (e.g. WhatsApp,
        // email, or a Sanity `visitRequest` document).
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
        required
        type="tel"
        placeholder="Phone number"
        className="h-11 rounded-full border border-ink/15 bg-paper px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red/30"
      />
      <input
        type="date"
        className="h-11 rounded-full border border-ink/15 bg-paper px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red/30"
      />
      <button
        type="submit"
        className="mt-1 h-11 rounded-full bg-red text-sm font-semibold text-paper transition hover:bg-red-deep"
      >
        Plan my visit
      </button>
    </form>
  );
}
