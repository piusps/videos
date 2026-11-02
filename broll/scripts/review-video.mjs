#!/usr/bin/env node
// Automated final-cut QC (OpenRouter video + image input): sends the finished
// reel plus its frame 0 (= the thumbnail) to a vision model with FINAL_RUBRIC
// and writes <video>.review.json. Run after render-pipeline.mjs and before
// delivering to the user; fix `fix_first` if it fails.
//
// Usage: node scripts/review-video.mjs --video final.mp4 [--model google/gemini-2.5-flash]

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import { review, REVIEW_MODEL } from "./lib/openrouter.mjs";
import { FINAL_RUBRIC } from "./lib/rubrics.mjs";

function parseArgs(argv) {
  const out = { model: REVIEW_MODEL };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--video") out.video = argv[++i];
    else if (argv[i] === "--model") out.model = argv[++i];
    else throw new Error(`Unknown arg: ${argv[i]}`);
  }
  if (!out.video) throw new Error("Usage: --video <final.mp4> [--model id]");
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const tmp = await mkdtemp(path.join(tmpdir(), "review-"));
  const frame0 = path.join(tmp, "frame0.jpg");
  await promisify(execFile)(ffmpegPath, ["-y", "-i", args.video, "-frames:v", "1", "-q:v", "2", frame0]);
  // 540p proxy keeps the base64 request small (a 1080p final is ~35 MB);
  // everything the rubric checks is still clearly visible at this size.
  const proxy = path.join(tmp, "proxy.mp4");
  await promisify(execFile)(ffmpegPath, ["-y", "-i", args.video, "-vf", "scale=540:-2", "-c:v", "libx264", "-crf", "30", "-preset", "fast", "-c:a", "aac", "-b:a", "64k", proxy]);

  const verdict = await review({
    model: args.model,
    instructions: FINAL_RUBRIC + "\nThe first attachment is frame 0 (the thumbnail), the second is the full reel.",
    media: [{ kind: "image", file: frame0 }, { kind: "video", file: proxy }],
  });
  await rm(tmp, { recursive: true, force: true });

  const out = args.video.replace(/\.mp4$/, ".review.json");
  await writeFile(out, JSON.stringify(verdict, null, 2));
  console.log(JSON.stringify(verdict, null, 2));
  console.log(`\nSaved: ${out}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
