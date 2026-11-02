#!/usr/bin/env node
// Second camera ("Cam 2") for every talking-head video: one short cut to a
// visibly different camera angle on one sentence, cut in with soft 4-frame
// dissolves, lips following the ORIGINAL audio.
//
//   mode "wan"   — Alibaba Wan 3.0 via OpenRouter, image-to-video from a fixed,
//                  approved Cam-2 still of this avatar (same room, outfit, face),
//                  the avatar says the sentence; the clip is time-fitted to the
//                  original sentence. ~0.85 $ per video (3 s, 1080p, with sound).
//   mode "local" — free fallback: tighter, angled crop with slight perspective
//                  and a handheld drift from the main footage (not a new angle).
//   mode "auto"  — wan if a still exists and OpenRouter works, otherwise local.
//
// Usage:
//   node scripts/cam2.mjs --video tightened.mp4 --out tightened-cam2.mp4 --window-out cam2-window.json \
//     [--still assets/cam2/niklas.png] [--mode auto|wan|local] [--avoid broll-windows.json] [--sentence "…"]
//
// Sentence choice (unless --sentence): the first sentence after the hook that
// is 1.6–3.4 s long, starts after 2.5 s, ends 8 s before the end (CTA stays on
// the main camera) and doesn't touch a B-Roll window. Cut points are measured
// in the audio (quietest 10 ms around the word boundary), never taken from the
// caption timings, which can be ~0.7 s off.

import path from "node:path";
import { spawn } from "node:child_process";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import { generateVideo } from "./lib/openrouter.mjs";

const BROLL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WHISPER = path.join(BROLL_ROOT, "whisper.cpp/build/bin/whisper-cli");
const WHISPER_MODEL = path.join(BROLL_ROOT, "whisper.cpp/ggml-medium.bin");
const FPS = 25;
const DISSOLVE = 4; // frames

function parseArgs(argv) {
  const out = { mode: "auto", still: path.join(BROLL_ROOT, "assets/cam2/niklas.png") };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--video") out.video = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--window-out") out.windowOut = argv[++i];
    else if (a === "--still") out.still = argv[++i];
    else if (a === "--mode") out.mode = argv[++i];
    else if (a === "--avoid") out.avoid = argv[++i];
    else if (a === "--sentence") out.sentence = argv[++i];
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!out.video || !out.out || !out.windowOut) throw new Error("Usage: --video <tightened.mp4> --out <file> --window-out <json> [--still png] [--mode auto|wan|local] [--avoid json] [--sentence text]");
  return out;
}

function run(cmd, args, { binary = false } = {}) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let err = "";
    const p = spawn(cmd, args);
    p.stdout.on("data", (d) => chunks.push(d));
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => {
      if (code !== 0) return reject(new Error(`${path.basename(cmd)} exited ${code}: ${err.slice(-1500)}`));
      resolve(binary ? Buffer.concat(chunks) : Buffer.concat(chunks).toString() + err);
    });
  });
}

const norm = (s) => s.toLowerCase().replace(/[^a-zäöüß0-9 ]+/gi, " ").replace(/\s+/g, " ").trim();

// Word-level timings straight from whisper (medium) on the given file's audio.
// Whisper timings drift over long files, so the chosen sentence is re-transcribed
// on a short excerpt (offset/len in seconds) where they are accurate.
async function words(file, work, offset = 0, len = 0) {
  const tag = `${path.basename(file)}-${offset.toFixed(2)}`;
  const wav = path.join(work, `${tag}.wav`);
  await run(ffmpegPath, ["-y", ...(offset || len ? ["-ss", String(offset), "-t", String(len)] : []), "-i", file, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav]);
  const base = path.join(work, `${tag}.words`);
  await run(WHISPER, ["-m", WHISPER_MODEL, "-f", wav, "-l", "de", "-ml", "1", "-oj", "-of", base]);
  const tokens = JSON.parse(await readFile(`${base}.json`, "utf8")).transcription;
  const out = [];
  for (const t of tokens) {
    const text = t.text;
    if (!text.trim()) continue;
    if (out.length && !text.startsWith(" ")) {
      out.at(-1).text += text;
      out.at(-1).end = t.offsets.to / 1000 + offset;
    } else out.push({ text: text.trim(), start: t.offsets.from / 1000 + offset, end: t.offsets.to / 1000 + offset });
  }
  return { list: out, wav };
}

// RMS per 10 ms of a 16 kHz mono wav.
async function envelope(wav) {
  const pcm = await run(ffmpegPath, ["-i", wav, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], { binary: true });
  const win = 160;
  const env = [];
  for (let i = 0; i + win * 2 <= pcm.length; i += win * 2) {
    let s = 0;
    for (let j = 0; j < win; j++) {
      const v = pcm.readInt16LE(i + j * 2);
      s += v * v;
    }
    env.push(Math.sqrt(s / win));
  }
  return env; // index = 10 ms steps
}

// Quietest 10 ms step within [from, to] seconds.
function quietest(env, from, to) {
  let best = Math.max(0, Math.round(from * 100));
  for (let i = best; i <= Math.min(env.length - 1, Math.round(to * 100)); i++) if (env[i] < env[best]) best = i;
  return best / 100;
}

function sentences(list) {
  const out = [];
  let cur = [];
  for (const w of list) {
    cur.push(w);
    if (/[.!?]$/.test(w.text)) {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) out.push(cur);
  return out.map((ws) => ({ text: ws.map((w) => w.text).join(" "), start: ws[0].start, end: ws.at(-1).end }));
}

async function probe(file) {
  const info = await run(ffmpegPath, ["-hide_banner", "-i", file]).catch((e) => e.message);
  const v = info.match(/Video: .*?, (\d+)x(\d+)/);
  const d = info.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return { width: +v[1], height: +v[2], duration: +d[1] * 3600 + +d[2] * 60 + +d[3] };
}

const WAN_PROMPT = (sentence, seconds) => `Image-to-video. Output format: vertical 9:16, 1080p (1080×1920). The start image is the first frame. Keep its camera angle, framing, room and lighting exactly for the whole clip. A static tripod shot: no camera movement, no zoom, no pan, no cuts, one continuous take.

PERFORMANCE
- The man keeps the pose from the start image, not turning further. His head faces the camera and he looks straight into the lens with steady eye contact the whole time.
- From the very first frame he speaks exactly one German sentence into the camera, clearly articulated at a brisk, natural pace, and finishes after about ${seconds.toFixed(1)} seconds:
  "${sentence}"
- His mouth shapes match these German words syllable by syllable. No other words, no mumbling, no pause at the start.
- After the sentence he stays silent with his mouth closed, still looking into the lens, with a calm, slightly serious expression.
- Natural, subtle motion: small head nods on key words, natural blinks, a slight movement of his hands. His body does not turn toward the camera and he does not walk.

KEEP 1:1 FROM THE START IMAGE
- The exact same face, hair, beard stubble and skin texture in every frame; his identity must not drift.
- The same clothes with their creases and details.
- The same lighting, colour grade, exposure, contrast, natural smartphone sharpness and grain.
- The same room and furniture.

No text, no captions, no music, no background noise. Vertical 9:16, 1080×1920, 1080p.

Keep the location, dialogue and actions identical.`;

async function wanClip(args, sentence, frames, work) {
  const dur = frames / FPS;
  const seconds = Math.min(30, Math.max(2, Math.ceil(dur + 0.6)));
  const raw = args.out.replace(/\.mp4$/, ".wan-raw.mp4");
  if (!existsSync(raw)) {
    const job = await generateVideo({
      model: "alibaba/wan-3.0",
      prompt: WAN_PROMPT(sentence, dur),
      firstFrame: args.still,
      duration: seconds,
      resolution: "1080p",
      aspectRatio: "9:16",
      generateAudio: true,
      out: raw,
    });
    console.log(`Wan clip ${job.id}, cost ${job.cost ?? "n/a"}`);
  }
  // Where does the avatar actually speak in the generated clip? Fit that span onto the original sentence.
  const w = (await words(raw, work)).list;
  if (w.length < 2) throw new Error("Wan clip has no recognisable speech");
  const from = Math.max(0, w[0].start - 0.05);
  const to = w.at(-1).end + 0.05;
  const speed = (to - from) / dur;
  const seg = path.join(work, "cam2-seg.mp4");
  const { width, height } = await probe(raw);
  const fit = width / height > 0.57 || width / height < 0.55
    ? "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920"
    : "scale=1080:1920:flags=lanczos";
  await run(ffmpegPath, ["-y", "-ss", String(from), "-i", raw, "-vf",
    `${fit},setpts=PTS/${speed.toFixed(4)},fps=${FPS},tpad=stop_mode=clone:stop_duration=1,trim=end_frame=${frames},setpts=PTS-STARTPTS,format=yuv420p,setsar=1`,
    "-an", "-c:v", "libx264", "-crf", "10", "-preset", "fast", seg]);
  console.log(`Wan speech ${from.toFixed(2)}–${to.toFixed(2)} s fitted to ${dur.toFixed(2)} s (x${speed.toFixed(3)})`);
  return seg;
}

// Local fallback for the Niklas framing: tighter, angled, slight keystone + handheld drift.
async function localClip(args, startF, endF, work) {
  const seg = path.join(work, "cam2-seg.mp4");
  const cam = "perspective=x0=0:y0=-50:x1=W:y1=25:x2=0:y2=H+50:x3=W:y3=H-25:interpolation=cubic,rotate=-2*PI/180:fillcolor=black,crop=720:1280:'128+14*t':'380-10*t',scale=1080:1920:flags=lanczos,unsharp=5:5:0.5";
  await run(ffmpegPath, ["-y", "-i", args.video, "-vf", `trim=start_frame=${startF}:end_frame=${endF},setpts=PTS-STARTPTS,${cam},format=yuv420p,setsar=1`, "-an", "-c:v", "libx264", "-crf", "10", "-preset", "fast", seg]);
  return seg;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const work = await mkdtemp(path.join(tmpdir(), "cam2-"));
  const { duration } = await probe(args.video);
  const { list, wav } = await words(args.video, work);
  const env = await envelope(wav);
  const avoid = args.avoid ? JSON.parse(await readFile(args.avoid, "utf8")) : [];

  const all = sentences(list);
  let pick;
  if (args.sentence) pick = all.find((s) => norm(s.text).includes(norm(args.sentence)) || norm(args.sentence).includes(norm(s.text)));
  else
    pick = all.slice(1).find((s) => {
      const d = s.end - s.start;
      const clash = avoid.some((w) => s.start < w.endSec && w.startSec < s.end);
      return d >= 1.6 && d <= 3.4 && s.start >= 2.5 && s.end <= duration - 8 && !clash;
    });
  if (!pick) throw new Error("No suitable sentence for the second camera");

  // Accurate pass on a short excerpt around the sentence.
  const exFrom = Math.max(0, pick.start - 1.5);
  const ex = (await words(args.video, work, exFrom, pick.end - pick.start + 3)).list;
  const target = norm(pick.text).split(" ");
  const idx = ex.findIndex((w, i) => target.slice(0, 3).every((t, j) => norm(ex[i + j]?.text ?? "") === t));
  let next;
  if (idx >= 0) {
    const last = ex.findIndex((w, i) => i > idx && norm(w.text) === target.at(-1) && /[.!?]$/.test(w.text));
    pick.start = ex[idx].start;
    if (last > idx) {
      pick.end = ex[last].end;
      next = ex[last + 1];
    }
  }
  // Cut in the quietest spot right before the first word and right after the last one.
  const start = quietest(env, pick.start - 0.15, pick.start + 0.03);
  const end = quietest(env, pick.end - 0.03, Math.min(next ? next.start : pick.end + 0.2, pick.end + 0.2));
  const startF = Math.round(start * FPS);
  const endF = Math.round(end * FPS);
  console.log(`Cam 2 on "${pick.text}" ${start.toFixed(2)}–${end.toFixed(2)} s (frames ${startF}–${endF})`);

  let mode = args.mode;
  if (mode === "auto") mode = existsSync(args.still) ? "wan" : "local";
  let seg;
  if (mode === "wan") {
    try {
      seg = await wanClip(args, pick.text, endF - startF, work);
    } catch (e) {
      if (args.mode === "wan") throw e;
      console.warn(`Wan failed (${e.message.slice(0, 200)}) — using the local second camera`);
      mode = "local";
    }
  }
  if (mode === "local") seg = await localClip(args, startF, endF, work);

  // Soft dissolve in and out, original audio untouched.
  const f = `clip((N-${startF - 1})/${DISSOLVE}\\,0\\,1)*clip((${endF}-N)/${DISSOLVE}\\,0\\,1)`;
  await run(ffmpegPath, ["-y", "-i", args.video, "-i", seg, "-filter_complex",
    `[1:v]format=yuv420p,setsar=1,tpad=start=${startF}:start_mode=clone:stop=100000:stop_mode=clone[b];[0:v]format=yuv420p,setsar=1[a];[a][b]blend=all_expr='A*(1-${f})+B*${f}':shortest=1[v]`,
    "-map", "[v]", "-map", "0:a", "-c:v", "libx264", "-crf", "10", "-preset", "fast", "-pix_fmt", "yuv420p", "-c:a", "copy", args.out]);
  await writeFile(args.windowOut, JSON.stringify([{ startSec: start, endSec: end, mode, sentence: pick.text }]));
  await rm(work, { recursive: true, force: true });
  console.log(`Cam 2 (${mode}) → ${args.out}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
