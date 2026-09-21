import { NextRequest, NextResponse } from "next/server";
import { uploadSermonAudio } from "@/lib/r2";

// No longer needs the Node.js runtime specifically for a native binary's
// sake — transcoding now happens client-side via ffmpeg.wasm before the
// file ever reaches this route (see app/admin/upload-sermon/page.tsx and
// the "Sermon audio" README section for why). Kept on nodejs anyway since
// the R2 upload SDK expects Node's Buffer/stream APIs, not because of
// ffmpeg.
export const runtime = "nodejs";

function isAuthorized(req: NextRequest): boolean {
  const configuredSecret = process.env.ADMIN_UPLOAD_SECRET;
  // Fail CLOSED, not open: if the secret isn't configured at all, nobody
  // can upload — an unset env var must never be read as "auth disabled."
  if (!configuredSecret) return false;
  const provided = req.headers.get("x-admin-secret");
  return provided === configuredSecret;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    // The file arriving here is already a compressed MP3 — transcoding
    // happened client-side (see the page component). This route's only
    // job now is authorization plus handing the bytes to R2.
    const mp3Buffer = Buffer.from(await file.arrayBuffer());
    const audioUrl = await uploadSermonAudio({ buffer: mp3Buffer, year, slug });

    return NextResponse.json({
      audioUrl,
      sizeBytes: mp3Buffer.byteLength,
      note: "Paste this audioUrl into the sermon's 'Audio URL (R2 / CDN)' field in Sanity Studio.",
    });
  } catch (err) {
    console.error("Sermon upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
