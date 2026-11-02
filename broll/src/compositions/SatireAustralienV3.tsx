import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, OffthreadVideo, staticFile } from "remotion";
import { useSec, Word } from "../components/SatireKit";
import { AUSTRALIA, EUROPE, GERMANY, ITALY, WORLD } from "./geo-australien";

// GPT-S @florentgpt "Wie heißt das auf Deutsch" (Australien) v3, 2026-10-12.
// Henri on v2: "mega scheiße" (stamps, grid, condensed+serif, overlay cards). v3 = clean Apple keynote / product-film look:
// neutral palette (white, black, greys, one subtle blue), one clean sans (Inter variable, display optical size, bundled
// locally), real animated B-Roll scenes filling the split panel (world map flight line, drawn fork hero shot, map zoom
// onto Apulia, 3D iPhone with translate UI, voice-memo waveform). Only two big type moments ("365 Tage", "Gabel.").
// No cards over the avatar, no stamps, no counters, no photos. Punchline stays on the speaker, calm.
export type Framing = { ax: number; ay: number; s: number; tx: number; ty: number };
export type SatireAustralienV3Props = { src: string; seconds: number; words: Word[]; c: Record<string, number>; fr: Framing; capY: number };

const FONT = "GPTS Inter";
const INK = "#1D1D1F";
const GREY = "#86868B";
const LIGHT = "#F5F5F7";
const BLUE = "#0071E3";

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
  const o = 1 - prog(t, cut - 0.12, cut + 0.12);
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
const TranslateUI: React.FC<{ src: string; dst: string; start: number; end: number }> = ({ src, dst, start, end }) => (
  <div style={{ padding: "96px 30px 0", fontFamily: FONT }}>
    <div style={type(50, 700, INK, -0.02)}>Übersetzen</div>
    <div style={{ marginTop: 22, background: LIGHT, borderRadius: 24, padding: "20px 22px" }}>
      <div style={type(25, 600, GREY, 0)}>Deutsch</div>
      <div style={{ ...type(34, 500, INK, -0.01), lineHeight: 1.25, marginTop: 8 }}>{src}</div>
    </div>
    <div style={{ marginTop: 14, background: LIGHT, borderRadius: 24, padding: "20px 22px", minHeight: 170 }}>
      <div style={type(25, 600, BLUE, 0)}>Italienisch</div>
      <Typed text={dst} start={start} end={end} style={{ ...type(39, 600, INK, -0.015), lineHeight: 1.22, marginTop: 8 }} />
    </div>
  </div>
);
const PhoneScene: React.FC<{ w: Win; start: number }> = ({ w, start }) => {
  const { t } = useSec();
  const k = prog(t, start - 0.1, w.to, Easing.linear);
  const enter = prog(t, start - 0.1, start + 0.6, out);
  const ry = -24 + 16 * k;
  const float = Math.sin(t * 1.6) * 8;
  return (
    <AbsoluteFill style={{ background: LIGHT, opacity: prog(t, start - 0.15, start + 0.1) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, perspective: 1800, display: "flex", justifyContent: "center" }}>
        <div style={{ marginTop: 60 + (1 - enter) * 200 + float, transform: `rotateY(${ry}deg) rotateX(${7 - 3 * k}deg) rotateZ(${-3 + 2 * k}deg) scale(${1.0 + 0.03 * k})`, transformOrigin: "50% 30%", opacity: enter }}>
          <IPhone>
            <TranslateUI src="Für alle bitte vier Spritz und die Burrata." dst="Per tutti quattro Spritz e la burrata, per favore." start={start + 0.5} end={start + 2.0} />
          </IPhone>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 5: voice memo, full waveform, "lauter" ----------
const VoiceScene: React.FC<{ w: Win; lauter: number; words: { w: string; at: number }[] }> = ({ w, lauter, words }) => {
  const { t } = useSec();
  const loud = prog(t, lauter - 0.05, lauter + 0.3, out);
  const N = 70;
  const scroll = (t - w.from) * 160;
  const bars = Array.from({ length: N }).map((_, i) => {
    const x = 60 + i * 14.2 - (scroll % 14.2);
    const seed = Math.floor(i + scroll / 14.2);
    const base = 0.25 + 0.75 * Math.abs(Math.sin(seed * 1.91) * Math.cos(seed * 0.37));
    const right = x > 560;
    const amp = right ? 0.08 : base * (0.45 + 0.55 * loud) * (t - w.from > 0.3 ? 1 : (t - w.from) / 0.3);
    return { x, h: Math.max(6, amp * 300), right };
  });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: 80, top: 64 }}>
        <Reveal at={w.from + 0.1} dur={0.45}>
          <div style={type(44, 600, "#FFFFFF", -0.02)}>Bestellung</div>
          <div style={type(26, 400, GREY, 0)}>Sprachmemo · Apulien</div>
        </Reveal>
      </div>
      <svg width={1080} height={PH} style={{ position: "absolute" }}>
        {bars.map((b, i) => <rect key={i} x={b.x} y={390 - b.h / 2} width={7} height={b.h} rx={3.5} fill={b.right ? "#3A3A3C" : "#F5F5F7"} />)}
        <rect x={562} y={210} width={3} height={360} rx={1.5} fill={BLUE} />
        <circle cx={563.5} cy={210} r={9} fill={BLUE} />
      </svg>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 620, display: "flex", justifyContent: "center", gap: 16 }}>
        {words.map((x, i) => {
          const p = prog(t, x.at - 0.05, x.at + 0.3, out);
          return <span key={i} style={{ ...type(50, 500, "#FFFFFF", -0.015), opacity: p, filter: `blur(${(1 - p) * 8}px)` }}>{x.w}</span>;
        })}
      </div>
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

export const SatireAustralienV3: React.FC<SatireAustralienV3Props> = ({ src, seconds, words, c, fr, capY }) => {
  useLocalFonts();
  const { t } = useSec();

  const S1: Win = { from: c.seitdem - 0.15, to: c.verlernt + 0.5 };
  const S2: Win = { from: c.Gabel - 0.45, to: c.Gabel + 1.95 };
  const S34: Win = { from: c.Apulien - 0.15, to: c.Handy + 2.95 }; // map zoom, then cut to the phone on "Handy"
  const S5: Win = { from: c.diktiert - 0.5, to: c.Englisch2 + 0.6 };
  const wins = [S1, S2, S34, S5];
  const split = Math.max(...wins.map((w) => envelope(t, w)));
  const dark = (t >= S1.from && t <= S1.to) || (t >= S5.from && t <= S5.to);

  // camera: slow drift, a soft push-in after every return from a B-Roll, one eased punch-in before the punchline
  const lastEnd = Math.max(0, ...wins.filter((w) => w.to <= t).map((w) => w.to));
  const push = lastEnd > 0 ? 1 + 0.045 * prog(t, lastEnd, lastEnd + 0.9, io) : 1;
  const punch = 1 + 0.07 * prog(t, c.hatte - 0.1, c.hatte + 0.3, out);
  const z = (1 + 0.02 * (t / seconds)) * push * punch;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${(1 - split) * fr.ax * (1 - z) + split * fr.tx}px, ${(1 - split) * fr.ay * (1 - z) + split * fr.ty}px) scale(${(1 - split) * z + split * fr.s})`, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail, fully visible on frame 0 */}
      {t < S1.from + 0.25 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 170, textAlign: "center", opacity: 1 - prog(t, S1.from - 0.1, S1.from + 0.2) }}>
          <div style={type(96, 600, INK, -0.03)}>Ein Jahr Australien.</div>
          <div style={{ ...type(62, 400, "#515154", -0.02), marginTop: 14 }}>Und dann kam das Handy.</div>
        </div>
      )}

      <Panel w={S1} bg="#000"><WorldScene w={S1} textAt={S1.from + 0.85} /></Panel>
      <Panel w={S2} bg="#fff"><ForkScene w={S2} at={c.Gabel - 0.05} /></Panel>
      <Panel w={S34} bg={LIGHT}>
        <MapScene w={S34} cut={c.Handy - 0.05} />
        {t >= c.Handy - 0.25 && <PhoneScene w={S34} start={c.Handy - 0.05} />}
      </Panel>
      <Panel w={S5} bg="#000">
        <VoiceScene w={S5} lauter={c.lauter} words={[{ w: "Four", at: c.Bestellung }, { w: "Spritz,", at: c.Bestellung + 0.25 }, { w: "please.", at: c.Bestellung + 0.5 }]} />
      </Panel>

      <Captions words={words} split={split} capY={capY} dark={dark} />
    </AbsoluteFill>
  );
};
