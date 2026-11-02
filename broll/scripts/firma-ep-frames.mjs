#!/usr/bin/env node
// Firma series engine — quick stills for patch work (additive helper, 2026-10-29).
// usage: node scripts/firma-ep-frames.mjs public/firma-ep/tag<N> <outDir> 0,12,30,... [--scale=0.5]
// One bundle, one browser, renders the listed frames as PNG (f-0000.png …). Does not touch render/ or style-frames/.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill, openBrowser } from "@remotion/renderer";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [tagDirArg, outArg, list] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const scale = parseFloat((process.argv.find((a) => a.startsWith("--scale=")) ?? "--scale=1").split("=")[1]);
const tagDir = path.resolve(ROOT, tagDirArg), out = path.resolve(outArg);
fs.mkdirSync(out, { recursive: true });
const ep = JSON.parse(fs.readFileSync(path.join(tagDir, "episode.json"), "utf8"));
const words = JSON.parse(fs.readFileSync(path.join(tagDir, ep.audio?.words ?? "words.json"), "utf8"));
const pub = `/tmp/firma-ep-public-${process.pid}`;
fs.rmSync(pub, { recursive: true, force: true });
for (const f of ["logos/claude.svg", "firma-neu-tag1/v3/paper-crumple.png"]) { fs.mkdirSync(path.dirname(path.join(pub, f)), { recursive: true }); fs.copyFileSync(path.join(ROOT, "public", f), path.join(pub, f)); }
execFileSync("rsync", ["-a", "--exclude=*.mp3", "--exclude=*.wav", "--exclude=*.mp4", path.join(ROOT, "public/firma-ep") + "/", path.join(pub, "firma-ep") + "/"]);
const bundleDir = `/tmp/firma-ep-bundle-${process.pid}`;
const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/index-firma-episode.tsx"), outDir: bundleDir, publicDir: pub, enableCaching: true });
const inputProps = { tag: ep.tag, episode: ep, words, cover: process.argv.includes("--cover") };
const browser = await openBrowser("chrome", { browserExecutable: process.env.REMOTION_BROWSER || (process.platform === "linux" && fs.existsSync(new URL("../../cloud/chrome-proxy.sh", import.meta.url)) ? new URL("../../cloud/chrome-proxy.sh", import.meta.url).pathname : null), chromiumOptions: { gl: process.env.REMOTION_GL || (process.platform === "linux" ? "swangle" : "angle") } });
const comp = await selectComposition({ serveUrl, id: "FirmaEpisode", inputProps, puppeteerInstance: browser, chromiumOptions: { gl: "angle" }, timeoutInMilliseconds: 120000 });
const t0 = Date.now();
for (const f of list.split(",").map((x) => parseInt(x, 10))) {
  await renderStill({ composition: comp, serveUrl, output: path.join(out, `f-${String(f).padStart(4, "0")}.png`), frame: f, inputProps, puppeteerInstance: browser, chromiumOptions: { gl: "angle" }, overwrite: true, scale, timeoutInMilliseconds: 120000 });
}
await browser.close({ silent: true });
fs.rmSync(bundleDir, { recursive: true, force: true }); fs.rmSync(pub, { recursive: true, force: true });
console.log(`frames done in ${Math.round((Date.now() - t0) / 1000)} s → ${out}`);
