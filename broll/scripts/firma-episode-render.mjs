#!/usr/bin/env node
// Firma series engine — render one episode end to end.
// usage: node scripts/firma-episode-render.mjs public/firma-ep/tag<N> [--stills] [--frames=120,300] [--no-desktop] [--concurrency=4]
//   1. slim public dir (only what the engine needs) + one fresh bundle in /tmp (old firma bundles are removed first)
//   2. style frames: one per shot/act (+ --frames), montage = Kontaktbogen der Style-Frames      → stop here with --stills
//   3. full render (muted) → 2 fps contact sheet → firma-mix.mjs (voice + music + SFX, -14 LUFS) → mux → handy version
//   4. copy to ~/Desktop/Superkind Videos/<Datum> Superkind baut Firma Tag <N>/Versionen/, delete the bundle, print timings
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill, renderMedia, openBrowser } from "@remotion/renderer";
import { mixEpisode, loadTimeline } from "./firma-mix.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FF = path.join(ROOT, "node_modules/ffmpeg-static/ffmpeg");
const args = process.argv.slice(2);
const tagDirArg = args.find((a) => !a.startsWith("--"));
if (!tagDirArg) { console.error("usage: node scripts/firma-episode-render.mjs public/firma-ep/tag<N> [--stills] [--frames=..]"); process.exit(1); }
const flag = (k) => args.includes(`--${k}`);
const opt = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.split("=")[1] : d; };
const tagDir = path.resolve(ROOT, tagDirArg);
const tagName = path.basename(tagDir);
const ep = JSON.parse(fs.readFileSync(path.join(tagDir, "episode.json"), "utf8"));
const words = JSON.parse(fs.readFileSync(path.join(tagDir, ep.audio?.words ?? "words.json"), "utf8"));
const work = path.join(ROOT, "runs/firma-ep", tagName);
const outDir = path.join(work, "render"), sfDir = path.join(work, "style-frames");
fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync(sfDir, { recursive: true });
const T0 = Date.now(), lap = {};
const mark = (k, t0) => { lap[k] = Math.round((Date.now() - t0) / 1000); console.log(`[${k}] ${lap[k]} s`); };
const ff = (a) => execFileSync(FF, ["-y", "-loglevel", "error", ...a]);

// ---------- 1. slim public + bundle ----------
let t0 = Date.now();
const pub = `/tmp/firma-ep-public-${process.pid}`; // per process: parallel renders of other episodes keep their own public dir
fs.rmSync(pub, { recursive: true, force: true });
for (const f of ["logos/claude.svg", "firma-neu-tag1/v3/paper-crumple.png"]) { fs.mkdirSync(path.dirname(path.join(pub, f)), { recursive: true }); fs.copyFileSync(path.join(ROOT, "public", f), path.join(pub, f)); }
execFileSync("rsync", ["-a", "--exclude=*.mp3", "--exclude=*.wav", "--exclude=*.mp4", path.join(ROOT, "public/firma-ep") + "/", path.join(pub, "firma-ep") + "/"]);
// remove stale bundles/public dirs only (their render process is gone); bundles of parallel renders stay untouched
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
for (const d of fs.readdirSync("/tmp")) {
  const mm = d.match(/^firma-ep-(?:bundle|public)-(\d+)$/);
  if (mm ? !alive(+mm[1]) : d === "firma-ep-public") fs.rmSync(path.join("/tmp", d), { recursive: true, force: true });
}
const bundleDir = `/tmp/firma-ep-bundle-${process.pid}`;
const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/index-firma-episode.tsx"), outDir: bundleDir, publicDir: pub, enableCaching: true });
mark("bundle", t0);

const inputProps = { tag: ep.tag, episode: ep, words, cover: false };
// Linux-Cloud: kein GPU -> swangle; Chrome über cloud/chrome-proxy.sh (Proxy statt Direktverbindung)
const LINUX = process.platform === "linux";
const GL = process.env.REMOTION_GL || (LINUX ? "swangle" : "angle");
const CLOUD_CHROME = path.join(ROOT, "../cloud/chrome-proxy.sh");
const BROWSER_EXE = process.env.REMOTION_BROWSER || (LINUX && fs.existsSync(CLOUD_CHROME) ? CLOUD_CHROME : null);
const browser = await openBrowser("chrome", { browserExecutable: BROWSER_EXE, chromiumOptions: { gl: GL } });
const comp = await selectComposition({ serveUrl, id: "FirmaEpisode", inputProps, puppeteerInstance: browser, chromiumOptions: { gl: GL }, timeoutInMilliseconds: 120000 });
const fps = comp.fps;
// optional --range=a-b: render only frames a..b (muted) to render/video-range-a-b.mp4 and stop (patching a part under load)
if (opt("range")) {
  const [ra, rb] = opt("range").split("-").map((v) => parseInt(v, 10));
  const outR = path.join(outDir, `video-range-${ra}-${rb}.mp4`);
  await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: outR, inputProps, puppeteerInstance: browser, chromiumOptions: { gl: GL }, concurrency: parseInt(opt("concurrency", "2"), 10), muted: true, crf: 16, timeoutInMilliseconds: 120000, frameRange: [ra, rb] });
  await browser.close({ silent: true });
  console.log(JSON.stringify({ range: outR }));
  process.exit(0);
}

// ---------- 2. style frames ----------
t0 = Date.now();
const m = await loadTimeline();
const tl = m.buildTimeline(ep, words);
for (const w of tl.warnings ?? []) console.warn(`WARN ${w}`);
const pick = (s) => {
  const r = s.act !== undefined ? tl.A[s.act] : undefined;
  let t = s.a + Math.min(1.2, (s.b - s.a) * 0.6);
  if (s.kind === "h1") t = Math.min(s.b - 0.05, tl.HK.stamp + 0.25);
  if (s.kind === "h4") t = Math.min(s.b - 0.05, tl.HK.q + 0.3);
  if (s.kind === "claude") t = tl.C.send - 0.3;
  if (r) {
    if (s.kind === "wall") t = (r.thinkUntil ?? s.a + 1) + 0.6;
    if (s.kind === "chain") t = r.back ? r.back.arrive + 0.3 : s.b - 0.3;
    if (s.kind === "winner") t = r.stampAt + 0.5;
    if (s.kind === "question") t = r.stampAt + 0.4;
    if (s.kind === "table" || s.kind === "mock") t = (r.stamp ? r.stampAt : s.a + 1.5) + 0.4;
    if (s.kind === "hub") t = r.next + 0.35;
    if (s.kind === "end") t = r.result ? Math.max(...r.result.parts.map((p) => p.at)) + 0.3 : s.b - 0.4;
  }
  return Math.round(Math.max(s.a + 0.1, Math.min(s.b - 0.1, t)) * fps);
};
const frames = tl.shots.map((s) => ({ f: pick(s), name: s.kind + (s.act !== undefined ? `-a${s.act}` : "") }));
for (const f of opt("frames", "").split(",").filter(Boolean)) frames.push({ f: parseInt(f, 10), name: `f${f}` });
const files = [];
for (const fr of frames) {
  const out = path.join(sfDir, `sf-${String(fr.f).padStart(4, "0")}-${fr.name}.png`);
  await renderStill({ composition: comp, serveUrl, output: out, frame: fr.f, inputProps, puppeteerInstance: browser, chromiumOptions: { gl: GL }, overwrite: true, timeoutInMilliseconds: 120000 });
  files.push(out);
}
// Kontaktbogen der Style-Frames: 6 per row, 360 px wide each, frame number + shot name burnt in
const rows = Math.ceil(files.length / 6);
// Labels nur, wenn ffmpeg drawtext kann (Linux-ffmpeg-static hat es nicht) und eine Schrift da ist
const LABEL_FONT = ["/System/Library/Fonts/Helvetica.ttc", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"].find((f) => fs.existsSync(f));
const HAS_DT = !!LABEL_FONT && execFileSync(FF, ["-hide_banner", "-filters"]).toString().includes(" drawtext ");
const dt = (text, x, size) => HAS_DT ? `,drawtext=fontfile=${LABEL_FONT}:text='${text}':x=${x}:y=${x}:fontsize=${size}:fontcolor=white:box=1:boxcolor=black@0.6` : "";
const inArgs = files.flatMap((f) => ["-i", f]);
const lab = files.map((f, i) => `[${i}:v]scale=360:-1${dt(path.basename(f, ".png").replace(/^sf-/, ""), 8, 22)}[s${i}]`);
const pad = Array.from({ length: rows * 6 - files.length }, (_, k) => `color=c=black:s=360x640:d=1[p${k}]`);
const all = [...files.map((_, i) => `[s${i}]`), ...pad.map((_, k) => `[p${k}]`)];
const sheet = path.join(work, "style-frames.jpg");
ff([...inArgs, "-filter_complex", [...lab, ...pad, `${all.join("")}xstack=inputs=${all.length}:layout=${all.map((_, i) => `${(i % 6) * 360}_${Math.floor(i / 6) * 640}`).join("|")}[o]`].join(";"), "-map", "[o]", "-frames:v", "1", "-q:v", "3", sheet]);
mark("style-frames", t0);
console.log(`style frames: ${sfDir}\nsheet: ${sheet}`);

const cleanup = async () => { await browser.close({ silent: true }).catch(() => {}); fs.rmSync(bundleDir, { recursive: true, force: true }); fs.rmSync(pub, { recursive: true, force: true }); };
if (flag("stills")) { await cleanup(); console.log(JSON.stringify({ lap, total: Math.round((Date.now() - T0) / 1000) })); process.exit(0); }

// ---------- 3. full render → contact sheet → mix → mux → handy ----------
t0 = Date.now();
const video = path.join(outDir, "video.mp4");
let lastP = -1;
await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: video, inputProps, puppeteerInstance: browser, chromiumOptions: { gl: GL }, concurrency: parseInt(opt("concurrency", "4"), 10), muted: true, crf: 16, timeoutInMilliseconds: 120000,
  onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== lastP) { lastP = p; console.log(`render ${p * 10}%`); } } });
mark("render", t0);
await cleanup();
t0 = Date.now();
const contact = path.join(work, "contact-2fps.jpg");
ff(["-i", video, "-vf", `fps=2,scale=270:-1${dt("%{pts\\:hms}", 6, 20)},tile=10x9`, "-frames:v", "1", "-q:v", "4", contact]);
const mix = await mixEpisode(tagDir);
const day = ep.serientag ?? ep.tag, folge = ep.folge ?? ep.tag;
const base = `tag${day}${folge !== day ? `-folge${folge}` : ""}`;
const final = path.join(outDir, `${base}.mp4`), handy = path.join(outDir, `${base}-handy.mp4`);
ff(["-i", video, "-i", mix.out, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-shortest", "-movflags", "+faststart", final]);
ff(["-i", final, "-c:v", "libx264", "-crf", "23", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", handy]);
mark("mix+mux", t0);

// ---------- 4. Desktop delivery ----------
if (!flag("no-desktop")) {
  const date = ep.date ?? new Date().toISOString().slice(0, 10);
  const folder = path.join(os.homedir(), "Desktop/Superkind Videos", `${date} Superkind baut Firma Tag ${day}${folge !== day ? ` Folge ${folge}` : ""}`, "Versionen");
  fs.mkdirSync(folder, { recursive: true });
  // never overwrite an earlier delivery: tag<N>-engine.mp4, then -engine-2, -engine-3 …
  let v = "-engine";
  for (let k = 2; fs.existsSync(path.join(folder, `${base}${v}.mp4`)); k++) v = `-engine-${k}`;
  fs.copyFileSync(final, path.join(folder, `${base}${v}.mp4`));
  fs.copyFileSync(handy, path.join(folder, `${base}${v}-handy.mp4`));
  fs.copyFileSync(contact, path.join(folder, `${base}${v}-kontaktbogen.jpg`));
  console.log(`desktop: ${folder}`);
}
console.log(JSON.stringify({ final, handy, contact, sheet, musicStart: mix.musicStart, lap, total: Math.round((Date.now() - T0) / 1000) }, null, 1));
