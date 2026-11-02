#!/usr/bin/env node
// "Was wäre wenn" narrator TTS (ElevenLabs "Johannes", doc voice) with word timings.
//   node scripts/wwd/tts.mjs <tts.src> <out.mp3> <words.json>
// tts.src: plain text; {Display|spoken words} = caption shows Display, voice says the spoken words.
import fs from "fs";
const KEY = (fs.readFileSync("/Users/pius/LinkedIn Generator/broll/.env", "utf8").match(/^ELEVENLABS_API_KEY=(.+)$/m) || [])[1].trim();
const VOICE = process.env.WWD_VOICE || "r8MyP4qUsq5WFFSkPdfV";
const [src, outMp3, outWords] = process.argv.slice(2);
const raw = fs.readFileSync(src, "utf8").trim().replace(/\n+/g, " ");
// tokens: [{d, n}] with n = number of spoken words
const toks = []; let spoken = [];
raw.replace(/\{([^|}]+)\|([^}]+)\}|(\S+)/g, (_, d, s, w) => {
  if (w) { toks.push({ d: w, n: 1 }); spoken.push(w); }
  else { const sw = s.trim().split(/\s+/); toks.push({ d, n: sw.length }); spoken.push(...sw); }
  return "";
});
const text = spoken.join(" ");
const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps`, {
  method: "POST", headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
  body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true, speed: Number(process.env.TTS_SPEED || 1.0) } }),
});
if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
const d = await r.json();
fs.writeFileSync(outMp3, Buffer.from(d.audio_base64, "base64"));
const { characters: ch, character_start_times_seconds: s, character_end_times_seconds: e } = d.alignment;
const aw = []; let cur = null;
ch.forEach((c, i) => {
  if (/\s/.test(c)) { if (cur) aw.push(cur); cur = null; return; }
  if (!cur) cur = { w: "", s: s[i], e: e[i] };
  cur.w += c; cur.e = e[i];
});
if (cur) aw.push(cur);
if (aw.length !== spoken.length) console.warn(`word count mismatch ${aw.length} vs ${spoken.length}`);
const out = []; let k = 0;
for (const t of toks) { const g = aw.slice(k, k + t.n); k += t.n; out.push({ w: t.d, s: +g[0].s.toFixed(3), e: +g.at(-1).e.toFixed(3) }); }
fs.writeFileSync(outWords, JSON.stringify(out));
console.log(`${out.length} words, ${out.at(-1).e.toFixed(2)} s`);
