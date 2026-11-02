#!/usr/bin/env node
// ElevenLabs TTS with word timings (series voice "Keno").
//   node scripts/eleven-tts.mjs <script.txt> <out.mp3> <words.json>
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEY = (fs.readFileSync(path.join(ROOT, ".env"), "utf8").match(/^ELEVENLABS_API_KEY=(.+)$/m) || [])[1]?.trim();
const [src, outMp3, outWords] = process.argv.slice(2);
const text = fs.readFileSync(src, "utf8").trim().replace(/\n+/g, " ");
const r = await fetch("https://api.elevenlabs.io/v1/text-to-speech/5qxnhLWq1rPhIVOrGuRh/with-timestamps", {
  method: "POST", headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
  body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.35, similarity_boost: 0.8, style: 0.5, use_speaker_boost: true, speed: Number(process.env.TTS_SPEED || 1.08) } }),
});
if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
const d = await r.json();
fs.writeFileSync(outMp3, Buffer.from(d.audio_base64, "base64"));
const { characters: ch, character_start_times_seconds: s, character_end_times_seconds: e } = d.alignment;
const words = []; let cur = null;
ch.forEach((c, i) => {
  if (/\s/.test(c)) { if (cur) words.push(cur); cur = null; return; }
  if (!cur) cur = { w: "", s: s[i], e: e[i] };
  cur.w += c; cur.e = e[i];
});
if (cur) words.push(cur);
fs.writeFileSync(outWords, JSON.stringify(words.map((w) => ({ w: w.w, s: +w.s.toFixed(3), e: +w.e.toFixed(3) }))));
console.log(`${words.length} words, ${words.at(-1).e.toFixed(2)} s`);
