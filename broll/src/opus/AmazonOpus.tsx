import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-amazon/captions.json";

// FP-N "Claude holt deine Amazon-Rechnungen" (2026-10-23). Opus-Stil wie AbmahnungOpus: Split ab Frame 0, heller Superkind-Look,
// nachgebautes amazon.de (neutral, ohne Logo) mit Claude-in-Chrome-Seitenleiste, Klickpfade mit Mauszeiger, Guide-Scroll im CTA.

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const AM_END = LAST_END + 0.7;
export const AM_FRAMES = Math.round(AM_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  vierhundert0: at("vierhundert", 0), denn: at("denn"), rechnung0: at("rechnung", 0),
  zehn: at("zehn"), zweihundert: at("zweihundertfünfzig"), mwst: at("mehrwertsteuer"), ohne: at("ohne"), zurueck: at("zurück"),
  ab: at("ab"), claude0: at("claude", 0), direkt: at("direkt"), browser: at("browser"),
  oeffnest: at("öffnest"), scannt: at("scannt"), bestellungen: at("bestellungen"), geschaeft: at("geschäft"), fehlen: at("fehlen"),
  bei: at("bei"), oeffnet: at("öffnet"), runter: at("runter"), schaust: at("schaust"),
  dann: at("dann"), pruef: at("prüft"), einzelne: at("einzelne"), firma: at("firma"), umsatzsteuer: at("umsatzsteuer"), leistung: at("leistungsdatum"),
  fehlt0: at("fehlt", 0), anfordern: at("anfordern"), schreibt: at("schreibt"), fehlt1: at("fehlt", 1),
  einloggen: at("einloggen"), selbst2: at("selbst", 2), rest: at("rest"),
  komm: at("kommentiere"), amazon2: at("amazon", 2), alle: at("alle"),
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
const TEAM = ["#E5484D", "#3E8EF7", "#2FB36B", "#F2A531", "#9B5DE5", "#F25CA2", "#1FB5C9", "#F27A3A", "#6C7BF2", "#7DBB3C"];

// ---------- light world + claude.ai pieces (recreated light UI, real English labels) ----------
const SERIF = "Newsreader";
const CL = { page: "#FAF9F5", border: "#E3DFD5", text: "#1F1E1D", sub: "#77746C", send: "#C96442", bubble: "#F0EEE6", hover: "#F2EFE8" };
const RIVAL = "#B4232A";
const KANZLEI = "Kanzlei Dr. Streng";

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

// ---------- amazon pieces (recreated light UI, neutral, no brand logo) ----------
const AZ = { nav: "#131921", nav2: "#232F3E", btn: "#FFD814", btnBorder: "#F2C200", link: "#2162A1", ok: "#067D62" };
const BUYER = "Muster GmbH";
type Order = { d: string; t: string; p: string; s: string; biz: boolean; inv: boolean; kind: "chair" | "print" | "food" | "dock" | "hose" | "screen" };
const ORDERS: Order[] = [
  { d: "02.10.", t: "Bürostuhl Ergo Pro · 10 Stück", p: "2.500,00 €", s: "MöbelDirekt GmbH", biz: true, inv: false, kind: "chair" },
  { d: "05.10.", t: "Laserdrucker MFC", p: "289,90 €", s: "Amazon", biz: true, inv: true, kind: "print" },
  { d: "07.10.", t: "Kaffeebohnen 1 kg", p: "14,99 €", s: "Amazon", biz: false, inv: true, kind: "food" },
  { d: "11.10.", t: "USB-C Dock 12-in-1", p: "119,00 €", s: "TechHaus24", biz: true, inv: false, kind: "dock" },
  { d: "14.10.", t: "Gartenschlauch 20 m", p: "32,50 €", s: "Amazon", biz: false, inv: true, kind: "hose" },
  { d: "18.10.", t: "Monitor 27 Zoll 4K", p: "349,00 €", s: "Amazon", biz: true, inv: true, kind: "screen" },
];
const Thumb: React.FC<{ kind: Order["kind"]; size?: number }> = ({ kind, size = 64 }) => {
  const g = "#9A968C";
  const art: Record<Order["kind"], React.ReactNode> = {
    chair: <><rect x="13" y="6" width="22" height="20" rx="6" fill={g} /><rect x="9" y="28" width="30" height="7" rx="3.5" fill={g} /><rect x="22.5" y="35" width="3" height="7" fill={g} /><path d="M12 45 L24 41 L36 45" stroke={g} strokeWidth="3" fill="none" strokeLinecap="round" /></>,
    print: <><rect x="8" y="16" width="32" height="18" rx="4" fill={g} /><rect x="14" y="8" width="20" height="8" rx="1.5" fill="#C9C5BC" /><rect x="14" y="30" width="20" height="10" rx="1.5" fill="#FFF" stroke={g} strokeWidth="2" /></>,
    food: <><path d="M16 10 h16 l3 30 h-22 z" fill={g} /><rect x="18" y="20" width="12" height="9" rx="2" fill="#E9E6DF" /></>,
    dock: <><rect x="10" y="18" width="28" height="12" rx="4" fill={g} />{[0, 1, 2, 3].map((i) => <rect key={i} x={14 + i * 6} y="22" width="3" height="4" rx="1" fill="#E9E6DF" />)}</>,
    hose: <><circle cx="24" cy="25" r="12" fill="none" stroke={g} strokeWidth="5" /><circle cx="24" cy="25" r="5" fill="none" stroke={g} strokeWidth="3" /></>,
    screen: <><rect x="7" y="10" width="34" height="22" rx="3" fill={g} /><rect x="10" y="13" width="28" height="16" rx="1.5" fill="#D8D4CB" /><rect x="21" y="32" width="6" height="6" fill={g} /><rect x="15" y="38" width="18" height="3" rx="1.5" fill={g} /></>,
  };
  return (
    <div style={{ width: size, height: size, borderRadius: 10, background: "#F4F2ED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 48 48">{art[kind]}</svg>
    </div>
  );
};
// browser window: tab bar + url, amazon nav strip, optional claude side panel
const Browser: React.FC<{ url: string; style?: React.CSSProperties; side?: number; sideP?: number; sideEl?: React.ReactNode; children?: React.ReactNode }> = ({ url, style, side = 0, sideP = 1, sideEl, children }) => (
  <div style={{ position: "absolute", background: "#FFF", borderRadius: 22, boxShadow: shadow, overflow: "hidden", border: `1px solid ${CL.border}`, ...style }}>
    <div style={{ height: 54, background: "#ECEAE4", display: "flex", alignItems: "center", gap: 10, padding: "0 18px" }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />)}
      <div style={{ flex: 1, marginLeft: 12, height: 34, borderRadius: 17, background: "#FFF", display: "flex", alignItems: "center", padding: "0 16px", fontFamily: MONO, fontSize: 17, color: CL.sub, whiteSpace: "nowrap", overflow: "hidden" }}>{url}</div>
      <div style={{ width: 38, height: 34, borderRadius: 10, background: side ? C.orangeSoft : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}><ClaudeMark size={24} /></div>
    </div>
    <div style={{ height: 50, background: AZ.nav, display: "flex", alignItems: "center", gap: 18, padding: "0 22px" }}>
      <span style={{ fontFamily: fonts.bold, fontSize: 26, color: "#FFF", letterSpacing: "-0.01em" }}>amazon<span style={{ color: "#F3A847" }}>.de</span></span>
      <div style={{ flex: 1, height: 30, borderRadius: 6, background: "#FFF", opacity: 0.95 }} />
      <span style={{ fontFamily: fonts.semibold, fontSize: 17, color: "#FFF", whiteSpace: "nowrap" }}>Meine Bestellungen</span>
    </div>
    <div style={{ position: "absolute", left: 0, top: 104, bottom: 0, right: side * sideP }}>{children}</div>
    {side ? (
      <div style={{ position: "absolute", top: 54, bottom: 0, right: 0, width: side, background: CL.page, borderLeft: `1.5px solid ${CL.border}`, transform: `translateX(${(1 - sideP) * (side + 20)}px)`, boxShadow: "-18px 0 40px rgba(20,20,20,0.08)" }}>
        <div style={{ height: 56, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderBottom: `1px solid ${CL.border}`, background: "#FFF" }}>
          <ClaudeMark size={26} /><span style={{ fontFamily: fonts.semibold, fontSize: 21, color: CL.text }}>Claude</span>
          <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 13, letterSpacing: "0.1em", color: CL.sub }}>IN CHROME</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 56, bottom: 0, padding: 16 }}>{sideEl}</div>
      </div>
    ) : null}
  </div>
);
const OrderRow: React.FC<{ o: Order; h: number; right?: React.ReactNode; hl?: number; dim?: boolean; style?: React.CSSProperties }> = ({ o, h, right, hl = 0, dim, style }) => (
  <div style={{ height: h, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", borderBottom: `1px solid ${C.line}`, background: hl ? `rgba(217,119,87,${0.13 * hl})` : "transparent", opacity: dim ? 0.42 : 1, ...style }}>
    <Thumb kind={o.kind} size={h * 0.72} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: fonts.semibold, fontSize: 20, color: AZ.link, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.t}</div>
      <div style={{ fontFamily: fonts.medium, fontSize: 15, color: C.dim, whiteSpace: "nowrap", marginTop: 2 }}>{o.d} · {o.s} · {o.p}</div>
    </div>
    {right}
  </div>
);
const AzBtn: React.FC<{ text: string; on?: boolean; primary?: boolean; size?: number }> = ({ text, on, primary, size = 17 }) => (
  <div style={{ fontFamily: fonts.semibold, fontSize: size, color: "#0F1111", background: primary ? AZ.btn : "#FFF", border: `1.5px solid ${primary ? AZ.btnBorder : "#D5D9D9"}`, borderRadius: 999, padding: `${size * 0.42}px ${size * 1}px`, whiteSpace: "nowrap", boxShadow: on ? "0 0 0 4px rgba(217,119,87,0.35)" : "0 2px 5px rgba(15,17,17,0.12)" }}>{text}</div>
);

// ---------- hook pills (frame 0 = thumbnail): "10 Bürostühle" / "400 € zu viel bezahlt" ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const m = k(t, 0.9, 0.35, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 66, padding: "10px 28px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow }}>10 Bürostühle</div>
      <div style={{ ...pill, marginTop: -6 }}>
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -10, right: -10, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>400 € zu viel</span>
        </span>{" "}bezahlt
      </div>
    </div>
  );
};

// ---------- split hook: the chair order (paid 2.500 €), -400 €, invoice missing ----------
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const thumb = t < 0.04;
  const loss = t > A.vierhundert0 ? Math.round(interpolate(t, [A.vierhundert0, A.vierhundert0 + 0.4], [0, 400], clamp)) : 0;
  const ps = (a: number, rise = 16, from = 0.8) => (thumb ? {} : popStyle(t, a, rise, from));
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 250, width: 600, height: 520, background: "#FFF", borderRadius: 20, boxShadow: shadow, overflow: "hidden", transform: `translateX(${shakeAt(t, A.vierhundert0 + 0.4, 5)}px)`, ...ps(0.04, 24, 0.85) }}>
        <div style={{ height: 50, background: AZ.nav, display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 24, color: "#FFF" }}>amazon<span style={{ color: "#F3A847" }}>.de</span></span>
          <span style={{ marginLeft: "auto", fontFamily: fonts.semibold, fontSize: 16, color: "#FFF" }}>Meine Bestellungen</span>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 22, color: AZ.ok }}>Zugestellt</span>
            <span style={{ fontFamily: fonts.medium, fontSize: 18, color: C.dim }}>2. Oktober</span>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 16 }}>
            <Thumb kind="chair" size={150} />
            <div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: AZ.link, lineHeight: 1.2 }}>Bürostuhl Ergo Pro</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 19, color: C.dim, marginTop: 6 }}>Verkauft von: MöbelDirekt GmbH</div>
              <div style={{ display: "inline-block", marginTop: 12, fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.08em", color: C.ink, background: "#F1EFEA", borderRadius: 8, padding: "6px 12px" }}>MENGE: 10</div>
            </div>
          </div>
          <div style={{ marginTop: 22, paddingTop: 16, borderTop: `1.5px solid ${C.line}`, display: "flex", alignItems: "baseline" }}>
            <span style={{ fontFamily: fonts.medium, fontSize: 22, color: C.dim, flex: 1 }}>Gesamt bezahlt</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: C.ink }}>2.500,00 €</span>
          </div>
          {t > A.vierhundert0 ? (
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12, ...popStyle(t, A.vierhundert0, 8, 0.6) }}>
              <span style={{ fontFamily: fonts.medium, fontSize: 21, color: C.ink, flex: 1 }}>zu viel bezahlt</span>
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: C.red, fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.12 * Math.max(0, 1 - Math.abs(t - A.vierhundert0 - 0.4) / 0.2)})`, transformOrigin: "100% 50%" }}>− {eur(loss)}</span>
            </div>
          ) : null}
        </div>
      </div>
      {t > A.denn - 0.1 ? (
        <div style={{ position: "absolute", left: 690, top: 290, width: 340, height: 440, background: "#FFF", borderRadius: 18, boxShadow: "0 30px 60px rgba(20,20,20,0.16)", padding: "24px 24px", boxSizing: "border-box", transform: `rotate(${3 + Math.sin(t * 2) * 0.6}deg) translateX(${(1 - pop(t, A.denn - 0.1, 0.45)) * 420}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><PdfIcon size={44} /><span style={{ fontFamily: fonts.bold, fontSize: 28, color: C.ink }}>Rechnung</span></div>
          <div style={{ fontFamily: fonts.medium, fontSize: 17, color: C.dim, marginTop: 10 }}>MöbelDirekt GmbH</div>
          <div style={{ marginTop: 18, height: 200, border: `3px dashed ${C.line}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 17, letterSpacing: "0.1em", color: C.dim }}>KEINE RECHNUNG</div>
          <div style={{ marginTop: 18 }}><StatusPill ok={false} text="VORSTEUER: 0 €" /></div>
        </div>
      ) : null}
      <Stamp t={t} at={A.rechnung0} text="FEHLT" size={58} rot={-10} style={{ left: 740, top: 450 }} />
    </>
  );
};

// ---------- split: the math - 10 chairs x 250 €, 399,16 € VAT inside, gone without invoice ----------
const SceneMath: React.FC<{ t: number }> = ({ t }) => {
  const tileAt = (i: number) => A.zehn + 0.05 + i * ((A.zweihundert - A.zehn) / 10);
  const sum = Math.round(interpolate(t, [A.zweihundert, A.zweihundert + 0.5], [0, 2500], clamp));
  const split = k(t, A.mwst - 0.05, 0.45, Easing.inOut(Easing.cubic));
  const gone = k(t, A.ohne + 0.1, 0.3);
  const ust = Math.round(interpolate(t, [A.mwst - 0.05, A.mwst + 0.4], [0, 399.16], clamp) * 100) / 100;
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, A.zehn - 0.05, 10, 0.8) }}><LabelChip text="Die Rechnung dahinter" dot={C.orange} size={30} /></div>
      {Array.from({ length: 10 }, (_, i) => (t > tileAt(i) - 0.05 ? (
        <div key={i} style={{ position: "absolute", left: 60 + (i % 5) * 196, top: 140 + Math.floor(i / 5) * 196, width: 176, height: 176, background: "#FFF", borderRadius: 18, boxShadow: "0 10px 24px rgba(20,20,20,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, ...popStyle(t, tileAt(i) - 0.05, 14, 0.6) }}>
          <Thumb kind="chair" size={100} />
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, color: t > A.zweihundert - 0.05 ? C.ink : C.line }}>250 €</span>
        </div>) : null))}
      {t > A.zweihundert ? (
        <div style={{ position: "absolute", left: 60, top: 548, width: 960, background: "#FFF", borderRadius: 20, boxShadow: shadow, padding: "22px 28px", boxSizing: "border-box", ...popStyle(t, A.zweihundert, 16, 0.85) }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: C.ink, flex: 1 }}>10 × 250 € brutto</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{eur(sum)}</span>
          </div>
          {split > 0 ? (
            <div style={{ display: "flex", height: 64, marginTop: 16, borderRadius: 12, overflow: "hidden", opacity: k(t, A.mwst - 0.05, 0.15) }}>
              <div style={{ width: `${100 - 16 * split}%`, background: "#EDEAE4", display: "flex", alignItems: "center", padding: "0 18px", fontFamily: MONO, fontWeight: 700, fontSize: 21, color: C.dim, whiteSpace: "nowrap" }}>NETTO 2.100,84 €</div>
              <div style={{ position: "relative", width: `${16 * split}%`, minWidth: 0, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }} />
            </div>
          ) : null}
          {split > 0 ? (
            <div style={{ display: "flex", alignItems: "center", marginTop: 14, ...popStyle(t, A.mwst + 0.1, 8, 0.8) }}>
              <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.ink, flex: 1 }}>davon Mehrwertsteuer</span>
              <span style={{ position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 38, color: gone > 0 ? C.dim : C.orange, fontVariantNumeric: "tabular-nums" }}>
                {ust.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
                <span style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 5, background: C.red, transform: `scaleX(${gone})`, transformOrigin: "0% 50%" }} />
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
      <Stamp t={t} at={A.zurueck - 0.05} text="0 € ZURÜCK" size={50} rot={-6} style={{ left: 560, top: 470 }} />
    </>
  );
};

// ---------- full: "Ab heute holt Claude ..." - amazon in the browser, Claude side panel opens, task typed ----------
const FullReveal: React.FC<{ t: number }> = ({ t }) => {
  const from = A.ab - 0.08;
  const open = A.claude0 - 0.15;
  const sideP = k(t, open, 0.45, Easing.out(Easing.cubic));
  const zoom = 1 + 0.05 * k(t, from, A.oeffnest - from, Easing.inOut(Easing.sin));
  const task = "Hol mir jede fehlende Rechnung.";
  const sent = t > A.direkt - 0.05;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightBg t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", ...popStyle(t, from, 10, 0.8) }}><LabelChip text="Claude in Chrome" dot={C.orange} size={34} /></div>
        <Browser url="amazon.de/gp/your-account/order-history" side={430} sideP={sideP} style={{ left: 50, top: 340, width: 980, height: 1160, ...popStyle(t, from + 0.04, 26, 0.88) }}
          sideEl={
            <>
              <div style={{ fontFamily: fonts.medium, fontSize: 19, color: CL.sub, lineHeight: 1.4 }}>Ich kann diese Seite sehen und für dich klicken.</div>
              {sent ? (
                <>
                  <div style={{ marginTop: 18, marginLeft: 40, background: CL.bubble, borderRadius: 16, padding: "12px 16px", fontFamily: fonts.medium, fontSize: 21, color: CL.text, ...popStyle(t, A.direkt - 0.05, 10, 0.85) }}>{task}</div>
                  <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, ...popStyle(t, A.browser - 0.1, 8, 0.8) }}>
                    <ClaudeMark size={24} /><StatusPill ok text="LÄUFT IM BROWSER" />
                  </div>
                </>
              ) : null}
              <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, height: 120, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 18, padding: "14px 16px", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: fonts.medium, fontSize: 20, color: sent ? CL.sub : CL.text, flex: 1 }}>
                  {sent ? "Antworten …" : typed(task, t, open + 0.45, A.direkt - 0.2)}
                  {!sent && t > open + 0.4 && Math.floor(t * 3) % 2 === 0 ? <span style={{ display: "inline-block", width: 3, height: 22, background: C.orange, marginLeft: 3, verticalAlign: "middle" }} /> : null}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}><SendBtn size={40} on={!sent && t > open + 0.6} /></div>
              </div>
            </>
          }>
          {ORDERS.map((o, i) => <OrderRow key={i} o={o} h={120} style={popStyle(t, from + 0.1 + i * 0.04, 10, 0.95)} />)}
        </Browser>
        <Pointer t={t} path={[{ x: 760, y: 1360, at: from + 0.1 }, { x: 984, y: 367, at: open, click: true }, { x: 980, y: 1250, at: A.direkt - 0.1, click: true }, { x: 820, y: 1380, at: A.direkt + 0.5 }]} size={54} />
      </div>
      <MonoSlam t={t} at={A.browser - 0.05} text="DIREKT IM BROWSER" top={1360} size={66} bg={C.ink} hold={0.6} />
    </AbsoluteFill>
  );
};

// ---------- split: Claude scans the orders, sorts business/private, flags missing invoices ----------
const SceneScan: React.FC<{ t: number }> = ({ t }) => {
  const s0 = A.oeffnest - 0.05;
  const scanY = interpolate(t, [A.scannt, A.bestellungen + 0.6], [0, ORDERS.length], clamp);
  const tagAt = (i: number) => A.geschaeft - 0.1 + i * 0.1;
  const flagAt = (i: number) => A.fehlen - 0.05 + i * 0.12;
  const flagged = ORDERS.map((o, i) => (o.biz && !o.inv ? i : -1)).filter((i) => i >= 0);
  const RH = 86;
  const done = Math.min(ORDERS.length, Math.floor(scanY));
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, s0, 10, 0.8) }}><LabelChip text="Claude scannt deine Bestellungen" dot={C.orange} size={30} /></div>
      <Browser url="amazon.de/gp/your-account/order-history" side={330} style={{ left: 40, top: 140, width: 1000, height: 660, ...popStyle(t, s0 + 0.02, 20, 0.9) }}
        sideEl={
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {t < A.bestellungen + 0.6 ? <div style={{ width: 22, height: 22, borderRadius: "50%", border: `3px solid ${C.orangeSoft}`, borderTopColor: C.orange, transform: `rotate(${t * 540}deg)` }} /> : <Check size={24} color={C.green} />}
              <span style={{ fontFamily: fonts.semibold, fontSize: 19, color: CL.text }}>Bestellungen {done}/{ORDERS.length}</span>
            </div>
            {t > A.geschaeft - 0.1 ? (
              <div style={{ marginTop: 18, ...popStyle(t, A.geschaeft - 0.1, 8, 0.85) }}>
                <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: "0.1em", color: CL.sub }}>GESCHÄFTLICH</div>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: C.orange }}>{Math.min(4, Math.max(0, Math.round(interpolate(t, [A.geschaeft - 0.1, A.geschaeft + 0.5], [0, 4], clamp))))}</div>
              </div>
            ) : null}
            {t > A.fehlen - 0.05 ? (
              <div style={{ marginTop: 10, ...popStyle(t, A.fehlen - 0.05, 8, 0.85) }}>
                <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: "0.1em", color: CL.sub }}>RECHNUNG PRÜFEN</div>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: C.red }}>2</div>
              </div>
            ) : null}
          </>
        }>
        {ORDERS.map((o, i) => {
          const hl = Math.max(0, 1 - Math.abs(scanY - i - 0.5) * 1.6);
          const tagged = t > tagAt(i);
          const fl = flagged.indexOf(i);
          return (
            <OrderRow key={i} o={o} h={RH} hl={hl} dim={tagged && !o.biz}
              right={tagged ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, ...popStyle(t, tagAt(i), 6, 0.6) }}>
                  <Tag text={o.biz ? "GESCHÄFT" : "PRIVAT"} color={o.biz ? C.orange : "#B8B4AA"} size={14} />
                  {fl >= 0 && t > flagAt(fl) ? <div style={popStyle(t, flagAt(fl), 6, 0.5)}><Tag text="RECHNUNG?" color={C.red} size={14} /></div> : null}
                </div>) : null} />
          );
        })}
        {t > A.scannt - 0.05 && t < A.bestellungen + 0.7 ? <div style={{ position: "absolute", left: 0, right: 0, top: scanY * RH - 2, height: 4, background: C.orange, boxShadow: "0 0 16px rgba(217,119,87,0.8)", opacity: 1 - k(t, A.bestellungen + 0.5, 0.2) }} /> : null}
      </Browser>
    </>
  );
};

// ---------- split: Claude opens every invoice and downloads it, PDFs land in the bookkeeping folder ----------
const BIZ = ORDERS.map((o, i) => ({ o, i })).filter((x) => x.o.biz);
const SceneDownload: React.FC<{ t: number }> = ({ t }) => {
  const s0 = A.bei - 0.05;
  const clickAt = (j: number) => A.oeffnet + 0.05 + j * ((A.runter + 0.3 - A.oeffnet) / BIZ.length);
  const RH = 120, OX = 40, OY = 140;
  const got = BIZ.filter((_, j) => t > clickAt(j) + 0.35).length;
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, s0, 10, 0.8) }}><LabelChip text="Claude lädt jede Rechnung" dot={C.orange} size={30} /></div>
      {t > A.schaust - 0.05 ? <div style={{ position: "absolute", right: 50, top: 58, ...popStyle(t, A.schaust - 0.05, 10, 0.6) }}><Tag text="DU: NUR ZUSCHAUEN" color={C.green} size={22} /></div> : null}
      <Browser url="amazon.de/gp/your-account/order-history" side={330} style={{ left: OX, top: OY, width: 1000, height: 660, ...popStyle(t, s0 + 0.02, 20, 0.9) }}
        sideEl={
          <>
            <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: "0.1em", color: CL.sub }}>ORDNER · BUCHHALTUNG/2026-10</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {BIZ.map((b, j) => (t > clickAt(j) + 0.35 ? (
                <div key={j} style={popStyle(t, clickAt(j) + 0.35, 10, 0.6)}><FileChip name={`2026-10-${b.o.d.slice(0, 2)}_${b.o.s.split(" ")[0]}.pdf`} meta={b.o.p} size={0.78} /></div>) : null))}
            </div>
            <div style={{ position: "absolute", left: 16, bottom: 18 }}><Tag text={`${got}/${BIZ.length} GELADEN`} color={got === BIZ.length ? C.green : C.ink} size={18} /></div>
          </>
        }>
        {BIZ.map((b, j) => (
          <OrderRow key={j} o={b.o} h={RH} style={popStyle(t, s0 + 0.08 + j * 0.05, 10, 0.95)}
            right={<AzBtn text={t > clickAt(j) + 0.1 ? "✓ Geladen" : "Rechnung"} on={t > clickAt(j) - 0.25 && t < clickAt(j) + 0.2} />} />
        ))}
      </Browser>
      {BIZ.map((b, j) => {
        const a = clickAt(j) + 0.05, p = k(t, a, 0.32, Easing.inOut(Easing.cubic));
        if (t < a || t > a + 0.34) return null;
        const x0 = OX + 670 - 330 - 60, y0 = OY + 104 + j * RH + RH / 2, x1 = OX + 1000 - 300, y1 = OY + 150 + j * 80;
        return <div key={j} style={{ position: "absolute", left: x0 + (x1 - x0) * p, top: y0 + (y1 - y0) * p - Math.sin(p * Math.PI) * 60, transform: `scale(${1 - 0.3 * p})`, zIndex: 20 }}><PdfIcon size={44} /></div>;
      })}
      <Pointer t={t} path={[{ x: 700, y: 780, at: s0 + 0.1 }, ...BIZ.map((_, j) => ({ x: OX + 670 - 330 - 70, y: OY + 104 + j * RH + RH / 2, at: clickAt(j), click: true })), { x: 560, y: 760, at: clickAt(BIZ.length - 1) + 0.6 }]} />
    </>
  );
};

// ---------- split: Claude checks each invoice: company, VAT, delivery date ----------
const SceneCheck: React.FC<{ t: number }> = ({ t }) => {
  const s0 = A.dann - 0.05;
  const sweep = interpolate(t, [A.pruef, A.einzelne + 0.3], [0, 1], clamp);
  const rows = [
    { k: "Rechnung an deine Firma", a: A.firma, ok: false, v: "Max M. (privat)" },
    { k: "Umsatzsteuer ausgewiesen", a: A.umsatzsteuer, ok: true, v: "19 % · 399,16 €" },
    { k: "Leistungsdatum", a: A.leistung, ok: false, v: "fehlt" },
  ];
  const inv = (label: string, value: string, a: number, ok: boolean) => (
    <div style={{ display: "flex", justifyContent: "space-between", height: 44, alignItems: "center", margin: "0 -10px", padding: "0 10px", borderRadius: 8, background: t > a ? (ok ? C.greenSoft : C.redSoft) : "transparent", border: `2px solid ${t > a ? (ok ? C.green : C.red) : "transparent"}` }}>
      <span style={{ fontFamily: MONO, fontSize: 15, color: C.dim }}>{label}</span>
      <span style={{ fontFamily: fonts.semibold, fontSize: 18, color: value === "—" ? C.red : C.ink }}>{value}</span>
    </div>
  );
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, s0, 10, 0.8) }}><LabelChip text="Claude prüft jede einzelne" dot={C.orange} size={30} /></div>
      {t > A.einzelne - 0.05 ? <div style={{ position: "absolute", right: 50, top: 58, ...popStyle(t, A.einzelne - 0.05, 10, 0.6) }}><Tag text="§ 14 UStG" color={C.ink} size={24} /></div> : null}
      <div style={{ position: "absolute", left: 60, top: 140, width: 470, height: 650, background: "#FFF", borderRadius: 16, boxShadow: shadow, padding: "26px 30px", boxSizing: "border-box", overflow: "hidden", transform: `rotate(-1.5deg)`, ...popStyle(t, s0 + 0.02, 24, 0.85) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 26, color: C.ink }}>MöbelDirekt GmbH</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 15, color: C.dim }}>Industriestr. 4 · 33602 Bielefeld</div>
          </div>
          <PdfIcon size={40} />
        </div>
        <div style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink, marginTop: 22, letterSpacing: "0.03em" }}>RECHNUNG</div>
        <div style={{ fontFamily: MONO, fontSize: 15, color: C.dim, marginTop: 4 }}>Nr. 2026-1043 · 02.10.2026</div>
        <div style={{ marginTop: 16 }}>
          {inv("AN", "Max M.", A.firma, false)}
          {inv("ARTIKEL", "10 × Bürostuhl", 999, true)}
          {inv("NETTO", "2.100,84 €", 999, true)}
          {inv("USt 19 %", "399,16 €", A.umsatzsteuer, true)}
          {inv("LIEFERDATUM", "—", A.leistung, false)}
        </div>
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: `2px solid ${C.ink}`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 20, color: C.ink }}>Gesamt</span>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, color: C.ink }}>2.500,00 €</span>
        </div>
        {sweep > 0 && sweep < 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: sweep * 650 - 30, height: 60, background: "linear-gradient(180deg, rgba(217,119,87,0), rgba(217,119,87,0.28), rgba(217,119,87,0))" }} /> : null}
      </div>
      <div style={{ position: "absolute", left: 570, top: 140, width: 460, height: 650, background: CL.page, borderRadius: 22, boxShadow: shadow, border: `1px solid ${CL.border}`, overflow: "hidden", ...popStyle(t, s0 + 0.1, 20, 0.88) }}>
        <div style={{ height: 58, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderBottom: `1px solid ${CL.border}`, background: "#FFF" }}>
          <ClaudeMark size={26} /><span style={{ fontFamily: fonts.semibold, fontSize: 21, color: CL.text }}>Pflichtangaben</span>
          <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 14, color: CL.sub }}>1 / 4</span>
        </div>
        <div style={{ padding: "10px 20px" }}>
          {rows.map((r, i) => (t > r.a - 0.05 ? (
            <div key={i} style={{ padding: "16px 0", borderBottom: `1px solid ${CL.border}`, ...popStyle(t, r.a - 0.05, 8, 0.85) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: r.ok ? C.green : C.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#FFF", fontFamily: fonts.bold, fontSize: 24 }}>{r.ok ? <Check size={24} p={k(t, r.a + 0.05, 0.2)} /> : "!"}</span>
                <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: CL.text, flex: 1 }}>{r.k}</span>
              </div>
              <div style={{ marginTop: 8, marginLeft: 46 }}><StatusPill ok={r.ok} text={r.ok ? "OK" : "FEHLT"} /></div>
            </div>) : null))}
          {t > A.leistung + 0.4 ? (
            <div style={{ marginTop: 16, background: C.redSoft, borderLeft: `6px solid ${C.red}`, borderRadius: 10, padding: "12px 16px", fontFamily: fonts.semibold, fontSize: 20, color: CL.text, ...popStyle(t, A.leistung + 0.4, 8, 0.8) }}>Vorsteuer gefährdet: 399,16 €</div>
          ) : null}
        </div>
      </div>
    </>
  );
};

// ---------- full: Claude clicks "Rechnung anfordern" and writes what is missing ----------
const FullRequest: React.FC<{ t: number }> = ({ t }) => {
  const from = A.fehlt0 - 0.16;
  const click = A.anfordern - 0.05;
  const modal = k(t, click + 0.15, 0.3, Easing.out(Easing.cubic));
  const msg = `Guten Tag, für Bestellung 302-4471 brauche ich eine Rechnung nach § 14 UStG an ${BUYER}, Hauptstr. 12, Köln. Es fehlt: Firmenname und Leistungsdatum.`;
  const send = Math.min(A.fehlt1 + 0.35, A.einloggen - 0.25);
  const sent = t > send + 0.05;
  const zoom = 1 + 0.04 * k(t, from, 5, Easing.inOut(Easing.sin));
  const OX = 60, OY = 360;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightBg t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", ...popStyle(t, from, 10, 0.8) }}><LabelChip text="Fehlt was? Claude fordert an" dot={C.red} size={32} /></div>
        <Browser url="amazon.de/gp/your-account/order-details?orderID=302-4471" style={{ left: OX, top: OY, width: 960, height: 1160, ...popStyle(t, from + 0.04, 26, 0.88) }}>
          <div style={{ padding: "26px 30px" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink }}>Bestelldetails</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 19, color: C.dim, marginTop: 6 }}>Bestellt am 2. Oktober 2026 · Bestellnr. 302-4471</div>
            <div style={{ display: "flex", gap: 22, marginTop: 26, paddingTop: 22, borderTop: `1px solid ${C.line}` }}>
              <Thumb kind="chair" size={150} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: AZ.link }}>Bürostuhl Ergo Pro · 10 Stück</div>
                <div style={{ fontFamily: fonts.medium, fontSize: 19, color: C.dim, marginTop: 6 }}>Verkauft von: <span style={{ color: AZ.link }}>MöbelDirekt GmbH</span></div>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: C.ink, marginTop: 10 }}>2.500,00 €</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14, marginTop: 30 }}>
              <AzBtn text={sent ? "✓ Rechnung angefordert" : "Rechnung anfordern"} primary on={t > click - 0.35 && t < click + 0.25} size={24} />
              <AzBtn text="Verkäufer kontaktieren" size={24} />
              <AzBtn text="Artikel zurücksenden" size={24} />
            </div>
          </div>
          {modal > 0 && !sent ? (
            <div style={{ position: "absolute", inset: 0, background: `rgba(15,17,17,${0.35 * modal})` }}>
              <div style={{ position: "absolute", left: 50, right: 50, top: 230, background: "#FFF", borderRadius: 18, boxShadow: "0 30px 70px rgba(0,0,0,0.3)", padding: "26px 28px", opacity: modal, transform: `translateY(${(1 - modal) * 40}px)` }}>
                <div style={{ fontFamily: fonts.bold, fontSize: 28, color: C.ink }}>Rechnung anfordern</div>
                <div style={{ fontFamily: fonts.medium, fontSize: 18, color: C.dim, marginTop: 4 }}>an MöbelDirekt GmbH</div>
                <div style={{ marginTop: 18, minHeight: 250, border: `2px solid ${t > A.schreibt - 0.1 ? C.orange : "#D5D9D9"}`, borderRadius: 12, padding: "16px 18px", fontFamily: fonts.medium, fontSize: 24, color: C.ink, lineHeight: 1.4 }}>
                  {typed(msg, t, A.schreibt - 0.05, A.fehlt1 + 0.1)}
                  {Math.floor(t * 3) % 2 === 0 ? <span style={{ display: "inline-block", width: 3, height: 26, background: C.orange, marginLeft: 3, verticalAlign: "middle" }} /> : null}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}><AzBtn text="Senden" primary on={t > send - 0.3} size={24} /></div>
              </div>
            </div>
          ) : null}
        </Browser>
        {sent ? <div style={{ position: "absolute", left: 0, right: 0, top: 1440, display: "flex", justifyContent: "center", ...popStyle(t, send + 0.05, 10, 0.6) }}><Tag text="✓ ANGEFORDERT" color={C.green} size={30} /></div> : null}
        <Pointer t={t} path={[{ x: 760, y: 1360, at: from + 0.1 }, { x: OX + 160, y: OY + 104 + 26 + 32 + 30 + 220 + 30 + 32, at: click, click: true }, { x: OX + 760, y: OY + 104 + 230 + 26 + 60 + 270 + 50, at: send, click: true }, { x: 800, y: 1390, at: send + 0.5 }]} size={54} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- split: you log in yourself, Claude does the rest ----------
const SceneLogin: React.FC<{ t: number }> = ({ t }) => {
  const s0 = A.einloggen - 0.05;
  const pw = Math.round(interpolate(t, [s0 + 0.3, A.selbst2], [0, 10], clamp));
  const ITEMS = ["Bestellungen gescannt", "Rechnungen geladen", "Pflichtangaben geprüft", "Fehlende angefordert"];
  const itemAt = (i: number) => A.rest - 0.05 + i * 0.16;
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 150, width: 440, height: 600, background: "#FFF", borderRadius: 20, boxShadow: shadow, padding: "30px 30px", boxSizing: "border-box", ...popStyle(t, s0, 20, 0.85) }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 26, color: C.ink }}>amazon<span style={{ color: "#F3A847" }}>.de</span></div>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, color: C.ink, marginTop: 24 }}>Anmelden</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 17, color: C.dim, marginTop: 20 }}>E-Mail</div>
        <div style={{ height: 52, border: "1.5px solid #A6A6A6", borderRadius: 8, marginTop: 6, display: "flex", alignItems: "center", padding: "0 14px", fontFamily: fonts.medium, fontSize: 19, color: C.ink }}>max@muster-gmbh.de</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 17, color: C.dim, marginTop: 16 }}>Passwort</div>
        <div style={{ height: 52, border: `2px solid ${C.orange}`, borderRadius: 8, marginTop: 6, display: "flex", alignItems: "center", padding: "0 14px", fontFamily: fonts.bold, fontSize: 24, color: C.ink, letterSpacing: "0.2em" }}>{"•".repeat(pw)}</div>
        <div style={{ marginTop: 24 }}><AzBtn text="Anmelden" primary size={22} /></div>
        <div style={{ position: "absolute", right: -18, top: -18, ...popStyle(t, s0 + 0.15, 8, 0.5) }}><Tag text="MACHST DU" color={C.orange} size={22} /></div>
      </div>
      {t > A.rest - 0.2 ? (
        <div style={{ position: "absolute", left: 540, top: 150, width: 490, height: 600, background: CL.page, borderRadius: 22, boxShadow: shadow, border: `1px solid ${CL.border}`, padding: "26px 26px", boxSizing: "border-box", ...popStyle(t, A.rest - 0.2, 20, 0.85) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><ClaudeMark size={34} /><span style={{ fontFamily: fonts.bold, fontSize: 30, color: CL.text }}>Den Rest macht Claude</span></div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
            {ITEMS.map((s, i) => (t > itemAt(i) ? (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, height: 76, background: "#FFF", borderRadius: 14, border: `1.5px solid ${CL.border}`, padding: "0 18px", ...popStyle(t, itemAt(i), 10, 0.7) }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={26} p={k(t, itemAt(i) + 0.05, 0.2)} /></span>
                <span style={{ fontFamily: fonts.semibold, fontSize: 23, color: CL.text, whiteSpace: "nowrap" }}>{s}</span>
              </div>) : null))}
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------- split: CTA - trigger pill + fast tilted scroll through the real guide pages ----------
const PAGES = Array.from({ length: 9 }, (_, i) => staticFile(`amazon-guide/p${i + 1}.png`));
const PDF = { left: 200, top: 196, w: 680, h: 600, bar: 64, pw: 600, ph: Math.round((600 * 842) / 595), gap: 22 };
const PITCH = PDF.ph + PDF.gap;
const SAMPLES = 8, SHUTTER = 0.6 / FPS;
const SceneCta: React.FC<{ t: number }> = ({ t }) => {
  const IN = A.komm + 0.15, A0 = A.alle - 0.2, B0 = AM_END - 0.25;
  const scrollY = (x: number) => interpolate(x, [A0, B0], [0, (PAGES.length - 1) * PITCH], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const inY = interpolate(t, [IN, IN + 0.35], [PDF.h + 300, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const y = scrollY(t);
  const page = Math.min(PAGES.length, Math.max(1, Math.floor((y + (PDF.h - PDF.bar) / 2) / PITCH) + 1));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 46, display: "flex", justifyContent: "center", zIndex: 45 }}>
        <div style={{ display: "flex", ...popStyle(t, A.komm - 0.05, 14, 0.5) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "18px 18px 18px 26px", display: "flex", alignItems: "center" }}>KOMMENTIERE:</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "8px 26px 8px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)", minWidth: 120 }}>{typed("AMAZON", t, A.amazon2 - 0.1, A.amazon2 + 0.25) || " "}</div>
        </div>
      </div>
      {t > A.alle - 0.1 ? (
        <div style={{ position: "absolute", right: 40, top: 230, zIndex: 46, ...popStyle(t, A.alle - 0.1, 10, 0.6) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.chip, borderRadius: 999, padding: "10px 18px" }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: C.green }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: "0.08em", color: "#FFF" }}>ALLE PROMPTS · PER DM</span>
          </div>
        </div>
      ) : null}
      {t > IN ? (
        <div style={{ position: "absolute", left: PDF.left, top: PDF.top, width: PDF.w, height: PDF.h + 80, borderRadius: "22px 22px 0 0", overflow: "hidden", background: "#E9E7E1", boxShadow: "0 30px 70px rgba(0,0,0,0.35)", transform: `translateY(${inY}px) perspective(1400px) rotateX(8deg) rotate(-2deg)`, transformOrigin: "50% 0%" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: PDF.bar, background: C.chip, display: "flex", alignItems: "center", padding: "0 22px", gap: 12, zIndex: 2 }}>
            <PdfIcon size={34} />
            <div style={{ fontFamily: fonts.semibold, fontSize: 23, color: "#FFF", whiteSpace: "nowrap" }}>Amazon-Rechnungen – Prompts.pdf</div>
            <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 22, color: "#FFF", background: C.orange, borderRadius: 9, padding: "5px 12px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{page} / {PAGES.length}</div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: PDF.bar, bottom: 0, overflow: "hidden" }}>
            {Array.from({ length: SAMPLES }, (_, j) => {
              const yy = scrollY(t - (j / (SAMPLES - 1)) * SHUTTER);
              return (
                <div key={j} style={{ position: "absolute", left: (PDF.w - PDF.pw) / 2, top: 20 - yy, opacity: 1 / (j + 1) }}>
                  {PAGES.map((src, i) => <Img key={i} src={src} style={{ position: "absolute", left: 0, top: i * PITCH, width: PDF.pw, height: PDF.ph, borderRadius: 6, boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />)}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {t > A.alle + 0.2 ? <div style={{ position: "absolute", left: 60, top: 640, zIndex: 46, ...popStyle(t, A.alle + 0.2, 10, 0.6) }}><Tag text="9 SEITEN" color={C.green} size={24} /></div> : null}
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }>; full?: boolean };
const SCENES: Scene[] = [
  { from: 0, to: A.zehn - 0.05, origin: "50% 50%", El: SceneHook },
  { from: A.zehn - 0.05, to: A.ab - 0.08, origin: "50% 45%", El: SceneMath },
  { from: A.ab - 0.08, to: A.oeffnest - 0.05, origin: "50% 50%", El: FullReveal, full: true },
  { from: A.oeffnest - 0.05, to: A.bei - 0.05, origin: "50% 45%", El: SceneScan },
  { from: A.bei - 0.05, to: A.dann - 0.05, origin: "50% 45%", El: SceneDownload },
  { from: A.dann - 0.05, to: A.fehlt0 - 0.16, origin: "50% 45%", El: SceneCheck },
  { from: A.fehlt0 - 0.16, to: A.einloggen - 0.05, origin: "50% 50%", El: FullRequest, full: true },
  { from: A.einloggen - 0.05, to: A.komm - 0.1, origin: "50% 45%", El: SceneLogin },
  { from: A.komm - 0.1, to: 999, origin: "50% 30%", El: SceneCta },
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

// ---------- master ----------
const FOCUS = { x: 0.509, y: 0.597, scale: 1.0 };
const SPLIT_SRC_TOP = 430;
export const AmazonOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = camera(t, scene.from, scene.to);
  const dx = Math.sin(t * 0.6) * 6, dy = Math.cos(t * 0.45) * 5;
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTop = Math.min(PH, Math.max(H - vh, PH - SPLIT_SRC_TOP * s));
  const avPush = 1 + 0.035 * Math.abs(Math.sin((t - scene.from) * 0.9));
  const El = scene.El;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${avPush})`, transformOrigin: "50% 40%" }}>
        <OffthreadVideo src={staticFile("render-fpn-amazon-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {scene.full ? <El t={t} /> : (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
          </div>
          {t < A.zehn - 0.08 ? <HookPills t={t} /> : null}
        </div>
      )}
      <SeamCaption t={t} y={scene.full ? 1610 : PH} />
    </AbsoluteFill>
  );
};
