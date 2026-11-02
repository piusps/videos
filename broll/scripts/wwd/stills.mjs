// node scripts/wwd/stills.mjs <CompId> <outDir> <sec,sec,...>  → stills + contact sheet
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill, openBrowser } from "@remotion/renderer";
import fs from "fs"; import path from "path"; import { execFileSync } from "child_process";
const [id, out, secs] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index-wwd.tsx"), publicDir: path.resolve("public-wwd") });
const browser = await openBrowser("chrome", { chromiumOptions: { gl: "angle" } });
const comp = await selectComposition({ serveUrl, id, puppeteerInstance: browser, chromiumOptions: { gl: "angle" } });
const files = [];
for (const s of secs.split(",").map(Number)) {
  const f = path.join(out, `s_${String(s).padStart(5, "0")}.jpg`);
  await renderStill({ composition: comp, serveUrl, output: f, frame: Math.round(s * 30), imageFormat: "jpeg", jpegQuality: 85, puppeteerInstance: browser, chromiumOptions: { gl: "angle" }, timeoutInMilliseconds: 120000 });
  files.push(f); console.log("still", s);
}
await browser.close({ silent: true });
const FF = path.resolve("node_modules/ffmpeg-static/ffmpeg");
const cols = 6, args = [];
files.forEach((f) => args.push("-i", f));
const rows = Math.ceil(files.length / cols);
let fc = files.map((_, i) => `[${i}]scale=360:640[v${i}]`).join(";") + ";";
const pad = rows * cols - files.length;
for (let i = 0; i < pad; i++) fc += `color=black:s=360x640:d=1[p${i}];`;
const all = [...files.map((_, i) => `[v${i}]`), ...Array.from({ length: pad }, (_, i) => `[p${i}]`)];
fc += all.join("") + `xstack=inputs=${all.length}:layout=` + all.map((_, i) => `${(i % cols) * 360}_${Math.floor(i / cols) * 640}`).join("|") + "[o]";
execFileSync(FF, ["-loglevel", "error", "-y", ...args, "-filter_complex", fc, "-map", "[o]", "-frames:v", "1", path.join(out, "sheet.jpg")]);
console.log(path.join(out, "sheet.jpg"));
