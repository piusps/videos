#!/usr/bin/env node
// One-time local setup: installs the whisper.cpp binary + downloads the
// transcription model used for word-level caption timing. Run this once
// before the first render-pipeline.mjs run:
//
//   node scripts/setup-whisper.mjs
//
// Word-level timing is needed for a clean karaoke caption highlight
// (design.md §7) — HeyGen's own SRT sidecar is only phrase-level, too
// coarse to highlight a single active word. "base" is a good
// accuracy/speed tradeoff for German speech on a laptop; bump to "medium"
// if transcription accuracy on tricky words (tool names, trigger words) is
// a problem in practice.

import path from "node:path";
import { installWhisperCpp, downloadWhisperModel } from "@remotion/install-whisper-cpp";

const WHISPER_DIR = path.join(process.cwd(), "whisper.cpp");
const WHISPER_VERSION = "1.7.4";
const WHISPER_MODEL = "medium";

async function main() {
  const { alreadyExisted } = await installWhisperCpp({
    to: WHISPER_DIR,
    version: WHISPER_VERSION,
  });
  console.log(alreadyExisted ? "whisper.cpp already installed." : "whisper.cpp installed.");

  await downloadWhisperModel({
    folder: WHISPER_DIR,
    model: WHISPER_MODEL,
  });
  console.log(`Model "${WHISPER_MODEL}" ready.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
