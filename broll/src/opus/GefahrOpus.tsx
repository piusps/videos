import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-gefaehrdung/captions.json";
import { PixelBot, BotProp, BotHat } from "../components/PixelBot";

// FP-N "Gefährdungsbeurteilung" (2026-10-21, autonomer Run), gebaut wie GewinnOpus/BelegeOpus: Split + Vollbild-Momente im Arena-Stil,
// eigener Pixel-Ritter als Klick-Cursor, Guide-Scroll am Ende. Zeiten an captions.json (tightened) verankert.

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const GW_END = LAST_END + 0.9;
export const GW_FRAMES = Math.round(GW_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  papier: at("papier"), fehlt: at("fehlt"), gefaehrdung: at("gefährdungsbeurteilung"), unfall: at("unfall"), amt: at("amt"), sehen: at("sehen"),
  claude0: at("claude", 0), zehn: at("zehn"), minuten: at("minuten"), du1: at("du", 1), sagst: at("sagst"), macht: at("macht"),
  raeume: at("räume"), geraete: at("geräte"), bildschirm: at("bildschirm"), leiter: at("leiter"), claude2: at("claude", 2), geht: at("geht"),
  stolpern: at("stolpern"), strom: at("strom"), laerm: at("lärm"), hitze: at("hitze"), und1: at("und", 1), stress: at("stress"), zeitdruck: at("zeitdruck"),
  seit: at("seit"), pflicht: at("pflicht"), fuer: at("für"), gefahr0: at("gefahr", 0), massnahme: at("maßnahme"), wer2: at("wer", 2), bis: at("bis"),
  raus0: at("raus"), fertiges: at("fertiges"), unterschreiben: at("unterschreiben"), kein0: at("kein", 0), berater: at("berater"), kein1: at("kein", 1), ordner: at("ordner"),
  prompts: at("prompts"), elf: at("elf"), guide: at("guide"), komm: at("kommentier"), gefahr1: at("gefahr", 1),
};
const C = {
  bg: "#F3EFE6", grid: "rgba(0,0,0,0.045)", ink: "#151515", dim: "#8A877F", line: "#E7E4DD", card: "#FFFFFF",
  orange: "#D97757", orangeSoft: "#F8E1D7", green: "#1E9E57", greenSoft: "#E6F5EC", red: "#E5484D", redSoft: "#FDE8E8",
  chip: "#141414", term: "#17161A", gold: "#F5C542", blue: "#3E8EF7",
};
const MONO = "JetBrains Mono";
const PIXEL = "Silkscreen";
const shadow = "0 22px 48px rgba(20,20,20,0.10), 0 3px 8px rgba(20,20,20,0.06)";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, a: number, d = 0.3, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const pop = (t: number, a: number, d = 0.38) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
const popStyle = (t: number, a: number, rise = 18, from = 0.7): React.CSSProperties => {
  const p = pop(t, a);
  return { opacity: k(t, a, 0.14), transform: `translateY(${(1 - Math.min(p, 1)) * rise}px) scale(${from + (1 - from) * p})` };
};
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(interpolate(t, [a, b], [0, s.length], clamp)));
const rnd = (i: number, salt = 1) => { const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453; return x - Math.floor(x); };
const shakeAt = (t: number, a: number, amp = 5) => { const r = t - a; return r > 0.03 && r < 0.4 ? Math.sin(r * 90) * amp * (1 - r / 0.4) : 0; };
const eur = (n: number) => Math.round(n).toLocaleString("de-DE") + " €";

const SENT = [0, ...CAPS.flatMap((c, i) => (i > 0 && /[.!?:]$/.test(CAPS[i - 1].text) ? [c.startMs / 1000] : []))];
const camera = (t: number, from: number, to: number) => {
  const s = SENT.filter((x) => x >= from && x < to);
  if (!s.length) s.push(from);
  const amt = Math.min(0.03, 0.075 / s.length);
  let sc = 1;
  s.forEach((a, i) => {
    const b = i + 1 < s.length ? s[i + 1] : to;
    sc += amt * interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  });
  return sc;
};

// ---------- building blocks ----------
const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", background: C.card, borderRadius: 18, boxShadow: shadow, ...style }}>{children}</div>
);
const LabelChip: React.FC<{ text: string; dot?: string; style?: React.CSSProperties; size?: number }> = ({ text, dot = C.orange, style, size = 28 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.chip, color: "#FFF", fontFamily: fonts.semibold, fontSize: size, padding: `${size * 0.36}px ${size * 0.8}px ${size * 0.36}px ${size * 0.6}px`, borderRadius: 999, boxShadow: "0 10px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap", ...style }}>
    <span style={{ width: size * 0.48, height: size * 0.48, borderRadius: "50%", background: dot }} />
    {text}
  </div>
);
const Tag: React.FC<{ text: string; color: string; size?: number; style?: React.CSSProperties }> = ({ text, color, size = 18, style }) => (
  <span style={{ display: "inline-block", fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color: "#FFF", background: color, padding: `${size * 0.33}px ${size * 0.55}px ${size * 0.33}px ${size * 0.66}px`, borderRadius: 8, whiteSpace: "nowrap", ...style }}>{text}</span>
);
const ClaudeMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={SIMPLE_ICONS.claude.d} fill={SIMPLE_ICONS.claude.hex} /></svg>
);
const Check: React.FC<{ size: number; color?: string; p?: number }> = ({ size, color = "#FFF", p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - p)} /></svg>
);
const Stamp: React.FC<{ t: number; at: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, at: a, text, color = C.red, size = 64, rot = -8, style }) => {
  if (t < a) return null;
  const p = interpolate(t, [a, a + 0.16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ position: "absolute", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: p, fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.08em", color, border: `${size * 0.09}px solid ${color}`, borderRadius: 12, padding: `${size * 0.08}px ${size * 0.3}px`, background: "rgba(255,255,255,0.9)", whiteSpace: "nowrap", ...style }}>{text}</div>;
};
const PdfIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div style={{ width: size * 0.85, height: size, borderRadius: 6, background: C.red, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: size * 0.3, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: size * 0.12, boxSizing: "border-box", flexShrink: 0 }}>PDF</div>
);
const PixelText: React.FC<{ text: string; size: number; color?: string; bg?: string; style?: React.CSSProperties }> = ({ text, size, color = "#FFF", bg = "#2C2420", style }) => (
  <div style={{ fontFamily: PIXEL, fontSize: size, color, background: bg, padding: `${size * 0.25}px ${size * 0.45}px`, border: `${Math.max(4, size * 0.09)}px solid ${C.gold}`, boxShadow: `0 ${size * 0.12}px 0 #6B4528`, whiteSpace: "nowrap", lineHeight: 1, ...style }}>{text}</div>
);
// ---------- Arena-Stil: our own pixel knight (13 x 15), receipts, counter, quest world ----------
const TEAM = ["#E5484D", "#3E8EF7", "#2FB36B", "#F2A531", "#9B5DE5", "#F25CA2", "#1FB5C9", "#F27A3A", "#6C7BF2", "#7DBB3C"];
const SPR = [
  ".....PPP.....", "....PPPPP....", "....hHHHh....", "...hHHHHHh...", "...HVVVVVH...", "...HVEVEVH..W", "...hHHHHHh..W",
  "....hHHHh...W", ".SS.BBBBB...W", "SGGSBBBBBBKKK", "SGGSBBBBB..K.", ".SS.BBBBB....", "....LL.LL....", "....LL.LL....", "...DDD.DDD...",
];
const CROWN = ["....C.C.C....", "....CCCCC...."];
const shade = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${ch((n >> 16) & 255)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
};
const Knight: React.FC<{ color?: string; px: number; grey?: boolean; crown?: boolean; flip?: boolean; style?: React.CSSProperties }> = ({ color = C.orange, px, grey, crown, flip, style }) => {
  const pal: Record<string, string> = grey
    ? { P: "#9C978E", B: "#B9B4AC", H: "#CFCBC4", h: "#A8A39A", V: "#6E6A63", E: "#6E6A63", S: "#8E8981", G: "#B9B4AC", W: "#CFCBC4", K: "#8E8981", L: "#8E8981", D: "#6E6A63" }
    : { P: shade(color, 0.72), B: color, H: "#D5DAE0", h: "#9AA3AD", V: "#1E1E24", E: "#FFE58A", S: "#7A4B26", G: "#E6B84A", W: "#EEF3F7", K: "#7A4B26", L: "#4A4038", D: "#2C2420" };
  const rows = crown ? [...CROWN, ...SPR] : SPR;
  return (
    <svg width={13 * px} height={rows.length * px} viewBox={`0 0 13 ${rows.length}`} shapeRendering="crispEdges" style={{ display: "block", transform: flip ? "scaleX(-1)" : undefined, overflow: "visible", ...style }}>
      {rows.flatMap((r, y) => r.split("").map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={ch === "C" ? C.gold : pal[ch]} />)))}
    </svg>
  );
};
const RECEIPT = ["WWWWWWW..", "WLLLLWWW.", "WWWWWWWWW", "WLLLLLLLW", "WWWWWWWWW", "WLLLLLLLW", "WWWWWWWWW", "WLLLLWWWW", "WWWWWWWWW", "WWWWWWWWW", "W.W.W.W.W"];
const Receipt: React.FC<{ px: number; lost?: boolean; missing?: number; style?: React.CSSProperties }> = ({ px, lost, missing = 0, style }) => {
  const pal: Record<string, string> = lost ? { W: "#CFCBC4", L: "#9C978E" } : { W: "#FFFFFF", L: "#B9B4AC" };
  const o = Math.max(2, px * 0.5);
  return (
    <div style={{ position: "relative", width: 9 * px, height: 11 * px, ...style }}>
      <svg width={9 * px} height={11 * px} viewBox="0 0 9 11" shapeRendering="crispEdges" style={{ display: "block", filter: `drop-shadow(${o}px 0 0 #2C2420) drop-shadow(-${o}px 0 0 #2C2420) drop-shadow(0 ${o}px 0 #2C2420) drop-shadow(0 -${o}px 0 #2C2420)` }}>
        {RECEIPT.flatMap((r, y) => r.split("").map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={pal[ch]} />)))}
      </svg>
      {missing > 0 ? (
        <svg width={9 * px} height={11 * px} viewBox="0 0 9 11" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M1.5 2.5l6 6M7.5 2.5l-6 6" stroke={C.red} strokeWidth={1.3} strokeLinecap="square" strokeDasharray={9} strokeDashoffset={9 * (1 - missing)} />
        </svg>
      ) : null}
    </div>
  );
};
const Counter: React.FC<{ label: string; value: string; t: number; bumpAt?: number[] }> = ({ label, value, t, bumpAt = [] }) => {
  const b = bumpAt.reduce((m, a) => Math.max(m, t > a && t < a + 0.25 ? 1 - (t - a) / 0.25 : 0), 0);
  return (
    <div style={{ display: "flex", alignItems: "center", transform: `scale(${1 + 0.12 * b})`, transformOrigin: "100% 50%" }}>
      <div style={{ fontFamily: PIXEL, fontSize: 28, color: C.gold, background: "#2C2420", padding: "14px 16px", border: `5px solid ${C.gold}`, borderRight: "none", whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ fontFamily: PIXEL, fontSize: 52, color: "#2C2420", background: C.gold, padding: "4px 18px", border: `5px solid ${C.gold}`, minWidth: 120, textAlign: "center", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{value}</div>
    </div>
  );
};
const Slam: React.FC<{ t: number; at: number; text: string; top: number; size?: number; bg?: string; color?: string; hold?: number; rot?: number }> = ({ t, at: a, text, top, size = 110, bg, color, hold = 0.6, rot = -3 }) => {
  const u = t - a;
  if (u < 0 || u > hold + 0.15) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: 1 - k(u, hold, 0.15), zIndex: 30 }}>
      <PixelText text={text} size={size} bg={bg} color={color} style={{ transform: `scale(${interpolate(u, [0, 0.16], [2.3, 1], clamp)}) rotate(${rot}deg)` }} />
    </div>
  );
};
// quest world: sky, hills, five provider castles, a path (216 x 384 grid, 5 px per cell)
const CASTLE_X = (i: number) => 6 + i * 42;
const QuestBg: React.FC<{ t: number; castles?: boolean; hit?: (i: number) => number }> = ({ t, castles = true, hit }) => {
  const grass: React.ReactNode[] = [];
  for (let i = 0; i < 420; i++) {
    const x = Math.floor(rnd(i, 7) * 216), y = 206 + Math.floor(rnd(i, 9) * 178);
    if (y >= 220 && y <= 238) continue;
    grass.push(<rect key={`g${i}`} x={x} y={y} width={1} height={rnd(i, 3) > 0.6 ? 2 : 1} fill={rnd(i, 11) > 0.5 ? "#69B05A" : "#93D27F"} />);
  }
  const cloud = (cx: number, cy: number, i: number) => {
    const x = ((cx + t * (2 + i)) % 250) - 30;
    return <g key={`cl${i}`}><rect x={x} y={cy} width={22} height={5} fill="#FFF" /><rect x={x + 4} y={cy - 3} width={12} height={3} fill="#FFF" /></g>;
  };
  return (
    <svg width={W} height={H} viewBox="0 0 216 384" shapeRendering="crispEdges" style={{ position: "absolute", inset: 0 }}>
      <rect x={0} y={0} width={216} height={206} fill="#BFE6F5" />
      <rect x={0} y={0} width={216} height={60} fill="#A9DCF0" />
      {[cloud(20, 40, 0), cloud(120, 70, 1), cloud(190, 25, 2)]}
      <rect x={0} y={180} width={216} height={26} fill="#A8D99A" />
      {Array.from({ length: 12 }, (_, i) => <rect key={`h${i}`} x={i * 20 - 6} y={172 + (i % 3) * 3} width={28} height={12} fill="#A8D99A" />)}
      <rect x={0} y={206} width={216} height={178} fill="#7CC36E" />
      {grass}
      <rect x={0} y={222} width={216} height={14} fill="#E8C88A" />
      <rect x={0} y={222} width={216} height={2} fill="#D2AE6C" />
      {castles ? ACCOUNTS.map((a, i) => {
        const x0 = CASTLE_X(i);
        const flash = hit ? Math.max(0, 1 - Math.abs(t - hit(i)) / 0.25) : 0;
        const wave = Math.floor(t * 6 + i) % 2;
        return (
          <g key={`c${i}`}>
            <rect x={x0 + 15} y={118} width={1} height={34} fill="#4A4038" />
            <rect x={x0 + 16} y={118 + wave} width={9} height={6} fill={a.c} />
            <rect x={x0} y={150} width={32} height={56} fill="#C9C3B8" />
            <rect x={x0 - 2} y={138} width={9} height={68} fill="#B8B2A7" />
            <rect x={x0 + 25} y={138} width={9} height={68} fill="#B8B2A7" />
            {[0, 4, 8, 25, 29, 33].map((dx) => <rect key={dx} x={x0 - 2 + dx} y={134} width={2} height={4} fill="#B8B2A7" />)}
            {[4, 10, 16, 22, 28].map((dx) => <rect key={`m${dx}`} x={x0 + dx} y={146} width={3} height={4} fill="#C9C3B8" />)}
            <rect x={x0 + 2} y={160} width={2} height={4} fill="#4E321C" /><rect x={x0 + 28} y={160} width={2} height={4} fill="#4E321C" />
            <rect x={x0 + 11} y={186} width={10} height={20} fill={flash > 0 ? "#FFE58A" : "#4E321C"} />
            <rect x={x0 + 12} y={184} width={8} height={2} fill={flash > 0 ? "#FFE58A" : "#4E321C"} />
            <rect x={x0 + 9} y={168} width={14} height={8} fill={a.c} />
          </g>
        );
      }) : null}
    </svg>
  );
};
const CastleLabels: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <>
    {ACCOUNTS.map((x, i) => (
      <div key={i} style={{ position: "absolute", left: (CASTLE_X(i) + 16) * 5 - 90, width: 180, top: 790, display: "flex", justifyContent: "center", ...popStyle(t, a + i * 0.06, 10, 0.5) }}>
        <div style={{ fontFamily: PIXEL, fontSize: 22, color: "#FFF", background: x.c, padding: "6px 10px", border: "4px solid #2C2420", whiteSpace: "nowrap" }}>{x.n.toUpperCase()}</div>
      </div>
    ))}
  </>
);

const Bot: React.FC<{ t: number; prop?: BotProp; hat?: BotHat; px?: number; x: number; y: number; a?: number; flip?: boolean; seed?: number; grey?: boolean }> = ({ t, prop = "none", hat = "none", px = 7, x, y, a = -1, flip, seed = 0, grey }) => {
  const st = a >= 0 ? popStyle(t, a, 26, 0.3) : {};
  const hop = Math.abs(Math.sin(t * 5 + seed)) * -8;
  return (
    <div style={{ position: "absolute", left: x, top: y, ...st }}>
      <div style={{ transform: `translateY(${hop}px)` }}><PixelBot px={px} t={t} prop={prop} hat={hat} flip={flip} seed={seed} grey={grey} /></div>
    </div>
  );
};
// our own pixel bot as click cursor: hops in an arc from target to target, orange ripple on landing
const CursorBot: React.FC<{ t: number; path: { x: number; y: number; at: number }[]; px?: number }> = ({ t, path, px = 6 }) => {
  if (t < path[0].at - 0.2) return null;
  let i = path.findIndex((p, j) => j + 1 >= path.length || t < path[j + 1].at);
  if (i < 0) i = path.length - 1;
  const a = path[i], b = path[Math.min(i + 1, path.length - 1)];
  const hopDur = 0.28;
  const q = b === a ? 0 : interpolate(t, [b.at - hopDur, b.at], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const x = a.x + (b.x - a.x) * q, y = a.y + (b.y - a.y) * q - Math.sin(q * Math.PI) * 90;
  const land = path.reduce((acc, p) => (t >= p.at && t - p.at < 0.35 ? p : acc), null as null | { x: number; y: number; at: number });
  const r = land ? (t - land.at) / 0.35 : 0;
  return (
    <>
      {land ? <div style={{ position: "absolute", left: land.x - 40 * (0.4 + r), top: land.y - 40 * (0.4 + r), width: 80 * (0.4 + r), height: 80 * (0.4 + r), borderRadius: "50%", border: `5px solid ${C.orange}`, opacity: 1 - r, zIndex: 20 }} /> : null}
      <div style={{ position: "absolute", left: x - px * 6.5, top: y - px * 15, zIndex: 21, transform: `scaleY(${land && r < 0.3 ? 0.88 : 1})`, transformOrigin: "50% 100%" }}><Knight px={px} /></div>
    </>
  );
};

// workplaces as the "castles" of the quest world
const ACCOUNTS = [
  { n: "Büro", c: "#3E8EF7" }, { n: "Lager", c: "#F2A531" }, { n: "Werkstatt", c: "#E5484D" }, { n: "Küche", c: "#1E9E57" }, { n: "Auto", c: "#6B4FD8" },
];

// ---------- small icons ----------
const Warn: React.FC<{ size: number; sym?: string; color?: string }> = ({ size, sym = "!", color = C.gold }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 100 90">
    <path d="M50 6 L95 84 L5 84 Z" fill={color} stroke="#2C2420" strokeWidth={7} strokeLinejoin="round" />
    <text x="50" y="74" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={800} fontSize={sym.length > 1 ? 30 : 48} fill="#2C2420">{sym}</text>
  </svg>
);
const Monitor: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48"><rect x="4" y="6" width="40" height="27" rx="3" fill="#2C2C30" /><rect x="8" y="10" width="32" height="19" rx="1.5" fill="#3E8EF7" /><rect x="20" y="33" width="8" height="6" fill="#2C2C30" /><rect x="13" y="39" width="22" height="4" rx="2" fill="#2C2C30" /></svg>
);
const Ladder: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48"><path d="M14 44 L20 4 M34 44 L28 4" stroke="#B07A1E" strokeWidth={4} strokeLinecap="round" />{[10, 18, 26, 34, 41].map((y) => <path key={y} d={`M${15 + (44 - y) * 0.15 - 1} ${y} L${33 - (44 - y) * 0.15 + 1} ${y}`} stroke="#B07A1E" strokeWidth={3.5} strokeLinecap="round" />)}</svg>
);
const Door: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48"><rect x="10" y="4" width="28" height="40" rx="2" fill="#8C5A34" /><rect x="14" y="8" width="20" height="14" rx="1" fill="#A8744A" /><rect x="14" y="25" width="20" height="15" rx="1" fill="#A8744A" /><circle cx="31" cy="25" r="2" fill="#F5C542" /></svg>
);
const Gear: React.FC<{ size: number; rot?: number }> = ({ size, rot = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ transform: `rotate(${rot}deg)` }}>
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x="21" y="2" width="6" height="10" rx="1.5" fill="#5B6670" transform={`rotate(${i * 45} 24 24)`} />)}
    <circle cx="24" cy="24" r="14" fill="#5B6670" /><circle cx="24" cy="24" r="6" fill="#F4F3EF" />
  </svg>
);
const Clock: React.FC<{ size: number; t: number; speed?: number }> = ({ size, t, speed = 360 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="#FFF" stroke={C.ink} strokeWidth={3.5} />
    <path d="M24 24 L24 11" stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" transform={`rotate(${t * speed * 0.08} 24 24)`} />
    <path d="M24 24 L24 7" stroke={C.red} strokeWidth={2.5} strokeLinecap="round" transform={`rotate(${t * speed} 24 24)`} /><circle cx="24" cy="24" r="2.5" fill={C.ink} /></svg>
);

// ---------- hook pills (frame 0 = thumbnail) ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const m = k(t, 0.95, 0.35, Easing.inOut(Easing.cubic));
  const strike = k(t, 0.55, 0.3, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 60, padding: "10px 26px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow }}>
        Pflicht ab{" "}
        <span style={{ position: "relative", display: "inline-block", color: C.red }}>
          Mitarbeiter 1
          <span style={{ position: "absolute", left: -4, right: -4, top: "52%", height: 6, background: C.red, borderRadius: 3, transform: `scaleX(${strike})`, transformOrigin: "0% 50%", opacity: 0.0 }} />
        </span>
      </div>
      <div style={{ ...pill, marginTop: -6 }}>
        Claude{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -8, right: -8, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>10 Minuten</span>
        </span>
      </div>
    </div>
  );
};

// ---------- split hook: employee #1, the missing paper, accident + authority ----------
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const amt = t > A.amt - 0.1;
  return (
    <>
      <Card style={{ left: 60, top: 270, width: 300, height: 380, padding: 22, boxSizing: "border-box", textAlign: "center", transform: `rotate(-2deg)` }}>
        <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim }}>MITARBEITER</div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 76, color: C.ink, lineHeight: 1.1 }}>#1</div>
        <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}><Knight px={11} color="#3E8EF7" /></div>
      </Card>
      <Card style={{ left: 390, top: 260, width: 400, height: 470, padding: 26, boxSizing: "border-box", transform: `rotate(1.5deg) translateX(${shakeAt(t, A.fehlt, 6)}px)`, ...popStyle(t, A.papier - 0.15, 24, 0.7) }}>
        <div style={{ fontFamily: MONO, fontSize: 17, color: C.dim }}>PFLICHTDOKUMENT · § 5 ARBSCHG</div>
        <div style={{ marginTop: 12, fontFamily: fonts.bold, fontSize: 34, color: C.ink, lineHeight: 1.15, minHeight: 80 }}>{typed("Gefährdungs­beurteilung", t, A.gefaehrdung - 0.1, A.gefaehrdung + 0.7) || " "}</div>
        {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ marginTop: 18, height: 14, width: `${88 - (i % 3) * 18}%`, borderRadius: 7, background: C.line }} />)}
        <Stamp t={t} at={A.fehlt} text="FEHLT" size={70} rot={-12} style={{ left: 90, top: 200 }} />
      </Card>
      <div style={{ position: "absolute", left: 820, top: 300, ...popStyle(t, A.unfall - 0.1, 20, 0.4) }}>
        <div style={{ transform: `translateX(${shakeAt(t, A.unfall, 8)}px)` }}><Warn size={190} /></div>
        <div style={{ marginTop: 6, display: "flex", justifyContent: "center" }}><Tag text="UNFALL" color={C.red} size={26} /></div>
      </div>
      {amt ? (
        <Card style={{ left: 800, top: 560, width: 230, height: 190, padding: 18, boxSizing: "border-box", transform: `rotate(3deg) translateX(${shakeAt(t, A.amt, 6)}px)`, ...popStyle(t, A.amt - 0.1, 20, 0.5) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 16, color: "#2E5C8A" }}>AMT FÜR ARBEITSSCHUTZ</div>
          <div style={{ marginTop: 12, fontFamily: fonts.bold, fontSize: 24, color: C.ink, lineHeight: 1.2 }}>Bitte vorlegen:</div>
          <div style={{ marginTop: 6, fontFamily: fonts.medium, fontSize: 20, color: C.red }}>{typed("Gefährdungsbeurteilung", t, A.sehen - 0.25, A.sehen + 0.35)}</div>
        </Card>
      ) : null}
    </>
  );
};

// ---------- full: Claude writes it, 10 minutes ----------
const FullClaude: React.FC<{ t: number }> = ({ t }) => {
  const a = A.claude0 - 0.25;
  const grow = k(t, a, 0.5, Easing.out(Easing.back(1.4)));
  const secs = Math.round(interpolate(t, [A.zehn - 0.1, A.minuten + 0.5], [600, 0], clamp));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.04 * k(t, a, 1.4)})`, transformOrigin: "50% 60%" }}>
        <QuestBg t={t} castles={false} />
        <div style={{ position: "absolute", left: W / 2 - (13 * 16) / 2, top: 1290 - 17 * 16 + Math.sin(t * 6) * 6, transform: `scale(${0.4 + 0.6 * grow})`, transformOrigin: "50% 100%" }}>
          <div style={{ position: "absolute", left: -70, top: -70, right: -70, bottom: -20, background: "radial-gradient(circle, rgba(255,229,138,0.75), rgba(255,229,138,0) 65%)" }} />
          <div style={{ position: "absolute", left: 30, top: -70, display: "flex", alignItems: "center", gap: 8, background: "#FFF", border: "5px solid #2C2420", padding: "6px 12px" }}><ClaudeMark size={30} /><span style={{ fontFamily: PIXEL, fontSize: 22, color: C.ink }}>CLAUDE</span></div>
          <Knight px={16} crown />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", ...popStyle(t, a, 14, 0.3) }}>
        <PixelText text="CLAUDE SCHREIBT SIE" size={60} color="#2C2420" bg={C.gold} style={{ transform: `scale(${interpolate(t - a, [0, 0.16], [2.2, 1], clamp)}) rotate(-3deg)` }} />
      </div>
      {t > A.zehn - 0.15 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", ...popStyle(t, A.zehn - 0.15, 14, 0.4) }}>
          <Counter label="ZEIT" value={`${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`} t={t} bumpAt={[A.minuten + 0.5]} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- split: you tell Claude what you do ----------
const SceneBeschreiben: React.FC<{ t: number }> = ({ t }) => {
  const items = [
    { a: A.raeume, El: <Door size={64} />, l: "Räume", v: "Büro, Lager, Werkstatt" },
    { a: A.geraete, El: <Gear size={64} rot={t * 60} />, l: "Geräte", v: "Kreissäge, Hubwagen" },
    { a: A.bildschirm, El: <Monitor size={64} />, l: "Bildschirm", v: "4 Leute im Büro" },
    { a: A.leiter, El: <Ladder size={64} />, l: "Leiter", v: "2 Leute im Lager" },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 60, ...popStyle(t, A.du1 - 0.1, 10, 0.8) }}><LabelChip text="Du sagst Claude, was ihr macht" dot={C.orange} size={30} /></div>
      <Card style={{ left: 70, top: 160, width: 940, height: 610, padding: 26, boxSizing: "border-box", ...popStyle(t, A.du1, 20, 0.85) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ClaudeMark size={32} /><span style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>Claude · Neuer Chat</span></div>
        <div style={{ marginTop: 18, marginLeft: "auto", width: 760, background: "#F0EEE8", borderRadius: 18, padding: "16px 22px", fontFamily: fonts.medium, fontSize: 26, color: C.ink, lineHeight: 1.35, minHeight: 72 }}>
          {typed("Wir sind 6 Leute. Schreinerei mit Büro, Lager und Werkstatt.", t, A.sagst, A.macht + 0.3)}
        </div>
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {items.map((it, i) => (t > it.a - 0.12 ? (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: "#FFF", border: `2px solid ${C.line}`, borderRadius: 16, padding: "14px 18px", ...popStyle(t, it.a - 0.12, 10, 0.6) }}>
              {it.El}
              <div>
                <div style={{ fontFamily: fonts.bold, fontSize: 28, color: C.ink }}>{it.l}</div>
                <div style={{ fontFamily: fonts.medium, fontSize: 21, color: C.dim }}>{it.v}</div>
              </div>
            </div>
          ) : <div key={i} />))}
        </div>
      </Card>
      <CursorBot t={t} path={[{ x: 500, y: 470, at: A.raeume - 0.1 }, { x: 960, y: 470, at: A.geraete - 0.1 }, { x: 500, y: 590, at: A.bildschirm - 0.1 }, { x: 960, y: 590, at: A.leiter - 0.1 }]} />
    </>
  );
};

// ---------- full (quest): Claude walks every workplace, hazards pop ----------
const HAZ = [
  { key: "stolpern", sym: "!", text: "STOLPERN!", bg: C.orange, castle: 1 },
  { key: "strom", sym: "⚡", text: "STROM!", bg: "#3E8EF7", castle: 2 },
  { key: "laerm", sym: "♪", text: "LÄRM!", bg: "#6B4FD8", castle: 2 },
  { key: "hitze", sym: "°C", text: "HITZE!", bg: C.red, castle: 3 },
];
const FullCheck: React.FC<{ t: number }> = ({ t }) => {
  const castleCx = (i: number) => (CASTLE_X(i) + 16) * 5;
  const times = [A.stolpern, A.strom, A.laerm, A.hitze];
  // knight walks along the path from castle 0 to 4
  const walk = interpolate(t, [A.geht, A.hitze + 0.5], [castleCx(0) - 60, castleCx(4) - 60], clamp);
  const zoom = 1 + 0.035 * k(t, A.geht, 4, Easing.inOut(Easing.sin));
  const done = times.filter((a) => t > a).length;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 62%" }}>
        <QuestBg t={t} hit={(i) => { const h = HAZ.findIndex((x) => x.castle === i); return h >= 0 ? times[h] : (i === 0 ? A.geht + 0.2 : A.hitze + 0.4); }} />
        <CastleLabels t={t} a={A.geht - 0.05} />
        {HAZ.map((h, i) => (t > times[i] - 0.08 ? (
          <div key={i} style={{ position: "absolute", left: castleCx(h.castle) - 60 + (i === 2 ? 70 : i === 1 ? -50 : 0), top: 520 + (i % 2) * 50, ...popStyle(t, times[i] - 0.08, 30, 0.3) }}>
            <div style={{ transform: `translateY(${Math.sin(t * 5 + i) * 6}px)` }}><Warn size={120} sym={h.sym} /></div>
          </div>
        ) : null))}
        <div style={{ position: "absolute", left: walk, top: 1060 + Math.abs(Math.sin(t * 9)) * -12 }}>
          <div style={{ position: "absolute", left: 6, top: -58, display: "flex", alignItems: "center", gap: 6, background: "#FFF", border: "4px solid #2C2420", padding: "4px 8px" }}><ClaudeMark size={24} /><span style={{ fontFamily: PIXEL, fontSize: 16, color: C.ink }}>CLAUDE</span></div>
          <Knight px={10} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center", ...popStyle(t, A.geht - 0.05, 10, 0.8) }}><LabelChip text="Jeder Arbeitsplatz wird geprüft" dot={C.green} size={32} /></div>
      {HAZ.map((h, i) => <Slam key={i} t={t} at={times[i] - 0.04} text={h.text} top={300} size={90} bg={h.bg} hold={Math.min(0.55, (times[i + 1] ?? times[i] + 0.6) - times[i] - 0.1)} rot={i % 2 ? 3 : -3} />)}
      <div style={{ position: "absolute", right: 40, top: 1400 }}><Counter label="GEFAHREN" value={`${done}`} t={t} bumpAt={times} /></div>
    </AbsoluteFill>
  );
};

// ---------- split: what almost everyone forgets: stress + time pressure ----------
const ScenePsyche: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 70, top: 60, ...popStyle(t, A.und1 - 0.1, 10, 0.8) }}><LabelChip text="Was fast alle vergessen" dot={C.red} size={30} /></div>
    <Card style={{ left: 70, top: 150, width: 450, height: 360, padding: 28, boxSizing: "border-box", textAlign: "center", ...popStyle(t, A.stress - 0.12, 20, 0.6) }}>
      <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim }}>PSYCHISCHE BELASTUNG</div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "center", transform: `translateX(${Math.sin(t * 40) * (t > A.stress && t < A.stress + 0.5 ? 4 : 0)}px)` }}><Knight px={9} color="#F25CA2" /></div>
      <div style={{ marginTop: 16, fontFamily: fonts.bold, fontSize: 48, color: C.ink }}>Stress</div>
    </Card>
    <Card style={{ left: 560, top: 150, width: 450, height: 360, padding: 28, boxSizing: "border-box", textAlign: "center", ...popStyle(t, A.zeitdruck - 0.12, 20, 0.6) }}>
      <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim }}>ARBEITSZEIT</div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}><Clock size={140} t={t} speed={900} /></div>
      <div style={{ marginTop: 16, fontFamily: fonts.bold, fontSize: 48, color: C.ink }}>Zeitdruck</div>
    </Card>
    {t > A.seit - 0.1 ? <div style={{ position: "absolute", left: 0, right: 0, top: 535, display: "flex", justifyContent: "center", ...popStyle(t, A.seit - 0.1, 10, 0.6) }}><Tag text="§ 5 ABS. 3 NR. 6 ARBSCHG" color={C.ink} size={26} /></div> : null}
    <Stamp t={t} at={A.pflicht} text="PFLICHT SEIT 2013" size={52} rot={-6} style={{ left: 250, top: 610 }} />
  </>
);

// ---------- split: measure, who, by when ----------
const MROWS = [
  { g: "Kabel quer im Lager", m: "Kabelkanal legen", w: "Tom", b: "15.11." },
  { g: "Leiter wackelt", m: "Neue Leiter kaufen", w: "Anna", b: "30.10." },
  { g: "Zeitdruck Kundendienst", m: "Puffer im Kalender", w: "Chef", b: "01.12." },
];
const SceneMassnahmen: React.FC<{ t: number }> = ({ t }) => {
  const rowAt = (i: number) => A.gefahr0 + i * 0.32;
  const col = (a: number) => k(t, a - 0.1, 0.25);
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 60, ...popStyle(t, A.fuer - 0.1, 10, 0.8) }}><LabelChip text="Zu jeder Gefahr eine Maßnahme" dot={C.green} size={30} /></div>
      <Card style={{ left: 50, top: 160, width: 980, height: 560, overflow: "hidden", ...popStyle(t, A.fuer, 20, 0.85) }}>
        <div style={{ display: "grid", gridTemplateColumns: "300px 300px 150px 1fr", padding: "18px 24px", borderBottom: `2px solid ${C.line}`, fontFamily: MONO, fontWeight: 800, fontSize: 19, color: C.dim, letterSpacing: "0.08em" }}>
          <span>GEFAHR</span><span style={{ opacity: col(A.massnahme) }}>MASSNAHME</span><span style={{ opacity: col(A.wer2) }}>WER</span><span style={{ opacity: col(A.bis) }}>BIS</span>
        </div>
        {MROWS.map((r, i) => (t > rowAt(i) - 0.05 ? (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "300px 300px 150px 1fr", alignItems: "center", minHeight: 150, padding: "0 24px", borderBottom: `1px solid ${C.line}`, ...popStyle(t, rowAt(i) - 0.05, 8, 0.85) }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.semibold, fontSize: 25, color: C.ink, paddingRight: 10 }}><Warn size={40} />{r.g}</span>
            <span style={{ fontFamily: fonts.medium, fontSize: 25, color: C.green, opacity: col(A.massnahme + i * 0.12), paddingRight: 10 }}>{r.m}</span>
            <span style={{ opacity: col(A.wer2 + i * 0.08) }}><Tag text={r.w.toUpperCase()} color="#2E5C8A" size={20} /></span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: C.ink, opacity: col(A.bis + i * 0.08) }}>{r.b}</span>
          </div>
        ) : null))}
      </Card>
      <CursorBot t={t} path={[{ x: 420, y: 205, at: A.massnahme }, { x: 720, y: 205, at: A.wer2 }, { x: 870, y: 205, at: A.bis }]} />
    </>
  );
};

// ---------- split: finished document to sign, no consultant, no old binder ----------
const SceneDokument: React.FC<{ t: number }> = ({ t }) => {
  const sig = k(t, A.unterschreiben, 0.6, Easing.inOut(Easing.cubic));
  return (
    <>
      <Card style={{ left: 70, top: 90, width: 520, height: 680, padding: 30, boxSizing: "border-box", transform: "rotate(-1.5deg)", ...popStyle(t, A.raus0 - 0.1, 24, 0.7) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ClaudeMark size={28} /><span style={{ fontFamily: MONO, fontSize: 17, color: C.dim }}>ERSTELLT MIT CLAUDE</span></div>
        <div style={{ marginTop: 16, fontFamily: fonts.bold, fontSize: 36, color: C.ink, lineHeight: 1.15 }}>Gefährdungs­beurteilung</div>
        <div style={{ marginTop: 4, fontFamily: fonts.medium, fontSize: 22, color: C.dim }}>Schreinerei · 6 Beschäftigte</div>
        {["Büro", "Lager", "Werkstatt", "Psychische Belastung"].map((s, i) => (
          <div key={i} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12, ...popStyle(t, A.fertiges + i * 0.1, 6, 0.85) }}>
            <span style={{ width: 34, height: 34, borderRadius: 8, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={24} p={k(t, A.fertiges + i * 0.1 + 0.1, 0.2)} /></span>
            <span style={{ fontFamily: fonts.semibold, fontSize: 25, color: C.ink }}>{s}</span>
          </div>
        ))}
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 40, borderTop: `2px solid ${C.ink}`, paddingTop: 8, fontFamily: MONO, fontSize: 16, color: C.dim }}>UNTERSCHRIFT ARBEITGEBER</div>
        <svg width={360} height={110} viewBox="0 0 360 110" style={{ position: "absolute", left: 50, bottom: 52 }}>
          <path d="M10 80 C 40 10, 60 10, 70 70 S 110 100, 130 40 S 170 20, 180 70 C 200 95, 230 30, 260 55 S 320 70, 350 40" fill="none" stroke="#1E3A8A" strokeWidth={5} strokeLinecap="round" strokeDasharray={700} strokeDashoffset={700 * (1 - sig)} />
        </svg>
      </Card>
      <Stamp t={t} at={A.unterschreiben + 0.55} text="FERTIG" color={C.green} size={60} rot={-10} style={{ left: 330, top: 470 }} />
      <Card style={{ left: 630, top: 150, width: 380, height: 260, padding: 24, boxSizing: "border-box", ...popStyle(t, A.kein0 - 0.1, 20, 0.6) }}>
        <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim }}>EXTERNER BERATER</div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 16 }}><Knight px={6} grey /><span style={{ fontFamily: fonts.bold, fontSize: 30, color: C.dim }}>Termin in 3 Wochen</span></div>
        <svg width={330} height={200} viewBox="0 0 330 200" style={{ position: "absolute", left: 24, top: 30 }}><path d="M10 10 L320 190 M320 10 L10 190" stroke={C.red} strokeWidth={9} strokeLinecap="round" strokeDasharray={360} strokeDashoffset={360 * (1 - k(t, A.berater, 0.3))} /></svg>
      </Card>
      <Card style={{ left: 630, top: 450, width: 380, height: 300, padding: 24, boxSizing: "border-box", ...popStyle(t, A.kein1 - 0.1, 20, 0.6) }}>
        <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim }}>ORDNER VON FRÜHER</div>
        <div style={{ marginTop: 16, width: 120, height: 170, margin: "16px auto 0", background: "#9C978E", borderRadius: 6, position: "relative", boxShadow: "inset -14px 0 0 #8A857C" }}>
          <div style={{ position: "absolute", left: 18, right: 30, top: 24, height: 50, background: "#E7E4DD", borderRadius: 3, fontFamily: MONO, fontSize: 14, color: C.dim, display: "flex", alignItems: "center", justifyContent: "center" }}>2014</div>
          <div style={{ position: "absolute", left: 40, bottom: 20, width: 24, height: 24, borderRadius: "50%", border: "4px solid #6E6A63" }} />
        </div>
        <svg width={330} height={240} viewBox="0 0 330 240" style={{ position: "absolute", left: 24, top: 30 }}><path d="M10 10 L320 230 M320 10 L10 230" stroke={C.red} strokeWidth={9} strokeLinecap="round" strokeDasharray={400} strokeDashoffset={400 * (1 - k(t, A.ordner + 0.1, 0.3))} /></svg>
      </Card>
    </>
  );
};

// ---------- end: guide pages scroll + trigger ----------
const PAGES = [1, 2, 3, 4, 5, 6, 7].map((n) => staticFile(`gefahr-guide/p${n}.png`));
const SceneEnd: React.FC<{ t: number }> = ({ t }) => {
  const a = A.komm - 0.1;
  const pw = 360, ph = Math.round((pw * 842) / 595), gap = 22, pitch = pw + gap;
  const s0 = A.prompts - 0.2;
  const sx = interpolate(t, [s0, GW_END], [0, (PAGES.length - 2) * pitch], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const v = Math.abs(interpolate(t + 0.04, [s0, GW_END], [0, (PAGES.length - 2) * pitch], { ...clamp, easing: Easing.inOut(Easing.cubic) }) - sx);
  const showTrig = t > a;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", justifyContent: "center", opacity: showTrig ? 1 : 0, ...(showTrig ? popStyle(t, a, 14, 0.5) : {}) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px" }}>KOMMENTIER:</div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 26px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>{typed("GEFAHR", t, A.gefahr1 - 0.1, A.gefahr1 + 0.25) || " "}</div>
      </div>
      {!showTrig ? <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", ...popStyle(t, A.elf - 0.1, 10, 0.6) }}><Tag text="ALLE 11 GEFÄHRDUNGSFAKTOREN" color={C.ink} size={34} /></div> : null}
      <div style={{ position: "absolute", left: 0, top: 200, width: W, height: ph + 40, transform: `rotate(-3deg)`, opacity: k(t, s0 - 0.05, 0.25) }}>
        {PAGES.map((src, i) => (
          <div key={i} style={{ position: "absolute", left: 120 + i * pitch - sx, top: 10, width: pw, height: ph }}>
            {[0, 1, 2, 3].map((j) => <Img key={j} src={src} style={{ position: "absolute", left: -j * Math.min(14, v * 0.35), top: 0, width: pw, height: ph, borderRadius: 8, opacity: j === 0 ? 1 : 0.22, boxShadow: j === 0 ? "0 16px 36px rgba(0,0,0,0.25)" : "none" }} />)}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", ...popStyle(t, A.guide - 0.1, 8, 0.6) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(20,20,20,0.86)", borderRadius: 999, padding: "10px 20px" }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.green }} />
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", color: "#FFF" }}>GUIDE · {PAGES.length} SEITEN · PER DM</span>
        </div>
      </div>
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }>; full?: boolean };
const SCENES: Scene[] = [
  { from: 0, to: A.claude0 - 0.3, origin: "50% 50%", El: SceneHook },
  { from: A.claude0 - 0.3, to: A.du1 - 0.1, origin: "50% 50%", El: FullClaude, full: true },
  { from: A.du1 - 0.1, to: A.claude2 - 0.2, origin: "50% 45%", El: SceneBeschreiben },
  { from: A.claude2 - 0.2, to: A.und1 - 0.1, origin: "50% 50%", El: FullCheck, full: true },
  { from: A.und1 - 0.1, to: A.fuer - 0.15, origin: "50% 45%", El: ScenePsyche },
  { from: A.fuer - 0.15, to: A.raus0 - 0.15, origin: "50% 45%", El: SceneMassnahmen },
  { from: A.raus0 - 0.15, to: A.prompts - 0.3, origin: "50% 45%", El: SceneDokument },
  { from: A.prompts - 0.3, to: 999, origin: "50% 45%", El: SceneEnd },
];

const NUM: Record<string, string> = { zehn: "10", elf: "11", zweitausenddreizehn: "2013" };
// ---------- captions: orange pill on the seam, active word in a black pill ----------
const chunks = (() => {
  const out: { start: number; end: number; words: { w: string; s: number }[] }[] = [];
  let cur: Cap[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => ({ w: (NUM[c.text.replace(/[.,!?:]/g, "").toLowerCase()] ?? c.text.replace(/[.,!?:]/g, "")).toUpperCase(), s: c.startMs / 1000 })) });
    cur = [];
  };
  for (const c of CAPS) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 20) || (cur.length && len > 22)) flush();
    cur.push(c);
    if (/[.,!?:]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
})();
const SeamCaption: React.FC<{ t: number; y: number }> = ({ t, y }) => {
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = pop(t, c.start - 0.04, 0.16);
  const fs = c.words.reduce((n, w) => n + w.w.length + 1, 0) > 19 ? 40 : 46;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.08), background: C.orange, borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: MONO, fontWeight: 700, fontSize: fs, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(120,50,25,0.30)" }}>
        {(() => {
          const cw = fs * 0.74, gapW = fs * 0.5;
          const xs: number[] = []; let acc = 0;
          c.words.forEach((w) => { xs.push(acc); acc += w.w.length * cw + gapW; });
          const ws = c.words.map((w) => w.w.length * cw - fs * 0.14);
          let i = c.words.findIndex((w, j) => j + 1 >= c.words.length || t < c.words[j + 1].s - 0.03);
          if (i < 0) i = c.words.length - 1;
          const prev = Math.max(0, i - 1);
          const q = i === 0 ? 1 : interpolate(t, [c.words[i].s - 0.03, c.words[i].s + 0.05], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          const px = xs[prev] + (xs[i] - xs[prev]) * q, pw = ws[prev] + (ws[i] - ws[prev]) * q;
          return (
            <div style={{ position: "relative", display: "flex", gap: gapW }}>
              <div style={{ position: "absolute", left: px - 12, top: -4, width: pw + 24, bottom: -4, background: "#111111", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.22)" }} />
              {c.words.map((w, j) => <span key={j} style={{ position: "relative", display: "inline-block", color: "#FFFFFF" }}>{w.w}</span>)}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

// ---------- master ----------
const FOCUS = { x: 0.512, y: 0.597, scale: 1.0 };
const SPLIT_SRC_TOP = 430;
export const GefahrOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = camera(t, scene.from, scene.to);
  const dx = Math.sin(t * 0.6) * 6, dy = Math.cos(t * 0.45) * 5;
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTop = Math.min(PH, Math.max(H - vh, PH - SPLIT_SRC_TOP * s));
  const avPush = 1 + 0.035 * Math.abs(Math.sin((t - scene.from) * 0.9));
  const El = scene.El;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${avPush})`, transformOrigin: "50% 40%" }}>
        <OffthreadVideo src={staticFile("render-fpn-gefaehrdung-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {scene.full ? <El t={t} /> : (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
          </div>
          {t < A.claude0 - 0.3 ? <HookPills t={t} /> : null}
        </div>
      )}
      <SeamCaption t={t} y={scene.full ? 1610 : PH} />
    </AbsoluteFill>
  );
};
