// Full-res stills with GPU-ish GL: node scripts/stills-hq.mjs <entry> <compId> <outDir> <frame> [frame ...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "fs";
const [entry, id, out, ...frames] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: entry });
const chromiumOptions = { gl: "angle" };
const composition = await selectComposition({ serveUrl, id, chromiumOptions });
for (const f of frames) {
  await renderStill({ serveUrl, composition, frame: +f, output: `${out}/f${String(f).padStart(4, "0")}.png`, scale: 1, chromiumOptions });
  process.stdout.write(f + " ");
}
console.log("done");
