// Render a list of stills from one bundle: node scripts/stills.mjs <entry> <compId> <outDir> <frame> [frame ...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "fs";
const [entry, id, out, ...frames] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: entry });
const composition = await selectComposition({ serveUrl, id });
for (const f of frames) {
  await renderStill({ serveUrl, composition, frame: +f, output: `${out}/f${String(f).padStart(4, "0")}.png`, scale: 0.5 });
  process.stdout.write(f + " ");
}
console.log("done");
