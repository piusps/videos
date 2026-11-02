import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-popcorn/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "Popcorn" (Decoy Effekt, 2026-10-26) im Pixel-Niklas-Look wie FastPixel:
// oben 960 px Pixelwelt, unten der Avatar, Space-Mono-Untertitel auf der Kante.
// Beispiel (v2, Pius 26.10.): Williams-Sonoma-Brotbackautomat ~275 $, daneben ein größerer für 429 $ → der kleine verkauft sich fast doppelt so oft (Simonson, Stanford).
// Pointe ab "Das Kino auch." ruhig auf dem Gesicht.

const W = 1080, H = 1920, PH = 960;
const GOLD = "#FFC83D", INK = "#141414", RED = "#D8463A", GREEN = "#4C9A5A", BLUE = "#3E7CC9";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
// Ende nach "Das Kino auch." (Superkind-Schluss raus, Pius 26.10.), danach 0,8 s stumme Ruhe aus dem Hold am Ende der Quelle
const END = CAPS.filter((c) => c.text.toLowerCase().startsWith("auch")).slice(-1)[0].endMs / 1000;
const HOLD = 0.8, SRC_HOLD_FROM = 38.0;
export const PC_FRAMES = Math.round((END + HOLD) * 25);
export const A = {
  kino: at("kino"), groesse: at("größe"), keiner: at("keiner"), kaufen: at("kaufen"), kumpel0: at("kumpel", 0), grosse: at("große"), lohnt: at("lohnt"),
  laden: at("küchenladen"), brot: at("brotbackautomaten"), n300: at("dreihundert"), kaum: at("kaum"), groesser: at("größeres"), n400: at("vierhundert"),
  niemand: at("niemand"), alte: at("alte"), plotz: at("plötzlich"), doppelt: at("doppelt"),
  heisst: at("heißt"), decoy: at("decoy"), angebot: at("angebot"), guenstig: at("günstig"),
  klein: at("klein"), vier: at("vier"), mittel: at("mittel"), sieben: at("sieben"), gross: at("groß"), acht: at("acht"),
  kumpel1: at("kumpel", 1), cent: at("cent"), logisch: at("logisch"),
  finde: at("finde"), recht: at("recht"), kino1: at("kino", 1),
  das: CAPS.filter((c) => c.text.toLowerCase().startsWith("das") && c.endMs / 1000 <= END).slice(-1)[0].startMs / 1000,
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
const woodFloor = ({ R }: Pt, y0: number, base = "#C8955E", line = "#A87642", hi = "#D9AA72") => {
  R(0, y0, 180, 160 - y0, base);
  for (let y = y0; y < 160; y += 6) { R(0, y, 180, 1, line); for (let x = (y / 6) % 2 ? 8 : 26; x < 180; x += 36) R(x, y + 1, 1, 5, line); R(0, y + 1, 180, 1, hi); }
};
const plant = ({ R, P }: Pt, x: number, y: number) => { R(x, y + 10, 6, 6, "#B65D35"); R(x - 1, y + 2, 8, 8, "#4C9A5A"); R(x, y, 6, 3, "#5DB06C"); P(x + 1, y + 3, "#7FC98B"); };
const brick = ({ R }: Pt, y0: number, y1: number, c: string) => { for (let y = y0; y < y1; y += 4) for (let x = 0; x < 180; x += 9) R(x + ((y / 4) % 2 ? 4 : 0), y, 3, 1, c); };

// cinema foyer: dark wall, red curtains, glowing screen, candy counter
const drawCinema = () => {
  const p = painter(); const { R, dither } = p;
  R(0, 0, 180, 160, "#2B1E2E");
  dither(0, 0, 180, 4, "#352638", "#2B1E2E");
  // screen with soft glow
  R(36, 10, 108, 52, "#4A3A55"); R(40, 14, 100, 44, "#F5EFD8"); dither(40, 14, 100, 2, "#FFFBEA", "#F5EFD8");
  // curtains
  for (const x0 of [0, 150]) { R(x0, 0, 30, 104, "#A8322B"); for (let x = x0 + 2; x < x0 + 30; x += 5) R(x, 0, 2, 104, "#C9473B"); R(x0, 0, 30, 4, "#7E2520"); }
  // marquee lights
  for (let x = 38; x < 144; x += 6) R(x, 6, 2, 2, GOLD);
  // counter
  R(0, 104, 180, 4, "#7E2520"); R(0, 108, 180, 52, "#C9473B");
  for (let y = 112; y < 160; y += 8) R(0, y, 180, 1, "#A8322B");
  R(0, 104, 180, 2, "#E9C46A");
  return p.ops;
};
// kitchen shop: warm wall, two wooden shelves, tiled floor
const drawShop = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 120, "#F1E7D2"); for (let y = 6; y < 120; y += 10) for (let x = (y / 10) % 2 ? 0 : 10; x < 180; x += 20) P(x, y, "#E4D7BE");
  R(0, 0, 180, 6, "#3E7CC9"); R(0, 6, 180, 2, "#2F63A6");
  for (const y of [40, 72]) { R(4, y, 172, 4, "#A87642"); R(4, y + 4, 172, 2, "#7E5530"); }
  for (let x = 8; x < 176; x += 14) { R(x, 30, 8, 10, x % 28 ? "#D8463A" : "#4C9A5A"); R(x + 2, 64, 6, 8, x % 28 ? "#FFC83D" : "#C9D1DA"); }
  R(0, 118, 180, 2, "#8A5A34");
  for (let y = 120; y < 160; y += 8) for (let x = (y / 8) % 2 ? 0 : 8; x < 180; x += 16) { R(x, y, 8, 8, "#D9CDB6"); R(x + 8, y, 8, 8, "#CFC2A9"); }
  return p.ops;
};
const PLATES = { cinema: drawCinema(), shop: drawShop() };
const Plate = React.memo<{ id: keyof typeof PLATES }>(({ id }) => (
  <svg width={W + 48} height={PH + 48} viewBox="0 0 180 160" preserveAspectRatio="none" shapeRendering="crispEdges" style={{ position: "absolute", left: -24, top: -24 }}>
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
  kumpel: { h: "#2B1E16", H: "#3D2B1F", L: "#5A4030", ...SK, E: "#2B2B2B", b: "#9A6A48", N: BLUE, n: "#2F63A6", W: "#F5F5F5", Z: "#2F63A6", P: "#3A3F4A", B: "#151515", F: SK.S, f: SK.S },
  kasse: { h: "#D9B23E", H: "#EBC95A", L: "#F5DB84", ...SK, E: "#2B2B2B", b: SK.S, N: RED, n: "#A8322B", W: "#F5F5F5", Z: GOLD, P: "#3A3F4A", B: "#151515", F: SK.S, f: SK.S },
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
const POPCORN = {
  rows: ["...YwYY...", ".YYwYYwYY.", "YwYYYwYYwY", "KKKKKKKKKK", "KRRWWRRWWK", ".KRWWRRWK.", ".KRWWRRWK.", ".KRWWRRWK.", "..KWRRWK..", "..KWRRWK..", "..KKKKKK.."],
  pal: { Y: "#FFE07A", w: "#FFF6D0", K: INK, R: RED, W: "#FFFFFF" },
};
const HOOK = { rows: ["..GG", "...G", "...G", "...G", "G..G", "GGGG"], pal: { G: "#C9D1DA" } };
const COIN = { rows: [".YY.", "YyYY", "YYyY", ".YY."], pal: { Y: GOLD, y: "#FFF3B0" } };
const Bucket: React.FC<{ t: number; x: number; base: number; px: number; a?: number; style?: React.CSSProperties }> = ({ t, x, base, px, a = -1, style }) => (
  <div style={{ position: "absolute", left: x, top: base - POPCORN.rows.length * px, zIndex: 5, ...(a >= 0 ? popStyle(t, a, 20, 0.5) : {}), ...style }}>
    <Sprite rows={POPCORN.rows} pal={POPCORN.pal} px={px} />
  </div>
);
// three sizes on the counter (base line y 690 in panel px = counter top)
const SIZES = [{ n: "KLEIN", x: 150, px: 11, p: "4,00 €" }, { n: "MITTEL", x: 410, px: 15, p: "7,50 €" }, { n: "GROSS", x: 700, px: 19, p: "8,00 €" }];
const BASE = 640;

// ---------- pixel UI pieces ----------
const PxBox: React.FC<{ bg?: string; color?: string; size?: number; border?: string; shadow?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({ bg = GOLD, color = INK, size = 28, border = INK, shadow = true, style, children }) => (
  <div style={{ position: "absolute", fontFamily: PX, fontSize: size, lineHeight: 1.25, color, background: bg, border: `${Math.max(4, Math.round(size / 6))}px solid ${border}`, padding: `${size * 0.55}px ${size * 0.6}px ${size * 0.4}px`, boxShadow: shadow ? `6px 6px 0 ${INK}` : undefined, whiteSpace: "nowrap", zIndex: 8, ...style }}>{children}</div>
);
const Bubble: React.FC<{ t: number; a: number; text: string; x: number; y: number; tail?: "l" | "r"; size?: number; w?: number; type?: number }> = ({ t, a, text, x, y, tail = "l", size = 26, w, type = 0.6 }) => {
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
const PriceTag: React.FC<{ t: number; a: number; text: string; x: number; y: number; hot?: boolean }> = ({ t, a, text, x, y, hot }) => (t < a - 0.05 ? null : (
  <PxBox bg={hot ? GOLD : "#FFFDF6"} size={26} style={{ left: x, top: y, transform: `rotate(${hot ? -4 : 0}deg)`, ...popStyle(t, a - 0.05, 12, 0.5) }}>{text}</PxBox>
));

// ---------- scenes ----------
// 1 · Hook: three buckets on the counter, the middle one is the bait. Frame 0 readable.
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const bait = t > A.keiner - 0.05;
  const big = t > A.grosse - 0.05;
  return (
    <>
      <Plate id="cinema" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 108, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 40, color: "#FFF", background: INK, padding: "22px 26px 14px", boxShadow: `6px 6px 0 rgba(0,0,0,.35)`, transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - 0.2) / 0.2)})` }}>POPCORN:</div>
        <div style={{ fontFamily: PX, fontSize: 36, color: INK, background: GOLD, border: `6px solid ${INK}`, padding: "18px 22px 10px", boxShadow: `6px 6px 0 ${INK}`, transform: `rotate(${bait ? -3 : 0}deg) scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - A.keiner) / 0.18)})` }}>EINE GRÖSSE IST FAKE.</div>
      </div>
      {SIZES.map((s, i) => <Bucket key={s.n} t={t} x={s.x} base={BASE} px={s.px} a={i * 0.12} style={{ transform: `scale(${big && i === 2 ? 1 + 0.08 * Math.abs(Math.sin((t - A.grosse) * 6)) : 1})`, transformOrigin: "50% 100%" }} />)}
      {bait ? <div style={{ position: "absolute", left: 392, top: BASE - 15 * 11 - 30, width: 186, height: 15 * 11 + 50, border: `8px solid ${RED}`, opacity: Math.floor((t - A.keiner) * 6) % 2 && t - A.keiner < 0.7 ? 0.3 : 1, zIndex: 6 }} /> : null}
      {bait ? <Stamp t={t} a={A.kaufen} text="NICHT KAUFEN" bg={RED} color="#FFF" size={24} rot={-5} style={{ left: 330, top: 690 }} /> : null}
      {t > A.kumpel0 - 0.05 ? <Person t={t} who="kumpel" x={880} y={BASE - 120} px={8} flip a={A.kumpel0 - 0.05} /> : null}
      {big ? spark(t, A.grosse, 790, 520, 10, 50, 170) : null}
      <Bubble t={t} a={A.lohnt - 0.05} text="LOHNT SICH!" x={590} y={300} tail="r" size={24} type={0.35} />
    </>
  );
};

// 2 · The real case: a $300 bread maker, a bigger $400 one next to it, the small one sells twice as often
const BREAD = {
  rows: ["...KKKKKKKK...", "..KWWWWWWWWK..", ".KWGGGGGGGGWK.", "KWWGdddddddWWK", "KWWGdbbbbbdWWK", "KWWGdBBBBBdWWK", "KWWGdBBBBBdWWK", "KWWGdddddddWWK", "KWWWWWWWWWWWWK", "KWWWWWWoWWRWWK", "KWWWWWWWWWWWWK", "KKKKKKKKKKKKKK", ".KK........KK."],
  pal: { K: INK, W: "#F4F1EA", G: "#C9D1DA", d: "#5A6270", b: "#E8B36A", B: "#B8743A", o: GREEN, R: RED },
};
const SALES_Y = 548;
const Sales: React.FC<{ t: number; a: number; x: number; w: number; v: number; col: string; label: string }> = ({ t, a, x, w, v, col, label }) => (t < a ? null : (
  <div style={{ position: "absolute", left: x, top: SALES_Y, width: w, zIndex: 6, ...popStyle(t, a, 10, 0.5) }}>
    <div style={{ fontFamily: PX, fontSize: 14, color: INK, marginBottom: 8 }}>VERKAUFT</div>
    <div style={{ height: 44, background: "#FFFDF6", border: `5px solid ${INK}` }}><div style={{ height: "100%", width: `${v}%`, background: col }} /></div>
    <div style={{ fontFamily: PX, fontSize: 18, color: col, marginTop: 10 }}>{label}</div>
  </div>
));
const SceneStudy: React.FC<{ t: number }> = ({ t }) => {
  const big = t > A.groesser - 0.1;
  const slide = k(t, A.groesser - 0.1, 0.45, Easing.out(Easing.back(1.3)));
  const small = t < A.plotz ? 18 : interpolate(t, [A.plotz, A.doppelt + 0.3], [18, 36], clamp) * (1 + 0.04 * Math.sin((t - A.plotz) * 9) * (t < A.doppelt + 0.6 ? 1 : 0));
  return (
    <>
      <Plate id="shop" />
      <div style={{ position: "absolute", left: 90, top: 470 - 13 * 16, zIndex: 5, ...popStyle(t, A.brot - 0.1, 24, 0.6) }}><Sprite rows={BREAD.rows} pal={BREAD.pal} px={16} /></div>
      <PriceTag t={t} a={A.n300} text="~300 $" x={110} y={460} />
      {t > A.brot - 0.05 ? <PxBox bg="#FFF" size={16} style={{ left: 60, top: 150, ...popStyle(t, A.brot - 0.05, 10, 0.6) }}>BROTBACKAUTOMAT</PxBox> : null}
      {t > A.kaum - 0.05 ? <Sales t={t} a={A.kaum - 0.05} x={70} w={300} v={Math.min(small * 2.2, 100)} col={t > A.plotz ? GREEN : RED} label={t > A.doppelt ? "FAST DOPPELT" : "KAUM"} /> : null}
      {big ? <div style={{ position: "absolute", left: 560 + (1 - slide) * 600, top: 470 - 13 * 26, zIndex: 5 }}><Sprite rows={BREAD.rows} pal={BREAD.pal} px={26} /></div> : null}
      <PriceTag t={t} a={A.n400} text="400+ $" x={640} y={460} hot />
      {t > A.niemand - 0.05 ? <Sales t={t} a={A.niemand - 0.05} x={600} w={340} v={3} col={RED} label="FAST NIEMAND" /> : null}
      {t > A.doppelt - 0.05 ? <Stamp t={t} a={A.doppelt - 0.05} text="x2" bg={GOLD} size={56} rot={-8} style={{ left: 330, top: 300 }} /> : null}
      {t > A.doppelt ? spark(t, A.doppelt, 230, 380, 10, 60, 200) : null}
      <PxBox bg={INK} color="#FFF" size={18} shadow={false} style={{ left: 40, bottom: 34, ...popStyle(t, A.laden, 10, 0.5) }}>WILLIAMS-SONOMA · USA</PxBox>
    </>
  );
};

// 3 · The term, typed big over the cinema; a fishing hook drops onto the middle bucket
const SceneTerm: React.FC<{ t: number }> = ({ t }) => {
  const l1 = typed("DECOY EFFEKT", t, A.decoy - 0.15, A.decoy + 0.45);
  const drop = k(t, A.angebot - 0.1, 0.5, Easing.out(Easing.back(1.4)));
  return (
    <>
      <Plate id="cinema" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 56, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "26px 30px 16px", boxShadow: `0 8px 0 #6B4528`, ...popStyle(t, A.heisst, 16, 0.7) }}>
          {l1}<span style={{ opacity: 0 }}>{"DECOY EFFEKT".slice(l1.length)}</span>
        </div>
        {t > A.angebot - 0.05 ? <PxBox bg="#FFF" size={22} style={{ position: "relative", ...popStyle(t, A.angebot - 0.05, 10, 0.6) }}>= DAS KÖDER-ANGEBOT</PxBox> : null}
      </div>
      {SIZES.map((s) => <Bucket key={s.n} t={t} x={s.x} base={BASE + 40} px={s.px} />)}
      <div style={{ position: "absolute", left: 487, top: -40 + drop * 430, width: 6, height: 40 + 0, zIndex: 7 }} />
      <div style={{ position: "absolute", left: 489, top: 0, width: 4, height: drop * 430, background: "#C9D1DA", zIndex: 7 }} />
      <div style={{ position: "absolute", left: 465, top: drop * 430 - 10, zIndex: 7 }}><Sprite rows={HOOK.rows} pal={HOOK.pal} px={10} /></div>
      {t > A.guenstig - 0.05 ? <div style={{ position: "absolute", left: 740, top: 360, zIndex: 9, ...popStyle(t, A.guenstig - 0.05, 12, 0.5) }}><PxBox bg={GREEN} color="#FFF" size={22} style={{ position: "relative" }}>SIEHT BILLIG AUS</PxBox></div> : null}
      {t > A.guenstig ? spark(t, A.guenstig, 810, 560, 8, 40, 150, GREEN) : null}
    </>
  );
};

// 4 · Prices: 4,00 / 7,50 / 8,00, the buddy does the maths
const ScenePrices: React.FC<{ t: number }> = ({ t }) => {
  const done = t > A.logisch - 0.05;
  return (
    <>
      <Plate id="cinema" />
      {SIZES.map((s, i) => <Bucket key={s.n} t={t} x={s.x} base={BASE + 40} px={s.px} style={{ opacity: done && i < 2 ? 0.45 : 1 }} />)}
      <PriceTag t={t} a={A.vier} text="4,00 €" x={120} y={720} />
      <PriceTag t={t} a={A.sieben} text="7,50 €" x={410} y={720} />
      <PriceTag t={t} a={A.acht} text="8,00 €" x={720} y={720} hot />
      {t > A.cent - 0.1 ? (
        <div style={{ position: "absolute", left: 520, top: 610, zIndex: 9, ...popStyle(t, A.cent - 0.1, 10, 0.5) }}>
          <PxBox bg={RED} color="#FFF" size={22} style={{ position: "relative" }}>+0,50 €</PxBox>
        </div>
      ) : null}
      <Person t={t} who="kumpel" x={60} y={250} px={9} a={A.kumpel1 - 0.1} bob={done ? 2 : 1} speed={done ? 7 : 3.2} />
      <Bubble t={t} a={A.cent - 0.35} text="FÜR 50 CENT MEHR?" x={220} y={150} size={26} type={0.45} />
      {done ? <Stamp t={t} a={A.logisch - 0.05} text="LOGISCH." bg={GOLD} size={40} rot={-6} style={{ left: 640, top: 230 }} /> : null}
      {done ? spark(t, A.logisch, 830, 520, 10, 60, 200) : null}
    </>
  );
};

// 5 · "Ich finde": he is right. The cinema too. Coins go into the till.
const SceneRule: React.FC<{ t: number }> = ({ t }) => {
  const till = t > A.kino1 - 0.15;
  return (
    <>
      <Plate id="cinema" />
      <Person t={t} who="kumpel" x={110} y={360} px={11} seed={0.2} />
      <Bucket t={t} x={300} base={720} px={14} />
      {t > A.recht - 0.1 ? <Stamp t={t} a={A.recht - 0.1} text="ER HAT RECHT." bg={GREEN} color="#FFF" size={28} rot={-4} style={{ left: 120, top: 170 }} /> : null}
      <Person t={t} who="kasse" x={760} y={360} px={11} flip seed={0.6} bob={till ? 2 : 1} speed={till ? 6 : 3.2} />
      {till ? <Stamp t={t} a={A.kino1 - 0.05} text="DAS KINO AUCH." bg={GOLD} size={28} rot={4} style={{ left: 560, top: 250 }} /> : null}
      {till ? [0, 1, 2, 3, 4, 5].map((i) => {
        const u = Math.max(0, Math.min(1, (t - A.kino1 - i * 0.08) / 0.5));
        return u <= 0 ? null : <div key={i} style={{ position: "absolute", left: 470 + u * 320 + i * 6, top: 560 - Math.sin(u * Math.PI) * 220, zIndex: 9, opacity: u < 1 ? 1 : 0 }}><Sprite rows={COIN.rows} pal={COIN.pal} px={9} /></div>;
      }) : null}
      {till ? spark(t, A.kino1 + 0.5, 830, 560, 10, 40, 160) : null}
    </>
  );
};

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; tag?: [number, string] };
const SCENES: Scene[] = [
  { from: 0, to: A.laden - 0.05, El: SceneHook, pill: "Kino · Geld", tag: [A.keiner, "KÖDER"] },
  { from: A.laden - 0.05, to: A.heisst - 0.05, El: SceneStudy, pill: "Echter Fall", tag: [A.groesser, "DER KÖDER"] },
  { from: A.heisst - 0.05, to: A.klein - 0.05, El: SceneTerm, pill: "Psychologie" },
  { from: A.klein - 0.05, to: A.finde - 0.05, El: ScenePrices, pill: "An der Kasse", tag: [A.cent, "RECHNET SICH"] },
  { from: A.finde - 0.05, to: A.das - 0.05, El: SceneRule, pill: "Meine Meinung" },
  { from: A.das - 0.05, to: 999 },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["kino", "keiner", "kumpel", "große", "lohnt", "küchenladen", "brotbackautomaten", "dreihundert", "kaum", "vierhundert", "niemand", "doppelt", "decoy", "günstig", "vier", "sieben", "acht", "cent", "logisch", "recht"]);
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
// on-screen spelling: numbers as digits
const SHOW: Record<string, string> = { dreihundert: "300", vierhundert: "400", vier: "4", acht: "8", sieben: "7", fünfzig: "50" };
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
  const keyIdx = c.words.findIndex((w) => KEY.has(norm(w)) || /^\d+$/.test(w));
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

export const PopcornPixel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = React.useMemo(() => makeChunks(CAPS.filter((c) => c.endMs / 1000 <= END + 0.01)), []);
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
        <Sequence durationInFrames={Math.round(END * fps)} layout="none">
          <OffthreadVideo src={staticFile("render-gpts-popcorn-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
        </Sequence>
        <Sequence from={Math.round(END * fps)} layout="none">
          <OffthreadVideo src={staticFile("render-gpts-popcorn-tightened-skin.mp4")} startFrom={Math.round(SRC_HOLD_FROM * fps)} muted style={{ width: "100%", height: "100%" }} />
        </Sequence>
      </div>
      {El ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: El === SceneStudy ? "#D9CDB6" : "#2B1E2E", boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }}>
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
