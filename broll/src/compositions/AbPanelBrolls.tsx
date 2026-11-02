import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { AvatarSrc, serifItalic } from "../components/PanelKit";
import { HOOK_THEMES, SlotCounter } from "../components/HookKit";
import { SIMPLE_ICONS } from "../components/logoPaths";

// FP-N "Abos finden und kündigen" (runs/fpn-abos, Reel 2026-10-10 17:20). Helpers copied from DpPanelBrolls (own file, nothing shared changed).
// Dopamin-Split-B-Rolls (video-broll, Henri 2026-10-08): panel on top (52 %), speaker below, caption pill on the seam,
// casino-/slot-style chunky glossy objects on cream/white with Superkind orange, gold only for money.
// Every prop `b` = beat times in seconds from the window start (from captions.json). All prices are invented examples.

const W = 1080;
const H = 1920;
const th = HOOK_THEMES.fp;
const GOLD = { hi: "#FFF3B8", mid: "#F2C14E", lo: "#C8901E", deep: "#8A5A0B" };
const GREEN = "#2E9E5B";
const RED = "#E5484D";

export type AbProps = { seconds?: number; avatar: AvatarSrc; panelFrac?: number; b?: Record<string, number> };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const bump = (t: number, at: number, d: number) => (t < at || t > at + d ? 0 : Math.sin(Math.PI * Math.sqrt((t - at) / d)) * (1 - (t - at) / d) * 1.6);
const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
const useSoft = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (at: number, damping = 14, stiffness = 170) => spring({ frame: frame - Math.round(at * fps), fps, config: { damping, stiffness, mass: 0.7 } });
};
const resolveSrc = (s: string) => (/^(https?:|file:)/.test(s) ? s : staticFile(s));
/** Drop with gravity from y0 to y1 starting at `at`, solid bounce + squash on landing. Returns [y, squash]. */
const drop = (t: number, at: number, y0: number, y1: number, g = 5200): [number, number] => {
  if (t < at) return [y0, 1];
  const fall = Math.sqrt((2 * Math.max(1, y1 - y0)) / g);
  const tf = t - at;
  if (tf < fall) return [y0 + 0.5 * g * tf * tf, 1];
  const u = (tf - fall) / 0.42;
  const b = u < 1 ? Math.abs(Math.sin(Math.PI * u * 2)) * 34 * Math.pow(1 - u, 1.7) : 0;
  const sq = u < 0.18 ? 1 - 0.14 * Math.sin((Math.PI * u) / 0.18) : 1;
  return [y1 - b, sq];
};

// ---------- split frame (panel on top, speaker below, invisible exit into the full talking head) ----------

const AbSplit: React.FC<{ avatar: AvatarSrc; seconds: number; panelFrac?: number; children: (t: number) => React.ReactNode }> = ({ avatar, seconds, panelFrac = 0.52, children }) => {
  const t = useT();
  const { fps } = useVideoConfig();
  const PH = Math.round(H * panelFrac);
  const k = ramp(t, seconds - 0.35, seconds, Easing.inOut(Easing.cubic));
  const s0 = avatar.scale ?? 1.0;
  const f = avatar.focus ?? { x: 0.52, y: 0.45 };
  const h0 = H - PH;
  const vw0 = W * s0, vh0 = H * s0;
  const left0 = Math.min(0, Math.max(W - vw0, W / 2 - f.x * vw0));
  const top0 = Math.min(0, Math.max(h0 - vh0, h0 * (avatar.faceAt ?? 0.42) - f.y * vh0));
  const vw = vw0 + (W - vw0) * k, vh = vh0 + (H - vh0) * k;
  const cp = t / seconds;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: left0 * (1 - k), top: (PH + top0) * (1 - k), width: vw, height: vh }}>
        <OffthreadVideo src={resolveSrc(avatar.src)} startFrom={Math.round(avatar.startSec * fps)} muted style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: "#FBF8F3", boxShadow: `0 10px 30px rgba(0,0,0,${0.25 * (1 - k)})`, opacity: 1 - k, transform: `scale(${1 + 0.05 * k})`, transformOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", inset: -80, backgroundImage: `radial-gradient(${th.grid} 2px, transparent 2.5px)`, backgroundSize: "36px 36px", transform: `translate(${(t * 14) % 36}px, ${(t * 22) % 36}px)` }} />
        <div style={{ position: "absolute", width: 950, height: 950, borderRadius: "50%", left: 80 + Math.sin(t * 0.7) * 170, top: 120 + Math.cos(t * 0.5) * 110, background: `radial-gradient(circle, ${th.accentSoft}99 0%, transparent 65%)` }} />
        <AbsoluteFill style={{ transform: `translate(${Math.sin(t * 0.9) * 7}px, ${-cp * 12}px) scale(${1 + 0.05 * cp})`, transformOrigin: "50% 60%" }}>{children(t)}</AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

// ---------- glossy chunky pieces ----------

const Sweep: React.FC<{ t: number; at: number; dur?: number }> = ({ t, at, dur = 0.7 }) => {
  const p = (t - at) / dur;
  if (p <= 0 || p >= 1) return null;
  return <div style={{ position: "absolute", top: "-30%", bottom: "-30%", width: "34%", left: `${-40 + p * 150}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)", transform: "rotate(16deg)", pointerEvents: "none" }} />;
};
const Glint: React.FC<{ k: number; size: number; x: number; y: number }> = ({ k, size, x, y }) => {
  if (k <= 0 || k >= 1) return null;
  const a = Math.sin(Math.PI * k);
  const s = size * (0.5 + a);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${k * 90}deg)`, opacity: a, zIndex: 50 }}>
      <div style={{ position: "absolute", left: -s / 2, top: -size * 0.06, width: s, height: size * 0.12, borderRadius: 99, background: "linear-gradient(90deg, transparent, #FFFDF0, transparent)" }} />
      <div style={{ position: "absolute", top: -s / 2, left: -size * 0.06, height: s, width: size * 0.12, borderRadius: 99, background: "linear-gradient(0deg, transparent, #FFFDF0, transparent)" }} />
      <div style={{ position: "absolute", left: -size * 0.3, top: -size * 0.3, width: size * 0.6, height: size * 0.6, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,210,0.95), rgba(255,180,120,0) 70%)" }} />
    </div>
  );
};
const Check: React.FC<{ on: number; size?: number; color?: string }> = ({ on, size = 34, color = th.accent }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, flexShrink: 0, background: on > 0.5 ? `radial-gradient(circle at 35% 30%, #FFB48F, ${color} 60%)` : "#EEE8DE", boxShadow: on > 0.5 ? `0 3px 0 ${color === th.accent ? "#C9471C" : "#1E6E3F"}, 0 0 ${12 * on}px ${color}88` : "inset 0 2px 3px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: fonts.bold, fontSize: size * 0.6, transform: `scale(${0.6 + 0.4 * Math.min(1, on)})` }}>{on > 0.5 ? "✓" : ""}</div>
);

type Tier = "S" | "M" | "L";
const TIER = {
  S: { name: "Klein", ring: "#D9CFC0", band: "linear-gradient(180deg, #FFFFFF, #F1ECE4)", badge: ["#FFFFFF", "#D8D0C4"], ink: th.ink },
  M: { name: "Mittel", ring: th.accent, band: "linear-gradient(180deg, #FF8A5C, #FF6B35)", badge: ["#FFD0B8", "#FF6B35"], ink: "#FFFFFF" },
  L: { name: "Groß", ring: "#2B2B2B", band: "linear-gradient(180deg, #3A3A3A, #141413)", badge: ["#6A6A6A", "#141413"], ink: "#FFFFFF" },
} as const;

/** Chunky glossy package card (slot-game style: thick bevelled ring, glossy header band, letter badge, sweep). */
const PackCard: React.FC<{ tier: Tier; w: number; t: number; price?: React.ReactNode; rows?: { text: string; on: number; extra?: boolean }[]; glow?: number; sweepAt?: number; dim?: number; badge?: string; badgeK?: number }> = ({ tier, w, t, price, rows = [], glow = 0, sweepAt = -9, dim = 0, badge, badgeK = 0 }) => {
  const c = TIER[tier];
  const s = w / 300;
  return (
    <div style={{ position: "relative", width: w, filter: dim ? `saturate(${1 - dim * 0.8}) brightness(${1 - dim * 0.06})` : undefined, opacity: 1 - dim * 0.35 }}>
      {glow > 0 ? <div style={{ position: "absolute", inset: -40 * s, borderRadius: 60 * s, background: `radial-gradient(ellipse, ${th.accent}${Math.round(Math.min(1, glow) * 120).toString(16).padStart(2, "0")} 0%, transparent 70%)` }} /> : null}
      <div style={{ position: "relative", borderRadius: 34 * s, background: "#FFFFFF", border: `${8 * s}px solid ${c.ring}`, boxShadow: `0 ${10 * s}px 0 ${tier === "M" ? "#C9471C" : tier === "L" ? "#000" : "#C6BBAA"}, 0 ${26 * s}px ${40 * s}px rgba(0,0,0,0.18), 0 0 ${glow * 70 * s}px ${glow * 18 * s}px ${th.accent}AA, inset 0 ${4 * s}px 0 rgba(255,255,255,0.9)`, overflow: "hidden" }}>
        <div style={{ height: 112 * s, background: c.band, position: "relative", display: "flex", alignItems: "center", gap: 16 * s, padding: `0 ${20 * s}px`, overflow: "hidden" }}>
          <div style={{ width: 76 * s, height: 76 * s, borderRadius: 22 * s, background: `radial-gradient(circle at 35% 28%, ${c.badge[0]}, ${c.badge[1]} 70%)`, boxShadow: `inset 0 ${-5 * s}px 0 rgba(0,0,0,0.18), inset 0 ${4 * s}px 0 rgba(255,255,255,0.55), 0 ${4 * s}px ${10 * s}px rgba(0,0,0,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 50 * s, color: tier === "S" ? th.ink : "#FFF" }}>{tier}</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 40 * s, color: c.ink, letterSpacing: -1 }}>{c.name}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "45%", background: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))" }} />
          <Sweep t={t} at={sweepAt} />
        </div>
        <div style={{ padding: `${16 * s}px ${22 * s}px ${22 * s}px` }}>
          {price !== undefined ? <div style={{ fontFamily: serifItalic, fontSize: 64 * s, color: tier === "M" ? th.accent : th.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{price}</div> : null}
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 * s, marginTop: 12 * s, opacity: 0.25 + 0.75 * Math.min(1, r.on), transform: `translateX(${(1 - Math.min(1, r.on)) * 20}px)` }}>
              <Check on={r.on} size={34 * s} />
              <span style={{ fontFamily: r.extra ? fonts.bold : fonts.semibold, fontSize: 27 * s, color: r.extra ? th.accent : th.ink, whiteSpace: "nowrap" }}>{r.text}</span>
            </div>
          ))}
        </div>
      </div>
      {badge ? (
        <div style={{ position: "absolute", left: "50%", top: -30 * s, transform: `translateX(-50%) scale(${badgeK}) rotate(-3deg)`, fontFamily: fonts.bold, fontSize: 28 * s, color: "#FFF", background: `linear-gradient(180deg, #FF8A5C, ${th.accent})`, borderRadius: 999, padding: `${8 * s}px ${22 * s}px`, boxShadow: `0 ${4 * s}px 0 #C9471C, 0 ${10 * s}px ${20 * s}px ${th.accent}66`, whiteSpace: "nowrap", zIndex: 5 }}>{badge}</div>
      ) : null}
    </div>
  );
};

/** Glossy round "Kunde" token (person glyph), drops into a column. */
const Token: React.FC<{ size?: number; color?: string }> = ({ size = 54, color = th.accent }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 35% 28%, #FFFFFF 0%, ${color === th.accent ? "#FFB08F" : "#DDD"} 22%, ${color} 70%)`, boxShadow: `inset 0 -${size * 0.08}px 0 rgba(0,0,0,0.2), 0 ${size * 0.08}px ${size * 0.14}px rgba(0,0,0,0.2)`, position: "relative" }}>
    <div style={{ position: "absolute", left: size * 0.38, top: size * 0.18, width: size * 0.24, height: size * 0.24, borderRadius: "50%", background: "#FFF" }} />
    <div style={{ position: "absolute", left: size * 0.26, top: size * 0.46, width: size * 0.48, height: size * 0.3, borderRadius: `${size * 0.24}px ${size * 0.24}px ${size * 0.06}px ${size * 0.06}px`, background: "#FFF" }} />
  </div>
);

const Chip: React.FC<{ text: string; k: number; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({ text, k, bg = "#FFFFFF", color = th.ink, size = 30, style }) => (
  <div style={{ display: "inline-block", fontFamily: fonts.semibold, fontSize: size, color, background: bg, border: `2px solid ${th.line}`, borderRadius: 999, padding: `${size * 0.22}px ${size * 0.7}px`, boxShadow: "0 6px 16px rgba(0,0,0,0.07)", transform: `scale(${k})`, opacity: Math.min(1, k * 2), whiteSpace: "nowrap", ...style }}>{text}</div>
);

const ClaudeTile: React.FC<{ size: number; t: number }> = ({ size, t }) => {
  const ic = SIMPLE_ICONS["claude"];
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.26, background: `radial-gradient(circle at 35% 25%, #FF9C73, ${th.accent} 65%)`, boxShadow: `inset 0 -${size * 0.06}px 0 rgba(0,0,0,0.15), inset 0 ${size * 0.04}px 0 rgba(255,255,255,0.5), 0 ${size * 0.1}px ${size * 0.2}px rgba(0,0,0,0.18)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {ic ? <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" style={{ transform: `rotate(${t * 25}deg)` }}><path d={ic.d} fill="#FFF" /></svg> : null}
    </div>
  );
};

const Rail: React.FC<{ active: number; t: number; y: number }> = ({ active, t, y }) => {
  const soft = useSoft();
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
      {[1, 2, 3].map((n) => {
        const on = n === active;
        const done = n < active;
        const a = soft(-0.3 + n * 0.06, 11, 200);
        const pulse = on ? 1 + 0.06 * Math.sin(t * 6) : 1;
        return (
          <React.Fragment key={n}>
            <div style={{ width: on ? 96 : 68, height: on ? 96 : 68, borderRadius: "50%", background: on ? `radial-gradient(circle at 35% 28%, #FFB08F, ${th.accent} 65%)` : done ? "#FFE4D6" : "#FFF", border: `4px solid ${on ? "#C9471C" : th.line}`, color: on ? "#FFF" : done ? th.accent : th.dim, fontFamily: fonts.bold, fontSize: on ? 50 : 34, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: on ? `0 5px 0 #C9471C, 0 0 40px ${th.accent}88` : "0 4px 0 #DDD3C4", transform: `scale(${a * pulse})` }}>{done ? "✓" : n}</div>
            {n < 3 ? <div style={{ width: 64, height: 6, borderRadius: 3, background: n < active ? th.accent : th.line }} /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Title: React.FC<{ text: React.ReactNode; t: number; at: number; y: number; size?: number }> = ({ text, t, at, y, size = 70 }) => {
  const soft = useSoft();
  const a = soft(at, 12, 200);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: fonts.bold, fontSize: size, letterSpacing: -2, color: th.ink, transform: `translateY(${(1 - a) * 40}px) scale(${1.25 - 0.25 * a})`, opacity: Math.min(1, a * 2), whiteSpace: "nowrap" }}>{text}</div>;
};
const Em: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ fontFamily: serifItalic, color: th.accent, fontSize: "1.12em", letterSpacing: -1 }}>{children}</span>;


// ======================= Abos scenes =======================
// All numbers below come from the real Claude test run with invented example statements
// (runs/fpn-abos/test/antwort1.md, antwort2.md). Providers are fictional. Everything labelled "Beispiel".

const eur = (v: number) => v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
type Sub = { n: string; m: number | null; y: number };
const SUBS: Sub[] = [
  { n: "Streamflix", m: 15.99, y: 191.88 },
  { n: "Meetly Business", m: 14.0, y: 168.0 },
  { n: "CallBox", m: 12.0, y: 144.0 },
  { n: "FotoSuite", m: 11.89, y: 142.68 },
  { n: "CloudBox Pro", m: 9.99, y: 119.88 },
  { n: "VidTalk Pro", m: 9.5, y: 114.0 },
  { n: "FitnessApp", m: 7.99, y: 95.88 },
  { n: "Webhosting", m: null, y: 71.88 },
  { n: "Sprachlern-App", m: null, y: 59.99 },
  { n: "NewsDaily", m: 4.99, y: 59.88 },
  { n: "NotizPro", m: 3.99, y: 47.88 },
];
const TOTAL = 1215.95;

const BeispielTag: React.FC<{ k: number; x: number; y: number; text?: string }> = ({ k, x, y, text = "Beispiel" }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${k}) rotate(-4deg)`, transformOrigin: "0 50%", fontFamily: fonts.bold, fontSize: 26, letterSpacing: 1, color: th.dim, background: "#FFFFFF", border: `2.5px dashed ${th.dim}`, borderRadius: 12, padding: "4px 14px", zIndex: 400, textTransform: "uppercase" }}>{text}</div>
);

/** Big money readout: rolls from the previous value to the new one in 0.28 s after each step. */
const MoneyRoll: React.FC<{ t: number; steps: { at: number; v: number }[]; size?: number; color?: string }> = ({ t, steps, size = 150, color = th.ink }) => {
  let prev = 0, cur = 0, at = -9;
  for (const s of steps) if (t >= s.at) { prev = cur; cur = s.v; at = s.at; }
  const k = ramp(t, at, at + 0.28);
  const v = prev + (cur - prev) * k;
  const punch = bump(t, at, 0.35);
  return <div style={{ fontFamily: fonts.bold, fontSize: size, letterSpacing: -5, color, lineHeight: 1, whiteSpace: "nowrap", transform: `scale(${1 + 0.06 * punch})`, textShadow: `0 6px 0 rgba(0,0,0,0.06)` }}>{eur(v)}</div>;
};

/** Glossy subscription chip (slot-style pill with bevel). */
const SubChip: React.FC<{ s: Sub; w?: number; t: number; sweepAt?: number; state?: "keep" | "kill" | null; stateK?: number }> = ({ s, w = 470, t, sweepAt = -9, state = null, stateK = 0 }) => {
  const killed = state === "kill" ? stateK : 0;
  return (
    <div style={{ position: "relative", width: w, height: 74, borderRadius: 22, background: "linear-gradient(180deg, #FFFFFF, #F6F1EA)", border: `4px solid ${state === "keep" && stateK > 0.5 ? GREEN : killed > 0.5 ? RED : th.edge}`, boxShadow: `0 5px 0 ${state === "keep" && stateK > 0.5 ? "#1E6E3F" : killed > 0.5 ? "#A8282C" : "#D2C6B3"}, 0 14px 24px rgba(0,0,0,0.12), inset 0 3px 0 rgba(255,255,255,0.9)`, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, overflow: "hidden", opacity: 1 - killed * 0.25 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `radial-gradient(circle at 35% 28%, #FFB08F, ${th.accent} 70%)`, boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.18)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: fonts.bold, fontSize: 24 }}>↻</div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 29, color: th.ink, flex: 1, whiteSpace: "nowrap", textDecoration: killed > 0.5 ? "line-through" : "none", textDecorationColor: RED, textDecorationThickness: 4 }}>{s.n}</div>
      <div style={{ fontFamily: fonts.bold, fontSize: 28, color: th.dim, whiteSpace: "nowrap" }}>{s.m !== null ? `${eur(s.m)}/M` : `${eur(s.y)}/J`}</div>
      <Sweep t={t} at={sweepAt} dur={0.6} />
    </div>
  );
};

// ---------- 1 · Hook: small monthly subscriptions drop in, the yearly counter adds each one up ----------
export const AbHook: React.FC<AbProps> = ({ seconds = 4.29, avatar, panelFrac }) => {
  const soft = useSoft();
  return (
    <AbSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const every = 0.29;
        const t0 = 0.12;
        let cum = 0;
        const steps = SUBS.map((s, i) => { cum += s.y; return { at: t0 + i * every + 0.32, v: Math.round(cum * 100) / 100 }; });
        steps[steps.length - 1].v = TOTAL;
        const done = steps[steps.length - 1].at;
        const glow = ramp(t, done, done + 0.3) * (0.7 + 0.3 * Math.sin(t * 8));
        const lbl = soft(0.15, 12, 200);
        return (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 432, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 300 }}>
              <div style={{ background: "#FFFFFF", border: `5px solid ${glow > 0.1 ? GOLD.mid : th.line}`, borderRadius: 40, padding: "14px 46px 12px", boxShadow: `0 8px 0 ${glow > 0.1 ? GOLD.lo : "#D8CEBF"}, 0 22px 40px rgba(0,0,0,0.14), 0 0 ${60 * glow}px ${GOLD.mid}AA`, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${0.6 + 0.4 * lbl})` }}>
                <MoneyRoll t={t} steps={steps} size={96} color={glow > 0.1 ? th.accent : th.ink} />
                <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: th.dim, marginTop: 4 }}>aufs Jahr · {Math.min(SUBS.length, steps.filter((s) => t >= s.at).length)} Abos</div>
              </div>
            </div>
            <BeispielTag k={soft(0.3, 10, 200)} x={840} y={420} />
            {SUBS.map((s, i) => {
              const at = t0 + i * every;
              const col = i % 2, row = Math.floor(i / 2);
              const x = col === 0 ? 52 : 558;
              const y1 = 636 + row * 58;
              const [y, sq] = drop(t, at, -140, y1, 9000);
              const vis = t >= at ? 1 : 0;
              const fly = ramp(t, at + 0.12, at + 0.36, Easing.in(Easing.cubic));
              const floater = t > at + 0.08 && t < at + 0.5;
              return (
                <React.Fragment key={s.n}>
                  <div style={{ position: "absolute", left: x, top: y, opacity: vis, transform: `scaleY(${sq}) scale(0.84)`, transformOrigin: "50% 0%", zIndex: 20 + i }}>
                    <SubChip s={s} t={t} sweepAt={at + 0.15} />
                  </div>
                  {floater ? (
                    <div style={{ position: "absolute", left: x + 300 + (540 - x - 300) * fly, top: y1 - 10 + (480 - y1) * fly, opacity: 1 - fly * 0.7, fontFamily: fonts.bold, fontSize: 34, color: th.accent, zIndex: 350, whiteSpace: "nowrap" }}>+{eur(s.y)}</div>
                  ) : null}
                </React.Fragment>
              );
            })}
            <Glint k={(t - done) / 0.4} size={140} x={900} y={300} />
          </>
        );
      }}
    </AbSplit>
  );
};

// ---------- 2 · "nur ein paar Euro im Monat … fallen keinem auf": small amounts hide in a long statement, ×12 reveals the year ----------
export const AbKlein: React.FC<AbProps> = ({ seconds = 2.8, avatar, panelFrac }) => {
  const soft = useSoft();
  const rows = [
    ["REWE MARKT", "54,20 €", false], ["NEWSDAILY DIGITAL", "4,99 €", true], ["ARAL TANKSTELLE", "71,35 €", false], ["IKEA", "129,90 €", false],
    ["NOTIZPRO", "3,99 €", true], ["DB VERTRIEB", "48,60 €", false], ["FITNESSAPP PREMIUM", "7,99 €", true], ["LIEFERANDO", "32,40 €", false],
    ["MEDIAMARKT", "89,00 €", false], ["VPN SHIELD", "5,99 €", true], ["BAUHAUS", "61,15 €", false], ["APOTHEKE", "18,75 €", false],
  ] as const;
  return (
    <AbSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const scroll = -t * 70;
        const hi = ramp(t, 0.9, 1.3);
        const mult = soft(1.55, 11, 200);
        return (
          <>
            <Title text={<>Nur <Em>ein paar Euro</Em></>} t={t} at={-0.3} y={250} size={74} />
            <div style={{ position: "absolute", left: 60, top: 370, width: 600, height: 590, borderRadius: 30, background: "#FFFFFF", border: `4px solid ${th.line}`, boxShadow: "0 8px 0 #D8CEBF, 0 20px 40px rgba(0,0,0,0.12)", overflow: "hidden" }}>
              <div style={{ position: "relative", zIndex: 5, height: 64, background: "linear-gradient(180deg, #F7F2EA, #EFE8DD)", fontFamily: fonts.bold, fontSize: 26, color: th.dim, display: "flex", alignItems: "center", padding: "0 24px", letterSpacing: 1 }}>KREDITKARTE · UMSÄTZE</div>
              <div style={{ transform: `translateY(${scroll}px)` }}>
                {[...rows, ...rows].map(([n, v, sub], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 24px", borderBottom: `2px solid ${th.line}`, fontFamily: fonts.semibold, fontSize: 25, color: sub ? th.ink : "#A39C92", background: sub ? `rgba(255,107,53,${0.16 * hi})` : "transparent", filter: sub ? "none" : `blur(${hi * 1.2}px)` }}>
                    <span>{n}</span><span style={{ fontFamily: fonts.bold, color: sub ? (hi > 0.5 ? th.accent : th.ink) : "#A39C92" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "absolute", left: 690, top: 420, width: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 84, color: th.ink, letterSpacing: -3, transform: `scale(${soft(0.5, 12, 200)})` }}>4,99 €</div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: th.dim, transform: `scale(${soft(0.6, 12, 200)})` }}>im Monat</div>
              <div style={{ fontFamily: fonts.bold, fontSize: 70, color: "#FFF", width: 130, height: 130, borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(circle at 35% 28%, #FFB08F, ${th.accent} 68%)`, boxShadow: "0 7px 0 #C9471C, 0 18px 30px rgba(255,107,53,0.35)", transform: `scale(${mult}) rotate(${(1 - mult) * -40}deg)` }}>×12</div>
              <div style={{ position: "relative", fontFamily: fonts.bold, fontSize: 84, color: th.accent, letterSpacing: -3, transform: `scale(${soft(1.9, 10, 190)})`, overflow: "hidden", padding: "0 6px" }}>59,88 €<Sweep t={t} at={2.0} /></div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: th.dim, transform: `scale(${soft(2.0, 12, 200)})` }}>im Jahr</div>
            </div>
            <BeispielTag k={soft(0.2, 10, 200)} x={70} y={322} />
          </>
        );
      }}
    </AbSplit>
  );
};

/** Glossy file card (CSV). */
const FileCard: React.FC<{ title: string; sub: string; t: number; sweepAt: number }> = ({ title, sub, t, sweepAt }) => (
  <div style={{ position: "relative", width: 360, height: 150, borderRadius: 28, background: "linear-gradient(180deg, #FFFFFF, #F6F1EA)", border: `5px solid ${th.edge}`, boxShadow: "0 7px 0 #D2C6B3, 0 18px 30px rgba(0,0,0,0.14), inset 0 3px 0 #FFF", display: "flex", alignItems: "center", gap: 20, padding: "0 22px", overflow: "hidden" }}>
    <div style={{ width: 84, height: 100, borderRadius: 14, background: `linear-gradient(180deg, #FF8A5C, ${th.accent})`, boxShadow: "inset 0 -5px 0 rgba(0,0,0,0.18), inset 0 4px 0 rgba(255,255,255,0.4)", color: "#FFF", fontFamily: fonts.bold, fontSize: 26, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14 }}>CSV</div>
    <div>
      <div style={{ fontFamily: fonts.bold, fontSize: 36, color: th.ink, whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: th.dim, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
    <Sweep t={t} at={sweepAt} />
  </div>
);

// ---------- 3 · Schritt eins: Kreditkarte + PayPal, 12 Monate, als Datei in Claude ----------
export const AbSchritt1: React.FC<AbProps> = ({ seconds = 4.5, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { kk: 1.2, pp: 1.95, zwoelf: 2.8, claude: 4.5, ...b };
  return (
    <AbSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const months = Math.min(12, Math.max(0, Math.floor(((t - (B.zwoelf - 0.9)) / 1.0) * 12)));
        const into = (at: number) => ramp(t, at + 0.9, at + 1.3, Easing.in(Easing.cubic));
        const files = [
          { title: "Kreditkarte", at: B.kk - 0.9, x: 70 },
          { title: "PayPal", at: B.pp - 0.9, x: 650 - 0 },
        ];
        const boxPulse = files.reduce((a, f) => a + bump(t, f.at + 1.3, 0.4), 0);
        return (
          <>
            <Rail active={1} t={t} y={238} />
            {files.map((f, i) => {
              const [y, sq] = drop(t, f.at, -220, 380, 8000);
              const k = into(f.at);
              const x = f.x + (360 - f.x) * k;
              return t >= f.at ? (
                <div key={i} style={{ position: "absolute", left: x, top: y + k * 300, transform: `scaleY(${sq}) scale(${1 - 0.55 * k})`, opacity: 1 - k, transformOrigin: "50% 100%", zIndex: 30 }}>
                  <FileCard title={f.title} sub="12 Monate" t={t} sweepAt={f.at + 0.4} />
                </div>
              ) : null;
            })}
            <div style={{ position: "absolute", left: 70, top: 600, width: 940, height: 300, borderRadius: 40, background: "#FFFFFF", border: `5px solid ${boxPulse > 0.1 ? th.accent : th.line}`, boxShadow: `0 8px 0 ${boxPulse > 0.1 ? "#C9471C" : "#D8CEBF"}, 0 22px 40px rgba(0,0,0,0.12), 0 0 ${40 * boxPulse}px ${th.accent}88`, transform: `scale(${1 + 0.03 * boxPulse})` }}>
              <div style={{ position: "absolute", left: 34, top: 34, display: "flex", alignItems: "center", gap: 22 }}>
                <ClaudeTile size={96} t={t} />
                <div style={{ fontFamily: fonts.bold, fontSize: 44, color: th.ink }}>Claude</div>
              </div>
              <div style={{ position: "absolute", left: 34, right: 34, top: 160 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 28, color: th.dim, marginBottom: 12 }}>
                  <span>Abrechnungen</span><span style={{ fontFamily: fonts.bold, color: th.accent }}>{months} / 12 Monate</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {Array.from({ length: 12 }).map((_, i) => {
                    const on = i < months;
                    return <div key={i} style={{ flex: 1, height: 44, borderRadius: 12, background: on ? `linear-gradient(180deg, #FF8A5C, ${th.accent})` : "#EFE8DD", boxShadow: on ? "inset 0 -4px 0 rgba(0,0,0,0.18), inset 0 3px 0 rgba(255,255,255,0.4)" : "inset 0 2px 3px rgba(0,0,0,0.06)", transform: `scale(${on ? 1 + 0.12 * bump(t, (B.zwoelf - 0.9) + (i + 1) / 12, 0.25) : 1})` }} />;
                  })}
                </div>
              </div>
              <div style={{ position: "absolute", right: 34, top: 44, transform: `scale(${soft(B.zwoelf + 0.3, 10, 200)})` }}>
                <Chip text="2 Dateien" k={1} size={30} bg="#FFF4EE" color={th.accent} />
              </div>
            </div>
          </>
        );
      }}
    </AbSplit>
  );
};

// ---------- 4 · Schritt zwei: Claude macht die Liste (Anbieter, Betrag, Kosten aufs Jahr) ----------
export const AbSchritt2: React.FC<AbProps> = ({ seconds = 4.9, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { liste: 2.85, jahr: 4.7, ...b };
  const rows = SUBS.slice(0, 6);
  return (
    <AbSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const sumK = soft(Math.min(seconds - 0.9, B.jahr - 0.6), 11, 200);
        return (
          <>
            <Rail active={2} t={t} y={238} />
            <div style={{ position: "absolute", left: 50, top: 360, width: 980, borderRadius: 34, background: "#FFFFFF", border: `4px solid ${th.line}`, boxShadow: "0 8px 0 #D8CEBF, 0 22px 40px rgba(0,0,0,0.12)", overflow: "hidden" }}>
              <div style={{ display: "flex", padding: "16px 28px", background: "linear-gradient(180deg, #F7F2EA, #EFE8DD)", fontFamily: fonts.bold, fontSize: 26, color: th.dim, letterSpacing: 1 }}>
                <span style={{ flex: 1.5 }}>ANBIETER</span><span style={{ flex: 1, textAlign: "right" }}>BETRAG</span><span style={{ flex: 1, textAlign: "right" }}>AUFS JAHR</span>
              </div>
              {rows.map((s, i) => {
                const at = 0.15 + i * 0.32;
                const a = soft(at, 12, 210);
                const yk = ramp(t, at + 0.1, at + 0.5);
                return (
                  <div key={s.n} style={{ display: "flex", alignItems: "center", padding: "11px 28px", borderTop: `2px solid ${th.line}`, fontFamily: fonts.semibold, fontSize: 31, color: th.ink, opacity: Math.min(1, a * 1.5), transform: `translateX(${(1 - a) * 120}px)` }}>
                    <span style={{ flex: 1.5, display: "flex", alignItems: "center", gap: 12 }}><Check on={ramp(t, at + 0.2, at + 0.3) * 1.0001} size={32} />{s.n}</span>
                    <span style={{ flex: 1, textAlign: "right", color: th.dim }}>{s.m !== null ? eur(s.m) : "jährlich"}</span>
                    <span style={{ flex: 1, textAlign: "right", fontFamily: fonts.bold, color: th.accent }}>{eur(s.y * yk)}</span>
                  </div>
                );
              })}
              <div style={{ padding: "8px 28px 12px", fontFamily: fonts.semibold, fontSize: 26, color: th.dim, opacity: ramp(t, 2.2, 2.5) }}>+ 5 weitere Abos</div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 870, display: "flex", justifyContent: "center", zIndex: 100, transform: `scale(${sumK})` }}>
              <div style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 20, fontFamily: fonts.bold, fontSize: 44, color: "#FFF", background: `linear-gradient(180deg, #FF8A5C, ${th.accent})`, borderRadius: 999, padding: "12px 38px", boxShadow: `0 6px 0 #C9471C, 0 0 ${30 * ramp(t, B.jahr - 0.4, B.jahr)}px ${GOLD.mid}` }}>
                <span>Summe aufs Jahr</span><span style={{ fontSize: 50 }}>{eur(TOTAL)}</span><Sweep t={t} at={B.jahr - 0.3} />
              </div>
            </div>
            <BeispielTag k={soft(0.3, 10, 200)} x={810} y={318} />
          </>
        );
      }}
    </AbSplit>
  );
};

// ---------- 5 · Schritt drei: du sagst, was du nutzt → Kündigungen mit Kundennummer und Frist ----------
const KILL = [
  { n: "CallBox", id: "CB-118274" }, { n: "FotoSuite", id: "FS-509316" }, { n: "VidTalk Pro", id: "VT-640031" }, { n: "FitnessApp", id: "FA-77813" },
  { n: "Webhosting", id: "WH-88013" }, { n: "Sprachlern-App", id: "SL-12408" }, { n: "NewsDaily", id: "ND-310552" }, { n: "NotizPro", id: "NP-220945" },
];
export const AbSchritt3: React.FC<AbProps> = ({ seconds = 5.5, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { nutzt: 1.43, kuendigung: 3.74, kunde: 4.48, frist: 5.15, ...b };
  return (
    <AbSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const keep = ["Streamflix", "CloudBox Pro", "Meetly Business"];
        const n = Math.min(8, Math.max(0, Math.floor((t - (B.kuendigung - 1.2)) / 0.22) + 1));
        const letterStart = B.kuendigung - 1.2;
        return (
          <>
            <Rail active={3} t={t} y={238} />
            <div style={{ position: "absolute", left: 40, top: 360, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 30, color: th.dim, letterSpacing: 1, marginBottom: 2 }}>NUTZE ICH NOCH</div>
              {keep.map((k, i) => {
                const s = SUBS.find((x) => x.n === k)!;
                const a = soft(-0.2 + i * 0.12, 12, 200);
                return (
                  <div key={k} style={{ transform: `scale(${a})`, transformOrigin: "0 50%" }}>
                    <SubChip s={s} w={430} t={t} state="keep" stateK={ramp(t, B.nutzt - 0.6 + i * 0.22, B.nutzt - 0.45 + i * 0.22)} sweepAt={B.nutzt - 0.5 + i * 0.22} />
                  </div>
                );
              })}
              <div style={{ marginTop: 10, transform: `scale(${soft(letterStart + 0.2, 11, 200)})`, transformOrigin: "0 50%" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: `linear-gradient(180deg, #FF8A5C, ${th.accent})`, borderRadius: 26, padding: "14px 28px", boxShadow: "0 6px 0 #C9471C" }}>
                  <span style={{ fontSize: 60, lineHeight: 1 }}>{n}</span><span>Kündigungen</span>
                </div>
              </div>
              <div style={{ transform: `scale(${soft(B.frist - 0.35, 11, 200)})`, transformOrigin: "0 50%" }}>
                <Chip text="Frist: im Kundenkonto prüfen" k={1} size={28} />
              </div>
            </div>
            {KILL.map((k, i) => {
              const at = letterStart + i * 0.22;
              if (t < at) return null;
              const a = soft(at, 13, 230);
              const fanY = 360 + i * 64;
              const rot = (i - 3.5) * 1.6;
              const top = i === n - 1;
              return (
                <div key={k.id} style={{ position: "absolute", left: 520 + (1 - a) * 500, top: fanY, width: 500, transform: `rotate(${rot}deg) scale(${0.96 + 0.04 * a})`, zIndex: 50 + i, borderRadius: 22, background: "#FFFFFF", border: `4px solid ${top ? th.accent : th.line}`, boxShadow: `0 5px 0 ${top ? "#C9471C" : "#D8CEBF"}, 0 14px 26px rgba(0,0,0,0.14)`, padding: "14px 22px", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: fonts.bold, fontSize: 30, color: th.ink, whiteSpace: "nowrap" }}>Kündigung · {k.n}</span>
                    <span style={{ width: 34, height: 34, borderRadius: 17, background: `radial-gradient(circle at 35% 30%, #FFB48F, ${th.accent} 60%)`, color: "#FFF", fontFamily: fonts.bold, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
                  </div>
                  <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: t > B.kunde - 0.3 ? th.accent : th.dim, marginTop: 6, whiteSpace: "nowrap" }}>Kundennummer {k.id}</div>
                  <Sweep t={t} at={at + 0.1} dur={0.5} />
                </div>
              );
            })}
            <BeispielTag k={soft(0.3, 10, 200)} x={812} y={300} />
          </>
        );
      }}
    </AbSplit>
  );
};

// ---------- 6 · "Kollege, der drei Tools für dasselbe bezahlt": three meeting tools, one purpose ----------
const ToolTile: React.FC<{ name: string; price: string; t: number; sweepAt: number }> = ({ name, price, t, sweepAt }) => (
  <div style={{ position: "relative", width: 290, borderRadius: 34, background: "#FFFFFF", border: `6px solid ${th.edge}`, boxShadow: "0 8px 0 #D2C6B3, 0 20px 34px rgba(0,0,0,0.15), inset 0 3px 0 #FFF", padding: "26px 0 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, overflow: "hidden" }}>
    <div style={{ width: 120, height: 120, borderRadius: 34, background: `radial-gradient(circle at 35% 28%, #FFB08F, ${th.accent} 68%)`, boxShadow: "inset 0 -7px 0 rgba(0,0,0,0.18), inset 0 5px 0 rgba(255,255,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 62, height: 44, borderRadius: 10, background: "#FFF" }}>
        <div style={{ position: "absolute", right: -24, top: 8, width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderRight: "22px solid #FFF" }} />
      </div>
    </div>
    <div style={{ fontFamily: fonts.bold, fontSize: 36, color: th.ink, whiteSpace: "nowrap" }}>{name}</div>
    <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: th.dim }}>{price}</div>
    <Sweep t={t} at={sweepAt} />
  </div>
);
export const AbTools: React.FC<AbProps> = ({ seconds = 2.5, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { drei: 0.88, dasselbe: 1.55, ...b };
  return (
    <AbSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const tools = [["Meetly", "14,00 €/M"], ["CallBox", "12,00 €/M"], ["VidTalk", "9,50 €/M"]];
        const same = soft(B.dasselbe - 0.15, 10, 210);
        return (
          <>
            <Title text={<>3 Tools, <Em>1 Zweck</Em></>} t={t} at={-0.3} y={770} size={70} />
            {tools.map(([n, p], i) => {
              const at = -0.35 + i * 0.22;
              const [y, sq] = drop(t, at, -400, 410, 8500);
              const shake = t > B.dasselbe ? Math.sin(t * 40 + i) * 4 * Math.exp(-(t - B.dasselbe) * 3) : 0;
              return (
                <div key={n} style={{ position: "absolute", left: 45 + i * 340 + shake, top: y, transform: `scaleY(${sq}) scale(${1 + 0.06 * bump(t, B.drei + i * 0.12, 0.35)})`, transformOrigin: "50% 100%", zIndex: 10 + i }}>
                  <ToolTile name={n} price={p} t={t} sweepAt={B.drei + i * 0.12} />
                </div>
              );
            })}
            {[0, 1].map((i) => (
              <div key={i} style={{ position: "absolute", left: 335 + i * 340, top: 540, fontFamily: fonts.bold, fontSize: 80, color: th.accent, transform: `scale(${same})`, zIndex: 40 }}>=</div>
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", transform: `scale(${soft(B.dasselbe + 0.1, 11, 200)})`, zIndex: 60 }}>
              <div style={{ position: "relative", overflow: "hidden", fontFamily: fonts.bold, fontSize: 46, color: "#FFF", background: `linear-gradient(180deg, #FF8A5C, ${th.accent})`, borderRadius: 999, padding: "12px 40px", boxShadow: "0 6px 0 #C9471C" }}>
                zusammen 426,00 € im Jahr<Sweep t={t} at={B.dasselbe + 0.4} />
              </div>
            </div>
            <BeispielTag k={soft(0.2, 10, 200)} x={840} y={385} />
          </>
        );
      }}
    </AbSplit>
  );
};
