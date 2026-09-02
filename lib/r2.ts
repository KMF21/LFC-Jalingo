import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// R2 is S3-compatible, so the standard AWS SDK works against it — just
// point the endpoint at the account-specific R2 URL. This client is
// server-only (used from the API route); never import it into a client
// component, since it needs the R2 secret key.
export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const R2_BUCKET = process.env.R2_BUCKET || "lfc-jalingo-sermons";

// The public CDN domain the bucket is mapped to (e.g. sermons.lfcjalingo.org),
// set up once in the Cloudflare dashboard per the README's Step 1.
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://sermons.lfcjalingo.org";

/**
 * Uploads an already-transcoded MP3 buffer to R2 and returns its public
 * CDN URL. Key convention: sermons/{year}/{slug}.mp3 — keeps the bucket
 * browsable and easy to bulk-manage by year later.
 */
export async function uploadSermonAudio(params: {
  buffer: Buffer;
  year: number;
  slug: string;
}): Promise<string> {
  const key = `sermons/${params.year}/${params.slug}.mp3`;

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: params.buffer,
      ContentType: "audio/mpeg",
      // Sermons are freely-given ministry content (unlike the paid PDFs),
      // so the bucket is public-read — no signed URLs needed here. Keep
      // this distinct from the paid-resource access flow in /resources.
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return `${R2_PUBLIC_URL}/${key}`;
}
