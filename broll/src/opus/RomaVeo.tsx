import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import { deep, tilt3d } from "./GMapsKit";
import { PK, paperShadow, Stage, Paper, InkStamp, Brush, Highlight, Glass, Bokeh, Sheen, Grade } from "./PremiumKit";
import captions from "../../runs/roma-veo/captions.json";

// ROMA Veo-Look (2026-10-28): Enkel-Skript, Oma aus Veo 3.1 (ElevenLabs) freigestellt unten vor Fullscreen-Animation.
// Kopie von RomaEnkelOpus; Szenen gleich, Layout ohne Split-Naht, jedes Schlagwort poppt auf dem gesprochenen Wort.
// FP-N-Opus-Schnitt (Gerüst wie KlageOpus, PremiumKit-Bühne), nur Oma-Thema. Modelle, Preise und Haken sind erfunden.

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 1000;
// Szenen sind für 820 px gebaut: im großen Panel leicht vergrößert und vertikal zentriert (mehr Animation, weniger Oma).
const SC = 1.06, OFF = Math.round((PH - 820 * SC) / 2);

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const RV_END = LAST_END + 0.7;
export const RV_FRAMES = Math.round(RV_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  wm0: at("waschmaschine", 0), ausgesucht: at("finde"), sprachlos: at("sprachlos"),
  er: at("er", 0), oma0: at("oma", 0), schreib: at("schreib"), brauchst: at("brauchst"),
  ich0: at("also"), claude0: at("claude", 0), geschrieben: at("geschrieben", 0), fuenfundsiebzig: at("fünfundsiebzig"), wasche: at("wasche"), zweimal: at("zweimal"), leise: at("leise"),
  dann0: at("dann", 0), knopf: at("knopf"), recherche: at("recherche"), einmal: at("einmal"), druecken: at("drücken"),
  und1: at("und", 3), claude1: at("claude", 1), liest: at("liest"), testberichte: at("testberichte"), rueckrufe: at("rückrufe"), kundenbewertungen: at("kundenbewertungen"), minuten: at("minuten"),
  am: at("am"), modelle: at("modelle"), preis: at("preis"), strom: at("stromverbrauch"), haken: at("haken"), quellen: at("quellen"),
  frueher: at("euer"), nachmittage: at("nachmittage"), elektromarkt: at("elektromarkt"), opa: at("opa"), falsche: at("falsche"),
  euch0: at("mein", 1), saetze: at("befehle"), seite: at("zettel"), zusammen: at("geschrieben", 1),
  wenn: at("wenn"), foto: at("fotografieren"), schicken: at("zuschicken"), komm: at("kommentiert"), trigger: at("waschmaschine", 1),
};

const C = {
  bg: "#F3EFE6", ink: "#151515", line: "#E7E4DD", card: "#FFFFFF",
  orange: "#D97757", orangeSoft: "#F8E1D7", green: "#1E9E57", greenSoft: "#E6F5EC", red: "#E5484D", redSoft: "#FDE8E8",
  chip: "#141414", blue: "#2C84DB", blueSoft: "#E3F0FC",
};
const MONO = "JetBrains Mono";
const SERIF = "Newsreader";
const HAND = "Caveat";
const shadow = "0 22px 48px rgba(20,20,20,0.10), 0 3px 8px rgba(20,20,20,0.06)";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, a: number, d = 0.3, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const pop = (t: number, a: number, d = 0.38) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
const popStyle = (t: number, a: number, rise = 18, from = 0.7): React.CSSProperties => {
  const p = pop(t, a);
  return { opacity: k(t, a, 0.14), transform: `translateY(${(1 - Math.min(p, 1)) * rise}px) scale(${from + (1 - from) * p})` };
};
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(interpolate(t, [a, b], [0, s.length], clamp)));
const shakeAt = (t: number, a: number, amp = 5) => { const r = t - a; return r > 0.03 && r < 0.4 ? Math.sin(r * 90) * amp * (1 - r / 0.4) : 0; };

const SENT = [0, ...CAPS.flatMap((c, i) => (i > 0 && /[.!?:]$/.test(CAPS[i - 1].text) ? [c.startMs / 1000] : []))];
const camera = (t: number, from: number, to: number) => {
  const s = SENT.filter((x) => x >= from && x < to);
  if (!s.length) s.push(from);
  const amt = Math.min(0.03, 0.075 / s.length);
  let sc = 1;
  s.forEach((a, i) => {
    const b = i + 1 < s.length ? s[i + 1] : to;
    sc += amt * interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  });
  return sc;
};

// ---------- building blocks ----------
const LabelChip: React.FC<{ text: string; dot?: string; style?: React.CSSProperties; size?: number }> = ({ text, dot = C.orange, style, size = 28 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.chip, color: "#FFF", fontFamily: fonts.semibold, fontSize: size, padding: `${size * 0.36}px ${size * 0.8}px ${size * 0.36}px ${size * 0.6}px`, borderRadius: 999, boxShadow: "0 10px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap", ...style }}>
    <span style={{ width: size * 0.48, height: size * 0.48, borderRadius: "50%", background: dot }} />
    {text}
  </div>
);
const Tag: React.FC<{ text: string; color: string; size?: number; style?: React.CSSProperties }> = ({ text, color, size = 18, style }) => (
  <span style={{ display: "inline-block", fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color: "#FFF", background: color, padding: `${size * 0.33}px ${size * 0.55}px ${size * 0.33}px ${size * 0.66}px`, borderRadius: 8, whiteSpace: "nowrap", ...style }}>{text}</span>
);
const ClaudeMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={SIMPLE_ICONS.claude.d} fill={SIMPLE_ICONS.claude.hex} /></svg>
);
const Check: React.FC<{ size: number; color?: string; p?: number }> = ({ size, color = "#FFF", p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - p)} /></svg>
);
const CheckDot: React.FC<{ size?: number; color?: string; p?: number }> = ({ size = 30, color = C.green, p = 1 }) => (
  <span style={{ width: size, height: size, borderRadius: "50%", background: color, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={size * 0.62} p={p} /></span>
);
const MonoLabel: React.FC<{ text: string; size?: number; color?: string; style?: React.CSSProperties }> = ({ text, size = 18, color = PK.sub, style }) => (
  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color, whiteSpace: "nowrap", ...style }}>{text}</div>
);

// ---------- claude.ai pieces (recreated light UI, real English labels) ----------
const CL = { page: "#FAF9F5", border: "#E3DFD5", text: "#1F1E1D", sub: "#77746C", send: "#C96442", bubble: "#F0EEE6", hover: "#F2EFE8" };
type PP = { x: number; y: number; at: number; click?: boolean };
const Pointer: React.FC<{ t: number; path: PP[]; size?: number; label?: string }> = ({ t, path, size = 50, label }) => {
  if (t < path[0].at - 0.25) return null;
  let x = path[0].x, y = path[0].y;
  for (let j = 1; j < path.length; j++) {
    const mv = Math.min(0.45, (path[j].at - path[j - 1].at) * 0.85);
    const q = interpolate(t, [path[j].at - mv, path[j].at - 0.03], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    if (q <= 0) break;
    x = path[j - 1].x + (path[j].x - path[j - 1].x) * q;
    y = path[j - 1].y + (path[j].y - path[j - 1].y) * q - Math.sin(q * Math.PI) * 26;
  }
  const hit = path.reduce((acc, p) => (p.click && t >= p.at && t - p.at < 0.45 ? p : acc), null as null | PP);
  const r = hit ? (t - hit.at) / 0.45 : 1;
  const dip = hit && r < 0.25 ? 0.84 : 1;
  const s = size / 36;
  return (
    <>
      {hit ? <div style={{ position: "absolute", left: hit.x - 34 * (0.3 + r), top: hit.y - 34 * (0.3 + r), width: 68 * (0.3 + r), height: 68 * (0.3 + r), borderRadius: "50%", border: `4px solid ${C.orange}`, background: "rgba(217,119,87,0.12)", opacity: 1 - r, zIndex: 60 }} /> : null}
      <svg width={28 * s} height={36 * s} viewBox="0 0 28 36" style={{ position: "absolute", left: x - 3 * s, top: y - 2 * s, zIndex: 61, opacity: k(t, path[0].at - 0.25, 0.15), transform: `scale(${dip})`, transformOrigin: "10% 5%", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))", overflow: "visible" }}>
        <path d="M3 2 L3 29 L10 22.5 L14.6 33 L19.2 31 L14.8 20.8 L24 20.8 Z" fill="#FFF" stroke="#111" strokeWidth={2} strokeLinejoin="round" />
      </svg>
      {label ? <div style={{ position: "absolute", left: x + 22 * s, top: y + 30 * s, zIndex: 61, opacity: k(t, path[0].at - 0.25, 0.15), background: C.blue, color: "#FFF", fontFamily: fonts.semibold, fontSize: 24, padding: "5px 14px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 6px 14px rgba(0,0,0,0.2)" }}>{label}</div> : null}
    </>
  );
};
const Ico: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 26, color = CL.text, sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const I = {
  plus: "M12 5v14M5 12h14",
  up: "M12 19V6M6 11.5L12 5.5l6 6",
  chev: "M6 9l6 6 6-6",
  doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  scope: "M11 18a7 7 0 100-14 7 7 0 000 14zM16 16l5 5",
  sliders: "M4 7h10M18 7h2M4 17h4M12 17h8M16 4.5v5M10 14.5v5",
  phone: "M8 2.5h8a1.5 1.5 0 011.5 1.5v16a1.5 1.5 0 01-1.5 1.5H8A1.5 1.5 0 016.5 20V4A1.5 1.5 0 018 2.5zM11 18.5h2",
  tv: "M3 5h18v12H3zM8 21h8M12 17v4",
  plane: "M10.5 13.5L3 11l1.5-1.5 7 1L16 6a1.8 1.8 0 012.5 2.5L14 13l1 7-1.5 1.5L11 14z",
  cam: "M4 8h3l2-2.5h6L17 8h3v11H4zM12 16.5a3.3 3.3 0 100-6.6 3.3 3.3 0 000 6.6z",
  send: "M4 12l16-8-6 16-2.5-6.5z",
};
const SendBtn: React.FC<{ size?: number; on?: boolean }> = ({ size = 52, on = true }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: CL.send, opacity: on ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico d={I.up} size={size * 0.56} color="#FFF" sw={2.4} /></div>
);
// claude.ai composer: "+", tools, Research toggle bottom left, model picker + send bottom right
const Composer: React.FC<{ w: number; h: number; text: string; caret?: boolean; research?: number; resHover?: boolean; sendOn?: boolean; fs?: number; style?: React.CSSProperties }> = ({ w, h, text, caret, research = 0, resHover, sendOn, fs = 28, style }) => (
  <div style={{ position: "absolute", width: w, height: h, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 26, boxShadow: "0 14px 34px rgba(20,20,20,0.07)", boxSizing: "border-box", padding: "20px 22px 18px 26px", display: "flex", flexDirection: "column", ...style }}>
    <div style={{ fontFamily: fonts.medium, fontSize: fs, color: text ? CL.text : CL.sub, lineHeight: 1.32, flex: 1 }}>
      {text || "Wie kann ich dir heute helfen?"}
      {caret ? <span style={{ display: "inline-block", width: 3, height: fs * 1.05, background: C.orange, marginLeft: 3, verticalAlign: "middle" }} /> : null}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, border: `1.5px solid ${CL.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I.plus} size={26} /></div>
      <div style={{ width: 48, height: 48, borderRadius: 14, border: `1.5px solid ${CL.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I.sliders} size={24} /></div>
      <div style={{ height: 48, borderRadius: 14, padding: "0 16px 0 12px", display: "flex", alignItems: "center", gap: 8, border: `1.5px solid ${research > 0.5 ? "#B7D6F4" : CL.border}`, background: research > 0.5 ? C.blueSoft : resHover ? CL.hover : "#FFF", transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, research) * Math.PI)})` }}>
        <Ico d={I.scope} size={24} color={research > 0.5 ? C.blue : CL.text} />
        <span style={{ fontFamily: fonts.semibold, fontSize: 21, color: research > 0.5 ? C.blue : CL.text }}>Research</span>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontFamily: fonts.medium, fontSize: 22, color: CL.sub }}>Opus 5.5 <Ico d={I.chev} size={18} color={CL.sub} /></div>
      <SendBtn on={sendOn} />
    </div>
  </div>
);
const ClaudeWin: React.FC<{ title: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ title, style, children }) => (
  <div style={{ position: "absolute", background: CL.page, borderRadius: 22, boxShadow: shadow, overflow: "hidden", border: `1px solid ${CL.border}`, ...style }}>
    <div style={{ height: 58, display: "flex", alignItems: "center", gap: 12, padding: "0 22px", borderBottom: `1px solid ${CL.border}`, background: "#FFF" }}>
      <ClaudeMark size={28} />
      <span style={{ fontFamily: fonts.semibold, fontSize: 23, color: CL.text, whiteSpace: "nowrap" }}>{title}</span>
      <Ico d={I.chev} size={18} color={CL.sub} />
      <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 15, letterSpacing: "0.1em", color: CL.sub }}>CLAUDE.AI</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 58, bottom: 0 }}>{children}</div>
  </div>
);

// 2.5D washing machine (front loader): body gradient, control strip, glass door with drum
const Washer: React.FC<{ size: number; t: number; spin?: number; tint?: string; style?: React.CSSProperties }> = ({ size, t, spin = 0, tint = "#FFFFFF", style }) => {
  const s = size / 200;
  return (
    <div style={{ position: "absolute", width: size, height: size * 1.12, ...style }}>
      <div style={{ position: "absolute", left: "6%", right: "-4%", bottom: -size * 0.04, height: size * 0.1, borderRadius: "50%", background: "rgba(70,40,15,0.30)", filter: `blur(${size * 0.04}px)` }} />
      <div style={{ position: "absolute", left: 8 * s, top: -6 * s, width: size, height: size * 1.12, borderRadius: 18 * s, background: "#CFC4B4" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 18 * s, background: `linear-gradient(160deg, ${tint} 0%, #F1ECE4 60%, #E2DBCF 100%)`, boxShadow: "inset 0 2px 0 rgba(255,255,255,0.9)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40 * s, borderBottom: "1.5px solid rgba(120,90,60,0.18)", display: "flex", alignItems: "center", padding: `0 ${14 * s}px`, gap: 8 * s }}>
          <div style={{ width: 54 * s, height: 16 * s, borderRadius: 4 * s, background: "#2A2724" }} />
          <div style={{ marginLeft: "auto", width: 24 * s, height: 24 * s, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FFF, #BDB4A6)", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
        </div>
        <div style={{ position: "absolute", left: "50%", top: 128 * s, width: 140 * s, height: 140 * s, marginLeft: -70 * s, marginTop: -70 * s, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #F7F4EF, #C9C1B3)", boxShadow: "0 4px 10px rgba(0,0,0,0.18)" }} />
        <div style={{ position: "absolute", left: "50%", top: 128 * s, width: 108 * s, height: 108 * s, marginLeft: -54 * s, marginTop: -54 * s, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #9FB4C6 0%, #4D6275 55%, #2B3946 100%)", overflow: "hidden", transform: `rotate(${spin * 360 + t * 40}deg)` }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 70 * s, height: 10 * s, marginLeft: -35 * s, marginTop: -5 * s, borderRadius: 5 * s, background: "rgba(255,255,255,0.22)", transform: `rotate(${i * 60}deg)` }} />)}
          <div style={{ position: "absolute", left: "14%", top: "10%", width: "40%", height: "26%", borderRadius: "50%", background: "rgba(255,255,255,0.45)", filter: "blur(2px)", transform: "rotate(-30deg)" }} />
        </div>
      </div>
    </div>
  );
};

// ---------- hook pills (frame 0 = thumbnail): "Kaufberatung in 5 Minuten" / "Claude recherchiert" ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const m = k(t, 1.15, 0.35, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 56, padding: "8px 24px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow }}>So zeigt mir mein <span style={{ color: C.orange }}>Enkel</span>,</div>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow, marginTop: -6 }}>wie ich mit Claude die beste</div>
      <div style={{ ...pill, marginTop: -6 }}>
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -8, right: -8, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${t < 0.04 ? 1 : m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>Waschmaschine</span>
        </span>{" "}finde
      </div>
    </div>
  );
};

// ---------- split hook: search file on the desk, three washers, Claude researching, one gets stamped ----------
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const thumb = t < 0.04;
  const on = (a: number) => thumb || t > a;
  const ps = (a: number, rise = 20, from = 0.8) => (thumb ? {} : popStyle(t, a, rise, from));
  const chosen = on(A.ausgesucht - 0.05);
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 290, transform: `perspective(1800px) rotateX(10deg) rotateY(14deg) rotate(${-5 + Math.sin(t * 0.7) * 0.5}deg)`, ...ps(0.05, 30, 0.9) }}>
        <Paper sheen={thumb ? 0 : k(t, 0.3, 1.1, Easing.inOut(Easing.cubic))} style={{ position: "relative", width: 400, height: 500 }}>
          <div style={{ padding: "28px 30px" }}>
            <MonoLabel text="SUCHAUFTRAG" />
            <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 46, color: PK.ink, marginTop: 10 }}>Waschmaschine</div>
            <div style={{ fontFamily: HAND, fontSize: 34, color: "#2B4C8C", marginTop: 14, lineHeight: 1.2 }}>
              <div>· leise</div>
              <div>· 2× die Woche</div>
              <div>· für Oma, 75</div>
            </div>
          </div>
          {!thumb && t > A.sprachlos - 0.1 ? <InkStamp id="stSprach" text="SPRACHLOS" p={k(t, A.sprachlos - 0.1, 0.16)} color={PK.orangeDeep} size={30} rot={-9} style={{ left: 40, top: 380 }} /> : null}
        </Paper>
      </div>
      {[0, 1, 2].map((i) => {
        const x = 520 + i * 180, y = 300 + (i === 1 ? -20 : 20);
        const win = i === 1;
        const fade = chosen && !win ? 0.45 : 1;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: fade, transform: `translateY(${Math.sin(t * 1.3 + i) * 4}px) scale(${win && chosen && !thumb ? 1 + 0.1 * k(t, A.ausgesucht - 0.05, 0.3) : 1})`, transformOrigin: "50% 100%", ...ps(0.15 + i * 0.1, 30, 0.6) }}>
            <Washer size={160} t={t} spin={i * 0.3} />
            <div style={{ position: "absolute", left: 0, top: 192, width: 168, textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 18, letterSpacing: "0.1em", color: PK.sub }}>MODELL {"ABC"[i]}</div>
          </div>
        );
      })}
      {chosen ? <InkStamp id="stPick" text="AUSGESUCHT" p={thumb ? 1 : k(t, A.ausgesucht - 0.05, 0.16)} color={PK.green} size={30} rot={-10} style={{ left: 640, top: 360 }} /> : null}
      <Glass style={{ left: 520, top: 610, height: 82, padding: "0 24px 0 14px", display: "flex", alignItems: "center", gap: 12, ...ps(0.35, 14, 0.7) }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(217,119,87,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}><ClaudeMark size={32} /></div>
        <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: PK.ink, whiteSpace: "nowrap" }}>{chosen ? "3 Modelle geprüft" : "recherchiert …"}</span>
        {chosen ? <CheckDot size={34} p={thumb ? 1 : k(t, A.ausgesucht, 0.3)} /> : null}
      </Glass>
    </>
  );
};

// ---------- Enkel chat: his tip arrives as a message ----------
const EnkelBubble: React.FC<{ t: number; at: number; text: string; size?: number; typed?: [number, number] }> = ({ t, at, text, size = 38, typed: ty }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 14, ...popStyle(t, at, 16, 0.7) }}>
    <div style={{ width: size * 1.7, height: size * 1.7, borderRadius: "50%", background: `linear-gradient(150deg, ${C.blue}, #1B5FA8)`, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: size * 0.8, flexShrink: 0, boxShadow: "0 8px 18px rgba(27,95,168,0.35)" }}>E</div>
    <div style={{ background: "#FFF", borderRadius: `${size * 0.7}px ${size * 0.7}px ${size * 0.7}px 6px`, padding: `${size * 0.42}px ${size * 0.62}px`, boxShadow: shadow, maxWidth: 760 }}>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size * 0.42, letterSpacing: "0.14em", color: C.blue }}>ENKEL</div>
      <div style={{ fontFamily: fonts.semibold, fontSize: size, color: PK.ink, lineHeight: 1.22, marginTop: 4 }}>{ty ? typed(text, t, ty[0], ty[1]) : text}</div>
    </div>
  </div>
);
const SceneEnkel: React.FC<{ t: number }> = ({ t }) => {
  const a = A.er - 0.1;
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 46, ...popStyle(t, a, 10, 0.8) }}><LabelChip text="Tipp vom Enkel" dot={C.blue} size={30} /></div>
      <div style={{ position: "absolute", left: 60, top: 180, transform: tilt3d(t, 4, 8) }}>
        <EnkelBubble t={t} at={A.er - 0.05} text="Oma, schreib einfach rein, wer du bist und was du brauchst." size={46} typed={[A.er + 0.15, A.brauchst + 0.3]} />
      </div>
      <div style={{ position: "absolute", left: 470, top: 520, transform: `perspective(1600px) rotateX(8deg) rotateY(-10deg) rotate(${3 + Math.sin(t * 0.8) * 0.5}deg)`, ...popStyle(t, A.brauchst - 0.4, 24, 0.8) }}>
        <Paper fold={false} style={{ position: "relative", width: 500, height: 230 }}>
          <div style={{ padding: "22px 28px", fontFamily: HAND, fontWeight: 600, fontSize: 40, color: "#24407A", lineHeight: 1.25 }}>
            <div>1. Wer bin ich?</div>
            <div>2. Was brauche ich?</div>
          </div>
        </Paper>
      </div>
    </>
  );
};

// ---------- split: Oma types her situation into Claude ----------
const PROMPT = "Ich bin 75, wasche zweimal die Woche, und das Ding soll leise sein. Welche Waschmaschine?";
const ScenePrompt: React.FC<{ t: number }> = ({ t }) => {
  const a = A.ich0 - 0.1;
  const tA = A.geschrieben - 0.1, tB = A.leise + 0.5;
  return (
    <>
      <ClaudeWin title="Neue Waschmaschine" style={{ left: 50, top: 130, width: 980, height: 660, transform: tilt3d(t, 4, -6), boxShadow: deep, ...popStyle(t, a, 20, 0.9) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: SERIF, fontSize: 46, color: CL.text, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}><ClaudeMark size={42} />Guten Tag, Roma</div>
        <Composer w={920} h={400} text={typed(PROMPT, t, tA, tB)} caret={t > tA && Math.floor(t * 4) % 2 === 0} sendOn={t > tB} fs={34} style={{ left: 30, top: 150 }} />
      </ClaudeWin>
      <div style={{ position: "absolute", left: 40, top: 46, ...popStyle(t, a, 10, 0.8) }}><LabelChip text="Omas Nachricht an Claude" dot={C.orange} size={28} /></div>
      <div style={{ position: "absolute", right: 90, top: 520, display: "flex", gap: 12 }}>
        {[["75 JAHRE", A.fuenfundsiebzig], ["2× / WOCHE", A.zweimal], ["LEISE", A.leise]].map(([txt, w], i) => (t > (w as number) - 0.05 ? <div key={i} style={popStyle(t, (w as number) - 0.05, 10, 0.5)}><Tag text={txt as string} color={i === 2 ? C.green : C.ink} size={22} /></div> : null))}
      </div>
    </>
  );
};

// ---------- split: switch on Research (click path) ----------
const SceneResearch: React.FC<{ t: number }> = ({ t }) => {
  const a = A.dann0 - 0.1;
  const clickAt = A.druecken;
  const res = k(t, clickAt, 0.3);
  const sendAt = A.und1 - 0.35;
  return (
    <>
      <ClaudeWin title="Neue Waschmaschine" style={{ left: 50, top: 130, width: 980, height: 660, transform: `${tilt3d(t, 4, -6)} scale(${1 + 0.06 * k(t, a, 0.5, Easing.inOut(Easing.cubic))})`, transformOrigin: "20% 85%", boxShadow: deep }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: SERIF, fontSize: 46, color: CL.text, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}><ClaudeMark size={42} />Guten Tag, Roma</div>
        <Composer w={920} h={400} text={PROMPT} research={res} resHover={t > clickAt - 0.3} sendOn fs={34} style={{ left: 30, top: 150, transform: t > sendAt ? `scale(${1 - 0.03 * Math.max(0, 1 - (t - sendAt) / 0.15)})` : undefined }} />
      </ClaudeWin>
      {t > clickAt + 0.15 ? (
        <Glass style={{ left: 600, top: 40, height: 84, padding: "0 26px 0 16px", display: "flex", alignItems: "center", gap: 14, ...popStyle(t, clickAt + 0.15, 14, 0.7) }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: C.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I.scope} size={32} color={C.blue} sw={2.2} /></div>
          <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: PK.ink, whiteSpace: "nowrap" }}>Research an</span>
          <CheckDot size={34} p={k(t, clickAt + 0.3, 0.3)} />
        </Glass>
      ) : null}
      {t > A.einmal - 0.1 ? <div style={{ position: "absolute", left: 40, top: 30 }}><EnkelBubble t={t} at={A.einmal - 0.1} text="Einmal drücken, Oma." size={34} /></div> : null}
      <Pointer label="Enkel" t={t} path={[{ x: 760, y: 790, at: a + 0.1 }, { x: 330, y: 720, at: A.knopf, click: false }, { x: 330, y: 722, at: clickAt, click: true }, { x: 960, y: 720, at: sendAt, click: true }]} />
    </>
  );
};

// ---------- full: Claude researches on its own for a few minutes ----------
const SOURCES = [
  { k: "TESTBERICHT", x: "Waschmaschinen im Test 2026", w: () => A.testberichte },
  { k: "RÜCKRUF", x: "Rückrufe Haushaltsgeräte", w: () => A.rueckrufe },
  { k: "BEWERTUNGEN", x: "2.140 Kundenbewertungen", w: () => A.kundenbewertungen },
  { k: "TESTBERICHT", x: "Lautstärke beim Schleudern", w: () => A.kundenbewertungen + 0.35 },
  { k: "FORUM", x: "Erfahrungen nach 3 Jahren", w: () => A.minuten - 0.2 },
];
const FullResearch: React.FC<{ t: number }> = ({ t }) => {
  const from = A.und1 - 0.12;
  const zoom = 1 + 0.035 * k(t, from, 6, Easing.inOut(Easing.sin));
  const n = Math.round(interpolate(t, [A.liest, A.am - 0.2], [0, 47], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const mins = interpolate(t, [A.claude1, A.am - 0.2], [0, 252], clamp);
  const clock = `${Math.floor(mins / 60)}:${String(Math.floor(mins % 60)).padStart(2, "0")}`;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Stage t={t} />
      <Bokeh t={t} h={1920} n={24} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", ...popStyle(t, from, 14, 0.85) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, letterSpacing: "0.4em", color: PK.sub }}>UND DANN WARTEN</div>
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 40%" }}>
        <ClaudeWin title="Neue Waschmaschine" style={{ left: 50, top: 210, width: 980, height: 1270, transform: tilt3d(t, 5, -4), boxShadow: deep, ...popStyle(t, from, 24, 0.92) }}>
          <div style={{ position: "absolute", right: 26, top: 22, maxWidth: 700, background: CL.bubble, borderRadius: 18, padding: "12px 18px", fontFamily: fonts.medium, fontSize: 22, color: CL.text, lineHeight: 1.3 }}>{PROMPT}</div>
          <div style={{ position: "absolute", left: 26, top: 150 }}><ClaudeMark size={36} /></div>
          <div style={{ position: "absolute", left: 80, right: 30, top: 146 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ height: 50, borderRadius: 14, padding: "0 18px 0 12px", display: "flex", alignItems: "center", gap: 10, background: C.blueSoft, border: "1.5px solid #B7D6F4" }}>
                <Ico d={I.scope} size={26} color={C.blue} sw={2.2} />
                <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.blue }}>Research</span>
              </div>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: CL.sub, fontVariantNumeric: "tabular-nums" }}>{clock} min</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 24, letterSpacing: "0.08em", color: "#FFF", background: C.orange, borderRadius: 10, padding: "8px 14px", fontVariantNumeric: "tabular-nums" }}>{n} QUELLEN</span>
            </div>
            <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 22 }}>
              {SOURCES.map((s, i) => {
                const w = s.w() - 0.08;
                if (t < w) return null;
                const done = t > w + 0.9;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 150, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 16, padding: "0 22px", ...popStyle(t, w, 12, 0.85) }}>
                    <div style={{ width: 76, height: 76, borderRadius: 16, background: i === 1 ? C.redSoft : C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 26, color: i === 1 ? C.red : C.orange }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <MonoLabel text={s.k} size={20} color={i === 1 ? C.red : CL.sub} />
                      <div style={{ fontFamily: fonts.semibold, fontSize: 38, color: CL.text, marginTop: 6, whiteSpace: "nowrap" }}>{s.x}</div>
                    </div>
                    {done ? <CheckDot size={40} p={k(t, w + 0.9, 0.3)} /> : <div style={{ width: 36, height: 36, borderRadius: "50%", border: `4px solid ${C.orangeSoft}`, borderTopColor: C.orange, transform: `rotate(${t * 540}deg)` }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </ClaudeWin>
      </div>
      <Grade />
    </AbsoluteFill>
  );
};

// ---------- split: three models with price, power use and the catch, with sources ----------
const MODELS = [
  { n: "Modell A", p: "549 €", e: "A", kwh: "48 kWh", h: "laut beim Schleudern" },
  { n: "Modell B", p: "629 €", e: "A", kwh: "45 kWh", h: "Tür etwas schwergängig" },
  { n: "Modell C", p: "479 €", e: "B", kwh: "61 kWh", h: "Ersatzteile teuer" },
];
const SceneModels: React.FC<{ t: number }> = ({ t }) => {
  const a = A.am - 0.1;
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 46, ...popStyle(t, a, 10, 0.8) }}><LabelChip text="3 Modelle · mit dem Haken" dot={C.orange} size={30} /></div>
      {MODELS.map((m, i) => {
        const x = 40 + i * 340, appear = A.am + i * 0.18;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 150, transform: `${tilt3d(t, 4, 8 - i * 8)} translateY(${Math.sin(t * 1.1 + i) * 3}px)`, ...popStyle(t, appear, 30, 0.85) }}>
            <Paper fold={false} sheen={k(t, appear + 0.3, 1, Easing.inOut(Easing.cubic))} style={{ position: "relative", width: 320, height: 620 }}>
              <div style={{ padding: "22px 22px" }}>
                <div style={{ position: "relative", height: 210 }}><Washer size={170} t={t} spin={i * 0.4} style={{ left: 66, top: 4 }} /></div>
                <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 38, color: PK.ink, marginTop: 6 }}>{m.n}</div>
                <div style={{ position: "relative", display: "inline-block", fontFamily: fonts.bold, fontSize: 46, color: PK.ink, marginTop: 6, opacity: t > A.preis - 0.1 ? 1 : 0.15 }}>
                  {t > A.preis - 0.1 ? <Highlight p={k(t, A.preis - 0.1 + i * 0.08, 0.3)} /> : null}
                  <span style={{ position: "relative" }}>{m.p}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, opacity: t > A.strom - 0.1 ? 1 : 0.15, ...(t > A.strom - 0.1 ? popStyle(t, A.strom - 0.1 + i * 0.08, 6, 0.8) : {}) }}>
                  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, color: "#FFF", background: m.e === "A" ? C.green : "#7DB740", borderRadius: "6px 2px 2px 6px", padding: "4px 14px 4px 10px", clipPath: "polygon(0 0, 82% 0, 100% 50%, 82% 100%, 0 100%)" }}>{m.e}</span>
                  <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: PK.sub }}>{m.kwh}/Jahr</span>
                </div>
                {t > A.haken - 0.1 ? (
                  <div style={{ marginTop: 18, fontFamily: HAND, fontWeight: 700, fontSize: 34, color: PK.red, lineHeight: 1.05, transform: `rotate(-2deg)`, ...popStyle(t, A.haken - 0.1 + i * 0.12, 8, 0.8) }}>
                    Haken: {m.h}
                    <Brush w={250} p={k(t, A.haken + i * 0.12, 0.35)} color={PK.red} sw={4} kind="under" style={{ left: 0, top: 70 }} />
                  </div>
                ) : null}
              </div>
              {t > A.quellen - 0.1 ? (
                <div style={{ position: "absolute", left: 22, bottom: 20, display: "flex", gap: 8, ...popStyle(t, A.quellen - 0.1 + i * 0.1, 6, 0.6) }}>
                  {[1, 2, 3].map((q) => <span key={q} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 18, color: C.blue, background: C.blueSoft, borderRadius: 6, padding: "3px 9px" }}>[{q + i * 3}]</span>)}
                </div>
              ) : null}
            </Paper>
          </div>
        );
      })}
    </>
  );
};

// ---------- split: three afternoons at the electronics store vs. Opa's wrong buy ----------
const SceneFrueher: React.FC<{ t: number }> = ({ t }) => {
  const a = A.frueher - 0.1;
  const opa = t > A.opa - 0.15;
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 46, ...popStyle(t, a, 10, 0.8) }}><LabelChip text="Opa im Elektromarkt" dot={C.red} size={30} /></div>
      {["SAMSTAG", "SAMSTAG", "SAMSTAG"].map((d, i) => {
        const appear = A.frueher + i * 0.3;
        return t > appear ? (
          <div key={i} style={{ position: "absolute", left: 60 + i * 150, top: 170 + i * 26, transform: `perspective(1600px) rotateX(10deg) rotateY(12deg) rotate(${-8 + i * 5}deg)`, ...popStyle(t, appear, 26, 0.7) }}>
            <Paper fold={false} style={{ position: "relative", width: 230, height: 270 }}>
              <div style={{ height: 62, background: `linear-gradient(180deg, ${PK.red}, #A9302B)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: "#FFF" }}>{d}</div>
              <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 500, fontSize: 96, color: PK.ink, marginTop: 10 }}>{[4, 11, 18][i]}</div>
              <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 30, color: "#2B4C8C" }}>Elektromarkt</div>
            </Paper>
          </div>
        ) : null;
      })}
      {t > A.elektromarkt ? (
        <div style={{ position: "absolute", left: 50, top: 600, display: "flex", alignItems: "center", gap: 14, ...popStyle(t, A.elektromarkt, 10, 0.7) }}>
          <span style={{ position: "relative", fontFamily: fonts.bold, fontSize: 46, color: PK.ink }}>3 Nachmittage<Brush w={310} p={k(t, A.elektromarkt + 0.5, 0.35)} sw={8} style={{ left: -6, top: 12 }} /></span>
          {t > A.elektromarkt + 0.6 ? <span style={{ fontFamily: fonts.bold, fontSize: 46, color: C.green, ...popStyle(t, A.elektromarkt + 0.6, 8, 0.6) }}>→ 5 Min.</span> : null}
        </div>
      ) : null}
      {opa ? (
        <div style={{ position: "absolute", left: 670, top: 150, transform: `perspective(1600px) rotateX(8deg) rotateY(-14deg) rotate(${4 + Math.sin(t * 0.8) * 0.5}deg) translateX(${shakeAt(t, A.falsche, 7)}px)`, ...popStyle(t, A.opa - 0.15, 30, 0.8) }}>
          <Paper fold={false} style={{ position: "relative", width: 360, height: 560, background: "linear-gradient(180deg, #FFFFFF, #F6F2EA)" }}>
            <div style={{ padding: "26px 28px", fontFamily: MONO, color: PK.ink }}>
              <div style={{ textAlign: "center", fontWeight: 800, fontSize: 22, letterSpacing: "0.14em" }}>KASSENBON</div>
              <div style={{ textAlign: "center", fontSize: 16, color: PK.sub, marginTop: 4 }}>Elektromarkt · Opa</div>
              <div style={{ borderTop: "2px dashed #CFC6B8", margin: "18px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20 }}><span>Waschmaschine</span><span>699,00</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, marginTop: 8 }}><span>Lieferung</span><span>39,00</span></div>
              <div style={{ borderTop: "2px dashed #CFC6B8", margin: "18px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 26 }}><span>SUMME</span><span>738,00</span></div>
              <div style={{ fontFamily: HAND, fontSize: 32, color: PK.red, marginTop: 30, transform: "rotate(-3deg)" }}>„die war im Angebot“</div>
            </div>
            <InkStamp id="stFalsch" text="FALSCHE" p={k(t, A.falsche - 0.05, 0.16)} color={PK.red} size={48} rot={-14} style={{ left: 50, top: 290 }} />
          </Paper>
        </div>
      ) : null}
    </>
  );
};

// ---------- split: Oma's handwritten note with all the sentences, then a phone photo ----------
// Zettel zeigt nur, WAS draufsteht (Titel); die genauen Befehle sind verwischt -> gibt es nur per DM.
const NOTE = [
  { n: "1", x: "Wer ich bin + was ich brauche", p: "Ich bin … und brauche … mein Budget ist … achte auf …" },
  { n: "2", x: "Recherche-Knopf an", p: "Recherchiere gründlich und lies dir dafür … durch …" },
  { n: "3", x: "Tests, Rückrufe, Bewertungen", p: "Prüfe Stiftung … , Rückrufe der letzten … und …" },
  { n: "4", x: "3 Modelle: Preis, Strom, Haken", p: "Gib mir genau drei … mit Tabelle aus … und …" },
  { n: "5", x: "Nur mit Quellen!", p: "Nenne zu jeder Zahl die Quelle und sag, wo du …" },
  { n: "+", x: "Bonus: Handy, Fernseher & Co.", p: "Tausch Waschmaschine einfach gegen … und …" },
];
const NOTE_POS: React.CSSProperties = { left: 50, top: 70 };
const OmaNote: React.FC<{ t: number; from: number; to: number; all?: boolean; style?: React.CSSProperties }> = ({ t, from, to, all, style }) => {
  const per = (to - from) / NOTE.length;
  return (
    <Paper fold={false} style={{ position: "absolute", width: 760, height: 760, background: "linear-gradient(170deg, #FFFFFF, #FBF8F1 60%, #F4EEE2)", ...style }}>
      <div style={{ position: "absolute", left: 76, top: 0, bottom: 0, width: 2, background: "rgba(210,64,58,0.35)" }} />
      <div style={{ position: "relative", padding: "30px 30px 0 96px" }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, color: PK.ink, lineHeight: 1 }}>Omas Befehle für Claude</div>
        <div style={{ fontFamily: HAND, fontSize: 28, color: PK.sub, marginTop: 4 }}>vom Enkel · zum Abschreiben</div>
        <div style={{ marginTop: 14 }}>
          {NOTE.map((l, i) => {
            const a = from + i * per;
            const on = all || t > a;
            const txt = all ? l.x : typed(l.x, t, a, a + per * 0.8);
            return (
              <div key={i} style={{ height: 94, opacity: on ? 1 : 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "baseline", fontFamily: HAND, fontWeight: 700, fontSize: 36, color: "#24407A", lineHeight: 1.15 }}>
                  <span style={{ width: 30, flexShrink: 0, color: PK.red }}>{l.n}</span>
                  <span style={{ whiteSpace: "nowrap" }}>{txt}</span>
                </div>
                <div style={{ marginLeft: 40, fontFamily: HAND, fontSize: 28, color: "#3A5590", whiteSpace: "nowrap", filter: "blur(6px)", opacity: all || t > a + per * 0.6 ? 0.85 : 0 }}>{l.p}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", right: 30, bottom: 22, fontFamily: HAND, fontSize: 38, color: PK.red, transform: "rotate(-6deg)", opacity: all || t > to ? 1 : 0 }}>♥ dein Enkel</div>
    </Paper>
  );
};
const SceneNote: React.FC<{ t: number }> = ({ t }) => {
  const a = A.euch0 - 0.15;
  return (
    <>
      <div style={{ position: "absolute", ...NOTE_POS, transform: `perspective(1800px) rotateX(12deg) rotateY(10deg) rotate(${-3 + Math.sin(t * 0.6) * 0.4}deg)`, ...popStyle(t, a, 30, 0.9) }}>
        <OmaNote t={t} from={A.euch0 + 0.2} to={A.zusammen + 0.4} style={{ position: "relative" }} />
      </div>
      <div style={{ position: "absolute", right: 34, top: 520, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, zIndex: 5 }}>
        {t > A.saetze ? <div style={popStyle(t, A.saetze, 10, 0.6)}><Tag text="6 BEFEHLE" color={C.orange} size={26} /></div> : null}
        {t > A.seite - 0.1 ? <div style={popStyle(t, A.seite - 0.1, 10, 0.6)}><Tag text="NUR PER DM" color={C.ink} size={26} /></div> : null}
      </div>
    </>
  );
};
const ScenePhoto: React.FC<{ t: number }> = ({ t }) => {
  const a = A.wenn - 0.1;
  const flash = t > A.foto + 0.2 ? Math.max(0, 1 - (t - (A.foto + 0.2)) / 0.25) : 0;
  const shot = t > A.foto + 0.2;
  const fly = k(t, A.schicken - 0.1, 0.45, Easing.inOut(Easing.cubic));
  return (
    <>
      <div style={{ position: "absolute", ...NOTE_POS, transform: `perspective(1800px) rotateX(12deg) rotateY(10deg) rotate(-3deg)`, filter: "blur(1.5px)" }}>
        <OmaNote t={t} from={0} to={0} all style={{ position: "relative" }} />
      </div>
      <div style={{ position: "absolute", left: 300, top: 40, width: 420, height: 760, borderRadius: 54, background: "linear-gradient(160deg, #3A3633, #121110)", padding: 14, boxSizing: "border-box", boxShadow: "0 40px 80px -20px rgba(40,20,5,0.6)", transform: `rotate(${4 + Math.sin(t * 0.9) * 0.6}deg)`, ...popStyle(t, a, 40, 0.8) }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 42, overflow: "hidden", background: "#0D0D0D" }}>
          <div style={{ position: "absolute", left: 18, right: 18, top: 70, bottom: 150, overflow: "hidden", borderRadius: 8 }}>
            <div style={{ position: "absolute", left: -60, top: -40, transform: "scale(0.72) rotate(-3deg)", transformOrigin: "0 0" }}><OmaNote t={t} from={0} to={0} all style={{ position: "relative" }} /></div>
            {!shot ? [0, 1, 2, 3].map((c) => <div key={c} style={{ position: "absolute", width: 40, height: 40, borderColor: "#FFF", borderStyle: "solid", borderWidth: `${c < 2 ? 4 : 0}px ${c % 2 ? 4 : 0}px ${c >= 2 ? 4 : 0}px ${c % 2 ? 0 : 4}px`, left: c % 2 ? undefined : 30, right: c % 2 ? 30 : undefined, top: c < 2 ? 30 : undefined, bottom: c >= 2 ? 30 : undefined }} />) : null}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 38, display: "flex", justifyContent: "center" }}>
            <div style={{ width: 86, height: 86, borderRadius: "50%", border: "5px solid #FFF", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 68, height: 68, borderRadius: "50%", background: "#FFF", transform: `scale(${t > A.foto + 0.1 && t < A.foto + 0.35 ? 0.85 : 1})` }} /></div>
          </div>
          <div style={{ position: "absolute", inset: 0, background: "#FFF", opacity: flash }} />
          {shot && fly > 0 ? (
            <div style={{ position: "absolute", left: 18, right: 18, top: 70, bottom: 150, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", opacity: fly }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#FFF", borderRadius: 999, padding: "14px 24px", fontFamily: fonts.semibold, fontSize: 28, color: PK.ink }}><Ico d={I.send} size={30} color={C.orange} sw={2.2} />Gesendet</div>
            </div>
          ) : null}
        </div>
      </div>
      <Pointer t={t} path={[{ x: 760, y: 790, at: a + 0.15 }, { x: 512, y: 700, at: A.foto + 0.15, click: true }]} />
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }>; full?: boolean; key2?: string };
const SCENES: Scene[] = [
  { from: 0, to: A.er - 0.1, origin: "50% 50%", El: SceneHook },
  { from: A.er - 0.1, to: A.ich0 - 0.1, origin: "40% 40%", El: SceneEnkel, key2: "rgba(44,132,219,0.22)" },
  { from: A.ich0 - 0.1, to: A.dann0 - 0.1, origin: "50% 45%", El: ScenePrompt },
  { from: A.dann0 - 0.1, to: A.und1 - 0.12, origin: "30% 85%", El: SceneResearch, key2: "rgba(44,132,219,0.22)" },
  { from: A.und1 - 0.12, to: A.am - 0.1, origin: "50% 50%", El: FullResearch, full: true },
  { from: A.am - 0.1, to: A.frueher - 0.1, origin: "50% 40%", El: SceneModels },
  { from: A.frueher - 0.1, to: A.euch0 - 0.15, origin: "60% 45%", El: SceneFrueher, key2: "rgba(210,64,58,0.22)" },
  { from: A.euch0 - 0.15, to: A.wenn - 0.1, origin: "40% 40%", El: SceneNote },
  { from: A.wenn - 0.1, to: 999, origin: "50% 45%", El: ScenePhoto },
];

const chunks = (() => {
  const out: { start: number; end: number; words: { w: string; s: number }[] }[] = [];
  let cur: Cap[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => ({ w: c.text.replace(/[.,!?:]/g, "").toUpperCase(), s: c.startMs / 1000 })) });
    cur = [];
  };
  for (const c of CAPS) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 20) || (cur.length && len > 22)) flush();
    cur.push(c);
    if (/[.,!?:]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
})();
const SeamCaption: React.FC<{ t: number; y: number }> = ({ t, y }) => {
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = pop(t, c.start - 0.04, 0.16);
  const chars = c.words.reduce((n, w) => n + w.w.length + 1, 0);
  const fs = chars > 22 ? 34 : chars > 19 ? 40 : 46;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.08), background: C.orange, borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: MONO, fontWeight: 700, fontSize: fs, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(120,50,25,0.30)" }}>
        {(() => {
          const cw = fs * 0.74, gapW = fs * 0.5;
          const xs: number[] = []; let acc = 0;
          c.words.forEach((w) => { xs.push(acc); acc += w.w.length * cw + gapW; });
          const ws = c.words.map((w) => w.w.length * cw - fs * 0.14);
          let i = c.words.findIndex((w, j) => j + 1 >= c.words.length || t < c.words[j + 1].s - 0.03);
          if (i < 0) i = c.words.length - 1;
          const prev = Math.max(0, i - 1);
          const q = i === 0 ? 1 : interpolate(t, [c.words[i].s - 0.03, c.words[i].s + 0.05], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          const px = xs[prev] + (xs[i] - xs[prev]) * q, pw = ws[prev] + (ws[i] - ws[prev]) * q;
          return (
            <div style={{ position: "relative", display: "flex", gap: gapW }}>
              <div style={{ position: "absolute", left: px - 12, top: -4, width: pw + 24, bottom: -4, background: "#111111", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.22)" }} />
              {c.words.map((w, j) => <span key={j} style={{ position: "relative", display: "inline-block", color: "#FFFFFF" }}>{w.w}</span>)}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

// ---------- master ----------
const OMA_S = 0.56, OMA_W = W * OMA_S, OMA_H = H * OMA_S;
const OMA_TOP = H - OMA_H + 10;
const CHEST_Y = 1610;
export const RomaVeo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = camera(t, scene.from, scene.to);
  const dx = Math.sin(t * 0.6) * 6, dy = Math.cos(t * 0.45) * 5;
  const El = scene.El;
  const word = "WASCHMASCHINE";
  const breathe = 1 + 0.012 * Math.sin(t * 0.8);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${dx * 0.35}px, ${dy * 0.35}px) scale(${1 + (cam - 1) * 0.35})` }}><Stage t={t} key2={scene.key2} /></div>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${dx * 0.6}px, ${dy * 0.6}px)` }}><Bokeh t={t} seed={2} h={H} /></div>
      {scene.full ? <El t={t} /> : (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH }}>
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <div style={{ position: "absolute", left: 0, top: OFF, width: W, height: 820, transform: `scale(${SC})`, transformOrigin: "50% 0%" }}><El t={t} /></div>
          </div>
        </div>
      )}
      {t < SCENES[1].from ? <HookPills t={t} /> : null}
      <div style={{ position: "absolute", left: (W - OMA_W) / 2 - 60, top: OMA_TOP + 220, width: OMA_W + 120, height: OMA_H, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,248,236,0.55), rgba(255,248,236,0))" }} />
      <div style={{ position: "absolute", left: (W - OMA_W) / 2, top: OMA_TOP, width: OMA_W, height: OMA_H, transform: `scale(${breathe})`, transformOrigin: "50% 100%", filter: "drop-shadow(14px 18px 34px rgba(70,45,20,0.30)) drop-shadow(0 2px 3px rgba(40,25,10,0.18)) saturate(0.94) contrast(0.97)", zIndex: 30 }}>
        <OffthreadVideo src={staticFile("roma-veo/oma.webm")} transparent style={{ width: "100%", height: "100%" }} />
      </div>
      <Grade />
      {t > A.komm - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.komm - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 32, letterSpacing: "0.12em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 16px 20px 24px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, letterSpacing: "0.08em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 22px 10px 24px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)", minWidth: 380 }}>{typed(word, t, A.trigger - 0.1, A.trigger + 0.45) || " "}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(20,20,20,0.82)", borderRadius: 999, padding: "10px 20px", ...popStyle(t, A.komm + 0.15, 8, 0.6) }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.green }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", color: "#FFF" }}>DER ZETTEL · PER DM</span>
          </div>
        </div>
      ) : null}
      <SeamCaption t={t} y={CHEST_Y} />
    </AbsoluteFill>
  );
};
