import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

/**
 * Transcodes a raw uploaded audio buffer (whatever format church staff
 * happen to upload — WAV, M4A, high-bitrate MP3 from a recorder, etc.)
 * down to 96kbps mono-friendly MP3. This is the single biggest lever on
 * both storage size and R2 egress-adjacent costs (transfer, not R2 itself,
 * since R2 egress is free) as the library grows.
 *
 * Runs via ffmpeg-static, a bundled ffmpeg binary — works in a standard
 * Next.js Node.js serverless function (NOT the Edge runtime, which can't
 * run native binaries). The API route that calls this must declare
 * `export const runtime = "nodejs"`.
 */
export async function transcodeToMp3(inputBuffer: Buffer): Promise<Buffer> {
  const workDir = await mkdtemp(path.join(tmpdir(), "sermon-"));
  const inputPath = path.join(workDir, "input");
  const outputPath = path.join(workDir, "output.mp3");

  try {
    await writeFile(inputPath, inputBuffer);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .audioCodec("libmp3lame")
        .audioBitrate("96k")
        .audioChannels(1) // mono is fine, often preferable, for spoken word
        .format("mp3")
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .save(outputPath);
    });

    return await readFile(outputPath);
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
