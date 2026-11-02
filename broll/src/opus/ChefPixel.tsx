import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-idee-vom-chef/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "Idee vom Chef" (Kryptomnesie, 2026-10-23) im Pixel-Niklas-Look aus look-tests/pixel-niklas/frame.html:
// oben 960 px vollflächige Pixelwelt (180 x 160 Zellen à 6 px, warmes Abendlicht mit Dither-Bändern), unten der Avatar,
// Space-Mono-Untertitel auf der Kante mit goldenem Schlüsselwort, Pill oben links, goldenes Tag oben rechts.
// Pointe ab "Gestern" ruhig auf dem Gesicht.

const FPS = 25, W = 1080, H = 1920, PH = 960, CELL = 6;
const GOLD = "#FFC83D", INK = "#141414";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
export const CP_FRAMES = TL.frames;
export const A = {
  chef: at("chef"), idee0: at("idee", 0), luegt: at("lügt"), vergessen0: at("vergessen", 0), dir: at("dir"),
  psych: at("psychologen"), krypto: at("kryptomnesie"), versteckt: at("verstecktes"),
  forscher: at("forscher"), gruppen: at("gruppen"), ideen: at("ideen"), sammeln: at("sammeln"), spaeter: at("später"), eigenen: at("eigenen"),
  bei: at("bei"), neun: at("neun"), hundert: at("hundert"), fremde: at("fremde"), jemand: at("jemand"), nie: at("nie"),
  montag: at("montag"), meeting: at("meeting"), lass: at("lass"), automat: at("automatisieren"), spannend: at("spannend"),
  mittwoch: at("mittwoch"), vorstand: at("vorstand"), hatte: at("hatte"), idee2: at("idee", 2),
  finde: at("finde"), schick: at("schick"), mail: at("mail"), datum: at("datum"), vergessen1: at("vergessen", 1), beweis: at("beweis"),
  erzaehle: at("erzähle"), workshop: at("workshop"), beste: at("beste"), gestern: at("gestern"),
};

// ---------- pixel plates (static, drawn once into SVG rects) ----------
type Op = [number, number, number, number, string];
const painter = () => {
  const ops: Op[] = [];
  const R = (x: number, y: number, w: number, h: number, c: string) => { ops.push([x, y, w, h, c]); };
  const P = (x: number, y: number, c: string) => R(x, y, 1, 1, c);
  const dither = (x: number, y: number, w: number, h: number, a: string, b: string) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) P(x + i, y + j, (i + j) % 2 ? a : b); };
  return { ops, R, P, dither };
};
type Pt = ReturnType<typeof painter>;
const SKY = ["#FFF6DE", "#FFEFC9", "#FFE6B0", "#FFDB96", "#FFD07E"];
const sky = ({ R, dither }: Pt, x: number, y: number, w: number, band: number) => {
  SKY.forEach((c, i) => R(x, y + i * band, w, band, c));
  for (let i = 1; i < SKY.length; i++) dither(x, y + i * band - 1, w, 2, SKY[i], SKY[i - 1]);
};
const sun = ({ P }: Pt, cx: number, cy: number, r: number) => {
  for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) { const d = x * x + y * y; if (d <= r * r) P(cx + x, cy + y, d > (r - 1.5) * (r - 1.5) ? "#FFB02E" : "#FFD45A"); }
};
const woodFloor = ({ R }: Pt, y0: number, base = "#C8955E", line = "#A87642", hi = "#D9AA72") => {
  R(0, y0, 180, 160 - y0, base);
  for (let y = y0; y < 160; y += 6) { R(0, y, 180, 1, line); for (let x = (y / 6) % 2 ? 8 : 26; x < 180; x += 36) R(x, y + 1, 1, 5, line); R(0, y + 1, 180, 1, hi); }
};
const plant = ({ R, P }: Pt, x: number, y: number) => { R(x, y + 10, 6, 6, "#B65D35"); R(x - 1, y + 2, 8, 8, "#4C9A5A"); R(x, y, 6, 3, "#5DB06C"); P(x + 1, y + 3, "#7FC98B"); };
const brick = ({ R }: Pt, y0: number, y1: number, c: string) => { for (let y = y0; y < y1; y += 4) for (let x = 0; x < 180; x += 9) R(x + ((y / 4) % 2 ? 4 : 0), y, 3, 1, c); };

const drawOffice = (table: boolean) => {
  const p = painter(); const { R } = p;
  R(0, 0, 180, 126, "#F7E8CA"); brick(p, 2, 124, "#EBD6AE");
  // big window with the evening sky
  R(16, 10, 148, 70, "#7A4B2C"); sky(p, 18, 12, 144, 13.2);
  sun(p, 138, 30, 8);
  [[18, 52, 20, 26], [40, 46, 10, 32], [62, 54, 16, 24], [96, 48, 8, 30], [106, 56, 14, 22], [150, 50, 12, 28]].forEach(([x, y, w, h]) => R(x, y, w, h, "#E7D2B0"));
  [[44, 50], [44, 56], [100, 52], [100, 60], [154, 56]].forEach(([x, y]) => R(x, y, 2, 2, "#FFF6DE"));
  R(16 + 48, 10, 3, 70, "#7A4B2C"); R(16 + 97, 10, 3, 70, "#7A4B2C"); R(16, 44, 148, 2, "#7A4B2C");
  R(12, 80, 156, 3, "#9E4A2A"); R(12, 83, 156, 1, "#7A3A20");
  plant(p, 4, 108); plant(p, 170, 108);
  R(0, 124, 180, 2, "#8A5A34");
  woodFloor(p, 126);
  if (table) { R(56, 112, 68, 4, "#6B4428"); R(56, 112, 68, 1, "#8C5A34"); R(60, 116, 3, 12, "#5A3820"); R(117, 116, 3, 12, "#5A3820"); R(80, 109, 10, 3, "#F5F5F5"); R(92, 110, 8, 2, "#E5E1D8"); }
  return p.ops;
};
const drawArchive = () => {
  const p = painter(); const { R } = p;
  R(0, 0, 180, 126, "#EADCC2"); brick(p, 2, 124, "#DDCBA9");
  R(34, 10, 112, 112, "#5A3820"); R(36, 12, 108, 108, "#7A4B2C");
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) {
    const x = 38 + c * 18, y = 14 + r * 21;
    R(x, y, 16, 19, "#B07A45"); R(x, y, 16, 1, "#C99A63"); R(x, y + 18, 16, 1, "#8A5A30"); R(x + 5, y + 8, 6, 2, GOLD); R(x + 4, y + 3, 8, 3, "#F7E8CA");
  }
  R(0, 124, 180, 2, "#8A5A34");
  woodFloor(p, 126, "#B07A45", "#8A5A30", "#C49058");
  R(14, 0, 1, 18, "#3A3F4A"); R(10, 18, 9, 4, "#3A3F4A"); R(11, 22, 7, 2, "#FFE08A");
  R(165, 0, 1, 18, "#3A3F4A"); R(161, 18, 9, 4, "#3A3F4A"); R(162, 22, 7, 2, "#FFE08A");
  return p.ops;
};
const drawSeminar = () => {
  const p = painter(); const { R } = p;
  R(0, 0, 180, 126, "#EFE3CC"); brick(p, 2, 124, "#E2D2B2");
  R(28, 10, 124, 58, "#8A5A30"); R(31, 13, 118, 52, "#2E3440");
  p.dither(31, 13, 118, 2, "#394150", "#2E3440");
  R(31, 64, 118, 3, "#6B4428"); R(60, 63, 6, 1, "#F5F5F5"); R(70, 63, 4, 1, "#FFC83D");
  plant(p, 6, 108); plant(p, 168, 108);
  R(0, 124, 180, 2, "#8A5A34");
  woodFloor(p, 126);
  R(44, 114, 92, 5, "#8A5A34"); R(44, 114, 92, 1, "#B07A45"); R(52, 119, 3, 10, "#5A3820"); R(125, 119, 3, 10, "#5A3820");
  return p.ops;
};
const drawBoard = () => {
  const p = painter(); const { R } = p;
  R(0, 0, 180, 126, "#6B4428");
  for (let x = 0; x < 180; x += 20) { R(x, 0, 1, 126, "#5A3820"); R(x + 1, 0, 1, 126, "#8A5A34"); }
  R(0, 60, 180, 2, "#5A3820");
  R(40, 8, 100, 44, "#3A2414"); sky(p, 42, 10, 96, 8);
  [[44, 30, 12, 20], [58, 26, 8, 24], [70, 34, 14, 16], [96, 28, 10, 22], [110, 32, 12, 18], [126, 24, 10, 26]].forEach(([x, y, w, h]) => R(x, y, w, h, "#E7D2B0"));
  sun(p, 118, 18, 5);
  R(89, 8, 2, 44, "#3A2414");
  R(0, 124, 180, 36, "#5E2E2A");
  for (let y = 126; y < 160; y += 4) for (let x = 0; x < 180; x += 8) R(x + ((y / 4) % 2 ? 4 : 0), y, 4, 1, "#6E3833");
  R(0, 124, 180, 2, "#3A2414");
  R(6, 112, 168, 5, "#3A2414"); R(6, 112, 168, 1, "#5A3820"); R(14, 117, 3, 12, "#2B1A0E"); R(163, 117, 3, 12, "#2B1A0E");
  return p.ops;
};
const drawStage = () => {
  const p = painter(); const { R } = p;
  R(0, 0, 180, 112, "#B8322A");
  for (let x = 0; x < 180; x += 10) { R(x, 0, 3, 112, "#8E2A22"); R(x + 5, 0, 2, 112, "#D8463A"); }
  R(0, 0, 180, 8, "#8E2A22"); for (let x = 0; x < 180; x += 12) R(x, 8, 6, 3, "#8E2A22");
  R(0, 8, 180, 1, GOLD);
  R(0, 104, 180, 14, "#B07A45"); for (let x = 0; x < 180; x += 15) R(x, 104, 1, 14, "#8A5A30"); R(0, 104, 180, 1, "#D9AA72");
  R(0, 118, 180, 3, "#5A3820");
  R(0, 121, 180, 39, "#2B2420");
  return p.ops;
};
const PLATES = { office: drawOffice(false), officeT: drawOffice(true), archive: drawArchive(), seminar: drawSeminar(), board: drawBoard(), stage: drawStage() };
const Plate = React.memo<{ id: keyof typeof PLATES }>(({ id }) => (
  <svg width={W} height={PH} viewBox="0 0 180 160" shapeRendering="crispEdges" style={{ position: "absolute", left: 0, top: 0 }}>
    {PLATES[id].map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w + 0.02} height={h + 0.02} fill={c} />)}
  </svg>
));

// ---------- people (Pixel-Niklas rows, palette-swapped) ----------
const NK = [
  "....hhhhhh....", "...hHHLLHHh...", "..hHHHHLLHHh..", "..HHhSSSSHHH..", "..HSSSSSSSSH..", "..SSESSSSESS..", "..sSSSSSSSSs..", "..SSSSssSSSS..",
  "..sSbbbbbbSs..", "...sbbSSbbs...", "....sSSSSs....", "..nNNWWWWNNn..", ".nNNNNWZWNNNn.", ".NNNNNNZNNNNN.", ".NNnNNNZNNNnNN", ".NN.NNNZNNN.NN",
  ".NN.NNNZNNN.NF", ".SS.NNNNNNN.Ff", "....NNNNNNN.Ff", "....PPPPPPP...", "....PPP.PPP...", "....PPP.PPP...", "....PPP.PPP...", "....PPP.PPP...", "...BBBB.BBBB..",
];
const SK = { S: "#F2C6A4", s: "#D9A27F" };
const PAL = {
  niklas: { h: "#8A5A30", H: "#B07A45", L: "#C99A63", ...SK, E: "#2B2B2B", b: "#B58A62", N: "#1E2433", n: "#2E3650", W: "#F5F5F5", Z: "#C9C9C9", P: "#3A3F4A", B: "#151515", F: "#111111", f: "#7FD3FF" },
  du: { h: "#2B1E16", H: "#3D2B1F", L: "#5A4030", ...SK, E: "#2B2B2B", b: SK.S, N: "#3E7CC9", n: "#2F63A6", W: "#F5F5F5", Z: "#2F63A6", P: "#3A3F4A", B: "#151515", F: SK.S, f: SK.S },
  chef: { h: "#6E6E6E", H: "#9A9A9A", L: "#C0C0C0", ...SK, E: "#2B2B2B", b: SK.S, N: "#ECE8E0", n: "#CFCBC2", W: "#FFFFFF", Z: "#D8463A", P: "#2E3440", B: "#151515", F: SK.S, f: SK.S },
  a: { h: "#C9673E", H: "#E08A55", L: "#F0A86E", ...SK, E: "#2B2B2B", b: SK.S, N: "#4C9A5A", n: "#3E8049", W: "#F5F5F5", Z: "#3E8049", P: "#3A3F4A", B: "#151515", F: SK.S, f: SK.S },
  b: { h: "#E8C45A", H: "#F2D57A", L: "#F7E3A0", ...SK, E: "#2B2B2B", b: SK.S, N: "#D8463A", n: "#B8322A", W: "#F5F5F5", Z: "#B8322A", P: "#3A3F4A", B: "#151515", F: SK.S, f: SK.S },
  c: { h: "#151515", H: "#2B2B2B", L: "#3D3D3D", S: "#B98560", s: "#9A6A48", E: "#151515", b: "#9A6A48", N: "#8A5AA8", n: "#6E4590", W: "#F5F5F5", Z: "#6E4590", P: "#3A3F4A", B: "#151515", F: "#B98560", f: "#B98560" },
  suit1: { h: "#4A4A4A", H: "#6E6E6E", L: "#8A8A8A", ...SK, E: "#2B2B2B", b: SK.S, N: "#3A3F4A", n: "#2E3440", W: "#F5F5F5", Z: "#1E2433", P: "#2E3440", B: "#151515", F: SK.S, f: SK.S },
  suit2: { h: "#D0D0D0", H: "#E2E2E2", L: "#F0F0F0", S: "#E8B898", s: "#C99070", E: "#2B2B2B", b: "#E8B898", N: "#2E3650", n: "#1E2433", W: "#F5F5F5", Z: "#D8463A", P: "#2E3440", B: "#151515", F: "#E8B898", f: "#E8B898" },
};
type Who = keyof typeof PAL;
// px per sprite pixel; bob = pixel-step bob (one sprite pixel up every other beat)
const Person: React.FC<{ t: number; who: Who; x: number; y: number; px?: number; flip?: boolean; seed?: number; a?: number; bob?: number; style?: React.CSSProperties }> = ({ t, who, x, y, px = 12, flip, seed = 0, a = -1, bob = 1, style }) => {
  const st = a >= 0 ? popStyle(t, a, 30, 0.4) : {};
  const hop = Math.floor(t * 3.2 + seed) % 2 ? -px * bob : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 4, ...st, ...style }}>
      <div style={{ position: "absolute", left: px * 3, top: NK.length * px - px * 0.6, width: px * 9, height: px * 1.2, background: "rgba(80,60,30,0.28)" }} />
      <div style={{ transform: `translateY(${hop}px) scaleX(${flip ? -1 : 1})` }}><Sprite rows={NK} pal={PAL[who]} px={px} /></div>
    </div>
  );
};
const headTop = (y: number) => y; // sprite top = top of hair
const BULB = { rows: ["..YYYY..", ".YWWYYY.", "YWYYYYYY", "YYYYYYYY", "YYYYYYYD", ".YYYYYD.", "..YYYD..", "..GGGG..", "..gggg..", "...GG..."], pal: { Y: GOLD, W: "#FFF2B8", D: "#E0A21E", G: "#8C95A0", g: "#6B737E" } };
const Bulb: React.FC<{ t: number; x: number; y: number; px?: number; glow?: boolean; style?: React.CSSProperties }> = ({ t, x, y, px = 10, glow = true, style }) => {
  const w = 8 * px, h = 10 * px;
  const ray = Math.floor(t * 6) % 2;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, zIndex: 6, ...style }}>
      {glow ? [[-1, 0], [1, 0], [0, -1], [-0.75, -0.75], [0.75, -0.75]].map(([dx, dy], i) => (
        <div key={i} style={{ position: "absolute", left: w / 2 - px / 2 + dx * (w * 0.78 + ray * px), top: h * 0.34 - px / 2 + dy * (h * 0.62 + ray * px), width: px, height: px, background: "#FFB02E" }} />
      )) : null}
      <Sprite rows={BULB.rows} pal={BULB.pal} px={px} />
    </div>
  );
};

// ---------- pixel UI pieces ----------
const PxBox: React.FC<{ bg?: string; color?: string; size?: number; border?: string; shadow?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({ bg = GOLD, color = INK, size = 28, border = INK, shadow = true, style, children }) => (
  <div style={{ position: "absolute", fontFamily: PX, fontSize: size, lineHeight: 1.25, color, background: bg, border: `${Math.max(4, Math.round(size / 6))}px solid ${border}`, padding: `${size * 0.55}px ${size * 0.6}px ${size * 0.4}px`, boxShadow: shadow ? `6px 6px 0 ${INK}` : undefined, whiteSpace: "nowrap", zIndex: 8, ...style }}>{children}</div>
);
// speech bubble with a stepped tail; side = where the tail points
const Bubble: React.FC<{ t: number; a: number; text: string; x: number; y: number; tail?: "l" | "r"; size?: number; w?: number; type?: number }> = ({ t, a, text, x, y, tail = "l", size = 26, w, type = 0.7 }) => {
  if (t < a - 0.05) return null;
  const s = type > 0 ? typed(text, t, a, a + type) : text;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 9, ...popStyle(t, a - 0.05, 14, 0.6) }}>
      <div style={{ position: "relative", fontFamily: PX, fontSize: size, lineHeight: 1.45, color: INK, background: "#FFFFFF", border: `6px solid ${INK}`, padding: `${size * 0.7}px ${size * 0.75}px ${size * 0.5}px`, boxShadow: `6px 6px 0 ${INK}`, width: w, whiteSpace: w ? "normal" : "nowrap" }}>
        <span>{s}</span><span style={{ opacity: 0 }}>{text.slice(s.length)}</span>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", top: "100%", [tail === "l" ? "left" : "right"]: 40 + i * 6, marginTop: i * 12, width: 30 - i * 10, height: 12, background: INK }} />
        ))}
        <div style={{ position: "absolute", top: "100%", [tail === "l" ? "left" : "right"]: 46, marginTop: -1, width: 18, height: 8, background: "#FFFFFF" } as React.CSSProperties} />
      </div>
    </div>
  );
};
const Stamp: React.FC<{ t: number; a: number; text: string; bg?: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, a, text, bg = GOLD, color = INK, size = 44, rot = -6, style }) => {
  if (t < a) return null;
  const p = interpolate(t, [a, a + 0.14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <PxBox bg={bg} color={color} size={size} style={{ transform: `rotate(${rot}deg) scale(${2 - p})`, opacity: p, zIndex: 12, ...style }}>{text}</PxBox>;
};
const Pill: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 36, top: 36, background: INK, color: "#FFF", fontFamily: SM, fontWeight: 700, fontSize: 24, padding: "10px 20px 10px 16px", borderRadius: 999, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 0 rgba(0,0,0,.15)", zIndex: 20 }}>
    <i style={{ width: 12, height: 12, borderRadius: "50%", background: GOLD, display: "block" }} />{text}
  </div>
);
const TopTag: React.FC<{ t: number; a: number; text: string }> = ({ t, a, text }) => (t < a ? null : (
  <div style={{ position: "absolute", right: 36, top: 36, zIndex: 20, transformOrigin: "100% 0", transform: `scale(${interpolate(t, [a, a + 0.14], [1.7, 1], { ...clamp, easing: Easing.out(Easing.cubic) })}) rotate(${interpolate(t, [a, a + 0.14], [-6, 0], clamp)}deg)`, opacity: k(t, a, 0.06) }}>
    <div style={{ background: GOLD, color: INK, border: `4px solid ${INK}`, fontFamily: PX, fontSize: 24, padding: "14px 16px 10px", boxShadow: `6px 6px 0 ${INK}`, whiteSpace: "nowrap" }}>{text}</div>
  </div>
));
// flight on an arc between two points, u in 0..1
const arc = (u: number, x0: number, y0: number, x1: number, y1: number, lift = 160) => ({ x: x0 + (x1 - x0) * u, y: y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * lift });
const spark = (t: number, a: number, cx: number, cy: number, n = 8, r0 = 40, r1 = 130, col = GOLD) => {
  const u = (t - a) / 0.45;
  if (u < 0 || u > 1) return null;
  return Array.from({ length: n }, (_, i) => {
    const ang = (i / n) * Math.PI * 2 + 0.3;
    const r = r0 + (r1 - r0) * Easing.out(Easing.cubic)(u);
    const s = Math.round(14 * (1 - u)) + 4;
    return <div key={i} style={{ position: "absolute", left: cx + Math.cos(ang) * r - s / 2, top: cy + Math.sin(ang) * r - s / 2, width: s, height: s, background: i % 2 ? col : "#FFFFFF", border: `2px solid ${INK}`, zIndex: 11 }} />;
  });
};

// ---------- scenes ----------
// 1 · Hook: your bulb flies over to the boss. Frame 0 readable.
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const duX = 110, duY = 450, chX = 640, chY = 430;
  const fly = k(t, 0.7, 0.62, Easing.inOut(Easing.cubic));
  const b = arc(fly, duX + 84, duY - 60, chX + 91, chY - 34, 120);
  const landed = t > 1.32;
  const forgetU = k(t, A.vergessen0, 0.6);
  return (
    <>
      <Plate id="office" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 98, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, zIndex: 10, opacity: 1 - k(t, A.vergessen0 - 0.2, 0.2) }}>
        <div style={{ fontFamily: PX, fontSize: 62, color: "#FFF", background: INK, padding: "22px 28px 14px", boxShadow: `6px 6px 0 rgba(0,0,0,.25)`, transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - 0.2) / 0.2)})` }}>DEINE IDEE.</div>
        <div style={{ fontFamily: PX, fontSize: 62, color: INK, background: GOLD, border: `6px solid ${INK}`, padding: "18px 26px 10px", boxShadow: `6px 6px 0 ${INK}`, transform: `rotate(${landed ? -2 : 0}deg) scale(${1 + 0.1 * Math.max(0, 1 - Math.abs(t - 1.38) / 0.18)})` }}>SEINE IDEE.</div>
      </div>
      <Person t={t} who="du" x={duX} y={duY} />
      <Person t={t} who="chef" x={chX} y={chY} px={13} flip seed={1} bob={landed ? 1 : 0} />
      <Person t={t} who="niklas" x={900} y={555} px={8} seed={0.5} />
      <div style={{ position: "absolute", left: duX + 26, top: duY + 310, zIndex: 7 }}><PxBox bg={INK} color="#FFF" size={20} shadow={false}>DU</PxBox></div>
      <div style={{ position: "absolute", left: chX + 28, top: chY + 336, zIndex: 7 }}><PxBox bg={INK} color="#FFF" size={20} shadow={false}>CHEF</PxBox></div>
      {t > 0.12 ? <Bulb t={t} x={b.x} y={b.y} px={landed ? 11 : 10} style={{ zIndex: 12, ...(t < 0.7 ? popStyle(t, 0.12, 10, 0.2) : {}) }} /> : null}
      {spark(t, 0.16, duX + 84, duY - 60, 6)}
      {spark(t, 1.3, chX + 91, chY - 34, 10)}
      {fly > 0 && fly < 1 ? [0.08, 0.16, 0.24].map((d, i) => { const q = arc(Math.max(0, fly - d), duX + 84, duY - 60, chX + 91, chY - 34, 120); return <div key={i} style={{ position: "absolute", left: q.x - 8, top: q.y - 8, width: 16 - i * 4, height: 16 - i * 4, background: GOLD, opacity: 0.8 - i * 0.2, zIndex: 5 }} />; }) : null}
      {t > A.vergessen0 ? (
        <div style={{ position: "absolute", left: chX - 240, top: chY - 120, zIndex: 9, ...popStyle(t, A.vergessen0, 12, 0.5) }}>
          <div style={{ position: "relative", width: 200, height: 130, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ opacity: Math.floor((1 - forgetU) * 6) % 2 || forgetU < 0.3 ? 1 - forgetU : 0, position: "absolute", top: 18 }}><Sprite rows={NK.slice(0, 11)} pal={PAL.du} px={8} /></div>
            <div style={{ fontFamily: PX, fontSize: 64, color: INK, opacity: forgetU }}>?</div>
          </div>
          <div style={{ position: "absolute", left: 200, top: 120, width: 22, height: 22, background: "#FFF", border: `5px solid ${INK}` }} />
          <div style={{ position: "absolute", left: 226, top: 148, width: 14, height: 14, background: "#FFF", border: `4px solid ${INK}` }} />
        </div>
      ) : null}
      {t > A.dir ? <Stamp t={t} a={A.dir} text="VON DIR" size={30} rot={-5} style={{ left: duX - 30, top: duY - 60 }} /> : null}
    </>
  );
};

// 2 · Kryptomnesie: the memory archive, your drawer label is gone
const SceneKrypto: React.FC<{ t: number }> = ({ t }) => {
  const open = k(t, A.versteckt - 0.1, 0.4, Easing.out(Easing.back(1.4)));
  const dx = 38 + 2 * 18, dy = 14 + 2 * 21; // drawer cell (col 2, row 2)
  return (
    <>
      <Plate id="archive" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 50, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "22px 26px 14px", boxShadow: `0 8px 0 #6B4528`, ...popStyle(t, A.krypto - 0.15, 16, 0.7) }}>
          {typed("KRYPTOMNESIE", t, A.krypto - 0.1, A.krypto + 0.55)}<span style={{ opacity: 0 }}>{"KRYPTOMNESIE".slice(typed("KRYPTOMNESIE", t, A.krypto - 0.1, A.krypto + 0.55).length)}</span>
        </div>
      </div>
      {/* the drawer slides out towards the viewer */}
      <div style={{ position: "absolute", left: dx * CELL - 20 * open, top: dy * CELL + 40 * open, width: 16 * CELL + 40 * open, height: 19 * CELL + 30 * open, background: "#C99A63", border: `6px solid #5A3820`, zIndex: 7, boxShadow: `0 ${10 * open}px 0 rgba(0,0,0,.25)` }}>
        <div style={{ position: "absolute", left: "50%", top: 16, transform: "translateX(-50%)", width: 54, height: 14, background: GOLD }} />
        {open > 0.6 ? <Bulb t={t} x={(16 * CELL + 40 * open) / 2} y={-40} px={8} style={popStyle(t, A.versteckt + 0.2, 10, 0.3)} /> : null}
      </div>
      {t > A.versteckt + 0.1 ? <PxBox bg="#FFF" size={28} style={{ left: 0, right: 0, margin: "0 auto", width: "fit-content", top: 640, ...popStyle(t, A.versteckt + 0.1, 12, 0.7) }}>= VERSTECKTES ERINNERN</PxBox> : null}
      <Person t={t} who="chef" x={56} y={420} px={12} seed={2} a={A.psych - 0.05} />
      <Person t={t} who="niklas" x={880} y={470} px={11} flip seed={0.3} a={A.psych + 0.1} />
    </>
  );
};

// 3a · The study: groups collect ideas, later everyone writes down only their own
const people: { who: Who; x: number; flip?: boolean }[] = [{ who: "a", x: 150 }, { who: "du", x: 345 }, { who: "b", x: 560, flip: true }, { who: "c", x: 760, flip: true }];
const SceneStudy: React.FC<{ t: number }> = ({ t }) => {
  const later = t > A.spaeter;
  return (
    <>
      <Plate id="seminar" />
      <div style={{ position: "absolute", left: 31 * CELL, top: 13 * CELL, width: 118 * CELL, height: 52 * CELL, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
        <div style={{ fontFamily: PX, fontSize: 38, color: "#F5F5F5", lineHeight: 1.6, textAlign: "center" }}>
          {later ? <>{typed("NUR DEINE EIGENEN", t, A.spaeter, A.eigenen + 0.3)}<br /><span style={{ color: GOLD }}>{t > A.eigenen ? "AUFSCHREIBEN" : ""}</span></> : <>{typed("IDEEN SAMMELN", t, A.gruppen, A.sammeln + 0.3)}</>}
        </div>
      </div>
      {people.map((p, i) => <Person key={i} t={t} who={p.who} x={p.x} y={430} px={11} flip={p.flip} seed={i * 0.7} a={A.forscher + i * 0.1} />)}
      {people.map((p, i) => {
        const a = A.ideen + i * 0.14;
        if (t < a) return null;
        const toPaper = k(t, A.spaeter + i * 0.08, 0.4);
        return (
          <React.Fragment key={i}>
            <Bulb t={t} x={p.x + 77} y={380 - toPaper * 20} px={6} glow={!later} style={{ ...popStyle(t, a, 10, 0.2), opacity: 1 - toPaper * 0.6 }} />
            {spark(t, a, p.x + 77, 380, 6, 20, 70)}
          </React.Fragment>
        );
      })}
      {later ? people.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x + 40, top: 640, width: 80, height: 50, background: "#FFFDF6", border: `5px solid ${INK}`, zIndex: 6, ...popStyle(t, A.spaeter + 0.2 + i * 0.1, 10, 0.5) }}>
          <div style={{ margin: "10px 8px 0", height: 5, background: "#8C95A0" }} /><div style={{ margin: "7px 8px 0", width: 40, height: 5, background: "#8C95A0" }} />
        </div>
      )) : null}
    </>
  );
};

// 3b · 9 of 100 wrote down someone else's idea; the other way round almost never
const FOREIGN = new Set([7, 18, 26, 39, 44, 58, 63, 81, 95]);
const SceneNine: React.FC<{ t: number }> = ({ t }) => {
  const sz = 44, gap = 8, gx = 520, gy = 150;
  const red = t > A.fremde - 0.05;
  const rev = t > A.jemand - 0.1;
  return (
    <>
      <Plate id="seminar" />
      <div style={{ position: "absolute", inset: 0, background: "rgba(46,52,64,0.55)", zIndex: 2 }} />
      <div style={{ position: "absolute", left: gx - 16, top: gy - 16, width: 10 * (sz + gap) - gap + 32, height: 10 * (sz + gap) - gap + 32, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, zIndex: 3, ...popStyle(t, A.bei - 0.1, 20, 0.85) }} />
      {Array.from({ length: 100 }, (_, i) => {
        const a = A.bei + (i % 10) * 0.035 + Math.floor(i / 10) * 0.05;
        if (t < a) return null;
        const f = FOREIGN.has(i) && red;
        const flick = f && t - A.fremde < 0.3 && Math.floor((t - A.fremde) * 20) % 2;
        return (
          <div key={i} style={{ position: "absolute", left: gx + (i % 10) * (sz + gap), top: gy + Math.floor(i / 10) * (sz + gap), width: sz, height: sz, zIndex: 4, background: f ? (flick ? "#FFF" : "#D8463A") : GOLD, border: `4px solid ${f ? "#8E2A22" : "#B9821A"}`, boxSizing: "border-box", ...popStyle(t, a, 6, 0.3) }}>
            <div style={{ position: "absolute", left: 6, top: 5, width: 8, height: 8, background: f ? "#FFB0A8" : "#FFF2B8" }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 50, top: 170, zIndex: 6, ...popStyle(t, A.neun - 0.05, 16, 0.6) }}>
        <div style={{ fontFamily: PX, fontSize: 120, color: red ? "#FF6B5E" : "#FFF", lineHeight: 1, textShadow: `6px 6px 0 ${INK}` }}>{t > A.neun - 0.05 ? "9" : ""}</div>
        <div style={{ fontFamily: PX, fontSize: 40, color: "#FFF", marginTop: 20, textShadow: `4px 4px 0 ${INK}`, opacity: k(t, A.hundert - 0.1, 0.1) }}>VON 100</div>
      </div>
      {red ? <Stamp t={t} a={A.fremde} text="FREMDE IDEE" bg="#D8463A" color="#FFF" size={26} rot={-4} style={{ left: 40, top: 430 }} /> : null}
      {rev ? (
        <div style={{ position: "absolute", left: 40, top: 560, zIndex: 9, ...popStyle(t, A.jemand - 0.1, 14, 0.7) }}>
          <PxBox bg="#FFF" size={24} style={{ position: "relative" }}>ANDERSRUM:</PxBox>
          <div style={{ fontFamily: PX, fontSize: 66, color: GOLD, marginTop: 26, textShadow: `5px 5px 0 ${INK}`, opacity: k(t, A.nie - 0.1, 0.1), transform: `scale(${1 + 0.25 * Math.max(0, 1 - Math.abs(t - A.nie) / 0.15)})`, transformOrigin: "0 50%" }}>FAST 0</div>
        </div>
      ) : null}
    </>
  );
};

// 4 · Monday meeting
const SceneMonday: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="officeT" />
    <Person t={t} who="du" x={150} y={420} px={12} seed={0.2} a={A.montag - 0.05} />
    <Person t={t} who="chef" x={760} y={395} px={13} flip seed={1.4} bob={0} a={A.montag + 0.05} />
    <Bubble t={t} a={A.lass - 0.05} text="LASS UNS DAS AUTOMATISIEREN!" x={70} y={140} size={28} w={560} type={A.automat + 0.4 - A.lass} />
    {t > A.automat ? <Bulb t={t} x={234} y={372} px={8} style={popStyle(t, A.automat, 10, 0.2)} /> : null}
    {spark(t, A.automat, 234, 372, 8, 20, 90)}
    <Bubble t={t} a={A.spannend - 0.05} text="SPANNEND." x={640} y={200} tail="r" size={32} type={0.35} />
  </>
);
// 5 · Wednesday, board: the boss has "an idea"
const SceneWednesday: React.FC<{ t: number }> = ({ t }) => {
  const glow = t > A.idee2 - 0.05;
  return (
    <>
      <Plate id="board" />
      <Person t={t} who="suit1" x={60} y={500} px={10} seed={0.1} a={A.vorstand} bob={glow ? 1 : 0} />
      <Person t={t} who="suit2" x={230} y={500} px={10} seed={0.6} a={A.vorstand + 0.1} bob={glow ? 1 : 0} />
      <Person t={t} who="suit1" x={850} y={500} px={10} flip seed={1.1} a={A.vorstand + 0.2} bob={glow ? 1 : 0} />
      <Person t={t} who="chef" x={470} y={395} px={13} seed={0.4} a={A.mittwoch - 0.05} bob={0} />
      <div style={{ position: "absolute", left: 0, top: 112 * CELL - 6, width: W, height: 40, zIndex: 5 }}><svg width={W} height={30} viewBox="0 0 180 5" shapeRendering="crispEdges"><rect x={6} y={0} width={168} height={5} fill="#3A2414" /><rect x={6} y={0} width={168} height={1} fill="#5A3820" /></svg></div>
      <Bubble t={t} a={A.hatte - 0.15} text="ICH HATTE DA EINE IDEE." x={150} y={140} size={30} type={A.idee2 + 0.3 - A.hatte} />
      {glow ? <Bulb t={t} x={561} y={330} px={10} style={popStyle(t, A.idee2 - 0.05, 12, 0.2)} /> : null}
      {spark(t, A.idee2 - 0.05, 561, 330, 10)}
      {glow ? <PxBox bg={INK} color={GOLD} size={22} shadow={false} style={{ left: 130, top: 440, ...popStyle(t, A.idee2 + 0.3, 8, 0.5) }}>* APPLAUS *</PxBox> : null}
    </>
  );
};
// 6 · Send every idea by mail first, with a date. Proof.
const SceneMail: React.FC<{ t: number }> = ({ t }) => {
  const sent = k(t, A.mail + 0.15, 0.5, Easing.in(Easing.cubic));
  return (
    <>
      <Plate id="office" />
      <div style={{ position: "absolute", inset: 0, background: "rgba(20,20,20,0.18)", zIndex: 2 }} />
      <div style={{ position: "absolute", left: 120, top: 150, width: 840, height: 520, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}`, zIndex: 5, fontFamily: PX, color: INK, ...popStyle(t, A.finde - 0.1, 20, 0.85) }}>
        <div style={{ height: 66, background: INK, color: "#FFF", display: "flex", alignItems: "center", padding: "0 24px", fontSize: 24, gap: 14 }}>
          <span style={{ width: 16, height: 16, background: GOLD }} />NEUE MAIL
        </div>
        <div style={{ padding: "28px 30px", fontSize: 24, lineHeight: 2 }}>
          <div>AN: <span style={{ color: "#5A6270" }}>{typed("CHEF", t, A.schick - 0.1, A.schick + 0.2)}</span></div>
          <div>BETREFF: <span style={{ color: "#5A6270" }}>{typed("MEINE IDEE", t, A.schick + 0.1, A.mail)}</span></div>
          <div style={{ height: 5, background: "#E0D9C8", margin: "10px 0 16px" }} />
          <div style={{ fontSize: 22, color: "#3A3F4A" }}>{typed("LASS UNS DAS AUTOMATISIEREN.", t, A.schick + 0.3, A.mail + 0.1)}</div>
        </div>
        <div style={{ position: "absolute", right: 28, bottom: 26, background: sent > 0 ? "#4C9A5A" : INK, color: "#FFF", fontSize: 22, padding: "16px 20px 10px", border: `4px solid ${INK}` }}>{sent > 0 ? "GESENDET" : "SENDEN"}</div>
      </div>
      {t > A.mail + 0.15 && sent < 1 ? (
        <div style={{ position: "absolute", left: 800 + sent * 260, top: 560 - sent * 520, zIndex: 9, transform: `rotate(${-20 * sent}deg)` }}>
          <Sprite rows={["KKKKKKKKKK", "KWKWWWWKWK", "KWWKWWKWWK", "KWWWKKWWWK", "KWWWWWWWWK", "KKKKKKKKKK"]} pal={{ K: INK, W: "#FFF" }} px={10} />
        </div>
      ) : null}
      <Stamp t={t} a={A.datum - 0.05} text="MO 23.10. · 09:14" size={30} rot={-4} style={{ left: 470, top: 120 }} />
      {t > A.vergessen1 - 0.1 ? (
        <div style={{ position: "absolute", left: 40, top: 560, zIndex: 8, ...popStyle(t, A.vergessen1 - 0.1, 14, 0.5) }}>
          <Sprite rows={NK.slice(0, 13)} pal={PAL.chef} px={10} />
          <div style={{ position: "absolute", left: 120, top: -60, fontFamily: PX, fontSize: 54, color: INK, background: "#FFF", border: `5px solid ${INK}`, padding: "10px 14px 4px" }}>?</div>
        </div>
      ) : null}
      <Stamp t={t} a={A.beweis - 0.05} text="BEWEIS ✓" bg="#4C9A5A" color="#FFF" size={56} rot={-8} style={{ left: 560, top: 470 }} />
      {spark(t, A.beweis, 760, 520, 10, 60, 190)}
    </>
  );
};
// 7 · My workshop, my best idea
const SceneWorkshop: React.FC<{ t: number }> = ({ t }) => {
  const lit = t > A.beste - 0.05;
  return (
    <>
      <Plate id="stage" />
      <div style={{ position: "absolute", left: 360, top: 0, width: 400, height: 720, background: "linear-gradient(rgba(255,240,190,0.35), rgba(255,240,190,0.12))", clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)", zIndex: 2 }} />
      <div style={{ position: "absolute", left: 90, top: 250, width: 300, height: 380, zIndex: 3, ...popStyle(t, A.erzaehle - 0.05, 16, 0.8) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 300, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `6px 6px 0 rgba(0,0,0,.35)` }}>
          <div style={{ fontFamily: PX, fontSize: 22, color: INK, textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>MEINE<br />BESTE IDEE</div>
        </div>
        {lit ? <Bulb t={t} x={150} y={210} px={8} style={popStyle(t, A.beste - 0.05, 8, 0.3)} /> : <Bulb t={t} x={150} y={210} px={8} glow={false} style={{ filter: "grayscale(1)", opacity: 0.5 }} />}
        <div style={{ position: "absolute", left: 40, top: 300, width: 8, height: 80, background: "#5A3820" }} />
        <div style={{ position: "absolute", left: 252, top: 300, width: 8, height: 80, background: "#5A3820" }} />
      </div>
      <Person t={t} who="niklas" x={520} y={330} px={13} seed={0.2} />
      {Array.from({ length: 9 }, (_, i) => {
        const hop = Math.floor(t * 3 + i * 0.37) % 2 && lit ? -8 : 0;
        return <div key={i} style={{ position: "absolute", left: 20 + i * 118, top: 820 + hop, zIndex: 7 }}><Sprite rows={NK.slice(0, 7).map((r) => r.replace(/[SsEb]/g, "h"))} pal={{ h: i % 2 ? "#151210" : "#1E1A17", H: "#2B2420", L: "#3A302A" }} px={10} /></div>;
      })}
      {lit ? spark(t, A.beste - 0.05, 240, 460, 8, 30, 120) : null}
    </>
  );
};

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; tag?: [number, string] };
const SCENES: Scene[] = [
  { from: 0, to: A.psych - 0.05, El: SceneHook, pill: "Büro-Phänomen", tag: [A.luegt - 0.05, "ER LÜGT NICHT"] },
  { from: A.psych - 0.05, to: A.forscher - 0.05, El: SceneKrypto, pill: "Psychologie", tag: [A.versteckt + 0.2, "KEINE LÜGE"] },
  { from: A.forscher - 0.05, to: A.bei - 0.1, El: SceneStudy, pill: "Die Studie", tag: [A.gruppen, "STUDIE"] },
  { from: A.bei - 0.1, to: A.montag - 0.05, El: SceneNine, pill: "Die Studie", tag: [A.fremde + 0.1, "9 / 100"] },
  { from: A.montag - 0.05, to: A.mittwoch - 0.05, El: SceneMonday, pill: "Montag · Meeting", tag: [A.montag + 0.1, "MO 10:00"] },
  { from: A.mittwoch - 0.05, to: A.finde - 0.1, El: SceneWednesday, pill: "Mittwoch · Vorstand", tag: [A.mittwoch + 0.1, "MI 14:00"] },
  { from: A.finde - 0.1, to: A.erzaehle - 0.05, El: SceneMail, pill: "Dein Schutz", tag: [A.datum + 0.25, "MIT DATUM"] },
  { from: A.erzaehle - 0.05, to: A.gestern - 0.05, El: SceneWorkshop, pill: "Und ich?", tag: [A.workshop, "WORKSHOP"] },
  { from: A.gestern - 0.05, to: 999 },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["idee", "seine", "lügt", "vergessen", "dir", "kryptomnesie", "erinnern", "gruppen", "eigenen", "neun", "hundert", "fremde", "nie", "automatisieren", "spannend", "vorstand", "mail", "datum", "beweis", "workshop", "beste", "ex", "trotzdem", "achtzehnhundert", "tagessatz"]);
const SHOW: Record<string, string> = { neun: "9", hundert: "100", achtzehnhundert: "1.800" };
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
type Chunk = { start: number; end: number; words: string[] };
const makeChunks = (caps: Cap[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Cap[] = [];
  const flush = () => { if (cur.length) out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => c.text.replace(/[.,!?:]/g, "")) }); cur = []; };
  for (const c of caps) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 17) || (cur.length && len > 20)) flush();
    cur.push(c);
    if (/[.,!?:]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
};
const Caption: React.FC<{ t: number; y: number; chunks: Chunk[] }> = ({ t, y, chunks }) => {
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = pop(t, c.start - 0.04, 0.18);
  const keyIdx = c.words.findIndex((w) => KEY.has(norm(w)));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.06), display: "inline-flex", alignItems: "center", gap: 14, fontFamily: SM, fontWeight: 700, fontSize: 44, letterSpacing: "0.12em", textTransform: "uppercase", padding: "8px 18px", background: INK, color: "#FFF", borderRadius: 8, whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>
        {c.words.map((w, i) => {
          const s = SHOW[norm(w)] ?? w;
          return i === keyIdx ? <b key={i} style={{ background: GOLD, color: INK, padding: "0 10px", borderRadius: 4 }}>{s}</b> : <span key={i}>{s}</span>;
        })}
      </div>
    </div>
  );
};

// pixel dissolve: dark blocks clear in a fixed random order over 0.24 s at every scene start
const ORDER = Array.from({ length: 12 * 11 }, (_, i) => ((i * 53) % 131) / 131);
const Dissolve: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const u = (t - a) / 0.24;
  if (a <= 0 || u < 0 || u > 1) return null;
  return <>{ORDER.map((o, i) => (o > u ? <div key={i} style={{ position: "absolute", left: (i % 12) * 90, top: Math.floor(i / 12) * 90, width: 90, height: 90, background: INK, zIndex: 30 }} /> : null))}</>;
};

// avatar framing in the split (from facefocus.txt): source row that sits at the seam, and scale
const SPLIT_SRC_TOP = 860, SPLIT_SCALE = 1.0, FOCUS_X = 0.445;

export const ChefPixel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = React.useMemo(() => makeChunks(CAPS), []);
  const sc = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const face = !sc.El;
  const cam = TL.camera(t, sc.from, sc.to);
  const dx = Math.sin(t * 0.6) * 4, dy = Math.cos(t * 0.45) * 3;
  // split: scaled so the face sits centred in the lower half; face: full frame with a slow push
  const s = face ? 1.04 + 0.03 * k(t, sc.from, 0.9) : SPLIT_SCALE * (1 + 0.02 * Math.abs(Math.sin((t - sc.from) * 0.8)));
  const vw = W * s, vh = H * s;
  const left = Math.min(0, Math.max(W - vw, W / 2 - FOCUS_X * vw));
  const top = face ? (H - vh) * 0.4 : PH - SPLIT_SRC_TOP * s;
  const El = sc.El;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left, top, width: vw, height: vh }}>
        <OffthreadVideo src={staticFile("render-gpts-chef-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {El ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: "#F7E8CA", boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }}>
          <div style={{ position: "absolute", inset: -20, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: "50% 55%" }}>
            <div style={{ position: "absolute", left: 20, top: 20, width: W, height: PH }}><El t={t} /></div>
          </div>
          {sc.pill ? <Pill text={sc.pill} /> : null}
          {sc.tag ? <TopTag t={t} a={sc.tag[0]} text={sc.tag[1]} /> : null}
          <Dissolve t={t} a={sc.from} />
        </div>
      ) : null}
      <Caption t={t} y={face ? 1500 : PH} chunks={chunks} />
    </AbsoluteFill>
  );
};
export const CP_FPS = FPS;
