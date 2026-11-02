#!/usr/bin/env node
// Final pass: speeds the ENTIRE finished render (video + audio, captions/
// zooms/B-Roll/music all already burned in) up by a flat factor — default
// 1.1x per user spec (2026-09-24). Applied last, on the whole composited
// file, so nothing upstream needs its own timestamps re-derived for it.
//
// Usage: node scripts/speed-ramp.mjs --in <final.mp4> --out <final-1.1x.mp4> [--factor 1.1]

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";

const run = promisify(execFile);

function parseArgs(argv) {
  const out = { factor: 1.1 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--in") out.in = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--factor") out.factor = parseFloat(argv[++i]);
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!out.in || !out.out) throw new Error("Usage: --in <file> --out <file> [--factor 1.1]");
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  // atempo supports 0.5-2.0 directly, 1.1 is well within range, no chaining needed.
  await run(ffmpegPath, [
    "-y", "-i", args.in,
    "-filter_complex",
    // Final delivery encode: light unsharp compensates some of the softness
    // from the talking-head push-ins without visible halos.
    `[0:v]setpts=PTS/${args.factor},unsharp=5:5:0.35:5:5:0[v];[0:a]atempo=${args.factor}[a]`,
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p",
    // Tag BT.709 explicitly (2026-10-05): untagged/BT.601 finals looked fine in browsers but
    // tomato-red in QuickTime/iPhone. Remotion renders with --color-space=bt709 to match.
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
    "-c:a", "aac", "-b:a", "256k",
    args.out,
  ], { maxBuffer: 1024 * 1024 * 64 });
  console.log(`Done: ${args.out} (${args.factor}x)`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
