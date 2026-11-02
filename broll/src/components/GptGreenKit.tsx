import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

// @florentgpt GPT-N look "Weiß + Dunkelgrün" (Henri 2026-10-15, replaces the violet/casino/coin looks):
// white base, ONE deep green #0B3D2C (darker than boilr #0A5F45 on purpose), no account branding/wordmark,
// no photos, no clipart, no gradients/glow. Frosted-glass cards over slowly drifting crisp mint shapes.
// Motion everywhere: panel slides in/out while the speaker re-frames, staggered word pop-ins, odometers with
// motion blur, landing punch + ring ripple + glint sweep, floating "+" ticks, drawn checks.
// Captions = the @florent_preusser pill (JetBrains Mono caps, 2-3 words, sliding active-word pill),
// recoloured: white pill, green text, active word green with white text.
// Reference reel: src/opus/GptZinsenGreen.tsx (runs/gpt-zinsen).

const { fontFamily: tight } = loadInterTight("normal", { weights: ["700", "800", "900"], subsets: ["latin", "latin-ext"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin", "latin-ext"] });
const { fontFamily: mono } = loadMono("normal", { weights: ["700", "800"], subsets: ["latin", "latin-ext"] });
export const GF = { tight, inter, mono };

export const G = { green: "#0B3D2C", mint: "#BFE3D2", tint: "#EAF2EE", ink: "#0B1F18", dim: "#5E716A", white: "#FFFFFF" };
export const HW = 1080;
export const HH = 1920;
export const PH = Math.round(HH * 0.52);
export const CHEST_Y = 1540; // full-frame caption centre (chin ~1490 in the GPT tripod look)
const IN = 0.32; // panel slide-in / slide-out seconds
const WHIP = 0.28; // content swap between chained scenes

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ez = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
export const bump = (t: number, at: number, d: number) => (t < at || t > at + d ? 0 : Math.sin((Math.PI * (t - at)) / d));
/** Eased count plus its speed (units/s) for the odometer motion blur. */
export const count = (t: number, a: number, b: number, to: number, from = 0) => {
  const e = Easing.inOut(Easing.cubic);
  const k = ez(t, a, b, e);
  const k2 = ez(t + 0.02, a, b, e);
  return { v: from + (to - from) * k, speed: Math.abs(((to - from) * (k2 - k)) / 0.02) };
};

export type Word = { text: string; startMs: number; endMs: number };

/** Spring helper: frames count from the enclosing Sequence (scenes are wrapped in one). */
export const useSp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (atSec: number, damping = 13, stiffness = 210) => spring({ frame: frame - Math.round(atSec * fps), fps, config: { damping, stiffness, mass: 0.7 } });
};

// ---------- numbers ----------

export const Odometer: React.FC<{ value: number; speed?: number; size: number; color?: string; suffix?: string; prefix?: string; decimals?: number }> = ({ value, speed = 0, size, color = G.green, suffix = "", prefix = "", decimals = 0 }) => {
  const scaled = Math.max(0, value) * 10 ** decimals;
  const digits = Math.max(1 + decimals, String(Math.floor(scaled + 1e-6)).length);
  const places = Array.from({ length: digits }, (_, i) => digits - 1 - i);
  const ds = speed * 10 ** decimals;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", fontFamily: tight, fontWeight: 900, fontSize: size, color, letterSpacing: -size * 0.04, lineHeight: 1 }}>
      {prefix ? <span style={{ marginRight: size * 0.08 }}>{prefix}</span> : null}
      {places.map((p) => {
        const unit = 10 ** p;
        const base = Math.floor(scaled / unit) % 10;
        const roll = p === 0 ? scaled - Math.floor(scaled) : Math.min(1, Math.max(0, (scaled % unit) - (unit - 1)));
        const blur = Math.min(size * 0.05, (ds / unit) * size * 0.0012);
        return (
          <React.Fragment key={p}>
            {decimals > 0 && p === decimals - 1 ? <span>,</span> : null}
            {p - decimals > 0 && (p - decimals + 1) % 3 === 0 && p < digits - 1 ? <span>.</span> : null}
            <div style={{ height: size, overflow: "hidden", width: size * 0.6 }}>
              <div style={{ transform: `translateY(${-(base + roll) * size}px)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, k) => <div key={k} style={{ height: size, textAlign: "center" }}>{d}</div>)}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {suffix ? <span style={{ marginLeft: size * 0.12 }}>{suffix}</span> : null}
    </div>
  );
};

// ---------- effects ----------

export const Ripple: React.FC<{ t: number; at: number; x: number; y: number; r?: number; color?: string }> = ({ t, at, x, y, r = 260, color = G.green }) => {
  if (t < at || t > at + 0.7) return null;
  const k = ez(t, at, at + 0.7);
  return <div style={{ position: "absolute", left: x - r * k, top: y - r * k, width: 2 * r * k, height: 2 * r * k, borderRadius: "50%", border: `${Math.max(1, 10 * (1 - k))}px solid ${color}`, opacity: 1 - k, zIndex: 5 }} />;
};

/** Diagonal light sweep (parent needs overflow hidden). */
export const Glint: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  if (t < at || t > at + 0.6) return null;
  const k = ez(t, at, at + 0.6, Easing.inOut(Easing.quad));
  return <div style={{ position: "absolute", top: "-40%", bottom: "-40%", width: "28%", left: `${-40 + k * 170}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)", transform: "rotate(18deg)", pointerEvents: "none", zIndex: 20 }} />;
};

/** Small labels floating up while something counts ("+ €"). */
export const Ticks: React.FC<{ t: number; from: number; to: number; every: number; text: string; x: number; y: number; color?: string }> = ({ t, from, to, every, text, x, y, color = G.green }) => (
  <>
    {Array.from({ length: Math.max(0, Math.floor((to - from) / every)) }, (_, i) => from + i * every).map((at, i) => {
      if (t < at || t > at + 0.8) return null;
      const k = ez(t, at, at + 0.8);
      return <div key={i} style={{ position: "absolute", left: x + ((i * 37) % 90) - 45, top: y - k * 120, fontFamily: tight, fontWeight: 800, fontSize: 34, color, opacity: k < 0.2 ? k * 5 : 1 - (k - 0.2) / 0.8, transform: `scale(${0.8 + 0.3 * k})`, zIndex: 30 }}>{text}</div>;
    })}
  </>
);

/** Words pop in one after another; `hi` = word drawn as a green block. Negative `at` = already settled (thumbnail). */
export const PopWords: React.FC<{ text: string; at: number; step?: number; style?: React.CSSProperties; hi?: string }> = ({ text, at, step = 0.07, style, hi }) => {
  const sp = useSp();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.24em", ...style }}>
      {text.split(" ").map((w, i) => {
        const a = sp(at + i * step, 12, 260);
        const isHi = hi && w.replace(/[.,!?]/g, "") === hi;
        return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - a) * 60}px) scale(${0.6 + 0.4 * a})`, opacity: Math.min(1, a * 2), transformOrigin: "50% 100%", ...(isHi ? { background: G.green, color: G.white, borderRadius: 16, padding: "0 16px" } : {}) }}>{w}</span>;
      })}
    </div>
  );
};

// ---------- surfaces ----------

const BACKDROPS = [
  { a: [700, 380, 560], b: [-160, 600, 320] },
  { a: [-220, 420, 520], b: [780, 560, 360] },
  { a: [640, 300, 560], b: [-200, 560, 340] },
];
/** White panel with crisp mint shapes drifting slowly behind the glass. */
export const Backdrop: React.FC<{ t: number; variant: number }> = ({ t, variant }) => {
  const v = BACKDROPS[variant % BACKDROPS.length];
  return (
    <AbsoluteFill style={{ background: G.white, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: v.a[0] + Math.sin(t * 0.8) * 50, top: v.a[1] + Math.cos(t * 0.6) * 40, width: v.a[2], height: v.a[2], borderRadius: "50%", background: G.mint }} />
      <div style={{ position: "absolute", left: v.b[0] + Math.cos(t * 0.7) * 60, top: v.b[1] + Math.sin(t * 0.9) * 40, width: v.b[2], height: v.b[2], borderRadius: "50%", border: "40px solid rgba(11,61,44,0.14)" }} />
    </AbsoluteFill>
  );
};

export const Glass: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.62)", backdropFilter: "blur(30px) saturate(150%)", WebkitBackdropFilter: "blur(30px) saturate(150%)", borderRadius: 34, border: "2px solid rgba(255,255,255,0.9)", boxShadow: "0 24px 60px rgba(11,61,44,0.18), inset 0 2px 0 rgba(255,255,255,0.9)", ...style }}>{children}</div>
);

export const Check: React.FC<{ size?: number; p?: number; inverted?: boolean }> = ({ size = 52, p = 1, inverted }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: inverted ? G.white : G.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6" stroke={inverted ? G.green : G.white} strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /></svg>
  </div>
);

export const Chip: React.FC<{ text: string; t: number; at: number }> = ({ text, t, at }) => {
  const sp = useSp();
  const a = sp(at, 10, 240);
  return (
    <div style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 14, background: G.green, borderRadius: 999, padding: "14px 30px 14px 14px", transform: `translateY(${(1 - a) * 40}px) scale(${a})`, opacity: Math.min(1, a * 2), boxShadow: "0 14px 30px rgba(11,61,44,0.3)" }}>
      <Check size={50} p={ez(t, at + 0.1, at + 0.4)} inverted />
      <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 38, color: G.white, letterSpacing: -0.5 }}>{text}</span>
      <Glint t={t} at={at + 0.35} />
    </div>
  );
};

export const Bar: React.FC<{ label: string; fill: number; muted?: boolean; t: number; children: React.ReactNode }> = ({ label, fill, muted, t, children }) => {
  const shimmer = ((t * 1.1) % 1.2) / 1.2;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
        <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 46, color: muted ? G.dim : G.ink, letterSpacing: -1 }}>{label}</span>
        {children}
      </div>
      <div style={{ height: 28, borderRadius: 14, background: "rgba(11,61,44,0.08)", overflow: "hidden" }}>
        <div style={{ position: "relative", width: `${Math.max(fill * 100, muted ? 2.5 : 0)}%`, height: "100%", borderRadius: 14, background: muted ? "#C7D3CE" : G.green, overflow: "hidden" }}>
          {!muted ? <div style={{ position: "absolute", top: 0, bottom: 0, width: "30%", left: `${-30 + shimmer * 160}%`, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)" }} /> : null}
        </div>
      </div>
    </div>
  );
};

/** Step number tile + title, both animated. */
export const Step: React.FC<{ n: number; text: string; at?: number; top?: number }> = ({ n, text, at = 0, top = 120 }) => {
  const sp = useSp();
  const a = sp(at, 9, 260);
  return (
    <div style={{ position: "absolute", left: 60, top, display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ width: 84, height: 84, borderRadius: 26, background: G.green, color: G.white, fontFamily: tight, fontWeight: 900, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${a}) rotate(${(1 - a) * -40}deg)` }}>{n}</div>
      <PopWords text={text} at={at + 0.1} style={{ fontFamily: tight, fontWeight: 900, fontSize: 64, color: G.green, letterSpacing: -1.5 }} />
    </div>
  );
};

// ---------- captions (@florent_preusser pill, GPT colours) ----------

type Chunk = { start: number; end: number; words: { w: string; s: number }[] };
export const buildChunks = (words: Word[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => ({ w: c.text.replace(/[.,!?;:„“"]/g, "").toUpperCase(), s: c.startMs / 1000 })) });
    cur = [];
  };
  for (const c of words) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 20) || (cur.length && len > 22)) flush();
    cur.push(c);
    if (/[.,!?]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
};

export const Caption: React.FC<{ chunks: Chunk[]; y: number; accent?: string }> = ({ chunks, y, accent = G.green }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = interpolate(t, [c.start - 0.04, c.start + 0.34], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
  const o = ez(t, c.start - 0.04, c.start + 0.04);
  const fs = 46;
  // JetBrains Mono: advance 0.6 em + 0.14 em tracking -> fixed char width; one sliding pill behind the active word.
  const cw = fs * 0.74, gapW = fs * 0.5;
  const xs: number[] = [];
  let acc = 0;
  c.words.forEach((w) => { xs.push(acc); acc += w.w.length * cw + gapW; });
  const ws = c.words.map((w) => w.w.length * cw - fs * 0.14);
  let i = c.words.findIndex((w, j) => j + 1 >= c.words.length || t < c.words[j + 1].s - 0.03);
  if (i < 0) i = c.words.length - 1;
  const prev = Math.max(0, i - 1);
  const q = i === 0 ? 1 : interpolate(t, [c.words[i].s - 0.03, c.words[i].s + 0.05], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const px = xs[prev] + (xs[i] - xs[prev]) * q, pw = ws[prev] + (ws[i] - ws[prev]) * q;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 60 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: o, background: G.white, borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: mono, fontWeight: 700, fontSize: fs, letterSpacing: "0.14em", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(11,61,44,0.28)" }}>
        <div style={{ position: "relative", display: "flex", gap: gapW }}>
          <div style={{ position: "absolute", left: px - 12, top: -4, width: pw + 24, bottom: -4, background: accent, borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.18)" }} />
          {c.words.map((w, j) => <span key={j} style={{ position: "relative", display: "inline-block", color: accent }}>{w.w}</span>)}
          {/* white copy clipped to the sliding pill, so text is never white-on-white while the pill moves */}
          <div style={{ position: "absolute", left: 0, top: 0, display: "flex", gap: gapW, clipPath: `polygon(${px - 12}px -10px, ${px + pw + 12}px -10px, ${px + pw + 12}px calc(100% + 10px), ${px - 12}px calc(100% + 10px))` }}>
            {c.words.map((w, j) => <span key={j} style={{ display: "inline-block", color: G.white }}>{w.w}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- guide scroll (mandatory for every reel with a guide CTA, Henri 2026-10-13) ----------

/** Keep it above the face (top + height < ~950 for the GPT tripod look) so facecheck stays clean. */
export const PdfScroll: React.FC<{ t: number; pages: string[]; title: string; inAt: number; outAt: number; top?: number; height?: number; ratio?: number }> = ({ t, pages, title, inAt, outAt, top = 140, height = 800, ratio = 2265 / 1600 }) => {
  const H = height, W = 820, BAR = 76, PW = 760, PHt = Math.round(PW * ratio), GAP = 24, PITCH = PHt + GAP;
  if (t < inAt || t > outAt + 0.32) return null;
  const A = inAt + 0.32, B = outAt - 0.1;
  const scrollY = (x: number) => interpolate(x, [A, B], [0, (pages.length - 1) * PITCH], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const inY = interpolate(t, [inAt, inAt + 0.3], [H + 900, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const outY = interpolate(t, [outAt, outAt + 0.3], [0, H + 900], { ...clamp, easing: Easing.in(Easing.cubic) });
  const y = scrollY(t);
  const page = Math.min(pages.length, Math.max(1, Math.floor((y + (H - BAR) / 2) / PITCH) + 1));
  const tilt = interpolate(t, [inAt, inAt + 0.3], [-5, 0], clamp) + interpolate(t, [outAt, outAt + 0.3], [0, 5], clamp);
  const SAMPLES = 8, SHUTTER = 0.6 / 25;
  return (
    <div style={{ position: "absolute", left: (HW - W) / 2, top, width: W, height: H, borderRadius: 30, overflow: "hidden", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "2px solid rgba(255,255,255,0.95)", boxShadow: "0 40px 90px rgba(11,31,24,0.45)", transform: `translateY(${inY + outY}px) rotate(${tilt}deg)`, zIndex: 40 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: BAR, background: G.green, display: "flex", alignItems: "center", padding: "0 26px", gap: 14, zIndex: 2 }}>
        <div style={{ width: 34, height: 40, borderRadius: 6, background: G.white, color: G.green, fontFamily: mono, fontWeight: 800, fontSize: 12, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 5, boxSizing: "border-box" }}>PDF</div>
        <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 27, color: G.white, whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ marginLeft: "auto", fontFamily: mono, fontWeight: 800, fontSize: 26, color: G.green, background: G.white, borderRadius: 10, padding: "6px 14px", whiteSpace: "nowrap" }}>{page} / {pages.length}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: BAR, bottom: 0, overflow: "hidden" }}>
        {Array.from({ length: SAMPLES }, (_, j) => {
          const yy = scrollY(t - (j / (SAMPLES - 1)) * SHUTTER);
          return (
            <div key={j} style={{ position: "absolute", left: (W - PW) / 2, top: 22 - yy, opacity: 1 / (j + 1) }}>
              {pages.map((src, i) => <Img key={i} src={staticFile(src)} style={{ position: "absolute", left: 0, top: i * PITCH, width: PW, height: PHt, borderRadius: 6, boxShadow: "0 8px 22px rgba(0,0,0,0.16)" }} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** CTA pill above the head: "KOMMENTIER:" (white) + trigger word (green). */
export const TriggerPill: React.FC<{ t: number; at: number; word: string; top?: number }> = ({ t, at, word, top = 360 }) => {
  if (t < at - 0.05) return null;
  const a = interpolate(t, [at, at + 0.36], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", zIndex: 55 }}>
      <div style={{ position: "relative", overflow: "hidden", display: "flex", borderRadius: 18, boxShadow: "0 16px 34px rgba(11,61,44,0.35)", transform: `scale(${0.5 + 0.5 * a}) translateY(${(1 - a) * 40}px)`, opacity: Math.min(1, a * 2) }}>
        <div style={{ fontFamily: mono, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: G.green, background: G.white, padding: "22px 18px 22px 28px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
        <div style={{ fontFamily: mono, fontWeight: 800, fontSize: 52, letterSpacing: "0.12em", color: G.white, background: G.green, padding: "10px 28px 10px 30px", display: "flex", alignItems: "center" }}>{word.toUpperCase()}</div>
        <Glint t={t} at={at + 0.4} />
      </div>
    </div>
  );
};

// ---------- CTA follow card ----------

/** Glass card under the trigger pill: Folgen → Gefolgt, then the comment field types the trigger word. */
export const FollowCard: React.FC<{ t: number; followAt: number; wordAt: number; word: string }> = ({ t, followAt, wordAt, word }) => {
  const FOLG = followAt, W_AT = wordAt, WORD = word.toUpperCase();
  if (t < FOLG + 0.1) return null;
  const a = interpolate(t, [FOLG + 0.1, FOLG + 0.45], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const followed = t > FOLG + 0.55;
  const n = Math.max(0, Math.min(WORD.length, Math.floor((t - W_AT) / 0.07)));
  return (
    <Glass style={{ position: "absolute", left: 200, right: 200, top: 500, padding: "22px 26px", transform: `scale(${0.6 + 0.4 * a})`, opacity: Math.min(1, a * 2), zIndex: 50 }}>
      <div style={{ height: 70, borderRadius: 18, background: followed ? G.tint : G.green, color: followed ? G.green : G.white, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: inter, fontWeight: 700, fontSize: 32, transform: `scale(${1 - 0.08 * bump(t, FOLG + 0.45, 0.2)})` }}>
        {followed ? <><Check size={38} p={ez(t, FOLG + 0.55, FOLG + 0.8)} />Gefolgt</> : "Folgen"}
      </div>
      <div style={{ marginTop: 16, height: 72, borderRadius: 36, border: "2px solid rgba(11,61,44,0.2)", background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", padding: "0 26px", fontFamily: mono, fontWeight: 800, fontSize: 38, letterSpacing: "0.1em", color: G.green }}>
        {n ? WORD.slice(0, n) : <span style={{ fontFamily: inter, fontWeight: 500, fontSize: 30, letterSpacing: 0, color: "#8A9A94" }}>Kommentar …</span>}<span style={{ opacity: Math.floor(t * 3) % 2 }}>|</span>
      </div>
      <Glint t={t} at={W_AT + 0.5} />
    </Glass>
  );
};


// ---------- master: split panel slides in from the top, speaker re-frames, slides out again ----------

export type GreenScene = { start: number; end: number; El: React.FC<{ t: number }>; joinPrev?: boolean };
export type GreenAvatar = { src: string; focus: { x: number; y: number }; scale: number; faceAt: number };

export const GreenReel: React.FC<{ avatar: GreenAvatar; scenes: GreenScene[]; words: Word[]; overlay?: (t: number) => React.ReactNode; captionY?: (t: number, k: number, panelH: number) => number; accent?: string }> = ({ avatar, scenes, words, overlay, captionY, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = React.useMemo(() => buildChunks(words), [words]);
  const idx = scenes.findIndex((x) => t >= x.start && t < x.end);
  const s = idx >= 0 ? scenes[idx] : null;
  const joinNext = idx >= 0 && scenes[idx + 1]?.joinPrev && Math.abs(scenes[idx + 1].start - s!.end) < 0.05;
  const kIn = !s ? 0 : s.start === 0 || s.joinPrev ? 1 : ez(t, s.start, s.start + IN, Easing.inOut(Easing.cubic));
  const kOut = !s ? 0 : joinNext ? 1 : 1 - ez(t, s.end - IN, s.end, Easing.inOut(Easing.cubic));
  const k = s ? Math.min(kIn, kOut) : 0;
  // full-frame stretches get a slow push-in so the speaker never stands still
  const lastEnd = Math.max(0, ...scenes.filter((x) => x.end <= t).map((x) => x.end));
  const push = 1 + 0.06 * ez(t, lastEnd, lastEnd + 3, Easing.inOut(Easing.sin)) * (1 - k);
  const h0 = HH - PH;
  const vwS = HW * avatar.scale, vhS = HH * avatar.scale;
  const leftS = Math.min(0, Math.max(HW - vwS, HW / 2 - avatar.focus.x * vwS));
  const topS = PH + Math.min(0, Math.max(h0 - vhS, h0 * avatar.faceAt - avatar.focus.y * vhS));
  const vw = HW + (vwS - HW) * k, vh = HH + (vhS - HH) * k;
  const panelH = PH * k;
  const whip = s?.joinPrev ? ez(t, s.start, s.start + WHIP, Easing.out(Easing.cubic)) : 1;
  // full frame: chest height below the chin (never on mouth/chin), split: on the seam, moving: rides the panel edge
  const y = captionY ? captionY(t, k, panelH) : k > 0 ? Math.max(panelH, HH * 0.3) : CHEST_Y;
  return (
    <AbsoluteFill style={{ background: G.white, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: leftS * k, top: topS * k, width: vw, height: vh, transform: `scale(${push})`, transformOrigin: "50% 40%" }}>
        <OffthreadVideo src={staticFile(avatar.src)} style={{ width: "100%", height: "100%" }} />
      </div>
      {s ? (
        <div style={{ position: "absolute", left: 0, top: panelH - PH, width: HW, height: PH, overflow: "hidden", background: G.white, boxShadow: "0 18px 40px rgba(11,61,44,0.18)" }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - whip) * HW * 0.9}px)`, filter: whip < 1 ? `blur(${(1 - whip) * 14}px)` : undefined }}>
            <Sequence from={Math.round(s.start * fps)} layout="none">
              <s.El t={t - s.start} />
            </Sequence>
          </div>
        </div>
      ) : null}
      {overlay ? overlay(t) : null}
      <Caption chunks={chunks} y={y} accent={accent} />
    </AbsoluteFill>
  );
};
