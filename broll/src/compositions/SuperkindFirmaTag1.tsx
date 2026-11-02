// "Ein Superkind-Agent baut eine Firma", Tag 1 (v6, 2026-10-21). One thread, Pier-9 structure.
// v6: the pitch must not feel like an ending, so the order is flipped: search → two ideas stay hidden → anonymous mail
// warns against "the influencer" → nobody can know the ideas → only now the pitch (A, B) → "someone doesn't want you to pick A"
// → red eyes → A or B? → hard cut to the eyes on "Sonst entscheiden die anderen" → black. No resting beat, no outro board.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BlockBuddy, CameraRig, ToyBox, canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, THEMES, Word, pixelFont } from "../components/PixelKit";
import words from "../../public/cbf1/words6.json";
import { EPISODES, SHOP } from "./superkindEconomy";

export const SK_TAG1_SECONDS = 43.9;
const W = 1080, H = 1920;
type V3 = [number, number, number];
const OR = "#FF6B35", OR_D = "#E5521F", INK = "#16130F", MUTED = "#8A857D", GOLD = "#F5C542", RED = "#E5484D", GREEN = "#1F9D55", PURPLE = "#8B6CF0", EVIL = "#FF2E3A";
const F_B = "Inter-Bold", F_S = "Inter-SemiBold", F_M = "Inter-Medium";
const OPT_COL = ["#E0559A", "#E5484D"];
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
  day: 1, cash: EPISODES[0].cashStart,
  options: [
    { key: "A", title: "KI-Influencerin", sub: "die nie schläft", risk: EPISODES[0].options[0].risk, pot: EPISODES[0].options[0].pot },
    { key: "B", title: "YouTube-Kanal", sub: "ohne Gesicht", risk: EPISODES[0].options[1].risk, pot: EPISODES[0].options[1].pot },
  ],
};
const eur = (v: number) => `${Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;

// ---------- key times ----------
const T = {
  agent: at("Superkind"), hundert: at("hundert"), mit: at("Mit", 4), nullE: at("null"), bis: at("Bis"), million: at("Million"), regel: at("Regel"), entscheiden: at("Entscheiden", 7.5), du: at("du.", 9.5),
  tag: at("Tag", 10), geld: at("Geld"), produkt: at("Produkt"), ahnung: at("Ahnung"),
  also: at("Also"), hilfe: at("Hilfe"), zwanzig: at("Zwanzig"), helfer: at("Helfer"),
  durch: at("durchsuchen"), internet: at("Internet"), stunde: at("Stunde"), stunde2: at("Stunde.", 18),
  kurz: at("Kurz"), zwei: at("zwei", 19),
  da: at("Da", 22), mail: at("Mail"), absender: at("Absender"), satz: at("Nur", 24), bau: at("Bau", 25), influ2: at("Influencerin.", 26),
  welche: at("Welche"), niemand: at("niemand"), niemand2: at("Niemand", 30), agenten: at("Agenten"), hier: at("Hier"),
  va: at("A:", 32), schlaeft: at("schläft"), vb: at("B:", 35), yt: at("YouTube"), gesicht: at("Gesicht"),
  und: at("Und", 37.5), irgendwer: at("irgendwer"), waehlst: at("wählst"),
  ab: at("A", 40.3), bq: at("B?", 40.8), folg: at("Folg"), sonst: at("Sonst"), anderen: at("anderen"),
};
const SPAWN = T.helfer + 0.05;
const VOTE = [T.ab, T.bq];
const MIDNIGHT = T.folg + 0.35;
const EYES = T.irgendwer + 0.15;
const BLACK = T.anderen + 0.58;
// money counter: hook previews the goal (rolls up to 1 Mio on "Bis zur Million"), crashes back to the real 0 € on "Regel"
const GOAL_UP = [T.million - 0.05, T.million + 0.9], GOAL_DOWN = [T.regel + 0.1, T.regel + 0.6];
const cashAt = (t: number) => t < GOAL_UP[0] ? EP.cash : t < GOAL_DOWN[0] ? 1e6 * Math.pow(ease((t - GOAL_UP[0]) / (GOAL_UP[1] - GOAL_UP[0])), 3) : 1e6 * (1 - ease((t - GOAL_DOWN[0]) / (GOAL_DOWN[1] - GOAL_DOWN[0])));
const goalMode = (t: number) => t > GOAL_UP[0] && t < GOAL_DOWN[1]; // hard cut to black, the episode just stops
// light: day → sunset during the search → night by "kurz vor Mitternacht"
const EVE = T.stunde2 + 0.6, DUSKT = T.kurz + 0.4, NIGHTT = T.da + 0.6;

// ---------- day → night (the whole episode is one day) ----------
const DAY = "#8FD3F4", SUNSET = "#F2A07A", DUSK = "#5C4A8C", NIGHT = "#120E22";
const SKY: [number, string][] = [[0, DAY], [T.stunde - 0.3, DAY], [EVE, SUNSET], [DUSKT, DUSK], [NIGHTT, NIGHT]];
const nightAt = (t: number) => keys(t, [[0, 0], [T.stunde2, 0], [DUSKT, 0.45], [NIGHTT, 1]]);
const clockAt = (t: number) => {
  if (t < T.tag) return 7 * 60 + 59;
  if (t < T.kurz) return 8 * 60 + Math.pow((t - T.tag) / (T.kurz - T.tag), 1.4) * (15 * 60 + 51);
  if (t < MIDNIGHT) return 23 * 60 + 51 + ((t - T.kurz) / (MIDNIGHT - T.kurz)) * 9;
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
const ISL: V3[] = [[-3.6, 0, -10.5], [3.6, 0, -15]];
const IR = 2.9;
const OPT_T = [T.va, T.vb];
const OPT_END = [T.vb - 0.1, T.und - 0.1];
const HERO_HOOK: V3 = [-1.2, 0.45, 7.4];
const HERO_DESK: V3 = [0.2, 0.45, 9.6];
const RIV_AG: V3 = add(RIV, [0.2, 0.45, 0.6]);
const HERO_B: V3 = add(ISL[1], [2.0, 0.45, -0.4]);

// ---------- camera ----------
type Hold = { a: number; b: number; p0: V3; p1: V3; l0: V3; l1: V3 };
const optHold = (i: number): Hold => ({ a: OPT_T[i] - 0.05, b: OPT_END[i] - 0.25, p0: add(ISL[i], [0.5 * (i === 1 ? -1 : 1), 6.0, 10.6]), p1: add(ISL[i], [0, 5.6, 9.7]), l0: add(ISL[i], [0, 2.7, -0.6]), l1: add(ISL[i], [0, 2.6, -0.6]) });
const HOLDS: Hold[] = [
  { a: 0, b: T.regel - 0.3, p0: [0, 6.4, 18.4], p1: [0, 7.4, 19.8], l0: [0, 2.6, 4.4], l1: [0, 2.7, 4.2] },
  { a: T.regel + 0.15, b: T.tag - 0.2, p0: add(HERO_HOOK, [0.7, 2.6, 6.8]), p1: add(HERO_HOOK, [0.6, 2.4, 6.0]), l0: add(HERO_HOOK, [0.2, 1.5, 0]), l1: add(HERO_HOOK, [0.2, 1.5, 0]) },
  { a: T.tag + 0.15, b: T.also - 0.15, p0: [-0.3, 5.4, 15.4], p1: [-0.1, 5.0, 14.4], l0: [0.3, 2.0, 4.6], l1: [0.3, 2.0, 4.6] },
  { a: T.also + 0.15, b: SPAWN + 0.45, p0: [2.4, 3.0, 13.3], p1: [2.4, 2.9, 12.6], l0: MON, l1: MON },
  { a: T.durch + 0.35, b: T.da - 0.15, p0: [5.0, 5.7, 9.6], p1: [5.1, 5.4, 8.6], l0: [5.7, 2.5, -3.4], l1: [5.8, 2.6, -3.4] },
  { a: T.da + 0.35, b: T.welche - 0.15, p0: [2.4, 3.1, 13.6], p1: [2.4, 2.85, 12.3], l0: MON, l1: MON },
  { a: T.welche + 0.25, b: T.hier - 0.1, p0: add(HERO_DESK, [0.7, 2.5, 6.4]), p1: add(HERO_DESK, [0.5, 2.3, 5.4]), l0: add(HERO_DESK, [0.3, 1.5, 0]), l1: add(HERO_DESK, [0.3, 1.5, 0]) },
  optHold(0), optHold(1),
  { a: T.und + 0.25, b: T.ab - 0.45, p0: [-1.0, 3.4, 12.5], p1: [-3.8, 2.6, 7.4], l0: [-5, 1.5, 3], l1: add(RIV, [0, 1.3, 0]) },
  { a: T.ab - 0.1, b: T.sonst - 0.03, p0: [0, 13.4, 10.6], p1: [0, 12.9, 9.8], l0: [0, 0.6, -12.5], l1: [0, 0.6, -13] },
  // hard cut (a == previous b): straight into the red eyes
  { a: T.sonst - 0.03, b: 60, p0: add(RIV_AG, [2.3, 1.5, 3.8]), p1: add(RIV_AG, [1.7, 1.3, 2.8]), l0: add(RIV_AG, [0, 1.25, 0]), l1: add(RIV_AG, [0, 1.3, 0]) },
];
const VIA: { pos: V3; look: V3 }[] = [
  { pos: [-0.3, 4.5, 15], look: [-0.6, 2, 6.5] },
  { pos: [-0.6, 3.6, 13], look: [-0.4, 1.6, 6] },
  { pos: [1.6, 4.2, 14.5], look: [1.8, 2.0, 6.2] },
  { pos: [5.5, 9, 10], look: [6, 2, -1] },
  { pos: [4.5, 5.0, 12.5], look: [3, 2.3, 3] },
  { pos: [1.8, 3.2, 15], look: [1.5, 2.2, 8] },
  { pos: [-0.5, 12, 9], look: [0, 1, -10] },
  { pos: [0, 8.5, -5], look: [3.6, 1.5, -15] },
  { pos: [-0.5, 8, 4], look: [-4, 1.5, -1] },
  { pos: [-2.5, 9, 6], look: [-1, 1, -6] },
  { pos: [0, 0, 0], look: [0, 0, 0] },
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
const PUNCH = [T.agent, T.du, T.geld, SPAWN, T.mail, T.bau, T.agenten, ...OPT_T, EYES, ...VOTE, MIDNIGHT];

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
const botFace = (c: CanvasRenderingContext2D, x: number, y: number, s: number) => {
  c.fillStyle = INK; c.fillRect(x - s * 0.04, y - s * 0.95, s * 0.08, s * 0.3);
  c.fillStyle = GOLD; c.fillRect(x - s * 0.1, y - s * 1.05, s * 0.2, s * 0.2);
  c.fillStyle = OR; roundRect(c, x - s * 0.6, y - s * 0.65, s * 1.2, s * 1.2, s * 0.18); c.fill();
  c.fillStyle = "#FFFFFF"; c.fillRect(x - s * 0.4, y - s * 0.35, s * 0.28, s * 0.32); c.fillRect(x + s * 0.12, y - s * 0.35, s * 0.28, s * 0.32);
  c.fillStyle = INK; c.fillRect(x - s * 0.3, y - s * 0.28, s * 0.13, s * 0.18); c.fillRect(x + s * 0.22, y - s * 0.28, s * 0.13, s * 0.18);
};

// ---------- canvas: Superkind app on the desk monitor ----------
const MW = 1000, MH = 660;
const SUBJ = "Bau nicht die Influencerin.";
const drawMonitor = (c: CanvasRenderingContext2D, t: number, logo: HTMLImageElement | null) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, MW, MH);
  const g = c.createLinearGradient(0, 0, MW, 0); g.addColorStop(0, "#FFF1E8"); g.addColorStop(1, "#FFFFFF");
  c.fillStyle = g; c.fillRect(0, 0, MW, 76);
  c.fillStyle = "#FFDCCB"; c.fillRect(0, 74, MW, 2);
  if (logo) c.drawImage(logo, 26, 20, 36, 36);
  c.fillStyle = INK; c.font = `32px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("superkind", 74, 39);
  c.fillStyle = t > T.da ? RED : MUTED; c.font = `24px ${F_S}`; c.textAlign = "right"; c.fillText(hhmm(clockAt(t)), MW - 30, 39); c.textAlign = "left";

  // night: the anonymous mail
  if (t > T.da + 0.3) {
    c.fillStyle = INK; c.font = `40px ${F_B}`; c.fillText("Posteingang", 40, 132);
    const k = back((t - T.mail + 0.05) / 0.35);
    if (k <= 0.01) { c.fillStyle = MUTED; c.font = `28px ${F_M}`; c.fillText("Keine neuen Nachrichten", 40, 200); return; }
    c.save(); c.translate(0, (1 - k) * 80); c.globalAlpha = cl(k);
    c.fillStyle = "#FFF5F5"; roundRect(c, 30, 176, MW - 60, 300, 26); c.fill();
    c.strokeStyle = t > T.bau ? EVIL : "#F1D6D6"; c.lineWidth = t > T.bau ? 6 : 3; roundRect(c, 30, 176, MW - 60, 300, 26); c.stroke();
    c.fillStyle = "#2A2338"; roundRect(c, 60, 206, 110, 110, 22); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `72px ${F_B}`; c.textAlign = "center"; c.fillText("?", 115, 264); c.textAlign = "left";
    c.fillStyle = MUTED; c.font = `26px ${F_S}`; c.fillText("Von", 200, 226);
    c.fillStyle = INK; c.font = `38px ${F_B}`; c.fillText(t > T.absender - 0.05 ? "Unbekannt" : "…", 200, 270);
    c.fillStyle = EVIL; c.beginPath(); c.arc(MW - 80, 230, 13, 0, 7); c.fill();
    c.fillStyle = MUTED; c.font = `26px ${F_S}`; c.fillText("Nachricht", 60, 370);
    const n = Math.max(0, Math.min(SUBJ.length, Math.floor((t - T.bau + 0.05) * 32)));
    c.fillStyle = n > 0 ? INK : "#C9C3B8"; c.font = `46px ${F_B}`;
    c.fillText(n > 0 ? SUBJ.slice(0, n) + (n < SUBJ.length ? "|" : "") : "Nur ein Satz …", 60, 422);
    if (bump(t, T.bau + 0.9, 0.12) > 0 || bump(t, T.niemand2, 0.1) > 0 || bump(t, T.agenten, 0.1) > 0) { c.fillStyle = "rgba(255,46,58,.22)"; c.fillRect(30, 176 + rnd(Math.floor(t * 30)) * 260, MW - 60, 40); }
    c.restore();
    return;
  }
  if (t < T.also - 0.1) {
    botFace(c, MW / 2, 270, 80);
    c.fillStyle = INK; c.font = `46px ${F_B}`; c.textAlign = "center"; c.fillText("Was bauen wir heute?", MW / 2, 420); c.textAlign = "left";
    return;
  }
  botFace(c, 64, 140, 26);
  c.fillStyle = MUTED; c.font = `20px ${F_S}`; c.fillText("SUPERKIND · AGENT", 106, 122);
  c.fillStyle = INK; c.font = `36px ${F_B}`; c.fillText("Ich hole mir Hilfe.", 106, 160);
  for (let i = 0; i < 20; i++) {
    const k = back((t - T.zwanzig - 0.02 - i * 0.02) / 0.22);
    if (k <= 0.01) continue;
    const col = i % 10, row = Math.floor(i / 10);
    const x = 92 + col * 90, y = 290 + row * 110;
    const gone = t > SPAWN + i * 0.03;
    c.save(); c.translate(x, y); c.scale(k, k);
    c.fillStyle = gone ? "#E6F6EC" : "#FFF6F1"; roundRect(c, -38, -44, 76, 88, 16); c.fill();
    c.strokeStyle = gone ? GREEN : "#FFD9C7"; c.lineWidth = 3; roundRect(c, -38, -44, 76, 88, 16); c.stroke();
    if (!gone) botFace(c, 0, 8, 26);
    else { c.fillStyle = GREEN; c.font = `36px ${F_B}`; c.textAlign = "center"; c.fillText("✓", 0, 2); c.textAlign = "left"; }
    c.restore();
  }
  const press = t > SPAWN - 0.2 && t < SPAWN - 0.05;
  const done = t > SPAWN - 0.1;
  c.fillStyle = done ? GREEN : OR; roundRect(c, 330, 540 + (press ? 3 : 0), 340, 70, 22); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `32px ${F_B}`; c.textAlign = "center"; c.fillText(done ? "✓ 20 Helfer laufen" : "Alle starten", 500, 576 + (press ? 3 : 0)); c.textAlign = "left";
  if (t > T.zwanzig - 0.2 && t < SPAWN + 0.5) {
    const hk = ease((t - T.zwanzig + 0.2) / Math.max(0.2, SPAWN - T.zwanzig));
    hand(c, 780 + (500 - 780) * hk, 680 + (590 - 680) * hk, press, 6);
  }
};

// ---------- canvas: web research board — five finds, three get crossed out, two remain ----------
const RW = 900, RH = 700;
const QUERY = "womit verdienen leute online geld";
const RESULTS = ["Online-Shop", "? ? ? ? ?", "Newsletter", "? ? ? ? ?", "Handy-App"];
const KEEP = [1, 3];
const drawResearch = (c: CanvasRenderingContext2D, t: number) => {
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, RW, RH, 40); c.fill();
  c.strokeStyle = INK; c.lineWidth = 8; roundRect(c, 4, 4, RW - 8, RH - 8, 36); c.stroke();
  c.fillStyle = "#FFF1E8"; roundRect(c, 8, 8, RW - 16, 76, 30); c.fill();
  botFace(c, 54, 50, 22);
  c.fillStyle = INK; c.font = `30px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Recherche · 20 Helfer", 96, 48);
  c.fillStyle = MUTED; c.font = `26px ${F_S}`; c.textAlign = "right"; c.fillText(hhmm(clockAt(t)), RW - 40, 48); c.textAlign = "left";
  const n = Math.max(0, Math.min(QUERY.length, Math.floor((t - T.durch - 0.2) * 40)));
  c.fillStyle = "#FFFFFF"; roundRect(c, 40, 112, RW - 80, 74, 37); c.fill();
  c.strokeStyle = n > 0 ? OR : "#DDD6C8"; c.lineWidth = 5; roundRect(c, 40, 112, RW - 80, 74, 37); c.stroke();
  c.strokeStyle = MUTED; c.lineWidth = 5; c.beginPath(); c.arc(78, 146, 13, 0, 7); c.stroke(); c.beginPath(); c.moveTo(88, 156); c.lineTo(100, 168); c.stroke();
  c.fillStyle = INK; c.font = `30px ${F_M}`; c.fillText(QUERY.slice(0, n) + (n < QUERY.length && Math.floor(t * 4) % 2 ? "|" : ""), 116, 150);
  const cut = T.kurz + 0.3;
  RESULTS.forEach((r, i) => {
    const a0 = T.internet + 0.15 + i * 0.18;
    const k = back((t - a0) / 0.3);
    if (k <= 0.01) return;
    const y = 220 + i * 92;
    const keep = KEEP.includes(i);
    const xk = keep ? 0 : ease((t - cut - i * 0.06) / 0.25);
    const hk = keep ? ease((t - cut - 0.2) / 0.3) : 0;
    c.save(); c.translate(RW / 2, y + 38); c.scale(1, k); c.translate(-RW / 2, -(y + 38));
    c.globalAlpha = 1 - 0.55 * xk;
    c.fillStyle = hk > 0 ? `rgba(255,107,53,${0.15 + 0.1 * hk})` : "#FAF8F3"; roundRect(c, 40, y, RW - 80, 76, 20); c.fill();
    if (hk > 0) { c.strokeStyle = OR; c.lineWidth = 5 * hk; roundRect(c, 40, y, RW - 80, 76, 20); c.stroke(); }
    botFace(c, 92, y + 42, 22);
    c.fillStyle = keep ? MUTED : INK; c.font = `32px ${F_B}`; c.fillText(keep ? (hk > 0 ? "verdeckt" : "lädt …") : r, 140, y + 40);
    if (xk > 0) { c.strokeStyle = RED; c.lineWidth = 6; c.beginPath(); c.moveTo(130, y + 40); c.lineTo(130 + (RW - 260) * xk, y + 40); c.stroke(); }
    if (hk > 0) { c.fillStyle = OR; c.font = font(34); c.textAlign = "right"; c.fillText(i === 1 ? "IDEE A" : "IDEE B", RW - 70, y + 40); c.textAlign = "left"; }
    c.restore();
  });
};

// ---------- canvas: construction billboard ----------
const BW = 900, BH = 570;
const drawSite = (c: CanvasRenderingContext2D, t: number) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, BW, BH);
  const o = (t * 60) % 160;
  for (let i = -4; i < 14; i++) { c.fillStyle = i % 2 ? GOLD : INK; c.beginPath(); c.moveTo(i * 80 + o, 0); c.lineTo(i * 80 + 80 + o, 0); c.lineTo(i * 80 + o, BH); c.lineTo(i * 80 - 80 + o, BH); c.fill(); }
  c.fillStyle = "#FFFFFF"; roundRect(c, 170, 190, 560, 190, 34); c.fill();
  c.fillStyle = INK; c.font = font(70); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("FIRMA ???", 450, 250);
  c.fillStyle = OR; c.font = font(38); c.fillText("IM BAU · TAG 1/100", 450, 326); c.textAlign = "left";
};

// ---------- canvas: shop — what the money will buy (all locked on Tag 1) ----------
const SW = 760, SH = 900;
const drawShop = (c: CanvasRenderingContext2D) => {
  c.fillStyle = "rgba(0,0,0,.35)"; roundRect(c, 8, 16, SW - 8, SH - 16, 44); c.fill();
  c.fillStyle = "#FFFDF7"; roundRect(c, 0, 0, SW - 8, SH - 16, 44); c.fill();
  c.strokeStyle = INK; c.lineWidth = 7; roundRect(c, 3.5, 3.5, SW - 15, SH - 23, 41); c.stroke();
  c.textBaseline = "middle"; c.textAlign = "left";
  c.fillStyle = INK; c.font = font(40); c.fillText("SHOP", 40, 62);
  c.fillStyle = RED; roundRect(c, SW - 300, 30, 252, 64, 32); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = font(34); c.textAlign = "center"; c.fillText(`KASSE ${eur(EP.cash)}`, SW - 174, 64); c.textAlign = "left";
  const rows = [...SHOP.slice(0, 6), SHOP[SHOP.length - 1]];
  rows.forEach((u, i) => {
    const y = 122 + i * 104, last = i === rows.length - 1;
    if (last) { c.fillStyle = "#B8B0A2"; c.font = font(30); c.fillText("…", 50, y - 6); }
    const yy = last ? y + 8 : y;
    c.fillStyle = last ? "#FFF1E8" : "#F1ECE1"; roundRect(c, 30, yy, SW - 68, 86, 22); c.fill();
    if (last) { c.strokeStyle = OR; c.lineWidth = 4; roundRect(c, 30, yy, SW - 68, 86, 22); c.stroke(); }
    // lock
    c.fillStyle = "#B8B0A2"; roundRect(c, 52, yy + 40, 34, 28, 6); c.fill();
    c.strokeStyle = "#B8B0A2"; c.lineWidth = 6; c.beginPath(); c.arc(69, yy + 40, 11, Math.PI, 0); c.stroke();
    c.fillStyle = last ? OR_D : "#6E685F"; c.font = `34px ${F_B}`; c.fillText(u.name, 106, yy + 44);
    c.fillStyle = last ? OR_D : INK; c.font = font(32); c.textAlign = "right"; c.fillText(eur(u.price), SW - 64, yy + 44); c.textAlign = "left";
  });
};

// ---------- canvas: votes ----------
const drawVotes = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 430;
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
    c.fillStyle = "#9A9286"; fitFont(c, `${o.title} · ${o.pot}`, 30, 440); c.fillText(`${o.title} · ${o.pot}`, 410, y + 58);
    c.restore();
  });
};
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

// the Superkind agent; the unknown sender is the same build in dark violet with red eyes
type Palette = { body: string; dark: string; feet: string; eye: string; pupil: string | null; ball: string };
const HERO: Palette = { body: OR, dark: OR_D, feet: "#2C2420", eye: "#FFFFFF", pupil: "#2C2420", ball: GOLD };
const RIVAL: Palette = { body: "#1E1929", dark: "#15111D", feet: "#0E0B14", eye: EVIL, pupil: null, ball: EVIL };
const Agent: React.FC<{ p: V3; yaw?: number; t: number; s?: number; seed?: number; pal?: Palette; vis?: number; armL?: number; armR?: number; squash?: number; sleep?: boolean; carry?: string; talk?: boolean; glow?: number; tilt?: number; eyesOn?: number }> = ({ p, yaw = 0, t, s = 1, seed = 0, pal = HERO, vis = 1, armL = 15, armR = 15, squash = 0, sleep, carry, talk, glow = 0, tilt = 0, eyesOn = 1 }) => {
  if (vis <= 0.001) return null;
  const bob = sleep ? 0 : Math.abs(Math.sin(t * 4.4 + seed)) * 0.1;
  const blink = sleep || eyesOn < 0.5 || (t * 1.2 + seed * 0.37) % 3.1 < 0.09;
  const sc = s * vis;
  const sy = 1 - 0.25 * squash, sx = 1 + 0.18 * squash;
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
          <mesh><boxGeometry args={[0.34, blink ? 0.05 : pal.pupil ? 0.36 : 0.2 + 0.06 * glow, 0.03]} /><meshBasicMaterial color={blink && !pal.pupil ? pal.body : pal.eye} toneMapped={false} /></mesh>
          {!blink && pal.pupil && <mesh position={[0.05, -0.04, 0.02]}><boxGeometry args={[0.15, 0.19, 0.02]} /><meshBasicMaterial color={pal.pupil} /></mesh>}
        </group>
      ))}
      <mesh position={[0, 0.72, 0.545]}>
        <boxGeometry args={[0.34, talk ? 0.05 + 0.07 * Math.abs(Math.sin(t * 14 + seed)) : 0.06, 0.03]} />
        <meshBasicMaterial color={pal.pupil ? "#9C4A31" : "#0E0B14"} />
      </mesh>
      <mesh position={[0, 1.83, 0]} castShadow><boxGeometry args={[0.08, 0.42, 0.08]} /><meshStandardMaterial color={pal.feet} /></mesh>
      <mesh position={[0, 2.08, 0]} castShadow><boxGeometry args={[0.22, 0.22, 0.22]} /><meshStandardMaterial color={pal.ball} emissive={pal.ball} emissiveIntensity={sleep ? 0.05 : (0.35 + 0.35 * Math.max(0, Math.sin(t * 6 + seed)) + glow) * eyesOn} /></mesh>
      {arm(-1, armL)}
      {arm(1, armR)}
      {carry && <ToyBox p={[0, 2.0, 0.1]} s={[0.8, 0.5, 0.6]} color={carry} />}
      {glow > 0.01 && <pointLight position={[0, 1.1, 1.0]} intensity={6 * glow} distance={5} color={pal.eye} />}
    </group>
  );
};

const Screen: React.FC<{ p: V3; w: number; h: number; tex: THREE.Texture; rot?: V3 }> = ({ p, w, h, tex, rot = [0, 0, 0] }) => (
  <group position={p} rotation={rot}>
    <ToyBox p={[0, 0, -0.1]} s={[w + 0.2, h + 0.2, 0.16]} color="#2A2430" />
    <mesh><planeGeometry args={[w, h]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
  </group>
);

const Tree: React.FC<{ p: V3; t: number; s?: number; seed?: number; night: number }> = ({ p, t, s = 1, seed = 0, night }) => (
  <group position={p} scale={s} rotation={[Math.sin(t * 1.1 + seed) * 0.04, 0, Math.sin(t * 1.6 + seed) * 0.07]}>
    <ToyBox p={[0, 0.45, 0]} s={[0.24, 0.9, 0.24]} color="#7A5434" />
    <ToyBox p={[0, 1.15, 0]} s={[0.95, 0.7, 0.95]} color={night > 0.6 ? "#2F5E3A" : "#4E9E45"} />
    <ToyBox p={[0, 1.7, 0]} s={[0.62, 0.5, 0.62]} color={night > 0.6 ? "#3A6E44" : "#63B856"} />
  </group>
);

// crane keeps swinging over the empty plot all day
const Crane: React.FC<{ p: V3; t: number; busy: boolean }> = ({ p, t, busy }) => {
  const rot = busy ? Math.sin(t * 1.6) * 0.9 : 0.4 * Math.sin(t * 0.5) - 0.4;
  const trolley = 1.6 + 1.0 * (0.5 + 0.5 * Math.sin(t * (busy ? 2.0 : 0.8)));
  const cable = 1.6 + 0.9 * (0.5 + 0.5 * Math.sin(t * (busy ? 2.6 : 1.1) + 1));
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
          <ToyBox p={[0, -cable - 0.12, 0]} s={[0.44, 0.3, 0.36]} color={OR} />
        </group>
      </group>
    </group>
  );
};

// empty plot: foundation + scaffold; the finished "Tag 100" tower only exists as a glowing outline
const Plot: React.FC<{ t: number; ghost: number }> = ({ t, ghost }) => (
  <group position={BLD}>
    <ToyBox p={[0, 0.08, 0]} s={[3.4, 0.16, 2.6]} color="#B9B2A6" />
    {[[-1.5, -1.1], [1.5, -1.1], [-1.5, 1.1], [1.5, 1.1]].map(([x, z], i) => <ToyBox key={i} p={[x, 1.0, z]} s={[0.1, 1.8, 0.1]} color="#8C8578" />)}
    <ToyBox p={[0, 1.9, 1.1]} s={[3.1, 0.08, 0.08]} color="#8C8578" />
    <ToyBox p={[0, 1.9, -1.1]} s={[3.1, 0.08, 0.08]} color="#8C8578" />
    {[0, 1, 2].map((i) => <ToyBox key={i} p={[-0.9 + i * 0.9, 0.34 + (i === 1 ? 0.2 : 0), 0.4]} s={[0.6, 0.36 + (i === 1 ? 0.4 : 0), 0.5]} color={["#FFFFFF", OR, GOLD][i]} rot={[0, i * 0.3, 0]} />)}
    {ghost > 0.01 && [0, 1, 2, 3, 4, 5].map((i) => (
      <mesh key={i} position={[0, 0.8 + i * 1.25, -0.4]} scale={[1 - i * 0.08, 1, 1 - i * 0.08]}>
        <boxGeometry args={[3.0, 1.15, 2.2]} />
        <meshBasicMaterial color={OR} wireframe transparent opacity={(0.35 + 0.2 * Math.sin(t * 6 + i)) * ghost} toneMapped={false} />
      </mesh>
    ))}
  </group>
);

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

// 20 helpers: out of the monitor, bustle, some run to the portal, sleep at night
const SUBS = Array.from({ length: 20 }, (_, i) => {
  const a = (i / 20) * Math.PI * 2 + rnd(i) * 0.3;
  const r = 2.4 + rnd(i + 5) * 1.4;
  return { home: [HQ[0] + Math.cos(a) * r, 0.45, HQ[2] + Math.sin(a) * r * 0.8] as V3, seed: i * 1.7, delay: i * 0.035 };
});
const subAt = (i: number, t: number): { p: V3; yaw: number; vis: number; sleep?: boolean } => {
  const s = SUBS[i];
  const k = (t - SPAWN - s.delay) / 0.55;
  if (k < 0) return { p: MON, yaw: 0, vis: 0 };
  if (k < 1) { const p = bez3([MON[0], MON[1], MON[2] + 0.3], [(MON[0] + s.home[0]) / 2, 4.5, (MON[2] + s.home[2]) / 2 + 1], s.home, ease(k)); return { p, yaw: k * 6, vis: 1 }; }
  if (t > T.da + 0.3 + rnd(i) * 0.6) return { p: s.home, yaw: Math.cos(s.seed) * 1.2, vis: 1, sleep: true };
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
  const night = nightAt(t);
  const sky = keysC(t, SKY);
  const sunK = keys(t, [[0, 0.15], [T.stunde - 0.3, 0.45], [EVE, 0.95], [DUSKT, 1.2]]);
  const moonK = keys(t, [[0, 0], [T.kurz, 0], [T.kurz + 3, 1]]);

  // hero route
  type K = { a: number; b: number; p: V3; yaw: number };
  const KEYS: K[] = [
    { a: 0, b: T.also - 0.2, p: HERO_HOOK, yaw: 0.25 },
    { a: T.also + 0.1, b: T.durch - 0.3, p: [0.4, 0.45, 8.2], yaw: 0.7 },
    { a: T.durch + 0.3, b: T.da - 0.2, p: [4.4, 0.45, -1.4], yaw: 0.6 },
    { a: T.da + 0.3, b: T.hier, p: HERO_DESK, yaw: Math.PI - 0.5 },
    { a: OPT_T[0] + 0.15, b: OPT_END[0] - 0.15, p: add(ISL[0], [-2.0, 0.45, -0.4]), yaw: 0.5 },
    { a: OPT_T[1] + 0.15, b: 99, p: HERO_B, yaw: -0.4 },
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
  // the hero turns to the viewer on "das machst du" and on "welche Influencerin?"
  if (t > T.regel && t < T.tag) cyaw = keys(t, [[T.regel, 0.25], [T.regel + 0.4, -0.1]]);
  if (t > T.welche && t < T.hier) cyaw = keys(t, [[T.welche, Math.PI - 0.5], [T.welche + 0.5, 0.15], [T.niemand2, 0.15], [T.niemand2 + 0.3, Math.PI - 0.3], [T.agenten, Math.PI - 0.3], [T.agenten + 0.35, 0.1]]);
  const drop = t < T.agent + 0.4 ? (1 - ease((t - T.agent + 0.25) / 0.45)) * 9 : 0;
  const land = bump(t, T.agent + 0.2, 0.18);
  const camD = Math.hypot(cam.pos[0] - cp[0], cam.pos[1] - cp[1], cam.pos[2] - cp[2]);
  const optVis = (i: number) => back((t - T.hier - 0.1 - i * 0.3) / 0.4);
  const resVis = back((t - T.durch + 0.6) / 0.5);
  const rivVis = ease((t - T.und) / 0.6);
  const eyes = cl((t - EYES) / 0.12);
  const rivGlow = eyes * (0.6 + 0.4 * Math.sin(t * 5));
  const look = cam.look;
  return (
    <>
      <CameraRig pos={cam.pos} look={look} fov={48 - 3 * punch} />
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 30, 78]} />
      <ambientLight intensity={keys(t, [[0, 0.85], [EVE, 0.7], [DUSKT, 0.55], [NIGHTT, 0.5]])} color={keysC(t, [[0, "#FFFFFF"], [EVE, "#FFE1CF"], [DUSKT, "#C9BBFF"], [NIGHTT, "#8E95FF"]])} />
      <hemisphereLight args={[keysC(t, [[0, "#DDF2FF"], [EVE, "#FFC9A6"], [NIGHTT, "#4C4A9A"]]), "#3A2E5A", keys(t, [[0, 0.8], [NIGHTT, 0.5]])]} />
      <primitive object={lightTarget} />
      <directionalLight position={[look[0] + 6, 16, look[2] + 9]} target={lightTarget} intensity={keys(t, [[0, 1.9], [EVE, 1.6], [DUSKT, 1.1], [NIGHTT, 0.75]])} color={keysC(t, [[0, "#FFF2DC"], [EVE, "#FFB27A"], [DUSKT, "#C2B0FF"], [NIGHTT, "#8C9BFF"]])} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-camera-far={60} shadow-bias={-0.0015} shadow-normalBias={0.04} />

      {sunK < 1.15 && (
        <mesh position={[-34 + sunK * 64, 6 + Math.sin(Math.min(1, sunK) * Math.PI) * 20, -62]}>
          <sphereGeometry args={[4.2, 24, 24]} />
          <meshBasicMaterial color={keysC(t, [[0, "#FFF4C2"], [EVE, "#FF8A4C"]])} fog={false} toneMapped={false} transparent opacity={1 - cl((sunK - 1.0) / 0.15)} />
        </mesh>
      )}
      {moonK > 0.01 && (
        <group position={[-26 + moonK * 10, 4 + moonK * 18, -62]}>
          <mesh><sphereGeometry args={[3.2, 24, 24]} /><meshBasicMaterial color="#F4F1FF" fog={false} toneMapped={false} /></mesh>
          <mesh position={[1.3, 0.6, 1]}><sphereGeometry args={[2.9, 24, 24]} /><meshBasicMaterial color={sky} fog={false} /></mesh>
        </group>
      )}
      {night > 0.05 && Array.from({ length: 90 }).map((_, i) => (
        <mesh key={i} position={[(rnd(i) - 0.5) * 80, 2 + rnd(i + 5) * 34, -50 + rnd(i + 9) * 60]}>
          <boxGeometry args={[0.14, 0.14, 0.14]} />
          <meshBasicMaterial color={i % 7 === 0 ? GOLD : "#FFFFFF"} transparent opacity={night * (0.3 + 0.7 * Math.abs(Math.sin(t * 2 + i)))} toneMapped={false} fog={false} />
        </mesh>
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const span = 70, x = ((rnd(i + 70) * span + t * (0.5 + rnd(i) * 0.6)) % span) - span / 2;
        const low = i % 3 === 0;
        const y = low ? -4.5 + rnd(i + 71) : 7 + rnd(i + 71) * 6 + Math.sin(t * 0.7 + i) * 0.3;
        const col = keysC(t, [[0, "#FFFFFF"], [EVE, "#FFD3C2"], [DUSKT, "#8C79B8"], [NIGHTT, "#3B3366"]]);
        return (
          <group key={i} position={[x, y, -34 + rnd(i + 72) * 40]} scale={1 + rnd(i + 3) * 0.8}>
            {[0, 1, 2, 3].map((j) => <mesh key={j} position={[j * 0.95 - 1.4, j === 1 || j === 2 ? 0.35 + Math.sin(t * 1.3 + i + j) * 0.08 : 0, (j % 2) * 0.3]}><boxGeometry args={[1.3, 0.9, 1.0]} /><meshStandardMaterial color={col} flatShading transparent opacity={0.92} /></mesh>)}
          </group>
        );
      })}
      {night < 0.3 && Array.from({ length: 6 }).map((_, i) => {
        const x = ((t * 2.2 + i * 2.3) % 40) - 20, flap = Math.sin(t * 12 + i) * 0.6;
        return (
          <group key={i} position={[x, 9 + (i % 3) * 0.7 + Math.sin(t * 2 + i) * 0.3, -6 - (i % 2) * 3]} rotation={[0, Math.PI / 2, 0]}>
            <mesh position={[0.18, 0, 0]} rotation={[0, 0, flap]}><boxGeometry args={[0.36, 0.04, 0.14]} /><meshBasicMaterial color="#3A3440" /></mesh>
            <mesh position={[-0.18, 0, 0]} rotation={[0, 0, -flap]}><boxGeometry args={[0.36, 0.04, 0.14]} /><meshBasicMaterial color="#3A3440" /></mesh>
          </group>
        );
      })}
      {t > T.durch && t < T.da && Array.from({ length: 12 }).map((_, i) => {
        const k = (t * 0.55 + i / 12) % 1;
        const p = bez3(add(PORTAL, [0, 0, 0.3]), [4, 6.5, 2], [BLD[0], 2.5, BLD[2]], k);
        return <mesh key={i} position={p}><boxGeometry args={[0.16, 0.16, 0.16]} /><meshBasicMaterial color={[OR, "#9BE7FF", GOLD][i % 3]} toneMapped={false} /></mesh>;
      })}

      {/* ---- HQ island: empty plot, desk, billboard ---- */}
      <Island p={HQ} r={HQR} t={t} />
      <Plot t={t} ghost={1 - ease((t - T.tag) / 0.6)} />
      <Crane p={[3.3, 0.45, 1.6]} t={t} busy={t > SPAWN && t < T.da} />
      {[[-3.3, 0.45, 3.0], [3.6, 0.45, 4.2], [-0.9, 0.45, 1.4], [-3.9, 0.45, 6.0]].map((p, i) => <Tree key={i} p={p as V3} t={t} seed={i * 2} s={0.8 + rnd(i) * 0.3} night={night} />)}
      <group position={[MON[0], 0.45, MON[2] + 0.2]}>
        <ToyBox p={[0, 0.68, 0]} s={[3.2, 0.14, 1.0]} color="#A87A52" top="#C59368" />
        {[[-1.45, -0.4], [1.45, -0.4], [-1.45, 0.4], [1.45, 0.4]].map(([x, z], i) => <ToyBox key={i} p={[x, 0.32, z]} s={[0.14, 0.62, 0.14]} color="#7A5434" />)}
        <ToyBox p={[0, 0.8, 0.25]} s={[1.1, 0.06, 0.36]} color="#3A3340" />
        <mesh position={[1.25, 0.92, 0.2]} castShadow><cylinderGeometry args={[0.13, 0.11, 0.3, 12]} /><meshStandardMaterial color={OR} /></mesh>
        {Array.from({ length: 3 }).map((_, i) => { const k = (t * 0.6 + i / 3) % 1; return <mesh key={i} position={[1.25 + Math.sin(k * 6 + i) * 0.06, 1.1 + k * 0.6, 0.2]} scale={0.06 + k * 0.08}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.6 * (1 - k)} /></mesh>; })}
      </group>
      <group position={MON}>
        <ToyBox p={[0, 0, -0.1]} s={[3.0, 2.0, 0.16]} color="#2A2430" />
        <mesh><planeGeometry args={[2.8, 1.85]} /><meshBasicMaterial map={dyn.mon} toneMapped={false} /></mesh>
        <ToyBox p={[0, -1.2, -0.15]} s={[0.24, 0.5, 0.2]} color="#2A2430" />
        <pointLight position={[0, 0, 1.2]} intensity={2.2 * night + 3 * bump(t, T.bau + 0.2, 0.4) + 2.5 * bump(t, T.agenten, 0.3)} distance={6} color={t > T.mail ? "#FFD0D0" : "#FFFFFF"} />
      </group>
      <group position={BILL} rotation={[0, 0.3, 0]}>
        <ToyBox p={[0, 0, -0.1]} s={[2.7, 1.75, 0.16]} color="#2A2430" />
        <mesh><planeGeometry args={[2.56, 1.62]} /><meshBasicMaterial map={dyn.site} toneMapped={false} /></mesh>
        {[-1.0, 1.0].map((x) => <ToyBox key={x} p={[x, -1.5, -0.12]} s={[0.16, 1.3, 0.16]} color="#2A2430" />)}
      </group>

      {/* hook boards: stakes, one rule */}
      <Board p={[0, 5.2, 8.6]} tex={tex.whatif} w={3.6} h={0.86} t={t} q={q} until={T.hundert - 0.1} tilt={-0.04} />
      <Board p={[0, 5.2, 8.6]} tex={tex.days} w={2.6} h={0.84} t={t} q={q} at={T.hundert - 0.05} until={T.mit - 0.1} tilt={0.05} />
      <Board p={[-1.2, 5.2, 8.6]} tex={tex.zeroBig} w={1.8} h={0.7} t={t} q={q} at={T.nullE - 0.05} until={T.regel - 0.3} tilt={-0.05} />
      <Board p={[1.3, 5.6, 8.6]} tex={tex.goal} w={2.6} h={0.72} t={t} q={q} at={T.million - 0.05} until={T.regel - 0.3} tilt={0.04} />
      <Board p={add(HERO_HOOK, [0.2, 2.55, 0.4])} tex={tex.rule} w={1.6} h={0.4} t={t} q={q} at={T.regel - 0.05} until={T.du - 0.05} tilt={-0.03} />
      <Board p={add(HERO_HOOK, [0.2, 2.55, 0.4])} tex={tex.you} w={2.2} h={0.6} t={t} q={q} at={T.du - 0.05} until={T.tag - 0.15} tilt={0.04} />
      <Burst3D at={T.agent + 0.2} t={t} p={[-1.2, 0.6, 7.4]} colors={[OR, "#FFFFFF", GOLD]} n={12} />
      {/* Tag eins: kein Geld, kein Produkt, keine Ahnung */}
      <Board p={[-0.75, 3.55, 6.7]} tex={tex.shop} w={1.95} h={2.3} t={t} q={q} at={T.geld - 0.05} until={T.also - 0.1} tilt={-0.03} bob={0.03} />
      <Board p={[1.55, 4.45, 5.0]} tex={tex.noProduct} w={1.9} h={0.5} t={t} q={q} at={T.produkt - 0.05} until={T.also - 0.1} tilt={0.05} />
      <Board p={[1.7, 2.7, 5.4]} tex={tex.qmark} w={0.9} h={0.9} t={t} q={q} at={T.ahnung - 0.05} until={T.also - 0.1} bob={0.15} />
      {/* helpers */}
      {SUBS.map((_, i) => { const s = subAt(i, t); return <Agent key={i} p={s.p} yaw={s.yaw} t={t} s={0.38} seed={i * 1.3} vis={s.vis} sleep={s.sleep} />; })}
      {t > T.da + 0.6 && [0, 5, 10, 15].map((i, j) => {
        const k = (t * 0.5 + j * 0.25) % 1;
        return <Board key={i} p={add(SUBS[i].home, [0.2 + k * 0.4, 1.3 + k * 1.2, 0])} tex={tex.zzz} w={0.4 * (0.6 + k)} h={0.4 * (0.6 + k)} t={t} q={q} bob={0} />;
      })}
      <Burst3D at={SPAWN} t={t} p={[MON[0], MON[1], MON[2] + 0.5]} colors={[OR, "#FFFFFF", GOLD]} n={12} power={1.2} floor={0.5} />
      <Board p={[2.4, 3.95, 7.3]} tex={tex.team} w={1.9} h={0.52} t={t} q={q} at={T.helfer - 0.05} until={SPAWN + 0.5} tilt={-0.05} />

      {/* ---- research island ---- */}
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
        </group>
      )}

      {/* ---- the two ideas ---- */}
      {ISL.map((p, i) => {
        const v = optVis(i);
        const active = t > OPT_T[i] - 0.1 && t < OPT_END[i];
        const voteGlow = t > T.va - 0.1 ? 0.4 + 0.6 * bump(t, VOTE[i] + 0.2, 0.5) : active ? 0.6 + 0.4 * Math.sin(t * 6) : 0;
        const revealed = t > OPT_T[i] - 0.15;
        const big = t > T.und;
        return (
          <group key={i}>
            <Island p={p} r={IR} t={t} vis={v} glow={voteGlow} col={OPT_COL[i]} />
            {!revealed && v > 0.01 && <Board p={add(p, [0, 2.2, 0])} tex={tex.qmark} w={1.4 * v} h={1.4 * v} t={t} q={q} bob={0.2} />}
            {revealed && i === 0 && <InfluSet p={p} t={t} vis={back((t - OPT_T[0] + 0.1) / 0.4)} tex={dyn.influ} />}
            {revealed && i === 1 && <YtSet p={p} t={t} vis={back((t - OPT_T[1] + 0.1) / 0.4)} tex={dyn.yt} />}
            {revealed && v > 0.01 && <Board p={add(p, [0, big ? 5.4 : 4.95, -0.3])} tex={tex[`key${i}`]} w={big ? 2.1 : 1.3} h={big ? 2.1 : 1.3} t={t} q={q} bob={0.12} />}
            <Burst3D at={VOTE[i]} t={t} p={add(p, [0, 1.5, 0])} colors={[OPT_COL[i], "#FFFFFF"]} n={8} power={1.2} />
          </group>
        );
      })}
      <Board p={add(ISL[0], [0.4, 1.4, 1.4])} tex={tex.never} w={2.0} h={0.52} t={t} q={q} at={T.schlaeft - 0.05} until={OPT_END[0] - 0.1} tilt={-0.05} />
      <Board p={add(ISL[1], [-0.3, 1.4, 1.4])} tex={tex.noface} w={2.1} h={0.52} t={t} q={q} at={T.gesicht - 0.05} until={OPT_END[1]} tilt={0.05} />
      {/* potential + risk per idea: the vote is a bet on the money counter */}
      {[0, 1].map((i) => <Board key={i} p={add(ISL[i], [0, 3.85, -0.1])} tex={tex[`risk${i}`]} w={2.3} h={0.5} t={t} q={q} at={OPT_T[i] + 0.45} until={OPT_END[i]} tilt={i ? -0.03 : 0.03} />)}
      {/* "welche Influencerin?" — nobody has seen the ideas */}
      <Board p={add(HERO_DESK, [0.3, 2.6, 0.4])} tex={tex.qmark} w={0.8} h={0.8} t={t} q={q} at={T.welche} until={T.niemand2 - 0.05} bob={0.15} />
      <Board p={add(HERO_DESK, [0.3, 2.6, 0.4])} tex={tex.onlyHim} w={2.3} h={0.56} t={t} q={q} at={T.agenten - 0.05} until={T.hier - 0.1} tilt={-0.04} />
      {/* vote */}
      <Board p={[0, 9.6, 3.6]} tex={dyn.votes} w={2.9} h={1.4} t={t} q={q} at={T.ab - 0.1} until={T.sonst} bob={0.04} />

      {/* ---- the unknown sender: only red eyes in the dark ---- */}
      {rivVis > 0.01 && (
        <group position={[0, (1 - rivVis) * -8, 0]}>
          <Island p={RIV} r={2.6} t={t} top="#2A2338" side="#1A1524" deco={false} glow={eyes * 0.5} col={EVIL} />
          <Agent p={RIV_AG} yaw={0.55} t={t} s={0.95} seed={9} pal={RIVAL} glow={rivGlow} eyesOn={eyes} />
        </group>
      )}

      <Agent p={[cp[0], cp[1] + drop, cp[2]]} yaw={cyaw} t={t} s={0.85} squash={land} armL={hop > 0.2 ? 140 : 15} armR={hop > 0.2 ? 140 : (t > T.also && t < SPAWN) ? 150 + 15 * Math.sin(t * 8) : 15} talk={t > T.du - 0.3 && t < T.du + 0.4} vis={cl((camD - 2.4) / 1.5)} />
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
    t.zeroBig = pillTex("0 €", RED, "#FFFFFF", 460, 180);
    t.goal = pillTex("→ 1.000.000 €", GOLD, INK, 760, 200);
    t.rule = pillTex("EINE REGEL:", "#FFFFFF", INK, 640, 160);
    t.you = pillTex("DU ENTSCHEIDEST", OR, "#FFFFFF", 760, 200);
    t.noMoney = pillTex("0 €", RED, "#FFFFFF", 460, 160);
    t.noProduct = pillTex("0 PRODUKTE", "#FFFFFF", INK, 640, 170);
    t.team = pillTex("+20 HELFER", GREEN, "#FFFFFF", 700, 190);
    t.www = pillTex("INTERNET", PURPLE, "#FFFFFF", 620, 180);
    t.never = pillTex("SCHLÄFT NIE", "#E0559A", "#FFFFFF", 700, 180);
    t.noface = pillTex("0 GESICHTER", RED, "#FFFFFF", 700, 180);
    t.onlyHim = pillTex("NUR DER AGENT", OR, "#FFFFFF", 760, 190);
    t.shop = canvasTex(SW, SH, drawShop);
    EP.options.forEach((o, i) => { t[`risk${i}`] = pillTex(`${o.pot} · ${o.risk}`, i ? "#FFFFFF" : INK, i ? INK : GOLD, 840, 180); });
    t.zzz = canvasTex(128, 128, (c) => { c.fillStyle = "#FFFFFF"; c.font = font(96); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("z", 64, 64); });
    t.qmark = canvasTex(256, 256, (c) => { c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(128, 128, 118, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 10; c.stroke(); c.fillStyle = INK; c.font = font(170); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("?", 128, 140); });
    return t;
  }, [ready]);

const useDynTex = (t: number, logo: HTMLImageElement | null) => {
  const mon = useDyn(MW, MH, (c) => drawMonitor(c, t, logo));
  const research = useDyn(RW, RH, (c) => drawResearch(c, t));
  const site = useDyn(BW, BH, (c) => drawSite(c, t));
  const votes = useDyn(900, 430, (c) => drawVotes(c, t));
  const influ = useDyn(360, 640, (c) => drawInflu(c));
  const yt = useDyn(640, 400, (c) => drawYt(c, t));
  return { mon, research, site, votes, influ, yt };
};

// ---------- 2D HUD ----------
const Hud: React.FC<{ t: number }> = ({ t }) => {
  const k = ease((t - 0.1) / 0.4);
  const cashPulse = 1 + 0.25 * Math.max(bump(t, T.nullE + 0.1, 0.3), bump(t, T.geld + 0.1, 0.3), bump(t, GOAL_DOWN[1], 0.3));
  const cash = cashAt(t), goal = goalMode(t);
  const nxt = SHOP[0];
  const barK = goal ? cash / 1e6 : cl(cash / nxt.price);
  const team = t < SPAWN ? 1 : Math.min(21, 1 + Math.floor((t - SPAWN) / 0.035));
  const teamPulse = 1 + 0.3 * bump(t, SPAWN + 0.4, 0.4);
  const day = t > MIDNIGHT ? EP.day + 1 : EP.day;
  const dayPulse = 1 + 0.35 * bump(t, MIDNIGHT + 0.05, 0.35);
  const night = nightAt(t);
  const clockPulse = 1 + 0.2 * Math.max(bump(t, T.kurz + 0.1, 0.3), bump(t, MIDNIGHT, 0.3));
  const goalPulse = 1 + 0.12 * bump(t, T.million + 0.15, 0.35);
  const chip = (children: React.ReactNode, border = "rgba(255,255,255,.18)") => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(20,16,36,.82)", border: `4px solid ${border}`, borderRadius: 24, padding: "9px 18px", boxShadow: "0 6px 0 rgba(0,0,0,.4)" }}>{children}</div>
  );
  const txt: React.CSSProperties = { fontFamily: pixelFont, fontWeight: 800, fontSize: 36, color: "#FFFFFF", lineHeight: 1, display: "inline-block" };
  const late = t > T.kurz;
  return (
    <div style={{ position: "absolute", top: 92, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: k, transform: `translateY(${(1 - k) * -30}px)` }}>
      <div style={{ display: "flex", gap: 10 }}>
        {chip(<span style={{ ...txt, color: GOLD, transform: `scale(${dayPulse})` }}>TAG {day}<span style={{ color: "rgba(255,255,255,.55)", fontSize: 26 }}> / 100</span></span>)}
        {chip(<><span style={{ ...txt, fontSize: 30 }}>{night > 0.5 ? "☾" : "☀"}</span><span style={{ ...txt, transform: `scale(${clockPulse})`, color: late ? "#FF9AA0" : "#FFFFFF" }}>{hhmm(clockAt(t))}</span></>, late ? "rgba(255,46,58,.6)" : undefined)}
        {chip(<><div style={{ width: 30, height: 30, borderRadius: 15, background: GOLD, border: "4px solid #B88D24" }} /><span style={{ ...txt, transform: `scale(${cashPulse})`, color: goal ? GOLD : cashPulse > 1.05 ? "#FF8A8D" : "#FFFFFF" }}>{eur(cash)}</span></>, goal ? GOLD : undefined)}
        {chip(<span style={{ ...txt, transform: `scale(${teamPulse})`, color: teamPulse > 1.05 ? "#8FF0B0" : "#FFFFFF" }}>TEAM {team}</span>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: OR, padding: "7px 18px", borderRadius: 14, border: "3px solid rgba(0,0,0,.45)", transform: `scale(${goalPulse})` }}>
        <Img src={staticFile("superkind-logo.svg")} style={{ width: 30, height: 30, filter: "invert(1)" }} />
        <span style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 26, letterSpacing: 1, color: "#FFFFFF" }}>SUPERKIND BAUT EINE FIRMA · ZIEL 1 MIO €</span>
      </div>
      {/* money counter: progress to the next thing we can buy */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(20,16,36,.82)", border: `3px solid ${goal ? GOLD : "rgba(255,255,255,.18)"}`, borderRadius: 20, padding: "10px 20px", boxShadow: "0 6px 0 rgba(0,0,0,.4)" }}>
        <span style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: "rgba(255,255,255,.6)" }}>{goal ? "ZIEL" : "NÄCHSTER KAUF"}</span>
        <div style={{ width: 260, height: 26, borderRadius: 13, background: "rgba(255,255,255,.14)", overflow: "hidden" }}>
          <div style={{ width: `${Math.max(3, barK * 100)}%`, height: "100%", background: goal ? GOLD : OR, borderRadius: 9 }} />
        </div>
        <span style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: "#FFFFFF" }}>{goal ? "1.000.000 €" : `${nxt.name} · ${eur(nxt.price)}`}</span>
      </div>
    </div>
  );
};

// ---------- audio ----------
type Sfx = [string, number, number];
const TRANSITS = HOLDS.slice(0, -1).filter((h, i) => HOLDS[i + 1].a - h.b > 0.1).map((h) => h.b);
const SFX: Sfx[] = [
  ...TRANSITS.map((c): Sfx => ["whoosh-quick", c - 0.02, 0.34]),
  ["riser", T.agent - 0.5, 0.16], ["bump", T.agent + 0.2, 0.5], ["jump", T.agent + 0.25, 0.25],
  ["coin", T.hundert, 0.25], ["stamp", T.nullE, 0.3], ...Array.from({ length: 7 }, (_, i): Sfx => ["coin", T.million + i * 0.12, 0.2 + i * 0.03]), ["bump", GOAL_DOWN[0] + 0.3, 0.4], ["ui-pop", T.regel, 0.3], ["chime", T.du, 0.3],
  ["stamp", T.geld, 0.32], ["stamp", T.produkt, 0.3], ["bump", T.ahnung, 0.32],
  ["typing", T.also, 0.2], ...Array.from({ length: 5 }, (_, i): Sfx => ["ui-pop", T.zwanzig + i * 0.08, 0.14]),
  ["click", SPAWN - 0.15, 0.6], ["powerup", SPAWN, 0.28],
  ...Array.from({ length: 8 }, (_, i): Sfx => ["jump", SPAWN + 0.2 + i * 0.07, 0.11]),
  ["typing", T.durch + 0.2, 0.2], ["chime", T.internet, 0.25],
  ...Array.from({ length: 5 }, (_, i): Sfx => ["check", T.internet + 0.15 + i * 0.18, 0.16]),
  ["stamp", T.kurz + 0.3, 0.3], ["ui-pop", T.zwei + 0.1, 0.28],
  ["ui-pop", T.mail, 0.45], ["typing", T.bau, 0.25], ["bump", T.influ2 + 0.4, 0.45],
  ["riser", T.niemand, 0.16], ["stamp", T.agenten, 0.4],
  ...[0, 1].map((i): Sfx => ["ui-pop", T.hier + 0.1 + i * 0.3, 0.3]),
  ...[0, 1].map((i): Sfx => ["powerup", OPT_T[i], 0.24]),
  ["stamp", T.schlaeft, 0.28], ["stamp", T.gesicht, 0.28],
  ["riser", T.und - 0.1, 0.2], ["bump", EYES, 0.55],
  ...VOTE.map((v): Sfx => ["ui-pop", v, 0.42]),
  ["chime", MIDNIGHT, 0.4], ["bump", T.sonst - 0.03, 0.6], ["stamp", BLACK, 0.55],
];

export const SuperkindFirmaTag1: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ready = useFontsReady([`800 40px ${pixelFont}`, `40px ${F_B}`, `40px ${F_M}`, `40px ${F_S}`]);
  const logo = useImage(staticFile("superkind-logo.svg"));
  const tex = useStaticTex(ready);
  const dyn = useDynTex(t, logo);
  const a = camAt(t - 0.03).pos, b = camAt(t + 0.03).pos;
  const speed = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 0.06;
  const blur = speed > 150 ? 0 : Math.min(3.5, Math.max(0, (speed - 8) * 0.12)); // no smear across the hard cut
  const flash = 0.25 * bump(t, T.agent + 0.2, 0.1) + 0.2 * bump(t, SPAWN, 0.08);
  const redFlash = 0.16 * bump(t, EYES, 0.12) + 0.22 * bump(t, T.sonst, 0.1);
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
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(8,4,20,${0.25 + 0.3 * night}) 100%)` }} />
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
      <AbsoluteFill style={{ background: EVIL, opacity: redFlash }} />
      <Hud t={t} />
      <PillCaptions words={WD} theme={THEMES.night} />
      {t > BLACK && <AbsoluteFill style={{ background: "#000000" }} />}
      <Audio src={staticFile("cbf1/voice6.mp3")} />
      <Audio src={staticFile("sirtoken/music.mp3")} loop volume={(f) => (f / 30 > BLACK ? 0 : keys(f / 30, [[0, 0.085], [T.da - 0.3, 0.085], [T.da + 0.6, 0.03], [T.und, 0.03], [T.und + 0.6, 0.06]]))} />
      {SFX.map(([n, s, v], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s * 30))} durationInFrames={90}>
          <Audio src={staticFile(`sirtoken/sfx-${n}.mp3`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
