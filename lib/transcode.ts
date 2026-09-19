import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { tmpdir } from "os";
import path from "path";

const bundledFfmpegAvailable = Boolean(ffmpegPath && existsSync(ffmpegPath));
if (bundledFfmpegAvailable) {
  ffmpeg.setFfmpegPath(ffmpegPath as string);
}

function ffmpegNotFoundError(): Error {
  return new Error(
    `No usable ffmpeg found. Tried the bundled ffmpeg-static binary at ` +
      `"${ffmpegPath}" (missing — its postinstall script likely never ran, ` +
      `a known pnpm behavior, not a bug in this code) and a system-installed ` +
      `\`ffmpeg\` on PATH (not found either). Fix either one: ` +
      `(1) run \`pnpm approve-builds\`, confirm ffmpeg-static is actually ` +
      `selected/checked in the list (not just listed), press enter to ` +
      `confirm, then delete node_modules and run \`pnpm install\` again — ` +
      `approving alone doesn't retroactively fix an already-installed copy, ` +
      `it only takes effect on the next install; or ` +
      `(2) install ffmpeg system-wide instead: \`winget install ffmpeg\` on ` +
      `Windows, \`brew install ffmpeg\` on macOS, \`apt install ffmpeg\` on ` +
      `Linux — then restart the dev server so it picks up the updated PATH.`
  );
}

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
        .audioChannels(1)
        .format("mp3")
        .on("end", () => resolve())
        .on("error", (err: any) => {
          if (err?.code === "ENOENT" || /ENOENT/.test(String(err?.message))) {
            reject(ffmpegNotFoundError());
          } else {
            reject(err);
          }
        })
        .save(outputPath);
    });

    return await readFile(outputPath);
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}