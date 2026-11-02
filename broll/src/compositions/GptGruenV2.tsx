import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { Logo } from "../components/PanelKit";
import captionsJson from "../../runs/gpt-zinsen/captions.json";

// @florentgpt test "Weiß + Dunkelgrün v2" (Henri 2026-10-15): no wordmark, much more and cleaner motion, glass.
// White base, deep green #0B3D2C (darker than boilr #0A5F45). Frosted-glass cards over slowly drifting crisp green
// shapes, panel slides in/out with the speaker re-framing (no hard cut), staggered word pop-ins, odometers with
// motion blur, landing punch + ring ripple + glint sweep, floating "+" ticks. Test only on runs/gpt-zinsen.

const { fontFamily: tight } = loadInterTight("normal", { weights: ["700", "800", "900"], subsets: ["latin", "latin-ext"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin", "latin-ext"] });

const { fontFamily: mono } = loadMono("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });

const C = { green: "#0B3D2C", mint: "#BFE3D2", tint: "#EAF2EE", ink: "#0B1F18", dim: "#5E716A", white: "#FFFFFF" };
const HW = 1080;
const HH = 1920;
const PH = Math.round(HH * 0.52);
const IN = 0.32; // panel slide-in / slide-out seconds
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const bump = (t: number, at: number, d: number) => (t < at || t > at + d ? 0 : Math.sin((Math.PI * (t - at)) / d));
/** eased count with its speed (units per second) for motion blur */
const count = (t: number, a: number, b: number, to: number, from = 0) => {
  const e = Easing.inOut(Easing.cubic);
  const k = ez(t, a, b, e);
  const k2 = ez(t + 0.02, a, b, e);
  return { v: from + (to - from) * k, speed: Math.abs(((to - from) * (k2 - k)) / 0.02) };
};

type Word = { text: string; startMs: number; endMs: number };
const WORDS = captionsJson as Word[];
const AVATAR = { src: "render-gpt-zinsen-tightened.mp4", focus: { x: 0.448, y: 0.641 }, scale: 1.08, faceAt: 0.57 };

const useSp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (atSec: number, damping = 13, stiffness = 210) => spring({ frame: frame - Math.round(atSec * fps), fps, config: { damping, stiffness, mass: 0.7 } });
};

// ---------- odometer with motion blur ----------

const Odometer: React.FC<{ value: number; speed?: number; size: number; color?: string; suffix?: string; decimals?: number }> = ({ value, speed = 0, size, color = C.green, suffix = "", decimals = 0 }) => {
  const scaled = Math.max(0, value) * 10 ** decimals;
  const digits = Math.max(1 + decimals, String(Math.floor(scaled)).length);
  const places = Array.from({ length: digits }, (_, i) => digits - 1 - i);
  const ds = speed * 10 ** decimals; // last-digit units per second
  return (
    <div style={{ display: "flex", alignItems: "flex-end", fontFamily: tight, fontWeight: 900, fontSize: size, color, letterSpacing: -size * 0.04, lineHeight: 1 }}>
      {places.map((p) => {
        const unit = 10 ** p;
        const base = Math.floor(scaled / unit) % 10;
        const roll = p === 0 ? scaled - Math.floor(scaled) : Math.min(1, Math.max(0, (scaled % unit) - (unit - 1)));
        const blur = Math.min(size * 0.05, (ds / unit) * size * 0.0012);
        return (
          <React.Fragment key={p}>
            {decimals > 0 && p === decimals - 1 ? <span>,</span> : null}
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

/** Thin green ring expanding from a point (landing moments). */
const Ripple: React.FC<{ t: number; at: number; x: number; y: number; r?: number; color?: string }> = ({ t, at, x, y, r = 260, color = C.green }) => {
  if (t < at || t > at + 0.7) return null;
  const k = ez(t, at, at + 0.7);
  return <div style={{ position: "absolute", left: x - r * k, top: y - r * k, width: 2 * r * k, height: 2 * r * k, borderRadius: "50%", border: `${Math.max(1, 10 * (1 - k))}px solid ${color}`, opacity: 1 - k, zIndex: 5 }} />;
};

/** Diagonal light sweep across a parent (needs overflow hidden). */
const Glint: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  if (t < at || t > at + 0.6) return null;
  const k = ez(t, at, at + 0.6, Easing.inOut(Easing.quad));
  return <div style={{ position: "absolute", top: "-40%", bottom: "-40%", width: "28%", left: `${-40 + k * 170}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)", transform: "rotate(18deg)", pointerEvents: "none", zIndex: 20 }} />;
};

/** Small labels that float up and fade ("+ €"). */
const Ticks: React.FC<{ t: number; from: number; to: number; every: number; text: string; x: number; y: number; color?: string }> = ({ t, from, to, every, text, x, y, color = C.green }) => (
  <>
    {Array.from({ length: Math.max(0, Math.floor((to - from) / every)) }, (_, i) => from + i * every).map((at, i) => {
      if (t < at || t > at + 0.8) return null;
      const k = ez(t, at, at + 0.8);
      return <div key={i} style={{ position: "absolute", left: x + ((i * 37) % 90) - 45, top: y - k * 120, fontFamily: tight, fontWeight: 800, fontSize: 34, color, opacity: k < 0.2 ? k * 5 : 1 - (k - 0.2) / 0.8, transform: `scale(${0.8 + 0.3 * k})`, zIndex: 30 }}>{text}</div>;
    })}
  </>
);

/** Headline whose words pop in one after another. */
const PopWords: React.FC<{ text: string; at: number; step?: number; style?: React.CSSProperties; hi?: string }> = ({ text, at, step = 0.07, style, hi }) => {
  const sp = useSp();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.24em", ...style }}>
      {text.split(" ").map((w, i) => {
        const a = sp(at + i * step, 12, 260);
        const isHi = hi && w.replace(/[.,]/g, "") === hi;
        return (
          <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - a) * 60}px) scale(${0.6 + 0.4 * a})`, opacity: Math.min(1, a * 2), transformOrigin: "50% 100%", ...(isHi ? { background: C.green, color: C.white, borderRadius: 16, padding: "0 16px" } : {}) }}>{w}</span>
        );
      })}
    </div>
  );
};

// ---------- background + glass ----------

/** White panel with crisp green shapes drifting slowly behind the glass. */
const Backdrop: React.FC<{ t: number; variant: number }> = ({ t, variant }) => {
  const v = [
    { a: [700, 380, 560], b: [-160, 600, 320] },
    { a: [-220, 420, 520], b: [780, 560, 360] },
    { a: [640, 300, 560], b: [-200, 560, 340] },
  ][variant % 3];
  return (
    <AbsoluteFill style={{ background: C.white, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: v.a[0] + Math.sin(t * 0.8) * 50, top: v.a[1] + Math.cos(t * 0.6) * 40, width: v.a[2], height: v.a[2], borderRadius: "50%", background: C.mint }} />
      <div style={{ position: "absolute", left: v.b[0] + Math.cos(t * 0.7) * 60, top: v.b[1] + Math.sin(t * 0.9) * 40, width: v.b[2], height: v.b[2], borderRadius: "50%", border: `40px solid rgba(11,61,44,0.14)` }} />
    </AbsoluteFill>
  );
};

const Glass: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.62)", backdropFilter: "blur(30px) saturate(150%)", WebkitBackdropFilter: "blur(30px) saturate(150%)", borderRadius: 34, border: "2px solid rgba(255,255,255,0.9)", boxShadow: "0 24px 60px rgba(11,61,44,0.18), inset 0 2px 0 rgba(255,255,255,0.9)", ...style }}>{children}</div>
);

const Check: React.FC<{ size?: number; p?: number; inverted?: boolean }> = ({ size = 52, p = 1, inverted }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: inverted ? C.white : C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6" stroke={inverted ? C.green : C.white} strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /></svg>
  </div>
);

const Chip: React.FC<{ text: string; t: number; at: number }> = ({ text, t, at }) => {
  const sp = useSp();
  const a = sp(at, 10, 240);
  return (
    <div style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 14, background: C.green, borderRadius: 999, padding: "14px 30px 14px 14px", transform: `translateY(${(1 - a) * 40}px) scale(${a})`, opacity: Math.min(1, a * 2), boxShadow: "0 14px 30px rgba(11,61,44,0.3)" }}>
      <Check size={50} p={ez(t, at + 0.1, at + 0.4)} inverted />
      <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 38, color: C.white, letterSpacing: -0.5 }}>{text}</span>
      <Glint t={t} at={at + 0.35} />
    </div>
  );
};

const Bar: React.FC<{ label: string; fill: number; muted?: boolean; t: number; children: React.ReactNode }> = ({ label, fill, muted, t, children }) => {
  const shimmer = ((t * 1.1) % 1.2) / 1.2;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
        <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 46, color: muted ? C.dim : C.ink, letterSpacing: -1 }}>{label}</span>
        {children}
      </div>
      <div style={{ height: 28, borderRadius: 14, background: "rgba(11,61,44,0.08)", overflow: "hidden" }}>
        <div style={{ position: "relative", width: `${Math.max(fill * 100, muted ? 2.5 : 0)}%`, height: "100%", borderRadius: 14, background: muted ? "#C7D3CE" : C.green, overflow: "hidden" }}>
          {!muted ? <div style={{ position: "absolute", top: 0, bottom: 0, width: "30%", left: `${-30 + shimmer * 160}%`, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)" }} /> : null}
        </div>
      </div>
    </div>
  );
};

// ---------- scenes (t = seconds since window start) ----------

const HookScene: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const card = sp(0.45, 14, 170);
  const c = count(t, 0.9, 2.4, 200);
  const land = bump(t, 2.4, 0.3);
  return (
    <>
      <Backdrop t={t} variant={0} />
      <PopWords text="Dein Girokonto zahlt dir null." hi="null" at={0} style={{ position: "absolute", left: 60, right: 200, top: 120, fontFamily: tight, fontWeight: 900, fontSize: 104, lineHeight: 1.04, letterSpacing: -3.5, color: C.green }} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 470, padding: "32px 40px 38px", transform: `translateY(${(1 - card) * 520}px) rotate(${(1 - card) * 5}deg) scale(${1 + 0.03 * land})` }}>
        <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 28, color: C.dim, marginBottom: 22 }}>Zinsen im Jahr auf 10.000 € · Beispiel</div>
        <Bar label="Girokonto" fill={0} muted t={t}><span style={{ fontFamily: tight, fontWeight: 900, fontSize: 70, color: C.dim, letterSpacing: -2, lineHeight: 1 }}>0 €</span></Bar>
        <div style={{ height: 30 }} />
        <Bar label="Tagesgeld" fill={0.82 * (c.v / 200)} t={t}>
          <div style={{ transform: `scale(${1 + 0.18 * land})`, transformOrigin: "100% 100%" }}><Odometer value={c.v} speed={c.speed} size={70} suffix="€" /></div>
        </Bar>
        <Glint t={t} at={2.45} />
      </Glass>
      <Ticks t={t} from={1.0} to={2.4} every={0.22} text="+ €" x={830} y={720} />
      <Ripple t={t} at={2.4} x={880} y={770} />
    </>
  );
};

const GiroScene: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const c = count(t, 0.1, 1.1, 0, 2.5);
  const shake = bump(t, 1.1, 0.4) * Math.sin(t * 80) * 14;
  const stamp = sp(1.15, 9, 260);
  const banks = [["Bank A", "0,00 %"], ["Bank B", "0,01 %"], ["Bank C", "0,00 %"]];
  return (
    <>
      <Backdrop t={t} variant={1} />
      <div style={{ position: "absolute", left: 60, top: 120, fontFamily: inter, fontWeight: 600, fontSize: 36, color: C.dim, opacity: ez(t, 0, 0.2) }}>Zins auf dem Girokonto</div>
      <div style={{ position: "absolute", left: 50, top: 180, transform: `translateX(${shake}px) scale(${1 + 0.06 * bump(t, 1.1, 0.3)})`, transformOrigin: "0 50%" }}>
        <Odometer value={c.v} speed={c.speed} decimals={2} size={250} suffix="%" />
      </div>
      <Ripple t={t} at={1.1} x={330} y={310} r={320} />
      <div style={{ position: "absolute", left: 60, top: 470, fontFamily: tight, fontWeight: 900, fontSize: 52, color: C.white, background: C.green, borderRadius: 18, padding: "10px 28px", letterSpacing: -1, transform: `scale(${2 - stamp}) rotate(-4deg)`, opacity: Math.min(1, stamp * 3), transformOrigin: "0 50%" }}>bei den meisten Banken</div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 640, display: "flex", gap: 18 }}>
        {banks.map(([n, v], i) => {
          const a = sp(0.35 + i * 0.12, 12, 230);
          return (
            <Glass key={n} style={{ flex: 1, padding: "20px 24px", transform: `translateY(${(1 - a) * 200}px)`, opacity: Math.min(1, a * 2) }}>
              <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 28, color: C.dim }}>{n}</div>
              <div style={{ fontFamily: tight, fontWeight: 900, fontSize: 52, color: C.green, letterSpacing: -1.5 }}>{v}</div>
            </Glass>
          );
        })}
      </div>
    </>
  );
};

const TagesgeldScene: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const b = [0.49, 3.31, 3.77, 4.45];
  const c = count(t, b[0] + 0.3, b[1] + 0.2, 2);
  const land = bump(t, b[1] + 0.2, 0.3);
  return (
    <>
      <Backdrop t={t} variant={2} />
      <PopWords text="Tagesgeld statt Girokonto" at={0} style={{ position: "absolute", left: 60, right: 60, top: 120, fontFamily: tight, fontWeight: 900, fontSize: 76, color: C.green, letterSpacing: -2.5 }} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 270, padding: "32px 40px 38px", transform: `translateY(${(1 - sp(b[0], 14, 170)) * 520}px) scale(${1 + 0.03 * land})` }}>
        <Bar label="Girokonto" fill={0} muted t={t}><span style={{ fontFamily: tight, fontWeight: 900, fontSize: 70, color: C.dim, letterSpacing: -2, lineHeight: 1 }}>0 %</span></Bar>
        <div style={{ height: 30 }} />
        <Bar label="Tagesgeld" fill={0.4 * c.v} t={t}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, transform: `scale(${1 + 0.18 * land})`, transformOrigin: "100% 100%" }}>
            <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 40, color: C.green, marginBottom: 6 }}>über</span>
            <Odometer value={c.v} speed={c.speed} decimals={1} size={70} suffix="%" />
          </div>
        </Bar>
        <Glint t={t} at={b[1] + 0.25} />
      </Glass>
      <Ticks t={t} from={b[0] + 0.5} to={b[1] + 0.2} every={0.35} text="+ %" x={840} y={510} />
      <Ripple t={t} at={b[1] + 0.2} x={880} y={560} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 760, display: "flex", gap: 20 }}>
        <Chip text="dauerhaft" t={t} at={b[2]} />
        <Chip text="nicht nur Neukunden" t={t} at={b[3]} />
      </div>
    </>
  );
};

const RechnungScene: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const b = [0.74, 1.45, 2.07];
  const c = count(t, b[0] - 0.25, b[0] + 0.85, 200);
  const landAt = b[0] + 0.85;
  const land = bump(t, landAt, 0.3);
  const eq = ez(t, 0.45, 0.75);
  return (
    <>
      <Backdrop t={t} variant={0} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, fontFamily: tight, fontWeight: 800, fontSize: 50, color: C.green }}>
        <Glass style={{ borderRadius: 999, padding: "8px 30px", transform: `scale(${sp(0, 11, 260)})` }}>10.000 €</Glass>
        <span style={{ transform: `scale(${sp(0.12, 10, 260)})` }}>×</span>
        <span style={{ background: C.green, color: C.white, borderRadius: 999, padding: "10px 32px", transform: `scale(${sp(0.24, 10, 260)})` }}>2 %</span>
      </div>
      <div style={{ position: "absolute", left: 340, width: 400 * eq, top: 238, height: 8, borderRadius: 4, background: C.green }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", transform: `scale(${1 + 0.12 * land})` }}>
        <Odometer value={c.v} speed={c.speed} size={300} suffix="€" />
      </div>
      <Ticks t={t} from={b[0] - 0.1} to={landAt} every={0.12} text="+ €" x={540} y={330} />
      <Ripple t={t} at={landAt} x={540} y={440} r={420} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 630, textAlign: "center", fontFamily: inter, fontWeight: 600, fontSize: 36, color: C.dim, opacity: ez(t, b[1], b[1] + 0.3) }}>rund pro Jahr · Beispiel</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", overflow: "hidden", background: C.green, color: C.white, fontFamily: tight, fontWeight: 900, fontSize: 66, letterSpacing: -1.5, borderRadius: 22, padding: "12px 40px", transform: `scale(${2.2 - 1.2 * sp(b[2], 9, 260)}) rotate(-3deg)`, opacity: Math.min(1, sp(b[2], 9, 260) * 3), boxShadow: "0 18px 40px rgba(11,61,44,0.35)" }}>
          fürs Nichtstun
          <Glint t={t} at={b[2] + 0.25} />
        </div>
      </div>
    </>
  );
};

const Q = "Such mir Tagesgeldkonten mit dem höchsten Zins, der auch nach der Aktion bleibt, und mit Einlagensicherung.";
const PromptScene: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const e = 4.3;
  const typed = Q.slice(0, Math.floor(Q.length * interpolate(t, [0.2, e], [0, 1], clamp)));
  const chips = [["höchster Zins", 0.3], ["bleibt nach der Aktion", 0.6], ["Einlagensicherung", 0.95]] as const;
  const send = bump(t, e + 0.05, 0.3);
  return (
    <>
      <Backdrop t={t} variant={1} />
      <div style={{ position: "absolute", left: 60, top: 120, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 84, height: 84, borderRadius: 26, background: C.green, color: C.white, fontFamily: tight, fontWeight: 900, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(0, 9, 260)}) rotate(${(1 - sp(0, 9, 260)) * -40}deg)` }}>2</div>
        <PopWords text="Prompt schreiben" at={0.1} style={{ fontFamily: tight, fontWeight: 900, fontSize: 64, color: C.green, letterSpacing: -1.5 }} />
      </div>
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 260, padding: "28px 32px", transform: `translateY(${(1 - sp(0.1, 14, 170)) * 500}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <Logo name="openai" size={44} tile={false} />
          <span style={{ fontFamily: inter, fontWeight: 600, fontSize: 28, color: C.dim, flex: 1 }}>ChatGPT · Websuche an</span>
          <div style={{ width: 60, height: 60, borderRadius: 30, background: typed.length === Q.length ? C.green : "#C7D3CE", color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: tight, fontWeight: 900, fontSize: 34, transform: `scale(${1 + 0.25 * send})` }}>↑</div>
        </div>
        <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 40, lineHeight: 1.32, color: C.ink, minHeight: 160 }}>{typed}<span style={{ color: C.green, opacity: Math.floor(t * 3) % 2 }}>|</span></div>
        <Glint t={t} at={e + 0.1} />
      </Glass>
      <Ripple t={t} at={e + 0.05} x={960} y={320} r={160} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 690, display: "flex", flexWrap: "wrap", gap: 16 }}>
        {chips.map(([x, f]) => <Chip key={x} text={x} t={t} at={e * f} />)}
      </div>
    </>
  );
};

const SCENES: { start: number; end: number; C: React.FC<{ t: number }> }[] = [
  { start: 0, end: 4.7, C: HookScene },
  { start: 5.4, end: 7.4, C: GiroScene },
  { start: 9.8, end: 15.5, C: TagesgeldScene },
  { start: 16.4, end: 19.0, C: RechnungScene },
  { start: 23.4, end: 28.1, C: PromptScene },
];

// ---------- captions: the @florent_preusser pill (2-3 words, JetBrains Mono caps, a sliding pill behind the
// active word), recoloured to the GPT green (Henri 2026-10-15). "green": green pill, active word white;
// "white": white pill with green text, active word green.
type CapVariant = "green" | "white";
const chunks = (() => {
  const out: { start: number; end: number; words: { w: string; s: number }[] }[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => ({ w: c.text.replace(/[.,!?;:]/g, "").toUpperCase(), s: c.startMs / 1000 })) });
    cur = [];
  };
  for (const c of WORDS) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 20) || (cur.length && len > 22)) flush();
    cur.push(c);
    if (/[.,!?]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
})();
const Caption: React.FC<{ y: number; variant: CapVariant }> = ({ y, variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = interpolate(t, [c.start - 0.04, c.start + 0.34], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
  const o = ez(t, c.start - 0.04, c.start + 0.04);
  const green = variant === "green";
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
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: o, background: green ? C.green : C.white, borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: mono, fontWeight: 700, fontSize: fs, letterSpacing: "0.14em", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(11,61,44,0.28)" }}>
        <div style={{ position: "relative", display: "flex", gap: gapW }}>
          <div style={{ position: "absolute", left: px - 12, top: -4, width: pw + 24, bottom: -4, background: green ? C.white : C.green, borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.18)" }} />
          {c.words.map((w, j) => {
            const active = j === i;
            const color = green ? (active ? C.green : C.white) : active ? C.white : C.green;
            return <span key={j} style={{ position: "relative", display: "inline-block", color }}>{w.w}</span>;
          })}
        </div>
      </div>
    </div>
  );
};

// ---------- master: panel slides in from the top, speaker re-frames smoothly, slides out again ----------

export const GptGruenV2: React.FC<{ captionVariant?: CapVariant }> = ({ captionVariant = "green" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const s = SCENES.find((x) => t >= x.start && t < x.end);
  // k: 0 = full-frame speaker, 1 = split. The hook starts already split (frame 0 is the thumbnail).
  const k = s ? Math.min(s.start === 0 ? 1 : ez(t, s.start, s.start + IN, Easing.inOut(Easing.cubic)), ez(t, s.end - IN, s.end, Easing.inOut(Easing.cubic)) * -1 + 1) : 0;
  const h0 = HH - PH;
  const vwS = HW * AVATAR.scale, vhS = HH * AVATAR.scale;
  const leftS = Math.min(0, Math.max(HW - vwS, HW / 2 - AVATAR.focus.x * vwS));
  const topS = PH + Math.min(0, Math.max(h0 - vhS, h0 * AVATAR.faceAt - AVATAR.focus.y * vhS));
  const vw = HW + (vwS - HW) * k, vh = HH + (vhS - HH) * k;
  const panelH = PH * k;
  return (
    <AbsoluteFill style={{ background: C.white, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: leftS * k, top: topS * k, width: vw, height: vh }}>
        <OffthreadVideo src={staticFile(AVATAR.src)} muted style={{ width: "100%", height: "100%" }} />
      </div>
      {s ? (
        <div style={{ position: "absolute", left: 0, top: panelH - PH, width: HW, height: PH, overflow: "hidden", boxShadow: "0 18px 40px rgba(11,61,44,0.18)" }}>
          <Sequence from={Math.round(s.start * fps)} layout="none">
            <s.C t={t - s.start} />
          </Sequence>
        </div>
      ) : null}
      {/* caption rides the panel edge while it moves (never over the face), chest height when there is no panel */}
      <Caption y={k > 0 ? Math.max(panelH, HH * 0.3) : HH * 0.74} variant={captionVariant} />
    </AbsoluteFill>
  );
};
