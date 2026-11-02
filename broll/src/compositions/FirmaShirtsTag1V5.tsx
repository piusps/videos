// "KI gründet eine Firma, ganz alleine" · Tag 1 · v5 (2026-10-27, firma-design)
// Pius zu v4: "graphisch noch nicht so geil designt, können wir uns nicht noch was von claudebyseb ziehen".
// v5 = gleiche Stimme/Mix/Timings/CTA wie v4, Bild komplett neu nach den claudebyseb-Prinzipien:
//  - kein Dauer-Split mehr: Vollbild-Shots im Wechsel - beleuchtete 3D-Welt (Gründer-Garage am Abend, navy + warmes Licht)
//    und Vollbild-Claude (Papier-Fenster an der Wand, groß und lesbar, Agent lugt unten herein)
//  - Serien-Device GRÜNDUNGSPLAN (3×3, Reihenfolge aus konzept.md), Tag-Badge oben links, Mini-Grid oben rechts
//  - großer Agent mit Outlines, Augen-Ausdrücken pro Beat, Blush, Requisiten (Denkblase, Shirt, Fragen-Karten)
//  - Produkt-Slots mit den echten Kandidaten aus dem Report (Drucksachen, Arbeitskleidung, Handschuhe, Umhänge, Bäckertüten)
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, THEMES, Word, pixelFont } from "../components/PixelKit";
import { SKC, V3, cl, ease, inOut, back, bump, add, rnd, fitFont, useDyn, useImage, drawIcon, drawBotLogo, PrintMachine } from "../components/ShirtWorld3D";
import { PostFX, EnvLight, CameraRig2, Plate3D, Burst, Motes } from "../components/FirmaFX3D";
import { ClickPath, Click, INK, CLAUDE_ORANGE, claudeSerif } from "../components/ClaudeUI";
import {
  CrumpledPaper, WindowBar, StepChipBar, PlusMenu, InputCard, MarkedText, typedAt, ResearchCard,
  menuRowY, inputPlus, MENU_ROW, MENU_SEP, MENU_PAD, PLUS_MENU,
} from "../components/ClaudePaperChat";
import wordsRaw from "../../public/firma-neu-tag1/words-v4.json";

const W = 1080, H = 1920;
export type FirmaShirtsTag1V5Props = { keyword?: string; cover?: boolean };
export const FIRMA_SHIRTS_TAG1_V5_SECONDS = 41.5;

// ---------- word anchors (= v4) ----------
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
  ki: at("KI", 0.9), ganz: at("ganz", 1.3), unt: at("Unternehmen", 2.0), ich: at("Ich", 3.0), tag: at("1", 4.5), kein: at("kein", 5.7), produkt: at("Produkt", 5.9),
  heute: at("Heute", 6.5), claude: at("Claude", 7.4),
  erstens: at("Erstens", 8.0), unten: at("unten", 8.7), plus: at("Plus", 9.3), research: at("Research", 10.0), an: at("an", 10.4),
  zweitens: at("Zweitens", 11.0), schreib: at("Schreib", 11.9), keinL: at("Kein", 13.2), keineM: at("keine", 13.9), kleine: at("kleine", 14.9),
  drittens: at("Drittens", 16.0), frag: at("Frag", 16.9), immer: at("immer", 18.0), kaufen: at("kaufen", 18.5),
  claude2: at("Claude", 19.2), q300: at("300", 20.0), quellen: at("Quellen", 20.4),
  am: at("Am", 21.0), druck: at("Drucksachen", 21.7), arbeit: at("Arbeitskleidung", 22.4),
  ein2: at("Ein", 23.7), partner: at("Partner", 23.9), druckt: at("druckt", 24.2), ab: at("ab", 24.8), einem: at("einem", 25.0),
  die: at("Die", 25.7), nimmt: at("nimmt", 26.0), kleidung: at("Kleidung", 26.4), shirts: at("Firmenshirts", 27.0),
  nur: at("Nur", 28.2), nirgends: at("nirgends", 29.1), wie: at("wie", 29.6), nachb: at("nachbestellen", 30.3), das: at("Das", 31.2), morgen: at("morgen", 31.5),
  komm: at("Kommentiere", 32.0), kw: at("Produkt", 32.5), und: at("und", 33.8), schick: at("schick", 34.2), drei: at("drei", 34.5), kopieren: at("Kopieren", 35.2),
  fuenf: at("fünf", 36.5), zehn: at("zehn", 37.3), ideen: at("Ideen", 37.3), business: at("Business", 38.0), quelle: at("Quelle", 39.5),
};
const SEND = T.kaufen + 0.25;
const END = FIRMA_SHIRTS_TAG1_V5_SECONDS;

// ======================================================================================================
// texts from the real run (design/lauf-tag1) - verbatim
// ======================================================================================================
const PROMPT =
  "Ich will in Deutschland eine kleine Firma gründen, die ich komplett vom Schreibtisch aus führe. Meine Regeln: kein eigenes Lager, keine eigene Maschine, ein Partner stellt her und verschickt, und meine Kunden sind kleine Betriebe mit weniger als zehn Leuten, zum Beispiel Handwerker, Friseure, Bäckereien. Recherchiere: Welche zehn Produkte oder Leistungen kaufen solche Betriebe immer wieder, und welche davon könnte ich nach diesen Regeln verkaufen? Nenne zu jeder Idee kurz, warum, und die Quelle. Erfinde nichts. Wo du keine Quelle findest, schreib „unklar“.";
const R_TITLE = "Wiederkehrender Bedarf bei Kleinstbetrieben";
const REPORT_TITLE = "Schreibtisch-Firma für Kleinstbetriebe: Zehn wiederkehrende Bedarfe im Regel-Check";
const REPORT_P = "Am besten passen zu Ihren Regeln Drucksachen über ein Druckerei-Reseller-Programm und Arbeitskleidung mit Logo über Print-on-Demand-Veredler. Für beide gibt es deutsche bzw. EU-Partner, die nachweislich neutral direkt an Ihre Kunden versenden.";
const ANSWER = "Ich habe zehn wiederkehrende Bedarfe von Kleinstbetrieben gegen Ihre Regeln geprüft. Am besten passen Drucksachen über Druckerei-Reseller-Programme wie SAXOPRINT oder FLYERALARM PRO und Logo-Arbeitskleidung über Printful oder Shirtee Cloud. Für beide gibt es Partner, die nachweislich neutral direkt an Ihre Kunden versenden. Wie oft Kleinstbetriebe diese Produkte nachbestellen, habe ich allerdings in keiner Statistik gefunden.";
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
// GRÜNDUNGSPLAN: 9 Schritte in der Reihenfolge der Folgenliste (konzept.md: Tag 1 Produkt, 2 Kunde, 7 Preis, 8 Name, 9 Logo, 10 Website, 14 Werbung, 15 Ansprache, 17 erster Euro)
const PLAN = ["PRODUKT", "KUNDE", "PREIS", "NAME", "LOGO", "WEBSITE", "WERBUNG", "AKQUISE", "ERSTER\nUMSATZ"];
// candidates named in the real report (TL;DR + Absatz 1): 5 shown, 10 checked
type Cand = { label: string; icon: "flyer" | "shirt" | "glove" | "cape" | "bag" | "more" };
const CANDS: Cand[] = [
  { label: "HANDSCHUHE", icon: "glove" }, { label: "DRUCKSACHEN", icon: "flyer" }, { label: "UMHÄNGE", icon: "cape" },
  { label: "BÄCKERTÜTEN", icon: "bag" }, { label: "FIRMENSHIRTS", icon: "shirt" }, { label: "+5 WEITERE", icon: "more" },
];
const KEEP = 4, DRUCK = 1;
// the three questions of the guide (guidebook.json) - short real snippets
const FRAGEN = [
  { n: 1, label: "Ideen sammeln", snip: "„Welche zehn Produkte oder Leistungen kaufen solche Betriebe immer wieder“" },
  { n: 2, label: "Bewerten", snip: "„Bewerte diese Ideen in einer Excel-Tabelle.“" },
  { n: 3, label: "Gegenprobe", snip: "„Welche Idee würdest du an meiner Stelle nehmen?“" },
];

// ======================================================================================================
// shots: full-frame world ↔ full-frame Claude, hard cuts with a short settle push
// ======================================================================================================
type ShotId = "hook" | "claudeA" | "research" | "report" | "partner" | "win" | "answer" | "hub" | "end";
const SHOTS: { id: ShotId; a: number }[] = [
  { id: "hook", a: 0 }, { id: "claudeA", a: T.heute - 0.15 }, { id: "research", a: SEND + 0.3 }, { id: "report", a: T.am - 0.12 },
  { id: "partner", a: T.ein2 - 0.1 }, { id: "win", a: T.die - 0.1 }, { id: "answer", a: T.nur - 0.12 }, { id: "hub", a: T.das - 0.1 }, { id: "end", a: T.komm - 0.15 },
];
const shotAt = (t: number) => {
  let i = 0;
  for (let k = 0; k < SHOTS.length; k++) if (t >= SHOTS[k].a) i = k;
  const a = SHOTS[i].a, b = i + 1 < SHOTS.length ? SHOTS[i + 1].a : END;
  return { id: SHOTS[i].id, a, b, u: t - a, len: b - a };
};
const isClaude = (id: ShotId) => id === "claudeA" || id === "report" || id === "answer";

// set origins in the world (one room, different corners)
const XA = 0, XC = -18, XD = 18, XB = 36;
type CamDef = { pos: V3; look: V3; fov: number; focus: V3; push?: number };
const CAMS: Record<ShotId, CamDef> = {
  hook: { pos: [XA, 3.1, 8.2], look: [XA, 4.5, -4.6], fov: 58, focus: [XA, 1.2, 0.8], push: 0.06 },
  claudeA: { pos: [XB, 3.0, 9.0], look: [XB, 3.0, -4], fov: 58, focus: [XB + 1.2, 1.2, 3.6], push: 0.03 },
  research: { pos: [XC, 3.9, 8.6], look: [XC, 4.7, -4.8], fov: 58, focus: [XC, 4, -4.4], push: 0.06 },
  report: { pos: [XB, 3.0, 9.0], look: [XB, 3.0, -4], fov: 58, focus: [XB + 1.2, 1.2, 3.6], push: 0.03 },
  partner: { pos: [XD + 0.8, 3.6, 7.6], look: [XD + 0.8, 3.3, -2.6], fov: 58, focus: [XD + 1.0, 2.0, -2.0], push: 0.06 },
  win: { pos: [XC + 0.3, 3.8, 8.2], look: [XC, 4.6, -4.8], fov: 58, focus: [XC, 4, -4.4], push: 0.07 },
  answer: { pos: [XB, 3.0, 9.0], look: [XB, 3.0, -4], fov: 58, focus: [XB + 1.2, 1.2, 3.6], push: 0.03 },
  hub: { pos: [XA + 0.2, 3.9, 8.4], look: [XA, 4.25, -4.6], fov: 58, focus: [XA, 4.3, -4.6], push: 0.05 },
  end: { pos: [XA, 3.0, 8.4], look: [XA, 3.6, -3], fov: 58, focus: [XA, 1.4, 1.2], push: 0.04 },
};
const camAt = (t: number) => {
  const s = shotAt(t);
  const c = CAMS[s.id];
  const settle = 0.08 * (1 - ease(s.u / 0.45)); // quick push-in right after each cut
  const push = (c.push ?? 0.05) * inOut(s.u / Math.max(0.5, s.len));
  const k = 1 + settle - push;
  const pos: V3 = [c.look[0] + (c.pos[0] - c.look[0]) * k, c.look[1] + (c.pos[1] - c.look[1]) * k + 0.03 * Math.sin(t * 0.8), c.look[2] + (c.pos[2] - c.look[2]) * k];
  const d = Math.hypot(pos[0] - c.focus[0], pos[1] - c.focus[1], pos[2] - c.focus[2]);
  return { pos, look: c.look, fov: c.fov, focus: d, shot: s };
};

// ======================================================================================================
// canvas drawing helpers
// ======================================================================================================
const NAVY = "#141C33", NAVY_2 = "#1C2847", GOLD = "#E8B64C", CYAN = "#6FE3F0", GREEN = "#2FBF71";
const dieCut = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, border = 14) => {
  c.save();
  c.shadowColor = "rgba(0,0,0,.35)"; c.shadowBlur = 18; c.shadowOffsetY = 8;
  c.fillStyle = "#FFFFFF"; roundRect(c, x, y, w, h, r); c.fill();
  c.restore();
  c.fillStyle = fill; roundRect(c, x + border, y + border, w - 2 * border, h - 2 * border, Math.max(4, r - border)); c.fill();
};
const glyph = (c: CanvasRenderingContext2D, icon: Cand["icon"], x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.lineJoin = "round"; c.lineCap = "round";
  const ink = SKC.INK;
  if (icon === "flyer" || icon === "shirt") { c.restore(); drawIcon(c, icon, x, y, s); return; }
  c.lineWidth = s * 0.07; c.strokeStyle = ink;
  if (icon === "glove") {
    c.fillStyle = "#F5C542";
    c.beginPath();
    c.moveTo(-s * 0.28, s * 0.42); c.lineTo(-s * 0.3, -s * 0.05);
    [-0.24, -0.08, 0.08, 0.24].forEach((fx, i) => { const top = -s * (0.42 - Math.abs(i - 1.5) * 0.04); c.lineTo(s * fx - s * 0.06, top + s * 0.06); c.quadraticCurveTo(s * fx, top - s * 0.04, s * fx + s * 0.06, top + s * 0.06); });
    c.lineTo(s * 0.3, s * 0.0); c.quadraticCurveTo(s * 0.46, -s * 0.12, s * 0.42, s * 0.06); c.lineTo(s * 0.28, s * 0.42); c.closePath();
    c.fill(); c.stroke();
    c.fillStyle = "#3E6FD8"; c.fillRect(-s * 0.3, s * 0.3, s * 0.58, s * 0.14); c.strokeRect(-s * 0.3, s * 0.3, s * 0.58, s * 0.14);
  } else if (icon === "cape") {
    c.fillStyle = "#7A5AE0";
    c.beginPath(); c.moveTo(-s * 0.16, -s * 0.36); c.lineTo(s * 0.16, -s * 0.36); c.lineTo(s * 0.44, s * 0.4); c.quadraticCurveTo(0, s * 0.5, -s * 0.44, s * 0.4); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.ellipse(0, -s * 0.36, s * 0.2, s * 0.08, 0, 0, 7); c.fill(); c.stroke();
  } else if (icon === "bag") {
    c.fillStyle = "#D9A66B";
    c.beginPath(); c.moveTo(-s * 0.3, -s * 0.3); c.lineTo(s * 0.3, -s * 0.3); c.lineTo(s * 0.36, s * 0.42); c.lineTo(-s * 0.36, s * 0.42); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-s * 0.3, -s * 0.3); c.lineTo(-s * 0.2, -s * 0.42); c.lineTo(s * 0.2, -s * 0.42); c.lineTo(s * 0.3, -s * 0.3); c.stroke();
    c.fillStyle = "#FFFFFF"; c.fillRect(-s * 0.18, -s * 0.02, s * 0.36, s * 0.2);
  } else if (icon === "more") {
    c.fillStyle = "#FFFFFF";
    [-1, 0, 1].forEach((k) => { c.beginPath(); c.arc(k * s * 0.24, 0, s * 0.09, 0, 7); c.fill(); c.stroke(); });
  }
  c.restore();
};
const centerText = (c: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, maxW: number, col: string, w = 900) => {
  const f = fitFont(c, text, size, maxW, w);
  c.font = `${w} ${f}px Rubik`; c.fillStyle = col; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(text, x, y);
  return f;
};

// product slot sticker (die-cut) incl. empty "?" slot, cross, keep glow
type SlotS = { fill: number; cross: number; keep: number; dim: number; hl: number };
const drawSlot = (c: CanvasRenderingContext2D, w: number, h: number, cand: Cand, s: SlotS, t: number) => {
  c.clearRect(0, 0, w, h);
  if (s.fill < 0.5) {
    c.setLineDash([26, 18]); c.lineWidth = 8; c.strokeStyle = "rgba(111,227,240,.75)";
    roundRect(c, 14, 14, w - 28, h - 28, 34); c.stroke(); c.setLineDash([]);
    c.fillStyle = "rgba(111,227,240,.08)"; roundRect(c, 14, 14, w - 28, h - 28, 34); c.fill();
    centerText(c, "?", w / 2, h / 2 + 8, 210 + 14 * Math.sin(t * 5), w, "rgba(111,227,240,.9)");
    return;
  }
  dieCut(c, 0, 0, w, h, 46, s.keep > 0.01 ? "#FFF1E3" : "#FFFDF8", 16);
  if (s.hl > 0.01 || s.keep > 0.01) { c.lineWidth = 14; c.strokeStyle = SKC.OR; roundRect(c, 22, 22, w - 44, h - 44, 32); c.stroke(); }
  glyph(c, cand.icon, w / 2, h * 0.4, 200);
  // label strip
  c.fillStyle = SKC.INK; roundRect(c, 40, h - 150, w - 80, 106, 22); c.fill();
  centerText(c, cand.label, w / 2, h - 96, 72, w - 120, "#FFFFFF");
  if (s.dim > 0.01) { c.fillStyle = `rgba(20,28,51,${0.5 * s.dim})`; roundRect(c, 16, 16, w - 32, h - 32, 30); c.fill(); }
  if (s.cross > 0.001) {
    c.lineCap = "round";
    [["#FFFFFF", 64], [SKC.INK, 48], [SKC.RED, 32]].forEach(([col, lw]) => {
      c.strokeStyle = col as string; c.lineWidth = lw as number; c.beginPath();
      const L = w * 0.3, Hh = h * 0.3, k1 = Math.min(1, s.cross * 2), k2 = Math.max(0, s.cross - 0.5) * 2;
      c.moveTo(w / 2 - L, h / 2 - Hh); c.lineTo(w / 2 - L + 2 * L * k1, h / 2 - Hh + 2 * Hh * k1);
      if (k2 > 0) { c.moveTo(w / 2 + L, h / 2 - Hh); c.lineTo(w / 2 + L - 2 * L * k2, h / 2 - Hh + 2 * Hh * k2); }
      c.stroke();
    });
  }
};

// GRÜNDUNGSPLAN board
type PlanS = { cur: number; q: number; done: number; next: number; pulse: number };
const drawPlan = (c: CanvasRenderingContext2D, w: number, h: number, s: PlanS, t: number) => {
  c.clearRect(0, 0, w, h);
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#1D2B52"); g.addColorStop(1, "#111A33");
  c.fillStyle = g; roundRect(c, 0, 0, w, h, 60); c.fill();
  c.strokeStyle = "rgba(111,227,240,.07)"; c.lineWidth = 2;
  for (let x = 40; x < w; x += 70) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
  for (let y = 40; y < h; y += 70) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  c.lineWidth = 16; c.strokeStyle = GOLD; roundRect(c, 8, 8, w - 16, h - 16, 54); c.stroke();
  // header
  c.textAlign = "left"; c.textBaseline = "middle";
  c.font = "900 118px Rubik"; c.fillStyle = "#FFFFFF"; c.fillText("GRÜNDUNGSPLAN", 70, 128);
  const hw = c.measureText("GRÜNDUNGSPLAN").width;
  c.font = "900 50px Rubik"; c.fillStyle = GOLD; c.fillText("· 9 SCHRITTE", 70 + hw + 26, 136);
  const gx = 60, gy = 230, gw = w - 120, gh = h - 290, gap = 30;
  const tw = (gw - 2 * gap) / 3, th = (gh - 2 * gap) / 3;
  PLAN.forEach((label, i) => {
    const x = gx + (i % 3) * (tw + gap), y = gy + Math.floor(i / 3) * (th + gap);
    const isCur = i === 0, isNext = i === 1;
    const done = isCur ? s.done : 0;
    const glowK = isCur ? s.cur * (1 - done) : isNext ? s.next : 0;
    c.save();
    if (glowK > 0.01) { c.shadowColor = isCur ? GOLD : CYAN; c.shadowBlur = 50 * glowK * (0.8 + 0.2 * Math.sin(t * 6)); }
    c.fillStyle = done > 0.5 ? "#16452F" : isCur ? `rgba(70,56,24,${0.55 + 0.45 * s.cur})` : isNext && s.next > 0.01 ? "#173A55" : "#1A2747";
    roundRect(c, x, y, tw, th, 34); c.fill();
    c.restore();
    c.lineWidth = glowK > 0.01 || done > 0.5 ? 12 : 5;
    c.strokeStyle = done > 0.5 ? GREEN : isCur ? GOLD : isNext && s.next > 0.01 ? CYAN : "rgba(111,227,240,.28)";
    roundRect(c, x, y, tw, th, 34); c.stroke();
    const dimA = isCur || (isNext && s.next > 0.01) ? 1 : 0.5;
    c.globalAlpha = dimA;
    c.textAlign = "left"; c.textBaseline = "alphabetic";
    c.font = "900 120px Rubik"; c.fillStyle = isCur ? (done > 0.5 ? "#9BF0C2" : GOLD) : "#FFFFFF"; c.fillText(String(i + 1), x + 34, y + 138);
    const lines = label.split("\n");
    lines.forEach((ln, k) => {
      const f = fitFont(c, ln, 54, tw - 60);
      c.font = `900 ${f}px Rubik`; c.fillStyle = "#FFFFFF";
      c.fillText(ln, x + 34, y + th - 36 - (lines.length - 1 - k) * 56);
    });
    c.globalAlpha = 1;
    if (isCur && done < 0.5) {
      const qs = 1 + 0.25 * s.pulse;
      c.save(); c.translate(x + tw - 92, y + 96); c.scale(qs, qs);
      c.font = "900 150px Rubik"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = GOLD; c.fillText("?", 0, 6); c.restore();
    }
    if (isCur && done > 0.01) {
      const k = Math.min(1.25, back(done));
      c.save(); c.translate(x + tw - 92, y + 92); c.scale(k, k);
      c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(0, 0, 66, 0, 7); c.fill();
      c.fillStyle = GREEN; c.beginPath(); c.arc(0, 0, 54, 0, 7); c.fill();
      c.strokeStyle = "#FFFFFF"; c.lineWidth = 16; c.lineCap = "round"; c.beginPath(); c.moveTo(-24, 2); c.lineTo(-6, 20); c.lineTo(26, -16); c.stroke();
      c.restore();
    }
    if (isNext && s.next > 0.01) {
      c.save(); c.globalAlpha = s.next; c.font = "900 42px Rubik"; c.textAlign = "right"; c.fillStyle = CYAN; c.fillText("MORGEN", x + tw - 30, y + 84); c.restore();
    }
  });
};

// dark counter box with gold frame (odometer)
const drawCounter = (c: CanvasRenderingContext2D, w: number, h: number, value: number, label: string, pulse: number) => {
  c.clearRect(0, 0, w, h);
  c.fillStyle = "#0E1428"; roundRect(c, 0, 0, w, h, 40); c.fill();
  c.lineWidth = 14; c.strokeStyle = GOLD; roundRect(c, 7, 7, w - 14, h - 14, 34); c.stroke();
  const digits = 3, dw = 150, dh = 200, x0 = (w - digits * dw - (digits - 1) * 16) / 2, y0 = 44;
  for (let i = 0; i < digits; i++) {
    const p = Math.pow(10, digits - 1 - i);
    const raw = value / p;
    const d = Math.floor(raw) % 10;
    const frac = digits - 1 - i === 0 ? raw - Math.floor(raw) : cl(((value % p) - (p - 1)));
    const x = x0 + i * (dw + 16);
    c.save(); c.fillStyle = "#F6EEDC"; roundRect(c, x, y0, dw, dh, 18); c.fill(); c.clip();
    c.font = "900 170px Rubik"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = SKC.INK;
    c.fillText(String(d), x + dw / 2, y0 + dh / 2 + 8 - frac * dh);
    c.fillText(String((d + 1) % 10), x + dw / 2, y0 + dh / 2 + 8 + dh - frac * dh);
    const gr = c.createLinearGradient(0, y0, 0, y0 + dh); gr.addColorStop(0, "rgba(0,0,0,.35)"); gr.addColorStop(0.25, "rgba(0,0,0,0)"); gr.addColorStop(0.75, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,.35)");
    c.fillStyle = gr; c.fillRect(x, y0, dw, dh);
    c.restore();
  }
  c.font = "900 54px Rubik"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = pulse > 0.01 ? GOLD : "#F6EEDC";
  c.fillText(label, w / 2, h - 52);
};

const dieText = (text: string, bg: string, fg: string, w: number, h: number, size: number) => canvasTex(w, h, (c) => {
  dieCut(c, 6, 6, w - 12, h - 30, Math.min(60, h * 0.3), bg, 16);
  const lines = text.split("\n");
  lines.forEach((ln, k) => centerText(c, ln, w / 2, (h - 24) / 2 + (k - (lines.length - 1) / 2) * size * 1.02 + 4, size, w - 80, fg));
});

// ======================================================================================================
// 3D: room, lamps, glow ring, mascot
// ======================================================================================================
const useRoomTex = (ready: boolean) => React.useMemo(() => {
  if (!ready) return null;
  const floor = canvasTex(1024, 1024, (c) => {
    c.fillStyle = "#3B2416"; c.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 8; i++) {
      const y = i * 128;
      c.fillStyle = i % 2 ? "#432A1A" : "#382214"; c.fillRect(0, y, 1024, 124);
      c.fillStyle = "rgba(0,0,0,.45)"; c.fillRect(0, y + 124, 1024, 4);
      for (let k = 0; k < 3; k++) { const x = ((i * 397 + k * 331) % 1024); c.fillRect(x, y, 4, 124); }
      for (let k = 0; k < 14; k++) { c.fillStyle = `rgba(255,220,180,${0.03 + rnd(i * 31 + k) * 0.04})`; c.fillRect(rnd(i * 7 + k) * 1024, y + 10 + rnd(k + i) * 100, 120 + rnd(k * 3 + i) * 200, 3); }
    }
  });
  floor.wrapS = floor.wrapT = THREE.RepeatWrapping; floor.repeat.set(12, 6);
  const wall = canvasTex(1024, 1024, (c) => {
    c.fillStyle = "#18223D"; c.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#1A2542" : "#172039"; c.fillRect(i * 128, 0, 124, 1024); c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(i * 128 + 124, 0, 4, 1024); }
    c.fillStyle = "#121A30"; c.fillRect(0, 700, 1024, 324);
    c.fillStyle = "#2A3760"; c.fillRect(0, 690, 1024, 16);
  });
  wall.wrapS = wall.wrapT = THREE.RepeatWrapping; wall.repeat.set(14, 1);
  const glow = canvasTex(512, 512, (c) => {
    const g = c.createRadialGradient(256, 256, 0, 256, 256, 256);
    g.addColorStop(0, "rgba(255,140,70,.95)"); g.addColorStop(0.45, "rgba(255,107,53,.45)"); g.addColorStop(1, "rgba(255,107,53,0)");
    c.fillStyle = g; c.fillRect(0, 0, 512, 512);
  });
  const shirtLogo = canvasTex(256, 256, (c) => { c.clearRect(0, 0, 256, 256); drawBotLogo(c, 128, 128, 96); });
  const bubbleQ = canvasTex(512, 400, (c) => { dieCut(c, 10, 10, 492, 360, 150, "#FFFFFF", 0); centerText(c, "?", 256, 196, 260, 300, SKC.OR); });
  const ab1 = dieText("AB 1 STÜCK", SKC.OR, "#FFFFFF", 900, 260, 120);
  const mindest = dieText("OHNE\nMINDESTMENGE", "#FFFFFF", SKC.INK, 900, 330, 92);
  const partner = dieText("PARTNER DRUCKT", "#3E6FD8", "#FFFFFF", 1000, 230, 96);
  const stamp = canvasTex(1400, 360, (c) => {
    c.save(); c.shadowColor = "rgba(0,0,0,.4)"; c.shadowBlur = 20; c.shadowOffsetY = 10; c.fillStyle = "#FFFFFF"; roundRect(c, 10, 10, 1380, 320, 70); c.fill(); c.restore();
    c.fillStyle = SKC.OR; roundRect(c, 30, 30, 1340, 280, 54); c.fill();
    c.lineWidth = 10; c.strokeStyle = SKC.INK; roundRect(c, 30, 30, 1340, 280, 54); c.stroke();
    centerText(c, "→ FIRMENSHIRTS", 700, 176, 190, 1260, "#FFFFFF");
  });
  return { floor, wall, glow, shirtLogo, bubbleQ, ab1, mindest, partner, stamp };
}, [ready]);

const Room: React.FC<{ tex: NonNullable<ReturnType<typeof useRoomTex>> }> = ({ tex }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[120, 60]} />
      <meshStandardMaterial map={tex.floor} roughness={0.55} metalness={0.05} />
    </mesh>
    <mesh position={[0, 7, -5]} receiveShadow>
      <planeGeometry args={[120, 14]} />
      <meshStandardMaterial map={tex.wall} roughness={0.85} />
    </mesh>
  </group>
);

const Lamp: React.FC<{ p: V3; t: number; seed?: number; i?: number; r?: number }> = ({ p, t, seed = 0, i = 26, r = 13 }) => {
  const sw = 0.03 * Math.sin(t * 0.9 + seed);
  return (
    <group position={p} rotation={[0, 0, sw]}>
      <mesh position={[0, 3, 0]}><cylinderGeometry args={[0.02, 0.02, 6, 6]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 0.12, 0]}><coneGeometry args={[0.55, 0.5, 24, 1, true]} /><meshStandardMaterial color="#1E2233" metalness={0.6} roughness={0.35} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.08, 0]}><sphereGeometry args={[0.2, 16, 12]} /><meshBasicMaterial color="#FFE2B0" toneMapped={false} /></mesh>
      <pointLight position={[0, -0.4, 0]} intensity={i} distance={r} decay={1.6} color="#FFC07A" />
    </group>
  );
};

const GlowRing: React.FC<{ p: V3; r: number; t: number; tex: THREE.Texture; k?: number; col?: string }> = ({ p, r, t, tex, k = 1, col = "#FF7A3D" }) => (
  <group position={p}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <planeGeometry args={[r * 3.2, r * 3.2]} />
      <meshBasicMaterial map={tex} transparent opacity={0.55 * k} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
    </mesh>
    {[1, 1.22].map((m, i) => (
      <mesh key={i} rotation={[-Math.PI / 2, 0, t * (i ? -0.4 : 0.6)]} position={[0, 0.04 + i * 0.01, 0]}>
        <torusGeometry args={[r * m, 0.035 + 0.015 * i, 8, 96]} />
        <meshBasicMaterial color={col} toneMapped={false} transparent opacity={(0.9 - 0.35 * i) * k * (0.85 + 0.15 * Math.sin(t * 4 + i))} />
      </mesh>
    ))}
    <pointLight position={[0, 0.5, 0.6]} intensity={9 * k} distance={6} color={col} />
  </group>
);

// mascot: big voxel block with outlines, expressive eyes, blush
type Eyes = { mode: "open" | "blink" | "happy" | "glow" | "think" | "wow"; lx?: number; ly?: number };
type Pal = { body: string; dark: string; line: string; blush: string };
const ORANGE_PAL: Pal = { body: "#E87A55", dark: "#C55E3C", line: "#2A1610", blush: "#FF9C9C" };
const BLUE_PAL: Pal = { body: "#4F7FE0", dark: "#3459AD", line: "#0F1A38", blush: "#FFB0C8" };
const Out: React.FC<{ size: V3; p?: V3; color: string; line: string; o?: number; rough?: number }> = ({ size, p = [0, 0, 0], color, line, o = 0.05, rough = 0.5 }) => (
  <group position={p}>
    <mesh castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={rough} /></mesh>
    <mesh><boxGeometry args={[size[0] + o * 2, size[1] + o * 2, size[2] + o * 2]} /><meshBasicMaterial color={line} side={THREE.BackSide} /></mesh>
  </group>
);
const Bot: React.FC<{
  p: V3; t: number; s?: number; yaw?: number; pitch?: number; pal?: Pal; eyes: Eyes; armL?: number; armR?: number; hop?: number; squash?: number;
  hold?: React.ReactNode; seed?: number;
}> = ({ p, t, s = 1, yaw = 0, pitch = 0, pal = ORANGE_PAL, eyes, armL = 10, armR = 10, hop = 0, squash = 0, hold, seed = 0 }) => {
  const BW = 1.7, BH = 1.25, BD = 1.15;
  const breathe = 0.025 * Math.sin(t * 2.6 + seed);
  const sy = 1 - 0.18 * squash + breathe, sx = 1 + 0.12 * squash - breathe * 0.5;
  const blink = eyes.mode === "open" && (t * 1.1 + seed * 0.37 + 1.5) % 3.3 < 0.08;
  const mode = blink ? "blink" : eyes.mode;
  const lx = eyes.lx ?? 0, ly = eyes.ly ?? 0;
  const fz = BD / 2 + 0.012;
  const eye = (side: -1 | 1) => {
    const x = side * 0.38 + lx * 0.12, y = 0.72 + ly * 0.1;
    if (mode === "happy") {
      return (
        <group key={side} position={[x, y, fz]}>
          <mesh position={[-0.07, -0.02, 0]} rotation={[0, 0, 0.75]}><boxGeometry args={[0.2, 0.065, 0.02]} /><meshBasicMaterial color="#120A08" /></mesh>
          <mesh position={[0.07, -0.02, 0]} rotation={[0, 0, -0.75]}><boxGeometry args={[0.2, 0.065, 0.02]} /><meshBasicMaterial color="#120A08" /></mesh>
        </group>
      );
    }
    if (mode === "glow") {
      return (
        <group key={side} position={[x, y, fz]}>
          <mesh position={[0, 0, -0.002]}><boxGeometry args={[0.26, 0.4, 0.015]} /><meshBasicMaterial color="#120A08" /></mesh>
          <mesh><boxGeometry args={[0.16, 0.3, 0.02]} /><meshBasicMaterial color="#FFE9A8" /></mesh>
        </group>
      );
    }
    const hgt = mode === "blink" ? 0.04 : mode === "wow" ? 0.4 : 0.32;
    const wid = mode === "wow" ? 0.2 : 0.16;
    return (
      <group key={side} position={[x, y, fz]}>
        <mesh><boxGeometry args={[wid, hgt, 0.02]} /><meshBasicMaterial color="#120A08" /></mesh>
        {mode !== "blink" && <mesh position={[-wid * 0.22, hgt * 0.26, 0.012]}><boxGeometry args={[wid * 0.36, wid * 0.36, 0.01]} /><meshBasicMaterial color="#FFFFFF" toneMapped={false} /></mesh>}
      </group>
    );
  };
  const arm = (side: -1 | 1, deg: number) => (
    <group position={[side * (BW / 2 + 0.02), 0.62, 0.05]} rotation={[0, 0, (side * deg * Math.PI) / 180]}>
      <Out size={[0.26, 0.5, 0.36]} p={[side * 0.13, -0.18, 0]} color={pal.dark} line={pal.line} o={0.04} />
    </group>
  );
  return (
    <group position={[p[0], p[1] + hop, p[2]]} rotation={[pitch, yaw, 0]} scale={[s * sx, s * sy, s]}>
      {[-0.52, -0.18, 0.18, 0.52].map((x, i) => (
        <Out key={x} size={[0.2, 0.26, 0.3]} p={[x, 0.13 + (hop > 0.02 ? 0 : 0.015 * Math.sin(t * 9 + i)), 0.05]} color={pal.dark} line={pal.line} o={0.035} />
      ))}
      <Out size={[BW, BH, BD]} p={[0, 0.26 + BH / 2, 0]} color={pal.body} line={pal.line} o={0.05} rough={0.42} />
      {/* soft top highlight */}
      <mesh position={[0, 0.26 + BH + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.92, BD * 0.9]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.12} /></mesh>
      <group position={[0, 0.26, 0]}>
        {eye(-1)}{eye(1)}
        {mode !== "glow" && [-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.58, 0.46, fz]}><boxGeometry args={[0.2, 0.08, 0.01]} /><meshBasicMaterial color={pal.blush} transparent opacity={0.85} /></mesh>
        ))}
      </group>
      {arm(-1, armL)}
      {arm(1, armR)}
      {mode === "glow" && <pointLight position={[0, 1.0, 1.4]} intensity={2.5} distance={3} color="#FFD58A" />}
      {hold}
    </group>
  );
};

// upright T-shirt (held up at the win)
const ShirtUp: React.FC<{ p: V3; s?: number; rot?: V3; logo: THREE.Texture }> = ({ p, s = 1, rot = [0, 0, 0], logo }) => (
  <group position={p} rotation={rot} scale={s}>
    <Out size={[1.0, 1.15, 0.1]} color="#F2F0EA" line={SKC.INK} o={0.035} rough={0.9} />
    <group position={[-0.62, 0.36, 0]} rotation={[0, 0, 0.7]}><Out size={[0.42, 0.34, 0.1]} color="#E6E2D8" line={SKC.INK} o={0.035} rough={0.9} /></group>
    <group position={[0.62, 0.36, 0]} rotation={[0, 0, -0.7]}><Out size={[0.42, 0.34, 0.1]} color="#E6E2D8" line={SKC.INK} o={0.035} rough={0.9} /></group>
    <mesh position={[0, 0.54, 0.056]}><boxGeometry args={[0.36, 0.08, 0.01]} /><meshStandardMaterial color={SKC.OR} /></mesh>
    <mesh position={[0, 0.02, 0.058]}><planeGeometry args={[0.6, 0.6]} /><meshStandardMaterial map={logo} transparent /></mesh>
  </group>
);

// ======================================================================================================
// timelines: board, slots, mascot
// ======================================================================================================
const planState = (t: number): PlanS => ({
  cur: 0.6 + 0.4 * Math.max(bump(t, T.tag + 0.1, 0.5), t > T.tag ? 1 : 0),
  q: 1,
  done: cl((t - (T.das + 0.05)) / 0.4),
  next: ease((t - T.morgen) / 0.3),
  pulse: bump(t, T.tag + 0.1, 0.35) + bump(t, T.kein + 0.15, 0.35) + bump(t, T.produkt + 0.1, 0.3),
});
const FILL_AT = (i: number) => T.claude2 + 0.15 + i * 0.22;
const STRIKE = [0, 2, 3, 5];
const strikeAt = (i: number) => T.nimmt - 0.15 + STRIKE.indexOf(i) * 0.16;
const slotState = (t: number, i: number): SlotS => {
  const fill = t >= FILL_AT(i) ? 1 : 0;
  if (i === KEEP) return { fill, cross: 0, keep: back((t - T.shirts) / 0.3), dim: 0, hl: ease((t - T.arbeit) / 0.25) };
  if (i === DRUCK) return { fill, cross: 0, keep: 0, dim: ease((t - T.kleidung) / 0.3), hl: ease((t - T.druck) / 0.25) * (1 - ease((t - T.kleidung) / 0.3)) };
  return { fill, cross: cl((t - strikeAt(i)) / 0.18), keep: 0, dim: 0, hl: 0 };
};
const SLOT_W = 2.35, SLOT_H = 1.8;
const slotPos = (i: number): V3 => [XC + ((i % 3) - 1) * 2.6, [5.15, 3.2][Math.floor(i / 3)], -4.62];

// expression + arms per beat, for the mascot of the current shot
type Pose = { eyes: Eyes; armL: number; armR: number; hop: number; squash: number; yaw: number };
const hopAt = (t: number, list: [number, number][]) => list.reduce((a, [s, h]) => {
  const u = (t - s) / 0.42;
  if (u < -0.2 || u > 1.25) return a;
  if (u < 0) return { y: a.y, sq: a.sq + 0.45 * Math.sin((Math.PI * (u + 0.2)) / 0.2) };
  if (u <= 1) return { y: a.y + 4 * h * u * (1 - u), sq: a.sq - 0.3 * (1 - Math.abs(2 * u - 1)) };
  return { y: a.y, sq: a.sq + 0.5 * Math.sin((Math.PI * (u - 1)) / 0.25) };
}, { y: 0, sq: 0 });
const poseAt = (t: number, id: ShotId): Pose => {
  const h = hopAt(t, [[T.ki - 0.05, 0.18], [T.tag - 0.08, 0.5], [T.an, 0.18], [T.q300 + 0.05, 0.35], [T.shirts - 0.05, 0.75], [T.einem + 0.1, 0.25], [T.morgen, 0.25], [T.schick + 0.25, 0.3], [T.zehn, 0.3], [T.quelle + 0.05, 0.4]]);
  const base: Pose = { eyes: { mode: "open" }, armL: 12 + 6 * Math.sin(t * 2), armR: 12 + 6 * Math.sin(t * 2 + 1), hop: h.y, squash: h.sq, yaw: 0 };
  const sway = 0.05 * Math.sin(t * 1.4);
  switch (id) {
    case "hook":
      if (t > T.kein - 0.1) return { ...base, eyes: { mode: "think", lx: 0.8, ly: 1 }, armL: 70 + 10 * Math.sin(t * 6), armR: 70 + 10 * Math.sin(t * 6), yaw: 0.15 };
      if (t > T.tag - 0.15) return { ...base, eyes: { mode: "wow", ly: 0.6 }, armL: 150, armR: 150 };
      if (t > T.ich - 0.1) return { ...base, eyes: { mode: "open", lx: -0.4, ly: 0.2 }, armR: 120 + 20 * Math.sin(t * 9), yaw: -0.12 };
      return { ...base, eyes: { mode: "open", lx: 0.3, ly: 0.9 }, yaw: sway, armR: t > T.ganz ? 60 : 15 };
    case "claudeA":
    case "report":
    case "answer": {
      const look = { lx: -1, ly: 1 };
      if (id === "claudeA" && t > T.an - 0.05 && t < T.an + 0.7) return { ...base, eyes: { mode: "happy" }, yaw: -0.3 };
      if (id === "claudeA" && t > SEND - 0.1) return { ...base, eyes: { mode: "wow", ...look }, yaw: -0.35 };
      if (id === "report" && t > T.arbeit) return { ...base, eyes: { mode: "glow" }, yaw: -0.35 };
      if (id === "answer" && t > T.nirgends - 0.05) return { ...base, eyes: { mode: "think", lx: -0.6, ly: 0.8 }, yaw: -0.3 };
      return { ...base, eyes: { mode: "open", ...look }, yaw: -0.35 + sway };
    }
    case "research":
      if (t > T.q300) return { ...base, eyes: { mode: "glow" }, armL: 140, armR: 140, yaw: 0.25 };
      return { ...base, eyes: { mode: "think", lx: 0.7, ly: 1 }, armR: 100 + 15 * Math.sin(t * 7), yaw: 0.3 };
    case "partner":
      if (t > T.einem) return { ...base, eyes: { mode: "wow", lx: 0.8, ly: 0.2 }, armL: 120, armR: 140, yaw: 0.6 };
      return { ...base, eyes: { mode: "open", lx: 1, ly: 0.2 }, yaw: 0.6 + sway };
    case "win":
      if (t > T.shirts - 0.05) return { ...base, eyes: { mode: "happy" }, armL: 168, armR: 168, yaw: 0.15 };
      return { ...base, eyes: { mode: "open", lx: 0.6, ly: 0.9 }, yaw: 0.3 + sway, armR: t > T.kleidung ? 120 : 20 };
    case "hub":
      if (t > T.morgen - 0.05) return { ...base, eyes: { mode: "glow" }, armR: 140, yaw: 0 };
      return { ...base, eyes: { mode: "happy" }, armL: 150, armR: 150, yaw: 0 };
    case "end": {
      const caught = t > T.schick + 0.25;
      if (t > T.quelle - 0.05) return { ...base, eyes: { mode: "happy" }, armL: 165, armR: 165 };
      if (caught) return { ...base, eyes: { mode: "glow" }, armL: 160 + 6 * Math.sin(t * 5), armR: 160 - 6 * Math.sin(t * 5) };
      return { ...base, eyes: { mode: "open", lx: 0, ly: 1 }, armR: t > T.kw ? 50 + 15 * Math.sin(t * 8) : 15 };
    }
  }
};

// ======================================================================================================
// the world
// ======================================================================================================
type Dyn = { plan: THREE.Texture; counter: THREE.Texture; slots: THREE.Texture[] };
const World: React.FC<{ t: number; tex: NonNullable<ReturnType<typeof useRoomTex>>; dyn: Dyn; cam: ReturnType<typeof camAt> }> = ({ t, tex, dyn, cam }) => {
  const id = cam.shot.id;
  const pose = poseAt(t, id);
  const light = React.useMemo(() => new THREE.Object3D(), []);
  light.position.set(cam.look[0], 0, cam.look[2] + 1);
  light.updateMatrixWorld();
  const BotHere: React.FC<{ p: V3; s: number; yaw?: number; hold?: React.ReactNode }> = ({ p, s, yaw = 0, hold }) => (
    <Bot p={p} t={t} s={s} yaw={yaw + pose.yaw} eyes={pose.eyes} armL={pose.armL} armR={pose.armR} hop={pose.hop} squash={pose.squash} hold={hold} />
  );
  return (
    <>
      <CameraRig2 pos={cam.pos} look={cam.look} fov={cam.fov} />
      <PostFX fx={{ focus: cam.focus, aperture: isClaude(id) ? 0.55 : 0.32, maxBlur: 9, mb: [0, 0], zoom: 0, bloom: 0.3, bloomRadius: 0.55, bloomThreshold: 0.9, chroma: 0.004, grain: 0.022, vignette: 0.34, t }} />
      <EnvLight intensity={0.3} />
      <color attach="background" args={["#0B1020"]} />
      <fog attach="fog" args={["#0B1020", 18, 46]} />
      <ambientLight intensity={0.3} color="#9FB4FF" />
      <hemisphereLight args={["#B8CCFF", "#4A2C1C", 0.6]} />
      <primitive object={light} />
      <directionalLight position={[cam.look[0] + 4, 12, cam.look[2] + 12]} target={light} intensity={1.5} color="#FFD9A8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0004} />
      <directionalLight position={[cam.look[0] - 6, 6, cam.look[2] - 9]} target={light} intensity={1.1} color="#6FE3F0" />
      <Room tex={tex} />

      {/* ---------- set A: GRÜNDUNGSPLAN hub ---------- */}
      {(id === "hook" || id === "hub" || id === "end") && (
        <group>
          <Plate3D w={6.9} h={5.25} d={0.22} r={0.4} tex={dyn.plan} body="#111A33" edge={GOLD} glow={0.9} p={[XA, 4.35, -4.62]} />
          {[-3.9, 3.9].map((x) => <mesh key={x} position={[XA + x, 4.35, -4.7]}><boxGeometry args={[0.08, 5.6, 0.08]} /><meshBasicMaterial color={CYAN} toneMapped={false} /></mesh>)}
          <Lamp p={[XA - 3.6, 8.3, -1.0]} t={t} seed={1} />
          <Lamp p={[XA + 3.8, 8.0, 0.5]} t={t} seed={2} />
          <Lamp p={[XA + 0.2, 9.4, 3.2]} t={t} seed={3} i={14} />
          <GlowRing p={[XA, 0, 0.8]} r={1.3} t={t} tex={tex.glow} />
          <BotHere p={[XA, 0, 0.8]} s={1.15} hold={
            id === "hook" && t > T.kein - 0.1 ? (
              <group position={[0.95, 2.35, 0]} scale={back((t - T.kein + 0.1) / 0.35)}>
                <Plate3D w={0.95} h={0.74} d={0.08} r={0.3} tex={tex.bubbleQ} glow={0.9} rot={[0, 0, -0.12 + 0.05 * Math.sin(t * 4)]} />
                <mesh position={[-0.45, -0.52, 0]}><sphereGeometry args={[0.1, 12, 10]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
                <mesh position={[-0.62, -0.72, 0]}><sphereGeometry args={[0.06, 12, 10]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
              </group>
            ) : undefined
          } />
          {/* side props: shelf with boxes + plant silhouettes for depth */}
          {[-5.6, 5.4].map((x, k) => (
            <group key={x} position={[XA + x, 0, -3.4]}>
              <mesh position={[0, 1.4, 0]} castShadow><boxGeometry args={[1.8, 2.8, 1.0]} /><meshStandardMaterial color="#2A1C14" roughness={0.7} /></mesh>
              {[0, 1, 2].map((j) => <mesh key={j} position={[(j - 1) * 0.5, 2.95 + (j % 2) * 0.1, 0.1]} castShadow><boxGeometry args={[0.42, 0.34 + j * 0.06, 0.5]} /><meshStandardMaterial color={["#C99A6B", SKC.OR, "#E8E2D6"][(j + k) % 3]} /></mesh>)}
            </group>
          ))}
          <Burst p={[XA - 1.9, 6.0, -4.3]} t={t} at={T.das + 0.15} n={22} speed={3} size={0.07} seed={51} colors={[GREEN, "#FFFFFF", GOLD]} />
          <Motes t={t} center={[XA, 4, 0]} size={[14, 8, 8]} n={70} seed={3} color="#FFE7C2" s={0.035} />
        </group>
      )}

      {/* ---------- set C: product slots + counter (research / win) ---------- */}
      {(id === "research" || id === "win") && (
        <group>
          <mesh position={[XC, 4.2, -4.82]} receiveShadow><boxGeometry args={[8.6, 4.6, 0.2]} /><meshStandardMaterial color="#202C50" roughness={0.8} /></mesh>
          <mesh position={[XC, 4.2, -4.9]}><boxGeometry args={[8.9, 4.9, 0.1]} /><meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.4} /></mesh>
          {CANDS.map((_, i) => {
            const s = slotState(t, i);
            const fillK = back((t - FILL_AT(i)) / 0.35);
            const p = slotPos(i);
            const keepK = i === KEEP ? s.keep : 0;
            const sc = s.fill ? Math.max(0.001, Math.min(1.2, fillK)) * (1 + 0.1 * keepK) : 1;
            return (
              <group key={i}>
                <Plate3D w={SLOT_W} h={SLOT_H} d={s.fill ? 0.1 : 0.02} r={0.3} tex={dyn.slots[i]} body={s.fill ? "#FFFFFF" : "#1A2547"} edge={s.fill ? SKC.INK : "#1A2547"} glow={s.fill ? 0.3 : 0.8}
                  p={[p[0], p[1], p[2] + 0.12 + 0.35 * keepK]} rot={[0, 0, (rnd(i + 3) - 0.5) * 0.08 + 0.02 * Math.sin(t * 1.5 + i)]} s={sc} />
                {s.fill > 0 && <Burst p={[p[0], p[1], p[2] + 0.4]} t={t} at={FILL_AT(i)} n={10} speed={2} size={0.08} seed={i + 20} colors={[CYAN, "#FFFFFF", GOLD]} />}
              </group>
            );
          })}
          {/* green check bar across the keeper */}
          {(() => {
            const k = ease((t - T.shirts - 0.1) / 0.35);
            if (k <= 0.001) return null;
            const p = slotPos(KEEP);
            return (
              <group position={[p[0], p[1] + SLOT_H / 2 + 0.32, p[2] + 0.6]}>
                <mesh scale={[k, 1, 1]}><boxGeometry args={[SLOT_W + 0.4, 0.09, 0.06]} /><meshBasicMaterial color={GREEN} toneMapped={false} /></mesh>
                <mesh scale={back((t - T.shirts - 0.25) / 0.3)}><cylinderGeometry args={[0.3, 0.3, 0.08, 32]} /><meshBasicMaterial color={GREEN} toneMapped={false} /></mesh>
              </group>
            );
          })()}
          {/* counter */}
          {(() => {
            const k = back((t - (T.claude2 - 0.1)) / 0.4);
            if (id === "win") return null;
            return <Plate3D w={3.2} h={1.6} d={0.2} r={0.24} tex={dyn.counter} body="#0E1428" edge={GOLD} glow={1.0} p={[XC + 1.9, 7.55 - (1 - Math.min(1, k)) * 3, -4.3]} rot={[0, 0, 0.03 * Math.sin(t * 1.2)]} s={Math.max(0.001, Math.min(1.1, k))} />;
          })()}
          {/* stamp */}
          {(() => {
            const k = back((t - (T.shirts + 0.05)) / 0.3);
            if (k <= 0.001) return null;
            return <Plate3D w={4.2} h={1.08} d={0.1} r={0.3} tex={tex.stamp} glow={0} p={[XC, 7.45, -4.0]} rot={[0, 0, -0.05]} s={Math.max(0.001, 2.2 - 1.2 * Math.min(1, k))} />;
          })()}
          <Burst p={[XC + 2.6, 2.4, -3.8]} t={t} at={T.shirts + 0.08} n={44} speed={4.2} size={0.16} up={2.4} seed={61} life={1.6} colors={[SKC.OR, GOLD, "#FFFFFF", GREEN, CYAN]} />
          <Burst p={[XC - 1.4, 3.0, 1.5]} t={t} at={T.shirts + 0.12} n={30} speed={3.6} size={0.12} up={2.2} seed={62} life={1.5} colors={[SKC.OR, GOLD, "#FFFFFF", GREEN]} />
          <Lamp p={[XC - 2.4, 8.4, -1.2]} t={t} seed={4} />
          <Lamp p={[XC + 2.8, 8.1, -0.2]} t={t} seed={5} />
          <GlowRing p={[XC - 1.2, 0, -0.4]} r={1.15} t={t} tex={tex.glow} />
          <BotHere p={[XC - 1.2, 0, -0.4]} s={1.05} yaw={0.15} hold={
            id === "research" && t < T.q300 ? (
              <group position={[1.0, 2.25, 0]} scale={back((t - (SEND + 0.35)) / 0.35)}>
                <Plate3D w={0.9} h={0.7} d={0.08} r={0.3} tex={tex.bubbleQ} glow={0.9} rot={[0, 0, -0.12 + 0.05 * Math.sin(t * 4)]} />
              </group>
            ) : id === "win" && t > T.shirts - 0.05 ? (
              <ShirtUp p={[0, 2.25 + 0.12 * back((t - T.shirts + 0.05) / 0.35), 0.35]} s={Math.max(0.001, back((t - T.shirts + 0.05) / 0.35)) * 0.72} rot={[0, 0, 0.06 * Math.sin(t * 5)]} logo={tex.shirtLogo} />
            ) : undefined
          } />
          <Motes t={t} center={[XC, 4, 0]} size={[14, 8, 8]} n={70} seed={5} color="#FFE7C2" s={0.035} />
        </group>
      )}

      {/* ---------- set D: partner prints ---------- */}
      {id === "partner" && (() => {
        const running = t > T.druckt - 0.1;
        const drop = cl((t - T.einem + 0.15) / 0.5);
        const M: V3 = [XD + 1.3, 0, -2.6];
        return (
          <group>
            <PrintMachine p={M} t={t} s={0.95} yaw={-0.35} tint="#E9EEF7" accent="#1C2440" running={running} />
            {drop > 0 && (
              <ShirtUp p={[M[0] - 0.9 + 0.2 * drop, 2.7 - 0.9 * ease(drop), M[2] + 1.6]} s={0.9} rot={[0, -0.3, 0.1 * Math.sin(t * 4)]} logo={tex.shirtLogo} />
            )}
            <Burst p={[M[0] - 0.8, 2.0, M[2] + 1.7]} t={t} at={T.einem + 0.3} n={18} speed={2.8} seed={41} colors={["#FFFFFF", CYAN, SKC.BLUE, GOLD]} />
            <Bot p={[XD + 2.9, 0, -2.0]} t={t} s={0.9} yaw={-0.7} pal={BLUE_PAL} eyes={{ mode: running ? "happy" : "open", lx: -1 }} armL={120 + 25 * Math.sin(t * 9)} armR={40 + 30 * Math.sin(t * 7)} seed={7} />
            <GlowRing p={[XD + 2.9, 0, -2.0]} r={0.95} t={t} tex={tex.glow} col="#6FB8FF" />
            <Plate3D w={3.2} h={0.74} d={0.08} r={0.3} tex={tex.partner} glow={0.3} p={[XD + 0.8, 6.4 + 0.06 * Math.sin(t * 2), -2.6]} rot={[0, 0, 0.04]} s={Math.max(0.001, back((t - (T.partner - 0.05)) / 0.35))} />
            <Plate3D w={2.3} h={0.66} d={0.08} r={0.3} tex={tex.ab1} glow={0.3} p={[XD - 0.2, 5.2, -1.4]} rot={[0, 0.1, -0.08]} s={Math.max(0.001, back((t - (T.ab - 0.05)) / 0.35))} />
            <Plate3D w={2.3} h={0.84} d={0.08} r={0.3} tex={tex.mindest} glow={0.3} p={[XD + 1.9, 4.45, -1.2]} rot={[0, -0.1, 0.06]} s={Math.max(0.001, back((t - (T.einem + 0.05)) / 0.35))} />
            <Lamp p={[XD + 1.0, 8.2, -1.6]} t={t} seed={6} i={30} />
            <Lamp p={[XD - 2.6, 8.6, 0.6]} t={t} seed={7} i={16} />
            <GlowRing p={[XD - 0.3, 0, -0.2]} r={1.05} t={t} tex={tex.glow} />
            <BotHere p={[XD - 0.3, 0, -0.2]} s={0.95} yaw={0.3} />
            <Motes t={t} center={[XD, 4, 0]} size={[14, 8, 8]} n={60} seed={7} color="#FFE7C2" s={0.035} />
          </group>
        );
      })()}

      {/* ---------- set B: wall behind the Claude window, mascot peeks in from the bottom ---------- */}
      {isClaude(id) && (
        <group>
          <Lamp p={[XB - 2.6, 7.6, 0.4]} t={t} seed={8} i={34} />
          <Lamp p={[XB + 2.8, 7.4, -1.8]} t={t} seed={9} i={20} />
          <mesh position={[XB, 0.95, 3.2]} castShadow receiveShadow><boxGeometry args={[9, 0.22, 2.2]} /><meshStandardMaterial color="#5A3A24" roughness={0.6} /></mesh>
          <mesh position={[XB, 1.07, 3.2]}><boxGeometry args={[9.04, 0.03, 2.24]} /><meshStandardMaterial color="#7A5034" roughness={0.5} /></mesh>
          <GlowRing p={[XB + 1.2, 1.08, 3.6]} r={0.9} t={t} tex={tex.glow} k={0.7} />
          <BotHere p={[XB + 1.2, 1.08, 3.6]} s={0.8} yaw={0} />
          <Motes t={t} center={[XB, 4, 0]} size={[12, 8, 8]} n={50} seed={9} color="#FFE7C2" s={0.03} />
        </group>
      )}
    </>
  );
};

// ======================================================================================================
// 2D: HUD, hook, Claude window, end card
// ======================================================================================================
const HUD: React.FC<{ t: number }> = ({ t }) => {
  const done = back((t - (T.shirts + 0.1)) / 0.35);
  const next = ease((t - T.morgen) / 0.3);
  const pop = 1 + 0.18 * bump(t, T.tag + 0.05, 0.3);
  return (
    <>
      <div style={{ position: "absolute", left: 34, top: 40, width: 150, height: 150, borderRadius: 30, background: "#0E1428", border: `7px solid ${GOLD}`, boxShadow: "0 8px 0 rgba(0,0,0,.45), 0 0 30px rgba(232,182,76,.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(-4deg) scale(${pop})` }}>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: "#F6EEDC", letterSpacing: 3, marginTop: 2 }}>TAG</div>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 92, color: GOLD, lineHeight: 0.9, marginTop: -2 }}>1</div>
      </div>
      <div style={{ position: "absolute", right: 34, top: 40, display: "grid", gridTemplateColumns: "repeat(3, 40px)", gap: 6, padding: 10, background: "#0E1428", border: `5px solid ${GOLD}88`, borderRadius: 16, boxShadow: "0 6px 0 rgba(0,0,0,.4)" }}>
        {PLAN.map((_, i) => {
          const cur = i === 0, isNext = i === 1 && next > 0.01;
          const bg = cur ? (done > 0.5 ? GREEN : GOLD) : isNext ? CYAN : "rgba(255,255,255,.1)";
          return (
            <div key={i} style={{ width: 40, height: 40, borderRadius: 8, background: bg, color: cur || isNext ? "#10162A" : "rgba(255,255,255,.35)", fontFamily: pixelFont, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", transform: cur ? `scale(${1 + 0.25 * bump(t, T.shirts + 0.2, 0.35)})` : undefined, boxShadow: cur ? `0 0 ${14 + 10 * Math.sin(t * 5)}px ${done > 0.5 ? GREEN : GOLD}` : undefined }}>
              {cur && done > 0.5 ? (
                <svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : i + 1}
            </div>
          );
        })}
      </div>
    </>
  );
};

const stroke = (px: number, col = "#0B1020") => ({ WebkitTextStroke: `${px}px ${col}`, paintOrder: "stroke fill" as const });
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const pulse = (a: number, d = 0.3) => 1 + 0.08 * bump(t, a + 0.08, d);
  const wig = Math.sin((t - T.ganz) * 16) * 4 * Math.exp(-Math.max(0, t - T.ganz) * 3) * (t > T.ganz ? 1 : 0);
  const fl = (s: number) => Math.sin(t * 2.2 + s) * 4;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center" }}>
      <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 132, lineHeight: 0.98, color: "#FFFFFF", letterSpacing: -1, ...stroke(16), textShadow: "0 10px 0 #0B1020, 0 0 40px rgba(0,0,0,.6)", transform: `translateY(${fl(0)}px)` }}>
        <span style={{ display: "inline-block", transform: `scale(${pulse(T.ki)})` }}>KI</span> gründet
        <br />
        <span style={{ display: "inline-block", color: "#FF8A57", transform: `scale(${pulse(T.unt, 0.4)})` }}>eine Firma.</span>
      </div>
      <div style={{ display: "inline-block", marginTop: 26, padding: "10px 36px 14px", borderRadius: 26, background: "#FFFFFF", border: `7px solid #0B1020`, boxShadow: "0 9px 0 rgba(0,0,0,.5)", fontFamily: pixelFont, fontWeight: 800, fontSize: 70, color: "#0B1020", transform: `rotate(${-3 + wig}deg) translateY(${fl(1)}px)` }}>
        Ganz alleine.
      </div>
    </div>
  );
};

// ---------- Claude window (paper sheet pinned in the room) ----------
const WIN_X = 40, WIN_Y = 214, WIN_W = 1000, WIN_H = 1166;
const PROMPT_FS = 46, PROMPT_LH = 1.28, PROMPT_W = WIN_W - 116 - 30;
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
const MENU_H = MENU_PAD * 2 + PLUS_MENU.filter((x) => x !== "sep").length * MENU_ROW + PLUS_MENU.filter((x) => x === "sep").length * MENU_SEP;
const A_TOP = 860, A_BOT = 1120;
const MENU_TOP = A_TOP - 16 - MENU_H;
const B_TOP = 140, B_BOT = 1130;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const inputGeom = (t: number) => {
  const k2 = inOut((t - (T.zweitens - 0.1)) / 0.45);
  return { top: lerp(A_TOP, B_TOP, k2), bot: lerp(A_BOT, B_BOT, k2) };
};
const plusHit = inputPlus(A_BOT);
const sendHit = { x: WIN_W - 28 - 18 - 48, y: B_BOT - 14 - 39 };
const researchY = menuRowY("Research", MENU_TOP);
const CLICKS: Click[] = [
  { t: T.plus, n: 1, x: plusHit.x, y: plusHit.y, mx: plusHit.x + 44, my: plusHit.y - 31, until: T.research + 0.08 },
  { t: T.research + 0.08, n: 2, x: 250, y: researchY, mx: 520, my: researchY - 31, until: T.an + 0.35 },
  { t: T.an + 0.7, n: 9, x: 860, y: 1400, mx: 0, my: 0, until: 0 }, // park the cursor below the sheet (clipped)
  { t: SEND, n: 3, x: sendHit.x, y: sendHit.y, mx: sendHit.x - 120, my: sendHit.y - 128, until: 99 },
];
const cursorVis = (t: number) => Math.max(cl((t - T.erstens) / 0.2) * (1 - cl((t - T.an - 0.45) / 0.2)), cl((t - (T.kaufen - 0.75)) / 0.2));

const Tape: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 150, height: 46, background: "rgba(240,226,190,.82)", boxShadow: "0 2px 6px rgba(0,0,0,.25)", transform: `rotate(${rot}deg)`, borderLeft: "3px dashed rgba(0,0,0,.08)", borderRight: "3px dashed rgba(0,0,0,.08)" }} />
);

const ClaudeWindow: React.FC<{ t: number; id: ShotId; u: number }> = ({ t, id, u }) => {
  const settle = 1 + 0.025 * (1 - ease(u / 0.4));
  const g = inputGeom(t);
  const typed = typedAt(PROMPT_KEYS, t);
  const step = t < T.zweitens - 0.05 ? 1 : t < T.drittens - 0.05 ? 2 : 3;
  const promptMarks = [
    { find: "kein eigenes Lager", at: T.keinL, color: "yellow" as const },
    { find: "keine eigene Maschine", at: T.keineM, color: "yellow" as const },
    { find: "kleine Betriebe mit weniger als zehn Leuten", at: T.kleine, color: "yellow" as const },
    { find: "Recherchiere:", at: T.frag, color: "blue" as const },
    { find: "immer wieder", at: T.immer, color: "orange" as const },
  ];
  const complete = <span style={{ color: INK }}>Research complete • <b style={{ color: CLAUDE_ORANGE }}>314</b> sources • 5m 30s</span>;
  return (
    <div style={{ position: "absolute", left: WIN_X, top: WIN_Y, width: WIN_W, height: WIN_H, transform: `scale(${settle}) rotate(-0.6deg)`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, boxShadow: "0 30px 60px rgba(0,0,0,.55), 0 0 0 7px #0B1020, 0 0 70px rgba(255,190,120,.25)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden" }}>
        <CrumpledPaper w={WIN_W} h={WIN_H} strength={0.45}>
          {id === "claudeA" && (
            <>
              {t < T.zweitens + 0.4 && (() => {
                const k = back((t - (T.heute - 0.05)) / 0.45) * (1 - ease((t - T.zweitens + 0.05) / 0.3));
                return (
                  <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, k * 1.4), transform: `scale(${0.6 + 0.4 * k})` }}>
                    <Img src={staticFile("logos/claude.svg")} style={{ width: 190, height: 190, transform: `rotate(${(t - T.claude) * 25}deg)` }} />
                    <div style={{ marginTop: 22, fontFamily: claudeSerif, fontWeight: 500, fontSize: 70, color: INK }}>How can I help you today?</div>
                  </div>
                );
              })()}
              <InputCard top={g.top} bottom={g.bot} t={t} focus={t > T.schreib - 0.3 && t < SEND} fontSize={PROMPT_FS}
                showPlaceholder={typed === 0} placeholder="How can I help you today?"
                research={cl((t - (T.research + 0.12)) / 0.3)} plusPress={bump(t, T.plus + 0.04, 0.14)} sendPress={bump(t, SEND + 0.04, 0.14)} sent={t > SEND}>
                {typed > 0 ? (() => {
                  const visible = Math.floor((g.bot - g.top - 126) / (PROMPT_FS * PROMPT_LH));
                  const ln = promptLineOf()[Math.min(PROMPT.length - 1, typed - 1)];
                  const scroll = Math.max(0, ln - visible + 1) * PROMPT_FS * PROMPT_LH;
                  return <div style={{ transform: `translateY(${-scroll}px)`, fontSize: PROMPT_FS, lineHeight: PROMPT_LH }}><MarkedText text={PROMPT} n={typed} t={t} marks={promptMarks} caret={t < SEND} /></div>;
                })() : null}
              </InputCard>
              <PlusMenu t={t} open={T.plus + 0.1} close={T.an + 0.22} top={MENU_TOP} hot="Research" hotAt={T.research - 0.25} onAt={T.research + 0.12} />
            </>
          )}
          {id === "report" && (
            <div style={{ position: "absolute", left: 34, right: 34, top: 140 }}>
              <ResearchCard t={t} title={R_TITLE} running={false} compact status={complete} />
              <div style={{ marginTop: 30, fontFamily: claudeSerif, fontWeight: 600, fontSize: 54, lineHeight: 1.12, color: INK }}>{REPORT_TITLE}</div>
              <div style={{ marginTop: 26, fontFamily: pixelFont, fontWeight: 500, fontSize: 48, lineHeight: 1.3, color: INK }}>
                <MarkedText text={REPORT_P} t={t} dim={0.5 * ease((t - T.arbeit - 0.2) / 0.3)} marks={[
                  { find: "Drucksachen", at: T.druck, color: "yellow" },
                  { find: "Arbeitskleidung mit Logo", at: T.arbeit, color: "orange" },
                ]} />
              </div>
            </div>
          )}
          {id === "answer" && (
            <div style={{ position: "absolute", left: 34, right: 34, top: 140 }}>
              <ResearchCard t={t} title={R_TITLE} running={false} compact status={complete} />
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginTop: 30 }}>
                <Img src={staticFile("logos/claude.svg")} style={{ width: 56, height: 56, marginTop: 6 }} />
                <div style={{ fontFamily: pixelFont, fontWeight: 500, fontSize: 45, lineHeight: 1.3, color: INK }}>
                  <MarkedText text={ANSWER} t={t} dim={0.55 * ease((t - T.nirgends + 0.1) / 0.3)} marks={[
                    { find: "Wie oft Kleinstbetriebe diese Produkte nachbestellen", at: T.wie, color: "yellow" },
                    { find: "in keiner Statistik gefunden", at: T.nirgends, color: "red" },
                  ]} />
                </div>
              </div>
            </div>
          )}
          <WindowBar t={t} enter={-1} top={24} chip={id === "claudeA" && t > T.erstens - 0.1
            ? <StepChipBar key={step} t={t} n={step} label={["RESEARCH", "REGELN", "FRAGE"][step - 1]} at={[T.erstens, T.zweitens, T.drittens][step - 1]} done={SEND} />
            : id !== "claudeA" ? <div style={{ padding: "6px 20px", borderRadius: 30, background: GREEN, border: `5px solid ${INK}`, fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: "#fff" }}>Research</div> : null} />
          {id === "claudeA" && (
            <div style={{ position: "absolute", inset: 0, opacity: cursorVis(t) }}>
              <ClickPath t={t} clicks={CLICKS} start={{ t: T.erstens, x: 560, y: 1300 }} />
            </div>
          )}
        </CrumpledPaper>
      </div>
      <Tape x={-40} y={-14} rot={-32} />
      <Tape x={WIN_W - 110} y={-14} rot={30} />
    </div>
  );
};

// re-hook (v4 content): bottom-left, below the sheet, never over Claude text
const ReHook: React.FC<{ t: number }> = ({ t }) => {
  const a = T.zweitens + 0.3, b = SEND - 0.1;
  const kin = back((t - a) / 0.45), kout = ease((t - b) / 0.25);
  if (kin <= 0.001 || kout >= 0.999) return null;
  const k = Math.max(0, kin) * (1 - kout);
  return (
    <div style={{ position: "absolute", left: 40, top: 1530, width: 470, transform: `rotate(${-4 + Math.sin(t * 2.2) * 1.2}deg) scale(${k})`, transformOrigin: "30% 50%" }}>
      <div style={{ background: "#FFFFFF", borderRadius: 30, padding: 10, boxShadow: "0 12px 0 rgba(0,0,0,.45)" }}>
        <div style={{ background: "#FFF6E8", border: `5px solid ${INK}`, borderRadius: 22, padding: "12px 20px 16px", textAlign: "center" }}>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 46, lineHeight: 1.06, color: INK }}>Alle 3 Fragen<br />zum Kopieren</div>
          <div style={{ marginTop: 10, display: "inline-block", padding: "2px 22px 6px", borderRadius: 16, background: CLAUDE_ORANGE, border: `4px solid ${INK}`, fontFamily: pixelFont, fontWeight: 800, fontSize: 42, color: "#fff" }}>→ am Ende</div>
        </div>
      </div>
    </div>
  );
};

// ---------- end card: die-cut stickers in the lit world ----------
const Die: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; inner?: React.CSSProperties; pad?: number }> = ({ children, style, inner, pad = 10 }) => (
  <div style={{ position: "absolute", background: "#FFFFFF", borderRadius: 30, padding: pad, boxShadow: "0 12px 0 rgba(0,0,0,.45), 0 20px 40px rgba(0,0,0,.35)", ...style }}>
    <div style={{ borderRadius: 22, border: `5px solid ${INK}`, ...inner }}>{children}</div>
  </div>
);
const CopyIcon: React.FC<{ on: number }> = ({ on }) => (
  <div style={{ width: 70, height: 70, borderRadius: 18, border: `5px solid ${INK}`, background: on > 0.5 ? GREEN : "#F6F1E8", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.2 * Math.sin(Math.PI * Math.min(1, on))})`, flexShrink: 0 }}>
    {on > 0.5
      ? <svg width="38" height="38" viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      : <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.4" strokeLinejoin="round"><rect x="8" y="8" width="12" height="12" rx="2.5" /><path d="M16 8 V6 a2 2 0 0 0 -2 -2 H6 a2 2 0 0 0 -2 2 v8 a2 2 0 0 0 2 2 h2" /></svg>}
  </div>
);
const BOT_SCREEN = { x: 540, y: 1560 }; // where the mascot's hands are on screen in the end shot
const EndCard: React.FC<{ t: number; keyword: string }> = ({ t, keyword }) => {
  const k0 = T.komm - 0.15;
  const head = back((t - k0) / 0.4);
  const field = back((t - (k0 + 0.15)) / 0.4);
  const typedN = Math.max(0, Math.min(keyword.length, Math.floor((t - (T.kw - 0.05)) * 14)));
  const typed = keyword.toUpperCase().slice(0, typedN);
  const sentAt = T.kw + 0.05 + keyword.length / 14 + 0.25;
  const sent = t > sentAt;
  const sentK = back((t - sentAt) / 0.35);
  const planeA = T.und - 0.05, planeB = T.schick + 0.25;
  const pk = inOut((t - planeA) / (planeB - planeA));
  const fl = (s: number) => Math.sin(t * 2 + s) * 4;
  const seg = (a: number) => cl((t - a) / 0.2);
  const segStyle = (a: number, hot = false): React.CSSProperties => ({ opacity: 0.3 + 0.7 * seg(a), color: hot && seg(a) > 0.5 ? "#FF9A6A" : "#fff", display: "inline-block", transform: `scale(${1 + 0.12 * bump(t, a + 0.12, 0.3)})` });
  const resK = back((t - (T.fuenf - 0.15)) / 0.4);
  return (
    <>
      {/* headline */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 104, color: "#FFFFFF", ...stroke(14), textShadow: "0 9px 0 #0B1020", transform: `scale(${Math.max(0, head)}) translateY(${fl(0)}px)` }}>KOMMENTIERE</div>
      {/* comment field */}
      <Die style={{ left: 50, right: 50, top: 350, transform: `scale(${Math.max(0, field)}) rotate(-1.5deg)` }} inner={{ background: "#FFFFFF", height: 132, display: "flex", alignItems: "center", gap: 20, padding: "0 20px", borderColor: sent ? GREEN : INK }}>
        <div style={{ width: 88, height: 88, borderRadius: 44, background: "#E4DCCD", border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 32, color: INK }}>DU</div>
        <div style={{ flex: 1, fontFamily: pixelFont, fontWeight: 800, fontSize: 84, color: typed ? CLAUDE_ORANGE : "#A39C90", letterSpacing: 2 }}>
          {typed || <span style={{ fontSize: 50 }}>Kommentar …</span>}{!sent && typed && Math.sin(t * 12) > 0 ? <span style={{ color: INK }}>|</span> : ""}
        </div>
        <div style={{ height: 88, padding: "0 22px", borderRadius: 44, background: sent ? GREEN : CLAUDE_ORANGE, border: `5px solid ${INK}`, display: "flex", alignItems: "center", gap: 10, color: "#fff", fontFamily: pixelFont, fontWeight: 800, fontSize: 38, transform: `scale(${1 + 0.15 * bump(t, sentAt, 0.25)})` }}>
          {sent ? <>✓ gesendet</> : <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round"><path d="M21 3 L10 14" /><path d="M21 3 L14.5 21 L10 14 L3 9.5 Z" /></svg>}
        </div>
      </Die>
      {/* paper plane "DM" flies from the comment to the mascot */}
      {sentK > 0.001 && t < planeB + 0.05 && (() => {
        const x0 = 860, y0 = 420, x1 = BOT_SCREEN.x, y1 = BOT_SCREEN.y - 120;
        const x = lerp(x0, x1, pk) + Math.sin(pk * Math.PI) * 260, y = lerp(y0, y1, pk) - Math.sin(pk * Math.PI) * 120;
        return (
          <div style={{ position: "absolute", left: x - 70, top: y - 50, transform: `rotate(${30 + pk * 70}deg) scale(${Math.min(1, sentK) * (1 - 0.3 * pk)})`, display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="120" height="100" viewBox="0 0 24 20"><path d="M1 9 L23 1 L16 19 L11 12 Z" fill="#FFFFFF" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" /><path d="M11 12 L23 1" stroke={INK} strokeWidth="1.2" /></svg>
            <div style={{ padding: "4px 14px", borderRadius: 14, background: "#3E6FD8", border: `4px solid ${INK}`, fontFamily: pixelFont, fontWeight: 800, fontSize: 34, color: "#fff" }}>DM</div>
          </div>
        );
      })()}
      {/* the three question cards fly out of the mascot's hands */}
      {FRAGEN.map((f, i) => {
        const a = T.drei + i * 0.22;
        const k = back((t - a) / 0.45);
        if (k <= 0.001) return null;
        const ty = 520 + i * 196;
        const fy = lerp(BOT_SCREEN.y - 200, ty, Math.min(1, k)), fx = lerp(BOT_SCREEN.x - 490, 50, Math.min(1, k));
        const copied = cl((t - (T.kopieren + 0.05 + i * 0.12)) / 0.15);
        return (
          <Die key={f.n} style={{ left: fx, width: 980, top: fy, transform: `rotate(${(i - 1) * 1.2 + (1 - Math.min(1, k)) * 10}deg) scale(${0.5 + 0.5 * k})`, transformOrigin: "50% 50%" }}
            inner={{ background: "#FFFDF8", height: 158, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 18, padding: "10px 20px 10px 24px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ padding: "2px 16px 4px", borderRadius: 14, background: CLAUDE_ORANGE, border: `4px solid ${INK}`, color: "#fff", fontFamily: pixelFont, fontWeight: 800, fontSize: 34 }}>FRAGE {f.n}</div>
                <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 48, color: INK }}>{f.label}</div>
              </div>
              <div style={{ marginTop: 6, fontFamily: pixelFont, fontWeight: 600, fontSize: 32, lineHeight: 1.12, color: "#4E4840" }}>{f.snip}</div>
            </div>
            <CopyIcon on={copied} />
          </Die>
        );
      })}
      {/* result line */}
      {resK > 0.001 && (
        <div style={{ position: "absolute", left: 50, right: 50, top: 1130, height: 150, boxSizing: "border-box", borderRadius: 28, background: "#0E1428", border: `7px solid ${GOLD}`, boxShadow: "0 10px 0 rgba(0,0,0,.5), 0 0 40px rgba(232,182,76,.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, fontFamily: pixelFont, fontWeight: 800, color: "#fff", transform: `scale(${resK}) rotate(-1deg)`, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 58 }}><span style={segStyle(T.zehn, true)}>→ 10 Ideen für dein Business</span></div>
          <div style={{ fontSize: 44, display: "flex", gap: 14 }}>
            <span style={segStyle(T.quelle, true)}>mit Quelle</span><span style={{ opacity: 0.6 }}>·</span><span style={segStyle(T.fuenf)}>in 5 Min</span>
          </div>
        </div>
      )}
    </>
  );
};

// ======================================================================================================
// composition
// ======================================================================================================
export const FirmaShirtsTag1V5: React.FC<FirmaShirtsTag1V5Props> = ({ keyword = "Produkt", cover = false }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ready = useFontsReady(["800 70px Rubik", "900 70px Rubik", "600 40px Rubik", `800 40px ${pixelFont}`]);
  useImage(staticFile("logos/claude.svg"));
  const tex = useRoomTex(ready);
  const ps = planState(t);
  const plan = useDyn(1600, 1220, (c) => ready && drawPlan(c, 1600, 1220, ps, t));
  const qv = t < T.q300 ? 169 * ease((t - T.claude2 + 0.1) / 0.6) : 169 + 145 * ease((t - T.q300) / 0.45);
  const counter = useDyn(800, 400, (c) => ready && drawCounter(c, 800, 400, Math.max(0, qv), "QUELLEN", bump(t, T.quellen, 0.4)));
  const s0 = useDyn(600, 460, (c) => ready && drawSlot(c, 600, 460, CANDS[0], slotState(t, 0), t));
  const s1 = useDyn(600, 460, (c) => ready && drawSlot(c, 600, 460, CANDS[1], slotState(t, 1), t));
  const s2 = useDyn(600, 460, (c) => ready && drawSlot(c, 600, 460, CANDS[2], slotState(t, 2), t));
  const s3 = useDyn(600, 460, (c) => ready && drawSlot(c, 600, 460, CANDS[3], slotState(t, 3), t));
  const s4 = useDyn(600, 460, (c) => ready && drawSlot(c, 600, 460, CANDS[4], slotState(t, 4), t));
  const s5 = useDyn(600, 460, (c) => ready && drawSlot(c, 600, 460, CANDS[5], slotState(t, 5), t));
  const cam = camAt(t);
  const id = cam.shot.id;
  return (
    <AbsoluteFill style={{ background: "#0B1020" }}>
      {tex && (
        <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
          <World t={t} tex={tex} dyn={{ plan, counter, slots: [s0, s1, s2, s3, s4, s5] }} cam={cam} />
        </ThreeCanvas>
      )}
      {isClaude(id) && <ClaudeWindow t={t} id={id} u={cam.shot.u} />}
      {id === "claudeA" && !cover && <ReHook t={t} />}
      {id === "hook" && <Hook t={t} />}
      {id === "end" && <EndCard t={t} keyword={keyword} />}
      <HUD t={t} />
      {!cover && <PillCaptions words={CAPTIONS} theme={THEMES.night} y={1400} />}
    </AbsoluteFill>
  );
};
