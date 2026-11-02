// "Ein Superkind-Agent baut eine Firma", Tag 3 (2026-10-23, v5). Every episode stands on its own: fixed series hook, the goal,
// then ONE thing explained properly. Today: what does the company sell? A 49 €/month subscription where one agent takes over
// exactly one daily task. Shown on the first customer (the Kanzlei from Tag 1, inbox of 80 mails → sorted, drafts, one click).
// Takeaway: automate the one thing that annoys you, not everything. CTA: comment your job → your shop in his street
// ("@DEIN NAME" placeholder only, never invented usernames), tomorrow he shows the one task he takes off you.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BlockBuddy, CameraRig, ToyBox, canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, THEMES, Word, pixelFont } from "../components/PixelKit";
import { claudeSerif } from "../components/ClaudeUI";
import words from "../../public/cbf3/words.json";
import { EPISODES } from "./superkindEconomy";

const W = 1080, H = 1920;
type V3 = [number, number, number];
const OR = "#FF6B35", OR_D = "#E5521F", INK = "#16130F", MUTED = "#8A857D", GOLD = "#F5C542", RED = "#E5484D", GREEN = "#1F9D55", EVIL = "#FF2E3A";
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
const E2 = EPISODES[1];
const eur = (v: number) => `${Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;

// ---------- key times ----------
const T = {
  ki: at("KI"), unt: at("Unternehmen"), keiner: at("Null"), also: at("Ganz"), tag0: at("Tag"), drei: at("drei"),
  erste: at("Ziel"), ziel: at("Ziel"), mio: at("Million"), hundert: at("Million") + 0.35, kasse1: at("Kasse"), n385: at("385"),
  // v7: no question beat, straight to the product
  heute: at("Erstes"), frage: 999, was: 999, eig: 999,
  seine: at("Erstes"), abo: at("Produkt"), kleine: at("ein", 7), n49: at("49"), monat: at("Monat"), genau: 999, aufg1: 999, nervt1: 999,
  erster: at("Erster"), kanzlei: at("Kanzlei"), eins: at("Kunde"), jeden1: at("80") - 0.25, n80: at("80"),
  // the do-it-yourself steps (board replaces the inbox while they run)
  so: at("So", 13), s1: at("Eins"), s1b: at("Gmail"), s2: at("Zwei"), dr: at("Dringend"), rf: at("Rückfrage"), kw: at("kann", 20), s3: at("Drei", 21), ton: at("Ton"),
  sort: at("Zwei") + 0.3, schreibt: at("Drei", 21) + 0.3, antw: 999,
  chefin: at("Du", 24), klickt: at("klickst"), senden: at("Senden"), stunde: at("Stunde"), jedenTag: at("Tag.", 26.5),
  trick: 999, nicht: 999, nur: 999, sache: 999, nervt2: 999,
  kasse2: at("Kanzlei") + 0.1, n434: at("Kanzlei") + 0.5,
  jetzt: at("Schreib", 27) - 0.4, naechste: at("Schreib", 27) - 0.4, komm1: at("Schreib", 27), beruf: at("Beruf"), machst: at("Kommentare"),
  heute2: at("Agent", 29), morgen: at("Prompt") - 0.35, prompt: at("Prompt"),
  nacht: at("baut", 31), laden: at("Laden"), strasse: at("Prompt") - 0.35, namen: at("Prompt") - 0.35, dach: at("Laden") + 0.3,
  aufg2: at("Laden"), firma2: at("Laden") + 0.3,
};
// your comment cycles through three jobs while he asks for yours
const JOB_T = [T.komm1 + 0.55, T.beruf, T.machst];
const END = T.firma2 + 0.5;
export const SK_TAG3_SECONDS = Math.ceil((END + 1.4) * 10) / 10;
// money: sealed outcome of Tag 2 option B, slowed down: the Kanzlei becomes the first subscriber (+49 €)
const CASH0 = E2.cashStart, GAIN = E2.options[1].outcome.delta;
const cashAt = (t: number) => keys(t, [[0, CASH0], [T.n434, CASH0], [T.n434 + 0.6, CASH0 + GAIN]]);

// ---------- light: one day, no night in this episode ----------
const DAY = "#8FD3F4";
const SKY: [number, string][] = [[0, DAY]];
const nightAt = (t: number) => 0 * t;

// ---------- world layout ----------
const Y0 = 0.57; // top of the company island
const FIRMA: V3 = [0, 0.12, 0];
const BLD: V3 = [0, Y0, -0.5];
const TOWN_R = 9.4;
const RIV: V3 = [0, 0, -15];
const RIV_AG: V3 = add(RIV, [0, 0.45, 0.4]);
const RECAP: V3 = [0, 4.3, -13.6];
const deg = (d: number) => (d * Math.PI) / 180;
// 4 plots in the first row (next to the company), 8 in the second
const LOTS: { p: V3; a: number; row: 1 | 2 }[] = [
  ...[45, 135, 225, 315].map((d) => ({ p: [Math.cos(deg(d)) * 5.0, 0.43, Math.sin(deg(d)) * 5.0] as V3, a: deg(d), row: 1 as const })),
  ...Array.from({ length: 8 }, (_, i) => { const d = 22.5 + i * 45; return { p: [Math.cos(deg(d)) * 7.7, 0.43, Math.sin(deg(d)) * 7.7] as V3, a: deg(d), row: 2 as const }; }),
];
const YOU_I = 0, KAN_I = 1;
const YOU = LOTS[YOU_I].p, KAN = LOTS[KAN_I].p;
// the Kanzlei lot appears with the street, all others pop on "die nächsten Kunden"
const POP = LOTS.map((l, i) => i).filter((i) => i !== KAN_I).sort((a, b) => LOTS[b].p[2] - LOTS[a].p[2] || LOTS[a].p[0] - LOTS[b].p[0]);
const popT = (i: number) => (i === KAN_I ? T.erster + 0.25 : T.naechste + POP.indexOf(i) * 0.07);
const signT = (i: number) => popT(i) + 0.25;
const HERO_HOME: V3 = [0.7, Y0, 2.0];
const HERO_BUILD: V3 = add(YOU, [-1.5, 0.02, 0.7]);
const KAN_AG: V3 = add(KAN, [1.35, 0.02, 0.95]);

// ---------- camera ----------
type Hold = { a: number; b: number; p0: V3; p1: V3; l0: V3; l1: V3 };
const HOLDS: Hold[] = [
  // series hook: the company from above, pushing in
  { a: 0, b: T.erste - 0.2, p0: [0, 9.5, 15.5], p1: [1.6, 4.8, 9.4], l0: [0, 0.6, 0], l1: [0, 1.6, 0.4] },
  // the goal: 1 Mio in 100 days, 385 € in the till
  { a: T.erste, b: T.heute - 0.15, p0: [1.4, 4.6, 9.0], p1: [0.8, 4.2, 7.8], l0: [0, 2.6, 0.6], l1: [0, 2.6, 0.8] },
  // the question, close on the agent
  // the answer: the subscription card
  { a: T.seine + 0.05, b: T.erster - 0.15, p0: [0.9, 4.2, 9.0], p1: [0.3, 3.9, 7.9], l0: [0, 2.9, 1.2], l1: [0, 2.9, 1.4] },
  // first customer: the Kanzlei and its inbox
  { a: T.erster + 0.05, b: T.jeden1 - 0.2, p0: add(KAN, [2.6, 4.6, 8.6]), p1: add(KAN, [2.0, 4.0, 7.4]), l0: add(KAN, [0.2, 1.6, 0]), l1: add(KAN, [0.2, 1.8, 0.2]) },
  { a: T.jeden1, b: T.jetzt - 0.15, p0: add(KAN, [1.3, 3.95, 7.7]), p1: add(KAN, [1.0, 3.8, 7.1]), l0: add(KAN, [0.45, 3.0, 1.0]), l1: add(KAN, [0.45, 3.0, 1.0]) },
  // the next customers: the empty street
  { a: T.jetzt + 0.05, b: T.komm1 + 0.45, p0: [0, 12.5, 15.0], p1: [-1.5, 13.2, 14.5], l0: [0, 0, 0.5], l1: [0, 0, 0.5] },
  // your shop: comment, he builds it, your name on it
  { a: T.komm1 + 0.65, b: T.morgen - 0.15, p0: add(YOU, [3.4, 4.6, 7.2]), p1: add(YOU, [2.4, 4.1, 6.4]), l0: add(YOU, [-0.2, 1.5, 0]), l1: add(YOU, [-0.2, 1.6, 0]) },
  // tomorrow: the one task he takes off you
  { a: T.morgen + 0.05, b: 60, p0: add(YOU, [2.8, 4.8, 7.8]), p1: add(YOU, [2.0, 4.1, 6.8]), l0: add(YOU, [-0.2, 2.0, 0]), l1: add(YOU, [-0.2, 2.1, 0]) },
];
const camAt = (t: number): { pos: V3; look: V3 } => {
  for (let i = 0; i < HOLDS.length; i++) {
    const h = HOLDS[i];
    const hk = inOut((Math.max(t, h.a) - h.a) / Math.max(0.01, h.b - h.a));
    if (t <= h.b) return { pos: lerp3(h.p0, h.p1, hk), look: lerp3(h.l0, h.l1, hk) };
    const n = HOLDS[i + 1];
    if (n && t < n.a) {
      const k = inOut((t - h.b) / (n.a - h.b));
      const via = add(lerp3(h.p1, n.p0, 0.5), [0, 2.2, 0]);
      return { pos: bez3(h.p1, via, n.p0, k), look: bez3(h.l1, lerp3(h.l1, n.l0, 0.5), n.l0, k) };
    }
  }
  const l = HOLDS[HOLDS.length - 1];
  return { pos: l.p1, look: l.l1 };
};
const PUNCH = [T.keiner, T.n385, T.frage, T.abo, T.n49, T.kanzlei, T.senden, T.stunde, T.n434, T.dach, T.firma2];

// ---------- helpers ----------
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
const drawSign = (c: CanvasRenderingContext2D) => {
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 600, 220, 30); c.fill();
  c.strokeStyle = OR; c.lineWidth = 10; roundRect(c, 5, 5, 590, 210, 26); c.stroke();
  botFace(c, 100, 120, 52);
  c.fillStyle = INK; c.font = font(56); c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("KI FÜR", 190, 80); c.fillStyle = OR; c.fillText("FIRMEN", 190, 150);
};

// ---------- 3D pieces ----------
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
const HERO2: Palette = { body: GOLD, dark: "#C99A1E", feet: "#2C2420", eye: "#FFFFFF", pupil: "#2C2420", ball: OR };

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
    <ToyBox p={[0, 0.02, 0]} s={[22, 0.04, 22]} color="#5A2E2A" top="#6E3A33" cast={false} />
    {/* glowing paths between the tables */}
    {([[[0, 0, 0], RIV], [[0, 0, 0], [16, 0, -6]], [[0, 0, 0], [-16, 0, -6]]] as [V3, V3][]).flatMap(([a, b], j) => {
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

// ---------- canvas: the goal (1 Mio in 100 days) and where we are ----------
const drawGoal = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 540;
  sticker(c, 0, 0, w, h, 52, CREAM);
  c.textBaseline = "middle"; c.textAlign = "left";
  c.fillStyle = MUTED; c.font = font(34); c.fillText("DAS ZIEL", 56, 78);
  const mk = back((t - T.erste + 0.05) / 0.3);
  if (mk > 0.01) { c.save(); c.translate(56, 170); c.scale(mk, mk); c.fillStyle = INK; c.font = font(112); c.fillText("1.000.000 €", 0, 0); c.restore(); }
  const dk = back((t - T.hundert + 0.05) / 0.3);
  if (dk > 0.01) { c.save(); c.translate(60, 262); c.scale(dk, dk); c.fillStyle = OR; c.font = font(50); c.fillText("in 100 Tagen", 0, 0); c.restore(); }
  // progress bar: 385 € of 1 Mio is a sliver
  const bk = ease((t - T.kasse1 + 0.1) / 0.4);
  if (bk > 0.01) {
    c.globalAlpha = bk;
    c.fillStyle = "#E6DCC8"; roundRect(c, 56, 340, 780, 56, 28); c.fill();
    c.strokeStyle = INK; c.lineWidth = 5; roundRect(c, 56, 340, 780, 56, 28); c.stroke();
    const fk = ease((t - T.n385 + 0.05) / 0.4);
    c.fillStyle = OR; roundRect(c, 62, 346, Math.max(2, 18 * fk), 44, 22); c.fill();
    if (fk > 0.01) {
      c.globalAlpha = bk * fk;
      c.fillStyle = INK; c.beginPath(); c.moveTo(71, 404); c.lineTo(58, 430); c.lineTo(84, 430); c.closePath(); c.fill();
      c.font = font(40); c.fillText("385 €", 56, 470);
      c.fillStyle = MUTED; c.font = font(32); c.fillText("← HIER SIND WIR", 200, 472);
    }
    c.globalAlpha = 1;
  }
};

// ---------- canvas: today's question ----------
const drawQuestion = (c: CanvasRenderingContext2D, t: number) => {
  const w = 840, h = 440;
  sticker(c, 0, 0, w, h, 50, "#FFFFFF");
  c.textBaseline = "middle"; c.textAlign = "left";
  c.fillStyle = MUTED; c.font = font(30); c.fillText("DIE WICHTIGSTE FRAGE", 60, 80);
  const k = back((t - T.heute + 0.1) / 0.3);
  c.save(); c.translate(60, 190); c.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k); c.globalAlpha = cl(k * 2);
  c.fillStyle = INK; c.font = font(70); c.fillText("WAS VERKAUFT", 0, 0);
  c.fillStyle = OR; c.font = font(70); c.fillText("DIE FIRMA?", 0, 92); c.restore();
  [0, 1, 2].forEach((i) => {
    const qk = back((t - T.eig - i * 0.12) / 0.3);
    if (qk < 0.01) return;
    c.save(); c.translate(640 + i * 58, 200 - i * 44 + Math.sin(t * 6 + i) * 10); c.rotate(0.2 * Math.sin(t * 4 + i)); c.scale(qk, qk);
    c.fillStyle = [OR, GOLD, INK][i]; c.font = font(84 - i * 12); c.textAlign = "center"; c.fillText("?", 0, 0); c.restore();
  });
};

// ---------- canvas: the product, built line by line ----------
const drawAbo = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 780;
  sticker(c, 0, 0, w, h, 54, CREAM);
  c.textBaseline = "middle"; c.textAlign = "left";
  const hk = back((t - T.seine + 0.05) / 0.3);
  c.save(); c.translate(w / 2, 100); c.scale(hk, hk); c.rotate(-0.03);
  c.fillStyle = OR; roundRect(c, -210, -50, 420, 100, 26); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = font(60); c.textAlign = "center"; c.fillText("PRODUKT 1", 0, 4); c.restore(); c.textAlign = "left";
  const row = (at: number, y: number, draw: () => void) => {
    const k = back((t - at + 0.05) / 0.3);
    if (k < 0.01) return;
    c.save(); c.globalAlpha = cl(k * 1.5); c.translate((1 - Math.min(1, k)) * -40, 0);
    checkBadge(c, 104, y, 34); draw(); c.restore();
  };
  row(T.kleine, 240, () => { c.fillStyle = INK; c.font = font(54); c.fillText("sortiert dein Postfach", 168, 242); });
  row(T.n49, 370, () => {
    c.fillStyle = OR; c.font = font(104); c.fillText("49 €", 168, 374);
    const mw = c.measureText("49 €").width;
    if (t > T.monat - 0.05) { c.fillStyle = MUTED; c.font = font(48); c.fillText("/ Monat", 190 + mw, 388); }
  });
  row(T.genau, 510, () => { c.fillStyle = INK; c.font = font(54); c.fillText("1 Agent = 1 Aufgabe", 168, 512); });
  row(T.nervt1 - 0.35, 640, () => {
    c.fillStyle = INK; c.font = font(50); c.fillText("die jeden Tag nervt", 168, 642);
    const uk = ease((t - T.nervt1) / 0.35);
    c.strokeStyle = RED; c.lineWidth = 9; c.lineCap = "round"; c.beginPath();
    for (let x = 0; x <= 480 * uk; x += 8) { const y = 684 + Math.sin(x / 18) * 6; x === 0 ? c.moveTo(168 + x, y) : c.lineTo(168 + x, y); }
    c.stroke(); c.lineCap = "butt";
  });
};

// ---------- canvas: the Kanzlei inbox (80 mails → sorted → drafts → one click) ----------
const MAILS = [
  { from: "Mandant Weber", subj: "Frist bis Freitag?", tag: "DRINGEND", col: RED },
  { from: "Finanzamt", subj: "Rückfrage Bescheid", tag: "AMT", col: "#3E6FD8" },
  { from: "Frau Kaya", subj: "Termin verschieben", tag: "TERMIN", col: "#8B5CF6" },
  { from: "Bäckerei Roth", subj: "Belege März", tag: "BELEGE", col: "#D9A21C" },
  { from: "Herr Lenz", subj: "Kurze Frage", tag: "RÜCKFRAGE", col: GREEN },
  { from: "Mandant Weber", subj: "Nachtrag", tag: "DRINGEND", col: RED },
];
const drawInbox = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 720;
  const sent = t > T.senden + 0.05;
  const n = sent ? 0 : Math.round(80 * ease((t - T.jeden1) / 0.9));
  const top = paperWin(c, w, h, "Posteingang", null, sent ? "0 offen" : `${n} ungelesen`, sent ? GREEN : RED);
  MAILS.forEach((m, i) => {
    const y = top + 20 + i * 86;
    const rk = back((t - T.jeden1 - i * 0.08) / 0.3);
    if (rk < 0.01) return;
    c.save(); c.globalAlpha = cl(rk) * (sent ? 0.55 : 1);
    c.fillStyle = "#FFFFFF"; roundRect(c, 24, y, w - 48, 74, 16); c.fill();
    c.strokeStyle = "#D9D0BF"; c.lineWidth = 3; roundRect(c, 24, y, w - 48, 74, 16); c.stroke();
    if (!sent) { c.fillStyle = OR; c.beginPath(); c.arc(50, y + 37, 8, 0, 7); c.fill(); }
    c.fillStyle = INK; c.font = "800 30px Rubik"; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText(m.from, 72, y + 25);
    c.fillStyle = MUTED; c.font = "600 26px Rubik"; c.fillText(m.subj, 72, y + 54);
    // sorted: a coloured label slides in
    const sk = back((t - T.sort - i * 0.09) / 0.28);
    if (sk > 0.01) {
      c.save(); c.translate(500, y + 37); c.scale(sk, sk);
      c.font = "900 24px Rubik"; const tw = c.measureText(m.tag).width;
      c.fillStyle = m.col; roundRect(c, -tw / 2 - 16, -20, tw + 32, 40, 20); c.fill();
      c.fillStyle = "#FFFFFF"; c.textAlign = "center"; c.fillText(m.tag, 0, 2); c.restore(); c.textAlign = "left";
    }
    // drafted reply
    const dk = back((t - T.schreibt - 0.1 - i * 0.16) / 0.28);
    if (dk > 0.01) {
      c.save(); c.translate(w - 130, y + 37); c.scale(dk, dk);
      c.fillStyle = sent ? GREEN : "#E9F7EE"; roundRect(c, -86, -22, 172, 44, 22); c.fill();
      c.fillStyle = sent ? "#FFFFFF" : GREEN; c.font = "900 24px Rubik"; c.textAlign = "center"; c.fillText(sent ? "✓ GESENDET" : "✎ ENTWURF", 0, 2); c.restore(); c.textAlign = "left";
    }
    c.restore();
  });
  // one button for the boss
  const bk = back((t - T.chefin + 0.05) / 0.3);
  if (bk > 0.01) {
    const press = t > T.senden - 0.05 && t < T.senden + 0.18;
    c.save(); c.translate(w / 2, h - 66); c.scale(bk * (press ? 0.92 : 1), bk * (press ? 0.92 : 1));
    c.fillStyle = INK; roundRect(c, -196, -40, 400, 92, 30); c.fill();
    c.fillStyle = sent ? GREEN : OR; roundRect(c, -200, -46, 400, 88, 30); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = font(44); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(sent ? "✓ ALLES RAUS" : "ALLE SENDEN", 0, -2); c.restore(); c.textAlign = "left";
    const hk = ease((t - T.klickt + 0.1) / 0.45);
    if (hk > 0.01 && t < T.stunde) hand(c, w / 2 + 120 + (1 - hk) * 200, h - 60 + (1 - hk) * 120, press, 7);
  }
  // the saved hour
  const st = back((t - T.stunde + 0.05) / 0.3);
  if (st > 0.01) {
    c.save(); c.translate(w / 2, h / 2 + 20); c.rotate(-0.12); c.scale(1.5 - 0.5 * Math.min(1, st), 1.5 - 0.5 * Math.min(1, st)); c.globalAlpha = cl(st * 1.4);
    c.fillStyle = "rgba(255,255,255,.9)"; roundRect(c, -330, -100, 660, 200, 30); c.fill();
    c.strokeStyle = OR; c.lineWidth = 14; roundRect(c, -330, -100, 660, 200, 30); c.stroke();
    c.fillStyle = OR; c.font = font(92); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("−1 STUNDE", 0, -22);
    c.fillStyle = INK; c.font = font(46); c.fillText(t > T.jedenTag - 0.1 ? "JEDEN TAG" : "", 0, 58);
    c.restore(); c.textAlign = "left";
  }
};

// ---------- canvas: the trick (the takeaway) ----------
const STEP_ROWS = [
  { at: () => T.s1, title: "Gmail verbinden", sub: "Einstellungen → Connectors" },
  { at: () => T.s2, title: "Sortieren lassen", sub: "" },
  { at: () => T.s3, title: "Antworten vorschreiben", sub: "in deinem Ton" },
];
const drawTrick = (c: CanvasRenderingContext2D, t: number, claude: HTMLImageElement | null, gmail: HTMLImageElement | null) => {
  const w = 900, h = 720;
  const top = paperWin(c, w, h, "Claude", claude, "3 SCHRITTE", GREEN);
  c.textBaseline = "middle"; c.textAlign = "left";
  STEP_ROWS.forEach((r, i) => {
    const at = r.at();
    // all three rows wait as ghosts, each lights up on its spoken number
    const k = back((t - at + 0.05) / 0.3);
    const y = top + 30 + i * 180;
    c.save(); c.globalAlpha = 0.3 + 0.7 * cl(k * 1.5); c.translate(Math.max(0, 1 - k) * 0, 0);
    if (k < 0.01) {
      c.fillStyle = "#FFFFFF"; roundRect(c, 28, y, w - 56, 160, 26); c.fill();
      c.strokeStyle = INK; c.lineWidth = 5; roundRect(c, 28, y, w - 56, 160, 26); c.stroke();
      c.fillStyle = "#9A9286"; c.beginPath(); c.arc(100, y + 80, 44, 0, 7); c.fill();
      c.fillStyle = "#FFFFFF"; c.font = font(52); c.textAlign = "center"; c.fillText(String(i + 1), 100, y + 84); c.textAlign = "left";
      c.fillStyle = "#9A9286"; c.font = font(50); c.fillText(r.title, 170, y + 56);
      c.restore(); return;
    }
    c.fillStyle = "#FFFFFF"; roundRect(c, 28, y, w - 56, 160, 26); c.fill();
    c.strokeStyle = INK; c.lineWidth = 5; roundRect(c, 28, y, w - 56, 160, 26); c.stroke();
    const done = i < 2 ? t > STEP_ROWS[i + 1].at() - 0.05 : t > T.chefin - 0.3;
    c.fillStyle = done ? GREEN : OR; c.beginPath(); c.arc(100, y + 80, 44, 0, 7); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = font(52); c.textAlign = "center"; c.fillText(done ? "✓" : String(i + 1), 100, y + 84); c.textAlign = "left";
    c.fillStyle = INK; c.font = font(50); c.fillText(r.title, 170, y + 56);
    if (i === 1) {
      // the three piles pop in as chips on the spoken words
      let x = 170;
      ([[T.dr, "DRINGEND", RED], [T.rf, "RÜCKFRAGE", "#3E6FD8"], [T.kw, "KANN WARTEN", "#9A9286"]] as [number, string, string][]).forEach(([ct, lab, col]) => {
        c.font = "900 28px Rubik"; const tw = c.measureText(lab).width;
        const ck = back((t - ct + 0.05) / 0.28);
        if (ck > 0.01) {
          c.save(); c.translate(x + tw / 2 + 18, y + 114); c.scale(ck, ck);
          c.fillStyle = col; roundRect(c, -tw / 2 - 18, -24, tw + 36, 48, 24); c.fill();
          c.fillStyle = "#FFFFFF"; c.textAlign = "center"; c.fillText(lab, 0, 2); c.restore(); c.textAlign = "left";
        }
        x += tw + 48;
      });
    } else {
      c.fillStyle = MUTED; c.font = "700 34px Rubik"; c.fillText(r.sub, 170, y + 114);
    }
    if (i === 0 && gmail) {
      const gk = back((t - T.s1b + 0.05) / 0.3);
      if (gk > 0.01) { c.save(); c.translate(w - 110, y + 80); c.scale(gk, gk); c.drawImage(gmail, -44, -33, 88, 66); c.restore(); }
    }
    c.restore();
  });
};

// ---------- canvas: Instagram-style comment ("DU") ----------
const drawComment = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 300;
  sticker(c, 0, 0, w, h, 50, "#FFFFFF");
  c.textBaseline = "middle"; c.textAlign = "center";
  c.fillStyle = "#F1ECE1"; c.beginPath(); c.arc(112, 126, 58, 0, 7); c.fill();
  c.strokeStyle = OR; c.lineWidth = 7; c.stroke();
  c.fillStyle = INK; c.font = font(38); c.fillText("DU", 112, 128);
  c.textAlign = "left";
  c.fillStyle = MUTED; c.font = "700 30px Rubik"; c.fillText("dein_name · jetzt", 196, 86);
  const jobs = ["Friseur", "Handwerker", "Café"];
  let txt = "…", col = "#C9C3B8";
  const ji = JOB_T.filter((a) => t > a - 0.05).length;
  if (t > T.heute2 - 0.05) { txt = "Friseur"; col = INK; } else if (ji > 0) { txt = jobs[ji - 1]; col = INK; }
  const pk = 1 + 0.12 * Math.max(...JOB_T.map((a) => bump(t, a + 0.05, 0.2)));
  c.save(); c.translate(196, 158); c.scale(pk, pk); c.fillStyle = col; c.font = font(60); c.fillText(txt, 0, 0); c.restore();
  if (t > T.heute2 - 0.05) { const ck = back((t - T.heute2) / 0.3); c.save(); c.translate(w - 120, 150); c.scale(ck, ck); checkBadge(c, 0, 0, 44); c.restore(); }
  c.fillStyle = MUTED; c.font = "700 26px Rubik"; c.fillText("Antworten", 196, 232);
};

// ---------- canvas: what the agent takes off your plate (revealed tomorrow) ----------
const drawTask = (c: CanvasRenderingContext2D, t: number) => {
  const w = 900, h = 340;
  sticker(c, 0, 0, w, h, 50, CREAM);
  c.textBaseline = "middle"; c.textAlign = "left";
  botFace(c, 92, 110, 34);
  c.fillStyle = MUTED; c.font = font(32); c.fillText("AGENT SCHICKT DIR", 150, 92);
  c.fillStyle = "#FFFFFF"; roundRect(c, 44, 150, w - 110, 120, 30); c.fill();
  c.strokeStyle = INK; c.lineWidth = 5; roundRect(c, 44, 150, w - 110, 120, 30); c.stroke();
  const tk = cl((t - T.prompt + 0.1) / 0.6);
  const txt = "Dein Prompt: Friseur".slice(0, Math.round(20 * tk));
  c.fillStyle = INK; c.font = font(54); c.fillText(txt, 84, 212);
  const mk = back((t - T.prompt - 0.2) / 0.3);
  if (mk > 0.01) {
    c.save(); c.translate(w - 170, 120); c.rotate(-0.12); c.scale(mk, mk);
    c.fillStyle = GREEN; roundRect(c, -110, -38, 220, 76, 20); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = font(40); c.textAlign = "center"; c.fillText("GRATIS", 0, 3);
    c.restore(); c.textAlign = "left";
  }
};

// ---------- town pieces ----------
type Kind = "cafe" | "werk" | "friseur" | "kanzlei" | "rival";
// box with optional ghost (preview) material
const Bx: React.FC<{ p: V3; s: V3; color: string; ghost?: number; rot?: V3; glow?: number }> = ({ p, s, color, ghost = 0, rot = [0, 0, 0], glow = 0 }) => (
  <mesh position={p} rotation={rot} castShadow={!ghost} receiveShadow={!ghost}>
    <boxGeometry args={s} />
    {ghost ? <meshBasicMaterial color={color} transparent opacity={0.72 * ghost} depthWrite={false} toneMapped={false} />
      : <meshStandardMaterial color={color} roughness={0.7} flatShading emissive={glow ? color : "#000"} emissiveIntensity={glow} />}
  </mesh>
);
const KIND: Record<Kind, { wall: string; roof: string; win: string }> = {
  cafe: { wall: "#F4E3C3", roof: "#C8553D", win: "#FFE7A8" },
  werk: { wall: "#9FB3C8", roof: "#3E4C5E", win: "#FFE7A8" },
  friseur: { wall: "#DCEFF5", roof: "#2B6C8A", win: "#FFE7A8" },
  kanzlei: { wall: "#ECE6DA", roof: "#3A4A63", win: "#FFE7A8" },
  rival: { wall: "#1E1929", roof: "#0E0B14", win: EVIL },
};
// a house of one kind; build: 0..1 walls rise, roof drops in at the end; ghost = translucent preview
const KindHouse: React.FC<{ kind: Kind; p: V3; t: number; build?: number; ghost?: number; night: number; yaw?: number; name?: THREE.Texture; nameOn?: number }> = ({ kind, p, t, build = 1, ghost = 0, night, yaw = 0, name, nameOn = 0 }) => {
  if (build <= 0.001) return null;
  const k = KIND[kind];
  const wy = ease(build / 0.7), rf = back((build - 0.7) / 0.3);
  const g = ghost;
  const lit = kind === "rival" ? 1.2 : 0.15 + 1.1 * night;
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      <group scale={[1, Math.max(0.001, wy), 1]}>
        <Bx p={[0, 0.7, 0]} s={[2.0, 1.4, 1.6]} color={k.wall} ghost={g} />
        {[-0.5, 0.5].map((x) => <Bx key={x} p={[x, 0.95, 0.81]} s={[0.42, 0.4, 0.04]} color={k.win} ghost={g} glow={g ? 0 : lit} />)}
        {kind !== "werk" && <Bx p={[0, 0.38, 0.81]} s={[0.4, 0.76, 0.04]} color="#7A5434" ghost={g} />}
      </group>
      {rf > 0.001 && (
        <group position={[0, 1.4 * wy + (1 - Math.min(1, rf)) * 2.5, 0]} scale={[1, Math.max(0.001, rf), 1]}>
          <Bx p={[0, 0.13, 0]} s={[2.25, 0.26, 1.85]} color={k.roof} ghost={g} />
          <Bx p={[0, 0.4, 0]} s={[1.5, 0.3, 1.2]} color={k.roof} ghost={g} />
          {kind === "cafe" && <>
            <mesh position={[0.55, 0.85, 0]} castShadow={!g}><cylinderGeometry args={[0.26, 0.2, 0.42, 16]} />{g ? <meshBasicMaterial color="#FFFFFF" transparent opacity={0.42 * g} /> : <meshStandardMaterial color="#FFFFFF" />}</mesh>
            <mesh position={[0.84, 0.85, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.12, 0.05, 8, 16]} />{g ? <meshBasicMaterial color="#FFFFFF" transparent opacity={0.42 * g} /> : <meshStandardMaterial color="#FFFFFF" />}</mesh>
            {!g && [0, 1, 2].map((i) => { const kk = (t * 0.7 + i / 3) % 1; return <mesh key={i} position={[0.55 + Math.sin(kk * 6 + i) * 0.08, 1.15 + kk * 0.7, 0]}><boxGeometry args={[0.08, 0.08, 0.08]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.6 * (1 - kk)} /></mesh>; })}
          </>}
          {kind === "werk" && <group position={[0.55, 0.95, 0]} rotation={[0, 0, Math.sin(t * 2) * 0.15 + 0.6]}>
            <Bx p={[0, 0, 0]} s={[0.14, 0.75, 0.1]} color="#C9CED6" ghost={g} />
            <Bx p={[0, 0.42, 0]} s={[0.38, 0.18, 0.1]} color="#C9CED6" ghost={g} />
          </group>}
          {kind === "friseur" && <group position={[0.5, 0.95, 0]} rotation={[0, 0, Math.sin(t * 3) * 0.2]}>
            <Bx p={[0, 0, 0]} s={[0.1, 0.75, 0.08]} rot={[0, 0, 0.45]} color="#C9CED6" ghost={g} />
            <Bx p={[0, 0, 0]} s={[0.1, 0.75, 0.08]} rot={[0, 0, -0.45]} color="#C9CED6" ghost={g} />
            {[-0.17, 0.17].map((x) => <mesh key={x} position={[x, -0.36, 0]}><torusGeometry args={[0.1, 0.035, 8, 14]} />{g ? <meshBasicMaterial color="#FF5A5A" transparent opacity={0.72 * g} /> : <meshStandardMaterial color="#FF5A5A" />}</mesh>)}
          </group>}
          {kind === "kanzlei" && [-0.5, 0, 0.5].map((x) => <Bx key={x} p={[x, 0.55, 0.62]} s={[0.12, 0.5, 0.12]} color="#FFFFFF" ghost={g} />)}
          {kind === "rival" && <Bx p={[0.6, 0.75, 0]} s={[0.22, 0.6, 0.22]} color={EVIL} glow={0.8 + 0.4 * Math.sin(t * 6)} />}
        </group>
      )}
      {/* kind-specific front */}
      {kind === "cafe" && wy > 0.9 && [0, 1, 2, 3, 4].map((i) => <Bx key={i} p={[-0.8 + i * 0.4, 1.28, 0.98]} s={[0.4, 0.08, 0.36]} rot={[0.35, 0, 0]} color={i % 2 ? "#FFFFFF" : "#E5484D"} ghost={g} />)}
      {kind === "werk" && wy > 0.5 && <Bx p={[0.0, 0.5 * wy, 0.82]} s={[1.1, 1.0 * wy, 0.04]} color="#5E6B7A" ghost={g} />}
      {kind === "friseur" && wy > 0.9 && [0, 1, 2, 3, 4, 5].map((i) => <Bx key={i} p={[-1.1, 0.25 + i * 0.18, 0.9]} s={[0.16, 0.18, 0.16]} rot={[0, t * 2 + i * 0.6, 0]} color={["#E5484D", "#FFFFFF", "#3E6FD8"][(i + Math.floor(t * 4)) % 3]} ghost={g} />)}
      {name && nameOn > 0.01 && (
        <group position={[0, 2.35, 0.6]} rotation={[-0.25, 0, 0]} scale={back(nameOn)}>
          <mesh><planeGeometry args={[2.1, 0.5]} /><meshBasicMaterial map={name} transparent toneMapped={false} depthWrite={false} /></mesh>
          <pointLight position={[0, 0, 0.8]} intensity={3 * night} distance={4} color={OR} />
        </group>
      )}
    </group>
  );
};
// empty plot: dark rim, cream slab, a signpost
const Lot: React.FC<{ i: number; t: number; tex: Tex; sign?: THREE.Texture; signK: number; glow?: number; glowCol?: string; red?: number }> = ({ i, t, tex, sign, signK, glow = 0, glowCol = GOLD, red = 0 }) => {
  const l = LOTS[i];
  const v = back((t - popT(i)) / 0.35);
  if (v <= 0.001) return null;
  return (
    <group position={l.p} scale={[v, v, v]}>
      <ToyBox p={[0, 0.03, 0]} s={[2.6, 0.06, 2.2]} color="#2A2018" cast={false} />
      <ToyBox p={[0, 0.07, 0]} s={[2.36, 0.08, 1.96]} color={red > 0.5 ? "#3A1E24" : "#EFE6D2"} cast={false} />
      {[-1, 1].map((sx) => [-1, 1].map((sz) => <ToyBox key={`${sx}${sz}`} p={[sx * 1.08, 0.2, sz * 0.88]} s={[0.1, 0.3, 0.1]} color={OR} />))}
      {glow > 0.01 && (
        <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.25, 1.25 + 0.3 * glow, 4, 1, Math.PI / 4]} />
          <meshBasicMaterial color={glowCol} transparent opacity={0.9 * glow} toneMapped={false} />
        </mesh>
      )}
      {sign && signK > 0.01 && (
        <group position={[-0.85, 0, 0.95]} scale={back(signK)}>
          <ToyBox p={[0, 0.5, 0]} s={[0.1, 1.0, 0.1]} color="#2A2430" />
          <mesh position={[0.15, 1.15, 0.06]}><planeGeometry args={[1.05, 0.4]} /><meshBasicMaterial map={sign} transparent toneMapped={false} /></mesh>
        </group>
      )}
      {red > 0.01 && <KindHouse kind="rival" p={[0.2, 0.1, -0.1]} t={t} ghost={0.9 * red} night={1} />}
      {void tex}
    </group>
  );
};
const Lamp: React.FC<{ p: V3; night: number; t: number; seed: number }> = ({ p, night, t, seed }) => (
  <group position={p}>
    <ToyBox p={[0, 0.7, 0]} s={[0.1, 1.4, 0.1]} color="#2A2430" />
    <mesh position={[0, 1.5, 0]}><boxGeometry args={[0.26, 0.22, 0.26]} /><meshBasicMaterial color={night > 0.4 ? "#FFE7A8" : "#D8D2C4"} toneMapped={false} /></mesh>
    {night > 0.4 && seed % 3 === 0 && <pointLight position={[0, 1.6, 0]} intensity={2.5 * night * (0.9 + 0.1 * Math.sin(t * 9 + seed))} distance={3.5} color="#FFD27A" />}
  </group>
);

// ---------- the world ----------
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
  const look = cam.look;

  // hero: thinks at the company, hops to your lot when he builds your shop
  const hopK = inOut((t - T.heute2 - 0.1) / 0.6);
  const hp = t < T.heute2 + 0.1 ? HERO_HOME : lerp3(HERO_HOME, HERO_BUILD, hopK);
  const hop = Math.sin(hopK * Math.PI) * (hopK < 1 ? 2.6 : 0);
  const building = t > T.nacht && t < T.dach + 0.2;
  const thinking = t > T.heute && t < T.seine;
  const heroYaw = thinking ? 0.15 + Math.sin(t * 2.2) * 0.35 : t < T.heute2 ? 0.25 + Math.sin(t * 1.3) * 0.25 : building ? 1.0 + Math.sin(t * 10) * 0.5 : 0.6;
  const camD = Math.hypot(cam.pos[0] - hp[0], cam.pos[1] - hp[1] - hop, cam.pos[2] - hp[2]);
  // the street rises with the first customer
  const town = back((t - T.erster + 0.1) / 0.6);
  const townY = (1 - Math.min(1, town)) * -0.5;
  // the Kanzlei drops onto its lot, its own agent walks in
  const kanB = cl((t - T.kanzlei + 0.05) / 0.55);
  const kanName = cl((t - T.eins + 0.1) / 0.35);
  const kanAg = cl((t - T.jeden1 + 0.3) / 0.35);
  const kanWork = t > T.sort - 0.1 && t < T.senden + 0.3;
  // your shop: previews while you "comment", then built on "baut deinen Laden"
  const ji = JOB_T.filter((a) => t > a - 0.05).length;
  const kindAt: Kind | null = ji === 0 ? null : (["friseur", "werk", "cafe"] as Kind[])[ji - 1];
  const build = cl((t - T.nacht - 0.05) / Math.max(0.5, T.namen - T.nacht + 0.1));
  const nameOn = cl((t - T.dach + 0.15) / 0.35);
  const youSign = cl((t - T.komm1 + 0.25) / 0.3);
  return (
    <>
      <CameraRig pos={cam.pos} look={look} fov={48 - 3 * punch} />
      <color attach="background" args={[WOOD]} />
      <fog attach="fog" args={[WOOD, 26, 64]} />
      <ambientLight intensity={0.52} color="#FFE6C4" />
      <hemisphereLight args={["#FFE2B8", "#3A2418", 0.64]} />
      <primitive object={lightTarget} />
      <directionalLight position={[look[0] + 6, 18, look[2] + 9]} target={lightTarget} intensity={1.8} color="#FFE9CF" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} shadow-camera-far={60} shadow-bias={-0.0015} shadow-normalBias={0.04} />
      <Room t={t} tex={tex} sky={sky} night={night} />
      <LightCone p={[0, 0, 0]} t={t} seed={1} color="#FFD27A" r={3.4} />
      {t > T.erster && t < T.jetzt && <LightCone p={KAN} t={t} seed={3} color="#9DC4FF" r={2.0} />}
      {t > T.komm1 - 0.2 && <LightCone p={YOU} t={t} seed={2} color="#FFB45A" r={2.0} />}
      <pointLight position={[0, 5.5, 0]} intensity={14} distance={11} color="#FFB45A" />

      {/* ---- the street ---- */}
      {town > 0.001 && (
        <group position={[0, townY, 0]}>
          <Island p={[0, 0, 0]} r={TOWN_R} t={t} vis={Math.min(1.04, town)} deco={false} top="#6FB85A" side="#2E5226" />
          {town > 0.6 && <>
            {[11.25, 78.75, 101.25, 168.75, 191.25, 258.75, 281.25, 348.75].map((d, i) => <Tree key={i} p={[Math.cos(deg(d)) * 6.4, 0.43, Math.sin(deg(d)) * 6.4]} t={t} seed={i * 2} s={0.65 + rnd(i) * 0.2} night={night} />)}
            {[0, 90, 180, 270].map((d, i) => <Lamp key={i} p={[Math.cos(deg(d)) * 5.0, 0.43, Math.sin(deg(d)) * 5.0]} night={night} t={t} seed={i * 3} />)}
            {Array.from({ length: 40 }).map((_, i) => { const a = (i / 40) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 6.35, 0.45, Math.sin(a) * 6.35]} rotation={[-Math.PI / 2, 0, -a]}><planeGeometry args={[0.36, 0.36]} /><meshBasicMaterial color="#FFD27A" transparent opacity={0.25 + 0.4 * Math.max(0, Math.sin(t * 4 - i * 0.5))} toneMapped={false} /></mesh>; })}
          </>}
          {LOTS.map((l, i) => {
            const isYou = i === YOU_I, isKan = i === KAN_I;
            const sign = isYou && t > T.komm1 - 0.25 ? tex.youSign : isKan ? undefined : tex.frei;
            const signK = isYou && t > T.komm1 - 0.25 ? youSign : cl((t - signT(i)) / 0.3);
            const glow = isYou && t > T.komm1 - 0.2 ? 0.7 + 0.3 * Math.sin(t * 6) : isKan && t > T.kanzlei && t < T.jetzt ? 0.5 + 0.3 * Math.sin(t * 5) : 0;
            return <Lot key={i} i={i} t={t} tex={tex} sign={sign} signK={signK} glow={glow} glowCol={isKan ? "#7FB3FF" : OR} />;
          })}
          {/* customer 1: the Kanzlei */}
          {kanB > 0.001 && <KindHouse kind="kanzlei" p={add(KAN, [-0.2, 0.12, -0.2])} yaw={0.35} t={t} build={kanB} night={0} name={tex.kanName} nameOn={kanName} />}
          {kanAg > 0.01 && <Agent p={KAN_AG} yaw={-0.4} t={t} s={0.45} seed={4} vis={back(kanAg)} armL={kanWork ? 90 + 40 * Math.sin(t * 14) : 15} armR={kanWork ? 90 + 40 * Math.sin(t * 14 + 2) : 15} talk={kanWork} />}
          {/* your shop */}
          {kindAt && t < T.nacht - 0.05 && <KindHouse kind={kindAt} p={add(YOU, [0.25, 0.12, -0.15])} yaw={-0.35} t={t} ghost={0.75 + 0.25 * Math.sin(t * 8)} night={night} build={back((t - JOB_T[ji - 1] + 0.05) / 0.3)} />}
          {t > T.nacht - 0.05 && <KindHouse kind="friseur" p={add(YOU, [0.25, 0.12, -0.15])} yaw={-0.35} t={t} build={build} night={0.6} name={tex.youName} nameOn={nameOn} />}
        </group>
      )}
      <Burst3D at={T.kanzlei + 0.5} t={t} p={add(KAN, [0, 1.0, 0.4])} colors={["#7FB3FF", "#FFFFFF", GOLD]} n={12} power={1.2} />
      <Burst3D at={T.n434} t={t} p={add(KAN, [0.6, 2.4, 0.6])} colors={[GOLD, "#FFFFFF", GREEN]} n={14} power={1.4} />
      <Burst3D at={T.dach} t={t} p={add(YOU, [0, 2.6, 0])} colors={[OR, "#FFFFFF", GOLD]} n={14} power={1.2} />

      {/* ---- the company in the middle ---- */}
      <Island p={FIRMA} r={3.1} t={t} deco={false} top="#E07A3F" side="#4A2412" />
      <Plot t={t} ghost={0} />
      <Crane p={[2.1, Y0, -1.7]} t={t} busy />
      <group position={[-1.9, Y0, 1.4]} rotation={[0, 0.35, 0]}>
        <ToyBox p={[0, 0.55, 0]} s={[0.12, 1.1, 0.12]} color="#2A2430" />
        <mesh position={[0, 1.35, 0.08]}><planeGeometry args={[1.5, 0.55]} /><meshBasicMaterial map={tex.sign} toneMapped={false} transparent /></mesh>
      </group>
      <group position={[2.0, Y0, 0.9]} rotation={[0, -0.5, 0]}>
        <ToyBox p={[0, 0.85, 0]} s={[0.8, 1.7, 0.7]} color="#2A2430" />
        {Array.from({ length: 6 }).map((_, r) => [0, 1, 2].map((cI) => (
          <mesh key={`${r}-${cI}`} position={[-0.22 + cI * 0.16, 0.3 + r * 0.24, 0.36]}><boxGeometry args={[0.08, 0.06, 0.02]} /><meshBasicMaterial color={Math.sin(t * (5 + r) + cI * 2 + r) > 0 ? "#4CF08A" : "#1B3A2A"} toneMapped={false} /></mesh>
        )))}
      </group>
      <Agent p={[hp[0], hp[1] + hop, hp[2]]} yaw={heroYaw} t={t} s={0.62} armL={hop > 0.2 || building ? 140 : thinking ? 160 : 15} armR={hop > 0.2 || building ? 140 + 15 * Math.sin(t * 12) : 15} talk={thinking} vis={cl((camD - 1.8) / 1.2)} />

      {/* ---- boards, one beat each ---- */}
      <Board p={[0, 3.55, 1.4]} tex={dyn.goal} w={2.6} h={1.56} t={t} q={q} at={T.erste - 0.05} until={T.heute - 0.1} bob={0.04} />
      <Board p={add(HERO_HOME, [0.1, 2.2, 0.3])} tex={dyn.question} w={2.2} h={1.15} t={t} q={q} at={T.heute + 0.1} until={T.seine - 0.1} bob={0.04} />
      <Board p={[0, 3.0, 1.7]} tex={dyn.abo} w={2.5} h={2.17} t={t} q={q} at={T.seine - 0.05} until={T.erster - 0.1} bob={0.03} />
      <Board p={add(KAN, [0.45, 3.05, 1.1])} tex={dyn.inbox} w={2.8} h={2.24} t={t} q={q} at={T.jeden1 - 0.1} until={T.so - 0.1} bob={0.03} />
      <Board p={add(KAN, [0.45, 3.05, 1.1])} tex={dyn.trick} w={2.8} h={2.24} t={t} q={q} at={T.so - 0.05} until={T.chefin - 0.15} bob={0.03} />
      <Board p={add(KAN, [0.45, 3.05, 1.1])} tex={dyn.inbox} w={2.8} h={2.24} t={t} q={q} at={T.chefin - 0.1} until={T.jetzt - 0.1} bob={0.03} />
      <Board p={[0, 4.4, 3.6]} tex={tex.free11} w={3.6} h={0.84} t={t} q={q} at={T.naechste + 0.15} until={T.komm1 + 0.5} tilt={-0.03} />
      <Board p={add(YOU, [0.45, 3.0, 1.0])} tex={dyn.comment} w={2.2} h={0.73} t={t} q={q} at={T.komm1 + 0.5} until={T.namen - 0.15} bob={0.04} />
      <Board p={add(YOU, [0.3, 3.55, 0.9])} tex={dyn.task} w={2.5} h={0.94} t={t} q={q} at={T.morgen - 0.05} bob={0.04} />
    </>
  );
};

// ---------- textures ----------
const useStaticTex = (ready: boolean) =>
  React.useMemo(() => {
    if (!ready) return null;
    const t: Tex = {};
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
    t.neonC = neon("TAG 3 / 100", "#FF7FA8");
    t.neonD = neon("49 € IM MONAT", "#9DFFC4");
    t.sign = canvasTex(600, 220, drawSign);
    t.plus = pillTex(`+${eur(GAIN)} · KUNDE 1`, GOLD, INK, 860, 220);
    t.free11 = pillTex("11 LÄDEN FREI", GREEN, "#FFFFFF", 1000, 230);
    t.frei = pillTex("FREI", GREEN, "#FFFFFF", 420, 160);
    t.youSign = pillTex("@DEIN NAME", OR, "#FFFFFF", 420, 160);
    t.youName = pillTex("@DEIN NAME", OR, "#FFFFFF", 840, 200);
    t.kanName = pillTex("KANZLEI · KUNDE 1", "#3A4A63", "#FFFFFF", 840, 200);
    return t;
  }, [ready]);

const useDynTex = (t: number) => {
  const claudeLogo = useImage(staticFile("logos/claude.svg"));
  const gmailLogo = useImage(staticFile("logos/gmail.svg"));
  const goal = useDyn(900, 540, (c) => drawGoal(c, t));
  const question = useDyn(840, 440, (c) => drawQuestion(c, t));
  const abo = useDyn(900, 780, (c) => drawAbo(c, t));
  const inbox = useDyn(900, 720, (c) => drawInbox(c, t));
  const trick = useDyn(900, 720, (c) => drawTrick(c, t, claudeLogo, gmailLogo));
  const comment = useDyn(900, 300, (c) => drawComment(c, t));
  const task = useDyn(900, 340, (c) => drawTask(c, t));
  return { goal, question, abo, inbox, trick, comment, task };
};

// ---------- 2D HUD ----------
const Hud: React.FC<{ t: number }> = ({ t }) => {
  const k = ease((t - 0.1) / 0.4);
  const cash = cashAt(t);
  const cashPulse = 1 + 0.25 * Math.max(bump(t, T.n385 + 0.1, 0.3), bump(t, T.n434 + 0.6, 0.35));
  const chip = (children: React.ReactNode, bg = CREAM) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: bg, border: `5px solid ${INK}`, borderRadius: 26, padding: "8px 18px", boxShadow: "0 0 0 6px #FFFFFF, 0 12px 0 6px rgba(0,0,0,.35)" }}>{children}</div>
  );
  const txt: React.CSSProperties = { fontFamily: "Rubik", fontWeight: 900, fontSize: 36, color: INK, lineHeight: 1, display: "inline-block" };
  const up = cashPulse > 1.05 && t > T.n434;
  const coins = Array.from({ length: 9 }, (_, i) => {
    const ck = (t - T.kasse2 - 0.1 - i * 0.06) / 0.55;
    if (ck <= 0 || ck >= 1) return null;
    const e = inOut(ck);
    const x = 300 + Math.sin(i * 2.1) * 80 * (1 - e) + (600 - 300) * e, y = 980 - (980 - 258) * e - Math.sin(e * Math.PI) * 120;
    return <div key={i} style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: GOLD, border: "5px solid #B88D24", boxShadow: "0 4px 0 rgba(0,0,0,.3)" }} />;
  });
  const mono: React.CSSProperties = { fontFamily: "Rubik", fontWeight: 800, lineHeight: 1, display: "inline-block" };
  return (
    <>
      <AbsoluteFill>{coins}</AbsoluteFill>
      <div style={{ position: "absolute", top: 236, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * -20}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, background: "rgba(22,19,15,.78)", border: "2px solid rgba(255,255,255,.16)", borderRadius: 40, padding: "14px 30px", boxShadow: "0 10px 30px rgba(0,0,0,.35)" }}>
          <span style={{ ...mono, fontSize: 32, color: OR }}>TAG 3<span style={{ color: "rgba(255,255,255,.45)", fontSize: 24 }}> / 100</span></span>
          <div style={{ width: 2, height: 30, background: "rgba(255,255,255,.2)" }} />
          <div style={{ width: 22, height: 22, borderRadius: 11, background: GOLD }} />
          <span style={{ ...mono, fontSize: 34, color: up ? "#4CF08A" : cashPulse > 1.05 ? "#FF8A8A" : "#FFFFFF", transform: `scale(${cashPulse})` }}>{eur(cash)}</span>
          <span style={{ ...mono, fontSize: 24, color: "rgba(255,255,255,.45)", marginLeft: -8 }}>/ 1 Mio €</span>
        </div>
      </div>
    </>
  );
};

// ---------- 2D series hook: identical every episode, only the day changes ----------
const DAY_NO = 3;
const SeriesHook: React.FC<{ t: number }> = ({ t }) => {
  const out = ease((t - T.erste + 0.15) / 0.3);
  if (out >= 1) return null;
  const pop = (at: number) => back((t - at + 0.05) / 0.28);
  const line = (txt: string, at: number, size: number, color: string, stroke: string): React.ReactNode => {
    const k = pop(at);
    return <div style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: size, lineHeight: 1.02, color, WebkitTextStroke: `${size * 0.09}px ${stroke}`, paintOrder: "stroke fill", textShadow: `0 ${size * 0.08}px 0 ${stroke}`, opacity: k > 0.01 ? 1 : 0, transform: `scale(${0.5 + 0.5 * k})` }}>{txt}</div>;
  };
  const tk = pop(T.tag0);
  return (
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: 1 - out, transform: `translateY(${out * -60}px)` }}>
      {line("KI BAUT EIN", T.ki, 92, CREAM, INK)}
      {line("UNTERNEHMEN", T.unt, 104, CREAM, INK)}
      {line("VON NULL", T.keiner, 104, OR, INK)}
      <div style={{ marginTop: 14, opacity: pop(T.also) > 0.01 ? 1 : 0, transform: `scale(${0.5 + 0.5 * pop(T.also)}) rotate(-2deg)`, background: INK, color: "#FFFFFF", fontFamily: "Rubik", fontWeight: 900, fontSize: 52, padding: "10px 30px", borderRadius: 18 }}>GANZ ALLEINE</div>
      <div style={{ marginTop: 18, opacity: tk > 0.01 ? 1 : 0, transform: `scale(${0.4 + 0.6 * tk}) rotate(3deg)`, background: GOLD, border: `6px solid ${INK}`, color: INK, fontFamily: "Rubik", fontWeight: 900, fontSize: 64, padding: "6px 34px", borderRadius: 22, boxShadow: `0 10px 0 ${INK}` }}>TAG {DAY_NO} / 100</div>
    </div>
  );
};

// ---------- 2D step badge ----------
const STEPS: { a: number; n: string; text: string; col: string }[] = [
  { a: T.erste - 0.1, n: "1", text: "DAS ZIEL", col: GOLD },
  { a: T.seine - 0.1, n: "2", text: "DAS PRODUKT", col: GREEN },
  { a: T.erster - 0.1, n: "3", text: "KUNDE 1", col: "#3E6FD8" },
  { a: T.so - 0.1, n: "4", text: "SELBST BAUEN", col: GOLD },
  { a: T.jetzt - 0.1, n: "5", text: "DU BIST DRAN", col: OR },
];
const StepBadge: React.FC<{ t: number }> = ({ t }) => {
  if (t < STEPS[0].a) return null;
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
  ...TRANSITS.map((c): Sfx => ["whoosh-quick", c - 0.02, 0.32]),
  ["ui-pop", T.ki, 0.3], ["ui-pop", T.unt, 0.25], ["stamp", T.keiner, 0.32], ["ui-pop", T.also, 0.28], ["stamp", T.tag0, 0.4],
  ["ui-pop", T.mio, 0.3], ["ui-pop", T.hundert, 0.25], ["coin", T.n385 + 0.1, 0.25],
  ["chime", T.so, 0.3], ["check", T.s1, 0.3], ["check", T.s2, 0.3], ["ui-pop", T.dr, 0.2], ["ui-pop", T.rf, 0.2], ["ui-pop", T.kw, 0.2], ["check", T.s3, 0.3], ["typing", T.s3 + 0.5, 0.2],
  ["stamp", T.abo, 0.4], ["check", T.kleine, 0.28], ["check", T.n49, 0.3], ["check", T.genau, 0.28], ["check", T.nervt1 - 0.35, 0.28],
  ["powerup", T.erster, 0.3], ["bump", T.kanzlei + 0.5, 0.5],
  ["typing", T.n80, 0.2], ...Array.from({ length: 6 }, (_, i): Sfx => ["ui-pop", T.sort + i * 0.09, 0.14]),
  ["typing", T.schreibt, 0.22], ["ui-pop", T.chefin, 0.3], ["check", T.senden, 0.4], ["stamp", T.stunde, 0.42],
  
  ...Array.from({ length: 6 }, (_, i): Sfx => ["coin", T.kasse2 + 0.3 + i * 0.09, 0.18 + i * 0.03]),
  ...LOTS.map((_, i): Sfx => ["ui-pop", popT(i), 0.14]),
  ["ui-pop", T.komm1, 0.3], ...JOB_T.map((a): Sfx => ["ui-pop", a, 0.3]),
  ["jump", T.heute2 + 0.1, 0.25], ["typing", T.nacht + 0.2, 0.22], ["stamp", T.namen, 0.3], ["powerup", T.dach, 0.35],
  ["ui-pop", T.morgen, 0.3], ["stamp", T.prompt + 0.2, 0.35],
];

export const SuperkindFirmaTag3: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ready = useFontsReady(["900 70px Rubik", "600 36px Rubik", `600 40px ${SERIF}`, `800 40px ${pixelFont}`, `800 40px Rubik`, `500 40px Rubik`, `700 40px Rubik`]);
  const tex = useStaticTex(ready);
  const dyn = useDynTex(t);
  const a = camAt(t - 0.03).pos, b = camAt(t + 0.03).pos;
  const speed = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 0.06;
  const blur = speed > 150 ? 0 : Math.min(3.5, Math.max(0, (speed - 8) * 0.12));
  const flash = 0.14 * bump(t, T.erster + 0.1, 0.1) + 0.12 * bump(t, T.senden, 0.08) + 0.14 * bump(t, T.dach, 0.1);
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
      <AbsoluteFill style={{ opacity: ease((t - T.kasse1 + 0.15) / 0.35) }}><Hud t={t} /></AbsoluteFill>
      <SeriesHook t={t} />
      <PillCaptions words={WD} theme={THEMES.gym} />
      <StepBadge t={t} />
      <Audio src={staticFile("cbf3/voice.mp3")} />
      {SFX.map(([n, s, v], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s * 30))} durationInFrames={90}>
          <Audio src={staticFile(`sirtoken/sfx-${n}.mp3`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
