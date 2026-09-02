import { NextRequest, NextResponse } from "next/server";
import { transcodeToMp3 } from "@/lib/transcode";
import { uploadSermonAudio } from "@/lib/r2";

// Must run on the Node.js runtime, not Edge — ffmpeg-static ships a native
// binary that Edge functions can't execute.
export const runtime = "nodejs";

// TODO: this route is unauthenticated in the scaffold. Before this goes
// live, gate it behind whatever admin auth the church site ends up using
// (a simple shared-secret header is enough for a small church team — full
// user accounts are almost certainly overkill here).
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio");
    const slug = formData.get("slug");
    const yearRaw = formData.get("year");

    if (!(file instanceof Blob) || typeof slug !== "string" || !slug) {
      return NextResponse.json(
        { error: "Missing required fields: audio (file), slug (string)" },
        { status: 400 }
      );
    }

    const year = typeof yearRaw === "string" && yearRaw ? parseInt(yearRaw, 10) : new Date().getFullYear();

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const mp3Buffer = await transcodeToMp3(rawBuffer);
    const audioUrl = await uploadSermonAudio({ buffer: mp3Buffer, year, slug });

    return NextResponse.json({
      audioUrl,
      originalSizeBytes: rawBuffer.byteLength,
      transcodedSizeBytes: mp3Buffer.byteLength,
      note: "Paste this audioUrl into the sermon's 'Audio URL (R2 / CDN)' field in Sanity Studio.",
    });
  } catch (err) {
    console.error("Sermon upload failed:", err);
    return NextResponse.json({ error: "Upload/transcode failed" }, { status: 500 });
  }
}
