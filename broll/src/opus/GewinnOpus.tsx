import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-gewinnermittlung/captions.json";
import { PixelBot, BotProp, BotHat } from "../components/PixelBot";

// FP-N "Gewinnermittlung / Anlage EÜR" (Henri 2026-10-20), gebaut wie BelegeOpus: Split + Vollbild-Momente im Arena-Stil,
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
  minus0: at("minus", 0), zweiten: at("zweiten"), klasse: at("klasse"), steuerberater: at("steuerberater"), sechs0: at("sechshundert", 0), jahr0: at("jahr", 0),
  einnahmen: at("einnahmen"), minus1: at("minus", 1), ausgaben: at("ausgaben"), gewinnermittlung: at("gewinnermittlung"), nicht: at("nicht"),
  formular: at("formular"), eur: at("einnahmenüberschussrechnung"), selbststaendige: at("selbstständige"), bilanz: at("bilanz"), abgeben: at("abgeben"), jedes: at("jedes"),
  arbeit: at("arbeit"), lad: at("lad"), kontoauszuege: at("kontoauszüge"), ganzen: at("ganzen"), rechnungen: at("rechnungen"), geschrieben: at("geschrieben"), bekommen: at("bekommen"),
  sortiert: at("sortiert"), buchung: at("buchung"), zeile0: at("zeile", 0), trennt: at("trennt"), privates: at("privates"), rechnet: at("rechnet"), gewinn0: at("gewinn", 0),
  hast: at("hast", 1), achthundert: at("achthundert"), netto: at("netto"), verteilt: at("verteilt"), mehrere: at("mehrere"), finanzamt: at("finanzamt"),
  raus1: at("raus", 1), liste: at("liste"), zahl: at("zahl"), zeile1: at("zeile", 1), elster: at("elster"), tippst: at("tippst"), schickst: at("schickst"),
  sechs1: at("sechshundert", 1), bleiben: at("bleiben"), komm: at("kommentier"), gewinn1: at("gewinn", 1), anleitung: at("anleitung"),
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

// EÜR lines as the "castles" of the quest world (generic labels, no real form numbers on the castles)
const ACCOUNTS = [
  { n: "Erlöse", c: "#1E9E57" }, { n: "Material", c: "#3E8EF7" }, { n: "Telefon", c: "#C2185B" }, { n: "Software", c: "#6B4FD8" }, { n: "Privat", c: "#8A877F" },
];

// ---------- hook pills (frame 0 = thumbnail) ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const m = k(t, 0.95, 0.35, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 60, padding: "10px 26px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow }}>
        Gewinnermittlung <span style={{ color: C.red, display: "inline-block", transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, k(t, 0.45, 0.3)) * Math.PI)})` }}>600 €</span>
      </div>
      <div style={{ ...pill, marginTop: -6 }}>
        Claude macht sie{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -8, right: -8, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>gratis</span>
        </span>
      </div>
    </div>
  );
};

// ---------- split hook: school exercise book vs the tax advisor's invoice ----------
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const fee = interpolate(t, [Math.max(0.5, A.sechs0 - 0.1), A.sechs0 + 0.5], [0, 600], clamp);
  const sums = [{ q: "12 − 5 =", a: "7" }, { q: "48 − 19 =", a: "29" }, { q: "100 − 37 =", a: "63" }];
  return (
    <>
      <Card style={{ left: 70, top: 250, width: 470, height: 520, overflow: "hidden", transform: `rotate(-2deg) translateX(${shakeAt(t, A.sechs0, 5)}px)` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(62,142,247,0.18) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(62,142,247,0.18) 1.5px, transparent 1.5px)", backgroundSize: "34px 34px" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: C.blue, color: "#FFF", fontFamily: fonts.bold, fontSize: 28, display: "flex", alignItems: "center", padding: "0 24px" }}>Mathe · 2. Klasse</div>
        {sums.map((s, i) => {
          const a = 0.1 + i * 0.28;
          return (
            <div key={i} style={{ position: "absolute", left: 36, top: 110 + i * 120, display: "flex", alignItems: "baseline", gap: 18, fontFamily: "Caveat, " + fonts.medium, fontSize: 64, color: "#2B3A67", ...popStyle(t, a, 10, 0.8) }}>
              <span>{s.q}</span>
              <span style={{ color: C.green, fontWeight: 800 }}>{t > a + 0.3 ? s.a : ""}</span>
              {t > a + 0.45 ? <Check size={46} color={C.green} p={k(t, a + 0.45, 0.25)} /> : null}
            </div>
          );
        })}
      </Card>
      <Card style={{ left: 570, top: 250, width: 440, height: 520, padding: 30, boxSizing: "border-box", ...popStyle(t, A.steuerberater - 0.1, 24, 0.7) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#5B6CF0", color: "#FFF", fontFamily: fonts.bold, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>StB</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: C.ink }}>Steuerkanzlei</div>
        </div>
        <div style={{ marginTop: 26, fontFamily: MONO, fontSize: 18, color: C.dim }}>RECHNUNG · LEISTUNG</div>
        <div style={{ marginTop: 8, fontFamily: fonts.bold, fontSize: 34, color: C.ink, lineHeight: 1.2 }}>Gewinnermittlung (EÜR)</div>
        <div style={{ marginTop: 6, fontFamily: fonts.medium, fontSize: 22, color: C.dim }}>Einnahmen − Ausgaben</div>
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, borderTop: `2px solid ${C.line}`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>PRO JAHR</span>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 58, color: C.red, fontVariantNumeric: "tabular-nums" }}>{eur(fee)}</span>
        </div>
      </Card>
    </>
  );
};

// ---------- full: Einnahmen − Ausgaben = Gewinn, that's all ----------
const FullFormel: React.FC<{ t: number }> = ({ t }) => {
  const zoom = 1 + 0.04 * k(t, A.einnahmen, 3, Easing.inOut(Easing.sin));
  const row = (a: number, text: string, bg: string, color = "#FFF", top: number) =>
    t > a - 0.08 ? <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", ...popStyle(t, a - 0.08, 18, 0.4) }}><PixelText text={text} size={84} bg={bg} color={color} /></div> : null;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 60%" }}>
        <QuestBg t={t} castles={false} />
        {Array.from({ length: 16 }, (_, i) => {
          const a = A.einnahmen + i * 0.05;
          const y = interpolate(t, [a, a + 1.4], [1500, 1150 - (i % 4) * 40], { ...clamp, easing: Easing.out(Easing.cubic) });
          return t > a ? <div key={i} style={{ position: "absolute", left: 120 + (i % 8) * 108, top: y, width: 44, height: 44, background: C.gold, border: "6px solid #B07A1E", boxSizing: "border-box" }} /> : null;
        })}
      </div>
      {row(A.einnahmen, "EINNAHMEN", C.green, "#FFF", 330)}
      {row(A.minus1, "−", "#2C2420", "#FFF", 500)}
      {row(A.ausgaben, "AUSGABEN", C.red, "#FFF", 640)}
      {row(A.gewinnermittlung, "= GEWINN", C.gold, "#2C2420", 830)}
      <Slam t={t} at={A.nicht} text="DAS WAR'S" top={1040} size={110} bg={C.orange} hold={0.7} />
    </AbsoluteFill>
  );
};

// ---------- split: the form, mandatory every year ----------
const FORM = [
  { z: "15", l: "Betriebseinnahmen" }, { z: "29", l: "Waren, Material" }, { z: "51", l: "Telekommunikation" }, { z: "57", l: "Software, Abos" }, { z: "31", l: "Abschreibung" },
];
const SceneFormular: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 70, top: 60, ...popStyle(t, A.formular - 0.1, 10, 0.8) }}><LabelChip text="Das Formular" dot={C.orange} size={30} /></div>
    <Card style={{ left: 70, top: 160, width: 640, height: 610, overflow: "hidden", ...popStyle(t, A.formular, 20, 0.85) }}>
      <div style={{ padding: "18px 26px", background: "#2E5C8A", color: "#FFF" }}>
        <div style={{ fontFamily: MONO, fontSize: 18, opacity: 0.8 }}>ANLAGE</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 52 }}>EÜR</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 20, opacity: 0.9 }}>{typed("Einnahmenüberschussrechnung", t, A.eur - 0.05, A.eur + 0.7)}</div>
      </div>
      {FORM.map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, height: 76, padding: "0 22px", borderBottom: `1px solid ${C.line}`, ...popStyle(t, A.eur + 0.3 + i * 0.12, 8, 0.85) }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 20, color: "#FFF", background: "#2E5C8A", borderRadius: 6, padding: "4px 8px" }}>{f.z}</span>
          <span style={{ fontFamily: fonts.medium, fontSize: 25, color: C.ink, flex: 1 }}>{f.l}</span>
          <span style={{ width: 150, height: 40, borderRadius: 6, border: `2px solid ${C.line}` }} />
        </div>
      ))}
    </Card>
    <Card style={{ left: 740, top: 200, width: 270, height: 250, padding: 22, boxSizing: "border-box", textAlign: "center", ...popStyle(t, A.selbststaendige - 0.1, 20, 0.6) }}>
      <div style={{ fontFamily: MONO, fontSize: 17, color: C.dim }}>MUSS ABGEBEN</div>
      <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}><Knight px={8} /></div>
      <div style={{ marginTop: 8, fontFamily: fonts.bold, fontSize: 24, color: C.ink }}>Selbstständige</div>
    </Card>
    {t > A.bilanz - 0.1 ? <div style={{ position: "absolute", left: 760, top: 480, ...popStyle(t, A.bilanz - 0.1, 10, 0.6) }}><Tag text="OHNE BILANZ" color={C.ink} size={24} /></div> : null}
    <Stamp t={t} at={A.jedes} text="JEDES JAHR" size={48} style={{ left: 640, top: 600 }} />
  </>
);

// ---------- full: Claude takes over ----------
const FullClaude: React.FC<{ t: number }> = ({ t }) => {
  const a = A.arbeit - 0.25;
  const grow = k(t, a, 0.5, Easing.out(Easing.back(1.4)));
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
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", ...popStyle(t, a, 14, 0.3) }}>
        <PixelText text="DIE ARBEIT MACHT CLAUDE" size={58} color="#2C2420" bg={C.gold} style={{ transform: `scale(${interpolate(t - a, [0, 0.16], [2.2, 1], clamp)}) rotate(-3deg)` }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- split: upload a year of statements + invoices ----------
const MONTHS = ["JAN", "FEB", "MÄR", "APR", "MAI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ"];
const SceneUpload: React.FC<{ t: number }> = ({ t }) => {
  const out = Math.round(interpolate(t, [A.geschrieben - 0.1, A.geschrieben + 0.6], [0, 38], clamp));
  const inn = Math.round(interpolate(t, [A.bekommen - 0.1, A.bekommen + 0.6], [0, 124], clamp));
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 60, ...popStyle(t, A.lad - 0.1, 10, 0.8) }}><LabelChip text="Hochladen · einmal im Jahr" dot={C.orange} size={30} /></div>
      <Card style={{ left: 70, top: 160, width: 940, height: 610, padding: 26, boxSizing: "border-box", ...popStyle(t, A.lad, 20, 0.85) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ClaudeMark size={32} /><span style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>Claude · Projekt „EÜR 2025“</span></div>
        <div style={{ marginTop: 18, fontFamily: MONO, fontSize: 18, color: C.dim }}>KONTOAUSZÜGE</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
          {MONTHS.map((m, i) => {
            const a = A.kontoauszuege - 0.1 + i * Math.max(0.05, (A.rechnungen - A.kontoauszuege - 0.2) / 12);
            return t > a ? <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "#F4F3EF", borderRadius: 10, padding: "10px 10px", ...popStyle(t, a, 8, 0.6) }}><PdfIcon size={30} /><span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 20, color: C.ink }}>{m}</span></div> : <div key={i} />;
          })}
        </div>
        <div style={{ marginTop: 24, fontFamily: MONO, fontSize: 18, color: C.dim, opacity: k(t, A.rechnungen - 0.1, 0.2) }}>RECHNUNGEN</div>
        <div style={{ marginTop: 10, display: "flex", gap: 18 }}>
          <div style={{ flex: 1, background: C.greenSoft, borderRadius: 14, padding: "16px 20px", opacity: k(t, A.geschrieben - 0.15, 0.2) }}>
            <div style={{ fontFamily: fonts.medium, fontSize: 22, color: C.ink }}>Geschrieben</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, color: C.green, fontVariantNumeric: "tabular-nums" }}>{out}</div>
          </div>
          <div style={{ flex: 1, background: C.orangeSoft, borderRadius: 14, padding: "16px 20px", opacity: k(t, A.bekommen - 0.15, 0.2) }}>
            <div style={{ fontFamily: fonts.medium, fontSize: 22, color: C.ink }}>Bekommen</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, color: C.orange, fontVariantNumeric: "tabular-nums" }}>{inn}</div>
          </div>
        </div>
      </Card>
    </>
  );
};

// ---------- full (quest): every booking flies into its line, private stuff gets thrown out ----------
const sortAt = (i: number) => A.buchung + ((Math.max(A.trennt, A.buchung + 1.2) - A.buchung) * i) / 8;
const TARGET = [0, 1, 2, 0, 3, 1, 0, 2];
const FullSort: React.FC<{ t: number }> = ({ t }) => {
  const castleCx = (i: number) => (CASTLE_X(i) + 16) * 5;
  const profit = interpolate(t, [A.rechnet - 0.1, A.gewinn0 + 0.6], [0, 31480], clamp);
  const priv = t > A.privates - 0.1;
  const zoom = 1 + 0.035 * k(t, A.sortiert, 5, Easing.inOut(Easing.sin));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 62%" }}>
        <QuestBg t={t} hit={(i) => (i === 4 ? A.privates + 0.1 : sortAt(TARGET.indexOf(i)) + 0.5)} />
        <CastleLabels t={t} a={A.sortiert - 0.05} />
        {TARGET.map((ti, i) => {
          const a = sortAt(i);
          if (t < a) return null;
          const f = k(t, a, 0.5, Easing.inOut(Easing.cubic));
          if (f >= 1) return null;
          const x0 = 500, y0 = 1080, x1 = castleCx(ti) - 30, y1 = 880;
          return <div key={i} style={{ position: "absolute", left: x0 + (x1 - x0) * f, top: y0 + (y1 - y0) * f - Math.sin(f * Math.PI) * 240, transform: `rotate(${f * 300}deg)` }}><Receipt px={6} /></div>;
        })}
        {priv ? (() => {
          const f = k(t, A.privates - 0.1, 0.7, Easing.in(Easing.quad));
          return <div style={{ position: "absolute", left: 500 + 420 * f, top: 1080 - Math.sin(f * Math.PI) * 300 + 300 * f, transform: `rotate(${f * 500}deg)`, opacity: 1 - k(t, A.privates + 0.5, 0.2) }}><Receipt px={7} lost missing={1} /></div>;
        })() : null}
        <div style={{ position: "absolute", left: 470, top: 1060 + Math.abs(Math.sin(t * 8)) * -10 }}>
          <div style={{ position: "absolute", left: 6, top: -58, display: "flex", alignItems: "center", gap: 6, background: "#FFF", border: "4px solid #2C2420", padding: "4px 8px" }}><ClaudeMark size={24} /><span style={{ fontFamily: PIXEL, fontSize: 16, color: C.ink }}>CLAUDE</span></div>
          <Knight px={10} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center", ...popStyle(t, A.sortiert - 0.05, 10, 0.8) }}><LabelChip text="Jede Buchung in die richtige Zeile" dot={C.green} size={32} /></div>
      {priv ? <div style={{ position: "absolute", left: 0, right: 0, top: 280, display: "flex", justifyContent: "center" }}><Slam t={t} at={A.privates - 0.05} text="PRIVAT? RAUS!" top={0} size={70} bg={C.red} hold={0.8} /></div> : null}
      <div style={{ position: "absolute", right: 40, top: 1400 }}><Counter label="GEWINN" value={`${Math.round(profit).toLocaleString("de-DE")} €`} t={t} bumpAt={[A.gewinn0 + 0.6]} /></div>
    </AbsoluteFill>
  );
};

// ---------- split: over 800 € net → spread over several years ----------
const SceneAfa: React.FC<{ t: number }> = ({ t }) => {
  const years = [{ y: "2025", v: 467 }, { y: "2026", v: 467 }, { y: "2027", v: 466 }];
  const split = k(t, A.verteilt - 0.1, 0.5);
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 60, ...popStyle(t, A.hast - 0.1, 10, 0.8) }}><LabelChip text="Abschreibung · macht Claude mit" dot={C.orange} size={30} /></div>
      <Card style={{ left: 70, top: 160, width: 400, height: 380, padding: 28, boxSizing: "border-box", ...popStyle(t, A.hast, 20, 0.8) }}>
        <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim }}>GEKAUFT</div>
        <div style={{ marginTop: 18, width: 220, height: 140, borderRadius: 14, background: "#2C2C30", position: "relative", margin: "18px auto 0" }}>
          <div style={{ position: "absolute", left: 14, right: 14, top: 12, bottom: 12, borderRadius: 6, background: "linear-gradient(135deg,#3E8EF7,#9B5DE5)" }} />
        </div>
        <div style={{ width: 260, height: 14, borderRadius: 7, background: "#BDBDC2", margin: "0 auto" }} />
        <div style={{ marginTop: 20, textAlign: "center", fontFamily: fonts.bold, fontSize: 34, color: C.ink }}>Laptop · 1.400 €</div>
        {t > A.netto - 0.1 ? <div style={{ marginTop: 10, textAlign: "center", ...popStyle(t, A.netto - 0.1, 8, 0.6) }}><Tag text="> 800 € NETTO" color={C.red} size={22} /></div> : null}
      </Card>
      <div style={{ position: "absolute", left: 510, top: 160, width: 500, height: 610 }}>
        {years.map((y, i) => (
          <Card key={i} style={{ left: 0, top: i * 150 + (1 - split) * (150 - i * 150) * 0.0, width: 500, height: 130, padding: "0 26px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 18, opacity: k(t, A.verteilt + i * 0.15, 0.2), transform: `translateX(${(1 - k(t, A.verteilt + i * 0.15, 0.3)) * -120}px)` }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: C.dim }}>{y.y}</span>
            <div style={{ flex: 1, height: 22, borderRadius: 11, background: C.line }}><div style={{ width: `${33 * k(t, A.mehrere + i * 0.1, 0.4) * 3}%`, maxWidth: "100%", height: "100%", borderRadius: 11, background: C.green }} /></div>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 32, color: C.ink }}>{y.v} €</span>
          </Card>
        ))}
        {t > A.finanzamt - 0.1 ? <div style={{ position: "absolute", left: 0, top: 480, display: "flex", alignItems: "center", gap: 12, ...popStyle(t, A.finanzamt - 0.1, 10, 0.6) }}><span style={{ width: 48, height: 48, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={34} p={k(t, A.finanzamt, 0.3)} /></span><span style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink }}>So will es das Finanzamt</span></div> : null}
      </div>
    </>
  );
};

// ---------- split: the list for Elster, you type it in and send ----------
const ROWS = [{ z: "15", l: "Betriebseinnahmen", v: "48.200 €" }, { z: "29", l: "Waren, Material", v: "9.140 €" }, { z: "51", l: "Telekommunikation", v: "684 €" }, { z: "57", l: "Software, Abos", v: "2.430 €" }, { z: "31", l: "Abschreibung", v: "467 €" }, { z: "95", l: "Gewinn", v: "31.480 €" }];
const SceneElster: React.FC<{ t: number }> = ({ t }) => {
  const rowAt = (i: number) => A.liste - 0.05 + i * Math.max(0.12, (A.elster - A.liste) / ROWS.length);
  const sent = t > A.schickst + 0.1;
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 60, ...popStyle(t, A.raus1 - 0.1, 10, 0.8) }}><LabelChip text="Raus kommt deine Liste" dot={C.green} size={30} /></div>
      <Card style={{ left: 70, top: 160, width: 940, height: 610, overflow: "hidden", ...popStyle(t, A.raus1, 20, 0.85) }}>
        <div style={{ padding: "16px 24px", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, color: C.ink }}>elster-liste.txt</div>
          <div style={{ marginLeft: "auto", opacity: k(t, A.elster - 0.1, 0.2) }}><Tag text="FÜR ELSTER" color="#2E5C8A" size={18} /></div>
        </div>
        {ROWS.map((r, i) => (t > rowAt(i) ? (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 70, padding: "0 24px", borderBottom: `1px solid ${C.line}`, background: i === ROWS.length - 1 ? C.greenSoft : "transparent", ...popStyle(t, rowAt(i), 8, 0.85) }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 20, color: "#FFF", background: "#2E5C8A", borderRadius: 6, padding: "4px 8px" }}>Zeile {r.z}</span>
            <span style={{ fontFamily: fonts.medium, fontSize: 26, color: C.ink, flex: 1 }}>{r.l}</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: i === ROWS.length - 1 ? C.green : C.ink }}>{r.v}</span>
            {t > A.tippst + i * 0.08 ? <Check size={30} color={C.green} p={k(t, A.tippst + i * 0.08, 0.2)} /> : null}
          </div>) : null))}
      </Card>
      {sent ? <div style={{ position: "absolute", right: 90, top: 690, ...popStyle(t, A.schickst + 0.1, 10, 0.5) }}><Tag text="✓ ABGESCHICKT" color={C.green} size={30} /></div> : null}
      <CursorBot t={t} path={[{ x: 900, y: 300, at: A.tippst - 0.1 }, { x: 900, y: 650, at: A.tippst + 0.35 }, { x: 880, y: 720, at: A.schickst }]} />
    </>
  );
};

// ---------- split: the 600 € stay with you ----------
const SceneBleibt: React.FC<{ t: number }> = ({ t }) => {
  const v = interpolate(t, [A.sechs1 - 0.1, A.bleiben + 0.4], [0, 600], clamp);
  return (
    <>
      <Card style={{ left: 70, top: 150, width: 430, height: 330, padding: 28, boxSizing: "border-box", ...popStyle(t, A.sechs1 - 0.2, 20, 0.7) }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>STEUERBERATER</div>
        <div style={{ marginTop: 14, fontFamily: MONO, fontWeight: 800, fontSize: 70, color: C.dim, textDecoration: "line-through", textDecorationColor: C.red, textDecorationThickness: 6 }}>600 €</div>
        <div style={{ marginTop: 14 }}><Tag text="GESPART" color={C.red} size={24} /></div>
      </Card>
      <Card style={{ left: 530, top: 150, width: 480, height: 330, padding: 28, boxSizing: "border-box", border: `4px solid ${C.green}`, ...popStyle(t, A.bleiben - 0.1, 20, 0.7) }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>BLEIBT BEI DIR</div>
        <div style={{ marginTop: 14, fontFamily: MONO, fontWeight: 800, fontSize: 80, color: C.green, fontVariantNumeric: "tabular-nums" }}>+{Math.round(v)} €</div>
        <div style={{ marginTop: 6, fontFamily: fonts.medium, fontSize: 24, color: C.ink }}>jedes Jahr</div>
      </Card>
      {Array.from({ length: 10 }, (_, i) => {
        const a = A.sechs1 + i * 0.07;
        const f = k(t, a, 0.6, Easing.inOut(Easing.cubic));
        return t > a && f < 1 ? <div key={i} style={{ position: "absolute", left: 280 + (760 - 280) * f, top: 560 - Math.sin(f * Math.PI) * 200 - 200 * f, width: 34, height: 34, background: C.gold, border: "5px solid #B07A1E", boxSizing: "border-box" }} /> : null;
      })}
      <div style={{ position: "absolute", left: 470, top: 560, ...popStyle(t, A.bleiben, 20, 0.4) }}><Knight px={9} color="#3E8EF7" /></div>
    </>
  );
};

// ---------- end: trigger + guide pages inside the panel ----------
const PAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => staticFile(`gewinn-guide/p${n}.png`));
const SceneEnd: React.FC<{ t: number }> = ({ t }) => {
  const a = A.komm - 0.1;
  const pw = 360, ph = Math.round((pw * 842) / 595), gap = 22, pitch = pw + gap;
  const sx = interpolate(t, [A.anleitung - 0.2, GW_END], [0, (PAGES.length - 2) * pitch], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", justifyContent: "center", ...popStyle(t, a, 14, 0.5) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px" }}>KOMMENTIER:</div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 26px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>{typed("GEWINN", t, A.gewinn1 - 0.1, A.gewinn1 + 0.25) || " "}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 200, width: W, height: ph + 40, transform: `rotate(-3deg)`, opacity: k(t, A.anleitung - 0.25, 0.25) }}>
        {PAGES.map((src, i) => (
          <Img key={i} src={src} style={{ position: "absolute", left: 120 + i * pitch - sx, top: 10, width: pw, height: ph, borderRadius: 8, boxShadow: "0 16px 36px rgba(0,0,0,0.25)" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", ...popStyle(t, A.anleitung - 0.1, 8, 0.6) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(20,20,20,0.86)", borderRadius: 999, padding: "10px 20px" }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.green }} />
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", color: "#FFF" }}>ANLEITUNG · {PAGES.length} SEITEN · PER DM</span>
        </div>
      </div>
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }>; full?: boolean };
const SCENES: Scene[] = [
  { from: 0, to: A.einnahmen - 0.1, origin: "50% 50%", El: SceneHook },
  { from: A.einnahmen - 0.1, to: A.formular - 0.35, origin: "50% 50%", El: FullFormel, full: true },
  { from: A.formular - 0.35, to: A.arbeit - 0.3, origin: "50% 45%", El: SceneFormular },
  { from: A.arbeit - 0.3, to: A.lad - 0.1, origin: "50% 50%", El: FullClaude, full: true },
  { from: A.lad - 0.1, to: A.sortiert - 0.3, origin: "50% 45%", El: SceneUpload },
  { from: A.sortiert - 0.3, to: A.hast - 0.15, origin: "50% 50%", El: FullSort, full: true },
  { from: A.hast - 0.15, to: A.raus1 - 0.15, origin: "50% 45%", El: SceneAfa },
  { from: A.raus1 - 0.15, to: A.sechs1 - 0.25, origin: "50% 45%", El: SceneElster },
  { from: A.sechs1 - 0.25, to: A.komm - 0.15, origin: "50% 45%", El: SceneBleibt },
  { from: A.komm - 0.15, to: 999, origin: "50% 45%", El: SceneEnd },
];
// ---------- captions: orange pill on the seam, active word in a black pill ----------
const chunks = (() => {
  const out: { start: number; end: number; words: { w: string; s: number }[] }[] = [];
  let cur: Cap[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => ({ w: c.text.replace(/[.,!?:]/g, "").toUpperCase(), s: c.startMs / 1000 })) });
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
const FOCUS = { x: 0.51, y: 0.597, scale: 1.0 };
const SPLIT_SRC_TOP = 430;
export const GewinnOpus: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-fpn-gewinnermittlung-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {scene.full ? <El t={t} /> : (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
          </div>
          {t < A.einnahmen - 0.1 ? <HookPills t={t} /> : null}
        </div>
      )}
      <SeamCaption t={t} y={scene.full ? 1610 : PH} />
    </AbsoluteFill>
  );
};
