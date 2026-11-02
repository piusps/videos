import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-fitness/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "Preis pro Training" (Selbstüberschätzung, 2026-10-26) im Pixel-Niklas-Look wie PopcornPixel:
// oben 960 px Pixelwelt, unten der Avatar, Space-Mono-Untertitel auf der Kante.
// Beleg: DellaVigna & Malmendier 2006 (AER), 7.752 Mitglieder, Abo 70+ $ → 4,3 Besuche → 17+ $ pro Besuch, Zehnerkarte 10 $.
// Pointe ab "Ich war einmal da. Zum Duschen." ruhig auf dem Gesicht.

const W = 1080, H = 1920, PH = 960;
const GOLD = "#FFC83D", INK = "#141414", RED = "#D8463A", GREEN = "#4C9A5A", BLUE = "#3E7CC9";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
const END = CAPS[CAPS.length - 1].endMs / 1000;
export const FT_FRAMES = Math.round((END + 0.8) * 25);
const iWar = CAPS.map((c, i) => [c, i] as const).filter(([c]) => c.text.toLowerCase().replace(/[^a-z]/g, "") === "war").slice(-1)[0][1];
export const A = {
  kumpel0: at("kumpel", 0), spendet: at("spendet"), jahres: at("jahresvertrag"), vierzig: at("vierzig"),
  oekonomen: at("ökonomen"), achttausend: at("achttausend"), siebzig: at("siebzig"), viermal: at("viermal"), siebzehn: at("siebzehn"), zehnerkarte: at("zehnerkarte"),
  heisst: at("heißt"), selbst: at("selbstüberschätzung"), vertrag: at("vertrag"), naechsten: at("nächsten"), heute: at("heute"),
  kumpel1: at("kumpel", 1), februar: at("februar"), achtmal: at("achtmal"), maerz: at("märz"), zweimal: at("zweimal"), mai: at("mai"), gruppe: at("gruppe"), montag: at("montag"),
  meine: at("meine"), ki: at("ki"), n89: at("neunundachtzig"),
  face: CAPS[iWar - 1].startMs / 1000,
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
const PLATES = { gym: drawGym(), gymDark: drawGym(true), room: drawRoom() };
const Plate = React.memo<{ id: keyof typeof PLATES }>(({ id }) => (
  <svg width={W + 48} height={PH + 48} viewBox="0 0 180 160" preserveAspectRatio="none" shapeRendering="crispEdges" style={{ position: "absolute", left: -24, top: -24 }}>
    {PLATES[id].map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w + 0.02} height={h + 0.02} fill={c} />)}
  </svg>
));
const PLATE_BG = { gym: "#D8DCE2", gymDark: "#2A2F38", room: "#E9DFF0" };

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
const DUMBBELL = { rows: ["KK......KK", "KGK....KGK", "KGKKKKKKGK", "KGKSSSSKGK", "KGKKKKKKGK", "KGK....KGK", "KK......KK"], pal: { K: INK, G: "#5A6270", S: "#C9D1DA" } };
const COUCH = { rows: ["..PPPPPPPPPPPPPPPP..", ".PppppppppppppppppP.", "PPppppppppppppppppPP", "PPPPPPPPPPPPPPPPPPPP", "PpPPPPPPPPPPPPPPPPpP", "PPPPPPPPPPPPPPPPPPPP", ".KK..............KK."], pal: { P: "#7A5AA8", p: "#9478C2", K: INK } };
const CARD = { rows: ["KKKKKKKKKKKK", "KGGGGGGGGGGK", "KGWWWWGGGGGK", "KGGGGGGGGGGK", "KGGGWWWWWWGK", "KKKKKKKKKKKK"], pal: { K: INK, G: GOLD, W: "#FFF6D0" } };

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
// 1 · Hook (v2, Pius 26.10.): "Sein Gym-Abo ist eine Spende." readable on frame 0, buddy with the annual contract, donation receipt, 40 € per training
const SceneHook: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="gym" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 104, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, zIndex: 10 }}>
      <div style={{ fontFamily: PX, fontSize: 40, color: "#FFF", background: INK, padding: "22px 26px 14px", boxShadow: `6px 6px 0 rgba(0,0,0,.35)`, transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - 0.2) / 0.2)})` }}>SEIN GYM-ABO</div>
      <div style={{ fontFamily: PX, fontSize: 36, color: INK, background: GOLD, border: `6px solid ${INK}`, padding: "18px 22px 10px", boxShadow: `6px 6px 0 ${INK}`, transform: `rotate(${t > A.spendet ? -3 : 0}deg) scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - A.spendet) / 0.18)})` }}>IST EINE SPENDE.</div>
    </div>
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 90 + i * 70, top: 640 - 7 * 9, zIndex: 5, ...popStyle(t, 0.1 + i * 0.1, 16, 0.5) }}><Sprite rows={DUMBBELL.rows} pal={DUMBBELL.pal} px={9} /></div>)}
    <Person t={t} who="kumpel" x={110} y={360} px={11} a={0.15} />
    {t > A.jahres - 0.05 ? <div style={{ position: "absolute", left: 70, top: 300, zIndex: 9, ...popStyle(t, A.jahres - 0.05, 12, 0.5) }}><PxBox bg="#FFF" size={18} style={{ position: "relative" }}>JAHRESVERTRAG</PxBox></div> : null}
    <Paper t={t} a={A.spendet - 0.05} x={440} y={330} w={560} title="SPENDENQUITTUNG" lines={[[A.spendet + 0.2, "BEITRAG", "40 €"], [A.spendet + 0.45, "TRAININGS", "1"], [A.vierzig, "PRO TRAINING", "40 €", true]]} size={22} />
    {t > A.spendet ? spark(t, A.spendet, 720, 380, 8, 50, 150) : null}
    {t > A.vierzig ? spark(t, A.vierzig, 900, 640, 10, 50, 170) : null}
  </>
);

// 2 · The study: ~8,000 members, 70+ $ a month, 4 visits → 17+ $ per training vs 10 $ with the 10-visit pass
const Crowd: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <>{Array.from({ length: 20 }, (_, i) => {
    const d = a + ((i * 7) % 20) * 0.025;
    return t < d ? null : <div key={i} style={{ position: "absolute", left: 120 + (i % 10) * 84, top: 150 + Math.floor(i / 10) * 112, zIndex: 4, ...popStyle(t, d, 10, 0.4) }}><Sprite rows={NK} pal={PAL[i % 3 === 0 ? "sport" : i % 3 === 1 ? "kumpel" : "niklas"]} px={4} /></div>;
  })}</>
);
const Visits: React.FC<{ t: number; a: number; x: number; y: number }> = ({ t, a, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 8, zIndex: 8 }}>
    {Array.from({ length: 10 }, (_, i) => {
      const on = i < 4 && t > a + i * 0.08;
      return <div key={i} style={{ width: 30, height: 30, border: `4px solid ${INK}`, background: on ? GREEN : "#FFFDF6", transform: on ? `scale(${0.7 + 0.3 * pop(t, a + i * 0.08, 0.25)})` : undefined }} />;
    })}
  </div>
);
const SceneStudy: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="gym" />
    {t > A.achttausend - 0.1 ? <Crowd t={t} a={A.achttausend - 0.1} /> : <Person t={t} who="prof" x={190} y={190} px={9} a={A.oekonomen - 0.05} style={{ opacity: t > A.achttausend - 0.15 ? 0 : 1 }} />}
    {t > A.oekonomen - 0.05 && t < A.achttausend - 0.1 ? <Person t={t} who="prof" x={720} y={190} px={9} flip a={A.oekonomen + 0.05} /> : null}
    {t > A.achttausend - 0.05 ? <PxBox bg={INK} color="#FFF" size={22} style={{ left: 300, top: 400, ...popStyle(t, A.achttausend, 10, 0.5) }}>~8.000 MITGLIEDER</PxBox> : null}
    {t > A.siebzig - 0.05 ? (
      <div style={{ position: "absolute", left: 50, top: 460, width: 560, height: 290, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, zIndex: 7, ...popStyle(t, A.siebzig - 0.05, 16, 0.6) }}>
        <div style={{ fontFamily: PX, fontSize: 22, color: "#FFF", background: BLUE, padding: "14px 16px 10px" }}>ABO · 70+ $ / MONAT</div>
        <div style={{ fontFamily: PX, fontSize: 16, color: INK, margin: "22px 0 0 22px" }}>BESUCHE IM MONAT</div>
        <Visits t={t} a={A.viermal - 0.1} x={22} y={120} />
        {t > A.siebzehn - 0.05 ? <div style={{ position: "absolute", left: 22, top: 190, fontFamily: PX, fontSize: 34, color: "#FFF", background: RED, padding: "16px 16px 10px", ...popStyle(t, A.siebzehn - 0.05, 8, 0.5), transform: `scale(${1 + 0.1 * Math.max(0, 1 - Math.abs(t - A.siebzehn - 0.1) / 0.2)})` }}>17+ $ / TRAINING</div> : null}
      </div>
    ) : null}
    {t > A.zehnerkarte - 0.05 ? (
      <div style={{ position: "absolute", left: 660, top: 520, zIndex: 8, ...popStyle(t, A.zehnerkarte - 0.05, 16, 0.6) }}>
        <Sprite rows={CARD.rows} pal={CARD.pal} px={22} />
        <PxBox bg={GREEN} color="#FFF" size={22} style={{ left: 10, top: 160 }}>10ER-KARTE</PxBox>
        <PxBox bg="#FFF" size={30} style={{ left: 30, top: 240, transform: "rotate(-4deg)" }}>10 $</PxBox>
      </div>
    ) : null}
    {t > A.zehnerkarte ? spark(t, A.zehnerkarte + 0.1, 790, 600, 10, 60, 190, GREEN) : null}
    <PxBox bg={INK} color="#FFF" size={16} shadow={false} style={{ left: 40, bottom: 84, ...popStyle(t, A.oekonomen, 10, 0.5) }}>DELLAVIGNA & MALMENDIER · USA</PxBox>
  </>
);

// 3 · The term: "Selbstüberschätzung" typed; the future you signs, the today you lies on the couch
const SceneTerm: React.FC<{ t: number }> = ({ t }) => {
  const l1 = typed("SELBST-", t, A.selbst - 0.15, A.selbst + 0.15);
  const l2 = typed("ÜBERSCHÄTZUNG", t, A.selbst + 0.1, A.selbst + 0.6);
  const lift = Math.abs(Math.sin(t * 5)) * 24;
  return (
    <>
      <Plate id="gymDark" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 50, lineHeight: 1.3, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "24px 30px 14px", boxShadow: `0 8px 0 #6B4528`, textAlign: "center", ...popStyle(t, A.heisst, 16, 0.7) }}>
          {l1}<span style={{ opacity: 0 }}>{"SELBST-".slice(l1.length)}</span><br />{l2}<span style={{ opacity: 0 }}>{"ÜBERSCHÄTZUNG".slice(l2.length)}</span>
        </div>
      </div>
      {t > A.vertrag - 0.05 ? (
        <>
          <Person t={t} who="sport" x={110} y={430} px={12} a={A.vertrag - 0.05} bob={0} />
          <div style={{ position: "absolute", left: 60, top: 470 - lift, zIndex: 6 }}><Sprite rows={DUMBBELL.rows} pal={DUMBBELL.pal} px={8} /></div>
          <div style={{ position: "absolute", left: 220, top: 470 - lift, zIndex: 6 }}><Sprite rows={DUMBBELL.rows} pal={DUMBBELL.pal} px={8} /></div>
          <PxBox bg={GOLD} size={18} style={{ left: 60, top: 370, ...popStyle(t, A.naechsten - 0.05, 10, 0.5) }}>DU NÄCHSTEN MONAT</PxBox>
          {spark(t, A.naechsten, 200, 600, 8, 40, 150)}
        </>
      ) : null}
      {t > A.heute - 0.1 ? (
        <>
          <div style={{ position: "absolute", left: 580, top: 690, zIndex: 5, ...popStyle(t, A.heute - 0.1, 16, 0.5) }}><Sprite rows={COUCH.rows} pal={COUCH.pal} px={20} /></div>
          <div style={{ position: "absolute", left: 640, top: 600, zIndex: 6, transform: "rotate(-90deg)", transformOrigin: "50% 50%", ...popStyle(t, A.heute, 10, 0.5) }}><Sprite rows={NK} pal={PAL.kumpel} px={7} /></div>
          <PxBox bg="#FFF" size={18} style={{ left: 640, top: 520, ...popStyle(t, A.heute, 10, 0.5) }}>DU HEUTE</PxBox>
          {["Z", "z", "z"].map((z, i) => <div key={i} style={{ position: "absolute", left: 900 + i * 34, top: 600 - i * 46 - ((t * 30) % 20), fontFamily: PX, fontSize: 30 - i * 4, color: "#FFF", opacity: t > A.heute + 0.2 + i * 0.15 ? 1 : 0, zIndex: 9 }}>{z}</div>)}
        </>
      ) : null}
    </>
  );
};

// 4 · The buddy's months: Feb 8, März 2, then only "ab Montag wieder" in the group chat
const MONTHS: [string, number, keyof typeof A | null][] = [["FEB", 8, "februar"], ["MÄR", 2, "maerz"], ["APR", 0, "mai"], ["MAI", 0, "mai"]];
const SceneMonths: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="room" />
    <Person t={t} who="kumpel" x={60} y={330} px={11} a={A.kumpel1 - 0.1} />
    <div style={{ position: "absolute", left: 300, top: 150, width: 330, height: 520, zIndex: 6 }}>
      {MONTHS.map(([m, v, key], i) => {
        const a = key ? A[key] : 0;
        const on = t > a - 0.05;
        const h = on ? v * 48 * Math.min(1, pop(t, a - 0.05, 0.35)) : 0;
        return (
          <div key={m} style={{ position: "absolute", left: i * 82, bottom: 0, width: 66, display: "flex", flexDirection: "column", alignItems: "center", opacity: on ? 1 : 0.25 }}>
            {on && v > 0 ? <div style={{ fontFamily: PX, fontSize: 26, color: INK, marginBottom: 8 }}>{v}×</div> : null}
            <div style={{ width: 66, height: Math.max(6, h), background: v >= 8 ? GREEN : v > 0 ? RED : "#9AA3AD", border: `5px solid ${INK}` }} />
            <div style={{ fontFamily: PX, fontSize: 16, color: INK, marginTop: 10 }}>{m}</div>
          </div>
        );
      })}
    </div>
    {[0, 1, 2].map((i) => <Bubble key={i} t={t} a={A.gruppe + i * 0.42} text={i === 2 ? "AB MONTAG WIEDER!!" : "AB MONTAG WIEDER!"} x={650 - i * 30} y={190 + i * 150} tail="l" size={i === 2 ? 22 : 18} type={0.3} bg={i === 2 ? GOLD : "#FFFFFF"} />)}
    {t > A.gruppe - 0.05 ? <PxBox bg={INK} color="#FFF" size={14} shadow={false} style={{ left: 660, top: 140, ...popStyle(t, A.gruppe - 0.05, 8, 0.5) }}>GRUPPE · JUNGS</PxBox> : null}
  </>
);

// 5 · "Meine KI rechnet mir das aus": monthly report, 89 € per training
const SceneKi: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="gym" />
    <Person t={t} who="niklas" x={110} y={340} px={12} a={A.meine - 0.1} />
    <Paper t={t} a={A.ki - 0.05} x={430} y={150} w={590} title="KI · MONATSBERICHT" lines={[[A.ki + 0.3, "BEITRAG", "89 €"], [A.ki + 0.6, "TRAININGS", "1"], [A.n89, "PRO TRAINING", "89 €", true]]} size={22} />
    {t > A.n89 ? spark(t, A.n89 + 0.05, 860, 560, 10, 50, 170, RED) : null}
  </>
);

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; tag?: [number, string]; bg?: string };
const SCENES: Scene[] = [
  { from: 0, to: A.oekonomen - 0.25, El: SceneHook, pill: "Geld · Gym", tag: [A.vierzig, "40 € / MAL"], bg: PLATE_BG.gym },
  { from: A.oekonomen - 0.25, to: A.heisst - 0.05, El: SceneStudy, pill: "Echte Studie", tag: [A.siebzehn, "17+ $ / MAL"], bg: PLATE_BG.gym },
  { from: A.heisst - 0.05, to: A.kumpel1 - 0.1, El: SceneTerm, pill: "Psychologie", bg: PLATE_BG.gymDark },
  { from: A.kumpel1 - 0.1, to: A.meine - 0.1, El: SceneMonths, pill: "Dein Kumpel", tag: [A.gruppe, "SEIT MAI"], bg: PLATE_BG.room },
  { from: A.meine - 0.1, to: A.face - 0.05, El: SceneKi, pill: "Meine KI", bg: PLATE_BG.gym },
  { from: A.face - 0.05, to: 999 },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["spendet", "gym", "training", "kumpel", "jahresvertrag", "vierzig", "ökonomen", "achttausend", "siebzig", "viermal", "siebzehn", "zehnerkarte", "zehn", "selbstüberschätzung", "nächsten", "heute", "februar", "achtmal", "zweimal", "montag", "ki", "neunundachtzig"]);
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
// on-screen spelling: numbers as digits
const SHOW: Record<string, string> = { vierzig: "40", achttausend: "8.000", siebzig: "70", siebzehn: "17", zehn: "10", zehnerkarte: "10er-Karte", viermal: "4-mal", achtmal: "8-mal", zweimal: "2-mal", neunundachtzig: "89" };
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

export const FitnessPixel: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-gpts-fitness-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
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
