import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { AvatarSrc, serifItalic } from "../components/PanelKit";
import { HOOK_THEMES, SlotCounter } from "../components/HookKit";
import { SIMPLE_ICONS } from "../components/logoPaths";

// FP-N "Gratis-Änderung wird Zusatzauftrag" (runs/fpn-zusatzauftrag, Reel 2026-10-10 20:00). Helpers copied from DpPanelBrolls (not shared).
// Dopamin-Split-B-Rolls (video-broll, Henri 2026-10-08): panel on top (52 %), speaker below, caption pill on the seam,
// casino-/slot-style chunky glossy objects on cream/white with Superkind orange, gold only for money.
// Every prop `b` = beat times in seconds from the window start (from captions.json). All prices are examples from the real Claude test (claude-test/test-log.md).

const W = 1080;
const H = 1920;
const th = HOOK_THEMES.fp;
const GOLD = { hi: "#FFF3B8", mid: "#F2C14E", lo: "#C8901E", deep: "#8A5A0B" };
const GREEN = "#2E9E5B";
const RED = "#E5484D";

export type ZaProps = { seconds?: number; avatar: AvatarSrc; panelFrac?: number; b?: Record<string, number> };

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

const ZaSplit: React.FC<{ avatar: AvatarSrc; seconds: number; panelFrac?: number; children: (t: number) => React.ReactNode }> = ({ avatar, seconds, panelFrac = 0.52, children }) => {
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

const ORANGE_DEEP = "#C9471C";
const GREEN_DEEP = "#1E6E3F";
const RED_DEEP = "#A8262A";

/** Chunky glossy hour tile (white, clock glyph) that can flip into a gold coin (paid). flip 0..1 */
const HourTile: React.FC<{ size?: number; flip: number; label?: string }> = ({ size = 96, flip, label = "1 h" }) => {
  const paid = flip > 0.5;
  const sx = Math.abs(Math.cos(Math.PI * flip));
  return (
    <div style={{ width: size, height: size * 0.62, transform: `scaleX(${Math.max(0.04, sx)})` }}>
      {paid ? (
        <div style={{ width: size, height: size * 0.62, borderRadius: size * 0.31, background: `radial-gradient(ellipse at 35% 25%, ${GOLD.hi}, ${GOLD.mid} 45%, ${GOLD.lo} 100%)`, border: `${size * 0.05}px solid ${GOLD.deep}`, boxShadow: `inset 0 ${-size * 0.05}px 0 rgba(0,0,0,0.18), 0 ${size * 0.05}px 0 ${GOLD.deep}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: size * 0.32, color: GOLD.deep, boxSizing: "border-box" }}>€</div>
      ) : (
        <div style={{ width: size, height: size * 0.62, borderRadius: size * 0.2, background: "linear-gradient(180deg, #FFFFFF, #EFE8DD)", border: `${size * 0.05}px solid ${RED}`, boxShadow: `inset 0 ${size * 0.04}px 0 rgba(255,255,255,0.9), 0 ${size * 0.05}px 0 ${RED_DEEP}`, display: "flex", alignItems: "center", justifyContent: "center", gap: size * 0.06, fontFamily: fonts.bold, fontSize: size * 0.26, color: RED, boxSizing: "border-box" }}>
          <div style={{ width: size * 0.22, height: size * 0.22, borderRadius: "50%", border: `${size * 0.035}px solid ${RED}`, position: "relative", boxSizing: "border-box" }}>
            <div style={{ position: "absolute", left: "45%", top: "15%", width: "10%", height: "38%", background: RED, borderRadius: 2 }} />
          </div>
          {label}
        </div>
      )}
    </div>
  );
};

/** Two-state status pill that flips (rotateX) from state A to state B at `at`. */
const FlipPill: React.FC<{ t: number; at: number; a: string; b: string; size?: number }> = ({ t, at, a, b, size = 46 }) => {
  const k = ramp(t, at, at + 0.35, Easing.inOut(Easing.cubic));
  const showB = k > 0.5;
  const rot = showB ? (1 - k) * 90 : k * -90;
  const c = showB ? GREEN : RED;
  const cd = showB ? GREEN_DEEP : RED_DEEP;
  return (
    <div style={{ perspective: 700, display: "inline-block" }}>
      <div style={{ transform: `rotateX(${rot}deg) scale(${1 + 0.12 * bump(t, at + 0.35, 0.45)})`, fontFamily: fonts.bold, fontSize: size, color: "#FFF", background: `linear-gradient(180deg, ${showB ? "#5BC98A" : "#FF7A7E"}, ${c})`, borderRadius: 999, padding: `${size * 0.22}px ${size * 0.75}px`, boxShadow: `0 ${size * 0.14}px 0 ${cd}, 0 0 ${showB ? 40 * bump(t, at + 0.35, 1) : 0}px ${GREEN}`, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: size * 0.3 }}>
        {showB ? "✓" : "✕"} {showB ? b : a}
      </div>
    </div>
  );
};

// ---------- 1 · Hook: counter "unbezahlte Stunden" 0 → 12, flips to "bezahlt" ----------
// b: bezahlt (word "bezahlten"), auftrag ("Zusatzauftrag")
export const ZaHook: React.FC<ZaProps> = ({ seconds = 4, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { bezahlt: 2.9, auftrag: 3.29, ...b };
  return (
    <ZaSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const flip = (i: number) => ramp(t, B.bezahlt + 0.05 + i * 0.05, B.bezahlt + 0.35 + i * 0.05, Easing.inOut(Easing.cubic));
        // 12 hour tiles: 6 per tower, one drops roughly every 0.14 s while the counter runs
        const tiles: React.ReactNode[] = [];
        for (let i = 0; i < 12; i++) {
          const col = [0, 3, 1, 2][i % 4];
          const level = Math.floor(i / 4);
          const at = 0.15 + i * 0.14;
          const x = [20, 170, 760, 910][col];
          const [y, sq] = drop(t, at, -200, 930 - level * 98, 6500);
          if (t < at) continue;
          tiles.push(<div key={i} style={{ position: "absolute", left: x + (level % 2 ? 6 : -6), top: y - 60, zIndex: 10 + level, transform: `scaleY(${sq})`, transformOrigin: "50% 100%" }}><HourTile size={140} flip={flip(i)} /></div>);
        }
        const paid = ramp(t, B.bezahlt, B.bezahlt + 0.35);
        return (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 455, display: "flex", justifyContent: "center", transform: `scale(${soft(-0.3, 11, 200)})` }}>
              <FlipPill t={t} at={B.bezahlt} a="unbezahlte Stunden" b="bezahlt" size={44} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", transform: "scale(1.2)", transformOrigin: "50% 0" }}>
              <SlotCounter t={t} from={0} to={12} start={0.05} dur={1.75} suffix="h" th={th} seconds={seconds} />
            </div>
            {/* paid stamp */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", zIndex: 40 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 52, color: "#FFF", background: `linear-gradient(180deg, #FF8A5C, ${th.accent})`, borderRadius: 26, padding: "14px 34px", boxShadow: `0 8px 0 ${ORANGE_DEEP}, 0 0 ${40 * paid}px ${th.accent}AA`, transform: `scale(${soft(B.auftrag - 0.15, 9, 230)}) rotate(-3deg)`, whiteSpace: "nowrap" }}>Zusatzauftrag</div>
            </div>
            {tiles}
            <Glint k={(t - B.bezahlt - 0.4) / 0.4} size={140} x={760} y={540} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 940, display: "flex", justifyContent: "center", zIndex: 50 }}>
              <Chip text="Beispiel" k={soft(0.2, 12, 200)} size={24} />
            </div>
          </>
        );
      }}
    </ZaSplit>
  );
};

// ---------- 2 · Jede kleine Extrarunde gratis = Arbeit, die niemand bezahlt ----------
// b: kleine, gratis, arbeit, niemand
export const ZaRunden: React.FC<ZaProps> = ({ seconds = 3.9, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { kleine: 0.4, gratis: 1.6, arbeit: 2.5, niemand: 3.2, ...b };
  const rounds = ["Startbild heller", "Logo größer", "Noch auf Englisch", "Kleiner Blog"];
  return (
    <ZaSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const hours = interpolate(t, [B.kleine, B.arbeit + 0.5], [0, 12], clamp);
        const workFill = ramp(t, B.kleine, B.arbeit + 0.5, Easing.inOut(Easing.cubic));
        const zeroPulse = 1 + 0.12 * bump(t, B.niemand, 0.5);
        return (
          <>
            <Title text={<>„Ist ja <Em>nicht viel</Em>“</>} t={t} at={-0.3} y={110} size={72} />
            {rounds.map((r, i) => {
              const at = B.kleine - 0.2 + i * 0.4;
              const a = soft(at, 10, 220);
              const st = soft(Math.max(at + 0.25, B.gratis + i * 0.12), 9, 240);
              return (
                <div key={r} style={{ position: "absolute", left: 70 + (i % 2) * 480, top: 250 + Math.floor(i / 2) * 170, width: 460, height: 140, transform: `scale(${a}) rotate(${(i % 2 ? 1.5 : -1.5)}deg)`, zIndex: 10 + i }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: 30, background: "#FFF", border: `6px solid ${th.line}`, boxShadow: "0 8px 0 #D9CFC0, 0 18px 30px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 18, padding: "0 22px", boxSizing: "border-box" }}>
                    <div style={{ width: 70, height: 70, borderRadius: 20, background: `radial-gradient(circle at 35% 28%, #FFB08F, ${th.accent} 70%)`, boxShadow: `inset 0 -4px 0 rgba(0,0,0,0.18)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 40, color: "#FFF", flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: th.ink, whiteSpace: "nowrap" }}>{r}</div>
                  </div>
                  <div style={{ position: "absolute", right: -14, top: -22, transform: `scale(${st}) rotate(12deg)`, fontFamily: fonts.bold, fontSize: 34, color: "#FFF", background: `linear-gradient(180deg, #FF7A7E, ${RED})`, borderRadius: 18, padding: "6px 16px", boxShadow: `0 5px 0 ${RED_DEEP}` }}>gratis</div>
                </div>
              );
            })}
            {/* bars: work hours fill up, paid stays at zero */}
            <div style={{ position: "absolute", left: 70, top: 640, width: 940, borderRadius: 34, background: "#FFF", border: `6px solid ${th.line}`, boxShadow: "0 8px 0 #D9CFC0", padding: "22px 30px", boxSizing: "border-box", transform: `scale(${soft(B.arbeit - 0.5, 11, 200)})` }}>
              {[{ l: "Arbeit", v: `${Math.round(hours)} h`, f: workFill, c: th.accent }, { l: "Bezahlt", v: "0 €", f: 0.012, c: RED }].map((row, i) => (
                <div key={row.l} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: i ? 18 : 0 }}>
                  <div style={{ width: 170, fontFamily: fonts.bold, fontSize: 36, color: th.ink }}>{row.l}</div>
                  <div style={{ position: "relative", flex: 1, height: 52, borderRadius: 26, background: "#F1ECE4", overflow: "hidden", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.08)" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${row.f * 100}%`, borderRadius: 26, background: `linear-gradient(180deg, ${i ? "#FF7A7E" : "#FF9C73"}, ${row.c})` }}>
                      {i === 0 ? <Sweep t={t} at={B.arbeit} dur={0.9} /> : null}
                    </div>
                  </div>
                  <div style={{ width: 150, textAlign: "right", fontFamily: fonts.bold, fontSize: 44, color: row.c, transform: `scale(${i ? zeroPulse : 1})`, transformOrigin: "100% 50%" }}>{row.v}</div>
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", right: 40, top: 930 }}><Chip text="Beispiel" k={soft(0.3, 12, 200)} size={24} /></div>
          </>
        );
      }}
    </ZaSplit>
  );
};

/** Small Claude chat window frame. */
const ClaudeWindow: React.FC<{ t: number; k: number; top: number; height: number; children?: React.ReactNode }> = ({ t, k, top, height, children }) => (
  <div style={{ position: "absolute", left: 70, top, width: 940, height, borderRadius: 40, background: "#FFF", border: `6px solid ${th.line}`, boxShadow: "0 10px 0 #DDD3C4, 0 30px 60px rgba(0,0,0,0.12)", transform: `scale(${k})`, overflow: "hidden" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 26px", borderBottom: `3px solid ${th.line}` }}>
      <ClaudeTile size={58} t={t} />
      <span style={{ fontFamily: fonts.bold, fontSize: 38, color: th.ink }}>Claude</span>
    </div>
    {children}
  </div>
);

// ---------- 3 · Schritt eins: Angebot / Auftragsbestätigung + Nachricht mit neuem Wunsch ----------
// b: angebot, ab (Auftragsbestätigung), nachricht, wunsch
export const ZaSchritt1: React.FC<ZaProps> = ({ seconds = 4.2, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { angebot: 1.5, ab: 2.2, nachricht: 3.2, wunsch: 4.0, ...b };
  return (
    <ZaSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const win = soft(-0.3, 12, 170);
        const docFly = ramp(t, B.angebot - 0.3, B.ab + 0.1, Easing.inOut(Easing.cubic));
        const msgFly = ramp(t, B.nachricht - 0.3, B.nachricht + 0.35, Easing.inOut(Easing.cubic));
        const docIn = t > B.ab + 0.1;
        const msgIn = t > B.nachricht + 0.35;
        const sendGlow = bump(t, B.wunsch, 0.6);
        return (
          <>
            <Rail active={1} t={t} y={100} />
            <ClaudeWindow t={t} k={win} top={240} height={680}>
              {/* attachment chip */}
              <div style={{ position: "absolute", left: 30, top: 130, display: "flex", alignItems: "center", gap: 18, padding: "16px 22px", borderRadius: 24, background: "#FFF4EE", border: `4px solid ${th.accent}`, opacity: docIn ? 1 : 0, transform: `scale(${docIn ? soft(B.ab + 0.1, 9, 240) : 0})`, transformOrigin: "0 50%" }}>
                <div style={{ width: 64, height: 78, borderRadius: 10, background: RED, color: "#FFF", fontFamily: fonts.bold, fontSize: 22, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8, boxSizing: "border-box", boxShadow: `0 4px 0 ${RED_DEEP}` }}>PDF</div>
                <div>
                  <div style={{ fontFamily: fonts.bold, fontSize: 32, color: th.ink, whiteSpace: "nowrap" }}>Auftragsbestätigung</div>
                  <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: th.dim }}>5 Seiten · 2 Korrekturrunden</div>
                </div>
              </div>
              {/* customer message bubble */}
              <div style={{ position: "absolute", right: 30, top: 300, width: 700, borderRadius: 28, background: "#F5EFE6", padding: "18px 26px", boxSizing: "border-box", opacity: msgIn ? 1 : 0, transform: `scale(${msgIn ? soft(B.nachricht + 0.35, 10, 230) : 0})`, transformOrigin: "100% 0" }}>
                <div style={{ fontFamily: fonts.bold, fontSize: 24, color: th.accent, letterSpacing: 2 }}>NEUER WUNSCH VOM KUNDEN</div>
                <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: th.ink, marginTop: 8, lineHeight: 1.25 }}>„Könnten Sie die Seite noch auf Englisch machen? Und ein kleiner Blog …“</div>
              </div>
              {/* input bar */}
              <div style={{ position: "absolute", left: 30, right: 30, bottom: 26, height: 96, borderRadius: 48, border: `4px solid ${sendGlow > 0 ? th.accent : th.line}`, boxShadow: `0 0 ${30 * sendGlow}px ${th.accent}66`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px 0 30px" }}>
                <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: th.dim }}>Vergleich bitte beides …</span>
                <div style={{ width: 70, height: 70, borderRadius: 35, background: `radial-gradient(circle at 35% 28%, #FFB08F, ${th.accent} 65%)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: fonts.bold, fontSize: 38, transform: `scale(${1 + 0.25 * sendGlow})` }}>↑</div>
              </div>
            </ClaudeWindow>
            {/* flying document */}
            {!docIn ? (
              <div style={{ position: "absolute", left: interpolate(docFly, [0, 1], [-60, 100]), top: interpolate(docFly, [0, 0.5, 1], [640, 330, 370]), transform: `rotate(${(1 - docFly) * -14}deg) scale(${(1 - docFly * 0.5) * soft(B.angebot - 0.55, 11, 200)})`, zIndex: 30 }}>
                <div style={{ width: 300, height: 380, borderRadius: 22, background: "#FFF", border: `5px solid ${th.accent}`, boxShadow: `0 8px 0 ${ORANGE_DEEP}, 0 20px 40px rgba(0,0,0,0.15)`, padding: 24, boxSizing: "border-box" }}>
                  <div style={{ fontFamily: fonts.bold, fontSize: 26, color: th.accent }}>Angebot</div>
                  {[0.9, 0.7, 0.85, 0.6, 0.8, 0.5].map((w, i) => <div key={i} style={{ height: 14, width: `${w * 100}%`, borderRadius: 7, background: "#E7E0D5", marginTop: 18 }} />)}
                </div>
              </div>
            ) : null}
            {/* flying message */}
            {!msgIn && t > B.nachricht - 0.6 ? (
              <div style={{ position: "absolute", left: interpolate(msgFly, [0, 1], [1100, 600]), top: interpolate(msgFly, [0, 0.5, 1], [700, 520, 560]), transform: `rotate(${(1 - msgFly) * 10}deg) scale(${soft(B.nachricht - 0.6, 11, 200)})`, zIndex: 30 }}>
                <div style={{ borderRadius: 26, background: "#FFF", border: `5px solid ${th.accent}`, boxShadow: `0 8px 0 ${ORANGE_DEEP}`, padding: "18px 24px", fontFamily: fonts.bold, fontSize: 30, color: th.accent, whiteSpace: "nowrap" }}>✉ Nachricht vom Kunden</div>
              </div>
            ) : null}
            <Glint k={(t - B.ab - 0.1) / 0.35} size={110} x={560} y={420} />
          </>
        );
      }}
    </ZaSplit>
  );
};

// ---------- 4 · Schritt zwei: vereinbart vs. neu, schwarz auf weiß ----------
// b: vergleicht, schwarz, vereinbart, neu
export const ZaSchritt2: React.FC<ZaProps> = ({ seconds = 3.7, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { vergleicht: 0.26, schwarz: 1.47, vereinbart: 2.36, neu: 3.2, ...b };
  const rows: { w: string; drin: boolean }[] = [
    { w: "Startbild heller", drin: true },
    { w: "Logo größer", drin: true },
    { w: "Englische Version", drin: false },
    { w: "Kleiner Blog", drin: false },
  ];
  return (
    <ZaSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const scan = ramp(t, B.vergleicht, B.schwarz + 0.4, Easing.inOut(Easing.cubic));
        const hiL = ramp(t, B.vereinbart - 0.1, B.vereinbart + 0.25) * (1 - ramp(t, B.neu - 0.1, B.neu + 0.2) * 0.6);
        const hiR = ramp(t, B.neu - 0.1, B.neu + 0.25);
        const nDrin = rows.filter((r, i) => r.drin && t > B.vergleicht + 0.3 + i * 0.3).length;
        const nNeu = rows.filter((r, i) => !r.drin && t > B.vergleicht + 0.3 + i * 0.3).length;
        const tableTop = 350;
        const rowH = 118;
        return (
          <>
            <Rail active={2} t={t} y={100} />
            {/* headers */}
            {[{ l: "Vereinbart", n: nDrin, c: GREEN, cd: GREEN_DEEP, hi: hiL, x: 70 }, { l: "Neu", n: nNeu, c: th.accent, cd: ORANGE_DEEP, hi: hiR, x: 560 }].map((h) => (
              <div key={h.l} style={{ position: "absolute", left: h.x, top: 228, width: 450, height: 100, borderRadius: 30, background: `linear-gradient(180deg, ${h.c === GREEN ? "#5BC98A" : "#FF8A5C"}, ${h.c})`, boxShadow: `0 8px 0 ${h.cd}, 0 0 ${50 * h.hi}px ${h.c}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", boxSizing: "border-box", transform: `scale(${soft(-0.3, 11, 200) * (1 + 0.06 * h.hi)})` }}>
                <span style={{ fontFamily: fonts.bold, fontSize: 46, color: "#FFF" }}>{h.l}</span>
                <span style={{ fontFamily: fonts.bold, fontSize: 52, color: "#FFF", display: "inline-block", transform: `scale(${1 + 0.2 * bump(t, B.vergleicht + 0.3 + rows.findIndex((r, i) => (h.c === GREEN ? r.drin : !r.drin) && i >= 0) * 0.3, 0.3)})` }}>{h.n}</span>
              </div>
            ))}
            {/* rows */}
            <div style={{ position: "absolute", left: 70, top: tableTop, width: 940, height: rows.length * rowH + 20, borderRadius: 34, background: "#FFF", border: `6px solid ${th.line}`, boxShadow: "0 8px 0 #D9CFC0, 0 24px 40px rgba(0,0,0,0.1)", overflow: "hidden" }}>
              {rows.map((r, i) => {
                const at = B.vergleicht + 0.3 + i * 0.3;
                const on = soft(at, 9, 240);
                const live = t > at;
                const glowRow = r.drin ? hiL : hiR;
                return (
                  <div key={r.w} style={{ position: "absolute", left: 0, right: 0, top: 10 + i * rowH, height: rowH, display: "flex", alignItems: "center", padding: "0 28px", borderBottom: i < rows.length - 1 ? `3px solid ${th.line}` : undefined, background: live ? (r.drin ? `rgba(46,158,91,${0.06 + 0.1 * glowRow})` : `rgba(255,107,53,${0.07 + 0.12 * glowRow})`) : "transparent" }}>
                    <div style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 38, color: th.ink, whiteSpace: "nowrap" }}>{r.w}</div>
                    <div style={{ transform: `scale(${live ? on : 0})`, fontFamily: fonts.bold, fontSize: 32, color: "#FFF", background: r.drin ? GREEN : th.accent, borderRadius: 999, padding: "10px 24px", boxShadow: `0 5px 0 ${r.drin ? GREEN_DEEP : ORANGE_DEEP}`, whiteSpace: "nowrap" }}>{r.drin ? "✓ schon drin" : "+ neu"}</div>
                  </div>
                );
              })}
              {/* scan line */}
              {scan > 0 && scan < 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: 10 + scan * rows.length * rowH - 4, height: 8, background: `linear-gradient(90deg, transparent, ${th.accent}, transparent)`, boxShadow: `0 0 24px ${th.accent}` }} /> : null}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 870, display: "flex", justifyContent: "center", gap: 14 }}>
              <Chip text="Fundstelle: Pos. 4 · „Nicht enthalten“" k={soft(B.schwarz, 11, 200)} size={26} />
            </div>
          </>
        );
      }}
    </ZaSplit>
  );
};

// ---------- 5 · Schritt drei: friendly reply + small Nachtragsangebot ----------
// b: antwort, drin, nachtrag, neue
export const ZaSchritt3: React.FC<ZaProps> = ({ seconds = 4.8, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { antwort: 0.83, drin: 2.39, nachtrag: 3.37, neue: 4.58, ...b };
  const greet = "Danke für Ihr Feedback, schön, dass es gefällt!";
  return (
    <ZaSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const card = soft(-0.3, 12, 170);
        const nG = Math.floor(ramp(t, B.antwort - 0.4, B.antwort + 0.9, Easing.linear) * greet.length);
        const drinK = soft(B.drin - 0.1, 10, 230);
        const items = [{ l: "Englische Version", p: "680 €" }, { l: "Blog „Brot der Woche“", p: "680 €" }, { l: "Allergene je Produkt", p: "260 €" }];
        const boxK = soft(B.nachtrag - 0.2, 11, 210);
        const sumAt = B.nachtrag + 0.75;
        return (
          <>
            <Rail active={3} t={t} y={100} />
            <div style={{ position: "absolute", left: 70, top: 225, width: 940, borderRadius: 36, background: "#FFF", border: `6px solid ${th.line}`, boxShadow: "0 10px 0 #DDD3C4, 0 30px 60px rgba(0,0,0,0.12)", transform: `scale(${card})`, padding: "20px 30px 24px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <ClaudeTile size={48} t={t} />
                <span style={{ fontFamily: fonts.bold, fontSize: 30, color: th.dim }}>Antwort an den Kunden</span>
              </div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: th.ink, marginTop: 16, minHeight: 42, whiteSpace: "nowrap" }}>{greet.slice(0, nG)}{nG < greet.length && t > B.antwort - 0.4 ? "|" : ""}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, opacity: Math.min(1, drinK * 2), transform: `translateX(${(1 - drinK) * -40}px)` }}>
                <Check on={drinK * 1.0001} size={44} color={GREEN} />
                <span style={{ fontFamily: fonts.bold, fontSize: 32, color: GREEN, whiteSpace: "nowrap" }}>Startbild + Logo: schon drin, mach ich direkt</span>
              </div>
              {/* Nachtragsangebot box */}
              <div style={{ marginTop: 20, borderRadius: 28, border: `5px solid ${th.accent}`, background: "#FFF7F2", padding: "14px 24px 16px", transform: `scale(${boxK})`, transformOrigin: "50% 0", boxShadow: `0 6px 0 ${ORANGE_DEEP}, 0 0 ${30 * bump(t, B.nachtrag, 0.8)}px ${th.accent}88`, position: "relative", overflow: "hidden" }}>
                <div style={{ fontFamily: fonts.bold, fontSize: 26, letterSpacing: 2, color: th.accent }}>NACHTRAGSANGEBOT</div>
                {items.map((it, i) => {
                  const k = soft(B.nachtrag + 0.15 + i * 0.18, 10, 240);
                  return (
                    <div key={it.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, transform: `translateX(${(1 - k) * 60}px)`, opacity: Math.min(1, k * 2) }}>
                      <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: th.ink, whiteSpace: "nowrap" }}>+ {it.l}</span>
                      <span style={{ fontFamily: fonts.bold, fontSize: 34, color: th.ink }}>{it.p}</span>
                    </div>
                  );
                })}
                <div style={{ height: 3, background: th.line, marginTop: 12 }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, opacity: t > sumAt - 0.1 ? 1 : 0 }}>
                  <span style={{ fontFamily: fonts.bold, fontSize: 34, color: th.accent, whiteSpace: "nowrap" }}>Summe netto</span>
                  <div style={{ position: "relative", width: 420, height: 96 }}>
                    <div style={{ position: "absolute", right: 0, top: 0, transform: "scale(0.55)", transformOrigin: "100% 0", display: "flex" }}>
                      <SlotCounter t={t} from={0} to={1620} start={sumAt} dur={0.6} suffix="€" th={th} seconds={seconds} />
                    </div>
                  </div>
                </div>
                <Sweep t={t} at={B.nachtrag + 0.1} dur={0.8} />
              </div>
            </div>
            <Glint k={(t - sumAt - 0.6) / 0.35} size={120} x={900} y={820} />
            <div style={{ position: "absolute", left: 70, top: 935, zIndex: 50 }}><Chip text="Beispiel aus dem Test" k={soft(0.3, 12, 200)} size={22} /></div>
          </>
        );
      }}
    </ZaSplit>
  );
};

// ---------- 6 · CTA: guide + comment EXTRA ----------
// b: guide, kommentiere
export const ZaCta: React.FC<ZaProps> = ({ seconds = 3.5, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { guide: 1.38, kommentiere: 1.84, ...b };
  return (
    <ZaSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const g = soft(-0.3, 11, 170);
        const word = "EXTRA";
        const n = Math.floor(ramp(t, B.kommentiere, B.kommentiere + 0.5, Easing.linear) * word.length);
        const sent = soft(B.kommentiere + 0.7, 10, 220);
        return (
          <>
            <div style={{ position: "absolute", left: 80, top: 400, width: 410, height: 540, transform: `rotate(${-5 + Math.sin(t * 1.6) * 2}deg) scale(${g})`, borderRadius: 30, background: "linear-gradient(160deg, #1D1D1C, #0A0A0A)", border: "6px solid #2B2B2B", boxShadow: `0 10px 0 #000, 0 30px 60px rgba(0,0,0,0.25), 0 0 ${40 * bump(t, B.guide, 0.8)}px ${th.accent}`, padding: 30, boxSizing: "border-box", overflow: "hidden" }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 20, letterSpacing: 3, color: th.accent }}>GUIDE</div>
              <div style={{ fontFamily: fonts.bold, fontSize: 42, color: "#FFF", marginTop: 14, lineHeight: 1.08 }}>Aus Gratis-Änderung wird Zusatzauftrag</div>
              {["2 Nachrichten an Claude", "Echtes Testbeispiel", "Antwortvorlage"].map((x, i) => (
                <div key={x} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: i ? 14 : 34, opacity: ramp(t, 0.2 + i * 0.25, 0.4 + i * 0.25) }}>
                  <Check on={ramp(t, 0.2 + i * 0.25, 0.4 + i * 0.25) * 1.0001} size={30} />
                  <span style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF", whiteSpace: "nowrap" }}>{x}</span>
                </div>
              ))}
              <Sweep t={t} at={B.guide + 0.1} dur={0.8} />
            </div>
            <div style={{ position: "absolute", left: 530, top: 540, width: 490, transform: `scale(${soft(B.kommentiere - 0.6, 11, 200)})` }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 34, color: th.ink, marginBottom: 14 }}>Kommentiere</div>
              <div style={{ height: 120, borderRadius: 60, background: "#FFF", border: `5px solid ${th.accent}`, boxShadow: `0 8px 0 ${ORANGE_DEEP}, 0 0 ${30 * ramp(t, B.kommentiere, B.kommentiere + 0.4)}px ${th.accent}88`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 0 34px" }}>
                <span style={{ fontFamily: fonts.bold, fontSize: 56, color: th.ink, letterSpacing: 1 }}>{word.slice(0, n)}{n < word.length && t > B.kommentiere ? "|" : ""}</span>
                <div style={{ width: 84, height: 84, borderRadius: 42, background: `radial-gradient(circle at 35% 28%, #FFB08F, ${th.accent} 65%)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: fonts.bold, fontSize: 44, transform: `scale(${1 + 0.25 * bump(t, B.kommentiere + 0.6, 0.4)})` }}>↑</div>
              </div>
              <div style={{ marginTop: 26, opacity: sent, transform: `translateY(${(1 - sent) * 30}px)` }}>
                <Chip text="Guide kommt per DM" k={sent} bg={GREEN} color="#FFF" size={30} style={{ border: "none" }} />
              </div>
            </div>
          </>
        );
      }}
    </ZaSplit>
  );
};
