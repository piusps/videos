#!/usr/bin/env node
// Word-level transcription of the ALREADY silence-cut talking-head clip
// (run scripts/silence-cut.mjs first) — deliberately transcribing the
// tightened audio rather than remapping HeyGen's original SRT timestamps,
// so caption timing is automatically correct against the final timeline
// with zero remap math.
//
// Usage: node scripts/transcribe.mjs --in <tightened.mp4> --out <captions.json> [--lang de]
//
// Requires scripts/setup-whisper.mjs to have been run once beforehand.

import path from "node:path";
import { writeFile, readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";
import { transcribe, toCaptions } from "@remotion/install-whisper-cpp";
// Keep in sync with scripts/setup-whisper.mjs.
const WHISPER_VERSION = "1.7.4";
const WHISPER_MODEL = "medium";

const WHISPER_DIR = path.join(process.cwd(), "whisper.cpp");

function parseArgs(argv) {
  const out = { lang: "de" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--in") out.in = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--lang") out.lang = argv[++i];
    else if (a === "--script") out.script = argv[++i];
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!out.in || !out.out) throw new Error("Usage: --in <file> --out <file> [--lang de]");
  return out;
}

const norm = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

// Needleman-Wunsch-style alignment on normalized words; each script word
// takes the timing of the whisper word(s) it lines up with. Unmatched script
// words get the timing of their nearest neighbour.
function alignToScript(heard, script) {
  const n = heard.length, m = script.length;
  const sim = (a, b) => {
    const x = norm(a), y = norm(b);
    if (!x || !y) return x === y ? 1 : -1;
    if (x === y) return 2;
    if (x.startsWith(y) || y.startsWith(x)) return 1;
    return -1;
  };
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) dp[i][0] = -i;
  for (let j = 1; j <= m; j++) dp[0][j] = -j;
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      dp[i][j] = Math.max(dp[i - 1][j - 1] + sim(heard[i - 1].text, script[j - 1]), dp[i - 1][j] - 1, dp[i][j - 1] - 1);
  const timing = new Array(m).fill(null);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    if (dp[i][j] === dp[i - 1][j - 1] + sim(heard[i - 1].text, script[j - 1])) {
      timing[j - 1] = { startMs: heard[i - 1].startMs, endMs: heard[i - 1].endMs };
      i--; j--;
    } else if (dp[i][j] === dp[i - 1][j] - 1) {
      // extra heard word (e.g. "8.000" split): extend the next script word's start
      if (timing[j - 1]) timing[j - 1].startMs = heard[i - 1].startMs;
      i--;
    } else {
      j--;
    }
  }
  for (let k = 0; k < m; k++) {
    if (!timing[k]) {
      const prev = timing.slice(0, k).reverse().find(Boolean);
      const next = timing.slice(k + 1).find(Boolean);
      const startMs = prev ? prev.endMs : next ? next.startMs : 0;
      const endMs = next ? next.startMs : startMs + 200;
      timing[k] = { startMs, endMs: Math.max(endMs, startMs + 80) };
    }
  }
  return script.map((text, k) => ({ text, ...timing[k] }));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  // whisper.cpp only accepts 16 kHz WAV.
  const tmp = await mkdtemp(path.join(tmpdir(), "whisper-"));
  const wav = path.join(tmp, "audio.wav");
  await promisify(execFile)(ffmpegPath, ["-y", "-i", args.in, "-ar", "16000", "-ac", "1", wav]);

  const whisperCppOutput = await transcribe({
    inputPath: wav,
    model: WHISPER_MODEL,
    modelFolder: WHISPER_DIR,
    whisperPath: WHISPER_DIR,
    whisperCppVersion: WHISPER_VERSION,
    tokenLevelTimestamps: true,
    language: args.lang,
    printOutput: false,
  });

  await rm(tmp, { recursive: true, force: true });
  const { captions } = toCaptions({ whisperCppOutput });

  // Whisper emits sub-word tokens; a leading space marks a new word, anything
  // else (word pieces, punctuation) glues onto the previous word.
  let words = [];
  for (const c of captions) {
    const raw = c.text;
    if (!raw.trim()) continue;
    if (words.length === 0 || /^\s/.test(raw)) {
      words.push({ text: raw.trim(), startMs: c.startMs, endMs: c.endMs });
    } else {
      const last = words[words.length - 1];
      last.text += raw.trim();
      last.endMs = c.endMs;
    }
  }

  // If the spoken script is known, use its exact spelling (tool names,
  // numbers written out, trigger word) — Whisper only provides the timing.
  if (args.script) {
    const scriptWords = (await readFile(args.script, "utf-8")).split(/\s+/).filter(Boolean);
    words = alignToScript(words, scriptWords);
  }

  await writeFile(args.out, JSON.stringify(words, null, 2));
  console.log(`Wrote ${words.length} word-level captions to ${args.out}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
