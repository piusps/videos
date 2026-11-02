import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPixel } from "@remotion/google-fonts/Silkscreen";
import { PixelBot, BotProp } from "../components/PixelBot";
import { BrandLogo } from "../components/BrandMarks";
import { colors, fonts } from "../theme";
import captions from "../../runs/vision-schwarm/captions.json";

// Superkind vision film "Schwarm", v3 after Henri's feedback (2026-10-20):
// - calm ElevenLabs piano bed far in the background instead of Tame Impala, softer SFX
// - a real 1950 Philips CRT (Wikimedia, CC BY 3.0, logo retouched) with Niklas pre-graded as a real
//   black-and-white tube picture (bulge, bloom, grain, scanlines: public/vision-schwarm/tv-niklas.mp4)
// - the whole KI part in the FP-N Arena/Belege style: pixel world, own pixel figures (PixelBot agents,
//   pixel employees), Silkscreen counters, white cards on the off-white grid
// - image film footage graded like film inside a pixel-art frame with bots sitting on it (less corporate)
// - FP-style captions (orange mono pill, active word in a black pill)
// v2 code backed up as VisionSchwarm.v2.tsx.bak, v1 as VisionSchwarm.v1.tsx.bak.

const { fontFamily: serif } = loadInstrumentSerif("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const { fontFamily: serifItalic } = loadInstrumentSerif("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] });
loadMono("normal", { weights: ["700", "800"], subsets: ["latin", "latin-ext"] });
loadPixel("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });

const D = "vision-schwarm/";
export const VS_FPS = 25;
export const VS_SECONDS = 34.4;
const O = 0.7; // voice offset: TV switches on before Niklas speaks
const COLOR = 10.35; // first colour shot ("eigenes") — telephone filter ends here
const BREAK = 21.26; // "Was, wenn" — letterbox world ends, bright full-frame world starts
const FILM_H = 810; // 4:3, like the archive film and the old TV
const FILM_TOP = (1920 - FILM_H) / 2;
const BW = 1080, BH = FILM_H; // band size
const ACC = colors.accent;

const C = {
  bg: "#F3EFE6", grid: "rgba(0,0,0,0.045)", ink: "#151515", dim: "#8A877F", line: "#E7E4DD", card: "#FFFFFF",
  orange: "#D97757", green: "#1E9E57", greenSoft: "#E6F5EC", red: "#E5484D", redSoft: "#FDE8E8", chip: "#141414", gold: "#F5C542", blue: "#3E8EF7",
  pxDark: "#2C2420",
};
const MONO = "JetBrains Mono";
const PIXEL = "Silkscreen";
const shadow = "0 22px 48px rgba(20,20,20,0.10), 0 3px 8px rgba(20,20,20,0.06)";

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = (captions as Cap[]).map((c) => ({ ...c, s: c.startMs / 1000 + O, e: c.endMs / 1000 + O }));
const W = {
  heute: 8.46, eigenes: 10.35, aus: 11.54, agenten: 12.62, mails: 13.47, rechnungen: 14.79, angebote: 15.95,
  rund: 17.06, aber: 18.18, chaos: 20.64, kraft: 22.46, trotzdem: 23.32, griff: 24.28, ein: 25.34, gehirn: 25.6, klare: 26.58,
  direkt: 27.66, outlook: 28.27, sap: 29.04, datev: 29.42, superkind: 30.15, jeder: 30.83, sein: 32.0,
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const useSec = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
const k = (t: number, a: number, d = 0.3, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const pop = (t: number, a: number, d = 0.38) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
const popStyle = (t: number, a: number, rise = 18, from = 0.7): React.CSSProperties => {
  const p = pop(t, a);
  return { opacity: k(t, a, 0.14), transform: `translateY(${(1 - Math.min(p, 1)) * rise}px) scale(${from + (1 - from) * p})` };
};
const count = (t: number, a: number, b: number, to: number) => Math.round(to * interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }));
const de = (n: number) => n.toLocaleString("de-DE");
const seq = (a: number, b: number) => ({ from: Math.round(a * VS_FPS), durationInFrames: Math.max(1, Math.round((b - a) * VS_FPS)) });
const mixHex = (a: string, b: string, p: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) + ((((pb >> s) & 255) - ((pa >> s) & 255)) * p));
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};

// ---------- texture ----------

const Defs: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <defs>
        <filter id="vsChroma" x="-5%" y="-5%" width="110%" height="110%">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feOffset in="r" dx="4" dy="0" result="r2" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb" />
          <feOffset in="gb" dx="-3" dy="0" result="gb2" />
          <feBlend in="r2" in2="gb2" mode="screen" />
        </filter>
        <filter id="vsNoise"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 97} /><feColorMatrix type="saturate" values="0" /></filter>
      </defs>
    </svg>
  );
};
const Noise: React.FC<{ opacity: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({ opacity, blend = "overlay" }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, mixBlendMode: blend, pointerEvents: "none" }}>
    <rect width="100%" height="100%" filter="url(#vsNoise)" />
  </svg>
);
const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,${strength}) 100%)` }} />
);
const OpusBg: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden", ...style }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "60px 60px" }} />
    {children}
  </AbsoluteFill>
);
const LabelChip: React.FC<{ text: string; dot?: string; style?: React.CSSProperties; size?: number }> = ({ text, dot = ACC, style, size = 28 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.chip, color: "#FFF", fontFamily: fonts.semibold, fontSize: size, padding: `${size * 0.36}px ${size * 0.8}px ${size * 0.36}px ${size * 0.6}px`, borderRadius: 999, boxShadow: "0 10px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap", ...style }}>
    <span style={{ width: size * 0.48, height: size * 0.48, borderRadius: "50%", background: dot }} />
    {text}
  </div>
);
const Tag: React.FC<{ text: string; color: string; size?: number; style?: React.CSSProperties }> = ({ text, color, size = 18, style }) => (
  <span style={{ display: "inline-block", fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color: "#FFF", background: color, padding: `${size * 0.33}px ${size * 0.55}px ${size * 0.33}px ${size * 0.66}px`, borderRadius: 8, whiteSpace: "nowrap", ...style }}>{text}</span>
);
const Check: React.FC<{ size: number; color?: string; p?: number }> = ({ size, color = "#FFF", p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - p)} /></svg>
);
const Stamp: React.FC<{ t: number; at: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, at: a, text, color = C.red, size = 64, rot = -8, style }) => {
  if (t < a) return null;
  const p = interpolate(t, [a, a + 0.16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ position: "absolute", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: p, fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.08em", color, border: `${size * 0.09}px solid ${color}`, borderRadius: 12, padding: `${size * 0.08}px ${size * 0.3}px`, background: "rgba(255,255,255,0.9)", whiteSpace: "nowrap", ...style }}>{text}</div>;
};

// ---------- Arena-style pixel kit ----------

const PixelLabel: React.FC<{ text: string; size?: number; color?: string; bg?: string; style?: React.CSSProperties }> = ({ text, size = 26, color = "#FFF", bg = C.pxDark, style }) => (
  <div style={{ fontFamily: PIXEL, fontSize: size, color, background: bg, padding: `${size * 0.28}px ${size * 0.45}px`, border: `${Math.max(4, size * 0.14)}px solid ${C.pxDark}`, boxShadow: `0 ${size * 0.18}px 0 rgba(44,36,32,0.35)`, whiteSpace: "nowrap", lineHeight: 1, ...style }}>{text}</div>
);
const Counter: React.FC<{ label: string; value: string; t: number; bumpAt?: number[]; style?: React.CSSProperties }> = ({ label, value, t, bumpAt = [], style }) => {
  const b = bumpAt.reduce((m, a) => Math.max(m, t > a && t < a + 0.25 ? 1 - (t - a) / 0.25 : 0), 0);
  return (
    <div style={{ display: "flex", alignItems: "center", transform: `scale(${1 + 0.1 * b})`, transformOrigin: "100% 50%", ...style }}>
      <div style={{ fontFamily: PIXEL, fontSize: 26, color: C.gold, background: C.pxDark, padding: "13px 15px", border: `5px solid ${C.gold}`, borderRight: "none", whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ fontFamily: PIXEL, fontSize: 46, color: C.pxDark, background: C.gold, padding: "4px 16px", border: `5px solid ${C.gold}`, minWidth: 110, textAlign: "center", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{value}</div>
    </div>
  );
};

// our own pixel employee (11 x 18): hair H, skin S, eyes E, mouth M, shirt C, tie T, trousers P, shoes D
const PERSON = [
  "...HHHHH...", "..HHHHHHH..", "..HSSSSSH..", "..SSESESS..", "..SSSSSSS..", "...SSMSS...", "....SSS....",
  "..CCCTCCC..", ".CCCCTCCCC.", "CCCCCTCCCCC", "SCCCCTCCCCS", "S.CCCCCCC.S", "..CCCCCCC..", "..PPPPPPP..",
  "..PPP.PPP..", "..PPP.PPP..", "..PP...PP..", ".DDD...DDD.",
];
const HAIR = ["#4A3426", "#2C2420", "#C98F5E", "#7A4B26", "#E2B86B"];
const SHIRT = ["#3E8EF7", "#2FB36B", "#F2A531", "#9B5DE5", "#E5484D", "#1FB5C9", "#F25CA2", "#6C7BF2"];
const Person: React.FC<{ px: number; seed?: number; t?: number; style?: React.CSSProperties }> = ({ px, seed = 0, t = 0, style }) => {
  const pal: Record<string, string> = {
    H: HAIR[seed % HAIR.length], S: ["#F1C7A5", "#D9A27A", "#A86B45", "#F6D3B8"][seed % 4], E: "#2C2420", M: "#B5554A",
    C: SHIRT[seed % SHIRT.length], T: "#2C2420", P: "#3A3F55", D: "#2C2420",
  };
  const blink = Math.floor((t + seed * 0.41) * 10) % 41 === 0;
  return (
    <svg width={11 * px} height={18 * px} viewBox="0 0 11 18" shapeRendering="crispEdges" style={{ display: "block", overflow: "visible", ...style }}>
      {PERSON.flatMap((r, y) => r.split("").map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={ch === "E" && blink ? pal.S : pal[ch]} />)))}
    </svg>
  );
};
const RECEIPT = ["WWWWWWW..", "WLLLLWWW.", "WWWWWWWWW", "WLLLLLLLW", "WWWWWWWWW", "WLLLLLLLW", "WWWWWWWWW", "WLLLLWWWW", "WWWWWWWWW", "WWWWWWWWW", "W.W.W.W.W"];
const Receipt: React.FC<{ px: number; style?: React.CSSProperties }> = ({ px, style }) => {
  const o = Math.max(2, px * 0.5);
  return (
    <svg width={9 * px} height={11 * px} viewBox="0 0 9 11" shapeRendering="crispEdges" style={{ display: "block", filter: `drop-shadow(${o}px 0 0 ${C.pxDark}) drop-shadow(-${o}px 0 0 ${C.pxDark}) drop-shadow(0 ${o}px 0 ${C.pxDark}) drop-shadow(0 -${o}px 0 ${C.pxDark})`, ...style }}>
      {RECEIPT.flatMap((r, y) => r.split("").map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={ch === "W" ? "#FFF" : "#B9B4AC"} />)))}
    </svg>
  );
};
const Hopper: React.FC<{ t: number; seed?: number; amp?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, seed = 0, amp = 8, children, style }) => (
  <div style={{ position: "absolute", ...style }}><div style={{ transform: `translateY(${-Math.abs(Math.sin(t * 5 + seed)) * amp}px)` }}>{children}</div></div>
);

// side-view pixel world for the band (216 x 162 cells, 5 px each); night 0..1 turns day into night, red tints it for the chaos
const PixelWorld: React.FC<{ t: number; night?: number; red?: number }> = ({ t, night = 0, red = 0 }) => {
  const n = night;
  const col = (day: string, nite: string) => mixHex(day, nite, n);
  const grass: React.ReactNode[] = [];
  for (let i = 0; i < 260; i++) {
    const x = Math.floor(rnd(i * 3 + 1) * 216), y = 112 + Math.floor(rnd(i * 3 + 2) * 50);
    if (y >= 127 && y <= 138) continue;
    grass.push(<rect key={`g${i}`} x={x} y={y} width={1} height={rnd(i) > 0.6 ? 2 : 1} fill={rnd(i * 7) > 0.5 ? col("#69B05A", "#244A2B") : col("#93D27F", "#2F5C36")} />);
  }
  const buildings = Array.from({ length: 11 }, (_, i) => ({ x: i * 20 - 4 + Math.floor(rnd(i + 40) * 6), w: 14 + Math.floor(rnd(i + 50) * 6), h: 22 + Math.floor(rnd(i + 60) * 30) }));
  const moonY = 60 - 40 * n, sunY = 18 + 60 * n;
  return (
    <svg width={BW} height={BH} viewBox="0 0 216 162" shapeRendering="crispEdges" style={{ position: "absolute", inset: 0 }}>
      <rect x={0} y={0} width={216} height={112} fill={col("#BFE6F5", "#1B2340")} />
      <rect x={0} y={0} width={216} height={34} fill={col("#A9DCF0", "#141A33")} />
      {n > 0.2 && Array.from({ length: 40 }).map((_, i) => <rect key={`s${i}`} x={Math.floor(rnd(i + 3) * 216)} y={Math.floor(rnd(i + 70) * 70)} width={1} height={1} fill="#FFF" opacity={(n - 0.2) * (0.5 + 0.5 * Math.sin(t * 6 + i))} />)}
      <g opacity={1 - n}><rect x={170} y={sunY} width={10} height={10} fill="#FFE58A" /><rect x={168} y={sunY + 2} width={14} height={6} fill="#FFE58A" /></g>
      <g opacity={n}><rect x={30} y={moonY} width={9} height={9} fill="#F4F1E6" /><rect x={33} y={moonY} width={6} height={6} fill={moonY < 34 ? col("#A9DCF0", "#141A33") : col("#BFE6F5", "#1B2340")} /></g>
      {n < 0.6 && [0, 1, 2].map((i) => { const x = ((40 + i * 80 + t * (3 + i)) % 250) - 30; return <g key={`c${i}`} opacity={1 - n / 0.6}><rect x={x} y={14 + i * 9} width={22} height={5} fill="#FFF" /><rect x={x + 4} y={11 + i * 9} width={12} height={3} fill="#FFF" /></g>; })}
      {buildings.map((b, i) => (
        <g key={`b${i}`}>
          <rect x={b.x} y={106 - b.h} width={b.w} height={b.h} fill={col(i % 2 ? "#C9C3B8" : "#B8B2A7", i % 2 ? "#323850" : "#2A2F45")} />
          {Array.from({ length: Math.floor((b.h - 6) / 6) * Math.floor((b.w - 4) / 4) }).map((_, j) => {
            const cols = Math.floor((b.w - 4) / 4);
            const wx = b.x + 3 + (j % cols) * 4, wy = 106 - b.h + 4 + Math.floor(j / cols) * 6;
            const lit = n > 0.3 && rnd(i * 31 + j) < 0.2 + 0.6 * n;
            return <rect key={j} x={wx} y={wy} width={2} height={3} fill={lit ? "#FFE58A" : col("#E8E4DC", "#3E4560")} />;
          })}
        </g>
      ))}
      <rect x={0} y={104} width={216} height={10} fill={col("#A8D99A", "#2B5233")} />
      <rect x={0} y={112} width={216} height={50} fill={col("#7CC36E", "#29502F")} />
      {grass}
      <rect x={0} y={128} width={216} height={10} fill={col("#E8C88A", "#5E5038")} />
      <rect x={0} y={128} width={216} height={1} fill={col("#D2AE6C", "#4A3F2C")} />
      {red > 0 && <rect x={0} y={0} width={216} height={162} fill="#C41E2A" opacity={red * 0.38} />}
    </svg>
  );
};
const GrassField: React.FC = () => (
  <svg width={BW} height={BH} viewBox="0 0 216 162" shapeRendering="crispEdges" style={{ position: "absolute", inset: 0 }}>
    <rect width={216} height={162} fill="#7CC36E" />
    {Array.from({ length: 420 }).map((_, i) => (
      <rect key={i} x={Math.floor(rnd(i * 5 + 1) * 216)} y={Math.floor(rnd(i * 5 + 2) * 162)} width={1} height={rnd(i * 5 + 3) > 0.6 ? 2 : 1} fill={rnd(i * 5 + 4) > 0.5 ? "#69B05A" : "#93D27F"} />
    ))}
    {Array.from({ length: 26 }).map((_, i) => (
      <rect key={`f${i}`} x={Math.floor(rnd(i + 900) * 216)} y={Math.floor(rnd(i + 950) * 162)} width={1} height={1} fill={["#FFF", "#FFE58A", "#F25CA2"][i % 3]} />
    ))}
  </svg>
);

// ---------- 1952: a real 1950 Philips CRT with Niklas in black & white ----------

// tv-frame.png = photo (2000 x 1333) with the screen cut out; screen bbox in the photo:
const TVS = { x: 626, y: 258, w: 685, h: 694, cx: 968.5, cy: 605 };
const TvScreenPic: React.FC<{ at: number; t: number; w: number; h: number }> = ({ at, t, w, h }) => {
  const f = useCurrentFrame();
  const jx = (rnd(f * 1.7) - 0.5) * 2 + Math.sin(t * 9) * 0.8;
  const jy = (rnd(f * 3.3) - 0.5) * 2 + Math.sin(t * 2.3) * 1.5;
  const hop = rnd(Math.floor(t * 3) + at * 10) > 0.9 ? (rnd(f) - 0.5) * 10 : 0; // the odd vertical-hold hop
  const flick = 0.95 + 0.05 * rnd(f * 0.9);
  return (
    <AbsoluteFill style={{ background: "#1a1b1a", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(D + "tv-niklas.mp4")} muted startFrom={Math.max(0, Math.round((at - O) * VS_FPS))}
        style={{ position: "absolute", left: -0.03 * w + jx, top: -0.03 * h + jy + hop, width: w * 1.06, height: h * 1.06, objectFit: "cover", filter: `brightness(${flick})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: ((t * 140) % (h + 160)) - 80, height: 70, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.07), transparent)" }} />
    </AbsoluteFill>
  );
};
// at: timeline start; s0/s1 = photo scale at start/end; the screen centre sits at (x, y) in the band
const TvShot: React.FC<{ at: number; dur: number; s0: number; s1: number; y?: number; powerOn?: boolean }> = ({ at, dur, s0, s1, y = BH / 2, powerOn }) => {
  const s = useSec();
  const t = s + at;
  const S = s0 + (s1 - s0) * interpolate(s, [0, dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const L = BW / 2 - TVS.cx * S, T = y - TVS.cy * S;
  const sx = L + TVS.x * S - 4, sy = T + TVS.y * S - 4, sw = TVS.w * S + 8, sh = TVS.h * S + 8;
  const u = powerOn ? s : 9;
  const phase = u < 0.28 ? "off" : u < 0.62 ? "warm" : "pic";
  const warm = k(u, 0.28, 0.3, Easing.out(Easing.quad));
  const glow = phase === "off" ? 0 : phase === "warm" ? 0.35 * warm : 0.22;
  return (
    <AbsoluteFill style={{ background: "#0b0b0c", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: sx, top: sy, width: sw, height: sh, overflow: "hidden", background: "#262826" }}>
        {phase === "warm" && (
          <AbsoluteFill style={{ background: "#2a2c2a" }}>
            <Noise opacity={0.5 * warm} blend="screen" />
            <div style={{ position: "absolute", left: 0, right: 0, top: sh / 2 - (sh / 2) * warm * warm - 3, height: 6 + sh * warm * warm, background: `rgba(235,240,238,${0.9 - 0.5 * warm})`, filter: "blur(6px)" }} />
          </AbsoluteFill>
        )}
        {phase === "pic" && <TvScreenPic at={Math.max(at, at + 0.62 * (powerOn ? 1 : 0))} t={t} w={sw} h={sh} />}
      </div>
      {/* the photo's own glass reflections on top of the picture */}
      <Img src={staticFile(D + "tv7/tv-glass.png")} style={{ position: "absolute", left: L, top: T, width: 2000 * S, height: 1333 * S, mixBlendMode: "screen", opacity: 0.42 }} />
      <Img src={staticFile(D + "tv7/tv-frame.png")} style={{ position: "absolute", left: L, top: T, width: 2000 * S, height: 1333 * S, filter: "saturate(0.72) brightness(0.86) contrast(1.06)" }} />
      {/* light from the tube spilling onto the bezel and the wood */}
      <div style={{ position: "absolute", left: sx - 160 * S, top: sy - 140 * S, width: sw + 320 * S, height: sh + 280 * S, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(225,232,235,${glow}) 0%, transparent 62%)`, mixBlendMode: "screen", pointerEvents: "none" }} />
      <Noise opacity={0.14} />
      <Vignette strength={0.72} />
    </AbsoluteFill>
  );
};

const Archive: React.FC<{ src: string; from?: number; dur: number }> = ({ src, from = 0, dur }) => {
  const s = useSec();
  const f = useCurrentFrame();
  const push = 1.06 + 0.06 * (s / dur);
  const weaveX = (rnd(f * 3.1) - 0.5) * 3, weaveY = (rnd(f * 7.7) - 0.5) * 4;
  const flick = 0.9 + 0.1 * rnd(f * 1.3);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(D + "archiv/" + src + ".mp4")} muted startFrom={Math.round(from * VS_FPS)}
        style={{ position: "absolute", width: 1080, height: 810, left: 0, top: (FILM_H - 810) / 2, objectFit: "cover", transform: `translate(${weaveX}px, ${weaveY}px) scale(${push})`, filter: `grayscale(1) sepia(0.18) contrast(1.22) brightness(${0.92 * flick})` }} />
      <Noise opacity={0.3} />
      {rnd(f * 0.37) > 0.82 && <div style={{ position: "absolute", left: `${rnd(f) * 100}%`, top: 0, bottom: 0, width: 1.5, background: "rgba(255,255,255,0.35)" }} />}
      <Vignette strength={0.7} />
    </AbsoluteFill>
  );
};

// ---------- 2026: KI part in the Arena pixel style (inside the 4:3 band) ----------

const ROLE_NAMES = ["BUCHHALTUNG", "VERTRIEB", "EINKAUF", "PERSONAL", "SERVICE", "LOGISTIK"];
const NAMES = ["LENA", "TOM", "AYLIN", "JONAS", "MARA", "BEN", "OLE", "NINA", "CAN", "EVA", "LUKAS", "SINA", "PAUL", "IDA", "FINN"];
const TEAM_BOTS: { prop: BotProp; dx: number; dy: number; tag: string }[] = [
  { prop: "laptop", dx: -250, dy: -40, tag: "MAILS" },
  { prop: "calc", dx: 250, dy: -40, tag: "RECHNUNGEN" },
  { prop: "pdf", dx: 0, dy: 150, tag: "ANGEBOTE" },
];

// "sein eigenes Team haben. Aus KI.": one employee gets three agents, then the camera pulls back over a whole field of them
const TeamScene: React.FC<{ at: number }> = ({ at }) => {
  const s = useSec();
  const t = s + at;
  const out = interpolate(t, [W.aus - 0.05, W.aus + 0.7], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const zoom = 1 - 0.66 * out;
  const n = Math.max(3, count(t, W.aus, W.aus + 0.9, 45));
  const group = (cx: number, cy: number, i: number, main: boolean) => (
    <div key={i} style={{ position: "absolute", left: cx, top: cy }}>
      <svg width={700} height={500} style={{ position: "absolute", left: -350, top: -250, overflow: "visible" }}>
        {TEAM_BOTS.map((b, j) => {
          const p = main ? k(t, W.eigenes + 0.1 + j * 0.2, 0.3) : 1;
          return <line key={j} x1={350} y1={250} x2={350 + b.dx * 0.8 * p} y2={250 + b.dy * 0.8 * p} stroke="#FFF" strokeOpacity={0.75} strokeWidth={6} strokeDasharray="10 12" strokeDashoffset={-t * 50} />;
        })}
      </svg>
      {TEAM_BOTS.map((b, j) => (
        <div key={j} style={{ position: "absolute", left: b.dx, top: b.dy, transform: "translate(-50%,-50%)" }}>
          <div style={main ? popStyle(t, W.eigenes + 0.22 + j * 0.2, 26, 0.3) : {}}>
            <div style={{ transform: `translateY(${-Math.abs(Math.sin(t * 5 + j + i)) * 10}px)` }}><PixelBot px={8} t={t} prop={b.prop} seed={j + i} /></div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}><PixelLabel text={b.tag} size={20} bg={C.orange} /></div>
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%,-62%)" }}>
        <div style={main ? popStyle(t, at, 16, 0.6) : {}}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><PixelLabel text={NAMES[i % NAMES.length]} size={24} bg={SHIRT[i % SHIRT.length]} /></div>
          <Person px={11} seed={i} t={t} />
        </div>
      </div>
    </div>
  );
  const GRID = [-1, 0, 1].flatMap((gy) => [-2, -1, 0, 1, 2].map((gx) => ({ gx, gy })));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <GrassField />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "540px 420px" }}>
        {GRID.map(({ gx, gy }, i) => {
          const main = gx === 0 && gy === 0;
          if (!main && out <= 0) return null;
          return <div key={i} style={{ position: "absolute", inset: 0, opacity: main ? 1 : k(t, W.aus + 0.1 + rnd(i) * 0.4, 0.25) }}>{group(540 + gx * 760, 420 + gy * 560, main ? 0 : i + 1, main)}</div>;
        })}
      </div>
      <div style={{ position: "absolute", right: 28, top: 26, ...popStyle(t, W.aus - 0.1, 10, 0.6) }}>
        <Counter label="AGENTEN" value={String(n)} t={t} bumpAt={[W.aus + 0.2, W.aus + 0.6]} />
      </div>
    </AbsoluteFill>
  );
};

// "Agenten, die Mails beantworten, Rechnungen prüfen, Angebote schreiben": white cards on the grid, our bots do the work
const MAILS = [["Müller GmbH", "Lieferung KW 44?"], ["Stadtwerke", "Zählerstand bitte"], ["Kunde Becker", "Rückfrage Angebot"], ["Spedition Kraus", "Termin Abholung"]];
const WorkScene: React.FC<{ at: number }> = ({ at }) => {
  const s = useSec();
  const t = s + at;
  const phase = t < W.rechnungen ? 0 : t < W.angebote ? 1 : 2;
  const pa = [W.agenten, W.rechnungen, W.angebote][phase];
  const counters: [string, number, number, number][] = [["MAILS", 1284, W.agenten, W.rechnungen - 0.1], ["GEPRÜFT", 312, W.rechnungen, W.angebote - 0.1], ["ANGEBOTE", 47, W.angebote, W.rund - 0.1]];
  const [cl, cto, ca, cb] = counters[phase];
  const cam = 1 + 0.03 * ((t - pa) / 1.4);
  return (
    <OpusBg>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, transformOrigin: "50% 55%" }}>
        {phase === 0 && (() => {
          const rowY = (i: number) => 196 + i * 128;
          const da = (i: number) => pa + 0.25 + i * 0.42;
          const cur = MAILS.findIndex((_, i) => t < da(i) + 0.42);
          const bi = cur < 0 ? 3 : cur;
          const hopQ = k(t, da(bi) - 0.3, 0.28, Easing.inOut(Easing.cubic));
          const by = (bi > 0 ? rowY(bi - 1) + (rowY(bi) - rowY(bi - 1)) * hopQ : rowY(0)) - Math.sin(hopQ * Math.PI) * 50;
          return (
            <>
              <div style={{ position: "absolute", left: 60, top: 110, width: 720, height: 640, background: C.card, borderRadius: 22, boxShadow: shadow, ...popStyle(t, pa, 24, 0.9) }}>
                <div style={{ height: 70, display: "flex", alignItems: "center", gap: 14, padding: "0 28px", borderBottom: `1px solid ${C.line}` }}>
                  <BrandLogo name="outlook" size={36} />
                  <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>Posteingang</div>
                </div>
                {MAILS.map(([from, subj], i) => {
                  const done = t > da(i);
                  return (
                    <div key={i} style={{ position: "absolute", left: 28, right: 28, top: rowY(i) - 110 + 4, height: 112, display: "flex", alignItems: "center", gap: 18, borderBottom: i < 3 ? `1px solid ${C.line}` : "none" }}>
                      <div style={{ width: 54, height: 54, borderRadius: 27, background: SHIRT[i + 2], display: "grid", placeItems: "center", fontFamily: fonts.bold, fontSize: 24, color: "#FFF" }}>{from[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>{from}</div>
                        <div style={{ fontFamily: fonts.regular, fontSize: 22, color: C.dim }}>{subj}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 999, background: done ? C.greenSoft : "#F2F1EE", color: done ? C.green : C.dim, fontFamily: fonts.semibold, fontSize: 22, transform: `scale(${done ? 1 + 0.12 * Math.sin(Math.min(1, k(t, da(i), 0.3)) * Math.PI) : 1})` }}>
                        {done ? <><Check size={22} color={C.green} p={k(t, da(i), 0.25)} />Beantwortet</> : "Offen"}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ position: "absolute", left: 800, top: by - 30 }}><PixelBot px={8} t={t} prop="laptop" flip /></div>
            </>
          );
        })()}
        {phase === 1 && (() => {
          const N = 5;
          const hit = (i: number) => pa + 0.2 + i * 0.2;
          return (
            <>
              <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", ...popStyle(t, pa, 10, 0.7) }}><LabelChip text="Rechnungs-Agent prüft" dot={C.green} size={30} /></div>
              {Array.from({ length: N }).map((_, i) => {
                const x = 90 + i * 186, bad = i === 3;
                const done = t > hit(i);
                return (
                  <div key={i} style={{ position: "absolute", left: x, top: 300, width: 150, ...popStyle(t, pa + i * 0.05, 30, 0.5) }}>
                    <div style={{ transform: `translateY(${done && bad ? -18 * Math.sin(k(t, hit(i), 0.3) * Math.PI) : 0}px)` }}><Receipt px={16} /></div>
                    <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
                      {done ? (bad ? <Tag text="DOPPELT" color={C.red} size={20} /> : <Tag text="OK" color={C.green} size={20} />) : <Tag text="..." color="#B9B4AC" size={20} />}
                    </div>
                    {done && <Stamp t={t} at={hit(i)} text={bad ? "✕" : "✓"} color={bad ? C.red : C.green} size={54} rot={bad ? 8 : -8} style={{ left: 30, top: 50 }} />}
                  </div>
                );
              })}
              {(() => {
                const bi = Math.min(N - 1, Math.max(0, Math.floor((t - pa - 0.02) / 0.2)));
                const q = k(t, hit(bi) - 0.16, 0.16, Easing.inOut(Easing.cubic));
                const x = 90 + (bi > 0 ? (bi - 1) * 186 + 186 * q : 0) + 30;
                return <div style={{ position: "absolute", left: x, top: 190 - Math.sin(q * Math.PI) * 50 }}><PixelBot px={8} t={t} prop="stamp" /></div>;
              })()}
            </>
          );
        })()}
        {phase === 2 && (
          <>
            <div style={{ position: "absolute", left: 150, top: 90, width: 520, height: 660, background: C.card, borderRadius: 14, boxShadow: shadow, padding: 40, boxSizing: "border-box", ...popStyle(t, pa, 20, 0.9) }}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: C.orange }}>ANGEBOT #2026-114</div>
              <div style={{ fontFamily: fonts.bold, fontSize: 36, color: C.ink, marginTop: 8 }}>Bauer &amp; Söhne</div>
              <div style={{ marginTop: 30 }}>
                {[0.92, 0.7, 0.85, 0.62, 0.8, 0.74].map((w, i) => <div key={i} style={{ height: 14, borderRadius: 7, background: "#E9E6E0", width: `${w * 100 * k(t, pa + 0.1 + i * 0.1, 0.2)}%`, marginBottom: 20 }} />)}
              </div>
              <div style={{ position: "absolute", left: 40, right: 40, bottom: 40, borderTop: `2px solid ${C.line}`, paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.dim }}>Summe</span>
                <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 42, color: C.ink }}>{de(count(t, pa + 0.5, pa + 0.85, 12480))} €</span>
              </div>
              <Stamp t={t} at={pa + 0.85} text="VERSENDET" color={C.green} size={50} rot={-10} style={{ left: 120, top: 300 }} />
            </div>
            <div style={{ position: "absolute", left: 720, top: 430 }}><Hopper t={t} amp={12}><PixelBot px={10} t={t} prop="pdf" /></Hopper></div>
          </>
        )}
      </div>
      <div style={{ position: "absolute", right: 28, top: 26 }}><Counter label={cl} value={de(count(t, ca, cb, cto))} t={t} bumpAt={[ca + 0.05]} /></div>
    </OpusBg>
  );
};

// "Rund um die Uhr": the pixel city turns from day to night while the bots keep working on the path
const ClockScene: React.FC<{ at: number }> = ({ at }) => {
  const s = useSec();
  const t = s + at;
  const prog = interpolate(t, [at, at + 1.0], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const night = Math.min(1, prog * 1.4);
  const hours = 9 + prog * 18;
  const hh = Math.floor(hours) % 24, mm = Math.floor((hours % 1) * 60);
  const props: BotProp[] = ["laptop", "calc", "pdf", "folder", "phone", "stamp"];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <PixelWorld t={t} night={night} />
      {props.map((p, i) => <Hopper key={i} t={t * 1.4} seed={i} amp={10} style={{ left: 60 + i * 170, top: 560 }}><PixelBot px={7} t={t} prop={p} seed={i} flip={i % 2 === 1} /></Hopper>)}
      <div style={{ position: "absolute", right: 28, top: 26 }}><Counter label={night > 0.5 ? "NACHTS" : "UHRZEIT"} value={`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`} t={t} /></div>
    </AbsoluteFill>
  );
};

// "Aber zehn Tools ohne Plan sind kein Team. Das ist Chaos.": tool windows rain into the night world, the bots run around lost
const TOOL_WINDOWS = ["chatgpt", "claude", "gmail", "sheets", "hubspot", "whatsapp", "dropbox", "drive", "slack", "teams", "calendar", "outlook", "chatgpt", "claude", "gmail", "hubspot", "whatsapp", "sheets"];
const Chaos: React.FC<{ at: number }> = ({ at }) => {
  const s = useSec();
  const t = s + at;
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(t, [18.15, 20.4], [1, TOOL_WINDOWS.length], clamp));
  const red = k(t, 19.5, 1.1);
  const shake = red * 7;
  const glitch = t > 19.9 && rnd(f * 2.3) > 0.75;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${(rnd(f) - 0.5) * shake}px, ${(rnd(f + 9) - 0.5) * shake}px)`, filter: glitch ? "url(#vsChroma)" : undefined }}>
        <PixelWorld t={t} night={1} red={red} />
        {Array.from({ length: 7 }).map((_, i) => {
          const dir = i % 2 ? 1 : -1;
          const x = ((i * 160 + t * 260 * dir) % 1240 + 1240) % 1240 - 80;
          return <Hopper key={i} t={t * 2} seed={i} amp={14} style={{ left: x, top: 565 + (i % 2) * 20 }}><PixelBot px={6} t={t} prop="question" seed={i} flip={dir < 0} /></Hopper>;
        })}
        {TOOL_WINDOWS.slice(0, n).map((name, i) => {
          const a = 18.15 + (i / TOOL_WINDOWS.length) * 2.25;
          const fall = k(t, a, 0.3, Easing.in(Easing.quad));
          const x = 30 + rnd(i * 5 + 1) * 780, y = 20 + rnd(i * 5 + 2) * 470, rot = (rnd(i * 5 + 3) - 0.5) * 16;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y - (1 - fall) * 500, width: 250, height: 150, transform: `rotate(${rot}deg)`, borderRadius: 12, background: "#F4F2EE", boxShadow: "0 16px 36px rgba(0,0,0,0.55)", overflow: "hidden", border: `4px solid ${C.pxDark}` }}>
              <div style={{ height: 28, background: "#E2DED8", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" }}>
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: 5, background: c }} />)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14 }}>
                <BrandLogo name={name} size={44} />
                <div style={{ flex: 1 }}>{[0.9, 0.7, 0.8].map((w, j) => <div key={j} style={{ height: 8, width: `${w * 100}%`, background: "#CFCAC2", borderRadius: 4, marginBottom: 8 }} />)}</div>
              </div>
              {i % 3 === 0 && <div style={{ position: "absolute", right: 10, top: 38, width: 30, height: 30, borderRadius: 15, background: C.red, color: "#fff", fontFamily: fonts.bold, fontSize: 16, display: "grid", placeItems: "center" }}>{3 + (i % 7)}</div>}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 28, top: 26, opacity: k(t, 18.4, 0.2) }}><Counter label="TOOLS" value={String(Math.min(10, Math.max(1, Math.round(n * 10 / TOOL_WINDOWS.length))))} t={t} bumpAt={[18.76, 19.4]} /></div>
      {t > 19.82 && t < 20.64 && <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}><PixelLabel text="KEIN TEAM" size={64} bg={C.red} style={{ transform: `rotate(-3deg) scale(${interpolate(t, [19.82, 19.98], [2.2, 1], clamp)})` }} /></div>}
      {t > 20.64 && <div style={{ position: "absolute", inset: 0, background: "#777" }}><Noise opacity={1} blend="normal" /></div>}
      <Noise opacity={0.12} />
      <Vignette strength={0.55} />
    </AbsoluteFill>
  );
};

// ---------- bright world (full 9:16) ----------

// "Was, wenn du die ganze Kraft nutzt": the scattered bots line up into one calm formation
const FORM = Array.from({ length: 60 }, (_, i) => ({ i, col: i % 8, row: Math.floor(i / 8) })).filter((b) => b.row < 7).slice(0, 56);
const BreakScene: React.FC<{ at: number }> = ({ at }) => {
  const s = useSec();
  const t = s + at;
  const props: BotProp[] = ["laptop", "calc", "pdf", "folder", "phone", "stamp", "magnifier", "calendar"];
  const cam = 1.06 - 0.06 * k(t, at, 1.9, Easing.out(Easing.cubic));
  return (
    <OpusBg>
      <div style={{ position: "absolute", left: 540 - 380, top: 960 - 380, width: 760, height: 760, borderRadius: "50%", background: `radial-gradient(circle, rgba(217,119,87,${0.22 * k(t, 22.2, 0.8)}), transparent 68%)` }} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})` }}>
        {FORM.map(({ i, col, row }) => {
          const q = k(t, 21.45 + rnd(i + 3) * 0.6, 1.0, Easing.inOut(Easing.cubic));
          const tx = 540 + (col - 3.5) * 112, ty = 960 + (row - 3) * 118;
          const sx = rnd(i * 3) * 1080, sy = 200 + rnd(i * 3 + 1) * 1500;
          const x = sx + (tx - sx) * q, y = sy + (ty - sy) * q;
          const rot = (1 - q) * (rnd(i * 7) - 0.5) * 120;
          const hop = q < 1 ? -Math.abs(Math.sin(t * 7 + i)) * 16 * (1 - q) : 0;
          return <div key={i} style={{ position: "absolute", left: x - 30, top: y - 40 + hop, transform: `rotate(${rot}deg)` }}><PixelBot px={5} t={t} prop={props[i % props.length]} seed={i} /></div>;
        })}
      </div>
    </OpusBg>
  );
};

// Real Superkind footage, graded like film inside a pixel-art frame; our bots sit on the frame and show who stays in control
const FEED: [string, number, number][] = [["meeting", 23.2, 24.2], ["beratung", 24.2, 24.95], ["team", 24.95, 25.4]];
const FilmScene: React.FC<{ at: number }> = ({ at }) => {
  const s = useSec();
  const t = s + at;
  const f = useCurrentFrame();
  const inP = k(t, at, 0.4);
  const fx = 70, fy = 540, fw = 940, fh = 705;
  const weaveX = (rnd(f * 3.1) - 0.5) * 2, weaveY = (rnd(f * 7.7) - 0.5) * 2;
  return (
    <OpusBg>
      <div style={{ position: "absolute", left: fx, top: fy, width: fw, height: fh, transform: `translateY(${(1 - inP) * 60}px) rotate(${-1.2 * inP}deg)`, opacity: inP }}>
        <div style={{ position: "absolute", inset: -14, background: C.pxDark, boxShadow: `0 0 0 7px ${C.gold}, 0 20px 0 7px rgba(107,69,40,0.55)` }} />
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#111" }}>
          {FEED.map(([src, a, b]) => (
            <Sequence key={src} from={Math.round((a - at) * VS_FPS)} durationInFrames={Math.round((b - a) * VS_FPS)} layout="none">
              <OffthreadVideo src={staticFile(D + "film/" + src + ".mp4")} muted style={{ position: "absolute", left: weaveX - 20, top: weaveY - 15, width: fw + 40, height: fh + 30, objectFit: "cover", filter: "sepia(0.28) saturate(0.78) contrast(1.08) brightness(0.97)", transform: `scale(${1.04 + 0.05 * k(t, a, b - a, (x) => x)})` }} />
            </Sequence>
          ))}
          {/* warm light leak drifting through, grain and a soft gate vignette = film, not corporate */}
          <div style={{ position: "absolute", left: -300 + ((t - at) * 260) % 1400, top: -200, width: 700, height: 1100, background: "radial-gradient(ellipse, rgba(255,150,80,0.28), transparent 65%)", mixBlendMode: "screen" }} />
          <Noise opacity={0.22} />
          <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 120px rgba(20,10,0,0.55)" }} />
          <div style={{ position: "absolute", left: 26, top: 24, display: "flex", alignItems: "center", gap: 10, fontFamily: PIXEL, fontSize: 24, color: "#FFF", textShadow: "0 2px 0 rgba(0,0,0,0.5)" }}>
            <span style={{ width: 16, height: 16, background: C.red, opacity: f % 20 < 12 ? 1 : 0.25 }} />REC · BEIM KUNDEN
          </div>
        </div>
        {/* bots sitting on the frame */}
        <div style={{ position: "absolute", left: 40, top: -14 - 13 * 8, ...popStyle(t, 23.4, 20, 0.4) }}><PixelBot px={8} t={t} prop="laptop" /></div>
        <div style={{ position: "absolute", right: 50, top: fh + 14 - 30, ...popStyle(t, 23.85, 20, 0.4) }}><Hopper t={t} amp={6}><PixelBot px={8} t={t} prop="stamp" flip /></Hopper></div>
        <Stamp t={t} at={24.15} text="FREIGEGEBEN ✓" color={C.green} size={46} rot={-7} style={{ right: 150, top: fh - 120 }} />
      </div>
      <div style={{ position: "absolute", left: fx + 160, top: fy - 100, ...popStyle(t, 23.45, 16, 0.6) }}><PixelLabel text="AGENT SCHREIBT MIT" size={28} bg={C.orange} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: fy + fh + 50, display: "flex", justifyContent: "center", gap: 18 }}>
        <div style={popStyle(t, 23.9, 16, 0.6)}><PixelLabel text="FREIGABE: DU" size={28} bg={C.green} /></div>
        <div style={popStyle(t, 24.45, 16, 0.6)}><PixelLabel text="JEDER SCHRITT GELOGGT" size={28} bg={C.pxDark} /></div>
      </div>
    </OpusBg>
  );
};

const BrainNode: React.FC<{ size: number; glow: number }> = ({ size, glow }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.26, display: "grid", placeItems: "center", background: `linear-gradient(160deg, #FF8A5C 0%, ${ACC} 55%, #E4541F 100%)`, boxShadow: `0 0 ${90 * glow}px rgba(255,107,53,${0.55 * glow}), 0 30px 60px rgba(0,0,0,0.18)` }}>
    <Img src={staticFile("superkind-logo.svg")} style={{ width: size * 0.56, filter: "brightness(0) invert(1)" }} />
  </div>
);

const ROLES = [
  { name: "BUCHHALTUNG", seed: 0, prop: "calc" as BotProp, color: C.green, x: 200 },
  { name: "VERTRIEB", seed: 1, prop: "phone" as BotProp, color: C.blue, x: 540 },
  { name: "EINKAUF", seed: 2, prop: "folder" as BotProp, color: ACC, x: 880 },
];
const SYSTEMS = [
  { name: "Outlook", at: W.outlook, x: 200 },
  { name: "SAP", at: W.sap, x: 540 },
  { name: "DATEV", at: W.datev, x: 880 },
];

const Brain: React.FC<{ at: number }> = ({ at }) => {
  const s = useSec();
  const t = s + at;
  const cx = 540, cy = 470, roleY = 930, sysY = 1400;
  return (
    <OpusBg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 205, display: "flex", justifyContent: "center", ...popStyle(t, W.ein, 10, 0.6) }}><LabelChip text="Firmengehirn" size={34} /></div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {ROLES.map((r, i) => {
          const p = k(t, W.klare + i * 0.15, 0.4);
          const y2 = cy + 120 + (roleY - 200 - cy - 120) * p;
          return <path key={r.name} d={`M${cx} ${cy + 120} C ${cx} ${cy + 250}, ${r.x} ${y2 - 130}, ${r.x} ${y2}`} fill="none" stroke={r.color} strokeOpacity={0.6} strokeWidth={5} strokeDasharray="12 12" strokeDashoffset={-t * 50} />;
        })}
        {SYSTEMS.map((sy) => {
          const p = k(t, sy.at - 0.1, 0.3);
          return <line key={sy.name} x1={sy.x} y1={roleY + 200} x2={sy.x} y2={roleY + 200 + (sysY - 55 - roleY - 200) * p} stroke={C.ink} strokeOpacity={0.25} strokeWidth={4} strokeDasharray="8 10" />;
        })}
      </svg>
      <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)" }}>
        <div style={popStyle(t, W.gehirn - 0.15, 20, 0.5)}><BrainNode size={240} glow={0.6 + 0.4 * Math.sin(t * 3)} /></div>
      </div>
      {ROLES.map((r, i) => (
        <div key={r.name} style={{ position: "absolute", left: r.x - 152, top: roleY - 200, width: 304, height: 400, ...popStyle(t, W.klare + 0.1 + i * 0.15, 40, 0.4) }}>
          <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 22, boxShadow: shadow, border: `5px solid ${r.color}` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 34, display: "flex", justifyContent: "center" }}><Person px={9} seed={r.seed} t={t} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 214, display: "flex", justifyContent: "center", gap: 10 }}>
            <div style={{ transform: `translateY(${-Math.abs(Math.sin(t * 5 + i)) * 8}px)` }}><PixelBot px={5} t={t} prop={r.prop} seed={i} /></div>
            <div style={{ transform: `translateY(${-Math.abs(Math.sin(t * 5 + i + 1.5)) * 8}px)` }}><PixelBot px={5} t={t} prop="laptop" seed={i + 7} /></div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, display: "flex", justifyContent: "center" }}><PixelLabel text={r.name} size={22} bg={r.color} /></div>
        </div>
      ))}
      {SYSTEMS.map((sy) => (
        <div key={sy.name} style={{ position: "absolute", left: sy.x, top: sysY, transform: "translate(-50%,-50%)" }}>
          <div style={{ background: "#FFF", borderRadius: 22, boxShadow: shadow, padding: "16px 24px", display: "flex", alignItems: "center", gap: 14, ...popStyle(t, sy.at, 20, 0.5) }}>
            <BrandLogo name={sy.name} size={58} />
            <span style={{ fontFamily: fonts.bold, fontSize: 38, letterSpacing: -0.5, color: C.ink }}>{sy.name}</span>
          </div>
        </div>
      ))}
    </OpusBg>
  );
};

const SphereLogo: React.FC<{ at: number }> = ({ at }) => {
  const s = useSec();
  const t = s + at;
  const N = 520;
  const collapse = interpolate(t, [30.55, 31.05], [0, 1], { ...clamp, easing: (x) => x * x });
  const grow = k(t, 30.1, 0.45);
  const R = 330 * grow * (1 - collapse) + 6;
  const rot = t * 1.6;
  const logoP = k(t, 31.0, 0.5);
  return (
    <OpusBg>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - logoP }} shapeRendering="crispEdges">
        {Array.from({ length: N }).map((_, i) => {
          const y = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), th = i * 2.39996 + rot;
          const x = Math.cos(th) * rr, z = Math.sin(th) * rr;
          const depth = (z + 1) / 2;
          const sz = 4 + 6 * depth;
          return <rect key={i} x={540 + x * R - sz / 2} y={860 + y * R * 0.98 - sz / 2} width={sz} height={sz} fill={C.orange} opacity={0.25 + 0.75 * depth} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 540, top: 860, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * logoP})`, opacity: logoP }}><BrainNode size={300} glow={0.8} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", opacity: logoP, transform: `translateY(${(1 - logoP) * 20}px)` }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 112, letterSpacing: -4, color: C.ink }}>superkind</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", fontSize: 66, lineHeight: 1.15 }}>
        {([["Jeder Mitarbeiter.", W.jeder, serif, C.ink], ["Sein eigenes Team.", W.sein, serifItalic, ACC]] as [string, number, string, string][]).map(([txt, a, ff, col]) => {
          const p = k(t, a - 0.05, 0.4);
          return <div key={txt} style={{ opacity: p, transform: `translateY(${(1 - p) * 16}px)`, fontFamily: ff, color: col }}>{txt}</div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1450, textAlign: "center", fontFamily: fonts.semibold, fontSize: 46, letterSpacing: 1, color: C.ink, opacity: k(t, 32.4, 0.5) }}>superkind.ai</div>
    </OpusBg>
  );
};

// ---------- frame + captions ----------

// ---------- v4: cinematic real footage (Pexels CC0 + two MiniMax H3 Max shots where stock had nothing) ----------

// one graded film shot: cover-fit, slow push, teal shadows / warm highlights, grain, vignette
const Cine: React.FC<{ src: string; from?: number; dur: number; w?: number; h?: number; pos?: string; push?: [number, number]; rate?: number; grade?: "night" | "day" | "warm"; drift?: number }> = ({ src, from = 0, dur, w = BW, h = BH, pos = "50% 50%", push = [1.03, 1.1], rate = 1, grade = "night", drift = 0 }) => {
  const s = useSec();
  const q = interpolate(s, [0, dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const sc = push[0] + (push[1] - push[0]) * q;
  const filter = grade === "night" ? "contrast(1.1) saturate(0.82) brightness(0.92)" : grade === "warm" ? "sepia(0.12) contrast(1.06) saturate(0.88) brightness(1.0)" : "contrast(1.04) saturate(0.9) brightness(1.04)";
  const tint = grade === "night"
    ? "linear-gradient(180deg, rgba(20,60,80,0.32), rgba(30,40,50,0.1) 55%, rgba(120,70,20,0.22))"
    : "linear-gradient(180deg, rgba(255,236,200,0.16), rgba(255,255,255,0) 60%, rgba(255,200,140,0.14))";
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(D + "stock/" + src + ".mp4")} muted startFrom={Math.round(from * VS_FPS)} playbackRate={rate}
        style={{ position: "absolute", left: 0, top: 0, width: w, height: h, objectFit: "cover", objectPosition: pos, transform: `translateX(${drift * q}px) scale(${sc})`, filter }} />
      <AbsoluteFill style={{ background: tint, mixBlendMode: "soft-light" }} />
      <Noise opacity={0.16} />
      <Vignette strength={grade === "night" ? 0.62 : 0.32} />
    </AbsoluteFill>
  );
};
const Static: React.FC = () => (<AbsoluteFill style={{ background: "#6d6d6d" }}><Noise opacity={1} blend="normal" /></AbsoluteFill>);

// image film full-frame: per-shot crop that keeps the person in focus, graded warm like film
const FILM_SHOTS: [string, number, number, string, number][] = [["meeting", BREAK, 23.0, "22% 50%", 0], ["beratung", 23.0, 23.76, "46% 50%", 0], ["team", 23.76, 25.34, "52% 50%", 0.3]];
const FilmFull: React.FC<{ at: number }> = ({ at }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {FILM_SHOTS.map(([src, a, b, pos, from]) => (
      <Sequence key={src} from={Math.round((a - at) * VS_FPS)} durationInFrames={Math.round((b - a) * VS_FPS)} layout="none">
        <AbsoluteFill>
          <FilmClip src={src} from={from} dur={b - a} pos={pos} />
        </AbsoluteFill>
      </Sequence>
    ))}
  </AbsoluteFill>
);
const FilmClip: React.FC<{ src: string; from: number; dur: number; pos: string }> = ({ src, from, dur, pos }) => {
  const s = useSec();
  const sc = 1.02 + 0.05 * (s / dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(D + "film/" + src + ".mp4")} muted startFrom={Math.round(from * VS_FPS)}
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920, objectFit: "cover", objectPosition: pos, transform: `scale(${sc})`, filter: "sepia(0.14) contrast(1.08) saturate(0.82) brightness(0.98)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,226,190,0.14), rgba(0,0,0,0) 50%, rgba(255,170,110,0.16))", mixBlendMode: "soft-light" }} />
      <Noise opacity={0.2} />
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};

const DARK_SHOTS: { a: number; b: number; el: (a: number, b: number) => React.ReactNode }[] = [
  { a: 0, b: 1.95, el: (a, b) => <TvShot at={a} dur={b - a} s0={0.64} s1={0.76} powerOn /> },
  { a: 1.95, b: 2.75, el: (a, b) => <Archive src="a01" dur={b - a} /> },
  { a: 2.75, b: 3.65, el: (a, b) => <Archive src="a02" from={0.4} dur={b - a} /> },
  { a: 3.65, b: 4.3, el: (a, b) => <Archive src="a05" from={2.4} dur={b - a} /> },
  { a: 4.3, b: 5.02, el: (a, b) => <Archive src="a04" from={2.4} dur={b - a} /> },
  { a: 5.02, b: 5.85, el: (a, b) => <Archive src="a07" from={0.3} dur={b - a} /> },
  { a: 5.85, b: 6.6, el: (a, b) => <Archive src="a15" from={1.4} dur={b - a} /> },
  { a: 6.6, b: 7.5, el: (a, b) => <Archive src="a10" from={0.2} dur={b - a} /> },
  { a: 7.5, b: 8.46, el: (a, b) => <Archive src="a14" from={0.6} dur={b - a} /> },
  { a: 8.46, b: 10.35, el: (a, b) => <TvShot at={a} dur={b - a} s0={1.0} s1={1.07} y={400} /> },
  { a: 10.35, b: 11.54, el: (a, b) => <Cine src="g1" from={1.0} dur={b - a} /> },
  { a: 11.54, b: 12.62, el: (a, b) => <Cine src="h3-monitors" from={1.6} dur={b - a} push={[1.04, 1.12]} /> },
  { a: 12.62, b: 14.79, el: (a, b) => <Cine src="g3b" from={2.6} dur={b - a} pos="50% 45%" push={[1.04, 1.12]} /> },
  { a: 14.79, b: 15.95, el: (a, b) => <Cine src="h3-scanner" from={1.2} dur={b - a} push={[1.03, 1.08]} /> },
  { a: 15.95, b: 17.06, el: (a, b) => <Cine src="g5" from={1.5} dur={b - a} push={[1.06, 1.12]} /> },
  { a: 17.06, b: 18.15, el: (a, b) => <Cine src="g6" from={4.0} dur={b - a} rate={5} push={[1.02, 1.05]} /> },
  { a: 18.15, b: 19.62, el: (a, b) => <Cine src="g7" from={8.0} dur={b - a} push={[1.06, 1.16]} /> },
  { a: 19.62, b: 20.2, el: (a, b) => <Cine src="g8" from={2.3} dur={b - a} push={[1.1, 1.18]} /> },
  { a: 20.2, b: 20.64, el: (a, b) => <Cine src="g7b" from={3.95} dur={b - a} pos="50% 42%" push={[1.04, 1.1]} /> },
  { a: 20.64, b: 21.0, el: () => <Static /> },
];

// FP-style captions: orange mono pill, 2-3 words per chunk, the active word in a black pill
const capWord = (s: string) => s.replace(/[.,!?:]/g, "").toUpperCase().replace(/^10$/, "ZEHN");
const CHUNKS = (() => {
  const out: { start: number; end: number; words: { w: string; s: number }[] }[] = [];
  let cur: typeof CAPS = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].s, end: cur[cur.length - 1].e, words: cur.map((c) => ({ w: capWord(c.text), s: c.s })) });
    cur = [];
  };
  for (const c of CAPS) {
    if (c.s >= W.superkind - 0.05) break; // the logo card carries the last line
    const len = cur.map((x) => capWord(x.text)).join(" ").length + capWord(c.text).length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 20) || (cur.length && len > 22)) flush();
    cur.push(c);
    if (/[.,!?:]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.4 }));
})();
const PillCaption: React.FC<{ t: number; y: number }> = ({ t, y }) => {
  const c = CHUNKS.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = pop(t, c.start - 0.04, 0.16);
  const fs = c.words.reduce((n, w) => n + w.w.length + 1, 0) > 19 ? 40 : 46;
  const cw = fs * 0.74, gapW = fs * 0.5;
  const xs: number[] = []; let acc = 0;
  c.words.forEach((w) => { xs.push(acc); acc += w.w.length * cw + gapW; });
  const ws = c.words.map((w) => w.w.length * cw - fs * 0.14);
  let i = c.words.findIndex((w, j) => j + 1 >= c.words.length || t < c.words[j + 1].s - 0.03);
  if (i < 0) i = c.words.length - 1;
  const prev = Math.max(0, i - 1);
  const q = i === 0 ? 1 : interpolate(t, [c.words[i].s - 0.03, c.words[i].s + 0.05], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const bx = xs[prev] + (xs[i] - xs[prev]) * q, bw = ws[prev] + (ws[i] - ws[prev]) * q;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.08), background: C.orange, borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: MONO, fontWeight: 700, fontSize: fs, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(120,50,25,0.30)" }}>
        <div style={{ position: "relative", display: "flex", gap: gapW }}>
          <div style={{ position: "absolute", left: bx - 12, top: -4, width: bw + 24, bottom: -4, background: "#111111", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.22)" }} />
          {c.words.map((w, j) => <span key={j} style={{ position: "relative", display: "inline-block", color: "#FFFFFF" }}>{w.w}</span>)}
        </div>
      </div>
    </div>
  );
};

export const VisionSchwarm: React.FC = () => {
  const t = useSec();
  const dark = t < BREAK;
  const open = k(t, BREAK, 0.7, Easing.bezier(0.16, 1, 0.3, 1));
  const flash = interpolate(t, [BREAK - 0.02, BREAK + 0.05, BREAK + 0.5], [0, 0.85, 0], clamp);
  const year = t < W.heute ? "1952" : "2026";
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Defs />
      {dark && (
        <>
          <div style={{ position: "absolute", left: 0, top: FILM_TOP, width: BW, height: BH, overflow: "hidden" }}>
            {DARK_SHOTS.map((s, i) => (
              <Sequence key={i} {...seq(s.a, s.b)} layout="none">
                <AbsoluteFill>{s.el(s.a, s.b)}</AbsoluteFill>
              </Sequence>
            ))}
          </div>
          {t < 21.0 && t > 0.62 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: FILM_TOP - 80, display: "flex", justifyContent: "center" }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: "0.5em", color: "rgba(255,255,255,0.55)" }}>{year}</div>
            </div>
          )}
        </>
      )}
      {!dark && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: FILM_TOP * (1 - open), height: FILM_H + (1920 - FILM_H) * open, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, width: 1080, height: 1920, top: -FILM_TOP * (1 - open) }}>
            <Sequence {...seq(BREAK, 25.34)} layout="none"><AbsoluteFill><FilmFull at={BREAK} /></AbsoluteFill></Sequence>
            <Sequence {...seq(25.34, 30.1)} layout="none"><AbsoluteFill><Brain at={25.34} /></AbsoluteFill></Sequence>
            <Sequence {...seq(30.1, VS_SECONDS)} layout="none"><AbsoluteFill><SphereLogo at={30.1} /></AbsoluteFill></Sequence>
          </div>
        </div>
      )}
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />

      {/* sound: voice on top, a calm piano bed far underneath (ElevenLabs, licence-free), only a few soft SFX */}
      {/* old telephone voice while the picture is B&W, clean voice from the first colour shot on */}
      <Sequence from={Math.round(O * VS_FPS)} layout="none">
        <Audio src={staticFile(D + "voice-tel.mp3")} volume={(f) => interpolate(f / VS_FPS + O, [COLOR - 0.06, COLOR + 0.06], [1, 0], clamp)} />
        <Audio src={staticFile(D + "avatar.mp4")} volume={(f) => interpolate(f / VS_FPS + O, [COLOR - 0.06, COLOR + 0.06], [0, 1], clamp)} />
      </Sequence>
      <Sequence from={Math.round(0.3 * VS_FPS)} durationInFrames={Math.round((COLOR - 0.3) * VS_FPS)} layout="none">
        <Audio src={staticFile(D + "sfx/hiss.mp3")} volume={(f) => interpolate(f / VS_FPS, [0, 0.4, COLOR - 0.5, COLOR - 0.3], [0, 0.6, 0.6, 0], clamp)} />
      </Sequence>
      <Audio src={staticFile(D + "calm.mp3")} volume={(f) => interpolate(f / VS_FPS, [0, 1.2, 20.3, 20.9, 21.6, 22.6, 33.6, 34.4], [0, 0.1, 0.1, 0.06, 0.06, 0.12, 0.12, 0], clamp)} />
      {([
        ["tv-on", 0.05, 0.3], ["static", 0.3, 0.1], ["typewriter", 5.0, 0.14], ["reverse", W.heute - 0.6, 0.1],
        ["notif", 18.3, 0.06], ["glitch", 19.85, 0.025], ["impact", W.chaos, 0.08], ["static", W.chaos, 0.04],
        ["reverse", BREAK - 0.9, 0.1], ["impact", BREAK, 0.07], ["reverse", 30.3, 0.12], ["impact", 31.0, 0.09],
      ] as [string, number, number][]).map(([name, at0, vol], i) => (
        <Sequence key={i} from={Math.round(at0 * VS_FPS)} durationInFrames={name === "static" ? Math.round(0.35 * VS_FPS) : undefined} layout="none">
          <Audio src={staticFile(D + "sfx/" + name + ".mp3")} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
