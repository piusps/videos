// Rotates sound effects so no reel hammers the same sample (user feedback 2026-10-01:
// "es gibt einen SFX der immer und immer wieder kommt, der fuckt nach ner Zeit komplett ab").
// Every cue keeps its timing and role; the file is swapped for the next variant of its family so
// that the same file never plays twice in a row and no file plays more than --max times (default 3).
//
// Usage: node scripts/vary-sfx.mjs --in sfx.json [--out sfx.json] [--max 3]
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "sfx");
const H = (f) => path.join(ROOT, "heygen", f);
const V = (f) => path.join(ROOT, "heygen", "variants", f);
const FAMILIES = {
  pop: [H("ui-pop.mp3"), V("pop-low.mp3"), H("synth-pop.mp3"), V("pop-high.mp3"), V("synth-pop-low.mp3"), V("tick.mp3")],
  whoosh: [H("whoosh-quick.mp3"), V("whoosh-quick-high.mp3")],
  ping: [path.join(ROOT, "ping.mp3"), V("ping-high.mp3"), H("chime.mp3")],
  check: [path.join(ROOT, "ui-check.mp3"), H("chime-asc.mp3")],
  click: [H("click.mp3"), V("tick.mp3")],
};
const familyOf = (file) => {
  const b = path.basename(file);
  if (/whoosh/.test(b)) return "whoosh";
  if (/ui-pop|synth-pop|pop-low|pop-high/.test(b)) return "pop";
  if (/ping/.test(b)) return "ping";
  if (/ui-check|chime-asc/.test(b)) return "check";
  if (/click|tick/.test(b)) return "click";
  return null; // boom, typing, chime, riser … stay as they are
};

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith("--") ? [...a, [v.slice(2), arr[i + 1]]] : a), []));
const max = Number(args.max ?? 3);
const cues = JSON.parse(await readFile(args.in, "utf-8")).sort((a, b) => a.atSec - b.atSec);
const used = new Map();
const idx = Object.fromEntries(Object.keys(FAMILIES).map((k) => [k, 0]));
let last = null;
for (const c of cues) {
  const fam = familyOf(c.file);
  if (!fam) { last = c.file; continue; }
  const list = FAMILIES[fam];
  let pick = null;
  for (let k = 0; k < list.length; k++) {
    const cand = list[(idx[fam] + k) % list.length];
    if (cand !== last && (used.get(cand) ?? 0) < max) { pick = cand; idx[fam] = (idx[fam] + k + 1) % list.length; break; }
  }
  pick ??= list.find((f) => f !== last) ?? list[0];
  c.file = pick;
  used.set(pick, (used.get(pick) ?? 0) + 1);
  last = pick;
}
await writeFile(args.out ?? args.in, JSON.stringify(cues, null, 1));
console.log([...used].map(([f, n]) => `${path.basename(f)} ×${n}`).join(", "));
