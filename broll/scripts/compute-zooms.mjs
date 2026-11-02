#!/usr/bin/env node
// Picks the few talking-head push-ins for a video (design.md §6, rebuilt
// 2026-09-24 to match the reference edit): the shot stays wide by default,
// and only the ~3 strongest sentences get a hard, keyframed push-in (one of
// them near-face ~186%). "Strongest" = context, not the clock: numbers/cost
// claims, pivot/payoff words, the trigger-word CTA, plus a bonus for the
// hook area. Never placed inside a B-Roll window (the avatar isn't visible
// there), and spaced apart so it never reads as jittery.
//
// Usage:
//   node scripts/compute-zooms.mjs --captions <captions.json> --out <zooms.json>
//     [--trigger WORD] [--broll <windows.json>] [--count 3]

import { readFile, writeFile } from "node:fs/promises";

function parseArgs(argv) {
  const out = { count: 3 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--captions") out.captions = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--trigger") out.trigger = argv[++i];
    else if (a === "--broll") out.broll = argv[++i];
    else if (a === "--count") out.count = parseInt(argv[++i], 10);
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!out.captions || !out.out) throw new Error("Usage: --captions <file> --out <file> [--trigger WORD] [--broll <file>] [--count 3]");
  return out;
}

// Letter before the punctuation — "3." / "2026." are numbers, not sentence ends.
const SENTENCE_END = /\p{L}[.!?:]$/u;
const PIVOT = /^(trick|beste|allerbeste|verrückt|niemand|nie|sofort|live|komplett|ersetzt|kostenlos|gratis|stunden|minuten)$/i;
const MIN_GAP_MS = 3000;
const MIN_HOLD_MS = 1800;
// Held scales, strongest moment first — one near-face, the others clearly
// visible but not identical.
const SCALES = [1.86, 1.6, 1.72, 1.52];
// The opening push-in (from frame 0) stays gentle: user feedback 2026-10-03 on the
// Mahnbescheid reel, the 186% open showed only part of the face behind the hook.
// At ~130% the whole face (hair to chin) stays in frame and there is still motion.
const OPEN_SCALE = 1.3;

function groupIntoSentences(words) {
  const sentences = [];
  let current = [];
  for (const w of words) {
    current.push(w);
    if (SENTENCE_END.test(w.text)) {
      sentences.push(current);
      current = [];
    }
  }
  if (current.length > 0) sentences.push(current);
  return sentences;
}

function score(sentence, index, trigger) {
  let s = index < 3 ? 1 : 0; // hook area
  for (const w of sentence) {
    const clean = w.text.replace(/[^\p{L}\p{N}]/gu, "");
    if (/\d/.test(clean) || /^(euro|prozent|wochen|tage)$/i.test(clean)) s += 3;
    if (trigger && clean.toUpperCase() === trigger.toUpperCase()) s += 4;
    if (PIVOT.test(clean)) s += 2;
  }
  return s;
}

const overlaps = (a, b) => a.startMs < b.endMs && b.startMs < a.endMs;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const words = JSON.parse(await readFile(args.captions, "utf-8"));
  const broll = args.broll
    ? JSON.parse(await readFile(args.broll, "utf-8")).map((w) => ({ startMs: w.startSec * 1000, endMs: w.endSec * 1000 }))
    : [];

  const lastWordEnd = words[words.length - 1].endMs;
  const candidates = groupIntoSentences(words)
    .map((s, i) => ({
      startMs: s[0].startMs,
      endMs: Math.max(s[s.length - 1].endMs, s[0].startMs + MIN_HOLD_MS),
      score: score(s, i, args.trigger),
    }))
    // A push-in running into a B-Roll cut gets shortened to end at the cut;
    // only drop it if too little is left, or it starts inside B-Roll.
    .map((c) => {
      const next = broll.find((b) => b.startMs >= c.startMs && b.startMs < c.endMs);
      return next ? { ...c, endMs: next.startMs } : c;
    })
    .filter((c) => c.endMs - c.startMs >= 1200 && !broll.some((b) => overlaps(c, b)))
    .filter((c) => c.startMs < lastWordEnd - 500)
    .map((c) => ({ ...c, endMs: Math.min(c.endMs, lastWordEnd + 300) }))
    .sort((a, b) => b.score - a.score || a.startMs - b.startMs);

  const picked = [];
  for (const c of candidates) {
    if (picked.length >= args.count) break;
    const tooClose = picked.some(
      (p) => c.startMs < p.endMs + MIN_GAP_MS && p.startMs < c.endMs + MIN_GAP_MS
    );
    if (!tooClose) picked.push(c);
  }

  // Motion from frame 0: the first ~2s decide ~50% of viewers (reel
  // analytics 2026-09-25). If a picked push-in starts in the first 4s, it's
  // stretched back to frame 0; otherwise the opening sentence replaces the
  // weakest pick.
  const early = picked.filter((p) => p.startMs < 4000).sort((x, y) => x.startMs - y.startMs)[0];
  if (early) {
    early.startMs = 0;
  } else {
    const first = candidates.find((c) => c.startMs < 1500);
    if (first) {
      if (picked.length >= args.count) picked.pop();
      picked.unshift({ ...first, startMs: 0 });
    }
  }

  let n = 0;
  const keyframes = picked
    .map((p) => ({ startMs: p.startMs, endMs: p.endMs, scale: p.startMs === 0 ? OPEN_SCALE : SCALES[n++ % SCALES.length] }))
    .sort((a, b) => a.startMs - b.startMs);

  await writeFile(args.out, JSON.stringify(keyframes, null, 2));
  console.log(`Wrote ${keyframes.length} push-in(s) to ${args.out}:`);
  for (const k of keyframes) console.log(`  ${(k.startMs / 1000).toFixed(2)}s-${(k.endMs / 1000).toFixed(2)}s @ ${Math.round(k.scale * 100)}%`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
