#!/usr/bin/env node
// "Watch" a finished reel before it goes out (added 2026-10-03, idea from the
// @omgluka editing kit: let Claude actually look at the export, frame per cut,
// a close look at the first seconds, plus a fixed review checklist). Local and
// free: ffmpeg-static + our own whisper transcription, no API keys.
//
// Writes <video dir>/watch/ with:
//   cuts-sheet.png      one frame per visual cut, labelled with its time
//   hook-sheet.png      0-3 s at 4 fps (the swipe decision)
//   early-sheet.png     3-10 s at 1 fps
//   safezone-sheet.png  5 moments with Instagram's UI zones in red (text must stay out)
//   report.md / report.json  pacing, dead head/tail, audio clicks, loudness, colour vs raw
//
// Usage:
//   node scripts/watch-reel.mjs --video runs/<run>/<run>-final.mp4
//     [--raw runs/<run>/tightened.mp4]  (colour check: frame 0 skin vs the untouched avatar)
//     [--cover runs/<run>/cover.jpg]    (colour check for the cover too)
//     [--no-transcribe]                 (skip whisper; no dead-tail check)

import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import ffmpegPath from "ffmpeg-static";
import ffprobe from "@ffprobe-installer/ffprobe";

const run = promisify(execFile);
const FONT = "/System/Library/Fonts/Supplemental/Arial.ttf";

function parseArgs(argv) {
  const out = { transcribe: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--video") out.video = argv[++i];
    else if (a === "--raw") out.raw = argv[++i];
    else if (a === "--cover") out.cover = argv[++i];
    else if (a === "--no-transcribe") out.transcribe = false;
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!out.video) throw new Error("Usage: --video <final.mp4> [--raw tightened.mp4] [--cover cover.jpg] [--no-transcribe]");
  return out;
}

const ff = async (args) => (await run(ffmpegPath, ["-hide_banner", "-nostats", ...args], { maxBuffer: 1 << 28 })).stderr;
const fmt = (s) => `${s.toFixed(2)} s`;

async function probe(file) {
  const { stdout } = await run(ffprobe.path, ["-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height,r_frame_rate", "-of", "json", file]);
  const j = JSON.parse(stdout);
  const v = j.streams.find((s) => s.codec_type === "video");
  const [n, d] = v.r_frame_rate.split("/").map(Number);
  return { duration: Number(j.format.duration), width: v.width, height: v.height, fps: n / d };
}

// Visual cuts (hard cuts, B-Roll cut-ins, jump zooms). Animations inside a B-Roll rarely cross the threshold.
async function sceneCuts(video) {
  const log = await ff(["-i", video, "-vf", "scdet=threshold=12", "-an", "-f", "null", "-"]);
  return [...log.matchAll(/lavfi\.scd\.time:\s*([\d.]+)/g)].map((m) => Number(m[1]));
}

async function sheet(video, times, out, cols, label = true) {
  const tmp = `${out}.frames`;
  await mkdir(tmp, { recursive: true });
  const files = [];
  for (const [i, t] of times.entries()) {
    const f = path.join(tmp, `${String(i).padStart(3, "0")}.png`);
    const text = label ? `,drawtext=fontfile=${FONT}:text='${t.toFixed(2)}s':x=10:y=10:fontsize=34:fontcolor=white:box=1:boxcolor=black@0.6` : "";
    await ff(["-y", "-ss", String(t), "-i", video, "-frames:v", "1", "-vf", `scale=270:480${text}`, f]);
    files.push(f);
  }
  const rows = Math.ceil(files.length / cols);
  await ff(["-y", "-framerate", "1", "-i", path.join(tmp, "%03d.png"), "-vf", `tile=${cols}x${rows}:padding=4:color=white`, "-frames:v", "1", out]);
  await rm(tmp, { recursive: true, force: true });
}

// Instagram Reels UI on a 1080x1920 frame: top bar, right action column, bottom caption/username block.
const IG_ZONES = [
  { x: 0, y: 0, w: 1080, h: 160 },
  { x: 950, y: 1000, w: 130, h: 720 },
  { x: 0, y: 1600, w: 1080, h: 320 },
];
async function safeZoneSheet(video, duration, out) {
  const times = [0.05, duration * 0.25, duration * 0.5, duration * 0.75, Math.max(0, duration - 0.6)];
  const tmp = `${out}.frames`;
  await mkdir(tmp, { recursive: true });
  const boxes = IG_ZONES.map((z) => `drawbox=x=${z.x}:y=${z.y}:w=${z.w}:h=${z.h}:color=red@0.35:t=fill`).join(",");
  for (const [i, t] of times.entries()) {
    await ff(["-y", "-ss", String(t), "-i", video, "-frames:v", "1", "-vf", `scale=1080:1920,${boxes},scale=360:640`, path.join(tmp, `${i}.png`)]);
  }
  await ff(["-y", "-framerate", "1", "-i", path.join(tmp, "%d.png"), "-vf", "tile=5x1:padding=4:color=white", "-frames:v", "1", out]);
  await rm(tmp, { recursive: true, force: true });
}

// Clicks/pops: a 5 ms window whose high-passed peak jumps far above its own neighbourhood.
// Plosives can trigger this too, so the report lists times to listen to, not hard failures.
async function audioClicks(video) {
  const log = await ff(["-i", video, "-vn", "-af", "aresample=48000,highpass=f=3000,asetnsamples=n=240,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.Peak_level", "-f", "null", "-"]);
  const lv = [...log.matchAll(/Peak_level=(-?[\d.]+|-inf)/g)].map((m) => (m[1] === "-inf" ? -120 : Number(m[1])));
  const hits = [];
  for (let i = 8; i < lv.length - 8; i++) {
    const around = [...lv.slice(i - 8, i - 1), ...lv.slice(i + 2, i + 9)].sort((a, b) => a - b);
    const median = around[Math.floor(around.length / 2)];
    if (lv[i] - median > 24 && lv[i] > -30) hits.push({ t: (i * 240) / 48000, jumpDb: Math.round(lv[i] - median) });
  }
  // Keep the strongest per 300 ms.
  const out = [];
  for (const h of hits.sort((a, b) => b.jumpDb - a.jumpDb)) if (!out.some((o) => Math.abs(o.t - h.t) < 0.3)) out.push(h);
  return out.slice(0, 8).sort((a, b) => a.t - b.t);
}

async function loudness(video) {
  const log = await ff(["-i", video, "-vn", "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"]);
  const j = JSON.parse(log.slice(log.lastIndexOf("{"), log.lastIndexOf("}") + 1));
  return { lufs: Number(j.input_i), truePeak: Number(j.input_tp) };
}

// Mean saturation/brightness/hue of the face area (centre, upper half) of one frame.
async function faceColour(file, t = 0) {
  const pre = /\.(jpe?g|png)$/i.test(file) ? [] : ["-ss", String(t)];
  const log = await ff([...pre, "-i", file, "-frames:v", "1", "-vf", "scale=1080:1920,crop=400:480:340:560,signalstats,metadata=print", "-f", "null", "-"]);
  const get = (k) => Number((log.match(new RegExp(`signalstats\\.${k}=([\\d.]+)`)) || [])[1]);
  return { sat: get("SATAVG"), luma: get("YAVG"), hue: get("HUEAVG") };
}

async function transcribeFinal(video, dir) {
  const out = path.join(dir, "final-words.json");
  await run(process.execPath, ["scripts/transcribe.mjs", "--in", video, "--out", out], { cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), maxBuffer: 1 << 26 });
  return JSON.parse(await readFile(out, "utf-8"));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const video = path.resolve(args.video);
  const dir = path.join(path.dirname(video), "watch");
  await mkdir(dir, { recursive: true });
  const info = await probe(video);
  const D = info.duration;
  const flags = [];

  const cuts = await sceneCuts(video);
  const shots = [0, ...cuts, D].map((t, i, a) => (i ? t - a[i - 1] : null)).filter((x) => x !== null);
  const longest = Math.max(...shots);
  const longestAt = [0, ...cuts][shots.indexOf(longest)];
  if (longest > 6) flags.push(`Längste Einstellung ohne Bildwechsel: ${fmt(longest)} ab ${fmt(longestAt)} (über 6 s kann sich zäh anfühlen, Zoom oder B-Roll prüfen).`);
  const firstChange = cuts[0] ?? D;
  if (firstChange > 3.5) flags.push(`Erster Bildwechsel erst bei ${fmt(firstChange)}.`);

  await sheet(video, [0.05, ...cuts.map((t) => Math.min(D - 0.05, t + 0.1))].slice(0, 36), path.join(dir, "cuts-sheet.png"), 6);
  await sheet(video, Array.from({ length: 12 }, (_, i) => i * 0.25), path.join(dir, "hook-sheet.png"), 6);
  await sheet(video, Array.from({ length: 8 }, (_, i) => 3 + i).filter((t) => t < D), path.join(dir, "early-sheet.png"), 8);
  await safeZoneSheet(video, D, path.join(dir, "safezone-sheet.png"));

  const clicks = await audioClicks(video);
  const loud = await loudness(video);
  if (Math.abs(loud.lufs + 14) > 1) flags.push(`Lautheit ${loud.lufs} LUFS (Ziel −14 ±1).`);
  if (loud.truePeak > -0.9) flags.push(`True Peak ${loud.truePeak} dBTP (Ziel ≤ −1).`);

  let colour = null;
  if (args.raw || args.cover) {
    colour = { final: await faceColour(video, 0.05) };
    if (args.raw) colour.raw = await faceColour(path.resolve(args.raw), 0.05);
    if (args.cover) colour.cover = await faceColour(path.resolve(args.cover));
    const base = colour.raw;
    for (const k of ["final", "cover"]) {
      if (!base || !colour[k]) continue;
      const ds = (colour[k].sat - base.sat) / base.sat;
      if (Math.abs(ds) > 0.2) flags.push(`Hautfarbe ${k}: Sättigung ${ds > 0 ? "+" : ""}${Math.round(ds * 100)} % gegenüber Rohclip.`);
    }
  }

  let words = null;
  let deadHead = null;
  let deadTail = null;
  if (args.transcribe) {
    words = await transcribeFinal(video, dir);
    if (words.length) {
      deadHead = words[0].startMs / 1000;
      deadTail = D - words[words.length - 1].endMs / 1000;
      if (deadHead > 0.35) flags.push(`Erstes Wort erst bei ${fmt(deadHead)} (Hook soll sofort starten).`);
      if (deadTail > 1.2) flags.push(`Nach dem letzten Wort noch ${fmt(deadTail)} Video (toter Schwanz, Ende auf dem Payoff).`);
    }
  }

  const report = { video: args.video, duration: D, cuts, shots: { count: shots.length, avg: D / shots.length, longest, longestAt }, firstChange, clicks, loudness: loud, colour, deadHead, deadTail, flags };
  await writeFile(path.join(dir, "report.json"), JSON.stringify(report, null, 2));

  const md = [
    `# Watch-Report: ${path.basename(video)}`,
    "",
    `Länge ${fmt(D)} · ${shots.length} Einstellungen · Ø ${fmt(D / shots.length)} · erster Bildwechsel ${fmt(firstChange)}`,
    `Lautheit ${loud.lufs} LUFS · True Peak ${loud.truePeak} dBTP` + (deadTail !== null ? ` · erstes Wort ${fmt(deadHead)} · Ende nach letztem Wort ${fmt(deadTail)}` : ""),
    colour ? `Gesicht (Sättigung/Helligkeit): ${Object.entries(colour).map(([k, v]) => `${k} ${v.sat.toFixed(1)}/${v.luma.toFixed(0)}`).join(" · ")}` : "",
    "",
    "## Auffällig",
    ...(flags.length ? flags.map((f) => `- ${f}`) : ["- nichts"]),
    "",
    "## Mögliche Klicks (anhören)",
    ...(clicks.length ? clicks.map((c) => `- ${fmt(c.t)} (+${c.jumpDb} dB)`) : ["- keine"]),
    "",
    "## Anschauen (Checkliste)",
    "- hook-sheet.png: Hook in der ersten Sekunde lesbar, Bewegung ab Frame 0, ganzes Gesicht im Bild?",
    "- cuts-sheet.png: Jeder Schnitt zeigt etwas Neues, kein Sprung im Wort?",
    "- safezone-sheet.png: Kein Text, keine Untertitel in den roten Instagram-Zonen?",
    "- Hautfarbe wie im Rohclip, Ende direkt auf dem Payoff.",
  ].filter((l) => l !== null).join("\n");
  await writeFile(path.join(dir, "report.md"), md + "\n");
  console.log(md);
  console.log(`\nSheets in ${path.relative(process.cwd(), dir)}/`);
}

main().catch((err) => {
  console.error(err.stderr || err.message || err);
  process.exit(1);
});
