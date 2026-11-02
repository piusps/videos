import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { AvatarSrc, Logo, serifItalic } from "../components/PanelKit";
import { DopamineHookProps, DopamineHookScene, HOOK_THEMES, SlotCounter } from "../components/HookKit";

// @florentgpt · "Ist dein Rabatt echt?" (runs/gpt-rabatt-echt, Slot 2026-10-09 20:00).
// Dopamin-Split-B-Rolls (Henri 2026-10-08): panel on top (panelFrac 0.52), speaker below, caption pill on the seam,
// glossy casino-style objects on white/green, gold only for money. No shop/manufacturer names, no emojis.
// All prices are examples ("Beispiel"). Beat times come in via props `b` (seconds relative to the window start).

const th = HOOK_THEMES.gpt;
const HW = 1080;
const HH = 1920;
const PH = Math.round(HH * 0.52); // 998
const RED = "#E5484D";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const bt = (b: number[] | undefined, i: number, d: number) => (b && b[i] !== undefined ? b[i] : d);
const bump = (t: number, at: number, d: number) => (t < at || t > at + d ? 0 : Math.sin(Math.PI * Math.sqrt((t - at) / d)) * (1 - (t - at) / d) * 1.6);
const resolveSrc = (s: string) => (/^(https?:|file:)/.test(s) ? s : staticFile(s));

export type RbProps = { seconds?: number; avatar: AvatarSrc; b?: number[] };

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
/** spring 0→1 at second `at` (small overshoot). */
const useSp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (at: number, damping = 13, stiffness = 180) => spring({ frame: frame - Math.round(at * fps), fps, config: { damping, stiffness, mass: 0.7 } });
};

// ---------- Split wrapper: panel on top, speaker below; last 0.35 s panel fades, speaker grows to full frame ----------

const Split: React.FC<{ avatar: AvatarSrc; children: React.ReactNode }> = ({ avatar, children }) => {
  const t = useT();
  const { fps, durationInFrames } = useVideoConfig();
  const seconds = durationInFrames / fps;
  const k = ez(t, seconds - 0.35, seconds, Easing.inOut(Easing.cubic));
  const s0 = avatar.scale ?? 1.0;
  const f = avatar.focus ?? { x: 0.52, y: 0.45 };
  const h0 = HH - PH;
  const vw0 = HW * s0, vh0 = HH * s0;
  const left0 = Math.min(0, Math.max(HW - vw0, HW / 2 - f.x * vw0));
  const top0 = Math.min(0, Math.max(h0 - vh0, h0 * (avatar.faceAt ?? 0.42) - f.y * vh0));
  const vw = vw0 + (HW - vw0) * k, vh = vh0 + (HH - vh0) * k;
  const cp = t / seconds;
  const dx = Math.sin(t * 0.9) * 8;
  const dy = -cp * 12;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: left0 * (1 - k), top: (PH + top0) * (1 - k), width: vw, height: vh }}>
        <OffthreadVideo src={resolveSrc(avatar.src)} startFrom={Math.round(avatar.startSec * fps)} muted style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: HW, height: PH, overflow: "hidden", background: th.bg, boxShadow: `0 10px 30px rgba(0,0,0,${0.25 * (1 - k)})`, opacity: 1 - k, transform: `scale(${1 + 0.05 * k})`, transformOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", inset: -80, backgroundImage: `radial-gradient(${th.grid} 2px, transparent 2.5px)`, backgroundSize: "36px 36px", transform: `translate(${(t * 14) % 36}px, ${(t * 22) % 36}px)` }} />
        <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", left: 300 + Math.sin(t * 0.7) * 160, top: 100 + Math.cos(t * 0.5) * 100, background: `radial-gradient(circle, ${th.accentSoft}AA 0%, transparent 65%)` }} />
        <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) scale(${1 + 0.05 * cp})`, transformOrigin: "50% 55%" }}>{children}</AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Glossy pieces (casino/slot UI: bevel, thick rim, gloss sweep, soft shadow) ----------

const Gloss: React.FC<{ t: number; speed?: number; off?: number }> = ({ t, speed = 0.7, off = 0 }) => {
  const g = ((t * speed + off) % 1.6) / 1.6;
  return <div style={{ position: "absolute", top: "-30%", bottom: "-30%", width: "35%", left: `${-50 + g * 190}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", transform: "rotate(18deg)", pointerEvents: "none" }} />;
};

/** Chunky bevel button / badge. */
const Chunk: React.FC<{ t: number; color: string; dark: string; children: React.ReactNode; style?: React.CSSProperties; rim?: string; glossOff?: number }> = ({ t, color, dark, children, style, rim, glossOff = 0 }) => (
  <div style={{ position: "relative", overflow: "hidden", borderRadius: 30, background: `linear-gradient(180deg, ${color} 0%, ${dark} 100%)`, border: `5px solid ${rim ?? dark}`, boxShadow: `0 16px 34px ${dark}55, inset 0 6px 0 rgba(255,255,255,0.35), inset 0 -8px 0 rgba(0,0,0,0.18)`, color: "#fff", fontFamily: fonts.bold, ...style }}>
    {children}
    <Gloss t={t} off={glossOff} />
  </div>
);

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: th.card, borderRadius: 30, border: `2px solid ${th.line}`, boxShadow: "0 20px 44px rgba(0,0,0,0.09)", ...style }}>{children}</div>
);

/** Price with an animated red strike line (drawn from `at`). */
const Struck: React.FC<{ t: number; at: number; text: string; size: number; color?: string }> = ({ t, at, text, size, color = th.dim }) => {
  const p = ez(t, at, at + 0.3, Easing.inOut(Easing.cubic));
  return (
    <span style={{ position: "relative", display: "inline-block", fontFamily: fonts.bold, fontSize: size, color, lineHeight: 1 }}>
      {text}
      <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: Math.max(5, size * 0.09), borderRadius: 99, background: RED, transformOrigin: "0 50%", transform: `scaleX(${p}) rotate(-6deg)` }} />
    </span>
  );
};

/** Drawn check / cross in a glossy round badge. */
const Mark: React.FC<{ t: number; at: number; ok: boolean; size?: number }> = ({ t, at, ok, size = 96 }) => {
  const sp = useSp();
  const a = sp(at, 11, 220);
  const p = ez(t, at + 0.1, at + 0.4);
  const c = ok ? th.accent : RED;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${ok ? "#4FE0B5" : "#FF8A8D"}, ${c} 60%, ${ok ? "#0B7A5F" : "#B8282D"})`, border: `5px solid ${ok ? "#0B7A5F" : "#B8282D"}`, boxShadow: `0 10px 24px ${c}66, inset 0 5px 0 rgba(255,255,255,0.35)`, transform: `scale(${a})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
        {ok ? <path d="M4 12.5 L10 18 L20 6" stroke="#fff" strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          : <>
            <path d="M6 6 L18 18" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p * 2)} />
            <path d="M18 6 L6 18" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, p * 2 - 1)} />
          </>}
      </svg>
    </div>
  );
};

const StepNo: React.FC<{ t: number; at: number; n: number; text: string; top?: number }> = ({ t, at, n, text, top = 50 }) => {
  const sp = useSp();
  const a = sp(at, 12, 200);
  return (
    <div style={{ position: "absolute", left: 60, top, display: "flex", alignItems: "center", gap: 20, transform: `translateX(${(1 - a) * -500}px)`, opacity: Math.min(1, a * 2), zIndex: 50 }}>
      <Chunk t={t} color="#2BC497" dark="#0B8A6A" style={{ width: 84, height: 84, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>{n}</Chunk>
      <span style={{ fontFamily: fonts.bold, fontSize: 56, color: th.ink, letterSpacing: -1 }}>{text}</span>
    </div>
  );
};

const Tag: React.FC<{ text: string; t: number; at: number; style?: React.CSSProperties }> = ({ text, t, at, style }) => {
  const sp = useSp();
  const a = sp(at, 12, 220);
  return <span style={{ display: "inline-block", fontFamily: fonts.semibold, fontSize: 26, color: th.ink, background: th.card, border: `1.5px solid ${th.line}`, borderRadius: 999, padding: "6px 18px", transform: `scale(${a})`, opacity: Math.min(1, a * 2), ...style }}>{text}</span>;
};

/** Red click frame (ChatGPT style). */
const RedBox: React.FC<{ x: number; y: number; w: number; h: number; t: number; a: number; b: number; r?: number }> = ({ x, y, w, h, t, a, b, r = 22 }) => {
  if (t < a || t > b) return null;
  const k = ez(t, a, a + 0.15);
  return <div style={{ position: "absolute", left: x - 8 * (1 - k), top: y - 8 * (1 - k), width: w + 16 * (1 - k), height: h + 16 * (1 - k), border: `6px solid ${RED}`, borderRadius: r, boxShadow: `0 0 0 8px ${RED}26`, opacity: k, zIndex: 80 }} />;
};

/** Simple headphone drawing (generic product, no brand). */
const Headphones: React.FC<{ size: number; t: number }> = ({ size, t }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${Math.sin(t * 2) * 4}deg)`, filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.18))" }}>
    <defs>
      <linearGradient id="hp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4A4A4A" /><stop offset="1" stopColor="#151515" /></linearGradient>
      <linearGradient id="hc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3DD6A8" /><stop offset="1" stopColor="#0B8A6A" /></linearGradient>
    </defs>
    <path d="M18 58 C18 22, 82 22, 82 58" stroke="url(#hp)" strokeWidth={9} fill="none" strokeLinecap="round" />
    <rect x={8} y={50} width={22} height={34} rx={10} fill="url(#hc)" stroke="#0B7A5F" strokeWidth={2.5} />
    <rect x={70} y={50} width={22} height={34} rx={10} fill="url(#hc)" stroke="#0B7A5F" strokeWidth={2.5} />
    <rect x={11} y={53} width={6} height={18} rx={3} fill="rgba(255,255,255,0.45)" />
    <rect x={73} y={53} width={6} height={18} rx={3} fill="rgba(255,255,255,0.45)" />
  </svg>
);

// ---------- 1 · Hook: Dopamin-Split, price counter rolls from the struck-through UVP down ----------

export type RbHookProps = DopamineHookProps & { uvp?: string; strikeAt?: number };
export const RbHook: React.FC<RbHookProps> = (props) => {
  const t = useT();
  const sp = useSp();
  const seconds = props.seconds ?? 4.5;
  const k = ez(t, seconds - 0.35, seconds, Easing.inOut(Easing.cubic));
  const a = sp(0.25, 12, 170);
  const sAt = props.strikeAt ?? 0.55;
  return (
    <AbsoluteFill>
      <DopamineHookScene {...props} counterLabel="" />
      {/* chip under the counter: "UVP 199 €" gets struck through, "Beispiel" */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 425 + 133 + 16, display: "flex", justifyContent: "center", opacity: 1 - k, zIndex: 500 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: th.card, border: `2px solid ${th.line}`, borderRadius: 999, padding: "8px 26px", boxShadow: "0 8px 18px rgba(0,0,0,0.08)", transform: `translateX(${(1 - a) * -700}px) scale(${1 + 0.08 * bump(t, sAt, 0.4)})` }}>
          <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: th.dim }}>statt UVP</span>
          <Struck t={t} at={sAt} text={props.uvp ?? "199 €"} size={38} color={th.ink} />
          <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: th.dim, borderLeft: `2px solid ${th.line}`, paddingLeft: 14 }}>Beispiel</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2 · 30 Tage: echte Preissenkung muss sich am niedrigsten Preis der letzten 30 Tage messen ----------
// b = [echten Preissenkung, niedrigsten, dreißig Tage, messen]
const PRICES = [149, 149, 145, 149, 139, 139, 135, 139, 145, 149, 149, 142, 139, 129, 129, 135, 139, 145, 149, 149, 145, 139, 135, 129, 125, 129, 135, 139, 145, 149];
export const RbDreissig: React.FC<RbProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [e, n, d, m] = [bt(b, 0, 0.2), bt(b, 1, 1.4), bt(b, 2, 2.3), bt(b, 3, 3.0)];
  const W = 620, H = 440, x0 = 40, y0 = 40;
  const minV = 115, maxV = 155;
  const px = (i: number) => x0 + (i / 29) * (W - 80);
  const py = (v: number) => y0 + (1 - (v - minV) / (maxV - minV)) * (H - 80);
  const draw = ez(t, e + 0.2, n + 0.2, Easing.inOut(Easing.cubic));
  const path = PRICES.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
  const lowI = PRICES.indexOf(Math.min(...PRICES));
  const lowA = sp(n + 0.25, 10, 220);
  const head = Math.min(29, Math.round(draw * 29));
  const msr = ez(t, m, m + 0.4);
  return (
    <Split avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 60, transform: `scale(${sp(e, 12, 200)})`, transformOrigin: "0 50%" }}>
        <Chunk t={t} color="#2BC497" dark="#0B8A6A" style={{ padding: "14px 30px", fontSize: 44 }}>Echte Preissenkung</Chunk>
      </div>
      {/* 30 day dots (calendar strip) */}
      <div style={{ position: "absolute", left: 60, top: 185, display: "grid", gridTemplateColumns: "repeat(15, 52px)", gap: 10 }}>
        {PRICES.map((_, i) => {
          const at = e + 0.15 + i * 0.035;
          const a = sp(at, 12, 260);
          const low = i === lowI && t > n + 0.25;
          return <div key={i} style={{ width: 52, height: 52, borderRadius: 14, background: low ? "linear-gradient(180deg,#FFE58A,#E0A92E)" : i <= head ? `linear-gradient(180deg, #4FE0B5, ${th.accent})` : th.line, border: low ? "3px solid #B47A12" : "none", boxShadow: low ? "0 0 22px 6px rgba(242,193,78,0.6)" : "inset 0 3px 0 rgba(255,255,255,0.3)", transform: `scale(${a * (1 + (low ? 0.15 * bump(t, n + 0.25, 0.5) : 0))})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 20, color: i <= head || low ? "#fff" : th.dim }}>{i + 1}</div>;
        })}
      </div>
      {/* counter 30 Tage */}
      <div style={{ position: "absolute", left: 690, top: 330, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 40 }}>
        <div style={{ transform: "scale(0.85)" }}><SlotCounter t={t} from={0} to={30} start={e + 0.1} dur={Math.max(0.8, d - e - 0.2)} th={th} seconds={4} /></div>
        <div style={{ fontFamily: fonts.bold, fontSize: 52, color: th.ink, marginTop: -6, transform: `scale(${1 + 0.1 * bump(t, d, 0.4)})` }}>Tage</div>
      </div>
      {/* price line chart */}
      <Card style={{ position: "absolute", left: 50, top: 330, width: W, height: H + 110 }}>
        <div style={{ position: "absolute", left: 30, top: 20, fontFamily: fonts.semibold, fontSize: 28, color: th.dim }}>Preis im Shop · Beispiel</div>
        <svg width={W} height={H + 120} style={{ position: "absolute", left: 0, top: 50 }}>
          {[0.25, 0.5, 0.75].map((q) => <line key={q} x1={30} x2={W - 30} y1={y0 + q * (H - 80)} y2={y0 + q * (H - 80)} stroke={th.line} strokeWidth={2} />)}
          <path d={path} stroke={th.accent} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          {draw > 0.02 ? <circle cx={px(head)} cy={py(PRICES[head])} r={11} fill={th.accent} stroke="#fff" strokeWidth={4} /> : null}
          {/* lowest price line, the shop has to measure itself against it */}
          <line x1={30} x2={30 + (W - 60) * msr} y1={py(PRICES[lowI])} y2={py(PRICES[lowI])} stroke="#C8901E" strokeWidth={5} strokeDasharray="14 10" />
        </svg>
        <div style={{ position: "absolute", left: px(lowI) - 20, top: 50 + py(PRICES[lowI]) + 18, transform: `scale(${lowA})`, transformOrigin: "20px 0" }}>
          <div style={{ background: "linear-gradient(180deg,#FFE58A,#E0A92E)", border: "4px solid #B47A12", borderRadius: 18, padding: "6px 16px", fontFamily: fonts.bold, fontSize: 30, color: "#5A3A00", whiteSpace: "nowrap", boxShadow: "0 8px 18px rgba(180,122,18,0.35)" }}>niedrigster Preis</div>
        </div>
        <div style={{ position: "absolute", right: 24, bottom: 18, opacity: msr, fontFamily: fonts.bold, fontSize: 30, color: th.ink }}>Rabatt zählt ab hier</div>
      </Card>
    </Split>
  );
};

// ---------- 3 · UVP-Vergleich: 30-Tage-Regel gilt nicht ----------
// b = [Vergleich, unverbindlichen Preisempfehlung, Herstellers, gilt das nicht]
export const RbUvp: React.FC<RbProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [v, u, h, g] = [bt(b, 0, 0.1), bt(b, 1, 0.8), bt(b, 2, 1.8), bt(b, 3, 2.4)];
  const rowA = sp(v, 12, 170), rowB = sp(u, 12, 170);
  const Row: React.FC<{ a: number; top: number; title: string; sub: string; ok: boolean; at: number; hi?: boolean }> = ({ a, top, title, sub, ok, at, hi }) => (
    <div style={{ position: "absolute", left: 60, top, width: 960, transform: `translateX(${(1 - a) * 1100}px) rotate(${(1 - a) * 5}deg)` }}>
      <Card style={{ padding: "28px 34px", display: "flex", alignItems: "center", gap: 28, border: hi ? `4px solid ${RED}` : `2px solid ${th.line}` }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 48, color: th.ink, letterSpacing: -1 }}>{title}</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: ok ? th.accent : RED, marginTop: 6 }}>{sub}</div>
        </div>
        <Mark t={t} at={at} ok={ok} size={110} />
      </Card>
    </div>
  );
  return (
    <Split avatar={avatar}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: fonts.bold, fontSize: 60, color: th.ink, letterSpacing: -1, opacity: ez(t, 0, 0.2) }}>30-Tage-Regel</div>
      <Row a={rowA} top={180} title="Shop senkt eigenen Preis" sub="Regel gilt" ok at={v + 0.3} />
      <Row a={rowB} top={410} title="Vergleich mit der UVP" sub="Regel gilt nicht" ok={false} at={g} hi={t > g} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 680, display: "flex", justifyContent: "center", gap: 18 }}>
        <Tag t={t} at={u + 0.2} text="UVP = unverbindliche Preisempfehlung" style={{ fontSize: 38, padding: "10px 26px" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center" }}>
        <Tag t={t} at={h} text="vom Hersteller, nicht vom Shop" style={{ fontSize: 38, padding: "10px 26px" }} />
      </div>
    </Split>
  );
};

// ---------- 4 · minus 40 % = ganz normaler Preis ----------
// b = [minus vierzig Prozent, ganz normale Preis]
export const RbMinus: React.FC<RbProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [mz, np] = [bt(b, 0, 0.3), bt(b, 1, 1.8)];
  const badge = sp(mz, 9, 200);
  const shops = ["Shop A", "Shop B", "Shop C"];
  const vals = [119, 118, 121];
  return (
    <Split avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 70, transform: `scale(${badge}) rotate(${-8 + (1 - badge) * 30}deg)`, transformOrigin: "50% 50%", zIndex: 30 }}>
        <Chunk t={t} color="#FF6B6E" dark="#C42D32" rim="#9E1F24" style={{ width: 440, height: 220, borderRadius: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 112, letterSpacing: -4, whiteSpace: "nowrap" }}>−40 %</Chunk>
      </div>
      <div style={{ position: "absolute", left: 580, top: 95, opacity: ez(t, mz + 0.3, mz + 0.5) }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: th.dim }}>UVP</div>
        <Struck t={t} at={mz + 0.45} text="199 €" size={64} color={th.dim} />
        <div style={{ fontFamily: fonts.bold, fontSize: 110, color: th.ink, letterSpacing: -4, lineHeight: 1.05, transform: `scale(${1 + 0.1 * bump(t, mz + 0.6, 0.4)})`, transformOrigin: "0 50%" }}>119 €</div>
      </div>
      <Card style={{ position: "absolute", left: 60, top: 370, width: 960, padding: "18px 34px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: th.dim }}>Gleiches Modell, andere Shops</span>
          <Tag t={t} at={mz + 0.8} text="Beispiel" />
        </div>
        {shops.map((s, i) => {
          const at = mz + 0.8 + i * 0.3;
          const a = sp(at, 12, 220);
          return (
            <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: `2px solid ${th.line}`, transform: `translateX(${(1 - a) * 600}px)`, opacity: Math.min(1, a * 2) }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 42, color: th.ink }}>{s}</span>
              <span style={{ fontFamily: serifItalic, fontSize: 60, color: th.ink, transform: `scale(${1 + 0.12 * bump(t, at + 0.1, 0.4)})` }}>{vals[i]} €</span>
            </div>
          );
        })}
      </Card>
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, display: "flex", justifyContent: "center", transform: `scale(${sp(np, 9, 220)}) rotate(-3deg)` }}>
        <Chunk t={t} color="#2BC497" dark="#0B8A6A" style={{ padding: "14px 36px", fontSize: 50 }}>= ganz normaler Preis</Chunk>
      </div>
    </Split>
  );
};

// ---------- 5 · Erstens: Screenshot von der Produktseite ----------
// b = [So prüfst du es, Erstens, Screenshot, Produktseite]
const ProductPage: React.FC<{ t: number; w: number }> = ({ t, w }) => (
  <div style={{ width: w, background: "#fff", borderRadius: 28, overflow: "hidden", border: `2px solid ${th.line}` }}>
    <div style={{ height: 56, background: "#F4F4F4", display: "flex", alignItems: "center", padding: "0 20px", gap: 10 }}>
      <div style={{ flex: 1, height: 30, borderRadius: 15, background: "#fff", border: `1.5px solid ${th.line}`, fontFamily: fonts.medium, fontSize: 18, color: th.dim, display: "flex", alignItems: "center", paddingLeft: 14 }}>shop.example/kopfhoerer</div>
    </div>
    <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg,#FAFAFA,#F0F0F0)" }}><Headphones size={190} t={t} /></div>
    <div style={{ padding: "18px 24px 24px" }}>
      <div style={{ fontFamily: fonts.bold, fontSize: 30, color: th.ink }}>Kopfhörer, Modell X</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
        <span style={{ fontFamily: fonts.medium, fontSize: 22, color: th.dim }}>UVP</span>
        <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: th.dim, textDecoration: "line-through", textDecorationColor: RED, textDecorationThickness: 3 }}>199 €</span>
        <span style={{ fontFamily: fonts.bold, fontSize: 22, color: "#fff", background: RED, borderRadius: 10, padding: "3px 10px" }}>−40 %</span>
      </div>
      <div style={{ fontFamily: fonts.bold, fontSize: 52, color: RED, marginTop: 4 }}>119 €</div>
      <div style={{ marginTop: 12, height: 56, borderRadius: 28, background: "#FFC83D", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 24, color: "#3A2A00" }}>In den Warenkorb</div>
    </div>
  </div>
);

export const RbScreenshot: React.FC<RbProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [so, er, sc] = [bt(b, 0, 0.0), bt(b, 1, 0.9), bt(b, 2, 1.8)];
  const phoneA = sp(er, 12, 160);
  const flash = bump(t, sc, 0.35);
  const shrink = ez(t, sc + 0.35, sc + 0.8, Easing.inOut(Easing.cubic));
  return (
    <Split avatar={avatar}>
      {t < er ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", transform: `scale(${sp(so, 9, 220)})` }}>
          <Chunk t={t} color="#2BC497" dark="#0B8A6A" style={{ padding: "24px 56px", fontSize: 96, letterSpacing: -2 }}>So prüfst du es</Chunk>
        </div>
      ) : null}
      {t >= er ? <StepNo t={t} at={er} n={1} text="Screenshot machen" /> : null}
      {t >= er ? (
        <div style={{ position: "absolute", left: 300, top: 170, transform: `translateY(${(1 - phoneA) * 700}px) scale(${1 - 0.42 * shrink}) rotate(${-6 * shrink}deg)`, transformOrigin: "100% 0%" }}>
          <div style={{ width: 480, borderRadius: 54, background: "#111", padding: 14, boxShadow: "0 30px 60px rgba(0,0,0,0.28)", position: "relative" }}>
            <ProductPage t={t} w={452} />
            <div style={{ position: "absolute", inset: 14, borderRadius: 28, background: "#fff", opacity: Math.min(1, flash) }} />
          </div>
          <RedBox x={-10} y={-10} w={500} h={0} t={t} a={99} b={99} />
        </div>
      ) : null}
      {/* screenshot thumbnail lands top right with a check */}
      {shrink > 0.95 ? (
        <div style={{ position: "absolute", left: 120, top: 330, transform: `scale(${sp(sc + 0.8, 10, 220)})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Mark t={t} at={sc + 0.85} ok size={110} />
          <span style={{ fontFamily: fonts.bold, fontSize: 40, color: th.ink }}>Gespeichert</span>
        </div>
      ) : null}
    </Split>
  );
};

// ---------- 6 · Zweitens: an ChatGPT, Websuche an, Nachricht tippen ----------
// b = [Zweitens, ChatGPT, Websuche, schreib (typing start), typing end]
const Q = "Ist das ein echter Rabatt, und wo bekomme ich genau dieses Modell gerade günstiger?";
export const RbPrompt: React.FC<RbProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [z, c, w, s, e] = [bt(b, 0, 0.0), bt(b, 1, 0.8), bt(b, 2, 1.6), bt(b, 3, 2.6), bt(b, 4, 6.0)];
  const thumbA = sp(c + 0.2, 11, 200);
  const webA = sp(w + 0.3, 11, 220);
  const typed = Q.slice(0, Math.floor(Q.length * ez(t, s, e, Easing.linear)));
  const sent = t > e + 0.15;
  const IY = 330;
  return (
    <Split avatar={avatar}>
      <StepNo t={t} at={z} n={2} text="An ChatGPT schicken" />
      <div style={{ position: "absolute", left: 60, top: 175, display: "flex", alignItems: "center", gap: 16, opacity: ez(t, c, c + 0.2) }}>
        <Logo name="openai" size={70} />
        <span style={{ fontFamily: fonts.bold, fontSize: 44, color: th.ink }}>ChatGPT</span>
      </div>
      {!sent ? (
        <div style={{ position: "absolute", left: 50, right: 50, top: IY, background: "#fff", border: "2px solid #E5E5E5", borderRadius: 40, padding: "22px 26px", boxShadow: "0 10px 26px rgba(0,0,0,0.07)" }}>
          {/* attached screenshot */}
          <div style={{ width: 120, height: 150, borderRadius: 16, overflow: "hidden", border: "2px solid #E5E5E5", transform: `scale(${thumbA})`, transformOrigin: "0 0", marginBottom: 14 }}>
            <div style={{ transform: "scale(0.26)", transformOrigin: "0 0" }}><ProductPage t={t} w={452} /></div>
          </div>
          <div style={{ fontFamily: fonts.regular, fontSize: 38, color: typed ? "#0D0D0D" : "#9B9B9B", minHeight: 100, lineHeight: 1.3 }}>{typed || "Frag irgendwas"}<span style={{ opacity: Math.floor(t * 3) % 2 }}>|</span></div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 14, gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, border: "2px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, color: "#0D0D0D", fontFamily: fonts.regular }}>+</div>
            <div style={{ opacity: Math.min(1, webA * 2), transform: `scale(${webA})`, display: "flex", alignItems: "center", gap: 10, background: "#E8F1FF", color: "#1A6BFF", borderRadius: 32, padding: "12px 22px", fontFamily: fonts.semibold, fontSize: 30 }}>
              <svg width={30} height={30} viewBox="0 0 24 24"><circle cx={12} cy={12} r={9} stroke="#1A6BFF" strokeWidth={2} fill="none" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" stroke="#1A6BFF" strokeWidth={2} fill="none" /></svg>
              Websuche
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ width: 64, height: 64, borderRadius: 32, background: typed ? "#0D0D0D" : "#D7D7D7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 34, transform: `scale(${1 - 0.12 * bump(t, e, 0.25)})` }}>↑</div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", right: 50, top: 300, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, opacity: ez(t, e + 0.15, e + 0.35) }}>
            <div style={{ width: 120, height: 150, borderRadius: 16, overflow: "hidden", border: "2px solid #E5E5E5" }}><div style={{ transform: "scale(0.26)", transformOrigin: "0 0" }}><ProductPage t={t} w={452} /></div></div>
            <div style={{ maxWidth: 760, background: "#F4F4F4", borderRadius: 30, padding: "18px 26px", fontFamily: fonts.regular, fontSize: 34, color: "#0D0D0D", lineHeight: 1.3 }}>{Q}</div>
          </div>
          <div style={{ position: "absolute", left: 60, top: 720, display: "flex", gap: 14, alignItems: "center", opacity: ez(t, e + 0.4, e + 0.6) }}>
            <Logo name="openai" size={56} tile={false} />
            <span style={{ fontFamily: fonts.regular, fontSize: 32, color: "#8F8F8F" }}>Sucht im Netz …</span>
          </div>
        </>
      )}
      {!sent ? <RedBox x={50 + 26 - 6} y={IY + 22 + 150 * thumbA + 14 + 100 + 14 + 0 - 6} w={76} h={76} t={t} a={w - 0.35} b={w + 0.25} r={40} /> : null}
      {!sent ? <RedBox x={50 + 26 + 78 - 6} y={IY + 22 + 164 + 100 + 14 - 6} w={220} h={76} t={t} a={w + 0.3} b={s + 0.2} r={40} /> : null}
    </Split>
  );
};

// ---------- 7 · Drittens: ChatGPT vergleicht die Preise, gibt die Links; selbst nachsehen ----------
// b = [Drittens, vergleicht, Links, Schau selbst nach, bestellst]
export const RbVergleich: React.FC<RbProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [d, v, l, s, o] = [bt(b, 0, 0.0), bt(b, 1, 1.0), bt(b, 2, 2.4), bt(b, 3, 3.4), bt(b, 4, 4.4)];
  const rows: [string, number][] = [["Shop A", 119], ["Shop B", 104], ["Shop C", 112]];
  const best = 1;
  const selfA = ez(t, s, s + 0.3);
  return (
    <Split avatar={avatar}>
      <StepNo t={t} at={d} n={3} text={t < s ? "Preise vergleichen" : "Selbst nachsehen"} />
      <Card style={{ position: "absolute", left: 60, top: 180, width: 960, padding: "18px 34px 22px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <Logo name="openai" size={52} tile={false} />
          <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: th.dim, flex: 1 }}>Kopfhörer, Modell X</span>
          <Tag t={t} at={v} text="Beispiel" />
        </div>
        {rows.map(([name, val], i) => {
          const at = v + i * 0.35;
          const a = sp(at, 12, 220);
          const isBest = i === best && t > v + 1.2;
          const linkA = sp(l + i * 0.18, 11, 240);
          return (
            <div key={name} style={{ position: "relative", display: "flex", alignItems: "center", gap: 20, padding: "16px 18px", margin: "6px -18px 0", borderRadius: 22, background: isBest ? th.accentSoft : "transparent", border: isBest ? `4px solid ${th.accent}` : "4px solid transparent", transform: `translateX(${(1 - a) * 700}px) scale(${1 + (isBest ? 0.04 * bump(t, v + 1.2, 0.5) : 0)})`, opacity: Math.min(1, a * 2) }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 44, color: th.ink, flex: 1 }}>{name}</span>
              <div style={{ transform: "scale(0.42)", transformOrigin: "100% 50%", width: 190, height: 72, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <SlotCounter t={t} from={0} to={val} start={at} dur={0.55} suffix="€" th={th} seconds={6} />
              </div>
              <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: "#1A6BFF", background: "#E8F1FF", borderRadius: 999, padding: "8px 20px", transform: `scale(${linkA})`, display: "flex", alignItems: "center", gap: 8 }}>
                <svg width={26} height={26} viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1" stroke="#1A6BFF" strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg>
                Link
              </span>
              {isBest ? <div style={{ position: "absolute", right: -26, top: -28, transform: `scale(${sp(v + 1.2, 9, 240)}) rotate(8deg)` }}><Chunk t={t} color="#FFE58A" dark="#E0A92E" rim="#B47A12" style={{ padding: "6px 16px", fontSize: 26, color: "#5A3A00" }}>günstigster</Chunk></div> : null}
            </div>
          );
        })}
      </Card>
      {/* self-check: open the link yourself before ordering */}
      <div style={{ position: "absolute", left: 60, top: 690, width: 960, display: "flex", gap: 20, opacity: selfA, transform: `translateY(${(1 - selfA) * 60}px)` }}>
        {["Gleiches Modell?", "Versandkosten?"].map((x, i) => (
          <Card key={x} style={{ flex: 1, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
            <Mark t={t} at={s + 0.3 + i * 0.4} ok size={74} />
            <span style={{ fontFamily: fonts.bold, fontSize: 36, color: th.ink }}>{x}</span>
          </Card>
        ))}
      </div>
      <RedBox x={60 + 34 + 960 - 68 - 170} y={180 + 18 + 60 + 6 + 1 * 108} w={150} h={70} t={t} a={o - 0.2} b={o + 0.8} r={999} />
    </Split>
  );
};

// ---------- 8 · CTA: Anleitung mit dem Prompt, folg mir, PREIS kommentieren ----------
// b = [Anleitung, folg mir, Preis]
export const RbCta: React.FC<RbProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [an, fo, pr] = [bt(b, 0, 0.2), bt(b, 1, 1.4), bt(b, 2, 2.2)];
  const word = "PREIS";
  const n = Math.max(0, Math.min(word.length, Math.floor((t - pr) / 0.09)));
  const followed = t > fo + 0.2;
  const guideA = sp(an, 11, 170);
  return (
    <Split avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 410, transform: `translateX(${(1 - guideA) * -700}px) rotate(${-3 + (1 - guideA) * -10}deg)` }}>
        <Card style={{ width: 430, height: 500, padding: 30, boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: "#7C3AED" }}>Florent GPT · Anleitung</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 50, color: th.ink, lineHeight: 1.05, marginTop: 14, letterSpacing: -1 }}>Ist dein Rabatt echt?</div>
          {["Woran du es erkennst", "Nachricht zum Kopieren", "Preisverlauf prüfen"].map((x, i) => (
            <div key={x} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: i ? 14 : 30, opacity: ez(t, an + 0.3 + i * 0.25, an + 0.45 + i * 0.25) }}>
              <Mark t={t} at={an + 0.3 + i * 0.25} ok size={44} />
              <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: th.ink }}>{x}</span>
            </div>
          ))}
          <Gloss t={t} speed={0.5} />
        </Card>
      </div>
      <Card style={{ position: "absolute", left: 530, top: 440, width: 490, padding: 28, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Logo name="instagram" size={58} />
          <span style={{ fontFamily: fonts.bold, fontSize: 30, color: th.ink, flex: 1 }}>florentgpt</span>
        </div>
        <div style={{ marginTop: 22, height: 76, borderRadius: 18, background: followed ? "#E4E4E4" : "#0095F6", color: followed ? th.ink : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 34, transform: `scale(${1 + 0.1 * bump(t, fo, 0.35)})` }}>{followed ? "Gefolgt" : "Folgen"}</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: th.dim, marginTop: 30 }}>Kommentar</div>
        <div style={{ marginTop: 12, height: 84, borderRadius: 42, border: `2px solid ${th.line}`, display: "flex", alignItems: "center", padding: "0 28px", fontFamily: fonts.bold, fontSize: 44, color: th.ink }}>{word.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2, color: th.accent }}>|</span></div>
      </Card>
      <RedBox x={530 + 28 - 6} y={440 + 28 + 58 + 22 - 6} w={434 + 12} h={88} t={t} a={fo - 0.3} b={fo + 0.4} r={24} />
      <RedBox x={530 + 28 - 6} y={440 + 28 + 58 + 22 + 76 + 30 + 32 + 12 - 6} w={434 + 12} h={96} t={t} a={pr + 0.5} b={pr + 2} r={48} />
    </Split>
  );
};

export const rbMetadata = ({ props }: { props: { seconds?: number } }) => ({ durationInFrames: Math.max(1, Math.round((props.seconds ?? 4) * 25)) });

