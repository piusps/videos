// "KI gründet eine Firma, ganz alleine" · Tag 1 · v3 (2026-10-27, firma-design)
// Pius zu v2: Kamerafahrten zu doll, fahren aus der Szene, Claude-Monitor nie voll sichtbar; erste Frames unklar (weiße Karten).
// v3 = Split wie das Trainer-Reel: oben ein fest stehendes Claude-Fenster im zerknitterten Papier-Look mit echtem Klickpfad
// (immer komplett lesbar), unten die 3D-Holzwelt mit Agent, echten Produkt-Karten, Zähler-Objekt und Partner.
// Kamera driftet nur sanft. Ton, Stimme, words.json, Untertitel und Timing = v1/v2.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, THEMES, Word, pixelFont } from "../components/PixelKit";
import {
  SKC, SERIF, V3, cl, ease, inOut, back, bump, lerp3, add, rnd, fitFont, font,
  makeWorldTex, useDyn, useImage, drawIcon, drawTag, Island, Agent, PARTNER, PrintMachine, Laptop, LightCone,
  ShirtRoom, TShirt, IdeaCard,
} from "../components/ShirtWorld3D";
import {
  PostFX, EnvLight, CameraRig2, CamKey, makeCamPath, orbitPos, Plate3D, Sticker3D, Burst,
  textTex, faceTex, drawFace, Rope, OdometerDigit, digitStripTex, Motes, roundRectGeo,
} from "../components/FirmaFX3D";
import { ClickPath, Click, INK, CLAUDE_ORANGE, claudeSerif } from "../components/ClaudeUI";
import {
  CrumpledPaper, WindowBar, StepChipBar, PlusMenu, InputCard, MarkedText, typedAt, UserBubble, ResearchCard, Slide,
  menuRowY, inputPlus, inputSend, MENU_ROW, MENU_SEP, MENU_PAD, PLUS_MENU, LineIcon,
} from "../components/ClaudePaperChat";
import wordsRaw from "../../public/firma-neu-tag1/words.json";

const W = 1080, H = 1920;
const DAY = 1;
export type FirmaShirtsTag1V3Props = { keyword?: string; cover?: boolean };
export const FIRMA_SHIRTS_TAG1_V3_SECONDS = 36.3;

// ---------- word anchors (identical to v1/v2) ----------
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
  nur: at("Nur", 28.2), nirgends: at("nirgends", 29.1), wie: at("wie", 29.6), nachb: at("nachbestellen", 30.3), das: at("Das", 31.2), morgen: at("morgen", 31.5),
  komm: at("Kommentiere", 32.0), kw: at("Produkt", 32.8), und: at("und", 33.5), schick: at("schick", 34.3), guide: at("Guide", 34.8),
};
const SEND = T.kaufen + 0.25;

// ======================================================================================================
// texts from the real run (design/lauf-tag1, LAUF.md) - verbatim
// ======================================================================================================
const PROMPT =
  "Ich will in Deutschland eine kleine Firma gründen, die ich komplett vom Schreibtisch aus führe. Meine Regeln: kein eigenes Lager, keine eigene Maschine, ein Partner stellt her und verschickt, und meine Kunden sind kleine Betriebe mit weniger als zehn Leuten, zum Beispiel Handwerker, Friseure, Bäckereien. Recherchiere: Welche zehn Produkte oder Leistungen kaufen solche Betriebe immer wieder, und welche davon könnte ich nach diesen Regeln verkaufen? Nenne zu jeder Idee kurz, warum, und die Quelle. Erfinde nichts. Wo du keine Quelle findest, schreib „unklar“.";
const INTRO = "Ich recherchiere jetzt, welche Produkte und Leistungen Kleinbetriebe wie Handwerker, Friseure und Bäckereien regelmäßig nachkaufen und welche davon sich ohne eigenes Lager über einen Herstellungs- und Versandpartner verkaufen lassen.";
const R_TITLE = "Wiederkehrender Bedarf bei Kleinstbetrieben";
const REPORT_TITLE = "Schreibtisch-Firma für Kleinstbetriebe: Zehn wiederkehrende Bedarfe im Regel-Check";
const REPORT_P = "Am besten passen zu Ihren Regeln Drucksachen über ein Druckerei-Reseller-Programm und Arbeitskleidung mit Logo über Print-on-Demand-Veredler. Für beide gibt es deutsche bzw. EU-Partner, die nachweislich neutral direkt an Ihre Kunden versenden.";
const ROW2 = "Printful stickt in Barcelona und Riga ohne Mindestmenge, auch Polos, und versendet ohne eigenes Branding";
const ANSWER = "Ich habe zehn wiederkehrende Bedarfe von Kleinstbetrieben gegen Ihre Regeln geprüft. Am besten passen Drucksachen über Druckerei-Reseller-Programme wie SAXOPRINT oder FLYERALARM PRO und Logo-Arbeitskleidung über Printful oder Shirtee Cloud. Für beide gibt es Partner, die nachweislich neutral direkt an Ihre Kunden versenden. Wie oft Kleinstbetriebe diese Produkte nachbestellen, habe ich allerdings in keiner Statistik gefunden.";

// prompt typing: each keyword is fully typed just before the voice says it
const pEnd = (s: string) => PROMPT.indexOf(s) + s.length;
const PROMPT_KEYS: [number, number][] = [
  [T.schreib - 0.25, 0],
  [T.keinL - 0.12, pEnd("kein eigenes Lager")],
  [T.keineM - 0.12, pEnd("keine eigene Maschine")],
  [T.kleine - 0.12, pEnd("kleine Betriebe mit weniger als zehn Leuten")],
  [T.frag - 0.12, pEnd("Recherchiere:")],
  [T.immer - 0.12, pEnd("immer wieder")],
  [SEND - 0.18, PROMPT.length],
];

// line index of every char for the prompt font (canvas wrap = same metrics as the DOM text)
const PROMPT_FS = 42, PROMPT_LH = 1.3, PROMPT_W = 936;
let lineOf: number[] | null = null;
const promptLineOf = () => {
  if (lineOf) return lineOf;
  const c = document.createElement("canvas").getContext("2d")!;
  c.font = `600 ${PROMPT_FS}px ${pixelFont}`;
  const out: number[] = [];
  let line = 0, cur = "";
  PROMPT.split(/(\s+)/).forEach((tok) => {
    if (cur && /\S/.test(tok) && c.measureText(cur + tok).width > PROMPT_W) { line++; cur = ""; }
    cur += tok;
    for (let i = 0; i < tok.length; i++) out.push(line);
  });
  lineOf = out;
  return out;
};

// ======================================================================================================
// window geometry (frame px; the paper window covers 0..PANEL and never moves)
// ======================================================================================================
const PANEL = 944;
const MENU_H = MENU_PAD * 2 + PLUS_MENU.filter((x) => x !== "sep").length * MENU_ROW + PLUS_MENU.filter((x) => x === "sep").length * MENU_SEP;
const A_TOP = 700, A_BOT = 912; // input card in the empty chat
const MENU_TOP = A_TOP - 16 - MENU_H;
const B_TOP = 166, B_BOT = 918; // card grown for the long prompt
const C_TOP = 800, C_BOT = 918; // slim reply card
const HOOK_TOP = 612, HOOK_BOT = 872;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const inputGeom = (t: number) => {
  let top = HOOK_TOP, bot = HOOK_BOT;
  const k1 = inOut((t - (T.heute - 0.1)) / 0.45);
  top = lerp(top, A_TOP, k1); bot = lerp(bot, A_BOT, k1);
  const k2 = inOut((t - (T.zweitens - 0.1)) / 0.45);
  top = lerp(top, B_TOP, k2); bot = lerp(bot, B_BOT, k2);
  const k3 = inOut((t - (SEND + 0.08)) / 0.4);
  top = lerp(top, C_TOP, k3); bot = lerp(bot, C_BOT, k3);
  return { top, bot };
};
const plusHit = inputPlus(A_BOT);
const sendHit = inputSend(B_BOT);
const researchY = menuRowY("Research", MENU_TOP);
const CLICKS: Click[] = [
  { t: T.plus, n: 1, x: plusHit.x, y: plusHit.y, mx: plusHit.x + 44, my: plusHit.y - 31, until: T.research + 0.08 },
  { t: T.research + 0.08, n: 2, x: 250, y: researchY, mx: 520, my: researchY - 31, until: T.an + 0.35 },
  { t: T.an + 0.7, n: 9, x: 760, y: 1180, mx: 0, my: 0, until: 0 }, // park the cursor on the stage (no badge)
  { t: SEND, n: 3, x: sendHit.x, y: sendHit.y, mx: sendHit.x - 120, my: sendHit.y - 128, until: T.claude2 + 0.35 },
];
const cursorVis = (t: number) =>
  Math.max(cl((t - T.erstens) / 0.2) * (1 - cl((t - T.an - 0.45) / 0.2)), cl((t - (T.kaufen - 0.75)) / 0.2) * (1 - cl((t - T.claude2 - 0.4) / 0.2)));

// ======================================================================================================
// stage (3D) layout
// ======================================================================================================
const TOP = 0.5;
const BX = 1.5, BZ = -3.8, BD = 0.3;
const BFRONT = BZ + BD / 2 + 0.05;
const CARD_W = 2.3, CARD_H = 1.34, CARD_D = 0.1;
const CARDS: IdeaCard[] = [
  { label: "KAFFEE", icon: "coffee" }, { label: "HUNDE-\nKEKSE", icon: "bone" }, { label: "DRUCK-\nSACHEN", icon: "flyer" },
  { label: "FIRMEN-\nSHIRTS", icon: "shirt" }, { label: "WEBSITES", icon: "web" }, { label: "KERZEN", icon: "candle" },
];
const KEEP = 3, DRUCK = 2;
const slot = (i: number): V3 => [BX + ((i % 3) - 1) * 2.55, [4.72, 3.14][Math.floor(i / 3)], BFRONT + CARD_D / 2 + 0.06];
const BOARD_Y0 = 2.22, BOARD_Y1 = 5.64;
const SCAN = [0, 1, 2, 5, 4, 3];
const SCAN_STEP = 0.62;
const STRIKE_ORDER = [0, 5, 1, 4, 2];
const strikeAt = (i: number) => T.nimmt - 0.2 + STRIKE_ORDER.indexOf(i) * ((26.95 - (T.nimmt - 0.2)) / STRIKE_ORDER.length);

const F: V3 = [-2.7, 0, 0.5];
const F_R = 1.9;
const AG: V3 = add(F, [-0.3, TOP, -0.2]); // agent at the desk
const AG_YAW = 0.85; // facing the laptop (front right)
const LAPTOP: V3 = add(AG, [Math.sin(AG_YAW) * 1.0, 0, Math.cos(AG_YAW) * 1.0]);
const KASSE: V3 = add(F, [0.75, TOP, -1.2]);
const PS: V3 = [-1.9, 4.9, 0.4];
const SBP: V3 = [0.4, 4.3, 0.7]; // scoreboard: centre front // prop slot above the agent
const P_HOME: V3 = [3.3, 0, 1.3];
const P_R = 1.6;
const FT: V3 = [0.7, 3.3, 1.6]; // keeper card flies here
const KEEP_HOME: V3 = [BX, 3.95, BFRONT + 0.35];
const TG: V3 = [3.9, 6.0, -2.0];

// ---------- camera: gentle drift/push only, always framing board + desk ----------
const L0: V3 = [0.4, 2.45, -1.2];
const KEYS: CamKey[] = [
  { t: 0, p: L0, yaw: -0.13, pitch: 0.22, dist: 16.6, fov: 38, ap: 0.25 },
  { t: 3.2, p: add(L0, [0.2, 0.05, 0]), yaw: -0.06, pitch: 0.22, dist: 16.0, fov: 38, ap: 0.25 },
  { t: 6.6, p: add(L0, [0.1, 0, 0]), yaw: 0.0, pitch: 0.22, dist: 15.6, fov: 38, ap: 0.25 },
  { t: 11.0, p: add(L0, [-0.6, -0.1, 0.4]), yaw: 0.06, pitch: 0.22, dist: 15.0, fov: 38, ap: 0.3 },
  { t: 16.0, p: add(L0, [-0.7, -0.05, 0.4]), yaw: 0.1, pitch: 0.22, dist: 14.8, fov: 38, ap: 0.3 },
  { t: 19.4, p: add(L0, [-0.5, 0.1, 0.3]), yaw: 0.05, pitch: 0.22, dist: 15.0, fov: 38, ap: 0.3 },
  { t: 21.2, p: add(L0, [0, 0.05, 0]), yaw: -0.02, pitch: 0.22, dist: 15.4, fov: 38, ap: 0.3 },
  { t: 24.0, p: add(L0, [0.6, 0, 0.3]), yaw: -0.08, pitch: 0.22, dist: 15.4, fov: 38, ap: 0.3 },
  { t: 26.2, p: add(L0, [0.3, 0.1, 0]), yaw: -0.03, pitch: 0.22, dist: 15.6, fov: 38, ap: 0.3 },
  { t: 28.0, p: add(L0, [0.2, 0.1, 0.4]), yaw: 0.02, pitch: 0.22, dist: 14.6, fov: 38, ap: 0.3 },
  { t: 32.0, p: add(L0, [-0.2, 0.05, 0.2]), yaw: 0.06, pitch: 0.22, dist: 15.0, fov: 38, ap: 0.3 },
  { t: 36.4, p: add(L0, [-0.1, 0.05, 0.3]), yaw: 0.12, pitch: 0.22, dist: 14.4, fov: 38, ap: 0.3 },
];
const PATH = makeCamPath(KEYS);
type Cam = { pos: V3; look: V3; fov: number; ap: number; dist: number };
const camAt = (t: number): Cam => {
  const v = PATH(t);
  const o = orbitPos([v[0], v[1], v[2], v[3] + 0.006 * Math.sin(t * 0.7), v[4] + 0.004 * Math.sin(t * 0.53 + 1), v[5]]);
  return { pos: o.pos, look: o.look, fov: v[6], ap: v[7], dist: v[5] };
};

// ======================================================================================================
// cards
// ======================================================================================================
type CardS = { spot: number; shake: number; hl: number; hlCol: string; cross: number; fall: number; fly: number; keep: number; home: number };
const cardState = (t: number, i: number): CardS => {
  let spot = 0;
  if (t < T.heute + 0.3) {
    const fade = 1 - cl((t - T.heute) / 0.3);
    for (let k = 0; k < 12; k++) if (SCAN[k % 6] === i) spot = Math.max(spot, bump(t, k * SCAN_STEP, SCAN_STEP * 1.1) * fade);
  }
  const shake = bump(t, T.kein + 0.25, 0.45);
  let hl = 0, hlCol = SKC.GOLD;
  if (i === DRUCK) { hl = ease((t - T.druck) / 0.3); hlCol = "#F2C230"; }
  if (i === KEEP) { hl = ease((t - T.arbeit) / 0.3); hlCol = SKC.OR; }
  if (i === KEEP) {
    return { spot, shake, hl, hlCol, cross: 0, fall: 0, fly: cl((t - T.shirts - 0.1) / 0.55), keep: back((t - T.shirts) / 0.35), home: inOut((t - T.nur - 0.1) / 0.7) };
  }
  const sa = strikeAt(i);
  return { spot, shake, hl: hl * (1 - cl((t - sa) / 0.2)), hlCol, cross: cl((t - sa) / 0.18), fall: Math.max(0, t - sa - 0.25), fly: 0, keep: 0, home: 0 };
};
const drawCardFace = (c: CanvasRenderingContext2D, w: number, h: number, card: IdeaCard, s: CardS) => {
  c.clearRect(0, 0, w, h);
  const r = 46;
  c.fillStyle = s.hl > 0.01 ? s.hlCol : SKC.INK; roundRect(c, 0, 0, w, h, r); c.fill();
  if (s.hl > 0.01) { c.fillStyle = SKC.INK; roundRect(c, 14 * s.hl, 14 * s.hl, w - 28 * s.hl, h - 28 * s.hl, r - 8); c.fill(); }
  const inset = 12 + 14 * s.hl;
  c.fillStyle = s.keep > 0.01 ? "#FFF1E6" : SKC.CREAM; roundRect(c, inset, inset, w - 2 * inset, h - 2 * inset, r - 10); c.fill();
  c.fillStyle = "rgba(255,255,255,.55)"; roundRect(c, inset + 14, inset + 10, w - 2 * inset - 28, h * 0.2, 22); c.fill();
  c.save(); c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(92, h / 2, 64, 0, 7); c.fill(); c.lineWidth = 7; c.strokeStyle = SKC.INK; c.stroke(); c.restore();
  drawIcon(c, card.icon, 92, h / 2 + 2, 96);
  const lines = card.label.split("\n");
  c.fillStyle = SKC.INK; c.textAlign = "center"; c.textBaseline = "middle";
  const fs = lines.length > 1 ? 108 : 112;
  lines.forEach((ln, k) => {
    const f = fitFont(c, ln, fs, w - 220);
    const y = lines.length > 1 ? h / 2 + 6 + (k - 0.5) * f * 0.98 : h / 2 + 6;
    c.fillText(ln, w / 2 + 70, y);
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
    c.save(); c.translate(w - 70, 70); c.scale(s.keep, s.keep);
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(0, 0, 54, 0, 7); c.fill(); c.fillStyle = SKC.INK; c.beginPath(); c.arc(0, 0, 46, 0, 7); c.fill(); c.fillStyle = "#2FBF71"; c.beginPath(); c.arc(0, 0, 38, 0, 7); c.fill();
    c.strokeStyle = "#FFFFFF"; c.lineWidth = 11; c.lineCap = "round"; c.beginPath(); c.moveTo(-17, 0); c.lineTo(-5, 13); c.lineTo(18, -12); c.stroke();
    c.restore();
  }
};
const G = 24;
const cardPose = (t: number, i: number, s: CardS): { p: V3; rot: V3; scale: number } => {
  const base = slot(i);
  const sh = s.shake * Math.sin(t * 38 + i * 1.7);
  let p: V3 = [base[0], base[1], base[2] + 0.22 * s.spot + 0.25 * s.hl];
  let rot: V3 = [-0.05 * s.spot, 0.04 * Math.sin(t * 1.3 + i), (rnd(i + 11) - 0.5) * 0.06 + 0.012 * Math.sin(t * 1.9 + i * 2) + 0.12 * sh];
  if (s.fall > 0) {
    const tip = ease(s.fall / 0.16);
    const ax = 1.0 * tip;
    const cy = base[1] - CARD_H / 2 + Math.cos(ax) * CARD_H / 2, cz = base[2] + Math.sin(ax) * CARD_H / 2;
    p = [base[0], cy, cz];
    rot = [ax, 0, rot[2]];
    if (s.fall > 0.16) {
      const tau = s.fall - 0.16;
      const vx = (rnd(i + 3) - 0.5) * 2.0, vy = 1.3, vz = 2.0;
      const floorY = 0.08;
      const disc = vy * vy + 2 * G * (cy - floorY);
      const tl = (vy + Math.sqrt(disc)) / G;
      const rz0 = rot[2];
      if (tau >= tl) {
        const after = tau - tl;
        const y = floorY + Math.max(0, 0.3 * Math.sin(Math.min(Math.PI, after * 9)) * Math.exp(-after * 6));
        const rxl = ax + 7.5 * tl;
        const rx = Math.PI / 2 + Math.round((rxl - Math.PI / 2) / Math.PI) * Math.PI;
        return { p: [base[0] + vx * tl + vx * 0.12 * ease(after / 0.3), y, cz + vz * tl + vz * 0.12 * ease(after / 0.3)], rot: [rx, 0, rz0 + (rnd(i + 5) - 0.5) * 5 * tl], scale: 1 };
      }
      return { p: [base[0] + vx * tau, cy + vy * tau - 0.5 * G * tau * tau, cz + vz * tau], rot: [ax + 7.5 * tau, 0, rz0 + (rnd(i + 5) - 0.5) * 5 * tau], scale: 1 };
    }
    return { p, rot, scale: 1 };
  }
  if (s.fly > 0) {
    const k = inOut(s.fly);
    const q = lerp3(p, FT, k);
    p = [q[0], q[1] + Math.sin(k * Math.PI) * 1.0, q[2]];
    rot = [0.12 * Math.sin(k * Math.PI), Math.PI * 2 * ease(s.fly), rot[2] * (1 - k)];
    let sc = 1 + 0.55 * k;
    if (s.home > 0) {
      const q2 = lerp3(FT, KEEP_HOME, s.home);
      p = [q2[0], q2[1] + Math.sin(s.home * Math.PI) * 0.5, q2[2]];
      sc = lerp(1.55, 1.35, s.home);
      rot = [0, 0.03 * Math.sin(t * 1.4), 0.02 * Math.sin(t * 1.1)];
    } else rot = [rot[0] + 0.04 * Math.sin(t * 2.2) * k, rot[1] + 0.08 * Math.sin(t * 1.6) * k, rot[2]];
    return { p, rot, scale: sc };
  }
  return { p, rot, scale: 1 };
};

// ======================================================================================================
// founder pose
// ======================================================================================================
type Pose = { p: V3; yaw: number; armL: number; armR: number; reach: number; lean: number; talk: boolean; squash: number; sway: number };
const hop = (t: number, a: number, h = 0.45, d = 0.42) => {
  const u = (t - a) / d;
  if (u < -0.22 || u > 1.3) return { y: 0, sq: 0 };
  if (u < 0) return { y: 0, sq: 0.45 * Math.sin((Math.PI * (u + 0.22)) / 0.22) };
  if (u <= 1) return { y: 4 * h * u * (1 - u), sq: -0.35 * (1 - Math.abs(2 * u - 1)) };
  return { y: 0, sq: 0.55 * Math.sin((Math.PI * (u - 1)) / 0.3) };
};
const TYPING: [number, number][] = [[T.heute + 0.3, T.erstens], [T.unten, T.an], [T.schreib - 0.25, SEND - 0.1]];
const founder = (t: number): Pose => {
  const breathe = 0.06 * Math.sin(t * 2.6);
  const hops = (list: [number, number][]) => list.reduce((a, [s, h]) => { const r = hop(t, s, h); return { y: a.y + r.y, sq: a.sq + r.sq }; }, { y: 0, sq: 0 });
  const hp = hops([
    [T.ki - 0.05, 0.16], [T.tag - 0.1, 0.55], [T.an, 0.2], [T.keinL + 0.05, 0.1], [T.keineM + 0.05, 0.1], [T.kleine + 0.05, 0.12],
    [SEND + 0.05, 0.18], [T.q300 + 0.1, 0.5], [T.druck + 0.05, 0.12], [T.arbeit + 0.05, 0.2], [T.einem + 0.2, 0.18],
    [T.shirts + 0.05, 0.95], [T.das + 0.1, 0.18], [T.und + 0.02, 0.3], [T.guide + 0.4, 0.3],
  ]);
  const base: Pose = { p: [AG[0], AG[1] + hp.y, AG[2]], yaw: AG_YAW, armL: 15, armR: 15, reach: 0, lean: 0, talk: false, squash: breathe + hp.sq, sway: 0.12 * Math.sin(t * 3.1) + hp.sq * 0.6 };
  // hook: points at the scanned cards, shrugs at "kein Produkt"
  if (t < T.heute + 0.3) {
    if (t > T.kein - 0.1) return { ...base, yaw: 0.25, armL: 80, armR: 80, lean: 0.1 * Math.sin(t * 5), talk: false };
    const pointing = t < T.ich;
    return { ...base, yaw: pointing ? 1.15 + 0.15 * Math.sin(t * 1.7) : 0.2 + 0.1 * Math.sin(t * 3), armR: pointing ? 125 + 20 * Math.sin(t * 5) : 150 + 20 * Math.sin(t * 11), armL: t > T.tag - 0.15 && t < T.tag + 0.5 ? 165 : 20, talk: t > T.ich && t < T.tag + 0.4 };
  }
  const typing = TYPING.some(([a, b]) => t > a && t < b);
  if (t < T.ein2 + 0.2) {
    if (t > T.an - 0.05 && t < T.an + 0.6) return { ...base, armR: 160, yaw: 0.2 };
    if (t > T.q300 + 0.05 && t < T.q300 + 0.7) return { ...base, armL: 165, armR: 165, yaw: 0.15 };
    if (typing) return { ...base, reach: 0.55 + 0.12 * Math.sin(t * 18), lean: 0.14, squash: base.squash + 0.04 * Math.sin(t * 18) };
    return { ...base, yaw: t > T.am ? 1.25 + 0.1 * Math.sin(t * 2) : 0.35 + 0.15 * Math.sin(t * 1.3), armR: t > T.druck && t < T.ein2 ? 120 + 15 * Math.sin(t * 6) : 25 };
  }
  if (t < T.die) return { ...base, yaw: 1.55, armR: 140 + 25 * Math.sin(t * 8), armL: 20, talk: true };
  if (t < T.nur + 0.15) {
    const cel = t > T.shirts - 0.05;
    const spin = cel ? Math.PI * 2 * ease((t - T.shirts - 0.05) / 0.45) : 0;
    return { ...base, yaw: cel ? 0.5 + spin : 1.05 + 0.12 * Math.sin(t * 9), armL: cel ? 160 + 15 * Math.sin(t * 12) : 30, armR: cel ? 160 - 15 * Math.sin(t * 12) : 30, talk: cel };
  }
  if (t < T.komm - 0.2) {
    if (t > T.nirgends - 0.05 && t < T.das) return { ...base, yaw: 0.3, armL: 80, armR: 80, lean: -0.08 };
    if (t >= T.das) return { ...base, yaw: 1.2, armR: 150, armL: 20 };
    return { ...base, reach: 0.5 + 0.1 * Math.sin(t * 18), lean: 0.12 };
  }
  return { ...base, yaw: 0.35 + 0.1 * Math.sin(t * 2), armL: 25, armR: 150 + 25 * Math.sin(t * 10), talk: true };
};

// ======================================================================================================
// static & dynamic textures
// ======================================================================================================
const useStatic = (ready: boolean, claude: HTMLImageElement | null) =>
  React.useMemo(() => {
    if (!ready) return null;
    const world = makeWorldTex(DAY);
    const tx = (w: number, h: number, o: Parameters<typeof drawFace>[3]) => faceTex(w, h, o);
    const back = canvasTex(620, 360, (c) => {
      c.fillStyle = SKC.INK; roundRect(c, 0, 0, 620, 360, 46); c.fill();
      c.fillStyle = "#E9E1D2"; roundRect(c, 12, 12, 596, 336, 36); c.fill();
    });
    const cork = canvasTex(1024, 512, (c) => {
      const g = c.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, "#E2BE92"); g.addColorStop(1, "#C99A6B");
      c.fillStyle = g; c.fillRect(0, 0, 1024, 512);
      for (let i = 0; i < 1800; i++) { c.fillStyle = `rgba(110,70,30,${0.06 + rnd(i) * 0.12})`; c.fillRect(rnd(i + 1) * 1024, rnd(i + 2) * 512, 4, 4); }
    });
    const laptop = canvasTex(512, 320, (c) => {
      c.fillStyle = SKC.PAPER; c.fillRect(0, 0, 512, 320);
      if (claude) c.drawImage(claude, 196, 60, 120, 120);
      c.fillStyle = SKC.INK; c.font = `600 44px ${SERIF}`; c.textAlign = "center"; c.fillText("Claude", 256, 240);
    });
    const src = ["globe", "doc", "chart", "globe", "doc", "list"].map((kind, i) => canvasTex(160, 160, (c) => {
      c.fillStyle = SKC.INK; roundRect(c, 0, 0, 160, 160, 34); c.fill(); c.fillStyle = ["#FFFFFF", SKC.CREAM, "#E6F3FF"][i % 3]; roundRect(c, 10, 10, 140, 140, 26); c.fill();
      c.strokeStyle = SKC.INK; c.lineWidth = 8; c.fillStyle = [SKC.BLUE, SKC.OR, SKC.GREEN][i % 3];
      if (kind === "globe") { c.beginPath(); c.arc(80, 80, 42, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.ellipse(80, 80, 18, 42, 0, 0, 7); c.stroke(); c.beginPath(); c.moveTo(38, 80); c.lineTo(122, 80); c.stroke(); }
      else if (kind === "chart") { [40, 70, 100].forEach((x, k) => { c.fillRect(x, 110 - (k + 1) * 22, 20, (k + 1) * 22); c.strokeRect(x, 110 - (k + 1) * 22, 20, (k + 1) * 22); }); }
      else { c.fillStyle = "#FFFFFF"; roundRect(c, 46, 32, 68, 96, 10); c.fill(); c.stroke(); c.fillStyle = "#D8D2C6"; [56, 76, 96].forEach((y) => c.fillRect(58, y, 44, 8)); }
    }));
    return {
      world, back, cork, laptop, src, strip: digitStripTex(),
      header: tx(1100, 200, { bg: "#FFFFFF", text: "WAS VERKAUFT SIE?", size: 104 }),
      research: tx(980, 200, { bg: SKC.GREEN, fg: "#FFFFFF", text: "✓ RESEARCH AN", size: 104 }),
      kLager: tx(760, 200, { bg: "#FFFFFF", text: "KEIN LAGER", size: 100 }),
      kMasch: tx(980, 200, { bg: "#FFFFFF", text: "KEINE MASCHINE", size: 100 }),
      kBetr: tx(1020, 210, { bg: SKC.OR, fg: "#FFFFFF", text: "KLEINE BETRIEBE", size: 104 }),
      kaufen: tx(1100, 330, { bg: SKC.OR, fg: "#FFFFFF", text: "WAS KAUFEN SIE\nIMMER WIEDER?", size: 112 }),
      sbHead: tx(1200, 170, { bg: SKC.INK, fg: "#FFFFFF", text: "QUELLEN", size: 110 }),
      partner: tx(1100, 230, { bg: SKC.BLUE, fg: "#FFFFFF", text: "PARTNER DRUCKT", size: 120 }),
      ab1: tx(760, 420, { bg: "#FFFFFF", sub: "AB", subCol: SKC.BLUE, text: "1 STÜCK", size: 170 }),
      shirts: tx(1300, 260, { bg: SKC.OR, fg: "#FFFFFF", text: "FIRMENSHIRTS", size: 160, stroke: SKC.INK }),
      statistik: tx(1080, 210, { bg: SKC.RED, fg: "#FFFFFF", text: "KEINE STATISTIK", size: 104 }),
      nachb: tx(1240, 210, { bg: "#FFFFFF", text: "WIE OFT NACHBESTELLT?", size: 100 }),
      tag2: canvasTex(700, 610, (c) => drawTag(c, 700, 610, "TAG 2", "NACHBESTELLUNG?", "#FFFFFF")),
      platePartner: world.platePartner,
    };
  }, [ready, claude]);
type Static = NonNullable<ReturnType<typeof useStatic>>;

const drawSteps = (c: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  const starts = [T.erstens, T.zweitens, T.drittens];
  const labels = ["RESEARCH AN", "REGELN", "FRAGE"];
  const cur = starts.reduce((a, s, i) => (t >= s - 0.05 ? i : a), 0);
  const allDone = t > SEND;
  drawFace(c, w, h, { bg: "#FFFFFF" });
  const r = 74, cy = h / 2;
  let x = 60;
  c.textBaseline = "middle"; c.textAlign = "center";
  for (let i = 0; i < 3; i++) {
    const done = i < cur || allDone, act = i === cur && !allDone;
    c.fillStyle = SKC.INK; c.beginPath(); c.arc(x + r, cy, r, 0, 7); c.fill();
    c.fillStyle = done ? SKC.GREEN : act ? SKC.OR : "#FFFFFF"; c.beginPath(); c.arc(x + r, cy, r - 12, 0, 7); c.fill();
    if (done) { c.strokeStyle = "#FFFFFF"; c.lineWidth = 16; c.lineCap = "round"; c.beginPath(); c.moveTo(x + r - 28, cy); c.lineTo(x + r - 8, cy + 22); c.lineTo(x + r + 30, cy - 22); c.stroke(); }
    else { c.fillStyle = act ? "#FFFFFF" : SKC.INK; c.font = font(92); c.fillText(String(i + 1), x + r, cy + 4); }
    x += 2 * r + 18;
    if (act) {
      c.fillStyle = SKC.INK; c.textAlign = "left"; fitFont(c, labels[i], 100, w - x - (2 - i) * (2 * r + 50) - 50); c.fillText(labels[i], x + 6, cy + 4); c.textAlign = "center";
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
  const val = t > T.shirts ? "FIRMENSHIRTS" : "?";
  c.fillStyle = t > T.shirts ? SKC.OR_D : SKC.INK; fitFont(c, val, 150, w - 120); c.fillText(val, w / 2, 500);
};

// ======================================================================================================
// 3D world
// ======================================================================================================
const KasseBoard: React.FC<{ t: number; tex: THREE.Texture }> = ({ t, tex }) => {
  const pop = bump(t, T.kein + 0.3, 0.35) + bump(t, T.shirts + 0.2, 0.35);
  return (
    <group position={KASSE} rotation={[0, 0.45, 0]}>
      <Plate3D w={1.7} h={1.38} d={0.14} r={0.24} tex={tex} p={[0, 0.82 + 0.15 * pop, 0]} rot={[-0.08, 0, 0.04 * Math.sin(t * 1.5)]} s={1 + 0.1 * pop} glow={0.55} />
      <mesh position={[0, 0.04, 0]}><boxGeometry args={[1.9, 0.08, 0.4]} /><meshStandardMaterial color={SKC.INK} /></mesh>
    </group>
  );
};

const World: React.FC<{ t: number; st: Static; dyn: Record<string, THREE.Texture>; cam: Cam; fx: Parameters<typeof PostFX>[0]["fx"] }> = ({ t, st, dyn, cam, fx }) => {
  const fo = founder(t);
  const lightTarget = React.useMemo(() => new THREE.Object3D(), []);
  lightTarget.position.set(cam.look[0], 0, cam.look[2]); lightTarget.updateMatrixWorld();
  const cardsSt = CARDS.map((_, i) => cardState(t, i));
  // spotlight scan in the hook
  const spotT = React.useMemo(() => new THREE.Object3D(), []);
  const scanK = t / SCAN_STEP;
  const ia = SCAN[Math.floor(scanK) % 6], ib = SCAN[(Math.floor(scanK) + 1) % 6];
  const scanOn = 1 - cl((t - T.heute) / 0.4);
  const sp = lerp3(slot(ia), slot(ib), inOut((scanK % 1 - 0.55) / 0.45));
  const sTarget: V3 = scanOn > 0 ? sp : [BX, 3.9, BFRONT];
  spotT.position.set(...sTarget); spotT.updateMatrixWorld();
  // header flips to the step bar during the three steps
  const stepsOn = t > T.erstens - 0.2 && t < SEND + 0.6;
  const flipA = Math.PI * (ease((t - (T.erstens - 0.2)) / 0.4) - ease((t - (SEND + 0.6)) / 0.4));
  const stepBurst = [T.erstens, T.zweitens, T.drittens];
  // partner island slides in
  const pIn = inOut((t - T.ein2 + 0.15) / 0.55), pOut = inOut((t - T.die + 0.1) / 0.5);
  const P: V3 = [P_HOME[0] + (1 - pIn) * 9 + pOut * 9, 0, P_HOME[2]];
  const partnerOn = pIn * (1 - pOut);
  const running = t > T.druckt && t < T.die;
  const drop = cl((t - T.einem + 0.2) / 0.45);
  const P_M: V3 = add(P, [0.2, TOP, -0.35]);
  // scoreboard
  const sbIn = back((t - T.claude2 + 0.15) / 0.5), sbOut = ease((t - T.am + 0.05) / 0.4);
  const qv = t < T.q300 ? 169 * ease((t - T.claude2 + 0.1) / 0.5) : 169 + 145 * ease((t - T.q300) / 0.45);
  const odo = (i: number) => { const p = Math.pow(10, i); const fl = Math.floor(qv / p) % 10; return fl + (i === 0 ? qv - Math.floor(qv) : cl((qv % p) - (p - 1))); };
  const SB: V3 = add(SBP, [0, (1 - sbIn) * 5 + sbOut * 6, 0]);
  const keepGlow = cl((t - T.shirts) / 0.3);
  const ctaK = ease((t - T.komm) / 0.6);
  return (
    <>
      <CameraRig2 pos={cam.pos} look={cam.look} fov={cam.fov} />
      <PostFX fx={fx} />
      <EnvLight intensity={0.32} />
      <color attach="background" args={[SKC.BG]} />
      <fog attach="fog" args={["#D9B98F", 30, 70]} />
      <ambientLight intensity={0.44 - 0.06 * ctaK} color="#FFF0DC" />
      <hemisphereLight args={["#FFF4E2", "#7A4A2A", 0.55]} />
      <primitive object={lightTarget} />
      <primitive object={spotT} />
      <directionalLight position={[cam.look[0] + 7, 18, cam.look[2] + 10]} target={lightTarget} intensity={1.7} color="#FFE6C4" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} shadow-camera-far={80} shadow-bias={-0.0015} shadow-normalBias={0.04} />
      <directionalLight position={[cam.look[0] - 8, 10, cam.look[2] - 14]} target={lightTarget} intensity={1.0} color="#CFE6FF" />
      <spotLight position={[sTarget[0] + 2, 12, BFRONT + 8]} target={spotT} angle={scanOn > 0.5 ? 0.17 : 0.45} penumbra={0.7} intensity={18 + 22 * scanOn} distance={30} decay={1.5} color="#FFD9A0" />
      {keepGlow > 0.01 && <pointLight position={add(FT, [0, 0.4, 1.8])} intensity={14 * keepGlow * (1 + 0.3 * Math.sin(t * 8))} distance={8} color="#FFB48A" />}

      <ShirtRoom t={t} tex={st.world} sign={false} />
      <Motes t={t} center={[0, 4.5, -1]} size={[11, 7, 6]} n={50} seed={1} />
      <LightCone p={[BX, 0, BZ + 1.5]} t={t} seed={2} color="#FFE2B0" r={4.0} o={0.04 + 0.05 * scanOn} />

      {/* ---------- idea board ---------- */}
      <group position={[BX, 0, BZ]}>
        <mesh geometry={roundRectGeo(8.1, BOARD_Y1 - BOARD_Y0, 0.36, BD, 0.08)} position={[0, (BOARD_Y0 + BOARD_Y1) / 2, 0]} castShadow receiveShadow>
          <meshStandardMaterial attach="material-0" map={st.cork} roughness={0.85} />
          <meshStandardMaterial attach="material-1" color={SKC.INK} roughness={0.5} />
        </mesh>
        {[-3.2, 3.2].map((x) => <mesh key={x} position={[x, BOARD_Y0 / 2, -0.25]} castShadow><boxGeometry args={[0.28, BOARD_Y0, 0.28]} /><meshStandardMaterial color={SKC.OAK_D} /></mesh>)}
        {[-3.2, 3.2].map((x) => <mesh key={x + "f"} position={[x, 0.06, -0.25]}><boxGeometry args={[0.6, 0.12, 1.3]} /><meshStandardMaterial color={SKC.OAK_D} /></mesh>)}
      </group>
      <group position={[BX, 6.22, BFRONT + 0.12]} rotation={[flipA, 0, 0.01 * Math.sin(t * 1.2)]}>
        <Plate3D w={5.2} h={0.95} d={0.16} r={0.3} tex={stepsOn ? dyn.steps : st.header} rot={[flipA > Math.PI / 2 ? Math.PI : 0, 0, 0]} glow={0.6} />
      </group>
      {stepBurst.map((s, i) => <Burst key={i} p={[BX, 6.22, BFRONT + 0.5]} t={t} at={s + 0.05} seed={40 + i} n={12} speed={2.4} />)}
      {CARDS.map((card, i) => {
        const s = cardsSt[i];
        const pose = cardPose(t, i, s);
        return (
          <group key={i} position={pose.p} rotation={pose.rot} scale={pose.scale}>
            <Plate3D w={CARD_W} h={CARD_H} d={CARD_D} r={0.2} tex={dyn[`card${i}`]} backTex={st.back} glow={0.5 + 0.3 * s.spot} />
            {s.fall <= 0 && s.fly <= 0 && <mesh position={[0, CARD_H / 2 - 0.12, CARD_D / 2 + 0.1]}><sphereGeometry args={[0.08, 14, 10]} /><meshStandardMaterial color={SKC.RED} roughness={0.25} /></mesh>}
            {(s.keep > 0.05 || s.hl > 0.05) && <mesh position={[0, 0, -0.2]}><planeGeometry args={[CARD_W * 1.5, CARD_H * 1.7]} /><meshBasicMaterial color={i === DRUCK ? "#FFE08A" : "#FFB070"} transparent opacity={0.22 * Math.max(s.keep, s.hl)} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></mesh>}
          </group>
        );
      })}
      {STRIKE_ORDER.map((i, k) => <Burst key={i} p={slot(i)} t={t} at={strikeAt(i) + 0.25} seed={70 + k} n={10} speed={2.2} colors={[SKC.RED, "#FFFFFF", SKC.INK]} />)}
      <Burst p={slot(DRUCK)} t={t} at={T.druck + 0.05} n={14} speed={2.4} seed={17} colors={["#F2C230", "#FFFFFF"]} />
      <Burst p={slot(KEEP)} t={t} at={T.arbeit + 0.05} n={14} speed={2.4} seed={18} />
      <Burst p={FT} t={t} at={T.shirts + 0.6} n={40} speed={5} size={0.15} seed={9} colors={[SKC.OR, SKC.GOLD, "#FFFFFF", SKC.GREEN, SKC.BLUE]} life={1.3} />
      <Sticker3D t={t} at={T.shirts + 0.45} until={T.nur + 0.1} tex={st.shirts} w={3.4} h={0.68} p={add(FT, [0, 1.55, 0.3])} rot={-3} seed={5} />

      {/* ---------- founder desk ---------- */}
      <Island p={F} r={F_R} t={t} label={st.world.plateFounder} />
      <LightCone p={F} t={t} seed={1} color="#FFD9A8" r={2.6} o={0.06} />
      <Laptop p={LAPTOP} yaw={AG_YAW + Math.PI} screen={st.laptop} s={0.95} />
      <KasseBoard t={t} tex={dyn.kasse} />
      <Agent p={fo.p} yaw={fo.yaw} t={t} s={0.95} reach={fo.reach} lean={fo.lean} armL={fo.armL} armR={fo.armR} talk={fo.talk} squash={fo.squash} sway={fo.sway} />

      {/* ---------- current prop above the agent (one at a time) ---------- */}
      <Sticker3D t={t} at={T.an} until={T.zweitens - 0.15} tex={st.research} w={3.2} h={0.65} p={add(PS, [0.1, 0, 0])} rot={-2} seed={2} />
      <Sticker3D t={t} at={T.keinL} until={T.drittens - 0.1} tex={st.kLager} w={2.3} h={0.6} p={add(PS, [-0.3, 0.7, 0])} rot={-3} seed={3} />
      <Sticker3D t={t} at={T.keineM} until={T.drittens - 0.1} tex={st.kMasch} w={2.9} h={0.6} p={add(PS, [0.2, 0.0, 0.1])} rot={2} seed={4} />
      <Sticker3D t={t} at={T.kleine} until={T.drittens - 0.1} tex={st.kBetr} w={3.1} h={0.64} p={add(PS, [-0.1, -0.7, 0.2])} rot={-1} seed={6} />
      <Sticker3D t={t} at={T.immer} until={T.claude2 - 0.2} tex={st.kaufen} w={3.3} h={0.99} p={add(PS, [0.1, 0, 0.1])} rot={-2} seed={7} />
      <Sticker3D t={t} at={T.nirgends + 0.05} until={T.das - 0.1} tex={st.statistik} w={3.2} h={0.62} p={add(PS, [0, 0.5, 0])} rot={-2} seed={10} />
      <Sticker3D t={t} at={T.nachb} until={T.das - 0.1} tex={st.nachb} w={3.6} h={0.61} p={add(PS, [0.2, -0.3, 0.1])} rot={2} seed={12} />
      {/* scoreboard (source counter on a hanging object) */}
      {sbIn > 0.001 && sbOut < 0.999 && (
        <group position={SB} rotation={[0, 0.05, Math.sin((t - T.claude2) * 7) * 0.06 * Math.exp(-Math.max(0, t - T.claude2) * 2) + 0.03 * bump(t, T.q300 + 0.1, 0.3) * Math.sin(t * 40)]}>
          <Rope a={[-1.3, 8, -0.1]} b={[-1.3, 0.8, -0.1]} />
          <Rope a={[1.3, 8, -0.1]} b={[1.3, 0.8, -0.1]} />
          <Plate3D w={3.5} h={1.9} d={0.3} r={0.3} body={SKC.CREAM} p={[0, 0, 0]}>
            <Plate3D w={3.1} h={0.46} d={0.08} r={0.16} tex={st.sbHead} p={[0, 0.6, 0.52]} glow={0.6} />
            <mesh position={[0, -0.26, 0.0]}><boxGeometry args={[2.3, 1.08, 0.06]} /><meshStandardMaterial color={SKC.INK} roughness={0.4} /></mesh>
            {[2, 1, 0].map((d, k) => <OdometerDigit key={d} p={[-0.74 + k * 0.74, -0.26, -0.25]} value={odo(d)} tex={st.strip} r={0.58} w={0.62} />)}
            {[[0.2, 0.36], [-0.78, 0.44]].map(([y, hh]) => <mesh key={y} position={[0, y, 0.41]} castShadow><boxGeometry args={[2.42, hh, 0.1]} /><meshStandardMaterial color={SKC.CREAM} roughness={0.4} /></mesh>)}
            {[-1.21, 1.21].map((x) => <mesh key={x} position={[x, -0.26, 0.41]}><boxGeometry args={[0.12, 0.6, 0.1]} /><meshStandardMaterial color={SKC.CREAM} roughness={0.4} /></mesh>)}
            {[-0.37, 0.37].map((x) => <mesh key={x} position={[x, -0.26, 0.41]}><boxGeometry args={[0.06, 0.62, 0.1]} /><meshStandardMaterial color={SKC.INK} roughness={0.4} /></mesh>)}
          </Plate3D>
          <Burst p={[0, 0, 0.4]} t={t} at={T.q300 + 0.45} n={26} speed={3.4} seed={21} />
          <Burst p={[0, 0, 0.4]} t={t} at={T.quellen + 0.02} n={18} speed={3} seed={23} colors={[SKC.GOLD, "#FFFFFF"]} />
        </group>
      )}
      {sbIn > 0.5 && sbOut < 0.5 && Array.from({ length: 14 }).map((_, i) => {
        const a0 = T.claude2 + i * 0.09 + (i > 7 ? T.q300 - T.claude2 - 0.6 : 0);
        const k = cl((t - a0) / 0.5);
        if (k <= 0 || k >= 1) return null;
        const from: V3 = add(LAPTOP, [(rnd(i) - 0.5) * 0.8, 0.6, 0]);
        const q = lerp3(from, add(SB, [(rnd(i + 2) - 0.5) * 1.2, -0.2, 0.4]), ease(k));
        return <Plate3D key={i} w={0.42} h={0.42} d={0.06} r={0.1} tex={st.src[i % st.src.length]} p={[q[0] + Math.sin(k * Math.PI) * 0.6 * (rnd(i + 7) - 0.5), q[1] + Math.sin(k * Math.PI) * 0.7, q[2] + Math.sin(k * Math.PI) * 0.5]} rot={[k * 3, k * 4 + i, 0.3]} s={1 - 0.5 * k} glow={0.6} shadow={false} />;
      })}

      {/* ---------- TAG 2 tag ---------- */}
      <group position={TG}>
        {(() => {
          const v = back((t - T.das - 0.05) / 0.45);
          if (v <= 0.001) return null;
          const sw = Math.sin((t - T.das) * 4.5) * 0.22 * Math.exp(-Math.max(0, t - T.das) * 1.2) + 0.04 * Math.sin(t * 2);
          return (
            <group rotation={[0, 0, sw]} position={[0, (1 - v) * 3, 0]}>
              <Rope a={[0, 6, 0]} b={[0, 0.1, 0]} />
              <Plate3D w={2.0} h={1.74} d={0.14} r={0.28} tex={st.tag2} p={[0, -0.9, 0]} rot={[0, -0.2 + Math.sin(t * 1.7) * 0.2, 0]} glow={0.6} />
            </group>
          );
        })()}
        <Burst p={[0, -0.9, 0.3]} t={t} at={T.morgen} n={18} speed={2.8} seed={31} colors={[SKC.GOLD, "#FFFFFF", SKC.OR]} />
      </group>

      {/* ---------- partner island (slides in, prints, leaves) ---------- */}
      {partnerOn > 0.001 && (
        <group>
          <Island p={P} r={P_R} t={t} side={SKC.BLUE} rim="#BFE3FF" label={st.platePartner} glow={partnerOn * (0.75 + 0.25 * Math.sin(t * 5))} glowCol="#7FD6FF" />
          <pointLight position={add(P, [0, 3.5, 1.5])} intensity={10 * partnerOn} distance={8} color="#9DD8FF" />
          <PrintMachine p={P_M} t={t} s={0.55} yaw={-0.45} tint="#F2F5FA" accent="#1C2440" running={running} />
          {drop > 0.001 && <TShirt p={add(P_M, [0.1, 1.9 - 1.3 * ease(drop), 1.2])} s={0.7} rot={[0, -0.3 + drop * 0.6, 0]} logo={st.world.shirtLogo} />}
          <Burst p={add(P_M, [0.1, 0.7, 1.2])} t={t} at={T.einem + 0.22} n={16} speed={2.6} seed={41} colors={["#FFFFFF", "#9DD8FF", SKC.BLUE]} />
          <Agent p={add(P, [0.95, TOP, 0.6])} yaw={-0.6 + 0.2 * Math.sin(t * 2)} t={t} s={0.55} seed={7} pal={PARTNER} armL={140 + 20 * Math.sin(t * 8)} armR={40 + 30 * Math.sin(t * 6)} glow={0.6 * partnerOn} squash={0.05 * Math.sin(t * 3) + hop(t, T.einem + 0.25, 0.3).sq} sway={0.15 * Math.sin(t * 3.4)} />
          <Sticker3D t={t} at={T.partner} until={T.die - 0.15} tex={st.partner} w={3.1} h={0.65} p={add(P, [-0.6, 3.65, 1.6])} rot={-2} seed={13} />
          <Sticker3D t={t} at={T.einem} until={T.die - 0.15} tex={st.ab1} w={1.6} h={0.88} p={add(P, [-1.3, 2.55, 1.0])} rot={4} seed={14} />
        </group>
      )}
    </>
  );
};

// ======================================================================================================
// 2D: the paper window
// ======================================================================================================
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const out = ease((t - (T.heute - 0.12)) / 0.35);
  if (out >= 0.999) return null;
  const pulse = (a: number, d = 0.3) => 1 + 0.07 * bump(t, a + 0.08, d);
  const tagK = 1 + 0.3 * bump(t, T.tag + 0.04, 0.22);
  const wig = Math.sin((t - T.ganz) * 16) * 4 * Math.exp(-Math.max(0, t - T.ganz) * 3) * (t > T.ganz ? 1 : 0);
  const fl = (s: number) => Math.sin(t * 2.2 + s) * 4;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${-out * 520}px)`, opacity: 1 - out }}>
      {/* TAG chip + series line */}
      <div style={{ position: "absolute", left: 44, top: 52, display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ padding: "6px 30px", borderRadius: 40, background: CLAUDE_ORANGE, border: `6px solid ${INK}`, boxShadow: "0 7px 0 rgba(0,0,0,.3)", fontFamily: pixelFont, fontWeight: 900, fontSize: 64, color: "#fff", letterSpacing: 2, transform: `rotate(-4deg) scale(${tagK})` }}>TAG 1</div>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 40, color: "#6E665A", letterSpacing: 1 }}>EIN EXPERIMENT</div>
      </div>
      {/* headline */}
      <div style={{ position: "absolute", left: 44, top: 168, fontFamily: pixelFont, fontWeight: 900, fontSize: 138, lineHeight: 1.0, color: INK, letterSpacing: -2 }}>
        <div style={{ transform: `translateY(${fl(0)}px)` }}>
          <span style={{ display: "inline-block", transform: `scale(${pulse(T.ki)})`, transformOrigin: "50% 80%" }}>KI</span>{" "}
          <span style={{ display: "inline-block" }}>gründet</span>
        </div>
        <div style={{ color: CLAUDE_ORANGE, WebkitTextStroke: `4px ${INK}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${INK}`, transform: `translateY(${fl(1)}px) scale(${pulse(T.unt, 0.4)})`, transformOrigin: "0% 70%" }}>eine Firma.</div>
      </div>
      <div style={{ position: "absolute", left: 50, top: 476, padding: "8px 30px", borderRadius: 18, background: INK, color: "#fff", fontFamily: pixelFont, fontWeight: 900, fontSize: 62, letterSpacing: 1, transform: `rotate(${-2.5 + wig}deg) scale(${1 + 0.08 * bump(t, T.ganz + 0.1, 0.3)})`, transformOrigin: "20% 50%", boxShadow: "0 7px 0 rgba(0,0,0,.25)" }}>Ganz alleine.</div>
      {/* arrow from the question down to the stage */}
      <svg width="160" height="120" style={{ position: "absolute", right: 70, top: 470, transform: `translateY(${Math.sin(t * 5) * 6}px)` }} viewBox="0 0 160 120">
        <path d="M20 20 C 90 10, 130 40, 120 100" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M96 84 L120 104 L138 76" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// marker ring drawn around a box (hand-drawn look)
const Scribble: React.FC<{ k: number; w: number; h: number; color?: string }> = ({ k, w, h, color = CLAUDE_ORANGE }) => {
  const L = 2 * Math.PI * Math.sqrt((w * w + h * h) / 8) * 1.15;
  return (
    <svg width={w + 40} height={h + 40} style={{ position: "absolute", left: -20, top: -20, pointerEvents: "none", overflow: "visible" }}>
      <path d={`M ${w * 0.55} 14 C ${w + 30} 6, ${w + 20} ${h + 34}, ${w * 0.5} ${h + 28} C -10 ${h + 26}, 4 8, ${w * 0.62} 22`} stroke={color} strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - k)} />
    </svg>
  );
};

const ClaudePanel: React.FC<{ t: number }> = ({ t }) => {
  const g = inputGeom(t);
  const endK = ease((t - (T.komm - 0.2)) / 0.35);
  const reportIn = T.am - 0.12;
  const showInput = t < reportIn + 0.1;
  const step = t < T.zweitens - 0.05 ? 1 : t < T.drittens - 0.05 ? 2 : 3;
  const typed = typedAt(PROMPT_KEYS, t);
  const research = cl((t - (T.research + 0.12)) / 0.3);
  const sendPress = bump(t, SEND + 0.04, 0.14);
  const promptMarks = [
    { find: "kein eigenes Lager", at: T.keinL, color: "yellow" as const },
    { find: "keine eigene Maschine", at: T.keineM, color: "yellow" as const },
    { find: "kleine Betriebe mit weniger als zehn Leuten", at: T.kleine, color: "yellow" as const },
    { find: "Recherchiere:", at: T.frag, color: "blue" as const },
    { find: "immer wieder", at: T.immer, color: "orange" as const },
  ];
  // research card status
  const running = t < T.quellen;
  const count = t < T.q300 ? 169 : Math.round(169 + 145 * ease((t - T.q300) / 0.45));
  const status = running ? (
    <span><b style={{ color: CLAUDE_ORANGE, fontSize: 44, fontWeight: 900 }}>{count}</b> sources and counting… • 53s</span>
  ) : (
    <span style={{ color: INK }}>Research complete • <b style={{ color: CLAUDE_ORANGE, fontSize: 44, fontWeight: 900 }}>314</b> sources • 5m 30s</span>
  );
  const introN = typedAt([[SEND + 0.3, 0], [T.claude2 - 0.1, INTRO.length]], t);
  const rcIn = back((t - (T.claude2 - 0.2)) / 0.4);
  const ringK = bump(t, T.q300 + 0.25, 0.5) + bump(t, T.quellen + 0.1, 0.4);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - endK }}>
      {/* empty chat: Claude logo hero */}
      {t > T.heute - 0.2 && t < T.zweitens + 0.4 && (() => {
        const k = back((t - (T.heute + 0.1)) / 0.5) * (1 - ease((t - T.zweitens + 0.05) / 0.3));
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, k * 1.4), transform: `scale(${0.6 + 0.4 * k})` }}>
            <Img src={staticFile("logos/claude.svg")} style={{ width: 170, height: 170, transform: `rotate(${(t - T.claude) * 25}deg)` }} />
            <div style={{ marginTop: 18, fontFamily: claudeSerif, fontWeight: 500, fontSize: 64, color: INK }}>How can I help you today?</div>
          </div>
        );
      })()}

      {/* the input card (hook question → empty chat → long prompt → slim reply) */}
      {showInput && (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${ease((t - reportIn) / 0.25) * 300}px)` }}>
          <InputCard
            top={g.top} bottom={g.bot} t={t} focus={t > T.schreib - 0.3 && t < SEND}
            fontSize={t < T.heute ? 82 : 38}
            showPlaceholder={t > T.heute + 0.05 && typed === 0}
            placeholder={t > SEND ? "Reply to Claude…" : "How can I help you today?"}
            research={research} plusPress={bump(t, T.plus + 0.04, 0.14)} sendPress={sendPress} sent={t > SEND}
          >
            {t < T.heute + 0.05 ? (
              <span style={{ fontWeight: 900, opacity: 1 - ease((t - T.heute + 0.1) / 0.15), display: "inline-block", transform: `scale(${1 + 0.06 * bump(t, T.kein + 0.15, 0.35) + 0.05 * bump(t, T.produkt + 0.1, 0.3)})`, transformOrigin: "0 50%" }}>
                Was verkauft <span style={{ color: CLAUDE_ORANGE }}>sie?</span>
                <span style={{ display: "inline-block", width: 7, height: 80, marginLeft: 8, background: CLAUDE_ORANGE, verticalAlign: "-0.12em", opacity: Math.floor(t * 2.5) % 2 ? 1 : 0.15 }} />
              </span>
            ) : t < SEND + 0.05 ? (
              (() => {
                const visible = Math.floor((g.bot - g.top - 126) / (PROMPT_FS * PROMPT_LH));
                const ln = typed > 0 ? promptLineOf()[Math.min(PROMPT.length - 1, typed - 1)] : 0;
                const scroll = Math.max(0, ln - visible + 1) * PROMPT_FS * PROMPT_LH;
                return <div style={{ transform: `translateY(${-scroll}px)`, fontSize: PROMPT_FS, lineHeight: PROMPT_LH }}><MarkedText text={PROMPT} n={typed} t={t} marks={promptMarks} caret={t < SEND} /></div>;
              })()
            ) : null}
          </InputCard>
        </div>
      )}
      <PlusMenu t={t} open={T.plus + 0.1} close={T.an + 0.22} top={MENU_TOP} hot="Research" hotAt={T.research - 0.25} onAt={T.research + 0.12} />

      {/* conversation after send */}
      {t > SEND && t < reportIn + 0.4 && (
        <Slide t={t} inAt={SEND + 0.02} outAt={reportIn} style={{ left: 34, right: 34, top: 160 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <UserBubble text={PROMPT} lines={2} fontSize={28} style={{ maxWidth: 900 }} />
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <Img src={staticFile("logos/claude.svg")} style={{ width: 48, height: 48, marginTop: 4, transform: `rotate(${t * 40}deg)` }} />
              <div style={{ fontFamily: pixelFont, fontWeight: 500, fontSize: 30, lineHeight: 1.32, color: INK, minHeight: 200 }}>{INTRO.slice(0, introN)}</div>
            </div>
            {rcIn > 0.001 && (
              <div style={{ transform: `scale(${rcIn})`, transformOrigin: "20% 0%" }}>
                <ResearchCard t={t} title={R_TITLE} status={status} running={running} access="Given access to: “Google Sheets”" highlight={Math.min(1, ringK)} />
              </div>
            )}
          </div>
        </Slide>
      )}

      {/* report: the recommendation */}
      <Slide t={t} inAt={reportIn} outAt={T.nur - 0.08} style={{ left: 30, right: 30, top: 160 }}>
        <div style={{ background: "#FFFFFF", border: `5px solid ${INK}`, borderRadius: 26, boxShadow: "0 10px 0 rgba(0,0,0,.22)", padding: "26px 30px 30px", height: 750, boxSizing: "border-box", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: pixelFont, fontWeight: 700, fontSize: 26, color: "#8A8378", letterSpacing: 1 }}>
            <LineIcon k="doc" size={30} color="#8A8378" /> REPORT · 314 SOURCES
          </div>
          <div style={{ marginTop: 10, fontFamily: claudeSerif, fontWeight: 600, fontSize: 42, lineHeight: 1.15, color: INK }}>{REPORT_TITLE}</div>
          <div style={{ marginTop: 18, fontFamily: pixelFont, fontWeight: 500, fontSize: 40, lineHeight: 1.34, color: INK }}>
            <MarkedText text={REPORT_P} t={t} dim={0.55 * ease((t - T.nimmt) / 0.3)} marks={[
              { find: "Drucksachen", at: T.druck, color: "yellow", until: T.nimmt + 0.1 },
              { find: "Arbeitskleidung mit Logo", at: T.arbeit, color: "orange" },
              { find: "Partner, die nachweislich neutral direkt an Ihre Kunden versenden", at: T.partner, color: "blue", until: T.nimmt },
            ]} />
          </div>
          {/* table row from the report (row 2) */}
          {(() => {
            const k = back((t - (T.ein2 + 0.05)) / 0.4);
            if (k <= 0.001) return null;
            return (
              <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, background: "#F6F1E8", border: `4px solid ${INK}`, borderRadius: 18, padding: "16px 22px", transform: `translateY(${(1 - k) * 60}px)`, opacity: Math.min(1, k) * (1 - 0.5 * ease((t - T.nimmt) / 0.3)) }}>
                <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 24, color: "#8A8378", letterSpacing: 1 }}>TABELLE · ZEILE 2</div>
                <div style={{ marginTop: 6, fontFamily: pixelFont, fontWeight: 500, fontSize: 35, lineHeight: 1.3, color: INK }}>
                  <MarkedText text={ROW2} t={t} marks={[{ find: "ohne Mindestmenge", at: T.einem, color: "green" }]} />
                </div>
              </div>
            );
          })()}
          {/* decision stamp */}
          {(() => {
            const k = back((t - (T.shirts - 0.05)) / 0.35);
            if (k <= 0.001) return null;
            return (
              <div style={{ position: "absolute", right: 30, bottom: 60, padding: "10px 26px", borderRadius: 20, background: CLAUDE_ORANGE, border: `6px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,.3)", fontFamily: pixelFont, fontWeight: 900, fontSize: 58, color: "#fff", transform: `rotate(-5deg) scale(${k})` }}>
                → FIRMENSHIRTS
              </div>
            );
          })()}
        </div>
      </Slide>

      {/* chat answer: the open question */}
      <Slide t={t} inAt={T.nur - 0.08} outAt={T.komm - 0.2} style={{ left: 34, right: 34, top: 166 }}>
        <ResearchCard t={t} title={R_TITLE} running={false} compact status={<span style={{ color: INK }}>Research complete • <b style={{ color: CLAUDE_ORANGE }}>314</b> sources • 5m 30s</span>} />
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginTop: 26 }}>
          <Img src={staticFile("logos/claude.svg")} style={{ width: 50, height: 50, marginTop: 4 }} />
          <div style={{ fontFamily: pixelFont, fontWeight: 500, fontSize: 38, lineHeight: 1.34, color: INK }}>
            <MarkedText text={ANSWER} t={t} dim={0.5 * ease((t - T.nirgends + 0.1) / 0.3)} marks={[
              { find: "Wie oft Kleinstbetriebe diese Produkte nachbestellen", at: T.wie, color: "yellow" },
              { find: "in keiner Statistik gefunden", at: T.nirgends, color: "red" },
            ]} />
          </div>
        </div>
      </Slide>
    </div>
  );
};

const EndPanel: React.FC<{ t: number; keyword: string }> = ({ t, keyword }) => {
  const k = ease((t - (T.komm - 0.2)) / 0.35);
  if (k <= 0.001) return null;
  const kw = back((t - (T.komm + 0.05)) / 0.4);
  const fld = back((t - (T.komm + 0.2)) / 0.4);
  const gd = back((t - T.schick) / 0.4);
  const fly = ease((t - T.guide) / 0.55);
  const landed = t > T.guide + 0.55;
  const sent = t > T.und;
  const typed = keyword.slice(0, Math.max(0, Math.floor((t - T.kw) * 12)));
  const wig = Math.sin((t - T.kw) * 12) * 3 * Math.exp(-Math.max(0, t - T.kw) * 2.5) * (t > T.kw ? 1 : 0);
  const fl = (s: number) => Math.sin(t * 2 + s) * 5;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: k, transform: `translateY(${(1 - k) * 80}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: pixelFont, fontWeight: 900, fontSize: 112, color: INK, letterSpacing: 1, transform: `translateY(${fl(0)}px)` }}>KOMMENTIERE</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "4px 54px 14px", borderRadius: 40, background: CLAUDE_ORANGE, border: `8px solid ${INK}`, boxShadow: "0 12px 0 rgba(0,0,0,.3)", fontFamily: pixelFont, fontWeight: 900, fontSize: 176, color: "#fff", transform: `rotate(${-3 + wig}deg) scale(${kw})`, letterSpacing: 2 }}>{keyword.toUpperCase()}</div>
      </div>
      {/* comment field */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 520, height: 128, borderRadius: 64, background: "#FFFFFF", border: `6px solid ${sent ? "#2FBF71" : INK}`, boxShadow: "0 8px 0 rgba(0,0,0,.22)", display: "flex", alignItems: "center", padding: "0 20px", gap: 20, transform: `scale(${fld})` }}>
        <div style={{ width: 84, height: 84, borderRadius: 42, background: "#E4DCCD", border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 900, fontSize: 30, color: INK }}>DU</div>
        <div style={{ flex: 1, fontFamily: pixelFont, fontWeight: 800, fontSize: 60, color: typed ? INK : "#A39C90" }}>{typed || "Kommentar …"}{!sent && typed && Math.sin(t * 12) > 0 ? "|" : ""}</div>
        <div style={{ width: 88, height: 88, borderRadius: 44, background: sent ? "#2FBF71" : CLAUDE_ORANGE, border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 50, fontWeight: 900, fontFamily: pixelFont, transform: `scale(${1 + 0.3 * bump(t, T.und + 0.05, 0.2)})` }}>{sent ? "✓" : "↑"}</div>
      </div>
      {/* guide per DM */}
      {gd > 0.001 && (
        <div style={{ position: "absolute", left: 60, top: 712, display: "flex", alignItems: "center", gap: 30, transform: `scale(${gd})`, transformOrigin: "0 50%" }}>
          <div style={{ padding: "10px 34px", borderRadius: 24, background: INK, color: "#fff", fontFamily: pixelFont, fontWeight: 900, fontSize: 74, boxShadow: "0 8px 0 rgba(0,0,0,.25)", transform: `rotate(-2deg) translateY(${fl(2)}px)` }}>GUIDE PER DM</div>
        </div>
      )}
      {gd > 0.001 && (
        <div style={{ position: "absolute", right: 70, top: 700, width: 170, height: 130, borderRadius: 34, background: "#3E6FD8", border: `6px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 900, fontSize: 62, color: "#fff", transform: `scale(${gd * (1 + 0.18 * bump(t, T.guide + 0.6, 0.2))}) rotate(3deg)` }}>DM</div>
      )}
      {gd > 0.001 && !landed && (
        <div style={{ position: "absolute", left: 650 + fly * 250, top: 720 - Math.sin(fly * Math.PI) * 110, width: 86, height: 108, borderRadius: 12, background: "#fff", border: `5px solid ${INK}`, transform: `rotate(${-10 + fly * 380}deg) scale(${1 - 0.4 * fly})`, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 10, boxSizing: "border-box" }}>
          <div style={{ background: "#E5534B", color: "#fff", fontFamily: pixelFont, fontWeight: 900, fontSize: 24, padding: "2px 8px", borderRadius: 6 }}>PDF</div>
        </div>
      )}
    </div>
  );
};

const PaperWindow: React.FC<{ t: number; keyword: string }> = ({ t, keyword }) => {
  const barOut = ease((t - (T.komm - 0.2)) / 0.3);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PANEL, borderBottom: `9px solid ${INK}`, boxShadow: "0 20px 0 rgba(0,0,0,.28)", overflow: "hidden", boxSizing: "content-box" }}>
      <CrumpledPaper w={W} h={PANEL} strength={0.5}>
        <Hook t={t} />
        <ClaudePanel t={t} />
        {t > T.heute - 0.1 && barOut < 0.999 && (
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${-barOut * 200}px)` }}>
            <WindowBar t={t} enter={T.heute + 0.05} top={36} chip={(() => {
              const step = t < T.zweitens - 0.05 ? 1 : t < T.drittens - 0.05 ? 2 : 3;
              if (t > T.erstens - 0.1 && t < SEND + 0.5) return <StepChipBar key={step} t={t} n={step} label={["RESEARCH", "REGELN", "FRAGE"][step - 1]} at={[T.erstens, T.zweitens, T.drittens][step - 1]} done={SEND} />;
              return null;
            })()} />
          </div>
        )}
        <EndPanel t={t} keyword={keyword} />
        {/* click path (cursor flies in from the stage) */}
        <div style={{ position: "absolute", inset: 0, opacity: cursorVis(t) }}>
          <ClickPath t={t} clicks={CLICKS} start={{ t: T.erstens, x: 560, y: 1100 }} />
        </div>
      </CrumpledPaper>
    </div>
  );
};

// ======================================================================================================
// composition
// ======================================================================================================
const STAGE_TOP = 900, STAGE_H = H - STAGE_TOP;
export const FirmaShirtsTag1V3: React.FC<FirmaShirtsTag1V3Props> = ({ keyword = "Produkt", cover = false }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ready = useFontsReady(["900 70px Rubik", "800 40px Rubik", "500 40px Rubik", `600 40px ${SERIF}`, `800 40px ${pixelFont}`]);
  const logo = useImage(staticFile("logos/claude.svg"));
  const st = useStatic(ready, logo);
  const cs = CARDS.map((_, i) => cardState(t, i));
  const card0 = useDyn(620, 360, (c) => ready && drawCardFace(c, 620, 360, CARDS[0], cs[0]));
  const card1 = useDyn(620, 360, (c) => ready && drawCardFace(c, 620, 360, CARDS[1], cs[1]));
  const card2 = useDyn(620, 360, (c) => ready && drawCardFace(c, 620, 360, CARDS[2], cs[2]));
  const card3 = useDyn(620, 360, (c) => ready && drawCardFace(c, 620, 360, CARDS[3], cs[3]));
  const card4 = useDyn(620, 360, (c) => ready && drawCardFace(c, 620, 360, CARDS[4], cs[4]));
  const card5 = useDyn(620, 360, (c) => ready && drawCardFace(c, 620, 360, CARDS[5], cs[5]));
  const steps = useDyn(1100, 200, (c) => ready && drawSteps(c, 1100, 200, t));
  const kasse = useDyn(700, 570, (c) => ready && drawKasse(c, 700, 570, t));
  const dyn = { card0, card1, card2, card3, card4, card5, steps, kasse };
  const cam = camAt(t);
  const flash = 0.08 * bump(t, T.shirts + 0.03, 0.12);
  const fx = {
    focus: cam.dist, aperture: cam.ap, maxBlur: 6, mb: [0, 0] as [number, number], zoom: 0,
    bloom: 0.18 + 0.25 * bump(t, T.shirts + 0.2, 0.5), bloomRadius: 0.55, bloomThreshold: 0.92,
    chroma: 0.002, grain: 0.02, vignette: 0.3, t,
  };
  return (
    <AbsoluteFill style={{ background: SKC.BG }}>
      {st && (
        <div style={{ position: "absolute", left: 0, top: STAGE_TOP, width: W, height: STAGE_H }}>
          <ThreeCanvas width={W} height={STAGE_H} shadows gl={{ antialias: true }}>
            <World t={t} st={st} dyn={dyn} cam={cam} fx={fx} />
          </ThreeCanvas>
          <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash, pointerEvents: "none" }} />
        </div>
      )}
      <PaperWindow t={t} keyword={keyword} />
      {!cover && <PillCaptions words={CAPTIONS} theme={THEMES.gym} y={1690} />}
    </AbsoluteFill>
  );
};
