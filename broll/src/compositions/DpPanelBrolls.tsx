import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { AvatarSrc, serifItalic } from "../components/PanelKit";
import { HOOK_THEMES, SlotCounter } from "../components/HookKit";
import { SIMPLE_ICONS } from "../components/logoPaths";

// FP-N "Drei Pakete statt ein Preis" (runs/fpn-drei-pakete, Reel 2026-10-09 17:00).
// Dopamin-Split-B-Rolls (video-broll, Henri 2026-10-08): panel on top (52 %), speaker below, caption pill on the seam,
// casino-/slot-style chunky glossy objects on cream/white with Superkind orange, gold only for money.
// Every prop `b` = beat times in seconds from the window start (from captions.json). All prices are invented examples.

const W = 1080;
const H = 1920;
const th = HOOK_THEMES.fp;
const GOLD = { hi: "#FFF3B8", mid: "#F2C14E", lo: "#C8901E", deep: "#8A5A0B" };
const GREEN = "#2E9E5B";
const RED = "#E5484D";

export type DpProps = { seconds?: number; avatar: AvatarSrc; panelFrac?: number; b?: Record<string, number> };

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

const DpSplit: React.FC<{ avatar: AvatarSrc; seconds: number; panelFrac?: number; children: (t: number) => React.ReactNode }> = ({ avatar, seconds, panelFrac = 0.52, children }) => {
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

// ---------- 1 · Hook: three package cards drop in, the middle one lights up ----------
// b: pakete (word "drei Pakete"), billig ("billigste")
export const DpHook: React.FC<DpProps> = ({ seconds = 4, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { pakete: 1.6, billig: 3.2, ...b };
  return (
    <DpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const cardW = 300;
        const xs = [40, 390, 740];
        const floorY = 470;
        const tiers: Tier[] = ["S", "M", "L"];
        const prices = ["1.600 €", "2.900 €", "4.500 €"];
        const at = [-0.42, -0.3, -0.18];
        const lit = ramp(t, Math.min(1.1, B.pakete - 0.4), Math.min(1.5, B.pakete));
        const glow = lit * (0.75 + 0.25 * Math.sin(t * 7));
        const badgeK = soft(Math.min(1.25, B.pakete - 0.2), 10, 220);
        return (
          <>
            {tiers.map((tier, i) => {
              const [y, sq] = drop(t, at[i], -520, floorY, 7000);
              const mid = tier === "M";
              const lift = mid ? -46 * lit : 0;
              const hits = mid ? [0, 1, 2, 3].reduce((acc, j) => acc + bump(t, B.billig - 0.9 + j * 0.3 + Math.sqrt((2 * 700) / 6000), 0.3), 0) : 0;
              const sc = mid ? 1 + 0.1 * lit + 0.04 * bump(t, B.pakete, 0.5) + 0.035 * hits : 1 - 0.05 * lit;
              const dim = tier === "S" ? 0.6 * ramp(t, B.billig, B.billig + 0.4) : 0;
              const rowsN = tier === "S" ? 2 : tier === "M" ? 3 : 4;
              const rows = Array.from({ length: rowsN }).map((_, j) => ({ text: ["Leistung", "Leistung", "+ Extra", "Alles"][j] ?? "", on: ramp(t, 0.35 + i * 0.12 + j * 0.16, 0.5 + i * 0.12 + j * 0.16) * 1.0001, extra: mid && j === 2 }));
              const glintK = (t - (at[i] + Math.sqrt((2 * (floorY + 520)) / 7000))) / 0.32;
              return (
                <div key={tier} style={{ position: "absolute", left: xs[i], top: y + lift, transform: `scale(${sc}) scaleY(${sq})`, transformOrigin: "50% 100%", zIndex: mid ? 20 : 10 }}>
                  <PackCard tier={tier} w={cardW} t={t} price={prices[i]} rows={rows} glow={mid ? glow : 0} sweepAt={mid ? B.pakete - 0.1 : 0.2 + i * 0.25} dim={dim} badge={mid ? "Empfehlung" : undefined} badgeK={mid ? badgeK : 0} />
                  <Glint k={glintK} size={110} x={cardW * 0.82} y={30} />
                </div>
              );
            })}
            {/* customer tokens fall into the cards after "nicht mehr das billigste" (most into the middle), absorbed with a pop */}
            {Array.from({ length: 4 }).map((_, j) => {
              const s0 = B.billig - 0.9 + j * 0.3;
              const target = 1;
              const land = s0 + Math.sqrt((2 * 700) / 6000);
              if (t < s0 || t > land + 0.2) return null;
              const [y] = drop(t, s0, -100, 600, 6000);
              const out = ramp(t, land, land + 0.2);
              return <div key={j} style={{ position: "absolute", left: xs[target] + 120 + ((j * 37) % 3 - 1) * 40, top: y, zIndex: 30, transform: `scale(${1 - out})`, opacity: 1 - out }}><Token size={60} color={target === 1 ? th.accent : "#B9B2A6"} /></div>;
            })}
            <div style={{ position: "absolute", left: 0, right: 0, top: 930, display: "flex", justifyContent: "center" }}>
              <Chip text="Beispielpreise" k={soft(0.2, 12, 200)} size={24} />
            </div>
          </>
        );
      }}
    </DpSplit>
  );
};

// ---------- 2 · Ein Preis = ja oder nein / drei Preise = welches ----------
// b: ja, nein, drei, welches
export const DpJaNein: React.FC<DpProps> = ({ seconds = 4.5, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { ja: 0.9, nein: 1.3, drei: 2.2, welches: 3.4, ...b };
  return (
    <DpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const phase2 = ramp(t, B.drei - 0.15, B.drei + 0.25);
        const tagA = soft(-0.3, 12, 200);
        // indecision: highlight flips JA/NEIN faster and faster
        const flip = t > B.ja ? Math.floor((t - B.ja) * (3 + (t - B.ja) * 4)) % 2 : -1;
        const sel = t > B.welches ? interpolate(t, [B.welches, B.welches + 0.35, B.welches + 0.7, B.welches + 1.0], [0, 1, 2, 1], clamp) : interpolate(t, [B.drei + 0.3, B.drei + 0.7, B.drei + 1.1], [0, 1, 2], clamp);
        return (
          <>
            {/* phase 1: one price */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 1 - phase2, transform: `translateX(${-phase2 * 300}px) scale(${1 - 0.2 * phase2})` }}>
              <Title text={<>1 Preis</>} t={t} at={-0.3} y={150} size={80} />
              <div style={{ position: "absolute", left: 310, top: 270, transform: `scale(${tagA}) rotate(${-4 + Math.sin(t * 2) * 2}deg)` }}>
                <PackCard tier="M" w={460} t={t} price="2.400 €" rows={[{ text: "Website", on: 1 }]} sweepAt={0.3} />
              </div>
              {(["JA", "NEIN"] as const).map((l, i) => {
                const a = soft(i ? B.nein : B.ja, 10, 220);
                const on = flip === i;
                const c = i ? RED : GREEN;
                return (
                  <div key={l} style={{ position: "absolute", left: i ? 590 : 150, top: 770, width: 340, height: 130, borderRadius: 34, background: on ? `radial-gradient(circle at 35% 25%, ${i ? "#FF8A8D" : "#6FD39B"}, ${c} 70%)` : "#FFF", border: `5px solid ${c}`, boxShadow: on ? `0 8px 0 ${i ? "#A8262A" : "#1E6E3F"}, 0 0 40px ${c}88` : `0 8px 0 ${c}55`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 72, color: on ? "#FFF" : c, transform: `scale(${a * (on ? 1.06 : 1)}) translateY(${on ? 4 : 0}px)` }}>{l}</div>
                );
              })}
            </div>
            {/* phase 2: three prices */}
            <div style={{ position: "absolute", inset: 0, opacity: phase2, transform: `translateX(${(1 - phase2) * 300}px)` }}>
              <Title text={<>3 Preise</>} t={t} at={B.drei} y={150} size={80} />
              {(["S", "M", "L"] as Tier[]).map((tier, i) => {
                const a = soft(B.drei + i * 0.12, 11, 200);
                const on = Math.max(0, 1 - Math.abs(sel - i));
                return (
                  <div key={tier} style={{ position: "absolute", left: 50 + i * 345, top: 300 - on * 26, transform: `scale(${a * (0.94 + 0.1 * on)})`, transformOrigin: "50% 100%" }}>
                    <PackCard tier={tier} w={290} t={t} price={["1.600 €", "2.900 €", "4.500 €"][i]} glow={on * 0.8} sweepAt={B.drei + 0.2 + i * 0.15} />
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: serifItalic, fontSize: 150, color: th.accent, transform: `scale(${soft(B.welches, 10, 220)})`, opacity: t > B.welches ? 1 : 0 }}>welches?</div>
            </div>
          </>
        );
      }}
    </DpSplit>
  );
};

// ---------- 3 · Kompromisseffekt: tokens stack in three columns, the middle one grows most ----------
// b: effekt, mitte, seiten
export const DpEffekt: React.FC<DpProps> = ({ seconds = 5, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { effekt: 0.6, mitte: 2.0, seiten: 3.4, ...b };
  return (
    <DpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const tA = soft(B.effekt - 0.2, 12, 200);
        const ul = ramp(t, B.effekt + 0.1, B.effekt + 0.6, Easing.inOut(Easing.cubic));
        const cols = [{ x: 150, n: 2 }, { x: 540, n: 6 }, { x: 930, n: 2 }];
        const baseY = 860;
        const tokens: React.ReactNode[] = [];
        let k = 0;
        // drop order: interleaved, middle gets most
        const order: number[] = [];
        for (let r = 0; r < 6; r++) cols.forEach((c, ci) => { if (r < c.n) order.push(ci); });
        const start = Math.max(0.2, B.effekt - 0.2);
        const every = Math.max(0.2, (B.seiten - 0.3 - start) / order.length);
        const lvl = [0, 0, 0];
        order.forEach((ci) => {
          const s0 = start + k * every;
          const level = lvl[ci]++;
          const [y] = drop(t, s0, -150, baseY - level * 52, 6500);
          if (t >= s0) tokens.push(<div key={k} style={{ position: "absolute", left: cols[ci].x - 32 + (level % 2 ? 6 : -6), top: y - 64, zIndex: 10 + level }}><Token size={64} color={ci === 1 ? th.accent : "#B9B2A6"} /></div>);
          k++;
        });
        const sides = ramp(t, B.seiten, B.seiten + 0.3);
        const midGlow = ramp(t, B.mitte, B.mitte + 0.4) * (0.7 + 0.3 * Math.sin(t * 7));
        return (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", transform: `scale(${0.8 + 0.2 * tA})`, opacity: tA }}>
              <span style={{ position: "relative", fontFamily: serifItalic, fontSize: 112, color: th.ink, letterSpacing: -2 }}>
                Kompromisseffekt
                <span style={{ position: "absolute", left: 0, right: 0, bottom: -2, height: 10, borderRadius: 99, background: th.accent, transformOrigin: "0 50%", transform: `scaleX(${ul}) rotate(-1deg)` }} />
              </span>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", gap: 14 }}>
              <Chip text="Simonson 1989" k={soft(B.effekt + 0.4, 12, 200)} size={26} />
              <Chip text="Schema" k={soft(B.effekt + 0.55, 12, 200)} size={26} />
            </div>
            {/* column plates */}
            {cols.map((c, ci) => (
              <div key={ci} style={{ position: "absolute", left: c.x - 130, top: baseY + 6, width: 260, height: 70, borderRadius: 24, background: ci === 1 ? `linear-gradient(180deg, #FF8A5C, ${th.accent})` : "linear-gradient(180deg, #FFFFFF, #EDE6DA)", border: `4px solid ${ci === 1 ? "#C9471C" : "#D9CFC0"}`, boxShadow: `0 8px 0 ${ci === 1 ? "#C9471C" : "#C6BBAA"}, 0 0 ${ci === 1 ? midGlow * 60 : 0}px ${th.accent}AA`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 40, color: ci === 1 ? "#FFF" : th.ink, transform: `scale(${ci === 1 ? 1 + 0.06 * midGlow : 1})` }}>{["Klein", "Mitte", "Groß"][ci]}</div>
            ))}
            {tokens}
            {/* "links und rechts": arrows pointing in from both sides */}
            {[0, 2].map((ci) => (
              <div key={ci} style={{ position: "absolute", left: ci ? 690 : 250, top: 520, fontFamily: fonts.bold, fontSize: 90, color: th.accent, opacity: sides, transform: `translateX(${(ci ? 1 : -1) * (1 - sides) * 80 + Math.sin(t * 8) * 6 * (ci ? -1 : 1)}px)` }}>{ci ? "←" : "→"}</div>
            ))}
          </>
        );
      }}
    </DpSplit>
  );
};

// ---------- 4 · Schritt eins: Anfrage in Claude + normaler Preis ----------
// b: anfrage, claude, preis
export const DpSchritt1: React.FC<DpProps> = ({ seconds = 5, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { anfrage: 0.8, claude: 1.8, preis: 3.2, ...b };
  return (
    <DpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const win = soft(-0.3, 12, 170);
        const fly = ramp(t, B.anfrage, B.claude, Easing.inOut(Easing.cubic));
        const typed = "Normalpreis:";
        const n = Math.floor(ramp(t, B.preis - 0.6, B.preis, Easing.linear) * typed.length);
        return (
          <>
            <Rail active={1} t={t} y={110} />
            <div style={{ position: "absolute", left: 90, top: 260, width: 900, height: 620, borderRadius: 40, background: "#FFF", border: `6px solid ${th.line}`, boxShadow: "0 10px 0 #DDD3C4, 0 30px 60px rgba(0,0,0,0.12)", transform: `scale(${win})`, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 28px", borderBottom: `3px solid ${th.line}` }}>
                <ClaudeTile size={64} t={t} />
                <span style={{ fontFamily: fonts.bold, fontSize: 40, color: th.ink }}>Claude</span>
              </div>
              {/* pasted request bubble */}
              <div style={{ position: "absolute", right: 30, top: 120, width: 640, borderRadius: 26, background: "#F5EFE6", padding: "18px 24px", opacity: ramp(t, B.claude - 0.1, B.claude + 0.1), transform: `scale(${soft(B.claude - 0.1, 11, 220)})`, transformOrigin: "100% 0" }}>
                <div style={{ fontFamily: fonts.bold, fontSize: 24, color: th.dim, letterSpacing: 2 }}>ANFRAGE VOM KUNDEN</div>
                <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: th.ink, marginTop: 8 }}>„Können Sie unsere Website überarbeiten? 5 Seiten …“</div>
              </div>
              {/* input line with the normal price */}
              <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, height: 170, borderRadius: 28, border: `4px solid ${t > B.preis - 0.7 ? th.accent : th.line}`, display: "flex", alignItems: "center", gap: 18, padding: "0 26px", boxShadow: t > B.preis - 0.7 ? `0 0 30px ${th.accent}44` : undefined }}>
                <span style={{ fontFamily: fonts.semibold, fontSize: 36, color: th.ink, whiteSpace: "nowrap" }}>{typed.slice(0, n)}{t > B.preis - 0.7 && t < B.preis ? "|" : ""}</span>
                <div style={{ position: "absolute", right: 24, top: 22, transform: "scale(0.62)", transformOrigin: "100% 0", opacity: t > B.preis - 0.05 ? 1 : 0 }}>
                  <SlotCounter t={t} from={0} to={2400} start={B.preis} dur={0.9} suffix="€" th={th} seconds={seconds} />
                </div>
              </div>
            </div>
            {/* mail card flying into the chat */}
            <div style={{ position: "absolute", left: interpolate(fly, [0, 1], [-40, 380]), top: interpolate(fly, [0, 0.5, 1], [470, 330, 380]), width: 420, transform: `rotate(${(1 - fly) * -8}deg) scale(${(1 - fly * 0.55) * soft(B.anfrage - 0.45, 11, 200)})`, opacity: 1 - ramp(t, B.claude - 0.15, B.claude + 0.05), zIndex: 30 }}>
              <div style={{ borderRadius: 26, background: "#FFF", border: `5px solid ${th.accent}`, boxShadow: `0 8px 0 #C9471C, 0 20px 40px rgba(0,0,0,0.15)`, padding: "20px 24px" }}>
                <div style={{ fontFamily: fonts.bold, fontSize: 26, color: th.accent }}>✉ Neue Anfrage</div>
                {[0.9, 0.7, 0.8].map((w, i) => <div key={i} style={{ height: 14, width: `${w * 100}%`, borderRadius: 7, background: "#E7E0D5", marginTop: 14 }} />)}
              </div>
            </div>
          </>
        );
      }}
    </DpSplit>
  );
};

// ---------- 5 · Schritt zwei: Claude baut drei Pakete (klein, mittel + Extra, groß) ----------
// b: drei, klein, mittel, extra, gross
export const DpSchritt2: React.FC<DpProps> = ({ seconds = 8, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { drei: 0.8, klein: 2.0, mittel: 3.6, extra: 5.0, gross: 6.6, ...b };
  return (
    <DpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const tiers: Tier[] = ["S", "M", "L"];
        const xs = [40, 390, 740];
        const focus = t < B.klein ? -1 : t < B.mittel ? 0 : t < B.gross ? 1 : 2;
        const tileA = soft(-0.3, 11, 180);
        const midPrice = t < B.extra ? 2400 : 2900;
        const rowsFor = (tier: Tier) => {
          if (tier === "S") return [{ text: "3 Seiten", on: ramp(t, B.klein + 0.2, B.klein + 0.4) }, { text: "1 Korrektur", on: ramp(t, B.klein + 0.5, B.klein + 0.7) }];
          if (tier === "M") return [{ text: "5 Seiten", on: ramp(t, B.mittel + 0.2, B.mittel + 0.4) }, { text: "2 Korrekturen", on: ramp(t, B.mittel + 0.5, B.mittel + 0.7) }, { text: "+ Einweisung", on: ramp(t, B.extra + 0.3, B.extra + 0.5), extra: true }];
          return [0, 1, 2, 3].map((j) => ({ text: ["5 Seiten", "Neue Texte", "Fotos", "Betreuung"][j], on: ramp(t, B.gross + 0.1 + j * 0.15, B.gross + 0.25 + j * 0.15) }));
        };
        const prices = ["1.600 €", null, "4.500 €"];
        return (
          <>
            <Rail active={2} t={t} y={110} />
            <div style={{ position: "absolute", left: 470, top: 240, transform: `scale(${tileA * (1 + 0.08 * bump(t, B.drei, 0.5))})` }}><ClaudeTile size={140} t={t} /></div>
            {tiers.map((tier, i) => {
              const a = soft(B.drei + i * 0.14, 11, 190);
              const from = { x: 470 + 70 - 150, y: 280 };
              const x = interpolate(a, [0, 1], [from.x, xs[i]]);
              const y = interpolate(a, [0, 1], [from.y, 420]);
              const on = focus === i ? 1 : 0;
              const lift = focus === i ? -24 : 0;
              const midGlow = tier === "M" ? ramp(t, B.extra, B.extra + 0.3) * (0.7 + 0.3 * Math.sin(t * 7)) : 0;
              return (
                <div key={tier} style={{ position: "absolute", left: x, top: y + lift, transform: `scale(${Math.max(0.01, a) * (focus === -1 || on ? 1 : 0.95)})`, transformOrigin: "50% 0", zIndex: on ? 20 : 10, opacity: focus === -1 || on || tier === "M" ? 1 : 0.85 }}>
                  <PackCard tier={tier} w={300} t={t} rows={rowsFor(tier)} glow={Math.max(on * 0.5, midGlow)} sweepAt={[B.klein, B.mittel, B.gross][i]} price={tier === "M" ? <span style={{ display: "inline-block", transform: `scale(${1 + 0.12 * bump(t, B.extra + 0.6, 0.5)})` }}>{(t < B.extra ? midPrice : Math.round(interpolate(t, [B.extra + 0.3, B.extra + 0.9], [2400, 2900], clamp))).toLocaleString("de-DE")} €</span> : prices[i]} badge={tier === "M" && t > B.extra ? "Empfehlung" : undefined} badgeK={soft(B.extra + 0.8, 10, 220)} />
                </div>
              );
            })}
            {/* "+ Extra" chip flies into the middle card */}
            {t > B.extra - 0.3 && t < B.extra + 0.6 ? (() => {
              const f = ramp(t, B.extra - 0.3, B.extra + 0.3, Easing.inOut(Easing.cubic));
              return <div style={{ position: "absolute", left: interpolate(f, [0, 1], [820, 450]), top: interpolate(f, [0, 0.5, 1], [180, 140, 700]), opacity: 1 - ramp(t, B.extra + 0.3, B.extra + 0.6), zIndex: 40 }}><Chip text="+ Extra" k={1} bg={th.accent} color="#FFF" size={40} style={{ border: "none", boxShadow: `0 6px 0 #C9471C, 0 0 30px ${th.accent}88` }} /></div>;
            })() : null}
            <Glint k={(t - B.extra - 0.35) / 0.35} size={120} x={650} y={720} />
            <div style={{ position: "absolute", right: 40, top: 930 }}><Chip text="Beispiel" k={soft(0.3, 12, 200)} size={24} /></div>
          </>
        );
      }}
    </DpSplit>
  );
};

// ---------- 6 · Schritt drei: was der Kunde davon hat, statt was du machst ----------
// b: satz, kunde, statt
export const DpSchritt3: React.FC<DpProps> = ({ seconds = 5, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { satz: 0.9, kunde: 2.0, statt: 3.2, ...b };
  const rows: [Tier, string, string][] = [["S", "Ich überarbeite 3 Seiten", "Wieder aktuell"], ["M", "Ich erkläre das System", "Du änderst Texte selbst"], ["L", "Ich mache alles", "Du kümmerst dich um nichts"]];
  return (
    <DpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => (
        <>
          <Rail active={3} t={t} y={110} />
          <Title text={<>Was der Kunde <Em>davon hat</Em></>} t={t} at={B.kunde - 0.3} y={250} size={64} />
          {rows.map(([tier, old, neu], i) => {
            const a = soft(-0.25 + i * 0.1, 11, 200);
            const s = B.satz + i * 0.55;
            const strike = ramp(t, s, s + 0.3);
            const swap = soft(s + 0.35, 11, 220);
            const c = TIER[tier];
            return (
              <div key={tier} style={{ position: "absolute", left: 60, top: 400 + i * 170, width: 960, height: 140, borderRadius: 32, background: "#FFF", border: `6px solid ${c.ring}`, boxShadow: `0 8px 0 ${tier === "M" ? "#C9471C" : tier === "L" ? "#000" : "#C6BBAA"}, 0 20px 40px rgba(0,0,0,0.1), 0 0 ${tier === "M" ? 30 * swap : 0}px ${th.accent}88`, display: "flex", alignItems: "center", gap: 24, padding: "0 26px", transform: `translateX(${(1 - a) * 900}px)`, overflow: "hidden" }}>
                <div style={{ width: 84, height: 84, borderRadius: 24, background: `radial-gradient(circle at 35% 28%, ${c.badge[0]}, ${c.badge[1]} 70%)`, boxShadow: "inset 0 -5px 0 rgba(0,0,0,0.18), inset 0 4px 0 rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 52, color: tier === "S" ? th.ink : "#FFF", flexShrink: 0 }}>{tier}</div>
                <div style={{ position: "relative", flex: 1, height: 100 }}>
                  <div style={{ position: "absolute", left: 0, top: 26, fontFamily: fonts.semibold, fontSize: 40, color: th.dim, opacity: 1 - swap, transform: `translateY(${-swap * 40}px)`, whiteSpace: "nowrap" }}>
                    {old}
                    <div style={{ position: "absolute", left: 0, top: 26, height: 6, borderRadius: 3, background: RED, width: `${strike * 100}%` }} />
                  </div>
                  <div style={{ position: "absolute", left: 0, top: 22, fontFamily: fonts.bold, fontSize: 46, color: tier === "M" ? th.accent : th.ink, opacity: swap, transform: `translateY(${(1 - swap) * 40}px) scale(${0.9 + 0.1 * swap})`, transformOrigin: "0 50%", whiteSpace: "nowrap" }}>{neu}</div>
                </div>
                <Check on={swap * 1.0001} size={60} color={GREEN} />
                <Sweep t={t} at={s + 0.4} />
              </div>
            );
          })}
        </>
      )}
    </DpSplit>
  );
};

// ---------- 7 · CTA: guide + comment PAKETE ----------
// b: guide, kommentiere
export const DpCta: React.FC<DpProps> = ({ seconds = 5, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { guide: 1.2, kommentiere: 3.0, ...b };
  return (
    <DpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const g = soft(B.guide - 0.5, 11, 170);
        const word = "PAKETE";
        const n = Math.floor(ramp(t, B.kommentiere, B.kommentiere + 0.6, Easing.linear) * word.length);
        const sent = soft(B.kommentiere + 0.75, 10, 220);
        return (
          <>
            {/* guide cover */}
            <div style={{ position: "absolute", left: 90, top: 430, width: 400, height: 520, transform: `rotate(${-5 + Math.sin(t * 1.6) * 2}deg) scale(${g})`, borderRadius: 30, background: "linear-gradient(160deg, #1D1D1C, #0A0A0A)", border: "6px solid #2B2B2B", boxShadow: `0 10px 0 #000, 0 30px 60px rgba(0,0,0,0.25), 0 0 ${40 * bump(t, B.guide, 0.8)}px ${th.accent}`, padding: 30, boxSizing: "border-box", overflow: "hidden" }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 20, letterSpacing: 3, color: th.accent }}>GUIDE</div>
              <div style={{ fontFamily: fonts.bold, fontSize: 46, color: "#FFF", marginTop: 14, lineHeight: 1.05 }}>Drei Pakete statt ein Preis</div>
              <div style={{ display: "flex", gap: 10, marginTop: 30 }}>
                {(["S", "M", "L"] as Tier[]).map((tr) => <div key={tr} style={{ width: 90, height: 90, borderRadius: 22, background: `radial-gradient(circle at 35% 28%, ${TIER[tr].badge[0]}, ${TIER[tr].badge[1]} 70%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 50, color: tr === "S" ? th.ink : "#FFF", boxShadow: "inset 0 -5px 0 rgba(0,0,0,0.2)" }}>{tr}</div>)}
              </div>
              {["Nachricht an Claude", "Vorlage S / M / L", "Beispiel mit Zahlen"].map((x, i) => (
                <div key={x} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: i ? 14 : 34, opacity: ramp(t, B.guide + 0.2 + i * 0.25, B.guide + 0.4 + i * 0.25) }}>
                  <Check on={ramp(t, B.guide + 0.2 + i * 0.25, B.guide + 0.4 + i * 0.25) * 1.0001} size={30} />
                  <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: "#FFF", whiteSpace: "nowrap" }}>{x}</span>
                </div>
              ))}
              <Sweep t={t} at={B.guide + 0.1} dur={0.8} />
            </div>
            {/* comment field */}
            <div style={{ position: "absolute", left: 530, top: 560, width: 500, transform: `scale(${soft(B.kommentiere - 0.5, 11, 200)})` }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 34, color: th.ink, marginBottom: 14 }}>Kommentiere</div>
              <div style={{ height: 120, borderRadius: 60, background: "#FFF", border: `5px solid ${th.accent}`, boxShadow: `0 8px 0 #C9471C, 0 0 ${30 * ramp(t, B.kommentiere, B.kommentiere + 0.4)}px ${th.accent}88`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 0 34px" }}>
                <span style={{ fontFamily: fonts.bold, fontSize: 54, color: th.ink, letterSpacing: 1 }}>{word.slice(0, n)}{n < word.length && t > B.kommentiere ? "|" : ""}</span>
                <div style={{ width: 84, height: 84, borderRadius: 42, background: `radial-gradient(circle at 35% 28%, #FFB08F, ${th.accent} 65%)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: fonts.bold, fontSize: 44, transform: `scale(${1 + 0.25 * bump(t, B.kommentiere + 0.7, 0.4)})` }}>↑</div>
              </div>
              <div style={{ marginTop: 26, opacity: sent, transform: `translateY(${(1 - sent) * 30}px)` }}>
                <Chip text="Guide kommt per DM" k={sent} bg={GREEN} color="#FFF" size={30} style={{ border: "none" }} />
              </div>
            </div>
          </>
        );
      }}
    </DpSplit>
  );
};
