import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { fonts } from "../theme";

// Satire edit style (user request 2026-09-30, reference: help.hannaa reels DdtOZlRsGDm, Ddyluk0IVV_,
// Dd1f0OxonRJ). The speaker stays full frame the whole time; the rhythm comes from small "stickers"
// (screenshots, chat bubbles, emojis) that pop in above the head on the word that names them, thin
// white serif titles, hand-drawn arrows with short notes, and one-word white captions at chest height.
// No split screens, no full boards, no pills.

const { fontFamily: serif } = loadInstrumentSerif("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const { fontFamily: serifItalic } = loadInstrumentSerif("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] });
export { serif, serifItalic };

export const useSec = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { t: frame / fps, frame, fps };
};

// 0→1 spring from second `s`, and 1→0 fade after second `e`.
const useInOut = (s: number, e: number) => {
  const { frame, fps, t } = useSec();
  const inP = spring({ frame: frame - s * fps, fps, config: { damping: 14, stiffness: 190, mass: 0.6 } });
  const outP = interpolate(t, [e, e + 0.18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Anything that starts at 0 (the hook) is fully there on frame 0, it's the thumbnail.
  if (s <= 0) return { p: 1, o: outP, visible: t < e + 0.2 };
  return { p: t < s ? 0 : inP, o: t < s ? 0 : Math.min(1, inP * 1.4) * outP, visible: t >= s && t < e + 0.2 };
};

// A floating card that pops in above the head. x/y = centre in frame pixels.
export const Sticker: React.FC<{ from: number; to: number; x: number; y: number; rotate?: number; children: React.ReactNode }> = ({ from, to, x, y, rotate = 0, children }) => {
  const { p, o, visible } = useInOut(from, to);
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.72 + 0.28 * p}) rotate(${rotate}deg)`, opacity: o, filter: `blur(${(1 - Math.min(1, p)) * 6}px)` }}>
      {children}
    </div>
  );
};

// Thin white serif title (e.g. "Hedonic Treadmill"). `accent` renders in italic.
// `ink` = dark text for bright backgrounds (seated look with the white wall, 2026-10-02).
export const SerifTitle: React.FC<{ from: number; to: number; x: number; y: number; size?: number; align?: "left" | "center"; ink?: boolean; lines: { text: string; italic?: boolean; at?: number }[] }> = ({ from, to, x, y, size = 104, align = "left", ink = false, lines }) => {
  const { t } = useSec();
  const { o, visible } = useInOut(from, to);
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", left: align === "center" ? 0 : x, width: align === "center" ? 1080 : undefined, top: y, textAlign: align, opacity: o }}>
      {lines.map((l, i) => {
        const lo = from <= 0 && !l.at ? 1 : interpolate(t, [l.at ?? from, (l.at ?? from) + 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ fontFamily: l.italic ? serifItalic : serif, fontSize: size, lineHeight: 0.98, color: ink ? "#161616" : "#fff", letterSpacing: -1, opacity: lo, transform: `translateY(${(1 - lo) * 14}px)`, textShadow: ink ? "0 0 24px rgba(255,255,255,0.7)" : "0 2px 18px rgba(0,0,0,0.35)" }}>{l.text}</div>
        );
      })}
    </div>
  );
};

// Hand-drawn arrow that draws itself, with a short serif note at its tail.
export const Note: React.FC<{ from: number; to: number; x: number; y: number; text: string; d: string; size?: number; color?: string }> = ({ from, to, x, y, text, d, size = 46, color = "#fff" }) => {
  const { t } = useSec();
  const { o, visible } = useInOut(from, to);
  if (!visible) return null;
  const draw = interpolate(t, [from + 0.1, from + 0.45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      <div style={{ fontFamily: serifItalic, fontSize: size, color, whiteSpace: "nowrap", textShadow: color === "#fff" ? "0 2px 12px rgba(0,0,0,0.4)" : "none" }}>{text}</div>
      <svg width={260} height={200} style={{ position: "absolute", left: 0, top: size * 1.05, overflow: "visible" }}>
        <path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }} />
      </svg>
    </div>
  );
};

// One word at a time, white, small, at chest height (no pill, no colour).
export type Word = { text: string; startMs: number; endMs: number };
export const WordCaptions: React.FC<{ words: Word[]; y?: number; size?: number }> = ({ words, y = 0.8, size = 54 }) => {
  const { t } = useSec();
  const ms = t * 1000;
  const cur = words.find((w, i) => ms >= w.startMs && ms < (words[i + 1]?.startMs ?? w.endMs + 400));
  if (!cur) return null;
  return (
    <div style={{ position: "absolute", top: 1920 * y, width: 1080, textAlign: "center", fontFamily: fonts.bold, fontSize: size, color: "#fff", letterSpacing: -0.5, textShadow: "0 2px 4px rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.35)" }}>
      {cur.text}
    </div>
  );
};

// ---------- mockup pieces used as stickers ----------

export const Card: React.FC<{ w: number; children: React.ReactNode; pad?: number; style?: React.CSSProperties }> = ({ w, children, pad = 26, style }) => (
  <div style={{ width: w, padding: pad, background: "#fff", borderRadius: 26, boxShadow: "0 18px 44px rgba(0,0,0,0.28)", fontFamily: fonts.medium, color: "#1C1C1C", ...style }}>{children}</div>
);

export const MailHead: React.FC<{ from: string; subject: string }> = ({ from, subject }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 14, marginBottom: 14, borderBottom: "2px solid #EFEFEF" }}>
    <div style={{ width: 52, height: 52, borderRadius: 26, background: "#5B8DEF", color: "#fff", display: "grid", placeItems: "center", fontFamily: fonts.bold, fontSize: 26 }}>{from[0]}</div>
    <div>
      <div style={{ fontFamily: fonts.bold, fontSize: 26 }}>{from}</div>
      <div style={{ fontFamily: fonts.medium, fontSize: 22, color: "#8A8A8A" }}>{subject}</div>
    </div>
  </div>
);

export const Bubble: React.FC<{ text: string; me?: boolean; size?: number }> = ({ text, me, size = 34 }) => (
  <div style={{ display: "inline-block", padding: "16px 24px", borderRadius: 26, borderBottomRightRadius: me ? 6 : 26, borderBottomLeftRadius: me ? 26 : 6, background: me ? "#2F80ED" : "#fff", color: me ? "#fff" : "#1C1C1C", fontFamily: fonts.semibold, fontSize: size, boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}>{text}</div>
);
