import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/arena/captions.json";

// FP-N "Arena" (Henri 2026-10-15), Vorlage @opusjake DdysDw5t4Km: split from frame 0 (cream panel on top,
// avatar below, Claude-orange caption pill on the seam) plus two full-frame pixel-art arena scenes.
// The gladiators are our own sprite (helmet + plume, visor, shield, sword), never the Claude mascot.
// All timings are anchored to the word timings of the tightened timeline (captions.json).
// Speed ramp 1.1x, music and SFX are applied afterwards (runs/arena/make-sfx.mjs).

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820; // panel height = seam

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const AR_END = LAST_END + 0.7;
export const AR_FRAMES = Math.round(AR_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  durchschnitt: at("durchschnitt"), hundert0: at("hundert", 0), kaempfen: at("kämpfen"),
  staerkste: at("stärkste"), antwort0: at("antwort", 0), ohne: at("ohne"), fragen: at("fragen"),
  so: at("so"), claude1: at("claude", 1), startet: at("startet"), helfer0: at("helfer", 0),
  gibt: at("gibt"), exakt: at("exakt"), dieselbe: at("dieselbe"), aufgabe: at("aufgabe"), angebotsmail: at("angebotsmail"), grosskunden: at("großkunden"),
  aber: at("aber"), anders: at("anders"), einer0: at("einer", 0), einer1: at("einer", 1), einer2: at("einer", 2), entwuerfe: at("entwürfe"), streicht: at("streicht"), zwei: at("zwei"),
  jetzt: at("jetzt"), brutal: at("brutal"), greifen: at("greifen"), runde0: at("runde", 0), runde1: at("runde", 1), wer: at("wer"), begruenden: at("begründen"), fliegt: at("fliegt"),
  uebrig: at("übrig"), eine: at("eine", 0), antwort1: at("antwort", 1), beste: at("beste"),
  statt: at("statt"), stunde: at("stunde"), nachzubessern: at("nachzubessern"), hast: at("hast"), minuten: at("minuten"),
  richtest: at("richtest"), einmal: at("einmal"), danach: at("danach"), wort: at("wort"),
  den: at("den"), kompletten: at("kompletten"), skill: at("skill"), beispielaufgaben: at("beispielaufgaben"), guide: at("guide"),
  komm: at("kommentiere"), arena: at("arena"), folg: at("folg"),
};
const ARENA1 = { from: A.kaempfen, to: A.so };
const ARENA2 = { from: A.jetzt - 0.14, to: A.beste - 0.13 };

const C = {
  bg: "#F3EFE6",
  grid: "rgba(0,0,0,0.045)",
  ink: "#151515",
  dim: "#8A877F",
  line: "#E7E4DD",
  card: "#FFFFFF",
  orange: "#D97757",
  orangeSoft: "#F8E1D7",
  green: "#1E9E57",
  greenSoft: "#E6F5EC",
  red: "#E5484D",
  redSoft: "#FDE8E8",
  chip: "#141414",
  term: "#17161A",
  gold: "#F5C542",
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

// ---------- sentence boundaries (camera push per sentence) ----------
const SENT = [0, ...CAPS.flatMap((c, i) => (i > 0 && /[.!?]$/.test(CAPS[i - 1].text) ? [c.startMs / 1000] : []))];
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
const Cross: React.FC<{ size: number; color?: string; p?: number }> = ({ size, color = "#FFF", p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeDasharray={30} strokeDashoffset={30 * (1 - p)} /></svg>
);
const Stamp: React.FC<{ t: number; at: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, at: a, text, color = C.red, size = 64, rot = -8, style }) => {
  if (t < a) return null;
  const p = interpolate(t, [a, a + 0.16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: p, fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.08em", color, border: `${size * 0.09}px solid ${color}`, borderRadius: 12, padding: `${size * 0.08}px ${size * 0.3}px`, background: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", ...style }}>{text}</div>
  );
};
const TermBar: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ height: 52, display: "flex", alignItems: "center", padding: "0 20px", gap: 9, borderBottom: "1.5px solid rgba(255,255,255,0.08)" }}>
    {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />)}
    <div style={{ marginLeft: 14, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 500, fontSize: 19, color: "rgba(255,255,255,0.55)" }}><ClaudeMark size={20} />{label}</div>
  </div>
);

// ---------- our gladiator sprite (13 x 15) ----------
const TEAM = ["#E5484D", "#3E8EF7", "#2FB36B", "#F2A531", "#9B5DE5", "#F25CA2", "#1FB5C9", "#F27A3A", "#6C7BF2", "#7DBB3C"];
const SPR = [
  ".....PPP.....",
  "....PPPPP....",
  "....hHHHh....",
  "...hHHHHHh...",
  "...HVVVVVH...",
  "...HVEVEVH..W",
  "...hHHHHHh..W",
  "....hHHHh...W",
  ".SS.BBBBB...W",
  "SGGSBBBBBBKKK",
  "SGGSBBBBB..K.",
  ".SS.BBBBB....",
  "....LL.LL....",
  "....LL.LL....",
  "...DDD.DDD...",
];
const CROWN = ["....C.C.C....", "....CCCCC...."];
const shade = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${ch((n >> 16) & 255)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
};
const Gladiator: React.FC<{ color: string; px: number; ko?: boolean; crown?: boolean; flip?: boolean; style?: React.CSSProperties }> = ({ color, px, ko, crown, flip, style }) => {
  const pal: Record<string, string> = ko
    ? { P: "#9C978E", B: "#B9B4AC", H: "#CFCBC4", h: "#A8A39A", V: "#6E6A63", E: "#6E6A63", S: "#8E8981", G: "#B9B4AC", W: "#CFCBC4", K: "#8E8981", L: "#8E8981", D: "#6E6A63" }
    : { P: shade(color, 0.72), B: color, H: "#D5DAE0", h: "#9AA3AD", V: "#1E1E24", E: "#FFE58A", S: "#7A4B26", G: "#E6B84A", W: "#EEF3F7", K: "#7A4B26", L: "#4A4038", D: "#2C2420" };
  const rows = crown ? [...CROWN, ...SPR] : SPR;
  return (
    <svg width={13 * px} height={rows.length * px} viewBox={`0 0 13 ${rows.length}`} shapeRendering="crispEdges" style={{ display: "block", transform: flip ? "scaleX(-1)" : undefined, overflow: "visible", ...style }}>
      {rows.flatMap((r, y) => r.split("").map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={ch === "C" ? C.gold : pal[ch]} />)))}
      {ko ? <path d={`M4.2 ${(crown ? 2 : 0) + 4.4} l1.6 1.6 M5.8 ${(crown ? 2 : 0) + 4.4} l-1.6 1.6 M7.2 ${(crown ? 2 : 0) + 4.4} l1.6 1.6 M8.8 ${(crown ? 2 : 0) + 4.4} l-1.6 1.6`} stroke="#2C2420" strokeWidth={0.45} /> : null}
    </svg>
  );
};

// ---------- pixel arena background (216 x 384 grid, 5 px per cell) ----------
const CROWD = ["#E5484D", "#3E8EF7", "#F2A531", "#2FB36B", "#9B5DE5", "#F4E3C3", "#C98F5E", "#F25CA2", "#1FB5C9"];
const ArenaBg: React.FC<{ t: number }> = ({ t }) => {
  const crowd: React.ReactNode[] = [];
  const tiers = [46, 70, 94, 118];
  tiers.forEach((ty, ti) => {
    for (let x = 1; x < 216; x += 3) {
      const i = ti * 100 + x;
      const c = CROWD[Math.floor(rnd(i, 3) * CROWD.length)];
      const jump = Math.sin(t * 9 + rnd(i, 5) * 12) > 0.6 ? -1 : 0;
      crowd.push(<rect key={`c${i}`} x={x} y={ty + 4 + jump} width={2} height={2} fill="#F1D3B0" />);
      crowd.push(<rect key={`b${i}`} x={x} y={ty + 6 + jump} width={2} height={3} fill={c} />);
    }
  });
  const sand: React.ReactNode[] = [];
  for (let i = 0; i < 520; i++) {
    const x = Math.floor(rnd(i, 7) * 216), y = 176 + Math.floor(rnd(i, 9) * 208);
    sand.push(<rect key={`s${i}`} x={x} y={y} width={1} height={1} fill={rnd(i, 11) > 0.5 ? "#D9B272" : "#F6DFAE"} />);
  }
  return (
    <svg width={W} height={H} viewBox="0 0 216 384" shapeRendering="crispEdges" style={{ position: "absolute", inset: 0 }}>
      <rect x={0} y={0} width={216} height={40} fill="#F7E1B0" />
      <rect x={0} y={28} width={216} height={12} fill="#F2D49C" />
      <rect x={0} y={40} width={216} height={100} fill="#C99A6B" />
      {tiers.map((ty) => <rect key={ty} x={0} y={ty + 14} width={216} height={3} fill="#A9784C" />)}
      {crowd}
      {[18, 66, 114, 162, 204].map((x) => (
        <g key={x}>
          <rect x={x} y={40} width={8} height={18} fill="#C8453C" />
          <rect x={x + 2} y={58} width={4} height={3} fill="#C8453C" />
          <rect x={x + 3} y={44} width={2} height={8} fill="#F5C542" />
        </g>
      ))}
      <rect x={0} y={140} width={216} height={36} fill="#B98A5F" />
      <rect x={0} y={140} width={216} height={3} fill="#D9AE7E" />
      {Array.from({ length: 9 }, (_, i) => i * 26 + 4).map((x) => (
        <g key={x}>
          <rect x={x} y={150} width={14} height={26} fill="#6B4528" />
          <rect x={x + 2} y={147} width={10} height={3} fill="#6B4528" />
        </g>
      ))}
      <rect x={88} y={144} width={40} height={32} fill="#4E321C" />
      <rect x={92} y={140} width={32} height={4} fill="#4E321C" />
      <rect x={0} y={176} width={216} height={208} fill="#EBCB8B" />
      {sand}
    </svg>
  );
};
const PixelText: React.FC<{ text: string; size: number; color?: string; bg?: string; style?: React.CSSProperties }> = ({ text, size, color = "#FFF", bg = "#2C2420", style }) => (
  <div style={{ fontFamily: PIXEL, fontSize: size, color, background: bg, padding: `${size * 0.25}px ${size * 0.45}px`, border: `${Math.max(4, size * 0.09)}px solid #F5C542`, boxShadow: `0 ${size * 0.12}px 0 #6B4528`, whiteSpace: "nowrap", lineHeight: 1, ...style }}>{text}</div>
);
const Counter: React.FC<{ n: number; t: number; bumpAt?: number[] }> = ({ n, t, bumpAt = [] }) => {
  const b = bumpAt.reduce((m, a) => Math.max(m, t > a && t < a + 0.25 ? 1 - (t - a) / 0.25 : 0), 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, transform: `scale(${1 + 0.12 * b})`, transformOrigin: "100% 50%" }}>
      <div style={{ fontFamily: PIXEL, fontSize: 28, color: "#F5C542", background: "#2C2420", padding: "14px 16px", border: "5px solid #F5C542", borderRight: "none", whiteSpace: "nowrap" }}>HELFER ÜBRIG</div>
      <div style={{ fontFamily: PIXEL, fontSize: 52, color: "#2C2420", background: "#F5C542", padding: "4px 18px", border: "5px solid #F5C542", minWidth: 120, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{n}</div>
    </div>
  );
};

// ---------- full frame arena 1: hook payoff (kämpfen - So geht's) ----------
type G = { x: number; y: number; c: string; flip: boolean; ko: number };
const ARENA_ONE: G[] = Array.from({ length: 40 }, (_, i) => {
  const col = i % 8, row = Math.floor(i / 8);
  return { x: 40 + col * 128 + (row % 2) * 24 + rnd(i, 1) * 16, y: 940 + row * 160 + rnd(i, 2) * 24, c: TEAM[i % TEAM.length], flip: col % 2 === 1, ko: 0.35 + rnd(i, 4) * 0.95 };
});
const WIN1 = 19;
const ArenaOne: React.FC<{ t: number }> = ({ t }) => {
  const u = t - ARENA1.from;
  const left = Math.round(interpolate(t, [ARENA1.from + 0.3, A.staerkste], [100, 1], { ...clamp, easing: Easing.out(Easing.quad) }));
  const zoom = 1 + 0.05 * k(t, ARENA1.from, 3.6, Easing.inOut(Easing.sin));
  const win = k(t, A.staerkste - 0.1, 0.5, Easing.inOut(Easing.cubic));
  const big = interpolate(u, [0, 0.18, 0.5, 0.75], [2.4, 1, 1, 0.55], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 60%" }}>
        <ArenaBg t={t} />
        {ARENA_ONE.map((g, i) => {
          if (i === WIN1) return null;
          const dead = u > g.ko;
          const lunge = dead ? 0 : Math.sin(u * 14 + i) * 8;
          const fall = dead ? k(u, g.ko, 0.25) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: g.x + (g.flip ? -lunge : lunge), top: g.y + fall * 22 + (dead ? 0 : Math.abs(Math.sin(u * 7 + i)) * -8), transform: `rotate(${fall * (g.flip ? -80 : 80)}deg)`, opacity: 1 - 0.45 * fall }}>
              <Gladiator color={g.c} px={8} ko={dead} flip={g.flip} />
            </div>
          );
        })}
        {(() => {
          const g = ARENA_ONE[WIN1];
          const px = 8 + 8 * win;
          const x = interpolate(win, [0, 1], [g.x, W / 2 - (13 * px) / 2]);
          const y = interpolate(win, [0, 1], [g.y, 1290 - 17 * px]);
          return (
            <div style={{ position: "absolute", left: x, top: y + Math.sin(u * 6) * 6 * win }}>
              {win > 0.6 ? <div style={{ position: "absolute", left: -60, top: -60, right: -60, bottom: -20, background: "radial-gradient(circle, rgba(255,229,138,0.75), rgba(255,229,138,0) 65%)" }} /> : null}
              <Gladiator color={g.c} px={px} crown={t > A.staerkste + 0.25} />
            </div>
          );
        })()}
      </div>
      <div style={{ position: "absolute", right: 40, top: 230 }}><Counter n={left} t={t} bumpAt={[A.staerkste]} /></div>
      {u < 0.75 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", opacity: 1 - k(u, 0.6, 0.15) }}>
          <PixelText text="KAMPF!" size={110} style={{ transform: `scale(${big}) rotate(-3deg)` }} />
        </div>
      ) : null}
      {t > A.antwort0 - 0.05 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1350, display: "flex", justifyContent: "center", ...popStyle(t, A.antwort0 - 0.05, 16, 0.6) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFF", border: `4px solid ${C.green}`, borderRadius: 16, padding: "16px 26px", fontFamily: fonts.semibold, fontSize: 40, color: C.ink, boxShadow: shadow }}>
            <span style={{ width: 44, height: 44, borderRadius: 10, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={34} p={k(t, A.antwort0 + 0.1, 0.3)} /></span>
            Stärkste Antwort
          </div>
        </div>
      ) : null}
      {t > A.ohne - 0.05 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center", ...popStyle(t, A.ohne - 0.05, 14, 0.6) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, letterSpacing: "0.08em", color: "#FFF", background: C.chip, borderRadius: 14, padding: "12px 24px", whiteSpace: "nowrap" }}>
            <span style={{ color: C.gold }}>0×</span> NEU GEFRAGT
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- full frame arena 2: tournament (jetzt wird's brutal - die beste) ----------
const PAIRS = Array.from({ length: 20 }, (_, j) => ({ cx: 120 + (j % 5) * 210, cy: 960 + Math.floor(j / 5) * 175 }));
// round 1: one per pair; round 2: the survivor of every even pair; round 3: every j%4==1
const DUEL_W = 11, DUEL_L = 7;
const koTime = (j: number, side: 0 | 1) => {
  const loserSide = j % 2 === 0 ? 1 : 0;
  if (side === loserSide) return A.brutal + 0.3 + j * 0.075;
  if (j % 2 === 0) return A.runde0 + (j / 2) * 0.04;
  if (j % 4 === 1) return A.runde1 + ((j - 1) / 4) * 0.06;
  if (j === DUEL_W) return 999;
  if (j === DUEL_L) return A.fliegt;
  return A.uebrig + 0.1 + (j % 5) * 0.12;
};
const ArenaTwo: React.FC<{ t: number }> = ({ t }) => {
  const u = t - ARENA2.from;
  let left = 100;
  if (t > A.brutal + 0.3) left = Math.round(interpolate(t, [A.brutal + 0.3, A.brutal + 1.8], [100, 50], clamp));
  if (t > A.runde0) left = Math.round(interpolate(t, [A.runde0, A.runde0 + 0.4], [50, 25], clamp));
  if (t > A.runde1) left = Math.round(interpolate(t, [A.runde1, A.runde1 + 0.35], [25, 13], clamp));
  if (t > A.fliegt) left = Math.round(interpolate(t, [A.fliegt, A.fliegt + 0.3], [13, 4], clamp));
  if (t > A.uebrig) left = Math.round(interpolate(t, [A.uebrig, A.antwort1], [4, 1], clamp));
  const focus = k(t, A.wer - 0.1, 0.5, Easing.inOut(Easing.cubic)) * (1 - k(t, A.uebrig - 0.05, 0.45, Easing.inOut(Easing.cubic)));
  const zoom = 1 + 0.55 * focus;
  const round = t < A.runde0 ? "RUNDE 1 · 50 DUELLE" : t < A.runde1 ? "RUNDE 2 · 25 DUELLE" : t < A.uebrig ? "RUNDE 3 · 13 DUELLE" : "FINALE";
  const roundAt = t < A.runde0 ? A.brutal - 0.15 : t < A.runde1 ? A.runde0 - 0.05 : t < A.uebrig ? A.runde1 - 0.05 : A.uebrig - 0.05;
  const toCenter = k(t, A.wer - 0.1, 0.5, Easing.inOut(Easing.cubic));
  const sprite = (j: number, side: 0 | 1) => {
    const p = PAIRS[j];
    const kt = koTime(j, side);
    const dead = t > kt;
    const fall = dead ? k(t, kt, 0.25) : 0;
    let x = p.cx + (side === 0 ? -95 : 10);
    let y = p.cy;
    let px = 7;
    const lunge = dead ? 0 : Math.max(0, Math.sin(u * 13 + j * 1.7)) * 16;
    x += side === 0 ? lunge : -lunge;
    if (j === DUEL_W || j === DUEL_L) {
      const surv = (j % 2 === 0 ? 0 : 1) === side;
      if (surv) {
        const tx = j === DUEL_W ? 560 : 400, ty = 1180;
        x = interpolate(toCenter, [0, 1], [x, tx]);
        y = interpolate(toCenter, [0, 1], [y, ty]);
      }
    }
    if (j === DUEL_W && (j % 2 === 0 ? 0 : 1) === side) {
      const w = k(t, A.uebrig, 0.6, Easing.inOut(Easing.cubic));
      px = 7 + 7 * w;
      x = interpolate(w, [0, 1], [x, W / 2 - (13 * px) / 2]);
      y = interpolate(w, [0, 1], [y, 1300 - 17 * px]);
    }
    let fly = 0;
    if (j === DUEL_L && t > A.fliegt) fly = k(t, A.fliegt, 0.45, Easing.in(Easing.quad));
    return (
      <div key={`${j}-${side}`} style={{ position: "absolute", left: x - fly * 500, top: y + fall * 20 - fly * 1100, transform: `rotate(${fall * (side === 0 ? -80 : 80) - fly * 520}deg)`, opacity: 1 - 0.5 * fall * (1 - fly) }}>
        <Gladiator color={TEAM[(j * 2 + side) % TEAM.length]} px={px} ko={dead} flip={side === 1} crown={j === DUEL_W && t > A.eine} />
      </div>
    );
  };
  const spark = (j: number) => {
    const p = PAIRS[j];
    const alive = t < koTime(j, 0) && t < koTime(j, 1);
    if (!alive || toCenter > 0.2) return null;
    const s = Math.max(0, Math.sin(u * 13 + j * 1.7));
    return s > 0.85 ? <div key={`sp${j}`} style={{ position: "absolute", left: p.cx - 18, top: p.cy + 30, width: 26, height: 26, background: "#FFF6C2", transform: "rotate(45deg)", boxShadow: "0 0 20px #FFE58A" }} /> : null;
  };
  const winX = 560 + 39;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 64%" }}>
        <ArenaBg t={t} />
        {PAIRS.map((_, j) => spark(j))}
        {PAIRS.flatMap((_, j) => [sprite(j, 0), sprite(j, 1)])}
        {t > A.begruenden - 0.05 && t < A.fliegt + 0.1 ? (
          <div style={{ position: "absolute", left: 300, top: 1080, ...popStyle(t, A.begruenden - 0.05, 10, 0.5) }}>
            <div style={{ fontFamily: PIXEL, fontSize: 24, color: "#FFF", background: C.red, padding: "8px 12px", border: "4px solid #7A1F22", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>✕ KEIN BELEG</div>
          </div>
        ) : null}
        {t > A.begruenden + 0.15 && t < A.uebrig ? (
          <div style={{ position: "absolute", left: winX - 20, top: 1080, ...popStyle(t, A.begruenden + 0.15, 10, 0.5) }}>
            <div style={{ fontFamily: PIXEL, fontSize: 24, color: "#FFF", background: C.green, padding: "8px 12px", border: "4px solid #0E5A30", whiteSpace: "nowrap" }}>✓ BELEGT</div>
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", ...popStyle(t, roundAt, 12, 0.5) }}>
        <PixelText text={round} size={46} style={{ transform: `translateX(${shakeAt(t, roundAt, 6)}px)` }} />
      </div>
      <div style={{ position: "absolute", right: 40, top: 230 }}><Counter n={left} t={t} bumpAt={[A.runde0, A.runde1, A.fliegt, A.antwort1]} /></div>
      {u < 0.6 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", opacity: 1 - k(u, 0.45, 0.15) }}>
          <PixelText text="BRUTAL." size={100} bg={C.red} style={{ transform: `scale(${interpolate(u, [0, 0.16], [2.2, 1], clamp)}) rotate(2deg)` }} />
        </div>
      ) : null}
      {t > A.antwort1 - 0.05 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center", ...popStyle(t, A.antwort1 - 0.05, 14, 0.5) }}>
          <PixelText text="SIEGER" size={64} color="#2C2420" bg={C.gold} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- Scene 1: hook (0 - kämpfen), split ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const m = k(t, 0.95, 0.35, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 58, padding: "10px 26px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 38, display: "flex", flexDirection: "column", alignItems: "center", gap: 0, zIndex: 5 }}>
      <div style={pill}>100 Agents kämpfen</div>
      <div style={{ ...pill, marginTop: -6 }}>
        nur{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -8, right: -8, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative", transform: `scale(${1 + 0.08 * Math.sin(Math.min(1, m) * Math.PI)})`, display: "inline-block" }}>1 Antwort</span>
        </span>{" "}
        überlebt
      </div>
    </div>
  );
};
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const away = k(t, A.hundert0 - 0.15, 0.35, Easing.in(Easing.cubic));
  return (
    <>
      {away < 1 ? (
        <Card style={{ left: 90, top: 260, width: 900, height: 420, overflow: "hidden", transform: `translateY(${-away * 40}px) scale(${1 - away * 0.25})`, opacity: 1 - away }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "26px 34px 0" }}>
            <ClaudeMark size={38} /><div style={{ fontFamily: fonts.semibold, fontSize: 30, color: C.ink }}>Antwort 4 von 4</div>
            <div style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: C.dim }}>neu generieren ↻</div>
          </div>
          <div style={{ padding: "26px 34px", fontFamily: "Georgia, serif", fontSize: 44, lineHeight: 1.32, color: C.ink, position: "relative" }}>
            Sehr geehrte Damen und Herren, in der heutigen <span style={{ position: "relative" }}>schnelllebigen Zeit<span style={{ position: "absolute", left: 0, top: "52%", height: 5, background: C.red, width: `${100 * k(t, A.durchschnitt, 0.35)}%` }} /></span> ist ein starker Partner wichtiger denn je …
          </div>
          <Stamp t={t} at={A.durchschnitt + 0.35} text="DURCHSCHNITT" size={58} rot={-7} style={{ left: 330, top: 250 }} />
        </Card>
      ) : null}
      {t > A.hundert0 - 0.05 ? (
        <div style={{ position: "absolute", left: 95, top: 268 }}>
          {Array.from({ length: 100 }, (_, i) => {
            const a = A.hundert0 - 0.05 + i * 0.011;
            if (t < a) return null;
            const p = pop(t, a, 0.22);
            const col = i % 10, row = Math.floor(i / 10);
            return (
              <div key={i} style={{ position: "absolute", left: col * 89, top: row * 52, transform: `scale(${0.3 + 0.7 * p}) translateY(${Math.sin(t * 8 + i) * 2}px)` }}>
                <Gladiator color={TEAM[(i * 7) % TEAM.length]} px={3.4} flip={col % 2 === 1} />
              </div>
            );
          })}
        </div>
      ) : null}
      {t > A.hundert0 ? (
        <div style={{ position: "absolute", right: 60, top: 720, ...popStyle(t, A.hundert0, 10, 0.6) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 46, color: C.ink, background: "#FFF", border: `4px solid ${C.ink}`, borderRadius: 14, padding: "2px 18px", fontVariantNumeric: "tabular-nums", boxShadow: shadow }}>×{Math.round(interpolate(t, [A.hundert0, A.hundert0 + 1.1], [1, 100], clamp))}</div>
        </div>
      ) : null}
    </>
  );
};

// ---------- Scene 2: terminal, 100 helpers start (So geht's - gibt) ----------
const STRATS = ["Vom Kunden aus", "Rückwärts vom Ziel", "Drei Entwürfe", "Erste Prinzipien", "Einwände zuerst", "Radikal kurz", "Beispiel zuerst", "Umkehrung", "Belege & Zahlen", "Expertenrunde", "Geschichte", "Gegenposition"];
const SceneTerminal: React.FC<{ t: number }> = ({ t }) => {
  const cmd = "/arena Angebotsmail an Großkunden";
  const n = Math.round(interpolate(t, [A.startet, A.gibt - 0.05], [0, 100], { ...clamp, easing: Easing.in(Easing.quad) }));
  const shown = Math.min(n, 100);
  const first = Math.max(0, shown - 8);
  return (
    <div style={{ position: "absolute", left: 60, top: 60, width: 960, height: 700, borderRadius: 20, background: C.term, boxShadow: "0 30px 60px rgba(0,0,0,0.30)", overflow: "hidden" }}>
      <TermBar label="claude · arena" />
      <div style={{ padding: "22px 30px", fontFamily: MONO, fontSize: 27, color: "#ECE9E2", lineHeight: 1.5 }}>
        <div><span style={{ color: C.orange }}>›</span> {typed(cmd, t, A.so, A.so + 0.55)}<span style={{ opacity: t < A.so + 0.6 && Math.floor(t * 4) % 2 ? 1 : 0 }}>▌</span></div>
        {t > A.claude1 ? (
          <div style={{ color: C.gold, ...popStyle(t, A.claude1, 6, 0.9) }}>● Arena startet · <b>100 Helfer</b> · Wellen à 10</div>
        ) : null}
        <div style={{ marginTop: 8 }}>
          {Array.from({ length: shown - first }, (_, i) => {
            const id = first + i;
            const done = n - id > 22;
            return (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 14, height: 46, color: "rgba(236,233,226,0.85)" }}>
                <span style={{ color: "rgba(236,233,226,0.35)" }}>├</span>
                <Gladiator color={TEAM[id % TEAM.length]} px={2.4} />
                <span style={{ color: TEAM[id % TEAM.length], fontWeight: 700 }}>#{String(id + 1).padStart(3, "0")}</span>
                <span style={{ flex: 1 }}>{STRATS[id % STRATS.length]}</span>
                <span style={{ color: done ? C.green : C.gold }}>{done ? "fertig ✓" : "läuft …"}</span>
              </div>
            );
          })}
        </div>
      </div>
      {t > A.startet ? (
        <div style={{ position: "absolute", right: 26, top: 66, ...popStyle(t, A.startet, 8, 0.7) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: C.term, background: C.gold, borderRadius: 12, padding: "6px 16px", fontVariantNumeric: "tabular-nums" }}>{n} / 100</div>
        </div>
      ) : null}
    </div>
  );
};

// ---------- Scene 3: same task for everyone (gibt - Aber) ----------
const SceneTask: React.FC<{ t: number }> = ({ t }) => {
  const title = "Angebotsmail an einen Großkunden";
  const fly = (i: number) => k(t, A.aufgabe + i * 0.02, 0.4, Easing.inOut(Easing.cubic));
  return (
    <>
      <Card style={{ left: 90, top: 50, width: 900, height: 300, ...popStyle(t, A.gibt, 16, 0.85) }}>
        <div style={{ padding: "28px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Tag text="AUFGABE" color={C.orange} size={22} />
            <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim }}>an 100 / 100 Helfer</span>
          </div>
          <div style={{ marginTop: 22, fontFamily: "Georgia, serif", fontSize: 50, color: C.ink, minHeight: 66 }}>
            {t < A.angebotsmail ? <span style={{ color: "#C9C5BC" }}>Schreib die Begleitmail …</span> : typed(title, t, A.angebotsmail, A.grosskunden + 0.3)}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 12, opacity: k(t, A.grosskunden, 0.25) }}>
            {["Empfänger: Einkaufsleitung", "Ziel: Termin"].map((s) => <span key={s} style={{ fontFamily: fonts.medium, fontSize: 24, color: "#5D5A54", background: "#F1EFEA", borderRadius: 999, padding: "8px 16px" }}>{s}</span>)}
          </div>
        </div>
        <Stamp t={t} at={A.dieselbe} text="IDENTISCH ×100" color={C.ink} size={44} rot={6} style={{ right: -20, top: -34 }} />
      </Card>
      <div style={{ position: "absolute", left: 80, top: 420 }}>
        {Array.from({ length: 30 }, (_, i) => {
          const col = i % 10, row = Math.floor(i / 10);
          const f = fly(i);
          return (
            <div key={i} style={{ position: "absolute", left: col * 92, top: row * 118, ...popStyle(t, A.gibt + 0.1 + i * 0.012, 8, 0.4) }}>
              <Gladiator color={TEAM[(i * 3) % TEAM.length]} px={4} flip={col % 2 === 1} />
              {f > 0 ? (
                <div style={{ position: "absolute", left: 14, top: interpolate(f, [0, 1], [-260 - row * 118, -26]), width: 26, height: 32, background: "#FFF", border: `3px solid ${C.orange}`, borderRadius: 4, opacity: f, transform: `rotate(${(1 - f) * 40}deg)` }} />
              ) : null}
            </div>
          );
        })}
      </div>
      {t > A.aufgabe + 0.5 ? <div style={{ position: "absolute", right: 70, top: 760, ...popStyle(t, A.aufgabe + 0.5, 8, 0.6) }}><LabelChip text="+ 70 weitere" dot={C.gold} size={26} /></div> : null}
    </>
  );
};

// ---------- Scene 4: every helper solves it differently (Aber - jetzt) ----------
const StratCard: React.FC<{ t: number; a: number; i: number; title: string; color: string; children: React.ReactNode }> = ({ t, a, i, title, color, children }) => (
  <Card style={{ left: 50 + i * 333, top: 150, width: 313, height: 560, overflow: "hidden", ...popStyle(t, a, 30, 0.6) }}>
    <div style={{ height: 150, background: shade(color, 1.0), display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 10, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.72)" }} />
      <div style={{ position: "relative", transform: `translateY(${Math.sin(t * 6 + i) * 3}px)` }}><Gladiator color={color} px={6} /></div>
    </div>
    <div style={{ padding: "20px 22px 0" }}>
      <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim, letterSpacing: "0.12em" }}>STRATEGIE {String(i + 1).padStart(2, "0")}</div>
      <div style={{ marginTop: 8, fontFamily: fonts.bold, fontSize: 36, color: C.ink, lineHeight: 1.12 }}>{title}</div>
    </div>
    <div style={{ position: "absolute", left: 22, right: 22, bottom: 24, height: 230 }}>{children}</div>
  </Card>
);
const Doc: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", width: 120, height: 150, background: "#FFF", border: `3px solid ${C.line}`, borderRadius: 10, boxShadow: "0 8px 18px rgba(0,0,0,0.10)", padding: 14, boxSizing: "border-box", ...style }}>
    {[0.9, 0.7, 0.85, 0.55].map((w, i) => <div key={i} style={{ height: 9, width: `${w * 100}%`, background: "#E4E1DA", borderRadius: 5, marginBottom: 12 }} />)}
    {children}
  </div>
);
const SceneStrategies: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 50, display: "flex", justifyContent: "center", ...popStyle(t, A.aber, 10, 0.8) }}>
      <LabelChip text={t < A.einer0 ? "Gleiche Aufgabe · 100 Wege" : "Jeder löst sie anders"} size={34} />
    </div>
    <StratCard t={t} a={A.einer0 - 0.05} i={0} title="Vom Kunden aus" color={TEAM[0]}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 90, height: 90, borderRadius: "50%", background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth={2.2}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
      </div>
      <div style={{ position: "absolute", left: 120, top: 26, right: 0, background: "#F1EFEA", borderRadius: "16px 16px 16px 4px", padding: "12px 14px", fontFamily: fonts.medium, fontSize: 22, color: C.ink, opacity: k(t, A.einer0 + 0.5, 0.25) }}>Was bringt mir das?</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", gap: 8, opacity: k(t, A.einer0 + 0.8, 0.25) }}><Tag text="NUTZEN" color={C.orange} size={18} /><Tag text="PREIS" color={C.ink} size={18} /></div>
    </StratCard>
    <StratCard t={t} a={A.einer1 - 0.05} i={1} title="Rückwärts vom Ziel" color={TEAM[1]}>
      <svg width={269} height={230} viewBox="0 0 269 230">
        <circle cx="210" cy="60" r="44" fill="none" stroke={C.red} strokeWidth="8" /><circle cx="210" cy="60" r="24" fill="none" stroke={C.red} strokeWidth="8" /><circle cx="210" cy="60" r="7" fill={C.red} />
        <path d="M200 70 C 150 150, 90 90, 30 190" fill="none" stroke={TEAM[1]} strokeWidth="7" strokeDasharray="14 10" strokeDashoffset={-t * 60} pathLength={1} style={{ strokeDasharray: `${k(t, A.einer1 + 0.3, 0.9)} 1` }} />
        <text x="10" y="222" fontFamily={MONO} fontSize="20" fill={C.dim}>Termin ← Mail</text>
      </svg>
    </StratCard>
    <StratCard t={t} a={A.einer2 - 0.05} i={2} title="Drei Entwürfe, einer bleibt" color={TEAM[2]}>
      {[0, 1, 2].map((d) => {
        const shown = k(t, A.entwuerfe - 0.1 + d * 0.12, 0.25);
        const killed = d < 2 && t > A.streicht + d * 0.15;
        const win = d === 2 && t > A.zwei;
        return (
          <Doc key={d} style={{ left: d * 70, top: 40 + d * 14, opacity: shown * (killed ? 0.55 : 1), transform: `rotate(${(d - 1) * 6}deg) scale(${win ? 1 + 0.1 * pop(t, A.zwei, 0.3) : 1})`, borderColor: win ? C.green : C.line, zIndex: d }}>
            {killed ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 66, height: 66, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}><Cross size={46} p={k(t, A.streicht + d * 0.15, 0.25)} /></div></div> : null}
            {win ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 66, height: 66, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={46} p={k(t, A.zwei, 0.3)} /></div></div> : null}
          </Doc>
        );
      })}
    </StratCard>
  </>
);

// ---------- Scene 5: the winning mail + time (die beste - richtest) ----------
const SceneResult: React.FC<{ t: number }> = ({ t }) => {
  const sec = interpolate(t, [A.hast, A.minuten + 0.2], [0, 192], clamp);
  return (
    <>
      <Card style={{ left: 70, top: 50, width: 940, height: 380, overflow: "hidden", ...popStyle(t, ARENA2.to, 20, 0.8) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 30px", borderBottom: `1.5px solid ${C.line}` }}>
          <Gladiator color={TEAM[(DUEL_W * 2 + 1) % TEAM.length]} px={3} crown />
          <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>Sieger · Helfer #047</div>
          <div style={{ marginLeft: "auto" }}><Tag text="7 RUNDEN GEWONNEN" color={C.green} size={18} /></div>
        </div>
        <div style={{ padding: "20px 30px", fontFamily: fonts.medium, fontSize: 28, color: C.ink, lineHeight: 1.45 }}>
          <div><span style={{ color: C.dim }}>Betreff:</span> <b>Ihr Angebot · passt Donnerstag, 10 Uhr?</b></div>
          <div style={{ marginTop: 10, color: "#3C3A36", fontFamily: "Georgia, serif", fontSize: 30 }}>Hallo Frau Weber, Sie sparen mit unserem Paket rund 12 % Ihrer Rüstzeiten. Alle Zahlen stehen im Anhang …</div>
        </div>
      </Card>
      {t > A.statt - 0.05 ? (
        <Card style={{ left: 70, top: 460, width: 940, height: 130, display: "flex", alignItems: "center", padding: "0 34px", gap: 22, boxSizing: "border-box", ...popStyle(t, A.statt - 0.05, 14, 0.8) }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 34, color: C.dim, flex: 1 }}>Nachfragen &amp; nachbessern</div>
          <div style={{ position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 52, color: C.red }}>
            60 MIN
            <div style={{ position: "absolute", left: -8, top: "50%", height: 7, background: C.red, width: `${108 * k(t, A.nachzubessern + 0.2, 0.3)}%`, borderRadius: 4 }} />
          </div>
        </Card>
      ) : null}
      {t > A.hast - 0.05 ? (
        <Card style={{ left: 70, top: 615, width: 940, height: 150, display: "flex", alignItems: "center", padding: "0 34px", gap: 22, boxSizing: "border-box", border: `4px solid ${C.green}`, ...popStyle(t, A.hast - 0.05, 14, 0.8) }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 40, color: C.ink }}>Arena</div>
            <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim }}>Beispiel · 16 Helfer</div>
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 60, color: C.green, fontVariantNumeric: "tabular-nums" }}>{`${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`} MIN</div>
        </Card>
      ) : null}
    </>
  );
};

// ---------- Scene 6: set up once, then one word (richtest - Den) ----------
const SceneOneWord: React.FC<{ t: number }> = ({ t }) => {
  const enter = t > A.wort + 0.15 ? 1 : 0;
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 60, width: 960, height: 300, borderRadius: 20, background: C.term, boxShadow: "0 30px 60px rgba(0,0,0,0.30)", overflow: "hidden", ...popStyle(t, A.richtest - 0.05, 14, 0.85) }}>
        <TermBar label="claude · skills" />
        <div style={{ padding: "22px 30px", fontFamily: MONO, fontSize: 28, color: "#ECE9E2", lineHeight: 1.6 }}>
          <div style={{ color: "rgba(236,233,226,0.55)" }}>~/.claude/skills/arena/SKILL.md</div>
          {t > A.einmal ? <div style={{ color: C.green, ...popStyle(t, A.einmal, 6, 0.9) }}>✓ Skill „arena“ installiert</div> : null}
          {t > A.einmal + 0.4 ? <div style={{ color: C.gold, ...popStyle(t, A.einmal + 0.4, 6, 0.9) }}>einmalig · fertig</div> : null}
        </div>
      </div>
      {t > A.danach - 0.05 ? (
        <div style={{ position: "absolute", left: 100, top: 430, width: 880, height: 190, borderRadius: 26, background: "#FFF", border: `5px solid ${C.ink}`, boxShadow: `0 ${12 - enter * 8}px 0 ${C.ink}`, transform: `translateY(${enter * 8}px)`, display: "flex", alignItems: "center", padding: "0 44px", boxSizing: "border-box", ...popStyle(t, A.danach - 0.05, 14, 0.8) }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 96, color: C.orange }}>{typed("/arena", t, A.danach + 0.15, A.danach + 0.7)}</span>
          <span style={{ fontFamily: MONO, fontSize: 96, color: C.ink, opacity: Math.floor(t * 4) % 2 ? 1 : 0.2 }}>▌</span>
          <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#FFF", background: enter ? C.green : C.ink, borderRadius: 14, padding: "12px 20px" }}>⏎</span>
        </div>
      ) : null}
      {t > A.wort - 0.05 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 680, display: "flex", justifyContent: "center", ...popStyle(t, A.wort - 0.05, 12, 0.5) }}>
          <PixelText text="1 WORT" size={54} color="#2C2420" bg={C.gold} />
        </div>
      ) : null}
    </>
  );
};

// ---------- Scene 7: what's in the guide (Den - kommentiere) ----------
const SceneGuide: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 70, top: 60, width: 600, height: 700, borderRadius: 20, background: C.term, boxShadow: "0 30px 60px rgba(0,0,0,0.30)", overflow: "hidden", ...popStyle(t, A.den - 0.05, 16, 0.85) }}>
      <TermBar label="SKILL.md" />
      <div style={{ padding: "18px 26px", fontFamily: MONO, fontSize: 21, lineHeight: 1.55, color: "#ECE9E2", transform: `translateY(${-interpolate(t, [A.kompletten, A.guide], [0, 260], clamp)}px)` }}>
        {["---", "name: arena", "description: Lässt viele Helfer", "  dieselbe Aufgabe lösen …", "---", "# Arena", "## Schritt 0: Aufgabenkarte", "- Aufgabe, Empfänger", "- Kriterien, Rahmen", "## Schritt 1: Teilnehmerfeld", "- Standard 16 Helfer", "## Strategie-Katalog", "1. Vom Empfänger aus", "2. Rückwärts vom Ziel", "3. Drei Entwürfe …", "## Schritt 3: Turnier", "- Wer nicht begründet,", "  fliegt raus", "## Schritt 4: Finale"].map((l, i) => (
          <div key={i} style={{ color: l.startsWith("#") ? C.orange : l.startsWith("name") || l.startsWith("description") ? C.gold : "#ECE9E2", whiteSpace: "pre" }}>{l}</div>
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", left: 700, top: 120, display: "flex", flexDirection: "column", gap: 26 }}>
      {t > A.kompletten ? <div style={popStyle(t, A.kompletten, 10, 0.6)}><Tag text="✓ KOMPLETTER SKILL" color={C.orange} size={22} /></div> : null}
      {t > A.beispielaufgaben - 0.1 ? <div style={popStyle(t, A.beispielaufgaben - 0.1, 10, 0.6)}><Tag text="✓ 3 BEISPIELE" color={C.ink} size={22} /></div> : null}
      {t > A.guide - 0.1 ? <div style={popStyle(t, A.guide - 0.1, 10, 0.6)}><Tag text="✓ 8 SEITEN GUIDE" color={C.green} size={22} /></div> : null}
    </div>
  </>
);

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: ARENA1.from, origin: "50% 50%", El: SceneHook },
  { from: ARENA1.to, to: A.gibt, origin: "50% 40%", El: SceneTerminal },
  { from: A.gibt, to: A.aber, origin: "50% 45%", El: SceneTask },
  { from: A.aber, to: ARENA2.from, origin: "50% 50%", El: SceneStrategies },
  { from: ARENA2.to, to: A.richtest, origin: "50% 50%", El: SceneResult },
  { from: A.richtest, to: A.den, origin: "50% 45%", El: SceneOneWord },
  { from: A.den, to: 999, origin: "50% 45%", El: SceneGuide },
];

// ---------- captions: orange pill on the seam, active word in a black pill ----------
const chunks = (() => {
  const out: { start: number; end: number; words: { w: string; s: number }[] }[] = [];
  let cur: Cap[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => ({ w: c.text.replace(/[.,!?]/g, "").toUpperCase(), s: c.startMs / 1000 })) });
    cur = [];
  };
  for (const c of CAPS) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 20) || (cur.length && len > 22)) flush();
    cur.push(c);
    if (/[.,!?]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
})();
const SeamCaption: React.FC<{ t: number; y: number }> = ({ t, y }) => {
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = pop(t, c.start - 0.04, 0.16);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.08), background: C.orange, borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: MONO, fontWeight: 700, fontSize: 46, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(120,50,25,0.30)" }}>
        {(() => {
          const cw = 46 * 0.74, gapW = 46 * 0.5;
          const xs: number[] = []; let acc = 0;
          c.words.forEach((w) => { xs.push(acc); acc += w.w.length * cw + gapW; });
          const ws = c.words.map((w) => w.w.length * cw - 46 * 0.14);
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

// ---------- guide scroll (real PDF pages, Henri 2026-10-12/13) ----------
const PAGES = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => staticFile(`arena-guide/p${n}.png`));
const PDF = { left: 120, top: 560, w: 840, h: 1220, bar: 76, pw: 780, ph: Math.round((780 * 842) / 595), gap: 26 };
const PITCH = PDF.ph + PDF.gap;
export const PDF_IN = A.beispielaufgaben - 0.15;
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
        <div style={{ width: 34, height: 40, borderRadius: 6, background: C.red, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 12, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 5, boxSizing: "border-box" }}>PDF</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: "#FFF", whiteSpace: "nowrap" }}>Arena – Guidebook.pdf</div>
        <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 26, color: "#FFF", background: C.orange, borderRadius: 10, padding: "6px 14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{page} / {PAGES.length}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: PDF.bar, bottom: 0, overflow: "hidden" }}>
        {Array.from({ length: SAMPLES }, (_, j) => {
          const yy = scrollY(t - (j / (SAMPLES - 1)) * SHUTTER);
          return (
            <div key={j} style={{ position: "absolute", left: (PDF.w - PDF.pw) / 2, top: 22 - yy, opacity: 1 / (j + 1) }}>
              {PAGES.map((src, i) => (
                <Img key={i} src={src} style={{ position: "absolute", left: 0, top: i * PITCH, width: PDF.pw, height: PDF.ph, borderRadius: 6, boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- master ----------
// avatar framing: facefocus.py on tightened.mp4 (panel 0.427): focus 0.51/0.597, faceTop_min 1097, chin_max 1647
const FOCUS = { x: 0.51, y: 0.597, scale: 1.0 };
const CTA = A.komm - 0.12;
const SPLIT_SRC_TOP = 430; // source row that sits on the seam in the split
const CHEST_Y = 1540; // full frame: caption centre on chest/shoulder height
export const ArenaOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const inArena1 = t >= ARENA1.from && t < ARENA1.to;
  const inArena2 = t >= ARENA2.from && t < ARENA2.to;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = camera(t, scene.from, Math.min(scene.to, CTA));
  const dx = Math.sin(t * 0.6) * 6, dy = Math.cos(t * 0.45) * 5;
  const full = k(t, CTA, 0.42, Easing.inOut(Easing.cubic));
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTopSplit = Math.min(PH, Math.max(H - vh, PH - SPLIT_SRC_TOP * s));
  const vTop = vTopSplit * (1 - full);
  const push = 1 + 0.05 * k(t, CTA + 0.45, 2.0, Easing.inOut(Easing.sin));
  const El = scene.El;
  const followed = t > A.folg + 0.25;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${push})`, transformOrigin: "50% 45%" }}>
        <OffthreadVideo src={staticFile("render-arena-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {full < 1 && !inArena1 && !inArena2 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * full, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
          </div>
          {t < ARENA1.from ? <HookPills t={t} /> : null}
        </div>
      ) : null}
      {inArena1 ? <ArenaOne t={t} /> : null}
      {inArena2 ? <ArenaTwo t={t} /> : null}
      <PdfScroll t={t} />
      {t > A.komm - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.komm - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 26px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>{typed("ARENA", t, A.arena - 0.1, A.arena + 0.25) || " "}</div>
          </div>
          {t > A.folg - 0.08 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#FFF", borderRadius: 999, padding: "12px 14px 12px 26px", boxShadow: "0 12px 26px rgba(0,0,0,0.25)", ...popStyle(t, A.folg - 0.08, 10, 0.6) }}>
              <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: C.ink }}>@florent_preusser</span>
              <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#FFF", background: followed ? C.green : "#3E8EF7", borderRadius: 999, padding: "10px 22px" }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
            </div>
          ) : null}
        </div>
      ) : null}
      <SeamCaption t={t} y={PH + (CHEST_Y - PH) * full} />
    </AbsoluteFill>
  );
};
