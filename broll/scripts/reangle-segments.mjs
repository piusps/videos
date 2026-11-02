#!/usr/bin/env node
// Camera-angle switches on real talking-head footage. Each segment of the clip is
// re-filmed from ONE new camera angle by a video-editing model on OpenRouter
// (default runway/aleph-2). Never HeyGen, and not Seedance: BytePlus rejects any
// input video that shows a real person. Every segment goes in as its own short
// clip, so the model keeps its timing. The results are cut back in frame-accurately,
// brought to the source's size/fps and laid under the ORIGINAL audio.
//
// Usage:
//   node scripts/reangle-segments.mjs --video src.mp4 --config segments.json --out final.mp4 \
//     [--upload-tmpfiles] [--model runway/aleph-2] [--reuse-raw]
//
// --reuse-raw: segments whose <out>.segN.raw.mp4 already exists are not generated
// again (no cost); only the cut-in and the grade check run.
// --only 3[,1]: generate just these segments (e.g. one test before paying for all);
// the final cut is only assembled once every segment has a raw result.
//
// Runway rejects clips under 2 s, so shorter segments are sent with extra frames
// after (or before) them and the result is trimmed back to the segment. Runway
// bills at least 5 s per job (~$1.40 on aleph-2), whatever the clip length.
//
// segments.json: { "segments": [ { "from": 2.56, "to": 4.44, "prompt": "…" }, … ] }
// Prompts are capped at 1000 characters (Runway's limit).
//
// OpenRouter only accepts video inputs as public HTTPS URLs (no data URLs).
// --upload-tmpfiles uploads each segment clip to tmpfiles.org (auto-deleted after
// 60 min) right before its job is submitted, because its download links expire
// after ~5 min. Only pass it when the user has agreed to that host for this footage.
//
// Leading remnant frames in the source (e.g. a B-Roll frame left over from cutting
// the clip out of a longer edit) are replaced with the first real frame.

import path from "node:path";
import { spawn } from "node:child_process";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import ffmpegPath from "ffmpeg-static";
import { generateVideo, resolveVideoModel } from "./lib/openrouter.mjs";

const PROMPT_LIMIT = 1000;
const MIN_INPUT_SECONDS = 2.2; // Runway minimum is 2 s; margin for container rounding

function parseArgs(argv) {
  const out = { model: "runway/aleph-2", upload: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--video") out.video = argv[++i];
    else if (a === "--config") out.config = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--model") out.model = argv[++i];
    else if (a === "--upload-tmpfiles") out.upload = true;
    else if (a === "--reuse-raw") out.reuse = true;
    else if (a === "--only") out.only = argv[++i].split(",").map(Number);
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!out.video || !out.config || !out.out)
    throw new Error("Usage: --video <src.mp4> --config <segments.json> --out <final.mp4> [--upload-tmpfiles] [--model id]");
  return out;
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    let err = "";
    const p = spawn(cmd, args);
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => (code === 0 ? resolve(err) : reject(new Error(`${cmd} exited ${code}\n${err.slice(-2000)}`))));
  });
}

async function probe(file) {
  const info = await run(ffmpegPath, ["-hide_banner", "-i", file]).catch((e) => e.message);
  const v = info.match(/Video: .*?, (\d+)x(\d+).*?, ([\d.]+) fps/);
  const d = info.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return { width: +v[1], height: +v[2], fps: +v[3], duration: +d[1] * 3600 + +d[2] * 60 + +d[3] };
}

// Frames before a hard scene change within the first 0.5s are leftovers from cutting.
async function leadingRemnantFrames(file, fps) {
  const log = await run(ffmpegPath, ["-hide_banner", "-t", "0.5", "-i", file, "-vf", "select='gt(scene,0.3)',showinfo", "-f", "null", "-"]);
  const t = log.match(/pts_time:([\d.]+)/);
  return t ? Math.round(parseFloat(t[1]) * fps) : 0;
}

async function uploadTmpfiles(file) {
  const form = new FormData();
  form.append("file", new Blob([await readFile(file)], { type: "video/mp4" }), path.basename(file));
  const page = (await (await fetch("https://tmpfiles.org/api/v1/upload", { method: "POST", body: form })).json())?.data?.url;
  if (!page) throw new Error(`tmpfiles upload failed for ${file}`);
  const dl = (await (await fetch(page)).text()).match(/https:\/\/tmpfiles\.org\/dl\/[^"]+/)?.[0];
  if (!dl) throw new Error(`No download link on ${page}`);
  return dl;
}

// Average brightness / saturation / chroma over a clip, to compare a re-angled segment with the original.
async function colorStats(file, vf = "null") {
  const log = await run(ffmpegPath, ["-hide_banner", "-i", file, "-vf", `${vf},signalstats,metadata=mode=print`, "-an", "-f", "null", "-"]);
  const avg = (key) => {
    const v = [...log.matchAll(new RegExp(`lavfi\\.signalstats\\.${key}=([\\d.]+)`, "g"))].map((m) => +m[1]);
    return v.reduce((a, b) => a + b, 0) / v.length;
  };
  return { Y: avg("YAVG"), SAT: avg("SATAVG"), U: avg("UAVG"), V: avg("VAVG") };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { segments } = JSON.parse(await readFile(args.config, "utf8"));
  const src = await probe(args.video);
  const dir = path.dirname(path.resolve(args.out));
  const base = path.basename(args.out, path.extname(args.out));
  await mkdir(dir, { recursive: true });

  const segs = segments
    .map((s, i) => ({ ...s, i, start: Math.round(s.from * src.fps), end: Math.round(s.to * src.fps) }))
    .sort((a, b) => a.start - b.start);
  for (const s of segs) {
    if (s.prompt.length > PROMPT_LIMIT) throw new Error(`Segment ${s.i + 1} prompt is ${s.prompt.length} chars (max ${PROMPT_LIMIT})`);
    if (s.end <= s.start) throw new Error(`Segment ${s.i + 1} is empty`);
  }
  const total = Math.round(src.duration * src.fps);
  const minFrames = Math.ceil(MIN_INPUT_SECONDS * src.fps);
  for (const s of segs) {
    // Clip actually sent to the model: at least minFrames long, extended after the segment first.
    s.sendEnd = Math.min(total, Math.max(s.end, s.start + minFrames));
    s.sendStart = Math.max(0, Math.min(s.start, s.sendEnd - minFrames));
    s.offset = s.start - s.sendStart;
  }
  const rawPath = (s) => path.join(dir, `${base}.seg${s.i + 1}.raw.mp4`);
  const wanted = (s) => !args.only || args.only.includes(s.i + 1);
  const todo = segs.filter((s) => wanted(s) && !(args.reuse && existsSync(rawPath(s))));
  if (todo.length && !args.upload) throw new Error("OpenRouter needs public HTTPS video URLs; pass --upload-tmpfiles (with the user's OK) to host the segment clips");

  const model = todo.length ? await resolveVideoModel(args.model) : { id: args.model };
  console.log(`${model.id}: ${todo.length} of ${segs.length} segment(s) to generate, source ${src.width}x${src.height}@${src.fps}`);

  // Cut → upload → submit each segment right away (in parallel); keep whatever finishes.
  const results = await Promise.allSettled(
    segs.map(async (s) => {
      const raw = rawPath(s);
      if (!todo.includes(s)) return existsSync(raw) ? { ...s, raw, cost: 0, info: await probe(raw) } : null;
      try {
        const clip = path.join(dir, `${base}.seg${s.i + 1}.in.mp4`);
        await run(ffmpegPath, ["-y", "-i", args.video, "-vf", `trim=start_frame=${s.sendStart}:end_frame=${s.sendEnd},setpts=PTS-STARTPTS`,
          "-an", "-c:v", "libx264", "-crf", "12", "-preset", "slow", "-pix_fmt", "yuv420p", clip]);
        const url = await uploadTmpfiles(clip);
        const job = await generateVideo({ model: model.id, prompt: s.prompt, references: [{ kind: "video", url }], resolution: null, out: raw });
        console.log(`Segment ${s.i + 1} done (job ${job.id}, cost ${job.cost ?? "n/a"})`);
        return { ...s, raw, cost: job.cost ?? 0, info: await probe(raw) };
      } catch (e) {
        console.error(`Segment ${s.i + 1} failed: ${e.message}`);
        throw e;
      }
    }),
  );
  const done = results.filter((r) => r.status === "fulfilled" && r.value).map((r) => r.value);
  console.log(`Cost this run: $${done.reduce((a, s) => a + s.cost, 0).toFixed(2)}`);
  if (results.some((r) => r.status === "rejected")) process.exit(1);
  if (done.length < segs.length) {
    console.log(`Raw results for ${done.map((s) => s.i + 1).join(", ")} only — final cut skipped until every segment has one.`);
    await gradeCheck(args.video, done);
    return;
  }

  // Timeline: original pieces between segments, re-angled segments fitted to source size/fps.
  const fit = `scale=${src.width}:${src.height}:force_original_aspect_ratio=increase:flags=lanczos,crop=${src.width}:${src.height},fps=${src.fps},setsar=1`;
  const lead = await leadingRemnantFrames(args.video, src.fps);
  const inputs = ["-i", args.video];
  const filters = [];
  const pieces = [];
  const origPiece = (a, b) => {
    const label = `o${pieces.length}`;
    const clean = a === 0 && lead ? `,trim=start_frame=${lead},setpts=PTS-STARTPTS,tpad=start=${lead}:start_mode=clone` : "";
    filters.push(`[0:v]trim=start_frame=${a}:end_frame=${b},setpts=PTS-STARTPTS${clean},setsar=1[${label}]`);
    pieces.push(`[${label}]`);
  };
  let cursor = 0;
  for (const [n, s] of done.entries()) {
    if (s.start > cursor) origPiece(cursor, s.start);
    const frames = s.end - s.start;
    const sent = (s.sendEnd - s.sendStart) / src.fps;
    if (Math.abs(s.info.duration - sent) > 1.5 / src.fps) console.warn(`Segment ${s.i + 1}: model returned ${s.info.duration.toFixed(2)}s for ${sent.toFixed(2)}s input — timing may be off`);
    const sharpen = s.info.width < src.width ? ",unsharp=5:5:0.4" : "";
    inputs.push("-i", s.raw);
    filters.push(`[${n + 1}:v]${fit}${sharpen},tpad=stop_mode=clone:stop_duration=1,trim=start_frame=${s.offset}:end_frame=${s.offset + frames},setpts=PTS-STARTPTS[s${n}]`);
    pieces.push(`[s${n}]`);
    cursor = s.end;
  }
  if (cursor < total) origPiece(cursor, total);
  filters.push(`${pieces.join("")}concat=n=${pieces.length}:v=1:a=0[v]`);

  await run(ffmpegPath, ["-y", ...inputs, "-filter_complex", filters.join(";"), "-map", "[v]", "-map", "0:a",
    "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", "-t", String(src.duration), "-movflags", "+faststart", args.out]);
  console.log(`Final → ${args.out}`);

  await gradeCheck(args.video, done);
}

// Grade check: each re-angled segment vs the same range of the original.
async function gradeCheck(video, done) {
  for (const s of done) {
    const o = await colorStats(video, `trim=start_frame=${s.sendStart}:end_frame=${s.sendEnd}`);
    const g = await colorStats(s.raw);
    const f = (x) => x.toFixed(1);
    console.log(`Segment ${s.i + 1} (${s.info.width}x${s.info.height}@${s.info.fps}, ${s.info.duration.toFixed(2)}s): ` +
      `brightness ${f(o.Y)} → ${f(g.Y)}, saturation ${f(o.SAT)} → ${f(g.SAT)}, U ${f(o.U)} → ${f(g.U)}, V ${f(o.V)} → ${f(g.V)}`);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
