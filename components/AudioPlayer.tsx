"use client";

import { useRef, useState } from "react";

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Thin, styled wrapper around the native <audio> element. Deliberately
 * relies on the browser's built-in streaming/range-request support rather
 * than a heavier player library — the R2/CDN URL supports range requests
 * natively, so seeking doesn't require downloading the full file first.
 */
export default function AudioPlayer({ src, initialDuration }: { src: string; initialDuration?: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(initialDuration ?? 0);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) el.pause();
    else el.play();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const value = Number(e.target.value);
    el.currentTime = value;
    setCurrent(value);
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper-dim px-4 py-3">
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red text-paper"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={current}
        onChange={seek}
        className="h-1 flex-1 accent-red"
      />
      <span className="w-20 shrink-0 text-right text-xs text-ink-muted">
        {formatTime(current)} / {formatTime(duration)}
      </span>
    </div>
  );
}
