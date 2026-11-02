import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import words from "../../public/sirtoken/words.json";
import { THEMES, FLOOR_Y, PillCaptions, StepBadge, MiniGrid, Stamp, SpeechBubble, CommentCard, Checklist, CheckBadge, Word, pixelFont, Odometer } from "../components/PixelKit";
import { SirTokenHD, SirPose, SirExpr, PixelCoin, CoinBurst, Confetti, Sparkle, QBlock, PxArt } from "../components/PixelSir";

// Trainer reel (S-012) in the Pixelwelt look (skill pixelwelt-look): a side-scrolling gym level,
// one station per script step, Sir Token runs from station to station and collects coins.
export const PIXELREEL_FPS = 30;
export const PIXELREEL_SECONDS = 37.5;

const WORDS = words as Word[];
const th = THEMES.gym;
const W = 1080;
const FLOOR = FLOOR_Y;
const PX = 7;

// ---------- timeline ----------
const ST = [0, 4.45, 7.75, 11.0, 17.85, 20.75, 24.9, 28.6, 31.7]; // hook, steps 1-7, CTA
const PAN = 0.6;
const panStart = (i: number) => ST[i] - 0.35;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const inOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const camAt = (t: number) => ST.reduce((acc, _, i) => (i === 0 ? acc : acc + inOut(cl((t - panStart(i)) / PAN)) * W), 0);
const panning = (t: number) => ST.some((_, i) => i > 0 && t >= panStart(i) && t < panStart(i) + PAN);
const stationAt = (t: number) => ST.reduce((k, s, i) => (t >= s - 0.35 ? i : k), 0);

const keys = (k: [number, number][], t: number) => {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) if (t <= k[i + 1][0]) {
    const p = (t - k[i][0]) / (k[i + 1][0] - k[i][0]);
    return k[i][1] + (k[i + 1][1] - k[i][1]) * p;
  }
  return k[k.length - 1][1];
};
// Sir Token's screen x
const SX: [number, number][] = [
  [0, 300], [4.1, 300], [4.7, 230], [5.1, 230], [5.75, 230], [6.05, 540], [6.5, 540], [6.8, 850], [7.4, 850], [8.0, 540],
  [10.65, 540], [11.25, 540], [17.5, 540], [18.1, 880], [20.4, 880], [21.0, 330], [24.55, 330], [25.15, 860],
  [28.25, 860], [28.85, 540], [31.35, 540], [31.95, 870],
];
const sxAt = (t: number) => keys(SX, t);
const JUMPS: [number, number, number][] = [
  [3.25, 0.45, 120], [5.38, 0.4, 168], [6.13, 0.4, 168], [6.88, 0.4, 168], [16.95, 0.5, 170], [20.05, 0.45, 120],
  [24.6, 0.4, 100], [26.7, 0.45, 130], [34.5, 0.55, 210], [35.7, 0.45, 110], [36.6, 0.45, 110],
];
const liftAt = (t: number) => JUMPS.reduce((a, [s, d, h]) => { const p = (t - s) / d; return p > 0 && p < 1 ? a + h * 4 * p * (1 - p) : a; }, 0);
const squashAt = (t: number) => {
  for (const [s, d] of JUMPS) {
    const take = t - s, land = t - (s + d);
    if (take >= 0 && take < 0.12) return [0.92, 1.1];
    if (land >= 0 && land < 0.16) { const k = Math.sin((land / 0.16) * Math.PI); return [1 + 0.14 * k, 1 - 0.16 * k]; }
  }
  return [1, 1];
};
const EXPR: [number, SirExpr][] = [
  [0, "normal"], [1.25, "shocked"], [2.4, "normal"], [3.0, "happy"], [4.5, "normal"], [5.5, "happy"], [7.6, "normal"], [9.7, "happy"],
  [11.6, "shocked"], [12.1, "normal"], [16.66, "happy"], [17.9, "normal"], [20.2, "happy"], [21.0, "normal"], [24.0, "shocked"],
  [24.6, "happy"], [25.2, "normal"], [26.84, "happy"], [28.7, "normal"], [29.79, "happy"], [31.9, "normal"], [34.4, "happy"],
];
const exprAt = (t: number) => EXPR.reduce((e, [s, x]) => (t >= s ? x : e), "normal" as SirExpr);
// arm poses that override the idle/run swing: [from, to, left, right]
const ARMS: [number, number, number, number][] = [
  [1.25, 1.9, 100, 100], [3.0, 3.7, 160, 160], [9.71, 10.3, 25, 105], [10.36, 10.9, 25, 105], [12.0, 12.6, 25, 150],
  [14.35, 14.8, 120, 25], [15.1, 15.5, 25, 120], [15.6, 16.0, 120, 25], [16.66, 17.0, 25, 120], [17.0, 17.7, 165, 165],
  [20.2, 20.7, 160, 160], [23.2, 23.9, 25, 140], [26.84, 27.5, 160, 160], [29.79, 30.3, 25, 160], [31.27, 31.6, 160, 160],
  [33.4, 34.4, 25, 110],
];
const FLIP: [number, number][] = [[9.71, 10.3]];
const SQUAT = (t: number) => (t > 21.55 && t < 22.55 ? Math.round(3 * Math.abs(Math.sin(((t - 21.55) / 0.5) * Math.PI))) : 0);

// coins between stations, collected while running
type CoinT = { x: number; y: number; t: number; phase: number };
const COINS: CoinT[] = (() => {
  const out: CoinT[] = [];
  for (let i = 1; i < ST.length; i++) {
    const a = (i - 1) * W + sxAt(panStart(i)), b = i * W + sxAt(panStart(i) + PAN);
    [0.32, 0.56, 0.8].forEach((f, k) => {
      const x = a + (b - a) * f;
      let tc = panStart(i) + PAN;
      for (let t = panStart(i); t < panStart(i) + PAN; t += 1 / 120) if (camAt(t) + sxAt(t) >= x) { tc = t; break; }
      out.push({ x, y: FLOOR - 190 - (k % 2) * 40, t: tc, phase: i * 3 + k });
    });
  }
  return out;
})();
const BLOCK_HITS = [5.58, 6.33, 7.08];
const COIN_EVENTS = [...COINS.map((c) => c.t), ...BLOCK_HITS].sort((a, b) => a - b);

// ---------- helpers ----------
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const rnd = (i: number) => { const v = Math.sin(i * 91.7 + 47.3) * 43758.5453; return v - Math.floor(v); };
const flashAt = [8.34, 22.07];
const PUNCH = [3.45, 7.08, 10.36, 13.1, 17.1, 20.21, 24.6, 26.84, 28.13, 29.79, 31.27, 34.4, 35.0];
const SHAKE = [3.45, 13.1, 17.1, 29.79, 35.0];

const Card: React.FC<{ label?: string; children: React.ReactNode; pad?: number }> = ({ label, children, pad = 10 }) => (
  <div style={{ background: "#FFFFFF", borderRadius: 20, padding: pad, boxShadow: "0 10px 0 rgba(0,0,0,.32), 0 20px 34px rgba(0,0,0,.3)" }}>
    <div style={{ borderRadius: 12, overflow: "hidden" }}>{children}</div>
    {label && <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 30, letterSpacing: 1, textAlign: "center", color: "#14171D", paddingTop: 8 }}>{label}</div>}
  </div>
);
const Emo: React.FC<{ bg: string; e: string; h?: number; size?: number }> = ({ bg, e, h = 140, size = 92 }) => (
  <div style={{ height: h, background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.45), transparent 60%), ${bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size }}>{e}</div>
);

/** pops in (optionally flying from a point), then floats gently */
const Pop: React.FC<{ at: number; x: number; y: number; w: number; rot?: number; from?: [number, number]; children: React.ReactNode; float?: number }> = ({ at, x, y, w, rot = 0, from, children, float = 6 }) => {
  const { f, fps, t } = useT();
  const p = spring({ frame: f - Math.round(at * fps), fps, config: { damping: 11, stiffness: 170, mass: 0.7 } });
  if (t < at) return null;
  const fx = from ? from[0] - (x + w / 2) : 0, fy = from ? from[1] - y : 0;
  const bob = Math.sin(t * 2.2 + x * 0.01) * float;
  const sc = from ? 0.25 + 0.75 * p : p;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `translate(${fx * (1 - p)}px, ${fy * (1 - p) + bob}px) scale(${sc}) rotate(${rot + Math.sin(t * 1.7 + x) * 1.2}deg)`, transformOrigin: "50% 100%" }}>{children}</div>
  );
};

// ---------- world layers ----------
const BRICK = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='112' height='56' viewBox='0 0 16 8' shape-rendering='crispEdges'><rect width='16' height='8' fill='#22182A'/><rect x='0' y='0' width='15' height='3' fill='#36263D'/><rect x='0' y='0' width='15' height='1' fill='#40304A'/><rect x='-8' y='4' width='15' height='3' fill='#33233A'/><rect x='8' y='4' width='15' height='3' fill='#3A2A42'/><rect x='8' y='4' width='15' height='1' fill='#463550'/><rect x='-8' y='4' width='15' height='1' fill='#3E2E46'/></svg>`)}")`;
const NEON = [
  { txt: "TOKEN GYM", c: "#FF8A4C" }, { txt: "POWER", c: "#FF5FA2" }, { txt: "24/7", c: "#5FD3E0" }, { txt: "NO LIMITS", c: "#B4FF5F" },
  { txt: "FIT", c: "#FF8A4C" }, { txt: "GAINS", c: "#5FD3E0" }, { txt: "LEVEL UP", c: "#FF5FA2" }, { txt: "STRONG", c: "#B4FF5F" },
];
const POSTER = ["💪", "🥇", "🔥", "🏆", "⚡", "🥊", "🏅", "🚀"];

const Window: React.FC<{ x: number; t: number; i: number }> = ({ x, t, i }) => (
  <div style={{ position: "absolute", left: x, top: 330, width: 238, height: 294, background: "#140E1A", padding: 14, boxShadow: "inset 0 0 0 7px #2C2034" }}>
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "linear-gradient(#141B44, #3A2E6E 70%, #6B3B6E)" }}>
      <div style={{ position: "absolute", left: 140, top: 28, width: 42, height: 42, background: "#FFF2C4", boxShadow: "0 0 30px #FFF2C4" }} />
      {Array.from({ length: 9 }).map((_, k) => (
        <div key={k} style={{ position: "absolute", left: 10 + rnd(i * 20 + k) * 190, top: 10 + rnd(i * 31 + k) * 110, width: 7, height: 7, background: "#FFFFFF", opacity: 0.35 + 0.65 * Math.abs(Math.sin(t * 2 + k * 1.7 + i)) }} />
      ))}
      {Array.from({ length: 6 }).map((_, k) => {
        const h = 70 + rnd(i * 9 + k) * 110;
        return (
          <div key={k} style={{ position: "absolute", left: k * 36, bottom: 0, width: 34, height: h, background: "#0D0B16" }}>
            {Array.from({ length: 6 }).map((__, m) => (
              <div key={m} style={{ position: "absolute", left: 7 + (m % 2) * 14, top: 10 + Math.floor(m / 2) * 21, width: 7, height: 7, background: rnd(i * 50 + k * 7 + m + Math.floor(t * 0.7)) > 0.45 ? "#FFD27A" : "#22203A" }} />
            ))}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: 14, right: 14, top: 140, height: 7, background: "#2C2034" }} />
    <div style={{ position: "absolute", top: 14, bottom: 14, left: 112, width: 7, background: "#2C2034" }} />
  </div>
);

const WallLayer: React.FC<{ cam: number; t: number; f: number }> = ({ cam, t, f }) => {
  const k = 0.55;
  return (
    <div style={{ position: "absolute", left: -cam * k, top: 0, width: 7000, height: FLOOR }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: BRICK, backgroundSize: "112px 56px" }} />
      {/* bunting */}
      <svg style={{ position: "absolute", left: 0, top: 236 }} width={7000} height={90}>
        <path d={`M0 6 ${Array.from({ length: 70 }).map((_, i) => `Q ${i * 100 + 50} 36 ${i * 100 + 100} 6`).join(" ")}`} stroke="#0E0A12" strokeWidth={4} fill="none" />
        {Array.from({ length: 140 }).map((_, i) => {
          const x = i * 50 + 12, y = 8 + Math.sin(((i % 2) + 0.5) * Math.PI) * 14 * (i % 2 ? 0.5 : 1);
          const sw = Math.sin(t * 2.5 + i) * 6;
          return <polygon key={i} points={`${x},${y} ${x + 30},${y} ${x + 15},${y + 40}`} fill={["#FF8A4C", "#5FD3E0", "#F6C02E", "#FF5FA2"][i % 4]} opacity={0.75} transform={`rotate(${sw} ${x + 15} ${y})`} />;
        })}
      </svg>
      {Array.from({ length: 13 }).map((_, i) => {
        const x = 90 + i * 520;
        const kind = i % 4;
        if (kind === 0) return <Window key={i} x={x} t={t} i={i} />;
        if (kind === 1) return (
          <div key={i} style={{ position: "absolute", left: x, top: 360 }}>
            {[0, 1].map((m) => (
              <div key={m} style={{ position: "absolute", left: m * 200, top: m * 30, width: 168, height: 220, background: ["#FF8A4C", "#5FD3E0", "#FF5FA2", "#F6C02E"][(i + m) % 4], border: "7px solid #F4EEDC", transform: `rotate(${m ? 4 : -3}deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90, filter: "brightness(.62) saturate(.8)", boxShadow: "0 8px 0 rgba(0,0,0,.35)" }}>
                {POSTER[(i + m) % POSTER.length]}
                <div style={{ position: "absolute", top: -16, left: 52, width: 56, height: 22, background: "rgba(255,240,200,.6)" }} />
              </div>
            ))}
          </div>
        );
        if (kind === 2) {
          const n = NEON[i % NEON.length];
          const flick = rnd(Math.floor(f / 2) + i * 13) > 0.94 ? 0.35 : 1;
          return (
            <div key={i} style={{ position: "absolute", left: x - 40, top: 560, fontFamily: pixelFont, fontWeight: 800, fontSize: 104, letterSpacing: 8, color: "#FFF", opacity: flick, textShadow: `0 0 6px ${n.c}, 0 0 18px ${n.c}, 0 0 44px ${n.c}, 0 0 90px ${n.c}`, WebkitTextStroke: `3px ${n.c}`, transform: "rotate(-4deg)", whiteSpace: "nowrap" }}>{n.txt}</div>
          );
        }
        // clock + shelf
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 340 }}>
            <div style={{ position: "relative", width: 150, height: 150, borderRadius: "50%", background: "#F4EEDC", border: "10px solid #14101A", boxShadow: "0 8px 0 rgba(0,0,0,.35)", filter: "brightness(.75)" }}>
              {[0, 1].map((m) => {
                const ang = m ? Math.floor(t) * 6 * 8 : t * 12;
                return <div key={m} style={{ position: "absolute", left: 65, top: m ? 14 : 30, width: m ? 6 : 10, height: m ? 51 : 35, background: m ? "#E8505B" : "#14101A", transformOrigin: `50% ${m ? 51 : 35}px`, transform: `rotate(${ang}deg)` }} />;
              })}
            </div>
            <div style={{ position: "absolute", left: 220, top: 160, width: 240, height: 14, background: "#5A3A22", boxShadow: "0 7px 0 #3A2414" }} />
            {[0, 1, 2].map((m) => (
              <div key={m} style={{ position: "absolute", left: 236 + m * 74, top: 98 }}>
                <PxArt rows={["..KKK..", ".K...K.", "KKKKKKK", "KkkkkkK", "KkhkkkK", "KkkkkkK", ".KKKKK."]} pal={{ K: "#141218", k: ["#E8505B", "#5FD3E0", "#F6C02E"][m], h: "#FFFFFF" }} px={8} style={{ filter: "brightness(.7)" }} />
              </div>
            ))}
          </div>
        );
      })}
      {/* wainscot: padded lower wall */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, height: FLOOR - 1000, background: "#24182A", backgroundImage: "linear-gradient(90deg, rgba(0,0,0,.35) 7px, transparent 7px)", backgroundSize: "154px 100%", boxShadow: "inset 0 14px 0 #4A2E3A, inset 0 21px 0 #1A1020" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(10,6,14,.75), rgba(10,6,14,.15) 30%, rgba(10,6,14,.05) 70%, rgba(10,6,14,.4))" }} />
    </div>
  );
};

const MidLayer: React.FC<{ cam: number; t: number }> = ({ cam, t }) => {
  const k = 0.8;
  return (
    <div style={{ position: "absolute", left: -cam * k, top: 0, width: 9000, height: FLOOR }}>
      {Array.from({ length: 22 }).map((_, i) => {
        const x = 60 + i * 400 + rnd(i) * 80;
        const kind = i % 5;
        const dim = { filter: "brightness(.62) saturate(.85)" };
        if (kind === 0) return ( // kettlebell rack
          <div key={i} style={{ position: "absolute", left: x, top: FLOOR - 170, ...dim }}>
            <div style={{ position: "absolute", left: 0, top: 70, width: 260, height: 14, background: "#3A3A48" }} />
            <div style={{ position: "absolute", left: 0, top: 156, width: 260, height: 14, background: "#3A3A48" }} />
            {[0, 1, 2, 3].map((m) => <div key={m} style={{ position: "absolute", left: 10 + m * 62, top: m % 2 ? 108 : 22 }}><PxArt rows={["..KKK..", ".K...K.", "KKKKKKK", "KkkkkkK", "KkhkkkK", "KkkkkkK", ".KKKKK."]} pal={{ K: "#141218", k: ["#E8505B", "#5FD3E0", "#F6C02E", "#2FBF71"][m], h: "#FFFFFF" }} px={7} /></div>)}
            {[0, 250].map((l) => <div key={l} style={{ position: "absolute", left: l, top: 0, width: 10, height: 170, background: "#2A2A36" }} />)}
          </div>
        );
        if (kind === 1) { // punching bag
          const sw = Math.sin(t * 2.6 + i) * 7;
          return (
            <div key={i} style={{ position: "absolute", left: x + 60, top: 640, transformOrigin: "50% 0", transform: `rotate(${sw}deg)`, ...dim }}>
              <div style={{ position: "absolute", left: 47, top: 0, width: 7, height: 120, background: "#8E8E9A" }} />
              <div style={{ position: "absolute", left: 0, top: 120, width: 102, height: 280, background: "#C63A44", boxShadow: "inset 14px 0 0 #E2545E, inset -14px 0 0 #8E2730, 0 7px 0 #14101A", borderTop: "14px solid #2A2A36", borderBottom: "14px solid #2A2A36" }} />
            </div>
          );
        }
        if (kind === 2) { // plant
          return (
            <div key={i} style={{ position: "absolute", left: x, top: FLOOR - 13 * 9, transformOrigin: "50% 100%", transform: `skewX(${Math.sin(t * 1.8 + i) * 3}deg)`, ...dim }}>
              <PxArt rows={["....g..g....", "..g.gg.gg...", "...gGgGg.g..", ".g.gGGGGg...", "..gGGgGGGg..", "...gGGGgg...", "....gGg.....", ".....g......", "..PPPPPPPP..", "..pPPPPPPp..", "...pPPPPp...", "...pPPPPp...", "....pppp...."]} pal={{ g: "#2F8F4E", G: "#46B866", P: "#C0643A", p: "#8E4426" }} px={9} />
            </div>
          );
        }
        if (kind === 3) { // water cooler with rising bubbles
          return (
            <div key={i} style={{ position: "absolute", left: x, top: FLOOR - 280, width: 112, height: 280, ...dim }}>
              <div style={{ position: "absolute", left: 14, top: 0, width: 84, height: 105, background: "rgba(110,190,255,.75)", boxShadow: "inset 14px 0 0 rgba(255,255,255,.35)" }}>
                {[0, 1, 2].map((m) => { const y = 100 - ((t * 60 + m * 33) % 100); return <div key={m} style={{ position: "absolute", left: 22 + m * 18, top: y, width: 10, height: 10, background: "rgba(255,255,255,.8)" }} />; })}
              </div>
              <div style={{ position: "absolute", left: 0, top: 105, width: 112, height: 175, background: "#D9DDE6", boxShadow: "inset -14px 0 0 #AEB4C2" }} />
              <div style={{ position: "absolute", left: 40, top: 140, width: 28, height: 14, background: "#3A6EE0" }} />
            </div>
          );
        }
        return ( // bench with barbell
          <div key={i} style={{ position: "absolute", left: x, top: FLOOR - 150, ...dim }}>
            <div style={{ position: "absolute", left: 0, top: 70, width: 280, height: 28, background: "#2E2E3C", boxShadow: "inset 0 7px 0 #45455A" }} />
            {[20, 240].map((l) => <div key={l} style={{ position: "absolute", left: l, top: 98, width: 21, height: 52, background: "#1A1A24" }} />)}
            <div style={{ position: "absolute", left: -40, top: 18, width: 360, height: 10, background: "#B9BECB" }} />
            {[-56, 300].map((l) => <div key={l} style={{ position: "absolute", left: l, top: -20, width: 28, height: 84, background: "#14121A", boxShadow: "inset 7px 0 0 #2E2C3A" }} />)}
          </div>
        );
      })}
    </div>
  );
};

const PROPS: Record<string, { rows: string[]; pal: Record<string, string> }> = {
  dumbbell: { rows: ["KK.........KK", "KKK.......KKK", "KKKMMMMMMMKKK", "KKK.......KKK", "KK.........KK"], pal: { K: "#1E1C26", M: "#9AA3B5" } },
  bottle: { rows: ["..KK..", ".KwwK.", "KccccK", "KcwccK", "KcwccK", "KccccK", "KccccK", ".KKKK."], pal: { K: "#14121A", c: "#5FD3E0", w: "#FFFFFF" } },
  cone: { rows: ["...K...", "..KoK..", "..KwK..", ".KoooK.", ".KwwwK.", "KoooooK", "KKKKKKK"], pal: { K: "#14121A", o: "#FF8A4C", w: "#FFFFFF" } },
  medball: { rows: [".KKKK.", "KrrrrK", "KrhrrK", "KKKKKK", "KrrrrK", ".KKKK."], pal: { K: "#14121A", r: "#C63A44", h: "#FFFFFF" } },
  kettle: { rows: ["..KKK..", ".K...K.", "KKKKKKK", "KkkkkkK", "KkhkkkK", "KkkkkkK", ".KKKKK."], pal: { K: "#14121A", k: "#2FBF71", h: "#FFFFFF" } },
  towel: { rows: ["pppppppppp", "PPPPPPPPPP", "pppppppppp", "WWWWWWWWWW"], pal: { p: "#FF5FA2", P: "#E2458A", W: "#FFFFFF" } },
};
const PROP_KEYS = Object.keys(PROPS);
const REST_X = [300, 230, 850, 540, 540, 880, 330, 860, 540, 870].map((x, i) => x + Math.min(i, 8) * W);
const NEON_POOLS = [2, 6, 10].map((i) => ({ x: 90 + i * 520 + 200, c: NEON[i % NEON.length].c }));

const FloorLayer: React.FC<{ cam: number; t: number }> = ({ cam, t }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: FLOOR, bottom: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "conic-gradient(#33222C 25%, #281A23 0 50%, #33222C 0 75%, #281A23 0)", backgroundSize: "168px 112px", backgroundPosition: `${-cam}px 0` }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(90deg, rgba(0,0,0,.35) 4px, transparent 4px), linear-gradient(rgba(0,0,0,.3) 4px, transparent 4px)", backgroundSize: "84px 100%, 100% 56px", backgroundPosition: `${-cam}px 0, 0 0` }} />
      {NEON_POOLS.map((n, k) => {
        const x = n.x - cam * 0.55;
        return <div key={k} style={{ position: "absolute", left: x - 300, top: -40, width: 600, height: 260, borderRadius: "50%", background: `radial-gradient(closest-side, ${n.c}, transparent)`, opacity: 0.22 + 0.04 * Math.sin(t * 3 + k) }} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 170, background: "linear-gradient(rgba(255,138,76,.22), transparent)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 25%, rgba(10,6,12,.55))" }} />
    </div>
    {/* LED chaser strip on the floor edge */}
    {Array.from({ length: 41 }).map((_, k) => {
      const x = k * 28 - (cam % 28);
      const wave = Math.pow(Math.max(0, Math.cos((x / W) * 7 - t * 5)), 6);
      return <div key={k} style={{ position: "absolute", left: x, top: FLOOR - 4, width: 14, height: 7, background: th.floorLine, opacity: 0.35 + 0.65 * wave, boxShadow: `0 0 ${8 + 18 * wave}px ${th.floorLine}` }} />;
    })}
    {/* props lying on the floor in front of the line, kept clear of Sir Token's spots */}
    {Array.from({ length: 60 }).map((_, i) => {
      const wx = 60 + i * 165 + rnd(i + 3) * 50;
      if (REST_X.some((r) => Math.abs(r - wx) < 150)) return null;
      const x = wx - cam;
      if (x < -200 || x > W + 100) return null;
      const p = PROPS[PROP_KEYS[i % PROP_KEYS.length]];
      return (
        <div key={i} style={{ position: "absolute", left: x, top: FLOOR + 22 + (i % 3) * 34, filter: "drop-shadow(0 8px 0 rgba(0,0,0,.45))" }}>
          <PxArt rows={p.rows} pal={p.pal} px={12} />
        </div>
      );
    })}
    {/* second, lower prop row under the captions */}
    {Array.from({ length: 50 }).map((_, i) => {
      const x = 20 + i * 210 + rnd(i + 77) * 70 - cam * 1.12;
      if (x < -250 || x > W + 100) return null;
      const p = PROPS[PROP_KEYS[(i + 2) % PROP_KEYS.length]];
      const bob = i % 4 === 0 ? Math.abs(Math.sin(t * 3 + i)) * -10 : 0;
      return (
        <div key={"b" + i} style={{ position: "absolute", left: x, top: 1660 + (i % 2) * 70 + bob, filter: "drop-shadow(0 10px 0 rgba(0,0,0,.5)) brightness(.8)" }}>
          <PxArt rows={p.rows} pal={p.pal} px={15} />
        </div>
      );
    })}
  </>
);

const ForegroundLayer: React.FC<{ cam: number; t: number }> = ({ cam, t }) => (
  <div style={{ position: "absolute", left: -cam * 1.3, top: 0, width: 16000, height: 1920, pointerEvents: "none" }}>
    {Array.from({ length: 28 }).map((_, i) => {
      const p = PROPS[PROP_KEYS[(i * 2 + 1) % PROP_KEYS.length]];
      const x = 200 + i * 470 + rnd(i + 40) * 120;
      return (
        <div key={i} style={{ position: "absolute", left: x, top: 1790 + (i % 3) * 40 + Math.sin(t * 1.5 + i) * 3, filter: "brightness(.62) saturate(.9) blur(1px)" }}>
          <PxArt rows={p.rows} pal={p.pal} px={22} />
        </div>
      );
    })}
  </div>
);

const Dust: React.FC<{ cam: number; t: number }> = ({ cam, t }) => (
  <>
    {Array.from({ length: 34 }).map((_, i) => {
      const x = (((rnd(i) * 1400 - cam * (0.3 + rnd(i + 5) * 0.6) + t * 18 * (rnd(i + 9) - 0.3)) % 1300) + 1300) % 1300 - 110;
      const y = 260 + rnd(i + 2) * 1000 + Math.sin(t * (0.6 + rnd(i)) + i) * 30;
      const s = 4 + Math.round(rnd(i + 3) * 2) * 3;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, background: "#FFE2B0", opacity: 0.12 + 0.25 * Math.abs(Math.sin(t * 1.3 + i)) }} />;
    })}
  </>
);

// ---------- stations (screen coordinates inside a 1080 wide slot) ----------
const Station: React.FC<{ i: number; children: React.ReactNode }> = ({ i, children }) => (
  <div style={{ position: "absolute", left: i * W, top: 0, width: W, height: 1920 }}>{children}</div>
);

const Hook: React.FC<{ t: number }> = ({ t }) => (
  <Station i={0}>
    <Pop at={-0.2} x={540} y={250} w={440} rot={3}><Card label="PERSONAL TRAINER"><Emo bg="#FFB27F" e="🏋️‍♂️" h={220} size={150} /></Card></Pop>
    {t >= 1.15 && (
      <Pop at={1.15} x={600} y={720} w={330}><div style={{ position: "relative", height: 140 }}><Odometer x={165} y={0} from={0} to={80} at={1.25} dur={0.55} label="€ PRO STUNDE" theme={th} digits={3} /></div></Pop>
    )}
    {["🏃", "🩺", "🏋️", "⚡"].map((e, k) => (
      <Pop key={k} at={3.01 + k * 0.07} x={60 + k * 125} y={640} w={110} from={[300, 1000]} float={8}>
        <div style={{ width: 110, height: 110, borderRadius: "50%", background: "#FFFFFF", border: `6px solid ${["#7FD1FF", "#9BE89B", "#FFB27F", "#FFE07A"][k]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, boxShadow: "0 7px 0 rgba(0,0,0,.35)" }}>{e}</div>
      </Pop>
    ))}
    <Stamp text="0 €" x={770} y={790} at={3.45} color="#2FBF71" size={130} rot={-12} />
    <CoinBurst at={3.45} x={770} y={790} n={18} seed={2} />
    <Confetti at={3.45} x={770} y={790} n={30} seed={1} />
    {[0, 1, 2, 3, 4].map((k) => <Sparkle key={k} x={600 + rnd(k) * 360} y={640 + rnd(k + 9) * 300} at={3.5 + k * 0.08} size={8} />)}
  </Station>
);

const STEP1 = [
  { e: "🎯", bg: "#FF9A9A", label: "ZIEL", x: 230, hit: 5.58 },
  { e: "⏱️", bg: "#7FD1FF", label: "ZEIT", x: 540, hit: 6.33 },
  { e: "🩹", bg: "#9BE89B", label: "WAS WEHTUT", x: 850, hit: 7.08 },
];
const Step1: React.FC<{ t: number }> = ({ t }) => {
  const typed = ["Hey Claude:", ...STEP1.filter((s) => t >= s.hit).map((s) => s.label.toLowerCase().replace("was wehtut", "was wehtut").replace(/^./, (c) => c.toUpperCase()))].join(" ");
  return (
    <Station i={1}>
      <Pop at={4.92} x={150} y={250} w={780} float={3}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFFFFF", borderRadius: 22, padding: "16px 22px", boxShadow: "0 8px 0 rgba(0,0,0,.32)", fontFamily: pixelFont, fontWeight: 800, fontSize: 38, color: "#14171D" }}>
          <Img src={staticFile("logos/claude.svg")} style={{ width: 54, height: 54 }} />
          <span>{typed}<span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0, color: th.accent }}>▌</span></span>
        </div>
      </Pop>
      {STEP1.map((s, k) => (
        <React.Fragment key={k}>
          <QBlock x={s.x} y={650} hit={s.hit} />
          <Pop at={s.hit} x={s.x - 105} y={395} w={210} from={[s.x, 690]} rot={k === 1 ? 2 : -3}><Card label={s.label}><Emo bg={s.bg} e={s.e} h={124} size={84} /></Card></Pop>
          <CoinBurst at={s.hit} x={s.x} y={640} n={2} power={0.55} seed={k + 7} />
          {[0, 1, 2].map((m) => <Sparkle key={m} x={s.x - 70 + m * 70} y={620 - rnd(m + k) * 40} at={s.hit + m * 0.05} size={6} />)}
          <CheckBadge x={s.x + 95} y={405} at={7.35 + k * 0.08} size={70} />
        </React.Fragment>
      ))}
    </Station>
  );
};

const Step2: React.FC<{ t: number }> = ({ t }) => {
  const dev = cl((t - 8.45) / 0.8);
  return (
    <Station i={2}>
      <Pop at={8.42} x={330} y={250} w={420} rot={-4}>
        <Card label="DEIN EQUIPMENT" pad={14}>
          <div style={{ height: 270, background: "#E9E4D8", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 104, filter: `grayscale(${1 - dev}) brightness(${0.35 + 0.65 * dev})` }}>🏋️🧘‍♂️</div>
        </Card>
      </Pop>
      <Pop at={9.71} x={70} y={690} w={290} rot={-5}><Card label="GYM"><Emo bg="#7FD1FF" e="🏋️" h={150} size={100} /></Card></Pop>
      <Pop at={10.36} x={720} y={690} w={290} rot={5}><Card label="WOHNZIMMER"><Emo bg="#FFE07A" e="🛋️" h={150} size={100} /></Card></Pop>
      {t >= 10.11 && (
        <div style={{ position: "absolute", left: 470, top: 720, width: 140, height: 140, borderRadius: "50%", background: th.accent, border: "7px solid #14101A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 64, color: "#FFF", transform: `scale(${spring({ frame: Math.round((t - 10.11) * 30), fps: 30, config: { damping: 8 } }) * (1 + 0.06 * Math.sin(t * 12))}) rotate(-8deg)`, boxShadow: "0 8px 0 rgba(0,0,0,.35)" }}>VS</div>
      )}
      <CheckBadge x={340} y={705} at={10.7} size={70} />
      <CheckBadge x={995} y={705} at={10.8} size={70} />
      {[0, 1, 2, 3].map((k) => <Sparkle key={k} x={350 + rnd(k + 30) * 400} y={260 + rnd(k + 40) * 300} at={8.5 + k * 0.1} size={7} />)}
    </Station>
  );
};

const TRAINERS = [
  { e: "🏃", bg: "#7FD1FF", label: "ATHLETIK", at: 14.35, x: 40, y: 360 },
  { e: "🩺", bg: "#9BE89B", label: "PHYSIO", at: 15.1, x: 820, y: 360 },
  { e: "🏋️", bg: "#FFB27F", label: "KRAFT", at: 15.6, x: 40, y: 770 },
  { e: "⚡", bg: "#FFE07A", label: "EXPLOSIV", at: 16.66, x: 820, y: 770 },
];
const Step3: React.FC<{ t: number }> = ({ t }) => {
  const n = TRAINERS.filter((tr) => t >= tr.at).length;
  const on = t >= 11.66;
  const flick = on ? [1, 0, 1, 0.3, 1][cl(Math.floor((t - 11.66) / 0.07), 0, 4)] : 0;
  return (
    <Station i={3}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 236, textAlign: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 92, letterSpacing: 6, color: "#FFF", opacity: flick, textShadow: "0 0 8px #FF5FA2, 0 0 24px #FF5FA2, 0 0 60px #FF5FA2", WebkitTextStroke: "3px #FF5FA2" }}>DER TRICK</div>
      {[0, 1, 2, 3, 4, 5].map((k) => <Sparkle key={k} x={260 + k * 110} y={250 + rnd(k + 60) * 90} at={11.7 + k * 0.07} size={7} color="#FFC2E0" />)}
      {/* connection lines with data packets */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={1300}>
        {TRAINERS.map((tr, k) => {
          if (t < tr.at) return null;
          const x1 = tr.x + 110, y1 = tr.y + 100, x2 = 540, y2 = 545;
          const L = Math.hypot(x2 - x1, y2 - y1);
          const draw = cl((t - tr.at) / 0.3);
          return (
            <g key={k}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={tr.bg} strokeWidth={8} strokeDasharray={`${L}`} strokeDashoffset={L * (1 - draw)} opacity={0.9} />
              {draw >= 1 && [0, 0.33, 0.66].map((o) => { const q = ((t - tr.at) * 1.4 + o) % 1; return <rect key={o} x={x1 + (x2 - x1) * q - 8} y={y1 + (y2 - y1) * q - 8} width={16} height={16} fill="#FFFFFF" />; })}
            </g>
          );
        })}
      </svg>
      <Pop at={12.06} x={330} y={390} w={420} float={3}>
        <Card pad={12}>
          <div style={{ background: "#FFF8EA", padding: 18, fontFamily: pixelFont, fontWeight: 800 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: th.dark, color: th.floorLine, padding: "8px 14px", borderRadius: 10, fontSize: 30 }}>
              <span>DEIN PLAN</span><span style={{ color: n === 4 ? "#2FBF71" : th.gold }}>{n}/4</span>
            </div>
            {[0, 1, 2, 3, 4].map((r) => {
              const wv = 40 + rnd(r * 7 + n * 13) * 55;
              const col = n ? TRAINERS[(r + n) % n].bg : "#D8D2C4";
              return (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: col }} />
                  <div style={{ height: 16, borderRadius: 8, width: `${wv}%`, background: col, transition: "none", opacity: 0.9 }} />
                </div>
              );
            })}
          </div>
        </Card>
      </Pop>
      {TRAINERS.map((tr, k) => (
        <Pop key={k} at={tr.at} x={tr.x} y={tr.y} w={220} rot={k % 2 ? 4 : -4} from={[540, 545]}><Card label={tr.label}><Emo bg={tr.bg} e={tr.e} h={120} size={78} /></Card></Pop>
      ))}
      <Stamp text="GLEICHZEITIG" x={540} y={792} at={13.1} color="#5FD3E0" size={50} rot={-6} />
      <CheckBadge x={735} y={405} at={17.1} size={92} />
      <Confetti at={17.1} x={540} y={560} n={46} seed={5} />
      <CoinBurst at={17.1} x={540} y={560} n={10} seed={6} power={0.8} />
    </Station>
  );
};

const EXERCISES = ["🦵 Kniebeuge", "💪 Liegestütz", "🚶 Ausfallschritt", "📦 Box-Sprung"];
const SCAN = [18.7, 18.92, 19.14, 19.36];
const FIX = [19.55, 19.75, 19.95, 20.15];
const Step4: React.FC<{ t: number }> = ({ t }) => {
  const fill = inOut(cl((t - 19.45) / 0.76));
  const pct = Math.round(15 + 85 * fill);
  const col = fill < 0.4 ? "#E8505B" : fill < 0.8 ? "#F6C02E" : "#2FBF71";
  return (
    <Station i={4}>
      <Pop at={18.52} x={70} y={290} w={640} rot={-2} float={3}>
        <Card pad={12}>
          <div style={{ position: "relative", background: "#FFF8EA", padding: 18, fontFamily: pixelFont, fontWeight: 800, color: "#14171D" }}>
            <div style={{ background: th.dark, color: th.floorLine, padding: "8px 14px", borderRadius: 10, fontSize: 32, letterSpacing: 2 }}>JEDE ÜBUNG</div>
            {EXERCISES.map((ex, r) => {
              const scanned = t >= SCAN[r], fixed = t >= FIX[r];
              const flash = fixed ? Math.max(0, 1 - (t - FIX[r]) / 0.4) : 0;
              return (
                <div key={r} style={{ display: "flex", alignItems: "center", fontSize: 36, marginTop: 12, padding: "8px 10px", borderRadius: 10, background: `rgba(47,191,113,${0.35 * flash})` }}>
                  <span>{ex}</span>
                  <span style={{ marginLeft: "auto", width: 52, height: 52, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 34, background: fixed ? "#2FBF71" : scanned ? "#E8505B" : "#E4DED0", transform: `scale(${fixed ? 1 + 0.3 * flash : 1})` }}>{fixed ? "✓" : scanned ? "✗" : ""}</span>
                </div>
              );
            })}
            {t > 18.6 && t < 19.55 && (
              <div style={{ position: "absolute", left: 6, right: 6, top: interpolate(t, [18.6, 19.5], [80, 380], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), height: 8, background: "#5FD3E0", boxShadow: "0 0 24px #5FD3E0, 0 -30px 40px rgba(95,211,224,.35)" }} />
            )}
          </div>
        </Card>
      </Pop>
      <Pop at={19.3} x={780} y={300} w={190} float={3}>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, textAlign: "center", color: th.cream, fontSize: 28, letterSpacing: 2, marginBottom: 10 }}>KÖRPER-FIT</div>
        <div style={{ position: "relative", margin: "0 auto", width: 110, height: 380, background: th.dark, border: `6px solid ${th.gold}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${pct}%`, background: col, boxShadow: `0 0 30px ${col}` }} />
          {Array.from({ length: 9 }).map((_, k) => <div key={k} style={{ position: "absolute", left: 0, right: 0, top: k * 42 + 20, height: 4, background: "rgba(0,0,0,.25)" }} />)}
        </div>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, textAlign: "center", color: col, fontSize: 52, marginTop: 8 }}>{pct}%</div>
      </Pop>
      {t >= 20.21 && <Stamp text="PASST" x={875} y={560} at={20.21} color="#2FBF71" size={56} rot={-14} />}
      {[0, 1, 2, 3, 4, 5].map((k) => <Sparkle key={k} x={800 + rnd(k + 70) * 160} y={330 + rnd(k + 80) * 380} at={20.21 + k * 0.05} size={7} />)}
    </Station>
  );
};

const Step5: React.FC<{ t: number }> = ({ t }) => {
  const vf = spring({ frame: Math.round((t - 21.37) * 30), fps: 30, config: { damping: 12 } });
  const warn = t >= 24.01 && t < 24.6;
  const ok = t >= 24.6;
  const corner = (l: number, tp: number, r: number) => (
    <div style={{ position: "absolute", left: l, top: tp, width: 60, height: 60, borderTop: "8px solid #FFF", borderLeft: "8px solid #FFF", transform: `rotate(${r}deg)` }} />
  );
  return (
    <Station i={5}>
      {t >= 21.37 && (
        <div style={{ position: "absolute", left: 130, top: 840, width: 400, height: 420, transform: `scale(${1.25 - 0.25 * vf})`, opacity: vf }}>
          {corner(0, 0, 0)}{corner(340, 0, 90)}{corner(340, 360, 180)}{corner(0, 360, 270)}
          <div style={{ position: "absolute", left: 20, top: -56, display: "flex", alignItems: "center", gap: 10, fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: "#FFF" }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#E8505B", opacity: Math.floor(t * 3) % 2 ? 1 : 0.2 }} />REC · KNIEBEUGE
          </div>
        </div>
      )}
      <Pop at={22.88} x={680} y={260} w={260} rot={4}><Card label="PHYSIO"><Emo bg="#9BE89B" e="🩺" h={150} size={96} /></Card></Pop>
      <SpeechBubble text="Knie nicht nach innen!" x={560} y={580} w={440} at={23.22} theme={th} />
      {(warn || ok) && [298, 361].map((kx) => [0, 1].map((m) => {
        const q = (((t - 24.01) / 0.4) + m * 0.5) % 1;
        return <div key={`${kx}-${m}`} style={{ position: "absolute", left: kx - 20 - q * 40, top: 1180 - 20 - q * 40, width: 40 + q * 80, height: 40 + q * 80, borderRadius: "50%", border: `6px solid ${ok ? "#2FBF71" : "#E8505B"}`, opacity: (1 - q) * (ok && t > 25 ? 0 : 1) }} />;
      }))}
      {t >= 24.01 && <Pop at={24.01} x={420} y={880} w={200} rot={8} float={4}><div style={{ background: ok ? "#2FBF71" : "#E8505B", color: "#FFF", fontFamily: pixelFont, fontWeight: 800, fontSize: 40, padding: "12px 18px", borderRadius: 16, border: "6px solid #FFF", textAlign: "center", boxShadow: "0 7px 0 rgba(0,0,0,.35)" }}>{ok ? "KNIE OK" : "⚠ KNIE"}</div></Pop>}
      <CheckBadge x={640} y={880} at={24.6} size={74} />
    </Station>
  );
};

const Step6: React.FC<{ t: number }> = ({ t }) => {
  const COLS = 6, ROWS = 9, B = 70, X0 = 300, Y0 = 250;
  const built = t >= 26.62;
  const lit = cl((t - 26.84) / 0.25);
  const timer = t < 27.64 ? 45 : Math.max(0, 45 - Math.floor((t - 27.64) * 6));
  const ring = t < 27.64 ? 1 : timer / 45;
  return (
    <Station i={6}>
      {!built && Array.from({ length: COLS * ROWS }).map((_, k) => {
        const r = ROWS - 1 - Math.floor(k / COLS), c = k % COLS;
        const at = 25.45 + k * 0.021;
        const p = cl((t - at) / 0.25);
        if (p <= 0) return null;
        const y = Y0 + r * B - (1 - Easing.bounce(p)) * 900;
        const edge = c === 0 || c === COLS - 1 || r === 0 || r === ROWS - 1;
        return <div key={k} style={{ position: "absolute", left: X0 + c * B, top: y, width: B, height: B, background: edge ? "#2E3448" : "#1E2230", boxShadow: "inset 7px 7px 0 rgba(255,255,255,.12), inset -7px -7px 0 rgba(0,0,0,.35)" }} />;
      })}
      {built && (
        <div style={{ position: "absolute", left: X0, top: Y0 + Math.sin(t * 2) * 5, width: COLS * B, height: ROWS * B, background: "#1E2230", borderRadius: 42, border: "10px solid #2E3448", boxShadow: "0 14px 0 rgba(0,0,0,.4), 0 0 60px rgba(95,211,224,.25)" }}>
          <div style={{ position: "absolute", left: 18, right: 18, top: 50, bottom: 40, borderRadius: 18, background: `rgba(255,248,234,${lit})`, overflow: "hidden", fontFamily: pixelFont, fontWeight: 800, color: "#14171D" }}>
            {lit > 0 && (
              <div style={{ opacity: lit }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#2FBF71", color: "#FFF", padding: "14px 16px", fontSize: 28 }}>
                  <Img src={staticFile("logos/claude.svg")} style={{ width: 34, height: 34, background: "#FFF", borderRadius: 8, padding: 3 }} />TRAININGS-APP
                </div>
                <div style={{ position: "relative", width: 170, height: 170, margin: "18px auto 6px" }}>
                  <svg width={170} height={170}><circle cx={85} cy={85} r={70} stroke="#E4DED0" strokeWidth={16} fill="none" /><circle cx={85} cy={85} r={70} stroke={th.accent} strokeWidth={16} fill="none" strokeDasharray={440} strokeDashoffset={440 * (1 - ring)} transform="rotate(-90 85 85)" /></svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>0:{String(timer).padStart(2, "0")}</div>
                </div>
                {["Kniebeuge 3×10", "Liegestütz 3×12", "Plank 45 s"].map((r, k) => {
                  const done = t >= 28.13 + k * 0.14;
                  return (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 25, padding: "8px 16px" }}>
                      <span style={{ width: 34, height: 34, borderRadius: 8, border: "4px solid #2FBF71", background: done ? "#2FBF71" : "transparent", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{done ? "✓" : ""}</span>
                      <span style={{ textDecoration: done ? "line-through" : "none", opacity: done ? 0.55 : 1 }}>{r}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div style={{ position: "absolute", left: "50%", top: 16, width: 90, height: 14, marginLeft: -45, borderRadius: 7, background: "#0E1018" }} />
        </div>
      )}
      {[0, 1, 2, 3, 4, 5].map((k) => <Sparkle key={k} x={290 + rnd(k + 90) * 440} y={250 + rnd(k + 95) * 620} at={26.84 + k * 0.06} size={8} />)}
    </Station>
  );
};

const SUNDAYS = ["26.10.", "02.11.", "09.11.", "16.11."];
const Step7: React.FC<{ t: number }> = ({ t }) => {
  const idx = cl(Math.floor((t - 29.3) / 0.15), 0, 3);
  const fr = t > 29.3 && t < 29.9 ? ((t - 29.3) / 0.15) % 1 : 1;
  const state = t < 30.75 ? 0 : t < 31.03 ? 1 : t < 31.27 ? 2 : 3;
  const orbitOn = t >= 30.39;
  const op = spring({ frame: Math.round((t - 30.39) * 30), fps: 30, config: { damping: 12 } });
  return (
    <Station i={7}>
      <Pop at={29.16} x={70} y={300} w={400} rot={-3}>
        <Card pad={12}>
          <div style={{ background: "#FFF8EA", fontFamily: pixelFont, fontWeight: 800, textAlign: "center", color: "#14171D" }}>
            <div style={{ background: "#E8505B", color: "#FFF", fontSize: 36, padding: "10px 0", letterSpacing: 3 }}>SONNTAG</div>
            <div style={{ fontSize: 96, padding: "24px 0 6px", transform: `scaleY(${Math.abs(Math.cos(fr * Math.PI))})` }}>{SUNDAYS[idx]}</div>
            <div style={{ fontSize: 30, paddingBottom: 18, color: th.accent }}>CHECK-IN</div>
          </div>
        </Card>
      </Pop>
      <Stamp text="CHECK-IN ✓" x={280} y={660} at={29.79} color="#2FBF71" size={54} rot={-12} />
      <Pop at={30.25} x={620} y={340} w={360} float={3}>
        <Card pad={12}>
          <div style={{ background: "#FFF8EA", padding: 16, fontFamily: pixelFont, fontWeight: 800 }}>
            <div style={{ background: th.dark, color: th.floorLine, padding: "6px 12px", borderRadius: 10, fontSize: 26 }}>PLAN · WOCHE {2 + state}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 200, padding: "10px 8px 0" }}>
              {TRAINERS.map((tr, k) => {
                const h = 50 + rnd(k * 5 + state * 17) * 140;
                return <div key={k} style={{ flex: 1, height: h, background: tr.bg, borderRadius: "10px 10px 0 0", boxShadow: "inset 0 7px 0 rgba(255,255,255,.4)" }} />;
              })}
            </div>
          </div>
        </Card>
      </Pop>
      {orbitOn && TRAINERS.map((tr, k) => {
        const a = t * 2.4 + (k * Math.PI) / 2;
        const ox = 800 + Math.cos(a) * 205 * op, oy = 500 + Math.sin(a) * 215 * op;
        return <div key={k} style={{ position: "absolute", left: ox - 48, top: oy - 48, width: 96, height: 96, borderRadius: "50%", background: "#FFF", border: `6px solid ${tr.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, boxShadow: "0 6px 0 rgba(0,0,0,.35)", transform: `scale(${op})` }}>{tr.e}</div>;
      })}
      {[0, 1, 2, 3].map((k) => <Sparkle key={k} x={640 + rnd(k + 120) * 320} y={340 + rnd(k + 130) * 300} at={31.27 + k * 0.06} size={8} />)}
    </Station>
  );
};

const PLANE = ["X.......", "XXX.....", "XWWXX...", "XWWWWXX.", "XWWWWWWX", "XWWWWXX.", "XWWXX...", "XXX.....", "X......."];
const Cta: React.FC<{ t: number }> = ({ t }) => {
  const pp = cl((t - 34.45) / 0.55);
  const px = 930 + (380 - 930) * pp, py = 380 + (760 - 380) * pp - Math.sin(pp * Math.PI) * 180;
  return (
    <Station i={8}>
      <Checklist title="4-TRAINER-PROMPT" items={["Ziel & Zeit", "Equipment-Foto", "4 Trainer", "Übungs-Check", "Form-Check", "Trainings-App", "Sonntags-Update"]} x={70} y={560} w={640} at={31.8} theme={th} tickEvery={0.1} />
      <CommentCard keyword="TRAINER" at={33.3} y={290} theme={th} />
      {t >= 34.45 && t < 35.0 && (
        <div style={{ position: "absolute", left: px, top: py, transform: `rotate(${150 + pp * 30}deg)` }}>
          <PxArt rows={PLANE} pal={{ X: "#14171D", W: "#FFFFFF" }} px={11} />
        </div>
      )}
      <Confetti at={35.0} x={380} y={760} n={60} seed={9} />
      <CoinBurst at={35.0} x={380} y={760} n={16} seed={10} />
      {[35.4, 35.9, 36.4, 36.9].map((at, k) => <CoinBurst key={k} at={at} x={200 + k * 220} y={-40} n={5} power={0.15} seed={20 + k} />)}
      {[0, 1, 2, 3, 4, 5, 6].map((k) => <Sparkle key={k} x={120 + rnd(k + 150) * 840} y={260 + rnd(k + 160) * 700} at={35.0 + k * 0.12} size={8} />)}
    </Station>
  );
};

// ---------- HUD ----------
const CoinCounter: React.FC<{ t: number }> = ({ t }) => {
  const n = COIN_EVENTS.filter((c) => t >= c).length;
  const last = COIN_EVENTS.filter((c) => t >= c).pop() ?? -9;
  const bump = Math.max(0, 1 - (t - last) / 0.2);
  return (
    <div style={{ position: "absolute", left: 540, top: 92, transform: `translateX(-50%) scale(${1 + 0.18 * bump})`, display: "flex", alignItems: "center", gap: 10, background: "rgba(14,10,18,.7)", border: `5px solid ${th.gold}`, borderRadius: 18, padding: "6px 18px 6px 12px" }}>
      <div style={{ position: "relative", width: 56, height: 63 }}><PixelCoin x={28} y={32} px={7} /></div>
      <span style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 48, color: "#FFF" }}>× {String(n).padStart(2, "0")}</span>
    </div>
  );
};

// ---------- audio ----------
type Sfx = [string, number, number];
const SFX: Sfx[] = [
  ...ST.slice(1).map((s, i): Sfx => ["whoosh-quick", panStart(i + 1), 0.45]),
  ...COIN_EVENTS.map((c): Sfx => ["coin", c, 0.2]),
  ...JUMPS.map(([s]): Sfx => ["jump", s, 0.22]),
  ...BLOCK_HITS.map((h): Sfx => ["bump", h, 0.45]),
  ...[0, 1.15, 3.01, 4.92, 5.6, 6.35, 7.1, 8.42, 9.71, 10.11, 10.36, 12.06, 14.35, 15.1, 15.6, 16.66, 18.52, 19.3, 22.88, 23.22, 24.01, 26.84, 29.16, 30.25, 30.39, 31.8, 33.3].map((a): Sfx => ["ui-pop", a, 0.42]),
  ...[7.35, 10.7, 17.1, 19.55, 19.75, 19.95, 20.15, 24.6, 28.13, 28.27, 28.41, 32.1, 32.4, 32.7, 34.4].map((a): Sfx => ["check", a, 0.38]),
  ...[3.45, 13.1, 20.21, 29.79].map((a): Sfx => ["stamp", a, 0.55]),
  ...[8.34, 22.07].map((a): Sfx => ["click", a, 0.6]),
  ...[25.5, 25.8, 26.1, 26.4].map((a): Sfx => ["click", a, 0.25]),
  ...[7.4, 20.21, 24.6, 31.27].map((a): Sfx => ["chime", a, 0.35]),
  ["riser", 10.85, 0.32], ["typing", 33.55, 0.4], ["powerup", 17.1, 0.3], ["powerup", 35.0, 0.32],
];

// ---------- composition ----------
export const SirTokenPixelReel: React.FC = () => {
  const { f, fps, t } = useT();
  const cam = camAt(t);
  const st = stationAt(t);
  const pan = panning(t);
  const sx = sxAt(t);
  const moving = pan || Math.abs(sxAt(t + 0.05) - sxAt(t - 0.05)) > 2;
  const lift = liftAt(t);
  const [sqx, sqy] = squashAt(t);
  const breathe = lift < 2 && sqy === 1 ? Math.sin(t * 5) : 0;
  const ssx = sqx * (1 - 0.018 * breathe), ssy = sqy * (1 + 0.028 * breathe);
  const arm = ARMS.find(([a, b]) => t >= a && t < b);
  const swing = moving ? 35 * Math.sin(t * (pan ? 22 : 15)) : 5 * Math.sin(t * 3);
  const armL = lift > 20 ? 155 : arm ? arm[2] : (moving ? 35 : 22) + swing;
  const armR = lift > 20 ? 155 : arm ? arm[3] : (moving ? 35 : 22) - swing;
  const ctaWave = t > 35.3 ? 130 + 25 * Math.sin(t * 9) : null;
  const pose: SirPose = {
    expr: exprAt(t),
    blink: t % 2.7 < 0.09,
    walk: moving && lift < 5 ? (Math.floor(t * (pan ? 12 : 8)) % 2 as 0 | 1) : null,
    squat: SQUAT(t),
    armL: Math.round(armL / 5) * 5,
    armR: Math.round((ctaWave ?? armR) / 5) * 5,
    hatLift: t > 34.9 && t < 35.7 ? Math.round(4 * Math.sin(((t - 34.9) / 0.8) * Math.PI)) : 0,
  };
  const goingLeft = !pan && sxAt(t + 0.05) < sxAt(t - 0.05) - 2;
  const flip = goingLeft || FLIP.some(([a, b]) => t >= a && t < b);

  const punch = PUNCH.reduce((a, p) => { const d = t - p; return d >= 0 && d < 0.25 ? Math.max(a, Math.sin((d / 0.25) * Math.PI)) : a; }, 0);
  const shake = SHAKE.reduce((a, p) => { const d = t - p; return d >= 0 && d < 0.3 ? a + (1 - d / 0.3) * 14 : a; }, 0);
  const shx = shake * Math.sin(f * 2.3), shy = shake * Math.cos(f * 3.1);
  const flash = flashAt.reduce((a, p) => { const d = t - p; return d >= 0 && d < 0.2 ? Math.max(a, 1 - d / 0.2) : a; }, 0);
  const near = (i: number) => Math.abs(i - st) <= 1;
  const stations = [Hook, Step1, Step2, Step3, Step4, Step5, Step6, Step7, Cta];

  return (
    <AbsoluteFill style={{ background: "#120C16", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${shx + 8 * Math.sin(t * 0.5)}px, ${shy + 5 * Math.sin(t * 0.37)}px) scale(${1.012 + 0.012 * Math.sin(t * 0.8) + 0.035 * punch})` }}>
        <WallLayer cam={cam} t={t} f={f} />
        {/* warm spotlight following Sir Token */}
        <div style={{ position: "absolute", left: sx - 420, top: 300, width: 840, height: 1000, background: "radial-gradient(ellipse at 50% 70%, rgba(255,190,120,.16), transparent 62%)" }} />
        <MidLayer cam={cam} t={t} />
        <FloorLayer cam={cam} t={t} />
        <div style={{ position: "absolute", left: -cam, top: 0, width: W * 9, height: 1920 }}>
          {stations.map((S, i) => (near(i) ? <S key={i} t={t} /> : null))}
          {COINS.map((c, k) => (t < c.t ? <PixelCoin key={k} x={c.x} y={c.y + Math.sin(t * 4 + k) * 8} px={7} phase={c.phase} /> : t < c.t + 0.4 ? (
            <React.Fragment key={k}>
              <PixelCoin x={c.x} y={c.y - (t - c.t) * 300} px={7} phase={c.phase} opacity={1 - (t - c.t) / 0.4} scale={1 + (t - c.t)} />
              <div style={{ position: "absolute", left: c.x + 20, top: c.y - 60 - (t - c.t) * 200, fontFamily: pixelFont, fontWeight: 800, fontSize: 40, color: "#FFE07A", opacity: 1 - (t - c.t) / 0.4, textShadow: "0 4px 0 #5A3A06" }}>+1</div>
            </React.Fragment>
          ) : null))}
        </div>
        <SirTokenHD x={sx} floorY={FLOOR} px={PX} pose={pose} lift={lift} flip={flip} sx={ssx} sy={ssy} />
        <Dust cam={cam} t={t} />
        <ForegroundLayer cam={cam} t={t} />
        {/* HUD */}
        {st >= 1 && st <= 7 && <StepBadge key={st} n={st} at={ST[st] - 0.3} theme={th} />}
        <MiniGrid total={7} current={st} theme={th} />
        <CoinCounter t={t} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,.45) 100%)", pointerEvents: "none" }} />
      <PillCaptions words={WORDS} theme={th} />
      {flash > 0 && <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash * 0.85 }} />}

      <Audio src={staticFile("sirtoken/voice.mp3")} volume={1} />
      <Audio src={staticFile("sirtoken/music.mp3")} volume={0.085} loop />
      {SFX.map(([src, at, v], k) => (
        <Sequence key={k} from={Math.max(0, Math.round(at * fps))} durationInFrames={Math.round(2 * fps)}>
          <Audio src={staticFile(`sirtoken/sfx-${src}.mp3`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
