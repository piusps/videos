import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-werbung/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "Werbung wirkt nicht" (Effekt der dritten Person, 2026-10-26) im Pixel-Niklas-Look wie FitnessPixel.
// Beleg: Reid & Soley, 222 Befragte, Hälfte "Werbung täuscht die Leute" vs. Hälfte "Werbung täuscht mich".
// Pointe ab "Gestern habe ich auf meine eigene geklickt. Zweimal." ruhig auf dem Gesicht.

const W = 1080, H = 1920, PH = 960;
const GOLD = "#FFC83D", INK = "#141414", RED = "#D8463A", GREEN = "#4C9A5A", BLUE = "#3E7CC9";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
const END = CAPS[CAPS.length - 1].endMs / 1000;
export const WB_FRAMES = Math.round((END + 0.9) * 25);
export const A = {
  kumpel0: at("kumpel", 0), sagt: at("sagt"), euch: at("euch"), jacke0: at("jacke", 0), anzeige: at("anzeige"),
  forscher: at("forscher"), n222: at("zweihundertzweiundzwanzig"), haelfte: at("hälfte"), leute1: at("leute", 1), andere: at("andere"), selbst0: at("selbst", 0), ergebnis: at("ergebnis"), leute2: at("leute", 2), selbst1: at("selbst", 1),
  heisst: at("heißt"), effekt: at("effekt"), gefuehlt: at("gefühlt"), anderen: at("anderen"),
  kumpel1: at("kumpel", 1), jacke1: at("jacke", 1), schuhe: at("laufschuhe"), kissen: at("nackenkissen"), alles: at("alles"), zufall: at("zufall"),
  finde: at("finde"), kunde: at("kunde"), wehrt: at("wehrt"),
  schalte: at("schalte"), gebaut: at("gebaut"), gestern: at("gestern"),
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
// gym: concrete wall, mirror strip, dumbbell rack, rubber floor
const drawGym = (dark = false) => {
  const p = painter(); const { R, P, dither } = p;
  const wall = dark ? "#2A2F38" : "#D8DCE2", wall2 = dark ? "#323844" : "#CDD2D9";
  R(0, 0, 180, 120, wall); for (let y = 4; y < 120; y += 12) for (let x = (y / 12) % 2 ? 0 : 12; x < 180; x += 24) P(x, y, wall2);
  R(0, 0, 180, 6, dark ? "#1E2229" : GOLD); R(0, 6, 180, 2, dark ? "#15181D" : "#D9A520");
  // mirror strip
  R(10, 22, 160, 50, "#9FB6C9"); dither(10, 22, 160, 2, "#C6D6E3", "#9FB6C9"); for (let x = 20; x < 170; x += 30) R(x, 26, 6, 40, "#B9CCDB");
  R(10, 72, 160, 2, "#7E8A96");
  // dumbbell rack
  R(8, 96, 164, 3, "#3A3F4A"); R(8, 104, 164, 3, "#3A3F4A"); R(10, 99, 2, 21, "#3A3F4A"); R(168, 99, 2, 21, "#3A3F4A");
  for (let x = 16; x < 166; x += 12) { R(x, 92, 3, 5, "#1E2229"); R(x + 7, 92, 3, 5, "#1E2229"); R(x + 3, 94, 4, 1, "#9AA3AD"); R(x, 100, 3, 4, "#1E2229"); R(x + 7, 100, 3, 4, "#1E2229"); R(x + 3, 101, 4, 1, "#9AA3AD"); }
  R(0, 118, 180, 2, "#1E2229");
  // rubber floor
  R(0, 120, 180, 40, "#3A3F4A"); for (let y = 122; y < 160; y += 3) for (let x = (y % 2) * 2; x < 180; x += 5) P(x, y, "#454B57");
  for (let x = 0; x < 180; x += 45) R(x, 120, 1, 40, "#2E333C");
  return p.ops;
};
const drawRoom = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 118, "#E9DFF0"); for (let y = 6; y < 118; y += 10) for (let x = (y / 10) % 2 ? 0 : 10; x < 180; x += 20) P(x, y, "#DCCFE6");
  R(124, 16, 40, 30, "#8A5A30"); R(126, 18, 36, 26, "#9FC9E8"); R(143, 18, 2, 26, "#8A5A30");
  R(0, 118, 180, 2, "#8A5A34");
  for (let y = 120; y < 160; y += 6) { R(0, y, 180, 6, "#C8955E"); R(0, y, 180, 1, "#A87642"); }
  return p.ops;
};
// street: sky, houses, a big billboard
const drawStreet = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 120, "#9FD3F0"); for (let x = 6; x < 180; x += 40) { R(x, 14, 16, 4, "#FFFFFF"); R(x + 4, 11, 8, 3, "#FFFFFF"); }
  const houses: [number, number, string][] = [[0, 50, "#C9785A"], [30, 36, "#E0B45A"], [62, 58, "#8FA5B8"], [132, 44, "#C98FA0"], [156, 30, "#7FB08A"]];
  for (const [x, h, c] of houses) { R(x, 120 - h, 26, h, c); for (let y = 124 - h; y < 112; y += 10) for (let i = x + 4; i < x + 22; i += 8) R(i, y, 4, 5, "#FFF3C4"); }
  R(92, 24, 4, 96, "#3A3F4A");
  R(66, 22, 56, 36, INK); R(68, 24, 52, 32, "#FFFDF6");
  R(0, 118, 180, 2, "#5A6270");
  R(0, 120, 180, 40, "#8A8F98"); for (let x = 0; x < 180; x += 12) R(x, 138, 6, 2, "#C9CDD3");
  for (let y = 122; y < 160; y += 4) for (let x = (y % 8) ? 0 : 3; x < 180; x += 7) P(x, y, "#7E838C");
  return p.ops;
};
const PLATES = { gym: drawGym(), gymDark: drawGym(true), room: drawRoom(), street: drawStreet() };
const Plate = React.memo<{ id: keyof typeof PLATES }>(({ id }) => (
  <svg width={W + 48} height={PH + 48} viewBox="0 0 180 160" preserveAspectRatio="none" shapeRendering="crispEdges" style={{ position: "absolute", left: -24, top: -24 }}>
    {PLATES[id].map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w + 0.02} height={h + 0.02} fill={c} />)}
  </svg>
));
const PLATE_BG = { gym: "#D8DCE2", gymDark: "#2A2F38", room: "#E9DFF0", street: "#9FD3F0" };

// ---------- people (Pixel-Niklas rows, palette-swapped) ----------
const NK = [
  "....hhhhhh....", "...hHHLLHHh...", "..hHHHHLLHHh..", "..HHhSSSSHHH..", "..HSSSSSSSSH..", "..SSESSSSESS..", "..sSSSSSSSSs..", "..SSSSssSSSS..",
  "..sSbbbbbbSs..", "...sbbSSbbs...", "....sSSSSs....", "..nNNWWWWNNn..", ".nNNNNWZWNNNn.", ".NNNNNNZNNNNN.", ".NNnNNNZNNNnNN", ".NN.NNNZNNN.NN",
  ".NN.NNNZNNN.NF", ".SS.NNNNNNN.Ff", "....NNNNNNN.Ff", "....PPPPPPP...", "....PPP.PPP...", "....PPP.PPP...", "....PPP.PPP...", "....PPP.PPP...", "...BBBB.BBBB..",
];
const SK = { S: "#F2C6A4", s: "#D9A27F" };
const PAL = {
  niklas: { h: "#8A5A30", H: "#B07A45", L: "#C99A63", ...SK, E: "#2B2B2B", b: "#B58A62", N: "#1E2433", n: "#2E3650", W: "#F5F5F5", Z: "#C9C9C9", P: "#3A3F4A", B: "#151515", F: "#111111", f: "#7FD3FF" },
  kumpel: { h: "#2B1E16", H: "#3D2B1F", L: "#5A4030", ...SK, E: "#2B2B2B", b: "#9A6A48", N: BLUE, n: "#2F63A6", W: "#F5F5F5", Z: "#2F63A6", P: "#3A3F4A", B: "#151515", F: SK.S, f: SK.S },
  sport: { h: "#2B1E16", H: "#3D2B1F", L: "#5A4030", ...SK, E: "#2B2B2B", b: "#9A6A48", N: RED, n: "#A8322B", W: "#F5F5F5", Z: GOLD, P: "#1E2433", B: "#F5F5F5", F: SK.S, f: SK.S },
  prof: { h: "#9AA3AD", H: "#C9D1DA", L: "#E4E8EC", ...SK, E: "#2B2B2B", b: SK.S, N: "#F4F1EA", n: "#D9D4C8", W: "#7FD3FF", Z: "#3E7CC9", P: "#3A3F4A", B: "#151515", F: SK.S, f: SK.S },
};
type Who = keyof typeof PAL;
const Person: React.FC<{ t: number; who: Who; x: number; y: number; px?: number; flip?: boolean; seed?: number; a?: number; bob?: number; speed?: number; style?: React.CSSProperties }> = ({ t, who, x, y, px = 12, flip, seed = 0, a = -1, bob = 1, speed = 3.2, style }) => {
  const st = a >= 0 ? popStyle(t, a, 30, 0.4) : {};
  const hop = Math.floor(t * speed + seed) % 2 ? -px * bob : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 4, ...st, ...style }}>
      <div style={{ position: "absolute", left: px * 3, top: NK.length * px - px * 0.6, width: px * 9, height: px * 1.2, background: "rgba(0,0,0,0.28)" }} />
      <div style={{ transform: `translateY(${hop}px) scaleX(${flip ? -1 : 1})` }}><Sprite rows={NK} pal={PAL[who]} px={px} /></div>
    </div>
  );
};

// ---------- props ----------
const JACKET = { rows: ["..KK....KK..", ".KRRK..KRRK.", "KRRRRKKRRRRK", "KRRRRYYRRRRK", "KRRRRYYRRRRK", "KRRRRYYRRRRK", "KRRRRYYRRRRK", "KRRKRYYRKRRK", "KRRKRRRRKRRK", "KKKKKKKKKKKK"], pal: { K: INK, R: RED, Y: "#C9D1DA" } };
const SHOES = { rows: ["....KKKK......", "...KWWWWK.....", "..KWBBBWWKKK..", ".KWWWWWWWWWWK.", "KWWWWWWWWWWWWK", "KKKKKKKKKKKKKK"], pal: { K: INK, W: "#F5F5F5", B: BLUE } };
const PILLOW = { rows: ["..KKKK..KKKK..", ".KGGGGKKGGGGK.", "KGGGGGGGGGGGGK", "KGGGGKKKKGGGGK", ".KGGK....KGGK.", "..KK......KK.."], pal: { K: INK, G: "#8FA5B8" } };
const ARROW = { rows: ["....K...", "....KK..", "KKKKKKK.", "KKKKKKKK", "KKKKKKK.", "....KK..", "....K..."], pal: { K: RED } };
const SHIELD = { rows: ["KKKKKKKKKK", "KGGGGGGGGK", "KGGGWWGGGK", "KGGGWWGGGK", ".KGGGGGGK.", "..KGGGGK..", "...KGGK...", "....KK...."], pal: { K: INK, G: GOLD, W: "#FFF6D0" } };
const COIN = { rows: [".YY.", "YyYY", "YYyY", ".YY."], pal: { Y: GOLD, y: "#FFF3B0" } };

// ---------- pixel UI pieces ----------
const PxBox: React.FC<{ bg?: string; color?: string; size?: number; border?: string; shadow?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({ bg = GOLD, color = INK, size = 28, border = INK, shadow = true, style, children }) => (
  <div style={{ position: "absolute", fontFamily: PX, fontSize: size, lineHeight: 1.25, color, background: bg, border: `${Math.max(4, Math.round(size / 6))}px solid ${border}`, padding: `${size * 0.55}px ${size * 0.6}px ${size * 0.4}px`, boxShadow: shadow ? `6px 6px 0 ${INK}` : undefined, whiteSpace: "nowrap", zIndex: 8, ...style }}>{children}</div>
);
const Bubble: React.FC<{ t: number; a: number; text: string; x: number; y: number; tail?: "l" | "r"; size?: number; type?: number; bg?: string }> = ({ t, a, text, x, y, tail = "l", size = 26, type = 0.6, bg = "#FFFFFF" }) => {
  if (t < a - 0.05) return null;
  const s = type > 0 ? typed(text, t, a, a + type) : text;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 9, ...popStyle(t, a - 0.05, 14, 0.6) }}>
      <div style={{ position: "relative", fontFamily: PX, fontSize: size, lineHeight: 1.45, color: INK, background: bg, border: `6px solid ${INK}`, padding: `${size * 0.7}px ${size * 0.75}px ${size * 0.5}px`, boxShadow: `6px 6px 0 ${INK}`, whiteSpace: "nowrap" }}>
        <span>{s}</span><span style={{ opacity: 0 }}>{text.slice(s.length)}</span>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", top: "100%", [tail === "l" ? "left" : "right"]: 40 + i * 6, marginTop: i * 12, width: 30 - i * 10, height: 12, background: INK }} />
        ))}
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
// receipt / report paper with lines that pop in one by one
const Paper: React.FC<{ t: number; a: number; x: number; y: number; w: number; title: string; lines: [number, string, string, boolean?][]; size?: number }> = ({ t, a, x, y, w, title, lines, size = 22 }) => (t < a - 0.05 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: 7, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "22px 24px 18px", ...popStyle(t, a - 0.05, 20, 0.6) }}>
    <div style={{ fontFamily: PX, fontSize: size * 0.8, color: "#FFF", background: INK, padding: "12px 12px 8px", marginBottom: 18 }}>{title}</div>
    {lines.map(([la, l, r, hot], i) => (t < la - 0.05 ? <div key={i} style={{ height: size * 1.9 }} /> : (
      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: PX, fontSize: size, color: hot ? "#FFF" : INK, background: hot ? RED : "transparent", padding: hot ? "12px 10px 8px" : "6px 0", marginTop: hot ? 8 : 0, borderTop: hot ? "none" : "3px dashed #C9C2B0", ...popStyle(t, la - 0.05, 8, 0.6), transform: hot ? `scale(${1 + 0.08 * Math.max(0, 1 - Math.abs(t - la - 0.1) / 0.2)})` : undefined }}>
        <span>{l}</span><span>{r}</span>
      </div>
    )))}
  </div>
));

// ad post card (flat, no platform logo): "Anzeige" label, product, button
const AdCard: React.FC<{ t: number; a: number; x: number; y: number; item: { rows: string[]; pal: Record<string, string> }; label: string; w?: number; px?: number }> = ({ t, a, x, y, item, label, w = 300, px = 10 }) => (t < a - 0.05 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: 8, background: "#FFFFFF", border: `5px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}`, ...popStyle(t, a - 0.05, 14, 0.6) }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px 6px", fontFamily: PX, fontSize: 13, color: "#77746C" }}><span>ANZEIGE</span><span>···</span></div>
    <div style={{ display: "flex", justifyContent: "center", padding: "14px 0", background: "#F1EEE6" }}><Sprite rows={item.rows} pal={item.pal} px={px} /></div>
    <div style={{ margin: 10, background: BLUE, color: "#FFF", fontFamily: PX, fontSize: 14, padding: "10px 8px 6px", textAlign: "center" }}>{label}</div>
  </div>
));

// ---------- scenes ----------
// 1 · Hook: "Werbung wirkt bei mir nicht." readable on frame 0; his jacket is from an ad
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const hot = t > A.jacke0 - 0.05;
  return (
    <>
      <Plate id="street" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 104, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 40, color: "#FFF", background: INK, padding: "22px 26px 14px", boxShadow: `6px 6px 0 rgba(0,0,0,.35)`, transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - 0.2) / 0.2)})` }}>„WERBUNG WIRKT</div>
        <div style={{ fontFamily: PX, fontSize: 36, color: INK, background: GOLD, border: `6px solid ${INK}`, padding: "18px 22px 10px", boxShadow: `6px 6px 0 ${INK}`, transform: `rotate(${t > A.euch ? -3 : 0}deg) scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - A.euch) / 0.18)})` }}>BEI MIR NICHT.“</div>
      </div>
      <div style={{ position: "absolute", left: 408, top: 268, width: 312, height: 66, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <Sprite rows={JACKET.rows} pal={JACKET.pal} px={5} />
        <div style={{ fontFamily: PX, fontSize: 16, color: "#FFF", background: RED, padding: "8px 10px 4px" }}>-50%</div>
      </div>
      <Person t={t} who="kumpel" x={150} y={500} px={12} a={0.12} style={{ filter: hot ? "none" : undefined }} />
      {hot ? <div style={{ position: "absolute", left: 150 + 12 * 1 - 10, top: 500 + 12 * 11 - 10, width: 12 * 13 + 20, height: 12 * 8 + 20, border: `7px solid ${RED}`, opacity: Math.floor((t - A.jacke0) * 6) % 2 && t - A.jacke0 < 0.7 ? 0.3 : 1, zIndex: 6 }} /> : null}
      <Bubble t={t} a={A.euch - 0.3} text="NUR BEI EUCH." x={360} y={430} size={22} type={0.3} />
      <AdCard t={t} a={A.anzeige - 0.25} x={680} y={420} item={JACKET} label="JETZT KAUFEN" />
      {t > A.anzeige ? spark(t, A.anzeige - 0.1, 830, 600, 10, 50, 170) : null}
    </>
  );
};

// 2 · The study: 222 people, two halves, two questions, result bars
const Half: React.FC<{ t: number; a: number; x: number; col: keyof typeof PAL }> = ({ t, a, x, col }) => (
  <>{Array.from({ length: 10 }, (_, i) => {
    const d = a + ((i * 3) % 10) * 0.03;
    return t < d ? null : <div key={i} style={{ position: "absolute", left: x + (i % 5) * 84, top: 170 + Math.floor(i / 5) * 110, zIndex: 4, ...popStyle(t, d, 10, 0.4) }}><Sprite rows={NK} pal={PAL[col]} px={4} /></div>;
  })}</>
);
const ResBar: React.FC<{ t: number; a: number; x: number; v: number; col: string; label: string }> = ({ t, a, x, v, col, label }) => (t < a - 0.05 ? null : (
  <div style={{ position: "absolute", left: x, top: 560, width: 380, zIndex: 8, ...popStyle(t, a - 0.05, 10, 0.5) }}>
    <div style={{ height: 50, background: "#FFFDF6", border: `5px solid ${INK}` }}><div style={{ height: "100%", width: `${v * Math.min(1, pop(t, a, 0.4))}%`, background: col }} /></div>
    <div style={{ fontFamily: PX, fontSize: 18, color: INK, marginTop: 12 }}>{label}</div>
  </div>
));
const SceneStudy: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="gym" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 96, bottom: 0, background: "#E9ECF0", zIndex: 1 }} />
    {t > A.n222 - 0.05 ? <PxBox bg={INK} color="#FFF" size={22} style={{ left: 380, top: 110, ...popStyle(t, A.n222 - 0.05, 10, 0.5) }}>222 LEUTE</PxBox> : null}
    <Half t={t} a={A.forscher - 0.05} x={60} col="kumpel" />
    <Half t={t} a={A.forscher + 0.1} x={600} col="sport" />
    {t > A.haelfte - 0.05 ? <PxBox bg="#FFF" size={16} style={{ left: 50, top: 420, ...popStyle(t, A.haelfte - 0.05, 10, 0.5) }}>TÄUSCHT SIE DIE LEUTE?</PxBox> : null}
    {t > A.andere - 0.05 ? <PxBox bg="#FFF" size={16} style={{ left: 600, top: 420, ...popStyle(t, A.andere - 0.05, 10, 0.5) }}>TÄUSCHT SIE DICH?</PxBox> : null}
    <ResBar t={t} a={A.leute2} x={50} v={85} col={RED} label="DIE LEUTE: JA" />
    <ResBar t={t} a={A.selbst1} x={600} v={35} col={GREEN} label="ICH: WENIGER" />
    {t > A.ergebnis - 0.05 ? <Stamp t={t} a={A.ergebnis - 0.05} text="ERGEBNIS" bg={GOLD} size={26} rot={-5} style={{ left: 400, top: 470 }} /> : null}
    <PxBox bg={INK} color="#FFF" size={16} shadow={false} style={{ left: 40, bottom: 84, ...popStyle(t, A.forscher, 10, 0.5) }}>REID & SOLEY · USA</PxBox>
  </>
);

// 3 · The term: "Effekt der dritten Person" typed; ads bounce off "ICH" onto the others
const SceneTerm: React.FC<{ t: number }> = ({ t }) => {
  const l1 = typed("EFFEKT DER", t, A.effekt - 0.15, A.effekt + 0.2);
  const l2 = typed("DRITTEN PERSON", t, A.effekt + 0.15, A.effekt + 0.7);
  return (
    <>
      <Plate id="gymDark" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 50, lineHeight: 1.3, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "24px 30px 14px", boxShadow: `0 8px 0 #6B4528`, textAlign: "center", ...popStyle(t, A.heisst, 16, 0.7) }}>
          {l1}<span style={{ opacity: 0 }}>{"EFFEKT DER".slice(l1.length)}</span><br />{l2}<span style={{ opacity: 0 }}>{"DRITTEN PERSON".slice(l2.length)}</span>
        </div>
      </div>
      {t > A.gefuehlt - 0.1 ? (
        <>
          <Person t={t} who="niklas" x={450} y={470} px={10} a={A.gefuehlt - 0.1} bob={0} />
          <div style={{ position: "absolute", left: 470, top: 420, zIndex: 7, ...popStyle(t, A.gefuehlt, 10, 0.5) }}><Sprite rows={SHIELD.rows} pal={SHIELD.pal} px={10} /></div>
          <PxBox bg={GOLD} size={18} style={{ left: 480, top: 360, ...popStyle(t, A.gefuehlt, 10, 0.5) }}>ICH</PxBox>
          <Person t={t} who="kumpel" x={90} y={500} px={8} a={A.anderen - 0.1} />
          <Person t={t} who="sport" x={850} y={500} px={8} flip a={A.anderen - 0.05} />
          {t > A.anderen - 0.05 ? <PxBox bg="#FFF" size={16} style={{ left: 60, top: 440, ...popStyle(t, A.anderen, 10, 0.5) }}>DIE ANDEREN</PxBox> : null}
          {[0, 1, 2, 3].map((i) => {
            const u = Math.max(0, Math.min(1, (t - A.gefuehlt - 0.2 - i * 0.25) / 0.6));
            if (u <= 0 || u >= 1) return null;
            const left = i % 2 === 0;
            const hit = 0.45;
            const x = u < hit ? 540 + (left ? -1 : 1) * 40 : 540 + (left ? -1 : 1) * (40 + (u - hit) / (1 - hit) * 380);
            const y = u < hit ? 330 + u / hit * 120 : 450 + (u - hit) / (1 - hit) * 120;
            return <div key={i} style={{ position: "absolute", left: x - 32, top: y, zIndex: 8, transform: `scaleX(${left ? -1 : 1}) rotate(${u < hit ? 60 : 20}deg)` }}><Sprite rows={ARROW.rows} pal={ARROW.pal} px={8} /></div>;
          })}
        </>
      ) : null}
    </>
  );
};

// 4 · His stuff: jacket, running shoes, neck pillow, all from ads; he calls it luck
const SceneStuff: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="room" />
    <Person t={t} who="kumpel" x={80} y={340} px={12} a={A.kumpel1 - 0.1} />
    <AdCard t={t} a={A.jacke1} x={330} y={150} item={JACKET} label="ANZEIGE" w={220} px={8} />
    <AdCard t={t} a={A.schuhe} x={570} y={150} item={SHOES} label="ANZEIGE" w={220} px={7} />
    <AdCard t={t} a={A.kissen} x={810} y={150} item={PILLOW} label="ANZEIGE" w={220} px={7} />
    {t > A.alles - 0.05 ? <Stamp t={t} a={A.alles - 0.05} text="ALLES AUS ANZEIGEN" bg={RED} color="#FFF" size={26} rot={-4} style={{ left: 380, top: 470 }} /> : null}
    <Bubble t={t} a={A.zufall - 0.1} text="ZUFALL." x={300} y={600} size={26} type={0.25} />
  </>
);

// 5 · "Bester Kunde, den es gibt. Er wehrt sich nicht mal." coins flow from him into the shop
const SceneRule: React.FC<{ t: number }> = ({ t }) => {
  const flow = t > A.wehrt - 0.1;
  return (
    <>
      <Plate id="street" />
      <div style={{ position: "absolute", left: 408, top: 144, width: 312, height: 192, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 13, color: "#77746C" }}>ANZEIGE</div>
        <Sprite rows={JACKET.rows} pal={JACKET.pal} px={8} />
        <div style={{ fontFamily: PX, fontSize: 18, color: "#FFF", background: RED, padding: "8px 10px 4px" }}>NUR HEUTE</div>
      </div>
      <Person t={t} who="kumpel" x={120} y={420} px={12} seed={0.2} bob={flow ? 0 : 1} />
      {t > A.kunde - 0.1 ? <Stamp t={t} a={A.kunde - 0.1} text="BESTER KUNDE" bg={GOLD} size={30} rot={-5} style={{ left: 90, top: 300 }} /> : null}
      {flow ? Array.from({ length: 8 }, (_, i) => {
        const u = Math.max(0, Math.min(1, (t - A.wehrt - i * 0.12) / 0.6));
        return u <= 0 || u >= 1 ? null : <div key={i} style={{ position: "absolute", left: 300 + u * 420, top: 560 - Math.sin(u * Math.PI) * 200, zIndex: 9 }}><Sprite rows={COIN.rows} pal={COIN.pal} px={9} /></div>;
      }) : null}
      {flow ? <PxBox bg={GREEN} color="#FFF" size={20} style={{ left: 700, top: 640, ...popStyle(t, A.wehrt, 10, 0.5) }}>KEINE GEGENWEHR</PxBox> : null}
    </>
  );
};

// 6 · "Ich schalte selbst jeden Tag Anzeigen": Niklas with his ad dashboard
const SceneAds: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="gym" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 96, bottom: 0, background: "#E9ECF0", zIndex: 1 }} />
    <Person t={t} who="niklas" x={110} y={360} px={12} a={A.schalte - 0.1} />
    <Paper t={t} a={A.schalte} x={430} y={170} w={590} title="MEINE ANZEIGEN" lines={[[A.schalte + 0.25, "ANZEIGE 1", "AKTIV"], [A.schalte + 0.5, "ANZEIGE 2", "AKTIV"], [A.gebaut - 0.1, "BAUPLAN", "KENN ICH", true]]} size={22} />
  </>
);

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; tag?: [number, string]; bg?: string };
const SCENES: Scene[] = [
  { from: 0, to: A.forscher - 0.15, El: SceneHook, pill: "Werbung", tag: [A.anzeige, "AUS EINER ANZEIGE"], bg: PLATE_BG.street },
  { from: A.forscher - 0.15, to: A.heisst - 0.05, El: SceneStudy, pill: "Echte Studie", bg: "#E9ECF0" },
  { from: A.heisst - 0.05, to: A.kumpel1 - 0.1, El: SceneTerm, pill: "Psychologie", bg: PLATE_BG.gymDark },
  { from: A.kumpel1 - 0.1, to: A.finde - 0.1, El: SceneStuff, pill: "Dein Kumpel", bg: PLATE_BG.room },
  { from: A.finde - 0.1, to: A.schalte - 0.15, El: SceneRule, pill: "Meine Meinung", bg: PLATE_BG.street },
  { from: A.schalte - 0.15, to: A.gestern - 0.05, El: SceneAds, pill: "Ich", bg: "#E9ECF0" },
  { from: A.gestern - 0.05, to: 999 },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["kumpel", "werbung", "euch", "jacke", "anzeige", "anzeigen", "zweihundertzweiundzwanzig", "hälfte", "täuscht", "ergebnis", "weniger", "effekt", "dritten", "anderen", "laufschuhe", "nackenkissen", "zufall", "kunde", "wehrt", "gebaut", "eigene", "zweimal"]);
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
// on-screen spelling: numbers as digits
const SHOW: Record<string, string> = { zweihundertzweiundzwanzig: "222" };
const show = (w: string) => { const n = norm(w); return SHOW[n] ?? w.replace(/[.,!?:]/g, ""); };
type Chunk = { start: number; end: number; words: string[] };
const makeChunks = (caps: Cap[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Cap[] = [];
  const flush = () => { if (cur.length) out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => show(c.text)) }); cur = []; };
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
  const keyIdx = c.words.findIndex((w) => KEY.has(norm(w)) || /^[\d.]+$/.test(w) || /^\d/.test(w));
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
const SPLIT_SRC_TOP = 860, SPLIT_SCALE = 1.0, FOCUS_X = 0.448;

export const WerbungPixel: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-gpts-werbung-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {El ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: sc.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }}>
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
