// "KI gründet eine Firma, ganz alleine" · Tag 1 · v2 (2026-10-27, firma-design)
// Pius zu v1: "zu wenig Bewegung und Animation wie bei claudebyseb, zu 2-dimensional → alles 3D/2.5D".
// v2 = EINE durchgehende 3D-Welt, die Kamera fliegt ohne Stillstand (Orbit, Dolly, Push-ins, Whip-Pans mit Motion-Blur,
// Tiefenunschärfe). Claude-Ausschnitte laufen auf einem echten 3D-Monitor am Gründer-Tisch, Karten/Sticker/Zähler/
// Schritt-Leiste/End-Karte sind dicke Objekte in der Welt. Ton, Stimme, words.json, Untertitel und Timing = v1.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, THEMES, Word, pixelFont } from "../components/PixelKit";
import {
  SKC, SERIF, V3, cl, ease, inOut, back, bump, lerp3, add, rnd, fitFont, font,
  makeWorldTex, useDyn, useImage, drawIcon, drawTag, Island, Agent, PARTNER, PrintMachine, Conveyor, Laptop, LightCone,
  ShirtRoom, TShirt, IdeaCard,
} from "../components/ShirtWorld3D";
import {
  PostFX, EnvLight, CameraRig2, CamKey, makeCamPath, orbitPos, handheld, motionVec, Plate3D, Sticker3D, Burst, ExtrudedText,
  textTex, faceTex, drawFace, Rope, OdometerDigit, digitStripTex, Motes, roundRectGeo,
} from "../components/FirmaFX3D";
import wordsRaw from "../../public/firma-neu-tag1/words.json";

const W = 1080, H = 1920;
const DAY = 1;
export type FirmaShirtsTag1V2Props = { keyword?: string; cover?: boolean };
export const FIRMA_SHIRTS_TAG1_V2_SECONDS = 36.3;

// ---------- word anchors (identical to v1) ----------
type RawWord = { i: number; w: string; s: number; e: number };
const WORDS = wordsRaw as RawWord[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, after = 0) => {
  const hit = WORDS.find((x) => norm(x.w) === norm(w) && x.s >= after - 1e-6);
  if (!hit) throw new Error(`anchor not found: ${w} after ${after}`);
  return hit.s;
};
const CAPTIONS: Word[] = WORDS.map((x) => ({ w: x.w.replace(/[„“]/g, ""), s: x.s, e: x.e }));
const T = {
  ki: at("KI", 0.9), ganz: at("ganz", 1.3), alleine: at("alleine", 1.5), ein: at("ein", 1.9), unt: at("Unternehmen", 2.0), auf: at("aufbaut", 2.5),
  ich: at("Ich", 3.0), probier: at("probier", 3.2), tag: at("1", 4.5), kein: at("kein", 5.7), produkt: at("Produkt", 5.9),
  heute: at("Heute", 6.5), claude: at("Claude", 7.4),
  erstens: at("Erstens", 8.0), unten: at("unten", 8.7), plus: at("Plus", 9.3), research: at("Research", 10.0), an: at("an", 10.4),
  zweitens: at("Zweitens", 11.0), schreib: at("Schreib", 11.9), keinL: at("Kein", 13.2), keineM: at("keine", 13.9), kleine: at("kleine", 14.9),
  drittens: at("Drittens", 16.0), frag: at("Frag", 16.9), immer: at("immer", 18.0), kaufen: at("kaufen", 18.5),
  claude2: at("Claude", 19.2), prueft: at("prüft", 19.5), q300: at("300", 20.0), quellen: at("Quellen", 20.4),
  am: at("Am", 21.0), druck: at("Drucksachen", 21.7), arbeit: at("Arbeitskleidung", 22.4),
  ein2: at("Ein", 23.7), partner: at("Partner", 23.9), druckt: at("druckt", 24.2), einem: at("einem", 25.0),
  die: at("Die", 25.7), nimmt: at("nimmt", 26.0), shirts: at("Firmenshirts", 27.0),
  nur: at("Nur", 28.2), nirgends: at("nirgends", 29.1), nachb: at("nachbestellen", 30.3), das: at("Das", 31.2), morgen: at("morgen", 31.5),
  komm: at("Kommentiere", 32.0), kw: at("Produkt", 32.8), und: at("und", 33.5), schick: at("schick", 34.3), guide: at("Guide", 34.8),
};

// ======================================================================================================
// world layout
// ======================================================================================================
// idea board (pin board on legs) facing +z
const BZ = -8.0, BY0 = 1.35, BY1 = 8.4, BW = 7.0, BD = 0.35;
const BFRONT = BZ + BD / 2 + 0.05;
const CARD_W = 3.1, CARD_H = 1.8, CARD_D = 0.1;
const CARDS: IdeaCard[] = [
  { label: "KAFFEE", icon: "coffee" }, { label: "HUNDE-\nKEKSE", icon: "bone" },
  { label: "DRUCK-\nSACHEN", icon: "flyer" }, { label: "FIRMEN-\nSHIRTS", icon: "shirt" },
  { label: "WEBSITES", icon: "web" }, { label: "KERZEN", icon: "candle" },
];
const KEEP = 3;
const slot = (i: number): V3 => [(i % 2 ? 1 : -1) * 1.62, [6.35, 4.4, 2.45][Math.floor(i / 2)], BFRONT + CARD_D / 2 + 0.06];
const SCAN = [0, 3, 5, 2];
const SCAN_AT = [T.ki, T.alleine, T.unt, T.auf];
const STRIKE_ORDER = [0, 5, 1, 4, 2];
const strikeAt = (i: number) => T.nimmt - 0.25 + STRIKE_ORDER.indexOf(i) * ((26.95 - (T.nimmt - 0.25)) / STRIKE_ORDER.length);
// founder desk + monitor
const F: V3 = [5.6, 0, -4.4];
const F_R = 2.6, TOP = 0.5;
const MON: V3 = [5.6, 0, -5.8];
const SCR_W = 4.4, SCR_H = 5.2, SCR_Y = 4.4;
const SC: V3 = [MON[0], SCR_Y, MON[2] + 0.24];
const TEX_W = 1408, TEX_H = 1664, BAR = 120;
const FD: V3 = add(F, [1.5, TOP, 0.9]); // founder at the desk (typing at the laptop)
const FB: V3 = [2.5, 0, -6.0]; // founder in front of the board (right, below the cards)
const FC: V3 = add(F, [-1.25, TOP, 1.35]); // founder at the end card
const LAPTOP: V3 = add(F, [0.25, TOP, 1.05]);
const KASSE: V3 = add(F, [-2.15, TOP, -0.5]);
// partner island
const P: V3 = [17.5, 0, -8.5];
const P_R = 2.7;
const P_M: V3 = add(P, [0.3, TOP, -0.5]);
// misc
const TG: V3 = [8.95, 6.15, -4.9]; // TAG 2 tag
const FT: V3 = [0.2, 4.7, -3.2]; // keeper card flies here (in front of the camera)
const CC: V3 = [5.6, 3.65, -4.3]; // end card pivot

// ---------- screen content (real claude.ai crops) ----------
type ShotKey = "s1" | "s2" | "s3" | "s4" | "s5" | "s6";
const SHOTS: Record<ShotKey, { file: string; w: number; h: number }> = {
  s1: { file: "s1-plus-research", w: 470, h: 714 }, s2: { file: "s2-prompt", w: 1018, h: 448 },
  s3: { file: "s3-research-laeuft", w: 1528, h: 408 }, s4: { file: "s4-research-complete", w: 1202, h: 215 },
  s5: { file: "s5-ergebnis", w: 1048, h: 520 }, s6: { file: "s6-keine-statistik", w: 1202, h: 252 },
};
type View = { z: number; cx?: number; cy?: number; ay?: number };
const VIEWS: Record<ShotKey, View> = {
  s1: { z: 1 }, s2: { z: 1 }, s3: { z: 1.55, cx: 470, cy: 250, ay: 330 }, s4: { z: 1.8, cx: 360, cy: 108, ay: 330 }, s5: { z: 1 }, s6: { z: 1 },
};
const PAD = 26;
const shotXform = (k: ShotKey) => {
  const s = SHOTS[k], v = VIEWS[k];
  const bw = TEX_W, bh = TEX_H - BAR;
  const fit = Math.min(bw / s.w, (bh - PAD) / s.h);
  const sc = fit * v.z;
  let tx = (bw - s.w * sc) / 2, ty = BAR + PAD;
  if (v.cx !== undefined) { tx = bw / 2 - v.cx * sc; ty = BAR + (v.ay ?? 300) - (v.cy ?? 0) * sc; tx = Math.min(0, Math.max(bw - s.w * sc, tx)); }
  return { sc, tx, ty };
};
// shot pixel → world point on the screen
const shotWorld = (k: ShotKey, sx: number, sy: number): V3 => {
  const { sc, tx, ty } = shotXform(k);
  const X = tx + sx * sc, Y = ty + sy * sc;
  return [SC[0] - SCR_W / 2 + (X / TEX_W) * SCR_W, SC[1] + SCR_H / 2 - (Y / TEX_H) * SCR_H, SC[2]];
};
type Mark = { k: ShotKey; r: number[]; at: number; color: "orange" | "red" | "yellow"; until?: number };
const MARKS: Mark[] = [
  { k: "s1", r: [30, 548, 420, 598], at: T.research, color: "orange" },
  { k: "s2", r: [630, 83, 893, 117], at: T.keinL, color: "yellow", until: T.drittens },
  { k: "s2", r: [900, 83, 977, 117, 34, 125, 277, 159], at: T.keineM, color: "yellow", until: T.drittens },
  { k: "s2", r: [215, 167, 892, 201], at: T.kleine, color: "yellow", until: T.drittens },
  { k: "s2", r: [633, 209, 939, 243], at: T.frag, color: "yellow" },
  { k: "s2", r: [478, 251, 895, 285, 34, 293, 136, 327], at: T.immer, color: "orange" },
  { k: "s3", r: [70, 284, 470, 322], at: T.prueft, color: "yellow" },
  { k: "s4", r: [120, 86, 590, 124], at: T.quellen, color: "orange" },
  { k: "s5", r: [518, 148, 706, 184], at: T.druck, color: "yellow" },
  { k: "s5", r: [370, 190, 732, 226], at: T.arbeit, color: "orange" },
  { k: "s6", r: [706, 224, 1101, 252], at: T.nirgends, color: "red" },
  { k: "s6", r: [781, 181, 1107, 215, 16, 224, 435, 252], at: T.nachb, color: "yellow" },
];
const markWorld = (m: Mark): V3 => {
  const xs = [], ys = [];
  for (let i = 0; i + 3 < m.r.length; i += 4) { xs.push(m.r[i], m.r[i + 2]); ys.push(m.r[i + 1], m.r[i + 3]); }
  return shotWorld(m.k, (Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2);
};
const MW = MARKS.map(markWorld);
// which shot is on the monitor
const shotAt = (t: number): { k: ShotKey | "logo" | "off" | "dim"; since: number } => {
  if (t < T.claude - 0.05) return { k: "off", since: 0 };
  if (t < T.erstens + 0.05) return { k: "logo", since: T.claude - 0.05 };
  if (t < T.zweitens) return { k: "s1", since: T.erstens + 0.05 };
  if (t < T.claude2) return { k: "s2", since: T.zweitens };
  if (t < T.q300) return { k: "s3", since: T.claude2 };
  if (t < T.am) return { k: "s4", since: T.q300 };
  if (t < T.nur) return { k: "s5", since: T.am };
  if (t < T.komm - 0.1) return { k: "s6", since: T.nur };
  return { k: "dim", since: T.komm - 0.1 };
};

// ======================================================================================================
// camera path (orbit keys around pivots, monotone Hermite → always moving, no stops)
// ======================================================================================================
const HP: V3 = [0, 5.65, BFRONT];
const CP: V3 = [0, 4.75, BFRONT];
const SCL: V3 = add(SC, [0, -0.7, 0]);
const PP: V3 = add(P, [0, 2.3, 0]);
const mw = (i: number, dy = 0): V3 => add(MW[i], [0, dy, 0]);
const KEYS: CamKey[] = [
  // B01 hook: wall frontal, slow orbit + push-in
  { t: 0, p: HP, yaw: -0.15, pitch: 0.03, dist: 18.3, ap: 0.45 },
  { t: 1.6, p: HP, yaw: -0.08, pitch: 0.04, dist: 17.6, ap: 0.45 },
  { t: 3.05, p: HP, yaw: -0.02, pitch: 0.05, dist: 17.0, ap: 0.45 },
  // B02 pull back + reveal of the desk (whoosh 3.15)
  { t: 3.6, p: [2.9, 5.2, -6.0], yaw: 0.36, pitch: 0.17, dist: 22.5, ap: 0.5 },
  { t: 4.3, p: [2.6, 5.7, -6.3], yaw: 0.27, pitch: 0.14, dist: 21.4, ap: 0.5 },
  // B03 TAG 1 stamp: push to the hook signs
  { t: 4.85, p: [0.5, 8.0, BFRONT], yaw: 0.1, pitch: 0.05, dist: 12.8, ap: 0.6 },
  { t: 5.35, p: [0.2, 6.9, BFRONT], yaw: 0.05, pitch: 0.05, dist: 14.4, ap: 0.6 },
  // B04 every card turns to "?"
  { t: 5.9, p: CP, yaw: -0.24, pitch: 0.1, dist: 16.6, ap: 0.7 },
  { t: 6.6, p: CP, yaw: 0.12, pitch: 0.07, dist: 15.0, ap: 0.7 },
  // B05 tracking the founder's run to the desk (whoosh 7.0), monitor wakes up
  { t: 7.1, p: [4.4, 2.0, -4.6], yaw: 0.66, pitch: 0.14, dist: 9.6, ap: 1.0 },
  { t: 7.75, p: [5.6, 3.7, -4.9], yaw: 0.32, pitch: 0.1, dist: 12.6, ap: 1.0 },
  { t: 8.2, p: SC, yaw: 0.16, pitch: 0.04, dist: 13.0, ap: 1.0 },
  // B06 step 1: push into the monitor, plus → research
  { t: 8.65, p: SC, yaw: 0.05, pitch: 0.02, dist: 11.4, ap: 1.1 },
  { t: 9.45, p: shotWorld("s1", 45, 160), yaw: -0.07, pitch: 0.03, dist: 9.6, ap: 1.2 },
  { t: 10.25, p: mw(0), yaw: -0.03, pitch: 0.02, dist: 9.6, ap: 1.2 },
  { t: 10.95, p: SCL, yaw: 0.07, pitch: 0.03, dist: 11.2, ap: 1.1 },
  // B07 step 2: rules typed, marks, stickers
  { t: 11.7, p: add(SC, [0, 1.1, 0]), yaw: 0.1, pitch: 0.02, dist: 9.6, ap: 1.1 },
  { t: 13.3, p: mw(1, -0.7), yaw: 0.08, pitch: 0.02, dist: 9.4, ap: 1.2 },
  { t: 14.0, p: mw(2, -0.7), yaw: 0.02, pitch: 0.02, dist: 9.4, ap: 1.2 },
  { t: 14.95, p: mw(3, -0.7), yaw: -0.04, pitch: 0.02, dist: 9.6, ap: 1.2 },
  { t: 15.85, p: SCL, yaw: -0.1, pitch: 0.04, dist: 11.4, ap: 1.0 },
  // B08 step 3: the question
  { t: 16.6, p: add(SC, [0, 0.9, 0]), yaw: -0.04, pitch: 0.02, dist: 9.8, ap: 1.1 },
  { t: 17.2, p: mw(4, -0.7), yaw: 0.02, pitch: 0.02, dist: 9.6, ap: 1.2 },
  { t: 18.2, p: mw(5, -0.7), yaw: 0.07, pitch: 0.02, dist: 9.4, ap: 1.2 },
  { t: 19.0, p: SCL, yaw: 0.12, pitch: 0.04, dist: 10.8, ap: 1.0 },
  // B09 sources: scoreboard drops in front of the monitor
  { t: 19.6, p: [5.6, 3.9, -4.9], yaw: -0.22, pitch: 0.08, dist: 10.2, ap: 1.0 },
  { t: 20.25, p: [5.6, 3.8, -4.9], yaw: -0.03, pitch: 0.06, dist: 9.0, ap: 1.0 },
  { t: 21.0, p: [5.6, 4.0, -4.9], yaw: 0.16, pitch: 0.06, dist: 9.8, ap: 1.0 },
  // B10 result
  { t: 21.5, p: add(SC, [0, 0.8, 0]), yaw: 0.08, pitch: 0.02, dist: 10.6, ap: 1.1 },
  { t: 21.95, p: mw(8, -0.7), yaw: 0.02, pitch: 0.02, dist: 9.6, ap: 1.2 },
  { t: 22.6, p: mw(9, -0.7), yaw: -0.04, pitch: 0.02, dist: 9.4, ap: 1.2 },
  { t: 23.45, p: SCL, yaw: -0.12, pitch: 0.05, dist: 10.8, ap: 1.0 },
  // B11 whip to the partner island (whoosh 23.7)
  { t: 24.05, p: PP, yaw: -0.52, pitch: 0.18, dist: 11.6, ap: 0.9 },
  { t: 24.9, p: PP, yaw: -0.2, pitch: 0.15, dist: 10.2, ap: 0.9 },
  { t: 25.55, p: PP, yaw: 0.08, pitch: 0.12, dist: 9.6, ap: 0.9 },
  // B12 whip back to the board (whoosh 25.7), strikes, the keeper flies at the camera
  { t: 26.0, p: CP, yaw: 0.11, pitch: 0.04, dist: 16.6, ap: 0.7 },
  { t: 26.9, p: CP, yaw: 0.03, pitch: 0.04, dist: 15.9, ap: 0.7 },
  { t: 27.3, p: CP, yaw: 0.0, pitch: 0.04, dist: 15.2, ap: 0.8 },
  { t: 27.85, p: add(FT, [0, 0.35, 0]), yaw: -0.04, pitch: 0.03, dist: 9.6, ap: 1.3 },
  { t: 28.3, p: add(FT, [0, 0.35, 0]), yaw: -0.1, pitch: 0.03, dist: 9.2, ap: 1.3 },
  // B13 open question
  { t: 28.75, p: add(SC, [0, 0.6, 0]), yaw: 0.1, pitch: 0.03, dist: 10.8, ap: 1.1 },
  { t: 29.35, p: mw(10, -0.7), yaw: 0.04, pitch: 0.02, dist: 9.6, ap: 1.2 },
  { t: 30.55, p: mw(11, -0.7), yaw: -0.03, pitch: 0.02, dist: 9.6, ap: 1.2 },
  { t: 31.15, p: SCL, yaw: -0.1, pitch: 0.04, dist: 10.8, ap: 1.0 },
  { t: 31.6, p: TG, yaw: 0.12, pitch: -0.02, dist: 7.2, ap: 1.2 },
  { t: 32.15, p: TG, yaw: 0.22, pitch: -0.01, dist: 6.8, ap: 1.2 },
  // B14 end card: calm drift
  { t: 32.75, p: CC, yaw: 0.08, pitch: 0.04, dist: 12.6, ap: 1.4 },
  { t: 34.5, p: CC, yaw: 0.0, pitch: 0.05, dist: 12.1, ap: 1.4 },
  { t: 36.4, p: CC, yaw: -0.07, pitch: 0.06, dist: 11.7, ap: 1.4 },
];
const PATH = makeCamPath(KEYS);
const PUNCH = [T.tag, T.claude, T.partner, T.shirts];
type Cam = { pos: V3; look: V3; fov: number; ap: number; dist: number; roll: number };
const camAt = (t: number): Cam => {
  const v = PATH(t);
  const hh = handheld(t, 1);
  const o = orbitPos([v[0], v[1], v[2], v[3] + hh[0], v[4] + hh[1], v[5]]);
  // banking on fast yaw moves
  const v2 = PATH(t + 0.02);
  const yawVel = (v2[3] - v[3]) / 0.02;
  const punch = Math.max(0, ...PUNCH.map((p) => bump(t, p + 0.05, 0.22)));
  return { pos: o.pos, look: o.look, fov: v[6] - 3.2 * punch, ap: v[7], dist: v[5], roll: Math.max(-0.07, Math.min(0.07, -yawVel * 0.03)) + hh[2] };
};

// ======================================================================================================
// cards
// ======================================================================================================
type CardS = { flipA: number; spot: number; cross: number; fall: number; fly: number; keep: number };
const cardState = (t: number, i: number): CardS => {
  const isKeep = i === KEEP;
  const spot = Math.max(0, ...SCAN.map((c, k) => (c === i && t < T.ich ? bump(t, SCAN_AT[k] + 0.18, 0.42) : 0)));
  if (isKeep) {
    const rev = back((t - T.shirts) / 0.38);
    return { flipA: Math.PI * (1 - rev), spot, cross: 0, fall: 0, fly: cl((t - T.shirts - 0.3) / 0.55), keep: back((t - T.shirts - 0.12) / 0.35) };
  }
  const fT = T.kein + 0.02 + [0, 1, 2, 3, 4, 5][i] * 0.07;
  const toQ = back((t - fT) / 0.42);
  const sa = strikeAt(i);
  const rev = ease((t - sa) / 0.16);
  return { flipA: Math.PI * toQ * (1 - rev), spot, cross: cl((t - sa - 0.08) / 0.18), fall: Math.max(0, t - sa - 0.3), fly: 0, keep: 0 };
};
const drawCardFace = (c: CanvasRenderingContext2D, w: number, h: number, card: IdeaCard, s: CardS) => {
  c.clearRect(0, 0, w, h);
  const r = 46;
  c.fillStyle = SKC.INK; roundRect(c, 0, 0, w, h, r); c.fill();
  c.fillStyle = s.keep > 0.01 ? "#FFF1E6" : SKC.CREAM; roundRect(c, 12, 12, w - 24, h - 24, r - 10); c.fill();
  c.fillStyle = "rgba(255,255,255,.55)"; roundRect(c, 26, 22, w - 52, h * 0.22, 22); c.fill();
  // icon badge top-left
  c.save(); c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(82, 78, 56, 0, 7); c.fill(); c.lineWidth = 7; c.strokeStyle = SKC.INK; c.stroke(); c.restore();
  drawIcon(c, card.icon, 82, 80, 84);
  const lines = card.label.split("\n");
  c.fillStyle = SKC.INK; c.textAlign = "center"; c.textBaseline = "middle";
  const fs = lines.length > 1 ? 112 : 124;
  lines.forEach((ln, k) => {
    const f = fitFont(c, ln, fs, w - 90);
    const y = lines.length > 1 ? h / 2 + 34 + (k - 0.5) * f * 0.98 : h / 2 + 30;
    c.fillText(ln, w / 2 + 34, y);
  });
  if (s.cross > 0.001) {
    c.fillStyle = `rgba(22,19,15,${0.32 * Math.min(1, s.cross * 2)})`; roundRect(c, 12, 12, w - 24, h - 24, r - 10); c.fill();
    c.lineCap = "round";
    [["#FFFFFF", 50], [SKC.INK, 38], [SKC.RED, 25]].forEach(([col, lw]) => {
      c.strokeStyle = col as string; c.lineWidth = lw as number; c.beginPath();
      const L = w * 0.36, Hh = h * 0.32, k1 = Math.min(1, s.cross * 2), k2 = Math.max(0, s.cross - 0.5) * 2;
      c.moveTo(w / 2 - L, h / 2 - Hh); c.lineTo(w / 2 - L + 2 * L * k1, h / 2 - Hh + 2 * Hh * k1);
      if (k2 > 0) { c.moveTo(w / 2 + L, h / 2 - Hh); c.lineTo(w / 2 + L - 2 * L * k2, h / 2 - Hh + 2 * Hh * k2); }
      c.stroke();
    });
  }
  if (s.keep > 0.01) {
    c.save(); c.translate(w - 78, 76); c.scale(s.keep, s.keep);
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(0, 0, 58, 0, 7); c.fill(); c.fillStyle = SKC.INK; c.beginPath(); c.arc(0, 0, 49, 0, 7); c.fill(); c.fillStyle = "#2FBF71"; c.beginPath(); c.arc(0, 0, 41, 0, 7); c.fill();
    c.strokeStyle = "#FFFFFF"; c.lineWidth = 12; c.lineCap = "round"; c.beginPath(); c.moveTo(-18, 0); c.lineTo(-5, 14); c.lineTo(20, -13); c.stroke();
    c.restore();
  }
};
// physical fall: tip over the bottom edge, then ballistic with spin, land flat on the floor
const G = 24;
const cardPose = (i: number, s: CardS, camT: Cam): { p: V3; rot: V3; scale: number } => {
  const base = slot(i);
  let p: V3 = [base[0], base[1], base[2] + 0.28 * s.spot + 0.12 * s.keep];
  let rot: V3 = [-0.06 * s.spot, s.flipA, (rnd(i + 11) - 0.5) * 0.06];
  if (s.fall > 0) {
    const tip = ease(s.fall / 0.16);
    const ax = 1.0 * tip;
    // rotate about the bottom edge (local y = -CARD_H/2)
    const cy = base[1] - CARD_H / 2 + Math.cos(ax) * CARD_H / 2, cz = base[2] + Math.sin(ax) * CARD_H / 2;
    p = [base[0], cy, cz];
    rot = [ax, 0, rot[2]];
    if (s.fall > 0.16) {
      const tau = s.fall - 0.16;
      const vx = (rnd(i + 3) - 0.5) * 2.4, vy = 1.4, vz = 2.2;
      let y = cy + vy * tau - 0.5 * G * tau * tau;
      const x = base[0] + vx * tau, z = cz + vz * tau;
      let rx = ax + 7.5 * tau, rz = rot[2] + (rnd(i + 5) - 0.5) * 5 * tau;
      const floorY = 0.08;
      // landing time
      const disc = vy * vy + 2 * G * (cy - floorY);
      const tl = (vy + Math.sqrt(disc)) / G;
      if (tau >= tl) {
        const after = tau - tl;
        y = floorY + Math.max(0, 0.35 * Math.sin(Math.min(Math.PI, after * 9)) * Math.exp(-after * 6));
        const rxl = ax + 7.5 * tl;
        rx = rxl + (Math.PI * 1.5 - (rxl % (Math.PI * 2)) + Math.PI * 2) % Math.PI * ease(after / 0.15) * 0 + 0;
        rx = Math.PI / 2 + Math.round((rxl - Math.PI / 2) / Math.PI) * Math.PI;
        rz = rot[2] + (rnd(i + 5) - 0.5) * 5 * tl;
        return { p: [base[0] + vx * tl + vx * 0.12 * ease(after / 0.3), y, cz + vz * tl + vz * 0.12 * ease(after / 0.3)], rot: [rx, 0, rz], scale: 1 };
      }
      return { p: [x, y, z], rot: [rx, 0, rz], scale: 1 };
    }
    return { p, rot, scale: 1 };
  }
  if (s.fly > 0) {
    const k = inOut(s.fly);
    const q = lerp3(p, FT, k);
    p = [q[0], q[1] + Math.sin(k * Math.PI) * 1.2, q[2]];
    rot = [0.15 * Math.sin(k * Math.PI), s.flipA + Math.PI * 2 * ease(s.fly), rot[2] * (1 - k)];
    void camT;
  }
  return { p, rot, scale: 1 };
};

// ======================================================================================================
// founder animation (always moving: breathing, antenna sway, hops with squash & stretch)
// ======================================================================================================
type Pose = { p: V3; yaw: number; armL: number; armR: number; reach: number; lean: number; talk: boolean; squash: number; sway: number; spin: number };
const hop = (t: number, a: number, h = 0.45, d = 0.42) => {
  const u = (t - a) / d;
  if (u < -0.22 || u > 1.3) return { y: 0, sq: 0 };
  if (u < 0) return { y: 0, sq: 0.45 * Math.sin((Math.PI * (u + 0.22)) / 0.22) };
  if (u <= 1) return { y: 4 * h * u * (1 - u), sq: -0.35 * (1 - Math.abs(2 * u - 1)) };
  return { y: 0, sq: 0.55 * Math.sin((Math.PI * (u - 1)) / 0.3) };
};
const run = (a: V3, b: V3, t: number, t0: number, d: number) => {
  const k = inOut((t - t0) / d);
  const p = lerp3(a, b, k);
  const moving = k > 0 && k < 1;
  const ph = (t - t0) * 16;
  return { p: [p[0], p[1] + (moving ? Math.abs(Math.sin(ph)) * 0.22 : 0), p[2]] as V3, yaw: Math.atan2(b[0] - a[0], b[2] - a[2]), moving, swing: moving ? Math.sin(ph) * 55 : 0 };
};
const founder = (t: number): Pose => {
  const breathe = 0.06 * Math.sin(t * 2.6);
  const base: Pose = { p: FB, yaw: 0.3, armL: 15, armR: 15, reach: 0, lean: 0, talk: false, squash: breathe, sway: 0.12 * Math.sin(t * 3.1), spin: 0 };
  const hops = (list: [number, number][]) => {
    let y = 0, sq = 0;
    list.forEach(([a, h]) => { const r = hop(t, a, h); y += r.y; sq += r.sq; });
    return { y, sq };
  };
  // A: in front of the board
  if (t < T.heute + 0.05) {
    const hp = hops([[SCAN_AT[1], 0.18], [SCAN_AT[3], 0.18], [T.tag - 0.1, 0.55], [T.produkt + 0.05, 0.12]]);
    let yaw = 2.55 + 0.25 * Math.sin(t * 1.7), armR = 15, armL = 15, lean = 0;
    if (t < T.ich) { armR = 115 + 25 * Math.sin(t * 6); }
    else if (t < T.kein - 0.1) { yaw = 0.25 + 0.12 * Math.sin(t * 3); armR = 150 + 22 * Math.sin(t * 11); armL = t > T.tag - 0.15 && t < T.tag + 0.5 ? 160 : 20; }
    else { yaw = 0.35; armL = 75; armR = 75; lean = 0.12 * Math.sin(t * 5); }
    return { ...base, p: [FB[0], FB[1] + hp.y, FB[2]], yaw, armR, armL, lean, squash: breathe + hp.sq, talk: t > T.ich && t < T.tag + 0.4, sway: base.sway + hp.sq * 0.6 };
  }
  // B: run to the desk
  if (t < T.heute + 0.95) {
    const r = run(FB, FD, t, T.heute + 0.05, 0.85);
    return { ...base, p: r.p, yaw: r.yaw, armL: 20 + r.swing, armR: 20 - r.swing, lean: 0.25, squash: -0.08, sway: -0.35 };
  }
  // C: at the desk (typing, looking up at the screen, reacting)
  const deskPose = (tt: number, typing: boolean, react: [number, number][]) => {
    const hp = hops(react);
    const look = Math.sin(tt * 0.9) > 0.2;
    return {
      ...base, p: [FD[0], FD[1] + hp.y, FD[2]] as V3,
      yaw: typing ? -1.75 + 0.06 * Math.sin(tt * 4) : look ? -2.6 : -0.6,
      reach: typing ? 0.55 + 0.12 * Math.sin(tt * 18) : 0, lean: typing ? 0.14 : 0.0,
      armR: typing ? 15 : 25, armL: typing ? 15 : 25, squash: breathe + hp.sq + (typing ? 0.04 * Math.sin(tt * 18) : 0), sway: base.sway + hp.sq,
    };
  };
  const TYPING: [number, number][] = [[T.heute + 0.95, T.erstens + 0.2], [T.unten, T.an], [T.schreib, 13.1], [T.frag, T.kaufen + 0.3], [T.claude2, T.prueft + 0.1]];
  if (t < T.ein2 + 0.5) {
    const typing = TYPING.some(([a, b]) => t > a && t < b);
    const p = deskPose(t, typing, [[T.heute + 0.92, 0.1], [T.an, 0.2], [T.keinL + 0.05, 0.12], [T.keineM + 0.05, 0.12], [T.kleine + 0.05, 0.16], [T.immer + 0.05, 0.14], [T.q300 + 0.1, 0.55], [T.druck + 0.05, 0.12], [T.arbeit + 0.05, 0.2]]);
    if (t > T.q300 + 0.05 && t < T.q300 + 0.6) return { ...p, armL: 165, armR: 165, yaw: -0.4 };
    if (t > T.an - 0.05 && t < T.an + 0.6) return { ...p, armR: 160, yaw: -0.5 };
    return p;
  }
  // D: run back to the board (off screen while the camera is at the partner)
  if (t < T.die - 0.1) {
    const r = run(FD, FB, t, T.ein2 + 0.5, 1.0);
    return { ...base, p: r.p, yaw: r.yaw, armL: 20 + r.swing, armR: 20 - r.swing, lean: 0.25, squash: -0.08 };
  }
  // E: watching the strikes, celebrating the keeper
  if (t < T.nur + 0.15) {
    const hp = hops([[T.shirts + 0.05, 0.95], ...STRIKE_ORDER.map((i) => [strikeAt(i) + 0.3, 0.08] as [number, number])]);
    const cel = t > T.shirts - 0.05;
    const spin = cel ? Math.PI * 2 * ease((t - T.shirts - 0.05) / 0.45) : 0;
    return {
      ...base, p: [FB[0], FB[1] + hp.y, FB[2]], yaw: cel ? 0.3 + spin : 2.6 + 0.15 * Math.sin(t * 9), armL: cel ? 160 + 15 * Math.sin(t * 12) : 30, armR: cel ? 160 - 15 * Math.sin(t * 12) : 30,
      squash: breathe + hp.sq, talk: cel, sway: base.sway + hp.sq, spin: 0,
    };
  }
  // F: run to the desk
  if (t < T.nur + 1.0) {
    const r = run(FB, FD, t, T.nur + 0.15, 0.85);
    return { ...base, p: r.p, yaw: r.yaw, armL: 20 + r.swing, armR: 20 - r.swing, lean: 0.25, squash: -0.08, sway: -0.35 };
  }
  // G: desk, open question
  if (t < T.komm - 0.25) {
    const p = deskPose(t, t < T.nirgends - 0.1, [[T.nur + 1.0, 0.12], [T.nirgends + 0.05, 0.1], [T.das + 0.1, 0.18]]);
    if (t > T.nirgends && t < T.das) return { ...p, armR: 165 + 10 * Math.sin(t * 14), armL: 20, lean: -0.12, yaw: -0.5 };
    if (t >= T.das) return { ...p, yaw: 0.9, armR: 120, armL: 20 };
    return p;
  }
  // H: end card: steps to the front, waves, hops
  const r = run(FD, FC, t, T.komm - 0.25, 0.55);
  const hp = hops([[T.und + 0.02, 0.3], [T.guide + 0.4, 0.3]]);
  if (r.moving) return { ...base, p: r.p, yaw: r.yaw, armL: 20 + r.swing, armR: 20 - r.swing, lean: 0.2 };
  return { ...base, p: [FC[0], FC[1] + hp.y, FC[2]], yaw: 0.35 + 0.1 * Math.sin(t * 2), armL: 25, armR: 150 + 25 * Math.sin(t * 10), squash: breathe + hp.sq, talk: true, sway: base.sway + hp.sq };
};

// ======================================================================================================
// screen texture
// ======================================================================================================
type Imgs = Record<ShotKey | "logo", HTMLImageElement | null>;
const drawCursor = (c: CanvasRenderingContext2D, x: number, y: number, press: number, s = 74) => {
  c.save(); c.translate(x, y); c.scale(s / 24 * (1 - 0.15 * press), s / 24 * (1 - 0.15 * press));
  if (press > 0.01) { c.strokeStyle = SKC.OR; c.globalAlpha = press; c.lineWidth = 2.4; c.beginPath(); c.arc(0, 0, 14 - 6 * press, 0, 7); c.stroke(); c.globalAlpha = 1; }
  c.shadowColor = "rgba(0,0,0,.5)"; c.shadowBlur = 6; c.shadowOffsetY = 2;
  const pth = new Path2D("M3 2 L3 19 L7.5 15 L10.5 22 L13.5 20.7 L10.6 14 L17 14 Z");
  c.translate(-3, -2); c.fillStyle = "#FFFFFF"; c.fill(pth); c.shadowBlur = 0; c.lineWidth = 1.6; c.strokeStyle = SKC.INK; c.lineJoin = "round"; c.stroke(pth);
  c.restore();
};
const drawScreen = (c: CanvasRenderingContext2D, t: number, imgs: Imgs) => {
  const w = TEX_W, h = TEX_H;
  const cur = shotAt(t);
  c.fillStyle = "#191919"; c.fillRect(0, 0, w, h);
  if (cur.k === "off") {
    const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#232326"); g.addColorStop(1, "#121214"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    return;
  }
  // title bar (claude.ai paper look)
  c.fillStyle = SKC.PAPER; c.fillRect(0, 0, w, BAR);
  c.fillStyle = SKC.INK; c.fillRect(0, BAR - 8, w, 8);
  ["#E5534B", "#E9B23A", "#3FB950"].forEach((cc, i) => { c.fillStyle = cc; c.beginPath(); c.arc(56 + i * 50, BAR / 2 - 4, 16, 0, 7); c.fill(); c.lineWidth = 5; c.strokeStyle = SKC.INK; c.stroke(); });
  if (imgs.logo) c.drawImage(imgs.logo, w / 2 - 150, BAR / 2 - 34, 60, 60);
  c.fillStyle = SKC.INK; c.font = `600 58px ${SERIF}`; c.textAlign = "left"; c.textBaseline = "middle"; c.fillText("claude.ai", w / 2 - 78, BAR / 2 - 2);
  const intro = ease((t - cur.since) / 0.28);
  if (cur.k === "logo" || cur.k === "dim") {
    const k = cur.k === "logo" ? back((t - cur.since) / 0.45) : 1;
    c.save(); c.translate(w / 2, h * 0.45); c.scale(Math.max(0.01, k), Math.max(0.01, k));
    if (imgs.logo) c.drawImage(imgs.logo, -170, -260, 340, 340);
    c.fillStyle = "#F4EFE5"; c.font = `600 150px ${SERIF}`; c.textAlign = "center"; c.fillText("Claude", 0, 200);
    c.restore();
    if (cur.k === "dim") { c.fillStyle = "rgba(10,10,10,.45)"; c.fillRect(0, BAR, w, h - BAR); }
    return;
  }
  const k = cur.k as ShotKey;
  const img = imgs[k];
  const { sc, tx, ty } = shotXform(k);
  const S = SHOTS[k];
  c.save();
  c.beginPath(); c.rect(0, BAR, w, h - BAR); c.clip();
  // content slides in (wipe from top + slight lift)
  c.globalAlpha = intro;
  c.translate(0, (1 - intro) * 60);
  let revealH = S.h;
  if (k === "s2") revealH = S.h * cl((t - T.schreib) / (13.1 - T.schreib));
  if (k === "s2" && t < T.schreib) revealH = 0;
  if (img) {
    if (k === "s2") {
      // line-by-line typing: reveal whole lines (42 px pitch)
      const lines = Math.ceil(revealH / 42);
      const rh = Math.min(S.h, lines * 42 + 20);
      c.drawImage(img, 0, 0, S.w, rh, tx, ty, S.w * sc, rh * sc);
      if (revealH < S.h && Math.sin(t * 14) > 0) { c.fillStyle = "#E8E4DA"; c.fillRect(tx + 40 * sc + ((t * 900) % (S.w - 120)) * sc * 0.6, ty + (rh - 30) * sc, 4 * sc, 26 * sc); }
    } else c.drawImage(img, tx, ty, S.w * sc, S.h * sc);
  }
  // marks
  const col = { orange: ["rgba(255,107,53,.26)", SKC.OR], red: ["rgba(229,72,77,.28)", SKC.RED], yellow: ["rgba(245,197,66,.22)", SKC.GOLD] };
  const ms = MARKS.filter((m) => m.k === k);
  const anyOn = ms.some((m) => t > m.at && (!m.until || t < m.until));
  if (anyOn && k !== "s3" && k !== "s4") { c.fillStyle = "rgba(10,10,10,.38)"; c.fillRect(tx, ty, S.w * sc, S.h * sc); }
  ms.forEach((m) => {
    const mk = ease((t - m.at) / 0.28) * (m.until ? 1 - ease((t - m.until) / 0.2) : 1);
    if (mk <= 0.001) return;
    const [bg, line] = col[m.color];
    for (let i = 0; i + 3 < m.r.length; i += 4) {
      const [x0, y0, x1, y1] = m.r.slice(i, i + 4);
      const pad = 7;
      const X = tx + x0 * sc - pad, Y = ty + y0 * sc - pad, Wd = (x1 - x0) * sc + 2 * pad, Hd = (y1 - y0) * sc + 2 * pad;
      // re-draw the marked text bright on top of the dim layer
      if (img) { c.save(); c.beginPath(); c.rect(X, Y, Wd * Math.min(1, mk * 1.3), Hd); c.clip(); c.drawImage(img, tx, ty, S.w * sc, S.h * sc); c.restore(); }
      c.save(); c.shadowColor = line; c.shadowBlur = 28;
      c.fillStyle = bg; roundRect(c, X, Y, Wd * Math.min(1, mk * 1.3), Hd, 12); c.fill();
      c.lineWidth = 6; c.strokeStyle = line; roundRect(c, X, Y, Wd * Math.min(1, mk * 1.3), Hd, 12); c.stroke();
      c.restore();
    }
  });
  // cursors
  if (k === "s1") {
    const toPlus = ease((t - T.unten) / 0.4), toRes = ease((t - T.plus - 0.3) / 0.4);
    const sx = 48 + (200 - 48) * toRes + (1 - toPlus) * 170, sy = 170 + (585 - 170) * toRes + (1 - toPlus) * 150;
    const press = Math.max(bump(t, T.plus + 0.05, 0.14), bump(t, T.research + 0.08, 0.14));
    c.globalAlpha = intro * ease((t - T.unten + 0.1) / 0.2);
    drawCursor(c, tx + sx * sc, ty + sy * sc, press, 84);
  }
  if (k === "s2" && t > T.kaufen - 0.35) {
    c.globalAlpha = ease((t - T.kaufen + 0.35) / 0.2);
    drawCursor(c, tx + 960 * sc, ty + 420 * sc, bump(t, T.kaufen + 0.1, 0.14), 80);
  }
  c.restore();
  // scan line + subtle screen sheen (alive)
  c.fillStyle = "rgba(255,255,255,.035)"; c.fillRect(0, BAR + ((t * 520) % (h - BAR)), w, 70);
};

// ======================================================================================================
// textures
// ======================================================================================================
const useStatic = (ready: boolean, claude: HTMLImageElement | null) =>
  React.useMemo(() => {
    if (!ready) return null;
    const t = makeWorldTex(DAY);
    const tx = (w: number, h: number, o: Parameters<typeof drawFace>[3]) => faceTex(w, h, o);
    const q = canvasTex(620, 360, (c) => {
      c.clearRect(0, 0, 620, 360);
      c.fillStyle = SKC.INK; roundRect(c, 0, 0, 620, 360, 46); c.fill();
      c.fillStyle = "#E9E1D2"; roundRect(c, 12, 12, 596, 336, 36); c.fill();
      c.fillStyle = "rgba(255,255,255,.5)"; roundRect(c, 26, 22, 568, 80, 22); c.fill();
      c.fillStyle = SKC.MUTED; c.font = font(250); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("?", 310, 196);
    });
    const cork = canvasTex(1024, 1024, (c) => {
      const g = c.createLinearGradient(0, 0, 0, 1024); g.addColorStop(0, "#E2BE92"); g.addColorStop(1, "#C99A6B");
      c.fillStyle = g; c.fillRect(0, 0, 1024, 1024);
      for (let i = 0; i < 2600; i++) { c.fillStyle = `rgba(110,70,30,${0.06 + rnd(i) * 0.12})`; c.fillRect(rnd(i + 1) * 1024, rnd(i + 2) * 1024, 4, 4); }
    });
    const hook1 = textTex("KI GRÜNDET", "#FFFFFF", 220);
    const hook2 = textTex("EINE FIRMA", SKC.OR, 230);
    const laptop = canvasTex(512, 320, (c) => {
      c.fillStyle = SKC.PAPER; c.fillRect(0, 0, 512, 320);
      if (claude) c.drawImage(claude, 196, 60, 120, 120);
      c.fillStyle = SKC.INK; c.font = `600 44px ${SERIF}`; c.textAlign = "center"; c.fillText("claude.ai", 256, 240);
    });
    const strip = digitStripTex();
    const pdf = canvasTex(300, 380, (c) => {
      c.fillStyle = SKC.INK; roundRect(c, 0, 0, 300, 380, 30); c.fill(); c.fillStyle = "#FFFFFF"; roundRect(c, 12, 12, 276, 356, 22); c.fill();
      c.fillStyle = "#D8D2C6"; [60, 100, 140].forEach((y, i) => c.fillRect(40, y, 220 - i * 40, 18));
      c.fillStyle = SKC.RED; roundRect(c, 60, 230, 180, 90, 16); c.fill(); c.fillStyle = "#FFFFFF"; c.font = font(64); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("PDF", 150, 278);
    });
    const src = ["globe", "doc", "chart", "globe", "doc", "list"].map((kind, i) => canvasTex(160, 160, (c) => {
      c.fillStyle = SKC.INK; roundRect(c, 0, 0, 160, 160, 34); c.fill(); c.fillStyle = ["#FFFFFF", SKC.CREAM, "#E6F3FF"][i % 3]; roundRect(c, 10, 10, 140, 140, 26); c.fill();
      c.strokeStyle = SKC.INK; c.lineWidth = 8; c.fillStyle = [SKC.BLUE, SKC.OR, SKC.GREEN][i % 3];
      if (kind === "globe") { c.beginPath(); c.arc(80, 80, 42, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.ellipse(80, 80, 18, 42, 0, 0, 7); c.stroke(); c.beginPath(); c.moveTo(38, 80); c.lineTo(122, 80); c.stroke(); }
      else if (kind === "chart") { [40, 70, 100].forEach((x, k) => { c.fillRect(x, 110 - (k + 1) * 22, 20, (k + 1) * 22); c.strokeRect(x, 110 - (k + 1) * 22, 20, (k + 1) * 22); }); }
      else { c.fillStyle = "#FFFFFF"; roundRect(c, 46, 32, 68, 96, 10); c.fill(); c.stroke(); c.fillStyle = "#D8D2C6"; [56, 76, 96].forEach((y) => c.fillRect(58, y, 44, 8)); }
    }));
    return {
      world: t, q, cork, hook1, hook2, laptop, strip, pdf, src,
      header: tx(1200, 190, { bg: "#FFFFFF", text: "WAS VERKAUFEN WIR?", size: 104 }),
      alleine: tx(860, 190, { bg: SKC.INK, fg: "#FFFFFF", text: "GANZ ALLEINE", size: 100 }),
      tag1: tx(520, 220, { bg: SKC.OR, fg: "#FFFFFF", text: "TAG 1", size: 140, stroke: SKC.INK }),
      heute: tx(1200, 220, { bg: SKC.OR, fg: "#FFFFFF", text: "HEUTE: PRODUKT FINDEN", size: 104 }),
      research: tx(980, 200, { bg: SKC.GREEN, fg: "#FFFFFF", text: "✓ RESEARCH AN", size: 104 }),
      kLager: tx(760, 200, { bg: "#FFFFFF", text: "KEIN LAGER", size: 100 }),
      kMasch: tx(980, 200, { bg: "#FFFFFF", text: "KEINE MASCHINE", size: 100 }),
      kBetr: tx(1020, 210, { bg: SKC.OR, fg: "#FFFFFF", text: "KLEINE BETRIEBE", size: 104 }),
      kaufen: tx(1100, 330, { bg: SKC.OR, fg: "#FFFFFF", text: "WAS KAUFEN SIE\nIMMER WIEDER?", size: 112 }),
      sbHead: tx(1200, 170, { bg: SKC.INK, fg: "#FFFFFF", text: "QUELLEN GEPRÜFT", size: 100 }),
      druck: tx(900, 200, { bg: "#FFFFFF", text: "DRUCKSACHEN", size: 104 }),
      arbeit: tx(1240, 220, { bg: SKC.OR, fg: "#FFFFFF", text: "ARBEITSKLEIDUNG + LOGO", size: 100 }),
      partner: tx(1100, 230, { bg: SKC.BLUE, fg: "#FFFFFF", text: "PARTNER DRUCKT", size: 120 }),
      ab1: tx(760, 420, { bg: "#FFFFFF", sub: "AB", subCol: SKC.BLUE, text: "1 STÜCK", size: 170 }),
      shirts: tx(1300, 260, { bg: SKC.OR, fg: "#FFFFFF", text: "FIRMENSHIRTS", size: 160, stroke: SKC.INK }),
      statistik: tx(1080, 210, { bg: SKC.RED, fg: "#FFFFFF", text: "KEINE STATISTIK", size: 104 }),
      nachb: tx(1240, 210, { bg: "#FFFFFF", text: "WIE OFT NACHBESTELLT?", size: 100 }),
      tag2: canvasTex(640, 560, (c) => drawTag(c, 640, 560, "TAG 2", "NACHBESTELLUNG?", "#FFFFFF")),
      komm: textTex("KOMMENTIERE", "#FFFFFF", 200),
      guide: tx(1240, 220, { bg: "#FFFFFF", text: "GUIDE PER DM", size: 120 }),
      dm: tx(460, 260, { bg: SKC.BLUE, fg: "#FFFFFF", text: "DM", size: 130 }),
    };
  }, [ready, claude]);
type Static = NonNullable<ReturnType<typeof useStatic>>;

// ======================================================================================================
// world
// ======================================================================================================
const KasseBoard: React.FC<{ t: number; tex: THREE.Texture }> = ({ t, tex }) => {
  const open = back((t - T.probier) / 0.4);
  const fold = ease((t - T.das) / 0.45);
  const ang = (-Math.PI / 2) * (1 - open) + (-Math.PI / 2) * fold;
  if (open <= 0.001 || fold >= 0.999) return null;
  return (
    <group position={KASSE} rotation={[0, 0.35, 0]}>
      <group rotation={[ang, 0, 0]}>
        <Plate3D w={1.9} h={1.55} d={0.14} r={0.26} tex={tex} p={[0, 0.82, 0]} glow={0.55} />
      </group>
      <mesh position={[0, 0.04, 0]}><boxGeometry args={[2.1, 0.08, 0.4]} /><meshStandardMaterial color={SKC.INK} /></mesh>
    </group>
  );
};

const Monitor: React.FC<{ t: number; screen: THREE.Texture; on: number }> = ({ t, screen, on }) => {
  const sheen = ((t * 0.35) % 1.6) - 0.3;
  return (
    <group position={[MON[0], 0, MON[2]]}>
      {/* stand */}
      <mesh position={[0, TOP + 0.08, 0.1]} castShadow receiveShadow><cylinderGeometry args={[1.1, 1.25, 0.16, 40]} /><meshStandardMaterial color="#2A2622" roughness={0.35} metalness={0.3} /></mesh>
      <mesh position={[0, 1.2, -0.05]} castShadow><boxGeometry args={[0.5, 1.6, 0.3]} /><meshStandardMaterial color="#2A2622" roughness={0.35} metalness={0.3} /></mesh>
      {/* body with thickness */}
      <mesh geometry={roundRectGeo(SCR_W + 0.42, SCR_H + 0.42, 0.32, 0.34, 0.06)} position={[0, SCR_Y, 0]} castShadow receiveShadow>
        <meshStandardMaterial attach="material-0" color="#1B1916" roughness={0.3} metalness={0.25} />
        <meshStandardMaterial attach="material-1" color="#3A342E" roughness={0.35} metalness={0.4} />
      </mesh>
      {/* orange accent strip on the bezel */}
      <mesh position={[0, SCR_Y - SCR_H / 2 - 0.12, 0.24]}><boxGeometry args={[1.0, 0.06, 0.02]} /><meshBasicMaterial color={SKC.OR} toneMapped={false} /></mesh>
      {/* the screen */}
      <mesh position={[0, SCR_Y, 0.235]}>
        <planeGeometry args={[SCR_W, SCR_H]} />
        <meshStandardMaterial map={screen} emissiveMap={screen} emissive="#FFFFFF" emissiveIntensity={0.25 + 0.75 * on} roughness={0.95} metalness={0.0} envMapIntensity={0.15} />
      </mesh>
      {/* moving glass sheen */}
      <mesh position={[(sheen - 0.5) * SCR_W, SCR_Y, 0.25]} rotation={[0, 0, 0.5]}>
        <planeGeometry args={[0.7, SCR_H * 1.3]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      {on > 0.01 && <pointLight position={[0, 0.9, 2.6]} intensity={10 * on} distance={9} decay={1.5} color="#DCE8FF" />}
    </group>
  );
};

const StepBar3D: React.FC<{ t: number; tex: THREE.Texture }> = ({ t, tex }) => {
  const vin = back((t - T.erstens) / 0.45), vout = ease((t - T.claude2 + 0.2) / 0.35);
  if (vin <= 0.001 || vout >= 0.999) return null;
  const flip = [T.zweitens, T.drittens].reduce((a, s) => a + (t > s ? Math.PI * 2 * back((t - s) / 0.5) : 0), 0);
  const y = 7.95 + (1 - vin) * 3 + vout * 4;
  const sw = Math.sin(t * 1.9) * 0.04 + [T.erstens, T.zweitens, T.drittens].reduce((a, s) => a + Math.sin((t - s) * 9) * 0.1 * Math.exp(-Math.max(0, t - s) * 3) * (t > s ? 1 : 0), 0);
  return (
    <group position={[MON[0], y, MON[2] + 0.55]} rotation={[0, 0, sw]}>
      <Rope a={[-1.6, 9, 0]} b={[-1.6, 0.4, 0]} />
      <Rope a={[1.6, 9, 0]} b={[1.6, 0.4, 0]} />
      <group rotation={[flip, 0, 0]}>
        <Plate3D w={4.5} h={0.9} d={0.16} r={0.38} tex={tex} glow={0.6} />
      </group>
      {[T.erstens, T.zweitens, T.drittens].map((s, i) => <Burst key={i} p={[0, 0, 0.3]} t={t} at={s + 0.05} seed={40 + i} n={12} speed={2.4} />)}
    </group>
  );
};

const drawSteps = (c: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  const starts = [T.erstens, T.zweitens, T.drittens];
  const labels = ["PLUS → RESEARCH", "REGELN", "FRAGE"];
  const cur = starts.reduce((a, s, i) => (t >= s - 0.05 ? i : a), 0);
  drawFace(c, w, h, { bg: "#FFFFFF" });
  const r = 74, cy = h / 2;
  let x = 70;
  c.textBaseline = "middle"; c.textAlign = "center";
  for (let i = 0; i < 3; i++) {
    const done = i < cur, act = i === cur;
    c.fillStyle = SKC.INK; c.beginPath(); c.arc(x + r, cy, r, 0, 7); c.fill();
    c.fillStyle = done ? SKC.GREEN : act ? SKC.OR : "#FFFFFF"; c.beginPath(); c.arc(x + r, cy, r - 12, 0, 7); c.fill();
    if (done) { c.strokeStyle = "#FFFFFF"; c.lineWidth = 16; c.lineCap = "round"; c.beginPath(); c.moveTo(x + r - 28, cy); c.lineTo(x + r - 8, cy + 22); c.lineTo(x + r + 30, cy - 22); c.stroke(); }
    else { c.fillStyle = act ? "#FFFFFF" : SKC.INK; c.font = font(92); c.fillText(String(i + 1), x + r, cy + 4); }
    x += 2 * r + 18;
    if (act) {
      c.fillStyle = SKC.INK; c.textAlign = "left"; fitFont(c, labels[i], 100, w - x - (2 - i) * (2 * r + 50) - 60); c.fillText(labels[i], x + 6, cy + 4); c.textAlign = "center";
      x += c.measureText(labels[i]).width + 40;
    } else if (i < 2) { c.fillStyle = "#D8D2C6"; c.fillRect(x, cy - 7, 36, 14); x += 54; }
  }
};

const drawKasse = (c: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  drawFace(c, w, h, { bg: SKC.CREAM });
  c.textAlign = "center"; c.textBaseline = "middle";
  c.fillStyle = SKC.OR; c.font = font(64); c.fillText("KASSE", w / 2, 96);
  c.fillStyle = SKC.INK; c.font = font(150); c.fillText("0 €", w / 2, 220);
  c.fillStyle = "rgba(22,19,15,.15)"; c.fillRect(70, 318, w - 140, 8);
  c.fillStyle = SKC.OR; c.font = font(64); c.fillText("PRODUKT", w / 2, 392);
  const val = t > T.shirts ? "FIRMENSHIRTS" : t > T.produkt - 0.05 ? "?" : "–";
  c.fillStyle = t > T.shirts ? SKC.OR_D : SKC.INK; fitFont(c, val, 140, w - 120); c.fillText(val, w / 2, 500);
};

const drawComment = (c: CanvasRenderingContext2D, w: number, h: number, t: number, keyword: string) => {
  const sent = t > T.und;
  drawFace(c, w, h, { bg: "#FFFFFF", r: h / 2 });
  c.fillStyle = sent ? SKC.GREEN : SKC.INK; roundRect(c, 0, 0, w, h, h / 2); c.lineWidth = 0;
  c.fillStyle = "#FFFFFF"; roundRect(c, 14, 14, w - 28, h - 28, h / 2 - 14); c.fill();
  c.fillStyle = "#D8D2C6"; c.beginPath(); c.arc(h / 2 + 8, h / 2, h / 2 - 34, 0, 7); c.fill(); c.lineWidth = 7; c.strokeStyle = SKC.INK; c.stroke();
  c.fillStyle = SKC.INK; c.font = font(46); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("DU", h / 2 + 8, h / 2 + 2);
  const typed = keyword.slice(0, Math.max(0, Math.floor((t - T.kw) * 10)));
  c.textAlign = "left"; c.font = font(86, 800); c.fillStyle = typed ? SKC.INK : SKC.MUTED;
  c.fillText((typed || "Kommentar …") + (!sent && typed && Math.sin(t * 12) > 0 ? "|" : ""), h + 20, h / 2 + 4);
  c.fillStyle = sent ? SKC.GREEN : SKC.OR; c.beginPath(); c.arc(w - h / 2 - 6, h / 2, h / 2 - 30, 0, 7); c.fill(); c.lineWidth = 7; c.strokeStyle = SKC.INK; c.stroke();
  c.fillStyle = "#FFFFFF"; c.textAlign = "center"; c.font = font(64); c.fillText(sent ? "✓" : "➤", w - h / 2 - 6, h / 2 + 4);
};

const World: React.FC<{ t: number; st: Static; dyn: Record<string, THREE.Texture>; cam: Cam; fx: Parameters<typeof PostFX>[0]["fx"]; cover: boolean }> = ({ t, st, dyn, cam, fx, cover }) => {
  const fo = founder(t);
  const tt = cover ? Math.max(t, T.tag + 0.8) : t; // cover: every hook piece is in
  const lightTarget = React.useMemo(() => new THREE.Object3D(), []);
  lightTarget.position.set(cam.look[0], 0, cam.look[2]); lightTarget.updateMatrixWorld();
  // gallery spot on the board follows the scan during the hook
  const spotT = React.useMemo(() => new THREE.Object3D(), []);
  const scanIdx = SCAN.reduce((a, c, k) => (t >= SCAN_AT[k] - 0.05 ? c : a), -1);
  const sp = t < T.ich && scanIdx >= 0 ? slot(scanIdx) : ([0, 4.8, BFRONT] as V3);
  spotT.position.set(...sp); spotT.updateMatrixWorld();
  const scanOn = t < T.ich + 0.2 && t > T.ki - 0.2;
  // moods
  const partnerOn = cl((t - T.partner + 0.1) / 0.35) * (1 - cl((t - T.nur) / 0.5) * 0.6);
  const screenOn = cl((t - T.claude + 0.05) / 0.3);
  const keepGlow = cl((t - T.shirts) / 0.3);
  const ctaK = ease((t - T.komm) / 0.6);
  const cardsSt = CARDS.map((_, i) => cardState(t, i));
  const hookOut = cover ? 0 : ease((t - T.tag - 0.55) / 0.5);
  const hk = (a: number) => (cover ? 1 : back((tt - a + 0.03) / 0.36));
  const stamp = cover ? 1 : cl((t - T.tag + 0.12) / 0.16);
  const running = t > T.druckt && t < T.nimmt;
  const drop = cl((t - T.einem + 0.25) / 0.45);
  const hookSwing = (a: number, s: number) => Math.sin((tt - a) * 6 + s) * 0.12 * Math.exp(-Math.max(0, tt - a) * 2) + 0.025 * Math.sin(tt * 1.6 + s) + bump(t, T.tag, 0.4) * 0.08 * Math.sin(t * 30);
  // scoreboard
  const sbIn = back((t - T.claude2 + 0.15) / 0.5), sbOut = ease((t - T.am + 0.1) / 0.4);
  const qv = t < T.q300 ? 169 * ease((t - T.prueft) / 0.45) : 169 + 145 * ease((t - T.q300) / 0.42);
  const odo = (i: number) => { const p = Math.pow(10, i); const fl = Math.floor(qv / p) % 10; return fl + (i === 0 ? qv - Math.floor(qv) : cl((qv % p) - (p - 1))); };
  const SB: V3 = [MON[0], 3.2 + (1 - sbIn) * 5 + sbOut * 6, MON[2] + 1.25];
  return (
    <>
      <CameraRig2 pos={cam.pos} look={cam.look} fov={cam.fov} roll={cam.roll} />
      <PostFX fx={fx} />
      <EnvLight intensity={0.32} />
      <color attach="background" args={[SKC.BG]} />
      <fog attach="fog" args={[ctaK > 0 ? "#E3C49C" : "#D9B98F", 28, 75]} />
      <ambientLight intensity={0.42 - 0.1 * ctaK} color="#FFF0DC" />
      <hemisphereLight args={["#FFF4E2", "#7A4A2A", 0.55]} />
      <primitive object={lightTarget} />
      <primitive object={spotT} />
      <directionalLight position={[cam.look[0] + 7, 18, cam.look[2] + 10]} target={lightTarget} intensity={1.75 + 0.2 * ctaK} color={ctaK > 0 ? "#FFD7A8" : "#FFE6C4"} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={16} shadow-camera-bottom={-16} shadow-camera-far={80} shadow-bias={-0.0015} shadow-normalBias={0.04} />
      <directionalLight position={[cam.look[0] - 8, 10, cam.look[2] - 14]} target={lightTarget} intensity={1.1} color="#CFE6FF" />
      <spotLight position={[sp[0] + 2.5, 13, BFRONT + 8]} target={spotT} angle={scanOn ? 0.22 : 0.5} penumbra={0.7} intensity={scanOn ? 38 : 18} distance={34} decay={1.5} color="#FFD9A0" />
      {keepGlow > 0.01 && <pointLight position={add(FT, [0, 0.4, 1.8])} intensity={16 * keepGlow * (1 + 0.3 * Math.sin(t * 8))} distance={8} color="#FFB48A" />}

      <ShirtRoom t={t} tex={st.world} sign={t > T.heute} />
      <Motes t={t} center={[0, 5, -5]} size={[10, 9, 6]} n={50} seed={1} />
      <Motes t={t} center={[MON[0], 4.5, -7.2]} size={[9, 7, 2]} n={36} seed={2} color="#FFE7C2" />
      <LightCone p={[0, 0, -6.5]} t={t} seed={2} color="#FFE2B0" r={4.2} o={0.05 + 0.04 * (scanOn ? 1 : 0)} />

      {/* ---------- idea board ---------- */}
      <group position={[0, 0, BZ]}>
        <mesh geometry={roundRectGeo(BW, BY1 - BY0, 0.4, BD, 0.08)} position={[0, (BY0 + BY1) / 2, 0]} castShadow receiveShadow>
          <meshStandardMaterial attach="material-0" map={st.cork} roughness={0.85} />
          <meshStandardMaterial attach="material-1" color={SKC.INK} roughness={0.5} />
        </mesh>
        {[-2.6, 2.6].map((x) => <mesh key={x} position={[x, BY0 / 2, -0.3]} castShadow><boxGeometry args={[0.3, BY0, 0.3]} /><meshStandardMaterial color={SKC.OAK_D} /></mesh>)}
        {[-2.6, 2.6].map((x) => <mesh key={x + "f"} position={[x, 0.06, -0.3]}><boxGeometry args={[0.6, 0.12, 1.4]} /><meshStandardMaterial color={SKC.OAK_D} /></mesh>)}
      </group>
      <Plate3D w={5.4} h={0.86} d={0.14} r={0.3} tex={st.header} p={[0, 7.72, BFRONT + 0.1]} rot={[0, 0, 0.01 * Math.sin(t * 1.2)]} glow={0.55} />
      {CARDS.map((card, i) => {
        const s = cardsSt[i];
        const pose = cardPose(i, s, cam);
        return (
          <group key={i} position={pose.p} rotation={pose.rot}>
            <Plate3D w={CARD_W} h={CARD_H} d={CARD_D} r={0.22} tex={dyn[`card${i}`]} backTex={st.q} glow={0.5} />
            <mesh position={[0, CARD_H / 2 - 0.14, CARD_D / 2 + 0.1]}><sphereGeometry args={[0.09, 14, 10]} /><meshStandardMaterial color={i === KEEP && s.keep > 0 ? SKC.OR : SKC.RED} roughness={0.25} /></mesh>
            {s.keep > 0.05 && <mesh position={[0, 0, -0.2]}><planeGeometry args={[CARD_W * 1.5, CARD_H * 1.7]} /><meshBasicMaterial color="#FFB070" transparent opacity={0.22 * s.keep} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></mesh>}
          </group>
        );
      })}
      {STRIKE_ORDER.map((i, k) => <Burst key={i} p={slot(i)} t={t} at={strikeAt(i) + 0.3} seed={70 + k} n={10} speed={2.2} colors={[SKC.RED, "#FFFFFF", SKC.INK]} />)}
      <Burst p={FT} t={t} at={T.shirts + 0.85} n={40} speed={5} size={0.16} seed={9} colors={[SKC.OR, SKC.GOLD, "#FFFFFF", SKC.GREEN, SKC.BLUE]} life={1.3} />
      <Burst p={slot(KEEP)} t={t} at={T.shirts + 0.05} n={22} speed={3.5} seed={19} />
      {/* FIRMENSHIRTS banner above the flown card */}
      <Sticker3D t={t} at={T.shirts + 0.55} until={T.nur + 0.2} tex={st.shirts} w={3.3} h={0.66} p={add(FT, [0, 1.62, 0.3])} rot={-3} seed={5} />

      {/* ---------- hook signs (hang on ropes, stamp, fly up) ---------- */}
      {hookOut < 0.999 && (
        <group position={[0, hookOut * 9, 0]}>
          {[{ a: T.ki, y: 10.75, tex: st.hook1, w: 4.6 }, { a: T.ein, y: 9.82, tex: st.hook2, w: 5.0 }].map((h, i) => {
            const k = hk(h.a);
            if (k <= 0.001) return null;
            const hh = h.w / h.tex.aspect;
            return (
              <group key={i} position={[0, h.y + (1 - Math.min(1, k)) * 1.4, BFRONT + 0.5 + i * 0.1]} rotation={[0, 0.0, hookSwing(h.a, i)]}>
                <Rope a={[-1.4, 9, -0.1]} b={[-1.4, hh / 2 - 0.1, -0.1]} r={0.02} />
                <Rope a={[1.4, 9, -0.1]} b={[1.4, hh / 2 - 0.1, -0.1]} r={0.02} />
                <ExtrudedText face={h.tex.face} side={h.tex.side} w={h.w} h={hh} depth={0.32} s={Math.max(0.001, k)} />
              </group>
            );
          })}
          {(() => {
            const k = hk(T.ganz);
            return k > 0.001 && (
              <group position={[-0.95, 8.98, BFRONT + 0.45]} rotation={[0, 0, -0.03 + hookSwing(T.ganz, 2)]}>
                <Rope a={[-1.0, 10, -0.1]} b={[-1.0, 0.3, -0.1]} r={0.02} />
                <Rope a={[1.0, 10, -0.1]} b={[1.0, 0.3, -0.1]} r={0.02} />
                <Plate3D w={3.3} h={0.73} d={0.16} r={0.2} tex={st.alleine} s={Math.max(0.001, k)} glow={0.6} />
              </group>
            );
          })()}
          {stamp > 0.001 && (
            <group position={[2.15, 8.98 + (1 - stamp) * 0.4, BFRONT + 0.6 + (1 - stamp) * 5]} rotation={[0, (1 - stamp) * -0.6, 0.07 + (1 - stamp) * 0.4]}>
              <Plate3D w={1.95} h={0.83} d={0.2} r={0.22} tex={st.tag1} s={1 + 0.5 * (1 - stamp) + 0.08 * bump(t, T.tag + 0.06, 0.12)} glow={0.65} />
            </group>
          )}
          <Burst p={[2.15, 8.98, BFRONT + 0.8]} t={t} at={T.tag + 0.04} n={24} speed={3.6} seed={3} colors={["#FFFFFF", "#E8D3B0", SKC.OR]} />
        </group>
      )}

      {/* ---------- founder desk ---------- */}
      <Island p={F} r={F_R} t={t} label={st.world.plateFounder} />
      <LightCone p={F} t={t} seed={1} color="#FFD9A8" r={3.0} o={0.06} />
      <Laptop p={LAPTOP} yaw={Math.PI / 2 - 0.25} screen={st.laptop} s={0.95} />
      <Monitor t={t} screen={dyn.screen} on={screenOn} />
      <KasseBoard t={t} tex={dyn.kasse} />
      <StepBar3D t={t} tex={dyn.steps} />
      <Sticker3D t={t} at={T.heute} until={T.erstens - 0.1} tex={st.heute} w={4.6} h={0.84} p={add(SC, [0, 2.15, 1.3])} rot={-2} seed={1} />
      <Burst p={add(SC, [0, 0.4, 0.6])} t={t} at={T.claude + 0.05} n={20} speed={3} seed={11} colors={[SKC.OR, "#FFFFFF", SKC.GOLD]} />
      <Sticker3D t={t} at={T.an} until={T.zweitens - 0.15} tex={st.research} w={3.4} h={0.69} p={add(SC, [0.2, -1.9, 1.2])} rot={-2} seed={2} from={mw(0)} />
      <Sticker3D t={t} at={T.keinL} until={T.drittens - 0.1} tex={st.kLager} w={2.35} h={0.62} p={add(SC, [-0.7, -0.85, 1.1])} rot={-3} seed={3} from={mw(1)} />
      <Sticker3D t={t} at={T.keineM} until={T.drittens - 0.1} tex={st.kMasch} w={2.9} h={0.6} p={add(SC, [1.0, -1.45, 1.2])} rot={2} seed={4} from={mw(2)} />
      <Sticker3D t={t} at={T.kleine} until={T.drittens - 0.1} tex={st.kBetr} w={3.2} h={0.66} p={add(SC, [-0.2, -2.05, 1.3])} rot={-1} seed={6} from={mw(3)} />
      <Sticker3D t={t} at={T.immer} until={T.claude2 - 0.1} tex={st.kaufen} w={3.4} h={1.02} p={add(SC, [0, -1.45, 1.3])} rot={-2} seed={7} from={mw(5)} />
      <Sticker3D t={t} at={T.druck + 0.05} until={T.ein2 - 0.1} tex={st.druck} w={2.8} h={0.62} p={add(SC, [-0.85, -0.95, 1.2])} rot={-3} seed={8} from={mw(8)} />
      <Sticker3D t={t} at={T.arbeit + 0.05} until={T.ein2 - 0.1} tex={st.arbeit} w={3.9} h={0.69} p={add(SC, [0.25, -1.75, 1.3])} rot={2} seed={9} from={mw(9)} />
      <Sticker3D t={t} at={T.nirgends + 0.05} until={T.das - 0.1} tex={st.statistik} w={3.3} h={0.64} p={add(SC, [-0.3, -0.9, 1.2])} rot={-2} seed={10} from={mw(10)} />
      <Sticker3D t={t} at={T.nachb} until={T.das - 0.1} tex={st.nachb} w={3.9} h={0.66} p={add(SC, [0.15, -1.75, 1.3])} rot={2} seed={12} from={mw(11)} />
      {/* scoreboard with odometer drums + sources flying in */}
      {sbIn > 0.001 && sbOut < 0.999 && (
        <group position={SB} rotation={[0, 0, Math.sin((t - T.claude2) * 7) * 0.06 * Math.exp(-Math.max(0, t - T.claude2) * 2) + 0.03 * bump(t, T.q300 + 0.1, 0.3) * Math.sin(t * 40)]}>
          <Rope a={[-1.5, 8, -0.1]} b={[-1.5, 0.9, -0.1]} />
          <Rope a={[1.5, 8, -0.1]} b={[1.5, 0.9, -0.1]} />
          <Plate3D w={4.0} h={2.1} d={0.3} r={0.3} body={SKC.CREAM} p={[0, 0, 0]}>
            <Plate3D w={3.6} h={0.5} d={0.08} r={0.18} tex={st.sbHead} p={[0, 0.66, 0.52]} glow={0.6} />
            <mesh position={[0, -0.28, 0.0]}><boxGeometry args={[2.5, 1.18, 0.06]} /><meshStandardMaterial color={SKC.INK} roughness={0.4} /></mesh>
            {[2, 1, 0].map((d, k) => <OdometerDigit key={d} p={[-0.8 + k * 0.8, -0.28, -0.25]} value={odo(d)} tex={st.strip} r={0.62} w={0.68} />)}
            {/* window masks: only one digit row visible */}
            {[[0.2, 0.34], [-0.82, 0.46]].map(([y, hh]) => <mesh key={y} position={[0, y, 0.43]} castShadow><boxGeometry args={[2.62, hh, 0.1]} /><meshStandardMaterial color={SKC.CREAM} roughness={0.4} /></mesh>)}
            {[-1.31, 1.31].map((x) => <mesh key={x} position={[x, -0.28, 0.43]}><boxGeometry args={[0.12, 0.62, 0.1]} /><meshStandardMaterial color={SKC.CREAM} roughness={0.4} /></mesh>)}
            {[-0.4, 0.4].map((x) => <mesh key={x} position={[x, -0.28, 0.43]}><boxGeometry args={[0.07, 0.64, 0.1]} /><meshStandardMaterial color={SKC.INK} roughness={0.4} /></mesh>)}
          </Plate3D>
          <Burst p={[0, 0, 0.4]} t={t} at={T.q300 + 0.42} n={26} speed={3.6} seed={21} />
          <Burst p={[0, 0, 0.4]} t={t} at={T.quellen + 0.02} n={18} speed={3} seed={23} colors={[SKC.GOLD, "#FFFFFF"]} />
        </group>
      )}
      {sbIn > 0.5 && sbOut < 0.5 && Array.from({ length: 12 }).map((_, i) => {
        const a0 = T.prueft - 0.05 + i * 0.075;
        const k = cl((t - a0) / 0.5);
        if (k <= 0 || k >= 1) return null;
        const from: V3 = add(SC, [(rnd(i) - 0.5) * 3.2, 0.6 + rnd(i + 1) * 1.6, 0.3]);
        const to: V3 = add(SB, [(rnd(i + 2) - 0.5) * 1.4, 0, 0.4]);
        const q = lerp3(from, to, ease(k));
        return <Plate3D key={i} w={0.48} h={0.48} d={0.06} r={0.12} tex={st.src[i % st.src.length]} p={[q[0], q[1] + Math.sin(k * Math.PI) * 0.9, q[2] + Math.sin(k * Math.PI) * 0.8]} rot={[k * 3, k * 4 + i, 0.3]} s={1 - 0.6 * k} glow={0.6} shadow={false} />;
      })}
      <group>
        <Agent p={fo.p} yaw={fo.yaw + fo.spin} t={t} s={0.8} reach={fo.reach} lean={fo.lean} armL={fo.armL} armR={fo.armR} talk={fo.talk} squash={fo.squash} sway={fo.sway} />
      </group>
      {/* TAG 2 tag */}
      <group position={TG}>
        {(() => {
          const v = back((t - T.das - 0.05) / 0.45) * (1 - ease((t - T.komm - 0.1) / 0.35));
          if (v <= 0.001) return null;
          const sw = Math.sin((t - T.das) * 4.5) * 0.25 * Math.exp(-Math.max(0, t - T.das) * 1.2) + 0.04 * Math.sin(t * 2);
          return (
            <group rotation={[0, 0, sw]} position={[0, (1 - v) * 3, 0]}>
              <Rope a={[0, 6, 0]} b={[0, 0.1, 0]} />
              <Plate3D w={2.2} h={1.92} d={0.14} r={0.3} tex={dyn.tag2} p={[0, -1.0, 0]} rot={[0, Math.sin(t * 1.7) * 0.3, 0]} glow={0.6} />
            </group>
          );
        })()}
        <Burst p={[0, -1, 0.3]} t={t} at={T.morgen} n={18} speed={2.8} seed={31} colors={[SKC.GOLD, "#FFFFFF", SKC.OR]} />
      </group>

      {/* ---------- partner island ---------- */}
      <Island p={P} r={P_R} t={t} side={SKC.BLUE} rim="#BFE3FF" label={st.world.platePartner} glow={partnerOn * (0.75 + 0.25 * Math.sin(t * 5))} glowCol="#7FD6FF" />
      {partnerOn > 0.01 && <LightCone p={P} t={t} seed={3} color="#9DD8FF" r={2.8} o={0.12 * partnerOn} />}
      {partnerOn > 0.01 && <pointLight position={add(P, [0, 3.5, 1.5])} intensity={12 * partnerOn} distance={9} color="#9DD8FF" />}
      <PrintMachine p={P_M} t={t} s={0.66} yaw={-0.25} tint="#F2F5FA" accent="#1C2440" running={running} />
      {drop > 0.001 && <TShirt p={add(P_M, [0.1, 2.1 - 1.5 * ease(drop) + (drop >= 1 ? 0.08 * Math.max(0, Math.sin((t - T.einem - 0.2) * 14)) * Math.exp(-(t - T.einem - 0.2) * 5) : 0), 1.6])} s={0.85} rot={[0, 0.3 + drop * 0.6, 0]} logo={st.world.shirtLogo} />}
      <Burst p={add(P_M, [0.1, 0.7, 1.6])} t={t} at={T.einem + 0.22} n={16} speed={2.6} seed={41} colors={["#FFFFFF", "#9DD8FF", SKC.BLUE]} />
      <Agent p={add(P, [-1.6, TOP, 0.8])} yaw={0.4 + 0.2 * Math.sin(t * 2)} t={t} s={0.6} seed={7} pal={PARTNER} armL={partnerOn > 0.5 ? 140 + 20 * Math.sin(t * 8) : 15} armR={partnerOn > 0.5 ? 40 + 30 * Math.sin(t * 6) : 15} glow={0.6 * partnerOn} squash={0.05 * Math.sin(t * 3) + hop(t, T.einem + 0.25, 0.3).sq} sway={0.15 * Math.sin(t * 3.4)} />
      <Conveyor a={add(P, [-0.2, 0, P_R + 0.3])} b={[16.5, 0, 2.5]} t={t} n={4} speed={1.2} parcels={0} />
      <Sticker3D t={t} at={T.partner} until={T.die - 0.05} tex={st.partner} w={4.3} h={0.9} p={add(P, [0, 5.0, 0.4])} rot={-2} seed={13} />
      <Sticker3D t={t} at={T.einem} until={T.die - 0.05} tex={st.ab1} w={2.0} h={1.1} p={add(P, [2.3, 2.7, 1.4])} rot={4} seed={14} />
      <Motes t={t} center={add(P, [0, 3, 0])} size={[7, 6, 6]} n={30} seed={4} color="#CFEAFF" />

      {/* ---------- end card in the world ---------- */}
      <EndCard3D t={t} st={st} dyn={dyn} />
    </>
  );
};

const EndCard3D: React.FC<{ t: number; st: Static; dyn: Record<string, THREE.Texture> }> = ({ t, st, dyn }) => {
  const k = back((t - T.komm) / 0.45);
  if (k <= 0.001) return null;
  const z = MON[2] + 1.6;
  const x = MON[0];
  const kw = back((t - T.komm - 0.12) / 0.45);
  const fld = back((t - T.komm - 0.25) / 0.45);
  const gd = back((t - T.schick) / 0.4);
  const fly = ease((t - T.guide) / 0.5);
  const landed = t > T.guide + 0.5;
  const fl = (s: number) => 0.05 * Math.sin(t * 1.8 + s);
  const kH = 4.4 / st.komm.aspect;
  return (
    <group>
      <group position={[x, 6.45 + fl(0), z]} scale={Math.max(0.001, k)}>
        <ExtrudedText face={st.komm.face} side={st.komm.side} w={4.4} h={kH} depth={0.3} />
      </group>
      <Plate3D w={4.3} h={1.3} d={0.24} r={0.36} tex={dyn.kw} p={[x, 5.25 + fl(1), z + 0.1]} rot={[0, Math.sin(t * 1.1) * 0.05, -0.05 + Math.sin((t - T.komm) * 10) * 0.12 * Math.exp(-Math.max(0, t - T.komm) * 3)]} s={Math.max(0.001, kw)} glow={0.6} />
      <Plate3D w={4.7} h={0.78} d={0.14} r={0.39} tex={dyn.comment} p={[x, 4.0 + fl(2), z + 0.05]} s={Math.max(0.001, fld)} glow={0.6} />
      <Burst p={[x + 2.0, 4.0, z + 0.3]} t={t} at={T.und + 0.02} n={18} speed={2.8} seed={51} colors={[SKC.GREEN, "#FFFFFF", SKC.GOLD]} />
      {gd > 0.001 && <Plate3D w={3.6} h={0.64} d={0.14} r={0.2} tex={st.guide} p={[x - 0.35, 3.0 + fl(3), z + 0.1]} rot={[0, 0, 0.02]} s={gd} glow={0.6} />}
      {gd > 0.001 && <Plate3D w={1.35} h={0.76} d={0.16} r={0.3} tex={st.dm} p={[x + 1.75, 2.15 + fl(4), z + 0.15]} rot={[0, -0.15, 0.04]} s={gd * (1 + 0.15 * bump(t, T.guide + 0.55, 0.2))} glow={0.6} />}
      {gd > 0.001 && !landed && (
        <Plate3D w={0.62} h={0.78} d={0.06} r={0.1} tex={st.pdf} p={[x - 2.2 + fly * 3.95, 2.0 + Math.sin(fly * Math.PI) * 0.6, z + 0.9 + Math.sin(fly * Math.PI) * 0.9]} rot={[0, fly * Math.PI * 2, -0.15 + fly * 0.4]} s={gd * (1 - 0.45 * fly)} glow={0.6} />
      )}
      <Burst p={[x + 1.75, 2.15, z + 0.4]} t={t} at={T.guide + 0.5} n={22} speed={3} seed={61} colors={[SKC.BLUE, "#FFFFFF", SKC.GREEN]} />
    </group>
  );
};

// ======================================================================================================
// composition
// ======================================================================================================
export const FirmaShirtsTag1V2: React.FC<FirmaShirtsTag1V2Props> = ({ keyword = "Produkt", cover = false }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ready = useFontsReady(["900 70px Rubik", "800 40px Rubik", `600 40px ${SERIF}`, `800 40px ${pixelFont}`]);
  const imgs: Imgs = {
    logo: useImage(staticFile("logos/claude.svg")),
    s1: useImage(staticFile("firma-neu-tag1/shots/s1-plus-research.png")), s2: useImage(staticFile("firma-neu-tag1/shots/s2-prompt.png")),
    s3: useImage(staticFile("firma-neu-tag1/shots/s3-research-laeuft.png")), s4: useImage(staticFile("firma-neu-tag1/shots/s4-research-complete.png")),
    s5: useImage(staticFile("firma-neu-tag1/shots/s5-ergebnis.png")), s6: useImage(staticFile("firma-neu-tag1/shots/s6-keine-statistik.png")),
  };
  const st = useStatic(ready, imgs.logo);
  // dynamic textures
  const cs = CARDS.map((_, i) => cardState(t, i));
  const card0 = useDyn(620, 360, (c) => ready && drawCardFace(c, 620, 360, CARDS[0], cs[0]));
  const card1 = useDyn(620, 360, (c) => ready && drawCardFace(c, 620, 360, CARDS[1], cs[1]));
  const card2 = useDyn(620, 360, (c) => ready && drawCardFace(c, 620, 360, CARDS[2], cs[2]));
  const card3 = useDyn(620, 360, (c) => ready && drawCardFace(c, 620, 360, CARDS[3], cs[3]));
  const card4 = useDyn(620, 360, (c) => ready && drawCardFace(c, 620, 360, CARDS[4], cs[4]));
  const card5 = useDyn(620, 360, (c) => ready && drawCardFace(c, 620, 360, CARDS[5], cs[5]));
  const screen = useDyn(TEX_W, TEX_H, (c) => ready && drawScreen(c, t, imgs));
  const steps = useDyn(1300, 260, (c) => ready && drawSteps(c, 1300, 260, t));
  const kasse = useDyn(700, 570, (c) => ready && drawKasse(c, 700, 570, t));
  const comment = useDyn(1400, 232, (c) => ready && drawComment(c, 1400, 232, t, keyword));
  const kwTex = useDyn(1300, 392, (c) => ready && drawFace(c, 1300, 392, { bg: SKC.OR, fg: "#FFFFFF", text: keyword.toUpperCase(), size: 230, stroke: SKC.INK }));
  const tag2 = useDyn(700, 610, (c) => ready && drawTag(c, 700, 610, "TAG 2", "NACHBESTELLUNG?", "#FFFFFF"));
  const dyn = { card0, card1, card2, card3, card4, card5, screen, steps, kasse, comment, kw: kwTex, tag2 };
  [screen].forEach((x) => { x.anisotropy = 16; x.minFilter = THREE.LinearMipmapLinearFilter; x.generateMipmaps = true; });

  const cam = camAt(t);
  const a = camAt(t - 1 / 120), b = camAt(t + 1 / 120);
  const mv = motionVec(a, b, W / H);
  const mbScale = 1.5;
  const mb: [number, number] = [Math.max(-0.07, Math.min(0.07, mv.mb[0] * mbScale)), Math.max(-0.07, Math.min(0.07, mv.mb[1] * mbScale))];
  const flash = 0.1 * bump(t, T.shirts + 0.03, 0.12) + 0.08 * bump(t, T.tag + 0.02, 0.1);
  const fx = {
    focus: cover ? 18 : cam.dist, aperture: cam.ap, maxBlur: 12, mb: cover ? [0, 0] as [number, number] : mb, zoom: cover ? 0 : Math.max(-0.06, Math.min(0.06, mv.zoom * mbScale)),
    bloom: 0.2 + 0.3 * bump(t, T.shirts + 0.2, 0.5) + 0.15 * bump(t, T.claude + 0.1, 0.4), bloomRadius: 0.55, bloomThreshold: 0.92,
    chroma: 0.0035 + 0.01 * Math.hypot(mb[0], mb[1]), grain: 0.022, vignette: 0.36, t,
  };
  return (
    <AbsoluteFill style={{ background: SKC.BG }}>
      {st && (
        <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
          <World t={t} st={st} dyn={dyn} cam={cam} fx={fx} cover={cover} />
        </ThreeCanvas>
      )}
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash, pointerEvents: "none" }} />
      {!cover && <PillCaptions words={CAPTIONS} theme={THEMES.gym} y={1665} />}
    </AbsoluteFill>
  );
};
