import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-banking-app/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "Banking-App" (Vogel-Strauß-Effekt, 2026-10-24) im Pixel-Niklas-Look wie ChefPixel:
// oben 960 px Pixelwelt, unten der Avatar, Space-Mono-Untertitel auf der Kante.
// Studien-Beat mit echten Screenshots aus Sicherman et al. 2016 (Abstract mit Textmarker, Figure 4 mit Markierungen).
// Pointe ab "Ich hab für mein Geld" ruhig auf dem Gesicht.

const FPS = 25, W = 1080, H = 1920, PH = 960, CELL = 6;
const GOLD = "#FFC83D", INK = "#141414", RED = "#D8463A", GREEN = "#4C9A5A";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
export const BP_FRAMES = TL.frames;
export const A = {
  partner: at("partner"), ueberblick: at("überblick"), konto: at("konto"), luegt: at("lügt"), hat1: at("hat", 1), sehen: at("sehen"),
  heisst: at("heißt"), vogel: at("vogelstraußeffekt"), schlechte: at("schlechte"), nachrichten: at("nachrichten"), einfach: at("einfach"), hin: at("hin"),
  anlegern: at("anlegern"), gemessen: at("gemessen"), steigen: at("steigen"), schauen0: at("schauen", 0), oefter: at("öfter"), depot: at("depot"), fallen: at("fallen"), seltener: at("seltener"),
  am28: at("achtundzwanzigsten", 0), wie: at("wie"), muss: at("muss"), schaut: at("schaut", 1),
  ersten: at("ersten", 0), gehalt: at("gehalt"), oeffnet: at("öffnet"), app: at("app"), mallorca: at("mallorca"),
  finde: at("finde"), strategie: at("strategie"), nachschaut: at("nachschaut"), am28b: at("achtundzwanzigsten", 1), reich: at("reich"),
  punch: at("ich", 2),
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

const drawLiving = () => {
  const p = painter(); const { R } = p;
  R(0, 0, 180, 126, "#EFE0C4"); brick(p, 2, 124, "#E3D0AC");
  // window with evening sky
  R(14, 12, 76, 56, "#7A4B2C"); sky(p, 16, 14, 72, 10.4); sun(p, 70, 30, 6);
  [[18, 46, 12, 22], [32, 40, 8, 28], [44, 50, 14, 18], [62, 44, 10, 24], [76, 52, 10, 16]].forEach(([x, y, w, h]) => R(x, y, w, h, "#E7D2B0"));
  R(51, 12, 3, 56, "#7A4B2C"); R(14, 38, 76, 2, "#7A4B2C"); R(10, 68, 84, 3, "#9E4A2A");
  // floor lamp + plant
  R(160, 40, 12, 8, "#FFE08A"); R(158, 38, 16, 3, "#C9673E"); R(165, 48, 2, 62, "#3A3F4A"); R(161, 110, 10, 3, "#3A3F4A");
  plant(p, 4, 108);
  R(0, 124, 180, 2, "#8A5A34");
  woodFloor(p, 126);
  // rug + sofa
  R(30, 136, 120, 14, "#C9673E"); R(32, 138, 116, 10, "#E08A55"); for (let x = 36; x < 146; x += 8) R(x, 142, 4, 2, "#C9673E");
  R(28, 92, 124, 16, "#3E5C8A"); R(28, 92, 124, 2, "#5B7DB0"); R(32, 108, 116, 12, "#4A6A9C"); R(32, 108, 116, 2, "#6E8FC2");
  R(22, 100, 8, 22, "#34507A"); R(150, 100, 8, 22, "#34507A"); R(30, 120, 3, 5, "#2B1A0E"); R(147, 120, 3, 5, "#2B1A0E");
  return p.ops;
};
const drawDesert = () => {
  const p = painter(); const { R, dither } = p;
  sky(p, 0, 0, 180, 20); sun(p, 140, 34, 12);
  R(0, 98, 180, 62, "#E8C27A");
  dither(0, 96, 180, 3, "#E8C27A", "#FFD07E");
  // dunes
  for (let x = 0; x < 180; x++) { const h = Math.round(6 + 5 * Math.sin(x / 17) + 3 * Math.sin(x / 7)); R(x, 98 - h, 1, h, "#F0CF8C"); R(x, 98 - h, 1, 1, "#F7DFA6"); }
  for (let y = 108; y < 160; y += 7) for (let x = (y % 2) * 5; x < 180; x += 14) R(x, y, 4, 1, "#D6AC62");
  // cactus
  R(20, 70, 5, 34, "#4C9A5A"); R(14, 80, 4, 10, "#4C9A5A"); R(14, 88, 8, 3, "#4C9A5A"); R(27, 76, 4, 12, "#4C9A5A"); R(24, 86, 6, 3, "#4C9A5A"); R(21, 70, 1, 34, "#5DB06C");
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
const PLATES = { living: drawLiving(), desert: drawDesert(), seminar: drawSeminar(), desk: drawDesk() };
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
  du: { h: "#C9673E", H: "#E08A55", L: "#F0A86E", ...SK, E: "#2B2B2B", b: SK.S, N: "#4C9A5A", n: "#3E8049", W: "#F5F5F5", Z: "#3E8049", P: "#3A3F4A", B: "#151515", F: SK.S, f: SK.S },
  partner: { h: "#2B1E16", H: "#3D2B1F", L: "#5A4030", ...SK, E: "#2B2B2B", b: "#9A6A48", N: "#3E7CC9", n: "#2F63A6", W: "#F5F5F5", Z: "#2F63A6", P: "#3A3F4A", B: "#151515", F: SK.S, f: SK.S },
};
type Who = keyof typeof PAL;
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

// ---------- props ----------
const OSTRICH_UP = [
  "........PPP...", ".......PPEPOO.", ".......PPPP...", "........PP....", "........PP....", "........PP....", "........PP....", ".......PP.....",
  "...KKKKKPP....", "..KKKKKKKKK...", ".WKKKKKKKKKK..", "WWKKKKKKKKKK..", "WWKKKKKKKKKK..", ".WKKKKKKKKK...", "...KKKKKKK....", ".....P..P.....",
  ".....P..P.....", ".....P..P.....", ".....P..P.....", ".....P..P.....", "....PP.PP.....",
];
const OSTRICH_DOWN = [
  "..............", "..............", "..............", "..............", "..............", "..............", "..............", "..............",
  "...KKKKKK.....", "..KKKKKKKKK...", ".WKKKKKKKKKP..", "WWKKKKKKKKKPP.", "WWKKKKKKKKK.PP", ".WKKKKKKKKK..P", "...KKKKKKK...P", ".....P..P....P",
  ".....P..P....P", ".....P..P....P", ".....P..P...PP", ".....P..P.....", "....PP.PP.....",
];
const OST_PAL = { K: "#2B2420", W: "#F5F5F5", P: "#E8A0A0", E: INK, O: "#E0A21E" };
const COIN = { rows: ["..YYYY..", ".YWWYYD.", "YWYDDYYD", "YYDYYDYD", "YYDYYDYD", "YYYDDYYD", ".YYYYYD.", "..DDDD.."], pal: { Y: GOLD, W: "#FFF2B8", D: "#C98A12" } };
const PALM = { rows: ["..GG...GG..", ".GGGG.GGGG.", "GGG.GGG.GGG", "G...GBG...G", "....BB.....", "....B......", "....BB.....", ".....B.....", ".....BB....", "......B....", "......B...."], pal: { G: "#4C9A5A", B: "#8A5A30" } };
const PLANE = { rows: ["....K.......", "....KK......", "KK..KKK.....", "KKKKKKKKKKK.", "KK..KKK.....", "....KK......", "....K......."], pal: { K: "#FFFFFF" } };
const ARROW_UP = { rows: ["...GG...", "..GGGG..", ".GGGGGG.", "GGGGGGGG", "..GGGG..", "..GGGG..", "..GGGG.."], pal: { G: GREEN } };
const ARROW_DN = { rows: ["..RRRR..", "..RRRR..", "..RRRR..", "RRRRRRRR", ".RRRRRR.", "..RRRR..", "...RR..."], pal: { R: RED } };

// a phone: face-up shows the screen, face-down the back
const Phone: React.FC<{ x: number; y: number; w?: number; down?: boolean; rot?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w = 110, down, rot = 0, children, style }) => {
  const h = w * 1.8;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: down ? "#3A3F4A" : INK, border: `${Math.round(w / 18)}px solid ${INK}`, boxShadow: `6px 6px 0 rgba(0,0,0,.3)`, transform: `rotate(${rot}deg)`, zIndex: 8, overflow: "hidden", ...style }}>
      {down ? <div style={{ position: "absolute", left: w * 0.12, top: w * 0.12, width: w * 0.22, height: w * 0.22, background: "#151515", border: `3px solid #5A6270` }} /> : (
        <div style={{ position: "absolute", inset: w * 0.06, background: "#FFFDF6", overflow: "hidden" }}>{children}</div>
      )}
    </div>
  );
};

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
// wall calendar with a flip between two day numbers
const Calendar: React.FC<{ t: number; x: number; y: number; day: string; prev?: string; flipAt?: number; red?: boolean }> = ({ t, x, y, day, prev, flipAt = -1, red }) => {
  const f = flipAt > 0 ? k(t, flipAt, 0.3, Easing.inOut(Easing.cubic)) : 1;
  const shown = f < 0.5 && prev ? prev : day;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 170, height: 180, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `6px 6px 0 rgba(0,0,0,.25)`, zIndex: 3 }}>
      <div style={{ height: 44, background: red ? RED : GREEN, borderBottom: `6px solid ${INK}`, fontFamily: PX, fontSize: 18, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}>{shown === "1" ? "NOV" : "OKT"}</div>
      <div style={{ fontFamily: PX, fontSize: 70, color: INK, textAlign: "center", marginTop: 26, transform: `scaleY(${Math.abs(1 - 2 * Math.min(1, f))})` }}>{shown}</div>
    </div>
  );
};
// the banking app on the partner's phone
const BankApp: React.FC<{ t: number; a: number; w: number }> = ({ t, a, w }) => {
  const u = k(t, a + 0.15, 0.7, Easing.out(Easing.cubic));
  const amount = Math.round(2840 * u).toLocaleString("de-DE");
  return (
    <div style={{ fontFamily: PX, color: INK, padding: w * 0.07 }}>
      <div style={{ fontSize: w * 0.075, color: "#5A6270" }}>KONTO</div>
      <div style={{ fontSize: w * 0.12, color: GREEN, marginTop: w * 0.06 }}>+{amount} €</div>
      <div style={{ height: w * 0.03, background: "#E0D9C8", margin: `${w * 0.06}px 0` }} />
      <div style={{ fontSize: w * 0.062, lineHeight: 1.8, color: "#3A3F4A" }}>GEHALT<br /><span style={{ color: GREEN }}>EINGANG</span></div>
    </div>
  );
};

// ---------- scenes ----------
// 1 · Hook: "Kein Überblick." He has it. He flips the phone face down. Frame 0 readable.
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const flip = t > A.sehen - 0.1;
  const peek = t > A.hat1 - 0.05 && !flip;
  return (
    <>
      <Plate id="living" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 52, color: "#FFF", background: INK, padding: "22px 26px 14px", boxShadow: `6px 6px 0 rgba(0,0,0,.25)`, transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - 0.2) / 0.2)})` }}>"KEIN ÜBERBLICK."</div>
        <div style={{ fontFamily: PX, fontSize: 62, color: INK, background: GOLD, border: `6px solid ${INK}`, padding: "18px 26px 10px", boxShadow: `6px 6px 0 ${INK}`, transform: `rotate(${t > A.luegt ? -3 : 0}deg) scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - A.luegt) / 0.18)})` }}>ER LÜGT.</div>
      </div>
      <Person t={t} who="du" x={170} y={440} px={12} seed={0.3} />
      <Person t={t} who="partner" x={600} y={430} px={12} flip seed={1} bob={flip ? 0 : 1} />
      <div style={{ position: "absolute", left: 196, top: 750, zIndex: 7 }}><PxBox bg={INK} color="#FFF" size={20} shadow={false}>DU</PxBox></div>
      <div style={{ position: "absolute", left: 600, top: 750, zIndex: 7 }}><PxBox bg={INK} color="#FFF" size={20} shadow={false}>DEIN PARTNER</PxBox></div>
      {/* phone in his hand: screen glows red, a peek at "Er hat ihn", then face down */}
      {t > 0.5 ? (
        <Phone x={560} y={flip ? 600 : 560} w={96} down={flip} rot={flip ? -8 : 6} style={popStyle(t, 0.5, 12, 0.3)}>
          <div style={{ fontFamily: PX, padding: 6 }}>
            <div style={{ fontSize: 9, color: "#5A6270" }}>KONTO</div>
            <div style={{ fontSize: 14, color: RED, marginTop: 8, opacity: Math.floor(t * 4) % 2 || peek ? 1 : 0.4 }}>-???</div>
          </div>
        </Phone>
      ) : null}
      {spark(t, 0.5, 608, 640, 6, 20, 80)}
      {/* his eyes: a quick look, then a black bar */}
      {peek ? <PxBox bg="#FFF" size={20} style={{ left: 760, top: 360, ...popStyle(t, A.hat1 - 0.05, 10, 0.4) }}>ER HAT IHN.</PxBox> : null}
      {flip ? <div style={{ position: "absolute", left: 600 + 12 * 2, top: 430 + 12 * 4.6, width: 12 * 10, height: 30, background: INK, zIndex: 9, ...popStyle(t, A.sehen - 0.1, 8, 0.4) }} /> : null}
      {flip ? <Stamp t={t} a={A.sehen} text="WILL NICHT SEHEN" bg={RED} color="#FFF" size={24} rot={-4} style={{ left: 540, top: 360 }} /> : null}
      {flip ? spark(t, A.sehen - 0.1, 610, 660, 8, 20, 110) : null}
    </>
  );
};

// 2 · Vogel-Strauß-Effekt: the statement arrives, head goes into the sand
const SceneOstrich: React.FC<{ t: number }> = ({ t }) => {
  const down = t > A.einfach - 0.05;
  const fly = k(t, A.schlechte - 0.05, 0.6, Easing.inOut(Easing.cubic));
  const lx = 900 - 330 * fly, ly = 330 + 120 * fly - Math.sin(fly * Math.PI) * 120;
  const title = typed("VOGEL-STRAUSS-EFFEKT", t, A.vogel - 0.1, A.vogel + 0.7);
  return (
    <>
      <Plate id="desert" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 44, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "22px 24px 14px", boxShadow: `0 8px 0 #6B4528`, ...popStyle(t, A.vogel - 0.15, 16, 0.7) }}>
          {title}<span style={{ opacity: 0 }}>{"VOGEL-STRAUSS-EFFEKT".slice(title.length)}</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 300, top: 360, zIndex: 5, transform: down ? `translateY(${Math.floor(k(t, A.einfach - 0.05, 0.15) * 2) * 6}px)` : undefined }}>
        <Sprite rows={down ? OSTRICH_DOWN : OSTRICH_UP} pal={OST_PAL} px={18} />
      </div>
      {/* sand mound over the head */}
      {down ? <div style={{ position: "absolute", left: 300 + 18 * 10, top: 360 + 18 * 18.2, width: 140, height: 40, background: "#F0CF8C", borderTop: `6px solid #D6AC62`, zIndex: 6 }} /> : null}
      {down ? spark(t, A.einfach - 0.05, 300 + 18 * 13, 360 + 18 * 18.5, 10, 20, 110, "#E8C27A") : null}
      {/* the bad news: a red letter flies in */}
      {t > A.schlechte - 0.1 && t < A.einfach + 0.2 ? (
        <div style={{ position: "absolute", left: lx, top: ly, zIndex: 9, opacity: 1 - k(t, A.einfach, 0.2), ...popStyle(t, A.schlechte - 0.1, 10, 0.3) }}>
          <Sprite rows={["KKKKKKKKKK", "KWKWWWWKWK", "KWWKWWKWWK", "KWWWKKWWWK", "KWWWWWRRWK", "KKKKKKKKKK"]} pal={{ K: INK, W: "#FFF", R: RED }} px={12} />
          <div style={{ fontFamily: PX, fontSize: 18, color: "#FFF", background: RED, padding: "8px 10px 4px", marginTop: 8, border: `4px solid ${INK}` }}>KONTOAUSZUG</div>
        </div>
      ) : null}
      {t > A.hin - 0.15 ? <PxBox bg="#FFF" size={26} style={{ left: 560, top: 560, ...popStyle(t, A.hin - 0.15, 12, 0.7) }}>= NICHT HINSCHAUEN</PxBox> : null}
    </>
  );
};

// 3a · The study, real abstract with a highlighter on the key sentence
// crop of Sicherman, Loewenstein, Seppi, Utkus (2016) p.1, 1540x1070; key line at x66 y847 w724 h39
const AB_S = 0.6, AB_X = 78, AB_Y = 150;
const SceneAbstract: React.FC<{ t: number }> = ({ t }) => {
  const hl = k(t, A.anlegern + 0.15, 0.5, Easing.inOut(Easing.cubic));
  const zoom = k(t, A.gemessen - 0.1, 0.6, Easing.inOut(Easing.cubic));
  const hx = AB_X + 66 * AB_S, hy = AB_Y + 847 * AB_S, hw = 724 * AB_S, hh = 39 * AB_S;
  const ox = hx + hw / 2, oy = hy + hh / 2;
  return (
    <>
      <Plate id="desk" />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${(540 - ox) * zoom}px, ${(470 - oy) * zoom}px) scale(${1 + 0.75 * zoom})`, transformOrigin: `${ox}px ${oy}px`, zIndex: 3 }}>
        <div style={{ position: "absolute", left: AB_X - 14, top: AB_Y - 14, width: 1540 * AB_S + 28, height: 1070 * AB_S + 28, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.45)`, ...popStyle(t, A.anlegern - 0.1, 24, 0.85) }} />
        <Img src={staticFile("bank-study-abstract.png")} style={{ position: "absolute", left: AB_X, top: AB_Y, width: 1540 * AB_S, height: 1070 * AB_S, ...popStyle(t, A.anlegern - 0.1, 24, 0.85) }} />
        <div style={{ position: "absolute", left: hx - 6, top: hy - 3, width: (hw + 12) * hl, height: hh + 6, background: GOLD, mixBlendMode: "multiply", opacity: 0.85 }} />
      </div>
      <PxBox bg={INK} color="#FFF" size={18} shadow={false} style={{ left: 40, bottom: 34, ...popStyle(t, A.anlegern, 10, 0.5) }}>REVIEW OF FINANCIAL STUDIES · 2016</PxBox>
      {zoom > 0.5 ? <Stamp t={t} a={A.steigen + 0.1} text="LOGINS -9,5 %" bg={RED} color="#FFF" size={34} rot={-5} style={{ left: 430, top: 650 }} /> : null}
    </>
  );
};

// 3b · Figure 4 of the same paper: prices up = more logins, prices down = fewer
// crop 1100x735; curve low on the left (x 330-480, y ~440), high on the right (x 510-710, y ~390)
const F_S = 0.84, F_X = 78, F_Y = 130;
const fx = (x: number) => F_X + x * F_S, fy = (y: number) => F_Y + y * F_S;
const SceneFigure: React.FC<{ t: number }> = ({ t }) => {
  const up = t > A.schauen0 - 0.1, dn = t > A.fallen - 0.05;
  const box = (x0: number, y0: number, x1: number, y1: number, col: string, a: number) => {
    const u = k(t, a, 0.35, Easing.out(Easing.cubic));
    return <div style={{ position: "absolute", left: fx(x0), top: fy(y0), width: (fx(x1) - fx(x0)) * u, height: fy(y1) - fy(y0), border: `8px solid ${col}`, opacity: u > 0 ? 1 : 0, zIndex: 6 }} />;
  };
  return (
    <>
      <Plate id="desk" />
      <div style={{ position: "absolute", left: F_X - 14, top: F_Y - 14, width: 1100 * F_S + 28, height: 735 * F_S + 28, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.45)`, zIndex: 3, ...popStyle(t, A.schauen0 - 0.15, 20, 0.85) }} />
      <Img src={staticFile("bank-study-fig4.png")} style={{ position: "absolute", left: F_X, top: F_Y, width: 1100 * F_S, height: 735 * F_S, zIndex: 4, ...popStyle(t, A.schauen0 - 0.15, 20, 0.85) }} />
      {up ? box(500, 340, 720, 440, GREEN, A.schauen0) : null}
      {dn ? box(320, 400, 490, 500, RED, A.fallen) : null}
      {up ? (
        <div style={{ position: "absolute", left: fx(730), top: fy(150), zIndex: 9, ...popStyle(t, A.oefter - 0.1, 12, 0.5) }}>
          <Sprite rows={ARROW_UP.rows} pal={ARROW_UP.pal} px={9} />
          <PxBox bg={GREEN} color="#FFF" size={20} style={{ position: "relative", marginTop: 10 }}>KURS HOCH</PxBox>
          <PxBox bg="#FFF" size={20} style={{ position: "relative", marginTop: 12 }}>MEHR LOGINS</PxBox>
        </div>
      ) : null}
      {dn ? (
        <div style={{ position: "absolute", left: fx(20), top: fy(520), zIndex: 9, ...popStyle(t, A.fallen, 12, 0.5) }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Sprite rows={ARROW_DN.rows} pal={ARROW_DN.pal} px={8} />
            <PxBox bg={RED} color="#FFF" size={20} style={{ position: "relative" }}>KURS RUNTER</PxBox>
          </div>
          <PxBox bg="#FFF" size={20} style={{ position: "relative", marginTop: 12 }}>WENIGER LOGINS</PxBox>
        </div>
      ) : null}
      {t > A.seltener ? <Stamp t={t} a={A.seltener} text="-9,5 %" bg={RED} color="#FFF" size={52} rot={-6} style={{ left: fx(560), top: fy(520) }} /> : null}
    </>
  );
};

// 4 · The 28th: "Wie viel haben wir noch?" - "Muss ich mal schauen." He doesn't.
const Scene28: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="living" />
    <Calendar t={t} x={830} y={130} day="28" red />
    <Person t={t} who="du" x={150} y={430} px={12} seed={0.2} a={A.am28 - 0.05} />
    <Person t={t} who="partner" x={620} y={430} px={12} flip seed={1.2} bob={0} a={A.am28 + 0.05} />
    <Phone x={560} y={610} w={90} down rot={-8} />
    <Bubble t={t} a={A.wie - 0.05} text="WIE VIEL HABEN WIR NOCH?" x={60} y={170} size={26} w={520} type={0.55} />
    <Bubble t={t} a={A.muss - 0.05} text="MUSS ICH MAL SCHAUEN." x={430} y={300} tail="r" size={24} type={0.5} />
    {t > A.schaut - 0.05 ? <div style={{ position: "absolute", left: 620 + 12 * 2, top: 430 + 12 * 4.6, width: 12 * 10, height: 30, background: INK, zIndex: 9, ...popStyle(t, A.schaut - 0.05, 8, 0.4) }} /> : null}
    <Stamp t={t} a={A.schaut} text="SCHAUT NICHT" bg={RED} color="#FFF" size={34} rot={-6} style={{ left: 560, top: 520 }} />
  </>
);

// 5 · The 1st: salary rains in, the app opens, "Mallorca?"
const Scene1: React.FC<{ t: number }> = ({ t }) => {
  const open = t > A.oeffnet - 0.05;
  const mall = t > A.mallorca - 0.1;
  return (
    <>
      <Plate id="living" />
      <Calendar t={t} x={830} y={130} day="1" prev="28" flipAt={A.ersten - 0.1} red={t < A.ersten} />
      <Person t={t} who="du" x={120} y={430} px={12} seed={0.2} />
      <Person t={t} who="partner" x={560} y={430} px={12} flip seed={1.2} bob={open ? 1 : 0} />
      {/* coins fall into the phone */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = A.gehalt - 0.1 + i * 0.08;
        const u = (t - a) / 0.55;
        if (u < 0 || u > 1) return null;
        return <div key={i} style={{ position: "absolute", left: 420 + ((i * 37) % 140), top: -60 + u * 640, zIndex: 9 }}><Sprite rows={COIN.rows} pal={COIN.pal} px={7} /></div>;
      })}
      {open ? (
        <Phone x={380} y={300} w={230} style={popStyle(t, A.oeffnet - 0.05, 20, 0.6)}><BankApp t={t} a={A.oeffnet - 0.05} w={210} /></Phone>
      ) : <Phone x={500} y={610} w={90} down rot={-8} />}
      {open ? spark(t, A.oeffnet, 495, 500, 10, 60, 200) : null}
      {mall ? (
        <div style={{ position: "absolute", left: 640, top: 220, zIndex: 10, ...popStyle(t, A.mallorca - 0.1, 16, 0.6) }}>
          <div style={{ position: "relative", width: 380, height: 250, background: "#7FD3FF", border: `6px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}`, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, background: "#F0CF8C" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, height: 26, background: "#3E7CC9" }} />
            <div style={{ position: "absolute", left: 30, bottom: 50 }}><Sprite rows={PALM.rows} pal={PALM.pal} px={11} /></div>
            <div style={{ position: "absolute", left: 160 + ((t - A.mallorca) * 140), top: 30 }}><Sprite rows={PLANE.rows} pal={PLANE.pal} px={8} /></div>
            <div style={{ position: "absolute", right: 16, bottom: 14, fontFamily: PX, fontSize: 30, color: INK }}>MALLORCA?</div>
          </div>
        </div>
      ) : null}
      {mall ? spark(t, A.mallorca, 830, 340, 10, 60, 200) : null}
    </>
  );
};

// 6 · "Ich finde, das ist Strategie." Not looking = still rich on the 28th.
const SceneStrategy: React.FC<{ t: number }> = ({ t }) => {
  const rich = t > A.reich - 0.1;
  return (
    <>
      <Plate id="seminar" />
      <div style={{ position: "absolute", left: 31 * CELL, top: 13 * CELL, width: 118 * CELL, height: 52 * CELL, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, zIndex: 3 }}>
        <div style={{ fontFamily: PX, fontSize: 40, color: GOLD }}>{typed("STRATEGIE:", t, A.strategie - 0.15, A.strategie + 0.3)}</div>
        <div style={{ fontFamily: PX, fontSize: 30, color: "#F5F5F5", lineHeight: 1.7, textAlign: "center" }}>
          {typed("NICHT NACHSCHAUEN", t, A.nachschaut - 0.3, A.nachschaut + 0.3)}<br />
          <span style={{ color: rich ? GOLD : "#F5F5F5" }}>{typed("= AM 28. NOCH REICH", t, A.am28b - 0.2, A.reich + 0.2)}</span>
        </div>
      </div>
      <Person t={t} who="niklas" x={100} y={420} px={12} seed={0.2} a={A.finde - 0.05} />
      <Phone x={760} y={560} w={100} down rot={6} style={popStyle(t, A.nachschaut, 12, 0.4)} />
      {rich ? Array.from({ length: 7 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 690 + i * 44, top: 690 - (i % 3) * 30 - Math.floor(k(t, A.reich - 0.1 + i * 0.05, 0.2) * 3) * 8, zIndex: 9, ...popStyle(t, A.reich - 0.1 + i * 0.05, 10, 0.3) }}><Sprite rows={COIN.rows} pal={COIN.pal} px={6} /></div>
      )) : null}
      {rich ? spark(t, A.reich, 810, 640, 10, 40, 160) : null}
    </>
  );
};

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; tag?: [number, string] };
const SCENES: Scene[] = [
  { from: 0, to: A.heisst - 0.05, El: SceneHook, pill: "Beziehung · Geld", tag: [A.konto, "KONTO: ???"] },
  { from: A.heisst - 0.05, to: A.anlegern - 0.05, El: SceneOstrich, pill: "Psychologie", tag: [A.einfach, "KOPF IN DEN SAND"] },
  { from: A.anlegern - 0.05, to: A.schauen0 - 0.15, El: SceneAbstract, pill: "Die Studie", tag: [A.gemessen, "GEMESSEN"] },
  { from: A.schauen0 - 0.15, to: A.am28 - 0.05, El: SceneFigure, pill: "Die Studie · Figure 4", tag: [A.oefter, "100.000 KONTEN"] },
  { from: A.am28 - 0.05, to: A.ersten - 0.1, El: Scene28, pill: "Am 28.", tag: [A.am28 + 0.1, "KONTO LEER?"] },
  { from: A.ersten - 0.1, to: A.finde - 0.05, El: Scene1, pill: "Am 1.", tag: [A.gehalt, "GEHALT DA"] },
  { from: A.finde - 0.05, to: A.punch - 0.05, El: SceneStrategy, pill: "Meine Meinung", tag: [A.strategie, "STRATEGIE"] },
  { from: A.punch - 0.05, to: 999 },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["partner", "überblick", "lügt", "sehen", "vogelstraußeffekt", "schlechte", "hin", "gemessen", "öfter", "seltener", "achtundzwanzigsten", "noch", "schauen", "nicht", "gehalt", "app", "mallorca", "strategie", "reich", "excel", "ersten", "gelöscht", "rot"]);
const SHOW: Record<string, string> = { achtundzwanzigsten: "28.", ersten: "1." };
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

const ORDER = Array.from({ length: 12 * 11 }, (_, i) => ((i * 53) % 131) / 131);
const Dissolve: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const u = (t - a) / 0.24;
  if (a <= 0 || u < 0 || u > 1) return null;
  return <>{ORDER.map((o, i) => (o > u ? <div key={i} style={{ position: "absolute", left: (i % 12) * 90, top: Math.floor(i / 12) * 90, width: 90, height: 90, background: INK, zIndex: 30 }} /> : null))}</>;
};

// avatar framing in the split (from facefocus.txt)
const SPLIT_SRC_TOP = 860, SPLIT_SCALE = 1.0, FOCUS_X = 0.442;

export const BankPixel: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-gpts-bank-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
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
export const BP_FPS = FPS;
