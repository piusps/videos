import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-abmahnung-konkurrent/captions.json";

// FP-N "Abmahnung vom Konkurrenten" v2 (2026-10-22): Hook = "4 von 10 Websites abmahnbar", danach check + abwehren.
// Alles im hellen Superkind-Look (weiß/orange), Vollbild-Momente ebenfalls hell, Schritte als echte claude.ai-Klickpfade
// (Eingabe, "+"-Menü, Datei-Upload, Artifact, Kopieren) mit Mauszeiger. Zeiten an captions.json (tightened) verankert.

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const AB_END = LAST_END + 0.7;
export const AB_FRAMES = Math.round(AB_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  vier: at("vier"), firmen: at("firmenwebsites"), abmahnbar: at("abmahnbar"), oft: at("oft"), fehlers: at("fehlers"), impressum0: at("impressum", 0),
  konkurrent: at("konkurrent"), tausend: at("tausendzweihundert"), anwaltskosten: at("anwaltskosten"),
  ich: at("ich"), claude0: at("claude", 0), checkt: at("checkt"), deins: at("deins"), abwehrst: at("abwehrst"),
  schritt0: at("schritt", 0), vergleicht: at("vergleicht"), impressum1: at("impressum", 1), gesetz: at("gesetz"), fassung: at("fassung"), stellst: at("stellst"), online: at("online"),
  schritt1: at("schritt", 1), kommt: at("kommt", 0), abmahnung1: at("abmahnung", 1), laedst: at("lädst"), hoch: at("hoch"), prueft: at("prüft"), pflicht: at("pflichtangaben"),
  greift: at("greift"), paragraf0: at("paragraf", 0), dreizehn: at("dreizehn"), keinen: at("keinen"), cent: at("cent"),
  jetzt: at("jetzt", 0), trick: at("trick"),
  schritt2: at("schritt", 2), antwort: at("antwort"), kosten: at("kosten"), abgelehnt: at("abgelehnt"), paragraf1: at("paragraf", 1), erste: at("erste"), hundert: at("hundert"), leute: at("leute"), vertragsstrafe: at("vertragsstrafe"), weg: at("weg"),
  weil: at("weil"), trotzdem: at("trotzdem"), geld: at("geld"), zahlt: at("zahlt"), anwalt: at("anwalt"),
  prompt: at("prompt"), vorlage: at("antwortvorlage"), guide: at("guide"), komm: at("kommentiere"), trigger: at("abmahnung", 3), folg: at("folg"),
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

// ---------- hook pills (frame 0 = thumbnail): "Impressum abmahnbar" (struck) / "Claude checkt deins" ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const strike = k(t, 0.85, 0.3, Easing.inOut(Easing.cubic));
  const m = k(t, 1.15, 0.35, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 62, padding: "10px 26px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow }}>
        Impressum{" "}
        <span style={{ position: "relative", display: "inline-block", color: C.red }}>
          abmahnbar
          <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 9, background: C.ink, borderRadius: 4, transform: `scaleX(${strike})`, transformOrigin: "0% 50%" }} />
        </span>
      </div>
      <div style={{ ...pill, marginTop: -6 }}>
        Claude checkt{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -8, right: -8, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>deins</span>
        </span>
      </div>
    </div>
  );
};

// ---------- split hook: 10 websites, 4 abmahnbar -> the imprint gap -> the competitor's letter ----------
const BAD = [1, 4, 5, 8];
const SITES = ["baeckerei-hahn.de", "kfz-meyer.de", "praxis-wolf.de", "holzbau-ott.de", "elektro-kraus.de", "cafe-linde.de", "steuer-roth.de", "malerei-beck.de", "optik-sommer.de", "garten-vogt.de"];
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const thumb = t < 0.04;
  const flagAt = (j: number) => A.vier + 0.15 + (j * (A.abmahnbar - A.vier - 0.15)) / BAD.length;
  const gridOut = k(t, A.oft - 0.12, 0.3, Easing.in(Easing.cubic));
  const sum = t > A.tausend ? Math.round(interpolate(t, [A.tausend, A.tausend + 0.45], [0, 1200], clamp)) : 0;
  const ROWS = [
    { k: "Firma", v: "Muster GmbH", ok: true },
    { k: "Anschrift", v: "Hauptstr. 12, Köln", ok: true },
    { k: "Vertreten durch", v: "", ok: false },
    { k: "Registernummer", v: "", ok: false },
    { k: "USt-IdNr.", v: "", ok: false },
  ];
  return (
    <>
      {gridOut < 1 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, opacity: 1 - gridOut, transform: `scale(${1 - 0.12 * gridOut})`, transformOrigin: "50% 60%" }}>
          {SITES.map((d, i) => {
            const j = BAD.indexOf(i);
            const red = j >= 0 && (thumb || t > flagAt(j));
            const col = i % 5, row = Math.floor(i / 5);
            return (
              <div key={i} style={{ position: "absolute", left: 60 + col * 196, top: 236 + row * 232, width: 176, height: 212, background: "#FFF", borderRadius: 16, overflow: "hidden", boxShadow: red ? "0 18px 36px rgba(229,72,77,0.22)" : "0 10px 24px rgba(20,20,20,0.07)", border: `2.5px solid ${red ? C.red : "transparent"}`, transform: `translateY(${red && !thumb ? -8 * pop(t, flagAt(j), 0.3) : 0}px) ${shakeAt(t, j >= 0 ? flagAt(j) : -9, 4) ? `translateX(${shakeAt(t, flagAt(j), 4)}px)` : ""}`, ...(thumb ? {} : popStyle(t, 0.04 + i * 0.03, 14, 0.85)) }}>
                <div style={{ height: 28, background: "#F1EFEA", display: "flex", alignItems: "center", gap: 5, padding: "0 10px" }}>
                  {[0, 1, 2].map((q) => <span key={q} style={{ width: 8, height: 8, borderRadius: "50%", background: "#D6D2CA" }} />)}
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontFamily: MONO, fontSize: 13, color: CL.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d}</div>
                  <div style={{ height: 52, borderRadius: 8, background: red ? C.redSoft : "#F4F2ED", marginTop: 10 }} />
                  {[0.9, 0.7].map((w, q) => <div key={q} style={{ height: 9, width: `${w * 100}%`, borderRadius: 5, background: "#EDEAE4", marginTop: 10 }} />)}
                </div>
                {red ? <div style={{ position: "absolute", left: 10, right: 10, bottom: 12, display: "flex", justifyContent: "center", ...(thumb ? {} : popStyle(t, flagAt(j), 8, 0.6)) }}><Tag text="ABMAHNBAR" color={C.red} size={14} /></div> : null}
              </div>
            );
          })}
          {thumb || t > A.abmahnbar - 0.05 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center", ...(thumb ? {} : popStyle(t, A.abmahnbar - 0.05, 8, 0.7)) }}>
              <span style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "0.08em", color: CL.sub }}>41 % VON 2.500 KMU-WEBSITES · FDWB-STUDIE 2020</span>
            </div>
          ) : null}
        </div>
      ) : null}
      {t > A.oft - 0.1 ? (
        <div style={{ position: "absolute", left: 60, top: 250, width: 560, height: 520, background: "#FFF", borderRadius: 20, boxShadow: shadow, overflow: "hidden", ...popStyle(t, A.oft - 0.1, 30, 0.6) }}>
          <div style={{ height: 50, background: "#F1EFEA", display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
            {[0, 1, 2].map((q) => <span key={q} style={{ width: 11, height: 11, borderRadius: "50%", background: "#D6D2CA" }} />)}
            <div style={{ flex: 1, marginLeft: 8, height: 32, borderRadius: 9, background: "#FFF", fontFamily: MONO, fontSize: 16, color: CL.sub, display: "flex", alignItems: "center", padding: "0 12px" }}>deine-firma.de/impressum</div>
          </div>
          <div style={{ padding: "16px 24px" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink, marginBottom: 6 }}>Impressum</div>
            {ROWS.map((r, i) => {
              const bad = !r.ok && t > A.fehlers + (i - 2) * 0.16;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", height: 76, borderBottom: `1px solid ${C.line}`, gap: 12, background: bad ? C.redSoft : "transparent", margin: "0 -12px", padding: "0 12px", borderRadius: 10 }}>
                  <span style={{ fontFamily: MONO, fontSize: 17, color: C.dim, width: 190, flexShrink: 0 }}>{r.k}</span>
                  <span style={{ fontFamily: fonts.semibold, fontSize: 23, color: C.ink, flex: 1, whiteSpace: "nowrap" }}>{r.ok ? r.v : bad ? "" : "…"}</span>
                  {r.ok ? <StatusPill ok text="OK" /> : bad ? <div style={popStyle(t, A.fehlers + (i - 2) * 0.16, 6, 0.6)}><StatusPill ok={false} text="FEHLT" /></div> : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {t > A.konkurrent - 0.12 ? (
        <div style={{ position: "absolute", left: 650, top: 300, width: 380, height: 440, background: "#FFF", borderRadius: 18, boxShadow: "0 30px 60px rgba(20,20,20,0.16)", padding: "24px 26px", boxSizing: "border-box", transform: `rotate(${3 + Math.sin(t * 2) * 0.6}deg) translateX(${(1 - pop(t, A.konkurrent - 0.12, 0.45)) * 460 + shakeAt(t, A.anwaltskosten, 8)}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 11, background: RIVAL, color: "#FFF", fontFamily: fonts.bold, fontSize: 25, display: "flex", alignItems: "center", justifyContent: "center" }}>§</div>
            <div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 21, color: C.ink, whiteSpace: "nowrap" }}>{KANZLEI}</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 17, color: C.dim, whiteSpace: "nowrap" }}>i. A. Konkurrent GmbH</div>
            </div>
          </div>
          <div style={{ fontFamily: fonts.bold, fontSize: 30, color: C.ink, marginTop: 22, letterSpacing: "0.02em" }}>ABMAHNUNG</div>
          {[0.92, 0.7, 0.84].map((w, q) => <div key={q} style={{ height: 11, width: `${w * 100}%`, borderRadius: 6, background: "#EDEAE4", marginTop: 14 }} />)}
          <div style={{ position: "absolute", left: 26, right: 26, bottom: 26, paddingTop: 18, borderTop: `1.5px solid ${C.line}` }}>
            <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "0.1em", color: C.dim }}>ANWALTSKOSTEN</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, color: sum ? C.red : C.line, fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.1 * Math.max(0, 1 - Math.abs(t - A.anwaltskosten) / 0.2)})`, transformOrigin: "0% 50%" }}>{eur(sum)}</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------- full: "Ich zeig dir ..." - claude.ai home, prompt typed, the two jobs as chips, send ----------
const FullCheck: React.FC<{ t: number }> = ({ t }) => {
  const from = A.ich - 0.08, to = A.schritt0 - 0.05;
  const click = A.ich + 0.3, send = Math.min(A.abwehrst + 0.35, to - 0.12);
  const prompt = "Prüf das Impressum auf deine-firma.de: Ist es abmahnbar?";
  const txt = t > click ? typed(prompt, t, click + 0.08, A.deins) : "";
  const sent = t > send;
  const zoom = 1 + 0.04 * k(t, from, to - from, Easing.inOut(Easing.sin));
  const chip = (n: string, label: string, sub: string, a: number, x: number) => (t > a - 0.06 ? (
    <div style={{ position: "absolute", left: 70, top: x, width: 940, background: "#FFF", borderRadius: 20, border: `2px solid ${t > a + 0.1 ? C.orange : CL.border}`, boxShadow: "0 14px 30px rgba(20,20,20,0.08)", padding: "24px 28px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 22, ...popStyle(t, a - 0.06, 16, 0.7) }}>
      <div style={{ width: 68, height: 68, borderRadius: 18, background: C.orange, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
      <div>
        <div style={{ fontFamily: fonts.bold, fontSize: 36, color: CL.text, whiteSpace: "nowrap" }}>{label}</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 25, color: CL.sub, whiteSpace: "nowrap", marginTop: 2 }}>{sub}</div>
      </div>
    </div>) : null);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightBg t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", ...popStyle(t, from, 10, 0.8) }}><LabelChip text="So prüfst du es in Claude" dot={C.orange} size={30} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", alignItems: "center", gap: 22, ...popStyle(t, from + 0.04, 18, 0.85) }}>
          <ClaudeMark size={76} />
          <span style={{ fontFamily: SERIF, fontSize: 80, color: CL.text, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>Guten Abend, Florent</span>
        </div>
        <div style={{ position: "absolute", left: 70, top: 560, ...popStyle(t, from + 0.1, 24, 0.9) }}>
          <Composer w={940} h={330} text={sent ? "" : txt} caret={!sent && t > click && Math.floor(t * 3) % 2 === 0} sendOn={txt.length > 0 && !sent} fs={34} placeholder={sent ? "Antwort wird geschrieben …" : "Wie kann ich dir heute helfen?"} />
        </div>
        {chip("1", "Ist mein Impressum abmahnbar?", "Claude gleicht es mit dem Gesetz ab", A.deins, 960)}
        {chip("2", "Abmahnung abwehren", "Kosten ablehnen, Antwort schreiben", A.abwehrst, 1120)}
        {sent ? <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center", ...popStyle(t, send + 0.05, 10, 0.6) }}><Tag text="✓ GESENDET" color={C.green} size={22} /></div> : null}
        <Pointer t={t} path={[{ x: 820, y: 1300, at: from + 0.05 }, { x: 330, y: 660, at: click, click: true }, { x: 962, y: 846, at: send, click: true }]} size={54} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- split: step 1, Claude compares the imprint with the law, writes the fix, you copy it and go live ----------
const FIELDS = [
  { k: "Firma", v: "Muster GmbH", ok: true },
  { k: "Anschrift", v: "Hauptstr. 12, 50667 Köln", ok: true },
  { k: "Vertreten durch", v: "Max Muster, Geschäftsführer" },
  { k: "Registernummer", v: "HRB 123456, AG Köln" },
  { k: "USt-IdNr.", v: "DE 123 456 789" },
];
const SceneStep1: React.FC<{ t: number }> = ({ t }) => {
  const s0 = A.schritt0;
  const art = k(t, A.fassung - 0.15, 0.4, Easing.out(Easing.cubic));
  const copied = t > A.stellst + 0.05;
  const live = t > A.online - 0.05;
  const chk = (i: number) => A.vergleicht + 0.15 + i * 0.13;
  const fix = (i: number) => A.fassung + 0.15 + (i - 2) * 0.17;
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, s0 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 1 · Impressum prüfen" dot={C.orange} size={30} /></div>
      {t > A.gesetz - 0.05 ? <div style={{ position: "absolute", right: 50, top: 58, ...popStyle(t, A.gesetz - 0.05, 10, 0.6) }}><Tag text="§ 5 DDG" color={C.ink} size={24} /></div> : null}
      <ClaudeWin title="Impressum-Check" style={{ left: 50, top: 140, width: 980, height: 650, ...popStyle(t, s0 + 0.02, 20, 0.88) }}>
        <div style={{ position: "absolute", right: 24, top: 20, maxWidth: 640, background: CL.bubble, borderRadius: 18, padding: "14px 20px", fontFamily: fonts.medium, fontSize: 23, color: CL.text, lineHeight: 1.3, ...popStyle(t, s0 + 0.12, 12, 0.85) }}>Prüf mein Impressum gegen das Gesetz: deine-firma.de/impressum</div>
        <div style={{ position: "absolute", left: 24, top: 128, right: 24 }}>
          {t > A.vergleicht - 0.08 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, ...popStyle(t, A.vergleicht - 0.08, 8, 0.8) }}>
              <ClaudeMark size={30} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1.5px solid ${CL.border}`, background: "#FFF", borderRadius: 10, padding: "6px 12px", fontFamily: fonts.medium, fontSize: 18, color: CL.sub }}><Ico d={I.globe} size={20} color={CL.sub} /> Fetched deine-firma.de/impressum</span>
            </div>
          ) : null}
          <div style={{ marginTop: 14, marginLeft: 42 }}>
            {FIELDS.map((f, i) => (t > chk(i) - 0.05 ? (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, height: 66, borderBottom: `1px solid ${CL.border}`, ...popStyle(t, chk(i) - 0.05, 8, 0.85) }}>
                <span style={{ fontFamily: MONO, fontSize: 18, color: CL.sub, width: 210, flexShrink: 0 }}>{f.k}</span>
                <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: CL.text, width: 330, whiteSpace: "nowrap" }}>{f.ok ? f.v : "nicht vorhanden"}</span>
                <StatusPill ok={!!f.ok} text={f.ok ? "OK" : "FEHLT"} />
              </div>) : null))}
          </div>
        </div>
        {art > 0 ? (
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 600, background: "#FFF", borderLeft: `1.5px solid ${CL.border}`, boxShadow: "-24px 0 50px rgba(20,20,20,0.10)", transform: `translateX(${(1 - art) * 620}px)` }}>
            <div style={{ height: 66, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: `1px solid ${CL.border}` }}>
              <Ico d={I.doc} size={24} color={C.orange} />
              <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: CL.text, whiteSpace: "nowrap" }}>Impressum · korrigiert</span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, border: `1.5px solid ${copied ? C.green : CL.border}`, background: copied ? C.greenSoft : t > A.stellst - 0.3 ? CL.hover : "#FFF", borderRadius: 10, padding: "7px 14px", fontFamily: fonts.semibold, fontSize: 19, color: copied ? C.green : CL.text }}>
                {copied ? <Check size={20} color={C.green} p={k(t, A.stellst + 0.05, 0.2)} /> : <Ico d={I.copy} size={20} />}{copied ? "Kopiert" : "Kopieren"}
              </div>
            </div>
            <div style={{ padding: "8px 24px" }}>
              {FIELDS.map((f, i) => {
                const done = f.ok || t > fix(i);
                return (
                  <div key={i} style={{ height: 92, borderBottom: `1px solid ${CL.border}`, display: "flex", flexDirection: "column", justifyContent: "center", background: !f.ok && done ? C.greenSoft : "transparent", margin: "0 -12px", padding: "0 12px", borderRadius: 8 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ fontFamily: MONO, fontSize: 15, color: CL.sub, flex: 1 }}>{f.k.toUpperCase()}</span>
                      {!f.ok && done ? <Tag text="ERGÄNZT" color={C.green} size={13} /> : null}
                    </div>
                    <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: CL.text, whiteSpace: "nowrap", marginTop: 4 }}>{f.ok ? f.v : done ? typed(f.v, t, fix(i), fix(i) + 0.28) : " "}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </ClaudeWin>
      {live ? (
        <div style={{ position: "absolute", left: 80, top: 630, width: 400, background: "#FFF", borderRadius: 16, boxShadow: shadow, overflow: "hidden", ...popStyle(t, A.online - 0.05, 16, 0.6) }}>
          <div style={{ height: 40, background: "#F1EFEA", display: "flex", alignItems: "center", gap: 6, padding: "0 12px" }}>
            {[0, 1, 2].map((q) => <span key={q} style={{ width: 9, height: 9, borderRadius: "50%", background: "#D6D2CA" }} />)}
            <span style={{ marginLeft: 8, fontFamily: MONO, fontSize: 14, color: CL.sub }}>deine-firma.de/impressum</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px" }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 26, color: C.ink, flex: 1 }}>Impressum</span>
            <Tag text="✓ ONLINE" color={C.green} size={18} />
          </div>
        </div>
      ) : null}
      <Pointer t={t} path={[{ x: 820, y: 800, at: A.fassung + 0.1 }, { x: 935, y: 231, at: A.stellst, click: true }, { x: 760, y: 560, at: A.online + 0.1 }]} />
    </>
  );
};

// ---------- split: step 2, upload the warning via "+" -> "Add files or photos", Claude checks, § 13 applies ----------
const MENU = [
  { d: I.clip, label: "Add files or photos" },
  { d: I.cam, label: "Take a screenshot" },
  { d: I.drive, label: "Add from Google Drive" },
];
const SceneStep2: React.FC<{ t: number }> = ({ t }) => {
  const s1 = A.schritt1;
  const plusClick = A.abmahnung1, itemClick = A.laedst;
  const fileAt = A.hoch - 0.12;
  const send = A.prueft - 0.15;
  const ask = "Geht es nur um Pflichtangaben?";
  const menu = t > plusClick && t < itemClick + 0.12;
  const menuP = k(t, plusClick, 0.18);
  const sent = t > send + 0.05;
  const v = Math.round(interpolate(t, [A.keinen, A.cent + 0.05], [1200, 0], clamp));
  const OX = 50, OY = 140; // window origin in panel coords
  const row = (label: string, value: string, a: number) => (t > a - 0.05 ? (
    <div style={{ display: "flex", alignItems: "center", gap: 14, height: 60, borderBottom: `1px solid ${CL.border}`, ...popStyle(t, a - 0.05, 8, 0.85) }}>
      <span style={{ width: 34, height: 34, borderRadius: 9, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={24} p={k(t, a + 0.08, 0.22)} /></span>
      <span style={{ fontFamily: MONO, fontSize: 18, color: CL.sub, width: 200, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: fonts.semibold, fontSize: 23, color: CL.text, whiteSpace: "nowrap" }}>{value}</span>
    </div>) : null);
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, s1 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 2 · Abmahnung hochladen" dot={C.orange} size={30} /></div>
      <ClaudeWin title={sent ? "Abmahnung prüfen" : "Neuer Chat"} style={{ left: OX, top: OY, width: 980, height: 650, ...popStyle(t, s1 + 0.02, 20, 0.88) }}>
        {!sent ? (
          <>
            <Composer w={860} h={220} text={t > fileAt + 0.1 ? typed(ask, t, fileAt + 0.15, send - 0.05) : ""} caret={t > fileAt && Math.floor(t * 3) % 2 === 0} plusOn={menu} sendOn={t > fileAt + 0.2}
              file={t > fileAt ? <div style={popStyle(t, fileAt, 10, 0.7)}><FileChip name="Abmahnung.pdf" meta="PDF · 2 SEITEN" size={0.9} /></div> : null}
              fs={26} style={{ left: 60, top: 340 }} />
            {menu ? (
              <div style={{ position: "absolute", left: 60, top: 70, width: 470, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 18, boxShadow: "0 22px 46px rgba(20,20,20,0.14)", padding: 8, opacity: menuP, transform: `translateY(${(1 - menuP) * 14}px)` }}>
                {MENU.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 62, padding: "0 16px", borderRadius: 12, background: i === 0 && t > itemClick - 0.3 ? CL.hover : "transparent" }}>
                    <Ico d={m.d} size={26} /><span style={{ fontFamily: fonts.medium, fontSize: 23, color: CL.text }}>{m.label}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: CL.border, margin: "6px 10px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 16, height: 62, padding: "0 16px" }}>
                  <Ico d={I.globe} size={26} /><span style={{ fontFamily: fonts.medium, fontSize: 23, color: CL.text, flex: 1 }}>Web search</span>
                  <span style={{ width: 50, height: 28, borderRadius: 14, background: C.orange, position: "relative" }}><span style={{ position: "absolute", right: 3, top: 3, width: 22, height: 22, borderRadius: "50%", background: "#FFF" }} /></span>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div style={{ position: "absolute", right: 24, top: 20, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, ...popStyle(t, send + 0.05, 14, 0.85) }}>
              <FileChip name="Abmahnung.pdf" meta="PDF · 2 SEITEN" size={0.85} />
              <div style={{ background: CL.bubble, borderRadius: 18, padding: "12px 20px", fontFamily: fonts.medium, fontSize: 23, color: CL.text }}>{ask}</div>
            </div>
            <div style={{ position: "absolute", left: 24, top: 190, right: 24 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <ClaudeMark size={30} />
                <div style={{ flex: 1 }}>
                  {row("Abmahner", "Mitbewerber, kein Verband", A.prueft + 0.2)}
                  {row("Verstoß", "Impressum = Pflichtangabe", A.pflicht)}
                  {t > A.greift - 0.08 ? (
                    <div style={{ marginTop: 14, background: C.orangeSoft, borderLeft: `6px solid ${C.orange}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, ...popStyle(t, A.greift - 0.08, 10, 0.8) }}>
                      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, color: C.orange, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>§ 13 ABS. 4 UWG</span>
                      <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: CL.text, whiteSpace: "nowrap" }}>{typed("greift: kein Kostenersatz", t, A.dreizehn - 0.1, A.dreizehn + 0.35)}</span>
                    </div>
                  ) : null}
                  {t > A.keinen - 0.1 ? (
                    <div style={{ display: "flex", alignItems: "center", marginTop: 16, ...popStyle(t, A.keinen - 0.1, 8, 0.85) }}>
                      <span style={{ fontFamily: fonts.medium, fontSize: 24, color: CL.text, flex: 1 }}>Anwaltskosten, die er verlangen darf</span>
                      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: v === 0 ? C.green : C.red, fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.15 * Math.max(0, 1 - Math.abs(t - A.cent - 0.05) / 0.2)})` }}>{eur(v)}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        )}
      </ClaudeWin>
      <Stamp t={t} at={A.cent + 0.05} text="KEIN CENT" color={C.green} size={38} rot={-5} style={{ left: 600, top: 688 }} />
      <Pointer t={t} path={[
        { x: 760, y: 800, at: s1 + 0.1 },
        { x: OX + 60 + 26 + 24, y: OY + 58 + 340 + 220 - 18 - 24, at: plusClick, click: true },
        { x: OX + 60 + 140, y: OY + 58 + 70 + 8 + 31, at: itemClick, click: true },
        { x: OX + 60 + 860 - 22 - 26, y: OY + 58 + 340 + 220 - 18 - 26, at: send, click: true },
        { x: 860, y: 760, at: send + 0.6 },
      ]} />
    </>
  );
};

// ---------- full: the trick (light, orange paragraph tile) ----------
const FullTrick: React.FC<{ t: number }> = ({ t }) => {
  const a = A.jetzt - 0.25;
  const grow = k(t, a, 0.55, Easing.out(Easing.back(1.5)));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightBg t={t} glow="rgba(217,119,87,0.28)" />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * k(t, a, 1.4)})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 540 - 210, top: 640, width: 420, height: 420, borderRadius: 104, background: `linear-gradient(145deg, #E68E6E, ${C.orange} 55%, #C25E3D)`, boxShadow: "0 40px 90px rgba(217,119,87,0.45), inset 0 2px 0 rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.3 + 0.7 * grow}) rotate(${(1 - grow) * -20 + Math.sin(t * 2) * 2.5}deg)` }}>
          <span style={{ fontFamily: SERIF, fontSize: 300, lineHeight: 1, color: "#FFF", marginTop: -20 }}>§</span>
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

// ---------- split: step 3, Claude's reply as an artifact (costs rejected, no contract penalty) ----------
const SceneAntwort: React.FC<{ t: number }> = ({ t }) => {
  const line = (label: string, v: string, a: number, strikeAt: number) => (t > a - 0.05 ? (
    <div style={{ display: "flex", alignItems: "center", height: 76, borderBottom: `1px solid ${CL.border}`, gap: 14, ...popStyle(t, a - 0.05, 12, 0.8) }}>
      <span style={{ fontFamily: fonts.medium, fontSize: 25, color: C.ink, flex: 1 }}>{label}</span>
      <span style={{ position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: t > strikeAt ? C.dim : C.red }}>
        {v}
        <span style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 5, background: C.red, transform: `scaleX(${k(t, strikeAt, 0.25)})`, transformOrigin: "0% 50%" }} />
      </span>
    </div>) : null);
  const people = Math.round(interpolate(t, [A.hundert - 0.1, A.leute + 0.2], [0, 12], clamp));
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 52, ...popStyle(t, A.schritt2 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 3 · die Antwort" dot={C.orange} size={30} /></div>
      <div style={{ position: "absolute", left: 50, top: 140, width: 640, height: 650, background: "#FFF", borderRadius: 22, boxShadow: shadow, border: `1px solid ${CL.border}`, overflow: "hidden", ...popStyle(t, A.schritt2 + 0.05, 20, 0.85) }}>
        <div style={{ height: 66, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: `1px solid ${CL.border}`, background: CL.page }}>
          <ClaudeMark size={26} /><span style={{ fontFamily: fonts.semibold, fontSize: 21, color: CL.text, whiteSpace: "nowrap" }}>{typed(`Antwort an ${KANZLEI}`, t, A.antwort - 0.15, A.antwort + 0.45)}</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, border: `1.5px solid ${CL.border}`, borderRadius: 10, padding: "5px 10px", fontFamily: fonts.semibold, fontSize: 16, color: CL.text }}><Ico d={I.copy} size={16} />Kopieren</div>
        </div>
        <div style={{ padding: "8px 24px" }}>
          {line("Anwaltskosten", "1.200 €", A.kosten, A.abgelehnt)}
          {t > A.paragraf1 - 0.05 ? <div style={{ margin: "12px 0", ...popStyle(t, A.paragraf1 - 0.05, 10, 0.6) }}><Tag text="§ 13 ABS. 4 UWG" color={C.ink} size={20} /></div> : null}
          {line("Vertragsstrafe", "5.000 €", A.erste, A.weg - 0.05)}
          {t > A.weg - 0.05 ? <div style={{ margin: "12px 0", ...popStyle(t, A.weg - 0.05, 10, 0.6) }}><Tag text="§ 13A ABS. 2 UWG" color={C.ink} size={20} /></div> : null}
        </div>
      </div>
      <Stamp t={t} at={A.abgelehnt} text="ABGELEHNT" size={40} rot={-8} style={{ left: 360, top: 210 }} />
      <div style={{ position: "absolute", left: 720, top: 140, width: 310, height: 650, background: "#FFF", borderRadius: 22, boxShadow: shadow, border: `1px solid ${CL.border}`, padding: 22, boxSizing: "border-box", ...popStyle(t, A.erste - 0.05, 20, 0.7) }}>
        <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "0.08em", color: C.dim }}>ERSTE ABMAHNUNG</div>
        <div style={{ marginTop: 10 }}>{t > A.erste ? <StatusPill ok text="JA" /> : null}</div>
        <div style={{ marginTop: 28, fontFamily: MONO, fontSize: 17, letterSpacing: "0.08em", color: C.dim }}>BESCHÄFTIGTE</div>
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {Array.from({ length: 12 }, (_, i) => (i < people ? <div key={i} style={{ height: 52, borderRadius: 14, background: i % 3 === 0 ? C.orange : i % 3 === 1 ? C.orangeSoft : "#EDEAE4", ...popStyle(t, A.hundert - 0.1 + i * 0.04, 10, 0.4) }} /> : <div key={i} style={{ height: 52 }} />))}
        </div>
        {t > A.leute ? <div style={{ marginTop: 18, ...popStyle(t, A.leute, 10, 0.6) }}><Tag text="< 100 ✓" color={C.green} size={22} /></div> : null}
      </div>
      <Stamp t={t} at={A.weg} text="STRAFE: 0 €" color={C.green} size={50} rot={-6} style={{ left: 170, top: 650 }} />
    </>
  );
};

// ---------- full: the reversal - the counterclaim in the reply, your lawyer's bill goes to the competitor ----------
const FullUmkehr: React.FC<{ t: number }> = ({ t }) => {
  const from = A.weil - 0.08;
  const fly0 = A.zahlt - 0.05, fly = 0.6;
  const f = Easing.inOut(Easing.cubic)(k(t, fly0, fly, Easing.linear));
  const landed = t > fly0 + fly;
  const zoom = 1 + 0.04 * k(t, from, 3, Easing.inOut(Easing.sin));
  const card = (x: number, initials: string, bg: string, name: string, sub: string, extra: React.ReactNode, a: number) => (
    <div style={{ position: "absolute", left: x, top: 1060, width: 400, height: 330, background: "#FFF", borderRadius: 26, boxShadow: shadow, border: `1px solid ${CL.border}`, padding: 28, boxSizing: "border-box", ...popStyle(t, a, 20, 0.8) }}>
      <div style={{ width: 78, height: 78, borderRadius: "50%", background: bg, color: "#FFF", fontFamily: fonts.bold, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{initials}</div>
      <div style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink, marginTop: 18, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontFamily: fonts.medium, fontSize: 22, color: C.dim, marginTop: 4 }}>{sub}</div>
      <div style={{ marginTop: 18 }}>{extra}</div>
    </div>
  );
  const x0 = 280, x1 = 800, y0 = 1120;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LightBg t={t} glow={landed ? "rgba(30,158,87,0.16)" : "rgba(217,119,87,0.16)"} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom}) translateX(${shakeAt(t, fly0 + fly, 10)}px)`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 110, top: 360, width: 860, height: 560, background: "#FFF", borderRadius: 24, boxShadow: shadow, border: `1px solid ${CL.border}`, overflow: "hidden", ...popStyle(t, from + 0.04, 30, 0.85) }}>
          <div style={{ height: 76, display: "flex", alignItems: "center", gap: 14, padding: "0 28px", borderBottom: `1px solid ${CL.border}`, background: CL.page }}>
            <ClaudeMark size={32} /><span style={{ fontFamily: fonts.semibold, fontSize: 27, color: CL.text, whiteSpace: "nowrap" }}>Antwort an {KANZLEI}</span>
          </div>
          <div style={{ padding: "26px 34px" }}>
            {[0.94, 0.8, 0.88].map((w, q) => <div key={q} style={{ height: 14, width: `${w * 100}%`, borderRadius: 7, background: "#EDEAE4", marginTop: q ? 18 : 0 }} />)}
            {t > A.trotzdem - 0.1 ? (
              <div style={{ marginTop: 30, background: C.orangeSoft, borderLeft: `7px solid ${C.orange}`, borderRadius: 12, padding: "20px 24px", ...popStyle(t, A.trotzdem - 0.1, 12, 0.85) }}>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, letterSpacing: "0.08em", color: C.orange }}>§ 13 ABS. 5 UWG · GEGENFORDERUNG</div>
                <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: CL.text, marginTop: 10, lineHeight: 1.3, minHeight: 80 }}>{typed("Ihr Mandant erstattet die Kosten meiner Rechtsverteidigung.", t, A.trotzdem + 0.05, A.zahlt)}</div>
              </div>
            ) : null}
          </div>
        </div>
        {card(80, "DU", C.orange, "Dein Anwalt", "Rechnung für die Abwehr", t > A.geld ? <Tag text="RECHNUNG RAUS" color={C.ink} size={17} /> : null, A.geld - 0.2)}
        {card(600, "K", RIVAL, "Konkurrent GmbH", "der Abmahner", landed ? <div style={popStyle(t, fly0 + fly, 8, 0.6)}><Tag text="✓ ZAHLT" color={C.green} size={22} /></div> : null, A.geld - 0.1)}
        {t > fly0 ? (
          <div style={{ position: "absolute", left: x0 + (x1 - x0) * f - 90, top: y0 - Math.sin(f * Math.PI) * 220 - 40, transform: `rotate(${-8 + 16 * f}deg) scale(${landed ? 1 - 0.3 * k(t, fly0 + fly, 0.2) : 1})`, opacity: landed ? 1 - k(t, fly0 + fly + 0.1, 0.2) : 1, zIndex: 20 }}>
            <FileChip name="Anwaltsrechnung" meta="AN: KONKURRENT GMBH" size={1.05} />
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", ...popStyle(t, from, 10, 0.8) }}><LabelChip text="Er wollte Geld, das ihm nicht zusteht" dot={C.red} size={32} /></div>
      <MonoSlam t={t} at={fly0 + fly - 0.05} text="ER ZAHLT!" top={900} size={120} bg={C.green} hold={0.85} />
    </AbsoluteFill>
  );
};

// ---------- end: guide chips (the PDF scroll covers most of it) ----------
const SceneEnd: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 70, top: 60, display: "flex", flexDirection: "column", gap: 22 }}>
      {t > A.prompt - 0.05 ? <div style={popStyle(t, A.prompt - 0.05, 10, 0.6)}><Tag text="✓ PROMPT" color={C.orange} size={30} /></div> : null}
      {t > A.vorlage - 0.05 ? <div style={popStyle(t, A.vorlage - 0.05, 10, 0.6)}><Tag text="✓ ANTWORTVORLAGE" color={C.ink} size={30} /></div> : null}
    </div>
    <div style={{ position: "absolute", left: 780, top: 360, width: 180, height: 180, borderRadius: 46, background: `linear-gradient(145deg, #E68E6E, ${C.orange} 55%, #C25E3D)`, color: "#FFF", fontFamily: SERIF, fontSize: 130, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px rgba(217,119,87,0.4)", ...popStyle(t, A.prompt - 0.1, 26, 0.3) }}>§</div>
  </>
);

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }>; full?: boolean };
const SCENES: Scene[] = [
  { from: 0, to: A.ich - 0.08, origin: "50% 50%", El: SceneHook },
  { from: A.ich - 0.08, to: A.schritt0 - 0.05, origin: "50% 50%", El: FullCheck, full: true },
  { from: A.schritt0 - 0.05, to: A.schritt1 - 0.05, origin: "50% 45%", El: SceneStep1 },
  { from: A.schritt1 - 0.05, to: A.jetzt - 0.25, origin: "50% 45%", El: SceneStep2 },
  { from: A.jetzt - 0.25, to: A.schritt2 - 0.05, origin: "50% 50%", El: FullTrick, full: true },
  { from: A.schritt2 - 0.05, to: A.weil - 0.08, origin: "50% 45%", El: SceneAntwort },
  { from: A.weil - 0.08, to: A.prompt - 0.1, origin: "50% 50%", El: FullUmkehr, full: true },
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
const PAGES = Array.from({ length: 11 }, (_, i) => staticFile(`abmahnung-guide/p${i + 1}.png`));
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
        <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: "#FFF", whiteSpace: "nowrap" }}>Abmahnung – Guidebook.pdf</div>
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
const FOCUS = { x: 0.511, y: 0.598, scale: 1.0 };
const SPLIT_SRC_TOP = 430;
const CTA = A.komm - 0.12;
const CHEST_Y = 1540;
export const AbmahnungOpus: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-fpn-abmahnung-v2-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {scene.full ? <El t={t} /> : full < 1 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * full, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
          </div>
          {t < A.ich - 0.08 ? <HookPills t={t} /> : null}
        </div>
      ) : null}
      <PdfScroll t={t} />
      {t > A.komm - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.komm - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 26px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>{typed("ABMAHNUNG", t, A.trigger - 0.1, A.trigger + 0.3) || " "}</div>
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
