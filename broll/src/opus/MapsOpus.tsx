import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import { MapStage, GPin, GSearch, GChip, GResult, GField, GProfileHead, GPhoto, MapsLogo, G, GF, deep, tilt3d, gback as back, type Cam, type Biz } from "./GMapsKit";
import captions from "../../runs/fpn-google-maps/captions.json";

// FP-N "Bei Google Maps unsichtbar" (2026-10-26): Hook = ein einziges Feld (Hauptkategorie) entscheidet, ob Kunden dich finden.
// Heller Superkind-Look (weiß/orange), Stil wie BewirtungOpus, Zeiten an captions.json verankert.

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const MP_END = LAST_END + 0.7;
export const MP_FRAMES = Math.round(MP_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  einziges: at("einziges"), feld0: at("feld", 0), kunden: at("kunden"), finden: at("finden"), falsche: at("falsche"),
  claude0: at("claude", 0), viertelstunde: at("viertelstunde"), schreibt0: at("schreibt", 0), neu: at("neu"),
  schritt0: at("schritt", 0), suchst: at("suchst"), stadt: at("stadt"), screenshots: at("screenshots"), dir1: at("dir", 1), claude1: at("claude", 1), nebeneinander: at("nebeneinander"), fehlt: at("fehlt"),
  jetzt: at("jetzt"), feld1: at("feld", 1),
  schritt1: at("schritt", 1), claude2: at("claude", 2), hauptkategorie: at("hauptkategorie"), maler0: at("maler", 0), farbengeschaeft: at("farbengeschäft"), maler1: at("maler", 1), naehe: at("nähe"), kaum: at("kaum"), passt: at("passt"),
  schritt2: at("schritt", 2), leistungen: at("leistungen"), beschreibung: at("beschreibung"), woche: at("woche"), beitrag: at("beitrag"), nachricht: at("nachricht"), auftrag: at("auftrag"), bewertung: at("bewertung"), holt: at("holt"),
  prompts: at("prompts"), checkliste: at("checkliste"), guide: at("guide"), komm: at("kommentiere"), trigger: at("maps", 1), folg: at("folg"),
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
// ---------- hook pills (frame 0 = thumbnail): "1 Feld falsch" (struck) / "mit Claude Top 3" ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const strike = k(t, 0.85, 0.3, Easing.inOut(Easing.cubic));
  const m = k(t, 1.15, 0.35, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 62, padding: "10px 26px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow }}>
        1 Feld{" "}
        <span style={{ position: "relative", display: "inline-block", color: C.red }}>
          falsch
          <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 9, background: C.ink, borderRadius: 4, transform: `scaleX(${strike})`, transformOrigin: "0% 50%" }} />
        </span>
      </div>
      <div style={{ ...pill, marginTop: -6 }}>
        mit Claude{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -8, right: -8, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>Top 3</span>
        </span>
      </div>
    </div>
  );
};

// ---------- Google-Maps scenes (GMapsKit: real Maps logo, Google Sans, 2.5D map, Material fields; businesses are made up) ----------
const BIZ: Biz[] = [
  { name: "Malerei Kraus", r: 4.8, n: 127, cat: "Maler", street: "Maximilianstr. 14", hue: 28 },
  { name: "Farbwerk Huber", r: 4.7, n: 89, cat: "Maler", street: "Karlstr. 3", hue: 205 },
  { name: "Maler Stein", r: 4.9, n: 154, cat: "Maler", street: "Bahnhofstr. 22", hue: 140 },
];
const YOU: Biz = { name: "Dein Betrieb", r: 4.9, n: 61, cat: "Farbengeschäft", street: "Am Stadtpark 5", hue: 350 };
const PINXY: [number, number][] = [[1120, 1330], [1360, 1180], [1230, 1520]];
const YOUXY: [number, number] = [1640, 900];
const MapBg: React.FC<{ t: number; blur?: number }> = ({ t, blur = 7 }) => {
  const cam: Cam = { fx: 1300 + t * 10, fy: 1300, tilt: 55, rz: -16 + Math.sin(t * 0.3) * 3, s: 0.85 };
  return (
    <>
      <div style={{ position: "absolute", inset: -40, filter: `blur(${blur}px)` }}><MapStage w={1160} h={2000} cam={cam} t={t} cy={0.6} /></div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(248,249,250,0.55), rgba(248,249,250,0.25) 45%, rgba(248,249,250,0.6))" }} />
    </>
  );
};
const PanelCard: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", background: "#FFF", borderRadius: 26, boxShadow: deep, overflow: "hidden", ...style }}>{children}</div>
);

// ---------- split hook: one single field decides if customers find you; it holds the wrong value ----------
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const thumb = t < 0.04;
  const on = (a: number) => thumb || t > a;
  const hot = on(A.feld0 - 0.1);
  const wrong = on(A.falsche - 0.1);
  const glow = thumb ? 1 : hot ? 0.5 + 0.5 * Math.abs(Math.sin((t - A.feld0) * 4)) : 0;
  const cam: Cam = { fx: 1560 + t * 12, fy: 1200, tilt: 54, rz: -12 + Math.sin(t * 0.5) * 2.5, s: 0.78 + t * 0.012 };
  const pinP = (i: number) => (thumb ? 1 : back(t, A.kunden - 0.12 + i * 0.09, 0.5));
  return (
    <>
      <MapStage w={W} h={PH} cam={cam} t={t}>
        {PINXY.map(([x, y], i) => <GPin key={i} x={x} y={y} cam={cam} p={pinP(i)} name={BIZ[i].name} rating={BIZ[i].r} size={66} />)}
        <GPin x={YOUXY[0]} y={YOUXY[1]} cam={cam} p={thumb ? 1 : on(A.finden - 0.1) ? back(t, A.finden - 0.1, 0.5) : 0} color="#9AA0A6" name="Dein Betrieb" dim size={52} />
      </MapStage>
      <GSearch text="Maler in der Nähe" w={500} fs={24} style={{ left: 34, top: 226, ...(thumb ? {} : popStyle(t, 0.05, 16, 0.9)) }} />
      <div style={{ position: "absolute", left: 34, top: 300, display: "flex", gap: 10, ...(thumb ? {} : popStyle(t, 0.12, 10, 0.9)) }}><GChip text="Bewertung" fs={18} /><GChip text="Jetzt geöffnet" fs={18} /></div>
      <PanelCard style={{ left: 584, top: 214, width: 466, height: 576, transform: tilt3d(t, 4, -12), transformOrigin: "0% 50%", ...(thumb ? {} : popStyle(t, 0.1, 24, 0.85)) }}>
        <GProfileHead fs={21} />
        <div style={{ padding: "22px 22px 0", display: "flex", flexDirection: "column", gap: 26, opacity: hot ? 0.4 : 1 }}>
          <GField label="Unternehmensname" value="Dein Betrieb" w={420} fs={21} icon={false} />
          <GField label="Telefon" value="0821 447120" w={420} fs={21} icon={false} />
        </div>
        <div style={{ padding: "30px 22px 0", transform: `translateX(${shakeAt(t, A.falsche, 8)}px) scale(${hot && !thumb ? 1 + 0.05 * pop(t, A.feld0 - 0.1, 0.35) : thumb ? 1.04 : 1})`, transformOrigin: "50% 30%" }}>
          <GField label="Hauptkategorie" value={wrong ? "Farbengeschäft" : hot ? "" : "Farbengeschäft"} state={wrong ? "err" : hot ? "focus" : "idle"} w={420} fs={26} glow={glow} caret={hot && !wrong && Math.floor(t * 4) % 2 === 0} helper={wrong ? "Passt nicht zu „Maler in der Nähe“" : undefined} />
        </div>
        {hot ? <div style={{ position: "absolute", right: 22, top: 238, ...(thumb ? {} : popStyle(t, A.einziges - 0.05, 8, 0.4)) }}><Tag text="1 FELD" color={wrong ? G.err : G.blue} size={18} /></div> : null}
      </PanelCard>
    </>
  );
};

// ---------- full: Claude fills the profile like the top 3, in 15 minutes ----------
const PROFILE = [
  { k: "Hauptkategorie", v: "Maler" },
  { k: "Leistungen", v: "14 Leistungen" },
  { k: "Beschreibung", v: "750 Zeichen" },
  { k: "Beiträge", v: "1 pro Woche" },
  { k: "Bewertungen", v: "nach jedem Auftrag" },
];
const FullSolution: React.FC<{ t: number }> = ({ t }) => {
  const from = A.claude0 - 0.1;
  const zoom = 1 + 0.04 * k(t, from, 3, Easing.inOut(Easing.sin));
  const end = A.neu + 0.2;
  const rowAt = (i: number) => A.schreibt0 + i * ((end - A.schreibt0) / PROFILE.length);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#F8F9FA" }}>
      <MapBg t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", ...popStyle(t, from, 10, 0.8) }}><LabelChip text="Claude füllt dein Profil aus" dot={C.orange} size={32} /></div>
        <PanelCard style={{ left: 110, top: 310, width: 860, height: 880, transform: tilt3d(t, 7, -7), ...popStyle(t, from + 0.04, 30, 0.85) }}>
          <GProfileHead fs={30} title="Unternehmensprofil" />
          <div style={{ padding: "40px 46px 0", display: "flex", flexDirection: "column", gap: 44 }}>
            {PROFILE.map((r, i) => {
              const a = rowAt(i), on = t > a;
              return (
                <div key={i} style={{ transform: `scale(${on ? 1 + 0.03 * Math.max(0, 1 - Math.abs((t - a) / 0.2 - 1)) : 1})` }}>
                  <GField label={r.k} value={on ? typed(r.v, t, a, a + 0.22) : ""} state={on && t > a + 0.22 ? "ok" : on ? "focus" : "idle"} w={768} fs={30} icon={false} caret={on && t < a + 0.22} />
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", right: 34, bottom: 30, display: "flex", alignItems: "center", gap: 10, fontFamily: GF, fontSize: 22, color: G.sub }}><ClaudeMark size={30} />ausgefüllt mit Claude</div>
        </PanelCard>
        {t > A.viertelstunde - 0.1 ? (
          <PanelCard style={{ left: 150, top: 1240, width: 780, height: 140, borderRadius: 30, display: "flex", alignItems: "center", gap: 24, padding: "0 34px", boxSizing: "border-box", transform: tilt3d(t, 7, -7, 40), ...popStyle(t, A.viertelstunde - 0.1, 24, 0.6) }}>
            <div style={{ width: 84, height: 84, borderRadius: 22, background: G.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3.5 2" size={54} color={G.blue} sw={1.8} /></div>
            <div style={{ flex: 1, fontFamily: GF, fontWeight: 500, fontSize: 40, color: G.text, whiteSpace: "nowrap" }}>Eine Viertelstunde</div>
            <BigTag text="15 MIN" bg={C.orange} size={44} />
          </PanelCard>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- split: step 1, search "Maler Augsburg", screenshots of the top 3 + you, Claude compares ----------
const CMP = [
  { k: "Hauptkategorie", top: "Maler", you: "Farbengeschäft" },
  { k: "Leistungen", top: "12 – 18", you: "keine" },
  { k: "Beiträge", top: "wöchentlich", you: "keine" },
  { k: "Fotos", top: "40+", you: "3" },
];
const SceneStep1: React.FC<{ t: number }> = ({ t }) => {
  const s0 = A.schritt0;
  const QUERY = "Maler Augsburg";
  const shotAt = (i: number) => (i < 3 ? A.screenshots + i * 0.14 : A.dir1 - 0.05);
  const claudeIn = A.claude1 - 0.12;
  const showClaude = t > claudeIn;
  const miss = t > A.fehlt - 0.1;
  const sheetIn = A.screenshots - 0.3;
  const cam: Cam = { fx: 1300 + (t - s0) * 18, fy: 1300, tilt: 52, rz: -14 + Math.sin(t * 0.5) * 2, s: 0.82 + 0.16 * k(t, A.stadt, 0.8, Easing.inOut(Easing.cubic)) };
  return (
    <>
      {!showClaude ? (
        <>
          <MapStage w={W} h={PH} cam={cam} t={t}>
            {PINXY.map(([x, y], i) => <GPin key={i} x={x} y={y} cam={cam} p={back(t, A.stadt + 0.1 + i * 0.08, 0.5)} name={BIZ[i].name} rating={BIZ[i].r} size={62} />)}
            <GPin x={YOUXY[0]} y={YOUXY[1]} cam={cam} p={back(t, A.stadt + 0.4, 0.5)} color="#9AA0A6" name="Dein Betrieb" dim size={50} />
          </MapStage>
          <GSearch text={typed(QUERY, t, A.suchst - 0.05, A.stadt + 0.15)} caret={t < A.stadt + 0.15 && Math.floor(t * 4) % 2 === 0} w={600} fs={28} style={{ left: 40, top: 136, ...popStyle(t, s0 + 0.02, 14, 0.9) }} />
          <div style={{ position: "absolute", left: 40, top: 222, display: "flex", gap: 10, ...popStyle(t, s0 + 0.1, 10, 0.9) }}><GChip text="Bewertung" fs={19} /><GChip text="Jetzt geöffnet" fs={19} /><GChip text="Top bewertet" fs={19} /></div>
          {t > sheetIn ? (
            <PanelCard style={{ left: 566, top: 120, width: 470, height: 680, borderRadius: 24, transform: `${tilt3d(t, 2, -6)} translateX(${(1 - k(t, sheetIn, 0.4)) * 500}px)`, transformOrigin: "100% 50%" }}>
              <div style={{ padding: "18px 22px 10px", fontFamily: GF, fontSize: 24, color: G.text, borderBottom: `1px solid ${G.line}` }}>Ergebnisse</div>
              {[...BIZ, YOU].map((b, i) => {
                const a = shotAt(i);
                const flash = t > a ? 1 - k(t, a, 0.25) : 0;
                return (
                  <div key={i} style={{ position: "relative" }}>
                    <GResult b={b} w={470} fs={17} rank={i < 3 ? i + 1 : 7} dim={i === 3} actions={false} />
                    {flash > 0 ? <div style={{ position: "absolute", inset: 0, background: "#FFF", opacity: flash, boxShadow: `inset 0 0 0 ${6 * flash}px ${G.blue}` }} /> : null}
                    {t > a ? <div style={{ position: "absolute", right: 104, top: 12, ...popStyle(t, a, 4, 0.5) }}><Tag text="SCREENSHOT" color={G.blue} size={12} /></div> : null}
                  </div>
                );
              })}
            </PanelCard>
          ) : null}
        </>
      ) : (
        <ClaudeWin title="Vergleich Top 3" style={{ left: 50, top: 140, width: 980, height: 650, transform: tilt3d(t, 4, -6), boxShadow: deep, ...popStyle(t, claudeIn, 20, 0.9) }}>
          <div style={{ position: "absolute", right: 24, top: 18, display: "flex", alignItems: "center", gap: 10 }}>
            <Tag text="4 SCREENSHOTS" color={C.ink} size={16} />
            <div style={{ background: CL.bubble, borderRadius: 18, padding: "10px 18px", fontFamily: fonts.medium, fontSize: 22, color: CL.text }}>Vergleich mich mit den Top 3.</div>
          </div>
          <div style={{ position: "absolute", left: 24, top: 96, right: 24, display: "flex", gap: 14 }}>
            <ClaudeMark size={30} />
            <div style={{ flex: 1, border: `1.5px solid ${CL.border}`, borderRadius: 14, overflow: "hidden", background: "#FFF" }}>
              <div style={{ display: "flex", height: 60, background: CL.page, borderBottom: `1px solid ${CL.border}`, fontFamily: MONO, fontWeight: 800, fontSize: 18, letterSpacing: "0.08em", color: CL.sub, alignItems: "center" }}>
                <span style={{ width: 280, paddingLeft: 18 }}> </span><span style={{ flex: 1 }}>TOP 3</span><span style={{ flex: 1 }}>DU</span>
              </div>
              {CMP.map((r, i) => {
                const a = A.nebeneinander - 0.1 + i * 0.12;
                return t > a ? (
                  <div key={i} style={{ display: "flex", alignItems: "center", height: 92, borderBottom: i < CMP.length - 1 ? `1px solid ${CL.border}` : "none", ...popStyle(t, a, 8, 0.9) }}>
                    <span style={{ width: 280, paddingLeft: 18, fontFamily: fonts.semibold, fontSize: 25, color: CL.text }}>{r.k}</span>
                    <span style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.semibold, fontSize: 25, color: CL.text }}><span style={{ width: 30, height: 30, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={18} /></span>{r.top}</span>
                    <span style={{ flex: 1, marginRight: 14, display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.semibold, fontSize: 25, color: miss ? C.red : CL.text, background: miss ? C.redSoft : "transparent", borderRadius: 10, padding: "8px 10px", transform: `translateX(${shakeAt(t, A.fehlt + i * 0.05, 5)}px)` }}>
                      {miss ? <span style={{ width: 30, height: 30, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico d="M7 7l10 10M17 7L7 17" size={18} color="#FFF" sw={3} /></span> : null}{r.you}
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </ClaudeWin>
      )}
      <div style={{ position: "absolute", left: 40, top: 46, ...popStyle(t, s0 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 1 · Top 3 vergleichen" dot={C.orange} size={30} /></div>
      <Pointer t={t} path={[
        { x: 760, y: 820, at: s0 + 0.1 },
        { x: 300, y: 172, at: A.suchst - 0.08, click: true },
        { x: 820, y: 230, at: A.screenshots - 0.05, click: true },
        { x: 820, y: 590, at: A.dir1 - 0.05, click: true },
        { x: 820, y: 700, at: A.fehlt + 0.3 },
      ]} />
    </>
  );
};

// ---------- full: the field reveal (huge Material field "Hauptkategorie" in 2.5D) ----------
const FullTrick: React.FC<{ t: number }> = ({ t }) => {
  const a = A.jetzt - 0.25;
  const grow = k(t, a, 0.55, Easing.out(Easing.back(1.5)));
  const glow = 0.5 + 0.5 * Math.abs(Math.sin((t - a) * 4));
  const GC = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#F8F9FA" }}>
      <MapBg t={t} blur={9} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * k(t, a, 1.4)})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 540 - 95, top: 600, width: 190, height: 190, borderRadius: 48, background: "#FFF", boxShadow: deep, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.3 + 0.7 * grow}) rotate(${(1 - grow) * -20 + Math.sin(t * 2) * 2.5}deg)` }}><MapsLogo size={120} /></div>
        <div style={{ position: "absolute", left: 110, top: 900, transform: `${tilt3d(t, 14, -8)} scale(${0.6 + 0.4 * grow})`, transformOrigin: "50% 50%", opacity: Math.min(1, grow * 2) }}>
          <div style={{ background: "#FFF", borderRadius: 30, padding: "60px 40px 40px", boxShadow: deep }}>
            <GField label="Hauptkategorie" value="" state="focus" w={780} fs={56} glow={glow} caret={Math.floor(t * 4) % 2 === 0} />
          </div>
        </div>
        {Array.from({ length: 16 }, (_, i) => {
          const b = a + 0.12 + i * 0.03, r = 300 + 320 * k(t, b, 0.6), ang = i * 0.41 + 0.2;
          return t > b ? <div key={i} style={{ position: "absolute", left: 540 + Math.cos(ang) * r - 9, top: 980 + Math.sin(ang) * r * 0.8 - 9, width: 18, height: 18, borderRadius: i % 2 ? "50%" : 5, background: GC[i % 4], transform: `rotate(${45 + i * 20}deg)`, opacity: 1 - k(t, b + 0.45, 0.3) }} /> : null;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center", ...popStyle(t, a, 14, 0.3) }}>
        <BigTag text="JETZT DAS FELD" bg={C.ink} size={70} style={{ transform: `scale(${interpolate(t - a, [0, 0.16], [2.2, 1], clamp)}) rotate(-3deg) translateX(${shakeAt(t, A.feld1, 8)}px)` }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- split: step 2, main category "Farbengeschäft" -> barely visible for "Maler in der Nähe" -> "Maler" ----------
const SceneStep2: React.FC<{ t: number }> = ({ t }) => {
  const s1 = A.schritt1;
  const hl = t > A.hauptkategorie - 0.1;
  const wrong = t > A.farbengeschaeft - 0.1;
  const fix = A.passt - 0.1;
  const fixed = t > fix;
  const cats = t > A.claude2 - 0.05;
  const val = fixed ? typed("Maler", t, fix, fix + 0.3) : "Farbengeschäft";
  return (
    <>
      <MapStage w={W} h={PH} cam={{ fx: 1300 + t * 8, fy: 1300, tilt: 55, rz: -14, s: 0.8 }} t={t} style={{ filter: "blur(6px)", opacity: 0.85 }} fog={false} />
      <PanelCard style={{ left: 36, top: 132, width: 500, height: 660, transform: tilt3d(t, 4, 11), transformOrigin: "0% 50%", ...popStyle(t, s1 + 0.05, 24, 0.85) }}>
        <GProfileHead fs={22} />
        <div style={{ padding: "22px 26px 0" }}>
          <div style={{ fontFamily: GF, fontWeight: 500, fontSize: 25, color: G.text }}>Unternehmenskategorie</div>
          <div style={{ fontFamily: GF, fontSize: 17, color: G.sub, marginTop: 6, lineHeight: 1.35 }}>Bestimmt, bei welchen Suchen dein Betrieb erscheint.</div>
          <div style={{ marginTop: 34, transform: `translateX(${shakeAt(t, A.farbengeschaeft, 8)}px) scale(${hl && !wrong ? 1 + 0.03 * pop(t, A.hauptkategorie - 0.1, 0.3) : 1})` }}>
            <GField label="Hauptkategorie*" value={val} state={fixed ? (t > fix + 0.3 ? "ok" : "focus") : wrong ? "err" : hl ? "focus" : "idle"} w={448} fs={28} glow={hl && !wrong ? 0.7 : 0} caret={fixed && t < fix + 0.3} helper={fixed ? "Passt zu „Maler in der Nähe“" : wrong ? "Passt nicht zu „Maler in der Nähe“" : undefined} />
          </div>
          {hl ? <div style={{ marginTop: 22, ...popStyle(t, A.hauptkategorie - 0.1, 10, 0.5) }}><Tag text="DAS EINE FELD" color={C.ink} size={18} /></div> : null}
          <div style={{ marginTop: 26, fontFamily: GF, fontWeight: 500, fontSize: 19, color: G.sub }}>Weitere Kategorien</div>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            {fixed ? ["Malerbetrieb", "Fassadenbau"].map((c, i) => <span key={c} style={popStyle(t, fix + 0.3 + i * 0.1, 6, 0.6)}><GChip text={c} fs={19} on /></span>) : <GChip text="+ Kategorie hinzufügen" fs={19} />}
          </div>
        </div>
        {wrong && !fixed ? <Stamp t={t} at={A.kaum - 0.05} text="FALSCH" color={C.red} size={46} rot={-8} style={{ left: 170, top: 420 }} /> : null}
      </PanelCard>
      {t > A.maler0 - 0.15 ? (
        <PanelCard style={{ left: 556, top: 132, width: 490, height: 660, transform: tilt3d(t, 4, -11), transformOrigin: "100% 50%", ...popStyle(t, A.maler0 - 0.15, 20, 0.85) }}>
          <div style={{ padding: "18px 18px 12px", position: "relative", height: 74 }}>
            <GSearch text={typed("Maler in der Nähe", t, A.maler1 - 0.1, A.naehe + 0.1)} w={454} fs={22} style={{ position: "relative" }} />
          </div>
          {BIZ.map((b, i) => (t > A.naehe + i * 0.08 ? <div key={i} style={popStyle(t, A.naehe + i * 0.08, 8, 0.9)}><GResult b={b} w={490} fs={17} rank={i + 1} actions={false} catHi={cats ? "ok" : undefined} /></div> : null))}
          {t > A.kaum - 0.1 ? (
            <div style={{ position: "relative", ...popStyle(t, A.kaum - 0.1, 8, 0.9) }}>
              <GResult b={YOU} w={490} fs={17} rank={14} dim actions={false} catHi={cats && !fixed ? "err" : fixed ? "ok" : undefined} />
              <div style={{ position: "absolute", right: 16, top: 12 }}><Tag text={fixed ? "BALD OBEN" : "KAUM SICHTBAR"} color={fixed ? G.ok : G.err} size={13} /></div>
            </div>
          ) : null}
        </PanelCard>
      ) : null}
      {cats ? (
        <div style={{ position: "absolute", left: 66, top: 690, width: 440, display: "flex", gap: 10, alignItems: "flex-start", background: "#FFF", borderRadius: 18, padding: "14px 16px", boxShadow: deep, border: `1px solid ${CL.border}`, ...popStyle(t, A.claude2 - 0.05, 16, 0.8) }}>
          <ClaudeMark size={26} />
          <div style={{ fontFamily: fonts.medium, fontSize: 21, color: CL.text, lineHeight: 1.35 }}>{fixed ? <>Nimm <b>Maler</b> als Hauptkategorie.</> : <>Alle Top 3: <b>Maler</b>. Du: Farbengeschäft.</>}</div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 40, top: 46, ...popStyle(t, s1 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 2 · Hauptkategorie" dot={C.orange} size={30} /></div>
      <Pointer t={t} path={[{ x: 760, y: 820, at: s1 + 0.1 }, { x: 300, y: 420, at: A.hauptkategorie, click: true }, { x: 420, y: 440, at: A.farbengeschaeft + 0.1 }, { x: 300, y: 420, at: fix - 0.03, click: true }, { x: 800, y: 780, at: fix + 0.6 }]} />
    </>
  );
};

// ---------- split: step 3, Claude writes services, description, weekly post + the review request; customer posts a Google review ----------
const SERVICES = ["Fassade streichen", "Innenanstrich", "Tapezieren", "Lackierarbeiten"];
const DESC = "Malerbetrieb in Augsburg: Innenanstrich, Fassaden und Tapezieren für Privat und Gewerbe.";
const MSG = "Danke für den Auftrag! Hast du kurz Zeit für eine ehrliche Bewertung bei Google? Hier der Link:";
const SceneStep3: React.FC<{ t: number }> = ({ t }) => {
  const s2 = A.schritt2;
  const phoneIn = A.nachricht - 0.15;
  const starsP = k(t, A.bewertung - 0.05, 0.6);
  const got = t > A.holt - 0.05;
  const review = t > A.bewertung - 0.15;
  return (
    <>
      <MapStage w={W} h={PH} cam={{ fx: 1300 + t * 8, fy: 1300, tilt: 55, rz: -14, s: 0.8 }} t={t} style={{ filter: "blur(6px)", opacity: 0.85 }} fog={false} />
      <PanelCard style={{ left: 30, top: 132, width: 590, height: 660, transform: tilt3d(t, 4, 9), transformOrigin: "0% 50%", ...popStyle(t, s2 + 0.02, 20, 0.9) }}>
        <GProfileHead fs={22} title="Unternehmensprofil" />
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          {t > A.leistungen - 0.1 ? (
            <div style={popStyle(t, A.leistungen - 0.1, 10, 0.85)}>
              <div style={{ fontFamily: GF, fontWeight: 500, fontSize: 21, color: G.text }}>Leistungen</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {SERVICES.map((s, i) => (t > A.leistungen + i * 0.08 ? <span key={i} style={popStyle(t, A.leistungen + i * 0.08, 4, 0.6)}><GChip text={s} fs={18} on /></span> : null))}
              </div>
            </div>
          ) : null}
          {t > A.beschreibung - 0.1 ? (
            <div style={{ position: "relative", border: `2.5px solid ${t < A.woche ? G.blue : "#79747E"}`, borderRadius: 8, padding: "16px 16px 12px", height: 132, boxSizing: "border-box", marginTop: 8, ...popStyle(t, A.beschreibung - 0.1, 10, 0.85) }}>
              <span style={{ position: "absolute", left: 12, top: -13, background: "#FFF", padding: "0 6px", fontFamily: GF, fontWeight: 500, fontSize: 16, color: t < A.woche ? G.blue : G.sub }}>Beschreibung</span>
              <div style={{ fontFamily: GF, fontSize: 20, color: G.text, lineHeight: 1.38 }}>{typed(DESC, t, A.beschreibung, A.woche)}</div>
              <span style={{ position: "absolute", right: 10, bottom: 6, fontFamily: GF, fontSize: 14, color: G.sub }}>{typed(DESC, t, A.beschreibung, A.woche).length}/750</span>
            </div>
          ) : null}
          {t > A.woche - 0.1 ? (
            <div style={popStyle(t, A.woche - 0.1, 10, 0.85)}>
              <div style={{ fontFamily: GF, fontWeight: 500, fontSize: 21, color: G.text }}>Neuigkeiten</div>
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                {["KW 44", "KW 45", "KW 46", "KW 47"].map((w, i) => {
                  const on = t > A.beitrag + i * 0.09;
                  return (
                    <div key={i} style={{ flex: 1, height: 96, borderRadius: 12, overflow: "hidden", border: `1.5px solid ${on ? G.blue : G.line}`, background: "#FFF", display: "flex", flexDirection: "column" }}>
                      {on ? <GPhoto w={124} h={54} hue={20 + i * 60} style={{ borderRadius: 0, width: "100%" }} /> : <div style={{ height: 54, background: "#F1F3F4" }} />}
                      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: GF, fontWeight: 500, fontSize: 16, color: on ? G.blue : G.sub }}>{w}{on ? " ✓" : ""}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </PanelCard>
      {t > phoneIn ? (
        <div style={{ position: "absolute", left: 646, top: 118, width: 372, height: 690, borderRadius: 54, background: "#1A1A1A", padding: 12, boxSizing: "border-box", boxShadow: deep, transform: tilt3d(t, 4, -14), ...popStyle(t, phoneIn, 40, 0.8) }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 44, background: "#F2F2F7", overflow: "hidden", position: "relative" }}>
            <div style={{ height: 92, background: "#FFF", display: "flex", alignItems: "center", gap: 12, padding: "20px 18px 0", boxSizing: "border-box", borderBottom: `1px solid ${G.line}` }}>
              <span style={{ width: 44, height: 44, borderRadius: "50%", background: "#34A853", color: "#FFF", fontFamily: GF, fontWeight: 500, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>SB</span>
              <div><div style={{ fontFamily: GF, fontWeight: 500, fontSize: 21, color: G.text }}>Sabine B.</div><div style={{ fontFamily: GF, fontSize: 14, color: G.sub }}>Kundin · Fassade</div></div>
            </div>
            <div style={{ position: "absolute", right: 14, top: 108, width: 282, background: "#0B84FF", color: "#FFF", borderRadius: "20px 20px 6px 20px", padding: "12px 14px", fontFamily: GF, fontSize: 19, lineHeight: 1.35, ...popStyle(t, phoneIn + 0.1, 10, 0.8) }}>
              {typed(MSG, t, phoneIn + 0.1, A.auftrag + 0.3)}
              {t > A.auftrag + 0.3 ? <div style={{ marginTop: 8, background: "#FFF", borderRadius: 12, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8, fontFamily: GF, fontWeight: 500, fontSize: 16, color: G.blue, ...popStyle(t, A.auftrag + 0.3, 4, 0.7) }}><MapsLogo size={22} />Bewertung schreiben</div> : null}
            </div>
            {review ? (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: "#FFF", borderRadius: "26px 26px 0 0", boxShadow: "0 -8px 24px rgba(0,0,0,0.15)", padding: "16px 20px", boxSizing: "border-box", transform: `translateY(${(1 - k(t, A.bewertung - 0.15, 0.35)) * 360}px)` }}>
                <div style={{ width: 40, height: 5, borderRadius: 3, background: G.line, margin: "0 auto 14px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><MapsLogo size={28} /><div style={{ fontFamily: GF, fontWeight: 500, fontSize: 21, color: G.text }}>Dein Betrieb</div></div>
                <div style={{ fontFamily: GF, fontSize: 15, color: G.sub, marginTop: 4 }}>Sabine B. · Öffentlich posten</div>
                <div style={{ display: "flex", gap: 6, marginTop: 16, justifyContent: "center" }}>
                  {Array.from({ length: 5 }, (_, i) => {
                    const f = starsP > i / 5;
                    return <svg key={i} width={48} height={48} viewBox="0 0 24 24" style={{ transform: `scale(${f ? 1 + 0.25 * Math.max(0, 1 - Math.abs(starsP * 5 - i - 0.5)) : 1})` }}><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill={f ? G.star : "none"} stroke={f ? G.star : "#9AA0A6"} strokeWidth={1.4} /></svg>;
                  })}
                </div>
                <div style={{ marginTop: 14, border: `1.5px solid ${G.line}`, borderRadius: 8, padding: "10px 12px", fontFamily: GF, fontSize: 17, color: G.text, height: 58 }}>{typed("Super Arbeit, sauber und pünktlich!", t, A.bewertung + 0.3, A.holt - 0.1)}</div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}><span style={{ fontFamily: GF, fontWeight: 500, fontSize: 17, color: "#FFF", background: G.blue, borderRadius: 999, padding: "8px 22px", transform: `scale(${got ? 1 - 0.08 * Math.max(0, 1 - (t - A.holt) / 0.2) : 1})` }}>Posten</span></div>
              </div>
            ) : null}
            {got ? <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", ...popStyle(t, A.holt - 0.05, 10, 0.5) }}><BigTag text="+1 BEWERTUNG" bg={G.ok} size={30} /></div> : null}
          </div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 40, top: 46, ...popStyle(t, s2 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 3 · Texte & Bewertungen" dot={C.orange} size={30} /></div>
      <Pointer t={t} path={[{ x: 760, y: 820, at: s2 + 0.1 }, { x: 340, y: 300, at: A.leistungen + 0.1 }, { x: 340, y: 470, at: A.beschreibung + 0.1 }, { x: 420, y: 680, at: A.beitrag, click: true }, { x: 880, y: 420, at: A.auftrag + 0.35, click: true }, { x: 960, y: 760, at: A.holt - 0.05, click: true }]} />
    </>
  );
};

// ---------- end: guide chips (the PDF scroll covers most of it) ----------
const SceneEnd: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 70, top: 60, display: "flex", flexDirection: "column", gap: 22 }}>
      {t > A.prompts - 0.05 ? <div style={popStyle(t, A.prompts - 0.05, 10, 0.6)}><Tag text="✓ PROMPTS" color={C.orange} size={30} /></div> : null}
      {t > A.checkliste - 0.05 ? <div style={popStyle(t, A.checkliste - 0.05, 10, 0.6)}><Tag text="✓ 12-PUNKTE-CHECKLISTE" color={C.ink} size={30} /></div> : null}
    </div>
    <div style={{ position: "absolute", left: 780, top: 360, width: 180, height: 180, borderRadius: 46, background: `linear-gradient(145deg, #E68E6E, ${C.orange} 55%, #C25E3D)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px rgba(217,119,87,0.4)", ...popStyle(t, A.prompts - 0.1, 26, 0.3) }}><Ico d={I.doc} size={110} color="#FFF" sw={1.6} /></div>
  </>
);

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }>; full?: boolean };
const SCENES: Scene[] = [
  { from: 0, to: A.claude0 - 0.1, origin: "50% 50%", El: SceneHook },
  { from: A.claude0 - 0.1, to: A.schritt0 - 0.05, origin: "50% 50%", El: FullSolution, full: true },
  { from: A.schritt0 - 0.05, to: A.jetzt - 0.25, origin: "50% 45%", El: SceneStep1 },
  { from: A.jetzt - 0.25, to: A.schritt1 - 0.05, origin: "50% 50%", El: FullTrick, full: true },
  { from: A.schritt1 - 0.05, to: A.schritt2 - 0.05, origin: "50% 45%", El: SceneStep2 },
  { from: A.schritt2 - 0.05, to: A.prompts - 0.1, origin: "50% 45%", El: SceneStep3 },
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
const PAGES = Array.from({ length: 9 }, (_, i) => staticFile(`maps-guide/p${i + 1}.png`));
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
        <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: "#FFF", whiteSpace: "nowrap" }}>Google Maps – Guidebook.pdf</div>
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
export const MapsOpus: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-fpn-google-maps-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {scene.full ? <El t={t} /> : full < 1 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * full, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
          </div>
          {t < A.claude0 - 0.1 ? <HookPills t={t} /> : null}
        </div>
      ) : null}
      <PdfScroll t={t} />
      {t > A.komm - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.komm - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 26px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>{typed("MAPS", t, A.trigger - 0.1, A.trigger + 0.3) || " "}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(20,20,20,0.82)", borderRadius: 999, padding: "10px 20px", ...popStyle(t, A.komm + 0.15, 8, 0.6) }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.green }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", color: "#FFF" }}>GUIDE · 9 SEITEN · PER DM</span>
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
