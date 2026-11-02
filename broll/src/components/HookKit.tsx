import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { AvatarSrc, serifItalic } from "./PanelKit";
import { SIMPLE_ICONS } from "./logoPaths";
import { GptHook } from "./GptHook";

// HookKit (Henri 2026-10-08): the "Dopamin"-Hook-B-Roll for ALL normal reels (FP-N, GPT-N, BX-C), never satire.
// Full-frame 1080x1920, starts at frame 0, everything important visible and moving by 2 s at the latest.
// Learned from the tonyma.ai reel DeNai0koDUk (hook 0-5 s only): calm cream background, black slot counter on top,
// one brand tile in the middle with a growing pile of small items around it, big word-by-word type at the bottom
// (bold grotesk + serif italic for numbers), optional people row / waffle grid.
// v2 (Henri same day: "animier mal noch etwas mehr"): constant camera push + drift with parallax per layer,
// 3D flip + motion blur on the counter digits, scale punch + glow on arrival, "+ €" ticks, coins land with a
// bounce, card springs in, empty bar shivers, optional line chart that draws itself, accent underline that draws,
// drifting background, whip-out at the end so the cut to the speaker sits. A new event every ~0.3-0.5 s.
// Rules: no explosions, no confetti, no emojis/smileys. Springs with high damping (small overshoot only).

export const HW = 1080;
export const HH = 1920;

export type HookPreset = "fp" | "gpt" | "boilr";
type Theme = { bg: string; grid: string; ink: string; dim: string; card: string; line: string; accent: string; accentSoft: string; tile: string; tileInk: string; itemA: string; itemB: string; edge: string; warn: string };
export const HOOK_THEMES: Record<HookPreset, Theme> = {
  // Superkind-tauglich: cream + Superkind orange.
  fp: { bg: "#F3EEE6", grid: "rgba(20,20,19,0.05)", ink: "#141413", dim: "#8C857B", card: "#FFFFFF", line: "#E6DFD3", accent: "#FF6B35", accentSoft: "#FFD9C7", tile: "#FF6B35", tileInk: "#FFFFFF", itemA: "#FF8A5C", itemB: "#FFFFFF", edge: "#E0D6C6", warn: "#E5484D" },
  // @florentgpt: neutral off-white + ChatGPT green, nothing Superkind.
  gpt: { bg: "#F2F1EC", grid: "rgba(13,13,13,0.05)", ink: "#0D0D0D", dim: "#8A8A85", card: "#FFFFFF", line: "#E3E2DC", accent: "#10A37F", accentSoft: "#CDEFE4", tile: "#10A37F", tileInk: "#FFFFFF", itemA: "#E3B652", itemB: "#C9962E", edge: "#A87A1F", warn: "#E5484D" },
  // Felix x boilr (BX-C): white + boilr green (10,95,69) / mint frame #5FD3A0, gold only for money. Nothing Superkind.
  boilr: { bg: "#F4F6F3", grid: "rgba(10,40,30,0.05)", ink: "#0B1F18", dim: "#7F8A85", card: "#FFFFFF", line: "#DFE6E1", accent: "#0A5F45", accentSoft: "#CFEFE0", tile: "#0A5F45", tileInk: "#FFFFFF", itemA: "#E3B652", itemB: "#C9962E", edge: "#A87A1F", warn: "#E5484D" },
};

/** One word of the bottom line. `em` = serif italic in the accent colour + drawn underline. `br` = line break before. `page` = clears earlier pages. */
export type HookWord = { w: string; at: number; em?: boolean; br?: boolean; page?: number };
export type HookBar = { label: string; fill: number; num?: number; decimals?: number; prefix?: string; suffix?: string; muted?: boolean };
export type HookChart = { at?: number; badge?: string; withLabel?: string; withoutLabel?: string; growth?: number };
export type DopamineHookProps = {
  seconds?: number;
  preset?: HookPreset;
  counterFrom?: number;
  counterTo?: number;
  counterPrefix?: string;
  counterSuffix?: string;
  counterLabel?: string; // small chip under the counter, e.g. "pro Jahr · Beispiel bei 10.000 €"
  counterStart?: number; // s
  counterDur?: number; // s
  ticks?: { text: string; every?: number } | null; // small "+ €" pills gliding up after the counter landed
  words?: HookWord[];
  bars?: HookBar[];
  barsTitle?: string;
  barsBadge?: string; // e.g. "Beispiel"
  chart?: HookChart | null; // mini line chart (with vs. without) in the right column of the bars card
  logo?: "openai" | "claude" | null; // brand tile in the middle (logoPaths.ts); null = neutral tile with `tileText`
  tileText?: string;
  pile?: "coins" | "cards" | "receipts" | "none";
  pileEvery?: number; // s between two items
  people?: { at: number; n?: number; label?: string } | null;
  waffle?: { at: number; pct: number; label?: string } | null; // replaces bars when set
  topSafe?: number; // px kept free on top for the pipeline's text-hook box (GptHook ~9 %-20 %)
  camera?: boolean; // slow push-in + drift + parallax (default on)
  whipOut?: boolean; // whip pan out in the last 0.3 s, so the cut to the speaker sits (default on)
  textHook?: string; // preview only: draw the GptHook box ourselves (the pipeline draws it in production)
  // Split (Henri 2026-10-08 "am Anfang als Splitscreen"): animation in the top panel, the speaker below, pipeline
  // captions as pill on the seam (broll window "layout":"split"). Default "split"; without `avatar` it falls back to "full".
  layout?: "split" | "full";
  avatar?: AvatarSrc; // tightened avatar in public/, startSec = window start (same as PanelSplit)
  panelFrac?: number; // panel height as fraction of 1920 (default 0.52)
  avatarLabel?: string; // preview only, e.g. "Platzhalter"
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.out(Easing.cubic);
const rampE = (t: number, a: number, b: number, e = out) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
// Deterministic pseudo-random.
const rnd = (i: number, s = 1) => {
  const x = Math.sin(i * 127.1 * s + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
// number locale: de-DE by default, en-GB for the English boilr preset (set per render in DopamineHookScene)
let FMT_LOCALE = "de-DE";
export const setHookLocale = (l: "de-DE" | "en-GB") => { FMT_LOCALE = l; };
const fmt = (v: number, d = 0) => v.toLocaleString(FMT_LOCALE, { minimumFractionDigits: d, maximumFractionDigits: d });
/** Decaying bump 0→1→0 that starts at `at` and lasts `d` s (for punches / glows). */
const bump = (t: number, at: number, d: number) => (t < at || t > at + d ? 0 : Math.sin(Math.PI * Math.sqrt((t - at) / d)) * (1 - (t - at) / d) * 1.6);

/** High-damping spring 0→1 starting at second `at`. damping ~12 = small overshoot, ~20 = none. */
const useSoft = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (at: number, damping = 18, stiffness = 140) => spring({ frame: frame - Math.round(at * fps), fps, config: { damping, stiffness, mass: 0.7 } });
};

// ---------- Slot counter: rolling digits with motion blur, 3D flip, punch + glow, ticks ----------

const DIG_H = 150;
const Strip: React.FC<{ pos: number; opacity: number; dy?: number }> = ({ pos, opacity, dy = 0 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 10 - pos * DIG_H + dy, opacity }}>
    {Array.from({ length: 11 }).map((_, d) => (
      <div key={d} style={{ height: DIG_H, lineHeight: `${DIG_H}px`, textAlign: "center", fontFamily: fonts.bold, fontSize: 124, color: "#FFF", letterSpacing: -2 }}>{d % 10}</div>
    ))}
  </div>
);
const Digit: React.FC<{ pos: number; speed: number; dimmed: boolean; flip: number; glow: number; th: Theme }> = ({ pos, speed, dimmed, flip, glow, th }) => {
  // vertical motion blur: ghost copies along the roll direction + a little blur, both scale with the roll speed (digits/frame)
  const blur = Math.min(1, Math.abs(speed) / 1.2);
  const ghosts = blur > 0.05 ? [-2, -1, 1, 2] : [];
  return (
    <div style={{ perspective: 600 }}>
      <div style={{ width: 118, height: 170, borderRadius: 22, background: th.ink, position: "relative", overflow: "hidden", transform: `rotateX(${flip}deg)`, boxShadow: `0 14px 30px rgba(0,0,0,0.18), 0 0 ${glow * 50}px ${glow * 10}px ${th.itemA}BB, inset 0 -6px 0 rgba(255,255,255,0.06)` }}>
        <div style={{ position: "absolute", inset: 0, filter: blur > 0.05 ? `blur(${blur * 3.2}px)` : undefined, opacity: dimmed ? 0.22 : 1 }}>
          <Strip pos={pos} opacity={1 - blur * 0.35} />
          {ghosts.map((g) => <Strip key={g} pos={pos} opacity={0.22 * blur} dy={g * 26 * blur} />)}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 84, height: 2, background: "rgba(0,0,0,0.45)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.45) 100%)" }} />
        {/* light sweep across the flap while it flips */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.18), transparent 50%)", opacity: Math.min(1, Math.abs(flip) / 40) }} />
      </div>
    </div>
  );
};
const SymTile: React.FC<{ s: string; th: Theme; glow: number; flip: number }> = ({ s, th, glow, flip }) => (
  <div style={{ perspective: 600 }}>
    <div style={{ minWidth: 104, height: 170, padding: "0 14px", boxSizing: "border-box", borderRadius: 22, background: th.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 104, color: th.accent, transform: `rotateX(${flip}deg)`, boxShadow: `0 14px 30px rgba(0,0,0,0.18), 0 0 ${glow * 50}px ${glow * 10}px ${th.itemA}BB` }}>{s}</div>
  </div>
);

export const SlotCounter: React.FC<{ t: number; from: number; to: number; start: number; dur: number; prefix?: string; suffix?: string; th: Theme; ticks?: { text: string; every?: number } | null; seconds?: number }> = ({ t, from, to, start, dur, prefix, suffix, th, ticks, seconds = 4.5 }) => {
  const soft = useSoft();
  const { fps } = useVideoConfig();
  // Slot reels (2026-10-08): every reel spins fast and the reels lock one after another from left to right,
  // each with a small overshoot; after the last lock a short gold glow + punch over the whole counter.
  const target = String(Math.round(Math.abs(to)));
  const fromS = String(Math.round(Math.abs(from))).padStart(target.length, "0").slice(-target.length);
  const n = target.length;
  const SPIN = 18; // digits per second while spinning
  const lockAt = (i: number) => start + dur * (n === 1 ? 1 : 0.55 + (0.45 * i) / (n - 1));
  const end = lockAt(n - 1);
  const wrap = (x: number) => ((x % 10) + 10) % 10;
  const reel = (i: number, tt: number) => {
    const tgt = Number(target[i]);
    if (tt < start) return Number(fromS[i]);
    const L = lockAt(i);
    if (tt < L) return wrap(tgt - SPIN * (L - tt));
    const d = tt - L; // overshoot past the target, then settle back
    return wrap(tgt + 0.32 * Math.sin(Math.min(d, 0.35) / 0.35 * Math.PI) * Math.exp(-d * 6));
  };
  const glow = bump(t, end - 0.02, 0.9);
  const tiles: React.ReactNode[] = [];
  let idx = 0;
  const flipFor = (i: number, lock?: number) => {
    // staggered drop-in with overshoot at the start, a short flap flip when the reel locks
    const enter = soft(-0.35 + i * 0.06, 12, 170);
    const L = lock ?? end + i * 0.05;
    const land = soft(L, 14, 260);
    return (1 - enter) * -95 + (t >= L ? (1 - land) * -55 : 0);
  };
  if (prefix) tiles.push(<SymTile key="pre" s={prefix} th={th} glow={glow} flip={flipFor(idx++)} />);
  for (let i = 0; i < n; i++) {
    const k = n - 1 - i;
    const pos = reel(i, t);
    let speed = pos - reel(i, t - 1 / fps);
    if (speed < -5) speed += 10;
    if (speed > 5) speed -= 10;
    const L = lockAt(i);
    const lockPunch = 1 + 0.07 * bump(t, L, 0.3);
    tiles.push(<div key={k} style={{ transform: `scale(${lockPunch})` }}><Digit pos={pos} speed={speed} dimmed={false} flip={flipFor(idx++, L)} glow={glow} th={th} /></div>);
    if (k > 0 && k % 3 === 0) tiles.push(<div key={`s${k}`} style={{ width: 22, height: 170, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 20, boxSizing: "border-box" }}>{FMT_LOCALE === "en-GB" ? <div style={{ width: 13, height: 26, borderRadius: "7px 7px 7px 2px", background: th.ink, transform: "translateY(10px) skewX(-14deg)" }} /> : <div style={{ width: 14, height: 14, borderRadius: 7, background: th.ink }} />}</div>);
  }
  if (suffix) tiles.push(<SymTile key="suf" s={suffix} th={th} glow={glow} flip={flipFor(idx++)} />);
  const punch = 1 + 0.08 * bump(t, end, 0.5);
  const tickEvery = ticks?.every ?? 0.5;
  const tickEls: React.ReactNode[] = [];
  if (ticks) {
    for (let s = end + 0.25, j = 0; s < seconds; s += tickEvery, j++) {
      const u = (t - s) / 1.0;
      if (u < 0 || u > 1) continue;
      const a = soft(s, 12, 200);
      tickEls.push(
        <div key={j} style={{ position: "absolute", left: "50%", top: 0, transform: `translate(${(j % 2 ? 1 : -1) * (390 + (j % 3) * 20) - 55}px, ${110 - u * 110}px) scale(${0.6 + 0.4 * a})`, opacity: Math.min(1, a * 2) * (1 - Math.max(0, u - 0.6) / 0.4), fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: th.accent, borderRadius: 999, padding: "8px 22px", whiteSpace: "nowrap", boxShadow: `0 8px 20px ${th.accent}55` }}>{ticks.text}</div>,
      );
    }
  }
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center", transform: `scale(${punch})` }}>{tiles}</div>
      {tickEls}
    </div>
  );
};

// ---------- Brand tile + growing pile ----------

// Casino coin (Henri 2026-10-08 "wie bei Casino-Slot-Animations"): thick reeded gold edge, embossed €, radial gold,
// soft drop shadow. sx = horizontal squash of the face (spin around the vertical axis), sy = 1 front view .. 0.34 lying flat,
// (edx, edy) = where the back face sits (edge thickness direction), gloss = 0..1 position of the light sweep.
const GOLD = { hi: "#FFF3B8", mid: "#F2C14E", lo: "#C8901E", deep: "#8A5A0B", edge: "#B47A12" };
const Coin3D: React.FC<{ d: number; sx: number; sy: number; edx: number; edy: number; gloss: number; shadow?: number }> = ({ d, sx, sy, edx, edy, gloss, shadow = 1 }) => {
  const rx = (d / 2) * Math.max(0.05, sx);
  const ry = (d / 2) * sy;
  const reedV = `repeating-linear-gradient(90deg, ${GOLD.lo} 0px, ${GOLD.mid} 3px, ${GOLD.deep} 5px, ${GOLD.lo} 7px)`;
  const reedH = `repeating-linear-gradient(0deg, ${GOLD.lo} 0px, ${GOLD.mid} 3px, ${GOLD.deep} 5px, ${GOLD.lo} 7px)`;
  const ell = (cx: number, cy: number, bg: string, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: cx - rx, top: cy - ry, width: rx * 2, height: ry * 2, borderRadius: "50%", background: bg, ...extra });
  return (
    <div style={{ position: "relative", width: 0, height: 0, filter: shadow ? `drop-shadow(0 ${6 * shadow}px ${8 * shadow}px rgba(90,60,0,0.35))` : undefined }}>
      {/* back face + the edge band between back and front = coin thickness */}
      <div style={ell(edx, edy, GOLD.edge)} />
      {Math.abs(edy) > 0.5 ? <div style={{ position: "absolute", left: -rx, top: Math.min(0, edy), width: rx * 2, height: Math.abs(edy), background: reedV }} /> : null}
      {Math.abs(edx) > 0.5 ? <div style={{ position: "absolute", top: -ry, left: Math.min(0, edx), height: ry * 2, width: Math.abs(edx), background: reedH }} /> : null}
      <div style={ell(edx, edy, reedV, { opacity: 0.9 })} />
      {/* front face */}
      <div style={ell(0, 0, `radial-gradient(ellipse at 38% 32%, ${GOLD.hi} 0%, ${GOLD.mid} 38%, ${GOLD.lo} 78%, ${GOLD.deep} 100%)`, { overflow: "hidden", boxShadow: `inset 0 0 0 ${d * 0.055}px ${GOLD.lo}, inset 0 0 0 ${d * 0.075}px ${GOLD.hi}88` })}>
        {/* fine reeded rim */}
        <div style={{ position: "absolute", inset: d * 0.02, borderRadius: "50%", background: `repeating-conic-gradient(${GOLD.deep}55 0deg 3deg, transparent 3deg 7deg)`, WebkitMaskImage: "radial-gradient(circle, transparent 62%, black 64%)", maskImage: "radial-gradient(circle, transparent 62%, black 64%)" }} />
        {/* embossed € */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: d * 0.5, color: GOLD.lo, lineHeight: 1, textShadow: `-${d * 0.012}px -${d * 0.012}px 0 ${GOLD.hi}, ${d * 0.015}px ${d * 0.015}px 0 ${GOLD.deep}88` }}>{FMT_LOCALE === "en-GB" ? "£" : "€"}</div>
        {/* light sweep */}
        <div style={{ position: "absolute", top: "-20%", bottom: "-20%", width: "40%", left: `${-50 + gloss * 160}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,240,0.75), transparent)", transform: "rotate(18deg)" }} />
      </div>
    </div>
  );
};
/** 4-point glint (single light sparkle, not confetti). */
const Glint: React.FC<{ k: number; size: number }> = ({ k, size }) => {
  if (k <= 0 || k >= 1) return null;
  const a = Math.sin(Math.PI * k);
  const s = size * (0.5 + a);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(-50%,-50%) rotate(${k * 90}deg)`, opacity: a }}>
      <div style={{ position: "absolute", left: -s / 2, top: -size * 0.06, width: s, height: size * 0.12, borderRadius: 99, background: "linear-gradient(90deg, transparent, #FFFDF0, transparent)" }} />
      <div style={{ position: "absolute", top: -s / 2, left: -size * 0.06, height: s, width: size * 0.12, borderRadius: 99, background: "linear-gradient(0deg, transparent, #FFFDF0, transparent)" }} />
      <div style={{ position: "absolute", left: -size * 0.3, top: -size * 0.3, width: size * 0.6, height: size * 0.6, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,250,220,0.95), rgba(255,220,120,0) 70%)" }} />
    </div>
  );
};
const Card: React.FC<{ th: Theme; i: number; kind: "cards" | "receipts" }> = ({ th, i, kind }) => {
  const orange = kind === "cards" && i % 3 === 0;
  const w = kind === "cards" ? 92 : 78;
  return (
    <div style={{ width: w, height: w * 1.25, borderRadius: 10, background: orange ? th.itemA : "#FFFFFF", border: `1.5px solid ${orange ? "rgba(0,0,0,0.06)" : th.line}`, boxShadow: "0 6px 14px rgba(0,0,0,0.10)", padding: 12, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 7 }}>
      {[0.8, 0.55, 0.7, 0.4].map((k, j) => <div key={j} style={{ width: `${k * 100}%`, height: 6, borderRadius: 3, background: orange ? "rgba(255,255,255,0.7)" : j === 3 && kind === "receipts" ? th.ink : "#DDD8CF" }} />)}
    </div>
  );
};

export const Pile: React.FC<{ t: number; kind: "coins" | "cards" | "receipts"; every: number; cx: number; cy: number; th: Theme; seconds: number; size?: number; stackDx?: number[]; dropFrom?: number; floor?: number; front?: number[]; gravity?: number }> = ({ t, kind, every, cx, cy, th, seconds, size = 1, stackDx = [-360, -200, 200, 360], dropFrom = -120, floor, front = [], gravity = 6000 }) => {
  const total = Math.ceil(seconds / every) + 2;
  const items: React.ReactNode[] = [];
  // Henri 2026-10-08: coins fall straight down (gravity) spinning like casino coins, land with a solid bounce,
  // a glint, the tower wobbles a little, and they stack coin by coin into real-looking money towers next to the tile.
  const G = gravity; // px/s² — ~0.6 s for a fall through the whole frame/panel
  const D = 160 * size; // coin diameter
  const LH = D * 0.15; // stack height per coin
  const baseY = floor ?? cy + 150 * size;
  // back-row towers sit a bit higher (depth), front-row towers draw over them
  const stacks = stackDx.map((dx, j) => ({ x: cx + dx, y: baseY - (front.length && !front.includes(j) ? 24 * size : (j % 2) * 5 * size), front: front.includes(j) }));
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const mul = [5, 7, 3, 2, 1].find((m) => gcd(m, stacks.length) === 1) ?? 1;
  const towerOf = (i: number) => (i * mul) % stacks.length;
  // landing time per coin (needed for the tower wobble)
  const info = Array.from({ length: total }).map((_, i) => {
    const s0 = 0.05 + i * every;
    const st = stacks[towerOf(i)];
    const level = Math.floor(i / stacks.length);
    const ty = kind === "coins" ? st.y - level * LH : cy + 40;
    const fall = Math.sqrt((2 * Math.max(60, ty - dropFrom)) / G);
    return { s0, tower: towerOf(i), level, ty, fall, land: s0 + fall };
  });
  for (let i = 0; i < total; i++) {
    const { s0: s, ty: ty0, fall, land, tower, level } = info[i];
    if (t < s) continue;
    const tf = Math.min(t - s, fall);
    const k = tf / fall;
    const u = (t - land) / 0.35;
    const bounce = u > 0 && u < 1 ? Math.abs(Math.sin(Math.PI * u * 2)) * 22 * size * Math.pow(1 - u, 1.6) : 0;
    const squash = u > 0 && u < 0.2 ? 1 - 0.22 * Math.sin((Math.PI * u) / 0.2) : 1;
    if (kind !== "coins") {
      const ang = rnd(i, 5) * Math.PI * 2;
      const r = 170 + Math.min(240, 40 + i * 3.2) * rnd(i, 6);
      const tx = Math.max(70, Math.min(HW - 70, cx + Math.cos(ang) * r * 1.3));
      const ty = cy + 40 + Math.sin(ang) * r * 0.42 + Math.min(60, i * 0.9);
      const f2 = Math.sqrt((2 * Math.max(60, ty - dropFrom)) / G);
      const tf2 = Math.min(t - s, f2);
      const y = dropFrom + 0.5 * G * tf2 * tf2;
      const rot = (rnd(i, 7) - 0.5) * 50 + (1 - tf2 / f2) * 160 * (rnd(i, 10) - 0.5);
      items.push(<div key={i} style={{ position: "absolute", left: tx, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${size})`, zIndex: 2 }}><Card th={th} i={i} kind={kind} /></div>);
      continue;
    }
    const st = stacks[tower];
    // tower wobble: after the latest landing on this tower, the whole tower sways a little (more at the top)
    let lastLand = -1;
    for (const o of info) if (o.tower === tower && o.land <= t && o.land > lastLand) lastLand = o.land;
    const w = lastLand >= 0 ? t - lastLand : 9;
    const wob = Math.sin(w * 30) * Math.exp(-w * 7) * Math.min(9, 1.2 * level) * size;
    const tx = st.x + (rnd(i, 3) - 0.5) * 12 * size + (k >= 1 ? wob : (rnd(i, 12) - 0.5) * 30 * size * (1 - k));
    const y = (k < 1 ? dropFrom + 0.5 * G * tf * tf : ty0) - bounce;
    // spin around the vertical axis while falling, then tip over into the flat stack pose in the last 25 %
    const spins = 1.5 + rnd(i, 13) * 1.2;
    const theta = k * spins * Math.PI * 2;
    const tip = interpolate(k, [0.72, 1], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    const sx = (1 - tip) * Math.abs(Math.cos(theta)) + tip;
    const sy = (1 - tip) * 1 + tip * 0.34 * squash;
    const thick = D * 0.15;
    const edx = (1 - tip) * thick * Math.sin(theta) * 0.9;
    const edy = tip * thick * (1 + (1 - squash));
    const gloss = (k * spins * 1.2 + i * 0.3) % 1;
    const glint = (t - land) / 0.32;
    items.push(
      <div key={i} style={{ position: "absolute", left: tx, top: y, transform: `rotate(${(rnd(i, 4) - 0.5) * (k >= 1 ? 3 : 20)}deg)`, zIndex: (st.front ? 1000 : 10) + i }}>
        <Coin3D d={D} sx={sx} sy={sy} edx={edx} edy={edy} gloss={gloss} shadow={k >= 1 ? 0.6 : 1} />
        <div style={{ position: "absolute", left: D * 0.3, top: -D * 0.12 }}><Glint k={glint} size={D * 0.55} /></div>
      </div>,
    );
  }
  return <>{items}</>;
};

export const BrandTile: React.FC<{ t: number; logo: "openai" | "claude" | null; text?: string; th: Theme; size?: number }> = ({ t, logo, text, th, size = 220 }) => {
  const soft = useSoft();
  const a = soft(-0.3, 11, 150); // flies up with a small overshoot, already visible at frame 0
  const breathe = 1 + 0.02 * Math.sin(t * 3.1);
  const bob = Math.sin(t * 2.4) * 6;
  const tilt = Math.sin(t * 1.7) * 3;
  const ic = logo ? SIMPLE_ICONS[logo] : null;
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.26, background: th.tile, boxShadow: `0 24px 50px rgba(0,0,0,0.16), inset 0 -8px 0 rgba(0,0,0,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${(1 - a) * 260 + bob}px) rotate(${tilt}deg) scale(${(0.7 + 0.3 * a) * breathe})`, opacity: Math.min(1, a * 1.5) }}>
      {ic ? (
        <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" style={{ transform: `rotate(${t * 20}deg)` }}><path d={ic.d} fill={th.tileInk} /></svg>
      ) : (
        <span style={{ fontFamily: fonts.bold, fontSize: size * 0.36, color: th.tileInk }}>{text ?? "%"}</span>
      )}
    </div>
  );
};

// ---------- Progress bars (+ optional line chart) / waffle / people ----------

const Badge: React.FC<{ text: string; t: number; at: number; th: Theme }> = ({ text, t, at, th }) => {
  const soft = useSoft();
  const a = soft(at, 10, 220);
  return <span style={{ display: "inline-block", fontFamily: fonts.semibold, fontSize: 24, color: th.ink, background: th.bg, border: `1.5px solid ${th.line}`, borderRadius: 999, padding: "5px 16px", transform: `scale(${a})`, opacity: Math.min(1, a * 2) }}>{text}</span>;
};

const MiniChart: React.FC<{ t: number; c: HookChart; th: Theme }> = ({ t, c, th }) => {
  const at = c.at ?? 1.6;
  const W = 300, H = 170;
  const p = rampE(t, at, at + 1.1, Easing.inOut(Easing.cubic));
  const g = c.growth ?? 0.75;
  const pts = Array.from({ length: 25 }).map((_, i) => {
    const x = i / 24;
    return [12 + x * (W - 24), H - 22 - (Math.pow(1 + g, x * 3) - 1) / (Math.pow(1 + g, 3) - 1) * (H - 60)] as const;
  });
  const withD = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const flatD = `M12,${H - 22} L${W - 12},${H - 22}`;
  const head = pts[Math.min(24, Math.round(p * 24))];
  const lab = rampE(t, at + 1.0, at + 1.3);
  return (
    <div style={{ width: W, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>{c.badge ? <Badge text={c.badge} t={t} at={at - 0.1} th={th} /> : null}</div>
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        {[0.25, 0.5, 0.75].map((k) => <line key={k} x1={12} x2={W - 12} y1={(H - 22) * k + 10} y2={(H - 22) * k + 10} stroke={th.line} strokeWidth={2} />)}
        <path d={flatD} stroke="#BDB8AE" strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        <path d={withD} stroke={th.accent} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        {p > 0.02 ? <circle cx={head[0]} cy={head[1]} r={11 + 3 * Math.sin(t * 9)} fill={th.accent} stroke="#FFF" strokeWidth={4} /> : null}
      </svg>
      <div style={{ position: "absolute", right: 0, top: 40, fontFamily: fonts.bold, fontSize: 27, color: th.accent, opacity: lab, transform: `translateY(${(1 - lab) * 12}px)` }}>{c.withLabel ?? "mit Zinsen"}</div>
      <div style={{ position: "absolute", right: 0, top: H - 18, fontFamily: fonts.semibold, fontSize: 25, color: th.dim, opacity: lab }}>{c.withoutLabel ?? "ohne"}</div>
    </div>
  );
};

export const Bars: React.FC<{ t: number; bars: HookBar[]; title?: string; badge?: string; th: Theme; at?: number; chart?: HookChart | null; width?: number }> = ({ t, bars, title, badge, th, at = 0.45, chart, width }) => {
  const soft = useSoft();
  const enter = soft(at, 12, 120); // springs in from the right with a small overshoot
  const W = width ?? (chart ? 980 : 900);
  return (
    <div style={{ width: W, background: th.card, borderRadius: 34, border: `2px solid ${th.line}`, boxShadow: "0 20px 44px rgba(0,0,0,0.08)", padding: "24px 36px 30px", boxSizing: "border-box", transform: `translateX(${(1 - enter) * 1100}px) rotate(${(1 - enter) * 6}deg)` }}>
      {title || badge ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: th.dim }}>{title}</span>
          {badge && !chart ? <Badge text={badge} t={t} at={at + 0.35} th={th} /> : null}
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 30, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          {bars.map((b, i) => {
            const s = at + 0.3 + i * 0.3;
            const p = rampE(t, s, s + 1.2, Easing.bezier(0.3, 0.7, 0.2, 1));
            const shimmer = ((t * 0.9 + i * 0.4) % 1.2) / 1.2;
            const num = b.num ?? Math.round(b.fill * 100);
            const color = b.muted ? th.dim : th.accent;
            // empty bar: short shiver + red flash once it is clear nothing comes
            const shiv = b.fill === 0 ? bump(t, s + 0.5, 0.7) : 0;
            const shake = shiv * Math.sin(t * 70) * 9;
            const done = p > 0.995;
            const numTxt = done ? fmt(num, b.decimals ?? 0) : fmt(num * p, num < 10 && num > 0 ? 1 : b.decimals ?? 0);
            const prefA = rampE(t, s + 1.1, s + 1.35);
            return (
              <div key={i} style={{ marginTop: i ? 18 : 0, transform: `translateX(${shake}px)` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontFamily: fonts.bold, fontSize: 38, color: th.ink, letterSpacing: -0.5 }}>{b.label}</span>
                  <span style={{ fontFamily: serifItalic, fontSize: 56, color: shiv > 0.05 ? th.warn : color, lineHeight: 1, transform: `scale(${1 + 0.12 * bump(t, s + 1.15, 0.4)})`, display: "inline-block" }}>{b.prefix && prefA > 0 ? <span style={{ opacity: prefA }}>{b.prefix}</span> : null}{numTxt}{b.suffix ?? " %"}</span>
                </div>
                <div style={{ height: 28, borderRadius: 14, background: th.bg, border: `1.5px solid ${shiv > 0.05 ? th.warn : th.line}`, overflow: "hidden", position: "relative" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(b.fill * p * 100, b.fill > 0 ? 3 : 1.6)}%`, borderRadius: 14, background: b.muted ? "#CFCBC3" : `linear-gradient(90deg, ${th.accent}, ${th.accent}DD)`, overflow: "hidden" }}>
                    {!b.muted && p > 0.05 ? <div style={{ position: "absolute", top: 0, bottom: 0, width: 140, left: `${shimmer * 160 - 30}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }} /> : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {chart ? <MiniChart t={t} c={{ badge, ...chart }} th={th} /> : null}
      </div>
    </div>
  );
};

export const Waffle: React.FC<{ t: number; at: number; pct: number; label?: string; th: Theme }> = ({ t, at, pct, label, th }) => {
  const soft = useSoft();
  const enter = soft(at, 12, 120);
  const p = rampE(t, at + 0.15, at + 1.4);
  const filled = Math.round(pct * p);
  return (
    <div style={{ width: 900, background: th.card, borderRadius: 34, border: `2px solid ${th.line}`, boxShadow: "0 20px 44px rgba(0,0,0,0.08)", padding: 36, boxSizing: "border-box", display: "flex", gap: 40, alignItems: "center", transform: `translateX(${(1 - enter) * 1100}px) rotate(${(1 - enter) * 6}deg)` }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 30px)", gap: 9 }}>
        {Array.from({ length: 100 }).map((_, i) => <div key={i} style={{ width: 30, height: 30, borderRadius: 15, background: i < filled ? th.accent : th.line, transform: `scale(${i === filled - 1 ? 1.2 : 1})` }} />)}
      </div>
      <div>
        <div style={{ fontFamily: serifItalic, fontSize: 150, color: th.ink, lineHeight: 1 }}>{filled} %</div>
        {label ? <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: th.dim, marginTop: 10, maxWidth: 300 }}>{label}</div> : null}
      </div>
    </div>
  );
};

const Person: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ width: 54, height: 78, position: "relative" }}>
    <div style={{ position: "absolute", left: 14, top: 0, width: 26, height: 26, borderRadius: 13, background: color }} />
    <div style={{ position: "absolute", left: 3, top: 32, width: 48, height: 46, borderRadius: "24px 24px 8px 8px", background: color }} />
  </div>
);
export const PeopleRow: React.FC<{ t: number; at: number; n?: number; label?: string; th: Theme }> = ({ t, at, n = 10, label, th }) => {
  const soft = useSoft();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", gap: 16 }}>
        {Array.from({ length: n }).map((_, i) => {
          const a = soft(at + i * 0.09, 11, 190);
          return <div key={i} style={{ transform: `translateY(${(1 - a) * 40 + Math.sin(t * 5 + i) * 2}px) scale(${a})`, opacity: Math.min(1, a * 2) }}><Person color={i % 4 === 3 ? th.accent : th.ink} /></div>;
        })}
      </div>
      {label ? <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: th.dim, opacity: rampE(t, at + 0.4, at + 0.8) }}>{label}</div> : null}
    </div>
  );
};

// ---------- Word line: slam-in, accent word with a drawn underline ----------

// rough width estimate (Inter Bold ~0.56 em/char, Newsreader italic ~0.46 em/char) so a line never leaves the frame
const lineWidth = (l: HookWord[], size: number) => l.reduce((acc, w) => acc + w.w.length * (w.em ? size * 1.18 * 0.46 : size * 0.56), 0) + (l.length - 1) * size * 0.26;
export const WordLine: React.FC<{ t: number; words: HookWord[]; th: Theme; size?: number; maxW?: number }> = ({ t, words, th, size: baseSize = 96, maxW = 960 }) => {
  const soft = useSoft();
  const shown = words.filter((w) => w.at <= t);
  if (!shown.length) return null;
  const page = Math.max(...shown.map((w) => w.page ?? 0));
  const cur = shown.filter((w) => (w.page ?? 0) === page);
  const lines: HookWord[][] = [[]];
  cur.forEach((w) => {
    if (w.br && lines[lines.length - 1].length) lines.push([]);
    lines[lines.length - 1].push(w);
  });
  // size per page (all words of the page, not only the shown ones), so the type doesn't jump while words arrive
  const all = words.filter((w) => (w.page ?? 0) === page);
  const full: HookWord[][] = [[]];
  all.forEach((w) => {
    if (w.br && full[full.length - 1].length) full.push([]);
    full[full.length - 1].push(w);
  });
  const size = Math.min(baseSize, ...full.map((l) => (baseSize * maxW) / Math.max(1, lineWidth(l, baseSize))));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ display: "flex", gap: size * 0.26, alignItems: "baseline", justifyContent: "center", whiteSpace: "nowrap" }}>
          {l.map((w, j) => {
            const a = soft(w.at, 11, 230);
            const ul = rampE(t, w.at + 0.15, w.at + 0.5, Easing.inOut(Easing.cubic));
            return (
              <span key={j} style={{ position: "relative", display: "inline-block", fontFamily: w.em ? serifItalic : fonts.bold, fontSize: w.em ? size * 1.18 : size, color: w.em ? th.accent : th.ink, letterSpacing: w.em ? -1 : -3, lineHeight: 1.05, transform: `translateY(${(1 - a) * 46}px) scale(${1.45 - 0.45 * a})`, opacity: Math.min(1, a * 2) }}>
                {w.w}
                {w.em ? <span style={{ position: "absolute", left: 0, right: 0, bottom: -4, height: Math.round(size * 0.09), borderRadius: 99, background: th.accent, transformOrigin: "0 50%", transform: `scaleX(${ul}) rotate(-1deg)` }} /> : null}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Turn caption word timings (captions.json, ms) into HookWords: `em` for words in `accents`, a new page every `perPage` words, 2 lines per page. */
export const wordsFromCaptions = (caps: { text: string; startMs: number }[], fromMs: number, toMs: number, accents: string[] = [], perPage = 6): HookWord[] =>
  caps
    .filter((c) => c.startMs >= fromMs && c.startMs < toMs)
    .map((c, i) => ({ w: c.text, at: (c.startMs - fromMs) / 1000, em: accents.some((a) => c.text.toLowerCase().startsWith(a.toLowerCase())), page: Math.floor(i / perPage), br: i % perPage === Math.ceil(perPage / 2) }));

// ---------- The composition body ----------

type Opt = "textHook" | "people" | "waffle" | "chart" | "ticks" | "avatar" | "avatarLabel";
export const DOPAMINE_HOOK_DEFAULTS: Required<Omit<DopamineHookProps, Opt>> & Pick<DopamineHookProps, Opt> = {
  seconds: 4.5,
  preset: "fp",
  counterFrom: 47,
  counterTo: 50000,
  counterPrefix: "",
  counterSuffix: "",
  counterLabel: "Beispiel",
  counterStart: 0.1,
  counterDur: 1.25,
  ticks: null,
  words: [
    { w: "über", at: 0.2 },
    { w: "50.000", at: 0.5, em: true },
    { w: "Skills", at: 0.9, br: true },
  ],
  bars: [{ label: "Fortschritt", fill: 0.87, num: 87 }],
  barsTitle: "",
  barsBadge: "Beispiel",
  chart: null,
  logo: "claude",
  tileText: "",
  pile: "cards",
  pileEvery: 0.07,
  people: null,
  waffle: null,
  topSafe: 420,
  camera: true,
  whipOut: true,
  textHook: undefined,
  layout: "split",
  avatar: undefined,
  panelFrac: 0.52,
  avatarLabel: undefined,
};

export const DopamineHookScene: React.FC<DopamineHookProps> = (raw) => {
  const p = { ...DOPAMINE_HOOK_DEFAULTS, ...raw };
  const soft = useSoft();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const th = HOOK_THEMES[p.preset];
  FMT_LOCALE = p.preset === "boilr" ? "en-GB" : "de-DE";
  const top = p.topSafe;
  // fixed vertical rhythm (px): counter → chip → tile+pile → bars/waffle → people → words; nothing below ~1600 (IG UI)
  const yCounter = top;
  const yTile = top + 410; // tile centre; coin towers stand on yTile + 150
  const yBars = top + 620;
  // camera: slow push-in + drift over the whole window, parallax per layer (k = depth, bigger = closer)
  const cp = p.camera ? t / p.seconds : 0;
  const camScale = 1 + 0.07 * cp;
  const dx = p.camera ? Math.sin(t * 0.9) * 10 : 0;
  const dy = p.camera ? -cp * 24 : 0;
  const par = (k: number): React.CSSProperties => ({ transform: `translate(${dx * k}px, ${dy * k + (p.camera ? Math.sin(t * 1.3) * 4 * k : 0)}px)` });
  // whip-out in the last 0.3 s: accelerating pan up-left with motion blur
  const wp = p.whipOut ? rampE(t, p.seconds - 0.32, p.seconds, Easing.in(Easing.cubic)) : 0;
  const chipA = soft(p.counterStart + 0.3, 12, 170);
  if (p.layout === "split" && p.avatar) return <SplitHook p={p} t={t} th={th} chipA={chipA} durationInFrames={durationInFrames} />;
  return (
    <AbsoluteFill style={{ background: th.bg, overflow: "hidden" }}>
      {/* drifting dot grid + slow accent glow */}
      <div style={{ position: "absolute", inset: -80, backgroundImage: `radial-gradient(${th.grid} 2px, transparent 2.5px)`, backgroundSize: "36px 36px", transform: `translate(${(t * 14) % 36}px, ${(t * 22) % 36}px)` }} />
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", left: -10 + Math.sin(t * 0.7) * 160, top: 300 + Math.cos(t * 0.5) * 140, background: `radial-gradient(circle, ${th.accentSoft}AA 0%, transparent 65%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 45%, transparent 45%, ${th.bg} 98%)` }} />

      <AbsoluteFill style={{ transform: `translate(${-wp * 1200}px, ${-wp * 260}px) scale(${camScale + wp * 0.08}) rotate(${-wp * 4}deg)`, transformOrigin: "50% 42%", filter: wp > 0.01 ? `blur(${wp * 26}px)` : undefined }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: yCounter, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, zIndex: 150, ...par(0.4) }}>
          <SlotCounter t={t} from={p.counterFrom} to={p.counterTo} start={p.counterStart} dur={p.counterDur} prefix={p.counterPrefix || undefined} suffix={p.counterSuffix || undefined} th={th} ticks={p.ticks} seconds={p.seconds} />
          {p.counterLabel ? <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: th.ink, background: th.card, border: `1.5px solid ${th.line}`, borderRadius: 999, padding: "8px 24px", transform: `translateX(${(1 - chipA) * -700}px)`, boxShadow: "0 6px 16px rgba(0,0,0,0.06)" }}>{p.counterLabel}</div> : null}
        </div>

        <div style={{ position: "absolute", inset: 0, ...par(1.4) }}>
          {p.pile !== "none" ? <Pile t={t} kind={p.pile} every={p.pileEvery * 1.4} cx={HW / 2} cy={yTile} th={th} seconds={p.seconds} size={0.78} stackDx={[-410, -320, -215, 215, 320, 410]} front={[1, 4]} dropFrom={-140} /> : null}
        </div>
        <div style={{ position: "absolute", left: HW / 2 - 110, top: yTile - 110, zIndex: p.pile === "coins" ? 1 : 5, ...par(1) }}>
          <BrandTile t={t} logo={p.logo} text={p.tileText || undefined} th={th} />
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: yBars, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, zIndex: 200, ...par(1.8) }}>
          {p.waffle ? <Waffle t={t} at={p.waffle.at} pct={p.waffle.pct} label={p.waffle.label} th={th} /> : p.bars.length ? <Bars t={t} bars={p.bars} title={p.barsTitle || undefined} badge={p.barsBadge || undefined} th={th} chart={p.chart} /> : null}
          {p.people ? <PeopleRow t={t} at={p.people.at} n={p.people.n} label={p.people.label} th={th} /> : null}
          {/* words flow right under the card / people row, so nothing overlaps whatever modules are switched on */}
          <div style={{ zIndex: 300 }}>
            <WordLine t={t} words={p.words} th={th} size={p.people || p.waffle ? 84 : 96} />
          </div>
        </div>
      </AbsoluteFill>

      {p.textHook ? <div style={{ position: "absolute", inset: 0, zIndex: 400 }}><GptHook text={p.textHook} startFrame={0} endFrame={durationInFrames} frameWidth={HW} /></div> : null}
    </AbsoluteFill>
  );
};

// ---------- Split layout: animation panel on top, speaker below ----------

const resolveSrc = (s: string) => (/^(https?:|file:)/.test(s) ? s : staticFile(s));

const SplitHook: React.FC<{ p: typeof DOPAMINE_HOOK_DEFAULTS & DopamineHookProps; t: number; th: Theme; chipA: number; durationInFrames: number }> = ({ p, t, th, chipA, durationInFrames }) => {
  const { fps } = useVideoConfig();
  const PH = Math.round(HH * p.panelFrac);
  // content area: below the pipeline's text-hook box (≈173-385 px), above the seam
  const top = Math.max(425, p.topSafe + 5);
  // last 0.35 s: panel fades out with a slight scale (stays in place, never slides under the pipeline's hook box),
  // speaker grows to the plain full frame behind it → hard cut to the talking head is invisible
  const k = p.whipOut ? rampE(t, p.seconds - 0.35, p.seconds, Easing.inOut(Easing.cubic)) : 0;
  const av = p.avatar!;
  const s0 = av.scale ?? 1.15;
  const f = av.focus ?? { x: 0.52, y: 0.45 };
  const h0 = HH - PH;
  const vw0 = HW * s0, vh0 = HH * s0;
  const left0 = Math.min(0, Math.max(HW - vw0, HW / 2 - f.x * vw0));
  const top0 = Math.min(0, Math.max(h0 - vh0, h0 * (av.faceAt ?? 0.36) - f.y * vh0));
  // interpolate the video rect (relative to the frame) from the split framing to identity
  const vw = vw0 + (HW - vw0) * k, vh = vh0 + (HH - vh0) * k;
  const vLeft = left0 * (1 - k);
  const vTop = (PH + top0) * (1 - k);
  // camera in the panel
  const cp = p.camera ? t / p.seconds : 0;
  const dx = p.camera ? Math.sin(t * 0.9) * 8 : 0;
  const dy = p.camera ? -cp * 14 : 0;
  const par = (m: number): React.CSSProperties => ({ transform: `translate(${dx * m}px, ${dy * m + (p.camera ? Math.sin(t * 1.3) * 3 * m : 0)}px)` });
  const cx = 245, cy = top + 400; // tile centre (left column), 3 coin towers left + 3 right of it
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh }}>
        <OffthreadVideo src={resolveSrc(av.src)} startFrom={Math.round(av.startSec * fps)} muted style={{ width: "100%", height: "100%" }} />
      </div>
      {p.avatarLabel ? <div style={{ position: "absolute", right: 24, top: PH * (1 - k) + 24, fontFamily: fonts.semibold, fontSize: 24, color: "#FFF", background: "rgba(0,0,0,0.55)", borderRadius: 999, padding: "6px 16px" }}>{p.avatarLabel}</div> : null}

      <div style={{ position: "absolute", left: 0, top: 0, width: HW, height: PH, overflow: "hidden", background: th.bg, boxShadow: `0 10px 30px rgba(0,0,0,${0.25 * (1 - k)})`, opacity: 1 - k, transform: `scale(${1 + 0.05 * k})`, transformOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", inset: -80, backgroundImage: `radial-gradient(${th.grid} 2px, transparent 2.5px)`, backgroundSize: "36px 36px", transform: `translate(${(t * 14) % 36}px, ${(t * 22) % 36}px)` }} />
        <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", left: -200 + Math.sin(t * 0.7) * 140, top: 200 + Math.cos(t * 0.5) * 100, background: `radial-gradient(circle, ${th.accentSoft}AA 0%, transparent 65%)` }} />
        <AbsoluteFill style={{ transform: `scale(${1 + 0.06 * cp})`, transformOrigin: "50% 60%" }}>
          {/* counter row */}
          <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 150, ...par(0.4) }}>
            <div style={{ transform: "scale(0.78)", transformOrigin: "50% 0%", height: 170 * 0.78 }}>
              <SlotCounter t={t} from={p.counterFrom} to={p.counterTo} start={p.counterStart} dur={p.counterDur} prefix={p.counterPrefix || undefined} suffix={p.counterSuffix || undefined} th={th} ticks={p.ticks} seconds={p.seconds} />
            </div>
            {p.counterLabel ? <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: th.ink, background: th.card, border: `1.5px solid ${th.line}`, borderRadius: 999, padding: "6px 20px", transform: `translateX(${(1 - chipA) * -700}px)`, boxShadow: "0 6px 16px rgba(0,0,0,0.06)" }}>{p.counterLabel}</div> : null}
          </div>
          {/* left: tile + coin towers */}
          <div style={{ position: "absolute", inset: 0, ...par(1.4) }}>
            {p.pile !== "none" ? <Pile t={t} kind={p.pile} every={p.pileEvery * 1.2} cx={cx} cy={cy} th={th} seconds={p.seconds} size={0.6} stackDx={[-197, -145, -95, 95, 145, 197]} front={[1, 4]} dropFrom={-110} floor={cy + 85} gravity={5600} /> : null}
          </div>
          <div style={{ position: "absolute", left: cx - 66, top: cy - 66, zIndex: 1, ...par(1) }}>
            <BrandTile t={t} logo={p.logo} text={p.tileText || undefined} th={th} size={132} />
          </div>
          {/* right: bars card (chart / words are left out in the split, the pipeline captions run on the seam) */}
          <div style={{ position: "absolute", left: 492, top: cy - 150, zIndex: 200, transform: `scale(0.82)`, transformOrigin: "0 0", ...{} }}>
            <div style={par(1.8)}>
              {p.waffle ? <div style={{ transform: "scale(0.62)", transformOrigin: "0 0" }}><Waffle t={t} at={p.waffle.at} pct={p.waffle.pct} label={p.waffle.label} th={th} /></div> : p.bars.length ? <Bars t={t} bars={p.bars} title={p.barsTitle || undefined} badge={p.barsBadge || undefined} th={th} width={680} /> : null}
            </div>
          </div>
        </AbsoluteFill>
      </div>

      {p.textHook ? <div style={{ position: "absolute", inset: 0, zIndex: 400 }}><GptHook text={p.textHook} startFrame={0} endFrame={durationInFrames} frameWidth={HW} /></div> : null}
    </AbsoluteFill>
  );
};
