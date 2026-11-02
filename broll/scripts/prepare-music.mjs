#!/usr/bin/env node
// Prepares a background-music bed for one specific video: skips the first
// second of the source track (per user spec, 2026-09-24), then trims OR
// loops it to land on EXACTLY the target video duration, with a short
// fade-out at the very end so it never cuts off abruptly.
//
// Usage: node scripts/prepare-music.mjs --in <music.mp3> --out <bed.m4a> --duration <seconds>

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "@ffprobe-installer/ffprobe";

const run = promisify(execFile);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--in") out.in = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--duration") out.duration = parseFloat(argv[++i]);
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!out.in || !out.out || !out.duration) {
    throw new Error("Usage: --in <file> --out <file> --duration <seconds>");
  }
  return out;
}

async function probeDuration(path) {
  const { stdout } = await run(ffprobePath.path, [
    "-v", "error", "-show_entries", "format=duration", "-of", "json", path,
  ]);
  return parseFloat(JSON.parse(stdout).format.duration);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourceDuration = await probeDuration(args.in);
  const usable = sourceDuration - 1; // skip first second
  const fadeStart = Math.max(0, args.duration - 1);

  const filters = [`atrim=1`, `asetpts=PTS-STARTPTS`];
  if (usable < args.duration) {
    // Source (after skipping 1s) is shorter than the video — loop it.
    filters.push(`aloop=loop=-1:size=2147483647`);
  }
  filters.push(`atrim=0:${args.duration}`, `asetpts=PTS-STARTPTS`);
  filters.push(`afade=t=out:st=${fadeStart}:d=${Math.min(1, args.duration)}`);

  await run(ffmpegPath, [
    "-y", "-i", args.in,
    "-af", filters.join(","),
    "-c:a", "aac",
    args.out,
  ], { maxBuffer: 1024 * 1024 * 64 });

  console.log(`Done: ${args.out} (${args.duration.toFixed(2)}s, source ${sourceDuration.toFixed(2)}s)`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
