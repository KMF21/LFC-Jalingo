"use client";

import { useState } from "react";

// TODO: this page is unauthenticated in the scaffold, matching the API
// route it calls. Put it behind admin auth (or at minimum an unlisted,
// hard-to-guess path plus the shared-secret header noted in the API
// route) before real sermon files pass through it.
export default function UploadSermonPage() {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("uploading");
    setErrorMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/admin/upload-sermon", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setResultUrl(data.audioUrl);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <main className="container-content max-w-lg py-12">
      <p className="text-xs font-semibold uppercase tracking-wide2 text-red">Admin</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink">Upload sermon audio</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Pick the raw sermon file — it&rsquo;ll be compressed and stored automatically.
        Copy the link this gives you into the sermon&rsquo;s &ldquo;Audio URL&rdquo; field in
        Sanity Studio.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-paper-dim p-6">
        <label className="text-xs font-semibold text-ink-muted">
          Sermon file (any common audio format)
          <input
            required
            type="file"
            name="audio"
            accept="audio/*"
            className="mt-1 block w-full text-sm"
          />
        </label>
        <label className="text-xs font-semibold text-ink-muted">
          Slug (used in the file name — e.g. gateways-to-financial-dominion)
          <input
            required
            type="text"
            name="slug"
            placeholder="gateways-to-financial-dominion"
            className="mt-1 h-11 w-full rounded-full border border-ink/15 bg-paper px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-red/30"
          />
        </label>
        <label className="text-xs font-semibold text-ink-muted">
          Year preached
          <input
            type="number"
            name="year"
            defaultValue={new Date().getFullYear()}
            className="mt-1 h-11 w-full rounded-full border border-ink/15 bg-paper px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-red/30"
          />
        </label>

        <button
          type="submit"
          disabled={status === "uploading"}
          className="mt-2 h-11 rounded-full bg-red text-sm font-semibold text-paper transition hover:bg-red-deep disabled:opacity-60"
        >
          {status === "uploading" ? "Compressing & uploading…" : "Upload"}
        </button>
      </form>

      {status === "done" && resultUrl && (
        <div className="mt-4 rounded-2xl border border-ink/10 bg-paper-dim p-4">
          <p className="text-xs font-semibold text-ink-muted">Done — copy this into Sanity:</p>
          <p className="mt-1 break-all text-sm text-ink">{resultUrl}</p>
        </div>
      )}
      {status === "error" && errorMsg && (
        <p className="mt-4 text-sm text-red">{errorMsg}</p>
      )}
    </main>
  );
}
