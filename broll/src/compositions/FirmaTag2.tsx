// Superkind baut eine Firma · Folge "Kunde" (intern Tag 2, Slot 2026-10-28 18:00) · Kopie von FirmaShirtsTag1V7 (firma-design)
// Neu: Eröffnung "Wie viel Umsatz macht ein Unternehmen ... 100 Tage", kein gesprochenes "Tag N", Badge TAG 1, Umsatz-Zähler nur bei umsatz > 0.
// --- Kopf von Tag 1 v7 ---
// v7 = v6 bis SEND unverändert; ab SEND fester roter Faden (Pius: "verliert ab der Hälfte an Übersicht, alles zu schnell"):
//  C Suche (Wand füllt sich) → D Entscheidung auf der Wand → E Pfeil-Kette Kunde → Partner druckt 1 Stück → Paket direkt zum Kunden (≈4 s)
//  → F Wahl auf der Wand → G offene Frage als Karte → Hub/CTA. Stimme mit Pausen (voice-v7, words-v7), 43,7 s.
// v6 = v5, nur der Hook (0 bis T.heute) neu: Pius "in den ersten Sekunden passiert visuell nahezu nichts".
//  4 ruhige Einstellungen mit harten Schnitten, alle 0,25-0,45 s ein neues Ereignis auf dem gesprochenen Wort:
//  Bot fällt rein + Staub, Stuhl rollt weg, GANZ-ALLEINE-Stempel, Kachel-Kaskade, Hebel + Lampen, TAG-1-Slam, leere Kiste.
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
import wordsRaw from "../../public/firma-tag2/words.json";

const W = 1080, H = 1920;
export type FirmaTag2Props = { keyword?: string; cover?: boolean };
export const FIRMA_TAG2_SECONDS = 46.9;

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
  tag: at("aus", 4.5), kein: at("fehlt", 8.0), kunde0: at("Kunde", 9.0),
  heute: at("Heute", 10.38), claude: at("ihn", 10.88),
  plus: at("Plus", 11.48), research: at("Research", 11.88), an: at("an", 12.38),
  ersten: at("ersten", 12.68), bericht: at("Bericht", 12.98), an2: at("anhängen", 13.28),
  frag: at("Frag", 13.88), drei: at("Welche", 14.48), branchen: at("Branchen", 14.88), wie: at("wie", 16.28), nachb: at("nach", 16.98),
  claude2: at("Claude", 17.88), q260: at("260", 18.68), quellen: at("Quellen", 19.48),
  vorne: at("Vorne", 20.28), hw1: at("Handwerk", 20.88), gastro: at("Gastronomie", 21.28), friseure: at("Friseure", 21.98),
  die: at("Die", 23.08), nimmt: at("nimmt", 23.48), hw2: at("Handwerk", 23.88), warum: at("Warum", 24.88),
  r1: at("Über", 25.88), r1b: at("300.000", 26.18), r2: at("Beim", 28.48), werbung: at("Werbung", 29.98), r3: at("Und", 30.98), zweimal: at("zweimal", 32.08), nach2: at("nach", 32.88),
  eine: at("Das", 33.88), geschaetzt: at("geschätzt", 34.28), statistik: at("Statistik", 35.08), nicht: at("gibt", 35.78),
  offen: at("Offen", 36.88), nervt: at("nervt", 37.98), bestellen2: at("Bestellen", 38.88), das3: at("Offen", 36.88), naechstes: at("Bestellen", 38.88),
  komm: at("Kommentiere", 40.68), kw: at("Kunde", 41.28), und: at("und", 41.98), schick: at("schick", 42.38), drei2: at("drei", 42.78), schritte: at("Schritte", 42.98),
  damit: at("damit", 43.28), zehn: at("zehn", 43.78), branchen2: at("Kundenbranche", 44.48), quelle: at("findest", 45.08),
};
const TS = { erstens: T.plus - 0.5, zweitens: T.ersten - 0.15, drittens: T.frag - 0.1 };
const SEND = T.claude2 - 0.45;
// ---------- act E timeline (Pfeil-Kette): Handwerker -> Partner druckt -> Paket -> wieder zum Kunden (Nachbestellung) ----------
const EK = { s1: -9, l1: -9, a12: -9, s2: -9, l2: -9, shirt: -9, one: -9, stk: -9, a23: -9, s3: -9, fly: -9, lid: -9, l3: -9, a31: -9, go: -9, arrive: -8 };
// ---------- v6 hook timeline (0 - T.heute): a new, clear event every 0.25-0.45 s, anchored to the spoken word ----------
const TH = {
  umsatz: at("Umsatz", 0.2), unt: at("Unternehmen", 0.6), das0: at("das", 0.9), eine: at("eine", 1.0), hundert: at("100", 1.2), ganz: at("ganz", 1.5), alleine: at("alleine", 1.6),
  fuehrt: at("führt", 1.8), ich: at("Ich", 2.0), probier: at("probier", 2.2), das: at("das", 3.0), aus: at("aus", 3.2), sie: at("Was", 7.0), rc: at("Ihre", 5.0), rcShirt: at("Logo-Shirts", 5.5), rcDruck: at("gedruckt", 6.5),
};
// v-Folge: kein gesprochenes "Tag N" mehr. Badge TAG 1 springt nach "aus." ohne Slam in die Ecke.
const HK = {
  head: 0.25, firma: -1, drop0: TH.umsatz - 0.22, land: TH.umsatz + 0.04, chair: TH.unt, stamp: TH.alleine,
  h2: TH.das0 - 0.02, cas: TH.eine - 0.06, casD: 0.085, steps: TH.hundert, h3: TH.ganz - 0.06, lever: TH.probier,
  lamps: [TH.das, TH.aus, TH.aus + 0.2], slam: -99, one: -99, fly0: -99, fly1: TH.aus + 0.25,
  h4: TH.sie - 0.06, tile: TH.sie, rattle: TH.sie + 0.2, lid: T.kein, dust: T.kein + 0.1, q: T.kunde0, moth: T.kunde0 + 0.14,
};
const COVER_HK = 4.3; // cover: everything of the hook "done" (bot landed, tiles built, lamps on)
const XH = 8; // mini set for the empty box (shot h4)
const HOOK_BOT: V3 = [-0.2, 0, 2.0];
const lampOn = (hk: number, k: number) => {
  const a = HK.lamps[k];
  if (hk < a) return 0;
  const u = hk - a;
  return u < 0.05 ? 0.5 : 1 + 0.6 * Math.exp(-u * 9);
};
const END = FIRMA_TAG2_SECONDS;

// ======================================================================================================
// texts from the real run (design/lauf-tag1) - verbatim
// ======================================================================================================
const PROMPT =
  "Im Anhang ist meine Recherche von gestern. Ich verkaufe jetzt Firmenshirts mit Logo an Betriebe unter zehn Leuten, gedruckt auf Bestellung bei einem Partner. Recherchiere: Welche drei Branchen brauchen am häufigsten Shirts mit Logo, und wie oft bestellen sie nach? Nenne für jede Branche den Grund und deine Quelle.";
const ATTACH = "Schreibtisch-Firma für Kleinstbetriebe Zehn wiederkehrende Bedarfe im Regel-Chec.md";
const R_TITLE = "Logo-Shirts für Kleinstbetriebe";
const ANSWER = "„Eine direkte Statistik dazu … gibt es für Deutschland nicht.“"; // wörtlich gekürzt aus der echten Antwort
const pEnd = (s: string) => PROMPT.indexOf(s) + s.length;
const PROMPT_KEYS: [number, number][] = [
  [T.frag - 0.3, 0],
  [T.drei - 0.1, pEnd("Welche drei Branchen")],
  [T.wie - 0.1, pEnd("wie oft bestellen sie nach?")],
  [SEND - 0.18, PROMPT.length],
];
// GRÜNDUNGSPLAN: 9 Schritte in der Reihenfolge der Folgenliste (konzept.md: Tag 1 Produkt, 2 Kunde, 7 Preis, 8 Name, 9 Logo, 10 Website, 14 Werbung, 15 Ansprache, 17 erster Euro)
// Umsatz laut Bibel (wirtschaftsbuch-v2): 0 €, bis ein echter Auftrag bezahlt ist. Zähler nur bei umsatz > 0 (Pius 2026-10-28).
const UMSATZ = 0;
const CUR = 1; // Folge "Kunde": Schritt 2 aktiv, Schritt 1 (Produkt) erledigt
const PLAN = ["PRODUKT", "KUNDE", "PREIS", "NAME", "LOGO", "WEBSITE", "WERBUNG", "AKQUISE", "ERSTER\nUMSATZ"];
// branches named in the real report (Top 3 + Platz 4)
type Cand = { label: string; icon: "flyer" | "shirt" | "glove" | "cape" | "bag" | "more" | "car" };
const CANDS: Cand[] = [
  { label: "HANDWERK", icon: "glove" }, { label: "GASTRONOMIE", icon: "bag" }, { label: "FRISEURE", icon: "cape" }, { label: "KFZ-WERKSTATT", icon: "car" },
];
const KEEP = 0;
// the three steps of the guide - short
const FRAGEN = [
  { n: 1, label: "Research an", snip: "Unten auf „+“, dann „Research“ einschalten" },
  { n: 2, label: "Bericht anhängen", snip: "Deine Notizen oder Recherche als Datei dazu" },
  { n: 3, label: "Frage stellen", snip: "„Welche drei Branchen brauchen am häufigsten …, und wie oft bestellen sie nach?“" },
];

// ======================================================================================================
// shots: full-frame world ↔ full-frame Claude, hard cuts with a short settle push
// ======================================================================================================
type ShotId = "h1" | "h2" | "h3" | "h4" | "claudeA" | "research" | "report" | "partner" | "win" | "answer" | "hub" | "end" | "chain" | "question";
const SHOTS: { id: ShotId; a: number }[] = [
  { id: "h1", a: 0 }, { id: "h2", a: HK.h2 }, { id: "h3", a: HK.h3 }, { id: "h4", a: HK.h4 }, { id: "claudeA", a: T.heute - 0.15 }, { id: "research", a: SEND + 0.3 },
  { id: "win", a: T.die - 0.12 }, { id: "answer", a: T.eine - 0.12 }, { id: "question", a: T.offen - 0.12 }, { id: "end", a: T.komm - 0.15 },
];
const shotAt = (t: number) => {
  let i = 0;
  for (let k = 0; k < SHOTS.length; k++) if (t >= SHOTS[k].a) i = k;
  const a = SHOTS[i].a, b = i + 1 < SHOTS.length ? SHOTS[i + 1].a : END;
  return { id: SHOTS[i].id, a, b, u: t - a, len: b - a };
};
const isHook = (id: ShotId) => id === "h1" || id === "h2" || id === "h3" || id === "h4";
const isClaude = (id: ShotId) => id === "claudeA" || id === "report" || id === "answer";

// set origins in the world (one room, different corners)
const XA = 0, XC = -18, XD = 18, XB = 36;
type CamDef = { pos: V3; look: V3; fov: number; focus: V3; push?: number };
const CAMS: Record<ShotId, CamDef> = {
  h1: { pos: [XA, 5.2, 12.5], look: [XA, 5.0, -4.6], fov: 58, focus: [XA, 1.2, 2.5], push: 0.03 },
  h2: { pos: [XA, 4.35, 9.3], look: [XA, 4.35, -4.6], fov: 58, focus: [XA, 4.35, -4.6], push: 0.03 },
  h3: { pos: [XA + 1.0, 4.4, 11.4], look: [XA + 0.2, 4.6, -4.6], fov: 58, focus: [XA, 1.2, 2.5], push: 0.03 },
  h4: { pos: [XH, 2.9, 9.2], look: [XH, 1.5, -1], fov: 50, focus: [XH, 0.8, 0], push: 0.04 },
  claudeA: { pos: [XB, 3.0, 9.0], look: [XB, 3.0, -4], fov: 58, focus: [XB + 1.2, 1.2, 3.6], push: 0.03 },
  research: { pos: [XC, 3.9, 8.6], look: [XC, 4.7, -4.8], fov: 58, focus: [XC, 4, -4.4], push: 0.06 },
  report: { pos: [XB, 3.0, 9.0], look: [XB, 3.0, -4], fov: 58, focus: [XB + 1.2, 1.2, 3.6], push: 0.03 },
  partner: { pos: [XD + 0.8, 3.6, 7.6], look: [XD + 0.8, 3.3, -2.6], fov: 58, focus: [XD + 1.0, 2.0, -2.0], push: 0.06 },
  win: { pos: [XC + 0.3, 3.8, 8.2], look: [XC, 4.6, -4.8], fov: 58, focus: [XC, 4, -4.4], push: 0.07 },
  chain: { pos: [XD, 7.2, 5.6], look: [XD, 0.9, -1.4], fov: 58, focus: [XD, 1.2, -1.0], push: 0.03 },
  question: { pos: [XC, 3.9, 7.0], look: [XC, 4.3, -3], fov: 58, focus: [XC, 4.4, -2.2], push: 0.04 },
  answer: { pos: [XB, 3.0, 9.0], look: [XB, 3.0, -4], fov: 58, focus: [XB + 1.2, 1.2, 3.6], push: 0.03 },
  hub: { pos: [XA + 0.2, 3.9, 8.4], look: [XA, 4.25, -4.6], fov: 58, focus: [XA, 4.3, -4.6], push: 0.05 },
  end: { pos: [XA, 3.0, 8.4], look: [XA, 3.6, -3], fov: 58, focus: [XA, 1.4, 1.2], push: 0.04 },
};
const camAt = (t: number) => {
  const s = shotAt(t);
  const c = CAMS[s.id];
  const settle = (isHook(s.id) ? 0.035 : 0.08) * (1 - ease(s.u / 0.45)); // quick push-in right after each cut
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
  } else if (icon === "car") {
    c.fillStyle = "#3E6FD8";
    c.beginPath(); c.moveTo(-s * 0.46, s * 0.2); c.lineTo(-s * 0.46, -s * 0.02); c.lineTo(-s * 0.26, -s * 0.06); c.lineTo(-s * 0.14, -s * 0.28); c.lineTo(s * 0.2, -s * 0.28); c.lineTo(s * 0.34, -s * 0.06); c.lineTo(s * 0.46, -s * 0.02); c.lineTo(s * 0.46, s * 0.2); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#BFE6F5"; c.fillRect(-s * 0.1, -s * 0.22, s * 0.26, s * 0.14); c.strokeRect(-s * 0.1, -s * 0.22, s * 0.26, s * 0.14);
    c.fillStyle = "#222"; [-0.26, 0.26].forEach((fx) => { c.beginPath(); c.arc(s * fx, s * 0.22, s * 0.11, 0, 7); c.fill(); c.stroke(); });
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
type PlanS = { cur: number; q: number; done: number; next: number; pulse: number; cas: number; steps: number; head: number };
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
  c.globalAlpha = s.head;
  c.font = "900 118px Rubik"; c.fillStyle = "#FFFFFF"; c.fillText("GRÜNDUNGSPLAN", 70, 128);
  c.globalAlpha = 1;
  const hw = c.measureText("GRÜNDUNGSPLAN").width;
  if (s.steps > 0.001) {
    const k = back(s.steps), sx0 = 70 + hw + 44;
    c.save(); c.translate(sx0 + 150, 136); c.scale(k * (1 + 0.5 * (1 - Math.min(1, s.steps))), k); c.rotate(-0.05 * (1 - Math.min(1, s.steps)));
    c.font = "900 44px Rubik"; c.fillStyle = GOLD; c.fillText("· 9 SCHRITTE", -150, 0); c.restore();
  }
  const gx = 60, gy = 230, gw = w - 120, gh = h - 290, gap = 30;
  const tw = (gw - 2 * gap) / 3, th = (gh - 2 * gap) / 3;
  PLAN.forEach((label, i) => {
    const x = gx + (i % 3) * (tw + gap), y = gy + Math.floor(i / 3) * (th + gap);
    const tk = cl((s.cas - i * HK.casD) / 0.16), tcx = x + tw / 2, tcy = y + th / 2;
    if (tk < 0.5) { // v6: ghost tile (dashed), flips away when the cascade reaches it
      const k = Math.max(0.02, 1 - 2 * tk);
      c.save(); c.translate(tcx, tcy); c.scale(1, k); c.translate(-tcx, -tcy);
      c.fillStyle = "rgba(26,39,71,.55)"; roundRect(c, x, y, tw, th, 34); c.fill();
      c.setLineDash([26, 18]); c.lineWidth = 6; c.strokeStyle = "rgba(111,227,240,.4)"; roundRect(c, x, y, tw, th, 34); c.stroke(); c.setLineDash([]);
      c.textAlign = "center"; c.textBaseline = "middle"; c.font = "900 110px Rubik"; c.fillStyle = "rgba(111,227,240,.22)"; c.fillText("?", tcx, tcy + 6);
      c.restore();
      return;
    }
    const u2 = Math.min(1, (tk - 0.5) * 2), sy2 = Math.max(0.02, back(u2));
    c.save(); c.translate(tcx, tcy); c.scale(1 + 0.08 * (1 - u2), sy2); c.translate(-tcx, -tcy);
    const isCur = i === CUR, isNext = i === CUR + 1;
    const done = isCur ? s.done : i < CUR ? 1 : 0;
    const glowK = isCur ? s.cur * (1 - done) : isNext ? s.next : 0;
    c.save();
    if (glowK > 0.01) { c.shadowColor = isCur ? GOLD : CYAN; c.shadowBlur = 50 * glowK * (0.8 + 0.2 * Math.sin(t * 6)); }
    c.fillStyle = done > 0.5 ? "#16452F" : isCur ? `rgba(70,56,24,${0.55 + 0.45 * s.cur})` : isNext && s.next > 0.01 ? "#173A55" : "#1A2747";
    roundRect(c, x, y, tw, th, 34); c.fill();
    c.restore();
    c.lineWidth = glowK > 0.01 || done > 0.5 ? 12 : 5;
    c.strokeStyle = done > 0.5 ? GREEN : isCur ? GOLD : isNext && s.next > 0.01 ? CYAN : "rgba(111,227,240,.28)";
    roundRect(c, x, y, tw, th, 34); c.stroke();
    const dimA = isCur || i < CUR || (isNext && s.next > 0.01) ? 1 : 0.5;
    c.globalAlpha = dimA;
    c.textAlign = "left"; c.textBaseline = "alphabetic";
    c.font = "900 120px Rubik"; c.fillStyle = isCur || i < CUR ? (done > 0.5 ? "#9BF0C2" : GOLD) : "#FFFFFF"; c.fillText(String(i + 1), x + 34, y + 138);
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
    if ((isCur || i < CUR) && done > 0.01) {
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
    if (u2 < 1) { c.globalAlpha = 0.75 * (1 - u2); c.fillStyle = "#FFFFFF"; roundRect(c, x, y, tw, th, 34); c.fill(); c.globalAlpha = 1; }
    c.restore();
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
    centerText(c, "→ HANDWERK", 700, 176, 190, 1260, "#FFFFFF");
  });
  const custLogo = canvasTex(512, 512, (c) => {
    c.clearRect(0, 0, 512, 512);
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(256, 256, 240, 0, 7); c.fill();
    c.fillStyle = "#2E6BD8"; c.beginPath(); c.arc(256, 256, 204, 0, 7); c.fill();
    centerText(c, "LOGO", 256, 266, 150, 340, "#FFFFFF");
  });
  const l1 = dieText("HANDWERKER\nKLEINBETRIEB", "#FFFFFF", SKC.INK, 1000, 330, 104);
  const l2 = dieText("PARTNER-\nDRUCKEREI", "#FFFFFF", SKC.INK, 1000, 330, 110);
  const l3 = dieText("DIREKT ZUM\nKUNDEN", "#FFFFFF", SKC.INK, 1000, 330, 110);
  const one = canvasTex(700, 760, (c) => {
    dieCut(c, 6, 6, 688, 730, 80, "#0E1428", 16);
    c.lineWidth = 14; c.strokeStyle = GOLD; roundRect(c, 34, 34, 632, 674, 60); c.stroke();
    centerText(c, "1–2×", 350, 330, 300, 600, GOLD);
    centerText(c, "PRO JAHR", 350, 620, 120, 600, "#FFFFFF");
  });
  const qcard = canvasTex(1400, 1000, (c) => {
    dieCut(c, 8, 8, 1384, 960, 90, "#FFFFFF", 0);
    c.fillStyle = "#FDF1E6"; roundRect(c, 40, 40, 1320, 896, 70); c.fill();
    c.fillStyle = SKC.INK; roundRect(c, 470, 90, 460, 120, 60); c.fill();
    centerText(c, "NOCH OFFEN", 700, 152, 66, 400, "#FFFFFF");
    centerText(c, "Was nervt Betriebe", 700, 400, 150, 1220, SKC.INK);
    centerText(c, "beim Bestellen?", 700, 570, 150, 1220, SKC.INK);
  });
  const qstamp = dieText("ALS NÄCHSTES", "#3E6FD8", "#FFFFFF", 1300, 260, 110);
  const werbung = dieText("SHIRT = WERBUNG", SKC.OR, "#FFFFFF", 1100, 250, 110);
  return { floor, wall, glow, shirtLogo, bubbleQ, ab1, mindest, partner, stamp, custLogo, l1, l2, l3, one, qcard, qstamp, werbung };
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

const Lamp: React.FC<{ p: V3; t: number; seed?: number; i?: number; r?: number; on?: number }> = ({ p, t, seed = 0, i = 26, r = 13, on = 1 }) => {
  const sw = 0.03 * Math.sin(t * 0.9 + seed);
  return (
    <group position={p} rotation={[0, 0, sw]}>
      <mesh position={[0, 3, 0]}><cylinderGeometry args={[0.02, 0.02, 6, 6]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 0.12, 0]}><coneGeometry args={[0.55, 0.5, 24, 1, true]} /><meshStandardMaterial color="#1E2233" metalness={0.6} roughness={0.35} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.08, 0]}><sphereGeometry args={[0.2, 16, 12]} /><meshBasicMaterial color={on > 0.3 ? "#FFE2B0" : "#3A342A"} toneMapped={false} /></mesh>
      {on > 0.01 && <pointLight position={[0, -0.4, 0]} intensity={i * on} distance={r} decay={1.6} color="#FFC07A" />}
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

// ---------- v6 hook props ----------
const Chair: React.FC<{ p: V3; rot: number }> = ({ p, rot }) => (
  <group position={p} rotation={[0, rot, 0]}>
    {[0, 1, 2, 3, 4].map((k) => (
      <group key={k} rotation={[0, (k * 2 * Math.PI) / 5, 0]}>
        <mesh position={[0.3, 0.1, 0]}><boxGeometry args={[0.6, 0.07, 0.1]} /><meshStandardMaterial color="#1A1F30" /></mesh>
        <mesh position={[0.58, 0.05, 0]}><sphereGeometry args={[0.06, 8, 6]} /><meshStandardMaterial color="#0E1220" /></mesh>
      </group>
    ))}
    <mesh position={[0, 0.48, 0]}><cylinderGeometry args={[0.05, 0.05, 0.75, 10]} /><meshStandardMaterial color="#9AA0B0" metalness={0.7} roughness={0.3} /></mesh>
    <Out size={[0.95, 0.16, 0.9]} p={[0, 0.9, 0]} color="#3A4A73" line={SKC.INK} o={0.035} />
    <Out size={[0.95, 1.0, 0.16]} p={[0, 1.5, -0.42]} color="#3A4A73" line={SKC.INK} o={0.035} />
  </group>
);
const Lever: React.FC<{ p: V3; a: number }> = ({ p, a }) => (
  <group position={p}>
    <Out size={[0.62, 1.0, 0.5]} p={[0, 0.5, 0]} color="#2B3350" line={SKC.INK} o={0.04} />
    <mesh position={[0, 0.72, 0.26]}><boxGeometry args={[0.44, 0.12, 0.02]} /><meshBasicMaterial color={GOLD} toneMapped={false} /></mesh>
    <group position={[0, 1.0, 0]} rotation={[0, 0, a]}>
      <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.05, 0.05, 0.9, 10]} /><meshStandardMaterial color="#C8CCD8" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[0, 0.95, 0]} castShadow><sphereGeometry args={[0.18, 18, 14]} /><meshStandardMaterial color="#E5484D" roughness={0.35} /></mesh>
    </group>
  </group>
);
const CardBox: React.FC<{ p: V3; hk: number }> = ({ p, hk }) => {
  const r = hk - HK.rattle;
  const rattle = r > 0 && hk < HK.lid ? 0.07 * Math.sin(r * 46) : 0;
  const u = cl((hk - HK.lid) / 0.55);
  return (
    <group position={p} rotation={[0, 0.35, rattle]}>
      <Out size={[1.25, 0.95, 1.1]} p={[0, 0.475, 0]} color="#C99A6B" line={SKC.INK} o={0.04} rough={0.9} />
      <mesh position={[0, 0.5, 0.556]}><boxGeometry args={[0.22, 0.95, 0.01]} /><meshStandardMaterial color="#E2C79C" roughness={0.6} /></mesh>
      <mesh position={[0, 0.953, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.18, 1.03]} /><meshBasicMaterial color="#20150C" /></mesh>
      {u < 1 && (
        <group position={[-1.6 * u, 1.0 + 4.2 * u - 1.4 * u * u + (rattle !== 0 ? Math.abs(rattle) * 0.8 : 0), -0.6 * u]} rotation={[-2.6 * u, 0, 1.6 * u]}>
          <Out size={[1.32, 0.1, 1.17]} color="#B88A5C" line={SKC.INK} o={0.035} rough={0.9} />
          <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.22, 1.17]} /><meshStandardMaterial color="#E2C79C" /></mesh>
        </group>
      )}
    </group>
  );
};
const Moth: React.FC<{ p: V3; hk: number }> = ({ p, hk }) => {
  const u = hk - HK.moth;
  if (u < 0 || u > 3) return null;
  const f = 0.9 * Math.sin(u * 50);
  const pos: V3 = [p[0] + 0.45 * Math.sin(u * 5) + 0.5 * u, p[1] + 0.2 + 1.5 * u, p[2] + 0.3 * Math.cos(u * 4)];
  return (
    <group position={pos} rotation={[0.5, 0.4 * Math.sin(u * 3), 0]} scale={1.5}>
      <mesh><boxGeometry args={[0.07, 0.07, 0.24]} /><meshStandardMaterial color="#5B5246" /></mesh>
      {[-1, 1].map((sd) => (
        <group key={sd} rotation={[0, 0, sd * f]}>
          <mesh position={[sd * 0.15, 0, 0]}><boxGeometry args={[0.26, 0.012, 0.22]} /><meshStandardMaterial color="#D6CBB2" side={THREE.DoubleSide} /></mesh>
        </group>
      ))}
    </group>
  );
};

// ---------- v7 act E: Pfeil-Kette ----------
const pathLen = (pts: V3[]) => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[2] - pts[i][2]), 0);
const pathAt = (pts: V3[], d: number): { p: V3; yaw: number } => {
  let i = 0;
  const seg = (k: number) => Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][2] - pts[k][2]);
  while (i < pts.length - 2 && d > seg(i)) { d -= seg(i); i++; }
  const a = pts[i], b = pts[i + 1], u = Math.max(0, Math.min(1, d / seg(i)));
  return { p: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u], yaw: Math.atan2(b[0] - a[0], b[2] - a[2]) };
};
// floor arrow that visibly runs from a to b (dashes grow, head leads), then a light pulse keeps travelling along it
const Arrow3D: React.FC<{ pts: V3[]; k: number; t: number; col?: string }> = ({ pts, k, t, col = SKC.OR }) => {
  if (k <= 0.001) return null;
  const L = pathLen(pts), shown = L * Math.min(1, k), step = 0.34;
  const n = Math.floor(L / step);
  const head = pathAt(pts, Math.max(0.01, shown));
  const pulseD = k >= 1 ? ((t * 2.4) % (L + 0.6)) : -1;
  return (
    <group>
      {Array.from({ length: n }).map((_, j) => {
        const d = j * step + 0.12;
        if (d > shown - 0.3) return null;
        const q = pathAt(pts, d);
        const lit = pulseD >= 0 && Math.abs(d - pulseD) < 0.45 ? 1 : 0;
        return (
          <mesh key={j} position={[q.p[0], 0.06, q.p[2]]} rotation={[0, q.yaw, 0]}>
            <boxGeometry args={[0.16, 0.05, 0.2]} />
            <meshBasicMaterial color={lit ? "#FFF3D6" : col} toneMapped={false} />
          </mesh>
        );
      })}
      <group position={[head.p[0], 0.08, head.p[2]]} rotation={[0, head.yaw, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.26, 0.42, 3]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>
      </group>
    </group>
  );
};
const Shop: React.FC<{ p: V3; s: number; t: number; tex: NonNullable<ReturnType<typeof useRoomTex>>; hop?: number }> = ({ p, s, t, tex, hop = 0 }) => (
  <group position={[p[0], p[1] + hop, p[2]]} scale={[s * (1 + 0.1 * hop), s * (1 - 0.1 * hop), s]} rotation={[0, 0.15, 0]}>
    <Out size={[1.7, 1.25, 1.2]} p={[0, 0.625, 0]} color="#EDE6D8" line={SKC.INK} o={0.04} rough={0.8} />
    <Out size={[1.9, 0.18, 1.4]} p={[0, 1.34, 0]} color="#3A4A73" line={SKC.INK} o={0.035} />
    {Array.from({ length: 6 }).map((_, i) => (
      <mesh key={i} position={[-0.71 + i * 0.284, 1.05, 0.72]} rotation={[0.55, 0, 0]}><boxGeometry args={[0.28, 0.05, 0.42]} /><meshStandardMaterial color={i % 2 ? "#FFFFFF" : SKC.OR} /></mesh>
    ))}
    <mesh position={[-0.48, 0.38, 0.61]}><boxGeometry args={[0.42, 0.74, 0.02]} /><meshStandardMaterial color="#2A1C14" /></mesh>
    <mesh position={[0.36, 0.5, 0.61]}><boxGeometry args={[0.62, 0.42, 0.02]} /><meshBasicMaterial color="#9FD8F0" /></mesh>
    <Plate3D w={0.9} h={0.9} d={0.06} r={0.45} tex={tex.custLogo} body="#FFFFFF" glow={0.2} p={[0, 1.95, 0.1]} rot={[-0.35, 0, 0]} />
  </group>
);
const Parcel: React.FC<{ p: V3; s: number; lid: number; yaw?: number }> = ({ p, s, lid, yaw = 0 }) => (
  <group position={p} scale={s} rotation={[0, yaw, 0]}>
    <Out size={[1.0, 0.72, 0.85]} p={[0, 0.36, 0]} color="#C99A6B" line={SKC.INK} o={0.035} rough={0.9} />
    <mesh position={[0, 0.725, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.94, 0.79]} /><meshBasicMaterial color="#20150C" /></mesh>
    {[-1, 1].map((sd) => (
      <group key={sd} position={[0, 0.73, sd * 0.425]} rotation={[sd * (1 - lid) * 2.0, 0, 0]}>
        <Out size={[1.0, 0.05, 0.425]} p={[0, 0, -sd * 0.2125]} color="#B88A5C" line={SKC.INK} o={0.025} rough={0.9} />
      </group>
    ))}
    {lid > 0.95 && <mesh position={[0, 0.765, 0]}><boxGeometry args={[0.2, 0.012, 0.86]} /><meshStandardMaterial color="#E2C79C" /></mesh>}
    <mesh position={[0.22, 0.42, 0.428]}><boxGeometry args={[0.36, 0.24, 0.01]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
  </group>
);
const S1: V3 = [XD - 1.1, 0, -4.0], S2: V3 = [XD + 1.15, 0, -1.6], S3: V3 = [XD - 1.0, 0, 0.5];
const A12: V3[] = [[S1[0] + 0.9, 0, S1[2] + 0.6], [S2[0] - 1.0, 0, S2[2] - 0.2]];
const A23: V3[] = [[S2[0] - 0.7, 0, S2[2] + 1.0], [S3[0] + 0.8, 0, S3[2] - 0.35]];
const A31: V3[] = [[S3[0] - 0.75, 0, S3[2] - 0.1], [XD - 2.2, 0, S3[2] - 0.9], [XD - 2.2, 0, S1[2] + 1.6], [S1[0] - 0.55, 0, S1[2] + 0.85]];
const pop = (t: number, a: number, d = 0.35) => Math.max(0.001, Math.min(1.15, back((t - a) / d)));
const ChainSet: React.FC<{ t: number; tex: NonNullable<ReturnType<typeof useRoomTex>>; pose: Pose }> = ({ t, tex, pose }) => {
  const running = t > EK.l2 - 0.05;
  const shirtK = cl((t - EK.shirt) / 0.3);
  const flyK = cl((t - EK.fly) / 0.3);
  const lid = ease((t - EK.lid) / 0.2);
  const L31 = pathLen(A31);
  const go = inOut(cl((t - EK.go) / (EK.arrive - EK.go)));
  const parcelP: V3 = go > 0 ? pathAt(A31, L31 * go).p : [S3[0], 0, S3[2]];
  const shopHop = bump(t, EK.arrive + 0.05, 0.3) * 0.25;
  const tilt: V3 = [-0.85, 0, 0];
  return (
    <group>
      {/* station 1: small business with its logo */}
      {t >= EK.s1 && <group scale={pop(t, EK.s1)} position={S1}><Shop p={[0, 0, 0]} s={1} t={t} tex={tex} hop={shopHop} /></group>}
      {t >= EK.l1 && <Plate3D w={2.5} h={0.82} d={0.08} r={0.3} tex={tex.l1} rough={1} glow={0} p={[S1[0], 3.0, S1[2] - 0.2]} rot={tilt} s={pop(t, EK.l1)} />}
      <Arrow3D pts={A12} k={cl((t - EK.a12) / 0.4)} t={t} />
      {/* station 2: partner print shop prints ONE shirt */}
      {t >= EK.s2 && (
        <group scale={pop(t, EK.s2)} position={S2}>
          <PrintMachine p={[0, 0, 0]} t={t} s={0.46} yaw={-0.3} tint="#E9EEF7" accent="#1C2440" running={running} />
        </group>
      )}
      {t >= EK.l2 && <Plate3D w={2.5} h={0.82} d={0.08} r={0.3} tex={tex.l2} rough={1} glow={0} p={[S2[0] + 0.05, 0.45, S2[2] + 1.65]} rot={tilt} s={pop(t, EK.l2)} />}
      {t >= EK.one && <Plate3D w={1.15} h={1.25} d={0.12} r={0.25} tex={tex.one} rough={1} glow={0} p={[S2[0] + 0.1, 2.75 + 0.05 * Math.sin(t * 3), S2[2] - 0.3]} rot={[-0.5, 0, -0.05]} s={pop(t, EK.one, 0.3) * (1 + 0.12 * bump(t, EK.stk + 0.05, 0.3))} />}
      {shirtK > 0 && flyK < 1 && (() => {
        const from: V3 = [S2[0] - 0.2, 0.75 + 0.45 * ease(shirtK), S2[2] + 1.05];
        const to: V3 = [S3[0], 1.0, S3[2]];
        const f = ease(flyK);
        const pp: V3 = [from[0] + (to[0] - from[0]) * f, from[1] + (to[1] - from[1]) * f + 1.2 * f * (1 - f) * 4 * 0.5, from[2] + (to[2] - from[2]) * f];
        return (
          <group position={pp} scale={Math.max(0.001, back(shirtK)) * (1 - 0.6 * f) * 0.62} rotation={[-0.3, -0.3 + 2 * f, 0.08 * Math.sin(t * 5)]}>
            <ShirtUp p={[0, 0, 0]} s={1} logo={tex.custLogo} />
          </group>
        );
      })()}
      <Burst p={[S2[0] - 0.2, 1.3, S2[2] + 1.1]} t={t} at={EK.one + 0.05} n={18} speed={2.6} size={0.08} seed={41} colors={["#FFFFFF", GOLD, SKC.OR]} />
      <Arrow3D pts={A23} k={cl((t - EK.a23) / 0.35)} t={t} />
      {/* station 3: parcel goes straight to the customer */}
      {t >= EK.s3 && <Parcel p={parcelP} s={pop(t, EK.s3, 0.3) * (1 + 0.1 * bump(t, EK.lid + 0.15, 0.25))} lid={lid} yaw={go > 0 ? 0.3 : 0.2} />}
      {t >= EK.l3 && <Plate3D w={2.5} h={0.82} d={0.08} r={0.3} tex={tex.l3} rough={1} glow={0} p={[S3[0] - 0.05, 0.45, S3[2] + 1.85]} rot={tilt} s={pop(t, EK.l3)} />}
      <Arrow3D pts={A31} k={cl((t - EK.a31) / 0.35)} t={t} col={GREEN} />
      <Burst p={[S1[0], 1.2, S1[2] + 0.8]} t={t} at={EK.arrive} n={26} speed={3} size={0.1} seed={44} colors={[GREEN, "#FFFFFF", GOLD]} />
      <Lamp p={[XD - 1.0, 8.6, -2.0]} t={t} seed={6} i={30} />
      <Lamp p={[XD + 2.2, 8.4, 1.6]} t={t} seed={7} i={18} />
      
      <Bot p={[XD + 2.25, 0, -0.9]} t={t} s={0.6} yaw={pose.yaw} eyes={pose.eyes} armL={pose.armL} armR={pose.armR} hop={pose.hop} squash={pose.squash} />
      <Motes t={t} center={[XD, 3, 0]} size={[10, 6, 10]} n={50} seed={7} color="#FFE7C2" s={0.03} />
    </group>
  );
};
// ---------- v7 act G: the one open question as a big card ----------
const QuestionCard: React.FC<{ t: number; tex: NonNullable<ReturnType<typeof useRoomTex>> }> = ({ t, tex }) => {
  const k = pop(t, T.offen - 0.02, 0.4);
  const st = cl((t - (T.nervt + 0.3)) / 0.15);
  return (
    <group>
      <mesh position={[XC, 4.3, -3.6]}><planeGeometry args={[12, 8]} /><meshBasicMaterial color="#05070F" transparent opacity={0.45} /></mesh>
      <Plate3D w={4.9} h={3.5} d={0.14} r={0.36} tex={tex.qcard} rough={1} glow={0} p={[XC - 0.3, 4.9 + 0.05 * Math.sin(t * 2), -2.4]} rot={[0, 0, 0.02]} s={k * (1 + 0.07 * bump(t, T.nervt + 0.05, 0.3) + 0.05 * bump(t, T.bestellen2 + 0.1, 0.3) + 0.05 * bump(t, T.bestellen2 + 0.9, 0.3))} />
      {st > 0 && <Plate3D w={4.0} h={0.8} d={0.08} r={0.3} tex={tex.qstamp} glow={0} p={[XC - 0.2, 2.7, -1.95]} rot={[0, 0, -0.06]} s={2.2 - 1.2 * ease(st)} />}
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
const planState = (t: number, hk = t): PlanS => ({
  cur: 0.6 + 0.4 * Math.max(bump(t, T.tag + 0.1, 0.5), t > T.tag ? 1 : 0),
  q: 1,
  done: cl((t - (T.das3 + 0.05)) / 0.4),
  next: 0,
  pulse: bump(t, T.tag + 0.1, 0.35) + bump(t, T.kein + 0.15, 0.35) + bump(t, T.kunde0 + 0.1, 0.3),
  cas: t >= T.heute - 0.15 ? 99 : hk - HK.cas,
  steps: t >= T.heute - 0.15 ? 1 : cl((hk - HK.steps) / 0.22),
  head: t >= T.heute - 0.15 || hk >= HK.head + 0.14 ? 1 : hk < HK.head ? 0.3 : Math.sin(hk * 140) > 0 ? 1 : 0.4,
});
const FILL_AT = (i: number) => T.claude2 + 0.15 + i * 0.22;
const HL_AT = [T.hw1, T.gastro, T.friseure];
const slotState = (t: number, i: number): SlotS => {
  const fill = t >= FILL_AT(i) ? 1 : 0;
  if (i === KEEP) return { fill, cross: 0, keep: back((t - T.hw2) / 0.3), dim: 0, hl: ease((t - T.hw1) / 0.25) };
  if (i < 3) return { fill, cross: 0, keep: 0, dim: ease((t - T.nimmt) / 0.3), hl: ease((t - HL_AT[i]) / 0.25) * (1 - ease((t - T.nimmt) / 0.3)) };
  return { fill, cross: cl((t - (T.friseure + 0.45)) / 0.18), keep: 0, dim: 0, hl: 0 };
};
const SLOT_W = 2.6, SLOT_H = 1.95;
const slotPos = (i: number): V3 => [XC + ((i % 2) - 0.5) * 2.95, [5.25, 3.15][Math.floor(i / 2)], -4.62];

// expression + arms per beat, for the mascot of the current shot
type Pose = { eyes: Eyes; armL: number; armR: number; hop: number; squash: number; yaw: number };
const hopAt = (t: number, list: [number, number][]) => list.reduce((a, [s, h]) => {
  const u = (t - s) / 0.42;
  if (u < -0.2 || u > 1.25) return a;
  if (u < 0) return { y: a.y, sq: a.sq + 0.45 * Math.sin((Math.PI * (u + 0.2)) / 0.2) };
  if (u <= 1) return { y: a.y + 4 * h * u * (1 - u), sq: a.sq - 0.3 * (1 - Math.abs(2 * u - 1)) };
  return { y: a.y, sq: a.sq + 0.5 * Math.sin((Math.PI * (u - 1)) / 0.25) };
}, { y: 0, sq: 0 });
const poseAt = (t: number, id: ShotId, hk = t): Pose => {
  const h = hopAt(t, [[T.an, 0.18], [T.q260 + 0.05, 0.35], [T.hw2 - 0.05, 0.75], [T.r1, 0.2], [T.r2, 0.2], [T.r3, 0.2], [T.schick + 0.25, 0.3], [T.zehn, 0.3], [T.quelle + 0.05, 0.4]]);
  const base: Pose = { eyes: { mode: "open" }, armL: 12 + 6 * Math.sin(t * 2), armR: 12 + 6 * Math.sin(t * 2 + 1), hop: h.y, squash: h.sq, yaw: 0 };
  const sway = 0.05 * Math.sin(t * 1.4);
  switch (id) {
    case "h1":
    case "h2":
    case "h3": {
      const tau = hk - HK.land;
      const fall = hk < HK.land ? 9 * (1 - ((hk - HK.drop0) / (HK.land - HK.drop0)) ** 2) : 0;
      const sq = hk < HK.land ? -1.1 : 2.6 * Math.exp(-7 * tau) * Math.cos(22 * tau);
      const b: Pose = { ...base, hop: Math.max(0, fall), squash: sq };
      if (hk >= HK.slam - 0.05) return { ...b, eyes: { mode: "wow", ly: 0.6 }, armL: 150, armR: 150, yaw: 0 };
      if (hk >= HK.lamps[0]) return { ...b, eyes: { mode: "happy" }, armL: 40, armR: 70 + 20 * Math.sin(t * 9), yaw: -0.15 + 0.1 * (hk - HK.lamps[0]) };
      if (hk >= HK.lever - 0.3) return { ...b, eyes: { mode: "open", lx: -1, ly: 0.4 }, armL: hk < HK.lever ? 140 : 140 - 100 * ease((hk - HK.lever) / 0.14), armR: 20, yaw: -0.55 };
      if (hk >= HK.chair) return { ...b, eyes: { mode: "open", lx: 1, ly: 0.2 }, yaw: 0.4, armR: 75, armL: 15 };
      if (hk >= HK.land) return { ...b, eyes: { mode: tau < 0.25 ? "wow" : "open", ly: 0.6 }, armL: 30 + 60 * Math.exp(-6 * tau), armR: 30 + 60 * Math.exp(-6 * tau) };
      return { ...b, eyes: { mode: "wow", ly: 1 }, armL: 165, armR: 165 };
    }
    case "h4":
      if (hk >= HK.q) return { ...base, eyes: { mode: "think", lx: -0.8, ly: 0.6 }, armL: 75 + 12 * Math.sin(t * 7), armR: 20, yaw: 0.1 };
      if (hk >= HK.lid) return { ...base, eyes: { mode: "wow", lx: -0.8, ly: 0.8 }, armL: 150, armR: 150 };
      return { ...base, eyes: { mode: "open", lx: -1, ly: -0.3 }, armL: 90 + 20 * Math.sin(t * 9), armR: 25 };
    case "claudeA":
    case "report":
    case "answer": {
      const look = { lx: -1, ly: 1 };
      if (id === "claudeA" && t > T.an - 0.05 && t < T.an + 0.7) return { ...base, eyes: { mode: "happy" }, yaw: -0.3 };
      if (id === "claudeA" && t > SEND - 0.1) return { ...base, eyes: { mode: "wow", ...look }, yaw: -0.35 };
      if (id === "report" && t > T.hw1) return { ...base, eyes: { mode: "glow" }, yaw: -0.35 };
      if (id === "answer" && t > T.statistik - 0.05) return { ...base, eyes: { mode: "think", lx: -0.6, ly: 0.8 }, yaw: -0.3 };
      return { ...base, eyes: { mode: "open", ...look }, yaw: -0.35 + sway };
    }
    case "research":
      if (t > T.hw1) return { ...base, eyes: { mode: "happy" }, armL: 150, armR: 60, yaw: 0.2 };
      if (t > T.q260) return { ...base, eyes: { mode: "glow" }, armL: 140, armR: 140, yaw: 0.25 };
      return { ...base, eyes: { mode: "think", lx: 0.7, ly: 1 }, armR: 100 + 15 * Math.sin(t * 7), yaw: 0.3 };
    case "chain": {
      if (t >= EK.arrive) return { ...base, eyes: { mode: "happy" }, armL: 160, armR: 160, yaw: -0.5 };
      if (t >= EK.a23) return { ...base, eyes: { mode: "open", lx: -1, ly: 0.6 }, armL: 120 + 10 * Math.sin(t * 6), armR: 15, yaw: -0.9 };
      if (t >= EK.s2) return { ...base, eyes: { mode: t > EK.one ? "wow" : "open", lx: 0.2, ly: 1 }, armL: 20, armR: 135, yaw: -0.2 };
      return { ...base, eyes: { mode: "open", lx: -0.8, ly: 1 }, armL: 140, armR: 15, yaw: -0.6 };
    }
    case "question":
      return { ...base, eyes: { mode: "think", lx: -0.6, ly: 0.9 }, armL: 70 + 12 * Math.sin(t * 6), armR: 15, yaw: 0.35 };
    case "win":
      if (t > T.hw2 - 0.05) return { ...base, eyes: { mode: "happy" }, armL: 168, armR: 168, yaw: 0.15 };
      return { ...base, eyes: { mode: "open", lx: 0.6, ly: 0.9 }, yaw: 0.3 + sway, armR: t > T.nimmt ? 120 : 20 };
    case "hub":
      if (t > T.naechstes - 0.05) return { ...base, eyes: { mode: "glow" }, armR: 140, yaw: 0 };
      return { ...base, eyes: { mode: "happy" }, armL: 150, armR: 150, yaw: 0 };
    case "end": {
      const caught = t > T.schick + 0.25;
      if (t > T.quelle - 0.05) return { ...base, eyes: { mode: "happy" }, armL: 165, armR: 165 };
      if (caught) return { ...base, eyes: { mode: "glow" }, armL: 160 + 6 * Math.sin(t * 5), armR: 160 - 6 * Math.sin(t * 5) };
      return { ...base, eyes: { mode: "open", lx: 0, ly: 1 }, armR: t > T.kw ? 50 + 15 * Math.sin(t * 8) : 15 };
    }
    default:
      return base;
  }
};

// ======================================================================================================
// the world
// ======================================================================================================
type Dyn = { plan: THREE.Texture; counter: THREE.Texture; slots: THREE.Texture[] };
const World: React.FC<{ t: number; hk: number; tex: NonNullable<ReturnType<typeof useRoomTex>>; dyn: Dyn; cam: ReturnType<typeof camAt> }> = ({ t, hk, tex, dyn, cam }) => {
  const id = cam.shot.id;
  const pose = poseAt(t, id, hk);
  const inHook = isHook(id) && t < T.heute;
  const lon = (k: number) => (inHook ? lampOn(hk, k) : 1);
  const lit = inHook ? 0.4 + 0.6 * Math.min(1, (lon(0) + lon(1) + lon(2)) / 3) : 1;
  const light = React.useMemo(() => new THREE.Object3D(), []);
  light.position.set(cam.look[0], 0, cam.look[2] + 1);
  light.updateMatrixWorld();
  const BotHere: React.FC<{ p: V3; s: number; yaw?: number; hold?: React.ReactNode }> = ({ p, s, yaw = 0, hold }) => (
    <Bot p={p} t={t} s={s} yaw={yaw + pose.yaw} eyes={pose.eyes} armL={pose.armL} armR={pose.armR} hop={pose.hop} squash={pose.squash} hold={hold} />
  );
  return (
    <>
      <CameraRig2 pos={cam.pos} look={cam.look} fov={cam.fov} />
      <PostFX fx={{ focus: cam.focus, aperture: isClaude(id) ? 0.55 : id === "chain" || id === "question" ? 0.1 : 0.32, maxBlur: 9, mb: [0, 0], zoom: 0, bloom: 0.3, bloomRadius: 0.55, bloomThreshold: 0.9, chroma: 0.004, grain: 0.022, vignette: 0.34, t }} />
      <EnvLight intensity={0.3} />
      <color attach="background" args={["#0B1020"]} />
      <fog attach="fog" args={["#0B1020", 18, 46]} />
      <ambientLight intensity={0.3 * (0.6 + 0.4 * lit)} color="#9FB4FF" />
      <hemisphereLight args={["#B8CCFF", "#4A2C1C", 0.6]} />
      <primitive object={light} />
      <directionalLight position={[cam.look[0] + 4, 12, cam.look[2] + 12]} target={light} intensity={1.5 * lit} color="#FFD9A8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0004} />
      <directionalLight position={[cam.look[0] - 6, 6, cam.look[2] - 9]} target={light} intensity={1.1} color="#6FE3F0" />
      <Room tex={tex} />

      {/* ---------- set A: GRÜNDUNGSPLAN hub ---------- */}
      {(id === "h1" || id === "h2" || id === "h3" || id === "hub" || id === "end") && (
        <group>
          <Plate3D w={6.9} h={5.25} d={0.22} r={0.4} tex={dyn.plan} body="#111A33" edge={GOLD} glow={0.9} p={[XA, 4.35, -4.62]} />
          {[-3.9, 3.9].map((x) => <mesh key={x} position={[XA + x, 4.35, -4.7]}><boxGeometry args={[0.08, 5.6, 0.08]} /><meshBasicMaterial color={CYAN} toneMapped={false} /></mesh>)}
          <Lamp p={[XA - 3.6, 8.3, -1.0]} t={t} seed={1} on={lon(0)} />
          <Lamp p={[XA + 3.8, 8.0, 0.5]} t={t} seed={2} on={lon(1)} />
          <Lamp p={[XA + 0.2, 9.4, 3.2]} t={t} seed={3} i={14} on={lon(2)} />
          {!isHook(id) && <GlowRing p={[XA, 0, 0.8]} r={1.3} t={t} tex={tex.glow} />}
          {!isHook(id) && <BotHere p={[XA, 0, 0.8]} s={1.15} />}
          {(id === "h1" || id === "h3") && (
            <group>
              <GlowRing p={HOOK_BOT} r={1.4} t={t} tex={tex.glow} k={inHook ? cl((hk - HK.land) / 0.2) * 0.9 + 0.1 : 1} />
              {hk >= HK.drop0 && <BotHere p={HOOK_BOT} s={1.1} />}
              <Burst p={[HOOK_BOT[0], 0.12, HOOK_BOT[2] + 0.3]} t={hk} at={HK.land} n={30} speed={3.6} up={0.6} size={0.13} life={0.8} seed={71} colors={["#D9C3A0", "#B79B76", "#F2E6D0"]} />
              {hk < HK.chair + 0.55 && <Chair p={[HOOK_BOT[0] + 2.1 + 7 * cl((hk - HK.chair) / 0.55) ** 1.5, 0, HOOK_BOT[2] - 0.2]} rot={0.5 + 7 * cl((hk - HK.chair) / 0.55)} />}
              <Lever p={[HOOK_BOT[0] - 2.1, 0, HOOK_BOT[2] - 0.1]} a={-0.6 + 1.2 * back(cl((hk - HK.lever) / 0.18))} />
              <Burst p={[HOOK_BOT[0] - 2.1, 2.0, HOOK_BOT[2]]} t={hk} at={HK.lever + 0.12} n={14} speed={2.4} size={0.07} life={0.6} seed={73} colors={[GOLD, "#FFFFFF"]} />
            </group>
          )}
          {/* side props: shelf with boxes + plant silhouettes for depth */}
          {[-5.6, 5.4].map((x, k) => (
            <group key={x} position={[XA + x, 0, -3.4]}>
              <mesh position={[0, 1.4, 0]} castShadow><boxGeometry args={[1.8, 2.8, 1.0]} /><meshStandardMaterial color="#2A1C14" roughness={0.7} /></mesh>
              {[0, 1, 2].map((j) => <mesh key={j} position={[(j - 1) * 0.5, 2.95 + (j % 2) * 0.1, 0.1]} castShadow><boxGeometry args={[0.42, 0.34 + j * 0.06, 0.5]} /><meshStandardMaterial color={["#C99A6B", SKC.OR, "#E8E2D6"][(j + k) % 3]} /></mesh>)}
            </group>
          ))}
          <Burst p={[XA - 1.9, 6.0, -4.3]} t={t} at={T.das3 + 0.15} n={22} speed={3} size={0.07} seed={51} colors={[GREEN, "#FFFFFF", GOLD]} />
          <Motes t={t} center={[XA, 4, 0]} size={[14, 8, 8]} n={70} seed={3} color="#FFE7C2" s={0.035} />
        </group>
      )}

      {/* ---------- v6 set H: the empty box (hook shot h4) ---------- */}
      {id === "h4" && (
        <group>
          <Lamp p={[XH + 0.3, 6.6, -0.6]} t={t} seed={4} i={22} />
          <GlowRing p={[XH + 1.0, 0, -0.3]} r={1.1} t={t} tex={tex.glow} />
          <BotHere p={[XH + 1.0, 0, -0.3]} s={0.95} yaw={-0.55} />
          <CardBox p={[XH - 0.85, 0, 0.3]} hk={hk} />
          <Burst p={[XH - 0.85, 1.0, 0.3]} t={hk} at={HK.dust} n={36} speed={1.5} up={2.3} size={0.17} life={1.2} seed={61} colors={["#8E877A", "#B9B09C", "#6E685C", "#D2C9B5"]} />
          <Moth p={[XH - 0.85, 1.0, 0.3]} hk={hk} />
          {[-3.2, 3.4].map((x, k) => (
            <group key={x} position={[XH + x, 0, -2.6]}>
              <mesh position={[0, 1.4, 0]} castShadow><boxGeometry args={[1.6, 2.8, 1.0]} /><meshStandardMaterial color="#2A1C14" roughness={0.7} /></mesh>
              {[0, 1, 2].map((j) => <mesh key={j} position={[(j - 1) * 0.45, 2.95 + (j % 2) * 0.1, 0.1]} castShadow><boxGeometry args={[0.38, 0.32 + j * 0.06, 0.45]} /><meshStandardMaterial color={["#C99A6B", SKC.OR, "#E8E2D6"][(j + k) % 3]} /></mesh>)}
            </group>
          ))}
          <Motes t={t} center={[XH, 2, 0]} size={[8, 5, 5]} n={40} seed={5} color="#FFE7C2" s={0.03} />
        </group>
      )}

      {/* ---------- set C: product slots + counter (research / win) ---------- */}
      {(id === "research" || id === "win" || id === "question") && (
        <group>
          <mesh position={[XC, 4.2, -4.82]} receiveShadow><boxGeometry args={[8.6, 4.6, 0.2]} /><meshStandardMaterial color="#202C50" roughness={0.8} /></mesh>
          <mesh position={[XC, 4.2, -4.9]}><boxGeometry args={[8.9, 4.9, 0.1]} /><meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.4} /></mesh>
          {CANDS.map((_, i) => {
            const s = slotState(t, i);
            const fillK = back((t - FILL_AT(i)) / 0.35);
            const p = slotPos(i);
            const keepK = i === KEEP ? s.keep : 0;
            const fly = i === KEEP && id === "win" ? inOut(cl((t - T.hw2 + 0.02) / 0.4)) : 0; // v7 act F: FIRMENSHIRTS flies to the front
            const wk = i === KEEP && id === "win" ? inOut(cl((t - (T.warum - 0.15)) / 0.5)) : 0; // Warum-Beat: Wahl bleibt stehen, rückt nach oben
            const hideW = id === "question" ? 1 : i !== KEEP && id === "win" ? inOut(cl((t - (T.warum - 0.25)) / 0.4)) : 0;
            const sc = Math.max(0.001, 1 - hideW) * (s.fill ? Math.max(0.001, Math.min(1.2, fillK)) * (1 + 0.1 * keepK) : 1) * (1 + 0.55 * fly) * (1 - 0.22 * wk);
            return (
              <group key={i}>
                <Plate3D w={SLOT_W} h={SLOT_H} d={s.fill ? 0.1 : 0.02} r={0.3} tex={dyn.slots[i]} body={s.fill ? "#FFFFFF" : "#1A2547"} edge={s.fill ? SKC.INK : "#1A2547"} glow={s.fill ? 0.3 : 0.8} shadow={!(id === "win" || id === "question")}
                  p={[p[0] + (XC - p[0]) * fly, p[1] + (4.3 - p[1]) * fly + 1.85 * wk, p[2] + 0.12 + 0.35 * keepK + 2.6 * fly]} rot={[0, 0, (rnd(i + 3) - 0.5) * 0.08 + 0.02 * Math.sin(t * 1.5 + i)]} s={sc} />
                {s.fill > 0 && <Burst p={[p[0], p[1], p[2] + 0.4]} t={t} at={FILL_AT(i)} n={10} speed={2} size={0.08} seed={i + 20} colors={[CYAN, "#FFFFFF", GOLD]} />}
              </group>
            );
          })}
          {/* green check bar across the keeper */}
          {(() => {
            const k = ease((t - T.hw2 - 0.1) / 0.35);
            if (k <= 0.001 || id === "win") return null;
            const p = slotPos(KEEP);
            return (
              <group position={[p[0], p[1] + SLOT_H / 2 + 0.32, p[2] + 0.6]}>
                <mesh scale={[k, 1, 1]}><boxGeometry args={[SLOT_W + 0.4, 0.09, 0.06]} /><meshBasicMaterial color={GREEN} toneMapped={false} /></mesh>
                <mesh scale={back((t - T.hw2 - 0.25) / 0.3)}><cylinderGeometry args={[0.3, 0.3, 0.08, 32]} /><meshBasicMaterial color={GREEN} toneMapped={false} /></mesh>
              </group>
            );
          })()}
          {/* counter */}
          {(() => {
            const k = back((t - (T.claude2 - 0.1)) / 0.4);
            if (id === "win" || id === "question") return null;
            return <Plate3D w={3.2} h={1.6} d={0.2} r={0.24} tex={dyn.counter} body="#0E1428" edge={GOLD} glow={1.0} p={[XC + 1.9, 7.55 - (1 - Math.min(1, k)) * 3, -4.3]} rot={[0, 0, 0.03 * Math.sin(t * 1.2)]} s={Math.max(0.001, Math.min(1.1, k))} />;
          })()}
          {/* stamp */}
          {(() => {
            const k = back((t - (T.hw2 + 0.05)) / 0.3);
            if (k <= 0.001 || id === "question") return null;
            return <Plate3D w={4.2} h={1.08} d={0.1} r={0.3} tex={tex.stamp} glow={0} p={[XC, 7.45, -4.0]} rot={[0, 0, -0.05]} s={Math.max(0.001, 2.2 - 1.2 * Math.min(1, k))} />;
          })()}
          <Burst p={[XC + 2.6, 2.4, -3.8]} t={t} at={T.hw2 + 0.08} n={44} speed={4.2} size={0.16} up={2.4} seed={61} life={1.6} colors={[SKC.OR, GOLD, "#FFFFFF", GREEN, CYAN]} />
          <Burst p={[XC - 1.4, 3.0, 1.5]} t={t} at={T.hw2 + 0.12} n={30} speed={3.6} size={0.12} up={2.2} seed={62} life={1.5} colors={[SKC.OR, GOLD, "#FFFFFF", GREEN]} />
          <Lamp p={[XC - 2.4, 8.4, -1.2]} t={t} seed={4} />
          <Lamp p={[XC + 2.8, 8.1, -0.2]} t={t} seed={5} />
          <GlowRing p={[XC - 1.2, 0, -0.4]} r={1.15} t={t} tex={tex.glow} />
          {id === "question" && <QuestionCard t={t} tex={tex} />}
          <BotHere p={id === "question" ? [XC + 1.25, -40, -0.2] : [XC - 1.2 - 5.5 * (id === "win" ? inOut(cl((t - (T.warum - 0.25)) / 0.45)) : 0), 0, -0.4]} s={1.05} yaw={id === "question" ? -0.35 : 0.15} hold={
            id === "question" ? (
              <group position={[-1.0, 2.25, 0]} scale={back((t - (T.offen + 0.2)) / 0.35)}>
                <Plate3D w={0.9} h={0.7} d={0.08} r={0.3} tex={tex.bubbleQ} glow={0.9} rot={[0, 0, 0.12 + 0.05 * Math.sin(t * 4)]} />
              </group>
            ) :
            id === "research" && t < T.q260 ? (
              <group position={[1.0, 2.25, 0]} scale={back((t - (SEND + 0.35)) / 0.35)}>
                <Plate3D w={0.9} h={0.7} d={0.08} r={0.3} tex={tex.bubbleQ} glow={0.9} rot={[0, 0, -0.12 + 0.05 * Math.sin(t * 4)]} />
              </group>
            ) : id === "win" && t > T.hw2 - 0.05 ? (
              <ShirtUp p={[0, 2.25 + 0.12 * back((t - T.hw2 + 0.05) / 0.35), 0.35]} s={Math.max(0.001, back((t - T.hw2 + 0.05) / 0.35)) * 0.72} rot={[0, 0, 0.06 * Math.sin(t * 5)]} logo={tex.shirtLogo} />
            ) : undefined
          } />
          <Motes t={t} center={[XC, 4, 0]} size={[14, 8, 8]} n={70} seed={5} color="#FFE7C2" s={0.035} />
        </group>
      )}

      {/* ---------- v7 set E: Pfeil-Kette (Kunde → Partner druckt 1 Stück → Paket direkt zum Kunden) ---------- */}
      {id === "chain" && <ChainSet t={t} tex={tex} pose={pose} />}

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
const HUD: React.FC<{ t: number; cover?: boolean }> = ({ t, cover = false }) => {
  const done = back((t - (T.hw2 + 0.1)) / 0.35);
  const next = 0;
  const pop = 1 + 0.22 * bump(t, HK.fly1 + 0.03, 0.3);
  return (
    <>
      {(cover || t >= HK.fly1) && <div style={{ position: "absolute", left: 34, top: 40, width: 150, height: 150, borderRadius: 30, background: "#0E1428", border: `7px solid ${GOLD}`, boxShadow: "0 8px 0 rgba(0,0,0,.45), 0 0 30px rgba(232,182,76,.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(-4deg) scale(${pop})` }}>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: "#F6EEDC", letterSpacing: 3, marginTop: 2 }}>TAG</div>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 92, color: GOLD, lineHeight: 0.9, marginTop: -2 }}>1</div>
      </div>}
      {UMSATZ > 0 && (cover || t >= HK.fly1) && (
        <div style={{ position: "absolute", left: 200, top: 58, padding: "10px 22px", borderRadius: 22, background: "#0E1428", border: `6px solid ${GOLD}`, boxShadow: "0 6px 0 rgba(0,0,0,.45)", fontFamily: pixelFont, fontWeight: 800, color: "#F6EEDC", transform: "rotate(-2deg)" }}>
          <div style={{ fontSize: 26, letterSpacing: 2 }}>UMSATZ · TAG 1 / 100</div>
          <div style={{ fontSize: 58, color: GOLD, lineHeight: 1 }}>{UMSATZ.toLocaleString("de-DE")} €</div>
        </div>
      )}
      <div style={{ position: "absolute", right: 34, top: 40, display: "grid", gridTemplateColumns: "repeat(3, 40px)", gap: 6, padding: 10, background: "#0E1428", border: `5px solid ${GOLD}88`, borderRadius: 16, boxShadow: "0 6px 0 rgba(0,0,0,.4)" }}>
        {PLAN.map((_, i) => {
          const cur = i === CUR, prev = i < CUR, isNext = i === CUR + 1 && next > 0.01;
          const bg = prev ? GREEN : cur ? (done > 0.5 ? GREEN : GOLD) : isNext ? CYAN : "rgba(255,255,255,.1)";
          return (
            <div key={i} style={{ width: 40, height: 40, borderRadius: 8, background: bg, color: cur || prev || isNext ? "#10162A" : "rgba(255,255,255,.35)", fontFamily: pixelFont, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", transform: cur ? `scale(${1 + 0.25 * bump(t, T.hw2 + 0.2, 0.35)})` : undefined, boxShadow: cur ? `0 0 ${14 + 10 * Math.sin(t * 5)}px ${done > 0.5 ? GREEN : GOLD}` : undefined }}>
              {prev || (cur && done > 0.5) ? (
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
// ---------- v6 hook overlays: headline, GANZ-ALLEINE stamp, TAG-1 slam → badge, PRODUKT tile ----------
const shakeAt = (t: number, cover: boolean) => {
  if (cover) return undefined;
  const sh = (a: number, amp: number, ph = 0) => { const u = t - a; return u < 0 || u > 0.5 ? 0 : amp * Math.exp(-11 * u) * Math.sin(70 * u + ph); };
  const x = sh(HK.stamp, 16) + sh(HK.slam, 14) + sh(HK.land, 5);
  const y = sh(HK.stamp, 11, 1.3) + sh(HK.slam, 12, 1.3) + sh(HK.land, 12, 1.3);
  if (Math.abs(x) + Math.abs(y) < 0.05) return undefined;
  return `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(1.03)`;
};
const HookV6: React.FC<{ t: number; id: ShotId; cover: boolean }> = ({ t, id, cover }) => {
  const fl = (s: number) => Math.sin(t * 2.2 + s) * 4;
  const firma = cover ? 1 : back(cl((t - HK.firma) / 0.22));
  const st = cover ? 1 : cl((t - HK.stamp) / 0.15);
  const showStamp = (id === "h1" || id === "h2" || id === "h3") && (cover || t >= HK.stamp);
  const flash = (a: number, k: number) => { const u = t - a; return u < 0 || u > 0.4 ? 0 : k * Math.exp(-10 * u); };
  const fA = cover ? 0 : flash(HK.slam, 0.5) + flash(HK.stamp, 0.18);
  // TAG 1 slam → flies into the corner badge
  const tg = t - HK.slam;
  const showTag = !cover && HK.slam > 0 && tg >= 0 && t < HK.fly1;
  const f = inOut(cl((t - HK.fly0) / (HK.fly1 - HK.fly0)));
  const slam = 2.3 - 1.3 * ease(cl(tg / 0.14));
  const tx = 540 + (109 - 540) * f, ty = 650 + (115 - 650) * f, ts = 460 + (150 - 460) * f;
  const one = back(cl((t - HK.one) / 0.2));
  const onePop = 1 + 0.15 * bump(t, HK.one + 0.08, 0.25);
  // PRODUKT tile (h4)
  const pu = inOut(cl((t - HK.tile) / 0.3));
  const px = 965 + (540 - 965) * pu, py = 75 + (420 - 75) * pu, pw = 40 + (580 - 40) * pu, ph = 40 + (400 - 40) * pu;
  const qk = 1 + 0.7 * bump(t, HK.q + 0.06, 0.32);
  const qw = 8 * Math.sin((t - HK.q) * 18) * Math.exp(-Math.max(0, t - HK.q) * 4) * (t > HK.q ? 1 : 0);
  return (
    <>
      {id === "h1" && (
        <div style={{ position: "absolute", left: 0, right: 0, top: cover ? 300 : 215, textAlign: "center" }}>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 112, lineHeight: 1.0, color: "#FFFFFF", letterSpacing: -1, ...stroke(15), textShadow: "0 10px 0 #0B1020, 0 0 40px rgba(0,0,0,.6)", transform: `translateY(${fl(0)}px)` }}>
            Wie viel <span style={{ display: "inline-block", color: "#FF8A57", transform: `scale(${firma})` }}>Umsatz</span>
            <br />
            macht eine <span style={{ display: "inline-block", transform: `scale(${1 + 0.1 * bump(t, HK.land + 0.06, 0.3)})` }}>KI</span>
            <br />
            in <span style={{ color: GOLD }}>100 Tagen?</span>
          </div>
        </div>
      )}
      {showStamp && (
        <div style={{ position: "absolute", left: 0, right: 0, top: id === "h1" ? (cover ? 700 : 540) : 250, textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "14px 44px 20px", borderRadius: 26, background: SKC.OR, border: "9px solid #0B1020", outline: "4px dashed rgba(255,255,255,.75)", outlineOffset: -22, boxShadow: "0 10px 0 rgba(0,0,0,.5)", fontFamily: pixelFont, fontWeight: 800, fontSize: 96, color: "#FFFFFF", letterSpacing: 2, ...stroke(10), transform: `rotate(-6deg) scale(${2.4 - 1.4 * ease(st)})`, opacity: st > 0 ? 1 : 0 }}>
            GANZ ALLEINE.
          </div>
        </div>
      )}
      {showTag && (
        <>
          <div style={{ position: "absolute", left: 540 - 700, top: 650 - 700, width: 1400, height: 1400, borderRadius: "50%", opacity: (1 - f) * Math.min(1, tg / 0.08) * 0.7, transform: `rotate(${tg * 30}deg)`, background: "repeating-conic-gradient(from 0deg, rgba(255,214,120,.42) 0deg 7deg, rgba(255,214,120,0) 7deg 20deg)", WebkitMaskImage: "radial-gradient(circle, #000 18%, rgba(0,0,0,0) 62%)" }} />
          <div style={{ position: "absolute", left: tx - ts / 2, top: ty - ts / 2, width: ts, height: ts, borderRadius: ts * 0.2, background: "#0E1428", border: `${ts * 0.047}px solid ${GOLD}`, boxShadow: `0 ${ts * 0.05}px 0 rgba(0,0,0,.45), 0 0 ${ts * 0.3}px rgba(232,182,76,.55)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(${-4 * f - 3 * (1 - f)}deg) scale(${slam * onePop})` }}>
            <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: ts * 0.2, color: "#F6EEDC", letterSpacing: ts * 0.02, marginTop: ts * 0.013 }}>TAG</div>
            <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: ts * 0.61, color: GOLD, lineHeight: 0.9, marginTop: -ts * 0.013, transform: `scale(${one})`, opacity: t >= HK.one ? 1 : 0 }}>1</div>
          </div>
        </>
      )}
      {id === "h3" && !cover && t >= TH.rc - 0.05 && (() => {
        const kk = back((t - TH.rcShirt + 0.25) / 0.4), k2 = back((t - TH.rcDruck) / 0.35);
        return (
          <div style={{ position: "absolute", left: 545, top: 760, width: 500, transform: `rotate(4deg) scale(${Math.max(0.001, kk)})`, transformOrigin: "50% 60%" }}>
            <div style={{ background: "#FFFDF8", border: "8px solid #0B1020", borderRadius: 34, boxShadow: "0 12px 0 rgba(0,0,0,.5)", padding: "18px 18px 22px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="#0B1020" strokeWidth="1.3" strokeLinejoin="round"><path d="M8 3 L4 5.5 L2 10 L5.5 11.5 L6 21 H18 L18.5 11.5 L22 10 L20 5.5 L16 3 C15 5 9 5 8 3 Z" fill="#F2F0EA" /><circle cx="12" cy="11.5" r="3.3" fill="#FF6B35" /><path d="M10.6 11.3 h0.01 M13.4 11.3 h0.01" stroke="#0B1020" strokeWidth="1.1" strokeLinecap="round" /></svg>
              <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 54, color: SKC.INK, lineHeight: 1, whiteSpace: "nowrap" }}>LOGO-SHIRTS</div>
              <div style={{ marginTop: 14, padding: "6px 20px 10px", borderRadius: 16, background: SKC.OR, border: "5px solid #0B1020", fontFamily: pixelFont, fontWeight: 800, fontSize: 36, lineHeight: 1.1, textAlign: "center", color: "#fff", transform: `scale(${Math.max(0.001, k2)})` }}>erst auf Bestellung<br />gedruckt</div>
            </div>
          </div>
        );
      })()}
      {id === "h4" && t >= HK.tile && (
        <div style={{ position: "absolute", left: px - pw / 2, top: py - ph / 2, width: pw, height: ph, borderRadius: pw * 0.07, background: "#463818", border: `${Math.max(3, pw * 0.022)}px solid ${GOLD}`, boxShadow: `0 ${ph * 0.03}px 0 rgba(0,0,0,.5), 0 0 ${pw * 0.08}px rgba(232,182,76,.6)`, overflow: "hidden", transform: `rotate(${-3 * pu}deg)` }}>
          <div style={{ position: "absolute", left: pw * 0.07, top: ph * 0.04, fontFamily: "Rubik", fontWeight: 900, fontSize: ph * 0.36, color: GOLD, lineHeight: 1 }}>2</div>
          <div style={{ position: "absolute", left: pw * 0.07, bottom: ph * 0.09, fontFamily: "Rubik", fontWeight: 900, fontSize: ph * 0.17, color: "#FFFFFF", lineHeight: 1 }}>KUNDE</div>
          <div style={{ position: "absolute", right: pw * 0.08, top: ph * 0.02, fontFamily: "Rubik", fontWeight: 900, fontSize: ph * 0.42, color: GOLD, lineHeight: 1, transform: `scale(${qk}) rotate(${qw}deg)`, transformOrigin: "50% 60%" }}>?</div>
        </div>
      )}
      {fA > 0.005 && <div style={{ position: "absolute", inset: 0, background: "#FFF6E0", opacity: fA }} />}
    </>
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
  const k2 = inOut((t - (TS.zweitens - 0.1)) / 0.45);
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
const cursorVis = (t: number) => Math.max(cl((t - TS.erstens) / 0.2) * (1 - cl((t - T.an - 0.45) / 0.2)), cl((t - (SEND - 0.75)) / 0.2));

const Tape: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 150, height: 46, background: "rgba(240,226,190,.82)", boxShadow: "0 2px 6px rgba(0,0,0,.25)", transform: `rotate(${rot}deg)`, borderLeft: "3px dashed rgba(0,0,0,.08)", borderRight: "3px dashed rgba(0,0,0,.08)" }} />
);

const ClaudeWindow: React.FC<{ t: number; id: ShotId; u: number }> = ({ t, id, u }) => {
  const settle = 1 + 0.025 * (1 - ease(u / 0.4));
  const g = inputGeom(t);
  const typed = typedAt(PROMPT_KEYS, t);
  const step = t < TS.zweitens - 0.05 ? 1 : t < TS.drittens - 0.05 ? 2 : 3;
  const promptMarks = [
    { find: "Im Anhang ist meine Recherche von gestern.", at: T.frag + 0.05, color: "blue" as const },
    { find: "drei Branchen", at: T.drei, color: "yellow" as const },
    { find: "wie oft bestellen sie nach?", at: T.wie, color: "orange" as const },
  ];
  const complete = <span style={{ color: INK }}>Research complete • <b style={{ color: CLAUDE_ORANGE }}>264</b> sources • 7m 0s</span>;
  const chipK = back((t - (T.bericht - 0.12)) / 0.4);
  const CHIP_H = 190;
  return (
    <div style={{ position: "absolute", left: WIN_X, top: WIN_Y, width: WIN_W, height: id === "answer" ? 720 : WIN_H, transform: `scale(${settle}) rotate(-0.6deg)`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, boxShadow: "0 30px 60px rgba(0,0,0,.55), 0 0 0 7px #0B1020, 0 0 70px rgba(255,190,120,.25)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden" }}>
        <CrumpledPaper w={WIN_W} h={id === "answer" ? 720 : WIN_H} strength={0.45}>
          {id === "claudeA" && (
            <>
              {t < TS.zweitens + 0.4 && (() => {
                const k = back((t - (T.heute - 0.05)) / 0.45) * (1 - ease((t - TS.zweitens + 0.05) / 0.3));
                return (
                  <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, k * 1.4), transform: `scale(${0.6 + 0.4 * k})` }}>
                    <Img src={staticFile("logos/claude.svg")} style={{ width: 190, height: 190, transform: `rotate(${(t - T.claude) * 25}deg)` }} />
                    <div style={{ marginTop: 22, fontFamily: claudeSerif, fontWeight: 500, fontSize: 70, color: INK }}>How can I help you today?</div>
                  </div>
                );
              })()}
              <InputCard top={g.top} bottom={g.bot} t={t} focus={t > T.bericht - 0.3 && t < SEND} fontSize={PROMPT_FS}
                showPlaceholder={typed === 0 && t < T.bericht - 0.12} placeholder="How can I help you today?"
                research={cl((t - (T.research + 0.12)) / 0.3)} plusPress={bump(t, T.plus + 0.04, 0.14)} sendPress={bump(t, SEND + 0.04, 0.14)} sent={t > SEND}>
                {chipK > 0.001 && (
                  <div style={{ height: CHIP_H, transform: `translateY(${(1 - Math.min(1, chipK)) * 260}px) scale(${Math.max(0.001, chipK)})`, transformOrigin: "0% 100%" }}>
                    <div style={{ width: 330, height: 168, boxSizing: "border-box", borderRadius: 22, border: `5px solid ${INK}`, background: "#F6F1E8", padding: "14px 18px", position: "relative", boxShadow: "0 6px 0 rgba(0,0,0,.18)" }}>
                      <div style={{ fontFamily: pixelFont, fontWeight: 600, fontSize: 25, lineHeight: 1.18, color: INK, height: 90, overflow: "hidden" }}>{ATTACH}</div>
                      <div style={{ position: "absolute", left: 18, bottom: 12, padding: "0 12px", borderRadius: 8, border: `3px solid ${INK}`, background: "#FFFFFF", fontFamily: pixelFont, fontWeight: 800, fontSize: 24, color: INK }}>MD</div>
                    </div>
                  </div>
                )}
                {typed > 0 ? (() => {
                  const visible = Math.floor((g.bot - g.top - 126 - CHIP_H) / (PROMPT_FS * PROMPT_LH));
                  const ln = promptLineOf()[Math.min(PROMPT.length - 1, typed - 1)];
                  const scroll = Math.max(0, ln - visible + 1) * PROMPT_FS * PROMPT_LH;
                  return <div style={{ height: g.bot - g.top - 126 - CHIP_H, overflow: "hidden" }}><div style={{ transform: `translateY(${-scroll}px)`, fontSize: PROMPT_FS, lineHeight: PROMPT_LH }}><MarkedText text={PROMPT} n={typed} t={t} marks={promptMarks} caret={t < SEND} /></div></div>;
                })() : null}
              </InputCard>
              <PlusMenu t={t} open={T.plus + 0.1} close={T.an + 0.22} top={MENU_TOP} hot="Research" hotAt={T.research - 0.25} onAt={T.research + 0.12} />
            </>
          )}
          {id === "answer" && (
            <div style={{ position: "absolute", left: 34, right: 34, top: 140 }}>
              <ResearchCard t={t} title={R_TITLE} running={false} compact status={complete} />
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginTop: 30 }}>
                <Img src={staticFile("logos/claude.svg")} style={{ width: 56, height: 56, marginTop: 6 }} />
                <div style={{ fontFamily: pixelFont, fontWeight: 700, fontSize: 64, lineHeight: 1.25, color: INK }}>
                  <MarkedText text={ANSWER} t={t} dim={0.55 * ease((t - T.statistik + 0.1) / 0.3)} marks={[
                    { find: "Eine direkte Statistik dazu", at: T.statistik - 0.1, color: "yellow" },
                    { find: "gibt es für Deutschland nicht", at: T.nicht - 0.05, color: "red" },
                                      ]} />
                </div>
              </div>
            </div>
          )}
          <WindowBar t={t} enter={-1} top={24} chip={id === "claudeA" && t > TS.erstens - 0.1
            ? <StepChipBar key={step} t={t} n={step} label={["RESEARCH", "BERICHT", "FRAGE"][step - 1]} at={[TS.erstens, TS.zweitens, TS.drittens][step - 1]} done={SEND} />
            : id !== "claudeA" ? <div style={{ padding: "6px 20px", borderRadius: 30, background: GREEN, border: `5px solid ${INK}`, fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: "#fff" }}>Research</div> : null} />
          {id === "claudeA" && (
            <div style={{ position: "absolute", inset: 0, opacity: cursorVis(t) }}>
              <ClickPath t={t} clicks={CLICKS} start={{ t: TS.erstens, x: 560, y: 1300 }} />
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
  const a = TS.drittens + 0.3, b = SEND - 0.1;
  const kin = back((t - a) / 0.45), kout = ease((t - b) / 0.25);
  if (kin <= 0.001 || kout >= 0.999) return null;
  const k = Math.max(0, kin) * (1 - kout);
  return (
    <div style={{ position: "absolute", left: 40, top: 1610, width: 470, transform: `rotate(${-4 + Math.sin(t * 2.2) * 1.2}deg) scale(${k})`, transformOrigin: "30% 50%" }}>
      <div style={{ background: "#FFFFFF", borderRadius: 30, padding: 10, boxShadow: "0 12px 0 rgba(0,0,0,.45)" }}>
        <div style={{ background: "#FFF6E8", border: `5px solid ${INK}`, borderRadius: 22, padding: "12px 20px 16px", textAlign: "center" }}>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 46, lineHeight: 1.06, color: INK }}>Alle 3 Schritte<br />zum Kopieren</div>
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
  const resK = back((t - (T.damit - 0.15)) / 0.4);
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
        const a = T.drei2 + i * 0.22;
        const k = back((t - a) / 0.45);
        if (k <= 0.001) return null;
        const ty = 520 + i * 196;
        const fy = lerp(BOT_SCREEN.y - 200, ty, Math.min(1, k)), fx = lerp(BOT_SCREEN.x - 490, 50, Math.min(1, k));
        const copied = cl((t - (T.schritte + 0.25 + i * 0.12)) / 0.15);
        return (
          <Die key={f.n} style={{ left: fx, width: 980, top: fy, transform: `rotate(${(i - 1) * 1.2 + (1 - Math.min(1, k)) * 10}deg) scale(${0.5 + 0.5 * k})`, transformOrigin: "50% 50%" }}
            inner={{ background: "#FFFDF8", height: 158, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 18, padding: "10px 20px 10px 24px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ padding: "2px 16px 4px", borderRadius: 14, background: CLAUDE_ORANGE, border: `4px solid ${INK}`, color: "#fff", fontFamily: pixelFont, fontWeight: 800, fontSize: 34 }}>SCHRITT {f.n}</div>
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
          <div style={{ fontSize: 58 }}><span style={segStyle(T.branchen2, true)}>→ deine beste Kundenbranche</span></div>
          <div style={{ fontSize: 44, display: "flex", gap: 14 }}>
            <span style={segStyle(T.quelle, true)}>mit Quelle</span><span style={{ opacity: 0.6 }}>·</span><span style={segStyle(T.zehn)}>in 10 Min</span>
          </div>
        </div>
      )}
    </>
  );
};


// ---------- Frage-Shot: Marker unter der offenen Frage (sichtbares Ereignis in der Sprechpause) ----------
const QMarker: React.FC<{ t: number }> = ({ t }) => {
  const a = T.bestellen2 + 0.7, k = ease((t - a) / 0.35);
  if (k <= 0.001) return null;
  return (
    <svg style={{ position: "absolute", left: 170, top: QM_Y, width: 740, height: 60, overflow: "visible" }} viewBox="0 0 740 60">
      <path d="M8 34 C 180 18, 420 22, 732 26" fill="none" stroke={CLAUDE_ORANGE} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
    </svg>
  );
};
// ---------- Warum-Beat: Gründe für die Wahl, je Karte Bild + 1-3 Wörter, nacheinander (Zahlen aus dem echten Lauf) ----------
const QM_Y = 915; // Tag 2
const WhyIcon: React.FC<{ k: number }> = ({ k }) => (
  <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round">
    {k === 0 && <><rect x="2.5" y="10" width="6" height="11" fill="#F5C542" /><rect x="9" y="5" width="6.5" height="16" fill="#FF8A57" /><rect x="16" y="12" width="5.5" height="9" fill="#6FB8FF" /><path d="M1.5 21 H22.5" /></>}
    {k === 1 && <><path d="M8 3 L4 5.5 L2 10 L5.5 11.5 L6 21 H18 L18.5 11.5 L22 10 L20 5.5 L16 3 C15 5 9 5 8 3 Z" fill="#F2F0EA" /><circle cx="12" cy="11.5" r="3" fill="#2E6BD8" /></>}
    {k === 2 && <><path d="M19.5 9 A8 8 0 0 0 5 7" /><path d="M5 3 V7 H9" /><path d="M4.5 15 A8 8 0 0 0 19 17" /><path d="M19 21 V17 H15" /><text x="12" y="14.6" fontSize="7" fontWeight="900" textAnchor="middle" fill={INK} stroke="none" fontFamily="Rubik">1–2×</text></>}
  </svg>
);
const WHY = [
  { big: "300.000+", small: "kleine Baubetriebe" },
  { big: "Shirt = Werbung", small: "beim Kunden vor Ort" },
  { big: "1–2× pro Jahr", small: "bestellen sie nach" },
];
const WhyCards: React.FC<{ t: number }> = ({ t }) => {
  const head = back((t - (T.warum - 0.05)) / 0.4);
  const at3 = [T.r1, T.r2, T.r3];
  if (head <= 0.001) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", transform: `scale(${Math.max(0, head)}) rotate(-2deg)` }}>
        <div style={{ display: "inline-block", padding: "8px 36px 14px", borderRadius: 24, background: SKC.OR, border: "8px solid #0B1020", boxShadow: "0 9px 0 rgba(0,0,0,.5)", fontFamily: pixelFont, fontWeight: 800, fontSize: 76, color: "#fff", ...stroke(8) }}>WARUM HANDWERK?</div>
      </div>
      {WHY.map((w, i) => {
        const k = back((t - (at3[i] - 0.08)) / 0.4);
        if (k <= 0.001) return null;
        const hot = 1 + 0.06 * bump(t, at3[i] + 0.15, 0.3);
        return (
          <Die key={i} style={{ left: 70, right: 70, top: 975 + i * 190, transform: `translateX(${(1 - Math.min(1, k)) * (i % 2 ? 300 : -300)}px) scale(${Math.max(0.001, k) * hot}) rotate(${(i - 1) * 1.1}deg)` }}
            inner={{ background: "#FFFDF8", height: 160, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 22, padding: "0 26px" }}>
            <WhyIcon k={i} />
            <div>
              <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 62, lineHeight: 1, color: i === 0 ? CLAUDE_ORANGE : INK }}>{w.big}</div>
              <div style={{ fontFamily: pixelFont, fontWeight: 600, fontSize: 36, color: "#4E4840", marginTop: 6 }}>{w.small}</div>
            </div>
            <div style={{ marginLeft: "auto", width: 64, height: 64, borderRadius: 32, background: GREEN, border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 36, color: "#fff" }}>{i + 1}</div>
          </Die>
        );
      })}
    </>
  );
};

// ======================================================================================================
// composition
// ======================================================================================================
export const FirmaTag2: React.FC<FirmaTag2Props> = ({ keyword = "Kunde", cover = false }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ready = useFontsReady(["800 70px Rubik", "900 70px Rubik", "600 40px Rubik", `800 40px ${pixelFont}`]);
  useImage(staticFile("logos/claude.svg"));
  const tex = useRoomTex(ready);
  const hk = cover ? COVER_HK : t;
  const ps = planState(t, hk);
  const plan = useDyn(1600, 1220, (c) => ready && drawPlan(c, 1600, 1220, ps, t));
  const qv = 264 * ease((t - (T.claude2 - 0.1)) / (T.q260 + 0.55 - T.claude2));
  const counter = useDyn(800, 400, (c) => ready && drawCounter(c, 800, 400, Math.max(0, qv), "QUELLEN", bump(t, T.quellen, 0.4)));
  const s0 = useDyn(600, 460, (c) => ready && drawSlot(c, 600, 460, CANDS[0], slotState(t, 0), t));
  const s1 = useDyn(600, 460, (c) => ready && drawSlot(c, 600, 460, CANDS[1], slotState(t, 1), t));
  const s2 = useDyn(600, 460, (c) => ready && drawSlot(c, 600, 460, CANDS[2], slotState(t, 2), t));
  const s3 = useDyn(600, 460, (c) => ready && drawSlot(c, 600, 460, CANDS[3], slotState(t, 3), t));

  const cam0 = camAt(t);
  const cam = cover ? { ...cam0, pos: [cam0.pos[0], cam0.pos[1] + 2.0, cam0.pos[2]] as V3, look: [cam0.look[0], cam0.look[1] + 2.0, cam0.look[2]] as V3 } : cam0;
  const id = cam.shot.id;
  return (
    <AbsoluteFill style={{ background: "#0B1020" }}>
      <AbsoluteFill style={{ transform: shakeAt(t, cover) }}>
      {tex && (
        <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
          <World t={t} hk={hk} tex={tex} dyn={{ plan, counter, slots: [s0, s1, s2, s3] }} cam={cam} />
        </ThreeCanvas>
      )}
      {isClaude(id) && <ClaudeWindow t={t} id={id} u={cam.shot.u} />}
      {id === "claudeA" && !cover && <ReHook t={t} />}
      {isHook(id) && t < T.heute && <HookV6 t={t} id={id} cover={cover} />}
      </AbsoluteFill>
      {id === "win" && !cover && <WhyCards t={t} />}
      {id === "question" && !cover && <QMarker t={t} />}
      {id === "end" && <EndCard t={t} keyword={keyword} />}
      <HUD t={t} cover={cover} />
      {cover && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "10px 40px 16px", borderRadius: 24, background: "#FFFDF8", border: "8px solid #0B1020", boxShadow: "0 9px 0 rgba(0,0,0,.5)", fontFamily: pixelFont, fontWeight: 800, fontSize: 60, color: "#0B1020", transform: "rotate(-2deg)" }}>Wer kauft die Shirts?</div>
        </div>
      )}
      {!cover && <PillCaptions words={CAPTIONS} theme={THEMES.night} y={id === "win" && t > T.warum - 0.2 ? 1660 : 1400} />}
    </AbsoluteFill>
  );
};
