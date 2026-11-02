import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";
import { fonts } from "../theme";

// PanelKit (2026-10-06): the "always something moving" split style, learned from @alan.buildz
// (research/creators/alan.buildz/split-broll-analyse-2026-10-06.md). Dark panel on the top 40 %,
// the speaker big in the bottom 60 %, a micro-event every 0.4-0.8 s, the Superkind smiley as the
// recurring character (Pius' pick instead of Claude's crab). Everything is drawn here, no images.

const { fontFamily: serif } = loadNewsreader("normal", { weights: ["400", "600"], subsets: ["latin", "latin-ext"] });
const { fontFamily: serifItalic } = loadNewsreader("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] });
export { serif, serifItalic };

export const W = 1080;
export const H = 1920;
export const PANEL = 768; // 40 %
// Light Superkind look (Pius 2026-10-06: "übernimm die Farben und das Branding von den Videos zuvor, weiß orange"),
// same palette as ExplainerKit boards.
export const P = { bg: "#EDEDED", card: "#FFFFFF", line: "#E2E2E2", text: "#1C1C1C", dim: "#8A8A8A", orange: "#FF6B35", green: "#2E9E5B", red: "#E5484D", yellow: "#E8A33D" };

const ease = Easing.bezier(0.2, 0.9, 0.25, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const useSec = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
/** 0→1 between a and b seconds. */
export const ramp = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: ease });
/** Spring-ish pop 0→1 with a small overshoot, starting at a. */
export const popAt = (t: number, a: number, d = 0.28) => {
  const x = (t - a) / d;
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return 1 + 0.18 * Math.sin(Math.PI * x) * (1 - x) * 3 - (1 - x) * (1 - x) * (1 - x);
};

export type AvatarSrc = { src: string; startSec: number; focus?: { x: number; y: number }; scale?: number; faceAt?: number };
const resolve = (s: string) => (/^(https?:|file:)/.test(s) ? s : staticFile(s));

/** Speaker big in the bottom 60 %. */
export const SpeakerPanel: React.FC<{ avatar: AvatarSrc }> = ({ avatar }) => {
  const { fps } = useVideoConfig();
  const h = H - PANEL;
  const s = avatar.scale ?? 1.22;
  const f = avatar.focus ?? { x: 0.52, y: 0.5 };
  const vw = W * s;
  const vh = H * s;
  const left = Math.min(0, Math.max(W - vw, W / 2 - f.x * vw));
  const top = Math.min(0, Math.max(h - vh, h * (avatar.faceAt ?? 0.36) - f.y * vh));
  return (
    <div style={{ position: "absolute", left: 0, top: PANEL, width: W, height: h, overflow: "hidden", background: "#000" }}>
      <OffthreadVideo src={resolve(avatar.src)} startFrom={Math.round(avatar.startSec * fps)} muted style={{ position: "absolute", left, top, width: vw, height: vh }} />
    </div>
  );
};

/** Small Superkind tag in the panel corner (brand bug). */
export const Brand: React.FC = () => (
  <div style={{ position: "absolute", right: 26, bottom: 18, display: "flex", alignItems: "center", gap: 10, opacity: 0.85 }}>
    <div style={{ width: 26, height: 26, borderRadius: "50%", background: P.orange, position: "relative" }}>
      <div style={{ position: "absolute", left: 7, top: 8, width: 3, height: 5, borderRadius: 2, background: "#1B1B1B" }} />
      <div style={{ position: "absolute", left: 15, top: 8, width: 3, height: 5, borderRadius: 2, background: "#1B1B1B" }} />
      <div style={{ position: "absolute", left: 7, top: 14, width: 12, height: 5, borderBottom: "2px solid #1B1B1B", borderRadius: "0 0 8px 8px" }} />
    </div>
    <span style={{ fontFamily: fonts.bold, fontSize: 22, color: P.text, letterSpacing: -0.5 }}>superkind</span>
  </div>
);

/** The split frame: children draw inside the 1080×768 panel. */
// v4 (2026-10-06, @opusjake reference): faint millimetre grid on the panel, and `full` = panel fills the
// whole frame (no speaker) for ~1/3 of the B-Roll time; the 1080×768 scene then sits at top FULL_OY and
// may draw below it (extra space down to ~1450, captions sit at y 0.8 = 1536).
export const FULL_OY = 360;
const GRID = `linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)`;
export const PanelSplit: React.FC<{ avatar: AvatarSrc; children: React.ReactNode; full?: boolean; brand?: boolean }> = ({ avatar, children, full, brand = true }) => (
  <AbsoluteFill style={{ background: P.bg }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: full ? H : PANEL, overflow: "hidden", background: `${GRID}, radial-gradient(ellipse at 50% 40%, #F7F7F7 0%, ${P.bg} 65%, #E2E2E2 100%)`, backgroundSize: "36px 36px, 36px 36px, 100% 100%" }}>
      <div style={{ position: "absolute", left: 0, top: full ? FULL_OY : 0, width: W, height: PANEL, overflow: "visible" }}>{children}</div>
      {brand ? <div style={{ position: "absolute", right: 0, bottom: full ? 300 : 0, width: W, height: 60 }}><Brand /></div> : null}
    </div>
    {full ? null : <SpeakerPanel avatar={avatar} />}
  </AbsoluteFill>
);

/** Superkind smiley as a little character: bobs, blinks, optional arms/prop/mood. */
// variant "bubble" (2026-10-06, @florentgpt): neutral green chat-bubble buddy instead of the Superkind smiley.
export type Variant = "smiley" | "bubble";
export const MascotVariant = React.createContext<Variant>("smiley");
export const Smiley: React.FC<{ x: number; y: number; size?: number; t: number; mood?: "happy" | "shock" | "proud"; arms?: "down" | "up" | "point"; prop?: React.ReactNode; enter?: number }> = ({ x, y, size = 150, t, mood = "happy", arms = "down", prop, enter = 0 }) => {
  const variant = React.useContext(MascotVariant);
  const body = variant === "bubble" ? "#10A37F" : P.orange;
  const s = size;
  const a = popAt(t, enter, 0.35);
  const bob = Math.sin(t * 6) * s * 0.03;
  const blink = (t * 1.3) % 3 < 0.08 ? 0.15 : 1;
  const armL = arms === "up" ? -130 : arms === "point" ? -60 : -30;
  const armR = arms === "up" ? 130 : arms === "point" ? 100 : 30;
  return (
    <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2 + bob, width: s, height: s, transform: `scale(${a})`, transformOrigin: "50% 100%" }}>
      {[armL, armR].map((r, i) => (
        <div key={i} style={{ position: "absolute", left: i ? s * 0.86 : s * 0.02, top: s * 0.52, width: s * 0.12, height: s * 0.42, borderRadius: s, background: body, transformOrigin: "50% 0%", transform: `rotate(${r + Math.sin(t * 7 + i) * 6}deg)` }} />
      ))}
      {variant === "bubble" ? (
        <>
          <div style={{ position: "absolute", left: s * 0.18, bottom: -s * 0.1, width: 0, height: 0, borderLeft: `${s * 0.12}px solid transparent`, borderRight: `${s * 0.12}px solid transparent`, borderTop: `${s * 0.2}px solid #0B8A6A`, transform: "rotate(20deg)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: s * 0.34, background: "linear-gradient(160deg,#3DD6A8,#10A37F 60%,#0B8A6A)", boxShadow: "0 10px 30px rgba(16,163,127,0.35)" }} />
        </>
      ) : (
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #FF9A6B, ${P.orange} 60%, #E24E17)`, boxShadow: "0 10px 30px rgba(255,107,53,0.35)" }} />
      )}
      {[0.32, 0.6].map((ex) => (
        <div key={ex} style={{ position: "absolute", left: s * ex, top: s * (mood === "shock" ? 0.28 : 0.33), width: s * 0.1, height: s * (mood === "shock" ? 0.18 : 0.14) * blink, borderRadius: s, background: "#1B1B1B" }} />
      ))}
      {mood === "shock" ? (
        <div style={{ position: "absolute", left: s * 0.4, top: s * 0.6, width: s * 0.2, height: s * 0.2, borderRadius: "50%", background: "#1B1B1B" }} />
      ) : (
        <div style={{ position: "absolute", left: s * 0.27, top: s * (mood === "proud" ? 0.5 : 0.52), width: s * 0.46, height: s * 0.24, borderBottomLeftRadius: s, borderBottomRightRadius: s, borderBottom: `${s * 0.06}px solid #1B1B1B`, borderLeft: `${s * 0.06}px solid transparent`, borderRight: `${s * 0.06}px solid transparent`, boxSizing: "border-box" }} />
      )}
      {prop ? <div style={{ position: "absolute", left: s * 0.8, top: s * 0.1 }}>{prop}</div> : null}
    </div>
  );
};

/** Big word slam: scales in hard, small shake, then holds. */
export const Slam: React.FC<{ text: string; t: number; at: number; y?: number; size?: number; color?: string; accent?: string }> = ({ text, t, at, y = 300, size = 150, color = P.text, accent }) => {
  if (t < at) return null;
  const k = ramp(t, at, at + 0.18);
  const shake = t - at < 0.3 ? Math.sin((t - at) * 90) * (1 - (t - at) / 0.3) * 10 : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", transform: `translateX(${shake}px) scale(${1.6 - 0.6 * k})`, opacity: k, fontFamily: fonts.bold, fontSize: size, letterSpacing: -4, color, lineHeight: 1 }}>
      {accent ? <span style={{ color: P.orange }}>{accent} </span> : null}{text}
    </div>
  );
};

/** Number rail 1-2-3, the active one glows. */
export const Rail: React.FC<{ active: number; t: number; at?: number; y?: number }> = ({ active, t, at = 0, y = 40 }) => {
  const a = ramp(t, at, at + 0.25);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: a }}>
      {[1, 2, 3].map((n) => {
        const on = n === active;
        const done = n < active;
        return (
          <React.Fragment key={n}>
            <div style={{ width: on ? 92 : 66, height: on ? 92 : 66, borderRadius: "50%", background: on ? P.orange : done ? "#FFE4D6" : P.card, border: `3px solid ${on ? P.orange : P.line}`, color: on ? "#FFF" : done ? P.orange : P.dim, fontFamily: fonts.bold, fontSize: on ? 48 : 34, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: on ? "0 0 36px rgba(255,107,53,0.45)" : "0 6px 16px rgba(0,0,0,0.06)" }}>{done ? "✓" : n}</div>
            {n < 3 ? <div style={{ width: 70, height: 4, borderRadius: 2, background: n < active ? P.orange : P.line }} /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Rotated stamp that slams onto a spot. */
export const Stamp: React.FC<{ text: string; t: number; at: number; x: number; y: number; color?: string; size?: number; rot?: number }> = ({ text, t, at, x, y, color = P.red, size = 40, rot = -10 }) => {
  if (t < at) return null;
  const k = ramp(t, at, at + 0.14);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${2 - k})`, opacity: k, border: `5px solid ${color}`, color, borderRadius: 12, padding: "6px 18px", fontFamily: fonts.bold, fontSize: size, letterSpacing: 3, background: "rgba(255,255,255,0.85)" }}>{text}</div>
  );
};

/** Counting number. */
export const Count: React.FC<{ from: number; to: number; t: number; a: number; b: number; suffix?: string; prefix?: string; style?: React.CSSProperties }> = ({ from, to, t, a, b, suffix = "", prefix = "", style }) => {
  const v = Math.round(from + (to - from) * ramp(t, a, b));
  return <span style={style}>{prefix}{v.toLocaleString("de-DE")}{suffix}</span>;
};

/** Card that flies in from the side. */
export const Fly: React.FC<{ t: number; at: number; from?: "left" | "right" | "bottom"; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, at, from = "right", children, style }) => {
  const k = popAt(t, at, 0.3);
  const d = (1 - Math.min(k, 1)) * 260;
  const tr = from === "left" ? `translateX(${-d}px)` : from === "right" ? `translateX(${d}px)` : `translateY(${d}px)`;
  return <div style={{ position: "absolute", opacity: Math.min(1, k * 1.5), transform: tr, ...style }}>{children}</div>;
};

export const Pill: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = P.card, size = 34 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 26px", borderRadius: 22, background: color, border: `2px solid ${P.line}`, color: color === P.card ? P.text : "#FFF", fontFamily: fonts.semibold, fontSize: size, boxShadow: "0 12px 30px rgba(0,0,0,0.10)" }}>{children}</div>
);

// ---------- 2026-10-06 v2: walking smiley + real logos (Pius: "gib dem Smiley eine Funktion", "mehr Logos") ----------

import { SIMPLE_ICONS } from "./logoPaths";

/** Brand mark from Simple Icons (CC0) in a white rounded tile. */
export const Logo: React.FC<{ name: string; size?: number; tile?: boolean }> = ({ name, size = 64, tile = true }) => {
  const ic = SIMPLE_ICONS[name];
  if (!ic) return null;
  const inner = (
    <svg width={tile ? size * 0.62 : size} height={tile ? size * 0.62 : size} viewBox="0 0 24 24">
      <path d={ic.d} fill={ic.hex} />
    </svg>
  );
  if (!tile) return inner;
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.24, background: "#FFF", boxShadow: "0 6px 18px rgba(0,0,0,0.10)", border: `1.5px solid ${P.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{inner}</div>
  );
};

/** Red PDF document badge (no brand logo available). */
export const PdfBadge: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: "#FFF", boxShadow: "0 6px 18px rgba(0,0,0,0.10)", border: `1.5px solid ${P.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <div style={{ width: size * 0.5, height: size * 0.62, borderRadius: size * 0.06, background: "#E5252A", color: "#FFF", fontFamily: fonts.bold, fontSize: size * 0.17, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: size * 0.06, boxSizing: "border-box" }}>PDF</div>
  </div>
);

export type WalkKey = { t: number; x: number; y: number; hop?: number };
/** Position on a keyed path: eased walk between keys, optional hop arc (px) on the way into a key. */
export const walk = (keys: WalkKey[], t: number) => {
  if (t <= keys[0].t) return { x: keys[0].x, y: keys[0].y, moving: false, dir: 1 };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (t <= b.t) {
      const p = ramp(t, a.t, b.t);
      const hop = (b.hop ?? 0) * Math.sin(Math.PI * p);
      return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p - hop, moving: p > 0 && p < 1 && (b.x !== a.x || b.y !== a.y), dir: b.x >= a.x ? 1 : -1 };
    }
  }
  const l = keys[keys.length - 1];
  return { x: l.x, y: l.y, moving: false, dir: 1 };
};

/** Smiley that follows a path; waddles while moving, faces the walking direction. */
export const Walker: React.FC<{ keys: WalkKey[]; t: number; size?: number; mood?: "happy" | "shock" | "proud"; arms?: "down" | "up" | "point"; prop?: React.ReactNode; enter?: number }> = ({ keys, t, size = 110, mood, arms, prop, enter = 0 }) => {
  const w = walk(keys, t);
  const waddle = w.moving ? Math.sin(t * 22) * 7 : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${waddle}deg)`, transformOrigin: `${w.x}px ${w.y + size / 2}px` }}>
      <div style={{ position: "absolute", left: w.x - size * 0.32, top: w.y + size * 0.42, width: size * 0.64, height: size * 0.12, borderRadius: "50%", background: "rgba(0,0,0,0.12)" }} />
      <div style={{ transform: `scaleX(${w.dir})`, transformOrigin: `${w.x}px ${w.y}px` }}>
        <Smiley x={w.x} y={w.y} size={size} t={t} mood={mood} arms={w.moving ? "up" : arms} prop={prop} enter={enter} />
      </div>
    </div>
  );
};

// ---------- v4 props + crowd (opusjake: the mascot carries a prop per topic, quantities shown as a crowd) ----------

export const PropLens = <div style={{ width: 58, height: 58, borderRadius: "50%", border: "9px solid #1B1B1B", background: "rgba(255,255,255,0.5)", position: "relative" }}><div style={{ position: "absolute", left: 44, top: 44, width: 12, height: 34, borderRadius: 6, background: "#1B1B1B", transform: "rotate(-45deg)" }} /></div>;
export const PropMegaphone = (
  <div style={{ position: "relative", width: 90, height: 60, transform: "rotate(-14deg)" }}>
    <div style={{ position: "absolute", left: 0, top: 18, width: 26, height: 24, borderRadius: 6, background: "#1B1B1B" }} />
    <div style={{ position: "absolute", left: 22, top: 0, width: 0, height: 0, borderTop: "30px solid transparent", borderBottom: "30px solid transparent", borderLeft: `60px solid #FFFFFF`, filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.25))", transform: "scaleX(-1)", transformOrigin: "30px 30px" }} />
    <div style={{ position: "absolute", left: 76, top: 0, width: 10, height: 60, borderRadius: 5, background: "#E24E17" }} />
  </div>
);
export const PropClipboard = (
  <div style={{ width: 62, height: 80, borderRadius: 8, background: "#C68B59", padding: 7, boxSizing: "border-box", position: "relative", transform: "rotate(8deg)" }}>
    <div style={{ position: "absolute", left: 20, top: -6, width: 22, height: 12, borderRadius: 4, background: "#1B1B1B" }} />
    <div style={{ width: "100%", height: "100%", background: "#FFF", borderRadius: 3, paddingTop: 8 }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ marginLeft: 6, marginTop: 6, width: 34, height: 5, borderRadius: 3, background: i === 2 ? "#E5484D" : "#BDBDBD" }} />)}
    </div>
  </div>
);
export const PropStamp = (
  <div style={{ position: "relative", width: 56, height: 78, transform: "rotate(12deg)" }}>
    <div style={{ position: "absolute", left: 18, top: 0, width: 20, height: 22, borderRadius: 10, background: "#1B1B1B" }} />
    <div style={{ position: "absolute", left: 24, top: 20, width: 8, height: 30, background: "#1B1B1B" }} />
    <div style={{ position: "absolute", left: 0, top: 48, width: 56, height: 20, borderRadius: 4, background: "#E5484D" }} />
  </div>
);
export const PropCap = <div style={{ width: 96, height: 34, borderRadius: "10px 10px 2px 2px", background: "#1C1C1C", transform: "translate(-118px,-34px)", fontFamily: fonts.bold, fontSize: 14, letterSpacing: 2, color: "#FFF", textAlign: "center", lineHeight: "34px" }}>PRÜFER</div>;

/** A crowd of mini smileys that pop in row by row and keep hopping out of phase. */
export const Crowd: React.FC<{ t: number; at: number; cols: number; rows: number; x: number; y: number; gap?: number; size?: number; step?: number; mood?: "happy" | "shock" | "proud" }> = ({ t, at, cols, rows, x, y, gap = 70, size = 54, step = 0.025, mood = "happy" }) => (
  <>
    {Array.from({ length: cols * rows }).map((_, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const a = at + i * step;
      if (t < a) return null;
      const hop = Math.max(0, Math.sin((t - a) * 9 + i * 1.7)) * 10;
      return <Smiley key={i} x={x + c * gap} y={y + r * gap - hop} size={size} t={t + i * 0.3} mood={mood} enter={a} />;
    })}
  </>
);

/** Paper receipt with a line pattern; `missing` turns it into a dashed red gap with a question mark. */
export const Receipt: React.FC<{ w?: number; missing?: boolean; rot?: number }> = ({ w = 90, missing, rot = 0 }) => (
  <div style={{ width: w, height: w * 1.3, borderRadius: 8, background: missing ? "rgba(229,72,77,0.07)" : "#FFF", border: missing ? "4px dashed #E5484D" : `1.5px solid ${P.line}`, boxShadow: missing ? "none" : "0 6px 16px rgba(0,0,0,0.10)", transform: `rotate(${rot}deg)`, boxSizing: "border-box", padding: w * 0.12, display: "flex", flexDirection: "column", gap: w * 0.08, alignItems: missing ? "center" : "stretch", justifyContent: missing ? "center" : "flex-start" }}>
    {missing ? <span style={{ fontFamily: fonts.bold, fontSize: w * 0.5, color: "#E5484D" }}>?</span> : [0.8, 0.6, 0.7, 0.4].map((k, i) => <div key={i} style={{ width: `${k * 100}%`, height: w * 0.06, borderRadius: 3, background: i === 3 ? P.text : "#D6D6D6" }} />)}
  </div>
);
