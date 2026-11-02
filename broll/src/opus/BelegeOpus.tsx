import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-belege/captions.json";
import { PixelBot, BotProp, BotHat } from "../components/PixelBot";

// FP-N "Belege" (Henri 2026-10-20), Stil wie DatenschutzOpus: Split + drei Vollbild-Momente,
// eigener PixelBot als Klick-Cursor, Guide-Scroll + Folgen/Kommentar-Karte am Ende.
// Anbieter generisch (Namen aus dem Skript, keine fremden Logos). Zeiten an captions.json (tightened) verankert.

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const BE_END = LAST_END + 0.7;
export const BE_FRAMES = Math.round(BE_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  liste0: at("liste", 0), fehlenden: at("fehlenden"), dreissig: at("dreißig"), zehntausend: at("zehntausend"),
  findest: at("findest"), mwst: at("mehrwertsteuer"), tausend: at("tausendneunhundert"), weg: at("weg"),
  ab: at("ab"), holt: at("holt"), klickt: at("klickt"), kundenkonten: at("kundenkonten"),
  schritt0: at("schritt", 0), anbieter: at("anbieter"), telefon: at("telefon"), strom: at("strom"), tankkarte: at("tankkarte"), amazon: at("amazon"), software: at("software"),
  schritt1: at("schritt", 1), oeffnet: at("öffnet"), browser: at("browser"), konto: at("konto"), laedt: at("lädt"), runter: at("runter"),
  schaust: at("schaust"), jetzt: at("jetzt"), trick: at("trick"),
  schritt2: at("schritt", 2), benennt: at("benennt"), datum: at("datum"), legt: at("legt"), ordner: at("ordner"),
  einloggen: at("einloggen"), rest: at("rest"), monat: at("monat", 1),
  prompt: at("prompt"), einrichtung: at("einrichtung"), anbieterliste: at("anbieterliste"), guide: at("guide"),
  komm: at("kommentiere"), belege: at("belege"), folg: at("folg"),
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

// ---------- hook pills (frame 0 = thumbnail) ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const m = k(t, 0.95, 0.35, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 60, padding: "10px 26px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow, position: "relative" }}>
        30 Belege <span style={{ color: C.red, display: "inline-block", transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, k(t, 0.45, 0.3)) * Math.PI)})` }}>1.900 € weg</span>
      </div>
      <div style={{ ...pill, marginTop: -6 }}>
        Claude holt sie{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -8, right: -8, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>selbst</span>
        </span>
      </div>
    </div>
  );
};

// ---------- split hook: the tax advisor's mail with the missing receipts ----------
const MISSING = [
  { n: "Telefon · Rechnung 09/26", v: 89.9 }, { n: "Tankkarte · Abrechnung", v: 412.3 }, { n: "Amazon · Bestellung 302-…", v: 186.4 },
  { n: "Software-Abo · September", v: 59.0 }, { n: "Strom · Abschlag", v: 240.0 },
];
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const n = Math.round(interpolate(t, [0, Math.max(0.9, A.dreissig + 0.3)], [7, 30], clamp));
  const sum = interpolate(t, [Math.max(0.6, A.dreissig), A.zehntausend + 0.5], [0, 10000], clamp);
  return (
    <>
      {t < A.dreissig + 0.3 ? <Card style={{ left: 70, top: 250, width: 700, height: 520, overflow: "hidden", transform: `translateY(${-k(t, A.dreissig - 0.15, 0.35, Easing.in(Easing.cubic)) * 40}px) scale(${1 - k(t, A.dreissig - 0.15, 0.35, Easing.in(Easing.cubic)) * 0.25})`, opacity: 1 - k(t, A.dreissig - 0.15, 0.35, Easing.in(Easing.cubic)) }}>
        <div style={{ padding: "18px 26px", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#5B6CF0", color: "#FFF", fontFamily: fonts.bold, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>StB</div>
          <div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.ink }}>Steuerkanzlei</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 21, color: C.dim }}>Betreff: Fehlende Belege September</div>
          </div>
        </div>
        <div style={{ padding: "6px 26px" }}>
          {MISSING.map((m, i) => (t >= (i < 2 ? -1 : 0.15 + i * 0.22) ? (
            <div key={i} style={{ display: "flex", alignItems: "center", height: 70, borderBottom: `1px solid ${C.line}`, gap: 12, ...(i < 2 ? {} : popStyle(t, 0.15 + i * 0.22, 10, 0.85)) }}>
              <PdfIcon size={34} />
              <span style={{ fontFamily: fonts.medium, fontSize: 24, color: C.ink, flex: 1, whiteSpace: "nowrap" }}>{m.n}</span>
              <Tag text="FEHLT" color={C.red} size={15} />
            </div>) : null))}
          <div style={{ marginTop: 14, fontFamily: fonts.medium, fontSize: 22, color: C.dim }}>… und {Math.max(0, n - 5)} weitere</div>
        </div>
      </Card> : null}
      {t > A.dreissig - 0.12 ? (
        <div style={{ position: "absolute", left: 90, top: 262, transform: `translateX(${shakeAt(t, A.zehntausend, 8)}px)` }}>
          {Array.from({ length: 30 }, (_, i) => {
            const a = A.dreissig - 0.12 + i * 0.022;
            if (t < a) return null;
            const col = i % 6, row = Math.floor(i / 6);
            return (
              <div key={i} style={{ position: "absolute", left: col * 112, top: row * 94, transform: `scale(${0.3 + 0.7 * pop(t, a, 0.22)}) translateY(${Math.sin(t * 7 + i) * 2}px)` }}>
                <Receipt px={6} missing={k(t, a + 0.15, 0.2)} />
              </div>
            );
          })}
        </div>
      ) : null}
      <Card style={{ left: 800, top: 250, width: 210, height: 250, padding: 20, boxSizing: "border-box", textAlign: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim }}>FEHLEN</div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 92, color: C.red, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{n}</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 20, color: C.ink }}>Rechnungen</div>
      </Card>
      {t > A.dreissig ? (
        <Card style={{ left: 800, top: 520, width: 210, height: 250, padding: 20, boxSizing: "border-box", textAlign: "center", ...popStyle(t, A.dreissig, 20, 0.6) }}>
          <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim }}>SUMME</div>
          <div style={{ marginTop: 22, fontFamily: MONO, fontWeight: 800, fontSize: 40, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{eur(sum)}</div>
          <div style={{ marginTop: 18 }}><Tag text="NETTO" color={C.dim} size={16} /></div>
        </Card>
      ) : null}
    </>
  );
};

// ---------- full: 10.000 x 19 % = 1.900 € gone (Arena-Stil) ----------
const lostAt = (i: number) => A.mwst + 0.2 + ((A.weg - A.mwst - 0.2) * i) / 30;
const FullVerlust: React.FC<{ t: number }> = ({ t }) => {
  const lost = Array.from({ length: 30 }, (_, i) => i).filter((i) => t > lostAt(i)).length;
  const v = Math.round((1900 * lost) / 30);
  const zoom = 1 + 0.04 * k(t, A.findest, 3.6, Easing.inOut(Easing.sin));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom}) translateX(${shakeAt(t, A.weg, 12)}px)`, transformOrigin: "50% 60%" }}>
        <QuestBg t={t} castles={false} />
        <Card style={{ left: 110, top: 360, width: 860, height: 330, padding: "34px 46px", boxSizing: "border-box", ...popStyle(t, A.findest + 0.15, 30, 0.6) }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}>MEHRWERTSTEUER ZURÜCK?</div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 18, fontFamily: MONO, fontWeight: 800, fontSize: 54, color: C.ink, ...popStyle(t, A.mwst, 10, 0.8) }}>
            10.000 € <span style={{ color: C.dim, fontSize: 44 }}>×</span> 19 %
          </div>
          <div style={{ marginTop: 18, fontFamily: MONO, fontWeight: 800, fontSize: 96, color: lost ? C.red : C.line, fontVariantNumeric: "tabular-nums" }}>{lost ? `− ${v.toLocaleString("de-DE")} €` : "= ?"}</div>
        </Card>
        {Array.from({ length: 30 }, (_, i) => {
          const col = i % 6, row = Math.floor(i / 6);
          const x = 95 + col * 150, y = 820 + row * 118;
          const la = lostAt(i), dead = t > la;
          const fall = dead ? k(t, la, 0.25) : 0;
          const coin = k(t, la, 0.45, Easing.in(Easing.quad));
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x, top: y + fall * 16 + (dead ? 0 : Math.abs(Math.sin(t * 6 + i)) * -5), transform: `rotate(${fall * (i % 2 ? 24 : -24)}deg)`, ...popStyle(t, A.findest + 0.1 + i * 0.012, 20, 0.3) }}>
                <Receipt px={8} lost={dead} missing={1} />
              </div>
              {dead && coin < 1 ? (
                <div style={{ position: "absolute", left: x + 26 + (540 - x - 26) * coin, top: y - 30 + (610 - y + 30) * coin - Math.sin(coin * Math.PI) * 160, width: 26, height: 26, background: C.gold, border: "4px solid #B07A1E", boxSizing: "border-box", opacity: 1 - coin * 0.6 }} />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", ...popStyle(t, A.findest - 0.05, 12, 0.5) }}><PixelText text="OHNE BELEG" size={64} /></div>
      <div style={{ position: "absolute", right: 40, top: 1440 }}><Counter label="MWST WEG" value={`${v.toLocaleString("de-DE")} €`} t={t} bumpAt={[A.weg]} /></div>
      <Slam t={t} at={A.weg} text="WEG!" top={470} size={150} bg={C.red} hold={0.9} />
    </AbsoluteFill>
  );
};

// ---------- browser mock (shared by "klickt sich allein" and step 2) ----------
const ACCOUNTS = [
  { n: "Telefon", url: "kundencenter-telefon.de", c: "#C2185B" },
  { n: "Strom", url: "mein-stromanbieter.de", c: "#F2A900" },
  { n: "Tankkarte", url: "tankkarte-portal.de", c: "#1565C0" },
  { n: "Amazon", url: "amazon.de/bestellungen", c: "#232F3E" },
  { n: "Software", url: "abo-verwaltung.app", c: "#6B4FD8" },
];
const Browser: React.FC<{ t: number; tabAt: (i: number) => number; dl: (i: number) => number; status: string }> = ({ t, tabAt, dl, status }) => {
  const active = ACCOUNTS.reduce((acc, _, i) => (t >= tabAt(i) ? i : acc), 0);
  const a = ACCOUNTS[active];
  return (
    <Card style={{ left: 50, top: 150, width: 980, height: 630, overflow: "hidden" }}>
      <div style={{ height: 52, background: "#ECEAE4", display: "flex", alignItems: "flex-end", gap: 4, padding: "0 12px" }}>
        {ACCOUNTS.map((x, i) => (
          <div key={i} style={{ height: 40, width: 150, borderRadius: "10px 10px 0 0", background: i === active ? "#FFF" : "transparent", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontFamily: fonts.medium, fontSize: 17, color: C.ink, opacity: t >= tabAt(i) - 0.3 ? 1 : 0.35 }}>
            <span style={{ width: 16, height: 16, borderRadius: 4, background: x.c }} />{x.n}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", height: 578 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ margin: "14px 18px", height: 40, borderRadius: 10, background: "#F4F3EF", fontFamily: fonts.medium, fontSize: 19, color: "#6E6B65", display: "flex", alignItems: "center", padding: "0 14px" }}>🔒 {a.url}</div>
          <div style={{ padding: "6px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: a.c }} />
              <div style={{ fontFamily: fonts.bold, fontSize: 30, color: C.ink }}>{a.n} · Mein Konto</div>
            </div>
            <div style={{ marginTop: 20, fontFamily: MONO, fontSize: 17, color: C.dim }}>RECHNUNGEN</div>
            {["September 2026", "August 2026", "Juli 2026"].map((m, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 12, height: 66, borderBottom: `1px solid ${C.line}` }}>
                <PdfIcon size={30} />
                <span style={{ fontFamily: fonts.medium, fontSize: 23, color: C.ink, flex: 1 }}>{m}</span>
                <span style={{ fontFamily: fonts.semibold, fontSize: 19, color: "#FFF", background: j === 0 && t > dl(active) ? C.green : C.blue, borderRadius: 8, padding: "6px 12px" }}>{j === 0 && t > dl(active) ? "✓ geladen" : "PDF"}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: 330, background: "#FAF9F6", borderLeft: `1.5px solid ${C.line}`, padding: 18, boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ClaudeMark size={30} /><div style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.ink }}>Claude</div></div>
          <div style={{ marginTop: 16, background: "#FFF", borderRadius: 12, border: `1.5px solid ${C.line}`, padding: 14, fontFamily: fonts.medium, fontSize: 19, lineHeight: 1.4, color: C.ink, minHeight: 90 }}>{status}</div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {ACCOUNTS.map((x, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: fonts.medium, fontSize: 19, color: t > dl(i) ? C.ink : C.dim }}>
                <span style={{ width: 24, height: 24, borderRadius: 6, background: t > dl(i) ? C.green : C.line, display: "flex", alignItems: "center", justifyContent: "center" }}>{t > dl(i) ? <Check size={18} p={k(t, dl(i), 0.2)} /> : null}</span>{x.n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
const tabPos = (i: number) => ({ x: 50 + 12 + i * 154 + 75, y: 150 + 32 });
const dlPos = { x: 50 + 650 - 330 - 80 + 290, y: 150 + 52 + 14 + 40 + 6 + 44 + 20 + 30 + 33 + 20 };

// split: "Ab heute holt Claude jede Rechnung selbst. Er klickt sich allein durch deine Kundenkonten."
const SceneAllein: React.FC<{ t: number }> = ({ t }) => {
  const span = Math.max(0.6, A.schritt0 - 0.2 - A.klickt);
  const tabAt = (i: number) => A.klickt + (i * span) / ACCOUNTS.length;
  const status = t < A.klickt ? "Ich hole die Rechnungen vom letzten Monat." : `Öffne ${ACCOUNTS[Math.min(4, Math.floor((t - A.klickt) / (span / 5)))].n} …`;
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 60, ...popStyle(t, A.ab - 0.05, 10, 0.8) }}><LabelChip text="Claude steuert deinen Browser" dot={C.orange} size={30} /></div>
      <div style={popStyle(t, A.ab, 30, 0.85)}><Browser t={t} tabAt={tabAt} dl={(i) => tabAt(i) + span / 10} status={status} /></div>
      <CursorBot t={t} path={ACCOUNTS.map((_, i) => ({ ...tabPos(i), at: tabAt(i) }))} />
      {t > A.kundenkonten ? <div style={{ position: "absolute", right: 70, top: 60, ...popStyle(t, A.kundenkonten, 10, 0.6) }}><Tag text="0 KLICKS VON DIR" color={C.green} size={24} /></div> : null}
    </>
  );
};

// split: step 1, the provider list
const SceneListe: React.FC<{ t: number }> = ({ t }) => {
  const when = [A.telefon, A.strom, A.tankkarte, A.amazon, A.software];
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 60, ...popStyle(t, A.schritt0 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 1 · deine Anbieter, einmal" dot={C.orange} size={30} /></div>
      <Card style={{ left: 70, top: 160, width: 620, height: 610, overflow: "hidden", ...popStyle(t, A.schritt0 + 0.1, 20, 0.85) }}>
        <div style={{ padding: "16px 24px", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, color: C.ink }}>anbieterliste.txt</div>
          <div style={{ marginLeft: "auto" }}><Tag text={`${when.filter((w) => t > w - 0.05).length} / 5`} color={C.orange} size={18} /></div>
        </div>
        {ACCOUNTS.map((x, i) => (t > when[i] - 0.05 ? (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 98, padding: "0 24px", borderBottom: `1px solid ${C.line}`, ...popStyle(t, when[i] - 0.05, 12, 0.7) }}>
            <span style={{ width: 52, height: 52, borderRadius: 12, background: x.c, color: "#FFF", fontFamily: fonts.bold, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{x.n[0]}</span>
            <div><div style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink }}>{x.n}</div><div style={{ fontFamily: MONO, fontSize: 17, color: C.dim }}>{x.url}</div></div>
          </div>) : null))}
      </Card>
      <div style={{ position: "absolute", left: 790, top: 330, ...popStyle(t, A.anbieter, 26, 0.3) }}><div style={{ transform: `translateY(${Math.abs(Math.sin(t * 5)) * -8}px)` }}><Knight px={11} /></div></div>
    </>
  );
};

// full (Arena-Stil): step 2 as a quest - the Claude knight walks from castle to castle, every invoice flies into the sack
const visit = (i: number) => A.oeffnet + 0.05 + (i * Math.max(2.5, A.schaust - 0.3 - A.oeffnet)) / ACCOUNTS.length;
const SACK = { x: 860, y: 1250 };
const FullQuest: React.FC<{ t: number }> = ({ t }) => {
  const from = A.schritt1 - 0.05;
  const got = ACCOUNTS.filter((_, i) => t > visit(i) + 0.75).length;
  const castleCx = (i: number) => (CASTLE_X(i) + 16) * 5;
  let kx = castleCx(0) - 260;
  ACCOUNTS.forEach((_, i) => { const p = k(t, visit(i) - 0.35, 0.33, Easing.inOut(Easing.cubic)); kx = kx + (castleCx(i) - (i === 0 ? castleCx(0) - 260 : castleCx(i - 1))) * p; });
  const walking = ACCOUNTS.some((_, i) => t > visit(i) - 0.35 && t < visit(i) - 0.02);
  const zoom = 1 + 0.035 * k(t, from, 5, Easing.inOut(Easing.sin));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 62%" }}>
        <QuestBg t={t} hit={(i) => visit(i) + 0.1} />
        <CastleLabels t={t} a={from + 0.1} />
        <div style={{ position: "absolute", left: SACK.x - 70, top: SACK.y, width: 140, height: 130, transformOrigin: "50% 100%", ...popStyle(t, from + 0.2, 20, 0.4), scale: "1.35" }}>
          <div style={{ position: "absolute", left: 30, top: 0, width: 80, height: 22, background: "#8A5A2B", border: "5px solid #2C2420" }} />
          <div style={{ position: "absolute", left: 0, top: 18, width: 140, height: 112, background: "#B9814A", border: "6px solid #2C2420", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.1 * ACCOUNTS.reduce((m, _, i) => Math.max(m, t > visit(i) + 0.75 && t < visit(i) + 1 ? 1 : 0), 0)})` }}>
            <span style={{ fontFamily: PIXEL, fontSize: 46, color: "#FFF" }}>{got}</span>
          </div>
        </div>
        {ACCOUNTS.map((_, i) => {
          const a = visit(i) + 0.15;
          if (t < a) return null;
          const f = k(t, a + 0.15, 0.6, Easing.inOut(Easing.cubic));
          if (f >= 1) return null;
          const x0 = castleCx(i) - 30, y0 = 860;
          const x = x0 + (SACK.x - 30 - x0) * f, y = y0 + (SACK.y - 20 - y0) * f - Math.sin(f * Math.PI) * 260;
          return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `scale(${pop(t, a, 0.2) * (1 - 0.3 * f)}) rotate(${f * 340}deg)` }}><Receipt px={7} /></div>;
        })}
        <div style={{ position: "absolute", left: kx - 65, top: 1028 + (walking ? Math.abs(Math.sin(t * 22)) * -14 : 0) }}>
          <div style={{ position: "absolute", left: 6, top: -58, display: "flex", alignItems: "center", gap: 6, background: "#FFF", border: "4px solid #2C2420", padding: "4px 8px" }}><ClaudeMark size={24} /><span style={{ fontFamily: PIXEL, fontSize: 16, color: C.ink }}>CLAUDE</span></div>
          <Knight px={10} />
        </div>
        <div style={{ position: "absolute", left: 60, top: 1270, ...popStyle(t, A.schaust - 0.2, 20, 0.4) }}>
          <Knight px={7} color="#3E8EF7" grey={t < A.schaust - 0.2} />
          {t > A.schaust - 0.2 ? <div style={{ position: "absolute", left: 70, top: -40, fontFamily: PIXEL, fontSize: 22, color: C.ink, background: "#FFF", border: "4px solid #2C2420", padding: "6px 10px", whiteSpace: "nowrap", ...popStyle(t, A.schaust - 0.1, 8, 0.5) }}>DU</div> : null}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center", ...popStyle(t, from, 10, 0.8) }}><LabelChip text="Schritt 2 · Claude holt alles" dot={C.green} size={32} /></div>
      <div style={{ position: "absolute", right: 40, top: 270 }}><Counter label="BELEGE GEHOLT" value={`${got}/5`} t={t} bumpAt={ACCOUNTS.map((_, i) => visit(i) + 0.75)} /></div>
      <Slam t={t} at={A.schritt1} text="LOS!" top={460} size={120} hold={0.55} />
      {t > A.schaust - 0.15 ? <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center", ...popStyle(t, A.schaust - 0.15, 14, 0.4) }}><PixelText text="DU SCHAUST NUR ZU" size={50} color="#2C2420" bg={C.gold} style={{ transform: "rotate(-2deg)" }} /></div> : null}
    </AbsoluteFill>
  );
};

// ---------- full: "Du schaust nur zu." ----------
const FullZuschauen: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", ...popStyle(t, A.schaust - 0.15, 14, 0.4) }}><PixelText text="DU SCHAUST NUR ZU" size={66} color="#2C2420" bg={C.gold} /></div>
    <div style={{ position: "absolute", left: 120, top: 980, ...popStyle(t, A.schaust - 0.1, 40, 0.3) }}><PixelBot px={18} t={t} prop="laptop" /></div>
    <div style={{ position: "absolute", left: 620, top: 1000, ...popStyle(t, A.schaust + 0.1, 40, 0.3) }}><PixelBot px={16} t={t} prop="stopwatch" hat="cap" grey flip /></div>
    {Array.from({ length: 5 }, (_, i) => {
      const a = A.schaust + i * 0.08;
      const y = interpolate(t, [a, a + 1.2], [900, 520], clamp);
      return t > a ? <div key={i} style={{ position: "absolute", left: 300 + i * 110, top: y, opacity: 1 - k(t, a + 0.8, 0.4) }}><PdfIcon size={70} /></div> : null;
    })}
  </>
);

// ---------- full: the trick (quest world, crowned knight) ----------
const FullTrick: React.FC<{ t: number }> = ({ t }) => {
  const a = A.jetzt - 0.25;
  const grow = k(t, a, 0.5, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.04 * k(t, a, 1.4)})`, transformOrigin: "50% 60%" }}>
        <QuestBg t={t} />
        <div style={{ position: "absolute", left: W / 2 - (13 * 16) / 2, top: 1290 - 17 * 16 + Math.sin(t * 6) * 6, transform: `scale(${0.4 + 0.6 * grow})`, transformOrigin: "50% 100%" }}>
          <div style={{ position: "absolute", left: -70, top: -70, right: -70, bottom: -20, background: "radial-gradient(circle, rgba(255,229,138,0.75), rgba(255,229,138,0) 65%)" }} />
          <Knight px={16} crown={t > A.trick} />
        </div>
        {Array.from({ length: 14 }, (_, i) => {
          const b = a + 0.1 + i * 0.04;
          return t > b ? <div key={i} style={{ position: "absolute", left: 540 + Math.cos(i * 0.45) * (180 + 320 * k(t, b, 0.6)), top: 1150 + Math.sin(i * 0.45) * (180 + 320 * k(t, b, 0.6)) - 200, width: 24, height: 24, background: i % 2 ? C.gold : C.orange, transform: "rotate(45deg)", opacity: 1 - k(t, b + 0.45, 0.3) }} /> : null;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", ...popStyle(t, a, 14, 0.3) }}>
        <PixelText text="JETZT DER TRICK" size={78} color="#2C2420" bg={C.gold} style={{ transform: `scale(${interpolate(t - a, [0, 0.16], [2.2, 1], clamp)}) rotate(-3deg) translateX(${shakeAt(t, A.trick, 8)}px)` }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- split: step 3, rename + file into the advisor folder ----------
const FILES = [
  { o: "Rechnung (3).pdf", nw: "2026-09-03_Telefon_R48213.pdf" },
  { o: "download.pdf", nw: "2026-09-05_Strom_A0926.pdf" },
  { o: "invoice_8812.pdf", nw: "2026-09-12_Amazon_302-881.pdf" },
  { o: "Abrechnung.pdf", nw: "2026-09-30_Tankkarte_T5521.pdf" },
];
const SceneAblage: React.FC<{ t: number }> = ({ t }) => {
  const ren = (i: number) => A.benennt + 0.15 + i * Math.max(0.2, (A.legt - A.benennt) / 5);
  const mv = (i: number) => A.ordner - 0.3 + i * 0.12;
  const inFolder = FILES.filter((_, i) => t > mv(i) + 0.35).length;
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 60, ...popStyle(t, A.schritt2 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 3 · benennen und ablegen" dot={C.orange} size={30} /></div>
      <Card style={{ left: 70, top: 160, width: 640, height: 610, overflow: "hidden", ...popStyle(t, A.schritt2 + 0.1, 20, 0.85) }}>
        <div style={{ padding: "16px 24px", borderBottom: `1.5px solid ${C.line}`, fontFamily: MONO, fontWeight: 800, fontSize: 21, color: C.ink }}>Belege-Eingang</div>
        {FILES.map((f, i) => {
          const r = t > ren(i);
          const m = k(t, mv(i), 0.35, Easing.in(Easing.cubic));
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, height: 110, padding: "0 22px", borderBottom: `1px solid ${C.line}`, transform: `translateX(${m * 520}px) scale(${1 - m * 0.4})`, opacity: 1 - m }}>
              <PdfIcon size={36} />
              <span style={{ fontFamily: MONO, fontWeight: r ? 800 : 500, fontSize: r ? 21 : 23, color: r ? C.ink : C.dim, background: r ? C.greenSoft : "transparent", borderRadius: 6, padding: "4px 8px", whiteSpace: "nowrap" }}>{r ? typed(f.nw, t, ren(i), ren(i) + 0.25) : f.o}</span>
            </div>
          );
        })}
      </Card>
      <div style={{ position: "absolute", left: 740, top: 250, width: 270, ...popStyle(t, A.legt - 0.1, 20, 0.6) }}>
        <div style={{ width: 270, height: 200, position: "relative", transform: `scale(${1 + 0.06 * Math.sin(Math.min(1, k(t, A.ordner, 0.3)) * Math.PI)})` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 120, height: 40, background: "#E9A23B", borderRadius: "12px 12px 0 0" }} />
          <div style={{ position: "absolute", left: 0, top: 26, width: 270, height: 174, background: C.gold, borderRadius: "0 14px 14px 14px", boxShadow: shadow }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 54, color: "#2C2420" }}>{inFolder}</div>
        </div>
        <div style={{ marginTop: 14, fontFamily: fonts.bold, fontSize: 26, color: C.ink, textAlign: "center" }}>Steuerberater</div>
        <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim, textAlign: "center" }}>/2026/09</div>
      </div>
      {t > A.ordner + 0.6 ? <div style={{ position: "absolute", left: 760, top: 600, ...popStyle(t, A.ordner + 0.6, 10, 0.6) }}><Tag text="✓ ABGELEGT" color={C.green} size={24} /></div> : null}
    </>
  );
};

// ---------- split: you log in once, Claude does the rest every month ----------
const MONTHS = ["OKT", "NOV", "DEZ", "JAN", "FEB", "MÄR"];
const SceneMonat: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Card style={{ left: 70, top: 120, width: 430, height: 300, padding: 28, boxSizing: "border-box", ...popStyle(t, A.einloggen - 0.1, 20, 0.7) }}>
      <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>DU</div>
      <div style={{ marginTop: 14, fontFamily: fonts.bold, fontSize: 40, color: C.ink }}>Einloggen</div>
      <div style={{ marginTop: 16 }}><Tag text="EINMAL" color={C.ink} size={24} /></div>
    </Card>
    <Card style={{ left: 530, top: 120, width: 480, height: 300, padding: 28, boxSizing: "border-box", border: `4px solid ${C.orange}`, ...popStyle(t, A.rest - 0.1, 20, 0.7) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ClaudeMark size={28} /><div style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>CLAUDE</div></div>
      <div style={{ marginTop: 14, fontFamily: fonts.bold, fontSize: 40, color: C.ink }}>Der ganze Rest</div>
      <div style={{ marginTop: 16 }}><Tag text="JEDEN MONAT" color={C.orange} size={24} /></div>
    </Card>
    <div style={{ position: "absolute", left: 70, top: 470, display: "flex", gap: 14 }}>
      {MONTHS.map((m, i) => {
        const a = A.monat - 0.4 + i * 0.12;
        return t > a ? (
          <div key={i} style={{ width: 145, height: 170, background: "#FFF", borderRadius: 14, boxShadow: shadow, overflow: "hidden", ...popStyle(t, a, 16, 0.6) }}>
            <div style={{ height: 44, background: C.red, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{m}</div>
            <div style={{ height: 126, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 64, height: 64, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={44} p={k(t, a + 0.1, 0.25)} /></div></div>
          </div>
        ) : null;
      })}
    </div>
  </>
);

// ---------- end: guide chips while the PDF scrolls, then follow + comment card ----------
const SceneEnd: React.FC<{ t: number }> = ({ t }) => {
  {
    return (
      <>
        <div style={{ position: "absolute", left: 70, top: 60, display: "flex", flexDirection: "column", gap: 22 }}>
          {t > A.prompt - 0.05 ? <div style={popStyle(t, A.prompt - 0.05, 10, 0.6)}><Tag text="✓ PROMPT" color={C.orange} size={30} /></div> : null}
          {t > A.einrichtung - 0.05 ? <div style={popStyle(t, A.einrichtung - 0.05, 10, 0.6)}><Tag text="✓ EINRICHTUNG" color={C.ink} size={30} /></div> : null}
          {t > A.anbieterliste - 0.1 ? <div style={popStyle(t, A.anbieterliste - 0.1, 10, 0.6)}><Tag text="✓ ANBIETERLISTE" color={C.green} size={30} /></div> : null}
        </div>
        <div style={{ position: "absolute", left: 800, top: 380, ...popStyle(t, A.prompt - 0.1, 26, 0.3) }}><Knight px={10} crown /></div>
      </>
    );
  }
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }>; full?: boolean };
const SCENES: Scene[] = [
  { from: 0, to: A.findest - 0.05, origin: "50% 50%", El: SceneHook },
  { from: A.findest - 0.05, to: A.ab - 0.08, origin: "50% 40%", El: FullVerlust, full: true },
  { from: A.ab - 0.08, to: A.schritt0 - 0.05, origin: "50% 45%", El: SceneAllein },
  { from: A.schritt0 - 0.05, to: A.schritt1 - 0.05, origin: "50% 45%", El: SceneListe },
  { from: A.schritt1 - 0.05, to: A.jetzt - 0.25, origin: "50% 50%", El: FullQuest, full: true },
  { from: A.jetzt - 0.25, to: A.schritt2 - 0.05, origin: "50% 50%", El: FullTrick, full: true },
  { from: A.schritt2 - 0.05, to: A.einloggen - 0.1, origin: "50% 45%", El: SceneAblage },
  { from: A.einloggen - 0.1, to: A.prompt - 0.1, origin: "50% 45%", El: SceneMonat },
  { from: A.prompt - 0.1, to: 999, origin: "50% 45%", El: SceneEnd },
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

// ---------- guide scroll (real PDF pages) ----------
const PAGES = [1, 2, 3, 4, 5, 6, 7].map((n) => staticFile(`belege-guide/p${n}.png`));
const PDF = { left: 120, top: 560, w: 840, h: 1220, bar: 76, pw: 780, ph: Math.round((780 * 842) / 595), gap: 26 };
const PITCH = PDF.ph + PDF.gap;
export const PDF_IN = A.prompt - 0.1;
export const PDF_OUT = A.komm - 0.32;
const SCROLL_A = PDF_IN + 0.3, SCROLL_B = PDF_OUT - 0.1;
const SAMPLES = 8, SHUTTER = 0.6 / FPS;
const scrollY = (t: number) => interpolate(t, [SCROLL_A, SCROLL_B], [0, (PAGES.length - 1) * PITCH], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const PdfScroll: React.FC<{ t: number }> = ({ t }) => {
  if (t < PDF_IN || t > PDF_OUT + 0.32) return null;
  const inY = interpolate(t, [PDF_IN, PDF_IN + 0.3], [PDF.h + 700, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const outY = interpolate(t, [PDF_OUT, PDF_OUT + 0.3], [0, PDF.h + 700], { ...clamp, easing: Easing.in(Easing.cubic) });
  const y = scrollY(t);
  const page = Math.min(PAGES.length, Math.max(1, Math.floor((y + (PDF.h - PDF.bar) / 2) / PITCH) + 1));
  const tilt = interpolate(t, [PDF_IN, PDF_IN + 0.3], [-4, 0], clamp) + interpolate(t, [PDF_OUT, PDF_OUT + 0.3], [0, 4], clamp);
  return (
    <div style={{ position: "absolute", left: PDF.left, top: PDF.top, width: PDF.w, height: PDF.h, borderRadius: 26, overflow: "hidden", background: "#E9E7E1", boxShadow: "0 40px 90px rgba(0,0,0,0.45), 0 6px 16px rgba(0,0,0,0.25)", transform: `translateY(${inY + outY}px) rotate(${tilt}deg)`, zIndex: 40 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: PDF.bar, background: C.chip, display: "flex", alignItems: "center", padding: "0 26px", gap: 14, zIndex: 2 }}>
        <PdfIcon size={40} />
        <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: "#FFF", whiteSpace: "nowrap" }}>Belege – Guidebook.pdf</div>
        <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 26, color: "#FFF", background: C.orange, borderRadius: 10, padding: "6px 14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{page} / {PAGES.length}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: PDF.bar, bottom: 0, overflow: "hidden" }}>
        {Array.from({ length: SAMPLES }, (_, j) => {
          const yy = scrollY(t - (j / (SAMPLES - 1)) * SHUTTER);
          return (
            <div key={j} style={{ position: "absolute", left: (PDF.w - PDF.pw) / 2, top: 22 - yy, opacity: 1 / (j + 1) }}>
              {PAGES.map((src, i) => <Img key={i} src={src} style={{ position: "absolute", left: 0, top: i * PITCH, width: PDF.pw, height: PDF.ph, borderRadius: 6, boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- master ----------
const FOCUS = { x: 0.51, y: 0.597, scale: 1.0 };
const SPLIT_SRC_TOP = 430;
const CTA = A.komm - 0.12;
const CHEST_Y = 1540;
export const BelegeOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = camera(t, scene.from, Math.min(scene.to, CTA));
  const dx = Math.sin(t * 0.6) * 6, dy = Math.cos(t * 0.45) * 5;
  const full = k(t, CTA, 0.42, Easing.inOut(Easing.cubic));
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTop = Math.min(PH, Math.max(H - vh, PH - SPLIT_SRC_TOP * s)) * (1 - full);
  const avPush = full > 0 ? 1 + 0.05 * k(t, CTA + 0.45, 2.0, Easing.inOut(Easing.sin)) : 1 + 0.035 * Math.abs(Math.sin((t - scene.from) * 0.9));
  const El = scene.El;
  const followed = t > A.folg + 0.25;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${avPush})`, transformOrigin: full > 0 ? "50% 45%" : "50% 40%" }}>
        <OffthreadVideo src={staticFile("render-fpn-belege-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {scene.full ? <El t={t} /> : full < 1 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * full, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
          </div>
          {t < A.findest - 0.05 ? <HookPills t={t} /> : null}
        </div>
      ) : null}
      <PdfScroll t={t} />
      {t > A.komm - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.komm - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 26px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>{typed("BELEGE", t, A.belege - 0.1, A.belege + 0.25) || " "}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(20,20,20,0.82)", borderRadius: 999, padding: "10px 20px", ...popStyle(t, A.komm + 0.15, 8, 0.6) }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.green }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", color: "#FFF" }}>GUIDE · 7 SEITEN · PER DM</span>
          </div>
          {t > A.folg - 0.08 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#FFF", borderRadius: 999, padding: "12px 14px 12px 26px", boxShadow: "0 12px 26px rgba(0,0,0,0.25)", ...popStyle(t, A.folg - 0.08, 10, 0.6) }}>
              <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: C.ink }}>@florent_preusser</span>
              <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#FFF", background: followed ? C.green : "#3E8EF7", borderRadius: 999, padding: "10px 22px" }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
            </div>
          ) : null}
        </div>
      ) : null}
      <SeamCaption t={t} y={scene.full ? 1610 : PH + (CHEST_Y - PH) * full} />
    </AbsoluteFill>
  );
};
