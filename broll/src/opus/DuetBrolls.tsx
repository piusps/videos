import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import { PK, paperShadow, Stage, Paper, InkStamp, Brush, Highlight, Glass, Bokeh, Sheen, Grade } from "./PremiumKit";
import { Anthropic3D, ApproveButton3D } from "./DuetObjects3D";

// FP-N "Claude Duet" (2026-10-28) - split-panel B-rolls, one per script beat, built while HeyGen renders.
// Panel = 1080 x 820 (Opus split, speaker below). Every scene is a pure function of (t, dur, at) so the
// later DuetOpus master can import the scenes and anchor `at` to captions.json word times.
// Standalone comps: duration = props.seconds, key moments = props.at (seconds from clip start).
// Look: PremiumKit stage (cream, grid, orange key light, blinds, bokeh, grade), real logos, recreated light Claude UI.

export const PW = 1080;
export const PH = 820;
export const MONO = "JetBrains Mono";
export const SERIF = "Newsreader";
export const CL = { page: "#FAF9F5", border: "#E3DFD5", text: "#1F1E1D", sub: "#77746C", send: "#C96442", bubble: "#F0EEE6" };
export const C = { orange: "#D97757", orangeSoft: "#F8E1D7", green: "#1E9E57", greenSoft: "#E6F5EC", red: "#D2403A", redSoft: "#FDE8E8", amber: "#D9901E", amberSoft: "#FBEFD9" };

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const k = (t: number, a: number, d = 0.3, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
export const pop = (t: number, a: number, d = 0.42) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
export const ps = (t: number, a: number, rise = 22, from = 0.75): React.CSSProperties => {
  const p = pop(t, a);
  return { opacity: k(t, a, 0.14), transform: `translateY(${(1 - p) * rise}px) scale(${from + (1 - from) * p})` };
};
export const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(interpolate(t, [a, b], [0, s.length], clamp)));
export const shakeAt = (t: number, a: number, amp = 6) => { const r = t - a; return r > 0 && r < 0.4 ? Math.sin(r * 85) * amp * (1 - r / 0.4) : 0; };
export const tilt = (t: number, rx: number, ry: number) => `perspective(2200px) rotateX(${rx + Math.sin(t * 0.7) * 0.8}deg) rotateY(${ry + Math.sin(t * 0.5 + 1) * 1.4}deg)`;

export type DuetClipProps = { seconds: number; at?: Record<string, number>; topSafe?: number };
type SceneP = { t: number; dur: number; at?: Record<string, number>; topSafe?: number };
// key moment: explicit seconds from props.at, else fraction of the clip length
const mk = (dur: number, at: Record<string, number> | undefined) => (name: string, frac: number) => (at && at[name] !== undefined ? at[name] : frac * dur);

// ---------- shared pieces ----------
export const Logo: React.FC<{ name: "claude" | "anthropic"; size: number; color?: string }> = ({ name, size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d={SIMPLE_ICONS[name].d} fill={color ?? SIMPLE_ICONS[name].hex} /></svg>
);
// Claude app icon: orange spark on the cream tile (as on iOS)
export const ClaudeAppIcon: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.225, background: "linear-gradient(160deg, #F7F4EC, #EEE9DE)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)", flexShrink: 0 }}>
    <Logo name="claude" size={size * 0.62} />
  </div>
);
export const Mono: React.FC<{ text: string; size?: number; color?: string; style?: React.CSSProperties }> = ({ text, size = 18, color = CL.sub, style }) => (
  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.13em", color, whiteSpace: "nowrap", ...style }}>{text}</div>
);
export const Pill: React.FC<{ text: string; color: string; bg: string; size?: number; dot?: boolean; style?: React.CSSProperties }> = ({ text, color, bg, size = 17, dot = true, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.1em", color, background: bg, borderRadius: 999, padding: `${size * 0.4}px ${size * 0.85}px ${size * 0.4}px ${size * 0.7}px`, whiteSpace: "nowrap", ...style }}>
    {dot ? <span style={{ width: size * 0.6, height: size * 0.6, borderRadius: "50%", background: color }} /> : null}{text}
  </span>
);
export const Check: React.FC<{ size: number; color?: string; p?: number; sw?: number }> = ({ size, color = "#FFF", p = 1, sw = 3.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - p)} /></svg>
);
export const CheckDot: React.FC<{ size?: number; color?: string; p?: number }> = ({ size = 34, color = C.green, p = 1 }) => (
  <span style={{ width: size, height: size, borderRadius: "50%", background: color, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 6px 14px ${color}55` }}><Check size={size * 0.64} p={p} /></span>
);
export const Ico: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 26, color = CL.text, sw = 1.9 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const IC = {
  doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  lock: "M7 11V8a5 5 0 0110 0v3M5.5 11h13v9.5h-13z",
  cloud: "M7 18.5h10.5a4 4 0 00.6-7.95A5.5 5.5 0 007.4 9.1 4.7 4.7 0 007 18.5z",
  moon: "M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z",
  arrow: "M4 12h15M13 6l6 6-6 6",
};
// light glints (soft, no confetti): small 4-point sparkles that twinkle once
export const Glint: React.FC<{ t: number; at: number; x: number; y: number; size?: number; color?: string }> = ({ t, at: a, x, y, size = 34, color = "#FFF6E8" }) => {
  const u = t - a;
  if (u < 0 || u > 0.7) return null;
  const s = Math.sin((u / 0.7) * Math.PI);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: x - size / 2, top: y - size / 2, transform: `scale(${s}) rotate(${u * 120}deg)`, opacity: s, filter: `drop-shadow(0 0 8px ${C.orange})`, zIndex: 40 }}>
      <path d="M12 0 C13 9 15 11 24 12 C15 13 13 15 12 24 C11 15 9 13 0 12 C9 11 11 9 12 0Z" fill={color} />
    </svg>
  );
};
// ring wave (notification ping / approval)
export const Ring: React.FC<{ t: number; at: number; x: number; y: number; r?: number; color?: string; w?: number; d?: number }> = ({ t, at: a, x, y, r = 160, color = C.orange, w = 5, d = 0.7 }) => {
  const u = (t - a) / d;
  if (u < 0 || u > 1) return null;
  const e = Easing.out(Easing.cubic)(u);
  const rr = r * (0.25 + 0.75 * e);
  return <div style={{ position: "absolute", left: x - rr, top: y - rr, width: rr * 2, height: rr * 2, borderRadius: "50%", border: `${w * (1 - u) + 1}px solid ${color}`, opacity: 1 - u, zIndex: 35 }} />;
};
// mouse pointer gliding to a target, click = dip + ripple
type PP = { x: number; y: number; at: number; click?: boolean };
export const Pointer: React.FC<{ t: number; path: PP[]; size?: number }> = ({ t, path, size = 54 }) => {
  let x = path[0].x, y = path[0].y;
  for (let j = 1; j < path.length; j++) {
    const mv = Math.min(0.5, (path[j].at - path[j - 1].at) * 0.85);
    const q = interpolate(t, [path[j].at - mv, path[j].at - 0.03], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    if (q <= 0) break;
    x = path[j - 1].x + (path[j].x - path[j - 1].x) * q;
    y = path[j - 1].y + (path[j].y - path[j - 1].y) * q - Math.sin(q * Math.PI) * 30;
  }
  const hit = path.reduce((acc, p) => (p.click && t >= p.at && t - p.at < 0.45 ? p : acc), null as null | PP);
  const r = hit ? (t - hit.at) / 0.45 : 1;
  const s = size / 36;
  return (
    <>
      {hit ? <div style={{ position: "absolute", left: hit.x - 40 * (0.3 + r), top: hit.y - 40 * (0.3 + r), width: 80 * (0.3 + r), height: 80 * (0.3 + r), borderRadius: "50%", border: `4px solid ${C.orange}`, background: "rgba(217,119,87,0.12)", opacity: 1 - r, zIndex: 60 }} /> : null}
      <svg width={28 * s} height={36 * s} viewBox="0 0 28 36" style={{ position: "absolute", left: x - 3 * s, top: y - 2 * s, zIndex: 61, transform: `scale(${hit && r < 0.25 ? 0.84 : 1})`, transformOrigin: "10% 5%", filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.28))", overflow: "visible" }}>
        <path d="M3 2 L3 29 L10 22.5 L14.6 33 L19.2 31 L14.8 20.8 L24 20.8 Z" fill="#FFF" stroke="#111" strokeWidth={2} strokeLinejoin="round" />
      </svg>
    </>
  );
};
// slot / odometer number: each digit column rolls, motion blur while fast
export const Odometer: React.FC<{ value: number; size: number; color?: string; suffix?: string; prefix?: string; speed?: number }> = ({ value, size, color = PK.ink, suffix = "", prefix = "", speed = 0 }) => {
  const final = Math.round(value);
  const str = final.toLocaleString("de-DE");
  const hgt = size * 1.12;
  let place = 0;
  const cols = str.split("").reverse().map((ch, i) => {
    if (!/[0-9]/.test(ch)) return <span key={i}>{ch}</span>;
    const pow = Math.pow(10, place++);
    const colVal = value / pow;
    const lower = colVal - Math.floor(colVal / 10) * 10;
    const nextFrac = pow > 1 ? Math.max(0, (value % pow) / pow - 0.85) / 0.15 : 0;
    const pos = (Math.floor(lower) + (pow > 1 ? nextFrac : lower - Math.floor(lower))) % 10;
    return (
      <span key={i} style={{ display: "inline-block", height: hgt, overflow: "hidden", verticalAlign: "top" }}>
        <span style={{ display: "block", transform: `translateY(${-pos * hgt}px)`, filter: speed > 0.05 && pow < 1000 ? `blur(${Math.min(3, speed * 2.5)}px)` : undefined }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, j) => <span key={j} style={{ display: "block", height: hgt, lineHeight: `${hgt}px` }}>{d}</span>)}
        </span>
      </span>
    );
  }).reverse();
  return (
    <span style={{ display: "inline-flex", fontFamily: fonts.bold, fontSize: size, color, letterSpacing: "-0.03em", lineHeight: `${hgt}px`, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
      {prefix}{cols}{suffix}
    </span>
  );
};

// stage + gentle camera push for every panel
export const PanelStage: React.FC<{ t: number; dur: number; children: React.ReactNode; seed?: number; shake?: number }> = ({ t, dur, children, seed = 1, shake = 0 }) => {
  const push = 1.0 + 0.045 * Easing.inOut(Easing.sin)(Math.min(1, t / Math.max(0.1, dur)));
  return (
    <AbsoluteFill style={{ width: PW, height: PH, overflow: "hidden" }}>
      <Stage t={t + seed * 3} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push}) translate(${Math.sin(t * 0.6 + seed) * 6 + shake}px, ${Math.cos(t * 0.5 + seed) * 4}px)` }}>{children}</div>
      <Bokeh t={t} n={16} seed={seed} opacity={0.8} />
      <Grade />
    </AbsoluteFill>
  );
};

// ================= 1. Anthropic news drop + "Gamechanger" =================
export const SceneNews: React.FC<SceneP> = ({ t, dur, at, topSafe = 200 }) => {
  const m = mk(dur, at);
  const updateAt = m("update", 0.3), gameAt = m("game", 0.62);
  const flash = t >= gameAt ? Math.max(0, 1 - (t - gameAt) / 0.18) : 0;
  const gp = pop(t, gameAt, 0.32);
  const top = topSafe;
  return (
    <PanelStage t={t} dur={dur} seed={1} shake={shakeAt(t, gameAt, 9)}>
      {/* soft halo behind the tile */}
      <div style={{ position: "absolute", left: 40, top: top - 40, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,170,120,0.55), rgba(255,170,120,0) 65%)", filter: "blur(10px)", opacity: 0.8 + 0.2 * Math.sin(t * 2) }} />
      <div style={{ position: "absolute", left: 0, top: top - 60, width: PW, height: PH - top + 60 }}>
        <Anthropic3D t={t} w={PW} h={PH - top + 60} spinAt={updateAt - 0.1} camZ={50} x={-10} />
      </div>
      {/* right column: source line + news card */}
      <div style={{ position: "absolute", left: 560, top: top + 10, display: "flex", alignItems: "center", gap: 14, ...ps(t, -0.2, 14, 0.85) }}>
        <Img src={staticFile("logos/anthropic.svg")} style={{ width: 40, height: 40 }} />
        <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: PK.ink }}>Anthropic</span>
        <span style={{ fontFamily: fonts.medium, fontSize: 24, color: PK.sub }}>· gerade eben</span>
      </div>
      <div style={{ position: "absolute", left: 556, top: top + 74, transform: `${tilt(t, 4, -12)} translateY(${(1 - pop(t, updateAt - 0.25, 0.5)) * 50}px)`, transformOrigin: "100% 50%", opacity: k(t, updateAt - 0.3, 0.12) }}>
        <Paper fold={false} sheen={k(t, updateAt + 0.2, 0.9, Easing.inOut(Easing.cubic))} style={{ position: "relative", width: 470, height: 290 }}>
          <div style={{ padding: "26px 30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.red, boxShadow: `0 0 0 ${6 + 5 * Math.abs(Math.sin(t * 4))}px rgba(210,64,58,0.18)` }} />
              <Mono text="NEUES UPDATE" size={19} color={C.red} />
            </div>
            <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 58, color: PK.ink, lineHeight: 1.04, marginTop: 16 }}>Neues <span style={{ fontStyle: "italic" }}>Claude</span>-Update</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 23, color: PK.sub, marginTop: 12, lineHeight: 1.3 }}>Research Preview<br />seit 21. Oktober 2026</div>
          </div>
        </Paper>
      </div>
      {/* GAMECHANGER slam */}
      {t >= gameAt - 0.02 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: PH - 190, display: "flex", justifyContent: "center", zIndex: 30 }}>
          <div style={{ transform: `scale(${interpolate(t, [gameAt, gameAt + 0.16], [2.4, 1], { ...clamp, easing: Easing.out(Easing.cubic) }) * (1 + 0.04 * (gp - Math.min(gp, 1)))}) rotate(-3deg)`, opacity: k(t, gameAt, 0.06), fontFamily: fonts.bold, fontSize: 104, letterSpacing: "-0.02em", color: "#FFF", background: `linear-gradient(170deg, ${C.orange}, ${PK.orangeDeep})`, borderRadius: 26, padding: "8px 40px 14px", boxShadow: "0 24px 50px -10px rgba(180,83,47,0.55), inset 0 2px 0 rgba(255,255,255,0.35)", whiteSpace: "nowrap", position: "relative", overflow: "hidden" }}>
            Gamechanger
            <Sheen p={k(t, gameAt + 0.15, 0.6)} strength={0.9} />
          </div>
        </div>
      ) : null}
      <Glint t={t} at={gameAt + 0.12} x={250} y={PH - 190} size={46} />
      <Glint t={t} at={gameAt + 0.28} x={860} y={PH - 70} size={38} />
      <Glint t={t} at={updateAt + 0.4} x={470} y={top + 40} size={40} />
      {flash > 0 ? <div style={{ position: "absolute", inset: 0, background: "#FFF8F0", opacity: flash * 0.7, zIndex: 50 }} /> : null}
    </PanelStage>
  );
};

// ================= 2. iPhone lockscreen, Claude writes first =================
const IPhone: React.FC<{ w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode; off?: number }> = ({ w, h, style, children, off = 0 }) => (
  <div style={{ position: "absolute", width: w, height: h, ...style }}>
    {/* extruded titanium edge (2.5D) */}
    {[14, 10, 6].map((d, i) => (
      <div key={d} style={{ position: "absolute", left: d, top: d * 0.5, width: w, height: h, borderRadius: w * 0.17, background: i === 0 ? "#6F6862" : "linear-gradient(90deg, #8D857D, #D7D0C6 40%, #9C948B)", boxShadow: i === 0 ? "30px 40px 60px -10px rgba(70,40,15,0.45)" : undefined }} />
    ))}
    <div style={{ position: "absolute", inset: 0, borderRadius: w * 0.17, background: "linear-gradient(135deg, #E9E3DA, #B9B1A6 50%, #F2ECE3)", padding: w * 0.032, boxSizing: "border-box" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.145, background: "#0B0B0C", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>{children}</div>
        {/* screen-off: black glass */}
        {off > 0 ? <div style={{ position: "absolute", inset: 0, background: "#050506", opacity: off }} /> : null}
        <div style={{ position: "absolute", left: "50%", top: w * 0.035, width: w * 0.3, height: w * 0.085, marginLeft: -w * 0.15, borderRadius: 999, background: "#000" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.08) 100%)", pointerEvents: "none" }} />
      </div>
    </div>
  </div>
);
const LockWall: React.FC<{ t: number; w: number; time: string; date: string; scale?: number }> = ({ t, w, time, date, scale = 1 }) => (
  <>
    <div style={{ position: "absolute", inset: -40, background: "radial-gradient(ellipse 90% 60% at 30% 20%, #F6B48F 0%, #E58A63 35%, #B95A3B 70%, #6E3424 100%)", transform: `translate(${Math.sin(t * 0.4) * 10}px, 0)` }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 85%, rgba(255,220,190,0.45), rgba(255,220,190,0) 50%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: w * 0.2, display: "flex", justifyContent: "center" }}><Ico d={IC.lock} size={24 * scale} color="rgba(255,255,255,0.9)" sw={2.2} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: w * 0.29, textAlign: "center", fontFamily: fonts.medium, fontSize: 24 * scale, color: "rgba(255,255,255,0.92)" }}>{date}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: w * 0.34, textAlign: "center", fontFamily: fonts.semibold, fontSize: 118 * scale, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.96)", lineHeight: 1.1 }}>{time}</div>
  </>
);
const Notif: React.FC<{ w: number; title: string; body: string; when?: string; style?: React.CSSProperties }> = ({ w, title, body, when = "jetzt", style }) => (
  <div style={{ width: w, borderRadius: 26, background: "rgba(246,243,238,0.86)", backdropFilter: "blur(18px)", boxShadow: "0 14px 30px rgba(40,20,10,0.28)", padding: "16px 18px", boxSizing: "border-box", display: "flex", gap: 14, ...style }}>
    <ClaudeAppIcon size={50} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: fonts.semibold, fontSize: 21, color: "#111" }}>{title}</span>
        <span style={{ fontFamily: fonts.regular, fontSize: 17, color: "#6E6A64" }}>{when}</span>
      </div>
      <div style={{ fontFamily: fonts.regular, fontSize: 19, color: "#222", lineHeight: 1.3, marginTop: 3 }}>{body}</div>
    </div>
  </div>
);
export const SceneLock: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const n1 = m("notif", 0.12), n2 = m("notif2", 0.5), flip = m("flip", 0.62);
  const fall = (a: number) => {
    const p = interpolate(t, [a, a + 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
    return { transform: `translateY(${(1 - p) * -130}px) scale(${0.9 + 0.1 * p})`, opacity: k(t, a, 0.15) };
  };
  const PWd = 380, PHd = 790;
  const px = 640, py = 40;
  return (
    <PanelStage t={t} dur={dur} seed={2}>
      {/* left: statement */}
      <div style={{ position: "absolute", left: 64, top: 150 }}>
        <Mono text="NEU IN CLAUDE" size={20} color={C.orange} style={ps(t, -0.25, 10, 0.9)} />
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 78, lineHeight: 1.02, color: PK.ink, marginTop: 14, ...ps(t, -0.2, 16, 0.92) }}>
          Claude<br />schreibt dir<br />
          <span style={{ position: "relative", display: "inline-block", fontStyle: "italic" }}>
            <Highlight p={k(t, n1 + 0.1, 0.4)} />
            <span style={{ position: "relative" }}>zuerst.</span>
          </span>
        </div>
        {/* direction swap: Du -> Claude struck, Claude -> Du */}
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 12, fontFamily: fonts.semibold, fontSize: 30, color: t > flip ? "#A79E92" : PK.ink, ...ps(t, -0.1, 10, 0.9) }}>
            Du <Ico d={IC.arrow} size={30} color={t > flip ? "#A79E92" : PK.ink} sw={2.4} /> Claude
            <Brush w={210} p={k(t, flip, 0.3)} sw={7} style={{ left: -8, top: 9 }} />
          </div>
          {t > flip - 0.05 ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, alignSelf: "flex-start", fontFamily: fonts.bold, fontSize: 32, color: "#FFF", background: `linear-gradient(170deg, ${C.orange}, ${PK.orangeDeep})`, padding: "8px 20px 10px", borderRadius: 16, boxShadow: "0 14px 30px -8px rgba(180,83,47,0.5)", ...ps(t, flip - 0.05, 12, 0.6) }}>
              <Logo name="claude" size={30} color="#FFF" /> Claude <Ico d={IC.arrow} size={30} color="#FFF" sw={2.6} /> Du
            </div>
          ) : null}
        </div>
      </div>
      {/* right: iPhone in 2.5D */}
      <div style={{ position: "absolute", left: px, top: py, transform: `${tilt(t, 6, -16)} translateY(${(1 - k(t, -0.3, 0.6)) * 40}px)`, transformOrigin: "50% 60%" }}>
        <IPhone w={PWd} h={PHd}>
          <LockWall t={t} w={PWd} time="7:30" date="Dienstag, 28. Oktober" scale={0.8} />
          <div style={{ position: "absolute", left: 14, right: 14, top: 340, display: "flex", flexDirection: "column", gap: 10 }}>
            {t > n1 - 0.05 ? <div style={fall(n1)}><Notif w={PWd - 46} title="Claude" body="Guten Morgen. 3 Dinge brauchen heute dich, Entwürfe liegen bereit." /></div> : null}
            {t > n2 - 0.05 ? <div style={fall(n2)}><Notif w={PWd - 46} title="Claude" body="Mahnung an Kessler Bau ist fertig. Freigeben?" /></div> : null}
          </div>
        </IPhone>
      </div>
      <Ring t={t} at={n1} x={px + PWd / 2} y={py + 380} r={260} />
      <Ring t={t} at={n1 + 0.15} x={px + PWd / 2} y={py + 380} r={200} w={3} />
      <Ring t={t} at={n2} x={px + PWd / 2} y={py + 470} r={230} />
      <Glint t={t} at={n1 + 0.2} x={px + 30} y={py + 330} />
      <Glint t={t} at={n2 + 0.25} x={px + PWd - 10} y={py + 560} size={30} />
    </PanelStage>
  );
};

// ================= 3. Duet replaces a 3.000 €/month assistant =================
export const SceneCost: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const countA = m("count", 0.12), countB = m("countEnd", 0.5), strike = m("strike", 0.68), duetAt = m("duet", 0.78);
  const cp = k(t, countA, countB - countA, Easing.out(Easing.cubic));
  const speed = t > countA && t < countB ? 1 - cp : 0;
  const val = 900 + 2100 * cp;
  const rows: [string, string, number][] = [["Gehalt brutto", "2.450 €", countA + 0.05], ["Arbeitgeberanteil", "550 €", countA + 0.25], ["Urlaub, Krankheit, Einarbeitung", "on top", countA + 0.45]];
  const struck = t > strike;
  return (
    <PanelStage t={t} dur={dur} seed={3} shake={shakeAt(t, strike + 0.05, 6)}>
      <div style={{ position: "absolute", left: 50, top: 70, transform: `${tilt(t, 5, 12)} rotate(-2deg)`, transformOrigin: "0% 50%", ...ps(t, -0.25, 30, 0.92) }}>
        <Paper sheen={k(t, countB - 0.1, 0.9, Easing.inOut(Easing.cubic))} style={{ position: "relative", width: 600, height: 650 }}>
          <div style={{ padding: "34px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" size={32} color={C.orange} sw={2} /></div>
              <div>
                <Mono text="STELLE · VOLLZEIT" size={16} />
                <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 44, color: PK.ink, lineHeight: 1.05 }}>Assistenz</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 40 }}><Mono text="KOSTEN PRO MONAT" size={18} /><Pill text="BEISPIEL" color={PK.sub} bg="rgba(120,100,80,0.10)" size={14} dot={false} /></div>
            <div style={{ position: "relative", marginTop: 6, display: "inline-block" }}>
              <Odometer value={val} size={128} color={struck ? "#A79E92" : PK.ink} suffix={"\u00A0€"} speed={speed} />
              <Brush w={470} p={k(t, strike, 0.32)} sw={14} style={{ left: -14, top: 34 }} />
            </div>
            <div style={{ marginTop: 26, borderTop: `1.5px solid ${PK.paperEdge}` }}>
              {rows.map(([a, b, ra]) => (
                <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "13px 0", borderBottom: `1px dashed ${PK.paperEdge}`, fontFamily: fonts.medium, fontSize: 24, color: PK.ink, opacity: k(t, ra, 0.2), transform: `translateX(${(1 - k(t, ra, 0.3)) * -30}px)` }}>
                  <span>{a}</span><span style={{ fontFamily: MONO, color: PK.sub }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </Paper>
      </div>
      {/* right: Claude Duet takes the job */}
      <Glass style={{ left: 690, top: 120, width: 340, padding: "26px 28px", ...ps(t, -0.15, 20, 0.85), transform: `${(ps(t, -0.15, 20, 0.85).transform as string) ?? ""} ${tilt(t, 4, -14)}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <ClaudeAppIcon size={64} />
          <div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 22, color: PK.sub }}>Claude</div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 54, color: PK.ink, lineHeight: 1 }}>Duet</div>
          </div>
        </div>
        <div style={{ marginTop: 18, fontFamily: fonts.medium, fontSize: 22, color: PK.ink, lineHeight: 1.35 }}>Briefing, Mails, Termine, Mahnungen</div>
      </Glass>
      {t > duetAt - 0.05 ? (
        <div style={{ position: "absolute", left: 700, top: 440, ...ps(t, duetAt, 18, 0.6) }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "#FFF", borderRadius: 22, padding: "18px 26px 18px 18px", boxShadow: paperShadow }}>
            <CheckDot size={46} p={k(t, duetAt + 0.1, 0.3)} />
            <div>
              <div style={{ fontFamily: fonts.bold, fontSize: 34, color: PK.ink, lineHeight: 1.1 }}>macht den Job</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 21, color: PK.sub }}>der Assistenz</div>
            </div>
          </div>
        </div>
      ) : null}
      <InkStamp id="duetStrike" text="ÜBERNOMMEN" p={k(t, strike + 0.12, 0.16)} size={34} rot={-10} color={C.red} style={{ left: 120, top: 640 }} />
      <Glint t={t} at={countB} x={560} y={290} />
      <Glint t={t} at={duetAt + 0.2} x={1010} y={450} size={30} />
    </PanelStage>
  );
};

// ================= 4. Morning briefing: 3 cards =================
export const GLogo: React.FC<{ file: string; size: number }> = ({ file, size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.26, background: "#FFF", border: `1.5px solid ${CL.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Img src={staticFile(`logos/${file}`)} style={{ width: size * 0.6, height: size * 0.6, objectFit: "contain" }} />
  </div>
);
export const SceneBriefing: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const r = [m("mail", 0.1), m("termin", 0.33), m("kunde", 0.56)];
  const zero = m("zero", 0.8);
  const items = [
    { logo: <GLogo file="gmail.svg" size={74} />, title: "Mail brennt", sub: "Kessler Bau wartet seit 2 Tagen", pill: <Pill text="DRINGEND" color={C.red} bg={C.redSoft} /> },
    { logo: <GLogo file="calendar.svg" size={74} />, title: "Termin kollidiert", sub: "Do 10:00 Steuerberater + Lieferant", pill: <Pill text="KONFLIKT" color={C.amber} bg={C.amberSoft} /> },
    { logo: <div style={{ width: 74, height: 74, borderRadius: 19, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico d={IC.doc} size={42} color={C.orange} sw={2} /></div>, title: "Kunde hat nicht bezahlt", sub: "Rechnung 2026-117 · 14 Tage drüber", pill: <Pill text="2.380 €" color={C.red} bg={C.redSoft} /> },
  ];
  return (
    <PanelStage t={t} dur={dur} seed={4}>
      <div style={{ position: "absolute", left: 70, top: 40, width: 940, height: 740, transform: tilt(t, 7, 0), transformOrigin: "50% 100%", ...{ opacity: 1 } }}>
        {/* claude.ai style window */}
        <div style={{ position: "absolute", inset: 0, background: CL.page, borderRadius: 30, boxShadow: paperShadow, border: `1px solid ${CL.border}`, overflow: "hidden" }}>
          <div style={{ height: 78, display: "flex", alignItems: "center", gap: 14, padding: "0 30px", borderBottom: `1px solid ${CL.border}`, background: "#FFF" }}>
            <Logo name="claude" size={36} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: CL.text }}>Morgen-Briefing</span>
            <Pill text="BEISPIEL" color={CL.sub} bg="rgba(120,100,80,0.10)" size={14} dot={false} />
            <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 800, fontSize: 18, letterSpacing: "0.1em", color: CL.sub }}>
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: C.green, boxShadow: `0 0 0 ${4 + 4 * Math.abs(Math.sin(t * 3))}px rgba(30,158,87,0.18)` }} />DUET · 07:30
            </span>
          </div>
          <div style={{ padding: "26px 34px 0" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <Logo name="claude" size={40} />
              <div style={{ fontFamily: SERIF, fontSize: 40, color: CL.text, lineHeight: 1.2, minHeight: 50 }}>{typed("Guten Morgen. Drei Dinge für heute:", t, -0.4, r[0])}</div>
            </div>
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 16 }}>
              {items.map((it, i) => {
                const a = r[i];
                const p = interpolate(t, [a, a + 0.45], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
                const on = t > a - 0.02;
                return (
                  <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 22, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 22, padding: "18px 22px", boxShadow: "0 16px 30px -14px rgba(90,55,30,0.35)", opacity: on ? Math.min(1, k(t, a, 0.12)) : 0, transform: `translateX(${(1 - p) * 260}px) rotate(${(1 - p) * 4}deg) scale(${0.9 + 0.1 * p})`, overflow: "hidden" }}>
                    {it.logo}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: fonts.bold, fontSize: 36, color: CL.text, lineHeight: 1.15 }}>{it.title}</div>
                      <div style={{ fontFamily: fonts.medium, fontSize: 23, color: CL.sub, marginTop: 4 }}>{it.sub}</div>
                    </div>
                    <div style={{ transform: `scale(${pop(t, a + 0.2, 0.35)})` }}>{it.pill}</div>
                    <Sheen p={k(t, a + 0.15, 0.7)} strength={0.7} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {t > zero - 0.05 ? (
        <div style={{ position: "absolute", right: 46, top: 18, zIndex: 20, ...ps(t, zero, 14, 0.6) }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "12px 26px 12px 16px", fontFamily: fonts.semibold, fontSize: 28, boxShadow: "0 14px 30px rgba(0,0,0,0.25)" }}>
            <CheckDot size={36} p={k(t, zero + 0.1, 0.3)} /> 0 Fragen gestellt
          </div>
        </div>
      ) : null}
      {r.map((a, i) => <Glint key={i} t={t} at={a + 0.3} x={980} y={262 + i * 128} size={30} />)}
    </PanelStage>
  );
};

// ================= 5. Phone off, Duet keeps working in the cloud =================
const MAHNUNG = "Sehr geehrter Herr Kessler, unsere Rechnung Nr. 2026-117 über 2.380,00 € ist seit 14 Tagen fällig. Bitte überweisen Sie den Betrag bis zum 7. November.";
export const ScenePhoneOff: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const offAt = m("off", 0.1), typeA = m("type", 0.2), typeB = m("typeEnd", 0.62), termin = m("termin", 0.62), wait = m("wait", 0.84);
  const off = k(t, offAt, 0.22);
  const collapse = interpolate(t, [offAt, offAt + 0.12, offAt + 0.22], [1, 0.02, 0], clamp);
  return (
    <PanelStage t={t} dur={dur} seed={5}>
      {/* left: phone goes dark */}
      <div style={{ position: "absolute", left: 50, top: 70, transform: `${tilt(t, 6, 18)}`, transformOrigin: "0% 60%" }}>
        <IPhone w={300} h={620} off={off}>
          <LockWall t={t} w={300} time="23:48" date="Montag, 27. Oktober" scale={0.62} />
          {t > offAt && t < offAt + 0.24 ? <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 620 * collapse, marginTop: -310 * collapse, background: "#FFF", opacity: 0.5 * (1 - off), zIndex: 3 }} /> : null}
        </IPhone>
      </div>
      {t > offAt + 0.15 ? (
        <div style={{ position: "absolute", left: 66, top: 708, display: "inline-flex", alignItems: "center", gap: 10, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "10px 22px 10px 14px", fontFamily: fonts.semibold, fontSize: 24, ...ps(t, offAt + 0.15, 12, 0.6) }}>
          <Ico d={IC.moon} size={26} color="#FFF" sw={2} /> Handy aus
        </div>
      ) : null}
      {/* right: cloud window with self-typing Mahnung */}
      <div style={{ position: "absolute", left: 400, top: 40, width: 640, height: 560, transform: tilt(t, 5, -10), transformOrigin: "100% 50%", ...ps(t, -0.25, 24, 0.94) }}>
        <div style={{ position: "absolute", inset: 0, background: CL.page, borderRadius: 26, boxShadow: paperShadow, border: `1px solid ${CL.border}`, overflow: "hidden" }}>
          <div style={{ height: 66, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: `1px solid ${CL.border}`, background: "#FFF" }}>
            <Logo name="claude" size={30} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: CL.text }}>Duet</span>
            <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: MONO, fontWeight: 800, fontSize: 16, letterSpacing: "0.1em", color: C.green }}>
              <Ico d={IC.cloud} size={24} color={C.green} sw={2} />LÄUFT IN DER CLOUD
            </span>
          </div>
          <div style={{ padding: "22px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 50, borderRadius: 8, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={IC.doc} size={28} color={C.orange} sw={2} /></div>
              <div>
                <Mono text="ENTWURF · BEISPIEL" size={15} />
                <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 38, color: CL.text, lineHeight: 1.1 }}>Zahlungserinnerung</div>
              </div>
            </div>
            <div style={{ marginTop: 18, fontFamily: SERIF, fontSize: 28, lineHeight: 1.42, color: CL.text, minHeight: 240 }}>
              {typed(MAHNUNG, t, typeA, typeB)}
              <span style={{ display: "inline-block", width: 3, height: 30, background: C.orange, marginLeft: 3, verticalAlign: "middle", opacity: Math.sin(t * 12) > 0 || (t > typeA && t < typeB) ? 1 : 0 }} />
            </div>
          </div>
        </div>
      </div>
      {/* calendar invite sent */}
      {t > termin - 0.05 ? (
        <div style={{ position: "absolute", left: 430, top: 560, zIndex: 10, ...ps(t, termin, 24, 0.7) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#FFF", borderRadius: 22, padding: "16px 22px 16px 16px", boxShadow: paperShadow, width: 580, boxSizing: "border-box" }}>
            <GLogo file="calendar.svg" size={62} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 27, color: CL.text }}>Termin an Kessler Bau</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 20, color: CL.sub }}>Do, 30. Okt · 14:00</div>
            </div>
            <Pill text="GESENDET" color={C.green} bg={C.greenSoft} />
          </div>
        </div>
      ) : null}
      {t > wait - 0.05 ? (
        <div style={{ position: "absolute", left: 560, top: 690, zIndex: 11, ...ps(t, wait, 16, 0.6) }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: `linear-gradient(170deg, ${C.orange}, ${PK.orangeDeep})`, color: "#FFF", borderRadius: 999, padding: "12px 26px 12px 18px", fontFamily: fonts.bold, fontSize: 28, boxShadow: `0 0 0 ${6 + 6 * Math.abs(Math.sin((t - wait) * 4))}px rgba(217,119,87,0.22), 0 14px 30px -8px rgba(180,83,47,0.55)` }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#FFF", opacity: 0.6 + 0.4 * Math.sin(t * 8) }} /> Wartet auf dein Okay
          </div>
        </div>
      ) : null}
      <Glint t={t} at={termin + 0.25} x={990} y={575} size={30} />
    </PanelStage>
  );
};

// ================= 6. "Freigeben" tap + check burst =================
export const SceneApprove: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const press = m("press", 0.4), done = m("done", 0.62);
  const KX = 540, KY = 330; // on-screen centre of the key top (measured from the test still)
  const sent = t > press + 0.08;
  return (
    <PanelStage t={t} dur={dur} seed={6} shake={shakeAt(t, press, 4)}>
      <div style={{ position: "absolute", left: 0, top: 120, width: PW, height: PH - 120 }}>
        <ApproveButton3D t={t} w={PW} h={PH - 120} pressAt={press} />
      </div>
      {/* draft card on top */}
      <div style={{ position: "absolute", left: 140, top: 40, width: 800, transform: tilt(t, 4, 0), ...ps(t, -0.3, 20, 0.92) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: CL.page, border: `1px solid ${CL.border}`, borderRadius: 24, padding: "20px 26px", boxShadow: paperShadow }}>
          <ClaudeAppIcon size={62} />
          <div style={{ flex: 1 }}>
            <Mono text="DUET · BRAUCHT DEIN OKAY" size={15} />
            <div style={{ fontFamily: fonts.bold, fontSize: 31, color: CL.text, lineHeight: 1.2 }}>Mahnung + Termin an Kessler Bau</div>
          </div>
          {sent ? <Pill text="RAUS" color={C.green} bg={C.greenSoft} style={{ transform: `scale(${pop(t, press + 0.08, 0.35)})` }} /> : <Pill text="ENTWURF" color={C.amber} bg={C.amberSoft} />}
        </div>
      </div>
      {/* burst: soft rays + rings + big check */}
      {t > press ? (
        <div style={{ position: "absolute", left: KX - 260, top: KY - 260, width: 520, height: 520, pointerEvents: "none", zIndex: 30 }}>
          {Array.from({ length: 12 }, (_, i) => {
            const u = k(t, press + 0.02, 0.45);
            const a = (i / 12) * Math.PI * 2;
            const r0 = 70 + 150 * u, len = 50 * (1 - u) + 6;
            return <div key={i} style={{ position: "absolute", left: 260 + Math.cos(a) * r0 - 4, top: 260 + Math.sin(a) * r0 - len / 2, width: 8, height: len, borderRadius: 4, background: i % 2 ? C.orange : "#F5C27A", transform: `rotate(${(a * 180) / Math.PI + 90}deg)`, opacity: 1 - u }} />;
          })}
        </div>
      ) : null}
      <Ring t={t} at={press} x={KX} y={KY} r={300} color={C.green} w={7} />
      <Ring t={t} at={press + 0.12} x={KX} y={KY} r={220} color={C.orange} w={4} />
      {t > done - 0.05 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: PH - 120, display: "flex", justifyContent: "center", zIndex: 31, ...ps(t, done, 16, 0.6) }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "12px 30px 12px 16px", fontFamily: fonts.bold, fontSize: 34, boxShadow: "0 14px 30px rgba(0,0,0,0.25)" }}>
            <CheckDot size={44} p={k(t, done + 0.08, 0.3)} /> Ein Klick. <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500 }}>Fertig.</span>
          </div>
        </div>
      ) : null}
      <Pointer t={t} path={[{ x: 900, y: 760, at: 0 }, { x: KX + 40, y: KY - 10, at: press, click: true }, { x: KX + 140, y: KY + 90, at: press + 0.7 }]} size={62} />
      <Glint t={t} at={press + 0.15} x={KX - 300} y={KY - 90} size={40} />
      <Glint t={t} at={press + 0.3} x={KX + 320} y={KY - 40} size={34} />
    </PanelStage>
  );
};

// ================= 7. "nur USA · Warteliste" stamp =================
export const SceneWaitlist: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const usa = m("usa", 0.15), ticket = m("ticket", 0.42), de = m("de", 0.72);
  const tp = interpolate(t, [ticket, ticket + 0.55], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.3)) });
  const place = 48213 * k(t, ticket, 0.9, Easing.out(Easing.cubic));
  return (
    <PanelStage t={t} dur={dur} seed={7} shake={shakeAt(t, usa + 0.05, 7)}>
      <div style={{ position: "absolute", left: 60, top: 60, transform: `${tilt(t, 5, 12)} rotate(-3deg)`, transformOrigin: "0% 50%", ...ps(t, -0.25, 30, 0.92) }}>
        <Paper style={{ position: "relative", width: 560, height: 600 }} sheen={k(t, 0.1, 1.0, Easing.inOut(Easing.cubic))}>
          <div style={{ padding: "34px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <ClaudeAppIcon size={58} />
              <div>
                <Mono text="RESEARCH PREVIEW" size={16} />
                <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 48, color: PK.ink, lineHeight: 1.05 }}>Claude <span style={{ fontStyle: "italic" }}>Duet</span></div>
              </div>
            </div>
            <div style={{ marginTop: 30, borderTop: `1.5px solid ${PK.paperEdge}` }}>
              {[["Abo", "Pro · Max"], ["Apps", "iOS · Android · Web"], ["Start", "21.10.2026"], ["Region", "USA"]].map(([a, b], i) => (
                <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: `1px dashed ${PK.paperEdge}`, fontFamily: fonts.medium, fontSize: 26, color: PK.ink, opacity: k(t, -0.3 + i * 0.12, 0.2) }}>
                  <span style={{ color: PK.sub }}>{a}</span><span style={{ fontFamily: fonts.semibold }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
          <InkStamp id="duetUSA" text="NUR USA" p={k(t, usa, 0.16)} size={64} rot={-12} color={C.red} style={{ left: 110, top: 400 }} />
        </Paper>
      </div>
      {/* waitlist ticket */}
      <div style={{ position: "absolute", left: 640, top: 150, transform: `translateX(${(1 - tp) * 300}px) rotate(${4 - (1 - tp) * 10 + Math.sin(t * 1.2) * 0.8}deg)`, opacity: k(t, ticket, 0.12), zIndex: 5 }}>
        <div style={{ position: "relative", width: 380, height: 300, borderRadius: 22, background: `linear-gradient(160deg, #FFFFFF, ${PK.paper})`, boxShadow: paperShadow, overflow: "hidden" }}>
          <div style={{ height: 70, background: `linear-gradient(170deg, ${C.orange}, ${PK.orangeDeep})`, display: "flex", alignItems: "center", padding: "0 26px" }}>
            <Mono text="WARTELISTE" size={24} color="#FFF" />
          </div>
          <div style={{ padding: "22px 26px" }}>
            <div style={{ fontFamily: fonts.medium, fontSize: 22, color: PK.sub }}>Dein Platz <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 14, letterSpacing: "0.1em" }}>· BEISPIEL</span></div>
            <Odometer value={place} size={74} prefix="#" speed={t > ticket && t < ticket + 0.9 ? 1 - k(t, ticket, 0.9) : 0} />
          </div>
          {/* perforation */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 228, borderTop: "3px dashed #E6DCCB" }} />
          <div style={{ position: "absolute", left: 26, top: 244, fontFamily: MONO, fontWeight: 800, fontSize: 17, letterSpacing: "0.1em", color: PK.sub }}>US-ADRESSE NÖTIG</div>
          <Sheen p={k(t, ticket + 0.4, 0.8)} />
        </div>
      </div>
      {t > de - 0.05 ? (
        <div style={{ position: "absolute", left: 650, top: 520, zIndex: 6, ...ps(t, de, 16, 0.6) }}>
          <Glass style={{ position: "relative", padding: "16px 24px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, color: "#FFF", background: "#8A847B", borderRadius: 8, padding: "4px 10px" }}>DE</span>
            <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: PK.ink }}>noch nicht verfügbar</span>
          </Glass>
        </div>
      ) : null}
      <Glint t={t} at={usa + 0.2} x={540} y={420} size={36} />
    </PanelStage>
  );
};

// ---------- standalone clip wrappers (1080 x 820, duration from props.seconds) ----------
const wrap = (S: React.FC<SceneP>): React.FC<DuetClipProps> => ({ at, topSafe }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return <S t={f / fps} dur={durationInFrames / fps} at={at} topSafe={topSafe} />;
};
export const DuetNews = wrap(SceneNews);
export const DuetLock = wrap(SceneLock);
export const DuetCost = wrap(SceneCost);
export const DuetBriefing = wrap(SceneBriefing);
export const DuetPhoneOff = wrap(ScenePhoneOff);
export const DuetApprove = wrap(SceneApprove);
export const DuetWaitlist = wrap(SceneWaitlist);
