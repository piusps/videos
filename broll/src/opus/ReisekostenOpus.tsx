import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-reisekosten/captions.json";

// FP-N "Reisekosten" (2026-10-24): Hook = 6 Kundentage, 0 € abgerechnet, Quittungen im Handschuhfach.
// Heller Superkind-Look (weiß/orange), Schritte als claude.ai-Klickpfade mit Mauszeiger, Zeiten an captions.json verankert.

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const RK_END = LAST_END + 0.7;
export const RK_FRAMES = Math.round(RK_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  sechs: at("sechs"), kunden: at("kunden"), keinen: at("keinen"), quittungen0: at("quittungen", 0), hotelrechnung: at("hotelrechnung"), postfach: at("postfach"),
  das: at("das", 0), zweihundert: at("zweihundertfünfzig"), euro0: at("euro", 0), monat1: at("monat", 1), claude0: at("claude", 0), fuenf: at("fünf"),
  schritt0: at("schritt", 0), fotografierst: at("fotografierst"), quittungen1: at("quittungen", 1), kalender0: at("kalender", 0), claude1: at("claude", 1), liest: at("liest"), betrag: at("betrag"), datum: at("datum"), ort: at("ort"),
  schritt1: at("schritt", 1), legt: at("legt"), pauschalen: at("pauschalen"), vierzehn: at("vierzehn"), acht: at("acht"), dreissig: at("dreißig"),
  jetzt: at("jetzt"), trick: at("trick"),
  schritt2: at("schritt", 2), fruehstueck: at("frühstück"), automatisch: at("automatisch"), richtig: at("richtig"), raus: at("raus"),
  ende: at("ende"), tabelle: at("tabelle"), beleg: at("beleg"),
  prompt: at("prompt"), tabelle2: at("pauschalentabelle"), guide: at("guide"), komm: at("kommentiere"), trigger: at("spesen"), folg: at("folg"),
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
// ---------- hook pills (frame 0 = thumbnail): "Spesen 0 €" (struck) / "Mit Claude 264 €" ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const strike = k(t, 0.85, 0.3, Easing.inOut(Easing.cubic));
  const m = k(t, 1.15, 0.35, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 62, padding: "10px 26px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow }}>
        Spesen{" "}
        <span style={{ position: "relative", display: "inline-block", color: C.red }}>
          0 €
          <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 9, background: C.ink, borderRadius: 4, transform: `scaleX(${strike})`, transformOrigin: "0% 50%" }} />
        </span>
      </div>
      <div style={{ ...pill, marginTop: -6 }}>
        Mit Claude{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -8, right: -8, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>264 €</span>
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
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M0 0 H${w} V${h - tw * 0.5} ${zig.replace(/L/g, "L")} L0 ${h - tw * 0.5} Z`} fill="#FFFDF8" /></svg>
      <div style={{ position: "absolute", left: w * 0.1, right: w * 0.1, top: w * 0.1 }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: w * 0.1, color: C.ink, whiteSpace: "nowrap", overflow: "hidden" }}>{title}</div>
        {[0.9, 0.6, 0.75, 0.5].map((q, i) => <div key={i} style={{ height: w * 0.035, width: `${q * 100}%`, background: "#E4E0D7", borderRadius: 3, marginTop: w * 0.06 }} />)}
        <div style={{ borderTop: `${Math.max(1, w * 0.01)}px dashed #CFCAC0`, marginTop: w * 0.08, paddingTop: w * 0.05, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 800, fontSize: w * 0.095, color: C.ink }}><span>SUMME</span><span>{amount}</span></div>
      </div>
    </div>
  );
};

// ---------- split hook: 6 customer days in the calendar, 0 € claimed -> receipts in the glovebox, hotel bill in the inbox ----------
const DAYS = [2, 7, 9, 15, 16, 22];
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const thumb = t < 0.04;
  const dayAt = (j: number) => A.sechs + (j * (A.kunden + 0.25 - A.sechs)) / DAYS.length;
  const out = k(t, A.quittungen0 - 0.15, 0.3, Easing.in(Easing.cubic));
  const zero = thumb || t > A.keinen - 0.05;
  return (
    <>
      {out < 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `scale(${1 - 0.1 * out})`, transformOrigin: "50% 60%" }}>
          <Card style={{ left: 60, top: 236, width: 600, height: 540, padding: "22px 26px", boxSizing: "border-box", ...(thumb ? {} : popStyle(t, 0.04, 20, 0.85)) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink }}>Oktober</span>
              <span style={{ fontFamily: MONO, fontSize: 18, color: C.dim, letterSpacing: "0.1em" }}>KALENDER</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 16 }}>
              {["M", "D", "M", "D", "F", "S", "S"].map((d, i) => <div key={i} style={{ fontFamily: MONO, fontSize: 15, color: C.dim, textAlign: "center" }}>{d}</div>)}
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1, j = DAYS.indexOf(day);
                const on = j >= 0 && (thumb || t > dayAt(j));
                return (
                  <div key={i} style={{ gridColumnStart: i === 0 ? 4 : undefined, height: 70, borderRadius: 12, background: on ? C.orange : "#F4F2ED", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: on && !thumb ? `scale(${0.6 + 0.4 * Math.min(1, pop(t, dayAt(j), 0.32))})` : undefined }}>
                    <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: on ? "#FFF" : C.ink }}>{day}</span>
                    {on ? <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 11, color: "#FFF", letterSpacing: "0.08em" }}>KUNDE</span> : null}
                  </div>
                );
              })}
            </div>
          </Card>
          <Card style={{ left: 690, top: 270, width: 330, height: 250, padding: 26, boxSizing: "border-box", ...(thumb ? {} : popStyle(t, A.sechs, 20, 0.7)) }}>
            <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: "0.1em", color: C.dim }}>TAGE UNTERWEGS</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 92, color: C.ink, lineHeight: 1.1 }}>{thumb ? 6 : DAYS.filter((_, j) => t > dayAt(j)).length}</div>
          </Card>
          <Card style={{ left: 690, top: 540, width: 330, height: 236, padding: 26, boxSizing: "border-box", border: zero ? `3px solid ${C.red}` : "3px solid transparent", transform: `translateX(${shakeAt(t, A.keinen, 8)}px)`, ...(thumb ? {} : popStyle(t, A.keinen - 0.25, 20, 0.7)) }}>
            <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: "0.1em", color: C.dim }}>ABGERECHNET</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 92, color: zero ? C.red : C.line, lineHeight: 1.1 }}>0 €</div>
          </Card>
        </div>
      ) : null}
      {t > A.quittungen0 - 0.15 ? (
        <>
          <div style={{ position: "absolute", left: 50, top: 250, width: 470, height: 520, borderRadius: 28, background: "linear-gradient(180deg, #2A2826, #1A1918)", boxShadow: "inset 0 10px 30px rgba(0,0,0,0.5), 0 24px 50px rgba(20,20,20,0.18)", overflow: "hidden", ...popStyle(t, A.quittungen0 - 0.15, 30, 0.7) }}>
            <div style={{ position: "absolute", left: 24, top: 22 }}><Tag text="HANDSCHUHFACH" color={C.orange} size={18} /></div>
            {[["PARKHAUS", "12,00"], ["DB", "89,90"], ["TAXI", "18,40"], ["PARKEN", "9,50"], ["HOTEL", "112,50"]].map(([n, a], i) => {
              const b = A.quittungen0 + i * 0.12;
              const p = pop(t, b, 0.45);
              return t > b ? <Receipt key={i} w={170} title={n} amount={a} style={{ left: 40 + (i % 3) * 120, top: 300 - (1 - Math.min(p, 1)) * 260 + Math.floor(i / 3) * 60 - (i % 2) * 30, transform: `rotate(${(rnd(i, 3) - 0.5) * 34}deg)` }} /> : null;
            })}
          </div>
          <Card style={{ left: 550, top: 250, width: 480, height: 520, overflow: "hidden", ...popStyle(t, A.hotelrechnung - 0.2, 30, 0.7) }}>
            <div style={{ height: 66, display: "flex", alignItems: "center", gap: 12, padding: "0 22px", borderBottom: `1px solid ${C.line}` }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 28, color: C.ink }}>Posteingang</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 18, color: "#FFF", background: C.red, borderRadius: 999, padding: "4px 12px" }}>284</span>
            </div>
            {[
              { f: "Newsletter", s: "Die besten Deals im Herbst" },
              { f: "Lieferant Meyer", s: "AW: Angebot Nr. 4471" },
              { f: "Hotel Adler Hamburg", s: "Ihre Rechnung · 112,50 €", hot: true },
              { f: "LinkedIn", s: "Du hast 9 neue Benachrichtigungen" },
              { f: "Steuerbüro Roth", s: "Fehlende Belege Oktober" },
              { f: "Kunde Vogt", s: "Termin nächste Woche?" },
            ].map((m, i) => {
              const hot = m.hot && t > A.hotelrechnung + 0.1;
              return (
                <div key={i} style={{ height: 74, display: "flex", alignItems: "center", gap: 14, padding: "0 22px", borderBottom: `1px solid ${C.line}`, background: hot ? C.orangeSoft : "transparent", transform: hot ? `scale(${1 + 0.04 * pop(t, A.hotelrechnung + 0.1, 0.3)})` : undefined }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: m.hot ? C.orange : "#3E8EF7", flexShrink: 0 }} />
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontFamily: fonts.bold, fontSize: 21, color: C.ink, whiteSpace: "nowrap" }}>{m.f}</div>
                    <div style={{ fontFamily: fonts.medium, fontSize: 18, color: C.dim, whiteSpace: "nowrap" }}>{m.s}</div>
                  </div>
                  {m.hot ? <span style={{ marginLeft: "auto" }}><Ico d={I.clip} size={24} color={C.orange} /></span> : null}
                </div>
              );
            })}
          </Card>
        </>
      ) : null}
    </>
  );
};

// ---------- full: what you leave on the table each month, Claude does it in 5 minutes ----------
const FullMoney: React.FC<{ t: number }> = ({ t }) => {
  const from = A.das - 0.1;
  const sum = Math.round(interpolate(t, [A.zweihundert - 0.1, A.euro0 + 0.2], [0, 264], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const zoom = 1 + 0.04 * k(t, from, 3, Easing.inOut(Easing.sin));
  const row = (a: number, l: string, r: string, y: number) => (t > a ? (
    <div style={{ position: "absolute", left: 110, top: y, width: 860, height: 120, background: "#FFF", borderRadius: 24, boxShadow: shadow, border: `1px solid ${CL.border}`, display: "flex", alignItems: "center", padding: "0 34px", boxSizing: "border-box", ...popStyle(t, a, 16, 0.75) }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 38, color: C.ink, flex: 1, whiteSpace: "nowrap" }}>{l}</span>
      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 46, color: C.orange }}>{r}</span>
    </div>) : null);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightBg t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", ...popStyle(t, from, 10, 0.8) }}><LabelChip text="Das bleibt jeden Monat liegen" dot={C.red} size={32} /></div>
        {row(from + 0.1, "6 Tage × 14 €", "84 €", 380)}
        {row(from + 0.35, "600 km × 0,30 €", "180 €", 524)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", flexDirection: "column", alignItems: "center", ...popStyle(t, A.zweihundert - 0.15, 20, 0.6) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 210, color: C.ink, fontVariantNumeric: "tabular-nums", lineHeight: 1, transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - A.euro0 - 0.2) / 0.2)})` }}>{eur(sum)}</div>
          <div style={{ marginTop: 14, opacity: k(t, A.monat1 - 0.05, 0.2) }}><Tag text="PRO MONAT · 3.168 € IM JAHR" color={C.red} size={28} /></div>
        </div>
        {t > A.claude0 - 0.1 ? (
          <div style={{ position: "absolute", left: 140, top: 1150, width: 800, height: 170, background: "#FFF", borderRadius: 30, boxShadow: shadow, border: `2.5px solid ${C.orange}`, display: "flex", alignItems: "center", gap: 26, padding: "0 36px", boxSizing: "border-box", ...popStyle(t, A.claude0 - 0.1, 24, 0.6) }}>
            <ClaudeMark size={84} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 40, color: C.ink, whiteSpace: "nowrap" }}>Claude rechnet ab</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 26, color: C.dim }}>Quittungen + Kalender</div>
            </div>
            {t > A.fuenf - 0.05 ? <div style={popStyle(t, A.fuenf - 0.05, 10, 0.5)}><BigTag text="5 MIN" bg={C.orange} size={48} /></div> : null}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- split: step 1, "+" -> "Add files or photos", receipt photos + calendar, Claude reads amount / date / place ----------
const MENU = [
  { d: I.clip, label: "Add files or photos" },
  { d: I.cam, label: "Take a screenshot" },
  { d: I.drive, label: "Add from Google Drive" },
];
const ROWS1 = [
  { d: "07.10.", o: "Köln", a: "Parkhaus Dom", b: "12,00 €" },
  { d: "15.10.", o: "Hamburg", a: "DB Fernverkehr", b: "89,90 €" },
  { d: "15.10.", o: "Hamburg", a: "Hotel Adler", b: "112,50 €" },
  { d: "16.10.", o: "Hamburg", a: "Taxi Hansa", b: "18,40 €" },
  { d: "22.10.", o: "Münster", a: "Parkhaus Aegidii", b: "9,50 €" },
];
const SceneStep1: React.FC<{ t: number }> = ({ t }) => {
  const s0 = A.schritt0;
  const plusClick = A.fotografierst - 0.05, itemClick = A.quittungen1;
  const filesAt = itemClick + 0.15;
  const calAt = A.kalender0 - 0.1;
  const send = A.claude1 - 0.12;
  const sent = t > send + 0.05;
  const menu = t > plusClick && t < itemClick + 0.12;
  const menuP = k(t, plusClick, 0.18);
  const OX = 50, OY = 140;
  const hl = (col: "b" | "d" | "o") => (col === "b" ? t > A.betrag - 0.05 : col === "d" ? t > A.datum - 0.05 : t > A.ort - 0.05);
  const COLS: { key: "d" | "o" | "a" | "b"; label: string; w: number }[] = [{ key: "d", label: "DATUM", w: 150 }, { key: "o", label: "ORT", w: 180 }, { key: "a", label: "ANBIETER", w: 290 }, { key: "b", label: "BETRAG", w: 220 }];
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, s0 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 1 · Quittungen hochladen" dot={C.orange} size={30} /></div>
      <ClaudeWin title={sent ? "Reisekosten Oktober" : "Neuer Chat"} style={{ left: OX, top: OY, width: 980, height: 650, ...popStyle(t, s0 + 0.02, 20, 0.88) }}>
        {!sent ? (
          <>
            <Composer w={860} h={250} text={t > itemClick + 0.5 ? typed("Mach meine Reisekosten für Oktober.", t, itemClick + 0.5, calAt - 0.1) : ""} caret={t > filesAt && Math.floor(t * 3) % 2 === 0} plusOn={menu} sendOn={t > calAt}
              file={t > filesAt ? (
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {[0, 1, 2, 3, 4].map((i) => (t > filesAt + i * 0.07 ? (
                    <div key={i} style={{ width: 62, height: 74, borderRadius: 10, background: "#EFEBE3", border: `1.5px solid ${CL.border}`, position: "relative", overflow: "hidden", ...popStyle(t, filesAt + i * 0.07, 8, 0.5) }}>
                      <div style={{ position: "absolute", left: 12, top: 8, width: 38, height: 58, background: "#FFFDF8", borderRadius: 3, transform: `rotate(${(rnd(i, 7) - 0.5) * 14}deg)`, boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }} />
                    </div>) : null))}
                  {t > calAt ? <div style={{ marginLeft: 8, ...popStyle(t, calAt, 8, 0.6) }}><FileChip name="Google Calendar" meta="OKTOBER · VERBUNDEN" size={0.85} /></div> : null}
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
              <Tag text="5 FOTOS + KALENDER" color={C.ink} size={16} />
              <div style={{ background: CL.bubble, borderRadius: 18, padding: "10px 18px", fontFamily: fonts.medium, fontSize: 22, color: CL.text }}>Mach meine Reisekosten für Oktober.</div>
            </div>
            <div style={{ position: "absolute", left: 24, top: 96, right: 24, display: "flex", gap: 14 }}>
              <ClaudeMark size={30} />
              <div style={{ flex: 1, border: `1.5px solid ${CL.border}`, borderRadius: 14, overflow: "hidden", background: "#FFF" }}>
                <div style={{ display: "flex", height: 54, background: CL.page, borderBottom: `1.5px solid ${CL.border}` }}>
                  {COLS.map((c) => {
                    const on = c.key !== "a" && hl(c.key as "b" | "d" | "o");
                    return <div key={c.key} style={{ width: c.w, display: "flex", alignItems: "center", paddingLeft: 16, fontFamily: MONO, fontWeight: 800, fontSize: 17, letterSpacing: "0.1em", color: on ? "#FFF" : CL.sub, background: on ? C.orange : "transparent" }}>{c.label}</div>;
                  })}
                </div>
                {ROWS1.map((r, i) => {
                  const a = A.liest + 0.05 + i * 0.12;
                  return t > a ? (
                    <div key={i} style={{ display: "flex", height: 70, borderBottom: `1px solid ${CL.border}`, ...popStyle(t, a, 8, 0.9) }}>
                      {COLS.map((c) => {
                        const on = c.key !== "a" && hl(c.key as "b" | "d" | "o");
                        return <div key={c.key} style={{ width: c.w, display: "flex", alignItems: "center", paddingLeft: 16, fontFamily: c.key === "b" || c.key === "d" ? MONO : fonts.semibold, fontWeight: c.key === "b" ? 800 : 500, fontSize: 23, color: CL.text, background: on ? "rgba(217,119,87,0.10)" : "transparent", whiteSpace: "nowrap" }}>{r[c.key]}</div>;
                      })}
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

// ---------- split: step 2, each trip next to the calendar, hours bar, 14 € above 8 h, 0,30 €/km ----------
const TRIPS = [
  { day: "07", wd: "MI", to: "Köln · Müller GmbH", time: "06:40 – 18:10", h: 11.5, verpf: "14,00 €", km: "192 km × 0,30 €", fahrt: "57,60 €" },
  { day: "15", wd: "DO", to: "Hamburg · Messe, 2 Tage", time: "Anreise + Abreise", h: 24, verpf: "2 × 14,00 €", km: "Bahn + Taxi", fahrt: "Belege" },
  { day: "22", wd: "DO", to: "Münster · Vogt KG", time: "07:30 – 16:50", h: 9.3, verpf: "14,00 €", km: "128 km × 0,30 €", fahrt: "38,40 €" },
];
const SceneStep2: React.FC<{ t: number }> = ({ t }) => {
  const s1 = A.schritt1;
  const tripAt = (i: number) => A.legt + i * 0.22;
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, s1 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 2 · Pauschalen rechnen" dot={C.orange} size={30} /></div>
      {t > A.vierzehn - 0.05 ? <div style={{ position: "absolute", right: 50, top: 58, ...popStyle(t, A.vierzehn - 0.05, 10, 0.6) }}><Tag text="§ 9 ABS. 4A ESTG" color={C.ink} size={22} /></div> : null}
      <ClaudeWin title="Reisekosten Oktober" style={{ left: 50, top: 140, width: 980, height: 650, ...popStyle(t, s1 + 0.02, 20, 0.88) }}>
        <div style={{ position: "absolute", left: 22, right: 22, top: 18 }}>
          {TRIPS.map((r, i) => {
            const a = tripAt(i);
            if (t < a) return null;
            const fill = k(t, a + 0.1, 0.5, Easing.out(Easing.cubic));
            const over8 = t > A.acht + 0.05 + i * 0.1;
            const v = t > A.vierzehn + i * 0.12;
            const kmOn = t > A.dreissig + i * 0.15;
            return (
              <div key={i} style={{ height: 184, marginBottom: 12, background: "#FFF", border: `1.5px solid ${over8 ? C.green : CL.border}`, borderRadius: 18, display: "flex", alignItems: "center", gap: 20, padding: "0 22px", boxSizing: "border-box", ...popStyle(t, a, 14, 0.85) }}>
                <div style={{ width: 92, height: 110, borderRadius: 16, background: C.orangeSoft, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 18, color: C.orange }}>{r.wd}</span>
                  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 46, color: C.ink, lineHeight: 1 }}>{r.day}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: fonts.bold, fontSize: 27, color: CL.text, whiteSpace: "nowrap" }}>{r.to}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                    <div style={{ width: 260, height: 16, borderRadius: 8, background: "#EEEAE2", overflow: "hidden" }}><div style={{ width: `${Math.min(1, r.h / 12) * 100 * fill}%`, height: "100%", background: over8 ? C.green : C.orange, borderRadius: 8 }} /></div>
                    <span style={{ fontFamily: MONO, fontSize: 19, color: CL.sub, whiteSpace: "nowrap" }}>{r.time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, height: 34 }}>
                    {over8 ? <div style={popStyle(t, A.acht + 0.05 + i * 0.1, 6, 0.6)}><StatusPill ok text={r.h >= 24 ? "MEHRTÄGIG" : `${r.h.toLocaleString("de-DE")} H > 8 H`} /></div> : null}
                    {kmOn ? <span style={{ fontFamily: MONO, fontSize: 19, color: CL.text, whiteSpace: "nowrap", ...popStyle(t, A.dreissig + i * 0.15, 6, 0.7) }}>{r.km}</span> : null}
                  </div>
                </div>
                <div style={{ width: 190, textAlign: "right" }}>
                  <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: "0.1em", color: CL.sub }}>VERPFLEGUNG</div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: v ? C.green : C.line, whiteSpace: "nowrap", transform: `scale(${v ? 0.8 + 0.2 * Math.min(1, pop(t, A.vierzehn + i * 0.12, 0.3)) : 1})`, transformOrigin: "100% 50%" }}>{v ? r.verpf : "–"}</div>
                  <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: "0.1em", color: CL.sub, marginTop: 8 }}>FAHRT</div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: kmOn ? C.orange : C.line, whiteSpace: "nowrap" }}>{kmOn ? r.fahrt : "–"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </ClaudeWin>
    </>
  );
};

// ---------- full: the trick (light, orange tile with a coffee cup) ----------
const CUP = "M4.5 9.5h11v4.5a5 5 0 01-5 5h-1a5 5 0 01-5-5zM15.5 10.5h1.5a2.5 2.5 0 010 5h-1.8M8 3.5c0 1.4 1.4 1.4 1.4 2.8M11.5 3.5c0 1.4 1.4 1.4 1.4 2.8M3 21h15";
const FullTrick: React.FC<{ t: number }> = ({ t }) => {
  const a = A.jetzt - 0.25;
  const grow = k(t, a, 0.55, Easing.out(Easing.back(1.5)));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightBg t={t} glow="rgba(217,119,87,0.28)" />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * k(t, a, 1.4)})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 540 - 210, top: 640, width: 420, height: 420, borderRadius: 104, background: `linear-gradient(145deg, #E68E6E, ${C.orange} 55%, #C25E3D)`, boxShadow: "0 40px 90px rgba(217,119,87,0.45), inset 0 2px 0 rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.3 + 0.7 * grow}) rotate(${(1 - grow) * -20 + Math.sin(t * 2) * 2.5}deg)` }}>
          <Ico d={CUP} size={250} color="#FFF" sw={1.5} />
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

// ---------- split: step 3, the hotel bill with breakfast, Claude deducts it correctly ----------
const SceneStep3: React.FC<{ t: number }> = ({ t }) => {
  const s2 = A.schritt2;
  const hot = t > A.fruehstueck - 0.1;
  const cut = t > A.automatisch - 0.1;
  const res = t > A.richtig - 0.1;
  const line = (l: string, v: string, a: number, color = CL.text, strike = -1) => (t > a ? (
    <div style={{ display: "flex", alignItems: "center", height: 72, borderBottom: `1px solid ${CL.border}`, ...popStyle(t, a, 10, 0.85) }}>
      <span style={{ fontFamily: fonts.medium, fontSize: 24, color: CL.text, flex: 1, whiteSpace: "nowrap" }}>{l}</span>
      <span style={{ position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 28, color, whiteSpace: "nowrap" }}>
        {v}
        {strike > 0 ? <span style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 4, background: C.red, transform: `scaleX(${k(t, strike, 0.25)})`, transformOrigin: "0% 50%" }} /> : null}
      </span>
    </div>) : null);
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, s2 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 3 · Frühstück rausrechnen" dot={C.orange} size={30} /></div>
      <div style={{ position: "absolute", left: 50, top: 150, width: 440, height: 600, background: "#FFFDF8", borderRadius: 14, boxShadow: shadow, padding: "28px 30px", boxSizing: "border-box", transform: `rotate(-2deg)`, ...popStyle(t, s2 + 0.02, 24, 0.85) }}>
        <div style={{ fontFamily: SERIF, fontSize: 38, color: C.ink }}>Hotel Adler</div>
        <div style={{ fontFamily: MONO, fontSize: 16, color: C.dim, letterSpacing: "0.1em" }}>HAMBURG · RECHNUNG 2291</div>
        <div style={{ height: 2, background: C.line, margin: "20px 0" }} />
        {[
          { l: "Übernachtung 15.10.", v: "98,00 €" },
          { l: "Frühstück", v: "14,50 €", b: true },
          { l: "City-Tax", v: "0,00 €" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", height: 70, margin: "0 -12px", padding: "0 12px", borderRadius: 10, background: r.b && hot ? C.orangeSoft : "transparent", border: r.b && hot ? `3px solid ${C.orange}` : "3px solid transparent", transform: r.b && hot ? `scale(${1 + 0.05 * pop(t, A.fruehstueck - 0.1, 0.3)})` : undefined }}>
            <span style={{ fontFamily: fonts.medium, fontSize: 24, color: C.ink, flex: 1 }}>{r.l}</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 25, color: C.ink }}>{r.v}</span>
          </div>
        ))}
        <div style={{ height: 2, background: C.ink, margin: "18px 0 10px" }} />
        <div style={{ display: "flex", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: C.ink }}><span style={{ flex: 1 }}>GESAMT</span><span>112,50 €</span></div>
      </div>
      <ClaudeWin title="Verpflegung 16.10." style={{ left: 520, top: 140, width: 510, height: 650, ...popStyle(t, A.fruehstueck - 0.15, 20, 0.85) }}>
        <div style={{ padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><ClaudeMark size={28} /><span style={{ fontFamily: fonts.medium, fontSize: 20, color: CL.sub }}>Frühstück in der Hotelrechnung gefunden</span></div>
          {line("Abreisetag", "14,00 €", A.fruehstueck + 0.05)}
          {line("− Frühstück", "− 5,60 €", A.automatisch - 0.1, C.red)}
          {cut ? <div style={{ fontFamily: MONO, fontSize: 16, color: CL.sub, letterSpacing: "0.06em", marginTop: 8, ...popStyle(t, A.automatisch, 6, 0.8) }}>20 % VON 28 € (§ 9 ABS. 4A S. 8 ESTG)</div> : null}
          {res ? (
            <div style={{ marginTop: 22, background: C.greenSoft, borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", ...popStyle(t, A.richtig - 0.1, 10, 0.7) }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 28, color: CL.text, flex: 1 }}>Pauschale</span>
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: C.green }}>8,40 €</span>
            </div>
          ) : null}
          
        </div>
      </ClaudeWin>
      <Stamp t={t} at={A.raus} text="RICHTIG ✓" color={C.green} size={46} rot={-6} style={{ left: 120, top: 640 }} />
      <Pointer t={t} path={[{ x: 760, y: 820, at: s2 + 0.1 }, { x: 300, y: 330, at: A.fruehstueck - 0.05, click: true }, { x: 820, y: 560, at: A.richtig }]} />
    </>
  );
};

// ---------- full: the finished spreadsheet with every receipt behind it ----------
const TROWS = [
  { d: "07.10.", z: "Köln", v: "14,00", f: "57,60", b: "12,00", s: "83,60", n: 1 },
  { d: "15.–16.10.", z: "Hamburg", v: "22,40", f: "108,30", b: "98,00", s: "228,70", n: 3 },
  { d: "22.10.", z: "Münster", v: "14,00", f: "38,40", b: "9,50", s: "61,90", n: 1 },
];
const FullTable: React.FC<{ t: number }> = ({ t }) => {
  const from = A.ende - 0.12;
  const zoom = 1 + 0.035 * k(t, from, 3, Easing.inOut(Easing.sin));
  const clip = t > A.beleg - 0.1;
  const total = Math.round(interpolate(t, [A.tabelle, A.tabelle + 0.5], [0, 374.2], clamp) * 100) / 100;
  const COLS = [{ k: "d", l: "DATUM", w: 175 }, { k: "z", l: "ZIEL", w: 160 }, { k: "v", l: "VERPFL.", w: 120 }, { k: "f", l: "FAHRT", w: 125 }, { k: "b", l: "HOTEL/PARK", w: 150 }];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightBg t={t} glow="rgba(30,158,87,0.14)" />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", ...popStyle(t, from, 10, 0.8) }}><LabelChip text="Fertig für die Buchhaltung" dot={C.green} size={32} /></div>
        <div style={{ position: "absolute", left: 40, top: 360, width: 1000, height: 760, background: "#FFF", borderRadius: 26, boxShadow: shadow, border: `1px solid ${CL.border}`, overflow: "hidden", ...popStyle(t, from + 0.04, 30, 0.85) }}>
          <div style={{ height: 80, display: "flex", alignItems: "center", gap: 14, padding: "0 26px", borderBottom: `1px solid ${CL.border}`, background: CL.page }}>
            <div style={{ width: 44, height: 50, borderRadius: 8, background: C.green, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 15, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6, boxSizing: "border-box" }}>XLSX</div>
            <span style={{ fontFamily: fonts.semibold, fontSize: 27, color: CL.text, whiteSpace: "nowrap" }}>Reisekosten_Oktober.xlsx</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, border: `1.5px solid ${t > A.beleg + 0.4 ? C.green : CL.border}`, background: t > A.beleg + 0.4 ? C.greenSoft : "#FFF", borderRadius: 12, padding: "8px 16px", fontFamily: fonts.semibold, fontSize: 21, color: t > A.beleg + 0.4 ? C.green : CL.text }}>
              <Ico d="M12 4v11M7 10.5l5 5 5-5M5 20h14" size={22} color={t > A.beleg + 0.4 ? C.green : CL.text} />Download
            </div>
          </div>
          <div style={{ display: "flex", height: 60, background: "#F6F4EF", borderBottom: `1.5px solid ${CL.border}`, paddingLeft: 20 }}>
            {COLS.map((c) => <div key={c.k} style={{ width: c.w, display: "flex", alignItems: "center", fontFamily: MONO, fontWeight: 800, fontSize: 17, letterSpacing: "0.08em", color: CL.sub }}>{c.l}</div>)}
            <div style={{ width: 70, display: "flex", alignItems: "center" }}><Ico d={I.clip} size={22} color={CL.sub} /></div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 24, fontFamily: MONO, fontWeight: 800, fontSize: 17, letterSpacing: "0.08em", color: CL.sub }}>SUMME</div>
          </div>
          {TROWS.map((r, i) => {
            const a = from + 0.2 + i * 0.18;
            return t > a ? (
              <div key={i} style={{ display: "flex", height: 108, borderBottom: `1px solid ${CL.border}`, paddingLeft: 20, alignItems: "center", ...popStyle(t, a, 10, 0.9) }}>
                {COLS.map((c) => <div key={c.k} style={{ width: c.w, fontFamily: c.k === "z" ? fonts.semibold : MONO, fontWeight: c.k === "z" ? 600 : 500, fontSize: 25, color: CL.text, whiteSpace: "nowrap" }}>{(r as Record<string, string | number>)[c.k]}</div>)}
                <div style={{ width: 70 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: MONO, fontWeight: 800, fontSize: 18, color: clip ? "#FFF" : CL.sub, background: clip ? C.orange : "#F1EEE8", borderRadius: 8, padding: "4px 8px", transform: clip ? `scale(${0.8 + 0.2 * Math.min(1, pop(t, A.beleg - 0.1 + i * 0.08, 0.3))})` : undefined }}>
                    <Ico d={I.clip} size={16} color={clip ? "#FFF" : CL.sub} sw={2.2} />{r.n}
                  </span>
                </div>
                <div style={{ flex: 1, textAlign: "right", paddingRight: 24, fontFamily: MONO, fontWeight: 800, fontSize: 28, color: CL.text, whiteSpace: "nowrap" }}>{r.s} €</div>
              </div>
            ) : null;
          })}
          {t > A.tabelle - 0.1 ? (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: C.greenSoft, display: "flex", alignItems: "center", padding: "0 34px", ...popStyle(t, A.tabelle - 0.1, 10, 0.9) }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 34, color: CL.text, flex: 1 }}>Gesamt Oktober</span>
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 56, color: C.green, fontVariantNumeric: "tabular-nums" }}>{total.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
            </div>
          ) : null}
        </div>
        {clip ? (
          <div style={{ position: "absolute", left: 640, top: 1150, ...popStyle(t, A.beleg + 0.05, 16, 0.6) }}>
            <Receipt w={190} title="HOTEL ADLER" amount="112,50" style={{ left: 0, top: 0, transform: "rotate(6deg)" }} />
          </div>
        ) : null}
        <Pointer t={t} path={[{ x: 820, y: 1300, at: from + 0.3 }, { x: 700, y: 640, at: A.beleg - 0.05, click: true }, { x: 930, y: 400, at: A.beleg + 0.4, click: true }]} size={54} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- end: guide chips (the PDF scroll covers most of it) ----------
const SceneEnd: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 70, top: 60, display: "flex", flexDirection: "column", gap: 22 }}>
      {t > A.prompt - 0.05 ? <div style={popStyle(t, A.prompt - 0.05, 10, 0.6)}><Tag text="✓ PROMPT" color={C.orange} size={30} /></div> : null}
      {t > A.tabelle2 - 0.05 ? <div style={popStyle(t, A.tabelle2 - 0.05, 10, 0.6)}><Tag text="✓ PAUSCHALEN-TABELLE" color={C.ink} size={30} /></div> : null}
    </div>
    <div style={{ position: "absolute", left: 780, top: 360, width: 180, height: 180, borderRadius: 46, background: `linear-gradient(145deg, #E68E6E, ${C.orange} 55%, #C25E3D)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px rgba(217,119,87,0.4)", ...popStyle(t, A.prompt - 0.1, 26, 0.3) }}><Ico d={CUP} size={110} color="#FFF" sw={1.6} /></div>
  </>
);

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }>; full?: boolean };
const SCENES: Scene[] = [
  { from: 0, to: A.das - 0.1, origin: "50% 50%", El: SceneHook },
  { from: A.das - 0.1, to: A.schritt0 - 0.05, origin: "50% 50%", El: FullMoney, full: true },
  { from: A.schritt0 - 0.05, to: A.schritt1 - 0.05, origin: "50% 45%", El: SceneStep1 },
  { from: A.schritt1 - 0.05, to: A.jetzt - 0.25, origin: "50% 45%", El: SceneStep2 },
  { from: A.jetzt - 0.25, to: A.schritt2 - 0.05, origin: "50% 50%", El: FullTrick, full: true },
  { from: A.schritt2 - 0.05, to: A.ende - 0.12, origin: "50% 45%", El: SceneStep3 },
  { from: A.ende - 0.12, to: A.prompt - 0.1, origin: "50% 50%", El: FullTable, full: true },
  { from: A.prompt - 0.1, to: 999, origin: "50% 45%", El: SceneEnd },
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
const PAGES = Array.from({ length: 10 }, (_, i) => staticFile(`reisekosten-guide/p${i + 1}.png`));
const PDF = { left: 120, top: 560, w: 840, h: 1220, bar: 76, pw: 780, ph: Math.round((780 * 936) / 662), gap: 26 };
const PITCH = PDF.ph + PDF.gap;
export const PDF_IN = A.prompt - 0.1;
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
        <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: "#FFF", whiteSpace: "nowrap" }}>Reisekosten – Guidebook.pdf</div>
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
const FOCUS = { x: 0.508, y: 0.595, scale: 1.0 };
const SPLIT_SRC_TOP = 430;
const CTA = A.komm - 0.12;
const CHEST_Y = 1540;
export const ReisekostenOpus: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-fpn-reisekosten-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {scene.full ? <El t={t} /> : full < 1 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * full, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
          </div>
          {t < A.das - 0.1 ? <HookPills t={t} /> : null}
        </div>
      ) : null}
      <PdfScroll t={t} />
      {t > A.komm - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.komm - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 26px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>{typed("SPESEN", t, A.trigger - 0.1, A.trigger + 0.3) || " "}</div>
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
