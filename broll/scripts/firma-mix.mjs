#!/usr/bin/env node
// Firma series engine — audio mix for one episode: voice + music bed (continuous, never looped) + SFX from the beat events
// → 2-pass loudnorm -14 LUFS / TP -1 (same chain as runs/firma-neu-tag1/mix-v9.sh).
// usage: node scripts/firma-mix.mjs public/firma-ep/tag<N> [--out <wav>]
// Music: GONE_GONE_THANK_YOU_KLICKAUD, a different start point per episode (MUSIC_STARTS[(folge-1) % n]) unless audio.musicStart is set.
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FF = path.join(ROOT, "node_modules/ffmpeg-static/ffmpeg");
export const MUSIC_SRC = process.env.FIRMA_MUSIC || "/Users/pius/Downloads/GONE_GONE_THANK_YOU_KLICKAUD.mp3"; // Cloud: FIRMA_MUSIC=<Pfad>
// audio.musicMute (optional): [[a, b], ...] clip seconds where the music bed is silent (e.g. a sung explicit word), 80 ms ramps; default none
const muteAf = (r) => (Array.isArray(r) ? r : []).map(([a, b]) => `,volume='if(between(t,${a},${b}),0,if(between(t,${a - 0.08},${a}),(${a}-t)/0.08,if(between(t,${b},${b + 0.08}),(t-${b})/0.08,1)))':eval=frame`).join("");
export const MUSIC_LEN = 375.48;
// start points in the track (s). Tag 1 = 276.36. Every entry leaves ≥ 50 s of continuous music.
export const MUSIC_STARTS = [276.36, 12, 58, 104, 150, 196, 236, 322];

export const loadTimeline = async () => {
  const out = "/tmp/firma-timeline.mjs";
  const src = path.join(ROOT, "src/components/firma/timeline.ts");
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs) {
    execFileSync(path.join(ROOT, "node_modules/.bin/esbuild"), [src, "--bundle", "--platform=node", "--format=esm", `--outfile=${out}`, "--log-level=warning"]);
  }
  return import(`${out}?v=${fs.statSync(out).mtimeMs}`);
};

// momentary loudness (EBU R128 M, 400 ms window) every 100 ms → [t, LUFS]
const momentary = (wav) => {
  const txt = wav + ".m.txt";
  execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-i", wav, "-af", `aresample=48000,asetnsamples=4800,ebur128=metadata=1,ametadata=mode=print:key=lavfi.r128.M:file=${txt}`, "-f", "null", "-"]);
  const out = [];
  let t = 0;
  for (const ln of fs.readFileSync(txt, "utf8").split("\n")) {
    const a = ln.match(/pts_time:([\d.]+)/); if (a) t = parseFloat(a[1]);
    const b = ln.match(/lavfi\.r128\.M=(-?[\d.]+|-inf)/); if (b) out.push([t, b[1] === "-inf" ? -120 : parseFloat(b[1])]);
  }
  fs.rmSync(txt, { force: true });
  return out;
};
// voice-gated music distance per shot/act: only windows where the voice (after the final loudnorm gain) is > -28 LUFS M.
// M is a 400 ms window ending at t → shifted by -0.2 s to centre it. Distance = power-mean(voice) - power-mean(music), in dB.
const GATE = -28, MIN_GAP = 15, SAFE_GAP = 15.6;
const measureGaps = (vM, mM, gainDb, shots) => {
  const pm = (arr) => 10 * Math.log10(arr.reduce((a, v) => a + Math.pow(10, v / 10), 0) / arr.length);
  return shots.map((s) => {
    const v = [], mm = [];
    vM.forEach(([t, lv], i) => {
      const tc = t - 0.2;
      if (tc < s.a || tc >= s.b || lv + gainDb <= GATE || !mM[i]) return;
      v.push(lv); mm.push(mM[i][1]);
    });
    if (v.length < 3) return { shot: s.name, a: +s.a.toFixed(2), b: +s.b.toFixed(2), n: v.length, gapDb: null };
    return { shot: s.name, a: +s.a.toFixed(2), b: +s.b.toFixed(2), n: v.length, voice: +(pm(v) + gainDb).toFixed(1), music: +(pm(mm) + gainDb).toFixed(1), gapDb: +(pm(v) - pm(mm)).toFixed(1) };
  });
};

export const mixEpisode = async (tagDir, outWav) => {
  const dir = path.resolve(ROOT, tagDir);
  const ep = JSON.parse(fs.readFileSync(path.join(dir, "episode.json"), "utf8"));
  const words = JSON.parse(fs.readFileSync(path.join(dir, ep.audio?.words ?? "words.json"), "utf8"));
  const voice = path.join(dir, ep.audio?.voice ?? "voice.mp3");
  const m = await loadTimeline();
  const tl = m.buildTimeline(ep, words);
  const END = tl.END;
  const folge = ep.folge ?? ep.tag;
  let start = ep.audio?.musicStart;
  if (start === undefined) {
    const ok = MUSIC_STARTS.filter((s) => s + END + 0.5 <= MUSIC_LEN);
    start = ok[(folge - 1) % ok.length];
  }
  if (start + END > MUSIC_LEN) throw new Error(`music start ${start} + ${END} s runs past the end of the track (no looping)`);
  const work = path.join(ROOT, "runs/firma-ep", path.basename(dir), "render"); // outside public/ so it never lands in a Remotion bundle
  fs.mkdirSync(work, { recursive: true });
  const music = path.join(work, "music.wav");
  execFileSync(FF, ["-y", "-loglevel", "error", "-ss", String(start), "-t", String(END + 0.2), "-i", MUSIC_SRC, "-af", "afade=t=in:d=0.25" + muteAf(ep.audio?.musicMute), "-ar", "48000", "-ac", "2", music]);

  const sfx = m.buildSfx(tl);
  const shots = tl.shots.map((s) => ({ name: s.kind + (s.act !== undefined ? `-a${s.act}` : ""), a: s.a, b: s.b }));
  // ducking: start at the series curve; if any act is < 15 dB voice-to-music (gated), lower the whole music bed and mix again
  let gain = ep.audio?.musicGain ?? 1, gaps, curve, j, raw, tries = 0;
  const vStem = path.join(work, "stem-voice.wav"), mStem = path.join(work, "stem-music.wav");
  for (;;) {
  // audio.musicCurve (optional, from the Regie): own [t, level] breakpoints instead of the series curve; gain scales it the same way
  curve = Array.isArray(ep.audio?.musicCurve) ? ep.audio.musicCurve.map(([t0, v0]) => [t0, Math.round(v0 * gain * 1e5) / 1e5]) : m.musicCurve(tl, gain);
  let expr = String(curve[curve.length - 1][1]);
  for (let i = curve.length - 2; i >= 0; i--) {
    const [t0, v0] = curve[i], [t1, v1] = curve[i + 1];
    expr = `if(lt(t,${t1}),${v0}+(${v1}-${v0})*(t-${t0})/(${t1}-${t0}),${expr})`;
  }
  const inputs = ["-i", voice, "-i", music];
  const lines = [
    `[0:a]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:${END}[v];`,
    `[1:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${END},volume='${expr}':eval=frame,volume=0.5[m];`,
  ];
  const labels = ["[v]", "[m]"];
  sfx.forEach((e, k) => {
    const f = path.join(ROOT, e.f);
    if (!fs.existsSync(f)) { console.warn(`sfx missing, skipped: ${e.f}`); return; }
    const n = inputs.length / 2;
    inputs.push("-i", f);
    const ms = Math.max(0, Math.round(e.t * 1000));
    lines.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${e.v},adelay=${ms}|${ms}[s${k}];`);
    labels.push(`[s${k}]`);
  });
  lines.push(`${labels.join("")}amix=inputs=${labels.length}:normalize=0:duration=first,atrim=0:${END}[mix]`);
  const filt = path.join(work, "mix-filter.txt");
  fs.writeFileSync(filt, lines.join("\n"));
  raw = path.join(work, "mix-raw.wav");
  execFileSync(FF, ["-y", "-loglevel", "error", ...inputs, "-filter_complex_script", filt, "-map", "[mix]", "-c:a", "pcm_s16le", raw], { maxBuffer: 1 << 26 });
  const r = spawnSync(FF, ["-hide_banner", "-i", raw, "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], { encoding: "utf8" });
  j = JSON.parse(r.stderr.slice(r.stderr.lastIndexOf("{")));
  // stems with exactly the same chains as in the mix (voice / music after the duck curve)
  execFileSync(FF, ["-y", "-loglevel", "error", "-i", voice, "-af", `aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:${END}`, "-c:a", "pcm_s16le", vStem]);
  execFileSync(FF, ["-y", "-loglevel", "error", "-i", music, "-af", `aresample=48000,aformat=channel_layouts=stereo,atrim=0:${END},volume='${expr}':eval=frame,volume=0.5`, "-c:a", "pcm_f32le", mStem]);
  const gainDb = -14 - parseFloat(j.input_i); // loudnorm linear = one constant gain on the whole mix
  gaps = measureGaps(momentary(vStem), momentary(mStem), gainDb, shots);
  const minGap = Math.min(...gaps.filter((g) => g.gapDb !== null).map((g) => g.gapDb));
  console.log(`mix: music gain ${gain.toFixed(3)} → min voice-gated gap ${minGap.toFixed(1)} dB`);
  if (minGap >= SAFE_GAP || tries >= 4) break;
  gain *= Math.pow(10, (minGap - SAFE_GAP - 0.4) / 20);
  tries++;
  }
  const out = outWav ? path.resolve(outWav) : path.join(work, "mix.wav");
  execFileSync(FF, ["-y", "-loglevel", "error", "-i", raw, "-af",
    `loudnorm=I=-14:TP=-1:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,alimiter=limit=0.86:level=false:attack=1:release=50`,
    "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", out]);
  // final check on the delivered file
  const fin = spawnSync(FF, ["-hide_banner", "-i", out, "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], { encoding: "utf8" });
  const jf = JSON.parse(fin.stderr.slice(fin.stderr.lastIndexOf("{")));
  const valid = gaps.filter((g) => g.gapDb !== null);
  const minGap = Math.min(...valid.map((g) => g.gapDb));
  const info = { musicStart: start, seconds: END, sfx: sfx.length, musicGain: +gain.toFixed(4), lufs: +jf.input_i, truePeak: +jf.input_tp, minGapDb: minGap, gapOk: minGap >= MIN_GAP, gateLufs: GATE, gapsPerAct: gaps, curve };
  fs.writeFileSync(path.join(work, "mix-info.json"), JSON.stringify(info, null, 1));
  if (minGap < MIN_GAP) console.warn(`WARN music only ${minGap} dB under the voice somewhere (rule ≥ ${MIN_GAP} dB) - see mix-info.json`);
  return { out, musicStart: start, seconds: END, sfx: sfx.length, lufs: info.lufs, truePeak: info.truePeak, minGapDb: minGap, musicGain: info.musicGain };
};

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const a = process.argv.slice(2);
  if (!a[0]) { console.error("usage: node scripts/firma-mix.mjs public/firma-ep/tag<N> [--out file.wav]"); process.exit(1); }
  const oi = a.indexOf("--out");
  mixEpisode(a[0], oi >= 0 ? a[oi + 1] : undefined).then((r) => console.log(JSON.stringify(r))).catch((e) => { console.error(e.message); process.exit(1); });
}
