import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-bewirtung/captions.json";

// FP-N "Bewirtungsbeleg" (2026-10-25): Hook = 320-€-Geschäftsessen, Finanzamt erkennt 0 € an, zwei Zeilen fehlen.
// Heller Superkind-Look (weiß/orange), Schritte als claude.ai-Klickpfade mit Mauszeiger, Zeiten an captions.json verankert.

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const BW_END = LAST_END + 0.7;
export const BW_FRAMES = Math.round(BW_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  kunden: at("kunden"), dreihundert: at("dreihundertzwanzig"), euro0: at("euro", 0), finanzamt: at("finanzamt"), keinen: at("keinen"), beleg0: at("beleg", 0), fehlen: at("fehlen"), zeilen: at("zeilen"), wer: at("wer"), warum: at("warum"),
  mit1: at("mit", 1), bewirtungsbeleg: at("bewirtungsbeleg"), fertig: at("fertig"), auto: at("auto"),
  schritt0: at("schritt", 0), fotografierst: at("fotografierst"), tisch: at("tisch"), schickst: at("schickst"), claude1: at("claude", 1), liest: at("liest"), datum: at("datum"), restaurant0: at("restaurant", 0), betrag: at("betrag"),
  schritt1: at("schritt", 1), kalender: at("kalender"), wem: at("wem"), worum: at("worum"), daraus: at("daraus"), teilnehmer: at("teilnehmer"), anlass: at("anlass"),
  jetzt: at("jetzt"), trick: at("trick"),
  schritt2: at("schritt", 2), zweihundert: at("zweihundertfünfzig"), firmenname: at("firmenname"), fehlt: at("fehlt"), merkt: at("merkt"), sofort: at("sofort"), restaurant1: at("restaurant", 1), mail: at("mail"), richtige: at("richtige"),
  ende: at("ende"), unterschreibst: at("unterschreibst"),
  prompts: at("prompts"), checkliste: at("checkliste"), guide: at("guide"), komm: at("kommentiere"), trigger: at("essen", 1), folg: at("folg"),
};

const C = {
  bg: "#F3EFE6", grid: "rgba(0,0,0,0.045)", ink: "#151515", dim: "#8A877F", line: "#E7E4DD", card: "#FFFFFF",
  orange: "#D97757", orangeSoft: "#F8E1D7", green: "#1E9E57", greenSoft: "#E6F5EC", red: "#E5484D", redSoft: "#FDE8E8",
  chip: "#141414", term: "#17161A", gold: "#F5C542", blue: "#3E8EF7",
};
const MONO = "JetBrains Mono";
const PIXEL = "Silkscreen";
const shadow = "0 22px 48px rgba(20,20,20,0.10), 0 3px 8px rgba(20,20,20,0.06)";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, a: number, d = 0.3, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const pop = (t: number, a: number, d = 0.38) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
const popStyle = (t: number, a: number, rise = 18, from = 0.7): React.CSSProperties => {
  const p = pop(t, a);
  return { opacity: k(t, a, 0.14), transform: `translateY(${(1 - Math.min(p, 1)) * rise}px) scale(${from + (1 - from) * p})` };
};
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(interpolate(t, [a, b], [0, s.length], clamp)));
const rnd = (i: number, salt = 1) => { const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453; return x - Math.floor(x); };
const shakeAt = (t: number, a: number, amp = 5) => { const r = t - a; return r > 0.03 && r < 0.4 ? Math.sin(r * 90) * amp * (1 - r / 0.4) : 0; };
const eur = (n: number) => Math.round(n).toLocaleString("de-DE") + " €";

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
const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", background: C.card, borderRadius: 18, boxShadow: shadow, ...style }}>{children}</div>
);
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
const Stamp: React.FC<{ t: number; at: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, at: a, text, color = C.red, size = 64, rot = -8, style }) => {
  if (t < a) return null;
  const p = interpolate(t, [a, a + 0.16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ position: "absolute", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: p, fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.08em", color, border: `${size * 0.09}px solid ${color}`, borderRadius: 12, padding: `${size * 0.08}px ${size * 0.3}px`, background: "rgba(255,255,255,0.9)", whiteSpace: "nowrap", ...style }}>{text}</div>;
};
const PdfIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div style={{ width: size * 0.85, height: size, borderRadius: 6, background: C.red, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: size * 0.3, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: size * 0.12, boxSizing: "border-box", flexShrink: 0 }}>PDF</div>
);

// ---------- light world + claude.ai pieces (recreated light UI, real English labels) ----------
const SERIF = "Newsreader";
const CL = { page: "#FAF9F5", border: "#E3DFD5", text: "#1F1E1D", sub: "#77746C", send: "#C96442", bubble: "#F0EEE6", hover: "#F2EFE8" };

const LightBg: React.FC<{ t: number; glow?: string }> = ({ t, glow = "rgba(217,119,87,0.16)" }) => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: -80, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "40px 40px", transform: `translate(${Math.sin(t * 0.5) * 14}px, ${Math.cos(t * 0.4) * 12}px)` }} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 75% 45% at 50% 40%, ${glow}, rgba(255,255,255,0) 70%)` }} />
  </AbsoluteFill>
);
const BigTag: React.FC<{ text: string; bg: string; color?: string; size: number; style?: React.CSSProperties }> = ({ text, bg, color = "#FFF", size, style }) => (
  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.1em", color, background: bg, borderRadius: size * 0.22, padding: `${size * 0.2}px ${size * 0.42}px`, whiteSpace: "nowrap", lineHeight: 1.1, boxShadow: "0 16px 36px rgba(20,20,20,0.18)", ...style }}>{text}</div>
);
const MonoSlam: React.FC<{ t: number; at: number; text: string; top: number; size?: number; bg: string; hold?: number; rot?: number }> = ({ t, at: a, text, top, size = 110, bg, hold = 0.7, rot = -3 }) => {
  const u = t - a;
  if (u < 0 || u > hold + 0.15) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: 1 - k(u, hold, 0.15), zIndex: 30 }}>
      <BigTag text={text} bg={bg} size={size} style={{ transform: `scale(${interpolate(u, [0, 0.16], [2.3, 1], { ...clamp, easing: Easing.out(Easing.cubic) })}) rotate(${rot}deg)` }} />
    </div>
  );
};

// mouse pointer that glides between targets; click = dip + orange ripple
type PP = { x: number; y: number; at: number; click?: boolean };
const Pointer: React.FC<{ t: number; path: PP[]; size?: number }> = ({ t, path, size = 50 }) => {
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
    </>
  );
};

const Ico: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 26, color = CL.text, sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const I = {
  plus: "M12 5v14M5 12h14",
  clip: "M20 11.5l-8.2 8.2a5 5 0 01-7.1-7.1l8.6-8.6a3.4 3.4 0 014.8 4.8l-8.6 8.6a1.7 1.7 0 01-2.4-2.4l7.9-7.9",
  cam: "M4 8h3l2-2.5h6L17 8h3v11H4zM12 16.5a3.3 3.3 0 100-6.6 3.3 3.3 0 000 6.6z",
  drive: "M8.5 3.5h7l6 10.5-3.5 6H6L2.5 14zM8.5 3.5L15 14.5M15.5 3.5L9 14.5M2.5 14h13",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.6 2.5 3.8 5.5 3.8 9s-1.2 6.5-3.8 9c-2.6-2.5-3.8-5.5-3.8-9S9.4 5.5 12 3z",
  copy: "M8 8h11v11H8zM5 15V5h10",
  up: "M12 19V6M6 11.5L12 5.5l6 6",
  chev: "M6 9l6 6 6-6",
  doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
};
const SendBtn: React.FC<{ size?: number; on?: boolean }> = ({ size = 52, on = true }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: CL.send, opacity: on ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico d={I.up} size={size * 0.56} color="#FFF" sw={2.4} /></div>
);
const FileChip: React.FC<{ name: string; meta?: string; size?: number }> = ({ name, meta = "PDF", size = 1 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12 * size, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 12 * size, padding: `${8 * size}px ${16 * size}px ${8 * size}px ${8 * size}px` }}>
    <div style={{ width: 40 * size, height: 46 * size, borderRadius: 8 * size, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I.doc} size={26 * size} color={C.orange} sw={2} /></div>
    <div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 21 * size, color: CL.text, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontFamily: MONO, fontSize: 14 * size, color: CL.sub, letterSpacing: "0.08em" }}>{meta}</div>
    </div>
  </div>
);
// claude.ai composer: text area, "+" bottom left, model picker + send bottom right
const Composer: React.FC<{ w: number; h: number; text: string; placeholder?: string; caret?: boolean; file?: React.ReactNode; plusOn?: boolean; sendOn?: boolean; fs?: number; style?: React.CSSProperties }> = ({ w, h, text, placeholder = "Wie kann ich dir heute helfen?", caret, file, plusOn, sendOn, fs = 28, style }) => (
  <div style={{ position: "absolute", width: w, height: h, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 26, boxShadow: "0 14px 34px rgba(20,20,20,0.07)", boxSizing: "border-box", padding: "20px 22px 18px 26px", display: "flex", flexDirection: "column", ...style }}>
    {file ? <div style={{ marginBottom: 12 }}>{file}</div> : null}
    <div style={{ fontFamily: fonts.medium, fontSize: fs, color: text ? CL.text : CL.sub, lineHeight: 1.3, flex: 1 }}>
      {text || placeholder}
      {caret ? <span style={{ display: "inline-block", width: 3, height: fs * 1.05, background: C.orange, marginLeft: 3, verticalAlign: "middle" }} /> : null}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, border: `1.5px solid ${CL.border}`, background: plusOn ? CL.hover : "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I.plus} size={26} /></div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontFamily: fonts.medium, fontSize: 22, color: CL.sub }}>Opus 5.5 <Ico d={I.chev} size={18} color={CL.sub} /></div>
      <SendBtn on={sendOn} />
    </div>
  </div>
);
// claude.ai window frame (light page, title bar with chat name)
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
const StatusPill: React.FC<{ ok: boolean; text: string }> = ({ ok, text }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: MONO, fontWeight: 800, fontSize: 16, letterSpacing: "0.1em", color: ok ? C.green : C.red, background: ok ? C.greenSoft : C.redSoft, borderRadius: 999, padding: "6px 14px 6px 12px", whiteSpace: "nowrap" }}>
    <span style={{ width: 10, height: 10, borderRadius: "50%", background: ok ? C.green : C.red }} />{text}
  </span>
);
// ---------- hook pills (frame 0 = thumbnail): "Geschäftsessen 0 €" (struck) / "Mit Claude absetzbar" ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const strike = k(t, 0.85, 0.3, Easing.inOut(Easing.cubic));
  const m = k(t, 1.15, 0.35, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 62, padding: "10px 26px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow }}>
        Geschäftsessen{" "}
        <span style={{ position: "relative", display: "inline-block", color: C.red }}>
          0 €
          <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 9, background: C.ink, borderRadius: 4, transform: `scaleX(${strike})`, transformOrigin: "0% 50%" }} />
        </span>
      </div>
      <div style={{ ...pill, marginTop: -6 }}>
        Mit Claude{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -8, right: -8, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>absetzbar</span>
        </span>
      </div>
    </div>
  );
};

// small paper receipt (zigzag bottom)
const Receipt: React.FC<{ w: number; title: string; amount: string; style?: React.CSSProperties }> = ({ w, title, amount, style }) => {
  const h = w * 1.35;
  const teeth = 9, tw = w / teeth;
  const zig = Array.from({ length: teeth }, (_, i) => `L${(i + 0.5) * tw} ${h} L${(i + 1) * tw} ${h - tw * 0.5}`).join(" ");
  return (
    <div style={{ position: "absolute", width: w, height: h, filter: "drop-shadow(0 10px 16px rgba(20,20,20,0.16))", ...style }}>
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M0 0 H${w} V${h - tw * 0.5} ${zig} L0 ${h - tw * 0.5} Z`} fill="#FFFDF8" /></svg>
      <div style={{ position: "absolute", left: w * 0.1, right: w * 0.1, top: w * 0.1 }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: w * 0.1, color: C.ink, whiteSpace: "nowrap", overflow: "hidden" }}>{title}</div>
        {[0.9, 0.6, 0.75, 0.5].map((q, i) => <div key={i} style={{ height: w * 0.035, width: `${q * 100}%`, background: "#E4E0D7", borderRadius: 3, marginTop: w * 0.06 }} />)}
        <div style={{ borderTop: `${Math.max(1, w * 0.01)}px dashed #CFCAC0`, marginTop: w * 0.08, paddingTop: w * 0.05, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 800, fontSize: w * 0.095, color: C.ink }}><span>SUMME</span><span>{amount}</span></div>
      </div>
    </div>
  );
};

// ---------- split hook: restaurant bill 320 €, Finanzamt 0 €, two empty lines (wer / warum) ----------
const BILL = [
  { l: "2× Antipasti", v: "38,00" },
  { l: "2× Hauptgang", v: "128,00" },
  { l: "2× Dessert", v: "48,00" },
  { l: "Wein, Wasser", v: "106,00" },
];
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const thumb = t < 0.04;
  const sum = thumb ? 320 : interpolate(t, [A.dreihundert - 0.1, A.dreihundert + 0.45], [0, 320], { ...clamp, easing: Easing.out(Easing.cubic) });
  const zero = thumb || t > A.keinen - 0.05;
  const empty = thumb || t > A.zeilen - 0.1;
  const blink = empty && !thumb ? 0.55 + 0.45 * Math.abs(Math.sin((t - A.zeilen) * 5)) : 1;
  const emptyLine = (label: string, a: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, height: 52, marginTop: 8, padding: "0 12px", margin: "8px -12px 0", borderRadius: 10, border: `3px ${empty ? "solid" : "dashed"} ${empty ? `rgba(229,72,77,${blink})` : "#D8D3C9"}`, background: empty ? C.redSoft : "transparent", transform: `translateX(${shakeAt(t, a, 6)}px)` }}>
      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 19, color: empty ? C.red : C.dim, letterSpacing: "0.06em" }}>{label}</span>
      <span style={{ flex: 1, borderBottom: `2px dotted ${empty ? C.red : "#CFCAC0"}`, height: 20 }} />
    </div>
  );
  return (
    <>
      <div style={{ position: "absolute", left: 56, top: 232, width: 480, height: 570, background: "#FFFDF8", borderRadius: 14, boxShadow: shadow, padding: "24px 30px", boxSizing: "border-box", transform: "rotate(-1.5deg)", ...(thumb ? {} : popStyle(t, 0.04, 24, 0.85)) }}>
        <div style={{ fontFamily: SERIF, fontSize: 38, color: C.ink, lineHeight: 1.1 }}>Trattoria Da Marco</div>
        <div style={{ fontFamily: MONO, fontSize: 15, color: C.dim, letterSpacing: "0.08em", marginTop: 4 }}>KÖLN · 21.10.2026 · 13:42</div>
        <div style={{ height: 2, background: C.line, margin: "12px 0 6px" }} />
        {BILL.map((r, i) => {
          const a = A.kunden + i * 0.1;
          return thumb || t > a ? (
            <div key={i} style={{ display: "flex", height: 40, alignItems: "center", ...(thumb ? {} : popStyle(t, a, 8, 0.9)) }}>
              <span style={{ fontFamily: fonts.medium, fontSize: 22, color: C.ink, flex: 1 }}>{r.l}</span>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.ink }}>{r.v}</span>
            </div>
          ) : null;
        })}
        <div style={{ height: 2.5, background: C.ink, margin: "8px 0 6px" }} />
        <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontWeight: 800, color: C.ink }}>
          <span style={{ fontSize: 26, flex: 1 }}>SUMME</span>
          <span style={{ fontSize: 40, fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.1 * Math.max(0, 1 - Math.abs(t - A.dreihundert - 0.45) / 0.2)})`, transformOrigin: "100% 50%" }}>{thumb || t > A.dreihundert - 0.1 ? `${sum.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €` : "…"}</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 12, color: C.dim, marginTop: 4, letterSpacing: "0.04em" }}>TSE-SIG 8F2A…C91 · KASSE 02</div>
        {emptyLine("TEILNEHMER", A.wer)}
        {emptyLine("ANLASS", A.warum)}
      </div>
      {thumb || t > A.finanzamt - 0.2 ? (
        <Card style={{ left: 570, top: 240, width: 456, height: 250, padding: 26, boxSizing: "border-box", border: zero ? `3px solid ${C.red}` : "3px solid transparent", transform: `translateX(${shakeAt(t, A.keinen, 8)}px)`, ...(thumb ? {} : popStyle(t, A.finanzamt - 0.2, 20, 0.7)) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Ico d="M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M2 10l10-6 10 6z" size={30} color={C.ink} />
            <span style={{ fontFamily: MONO, fontSize: 18, letterSpacing: "0.1em", color: C.dim }}>FINANZAMT ERKENNT AN</span>
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 112, color: zero ? C.red : C.line, lineHeight: 1.15 }}>0 €</div>
        </Card>
      ) : null}
      {thumb || t > A.fehlen - 0.15 ? (
        <Card style={{ left: 570, top: 512, width: 456, height: 290, padding: "24px 26px", boxSizing: "border-box", ...(thumb ? {} : popStyle(t, A.fehlen - 0.15, 20, 0.7)) }}>
          <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: "0.1em", color: C.dim }}>AUF DEM BELEG FEHLT</div>
          {[{ l: "Wer war dabei?", a: A.wer }, { l: "Warum?", a: A.warum }].map((r, i) => (thumb || t > r.a - 0.08 ? (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 92, borderBottom: i === 0 ? `1px solid ${C.line}` : "none", ...(thumb ? {} : popStyle(t, r.a - 0.08, 10, 0.6)) }}>
              <span style={{ width: 48, height: 48, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico d="M7 7l10 10M17 7L7 17" size={26} color="#FFF" sw={3} /></span>
              <span style={{ fontFamily: fonts.bold, fontSize: 38, color: C.ink, whiteSpace: "nowrap" }}>{r.l}</span>
            </div>
          ) : null))}
        </Card>
      ) : null}
    </>
  );
};

// ---------- full: with Claude the receipt is done before you reach the car ----------
const CAR = "M3.5 13l2-5.2A2 2 0 017.4 6.5h9.2a2 2 0 011.9 1.3l2 5.2v5H3.5zM3.5 13h17M7 18v1.5M17 18v1.5M7 15.5h.01M17 15.5h.01";
const DOC_ROWS = [
  { k: "TAG", v: "21.10.2026" },
  { k: "ORT", v: "Trattoria Da Marco, Köln" },
  { k: "TEILNEHMER", v: "T. Müller, Müller GmbH" },
  { k: "ANLASS", v: "Angebot Relaunch Website" },
  { k: "BETRAG", v: "320,00 €" },
];
const FullSolution: React.FC<{ t: number }> = ({ t }) => {
  const from = A.mit1 - 0.1;
  const zoom = 1 + 0.04 * k(t, from, 3, Easing.inOut(Easing.sin));
  const rowAt = (i: number) => A.bewirtungsbeleg - 0.05 + i * ((A.fertig + 0.35 - A.bewirtungsbeleg) / DOC_ROWS.length);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightBg t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", ...popStyle(t, from, 10, 0.8) }}><LabelChip text="Mit Claude" dot={C.orange} size={34} /></div>
        <div style={{ position: "absolute", left: 140, top: 340, width: 800, height: 700, background: "#FFF", borderRadius: 26, boxShadow: shadow, border: `1px solid ${CL.border}`, padding: "34px 40px", boxSizing: "border-box", ...popStyle(t, from + 0.04, 30, 0.85) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <ClaudeMark size={56} />
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 54, color: C.ink, lineHeight: 1 }}>Bewirtungsbeleg</div>
              <div style={{ fontFamily: MONO, fontSize: 17, color: C.dim, letterSpacing: "0.1em", marginTop: 6 }}>§ 4 ABS. 5 NR. 2 ESTG</div>
            </div>
          </div>
          <div style={{ height: 2, background: C.line, margin: "24px 0 6px" }} />
          {DOC_ROWS.map((r, i) => {
            const a = rowAt(i), on = t > a;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", height: 92, borderBottom: i < DOC_ROWS.length - 1 ? `1px solid ${C.line}` : "none" }}>
                <span style={{ width: 210, fontFamily: MONO, fontWeight: 800, fontSize: 19, letterSpacing: "0.08em", color: C.dim }}>{r.k}</span>
                <span style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 30, color: C.ink, whiteSpace: "nowrap", opacity: on ? 1 : 0, transform: `translateX(${on ? (1 - k(t, a, 0.25)) * 20 : 20}px)` }}>{r.v}</span>
                <span style={{ width: 46, height: 46, borderRadius: "50%", background: on ? C.green : "#EEEAE2", display: "flex", alignItems: "center", justifyContent: "center", transform: on ? `scale(${0.6 + 0.4 * Math.min(1, pop(t, a, 0.3))})` : undefined }}>{on ? <Check size={26} /> : null}</span>
              </div>
            );
          })}
        </div>
        {t > A.fertig - 0.1 ? (
          <div style={{ position: "absolute", left: 140, top: 1080, width: 800, height: 160, background: "#FFF", borderRadius: 30, boxShadow: shadow, border: `2.5px solid ${C.orange}`, display: "flex", alignItems: "center", gap: 24, padding: "0 34px", boxSizing: "border-box", ...popStyle(t, A.fertig - 0.1, 24, 0.6) }}>
            <div style={{ width: 96, height: 96, borderRadius: 24, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateX(${t > A.auto - 0.1 ? Math.sin((t - A.auto) * 12) * 3 : 0}px)` }}><Ico d={CAR} size={64} color={C.orange} sw={1.8} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 38, color: C.ink, whiteSpace: "nowrap" }}>Fertig, bevor du</div>
              <div style={{ fontFamily: fonts.bold, fontSize: 38, color: C.ink, whiteSpace: "nowrap" }}>am Auto bist</div>
            </div>
            {t > A.auto - 0.1 ? <div style={popStyle(t, A.auto - 0.1, 10, 0.5)}><BigTag text="2 MIN" bg={C.orange} size={48} /></div> : null}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- split: step 1, "+" -> "Add files or photos", photo of the bill, Claude reads date / restaurant / amounts ----------
const MENU = [
  { d: I.clip, label: "Add files or photos" },
  { d: I.cam, label: "Take a screenshot" },
  { d: I.drive, label: "Add from Google Drive" },
];
const READ = [
  { k: "DATUM", v: "21.10.2026 · 13:42", hl: "d" },
  { k: "RESTAURANT", v: "Trattoria Da Marco, Köln", hl: "r" },
  { k: "SPEISEN 7 %", v: "214,00 €", hl: "b" },
  { k: "GETRÄNKE 19 %", v: "106,00 €", hl: "b" },
  { k: "BRUTTO", v: "320,00 €", hl: "b" },
  { k: "DARIN MWST", v: "30,92 €", hl: "b" },
];
const SceneStep1: React.FC<{ t: number }> = ({ t }) => {
  const s0 = A.schritt0;
  const plusClick = A.fotografierst - 0.05, itemClick = A.tisch - 0.1;
  const filesAt = itemClick + 0.15;
  const send = A.claude1 - 0.12;
  const sent = t > send + 0.05;
  const menu = t > plusClick && t < itemClick + 0.12;
  const menuP = k(t, plusClick, 0.18);
  const OX = 50, OY = 140;
  const hl = (c: string) => (c === "d" ? t > A.datum - 0.05 : c === "r" ? t > A.restaurant0 - 0.05 : t > A.betrag - 0.05);
  const PROMPT = "Bewirtungsbeleg, bitte.";
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, s0 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 1 · Foto am Tisch" dot={C.orange} size={30} /></div>
      <ClaudeWin title={sent ? "Bewirtung Müller GmbH" : "Neuer Chat"} style={{ left: OX, top: OY, width: 980, height: 650, ...popStyle(t, s0 + 0.02, 20, 0.88) }}>
        {!sent ? (
          <>
            <Composer w={860} h={250} text={t > filesAt + 0.1 ? typed(PROMPT, t, filesAt + 0.1, send - 0.1) : ""} caret={t > filesAt && Math.floor(t * 3) % 2 === 0} plusOn={menu} sendOn={t > filesAt + 0.2}
              file={t > filesAt ? (
                <div style={{ display: "flex", gap: 12, alignItems: "center", ...popStyle(t, filesAt, 8, 0.5) }}>
                  <div style={{ width: 70, height: 84, borderRadius: 10, background: "#EFEBE3", border: `1.5px solid ${CL.border}`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 14, top: 8, width: 42, height: 66, background: "#FFFDF8", borderRadius: 3, transform: "rotate(-5deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }} />
                  </div>
                  <FileChip name="IMG_4471.jpg" meta="FOTO · RECHNUNG" size={0.85} />
                </div>) : null}
              fs={26} style={{ left: 60, top: 320 }} />
            {menu ? (
              <div style={{ position: "absolute", left: 60, top: 70, width: 470, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 18, boxShadow: "0 22px 46px rgba(20,20,20,0.14)", padding: 8, opacity: menuP, transform: `translateY(${(1 - menuP) * 14}px)` }}>
                {MENU.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 62, padding: "0 16px", borderRadius: 12, background: i === 0 && t > itemClick - 0.3 ? CL.hover : "transparent" }}>
                    <Ico d={m.d} size={26} /><span style={{ fontFamily: fonts.medium, fontSize: 23, color: CL.text }}>{m.label}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div style={{ position: "absolute", right: 24, top: 18, display: "flex", alignItems: "center", gap: 10, ...popStyle(t, send + 0.05, 14, 0.85) }}>
              <Tag text="1 FOTO" color={C.ink} size={16} />
              <div style={{ background: CL.bubble, borderRadius: 18, padding: "10px 18px", fontFamily: fonts.medium, fontSize: 22, color: CL.text }}>{PROMPT}</div>
            </div>
            <div style={{ position: "absolute", left: 24, top: 96, right: 24, display: "flex", gap: 14 }}>
              <ClaudeMark size={30} />
              <div style={{ flex: 1, border: `1.5px solid ${CL.border}`, borderRadius: 14, overflow: "hidden", background: "#FFF" }}>
                {READ.map((r, i) => {
                  const a = A.liest + 0.05 + i * 0.1, on = hl(r.hl);
                  return t > a ? (
                    <div key={i} style={{ display: "flex", alignItems: "center", height: 74, borderBottom: i < READ.length - 1 ? `1px solid ${CL.border}` : "none", background: on ? "rgba(217,119,87,0.10)" : "transparent", ...popStyle(t, a, 8, 0.9) }}>
                      <div style={{ width: 290, height: "100%", display: "flex", alignItems: "center", paddingLeft: 18, fontFamily: MONO, fontWeight: 800, fontSize: 18, letterSpacing: "0.08em", color: on ? "#FFF" : CL.sub, background: on ? C.orange : CL.page, whiteSpace: "nowrap" }}>{r.k}</div>
                      <div style={{ flex: 1, paddingLeft: 22, fontFamily: r.hl === "r" ? fonts.semibold : MONO, fontWeight: r.k === "BRUTTO" ? 800 : 600, fontSize: r.k === "BRUTTO" ? 30 : 25, color: CL.text, whiteSpace: "nowrap" }}>{r.v}</div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </>
        )}
      </ClaudeWin>
      <Pointer t={t} path={[
        { x: 760, y: 800, at: s0 + 0.1 },
        { x: OX + 60 + 26 + 24, y: OY + 58 + 320 + 250 - 18 - 24, at: plusClick, click: true },
        { x: OX + 60 + 140, y: OY + 58 + 70 + 8 + 31, at: itemClick, click: true },
        { x: OX + 60 + 860 - 22 - 26, y: OY + 58 + 320 + 250 - 18 - 26, at: send, click: true },
        { x: 880, y: 780, at: send + 0.6 },
      ]} />
    </>
  );
};

// ---------- split: step 2, the calendar entry -> participants + occasion typed into the receipt ----------
const SceneStep2: React.FC<{ t: number }> = ({ t }) => {
  const s1 = A.schritt1;
  const wemOn = t > A.wem - 0.1, worumOn = t > A.worum - 0.1;
  const field = (label: string, text: string, a: number, b: number, y: number) => {
    const on = t > a;
    const done = t > b;
    return (
      <div style={{ marginTop: y }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 16, letterSpacing: "0.1em", color: CL.sub, marginBottom: 8 }}>{label}</div>
        <div style={{ minHeight: 96, border: `2px solid ${done ? C.green : on ? C.orange : CL.border}`, borderRadius: 14, padding: "14px 16px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 10, background: done ? C.greenSoft : "#FFF" }}>
          <span style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 26, color: CL.text, lineHeight: 1.25 }}>{on ? typed(text, t, a, b) : ""}{on && !done && Math.floor(t * 4) % 2 === 0 ? "|" : ""}</span>
          {done ? <span style={{ width: 38, height: 38, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...popStyle(t, b, 4, 0.5) }}><Check size={22} /></span> : null}
        </div>
      </div>
    );
  };
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, s1 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 2 · Kalender lesen" dot={C.orange} size={30} /></div>
      <Card style={{ left: 50, top: 150, width: 450, height: 620, padding: "22px 24px", boxSizing: "border-box", transform: "rotate(-1.2deg)", ...popStyle(t, s1 + 0.05, 24, 0.85) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 70, height: 76, borderRadius: 14, background: C.orangeSoft, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 15, color: C.orange }}>MI</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: C.ink, lineHeight: 1 }}>21</span>
          </div>
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 28, color: C.ink }}>Kalender</div>
            <div style={{ fontFamily: MONO, fontSize: 16, color: C.dim, letterSpacing: "0.08em" }}>OKTOBER 2026</div>
          </div>
        </div>
        <div style={{ marginTop: 18, borderLeft: `6px solid ${C.orange}`, background: "#FBF7F2", borderRadius: 12, padding: "16px 18px", ...popStyle(t, A.kalender - 0.1, 12, 0.8) }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.orange }}>12:30 – 14:00</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 29, color: C.ink, marginTop: 4, lineHeight: 1.15 }}>Mittagessen Müller GmbH</div>
          <div style={{ fontFamily: fonts.medium, fontSize: 20, color: C.dim, marginTop: 4 }}>Trattoria Da Marco, Köln</div>
        </div>
        <div style={{ marginTop: 16, fontFamily: MONO, fontWeight: 800, fontSize: 15, letterSpacing: "0.1em", color: C.dim }}>TEILNEHMER</div>
        <div style={{ marginTop: 6, borderRadius: 12, padding: "8px 12px", margin: "6px -12px 0", background: wemOn ? C.orangeSoft : "transparent", border: `3px solid ${wemOn ? C.orange : "transparent"}`, transform: wemOn ? `scale(${1 + 0.03 * pop(t, A.wem - 0.1, 0.3)})` : undefined }}>
          {["Thomas Müller · Müller GmbH", "Du · Gastgeber"].map((n, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, height: 40 }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: i ? C.ink : C.blue, color: "#FFF", fontFamily: fonts.bold, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>{i ? "DU" : "TM"}</span>
              <span style={{ fontFamily: fonts.semibold, fontSize: 21, color: C.ink, whiteSpace: "nowrap" }}>{n}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontFamily: MONO, fontWeight: 800, fontSize: 15, letterSpacing: "0.1em", color: C.dim }}>NOTIZ</div>
        <div style={{ borderRadius: 12, padding: "8px 12px", margin: "6px -12px 0", background: worumOn ? C.orangeSoft : "transparent", border: `3px solid ${worumOn ? C.orange : "transparent"}`, fontFamily: fonts.semibold, fontSize: 22, color: C.ink, lineHeight: 1.3, transform: worumOn ? `scale(${1 + 0.03 * pop(t, A.worum - 0.1, 0.3)})` : undefined }}>Angebot Relaunch Website besprechen</div>
      </Card>
      {t > A.kalender - 0.05 ? (
        <ClaudeWin title="Bewirtungsbeleg" style={{ left: 530, top: 140, width: 500, height: 650, ...popStyle(t, A.kalender - 0.05, 20, 0.85) }}>
          <div style={{ padding: "16px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ClaudeMark size={28} />
              <span style={{ fontFamily: fonts.medium, fontSize: 20, color: CL.sub, whiteSpace: "nowrap" }}>{wemOn ? "Termin gefunden · 21.10. 12:30" : "Suche Termin am 21.10. …"}</span>
            </div>
            {field("TEILNEHMER", "Thomas Müller (Müller GmbH), du als Gastgeber", A.teilnehmer - 0.1, A.teilnehmer + 0.55, 22)}
            {field("ANLASS", "Angebot Relaunch Website besprochen", A.anlass - 0.05, A.anlass + 0.6, 22)}
          </div>
        </ClaudeWin>
      ) : null}
      <Pointer t={t} path={[{ x: 760, y: 820, at: s1 + 0.1 }, { x: 330, y: 520, at: A.wem - 0.05, click: true }, { x: 330, y: 700, at: A.worum - 0.05, click: true }, { x: 820, y: 640, at: A.daraus + 0.2 }]} />
    </>
  );
};

// ---------- full: the trick (light, orange tile with "250 €") ----------
const FullTrick: React.FC<{ t: number }> = ({ t }) => {
  const a = A.jetzt - 0.25;
  const grow = k(t, a, 0.55, Easing.out(Easing.back(1.5)));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightBg t={t} glow="rgba(217,119,87,0.28)" />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * k(t, a, 1.4)})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 540 - 210, top: 640, width: 420, height: 420, borderRadius: 104, background: `linear-gradient(145deg, #E68E6E, ${C.orange} 55%, #C25E3D)`, boxShadow: "0 40px 90px rgba(217,119,87,0.45), inset 0 2px 0 rgba(255,255,255,0.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${0.3 + 0.7 * grow}) rotate(${(1 - grow) * -20 + Math.sin(t * 2) * 2.5}deg)` }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 132, color: "#FFF", lineHeight: 1 }}>250</span>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 70, color: "#FFF", lineHeight: 1.1 }}>€</span>
        </div>
        {Array.from({ length: 14 }, (_, i) => {
          const b = a + 0.12 + i * 0.03, r = 300 + 300 * k(t, b, 0.6), ang = i * 0.449 + 0.2;
          return t > b ? <div key={i} style={{ position: "absolute", left: 540 + Math.cos(ang) * r - 9, top: 850 + Math.sin(ang) * r - 9, width: 18, height: 18, borderRadius: 5, background: i % 3 === 0 ? C.ink : C.orange, transform: `rotate(${45 + i * 20}deg)`, opacity: 1 - k(t, b + 0.45, 0.3) }} /> : null;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center", ...popStyle(t, a, 14, 0.3) }}>
        <BigTag text="JETZT DER TRICK" bg={C.ink} size={70} style={{ transform: `scale(${interpolate(t - a, [0, 0.16], [2.2, 1], clamp)}) rotate(-3deg) translateX(${shakeAt(t, A.trick, 8)}px)` }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- split: step 3, over 250 € the firm name must be on the bill; missing -> Claude drafts the mail ----------
const MAIL = "Hallo, bitte stellt die Rechnung Nr. 4471 vom 21.10. auf Muster GmbH, Hauptstr. 1, 50667 Köln aus. Danke!";
const SceneStep3: React.FC<{ t: number }> = ({ t }) => {
  const s2 = A.schritt2;
  const over = t > A.zweihundert - 0.1;
  const miss = t > A.fehlt - 0.1;
  const sendClick = A.richtige + 0.15;
  const done = t > sendClick + 0.1;
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, s2 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 3 · Die 250-€-Regel" dot={C.orange} size={30} /></div>
      {over ? <div style={{ position: "absolute", right: 50, top: 58, ...popStyle(t, A.zweihundert - 0.1, 10, 0.6) }}><Tag text="R 4.10 ABS. 8 ESTR" color={C.ink} size={22} /></div> : null}
      <div style={{ position: "absolute", left: 50, top: 150, width: 450, height: 620, background: "#FFFDF8", borderRadius: 14, boxShadow: shadow, padding: "26px 30px", boxSizing: "border-box", transform: "rotate(-2deg)", ...popStyle(t, s2 + 0.02, 24, 0.85) }}>
        <div style={{ fontFamily: SERIF, fontSize: 38, color: C.ink, lineHeight: 1.1 }}>Trattoria Da Marco</div>
        <div style={{ fontFamily: MONO, fontSize: 15, color: C.dim, letterSpacing: "0.08em", marginTop: 4 }}>RECHNUNG NR. 4471 · 21.10.2026</div>
        <div style={{ height: 2, background: C.line, margin: "18px 0" }} />
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 16, letterSpacing: "0.1em", color: miss ? C.red : C.dim }}>RECHNUNG AN</div>
        <div style={{ marginTop: 10, height: 120, borderRadius: 12, border: `3px ${miss ? "solid" : "dashed"} ${miss ? C.red : "#D8D3C9"}`, background: miss ? C.redSoft : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transform: `translateX(${shakeAt(t, A.fehlt, 7)}px) scale(${miss ? 1 + 0.04 * pop(t, A.fehlt - 0.1, 0.3) : 1})` }}>
          {miss ? <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: C.red, letterSpacing: "0.08em", ...popStyle(t, A.fehlt - 0.1, 6, 0.5) }}>FIRMENNAME FEHLT</span> : <span style={{ fontFamily: MONO, fontSize: 22, color: "#C9C3B8" }}>– leer –</span>}
        </div>
        <div style={{ height: 2, background: C.line, margin: "22px 0 12px" }} />
        <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontWeight: 800, color: C.ink }}>
          <span style={{ fontSize: 26, flex: 1 }}>SUMME</span>
          <span style={{ fontSize: 38 }}>320,00 €</span>
        </div>
        {over ? (
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, ...popStyle(t, A.zweihundert - 0.1, 10, 0.6) }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: "#FFF", background: C.orange, borderRadius: 12, padding: "8px 14px", whiteSpace: "nowrap" }}>320 € &gt; 250 €</span>
            <span style={{ fontFamily: fonts.semibold, fontSize: 21, color: C.ink, lineHeight: 1.2 }}>Name muss<br />drauf</span>
          </div>
        ) : null}
      </div>
      {t > A.merkt - 0.15 ? (
        <ClaudeWin title="Mail an Trattoria" style={{ left: 530, top: 140, width: 500, height: 650, ...popStyle(t, A.merkt - 0.15, 20, 0.85) }}>
          <div style={{ padding: "16px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ClaudeMark size={28} /><span style={{ fontFamily: fonts.medium, fontSize: 20, color: CL.sub, whiteSpace: "nowrap" }}>Firmenname fehlt. Mail ist fertig:</span></div>
            <div style={{ marginTop: 14, border: `1.5px solid ${CL.border}`, borderRadius: 14, overflow: "hidden", background: "#FFF" }}>
              {[["AN", "info@damarco-koeln.de"], ["BETREFF", "Rechnung Nr. 4471"]].map(([k2, v], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", height: 56, borderBottom: `1px solid ${CL.border}`, padding: "0 16px", gap: 12 }}>
                  <span style={{ width: 92, fontFamily: MONO, fontWeight: 800, fontSize: 15, letterSpacing: "0.08em", color: CL.sub }}>{k2}</span>
                  <span style={{ fontFamily: fonts.semibold, fontSize: 20, color: CL.text, whiteSpace: "nowrap" }}>{v}</span>
                </div>
              ))}
              <div style={{ padding: "16px 16px", height: 250, boxSizing: "border-box", fontFamily: fonts.medium, fontSize: 23, color: CL.text, lineHeight: 1.4 }}>
                {typed(MAIL, t, A.restaurant1 - 0.1, A.richtige)}{t < A.richtige && Math.floor(t * 4) % 2 === 0 ? "|" : ""}
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: done ? C.green : CL.send, color: "#FFF", borderRadius: 14, padding: "12px 24px", fontFamily: fonts.bold, fontSize: 24, transform: `scale(${t > sendClick && t < sendClick + 0.2 ? 0.94 : 1})` }}>
                {done ? <Check size={22} /> : <Ico d="M4 12l16-8-6 16-2.5-6.5z" size={22} color="#FFF" sw={2} />}{done ? "Gesendet" : "Senden"}
              </div>
            </div>
          </div>
        </ClaudeWin>
      ) : null}
      <Stamp t={t} at={sendClick + 0.15} text="ANGEFORDERT ✓" color={C.green} size={40} rot={-6} style={{ left: 90, top: 660 }} />
      <Pointer t={t} path={[{ x: 760, y: 820, at: s2 + 0.1 }, { x: 330, y: 610, at: A.zweihundert, click: true }, { x: 270, y: 440, at: A.fehlt - 0.05, click: true }, { x: 900, y: 790, at: sendClick, click: true }, { x: 820, y: 700, at: sendClick + 0.6 }]} />
    </>
  );
};

// ---------- full: the finished Bewirtungsbeleg, you only sign ----------
const SIG = "M20 70 C 40 20, 60 20, 62 60 S 80 95, 100 50 S 130 10, 140 55 C 146 80, 160 80, 175 45 C 185 25, 200 30, 198 60 C 196 85, 215 80, 235 50 L 300 58";
const FullSigned: React.FC<{ t: number }> = ({ t }) => {
  const from = A.ende - 0.12;
  const zoom = 1 + 0.035 * k(t, from, 3, Easing.inOut(Easing.sin));
  const draw = k(t, A.unterschreibst - 0.05, 0.85, Easing.inOut(Easing.cubic));
  const signed = draw > 0.98;
  const rows = [["Tag", "21.10.2026"], ["Ort", "Trattoria Da Marco, Köln"], ["Teilnehmer", "Thomas Müller (Müller GmbH), du"], ["Anlass", "Angebot Relaunch Website"], ["Betrag", "320,00 € brutto"]];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightBg t={t} glow="rgba(30,158,87,0.14)" />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", ...popStyle(t, from, 10, 0.8) }}><LabelChip text="Fertig für die Buchhaltung" dot={C.green} size={32} /></div>
        <Receipt w={220} title="DA MARCO" amount="320,00" style={{ left: 740, top: 250, transform: "rotate(9deg)", ...popStyle(t, from + 0.1, 20, 0.7) }} />
        <div style={{ position: "absolute", left: 80, top: 330, width: 820, height: 1000, background: "#FFF", borderRadius: 20, boxShadow: shadow, border: `1px solid ${CL.border}`, padding: "40px 46px", boxSizing: "border-box", transform: "rotate(-1deg)", ...popStyle(t, from + 0.04, 30, 0.85) }}>
          <div style={{ fontFamily: SERIF, fontSize: 60, color: C.ink, lineHeight: 1 }}>Bewirtungsbeleg</div>
          <div style={{ fontFamily: MONO, fontSize: 17, color: C.dim, letterSpacing: "0.08em", marginTop: 8 }}>NACH § 4 ABS. 5 SATZ 1 NR. 2 ESTG</div>
          <div style={{ height: 2, background: C.line, margin: "24px 0 4px" }} />
          {rows.map(([k2, v], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", height: 84, borderBottom: `1px solid ${C.line}`, ...popStyle(t, from + 0.15 + i * 0.07, 8, 0.9) }}>
              <span style={{ width: 200, fontFamily: MONO, fontWeight: 800, fontSize: 18, letterSpacing: "0.08em", color: C.dim }}>{k2.toUpperCase()}</span>
              <span style={{ fontFamily: fonts.semibold, fontSize: 27, color: C.ink, whiteSpace: "nowrap" }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 22, background: C.greenSoft, borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", ...popStyle(t, from + 0.5, 10, 0.8) }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 28, color: C.ink, flex: 1 }}>70 % abziehbar</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: C.green }}>202,36 €</span>
          </div>
          <div style={{ position: "absolute", left: 46, right: 46, bottom: 50 }}>
            <svg width={340} height={110} style={{ position: "absolute", left: 10, bottom: 30 }} viewBox="0 0 320 110">
              <path d={SIG} fill="none" stroke="#1B3A8C" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
            </svg>
            <div style={{ height: 2.5, background: C.ink }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: MONO, fontSize: 16, color: C.dim, letterSpacing: "0.08em" }}><span>UNTERSCHRIFT</span><span>KÖLN, 21.10.2026</span></div>
          </div>
        </div>
        {signed ? <Stamp t={t} at={A.unterschreibst + 0.85} text="ABGELEGT ✓" color={C.green} size={44} rot={-8} style={{ left: 560, top: 1150 }} /> : null}
        <Pointer t={t} path={[{ x: 820, y: 1400, at: from + 0.02 }, { x: 150, y: 1180, at: A.unterschreibst - 0.02 }, { x: 420, y: 1170, at: A.unterschreibst + 0.8 }]} size={54} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- end: guide chips (the PDF scroll covers most of it) ----------
const SceneEnd: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 70, top: 60, display: "flex", flexDirection: "column", gap: 22 }}>
      {t > A.prompts - 0.05 ? <div style={popStyle(t, A.prompts - 0.05, 10, 0.6)}><Tag text="✓ PROMPTS" color={C.orange} size={30} /></div> : null}
      {t > A.checkliste - 0.05 ? <div style={popStyle(t, A.checkliste - 0.05, 10, 0.6)}><Tag text="✓ CHECKLISTE" color={C.ink} size={30} /></div> : null}
    </div>
    <div style={{ position: "absolute", left: 780, top: 360, width: 180, height: 180, borderRadius: 46, background: `linear-gradient(145deg, #E68E6E, ${C.orange} 55%, #C25E3D)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px rgba(217,119,87,0.4)", ...popStyle(t, A.prompts - 0.1, 26, 0.3) }}><Ico d={I.doc} size={110} color="#FFF" sw={1.6} /></div>
  </>
);

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }>; full?: boolean };
const SCENES: Scene[] = [
  { from: 0, to: A.mit1 - 0.1, origin: "50% 50%", El: SceneHook },
  { from: A.mit1 - 0.1, to: A.schritt0 - 0.05, origin: "50% 50%", El: FullSolution, full: true },
  { from: A.schritt0 - 0.05, to: A.schritt1 - 0.05, origin: "50% 45%", El: SceneStep1 },
  { from: A.schritt1 - 0.05, to: A.jetzt - 0.25, origin: "50% 45%", El: SceneStep2 },
  { from: A.jetzt - 0.25, to: A.schritt2 - 0.05, origin: "50% 50%", El: FullTrick, full: true },
  { from: A.schritt2 - 0.05, to: A.ende - 0.12, origin: "50% 45%", El: SceneStep3 },
  { from: A.ende - 0.12, to: A.prompts - 0.1, origin: "50% 50%", El: FullSigned, full: true },
  { from: A.prompts - 0.1, to: 999, origin: "50% 45%", El: SceneEnd },
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
  const fs = c.words.reduce((n, w) => n + w.w.length + 1, 0) > 19 ? 40 : 46;
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
// ---------- guide scroll (real PDF pages) ----------
const PAGES = Array.from({ length: 10 }, (_, i) => staticFile(`bewirtung-guide/p${i + 1}.png`));
const PDF = { left: 120, top: 560, w: 840, h: 1220, bar: 76, pw: 780, ph: Math.round((780 * 936) / 662), gap: 26 };
const PITCH = PDF.ph + PDF.gap;
export const PDF_IN = A.prompts - 0.1;
export const PDF_OUT = A.komm - 0.32;
const SCROLL_A = PDF_IN + 0.3, SCROLL_B = PDF_OUT - 0.1;
const SAMPLES = 8, SHUTTER = 0.6 / FPS;
const scrollY = (t: number) => interpolate(t, [SCROLL_A, SCROLL_B], [0, (PAGES.length - 1) * PITCH], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const PdfScroll: React.FC<{ t: number }> = ({ t }) => {
  if (t < PDF_IN || t > PDF_OUT + 0.32) return null;
  const inY = interpolate(t, [PDF_IN, PDF_IN + 0.3], [PDF.h + 700, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const outY = interpolate(t, [PDF_OUT, PDF_OUT + 0.3], [0, PDF.h + 700], { ...clamp, easing: Easing.in(Easing.cubic) });
  const y = scrollY(t);
  const page = Math.min(PAGES.length, Math.max(1, Math.floor((y + (PDF.h - PDF.bar) / 2) / PITCH) + 1));
  const tilt = interpolate(t, [PDF_IN, PDF_IN + 0.3], [-4, 0], clamp) + interpolate(t, [PDF_OUT, PDF_OUT + 0.3], [0, 4], clamp);
  return (
    <div style={{ position: "absolute", left: PDF.left, top: PDF.top, width: PDF.w, height: PDF.h, borderRadius: 26, overflow: "hidden", background: "#E9E7E1", boxShadow: "0 40px 90px rgba(0,0,0,0.45), 0 6px 16px rgba(0,0,0,0.25)", transform: `translateY(${inY + outY}px) rotate(${tilt}deg)`, zIndex: 40 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: PDF.bar, background: C.chip, display: "flex", alignItems: "center", padding: "0 26px", gap: 14, zIndex: 2 }}>
        <PdfIcon size={40} />
        <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: "#FFF", whiteSpace: "nowrap" }}>Bewirtungsbeleg – Guidebook.pdf</div>
        <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 26, color: "#FFF", background: C.orange, borderRadius: 10, padding: "6px 14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{page} / {PAGES.length}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: PDF.bar, bottom: 0, overflow: "hidden" }}>
        {Array.from({ length: SAMPLES }, (_, j) => {
          const yy = scrollY(t - (j / (SAMPLES - 1)) * SHUTTER);
          return (
            <div key={j} style={{ position: "absolute", left: (PDF.w - PDF.pw) / 2, top: 22 - yy, opacity: 1 / (j + 1) }}>
              {PAGES.map((src, i) => <Img key={i} src={src} style={{ position: "absolute", left: 0, top: i * PITCH, width: PDF.pw, height: PDF.ph, borderRadius: 6, boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
// ---------- master ----------
const FOCUS = { x: 0.51, y: 0.598, scale: 1.0 };
const SPLIT_SRC_TOP = 430;
const CTA = A.komm - 0.12;
const CHEST_Y = 1540;
export const BewirtungOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = camera(t, scene.from, Math.min(scene.to, CTA));
  const dx = Math.sin(t * 0.6) * 6, dy = Math.cos(t * 0.45) * 5;
  const full = k(t, CTA, 0.42, Easing.inOut(Easing.cubic));
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTop = Math.min(PH, Math.max(H - vh, PH - SPLIT_SRC_TOP * s)) * (1 - full);
  const avPush = full > 0 ? 1 + 0.05 * k(t, CTA + 0.45, 2.0, Easing.inOut(Easing.sin)) : 1 + 0.035 * Math.abs(Math.sin((t - scene.from) * 0.9));
  const El = scene.El;
  const followed = t > A.folg + 0.25;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${avPush})`, transformOrigin: full > 0 ? "50% 45%" : "50% 40%" }}>
        <OffthreadVideo src={staticFile("render-fpn-bewirtung-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {scene.full ? <El t={t} /> : full < 1 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * full, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
          </div>
          {t < A.mit1 - 0.1 ? <HookPills t={t} /> : null}
        </div>
      ) : null}
      <PdfScroll t={t} />
      {t > A.komm - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.komm - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 26px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>{typed("ESSEN", t, A.trigger - 0.1, A.trigger + 0.3) || " "}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(20,20,20,0.82)", borderRadius: 999, padding: "10px 20px", ...popStyle(t, A.komm + 0.15, 8, 0.6) }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.green }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", color: "#FFF" }}>GUIDE · 10 SEITEN · PER DM</span>
          </div>
          {t > A.folg - 0.08 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#FFF", borderRadius: 999, padding: "12px 14px 12px 26px", boxShadow: "0 12px 26px rgba(0,0,0,0.25)", ...popStyle(t, A.folg - 0.08, 10, 0.6) }}>
              <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: C.ink }}>@florent_preusser</span>
              <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#FFF", background: followed ? C.green : "#3E8EF7", borderRadius: 999, padding: "10px 22px" }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
            </div>
          ) : null}
        </div>
      ) : null}
      <SeamCaption t={t} y={scene.full ? 1610 : PH + (CHEST_Y - PH) * full} />
    </AbsoluteFill>
  );
};
