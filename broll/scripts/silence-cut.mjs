#!/usr/bin/env node
// Detects silence/breathing-pause gaps in a talking-head clip's audio and
// hard-cuts them out — video AND audio together, so the result is "Ton an
// Ton": the moment one word ends, the next begins, no dead air, no visible
// jump-cut artifact from cutting only one track.
//
// Usage:
//   node scripts/silence-cut.mjs --in <heygen-clip.mp4> --out <tightened.mp4> [--json <keep-segments.json>]
//     [--noise -35dB] [--min-silence 0.15] [--pad 0.04]
//
// --noise: ffmpeg silencedetect noise floor (dB). -35dB is a reasonable
//   default for a clean studio-mic HeyGen render; lower (more negative) if
//   background hiss is being missed as "silence".
// --min-silence: minimum gap length (seconds) to actually count as a pause
//   worth cutting — keeps natural micro-gaps between words untouched and
//   only removes genuine breathing pauses/dead air.
// --pad: seconds of padding kept on each side of a detected silence (so we
//   don't clip the tail/head of a word right next to the gap).
//
// Also writes a `keep-segments.json` describing the [start,end] windows (in
// the ORIGINAL clip's timeline) that were kept, in order — used to remap
// anything computed against the original timeline (there shouldn't be much,
// since captions/zooms in this pipeline are derived from the ALREADY
// tightened output, but this file is kept as an audit trail).

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile } from "node:fs/promises";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "@ffprobe-installer/ffprobe";

const run = promisify(execFile);

function parseArgs(argv) {
  // Defaults match CapCut "remove pauses" (user reference, 2026-09-24): word
  // butts against word, any gap >= 0.15s goes, footage loss is fine.
  const out = { noise: "-35dB", minSilence: 0.15, pad: 0.04 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--in") out.in = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--json") out.json = argv[++i];
    else if (a === "--noise") out.noise = argv[++i];
    else if (a === "--min-silence") out.minSilence = parseFloat(argv[++i]);
    else if (a === "--pad") out.pad = parseFloat(argv[++i]);
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!out.in || !out.out) {
    throw new Error("Usage: --in <file> --out <file> [--json <file>] [--noise -35dB] [--min-silence 0.35] [--pad 0.06]");
  }
  return out;
}

async function probeDuration(path) {
  const { stdout } = await run(ffprobePath.path, [
    "-v", "error", "-show_entries", "format=duration", "-of", "json", path,
  ]);
  return parseFloat(JSON.parse(stdout).format.duration);
}

async function detectSilences(path, noise, minSilence) {
  // ffmpeg writes silencedetect output to stderr, not stdout; it exits 0
  // either way, but grab stderr from the error object too in case the
  // installed ffmpeg build ever returns non-zero for a `-f null` sink.
  let stderr = "";
  try {
    const res = await run(ffmpegPath, [
      "-i", path,
      "-af", `silencedetect=noise=${noise}:d=${minSilence}`,
      "-f", "null", "-",
    ], { maxBuffer: 1024 * 1024 * 64 });
    stderr = res.stderr ?? "";
  } catch (err) {
    stderr = err.stderr ?? "";
    if (!stderr) throw err;
  }

  const silences = [];
  const startRe = /silence_start:\s*([\d.]+)/g;
  const endRe = /silence_end:\s*([\d.]+)/g;
  const starts = [...stderr.matchAll(startRe)].map((m) => parseFloat(m[1]));
  const ends = [...stderr.matchAll(endRe)].map((m) => parseFloat(m[1]));
  for (let i = 0; i < Math.min(starts.length, ends.length); i++) {
    silences.push({ start: starts[i], end: ends[i] });
  }
  return silences;
}

function computeKeepSegments(duration, silences, pad) {
  // Invert the silence list into keep windows, padding into each silence by
  // `pad` seconds so we never clip the word right next to it.
  const keep = [];
  let cursor = 0;
  for (const s of silences) {
    const cutStart = s.start + pad;
    const cutEnd = s.end - pad;
    if (cutStart > cursor && cutEnd > cutStart) {
      keep.push({ start: cursor, end: cutStart });
      cursor = cutEnd;
    }
  }
  if (cursor < duration) keep.push({ start: cursor, end: duration });
  return keep.filter((k) => k.end - k.start > 0.05);
}

async function cutSegments(inPath, outPath, keep) {
  const filterParts = [];
  const labels = [];
  keep.forEach((seg, i) => {
    filterParts.push(
      `[0:v]trim=${seg.start}:${seg.end},setpts=PTS-STARTPTS[v${i}]`
    );
    filterParts.push(
      `[0:a]atrim=${seg.start}:${seg.end},asetpts=PTS-STARTPTS[a${i}]`
    );
    labels.push(`[v${i}][a${i}]`);
  });
  filterParts.push(`${labels.join("")}concat=n=${keep.length}:v=1:a=1[outv][outa]`);

  await run(ffmpegPath, [
    "-y", "-i", inPath,
    "-filter_complex", filterParts.join(";"),
    "-map", "[outv]", "-map", "[outa]",
    // Intermediate file: near-lossless so the later hard zooms (up to ~186%)
    // don't magnify compression artifacts from an extra generation.
    "-c:v", "libx264", "-crf", "10", "-preset", "medium", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "320k",
    outPath,
  ], { maxBuffer: 1024 * 1024 * 64 });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const duration = await probeDuration(args.in);
  console.log(`Source duration: ${duration.toFixed(2)}s`);

  const silences = await detectSilences(args.in, args.noise, args.minSilence);
  console.log(`Detected ${silences.length} silence gap(s) >= ${args.minSilence}s`);

  const keep = computeKeepSegments(duration, silences, args.pad);
  const removed = duration - keep.reduce((sum, k) => sum + (k.end - k.start), 0);
  console.log(`Keeping ${keep.length} segment(s), removing ${removed.toFixed(2)}s of pauses`);

  if (keep.length === 0) {
    throw new Error("No keep-segments computed — silence thresholds are probably too aggressive.");
  }

  if (args.json) {
    await writeFile(args.json, JSON.stringify({ sourceDuration: duration, keep }, null, 2));
  }

  await cutSegments(args.in, args.out, keep);
  console.log(`Done: ${args.out}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
