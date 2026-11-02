import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-sludge-flug/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "Fünf Sterne für den Bot" (Sludge, Thaler/Sunstein, 2026-10-28) im Pixel-Niklas-Look wie WerbungPixel.
// Gegenmittel #2: Flug-Guide (EU 261: bis 600 €). Pointe "Fünf Sterne. Der Bot war so nett." ruhig auf dem Gesicht,
// danach Outro mit Guide-Cover und Kommentarwort FLUG.

const W = 1080, H = 1920, PH = 960;
const GOLD = "#FFC83D", INK = "#141414", RED = "#D8463A", GREEN = "#4C9A5A", BLUE = "#3E7CC9";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
const END = CAPS[CAPS.length - 1].endMs / 1000;
export const SL_FRAMES = Math.round((END + 0.9) * 25);
export const A = {
  kumpel0: at("kumpel", 0), teneriffa: at("teneriffa"), airline: at("airline", 0), n400: at("vierhundert"), nichts: at("nichts"),
  nicht: at("nicht", 0), recht: at("recht"), schlange: at("supportwarteschlange"),
  heisst: at("heißt"), sludge: at("sludge"), firma: at("firma"), zusteht: at("zusteht"), muehsam: at("mühsam"), aufgibst: at("aufgibst"),
  frueher: at("früher"), n14: at("vierzehn"), heute: at("heute"), ewig: at("ewig"), bot0: at("kichatbot"), freundlich: at("freundlich"), versteht: at("versteht"), nie: at("nie"),
  kumpel1: at("kumpel", 1), dreimal0: at("dreimal", 0), entsch: at("entschädigung"), dreimal1: at("dreimal", 1), gepaeck: at("gepäck"), gibt: at("gibt"),
  find: at("find"), genial: at("genial"), bewertet: at("bewertet"), fuenf: at("fünf"),
  hol: at("hol"), aufgeschrieben: at("aufgeschrieben"), chatgpt: at("chatgpt"), minuten: at("minuten"), antrag: at("antrag"), schreibt: at("schreibt", 1), ohne: at("ohne"), chatbot: at("chatbot"),
  n600: at("sechshundert"), person: at("person"), schreib: at("schreib"), flug: at("flug"), schick: at("schick"),
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
// airport hall: big window with a parked plane, tiled floor
const drawAirport = () => {
  const p = painter(); const { R, P, dither } = p;
  R(0, 0, 180, 120, "#DCE3EA"); R(0, 0, 180, 8, "#3A3F4A"); R(0, 8, 180, 2, GOLD);
  R(6, 18, 168, 70, "#9FD3F0"); dither(6, 18, 168, 2, "#C6E6F7", "#9FD3F0");
  for (let x = 6; x < 176; x += 28) R(x, 18, 2, 70, "#5A6270");
  R(6, 86, 168, 2, "#5A6270");
  // plane
  R(40, 58, 92, 12, "#F5F5F5"); R(132, 60, 10, 8, "#F5F5F5"); R(142, 62, 4, 4, "#C9CDD3"); R(36, 60, 6, 8, "#F5F5F5");
  R(36, 46, 8, 14, BLUE); R(70, 70, 34, 4, "#C9CDD3"); for (let x = 60; x < 128; x += 7) R(x, 61, 3, 3, "#3A3F4A");
  R(48, 66, 84, 2, BLUE);
  R(0, 118, 180, 2, "#5A6270");
  for (let y = 120; y < 160; y += 8) for (let x = (y / 8) % 2 ? 0 : 10; x < 180; x += 20) { R(x, y, 10, 8, "#C9CDD3"); R(x + 10, y, 10, 8, "#B9BEC6"); }
  return p.ops;
};
// service hall: plain wall, queue posts, floor
const drawHall = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 118, "#EFE8DA"); for (let y = 6; y < 118; y += 10) for (let x = (y / 10) % 2 ? 0 : 10; x < 180; x += 20) P(x, y, "#E3DAC8");
  R(0, 118, 180, 2, "#8A8F98");
  R(0, 120, 180, 40, "#B9BEC6"); for (let y = 122; y < 160; y += 4) for (let x = (y % 8) ? 0 : 3; x < 180; x += 7) P(x, y, "#ADB2BA");
  return p.ops;
};
const drawDark = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#22262E"); for (let y = 3; y < 160; y += 7) for (let x = (y % 2) * 5; x < 180; x += 11) P(x, y, "#2C313B");
  R(0, 132, 180, 28, "#1A1D23"); R(0, 132, 180, 1, GOLD);
  return p.ops;
};
const PLATES = { airport: drawAirport(), hall: drawHall(), dark: drawDark() };
const Plate = React.memo<{ id: keyof typeof PLATES }>(({ id }) => (
  <svg width={W + 48} height={PH + 48} viewBox="0 0 180 160" preserveAspectRatio="none" shapeRendering="crispEdges" style={{ position: "absolute", left: -24, top: -24 }}>
    {PLATES[id].map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w + 0.02} height={h + 0.02} fill={c} />)}
  </svg>
));
const PLATE_BG = { airport: "#DCE3EA", hall: "#EFE8DA", dark: "#22262E" };

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
const SUITCASE = { rows: ["...KKKK...", "...K..K...", "KKKKKKKKKK", "KYYYYYYYYK", "KYKYYYYKYK", "KYKYYYYKYK", "KYKYYYYKYK", "KYYYYYYYYK", "KKKKKKKKKK", ".K......K."], pal: { K: INK, Y: GOLD } };
const COIN = { rows: [".YY.", "YyYY", "YYyY", ".YY."], pal: { Y: GOLD, y: "#FFF3B0" } };
const ROBOT = { rows: ["....KK....", "....RR....", ".KKKKKKKK.", "KWWWWWWWWK", "KWBBWWBBWK", "KWBBWWBBWK", "KWWWWWWWWK", "KWWRRRRWWK", "KWWWWWWWWK", ".KKKKKKKK."], pal: { K: INK, W: "#F5F5F5", B: BLUE, R: RED } };
const STAR = { rows: [".....K.....", "....KYK....", "....KYK....", "KKKKYYYKKKK", ".KYYYYYYYK.", "..KYYYYYK..", "..KYYKYYK..", ".KYYK.KYYK.", ".KKK...KKK."], pal: { K: INK, Y: "#FFFFFF" } };
const HOURGLASS = { rows: ["KKKKKKKK", ".KYYYYK.", "..KYYK..", "...KK...", "...KK...", "..K..K..", ".K.YY.K.", "KKKKKKKK"], pal: { K: INK, Y: GOLD } };
const WALL = { rows: ["KKKKKKKK", "KRRKRRRK", "KKKKKKKK", "KRRRKRRK", "KKKKKKKK", "KRRKRRRK", "KKKKKKKK"], pal: { K: INK, R: RED } };
const NOTE = { rows: ["...KKK", "...KKK", "...K..", "...K..", ".KKK..", "KKKK..", ".KK..."], pal: { K: INK } };

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

// ---------- scenes ----------
// 1 · Hook: "Die Airline schuldet ihm 400 €. Er kriegt nichts." readable on frame 0
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const late = t > A.teneriffa - 0.1;
  const blink = Math.floor(t * 4) % 2 === 0;
  return (
    <>
      <Plate id="airport" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 104, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 36, color: "#FFF", background: INK, padding: "22px 26px 14px", boxShadow: `6px 6px 0 rgba(0,0,0,.35)`, transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - 0.2) / 0.2)})` }}>AIRLINE SCHULDET 400 €</div>
        <div style={{ fontFamily: PX, fontSize: 36, color: "#FFF", background: RED, border: `6px solid ${INK}`, padding: "18px 22px 10px", boxShadow: `6px 6px 0 ${INK}`, transform: `rotate(${t > A.nichts ? -3 : 0}deg) scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - A.nichts) / 0.18)})` }}>ER KRIEGT: 0 €</div>
      </div>
      {/* departure board */}
      <div style={{ position: "absolute", left: 470, top: 380, width: 540, zIndex: 7, background: INK, border: `6px solid #3A3F4A`, boxShadow: `8px 8px 0 rgba(0,0,0,.3)`, padding: "18px 20px 12px", fontFamily: PX, ...popStyle(t, 0.1, 14, 0.6) }}>
        <div style={{ fontSize: 16, color: "#9AA3AD", marginBottom: 14 }}>ANKUNFT</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: GOLD }}><span>{typed("TENERIFFA", t, 0.15, 0.6)}</span><span>14:05</span></div>
        <div style={{ marginTop: 16, fontSize: 22, color: late && blink ? RED : late ? "#FF8A7A" : "#9AA3AD" }}>{late ? "+4:00 VERSPÄTET" : "PÜNKTLICH?"}</div>
      </div>
      <Person t={t} who="kumpel" x={120} y={520} px={12} a={0.12} />
      <div style={{ position: "absolute", left: 300, top: 690, zIndex: 5, ...popStyle(t, 0.25, 10, 0.5) }}><Sprite rows={SUITCASE.rows} pal={SUITCASE.pal} px={10} /></div>
      {t > A.n400 - 0.1 ? (
        <>
          {[0, 1, 2, 3, 4].map((i) => (t < A.n400 - 0.1 + i * 0.05 ? null : <div key={i} style={{ position: "absolute", left: 560 + i * 44, top: 720 - (i % 2) * 20, zIndex: 8, ...popStyle(t, A.n400 - 0.1 + i * 0.05, 30, 0.4), opacity: t > A.nichts ? 0.25 : 1 }}><Sprite rows={COIN.rows} pal={COIN.pal} px={11} /></div>))}
          <PxBox bg={GOLD} size={26} style={{ left: 600, top: 630, ...popStyle(t, A.n400, 10, 0.5), opacity: t > A.nichts ? 0.4 : 1 }}>400 €</PxBox>
        </>
      ) : null}
      {t > A.n400 ? spark(t, A.n400 - 0.05, 700, 740, 10, 40, 150) : null}
    </>
  );
};

// 2 · Not because he has no right, but because he lands in the support queue
const SceneQueue: React.FC<{ t: number }> = ({ t }) => {
  const q = t > A.schlange - 0.15;
  const n = 214 - Math.floor(Math.max(0, t - A.schlange) * 1.2);
  const whos: Who[] = ["sport", "prof", "sport", "prof", "sport", "prof", "sport"];
  return (
    <>
      <Plate id="hall" />
      {t > A.recht - 0.1 ? <PxBox bg={GREEN} color="#FFF" size={24} style={{ left: 60, top: 120, ...popStyle(t, A.recht - 0.1, 10, 0.5) }}>RECHT AUF 400 €: JA</PxBox> : null}
      {q ? (
        <>
          <div style={{ position: "absolute", left: 40, top: 250, width: 1000, zIndex: 8, ...popStyle(t, A.schlange - 0.15, 12, 0.6) }}>
            <div style={{ display: "inline-block", fontFamily: PX, fontSize: 26, color: "#FFF", background: INK, padding: "18px 22px 12px", boxShadow: `6px 6px 0 ${GOLD}` }}>
              SUPPORT · PLATZ <span style={{ color: GOLD }}>{n}</span>
            </div>
          </div>
          {whos.map((w, i) => (
            <Person key={i} t={t} who={w} x={70 + i * 120} y={480 + (i % 2) * 8} px={7} a={A.schlange - 0.1 + i * 0.05} seed={i * 0.37} bob={0.4} speed={1.2} />
          ))}
          <Person t={t} who="kumpel" x={900} y={470} px={8} a={A.schlange + 0.3} flip bob={0} />
          <div style={{ position: "absolute", left: 60, top: 700, width: 960, height: 8, background: RED, zIndex: 3 }} />
          {[0, 1, 2].map((i) => {
            const u = ((t - A.schlange) * 0.7 + i / 3) % 1;
            return t < A.schlange ? null : <div key={i} style={{ position: "absolute", left: 760 + i * 70, top: 420 - u * 120, opacity: 1 - u, zIndex: 9 }}><Sprite rows={NOTE.rows} pal={NOTE.pal} px={7} /></div>;
          })}
          {t > A.schlange + 0.4 ? <PxBox bg="#FFF" size={16} style={{ left: 620, top: 340, ...popStyle(t, A.schlange + 0.4, 8, 0.5) }}>WARTEMUSIK</PxBox> : null}
        </>
      ) : null}
    </>
  );
};

// 3 · The term: SLUDGE typed; walls pop up between him and his money; he gives up
const SceneTerm: React.FC<{ t: number }> = ({ t }) => {
  const l1 = typed("SLUDGE", t, A.sludge - 0.1, A.sludge + 0.35);
  const walls = [A.firma, A.zusteht, A.muehsam - 0.2, A.muehsam + 0.1];
  const quit = t > A.aufgibst - 0.05;
  return (
    <>
      <Plate id="dark" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 84, lineHeight: 1.1, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "30px 40px 18px", boxShadow: `0 8px 0 #6B4528`, ...popStyle(t, A.heisst, 16, 0.7) }}>
          {l1}<span style={{ opacity: 0 }}>{"SLUDGE".slice(l1.length)}</span>
        </div>
        {t > A.muehsam - 0.1 ? <div style={{ fontFamily: PX, fontSize: 22, color: "#FFF", ...popStyle(t, A.muehsam - 0.1, 8, 0.6) }}>= ABSICHTLICH MÜHSAM</div> : null}
      </div>
      {t > A.firma - 0.2 ? (
        <>
          <Person t={t} who="kumpel" x={70} y={560} px={9} a={A.firma - 0.2} flip={quit} bob={quit ? 0 : 1} />
          <div style={{ position: "absolute", left: 880, top: 650, zIndex: 6, ...popStyle(t, A.zusteht - 0.1, 10, 0.5) }}><Sprite rows={COIN.rows} pal={COIN.pal} px={22} /></div>
          {t > A.zusteht - 0.1 ? <PxBox bg={GOLD} size={16} style={{ left: 830, top: 580, ...popStyle(t, A.zusteht - 0.1, 8, 0.5) }}>DEIN GELD</PxBox> : null}
          {walls.map((a, i) => (t < a ? null : <div key={i} style={{ position: "absolute", left: 300 + i * 130, top: 610 - (i % 2) * 30, zIndex: 7, ...popStyle(t, a, 40, 0.3) }}><Sprite rows={WALL.rows} pal={WALL.pal} px={11} /></div>))}
          {quit ? <Stamp t={t} a={A.aufgibst - 0.05} text="DU GIBST AUF" bg={RED} color="#FFF" size={30} rot={-5} style={{ left: 330, top: 470 }} /> : null}
        </>
      ) : null}
      <PxBox bg={INK} color="#FFF" size={15} shadow={false} style={{ left: 40, bottom: 76, border: `4px solid #3A3F4A`, ...popStyle(t, A.sludge, 10, 0.5) }}>THALER & SUNSTEIN</PxBox>
    </>
  );
};

// chat window (flat, no platform logo)
const ChatWin: React.FC<{ t: number; a: number; x: number; y: number; w: number; h: number; grey?: boolean; children?: React.ReactNode }> = ({ t, a, x, y, w, h, grey, children }) => (t < a - 0.05 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 7, background: "#FFFFFF", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, overflow: "hidden", filter: grey ? "grayscale(1) brightness(0.92)" : undefined, ...popStyle(t, a - 0.05, 20, 0.6) }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, background: INK, padding: "12px 16px" }}>
      <div style={{ background: "#FFF", padding: 4 }}><Sprite rows={ROBOT.rows} pal={ROBOT.pal} px={4} /></div>
      <div style={{ fontFamily: PX, fontSize: 18, color: "#FFF" }}>SUPPORT-CHAT</div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontFamily: PX, fontSize: 12, color: "#9FE0AE" }}><i style={{ width: 12, height: 12, background: "#4CD964", display: "block" }} />ONLINE</div>
    </div>
    <div style={{ position: "relative", padding: 18 }}>{children}</div>
  </div>
));
const Msg: React.FC<{ t: number; a: number; text: string; me?: boolean; size?: number }> = ({ t, a, text, me, size = 18 }) => (t < a - 0.05 ? null : (
  <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginBottom: 12, ...popStyle(t, a - 0.05, 10, 0.6) }}>
    <div style={{ fontFamily: PX, fontSize: size, lineHeight: 1.4, color: me ? "#FFF" : INK, background: me ? BLUE : "#ECEAE4", border: `4px solid ${INK}`, padding: `${size * 0.6}px ${size * 0.7}px ${size * 0.4}px`, maxWidth: "82%" }}>{text}</div>
  </div>
));

// 4 · Früher: a form with 14 fields. Heute: endless wait, then a friendly AI chatbot that never understands
const SceneBot: React.FC<{ t: number }> = ({ t }) => {
  const formOut = interpolate(t, [A.heute - 0.1, A.heute + 0.25], [0, -900], { ...clamp, easing: Easing.in(Easing.cubic) });
  const wait = t > A.ewig - 0.15 && t < A.bot0 - 0.05;
  return (
    <>
      <Plate id="hall" />
      {t < A.heute + 0.3 ? (
        <div style={{ position: "absolute", left: 130 + formOut, top: 110, width: 820, zIndex: 7, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "20px 24px", ...popStyle(t, A.frueher - 0.05, 20, 0.6) }}>
          <div style={{ fontFamily: PX, fontSize: 20, color: "#FFF", background: INK, padding: "12px 12px 8px", marginBottom: 16 }}>ANTRAG ENTSCHÄDIGUNG</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 18px" }}>
            {Array.from({ length: 14 }, (_, i) => {
              const a = A.frueher + 0.1 + i * 0.045;
              return t < a ? <div key={i} style={{ height: 52 }} /> : <div key={i} style={{ height: 52, border: `4px solid ${INK}`, background: "#FFF", fontFamily: PX, fontSize: 12, color: "#9A968C", padding: "10px 8px 0", ...popStyle(t, a, 6, 0.6) }}>FELD {i + 1}</div>;
            })}
          </div>
          {t > A.n14 - 0.05 ? <Stamp t={t} a={A.n14 - 0.05} text="14 FELDER" bg={GOLD} size={28} rot={-6} style={{ right: -20, top: -30 }} /> : null}
        </div>
      ) : null}
      {wait ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, zIndex: 8, ...popStyle(t, A.ewig - 0.15, 10, 0.6) }}>
          <div style={{ transform: `rotate(${Math.floor((t - A.ewig) * 3) % 2 ? 180 : 0}deg)` }}><Sprite rows={HOURGLASS.rows} pal={HOURGLASS.pal} px={16} /></div>
          <PxBox bg={INK} color="#FFF" size={24} style={{ position: "relative" }}>WARTEZEIT: {47 + Math.floor((t - A.ewig) * 9)} MIN</PxBox>
        </div>
      ) : null}
      <ChatWin t={t} a={A.bot0 - 0.05} x={110} y={110} w={860} h={640}>
        <Msg t={t} a={A.bot0 + 0.1} text="HALLO! ICH BIN DEIN KI-ASSISTENT :)" />
        <Msg t={t} a={A.freundlich - 0.1} text="WIE KANN ICH DIR HEUTE HELFEN?" />
        {t > A.freundlich ? <Stamp t={t} a={A.freundlich} text="SUPER FREUNDLICH" bg={GOLD} size={22} rot={-4} style={{ left: 300, top: 230 }} /> : null}
        {t > A.nie - 0.15 ? <Stamp t={t} a={A.nie - 0.15} text="VERSTEHT: NICHTS" bg={RED} color="#FFF" size={26} rot={3} style={{ left: 200, top: 360 }} /> : null}
      </ChatWin>
    </>
  );
};

// 5 · He types "Entschädigung" three times, the bot sends the lost-luggage link three times, he gives up
const SceneLoop: React.FC<{ t: number }> = ({ t }) => {
  const u0 = A.entsch - 0.1;
  const step = Math.max(0.3, (A.dreimal1 - u0) / 3);
  const b0 = A.gepaeck - 0.6;
  const bstep = Math.max(0.25, (A.gibt - 0.15 - b0) / 3);
  const msgs: [number, string, boolean][] = [];
  for (let i = 0; i < 3; i++) { msgs.push([u0 + i * step, "ENTSCHÄDIGUNG", true]); msgs.push([b0 + i * bstep, "LINK: VERLORENES GEPÄCK", false]); }
  msgs.sort((a, b) => a[0] - b[0]);
  const shown = msgs.filter((m) => t >= m[0] - 0.05);
  const scroll = Math.max(0, shown.length - 5) * 82;
  const done = t > A.gibt - 0.05;
  return (
    <>
      <Plate id="hall" />
      <ChatWin t={t} a={A.kumpel1 - 0.05} x={110} y={110} w={860} h={690} grey={done}>
        <div style={{ transform: `translateY(${-scroll}px)`, transition: "none" }}>
          {msgs.map(([a, s, me], i) => <Msg key={i} t={t} a={a} text={s} me={me} />)}
        </div>
      </ChatWin>
      {t > A.dreimal0 - 0.05 ? <PxBox bg={GOLD} size={26} style={{ right: 50, top: 820, ...popStyle(t, A.dreimal0 - 0.05, 8, 0.5) }}>{t > A.dreimal1 ? "3× · 3×" : "3×"}</PxBox> : null}
      {done ? <Stamp t={t} a={A.gibt - 0.05} text="CHAT BEENDET" bg={INK} color="#FFF" size={34} rot={-5} style={{ left: 260, top: 380 }} /> : null}
    </>
  );
};

// 6 · "Ich find das genial. Am Ende bewertet er den Chat sogar." rating dialog, empty stars (the pointe stays on the face)
const SceneRate: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="hall" />
    <Person t={t} who="niklas" x={80} y={430} px={12} a={A.find - 0.1} />
    {t > A.genial - 0.05 ? <PxBox bg={GOLD} size={22} style={{ left: 60, top: 330, ...popStyle(t, A.genial - 0.05, 10, 0.5) }}>GENIAL.</PxBox> : null}
    {t > A.bewertet - 0.15 ? (
      <div style={{ position: "absolute", left: 360, top: 200, width: 660, zIndex: 8, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "28px 26px 24px", textAlign: "center", ...popStyle(t, A.bewertet - 0.15, 20, 0.6) }}>
        <div style={{ fontFamily: PX, fontSize: 24, color: INK, marginBottom: 26 }}>WIE WAR DEIN CHAT?</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 22 }}>
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ flexShrink: 0, ...popStyle(t, A.bewertet + i * 0.06, 8, 0.5) }}><Sprite rows={STAR.rows} pal={STAR.pal} px={8} /></div>)}
        </div>
      </div>
    ) : null}
  </>
);

// 7 · Outro (animated to the last frame): cover → the claim letter types itself in 2 min → no chatbot →
// pages fan out, up to 600 € per person → "FLUG" typed into the comment field → DM with the PDF arrives
const PAGE = (n: number) => staticFile(`gpts-sludge-flug/guide-${n === 1 ? "cover" : `p${n}`}.png`);
const ease = Easing.inOut(Easing.cubic);
const lerp = (t: number, a: number, b: number, v0: number, v1: number) => interpolate(t, [a, b], [v0, v1], { ...clamp, easing: ease });
const DOC: [string, string][] = [["BETREFF", "ENTSCHÄDIGUNG EU 261"], ["FLUG", "TENERIFFA → KÖLN"], ["ANKUNFT", "+4:00 VERSPÄTET"], ["FORDERUNG", "400 €"], ["FRIST", "14 TAGE"]];
const SceneOutro: React.FC<{ t: number }> = ({ t }) => {
  const a = A.hol - 0.05;
  const bS = A.aufgeschrieben + 0.6, cS = A.chatbot + 0.45, dS = A.schreib - 0.2;
  const fl = Math.sin(t * 2.2) * 6, rot = Math.sin(t * 1.3) * 1.2;
  // cover position per phase
  const cx = t < bS ? 320 : t < cS ? lerp(t, bS, bS + 0.4, 320, 40) : t < dS ? lerp(t, cS, cS + 0.4, 40, 330) : lerp(t, dS, dS + 0.4, 330, 60);
  const cw = t < bS ? 440 : t < cS ? lerp(t, bS, bS + 0.4, 440, 360) : t < dS ? lerp(t, cS, cS + 0.4, 360, 420) : lerp(t, dS, dS + 0.4, 420, 250);
  const cy = t < dS ? 90 : lerp(t, dS, dS + 0.4, 90, 70);
  const cr = t < bS ? interpolate(t, [a, a + 0.5], [-9, -4], clamp) : t < cS ? -6 : t < dS ? -3 : -7;
  const fan = t < cS ? 0 : t < dS ? lerp(t, cS, cS + 0.5, 0, 1) : lerp(t, dS, dS + 0.35, 1, 0);
  // doc typing
  const docIn = t > bS - 0.1 && t < cS + 0.4;
  const docX = t < cS ? lerp(t, bS - 0.1, bS + 0.3, 1100, 430) : lerp(t, cS, cS + 0.4, 430, 1150);
  const secs = Math.round(lerp(t, A.chatgpt, A.schreibt, 0, 120));
  const clock = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  const typeA = A.chatgpt, typeB = A.schreibt + 0.1, per = (typeB - typeA) / DOC.length;
  // comment + DM
  const word = typed("FLUG", t, A.schreib + 0.05, A.flug + 0.1);
  const sent = t > A.flug + 0.2;
  const dmA = A.schick - 0.25;
  const blink = Math.floor(t * 3) % 2 === 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#FFF6D6", backgroundImage: "radial-gradient(rgba(20,20,20,.10) 2px, transparent 2.5px)", backgroundSize: "28px 28px" }} />
      {/* fanned pages behind the cover */}
      {[2, 3, 4].map((n, i) => (fan <= 0.01 ? null : (
        <div key={n} style={{ position: "absolute", left: cx + 40, top: cy + 30, width: cw * 0.92, zIndex: 4, transformOrigin: "50% 100%", transform: `translate(${fan * (i + 1) * 120}px, ${fan * (i * 14)}px) rotate(${cr + fan * (6 + i * 7)}deg)`, border: `5px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, lineHeight: 0 }}>
          <Img src={PAGE(n)} style={{ width: "100%" }} />
        </div>
      )))}
      <div style={{ position: "absolute", left: cx, top: cy + fl, width: cw, zIndex: 6, transform: `rotate(${cr + rot}deg) translateY(${interpolate(t, [a, a + 0.5], [60, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)`, opacity: k(t, a, 0.25), border: `6px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, lineHeight: 0 }}>
        <Img src={PAGE(1)} style={{ width: "100%" }} />
      </div>
      {t > A.aufgeschrieben - 0.1 && t < bS + 0.3 ? <PxBox bg={GOLD} size={22} style={{ left: 40, top: 700, transform: `rotate(-3deg) translateY(${fl * 0.5}px)`, ...popStyle(t, A.aufgeschrieben - 0.1, 10, 0.5) }}>AUFGESCHRIEBEN</PxBox> : null}
      {/* the letter types itself */}
      {docIn ? (
        <div style={{ position: "absolute", left: docX, top: 120 + fl * 0.4, width: 600, zIndex: 8, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: INK, padding: "14px 16px 10px" }}>
            <span style={{ fontFamily: PX, fontSize: 16, color: "#FFF" }}>ANTRAG AN DIE AIRLINE</span>
            <span style={{ fontFamily: PX, fontSize: 16, color: INK, background: GOLD, padding: "8px 10px 4px" }}>{clock}</span>
          </div>
          <div style={{ padding: "18px 20px 16px" }}>
            {DOC.map(([kk, v], i) => {
              const s0 = typeA + i * per;
              if (t < s0) return <div key={i} style={{ height: 58 }} />;
              const hot = i === 3;
              return (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "baseline", height: 58, borderBottom: "3px dashed #C9C2B0", fontFamily: PX }}>
                  <span style={{ fontSize: 13, color: "#8A857A", width: 150 }}>{kk}</span>
                  <span style={{ fontSize: 19, color: hot ? "#FFF" : INK, background: hot ? GREEN : "transparent", padding: hot ? "8px 8px 4px" : 0 }}>{typed(v, t, s0, s0 + per * 0.8)}</span>
                </div>
              );
            })}
            {t < typeB && blink ? <div style={{ width: 16, height: 26, background: INK, marginTop: 8 }} /> : null}
          </div>
          {t > A.chatgpt - 0.1 ? <PxBox bg="#FFF" size={15} style={{ left: -20, top: -46, ...popStyle(t, A.chatgpt - 0.1, 8, 0.5) }}>CHATGPT SCHREIBT</PxBox> : null}
          {t > A.ohne - 0.1 ? (
            <div style={{ position: "absolute", right: -26, bottom: -60, zIndex: 9, ...popStyle(t, A.ohne - 0.1, 14, 0.4) }}>
              <div style={{ position: "relative", background: "#FFF", border: `5px solid ${INK}`, padding: 10, boxShadow: `6px 6px 0 ${INK}` }}>
                <Sprite rows={ROBOT.rows} pal={ROBOT.pal} px={8} />
                {t > A.chatbot - 0.05 ? <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 12, background: RED, transform: `rotate(-35deg) scaleX(${pop(t, A.chatbot - 0.05, 0.2)})` }} /> : null}
              </div>
            </div>
          ) : null}
          {t > A.chatbot - 0.05 ? <Stamp t={t} a={A.chatbot - 0.05} text="OHNE CHATBOT" bg={RED} color="#FFF" size={24} rot={-5} style={{ left: 40, bottom: -50 }} /> : null}
        </div>
      ) : null}
      {/* up to 600 € per person */}
      {t > A.n600 - 0.1 && t < dS + 0.2 ? (
        <>
          <PxBox bg={GOLD} size={44} style={{ left: 40, top: 640, transform: `rotate(-3deg) scale(${1 + 0.12 * Math.max(0, 1 - Math.abs(t - A.n600 - 0.1) / 0.2)}) translateY(${fl * 0.4}px)`, ...popStyle(t, A.n600 - 0.1, 12, 0.5) }}>BIS 600 €</PxBox>
          {t > A.person - 0.1 ? <PxBox bg={INK} color="#FFF" size={20} style={{ left: 70, top: 790, ...popStyle(t, A.person - 0.1, 8, 0.5) }}>PRO PERSON</PxBox> : null}
          {spark(t, A.n600, 220, 690, 12, 60, 220)}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const u = (t - A.n600 - i * 0.12) / 0.9;
            return u <= 0 || u >= 1 ? null : <div key={i} style={{ position: "absolute", left: 470 + i * 90, top: -40 + u * 900, zIndex: 3, transform: `rotate(${u * 180}deg)` }}><Sprite rows={COIN.rows} pal={COIN.pal} px={12} /></div>;
          })}
        </>
      ) : null}
      {/* comment field: FLUG typed + sent */}
      {t > dS ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: 150 + fl * 0.3, zIndex: 9, ...popStyle(t, dS, 20, 0.6) }}>
          <div style={{ fontFamily: PX, fontSize: 18, color: INK, marginBottom: 16 }}>KOMMENTARE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "16px 18px" }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: BLUE, border: `4px solid ${INK}`, flexShrink: 0 }} />
            <div style={{ flex: 1, fontFamily: PX, fontSize: 30, color: INK }}>{sent ? "" : word}{!sent && blink ? "▌" : ""}{sent ? <span style={{ color: "#B0AA9E", fontSize: 18 }}>KOMMENTAR …</span> : null}</div>
            <div style={{ fontFamily: PX, fontSize: 16, color: "#FFF", background: word.length === 4 ? BLUE : "#9AA3AD", padding: "12px 12px 8px", transform: `scale(${1 - 0.15 * Math.max(0, 1 - Math.abs(t - A.flug - 0.15) / 0.1)})` }}>POSTEN</div>
          </div>
          {sent ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, ...popStyle(t, A.flug + 0.2, 12, 0.6) }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: BLUE, border: `4px solid ${INK}` }} />
              <div style={{ fontFamily: PX, fontSize: 24, color: INK, background: "#FFF", border: `5px solid ${INK}`, padding: "14px 16px 8px" }}>FLUG</div>
              <div style={{ fontFamily: PX, fontSize: 14, color: GREEN }}>✓ GEPOSTET</div>
            </div>
          ) : null}
        </div>
      ) : null}
      {/* DM with the PDF */}
      {t > dmA ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: lerp(t, dmA, dmA + 0.35, 980, 470) + fl * 0.5, zIndex: 10, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${GOLD}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: INK, padding: "12px 16px" }}>
            <i style={{ width: 14, height: 14, borderRadius: "50%", background: GOLD, display: "block" }} />
            <span style={{ fontFamily: SM, fontWeight: 700, fontSize: 24, color: "#FFF" }}>Florent GPT</span>
            <span style={{ marginLeft: "auto", fontFamily: PX, fontSize: 12, color: GOLD }}>NEUE NACHRICHT</span>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", padding: 18 }}>
            <div style={{ width: 92, border: `4px solid ${INK}`, lineHeight: 0, flexShrink: 0, transform: `rotate(${Math.sin(t * 3) * 3}deg)` }}><Img src={PAGE(1)} style={{ width: "100%" }} /></div>
            <div style={{ fontFamily: PX, lineHeight: 1.5 }}>
              <div style={{ fontSize: 18, color: INK }}>FLUG-GUIDE.PDF</div>
              <div style={{ fontSize: 13, color: "#8A857A", marginTop: 6 }}>6 SEITEN · BIS 600 €</div>
              <div style={{ display: "inline-block", fontSize: 14, color: INK, background: GOLD, border: `4px solid ${INK}`, padding: "8px 10px 4px", marginTop: 10, transform: `scale(${1 + 0.06 * Math.abs(Math.sin(t * 5))})` }}>ÖFFNEN</div>
            </div>
          </div>
          {spark(t, dmA + 0.35, 350, 120, 10, 40, 170)}
        </div>
      ) : null}
      {t > A.schreib - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 745, display: "flex", justifyContent: "center", zIndex: 11, ...popStyle(t, A.schreib - 0.1, 10, 0.7) }}>
          <div style={{ fontFamily: SM, fontWeight: 700, fontSize: 32, letterSpacing: "0.08em", color: "#FFF", background: INK, borderRadius: 999, padding: "12px 32px", transform: `scale(${1 + 0.03 * Math.sin(t * 6)})` }}>SCHREIB <span style={{ color: GOLD }}>„FLUG“</span></div>
        </div>
      ) : null}
    </>
  );
};

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; tag?: [number, string]; bg?: string };
const SCENES: Scene[] = [
  { from: 0, to: A.nicht - 0.1, El: SceneHook, pill: "Dein Kumpel", tag: [A.teneriffa, "4 STD ZU SPÄT"], bg: PLATE_BG.airport },
  { from: A.nicht - 0.1, to: A.heisst - 0.05, El: SceneQueue, pill: "Warum?", bg: PLATE_BG.hall },
  { from: A.heisst - 0.05, to: A.frueher - 0.1, El: SceneTerm, pill: "Verhaltensökonomie", bg: PLATE_BG.dark },
  { from: A.frueher - 0.1, to: A.kumpel1 - 0.1, El: SceneBot, pill: "Früher · Heute", bg: PLATE_BG.hall },
  { from: A.kumpel1 - 0.1, to: A.find - 0.1, El: SceneLoop, pill: "Dein Kumpel", bg: PLATE_BG.hall },
  { from: A.find - 0.1, to: A.fuenf - 0.05, El: SceneRate, pill: "Meine Meinung", bg: PLATE_BG.hall },
  { from: A.fuenf - 0.05, to: A.hol - 0.1 },
  { from: A.hol - 0.1, to: 999, El: SceneOutro, pill: "Gegenmittel #2", bg: "#FFF6D6" },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["kumpel", "teneriffa", "nichts", "recht", "supportwarteschlange", "sludge", "mühsam", "aufgibst", "formular", "kichatbot", "freundlich", "nie", "entschädigung", "gepäck", "auf", "genial", "fünf", "sterne", "nett", "geld", "chatgpt", "chatbot", "flug"]);
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
// on-screen spelling: numbers as digits
const SHOW: Record<string, string> = { vierhundert: "400 €", sechshundert: "600 €", vierzehn: "14", dreimal: "3×", fünf: "5", zwei: "2" };
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

export const SludgePixel: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-gpts-sludge-flug-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
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
