// node scripts/wwd/render.mjs <CompId> <out.mp4>  → full render + loudnorm (-14 LUFS)
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia, openBrowser } from "@remotion/renderer";
import path from "path"; import { execFileSync } from "child_process";
const [id, out] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index-wwd.tsx"), publicDir: path.resolve("public-wwd") });
const browser = await openBrowser("chrome", { chromiumOptions: { gl: "angle" } });
const comp = await selectComposition({ serveUrl, id, puppeteerInstance: browser, chromiumOptions: { gl: "angle" } });
const raw = out.replace(/\.mp4$/, "-raw.mp4");
let last = -1;
await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation: raw, puppeteerInstance: browser, chromiumOptions: { gl: "angle" }, concurrency: 4, crf: 16, timeoutInMilliseconds: 180000,
  onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; console.log(`render ${p * 10}%`); } } });
await browser.close({ silent: true });
const FF = path.resolve("node_modules/ffmpeg-static/ffmpeg");
execFileSync(FF, ["-loglevel", "error", "-y", "-i", raw, "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p", "-af", "loudnorm=I=-14:TP=-1:LRA=11", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out]);
console.log("done", out);
