import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import { deep, tilt3d } from "./GMapsKit";
import { PK, paperShadow, Stage, Paper, InkStamp, Brush, Highlight, Courthouse, Glass, Bokeh, Sheen, Foreground, Grade, Ruler3D, Plaque, VelvetRope } from "./PremiumKit";
import captions from "../../runs/fpn-klage/captions.json";
import { Court3D, camNow } from "./KlageCourt3D";

// FP-N "Klage ohne Anwalt" (2026-10-27): seit 1.1.2026 Amtsgericht bis 10.000 €, kein Anwaltszwang, Claude schreibt die Klage.
// Heller Superkind-Look (weiß/orange), Gerüst wie MapsOpus, Zeiten an captions.json verankert. Kunde und Betrieb sind erfunden.

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const KL_END = LAST_END + 0.7;
export const KL_FRAMES = Math.round(KL_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  januar: at("januar"), verklagen: at("verklagen"), bis0: at("bis", 0), zehn0: at("zehntausend", 0), anwalt0: at("anwalt", 0), claude0: at("claude", 0), schreibt0: at("schreibt", 0), klage0: at("klage", 0), klage1: at("klage", 1),
  bis1: at("bis", 1), fuenf: at("fünftausend"), landgericht: at("landgericht"), dort: at("dort"), anwalt1: at("anwalt", 1), kostete: at("kostete"), tausend: at("tausend"), euro2: at("euro", 2),
  jetzt: at("jetzt"), zehn1: at("zehntausend", 1), amts0: at("amtsgericht", 0),
  du2: at("du", 2), rechnung: at("rechnung"), mahnungen: at("mahnungen"), mails: at("mails"), kunden1: at("kunden", 1),
  claude2: at("claude", 2), ordnet: at("ordnet"), datum: at("datum"), rechnet: at("rechnet"), verzugszinsen: at("verzugszinsen"), sucht: at("sucht"), amts1: at("amtsgericht", 1), zustaendig: at("zuständig"),
  und4: at("und", 4), schreibt1: at("schreibt", 1), fertige: at("fertige"), antrag: at("antrag"), begruendung: at("begründung"), liste: at("liste"), anlagen: at("anlagen"),
  du3: at("du", 3), liest: at("liest"), durch: at("durch"), unterschreibst: at("unterschreibst"), schickst: at("schickst"), ab: at("ab"),
  alle: at("alle"), fuenfP: at("fünf"), prompts: at("prompts"), checkliste: at("checkliste"), guide: at("guide"), komm: at("kommentiere"), trigger: at("klage", 3), folg: at("folg"),
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
// ---------- hook pills (frame 0 = thumbnail): "Kunde zahlt nicht" / "Claude klagt" ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const m = k(t, 1.15, 0.35, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 62, padding: "10px 26px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow }}>
        Kunde <span style={{ color: C.red }}>zahlt nicht</span>
      </div>
      <div style={{ ...pill, marginTop: -6 }}>
        Claude{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -8, right: -8, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${t < 0.04 ? 1 : m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>klagt</span>
        </span>
      </div>
    </div>
  );
};

// ---------- shared pieces ----------
const KUNDE = "Kessler Bau GmbH";
const BETRAG = "6.480,00 €";
const Court: React.FC<{ size: number; color?: string }> = ({ size, color = C.ink }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path d="M24 4L4 15h40z" fill={color} />
    {[9, 17, 27, 35].map((x) => <rect key={x} x={x} y={18} width={4} height={18} rx={1} fill={color} />)}
    <rect x={5} y={38} width={38} height={4} rx={1} fill={color} />
    <rect x={3} y={43} width={42} height={3} rx={1} fill={color} />
  </svg>
);
const Panel: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; sheen?: number }> = ({ style, children, sheen = 0 }) => (
  <div style={{ position: "absolute", background: `linear-gradient(160deg, #FFFFFF 0%, ${PK.paper} 50%, #F8F1E6 100%)`, borderRadius: 22, boxShadow: paperShadow, overflow: "hidden", border: "1px solid rgba(255,255,255,0.9)", ...style }}>{children}<Sheen p={sheen} strength={0.6} /></div>
);
const MonoLabel: React.FC<{ text: string; size?: number; color?: string; style?: React.CSSProperties }> = ({ text, size = 18, color = CL.sub, style }) => (
  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color, whiteSpace: "nowrap", ...style }}>{text}</div>
);
const Strike: React.FC<{ p: number; color?: string; children: React.ReactNode }> = ({ p, color = C.ink, children }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    {children}
    <span style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 7, background: color, borderRadius: 4, transform: `scaleX(${p})`, transformOrigin: "0% 50%" }} />
  </span>
);
const CheckDot: React.FC<{ size?: number; color?: string; p?: number }> = ({ size = 30, color = C.green, p = 1 }) => (
  <span style={{ width: size, height: size, borderRadius: "50%", background: color, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={size * 0.62} p={p} /></span>
);

// court-limit ruler: 0 … 12.000 €, green zone = Amtsgericht up to `limit`, red = Landgericht + Anwaltszwang
const Ruler: React.FC<{ t: number; w: number; limit: number; markerP: number; redHot?: boolean; fs?: number }> = ({ t, w, limit, markerP, redHot, fs = 20 }) => {
  const MAX = 12000;
  const x = (v: number) => (v / MAX) * w;
  const val = 6480;
  const inGreen = val <= limit;
  const pulse = redHot ? 0.5 + 0.5 * Math.abs(Math.sin(t * 5)) : 0;
  return (
    <div style={{ position: "relative", width: w, height: 170 }}>
      <div style={{ position: "absolute", left: 0, top: 80, width: x(limit), height: 44, background: C.green, borderRadius: "12px 0 0 12px", display: "flex", alignItems: "center", paddingLeft: 16, boxSizing: "border-box", overflow: "hidden" }}>
        <MonoLabel text="AMTSGERICHT" size={fs} color="#FFF" />
      </div>
      <div style={{ position: "absolute", left: x(limit), top: 80, right: 0, height: 44, background: C.red, opacity: 0.55 + 0.45 * (redHot ? pulse : 0.6), borderRadius: "0 12px 12px 0", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 16, boxSizing: "border-box", overflow: "hidden" }}>
        <MonoLabel text="LANDGERICHT" size={fs} color="#FFF" />
      </div>
      {[0, 5000, 10000].map((v) => (
        <div key={v} style={{ position: "absolute", left: x(v) - 60, width: 120, top: 132, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: fs, color: CL.sub }}>{v.toLocaleString("de-DE")}</div>
      ))}
      <div style={{ position: "absolute", left: x(limit) - 2, top: 72, width: 4, height: 60, background: C.ink, borderRadius: 2 }} />
      {markerP > 0 ? (
        <div style={{ position: "absolute", left: x(val), top: 0, transform: `translateX(-50%) translateY(${(1 - Math.min(1, markerP)) * -30}px) scale(${0.6 + 0.4 * markerP})`, opacity: Math.min(1, markerP * 2), display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: fs * 1.25, color: "#FFF", background: inGreen ? C.green : C.red, borderRadius: 10, padding: "6px 14px", whiteSpace: "nowrap", boxShadow: "0 8px 18px rgba(0,0,0,0.18)" }}>Deine Rechnung · 6.480 €</div>
          <div style={{ width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: `16px solid ${inGreen ? C.green : C.red}` }} />
          <div style={{ width: 6, height: 50, background: C.ink, marginTop: -2, borderRadius: 3 }} />
        </div>
      ) : null}
    </div>
  );
};

// ---------- split hook: overdue invoice, 5.000 → 10.000 €, no lawyer, Claude writes the lawsuit ----------
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const thumb = t < 0.04;
  const on = (a: number) => thumb || t > a;
  const ten = on(A.zehn0 - 0.12);
  const noLawyer = on(A.anwalt0 - 0.08);
  const claude = on(A.claude0 - 0.1);
  const ps = (a: number, rise = 20, from = 0.8) => (thumb ? {} : popStyle(t, a, rise, from));
  return (
    <>
      <Panel style={{ left: 40, top: 236, width: 470, height: 336, transform: `${tilt3d(t, 4, 10)} translateX(${shakeAt(t, A.verklagen, 8)}px)`, transformOrigin: "0% 50%", ...ps(0.05) }}>
        <div style={{ padding: "24px 28px" }}>
          <MonoLabel text="RECHNUNG NR. 2026-041" />
          <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: CL.text, marginTop: 14 }}>{KUNDE}</div>
          <div style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub, marginTop: 6 }}>fällig seit 16.03.2026</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 64, color: CL.text, marginTop: 18 }}>{BETRAG}</div>
        </div>
        <Stamp t={t} at={thumb ? -1 : 0.55} text="ÜBERFÄLLIG" color={C.red} size={30} rot={-4} style={{ left: 28, top: 256 }} />
      </Panel>
      <Panel style={{ left: 550, top: 250, width: 490, height: 300, transform: tilt3d(t, 4, -10), transformOrigin: "100% 50%", ...ps(0.12) }}>
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Court size={34} /><MonoLabel text="AMTSGERICHT BIS" size={20} color={CL.text} /></div>
          <div style={{ height: 44, marginTop: 16 }}>
            {ten ? <span style={{ fontFamily: fonts.bold, fontSize: 36, color: CL.sub, ...ps(A.zehn0 - 0.12, 6, 0.9) }}><Strike p={thumb ? 1 : k(t, A.zehn0, 0.3)} color={C.red}>5.000 €</Strike></span> : null}
          </div>
          <div style={{ fontFamily: fonts.bold, fontSize: 84, color: ten ? C.green : CL.text, lineHeight: 1.05, transform: `scale(${ten && !thumb ? 1 + 0.12 * Math.max(0, 1 - (t - A.zehn0) / 0.3) : 1})`, transformOrigin: "0% 50%" }}>{ten ? "10.000 €" : "5.000 €"}</div>
        </div>
        {on(A.januar - 0.05) ? <div style={{ position: "absolute", right: 22, bottom: 24, ...ps(A.januar - 0.05, 8, 0.4) }}><Tag text="SEIT 01.01.2026" color={C.orange} size={16} /></div> : null}
      </Panel>
      <Panel style={{ left: 40, top: 590, width: 470, height: 190, transform: tilt3d(t, 4, 10), transformOrigin: "0% 50%", opacity: noLawyer ? 1 : 0.0, ...(noLawyer ? ps(A.anwalt0 - 0.08) : {}) }}>
        <div style={{ padding: "26px 28px", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 76, height: 76, borderRadius: 20, background: C.redSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" size={46} color={C.red} sw={2} /></div>
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 40, color: CL.text }}><Strike p={thumb ? 1 : k(t, A.anwalt0, 0.3)} color={C.red}>Anwalt</Strike></div>
            <div style={{ marginTop: 10 }}><StatusPill ok text="NICHT NÖTIG" /></div>
          </div>
        </div>
      </Panel>
      <Panel style={{ left: 550, top: 590, width: 490, height: 190, transform: tilt3d(t, 4, -10), transformOrigin: "100% 50%", opacity: claude ? 1 : 0, ...(claude ? ps(A.claude0 - 0.1) : {}) }}>
        <div style={{ padding: "22px 26px", display: "flex", gap: 18 }}>
          <div style={{ width: 92, height: 120, borderRadius: 10, background: CL.page, border: `1.5px solid ${CL.border}`, padding: 10, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 18, color: CL.text, textAlign: "center" }}>Klage</div>
            {[1, 0.8, 0.9, 0.6, 0.85].map((w, i) => <div key={i} style={{ height: 6, width: `${w * 100 * (thumb ? 1 : k(t, A.schreibt0 + i * 0.12, 0.25))}%`, background: "#D6D1C6", borderRadius: 3 }} />)}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ClaudeMark size={34} /><span style={{ fontFamily: fonts.semibold, fontSize: 28, color: CL.text }}>Claude</span></div>
            <div style={{ fontFamily: fonts.medium, fontSize: 25, color: CL.text, marginTop: 10, lineHeight: 1.3 }}>{thumb ? "schreibt die Klage" : typed("schreibt die Klage", t, A.schreibt0, A.klage0 + 0.3)}</div>
            {on(A.klage0) ? <div style={{ marginTop: 10, ...ps(A.klage0, 6, 0.5) }}><Tag text="KLAGE.PDF" color={C.orange} size={15} /></div> : null}
          </div>
        </div>
      </Panel>
    </>
  );
};

// ---------- split hook v2: paper invoice stack on a lit desk, big type 10.000 €, 2.5D court, glass chips ----------
const SceneHookV2: React.FC<{ t: number }> = ({ t }) => {
  const thumb = t < 0.04;
  const on = (a: number) => thumb || t > a;
  const P = (a: number, d = 0.3) => (thumb ? 1 : k(t, a, d));
  const ps = (a: number, rise = 20, from = 0.8) => (thumb ? {} : popStyle(t, a, rise, from));
  const ten = on(A.zehn0 - 0.12);
  const tenPop = thumb ? 1 : pop(t, A.zehn0 - 0.12, 0.45);
  const items = [["Fassade Halle 2", "3.900,00"], ["Gerüst 14 Tage", "1.480,00"], ["Material", "1.100,00"]];
  return (
    <>
        {["2. MAHNUNG", "1. MAHNUNG"].map((m, i) => (
        <div key={m} style={{ position: "absolute", left: 70 + (1 - i) * 26, top: 214 + (1 - i) * 6, transform: `perspective(1800px) rotateX(10deg) rotateY(14deg) rotate(${-11 + i * 3 + Math.sin(t * 0.6 + i) * 0.6}deg)`, ...ps(0.02 + i * 0.05, 30, 0.9) }}>
          <Paper fold={false} style={{ position: "relative", width: 410, height: 540, filter: "blur(1.6px)" }}>
            <div style={{ padding: "26px 30px", fontFamily: MONO, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: PK.red }}>{m}</div>
          </Paper>
        </div>
      ))}
      <div style={{ position: "absolute", left: 54, top: 250, transform: `perspective(1800px) rotateX(10deg) rotateY(14deg) rotate(${-4 + Math.sin(t * 0.7) * 0.5}deg) translateX(${shakeAt(t, A.verklagen, 7)}px)`, transformOrigin: "50% 60%", ...ps(0.1, 34, 0.9) }}>
        <Paper sheen={thumb ? 0 : k(t, 0.35, 1.1, Easing.inOut(Easing.cubic))} style={{ position: "relative", width: 430, height: 560 }}>
          <div style={{ padding: "30px 34px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(140deg, ${PK.orange}, ${PK.orangeDeep})` }} />
              <span style={{ fontFamily: fonts.semibold, fontSize: 19, color: PK.ink }}>Dein Betrieb</span>
            </div>
            <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 44, color: PK.ink, marginTop: 22, letterSpacing: "0.01em" }}>Rechnung</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 16, color: PK.sub, marginTop: 2 }}>Nr. 2026-041 · an {KUNDE}</div>
            <div style={{ marginTop: 22, borderTop: `1.5px solid ${PK.paperEdge}` }}>
              {items.map(([a, b]) => (
                <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px dashed ${PK.paperEdge}`, fontFamily: fonts.medium, fontSize: 18, color: PK.ink }}><span>{a}</span><span style={{ fontFamily: MONO }}>{b}</span></div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 18 }}>
              <span style={{ fontFamily: fonts.semibold, fontSize: 20, color: PK.sub }}>Gesamt</span>
              <span style={{ fontFamily: fonts.bold, fontSize: 46, color: PK.ink, letterSpacing: "-0.01em" }}>{BETRAG}</span>
            </div>
            <div style={{ fontFamily: fonts.medium, fontSize: 16, color: PK.red, marginTop: 8 }}>Zahlbar bis 16.03.2026</div>
          </div>
          <InkStamp id="stOver" text="ÜBERFÄLLIG" p={thumb ? 1 : k(t, 0.55, 0.16)} size={36} rot={-12} style={{ left: 40, top: 300 }} />
        </Paper>
      </div>
      <div style={{ position: "absolute", left: 560, top: 236 }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 19, letterSpacing: "0.14em", color: PK.sub, ...ps(0.15, 8, 0.9) }}>AMTSGERICHT BIS</div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 8, fontFamily: fonts.bold, fontSize: 58, color: ten ? "#A79E92" : PK.ink, ...ps(0.2, 10, 0.9) }}>
          5.000 €
          {ten ? <Brush w={230} p={P(A.zehn0, 0.35)} sw={9} style={{ left: -12, top: 14 }} /> : null}
        </div>
        <div style={{ position: "relative", marginTop: -6, height: 150, opacity: ten ? 1 : 0, transform: `scale(${0.6 + 0.4 * tenPop})`, transformOrigin: "0% 60%" }}>
          <Brush w={380} p={P(A.zehn0 + 0.25, 0.4)} color={PK.marker} sw={30} kind="under" style={{ left: -6, top: 92 }} />
          <span style={{ position: "relative", fontFamily: fonts.bold, fontSize: 108, letterSpacing: "-0.03em", lineHeight: 1.05, background: `linear-gradient(170deg, ${PK.orange} 10%, ${PK.orangeDeep} 90%)`, WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 10px 16px rgba(180,83,47,0.28))", whiteSpace: "nowrap" }}>10.000 €</span>
        </div>
        {on(A.januar - 0.05) ? <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SERIF, fontStyle: "italic", fontSize: 28, color: PK.ink, ...ps(A.januar - 0.05, 8, 0.6) }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: PK.orange }} />seit 1. Januar 2026</div> : null}
      </div>
      <Courthouse size={190} style={{ left: 858, top: 580, transform: `translateY(${Math.sin(t * 1.4) * 5}px)`, ...ps(0.25, 30, 0.6) }} />
      {on(A.anwalt0 - 0.08) ? (
        <Glass style={{ left: 540, top: 590, height: 78, padding: "0 22px 0 14px", display: "flex", alignItems: "center", gap: 12, ...ps(A.anwalt0 - 0.08, 14, 0.7) }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: "rgba(210,64,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" size={30} color={PK.red} sw={2} /></div>
          <span style={{ position: "relative", fontFamily: fonts.bold, fontSize: 30, color: PK.ink }}>Anwalt<Brush w={124} p={P(A.anwalt0, 0.3)} sw={6} style={{ left: -6, top: 4 }} /></span>
          <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: PK.green }}>nicht nötig</span>
        </Glass>
      ) : null}
      {on(A.claude0 - 0.1) ? (
        <Glass style={{ left: 540, top: 688, height: 78, padding: "0 22px 0 14px", display: "flex", alignItems: "center", gap: 12, ...ps(A.claude0 - 0.1, 14, 0.7) }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: "rgba(217,119,87,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}><ClaudeMark size={30} /></div>
          <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: PK.ink, whiteSpace: "nowrap" }}>{thumb ? "schreibt die Klage" : typed("schreibt die Klage", t, A.schreibt0, A.klage0 + 0.3)}</span>
          {on(A.klage0 + 0.3) ? <span style={{ width: 30, height: 30, borderRadius: "50%", background: PK.green, display: "inline-flex", alignItems: "center", justifyContent: "center", ...ps(A.klage0 + 0.3, 4, 0.4) }}><Check size={19} /></span> : null}
        </Glass>
      ) : null}
    </>
  );
};

// ---------- full: until 2025, 6.480 € = Landgericht = Anwaltszwang = over 1.000 € lawyer ----------
const FullBefore: React.FC<{ t: number }> = ({ t }) => {
  const from = A.bis1 - 0.05;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "linear-gradient(180deg, #D98A6E 0%, #EDB9A0 30%, #F1D6C6 55%, #E9CDBE 75%)" }}>
      <Court3D t={t} from={from} courtAt={from + 0.1} ropeAt={A.dort - 0.1} billAt={A.kostete - 0.1} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(70,25,10,0.35))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", color: "#FFF8F2", textShadow: "0 6px 30px rgba(120,40,20,0.35)", ...popStyle(t, from, 14, 0.85) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, letterSpacing: "0.4em" }}>SO WAR ES</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 150, lineHeight: 1, marginTop: 8 }}>bis 2025</div>
      </div>
      {t > A.fuenf - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center", ...popStyle(t, A.fuenf - 0.1, 12, 0.7) }}>
          <Glass style={{ position: "relative", height: 74, padding: "0 26px 0 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: PK.red }} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: PK.ink, whiteSpace: "nowrap" }}>über 5.000 € Streitwert</span>
          </Glass>
        </div>
      ) : null}
      <Grade />
    </AbsoluteFill>
  );
};

// ---------- split: now the limit moves to 10.000 €, the invoice lands at the Amtsgericht ----------
const SceneNow: React.FC<{ t: number }> = ({ t }) => {
  const a = A.jetzt - 0.1;
  const limit = interpolate(t, [A.zehn1 - 0.15, A.zehn1 + 0.45], [5000, 10000], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <>
      <div style={{ position: "absolute", inset: -80, background: "linear-gradient(180deg, #8FC4A0 0%, #C4E0CB 45%, #DDEBDF 80%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        <Court3D t={t} from={a} courtAt={a} ropeAt={a - 0.2} openAt={A.zehn1 + 0.25} tone="green" plate="AMTSGERICHT" cam={camNow} w={1080} h={820} />
      </div>
      <div style={{ position: "absolute", left: 40, top: 30, ...popStyle(t, a, 10, 0.8) }}><LabelChip text="Seit 2026" dot={C.green} size={32} /></div>
      <Glass style={{ right: 40, top: 30, height: 76, padding: "0 24px 0 14px", display: "flex", alignItems: "center", gap: 12, ...popStyle(t, A.zehn1 - 0.15, 12, 0.7) }}>
        <span style={{ width: 40, height: 40, borderRadius: "50%", background: PK.green, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Check size={24} p={k(t, A.zehn1 + 0.3, 0.3)} /></span>
        <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: PK.ink, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>bis {eur(limit)}</span>
      </Glass>
    </>
  );
};

// ---------- split: give Claude the invoice, reminders and mails ----------
const FILES = [
  { name: "Rechnung_2026-041.pdf", at: () => A.rechnung - 0.1 },
  { name: "1_Mahnung.pdf", at: () => A.mahnungen - 0.1 },
  { name: "2_Mahnung.pdf", at: () => A.mahnungen + 0.15 },
  { name: "Mails_Kessler.pdf", at: () => A.mails - 0.1 },
];
const PROMPT1 = "Kessler Bau zahlt nicht. Schreib mir die Klage.";
const SEND_AT = () => A.claude2 - 0.3;
const SceneUpload: React.FC<{ t: number }> = ({ t }) => {
  const a = A.du2 - 0.08;
  const txtA = A.mails + 0.15, txtB = SEND_AT() - 0.08;
  const sent = t > SEND_AT();
  return (
    <>
        <ClaudeWin title="Klage Kessler Bau" style={{ left: 50, top: 130, width: 980, height: 670, transform: tilt3d(t, 4, -6), boxShadow: deep, ...popStyle(t, a, 20, 0.9) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 34, textAlign: "center", fontFamily: SERIF, fontSize: 46, color: CL.text, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}><ClaudeMark size={42} />Wie kann ich helfen?</div>
        <Composer w={920} h={440} text={typed(PROMPT1, t, txtA, txtB)} caret={t > txtA && !sent && Math.floor(t * 4) % 2 === 0} plusOn={FILES.some((f) => t > f.at() - 0.15 && t < f.at() + 0.1)} sendOn={t > txtB} fs={30}
          style={{ left: 30, top: 130, transform: sent ? `scale(${1 - 0.03 * Math.max(0, 1 - (t - SEND_AT()) / 0.15)})` : undefined }}
          file={<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{FILES.map((f, i) => (t > f.at() ? <div key={i} style={popStyle(t, f.at(), 14, 0.6)}><FileChip name={f.name} meta="PDF" size={0.9} /></div> : null))}</div>} />
      </ClaudeWin>
      <div style={{ position: "absolute", left: 40, top: 46, ...popStyle(t, a, 10, 0.8) }}><LabelChip text="Rechnung · Mahnungen · Mails" dot={C.orange} size={30} /></div>
      <Pointer t={t} path={[
        { x: 760, y: 820, at: a + 0.1 },
        { x: 132, y: 726, at: FILES[0].at() - 0.05, click: true },
        { x: 132, y: 726, at: FILES[1].at() - 0.05, click: true },
        { x: 132, y: 726, at: FILES[3].at() - 0.05, click: true },
        { x: 952, y: 726, at: SEND_AT(), click: true },
      ]} />
    </>
  );
};

// ---------- full: Claude sorts the timeline by date, calculates the default interest, finds the court ----------
const TL = [
  { d: "28.04.2026", x: "Mail: „Zahlen nächste Woche“", o: 4 },
  { d: "02.03.2026", x: "Rechnung über 6.480 €", o: 0 },
  { d: "21.04.2026", x: "2. Mahnung", o: 3 },
  { d: "16.03.2026", x: "Fällig, keine Zahlung", o: 1 },
  { d: "01.04.2026", x: "1. Mahnung", o: 2 },
];
const FullClaude: React.FC<{ t: number }> = ({ t }) => {
  const from = A.claude2 - 0.12;
  const zoom = 1 + 0.035 * k(t, from, 6, Easing.inOut(Easing.sin));
  const sort = k(t, A.datum - 0.05, 0.6, Easing.inOut(Easing.cubic));
  const zins = t > A.rechnet - 0.1;
  const court = t > A.sucht - 0.1;
  const ok = t > A.zustaendig - 0.05;
  const ROW = 84;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Stage t={t} />
      <Bokeh t={t} h={1920} n={24} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 40%" }}>
        <ClaudeWin title="Klage Kessler Bau" style={{ left: 50, top: 210, width: 980, height: 1270, transform: tilt3d(t, 5, -4), boxShadow: deep, ...popStyle(t, from, 24, 0.92) }}>
          <div style={{ position: "absolute", right: 26, top: 22, display: "flex", alignItems: "center", gap: 10 }}>
            <Tag text="4 DATEIEN" color={C.ink} size={15} />
            <div style={{ background: CL.bubble, borderRadius: 18, padding: "10px 18px", fontFamily: fonts.medium, fontSize: 22, color: CL.text }}>{PROMPT1}</div>
          </div>
          <div style={{ position: "absolute", left: 26, top: 96 }}><ClaudeMark size={36} /></div>
          <div style={{ position: "absolute", left: 80, right: 30, top: 96 }}>
            {t > A.ordnet - 0.15 ? (
              <div style={popStyle(t, A.ordnet - 0.15, 10, 0.9)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontFamily: fonts.semibold, fontSize: 36, color: CL.text }}>Chronologie</span>{sort > 0.99 ? <span style={popStyle(t, A.datum + 0.55, 4, 0.5)}><Tag text="NACH DATUM" color={C.green} size={14} /></span> : null}</div>
                <div style={{ position: "relative", height: ROW * TL.length + 10, marginTop: 14 }}>
                  {TL.map((r, i) => {
                    const y = (i + (r.o - i) * sort) * ROW;
                    const appear = A.ordnet + i * 0.08;
                    return t > appear ? (
                      <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: ROW - 10, display: "flex", alignItems: "center", gap: 18, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 12, padding: "0 18px", boxSizing: "border-box", boxShadow: sort > 0 && sort < 1 ? "0 8px 20px rgba(0,0,0,0.10)" : "none", ...popStyle(t, appear, 8, 0.85) }}>
                        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.orange, width: 180 }}>{r.d}</span>
                        <span style={{ fontFamily: fonts.medium, fontSize: 30, color: CL.text, whiteSpace: "nowrap" }}>{r.x}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ) : null}
            {zins ? (
              <div style={{ marginTop: 26, ...popStyle(t, A.rechnet - 0.1, 12, 0.9) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontFamily: fonts.semibold, fontSize: 36, color: CL.text }}>Verzugszinsen</span><Tag text="§ 288 BGB" color={C.ink} size={14} /></div>
                <div style={{ marginTop: 14, border: `1.5px solid ${CL.border}`, borderRadius: 14, overflow: "hidden", background: "#FFF" }}>
                  {[
                    { k: "Hauptforderung", v: BETRAG },
                    { k: "Zinsen ab 17.03.2026", v: "9 %-Pkt. über Basiszins" },
                    { k: "Verzugspauschale", v: "40,00 €" },
                  ].map((r, i) => {
                    const a = A.verzugszinsen - 0.1 + i * 0.2;
                    return t > a ? (
                      <div key={i} style={{ display: "flex", alignItems: "center", height: 82, padding: "0 22px", borderBottom: i < 2 ? `1px solid ${CL.border}` : "none", ...popStyle(t, a, 6, 0.9) }}>
                        <span style={{ fontFamily: fonts.medium, fontSize: 29, color: CL.sub, flex: 1 }}>{r.k}</span>
                        <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: CL.text }}>{r.v}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ) : null}
            {court ? (
              <div style={{ marginTop: 26, ...popStyle(t, A.sucht - 0.1, 12, 0.9) }}>
                <span style={{ fontFamily: fonts.semibold, fontSize: 36, color: CL.text }}>Zuständiges Gericht</span>
                <div style={{ marginTop: 14, border: `2px solid ${ok ? C.green : CL.border}`, borderRadius: 16, background: ok ? C.greenSoft : "#FFF", padding: "22px 24px", display: "flex", alignItems: "center", gap: 22 }}>
                  <div style={{ width: 96, height: 96, borderRadius: 24, background: "#FFF", border: `1.5px solid ${CL.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Court size={62} color={ok ? C.green : C.ink} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: fonts.bold, fontSize: 46, color: CL.text, minHeight: 56 }}>{typed("Amtsgericht Augsburg", t, A.amts1 - 0.1, A.amts1 + 0.45)}</div>
                    <div style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub, marginTop: 6 }}>Sitz der {KUNDE} · 6.480 € &lt; 10.000 €</div>
                  </div>
                  {ok ? <div style={popStyle(t, A.zustaendig - 0.05, 6, 0.4)}><StatusPill ok text="ZUSTÄNDIG" /></div> : null}
                </div>
              </div>
            ) : null}
          </div>
        </ClaudeWin>
      </div>
      <Grade />
    </AbsoluteFill>
  );
};

// ---------- the lawsuit document (serif paper, 2.5D) ----------
const ANTRAG = "Die Beklagte wird verurteilt, an den Kläger 6.480,00 € nebst Zinsen in Höhe von 9 Prozentpunkten über dem Basiszinssatz seit dem 17.03.2026 zu zahlen.";
const KlageDoc: React.FC<{ t: number; all?: boolean; style?: React.CSSProperties; scan?: number; sign?: number; sheen?: number }> = ({ t, all, style, scan = -1, sign = 0, sheen = 0 }) => {
  const seen = (a: number) => all || t > a;
  const hi = (a: number, b: number) => (!all && t > a && t < b ? 1 : 0);
  const sec = (label: string, a: number, b: number, body: React.ReactNode) =>
    seen(a) ? (
      <div style={{ marginTop: 14, ...(all ? {} : popStyle(t, a, 6, 0.96)) }}>
        <div style={{ position: "relative", display: "inline-block", fontFamily: SERIF, fontWeight: 600, fontSize: 23, color: CL.text }}>{hi(a, b) || (!all && t > b) ? <Highlight p={k(t, a, 0.35)} /> : null}<span style={{ position: "relative" }}>{label}</span></div>
        {body}
      </div>
    ) : null;
  return (
    <Paper fold={false} sheen={sheen} style={{ width: 640, height: 650, ...style }}><div style={{ position: "absolute", inset: 0, padding: "34px 40px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SERIF, fontSize: 18, color: CL.text, lineHeight: 1.35 }}>
        <div>An das<br /><b>Amtsgericht Augsburg</b></div>
        <div style={{ textAlign: "right", color: CL.sub }}>Dein Betrieb<br />Musterstraße 1</div>
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 44, color: CL.text, textAlign: "center", marginTop: 14, letterSpacing: "0.04em" }}>{all ? "Klage" : typed("Klage", t, A.fertige, A.klage1 + 0.2)}</div>
      <div style={{ fontFamily: SERIF, fontSize: 17, color: CL.text, textAlign: "center", lineHeight: 1.4, marginTop: 4, opacity: all ? 1 : k(t, A.fertige + 0.1, 0.3) }}>Dein Betrieb – Kläger – gegen {KUNDE} – Beklagte –<br /><span style={{ color: CL.sub }}>wegen Forderung, Streitwert 6.480,00 €</span></div>
      {sec("Antrag", A.antrag - 0.1, A.begruendung - 0.1, <div style={{ fontFamily: SERIF, fontSize: 18, color: CL.text, lineHeight: 1.4, marginTop: 4 }}>{all ? ANTRAG : typed(ANTRAG, t, A.antrag - 0.05, A.begruendung - 0.05)}</div>)}
      {sec("Begründung", A.begruendung - 0.1, A.liste - 0.1, (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {[1, 0.94, 0.97, 0.7].map((w, i) => <div key={i} style={{ height: 7, borderRadius: 4, background: "#DDD7CB", width: `${w * 100 * (all ? 1 : k(t, A.begruendung + i * 0.12, 0.3))}%` }} />)}
        </div>
      ))}
      {sec("Anlagen", A.liste - 0.1, A.anlagen + 0.6, (
        <div style={{ fontFamily: SERIF, fontSize: 18, color: CL.text, lineHeight: 1.45, marginTop: 4 }}>
          {["K1 Rechnung Nr. 2026-041", "K2 Mahnungen vom 01.04. und 21.04.2026", "K3 E-Mail vom 28.04.2026"].map((l, i) => (all || t > A.liste + i * 0.15 ? <div key={i} style={all ? {} : popStyle(t, A.liste + i * 0.15, 4, 0.9)}>{l}</div> : null))}
        </div>
      ))}
      {sign > 0 || all ? (
        <svg width={240} height={70} viewBox="0 0 240 70" style={{ position: "absolute", right: 40, bottom: 16 }}>
          <path d="M8 48 C 30 10, 42 10, 40 40 S 70 62, 82 30 S 104 14, 110 44 C 116 60, 136 22, 150 30 S 176 52, 200 26 L 232 20" fill="none" stroke="#1B3A8A" strokeWidth={3.4} strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - sign)} />
          <line x1={0} y1={64} x2={240} y2={64} stroke={CL.border} strokeWidth={2} />
        </svg>
      ) : null}
      {scan >= 0 && scan <= 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: 30 + scan * 570, height: 46, background: "linear-gradient(180deg, rgba(217,119,87,0), rgba(217,119,87,0.22), rgba(217,119,87,0))" }} /> : null}
    </div></Paper>
  );
};
const SideTags: React.FC<{ t: number; items: { text: string; at: number }[] }> = ({ t, items }) => (
  <div style={{ position: "absolute", left: 730, top: 240, display: "flex", flexDirection: "column", gap: 20 }}>
    {items.map((it, i) => (t > it.at ? (
      <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(150deg, rgba(255,255,255,0.88), rgba(255,255,255,0.62))", border: "1.5px solid rgba(255,255,255,0.9)", borderRadius: 18, padding: "14px 18px", boxShadow: "0 18px 40px -12px rgba(90,55,30,0.35)", backdropFilter: "blur(14px)", ...popStyle(t, it.at, 12, 0.6) }}>
        <CheckDot size={34} p={k(t, it.at + 0.05, 0.3)} />
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 20, letterSpacing: "0.08em", color: CL.text, whiteSpace: "nowrap" }}>{it.text}</span>
      </div>
    ) : null))}
  </div>
);

// ---------- split: Claude writes the finished lawsuit (Antrag, Begründung, Anlagen) ----------
const DOC_POS: React.CSSProperties = { left: 60, top: 110, transformOrigin: "0% 50%" };
const ANL = [
  { k: "K1", t: "Rechnung", c: PK.orange },
  { k: "K2", t: "Mahnungen", c: "#3E7BD9" },
  { k: "K3", t: "E-Mail", c: PK.green },
];
const SceneKlage: React.FC<{ t: number }> = ({ t }) => {
  const a = A.und4 - 0.1;
  const steps = [{ x: "Antrag", at: A.antrag }, { x: "Begründung", at: A.begruendung }, { x: "Anlagen K1–K3", at: A.anlagen }];
  const done = steps.filter((s) => t > s.at + 0.3).length;
  return (
    <>
        {ANL.map((n, i) => {
        const out = k(t, A.liste + i * 0.15, 0.45, Easing.out(Easing.back(1.4)));
        return (
          <div key={i} style={{ position: "absolute", left: 90 + i * 14, top: 150 + i * 16, transform: `${tilt3d(t, 3, 9)} rotate(${2 + i * 2.2}deg)`, transformOrigin: "0% 50%" }}>
            <Paper fold={false} style={{ width: 640, height: 640, position: "relative", filter: `blur(${1 + i * 0.6}px)` }} />
            <div style={{ position: "absolute", left: 640 - 14 + out * 64, top: 80 + i * 112, width: 92, height: 92, borderRadius: "0 14px 14px 0", background: `linear-gradient(90deg, ${n.c}, ${n.c}EE)`, boxShadow: "6px 8px 16px -6px rgba(60,35,15,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: 10, boxSizing: "border-box" }}>
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: "#FFF" }}>{n.k}</span>
              <span style={{ fontFamily: fonts.semibold, fontSize: 12, color: "rgba(255,255,255,0.92)" }}>{n.t}</span>
            </div>
          </div>
        );
      }).reverse()}
      <KlageDoc t={t} sheen={k(t, a + 0.25, 1.1, Easing.inOut(Easing.cubic))} style={{ ...DOC_POS, transform: tilt3d(t, 3, 9), ...popStyle(t, a, 30, 0.85) }} />
      <Glass style={{ left: 800, top: 130, width: 250, padding: "20px 20px 18px", boxSizing: "border-box", ...popStyle(t, A.schreibt1, 16, 0.7) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", width: 46, height: 46 }}>
            <svg width={46} height={46} style={{ position: "absolute", inset: 0 }}><circle cx={23} cy={23} r={20} fill="none" stroke="rgba(217,119,87,0.18)" strokeWidth={4} /><circle cx={23} cy={23} r={20} fill="none" stroke={PK.orange} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - done / 3} transform="rotate(-90 23 23)" /></svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><ClaudeMark size={24} /></div>
          </div>
          <div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 21, color: PK.ink }}>Claude</div>
            <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: "0.08em", color: done === 3 ? PK.green : PK.sub }}>{done === 3 ? "FERTIG" : "SCHREIBT …"}</div>
          </div>
        </div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map((st, i) => {
            const on = t > st.at;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: on ? 1 : 0.38 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: on ? PK.green : "transparent", border: on ? "none" : `2px solid ${PK.sub}`, display: "inline-flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? 1 + 0.3 * Math.max(0, 1 - (t - st.at) / 0.25) : 1})` }}>{on ? <Check size={15} p={k(t, st.at, 0.3)} /> : null}</span>
                <span style={{ fontFamily: fonts.medium, fontSize: 19, color: PK.ink, whiteSpace: "nowrap" }}>{st.x}</span>
              </div>
            );
          })}
        </div>
      </Glass>
      <div style={{ position: "absolute", left: 40, top: 46, ...popStyle(t, a, 10, 0.8) }}><LabelChip text="Die fertige Klage" dot={C.orange} size={30} /></div>
    </>
  );
};

// ---------- split: read once, sign, send to the court ----------
const SceneSend: React.FC<{ t: number }> = ({ t }) => {
  const a = A.du3 - 0.1;
  const scan = interpolate(t, [A.liest, A.durch + 0.35], [0, 1], clamp);
  const sign = k(t, A.unterschreibst - 0.05, 0.7, Easing.inOut(Easing.sin));
  const go = k(t, A.schickst - 0.1, 0.4, Easing.in(Easing.cubic));
  const env = t > A.schickst - 0.35;
  return (
    <>
        {go < 1 ? <KlageDoc t={t} all scan={t < A.durch + 0.35 ? scan : -1} sign={sign} style={{ ...DOC_POS, transform: `${tilt3d(t, 3, 9)} translate(${go * 560}px, ${go * 60}px) scale(${1 - 0.75 * go})`, opacity: 1 - go * 0.8 }} /> : null}
      <SideTags t={t} items={[{ text: "GELESEN", at: A.durch + 0.2 }, { text: "UNTERSCHRIEBEN", at: A.unterschreibst + 0.6 }]} />
      {env ? (
        <div style={{ position: "absolute", left: 720, top: 470, width: 320, height: 210, ...popStyle(t, A.schickst - 0.35, 20, 0.6), transform: `${popStyle(t, A.schickst - 0.35, 20, 0.6).transform} translateY(${-40 * k(t, A.ab - 0.1, 0.4)}px) rotate(${-4 * k(t, A.ab - 0.1, 0.4)}deg)` }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #FFFFFF, #F6EEE2)", borderRadius: 10, boxShadow: paperShadow }} />
          <svg width={320} height={210} viewBox="0 0 320 210" style={{ position: "absolute", inset: 0 }}><path d="M6 10 L160 112 L314 10" fill="none" stroke={CL.border} strokeWidth={3} /></svg>
          <div style={{ position: "absolute", left: 22, bottom: 20, fontFamily: SERIF, fontSize: 21, color: CL.text, lineHeight: 1.3 }}>An das<br /><b>Amtsgericht Augsburg</b></div>
          <div style={{ position: "absolute", right: 18, top: 18, width: 46, height: 54, borderRadius: 4, border: `2px dashed ${C.orange}`, background: C.orangeSoft }} />
        </div>
      ) : null}
      <InkStamp id="stSent" text="ABGESCHICKT" p={k(t, A.ab - 0.15, 0.16)} color={PK.green} size={34} rot={-8} style={{ left: 726, top: 690 }} />
      <div style={{ position: "absolute", left: 40, top: 46, ...popStyle(t, a, 10, 0.8) }}><LabelChip text="Lesen · unterschreiben · abschicken" dot={C.green} size={30} /></div>
      <Pointer t={t} path={[{ x: 760, y: 820, at: a + 0.1 }, { x: 560, y: 300, at: A.liest + 0.1 }, { x: 560, y: 760, at: A.unterschreibst - 0.08, click: true }, { x: 880, y: 600, at: A.schickst + 0.1, click: true }]} />
    </>
  );
};

// ---------- end: guide chips (the PDF scroll covers most of it) ----------
const SceneEnd: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 70, top: 60, display: "flex", flexDirection: "column", gap: 22 }}>
      {t > A.fuenfP - 0.05 ? <div style={popStyle(t, A.fuenfP - 0.05, 10, 0.6)}><Tag text="✓ 5 PROMPTS" color={C.orange} size={30} /></div> : null}
      {t > A.checkliste - 0.05 ? <div style={popStyle(t, A.checkliste - 0.05, 10, 0.6)}><Tag text="✓ KLAGE-CHECKLISTE" color={C.ink} size={30} /></div> : null}
    </div>
    <div style={{ position: "absolute", left: 780, top: 360, width: 180, height: 180, borderRadius: 46, background: `linear-gradient(145deg, #E68E6E, ${C.orange} 55%, #C25E3D)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px rgba(217,119,87,0.4)", ...popStyle(t, A.alle - 0.1, 26, 0.3) }}><Ico d={I.doc} size={110} color="#FFF" sw={1.6} /></div>
  </>
);

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }>; full?: boolean; key2?: string };
const SCENES: Scene[] = [
  { from: 0, to: A.bis1 - 0.05, origin: "50% 50%", El: SceneHookV2 },
  { from: A.bis1 - 0.05, to: A.jetzt - 0.1, origin: "50% 50%", El: FullBefore, full: true },
  { from: A.jetzt - 0.1, to: A.du2 - 0.08, origin: "50% 45%", El: SceneNow, key2: "rgba(30,158,87,0.24)" },
  { from: A.du2 - 0.08, to: A.claude2 - 0.12, origin: "50% 45%", El: SceneUpload },
  { from: A.claude2 - 0.12, to: A.und4 - 0.1, origin: "50% 50%", El: FullClaude, full: true },
  { from: A.und4 - 0.1, to: A.du3 - 0.1, origin: "30% 50%", El: SceneKlage },
  { from: A.du3 - 0.1, to: A.alle + 0.15, origin: "40% 50%", El: SceneSend },
  { from: A.alle + 0.15, to: 999, origin: "50% 45%", El: SceneEnd },
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
const PAGES = Array.from({ length: 11 }, (_, i) => staticFile(`klage-guide/p${i + 1}.png`));
const PDF = { left: 120, top: 560, w: 840, h: 1220, bar: 76, pw: 780, ph: Math.round((780 * 936) / 662), gap: 26 };
const PITCH = PDF.ph + PDF.gap;
export const PDF_IN = A.alle - 0.05;
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
        <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: "#FFF", whiteSpace: "nowrap" }}>Klage – Guidebook.pdf</div>
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
const FOCUS = { x: 0.512, y: 0.597, scale: 1.0 };
const SPLIT_SRC_TOP = 430;
const CTA = A.komm - 0.12;
const CHEST_Y = 1540;
export const KlageOpus: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-fpn-klage-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {scene.full ? <El t={t} /> : full < 1 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * full, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx * 0.35}px, ${dy * 0.35}px) scale(${1 + (cam - 1) * 0.35})` }}><Stage t={t} key2={scene.key2} /></div>
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx * 0.6}px, ${dy * 0.6}px)` }}><Bokeh t={t} seed={2} /></div>
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
          </div>
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx * 1.8}px, ${dy * 1.8}px) scale(${1 + (cam - 1) * 1.8})` }}><Foreground t={t} /></div>
          <Grade />
          {t < SCENES[1].from ? <HookPills t={t} /> : null}
        </div>
      ) : null}
      <PdfScroll t={t} />
      {t > A.komm - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.komm - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 26px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>{typed("KLAGE", t, A.trigger - 0.1, A.trigger + 0.3) || " "}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(20,20,20,0.82)", borderRadius: 999, padding: "10px 20px", ...popStyle(t, A.komm + 0.15, 8, 0.6) }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.green }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", color: "#FFF" }}>GUIDE · 11 SEITEN · PER DM</span>
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
