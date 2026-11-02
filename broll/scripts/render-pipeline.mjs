#!/usr/bin/env node
// The one-command final pipeline: raw HeyGen avatar clip + a background
// music file + (optional) B-Roll windows -> a single finished, postable
// video. Wires together every step described in design.md's zoom/caption/
// B-Roll/speed-ramp/music sections and the user's 2026-09-24 spec:
//
//   1. silence-cut   — remove breathing pauses, "Ton an Ton" (scripts/silence-cut.mjs)
//   2. transcribe    — word-level captions on the TIGHTENED audio (scripts/transcribe.mjs)
//   3. compute-zooms — sentence/context-boundary zoom keyframes (scripts/compute-zooms.mjs)
//   4. remotion render FinalVideo — talking-head + real B-Roll cut-ins (no
//      card/box overlays, no logo) + karaoke captions (orange) + intro/outro
//      text hooks. NO music yet — see step 6.
//   5. speed-ramp    — flat 1.1x, applied ONLY to picture + voice-over (scripts/speed-ramp.mjs)
//   6. prepare-music — skip first 1s, trim/loop to the SPED-UP video's own
//      final length (scripts/prepare-music.mjs) — music itself is never
//      sped up, only the picture+voice-over track is
//   7. mux-music     — mixes the (untouched-speed) music bed under the
//      already-ramped video as the very last step (scripts/mux-music.mjs)
//
// Usage:
//   node scripts/render-pipeline.mjs \
//     --avatar /path/to/heygen-avatar-clip.mp4 \
//     --music /path/to/music.mp3 \
//     --hook "So ersetzt Claude\nunsere Mahnsoftware!" \
//     --trigger MAHNUNG \
//     [--end-hook "Kommentiere MAHNUNG\nfür das Guidebook!"]  (default: "Kommentiere:\n<TRIGGER>") \
//     --broll broll-windows.json \
//     [--sfx sfx.json]  ([{atSec (tightened timeline), file, volume}] — sparse, subtle hits only)
//     [--script script.txt]  (exact spoken script — captions use its spelling, Whisper only the timing) \
//     [--captions captions.json]  (skip transcription, use these word timings on the tightened timeline) \
//     --out /path/to/final.mp4
//     [--skip-silence-cut]  (--avatar is already tightened, e.g. by the Studio app)
//     [--zoom-focus 0.70,0.48]  (face point as 0-1 of the frame; push-ins zoom onto the face and drift it
//                                toward the upper centre — e.g. Niklas Office sits right of centre)
//     [--caption-style vision]  (sleek launch-video captions instead of the default karaoke style)
//     [--hook-style vision]  (intro/outro hook: bold Inter + *serif accent* instead of IG "Strong" pills)
//     [--hook-seconds 4] [--end-hook-seconds 6]
//     [--zooms zooms.json]  ([{startMs,endMs,scale,rampInMs?,rampOutMs?}] on the tightened timeline; replaces compute-zooms)
//     [--keywords keywords.json]  (vision only: ["Company Brain", "unbezahlbar", …] tinted soft orange)
//     [--preset gpt]  (@florentgpt GPT-N look, Pius 2026-10-02 — must not look like @florent_preusser:
//                      one-word Montserrat captions, white-box hook, hard jump-cut punch-ins instead of
//                      smooth push-ins, B-Roll pops in; explicit --caption-style/--hook-style still win)
//     [--lang en]  (Whisper language for the captions, default de; Felix/boilr BX-C = en)
//     [--no-zoom windows.json]  (extra [{startSec,endSec}] ranges that must not get a push-in,
//                                e.g. camera-angle segments that are already upscaled)
//
// broll-windows.json: [{ "startSec": 14.2, "endSec": 22.8, "file": "/abs/path/to/clip.mp4" }, ...]
// — omit --broll entirely for a pure talking-head cut. Omit --music entirely
// to skip music (captions/zooms/hooks/speed-ramp still fully applied).

import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { copyFile, mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import ffprobePath from "@ffprobe-installer/ffprobe";

const run = promisify(execFile);
const BROLL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(BROLL_ROOT, "public");

function parseArgs(argv) {
  const out = { hookSeconds: 5, endHookSeconds: 5, musicVolume: 0.15, speedFactor: 1.1 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--avatar") out.avatar = argv[++i];
    else if (a === "--music") out.music = argv[++i];
    else if (a === "--hook") out.hook = argv[++i];
    else if (a === "--trigger") out.trigger = argv[++i];
    else if (a === "--end-hook") out.endHook = argv[++i];
    else if (a === "--script") out.script = argv[++i];
    else if (a === "--captions") out.captions = argv[++i];
    else if (a === "--sfx") out.sfx = argv[++i];
    else if (a === "--no-captions") out.noCaptions = true;
    else if (a === "--caption-style") out.captionStyle = argv[++i];
    else if (a === "--hook-style") out.hookStyle = argv[++i];
    else if (a === "--preset") out.preset = argv[++i];
    else if (a === "--lang") out.lang = argv[++i];
    else if (a === "--zooms") out.zooms = argv[++i];
    else if (a === "--hook-seconds") out.hookSeconds = parseFloat(argv[++i]);
    else if (a === "--end-hook-seconds") out.endHookSeconds = parseFloat(argv[++i]);
    else if (a === "--keywords") out.keywords = argv[++i];
    else if (a === "--skip-silence-cut") out.skipSilenceCut = true;
    else if (a === "--no-zoom") out.noZoom = argv[++i];
    else if (a === "--zoom-focus") { const [x, y] = argv[++i].split(",").map(Number); out.zoomFocus = { x, y }; }
    else if (a === "--broll") out.brollJson = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--music-volume") out.musicVolume = parseFloat(argv[++i]);
    else if (a === "--speed-factor") out.speedFactor = parseFloat(argv[++i]);
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!out.avatar || !out.out || out.hook === undefined || !out.trigger) {
    throw new Error(
      "Usage: --avatar <file> --music <file> --hook <text> --trigger <WORD> --out <file> [--broll <windows.json>]"
    );
  }
  if (out.preset && out.preset !== "gpt") throw new Error(`Unknown preset: ${out.preset}`);
  return out;
}

// GPT-N cut: moderate punch-ins. Until 2026-10-05 these were hard jump cuts (0 ms ramps);
// Pius: "zu hart und abrupt, wirkt unedel" -> now a fast but visible eased push-in (~0.3 s)
// and a slightly longer ease back out, like the @florent_preusser push-ins, just quicker.
const GPT_PUNCH_SCALE = 1.2;
const toJumpCuts = (zooms) => zooms.map((z) => ({ ...z, scale: Math.min(z.scale, GPT_PUNCH_SCALE), rampInMs: 320, rampOutMs: 420 }));

async function probe(filePath) {
  const { stdout } = await run(ffprobePath.path, [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height,r_frame_rate",
    "-show_entries", "format=duration",
    "-of", "json", filePath,
  ]);
  const data = JSON.parse(stdout);
  const stream = data.streams[0];
  const [num, den] = stream.r_frame_rate.split("/").map(Number);
  return {
    width: stream.width,
    height: stream.height,
    fps: num / den,
    duration: parseFloat(data.format.duration),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const work = await mkdtemp(path.join(tmpdir(), "superkind-render-"));
  console.log(`Scratch dir: ${work}`);

  // 1. Silence-cut.
  const tightened = path.join(work, "tightened.mp4");
  if (args.skipSilenceCut) {
    await copyFile(args.avatar, tightened);
  } else {
    await run("node", [
      path.join(BROLL_ROOT, "scripts/silence-cut.mjs"),
      "--in", args.avatar, "--out", tightened,
    ], { stdio: "inherit", maxBuffer: 1024 * 1024 * 64 });
  }

  const meta = await probe(tightened);
  console.log(`Tightened: ${meta.width}x${meta.height} @ ${meta.fps}fps, ${meta.duration.toFixed(2)}s`);

  // 2. Transcribe (word-level, on the tightened clip — no remap needed).
  // --captions <file> reuses word timings that were already fixed on the tightened timeline
  // (e.g. raw-audio timings remapped through the silence-cut segments when Whisper drifts at the end).
  const captionsPath = path.join(work, "captions.json");
  if (args.captions) {
    await copyFile(args.captions, captionsPath);
  } else {
    await run("node", [
      path.join(BROLL_ROOT, "scripts/transcribe.mjs"),
      "--in", tightened, "--out", captionsPath,
      ...(args.script ? ["--script", args.script] : []),
      ...(args.lang ? ["--lang", args.lang] : []),
    ], { stdio: "inherit", maxBuffer: 1024 * 1024 * 64 });
  }
  const captionWords = JSON.parse(await readFile(captionsPath, "utf-8"));

  // 3. Zoom keyframes.
  const zoomsPath = path.join(work, "zooms.json");
  // compute-zooms keeps push-ins out of every window in this list.
  let noZoomPath;
  if (args.brollJson || args.noZoom) {
    const ranges = [
      ...(args.brollJson ? JSON.parse(await readFile(args.brollJson, "utf-8")) : []),
      ...(args.noZoom ? JSON.parse(await readFile(args.noZoom, "utf-8")) : []),
    ].map(({ startSec, endSec }) => ({ startSec, endSec }));
    noZoomPath = path.join(work, "no-zoom.json");
    await writeFile(noZoomPath, JSON.stringify(ranges));
  }
  if (args.zooms) await copyFile(args.zooms, zoomsPath); // hand-made zoom plan (e.g. jump cuts), skips compute-zooms
  else await run("node", [
    path.join(BROLL_ROOT, "scripts/compute-zooms.mjs"),
    "--captions", captionsPath, "--out", zoomsPath, "--trigger", args.trigger,
    ...(noZoomPath ? ["--broll", noZoomPath] : []),
  ], { stdio: "inherit", maxBuffer: 1024 * 1024 * 64 });
  let zoomKeyframes = JSON.parse(await readFile(zoomsPath, "utf-8"));
  if (args.preset === "gpt" && !args.zooms) zoomKeyframes = toJumpCuts(zoomKeyframes);

  // 4. Copy tightened avatar clip + any B-Roll windows into public/ (Remotion
  //    only serves files from there via staticFile()), convert B-Roll
  //    windows from seconds to frames. NO music in this composition — see
  //    step 6/7, music is muxed in after the speed ramp, never sped up itself.
  // Per-run file names (2026-10-04): two pipelines running at once used to overwrite each other's
  // public/render-*.mp4 and one reel ended up with the other reel's B-Roll.
  const tag = path.basename(path.dirname(path.resolve(args.out))).replace(/[^a-z0-9-]/gi, "") || "run";
  const videoFileName = `render-${tag}-tightened.mp4`;
  await copyFile(tightened, path.join(PUBLIC_DIR, videoFileName));

  let brollSegments = [];
  if (args.brollJson) {
    const windows = JSON.parse(await readFile(args.brollJson, "utf-8"));
    brollSegments = await Promise.all(
      windows.map(async (w, i) => {
        const fileName = `render-${tag}-broll-${i}.mp4`;
        await copyFile(w.file, path.join(PUBLIC_DIR, fileName));
        return {
          startFrame: Math.round(w.startSec * meta.fps),
          endFrame: Math.round(w.endSec * meta.fps),
          fileName,
        };
      })
    );
  }

  // Vision captions: B-Roll windows may carry captionZones (relative to the
  // window start, seconds) — e.g. Explainer split screens put the caption on the seam.
  let captionZones = [];
  if (args.brollJson) {
    for (const w of JSON.parse(await readFile(args.brollJson, "utf-8"))) {
      // layout "split" (DopamineHook split, 2026-10-08): no explicit zones → caption pill on the seam of the panel
      const zones = w.captionZones ?? (w.layout === "split" ? [{ y: w.panelFrac ?? 0.52, pill: true, edge: true }] : []);
      for (const z of zones) {
        captionZones.push({ startMs: (w.startSec + (z.from ?? 0)) * 1000, endMs: (w.startSec + (z.to ?? w.endSec - w.startSec)) * 1000, y: z.y, pill: z.pill ?? false, edge: z.edge ?? false });
      }
    }
  }
  const captionKeywords = args.keywords ? JSON.parse(await readFile(args.keywords, "utf-8")) : [];

  // hideCaptions (Henri 2026-10-08, DopamineHook): a window with "hideCaptions": true brings its own word typo,
  // so the pipeline captions (all styles) drop every word that starts inside it, and a word held over from
  // before is cut at the window start (GPT captions hold ~350 ms past endMs). Windows without the flag are untouched.
  let shownCaptionWords = captionWords;
  if (args.brollJson) {
    const hidden = JSON.parse(await readFile(args.brollJson, "utf-8")).filter((w) => w.hideCaptions).map((w) => [w.startSec * 1000, w.endSec * 1000]);
    if (hidden.length) {
      shownCaptionWords = captionWords
        .filter((cw) => !hidden.some(([a, b]) => cw.startMs >= a && cw.startMs < b))
        .map((cw) => {
          const cut = hidden.find(([a]) => cw.startMs < a && cw.endMs > a - 400);
          return cut ? { ...cw, endMs: Math.min(cw.endMs, cut[0] - 400) } : cw;
        });
    }
  }

  const durationInFrames = Math.round(meta.duration * meta.fps);
  const propsPath = path.join(work, "props.json");
  await writeFile(propsPath, JSON.stringify({
    videoFileName,
    zoomKeyframes,
    zoomFocus: args.zoomFocus ?? null,
    captionWords: args.noCaptions ? [] : shownCaptionWords,
    captionStyle: args.captionStyle ?? (args.preset === "gpt" ? "gpt" : "karaoke"),
    hookStyle: args.hookStyle ?? (args.preset === "gpt" ? "gpt" : "strong"),
    brollEntrance: args.preset === "gpt" ? "pop" : "cut",
    captionKeywords,
    captionZones,
    brollSegments,
    hookText: args.hook,
    hookSeconds: args.hookSeconds,
    endHookText: args.endHook ?? `Kommentiere:\n${args.trigger}`,
    endHookSeconds: args.endHookSeconds,
    fps: meta.fps,
    width: meta.width,
    durationInFrames,
  }, null, 2));

  // 5. Render the master composition (picture + voice-over only, no music).
  const rawRender = path.join(work, "final-raw.mp4");
  await run(
    "npx",
    // Near-lossless intermediate (crf 10, max-quality frame capture) — the
    // only real compression happens once, in the final speed-ramp encode.
    ["remotion", "render", "src/index.ts", "FinalVideo", rawRender, `--props=${propsPath}`, "--crf=10", "--jpeg-quality=100", "--audio-bitrate=320k", "--color-space=bt709", ...(process.env.REMOTION_CONCURRENCY ? [`--concurrency=${process.env.REMOTION_CONCURRENCY}`] : []), ...(process.env.REMOTION_TIMEOUT ? [`--timeout=${process.env.REMOTION_TIMEOUT}`] : [])],
    { cwd: BROLL_ROOT, stdio: "inherit", maxBuffer: 1024 * 1024 * 256 }
  );

  // 6. Flat speed ramp — picture + voice-over ONLY, never the music.
  const sped = path.join(work, "final-sped.mp4");
  await run("node", [
    path.join(BROLL_ROOT, "scripts/speed-ramp.mjs"),
    "--in", rawRender, "--out", sped, "--factor", String(args.speedFactor),
  ], { stdio: "inherit", maxBuffer: 1024 * 1024 * 64 });

  // SFX are timed on the tightened (pre-ramp) timeline, like captions and
  // B-Roll windows — convert to the final sped-up timeline here.
  let sfxFinal;
  if (args.sfx) {
    const cues = JSON.parse(await readFile(args.sfx, "utf-8"));
    sfxFinal = path.join(work, "sfx-final.json");
    await writeFile(sfxFinal, JSON.stringify(cues.map((c) => ({ ...c, atSec: c.atSec / args.speedFactor }))));
  }

  if (!args.music) {
    await run("node", [
      path.join(BROLL_ROOT, "scripts/mux-music.mjs"),
      "--video", sped, "--out", args.out,
      ...(sfxFinal ? ["--sfx", sfxFinal] : []),
    ], { stdio: "inherit", maxBuffer: 1024 * 1024 * 64 });
    console.log(`\nFinal video (no music): ${args.out}`);
    await rm(work, { recursive: true, force: true });
    return;
  }

  // 7. Music bed, trimmed to the SPED-UP video's own final duration —
  //    music must never be sped up itself.
  const spedMeta = await probe(sped);
  const bed = path.join(work, "music-bed.m4a");
  await run("node", [
    path.join(BROLL_ROOT, "scripts/prepare-music.mjs"),
    "--in", args.music, "--out", bed, "--duration", String(spedMeta.duration),
  ], { stdio: "inherit", maxBuffer: 1024 * 1024 * 64 });

  // 8. Mux music under the already-ramped video — the very last step.
  await run("node", [
    path.join(BROLL_ROOT, "scripts/mux-music.mjs"),
    "--video", sped, "--music", bed, "--out", args.out,
    "--music-volume", String(args.musicVolume),
    ...(sfxFinal ? ["--sfx", sfxFinal] : []),
  ], { stdio: "inherit", maxBuffer: 1024 * 1024 * 64 });

  console.log(`\nFinal video: ${args.out}`);
  await rm(work, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
