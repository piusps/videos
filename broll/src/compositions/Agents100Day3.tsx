// Superkind series "KI übernimmt meine Firma", Tag 3/100 (2026-10-23). v5 (Pius 2026-10-23): everybody knows skills, every
// skill is like an employee that does what IT thinks is best. So you need a Geschäftsführer-Skill that does no work itself,
// it only leads all other skills for maximum success. Example Vertrieb (20 LinkedIn messages out, 0 replies, real numbers):
// the sales skill wants 20 new ones, the Geschäftsführer says "Stopp", follow up in 3 days → I only say yes.
// CTA: comment "Chef" → you get the Geschäftsführer-Skill for your own Claude. Town + HUD from Agents100Day2.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CameraRig, ToyBox, canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, Word, PixelTheme } from "../components/PixelKit";
import words from "../../public/sk100d3/words.json";

export const AGENTS_DAY3_SECONDS = 44.0;
const W = 1080, H = 1920;
type V3 = [number, number, number];
const OR = "#FF6B35", OR_D = "#E5521F", OR_L = "#FFEDE4", INK = "#16130F", MUTED = "#8A857D", LINE = "#EEEAE4", GREEN = "#1F9D55", LI = "#0A66C2", YEL = "#F5C542", GOLD = "#E8B530";
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
const S = (i: number) => WD[i].s; // word start by index (script fixed, see runs/fpn-100-agenten-tag3/script.txt)

// ---------- key times from the voice ----------
const T = {
  ki: S(1), chefbuero: S(5), tag: S(6), drei: S(7), meineFirma: S(10), stadt: S(10), abteilung: S(12), jedes: S(15), skill1: S(15),
  mitarb: S(20), sieben: S(21), chaos: S(22), aber: S(32), ab: S(43), der2: S(46), auchSkill: S(47), bm: S(47), derArb: S(48), selbst: S(50),
  fuehrt: S(53), holen: S(56), skills: S(59), wie: S(60), regisseur: S(60), sagt: S(60), tun: S(62), lassen: S(63),
  heute: S(64), vertrieb: S(64), zwanzig: S(67), null: S(71), vskill: S(73), neue: S(78), bmSagt: S(80), lass: S(83), fass: S(87), dreiTage: S(94), grund: S(99),
  undIch: S(100), jaNein: S(103), ja: S(105), acht: S(106), job: S(106), offerFuehrt: S(116),
  schreib: S(121), welches: S(122), und5: S(125) + 0.35, skillCta: S(126), superkind: S(126) + 0.25, claude: S(130),
  tUnd: S(131), res: S(131) + 0.3, wohnen: S(134), keinJob: S(142), schreibJob: S(144), bot: S(149), morgen: S(154), hier: S(159),
};
const CLICK = T.ja - 0.08;
const END = T.hier + 0.6;

// ---------- world layout (same town as Tag 2) ----------
const HQ: V3 = [0, 0, 0];
const D0: V3 = [-5, 0, -11];
const I2: V3 = [5.4, 0, -15.5];
type Dept = { n: string; p: V3; yaw: number; st: "done" | "locked"; day?: number };
const DEPTS: Dept[] = [
  { n: "POSITIONIERUNG", p: [-7.6, 0.4, -8.6], yaw: 0.5, st: "done", day: 1 },
  { n: "VERTRIEB", p: [12.0, 0, -8.8], yaw: -0.54, st: "done", day: 2 },
  { n: "MARKETING", p: [-8.0, 0, 2.0], yaw: 0.6, st: "locked" },
  { n: "SUPPORT", p: [-7.5, 0, -20.5], yaw: 0.4, st: "locked" },
  { n: "BUCHHALTUNG", p: [-0.5, 0, -25.5], yaw: 0.1, st: "locked" },
  { n: "PERSONAL", p: [7.5, 0, -25.5], yaw: -0.2, st: "locked" },
  { n: "LAGER", p: [12.8, 0, -19.5], yaw: -0.5, st: "locked" },
];
const VERT = DEPTS[1].p;
const fwd = (yaw: number, d: number): [number, number] => [Math.sin(yaw) * d, Math.cos(yaw) * d];
const VD = fwd(DEPTS[1].yaw, 2.0);
const VERT_FRONT: V3 = [VERT[0] + VD[0], 0, VERT[2] + VD[1]];
// the first 8 real commenters (Tag 1, 2026-10-21/23; Pius' own test account left out)
const RESIDENTS = ["andydeken", "dns.schuett", "leonardovincenzosimeoni1", "makaza_29", "cashflowpunk", "emanuele.augugliaro.1", "petrak_privat", "berlinermom96"];
const RES: V3[] = RESIDENTS.map((_, i) => [4.55 + (i % 4) * 1.8, 0, i < 4 ? -3.6 : -6.9] as V3);
const RES_C: V3 = [7.2, 0, -5.4];
const DU_P: V3 = [7.2, 0, -1.5];
// order in which the Bürgermeister checks the houses on his morning round
const ROUND = [2, 0, 3, 4, 5, 6, 1];

// ---------- camera ----------
type Hold = { a: number; b: number; p0: V3; p1: V3; l0: V3; l1: V3 };
const HOLDS: Hold[] = [
  { a: 0, b: T.tag - 0.15, p0: [1.0, 3.6, 10.2], p1: [0.5, 3.6, 8.8], l0: [0.3, 2.5, -0.6], l1: [0.3, 2.5, -0.8] },
  { a: T.tag + 0.3, b: T.aber - 0.15, p0: [2.0, 57, 14], p1: [2.0, 52, 11.8], l0: [2.0, 0, -11.6], l1: [2.0, 0, -11.6] },
  { a: T.aber + 0.25, b: T.ab - 0.1, p0: [0.9, 4.2, 10.4], p1: [0.6, 4.1, 9.4], l0: [0.4, 2.7, -0.6], l1: [0.4, 2.7, -0.6] },
  { a: T.ab + 0.2, b: T.wie - 0.15, p0: [-1.0, 3.8, 11.8], p1: [-1.0, 3.7, 11.0], l0: [-1.0, 3.2, 1.6], l1: [-1.0, 3.2, 1.6] },
  { a: T.wie + 0.2, b: T.heute - 0.15, p0: [2.0, 52, 12.5], p1: [2.4, 48, 11.0], l0: [2.0, 0, -11.6], l1: [2.4, 0, -11.4] },
  { a: T.heute + 0.3, b: T.vskill - 0.15, p0: [7.7, 4.8, 3.2], p1: [8.0, 4.6, 2.4], l0: [9.6, 2.7, -6.0], l1: [9.7, 2.7, -6.2] },
  { a: T.vskill + 0.2, b: T.undIch - 0.1, p0: [7.9, 4.9, 2.9], p1: [8.2, 4.7, 2.1], l0: [9.6, 2.9, -6.0], l1: [9.7, 2.9, -6.2] },
  { a: T.undIch + 0.2, b: T.tUnd - 0.1, p0: [8.0, 4.0, 3.4], p1: [8.2, 3.9, 2.3], l0: [9.4, 2.9, -4.6], l1: [9.4, 2.9, -4.6] },
  { a: T.tUnd + 0.25, b: END, p0: [7.2, 6.4, 7.6], p1: [7.2, 6.0, 6.6], l0: [7.2, 1.6, -4.6], l1: [7.2, 1.7, -4.8] },
  { a: END + 0.35, b: AGENTS_DAY3_SECONDS, p0: [6.6, 6.2, 9.6], p1: [6.4, 6.8, 10.4], l0: [6.4, 3.4, -4.6], l1: [6.4, 3.4, -4.6] },
];
// transit control points: above the midpoint of the two holds
const VIA = HOLDS.slice(0, -1).map((h, i) => {
  const n = HOLDS[i + 1];
  const pos = lerp3(h.p1, n.p0, 0.5), look = lerp3(h.l1, n.l0, 0.5);
  return { pos: [pos[0], pos[1] + 2.2, pos[2] + 1.0] as V3, look };
});
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
const PUNCH = [T.ki, T.drei, T.stadt, T.jedes, T.mitarb, T.chaos, T.aber, T.bm, T.derArb, T.fuehrt, T.lassen, T.zwanzig, T.null, T.lass, CLICK, T.acht, T.welches, T.skillCta, T.bot, T.res, T.schreibJob];

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

const signTex = (text: string, bg: string, fg: string, border: string, w = 760, h = 190, fam = F_B) =>
  canvasTex(w, h, (c) => {
    c.fillStyle = "rgba(0,0,0,.12)"; roundRect(c, 6, 10, w - 12, h - 12, 36); c.fill();
    c.fillStyle = border; roundRect(c, 0, 0, w - 6, h - 10, 36); c.fill();
    c.fillStyle = bg; roundRect(c, 9, 9, w - 24, h - 28, 28); c.fill();
    c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle";
    fit(c, text, fam, h * 0.46, w - 90);
    c.fillText(text, (w - 6) / 2, (h - 10) / 2 + 3);
  });
const deptTex = (name: string, st: "done" | "today" | "locked", day?: number) =>
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
    c.fillText(st === "done" ? `✓ KI seit Tag ${day}` : st === "today" ? "▶ heute: Tag 3" : "🔒 noch Mensch", 444, 178);
  });
const skillTex = (name: string, on: boolean) =>
  canvasTex(900, 250, (c) => {
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 6, 12, 888, 236, 44); c.fill();
    c.fillStyle = on ? OR : "#FFFFFF"; roundRect(c, 0, 0, 888, 236, 44); c.fill();
    if (!on) { c.strokeStyle = "#E2DCD3"; c.lineWidth = 6; roundRect(c, 3, 3, 882, 230, 41); c.stroke(); }
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = on ? "#FFFFFF" : INK; fit(c, name, F_B, 84, 800); c.fillText(name, 444, 92);
    c.font = `50px ${F_B}`; c.fillStyle = on ? "rgba(255,255,255,.92)" : "#A39C90";
    c.fillText(on ? "📜 Skill = Mitarbeiter" : "📜 Skill kommt noch", 444, 178);
  });
const tagTex = (top: string, bottom: string, bg: string) =>
  canvasTex(560, 190, (c) => {
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 6, 12, 548, 176, 36); c.fill();
    c.fillStyle = bg; roundRect(c, 0, 0, 548, 176, 36); c.fill();
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = "#FFFFFF"; fit(c, top, F_B, 62, 500); c.fillText(top, 274, 64);
    c.fillStyle = "rgba(255,255,255,.88)"; fit(c, bottom, F_B, 44, 490); c.fillText(bottom, 274, 134);
  });
const card = (c: CanvasRenderingContext2D, w: number, h: number, border: string) => {
  c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, w - 16, h - 16, 40); c.fill();
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, w - 8, h - 14, 40); c.fill();
  c.strokeStyle = border; c.lineWidth = 6; roundRect(c, 3, 3, w - 14, h - 20, 37); c.stroke();
  c.textBaseline = "middle"; c.textAlign = "left";
};
// the Bürgermeister as a small pixel avatar (orange bot with top hat) for 2D cards
const mayorIcon = (c: CanvasRenderingContext2D, x: number, y: number, s: number) => {
  c.fillStyle = OR; roundRect(c, x - s * 0.42, y - s * 0.2, s * 0.84, s * 0.7, s * 0.14); c.fill();
  c.fillStyle = "#FFFFFF"; c.fillRect(x - s * 0.24, y, s * 0.15, s * 0.17); c.fillRect(x + s * 0.09, y, s * 0.15, s * 0.17);
  c.fillStyle = INK; c.fillRect(x - s * 0.3, y - s * 0.3, s * 0.6, s * 0.1); c.fillRect(x - s * 0.19, y - s * 0.62, s * 0.38, s * 0.34);
  c.fillStyle = OR_D; c.fillRect(x - s * 0.19, y - s * 0.36, s * 0.38, s * 0.06);
  c.strokeStyle = GOLD; c.lineWidth = s * 0.06; c.beginPath(); c.arc(x, y + s * 0.3, s * 0.2, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke();
};

// ---------- canvas: the skill tree (Bürgermeister-Skill on top, one skill per house below) ----------
const SHORT = ["Positionierung", "Vertrieb", "Marketing", "Support", "Buchhaltung", "Personal", "Lager"];
const drawTree = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 700;
  card(c, w, h, OR);
  const kids = DEPTS.map((d, i) => ({ n: SHORT[i], on: d.st === "done", x: i < 4 ? 125 + i * 217 : 233 + (i - 4) * 217, y: i < 4 ? 400 : 580 }));
  // lines first, nodes on top
  kids.forEach((kd, i) => {
    const k = ease((t - T.fuehrt - i * 0.09) / 0.3);
    if (k <= 0) return;
    const x1 = 450 + (kd.x - 450) * k, y1 = 196 + (kd.y - 64 - 196) * k;
    c.strokeStyle = kd.on ? OR : "#D6D2CC"; c.lineWidth = 7; c.setLineDash([16, 12]); c.lineDashOffset = -t * 60;
    c.beginPath(); c.moveTo(450, 196); c.lineTo(x1, y1); c.stroke(); c.setLineDash([]);
  });
  kids.forEach((kd, i) => {
    const k = back((t - T.fuehrt - 0.15 - i * 0.09) / 0.3);
    if (k <= 0.01) return;
    c.save(); c.translate(kd.x, kd.y); c.scale(k, k);
    c.fillStyle = kd.on ? "#FFF3EC" : "#F4F1EC"; roundRect(c, -98, -64, 196, 128, 24); c.fill();
    c.strokeStyle = kd.on ? OR : "#E2DCD3"; c.lineWidth = 4; roundRect(c, -98, -64, 196, 128, 24); c.stroke();
    if (kd.on) botTile(c, -84, -48, 46); else { c.fillStyle = "#C9C3BA"; roundRect(c, -84, -48, 46, 46, 12); c.fill(); }
    c.textAlign = "left"; c.fillStyle = INK; fit(c, "Skill", F_B, 26, 110); c.fillText("Skill", -28, -26);
    c.fillStyle = INK; fit(c, kd.n, F_B, 26, 176); c.fillText(kd.n, -84, 18);
    c.fillStyle = kd.on ? GREEN : MUTED; c.font = `22px ${F_S}`; c.fillText(kd.on ? "✓ aktiv" : "kommt noch", -84, 46);
    c.restore();
  });
  // the Bürgermeister-Skill on top
  const kTop = back((t - T.der2) / 0.35);
  if (kTop > 0.01) {
    c.save(); c.translate(450, 118); c.scale(kTop, kTop);
    c.fillStyle = OR; roundRect(c, -320, -74, 640, 148, 38); c.fill();
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(-244, 0, 50, 0, 7); c.fill(); mayorIcon(c, -244, 8, 68);
    c.fillStyle = "#FFFFFF"; c.textAlign = "left"; fit(c, "GESCHÄFTSFÜHRER-SKILL", F_B, 46, 440); c.fillText("GESCHÄFTSFÜHRER-SKILL", -178, -16);
    c.font = `28px ${F_S}`; c.fillStyle = "rgba(255,255,255,.9)"; c.fillText("arbeitet nicht · führt alle Skills", -178, 30);
    c.restore();
  }
  // "arbeitet nicht selbst": a struck-through "macht's selbst" between top node and tree
  const kNo = ease((t - T.derArb) / 0.3) * (1 - ease((t - T.fuehrt + 0.1) / 0.25));
  if (kNo > 0) {
    c.save(); c.globalAlpha = kNo; c.textAlign = "center";
    c.fillStyle = "#FDECEC"; roundRect(c, 270, 236, 360, 64, 32); c.fill();
    c.fillStyle = "#D64545"; c.font = `32px ${F_B}`; c.fillText("✕ arbeitet selbst nicht", 450, 270);
    c.restore();
  }
  c.textAlign = "left";
};
// ---------- canvas: what every house hears from the director: TUN / LASSEN ----------
const drawTL = (c: CanvasRenderingContext2D, t: number) => {
  const kT = back((t - T.tun + 0.15) / 0.3), kL = back((t - T.lassen + 0.15) / 0.3);
  c.textAlign = "center"; c.textBaseline = "middle";
  const pill = (y: number, k: number, bg: string, txt: string) => {
    if (k <= 0.01) return;
    c.save(); c.translate(400, y); c.scale(k, k);
    c.fillStyle = "rgba(0,0,0,.16)"; roundRect(c, -372, -76, 752, 160, 80); c.fill();
    c.fillStyle = bg; roundRect(c, -380, -84, 752, 160, 80); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `96px ${F_B}`; c.fillText(txt, -4, 0);
    c.restore();
  };
  pill(100, kT, GREEN, "✓ TUN");
  pill(300, kL, "#D64545", "✕ LASSEN");
  c.textAlign = "left";
};

// ---------- canvas: Vertrieb status (real numbers) ----------
const drawStatus = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 560;
  card(c, w, h, INK);
  c.fillStyle = INK; c.font = `38px ${F_B}`; c.fillText("VERTRIEB · STAND TAG 3", 44, 62);
  const rows: [string, string, string, number][] = [["LinkedIn-Nachrichten raus", "20", LI, T.zwanzig], ["Antworten", "0", "#D64545", T.null]];
  rows.forEach(([l, v, col, a], i) => {
    const k = ease((t - a + 0.05) / 0.3);
    if (k <= 0) return;
    const y = 120 + i * 170;
    c.save(); c.globalAlpha = k; c.translate(0, (1 - k) * 20);
    c.fillStyle = i ? "#FDECEC" : "#E8F1FB"; roundRect(c, 40, y, 812, 146, 30); c.fill();
    c.fillStyle = INK; c.font = `40px ${F_B}`; c.fillText(l, 76, y + 73);
    const pop = 1 + 0.35 * bump(t, a + 0.12, 0.22);
    c.save(); c.translate(760, y + 76); c.scale(pop, pop);
    c.fillStyle = col; c.font = `104px ${F_B}`; c.textAlign = "center"; c.fillText(v, 0, 4);
    c.restore();
    c.restore();
  });
  const kF = ease((t - T.null - 0.5) / 0.3);
  if (kF > 0) { c.globalAlpha = kF; c.fillStyle = MUTED; c.font = `28px ${F_S}`; c.fillText("echte Zahlen, Stand heute Morgen", 44, 500); c.globalAlpha = 1; }
};

// ---------- canvas: the Bürgermeister's direction for Vertrieb ----------
const drawPlan = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 720;
  card(c, w, h, OR);
  mayorIcon(c, 80, 66, 64);
  c.fillStyle = OR; c.font = `36px ${F_B}`; c.fillText("GESCHÄFTSFÜHRER · VERTRIEB", 140, 62);
  // the sales skill's own idea, then "Lass das"
  const k0 = ease((t - T.vskill + 0.05) / 0.3);
  if (k0 > 0) {
    const y = 110;
    c.save(); c.globalAlpha = k0;
    c.fillStyle = "#F4F1EC"; roundRect(c, 40, y, 812, 176, 28); c.fill();
    botTile(c, 66, y + 26, 74);
    c.fillStyle = MUTED; c.font = `30px ${F_S}`; c.fillText("Vertriebs-Skill will:", 162, y + 48);
    c.fillStyle = INK; c.font = `${fit(c, "20 neue Nachrichten", F_B, 48, 420)}px ${F_B}`; c.fillText("20 neue Nachrichten", 162, y + 116);
    const sw = ease((t - T.lass) / 0.3);
    if (sw > 0) { c.strokeStyle = "#D64545"; c.lineWidth = 8; c.beginPath(); c.moveTo(156, y + 116); c.lineTo(156 + (c.measureText("20 neue Nachrichten").width + 14) * sw, y + 116); c.stroke(); }
    const kS = back((t - T.lass - 0.05) / 0.3);
    if (kS > 0.01) {
      c.save(); c.translate(722, y + 92); c.rotate(-0.16); c.scale(kS, kS);
      c.strokeStyle = "#D64545"; c.lineWidth = 8; roundRect(c, -122, -46, 244, 92, 16); c.stroke();
      c.fillStyle = "#D64545"; c.font = `42px ${F_B}`; c.textAlign = "center"; c.fillText("STOPP", 0, 4);
      c.restore(); c.textAlign = "left";
    }
    c.restore();
  }
  const items: [number, string][] = [[T.fass, "Bei den 20 nachfassen"], [T.dreiTage, "In 3 Tagen · an Tag 6"], [T.grund - 0.2, "Mit einem neuen Grund"]];
  items.forEach(([a, txt], i) => {
    const k = ease((t - a + 0.05) / 0.3);
    if (k <= 0) return;
    const y = 318 + i * 128;
    c.save(); c.globalAlpha = k; c.translate((1 - k) * 30, 0);
    c.fillStyle = "#EAF6EF"; roundRect(c, 40, y, 812, 110, 26); c.fill();
    c.fillStyle = GREEN; c.beginPath(); c.arc(100, y + 55, 32, 0, 7); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `36px ${F_B}`; c.textAlign = "center"; c.fillText("✓", 100, y + 58); c.textAlign = "left";
    c.fillStyle = INK; c.font = `${fit(c, txt, F_B, 42, 640)}px ${F_B}`; c.fillText(txt, 156, y + 57);
    c.restore();
  });
};

// ---------- canvas: approval (the Bürgermeister asks, I say yes or no) ----------
const drawApprove = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 470;
  card(c, w, h, OR);
  c.fillStyle = OR_L; c.beginPath(); c.arc(84, 74, 44, 0, 7); c.fill();
  mayorIcon(c, 84, 80, 60);
  c.fillStyle = INK; c.font = `36px ${F_B}`; c.fillText("Geschäftsführer-Skill", 146, 58);
  c.fillStyle = MUTED; c.font = `26px ${F_M}`; c.fillText("KI · fragt dich", 146, 96);
  c.fillStyle = "#F4F1EC"; roundRect(c, 40, 132, 812, 132, 28); c.fill();
  c.fillStyle = INK; c.font = `34px ${F_S}`;
  c.fillText("Vertrieb: an Tag 6 bei allen 20", 70, 176); c.fillText("nachfassen, mit neuem Grund. Okay?", 70, 222);
  const done = t >= CLICK + 0.06;
  const pr = 1 - 0.08 * bump(t, CLICK, 0.12);
  c.save(); c.translate(250, 352); c.scale(pr, pr);
  c.fillStyle = done ? GREEN : OR; roundRect(c, -200, -50, 400, 100, 50); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `44px ${F_B}`; c.textAlign = "center"; c.fillText(done ? "✓ Ja, freigegeben" : "Ja", 0, 4);
  c.restore();
  c.strokeStyle = "#D6D2CC"; c.lineWidth = 4; roundRect(c, 490, 302, 360, 100, 50); c.stroke();
  c.fillStyle = done ? "#C9C3BA" : INK; c.font = `44px ${F_B}`; c.textAlign = "center"; c.fillText("Nein", 670, 356); c.textAlign = "left";
  const hs = CLICK - 0.6;
  if (t > hs && t < CLICK + 0.7) { const kk = ease((t - hs) / 0.5); cursorHand(c, 280 + (1 - kk) * 220, 372 + (1 - kk) * 80, t >= CLICK && t < CLICK + 0.14, 7); }
};

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
const Board: React.FC<{ p: V3; tex: THREE.Texture; w: number; h: number; t: number; q: THREE.Quaternion; at?: number; until?: number; bob?: number; tilt?: number; s?: number }> = ({ p, tex, w, h, t, q, at: a = -99, until = 999, bob: _bob = 0, tilt: _tilt = 0, s: sc = 1 }) => {
  const s = back((t - a) / 0.35) * (1 - ease((t - until) / 0.25)) * sc;
  if (s <= 0.001) return null;
  return (
    <group position={p} quaternion={q.clone()}>
      <group scale={[s, s, s]}>
        <mesh renderOrder={10}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} depthWrite={false} depthTest={false} />
        </mesh>
      </group>
    </group>
  );
};

// a bot (3D PixelBot). Bürgermeister = top hat + gold chain (+ clipboard on his rounds)
type BotPose = { body?: string; dark?: string; walk?: number; armL?: number; armR?: number; lift?: number; prop?: "clipboard" | "none"; talk?: boolean; vis?: number; s?: number; badge?: THREE.Texture; mayor?: boolean };
const SkBot: React.FC<{ p: V3; yaw?: number; t: number; seed?: number } & BotPose> = ({ p, yaw = 0, t, seed = 0, body = OR, dark = OR_D, walk = 0, armL = 15, armR = 15, lift = 0, prop = "none", talk, vis = 1, s = 1, badge, mayor }) => {
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
      {mayor ? (
        <>
          {/* top hat */}
          <mesh position={[0, 1.68, 0]} castShadow><cylinderGeometry args={[0.62, 0.62, 0.07, 28]} /><meshStandardMaterial color="#1E1A16" roughness={0.5} /></mesh>
          <mesh position={[0, 2.06, 0]} castShadow><cylinderGeometry args={[0.4, 0.42, 0.72, 28]} /><meshStandardMaterial color="#1E1A16" roughness={0.45} /></mesh>
          <mesh position={[0, 1.8, 0]}><cylinderGeometry args={[0.425, 0.43, 0.13, 28]} /><meshStandardMaterial color={OR_D} roughness={0.5} /></mesh>
          {/* chain of office */}
          {Array.from({ length: 9 }).map((_, i) => {
            const a = Math.PI * (0.15 + (i / 8) * 0.7);
            return <mesh key={i} position={[Math.cos(a) * 0.5, 0.82 - Math.sin(a) * 0.32 + 0.3, 0.56]}><boxGeometry args={[0.13, 0.13, 0.05]} /><meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} emissive={GOLD} emissiveIntensity={0.15} /></mesh>;
          })}
          <mesh position={[0, 0.5, 0.57]}><cylinderGeometry args={[0.15, 0.15, 0.05, 20]} /><meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} emissive={GOLD} emissiveIntensity={0.25} /></mesh>
        </>
      ) : (
        <>
          <mesh position={[0, 1.83, 0]} castShadow><boxGeometry args={[0.08, 0.42, 0.08]} /><meshStandardMaterial color="#2C2420" /></mesh>
          <mesh position={[0, 2.08, 0]} castShadow><boxGeometry args={[0.22, 0.22, 0.22]} /><meshStandardMaterial color="#F5C542" emissive="#F5C542" emissiveIntensity={0.35 + 0.35 * Math.max(0, Math.sin(t * 6 + seed))} /></mesh>
        </>
      )}
      {arm(-1, armL)}
      {arm(1, armR, prop === "clipboard" ? (
        <group rotation={[-0.4, 0, -0.5]}>
          <ToyBox p={[0, -0.1, 0.12]} s={[0.5, 0.64, 0.05]} color="#8A5A35" />
          <ToyBox p={[0, -0.12, 0.15]} s={[0.42, 0.52, 0.02]} color="#FFFFFF" />
          <ToyBox p={[0, 0.2, 0.16]} s={[0.2, 0.08, 0.04]} color="#B9B1A6" />
        </group>
      ) : undefined)}
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

// Chefbüro → Rathaus: roof flips orange when the KI moves in, the sign changes at "Bürgermeister"
const HQBuilding: React.FC<{ t: number; tex: Tex }> = ({ t, tex }) => {
  const glow = bump(t, T.bm + 0.1, 0.6) + bump(t, T.ki + 0.1, 0.4);
  const orange = t > T.ki + 0.05;
  const pop = 1 + 0.15 * bump(t, T.ki + 0.1, 0.2) + 0.18 * bump(t, T.bm + 0.1, 0.25);
  const rathaus = t > T.bm + 0.05;
  return (
    <group position={[0, 0.4, -1.2]} scale={[pop, pop, pop]}>
      <ToyBox p={[0, 1.1, 0]} s={[3.2, 2.2, 2.2]} color="#FFFFFF" top="#FFFFFF" />
      <mesh position={[0, 2.75, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.55, 1.3, 4]} />
        <meshStandardMaterial color={orange ? OR : "#CFC6BA"} roughness={0.6} flatShading />
      </mesh>
      <ToyBox p={[0, 0.55, 1.11]} s={[0.6, 1.1, 0.05]} color="#8A5A35" />
      {[-1.0, 1.0].map((x) => <ToyBox key={x} p={[x, 1.35, 1.11]} s={[0.6, 0.55, 0.05]} color="#BFE3F2" emissive="#FFE6B0" ei={0.3 + glow} />)}
      <group position={[0, 1.95, 1.16]}>
        <ToyBox p={[0, 0, -0.03]} s={[2.5, 0.5, 0.06]} color={rathaus ? GOLD : INK} />
        <mesh position={[0, 0, 0.01]}><planeGeometry args={[2.44, 0.44]} /><meshBasicMaterial map={rathaus ? tex.rathausSign : tex.hqSign} toneMapped={false} /></mesh>
      </group>
      {rathaus && (
        <group position={[0.9, 3.2, 0]}>
          <ToyBox p={[0, 0.6, 0]} s={[0.08, 1.2, 0.08]} color="#2C2420" />
          <group rotation={[0, Math.sin(t * 5) * 0.25, 0]}><ToyBox p={[0.38, 1.0, 0]} s={[0.7, 0.42, 0.04]} color={GOLD} /></group>
        </group>
      )}
      <pointLight position={[0, 1.6, 2.2]} intensity={6 * glow} distance={6} color="#FFB48A" />
    </group>
  );
};

// a department house: green roof + flag = KI, grey + padlock = still human. Checked on the Bürgermeister's round.
const DeptHouse: React.FC<{ d: Dept; i: number; t: number; plate: THREE.Texture }> = ({ d, i, t, plate }) => {
  const st = d.st;
  const roof = st === "done" ? GREEN : "#CFC6BA";
  const chk = T.sagt + ROUND.indexOf(i) * 0.12;
  const pop = 1 + 0.08 * bump(t, T.stadt + i * 0.12, 0.25) + 0.16 * bump(t, chk, 0.2) + (i === 1 ? 0.2 * bump(t, T.vertrieb + 0.1, 0.3) + 0.15 * bump(t, T.lass + 0.05, 0.3) : 0) + 0.06 * bump(t, T.jedes + 0.1 + i * 0.1, 0.25);
  const lit = st !== "locked";
  const lockK = st === "locked" ? ease((t - T.abteilung) / 0.4) : 0;
  return (
    <group position={d.p} rotation={[0, d.yaw, 0]}>
      <ToyBox p={[0, 0.06, 0]} s={[3.8, 0.12, 3.6]} color={st === "done" ? "#DDF3E6" : "#E7E1D8"} />
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
          <group position={[0, 3.45 + Math.sin(t * 2 + i) * 0.06, 0]} rotation={[0, 0, Math.sin(t * 22 + i) * 0.25 * bump(t, T.abteilung + 0.2 + i * 0.06, 0.4)]} scale={[lockK * 1.3, lockK * 1.3, lockK * 1.3]}>
            <ToyBox p={[0, 0, 0]} s={[0.9, 0.72, 0.36]} color="#B9B1A6" />
            <mesh position={[0, 0.45, 0]}><torusGeometry args={[0.28, 0.08, 8, 20, Math.PI]} /><meshStandardMaterial color="#8A857D" /></mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// the market around Vertrieb's lot; the 20 houses messaged on Tag 2 keep their blue roofs
const HOUSE_N = 40;
const HOUSES = (() => {
  const out: { x: number; z: number; yaw: number; s: number; pick: number }[] = [];
  for (let i = 0; out.length < HOUSE_N && i < 4000; i++) {
    const a = i * 2.39996, r = 3.95 + Math.sqrt(i) * 0.42;
    const x = I2[0] + Math.cos(a) * r, z = I2[2] + Math.sin(a) * r;
    if (Math.hypot(x - D0[0], z - D0[2]) < 6.7) continue;
    if (DEPTS.some((d) => Math.hypot(x - d.p[0], z - d.p[2]) < 3.4)) continue;
    if (z > -8.2) continue;
    out.push({ x, z, yaw: (rnd(i + 5) - 0.5) * 0.8, s: 0.9 + rnd(i + 9) * 0.25, pick: rnd(i * 7 + 1) });
  }
  return out;
})();
const TOP20 = HOUSES.map((h, j) => ({ j, p: h.pick })).sort((a, b) => b.p - a.p).slice(0, 20).map((x) => x.j);
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
    const s = h.s * (1 + (ti >= 0 ? 0.25 * bump(t, T.zwanzig + 0.05 + ti * 0.025, 0.2) : 0));
    e.set(0, h.yaw, 0); q.setFromEuler(e);
    m.compose(new THREE.Vector3(h.x, 0, h.z), q, new THREE.Vector3(s, s, s));
    body.setMatrixAt(i, m.clone().multiply(off.makeTranslation(0, 0.28, 0)));
    roof.setMatrixAt(i, m.clone().multiply(off.makeTranslation(0, 0.8, 0)));
    door.setMatrixAt(i, m.clone().multiply(off.makeTranslation(0, 0.14, 0.36)));
    roof.setColorAt(i, col.set(ti >= 0 ? LI : "#CFC6BA"));
  });
  [body, roof, door].forEach((x) => { x.instanceMatrix.needsUpdate = true; });
  if (roof.instanceColor) roof.instanceColor.needsUpdate = true;
  return <><primitive object={body} /><primitive object={roof} /><primitive object={door} /></>;
};

// ---------- motion ----------
type K = { a: number; b: number; p: V3; yaw: number; walk?: boolean };
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
// Bürgermeister: walks to the Chefbüro door (hook), stands on the plaza, then his morning round ends at Vertrieb
const MAYOR_KEYS: K[] = [
  { a: 0, b: 0.05, p: [3.6, 0.4, 0.4], yaw: -1.2 },
  { a: T.chefbuero + 0.2, b: T.wie - 0.1, p: [1.8, 0.4, 1.5], yaw: -0.2, walk: true },
  { a: T.wie + 0.3, b: T.heute, p: [0.0, 0.4, 2.6], yaw: 0, walk: true },
  { a: T.vertrieb + 0.6, b: T.tUnd + 0.02, p: [VERT_FRONT[0] - 1.6, 0, VERT_FRONT[2] + 0.9], yaw: DEPTS[1].yaw + 0.3, walk: true },
  { a: T.tUnd + 0.07, b: 99, p: [7.2, 0, -8.4], yaw: 0 },
];
const mayorWander = (tt: number): V3 => seg(tt, T.schreib, 99, (u) => [Math.sin(u * 1.0) * 0.5, 0, 0]);
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

  const my = botMotion(MAYOR_KEYS, mayorWander, t);
  let armL = 15 + 8 * Math.sin(t * 3), armR = 15 - 8 * Math.sin(t * 3), lift = 0;
  let prop: BotPose["prop"] = "none";
  const cheer = (a: number, h = 1.0) => { if (t > a - 0.1 && t < a + 0.6) { armL = armR = 160; lift = Math.max(0, Math.sin(((t - a + 0.1) / 0.6) * Math.PI)) * h; } };
  if (my.hopping) armL = armR = 150;
  else if (t < T.tag) { cheer(T.ki + 0.05, 0.7); }
  else if (t < T.wie) { cheer(T.bm + 0.1, 1.1); }
  else if (t < T.heute) { armR = 110 + 35 * Math.sin(t * 5); armL = 110 - 35 * Math.sin(t * 5 + 1); }
  else if (t < T.undIch) { prop = "clipboard"; armR = 70; armL = 20; if (t > T.bmSagt && t < T.lass + 0.6) armL = 165; }
  else if (t < T.acht) { armR = 90 + 20 * Math.sin(t * 6); }
  else if (t < T.und5) { prop = "clipboard"; armR = 70; }
  else { armL = armR = 30; cheer(T.claude + 0.2, 0.6); }
  const camD = Math.hypot(cam.pos[0] - my.p[0], cam.pos[1] - my.p[1] - 1, cam.pos[2] - my.p[2]);
  const mayorVis = cl((camD - 2.0) / 1.5) * back((t + 0.02) / 0.35);
  const a2Arm = t > T.vskill && t < T.lass ? 150 : t > T.lass && t < T.lass + 0.8 ? 40 : 20;

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

      {/* streets: plaza → every department; while the Bürgermeister directs they light up gold, one after the other */}
      {DEPTS.flatMap((d, j) => {
        const a = HQ, b = d.p;
        const dd = Math.hypot(b[0] - a[0], b[2] - a[2]);
        const n = Math.floor(dd / 0.9);
        const chk = T.sagt + ROUND.indexOf(j) * 0.12;
        return Array.from({ length: n }).map((_, i) => {
          const k = (i + 0.5) / n;
          const px = a[0] + (b[0] - a[0]) * k, pz = a[2] + (b[2] - a[2]) * k;
          if (Math.hypot(px, pz) < 4.4 || Math.hypot(px - b[0], pz - b[2]) < 2.3) return null;
          if (j !== 0 && Math.hypot(px - D0[0], pz - D0[2]) < 6.3) return null;
          if (Math.hypot(px - I2[0], pz - I2[2]) < 3.6) return null;
          const round = t > chk - 0.4 + k * 0.3 && t < T.heute + 0.3;
          const on = d.st === "done" || round;
          return (
            <mesh key={`${j}-${i}`} position={[px, 0.03, pz]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.42, 0.42]} />
              <meshBasicMaterial color={round ? GOLD : on ? GREEN : "#D9D1C6"} transparent opacity={on ? 0.35 + 0.5 * Math.max(0, Math.sin(t * 4 - i * 0.6)) : 0.7} toneMapped={false} />
            </mesh>
          );
        });
      })}

      {/* plaza + Chefbüro → Rathaus */}
      <Island p={HQ} r={4.2} t={t} active={t > T.bm} />
      <HQBuilding t={t} tex={tex} />
      <Burst3D at={T.ki + 0.1} t={t} p={[0, 3.6, -1.2]} colors={[OR, "#FFFFFF", YEL]} n={18} power={0.9} floor={0.5} />
      <Burst3D at={T.bm + 0.1} t={t} p={[0, 3.6, 0.4]} colors={[GOLD, OR, "#FFFFFF"]} n={26} power={1.2} floor={0.5} />
      <Board p={[0, 4.4, -0.4]} tex={tex.hookSign} w={3.6} h={0.9} t={t} q={q} at={T.chefbuero - 0.1} until={T.tag - 0.1} tilt={0.04} />
      <Board p={[0, 4.35, 0.2]} tex={tex.who} w={3.9} h={0.98} t={t} q={q} at={T.aber + 0.15} until={T.ab - 0.1} tilt={-0.04} />
      {/* Tag 1 + Tag 2 lots */}
      <Island p={D0} r={6.2} t={t} done />
      <SkBot p={[-3.4, 0.4, -10.0]} yaw={0.5} t={t} seed={2} s={0.8} badge={tex.badge1} />
      <Monitor p={[-5, 3.6, -14.6]} w={5.2} h={3.25} tex={tex.doneSite} />
      {[-2.2, 2.2].map((x) => <ToyBox key={x} p={[-5 + x, (3.6 - 3.25 / 2) / 2 + 0.2, -14.6 - 0.25]} s={[0.24, 3.6 - 3.25 / 2, 0.24]} color="#2A2622" />)}
      <Island p={I2} r={3.4} t={t} done />
      <Houses t={t} />
      {DEPTS.map((d, i) => <DeptHouse key={d.n} d={d} i={i} t={t} plate={tex[`plate${i}`]} />)}
      {/* Agent 2 = the sales skill, waits in front of Vertrieb and pitches "20 new ones" */}
      <SkBot p={[VERT_FRONT[0] + 0.9, 0, VERT_FRONT[2] - 0.2]} yaw={DEPTS[1].yaw - 0.3} t={t} seed={4} s={0.8} badge={tex.badge2} armL={20} armR={t > T.null && t < T.null + 0.6 ? 100 : a2Arm} talk={t > T.vskill && t < T.bmSagt} />

      {/* overview: every house gets its sign, then its own skill */}
      <Board p={[0, 6.0, -1.2]} tex={tex.deptHQ} w={7.2} h={2.0} t={t} q={q} at={T.stadt} until={T.aber - 0.1} bob={0.03} />
      {DEPTS.map((d, i) => <Board key={d.n} p={[d.p[0], 5.6, d.p[2]]} tex={tex[`dept${i}`]} w={7.2} h={2.0} t={t} q={q} at={T.stadt + 0.1 + i * 0.12} until={T.jedes + i * 0.1} bob={0.03} />)}
      {DEPTS.map((d, i) => <Board key={`s${d.n}`} p={[d.p[0], 5.6, d.p[2]]} tex={tex[`skill${i}`]} w={7.2} h={2.0} t={t} q={q} at={T.jedes + 0.1 + i * 0.1} until={T.aber - 0.1} bob={0.03} />)}

      {/* the Bürgermeister-Skill on top of all skills */}
      <Board p={[-1.0, 3.4, 1.6]} tex={dyn.tree} w={3.9} h={3.03} t={t} q={q} at={T.der2 - 0.05} until={T.wie - 0.05} bob={0.03} />
      {/* 7 skills, nobody leads: chaos */}
      <Board p={[2.0, 9.0, -9.0]} tex={tex.chaos} w={13} h={2.6} t={t} q={q} at={T.sieben} until={T.aber - 0.1} tilt={-0.05} />

      {/* Regisseur: every house hears TUN / LASSEN */}
      <Board p={[0, 7.0, 0.6]} tex={tex.regie} w={10.5} h={1.86} t={t} q={q} at={T.regisseur - 0.1} until={T.heute - 0.05} tilt={0.02} />
      {DEPTS.map((d, i) => <Board key={`tl${i}`} p={[d.p[0], 5.2, d.p[2]]} tex={dyn.tl} w={4.8} h={2.4} t={t} q={q} at={T.sagt + ROUND.indexOf(i) * 0.12} until={T.heute - 0.05} bob={0.04} />)}

      {/* Vertrieb: real status, then the direction */}
      <Board p={[9.5, 3.75, -5.4]} tex={dyn.status} w={3.5} h={2.18} t={t} q={q} at={T.vertrieb - 0.1} until={T.vskill + 0.1} bob={0.03} />
      <Board p={[9.5, 4.05, -5.4]} tex={dyn.plan} w={3.5} h={2.8} t={t} q={q} at={T.vskill} until={T.undIch + 0.1} bob={0.03} />
      <Board p={[8.6, 1.95, -4.2]} tex={tex.cut} w={2.4} h={0.6} t={t} q={q} at={T.lass - 0.05} until={T.fass + 0.7} tilt={-0.06} />
      <Burst3D at={T.lass + 0.05} t={t} p={[8.8, 2.0, -4.6]} colors={["#D64545", "#FFFFFF", OR]} n={12} power={0.6} floor={0.3} />
      {/* the direction gets pinned to the house */}
      {t > T.grund && (() => {
        const k = back((t - T.grund) / 0.3);
        const ff = fwd(DEPTS[1].yaw, 1.15);
        return (
          <group position={[VERT[0] + ff[0] - 0.55, 1.15, VERT[2] + ff[1] + 0.3]} rotation={[0, DEPTS[1].yaw, 0.05]} scale={[k, k, k]}>
            <mesh><planeGeometry args={[1.3, 1.0]} /><meshBasicMaterial map={tex.sticky} toneMapped={false} side={THREE.DoubleSide} /></mesh>
          </group>
        );
      })()}
      {/* approval */}
      <Board p={[9.4, 3.45, -4.6]} tex={dyn.approve} w={3.4} h={1.78} t={t} q={q} at={T.undIch + 0.05} until={T.acht - 0.05} bob={0.02} />
      <Burst3D at={CLICK + 0.08} t={t} p={[8.9, 2.6, -4.3]} colors={[GREEN, "#FFFFFF", GOLD]} n={14} power={0.6} floor={0.4} />

      {/* residents: the first 8 real commenters move in, no job yet */}
      {RES.map((r, i) => {
        const k = back((t - T.res + 0.25 - i * 0.07) / 0.35);
        if (t < T.res - 0.35) return null;
        const at = T.res + i * 0.12;
        const drop = Math.max(0, 1 - (t - at) / 0.45);
        const hop = t > T.wohnen + 0.3 + i * 0.05 && t < T.wohnen + 0.9 + i * 0.05 ? Math.sin(((t - T.wohnen - 0.3 - i * 0.05) / 0.6) * Math.PI) * 0.4 : 0;
        return (
          <group key={i}>
            <group position={r} scale={[k, k, k]}>
              <ToyBox p={[0, 0.05, 0]} s={[1.5, 0.1, 1.5]} color="#FFF3C4" />
              {[[-0.7, 0], [0.7, 0], [0, -0.7], [0, 0.7]].map(([x, z], j) => <ToyBox key={j} p={[x, 0.13, z]} s={[x ? 0.08 : 1.48, 0.06, z ? 0.08 : 1.48]} color={GOLD} />)}
            </group>
            {t > at - 0.05 && <SkBot p={[r[0], 0.1 + drop * drop * 6, r[2]]} yaw={(rnd(i) - 0.5) * 0.5} t={t} seed={10 + i} body={YEL} dark="#D9A520" s={0.55} armL={drop > 0 ? 150 : 20 + (hop ? 140 : 0)} armR={drop > 0 ? 150 : 20 + (hop ? 140 : 0)} lift={hop} />}
            <Board p={[r[0], i < 4 ? 1.7 : 1.95, r[2]]} tex={tex[`res${i}`]} w={1.55} h={0.53} t={t} q={q} at={at + 0.3} bob={0.02} />
          </group>
        );
      })}
      {RES.map((r, i) => <Burst3D key={i} at={T.res + i * 0.12 + 0.45} t={t} p={[r[0], 0.6, r[2]]} colors={[YEL, "#FFFFFF", OR]} n={8} power={0.45} floor={0.15} />)}
      {/* CTA: the Geschäftsführer-Skill for your own Claude → comment "Chef" → DM */}
      <Board p={[9.4, 3.6, -4.6]} tex={dyn.offer} w={3.6} h={1.76} t={t} q={q} at={T.acht + 0.5} until={T.schreib - 0.05} bob={0.03} />
      <Board p={[9.4, 3.5, -4.6]} tex={dyn.comment} w={3.6} h={1.16} t={t} q={q} at={T.schreib - 0.05} until={T.skillCta + 0.05} bob={0.03} />
      <Board p={[9.4, 3.6, -4.6]} tex={dyn.dm} w={3.6} h={1.76} t={t} q={q} at={T.skillCta} until={T.tUnd + 0.1} />
      {/* ... and you move in as a bot, next to the 8 real Tag-1 commenters */}
      {t > T.bot - 0.1 && (() => {
        const drop = Math.max(0, 1 - (t - T.bot) / 0.45);
        const k = back((t - T.bot + 0.2) / 0.35);
        return (
          <group>
            <group position={DU_P} scale={[k, k, k]}>
              <ToyBox p={[0, 0.05, 0]} s={[1.5, 0.1, 1.5]} color={OR_L} />
              {[[-0.7, 0], [0.7, 0], [0, -0.7], [0, 0.7]].map(([x, z], j) => <ToyBox key={j} p={[x, 0.13, z]} s={[x ? 0.08 : 1.48, 0.06, z ? 0.08 : 1.48]} color={OR} />)}
            </group>
            <SkBot p={[DU_P[0], 0.1 + drop * drop * 6, DU_P[2]]} yaw={0} t={t} seed={30} body={YEL} dark="#D9A520" s={0.6} armL={drop > 0 ? 150 : 150} armR={drop > 0 ? 150 : 30} />
            <Board p={[DU_P[0], 1.8, DU_P[2]]} tex={tex.duTag} w={1.7} h={0.58} t={t} q={q} at={T.bot + 0.3} />
          </group>
        );
      })()}
      <Burst3D at={T.bot + 0.45} t={t} p={[DU_P[0], 0.6, DU_P[2]]} colors={[OR, "#FFFFFF", YEL]} n={14} power={0.6} floor={0.15} />
      <Board p={[RES_C[0], 3.4, RES_C[2] - 0.6]} tex={tex.welcome} w={4.5} h={1.3} t={t} q={q} at={T.res + 0.15} until={T.schreibJob - 0.05} />
      <Board p={[RES_C[0], 3.4, RES_C[2] - 0.6]} tex={tex.jobs} w={4.5} h={1.3} t={t} q={q} at={T.schreibJob} until={END + 0.2} />
      <Burst3D at={T.skillCta + 0.1} t={t} p={[9.2, 3.6, -4.2]} colors={[OR, "#FFFFFF", GOLD]} n={18} power={0.9} floor={0.5} />
      <Board p={[6.4, 4.7, -3.6]} tex={tex.tomorrow} w={5.6} h={1.87} t={t} q={q} at={END + 0.15} />

      <SkBot p={my.p} yaw={my.yaw} t={t} seed={1} walk={my.walk} armL={Math.round(armL)} armR={Math.round(armR)} lift={lift} prop={prop} talk={(t > T.der2 && t < T.wie) || (t > T.bmSagt && t < T.grund + 0.3)} vis={mayorVis} s={1.0} mayor />
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
    const plate = (s: string, bg = INK, fg = "#FFFFFF") => canvasTex(620, 112, (c) => { c.fillStyle = bg; c.fillRect(0, 0, 620, 112); c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle"; fit(c, s, F_B, 60, 580); c.fillText(s, 310, 60); });
    t.hqSign = plate("CHEFBÜRO");
    t.rathausSign = plate("GESCHÄFTSFÜHRUNG", GOLD, INK);
    DEPTS.forEach((d, i) => {
      t[`plate${i}`] = plate(d.n);
      t[`dept${i}`] = deptTex(d.n, d.st, d.day);
    });
    t.deptHQ = deptTex("CHEFBÜRO", "today");
    t.hookSign = signTex("KI ÜBERNIMMT ALLES", OR, "#FFFFFF", OR_D, 900, 220);
    t.bmSign = signTex("🎩 BÜRGERMEISTER: KI", INK, "#FFFFFF", GOLD, 900, 220);
    t.question = signTex("WAS IST HEUTE DAS WICHTIGSTE?", "#FFFFFF", INK, GOLD, 1300, 230);
    t.chk = canvasTex(256, 256, (c) => { c.fillStyle = GOLD; c.beginPath(); c.arc(128, 128, 110, 0, 7); c.fill(); c.strokeStyle = "#FFFFFF"; c.lineWidth = 12; c.stroke(); c.fillStyle = "#FFFFFF"; c.font = `130px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("✓", 128, 138); });
    t.chkStar = canvasTex(256, 256, (c) => { c.fillStyle = OR; c.beginPath(); c.arc(128, 128, 110, 0, 7); c.fill(); c.strokeStyle = "#FFFFFF"; c.lineWidth = 12; c.stroke(); c.fillStyle = "#FFFFFF"; c.font = `140px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("!", 128, 136); });
    t.sticky = canvasTex(520, 400, (c) => {
      c.fillStyle = "#FFE27A"; c.fillRect(0, 0, 520, 400);
      c.fillStyle = "rgba(0,0,0,.08)"; c.fillRect(0, 360, 520, 40);
      c.fillStyle = "#D9A520"; c.fillRect(200, 0, 120, 26);
      c.fillStyle = INK; c.textAlign = "center"; c.textBaseline = "middle";
      c.font = `40px ${F_B}`; c.fillText("TUN · TAG 6", 260, 92);
      c.font = `58px ${F_B}`; c.fillText("Bei allen 20", 260, 196); c.fillText("nachfassen", 260, 268);
      c.font = `30px ${F_S}`; c.fillStyle = "#6B5420"; c.fillText("– der Geschäftsführer", 260, 336);
    });
    RESIDENTS.forEach((n, i) => { t[`res${i}`] = tagTex("@" + n, "Job: ?", "#D9A520"); });
    t.duTag = tagTex("DU", "ab morgen", OR);
    t.welcome = canvasTex(1000, 290, (c) => {
      c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 984, 274, 40); c.fill();
      c.fillStyle = INK; roundRect(c, 0, 0, 990, 278, 40); c.fill();
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillStyle = YEL; c.font = `44px ${F_B}`; c.fillText("WOHNEN SCHON HIER", 495, 78);
      c.fillStyle = "#FFFFFF"; fit(c, "8 von euch · noch ohne Job", F_B, 66, 900); c.fillText("8 von euch · noch ohne Job", 495, 176);
    });
    t.jobs = canvasTex(1000, 290, (c) => {
      c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 984, 274, 40); c.fill();
      c.fillStyle = INK; roundRect(c, 0, 0, 990, 278, 40); c.fill();
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillStyle = OR; c.font = `44px ${F_B}`; c.fillText("KOMMENTIER DEINEN JOB", 495, 78);
      c.fillStyle = "#FFFFFF"; c.font = `${fit(c, "Vertrieb · Marketing · Support · Personal", F_B, 60, 920)}px ${F_B}`; c.fillText("Vertrieb · Marketing · Support · Personal", 495, 176);
    });
    t.morgenEin = signTex("MORGEN: EINTEILUNG", INK, "#FFFFFF", GOLD, 760, 180);
    t.doneSite = canvasTex(1200, 750, (c) => {
      c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, 1200, 750);
      c.fillStyle = INK; c.font = `34px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Wärmepumpe Umland", 50, 56);
      c.fillStyle = INK; c.font = `84px ${F_B}`; c.fillText("Wärmepumpe in 3 Tagen.", 50, 250); c.fillText("Zum Festpreis.", 50, 350);
      c.fillStyle = OR; roundRect(c, 50, 420, 380, 92, 46); c.fill();
      c.fillStyle = "#FFFFFF"; c.font = `34px ${F_B}`; c.fillText("Angebot anfragen", 92, 468);
    });
    t.tomorrow = canvasTex(1200, 400, (c) => {
      c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 1184, 384, 44); c.fill();
      c.fillStyle = INK; roundRect(c, 0, 0, 1190, 388, 44); c.fill();
      c.textBaseline = "middle"; c.textAlign = "center";
      c.fillStyle = OR; c.font = `46px ${F_B}`; c.fillText("AB MORGEN · TAG 4", 595, 74);
      c.fillStyle = "#FFFFFF"; c.font = `${fit(c, "Ihr zieht ein und kriegt Jobs", F_B, 82, 1100)}px ${F_B}`; c.fillText("Ihr zieht ein und kriegt Jobs", 595, 170);
      c.fillStyle = YEL; c.font = `${fit(c, "Kommentier „Chef“ + deinen Job", F_B, 52, 1100)}px ${F_B}`; c.fillText("Kommentier „Chef“ + deinen Job", 595, 290);
    });
    DEPTS.forEach((d, i) => { t[`skill${i}`] = skillTex(d.n, d.st === "done"); });
    t.regie = signTex("👔 DER GESCHÄFTSFÜHRER FÜHRT", INK, "#FFFFFF", GOLD, 1400, 248);
    t.who = signTex("❓ WER SAGT, WAS ZÄHLT?", INK, "#FFFFFF", GOLD, 900, 220);
    t.gift = signTex("🎁 AM ENDE FÜR DICH", GOLD, INK, OR_D, 900, 220);
    t.noSelf = signTex("✕ ARBEITET NICHT SELBST", "#D64545", "#FFFFFF", INK, 900, 220);
    t.chaos = signTex("⚠️ JEDER MACHT SEIN DING", "#D64545", "#FFFFFF", INK, 1200, 240);
    t.cut = signTex("✋ STOPP! BRINGT NICHTS", "#D64545", "#FFFFFF", INK, 760, 190);
    const badge = (n: string) => canvasTex(128, 128, (c) => { c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill(); c.fillStyle = OR; c.font = `84px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(n, 64, 70); });
    t.badge1 = badge("1"); t.badge2 = badge("2");
    return t;
  }, [ready]);

const COMMENT = "Chef";
const useDynTex = (t: number, logo: HTMLImageElement | null, claude: HTMLImageElement | null) => {
  const tree = useDyn(900, 700, (c) => drawTree(c, t));
  const tl = useDyn(800, 400, (c) => drawTL(c, t));
  const status = useDyn(900, 560, (c) => drawStatus(c, t));
  const plan = useDyn(900, 720, (c) => drawPlan(c, t));
  const approve = useDyn(900, 470, (c) => drawApprove(c, t));
  const offer = useDyn(900, 440, (c) => {
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 884, 424, 36); c.fill();
    c.fillStyle = INK; roundRect(c, 0, 0, 892, 428, 36); c.fill();
    c.fillStyle = OR; roundRect(c, 44, 44, 150, 186, 22); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `40px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("SKILL", 119, 120); c.font = `30px ${F_B}`; c.fillText(".md", 119, 170);
    c.textAlign = "left"; c.fillStyle = GOLD; c.font = `30px ${F_B}`; c.fillText("FÜR DEIN EIGENES CLAUDE", 228, 70);
    c.fillStyle = "#FFFFFF"; c.font = `${fit(c, "Geschäftsführer-Skill", F_B, 62, 620)}px ${F_B}`; c.fillText("Geschäftsführer-Skill", 228, 140);
    c.fillStyle = "rgba(255,255,255,.75)"; c.font = `32px ${F_S}`; c.fillText("arbeitet nicht selbst, führt den Rest", 228, 200);
    const k = ease((t - T.offerFuehrt) / 0.3);
    const rows = ["Vertrieb", "Marketing", "Support", "Personal"];
    rows.forEach((r, i) => {
      const kk = ease((t - T.offerFuehrt - i * 0.08) / 0.25) * k;
      if (kk <= 0) return;
      c.save(); c.globalAlpha = kk;
      const x = 44 + i * 206;
      c.fillStyle = "rgba(255,255,255,.1)"; roundRect(c, x, 280, 190, 104, 22); c.fill();
      c.fillStyle = GREEN; c.font = `30px ${F_B}`; c.fillText("✓", x + 18, 334);
      c.fillStyle = "#FFFFFF"; c.font = `${fit(c, r, F_B, 30, 130)}px ${F_B}`; c.fillText(r, x + 50, 334);
      c.restore();
    });
  });
  const comment = useDyn(900, 290, (c) => {
    const n = Math.max(0, Math.floor((t - T.welches + 0.1) * 16));
    const done = t >= T.und5;
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 884, 274, 36); c.fill();
    c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 892, 278, 36); c.fill();
    c.fillStyle = INK; c.font = `38px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Schreib in die Kommentare:", 40, 54);
    c.strokeStyle = done ? GREEN : OR; c.lineWidth = 7; roundRect(c, 30, 100, 832, 148, 74); c.stroke();
    c.fillStyle = OR_L; c.beginPath(); c.arc(110, 174, 46, 0, 7); c.fill();
    c.fillStyle = OR; c.font = `32px ${F_B}`; c.textAlign = "center"; c.fillText("DU", 110, 176);
    c.textAlign = "left"; c.fillStyle = INK; c.font = `${fit(c, COMMENT, F_B, 60, 520)}px ${F_B}`; c.fillText(COMMENT.slice(0, n) + (done || Math.floor(t * 3) % 2 ? "" : "|"), 184, 178);
    c.fillStyle = done ? GREEN : OR; c.beginPath(); c.arc(784, 174, 50, 0, 7); c.fill();
    c.strokeStyle = "#FFFFFF"; c.lineWidth = 8; c.beginPath(); c.moveTo(784, 196); c.lineTo(784, 152); c.moveTo(766, 170); c.lineTo(784, 152); c.lineTo(802, 170); c.stroke();
    if (done) { c.fillStyle = GREEN; roundRect(c, 640, 20, 222, 58, 29); c.fill(); c.fillStyle = "#FFFFFF"; c.font = `28px ${F_B}`; c.fillText("✓ gesendet", 668, 50); }
  });
  const dm = useDyn(900, 440, (c) => {
    const file = ease((t - T.skillCta - 0.05) / 0.3);
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 884, 424, 36); c.fill();
    c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 892, 428, 36); c.fill();
    c.fillStyle = OR; c.beginPath(); c.arc(70, 64, 32, 0, 7); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `30px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("F", 70, 66);
    c.textAlign = "left"; c.fillStyle = INK; c.font = `36px ${F_B}`; c.fillText("florent_preusser", 120, 52);
    c.fillStyle = MUTED; c.font = `26px ${F_M}`; c.fillText("Direktnachricht · jetzt", 120, 88);
    c.fillStyle = "#F1EEEA"; roundRect(c, 40, 124, 700, 84, 42); c.fill();
    c.fillStyle = INK; c.font = `36px ${F_S}`; c.fillText("Hier ist dein Geschäftsführer-Skill:", 76, 168);
    if (file > 0) {
      c.save(); c.globalAlpha = file; c.translate(0, (1 - file) * 24);
      c.fillStyle = OR_L; roundRect(c, 40, 232, 812, 164, 32); c.fill();
      c.strokeStyle = OR; c.lineWidth = 5; roundRect(c, 40, 232, 812, 164, 32); c.stroke();
      c.fillStyle = OR; roundRect(c, 70, 258, 92, 112, 14); c.fill();
      c.fillStyle = "#FFFFFF"; c.font = `26px ${F_B}`; c.textAlign = "center"; c.fillText("SKILL", 116, 304); c.font = `20px ${F_B}`; c.fillText(".md", 116, 336);
      c.textAlign = "left"; c.fillStyle = INK; c.font = `42px ${F_B}`; c.fillText("Geschäftsführer-Skill", 190, 292);
      c.fillStyle = OR_D; c.font = `30px ${F_S}`; c.fillText("für", 190, 346);
      const s1 = ease((t - T.superkind) / 0.25), s2 = ease((t - T.claude) / 0.25);
      if (s1 > 0) { c.globalAlpha = file * s1; if (logo) c.drawImage(logo, 246, 326, 40, 40); c.fillStyle = INK; c.font = `30px ${F_B}`; c.fillText("Superkind", 294, 347); }
      if (s2 > 0) { c.globalAlpha = file * s2; c.fillStyle = OR_D; c.font = `30px ${F_S}`; c.fillText("oder", 452, 346); if (claude) c.drawImage(claude, 522, 326, 40, 40); c.fillStyle = INK; c.font = `30px ${F_B}`; c.fillText("Claude", 570, 347); }
      c.restore();
    }
  });
  return { tree, tl, status, plan, approve, offer, comment, dm };
};

// ---------- 2D: captions + the series frame (scoreboard) ----------
const SK_THEME: PixelTheme = { bg: "#F3EEE7", bgPattern: "none" as PixelTheme["bgPattern"], floor: "#FFFFFF", floorLine: OR, accent: OR, dark: INK, gold: "#FFFFFF", green: OR, cream: "#FFFFFF", ink: INK };
const Pill: React.FC<{ k: number; bg?: string; color?: string; children: React.ReactNode; big?: boolean; shake?: number }> = ({ k, bg = "rgba(255,255,255,.95)", color = INK, children, big, shake = 0 }) => (
  <div style={{ opacity: k, transform: `translateY(${(1 - k) * -16}px) scale(${0.85 + 0.15 * k}) translateX(${Math.sin(shake * 40) * 8 * shake}px)`, background: bg, color, borderRadius: 999, padding: big ? "14px 30px" : "10px 20px", boxShadow: "0 8px 24px rgba(40,24,10,.16)", fontFamily: F_B, fontSize: big ? 38 : 28, whiteSpace: "nowrap" }}>{children}</div>
);
const Scoreboard: React.FC<{ t: number }> = ({ t }) => {
  // hook: the series promise + today's one thing, for sound-off scrollers
  if (t < T.tag) {
    const kT = ease((t - 0.05) / 0.3), kS = ease((t - T.ki) / 0.3);
    return (
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Pill k={kT} big bg={INK} color="#FFFFFF">KI ÜBERNIMMT MEINE FIRMA <span style={{ color: OR }}>· 100 TAGE</span></Pill>
        {kS > 0 && <Pill k={kS} big bg={GOLD} color={INK} shake={bump(t, T.chefbuero + 0.1, 0.3)}>👔 HEUTE: DER GESCHÄFTSFÜHRER-SKILL</Pill>}
      </div>
    );
  }
  const kTag = ease((t - T.tag) / 0.35);
  const big = t < T.ab - 0.1;
  const houses = t > T.bm + 0.1 ? 3 : 2;
  const hPop = bump(t, T.bm + 0.2, 0.3);
  const HousePill = ({ k, big: b }: { k: number; big?: boolean }) => (
    <Pill k={k} big={b} bg={houses > 2 ? OR : "rgba(255,255,255,.95)"} color={houses > 2 ? "#FFFFFF" : INK}>
      <span style={{ display: "inline-block", transform: `scale(${1 + 0.35 * hPop})` }}>🏠 KI-HÄUSER {houses}<span style={{ opacity: 0.6 }}>/8</span></span>
    </Pill>
  );
  if (big) {
    return (
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
        <Pill k={kTag} big bg={INK} color="#FFFFFF">🔥 TAG 3 <span style={{ color: "#A39C90" }}>/ 100</span></Pill>
        <HousePill k={ease((t - T.meineFirma) / 0.35)} big />
      </div>
    );
  }
  const kBar = ease((t - T.ab + 0.1) / 0.35);
  const QUESTS: [string, number][] = [["Skill-Baum", T.skills + 0.2], ["Stopp: nachfassen", T.lass + 0.2], ["Freigabe", CLICK + 0.1]];
  const done = QUESTS.filter(([, a]) => t >= a).length;
  const kQuest = ease((t - T.der2 + 0.2) / 0.4) * (1 - ease((t - T.acht - 1.6) / 0.3));
  const d3 = cl((t - T.tag) / (CLICK + 0.1 - T.tag));
  const end = t > END;
  const kAnt = ease((t - T.null) / 0.35), kRes = ease((t - T.res) / 0.35);
  const res = Math.min(8, Math.max(0, Math.floor((t - T.res + 0.12) / 0.12)));
  const kAch = ease((t - CLICK - 0.15) / 0.25) * (1 - ease((t - T.acht - 0.3) / 0.2));
  const kLock = ease((t - END) / 0.35);
  return (
    <>
      <div style={{ position: "absolute", top: 112, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10, opacity: kBar }}>
        <Pill k={1} bg={INK} color="#FFFFFF">🔥 TAG 3 <span style={{ color: "#A39C90" }}>/ 100</span></Pill>
        <HousePill k={1} />
        {kRes > 0 ? <Pill k={kRes} bg={YEL} color={INK} shake={bump(t, T.res + 1.0, 0.3)}>👥 EINWOHNER {res}</Pill> : kAnt > 0 ? <Pill k={kAnt} bg="#FFFFFF" color={INK}>ANTWORTEN <span style={{ color: "#D64545" }}>0</span><span style={{ color: MUTED }}>/20</span></Pill> : null}
      </div>
      <div style={{ position: "absolute", top: 172, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kBar }}>
        <div style={{ display: "flex", gap: 2.4, alignItems: "flex-end", background: "rgba(255,255,255,.9)", borderRadius: 999, padding: "8px 16px", boxShadow: "0 6px 18px rgba(40,24,10,.12)" }}>
          {Array.from({ length: 100 }, (_, i) => {
            const fill = i < 2 ? 1 : i === 2 ? d3 : 0;
            const pulse = i === 3 && end ? 0.5 + 0.5 * Math.sin(t * 10) : 0;
            return (
              <div key={i} style={{ width: 5, height: i < 4 ? 18 : 12, borderRadius: 2, background: "#E7E0D6", position: "relative", overflow: "hidden", outline: pulse ? `2px solid rgba(255,107,53,${pulse})` : undefined }}>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: OR }} />
              </div>
            );
          })}
        </div>
      </div>
      {kQuest > 0 && (
        <div style={{ position: "absolute", top: 222, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kQuest * kBar }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: F_B, fontSize: 22 }}>
            <span style={{ color: OR_D, letterSpacing: ".08em" }}>MISSION {done}/3</span>
            {QUESTS.map(([qn, a]) => {
              const k = t >= a; const pop = bump(t, a + 0.08, 0.2);
              return (
                <span key={qn} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, background: k ? GREEN : "rgba(255,255,255,.9)", color: k ? "#FFFFFF" : MUTED, transform: `scale(${1 + 0.25 * pop})`, boxShadow: "0 4px 12px rgba(40,24,10,.12)" }}>
                  {k ? "✓" : "○"} {qn}
                </span>
              );
            })}
          </div>
        </div>
      )}
      {kAch > 0 && (
        <div style={{ position: "absolute", top: 1110, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kAch }}>
          <div style={{ transform: `translateY(${(1 - kAch) * -40}px) scale(${0.8 + 0.2 * kAch + 0.06 * bump(t, CLICK + 0.6, 0.25)})`, background: INK, color: "#FFFFFF", borderRadius: 28, padding: "18px 34px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 14px 40px rgba(40,24,10,.35)", border: `3px solid ${GOLD}` }}>
            <span style={{ fontSize: 58 }}>🎩</span>
            <div>
              <div style={{ fontFamily: F_B, fontSize: 24, color: GOLD, letterSpacing: ".1em" }}>MISSION TAG 3 GESCHAFFT</div>
              <div style={{ fontFamily: F_B, fontSize: 36 }}>Der Geschäftsführer führt alle Skills</div>
            </div>
          </div>
        </div>
      )}
      {kLock > 0 && (
        <div style={{ position: "absolute", top: 228, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kLock }}>
          <div style={{ transform: `scale(${0.85 + 0.15 * kLock}) rotate(${Math.sin(t * 22) * 4 * Math.max(0, Math.sin(t * 3))}deg)`, background: OR, color: "#FFFFFF", borderRadius: 999, padding: "12px 26px", fontFamily: F_B, fontSize: 30, boxShadow: "0 10px 26px rgba(255,107,53,.35)" }}>
            🔒 TAG 4 schaltet morgen frei
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
  ["ui-pop", 0.05, 0.4], ["powerup", T.ki + 0.05, 0.25], ["ui-pop", T.ki, 0.35], ["stamp", T.chefbuero, 0.3],
  ["ui-pop", T.tag, 0.4], ["chime", T.drei, 0.28],
  ...[...DEPTS, 0].map((_, i): Sfx => ["ui-pop", T.stadt + i * 0.12, 0.16]), ["bump", T.abteilung + 0.2, 0.3],
  ...DEPTS.map((_, i): Sfx => ["coin", T.jedes + 0.1 + i * 0.1, 0.14]),
  ["stamp", T.bm, 0.35], ["powerup", T.bm + 0.1, 0.3], ["chime", T.bm + 0.15, 0.3],
  ["bump", T.mitarb, 0.3], ["ui-pop", T.sieben, 0.3], ["bump", T.chaos, 0.4], ["ui-pop", T.aber + 0.15, 0.35], ["stamp", T.bm, 0.35], ["powerup", T.bm + 0.1, 0.25], ["ui-pop", T.der2, 0.4], ["bump", T.derArb + 0.1, 0.35], ...DEPTS.map((_, i): Sfx => ["ui-pop", T.fuehrt + 0.15 + i * 0.09, 0.18]), ["chime", T.skills, 0.25],
  ["stamp", T.regisseur, 0.35], ...DEPTS.map((_, i): Sfx => ["check", T.sagt + i * 0.12, 0.16]), ["chime", T.tun, 0.25], ["bump", T.lassen, 0.35],
  ["ui-pop", T.vertrieb - 0.1, 0.35], ["coin", T.zwanzig, 0.25], ["bump", T.null + 0.05, 0.45],
  ["ui-pop", T.vskill, 0.35], ["stamp", T.lass, 0.45], ["bump", T.lass + 0.05, 0.3], ["check", T.fass, 0.3], ["check", T.dreiTage, 0.3], ["check", T.grund - 0.2, 0.3], ["stamp", T.grund + 0.05, 0.25],
  ["ui-pop", T.undIch + 0.05, 0.4], ["click", CLICK, 0.7], ["chime", CLICK + 0.1, 0.3], ["check", CLICK + 0.15, 0.3], ["powerup", CLICK + 0.3, 0.25], ["coin", CLICK + 0.45, 0.25],
  ["ui-pop", T.acht, 0.4], ["chime", T.offerFuehrt, 0.25], ["jump", T.bot + 0.35, 0.3], ["chime", T.bot + 0.45, 0.25],
  ...RES.map((_, i): Sfx => ["jump", T.res + i * 0.12 + 0.4, 0.14]), ["ui-pop", T.res + 0.15, 0.35], ["bump", T.wohnen, 0.3], ["ui-pop", T.schreibJob, 0.35],
  ["ui-pop", T.schreib - 0.05, 0.4], ["typing", T.welches - 0.1, 0.22], ["check", T.und5, 0.35],
  ["ui-pop", T.skillCta, 0.4], ["chime", T.skillCta + 0.15, 0.3], ["ui-pop", T.claude, 0.3],
  ["ui-pop", END + 0.15, 0.35], ["bump", END, 0.35],
];

export const Agents100Day3: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const ready = useFontsReady([`40px ${F_B}`, `40px ${F_S}`, `40px ${F_M}`, "800 70px Rubik"]);
  const logo = useImage(staticFile("sk100d3/superkind-logo.svg"));
  const claude = useImage(staticFile("logos/claude.svg"));
  const tex = useStaticTex(ready);
  const dyn = useDynTex(t, logo, claude);
  const a = camAt(t - 0.03).pos, b = camAt(t + 0.03).pos;
  const speed = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 0.06;
  const blur = Math.min(3.5, Math.max(0, (speed - 8) * 0.12));
  const flash = 0.2 * bump(t, T.bm + 0.1, 0.08) + 0.3 * bump(t, CLICK + 0.05, 0.1);
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
      <Audio src={staticFile("sk100d3/voice.mp3")} />
      <Audio src={staticFile("sk100d3/music-loser.mp3")} volume={0.25} />
      {SFX.map(([n, s, v], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s * 30))} durationInFrames={90}>
          <Audio src={staticFile(`sirtoken/sfx-${n}.mp3`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
