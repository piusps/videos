#!/usr/bin/env node
// The final step: mixes a (separately prepared, NOT sped-up) music bed and
// optional sound effects under an already speed-ramped video. Split out as
// its own step because the 1.1x speed ramp (scripts/speed-ramp.mjs) must
// apply ONLY to picture + voice-over, never to music or SFX (user spec,
// 2026-09-24).
//
// Usage: node scripts/mux-music.mjs --video <sped-up.mp4> --out <final.mp4>
//          [--music <bed.m4a>] [--music-volume 0.15] [--sfx <sfx.json>]
//
// sfx.json: [{ "atSec": 12.3, "file": "/abs/ui-check.mp3", "volume": 0.5 }]
// — atSec on the FINAL (sped-up) timeline; render-pipeline.mjs converts.
// `--music` must already be trimmed to exactly the video's own duration
// (scripts/prepare-music.mjs, --duration = the SPED-UP video's length).

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import ffmpegPath from "ffmpeg-static";

const run = promisify(execFile);

function parseArgs(argv) {
  const out = { musicVolume: 0.15 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--video") out.video = argv[++i];
    else if (a === "--music") out.music = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--music-volume") out.musicVolume = parseFloat(argv[++i]);
    else if (a === "--sfx") out.sfx = argv[++i];
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!out.video || !out.out) {
    throw new Error("Usage: --video <file> --out <file> [--music <file>] [--music-volume 0.15] [--sfx <json>]");
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sfx = args.sfx ? JSON.parse(await readFile(args.sfx, "utf-8")) : [];

  const inputs = ["-i", args.video];
  const filters = [];
  const mixLabels = ["[0:a]"];
  let idx = 1;
  if (args.music) {
    inputs.push("-i", args.music);
    filters.push(`[${idx}:a]volume=${args.musicVolume}[music]`);
    mixLabels.push("[music]");
    idx++;
  }
  sfx.forEach((s, i) => {
    inputs.push("-i", s.file);
    const ms = Math.max(0, Math.round(s.atSec * 1000));
    filters.push(`[${idx}:a]volume=${s.volume ?? 0.5},adelay=${ms}|${ms}[sfx${i}]`);
    mixLabels.push(`[sfx${i}]`);
    idx++;
  });
  filters.push(`${mixLabels.join("")}amix=inputs=${mixLabels.length}:duration=first:normalize=0[aout]`);

  await run(ffmpegPath, [
    "-y",
    ...inputs,
    "-filter_complex", filters.join(";"),
    "-map", "0:v",
    "-map", "[aout]",
    "-c:v", "copy",
    "-c:a", "aac", "-b:a", "256k",
    args.out,
  ], { maxBuffer: 1024 * 1024 * 64 });

  console.log(`Done: ${args.out}${sfx.length ? ` (+${sfx.length} SFX)` : ""}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
