// Trainer reel v3: one continuous toy-3D world. Every step is an island, the camera flies between them
// (zoom in → pull up → glide → zoom into the next), the claudebyseb "Vorstand" table sits in the middle.
// Claude click paths run on 3D monitors with live canvas screens. Only the captions are 2D.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BlockBuddy, CameraRig, ToyBox, canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { THEMES, PillCaptions, Word, pixelFont } from "../components/PixelKit";
import { PROPS, claudeSerif } from "../components/ClaudeUI";
import { Scene as TableSet, useTextures, MODE_TRICK, TableMode } from "./TrainerTable3D";
import words from "../../public/sirtoken/words.json";

export const TRAINER_WORLD_SECONDS = 37.5;
const W = 1080, H = 1920;
const th = THEMES.gym;
type V3 = [number, number, number];
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - Math.pow(1 - cl(v), 3);
const inOut = (v: number) => { const x = cl(v); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = (v: number) => { const x = cl(v); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const rnd = (i: number) => { const v = Math.sin(i * 91.7 + 47.3) * 43758.5453; return v - Math.floor(v); };
const bump = (t: number, at: number, d = 0.25) => Math.max(0, 1 - Math.abs(t - at) / d);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const bez3 = (a: V3, c: V3, b: V3, k: number): V3 => lerp3(lerp3(a, c, k), lerp3(c, b, k), k);
const INK = "#1E1A16", ORANGE = "#D97757";
const SERIF = `"${claudeSerif.replace(/"/g, "")}"`;
const TO: V3 = [0, 0, -16.4]; // table offset in the world

// ---------- station layout ----------
const ST = {
  hook: [0, 0, 0] as V3,
  s1: [-9, 0, -7] as V3,
  s2: [9, 0, -7] as V3,
  s4: [-13, 0, -22] as V3,
  s5: [-13, 0, -34] as V3,
  s6: [12, 0, -28] as V3,
};
const SUNDAY_W: TableMode = { t0: 28.6, title: "SONNTAG", glow: "#FFD27A", joins: [24.5, 24.5, 24.5, 24.5], done: 31.27, adjust: [30.55, 31.2] };

// ---------- camera: holds joined by curved transits ----------
type Hold = { a: number; b: number; pos: (t: number) => V3; look: (t: number) => V3 };
const hold = (a: number, b: number, p0: V3, p1: V3, l0: V3, l1: V3): Hold => ({ a, b, pos: (t) => lerp3(p0, p1, inOut((t - a) / (b - a))), look: (t) => lerp3(l0, l1, inOut((t - a) / (b - a))) });
const tableDolly = (t: number) => ease((t - 11) / 3.4);
const HOLDS: Hold[] = [
  hold(0, 4.3, [0, 5.4, 10.2], [0, 6.6, 12.6], [0, 2.2, -0.6], [0, 2.5, -0.8]),
  hold(4.85, 7.62, [-9, 4.4, 0.4], [-9, 4.1, -0.5], [-9, 3.0, -8.4], [-9, 3.0, -8.4]),
  hold(8.12, 10.72, [9.3, 5.6, 2.4], [9.3, 5.2, 1.6], [9.3, 2.4, -7.8], [9.3, 2.4, -7.8]),
  { a: 11.25, b: 17.75, pos: (t) => [Math.sin(t * 0.45) * 0.6, 13.2 - 1.2 * tableDolly(t), 9.6 - 1.6 * tableDolly(t) + TO[2]], look: () => [0, 2.9, -4.8 + TO[2]] },
  hold(18.3, 20.72, [-13, 7.6, -12.4], [-13, 7.0, -13.2], [-13, 0.6, -22.8], [-13, 0.6, -22.8]),
  hold(21.2, 24.86, [-13, 4.9, -25.8], [-13, 4.5, -26.6], [-13, 2.8, -34.6], [-13, 2.8, -34.6]),
  hold(25.6, 28.55, [12.1, 5.3, -17.4], [12.1, 4.9, -18.3], [12.1, 2.6, -28.6], [12.1, 2.6, -28.6]),
  hold(29.05, 31.68, [4.2, 11.6, -11.6], [2.8, 11.0, -12.6], [0, 1.6, -21.0], [0, 1.6, -21.0]),
  hold(32.6, 37.6, [0, 8.9, 12.4], [0, 8.4, 11.2], [0, 5.0, -1.6], [0, 5.0, -1.6]),
];
const VIA: { pos: V3; look: V3 }[] = [
  { pos: [-4, 10, 4], look: [-6, 1.5, -5] },
  { pos: [0, 9, 1.5], look: [0, 2, -8] },
  { pos: [5, 12, -4], look: [1, 2, -16] },
  { pos: [-8, 11, -10], look: [-9, 1.5, -20] },
  { pos: [-13, 9, -22], look: [-13, 1.5, -30] },
  { pos: [0, 17, -20], look: [2, 0, -30] },
  { pos: [9, 12, -12], look: [3, 2, -20] },
  { pos: [0, 20, 8], look: [0, 1, -12] },
];
const camAt = (t: number): { pos: V3; look: V3 } => {
  for (let i = 0; i < HOLDS.length; i++) {
    const h = HOLDS[i];
    if (t <= h.b) return { pos: h.pos(Math.max(t, h.a)), look: h.look(Math.max(t, h.a)) };
    const n = HOLDS[i + 1];
    if (n && t < n.a) {
      const k = inOut((t - h.b) / (n.a - h.b));
      return { pos: bez3(h.pos(h.b), VIA[i].pos, n.pos(n.a), k), look: bez3(h.look(h.b), VIA[i].look, n.look(n.a), k) };
    }
  }
  const l = HOLDS[HOLDS.length - 1];
  return { pos: l.pos(t), look: l.look(t) };
};
const TRANSITS = HOLDS.slice(0, -1).map((h) => h.b);
const PUNCH = [1.25, 2.38, 3.45, 7.48, 8.42, 10.11, 12.6, 14.35, 15.1, 15.6, 16.3, 17.05, 19.1, 19.4, 19.7, 20.0, 20.21, 24.21, 26.84, 28.13, 31.27, 33.47, 34.57];

// ---------- canvas helpers ----------
const useImage = (src: string) => {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [h] = React.useState(() => delayRender("image " + src));
  React.useEffect(() => {
    const i = new Image();
    i.width = 256; i.height = 256;
    i.onload = () => { setImg(i); continueRender(h); };
    i.onerror = () => continueRender(h);
    i.src = src;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return img;
};
// live canvas texture, redrawn every frame from t
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
const fitFont = (c: CanvasRenderingContext2D, text: string, weight: string, max: number, maxW: number, fam = "Rubik") => {
  let s = max;
  c.font = `${weight} ${s}px ${fam}`;
  while (c.measureText(text).width > maxW && s > 10) { s -= 2; c.font = `${weight} ${s}px ${fam}`; }
  return s;
};
const pxArt = (c: CanvasRenderingContext2D, rows: string[], pal: Record<string, string>, x: number, y: number, px: number) => {
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (pal[ch]) { c.fillStyle = pal[ch]; c.fillRect(x + i * px, y + j * px, px + 0.5, px + 0.5); } }));
};
const HAND = ["..KK......", ".KWWK.....", ".KWWK.....", ".KWWKKK...", ".KWWKWWKK.", "KKWWKWWKWK", "KWWWWWWKWK", "KWWWWWWWWK", ".KWWWWWWWK", "..KWWWWWK.", "...KKKKK.."];

// sign with a coloured frame like the reference stamps / plates
const signTex = (text: string, bg: string, fg: string, border: string, w = 640, h = 180) =>
  canvasTex(w, h, (c) => {
    c.fillStyle = border; roundRect(c, 0, 0, w, h, 34); c.fill();
    c.fillStyle = bg; roundRect(c, 12, 12, w - 24, h - 24, 26); c.fill();
    c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle";
    fitFont(c, text, "900", h * 0.55, w - 80);
    c.fillText(text, w / 2, h / 2 + 4);
  });
const islandTex = (n: string, text: string, color: string) =>
  canvasTex(768, 180, (c) => {
    c.fillStyle = "#1A1410"; roundRect(c, 0, 0, 768, 180, 26); c.fill();
    c.fillStyle = "#F6EEDC"; roundRect(c, 10, 10, 748, 160, 20); c.fill();
    c.fillStyle = color; c.beginPath(); c.arc(92, 90, 62, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle"; c.font = "900 80px Rubik"; c.fillText(n, 92, 96);
    c.fillStyle = color; c.textAlign = "left";
    fitFont(c, text, "900", 74, 560);
    c.fillText(text, 180, 96);
  });

// ---------- Claude screen (paper look) ----------
type Part = { at: number; text: string; key?: string; color?: string };
type Reply = { at: number; name: string; avatar: string; text: string; hl: { word: string; color: string }[] };
type Click = { t: number; n: number; x: number; y: number; mx: number; my: number };
type ScreenSpec = { prompt: Part[]; sendAt: number; attach?: { at: number; kinds: string[] }; reply?: Reply; clicks: Click[]; start: { t: number; x: number; y: number } };
const CPS = 42;
const SW = 900, SH = 800;
const P_INPUT = { x: 300, y: 560 }, P_PLUS = { x: 80, y: 726 }, P_SEND = { x: 815, y: 726 };

type Seg = { s: string; hl?: string };
const richLines = (c: CanvasRenderingContext2D, segs: Seg[], maxW: number) => {
  const toks: Seg[] = [];
  segs.forEach((g) => g.s.split(/(\s+)/).forEach((w) => w && toks.push({ s: w, hl: g.hl })));
  const lines: Seg[][] = [[]];
  let lw = 0;
  toks.forEach((tk) => {
    const w = c.measureText(tk.s).width;
    if (lw + w > maxW && tk.s.trim()) { lines.push([]); lw = 0; }
    if (!lines[lines.length - 1].length && !tk.s.trim()) return;
    lines[lines.length - 1].push(tk); lw += w;
  });
  return lines;
};
const drawRich = (c: CanvasRenderingContext2D, segs: Seg[], x: number, y: number, maxW: number, lh: number, color: string) => {
  const lines = richLines(c, segs, maxW);
  lines.forEach((ln, j) => {
    let cx = x;
    ln.forEach((tk) => {
      const w = c.measureText(tk.s).width;
      if (tk.hl && tk.s.trim()) { c.fillStyle = tk.hl; roundRect(c, cx - 4, y + j * lh - lh * 0.72, w + 8, lh * 0.92, 8); c.fill(); }
      c.fillStyle = color; c.fillText(tk.s, cx, y + j * lh);
      cx += w;
    });
  });
  return lines.length;
};
const typedSegs = (prompt: Part[], t: number): Seg[] =>
  prompt.flatMap((p) => {
    const n = Math.max(0, Math.min(p.text.length, Math.floor((t - p.at) * CPS)));
    const shown = p.text.slice(0, n);
    if (!p.key) return [{ s: shown }];
    const i = p.text.indexOf(p.key);
    if (n < i + p.key.length) return [{ s: shown }];
    return [{ s: shown.slice(0, i) }, { s: p.key, hl: p.color }, { s: shown.slice(i + p.key.length) }];
  });
const drawThumb = (c: CanvasRenderingContext2D, kind: string, x: number, y: number, s: number) => {
  c.save();
  c.fillStyle = INK; roundRect(c, x, y, s, s, 14); c.fill();
  c.fillStyle = kind === "sofa" ? "#F1E3FF" : kind === "squat" ? "#CDEBF8" : "#DCEBFF"; roundRect(c, x + 5, y + 5, s - 10, s - 10, 10); c.fill();
  if (kind === "squat") {
    c.fillStyle = "#C9A27A"; c.fillRect(x + 5, y + s - 22, s - 10, 17);
    c.fillStyle = "#F2B92A"; c.beginPath(); c.arc(x + s / 2, y + s * 0.42, s * 0.2, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#1D1B20"; c.fillRect(x + s / 2 - s * 0.14, y + s * 0.1, s * 0.28, s * 0.1);
    c.fillStyle = INK; c.fillRect(x + s * 0.3, y + s * 0.6, s * 0.08, s * 0.2); c.fillRect(x + s * 0.62, y + s * 0.6, s * 0.08, s * 0.2);
  } else {
    const pr = PROPS[kind];
    const px = Math.floor((s - 24) / pr.rows[0].length);
    pxArt(c, pr.rows, pr.pal, x + (s - px * pr.rows[0].length) / 2, y + (s - px * pr.rows.length) / 2, px);
  }
  c.restore();
};
const drawClaude = (c: CanvasRenderingContext2D, t: number, sp: ScreenSpec, logo: HTMLImageElement | null) => {
  const sent = t >= sp.sendAt;
  const att = sp.attach && t >= sp.attach.at ? sp.attach.kinds : [];
  c.fillStyle = "#F4EFE5"; c.fillRect(0, 0, SW, SH);
  for (let i = 0; i < 120; i++) { c.fillStyle = `rgba(120,100,80,${0.04 + rnd(i) * 0.05})`; c.fillRect(rnd(i + 3) * SW, rnd(i + 7) * SH, 3, 3); }
  // window bar
  c.fillStyle = "#EAE3D5"; c.fillRect(0, 0, SW, 84);
  c.fillStyle = INK; c.fillRect(0, 80, SW, 6);
  ["#E5534B", "#E9B23A", "#3FB950"].forEach((col, i) => { c.fillStyle = INK; c.beginPath(); c.arc(36 + i * 40, 42, 15, 0, 7); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(36 + i * 40, 42, 11, 0, 7); c.fill(); });
  c.font = `600 44px ${SERIF}`; c.textBaseline = "middle"; c.textAlign = "left";
  const tw = c.measureText("Claude").width;
  if (logo) c.drawImage(logo, SW / 2 - (tw + 54) / 2, 22, 40, 40);
  c.fillStyle = INK; c.fillText("Claude", SW / 2 - (tw + 54) / 2 + 54, 44);
  if (!sent) {
    c.font = `600 52px ${SERIF}`;
    const g = "Wie kann ich dir helfen?";
    const gw = c.measureText(g).width;
    if (logo) { c.save(); c.translate(SW / 2 - (gw + 70) / 2 + 26, 210); c.rotate(t * 0.7); c.drawImage(logo, -26, -26, 52, 52); c.restore(); }
    c.fillStyle = "#1A1714"; c.fillText(g, SW / 2 - (gw + 70) / 2 + 70, 212);
    c.font = "600 28px Rubik";
    const chips = ["Schreiben", "Lernen", "Code", "Recherche"];
    let cx = SW / 2 - chips.reduce((s, ch) => s + c.measureText(ch).width + 56, -14) / 2;
    chips.forEach((ch) => { const w = c.measureText(ch).width + 42; c.fillStyle = "#EFE8DA"; roundRect(c, cx, 268, w, 50, 25); c.fill(); c.strokeStyle = "#CFC6B5"; c.lineWidth = 3; c.stroke(); c.fillStyle = "#4A443C"; c.fillText(ch, cx + 21, 294); cx += w + 14; });
  } else {
    // user bubble + reply
    c.font = "600 30px Rubik";
    const full = sp.prompt.map((p) => p.text).join("");
    const lines = richLines(c, [{ s: full }], 560);
    const thumbW = att.length ? att.length * 74 + 10 : 0;
    const bw = Math.min(640, Math.max(...lines.map((l) => l.reduce((s, tk) => s + c.measureText(tk.s).width, 0))) + 44 + thumbW);
    const bh = Math.max(lines.length * 40 + 28, att.length ? 92 : 0);
    const k = ease((t - sp.sendAt) / 0.3);
    const by = 116 + (1 - k) * 380;
    c.fillStyle = INK; roundRect(c, SW - 30 - bw, by, bw, bh, 22); c.fill();
    c.fillStyle = "#E9E1D1"; roundRect(c, SW - 26 - bw, by + 4, bw - 8, bh - 8, 18); c.fill();
    att.forEach((kd, i) => drawThumb(c, kd, SW - 14 - bw + i * 74, by + 12, 66));
    drawRich(c, [{ s: full }], SW - 8 - bw + thumbW, by + 36, 560, 40, INK);
    if (sp.reply && t >= sp.reply.at - 0.3) {
      const r = sp.reply;
      const ry = by + bh + 34;
      c.globalAlpha = ease((t - r.at + 0.3) / 0.25);
      c.fillStyle = INK; roundRect(c, 30, ry, 70, 70, 16); c.fill();
      c.fillStyle = r.avatar; roundRect(c, 34, ry + 4, 62, 62, 13); c.fill();
      c.fillStyle = INK; c.fillRect(52, ry + 24, 8, 18); c.fillRect(70, ry + 24, 8, 18);
      c.fillStyle = "#6B635A"; c.font = "800 24px Rubik"; c.fillText(r.name, 118, ry + 14);
      c.font = `600 36px ${SERIF}`;
      const n = Math.max(0, Math.floor((t - r.at) * 58));
      if (n === 0) { c.fillStyle = "#A39C90"; c.fillText(".".repeat(1 + (Math.floor(t * 6) % 3)), 118, ry + 56); }
      else {
        const shown = r.text.slice(0, n);
        const segs: Seg[] = [];
        if (n >= r.text.length) {
          let rest = shown;
          while (rest.length) {
            let best: { i: number; h: { word: string; color: string } } | null = null;
            for (const h of r.hl) { const i = rest.indexOf(h.word); if (i >= 0 && (!best || i < best.i)) best = { i, h }; }
            if (!best) { segs.push({ s: rest }); break; }
            segs.push({ s: rest.slice(0, best.i) }, { s: best.h.word, hl: best.h.color });
            rest = rest.slice(best.i + best.h.word.length);
          }
        } else segs.push({ s: shown });
        drawRich(c, segs, 118, ry + 56, 740, 46, INK);
      }
      c.globalAlpha = 1;
    }
  }
  // input card
  const focus = t > sp.start.t + 0.5 && !sent;
  if (focus) { c.fillStyle = "rgba(217,119,87,.35)"; roundRect(c, 14, 412, SW - 28, 380, 40); c.fill(); }
  c.fillStyle = INK; roundRect(c, 24, 420, SW - 48, 362, 34); c.fill();
  c.fillStyle = "#FFFFFF"; roundRect(c, 31, 427, SW - 62, 348, 28); c.fill();
  let ty = 486;
  if (!sent && att.length) {
    att.forEach((kd, i) => { const s = 108 * back((t - sp.attach!.at - i * 0.12) / 0.35); drawThumb(c, kd, 52 + i * 124 + (108 - s) / 2, 444 + (108 - s) / 2, Math.max(1, s)); });
    ty = 600;
  }
  c.font = "600 36px Rubik"; c.textAlign = "left";
  const segs = typedSegs(sp.prompt, t);
  const any = segs.some((g) => g.s.length);
  if (sent) { c.fillStyle = "#A39C90"; c.fillText("Antworten …", 56, ty); }
  else if (!any) { c.fillStyle = "#A39C90"; c.fillText("Schreib Claude …", 56, ty); }
  else {
    const nl = drawRich(c, segs, 56, ty, SW - 120, 48, INK);
    if (focus && Math.floor(t * 3) % 2) {
      const lines = richLines(c, segs, SW - 120);
      const last = lines[lines.length - 1] || [];
      const lw = last.reduce((s, tk) => s + c.measureText(tk.s).width, 0);
      c.fillStyle = ORANGE; c.fillRect(58 + lw, ty + (nl - 1) * 48 - 34, 5, 42);
    }
  }
  // plus, model, send
  const plusHot = sp.attach && Math.abs(t - sp.attach.at + 0.1) < 0.15;
  c.lineWidth = 5; c.strokeStyle = INK; c.fillStyle = plusHot ? "#F6D9CD" : "#FFFFFF";
  c.beginPath(); c.arc(P_PLUS.x, P_PLUS.y, 28, 0, 7); c.fill(); c.stroke();
  c.fillStyle = INK; c.font = "700 40px Rubik"; c.textAlign = "center"; c.fillText("+", P_PLUS.x, P_PLUS.y + 2);
  c.font = "500 28px Rubik"; c.fillStyle = "#7C756A"; c.textAlign = "right"; c.fillText("Opus 5.5", 750, 728);
  const sendPop = 1 + 0.25 * bump(t, sp.sendAt, 0.2);
  c.save(); c.translate(P_SEND.x, P_SEND.y); c.scale(sendPop, sendPop);
  c.fillStyle = INK; roundRect(c, -46, -38, 92, 76, 20); c.fill();
  c.fillStyle = sent ? "#B85C3E" : ORANGE; roundRect(c, -41, -33, 82, 66, 16); c.fill();
  c.strokeStyle = "#fff"; c.lineWidth = 7; c.lineCap = "square"; c.beginPath(); c.moveTo(0, 18); c.lineTo(0, -16); c.moveTo(-14, -2); c.lineTo(0, -16); c.lineTo(14, -2); c.stroke();
  c.restore();
  c.textAlign = "left";
  // click path: rings, numbered markers, pixel hand
  sp.clicks.forEach((k) => {
    if (t < k.t - 0.02) return;
    const ring = cl((t - k.t) / 0.45);
    c.strokeStyle = `rgba(217,119,87,${1 - ring})`; c.lineWidth = 7; c.beginPath(); c.arc(k.x, k.y, 10 + 70 * ring, 0, 7); c.stroke();
    const p = back((t - k.t) / 0.35);
    c.save(); c.translate(k.mx, k.my); c.scale(p, p);
    c.fillStyle = "rgba(0,0,0,.3)"; c.beginPath(); c.arc(0, 6, 32, 0, 7); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(0, 0, 32, 0, 7); c.fill();
    c.fillStyle = ORANGE; c.beginPath(); c.arc(0, 0, 26, 0, 7); c.fill();
    c.fillStyle = "#fff"; c.font = "900 34px Rubik"; c.textAlign = "center"; c.fillText(String(k.n), 0, 2);
    c.restore();
  });
  const pts = [sp.start, ...sp.clicks.flatMap((k) => [{ t: k.t - 0.05, x: k.x, y: k.y }, { t: k.t + 0.15, x: k.x, y: k.y }])];
  let pos = pts[pts.length - 1];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (t <= b.t) { const tr = Math.min(0.45, b.t - a.t); const k = ease((t - (b.t - tr)) / tr); pos = { t, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k - Math.sin(k * Math.PI) * 50 }; break; }
  }
  const press = sp.clicks.some((k) => t >= k.t && t < k.t + 0.12);
  c.save(); c.translate(pos.x - 10, pos.y - 4); c.rotate(-0.2); const ps = press ? 0.85 : 1; c.scale(ps, ps);
  pxArt(c, HAND, { K: "rgba(0,0,0,.3)" }, 3, 7, 7);
  pxArt(c, HAND, { K: INK, W: "#FFFFFF" }, 0, 0, 7);
  c.restore();
};

const S1_SPEC: ScreenSpec = {
  prompt: [
    { at: 5.5, text: "Ziel: 5 kg Muskeln bis März.", key: "Ziel:", color: "#FFD27A" },
    { at: 6.25, text: " Zeit: 3× 45 Min pro Woche.", key: "Zeit:", color: "#A7E3FF" },
    { at: 6.95, text: " Knie links tut weh.", key: "Knie", color: "#FFB3B3" },
  ],
  sendAt: 7.48,
  clicks: [{ t: 5.05, n: 1, ...P_INPUT, mx: 46, my: 380 }, { t: 7.48, n: 2, ...P_SEND, mx: 846, my: 380 }],
  start: { t: 4.6, x: 640, y: 760 },
};
const S2_SPEC: ScreenSpec = {
  prompt: [
    { at: 8.9, text: "Das ist mein Equipment. ", key: "Equipment", color: "#A7E3FF" },
    { at: 9.75, text: "Plan fürs Wohnzimmer.", key: "Wohnzimmer", color: "#E3C8FF" },
  ],
  sendAt: 10.42,
  attach: { at: 8.42, kinds: ["rack", "sofa"] },
  clicks: [{ t: 8.3, n: 1, ...P_PLUS, mx: 46, my: 380 }, { t: 10.42, n: 2, ...P_SEND, mx: 846, my: 380 }],
  start: { t: 7.9, x: 600, y: 760 },
};
const S5_SPEC: ScreenSpec = {
  prompt: [{ at: 21.75, text: "Check meine Kniebeuge.", key: "Kniebeuge", color: "#FFD27A" }],
  sendAt: 22.4,
  attach: { at: 21.42, kinds: ["squat"] },
  reply: { at: 22.85, name: "PHYSIO", avatar: "#5CC08A", text: "Deine Knie kippen nach innen. Füße etwas breiter, Gewicht auf die Fersen.", hl: [{ word: "Knie", color: "#FFB3B3" }, { word: "Fersen", color: "#B8F0CF" }] },
  clicks: [{ t: 21.3, n: 1, ...P_PLUS, mx: 46, my: 380 }, { t: 22.4, n: 2, ...P_SEND, mx: 846, my: 380 }],
  start: { t: 21.0, x: 600, y: 760 },
};
const S6_SPEC: ScreenSpec = {
  prompt: [
    { at: 25.65, text: "Bau mir daraus eine Trainings-App ", key: "Trainings-App", color: "#C9B6FF" },
    { at: 26.15, text: "mit Timer und Häkchen.", key: "Timer", color: "#FFD27A" },
  ],
  sendAt: 26.8,
  reply: { at: 27.05, name: "CLAUDE", avatar: ORANGE, text: "Fertig: deine App mit Timer und Häkchen.", hl: [{ word: "App", color: "#C9B6FF" }] },
  clicks: [{ t: 25.5, n: 1, ...P_INPUT, mx: 46, my: 380 }, { t: 26.8, n: 2, ...P_SEND, mx: 846, my: 380 }],
  start: { t: 25.2, x: 600, y: 760 },
};
const isTyping = (p: Part[], t: number) => p.some((x) => t > x.at && t < x.at + x.text.length / CPS);

// ---------- 3D pieces ----------
const Monitor: React.FC<{ p: V3; w: number; h: number; tex: THREE.Texture; t: number; yaw?: number; stand?: number }> = ({ p, w, h, tex, yaw = 0, stand = 0 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <ToyBox p={[0, 0, -0.12]} s={[w + 0.3, h + 0.3, 0.22]} color="#2A2420" />
    <mesh position={[0, 0, 0.005]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
    {stand > 0 && <ToyBox p={[0, -h / 2 - stand / 2, -0.15]} s={[0.35, stand, 0.3]} color="#2A2420" />}
    {stand > 0 && <ToyBox p={[0, -h / 2 - stand, -0.1]} s={[1.4, 0.1, 0.8]} color="#2A2420" />}
  </group>
);

const Sign: React.FC<{ p: V3; tex: THREE.Texture; w: number; h: number; t: number; at?: number; until?: number; rot?: V3; bob?: number }> = ({ p, tex, w, h, t, at = -99, until = 999, rot = [-0.25, 0, 0], bob = 0.08 }) => {
  const s = back((t - at) / 0.35) * (1 - ease((t - until) / 0.25));
  if (s <= 0.001) return null;
  return (
    <group position={[p[0], p[1] + Math.sin(t * 2.4 + p[0]) * bob, p[2]]} rotation={rot} scale={[s, s, s]}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Island: React.FC<{ p: V3; r?: number; top: string; side: string; label?: THREE.Texture; t: number }> = ({ p, r = 3.8, top, side, label, t }) => (
  <group position={p}>
    <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
      <cylinderGeometry args={[r, r + 0.15, 0.4, 40]} />
      <meshStandardMaterial color={side} roughness={0.8} flatShading />
    </mesh>
    <mesh position={[0, 0.405, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[r - 0.12, 40]} />
      <meshStandardMaterial color={top} roughness={0.85} />
    </mesh>
    {Array.from({ length: 28 }).map((_, i) => {
      const a = (i / 28) * Math.PI * 2;
      return (
        <mesh key={i} position={[Math.cos(a) * (r + 0.02), 0.22, Math.sin(a) * (r + 0.02)]} rotation={[0, -a, 0]}>
          <boxGeometry args={[0.12, 0.3, 0.3]} />
          <meshBasicMaterial color={i % 2 ? "#FFE1A8" : side} transparent opacity={i % 2 ? 0.35 + 0.35 * Math.sin(t * 3 + i) : 1} toneMapped={false} />
        </mesh>
      );
    })}
    {label && (
      <group position={[0, 0.5, r + 0.05]} rotation={[-0.5, 0, 0]} scale={0.62}>
        <ToyBox p={[0, 0, -0.06]} s={[3.25, 0.82, 0.08]} color="#1A1410" />
        <mesh>
          <planeGeometry args={[3.2, 0.75]} />
          <meshBasicMaterial map={label} toneMapped={false} />
        </mesh>
      </group>
    )}
  </group>
);

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
const Coin3D: React.FC<{ p: V3; r?: number; rot?: V3 }> = ({ p, r = 0.22, rot = [Math.PI / 2, 0, 0] }) => (
  <mesh position={p} rotation={rot} castShadow>
    <cylinderGeometry args={[r, r, r * 0.25, 14]} />
    <meshStandardMaterial color="#F2B92A" metalness={0.6} roughness={0.3} emissive="#7A5208" emissiveIntensity={0.45} />
  </mesh>
);
const CoinRain3D: React.FC<{ at: number; t: number; c: V3; spread?: number; n?: number; floor?: number; dur?: number; h?: number }> = ({ at, t, c, spread = 5, n = 24, floor = 0.5, dur = 2.4, h = 7 }) => {
  const k = t - at;
  if (k < 0 || k > dur) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const kk = k - rnd(i + 11) * 0.7;
        if (kk < 0) return null;
        const y = Math.max(floor, c[1] + h - 9 * kk * kk * 1.4);
        return <Coin3D key={i} p={[c[0] + (rnd(i) - 0.5) * spread, y, c[2] + (rnd(i + 5) - 0.5) * spread]} rot={[Math.PI / 2 + (y > floor ? kk * 8 : 0), 0, kk * 5 + i]} />;
      })}
    </>
  );
};

// standing helper creature (same BlockBuddy as at the table)
const KINDS = {
  athletik: { color: "#5E8FE0", dark: "#3E62A8", acc: "headband" as const, accent: "#FFFFFF" },
  physio: { color: "#5CC08A", dark: "#3A8A60", acc: "cross" as const, accent: "#FFFFFF" },
  kraft: { color: "#EE7B4E", dark: "#B4532F", acc: "belt" as const, accent: "#2A2220" },
  explosiv: { color: "#F0C04C", dark: "#B88D24", acc: "bolt" as const, accent: "#FF4F6E" },
  coach: { color: "#9AA3B5", dark: "#6B7385", acc: "cap" as const, accent: "#E5534B" },
};
const Bud: React.FC<{ kind: keyof typeof KINDS; p: V3; t: number; seed: number; s?: number; yaw?: number; talk?: boolean; vis?: number; lift?: number; rot?: V3; sy?: number }> = ({ kind, p, t, seed, s = 1, yaw = 0, talk, vis = 1, lift = 0, rot = [0, 0, 0], sy = 1 }) => {
  const k = KINDS[kind];
  const v = Math.max(0.001, vis) * s;
  return (
    <group position={[p[0], p[1] + lift, p[2]]} rotation={rot} scale={[v, v * sy, v]}>
      <BlockBuddy p={[0, 0.58, 0]} yaw={yaw} color={k.color} dark={k.dark} t={t} seed={seed} accessory={k.acc} accent={k.accent} talk={talk} />
    </group>
  );
};

// Sir Token for the world: coin body with legs, thick arms (deg: 0 down, 90 out, 180 up)
const SirW: React.FC<{ p: V3; s?: number; yaw?: number; t: number; face: THREE.Texture; armL?: number; armR?: number; squat?: number; lift?: number; vis?: number; hand?: React.ReactNode; knee?: string }> = ({ p, s = 0.38, yaw = 0, t, face, armL = 20, armR = 20, squat = 0, lift = 0, vis = 1, hand, knee }) => {
  if (vis <= 0.001) return null;
  const legH = 1.1 - 0.5 * squat;
  const spread = 0.7 + 0.35 * squat;
  const by = legH + 1.85;
  const breathe = 1 + 0.02 * Math.sin(t * 5);
  const arm = (side: -1 | 1, deg: number, node?: React.ReactNode) => (
    <group position={[side * 1.95, by - 0.2, 0.1]} rotation={[0, 0, (side * deg * Math.PI) / 180]}>
      <mesh castShadow position={[0, -0.6, 0]}>
        <boxGeometry args={[0.34, 1.2, 0.34]} />
        <meshStandardMaterial color="#1E1A18" />
      </mesh>
      <mesh castShadow position={[0, -1.32, 0]}>
        <boxGeometry args={[0.62, 0.55, 0.55]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
      {node && <group position={[0, -1.6, 0]}>{node}</group>}
    </group>
  );
  return (
    <group position={[p[0], p[1] + lift, p[2]]} rotation={[0, yaw, 0]} scale={s * vis}>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh castShadow position={[side * spread, legH / 2, 0]}>
            <boxGeometry args={[0.4, legH, 0.4]} />
            <meshStandardMaterial color="#1E1A18" />
          </mesh>
          <ToyBox p={[side * spread, 0.14, 0.18]} s={[0.7, 0.28, 0.95]} color="#E8574E" top="#FFFFFF" />
          {knee && (
            <mesh position={[side * spread, legH * 0.55, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.5, 0.11, 8, 24]} />
              <meshBasicMaterial color={knee} toneMapped={false} />
            </mesh>
          )}
        </group>
      ))}
      <group position={[0, by, 0]} scale={[1, breathe, 1]}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[2.0, 2.0, 0.6, 40]} />
          <meshStandardMaterial attach="material-0" color="#C98E14" metalness={0.55} roughness={0.35} />
          <meshStandardMaterial attach="material-1" map={face} metalness={0.25} roughness={0.45} />
          <meshStandardMaterial attach="material-2" color="#B07A10" metalness={0.5} roughness={0.4} />
        </mesh>
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 2.0, Math.sin(a) * 2.0, 0]} rotation={[0, 0, a]}>
              <boxGeometry args={[0.1, 0.14, 0.56]} />
              <meshStandardMaterial color="#E7B232" metalness={0.5} roughness={0.35} />
            </mesh>
          );
        })}
        <group position={[0.35, 2.05, 0]} rotation={[0, 0, -0.12]}>
          <mesh castShadow><cylinderGeometry args={[1.25, 1.25, 0.14, 28]} /><meshStandardMaterial color="#1D1B20" roughness={0.5} /></mesh>
          <mesh castShadow position={[0, 0.72, 0]}><cylinderGeometry args={[0.82, 0.86, 1.3, 28]} /><meshStandardMaterial color="#232127" roughness={0.45} /></mesh>
          <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.875, 0.875, 0.24, 28]} /><meshStandardMaterial color="#E2AE2E" metalness={0.6} roughness={0.3} /></mesh>
        </group>
      </group>
      {arm(-1, armL)}
      {arm(1, armR, hand)}
    </group>
  );
};

// ---------- stations ----------
type Tex = Record<string, THREE.Texture>;

const HookStation: React.FC<{ t: number; tex: Tex; price: THREE.Texture }> = ({ t, tex, price }) => {
  const [x, , z] = ST.hook;
  const ko = cl((t - 2.38) / 0.75);
  const coachVis = t < 2.38 ? back((t - 0.2) / 0.4) : 1 - ko;
  const totem = ease((t - 2.3) / 0.5);
  const free = t >= 3.45;
  const trainersVis = (i: number) => (t < 4.9 ? back((t - 3.01 - i * 0.08) / 0.4) : t < 31.8 ? 1 - ease((t - 4.9) / 0.3) : back((t - 31.9 - i * 0.08) / 0.4));
  const showHookProps = t < 5.2;
  return (
    <group>
      <Island p={ST.hook} top="#9C6A3A" side="#5A3A22" label={tex.lblHook} t={t} />
      {/* gold plaque on posts */}
      {showHookProps && (
        <group position={[x - 1.7, 0.4, z - 1.2]} scale={Math.max(0.001, back((t - 1.15) / 0.4))}>
          <ToyBox p={[0, 0.9, -0.05]} s={[0.18, 1.8, 0.18]} color="#3A2418" />
          <group position={[0, 2.25, 0]} rotation={[-0.12, 0.25, 0]}>
            <ToyBox p={[0, 0, -0.08]} s={[2.35, 1.5, 0.12]} color="#1A1410" />
            <mesh><planeGeometry args={[2.25, 1.4]} /><meshBasicMaterial map={price} toneMapped={false} /></mesh>
          </group>
        </group>
      )}
      {/* wallet losing coins */}
      {showHookProps && (
        <group position={[x - 0.2, 0.4, z - 0.4]} rotation={[0, -0.3, t > 1.6 && t < 2.38 ? Math.sin(t * 30) * 0.08 : 0]} scale={Math.max(0.001, back((t - 1.45) / 0.35))}>
          <ToyBox p={[0, 0.35, 0]} s={[1.1, 0.7, 0.36]} color="#8A5A35" top="#A06C42" />
          <ToyBox p={[0.3, 0.35, 0.2]} s={[0.4, 0.3, 0.08]} color="#F2B92A" />
        </group>
      )}
      {t > 1.62 && t < 2.6 && Array.from({ length: 7 }).map((_, i) => {
        const k = ((t - 1.62 - i * 0.1) % 0.8) / 0.8;
        if (t < 1.62 + i * 0.1) return null;
        return <Coin3D key={i} p={[x - 0.2 - k * (2 + i * 0.3), 1.2 + Math.sin(k * Math.PI) * 1.6, z - 0.4 + k * 1.2]} rot={[k * 9, k * 4, i]} />;
      })}
      {/* coach gets knocked away when Claude arrives */}
      {coachVis > 0.01 && <Bud kind="coach" p={[x - 1.3 - 5 * ko, 0.4 + Math.sin(ko * Math.PI) * 2.4, z + 0.6]} rot={[0, 0, ko * 6]} t={t} seed={2} vis={coachVis} talk={t > 0.5 && t < 2.2} />}
      {/* Claude totem rising */}
      {totem > 0.01 && t < 31.8 && (
        <group position={[x + 1.0, 0.4 - 4.5 * (1 - totem), z - 1.9]}>
          <ToyBox p={[0, 1.1, 0]} s={[1.0, 2.2, 1.0]} color="#EAE3D5" top="#F4EFE5" />
          <group position={[0, 3.3, 0.1]} rotation={[-0.15, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[1.25, 1.25, 0.28, 40]} />
              <meshStandardMaterial attach="material-0" color={INK} />
              <meshStandardMaterial attach="material-1" map={tex.claude} />
              <meshStandardMaterial attach="material-2" color={INK} />
            </mesh>
          </group>
          <mesh position={[0, 6, 0]}>
            <cylinderGeometry args={[1.2, 1.6, 12, 24, 1, true]} />
            <meshBasicMaterial color="#FFD9B0" transparent opacity={0.08 + 0.05 * Math.sin(t * 6)} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
          </mesh>
          <pointLight position={[0, 3.3, 1.2]} intensity={14 * totem} distance={6} color="#FFB48A" />
        </group>
      )}
      {(["athletik", "physio", "kraft", "explosiv"] as const).map((k, i) => {
        const v = trainersVis(i);
        return v > 0.01 ? <Bud key={k} kind={k} p={[x - 2.6 + i * 1.75, 0.4, z + 1.2]} t={t} seed={i} s={0.75} vis={v} lift={free ? Math.abs(Math.sin(t * 6 + i)) * 0.5 : 0} talk={t > 33} /> : null;
      })}
      <Burst3D at={3.45} t={t} p={[x, 1.5, z + 0.6]} colors={["#2FBF71", "#FFFFFF", "#FFE27A", ORANGE]} n={26} power={1.3} />
      <CoinRain3D at={3.5} t={t} c={[x, 0.4, z]} spread={6} />
      {[3.01, 3.09, 3.17, 3.25].map((a, i) => <Burst3D key={i} at={a} t={t} p={[x - 2.6 + i * 1.75, 1.0, z + 1.2]} colors={["#FFFFFF", "#FFE27A"]} n={8} power={0.6} />)}
      <Sign p={[x, 4.6, z - 0.2]} tex={tex.kostenlos} w={3.4} h={0.95} t={t} at={3.45} until={4.9} rot={[-0.35, 0, -0.08]} />
    </group>
  );
};

const DeskStation: React.FC<{ t: number; tex: Tex; screen: THREE.Texture }> = ({ t, tex, screen }) => {
  const [x, , z] = ST.s1;
  const typing = isTyping(S1_SPEC.prompt, t);
  const hit = typing ? Math.floor(t * 18) : -1;
  return (
    <group>
      <Island p={ST.s1} top="#3F6E9C" side="#24405E" label={tex.lbl1} t={t} />
      <ToyBox p={[x, 1.05, z - 1.2]} s={[3.8, 0.16, 1.5]} color="#7A4A26" top="#A86A3C" />
      {[[-1.7, -0.6], [1.7, -0.6], [-1.7, 0.6], [1.7, 0.6]].map(([dx, dz], i) => <ToyBox key={i} p={[x + dx, 0.72, z - 1.2 + dz]} s={[0.16, 0.65, 0.16]} color="#4A2C16" />)}
      <Monitor p={[x, 3.0, z - 1.55]} w={3.4} h={3.02} tex={screen} t={t} stand={0.35} />
      {/* keyboard with flashing keys */}
      <group position={[x - 1.05, 1.16, z - 0.75]} rotation={[0, 0.35, 0]}>
        <ToyBox p={[0, 0, 0]} s={[1.5, 0.1, 0.55]} color="#E9E4DA" />
        {Array.from({ length: 24 }).map((_, i) => {
          const on = hit >= 0 && ((rnd(hit + i * 0.1) * 24) | 0) === i;
          return <ToyBox key={i} p={[-0.62 + (i % 8) * 0.177, 0.07 - (on ? 0.03 : 0), -0.16 + Math.floor(i / 8) * 0.16]} s={[0.13, 0.06, 0.12]} color={on ? ORANGE : "#FBF8F2"} cast={false} />;
        })}
      </group>
      {/* shaker + apple on the desk */}
      <mesh position={[x + 1.4, 1.45, z - 0.8]} castShadow><cylinderGeometry args={[0.17, 0.14, 0.6, 12]} /><meshStandardMaterial color="#2B2F3A" /></mesh>
      <mesh position={[x + 1.4, 1.8, z - 0.8]}><cylinderGeometry args={[0.14, 0.17, 0.12, 12]} /><meshStandardMaterial color="#FF8A4C" /></mesh>
      <mesh position={[x + 0.9, 1.3, z - 0.55]} castShadow><sphereGeometry args={[0.17, 10, 8]} /><meshStandardMaterial color="#D9483E" flatShading /></mesh>
      {/* typed key words pop out as cards above the monitor */}
      {[{ k: "ziel", at: 5.65 }, { k: "zeit", at: 6.4 }, { k: "knie", at: 7.1 }].map((c, i) => (
        <Sign key={c.k} p={[x - 1.25 + i * 1.25, 5.0 + (i % 2) * 0.2, z - 1.3]} tex={tex[c.k]} w={1.15} h={0.55} t={t} at={c.at} until={8.6} rot={[-0.15, 0, [-0.08, 0.06, -0.04][i]]} />
      ))}
      {[5.65, 6.4, 7.1].map((a, i) => <Burst3D key={i} at={a} t={t} p={[x - 1.25 + i * 1.25, 5.0, z - 1.3]} colors={["#FFE27A", "#FFFFFF"]} n={8} power={0.5} floor={1.2} />)}
    </group>
  );
};

const PhotoStation: React.FC<{ t: number; tex: Tex; screen: THREE.Texture }> = ({ t, tex, screen }) => {
  const [x, , z] = ST.s2;
  const vs = back((t - 10.11) / 0.35);
  return (
    <group>
      <Island p={ST.s2} top="#7A58A8" side="#46306A" label={tex.lbl2} t={t} />
      <Monitor p={[x, 3.15, z - 2.0]} w={3.2} h={2.85} tex={screen} t={t} stand={0.95} />
      {/* gym diorama */}
      <group position={[x - 0.6, 0.4, z + 0.4]}>
        <ToyBox p={[0, 0.06, 0]} s={[1.7, 0.12, 1.3]} color="#2F6E8F" top="#3C88AE" />
        <ToyBox p={[-0.55, 0.75, -0.3]} s={[0.12, 1.3, 0.12]} color="#22202A" />
        <ToyBox p={[0.55, 0.75, -0.3]} s={[0.12, 1.3, 0.12]} color="#22202A" />
        <ToyBox p={[0, 1.15, -0.3]} s={[1.6, 0.07, 0.07]} color="#B8C0CC" />
        <ToyBox p={[-0.72, 1.15, -0.3]} s={[0.1, 0.45, 0.45]} color="#E8574E" />
        <ToyBox p={[0.72, 1.15, -0.3]} s={[0.1, 0.45, 0.45]} color="#E8574E" />
        <ToyBox p={[0, 0.32, 0.25]} s={[1.0, 0.18, 0.36]} color="#1E1A18" top="#3A3434" />
      </group>
      {/* living room diorama */}
      <group position={[x + 1.4, 0.4, z + 0.4]}>
        <ToyBox p={[0, 0.04, 0]} s={[1.5, 0.08, 1.3]} color="#E9C46A" top="#F2D58C" />
        <ToyBox p={[0, 0.32, -0.25]} s={[1.3, 0.35, 0.55]} color="#9B57D6" top="#C77DFF" />
        <ToyBox p={[0, 0.7, -0.5]} s={[1.3, 0.5, 0.2]} color="#9B57D6" />
        <ToyBox p={[-0.62, 0.5, -0.25]} s={[0.16, 0.5, 0.6]} color="#7E43B5" />
        <ToyBox p={[0.62, 0.5, -0.25]} s={[0.16, 0.5, 0.6]} color="#7E43B5" />
        <mesh position={[0.55, 0.42, 0.35]} castShadow><cylinderGeometry args={[0.16, 0.12, 0.3, 10]} /><meshStandardMaterial color="#B5703A" /></mesh>
        <mesh position={[0.55, 0.75, 0.35]} castShadow><coneGeometry args={[0.28, 0.6, 7]} /><meshStandardMaterial color="#3C8A3A" flatShading /></mesh>
      </group>
      <Sign p={[x - 0.6, 2.25, z + 0.8]} tex={tex.gym} w={1.4} h={0.5} t={t} at={9.71} until={11.6} rot={[-0.3, 0.1, -0.05]} />
      <Sign p={[x + 1.4, 2.25, z + 0.8]} tex={tex.wohn} w={1.9} h={0.5} t={t} at={10.36} until={11.6} rot={[-0.3, -0.1, 0.05]} />
      {vs > 0.01 && (
        <group position={[x + 0.4, 1.6, z + 1.2]} rotation={[Math.PI / 2 - 0.35, 0, t * 2]} scale={vs}>
          <mesh>
            <cylinderGeometry args={[0.42, 0.42, 0.12, 28]} />
            <meshStandardMaterial attach="material-0" color="#B23A33" />
            <meshStandardMaterial attach="material-1" map={tex.vs} />
            <meshStandardMaterial attach="material-2" map={tex.vs} />
          </mesh>
        </group>
      )}
      <Burst3D at={9.71} t={t} p={[x - 0.6, 1.6, z + 0.4]} colors={["#5FD3E0", "#FFFFFF"]} n={10} power={0.6} />
      <Burst3D at={10.36} t={t} p={[x + 1.4, 1.6, z + 0.4]} colors={["#C77DFF", "#FFFFFF"]} n={10} power={0.6} />
      <pointLight position={[x - 1.6, 2.0, z + 1.6]} intensity={60 * bump(t, 8.42, 0.12)} distance={7} color="#FFFFFF" />
    </group>
  );
};

const EX = [
  { kind: "kraft" as const, ok: 19.1, dx: -1.2, dz: 0.9, lbl: "lblSquat" },
  { kind: "athletik" as const, ok: 19.4, dx: 1.2, dz: 0.9, lbl: "lblPush" },
  { kind: "physio" as const, ok: 19.7, dx: -1.2, dz: -1.3, lbl: "lblLunge" },
  { kind: "explosiv" as const, ok: 20.0, dx: 1.2, dz: -1.3, lbl: "lblBox" },
];
const CheckStation: React.FC<{ t: number; tex: Tex; bar: THREE.Texture }> = ({ t, tex, bar }) => {
  const [x, , z] = ST.s4;
  const idx = Math.max(0, EX.findIndex((e) => t < e.ok + 0.05));
  const prev = EX[Math.max(0, idx - 1)], cur = EX[idx === -1 ? 3 : idx];
  const k = idx <= 0 ? 1 : ease((t - prev.ok) / 0.22);
  const mx = x + prev.dx + (cur.dx - prev.dx) * k, mz = z + prev.dz + (cur.dz - prev.dz) * k;
  const done = t >= 20.21;
  return (
    <group>
      <Island p={ST.s4} r={4.0} top="#B8693A" side="#6E3A1E" label={tex.lbl4} t={t} />
      {EX.map((e, i) => {
        const px = x + e.dx, pz = z + e.dz;
        const ok = t >= e.ok;
        const ph = t * 4 + i;
        const sq = Math.abs(Math.sin(ph));
        const exProps =
          e.kind === "kraft" ? { sy: 1 - 0.25 * sq, lift: 0 } :
          e.kind === "athletik" ? { rot: [-1.25, 0, 0] as V3, lift: 0.1 + 0.25 * sq } :
          e.kind === "physio" ? { rot: [0, 0, 0.25 * Math.sin(ph)] as V3, lift: 0.1 * sq } :
          { lift: Math.max(0, Math.sin(ph * 0.8)) * 0.9 };
        const flip = ok ? Math.PI * 2 * ease((t - e.ok) / 0.35) : 0;
        return (
          <group key={i}>
            <ToyBox p={[px, 0.47, pz]} s={[2.0, 0.1, 1.7]} color={["#E8574E", "#4F8BE0", "#2FBF71", "#F0C04C"][i]} top={["#F07A70", "#77A6EA", "#5CD394", "#F6D27A"][i]} />
            {e.kind === "explosiv" && <ToyBox p={[px + 0.55, 0.75, pz - 0.3]} s={[0.6, 0.5, 0.6]} color="#8A5A35" top="#A06C42" />}
            <Bud kind={e.kind} p={[px - (e.kind === "explosiv" ? 0.15 : 0), 0.52, pz]} t={t} seed={i} s={0.8} {...exProps} />
            <group position={[px, 2.65 + Math.sin(t * 3 + i) * 0.08, pz]} rotation={[-0.3, flip, 0]} scale={back((t - 18.0 - i * 0.1) / 0.4)}>
              <mesh>
                <circleGeometry args={[0.38, 28]} />
                <meshBasicMaterial map={ok ? tex.ok : tex.no} toneMapped={false} side={THREE.DoubleSide} />
              </mesh>
            </group>
            <Sign p={[px, 0.95, pz + 0.9]} tex={tex[e.lbl]} w={1.7} h={0.36} t={t} at={18.0 + i * 0.1} rot={[-0.7, 0, 0]} bob={0} />
            {ok && <Burst3D at={e.ok} t={t} p={[px, 2.6, pz]} colors={["#2FBF71", "#FFFFFF", "#FFE27A"]} n={12} power={0.6} floor={0.5} />}
          </group>
        );
      })}
      {/* magnifier gliding over the pad that is being checked */}
      {t > 18.3 && t < 20.5 && (
        <group position={[mx + 0.4, 1.75 + Math.sin(t * 5) * 0.1, mz + 0.3]} rotation={[-0.9, 0, -0.5]}>
          <mesh><torusGeometry args={[0.42, 0.08, 10, 28]} /><meshStandardMaterial color="#2A2420" /></mesh>
          <mesh><circleGeometry args={[0.4, 28]} /><meshBasicMaterial color="#D5F1FF" transparent opacity={0.45} /></mesh>
          <mesh position={[0.45, -0.45, 0]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.14, 0.6, 0.14]} /><meshStandardMaterial color="#8A5A35" /></mesh>
        </group>
      )}
      {/* KÖRPER-FIT bar on a stand */}
      <group position={[x, 0.4, z - 3.15]} scale={back((t - 18.25) / 0.4)}>
        <ToyBox p={[-1.5, 0.35, 0]} s={[0.12, 0.7, 0.12]} color="#2A1A12" />
        <ToyBox p={[1.5, 0.35, 0]} s={[0.12, 0.7, 0.12]} color="#2A1A12" />
        <group position={[0, 0.9, 0]} rotation={[-0.45, 0, 0]}>
          <ToyBox p={[0, 0, -0.06]} s={[3.6, 0.6, 0.1]} color="#1A1410" />
          <mesh><planeGeometry args={[3.5, 0.52]} /><meshBasicMaterial map={bar} toneMapped={false} /></mesh>
        </group>
      </group>
      <Sign p={[x, 3.7, z - 0.2]} tex={tex.passt} w={2.8} h={0.8} t={t} at={20.21} until={21.6} rot={[-0.45, 0, -0.06]} />
      <Burst3D at={20.21} t={t} p={[x, 2.0, z]} colors={["#2FBF71", "#FFE27A", "#FFFFFF", ORANGE]} n={26} power={1.3} />
      <CoinRain3D at={20.3} t={t} c={[x, 0.4, z]} spread={6} h={3.5} dur={1.6} />
      <pointLight position={[x, 4, z + 1]} intensity={8 + (done ? 10 : 0)} distance={9} color={done ? "#9DFFC4" : "#FFB45A"} />
    </group>
  );
};

const FormStation: React.FC<{ t: number; tex: Tex; screen: THREE.Texture }> = ({ t, tex, screen }) => {
  const [x, , z] = ST.s5;
  const talking = t > 22.85 && t < 24.1;
  return (
    <group>
      <Island p={ST.s5} top="#3E8A5E" side="#22553A" label={tex.lbl5} t={t} />
      {/* big screen on posts behind */}
      <ToyBox p={[x - 1.75, 2.3, z - 2.3]} s={[0.2, 4.0, 0.2]} color="#2A2420" />
      <ToyBox p={[x + 1.75, 2.3, z - 2.3]} s={[0.2, 4.0, 0.2]} color="#2A2420" />
      <Monitor p={[x, 4.35, z - 2.2]} w={3.2} h={2.85} tex={screen} t={t} />
      <ToyBox p={[x, 0.44, z + 0.6]} s={[2.4, 0.06, 1.5]} color="#4FB0E8" top="#7CC6F0" />
      {/* tripod + phone filming the squat */}
      <group position={[x + 1.9, 0.4, z + 1.5]} rotation={[0, -0.9, 0]}>
        {[-0.25, 0.25].map((dx) => <ToyBox key={dx} p={[dx, 0.55, 0]} s={[0.06, 1.1, 0.06]} color="#2A2420" rot={[0, 0, dx]} />)}
        <ToyBox p={[0, 1.2, 0]} s={[0.08, 0.3, 0.08]} color="#2A2420" />
        <ToyBox p={[0, 1.6, 0]} s={[0.5, 0.85, 0.08]} color="#1E1A18" />
        <mesh position={[0.15, 1.95, -0.05]}><sphereGeometry args={[0.06, 8, 6]} /><meshBasicMaterial color={Math.floor(t * 2) % 2 ? "#FF3B30" : "#5A1A16"} toneMapped={false} /></mesh>
      </group>
      <Bud kind="physio" p={[x - 2.1, 0.4, z + 0.9]} t={t} seed={1} s={0.9} yaw={0.6} talk={talking} />
      <Sign p={[x, 3.3, z + 1.6]} tex={tex.knieok} w={2.4} h={0.7} t={t} at={24.21} until={25.6} rot={[-0.35, 0, 0.05]} />
      <Burst3D at={24.21} t={t} p={[x, 1.2, z + 0.6]} colors={["#2FBF71", "#FFFFFF"]} n={16} power={0.8} />
    </group>
  );
};

const AppStation: React.FC<{ t: number; tex: Tex; screen: THREE.Texture; app: THREE.Texture }> = ({ t, tex, screen, app }) => {
  const [x, , z] = ST.s6;
  const rise = back((t - 26.84) / 0.5);
  return (
    <group>
      <Island p={ST.s6} top="#7E6AB8" side="#4A3C78" label={tex.lbl6} t={t} />
      <Monitor p={[x - 1.0, 3.35, z - 1.9]} w={2.9} h={2.58} tex={screen} t={t} stand={1.3} />
      {/* phone rising out of the island */}
      {rise > 0.01 && (
        <group position={[x + 1.25, 0.4 + 1.85 * rise - 2.5 * (1 - rise), z - 0.2]} rotation={[-0.08, -0.35, 0]}>
          <ToyBox p={[0, 0, -0.1]} s={[1.85, 3.6, 0.22]} color="#1E1A18" />
          <mesh position={[0, 0, 0.015]}><planeGeometry args={[1.6, 3.3]} /><meshBasicMaterial map={app} toneMapped={false} /></mesh>
        </group>
      )}
      {/* build cubes flying from the screen into the phone */}
      {t > 26.8 && t < 27.6 && Array.from({ length: 14 }).map((_, i) => {
        const k = cl((t - 26.8 - i * 0.03) / 0.45);
        if (k <= 0 || k >= 1) return null;
        const p = bez3([x - 1.0 + (rnd(i) - 0.5) * 2, 3.2 + (rnd(i + 2) - 0.5) * 1.6, z - 1.7], [x + 0.5, 5.5, z - 0.5], [x + 1.4, 2.2, z - 0.1], k);
        return <mesh key={i} position={p} rotation={[k * 6, k * 4, 0]}><boxGeometry args={[0.16, 0.16, 0.16]} /><meshBasicMaterial color={["#C9B6FF", ORANGE, "#FFFFFF", "#FFD27A"][i % 4]} toneMapped={false} /></mesh>;
      })}
      <Sign p={[x + 1.0, 4.5, z + 0.2]} tex={tex.app} w={1.8} h={0.5} t={t} at={27.1} until={29.2} rot={[-0.3, -0.3, -0.06]} />
      <Burst3D at={26.95} t={t} p={[x + 1.4, 1.2, z]} colors={["#C9B6FF", "#FFFFFF", "#FFE27A"]} n={20} power={1.0} />
      <Burst3D at={28.15} t={t} p={[x + 1.4, 2.5, z + 0.3]} colors={["#2FBF71", "#FFFFFF"]} n={14} power={0.7} />
      <pointLight position={[x + 1.4, 3, z + 1.5]} intensity={rise * (10 + 4 * Math.sin(t * 6))} distance={6} color="#C9B6FF" />
    </group>
  );
};

const CtaPanels: React.FC<{ t: number; list: THREE.Texture; comment: THREE.Texture }> = ({ t, list, comment }) => {
  const r1 = ease((t - 31.8) / 0.6), r2 = back((t - 33.3) / 0.45);
  if (t < 31.7) return null;
  return (
    <group>
      <group position={[0, 7.6 - 9 * (1 - r1), -2.2]} rotation={[-0.2, 0, 0]}>
        <ToyBox p={[0, 0, -0.1]} s={[6.7, 4.55, 0.18]} color="#1A1410" />
        <mesh><planeGeometry args={[6.5, 4.35]} /><meshBasicMaterial map={list} toneMapped={false} /></mesh>
        {[-2.6, 2.6].map((dx) => <ToyBox key={dx} p={[dx, -4.6, -0.2]} s={[0.25, 5, 0.25]} color="#2A1A12" />)}
      </group>
      {r2 > 0.01 && (
        <group position={[0, 4.15, -1.0]} rotation={[-0.3, 0, 0]} scale={r2}>
          <ToyBox p={[0, 0, -0.1]} s={[6.5, 2.2, 0.18]} color="#1A1410" />
          <mesh><planeGeometry args={[6.3, 2.0]} /><meshBasicMaterial map={comment} toneMapped={false} /></mesh>
        </group>
      )}
    </group>
  );
};

// world décor: floor, back wall, glowing paths, props, motes
const PATHS: [V3, V3][] = [[ST.hook, ST.s1], [ST.s1, ST.s2], [ST.s2, [0, 0, -14]], [[0, 0, -20], ST.s4], [ST.s4, ST.s5], [ST.s5, ST.s6], [ST.s6, [3, 0, -20]]];
const Decor: React.FC<{ t: number; tex: Tex }> = ({ t, tex }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -16]} receiveShadow>
      <planeGeometry args={[140, 140]} />
      <meshStandardMaterial map={tex.floor} roughness={0.9} />
    </mesh>
    <mesh position={[0, 9, -46]} receiveShadow>
      <boxGeometry args={[90, 18, 0.5]} />
      <meshStandardMaterial map={tex.wall} roughness={0.85} />
    </mesh>
    {/* rug under the table */}
    <ToyBox p={[0, 0.02, -20.6]} s={[10, 0.04, 16]} color="#5A2E2A" top="#6E3A33" cast={false} />
    {PATHS.flatMap(([a, b], j) => {
      const d = Math.hypot(b[0] - a[0], b[2] - a[2]);
      const n = Math.floor(d / 1.1);
      return Array.from({ length: n }).map((_, i) => {
        const k = (i + 0.5) / n;
        const px = a[0] + (b[0] - a[0]) * k, pz = a[2] + (b[2] - a[2]) * k;
        if (Math.hypot(px - a[0], pz - a[2]) < 4.1 || Math.hypot(px - b[0], pz - b[2]) < 4.1) return null;
        return (
          <mesh key={`${j}-${i}`} position={[px, 0.04, pz]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.45, 0.45]} />
            <meshBasicMaterial color="#FFD27A" transparent opacity={0.25 + 0.35 * Math.max(0, Math.sin(t * 4 - i * 0.6 - j))} toneMapped={false} />
          </mesh>
        );
      });
    })}
    {/* scattered gym props */}
    {Array.from({ length: 16 }).map((_, i) => {
      const a = rnd(i + 40) * Math.PI * 2, r = 18 + rnd(i + 41) * 10;
      const px = Math.cos(a) * r * 0.9, pz = -16 + Math.sin(a) * r * 0.8;
      const kind = i % 4;
      if (pz > -2) return null;
      return (
        <group key={i} position={[px, 0, pz]} rotation={[0, a, 0]}>
          {kind === 0 && <><ToyBox p={[0, 0.25, 0]} s={[1.6, 0.12, 0.12]} color="#B8C0CC" /><ToyBox p={[-0.75, 0.25, 0]} s={[0.2, 0.55, 0.55]} color="#22202A" /><ToyBox p={[0.75, 0.25, 0]} s={[0.2, 0.55, 0.55]} color="#22202A" /></>}
          {kind === 1 && <><mesh position={[0, 0.4, 0]} castShadow><cylinderGeometry args={[0.35, 0.28, 0.8, 10]} /><meshStandardMaterial color="#B5703A" /></mesh><mesh position={[0, 1.3, 0]} castShadow><coneGeometry args={[0.7, 1.4, 7]} /><meshStandardMaterial color="#3C8A3A" flatShading /></mesh></>}
          {kind === 2 && <ToyBox p={[0, 0.5, 0]} s={[1.0, 1.0, 1.0]} color="#8A5A35" top="#A06C42" />}
          {kind === 3 && <mesh position={[0, 0.45, 0]} castShadow><sphereGeometry args={[0.45, 12, 10]} /><meshStandardMaterial color={i % 8 === 3 ? "#2FBF71" : "#E8574E"} flatShading /></mesh>}
        </group>
      );
    })}
    {Array.from({ length: 140 }).map((_, i) => {
      const px = (rnd(i) - 0.5) * 44, pz = 6 - rnd(i + 9) * 46;
      const y = 0.8 + ((rnd(i + 3) * 7 + t * (0.25 + rnd(i + 5) * 0.3)) % 7);
      return (
        <mesh key={i} position={[px + Math.sin(t + i) * 0.2, y, pz]}>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshBasicMaterial color={i % 3 ? "#FFF2C6" : "#CFFFD9"} transparent opacity={0.45 + 0.45 * Math.sin(t * 3 + i)} toneMapped={false} />
        </mesh>
      );
    })}
  </group>
);

// Sir Token travelling from island to island
type SirKey = { a: number; b: number; p: V3; yaw: number };
const SIR_KEYS: SirKey[] = [
  { a: 0, b: 4.35, p: [2.2, 0.4, -0.2], yaw: -0.35 },
  { a: 4.85, b: 7.65, p: [-11.0, 0.4, -6.4], yaw: 0.6 },
  { a: 8.1, b: 10.75, p: [11.5, 0.4, -8.0], yaw: -0.55 },
  { a: 17.9, b: 20.75, p: [-16.4, 0.4, -20.8], yaw: 0.7 },
  { a: 21.2, b: 24.9, p: [-13, 0.44, -33.4], yaw: 0 },
  { a: 25.5, b: 28.5, p: [9.8, 0.4, -26.0], yaw: 0.45 },
  { a: 31.9, b: 40, p: [2.6, 0.4, 0.7], yaw: -0.3 },
];
const sirAt = (t: number) => {
  for (let i = 0; i < SIR_KEYS.length; i++) {
    const s = SIR_KEYS[i];
    if (t <= s.b) {
      if (t >= s.a || i === 0) return { p: s.p, yaw: s.yaw, hop: 0, key: i };
      const pr = SIR_KEYS[i - 1];
      const k = inOut((t - pr.b) / (s.a - pr.b));
      const p = lerp3(pr.p, s.p, k);
      return { p: [p[0], p[1] + Math.sin(k * Math.PI) * 3, p[2]] as V3, yaw: pr.yaw + (s.yaw - pr.yaw) * k, hop: k, key: -i };
    }
  }
  return { p: SIR_KEYS[SIR_KEYS.length - 1].p, yaw: -0.3, hop: 0, key: SIR_KEYS.length - 1 };
};
const sirVis = (t: number) => (t < 10.75 ? 1 : t < 11.05 ? 1 - ease((t - 10.75) / 0.3) : t < 17.9 ? 0 : t < 28.5 ? back((t - 17.9) / 0.35) : t < 31.85 ? 1 - ease((t - 28.5) / 0.3) : back((t - 31.85) / 0.35));
const tableSirVis = (t: number) => (t < 10.8 ? 0 : t < 18.0 ? back((t - 10.8) / 0.4) : t < 28.4 ? 1 - ease((t - 18.0) / 0.3) : t < 31.9 ? back((t - 28.4) / 0.4) : 1 - ease((t - 31.9) / 0.3));

const World: React.FC<{ t: number; tex: Tex; dyn: Record<string, THREE.Texture> }> = ({ t, tex, dyn }) => {
  const cam = camAt(t);
  const punch = Math.max(0, ...PUNCH.map((p) => bump(t, p, 0.22)));
  const sir = sirAt(t);
  const typing1 = isTyping(S1_SPEC.prompt, t), typing6 = isTyping(S6_SPEC.prompt, t);
  const osc = Math.sin(t * 22) * 25;
  let armL = 20 + 6 * Math.sin(t * 3), armR = 20 - 6 * Math.sin(t * 3), squat = 0, lift = 0;
  let hand: React.ReactNode = null, knee: string | undefined;
  if (sir.key < 0 || sir.hop) { armL = armR = 150; }
  else if (sir.key === 0) {
    if (t > 1.25 && t < 2.38) { armL = armR = 150; }
    if (t >= 3.45) { armL = armR = 165; lift = Math.max(0, Math.sin(((t - 3.45) / 0.6) * Math.PI)) * (t < 4.05 ? 1.6 : 0); }
  } else if (sir.key === 1) {
    if (typing1) { armL = 75 + osc; armR = 75 - osc; }
    if (t > 7.48) { armR = 170; lift = t < 8.1 ? Math.sin(((t - 7.48) / 0.6) * Math.PI) * 1.0 : 0; }
  } else if (sir.key === 2) {
    armR = 85; armL = t > 9.71 ? 140 + 20 * Math.sin(t * 9) : 25;
    hand = (
      <group rotation={[0, 0, -Math.PI / 2]}>
        <ToyBox p={[0, 0, 0]} s={[1.1, 0.75, 0.6]} color="#2A2630" />
        <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.24, 0.28, 0.3, 14]} /><meshStandardMaterial color="#111" /></mesh>
        <mesh position={[0.35, 0.42, 0]}><boxGeometry args={[0.3, 0.12, 0.3]} /><meshBasicMaterial color={bump(t, 8.42, 0.12) > 0 ? "#FFFFFF" : "#555"} toneMapped={false} /></mesh>
      </group>
    );
  } else if (sir.key === 3) {
    armR = t >= 20.21 ? 170 : 115 + 10 * Math.sin(t * 4); armL = t >= 20.21 ? 170 : 25;
    lift = t >= 20.21 && t < 20.8 ? Math.sin(((t - 20.21) / 0.6) * Math.PI) * 1.2 : 0;
  } else if (sir.key === 4) {
    squat = Math.abs(Math.sin((t - 21.2) * 2.2)) * (t < 24.25 ? 1 : 0.4);
    armL = armR = 95;
    knee = t > 23.9 ? (t >= 24.21 ? "#2FBF71" : "#E5534B") : undefined;
  } else if (sir.key === 5) {
    if (typing6) { armL = 75 + osc; armR = 75 - osc; }
    if (t > 26.84) { armL = armR = 160 + 10 * Math.sin(t * 8); lift = t < 27.5 ? Math.sin(((t - 26.84) / 0.6) * Math.PI) : 0; }
  } else if (sir.key === 6) {
    armL = 25; armR = 130 + 25 * Math.sin(t * 9);
    lift = t > 34.57 && t < 35.2 ? Math.sin(((t - 34.57) / 0.6) * Math.PI) * 1.4 : 0;
  }
  const look = cam.look;
  const camD = Math.hypot(cam.pos[0] - sir.p[0], cam.pos[1] - sir.p[1] - 1.2, cam.pos[2] - sir.p[2]);
  const sunday = t >= 24.5;
  const lightTarget = React.useMemo(() => new THREE.Object3D(), []);
  lightTarget.position.set(look[0], 0, look[2]);
  lightTarget.updateMatrixWorld();
  return (
    <>
      <CameraRig pos={cam.pos} look={look} fov={50 - 3.5 * punch} />
      <color attach="background" args={["#1A100C"]} />
      <fog attach="fog" args={["#1A100C", 20, 58]} />
      <ambientLight intensity={0.45} color="#FFE6C4" />
      <hemisphereLight args={["#FFE2B8", "#3A2418", 0.6]} />
      <primitive object={lightTarget} />
      <directionalLight position={[look[0] + 6, 16, look[2] + 9]} target={lightTarget} intensity={1.7} color="#FFE9CF" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-camera-far={60} shadow-bias={-0.0015} shadow-normalBias={0.04} />
      <Decor t={t} tex={tex} />
      <HookStation t={t} tex={tex} price={dyn.price} />
      <DeskStation t={t} tex={tex} screen={dyn.s1} />
      <PhotoStation t={t} tex={tex} screen={dyn.s2} />
      <group position={TO}>
        <TableSet t={t} tex={tex} mode={sunday ? SUNDAY_W : MODE_TRICK} world sirVis={tableSirVis(t)} />
      </group>
      <Sign p={[1.5, 6.9, -22.5]} tex={tex.gleich} w={3.4} h={0.85} t={t} at={13.1} until={17.6} rot={[-0.35, -0.2, 0.08]} />
      <Sign p={[1.8, 4.6, -18.8]} tex={tex.angepasst} w={3.2} h={0.85} t={t} at={31.1} until={32.4} rot={[-0.4, 0.75, 0]} />
      <CheckStation t={t} tex={tex} bar={dyn.bar} />
      <FormStation t={t} tex={tex} screen={dyn.s5} />
      <AppStation t={t} tex={tex} screen={dyn.s6} app={dyn.app} />
      <CtaPanels t={t} list={dyn.list} comment={dyn.comment} />
      <CoinRain3D at={34.6} t={t} c={[0, 2, 0]} spread={7} n={30} dur={3} />
      <Burst3D at={34.57} t={t} p={[0, 4.2, -0.8]} colors={["#3BA9E0", "#FFFFFF", "#FFE27A", "#2FBF71"]} n={24} power={1.2} />
      <SirW p={sir.p} yaw={sir.yaw} t={t} face={tex.face} armL={Math.round(armL)} armR={Math.round(armR)} squat={squat} lift={lift} vis={sirVis(t) * cl((camD - 3.5) / 2.5)} hand={hand} knee={knee} />
    </>
  );
};

// ---------- dynamic screens ----------
const useDynScreens = (t: number, logo: HTMLImageElement | null) => {
  const s1 = useDyn(SW, SH, (c) => drawClaude(c, t, S1_SPEC, logo));
  const s2 = useDyn(SW, SH, (c) => drawClaude(c, t, S2_SPEC, logo));
  const s5 = useDyn(SW, SH, (c) => drawClaude(c, t, S5_SPEC, logo));
  const s6 = useDyn(SW, SH, (c) => drawClaude(c, t, S6_SPEC, logo));
  const price = useDyn(600, 372, (c) => {
    const free = t >= 3.45;
    const v = !free ? Math.round(80 * ease((t - 1.25) / 0.45)) : Math.round(80 * (1 - ease((t - 3.45) / 0.3)));
    c.fillStyle = free ? "#2FBF71" : "#FFF3D6"; roundRect(c, 0, 0, 600, 372, 30); c.fill();
    c.fillStyle = free ? "#fff" : "#D9483E"; c.textAlign = "center"; c.textBaseline = "middle";
    c.font = "900 200px Rubik"; c.fillText(`${v} €`, 300, 160);
    c.fillStyle = free ? "#fff" : INK; c.font = "900 58px Rubik"; c.fillText(free ? "KOSTENLOS" : "PRO STUNDE", 300, 310);
  });
  const bar = useDyn(800, 120, (c) => {
    const f = cl((t - 18.52) / (20.21 - 18.52));
    const done = t >= 20.21;
    c.fillStyle = "#1B120C"; roundRect(c, 0, 0, 800, 120, 60); c.fill();
    const g = c.createLinearGradient(0, 0, 0, 120);
    g.addColorStop(0, done ? "#7BE7A5" : "#FFB36B"); g.addColorStop(1, done ? "#2FBF71" : "#E8743A");
    c.fillStyle = g; if (f > 0.02) { roundRect(c, 6, 6, Math.max(108, 788 * f), 108, 54); c.fill(); }
    c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle"; c.font = "900 54px Rubik";
    c.fillText(`KÖRPER-FIT ${Math.round(f * 100)} %`, 400, 64);
  });
  const app = useDyn(480, 990, (c) => {
    c.fillStyle = "#F4EFE5"; roundRect(c, 0, 0, 480, 990, 50); c.fill();
    c.fillStyle = ORANGE; c.fillRect(0, 0, 480, 150);
    c.fillStyle = "#fff"; c.font = "900 48px Rubik"; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("MEIN TRAINING", 34, 92);
    const timer = cl((t - 27.64) / 3);
    const secs = Math.max(0, 45 - Math.floor(Math.max(0, t - 27.64) * 6));
    const pop = 1 + 0.08 * bump(t, 27.64, 0.25);
    c.save(); c.translate(240, 350); c.scale(pop, pop);
    c.lineWidth = 30; c.strokeStyle = "#E2D9C8"; c.beginPath(); c.arc(0, 0, 130, 0, 7); c.stroke();
    c.strokeStyle = ORANGE; c.lineCap = "round"; c.beginPath(); c.arc(0, 0, 130, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - timer)); c.stroke();
    c.fillStyle = INK; c.font = "900 84px Rubik"; c.textAlign = "center"; c.fillText(`0:${String(secs).padStart(2, "0")}`, 0, 6);
    c.restore();
    ["Kniebeuge 3×10", "Liegestütz 3×12", "Ausfallschritt 3×8", "Box-Sprung 3×6"].forEach((it, i) => {
      const s = back((t - 27.0 - i * 0.08) / 0.3);
      if (s < 0.02) return;
      const on = t >= 28.13 + i * 0.12;
      const y = 560 + i * 104;
      c.save(); c.translate(240, y + 42); c.scale(s, s); c.translate(-240, -(y + 42));
      c.fillStyle = INK; roundRect(c, 24, y, 432, 86, 18); c.fill();
      c.fillStyle = on ? "#E3F6EA" : "#fff"; roundRect(c, 30, y + 6, 420, 74, 14); c.fill();
      c.strokeStyle = "#2FBF71"; c.lineWidth = 6; c.fillStyle = on ? "#2FBF71" : "transparent";
      roundRect(c, 50, y + 20, 46, 46, 10); if (on) c.fill(); c.stroke();
      if (on) { c.fillStyle = "#fff"; c.font = "900 38px Rubik"; c.textAlign = "center"; c.fillText("✓", 73, y + 45); }
      c.fillStyle = INK; c.font = "800 34px Rubik"; c.textAlign = "left"; c.fillText(it, 116, y + 44);
      c.restore();
    });
  });
  const list = useDyn(900, 600, (c) => {
    c.fillStyle = "#FFF8EA"; roundRect(c, 0, 0, 900, 600, 30); c.fill();
    c.fillStyle = "#14161F"; roundRect(c, 24, 22, 852, 86, 16); c.fill();
    c.fillStyle = "#FF8A4C"; c.font = "900 50px Rubik"; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("DER 4-TRAINER-PROMPT", 50, 66);
    ["Ziel, Zeit, Schmerzen", "Equipment-Foto", "4 Trainer am Tisch", "Übungs-Check", "Form-Check per Foto", "Deine Trainings-App", "Sonntags-Check-in"].forEach((it, i) => {
      const y = 152 + i * 64;
      const on = t >= 32.15 + i * 0.17;
      c.fillStyle = "#FF8A4C"; c.font = "900 38px Rubik"; c.fillText(String(i + 1), 50, y);
      c.fillStyle = "#161921"; c.font = "800 38px Rubik"; c.fillText(it, 100, y);
      c.strokeStyle = "#2FBF71"; c.lineWidth = 5; c.fillStyle = "#2FBF71";
      roundRect(c, 800, y - 24, 48, 48, 10); if (on) c.fill(); c.stroke();
      if (on) { c.fillStyle = "#fff"; c.textAlign = "center"; c.fillText("✓", 824, y + 2); c.textAlign = "left"; }
    });
  });
  const comment = useDyn(900, 290, (c) => {
    const at = 33.47, kw = "TRAINER";
    const typed = kw.slice(0, Math.max(0, Math.floor((t - at - 0.3) * 10)));
    const sent = t >= at + 0.4 + kw.length / 10;
    c.fillStyle = "#FBFAF5"; roundRect(c, 0, 0, 900, 290, 34); c.fill();
    c.fillStyle = "#161921"; c.font = "800 40px Rubik"; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Kommentare", 40, 52);
    c.strokeStyle = sent ? "#2FBF71" : "#FF8A4C"; c.lineWidth = 7; roundRect(c, 30, 100, 840, 150, 75); c.stroke();
    c.fillStyle = "#C8A14C"; c.beginPath(); c.arc(112, 175, 48, 0, 7); c.fill();
    c.fillStyle = "#161921"; c.font = "900 34px Rubik"; c.textAlign = "center"; c.fillText("DU", 112, 177);
    c.textAlign = "left"; c.font = "900 92px Rubik"; c.fillText(typed + (sent || Math.floor(t * 3) % 2 ? "" : "|"), 186, 180);
    c.fillStyle = sent ? "#3BA9E0" : "#C9C9C9"; c.beginPath(); c.arc(790, 175, 52, 0, 7); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.moveTo(768, 150); c.lineTo(822, 175); c.lineTo(768, 200); c.lineTo(778, 175); c.closePath(); c.fill();
    if (sent) { c.fillStyle = "#2FBF71"; roundRect(c, 640, 16, 230, 60, 30); c.fill(); c.fillStyle = "#fff"; c.font = "900 32px Rubik"; c.fillText("✓ gesendet", 664, 48); }
  });
  return { s1, s2, s5, s6, price, bar, app, list, comment };
};

const useWorldTex = (ready: boolean, logo: HTMLImageElement | null, base: Tex | null) =>
  React.useMemo(() => {
    if (!ready || !base) return null;
    const t: Tex = { ...base };
    t.claude = canvasTex(512, 512, (c) => {
      c.fillStyle = "#F4EFE5"; c.fillRect(0, 0, 512, 512);
      c.strokeStyle = INK; c.lineWidth = 26; c.beginPath(); c.arc(256, 256, 236, 0, 7); c.stroke();
      if (logo) c.drawImage(logo, 106, 106, 300, 300);
    });
    t.lblHook = islandTex("€", "PERSONAL TRAINER", "#B8913C");
    t.lbl1 = islandTex("1", "DEIN PROFIL", "#3E7BE0");
    t.lbl2 = islandTex("2", "EQUIPMENT-FOTO", "#8D6CF0");
    t.lbl4 = islandTex("4", "ÜBUNGS-CHECK", "#E0612E");
    t.lbl5 = islandTex("5", "FORM-CHECK", "#2FA866");
    t.lbl6 = islandTex("6", "DEINE APP", "#7E6AB8");
    t.kostenlos = signTex("KOSTENLOS", "#2FBF71", "#FFFFFF", "#FFFFFF");
    t.ziel = signTex("ZIEL", "#FFD27A", INK, INK, 360, 170);
    t.zeit = signTex("ZEIT", "#A7E3FF", INK, INK, 360, 170);
    t.knie = signTex("KNIE", "#FFB3B3", INK, INK, 360, 170);
    t.gym = signTex("GYM", "#DCEBFF", INK, INK, 400, 140);
    t.wohn = signTex("WOHNZIMMER", "#F1E3FF", INK, INK, 540, 140);
    t.vs = canvasTex(256, 256, (c) => { c.fillStyle = "#E5534B"; c.fillRect(0, 0, 256, 256); c.fillStyle = "#fff"; c.font = "900 120px Rubik"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("VS", 128, 136); });
    t.gleich = signTex("GLEICHZEITIG", "#5FD3E0", "#FFFFFF", "#FFFFFF");
    t.angepasst = signTex("ANGEPASST ✓", "#2FBF71", "#FFFFFF", "#FFFFFF");
    t.passt = signTex("PASST ✓", "#2FBF71", "#FFFFFF", "#FFFFFF");
    t.knieok = signTex("KNIE OK ✓", "#2FBF71", "#FFFFFF", "#FFFFFF");
    t.app = signTex("DEINE APP", "#C9B6FF", INK, INK, 520, 150);
    t.lblSquat = signTex("KNIEBEUGE", "#F6EEDC", "#E0612E", INK, 560, 120);
    t.lblPush = signTex("LIEGESTÜTZ", "#F6EEDC", "#3E7BE0", INK, 560, 120);
    t.lblLunge = signTex("AUSFALLSCHRITT", "#F6EEDC", "#2FA866", INK, 560, 120);
    t.lblBox = signTex("BOX-SPRUNG", "#F6EEDC", "#D9A21C", INK, 560, 120);
    const mark = (ok: boolean) => canvasTex(256, 256, (c) => {
      c.fillStyle = "#fff"; c.beginPath(); c.arc(128, 128, 128, 0, 7); c.fill();
      c.fillStyle = ok ? "#2FBF71" : "#E5534B"; c.beginPath(); c.arc(128, 128, 110, 0, 7); c.fill();
      c.fillStyle = "#fff"; c.font = "900 150px Rubik"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(ok ? "✓" : "✗", 128, 138);
    });
    t.ok = mark(true); t.no = mark(false);
    return t;
  }, [ready, logo, base]);

// ---------- audio ----------
type Sfx = [string, number, number];
const SFX: Sfx[] = [
  ...TRANSITS.map((c): Sfx => ["whoosh-quick", c - 0.02, 0.5]),
  ["riser", 10.4, 0.28], ["riser", 31.2, 0.25],
  ...[0.2, 1.2, 1.45, 3.01, 3.09, 3.17, 3.25, 5.65, 6.4, 7.1, 9.71, 10.36, 14.3, 15.05, 15.55, 16.25, 18.0, 18.3, 22.85, 26.84, 27.1, 31.85, 33.3].map((a): Sfx => ["ui-pop", a, 0.4]),
  ["bump", 2.38, 0.4], ["jump", 2.45, 0.25],
  ...[5.05, 7.48, 8.3, 10.42, 21.3, 22.4, 25.5, 26.8].map((a): Sfx => ["click", a, 0.55]),
  ...[8.42, 21.42].map((a): Sfx => ["click", a, 0.85]),
  ...[5.5, 6.25, 6.95, 8.9, 9.75, 21.75, 25.65, 26.15].map((a): Sfx => ["typing", a, 0.22]),
  ...[1.62, 1.85, 2.05, 3.5, 3.7, 17.15, 20.3, 31.37, 34.65, 34.9].map((a): Sfx => ["coin", a, 0.22]),
  ...[3.45, 10.11, 13.1, 20.21, 24.21, 31.1].map((a): Sfx => ["stamp", a, 0.5]),
  ...[...EX.map((e) => e.ok), 28.13, 28.25, 28.37, 28.49, ...[0, 1, 2, 3, 4, 5, 6].map((k) => 32.15 + k * 0.17), 34.57].map((a): Sfx => ["check", a, 0.36]),
  ...[3.45, 17.05, 20.21, 24.21, 31.27].map((a): Sfx => ["chime", a, 0.33]),
  ["jump", 3.45, 0.25], ["jump", 7.5, 0.2], ["jump", 20.25, 0.2], ["jump", 26.9, 0.2], ["jump", 34.6, 0.2],
  ...[4.4, 7.7, 17.85, 20.8, 24.95].map((a): Sfx => ["jump", a + 0.1, 0.14]),
  ["powerup", 17.05, 0.28], ["powerup", 26.84, 0.22], ["powerup", 34.6, 0.3],
];

export const TrainerWorld3D: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const ready = useFontsReady(["900 70px Rubik", "800 40px Rubik", "600 36px Rubik", `600 40px ${SERIF}`]);
  const logo = useImage(staticFile("logos/claude.svg"));
  const base = useTextures(ready, t >= 24.5 ? SUNDAY_W : MODE_TRICK);
  const tex = useWorldTex(ready, logo, base);
  const dyn = useDynScreens(t, logo);
  // speed-dependent blur during camera flights
  const a = camAt(t - 0.03).pos, b = camAt(t + 0.03).pos;
  const speed = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 0.06;
  const blur = Math.min(3.5, Math.max(0, (speed - 8) * 0.12));
  const flash = 0.45 * bump(t, 3.45, 0.1) + 0.3 * bump(t, 2.38, 0.08) + 0.5 * bump(t, 8.42, 0.08) + 0.4 * bump(t, 21.42, 0.08) + 0.35 * bump(t, 17.05, 0.1) + 0.3 * bump(t, 20.21, 0.1) + 0.3 * bump(t, 34.57, 0.1);
  return (
    <AbsoluteFill style={{ background: "#1A100C", fontFamily: pixelFont }}>
      {tex && (
        <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
          <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
            <World t={t} tex={tex} dyn={dyn} />
          </ThreeCanvas>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 50%, rgba(10,4,2,.6) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(rgba(255,170,90,.06), transparent 30%, transparent 70%, rgba(20,8,4,.35))" }} />
      <AbsoluteFill style={{ background: "#FFF6E5", opacity: flash }} />
      <PillCaptions words={words as Word[]} theme={th} />
      <Audio src={staticFile("sirtoken/voice.mp3")} />
      <Audio src={staticFile("sirtoken/music.mp3")} volume={0.085} loop />
      {SFX.map(([n, at, v], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * 30))} durationInFrames={90}>
          <Audio src={staticFile(`sirtoken/sfx-${n}.mp3`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
