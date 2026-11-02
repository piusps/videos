import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { AvatarSrc, serifItalic } from "../components/PanelKit";
import { HOOK_THEMES, SlotCounter } from "../components/HookKit";
import { SIMPLE_ICONS } from "../components/logoPaths";

// FP-N "Kunde vorher prüfen" (runs/fpn-kunde-pruefen, Reel 2026-10-10 14:40).
// Dopamin-Split-B-Rolls, mittlere Stufe (video-broll, Henri 2026-10-08): panel on top (52 %), speaker below, caption pill on the seam,
// chunky glossy slot-style pieces on cream/white with Superkind orange, gold only for money. Own file, no shared component changed.
// Every prop `b` = beat times in seconds from the window start (from captions.json). Company + amounts are invented examples.

const W = 1080;
const H = 1920;
const th = HOOK_THEMES.fp;
const GOLD = { hi: "#FFF3B8", mid: "#F2C14E", lo: "#C8901E", deep: "#8A5A0B" };
const GREEN = "#2E9E5B";
const YELLOW = "#F2B705";
const RED = "#E5484D";

export type KpProps = { seconds?: number; avatar: AvatarSrc; panelFrac?: number; b?: Record<string, number> };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const bump = (t: number, at: number, d: number) => (t < at || t > at + d ? 0 : Math.sin(Math.PI * Math.sqrt((t - at) / d)) * (1 - (t - at) / d) * 1.6);
const useSoft = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (at: number, damping = 14, stiffness = 170) => spring({ frame: frame - Math.round(at * fps), fps, config: { damping, stiffness, mass: 0.7 } });
};
const resolveSrc = (s: string) => (/^(https?:|file:)/.test(s) ? s : staticFile(s));
const drop = (t: number, at: number, y0: number, y1: number, g = 5200): [number, number] => {
  if (t < at) return [y0, 1];
  const fall = Math.sqrt((2 * Math.max(1, y1 - y0)) / g);
  const tf = t - at;
  if (tf < fall) return [y0 + 0.5 * g * tf * tf, 1];
  const u = (tf - fall) / 0.42;
  const b = u < 1 ? Math.abs(Math.sin(Math.PI * u * 2)) * 30 * Math.pow(1 - u, 1.7) : 0;
  const sq = u < 0.18 ? 1 - 0.12 * Math.sin((Math.PI * u) / 0.18) : 1;
  return [y1 - b, sq];
};
const landAt = (at: number, y0: number, y1: number, g = 5200) => at + Math.sqrt((2 * Math.max(1, y1 - y0)) / g);

// ---------- split frame ----------
const KpSplit: React.FC<{ avatar: AvatarSrc; seconds: number; panelFrac?: number; children: (t: number) => React.ReactNode }> = ({ avatar, seconds, panelFrac = 0.52, children }) => {
  const f0 = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f0 / fps;
  const PH = Math.round(H * panelFrac);
  const k = ramp(t, seconds - 0.35, seconds, Easing.inOut(Easing.cubic));
  const s0 = avatar.scale ?? 1.0;
  const f = avatar.focus ?? { x: 0.5, y: 0.6 };
  const h0 = H - PH;
  const vw0 = W * s0, vh0 = H * s0;
  const left0 = Math.min(0, Math.max(W - vw0, W / 2 - f.x * vw0));
  const top0 = Math.min(0, Math.max(h0 - vh0, h0 * (avatar.faceAt ?? 0.5) - f.y * vh0));
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

// ---------- pieces ----------
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
const Check: React.FC<{ on: number; size?: number; color?: string }> = ({ on, size = 34, color = GREEN }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, flexShrink: 0, background: on > 0.5 ? `radial-gradient(circle at 35% 30%, ${color === GREEN ? "#7FDCA6" : "#FFB48F"}, ${color} 60%)` : "#EEE8DE", boxShadow: on > 0.5 ? `0 3px 0 ${color === GREEN ? "#1E6E3F" : "#C9471C"}, 0 0 ${12 * on}px ${color}88` : "inset 0 2px 3px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: fonts.bold, fontSize: size * 0.6, transform: `scale(${0.6 + 0.4 * Math.min(1, on)})` }}>{on > 0.5 ? "✓" : ""}</div>
);
const Chip: React.FC<{ text: string; k: number; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({ text, k, bg = "#FFFFFF", color = th.ink, size = 30, style }) => (
  <div style={{ display: "inline-block", fontFamily: fonts.semibold, fontSize: size, color, background: bg, border: `2px solid ${th.line}`, borderRadius: 999, padding: `${size * 0.22}px ${size * 0.7}px`, boxShadow: "0 6px 16px rgba(0,0,0,0.07)", transform: `scale(${k})`, opacity: Math.min(1, k * 2), whiteSpace: "nowrap", ...style }}>{text}</div>
);
const ClaudeTile: React.FC<{ size: number; t: number }> = ({ size, t }) => {
  const ic = SIMPLE_ICONS["claude"];
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.26, background: `radial-gradient(circle at 35% 25%, #FF9C73, ${th.accent} 65%)`, boxShadow: `inset 0 -${size * 0.06}px 0 rgba(0,0,0,0.15), inset 0 ${size * 0.04}px 0 rgba(255,255,255,0.5), 0 ${size * 0.1}px ${size * 0.2}px rgba(0,0,0,0.18)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
const Em: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = th.accent }) => <span style={{ fontFamily: serifItalic, color, fontSize: "1.12em", letterSpacing: -1 }}>{children}</span>;

/** Chunky glossy traffic light (slot-machine style housing). lit: 0 red, 1 yellow, 2 green, -1 none. glow 0..1 on the lit lamp. */
const Ampel: React.FC<{ lit: number; glow: number; size?: number; t: number }> = ({ lit, glow, size = 1, t }) => {
  const lamp = 120 * size;
  const cols = [RED, YELLOW, GREEN];
  const hi = ["#FF9A9D", "#FFE27A", "#7FDCA6"];
  return (
    <div style={{ position: "relative", width: 190 * size, padding: `${26 * size}px 0`, borderRadius: 60 * size, background: "linear-gradient(180deg, #3A3A3A, #141413)", border: `${7 * size}px solid #2B2B2B`, boxShadow: `0 ${12 * size}px 0 #000, 0 ${30 * size}px ${50 * size}px rgba(0,0,0,0.25), inset 0 ${4 * size}px 0 rgba(255,255,255,0.18)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 * size, overflow: "hidden" }}>
      {cols.map((c, i) => {
        const on = lit === i;
        return (
          <div key={i} style={{ width: lamp, height: lamp, borderRadius: "50%", background: on ? `radial-gradient(circle at 36% 30%, #FFFFFF 0%, ${hi[i]} 18%, ${c} 62%)` : `radial-gradient(circle at 36% 30%, #5A5A5A, #262626 70%)`, boxShadow: on ? `0 0 ${50 * glow * size}px ${18 * glow * size}px ${c}AA, inset 0 -${6 * size}px 0 rgba(0,0,0,0.25)` : `inset 0 ${4 * size}px ${8 * size}px rgba(0,0,0,0.5)`, transform: `scale(${on ? 1 + 0.04 * Math.sin(t * 8) * glow : 1})` }} />
        );
      })}
      <Sweep t={t} at={0.15} dur={0.9} />
    </div>
  );
};

/** Simple flat-ish gold coin. */
const Coin: React.FC<{ d: number }> = ({ d }) => (
  <div style={{ width: d, height: d * 0.42, position: "relative" }}>
    <div style={{ position: "absolute", left: 0, top: d * 0.1, width: d, height: d * 0.32, borderRadius: "50%", background: `repeating-linear-gradient(90deg, ${GOLD.lo} 0px, ${GOLD.mid} 3px, ${GOLD.deep} 5px, ${GOLD.lo} 7px)` }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: d, height: d * 0.32, borderRadius: "50%", background: `radial-gradient(ellipse at 38% 32%, ${GOLD.hi} 0%, ${GOLD.mid} 40%, ${GOLD.lo} 85%)`, boxShadow: `inset 0 0 0 ${d * 0.04}px ${GOLD.lo}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: d * 0.22, color: GOLD.lo }}>€</div>
  </div>
);

// ---------- 1 · Hook: risk bar + "Tage offen" 0 → 90, then the traffic light ----------
// b: pruefen ("prüfen", Ampel kommt)
export const KpHook: React.FC<KpProps> = ({ seconds = 3.5, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { pruefen: 2.3, ...b };
  return (
    <KpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const cntEnd = Math.min(B.pruefen - 0.25, 1.9);
        const days = Math.round(interpolate(t, [0.05, cntEnd], [0, 90], { ...clamp, easing: Easing.inOut(Easing.cubic) }));
        const risk = days / 90;
        const barCol = risk < 0.4 ? GREEN : risk < 0.75 ? YELLOW : RED;
        const phase2 = ramp(t, B.pruefen - 0.25, B.pruefen + 0.15, Easing.inOut(Easing.cubic));
        const ampA = soft(B.pruefen - 0.3, 11, 200);
        // scan R → Y → G quickly, then lock green ("vorher wissen")
        const sc = t - (B.pruefen - 0.1);
        const lit = sc < 0 ? -1 : sc < 0.14 ? 0 : sc < 0.28 ? 1 : sc < 0.42 ? 2 : sc < 0.56 ? 0 : sc < 0.7 ? 1 : 2;
        const glow = lit === 2 ? 0.7 + 0.3 * Math.sin(t * 7) : 0.6;
        return (
          <>
            {/* phase 1: invoice with counter + risk bar */}
            <div style={{ position: "absolute", inset: 0, opacity: 1 - phase2 * 0.85, transform: `translateX(${-phase2 * 230}px) scale(${1 - 0.25 * phase2})`, transformOrigin: "20% 60%" }}>
              <div style={{ position: "absolute", left: 90, top: 700, width: 900, borderRadius: 40, background: "#FFF", border: `6px solid ${th.line}`, boxShadow: `0 10px 0 #DDD3C4, 0 30px 60px rgba(0,0,0,0.12)`, padding: "30px 36px", boxSizing: "border-box", transform: `scale(${soft(-0.35, 12, 190)})` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: fonts.bold, fontSize: 40, color: th.ink }}>Rechnung</span>
                  <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: barCol, borderRadius: 999, padding: "6px 22px", boxShadow: `0 4px 0 rgba(0,0,0,0.18)` }}>offen</span>
                </div>
                <div style={{ marginTop: 26, fontFamily: fonts.semibold, fontSize: 30, color: th.dim }}>Zahlungsrisiko</div>
                <div style={{ marginTop: 12, height: 54, borderRadius: 27, background: "#EFE9DF", overflow: "hidden", position: "relative", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.08)" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${6 + risk * 94}%`, borderRadius: 27, background: `linear-gradient(90deg, ${GREEN}, ${risk > 0.4 ? YELLOW : GREEN} 55%, ${risk > 0.75 ? RED : YELLOW})`, boxShadow: `0 0 ${20 * risk}px ${barCol}88` }} />
                  <div style={{ position: "absolute", top: 0, bottom: 0, width: 90, left: `${((t * 70) % 140) - 20}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }} />
                </div>
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 430, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <div style={{ transform: "scale(0.9)" }}><SlotCounter t={t} from={0} to={90} start={0.05} dur={Math.max(0.6, cntEnd - 0.05)} th={th} seconds={seconds} /></div>
                <Chip text="Tage offen" k={soft(0.0, 12, 200)} size={34} />
              </div>
            </div>
            {/* phase 2: traffic light drops in */}
            <div style={{ position: "absolute", left: 460, top: 420, opacity: Math.min(1, ampA * 2), transform: `translateY(${(1 - ampA) * -500}px) scale(${0.9 + 0.1 * ampA})` }}>
              <Ampel lit={lit} glow={glow} size={0.8} t={t} />
              <Glint k={(t - B.pruefen - 0.62) / 0.35} size={120} x={130} y={330} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center", opacity: ramp(t, B.pruefen + 0.6, B.pruefen + 0.8) }}>
              <Chip text="✓ Vorher geprüft" k={soft(B.pruefen + 0.62, 10, 220)} bg={GREEN} color="#FFF" size={36} style={{ border: "none", boxShadow: "0 6px 0 #1E6E3F" }} />
            </div>
          </>
        );
      }}
    </KpSplit>
  );
};

// ---------- 2 · Offene Rechnung tut erst weh, wenn die Arbeit fertig ist ----------
// b: rechnung, arbeit, fertig
export const KpRechnung: React.FC<KpProps> = ({ seconds = 4, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { rechnung: 0.7, arbeit: 2.0, fertig: 3.0, ...b };
  return (
    <KpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const prog = interpolate(t, [0.1, B.fertig], [0.08, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
        const done = t > B.fertig;
        const [iy, isq] = drop(t, B.rechnung - 0.35, -600, 470, 6500);
        const stamp = soft(B.fertig + 0.15, 9, 260);
        return (
          <>
            {/* work progress */}
            <div style={{ position: "absolute", left: 90, top: 120, width: 900, borderRadius: 36, background: "#FFF", border: `6px solid ${done ? GREEN : th.line}`, boxShadow: `0 10px 0 ${done ? "#1E6E3F" : "#DDD3C4"}, 0 24px 50px rgba(0,0,0,0.1)`, padding: "26px 34px", boxSizing: "border-box", transform: `scale(${soft(-0.35, 12, 190) * (1 + 0.04 * bump(t, B.fertig, 0.5))})` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: fonts.bold, fontSize: 42, color: th.ink }}>Deine Arbeit</span>
                <span style={{ fontFamily: fonts.bold, fontSize: 46, color: done ? GREEN : th.accent }}>{Math.round(prog * 100)} %</span>
              </div>
              <div style={{ marginTop: 18, height: 46, borderRadius: 23, background: "#EFE9DF", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${prog * 100}%`, borderRadius: 23, background: done ? `linear-gradient(90deg, #5CCB8C, ${GREEN})` : `linear-gradient(90deg, #FF9C73, ${th.accent})` }} />
                <div style={{ position: "absolute", top: 0, bottom: 0, width: 80, left: `${((t * 80) % 140) - 20}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }} />
              </div>
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12, opacity: done ? 1 : 0 }}>
                <Check on={done ? 1 : 0} size={40} />
                <span style={{ fontFamily: fonts.bold, fontSize: 34, color: GREEN }}>fertig geliefert</span>
              </div>
            </div>
            {/* invoice drops in */}
            <div style={{ position: "absolute", left: 210, top: iy, width: 660, transform: `scaleY(${isq}) rotate(${-2 + Math.sin(t * 1.5) * 1.2}deg)`, transformOrigin: "50% 100%" }}>
              <div style={{ borderRadius: 32, background: "#FFF", border: `6px solid ${th.line}`, boxShadow: "0 10px 0 #DDD3C4, 0 30px 60px rgba(0,0,0,0.14)", padding: "26px 32px", boxSizing: "border-box", overflow: "hidden", position: "relative" }}>
                <div style={{ fontFamily: fonts.bold, fontSize: 38, color: th.ink }}>Rechnung</div>
                {[0.9, 0.6, 0.75].map((w, i) => <div key={i} style={{ height: 14, width: `${w * 100}%`, borderRadius: 7, background: "#E7E0D5", marginTop: 16 }} />)}
                <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: th.dim }}>Betrag</span>
                  <span style={{ fontFamily: serifItalic, fontSize: 70, color: th.ink }}>4.800 €</span>
                </div>
                <Sweep t={t} at={B.rechnung + 0.3} />
              </div>
              {/* OFFEN stamp after "fertig" */}
              <div style={{ position: "absolute", right: -20, top: -34, transform: `rotate(-12deg) scale(${t > B.fertig ? 2 - stamp : 0})`, opacity: t > B.fertig ? Math.min(1, stamp * 1.5) : 0, fontFamily: fonts.bold, fontSize: 64, color: RED, border: `8px solid ${RED}`, borderRadius: 20, padding: "4px 26px", background: "rgba(255,255,255,0.92)", letterSpacing: 4, boxShadow: `0 0 ${30 * bump(t, B.fertig + 0.2, 0.6)}px ${RED}` }}>OFFEN</div>
            </div>
            <div style={{ position: "absolute", right: 40, top: 950 }}><Chip text="Beispiel" k={soft(0.3, 12, 200)} size={24} /></div>
          </>
        );
      }}
    </KpSplit>
  );
};

// ---------- 3 · Schritt eins: Firmenname + Adresse in Claude, Websuche an ----------
// b: firma, adresse, websuche
export const KpSchritt1: React.FC<KpProps> = ({ seconds = 5, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { firma: 1.0, adresse: 2.2, websuche: 3.6, ...b };
  return (
    <KpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const win = soft(-0.3, 12, 170);
        const line1 = "Muster Bau GmbH";
        const line2 = "Hauptstraße 1, 12345 Musterstadt";
        const n1 = Math.floor(ramp(t, B.firma - 0.1, B.firma + 0.6, Easing.linear) * line1.length);
        const n2 = Math.floor(ramp(t, B.adresse - 0.1, B.adresse + 0.8, Easing.linear) * line2.length);
        const on = ramp(t, B.websuche, B.websuche + 0.25, Easing.inOut(Easing.cubic));
        return (
          <>
            <Rail active={1} t={t} y={90} />
            <div style={{ position: "absolute", left: 70, top: 230, width: 940, height: 690, borderRadius: 40, background: "#FFF", border: `6px solid ${th.line}`, boxShadow: "0 10px 0 #DDD3C4, 0 30px 60px rgba(0,0,0,0.12)", transform: `scale(${win})`, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 28px", borderBottom: `3px solid ${th.line}` }}>
                <ClaudeTile size={64} t={t} />
                <span style={{ fontFamily: fonts.bold, fontSize: 40, color: th.ink }}>Claude</span>
              </div>
              {/* fields */}
              {[{ label: "FIRMENNAME", text: line1.slice(0, n1), at: B.firma }, { label: "ADRESSE", text: line2.slice(0, n2), at: B.adresse }].map((fld, i) => {
                const a = soft(fld.at - 0.35, 11, 210);
                const active = t > fld.at - 0.1 && t < fld.at + 1.0;
                return (
                  <div key={i} style={{ position: "absolute", left: 30, right: 30, top: 130 + i * 170, height: 140, borderRadius: 26, border: `4px solid ${active ? th.accent : th.line}`, background: "#FFFCF8", padding: "16px 26px", boxSizing: "border-box", transform: `scale(${a})`, opacity: Math.min(1, a * 2), boxShadow: active ? `0 0 30px ${th.accent}44` : undefined }}>
                    <div style={{ fontFamily: fonts.bold, fontSize: 22, letterSpacing: 2, color: th.dim }}>{fld.label}</div>
                    <div style={{ fontFamily: fonts.semibold, fontSize: 40, color: th.ink, marginTop: 10, whiteSpace: "nowrap" }}>{fld.text}{active && Math.floor(t * 4) % 2 === 0 ? "|" : ""}</div>
                  </div>
                );
              })}
              {/* web search toggle */}
              <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, height: 150, borderRadius: 28, border: `4px solid ${on > 0.5 ? GREEN : th.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", transform: `scale(${soft(B.websuche - 0.5, 11, 210) * (1 + 0.05 * bump(t, B.websuche + 0.2, 0.4))})`, boxShadow: on > 0.5 ? `0 0 ${40 * on}px ${GREEN}55` : undefined, background: "#FFF" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 70, height: 70, borderRadius: "50%", border: `6px solid ${on > 0.5 ? GREEN : th.dim}`, position: "relative", boxSizing: "border-box" }}>
                    <div style={{ position: "absolute", left: "50%", top: -6, bottom: -6, width: 28, marginLeft: -14, borderRadius: "50%", border: `5px solid ${on > 0.5 ? GREEN : th.dim}`, boxSizing: "border-box" }} />
                    <div style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 5, marginTop: -2.5, background: on > 0.5 ? GREEN : th.dim }} />
                  </div>
                  <span style={{ fontFamily: fonts.bold, fontSize: 46, color: th.ink }}>Websuche</span>
                </div>
                <div style={{ width: 150, height: 80, borderRadius: 40, background: on > 0.5 ? `linear-gradient(180deg, #5CCB8C, ${GREEN})` : "#DDD6CB", position: "relative", boxShadow: on > 0.5 ? "0 5px 0 #1E6E3F" : "0 5px 0 #C6BBAA" }}>
                  <div style={{ position: "absolute", top: 8, left: 8 + on * 70, width: 64, height: 64, borderRadius: 32, background: "radial-gradient(circle at 35% 30%, #FFF, #EEE 70%)", boxShadow: "0 4px 8px rgba(0,0,0,0.25)" }} />
                </div>
                <Sweep t={t} at={B.websuche + 0.2} />
              </div>
            </div>
            {/* inquiry mail flies in at the start */}
            <div style={{ position: "absolute", right: 40, top: 950 }}><Chip text="Beispiel" k={soft(0.3, 12, 200)} size={24} /></div>
          </>
        );
      }}
    </KpSplit>
  );
};

// ---------- 4 · Schritt zwei: Claude sucht in vier Quellen ----------
// b: insolvenz, register, gf, lieferanten
export const KpSchritt2: React.FC<KpProps> = ({ seconds = 6, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { insolvenz: 0.8, register: 2.4, gf: 3.5, lieferanten: 4.8, ...b };
  const rows: { label: string; at: number; icon: string }[] = [
    { label: "Insolvenzbekanntmachungen", at: B.insolvenz, icon: "§" },
    { label: "Handelsregister", at: B.register, icon: "HR" },
    { label: "Wechsel Geschäftsführung", at: B.gf, icon: "GF" },
    { label: "Beschwerden von Lieferanten", at: B.lieferanten, icon: "!" },
  ];
  return (
    <KpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => (
        <>
          <Rail active={2} t={t} y={90} />
          {rows.map((r, i) => {
            const a = soft(-0.4 + i * 0.08, 11, 210);
            const pre = t < r.at - 0.1;
            const scanning = t > r.at - 0.1 && t < r.at + 0.7;
            const done = t >= r.at + 0.7;
            const y = 230 + i * 170;
            return (
              <div key={i} style={{ position: "absolute", left: 60, top: y, width: 960, height: 145, borderRadius: 32, background: "#FFF", border: `6px solid ${scanning ? th.accent : done ? GREEN : th.line}`, boxShadow: `0 8px 0 ${scanning ? "#C9471C" : done ? "#1E6E3F" : "#DDD3C4"}, 0 20px 40px rgba(0,0,0,0.1), 0 0 ${scanning ? 30 : 0}px ${th.accent}66`, display: "flex", alignItems: "center", gap: 24, padding: "0 26px", boxSizing: "border-box", transform: `translateX(${(1 - a) * 1000}px) scale(${1 + 0.03 * bump(t, r.at + 0.7, 0.4)})`, overflow: "hidden" }}>
                <div style={{ width: 88, height: 88, borderRadius: 24, background: `radial-gradient(circle at 35% 28%, #FFB08F, ${th.accent} 70%)`, boxShadow: "inset 0 -5px 0 rgba(0,0,0,0.18), inset 0 4px 0 rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: r.icon.length > 1 ? 36 : 50, color: "#FFF", flexShrink: 0 }}>{r.icon}</div>
                <span style={{ flex: 1, fontFamily: fonts.bold, fontSize: 42, color: pre ? th.dim : th.ink, opacity: pre ? 0.55 : 1, letterSpacing: -1, whiteSpace: "nowrap" }}>{r.label}</span>
                {scanning ? (
                  <div style={{ width: 60, height: 60, borderRadius: "50%", border: `7px solid ${th.accentSoft}`, borderTopColor: th.accent, transform: `rotate(${t * 720}deg)`, boxSizing: "border-box", flexShrink: 0 }} />
                ) : (
                  <Check on={done ? 1 : 0} size={60} />
                )}
                {scanning ? <div style={{ position: "absolute", top: 0, bottom: 0, width: 160, left: `${interpolate(t, [r.at - 0.1, r.at + 0.7], [-20, 110], clamp)}%`, background: `linear-gradient(90deg, transparent, ${th.accentSoft}AA, transparent)` }} /> : null}
              </div>
            );
          })}
          {/* magnifier travelling to the active row */}
          {(() => {
            const idx = rows.reduce((acc, r, i) => (t >= r.at - 0.2 ? i : acc), 0);
            const yy = 230 + idx * 170 + 20;
            const k = soft(rows[idx].at - 0.2, 12, 180);
            const prevY = 230 + Math.max(0, idx - 1) * 170 + 20;
            const my = idx === 0 ? yy : prevY + (yy - prevY) * k;
            return (
              <div style={{ position: "absolute", left: 830 + Math.sin(t * 5) * 20, top: my - 40, zIndex: 40, transform: `rotate(-20deg) scale(${soft(0.2, 12, 200)})` }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", border: "14px solid #1B1B1B", background: "rgba(255,255,255,0.55)", boxShadow: "0 8px 20px rgba(0,0,0,0.25)", boxSizing: "border-box" }} />
                <div style={{ position: "absolute", left: 40, top: 86, width: 18, height: 60, borderRadius: 9, background: "#1B1B1B" }} />
              </div>
            );
          })()}
        </>
      )}
    </KpSplit>
  );
};

// ---------- 5 · Schritt drei (Trick): Ampel + was du verlangen solltest, Gelb = Anzahlung ----------
// b: ampel, verlangen, gelb, anzahlung
export const KpSchritt3: React.FC<KpProps> = ({ seconds = 7, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { ampel: 0.8, verlangen: 2.4, gelb: 4.0, anzahlung: 5.0, ...b };
  const recs = [
    { c: GREEN, dark: "#1E6E3F", title: "Grün", text: "Normales Zahlungsziel" },
    { c: YELLOW, dark: "#B08400", title: "Gelb", text: "Anzahlung vor Start" },
    { c: RED, dark: "#A8262A", title: "Rot", text: "Vorkasse oder absagen" },
  ];
  return (
    <KpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const ampA = soft(-0.35, 11, 200);
        // scanning lights before "Gelb", then lock on yellow
        const s = t - 0.15;
        const lit = t >= B.gelb - 0.1 ? 1 : s < 0 ? -1 : [0, 1, 2][Math.floor(s / (t > B.verlangen ? 0.22 : 0.4)) % 3];
        const glow = t >= B.gelb - 0.1 ? 0.75 + 0.25 * Math.sin(t * 7) : 0.6;
        const focus = t >= B.gelb - 0.1 ? 1 : -1;
        return (
          <>
            <Rail active={3} t={t} y={90} />
            <div style={{ position: "absolute", left: 60, top: 240, transform: `translateY(${(1 - ampA) * -600}px) scale(${0.86 + 0.06 * bump(t, B.gelb, 0.5)})`, transformOrigin: "50% 0" }}>
              <Ampel lit={lit} glow={glow} size={0.95} t={t} />
            </div>
            {recs.map((r, i) => {
              const a = soft(B.ampel - 0.2 + i * 0.22, 11, 210);
              const on = focus === i;
              const dim = focus >= 0 && !on ? 0.45 : 0;
              return (
                <div key={i} style={{ position: "absolute", left: 300, top: 260 + i * 200 - (on ? 10 : 0), width: 730, height: 170, borderRadius: 34, background: "#FFF", border: `7px solid ${r.c}`, boxShadow: `0 9px 0 ${r.dark}, 0 20px 40px rgba(0,0,0,0.1), 0 0 ${on ? 50 * glow : 0}px ${r.c}AA`, display: "flex", alignItems: "center", gap: 22, padding: "0 26px", boxSizing: "border-box", transform: `translateX(${(1 - a) * 900}px) scale(${on ? 1.04 : 1})`, opacity: 1 - dim * 0.5, filter: dim ? `saturate(${1 - dim})` : undefined, overflow: "hidden", zIndex: on ? 10 : 1 }}>
                  <div style={{ width: 70, height: 70, borderRadius: "50%", background: `radial-gradient(circle at 36% 30%, #FFF 0%, ${r.c} 55%)`, boxShadow: `inset 0 -5px 0 rgba(0,0,0,0.2)`, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: fonts.bold, fontSize: 28, color: r.dark, letterSpacing: 1 }}>{r.title.toUpperCase()}</div>
                    <div style={{ fontFamily: fonts.bold, fontSize: 44, color: th.ink, letterSpacing: -1, whiteSpace: "nowrap" }}>{r.text}</div>
                  </div>
                  {on ? <Sweep t={t} at={B.gelb} /> : null}
                </div>
              );
            })}
            {/* coins drop onto the yellow card on "Anzahlung" */}
            {Array.from({ length: 5 }).map((_, j) => {
              const at = B.anzahlung - 0.2 + j * 0.16;
              if (t < at) return null;
              const y1 = 560 - j * 24;
              const [y] = drop(t, at, -150, y1, 6500);
              return <div key={j} style={{ position: "absolute", left: 900 + (j % 2 ? 6 : -6), top: y, zIndex: 30 + j }}><Coin d={96} /></div>;
            })}
            <Glint k={(t - landAt(B.anzahlung + 0.44, -150, 464, 6500)) / 0.35} size={120} x={950} y={470} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center" }}>
              <Chip text="Empfehlung von Claude" k={soft(B.verlangen, 12, 200)} size={30} />
            </div>
          </>
        );
      }}
    </KpSplit>
  );
};

// ---------- 6 · Handelsregister + Insolvenzbekanntmachungen kostenlos ----------
// b: kostenlos, wo
export const KpKostenlos: React.FC<KpProps> = ({ seconds = 3.5, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { kostenlos: 0.5, wo: 2.0, ...b };
  const portals = ["handelsregister.de", "insolvenzbekanntmachungen.de"];
  return (
    <KpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: fonts.bold, fontSize: 84, color: th.ink, letterSpacing: -2, transform: `scale(${soft(B.kostenlos - 0.2, 10, 220)})` }}>
            <Em color={GREEN}>kostenlos</Em>
          </div>
          {portals.map((p, i) => {
            const a = soft(-0.3 + i * 0.15, 11, 200);
            const priceOff = ramp(t, B.kostenlos + 0.1 + i * 0.25, B.kostenlos + 0.4 + i * 0.25);
            return (
              <div key={p} style={{ position: "absolute", left: 70, top: 310 + i * 270, width: 940, height: 230, borderRadius: 38, background: "#FFF", border: `6px solid ${priceOff > 0.5 ? GREEN : th.line}`, boxShadow: `0 10px 0 ${priceOff > 0.5 ? "#1E6E3F" : "#DDD3C4"}, 0 24px 50px rgba(0,0,0,0.1)`, padding: "28px 34px", boxSizing: "border-box", transform: `translateX(${(1 - a) * (i ? 900 : -900)}px)`, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ display: "flex", gap: 8 }}>{[RED, YELLOW, GREEN].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c, opacity: 0.6 }} />)}</div>
                  <div style={{ flex: 1, height: 64, borderRadius: 32, background: "#F4EFE7", display: "flex", alignItems: "center", padding: "0 26px", fontFamily: fonts.semibold, fontSize: 36, color: th.ink, whiteSpace: "nowrap" }}>{p}</div>
                </div>
                <div style={{ marginTop: 26, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: th.dim }}>Abruf</span>
                  <span style={{ position: "relative", fontFamily: fonts.bold, fontSize: 64, color: priceOff > 0.5 ? GREEN : th.ink, transform: `scale(${1 + 0.15 * bump(t, B.kostenlos + 0.4 + i * 0.25, 0.4)})`, display: "inline-block" }}>{priceOff > 0.5 ? "0 €" : "? €"}</span>
                </div>
                <Sweep t={t} at={B.kostenlos + 0.4 + i * 0.25} />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center" }}>
            <Chip text="Links stehen im Guide" k={soft(B.wo, 11, 210)} bg={th.accent} color="#FFF" size={32} style={{ border: "none", boxShadow: "0 6px 0 #C9471C" }} />
          </div>
        </>
      )}
    </KpSplit>
  );
};

// ---------- 7 · CTA: Guide + Kommentiere KUNDE ----------
// b: guide, kommentiere
export const KpCta: React.FC<KpProps> = ({ seconds = 4, avatar, panelFrac, b = {} }) => {
  const soft = useSoft();
  const B = { guide: 0.8, kommentiere: 2.2, ...b };
  return (
    <KpSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
      {(t) => {
        const g = soft(-0.35, 11, 170);
        const word = "KUNDE";
        const n = Math.floor(ramp(t, B.kommentiere, B.kommentiere + 0.5, Easing.linear) * word.length);
        const sent = soft(B.kommentiere + 0.65, 10, 220);
        return (
          <>
            <div style={{ position: "absolute", left: 80, top: 330, width: 420, height: 560, transform: `rotate(${-5 + Math.sin(t * 1.6) * 2}deg) scale(${g})`, borderRadius: 30, background: "linear-gradient(160deg, #1D1D1C, #0A0A0A)", border: "6px solid #2B2B2B", boxShadow: `0 10px 0 #000, 0 30px 60px rgba(0,0,0,0.25), 0 0 ${40 * bump(t, B.guide, 0.8)}px ${th.accent}`, padding: 30, boxSizing: "border-box", overflow: "hidden" }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 20, letterSpacing: 3, color: th.accent }}>GUIDE</div>
              <div style={{ fontFamily: fonts.bold, fontSize: 48, color: "#FFF", marginTop: 14, lineHeight: 1.05 }}>Kunden vorher prüfen</div>
              <div style={{ marginTop: 24, transform: "scale(0.42)", transformOrigin: "0 0", height: 200 }}><Ampel lit={1} glow={0.6} size={0.5} t={t} /></div>
              {["Nachricht an Claude", "Quellen mit Links", "Ampel-Regeln"].map((x, i) => (
                <div key={x} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: i ? 14 : -40, opacity: ramp(t, B.guide + 0.2 + i * 0.25, B.guide + 0.4 + i * 0.25) }}>
                  <Check on={ramp(t, B.guide + 0.2 + i * 0.25, B.guide + 0.4 + i * 0.25) * 1.0001} size={30} color={th.accent} />
                  <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: "#FFF", whiteSpace: "nowrap" }}>{x}</span>
                </div>
              ))}
              <Sweep t={t} at={B.guide + 0.1} dur={0.8} />
            </div>
            <div style={{ position: "absolute", left: 540, top: 480, width: 480, transform: `scale(${soft(B.kommentiere - 0.5, 11, 200)})` }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 36, color: th.ink, marginBottom: 14 }}>Kommentiere</div>
              <div style={{ height: 120, borderRadius: 60, background: "#FFF", border: `5px solid ${th.accent}`, boxShadow: `0 8px 0 #C9471C, 0 0 ${30 * ramp(t, B.kommentiere, B.kommentiere + 0.4)}px ${th.accent}88`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 0 34px" }}>
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
    </KpSplit>
  );
};
