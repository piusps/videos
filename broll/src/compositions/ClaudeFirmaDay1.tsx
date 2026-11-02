// "Claude baut eine Firma" (new account), episode 1, v2 (2026-10-21). Endless community format: Claude builds a
// fictional internet company on its own for 100 days; every episode shows real work first and only the last third
// is the A/B/C vote (most commented letter gets built next day). Toy-3D world like TrainerWorld3D: one continuous
// shot with camera flights, lots of life (sub-agents, drones, particles). Persistent game HUD = context for new viewers.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BlockBuddy, CameraRig, ToyBox, canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, THEMES, Word, pixelFont } from "../components/PixelKit";
import { claudeSerif } from "../components/ClaudeUI";
import words from "../../public/cbf1/words2.json";

export const CLAUDE_FIRMA_D1_SECONDS = 35;
const W = 1080, H = 1920;
type V3 = [number, number, number];
const CO = "#D97757", CO_D = "#B85C3E", INK = "#1E1A16", CREAM = "#F5F3EC", GOLD = "#F5C542", RED = "#E5484D", GREEN = "#3FB66B", PURPLE = "#8B6CF0";
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
  claude: at("Claude"), hundert: at("hundert"), allein: at("allein"), aber: at("Aber"), du: at("du.", 3),
  tag: at("Tag", 4), kasse: at("Kasse"), null: at("null"),
  startet: at("startet"), zwanzig: at("zwanzig"), helfer: at("Helfer"),
  durch: at("durchsuchen"), internet: at("Internet"), womit: at("Womit"), online: at("online"), geld1: at("Geld", 11),
  minuten: at("Minuten"), namen: at("Namen"), nullplan: at("Nullplan"), logo: at("Logo"), website: at("Website"),
  nur: at("Nur"), fehlt: at("fehlt"), womit2: at("Womit", 18), geld2: at("Geld", 19),
  a: at("A", 19.5), influ: at("KI-Influencerin"), schlaeft: at("schläft"),
  b: at("B", 22.5), youtube: at("YouTube"), gesicht: at("Gesicht"),
  c: at("C", 25), app: at("App"), outfit: at("Outfit"), bewertet: at("bewertet"),
  komm: at("Kommentier"), va: at("A", 27.3), vb: at("B", 27.7), vc: at("C", 28.1),
  morgen: at("Morgen"), gewinner: at("Gewinner"), folg: at("Folg"), anderen: at("anderen"),
};
const SPAWN = T.helfer + 0.05;
const VOTE = [T.va, T.vb, T.vc];
const BUILD = [T.minuten - 0.2, T.minuten + 0.25, T.minuten + 0.7, T.namen - 0.1];

// ---------- world layout ----------
const HQ: V3 = [0, 0, 5];
const HQR = 4.4;
const BLD: V3 = [0.9, 0.45, 3.3];
const MON: V3 = [2.4, 2.35, 7.0];
const BILL: V3 = [-2.5, 2.5, 4.6];
const RES: V3 = [7.4, 0, -3.5];
const PORTAL: V3 = [8.3, 2.7, -4.4];
const RBOARD: V3 = [5.2, 3.2, -3.0];
const ISL: V3[] = [[-4, 0, -11.5], [4, 0, -17], [-4, 0, -22.5]];
const IR = 2.9;
const OPT_T = [T.a, T.b, T.c];
const OPT_END = [T.b - 0.1, T.c - 0.1, T.komm - 0.25];

// ---------- camera ----------
type Hold = { a: number; b: number; p0: V3; p1: V3; l0: V3; l1: V3 };
const optHold = (i: number): Hold => ({ a: OPT_T[i] - 0.05, b: OPT_END[i] - 0.3, p0: add(ISL[i], [0.5 * (i === 1 ? -1 : 1), 6.0, 10.6]), p1: add(ISL[i], [0, 5.6, 9.7]), l0: add(ISL[i], [0, 2.7, -0.6]), l1: add(ISL[i], [0, 2.6, -0.6]) });
const HOLDS: Hold[] = [
  { a: 0, b: T.tag - 0.3, p0: [0, 6.4, 18.4], p1: [0, 7.8, 20.2], l0: [0, 2.6, 4.4], l1: [0, 2.8, 4.0] },
  { a: T.tag + 0.15, b: SPAWN - 0.1, p0: [2.4, 3.0, 13.3], p1: [2.4, 2.9, 12.6], l0: [2.4, 2.35, 7.0], l1: [2.4, 2.35, 7.0] },
  { a: SPAWN + 0.12, b: T.durch - 0.15, p0: [1.0, 6.6, 16.2], p1: [0.8, 7.4, 17.0], l0: [0.6, 1.4, 5.2], l1: [0.6, 1.4, 5.0] },
  { a: T.durch + 0.35, b: T.minuten - 0.45, p0: [5.9, 5.2, 8.0], p1: [6.0, 4.9, 7.0], l0: [6.0, 2.6, -3.4], l1: [6.1, 2.6, -3.4] },
  { a: T.minuten - 0.05, b: T.nur - 0.1, p0: [-0.6, 5.6, 17.4], p1: [-0.6, 5.2, 16.2], l0: [-0.6, 3.0, 3.8], l1: [-0.6, 3.0, 3.8] },
  { a: T.nur + 0.05, b: T.womit2 - 0.2, p0: [0, 4.4, 13.2], p1: [0, 5.2, 14.4], l0: [0, 2.6, 4.6], l1: [0, 2.4, 4.0] },
  { a: T.womit2 + 0.35, b: T.a - 0.3, p0: [-1.5, 15.5, 6.0], p1: [-1.5, 15.0, 5.0], l0: [0, 0, -14], l1: [0, 0, -15] },
  optHold(0), optHold(1), optHold(2),
  { a: T.komm + 0.2, b: 40, p0: [0, 13.4, 13.6], p1: [0, 12.8, 12.4], l0: [0, 0.6, -9.5], l1: [0, 0.6, -10] },
];
const VIA: { pos: V3; look: V3 }[] = [
  { pos: [1.6, 4.2, 15.6], look: [2.0, 2.4, 6.8] },
  { pos: [2.0, 4.2, 14.8], look: [1.8, 2.0, 6.4] },
  { pos: [5.5, 9, 10], look: [6, 2, -1] },
  { pos: [3.5, 8, 11], look: [0, 2.4, 3] },
  { pos: [-0.4, 4.8, 14.4], look: [0, 2.6, 4] },
  { pos: [0, 10, 14], look: [0, 1, -3] },
  { pos: [-2.5, 9.5, 2.5], look: [-4, 1.5, -11] },
  { pos: [0, 8.5, -6], look: [4, 1.5, -17] },
  { pos: [0, 8.5, -11.5], look: [-4, 1.5, -22.5] },
  { pos: [-1, 12, -2], look: [0, 1, -8] },
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
const PUNCH = [T.claude, T.null, SPAWN, T.internet, T.nullplan, T.logo, T.website, T.fehlt, T.a, T.b, T.c, ...VOTE, T.morgen];

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
const miniBot = (c: CanvasRenderingContext2D, x: number, y: number, s: number) => {
  c.fillStyle = CO; c.fillRect(x - s * 0.8, y - s * 0.5, s * 1.6, s);
  c.fillRect(x - s * 0.98, y - s * 0.15, s * 0.2, s * 0.3); c.fillRect(x + s * 0.78, y - s * 0.15, s * 0.2, s * 0.3);
  c.fillStyle = CO_D; [-0.55, -0.2, 0.2, 0.55].forEach((d) => c.fillRect(x + d * s - s * 0.1, y + s * 0.5, s * 0.2, s * 0.3));
  c.fillStyle = INK; c.fillRect(x - s * 0.4, y - s * 0.25, s * 0.14, s * 0.32); c.fillRect(x + s * 0.26, y - s * 0.25, s * 0.14, s * 0.32);
};
const logoMark = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
  c.fillStyle = CO; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  c.strokeStyle = "#FFFFFF"; c.lineWidth = r * 0.22; c.beginPath(); c.ellipse(x, y, r * 0.42, r * 0.58, 0, 0, 7); c.stroke();
  c.beginPath(); c.moveTo(x - r * 0.62, y + r * 0.62); c.lineTo(x + r * 0.62, y - r * 0.62); c.stroke();
};

// ---------- canvas: Claude chat on the desk monitor ----------
const MW = 1000, MH = 660;
const PROMPT = "Bau eine Firma. Startkapital: 0 €. Die Community entscheidet.";
const drawMonitor = (c: CanvasRenderingContext2D, t: number, logo: HTMLImageElement | null) => {
  c.fillStyle = CREAM; c.fillRect(0, 0, MW, MH);
  c.fillStyle = "#EDEAE0"; c.fillRect(0, 0, MW, 64);
  if (logo) c.drawImage(logo, 24, 14, 36, 36);
  c.fillStyle = INK; c.font = `34px ${claudeSerif}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Claude", 72, 34);
  const n = Math.max(0, Math.min(PROMPT.length, Math.floor((t - T.tag + 0.1) * 70)));
  if (n === 0) {
    c.fillStyle = CO; c.font = `90px ${claudeSerif}`; c.textAlign = "center"; c.fillText("✳", MW / 2, 270);
    c.fillStyle = INK; c.font = `46px ${claudeSerif}`; c.fillText("Was bauen wir heute?", MW / 2, 380); c.textAlign = "left";
    return;
  }
  c.font = `28px Inter-Medium, sans-serif`;
  c.fillStyle = "#E6E1D3"; roundRect(c, MW - 640, 86, 610, 100, 20); c.fill();
  c.fillStyle = INK;
  const txt = PROMPT.slice(0, n);
  const cut = txt.length > 34 ? txt.lastIndexOf(" ", 34) : -1;
  if (cut > 0) { c.fillText(txt.slice(0, cut), MW - 618, 118); c.fillText(txt.slice(cut + 1), MW - 618, 156); } else c.fillText(txt, MW - 618, 118);
  if (t < T.startet - 0.2) return;
  c.fillStyle = CO; c.font = `32px ${claudeSerif}`; c.fillText("✳", 30, 232);
  c.fillStyle = INK; c.fillText("Ich starte 20 Helfer-Agenten.", 68, 232);
  for (let i = 0; i < 20; i++) {
    const k = back((t - T.startet - 0.05 - i * 0.04) / 0.25);
    if (k <= 0.01) continue;
    const col = i % 10, row = Math.floor(i / 10);
    const x = 92 + col * 90, y = 330 + row * 100;
    const gone = t > SPAWN;
    c.save(); c.translate(x, y); c.scale(k, k);
    c.fillStyle = gone ? "#E3F5E8" : "#FFFFFF"; roundRect(c, -38, -40, 76, 80, 16); c.fill();
    c.strokeStyle = gone ? GREEN : "#E0D9CB"; c.lineWidth = 3; roundRect(c, -38, -40, 76, 80, 16); c.stroke();
    if (!gone) miniBot(c, 0, -2, 26);
    else { c.fillStyle = GREEN; c.font = font(34); c.textAlign = "center"; c.fillText("✓", 0, 2); c.textAlign = "left"; }
    c.restore();
  }
  const press = t > SPAWN - 0.2 && t < SPAWN - 0.05;
  const done = t > SPAWN - 0.1;
  c.fillStyle = done ? GREEN : CO; roundRect(c, 330, 560 + (press ? 3 : 0), 340, 70, 20); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `30px Inter-Bold, sans-serif`; c.textAlign = "center"; c.fillText(done ? "✓ 20 Agenten laufen" : "Alle starten", 500, 597 + (press ? 3 : 0)); c.textAlign = "left";
  if (t > T.zwanzig - 0.2 && t < SPAWN + 0.5) {
    const hk = ease((t - T.zwanzig + 0.2) / Math.max(0.2, SPAWN - T.zwanzig - 0.1));
    hand(c, 760 + (500 - 760) * hk, 680 + (604 - 680) * hk, press, 6);
  }
  if (t >= SPAWN - 0.1 && t < SPAWN + 0.4) { const r = cl((t - SPAWN + 0.1) / 0.45); c.strokeStyle = `rgba(63,182,107,${1 - r})`; c.lineWidth = 7; c.beginPath(); c.arc(500, 595, 30 + 120 * r, 0, 7); c.stroke(); }
};

// ---------- canvas: web research board ----------
const RW = 900, RH = 700;
const QUERY = "womit verdienen leute online geld";
const RESULTS = ["Creator & Videos", "Apps & Tools", "Online-Shops", "Newsletter", "KI-Accounts"];
const drawResearch = (c: CanvasRenderingContext2D, t: number) => {
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, RW, RH, 40); c.fill();
  c.strokeStyle = INK; c.lineWidth = 8; roundRect(c, 4, 4, RW - 8, RH - 8, 36); c.stroke();
  c.fillStyle = "#F1EEE6"; roundRect(c, 8, 8, RW - 16, 76, 30); c.fill();
  ["#FF5F57", "#FEBC2E", "#28C840"].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(46 + i * 30, 46, 9, 0, 7); c.fill(); });
  c.fillStyle = INK; c.font = font(30); c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Recherche · 20 Agenten", 150, 48);
  const n = Math.max(0, Math.min(QUERY.length, Math.floor((t - T.durch - 0.2) * 40)));
  c.fillStyle = "#FFFFFF"; roundRect(c, 40, 112, RW - 80, 74, 37); c.fill();
  c.strokeStyle = n > 0 ? PURPLE : "#DDD6C8"; c.lineWidth = 5; roundRect(c, 40, 112, RW - 80, 74, 37); c.stroke();
  c.strokeStyle = "#8A857D"; c.lineWidth = 5; c.beginPath(); c.arc(78, 146, 13, 0, 7); c.stroke(); c.beginPath(); c.moveTo(88, 156); c.lineTo(100, 168); c.stroke();
  c.fillStyle = INK; c.font = `30px Inter-Medium, sans-serif`; c.fillText(QUERY.slice(0, n) + (n < QUERY.length && Math.floor(t * 4) % 2 ? "|" : ""), 116, 150);
  RESULTS.forEach((r, i) => {
    const a0 = T.internet + 0.35 + i * 0.32;
    const k = back((t - a0) / 0.3);
    if (k <= 0.01) return;
    const y = 220 + i * 92;
    c.save(); c.translate(RW / 2, y + 38); c.scale(1, k); c.translate(-RW / 2, -(y + 38));
    c.fillStyle = "#FAF8F3"; roundRect(c, 40, y, RW - 80, 76, 20); c.fill();
    miniBot(c, 92, y + 38, 24);
    c.fillStyle = INK; c.font = `32px Inter-Bold, sans-serif`; c.fillText(r, 140, y + 40);
    const bw = 220 * ease((t - a0 - 0.1) / 0.7) * [1, 0.8, 0.65, 0.5, 0.9][i];
    c.fillStyle = "#EEE9DD"; roundRect(c, RW - 300, y + 26, 220, 24, 12); c.fill();
    c.fillStyle = PURPLE; roundRect(c, RW - 300, y + 26, Math.max(24, bw), 24, 12); c.fill();
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
  c.fillStyle = "#8A857D"; c.font = `20px Inter-Medium, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("nullplan · Entwurf", 450, 28); c.textAlign = "left";
  const k = ease((t - T.website + 0.05) / 0.5);
  if (k <= 0.01) {
    for (let i = -4; i < 14; i++) { c.fillStyle = i % 2 ? GOLD : INK; const o = (t * 60) % 160; c.beginPath(); c.moveTo(i * 80 + o, 54); c.lineTo(i * 80 + 80 + o, 54); c.lineTo(i * 80 + o, BH); c.lineTo(i * 80 - 80 + o, BH); c.fill(); }
    c.fillStyle = "#FFFFFF"; roundRect(c, 200, 230, 500, 120, 30); c.fill();
    c.fillStyle = INK; c.font = font(64); c.textAlign = "center"; c.fillText("IM BAU", 450, 294); c.textAlign = "left";
    return;
  }
  c.save(); c.globalAlpha = k; c.translate(0, (1 - k) * 30);
  logoMark(c, 64, 100, 26);
  c.fillStyle = INK; c.font = font(32); c.fillText("NULLPLAN", 104, 102);
  c.fillStyle = "#6E675C"; c.font = `22px Inter-Medium, sans-serif`; ["Mitmachen", "Tagebuch"].forEach((n, i) => c.fillText(n, 640 + i * 130, 102));
  c.fillStyle = INK; c.font = font(70); c.fillText("Wir haben", 40, 210); c.fillText("keinen Plan.", 40, 288);
  c.fillStyle = CO; c.fillText("Ihr schon.", 40, 366);
  c.fillStyle = CO; roundRect(c, 40, 410, 300, 66, 33); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `28px Inter-Bold, sans-serif`; c.fillText("Mitentscheiden →", 70, 444);
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
const drawInflu = (c: CanvasRenderingContext2D, t: number) => {
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
  void t;
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
const Island: React.FC<{ p: V3; r: number; t: number; glow?: number; col?: string; vis?: number; top?: string }> = ({ p, r, t, glow = 0, col, vis = 1, top = "#7FC46A" }) => {
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
        <meshStandardMaterial color="#8C5E3C" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, -1.85, 0]}>
        <coneGeometry args={[r * 0.45, 1.0, 10]} />
        <meshStandardMaterial color="#6E4A2E" roughness={0.9} flatShading />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => {
        const a = rnd(i + r * 7) * Math.PI * 2, d = r * (0.6 + rnd(i + 3) * 0.33);
        return <ToyBox key={i} p={[Math.cos(a) * d, 0.5, Math.sin(a) * d]} s={[0.18, 0.16 + rnd(i) * 0.14, 0.18]} color={i % 3 === 0 ? ["#FFD34D", "#FF7FA8", "#FFFFFF"][i % 3] : "#5FA84E"} />;
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

const Burst3D: React.FC<{ at: number; t: number; p: V3; colors: string[]; n?: number; power?: number; floor?: number }> = ({ at, t, p, colors, n = 16, power = 1, floor = 0.45 }) => {
  const k = t - at;
  if (k < 0 || k > 1.2) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + rnd(i + at) * 0.6;
        const v = (1.6 + rnd(i * 3 + at) * 2.0) * power;
        const up = 3 + rnd(i * 7 + at) * 3;
        const s = 0.16 * (1 - k / 1.2) + 0.04;
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

// voxel Claude: wide terracotta block, slit eyes, side nubs, four little legs
const ClaudeBot: React.FC<{ p: V3; yaw?: number; t: number; s?: number; squash?: number; happy?: boolean; vis?: number; wave?: number; seed?: number; carry?: string; tilt?: number }> = ({ p, yaw = 0, t, s = 1, squash = 0, happy, vis = 1, wave = 0, seed = 0, carry, tilt = 0 }) => {
  if (vis <= 0.001) return null;
  const bob = Math.abs(Math.sin(t * 4.6 + seed)) * 0.08;
  const blink = (t * 1.1 + seed * 0.3) % 2.9 < 0.09;
  const sy = 1 - 0.25 * squash, sx = 1 + 0.18 * squash;
  const step = Math.sin(t * 9 + seed) * 0.06;
  return (
    <group position={[p[0], p[1] + bob, p[2]]} rotation={[0, yaw, tilt]} scale={[s * vis * sx, s * vis * sy, s * vis]}>
      {[-0.55, -0.2, 0.2, 0.55].map((x, i) => (
        <mesh key={x} castShadow position={[x, 0.17 + (i % 2 ? step : -step), 0]}>
          <boxGeometry args={[0.2, 0.34, 0.24]} />
          <meshStandardMaterial color={CO_D} roughness={0.7} />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 0.82, 0]}>
        <boxGeometry args={[1.6, 1.0, 1.0]} />
        <meshStandardMaterial color={CO} roughness={0.65} flatShading />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} castShadow position={[side * 0.92, 0.82 + (side === 1 ? 0.25 * wave * Math.abs(Math.sin(t * 10 + seed)) : 0) + (carry ? 0.35 : 0), 0]} rotation={[0, 0, side === 1 ? wave * 0.6 : 0]}>
          <boxGeometry args={[0.26, 0.3, 0.5]} />
          <meshStandardMaterial color={CO} roughness={0.65} />
        </mesh>
      ))}
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.92, 0.505]}>
          <boxGeometry args={[0.13, blink ? 0.04 : happy ? 0.1 : 0.3, 0.02]} />
          <meshBasicMaterial color="#14110F" />
        </mesh>
      ))}
      {carry && <ToyBox p={[0, 1.65, 0]} s={[0.9, 0.55, 0.7]} color={carry} />}
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

// dioramas for the three internet businesses
const InfluSet: React.FC<{ p: V3; t: number; vis: number; tex: THREE.Texture }> = ({ p, t, vis, tex }) => (
  <group position={[p[0], 0.45, p[2]]} scale={vis}>
    <group position={[-0.7, 1.45, -0.2]} rotation={[-0.05, 0.25, 0]}>
      <ToyBox p={[0, 0, -0.08]} s={[1.5, 2.65, 0.14]} color="#1E1A22" />
      <mesh><planeGeometry args={[1.32, 2.36]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
    </group>
    <group position={[1.1, 0, 0.1]}>
      <ToyBox p={[0, 0.9, 0]} s={[0.1, 1.8, 0.1]} color="#2A2430" />
      <mesh position={[0, 2.0, 0]} rotation={[0, -0.4, 0]}><torusGeometry args={[0.5, 0.08, 10, 28]} /><meshBasicMaterial color="#FFF6D8" toneMapped={false} /></mesh>
    </group>
    {Array.from({ length: 7 }).map((_, i) => { const k = (t * 0.6 + i / 7) % 1; return <mesh key={i} position={[-0.7 + Math.sin(i * 2 + k * 6) * 0.6, 2.6 + k * 2.2, 0.1]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.22 * (1 - k * 0.5), 0.22 * (1 - k * 0.5), 0.08]} /><meshBasicMaterial color={OPT_COL[0]} transparent opacity={1 - k} toneMapped={false} /></mesh>; })}
    <group position={[1.3, 3.1, -0.6]}>
      <mesh><sphereGeometry args={[0.32, 16, 16]} /><meshBasicMaterial color="#FFF2B0" toneMapped={false} /></mesh>
      <mesh position={[0.16, 0.08, 0.05]}><sphereGeometry args={[0.28, 16, 16]} /><meshBasicMaterial color="#1A1530" /></mesh>
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
      <ToyBox p={[0, 1.95, 0]} s={[1.45, 1.25, 1.2]} color="#C9A57A" top="#D9B88E" rot={[0, 0.5, 0]} />
    </group>
    <group position={[-0.5, 0, 1.1]}>
      <ToyBox p={[0, 0.5, 0]} s={[0.06, 1.0, 0.06]} color="#2A2430" />
      <mesh position={[0, 1.1, 0]}><capsuleGeometry args={[0.13, 0.22, 6, 12]} /><meshStandardMaterial color="#3A3440" /></mesh>
    </group>
    <mesh position={[1.4, 0.3 + Math.abs(Math.sin(t * 5)) * 0.15, 1.0]}><boxGeometry args={[0.4, 0.4, 0.4]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh>
  </group>
);
const OutfitSet: React.FC<{ p: V3; t: number; vis: number; tex: THREE.Texture }> = ({ p, t, vis, tex }) => (
  <group position={[p[0], 0.45, p[2]]} scale={vis}>
    <group position={[0.8, 1.45, -0.3]} rotation={[-0.05, -0.25, 0]}>
      <ToyBox p={[0, 0, -0.08]} s={[1.5, 2.65, 0.14]} color="#1E1A22" />
      <mesh><planeGeometry args={[1.32, 2.36]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
    </group>
    <group position={[-1.2, 0, 0.2]}>
      <ToyBox p={[-0.7, 0.8, 0]} s={[0.08, 1.6, 0.08]} color="#2A2430" />
      <ToyBox p={[0.7, 0.8, 0]} s={[0.08, 1.6, 0.08]} color="#2A2430" />
      <ToyBox p={[0, 1.6, 0]} s={[1.5, 0.08, 0.08]} color="#2A2430" />
      {["#4C9BE8", "#FFD34D", "#E0559A"].map((col, i) => (
        <group key={i} position={[-0.45 + i * 0.45, 1.25, 0]} rotation={[0, 0, Math.sin(t * 3 + i) * 0.12]}>
          <ToyBox p={[0, 0, 0]} s={[0.38, 0.55, 0.12]} color={col} />
        </group>
      ))}
    </group>
    {Array.from({ length: 5 }).map((_, i) => { const a = t * 2 + (i / 5) * Math.PI * 2; return <mesh key={i} position={[0.8 + Math.cos(a) * 1.1, 2.9 + Math.sin(a * 2) * 0.2, -0.3 + Math.sin(a) * 0.5]}><octahedronGeometry args={[0.13]} /><meshBasicMaterial color={GOLD} toneMapped={false} /></mesh>; })}
  </group>
);

// HQ building that assembles while the agents carry blocks
const Building: React.FC<{ t: number; tex: Tex }> = ({ t, tex }) => {
  const fl = BUILD.map((b) => cl((t - b) / 0.32));
  const sign = back((t - T.nullplan + 0.05) / 0.35);
  const logo = back((t - T.logo + 0.05) / 0.4);
  const wireVis = 1 - ease((t - T.tag) / 0.6);
  const flat = React.useMemo(() => new THREE.Quaternion(), []);
  return (
    <group position={BLD}>
      {wireVis > 0.01 && [0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[0, 0.8 + i * 1.25, -0.4]} scale={[1 - i * 0.08, 1, 1 - i * 0.08]}>
          <boxGeometry args={[3.0, 1.15, 2.2]} />
          <meshBasicMaterial color={GOLD} wireframe transparent opacity={(0.28 + 0.2 * Math.sin(t * 6 + i)) * wireVis} toneMapped={false} />
        </mesh>
      ))}
      <ToyBox p={[0, 0.08, 0]} s={[3.4, 0.16, 2.6]} color="#B9B2A6" top="#CFC8BB" />
      {[0, 1, 2].map((i) => fl[i] > 0 && (
        <group key={i} position={[0, 0.16 + 0.55 + i * 1.1 + (1 - ease(fl[i])) * 5, 0]}>
          <ToyBox p={[0, 0, 0]} s={[3.0, 1.1, 2.2]} color={i === 1 ? "#FFF6EA" : "#FFFFFF"} top="#F2EDE4" />
          {[-1.0, 0, 1.0].map((x) => <ToyBox key={x} p={[x, 0.05, 1.11]} s={[0.6, 0.55, 0.04]} color="#BFE3F2" emissive="#FFE6B0" ei={0.25 + 0.25 * Math.sin(t * 3 + x + i)} />)}
        </group>
      ))}
      {fl[3] > 0 && (
        <mesh position={[0, 3.66 + 0.6 + (1 - ease(fl[3])) * 5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.3, 1.2, 4]} />
          <meshStandardMaterial color={CO} roughness={0.6} flatShading />
        </mesh>
      )}
      {sign > 0.01 && (
        <group position={[0, 2.9, 1.2]} scale={sign}>
          <ToyBox p={[0, 0, -0.04]} s={[2.6, 0.62, 0.08]} color={INK} />
          <mesh position={[0, 0, 0.01]}><planeGeometry args={[2.5, 0.54]} /><meshBasicMaterial map={tex.nameSign} toneMapped={false} /></mesh>
        </group>
      )}
      {logo > 0.01 && (
        <group position={[0, 5.55, 0]} rotation={[0, t * 1.6, 0]} scale={logo}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.75, 0.75, 0.18, 32]} />
            <meshStandardMaterial attach="material-0" color={CO_D} />
            <meshBasicMaterial attach="material-1" map={tex.logo} toneMapped={false} />
            <meshBasicMaterial attach="material-2" map={tex.logo} toneMapped={false} />
          </mesh>
        </group>
      )}
      <pointLight position={[0, 2, 2.5]} intensity={4 * bump(t, T.nullplan, 0.5)} distance={7} color="#FFB48A" />
    </group>
  );
};

// 20 sub-agents: pop out of the monitor, then bustle around the HQ and carry blocks to the building
const SUBS = Array.from({ length: 20 }, (_, i) => {
  const a = (i / 20) * Math.PI * 2 + rnd(i) * 0.3;
  const r = 2.2 + rnd(i + 5) * 1.5;
  return { home: [HQ[0] + Math.cos(a) * r, 0.45, HQ[2] + Math.sin(a) * r * 0.8] as V3, seed: i * 1.7, delay: i * 0.035 };
});
const subAt = (i: number, t: number): { p: V3; yaw: number; carry?: string; vis: number } => {
  const s = SUBS[i];
  const k = (t - SPAWN - s.delay) / 0.55;
  if (k < 0) return { p: MON, yaw: 0, vis: 0 };
  if (k < 1) { const p = bez3([MON[0], MON[1], MON[2] + 0.3], [(MON[0] + s.home[0]) / 2, 4.5, (MON[2] + s.home[2]) / 2 + 1], s.home, ease(k)); return { p, yaw: k * 6, vis: 1 }; }
  if (t > T.minuten - 1.0 && t < T.namen + 0.4 && i % 2 === 0) {
    const ph = ((t - T.minuten + 1.0) * 0.9 + rnd(i)) % 1;
    const tgt: V3 = [BLD[0] + (rnd(i + 2) - 0.5) * 2.4, 0.45, BLD[2] + 1.6];
    const p = lerp3(s.home, tgt, ph < 0.5 ? ease(ph * 2) : 1 - ease((ph - 0.5) * 2));
    return { p, yaw: Math.atan2(tgt[0] - s.home[0], tgt[2] - s.home[2]) + (ph < 0.5 ? 0 : Math.PI), carry: ph < 0.5 ? ["#FFFFFF", CO, GOLD][i % 3] : undefined, vis: 1 };
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

  // big Claude's route
  type K = { a: number; b: number; p: V3; yaw: number };
  const KEYS: K[] = [
    { a: 0, b: T.tag - 0.2, p: [-1.2, 0.45, 7.4], yaw: 0.2 },
    { a: T.tag + 0.15, b: T.durch - 0.3, p: [0.6, 0.45, 7.6], yaw: 0.6 },
    { a: T.durch + 0.3, b: T.minuten - 0.6, p: [6.1, 0.45, -2.2], yaw: 0.4 },
    { a: T.minuten - 0.1, b: T.womit2 - 0.1, p: [-3.3, 0.45, 7.6], yaw: 0.4 },
    ...ISL.map((p, i): K => ({ a: OPT_T[i] + 0.15, b: OPT_END[i] - 0.15, p: add(p, [i === 1 ? 2.0 : -2.0, 0.45, -0.4]), yaw: i === 1 ? -0.5 : 0.5 })),
    { a: T.komm + 0.2, b: 40, p: [2.6, 0.45, 7.2], yaw: -0.3 },
  ];
  let cp: V3 = KEYS[0].p, cyaw = 0;
  for (let i = 0; i < KEYS.length; i++) {
    const k = KEYS[i];
    if (t <= k.b) {
      if (t >= k.a || i === 0) { cp = k.p; cyaw = k.yaw; }
      else { const pr = KEYS[i - 1]; const kk = inOut((t - pr.b) / (k.a - pr.b)); const pp = lerp3(pr.p, k.p, kk); cp = [pp[0], pp[1] + Math.sin(kk * Math.PI) * 3, pp[2]]; cyaw = pr.yaw + (k.yaw - pr.yaw) * kk + kk * Math.PI * 2; }
      break;
    }
  }
  const drop = t < T.claude + 0.4 ? (1 - ease((t - T.claude + 0.25) / 0.45)) * 9 : 0;
  const land = bump(t, T.claude + 0.2, 0.18);
  const camD = Math.hypot(cam.pos[0] - cp[0], cam.pos[1] - cp[1], cam.pos[2] - cp[2]);
  const optVis = (i: number) => back((t - T.womit2 - 0.1 - i * 0.15) / 0.4);
  const resVis = back((t - T.durch + 0.6) / 0.5);
  const look = cam.look;
  return (
    <>
      <CameraRig pos={cam.pos} look={look} fov={48 - 3 * punch} />
      <color attach="background" args={["#1A1530"]} />
      <fog attach="fog" args={["#1A1530", 24, 64]} />
      <ambientLight intensity={0.55} color="#D8D0FF" />
      <hemisphereLight args={["#FFE9D2", "#2C2350", 0.75]} />
      <primitive object={lightTarget} />
      <directionalLight position={[look[0] + 6, 16, look[2] + 9]} target={lightTarget} intensity={1.8} color="#FFE4C4" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-camera-far={60} shadow-bias={-0.0015} shadow-normalBias={0.04} />
      {/* stars */}
      {Array.from({ length: 90 }).map((_, i) => (
        <mesh key={i} position={[(rnd(i) - 0.5) * 70, -6 + rnd(i + 5) * 32, -45 + rnd(i + 9) * 70]}>
          <boxGeometry args={[0.13, 0.13, 0.13]} />
          <meshBasicMaterial color={i % 7 === 0 ? GOLD : "#FFFFFF"} transparent opacity={0.3 + 0.6 * Math.abs(Math.sin(t * 2 + i))} toneMapped={false} />
        </mesh>
      ))}
      {/* sparkles that always drift around the current shot */}
      {Array.from({ length: 40 }).map((_, i) => {
        const k = (t * (0.12 + rnd(i) * 0.12) + rnd(i + 1)) % 1;
        return (
          <mesh key={i} position={[look[0] + (rnd(i + 3) - 0.5) * 12 + Math.sin(t + i) * 0.4, look[1] - 3 + k * 9, look[2] + (rnd(i + 4) - 0.2) * 8]} rotation={[t + i, t * 1.3, 0]}>
            <octahedronGeometry args={[0.06 + rnd(i + 6) * 0.06]} />
            <meshBasicMaterial color={[GOLD, "#FFFFFF", CO, "#9BE7FF"][i % 4]} transparent opacity={Math.sin(k * Math.PI)} toneMapped={false} />
          </mesh>
        );
      })}
      {/* floating cubes + clouds */}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={i} position={[(rnd(i + 30) - 0.5) * 34, -4 + rnd(i + 40) * 5 + Math.sin(t + i) * 0.4, -30 + rnd(i + 50) * 42]} rotation={[t * 0.3 + i, t * 0.2, 0]}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color={["#3B3170", "#4A3C86", "#2E2860"][i % 3]} flatShading />
        </mesh>
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position={[((rnd(i + 70) * 40 + t * 0.6) % 40) - 20, 9 + rnd(i + 71) * 4, -28 + rnd(i + 72) * 34]}>
          {[0, 1, 2].map((j) => <mesh key={j} position={[j * 0.9 - 0.9, j === 1 ? 0.3 : 0, 0]}><boxGeometry args={[1.2, 0.8, 0.9]} /><meshStandardMaterial color="#5B4F9A" transparent opacity={0.55} flatShading /></mesh>)}
        </group>
      ))}
      {/* drone swarm of mini Claudes circling the world */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = t * 0.45 + (i / 14) * Math.PI * 2;
        const R = 9 + (i % 3) * 1.5;
        const p: V3 = [Math.cos(a) * R, 8.5 + Math.sin(t * 2 + i) * 0.6 + (i % 2) * 1.2, -5 + Math.sin(a) * R * 1.1];
        return <ClaudeBot key={i} p={p} yaw={-a} t={t} s={0.32} seed={i} tilt={0.25} />;
      })}
      {/* data packets flying from the portal to the HQ */}
      {t > T.durch && Array.from({ length: 16 }).map((_, i) => {
        const k = (t * 0.55 + i / 16) % 1;
        const p = bez3(add(PORTAL, [0, 0, 0.3]), [4, 6.5, 2], [BLD[0], 2.5, BLD[2]], k);
        return <mesh key={i} position={p}><boxGeometry args={[0.16, 0.16, 0.16]} /><meshBasicMaterial color={[PURPLE, "#9BE7FF", GOLD][i % 3]} toneMapped={false} /></mesh>;
      })}

      {/* ---- HQ island ---- */}
      <Island p={HQ} r={HQR} t={t} />
      <Building t={t} tex={tex} />
      <group position={[MON[0], 0.45, MON[2] + 0.2]}>
        <ToyBox p={[0, 0.68, 0]} s={[3.2, 0.14, 1.0]} color="#A87A52" top="#C59368" />
        {[[-1.45, -0.4], [1.45, -0.4], [-1.45, 0.4], [1.45, 0.4]].map(([x, z], i) => <ToyBox key={i} p={[x, 0.32, z]} s={[0.14, 0.62, 0.14]} color="#7A5434" />)}
        <ToyBox p={[0, 0.8, 0.25]} s={[1.1, 0.06, 0.36]} color="#3A3340" />
        <mesh position={[1.25, 0.92, 0.2]} castShadow><cylinderGeometry args={[0.13, 0.11, 0.3, 12]} /><meshStandardMaterial color={CO} /></mesh>
      </group>
      <group position={MON}>
        <ToyBox p={[0, 0, -0.1]} s={[3.0, 2.0, 0.16]} color="#2A2430" />
        <mesh><planeGeometry args={[2.8, 1.85]} /><meshBasicMaterial map={dyn.mon} toneMapped={false} /></mesh>
        <ToyBox p={[0, -1.2, -0.15]} s={[0.24, 0.5, 0.2]} color="#2A2430" />
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
      <Board p={[0, 5.2, 8.6]} tex={tex.sign} w={3.0} h={0.7} t={t} q={q} at={T.allein - 0.05} until={T.aber} tilt={-0.04} />
      {EP.options.map((o, i) => (
        <Keycap key={o.key} p={[-1.8 + i * 1.8, 4.0 + (i === 1 ? 0.35 : 0), 9.4]} tex={tex[`key${i}`]} col={OPT_COL[i]} t={t} a={T.aber + 0.1 + i * 0.16} press={T.du + i * 0.06} />
      ))}
      <Burst3D at={T.claude + 0.2} t={t} p={[-1.2, 0.6, 7.4]} colors={[CO, "#FFFFFF", GOLD]} n={22} power={1.2} />
      <Board p={[2.4, 4.05, 7.3]} tex={tex.zero} w={1.9} h={0.62} t={t} q={q} at={T.null - 0.05} until={T.startet - 0.1} tilt={0.06} />
      {/* sub-agents */}
      {SUBS.map((_, i) => { const s = subAt(i, t); return <ClaudeBot key={i} p={s.p} yaw={s.yaw} t={t} s={0.4} seed={i * 1.3} vis={s.vis} carry={s.carry} happy={t > T.website} />; })}
      <Burst3D at={SPAWN} t={t} p={[MON[0], MON[1], MON[2] + 0.5]} colors={[CO, "#FFFFFF", GOLD, GREEN]} n={30} power={1.5} floor={0.5} />
      <Board p={[0.4, 4.6, 7.4]} tex={tex.team} w={2.4} h={0.66} t={t} q={q} at={SPAWN + 0.3} until={T.durch - 0.1} tilt={-0.05} />
      {/* build moments */}
      <Burst3D at={T.nullplan} t={t} p={[BLD[0], 3.4, BLD[2] + 1.3]} colors={[CO, "#FFFFFF", GOLD]} n={26} power={1.4} />
      <Burst3D at={T.logo} t={t} p={[BLD[0], 5.5, BLD[2]]} colors={[CO, "#FFFFFF", GOLD]} n={20} power={1.1} floor={1} />
      <Burst3D at={T.website} t={t} p={[BILL[0], BILL[1], BILL[2] + 0.4]} colors={[CO, "#FFFFFF", GREEN]} n={22} power={1.2} floor={0.5} />
      <Board p={[-3.3, 3.2, 7.6]} tex={tex.qmark} w={1.0} h={1.0} t={t} q={q} at={T.fehlt - 0.1} until={T.womit2 + 0.1} bob={0.15} />

      {/* ---- research island with the internet portal ---- */}
      <Island p={RES} r={3.4} t={t} vis={resVis} top="#8E7FE0" />
      {resVis > 0.01 && (
        <group>
          <group position={PORTAL} scale={resVis}>
            <mesh rotation={[0, 0, t * 0.8]}><torusGeometry args={[1.55, 0.2, 12, 40]} /><meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={0.6} /></mesh>
            <mesh rotation={[0, 0, -t * 1.4]}><torusGeometry args={[1.2, 0.06, 8, 40]} /><meshBasicMaterial color="#9BE7FF" toneMapped={false} /></mesh>
            <mesh><circleGeometry args={[1.38, 40]} /><meshBasicMaterial color="#2B1D6B" transparent opacity={0.85} /></mesh>
            {Array.from({ length: 18 }).map((_, i) => { const a = (i / 18) * Math.PI * 2 + t * 2; const r = 1.3 * ((t * 0.8 + i * 0.13) % 1); return <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0.05]}><boxGeometry args={[0.1, 0.1, 0.02]} /><meshBasicMaterial color={i % 2 ? "#9BE7FF" : GOLD} toneMapped={false} /></mesh>; })}
            <ToyBox p={[0, -2.15, 0]} s={[2.6, 0.3, 0.8]} color="#3D2F7A" />
            <Board p={[0, 2.25, 0]} tex={tex.www} w={1.7} h={0.5} t={t} q={flat} bob={0.05} />
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
            return <ClaudeBot key={i} p={p} yaw={inward ? Math.atan2(to[0] - from[0], to[2] - from[2]) : Math.atan2(from[0] - to[0], from[2] - to[2])} t={t} s={0.36} seed={i + 40} vis={vis} carry={inward ? undefined : [PURPLE, GOLD, "#9BE7FF"][i % 3]} />;
          })}
          {["cVideo", "cApps", "cShops", "cNews"].map((key, i) => {
            const a0 = T.internet + 0.2 + i * 0.32;
            const k = cl((t - a0) / 0.6);
            if (k <= 0 || k >= 1) return null;
            const p = bez3(PORTAL, [6.9, 5.0, -2.6], add(RBOARD, [0, 0.4 - i * 0.2, 0.3]), ease(k));
            return <Board key={key} p={p} tex={tex[key]} w={1.5 * (1 - k * 0.5)} h={0.42 * (1 - k * 0.5)} t={t} q={q} bob={0} />;
          })}
        </group>
      )}
      <Burst3D at={T.internet} t={t} p={PORTAL} colors={[PURPLE, "#9BE7FF", "#FFFFFF"]} n={24} power={1.3} floor={0.5} />

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
            <Burst3D at={OPT_T[i] + 0.05} t={t} p={add(p, [0, 1.5, 0])} colors={[OPT_COL[i], "#FFFFFF", GOLD]} n={20} power={1.2} />
            <Burst3D at={VOTE[i]} t={t} p={add(p, [0, 1.5, 0])} colors={[OPT_COL[i], "#FFFFFF"]} n={20} power={1.6} />
          </group>
        );
      })}
      <Board p={add(ISL[0], [0.4, 1.35, 1.3])} tex={tex.never} w={2.0} h={0.52} t={t} q={q} at={T.schlaeft - 0.05} until={OPT_END[0] - 0.1} tilt={-0.05} />
      <Board p={add(ISL[1], [-0.3, 1.35, 1.3])} tex={tex.noface} w={2.1} h={0.52} t={t} q={q} at={T.gesicht - 0.05} until={OPT_END[1] - 0.1} tilt={0.05} />
      <Board p={add(ISL[2], [0.3, 1.35, 1.3])} tex={tex.score} w={2.0} h={0.52} t={t} q={q} at={T.bewertet - 0.05} until={OPT_END[2] - 0.1} tilt={-0.05} />
      {/* vote */}
      <Board p={[0, 9.6, 6.6]} tex={dyn.votes} w={2.9} h={1.8} t={t} q={q} at={T.komm - 0.1} until={T.morgen - 0.15} bob={0.04} />
      <Board p={[0, 9.6, 6.6]} tex={tex.tomorrow} w={3.3} h={0.78} t={t} q={q} at={T.morgen - 0.1} tilt={0.03} />
      <ClaudeBot p={[cp[0], cp[1] + drop, cp[2]]} yaw={cyaw} t={t} s={1.0} squash={land} happy={t > T.website && t < T.nur} wave={(t > T.tag && t < T.startet) || t > T.folg ? 1 : 0} vis={cl((camD - 2.4) / 1.5)} />
      {ISL.map((p, i) => optVis(i) > 0.01 && (
        <group key={i} position={add(p, [i === 1 ? -2.0 : 2.0, 0.45, -0.9])} scale={0.42 * optVis(i)}>
          <BlockBuddy p={[0, 0.58, 0]} yaw={i === 1 ? 0.5 : -0.5} color={["#5E8FE0", "#F0C04C", "#5CC08A"][i]} dark={["#3E62A8", "#B88D24", "#3A8A60"][i]} t={t} seed={i * 2} accessory={(["cap", "bolt", "headband"] as const)[i]} accent="#FFFFFF" />
        </group>
      ))}
    </>
  );
};

// ---------- textures ----------
const useStaticTex = (ready: boolean) =>
  React.useMemo(() => {
    if (!ready) return null;
    const t: Tex = {};
    EP.options.forEach((o, i) => { t[`key${i}`] = keyTex(o.key, OPT_COL[i]); });
    t.whatif = pillTex("WAS WÄRE, WENN …?", CO, "#FFFFFF", 900, 214);
    t.days = pillTex("100 TAGE", GOLD, INK, 620, 200);
    t.day100 = pillTex("TAG 100 ?", GOLD, INK, 620, 170);
    t.sign = pillTex("FIRMA: ???", "#FFFFFF", INK, 820, 190);
    t.zero = pillTex("KASSE: 0 €", RED, "#FFFFFF", 620, 200);
    t.team = pillTex("+20 AGENTEN", GREEN, "#FFFFFF", 700, 190);
    t.www = pillTex("INTERNET", PURPLE, "#FFFFFF", 620, 180);
    t.cVideo = pillTex("▶ VIDEOS", RED, "#FFFFFF", 560, 160);
    t.cApps = pillTex("▣ APPS", "#4C9BE8", "#FFFFFF", 560, 160);
    t.cShops = pillTex("● SHOPS", GREEN, "#FFFFFF", 560, 160);
    t.cNews = pillTex("✉ NEWSLETTER", GOLD, INK, 560, 160);
    t.never = pillTex("SCHLÄFT NIE", "#E0559A", "#FFFFFF", 700, 180);
    t.noface = pillTex("0 GESICHTER", RED, "#FFFFFF", 700, 180);
    t.score = pillTex("★ 8,7 / 10", "#4C9BE8", "#FFFFFF", 700, 180);
    t.nameSign = canvasTex(1000, 216, (c) => { c.fillStyle = INK; c.fillRect(0, 0, 1000, 216); logoMark(c, 110, 108, 70); c.fillStyle = "#FFFFFF"; c.font = font(120); c.textBaseline = "middle"; c.fillText(EP.name, 210, 116); });
    t.logo = canvasTex(256, 256, (c) => { c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, 256, 256); logoMark(c, 128, 128, 110); });
    t.qmark = canvasTex(256, 256, (c) => { c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(128, 128, 118, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 10; c.stroke(); c.fillStyle = INK; c.font = font(170); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("?", 128, 140); });
    t.tomorrow = canvasTex(1100, 260, (c) => {
      c.fillStyle = "rgba(0,0,0,.35)"; roundRect(c, 8, 16, 1092, 244, 50); c.fill();
      c.fillStyle = INK; roundRect(c, 0, 0, 1092, 244, 50); c.fill();
      c.strokeStyle = GOLD; c.lineWidth = 8; roundRect(c, 4, 4, 1084, 236, 46); c.stroke();
      c.fillStyle = GOLD; c.font = font(46); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(`MORGEN · TAG ${EP.day + 1}`, 546, 74);
      c.fillStyle = "#FFFFFF"; c.font = font(70); c.fillText("Claude baut den Gewinner", 546, 162);
    });
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
  const influ = useDyn(360, 640, (c) => drawInflu(c, t));
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
  const chip = (children: React.ReactNode) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(20,16,36,.82)", border: "4px solid rgba(255,255,255,.18)", borderRadius: 26, padding: "10px 22px", boxShadow: "0 6px 0 rgba(0,0,0,.45)" }}>{children}</div>
  );
  const txt: React.CSSProperties = { fontFamily: pixelFont, fontWeight: 800, fontSize: 40, color: "#FFFFFF", lineHeight: 1 };
  return (
    <div style={{ position: "absolute", top: 96, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: k, transform: `translateY(${(1 - k) * -30}px)` }}>
      <div style={{ display: "flex", gap: 14 }}>
        {chip(<span style={{ ...txt, color: GOLD }}>TAG {EP.day}<span style={{ color: "rgba(255,255,255,.55)", fontSize: 30 }}> / 100</span></span>)}
        {chip(<><div style={{ width: 34, height: 34, borderRadius: 17, background: GOLD, border: "4px solid #B88D24" }} /><span style={{ ...txt, display: "inline-block", transform: `scale(${cashPulse})`, color: bump(t, T.null + 0.1, 0.4) > 0 ? "#FF8A8D" : "#FFFFFF" }}>{EP.cash} €</span></>)}
        {chip(<><div style={{ width: 30, height: 22, borderRadius: 6, background: CO }} /><span style={{ ...txt, display: "inline-block", transform: `scale(${teamPulse})`, color: teamPulse > 1.05 ? "#8FF0B0" : "#FFFFFF" }}>TEAM {team}</span></>)}
      </div>
      <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 28, letterSpacing: 1, color: "#FFFFFF", background: CO, padding: "8px 20px", borderRadius: 14, border: "3px solid rgba(0,0,0,.5)" }}>
        CLAUDE BAUT EINE FIRMA · DU ENTSCHEIDEST
      </div>
    </div>
  );
};

// ---------- audio ----------
type Sfx = [string, number, number];
const TRANSITS = HOLDS.slice(0, -1).map((h) => h.b);
const SFX: Sfx[] = [
  ...TRANSITS.map((c): Sfx => ["whoosh-quick", c - 0.02, 0.42]),
  ["riser", T.claude - 0.5, 0.18], ["bump", T.claude + 0.2, 0.5], ["jump", T.claude + 0.25, 0.25],
  ["coin", T.hundert, 0.3], ["ui-pop", T.allein, 0.35],
  ...[0, 1, 2].map((i): Sfx => ["ui-pop", T.aber + 0.1 + i * 0.16, 0.4]), ["click", T.du, 0.6],
  ["typing", T.tag, 0.22], ["stamp", T.null, 0.35],
  ...Array.from({ length: 6 }, (_, i): Sfx => ["ui-pop", T.startet + i * 0.13, 0.18]),
  ["click", SPAWN - 0.15, 0.6], ["powerup", SPAWN, 0.3],
  ...Array.from({ length: 8 }, (_, i): Sfx => ["jump", SPAWN + 0.2 + i * 0.07, 0.12]),
  ["typing", T.durch + 0.2, 0.2], ["click", T.internet - 0.1, 0.5], ["chime", T.internet, 0.3],
  ...Array.from({ length: 5 }, (_, i): Sfx => ["check", T.internet + 0.35 + i * 0.32, 0.2]),
  ...BUILD.map((b): Sfx => ["bump", b + 0.3, 0.4]),
  ["stamp", T.nullplan, 0.45], ["chime", T.nullplan + 0.05, 0.3], ["powerup", T.logo, 0.3], ["ui-pop", T.website, 0.45], ["chime", T.website + 0.1, 0.25],
  ["bump", T.fehlt, 0.35],
  ...[0, 1, 2].map((i): Sfx => ["ui-pop", T.womit2 + 0.1 + i * 0.15, 0.35]),
  ...[0, 1, 2].map((i): Sfx => ["powerup", OPT_T[i], 0.25]),
  ...[0, 1, 2].flatMap((i): Sfx[] => [0, 1, 2].map((r): Sfx => ["check", OPT_T[i] + 0.6 + r * 0.25, 0.18])),
  ["stamp", T.schlaeft, 0.3], ["stamp", T.gesicht, 0.3], ["coin", T.bewertet, 0.3],
  ["ui-pop", T.komm - 0.1, 0.4], ...VOTE.map((v): Sfx => ["ui-pop", v, 0.45]),
  ["powerup", T.morgen, 0.3], ["bump", T.folg, 0.3],
];

export const ClaudeFirmaDay1: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const ready = useFontsReady([`800 40px ${pixelFont}`, "40px Inter-Bold", "40px Inter-Medium", `40px ${claudeSerif}`]);
  const logo = useImage(staticFile("logos/claude.svg"));
  const tex = useStaticTex(ready);
  const dyn = useDynTex(t, logo);
  const a = camAt(t - 0.03).pos, b = camAt(t + 0.03).pos;
  const speed = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 0.06;
  const blur = Math.min(3.5, Math.max(0, (speed - 8) * 0.12));
  const flash = 0.3 * bump(t, T.claude + 0.2, 0.1) + 0.3 * bump(t, SPAWN, 0.08) + 0.3 * bump(t, T.nullplan, 0.08) + 0.2 * bump(t, T.internet, 0.08);
  return (
    <AbsoluteFill style={{ background: "#1A1530" }}>
      {tex && (
        <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
          <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
            <World t={t} tex={tex} dyn={dyn} />
          </ThreeCanvas>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(8,4,20,.5) 100%)" }} />
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
      <Hud t={t} />
      <PillCaptions words={WD} theme={THEMES.night} />
      <Audio src={staticFile("cbf1/voice2.mp3")} />
      <Audio src={staticFile("sirtoken/music.mp3")} volume={0.085} loop />
      {SFX.map(([n, s, v], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s * 30))} durationInFrames={90}>
          <Audio src={staticFile(`sirtoken/sfx-${n}.mp3`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
