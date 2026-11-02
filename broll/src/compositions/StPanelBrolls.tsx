import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { AvatarSrc, serifItalic } from "../components/PanelKit";
import { BrandTile, HOOK_THEMES, SlotCounter } from "../components/HookKit";

// FP-N "Studie: mit KI 19 % langsamer" (runs/fpn-studie-1, 2026-10-09 slot). Dopamin-Split-Panels (video-broll
// "Dopamin-Split-B-Rolls als Standard"): panel on top (~52 %), speaker below, casino/slot-style chunky icons on cream,
// Superkind orange accent. FP-N = mittlere Dopamin-Stufe (Henri 2026-10-08): wenige Objekte, ein Ereignis alle ~0,4-0,8 s. Numbers are from METR (2025), arXiv 2507.09089; nothing invented.
// Times inside each scene are seconds from the window start (captions.json, tightened timeline).

export type StProps = { seconds?: number; avatar: AvatarSrc; beats?: number[] };
const HW = 1080;
const HH = 1920;
const th = HOOK_THEMES.fp;
const GREEN = "#2E9E5B";
const RED = "#E5484D";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rampE = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const bump = (t: number, at: number, d: number) => (t < at || t > at + d ? 0 : Math.sin(Math.PI * Math.sqrt((t - at) / d)) * (1 - (t - at) / d) * 1.6);
const rnd = (i: number, s = 1) => {
  const x = Math.sin(i * 127.1 * s + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const soft = (at: number, damping = 13, stiffness = 170) => spring({ frame: frame - Math.round(at * fps), fps, config: { damping, stiffness, mass: 0.7 } });
  return { t: frame / fps, soft };
};
const resolveSrc = (s: string) => (/^(https?:|file:)/.test(s) ? s : staticFile(s));

// ---------- Split frame: panel on top, speaker below, last 0.3 s panel fades + speaker grows to full frame ----------
const PANEL_FRAC = 0.52;
const DopaSplit: React.FC<{ avatar: AvatarSrc; seconds: number; children: React.ReactNode }> = ({ avatar, seconds, children }) => {
  const { t } = useT();
  const { fps } = useVideoConfig();
  const PH = Math.round(HH * PANEL_FRAC);
  const k = rampE(t, seconds - 0.3, seconds, Easing.inOut(Easing.cubic));
  const s0 = avatar.scale ?? 1.0;
  const f = avatar.focus ?? { x: 0.52, y: 0.45 };
  const h0 = HH - PH;
  const vw0 = HW * s0, vh0 = HH * s0;
  const left0 = Math.min(0, Math.max(HW - vw0, HW / 2 - f.x * vw0));
  const top0 = Math.min(0, Math.max(h0 - vh0, h0 * (avatar.faceAt ?? 0.42) - f.y * vh0));
  const vw = vw0 + (HW - vw0) * k, vh = vh0 + (HH - vh0) * k;
  const cp = t / seconds;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: left0 * (1 - k), top: (PH + top0) * (1 - k), width: vw, height: vh }}>
        <OffthreadVideo src={resolveSrc(avatar.src)} startFrom={Math.round(avatar.startSec * fps)} muted style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: HW, height: PH, overflow: "hidden", background: th.bg, boxShadow: `0 10px 30px rgba(0,0,0,${0.25 * (1 - k)})`, opacity: 1 - k, transform: `scale(${1 + 0.05 * k})`, transformOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", inset: -80, backgroundImage: `radial-gradient(${th.grid} 2px, transparent 2.5px)`, backgroundSize: "36px 36px", transform: `translate(${(t * 14) % 36}px, ${(t * 22) % 36}px)` }} />
        <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", left: -200 + Math.sin(t * 0.7) * 160, top: 120 + Math.cos(t * 0.5) * 100, background: `radial-gradient(circle, ${th.accentSoft}AA 0%, transparent 65%)` }} />
        <AbsoluteFill style={{ transform: `scale(${1 + 0.05 * cp}) translate(${Math.sin(t * 0.9) * 6}px, ${-cp * 10}px)`, transformOrigin: "50% 55%" }}>{children}</AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Casino-style chunky pieces (glossy, bevel, thick accent rim, soft shadow, light sweep) ----------
const Gloss: React.FC<{ t: number; speed?: number; r?: number }> = ({ t, speed = 0.7, r = 0 }) => {
  const g = ((t * speed + r) % 1.6) / 1.6;
  return <div style={{ position: "absolute", top: "-30%", bottom: "-30%", width: "35%", left: `${-50 + g * 190}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", transform: "rotate(18deg)", pointerEvents: "none" }} />;
};
const Chunky: React.FC<{ w: number; h: number; color: string; rim?: string; radius?: number; t: number; children?: React.ReactNode; style?: React.CSSProperties; glossR?: number }> = ({ w, h, color, rim, radius = 34, t, children, style, glossR = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: radius, position: "relative", overflow: "hidden", background: `linear-gradient(180deg, ${color}F0 0%, ${color} 55%, ${color}D8 100%)`, border: `7px solid ${rim ?? color}`, boxShadow: `0 18px 34px rgba(60,30,0,0.22), inset 0 8px 0 rgba(255,255,255,0.35), inset 0 -10px 0 rgba(0,0,0,0.12)`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
    {children}
    <Gloss t={t} r={glossR} />
  </div>
);
const Kicker: React.FC<{ text: string; t: number; num?: string; top?: number }> = ({ text, t, num, top = 150 }) => {
  const { soft } = useT();
  const a = soft(-0.25, 12, 180);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, zIndex: 500, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, transform: `translateY(${(1 - a) * -60}px)`, opacity: Math.min(1, a * 1.6) }}>
      {num ? <Chunky w={86} h={86} radius={26} color={th.accent} rim="#FFB08F" t={t}><span style={{ fontFamily: fonts.bold, fontSize: 54, color: "#FFF", textShadow: "0 3px 0 rgba(0,0,0,0.15)" }}>{num}</span></Chunky> : null}
      <span style={{ fontFamily: fonts.bold, fontSize: 64, color: th.ink, letterSpacing: -1.5, whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
};
const Glint: React.FC<{ k: number; size: number }> = ({ k, size }) => {
  if (k <= 0 || k >= 1) return null;
  const a = Math.sin(Math.PI * k);
  const s = size * (0.5 + a);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(-50%,-50%) rotate(${k * 90}deg)`, opacity: a, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: -s / 2, top: -size * 0.06, width: s, height: size * 0.12, borderRadius: 99, background: "linear-gradient(90deg, transparent, #FFFDF0, transparent)" }} />
      <div style={{ position: "absolute", top: -s / 2, left: -size * 0.06, height: s, width: size * 0.12, borderRadius: 99, background: "linear-gradient(0deg, transparent, #FFFDF0, transparent)" }} />
    </div>
  );
};
/** Small glossy task card (falls, lands, stacks). */
const TaskCard: React.FC<{ color?: string; w?: number; label?: string }> = ({ color = "#FFFFFF", w = 120, label }) => {
  const dark = color !== "#FFFFFF";
  return (
    <div style={{ width: w, height: w * 0.62, borderRadius: 16, background: `linear-gradient(180deg, ${color}, ${color}E6)`, border: `4px solid ${dark ? "rgba(255,255,255,0.55)" : th.line}`, boxShadow: "0 8px 16px rgba(60,30,0,0.16), inset 0 4px 0 rgba(255,255,255,0.4)", padding: "10px 12px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
      {label ? <span style={{ fontFamily: fonts.bold, fontSize: w * 0.17, color: dark ? "#FFF" : th.ink, whiteSpace: "nowrap" }}>{label}</span> : null}
      {[0.85, 0.6, 0.72].slice(label ? 1 : 0).map((k, j) => <div key={j} style={{ width: `${k * 100}%`, height: 7, borderRadius: 4, background: dark ? "rgba(255,255,255,0.65)" : "#DDD8CF" }} />)}
    </div>
  );
};
/** Items fall with gravity into stacks at the given x positions, bounce, glint. */
const Drops: React.FC<{ t: number; n: number; every: number; start: number; xs: number[]; floor: number; step: number; render: (i: number, lane: number) => React.ReactNode; laneOf?: (i: number) => number; from?: number }> = ({ t, n, every, start, xs, floor, step, render, laneOf, from = -120 }) => {
  const G = 5200;
  const counts = xs.map(() => 0);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const lane = laneOf ? laneOf(i) : i % xs.length;
    const level = counts[lane]++;
    const s = start + i * every;
    if (t < s) continue;
    const ty = floor - level * step;
    const fall = Math.sqrt((2 * Math.max(60, ty - from)) / G);
    const tf = Math.min(t - s, fall);
    const land = s + fall;
    const u = (t - land) / 0.3;
    const bounce = u > 0 && u < 1 ? Math.abs(Math.sin(Math.PI * u * 2)) * 16 * Math.pow(1 - u, 1.6) : 0;
    const y = tf < fall ? from + 0.5 * G * tf * tf : ty - bounce;
    const rot = tf < fall ? (rnd(i, 3) - 0.5) * 40 * (1 - tf / fall) : (rnd(i, 4) - 0.5) * 5;
    out.push(
      <div key={i} style={{ position: "absolute", left: xs[lane] + (rnd(i, 5) - 0.5) * 10, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, zIndex: 10 + i }}>
        {render(i, lane)}
        <div style={{ position: "absolute", left: "70%", top: 0 }}><Glint k={(t - land) / 0.3} size={60} /></div>
      </div>,
    );
  }
  return <>{out}</>;
};
const Pill: React.FC<{ text: string; color?: string; bg?: string; size?: number; style?: React.CSSProperties }> = ({ text, color = th.ink, bg = th.card, size = 30, style }) => (
  <div style={{ fontFamily: fonts.semibold, fontSize: size, color, background: bg, border: `1.5px solid ${th.line}`, borderRadius: 999, padding: "8px 22px", boxShadow: "0 6px 16px rgba(0,0,0,0.06)", whiteSpace: "nowrap", ...style }}>{text}</div>
);
/** Progress bar with shimmer + number. */
const Meter: React.FC<{ t: number; at: number; dur: number; fill: number; color: string; w: number; label: string; numTxt: (p: number) => string }> = ({ t, at, dur, fill, color, w, label, numTxt }) => {
  const p = rampE(t, at, at + dur, Easing.bezier(0.3, 0.7, 0.2, 1));
  const shimmer = ((t * 0.9) % 1.2) / 1.2;
  return (
    <div style={{ width: w }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 34, color: th.ink }}>{label}</span>
        <span style={{ fontFamily: serifItalic, fontSize: 54, color, lineHeight: 1, display: "inline-block", transform: `scale(${1 + 0.12 * bump(t, at + dur, 0.4)})` }}>{numTxt(p)}</span>
      </div>
      <div style={{ height: 30, borderRadius: 15, background: th.bg, border: `1.5px solid ${th.line}`, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(2, fill * p * 100)}%`, borderRadius: 15, background: `linear-gradient(90deg, ${color}, ${color}DD)`, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 140, left: `${shimmer * 160 - 30}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }} />
        </div>
      </div>
    </div>
  );
};
/** Glossy stopwatch drawn with divs (no emoji). */
const Stopwatch: React.FC<{ t: number; size?: number; color: string; speed?: number }> = ({ t, size = 120, color, speed = 1 }) => (
  <div style={{ width: size, height: size * 1.12, position: "relative" }}>
    <div style={{ position: "absolute", left: size * 0.4, top: 0, width: size * 0.2, height: size * 0.14, borderRadius: 6, background: color }} />
    <div style={{ position: "absolute", left: 0, top: size * 0.12, width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 38% 32%, #FFFFFF, #F1ECE4 70%)`, border: `${size * 0.08}px solid ${color}`, boxSizing: "border-box", boxShadow: "0 12px 24px rgba(60,30,0,0.2)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: size * 0.05, height: size * 0.36, background: th.ink, borderRadius: 4, transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${t * 300 * speed}deg)` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: size * 0.12, height: size * 0.12, borderRadius: "50%", background: color, transform: "translate(-50%,-50%)" }} />
      <Gloss t={t} />
    </div>
  </div>
);

// ---------- 2 · "Forscher haben erfahrene Programmierer echte Aufgaben machen lassen, mal mit KI, mal ohne." ----------
export const StForscher: React.FC<StProps> = ({ avatar, seconds = 3.5, beats = [1.2, 2.4] }) => {
  const { t, soft } = useT();
  const [mitAt, ohneAt] = beats;
  const laneA = soft(mitAt - 0.15, 11, 190);
  const laneB = soft(ohneAt - 0.15, 11, 190);
  return (
    <DopaSplit avatar={avatar} seconds={seconds}>
      <Kicker text="Echte Aufgaben" t={t} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, zIndex: 450, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ transform: "scale(0.85)", transformOrigin: "50% 0%", height: 170 * 0.85 }}>
          <SlotCounter t={t} from={0} to={246} start={0.05} dur={1.0} th={th} seconds={seconds} />
        </div>
        <Pill text="Aufgaben · 16 erfahrene Entwickler" size={28} style={{ transform: `translateX(${(1 - soft(0.35)) * -700}px)` }} />
      </div>
      {/* two lanes: mit KI (orange) / ohne KI (grey); cards drop alternately */}
      {[{ x: 290, label: "mit KI", color: th.accent, a: laneA, logo: true }, { x: 790, label: "ohne KI", color: "#9C958A", a: laneB, logo: false }].map((L, j) => (
        <div key={j} style={{ position: "absolute", left: L.x - 200, top: 860, width: 400, display: "flex", justifyContent: "center", transform: `scale(${0.6 + 0.4 * L.a})`, opacity: Math.min(1, L.a * 1.8), zIndex: 300 }}>
          <Chunky w={330} h={92} radius={46} color={L.color} rim={j ? "#C9C2B6" : "#FFB08F"} t={t} glossR={j * 0.5}>
            <span style={{ fontFamily: fonts.bold, fontSize: 44, color: "#FFF", textShadow: "0 3px 0 rgba(0,0,0,0.15)" }}>{L.label}</span>
          </Chunky>
        </div>
      ))}
      <Drops t={t} n={8} every={0.4} start={0.2} xs={[200, 380, 700, 880]} floor={790} step={70} laneOf={(i) => [0, 2, 1, 3][i % 4]} render={(i, lane) => <TaskCard w={190} color={lane < 2 ? (i % 3 === 0 ? th.itemA : "#FFFFFF") : "#FFFFFF"} />} />
      <div style={{ position: "absolute", left: HW / 2 - 70, top: 600, zIndex: 400, transform: `scale(${soft(mitAt)})` }}>
        <BrandTile t={t} logo="claude" th={th} size={140} />
      </div>
    </DopaSplit>
  );
};

// ---------- 3 · "Mit KI waren sie neunzehn Prozent langsamer. Gefühlt waren sie zwanzig Prozent schneller." ----------
export const StZeit: React.FC<StProps> = ({ avatar, seconds = 4, beats = [0.9, 2.6] }) => {
  const { t, soft } = useT();
  const [a19, a20] = beats;
  const cardA = soft(-0.2, 12, 160);
  const cardB = soft(a20 - 0.45, 12, 160);
  const Card: React.FC<{ x: number; a: number; title: string; num: number; sign: string; word: string; color: string; at: number; speed: number; muted?: boolean }> = ({ x, a, title, num, sign, word, color, at, speed, muted }) => (
    <div style={{ position: "absolute", left: x, top: 280, width: 460, transform: `translateY(${(1 - a) * 500}px) rotate(${(1 - a) * (x < 500 ? -8 : 8)}deg)`, opacity: Math.min(1, a * 2) }}>
      <div style={{ background: th.card, borderRadius: 40, border: `6px solid ${muted ? th.line : color}`, boxShadow: "0 22px 44px rgba(60,30,0,0.14)", padding: "26px 24px 30px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, position: "relative", overflow: "hidden" }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 44, color: th.ink }}>{title}</span>
        <Stopwatch t={t} size={130} color={color} speed={speed} />
        <div style={{ transform: "scale(0.62)", transformOrigin: "50% 50%", height: 170 * 0.62, display: "flex", alignItems: "center" }}>
          <SlotCounter t={t} from={0} to={num} start={at} dur={0.7} prefix={sign} suffix="%" th={th} seconds={seconds} />
        </div>
        <Chunky w={330} h={78} radius={39} color={color} rim={muted ? "#C9C2B6" : "#FFB08F"} t={t} style={{ transform: `scale(${soft(at + 0.75, 11, 220)})` }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", textShadow: "0 3px 0 rgba(0,0,0,0.15)" }}>{word}</span>
        </Chunky>
        <Gloss t={t} speed={0.4} r={x / 1000} />
      </div>
    </div>
  );
  return (
    <DopaSplit avatar={avatar} seconds={seconds}>
      <Kicker text="Gemessen vs. gefühlt" t={t} />
      <Card x={60} a={cardA} title="Mit KI gemessen" num={19} sign="−" word="langsamer" color={RED} at={a19 - 0.5} speed={1.6} />
      <Card x={560} a={cardB} title="Gefühlt" num={20} sign="+" word="schneller" color={GREEN} at={a20 - 0.3} speed={0.6} muted />
      <div style={{ position: "absolute", left: 507, top: 560, width: 66, height: 66, borderRadius: 33, background: th.ink, color: "#FFF", fontFamily: fonts.bold, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${soft(a20 - 0.2, 10, 220)})`, zIndex: 50 }}>vs</div>
    </DopaSplit>
  );
};

// ---------- 4 · "Am meisten Zeit verloren haben die Leute bei Aufgaben, die sie schon hundertmal gemacht hatten." ----------
export const StRoutine: React.FC<StProps> = ({ avatar, seconds = 4, beats = [0.5, 2.6] }) => {
  const { t, soft } = useT();
  const [zeitAt, hundertAt] = beats;
  return (
    <DopaSplit avatar={avatar} seconds={seconds}>
      <Kicker text="Neues statt Routine" num="1" t={t} />
      {/* left: routine stack with 100× counter */}
      <Drops t={t} n={9} every={0.38} start={0.0} xs={[140, 340]} floor={880} step={64} render={(i) => <TaskCard w={200} label="Routine" color={i % 4 === 0 ? th.itemA : "#FFFFFF"} />} />
      <div style={{ position: "absolute", left: 30, top: 270, width: 420, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 300 }}>
        <div style={{ transform: "scale(0.8)", transformOrigin: "50% 0%", height: 170 * 0.8 }}>
          <SlotCounter t={t} from={0} to={100} start={hundertAt - 0.9} dur={0.9} suffix="×" th={th} seconds={seconds} />
        </div>
        <Pill text="schon gemacht" size={28} style={{ transform: `scale(${soft(hundertAt - 0.1, 11, 200)})` }} />
      </div>
      {/* right: time lost meter + stopwatch running fast */}
      <div style={{ position: "absolute", left: 500, top: 300, width: 520, background: th.card, borderRadius: 36, border: `2px solid ${th.line}`, boxShadow: "0 20px 44px rgba(0,0,0,0.08)", padding: "26px 30px 32px", boxSizing: "border-box", transform: `translateX(${(1 - soft(zeitAt - 0.3, 12, 140)) * 700}px)`, zIndex: 300, display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
        <Stopwatch t={t} size={150} color={RED} speed={2.4} />
        <Meter t={t} at={zeitAt} dur={2.2} fill={0.9} color={RED} w={450} label="Zeit verloren" numTxt={() => ""} />
        <Chunky w={360} h={84} radius={42} color={RED} rim="#FFB3B5" t={t} style={{ transform: `scale(${soft(zeitAt + 1.0, 11, 200)})` }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 42, color: "#FFF", textShadow: "0 3px 0 rgba(0,0,0,0.15)" }}>am meisten</span>
        </Chunky>
      </div>
    </DopaSplit>
  );
};

// ---------- 5 · "Deine Preise, deinen Ton, was bei dir nie passieren darf." ----------
export const StWissen: React.FC<StProps> = ({ avatar, seconds = 3.5, beats = [0.2, 1.0, 1.9] }) => {
  const { t, soft } = useT();
  const items = [
    { at: beats[0], sym: "€", label: "Preise", color: "#F2C14E", rim: "#FFF3B8", ink: "#8A5A0B" },
    { at: beats[1], sym: "Aa", label: "Ton", color: th.accent, rim: "#FFB08F", ink: "#FFF" },
    { at: beats[2], sym: "!", label: "No-Gos", color: RED, rim: "#FFB3B5", ink: "#FFF" },
  ];
  const fillAt = beats[2] + 0.5;
  return (
    <DopaSplit avatar={avatar} seconds={seconds}>
      <Kicker text="Stilles Wissen" num="2" t={t} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", gap: 40 }}>
        {items.map((it, i) => {
          const a = soft(it.at - 0.1, 10, 200);
          const fly = rampE(t, fillAt + i * 0.12, fillAt + 0.45 + i * 0.12, Easing.in(Easing.cubic));
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, transform: `translate(${(1 - i) * 290 * fly}px, ${fly * 330}px) scale(${a * (1 - 0.6 * fly)})`, opacity: Math.min(1, a * 2) * (1 - fly * 0.9) }}>
              <Chunky w={220} h={220} radius={56} color={it.color} rim={it.rim} t={t} glossR={i * 0.4}>
                <span style={{ fontFamily: fonts.bold, fontSize: 120, color: it.ink, textShadow: "0 5px 0 rgba(0,0,0,0.12)", transform: `scale(${1 + 0.1 * bump(t, it.at, 0.4)})` }}>{it.sym}</span>
              </Chunky>
              <span style={{ fontFamily: fonts.bold, fontSize: 46, color: th.ink }}>{it.label}</span>
            </div>
          );
        })}
      </div>
      {/* the doc they fly into */}
      <div style={{ position: "absolute", left: 190, top: 690, width: 700, background: th.card, borderRadius: 30, border: `5px solid ${th.accent}`, boxShadow: "0 20px 40px rgba(60,30,0,0.14)", padding: "18px 28px 22px", boxSizing: "border-box", transform: `translateY(${(1 - soft(beats[1], 12, 140)) * 400}px) scale(${1 + 0.05 * bump(t, fillAt + 0.45, 0.4)})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 36, color: th.ink }}>mein-wissen.md</span>
          <BrandTile t={t} logo="claude" th={th} size={60} />
        </div>
        <Meter t={t} at={fillAt + 0.3} dur={1.0} fill={1} color={GREEN} w={640} label="Claude kennt es" numTxt={(p) => `${Math.round(p * 100)} %`} />
      </div>
    </DopaSplit>
  );
};

// ---------- 6 · "Weniger als die Hälfte von dem, was die KI geliefert hat, wurde übernommen. Der Rest war Nacharbeit." ----------
export const StHaelfte: React.FC<StProps> = ({ avatar, seconds = 4.5, beats = [0.3, 2.6, 3.3] }) => {
  const { t, soft } = useT();
  const [startAt, uebAt, restAt] = beats;
  // KI output cards: 4 of 10 go right into "übernommen" (green), 6 go into "Nacharbeit" (red)
  const accepted = (i: number) => [1, 4, 6, 9].includes(i % 10);
  return (
    <DopaSplit avatar={avatar} seconds={seconds}>
      <Kicker text="Kleiner schneiden" num="3" t={t} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 255, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 300 }}>
        <div style={{ transform: "scale(0.85)", transformOrigin: "50% 0%", height: 170 * 0.85 }}>
          <SlotCounter t={t} from={0} to={44} start={uebAt - 0.9} dur={0.8} suffix="%" th={th} seconds={seconds} />
        </div>
        <Pill text="unter 44 % übernommen · METR 2025" size={26} style={{ transform: `translateX(${(1 - soft(uebAt - 0.1)) * -800}px)` }} />
      </div>
      {[{ x: 280, label: "übernommen", color: GREEN, rim: "#A6E3BF", at: uebAt - 0.2 }, { x: 800, label: "Nacharbeit", color: RED, rim: "#FFB3B5", at: restAt - 0.2 }].map((L, j) => {
        const a = soft(L.at, 11, 190);
        return (
          <div key={j} style={{ position: "absolute", left: L.x - 200, top: 880, width: 400, display: "flex", justifyContent: "center", transform: `scale(${0.6 + 0.4 * a})`, opacity: Math.min(1, 0.35 + a), zIndex: 300 }}>
            <Chunky w={340} h={88} radius={44} color={L.color} rim={L.rim} t={t} glossR={j * 0.5}>
              <span style={{ fontFamily: fonts.bold, fontSize: 42, color: "#FFF", textShadow: "0 3px 0 rgba(0,0,0,0.15)" }}>{L.label}</span>
            </Chunky>
          </div>
        );
      })}
      <Drops t={t} n={10} every={0.36} start={startAt} xs={[200, 360, 720, 880]} floor={800} step={70} laneOf={(i) => (accepted(i) ? (i % 2 ? 0 : 1) : i % 2 ? 2 : 3)} render={(i) => <TaskCard w={190} label="KI" color={accepted(i) ? "#FFFFFF" : "#FFFFFF"} />} />
      <div style={{ position: "absolute", left: HW / 2 - 70, top: 560, zIndex: 400 }}>
        <BrandTile t={t} logo="claude" th={th} size={140} />
      </div>
    </DopaSplit>
  );
};

// ---------- 7 · Save card (3 s): "Speicher dir die drei Regeln." ----------
export const StSave: React.FC<StProps> = ({ avatar, seconds = 3, beats = [0.15, 0.45, 0.75] }) => {
  const { t, soft } = useT();
  const rows = ["Neues statt Routine", "Stilles Wissen aufschreiben", "Aufgabe kleiner schneiden"];
  const bm = soft(-0.2, 10, 200);
  return (
    <DopaSplit avatar={avatar} seconds={seconds}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
        {/* bookmark icon */}
        <div style={{ width: 70, height: 90, transform: `scale(${bm}) rotate(${(1 - bm) * -20}deg)`, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, #FF8A5C, ${th.accent})`, clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 74%, 0 100%)", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }} />
        </div>
        <span style={{ fontFamily: fonts.bold, fontSize: 66, color: th.ink, letterSpacing: -1.5 }}>Speicher dir das</span>
      </div>
      <div style={{ position: "absolute", left: 70, top: 300, width: 940, display: "flex", flexDirection: "column", gap: 26 }}>
        {rows.map((r, i) => {
          const a = soft(beats[i], 11, 190);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, background: th.card, borderRadius: 34, border: `3px solid ${th.line}`, boxShadow: "0 16px 34px rgba(60,30,0,0.10)", padding: "22px 28px", transform: `translateX(${(1 - a) * 1100}px)`, position: "relative", overflow: "hidden" }}>
              <Chunky w={104} h={104} radius={30} color={th.accent} rim="#FFB08F" t={t} glossR={i * 0.3}>
                <span style={{ fontFamily: fonts.bold, fontSize: 64, color: "#FFF", textShadow: "0 4px 0 rgba(0,0,0,0.15)" }}>{i + 1}</span>
              </Chunky>
              <span style={{ fontFamily: fonts.bold, fontSize: 52, color: th.ink, letterSpacing: -1, whiteSpace: "nowrap" }}>{r}</span>
              <div style={{ position: "absolute", right: 30, top: "50%", transform: `translateY(-50%) scale(${soft(beats[i] + 0.35, 10, 220)})`, width: 54, height: 54, borderRadius: 27, background: GREEN, color: "#FFF", fontFamily: fonts.bold, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${18 * bump(t, beats[i] + 0.35, 0.6)}px ${GREEN}` }}>✓</div>
            </div>
          );
        })}
      </div>
    </DopaSplit>
  );
};

export const stMetadata = ({ props }: { props: StProps }) => ({ durationInFrames: Math.round((props.seconds ?? 3.5) * 25) });

// ---------- 3b · Originalgrafik METR Fig. 1 (Henri 2026-10-09: Studienbeleg = Screenshot + Zoom + roter Kreis) ----------
// public/metr-2507-09089-fig1.png = Figure 1 aus arXiv 2507.09089 (CC BY 4.0), 2224x1140 px, unverändert ausgeschnitten.
const FIG_W = 2224, FIG_H = 1140;
const Ring: React.FC<{ t: number; at: number; x: number; y: number; r: number; color?: string; sw?: number }> = ({ t, at, x, y, r, color = RED, sw = 16 }) => {
  const p = rampE(t, at, at + 0.55, Easing.inOut(Easing.cubic));
  if (p <= 0) return null;
  const C = 2 * Math.PI * r;
  return (
    <svg style={{ position: "absolute", left: x - r - sw, top: y - r * 0.85 - sw, overflow: "visible" }} width={2 * r + 2 * sw} height={1.7 * r + 2 * sw}>
      <ellipse cx={r + sw} cy={r * 0.85 + sw} rx={r} ry={r * 0.85} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform={`rotate(-80 ${r + sw} ${r * 0.85 + sw})`} />
    </svg>
  );
};
export const StGrafik: React.FC<StProps> = ({ avatar, seconds = 3.67, beats = [0.59, 2.52] }) => {
  const { t, soft } = useT();
  const [a19, a20] = beats;
  const CW = 980; // card inner width
  const base = CW / FIG_W;
  const CH = Math.round(FIG_H * base);
  // zoom from the whole figure into the core: "Developer estimates after study" vs "Observed result"
  const z = rampE(t, 0.95, 1.75, Easing.inOut(Easing.cubic));
  const s = base * (1 + 0.6 * z);
  const fx = 1700, fy = 700; // focus point in figure px
  const tx = (CW / 2 - fx * s) * z + 0 * (1 - z);
  const ty = (CH / 2 - fy * s) * z + 0 * (1 - z);
  const enter = soft(-0.3, 13, 160);
  return (
    <DopaSplit avatar={avatar} seconds={seconds}>
      <Kicker text="Die Originalgrafik" t={t} top={120} />
      <div style={{ position: "absolute", left: (HW - CW - 28) / 2, top: 230, width: CW + 28, padding: 14, boxSizing: "border-box", background: "#FFF", borderRadius: 28, border: `2px solid ${th.line}`, boxShadow: "0 22px 44px rgba(60,30,0,0.14)", transform: `translateY(${(1 - enter) * 500}px)`, zIndex: 300 }}>
        <div style={{ width: CW, height: CH, overflow: "hidden", position: "relative", borderRadius: 16 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: FIG_W, height: FIG_H, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
            <img src={staticFile("metr-2507-09089-fig1.png")} style={{ width: FIG_W, height: FIG_H, display: "block" }} />
            <Ring t={t} at={a19 - 0.1} x={1974} y={796} r={120} />
            <Ring t={t} at={a20 - 0.2} x={1558} y={433} r={110} color={GREEN} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230 + CH + 50, display: "flex", justifyContent: "center", gap: 24, zIndex: 400 }}>
        <Chunky w={470} h={84} radius={42} color={RED} rim="#FFB3B5" t={t} style={{ transform: `scale(${soft(a19 + 0.3, 11, 200)})` }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 34, color: "#FFF", whiteSpace: "nowrap" }}>gemessen: 19 % langsamer</span>
        </Chunky>
        <Chunky w={470} h={84} radius={42} color={GREEN} rim="#A6E3BF" t={t} style={{ transform: `scale(${soft(a20, 11, 200)})` }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 34, color: "#FFF", whiteSpace: "nowrap" }}>gefühlt: 20 % schneller</span>
        </Chunky>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230 + CH + 160, textAlign: "center", fontFamily: fonts.semibold, fontSize: 24, color: th.dim, zIndex: 400 }}>Grafik: METR (2025), arXiv 2507.09089, CC BY 4.0</div>
    </DopaSplit>
  );
};
