import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, OffthreadVideo, spring, staticFile } from "remotion";
import { useSec, Word } from "../components/SatireKit";
import { AUSTRALIA, EUROPE, GERMANY, ITALY, WORLD } from "./geo-australien";

// v6 = v5 + fixes (space before "verlernt.", hard map->phone cut, order scene in the 8.7-12 s gap).
// v5 (Henri: "erste Sekunde viel dopaminausschüttender"): dense hook B-Roll from frame 0 (globe spin-in + snap, plane trail,
// day counter, boarding pass flip, chat bubble pop, hook text big inside the scene). Rest = v4.
// GPT-S @florentgpt "Wie heißt das auf Deutsch" (Australien) v4, 2026-10-12: v3 Apple base + ChatGPT UI language
// (Henri: "bring auch noch son bisschen ChatGPT-Style rein"). ChatGPT moments: chat in the phone, voice-mode orb, streamed answer.
// No OpenAI logo, only the UI style and the plain label "ChatGPT". Accent per scene: Apple blue (map) or ChatGPT green.
// Henri on v2: "mega scheiße" (stamps, grid, condensed+serif, overlay cards). v3 = clean Apple keynote / product-film look:
// neutral palette (white, black, greys, one subtle blue), one clean sans (Inter variable, display optical size, bundled
// locally), real animated B-Roll scenes filling the split panel (world map flight line, drawn fork hero shot, map zoom
// onto Apulia, 3D iPhone with translate UI, voice-memo waveform). Only two big type moments ("365 Tage", "Gabel.").
// No cards over the avatar, no stamps, no counters, no photos. Punchline stays on the speaker, calm.
export type Framing = { ax: number; ay: number; s: number; tx: number; ty: number };
export type SatireAustralienV6Props = { src: string; seconds: number; words: Word[]; c: Record<string, number>; fr: Framing; capY: number };

const FONT = "GPTS Inter";
const INK = "#1D1D1F";
const GREY = "#86868B";
const LIGHT = "#F5F5F7";
const BLUE = "#0071E3";
const GREEN = "#10A37F";
const G_BG = "#F4F4F4";
const G_INK = "#212121";

const useLocalFonts = () => {
  const [h] = useState(() => delayRender("gpts inter"));
  useEffect(() => {
    new FontFace(FONT, `url(${staticFile("fonts/gpts/Inter-VF.ttf")})`, { weight: "100 900" })
      .load()
      .then((f) => { (document.fonts as unknown as { add: (x: FontFace) => void }).add(f); continueRender(h); })
      .catch((e) => { console.error(e); continueRender(h); });
  }, [h]);
};
const type = (size: number, weight: number, color = INK, track = -0.022): React.CSSProperties => ({
  fontFamily: FONT, fontSize: size, fontWeight: weight, color, letterSpacing: `${track}em`, fontVariationSettings: `"opsz" 32`, lineHeight: 1.04,
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.42, 0, 0.58, 1); // ease-in-out
const out = Easing.bezier(0.16, 1, 0.3, 1); // soft ease-out
const PH = 800;
const IN = 0.34;
type Win = { from: number; to: number };
const envelope = (t: number, w: Win) =>
  Math.min(interpolate(t, [w.from, w.from + IN], [0, 1], { ...clamp, easing: io }), interpolate(t, [w.to - IN, w.to], [1, 0], { ...clamp, easing: io }));
const prog = (t: number, a: number, b: number, e = io) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });

// Gentle reveal: blur-in, scale from 0.96, small rise.
const Reveal: React.FC<{ at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, dur = 0.6, children, style }) => {
  const { t } = useSec();
  const p = prog(t, at, at + dur, out);
  return <div style={{ opacity: p, filter: `blur(${(1 - p) * 12}px)`, transform: `translateY(${(1 - p) * 18}px) scale(${0.96 + 0.04 * p})`, ...style }}>{children}</div>;
};

const Typed: React.FC<{ text: string; start: number; end: number; style?: React.CSSProperties }> = ({ text, start, end, style }) => {
  const { t } = useSec();
  const n = Math.round(interpolate(t, [start, end], [0, text.length], clamp));
  const caret = t < end + 0.5 && Math.floor(t * 3) % 2 === 0;
  return <div style={style}>{text.slice(0, n)}<span style={{ display: "inline-block", width: 3, height: "1em", background: BLUE, marginLeft: 3, verticalAlign: "-0.15em", opacity: caret ? 1 : 0 }} /></div>;
};

const Panel: React.FC<{ w: Win; bg: string; children: React.ReactNode }> = ({ w, bg, children }) => {
  const { t } = useSec();
  const s = envelope(t, w);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, transform: `translateY(${-(1 - s) * PH}px)`, background: bg, overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,0.18)" }}>
      {children}
    </div>
  );
};

// ---------- Scene 1: world map, flight line Sydney -> Germany, "365 Tage" ----------
const SYD = { x: 151.2, y: 36.1 };
const GER = { x: 10.4, y: -59.8 };
const WorldScene: React.FC<{ w: Win; textAt: number }> = ({ w, textAt }) => {
  const { t } = useSec();
  const k = prog(t, w.from, w.to, Easing.linear);
  const s = 5.1 + 0.5 * k; // slow push-in
  const cx = 84 - 6 * k, cy = -14;
  const tf = `translate(${540 - cx * s} ${400 - cy * s}) scale(${s})`;
  const arcP = prog(t, w.from + 0.25, w.from + 1.15, io);
  const ctrl = { x: 82, y: -92 };
  const at = (u: number) => ({ x: (1 - u) ** 2 * SYD.x + 2 * (1 - u) * u * ctrl.x + u * u * GER.x, y: (1 - u) ** 2 * SYD.y + 2 * (1 - u) * u * ctrl.y + u * u * GER.y });
  const dot = at(arcP);
  const dim = 1 - 0.55 * prog(t, textAt - 0.1, textAt + 0.4);
  const proj = (p: { x: number; y: number }) => ({ x: 540 + (p.x - cx) * s, y: 400 + (p.y - cy) * s });
  const ps = proj(SYD), pg = proj(GER);
  return (
    <AbsoluteFill>
      <svg width={1080} height={PH} style={{ position: "absolute", opacity: dim }}>
        <defs>
          <radialGradient id="glowMap" cx="50%" cy="60%" r="70%"><stop offset="0%" stopColor="#1A1A1C" /><stop offset="100%" stopColor="#000" /></radialGradient>
        </defs>
        <rect width={1080} height={PH} fill="url(#glowMap)" />
        <g transform={tf}>
          {WORLD.map((d, i) => <path key={i} d={d} fill="#2C2C2E" stroke="#000" strokeWidth={0.25} />)}
          {AUSTRALIA.map((d, i) => <path key={`a${i}`} d={d} fill="#4A4A4E" />)}
          {GERMANY.map((d, i) => <path key={`g${i}`} d={d} fill="#4A4A4E" />)}
          <path d={`M ${SYD.x} ${SYD.y} Q ${ctrl.x} ${ctrl.y} ${GER.x} ${GER.y}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.9} strokeWidth={0.55} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arcP} />
        </g>
        <circle cx={ps.x} cy={ps.y} r={9} fill="#fff" />
        <circle cx={pg.x} cy={pg.y} r={9} fill="#fff" opacity={prog(t, w.from + 1.05, w.from + 1.25)} />
        {arcP > 0 && arcP < 1 && <circle cx={proj(dot).x} cy={proj(dot).y} r={11} fill="#fff" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))" }} />}
      </svg>
      <div style={{ position: "absolute", left: ps.x - 40, top: ps.y + 22, ...type(28, 500, GREY, 0), opacity: dim * prog(t, w.from + 0.2, w.from + 0.5) }}>Sydney</div>
      <div style={{ position: "absolute", left: pg.x - 70, top: pg.y + 22, ...type(28, 500, GREY, 0), opacity: dim * prog(t, w.from + 1.1, w.from + 1.4) }}>Deutschland</div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 290, display: "flex", justifyContent: "center" }}>
        <Reveal at={textAt} dur={0.55}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
            <span style={type(210, 600, "#FFFFFF", -0.035)}>365</span>
            <span style={type(210, 300, "#A1A1A6", -0.035)}>Tage</span>
          </div>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};


// ---------- Hook scene (frame 0 .. end of S1): maximum motion, still clean ----------
type LL = [number, number];
const RINGS: LL[][] = WORLD.flatMap((d) => d.split("Z").filter((x) => x.includes("M")).map((r) => {
  const nums = r.replace(/[ML]/g, " ").trim().split(/\s+/).map(Number);
  const pts: LL[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], (2 * Math.atan(Math.exp((-nums[i + 1] * Math.PI) / 180)) - Math.PI / 2) * (180 / Math.PI)]);
  return pts;
}));
const rad = Math.PI / 180;
const ortho = (lon: number, lat: number, lon0: number, lat0: number, R: number) => {
  const dl = (lon - lon0) * rad, p = lat * rad, p0 = lat0 * rad;
  const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(dl);
  let x = R * Math.cos(p) * Math.sin(dl);
  let y = R * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(dl));
  if (cosc < 0) { const m = Math.hypot(x, y) || 1; x = (x / m) * R; y = (y / m) * R; }
  return { x, y: -y, vis: cosc >= 0 };
};
const toV = (lon: number, lat: number) => [Math.cos(lat * rad) * Math.cos(lon * rad), Math.cos(lat * rad) * Math.sin(lon * rad), Math.sin(lat * rad)];
const slerp = (a: LL, b: LL, u: number): LL => {
  const A = toV(a[0], a[1]), B = toV(b[0], b[1]);
  const d = Math.acos(Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]));
  const s1 = Math.sin((1 - u) * d) / Math.sin(d), s2 = Math.sin(u * d) / Math.sin(d);
  const v = [A[0] * s1 + B[0] * s2, A[1] * s1 + B[1] * s2, A[2] * s1 + B[2] * s2];
  return [Math.atan2(v[1], v[0]) / rad, Math.asin(v[2]) / rad];
};
const SYD_LL: LL = [151.2, -33.9];
const FRA_LL: LL = [8.7, 50.1];

const HookScene: React.FC<{ end: number; verlernt: number }> = ({ end, verlernt }) => {
  const { t, frame, fps } = useSec();
  const sp = (at: number, d = 12, st = 220) => (t < at ? 0 : spring({ frame: frame - at * fps, fps, config: { damping: d, stiffness: st, mass: 0.55 } }));
  // globe: spins in fast and snaps onto Australia (overshoot), then follows the plane to Europe
  const snap = sp(0, 13, 120);
  const spinLon = 134 - 620 * (1 - snap);
  const fly = prog(t, 1.15, 2.05, io);
  const plane = slerp(SYD_LL, FRA_LL, fly);
  const follow = slerp([134, -25], [25, 38], prog(t, 1.2, 2.25, io));
  const lon0 = t < 1.2 ? spinLon : follow[0];
  const lat0 = t < 1.2 ? -25 + 30 * (1 - snap) : follow[1];
  const R = 255 * (0.62 + 0.38 * sp(0, 14, 140)) * (1 + 0.04 * prog(t, 0, end, Easing.linear)) * (1 + 0.55 * prog(t, 2.35, 3.4, io));
  const cx = 540, cy = 470 + 230 * prog(t, 2.35, 3.4, io);
  const spinBlur = Math.min(8, Math.abs(620 * (1 - snap)) / 60);
  const ringsD = RINGS.map((r) => {
    let d = "";
    r.forEach(([lo, la], i) => { const q = ortho(lo, la, lon0, lat0, R); d += `${i ? "L" : "M"}${(cx + q.x).toFixed(1)} ${(cy + q.y).toFixed(1)}`; });
    return d + "Z";
  });
  const trail: string[] = [];
  const steps = 40;
  for (let i = 0; i <= steps * fly; i++) { const p = slerp(SYD_LL, FRA_LL, i / steps); const q = ortho(p[0], p[1], lon0, lat0, R); if (q.vis) trail.push(`${trail.length ? "L" : "M"}${(cx + q.x).toFixed(1)} ${(cy + q.y).toFixed(1)}`); }
  const pq = ortho(plane[0], plane[1], lon0, lat0, R);
  const sq = ortho(SYD_LL[0], SYD_LL[1], lon0, lat0, R);
  const fq = ortho(FRA_LL[0], FRA_LL[1], lon0, lat0, R);
  const pin = sp(0.85, 9, 260);
  const pinF = sp(2.0, 9, 260);
  // day counter rips 0 -> 365 with motion blur
  const cnt = prog(t, 1.1, 1.85, Easing.bezier(0.3, 0, 0.2, 1));
  const days = Math.round(365 * cnt);
  const cBlur = t > 1.1 && t < 1.85 ? 4 * (1 - cnt) + 1.5 : 0;
  const cPop = sp(1.1, 10, 240);
  const cPunch = 1 + 0.12 * Math.max(0, Math.sin(Math.min(1, (t - 1.85) / 0.25) * Math.PI)) * (t > 1.85 ? 1 : 0);
  // boarding pass flips in
  const bp = sp(0.55, 13, 170);
  // chat bubble pops
  const b1 = sp(1.5, 11, 260);
  const b2 = sp(1.8, 11, 260);
  // hook text: big, readable from frame 0
  const hk = 1 - prog(t, 2.25, 2.5);
  const away = prog(t, 2.3, 2.7, io);
  const push = 1 + 0.06 * prog(t, 0, end, Easing.linear);
  const par = (k: number) => `translate(${(t - 1.2) * -6 * k}px, ${(t - 1.2) * -3 * k}px)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 55%" }}>
        <div style={{ position: "absolute", left: cx - R * 1.6, top: cy - R * 1.6, width: R * 3.2, height: R * 3.2, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,163,127,0.16) 0%, rgba(0,0,0,0) 60%)" }} />
        <svg width={1080} height={PH} style={{ position: "absolute", filter: `blur(${spinBlur}px)`, transform: par(0.5) }}>
          <defs>
            <radialGradient id="ocean" cx="40%" cy="35%" r="75%"><stop offset="0%" stopColor="#2A2A2D" /><stop offset="100%" stopColor="#0B0B0C" /></radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={R} fill="url(#ocean)" stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} />
          {ringsD.map((d, i) => <path key={i} d={d} fill="#5A5A5F" />)}
          <path d={trail.join("")} fill="none" stroke={GREEN} strokeWidth={10} strokeOpacity={0.35} strokeLinecap="round" style={{ filter: "blur(6px)" }} />
          <path d={trail.join("")} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
          {sq.vis && <circle cx={cx + sq.x} cy={cy + sq.y} r={11 * pin} fill={GREEN} stroke="#fff" strokeWidth={3} />}
          {fq.vis && <circle cx={cx + fq.x} cy={cy + fq.y} r={11 * pinF} fill={GREEN} stroke="#fff" strokeWidth={3} />}
          {fly > 0 && fly < 1 && pq.vis && <g transform={`translate(${cx + pq.x} ${cy + pq.y})`}><circle r={16} fill="#fff" style={{ filter: "drop-shadow(0 0 12px rgba(255,255,255,0.9))" }} /></g>}
        </svg>
        {/* hook text */}
        <div style={{ position: "absolute", left: 0, width: 1080, top: 44, textAlign: "center", opacity: hk, transform: par(1.2) }}>
          <div style={{ ...type(92, 700, "#FFFFFF", -0.035), transform: `scale(${0.94 + 0.06 * sp(0, 14, 200)})` }}>Ein Jahr Australien.</div>
          <div style={{ ...type(58, 400, "#A1A1A6", -0.02), marginTop: 8, opacity: 0.35 + 0.65 * prog(t, 0.0, 0.35) }}>Und dann kam das Handy.</div>
        </div>
        {/* day counter */}
        <div style={{ position: "absolute", left: 70, top: 520, transform: `${par(1.6)} translateX(${-away * 700}px) scale(${cPop * cPunch})`, transformOrigin: "0% 100%", display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ ...type(170, 700, "#FFFFFF", -0.04), filter: `blur(${cBlur}px)`, fontVariantNumeric: "tabular-nums" }}>{days}</span>
          <span style={type(64, 400, "#A1A1A6", -0.02)}>Tage</span>
        </div>
        {/* boarding pass */}
        <div style={{ position: "absolute", left: 650, top: 470, perspective: 900, transform: `${par(1.4)} translateX(${away * 600}px)` }}>
          <div style={{ width: 360, background: "#FFFFFF", borderRadius: 28, padding: "22px 26px", boxSizing: "border-box", boxShadow: "0 30px 60px rgba(0,0,0,0.45)", transform: `rotateX(${(1 - bp) * -90}deg) rotateZ(${4 - 4 * bp}deg)`, transformOrigin: "50% 0%", opacity: Math.min(1, bp * 3) }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={type(20, 600, GREY, 0.08)}>BORDKARTE</span><span style={type(20, 600, GREEN, 0.04)}>ONE WAY</span></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
              <span style={type(66, 700, G_INK, -0.03)}>SYD</span>
              <svg width={70} height={20}><path d="M2 10 H62 M52 2 L64 10 L52 18" stroke={G_INK} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={type(66, 700, G_INK, -0.03)}>FRA</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}><span style={type(22, 400, GREY, 0)}>nach 365 Tagen</span><span style={type(22, 400, GREY, 0)}>Sitz 1A</span></div>
          </div>
        </div>
        {/* chat bubbles */}
        <div style={{ position: "absolute", right: 60, top: 260, transform: `${par(1.8)} scale(${b1})`, transformOrigin: "100% 100%", opacity: Math.min(1, b1 * 2) * hk }}>
          <div style={{ background: "#2F2F2F", borderRadius: 30, padding: "16px 24px", ...type(34, 500, "#FFFFFF", -0.01) }}>Wie heißt das nochmal auf Deutsch?</div>
        </div>
        {/* 2.45 s: ChatGPT answer bubble streams in, "verlernt" lights up on the spoken word */}
        <div style={{ position: "absolute", left: 70, right: 70, top: 70, transform: `${par(1.0)} scale(${0.9 + 0.1 * sp(2.45, 12, 220)})`, transformOrigin: "50% 0%", opacity: prog(t, 2.45, 2.6) }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: "#2F2F2F", borderRadius: 30, padding: "16px 24px", ...type(38, 500, "#FFFFFF", -0.01) }}>Kann er noch Deutsch?</div>
          </div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
            <Stream text="365 Tage Australien. Deutsch:" start={2.75} end={3.35} dot={24} style={{ ...type(46, 500, "#ECECEC", -0.015) }} />
            <span style={{ ...type(46, 700, GREEN, -0.015), display: "inline-block", marginLeft: 6, opacity: prog(t, verlernt - 0.05, verlernt + 0.1), transform: `scale(${t < verlernt ? 0.6 : 1 + 0.25 * Math.max(0, Math.sin(Math.min(1, (t - verlernt) / 0.3) * Math.PI))})` }}>verlernt.</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 70, top: 352, transform: `${par(1.8)} scale(${b2})`, transformOrigin: "0% 100%", opacity: Math.min(1, b2 * 2) * hk }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, ...type(30, 500, "#ECECEC", -0.01) }}>
            <span style={{ width: 22, height: 22, borderRadius: 11, background: "#ECECEC", transform: `scale(${0.8 + 0.25 * Math.abs(Math.sin(t * 8))})` }} />
            <span style={{ opacity: 0.8 }}>ChatGPT denkt nach …</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


// ChatGPT light chat beat before the fork: "Wie heißt das nochmal auf Deutsch?"
const AskScene: React.FC<{ ask: number; think: number; ans: number; cut: number }> = ({ ask, think, ans, cut }) => {
  const { t, frame, fps } = useSec();
  const sp = (at: number) => (t < at ? 0 : spring({ frame: frame - at * fps, fps, config: { damping: 12, stiffness: 230, mass: 0.55 } }));
  const o = 1 - prog(t, cut - 0.06, cut + 0.04);
  const a = sp(ask);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", opacity: o }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 60, textAlign: "center", ...type(32, 600, G_INK, -0.01) }}>ChatGPT</div>
      <div style={{ position: "absolute", right: 80, top: 160, transform: `scale(${a})`, transformOrigin: "100% 100%" }}>
        <div style={{ background: G_BG, borderRadius: 36, padding: "22px 32px", ...type(52, 500, G_INK, -0.015) }}>Wie heißt das nochmal auf Deutsch?</div>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 330 }}>
        <Stream text="Welches Wort meinst du? Das Ding mit den vier Zinken?" start={ans} end={ans + 0.75} dot={30} style={{ ...type(52, 500, G_INK, -0.015), lineHeight: 1.25, opacity: t >= think ? 1 : 0 }} />
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 600, opacity: prog(t, ask - 0.2, ask) }}><Composer size={34} /></div>
    </AbsoluteFill>
  );
};


// Order scene (v6): clean order card pops in line by line, the English order as a chat bubble, green chip "auf Englisch".
const OrderScene: React.FC<{ start: number; bubble: number; chip: number }> = ({ start, bubble, chip }) => {
  const { t, frame, fps } = useSec();
  const sp = (at: number, d = 12, st = 220) => (t < at ? 0 : spring({ frame: frame - at * fps, fps, config: { damping: d, stiffness: st, mass: 0.55 } }));
  const card = sp(start, 14, 170);
  const lines: [string, string, string][] = [["4×", "Aperol Spritz", "32,00 €"], ["4×", "Orecchiette", "56,00 €"], ["1×", "Burrata", "14,00 €"]];
  const b = sp(bubble);
  const ch = sp(chip, 10, 260);
  const push = 1 + 0.04 * prog(t, start, start + 2.4, Easing.linear);
  return (
    <AbsoluteFill style={{ background: G_BG }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", left: 80, top: 70, width: 520, background: "#FFFFFF", borderRadius: 36, padding: "30px 34px", boxSizing: "border-box", boxShadow: "0 30px 60px rgba(0,0,0,0.10), 0 6px 14px rgba(0,0,0,0.06)", transform: `translateY(${(1 - card) * 120}px) scale(${0.94 + 0.06 * card})`, opacity: Math.min(1, card * 2) }}>
          <div style={type(26, 600, GREY, 0.02)}>Bestellung · Tisch 4</div>
          <div style={{ height: 2, background: "#ECECEC", margin: "18px 0 8px" }} />
          {lines.map(([n, name, price], i) => {
            const p = sp(start + 0.2 + i * 0.22, 12, 240);
            return (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "12px 0", opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
                <span style={type(36, 700, G_INK, -0.01)}>{n}</span>
                <span style={{ ...type(36, 500, G_INK, -0.01), flex: 1 }}>{name}</span>
                <span style={type(28, 400, GREY, 0)}>{price}</span>
              </div>
            );
          })}
          <div style={{ height: 2, background: "#ECECEC", margin: "8px 0 14px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", opacity: sp(start + 0.9) }}><span style={type(30, 600, G_INK, 0)}>für alle</span><span style={type(30, 700, G_INK, 0)}>102,00 €</span></div>
        </div>
        <div style={{ position: "absolute", right: 70, top: 420, transform: `scale(${b})`, transformOrigin: "100% 100%" }}>
          <div style={{ background: "#FFFFFF", borderRadius: 36, padding: "22px 30px", ...type(46, 500, G_INK, -0.015), boxShadow: "0 14px 30px rgba(0,0,0,0.08)" }}>Four Spritz for everyone, please!</div>
        </div>
        <div style={{ position: "absolute", right: 70, top: 560, transform: `scale(${ch})`, transformOrigin: "100% 0%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(16,163,127,0.12)", borderRadius: 999, padding: "10px 22px", ...type(32, 600, GREEN, 0) }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: GREEN }} />selbstverständlich auf Englisch
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Scene 2: fork hero shot (drawn, brushed steel), "Gabel." ----------
const FORK = "M -34 0 L -24 0 L -24 112 L -15 112 L -15 0 L -5 0 L -5 112 L 5 112 L 5 0 L 15 0 L 15 112 L 24 112 L 24 0 L 34 0 L 34 130 C 34 168, 13 182, 9 210 L 7 268 C 7 310, 15 372, 17 486 C 18 532, -18 532, -17 486 C -15 372, -7 310, -7 268 L -9 210 C -13 182, -34 168, -34 130 Z";
const ForkScene: React.FC<{ w: Win; at: number }> = ({ w, at }) => {
  const { t } = useSec();
  const k = prog(t, w.from, w.to, Easing.linear);
  const rot = -33 + 7 * k;
  const sc = 1.0 + 0.08 * k;
  const sheen = 20 + 60 * k; // highlight sweeps along the steel
  const enter = prog(t, w.from + 0.05, w.from + 0.7, out);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <svg width={1080} height={PH} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0.15">
            <stop offset="0%" stopColor="#6E6E73" />
            <stop offset={`${Math.max(5, sheen - 18)}%`} stopColor="#B8B8BD" />
            <stop offset={`${sheen}%`} stopColor="#FFFFFF" />
            <stop offset={`${Math.min(95, sheen + 14)}%`} stopColor="#A1A1A6" />
            <stop offset="100%" stopColor="#58585D" />
          </linearGradient>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22" /></filter>
        </defs>
        <g transform={`translate(800 ${430 + (1 - enter) * 40}) rotate(${rot}) scale(${sc * 1.55})`} opacity={enter}>
          <path d={FORK} transform="translate(26 40)" fill="#000" opacity={0.16} filter="url(#soft)" />
          <path d={FORK} transform="translate(0 -250)" fill="url(#steel)" stroke="#8E8E93" strokeWidth={0.8} strokeLinejoin="round" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 90, top: 250 }}>
        <Reveal at={w.from + 0.15} dur={0.5}><div style={type(40, 400, GREY, -0.01)}>Wie heißt das nochmal?</div></Reveal>
        <div style={{ height: 18 }} />
        <Reveal at={at} dur={0.55}><div style={type(230, 600, INK, -0.045)}>Gabel.</div></Reveal>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 3: Apple-Maps-like zoom onto Apulia ----------
const POL = { x: 17.22, y: -45.03 };
const MapScene: React.FC<{ w: Win; cut: number }> = ({ w, cut }) => {
  const { t } = useSec();
  const k = prog(t, w.from + 0.1, cut - 0.15, io);
  const s = 62 + (175 - 62) * k;
  const ex = POL.x - 0.9, ey = POL.y + 0.55;
  const cx = 12.6 + (ex - 12.6) * k, cy = -47.2 + (ey + 47.2) * k;
  const px = 540 + (POL.x - cx) * s, py = 400 + (POL.y - cy) * s;
  const tf = `translate(${540 - cx * s} ${400 - cy * s}) scale(${s})`;
  const pin = prog(t, cut - 0.75, cut - 0.45, out);
  const o = t < cut ? 1 : 0; // hard cut, no double image
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={PH} style={{ position: "absolute" }}>
        <rect width={1080} height={PH} fill="#E8EBEE" />
        <g transform={tf}>
          {EUROPE.map((d, i) => <path key={i} d={d} fill="#F7F7F5" stroke="#D3D6DA" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />)}
          {ITALY.map((d, i) => <path key={`i${i}`} d={d} fill="#FFFFFF" stroke="#C7CBD0" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />)}
        </g>
      </svg>
      <div style={{ position: "absolute", left: px, top: py, transform: `translate(-50%, -100%) scale(${pin})`, transformOrigin: "50% 100%" }}>
        <div style={{ width: 54, height: 54, borderRadius: 27, background: BLUE, border: "6px solid #fff", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }} />
        <div style={{ width: 4, height: 20, background: "#fff", margin: "0 auto", boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }} />
      </div>
      <div style={{ position: "absolute", left: px - 480, width: 430, textAlign: "right", top: py - 92, opacity: pin }}>
        <div style={type(40, 600, INK, -0.015)}>Polignano a Mare</div>
        <div style={type(28, 400, GREY, 0)}>Apulien, Italien</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 4: floating iPhone, translate UI DE -> IT ----------
const IPhone: React.FC<{ children: React.ReactNode; w?: number; h?: number }> = ({ children, w = 500, h = 1030 }) => (
  <div style={{ width: w, height: h, borderRadius: 74, padding: 13, boxSizing: "border-box", background: "linear-gradient(135deg, #3A3A3C 0%, #1C1C1E 45%, #48484A 100%)", boxShadow: "0 50px 90px rgba(0,0,0,0.30), 0 12px 24px rgba(0,0,0,0.18), inset 0 0 0 2px rgba(255,255,255,0.10)" }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 62, overflow: "hidden", background: "#FFFFFF" }}>
      <div style={{ position: "absolute", left: "50%", top: 16, transform: "translateX(-50%)", width: 118, height: 34, borderRadius: 17, background: "#000", zIndex: 2 }} />
      {children}
    </div>
  </div>
);
// Token-by-token streaming (word chunks) with ChatGPT's filled typing dot at the end.
const Stream: React.FC<{ text: string; start: number; end: number; style?: React.CSSProperties; dot?: number }> = ({ text, start, end, style, dot = 22 }) => {
  const { t } = useSec();
  const toks = text.match(/\S+\s*/g) ?? [];
  const n = Math.floor(interpolate(t, [start, end], [0, toks.length], clamp));
  const thinking = t < start;
  const live = t < end + 0.35;
  return (
    <div style={style}>
      {toks.slice(0, n).map((x, i) => {
        const at = start + ((end - start) * i) / toks.length;
        return <span key={i} style={{ opacity: prog(t, at, at + 0.18) }}>{x}</span>;
      })}
      {live && <span style={{ display: "inline-block", width: dot, height: dot, borderRadius: dot, background: G_INK, marginLeft: 4, verticalAlign: "-0.05em", transform: `scale(${thinking ? 0.8 + 0.25 * Math.abs(Math.sin(t * 5)) : 1})` }} />}
    </div>
  );
};

const Composer: React.FC<{ size?: number; dark?: boolean }> = ({ size = 30, dark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, background: dark ? "#2F2F2F" : "#FFFFFF", border: dark ? "none" : "2px solid #E5E5E5", borderRadius: 999, padding: `${size * 0.45}px ${size * 0.5}px ${size * 0.45}px ${size * 0.8}px`, boxShadow: dark ? "none" : "0 6px 20px rgba(0,0,0,0.06)" }}>
    <div style={{ ...type(size * 1.15, 300, dark ? "#B4B4B4" : "#8E8E8E", 0), lineHeight: 1 }}>+</div>
    <div style={{ ...type(size, 400, dark ? "#B4B4B4" : "#8E8E8E", -0.005), flex: 1 }}>Frag alles</div>
    <div style={{ width: size * 1.45, height: size * 1.45, borderRadius: size, background: dark ? "#FFFFFF" : G_INK, display: "grid", placeItems: "center" }}>
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 20 20"><path d="M10 16 V4 M4.5 9.5 L10 4 L15.5 9.5" stroke={dark ? G_INK : "#fff"} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  </div>
);

// ChatGPT app conversation inside the iPhone: user bubble right (light grey), answer streams in on the left.
const ChatUI: React.FC<{ ask: string; answer: string; askAt: number; start: number; end: number }> = ({ ask, answer, askAt, start, end }) => {
  const { t } = useSec();
  const ap = prog(t, askAt, askAt + 0.35, out);
  return (
    <div style={{ position: "relative", height: "100%", padding: "92px 28px 0", boxSizing: "border-box", fontFamily: FONT }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
        <div style={type(34, 600, G_INK, -0.015)}>ChatGPT</div>
        <svg width={18} height={18} viewBox="0 0 20 20"><path d="M5 8 L10 13 L15 8" stroke="#8E8E8E" strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 46, opacity: ap, transform: `translateY(${(1 - ap) * 20}px)` }}>
        <div style={{ maxWidth: 360, background: G_BG, borderRadius: 30, padding: "18px 24px", ...type(31, 400, G_INK, -0.01), lineHeight: 1.3 }}>{ask}</div>
      </div>
      <div style={{ marginTop: 34 }}>
        <div style={{ ...type(22, 600, GREEN, 0.02), marginBottom: 10, opacity: prog(t, start - 0.1, start + 0.2) }}>Italienisch</div>
        <Stream text={answer} start={start} end={end} dot={24} style={{ ...type(37, 500, G_INK, -0.012), lineHeight: 1.3 }} />
      </div>
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 330 }}><Composer size={28} /></div>
    </div>
  );
};

const PhoneScene: React.FC<{ w: Win; start: number }> = ({ w, start }) => {
  const { t } = useSec();
  const k = prog(t, start - 0.1, w.to, Easing.linear);
  const enter = prog(t, start - 0.1, start + 0.6, out);
  const ry = -22 + 15 * k;
  const float = Math.sin(t * 1.6) * 8;
  return (
    <AbsoluteFill style={{ background: G_BG }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, perspective: 1800, display: "flex", justifyContent: "center" }}>
        <div style={{ marginTop: 60 + (1 - enter) * 200 + float, transform: `rotateY(${ry}deg) rotateX(${7 - 3 * k}deg) rotateZ(${-3 + 2 * k}deg) scale(${1.0 + 0.03 * k})`, transformOrigin: "50% 30%", opacity: enter }}>
          <IPhone>
            <ChatUI ask="Übersetz für den Kellner: Für alle vier Spritz und die Burrata." answer="Per tutti quattro Spritz e la burrata, per favore." askAt={start + 0.25} start={start + 0.85} end={start + 2.1} />
          </IPhone>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ChatGPT voice mode: soft gradient orb on black that breathes with the voice and pulses much stronger on "lauter".
const VoiceScene: React.FC<{ w: Win; lauter: number; cut: number; words: { w: string; at: number }[] }> = ({ w, lauter, cut, words }) => {
  const { t } = useSec();
  const loud = prog(t, lauter - 0.05, lauter + 0.25, out);
  const talk = prog(t, w.from + 0.2, w.from + 0.6);
  const lvl = talk * (0.5 + 0.5 * Math.abs(Math.sin(t * 7.3) * Math.cos(t * 3.1)));
  const pulse = 1 + 0.05 * lvl + loud * (0.16 + 0.12 * Math.abs(Math.sin(t * 9)));
  const rot = t * 40;
  const o = 1 - prog(t, cut - 0.15, cut + 0.1);
  const R = 170;
  return (
    <AbsoluteFill style={{ background: "#000", opacity: o }}>
      <div style={{ position: "absolute", left: 80, top: 60, display: "flex", alignItems: "center", gap: 12, opacity: prog(t, w.from + 0.1, w.from + 0.4) }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: GREEN, opacity: 0.6 + 0.4 * Math.abs(Math.sin(t * 4)) }} />
        <div style={type(30, 500, "#B4B4B4", 0)}>ChatGPT · Sprachmodus</div>
      </div>
      <div style={{ position: "absolute", left: 540 - R, top: 330 - R, width: 2 * R, height: 2 * R, transform: `scale(${pulse})` }}>
        <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: "radial-gradient(circle, rgba(170,205,255,0.25) 0%, rgba(0,0,0,0) 65%)", transform: `scale(${1 + 0.25 * loud})` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #DCEBFF 30%, #8FB8F2 62%, #4F7FD0 100%)" }}>
          <div style={{ position: "absolute", inset: "-30%", background: "conic-gradient(from 0deg, rgba(255,255,255,0.0), rgba(255,255,255,0.55), rgba(180,210,255,0.0), rgba(255,255,255,0.4), rgba(255,255,255,0.0))", transform: `rotate(${rot}deg)`, filter: "blur(18px)" }} />
          <div style={{ position: "absolute", left: "10%", top: "55%", width: "90%", height: "60%", borderRadius: "50%", background: "rgba(255,255,255,0.45)", filter: "blur(22px)", transform: `translateX(${Math.sin(t * 2.2) * 30}px)` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 600, display: "flex", justifyContent: "center", gap: 18 }}>
        {words.map((x, i) => {
          const p = prog(t, x.at - 0.05, x.at + 0.3, out);
          return <span key={i} style={{ ...type(60, 500, "#FFFFFF", -0.015), opacity: p, filter: `blur(${(1 - p) * 8}px)` }}>{x.w}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ChatGPT answer on white after the voice input: it translates anyway.
const AnswerScene: React.FC<{ start: number }> = ({ start }) => {
  const { t } = useSec();
  const p = prog(t, start - 0.12, start - 0.04); // near-hard cut to white, no ghosting
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", opacity: p }}>
      <div style={{ position: "absolute", left: 90, right: 90, top: 90 }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ background: G_BG, borderRadius: 34, padding: "20px 30px", ...type(40, 400, G_INK, -0.01) }}>FOUR SPRITZ. PLEASE.</div>
        </div>
        <div style={{ ...type(26, 600, GREEN, 0.02), marginTop: 46, marginBottom: 14, opacity: prog(t, start + 0.2, start + 0.4) }}>Italienisch</div>
        <Stream text="Quattro Spritz, per favore." start={start + 0.3} end={start + 1.0} dot={30} style={{ ...type(70, 500, G_INK, -0.02), lineHeight: 1.15 }} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 600 }}><Composer size={34} /></div>
    </AbsoluteFill>
  );
};

const Captions: React.FC<{ words: Word[]; split: number; capY: number; dark: boolean }> = ({ words, split, capY, dark }) => {
  const { t } = useSec();
  const ms = t * 1000;
  const cur = words.find((w, i) => ms >= w.startMs && ms < (words[i + 1]?.startMs ?? w.endMs + 400));
  if (!cur) return null;
  const inPanel = split > 0.5;
  const size = 56;
  // split: centred on the seam (y = PH); fullscreen: chest/shoulder height (capY).
  const top = inPanel ? PH - size * 0.6 : capY;
  const ink = inPanel && !dark;
  return (
    <div style={{ position: "absolute", top, width: 1080, textAlign: "center", ...type(size, 600, ink ? INK : "#FFFFFF", -0.015),
      textShadow: ink ? "0 0 14px rgba(255,255,255,0.95), 0 0 4px rgba(255,255,255,0.9)" : "0 2px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.35)",
      opacity: split > 0.05 && split < 0.95 ? 0 : 1 }}>{cur.text}</div>
  );
};

export const SatireAustralienV6: React.FC<SatireAustralienV6Props> = ({ src, seconds, words, c, fr, capY }) => {
  useLocalFonts();
  const { t } = useSec();

  const S1: Win = { from: -1, to: c.verlernt + 0.5 }; // hook B-Roll from frame 0
  const S2: Win = { from: c.wie - 0.3, to: c.Englisch + 0.55 }; // chat beat -> fork on "Gabel" -> order scene on "bestellt"
  const S34: Win = { from: c.Apulien - 0.15, to: c.Handy + 2.95 }; // map zoom, then cut to the phone on "Handy"
  const S5: Win = { from: c.diktiert - 0.5, to: c.trotzdem + 0.6 }; // voice orb, then cut to the streamed answer on "Handy"
  const wins = [S1, S2, S34, S5];
  const split = Math.max(...wins.map((w) => envelope(t, w)));
  const dark = (t >= S1.from && t <= S1.to) || (t >= S5.from && t < c.Handy2 - 0.05);

  // camera: slow drift, a soft push-in after every return from a B-Roll, one eased punch-in before the punchline
  const lastEnd = Math.max(0, ...wins.filter((w) => w.to <= t).map((w) => w.to));
  const push = lastEnd > 0 ? 1 + 0.045 * prog(t, lastEnd, lastEnd + 0.9, io) : 1;
  const punch = 1 + 0.07 * prog(t, c.hatte - 0.1, c.hatte + 0.3, out);
  const beats = [c.Dafuer - 0.05];
  const step = beats.reduce((m, b) => m * (1 + 0.035 * prog(t, b, b + 0.3, out)), 1);
  const z = (1 + 0.02 * (t / seconds)) * push * step * punch;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${(1 - split) * fr.ax * (1 - z) + split * fr.tx}px, ${(1 - split) * fr.ay * (1 - z) + split * fr.ty}px) scale(${(1 - split) * z + split * fr.s})`, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      <Panel w={S1} bg="#000"><HookScene end={S1.to} verlernt={c.verlernt} /></Panel>
      <Panel w={S2} bg="#fff">
        {t >= c.Gabel - 0.3 && <ForkScene w={{ from: c.Gabel - 0.3, to: c.bestellt }} at={c.Gabel - 0.05} />}
        {t >= c.bestellt - 0.05 && <OrderScene start={c.bestellt - 0.05} bubble={c.selbstverstaendlich - 0.1} chip={c.Englisch - 0.05} />}
        <AskScene ask={c.wie - 0.05} think={c.Bei - 0.1} ans={c.Bei} cut={c.Gabel - 0.25} />
      </Panel>
      <Panel w={S34} bg={LIGHT}>
        <MapScene w={S34} cut={c.Handy - 0.05} />
        {t >= c.Handy - 0.05 && <PhoneScene w={S34} start={c.Handy - 0.05} />}
      </Panel>
      <Panel w={S5} bg="#000">
        <VoiceScene w={S5} lauter={c.lauter} cut={c.Handy2 - 0.05} words={[{ w: "Four", at: c.Bestellung }, { w: "Spritz,", at: c.Bestellung + 0.25 }, { w: "please.", at: c.Bestellung + 0.5 }]} />
        {t >= c.Handy2 - 0.25 && <AnswerScene start={c.Handy2 - 0.05} />}
      </Panel>

      <Captions words={words} split={split} capY={capY} dark={dark} />
    </AbsoluteFill>
  );
};
