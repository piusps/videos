// Superkind series "100 KI-Agenten", Tag 1/5 (2026-10-21). Same toy-3D language as TrainerWorld3D (one continuous
// world, camera flights instead of cuts), but in Superkind branding: warm white world, #FF6B35 agents (3D version of
// our PixelBot), Inter type, Superkind chat UI. Outcome first: the finished website is shown before the "how".
// Series hint stays low-key: 5 islands on the map + a small "TAG 1/5" chip + the teaser for tomorrow.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CameraRig, ToyBox, canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, Word, PixelTheme } from "../components/PixelKit";
import words from "../../public/sk100/words.json";

export const AGENTS_DAY1_SECONDS = 38; // 33 with the Ava voice; Florent voice + reward line (2026-10-21) ends at 36.0 s
const W = 1080, H = 1920;
type V3 = [number, number, number];
const OR = "#FF6B35", OR_D = "#E5521F", OR_L = "#FFEDE4", INK = "#16130F", MUTED = "#8A857D", LINE = "#EEEAE4", GREEN = "#1F9D55";
const F_B = "Inter-Bold", F_S = "Inter-SemiBold", F_M = "Inter-Medium";
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - Math.pow(1 - cl(v), 3);
const inOut = (v: number) => { const x = cl(v); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = (v: number) => { const x = cl(v); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const rnd = (i: number) => { const v = Math.sin(i * 91.7 + 47.3) * 43758.5453; return v - Math.floor(v); };
const bump = (t: number, at: number, d = 0.25) => Math.max(0, 1 - Math.abs(t - at) / d);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const bez3 = (a: V3, c: V3, b: V3, k: number): V3 => lerp3(lerp3(a, c, k), lerp3(c, b, k), k);
const WD = words as Word[];
const at = (w: string, after = 0) => WD.find((x) => x.s >= after && x.w.toLowerCase().startsWith(w.toLowerCase()))?.s ?? after;

// ---------- key times from the voice ----------
const T = {
  hundert: at("hundert"), dreissig: at("dreißig"), firma: at("Firma"), fuehren: at("führen"),
  fuenfTage: at("Fünf"), fuenfAg: at("fünf", 4), heute: at("Heute"), eins: at("eins"), auftritt: at("Auftritt"),
  gebaut: at("gebaut"), position: at("Positionierung"), website: at("Website"), online: at("online", 9),
  schreibst: at("schreibst"), teams: at("Teams"), was: at("Was", 12), wen: at("wen", 13),
  liest: at("liest"), mails: at("Mails"), kunden: at("Kunden"), warum: at("warum"), wirklich: at("wirklich"), kaufen: at("kaufen"),
  daraus: at("Daraus"), satz: at("Satz"),
  baut: at("baut", 19), start: at("Startseite"), angebot: at("Angebot"), preise: at("Preise"), kontakt: at("Kontakt"),
  bevor: at("Bevor"), fragt: at("fragt"), klick: at("Klick"), live: at("Live"),
  morgen: at("Morgen"), zwei: at("zwei", 25), hundertLeads: at("hundert", 26), leads: at("Leads"), folg: at("Folg"), tag2: at("Tag", 28),
  komm: at("Kommentier"), agent: at("AGENT", 29), schick: at("schick", 32), prompt: at("Prompt"), posEnd: at("Positionierung", 33), so: at("So"), dann: at("Dann"),
};
const SEND = T.wen + 0.45;
const CLICK = T.klick - 0.05;
const CTA_SENT = T.komm + 0.35 + 0.5 + 5 / 10;

// ---------- world layout ----------
const HQ: V3 = [0, 0, 0];
const D: V3[] = [[-5, 0, -11], [5.4, 0, -15.5], [-2, 0, -24], [6, 0, -28.5], [-4, 0, -33]];
const DR = [6.2, 3.4, 3.4, 3.4, 3.4];
const SCREEN: V3 = [-5, 3.6, -14.6];
const SCR_W = 5.2, SCR_H = 3.25;
const CHAT: V3 = [-8.4, 2.45, -9.6];
const CHAT_YAW = 0.55;
const MAILBOX: V3 = [0.4, 0.4, -7.8];

// ---------- camera ----------
type Hold = { a: number; b: number; p0: V3; p1: V3; l0: V3; l1: V3 };
const HOLDS: Hold[] = [
  { a: 0, b: T.fuenfTage - 0.1, p0: [0, 8.2, 13.4], p1: [0, 10.4, 16.6], l0: [0, 2.2, -0.6], l1: [0, 1.8, -1.4] },
  { a: T.fuenfTage + 0.7, b: T.eins + 0.45, p0: [-0.8, 27.5, 7.5], p1: [-1.2, 26.5, 6.5], l0: [-0.8, 0, -18.5], l1: [-1.1, 0, -18.5] },
  { a: T.gebaut - 0.75, b: T.so - 0.2, p0: [-5, 4.9, -2.4], p1: [-5, 4.6, -3.2], l0: [-5, 3.4, -14.5], l1: [-5, 3.4, -14.5] },
  { a: T.schreibst - 0.25, b: T.liest - 0.15, p0: [-4.45, 3.5, -3.1], p1: [-4.8, 3.35, -3.7], l0: [-8.4, 2.35, -9.6], l1: [-8.4, 2.35, -9.6] },
  { a: T.liest + 0.3, b: T.dann - 0.2, p0: [-2.2, 5.0, -0.4], p1: [-2.4, 4.8, -1.2], l0: [-2.4, 4.0, -9.4], l1: [-2.4, 4.0, -9.4] },
  { a: T.baut + 0.2, b: T.bevor - 0.15, p0: [-5, 5.0, -2.2], p1: [-5, 4.8, -3.0], l0: [-5, 3.2, -14.5], l1: [-5, 3.0, -14.5] },
  { a: T.bevor + 0.2, b: T.live + 0.55, p0: [-5, 4.3, -6.6], p1: [-5, 4.1, -7.2], l0: [-5, 3.5, -14.6], l1: [-5, 3.5, -14.6] },
  { a: T.morgen + 0.55, b: 40, p0: [4.3, 10.6, -0.2], p1: [4.6, 9.8, -1.4], l0: [4.6, 3.0, -14], l1: [4.6, 3.2, -14] },
];
const VIA: { pos: V3; look: V3 }[] = [
  { pos: [0, 17, 9], look: [0, 1, -8] },
  { pos: [-4, 12, -1], look: [-5, 2, -11] },
  { pos: [-4.6, 5.0, -4.2], look: [-7.2, 2.9, -11.5] },
  { pos: [-3.0, 5.6, -3.0], look: [-4.4, 1.8, -9.6] },
  { pos: [-2.4, 6.6, -3.6], look: [-4.4, 2.6, -12.6] },
  { pos: [-5, 4.8, -6.0], look: [-5, 3.3, -14.6] },
  { pos: [-2, 12, -5], look: [2, 1, -14] },
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
const PUNCH = [T.hundert, T.firma, T.eins, T.gebaut, T.online, T.teams, SEND, T.satz, T.start, T.angebot, T.preise, T.kontakt, CLICK, T.live, T.zwei, T.agent];

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
const fit = (c: CanvasRenderingContext2D, text: string, fam: string, max: number, maxW: number) => {
  let s = max;
  c.font = `${s}px ${fam}`;
  while (c.measureText(text).width > maxW && s > 10) { s -= 2; c.font = `${s}px ${fam}`; }
  return s;
};
const pxArt = (c: CanvasRenderingContext2D, rows: string[], pal: Record<string, string>, x: number, y: number, px: number) => {
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (pal[ch]) { c.fillStyle = pal[ch]; c.fillRect(x + i * px, y + j * px, px + 0.5, px + 0.5); } }));
};
const BOT_ROWS = [".....Y......", ".....A......", "...OOOOOO...", "..OOOOOOOO..", ".OOWWOOWWOO.", ".OOWPOOWPOO.", ".OOOOOOOOOO.", ".OOOLMMLOOO.", "..OOOOOOOO..", "HHOOOOOOOOHH", "..OOOOOOOO..", "..OO....OO..", "..DD....DD.."];
const BOT_PAL = { Y: "#F5C542", A: "#2C2420", O: "#FFFFFF", W: OR, P: "#2C2420", L: OR_D, M: OR_D, H: "#FFFFFF", D: "#FFFFFF" };
const BOT_PAL_OR = { Y: "#F5C542", A: "#2C2420", O: OR, W: "#FFFFFF", P: "#2C2420", L: "#9C4A31", M: "#9C4A31", H: "#B85F42", D: "#2C2420" };
const HAND = ["..KK......", ".KWWK.....", ".KWWK.....", ".KWWKKK...", ".KWWKWWKK.", "KKWWKWWKWK", "KWWWWWWKWK", "KWWWWWWWWK", ".KWWWWWWWK", "..KWWWWWK.", "...KKKKK.."];
const botTile = (c: CanvasRenderingContext2D, x: number, y: number, s: number) => {
  const g = c.createLinearGradient(x, y, x + s, y + s);
  g.addColorStop(0, "#FF8A5B"); g.addColorStop(0.6, OR); g.addColorStop(1, OR_D);
  c.fillStyle = g; roundRect(c, x, y, s, s, s * 0.28); c.fill();
  const px = s / 16;
  pxArt(c, BOT_ROWS, BOT_PAL, x + (s - 12 * px) / 2, y + (s - 13 * px) / 2, px);
};
const cursorHand = (c: CanvasRenderingContext2D, x: number, y: number, press: boolean, px = 6) => {
  c.save(); c.translate(x - 10, y - 4); c.rotate(-0.2); const s = press ? 0.86 : 1; c.scale(s, s);
  pxArt(c, HAND, { K: "rgba(0,0,0,.25)" }, 3, 6, px);
  pxArt(c, HAND, { K: INK, W: "#FFFFFF" }, 0, 0, px);
  c.restore();
};
const wrap = (c: CanvasRenderingContext2D, text: string, maxW: number) => {
  const out: string[] = [];
  let line = "";
  text.split(" ").forEach((w) => { const tr = line ? line + " " + w : w; if (c.measureText(tr).width > maxW && line) { out.push(line); line = w; } else line = tr; });
  if (line) out.push(line);
  return out;
};

// ---------- canvas: the website ----------
const SW = 1200, SH = 750;
type SiteState = { hero: number; ang: number; pre: number; kon: number; live: boolean; approve: number; hl: number };
const skeleton = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  c.fillStyle = "#F1EDE7"; roundRect(c, x, y, w, h, 14); c.fill();
  c.strokeStyle = "#E2DCD3"; c.setLineDash([10, 8]); c.lineWidth = 3; roundRect(c, x, y, w, h, 14); c.stroke(); c.setLineDash([]);
};
const drawSite = (c: CanvasRenderingContext2D, t: number, s: SiteState, logo: HTMLImageElement | null) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, SW, SH);
  // browser bar
  c.fillStyle = "#F4F1EC"; c.fillRect(0, 0, SW, 66);
  ["#FF5F57", "#FEBC2E", "#28C840"].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(30 + i * 30, 33, 9, 0, 7); c.fill(); });
  c.fillStyle = "#FFFFFF"; roundRect(c, 330, 14, 540, 38, 19); c.fill();
  c.fillStyle = MUTED; c.font = `22px ${F_M}`; c.textBaseline = "middle"; c.textAlign = "center";
  c.fillText("🔒 kern-haustechnik.de", 600, 34);
  const lv = s.live ? 1 + 0.25 * bump(t, T.live, 0.25) : 1;
  c.save(); c.translate(1110, 33); c.scale(lv, lv);
  c.fillStyle = s.live ? GREEN : "#D9D3CA"; roundRect(c, -66, -17, 132, 34, 17); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `20px ${F_B}`; c.fillText(s.live ? "● LIVE" : "ENTWURF", 0, 1);
  c.restore();
  c.textAlign = "left";
  // nav
  c.fillStyle = OR; roundRect(c, 48, 88, 44, 44, 11); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `26px ${F_B}`; c.textAlign = "center"; c.fillText("K", 70, 111);
  c.textAlign = "left"; c.fillStyle = INK; c.font = `28px ${F_B}`; c.fillText("Kern Haustechnik", 106, 111);
  c.fillStyle = "#5E5A53"; c.font = `22px ${F_M}`;
  ["Angebot", "Preise", "Kontakt"].forEach((n, i) => c.fillText(n, 800 + i * 128, 111));
  c.fillStyle = LINE; c.fillRect(0, 152, SW, 2);
  // hero
  const hy = 186;
  if (s.hero < 0.99) { skeleton(c, 48, hy, 640, 70); skeleton(c, 48, hy + 86, 520, 70); skeleton(c, 48, hy + 178, 470, 34); skeleton(c, 48, hy + 236, 290, 64); skeleton(c, 760, hy, 390, 300); }
  if (s.hero > 0.01) {
    c.save(); c.globalAlpha = s.hero; c.translate(0, (1 - s.hero) * 24);
    c.fillStyle = "#FFFFFF"; c.fillRect(40, hy - 6, 1120, 312);
    c.font = `52px ${F_B}`; c.fillStyle = INK;
    const l1a = "Wärmepumpe in ", l1b = "3 Tagen.";
    c.fillText(l1a, 48, hy + 38);
    const w1 = c.measureText(l1a).width, w1b = c.measureText(l1b).width;
    c.fillStyle = `rgba(255,107,53,${0.22 + 0.25 * s.hl})`; c.fillRect(48 + w1, hy + 52, w1b * Math.min(1, 0.4 + s.hl), 14);
    c.fillStyle = INK; c.fillText(l1b, 48 + w1, hy + 38);
    const l2a = "Zum ", l2b = "Festpreis.";
    c.fillText(l2a, 48, hy + 116);
    const w2 = c.measureText(l2a).width, w2b = c.measureText(l2b).width;
    c.fillStyle = `rgba(255,107,53,${0.22 + 0.25 * s.hl})`; c.fillRect(48 + w2, hy + 130, w2b * Math.min(1, 0.4 + s.hl), 14);
    c.fillStyle = OR; c.fillText(l2b, 48 + w2, hy + 116);
    c.fillStyle = "#5E5A53"; c.font = `27px ${F_M}`; c.fillText("Für Hausbesitzer im Umland. Alles aus einer Hand.", 48, hy + 196);
    c.fillStyle = OR; roundRect(c, 48, hy + 236, 320, 66, 33); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `26px ${F_B}`; c.fillText("Festpreis anfragen  →", 78, hy + 270);
    // house illustration
    c.fillStyle = "#FFF4EE"; roundRect(c, 760, hy, 390, 300, 26); c.fill();
    c.fillStyle = "#F2E3D6"; c.fillRect(820, hy + 150, 230, 120);
    c.fillStyle = OR; c.beginPath(); c.moveTo(800, hy + 156); c.lineTo(935, hy + 62); c.lineTo(1070, hy + 156); c.closePath(); c.fill();
    c.fillStyle = "#FFFFFF"; c.fillRect(850, hy + 180, 50, 46); c.fillRect(960, hy + 180, 50, 46);
    c.fillStyle = "#8A5A35"; c.fillRect(915, hy + 214, 40, 56);
    c.fillStyle = "#DDE3EA"; roundRect(c, 1060, hy + 214, 62, 56, 8); c.fill();
    c.strokeStyle = "#8A97A6"; c.lineWidth = 4; c.beginPath(); c.arc(1091, hy + 242, 16, 0, 7); c.stroke();
    c.restore();
  }
  // section cards
  const cards: [string, string, string, number][] = [
    ["Angebot", "Planung, Einbau,", "Förderung", s.ang],
    ["Preise", "Festpreis", "ab 14.900 €", s.pre],
    ["Kontakt", "Rückruf", "in 24 Stunden", s.kon],
  ];
  cards.forEach(([h, a, b, k], i) => {
    const x = 48 + i * 376, y = 520;
    if (k < 0.99) skeleton(c, x, y, 352, 190);
    if (k > 0.01) {
      c.save(); c.globalAlpha = k; c.translate(0, (1 - k) * 24);
      c.fillStyle = "#FAF8F5"; roundRect(c, x, y, 352, 190, 18); c.fill();
      c.strokeStyle = bump(t, [T.angebot, T.preise, T.kontakt][i] + 0.35, 0.4) > 0 ? OR : LINE; c.lineWidth = 3; roundRect(c, x, y, 352, 190, 18); c.stroke();
      c.fillStyle = OR_L; roundRect(c, x + 24, y + 24, 54, 54, 14); c.fill();
      c.fillStyle = OR; c.font = `30px ${F_B}`; c.textAlign = "center"; c.fillText(["€", "%", "☎"][i] === "€" ? "★" : ["★", "€", "☎"][i], x + 51, y + 52); c.textAlign = "left";
      c.fillStyle = INK; c.font = `30px ${F_B}`; c.fillText(h, x + 96, y + 52);
      c.fillStyle = "#5E5A53"; c.font = `25px ${F_M}`; c.fillText(a, x + 26, y + 118); c.fillText(b, x + 26, y + 152);
      c.restore();
    }
  });
  // approval overlay (Superkind asks before anything goes live)
  if (s.approve > 0.01) {
    c.save(); c.globalAlpha = s.approve;
    c.fillStyle = "rgba(22,19,15,.45)"; c.fillRect(0, 0, SW, SH);
    const k = back(s.approve);
    c.translate(600, 380); c.scale(0.9 + 0.1 * k, 0.9 + 0.1 * k); c.translate(-600, -380);
    c.fillStyle = "rgba(0,0,0,.18)"; roundRect(c, 236, 196, 728, 380, 32); c.fill();
    c.fillStyle = "#FFFFFF"; roundRect(c, 228, 184, 744, 380, 32); c.fill();
    c.strokeStyle = OR; c.lineWidth = 4; roundRect(c, 228, 184, 744, 380, 32); c.stroke();
    botTile(c, 264, 220, 70);
    c.fillStyle = INK; c.font = `28px ${F_B}`; c.fillText("Superkind · Agent 1", 352, 244);
    c.fillStyle = MUTED; c.font = `22px ${F_M}`; c.fillText("gerade eben", 352, 278);
    c.fillStyle = INK; c.font = `38px ${F_B}`; c.fillText("Deine Website ist fertig.", 264, 350);
    c.fillStyle = "#5E5A53"; c.font = `30px ${F_M}`; c.fillText("Soll ich sie veröffentlichen?", 264, 398);
    const pressed = t >= CLICK && t < CLICK + 0.15;
    const done = t >= CLICK + 0.1;
    c.fillStyle = done ? GREEN : OR; roundRect(c, 264, 446 + (pressed ? 3 : 0), 300, 78, 22); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `30px ${F_B}`; c.textAlign = "center"; c.fillText(done ? "✓ Freigegeben" : "Freigeben", 414, 486 + (pressed ? 3 : 0));
    c.strokeStyle = "#D9D3CA"; c.lineWidth = 3; roundRect(c, 588, 446, 220, 78, 22); c.stroke();
    c.fillStyle = INK; c.font = `30px ${F_S}`; c.fillText("Ändern", 698, 486);
    c.textAlign = "left";
    // click ring + hand
    if (t >= CLICK) { const r = cl((t - CLICK) / 0.45); c.strokeStyle = `rgba(255,107,53,${1 - r})`; c.lineWidth = 7; c.beginPath(); c.arc(414, 486, 20 + 90 * r, 0, 7); c.stroke(); }
    const hk = ease((t - T.bevor - 0.5) / Math.max(0.2, CLICK - T.bevor - 0.6));
    cursorHand(c, 760 + (420 - 760) * hk, 640 + (494 - 640) * hk - Math.sin(hk * Math.PI) * 60, pressed, 7);
    c.restore();
  }
};

// ---------- canvas: Superkind chat (written to in Teams) ----------
const CW = 900, CH = 640;
const USER_MSG = "Wir verkaufen Wärmepumpen an Hausbesitzer im Umland. Bau mir Positionierung und Website.";
const BOT_MSG = "Mach ich. Ich schau mir zuerst die Mails deiner besten Kunden an.";
const drawChat = (c: CanvasRenderingContext2D, t: number, logo: HTMLImageElement | null, teams: HTMLImageElement | null) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, CW, CH);
  const g = c.createLinearGradient(0, 0, CW, 0); g.addColorStop(0, "#FFF3EC"); g.addColorStop(1, "#FFFFFF");
  c.fillStyle = g; c.fillRect(0, 0, CW, 78);
  c.fillStyle = "#FFE1D3"; c.fillRect(0, 76, CW, 2);
  if (logo) c.drawImage(logo, 26, 22, 34, 34);
  c.fillStyle = INK; c.font = `30px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("superkind", 72, 40);
  // "in Teams" chip
  c.fillStyle = "#FFFFFF"; roundRect(c, 670, 18, 206, 44, 22); c.fill(); c.strokeStyle = "#E6E0D8"; c.lineWidth = 2; c.stroke();
  if (teams) c.drawImage(teams, 684, 26, 28, 28);
  c.fillStyle = "#4A443C"; c.font = `22px ${F_S}`; c.fillText("in Teams", 722, 41);
  const sent = t >= SEND;
  // user bubble
  if (sent) {
    const k = ease((t - SEND) / 0.3);
    c.font = `26px ${F_M}`;
    const lines = wrap(c, USER_MSG, 520);
    const bh = lines.length * 36 + 30, by = 112 + (1 - k) * 300;
    c.fillStyle = INK; roundRect(c, CW - 34 - 560, by, 560, bh, 22); c.fill();
    c.fillStyle = "#FFFFFF"; lines.forEach((l, i) => c.fillText(l, CW - 34 - 540, by + 32 + i * 36));
    // bot reply
    const ra = SEND + 0.35;
    if (t >= ra) {
      const ry = by + bh + 26;
      botTile(c, 30, ry, 60);
      c.fillStyle = MUTED; c.font = `20px ${F_S}`; c.fillText("SUPERKIND · AGENT 1", 106, ry + 10);
      const n = Math.max(0, Math.floor((t - ra - 0.25) * 70));
      c.font = `27px ${F_M}`;
      if (n === 0) { c.fillStyle = "#B5AEA4"; c.fillText("•".repeat(1 + (Math.floor(t * 6) % 3)), 110, ry + 46); }
      else {
        const lines2 = wrap(c, BOT_MSG.slice(0, n), 640);
        c.fillStyle = "#F4F1EC"; roundRect(c, 100, ry + 26, 690, lines2.length * 36 + 26, 18); c.fill();
        c.fillStyle = INK; lines2.forEach((l, i) => c.fillText(l, 120, ry + 56 + i * 36));
      }
    }
  } else {
    // empty state
    botTile(c, CW / 2 - 50, 150, 100);
    c.fillStyle = INK; c.font = `34px ${F_B}`; c.textAlign = "center"; c.fillText("Was soll ich für dich erledigen?", CW / 2, 300);
    c.fillStyle = MUTED; c.font = `24px ${F_M}`; c.fillText("Schreib mir wie einem Kollegen.", CW / 2, 344);
    c.textAlign = "left";
  }
  // input
  const focus = t > T.schreibst && !sent;
  c.fillStyle = focus ? "rgba(255,107,53,.25)" : "transparent"; roundRect(c, 20, 472, CW - 40, 150, 30); c.fill();
  c.fillStyle = "#FFFFFF"; roundRect(c, 28, 480, CW - 56, 134, 24); c.fill();
  c.strokeStyle = focus ? OR : "#E2DCD3"; c.lineWidth = 3; c.stroke();
  const tn = Math.max(0, Math.min(USER_MSG.length, Math.floor((t - T.was + 0.05) * 52)));
  c.font = `26px ${F_M}`;
  if (sent) { c.fillStyle = "#B5AEA4"; c.fillText("Antworten …", 56, 528); }
  else if (tn === 0) { c.fillStyle = "#B5AEA4"; c.fillText("Schreib Superkind …", 56, 528); }
  else {
    const lines = wrap(c, USER_MSG.slice(0, tn), 700);
    c.fillStyle = INK; lines.forEach((l, i) => c.fillText(l, 56, 528 + i * 36));
    if (Math.floor(t * 3) % 2) { const lw = c.measureText(lines[lines.length - 1]).width; c.fillStyle = OR; c.fillRect(58 + lw, 528 + (lines.length - 1) * 36 - 16, 4, 32); }
  }
  const sp = 1 + 0.25 * bump(t, SEND, 0.2);
  c.save(); c.translate(CW - 82, 578); c.scale(sp, sp);
  c.fillStyle = OR; roundRect(c, -30, -24, 60, 48, 14); c.fill();
  c.strokeStyle = "#FFFFFF"; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 12); c.lineTo(0, -11); c.moveTo(-9, -2); c.lineTo(0, -11); c.lineTo(9, -2); c.stroke();
  c.restore();
  if (t > T.wen - 0.3 && t < SEND + 0.4) cursorHand(c, CW - 82 + (1 - ease((t - T.wen + 0.3) / 0.35)) * 120, 584 + (1 - ease((t - T.wen + 0.3) / 0.35)) * 40, t >= SEND && t < SEND + 0.12, 6);
};

// ---------- canvas: customer mails ----------
const MAILS = [
  { from: "Familie Brandt", subj: "Danke!", pre: "… und nach ", hl: "3 Tagen", post: " lief die Pumpe schon." },
  { from: "Herr Okafor", subj: "Ihr Angebot", pre: "Der ", hl: "Festpreis", post: " war für uns entscheidend." },
  { from: "Sabine Weiß", subj: "Super gelaufen", pre: "Alles ", hl: "aus einer Hand", post: ", ohne Stress." },
];
const mailTex = (m: (typeof MAILS)[number], outlook: HTMLImageElement | null) =>
  canvasTex(640, 300, (c) => {
    c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 640, 300, 26); c.fill();
    c.strokeStyle = "#E6E0D8"; c.lineWidth = 4; roundRect(c, 2, 2, 636, 296, 24); c.stroke();
    if (outlook) c.drawImage(outlook, 28, 26, 48, 48);
    c.textBaseline = "middle"; c.fillStyle = INK; c.font = `32px ${F_B}`; c.fillText(m.from, 94, 40);
    c.fillStyle = MUTED; c.font = `24px ${F_M}`; c.fillText(m.subj, 94, 74);
    c.font = `30px ${F_M}`;
    let x = 30; const y = 170;
    c.fillStyle = "#4A443C"; c.fillText(m.pre, x, y); x += c.measureText(m.pre).width;
    const hw = c.measureText(m.hl).width;
    c.fillStyle = "#FFD9C7"; roundRect(c, x - 4, y - 22, hw + 8, 44, 8); c.fill();
    c.fillStyle = INK; c.fillText(m.hl, x, y); x += hw;
    const rest = wrap(c, m.post, 600 - x);
    c.fillStyle = "#4A443C"; c.fillText(rest[0] ?? "", x, y);
    if (rest.length > 1) c.fillText(m.post.slice((rest[0] ?? "").length).trim(), 30, y + 48);
  });

const signTex = (text: string, bg: string, fg: string, border: string, w = 760, h = 190, fam = F_B) =>
  canvasTex(w, h, (c) => {
    c.fillStyle = "rgba(0,0,0,.12)"; roundRect(c, 6, 10, w - 12, h - 12, 36); c.fill();
    c.fillStyle = border; roundRect(c, 0, 0, w - 6, h - 10, 36); c.fill();
    c.fillStyle = bg; roundRect(c, 9, 9, w - 24, h - 28, 28); c.fill();
    c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle";
    fit(c, text, fam, h * 0.46, w - 90);
    c.fillText(text, (w - 6) / 2, (h - 10) / 2 + 3);
  });
const dayTex = (n: number, name: string, active: boolean, locked: boolean) =>
  canvasTex(820, 200, (c) => {
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 6, 12, 808, 186, 40); c.fill();
    c.fillStyle = active ? OR : "#FFFFFF"; roundRect(c, 0, 0, 808, 186, 40); c.fill();
    c.strokeStyle = active ? OR_D : "#E2DCD3"; c.lineWidth = 6; roundRect(c, 3, 3, 802, 180, 37); c.stroke();
    c.fillStyle = active ? "#FFFFFF" : OR_L; c.beginPath(); c.arc(96, 93, 62, 0, 7); c.fill();
    c.fillStyle = active ? OR : OR; c.font = `76px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(String(n), 96, 98);
    c.textAlign = "left"; c.fillStyle = active ? "#FFFFFF" : locked ? "#A39C90" : INK;
    fit(c, name, F_B, 72, 600); c.fillText(name, 186, 98);
  });

// ---------- 3D pieces ----------
type Tex = Record<string, THREE.Texture>;
const Island: React.FC<{ p: V3; r: number; t: number; active?: boolean; locked?: boolean; vis?: number }> = ({ p, r, t, active, locked, vis = 1 }) => {
  if (vis <= 0.001) return null;
  return (
    <group position={p} scale={[vis, vis, vis]}>
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[r, r + 0.12, 0.4, 48]} />
        <meshStandardMaterial color={locked ? "#E3DDD4" : OR} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.405, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[r - 0.14, 48]} />
        <meshStandardMaterial color={locked ? "#F1EDE7" : "#FFFFFF"} roughness={0.9} />
      </mesh>
      {active && Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * (r + 0.03), 0.22, Math.sin(a) * (r + 0.03)]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.1, 0.26, 0.34]} />
            <meshBasicMaterial color="#FFF3EC" transparent opacity={0.25 + 0.5 * Math.max(0, Math.sin(t * 4 - i * 0.5))} toneMapped={false} />
          </mesh>
        );
      })}
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
        const v = (1.8 + rnd(i * 3 + at) * 2.2) * power;
        const up = 3 + rnd(i * 7 + at) * 3;
        const s = 0.15 * (1 - k / 1.2) + 0.04;
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

// a sign that always faces the camera
const Board: React.FC<{ p: V3; tex: THREE.Texture; w: number; h: number; t: number; q: THREE.Quaternion; at?: number; until?: number; bob?: number; tilt?: number; s?: number }> = ({ p, tex, w, h, t, q, at: a = -99, until = 999, bob = 0.06, tilt = 0, s: sc = 1 }) => {
  const s = back((t - a) / 0.35) * (1 - ease((t - until) / 0.25)) * sc;
  if (s <= 0.001) return null;
  return (
    <group position={[p[0], p[1] + Math.sin(t * 2.4 + p[0]) * bob, p[2]]} quaternion={q}>
      <group rotation={[0, 0, tilt]} scale={[s, s, s]}>
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
};

// hero agent: 3D version of our PixelBot (round orange body, white eyes, antenna with yellow ball, little arms)
type BotPose = { armL?: number; armR?: number; lift?: number; prop?: "magnifier" | "block" | "crown" | "none"; talk?: boolean; vis?: number; s?: number; badge?: THREE.Texture };
const SkBot: React.FC<{ p: V3; yaw?: number; t: number; seed?: number } & BotPose> = ({ p, yaw = 0, t, seed = 0, armL = 15, armR = 15, lift = 0, prop = "none", talk, vis = 1, s = 1, badge }) => {
  if (vis <= 0.001) return null;
  const bob = Math.abs(Math.sin(t * 4.4 + seed)) * 0.1;
  const blink = (t * 1.2 + seed * 0.37) % 3.1 < 0.09;
  const sc = s * vis;
  const arm = (side: -1 | 1, deg: number, node?: React.ReactNode) => (
    <group position={[side * 0.72, 0.95, 0.05]} rotation={[0, 0, (side * deg * Math.PI) / 180]}>
      <mesh castShadow position={[0, -0.22, 0]}>
        <boxGeometry args={[0.24, 0.5, 0.26]} />
        <meshStandardMaterial color={OR_D} roughness={0.6} />
      </mesh>
      {node && <group position={[0, -0.52, 0.05]}>{node}</group>}
    </group>
  );
  return (
    <group position={[p[0], p[1] + lift + bob, p[2]]} rotation={[0, yaw, 0]} scale={[sc, sc, sc]}>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} castShadow position={[x, 0.16, 0]}>
          <boxGeometry args={[0.26, 0.32, 0.3]} />
          <meshStandardMaterial color="#2C2420" />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 0.98, 0]}>
        <boxGeometry args={[1.28, 1.3, 1.08]} />
        <meshStandardMaterial color={OR} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.3, 0.14, 1.1]} />
        <meshStandardMaterial color={OR_D} roughness={0.6} />
      </mesh>
      {[-0.29, 0.29].map((x) => (
        <group key={x} position={[x, 1.12, 0.545]}>
          <mesh><boxGeometry args={[0.34, blink ? 0.05 : 0.36, 0.03]} /><meshBasicMaterial color="#FFFFFF" toneMapped={false} /></mesh>
          {!blink && <mesh position={[0.05, -0.04, 0.02]}><boxGeometry args={[0.15, 0.19, 0.02]} /><meshBasicMaterial color="#2C2420" /></mesh>}
        </group>
      ))}
      <mesh position={[0, 0.72, 0.545]}>
        <boxGeometry args={[0.34, talk ? 0.05 + 0.07 * Math.abs(Math.sin(t * 14 + seed)) : 0.06, 0.03]} />
        <meshBasicMaterial color="#9C4A31" />
      </mesh>
      {badge && <mesh position={[0, 0.43, 0.56]}><planeGeometry args={[0.34, 0.34]} /><meshBasicMaterial map={badge} transparent toneMapped={false} /></mesh>}
      <mesh position={[0, 1.83, 0]} castShadow><boxGeometry args={[0.08, 0.42, 0.08]} /><meshStandardMaterial color="#2C2420" /></mesh>
      <mesh position={[0, 2.08, 0]} castShadow><boxGeometry args={[0.22, 0.22, 0.22]} /><meshStandardMaterial color="#F5C542" emissive="#F5C542" emissiveIntensity={0.35 + 0.35 * Math.max(0, Math.sin(t * 6 + seed))} /></mesh>
      {prop === "crown" && (
        <group position={[0, 1.72, 0]}>
          <ToyBox p={[0, 0, 0]} s={[0.9, 0.22, 0.8]} color="#F5C542" />
          {[-0.33, 0, 0.33].map((x) => <ToyBox key={x} p={[x, 0.2, 0]} s={[0.16, 0.22, 0.16]} color="#F5C542" />)}
        </group>
      )}
      {arm(-1, armL)}
      {arm(1, armR, prop === "magnifier" ? (
        <group rotation={[0, 0, -0.6]}>
          <mesh position={[0, -0.12, 0]}><boxGeometry args={[0.08, 0.3, 0.08]} /><meshStandardMaterial color="#8A5A35" /></mesh>
          <mesh position={[0, -0.45, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.24, 0.05, 8, 20]} /><meshStandardMaterial color="#2C2420" /></mesh>
          <mesh position={[0, -0.45, 0]}><circleGeometry args={[0.22, 20]} /><meshBasicMaterial color="#D5F1FF" transparent opacity={0.55} side={THREE.DoubleSide} /></mesh>
        </group>
      ) : prop === "block" ? <ToyBox p={[0, -0.18, 0.1]} s={[0.5, 0.36, 0.4]} color="#FFFFFF" top={OR_L} /> : undefined)}
    </group>
  );
};

// swarm: 100 agents as instanced meshes (one InstancedMesh per part)
const SWARM_N = 100;
type Part = { geo: [number, number, number]; off: V3; color: string; basic?: boolean };
const SWARM_PARTS: Part[] = [
  { geo: [1.2, 1.2, 1.0], off: [0, 0.95, 0], color: OR },
  { geo: [1.22, 0.13, 1.02], off: [0, 0.4, 0], color: OR_D },
  { geo: [0.3, 0.34, 0.03], off: [-0.27, 1.08, 0.51], color: "#FFFFFF", basic: true },
  { geo: [0.3, 0.34, 0.03], off: [0.27, 1.08, 0.51], color: "#FFFFFF", basic: true },
  { geo: [0.13, 0.17, 0.02], off: [-0.23, 1.04, 0.535], color: "#2C2420", basic: true },
  { geo: [0.13, 0.17, 0.02], off: [0.31, 1.04, 0.535], color: "#2C2420", basic: true },
  { geo: [0.07, 0.36, 0.07], off: [0, 1.72, 0], color: "#2C2420" },
  { geo: [0.2, 0.2, 0.2], off: [0, 1.96, 0], color: "#F5C542" },
  { geo: [0.24, 0.3, 0.28], off: [-0.27, 0.15, 0], color: "#2C2420" },
  { geo: [0.24, 0.3, 0.28], off: [0.27, 0.15, 0], color: "#2C2420" },
];
const SWARM = Array.from({ length: SWARM_N }, (_, i) => {
  // phyllotaxis spread around the HQ, landing in waves in sync with "hundert"
  const a = i * 2.39996, r = 2.0 + Math.sqrt(i) * 0.72;
  const x = Math.cos(a) * r, z = Math.sin(a) * r * 0.85 + 0.4;
  const onIsland = Math.hypot(x, z) < 4.0;
  return { x, z, y: onIsland ? 0.4 : 0, land: 0.05 + (i / SWARM_N) * 2.2 + rnd(i) * 0.15, yaw: Math.atan2(9 - z, 0 - x) * 0 + (rnd(i + 3) - 0.5) * 0.9, s: 0.42 + rnd(i + 8) * 0.12 };
});
const Swarm: React.FC<{ t: number }> = ({ t }) => {
  const meshes = React.useMemo(() => SWARM_PARTS.map((pt) => {
    const geo = new THREE.BoxGeometry(...pt.geo);
    const mat = pt.basic ? new THREE.MeshBasicMaterial({ color: pt.color, toneMapped: false }) : new THREE.MeshStandardMaterial({ color: pt.color, roughness: 0.6 });
    const m = new THREE.InstancedMesh(geo, mat, SWARM_N);
    m.castShadow = !pt.basic; m.receiveShadow = false;
    m.frustumCulled = false;
    return m;
  }), []);
  const bm = new THREE.Matrix4(), pm = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  let count = 0;
  SWARM.forEach((b, i) => {
    const k = (t - b.land) / 0.45;
    const fall = k < 1 ? Math.pow(1 - cl(k), 2) * 9 : 0;
    const hop = k >= 1 ? Math.abs(Math.sin(t * 5 + i)) * 0.25 * (t > T.firma ? 1 : 0.4) : 0;
    const vis = k < 0 ? 0 : 1;
    if (k >= 1) count++;
    e.set(0, b.yaw + Math.sin(t * 2 + i) * 0.15, k < 1 ? (1 - cl(k)) * 2 : 0);
    q.setFromEuler(e);
    bm.compose(new THREE.Vector3(b.x, b.y + fall + hop, b.z), q, new THREE.Vector3(b.s * vis, b.s * vis, b.s * vis));
    meshes.forEach((m, j) => {
      const o = SWARM_PARTS[j].off;
      pm.makeTranslation(o[0], o[1], o[2]);
      m.setMatrixAt(i, bm.clone().multiply(pm));
    });
  });
  meshes.forEach((m) => { m.instanceMatrix.needsUpdate = true; });
  return <>{meshes.map((m, i) => <primitive key={i} object={m} />)}</>;
};
const landedCount = (t: number) => SWARM.filter((b) => t >= b.land + 0.45).length;

const Monitor: React.FC<{ p: V3; w: number; h: number; tex: THREE.Texture; yaw?: number; stand?: number; posts?: boolean }> = ({ p, w, h, tex, yaw = 0, stand = 0, posts }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <ToyBox p={[0, 0, -0.12]} s={[w + 0.24, h + 0.24, 0.2]} color="#2A2622" />
    <mesh position={[0, 0, 0.002]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
    {stand > 0 && <><ToyBox p={[0, -h / 2 - stand / 2, -0.15]} s={[0.3, stand, 0.26]} color="#2A2622" /><ToyBox p={[0, -h / 2 - stand, -0.1]} s={[1.2, 0.08, 0.7]} color="#2A2622" /></>}
    {posts && [-w / 2 + 0.3, w / 2 - 0.3].map((x) => <ToyBox key={x} p={[x, -(p[1]) / 2 - h / 4 + 0.1, -0.2]} s={[0.22, p[1] - h / 2 + 0.2, 0.22]} color="#2A2622" />)}
  </group>
);

const HQBuilding: React.FC<{ t: number; tex: Tex }> = ({ t, tex }) => {
  const glow = bump(t, T.firma, 0.5);
  return (
    <group position={[0, 0.4, -1.2]}>
      <ToyBox p={[0, 1.1, 0]} s={[3.2, 2.2, 2.2]} color="#FFFFFF" top="#FFFFFF" />
      <mesh position={[0, 2.75, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.55, 1.3, 4]} />
        <meshStandardMaterial color={OR} roughness={0.6} flatShading />
      </mesh>
      <ToyBox p={[0, 0.55, 1.11]} s={[0.6, 1.1, 0.05]} color="#8A5A35" />
      {[-1.0, 1.0].map((x) => <ToyBox key={x} p={[x, 1.35, 1.11]} s={[0.6, 0.55, 0.05]} color="#BFE3F2" emissive="#FFE6B0" ei={0.3 + glow} />)}
      <group position={[0, 1.95, 1.16]}>
        <ToyBox p={[0, 0, -0.03]} s={[2.5, 0.5, 0.06]} color={INK} />
        <mesh position={[0, 0, 0.01]}><planeGeometry args={[2.44, 0.44]} /><meshBasicMaterial map={tex.hqSign} toneMapped={false} /></mesh>
      </group>
      <pointLight position={[0, 1.6, 2.2]} intensity={6 * glow} distance={6} color="#FFB48A" />
    </group>
  );
};

// ---------- the world ----------
const World: React.FC<{ t: number; tex: Tex; dyn: Record<string, THREE.Texture> }> = ({ t, tex, dyn }) => {
  const cam = camAt(t);
  const punch = Math.max(0, ...PUNCH.map((p) => bump(t, p, 0.22)));
  const q = React.useMemo(() => new THREE.Quaternion(), []);
  const m4 = new THREE.Matrix4().lookAt(new THREE.Vector3(...cam.pos), new THREE.Vector3(...cam.look), new THREE.Vector3(0, 1, 0));
  q.setFromRotationMatrix(m4);
  const lightTarget = React.useMemo(() => new THREE.Object3D(), []);
  lightTarget.position.set(cam.look[0], 0, cam.look[2]);
  lightTarget.updateMatrixWorld();
  const look = cam.look;

  // islands pop on "Fünf Tage"
  const isl = (i: number) => (i === 0 ? 1 : back((t - T.fuenfTage - 0.2 - i * 0.1) / 0.4));
  // agent 1 path
  type K = { a: number; b: number; p: V3; yaw: number };
  const KEYS: K[] = [
    { a: 0, b: T.eins + 0.6, p: [-5, 0.4, -9.6], yaw: 0.2 },
    { a: T.gebaut - 0.3, b: T.so - 0.1, p: [-7.6, 0.4, -12.2], yaw: 0.35 },
    { a: T.schreibst + 0.1, b: T.liest - 0.3, p: [-6.6, 0.4, -9.6], yaw: 0.1 },
    { a: T.liest + 0.25, b: T.dann - 0.2, p: [-4.6, 0.4, -8.4], yaw: 0.6 },
    { a: T.baut + 0.25, b: T.bevor - 0.1, p: [-2.6, 0.4, -12.4], yaw: -0.45 },
    { a: T.bevor + 0.2, b: 40, p: [-7.5, 0.4, -12.6], yaw: 0.45 },
  ];
  let a1: V3 = KEYS[0].p, a1yaw = KEYS[0].yaw, hopping = false;
  for (let i = 0; i < KEYS.length; i++) {
    const k = KEYS[i];
    if (t <= k.b) {
      if (t >= k.a || i === 0) { a1 = k.p; a1yaw = k.yaw; }
      else { const pr = KEYS[i - 1]; const kk = inOut((t - pr.b) / (k.a - pr.b)); const pp = lerp3(pr.p, k.p, kk); a1 = [pp[0], pp[1] + Math.sin(kk * Math.PI) * 1.6, pp[2]]; a1yaw = pr.yaw + (k.yaw - pr.yaw) * kk; hopping = true; }
      break;
    }
  }
  let armL = 15 + 8 * Math.sin(t * 3), armR = 15 - 8 * Math.sin(t * 3), lift = 0;
  let prop: BotPose["prop"] = "none";
  if (hopping) armL = armR = 150;
  else if (t < T.gebaut) { if (t > T.eins - 0.1) { armL = armR = 160; lift = Math.max(0, Math.sin(((t - T.eins + 0.1) / 0.5) * Math.PI)) * (t < T.eins + 0.4 ? 1.2 : 0); } }
  else if (t < T.so) { armR = t > T.online ? 165 : 120 + 15 * Math.sin(t * 5); }
  else if (t < T.liest) { armR = t > SEND + 0.3 ? 135 + 25 * Math.sin(t * 8) : 25; }
  else if (t < T.dann) { prop = "magnifier"; armR = 85; if (t > T.satz) { armL = armR = 165; lift = t < T.satz + 0.6 ? Math.sin(((t - T.satz) / 0.6) * Math.PI) : 0; } }
  else if (t < T.bevor) { prop = "block"; armR = 120 + 40 * Math.max(0, Math.sin(t * 7)); armL = 40; }
  else { if (t > T.live) { armL = armR = 165; lift = t < T.live + 0.6 ? Math.sin(((t - T.live) / 0.6) * Math.PI) * 1.3 : 0; } else { armR = 35; armL = 35; } }
  const camD = Math.hypot(cam.pos[0] - a1[0], cam.pos[1] - a1[1] - 1, cam.pos[2] - a1[2]);

  // section blocks flying into the website
  const toWorld = (x: number, y: number): V3 => [SCREEN[0] + (x / SW - 0.5) * SCR_W, SCREEN[1] + (0.5 - y / SH) * SCR_H, SCREEN[2] + 0.3];
  const BLOCKS: { at: number; tx: number; ty: number; key: string }[] = [
    { at: T.start, tx: 420, ty: 320, key: "bStart" },
    { at: T.angebot, tx: 224, ty: 615, key: "bAng" },
    { at: T.preise, tx: 600, ty: 615, key: "bPre" },
    { at: T.kontakt, tx: 976, ty: 615, key: "bKon" },
  ];
  // mails flying from the mailbox to the agent
  const mailK = (i: number) => cl((t - T.mails + 0.1 - i * 0.22) / 0.55);
  const chipAt = [T.warum - 0.1, T.wirklich - 0.05, T.kaufen];
  const merge = ease((t - T.daraus) / 0.45);
  return (
    <>
      <CameraRig pos={cam.pos} look={look} fov={48 - 3 * punch} />
      <color attach="background" args={["#F3EEE7"]} />
      <fog attach="fog" args={["#F3EEE7", 26, 72]} />
      <ambientLight intensity={0.75} color="#FFF4E8" />
      <hemisphereLight args={["#FFFFFF", "#E8D9C8", 0.7]} />
      <primitive object={lightTarget} />
      <directionalLight position={[look[0] + 7, 18, look[2] + 10]} target={lightTarget} intensity={1.6} color="#FFF1E0" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} shadow-camera-far={70} shadow-bias={-0.0015} shadow-normalBias={0.04} />
      {/* floor with a soft grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -16]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial map={tex.floor} roughness={0.95} />
      </mesh>
      {/* path tiles between the islands */}
      {[[HQ, D[0]], [D[0], D[1]], [D[1], D[2]], [D[2], D[3]], [D[3], D[4]]].flatMap(([a, b], j) => {
        const d = Math.hypot(b[0] - a[0], b[2] - a[2]);
        const n = Math.floor(d / 0.9);
        return Array.from({ length: n }).map((_, i) => {
          const k = (i + 0.5) / n;
          const px = a[0] + (b[0] - a[0]) * k, pz = a[2] + (b[2] - a[2]) * k;
          const ra = j === 0 ? 4.3 : DR[j - 1] + 0.2, rb = DR[j] + 0.2;
          if (Math.hypot(px - a[0], pz - a[2]) < ra || Math.hypot(px - b[0], pz - b[2]) < rb) return null;
          const on = j <= 1;
          return (
            <mesh key={`${j}-${i}`} position={[px, 0.03, pz]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.42, 0.42]} />
              <meshBasicMaterial color={on ? OR : "#D9D1C6"} transparent opacity={on ? 0.35 + 0.5 * Math.max(0, Math.sin(t * 4 - i * 0.6)) : 0.7} toneMapped={false} />
            </mesh>
          );
        });
      })}
      {/* HQ island with the swarm */}
      <Island p={HQ} r={4.2} t={t} />
      <HQBuilding t={t} tex={tex} />
      <Swarm t={t} />
      <SkBot p={[0, 3.9 + 0.4, -1.2]} t={t} seed={7} s={0.55} prop="crown" vis={back((t - T.fuehren) / 0.4)} armL={160} armR={160} lift={Math.max(0, Math.sin(((t - T.fuehren) / 0.5) * Math.PI)) * (t < T.fuehren + 0.5 ? 0.8 : 0)} />
      <Board p={[-1.5, 6.4, 0.8]} tex={dyn.count} w={3.0} h={1.0} t={t} q={q} at={T.hundert - 0.05} until={T.fuenfTage + 0.6} tilt={0.05} />
      <Board p={[2.5, 6.2, 0.8]} tex={dyn.days} w={1.7} h={1.7} t={t} q={q} at={T.dreissig - 0.05} until={T.fuenfTage + 0.6} tilt={-0.06} />
      {/* day islands */}
      {D.map((p, i) => (
        <group key={i}>
          <Island p={p} r={DR[i]} t={t} active={i === 0 && t > T.eins - 0.1} locked={i > 0} vis={isl(i)} />
          {i > 0 && isl(i) > 0.01 && <SkBot p={[p[0], 0.4, p[2] + 0.3]} t={t} seed={i * 3} s={0.75} vis={back((t - T.fuenfAg - i * 0.08) / 0.35)} prop={i === 1 ? "magnifier" : "none"} armR={i === 1 && t > T.zwei ? 150 + 20 * Math.sin(t * 9) : 20} />}
          {i > 0 && isl(i) > 0.01 && (
            <group position={[p[0] + 1.4, 3.1 + (i === 1 ? Math.sin(t * 9) * 0.06 * bump(t, T.folg, 0.6) * 3 : 0), p[2]]} rotation={[0, 0, i === 1 ? Math.sin(t * 16) * 0.25 * bump(t, T.folg, 0.5) : 0]} scale={isl(i) * 0.8}>
              <ToyBox p={[0, 0, 0]} s={[0.9, 0.75, 0.4]} color={i === 1 ? OR : "#C9C2B8"} />
              <mesh position={[0, 0.5, 0]}><torusGeometry args={[0.3, 0.08, 8, 20, Math.PI]} /><meshStandardMaterial color="#8A857D" /></mesh>
            </group>
          )}
        </group>
      ))}
      {/* floating day labels, readable from the overview */}
      {D.map((p, i) => (
        <Board key={i} p={[p[0] + (i === 0 ? 1.2 : 0), i === 0 ? 4.6 : 4.8, p[2] + (i === 0 ? -1 : 0)]} tex={tex[`day${i}`]} w={i === 0 ? 5.6 : 5.0} h={i === 0 ? 1.37 : 1.22} t={t} q={q} at={T.fuenfTage + 0.25 + i * 0.1} until={i === 0 ? T.gebaut - 0.4 : i === 1 ? 99 : T.gebaut} />
      ))}
      <Board p={[-3.8, 6.2, -12]} tex={tex.heute} w={3.2} h={0.8} t={t} q={q} at={T.heute} until={T.gebaut - 0.4} tilt={0.06} />
      <Burst3D at={T.eins} t={t} p={[-5, 1.5, -9.6]} colors={[OR, "#FFFFFF", "#F5C542"]} n={22} power={1.4} />

      {/* ---- day 1 island content ---- */}
      <group position={[SCREEN[0], 0.4, SCREEN[2]]} scale={back((t - T.eins - 0.15) / 0.45)}><group position={[-SCREEN[0], -0.4, -SCREEN[2]]}>
      <Monitor p={SCREEN} w={SCR_W} h={SCR_H} tex={dyn.site} />
      {[-SCR_W / 2 + 0.4, SCR_W / 2 - 0.4].map((x) => <ToyBox key={x} p={[SCREEN[0] + x, (SCREEN[1] - SCR_H / 2) / 2 + 0.2, SCREEN[2] - 0.25]} s={[0.24, SCREEN[1] - SCR_H / 2, 0.24]} color="#2A2622" />)}
      </group></group>
      <Board p={[-5, 6.05, -14.2]} tex={tex.live} w={2.3} h={0.62} t={t} q={q} at={T.online} until={T.so - 0.2} tilt={-0.05} />
      <Board p={[-5, 5.5, -13.9]} tex={tex.live} w={1.9} h={0.52} t={t} q={q} at={T.live} tilt={-0.05} />
      <Burst3D at={T.online} t={t} p={[-5, 3.6, -14]} colors={[GREEN, "#FFFFFF", OR]} n={18} power={1.0} floor={0.5} />
      <Burst3D at={T.live} t={t} p={[-5, 3.6, -14]} colors={[GREEN, "#FFFFFF", OR, "#F5C542"]} n={16} power={1.7} floor={0.5} />
      {/* desk with the Superkind chat */}
      <group position={[CHAT[0], 0.4, CHAT[2]]} rotation={[0, CHAT_YAW, 0]}>
        <ToyBox p={[0, 0.66, 0.2]} s={[3.4, 0.14, 1.4]} color="#E9E1D6" top="#F6F1EA" />
        {[[-1.5, -0.4], [1.5, -0.4], [-1.5, 0.8], [1.5, 0.8]].map(([dx, dz], i) => <ToyBox key={i} p={[dx, 0.3, dz]} s={[0.12, 0.6, 0.12]} color="#B9AE9F" />)}
        <ToyBox p={[-0.9, 0.78, 0.6]} s={[1.2, 0.08, 0.42]} color="#FFFFFF" />
        <mesh position={[1.25, 0.95, 0.55]} castShadow><cylinderGeometry args={[0.16, 0.13, 0.36, 12]} /><meshStandardMaterial color={OR} /></mesh>
      </group>
      <Monitor p={CHAT} w={2.9} h={2.06} tex={dyn.chat} yaw={CHAT_YAW} stand={0.55} />
      <Board p={[CHAT[0] + 1.0, CHAT[1] + 2.0, CHAT[2] + 0.9]} tex={tex.teams} w={1.6} h={0.47} t={t} q={q} at={T.teams - 0.05} until={T.liest} tilt={0.06} />
      {/* customer mails → agent → reasons → one sentence */}
      <group position={MAILBOX}>
        <ToyBox p={[0, 0.55, 0]} s={[0.22, 1.1, 0.22]} color="#2A2622" />
        <ToyBox p={[0, 1.35, 0]} s={[0.8, 0.6, 1.0]} color="#2D7DD2" top="#4A97E6" />
        <ToyBox p={[0.42, 1.55, 0.2]} s={[0.05, 0.4, 0.12]} color={OR} rot={[0, 0, bump(t, T.mails, 0.6) > 0 ? -0.9 : 0]} />
      </group>
      {MAILS.map((_, i) => {
        const k = mailK(i);
        if (k <= 0 || t > T.daraus + 0.5) return null;
        const end: V3 = [-2.4 + (i - 1) * 0.15, 5.4 - i * 1.3, -9.4];
        const p = k < 1 ? bez3([MAILBOX[0], 1.8, MAILBOX[2]], [0.2, 5.6, -8.4], end, ease(k)) : end;
        const fade = 1 - ease((t - T.daraus) / 0.35);
        return <Board key={i} p={p} tex={tex[`mail${i}`]} w={2.6 * fade} h={1.22 * fade} t={t} q={q} bob={0.03} tilt={(i - 1) * 0.06} />;
      })}
      {["chipFast", "chipPrice", "chipHand"].map((key, i) => {
        if (t < chipAt[i] - 0.05) return null;
        const start: V3 = [-1.1 + (i - 1) * 0.15, 5.0 - i * 1.3, -9.2];
        const p = lerp3(start, [-2.4, 4.1, -9.6], merge);
        return <Board key={key} p={p} tex={tex[key]} w={1.5 * (1 - merge * 0.9)} h={0.46 * (1 - merge * 0.9)} t={t} q={q} at={chipAt[i]} until={T.satz - 0.2} bob={0.03} />;
      })}
      <Board p={[-2.4, 4.1, -9.6]} tex={tex.claim} w={3.9} h={1.15} t={t} q={q} at={T.satz - 0.1} until={T.dann + 0.25} tilt={-0.04} />
      <Burst3D at={T.satz} t={t} p={[-2.4, 4.0, -9.6]} colors={[OR, "#FFFFFF", "#F5C542"]} n={22} power={1.0} floor={0.5} />
      {/* build: four blocks fly into the website */}
      {BLOCKS.map((b, i) => {
        const k = cl((t - b.at) / 0.5);
        if (t < b.at || t > b.at + 0.6) return null;
        const p = bez3([-2.6, 1.2, -12.0], [-3.2, 5.2, -12.4], toWorld(b.tx, b.ty), ease(k));
        return (
          <group key={b.key}>
            <group position={p} rotation={[k * 3, k * 2, 0]} scale={1 - 0.6 * k}>
              <ToyBox p={[0, 0, 0]} s={[1.0, 0.5, 0.5]} color={OR} top="#FF8A5B" />
            </group>
          </group>
        );
      })}
      {BLOCKS.map((b, i) => <Board key={b.key + "l"} p={[toWorld(b.tx, b.ty)[0], toWorld(b.tx, b.ty)[1] + (i === 0 ? 0.6 : 0.5), SCREEN[2] + 0.6]} tex={tex[b.key]} w={1.6} h={0.42} t={t} q={q} at={b.at + 0.45} until={b.at + 1.05} />)}
      {BLOCKS.map((b) => <Burst3D key={b.key + "b"} at={b.at + 0.5} t={t} p={toWorld(b.tx, b.ty)} colors={[OR, "#FFFFFF"]} n={10} power={0.5} floor={0.5} />)}
      {/* outro: tomorrow */}
      <Board p={[5.0, 7.2, -14.8]} tex={tex.tomorrow} w={4.4} h={1.15} t={t} q={q} at={T.leads - 0.1} until={T.komm - 0.05} tilt={0.05} />
      <Board p={[4.6, 5.0 + 1.7 * inOut((t - T.schick + 0.1) / 0.45), -9.6]} tex={dyn.comment} w={4.2} h={1.35} t={t} q={q} at={T.komm - 0.1} bob={0.03} />
      {/* reward: the DM that answers the comment */}
      <Board p={[4.6, 4.65, -9.5]} tex={dyn.dm} w={4.2} h={2.05} t={t} q={q} at={T.schick + 0.2} bob={0.03} />
      <Burst3D at={T.prompt + 0.1} t={t} p={[4.6, 4.3, -9.4]} colors={[OR, "#FFFFFF", "#F5C542"]} n={18} power={0.9} floor={0.5} />
      <Burst3D at={CTA_SENT} t={t} p={[4.6, 4.4, -9.6]} colors={[OR, "#FFFFFF", "#F5C542", GREEN]} n={26} power={1.2} floor={0.5} />
      <Burst3D at={T.zwei} t={t} p={[5.4, 1.4, -15.2]} colors={[OR, "#FFFFFF"]} n={14} power={0.8} />
      <SkBot p={a1} yaw={a1yaw} t={t} seed={1} armL={Math.round(armL)} armR={Math.round(armR)} lift={lift} prop={prop} talk={t > SEND + 0.4 && t < T.liest} vis={cl((camD - 2.6) / 2)} badge={tex.badge1} />
    </>
  );
};

// ---------- textures ----------
const useStaticTex = (ready: boolean, logo: HTMLImageElement | null, teams: HTMLImageElement | null, outlook: HTMLImageElement | null) =>
  React.useMemo(() => {
    if (!ready) return null;
    const t: Tex = {};
    t.floor = canvasTex(1024, 1024, (c) => {
      c.fillStyle = "#EFE9E1"; c.fillRect(0, 0, 1024, 1024);
      c.strokeStyle = "rgba(160,140,120,.16)"; c.lineWidth = 3;
      for (let i = 0; i <= 16; i++) { c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64, 1024); c.stroke(); c.beginPath(); c.moveTo(0, i * 64); c.lineTo(1024, i * 64); c.stroke(); }
      for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(150,120,90,${0.03 + rnd(i) * 0.04})`; c.fillRect(rnd(i + 3) * 1024, rnd(i + 7) * 1024, 4, 4); }
    });
    t.floor.wrapS = t.floor.wrapT = THREE.RepeatWrapping;
    t.floor.repeat.set(10, 10);
    t.hqSign = canvasTex(620, 112, (c) => { c.fillStyle = INK; c.fillRect(0, 0, 620, 112); c.fillStyle = "#FFFFFF"; c.textAlign = "center"; c.textBaseline = "middle"; c.font = `60px ${F_B}`; c.fillText("DEINE FIRMA", 310, 60); });
    const names = ["AUFTRITT", "LEADS", "OUTREACH", "TAG 4", "TAG 5"];
    names.forEach((n, i) => { t[`day${i}`] = dayTex(i + 1, i < 3 ? n : "???", i === 0, i > 0); });
    t.heute = signTex("HEUTE", INK, "#FFFFFF", INK, 520, 150);
    t.live = signTex("● LIVE", GREEN, "#FFFFFF", "#FFFFFF", 520, 150);
    t.teams = canvasTex(520, 150, (c) => {
      c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 514, 140, 70); c.fill(); c.strokeStyle = "#E2DCD3"; c.lineWidth = 6; roundRect(c, 3, 3, 508, 134, 67); c.stroke();
      if (teams) c.drawImage(teams, 40, 30, 80, 80);
      c.fillStyle = INK; c.font = `58px ${F_B}`; c.textBaseline = "middle"; c.fillText("in Teams", 140, 74);
    });
    MAILS.forEach((m, i) => { t[`mail${i}`] = mailTex(m, outlook); });
    t.chipFast = signTex("SCHNELL", "#FFFFFF", OR, OR, 460, 140);
    t.chipPrice = signTex("FESTPREIS", "#FFFFFF", OR, OR, 460, 140);
    t.chipHand = signTex("AUS EINER HAND", "#FFFFFF", OR, OR, 460, 140);
    t.claim = canvasTex(1000, 296, (c) => {
      c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 984, 280, 40); c.fill();
      c.fillStyle = OR; roundRect(c, 0, 0, 990, 280, 40); c.fill();
      c.fillStyle = "#FFFFFF"; roundRect(c, 10, 10, 970, 260, 32); c.fill();
      c.fillStyle = OR; c.font = `30px ${F_B}`; c.textBaseline = "middle"; c.fillText("DEINE POSITIONIERUNG", 50, 62);
      c.fillStyle = INK; c.font = `62px ${F_B}`; c.fillText("Wärmepumpe in 3 Tagen.", 50, 140);
      c.fillText("Zum Festpreis.", 50, 214);
    });
    t.bStart = signTex("STARTSEITE", INK, "#FFFFFF", INK, 520, 136);
    t.bAng = signTex("ANGEBOT", INK, "#FFFFFF", INK, 520, 136);
    t.bPre = signTex("PREISE", INK, "#FFFFFF", INK, 520, 136);
    t.bKon = signTex("KONTAKT", INK, "#FFFFFF", INK, 520, 136);
    t.tomorrow = canvasTex(1000, 262, (c) => {
      c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 984, 246, 40); c.fill();
      c.fillStyle = INK; roundRect(c, 0, 0, 990, 250, 40); c.fill();
      c.fillStyle = OR; c.font = `40px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "center"; c.fillText("MORGEN · TAG 2", 495, 74);
      c.fillStyle = "#FFFFFF"; c.font = `78px ${F_B}`; c.fillText("100 Leads für dich", 495, 160);
    });
    t.badge1 = canvasTex(128, 128, (c) => { c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill(); c.fillStyle = OR; c.font = `84px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("1", 64, 70); });
    return t;
  }, [ready, logo, teams, outlook]);

const useDynTex = (t: number, logo: HTMLImageElement | null, teams: HTMLImageElement | null) => {
  const building = t >= T.baut - 0.2 && t < T.bevor;
  const sk = (a: number) => (building ? ease((t - a - 0.5) / 0.35) : 1);
  const site = useDyn(SW, SH, (c) => drawSite(c, t, {
    hero: sk(T.start), ang: sk(T.angebot), pre: sk(T.preise), kon: sk(T.kontakt),
    live: (t >= T.online && t < T.so) || t >= T.live + 0.02 || t < T.gebaut - 1,
    approve: t >= T.bevor && t < T.live ? ease((t - T.bevor) / 0.3) : t >= T.live ? 1 - ease((t - T.live) / 0.25) : 0,
    hl: bump(t, T.position + 0.3, 0.6),
  }, logo));
  const chat = useDyn(CW, CH, (c) => drawChat(c, t, logo, teams));
  const count = useDyn(600, 200, (c) => {
    const n = landedCount(t);
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 6, 12, 588, 184, 40); c.fill();
    c.fillStyle = OR; roundRect(c, 0, 0, 592, 186, 40); c.fill();
    c.fillStyle = "#FFFFFF"; c.textBaseline = "middle"; c.textAlign = "center";
    c.font = `96px ${F_B}`; c.fillText(String(n), 160, 96);
    c.font = `44px ${F_B}`; c.textAlign = "left"; c.fillText("KI-AGENTEN", 268, 98);
  });
  const days = useDyn(400, 400, (c) => {
    const d = Math.max(1, Math.min(30, Math.round(1 + 29 * ease((t - T.dreissig) / 0.7))));
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 384, 380, 46); c.fill();
    c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 390, 384, 46); c.fill();
    c.fillStyle = OR; roundRect(c, 0, 0, 390, 110, 46); c.fill(); c.fillRect(0, 60, 390, 50);
    c.fillStyle = "#FFFFFF"; c.font = `50px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TAG", 195, 60);
    c.fillStyle = INK; c.font = `170px ${F_B}`; c.fillText(String(d), 195, 250);
  });
  const comment = useDyn(900, 290, (c) => {
    const kw = "AGENT";
    const typed = kw.slice(0, Math.max(0, Math.floor((t - T.komm - 0.35) * 10)));
    const sent = t >= CTA_SENT;
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 884, 274, 36); c.fill();
    c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 892, 278, 36); c.fill();
    c.fillStyle = INK; c.font = `38px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Kommentare", 40, 54);
    c.strokeStyle = sent ? GREEN : OR; c.lineWidth = 7; roundRect(c, 30, 100, 832, 148, 74); c.stroke();
    c.fillStyle = OR_L; c.beginPath(); c.arc(110, 174, 46, 0, 7); c.fill();
    c.fillStyle = OR; c.font = `32px ${F_B}`; c.textAlign = "center"; c.fillText("DU", 110, 176);
    c.textAlign = "left"; c.fillStyle = INK; c.font = `86px ${F_B}`; c.fillText(typed + (sent || Math.floor(t * 3) % 2 ? "" : "|"), 184, 178);
    c.fillStyle = sent ? GREEN : OR; c.beginPath(); c.arc(784, 174, 50, 0, 7); c.fill();
    c.strokeStyle = "#FFFFFF"; c.lineWidth = 8; c.beginPath(); c.moveTo(784, 196); c.lineTo(784, 152); c.moveTo(766, 170); c.lineTo(784, 152); c.lineTo(802, 170); c.stroke();
    if (sent) { c.fillStyle = GREEN; roundRect(c, 640, 20, 222, 58, 29); c.fill(); c.fillStyle = "#FFFFFF"; c.font = `28px ${F_B}`; c.fillText("✓ gesendet", 668, 50); }
  });
  const dm = useDyn(900, 440, (c) => {
    const file = ease((t - T.prompt - 0.05) / 0.3);
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 884, 424, 36); c.fill();
    c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 892, 428, 36); c.fill();
    c.fillStyle = OR; c.beginPath(); c.arc(70, 64, 32, 0, 7); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `30px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("F", 70, 66);
    c.textAlign = "left"; c.fillStyle = INK; c.font = `36px ${F_B}`; c.fillText("florent_preusser", 120, 52);
    c.fillStyle = MUTED; c.font = `26px ${F_M}`; c.fillText("Direktnachricht · jetzt", 120, 88);
    c.fillStyle = "#F1EEEA"; roundRect(c, 40, 124, 560, 84, 42); c.fill();
    c.fillStyle = INK; c.font = `36px ${F_S}`; c.fillText("Hier ist dein Prompt:", 76, 168);
    if (file > 0) {
      c.save(); c.globalAlpha = file; c.translate(0, (1 - file) * 24);
      c.fillStyle = OR_L; roundRect(c, 40, 232, 812, 164, 32); c.fill();
      c.strokeStyle = OR; c.lineWidth = 5; roundRect(c, 40, 232, 812, 164, 32); c.stroke();
      c.fillStyle = OR; roundRect(c, 70, 258, 92, 112, 14); c.fill();
      c.fillStyle = "#FFFFFF"; c.font = `30px ${F_B}`; c.textAlign = "center"; c.fillText("PDF", 116, 316);
      c.textAlign = "left"; c.fillStyle = INK; c.font = `${fit(c, "Positionierungs-Prompt", F_B, 46, 640)}px ${F_B}`; c.fillText("Positionierungs-Prompt", 190, 292);
      c.fillStyle = OR_D; c.font = `30px ${F_S}`; c.fillText("von Agent eins · zum Kopieren", 190, 344);
      c.restore();
    }
  });
  return { site, chat, count, days, comment, dm };
};

// ---------- 2D: captions in Superkind colours + low-key series chip ----------
const SK_THEME: PixelTheme = { bg: "#F3EEE7", bgPattern: "none" as PixelTheme["bgPattern"], floor: "#FFFFFF", floorLine: OR, accent: OR, dark: INK, gold: "#FFFFFF", green: OR, cream: "#FFFFFF", ink: INK };
const SeriesChip: React.FC<{ t: number }> = ({ t }) => {
  const k = ease((t - T.fuenfTage) / 0.4);
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 118, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * -20}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,.94)", borderRadius: 999, padding: "12px 24px", boxShadow: "0 8px 24px rgba(40,24,10,.16)", fontFamily: F_B, fontSize: 30, color: INK }}>
        <span>TAG 1</span><span style={{ color: MUTED }}>/ 5</span>
        <div style={{ display: "flex", gap: 8, marginLeft: 6 }}>
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: i === 0 ? OR : "transparent", border: `3px solid ${i === 0 ? OR : "#D2CBC1"}` }} />)}
        </div>
      </div>
    </div>
  );
};

// ---------- audio ----------
type Sfx = [string, number, number];
const TRANSITS = HOLDS.slice(0, -1).map((h) => h.b);
const SFX: Sfx[] = [
  ...TRANSITS.map((c): Sfx => ["whoosh-quick", c - 0.02, 0.45]),
  ...Array.from({ length: 14 }, (_, i): Sfx => ["ui-pop", 0.3 + i * 0.15, 0.14]),
  ["riser", T.firma - 0.6, 0.2], ["powerup", T.fuehren, 0.25], ["coin", T.dreissig, 0.25], ["coin", T.dreissig + 0.3, 0.2],
  ...[0, 1, 2, 3, 4].map((i): Sfx => ["ui-pop", T.fuenfTage + 0.2 + i * 0.1, 0.35]),
  ["jump", T.eins, 0.25], ["chime", T.eins, 0.3],
  ["ui-pop", T.gebaut, 0.4], ["stamp", T.online, 0.4], ["chime", T.online, 0.3],
  ["ui-pop", T.teams, 0.35], ["typing", T.was, 0.22], ["click", SEND, 0.6], ["ui-pop", SEND + 0.35, 0.35],
  ...[0, 1, 2].map((i): Sfx => ["whoosh-quick", T.mails - 0.1 + i * 0.22, 0.2]),
  ...[0, 1, 2].map((i): Sfx => ["check", [T.warum - 0.1, T.wirklich - 0.05, T.kaufen][i], 0.35]),
  ["powerup", T.satz - 0.1, 0.28], ["stamp", T.satz, 0.35],
  ...[T.start, T.angebot, T.preise, T.kontakt].flatMap((a): Sfx[] => [["whoosh-quick", a, 0.22], ["bump", a + 0.5, 0.35]]),
  ["ui-pop", T.bevor + 0.05, 0.4], ["click", CLICK, 0.7], ["chime", T.live, 0.35], ["coin", T.live + 0.05, 0.25], ["jump", T.live, 0.22],
  ["ui-pop", T.zwei, 0.35], ["ui-pop", T.leads - 0.1, 0.4], ["bump", T.folg, 0.3],
  ["ui-pop", T.komm - 0.1, 0.4], ["typing", T.komm + 0.35, 0.22], ["check", CTA_SENT, 0.4], ["powerup", CTA_SENT, 0.25], ["ui-pop", T.schick + 0.2, 0.4], ["chime", T.prompt + 0.1, 0.3],
];

export const Agents100Day1: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const ready = useFontsReady([`40px ${F_B}`, `40px ${F_S}`, `40px ${F_M}`, "800 70px Rubik"]);
  const logo = useImage(staticFile("superkind-logo.svg"));
  const teams = useImage(staticFile("logos/teams.svg"));
  const outlook = useImage(staticFile("logos/outlook.svg"));
  const tex = useStaticTex(ready, logo, teams, outlook);
  const dyn = useDynTex(t, logo, teams);
  const a = camAt(t - 0.03).pos, b = camAt(t + 0.03).pos;
  const speed = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 0.06;
  const blur = Math.min(3.5, Math.max(0, (speed - 8) * 0.12));
  const flash = 0.35 * bump(t, T.eins, 0.1) + 0.3 * bump(t, T.online, 0.08) + 0.35 * bump(t, T.live, 0.1) + 0.25 * bump(t, T.satz, 0.08);
  return (
    <AbsoluteFill style={{ background: "#F3EEE7" }}>
      {tex && (
        <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
          <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
            <World t={t} tex={tex} dyn={dyn} />
          </ThreeCanvas>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 58%, rgba(120,80,40,.22) 100%)" }} />
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
      <SeriesChip t={t} />
      <PillCaptions words={WD} theme={SK_THEME} />
      <Audio src={staticFile("sk100/voice.mp3")} />
      <Audio src={staticFile("sk100/music-loser.mp3")} volume={0.25} />
      {SFX.map(([n, s, v], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s * 30))} durationInFrames={90}>
          <Audio src={staticFile(`sirtoken/sfx-${n}.mp3`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
