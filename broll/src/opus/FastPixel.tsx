import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-fast-befoerdert/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "Fast befördert" (kontrafaktisches Denken, 2026-10-25) im Pixel-Niklas-Look wie BankPixel:
// oben 960 px Pixelwelt, unten der Avatar, Space-Mono-Untertitel auf der Kante.
// Studien-Beats mit echten Screenshots aus Medvec, Madey & Gilovich 1995 (Abstract + Results mit Textmarker).
// Pointe ab "Ich war mal Zweiter" ruhig auf dem Gesicht.

const FPS = 25, W = 1080, H = 1920, PH = 960, CELL = 6;
const GOLD = "#FFC83D", INK = "#141414", RED = "#D8463A", GREEN = "#4C9A5A", SILVER = "#B9C3CE", BRONZE = "#C98A4E";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
export const FB_FRAMES = TL.frames;
export const A = {
  befoerderung: at("beförderung"), letzte: at("letzte"), zweite: at("zweite"), kollege: at("kollege"), fast: at("fast"), weiss: at("weiß"),
  olympia: at("olympia"), psychologen: at("psychologen"), gluecklich: at("glücklich"), medaillengewinner: at("medaillengewinner"), aussehen: at("aussehen"),
  bronze0: at("bronze", 0), sieben: at("sieben"), silber0: at("silber", 0), fuenf: at("fünf"),
  heisst: at("heißt"), kontra: at("kontrafaktisches"), denken: at("denken"),
  silber1: at("silber", 1), gold: at("gold"), bronze1: at("bronze", 1), vier: at("vier"), medaille: at("medaille"),
  montag: at("montag"), chef: at("chef"), lisa: at("lisa"), teamleiterin: at("teamleiterin"), klatscht: at("klatscht"), erster0: at("erster", 0), zweiter0: at("zweiter", 0),
  dienstag: at("dienstag"), linkedin: at("linkedin"), offen: at("offen"), herausforderungen: at("herausforderungen"),
  finde: at("finde"), firmen: at("firmen"), zweiter1: at("zweiter", 1), kuendigt: at("kündigt"), naechsten: at("nächsten"), befoerdern: at("befördern"),
  punch: at("ich", 1),
};

// ---------- pixel plates ----------
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

const drawOffice = () => {
  const p = painter(); const { R } = p;
  R(0, 0, 180, 126, "#E9E4D6"); brick(p, 2, 124, "#DCD5C2");
  // two windows with the city
  [[8, 10], [124, 10]].forEach(([x, y]) => {
    R(x, y, 48, 44, "#5A6270"); sky(p, x + 2, y + 2, 44, 8);
    [[4, 22, 8, 18], [14, 16, 7, 24], [23, 26, 10, 14], [35, 20, 7, 20]].forEach(([bx, by, bw, bh]) => R(x + 2 + bx, y + 2 + by, bw, bh, "#D9CBB0"));
    R(x + 23, y, 2, 44, "#5A6270"); R(x, y + 44, 48, 3, "#3A3F4A");
  });
  // org chart on the wall
  R(66, 14, 48, 34, "#FFFDF6"); R(66, 14, 48, 2, "#3A3F4A");
  R(86, 20, 8, 6, GOLD); R(89, 26, 2, 4, "#3A3F4A"); R(74, 30, 32, 1, "#3A3F4A");
  [72, 86, 100].forEach((x) => { R(x + 1, 30, 1, 4, "#3A3F4A"); R(x - 2, 34, 8, 6, "#B9C3CE"); });
  plant(p, 4, 108); plant(p, 168, 108);
  R(0, 124, 180, 2, "#8A5A34");
  woodFloor(p, 126, "#B9AE98", "#9E937E", "#C9BFAA");
  return p.ops;
};
const drawStadium = () => {
  const p = painter(); const { R, P } = p;
  sky(p, 0, 0, 180, 9); sun(p, 150, 18, 7);
  // stands with a crowd
  R(0, 44, 180, 44, "#5A6270");
  const crowd = ["#E08A55", "#3E7CC9", "#F5F5F5", GOLD, "#4C9A5A", "#D8463A", "#F2C6A4"];
  for (let y = 48; y < 86; y += 4) { R(0, y + 3, 180, 1, "#4A515E"); for (let x = (y / 4) % 2 ? 1 : 3; x < 180; x += 4) { P(x, y, crowd[(x * 7 + y * 3) % crowd.length]); P(x, y + 1, "#2E3440"); } }
  R(0, 86, 180, 3, "#FFFDF6");
  // track + field
  R(0, 89, 180, 30, "#C9673E");
  for (let y = 95; y < 119; y += 8) R(0, y, 180, 1, "#F0D2C0");
  R(0, 119, 180, 41, "#5DB06C");
  for (let x = 0; x < 180; x += 20) R(x, 119, 10, 41, "#4C9A5A");
  return p.ops;
};
const drawSeminar = () => {
  const p = painter(); const { R } = p;
  R(0, 0, 180, 126, "#EFE3CC"); brick(p, 2, 124, "#E2D2B2");
  R(28, 10, 124, 58, "#8A5A30"); R(31, 13, 118, 52, "#2E3440");
  p.dither(31, 13, 118, 2, "#394150", "#2E3440");
  R(31, 64, 118, 3, "#6B4428"); R(60, 63, 6, 1, "#F5F5F5"); R(70, 63, 4, 1, GOLD);
  plant(p, 6, 108); plant(p, 168, 108);
  R(0, 124, 180, 2, "#8A5A34");
  woodFloor(p, 126);
  return p.ops;
};
const drawDesk = () => {
  const p = painter(); const { R } = p;
  R(0, 0, 180, 160, "#5A3820");
  for (let y = 0; y < 160; y += 8) { R(0, y, 180, 1, "#4A2E18"); for (let x = (y / 8) % 2 ? 10 : 40; x < 180; x += 60) R(x, y + 1, 1, 7, "#4A2E18"); R(0, y + 1, 180, 1, "#6B4428"); }
  return p.ops;
};
const PLATES = { office: drawOffice(), stadium: drawStadium(), seminar: drawSeminar(), desk: drawDesk() };
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
  lisa: { h: "#C9673E", H: "#E08A55", L: "#F0A86E", ...SK, E: "#2B2B2B", b: SK.S, N: "#4C9A5A", n: "#3E8049", W: "#F5F5F5", Z: "#3E8049", P: "#3A3F4A", B: "#151515", F: SK.S, f: SK.S },
  tim: { h: "#2B1E16", H: "#3D2B1F", L: "#5A4030", ...SK, E: "#2B2B2B", b: "#9A6A48", N: "#3E7CC9", n: "#2F63A6", W: "#F5F5F5", Z: "#2F63A6", P: "#3A3F4A", B: "#151515", F: SK.S, f: SK.S },
  chef: { h: "#8E8E8E", H: "#B4B4B4", L: "#CFCFCF", ...SK, E: "#2B2B2B", b: "#A8A8A8", N: "#3A3F4A", n: "#2E3440", W: "#F5F5F5", Z: RED, P: "#2E3440", B: "#151515", F: SK.S, f: SK.S },
  ben: { h: "#D9B23E", H: "#EBC95A", L: "#F5DB84", ...SK, E: "#2B2B2B", b: SK.S, N: "#9A5BB0", n: "#7E4893", W: "#F5F5F5", Z: "#7E4893", P: "#3A3F4A", B: "#151515", F: SK.S, f: SK.S },
};
type Who = keyof typeof PAL;
const Person: React.FC<{ t: number; who: Who; x: number; y: number; px?: number; flip?: boolean; seed?: number; a?: number; bob?: number; speed?: number; style?: React.CSSProperties }> = ({ t, who, x, y, px = 12, flip, seed = 0, a = -1, bob = 1, speed = 3.2, style }) => {
  const st = a >= 0 ? popStyle(t, a, 30, 0.4) : {};
  const hop = Math.floor(t * speed + seed) % 2 ? -px * bob : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 4, ...st, ...style }}>
      <div style={{ position: "absolute", left: px * 3, top: NK.length * px - px * 0.6, width: px * 9, height: px * 1.2, background: "rgba(80,60,30,0.28)" }} />
      <div style={{ transform: `translateY(${hop}px) scaleX(${flip ? -1 : 1})` }}><Sprite rows={NK} pal={PAL[who]} px={px} /></div>
    </div>
  );
};
// tears from both eyes (eye rows 5, cols 4 and 9)
const Tears: React.FC<{ t: number; a: number; x: number; y: number; px: number }> = ({ t, a, x, y, px }) => {
  if (t < a) return null;
  return <>{[4, 9].flatMap((c, j) => [0, 1].map((n) => {
    const u = ((t - a) * 1.6 + n * 0.5 + j * 0.25) % 1;
    return <div key={`${c}${n}`} style={{ position: "absolute", left: x + c * px + px * 0.2, top: y + 6 * px + u * px * 5, width: px * 0.7, height: px, background: "#7FD3FF", border: `2px solid ${INK}`, opacity: 1 - u * 0.6, zIndex: 6 }} />;
  }))}</>;
};

// ---------- props ----------
const medal = (m: string) => ({ rows: ["RR....RR", ".RR..RR.", "..RRRR..", "...MM...", "..MMMM..", ".MWMMMD.", ".MMMMMD.", "..MMDD.."], pal: { R: "#3E7CC9", M: m, W: "#FFFFFF", D: "rgba(0,0,0,0.25)" } });
const CROWN = { rows: ["Y..Y..Y", "YY.Y.YY", "YYYYYYY", "YRYYYRY", "YYYYYYY"], pal: { Y: GOLD, R: RED } };
const LETTER = { rows: ["KKKKKKKKKK", "KWKWWWWKWK", "KWWKWWKWWK", "KWWWKKWWWK", "KWWWWWRRWK", "KKKKKKKKKK"], pal: { K: INK, W: "#FFF", R: RED } };

const Phone: React.FC<{ x: number; y: number; w?: number; rot?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w = 110, rot = 0, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 1.8, background: INK, border: `${Math.round(w / 18)}px solid ${INK}`, boxShadow: `8px 8px 0 rgba(0,0,0,.3)`, transform: `rotate(${rot}deg)`, zIndex: 8, overflow: "hidden", ...style }}>
    <div style={{ position: "absolute", inset: w * 0.04, background: "#FFFDF6", overflow: "hidden" }}>{children}</div>
  </div>
);

// ---------- pixel UI pieces ----------
const PxBox: React.FC<{ bg?: string; color?: string; size?: number; border?: string; shadow?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({ bg = GOLD, color = INK, size = 28, border = INK, shadow = true, style, children }) => (
  <div style={{ position: "absolute", fontFamily: PX, fontSize: size, lineHeight: 1.25, color, background: bg, border: `${Math.max(4, Math.round(size / 6))}px solid ${border}`, padding: `${size * 0.55}px ${size * 0.6}px ${size * 0.4}px`, boxShadow: shadow ? `6px 6px 0 ${INK}` : undefined, whiteSpace: "nowrap", zIndex: 8, ...style }}>{children}</div>
);
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
// thought cloud: box plus three shrinking squares toward the head
const Thought: React.FC<{ t: number; a: number; x: number; y: number; tail: "l" | "r"; children: React.ReactNode }> = ({ t, a, x, y, tail, children }) => (t < a ? null : (
  <div style={{ position: "absolute", left: x, top: y, zIndex: 9, ...popStyle(t, a, 14, 0.5) }}>
    <div style={{ position: "relative", background: "#FFFFFF", border: `6px solid ${INK}`, borderRadius: 26, padding: "18px 22px 14px", boxShadow: `6px 6px 0 ${INK}`, display: "flex", alignItems: "center", gap: 16 }}>
      {children}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", top: `calc(100% + ${8 + i * 22}px)`, [tail === "l" ? "left" : "right"]: 50 + i * 26, width: 26 - i * 7, height: 26 - i * 7, background: "#FFF", border: `5px solid ${INK}` } as React.CSSProperties} />
      ))}
    </div>
  </div>
));
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
// wall calendar with a flip between two weekdays
const Calendar: React.FC<{ t: number; x: number; y: number; day: string; prev?: string; flipAt?: number }> = ({ t, x, y, day, prev, flipAt = -1 }) => {
  const f = flipAt > 0 ? k(t, flipAt, 0.3, Easing.inOut(Easing.cubic)) : 1;
  const shown = f < 0.5 && prev ? prev : day;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 170, height: 170, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `6px 6px 0 rgba(0,0,0,.25)`, zIndex: 3 }}>
      <div style={{ height: 44, background: RED, borderBottom: `6px solid ${INK}`, fontFamily: PX, fontSize: 16, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}>WOCHE</div>
      <div style={{ fontFamily: PX, fontSize: 60, color: INK, textAlign: "center", marginTop: 26, transform: `scaleY(${Math.abs(1 - 2 * Math.min(1, f))})` }}>{shown}</div>
    </div>
  );
};
// a study crop on paper: pops in, zooms onto a point, highlighter strokes on lines
type Mark = { x: number; y: number; w: number; h: number; a: number; col: string };
const Paper: React.FC<{ t: number; src: string; iw: number; ih: number; s: number; x: number; y: number; a: number; zoomAt: number; zoom: number; focus: [number, number]; marks: Mark[] }> = ({ t, src, iw, ih, s, x, y, a, zoomAt, zoom, focus, marks }) => {
  const z = k(t, zoomAt, 0.6, Easing.inOut(Easing.cubic));
  const ox = x + focus[0] * s, oy = y + focus[1] * s;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${(540 - ox) * z}px, ${(470 - oy) * z}px) scale(${1 + (zoom - 1) * z})`, transformOrigin: `${ox}px ${oy}px`, zIndex: 3 }}>
      <div style={{ position: "absolute", left: x - 14, top: y - 14, width: iw * s + 28, height: ih * s + 28, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.45)`, ...popStyle(t, a, 24, 0.85) }} />
      <Img src={staticFile(src)} style={{ position: "absolute", left: x, top: y, width: iw * s, height: ih * s, ...popStyle(t, a, 24, 0.85) }} />
      {marks.map((m, i) => (
        <div key={i} style={{ position: "absolute", left: x + m.x * s - 6, top: y + m.y * s - 3, width: (m.w * s + 12) * k(t, m.a, 0.45, Easing.inOut(Easing.cubic)), height: m.h * s + 6, background: m.col, mixBlendMode: "multiply", opacity: 0.85 }} />
      ))}
    </div>
  );
};

// ---------- scenes ----------
// 1 · Hook: promotion podium. Not the last one loses, the second one does. Frame 0 readable.
const POD = [
  { n: "2", who: "tim" as Who, x: 210, top: 760, col: SILVER },
  { n: "1", who: "lisa" as Who, x: 440, top: 715, col: GOLD },
  { n: "3", who: "ben" as Who, x: 670, top: 795, col: BRONZE },
];
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const hit = t > A.zweite - 0.05;
  return (
    <>
      <Plate id="office" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 40, color: "#FFF", background: INK, padding: "22px 26px 14px", boxShadow: `6px 6px 0 rgba(0,0,0,.25)`, transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - 0.2) / 0.2)})` }}>BEFÖRDERUNG:</div>
        <div style={{ fontFamily: PX, fontSize: 40, color: INK, background: GOLD, border: `6px solid ${INK}`, padding: "18px 22px 10px", boxShadow: `6px 6px 0 ${INK}`, transform: `rotate(${hit ? -3 : 0}deg) scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - A.zweite) / 0.18)})` }}>DER ZWEITE VERLIERT.</div>
      </div>
      {POD.map((p, i) => (
        <React.Fragment key={p.n}>
          <div style={{ position: "absolute", left: p.x, top: p.top, width: 200, height: 920 - p.top, background: p.col, border: `6px solid ${INK}`, boxShadow: `6px 6px 0 rgba(0,0,0,.25)`, zIndex: 3, display: "flex", justifyContent: "center", paddingTop: 18, fontFamily: PX, fontSize: 44, color: INK }}>{p.n}</div>
          <Person t={t} who={p.who} x={p.x + 30} y={p.top - 250} px={10} seed={i * 0.7} bob={p.n === "2" && hit ? 0 : 1} />
        </React.Fragment>
      ))}
      {t > A.befoerderung ? <div style={{ position: "absolute", left: 440 + 30 + 35, top: 715 - 250 - 62, ...popStyle(t, A.befoerderung, 12, 0.4), zIndex: 6 }}><Sprite rows={CROWN.rows} pal={CROWN.pal} px={10} /></div> : null}
      {t > A.letzte - 0.05 ? <PxBox bg={GREEN} color="#FFF" size={20} style={{ left: 700, top: 455, ...popStyle(t, A.letzte - 0.05, 10, 0.5) }}>ALLES OK</PxBox> : null}
      {hit ? <div style={{ position: "absolute", left: 196, top: 490, width: 228, height: 430, border: `8px solid ${RED}`, opacity: Math.floor((t - A.zweite) * 6) % 2 && t - A.zweite < 0.7 ? 0.3 : 1, zIndex: 5 }} /> : null}
      {hit ? <Stamp t={t} a={A.zweite + 0.05} text="GRÖSSTER VERLIERER" bg={RED} color="#FFF" size={24} rot={-4} style={{ left: 60, top: 400 }} /> : null}
      {t > A.kollege - 0.05 ? <PxBox bg="#FFF" size={18} style={{ left: 216, top: 860, ...popStyle(t, A.kollege - 0.05, 8, 0.5), zIndex: 7 }}>DEIN KOLLEGE</PxBox> : null}
      {t > A.fast - 0.05 ? <PxBox bg={GOLD} size={22} style={{ left: 120, top: 610, transform: "rotate(-6deg)", ...popStyle(t, A.fast - 0.05, 10, 0.5), zIndex: 9 }}>FAST.</PxBox> : null}
      <Tears t={t} a={A.weiss - 0.05} x={240} y={510} px={10} />
      {hit ? spark(t, A.zweite, 310, 640, 8, 40, 150, RED) : null}
    </>
  );
};

// 2a · The study: real abstract, highlighter on "bronze medalists tend to be happier than silver medalists"
// crop 1460x580 of p.2; key line at x25 y321 w1015 h39
const SceneAbstract: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="desk" />
    <Paper t={t} src="fast-study-abstract.png" iw={1460} ih={580} s={0.62} x={88} y={250} a={A.olympia - 0.1} zoomAt={A.medaillengewinner - 0.15} zoom={1.45} focus={[532, 340]}
      marks={[{ x: 25, y: 321, w: 1015, h: 39, a: A.gluecklich - 0.1, col: GOLD }]} />
    <PxBox bg={INK} color="#FFF" size={18} shadow={false} style={{ left: 40, bottom: 34, ...popStyle(t, A.olympia, 10, 0.5) }}>J PERS SOC PSYCHOL · 1995</PxBox>
    <Stamp t={t} a={A.aussehen} text="BRONZE > SILBER" bg={GOLD} size={32} rot={-5} style={{ left: 300, top: 640 }} />
  </>
);

// 2b · Results paragraph: bronze 7.1 vs silver 4.8 on a 10-point scale
// crop 1460x562 of p.5; "bronze ... 7.1" x697 y403 w692 h39, "silver ... 4.8" x186 y443 w704 h40
const SceneResults: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="desk" />
    <Paper t={t} src="fast-study-results.png" iw={1460} ih={562} s={0.62} x={88} y={240} a={A.bronze0 - 0.15} zoomAt={A.bronze0 - 0.05} zoom={1.3} focus={[787, 443]}
      marks={[{ x: 697, y: 403, w: 692, h: 39, a: A.bronze0 + 0.05, col: GOLD }, { x: 186, y: 443, w: 704, h: 40, a: A.silber0, col: SILVER }]} />
    {t > A.sieben - 0.05 ? (
      <div style={{ position: "absolute", left: 120, top: 740, display: "flex", alignItems: "center", gap: 14, zIndex: 12, ...popStyle(t, A.sieben - 0.05, 14, 0.4) }}>
        <Sprite rows={medal(BRONZE).rows} pal={medal(BRONZE).pal} px={10} />
        <PxBox bg={GOLD} size={34} style={{ position: "relative" }}>7,1</PxBox>
      </div>
    ) : null}
    {t > A.fuenf - 0.05 ? (
      <div style={{ position: "absolute", left: 600, top: 740, display: "flex", alignItems: "center", gap: 14, zIndex: 12, ...popStyle(t, A.fuenf - 0.05, 14, 0.4) }}>
        <Sprite rows={medal(SILVER).rows} pal={medal(SILVER).pal} px={10} />
        <PxBox bg={SILVER} size={34} style={{ position: "relative" }}>4,8</PxBox>
      </div>
    ) : null}
    {t > A.sieben ? spark(t, A.sieben, 290, 790, 8, 40, 140) : null}
    <PxBox bg={INK} color="#FFF" size={18} shadow={false} style={{ left: 40, bottom: 34 }}>SKALA: 1 = QUAL · 10 = EKSTASE</PxBox>
  </>
);

// 3a · The term, typed big over the stadium
const SceneTerm: React.FC<{ t: number }> = ({ t }) => {
  const l1 = typed("KONTRAFAKTISCHES", t, A.kontra - 0.15, A.kontra + 0.5);
  const l2 = typed("DENKEN", t, A.denken - 0.1, A.denken + 0.2);
  return (
    <>
      <Plate id="stadium" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 46, lineHeight: 1.5, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "26px 28px 16px", boxShadow: `0 8px 0 #6B4528`, textAlign: "center", ...popStyle(t, A.heisst, 16, 0.7) }}>
          {l1}<span style={{ opacity: 0 }}>{"KONTRAFAKTISCHES".slice(l1.length)}</span><br />
          {l2}<span style={{ opacity: 0 }}>{"DENKEN".slice(l2.length)}</span>
        </div>
      </div>
      <Person t={t} who="tim" x={456} y={560} px={11} seed={0.4} bob={0} />
      <Thought t={t} a={A.denken + 0.15} x={600} y={420} tail="l"><span style={{ fontFamily: PX, fontSize: 24, color: INK }}>WAS WÄRE, WENN …?</span></Thought>
    </>
  );
};

// 3b · Silver thinks of gold, bronze thinks of fourth place without a medal
const SceneThoughts: React.FC<{ t: number }> = ({ t }) => {
  const happy = t > A.medaille - 0.05;
  return (
    <>
      <Plate id="stadium" />
      {[{ x: 150, top: 760, col: SILVER, n: "2" }, { x: 640, top: 800, col: BRONZE, n: "3" }].map((p) => (
        <div key={p.n} style={{ position: "absolute", left: p.x, top: p.top, width: 280, height: 920 - p.top, background: p.col, border: `6px solid ${INK}`, boxShadow: `6px 6px 0 rgba(0,0,0,.25)`, zIndex: 3, display: "flex", justifyContent: "center", paddingTop: 16, fontFamily: PX, fontSize: 40, color: INK }}>{p.n}</div>
      ))}
      <Person t={t} who="tim" x={206} y={510} px={10} bob={0} />
      <div style={{ position: "absolute", left: 266, top: 640, zIndex: 6 }}><Sprite rows={medal(SILVER).rows} pal={medal(SILVER).pal} px={5} /></div>
      <Tears t={t} a={A.gold + 0.2} x={206} y={510} px={10} />
      <Person t={t} who="ben" x={696} y={550} px={10} seed={0.3} bob={happy ? 2 : 0} speed={happy ? 6 : 3.2} />
      <div style={{ position: "absolute", left: 756, top: 680, zIndex: 6 }}><Sprite rows={medal(BRONZE).rows} pal={medal(BRONZE).pal} px={5} /></div>
      <Thought t={t} a={A.silber1} x={60} y={250} tail="l">
        {t > A.gold - 0.1 ? <div style={popStyle(t, A.gold - 0.1, 10, 0.4)}><Sprite rows={medal(GOLD).rows} pal={medal(GOLD).pal} px={8} /></div> : null}
        <span style={{ fontFamily: PX, fontSize: 26, color: INK }}>{t > A.gold - 0.1 ? "GOLD …" : "…"}</span>
      </Thought>
      <Thought t={t} a={A.bronze1} x={560} y={250} tail="r">
        <span style={{ fontFamily: PX, fontSize: 24, lineHeight: 1.5, color: INK }}>{t > A.vier - 0.1 ? "PLATZ 4?" : "…"}<br />{t > A.medaille - 0.1 ? <span style={{ color: RED }}>OHNE MEDAILLE!</span> : null}</span>
      </Thought>
      {happy ? <Stamp t={t} a={A.medaille + 0.15} text="PUH. GLÜCK GEHABT." bg={GREEN} color="#FFF" size={22} rot={4} style={{ left: 600, top: 480 }} /> : null}
      {happy ? spark(t, A.medaille, 766, 640, 10, 50, 170) : null}
    </>
  );
};

// 4 · Monday: the boss names Lisa, Tim claps first, Tim was second
const SceneMonday: React.FC<{ t: number }> = ({ t }) => {
  const crowned = t > A.teamleiterin - 0.05;
  const clap = t > A.klatscht - 0.05;
  const second = t > A.zweiter0 - 0.05;
  return (
    <>
      <Plate id="office" />
      <Calendar t={t} x={860} y={130} day="MO" />
      <Person t={t} who="chef" x={80} y={430} px={12} seed={0.1} a={A.montag - 0.05} />
      <Person t={t} who="lisa" x={420} y={430} px={12} seed={0.5} bob={crowned ? 1 : 0} />
      <Person t={t} who="tim" x={760} y={430} px={12} flip seed={0.9} bob={clap && !second ? 1 : 0} speed={clap && !second ? 8 : 3.2} />
      <Bubble t={t} a={A.chef + 0.1} text="LISA WIRD TEAMLEITERIN." x={50} y={170} size={26} w={560} type={0.6} />
      {crowned ? <div style={{ position: "absolute", left: 420 + 12 * 3.5, top: 430 - 70, zIndex: 6, ...popStyle(t, A.teamleiterin - 0.05, 16, 0.4) }}><Sprite rows={CROWN.rows} pal={CROWN.pal} px={12} /></div> : null}
      {crowned ? spark(t, A.teamleiterin, 504, 400, 10, 40, 160) : null}
      {clap && !second ? <PxBox bg="#FFF" size={22} style={{ left: 690 + (Math.floor(t * 8) % 2) * 10, top: 340, transform: `rotate(${Math.floor(t * 8) % 2 ? 5 : -5}deg)`, ...popStyle(t, A.klatscht - 0.05, 8, 0.5) }}>KLATSCH!</PxBox> : null}
      {t > A.erster0 - 0.05 && !second ? <Stamp t={t} a={A.erster0 - 0.05} text="ALS ERSTER" bg={GOLD} size={22} rot={-4} style={{ left: 640, top: 330 }} /> : null}
      {second ? <div style={{ position: "absolute", left: 760 + 12 * 4.5, top: 430 + 12 * 12.5, zIndex: 6, ...popStyle(t, A.zweiter0 - 0.05, 10, 0.4) }}><Sprite rows={medal(SILVER).rows} pal={medal(SILVER).pal} px={7} /></div> : null}
      {second ? <Stamp t={t} a={A.zweiter0} text="WAR ZWEITER" bg={RED} color="#FFF" size={26} rot={-5} style={{ left: 600, top: 330 }} /> : null}
    </>
  );
};

// 5 · Tuesday: Tim's profile, green ring, "Offen für neue Herausforderungen"
const HEAD = NK.slice(0, 11);
const SceneTuesday: React.FC<{ t: number }> = ({ t }) => {
  const txt = "OFFEN FÜR NEUE HERAUSFORDERUNGEN";
  const s = typed(txt, t, A.offen - 0.1, A.herausforderungen + 0.25);
  const ring = k(t, A.offen - 0.1, 0.4);
  return (
    <>
      <Plate id="office" />
      <Calendar t={t} x={860} y={130} day="DI" prev="MO" flipAt={A.dienstag - 0.1} />
      <Person t={t} who="tim" x={70} y={430} px={12} seed={0.4} />
      <Phone x={340} y={110} w={420} style={popStyle(t, A.linkedin - 0.1, 24, 0.6)}>
        <div style={{ fontFamily: PX, color: INK }}>
          <div style={{ height: 120, background: "#3E7CC9" }} />
          <div style={{ position: "relative", marginTop: -80, marginLeft: 26, width: 160, height: 160, borderRadius: "50%", background: "#E9E4D6", border: `10px solid ${ring > 0 ? GREEN : "#FFF"}`, boxShadow: ring > 0 ? `0 0 0 ${6 * ring}px ${GREEN}` : undefined, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
            <Sprite rows={HEAD} pal={PAL.tim} px={10} />
          </div>
          <div style={{ fontSize: 36, margin: "22px 26px 0" }}>TIM</div>
          <div style={{ fontSize: 18, color: "#5A6270", margin: "14px 26px 0", lineHeight: 1.6 }}>SENIOR SALES<br />SEIT 6 JAHREN</div>
          {t > A.offen - 0.15 ? (
            <div style={{ margin: "26px 16px 0", background: "#E3F2E6", border: `5px solid ${GREEN}`, padding: "16px 10px 10px", fontSize: 17, lineHeight: 1.5, color: INK, ...popStyle(t, A.offen - 0.15, 10, 0.6) }}>
              {s}<span style={{ opacity: 0 }}>{txt.slice(s.length)}</span>
            </div>
          ) : null}
        </div>
      </Phone>
      {t > A.herausforderungen ? spark(t, A.herausforderungen + 0.2, 550, 640, 10, 60, 220, GREEN) : null}
    </>
  );
};

// 6 · "Ich finde": rule on the board, the second one quits
const SceneRule: React.FC<{ t: number }> = ({ t }) => {
  const quit = t > A.kuendigt - 0.05;
  const fly = k(t, A.kuendigt - 0.05, 0.5, Easing.inOut(Easing.cubic));
  return (
    <>
      <Plate id="seminar" />
      <div style={{ position: "absolute", left: 31 * CELL, top: 13 * CELL, width: 118 * CELL, height: 52 * CELL, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, zIndex: 3 }}>
        <div style={{ fontFamily: PX, fontSize: 40, color: GOLD }}>{typed("MEINE REGEL:", t, A.finde - 0.05, A.finde + 0.35)}</div>
        <div style={{ fontFamily: PX, fontSize: 30, color: "#F5F5F5", lineHeight: 1.7, textAlign: "center" }}>
          {typed("NIE SAGEN,", t, A.firmen, A.firmen + 0.6)}<br />
          <span style={{ color: t > A.zweiter1 ? GOLD : "#F5F5F5" }}>{typed("WER ZWEITER WAR.", t, A.zweiter1 - 0.5, A.zweiter1 + 0.25)}</span>
        </div>
      </div>
      <Person t={t} who="niklas" x={70} y={420} px={12} seed={0.2} a={A.finde - 0.05} />
      <Person t={t} who="tim" x={780} y={420} px={12} flip seed={1} style={{ opacity: 1 - 0.5 * k(t, A.naechsten + 0.3, 0.4) }} />
      {quit ? (
        <div style={{ position: "absolute", left: 700 - 280 * fly, top: 560 - Math.sin(fly * Math.PI) * 160, zIndex: 9, ...popStyle(t, A.kuendigt - 0.05, 10, 0.4) }}>
          <Sprite rows={LETTER.rows} pal={LETTER.pal} px={12} />
          <div style={{ fontFamily: PX, fontSize: 18, color: "#FFF", background: RED, padding: "8px 10px 4px", marginTop: 8, border: `4px solid ${INK}` }}>KÜNDIGUNG</div>
        </div>
      ) : null}
      {t > A.naechsten - 0.05 ? (
        <div style={{ position: "absolute", left: 500, top: 760, zIndex: 10, ...popStyle(t, A.naechsten - 0.05, 10, 0.5) }}>
          <PxBox bg="#FFF" size={20} style={{ position: "relative" }}>NÄCHSTER TEAMLEITER</PxBox>
          <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 8, background: RED, transform: `rotate(-6deg) scaleX(${k(t, A.befoerdern, 0.25)})`, transformOrigin: "0 50%" }} />
        </div>
      ) : null}
    </>
  );
};

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; tag?: [number, string] };
const SCENES: Scene[] = [
  { from: 0, to: A.olympia - 0.05, El: SceneHook, pill: "Büro · Karriere", tag: [A.zweite, "PLATZ 2"] },
  { from: A.olympia - 0.05, to: A.bronze0 - 0.15, El: SceneAbstract, pill: "Die Studie", tag: [A.olympia + 0.1, "OLYMPIA 1992"] },
  { from: A.bronze0 - 0.15, to: A.heisst - 0.05, El: SceneResults, pill: "Die Studie · Results", tag: [A.bronze0, "GEMESSEN"] },
  { from: A.heisst - 0.05, to: A.silber1 - 0.1, El: SceneTerm, pill: "Psychologie" },
  { from: A.silber1 - 0.1, to: A.montag - 0.05, El: SceneThoughts, pill: "Im Kopf", tag: [A.gold, "NACH OBEN VS. UNTEN"] },
  { from: A.montag - 0.05, to: A.dienstag - 0.1, El: SceneMonday, pill: "Montag", tag: [A.teamleiterin, "BEFÖRDERUNG"] },
  { from: A.dienstag - 0.1, to: A.finde - 0.05, El: SceneTuesday, pill: "Dienstag · LinkedIn", tag: [A.offen, "OPEN TO WORK"] },
  { from: A.finde - 0.05, to: A.punch - 0.05, El: SceneRule, pill: "Meine Meinung", tag: [A.kuendigt, "KÜNDIGT"] },
  { from: A.punch - 0.05, to: 999 },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["beförderung", "letzte", "zweite", "kollege", "fast", "olympia", "glücklich", "bronze", "sieben", "silber", "fünf", "kontrafaktisches", "gold", "vier", "medaille", "lisa", "teamleiterin", "klatscht", "erster", "zweiter", "linkedin", "herausforderungen", "nie", "kündigt", "nächsten", "firma", "einem", "ki"]);
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
        {c.words.map((w, i) => (i === keyIdx ? <b key={i} style={{ background: GOLD, color: INK, padding: "0 10px", borderRadius: 4 }}>{w}</b> : <span key={i}>{w}</span>))}
      </div>
    </div>
  );
};

const ORDER = Array.from({ length: 12 * 11 }, (_, i) => ((i * 53) % 131) / 131);
const Dissolve: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const u = (t - a) / 0.24;
  if (a <= 0 || u < 0 || u > 1) return null;
  return <>{ORDER.map((o, i) => (o > u ? <div key={i} style={{ position: "absolute", left: (i % 12) * 90, top: Math.floor(i / 12) * 90, width: 90, height: 90, background: INK, zIndex: 30 }} /> : null))}</>;
};

// avatar framing in the split (from facefocus.txt)
const SPLIT_SRC_TOP = 860, SPLIT_SCALE = 1.0, FOCUS_X = 0.444;

export const FastPixel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = React.useMemo(() => makeChunks(CAPS), []);
  const sc = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const face = !sc.El;
  const cam = TL.camera(t, sc.from, sc.to);
  const dx = Math.sin(t * 0.6) * 4, dy = Math.cos(t * 0.45) * 3;
  const s = face ? 1.04 + 0.03 * k(t, sc.from, 0.9) : SPLIT_SCALE * (1 + 0.02 * Math.abs(Math.sin((t - sc.from) * 0.8)));
  const vw = W * s, vh = H * s;
  const left = Math.min(0, Math.max(W - vw, W / 2 - FOCUS_X * vw));
  const top = face ? (H - vh) * 0.4 : PH - SPLIT_SRC_TOP * s;
  const El = sc.El;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left, top, width: vw, height: vh }}>
        <OffthreadVideo src={staticFile("render-gpts-fast-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
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
      <Caption t={t} y={face ? 1740 : PH} chunks={chunks} />
    </AbsoluteFill>
  );
};
export const FB_FPS = FPS;
