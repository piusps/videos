// Superkind series "KI übernimmt meine Firma", Tag 2/100 (2026-10-22, v6 "Stadt" after Pius' feedback): the company is a
// small town, every department a house. Tag 1 took over Positionierung, today an agent moves into Vertrieb (lead research +
// LinkedIn outreach, tasks given in Slack by tagging @Superkind). Viewers steer along: every comment with a job moves in as
// a resident bot next episode. Gamified HUD (day bar, houses x/8, missions, toast, lock), walking bot, cliffhanger + CTA.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CameraRig, ToyBox, canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, Word, PixelTheme } from "../components/PixelKit";
import words from "../../public/sk100d2t/words.json";

export const AGENTS_DAY2_SECONDS = 46.5;
const W = 1080, H = 1920;
type V3 = [number, number, number];
const OR = "#FF6B35", OR_D = "#E5521F", OR_L = "#FFEDE4", INK = "#16130F", MUTED = "#8A857D", LINE = "#EEEAE4", GREEN = "#1F9D55", LI = "#0A66C2", YEL = "#F5C542";
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
const S = (i: number) => WD[i].s; // word start by index (script is fixed, see runs/fpn-100-agenten-tag2/town)

// ---------- key times from the voice ----------
const T = {
  komplett: S(9), uebernimmt: S(10), und0: S(11), steuerst: S(13), jeder0: S(15), zieht0: S(17), firma0: S(22),
  tag: S(23), zwei2: S(24), meineFirma: S(27), stadt: S(32), abteilung: S(34), haus1: S(36),
  gestern: S(37), positionierung: S(41), website: S(44), probleme: S(47), heute: S(52), agent: S(55), vertrieb: S(58),
  ich: S(59), slack: S(63), hausv: S(66), sanieren: S(69),
  warum: S(70), haus: S(76), dieHaben2: S(77), hundert2: S(79),
  erSucht: S(80), signalen: S(83), saniert: S(85), schreibt: S(87), handwerker: S(91),
  zwanzig2: S(92), jeder: S(95), entscheidet: S(97),
  dann: S(98), linkedin2: S(103), nachricht: S(105), signal: S(108),
  bevor: S(109), fragt: S(112), klick: S(116), raus: S(117),
  und: S(118) - 0.1, antwortet: S(118), einer: S(120), tipp: S(121), wie: S(125), und2: S(129), beruf: S(132),
  morgen: S(134), bot2: S(138), stadt2: S(141), und3: S(142), prompts: S(146), superkind2: S(148), claude: S(152),
  morgen2: S(153), antworten: S(155), naechste: S(158),
};
const SEND = T.sanieren + 0.32;
const CLICK = T.klick - 0.05;
const TIP1 = "Ich tippe 4", TIP2 = " · Bäckerin";
const CTA_SENT = T.beruf + 0.9;
const LAUNCH2 = T.raus + 0.02;

// ---------- world layout ----------
const HQ: V3 = [0, 0, 0];
const D0: V3 = [-5, 0, -11]; // Positionierung's lot (Tag 1), the live website stands on it
const I2: V3 = [5.4, 0, -15.5]; // Vertrieb's work lot (lead screen), the market lies around it
const SCREEN: V3 = [5.4, 3.6, -18.9];
const SCR_W = 5.2, SCR_H = 3.25;
const CHAT: V3 = [9.6, 2.45, -12.2];
const CHAT_YAW = -0.55;
const INSIGHT: V3 = [2.0, 4.5, -13.4];
// the company = a town, one house per department
type Dept = { n: string; p: V3; yaw: number; st: "done" | "today" | "locked" };
const DEPTS: Dept[] = [
  { n: "POSITIONIERUNG", p: [-7.6, 0.4, -8.6], yaw: 0.5, st: "done" },
  { n: "VERTRIEB", p: [12.0, 0, -8.8], yaw: -0.54, st: "today" },
  { n: "MARKETING", p: [-8.0, 0, 2.0], yaw: 0.6, st: "locked" },
  { n: "SUPPORT", p: [-7.5, 0, -20.5], yaw: 0.4, st: "locked" },
  { n: "BUCHHALTUNG", p: [-0.5, 0, -25.5], yaw: 0.1, st: "locked" },
  { n: "PERSONAL", p: [7.5, 0, -25.5], yaw: -0.2, st: "locked" },
  { n: "LAGER", p: [12.8, 0, -19.5], yaw: -0.5, st: "locked" },
];
const VERT = DEPTS[1].p;
// resident plots: every comment with a job moves in here next episode
const RES: V3[] = Array.from({ length: 6 }, (_, i) => [2.2 + i * 1.85, 0, -5.4] as V3);

// ---------- camera ----------
type Hold = { a: number; b: number; p0: V3; p1: V3; l0: V3; l1: V3 };
const SLACK_CAM: Hold = { a: 0, b: 0, p0: [6.3, 3.45, -6.6], p1: [6.6, 3.35, -7.1], l0: [9.6, 2.35, -12.2], l1: [9.6, 2.35, -12.2] };
const HOLDS: Hold[] = [
  { a: 0, b: T.und0 - 0.1, p0: [0.6, 3.5, 9.2], p1: [-0.4, 19.5, 12.5], l0: [0, 2.3, -1.2], l1: [-1.8, 0, -12.5] },
  { a: T.und0 + 0.3, b: T.tag - 0.15, p0: [3.4, 4.6, 10.6], p1: [3.0, 4.6, 9.8], l0: [2.0, 2.0, 0.8], l1: [1.6, 1.8, 0.2] },
  { a: T.tag + 0.3, b: T.gestern - 0.15, p0: [2.0, 57, 14], p1: [2.0, 54, 12.5], l0: [2.0, 0, -11.6], l1: [2.0, 0, -11.6] },
  { a: T.gestern + 0.3, b: T.heute - 0.15, p0: [-3.0, 4.6, -2.6], p1: [-3.3, 4.4, -3.5], l0: [-4.7, 2.8, -12.2], l1: [-4.7, 2.8, -12.2] },
  { a: T.heute + 0.3, b: T.ich - 0.05, p0: [6.6, 4.6, 0.4], p1: [7.3, 4.1, -0.8], l0: [11.4, 1.9, -7.8], l1: [11.6, 1.9, -8.1] },
  { ...SLACK_CAM, a: T.ich + 0.3, b: T.warum + 0.15 },
  { a: T.warum + 0.75, b: T.hundert2 + 0.5, p0: [1.6, 6.6, -3.6], p1: [2.0, 6.3, -4.4], l0: [2.0, 4.1, -13.4], l1: [2.0, 4.1, -13.4] },
  { a: T.erSucht + 0.15, b: T.handwerker + 0.5, p0: [5.4, 6.3, -2.4], p1: [5.4, 5.9, -3.2], l0: [5.4, 4.5, -14.5], l1: [5.4, 4.5, -14.5] },
  { a: T.zwanzig2 + 0.15, b: T.dann - 0.15, p0: [5.4, 4.9, -7.4], p1: [5.4, 4.7, -7.9], l0: [5.4, 3.4, -18.8], l1: [5.4, 3.3, -18.8] },
  { a: T.dann + 0.3, b: T.bevor - 0.12, p0: [5.4, 3.95, -7.7], p1: [5.4, 3.9, -8.2], l0: [5.4, 3.55, -18.9], l1: [5.4, 3.55, -18.9] },
  { a: T.bevor + 0.5, b: T.raus + 0.2, p0: [6.6, 3.35, -7.1], p1: [6.4, 3.4, -6.8], l0: [9.6, 2.35, -12.2], l1: [9.6, 2.35, -12.2] },
  { a: T.und + 0.45, b: T.und2 - 0.12, p0: [5.4, 9.4, -3.2], p1: [5.4, 8.6, -4.8], l0: [5.4, 1.4, -15.0], l1: [5.4, 1.8, -14.8] },
  { a: T.und2 + 0.3, b: T.morgen2 - 0.12, p0: [7.9, 4.9, 3.9], p1: [7.9, 4.4, 2.8], l0: [7.9, 1.9, -5.0], l1: [7.9, 2.0, -5.0] },
  { a: T.morgen2 + 0.35, b: 99, p0: [1.5, 17, 9.5], p1: [1.5, 15, 7.5], l0: [1.0, 1.5, -10], l1: [1.0, 2.0, -10] },
];
const VIA: { pos: V3; look: V3 }[] = [
  { pos: [2.5, 8, 11], look: [0.8, 1.2, -2] },
  { pos: [2, 19, 13], look: [0, 0.5, -8] },
  { pos: [-2, 14, 3], look: [-5, 1.5, -11] },
  { pos: [2, 7.5, 1], look: [8, 2, -9] },
  { pos: [7.2, 4.0, -4.5], look: [10.2, 2.2, -12.4] },
  { pos: [5, 6.5, -4], look: [5, 3.5, -13] },
  { pos: [3.5, 6.5, -3], look: [4, 4.2, -14] },
  { pos: [5.4, 5.6, -5], look: [5.4, 4, -17] },
  { pos: [5.4, 4.5, -9.5], look: [5.4, 3.5, -18.9] },
  { pos: [7.5, 4.6, -9], look: [8.5, 2.8, -14] },
  { pos: [6.5, 7, -4.5], look: [7, 2, -13] },
  { pos: [7, 8, 0], look: [7.5, 2, -7] },
  { pos: [4, 13, 9], look: [0, 1, -9] },
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
const PUNCH = [T.uebernimmt, T.zieht0 + 0.1, T.zwei2, T.stadt, T.positionierung, T.vertrieb, SEND, T.hundert2, T.saniert, T.schreibt, T.handwerker, T.zwanzig2, T.entscheidet, T.signal, CLICK, T.raus, T.einer, T.beruf, T.bot2, T.prompts, T.naechste];

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


// ---------- canvas: Slack, where you tag @Superkind ----------
const CW = 900, CH = 640;
const USER_MSG = " such mir Hausverwaltungen im Umland, die gerade sanieren.";
const BOT_MSG = "Mach ich. Unsere Positionierung von gestern ist mein Filter.";
const SB = 190; // sidebar width
const slackMsg = (c: CanvasRenderingContext2D, y: number, who: "you" | "bot", name: string, draw: (x: number, y: number) => number) => {
  const x = SB + 26;
  if (who === "you") { c.fillStyle = "#2D7DD2"; roundRect(c, x, y, 52, 52, 10); c.fill(); c.fillStyle = "#FFFFFF"; c.font = `26px ${F_B}`; c.textAlign = "center"; c.fillText("F", x + 26, y + 28); c.textAlign = "left"; }
  else botTile(c, x, y, 52);
  c.fillStyle = INK; c.font = `24px ${F_B}`; c.fillText(name, x + 68, y + 12);
  let nx = x + 68 + c.measureText(name).width + 10;
  if (who === "bot") { c.fillStyle = "#E8E5E0"; roundRect(c, nx, y, 52, 26, 5); c.fill(); c.fillStyle = "#5E5850"; c.font = `16px ${F_B}`; c.fillText("APP", nx + 9, y + 14); nx += 62; }
  c.fillStyle = MUTED; c.font = `18px ${F_M}`; c.fillText("jetzt", nx, y + 13);
  return draw(x + 68, y + 46);
};
const drawSlack = (c: CanvasRenderingContext2D, t: number, slack: HTMLImageElement | null) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, CW, CH);
  c.textBaseline = "middle"; c.textAlign = "left";
  // sidebar
  c.fillStyle = "#3F0E40"; c.fillRect(0, 0, SB, CH);
  c.fillStyle = "#FFFFFF"; c.font = `24px ${F_B}`; c.fillText("Deine Firma", 20, 40);
  ["allgemein", "vertrieb", "service"].forEach((ch, i) => {
    const y = 104 + i * 48;
    if (i === 1) { c.fillStyle = "#1164A3"; roundRect(c, 10, y - 20, SB - 20, 40, 8); c.fill(); }
    c.fillStyle = i === 1 ? "#FFFFFF" : "#CFC3CF"; c.font = `22px ${i === 1 ? F_B : F_M}`; c.fillText("# " + ch, 24, y);
  });
  c.fillStyle = "#CFC3CF"; c.font = `18px ${F_B}`; c.fillText("APPS", 24, 286);
  botTile(c, 22, 306, 30); c.fillStyle = "#FFFFFF"; c.font = `21px ${F_M}`; c.fillText("Superkind", 62, 322);
  // header
  c.fillStyle = INK; c.font = `28px ${F_B}`; c.fillText("# vertrieb", SB + 26, 40);
  if (slack) c.drawImage(slack, CW - 58, 22, 36, 36);
  c.fillStyle = LINE; c.fillRect(SB, 78, CW - SB, 2);
  const sent = t >= SEND;
  let y = 104;
  const mention = (x: number, yy: number) => { c.font = `24px ${F_B}`; const w = c.measureText("@Superkind").width + 12; c.fillStyle = "#E8F2FB"; roundRect(c, x - 4, yy - 16, w, 32, 6); c.fill(); c.fillStyle = "#1264A3"; c.fillText("@Superkind", x + 2, yy); return w; };
  if (sent) {
    const k = ease((t - SEND) / 0.25);
    c.save(); c.globalAlpha = k;
    y = slackMsg(c, y, "you", "Florent", (x, yy) => {
      const mw = mention(x, yy);
      c.font = `24px ${F_M}`; c.fillStyle = INK;
      const lines = wrap(c, USER_MSG.trim(), 560 - mw);
      c.fillText(lines[0], x + mw + 2, yy);
      const rest = wrap(c, USER_MSG.trim().slice(lines[0].length).trim(), 600);
      rest.forEach((l, i) => c.fillText(l, x, yy + 34 * (i + 1)));
      return yy + 34 * rest.length + 40;
    });
    c.restore();
    if (t >= SEND + 0.3) {
      const n = Math.max(0, Math.floor((t - SEND - 0.45) * 80));
      y = slackMsg(c, y, "bot", "Superkind", (x, yy) => {
        c.font = `24px ${F_M}`;
        if (n === 0) { c.fillStyle = "#B5AEA4"; c.fillText("•".repeat(1 + (Math.floor(t * 6) % 3)), x, yy); return yy + 50; }
        const lines = wrap(c, BOT_MSG.slice(0, n), 600);
        c.fillStyle = INK; lines.forEach((l, i) => c.fillText(l, x, yy + i * 34));
        return yy + lines.length * 34 + 30;
      });
    }
    // later: the approval question
    if (t >= T.bevor + 0.2) {
      const ka = ease((t - T.bevor - 0.2) / 0.3);
      c.save(); c.globalAlpha = ka;
      slackMsg(c, y, "bot", "Superkind", (x, yy) => {
        c.fillStyle = INK; c.font = `24px ${F_M}`;
        c.fillText("20 LinkedIn-Nachrichten sind fertig.", x, yy);
        c.fillText("Soll ich sie senden?", x, yy + 34);
        const done = t >= CLICK + 0.08;
        const by = yy + 62;
        const pr = 1 - 0.07 * bump(t, CLICK, 0.12);
        c.save(); c.translate(x + 85, by + 26); c.scale(pr, pr);
        c.fillStyle = done ? GREEN : "#007A5A"; roundRect(c, -85, -26, 170, 52, 8); c.fill();
        c.fillStyle = "#FFFFFF"; c.font = `22px ${F_B}`; c.textAlign = "center"; c.fillText(done ? "✓ Gesendet" : "Senden", 0, 2);
        c.restore();
        c.strokeStyle = "#D6D2CC"; c.lineWidth = 2; roundRect(c, x + 186, by, 150, 52, 8); c.stroke();
        c.fillStyle = INK; c.font = `22px ${F_B}`; c.textAlign = "center"; c.fillText("Ansehen", x + 261, by + 28); c.textAlign = "left";
        const hs = CLICK - 0.5;
        if (t > hs && t < T.raus + 0.5) { const kk = ease((t - hs) / 0.4); cursorHand(c, x + 110 + (1 - kk) * 150, by + 34 + (1 - kk) * 120, t >= CLICK && t < CLICK + 0.14, 6); }
        return by + 60;
      });
      c.restore();
    }
  } else {
    c.fillStyle = MUTED; c.font = `22px ${F_M}`; c.fillText("Das ist der Anfang von #vertrieb.", SB + 26, 120);
  }
  // composer
  const focus = t > T.ich - 0.2 && !sent;
  c.strokeStyle = focus ? "#1264A3" : "#D6D2CC"; c.lineWidth = focus ? 3 : 2; roundRect(c, SB + 20, 500, CW - SB - 40, 118, 12); c.stroke();
  const tn = Math.max(0, Math.min(USER_MSG.length + 10, Math.floor((t - T.ich + 0.05) * 30)));
  c.font = `24px ${F_M}`;
  if (sent || tn === 0) { c.fillStyle = "#A39C90"; c.fillText("Nachricht an #vertrieb", SB + 40, 540); }
  else {
    const mw = mention(SB + 42, 540);
    const txt = USER_MSG.slice(0, Math.max(0, tn - 10));
    c.font = `24px ${F_M}`;
    const lines = wrap(c, txt.trim(), 640 - mw);
    c.fillStyle = INK; c.fillText(lines[0] ?? "", SB + 42 + mw + 2, 540);
    const rest = wrap(c, txt.trim().slice((lines[0] ?? "").length).trim(), 640);
    rest.forEach((l, i) => c.fillText(l, SB + 42, 540 + 34 * (i + 1)));
    if (Math.floor(t * 3) % 2) { const last = rest.length ? rest[rest.length - 1] : lines[0] ?? ""; const lx = rest.length ? SB + 42 : SB + 44 + mw; c.fillStyle = INK; c.fillRect(lx + c.measureText(last).width + 2, 540 + 34 * rest.length - 14, 3, 28); }
  }
  const sp = 1 + 0.25 * bump(t, SEND, 0.2);
  c.save(); c.translate(CW - 60, 590); c.scale(sp, sp);
  c.fillStyle = sent || tn > 0 ? "#007A5A" : "#E0DCD6"; roundRect(c, -24, -18, 48, 36, 6); c.fill();
  c.fillStyle = "#FFFFFF"; c.beginPath(); c.moveTo(-9, -9); c.lineTo(11, 0); c.lineTo(-9, 9); c.lineTo(-5, 0); c.closePath(); c.fill();
  c.restore();
  const hs = SEND - 0.55;
  if (t > hs && t < SEND + 0.35) cursorHand(c, CW - 60 + (1 - ease((t - hs) / 0.4)) * 110, 596 + (1 - ease((t - hs) / 0.4)) * 30, t >= SEND && t < SEND + 0.12, 6);
};

// ---------- canvas: the big screen (lead list → LinkedIn draft) ----------
const SW = 1200, SH = 750;
const LEADS = [
  { firma: "Hausverwaltung Meyer", sig: "Sanierung", ent: "S. Meyer · Inhaberin", fit: 94 },
  { firma: "WEG Sonnenhof", sig: "Ausschreibung", ent: "K. Roth · Verwalterin", fit: 91 },
  { firma: "Immobilien Haas", sig: "Sucht Handwerker", ent: "J. Haas · Technik", fit: 88 },
  { firma: "Wohnbau Kessler", sig: "Sanierung", ent: "T. Kessler · GF", fit: 85 },
  { firma: "HV Brück & Partner", sig: "Heizungstausch", ent: "A. Brück · GF", fit: 82 },
  { firma: "Verwaltung Am Wall", sig: "Sanierung", ent: "L. Wall · Objekte", fit: 79 },
];
const COLS = [{ x: 40, n: "FIRMA" }, { x: 420, n: "SIGNAL" }, { x: 680, n: "ENTSCHEIDER" }, { x: 1040, n: "FIT" }];
const ROW_Y = 172, ROW_H = 84;
const rowAt = (i: number) => T.zwanzig2 + 0.05 + i * 0.1;
const leadCount = (t: number) => (t < T.zwanzig2 + 0.7 ? LEADS.filter((_, i) => t >= rowAt(i)).length : Math.round(6 + 14 * ease((t - T.zwanzig2 - 0.7) / 0.6)));
const LI_MSG = "Hallo Frau Meyer, ich habe gesehen, dass bei Ihren drei Objekten der Heizungstausch ansteht. Wir bauen Wärmepumpen in 3 Tagen, zum Festpreis. Wäre ein kurzer Austausch nächste Woche interessant?";
const LI_HL = ["der", "Heizungstausch", "ansteht."];
const drawList = (c: CanvasRenderingContext2D, t: number, logo: HTMLImageElement | null) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, SW, SH);
  const g = c.createLinearGradient(0, 0, SW, 0); g.addColorStop(0, "#FFF3EC"); g.addColorStop(1, "#FFFFFF");
  c.fillStyle = g; c.fillRect(0, 0, SW, 90);
  c.fillStyle = "#FFE1D3"; c.fillRect(0, 88, SW, 2);
  if (logo) c.drawImage(logo, 36, 26, 38, 38);
  c.textBaseline = "middle"; c.textAlign = "left";
  c.fillStyle = INK; c.font = `34px ${F_B}`; c.fillText("Leads", 90, 46);
  c.fillStyle = MUTED; c.font = `28px ${F_M}`; c.fillText("· gefunden von Agent 2", 194, 47);
  const n = leadCount(t);
  const pop = 1 + 0.15 * bump(t, T.zwanzig2 + 1.3, 0.3);
  c.save(); c.translate(1040, 46); c.scale(pop, pop);
  c.fillStyle = OR; roundRect(c, -120, -30, 240, 60, 30); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `32px ${F_B}`; c.textAlign = "center"; c.fillText(`${n} passen`, 0, 2);
  c.restore(); c.textAlign = "left";
  const hl = [0, 0, bump(t, T.entscheidet + 0.2, 0.6), bump(t, T.zwanzig2 + 0.6, 0.6)];
  COLS.forEach((col, j) => {
    const w = (COLS[j + 1]?.x ?? SW - 10) - col.x - 10;
    if (hl[j] > 0) { c.fillStyle = `rgba(255,107,53,${0.12 * hl[j]})`; roundRect(c, col.x - 14, 104, w + 14, 520, 16); c.fill(); }
    c.fillStyle = hl[j] > 0.3 ? OR : MUTED; c.font = `22px ${F_B}`; c.fillText(col.n, col.x, 132);
  });
  c.fillStyle = LINE; c.fillRect(30, 150, SW - 60, 2);
  LEADS.forEach((L, i) => {
    const k = ease((t - rowAt(i)) / 0.3);
    if (k <= 0) return;
    const y = ROW_Y + i * ROW_H + (1 - k) * 30;
    c.save(); c.globalAlpha = k;
    c.fillStyle = INK; c.font = `${fit(c, L.firma, F_B, 30, 360)}px ${F_B}`; c.fillText(L.firma, COLS[0].x, y + 30);
    c.font = `22px ${F_B}`; const sw = c.measureText(L.sig).width + 36;
    c.fillStyle = OR_L; roundRect(c, COLS[1].x, y + 10, sw, 42, 21); c.fill();
    c.fillStyle = OR_D; c.fillText(L.sig, COLS[1].x + 18, y + 32);
    const cell = (j: number, from: number, draw: () => void, w: number) => {
      const kk = ease((t - from - i * 0.07) / 0.25);
      if (kk <= 0) { c.fillStyle = "#F1EDE7"; roundRect(c, COLS[j].x, y + 16, w, 28, 14); c.fill(); return; }
      c.save(); c.globalAlpha = k * kk; draw(); c.restore();
    };
    cell(2, T.entscheidet, () => { c.fillStyle = INK; c.font = `${fit(c, L.ent, F_M, 27, 330)}px ${F_M}`; c.fillText(L.ent, COLS[2].x, y + 31); }, 260);
    cell(3, T.zwanzig2 + 0.5, () => {
      c.fillStyle = GREEN; roundRect(c, COLS[3].x, y + 10, 90, 42, 21); c.fill();
      c.fillStyle = "#FFFFFF"; c.font = `24px ${F_B}`; c.textAlign = "center"; c.fillText(String(L.fit), COLS[3].x + 45, y + 32); c.textAlign = "left";
    }, 90);
    c.restore();
    c.fillStyle = LINE; c.fillRect(30, ROW_Y + i * ROW_H + ROW_H - 2, SW - 60, 2);
  });
  if (n > 6) { c.fillStyle = MUTED; c.font = `26px ${F_S}`; c.textAlign = "center"; c.fillText(`+ ${n - 6} weitere`, SW / 2, 700); c.textAlign = "left"; }
};
const drawLinkedIn = (c: CanvasRenderingContext2D, t: number) => {
  c.fillStyle = "#F4F2EE"; c.fillRect(0, 0, SW, SH);
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, SW, 90);
  c.fillStyle = "#E0DDD8"; c.fillRect(0, 88, SW, 2);
  c.textBaseline = "middle"; c.textAlign = "left";
  c.fillStyle = LI; c.font = `36px ${F_B}`; c.fillText("LinkedIn", 40, 46);
  c.fillStyle = MUTED; c.font = `28px ${F_M}`; c.fillText("· Nachricht", 200, 47);
  const drafts = Math.max(1, Math.min(20, Math.round(1 + 19 * ease((t - T.nachricht) / 0.9))));
  c.fillStyle = OR_L; roundRect(c, 870, 18, 300, 56, 28); c.fill();
  c.fillStyle = OR_D; c.font = `26px ${F_B}`; c.textAlign = "center"; c.fillText(`Entwurf ${drafts} / 20`, 1020, 47); c.textAlign = "left";
  // card
  c.fillStyle = "#FFFFFF"; roundRect(c, 40, 120, SW - 80, 590, 20); c.fill();
  c.fillStyle = "#C9D9EA"; c.beginPath(); c.arc(110, 190, 42, 0, 7); c.fill();
  c.fillStyle = LI; c.font = `30px ${F_B}`; c.textAlign = "center"; c.fillText("SM", 110, 192); c.textAlign = "left";
  c.fillStyle = INK; c.font = `34px ${F_B}`; c.fillText("Sabine Meyer", 172, 174);
  c.fillStyle = MUTED; c.font = `26px ${F_M}`; c.fillText("Inhaberin · Hausverwaltung Meyer", 172, 212);
  // signal chip
  const sk = ease((t - T.signal + 0.1) / 0.3);
  c.font = `24px ${F_B}`;
  const chip = "SIGNAL: 3 Objekte, Heizungstausch geplant";
  const cwid = c.measureText(chip).width + 40;
  c.fillStyle = sk > 0 ? `rgba(245,197,66,${0.35 + 0.65 * sk})` : "#F1EDE7"; roundRect(c, 80, 256, cwid, 46, 23); c.fill();
  c.fillStyle = sk > 0.5 ? INK : MUTED; c.fillText(chip, 100, 280);
  // typed message, word by word so the signal words can be highlighted
  const n = Math.max(0, Math.floor((t - T.dann - 0.15) * 95));
  c.font = `32px ${F_M}`;
  const ws = LI_MSG.split(" ");
  let x = 80, y = 360, used = 0;
  const hlK = ease((t - T.signal) / 0.3);
  ws.forEach((w, i) => {
    if (used >= n) return;
    const shown = w.slice(0, Math.max(0, n - used));
    used += w.length + 1;
    const ww = c.measureText(w + " ").width;
    if (x + ww > SW - 100) { x = 80; y += 50; }
    const isHl = LI_HL.includes(w) && i >= 10 && i <= 13;
    if (isHl && hlK > 0) { c.fillStyle = `rgba(245,197,66,${0.55 * hlK})`; roundRect(c, x - 4, y - 24, c.measureText(shown).width + 8, 46, 8); c.fill(); }
    c.fillStyle = INK; c.fillText(shown, x, y);
    x += ww;
  });
  if (n < LI_MSG.length && Math.floor(t * 3) % 2) { c.fillStyle = LI; c.fillRect(x, y - 18, 3, 36); }
  c.fillStyle = MUTED; c.font = `24px ${F_S}`; c.fillText("Entwurf von Agent 2 · wartet auf deine Freigabe", 80, 670);
};
const drawScreen = (c: CanvasRenderingContext2D, t: number, logo: HTMLImageElement | null) => {
  if (t < T.dann - 0.1) drawList(c, t, logo);
  else drawLinkedIn(c, t);
};

// ---------- canvas: the insight "1 Hausverwaltung = 100 Häuser" ----------
const houseIcon = (c: CanvasRenderingContext2D, x: number, y: number, s: number, roof: string) => {
  c.fillStyle = "#FFFFFF"; c.strokeStyle = "#D9D1C6"; c.lineWidth = Math.max(1, s * 0.06);
  c.fillRect(x - s * 0.4, y - s * 0.35, s * 0.8, s * 0.6); c.strokeRect(x - s * 0.4, y - s * 0.35, s * 0.8, s * 0.6);
  c.fillStyle = roof; c.beginPath(); c.moveTo(x - s * 0.52, y - s * 0.33); c.lineTo(x, y - s * 0.78); c.lineTo(x + s * 0.52, y - s * 0.33); c.closePath(); c.fill();
  c.fillStyle = "#8A5A35"; c.fillRect(x - s * 0.09, y - s * 0.02, s * 0.18, s * 0.27);
};
const drawInsight = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 560;
  c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, w - 16, h - 16, 40); c.fill();
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, w - 8, h - 14, 40); c.fill();
  c.strokeStyle = OR; c.lineWidth = 6; roundRect(c, 3, 3, w - 14, h - 20, 37); c.stroke();
  c.textBaseline = "middle"; c.textAlign = "center";
  c.fillStyle = OR; c.font = `34px ${F_B}`; c.fillText("WARUM HAUSVERWALTUNGEN?", (w - 8) / 2, 58);
  const many = t >= T.dieHaben2 - 0.05;
  if (!many) {
    const k = back((t - T.warum - 0.6) / 0.4);
    houseIcon(c, 446, 300, 200 * k, OR);
    if (t > T.haus - 0.05) {
      const s = ease((t - T.haus + 0.05) / 0.25);
      c.strokeStyle = "#D64545"; c.lineWidth = 12; c.beginPath(); c.moveTo(330, 410); c.lineTo(330 + 232 * s, 410 - 232 * s); c.stroke();
    }
    c.fillStyle = INK; c.font = `44px ${F_B}`; c.fillText("1 Haus", 446, 470);
  } else {
    const cols = 10, rows = 10, sx = 210, sy = 112, gs = 30;
    const shown = Math.round(100 * ease((t - T.dieHaben2) / 0.75));
    for (let i = 0; i < shown; i++) houseIcon(c, sx + (i % cols) * gs * 1.6 - 12, sy + 40 + Math.floor(i / cols) * gs, gs, i % 7 === 0 ? OR_D : OR);
    c.fillStyle = INK; c.font = `46px ${F_B}`; c.fillText(`${shown} Häuser`, 446, 460);
    c.fillStyle = OR_D; c.font = `32px ${F_S}`; c.fillText("1 Ansprechpartner", 446, 506);
  }
  c.textAlign = "left";
};

// ---------- canvas: yesterday's website (done, live) ----------
const drawDoneSite = (c: CanvasRenderingContext2D) => {
  c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, SW, SH);
  c.fillStyle = INK; c.font = `34px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Wärmepumpe Umland", 50, 56);
  c.fillStyle = MUTED; c.font = `26px ${F_M}`; ["Angebot", "Preise", "Kontakt"].forEach((s, i) => c.fillText(s, 700 + i * 160, 56));
  c.fillStyle = "#F1EDE7"; c.fillRect(0, 110, SW, 2);
  c.fillStyle = INK; c.font = `84px ${F_B}`; c.fillText("Wärmepumpe in 3 Tagen.", 50, 250); c.fillText("Zum Festpreis.", 50, 350);
  c.fillStyle = OR; roundRect(c, 50, 420, 380, 92, 46); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `34px ${F_B}`; c.fillText("Angebot anfragen", 92, 468);
  [0, 1, 2].forEach((i) => { c.fillStyle = "#F7F3EE"; roundRect(c, 50 + i * 376, 570, 350, 140, 22); c.fill(); c.fillStyle = OR; c.beginPath(); c.arc(100 + i * 376, 640, 22, 0, 7); c.fill(); c.fillStyle = "#D9D1C6"; c.fillRect(140 + i * 376, 620, 200, 16); c.fillRect(140 + i * 376, 650, 150, 16); });
  c.fillStyle = GREEN; roundRect(c, 930, 400, 220, 70, 35); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `32px ${F_B}`; c.fillText("● LIVE", 975, 436);
};


const signalTex = (tag: string, name: string, detail: string) =>
  canvasTex(1000, 290, (c) => {
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 984, 274, 36); c.fill();
    c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 990, 278, 36); c.fill();
    c.strokeStyle = OR; c.lineWidth = 6; roundRect(c, 3, 3, 984, 272, 34); c.stroke();
    c.textBaseline = "middle"; c.textAlign = "left";
    c.font = `32px ${F_B}`; const tw = c.measureText(tag).width + 48;
    c.fillStyle = OR; roundRect(c, 40, 34, tw, 58, 29); c.fill();
    c.fillStyle = "#FFFFFF"; c.fillText(tag, 64, 64);
    c.fillStyle = INK; c.font = `${fit(c, name, F_B, 56, 910)}px ${F_B}`; c.fillText(name, 40, 150);
    c.fillStyle = "#4A443C"; c.font = `${fit(c, detail, F_M, 38, 910)}px ${F_M}`; c.fillText(detail, 40, 222);
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
const deptTex = (name: string, st: Dept["st"]) =>
  canvasTex(900, 250, (c) => {
    const bg = st === "done" ? GREEN : st === "today" ? OR : "#FFFFFF";
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 6, 12, 888, 236, 44); c.fill();
    c.fillStyle = bg; roundRect(c, 0, 0, 888, 236, 44); c.fill();
    if (st === "locked") { c.strokeStyle = "#E2DCD3"; c.lineWidth = 6; roundRect(c, 3, 3, 882, 230, 41); c.stroke(); }
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = st === "locked" ? INK : "#FFFFFF";
    fit(c, name, F_B, 84, 800); c.fillText(name, 444, 92);
    c.font = `46px ${F_B}`;
    c.fillStyle = st === "locked" ? "#A39C90" : "rgba(255,255,255,.9)";
    c.fillText(st === "done" ? "✓ KI seit Tag 1" : st === "today" ? "▶ heute: Tag 2" : "🔒 noch Mensch", 444, 178);
  });
const PROBLEMS = ["Alte Heizung, Tausch wird Pflicht", "Förderung? Keiner blickt durch", "Handwerker erst in 6 Monaten"];
const drawProblems = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 560;
  c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, w - 16, h - 16, 40); c.fill();
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, w - 8, h - 14, 40); c.fill();
  c.strokeStyle = GREEN; c.lineWidth = 6; roundRect(c, 3, 3, w - 14, h - 20, 37); c.stroke();
  c.textBaseline = "middle"; c.textAlign = "left";
  c.fillStyle = GREEN; c.font = `34px ${F_B}`; c.fillText("WAS MEINE KUNDEN WIRKLICH PLAGT", 44, 62);
  PROBLEMS.forEach((pr, i) => {
    const k = ease((t - T.probleme - 0.1 - i * 0.28) / 0.3);
    if (k <= 0) return;
    const y = 120 + i * 134 + (1 - k) * 24;
    c.save(); c.globalAlpha = k;
    c.fillStyle = "#EAF6EF"; roundRect(c, 40, y, 812, 112, 26); c.fill();
    c.fillStyle = GREEN; c.beginPath(); c.arc(100, y + 56, 34, 0, 7); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `38px ${F_B}`; c.textAlign = "center"; c.fillText(String(i + 1), 100, y + 59);
    c.textAlign = "left"; c.fillStyle = INK; c.font = `${fit(c, pr, F_B, 40, 680)}px ${F_B}`; c.fillText(pr, 156, y + 58);
    c.restore();
  });
};
const tagTex = (top: string, bottom: string, bg: string) =>
  canvasTex(560, 190, (c) => {
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 6, 12, 548, 176, 36); c.fill();
    c.fillStyle = bg; roundRect(c, 0, 0, 548, 176, 36); c.fill();
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = "#FFFFFF"; fit(c, top, F_B, 70, 490); c.fillText(top, 274, 64);
    c.fillStyle = "rgba(255,255,255,.85)"; fit(c, bottom, F_B, 44, 490); c.fillText(bottom, 274, 134);
  });

// ---------- 3D pieces ----------
type Tex = Record<string, THREE.Texture>;
const Island: React.FC<{ p: V3; r: number; t: number; active?: boolean; locked?: boolean; done?: boolean; vis?: number }> = ({ p, r, t, active, locked, done, vis = 1 }) => {
  if (vis <= 0.001) return null;
  return (
    <group position={p} scale={[vis, vis, vis]}>
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[r, r + 0.12, 0.4, 48]} />
        <meshStandardMaterial color={locked ? "#E3DDD4" : done ? GREEN : OR} roughness={0.7} />
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
type BotPose = { body?: string; dark?: string; walk?: number; armL?: number; armR?: number; lift?: number; prop?: "magnifier" | "block" | "crown" | "none"; talk?: boolean; vis?: number; s?: number; badge?: THREE.Texture };
const SkBot: React.FC<{ p: V3; yaw?: number; t: number; seed?: number } & BotPose> = ({ p, yaw = 0, t, seed = 0, body = OR, dark = OR_D, walk = 0, armL = 15, armR = 15, lift = 0, prop = "none", talk, vis = 1, s = 1, badge }) => {
  if (vis <= 0.001) return null;
  const ph = t * 11 + seed;
  const bob = Math.abs(Math.sin(t * 4.4 + seed)) * 0.1 * (1 - walk) + Math.abs(Math.sin(ph)) * 0.16 * walk;
  const swing = Math.sin(ph) * walk;
  const blink = (t * 1.2 + seed * 0.37) % 3.1 < 0.09;
  const sc = s * vis;
  const arm = (side: -1 | 1, deg: number, node?: React.ReactNode) => (
    <group position={[side * 0.72, 0.95, 0.05]} rotation={[side * swing * 0.8, 0, (side * deg * Math.PI) / 180]}>
      <mesh castShadow position={[0, -0.22, 0]}>
        <boxGeometry args={[0.24, 0.5, 0.26]} />
        <meshStandardMaterial color={dark} roughness={0.6} />
      </mesh>
      {node && <group position={[0, -0.52, 0.05]}>{node}</group>}
    </group>
  );
  return (
    <group position={[p[0], p[1] + lift + bob, p[2]]} rotation={[0, yaw, 0]} scale={[sc, sc, sc]}>
      {[-0.28, 0.28].map((x, li) => (
        <group key={x} position={[x, 0.32, 0]} rotation={[(li ? -1 : 1) * swing * 0.75, 0, 0]}>
          <mesh castShadow position={[0, -0.16, 0]}>
            <boxGeometry args={[0.26, 0.32, 0.3]} />
            <meshStandardMaterial color="#2C2420" />
          </mesh>
        </group>
      ))}
      <group rotation={[0.13 * walk, 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.98, 0]}>
        <boxGeometry args={[1.28, 1.3, 1.08]} />
        <meshStandardMaterial color={body} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.3, 0.14, 1.1]} />
        <meshStandardMaterial color={dark} roughness={0.6} />
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
    </group>
  );
};

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
  const glow = bump(t, T.meineFirma, 0.5);
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

// a department house: green roof + flag = taken over by KI, orange = today, grey + padlock = still human
const deptState = (d: Dept, t: number): Dept["st"] => (t > T.komplett - 0.2 && t < T.und0 + 0.1 ? "today" : d.st === "today" && t < T.heute ? "locked" : d.st);
const DeptHouse: React.FC<{ d: Dept; i: number; t: number; plate: THREE.Texture }> = ({ d, i, t, plate }) => {
  // hook: "what if KI takes over everything" = every roof flips orange, one after the other
  const hook = t > T.komplett - 0.2 + i * 0.09 && t < T.und0 + 0.1;
  const st = hook ? "today" : deptState(d, t);
  const roof = st === "done" ? GREEN : st === "today" ? OR : "#CFC6BA";
  const pop = 1 + 0.18 * bump(t, T.komplett - 0.2 + i * 0.09, 0.2) + (d.st === "today" ? 0.22 * bump(t, T.vertrieb + 0.1, 0.3) : 0) + 0.08 * bump(t, T.stadt + i * 0.12, 0.25);
  const lit = st !== "locked";
  const lockK = st === "locked" ? ease((t - T.abteilung) / 0.4) * (t > T.positionierung - 0.4 && t < T.und ? 0.8 : 1) : 0;
  const wig = Math.sin(t * 22 + i) * 0.25 * (bump(t, T.naechste + i * 0.06, 0.5) + bump(t, T.abteilung + 0.2 + i * 0.06, 0.4));
  return (
    <group position={d.p} rotation={[0, d.yaw, 0]}>
      <ToyBox p={[0, 0.06, 0]} s={[3.8, 0.12, 3.6]} color={st === "done" ? "#DDF3E6" : st === "today" ? OR_L : "#E7E1D8"} />
      <group scale={[pop, pop, pop]}>
        <ToyBox p={[0, 1.0, 0]} s={[2.4, 1.7, 2.0]} color="#FFFFFF" top="#FFFFFF" />
        <mesh position={[0, 2.4, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.95, 1.15, 4]} />
          <meshStandardMaterial color={roof} roughness={0.6} flatShading />
        </mesh>
        <ToyBox p={[0, 0.5, 1.01]} s={[0.5, 0.85, 0.05]} color="#8A5A35" />
        {[-0.78, 0.78].map((x) => <ToyBox key={x} p={[x, 1.05, 1.01]} s={[0.46, 0.42, 0.05]} color={lit ? "#BFE3F2" : "#DAD4CB"} emissive={lit ? "#FFE6B0" : undefined} ei={lit ? 0.35 + 0.25 * Math.max(0, Math.sin(t * 3 + i)) : 0} />)}
        <group position={[0, 1.6, 1.04]}>
          <ToyBox p={[0, 0, -0.02]} s={[2.2, 0.44, 0.04]} color={INK} />
          <mesh position={[0, 0, 0.005]}><planeGeometry args={[2.14, 0.38]} /><meshBasicMaterial map={plate} toneMapped={false} /></mesh>
        </group>
        {st === "done" && (
          <group position={[0.55, 2.9, 0]}>
            <ToyBox p={[0, 0.5, 0]} s={[0.07, 1.0, 0.07]} color="#2C2420" />
            <group rotation={[0, Math.sin(t * 5 + i) * 0.25, 0]}><ToyBox p={[0.33, 0.82, 0]} s={[0.6, 0.36, 0.04]} color={GREEN} /></group>
          </group>
        )}
        {lockK > 0.01 && (
          <group position={[0, 3.45 + Math.sin(t * 2 + i) * 0.06, 0]} rotation={[0, 0, wig]} scale={[lockK * 1.3, lockK * 1.3, lockK * 1.3]}>
            <ToyBox p={[0, 0, 0]} s={[0.9, 0.72, 0.36]} color="#B9B1A6" />
            <mesh position={[0, 0.45, 0]}><torusGeometry args={[0.28, 0.08, 8, 20, Math.PI]} /><meshStandardMaterial color="#8A857D" /></mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// 40 houses around island 2 = the market. 20 get picked, 20 get a LinkedIn message (planes).
const HOUSE_N = 40;
const CHAT_DESK: V3 = [9.6, 0, -12.2];
const HOUSES = (() => {
  const out: { x: number; z: number; yaw: number; s: number; pick: number }[] = [];
  for (let i = 0; out.length < HOUSE_N && i < 4000; i++) {
    const a = i * 2.39996, r = 3.95 + Math.sqrt(i) * 0.42;
    const x = I2[0] + Math.cos(a) * r, z = I2[2] + Math.sin(a) * r;
    if (Math.hypot(x - D0[0], z - D0[2]) < 6.7) continue;
    if (Math.hypot(x - CHAT_DESK[0], z - CHAT_DESK[2]) < 2.4) continue;
    if (z < -17.6 && z > -20.4 && Math.abs(x - SCREEN[0]) < 3.2) continue;
    if (DEPTS.some((d) => Math.hypot(x - d.p[0], z - d.p[2]) < 3.4)) continue;
    if (z > -8.2) continue;
    out.push({ x, z, yaw: (rnd(i + 5) - 0.5) * 0.8, s: 0.9 + rnd(i + 9) * 0.25, pick: rnd(i * 7 + 1) });
  }
  return out;
})();
const SIG_HOUSE = ([[3.6, -11.6], [5.4, -11.3], [7.2, -11.6]] as [number, number][]).map(([x, z]) =>
  HOUSES.reduce((b, h, j) => (Math.hypot(h.x - x, h.z - z) < Math.hypot(HOUSES[b].x - x, HOUSES[b].z - z) ? j : b), 0));
const TOP20 = [...SIG_HOUSE, ...HOUSES.map((h, j) => ({ j, p: h.pick })).filter((x) => !SIG_HOUSE.includes(x.j)).sort((a, b) => b.p - a.p).slice(0, 17).map((x) => x.j)];
// the house that starts typing at the cliffhanger: front-most picked one
const TYPER = TOP20.reduce((b, j) => (HOUSES[j].z > HOUSES[b].z ? j : b), TOP20[0]);
const PLANE_DUR = 0.8;
const sendArrive = (k: number) => LAUNCH2 + k * 0.035 + PLANE_DUR;
const Houses: React.FC<{ t: number }> = ({ t }) => {
  const { body, roof, door } = React.useMemo(() => {
    const mk = (geo: THREE.BufferGeometry, mat: THREE.Material, colors?: boolean) => {
      const m = new THREE.InstancedMesh(geo, mat, HOUSE_N);
      m.castShadow = true; m.frustumCulled = false;
      if (colors) HOUSES.forEach((_, i) => m.setColorAt(i, new THREE.Color(OR)));
      return m;
    };
    const roofGeo = new THREE.ConeGeometry(0.62, 0.48, 4); roofGeo.rotateY(Math.PI / 4);
    return {
      body: mk(new THREE.BoxGeometry(0.78, 0.56, 0.7), new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.7 })),
      roof: mk(roofGeo, new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.6, flatShading: true }), true),
      door: mk(new THREE.BoxGeometry(0.18, 0.28, 0.02), new THREE.MeshStandardMaterial({ color: "#8A5A35" })),
    };
  }, []);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), off = new THREE.Matrix4(), col = new THREE.Color();
  HOUSES.forEach((h, i) => {
    const ti = TOP20.indexOf(i);
    const sigI = SIG_HOUSE.indexOf(i);
    const sigT = sigI >= 0 ? [T.saniert, T.schreibt, T.handwerker][sigI] : -9;
    const arrive = ti < 0 ? 99 : sendArrive(ti);
    const picked = ti >= 0 && t >= T.zwanzig2 + 0.1 + ti * 0.03;
    const pulse = 1 + 0.35 * bump(t, sigT, 0.35) + 0.3 * bump(t, arrive, 0.2) + (picked ? 0.2 * bump(t, T.zwanzig2 + 0.1 + ti * 0.03, 0.2) : 0);
    const s = h.s * pulse;
    e.set(0, h.yaw, 0); q.setFromEuler(e);
    m.compose(new THREE.Vector3(h.x, 0, h.z), q, new THREE.Vector3(s, s, s));
    body.setMatrixAt(i, m.clone().multiply(off.makeTranslation(0, 0.28, 0)));
    roof.setMatrixAt(i, m.clone().multiply(off.makeTranslation(0, 0.8, 0)));
    door.setMatrixAt(i, m.clone().multiply(off.makeTranslation(0, 0.14, 0.36)));
    const sent = t >= arrive && t >= LAUNCH2;
    const sig = sigI >= 0 && t >= sigT && t < T.zwanzig2;
    roof.setColorAt(i, col.set(sent ? LI : sig ? "#F5C542" : picked ? OR : "#CFC6BA"));
  });
  [body, roof, door].forEach((x) => { x.instanceMatrix.needsUpdate = true; });
  if (roof.instanceColor) roof.instanceColor.needsUpdate = true;
  return <><primitive object={body} /><primitive object={roof} /><primitive object={door} /></>;
};
// envelopes flying to the 20 picked houses
const Planes: React.FC<{ t: number; from: V3; start: number; gap: number }> = ({ t, from, start, gap }) => (
  <>
    {TOP20.map((hi, k) => {
      const kk = (t - start - k * gap) / PLANE_DUR;
      if (kk < 0 || kk > 1) return null;
      const h = HOUSES[hi];
      const to: V3 = [h.x, 1.3, h.z];
      const mid: V3 = [(from[0] + to[0]) / 2, Math.max(from[1], to[1]) + 3.2, (from[2] + to[2]) / 2];
      const p = bez3(from, mid, to, inOut(kk));
      const s = 1 - 0.5 * kk;
      return (
        <group key={k} position={p} rotation={[0.3, Math.atan2(to[0] - from[0], to[2] - from[2]), Math.sin(kk * 9) * 0.3]} scale={s}>
          <ToyBox p={[0, 0, 0]} s={[0.5, 0.06, 0.36]} color="#FFFFFF" />
          <ToyBox p={[0, 0.04, 0]} s={[0.5, 0.02, 0.08]} color={LI} />
        </group>
      );
    })}
  </>
);

// ---------- the world ----------
const SIG_POS: V3[] = [[5.4, 6.05, -14.0], [5.4, 4.95, -14.0], [5.4, 3.85, -14.0]];
const fwd = (yaw: number, d: number): [number, number] => [Math.sin(yaw) * d, Math.cos(yaw) * d];
const VD = fwd(DEPTS[1].yaw, 1.9);
const VERT_FRONT: V3 = [VERT[0] + VD[0], 0, VERT[2] + VD[1]];
type K = { a: number; b: number; p: V3; yaw: number; walk?: boolean };
const AGENT_KEYS: K[] = [
  { a: 0, b: T.gestern - 0.1, p: [-1.0, 0.4, 1.4], yaw: 0.25 },
  { a: T.heute + 0.15, b: T.heute + 0.2, p: [8.3, 0, -2.9], yaw: 2.5 },
  { a: T.vertrieb - 0.1, b: T.ich - 0.1, p: VERT_FRONT, yaw: DEPTS[1].yaw + Math.PI, walk: true },
  { a: T.ich + 0.3, b: T.warum + 0.1, p: [11.1, 0.4, -12.9], yaw: -0.7 },
  { a: T.warum + 0.6, b: T.erSucht, p: [3.4, 0.4, -15.6], yaw: 0.2 },
  { a: T.erSucht + 0.2, b: T.zwanzig2 - 0.1, p: [3.0, 0.4, -15.2], yaw: 0.3 },
  { a: T.zwanzig2 + 0.15, b: T.bevor, p: [8.3, 0.4, -16.4], yaw: -0.6 },
  { a: T.bevor + 0.4, b: T.raus + 0.2, p: [11.1, 0.4, -12.9], yaw: -0.7 },
  { a: T.und + 0.4, b: 99, p: [5.4, 0.4, -15.0], yaw: 0 },
];
// resident bot (the viewer): pops out of the comment in the hook, and again on the free plots at the end
const RES_KEYS: K[] = [
  { a: 0, b: T.zieht0 + 0.5, p: [2.3, 0.4, 1.9], yaw: 0.2 },
  { a: T.tag + 0.6, b: T.gestern, p: [-1.4, 0.4, -2.6], yaw: Math.PI, walk: true },
  { a: T.gestern + 0.5, b: T.und2 + 0.2, p: [3.9, 0, -3.4], yaw: 1.4 },
  { a: T.bot2 + 0.25, b: 99, p: [RES[2][0], 0.1, RES[2][2]], yaw: 0, walk: true },
];
// base path between stations: short run with a small hop, or a plain walk where the key says so
const basePath = (keys: K[], tt: number): { p: V3; yaw: number; tr: boolean } => {
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (tt <= k.b) {
      if (tt >= k.a || i === 0) return { p: k.p, yaw: k.yaw, tr: false };
      const pr = keys[i - 1]; const kk = (k.walk ? (x: number) => x : inOut)(cl((tt - pr.b) / (k.a - pr.b))); const pp = lerp3(pr.p, k.p, kk);
      return { p: [pp[0], pp[1] + (k.walk ? 0 : Math.sin(kk * Math.PI) * 0.7), pp[2]], yaw: pr.yaw + (k.yaw - pr.yaw) * kk, tr: !k.walk };
    }
  }
  return { p: keys[keys.length - 1].p, yaw: 0, tr: false };
};
const seg = (tt: number, a: number, b: number, f: (u: number) => V3): V3 => {
  if (tt <= a || tt >= b) return [0, 0, 0];
  const env = ease((tt - a) / 0.45) * ease((b - tt) / 0.45);
  const o = f(tt - a); return [o[0] * env, o[1] * env, o[2] * env];
};
const agentWander = (tt: number): V3 => {
  const parts: V3[] = [
    seg(tt, 0, T.und0 - 0.1, (u) => [Math.sin(u * 1.6) * 1.2, 0, Math.sin(u * 3.2) * 0.3]),          // hook: struts across the plaza
    seg(tt, T.tag, T.gestern - 0.1, (u) => [0, 0, Math.sin(u * 1.2) * 0.8]),                         // overview
    seg(tt, T.warum + 0.6, T.erSucht, (u) => [Math.sin(u * 1.8) * 0.9, 0, 0]),                       // insight: paces
    seg(tt, T.erSucht + 0.2, T.zwanzig2 - 0.1, (u) => [Math.sin(u * 1.0) * 1.8, 0, Math.sin(u * 2) * 0.6]), // signals: searches
    seg(tt, T.zwanzig2 + 0.15, T.bevor, (u) => [Math.sin(u * 1.4) * 1.0, 0, 0]),                     // list
    seg(tt, T.und + 0.4, 99, (u) => [Math.sin(u * 1.1) * 1.4, 0, Math.sin(u * 0.55) * 0.7]),         // cliffhanger + end
  ];
  return parts.reduce((acc, o) => [acc[0] + o[0], acc[1] + o[1], acc[2] + o[2]], [0, 0, 0] as V3);
};
const resWander = (tt: number): V3 => seg(tt, T.zieht0 + 0.5, T.tag + 0.6, (u) => [-Math.sin(u * 1.3) * 1.0, 0, -u * 0.35]);
// position, facing and walk amount of a bot on a path (+ wander)
const botMotion = (keys: K[], wander: (tt: number) => V3, t: number) => {
  const pos = (tt: number): V3 => { const b0 = basePath(keys, tt).p, w = wander(tt); return [b0[0] + w[0], b0[1], b0[2] + w[2]]; };
  const b = basePath(keys, t);
  const p = pos(t), pA = pos(t - 0.05), pB = pos(t + 0.05);
  const vx = (pB[0] - pA[0]) / 0.1, vz = (pB[2] - pA[2]) / 0.1;
  const walk = b.tr ? 0 : cl(Math.hypot(vx, vz) / 1.1);
  let dy = Math.atan2(vx, vz) - b.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
  return { p, yaw: b.yaw + dy * walk, walk, hopping: b.tr };
};

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

  const ag = botMotion(AGENT_KEYS, agentWander, t);
  let armL = 15 + 8 * Math.sin(t * 3), armR = 15 - 8 * Math.sin(t * 3), lift = 0;
  let prop: BotPose["prop"] = "none";
  const cheer = (a: number, h = 1.2) => { if (t > a - 0.1 && t < a + 0.6) { armL = armR = 160; lift = Math.max(0, Math.sin(((t - a + 0.1) / 0.6) * Math.PI)) * h; } };
  if (ag.hopping) armL = armR = 150;
  else if (t < T.und0) { armR = 120 + 40 * Math.max(0, Math.sin(t * 9)); armL = 40; cheer(T.uebernimmt); }
  else if (t < T.gestern) { cheer(T.zieht0 + 0.2, 0.8); cheer(T.zwei2); }
  else if (t < T.ich) { cheer(T.vertrieb + 0.15, 0.9); }
  else if (t < T.warum + 0.3) { armR = t > SEND + 0.3 ? 135 + 25 * Math.sin(t * 8) : 25; }
  else if (t < T.zwanzig2) { prop = "magnifier"; armR = 90 + 20 * Math.sin(t * 5); }
  else if (t < T.bevor) { armR = 120 + 40 * Math.max(0, Math.sin(t * 7)); armL = 40; }
  else if (t < T.und) { armL = armR = 35; cheer(T.raus, 1.2); }
  else { armL = armR = 25; }
  const camD = Math.hypot(cam.pos[0] - ag.p[0], cam.pos[1] - ag.p[1] - 1, cam.pos[2] - ag.p[2]);

  const rs = botMotion(RES_KEYS, resWander, t);
  const resVis = t < T.gestern + 0.2 ? back((t - T.zieht0) / 0.4) : t > T.und2 ? back((t - T.bot2 + 0.5) / 0.4) : 0;
  let rArm = 20; let rLift = 0;
  if (t > T.zieht0 && t < T.zieht0 + 0.7) { rArm = 160; rLift = Math.sin(((t - T.zieht0) / 0.7) * Math.PI) * 0.8; }
  if (t > T.bot2 + 0.3 && t < T.bot2 + 1.1) { rArm = 160; rLift = Math.sin(((t - T.bot2 - 0.3) / 0.8) * Math.PI) * 0.9; }

  const toWorld = (x: number, y: number): V3 => [SCREEN[0] + (x / SW - 0.5) * SCR_W, SCREEN[1] + (0.5 - y / SH) * SCR_H, SCREEN[2] + 0.3];
  const sigAt = [T.saniert, T.schreibt, T.handwerker];
  const scr = back((t - T.erSucht - 0.2) / 0.5);
  const typer = HOUSES[TYPER];
  return (
    <>
      <CameraRig pos={cam.pos} look={look} fov={48 - 3 * punch} />
      <color attach="background" args={["#F3EEE7"]} />
      <fog attach="fog" args={["#F3EEE7", 75, 160]} />
      <ambientLight intensity={0.75} color="#FFF4E8" />
      <hemisphereLight args={["#FFFFFF", "#E8D9C8", 0.7]} />
      <primitive object={lightTarget} />
      <directionalLight position={[look[0] + 7, 18, look[2] + 10]} target={lightTarget} intensity={1.6} color="#FFF1E0" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={18} shadow-camera-bottom={-18} shadow-camera-far={80} shadow-bias={-0.0015} shadow-normalBias={0.04} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -16]} receiveShadow>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial map={tex.floor} roughness={0.95} />
      </mesh>

      {/* streets: plaza → every department (lit = taken over / today) */}
      {DEPTS.flatMap((d, j) => {
        const a = HQ, b = d.p;
        const dd = Math.hypot(b[0] - a[0], b[2] - a[2]);
        const n = Math.floor(dd / 0.9);
        return Array.from({ length: n }).map((_, i) => {
          const k = (i + 0.5) / n;
          const px = a[0] + (b[0] - a[0]) * k, pz = a[2] + (b[2] - a[2]) * k;
          if (Math.hypot(px, pz) < 4.4 || Math.hypot(px - b[0], pz - b[2]) < 2.3) return null;
          if (j !== 0 && Math.hypot(px - D0[0], pz - D0[2]) < 6.3) return null;
          if (Math.hypot(px - I2[0], pz - I2[2]) < 3.6) return null;
          const st = deptState(d, t);
          const on = st === "done" || (st === "today" && t > T.vertrieb - 0.3 + k * 0.5);
          return (
            <mesh key={`${j}-${i}`} position={[px, 0.03, pz]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.42, 0.42]} />
              <meshBasicMaterial color={on ? (st === "done" ? GREEN : OR) : "#D9D1C6"} transparent opacity={on ? 0.35 + 0.5 * Math.max(0, Math.sin(t * 4 - i * 0.6)) : 0.7} toneMapped={false} />
            </mesh>
          );
        });
      })}

      {/* plaza + Chefbüro */}
      <Island p={HQ} r={4.2} t={t} />
      <HQBuilding t={t} tex={tex} />
      {/* Positionierung's lot (Tag 1): Agent 1 + the live website */}
      <Island p={D0} r={6.2} t={t} done />
      <SkBot p={[-3.4, 0.4, -10.0]} yaw={0.5} t={t} seed={2} s={0.8} badge={tex.badge1} armL={20} armR={t > T.positionierung && t < T.positionierung + 0.7 ? 160 : 20} />
      <Monitor p={[-5, 3.6, -14.6]} w={SCR_W} h={SCR_H} tex={tex.doneSite} />
      {[-SCR_W / 2 + 0.4, SCR_W / 2 - 0.4].map((x) => <ToyBox key={x} p={[-5 + x, (3.6 - SCR_H / 2) / 2 + 0.2, -14.6 - 0.25]} s={[0.24, 3.6 - SCR_H / 2, 0.24]} color="#2A2622" />)}
      {/* Vertrieb's work lot */}
      <Island p={I2} r={3.4} t={t} active={t > T.vertrieb} locked={t < T.heute} />
      {DEPTS.map((d, i) => <DeptHouse key={d.n} d={d} i={i} t={t} plate={tex[`plate${i}`]} />)}

      {/* hook: the comment that becomes a bot */}
      <Board p={[1.6, 3.5, 1.6]} tex={tex.hookComment} w={3.5} h={0.94} t={t} q={q} at={T.jeder0 - 0.15} until={T.zieht0 + 0.15} bob={0.04} tilt={0.03} />
      <Burst3D at={T.zieht0 + 0.05} t={t} p={[2.3, 1.4, 1.9]} colors={[YEL, OR, "#FFFFFF"]} n={20} power={0.9} floor={0.5} />
      <SkBot p={rs.p} yaw={rs.yaw} t={t} seed={5} walk={rs.walk} body={YEL} dark="#D9A520" s={0.62} vis={resVis} armL={rArm} armR={rArm} lift={rLift} />
      {resVis > 0.05 && <Board p={[rs.p[0], rs.p[1] + 1.95 + rLift, rs.p[2]]} tex={t < T.und2 ? tex.resTag0 : tex.resTag1} w={1.7} h={0.58} t={t} q={q} at={t < T.und2 ? T.zieht0 + 0.25 : T.bot2 - 0.2} until={t < T.und2 ? T.gestern + 0.1 : 99} bob={0.02} />}

      {/* overview: every house gets its sign */}
      <Board p={[0, 6.0, -1.2]} tex={tex.deptHQ} w={7.2} h={2.0} t={t} q={q} at={T.stadt} until={T.gestern - 0.1} bob={0.03} />
      {DEPTS.map((d, i) => <Board key={d.n} p={[d.p[0], 5.6, d.p[2]]} tex={tex[`dept${i}`]} w={7.2} h={2.0} t={t} q={q} at={T.stadt + 0.1 + i * 0.12} until={T.gestern - 0.1} bob={0.03} />)}

      {/* yesterday: Positionierung = website + what customers really struggle with */}
      <Board p={[-4.8, 5.3, -13.0]} tex={tex.stampDone} w={3.9} h={1.0} t={t} q={q} at={T.positionierung - 0.1} until={T.heute - 0.1} tilt={0.05} />
      <Board p={[-4.7, 3.25, -11.4]} tex={dyn.problems} w={3.6} h={2.24} t={t} q={q} at={T.probleme - 0.15} until={T.heute - 0.1} bob={0.03} />
      <Burst3D at={T.positionierung + 0.1} t={t} p={[-7.6, 3.4, -8.6]} colors={[GREEN, "#FFFFFF", YEL]} n={18} power={0.9} floor={0.5} />

      {/* today: an agent moves into Vertrieb */}
      <Board p={[VERT[0] - 0.4, 4.25, VERT[2] + 0.4]} tex={tex.heute} w={3.0} h={0.75} t={t} q={q} at={T.heute} until={T.ich - 0.1} tilt={0.06} />
      <Burst3D at={T.vertrieb + 0.1} t={t} p={[VERT_FRONT[0], 1.4, VERT_FRONT[2]]} colors={[OR, "#FFFFFF", YEL]} n={22} power={1.2} floor={0.3} />

      {/* the market + messages */}
      <Houses t={t} />
      <Planes t={t} from={[CHAT[0], CHAT[1] + 0.8, CHAT[2]]} start={LAUNCH2} gap={0.035} />

      {/* Slack desk */}
      <group position={[CHAT[0], 0.4, CHAT[2]]} rotation={[0, CHAT_YAW, 0]}>
        <ToyBox p={[0, 0.66, 0.2]} s={[3.4, 0.14, 1.4]} color="#E9E1D6" top="#F6F1EA" />
        {[[-1.5, -0.4], [1.5, -0.4], [-1.5, 0.8], [1.5, 0.8]].map(([dx, dz], i) => <ToyBox key={i} p={[dx, 0.3, dz]} s={[0.12, 0.6, 0.12]} color="#B9AE9F" />)}
        <ToyBox p={[0.9, 0.78, 0.6]} s={[1.2, 0.08, 0.42]} color="#FFFFFF" />
        <mesh position={[-1.25, 0.95, 0.55]} castShadow><cylinderGeometry args={[0.16, 0.13, 0.36, 12]} /><meshStandardMaterial color={OR} /></mesh>
      </group>
      <Monitor p={CHAT} w={2.9} h={2.06} tex={dyn.slack} yaw={CHAT_YAW} stand={0.55} />
      <Burst3D at={CLICK + 0.08} t={t} p={[CHAT[0] + 1.6, CHAT[1] + 0.9, CHAT[2] + 0.2]} colors={[GREEN, "#FFFFFF", LI]} n={9} power={0.45} floor={0.5} />

      {/* insight: one contact, a hundred houses */}
      <Board p={INSIGHT} tex={dyn.insight} w={3.7} h={2.3} t={t} q={q} at={T.warum + 0.35} until={T.erSucht + 0.1} bob={0.03} />
      <Burst3D at={T.dieHaben2} t={t} p={INSIGHT} colors={[OR, "#FFFFFF", YEL]} n={20} power={1.0} floor={0.5} />

      {/* signals */}
      {t > T.signalen - 0.3 && t < T.zwanzig2 + 0.3 && [0, 1, 2].map((k) => {
        const ph = (((t - T.signalen - k * 0.5) % 1.5) + 1.5) % 1.5 / 1.5;
        if (t - T.signalen + 0.3 - k * 0.5 < 0) return null;
        const r = 1.0 + ph * 7.2;
        return (
          <mesh key={k} position={[I2[0], 0.46, I2[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r - 0.12, r, 72]} />
            <meshBasicMaterial color={OR} transparent opacity={0.6 * (1 - ph) * (1 - ease((t - T.zwanzig2) / 0.3))} toneMapped={false} depthWrite={false} />
          </mesh>
        );
      })}
      {SIG_HOUSE.map((hi, i) => {
        const h = HOUSES[hi];
        const a = sigAt[i];
        if (t < a - 0.05) return null;
        const up = ease((t - a + 0.05) / 0.45);
        const into = ease((t - T.zwanzig2 + 0.35) / 0.5);
        const target = toWorld(600, ROW_Y + i * ROW_H + 40);
        const p0 = lerp3([h.x, 1.3, h.z], SIG_POS[i], up);
        const p = into > 0 ? bez3(SIG_POS[i], [5.4, 6.6, -16.5], target, into) : p0;
        const s = (0.35 + 0.65 * up) * (1 - 0.85 * into);
        return <Board key={i} p={p} tex={tex[`sig${i}`]} w={3.45 * s} h={1.0 * s} t={t} q={q} at={a - 0.05} until={T.zwanzig2 + 0.2} bob={0.03} tilt={(i - 1) * -0.03} />;
      })}
      {sigAt.map((a, i) => <Burst3D key={i} at={a} t={t} p={[HOUSES[SIG_HOUSE[i]].x, 1.2, HOUSES[SIG_HOUSE[i]].z]} colors={[YEL, OR, "#FFFFFF"]} n={10} power={0.6} />)}

      {/* the big screen: lead list, then the LinkedIn draft */}
      <group position={[SCREEN[0], 0.4, SCREEN[2]]} scale={scr}><group position={[-SCREEN[0], -0.4, -SCREEN[2]]}>
        <Monitor p={SCREEN} w={SCR_W} h={SCR_H} tex={dyn.screen} />
        {[-SCR_W / 2 + 0.4, SCR_W / 2 - 0.4].map((x) => <ToyBox key={x} p={[SCREEN[0] + x, (SCREEN[1] - SCR_H / 2) / 2 + 0.2, SCREEN[2] - 0.25]} s={[0.24, SCREEN[1] - SCR_H / 2, 0.24]} color="#2A2622" />)}
      </group></group>
      <Burst3D at={T.zwanzig2 + 1.3} t={t} p={[SCREEN[0] + 2.0, SCREEN[1] + 1.5, SCREEN[2] + 0.4]} colors={[OR, "#FFFFFF", YEL]} n={16} power={0.9} floor={0.5} />
      <Burst3D at={T.signal + 0.05} t={t} p={[SCREEN[0] + 2.1, SCREEN[1] + 1.4, SCREEN[2] + 0.4]} colors={[YEL, "#FFFFFF", OR]} n={14} power={0.7} floor={0.5} />

      {/* cliffhanger: one house starts typing … then stops */}
      <Board p={[typer.x + 0.2, 2.1, typer.z]} tex={dyn.typing} w={1.2} h={0.6} t={t} q={q} at={T.einer - 0.1} until={T.tipp + 0.2} bob={0.05} />
      <Board p={[5.4, 5.6, -15.2]} tex={tex.antworten} w={3.6} h={1.0} t={t} q={q} at={T.antwortet} until={T.tipp - 0.1} tilt={0.04} />

      {/* CTA: your guess + your job */}
      <Board p={[5.4, 3.95, -12.0]} tex={dyn.comment} w={4.0} h={1.29} t={t} q={q} at={T.tipp - 0.1} until={T.und2 + 0.1} bob={0.03} />
      <Burst3D at={CTA_SENT} t={t} p={[5.4, 4.0, -12.0]} colors={[OR, "#FFFFFF", YEL, GREEN]} n={22} power={1.1} floor={0.5} />

      {/* resident plots: you move in tomorrow */}
      {RES.map((r, i) => {
        const k = back((t - T.und2 - 0.1 - i * 0.08) / 0.35);
        if (t < T.und2 - 0.2) return null;
        return (
          <group key={i} position={r} scale={[k, k, k]}>
            <ToyBox p={[0, 0.05, 0]} s={[1.6, 0.1, 1.6]} color={i === 2 && t > T.bot2 + 0.2 ? "#FFF3C4" : "#FFFFFF"} />
            {[[-0.75, 0], [0.75, 0], [0, -0.75], [0, 0.75]].map(([x, z], j) => <ToyBox key={j} p={[x, 0.13, z]} s={[x ? 0.08 : 1.58, 0.06, z ? 0.08 : 1.58]} color={OR} />)}
            {!(i === 2 && t > T.bot2 + 0.2) && <>
              <ToyBox p={[0.55, 0.45, -0.55]} s={[0.07, 0.8, 0.07]} color="#8A5A35" />
              <group position={[0.55, 0.95, -0.5]}><mesh><planeGeometry args={[0.9, 0.42]} /><meshBasicMaterial map={tex.frei} toneMapped={false} /></mesh></group>
            </>}
          </group>
        );
      })}
      <Board p={[7.9, 4.0, -6.6]} tex={tex.resBoard} w={4.6} h={1.33} t={t} q={q} at={T.und2 + 0.2} until={T.und3 - 0.05} tilt={-0.03} />
      <Burst3D at={T.bot2 + 0.3} t={t} p={[RES[2][0], 1.0, RES[2][2]]} colors={[YEL, OR, "#FFFFFF"]} n={18} power={0.8} floor={0.3} />
      <Board p={[7.9, 3.45, -6.2]} tex={dyn.dm} w={4.0} h={1.96} t={t} q={q} at={T.und3 + 0.05} until={T.morgen2 + 0.25} bob={0.03} />
      <Burst3D at={T.prompts + 0.1} t={t} p={[7.9, 3.5, -6.0]} colors={[OR, "#FFFFFF", YEL]} n={18} power={0.9} floor={0.5} />

      {/* outro: tomorrow */}
      <Board p={[1.0, 6.2, -8.5]} tex={tex.tomorrow} w={6.9} h={2.3} t={t} q={q} at={T.morgen2 + 0.3} tilt={0.04} />
      <SkBot p={ag.p} yaw={ag.yaw} t={t} seed={1} walk={ag.walk} armL={Math.round(armL)} armR={Math.round(armR)} lift={lift} prop={prop} talk={t > SEND + 0.3 && t < T.warum} vis={cl((camD - 2.6) / 2)} badge={tex.badge2} />
    </>
  );
};

// ---------- textures ----------
const useStaticTex = (ready: boolean) =>
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
    t.hqSign = canvasTex(620, 112, (c) => { c.fillStyle = INK; c.fillRect(0, 0, 620, 112); c.fillStyle = "#FFFFFF"; c.textAlign = "center"; c.textBaseline = "middle"; c.font = `60px ${F_B}`; c.fillText("CHEFBÜRO", 310, 60); });
    DEPTS.forEach((d, i) => {
      t[`plate${i}`] = canvasTex(620, 112, (c) => { c.fillStyle = INK; c.fillRect(0, 0, 620, 112); c.fillStyle = "#FFFFFF"; c.textAlign = "center"; c.textBaseline = "middle"; fit(c, d.n, F_B, 60, 580); c.fillText(d.n, 310, 60); });
      t[`dept${i}`] = deptTex(d.n, d.st);
    });
    t.deptHQ = deptTex("CHEFBÜRO", "locked");
    t.heute = signTex("HEUTE: KI ZIEHT EIN", OR, "#FFFFFF", OR_D, 760, 190);
    t.stampDone = signTex("✓ TAG 1: VON KI ÜBERNOMMEN", GREEN, "#FFFFFF", "#167A42", 900, 230);
    t.hookComment = canvasTex(900, 240, (c) => {
      c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 884, 224, 40); c.fill();
      c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 892, 228, 40); c.fill();
      c.strokeStyle = YEL; c.lineWidth = 7; roundRect(c, 4, 4, 884, 220, 37); c.stroke();
      c.fillStyle = "#FFF3C4"; c.beginPath(); c.arc(100, 114, 58, 0, 7); c.fill();
      c.fillStyle = "#B8860B"; c.font = `44px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("DU", 100, 117);
      c.textAlign = "left"; c.fillStyle = MUTED; c.font = `34px ${F_B}`; c.fillText("💬 dein Kommentar", 188, 70);
      c.fillStyle = INK; c.font = `${fit(c, "Bin Bäckerin, ich steuer mit!", F_B, 56, 660)}px ${F_B}`; c.fillText("Bin Bäckerin, ich steuer mit!", 188, 146);
    });
    t.resTag0 = tagTex("DU", "Bäckerin", "#D9A520");
    t.resTag1 = tagTex("DU", "dein Beruf", "#D9A520");
    t.frei = canvasTex(256, 120, (c) => { c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 256, 120, 22); c.fill(); c.strokeStyle = OR; c.lineWidth = 8; roundRect(c, 4, 4, 248, 112, 18); c.stroke(); c.fillStyle = OR; c.font = `56px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("FREI", 128, 64); });
    t.resBoard = canvasTex(1000, 290, (c) => {
      c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 984, 274, 40); c.fill();
      c.fillStyle = INK; roundRect(c, 0, 0, 990, 278, 40); c.fill();
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillStyle = YEL; c.font = `42px ${F_B}`; c.fillText("AB MORGEN WOHNST DU HIER", 495, 78);
      c.fillStyle = "#FFFFFF"; fit(c, "Kommentar + Beruf = dein Bot", F_B, 66, 900); c.fillText("Kommentar + Beruf = dein Bot", 495, 176);
    });
    t.antworten = signTex("ANTWORTEN: ?", INK, "#FFFFFF", INK, 760, 210);
    t.sig0 = signalTex("SANIERT", "Hausverwaltung Meyer", "3 Objekte, Heizungstausch geplant");
    t.sig1 = signalTex("SCHREIBT AUS", "WEG Sonnenhof", "Ausschreibung: neue Heizanlage");
    t.sig2 = signalTex("SUCHT HANDWERKER", "Immobilien Haas", "Stellenanzeige: Haustechniker");
    t.doneSite = canvasTex(SW, SH, drawDoneSite);
    t.tomorrow = canvasTex(1200, 400, (c) => {
      c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 1184, 384, 44); c.fill();
      c.fillStyle = INK; roundRect(c, 0, 0, 1190, 388, 44); c.fill();
      c.textBaseline = "middle"; c.textAlign = "center";
      c.fillStyle = OR; c.font = `46px ${F_B}`; c.fillText("MORGEN · TAG 3", 595, 74);
      c.fillStyle = "#FFFFFF"; c.font = `82px ${F_B}`; c.fillText("Wer hat geantwortet?", 595, 168);
      c.fillStyle = YEL; c.font = `${fit(c, "+ deine Bots ziehen ein · 🔒 nächstes Haus", F_B, 50, 1100)}px ${F_B}`; c.fillText("+ deine Bots ziehen ein · 🔒 nächstes Haus", 595, 290);
    });
    const badge = (n: string) => canvasTex(128, 128, (c) => { c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill(); c.fillStyle = OR; c.font = `84px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(n, 64, 70); });
    t.badge1 = badge("1"); t.badge2 = badge("2");
    return t;
  }, [ready]);

const useDynTex = (t: number, logo: HTMLImageElement | null, slack: HTMLImageElement | null, claude: HTMLImageElement | null) => {
  const slackT = useDyn(CW, CH, (c) => drawSlack(c, t, slack));
  const screen = useDyn(SW, SH, (c) => drawScreen(c, t, logo));
  const insight = useDyn(900, 560, (c) => drawInsight(c, t));
  const typing = useDyn(240, 120, (c) => {
    c.fillStyle = "#FFFFFF"; roundRect(c, 4, 4, 232, 100, 50); c.fill();
    c.strokeStyle = "#E2DCD3"; c.lineWidth = 4; c.stroke();
    const stop = t > T.einer + 0.9;
    [0, 1, 2].forEach((i) => { const a = stop ? 0.25 : 0.3 + 0.7 * Math.max(0, Math.sin(t * 9 - i * 0.9)); c.fillStyle = `rgba(22,19,15,${a})`; c.beginPath(); c.arc(70 + i * 50, 54, 15, 0, 7); c.fill(); });
  });
  const comment = useDyn(900, 290, (c) => {
    const n1 = Math.max(0, Math.floor((t - T.tipp - 0.45) * 12)), n2 = Math.max(0, Math.floor((t - T.beruf + 0.1) * 16));
    const typed = TIP1.slice(0, n1) + TIP2.slice(0, n2);
    const TIP = TIP1 + TIP2;
    const done = t >= CTA_SENT;
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 884, 274, 36); c.fill();
    c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 892, 278, 36); c.fill();
    c.fillStyle = INK; c.font = `38px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText(t < T.beruf - 0.15 ? "Wie viele antworten?" : "Wie viele antworten? + dein Beruf", 40, 54);
    c.strokeStyle = done ? GREEN : OR; c.lineWidth = 7; roundRect(c, 30, 100, 832, 148, 74); c.stroke();
    c.fillStyle = OR_L; c.beginPath(); c.arc(110, 174, 46, 0, 7); c.fill();
    c.fillStyle = OR; c.font = `32px ${F_B}`; c.textAlign = "center"; c.fillText("DU", 110, 176);
    c.textAlign = "left"; c.fillStyle = INK; c.font = `${fit(c, TIP, F_B, 64, 540)}px ${F_B}`; c.fillText(typed + (done || Math.floor(t * 3) % 2 ? "" : "|"), 184, 178);
    c.fillStyle = done ? GREEN : OR; c.beginPath(); c.arc(784, 174, 50, 0, 7); c.fill();
    c.strokeStyle = "#FFFFFF"; c.lineWidth = 8; c.beginPath(); c.moveTo(784, 196); c.lineTo(784, 152); c.moveTo(766, 170); c.lineTo(784, 152); c.lineTo(802, 170); c.stroke();
    if (done) { c.fillStyle = GREEN; roundRect(c, 640, 20, 222, 58, 29); c.fill(); c.fillStyle = "#FFFFFF"; c.font = `28px ${F_B}`; c.fillText("✓ gesendet", 668, 50); }
  });
  const dm = useDyn(900, 440, (c) => {
    const file = ease((t - T.prompts - 0.05) / 0.3);
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 884, 424, 36); c.fill();
    c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 892, 428, 36); c.fill();
    c.fillStyle = OR; c.beginPath(); c.arc(70, 64, 32, 0, 7); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `30px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("F", 70, 66);
    c.textAlign = "left"; c.fillStyle = INK; c.font = `36px ${F_B}`; c.fillText("florent_preusser", 120, 52);
    c.fillStyle = MUTED; c.font = `26px ${F_M}`; c.fillText("Direktnachricht · jetzt", 120, 88);
    c.fillStyle = "#F1EEEA"; roundRect(c, 40, 124, 600, 84, 42); c.fill();
    c.fillStyle = INK; c.font = `36px ${F_S}`; c.fillText("Hier sind deine Prompts:", 76, 168);
    if (file > 0) {
      c.save(); c.globalAlpha = file; c.translate(0, (1 - file) * 24);
      c.fillStyle = OR_L; roundRect(c, 40, 232, 812, 164, 32); c.fill();
      c.strokeStyle = OR; c.lineWidth = 5; roundRect(c, 40, 232, 812, 164, 32); c.stroke();
      c.fillStyle = OR; roundRect(c, 70, 258, 92, 112, 14); c.fill();
      c.fillStyle = "#FFFFFF"; c.font = `30px ${F_B}`; c.textAlign = "center"; c.fillText("PDF", 116, 316);
      c.textAlign = "left"; c.fillStyle = INK; c.font = `42px ${F_B}`; c.fillText("Lead- & LinkedIn-Prompts", 190, 292);
      c.fillStyle = OR_D; c.font = `30px ${F_S}`; c.fillText("für", 190, 346);
      const s1 = ease((t - T.superkind2) / 0.25), s2 = ease((t - T.claude) / 0.25);
      if (s1 > 0) { c.globalAlpha = file * s1; if (logo) c.drawImage(logo, 246, 326, 40, 40); c.fillStyle = INK; c.font = `30px ${F_B}`; c.fillText("Superkind", 294, 347); }
      if (s2 > 0) { c.globalAlpha = file * s2; c.fillStyle = OR_D; c.font = `30px ${F_S}`; c.fillText("oder", 452, 346); if (claude) c.drawImage(claude, 522, 326, 40, 40); c.fillStyle = INK; c.font = `30px ${F_B}`; c.fillText("Claude", 570, 347); }
      c.restore();
    }
  });
  const problems = useDyn(900, 560, (c) => drawProblems(c, t));
  return { slack: slackT, screen, insight, typing, comment, dm, problems };
};

// ---------- 2D: captions + the series frame (scoreboard) ----------
const SK_THEME: PixelTheme = { bg: "#F3EEE7", bgPattern: "none" as PixelTheme["bgPattern"], floor: "#FFFFFF", floorLine: OR, accent: OR, dark: INK, gold: "#FFFFFF", green: OR, cream: "#FFFFFF", ink: INK };
const Pill: React.FC<{ k: number; bg?: string; color?: string; children: React.ReactNode; big?: boolean; shake?: number }> = ({ k, bg = "rgba(255,255,255,.95)", color = INK, children, big, shake = 0 }) => (
  <div style={{ opacity: k, transform: `translateY(${(1 - k) * -16}px) scale(${0.85 + 0.15 * k}) translateX(${Math.sin(shake * 40) * 8 * shake}px)`, background: bg, color, borderRadius: 999, padding: big ? "14px 30px" : "10px 20px", boxShadow: "0 8px 24px rgba(40,24,10,.16)", fontFamily: F_B, fontSize: big ? 38 : 28, whiteSpace: "nowrap" }}>{children}</div>
);
const Scoreboard: React.FC<{ t: number }> = ({ t }) => {
  // hook: the series promise + "you steer along", for sound-off scrollers
  if (t < T.tag) {
    const kT = ease((t - 0.05) / 0.3), kS = ease((t - T.steuerst) / 0.3);
    return (
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Pill k={kT} big bg={INK} color="#FFFFFF">KI ÜBERNIMMT MEINE FIRMA <span style={{ color: OR }}>· 100 TAGE</span></Pill>
        {kS > 0 && <Pill k={kS} big bg={YEL} color={INK} shake={bump(t, T.zieht0, 0.3)}>🎮 DU STEUERST MIT</Pill>}
      </div>
    );
  }
  const kTag = ease((t - T.tag) / 0.35);
  const big = t < T.gestern - 0.1; // the framing moment: big, centred
  const houses = t > T.vertrieb + 0.2 ? 2 : 1;
  const kH = ease((t - T.meineFirma) / 0.35), hPop = bump(t, T.vertrieb + 0.25, 0.3);
  const msgs = t < LAUNCH2 ? 0 : Math.min(20, TOP20.filter((_, k) => t >= sendArrive(k)).length);
  const kMsg = ease((t - T.zwanzig2) / 0.35), kAnt = ease((t - T.und) / 0.35), kRes = ease((t - T.und2 - 0.2) / 0.35);
  const HousePill = ({ k, big: b }: { k: number; big?: boolean }) => (
    <Pill k={k} big={b} bg={houses > 1 ? OR : "rgba(255,255,255,.95)"} color={houses > 1 ? "#FFFFFF" : INK}>
      <span style={{ display: "inline-block", transform: `scale(${1 + 0.35 * hPop})` }}>🏠 KI-HÄUSER {houses}<span style={{ opacity: 0.6 }}>/8</span></span>
    </Pill>
  );
  if (big) {
    return (
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
        <Pill k={kTag} big bg={INK} color="#FFFFFF">🔥 TAG 2 <span style={{ color: "#A39C90" }}>/ 100</span></Pill>
        {kH > 0 && <HousePill k={kH} big />}
      </div>
    );
  }
  const kBar = ease((t - T.gestern + 0.1) / 0.35);
  // quests of the day: tick off as they happen
  const QUESTS: [string, number][] = [["Leads finden", T.zwanzig2 + 0.2], ["Entscheider", T.entscheidet + 0.3], ["20 Nachrichten raus", T.raus + 0.05]];
  const done = QUESTS.filter(([, a]) => t >= a).length;
  const kQuest = ease((t - T.ich + 0.2) / 0.4);
  // 100-day bar: day 1 full, day 2 fills over the episode, day 3 pulses at the end
  const d2 = cl(t / (T.raus + 0.05));
  const end = t > T.morgen2;
  const kAch = ease((t - T.und - 0.2) / 0.3) * (1 - ease((t - T.und - 2.0) / 0.3));
  const kLock = ease((t - T.morgen2 - 0.1) / 0.35);
  return (
    <>
      <div style={{ position: "absolute", top: 112, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10, opacity: kBar }}>
        <Pill k={1} bg={INK} color="#FFFFFF">🔥 TAG 2 <span style={{ color: "#A39C90" }}>/ 100</span></Pill>
        <HousePill k={1} />
        {kRes > 0 ? <Pill k={kRes} bg={YEL} color={INK} shake={bump(t, T.bot2 + 0.3, 0.3)}>👥 EINWOHNER {t > T.bot2 + 0.3 ? "DU?" : "0"}</Pill> : kMsg > 0 && <Pill k={kMsg}>LEADS <span style={{ color: OR }}>{leadCount(t)}</span></Pill>}
        {kRes > 0 ? null : kAnt > 0 ? <Pill k={kAnt} bg={OR} color="#FFFFFF" shake={bump(t, T.einer, 0.3)}>ANTWORTEN ?</Pill> : msgs > 0 ? <Pill k={1} bg={LI} color="#FFFFFF">GESENDET {msgs}</Pill> : null}
      </div>
      <div style={{ position: "absolute", top: 172, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kBar }}>
        <div style={{ display: "flex", gap: 2.4, alignItems: "flex-end", background: "rgba(255,255,255,.9)", borderRadius: 999, padding: "8px 16px", boxShadow: "0 6px 18px rgba(40,24,10,.12)" }}>
          {Array.from({ length: 100 }, (_, i) => {
            const fill = i === 0 ? 1 : i === 1 ? d2 : 0;
            const pulse = i === 2 && end ? 0.5 + 0.5 * Math.sin(t * 10) : 0;
            return (
              <div key={i} style={{ width: 5, height: i < 3 ? 18 : 12, borderRadius: 2, background: "#E7E0D6", position: "relative", overflow: "hidden", outline: pulse ? `2px solid rgba(255,107,53,${pulse})` : undefined }}>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: OR }} />
              </div>
            );
          })}
        </div>
      </div>
      {kQuest > 0 && !end && (
        <div style={{ position: "absolute", top: 222, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kQuest * kBar * (1 - ease((t - T.und - 0.3) / 0.3)) }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: F_B, fontSize: 22 }}>
            <span style={{ color: OR_D, letterSpacing: ".08em" }}>MISSION {done}/3</span>
            {QUESTS.map(([q, a]) => {
              const k = t >= a; const pop = bump(t, a + 0.08, 0.2);
              return (
                <span key={q} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, background: k ? GREEN : "rgba(255,255,255,.9)", color: k ? "#FFFFFF" : MUTED, transform: `scale(${1 + 0.25 * pop})`, boxShadow: "0 4px 12px rgba(40,24,10,.12)" }}>
                  {k ? "✓" : "○"} {q}
                </span>
              );
            })}
          </div>
        </div>
      )}
      {kAch > 0 && (
        <div style={{ position: "absolute", top: 1110, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kAch }}>
          <div style={{ transform: `translateY(${(1 - kAch) * -40}px) scale(${0.8 + 0.2 * kAch + 0.06 * bump(t, T.und + 0.5, 0.25)})`, background: INK, color: "#FFFFFF", borderRadius: 28, padding: "18px 34px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 14px 40px rgba(40,24,10,.35)", border: `3px solid ${OR}` }}>
            <span style={{ fontSize: 58 }}>🏆</span>
            <div>
              <div style={{ fontFamily: F_B, fontSize: 24, color: OR, letterSpacing: ".1em" }}>MISSION TAG 2 GESCHAFFT</div>
              <div style={{ fontFamily: F_B, fontSize: 36 }}>20 Nachrichten sind raus</div>
            </div>
          </div>
        </div>
      )}
      {kLock > 0 && (
        <div style={{ position: "absolute", top: 228, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kLock }}>
          <div style={{ transform: `scale(${0.85 + 0.15 * kLock}) rotate(${Math.sin(t * 22) * 4 * Math.max(0, Math.sin(t * 3))}deg)`, background: OR, color: "#FFFFFF", borderRadius: 999, padding: "12px 26px", fontFamily: F_B, fontSize: 30, boxShadow: "0 10px 26px rgba(255,107,53,.35)" }}>
            🔒 TAG 3 schaltet morgen frei
          </div>
        </div>
      )}
    </>
  );
};

// ---------- audio ----------
type Sfx = [string, number, number];
const TRANSITS = HOLDS.slice(0, -1).map((h) => h.b);
const SFX: Sfx[] = [
  ...TRANSITS.map((c): Sfx => ["whoosh-quick", c - 0.02, 0.4]),
  ["ui-pop", 0.05, 0.4], ...DEPTS.map((_, i): Sfx => ["ui-pop", T.komplett - 0.2 + i * 0.09, 0.14]), ["powerup", T.uebernimmt, 0.25],
  ["ui-pop", T.steuerst, 0.4], ["ui-pop", T.jeder0 - 0.1, 0.35], ["jump", T.zieht0, 0.3], ["chime", T.zieht0 + 0.05, 0.25],
  ["ui-pop", T.tag, 0.4], ["chime", T.zwei2, 0.28], ["ui-pop", T.meineFirma, 0.35],
  ...[...DEPTS, 0].map((_, i): Sfx => ["ui-pop", T.stadt + i * 0.12, 0.16]), ["bump", T.abteilung + 0.2, 0.3],
  ["stamp", T.positionierung - 0.05, 0.35], ["check", T.positionierung + 0.1, 0.3], ["ui-pop", T.website, 0.3],
  ...PROBLEMS.map((_, i): Sfx => ["ui-pop", T.probleme + 0.1 + i * 0.28, 0.25]),
  ["ui-pop", T.heute, 0.4], ["jump", T.vertrieb, 0.25], ["powerup", T.vertrieb + 0.1, 0.3], ["coin", T.vertrieb + 0.25, 0.3],
  ["typing", T.ich, 0.22], ["click", SEND, 0.6], ["ui-pop", SEND + 0.3, 0.35],
  ["ui-pop", T.warum + 0.4, 0.35], ["stamp", T.haus, 0.3], ["coin", T.dieHaben2, 0.25], ["chime", T.hundert2, 0.25],
  ["riser", T.signalen - 0.3, 0.18],
  ...[T.saniert, T.schreibt, T.handwerker].flatMap((a): Sfx[] => [["ui-pop", a, 0.4], ["check", a + 0.1, 0.25]]),
  ...[0, 1, 2, 3, 4, 5].map((i): Sfx => ["ui-pop", rowAt(i), 0.2]),
  ["coin", T.zwanzig2 + 1.3, 0.28], ["check", T.entscheidet + 0.2, 0.35],
  ["typing", T.dann + 0.15, 0.2], ["stamp", T.signal, 0.3],
  ["ui-pop", T.bevor + 0.2, 0.4], ["click", CLICK, 0.7], ["chime", CLICK + 0.1, 0.3],
  ...Array.from({ length: 6 }, (_, i): Sfx => ["whoosh-quick", LAUNCH2 + i * 0.12, 0.16]),
  ["ui-pop", T.antwortet, 0.35], ["typing", T.einer - 0.1, 0.18], ["bump", T.einer + 0.9, 0.3],
  ["ui-pop", T.tipp - 0.1, 0.4], ["typing", T.tipp + 0.45, 0.22], ["typing", T.beruf - 0.1, 0.2], ["check", CTA_SENT, 0.4], ["powerup", CTA_SENT, 0.22],
  ["check", T.zwanzig2 + 0.25, 0.3], ["check", T.entscheidet + 0.35, 0.3], ["check", T.raus + 0.08, 0.3], ["powerup", T.und + 0.23, 0.3], ["coin", T.und + 0.45, 0.3],
  ...RES.map((_, i): Sfx => ["ui-pop", T.und2 + 0.1 + i * 0.08, 0.15]), ["ui-pop", T.und2 + 0.2, 0.35], ["jump", T.bot2 + 0.3, 0.3], ["chime", T.bot2 + 0.35, 0.3],
  ["ui-pop", T.und3 + 0.05, 0.4], ["chime", T.prompts + 0.1, 0.3], ["ui-pop", T.claude, 0.3],
  ["ui-pop", T.morgen2 + 0.3, 0.35], ["bump", T.morgen2 + 0.15, 0.35], ["bump", T.naechste, 0.35],
];

export const Agents100Day2: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const ready = useFontsReady([`40px ${F_B}`, `40px ${F_S}`, `40px ${F_M}`, "800 70px Rubik"]);
  const logo = useImage(staticFile("superkind-logo.svg"));
  const slack = useImage(staticFile("logos/slack.svg"));
  const claude = useImage(staticFile("logos/claude.svg"));
  const tex = useStaticTex(ready);
  const dyn = useDynTex(t, logo, slack, claude);
  const a = camAt(t - 0.03).pos, b = camAt(t + 0.03).pos;
  const speed = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 0.06;
  const blur = Math.min(3.5, Math.max(0, (speed - 8) * 0.12));
  const flash = 0.18 * bump(t, T.uebernimmt + 0.1, 0.08) + 0.2 * bump(t, T.dieHaben2, 0.08) + 0.3 * bump(t, CLICK + 0.05, 0.1);
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
      <Scoreboard t={t} />
      <PillCaptions words={WD} theme={SK_THEME} />
      <Audio src={staticFile("sk100d2t/voice.mp3")} />
      <Audio src={staticFile("sk100d2t/music-loser.mp3")} volume={0.25} />
      {SFX.map(([n, s, v], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s * 30))} durationInFrames={90}>
          <Audio src={staticFile(`sirtoken/sfx-${n}.mp3`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
