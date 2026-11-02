// "Ein Superkind-Agent baut eine Firma", Tag 2 (v2, 2026-10-22: Trainer-3D room look, sticker labels, Claude paper windows). Nobody voted on Tag 1, so the unknown sender decided:
// neither A nor B, "Bau KI-Automatisierungen für Firmen". Superkind is only visible (monitor app, HUD), never spoken.
// recap → midnight mail → first customer (Steuerkanzlei, 200 invoices) → +900 € → domain, ad, server bought → Kanzlei wants more
// → decision from you → second mail "Danke." → only now the pitch (A Werbung / B Monats-Abo) → red eyes → hard cut → black.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BlockBuddy, CameraRig, ToyBox, canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, THEMES, Word, pixelFont } from "../components/PixelKit";
import { claudeSerif } from "../components/ClaudeUI";
import words from "../../public/cbf2/words1.json";
import { EPISODES, SHOP } from "./superkindEconomy";

export const SK_TAG1_SECONDS = 43.9;
const W = 1080, H = 1920;
type V3 = [number, number, number];
const OR = "#FF6B35", OR_D = "#E5521F", INK = "#16130F", MUTED = "#8A857D", GOLD = "#F5C542", RED = "#E5484D", GREEN = "#1F9D55", PURPLE = "#8B6CF0", EVIL = "#FF2E3A";
const SERIF = `"${claudeSerif.replace(/"/g, "")}"`;
const CREAM = "#F6EEDC", PAPER = "#F4EFE5", WOOD = "#1A100C";
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
const font = (px: number) => `900 ${px}px Rubik`;
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
const E1 = EPISODES[0], E2 = EPISODES[1];
const EP = {
  day: 2,
  old: E1.options.map((o) => ({ key: o.key, title: o.title })),
  options: E2.options.map((o) => ({ key: o.key, title: o.title, risk: o.risk, pot: o.pot })),
};
const eur = (v: number) => `${Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;
const price = (id: string) => SHOP.find((u) => u.id === id)!.price;

// ---------- key times ----------
const T = {
  ideen: at("Ideen"), mail0: at("Mail,"), und0: at("Und"), niemand: at("niemand"), kein: at("Kein", 5),
  also1: at("Also"), mitter: at("Mitternacht"), mail1: at("Mail.", 7.9), weder: at("Weder"), bau: at("Bau"), firmen1: at("Firmen.", 11.5),
  der: at("Der", 12), wider: at("widersprechen"), also2: at("Also", 14),
  erster: at("Erster"), kanzlei: at("Steuerkanzlei"), zweih: at("Zweihundert"), alles: at("Alles"), nacht: at("Eine", 19.5), allein: at("Allein"),
  neun: at("Neunhundert"), domain: at("Domain"), werbung: at("Werbung"), server: at("Server"), gekauft: at("Gekauft"),
  dann: at("Dann"), mehr: at("mehr"), und1: at("Und", 28), zweiF: at("zwei", 29), jetzt: at("Jetzt"), entsch: at("Entscheidung"), von: at("Von", 32),
  aber: at("Aber"), mail2: at("Mail.", 34), gleicher: at("Gleicher"), nur: at("Nur", 36), danke: at("Danke."), wofuer: at("wofür"),
  va: at("A:", 38), schnell: at("Schnell"), vb: at("B:", 41), kunden2: at("Kunden,", 43), bleiben: at("bleiben"),
  und3: at("Und", 44), weiss: at("weiß"), ab: at("A", 46.5), bq: at("B?", 47), folg: at("Folg"), sonst: at("Sonst"), anderen: at("anderen"),
};
export const SK_TAG2_SECONDS = Math.ceil((T.anderen + 1.25) * 10) / 10;
const VOTE = [T.ab, T.bq];
const MIDNIGHT = T.folg + 0.35;
const EYES = T.weiss + 0.05;
const BLACK = T.anderen + 0.58;
// money: +900 € from the Kanzlei (sealed outcome of Tag 1, option C), then three buys from the shop ladder → 385 €
const BUY: Record<string, number> = { domain: T.domain, ads1: T.werbung, server: T.server };
const owned = (t: number) => Object.keys(BUY).filter((k) => t > BUY[k]);
const GAIN = E1.result!.outcome.delta;
const cashAt = (t: number) => {
  if (t < T.neun) return 0;
  const k: [number, number][] = [[T.neun, 0], [T.neun + 0.8, GAIN]];
  let c = GAIN;
  for (const id of Object.keys(BUY)) { k.push([BUY[id], c]); c -= price(id); k.push([BUY[id] + 0.3, c]); }
  return keys(t, k);
};
// invoices: slow by hand, then the agent does all 200 in one go
const invAt = (t: number) => t < T.zweih ? 0 : t < T.nacht ? Math.floor(((t - T.zweih) / (T.nacht - T.zweih)) * 6) : Math.round(6 + 194 * ease((t - T.nacht - 0.2) / Math.max(0.3, T.allein - T.nacht - 0.3)));

// ---------- light: midnight → dawn when he starts building → day → dusk at the second mail → night at the pitch ----------
const DAWN = T.also2 + 0.2, MORNING = T.erster - 0.2, EVE = T.aber + 0.2, DUSKT = T.danke - 0.4, NIGHTT = T.va - 0.3;
const DAY = "#8FD3F4", SUNSET = "#F2A07A", DUSK = "#5C4A8C", NIGHT = "#120E22";
const SKY: [number, string][] = [[0, NIGHT], [T.wider, NIGHT], [DAWN, SUNSET], [MORNING, DAY], [T.von, DAY], [EVE, SUNSET], [DUSKT, DUSK], [NIGHTT, NIGHT]];
const nightAt = (t: number) => keys(t, [[0, 1], [T.wider, 1], [DAWN, 0.45], [MORNING, 0], [T.von, 0], [EVE, 0.15], [DUSKT, 0.45], [NIGHTT, 1]]);
const lin = (t: number, k: [number, number][]) => {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (t <= k[i][0]) { const [a0, v0] = k[i - 1], [a1, v1] = k[i]; return v0 + (v1 - v0) * ((t - a0) / Math.max(0.001, a1 - a0)); }
  return k[k.length - 1][1] + (t - k[k.length - 1][0]) * 0.5;
};
const H_ = 60;
const clockAt = (t: number) => lin(t, [[0, 23 * H_ + 58], [T.mitter, 24 * H_], [T.also2, 30 * H_ + 30], [T.erster, 32 * H_], [T.neun, 37 * H_], [T.aber, 43 * H_ + 30], [T.va, 47 * H_ + 40], [MIDNIGHT, 48 * H_]]);
const hhmm = (m: number) => { const mm = Math.floor(m) % (24 * 60); return `${String(Math.floor(mm / 60)).padStart(2, "0")}:${String(mm % 60).padStart(2, "0")}`; };
const dayAt = (t: number) => (t < T.mitter ? 1 : t < MIDNIGHT ? 2 : 3);

// ---------- world layout ----------
const HQ: V3 = [0, 0, 5];
const HQR = 4.4;
const BLD: V3 = [0.9, 0.45, 3.3];
const MON: V3 = [2.4, 2.35, 7.0];
const BILL: V3 = [-2.5, 2.5, 4.6];
const RIV: V3 = [-8.5, 0, -0.5];
const ISL: V3[] = [[-3.6, 0, -10.5], [3.6, 0, -15]];
const IR = 2.9;
const KZ: V3 = [7.4, 0, -3.5];
const KZR = 3.2;
const FIRMS: V3[] = [[11.0, 0, -8.6], [12.4, 0, -0.9]];
const STACK: V3 = add(KZ, [-0.6, 0.45, 0.9]);
const DONE: V3 = add(KZ, [1.7, 0.45, 0.9]);
const KSCREEN: V3 = add(KZ, [1.1, 1.85, -1.3]);
const SERVER: V3 = [4.1, 0.45, 5.8];
const SIGN: V3 = [-2.6, 0.45, 8.0];
const SHOPB: V3 = [-0.6, 3.7, 8.0];
const OPT_T = [T.va, T.vb];
const OPT_END = [T.vb - 0.1, T.und3 - 0.1];
const HERO_HOOK: V3 = [-1.2, 0.45, 7.4];
const HERO_DESK: V3 = [0.2, 0.45, 9.6];
const HERO_KZ: V3 = add(KZ, [0.5, 0.45, 1.4]);
const RIV_AG: V3 = add(RIV, [0.2, 0.45, 0.6]);
const HERO_B: V3 = add(ISL[1], [2.0, 0.45, -0.4]);

// ---------- camera ----------
type Hold = { a: number; b: number; p0: V3; p1: V3; l0: V3; l1: V3 };
const optHold = (i: number): Hold => ({ a: OPT_T[i] - 0.05, b: OPT_END[i] - 0.25, p0: add(ISL[i], [0.5 * (i === 1 ? -1 : 1), 6.0, 10.6]), p1: add(ISL[i], [0, 5.6, 9.7]), l0: add(ISL[i], [0, 2.7, -0.6]), l1: add(ISL[i], [0, 2.6, -0.6]) });
const RECAP: V3 = [0, 4.5, -6];
const HOLDS: Hold[] = [
  // gestern: the two ideas, still standing
  { a: 0, b: T.und0 - 0.2, p0: [0, 12.6, 9.2], p1: [0, 11.6, 7.4], l0: [0, 1.0, -12.5], l1: [0, 1.4, -11.5] },
  // nobody voted
  { a: T.und0 + 0.05, b: T.also1 - 0.15, p0: add(RECAP, [0, 1.3, 7.6]), p1: add(RECAP, [0, 1.0, 6.4]), l0: RECAP, l1: RECAP },
  // midnight mail
  { a: T.also1 + 0.2, b: T.firmen1 + 0.35, p0: [2.6, 3.4, 15.0], p1: [2.5, 3.0, 14.0], l0: MON, l1: MON },
  // the agent may not say no
  { a: T.der + 0.1, b: T.also2 - 0.05, p0: add(HERO_DESK, [0.7, 2.5, 6.4]), p1: add(HERO_DESK, [0.5, 2.3, 5.4]), l0: add(HERO_DESK, [0.3, 1.5, 0]), l1: add(HERO_DESK, [0.3, 1.5, 0]) },
  // the Kanzlei: 200 invoices by hand
  { a: T.erster - 0.1, b: T.nacht - 0.15, p0: add(KZ, [0.3, 4.4, 9.8]), p1: add(KZ, [0.2, 3.9, 8.4]), l0: add(KZ, [0.1, 1.4, 0]), l1: add(KZ, [0.1, 1.4, 0]) },
  // one night later the agent does it alone
  { a: T.nacht + 0.05, b: T.neun - 0.15, p0: add(KZ, [0.8, 3.7, 7.8]), p1: add(KZ, [0.6, 3.4, 7.0]), l0: add(KZ, [0.6, 1.4, 0.4]), l1: add(KZ, [0.6, 1.4, 0.4]) },
  // 900 € → shop
  { a: T.neun + 0.1, b: T.dann - 0.15, p0: [-0.3, 6.0, 16.6], p1: [-0.1, 5.6, 15.5], l0: [0.3, 2.3, 4.8], l1: [0.3, 2.3, 4.8] },
  // the Kanzlei calls again
  { a: T.dann + 0.1, b: T.und1 - 0.1, p0: [2.6, 3.4, 15.0], p1: [2.5, 3.0, 14.0], l0: MON, l1: MON },
  // … and knows two other firms
  { a: T.und1 + 0.15, b: T.jetzt - 0.15, p0: [5.4, 8.6, 10.0], p1: [5.8, 7.8, 8.6], l0: [9.8, 1.2, -4.4], l1: [9.8, 1.2, -4.4] },
  // now he needs a decision, from you
  { a: T.jetzt + 0.1, b: T.aber - 0.15, p0: add(HERO_DESK, [0.7, 2.5, 6.4]), p1: add(HERO_DESK, [0.5, 2.3, 5.4]), l0: add(HERO_DESK, [0.3, 1.5, 0]), l1: add(HERO_DESK, [0.3, 1.5, 0]) },
  // second mail: "Danke."
  { a: T.aber + 0.15, b: T.va - 0.2, p0: [2.6, 3.4, 15.0], p1: [2.5, 3.0, 13.9], l0: MON, l1: MON },
  optHold(0), optHold(1),
  { a: T.und3 + 0.25, b: T.ab - 0.45, p0: [-1.0, 3.4, 12.5], p1: [-3.8, 2.6, 7.4], l0: [-5, 1.5, 3], l1: add(RIV, [0, 1.3, 0]) },
  { a: T.ab - 0.1, b: T.sonst - 0.03, p0: [0, 13.4, 10.6], p1: [0, 12.9, 9.8], l0: [0, 0.6, -12.5], l1: [0, 0.6, -13] },
  // hard cut (a == previous b): straight into the red eyes
  { a: T.sonst - 0.03, b: 60, p0: add(RIV_AG, [2.3, 1.5, 3.8]), p1: add(RIV_AG, [1.7, 1.3, 2.8]), l0: add(RIV_AG, [0, 1.25, 0]), l1: add(RIV_AG, [0, 1.3, 0]) },
];
const VIA: { pos: V3; look: V3 }[] = [
  { pos: [0, 8.5, 3], look: [0, 3, -8] },
  { pos: [1.5, 6.5, 8], look: [2, 2.6, 2] },
  { pos: [1.6, 3.2, 14], look: [1.2, 2, 8] },
  { pos: [5, 8, 10], look: [6, 2, -1] },
  { pos: add(KZ, [0.5, 3.6, 7.4]), look: add(KZ, [0.3, 1.4, 0.2]) },
  { pos: [5.5, 7.5, 12], look: [2, 2.4, 3] },
  { pos: [1.6, 4.2, 14.5], look: [1.8, 2.2, 6.5] },
  { pos: [4.5, 6.5, 13], look: [6, 2, 1] },
  { pos: [5, 5.5, 13], look: [2, 2, 7] },
  { pos: [1.8, 3.2, 15], look: [1.5, 2.2, 8] },
  { pos: [-0.5, 12, 9], look: [0, 1, -10] },
  { pos: [0, 8.5, -5], look: [3.6, 1.5, -15] },
  { pos: [-0.5, 8, 4], look: [-4, 1.5, -1] },
  { pos: [-2.5, 9, 6], look: [-1, 1, -6] },
  { pos: [0, 0, 0], look: [0, 0, 0] },
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
const PUNCH = [T.niemand, T.mail1, T.bau, T.wider, T.kanzlei, T.allein, T.neun, T.gekauft, T.zweiF, T.von, T.danke, ...OPT_T, EYES, ...VOTE, MIDNIGHT];

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
// die-cut sticker: white border, ink outline, coloured plate (claudebyseb look)
const sticker = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, bg: string) => {
  c.fillStyle = "rgba(0,0,0,.35)"; roundRect(c, x + 4, y + 12, w - 4, h - 8, r); c.fill();
  c.fillStyle = "#FFFFFF"; roundRect(c, x, y, w - 4, h - 12, r); c.fill();
  c.fillStyle = INK; roundRect(c, x + 9, y + 9, w - 22, h - 30, r - 8); c.fill();
  c.fillStyle = bg; roundRect(c, x + 15, y + 15, w - 34, h - 42, r - 13); c.fill();
  c.fillStyle = "rgba(255,255,255,.22)"; roundRect(c, x + 24, y + 20, w - 52, (h - 42) * 0.32, (r - 13) * 0.6); c.fill();
};
const keyTex = (letter: string, col: string) => canvasTex(256, 256, (c) => {
  sticker(c, 0, 0, 256, 256, 54, col);
  c.fillStyle = "#FFFFFF"; c.strokeStyle = INK; c.lineWidth = 12; c.lineJoin = "round"; c.font = font(150); c.textAlign = "center"; c.textBaseline = "middle";
  c.strokeText(letter, 126, 128); c.fillText(letter, 126, 128);
});
const pillTex = (text: string, bg: string, fg: string, w = 760, h = 180) => canvasTex(w, h, (c) => {
  sticker(c, 0, 0, w, h, 40, bg);
  c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle";
  fitFont(c, text, h * 0.46, w - 110); c.fillText(text, (w - 4) / 2, (h - 12) / 2 + 3);
});
// Claude-style paper window with traffic lights; returns the content top
const paperWin = (c: CanvasRenderingContext2D, w: number, h: number, title: string, logo: HTMLImageElement | null, right?: string, rightCol = MUTED) => {
  c.fillStyle = PAPER; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 140; i++) { c.fillStyle = `rgba(120,100,80,${0.04 + rnd(i) * 0.05})`; c.fillRect(rnd(i + 3) * w, rnd(i + 7) * h, 3, 3); }
  c.fillStyle = "#EAE3D5"; c.fillRect(0, 0, w, 84);
  c.fillStyle = INK; c.fillRect(0, 80, w, 6);
  ["#E5534B", "#E9B23A", "#3FB950"].forEach((col, i) => { c.fillStyle = INK; c.beginPath(); c.arc(36 + i * 40, 42, 15, 0, 7); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(36 + i * 40, 42, 11, 0, 7); c.fill(); });
  c.font = `600 42px ${SERIF}`; c.textBaseline = "middle"; c.textAlign = "left";
  const tw = c.measureText(title).width;
  if (logo) c.drawImage(logo, w / 2 - (tw + 52) / 2, 23, 38, 38);
  c.fillStyle = INK; c.fillText(title, w / 2 - (tw + 52) / 2 + 52, 44);
  if (right) { c.fillStyle = rightCol; c.font = "800 26px Rubik"; c.textAlign = "right"; c.fillText(right, w - 28, 44); c.textAlign = "left"; }
  return 86;
};
const inkCard = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, bg: string, line = INK, lw = 6) => {
  c.fillStyle = "rgba(60,40,20,.18)"; roundRect(c, x + 5, y + 9, w, h, r); c.fill();
  c.fillStyle = bg; roundRect(c, x, y, w, h, r); c.fill();
  c.strokeStyle = line; c.lineWidth = lw; roundRect(c, x, y, w, h, r); c.stroke();
};
const checkBadge = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
  c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(x, y, r + 8, 0, 7); c.fill();
  c.fillStyle = INK; c.beginPath(); c.arc(x, y, r + 3, 0, 7); c.fill();
  c.fillStyle = "#2FBF71"; c.beginPath(); c.arc(x, y, r - 2, 0, 7); c.fill();
  c.strokeStyle = "#FFFFFF"; c.lineWidth = r * 0.28; c.lineCap = "round"; c.lineJoin = "round";
  c.beginPath(); c.moveTo(x - r * 0.42, y + r * 0.02); c.lineTo(x - r * 0.1, y + r * 0.34); c.lineTo(x + r * 0.45, y - r * 0.3); c.stroke(); c.lineCap = "butt";
};
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

// ---------- canvas: Superkind app on the desk monitor (mails, call, work view) ----------
const MW = 1000, MH = 660;
const typed = (s: string, t: number, t0: number, cps = 30) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((t - t0) * cps))));
const L1 = "Weder A noch B.", L2A = "Bau KI-Automatisierungen", L2B = "für Firmen.";
const drawMonitor = (c: CanvasRenderingContext2D, t: number, logo: HTMLImageElement | null) => {
  const mailPhase = t < T.also2 ? 1 : t > T.aber - 0.2 ? 2 : 0;
  paperWin(c, MW, MH, "Superkind", logo, hhmm(clockAt(t)), mailPhase ? RED : MUTED);

  // the Kanzlei calls again
  if (!mailPhase && t > T.dann - 0.3) {
    inkCard(c, 40, 116, MW - 80, MH - 150, 34, "#EAF6EC");
    for (let i = 0; i < 2; i++) { const k = (t * 1.3 + i * 0.5) % 1; c.strokeStyle = `rgba(31,157,85,${0.5 * (1 - k)})`; c.lineWidth = 8; c.beginPath(); c.arc(MW / 2, 250, 86 + k * 90, 0, 7); c.stroke(); }
    c.fillStyle = "#2F6F4F"; c.beginPath(); c.arc(MW / 2, 250, 82, 0, 7); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `800 92px Rubik`; c.textAlign = "center"; c.fillText("§", MW / 2, 256);
    c.fillStyle = INK; c.font = `800 46px Rubik`; c.fillText("Steuerkanzlei", MW / 2, 392);
    c.fillStyle = GREEN; c.font = `700 28px Rubik`; c.fillText("Kunde #1 · ruft an", MW / 2, 440);
    const bk = back((t - T.mehr + 0.05) / 0.3);
    if (bk > 0.01) {
      c.save(); c.translate(MW / 2, 540); c.scale(bk, bk);
      sticker(c, -350, -62, 700, 136, 40, "#FFFFFF");
      c.fillStyle = INK; c.font = `800 40px Rubik`; c.fillText("„Wir wollen mehr.“", 0, 2);
      c.restore();
    }
    c.textAlign = "left";
    return;
  }
  // day: the agent works on the Kanzlei job
  if (!mailPhase) {
    botFace(c, 64, 140, 26);
    c.fillStyle = MUTED; c.font = `700 20px Rubik`; c.fillText("SUPERKIND · AGENT", 106, 122);
    c.fillStyle = INK; c.font = `800 36px Rubik`; c.fillText("Auftrag: Steuerkanzlei", 106, 160);
    const n = invAt(t);
    inkCard(c, 90, 220, MW - 180, 360, 34, "#FFFBF3");
    c.fillStyle = INK; c.font = `900 120px Rubik`; c.textAlign = "center"; c.fillText(`${n}/200`, MW / 2, 340);
    if (n >= 200) { c.save(); const ck = back((t - T.allein) / 0.3); c.translate(MW - 130, 236); c.scale(ck, ck); checkBadge(c, 0, 0, 58); c.restore(); c.textAlign = "center"; }
    c.fillStyle = "#F1ECE1"; roundRect(c, 120, 440, MW - 240, 40, 20); c.fill();
    c.fillStyle = n >= 200 ? GREEN : OR; roundRect(c, 120, 440, Math.max(40, (MW - 240) * (n / 200)), 40, 20); c.fill();
    c.fillStyle = n >= 200 ? GREEN : MUTED; c.font = `700 30px Rubik`; c.fillText(n >= 200 ? "✓ Alle Rechnungen verbucht" : "Rechnungen verbuchen …", MW / 2, 540); c.textAlign = "left";
    return;
  }
  // night: a mail from the unknown sender
  c.fillStyle = INK; c.font = `800 40px Rubik`; c.fillText("Posteingang", 40, 132);
  const arrive = mailPhase === 1 ? T.mail1 : T.mail2;
  const k = back((t - arrive + 0.05) / 0.35);
  if (k <= 0.01) { c.fillStyle = MUTED; c.font = `500 28px Rubik`; c.fillText("Keine neuen Nachrichten", 40, 200); return; }
  const hot = mailPhase === 1 ? t > T.bau : t > T.danke;
  c.save(); c.translate(0, (1 - k) * 80); c.globalAlpha = cl(k);
  inkCard(c, 30, 170, MW - 60, 462, 30, "#FFFBF3", hot ? EVIL : INK, hot ? 9 : 6);
  c.fillStyle = "#2A2338"; roundRect(c, 60, 206, 110, 110, 22); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `800 72px Rubik`; c.textAlign = "center"; c.fillText("?", 115, 264); c.textAlign = "left";
  c.fillStyle = MUTED; c.font = `700 26px Rubik`; c.fillText("Von", 200, 226);
  c.fillStyle = INK; c.font = `800 38px Rubik`; c.fillText("Unbekannt", 200, 270);
  if (mailPhase === 2 && t > T.gleicher - 0.05) { c.fillStyle = EVIL; c.font = `800 26px Rubik`; c.fillText("schon wieder", 200, 306); }
  c.fillStyle = EVIL; c.beginPath(); c.arc(MW - 80, 230, 13, 0, 7); c.fill();
  c.fillStyle = MUTED; c.font = `700 26px Rubik`; c.fillText("Nachricht", 60, 370);
  if (mailPhase === 1) {
    const a = typed(L1, t, T.weder - 0.05, 22), b1 = typed(L2A, t, T.bau - 0.05, 34), b2 = typed(L2B, t, T.bau - 0.05 + L2A.length / 34, 34);
    c.fillStyle = a ? INK : "#C9C3B8"; c.font = `800 48px Rubik`; c.fillText(a || "…", 60, 430);
    if (b1) { c.fillStyle = EVIL; c.fillText(b1, 60, 500); }
    if (b2) { c.fillStyle = EVIL; c.fillText(b2, 60, 564); }
  } else if (t < T.danke - 0.03) {
    c.fillStyle = "#C9C3B8"; c.font = `800 48px Rubik`; c.fillText(t > T.nur - 0.05 ? "Nur ein Wort …" : "…", 60, 440);
  } else {
    const dk = back((t - T.danke + 0.03) / 0.25);
    c.save(); c.translate(60, 500); c.scale(dk, dk);
    c.fillStyle = EVIL; c.font = `800 130px Rubik`; c.fillText("Danke.", 0, 0);
    c.restore();
  }
  const glitch = [T.bau + 1.0, T.firmen1, T.danke + 0.05, T.wofuer + 0.1].some((x) => bump(t, x, 0.1) > 0);
  if (glitch) { c.fillStyle = "rgba(255,46,58,.22)"; c.fillRect(30, 176 + rnd(Math.floor(t * 30)) * 400, MW - 60, 44); }
  c.restore();
};

// ---------- canvas: yesterday's vote — nobody ----------
const drawRecap = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 430;
  sticker(c, 0, 0, w, h, 52, CREAM);
  c.fillStyle = INK; c.font = font(46); c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Kommentare", 40, 62);
  c.fillStyle = "#6E685F"; roundRect(c, w - 230, 34, 190, 56, 28); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = font(30); c.textAlign = "center"; c.fillText("TAG 1", w - 135, 63); c.textAlign = "left";
  EP.old.forEach((o, i) => {
    const y = 120 + i * 134;
    c.fillStyle = "#F1ECE1"; roundRect(c, 40, y + 8, 240, 96, 30); c.fill();
    c.fillStyle = OPT_COL[i]; c.font = font(68); c.fillText(o.key, 128, y + 60);
    c.fillStyle = "#9A9286"; fitFont(c, o.title, 34, 360); c.fillText(o.title, 300, y + 58);
    const zk = back((t - T.niemand + 0.05 - i * 0.12) / 0.3);
    if (zk > 0.01) { c.save(); c.translate(w - 110, y + 58); c.scale(zk, zk); c.fillStyle = RED; c.font = font(84); c.textAlign = "center"; c.fillText("0", 0, 4); c.restore(); c.textAlign = "left"; }
  });
  const sk = back((t - T.kein + 0.05) / 0.25);
  if (sk > 0.01) {
    c.save(); c.translate(w / 2, h / 2 + 30); c.rotate(-0.16); c.scale(1.6 - 0.6 * sk, 1.6 - 0.6 * sk); c.globalAlpha = cl(sk);
    c.strokeStyle = RED; c.lineWidth = 12; roundRect(c, -260, -70, 520, 140, 24); c.stroke();
    c.fillStyle = RED; c.font = font(86); c.textAlign = "center"; c.fillText("KEINER", 0, 6);
    c.restore(); c.textAlign = "left";
  }
};

// ---------- canvas: Superkind app on the Kanzlei screen ----------
const KW = 760, KH = 500;
const drawKanzlei = (c: CanvasRenderingContext2D, t: number, logo: HTMLImageElement | null) => {
  paperWin(c, KW, KH, "Superkind", logo);
  const n = invAt(t);
  const state = n >= 200 ? 2 : t > T.nacht ? 1 : 0;
  c.textAlign = "center";
  c.fillStyle = MUTED; c.font = `700 28px Rubik`; c.fillText("Steuerkanzlei · Rechnungen", KW / 2, 124);
  c.fillStyle = INK; c.font = `900 108px Rubik`; c.fillText(`${n}/200`, KW / 2, 222);
  c.fillStyle = "#F1ECE1"; roundRect(c, 60, 300, KW - 120, 36, 18); c.fill();
  c.fillStyle = state === 2 ? GREEN : state ? OR : RED; roundRect(c, 60, 300, Math.max(36, (KW - 120) * (n / 200)), 36, 18); c.fill();
  const lab = ["VON HAND", "AGENT ARBEITET", "FERTIG"][state];
  c.strokeStyle = INK; c.lineWidth = 5; roundRect(c, 60, 300, KW - 120, 36, 18); c.stroke();
  const sk = 1 + 0.12 * bump(t, state === 2 ? T.allein : T.nacht, 0.25);
  c.save(); c.translate(KW / 2, 414); c.scale(sk, sk);
  sticker(c, -215, -56, 430, 124, 40, state === 2 ? GREEN : state ? OR : RED);
  c.fillStyle = "#FFFFFF"; c.font = font(40); c.fillText(lab, -2, 0);
  c.restore();
  if (state === 2) { const ck = back((t - T.allein) / 0.3); c.save(); c.translate(KW - 92, 210); c.scale(ck, ck); checkBadge(c, 0, 0, 52); c.restore(); }
  c.textAlign = "left";
};

// ---------- canvas: construction billboard → the first ad (Werbe-Test) ----------
const BW = 900, BH = 570;
const drawAdFace = (c: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  c.fillStyle = OR; c.fillRect(0, 0, w, h);
  c.strokeStyle = Math.floor(t * 4) % 2 ? "#FFFFFF" : GOLD; c.lineWidth = 18; c.strokeRect(9, 9, w - 18, h - 18);
  botFace(c, w * 0.2, h * 0.5, h * 0.2);
  c.fillStyle = "#FFFFFF"; c.textAlign = "left"; c.textBaseline = "middle";
  c.font = font(h * 0.17); c.fillText("KI FÜR", w * 0.36, h * 0.33);
  c.fillText("FIRMEN", w * 0.36, h * 0.52);
  c.fillStyle = INK; c.font = `800 ${Math.round(h * 0.07)}px Rubik`; c.fillText("Rechnungen? Macht der Agent.", w * 0.36, h * 0.72);
};
const drawSite = (c: CanvasRenderingContext2D, t: number) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, BW, BH);
  const o = (t * 60) % 160;
  for (let i = -4; i < 14; i++) { c.fillStyle = i % 2 ? GOLD : INK; c.beginPath(); c.moveTo(i * 80 + o, 0); c.lineTo(i * 80 + 80 + o, 0); c.lineTo(i * 80 + o, BH); c.lineTo(i * 80 - 80 + o, BH); c.fill(); }
  c.fillStyle = "#FFFFFF"; roundRect(c, 170, 190, 560, 190, 34); c.fill();
  c.fillStyle = INK; c.font = font(70); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("FIRMA ???", 450, 250);
  c.fillStyle = OR; c.font = font(38); c.fillText("IM BAU · TAG 2/100", 450, 326); c.textAlign = "left";
  const k = ease((t - T.werbung + 0.05) / 0.35);
  if (k > 0) { c.save(); c.beginPath(); c.rect(0, 0, BW * k, BH); c.clip(); drawAdFace(c, BW, BH, t); c.restore(); }
};
const drawSign = (c: CanvasRenderingContext2D) => {
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 600, 220, 30); c.fill();
  c.strokeStyle = OR; c.lineWidth = 10; roundRect(c, 5, 5, 590, 210, 26); c.stroke();
  botFace(c, 100, 120, 52);
  c.fillStyle = INK; c.font = font(56); c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("KI FÜR", 190, 80); c.fillStyle = OR; c.fillText("FIRMEN", 190, 150);
};

// ---------- canvas: shop — the +900 € buys the first three things ----------
const SW = 760, SH = 900;
const drawShop = (c: CanvasRenderingContext2D, t: number) => {
  sticker(c, 0, 0, SW, SH, 52, CREAM);
  c.textBaseline = "middle"; c.textAlign = "left";
  c.fillStyle = INK; c.font = font(40); c.fillText("SHOP", 40, 62);
  const cash = cashAt(t);
  c.fillStyle = cash > 0 ? GREEN : RED; roundRect(c, SW - 320, 30, 272, 64, 32); c.fill();
  c.fillStyle = "#FFFFFF"; c.textAlign = "center"; fitFont(c, `KASSE ${eur(cash)}`, 34, 240); c.fillText(`KASSE ${eur(cash)}`, SW - 184, 64); c.textAlign = "left";
  const own = owned(t);
  const next = SHOP.find((u) => !own.includes(u.id) && t > T.server + 0.3);
  const rows = [...SHOP.slice(0, 6), SHOP[SHOP.length - 1]];
  rows.forEach((u, i) => {
    const y = 122 + i * 104, last = i === rows.length - 1;
    if (last) { c.fillStyle = "#B8B0A2"; c.font = font(30); c.fillText("…", 50, y - 6); }
    const yy = last ? y + 8 : y;
    const got = own.includes(u.id), isNext = next?.id === u.id;
    const pop = 1 + 0.08 * (BUY[u.id] ? bump(t, BUY[u.id] + 0.08, 0.18) : 0);
    c.save(); c.translate(SW / 2, yy + 43); c.scale(pop, pop); c.translate(-SW / 2, -(yy + 43));
    c.fillStyle = got ? "#E3F5EA" : isNext || last ? "#FFF1E8" : "#F1ECE1"; roundRect(c, 30, yy, SW - 68, 86, 22); c.fill();
    c.strokeStyle = got ? GREEN : isNext || last ? OR : INK; c.lineWidth = got || isNext ? 6 : 4; roundRect(c, 30, yy, SW - 68, 86, 22); c.stroke();
    if (got) {
      const ck = back((t - BUY[u.id]) / 0.3); c.save(); c.translate(69, yy + 43); c.scale(ck, ck); checkBadge(c, 0, 0, 24); c.restore();
    } else {
      c.fillStyle = isNext ? OR : "#B8B0A2"; roundRect(c, 52, yy + 40, 34, 28, 6); c.fill();
      c.strokeStyle = isNext ? OR : "#B8B0A2"; c.lineWidth = 6; c.beginPath(); c.arc(69, yy + 40, 11, Math.PI, 0); c.stroke();
    }
    c.fillStyle = got ? "#17663A" : last || isNext ? OR_D : "#6E685F"; c.font = `800 34px Rubik`; c.fillText(u.name, 106, yy + 44);
    c.fillStyle = got ? GREEN : last || isNext ? OR_D : INK; c.font = font(got ? 26 : 32); c.textAlign = "right"; c.fillText(got ? "GEKAUFT" : eur(u.price), SW - 64, yy + 44); c.textAlign = "left";
    c.restore();
  });
};

// ---------- canvas: votes ----------
const drawVotes = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 430;
  sticker(c, 0, 0, w, h, 52, CREAM);
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
const drawCal = (c: CanvasRenderingContext2D) => {
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 256, 300, 30); c.fill();
  c.fillStyle = OPT_COL[1]; roundRect(c, 0, 0, 256, 86, 30); c.fill(); c.fillRect(0, 50, 256, 36);
  c.fillStyle = "#FFFFFF"; c.font = font(52); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("ABO", 128, 46);
  c.strokeStyle = INK; c.lineWidth = 16; c.beginPath(); c.arc(128, 190, 62, -0.4, Math.PI * 1.55); c.stroke();
  c.fillStyle = INK; c.beginPath(); c.moveTo(186, 110); c.lineTo(214, 176); c.lineTo(150, 160); c.closePath(); c.fill();
  c.textAlign = "left";
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
// table-top island like the trainer reel: thick dark rim with a glowing tick ring, saturated top, optional label plate
const Island: React.FC<{ p: V3; r: number; t: number; glow?: number; col?: string; vis?: number; top?: string; side?: string; deco?: boolean; label?: THREE.Texture; la?: number }> = ({ p, r, t, glow = 0, col, vis = 1, top = "#E07A3F", side = "#4A2412", deco = true, label, la = 0 }) => {
  if (vis <= 0.001) return null;
  const n = Math.round(r * 7);
  return (
    <group position={p} scale={vis}>
      <mesh position={[0, 0.215, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[r, r + 0.15, 0.43, 48]} />
        <meshStandardMaterial color={side} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.432, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[r - 0.12, 48]} />
        <meshStandardMaterial color={top} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.436, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[r * 0.55, r * 0.55 + 0.06, 48]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.16} />
      </mesh>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * (r + 0.09), 0.22, Math.sin(a) * (r + 0.09)]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.12, 0.26, 0.26]} />
            <meshBasicMaterial color={i % 2 ? "#FFE1A8" : side} transparent opacity={i % 2 ? 0.35 + 0.35 * Math.sin(t * 3 + i) : 1} toneMapped={false} />
          </mesh>
        );
      })}
      {deco && Array.from({ length: 9 }).map((_, i) => {
        const a = rnd(i + r * 7) * Math.PI * 2, d = r * (0.66 + rnd(i + 3) * 0.26);
        return (
          <group key={i} position={[Math.cos(a) * d, 0.45, Math.sin(a) * d]} rotation={[0, a, Math.sin(t * 2.2 + i) * 0.12]}>
            <ToyBox p={[0, 0.09, 0]} s={[0.18, 0.18, 0.18]} color={["#FFD34D", "#FF7FA8", "#FFFFFF", "#7FD6FF", "#9DFFC4"][i % 5]} />
          </group>
        );
      })}
      {label && (
        <group rotation={[0, la, 0]}>
          <group position={[0, 0.5, r + 0.08]} rotation={[-0.45, 0, 0]} scale={0.62}>
            <ToyBox p={[0, 0, -0.06]} s={[3.25, 0.82, 0.08]} color="#1A1410" />
            <mesh><planeGeometry args={[3.2, 0.75]} /><meshBasicMaterial map={label} toneMapped={false} /></mesh>
          </group>
        </group>
      )}
      {col && glow > 0.01 && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r + 0.25, r + 0.25 + 0.55 * glow, 48]} />
          <meshBasicMaterial color={col} transparent opacity={0.85 * glow} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};
const LightCone: React.FC<{ p: V3; t: number; seed: number; color: string; r?: number }> = ({ p, t, seed, color, r = 2.6 }) => (
  <mesh position={[p[0] + Math.sin(t * 0.7 + seed) * 0.5, 6.5, p[2]]} rotation={[0, 0, Math.sin(t * 0.7 + seed) * 0.08]}>
    <coneGeometry args={[r, 12, 32, 1, true]} />
    <meshBasicMaterial color={color} transparent opacity={0.075} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} toneMapped={false} />
  </mesh>
);
const Neon: React.FC<{ p: V3; tex: THREE.Texture; w: number; h: number; t: number; seed: number; rotY?: number; color: string }> = ({ p, tex, w, h, t, seed, rotY = 0, color }) => {
  const flick = Math.floor(t * 8 + seed * 3) % 23 === 0 ? 0.35 : 1;
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <ToyBox p={[0, 0, -0.12]} s={[w + 0.4, h + 0.3, 0.12]} color="#140C08" cast={false} />
      <mesh><planeGeometry args={[w, h]} /><meshBasicMaterial map={tex} transparent opacity={flick} toneMapped={false} /></mesh>
      <pointLight position={[0, 0, 1.2]} intensity={10 * flick} distance={9} color={color} />
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

// ---------- Tag 2 pieces ----------
const House: React.FC<{ p: V3; s?: number; wall?: string; roof?: string; vis?: number }> = ({ p, s = 1, wall = "#EDE6D8", roof = "#5A4A6A", vis = 1 }) => vis <= 0.001 ? null : (
  <group position={p} scale={s * vis}>
    <ToyBox p={[0, 0.8, 0]} s={[2.2, 1.6, 1.8]} color={wall} />
    <ToyBox p={[0, 1.75, 0]} s={[2.45, 0.3, 2.05]} color={roof} />
    <ToyBox p={[0, 2.05, 0]} s={[1.6, 0.3, 1.3]} color={roof} />
    <ToyBox p={[0.45, 0.45, 0.91]} s={[0.45, 0.9, 0.04]} color="#7A5434" />
    {[-0.55, 0.0].map((x) => <ToyBox key={x} p={[x - 0.1, 1.05, 0.91]} s={[0.4, 0.38, 0.04]} color="#9BD4F0" emissive="#FFE7A8" ei={0.15} />)}
  </group>
);
const SLABS = 14;
const slabT = (j: number) => T.nacht + 0.25 + j * 0.085; // j = 0 is the top sheet
const Kanzlei: React.FC<{ t: number; dyn: Record<string, THREE.Texture>; tex: Tex }> = ({ t, dyn, tex }) => {
  const vis = back((t - T.erster + 0.3) / 0.45);
  if (vis <= 0.001) return null;
  const clerk = 1 - ease((t - T.nacht) / 0.35);
  return (
    <group>
      <Island p={KZ} r={KZR} t={t} vis={vis} deco={false} top="#3FA866" side="#1E4D2E" />
      <group position={[0, (1 - vis) * -3, 0]}>
        <House p={add(KZ, [-1.3, 0.45, -1.0])} />
        <group scale={vis}>
          <Screen p={KSCREEN} w={2.0} h={1.32} tex={dyn.kz} rot={[-0.05, -0.15, 0]} />
          <ToyBox p={[KSCREEN[0], 0.95, KSCREEN[2] - 0.15]} s={[0.16, 1.0, 0.16]} color="#2A2430" />
        </group>
        {/* the paper stack: 200 invoices, by hand */}
        {Array.from({ length: SLABS }).map((_, i) => {
          const j = SLABS - 1 - i;
          const k = cl((t - slabT(j)) / 0.4);
          const from: V3 = add(STACK, [Math.sin(i * 2.3) * 0.04, 0.06 + i * 0.09, Math.cos(i * 1.7) * 0.04]);
          const to: V3 = add(DONE, [0, 0.06 + j * 0.09, 0]);
          const p = k <= 0 ? from : bez3(from, add(HERO_KZ, [0, 2.6, 0]), to, ease(k));
          return <ToyBox key={i} p={p} s={[0.8, 0.07, 0.6]} rot={[k * k * 0.3, (k > 0 ? 0 : i * 0.13) + k * 6.28, 0]} color={k >= 1 ? "#CFF1DA" : "#FFFFFF"} />;
        })}
        <group position={add(STACK, [-0.95, 0, 0.35])} scale={0.5 * clerk}>
          {clerk > 0.01 && <BlockBuddy p={[0, 0.58, 0]} yaw={0.6} color="#9AA3B5" dark="#6B7385" t={t} seed={5} />}
        </group>
      </group>
    </group>
  );
};
const Firm: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const vis = back((t - T.zweiF - 0.05 - i * 0.25) / 0.4);
  if (vis <= 0.001) return null;
  const p = FIRMS[i];
  return (
    <group position={[0, (1 - vis) * -4, 0]}>
      <Island p={p} r={1.9} t={t} vis={vis} deco={false} top="#3BA7B5" side="#1B4A52" />
      <House p={add(p, [0, 0.45, -0.1])} s={0.75} vis={vis} wall={["#BFD7F2", "#F2D9BF"][i]} roof={["#3E5C8A", "#8A5A3E"][i]} />
    </group>
  );
};
const ServerRack: React.FC<{ t: number }> = ({ t }) => {
  const v = back((t - T.server + 0.05) / 0.35);
  if (v <= 0.001) return null;
  return (
    <group position={SERVER} scale={v} rotation={[0, -0.5, 0]}>
      <ToyBox p={[0, 0.85, 0]} s={[0.8, 1.7, 0.7]} color="#2A2430" />
      {Array.from({ length: 6 }).map((_, r) => [0, 1, 2].map((cI) => (
        <mesh key={`${r}-${cI}`} position={[-0.22 + cI * 0.16, 0.3 + r * 0.24, 0.36]}>
          <boxGeometry args={[0.08, 0.06, 0.02]} />
          <meshBasicMaterial color={Math.sin(t * (5 + r) + cI * 2 + r) > 0 ? (cI === 2 ? "#9BE7FF" : "#4CF08A") : "#1B3A2A"} toneMapped={false} />
        </mesh>
      )))}
    </group>
  );
};
const AdSet: React.FC<{ p: V3; t: number; vis: number; tex: THREE.Texture }> = ({ p, t, vis, tex }) => (
  <group position={[p[0], 0.45, p[2]]} scale={vis}>
    <group position={[0.3, 1.7, -0.7]} rotation={[-0.04, 0.12, 0]}>
      <ToyBox p={[0, 0, -0.1]} s={[2.6, 1.7, 0.16]} color="#2A2430" />
      <mesh><planeGeometry args={[2.44, 1.55]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
      {[-0.9, 0.9].map((x) => <ToyBox key={x} p={[x, -1.2, -0.12]} s={[0.14, 1.0, 0.14]} color="#2A2430" />)}
    </group>
    <group position={[-1.6, 1.0, 0.3]} rotation={[0, 0, -0.5 + Math.sin(t * 8) * 0.06]}>
      <mesh rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.38, 0.9, 12, 1, true]} /><meshStandardMaterial color={OPT_COL[0]} side={THREE.DoubleSide} /></mesh>
    </group>
    {/* new customers keep streaming in */}
    {Array.from({ length: 6 }).map((_, i) => {
      const k = (t * 0.45 + i / 6) % 1;
      const x = 2.4 - k * 3.2, z = 1.6 - Math.sin(k * Math.PI) * 0.5 + (i % 2) * 0.3;
      return <group key={i} position={[x, 0, z]} scale={0.38 * Math.min(1, k * 6, (1 - k) * 6)}><BlockBuddy p={[0, 0.58, 0]} yaw={-1.4} color={["#9AA3B5", "#BFD7F2", "#F2D9BF"][i % 3]} dark="#6B7385" t={t} seed={i * 2} /></group>;
    })}
  </group>
);
const AboSet: React.FC<{ p: V3; t: number; vis: number; tex: THREE.Texture }> = ({ p, t, vis, tex }) => (
  <group position={[p[0], 0.45, p[2]]} scale={vis}>
    <mesh position={[0, 0.12, 0.2]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[1.75, 0.09, 8, 48]} /><meshBasicMaterial color={OPT_COL[1]} toneMapped={false} /></mesh>
    {[0, 1, 2].map((i) => { const a = t * 0.9 + (i * Math.PI * 2) / 3; return <House key={i} p={[Math.cos(a) * 1.75, 0, 0.2 + Math.sin(a) * 1.75]} s={0.32} wall={["#EDE6D8", "#BFD7F2", "#F2D9BF"][i]} roof={["#5A4A6A", "#3E5C8A", "#8A5A3E"][i]} />; })}
    <group position={[0, 1.4, 0.2]} rotation={[0, Math.sin(t * 1.2) * 0.25, 0]}>
      <ToyBox p={[0, 0, -0.08]} s={[1.05, 1.22, 0.12]} color="#2A2430" />
      <mesh><planeGeometry args={[0.95, 1.12]} /><meshBasicMaterial map={tex} toneMapped={false} transparent /></mesh>
    </group>
  </group>
);

// 20 helpers from Tag 1 live on the HQ island; asleep at night
const SUBS = Array.from({ length: 20 }, (_, i) => {
  const a = (i / 20) * Math.PI * 2 + rnd(i) * 0.3;
  const r = 2.4 + rnd(i + 5) * 1.4;
  return { home: [HQ[0] + Math.cos(a) * r, 0.45, HQ[2] + Math.sin(a) * r * 0.8] as V3, seed: i * 1.7 };
});
const subAt = (i: number, t: number): { p: V3; yaw: number; sleep?: boolean } => {
  const s = SUBS[i];
  if (nightAt(t) > 0.6 + rnd(i) * 0.2) return { p: s.home, yaw: Math.cos(s.seed) * 1.2, sleep: true };
  const w = t * (0.5 + rnd(i) * 0.5) + s.seed;
  return { p: [s.home[0] + Math.sin(w) * 0.6, 0.45 + Math.max(0, Math.sin(t * 6 + s.seed)) * 0.25, s.home[2] + Math.cos(w * 0.8) * 0.5], yaw: Math.cos(w) * 1.2 };
};

// ---------- the world ----------
// the room: dark wooden floor, panelled walls, a big window that carries the time of day, neon signs, props, motes
const Room: React.FC<{ t: number; tex: Tex; sky: string; night: number }> = ({ t, tex, sky, night }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, 0, -4]} receiveShadow>
      <planeGeometry args={[150, 150]} />
      <meshStandardMaterial map={tex.floor} roughness={0.9} />
    </mesh>
    <mesh position={[2, 9, -27]} receiveShadow><boxGeometry args={[90, 18, 0.5]} /><meshStandardMaterial map={tex.wall} roughness={0.85} /></mesh>
    <mesh position={[-24, 9, -4]} rotation={[0, Math.PI / 2, 0]} receiveShadow><boxGeometry args={[70, 18, 0.5]} /><meshStandardMaterial map={tex.wall} roughness={0.85} /></mesh>
    <mesh position={[28, 9, -4]} rotation={[0, -Math.PI / 2, 0]} receiveShadow><boxGeometry args={[70, 18, 0.5]} /><meshStandardMaterial map={tex.wall} roughness={0.85} /></mesh>
    {/* window = clock of the day */}
    <group position={[2, 9.2, -26.6]}>
      <ToyBox p={[0, 0, 0]} s={[13, 7.4, 0.3]} color="#2A1A12" cast={false} />
      <mesh position={[0, 0, 0.18]}><planeGeometry args={[12.2, 6.6]} /><meshBasicMaterial color={sky} toneMapped={false} fog={false} /></mesh>
      {night > 0.05 && Array.from({ length: 26 }).map((_, i) => (
        <mesh key={i} position={[(rnd(i + 200) - 0.5) * 11.6, (rnd(i + 201) - 0.5) * 6.0, 0.2]}>
          <planeGeometry args={[0.12, 0.12]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={night * (0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i)))} toneMapped={false} fog={false} />
        </mesh>
      ))}
      <mesh position={[3.6, 1.4, 0.21]}><circleGeometry args={[0.9, 32]} /><meshBasicMaterial color={night > 0.5 ? "#F4F1FF" : "#FFE7A0"} toneMapped={false} fog={false} /></mesh>
      <ToyBox p={[0, 0, 0.25]} s={[0.22, 6.6, 0.1]} color="#2A1A12" cast={false} />
      <ToyBox p={[0, 0, 0.25]} s={[12.2, 0.22, 0.1]} color="#2A1A12" cast={false} />
      <ToyBox p={[0, -3.9, 0.4]} s={[13.6, 0.3, 0.8]} color="#3A2416" cast={false} />
    </group>
    <Neon p={[-12.5, 10.5, -26.6]} tex={tex.neonA} w={7} h={1.9} t={t} seed={1} color="#5FE3D9" />
    <Neon p={[16.5, 10.5, -26.6]} tex={tex.neonB} w={6} h={1.9} t={t} seed={4} color="#FFB45A" />
    <Neon p={[-23.6, 8.5, -6]} tex={tex.neonC} w={6.4} h={1.9} t={t} seed={7} rotY={Math.PI / 2} color="#FF7FA8" />
    <Neon p={[27.6, 8.5, -8]} tex={tex.neonD} w={6.4} h={1.9} t={t} seed={9} rotY={-Math.PI / 2} color="#9DFFC4" />
    {/* rug under the HQ */}
    <ToyBox p={[0, 0.02, 5]} s={[13, 0.04, 11]} color="#5A2E2A" top="#6E3A33" cast={false} />
    {/* glowing paths between the tables */}
    {([[HQ, KZ], [HQ, ISL[0]], [ISL[0], ISL[1]], [KZ, FIRMS[0]], [KZ, FIRMS[1]], [HQ, RIV]] as [V3, V3][]).flatMap(([a, b], j) => {
      const d = Math.hypot(b[0] - a[0], b[2] - a[2]);
      const n = Math.floor(d / 1.1);
      return Array.from({ length: n }).map((_, i) => {
        const k = (i + 0.5) / n;
        const px = a[0] + (b[0] - a[0]) * k, pz = a[2] + (b[2] - a[2]) * k;
        if (Math.hypot(px - a[0], pz - a[2]) < 4.8 || Math.hypot(px - b[0], pz - b[2]) < 3.4) return null;
        return (
          <mesh key={`${j}-${i}`} position={[px, 0.04, pz]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.42, 0.42]} />
            <meshBasicMaterial color="#FFD27A" transparent opacity={0.22 + 0.35 * Math.max(0, Math.sin(t * 4 - i * 0.6 - j))} toneMapped={false} />
          </mesh>
        );
      });
    })}
    {/* office props along the walls */}
    {Array.from({ length: 22 }).map((_, i) => {
      const a = rnd(i + 40) * Math.PI * 2, r = 17 + rnd(i + 41) * 5;
      const px = 2 + Math.cos(a) * r * 1.05, pz = -4 + Math.sin(a) * r * 0.95;
      if (pz > 12 || px < -22 || px > 26 || pz < -25) return null;
      const kind = i % 4;
      return (
        <group key={i} position={[px, 0, pz]} rotation={[0, a, 0]}>
          {kind === 0 && <><ToyBox p={[0, 0.45, 0]} s={[1.2, 0.9, 0.9]} color="#8A5A35" top="#A06C42" /><ToyBox p={[0.1, 1.15, 0]} s={[0.8, 0.5, 0.7]} color="#E9E4DA" /></>}
          {kind === 1 && <><mesh position={[0, 0.4, 0]} castShadow><cylinderGeometry args={[0.38, 0.3, 0.8, 10]} /><meshStandardMaterial color="#B5703A" /></mesh><mesh position={[0, 1.35, 0]} castShadow><coneGeometry args={[0.75, 1.5, 7]} /><meshStandardMaterial color="#3C8A3A" flatShading /></mesh></>}
          {kind === 2 && <ToyBox p={[0, 1.0, 0]} s={[0.8, 2.0, 0.6]} color="#2E3A4A" top="#3E4E62" />}
          {kind === 3 && <mesh position={[0, 0.45, 0]} castShadow><sphereGeometry args={[0.45, 12, 10]} /><meshStandardMaterial color={i % 8 === 3 ? "#2FBF71" : "#E8574E"} flatShading /></mesh>}
        </group>
      );
    })}
    {/* floating confetti motes */}
    {Array.from({ length: 150 }).map((_, i) => {
      const px = 2 + (rnd(i) - 0.5) * 44, pz = 12 - rnd(i + 9) * 36;
      const y = 0.8 + ((rnd(i + 3) * 8 + t * (0.25 + rnd(i + 5) * 0.3)) % 8);
      const big = i % 9 === 0;
      return (
        <mesh key={i} position={[px + Math.sin(t + i) * 0.2, y, pz]} rotation={[t * (0.5 + rnd(i)), t * 0.7 + i, 0]}>
          <boxGeometry args={big ? [0.22, 0.22, 0.22] : [0.07, 0.07, 0.07]} />
          <meshBasicMaterial color={big ? ["#FFD34D", "#FF7FA8", "#7FD6FF", "#9DFFC4"][i % 4] : i % 3 ? "#FFF2C6" : "#CFFFD9"} transparent opacity={big ? 0.9 : 0.45 + 0.45 * Math.sin(t * 3 + i)} toneMapped={false} />
        </mesh>
      );
    })}
  </group>
);

const World: React.FC<{ t: number; tex: Tex; dyn: Record<string, THREE.Texture> }> = ({ t, tex, dyn }) => {
  const cam = camAt(t);
  const punch = Math.max(0, ...PUNCH.map((p) => bump(t, p, 0.22)));
  const q = React.useMemo(() => new THREE.Quaternion(), []);
  q.setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(...cam.pos), new THREE.Vector3(...cam.look), new THREE.Vector3(0, 1, 0)));
  const lightTarget = React.useMemo(() => new THREE.Object3D(), []);
  lightTarget.position.set(cam.look[0], 0, cam.look[2]);
  lightTarget.updateMatrixWorld();
  const night = nightAt(t);
  const sky = keysC(t, SKY);

  // hero route
  type K = { a: number; b: number; p: V3; yaw: number };
  const KEYS: K[] = [
    { a: 0, b: T.also2 - 0.05, p: HERO_DESK, yaw: Math.PI - 0.5 },
    { a: T.also2 + 0.6, b: T.neun - 0.05, p: HERO_KZ, yaw: 0.1 },
    { a: T.neun + 0.45, b: T.dann - 0.1, p: HERO_HOOK, yaw: 0.25 },
    { a: T.dann + 0.25, b: OPT_T[0] - 0.25, p: HERO_DESK, yaw: Math.PI - 0.5 },
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
  // turns to the viewer: "darf nicht widersprechen", "von dir"
  if (t > T.der && t < T.also2) cyaw = keys(t, [[T.der, Math.PI - 0.5], [T.der + 0.45, 0.15]]);
  if (t > T.jetzt && t < T.aber + 0.3) cyaw = keys(t, [[T.jetzt, Math.PI - 0.5], [T.jetzt + 0.5, 0.15], [T.aber, 0.15], [T.aber + 0.3, Math.PI - 0.5]]);
  const working = t > T.nacht + 0.15 && t < T.allein;
  if (working) cyaw = 0.1 + Math.sin(t * 10) * 0.7;
  const camD = Math.hypot(cam.pos[0] - cp[0], cam.pos[1] - cp[1], cam.pos[2] - cp[2]);
  const oldVis = 1 - ease((t - T.weder - 0.2) / 0.8);
  const optVis = (i: number) => back((t - T.entsch - 0.1 - i * 0.3) / 0.4);
  const rivVis = ease((t - T.und3) / 0.6);
  const eyes = cl((t - EYES) / 0.12);
  const rivGlow = eyes * (0.6 + 0.4 * Math.sin(t * 5));
  const adOn = t > T.werbung;
  const look = cam.look;
  return (
    <>
      <CameraRig pos={cam.pos} look={look} fov={48 - 3 * punch} />
      <color attach="background" args={[WOOD]} />
      <fog attach="fog" args={[WOOD, 24, 62]} />
      <ambientLight intensity={0.5 - 0.12 * night} color={night > 0.5 ? "#E6D2FF" : "#FFE6C4"} />
      <hemisphereLight args={[night > 0.5 ? "#D8C4FF" : "#FFE2B8", "#3A2418", 0.62 - 0.12 * night]} />
      <primitive object={lightTarget} />
      <directionalLight position={[look[0] + 6, 16, look[2] + 9]} target={lightTarget} intensity={1.75 - 0.45 * night} color={keysC(t, [[0, "#D9C8FF"], [T.wider, "#D9C8FF"], [DAWN, "#FFC08A"], [MORNING, "#FFE9CF"], [T.aber, "#FFE9CF"], [EVE, "#FFB27A"], [DUSKT, "#E0C8FF"], [NIGHTT, "#D9C8FF"]])} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-camera-far={60} shadow-bias={-0.0015} shadow-normalBias={0.04} />
      <Room t={t} tex={tex} sky={sky} night={night} />
      <LightCone p={HQ} t={t} seed={1} color="#FFD27A" r={3.4} />
      <LightCone p={KZ} t={t} seed={2} color="#9DFFC4" />
      <LightCone p={ISL[0]} t={t} seed={3} color="#FFB3D9" />
      <LightCone p={ISL[1]} t={t} seed={4} color="#C9B6FF" />
      {rivVis > 0.01 && <LightCone p={RIV} t={t} seed={5} color={EVIL} r={2.2} />}
      <pointLight position={[HQ[0], 5.5, HQ[2]]} intensity={14} distance={11} color="#FFB45A" />
      <pointLight position={[KZ[0], 4.5, KZ[2]]} intensity={8} distance={8} color="#BFFFD6" />

      {/* ---- HQ island ---- */}
      <Island p={HQ} r={HQR} t={t} />
      <Plot t={t} ghost={0} />
      <Crane p={[3.3, 0.45, 1.6]} t={t} busy={night < 0.5} />
      {[[-3.3, 0.45, 3.0], [3.6, 0.45, 4.2], [-0.9, 0.45, 1.4], [-3.9, 0.45, 6.0]].map((p, i) => <Tree key={i} p={p as V3} t={t} seed={i * 2} s={0.8 + rnd(i) * 0.3} night={night} />)}
      <group position={[MON[0], 0.45, MON[2] + 0.2]}>
        <ToyBox p={[0, 0.68, 0]} s={[3.2, 0.14, 1.0]} color="#A87A52" top="#C59368" />
        {[[-1.45, -0.4], [1.45, -0.4], [-1.45, 0.4], [1.45, 0.4]].map(([x, z], i) => <ToyBox key={i} p={[x, 0.32, z]} s={[0.14, 0.62, 0.14]} color="#7A5434" />)}
        <ToyBox p={[0, 0.8, 0.25]} s={[1.1, 0.06, 0.36]} color="#3A3340" />
        <mesh position={[1.25, 0.92, 0.2]} castShadow><cylinderGeometry args={[0.13, 0.11, 0.3, 12]} /><meshStandardMaterial color={OR} /></mesh>
      </group>
      <group position={MON}>
        <ToyBox p={[0, 0, -0.1]} s={[3.0, 2.0, 0.16]} color="#2A2430" />
        <mesh><planeGeometry args={[2.8, 1.85]} /><meshBasicMaterial map={dyn.mon} toneMapped={false} /></mesh>
        <ToyBox p={[0, -1.2, -0.15]} s={[0.24, 0.5, 0.2]} color="#2A2430" />
        <pointLight position={[0, 0, 1.2]} intensity={2.2 * night + 3 * bump(t, T.bau + 0.2, 0.4) + 3 * bump(t, T.danke, 0.35)} distance={6} color={night > 0.5 ? "#FFD0D0" : "#FFFFFF"} />
      </group>
      <group position={BILL} rotation={[0, 0.3, 0]}>
        <ToyBox p={[0, 0, -0.1]} s={[2.7, 1.75, 0.16]} color="#2A2430" />
        <mesh><planeGeometry args={[2.56, 1.62]} /><meshBasicMaterial map={dyn.site} toneMapped={false} /></mesh>
        {[-1.0, 1.0].map((x) => <ToyBox key={x} p={[x, -1.5, -0.12]} s={[0.16, 1.3, 0.16]} color="#2A2430" />)}
        {adOn && <pointLight position={[0, 0, 1.4]} intensity={4 + 4 * bump(t, T.werbung + 0.2, 0.4)} distance={6} color={OR} />}
      </group>
      {/* bought with the 900 €: sign, ad, server */}
      {t > T.domain - 0.05 && (
        <group position={SIGN} scale={back((t - T.domain + 0.05) / 0.35)} rotation={[0, 0.35, 0]}>
          <ToyBox p={[0, 0.55, 0]} s={[0.12, 1.1, 0.12]} color="#2A2430" />
          <mesh position={[0, 1.35, 0.08]}><planeGeometry args={[1.5, 0.55]} /><meshBasicMaterial map={tex.sign} toneMapped={false} transparent /></mesh>
        </group>
      )}
      <ServerRack t={t} />
      <Burst3D at={T.domain} t={t} p={add(SIGN, [0, 1.3, 0])} colors={[GREEN, "#FFFFFF", GOLD]} n={8} />
      <Burst3D at={T.werbung} t={t} p={[BILL[0], BILL[1] + 0.8, BILL[2] + 0.3]} colors={[OR, "#FFFFFF", GOLD]} n={10} />
      <Burst3D at={T.server} t={t} p={add(SERVER, [0, 1.6, 0])} colors={[GREEN, "#9BE7FF", "#FFFFFF"]} n={8} />
      <Board p={SHOPB} tex={dyn.shop} w={1.95} h={2.3} t={t} q={q} at={T.neun - 0.05} until={T.dann - 0.1} tilt={-0.03} bob={0.03} />
      <Board p={[1.0, 4.7, 8.0]} tex={tex.plus900} w={1.8} h={0.5} t={t} q={q} at={T.neun - 0.05} until={T.domain - 0.1} tilt={0.05} />
      <Board p={[1.0, 4.7, 8.0]} tex={tex.bought} w={1.8} h={0.5} t={t} q={q} at={T.gekauft - 0.05} until={T.dann - 0.1} tilt={-0.05} />
      {/* helpers */}
      {SUBS.map((_, i) => { const s = subAt(i, t); return <Agent key={i} p={s.p} yaw={s.yaw} t={t} s={0.38} seed={i * 1.3} sleep={s.sleep} />; })}
      {night > 0.6 && [0, 5, 10, 15].map((i, j) => {
        const k = (t * 0.5 + j * 0.25) % 1;
        return <Board key={i} p={add(SUBS[i].home, [0.2 + k * 0.4, 1.3 + k * 1.2, 0])} tex={tex.zzz} w={0.4 * (0.6 + k)} h={0.4 * (0.6 + k)} t={t} q={q} bob={0} />;
      })}
      <Board p={add(HERO_DESK, [0.3, 2.55, 0.4])} tex={tex.noVeto} w={2.4} h={0.56} t={t} q={q} at={T.wider - 0.1} until={T.also2 - 0.05} tilt={-0.04} />
      <Board p={add(HERO_DESK, [0.3, 2.55, 0.4])} tex={tex.you} w={2.2} h={0.6} t={t} q={q} at={T.von - 0.05} until={T.aber - 0.1} tilt={0.04} />
      <Board p={add(MON, [0.95, 0.85, 1.3])} tex={tex.qmark} w={0.8} h={0.8} t={t} q={q} at={T.wofuer - 0.05} until={T.va} bob={0.15} />

      {/* ---- the Kanzlei: first customer ---- */}
      <Kanzlei t={t} dyn={dyn} tex={tex} />
      <Board p={add(KZ, [-1.3, 3.5, -0.4])} tex={tex.kunde1} w={1.9} h={0.52} t={t} q={q} at={T.kanzlei - 0.05} until={T.nacht - 0.1} tilt={0.04} />
      <Board p={add(STACK, [0.1, 2.25, 0.3])} tex={tex.n200} w={1.9} h={0.5} t={t} q={q} at={T.zweih - 0.05} until={T.nacht - 0.1} tilt={-0.04} />
      <Board p={add(STACK, [-0.7, 1.55, 0.8])} tex={tex.byHand} w={1.5} h={0.42} t={t} q={q} at={T.alles - 0.05} until={T.nacht - 0.1} tilt={0.05} />
      <Board p={add(HERO_KZ, [0, 2.2, 0.3])} tex={tex.onlyHim} w={2.1} h={0.52} t={t} q={q} at={T.allein - 0.05} until={T.neun - 0.1} tilt={-0.04} />
      <Burst3D at={T.allein} t={t} p={add(DONE, [0, 1.4, 0])} colors={[GREEN, "#FFFFFF", GOLD]} n={12} />
      {FIRMS.map((_, i) => <Firm key={i} i={i} t={t} />)}
      <Board p={[11.0, 3.6, -4.6]} tex={tex.plus2} w={2.0} h={0.54} t={t} q={q} at={T.zweiF + 0.35} until={T.jetzt} tilt={0.04} />

      {/* ---- yesterday's ideas sink; tonight's two stay hidden until the pitch ---- */}
      {ISL.map((p, i) => {
        const v = Math.max(oldVis, optVis(i));
        const isNew = t > T.weder + 0.5;
        const active = t > OPT_T[i] - 0.1 && t < OPT_END[i];
        const voteGlow = !isNew ? 0 : t > T.va - 0.1 ? 0.4 + 0.6 * bump(t, VOTE[i] + 0.2, 0.5) : active ? 0.6 + 0.4 * Math.sin(t * 6) : 0;
        const revealed = isNew && t > OPT_T[i] - 0.15;
        const big = t > T.und3;
        return (
          <group key={i}>
            <Island p={p} r={IR} t={t} vis={v} glow={voteGlow} col={OPT_COL[i]} top={isNew ? OPT_COL[i] : "#8D6CF0"} side={isNew ? "#4A1830" : "#33245E"} />
            {!isNew && i === 0 && <InfluSet p={p} t={t} vis={oldVis} tex={dyn.influ} />}
            {!isNew && i === 1 && <YtSet p={p} t={t} vis={oldVis} tex={dyn.yt} />}
            {!isNew && oldVis > 0.01 && <Board p={add(p, [0, 4.95, -0.3])} tex={tex[`okey${i}`]} w={1.3 * oldVis} h={1.3 * oldVis} t={t} q={q} bob={0.12} />}
            {isNew && !revealed && v > 0.01 && <Board p={add(p, [0, 2.2, 0])} tex={tex.qmark} w={1.4 * v} h={1.4 * v} t={t} q={q} bob={0.2} />}
            {revealed && i === 0 && <AdSet p={p} t={t} vis={back((t - OPT_T[0] + 0.1) / 0.4)} tex={dyn.ad} />}
            {revealed && i === 1 && <AboSet p={p} t={t} vis={back((t - OPT_T[1] + 0.1) / 0.4)} tex={tex.cal} />}
            {revealed && v > 0.01 && <Board p={add(p, [0, big ? 5.4 : 4.95, -0.3])} tex={tex[`key${i}`]} w={big ? 2.1 : 1.3} h={big ? 2.1 : 1.3} t={t} q={q} bob={0.12} />}
            <Burst3D at={VOTE[i]} t={t} p={add(p, [0, 1.5, 0])} colors={[OPT_COL[i], "#FFFFFF"]} n={8} power={1.2} />
          </group>
        );
      })}
      <Board p={add(ISL[0], [0.4, 1.3, 1.6])} tex={tex.fast} w={2.1} h={0.52} t={t} q={q} at={T.schnell - 0.05} until={OPT_END[0] - 0.1} tilt={-0.05} />
      <Board p={add(ISL[1], [-0.3, 1.3, 1.9])} tex={tex.stay} w={2.2} h={0.52} t={t} q={q} at={T.kunden2 - 0.05} until={OPT_END[1]} tilt={0.05} />
      {[0, 1].map((i) => <Board key={i} p={add(ISL[i], [0, 3.85, -0.1])} tex={tex[`risk${i}`]} w={2.3} h={0.5} t={t} q={q} at={OPT_T[i] + 0.45} until={OPT_END[i]} tilt={i ? -0.03 : 0.03} />)}
      {/* recap: yesterday nobody voted */}
      <Board p={[0, 6.4, -9.5]} tex={tex.yesterday} w={2.4} h={0.62} t={t} q={q} until={T.und0 - 0.1} tilt={-0.04} />
      <Board p={[0, 3.4, -12]} tex={tex.mailQ} w={1.2} h={1.0} t={t} q={q} at={T.mail0 - 0.05} until={T.und0} bob={0.15} />
      <Board p={RECAP} tex={dyn.recap} w={2.9} h={1.4} t={t} q={q} at={T.und0 - 0.1} until={T.also1 + 0.2} bob={0.04} />
      {/* vote */}
      <Board p={[0, 9.6, 3.6]} tex={dyn.votes} w={2.9} h={1.4} t={t} q={q} at={T.ab - 0.1} until={T.sonst} bob={0.04} />

      {/* ---- the unknown sender ---- */}
      {rivVis > 0.01 && (
        <group position={[0, (1 - rivVis) * -8, 0]}>
          <Island p={RIV} r={2.6} t={t} top="#2A2338" side="#120E1A" deco={false} glow={eyes * 0.5} col={EVIL} label={tex.lblRiv} />
          <Agent p={RIV_AG} yaw={0.55} t={t} s={0.95} seed={9} pal={RIVAL} glow={rivGlow} eyesOn={eyes} />
        </group>
      )}

      <Agent p={cp} yaw={cyaw} t={t} s={0.85} armL={hop > 0.2 || working ? 140 : 15} armR={hop > 0.2 || working ? 140 + 15 * Math.sin(t * 12) : 15} talk={t > T.von - 0.2 && t < T.von + 0.5} vis={cl((camD - 2.4) / 1.5)} />
    </>
  );
};

// ---------- textures ----------
const useStaticTex = (ready: boolean) =>
  React.useMemo(() => {
    if (!ready) return null;
    const t: Tex = {};
    EP.options.forEach((o, i) => { t[`key${i}`] = keyTex(o.key, OPT_COL[i]); t[`okey${i}`] = keyTex(EP.old[i].key, "#8A857D"); });
    t.wall = canvasTex(1024, 512, (c) => {
      c.fillStyle = "#4A2B1A"; c.fillRect(0, 0, 1024, 512);
      for (let i = 0; i < 16; i++) {
        c.fillStyle = i % 2 ? "#52301C" : "#4C2C19"; c.fillRect(i * 64, 0, 64, 512);
        c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(i * 64, 0, 3, 512);
        c.fillStyle = "rgba(255,220,170,.06)"; c.fillRect(i * 64 + 6, 0, 2, 512);
      }
      c.fillStyle = "#2E1A10"; c.fillRect(0, 380, 1024, 132);
      c.fillStyle = "#C8A14C"; c.fillRect(0, 372, 1024, 8);
    });
    t.wall.wrapS = THREE.RepeatWrapping; t.wall.repeat.set(4, 1);
    t.floor = canvasTex(512, 512, (c) => {
      c.fillStyle = "#24150F"; c.fillRect(0, 0, 512, 512);
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { c.fillStyle = (x + y) % 2 ? "#2B1912" : "#21130D"; c.fillRect(x * 64, y * 64, 62, 62); }
    });
    t.floor.wrapS = t.floor.wrapT = THREE.RepeatWrapping; t.floor.repeat.set(20, 20);
    const neon = (text: string, col: string) => canvasTex(1024, 280, (c) => {
      c.font = "900 150px Rubik"; c.textAlign = "center"; c.textBaseline = "middle";
      fitFont(c, text, 150, 940);
      c.shadowColor = col; c.shadowBlur = 34; c.fillStyle = col; c.fillText(text, 512, 146); c.shadowBlur = 12; c.fillText(text, 512, 146);
      c.shadowBlur = 0; c.fillStyle = "rgba(255,255,255,.55)"; c.fillText(text, 512, 146);
    });
    t.neonA = neon("KI FÜR FIRMEN", "#5FE3D9");
    t.neonB = neon("ZIEL 1 MIO €", "#FFB45A");
    t.neonC = neon("TAG 2 / 100", "#FF7FA8");
    t.neonD = neon("OPEN 24/7", "#9DFFC4");
    const plate = (n: string, text: string, color: string) => canvasTex(768, 180, (c) => {
      c.fillStyle = "#1A1410"; roundRect(c, 0, 0, 768, 180, 26); c.fill();
      c.fillStyle = CREAM; roundRect(c, 10, 10, 748, 160, 20); c.fill();
      c.fillStyle = color; c.beginPath(); c.arc(92, 90, 62, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle"; c.font = "900 80px Rubik"; c.fillText(n, 92, 96);
      c.fillStyle = color; c.textAlign = "left"; fitFont(c, text, 74, 560); c.fillText(text, 180, 96);
    });
    t.lblKz = plate("1", "KUNDE: KANZLEI", "#2FA866");
    t.lblRiv = plate("?", "UNBEKANNT", EVIL);
    EP.options.forEach((o, i) => { t[`lblOpt${i}`] = plate(o.key, i ? "MONATS-ABO" : "WERBUNG", OPT_COL[i]); });
    t.yesterday = pillTex("GESTERN · TAG 1", GOLD, INK, 820, 200);
    t.mailQ = canvasTex(300, 250, (c) => {
      c.fillStyle = "#FFFFFF"; roundRect(c, 10, 40, 280, 190, 24); c.fill(); c.strokeStyle = INK; c.lineWidth = 10; roundRect(c, 10, 40, 280, 190, 24); c.stroke();
      c.beginPath(); c.moveTo(20, 55); c.lineTo(150, 150); c.lineTo(280, 55); c.stroke();
      c.fillStyle = EVIL; c.beginPath(); c.arc(240, 50, 46, 0, 7); c.fill(); c.fillStyle = "#FFFFFF"; c.font = font(64); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("?", 240, 56);
    });
    t.noVeto = pillTex("DARF NICHT NEIN SAGEN", "#FFFFFF", EVIL, 900, 200);
    t.you = pillTex("DU ENTSCHEIDEST", OR, "#FFFFFF", 760, 200);
    t.kunde1 = pillTex("KUNDE #1", GREEN, "#FFFFFF", 640, 180);
    t.n200 = pillTex("200 / MONAT", "#FFFFFF", INK, 680, 180);
    t.byHand = pillTex("VON HAND", RED, "#FFFFFF", 560, 160);
    t.onlyHim = pillTex("NUR DER AGENT", OR, "#FFFFFF", 760, 190);
    t.plus900 = pillTex("+900 €", GOLD, INK, 620, 180);
    t.bought = pillTex("GEKAUFT!", GREEN, "#FFFFFF", 620, 180);
    t.plus2 = pillTex("+2 FIRMEN", GREEN, "#FFFFFF", 700, 190);
    t.fast = pillTex("NEUE KUNDEN", OPT_COL[0], "#FFFFFF", 760, 190);
    t.stay = pillTex("KUNDEN BLEIBEN", OPT_COL[1], "#FFFFFF", 800, 190);
    t.sign = canvasTex(600, 220, drawSign);
    t.cal = canvasTex(256, 300, drawCal);
    EP.options.forEach((o, i) => { t[`risk${i}`] = pillTex(`${o.pot} · ${o.risk}`, i ? "#FFFFFF" : INK, i ? INK : GOLD, 840, 180); });
    t.zzz = canvasTex(128, 128, (c) => { c.fillStyle = "#FFFFFF"; c.font = font(96); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("z", 64, 64); });
    t.qmark = canvasTex(256, 256, (c) => { c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(128, 128, 118, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 10; c.stroke(); c.fillStyle = INK; c.font = font(170); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("?", 128, 140); });
    return t;
  }, [ready]);

const useDynTex = (t: number, logo: HTMLImageElement | null) => {
  const mon = useDyn(MW, MH, (c) => drawMonitor(c, t, logo));
  const kz = useDyn(KW, KH, (c) => drawKanzlei(c, t, logo));
  const site = useDyn(BW, BH, (c) => drawSite(c, t));
  const shop = useDyn(SW, SH, (c) => drawShop(c, t));
  const recap = useDyn(900, 430, (c) => drawRecap(c, t));
  const votes = useDyn(900, 430, (c) => drawVotes(c, t));
  const influ = useDyn(360, 640, (c) => drawInflu(c));
  const yt = useDyn(640, 400, (c) => drawYt(c, t));
  const ad = useDyn(640, 400, (c) => drawAdFace(c, 640, 400, t));
  return { mon, kz, site, shop, recap, votes, influ, yt, ad };
};

// ---------- 2D HUD ----------
const Hud: React.FC<{ t: number }> = ({ t }) => {
  const k = ease((t - 0.1) / 0.4);
  const cash = cashAt(t);
  const cashPulse = 1 + 0.25 * Math.max(bump(t, T.neun + 0.8, 0.35), ...Object.values(BUY).map((b) => bump(t, b + 0.15, 0.3)));
  const own = owned(t);
  const nxt = SHOP.find((u) => !own.includes(u.id))!;
  const barK = cl(cash / nxt.price);
  const day = dayAt(t);
  const dayPulse = 1 + 0.35 * Math.max(bump(t, T.mitter + 0.05, 0.35), bump(t, MIDNIGHT + 0.05, 0.35));
  const night = nightAt(t);
  const clockPulse = 1 + 0.2 * Math.max(bump(t, T.mitter, 0.3), bump(t, MIDNIGHT, 0.3));
  const chip = (children: React.ReactNode, bg = CREAM) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: bg, border: `5px solid ${INK}`, borderRadius: 26, padding: "8px 18px", boxShadow: "0 0 0 6px #FFFFFF, 0 12px 0 6px rgba(0,0,0,.35)" }}>{children}</div>
  );
  const txt: React.CSSProperties = { fontFamily: "Rubik", fontWeight: 900, fontSize: 36, color: INK, lineHeight: 1, display: "inline-block" };
  const late = t > T.va;
  const up = cashPulse > 1.05 && t < T.domain;
  // coins fly from the world into the counter on "Neunhundert Euro"
  const coins = Array.from({ length: 9 }, (_, i) => {
    const ck = (t - T.neun - i * 0.06) / 0.55;
    if (ck <= 0 || ck >= 1) return null;
    const e = inOut(ck);
    const x = 540 + Math.sin(i * 2.1) * 160 * (1 - e) + (560 - 540) * e, y = 1050 - (1050 - 258) * e - Math.sin(e * Math.PI) * 120;
    return <div key={i} style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: GOLD, border: "5px solid #B88D24", boxShadow: "0 4px 0 rgba(0,0,0,.3)" }} />;
  });
  return (
    <>
      <AbsoluteFill>{coins}</AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * -30}px)` }}>
        <div style={{ display: "flex", gap: 18, transform: "rotate(-1.2deg)" }}>
          {chip(<span style={{ ...txt, color: "#FFFFFF", transform: `scale(${dayPulse})` }}>TAG {day}<span style={{ color: "rgba(255,255,255,.7)", fontSize: 26 }}> / 100</span></span>, OR)}
          {chip(<><div style={{ width: 32, height: 32, borderRadius: 16, background: GOLD, border: `4px solid ${INK}` }} /><span style={{ ...txt, transform: `scale(${cashPulse})`, color: up ? GREEN : cashPulse > 1.05 ? RED : INK }}>{eur(cash)}</span><span style={{ ...txt, fontSize: 28, color: MUTED, marginLeft: 14 }}>von 1 Mio €</span></>, up ? "#E3F5EA" : CREAM)}
        </div>
      </div>
    </>
  );
};

// ---------- 2D step badge (chapter of the episode) ----------
const STEPS: { a: number; n: string; text: string; col: string }[] = [
  { a: 0, n: "1", text: "DIE MAIL", col: EVIL },
  { a: T.erster - 0.1, n: "2", text: "KUNDE #1", col: "#2FA866" },
  { a: T.neun - 0.1, n: "3", text: "EINKAUF", col: "#D9A21C" },
  { a: T.dann - 0.1, n: "4", text: "MEHR KUNDEN", col: "#3BA7B5" },
  { a: T.aber - 0.1, n: "5", text: "NOCH EINE MAIL", col: EVIL },
  { a: T.va - 0.15, n: "6", text: "DEINE WAHL", col: "#E0559A" },
];
const StepBadge: React.FC<{ t: number }> = ({ t }) => {
  if (t > T.folg) return null;
  let i = 0; STEPS.forEach((s, j) => { if (t >= s.a) i = j; });
  const st = STEPS[i];
  const k = back((t - st.a) / 0.35);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1600, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#2A2018", border: `5px solid ${INK}`, borderRadius: 22, padding: "8px 26px 8px 10px", boxShadow: "0 0 0 5px #C8A14C, 0 12px 0 5px rgba(0,0,0,.4)", transform: `scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * -6}deg)` }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: st.col, border: "4px solid #FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rubik", fontWeight: 900, fontSize: 34, color: "#FFFFFF" }}>{st.n}</div>
        <span style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: 36, color: CREAM, letterSpacing: 1 }}>{st.text}</span>
      </div>
    </div>
  );
};

// ---------- audio ----------
type Sfx = [string, number, number];
const TRANSITS = HOLDS.slice(0, -1).filter((h, i) => HOLDS[i + 1].a - h.b > 0.1).map((h) => h.b);
const SFX: Sfx[] = [
  ...TRANSITS.map((c): Sfx => ["whoosh-quick", c - 0.02, 0.34]),
  ["ui-pop", 0.1, 0.25], ["ui-pop", T.mail0, 0.3], ["ui-pop", T.und0, 0.28],
  ["stamp", T.niemand, 0.32], ["stamp", T.niemand + 0.12, 0.28], ["bump", T.kein, 0.5],
  ["chime", T.mitter, 0.35], ["ui-pop", T.mail1, 0.45], ["typing", T.weder, 0.22], ["typing", T.bau, 0.25], ["bump", T.firmen1 + 0.2, 0.42],
  ["stamp", T.wider, 0.35], ["jump", T.also2 + 0.05, 0.3],
  ["powerup", T.erster, 0.22], ["ui-pop", T.kanzlei, 0.3], ["stamp", T.zweih, 0.3], ["bump", T.alles, 0.3],
  ...Array.from({ length: 7 }, (_, i): Sfx => ["check", slabT(i * 2), 0.12]), ["powerup", T.allein, 0.3],
  ...Array.from({ length: 7 }, (_, i): Sfx => ["coin", T.neun + i * 0.09, 0.18 + i * 0.03]),
  ["check", T.domain, 0.3], ["check", T.werbung, 0.3], ["check", T.server, 0.3], ["stamp", T.gekauft, 0.4],
  ["chime", T.dann + 0.05, 0.28], ["chime", T.dann + 0.5, 0.28], ["ui-pop", T.mehr, 0.32],
  ["powerup", T.zweiF + 0.05, 0.26], ["ui-pop", T.zweiF + 0.35, 0.28],
  ["chime", T.von, 0.3], ["riser", T.aber, 0.16], ["ui-pop", T.mail2, 0.45], ["bump", T.danke, 0.55], ["ui-pop", T.wofuer, 0.3],
  ...[0, 1].map((i): Sfx => ["powerup", OPT_T[i], 0.24]),
  ["stamp", T.schnell, 0.26], ["stamp", T.kunden2, 0.26],
  ["riser", T.und3 - 0.1, 0.2], ["bump", EYES, 0.55],
  ...VOTE.map((v): Sfx => ["ui-pop", v, 0.42]),
  ["chime", MIDNIGHT, 0.4], ["bump", T.sonst - 0.03, 0.6], ["stamp", BLACK, 0.55],
];

export const SuperkindFirmaTag2: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ready = useFontsReady(["900 70px Rubik", "600 36px Rubik", `600 40px ${SERIF}`, `800 40px ${pixelFont}`, `800 40px Rubik`, `500 40px Rubik`, `700 40px Rubik`]);
  const logo = useImage(staticFile("superkind-logo.svg"));
  const tex = useStaticTex(ready);
  const dyn = useDynTex(t, logo);
  const a = camAt(t - 0.03).pos, b = camAt(t + 0.03).pos;
  const speed = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 0.06;
  const blur = speed > 150 ? 0 : Math.min(3.5, Math.max(0, (speed - 8) * 0.12)); // no smear across the hard cut
  const flash = 0.18 * bump(t, T.allein, 0.1) + 0.14 * bump(t, T.gekauft, 0.08);
  const redFlash = 0.16 * bump(t, T.danke, 0.12) + 0.16 * bump(t, EYES, 0.12) + 0.22 * bump(t, T.sonst, 0.1);
  const night = nightAt(t);
  return (
    <AbsoluteFill style={{ background: WOOD }}>
      {tex && (
        <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
          <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
            <World t={t} tex={tex} dyn={dyn} />
          </ThreeCanvas>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(10,4,2,${0.55 + 0.1 * night}) 100%)` }} />
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
      <AbsoluteFill style={{ background: EVIL, opacity: redFlash }} />
      <Hud t={t} />
      <PillCaptions words={WD} theme={THEMES.gym} />
      <StepBadge t={t} />
      {t > BLACK && <AbsoluteFill style={{ background: "#000000" }} />}
      <Audio src={staticFile("cbf2/voice1.mp3")} />
      <Audio src={staticFile("sirtoken/music.mp3")} loop volume={(f) => (f / 30 > BLACK ? 0 : keys(f / 30, [[0, 0.07], [T.mail1 - 0.3, 0.07], [T.mail1 + 0.4, 0.035], [T.also2, 0.035], [T.erster, 0.075], [T.aber, 0.075], [T.aber + 0.5, 0.03], [T.va - 0.2, 0.03], [T.va + 0.4, 0.06]]))} />
      {SFX.map(([n, s, v], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s * 30))} durationInFrames={90}>
          <Audio src={staticFile(`sirtoken/sfx-${n}.mp3`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
