// ElevenLabs music bed + SFX for "Was wäre wenn" episodes.
//   node scripts/wwd/audio.mjs <outDir> <seconds> '<music prompt>' '<json {name: prompt}>'
import fs from "fs";
const KEY = (fs.readFileSync("/Users/pius/LinkedIn Generator/broll/.env", "utf8").match(/^ELEVENLABS_API_KEY=(.+)$/m) || [])[1].trim();
const [dir, secs, mprompt, sfxJson] = process.argv.slice(2);
const jobs = [];
if (mprompt) jobs.push((async () => {
  const r = await fetch("https://api.elevenlabs.io/v1/music", { method: "POST", headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: mprompt, music_length_ms: Math.round(Number(secs) * 1000), force_instrumental: true }) });
  if (!r.ok) { console.log("music", r.status, await r.text()); return; }
  fs.writeFileSync(`${dir}/music.mp3`, Buffer.from(await r.arrayBuffer())); console.log("music ok");
})());
for (const [name, p] of Object.entries(JSON.parse(sfxJson || "{}"))) jobs.push((async () => {
  const r = await fetch("https://api.elevenlabs.io/v1/sound-generation", { method: "POST", headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text: p.t || p, duration_seconds: p.d || null, prompt_influence: 0.6 }) });
  if (!r.ok) { console.log(name, r.status, await r.text()); return; }
  fs.writeFileSync(`${dir}/sfx/${name}.mp3`, Buffer.from(await r.arrayBuffer())); console.log(name, "ok");
})());
await Promise.all(jobs);
