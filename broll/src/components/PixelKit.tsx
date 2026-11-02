import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadRubik } from "@remotion/google-fonts/Rubik";

// PixelKit: building blocks for the "Pixelwelt" look (skill pixelwelt-look), measured from
// @claudebyseb on 2026-10-21 - see ~/.claude/skills/pixelwelt-look/references/design-regeln.md.
// All sizes assume a 1080×1920 canvas. Timings are in seconds, converted with the composition fps.

const { fontFamily: rubik } = loadRubik("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });
export const pixelFont = rubik;

export type PixelTheme = {
  bg: string; bgPattern: "hex" | "paper" | "none"; floor: string; floorLine: string; accent: string;
  dark: string; gold: string; green: string; cream: string; ink: string;
};

// one world per reel; add a theme per topic, keep the caption colours constant
export const THEMES: Record<string, PixelTheme> = {
  night: { bg: "#151F2C", bgPattern: "hex", floor: "#0D1621", floorLine: "#B8E3E7", accent: "#5FD3E0", dark: "#111723", gold: "#C8A14C", green: "#335A3F", cream: "#F0E6C8", ink: "#161921" },
  parchment: { bg: "#E6E1D4", bgPattern: "paper", floor: "#164533", floorLine: "#CAB171", accent: "#2E7D4F", dark: "#173025", gold: "#C8A14C", green: "#335A3F", cream: "#F0E6C8", ink: "#161921" },
  gym: { bg: "#1C1F2B", bgPattern: "hex", floor: "#2A1E1A", floorLine: "#FF8A4C", accent: "#FF8A4C", dark: "#14161F", gold: "#C8A14C", green: "#335A3F", cream: "#F0E6C8", ink: "#161921" },
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const FLOOR_Y = 1230; // ~64 % of 1920
export const CAPTION_Y = 1400; // ~73 % of 1920

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps, f: (s: number) => Math.round(s * fps) };
};
export const usePop = (at: number, damping = 10) => {
  const { frame, fps, f } = useT();
  return spring({ frame: frame - f(at), fps, config: { damping, stiffness: 190, mass: 0.6 } });
};
// deterministic jitter so renders are stable
const jitter = (i: number, amp: number) => (Math.sin(i * 12.9898) * 43758.5453 % 1) * amp;

// ---------- stage ----------
export const Stage: React.FC<{ theme: PixelTheme; children?: React.ReactNode }> = ({ theme, children }) => {
  const pattern = theme.bgPattern === "hex"
    ? { backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='104'><path d='M30 2 L90 2 L118 52 L90 102 L30 102 L2 52 Z' fill='none' stroke='${theme.accent}' stroke-opacity='0.13' stroke-width='3'/></svg>`)}")`, backgroundSize: "180px 156px" }
    : theme.bgPattern === "paper"
      ? { backgroundImage: "radial-gradient(rgba(0,0,0,.05) 1px, transparent 1px)", backgroundSize: "6px 6px" }
      : {};
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <AbsoluteFill style={pattern} />
      <div style={{ position: "absolute", left: 0, right: 0, top: FLOOR_Y, bottom: 0, background: theme.floor, backgroundImage: `linear-gradient(90deg, rgba(255,255,255,.04) 2px, transparent 2px)`, backgroundSize: "120px 100%" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: FLOOR_Y - 2, height: 4, background: theme.floorLine, boxShadow: `0 0 18px ${theme.floorLine}, 0 0 40px ${theme.floorLine}` }} />
      {children}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,.4) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ---------- pixel sprite ----------
// Each string row is one pixel row; a palette maps characters to colours, "." is transparent.
export const PixelSprite: React.FC<{ rows: string[]; palette: Record<string, string>; px: number; style?: React.CSSProperties }> = ({ rows, palette, px, style }) => {
  const w = Math.max(...rows.map((r) => r.length));
  return (
    <svg width={w * px} height={rows.length * px} viewBox={`0 0 ${w} ${rows.length}`} shapeRendering="crispEdges" style={style}>
      {rows.flatMap((r, y) => [...r].map((c, x) => (c === "." || !palette[c] ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={palette[c]} />)))}
    </svg>
  );
};

// Sir Token as a pixel sprite (coin, top hat, monocle, moustache). Placeholder until a hand-made
// pixel sheet exists; expressions only swap the eye rows.
const SIR_BODY = [
  ".......HHHHHHH.......",
  ".......HHHHHHH.......",
  ".......HHHHHHH.......",
  ".......BBBBBBB.......",
  ".....HHHHHHHHHHH.....",
  "......KKKKKKKKK......",
  "....KKYYYYYYYYYKK....",
  "...KYYYYYYYYYYYYYK...",
  "..KYYYYYYYYYYYYYYYK..",
  "..KYYYYYYYYYYYYYYYK..",
  "..KYYYYYYYYYYYYYYYK..",
  "WWKYYYYYMMMMMYYYYYKWW",
  "WWKYYYYMMMMMMMYYYYKWW",
  "..KYyYYYYYYYYYYYyYK..",
  "...KYyyYYYYYYYyyYK...",
  "....KKYYYYYYYYYKK....",
  "......KKKKKKKKK......",
  ".......K.....K.......",
  ".......K.....K.......",
  "......SSS...SSS......",
];
const EYES: Record<string, string[]> = {
  normal: ["..KYYWWWYYYYGGGGYYK..", "..KYYWEWYYYYGEWGYYK..", "..KYYYYYYYYYGGGGYYK.."],
  happy: ["..KYYYYYYYYYGGGGYYK..", "..KYYEYEYYYYGEYEGYK..", "..KYYYEYYYYYGYEYGYK.."],
  shocked: ["..KYWWWWYYYGWWWWGYK..", "..KYWEEWYYYGWEEWGYK..", "..KYWWWWYYYGWWWWGYK.."],
};
export const SIR_PALETTE = { H: "#1B1B1F", B: "#E0A526", K: "#5A3A06", Y: "#F6C02E", y: "#D99A12", W: "#FFFFFF", E: "#15110C", G: "#CFE9F2", M: "#4A2C14", S: "#121212" };
export const sirTokenRows = (expr: keyof typeof EYES = "normal") => [...SIR_BODY.slice(0, 8), ...EYES[expr], ...SIR_BODY.slice(11)];

/** sprite standing on the floor line; x = centre; walks from fromX to x between at and at+walk */
export const PixelMascot: React.FC<{ x: number; at: number; px?: number; expr?: keyof typeof EYES; fromX?: number; walk?: number; flip?: boolean; rows?: string[]; palette?: Record<string, string> }> = ({ x, at, px = 12, expr = "normal", fromX, walk = 0.6, flip, rows, palette }) => {
  const { t } = useT();
  const r = rows ?? sirTokenRows(expr);
  const p = interpolate(t, [at, at + walk], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const cx = fromX === undefined ? x : fromX + (x - fromX) * p;
  const walking = fromX !== undefined && p < 1;
  const hop = walking ? Math.abs(Math.sin(t * 18)) * 14 : Math.abs(Math.sin(t * 4)) * 4;
  const w = Math.max(...r.map((s) => s.length)) * px;
  const h = r.length * px;
  if (t < at - 0.01 && fromX === undefined) return null;
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: FLOOR_Y - h - hop + 2, transform: flip ? "scaleX(-1)" : undefined }}>
      <PixelSprite rows={r} palette={palette ?? SIR_PALETTE} px={px} style={{ filter: "drop-shadow(0 0 0 #000) drop-shadow(0 6px 0 rgba(0,0,0,.35))" }} />
    </div>
  );
};

// ---------- stickers, slots, badges ----------
export const Sticker: React.FC<{ x: number; y: number; w: number; at: number; label?: string; rot?: number; children: React.ReactNode }> = ({ x, y, w, at, label, rot = -3, children }) => {
  const p = usePop(at, 9);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${p}) rotate(${rot}deg)`, transformOrigin: "center bottom" }}>
      <div style={{ background: "#FFFFFF", borderRadius: 18, padding: 10, boxShadow: "0 10px 0 rgba(0,0,0,.28), 0 18px 30px rgba(0,0,0,.25)" }}>
        <div style={{ borderRadius: 10, overflow: "hidden" }}>{children}</div>
        {label && <div style={{ fontFamily: rubik, fontWeight: 800, fontSize: 30, letterSpacing: 1, textAlign: "center", color: "#14171D", paddingTop: 8 }}>{label}</div>}
      </div>
    </div>
  );
};

export const Slot: React.FC<{ x: number; y: number; w: number; h: number; theme: PixelTheme; filledAt?: number; children?: React.ReactNode; label?: string }> = ({ x, y, w, h, theme, filledAt, children, label }) => {
  const { t } = useT();
  const filled = filledAt !== undefined && t >= filledAt;
  return (
    <>
      {!filled && (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: `4px dashed ${theme.accent}`, borderRadius: 16, opacity: 0.55, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: rubik, fontWeight: 800, fontSize: h * 0.4, color: theme.accent }}>?</div>
      )}
      {filledAt !== undefined && <Sticker x={x - 6} y={y - 6} w={w + 12} at={filledAt} label={label}>{children}</Sticker>}
    </>
  );
};

export const CheckBadge: React.FC<{ x: number; y: number; at: number; size?: number }> = ({ x, y, at, size = 86 }) => {
  const p = usePop(at, 8);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", background: "#2FBF71", border: "6px solid #fff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.55, fontFamily: rubik, fontWeight: 800, transform: `scale(${p})`, boxShadow: "0 6px 0 rgba(0,0,0,.3)" }}>✓</div>
  );
};

export const Stamp: React.FC<{ text: string; x: number; y: number; at: number; color: string; rot?: number; size?: number }> = ({ text, x, y, at, color, rot = -10, size = 110 }) => {
  const { t } = useT();
  const p = interpolate(t, [at, at + 0.12], [1.8, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (t < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${p}) rotate(${rot}deg)`, fontFamily: rubik, fontWeight: 800, fontSize: size, color, border: `10px solid ${color}`, borderRadius: 18, padding: "0 28px", letterSpacing: 4, background: "rgba(255,255,255,.12)", opacity: 0.92 }}>{text}</div>
  );
};

export const Odometer: React.FC<{ x: number; y: number; from: number; to: number; at: number; dur?: number; label: string; theme: PixelTheme; digits?: number }> = ({ x, y, from, to, at, dur = 1.2, label, theme, digits = 4 }) => {
  const { t } = useT();
  const v = Math.round(interpolate(t, [at, at + dur], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translateX(-50%)", background: theme.dark, border: `5px solid ${theme.gold}`, borderRadius: 18, padding: "10px 22px 8px", textAlign: "center", boxShadow: "0 8px 0 rgba(0,0,0,.3)" }}>
      <div style={{ fontFamily: rubik, fontWeight: 800, fontSize: 72, letterSpacing: 10, color: theme.floorLine }}>{String(v).padStart(digits, "0")}</div>
      <div style={{ fontFamily: rubik, fontWeight: 800, fontSize: 22, letterSpacing: 3, color: theme.cream }}>{label}</div>
    </div>
  );
};

export const StepBadge: React.FC<{ n: number; at: number; theme: PixelTheme }> = ({ n, at, theme }) => {
  const p = usePop(at, 9);
  return (
    <div style={{ position: "absolute", left: 36, top: 70, width: 150, height: 150, borderRadius: 26, background: theme.dark, border: `6px solid ${theme.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: rubik, fontWeight: 800, fontSize: 120, color: theme.floorLine, transform: `scale(${p}) rotate(-4deg)`, boxShadow: "0 8px 0 rgba(0,0,0,.35)" }}>{n}</div>
  );
};

export const MiniGrid: React.FC<{ total: number; current: number; theme: PixelTheme }> = ({ total, current, theme }) => {
  const cols = 3;
  return (
    <div style={{ position: "absolute", right: 36, top: 70, display: "grid", gridTemplateColumns: `repeat(${cols}, 44px)`, gap: 6, padding: 10, background: theme.dark, border: `4px solid ${theme.gold}55`, borderRadius: 14 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: 44, height: 44, borderRadius: 8, background: i + 1 === current ? theme.gold : i + 1 < current ? theme.accent : "rgba(255,255,255,.08)", color: i + 1 <= current ? theme.ink : "rgba(255,255,255,.3)", fontFamily: rubik, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
      ))}
    </div>
  );
};

// ---------- captions ----------
export type Word = { w: string; s: number; e: number };
export const groupWords = (words: Word[], max = 3) => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w) => {
    cur.push(w);
    if (cur.length === max || /[.,:!?]$/.test(w.w)) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
};

export const PillCaptions: React.FC<{ words: Word[]; theme: PixelTheme; y?: number }> = ({ words, theme, y = CAPTION_Y }) => {
  const { t, fps } = useT();
  const groups = React.useMemo(() => groupWords(words), [words]);
  const gi = groups.findIndex((g, i) => t >= g[0].s - 0.02 && (i === groups.length - 1 || t < groups[i + 1][0].s - 0.02));
  if (gi < 0) return null;
  const g = groups[gi];
  const base = words.indexOf(g[0]);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: y, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
      {g.map((w, i) => {
        const idx = base + i;
        const shown = t >= w.s - 0.02;
        const ghost = !shown && i === g.findIndex((x) => t < x.s - 0.02);
        if (!shown && !ghost) return null;
        const age = (t - w.s) * fps;
        const s = shown ? interpolate(age, [0, 3, 6], [0.6, 1.06, 1], clamp) : 0.9;
        const green = idx % 3 === 1;
        return (
          <span key={idx} style={{
            fontFamily: rubik, fontWeight: 800, fontSize: 76, lineHeight: 1, padding: "14px 22px 12px", borderRadius: 18,
            background: green ? theme.green : theme.gold, color: green ? theme.cream : theme.ink,
            border: "3px solid rgba(0,0,0,.55)", boxShadow: "inset 0 4px 0 rgba(255,255,255,.25), 0 6px 0 rgba(0,0,0,.45)",
            transform: `translateY(${jitter(idx, 10) - 5}px) rotate(${jitter(idx + 7, 4) - 2}deg) scale(${s})`, opacity: shown ? 1 : 0.35,
          }}>{w.w.replace(/[.,:!?]$/, "")}</span>
        );
      })}
    </div>
  );
};

// ---------- end card ----------
export const CommentCard: React.FC<{ keyword: string; at: number; y?: number; theme: PixelTheme }> = ({ keyword, at, y = 260, theme }) => {
  const { t } = useT();
  const p = usePop(at, 11);
  const typed = keyword.slice(0, Math.max(0, Math.floor((t - at - 0.3) * 10)));
  const sent = t >= at + 0.4 + keyword.length / 10;
  const sp = usePop(at + 0.4 + keyword.length / 10, 9);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, transform: `scale(${p})`, background: "#FBFAF5", borderRadius: 30, padding: "22px 26px", boxShadow: "0 12px 0 rgba(0,0,0,.3)" }}>
      <div style={{ fontFamily: rubik, fontWeight: 800, fontSize: 34, color: theme.ink }}>💬 Kommentare</div>
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 18, border: `5px solid ${sent ? "#2FBF71" : theme.floorLine}`, borderRadius: 60, padding: "12px 16px" }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: theme.gold, color: theme.ink, fontFamily: rubik, fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>DU</div>
        <div style={{ fontFamily: rubik, fontWeight: 800, fontSize: 70, letterSpacing: 3, color: theme.ink }}>{typed}<span style={{ opacity: sent ? 0 : 1 }}>|</span></div>
        <div style={{ marginLeft: "auto", width: 80, height: 80, borderRadius: "50%", background: sent ? "#3BA9E0" : "#C9C9C9", color: "#fff", fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</div>
      </div>
      {sent && (
        <div style={{ position: "absolute", right: 40, top: -26, background: "#2FBF71", color: "#fff", fontFamily: rubik, fontWeight: 800, fontSize: 28, padding: "6px 18px", borderRadius: 30, transform: `scale(${sp})` }}>✓ gesendet</div>
      )}
    </div>
  );
};

export const Checklist: React.FC<{ title: string; items: string[]; x: number; y: number; w: number; at: number; theme: PixelTheme; tickEvery?: number }> = ({ title, items, x, y, w, at, theme, tickEvery = 0.12 }) => {
  const { t } = useT();
  return (
    <Sticker x={x} y={y} w={w} at={at} rot={-2}>
      <div style={{ background: "#FFF8EA", padding: 22, fontFamily: rubik, fontWeight: 800, color: theme.ink }}>
        <div style={{ background: theme.dark, color: theme.floorLine, fontSize: 34, letterSpacing: 2, padding: "10px 16px", borderRadius: 10 }}>{title}</div>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, marginTop: 10 }}>
            <span style={{ color: theme.accent, width: 30 }}>{i + 1}</span>{it}
            <span style={{ marginLeft: "auto", width: 36, height: 36, borderRadius: 8, border: "3px solid #2FBF71", background: t >= at + 0.3 + i * tickEvery ? "#2FBF71" : "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{t >= at + 0.3 + i * tickEvery ? "✓" : ""}</span>
          </div>
        ))}
      </div>
    </Sticker>
  );
};

export const SpeechBubble: React.FC<{ text: string; x: number; y: number; w: number; at: number; theme: PixelTheme; tail?: "left" | "right" }> = ({ text, x, y, w, at, theme, tail = "left" }) => {
  const p = usePop(at, 10);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${p})`, transformOrigin: tail === "left" ? "left bottom" : "right bottom" }}>
      <div style={{ background: "#FFFFFF", border: `6px solid ${theme.accent}`, borderRadius: 28, padding: "18px 24px", fontFamily: rubik, fontWeight: 800, fontSize: 40, lineHeight: 1.15, color: theme.ink, boxShadow: "0 8px 0 rgba(0,0,0,.3)" }}>{text}</div>
      <div style={{ position: "absolute", bottom: -26, [tail]: 46, width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderTop: `30px solid ${theme.accent}` }} />
    </div>
  );
};

// small pixel props for the gym world
export const DUMBBELL_ROWS = ["KK.........KK", "KKK.......KKK", "KKKMMMMMMMKKK", "KKK.......KKK", "KK.........KK"];

