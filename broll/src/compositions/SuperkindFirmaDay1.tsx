// "Ein Superkind-Agent baut eine Firma", episode 1 (v3, 2026-10-21). Endless community series: the Superkind agent builds a
// fictional internet company in 100 days (goal: 1 Mio), the community picks A/B/C, and every episode ends on a cliffhanger
// that the next episode opens with. Red thread inside the episode = one day: a clock runs from morning to midnight, the sky
// goes day → sunset → night. Toy-3D world like TrainerWorld3D; motion lives in the set pieces (crane, trees, clouds, birds,
// lit windows, smoke), not in confetti overlays.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BlockBuddy, CameraRig, ToyBox, canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, THEMES, Word, pixelFont } from "../components/PixelKit";
import words from "../../public/cbf1/words3.json";

export const SK_FIRMA_D1_SECONDS = 41.5;
const W = 1080, H = 1920;
type V3 = [number, number, number];
const OR = "#FF6B35", OR_D = "#E5521F", INK = "#16130F", MUTED = "#8A857D", GOLD = "#F5C542", RED = "#E5484D", GREEN = "#1F9D55", PURPLE = "#8B6CF0", EVIL = "#FF2E3A";
const F_B = "Inter-Bold", F_S = "Inter-SemiBold", F_M = "Inter-Medium";
const OPT_COL = ["#E0559A", "#E5484D", "#4C9BE8"];
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - Math.pow(1 - cl(v), 3);
const inOut = (v: number) => { const x = cl(v); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = (v: number) => { const x = cl(v); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const rnd = (i: number) => { const v = Math.sin(i * 91.7 + 47.3) * 43758.5453; return v - Math.floor(v); };
const bump = (t: number, at: number, d = 0.25) => Math.max(0, 1 - Math.abs(t - at) / d);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const bez3 = (a: V3, c: V3, b: V3, k: number): V3 => lerp3(lerp3(a, c, k), lerp3(c, b, k), k);
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const WD = words as Word[];
const at = (w: string, after = 0) => WD.find((x) => x.s >= after && x.w.toLowerCase().startsWith(w.toLowerCase()))?.s ?? after;
const font = (px: number) => `800 ${px}px ${pixelFont}`;
// piecewise linear keyframes
const keys = (t: number, k: [number, number][]) => {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (t <= k[i][0]) { const [a0, v0] = k[i - 1], [a1, v1] = k[i]; return v0 + (v1 - v0) * inOut((t - a0) / Math.max(0.001, a1 - a0)); }
  return k[k.length - 1][1];
};
const TMP_A = new THREE.Color(), TMP_B = new THREE.Color();
const keysC = (t: number, k: [number, string][]) => {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (t <= k[i][0]) { const [a0, c0] = k[i - 1], [a1, c1] = k[i]; TMP_A.set(c0); TMP_B.set(c1); return "#" + TMP_A.lerp(TMP_B, inOut((t - a0) / Math.max(0.001, a1 - a0))).getHexString(); }
  return k[k.length - 1][1];
};

// ---------- episode data ----------
const EP = {
  day: 1, cash: 0, name: "NULLPLAN",
  options: [
    { key: "A", title: "KI-Influencerin", sub: "die nie schläft", stats: [1, 3, 5] },
    { key: "B", title: "YouTube-Kanal", sub: "ohne Gesicht", stats: [1, 2, 4] },
    { key: "C", title: "Outfit-App", sub: "bewertet deinen Look", stats: [3, 3, 4] },
  ],
};
const STAT_NAMES = ["KOSTEN", "RISIKO", "HYPE"];

// ---------- key times ----------
const T = {
  agent: at("Superkind"), hundert: at("hundert"), allein: at("allein"), ziel: at("Ziel"), million: at("Million"), aber: at("Aber"), du: at("du.", 6),
  tag: at("Tag", 6.5), kasse: at("Kasse"), null: at("null"),
  holt: at("holt"), zwanzig: at("zwanzig"), helfer: at("Helfer"),
  durch: at("durchsuchen"), internet: at("Internet"),
  abend: at("Abend"), nullplan: at("Nullplan"), logo: at("Logo"), website: at("Website"),
  jetzt: at("Jetzt"), geschaeft: at("Geschäft"), drei: at("Drei"),
  a: at("A:"), schlaeft: at("schläft"), b: at("B:"), gesicht: at("Gesicht"), c: at("C:"), app: at("App"), bewertet: at("bewertet"),
  komm: at("Kommentier"), va: at("A,", 27), vb: at("B", 28), vc: at("C.", 28.5), morgen: at("Morgen"),
  doch: at("Doch"), mitternacht: at("Mitternacht"), mail: at("Mail."), betreff: at("Betreff"), ich: at("Ich", 33), absender: at("Absender"),
  zweiter: at("zweiter"), agent2: at("Agent.", 35), dieselbe: at("dieselbe"), folg: at("Folg"), anderen: at("anderen"),
};
const SPAWN = T.helfer + 0.05;
const VOTE = [T.va, T.vb, T.vc];
const BUILD = [T.abend - 0.15, T.abend + 0.25, T.abend + 0.6, T.nullplan - 0.3];
const RBUILD = [T.dieselbe - 0.1, T.dieselbe + 0.1, T.dieselbe + 0.3, T.dieselbe + 0.5];
const MIDNIGHT = T.mitternacht + 0.3;

// ---------- day → night ----------
const SKY: [number, string][] = [[0, "#8FD3F4"], [T.abend - 0.3, "#8FD3F4"], [T.abend + 0.9, "#F2A07A"], [T.drei, "#F2A07A"], [T.drei + 1.0, "#5C4A8C"], [T.doch, "#5C4A8C"], [MIDNIGHT, "#120E22"]];
const nightAt = (t: number) => keys(t, [[0, 0], [T.drei, 0], [T.drei + 1.0, 0.45], [T.doch, 0.45], [MIDNIGHT, 1]]);
const eveningAt = (t: number) => keys(t, [[0, 0], [T.abend + 0.3, 0], [T.abend + 1.3, 1]]);
// clock in minutes of the day
const clockAt = (t: number) => {
  if (t < T.tag) return 7 * 60 + 59;
  if (t < T.abend) return 8 * 60 + ((t - T.tag) / (T.abend - T.tag)) * 5 * 60;
  if (t < T.doch) return 18 * 60 + ((t - T.abend) / (T.doch - T.abend)) * 3.5 * 60;
  if (t < MIDNIGHT) return 23 * 60 + 58 + ((t - T.doch) / (MIDNIGHT - T.doch)) * 2;
  return 24 * 60 + (t - MIDNIGHT) * 0.5;
};
const hhmm = (m: number) => { const mm = Math.floor(m) % (24 * 60); return `${String(Math.floor(mm / 60)).padStart(2, "0")}:${String(mm % 60).padStart(2, "0")}`; };

// ---------- world layout ----------
const HQ: V3 = [0, 0, 5];
const HQR = 4.4;
const BLD: V3 = [0.9, 0.45, 3.3];
const MON: V3 = [2.4, 2.35, 7.0];
const BILL: V3 = [-2.5, 2.5, 4.6];
const RES: V3 = [7.4, 0, -3.5];
const PORTAL: V3 = [8.3, 2.7, -4.4];
const RBOARD: V3 = [5.2, 3.2, -3.0];
const RIV: V3 = [-8.5, 0, -0.5];
const ISL: V3[] = [[-4, 0, -11.5], [4, 0, -17], [-4, 0, -22.5]];
const IR = 2.9;
const OPT_T = [T.a, T.b, T.c];
const OPT_END = [T.b - 0.1, T.c - 0.1, T.komm - 0.25];

// ---------- camera ----------
type Hold = { a: number; b: number; p0: V3; p1: V3; l0: V3; l1: V3 };
const optHold = (i: number): Hold => ({ a: OPT_T[i] - 0.05, b: OPT_END[i] - 0.3, p0: add(ISL[i], [0.5 * (i === 1 ? -1 : 1), 6.0, 10.6]), p1: add(ISL[i], [0, 5.6, 9.7]), l0: add(ISL[i], [0, 2.7, -0.6]), l1: add(ISL[i], [0, 2.6, -0.6]) });
const HOLDS: Hold[] = [
  { a: 0, b: T.tag - 0.3, p0: [0, 6.4, 18.4], p1: [0, 7.8, 20.2], l0: [0, 2.6, 4.4], l1: [0, 2.8, 4.0] },
  { a: T.tag + 0.15, b: SPAWN - 0.1, p0: [2.4, 3.0, 13.3], p1: [2.4, 2.9, 12.6], l0: MON, l1: MON },
  { a: SPAWN + 0.12, b: T.durch - 0.15, p0: [1.0, 6.6, 16.2], p1: [0.8, 7.4, 17.0], l0: [0.6, 1.4, 5.2], l1: [0.6, 1.4, 5.0] },
  { a: T.durch + 0.35, b: T.abend - 0.4, p0: [5.0, 5.7, 9.6], p1: [5.1, 5.4, 8.8], l0: [5.7, 2.5, -3.4], l1: [5.8, 2.5, -3.4] },
  { a: T.abend + 0.05, b: T.jetzt - 0.15, p0: [-0.6, 5.6, 17.4], p1: [-0.6, 5.2, 16.2], l0: [-0.6, 3.0, 3.8], l1: [-0.6, 3.0, 3.8] },
  { a: T.jetzt + 0.15, b: T.drei - 0.2, p0: [-1.6, 4.0, 14.0], p1: [-1.6, 4.6, 15.0], l0: [-2.2, 2.2, 6.0], l1: [-2.2, 2.2, 5.6] },
  { a: T.drei + 0.35, b: T.a - 0.3, p0: [-1.5, 15.5, 6.0], p1: [-1.5, 15.0, 5.0], l0: [0, 0, -14], l1: [0, 0, -15] },
  optHold(0), optHold(1), optHold(2),
  { a: T.komm + 0.2, b: T.doch - 0.15, p0: [0, 13.4, 13.6], p1: [0, 12.8, 12.4], l0: [0, 0.6, -9.5], l1: [0, 0.6, -10] },
  { a: T.doch + 0.45, b: T.agent2 - 0.3, p0: [2.4, 3.2, 14.2], p1: [2.4, 2.9, 13.0], l0: MON, l1: MON },
  { a: T.agent2 + 0.25, b: T.folg - 0.15, p0: add(RIV, [3.4, 4.6, 11.4]), p1: add(RIV, [3.0, 4.2, 10.2]), l0: add(RIV, [-0.2, 1.9, -0.6]), l1: add(RIV, [-0.2, 2.0, -0.6]) },
  { a: T.folg + 0.4, b: 60, p0: [1.5, 7.5, 19], p1: [2.0, 8.6, 21.5], l0: [-4.5, 2.2, 0], l1: [-4.5, 2.4, 0] },
];
const VIA: { pos: V3; look: V3 }[] = [
  { pos: [1.6, 4.2, 15.6], look: [2.0, 2.4, 6.8] },
  { pos: [2.0, 4.2, 14.8], look: [1.8, 2.0, 6.4] },
  { pos: [5.5, 9, 10], look: [6, 2, -1] },
  { pos: [3.5, 8, 11], look: [0, 2.4, 3] },
  { pos: [-1.0, 4.8, 15.4], look: [-1.5, 2.6, 4.5] },
  { pos: [-1, 10, 12], look: [0, 1, -6] },
  { pos: [-2.5, 9.5, 2.5], look: [-4, 1.5, -11] },
  { pos: [0, 8.5, -6], look: [4, 1.5, -17] },
  { pos: [0, 8.5, -11.5], look: [-4, 1.5, -22.5] },
  { pos: [-1, 12, -2], look: [0, 1, -8] },
  { pos: [2, 8, 15], look: [2.4, 2.4, 5] },
  { pos: [-2.5, 4.8, 11.5], look: [-6.5, 2, 0] },
  { pos: [-2, 6, 15], look: [-5, 2, 0] },
];
const camAt = (t: number): { pos: V3; look: V3 } => {
  for (let i = 0; i < HOLDS.length; i++) {
    const h = HOLDS[i];
    const hk = inOut((Math.max(t, h.a) - h.a) / Math.max(0.01, h.b - h.a));
    if (t <= h.b) return { pos: lerp3(h.p0, h.p1, hk), look: lerp3(h.l0, h.l1, hk) };
    const n = HOLDS[i + 1];
    if (n && t < n.a) {
      const k = inOut((t - h.b) / (n.a - h.b));
      return { pos: bez3(h.p1, VIA[i].pos, n.p0, k), look: bez3(h.l1, VIA[i].look, n.l0, k) };
    }
  }
  const l = HOLDS[HOLDS.length - 1];
  return { pos: l.p1, look: l.l1 };
};
const PUNCH = [T.agent, T.null, SPAWN, T.nullplan, T.a, T.b, T.c, ...VOTE, T.ich, T.agent2 + 0.6];

// ---------- helpers ----------
const useImage = (src: string) => {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [h] = React.useState(() => delayRender("image " + src));
  React.useEffect(() => {
    const i = new Image();
    i.onload = () => { setImg(i); continueRender(h); };
    i.onerror = () => continueRender(h);
    i.src = src;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return img;
};
const useDyn = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const { cv, tex } = React.useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return { cv, tex };
  }, [w, h]);
  const c = cv.getContext("2d")!;
  c.clearRect(0, 0, w, h);
  draw(c);
  tex.needsUpdate = true;
  return tex;
};
const fitFont = (c: CanvasRenderingContext2D, text: string, max: number, maxW: number) => {
  let s = max;
  c.font = font(s);
  while (c.measureText(text).width > maxW && s > 10) { s -= 2; c.font = font(s); }
};
const wrap = (c: CanvasRenderingContext2D, text: string, maxW: number) => {
  const out: string[] = []; let line = "";
  text.split(" ").forEach((w) => { const tryL = line ? line + " " + w : w; if (c.measureText(tryL).width > maxW && line) { out.push(line); line = w; } else line = tryL; });
  if (line) out.push(line);
  return out;
};
const keyTex = (letter: string, col: string) => canvasTex(256, 256, (c) => {
  c.fillStyle = col; roundRect(c, 0, 0, 256, 256, 40); c.fill();
  c.fillStyle = "rgba(255,255,255,.22)"; roundRect(c, 16, 14, 224, 110, 30); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = font(170); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(letter, 128, 140);
});
const pillTex = (text: string, bg: string, fg: string, w = 760, h = 180) => canvasTex(w, h, (c) => {
  c.fillStyle = "rgba(0,0,0,.35)"; roundRect(c, 6, 14, w - 12, h - 16, h / 2 - 8); c.fill();
  c.fillStyle = bg; roundRect(c, 0, 0, w - 6, h - 14, h / 2 - 8); c.fill();
  c.strokeStyle = "rgba(0,0,0,.55)"; c.lineWidth = 6; roundRect(c, 3, 3, w - 12, h - 20, h / 2 - 10); c.stroke();
  c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle";
  fitFont(c, text, h * 0.5, w - 90); c.fillText(text, (w - 6) / 2, (h - 14) / 2 + 4);
});
const HAND = ["..KK......", ".KWWK.....", ".KWWK.....", ".KWWKKK...", ".KWWKWWKK.", "KKWWKWWKWK", "KWWWWWWKWK", "KWWWWWWWWK", ".KWWWWWWWK", "..KWWWWWK.", "...KKKKK.."];
const hand = (c: CanvasRenderingContext2D, x: number, y: number, press: boolean, px = 6) => {
  c.save(); c.translate(x - 10, y - 4); c.rotate(-0.2); const s = press ? 0.85 : 1; c.scale(s, s);
  HAND.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === ".") return; c.fillStyle = ch === "K" ? INK : "#FFFFFF"; c.fillRect(i * px, j * px, px + 0.5, px + 0.5); }));
  c.restore();
};
// little 2D Superkind agent head for UI tiles
const botFace = (c: CanvasRenderingContext2D, x: number, y: number, s: number, body = OR, eye = "#FFFFFF") => {
  c.fillStyle = INK; c.fillRect(x - s * 0.04, y - s * 0.95, s * 0.08, s * 0.3);
  c.fillStyle = body === OR ? GOLD : EVIL; c.fillRect(x - s * 0.1, y - s * 1.05, s * 0.2, s * 0.2);
  c.fillStyle = body; roundRect(c, x - s * 0.6, y - s * 0.65, s * 1.2, s * 1.2, s * 0.18); c.fill();
  c.fillStyle = eye; c.fillRect(x - s * 0.4, y - s * 0.35, s * 0.28, s * 0.32); c.fillRect(x + s * 0.12, y - s * 0.35, s * 0.28, s * 0.32);
  if (eye === "#FFFFFF") { c.fillStyle = INK; c.fillRect(x - s * 0.3, y - s * 0.28, s * 0.13, s * 0.18); c.fillRect(x + s * 0.22, y - s * 0.28, s * 0.13, s * 0.18); }
};
const logoMark = (c: CanvasRenderingContext2D, x: number, y: number, r: number, col = OR) => {
  c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  c.strokeStyle = "#FFFFFF"; c.lineWidth = r * 0.22; c.beginPath(); c.ellipse(x, y, r * 0.42, r * 0.58, 0, 0, 7); c.stroke();
  c.beginPath(); c.moveTo(x - r * 0.62, y + r * 0.62); c.lineTo(x + r * 0.62, y - r * 0.62); c.stroke();
};

// ---------- canvas: Superkind app on the desk monitor ----------
const MW = 1000, MH = 660;
const PROMPT = "Bau eine Firma. Start: 0 €. Ziel: 1 Mio. Die Community entscheidet.";
const drawMonitor = (c: CanvasRenderingContext2D, t: number, logo: HTMLImageElement | null) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, MW, MH);
  const g = c.createLinearGradient(0, 0, MW, 0); g.addColorStop(0, "#FFF1E8"); g.addColorStop(1, "#FFFFFF");
  c.fillStyle = g; c.fillRect(0, 0, MW, 76);
  c.fillStyle = "#FFDCCB"; c.fillRect(0, 74, MW, 2);
  if (logo) c.drawImage(logo, 26, 20, 36, 36);
  c.fillStyle = INK; c.font = `32px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("superkind", 74, 39);
  c.fillStyle = MUTED; c.font = `24px ${F_S}`; c.textAlign = "right"; c.fillText(hhmm(clockAt(t)), MW - 30, 39); c.textAlign = "left";

  // night: the inbox and the mail
  if (t > T.doch + 0.3) {
    c.fillStyle = INK; c.font = `40px ${F_B}`; c.fillText("Posteingang", 40, 132);
    const k = back((t - T.mail + 0.05) / 0.35);
    if (k > 0.01) {
      c.save(); c.translate(0, (1 - k) * 80); c.globalAlpha = cl(k);
      const glitch = bump(t, T.ich + 0.1, 0.12) > 0 || bump(t, T.agent2, 0.1) > 0;
      c.fillStyle = "#FFF5F5"; roundRect(c, 30, 176, MW - 60, 300, 26); c.fill();
      c.strokeStyle = t > T.zweiter ? EVIL : "#F1D6D6"; c.lineWidth = t > T.zweiter ? 6 : 3; roundRect(c, 30, 176, MW - 60, 300, 26); c.stroke();
      c.fillStyle = "#16121F"; roundRect(c, 60, 206, 110, 110, 22); c.fill();
      botFace(c, 115, 270, 52, "#2A2338", EVIL);
      c.fillStyle = MUTED; c.font = `26px ${F_S}`; c.fillText("Von", 200, 226);
      const named = t > T.zweiter - 0.05;
      c.fillStyle = named ? EVIL : INK; c.font = `38px ${F_B}`; c.fillText(named ? "Agent 2" : "???", 200, 270);
      c.fillStyle = EVIL; c.beginPath(); c.arc(MW - 80, 230, 13, 0, 7); c.fill();
      c.fillStyle = MUTED; c.font = `26px ${F_S}`; c.fillText("Betreff", 60, 370);
      const subj = "Ich weiß, was du vorhast.";
      const n = Math.max(0, Math.min(subj.length, Math.floor((t - T.ich + 0.05) * 30)));
      c.fillStyle = INK; c.font = `44px ${F_B}`; c.fillText(subj.slice(0, n) + (n > 0 && n < subj.length ? "|" : ""), 60, 420);
      if (glitch) { c.fillStyle = "rgba(255,46,58,.25)"; c.fillRect(30, 176 + rnd(Math.floor(t * 30)) * 260, MW - 60, 40); }
      c.restore();
    }
    return;
  }
  const n = Math.max(0, Math.min(PROMPT.length, Math.floor((t - T.tag + 0.1) * 60)));
  if (n === 0) {
    botFace(c, MW / 2, 270, 80);
    c.fillStyle = INK; c.font = `46px ${F_B}`; c.textAlign = "center"; c.fillText("Was bauen wir heute?", MW / 2, 420); c.textAlign = "left";
    return;
  }
  c.font = `28px ${F_M}`;
  const lines = wrap(c, PROMPT.slice(0, n), 540);
  c.fillStyle = INK; roundRect(c, MW - 620, 96, 590, lines.length * 38 + 28, 22); c.fill();
  c.fillStyle = "#FFFFFF"; lines.forEach((l, i) => c.fillText(l, MW - 596, 128 + i * 38));
  if (t < T.holt - 0.15) return;
  botFace(c, 64, 248, 26);
  c.fillStyle = MUTED; c.font = `20px ${F_S}`; c.fillText("SUPERKIND · AGENT", 106, 230);
  c.fillStyle = INK; c.font = `30px ${F_B}`; c.fillText("Ich hole mir 20 Helfer.", 106, 264);
  for (let i = 0; i < 20; i++) {
    const k = back((t - T.holt - 0.05 - i * 0.035) / 0.25);
    if (k <= 0.01) continue;
    const col = i % 10, row = Math.floor(i / 10);
    const x = 92 + col * 90, y = 350 + row * 96;
    const gone = t > SPAWN + i * 0.03;
    c.save(); c.translate(x, y); c.scale(k, k);
    c.fillStyle = gone ? "#E6F6EC" : "#FFF6F1"; roundRect(c, -38, -40, 76, 80, 16); c.fill();
    c.strokeStyle = gone ? GREEN : "#FFD9C7"; c.lineWidth = 3; roundRect(c, -38, -40, 76, 80, 16); c.stroke();
    if (!gone) botFace(c, 0, 6, 24);
    else { c.fillStyle = GREEN; c.font = `36px ${F_B}`; c.textAlign = "center"; c.fillText("✓", 0, 2); c.textAlign = "left"; }
    c.restore();
  }
  const press = t > SPAWN - 0.2 && t < SPAWN - 0.05;
  const done = t > SPAWN - 0.1;
  c.fillStyle = done ? GREEN : OR; roundRect(c, 330, 566 + (press ? 3 : 0), 340, 66, 20); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `30px ${F_B}`; c.textAlign = "center"; c.fillText(done ? "✓ 20 Helfer laufen" : "Alle starten", 500, 600 + (press ? 3 : 0)); c.textAlign = "left";
  if (t > T.zwanzig - 0.3 && t < SPAWN + 0.5) {
    const hk = ease((t - T.zwanzig + 0.3) / Math.max(0.2, SPAWN - T.zwanzig));
    hand(c, 780 + (500 - 780) * hk, 690 + (610 - 690) * hk, press, 6);
  }
};

// ---------- canvas: web research board ----------
const RW = 900, RH = 700;
const QUERY = "womit verdienen leute online geld";
const RESULTS = ["Creator & Videos", "Apps & Tools", "Online-Shops", "Newsletter", "KI-Accounts"];
const drawResearch = (c: CanvasRenderingContext2D, t: number) => {
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, RW, RH, 40); c.fill();
  c.strokeStyle = INK; c.lineWidth = 8; roundRect(c, 4, 4, RW - 8, RH - 8, 36); c.stroke();
  c.fillStyle = "#FFF1E8"; roundRect(c, 8, 8, RW - 16, 76, 30); c.fill();
  botFace(c, 54, 50, 22);
  c.fillStyle = INK; c.font = `30px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Recherche · 20 Helfer", 96, 48);
  const n = Math.max(0, Math.min(QUERY.length, Math.floor((t - T.durch - 0.2) * 40)));
  c.fillStyle = "#FFFFFF"; roundRect(c, 40, 112, RW - 80, 74, 37); c.fill();
  c.strokeStyle = n > 0 ? OR : "#DDD6C8"; c.lineWidth = 5; roundRect(c, 40, 112, RW - 80, 74, 37); c.stroke();
  c.strokeStyle = MUTED; c.lineWidth = 5; c.beginPath(); c.arc(78, 146, 13, 0, 7); c.stroke(); c.beginPath(); c.moveTo(88, 156); c.lineTo(100, 168); c.stroke();
  c.fillStyle = INK; c.font = `30px ${F_M}`; c.fillText(QUERY.slice(0, n) + (n < QUERY.length && Math.floor(t * 4) % 2 ? "|" : ""), 116, 150);
  RESULTS.forEach((r, i) => {
    const a0 = T.internet + 0.35 + i * 0.3;
    const k = back((t - a0) / 0.3);
    if (k <= 0.01) return;
    const y = 220 + i * 92;
    c.save(); c.translate(RW / 2, y + 38); c.scale(1, k); c.translate(-RW / 2, -(y + 38));
    c.fillStyle = "#FAF8F3"; roundRect(c, 40, y, RW - 80, 76, 20); c.fill();
    botFace(c, 92, y + 42, 22);
    c.fillStyle = INK; c.font = `32px ${F_B}`; c.fillText(r, 140, y + 40);
    const bw = 220 * ease((t - a0 - 0.1) / 0.7) * [1, 0.8, 0.65, 0.5, 0.9][i];
    c.fillStyle = "#EEE9DD"; roundRect(c, RW - 300, y + 26, 220, 24, 12); c.fill();
    c.fillStyle = OR; roundRect(c, RW - 300, y + 26, Math.max(24, bw), 24, 12); c.fill();
    c.restore();
  });
  const press = bump(t, T.internet - 0.1, 0.08) > 0;
  if (t > T.durch && t < T.internet + 0.4) hand(c, 760 - 60 * ease((t - T.durch) / 0.5), 230 - 70 * ease((t - T.durch) / 0.5), press, 6);
};

// ---------- canvas: the website billboard ----------
const BW = 900, BH = 570;
const drawSite = (c: CanvasRenderingContext2D, t: number) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, BW, BH);
  c.fillStyle = "#F1EEE6"; c.fillRect(0, 0, BW, 54);
  ["#FF5F57", "#FEBC2E", "#28C840"].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(30 + i * 26, 27, 8, 0, 7); c.fill(); });
  c.fillStyle = "#FFFFFF"; roundRect(c, 250, 12, 400, 30, 15); c.fill();
  c.fillStyle = MUTED; c.font = `20px ${F_M}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("nullplan · Entwurf", 450, 28); c.textAlign = "left";
  const k = ease((t - T.website + 0.05) / 0.5);
  if (k <= 0.01) {
    const o = (t * 60) % 160;
    for (let i = -4; i < 14; i++) { c.fillStyle = i % 2 ? GOLD : INK; c.beginPath(); c.moveTo(i * 80 + o, 54); c.lineTo(i * 80 + 80 + o, 54); c.lineTo(i * 80 + o, BH); c.lineTo(i * 80 - 80 + o, BH); c.fill(); }
    c.fillStyle = "#FFFFFF"; roundRect(c, 200, 230, 500, 120, 30); c.fill();
    c.fillStyle = INK; c.font = font(64); c.textAlign = "center"; c.fillText("IM BAU", 450, 294); c.textAlign = "left";
    return;
  }
  c.save(); c.globalAlpha = k; c.translate(0, (1 - k) * 30);
  logoMark(c, 64, 100, 26);
  c.fillStyle = INK; c.font = font(32); c.fillText("NULLPLAN", 104, 102);
  c.fillStyle = "#6E675C"; c.font = `22px ${F_M}`; ["Mitmachen", "Tagebuch"].forEach((n, i) => c.fillText(n, 640 + i * 130, 102));
  c.fillStyle = INK; c.font = font(70); c.fillText("Wir haben", 40, 210); c.fillText("keinen Plan.", 40, 288);
  c.fillStyle = OR; c.fillText("Ihr schon.", 40, 366);
  c.fillStyle = OR; roundRect(c, 40, 410, 300, 66, 33); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `28px ${F_B}`; c.fillText("Mitentscheiden →", 70, 444);
  c.fillStyle = "#FFF1EA"; roundRect(c, 540, 160, 320, 320, 30); c.fill();
  logoMark(c, 700, 300, 90 + 6 * Math.sin(t * 4));
  c.fillStyle = INK; c.font = font(30); c.textAlign = "center"; c.fillText("TAG 1 / 100", 700, 440); c.textAlign = "left";
  c.restore();
};

// ---------- canvas: option stat card + votes ----------
const drawStat = (c: CanvasRenderingContext2D, t: number, i: number) => {
  const o = EP.options[i], col = OPT_COL[i];
  const w = 760, h = 470;
  c.fillStyle = "rgba(0,0,0,.35)"; roundRect(c, 8, 16, w - 8, h - 16, 44); c.fill();
  c.fillStyle = "#FFFDF7"; roundRect(c, 0, 0, w - 8, h - 16, 44); c.fill();
  c.strokeStyle = INK; c.lineWidth = 7; roundRect(c, 3.5, 3.5, w - 15, h - 23, 41); c.stroke();
  c.fillStyle = col; roundRect(c, 28, 26, 110, 110, 26); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = font(84); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(o.key, 83, 86);
  c.textAlign = "left"; c.fillStyle = INK; fitFont(c, o.title, 60, 560); c.fillText(o.title, 160, 66);
  c.fillStyle = "#6E675C"; fitFont(c, o.sub, 36, 560); c.fillText(o.sub, 162, 116);
  const t0 = OPT_T[i] + 0.6;
  STAT_NAMES.forEach((name, r) => {
    const y = 196 + r * 82;
    c.fillStyle = "#6E675C"; c.font = font(34); c.fillText(name, 32, y + 26);
    for (let s = 0; s < 5; s++) {
      const on = s < o.stats[r] && t > t0 + r * 0.25 + s * 0.06;
      const x = 236 + s * 98;
      c.fillStyle = on ? (r === 1 && o.stats[r] >= 4 ? RED : r === 2 && o.stats[r] >= 4 ? GREEN : col) : "#E8E2D6";
      roundRect(c, x, y, 86, 50, 12); c.fill();
      if (on) { c.fillStyle = "rgba(255,255,255,.3)"; roundRect(c, x + 6, y + 5, 74, 16, 8); c.fill(); }
    }
  });
};
const drawVotes = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 560;
  c.fillStyle = "rgba(0,0,0,.35)"; roundRect(c, 8, 16, w - 8, h - 16, 44); c.fill();
  c.fillStyle = "#FFFDF7"; roundRect(c, 0, 0, w - 8, h - 16, 44); c.fill();
  c.strokeStyle = INK; c.lineWidth = 7; roundRect(c, 3.5, 3.5, w - 15, h - 23, 41); c.stroke();
  c.fillStyle = INK; c.font = font(46); c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Kommentare", 40, 62);
  c.fillStyle = RED; roundRect(c, w - 230, 34, 190, 56, 28); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = font(30); c.textAlign = "center"; c.fillText(Math.floor(t * 2) % 2 ? "● WAHL" : "○ WAHL", w - 135, 63); c.textAlign = "left";
  EP.options.forEach((o, i) => {
    const k = back((t - VOTE[i] + 0.05) / 0.3);
    if (k <= 0.01) return;
    const y = 120 + i * 134;
    c.save(); c.translate(60, y + 56); c.scale(k, k); c.translate(-60, -(y + 56));
    c.fillStyle = "#F1ECE1"; c.beginPath(); c.arc(80, y + 56, 46, 0, 7); c.fill();
    c.fillStyle = INK; c.font = font(32); c.textAlign = "center"; c.fillText("DU", 80, y + 58); c.textAlign = "left";
    c.fillStyle = "#F1ECE1"; roundRect(c, 148, y + 8, 240, 96, 30); c.fill();
    c.fillStyle = OPT_COL[i]; c.font = font(68); c.fillText(o.key, 236, y + 60);
    c.fillStyle = "#9A9286"; fitFont(c, `${o.title} ${o.sub}`, 28, 440); c.fillText(`${o.title} ${o.sub}`, 410, y + 58);
    c.restore();
  });
};
// screens inside the dioramas (fictional, no real brand UI)
const drawInflu = (c: CanvasRenderingContext2D) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, 360, 640);
  c.fillStyle = INK; c.font = font(30); c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("lena.ki", 30, 46);
  c.fillStyle = "#FDE7F1"; c.fillRect(0, 80, 360, 300);
  c.fillStyle = "#F2C6A0"; c.fillRect(130, 150, 100, 110);
  c.fillStyle = "#7A3E8E"; c.fillRect(118, 130, 124, 40); c.fillRect(118, 130, 26, 150); c.fillRect(216, 130, 26, 150);
  c.fillStyle = INK; c.fillRect(152, 196, 14, 18); c.fillRect(194, 196, 14, 18);
  c.fillStyle = OPT_COL[0]; c.fillRect(110, 270, 140, 110);
  c.fillStyle = OPT_COL[0]; c.font = font(44); c.fillText("♥ ♥ ♥", 30, 430);
  c.fillStyle = "#8A857D"; c.font = font(28); c.fillText("online · 24/7", 30, 486);
  c.fillStyle = "#F1ECE1"; roundRect(c, 24, 530, 312, 76, 22); c.fill();
  c.fillStyle = INK; c.font = font(28); c.textAlign = "center"; c.fillText("Folgen", 180, 568); c.textAlign = "left";
};
const drawYt = (c: CanvasRenderingContext2D, t: number) => {
  c.fillStyle = "#15131A"; c.fillRect(0, 0, 640, 400);
  const k = (t * 0.25) % 1;
  c.fillStyle = "#2B2833"; c.fillRect(0, 0, 640, 360);
  for (let i = 0; i < 8; i++) { c.fillStyle = ["#3D3A6B", "#5B4A9A", "#2E6B8F"][i % 3]; c.fillRect(((i * 120 + t * 80) % 760) - 120, 80 + (i % 3) * 70, 100, 50); }
  c.fillStyle = RED; roundRect(c, 250, 130, 140, 100, 26); c.fill();
  c.fillStyle = "#FFFFFF"; c.beginPath(); c.moveTo(300, 155); c.lineTo(350, 180); c.lineTo(300, 205); c.closePath(); c.fill();
  c.fillStyle = "#555"; c.fillRect(0, 360, 640, 10); c.fillStyle = RED; c.fillRect(0, 360, 640 * k, 10);
  c.fillStyle = "#FFFFFF"; c.font = font(28); c.textBaseline = "middle"; c.textAlign = "left";
  c.fillText("Folge 1 · ohne Gesicht", 20, 386);
};
const drawOutfit = (c: CanvasRenderingContext2D, t: number) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, 360, 640);
  c.fillStyle = INK; c.font = font(32); c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("OUTFIT-CHECK", 30, 50);
  c.fillStyle = "#EAF2FC"; c.fillRect(30, 90, 300, 330);
  c.fillStyle = "#F2C6A0"; c.fillRect(150, 120, 60, 60);
  c.fillStyle = OPT_COL[2]; c.fillRect(126, 186, 108, 120);
  c.fillStyle = "#2B2833"; c.fillRect(132, 306, 40, 100); c.fillRect(188, 306, 40, 100);
  const sy = 90 + ((t * 1.4) % 1) * 320;
  c.fillStyle = "rgba(76,155,232,.45)"; c.fillRect(30, sy, 300, 10);
  const score = Math.min(8.7, Math.max(0, (t - T.app) * 6));
  c.fillStyle = OPT_COL[2]; c.font = font(84); c.textAlign = "center"; c.fillText(score.toFixed(1).replace(".", ","), 180, 500);
  c.fillStyle = GOLD; c.font = font(40); c.fillText("★★★★☆", 180, 580); c.textAlign = "left";
};

// ---------- 3D pieces ----------
type Tex = Record<string, THREE.Texture>;
const Island: React.FC<{ p: V3; r: number; t: number; glow?: number; col?: string; vis?: number; top?: string; side?: string; deco?: boolean }> = ({ p, r, t, glow = 0, col, vis = 1, top = "#7FC46A", side = "#8C5E3C", deco = true }) => {
  if (vis <= 0.001) return null;
  const bob = Math.sin(t * 1.3 + p[0] + p[2]) * 0.06;
  return (
    <group position={[p[0], p[1] + bob, p[2]]} scale={vis}>
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[r, r - 0.15, 0.45, 10]} />
        <meshStandardMaterial color={top} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0, -0.75, 0]} castShadow>
        <cylinderGeometry args={[r - 0.12, r * 0.45, 1.5, 10]} />
        <meshStandardMaterial color={side} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, -1.85, 0]}>
        <coneGeometry args={[r * 0.45, 1.0, 10]} />
        <meshStandardMaterial color={side} roughness={0.9} flatShading />
      </mesh>
      {deco && Array.from({ length: 10 }).map((_, i) => {
        const a = rnd(i + r * 7) * Math.PI * 2, d = r * (0.62 + rnd(i + 3) * 0.3);
        return (
          <group key={i} position={[Math.cos(a) * d, 0.45, Math.sin(a) * d]} rotation={[0, 0, Math.sin(t * 2.2 + i) * 0.18]}>
            <ToyBox p={[0, 0.08, 0]} s={[0.16, 0.16 + rnd(i) * 0.14, 0.16]} color={i % 3 === 0 ? ["#FFD34D", "#FF7FA8", "#FFFFFF"][i % 3] : "#5FA84E"} />
          </group>
        );
      })}
      {col && glow > 0.01 && (
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r + 0.1, r + 0.1 + 0.5 * glow, 40]} />
          <meshBasicMaterial color={col} transparent opacity={0.85 * glow} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

const Burst3D: React.FC<{ at: number; t: number; p: V3; colors: string[]; n?: number; power?: number; floor?: number }> = ({ at, t, p, colors, n = 10, power = 1, floor = 0.45 }) => {
  const k = t - at;
  if (k < 0 || k > 1.0) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + rnd(i + at) * 0.6;
        const v = (1.4 + rnd(i * 3 + at) * 1.6) * power;
        const up = 2.5 + rnd(i * 7 + at) * 2.5;
        const s = 0.14 * (1 - k) + 0.03;
        return (
          <mesh key={i} position={[p[0] + Math.cos(a) * v * k, Math.max(floor, p[1] + up * k - 6 * k * k), p[2] + Math.sin(a) * v * k]} rotation={[k * 9 + i, k * 7, 0]}>
            <boxGeometry args={[s, s, s]} />
            <meshBasicMaterial color={colors[i % colors.length]} toneMapped={false} />
          </mesh>
        );
      })}
    </>
  );
};

const Board: React.FC<{ p: V3; tex: THREE.Texture; w: number; h: number; t: number; q: THREE.Quaternion; at?: number; until?: number; bob?: number; tilt?: number }> = ({ p, tex, w, h, t, q, at: a = -99, until = 999, bob = 0.06, tilt = 0 }) => {
  const s = back((t - a) / 0.35) * (1 - ease((t - until) / 0.25));
  if (s <= 0.001) return null;
  return (
    <group position={[p[0], p[1] + Math.sin(t * 2.4 + p[0] + p[2]) * bob, p[2]]} quaternion={q}>
      <group rotation={[0, 0, tilt]} scale={[s, s, s]}>
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
};

// the Superkind agent: rounded orange block, white eyes, antenna with a glowing ball, little arms.
// The rival ("Agent 2") is the same build in dark violet with red eyes.
type Palette = { body: string; dark: string; feet: string; eye: string; pupil: string | null; ball: string };
const HERO: Palette = { body: OR, dark: OR_D, feet: "#2C2420", eye: "#FFFFFF", pupil: "#2C2420", ball: GOLD };
const RIVAL: Palette = { body: "#2A2338", dark: "#1A1524", feet: "#0E0B14", eye: EVIL, pupil: null, ball: EVIL };
const Agent: React.FC<{ p: V3; yaw?: number; t: number; s?: number; seed?: number; pal?: Palette; vis?: number; armL?: number; armR?: number; squash?: number; sleep?: boolean; carry?: string; talk?: boolean; glow?: number; tilt?: number }> = ({ p, yaw = 0, t, s = 1, seed = 0, pal = HERO, vis = 1, armL = 15, armR = 15, squash = 0, sleep, carry, talk, glow = 0, tilt = 0 }) => {
  if (vis <= 0.001) return null;
  const bob = sleep ? 0 : Math.abs(Math.sin(t * 4.4 + seed)) * 0.1;
  const blink = sleep || (t * 1.2 + seed * 0.37) % 3.1 < 0.09;
  const sc = s * vis;
  const sy = 1 - 0.25 * squash, sx = 1 + 0.18 * squash;
  const eyeMat = pal.pupil ? <meshBasicMaterial color={pal.eye} toneMapped={false} /> : <meshBasicMaterial color={pal.eye} toneMapped={false} />;
  const arm = (side: -1 | 1, deg: number) => (
    <group position={[side * 0.72, 0.95 + (carry ? 0.2 : 0), 0.05]} rotation={[0, 0, (side * (carry ? 150 : deg) * Math.PI) / 180]}>
      <mesh castShadow position={[0, -0.22, 0]}>
        <boxGeometry args={[0.24, 0.5, 0.26]} />
        <meshStandardMaterial color={pal.dark} roughness={0.6} />
      </mesh>
    </group>
  );
  return (
    <group position={[p[0], p[1] + bob, p[2]]} rotation={[0, yaw, tilt]} scale={[sc * sx, sc * sy, sc]}>
      {[-0.28, 0.28].map((x, i) => (
        <mesh key={x} castShadow position={[x, 0.16 + (sleep ? 0 : Math.sin(t * 9 + seed + i * 3) * 0.04), 0]}>
          <boxGeometry args={[0.26, 0.32, 0.3]} />
          <meshStandardMaterial color={pal.feet} />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 0.98, 0]}>
        <boxGeometry args={[1.28, 1.3, 1.08]} />
        <meshStandardMaterial color={pal.body} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.3, 0.14, 1.1]} />
        <meshStandardMaterial color={pal.dark} roughness={0.6} />
      </mesh>
      {[-0.29, 0.29].map((x) => (
        <group key={x} position={[x, 1.12, 0.545]}>
          <mesh><boxGeometry args={[0.34, blink ? 0.05 : pal.pupil ? 0.36 : 0.2 + 0.06 * glow, 0.03]} />{eyeMat}</mesh>
          {!blink && pal.pupil && <mesh position={[0.05, -0.04, 0.02]}><boxGeometry args={[0.15, 0.19, 0.02]} /><meshBasicMaterial color={pal.pupil} /></mesh>}
        </group>
      ))}
      <mesh position={[0, 0.72, 0.545]}>
        <boxGeometry args={[0.34, talk ? 0.05 + 0.07 * Math.abs(Math.sin(t * 14 + seed)) : 0.06, 0.03]} />
        <meshBasicMaterial color={pal.pupil ? "#9C4A31" : "#0E0B14"} />
      </mesh>
      <mesh position={[0, 1.83, 0]} castShadow><boxGeometry args={[0.08, 0.42, 0.08]} /><meshStandardMaterial color={pal.feet} /></mesh>
      <mesh position={[0, 2.08, 0]} castShadow><boxGeometry args={[0.22, 0.22, 0.22]} /><meshStandardMaterial color={pal.ball} emissive={pal.ball} emissiveIntensity={sleep ? 0.05 : 0.35 + 0.35 * Math.max(0, Math.sin(t * 6 + seed)) + glow} /></mesh>
      {arm(-1, armL)}
      {arm(1, armR)}
      {carry && <ToyBox p={[0, 2.0, 0.1]} s={[0.8, 0.5, 0.6]} color={carry} />}
      {glow > 0.01 && <pointLight position={[0, 1.1, 1.0]} intensity={6 * glow} distance={5} color={pal.eye} />}
    </group>
  );
};

const Keycap: React.FC<{ p: V3; tex: THREE.Texture; col: string; t: number; a: number; press: number }> = ({ p, tex, col, t, a: a0, press }) => {
  const s = back((t - a0) / 0.35) * (1 - ease((t - T.tag + 0.3) / 0.3));
  if (s <= 0.001) return null;
  const pr = bump(t, press, 0.12);
  return (
    <group position={[p[0], p[1] + Math.sin(t * 3 + p[0]) * 0.08, p[2]]} scale={s} rotation={[0.35, 0, 0]}>
      <ToyBox p={[0, -0.32, 0]} s={[1.25, 0.3, 1.25]} color="#2A2430" />
      <group position={[0, -0.12 * pr, 0]}>
        <ToyBox p={[0, 0, 0]} s={[1.05, 0.5, 1.05]} color={col} />
        <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.0, 1.0]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
      </group>
    </group>
  );
};

const Screen: React.FC<{ p: V3; w: number; h: number; tex: THREE.Texture; rot?: V3 }> = ({ p, w, h, tex, rot = [0, 0, 0] }) => (
  <group position={p} rotation={rot}>
    <ToyBox p={[0, 0, -0.1]} s={[w + 0.2, h + 0.2, 0.16]} color="#2A2430" />
    <mesh><planeGeometry args={[w, h]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
  </group>
);

// swaying voxel tree
const Tree: React.FC<{ p: V3; t: number; s?: number; seed?: number; night: number }> = ({ p, t, s = 1, seed = 0, night }) => (
  <group position={p} scale={s} rotation={[Math.sin(t * 1.1 + seed) * 0.04, 0, Math.sin(t * 1.6 + seed) * 0.07]}>
    <ToyBox p={[0, 0.45, 0]} s={[0.24, 0.9, 0.24]} color="#7A5434" />
    <ToyBox p={[0, 1.15, 0]} s={[0.95, 0.7, 0.95]} color={night > 0.6 ? "#2F5E3A" : "#4E9E45"} />
    <ToyBox p={[0, 1.7, 0]} s={[0.62, 0.5, 0.62]} color={night > 0.6 ? "#3A6E44" : "#63B856"} />
  </group>
);

// construction crane that swings and lifts blocks while the HQ is built
const Crane: React.FC<{ p: V3; t: number }> = ({ p, t }) => {
  const building = t > T.abend - 0.6 && t < T.nullplan + 0.4;
  const rot = building ? Math.sin((t - T.abend) * 3.2) * 0.9 : 0.5 * Math.sin(t * 0.5) - 0.4;
  const trolley = 1.6 + 1.0 * (0.5 + 0.5 * Math.sin(t * (building ? 2.4 : 0.8)));
  const cable = 1.6 + 0.9 * (0.5 + 0.5 * Math.sin(t * (building ? 3.0 : 1.1) + 1));
  return (
    <group position={p}>
      <ToyBox p={[0, 3.0, 0]} s={[0.22, 6.0, 0.22]} color={GOLD} />
      {[0.8, 1.8, 2.8, 3.8, 4.8].map((y) => <ToyBox key={y} p={[0, y, 0]} s={[0.3, 0.06, 0.3]} color="#C99A1E" />)}
      <group position={[0, 6.05, 0]} rotation={[0, rot, 0]}>
        <ToyBox p={[0, 0.15, 0]} s={[0.5, 0.4, 0.5]} color="#2A2430" />
        <ToyBox p={[1.7, 0.4, 0]} s={[3.6, 0.16, 0.16]} color={GOLD} />
        <ToyBox p={[-0.8, 0.4, 0]} s={[1.2, 0.16, 0.16]} color={GOLD} />
        <ToyBox p={[-1.25, 0.15, 0]} s={[0.4, 0.4, 0.4]} color="#6E6A75" />
        <group position={[trolley, 0.3, 0]}>
          <ToyBox p={[0, -cable / 2, 0]} s={[0.03, cable, 0.03]} color="#2A2430" />
          <ToyBox p={[0, -cable - 0.12, 0]} s={[0.44, 0.3, 0.36]} color={building ? "#FFFFFF" : OR} />
        </group>
      </group>
    </group>
  );
};

// dioramas for the three internet businesses
const InfluSet: React.FC<{ p: V3; t: number; vis: number; tex: THREE.Texture }> = ({ p, t, vis, tex }) => (
  <group position={[p[0], 0.45, p[2]]} scale={vis}>
    <group position={[-0.7, 1.45, -0.2]} rotation={[-0.05, 0.25 + Math.sin(t * 1.4) * 0.06, 0]}>
      <ToyBox p={[0, 0, -0.08]} s={[1.5, 2.65, 0.14]} color="#1E1A22" />
      <mesh><planeGeometry args={[1.32, 2.36]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
    </group>
    <group position={[1.1, 0, 0.1]}>
      <ToyBox p={[0, 0.9, 0]} s={[0.1, 1.8, 0.1]} color="#2A2430" />
      <mesh position={[0, 2.0, 0]} rotation={[0, -0.4, 0]}><torusGeometry args={[0.5, 0.08, 10, 28]} /><meshBasicMaterial color="#FFF6D8" toneMapped={false} /></mesh>
    </group>
    {Array.from({ length: 5 }).map((_, i) => { const k = (t * 0.6 + i / 5) % 1; return <mesh key={i} position={[-0.7 + Math.sin(i * 2 + k * 6) * 0.6, 2.6 + k * 2.2, 0.1]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.22 * (1 - k * 0.5), 0.22 * (1 - k * 0.5), 0.08]} /><meshBasicMaterial color={OPT_COL[0]} transparent opacity={1 - k} toneMapped={false} /></mesh>; })}
    <group position={[1.3, 3.1, -0.6]} rotation={[0, 0, Math.sin(t) * 0.3]}>
      <mesh><sphereGeometry args={[0.32, 16, 16]} /><meshBasicMaterial color="#FFF2B0" toneMapped={false} /></mesh>
      <mesh position={[0.16, 0.08, 0.05]}><sphereGeometry args={[0.28, 16, 16]} /><meshBasicMaterial color="#5C4A8C" /></mesh>
    </group>
  </group>
);
const YtSet: React.FC<{ p: V3; t: number; vis: number; tex: THREE.Texture }> = ({ p, t, vis, tex }) => (
  <group position={[p[0], 0.45, p[2]]} scale={vis}>
    <group position={[0.2, 1.5, -0.6]}>
      <ToyBox p={[0, 0, -0.1]} s={[2.5, 1.6, 0.14]} color="#1E1A22" />
      <mesh><planeGeometry args={[2.36, 1.48]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
      <ToyBox p={[0, -0.95, -0.1]} s={[0.2, 0.5, 0.14]} color="#1E1A22" />
    </group>
    <group position={[-1.4, 0, 0.8]} scale={0.5}>
      <BlockBuddy p={[0, 0.58, 0]} yaw={0.5} color="#9AA3B5" dark="#6B7385" t={t} seed={3} />
      <ToyBox p={[0, 1.95, 0]} s={[1.45, 1.25, 1.2]} color="#C9A57A" top="#D9B88E" rot={[0, 0.5 + Math.sin(t * 3) * 0.1, 0]} />
    </group>
    <group position={[-0.5, 0, 1.1]} rotation={[Math.sin(t * 2) * 0.08, 0, 0]}>
      <ToyBox p={[0, 0.5, 0]} s={[0.06, 1.0, 0.06]} color="#2A2430" />
      <mesh position={[0, 1.1, 0]}><capsuleGeometry args={[0.13, 0.22, 6, 12]} /><meshStandardMaterial color="#3A3440" /></mesh>
    </group>
  </group>
);
const OutfitSet: React.FC<{ p: V3; t: number; vis: number; tex: THREE.Texture }> = ({ p, t, vis, tex }) => (
  <group position={[p[0], 0.45, p[2]]} scale={vis}>
    <group position={[0.8, 1.45, -0.3]} rotation={[-0.05, -0.25 + Math.sin(t * 1.4) * 0.06, 0]}>
      <ToyBox p={[0, 0, -0.08]} s={[1.5, 2.65, 0.14]} color="#1E1A22" />
      <mesh><planeGeometry args={[1.32, 2.36]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
    </group>
    <group position={[-1.2, 0, 0.2]}>
      <ToyBox p={[-0.7, 0.8, 0]} s={[0.08, 1.6, 0.08]} color="#2A2430" />
      <ToyBox p={[0.7, 0.8, 0]} s={[0.08, 1.6, 0.08]} color="#2A2430" />
      <ToyBox p={[0, 1.6, 0]} s={[1.5, 0.08, 0.08]} color="#2A2430" />
      {["#4C9BE8", "#FFD34D", "#E0559A"].map((col, i) => (
        <group key={i} position={[-0.45 + i * 0.45, 1.25, 0]} rotation={[0, 0, Math.sin(t * 3 + i) * 0.16]}>
          <ToyBox p={[0, 0, 0]} s={[0.38, 0.55, 0.12]} color={col} />
        </group>
      ))}
    </group>
  </group>
);

// HQ building: floors drop in, windows light up in the evening, smoke from the roof
const Building: React.FC<{ t: number; tex: Tex; ev: number; floors: number[]; pal: "hq" | "rival"; signAt: number; logoAt?: number }> = ({ t, tex, ev, floors, pal, signAt, logoAt }) => {
  const fl = floors.map((b) => cl((t - b) / 0.3));
  const sign = back((t - signAt + 0.05) / 0.35);
  const logo = logoAt === undefined ? 0 : back((t - logoAt + 0.05) / 0.4);
  const wall = pal === "hq" ? ["#FFFFFF", "#FFF6EA", "#FFFFFF"] : ["#3A3150", "#332B47", "#3A3150"];
  const win = pal === "hq" ? "#FFD27A" : EVIL;
  const roof = pal === "hq" ? OR : "#1A1524";
  return (
    <group>
      <ToyBox p={[0, 0.08, 0]} s={[3.4, 0.16, 2.6]} color={pal === "hq" ? "#B9B2A6" : "#2A2338"} />
      {[0, 1, 2].map((i) => fl[i] > 0 && (
        <group key={i} position={[0, 0.16 + 0.55 + i * 1.1 + (1 - ease(fl[i])) * 5, 0]}>
          <ToyBox p={[0, 0, 0]} s={[3.0, 1.1, 2.2]} color={wall[i]} />
          {[-1.0, 0, 1.0].map((x, j) => {
            const lit = pal === "rival" ? 1 : cl(ev * 3 - rnd(i * 3 + j) * 2);
            return <ToyBox key={x} p={[x, 0.05, 1.11]} s={[0.6, 0.55, 0.04]} color={pal === "hq" ? "#BFE3F2" : "#1A1524"} emissive={win} ei={0.05 + lit * (0.9 + 0.15 * Math.sin(t * 3 + x + i))} />;
          })}
        </group>
      ))}
      {fl[3] > 0 && (
        <mesh position={[0, 3.66 + 0.6 + (1 - ease(fl[3])) * 5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.3, 1.2, 4]} />
          <meshStandardMaterial color={roof} roughness={0.6} flatShading />
        </mesh>
      )}
      {sign > 0.01 && (
        <group position={[0, 2.9, 1.2]} scale={sign}>
          <ToyBox p={[0, 0, -0.04]} s={[2.6, 0.62, 0.08]} color={INK} />
          <mesh position={[0, 0, 0.01]}><planeGeometry args={[2.5, 0.54]} /><meshBasicMaterial map={pal === "hq" ? tex.nameSign : tex.nameSignEvil} toneMapped={false} /></mesh>
        </group>
      )}
      {logo > 0.01 && (
        <group position={[0, 5.55, 0]} rotation={[0, t * 1.6, 0]} scale={logo}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.75, 0.75, 0.18, 32]} />
            <meshStandardMaterial attach="material-0" color={OR_D} />
            <meshBasicMaterial attach="material-1" map={tex.logo} toneMapped={false} />
            <meshBasicMaterial attach="material-2" map={tex.logo} toneMapped={false} />
          </mesh>
        </group>
      )}
      {/* chimney smoke once the roof is on */}
      {fl[3] >= 1 && (
        <group position={[-0.9, 4.3, -0.5]}>
          <ToyBox p={[0, 0, 0]} s={[0.3, 0.6, 0.3]} color={pal === "hq" ? "#8C5E3C" : "#1A1524"} />
          {Array.from({ length: 5 }).map((_, i) => {
            const k = (t * 0.45 + i / 5) % 1;
            return <mesh key={i} position={[Math.sin(k * 5 + i) * 0.2 + k * 0.6, 0.4 + k * 2.4, 0]} scale={0.18 + k * 0.35}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={pal === "hq" ? "#F4F1EC" : "#4A3F63"} transparent opacity={0.75 * (1 - k)} /></mesh>;
          })}
        </group>
      )}
    </group>
  );
};

// 20 helpers: pop out of the monitor, bustle around the HQ, carry blocks to the building, fall asleep at night
const SUBS = Array.from({ length: 20 }, (_, i) => {
  const a = (i / 20) * Math.PI * 2 + rnd(i) * 0.3;
  const r = 2.4 + rnd(i + 5) * 1.4;
  return { home: [HQ[0] + Math.cos(a) * r, 0.45, HQ[2] + Math.sin(a) * r * 0.8] as V3, seed: i * 1.7, delay: i * 0.035 };
});
const subAt = (i: number, t: number): { p: V3; yaw: number; carry?: string; vis: number; sleep?: boolean } => {
  const s = SUBS[i];
  const k = (t - SPAWN - s.delay) / 0.55;
  if (k < 0) return { p: MON, yaw: 0, vis: 0 };
  if (k < 1) { const p = bez3([MON[0], MON[1], MON[2] + 0.3], [(MON[0] + s.home[0]) / 2, 4.5, (MON[2] + s.home[2]) / 2 + 1], s.home, ease(k)); return { p, yaw: k * 6, vis: 1 }; }
  if (t > T.doch + 0.3 + rnd(i) * 0.6) return { p: s.home, yaw: Math.cos(s.seed) * 1.2, vis: 1, sleep: true };
  if (t > T.abend - 1.0 && t < T.nullplan + 0.4 && i % 2 === 0) {
    const ph = ((t - T.abend + 1.0) * 0.9 + rnd(i)) % 1;
    const tgt: V3 = [BLD[0] + (rnd(i + 2) - 0.5) * 2.4, 0.45, BLD[2] + 1.6];
    const p = lerp3(s.home, tgt, ph < 0.5 ? ease(ph * 2) : 1 - ease((ph - 0.5) * 2));
    return { p, yaw: Math.atan2(tgt[0] - s.home[0], tgt[2] - s.home[2]) + (ph < 0.5 ? 0 : Math.PI), carry: ph < 0.5 ? ["#FFFFFF", OR, GOLD][i % 3] : undefined, vis: 1 };
  }
  const w = t * (0.5 + rnd(i) * 0.5) + s.seed;
  const p: V3 = [s.home[0] + Math.sin(w) * 0.6, 0.45 + Math.max(0, Math.sin(t * 6 + s.seed)) * 0.25, s.home[2] + Math.cos(w * 0.8) * 0.5];
  return { p, yaw: Math.cos(w) * 1.2, vis: 1 };
};

// ---------- the world ----------
const World: React.FC<{ t: number; tex: Tex; dyn: Record<string, THREE.Texture> }> = ({ t, tex, dyn }) => {
  const cam = camAt(t);
  const punch = Math.max(0, ...PUNCH.map((p) => bump(t, p, 0.22)));
  const q = React.useMemo(() => new THREE.Quaternion(), []);
  const flat = React.useMemo(() => new THREE.Quaternion(), []);
  q.setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(...cam.pos), new THREE.Vector3(...cam.look), new THREE.Vector3(0, 1, 0)));
  const lightTarget = React.useMemo(() => new THREE.Object3D(), []);
  lightTarget.position.set(cam.look[0], 0, cam.look[2]);
  lightTarget.updateMatrixWorld();
  const night = nightAt(t), ev = eveningAt(t);
  const sky = keysC(t, SKY);
  const sunK = keys(t, [[0, 0.15], [T.abend - 0.3, 0.45], [T.abend + 0.9, 0.95], [T.drei + 1.0, 1.2]]);
  const moonK = keys(t, [[0, 0], [T.doch, 0], [MIDNIGHT + 0.5, 1]]);

  // hero route
  type K = { a: number; b: number; p: V3; yaw: number };
  const KEYS: K[] = [
    { a: 0, b: T.tag - 0.2, p: [-1.2, 0.45, 7.4], yaw: 0.2 },
    { a: T.tag + 0.15, b: T.durch - 0.3, p: [-0.2, 0.45, 7.8], yaw: 0.6 },
    { a: T.durch + 0.3, b: T.abend - 0.5, p: [4.4, 0.45, -1.4], yaw: 0.6 },
    { a: T.abend - 0.1, b: T.drei - 0.1, p: [-3.2, 0.45, 7.6], yaw: 0.35 },
    ...ISL.map((p, i): K => ({ a: OPT_T[i] + 0.15, b: OPT_END[i] - 0.15, p: add(p, [i === 1 ? 2.0 : -2.0, 0.45, -0.4]), yaw: i === 1 ? -0.5 : 0.5 })),
    { a: T.komm + 0.2, b: T.doch, p: [2.8, 0.45, 8.2], yaw: -0.3 },
    { a: T.doch + 0.4, b: T.agent2, p: [0.2, 0.45, 9.2], yaw: Math.PI - 0.5 },
    { a: T.folg, b: 99, p: [-2.6, 0.45, 6.6], yaw: -1.9 },
  ];
  let cp: V3 = KEYS[0].p, cyaw = 0, hop = 0;
  for (let i = 0; i < KEYS.length; i++) {
    const k = KEYS[i];
    if (t <= k.b) {
      if (t >= k.a || i === 0) { cp = k.p; cyaw = k.yaw; }
      else { const pr = KEYS[i - 1]; const kk = inOut((t - pr.b) / (k.a - pr.b)); const pp = lerp3(pr.p, k.p, kk); hop = Math.sin(kk * Math.PI); cp = [pp[0], pp[1] + hop * 3, pp[2]]; cyaw = pr.yaw + (k.yaw - pr.yaw) * kk; }
      break;
    }
  }
  const drop = t < T.agent + 0.4 ? (1 - ease((t - T.agent + 0.25) / 0.45)) * 9 : 0;
  const land = bump(t, T.agent + 0.2, 0.18);
  const camD = Math.hypot(cam.pos[0] - cp[0], cam.pos[1] - cp[1], cam.pos[2] - cp[2]);
  const optVis = (i: number) => back((t - T.drei - 0.1 - i * 0.15) / 0.4);
  const resVis = back((t - T.durch + 0.6) / 0.5);
  const rivVis = ease((t - T.agent2 + 0.2) / 0.7);
  const rivGlow = cl((t - T.agent2 - 0.5) / 0.3) * (0.7 + 0.3 * Math.sin(t * 7));
  const look = cam.look;
  const heroArmR = t > T.folg + 0.6 ? 150 + 15 * Math.sin(t * 6) : 15;
  return (
    <>
      <CameraRig pos={cam.pos} look={look} fov={48 - 3 * punch} />
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 30, 78]} />
      <ambientLight intensity={keys(t, [[0, 0.85], [T.abend + 0.9, 0.7], [T.drei + 1, 0.55], [MIDNIGHT, 0.55]])} color={keysC(t, [[0, "#FFFFFF"], [T.abend + 0.9, "#FFE1CF"], [T.drei + 1, "#C9BBFF"], [MIDNIGHT, "#8E95FF"]])} />
      <hemisphereLight args={[keysC(t, [[0, "#DDF2FF"], [T.abend + 0.9, "#FFC9A6"], [MIDNIGHT, "#4C4A9A"]]), "#3A2E5A", keys(t, [[0, 0.8], [MIDNIGHT, 0.5]])]} />
      <primitive object={lightTarget} />
      <directionalLight position={[look[0] + 6, 16, look[2] + 9]} target={lightTarget} intensity={keys(t, [[0, 1.9], [T.abend + 0.9, 1.6], [T.drei + 1, 1.1], [MIDNIGHT, 0.75]])} color={keysC(t, [[0, "#FFF2DC"], [T.abend + 0.9, "#FFB27A"], [T.drei + 1, "#C2B0FF"], [MIDNIGHT, "#8C9BFF"]])} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-camera-far={60} shadow-bias={-0.0015} shadow-normalBias={0.04} />

      {/* sun and moon */}
      {sunK < 1.15 && (
        <mesh position={[-34 + sunK * 64, 6 + Math.sin(Math.min(1, sunK) * Math.PI) * 20, -62]}>
          <sphereGeometry args={[4.2, 24, 24]} />
          <meshBasicMaterial color={keysC(t, [[0, "#FFF4C2"], [T.abend + 0.9, "#FF8A4C"]])} fog={false} toneMapped={false} transparent opacity={1 - cl((sunK - 1.0) / 0.15)} />
        </mesh>
      )}
      {moonK > 0.01 && (
        <group position={[-26 + moonK * 10, 4 + moonK * 18, -62]}>
          <mesh><sphereGeometry args={[3.2, 24, 24]} /><meshBasicMaterial color="#F4F1FF" fog={false} toneMapped={false} /></mesh>
          <mesh position={[1.3, 0.6, 1]}><sphereGeometry args={[2.9, 24, 24]} /><meshBasicMaterial color={sky} fog={false} /></mesh>
        </group>
      )}
      {/* stars only at night */}
      {night > 0.05 && Array.from({ length: 90 }).map((_, i) => (
        <mesh key={i} position={[(rnd(i) - 0.5) * 80, 2 + rnd(i + 5) * 34, -50 + rnd(i + 9) * 60]}>
          <boxGeometry args={[0.14, 0.14, 0.14]} />
          <meshBasicMaterial color={i % 7 === 0 ? GOLD : "#FFFFFF"} transparent opacity={night * (0.3 + 0.7 * Math.abs(Math.sin(t * 2 + i)))} toneMapped={false} fog={false} />
        </mesh>
      ))}
      {/* drifting clouds above and a cloud sea below the islands */}
      {Array.from({ length: 12 }).map((_, i) => {
        const span = 70, x = ((rnd(i + 70) * span + t * (0.5 + rnd(i) * 0.6)) % span) - span / 2;
        const low = i % 3 === 0;
        const y = low ? -4.5 + rnd(i + 71) : 7 + rnd(i + 71) * 6 + Math.sin(t * 0.7 + i) * 0.3;
        const col = keysC(t, [[0, "#FFFFFF"], [T.abend + 0.9, "#FFD3C2"], [T.drei + 1, "#8C79B8"], [MIDNIGHT, "#3B3366"]]);
        return (
          <group key={i} position={[x, y, -34 + rnd(i + 72) * 40]} scale={1 + rnd(i + 3) * 0.8}>
            {[0, 1, 2, 3].map((j) => <mesh key={j} position={[j * 0.95 - 1.4, j === 1 || j === 2 ? 0.35 + Math.sin(t * 1.3 + i + j) * 0.08 : 0, (j % 2) * 0.3]}><boxGeometry args={[1.3, 0.9, 1.0]} /><meshStandardMaterial color={col} flatShading transparent opacity={0.92} /></mesh>)}
          </group>
        );
      })}
      {/* birds during the day */}
      {night < 0.3 && Array.from({ length: 6 }).map((_, i) => {
        const x = ((t * 2.2 + i * 2.3) % 40) - 20, flap = Math.sin(t * 12 + i) * 0.6;
        return (
          <group key={i} position={[x, 9 + (i % 3) * 0.7 + Math.sin(t * 2 + i) * 0.3, -6 - (i % 2) * 3]} rotation={[0, Math.PI / 2, 0]}>
            <mesh position={[0.18, 0, 0]} rotation={[0, 0, flap]}><boxGeometry args={[0.36, 0.04, 0.14]} /><meshBasicMaterial color="#3A3440" /></mesh>
            <mesh position={[-0.18, 0, 0]} rotation={[0, 0, -flap]}><boxGeometry args={[0.36, 0.04, 0.14]} /><meshBasicMaterial color="#3A3440" /></mesh>
          </group>
        );
      })}
      {/* Superkind drones circling the world */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = t * 0.45 + (i / 8) * Math.PI * 2;
        const R = 9 + (i % 3) * 1.5;
        const p: V3 = [Math.cos(a) * R, 8.5 + Math.sin(t * 2 + i) * 0.6 + (i % 2) * 1.2, -5 + Math.sin(a) * R * 1.1];
        return <Agent key={i} p={p} yaw={-a} t={t} s={0.3} seed={i} tilt={0.25} armL={140} armR={140} />;
      })}
      {/* data packets flying from the portal to the HQ */}
      {t > T.durch && t < T.doch && Array.from({ length: 12 }).map((_, i) => {
        const k = (t * 0.55 + i / 12) % 1;
        const p = bez3(add(PORTAL, [0, 0, 0.3]), [4, 6.5, 2], [BLD[0], 2.5, BLD[2]], k);
        return <mesh key={i} position={p}><boxGeometry args={[0.16, 0.16, 0.16]} /><meshBasicMaterial color={[OR, "#9BE7FF", GOLD][i % 3]} toneMapped={false} /></mesh>;
      })}

      {/* ---- HQ island ---- */}
      <Island p={HQ} r={HQR} t={t} />
      <group position={BLD}>
        {/* hook: a ghost of the finished "day 100" tower */}
        {t < T.tag + 0.6 && [0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[0, 0.8 + i * 1.25, -0.4]} scale={[1 - i * 0.08, 1, 1 - i * 0.08]}>
            <boxGeometry args={[3.0, 1.15, 2.2]} />
            <meshBasicMaterial color={OR} wireframe transparent opacity={(0.35 + 0.2 * Math.sin(t * 6 + i)) * (1 - ease((t - T.tag) / 0.6))} toneMapped={false} />
          </mesh>
        ))}
        <Building t={t} tex={tex} ev={ev} floors={BUILD} pal="hq" signAt={T.nullplan} logoAt={T.logo} />
        <pointLight position={[0, 2, 2.5]} intensity={3 * bump(t, T.nullplan, 0.5) + 2.5 * ev} distance={8} color="#FFB48A" />
      </group>
      <Crane p={[3.3, 0.45, 1.6]} t={t} />
      {[[-3.3, 0.45, 3.0], [3.6, 0.45, 4.2], [-0.9, 0.45, 1.4], [-3.9, 0.45, 6.0]].map((p, i) => <Tree key={i} p={p as V3} t={t} seed={i * 2} s={0.8 + rnd(i) * 0.3} night={night} />)}
      <group position={[MON[0], 0.45, MON[2] + 0.2]}>
        <ToyBox p={[0, 0.68, 0]} s={[3.2, 0.14, 1.0]} color="#A87A52" top="#C59368" />
        {[[-1.45, -0.4], [1.45, -0.4], [-1.45, 0.4], [1.45, 0.4]].map(([x, z], i) => <ToyBox key={i} p={[x, 0.32, z]} s={[0.14, 0.62, 0.14]} color="#7A5434" />)}
        <ToyBox p={[0, 0.8, 0.25]} s={[1.1, 0.06, 0.36]} color="#3A3340" />
        <mesh position={[1.25, 0.92, 0.2]} castShadow><cylinderGeometry args={[0.13, 0.11, 0.3, 12]} /><meshStandardMaterial color={OR} /></mesh>
        {/* steam from the coffee */}
        {Array.from({ length: 3 }).map((_, i) => { const k = (t * 0.6 + i / 3) % 1; return <mesh key={i} position={[1.25 + Math.sin(k * 6 + i) * 0.06, 1.1 + k * 0.6, 0.2]} scale={0.06 + k * 0.08}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.6 * (1 - k)} /></mesh>; })}
      </group>
      <group position={MON}>
        <ToyBox p={[0, 0, -0.1]} s={[3.0, 2.0, 0.16]} color="#2A2430" />
        <mesh><planeGeometry args={[2.8, 1.85]} /><meshBasicMaterial map={dyn.mon} toneMapped={false} /></mesh>
        <ToyBox p={[0, -1.2, -0.15]} s={[0.24, 0.5, 0.2]} color="#2A2430" />
        <pointLight position={[0, 0, 1.2]} intensity={2.2 * night + (t > T.mail ? 3 * bump(t, T.ich + 0.1, 0.3) : 0)} distance={6} color={t > T.mail ? "#FFD0D0" : "#FFFFFF"} />
      </group>
      {/* website billboard */}
      <group position={BILL} rotation={[0, 0.3, 0]}>
        <ToyBox p={[0, 0, -0.1]} s={[2.7, 1.75, 0.16]} color="#2A2430" />
        <mesh><planeGeometry args={[2.56, 1.62]} /><meshBasicMaterial map={dyn.site} toneMapped={false} /></mesh>
        {[-1.0, 1.0].map((x) => <ToyBox key={x} p={[x, -1.5, -0.12]} s={[0.16, 1.3, 0.16]} color="#2A2430" />)}
      </group>
      {/* hook boards */}
      <Board p={[0, 5.2, 8.6]} tex={tex.whatif} w={3.6} h={0.86} t={t} q={q} until={T.hundert - 0.1} tilt={-0.04} />
      <Board p={[0, 5.2, 8.6]} tex={tex.days} w={2.6} h={0.84} t={t} q={q} at={T.hundert - 0.05} until={T.allein - 0.1} tilt={0.05} />
      <Board p={[0, 5.2, 8.6]} tex={tex.sign} w={3.0} h={0.7} t={t} q={q} at={T.allein - 0.05} until={T.ziel - 0.1} tilt={-0.04} />
      <Board p={[0, 5.2, 8.6]} tex={tex.goal} w={3.4} h={0.82} t={t} q={q} at={T.ziel - 0.05} until={T.aber} tilt={0.04} />
      {EP.options.map((o, i) => (
        <Keycap key={o.key} p={[-1.8 + i * 1.8, 4.0 + (i === 1 ? 0.35 : 0), 9.4]} tex={tex[`key${i}`]} col={OPT_COL[i]} t={t} a={T.aber + 0.1 + i * 0.16} press={T.du + i * 0.06} />
      ))}
      <Burst3D at={T.agent + 0.2} t={t} p={[-1.2, 0.6, 7.4]} colors={[OR, "#FFFFFF", GOLD]} n={12} />
      <Board p={[2.4, 4.05, 7.3]} tex={tex.zero} w={1.9} h={0.62} t={t} q={q} at={T.null - 0.05} until={T.holt - 0.1} tilt={0.06} />
      {/* helpers */}
      {SUBS.map((_, i) => { const s = subAt(i, t); return <Agent key={i} p={s.p} yaw={s.yaw} t={t} s={0.38} seed={i * 1.3} vis={s.vis} carry={s.carry} sleep={s.sleep} />; })}
      {t > T.doch + 0.6 && [0, 5, 10, 15].map((i, j) => {
        const k = (t * 0.5 + j * 0.25) % 1;
        return <Board key={i} p={add(SUBS[i].home, [0.2 + k * 0.4, 1.3 + k * 1.2, 0])} tex={tex.zzz} w={0.4 * (0.6 + k)} h={0.4 * (0.6 + k)} t={t} q={q} bob={0} />;
      })}
      <Burst3D at={SPAWN} t={t} p={[MON[0], MON[1], MON[2] + 0.5]} colors={[OR, "#FFFFFF", GOLD]} n={12} power={1.2} floor={0.5} />
      <Board p={[0.4, 4.6, 7.4]} tex={tex.team} w={2.4} h={0.66} t={t} q={q} at={SPAWN + 0.3} until={T.durch - 0.1} tilt={-0.05} />
      <Board p={[-3.2, 3.3, 7.6]} tex={tex.qmark} w={1.0} h={1.0} t={t} q={q} at={T.geschaeft - 0.1} until={T.drei + 0.1} bob={0.15} />

      {/* ---- research island with the internet portal ---- */}
      <Island p={RES} r={3.4} t={t} vis={resVis} top="#8E7FE0" />
      {resVis > 0.01 && (
        <group>
          <group position={PORTAL} scale={resVis}>
            <mesh rotation={[0, 0, t * 0.8]}><torusGeometry args={[1.55, 0.2, 12, 40]} /><meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={0.6} /></mesh>
            <mesh rotation={[0, 0, -t * 1.4]}><torusGeometry args={[1.2, 0.06, 8, 40]} /><meshBasicMaterial color="#9BE7FF" toneMapped={false} /></mesh>
            <mesh><circleGeometry args={[1.38, 40]} /><meshBasicMaterial color="#2B1D6B" transparent opacity={0.85} /></mesh>
            {Array.from({ length: 14 }).map((_, i) => { const a = (i / 14) * Math.PI * 2 + t * 2; const r = 1.3 * ((t * 0.8 + i * 0.13) % 1); return <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0.05]}><boxGeometry args={[0.1, 0.1, 0.02]} /><meshBasicMaterial color={i % 2 ? "#9BE7FF" : GOLD} toneMapped={false} /></mesh>; })}
            <ToyBox p={[0, -2.15, 0]} s={[2.6, 0.3, 0.8]} color="#3D2F7A" />
            <Board p={[0, 2.25, 0]} tex={tex.www} w={1.7} h={0.5} t={t} q={flat} bob={0.05} />
          </group>
          {/* windmill-style antenna dish turning */}
          <group position={add(RES, [-1.6, 0.45, -1.4])} scale={resVis}>
            <ToyBox p={[0, 0.9, 0]} s={[0.16, 1.8, 0.16]} color="#2A2430" />
            <group position={[0, 1.9, 0.12]} rotation={[0, 0, t * 2.2]}>
              {[0, 1, 2, 3].map((j) => <ToyBox key={j} p={[Math.cos((j * Math.PI) / 2) * 0.45, Math.sin((j * Math.PI) / 2) * 0.45, 0]} s={[0.8, 0.16, 0.04]} rot={[0, 0, (j * Math.PI) / 2]} color={j % 2 ? "#FFFFFF" : PURPLE} />)}
            </group>
          </group>
          <group scale={resVis}>
            <Screen p={RBOARD} w={2.6} h={2.02} tex={dyn.research} rot={[-0.08, 0.25, 0]} />
          </group>
          {Array.from({ length: 6 }).map((_, i) => {
            const k = (t * 0.7 + i / 6) % 1;
            const inward = k < 0.5;
            const kk = inward ? k * 2 : (k - 0.5) * 2;
            const from: V3 = [RES[0] - 1.6 + (i % 3) * 0.6, 0.45, RES[2] + 2.0];
            const to: V3 = [PORTAL[0], 0.45, PORTAL[2] + 0.4];
            const p = inward ? lerp3(from, to, kk) : lerp3(to, from, kk);
            const vis = (inward ? 1 - ease((kk - 0.8) / 0.2) : ease(kk / 0.2)) * resVis;
            return <Agent key={i} p={p} yaw={inward ? Math.atan2(to[0] - from[0], to[2] - from[2]) : Math.atan2(from[0] - to[0], from[2] - to[2])} t={t} s={0.34} seed={i + 40} vis={vis} carry={inward ? undefined : [PURPLE, GOLD, "#9BE7FF"][i % 3]} />;
          })}
          {["cVideo", "cApps", "cShops", "cNews"].map((key, i) => {
            const a0 = T.internet + 0.2 + i * 0.3;
            const k = cl((t - a0) / 0.6);
            if (k <= 0 || k >= 1) return null;
            const p = bez3(PORTAL, [6.9, 5.0, -2.6], add(RBOARD, [0, 0.4 - i * 0.2, 0.3]), ease(k));
            return <Board key={key} p={p} tex={tex[key]} w={1.5 * (1 - k * 0.5)} h={0.42 * (1 - k * 0.5)} t={t} q={q} bob={0} />;
          })}
        </group>
      )}

      {/* ---- the three options (only in the last third) ---- */}
      {ISL.map((p, i) => {
        const v = optVis(i);
        const active = t > OPT_T[i] - 0.1 && t < OPT_END[i];
        const voteGlow = t > T.komm ? 0.4 + 0.6 * bump(t, VOTE[i] + 0.2, 0.5) : active ? 0.6 + 0.4 * Math.sin(t * 6) : 0;
        const revealed = t > OPT_T[i] - 0.15;
        return (
          <group key={i}>
            <Island p={p} r={IR} t={t} vis={v} glow={voteGlow} col={OPT_COL[i]} />
            {!revealed && v > 0.01 && <Board p={add(p, [0, 2.2, 0])} tex={tex.qmark} w={1.4 * v} h={1.4 * v} t={t} q={q} bob={0.2} />}
            {revealed && i === 0 && <InfluSet p={p} t={t} vis={back((t - OPT_T[0] + 0.1) / 0.4)} tex={dyn.influ} />}
            {revealed && i === 1 && <YtSet p={p} t={t} vis={back((t - OPT_T[1] + 0.1) / 0.4)} tex={dyn.yt} />}
            {revealed && i === 2 && <OutfitSet p={p} t={t} vis={back((t - OPT_T[2] + 0.1) / 0.4)} tex={dyn.outfit} />}
            {revealed && v > 0.01 && <Board p={add(p, [0, t > T.komm ? 5.4 : 5.0, -0.3])} tex={tex[`key${i}`]} w={t > T.komm ? 2.1 : 1.3} h={t > T.komm ? 2.1 : 1.3} t={t} q={q} bob={0.12} />}
            <Board p={add(p, [i === 1 ? -0.5 : 0.5, 3.35, 0.6])} tex={dyn[`stat${i}`]} w={3.0} h={1.85} t={t} q={q} at={OPT_T[i] + 0.3} until={OPT_END[i] - 0.1} bob={0.04} tilt={i === 1 ? 0.03 : -0.03} />
            <Burst3D at={VOTE[i]} t={t} p={add(p, [0, 1.5, 0])} colors={[OPT_COL[i], "#FFFFFF"]} n={8} power={1.2} />
          </group>
        );
      })}
      <Board p={add(ISL[0], [0.4, 1.35, 1.3])} tex={tex.never} w={2.0} h={0.52} t={t} q={q} at={T.schlaeft - 0.05} until={OPT_END[0] - 0.1} tilt={-0.05} />
      <Board p={add(ISL[1], [-0.3, 1.35, 1.3])} tex={tex.noface} w={2.1} h={0.52} t={t} q={q} at={T.gesicht - 0.05} until={OPT_END[1] - 0.1} tilt={0.05} />
      <Board p={add(ISL[2], [0.3, 1.35, 1.3])} tex={tex.score} w={2.0} h={0.52} t={t} q={q} at={T.bewertet - 0.05} until={OPT_END[2] - 0.1} tilt={-0.05} />
      {ISL.map((p, i) => optVis(i) > 0.01 && (
        <group key={i} position={add(p, [i === 1 ? -2.0 : 2.0, 0.45, -0.9])} scale={0.42 * optVis(i)}>
          <BlockBuddy p={[0, 0.58, 0]} yaw={i === 1 ? 0.5 : -0.5} color={["#5E8FE0", "#F0C04C", "#5CC08A"][i]} dark={["#3E62A8", "#B88D24", "#3A8A60"][i]} t={t} seed={i * 2} accessory={(["cap", "bolt", "headband"] as const)[i]} accent="#FFFFFF" />
        </group>
      ))}
      {/* vote */}
      <Board p={[0, 9.6, 6.6]} tex={dyn.votes} w={2.9} h={1.8} t={t} q={q} at={T.komm - 0.1} until={T.morgen - 0.15} bob={0.04} />
      <Board p={[0, 9.6, 6.6]} tex={tex.tomorrow} w={3.3} h={0.78} t={t} q={q} at={T.morgen - 0.1} until={T.doch - 0.1} tilt={0.03} />

      {/* ---- the cliffhanger: Agent 2 on its own dark island ---- */}
      {rivVis > 0.01 && (
        <group position={[0, (1 - rivVis) * -8, 0]}>
          <Island p={RIV} r={3.0} t={t} top="#3B3352" side="#241D33" deco={false} glow={rivGlow * 0.8} col={EVIL} />
          <group position={add(RIV, [-0.5, 0.45, -1.1])}>
            <Building t={t} tex={tex} ev={1} floors={RBUILD} pal="rival" signAt={T.dieselbe + 0.7} />
            <pointLight position={[0, 2.5, 2.2]} intensity={4 * cl((t - T.dieselbe) / 0.5)} distance={7} color={EVIL} />
          </group>
          <Agent p={add(RIV, [0.9, 0.45, 1.3])} yaw={keys(t, [[T.agent2 + 0.3, Math.PI], [T.agent2 + 0.8, 0.45]])} t={t} s={0.95} seed={9} pal={RIVAL} glow={rivGlow} armR={t > T.dieselbe ? 40 : 15} />
        </group>
      )}
      <Board p={add(RIV, [-1.4, 3.4, 2.0])} tex={tex.agent2} w={2.0} h={0.56} t={t} q={q} at={T.agent2 + 0.55} until={T.folg + 0.2} tilt={-0.05} />
      <Board p={[-3.2, 6.4, 3.2]} tex={tex.tbc} w={5.2} h={1.24} t={t} q={q} at={T.anderen + 0.3} tilt={0.02} bob={0.03} />

      {/* the hero */}
      <Agent p={[cp[0], cp[1] + drop, cp[2]]} yaw={cyaw} t={t} s={0.85} squash={land} armL={hop > 0.2 ? 140 : 15} armR={hop > 0.2 ? 140 : (t > T.tag && t < T.holt) ? 150 + 15 * Math.sin(t * 8) : heroArmR} talk={t > T.tag && t < T.holt} vis={cl((camD - 2.4) / 1.5)} />
    </>
  );
};

// ---------- textures ----------
const useStaticTex = (ready: boolean) =>
  React.useMemo(() => {
    if (!ready) return null;
    const t: Tex = {};
    EP.options.forEach((o, i) => { t[`key${i}`] = keyTex(o.key, OPT_COL[i]); });
    t.whatif = pillTex("WAS WÄRE, WENN …?", OR, "#FFFFFF", 900, 214);
    t.days = pillTex("100 TAGE", GOLD, INK, 620, 200);
    t.sign = pillTex("FIRMA: ???", "#FFFFFF", INK, 820, 190);
    t.goal = pillTex("ZIEL: 1.000.000 €", GOLD, INK, 900, 214);
    t.zero = pillTex("KASSE: 0 €", RED, "#FFFFFF", 620, 200);
    t.team = pillTex("+20 HELFER", GREEN, "#FFFFFF", 700, 190);
    t.www = pillTex("INTERNET", PURPLE, "#FFFFFF", 620, 180);
    t.cVideo = pillTex("▶ VIDEOS", RED, "#FFFFFF", 560, 160);
    t.cApps = pillTex("▣ APPS", "#4C9BE8", "#FFFFFF", 560, 160);
    t.cShops = pillTex("● SHOPS", GREEN, "#FFFFFF", 560, 160);
    t.cNews = pillTex("✉ NEWSLETTER", GOLD, INK, 560, 160);
    t.never = pillTex("SCHLÄFT NIE", "#E0559A", "#FFFFFF", 700, 180);
    t.noface = pillTex("0 GESICHTER", RED, "#FFFFFF", 700, 180);
    t.score = pillTex("★ 8,7 / 10", "#4C9BE8", "#FFFFFF", 700, 180);
    t.agent2 = pillTex("AGENT 2", EVIL, "#FFFFFF", 640, 180);
    t.zzz = canvasTex(128, 128, (c) => { c.fillStyle = "#FFFFFF"; c.font = font(96); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("z", 64, 64); });
    t.nameSign = canvasTex(1000, 216, (c) => { c.fillStyle = INK; c.fillRect(0, 0, 1000, 216); logoMark(c, 110, 108, 70); c.fillStyle = "#FFFFFF"; c.font = font(120); c.textBaseline = "middle"; c.fillText(EP.name, 210, 116); });
    t.nameSignEvil = canvasTex(1000, 216, (c) => { c.fillStyle = "#0E0B14"; c.fillRect(0, 0, 1000, 216); logoMark(c, 110, 108, 70, EVIL); c.fillStyle = EVIL; c.font = font(120); c.textBaseline = "middle"; c.fillText(EP.name, 210, 116); });
    t.logo = canvasTex(256, 256, (c) => { c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, 256, 256); logoMark(c, 128, 128, 110); });
    t.qmark = canvasTex(256, 256, (c) => { c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(128, 128, 118, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 10; c.stroke(); c.fillStyle = INK; c.font = font(170); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("?", 128, 140); });
    const darkBoard = (top: string, main: string, topCol: string) => canvasTex(1100, 260, (c) => {
      c.fillStyle = "rgba(0,0,0,.35)"; roundRect(c, 8, 16, 1092, 244, 50); c.fill();
      c.fillStyle = INK; roundRect(c, 0, 0, 1092, 244, 50); c.fill();
      c.strokeStyle = topCol; c.lineWidth = 8; roundRect(c, 4, 4, 1084, 236, 46); c.stroke();
      c.fillStyle = topCol; c.font = font(46); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(top, 546, 74);
      c.fillStyle = "#FFFFFF"; fitFont(c, main, 70, 1000); c.fillText(main, 546, 162);
    });
    t.tomorrow = darkBoard(`MORGEN · TAG ${EP.day + 1}`, "Der Gewinner wird gebaut", GOLD);
    t.tbc = darkBoard(`TAG ${EP.day + 1}`, "Fortsetzung folgt …", EVIL);
    return t;
  }, [ready]);

const useDynTex = (t: number, logo: HTMLImageElement | null) => {
  const mon = useDyn(MW, MH, (c) => drawMonitor(c, t, logo));
  const research = useDyn(RW, RH, (c) => drawResearch(c, t));
  const site = useDyn(BW, BH, (c) => drawSite(c, t));
  const stat0 = useDyn(760, 470, (c) => drawStat(c, t, 0));
  const stat1 = useDyn(760, 470, (c) => drawStat(c, t, 1));
  const stat2 = useDyn(760, 470, (c) => drawStat(c, t, 2));
  const votes = useDyn(900, 560, (c) => drawVotes(c, t));
  const influ = useDyn(360, 640, (c) => drawInflu(c));
  const yt = useDyn(640, 400, (c) => drawYt(c, t));
  const outfit = useDyn(360, 640, (c) => drawOutfit(c, t));
  return { mon, research, site, stat0, stat1, stat2, votes, influ, yt, outfit };
};

// ---------- 2D game HUD ----------
const Hud: React.FC<{ t: number }> = ({ t }) => {
  const k = ease((t - 0.1) / 0.4);
  const cashPulse = 1 + 0.25 * bump(t, T.null + 0.1, 0.3);
  const team = t < SPAWN ? 1 : Math.min(21, 1 + Math.floor((t - SPAWN) / 0.035));
  const teamPulse = 1 + 0.3 * bump(t, SPAWN + 0.4, 0.4);
  const day = t > MIDNIGHT ? EP.day + 1 : EP.day;
  const dayPulse = 1 + 0.35 * bump(t, MIDNIGHT + 0.05, 0.35);
  const night = nightAt(t);
  const clockPulse = 1 + 0.2 * Math.max(bump(t, T.abend + 0.1, 0.3), bump(t, MIDNIGHT, 0.3));
  const goalPulse = 1 + 0.12 * bump(t, T.million + 0.15, 0.35);
  const chip = (children: React.ReactNode, border = "rgba(255,255,255,.18)") => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(20,16,36,.82)", border: `4px solid ${border}`, borderRadius: 24, padding: "9px 18px", boxShadow: "0 6px 0 rgba(0,0,0,.4)" }}>{children}</div>
  );
  const txt: React.CSSProperties = { fontFamily: pixelFont, fontWeight: 800, fontSize: 36, color: "#FFFFFF", lineHeight: 1, display: "inline-block" };
  return (
    <div style={{ position: "absolute", top: 92, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: k, transform: `translateY(${(1 - k) * -30}px)` }}>
      <div style={{ display: "flex", gap: 10 }}>
        {chip(<span style={{ ...txt, color: GOLD, transform: `scale(${dayPulse})` }}>TAG {day}<span style={{ color: "rgba(255,255,255,.55)", fontSize: 26 }}> / 100</span></span>)}
        {chip(<><span style={{ ...txt, fontSize: 30 }}>{night > 0.5 ? "☾" : "☀"}</span><span style={{ ...txt, transform: `scale(${clockPulse})`, color: t > T.doch ? "#FF9AA0" : "#FFFFFF" }}>{hhmm(clockAt(t))}</span></>, t > T.doch ? "rgba(255,46,58,.6)" : undefined)}
        {chip(<><div style={{ width: 30, height: 30, borderRadius: 15, background: GOLD, border: "4px solid #B88D24" }} /><span style={{ ...txt, transform: `scale(${cashPulse})`, color: bump(t, T.null + 0.1, 0.4) > 0 ? "#FF8A8D" : "#FFFFFF" }}>{EP.cash} €</span></>)}
        {chip(<span style={{ ...txt, transform: `scale(${teamPulse})`, color: teamPulse > 1.05 ? "#8FF0B0" : "#FFFFFF" }}>TEAM {team}</span>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: OR, padding: "7px 18px", borderRadius: 14, border: "3px solid rgba(0,0,0,.45)", transform: `scale(${goalPulse})` }}>
        <Img src={staticFile("superkind-logo.svg")} style={{ width: 30, height: 30, filter: "invert(1)" }} />
        <span style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 26, letterSpacing: 1, color: "#FFFFFF" }}>SUPERKIND BAUT EINE FIRMA · ZIEL 1 MIO €</span>
      </div>
    </div>
  );
};

// ---------- audio ----------
type Sfx = [string, number, number];
const TRANSITS = HOLDS.slice(0, -1).map((h) => h.b);
const SFX: Sfx[] = [
  ...TRANSITS.map((c): Sfx => ["whoosh-quick", c - 0.02, 0.38]),
  ["riser", T.agent - 0.5, 0.16], ["bump", T.agent + 0.2, 0.5], ["jump", T.agent + 0.25, 0.25],
  ["coin", T.hundert, 0.28], ["ui-pop", T.allein, 0.32], ["coin", T.million, 0.35],
  ...[0, 1, 2].map((i): Sfx => ["ui-pop", T.aber + 0.1 + i * 0.16, 0.38]), ["click", T.du, 0.6],
  ["typing", T.tag, 0.22], ["stamp", T.null, 0.35],
  ...Array.from({ length: 6 }, (_, i): Sfx => ["ui-pop", T.holt + i * 0.12, 0.16]),
  ["click", SPAWN - 0.15, 0.6], ["powerup", SPAWN, 0.28],
  ...Array.from({ length: 8 }, (_, i): Sfx => ["jump", SPAWN + 0.2 + i * 0.07, 0.11]),
  ["typing", T.durch + 0.2, 0.2], ["click", T.internet - 0.1, 0.5], ["chime", T.internet, 0.28],
  ...Array.from({ length: 5 }, (_, i): Sfx => ["check", T.internet + 0.35 + i * 0.3, 0.18]),
  ...BUILD.map((b): Sfx => ["bump", b + 0.3, 0.38]),
  ["stamp", T.nullplan, 0.42], ["powerup", T.logo, 0.28], ["ui-pop", T.website, 0.42],
  ["bump", T.geschaeft, 0.3],
  ...[0, 1, 2].map((i): Sfx => ["ui-pop", T.drei + 0.1 + i * 0.15, 0.32]),
  ...[0, 1, 2].map((i): Sfx => ["powerup", OPT_T[i], 0.22]),
  ...[0, 1, 2].flatMap((i): Sfx[] => [0, 1, 2].map((r): Sfx => ["check", OPT_T[i] + 0.6 + r * 0.25, 0.16])),
  ["stamp", T.schlaeft, 0.28], ["stamp", T.gesicht, 0.28], ["coin", T.bewertet, 0.28],
  ["ui-pop", T.komm - 0.1, 0.38], ...VOTE.map((v): Sfx => ["ui-pop", v, 0.42]), ["chime", T.morgen, 0.28],
  // night / cliffhanger
  ["riser", T.doch - 0.2, 0.2], ["chime", MIDNIGHT, 0.35], ["ui-pop", T.mail, 0.45], ["typing", T.ich, 0.25], ["stamp", T.ich + 0.75, 0.4],
  ["bump", T.zweiter, 0.5], ["riser", T.agent2 - 0.4, 0.22], ["stamp", T.agent2 + 0.55, 0.55],
  ...RBUILD.map((b): Sfx => ["bump", b + 0.25, 0.35]), ["stamp", T.dieselbe + 0.7, 0.45],
  ["bump", T.anderen + 0.3, 0.5],
];

export const SuperkindFirmaDay1: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ready = useFontsReady([`800 40px ${pixelFont}`, `40px ${F_B}`, `40px ${F_M}`, `40px ${F_S}`]);
  const logo = useImage(staticFile("superkind-logo.svg"));
  const tex = useStaticTex(ready);
  const dyn = useDynTex(t, logo);
  const a = camAt(t - 0.03).pos, b = camAt(t + 0.03).pos;
  const speed = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 0.06;
  const blur = Math.min(3.5, Math.max(0, (speed - 8) * 0.12));
  const flash = 0.25 * bump(t, T.agent + 0.2, 0.1) + 0.2 * bump(t, SPAWN, 0.08);
  const redFlash = 0.18 * bump(t, T.agent2 + 0.55, 0.12);
  const night = nightAt(t);
  return (
    <AbsoluteFill style={{ background: "#120E22" }}>
      {tex && (
        <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
          <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
            <World t={t} tex={tex} dyn={dyn} />
          </ThreeCanvas>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(8,4,20,${0.25 + 0.35 * night}) 100%)` }} />
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
      <AbsoluteFill style={{ background: EVIL, opacity: redFlash }} />
      <Hud t={t} />
      <PillCaptions words={WD} theme={THEMES.night} />
      <Audio src={staticFile("cbf1/voice3.mp3")} />
      <Audio src={staticFile("sirtoken/music.mp3")} loop volume={(f) => keys(f / 30, [[0, 0.085], [T.doch - 0.3, 0.085], [T.doch + 0.6, 0.03], [T.anderen, 0.03], [T.anderen + 1.2, 0.07]])} />
      {SFX.map(([n, s, v], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s * 30))} durationInFrames={90}>
          <Audio src={staticFile(`sirtoken/sfx-${n}.mp3`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
