"use client";

import { useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// TODO: this page is unauthenticated at the network level (anyone who
// finds the URL can load it) — the actual protection is the
// ADMIN_UPLOAD_SECRET check inside the API route below. Put it behind
// proper admin auth (or at minimum an unlisted, hard-to-guess path) before
// real sermon files pass through it.
export default function UploadSermonPage() {
  const [status, setStatus] = useState<"idle" | "loading-ffmpeg" | "transcoding" | "uploading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  // Transcoding now happens here, client-side, via ffmpeg.wasm — not on
  // the server. This deliberately trades a one-time ~30MB download (the
  // wasm core, self-hosted in public/ffmpeg/ rather than pulled from a
  // third-party CDN) for eliminating an entire category of problem: no
  // native binary dependency anywhere on the server, in dev or in
  // production, on any OS. The API route below only ever receives an
  // already-compressed MP3 and hands it straight to R2.
  async function getFfmpeg(): Promise<FFmpeg> {
    if (ffmpegRef.current) return ffmpegRef.current;

    const ffmpeg = new FFmpeg();
    ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)));

    const baseURL = "/ffmpeg";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setProgress(0);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("audio") as HTMLInputElement;
    const slugInput = form.elements.namedItem("slug") as HTMLInputElement;
    const yearInput = form.elements.namedItem("year") as HTMLInputElement;
    const secretInput = form.elements.namedItem("secret") as HTMLInputElement;

    const rawFile = fileInput.files?.[0];
    if (!rawFile) return;

    try {
      // 1. Transcode in the browser to 96kbps mono MP3, matching the same
      //    target the old server-side ffmpeg step used.
      setStatus("loading-ffmpeg");
      const ffmpeg = await getFfmpeg();

      setStatus("transcoding");
      const inputName = "input" + (rawFile.name.match(/\.[a-zA-Z0-9]+$/)?.[0] || "");
      await ffmpeg.writeFile(inputName, await fetchFile(rawFile));
      await ffmpeg.exec([
        "-i", inputName,
        "-ac", "1",
        "-b:a", "96k",
        "output.mp3",
      ]);
const outputData = await ffmpeg.readFile("output.mp3");
if (typeof outputData === "string") {
  throw new Error("Unexpected text output from ffmpeg — expected binary MP3 data");
}
const mp3Blob = new Blob([Uint8Array.from(outputData)], { type: "audio/mpeg" });

      // 2. Upload the already-compressed file — the API route no longer
      //    does any transcoding itself, just an R2 upload.
      setStatus("uploading");
      const formData = new FormData();
      formData.append("audio", mp3Blob, "audio.mp3");
      formData.append("slug", slugInput.value);
      formData.append("year", yearInput.value);

      const res = await fetch("/api/admin/upload-sermon", {
        method: "POST",
        headers: { "x-admin-secret": secretInput.value },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setResultUrl(data.audioUrl);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  const statusLabel: Record<typeof status, string> = {
    idle: "Upload",
    "loading-ffmpeg": "Loading compressor (first time only, ~30MB)…",
    transcoding: `Compressing… ${progress}%`,
    uploading: "Uploading to storage…",
    done: "Done",
    error: "Upload",
  };

  return (
    <main className="container-content max-w-lg py-12">
      <p className="text-xs font-semibold uppercase tracking-wide2 text-red">Admin</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink">Upload sermon audio</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Pick the raw sermon file — it&rsquo;s compressed right here in your browser before
        uploading, so nothing large or unprocessed ever leaves your device. Copy the link
        this gives you into the sermon&rsquo;s &ldquo;Audio URL&rdquo; field in Sanity Studio.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-paper-dim p-6">
        <label className="text-xs font-semibold text-ink-muted">
          Sermon file (any common audio format)
          <input required type="file" name="audio" accept="audio/*" className="mt-1 block w-full text-sm" />
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
        <label className="text-xs font-semibold text-ink-muted">
          Admin passcode
          <input
            required
            type="password"
            name="secret"
            className="mt-1 h-11 w-full rounded-full border border-ink/15 bg-paper px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-red/30"
          />
        </label>

        <button
          type="submit"
          disabled={status !== "idle" && status !== "error" && status !== "done"}
          className="mt-2 h-11 rounded-full bg-red text-sm font-semibold text-paper transition hover:bg-red-deep disabled:opacity-60"
        >
          {statusLabel[status]}
        </button>
      </form>

      {status === "done" && resultUrl && (
        <div className="mt-4 rounded-2xl border border-ink/10 bg-paper-dim p-4">
          <p className="text-xs font-semibold text-ink-muted">Done — copy this into Sanity:</p>
          <p className="mt-1 break-all text-sm text-ink">{resultUrl}</p>
        </div>
      )}
      {status === "error" && errorMsg && <p className="mt-4 text-sm text-red">{errorMsg}</p>}
    </main>
  );
}
