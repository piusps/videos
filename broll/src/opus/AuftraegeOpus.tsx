import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-auftraege/captions.json";

// FP-N "Öffentliche Aufträge" (2026-10-18), built on WissenOpus / GoogleBewertungOpus (Opus-Stil, see video-post-production/references/fpn-opus-stil-2026-10-15.md).
// Split from frame 0, off-white grid panel on top (960 px), avatar below, Claude-orange caption pill on the seam.
// Hook: text hook "Aufträge vom Staat. / Claude findet sie." on frame 0, 100 Mrd. odometer, your bids: 0.
// Guide is mentioned BEFORE the CTA here ("Die Prompts und die Liste der Portale stehen im Guide. Kommentiere Auftrag …"):
// guide scroll on "Prompts … Guide", then avatar full frame with the KOMMENTIERE: AUFTRAG pill.
// All names / companies are invented examples.

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 960;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  hundert: at("hundert"), milliarden: at("milliarden"), keinen: at("keinen"), beworben: at("beworben"), dabei: at("dabei"), zehn: at("zehn"), minuten: at("minuten"),
  schritt0: at("schritt", 0), branche: at("branche"), region: at("region"), durchsucht: at("durchsucht"), listet: at("listet"), frist0: at("frist", 0),
  schritt1: at("schritt", 1), unterlagen: at("unterlagen", 0), prueft: at("prüft"), anforderungen: at("anforderungen"), markiert: at("markiert"), fehlt: at("fehlt"),
  jetzt: at("jetzt"), trick: at("trick"), schritt2: at("schritt", 2), checkliste: at("checkliste"), jede0: at("jede", 0), frist1: at("frist", 1), nachweis: at("nachweis"), formfehler: at("formfehler"),
  viele: at("viele"), nie: at("nie"), chance: at("chance"), prompts: at("prompts"), portale: at("portale"), guide: at("guide"), komm: at("kommentiere"), auftragL: at("auftrag", 9), folg: at("folg"),
};
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const G_IN = A.prompts - 0.2; // guide panel slides in
export const G_OUT = A.komm - 0.1; // guide out, avatar full frame with the CTA pill
export const AU_END = LAST_END + 0.8;
export const AU_FRAMES = Math.round(AU_END * FPS);

const C = {
  bg: "#F4F3EF",
  grid: "rgba(0,0,0,0.045)",
  ink: "#151515",
  dim: "#8A877F",
  line: "#E7E4DD",
  card: "#FFFFFF",
  orange: "#D97757",
  orangeSoft: "#F8E1D7",
  green: "#1E9E57",
  greenSoft: "#E6F5EC",
  red: "#E5484D",
  redSoft: "#FDE8E8",
  blue: "#2F6BFF",
  star: "#F5B400",
  chip: "#141414",
  claudeBg: "#FAF9F5",
};
const MONO = "JetBrains Mono";
const shadow = "0 22px 48px rgba(20,20,20,0.10), 0 3px 8px rgba(20,20,20,0.06)";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, a: number, d = 0.3, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const pop = (t: number, a: number, d = 0.38) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
const popStyle = (t: number, a: number, rise = 18, from = 0.7): React.CSSProperties => {
  const p = pop(t, a);
  return { opacity: k(t, a, 0.14), transform: `translateY(${(1 - Math.min(p, 1)) * rise}px) scale(${from + (1 - from) * p})` };
};
const press = (t: number, a: number) => { const r = t - a; return r < 0 || r > 0.22 ? 0 : Math.sin((r / 0.22) * Math.PI); };
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(interpolate(t, [a, b], [0, s.length], clamp)));
const shakeAt = (t: number, a: number, amp = 5) => { const r = t - a; return r > 0.05 && r < 0.4 ? Math.sin(r * 90) * amp * (1 - r / 0.4) : 0; };

// ---------- sentence boundaries (camera push per sentence) ----------
const SENT = [0, ...CAPS.flatMap((c, i) => (i > 0 && /[.!?]$/.test(CAPS[i - 1].text) ? [c.startMs / 1000] : []))];
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
const Cross: React.FC<{ size: number; color?: string; p?: number }> = ({ size, color = "#FFF", p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeDasharray={30} strokeDashoffset={30 * (1 - p)} /></svg>
);
const Stamp: React.FC<{ t: number; at: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, at: a, text, color = C.red, size = 64, rot = -8, style }) => {
  if (t < a) return null;
  const sp = interpolate(t, [a, a + 0.24], [1.8, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
  return (
    <div style={{ position: "absolute", transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${sp})`, opacity: k(t, a, 0.07), zIndex: 30, ...style }}>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color, border: `${size * 0.11}px solid ${color}`, borderRadius: 16, padding: `${size * 0.16}px ${size * 0.42}px ${size * 0.16}px ${size * 0.54}px`, background: "rgba(255,255,255,0.94)", whiteSpace: "nowrap", boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}>{text}</div>
    </div>
  );
};
const STAR_D = "M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96z";
const Stars: React.FC<{ value: number; size: number; gap?: number }> = ({ value, size, gap = 3 }) => (
  <div style={{ display: "flex", gap }}>
    {[0, 1, 2, 3, 4].map((i) => {
      const f = Math.max(0, Math.min(1, value - i));
      return (
        <div key={i} style={{ position: "relative", width: size, height: size }}>
          <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute" }}><path d={STAR_D} fill="#E3E0D8" /></svg>
          <div style={{ position: "absolute", left: 0, top: 0, width: size * f, height: size, overflow: "hidden" }}>
            <svg width={size} height={size} viewBox="0 0 24 24"><path d={STAR_D} fill={C.star} /></svg>
          </div>
        </div>
      );
    })}
  </div>
);
const GoogleWord: React.FC<{ size: number }> = ({ size }) => (
  <span style={{ fontFamily: fonts.semibold, fontSize: size, letterSpacing: -0.5, whiteSpace: "nowrap" }}>
    {[["G", "#4285F4"], ["o", "#EA4335"], ["o", "#FBBC05"], ["g", "#4285F4"], ["l", "#34A853"], ["e", "#EA4335"]].map(([ch, col], i) => <span key={i} style={{ color: col }}>{ch}</span>)}
  </span>
);
const Pin: React.FC<{ size: number; color?: string }> = ({ size, color = "#EA4335" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
);
const PhoneIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" /></svg>
);
const Avatar: React.FC<{ letter: string; size: number; color?: string }> = ({ letter, size, color = "#7B61FF" }) => (
  <span style={{ width: size, height: size, borderRadius: "50%", background: color, color: "#FFF", fontFamily: fonts.bold, fontSize: size * 0.46, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{letter}</span>
);
const FileChip: React.FC<{ name: string; kind: string; ext: string; color: string; style?: React.CSSProperties }> = ({ name, kind, ext, color, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#FFF", border: `2px solid ${C.line}`, borderRadius: 12, padding: "8px 18px 8px 10px", boxShadow: "0 6px 14px rgba(20,20,20,0.07)", ...style }}>
    <span style={{ width: 40, height: 46, borderRadius: 7, background: color, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 12, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6, boxSizing: "border-box", flex: "none" }}>{ext}</span>
    <div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 22, color: C.ink, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontFamily: fonts.regular, fontSize: 16, color: C.dim, whiteSpace: "nowrap" }}>{kind}</div>
    </div>
  </div>
);
const Spinner: React.FC<{ t: number; size: number; color?: string }> = ({ t, size, color = C.orange }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${t * 400}deg)` }}><circle cx="12" cy="12" r="9" fill="none" stroke="#EAE6DE" strokeWidth="3" /><path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" /></svg>
);
const FlagIcon: React.FC<{ size: number; color?: string }> = ({ size, color = "#FFF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 21V4M5 4h11l-2 4 2 4H5" fill={color} /></svg>
);

// ---------- Claude-Code-style mascot cursor (same sprite as NeueFirmenOpus) ----------
const CO = "#D97757";
const SPRITE = ["..XXXXXXX..", "..XXXXXXX..", "XXXEXXXEXXX", "XXXEXXXEXXX", "..XXXXXXX..", "..XXXXXXX..", "..X.X.X.X..", "..X.X.X.X.."];
const PX = 5;
const MascotSprite: React.FC<{ blink?: boolean }> = ({ blink }) => (
  <svg width={11 * PX} height={8 * PX} viewBox={`0 0 ${11 * PX} ${8 * PX}`} shapeRendering="crispEdges" style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 4px 5px rgba(0,0,0,0.28))" }}>
    {SPRITE.flatMap((row, y) => row.split("").map((ch, x) => {
      if (ch === ".") return null;
      const eye = ch === "E" && !(blink && y === 2);
      return <rect key={`${x}-${y}`} x={x * PX} y={y * PX} width={PX} height={PX} fill={eye ? "#1A1412" : CO} />;
    }))}
  </svg>
);
type Tgt = { at: number; p: () => [number, number]; click?: boolean; glide?: boolean };
const Mascot: React.FC<{ t: number; targets: Tgt[]; hold?: number }> = ({ t, targets, hold = 0.45 }) => {
  const first = targets[0], last = targets[targets.length - 1];
  if (t < first.at - 0.4 || t > last.at + hold + 0.25) return null;
  let i = targets.findIndex((g) => g.at > t);
  let x: number, y: number, air = 0, sx = 1, sy = 1;
  if (i === 0) {
    const [tx, ty] = first.p();
    const q = interpolate(t, [first.at - 0.4, first.at], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    x = tx; y = ty - (1 - q) * 160; air = 1 - q;
  } else {
    if (i === -1) i = targets.length;
    const a = targets[i - 1];
    const b = targets[i] ?? null;
    const [ax, ay] = a.p();
    if (!b) { x = ax; y = ay; }
    else {
      const glide = !!b.glide;
      const d = glide ? b.at - a.at : Math.min(0.42, b.at - a.at - 0.1);
      const st = b.at - d;
      const q = interpolate(t, [st, b.at], [0, 1], { ...clamp, easing: glide ? Easing.inOut(Easing.sin) : Easing.inOut(Easing.quad) });
      const [bx, by] = b.p();
      const dist = Math.hypot(bx - ax, by - ay);
      x = ax + (bx - ax) * q;
      y = ay + (by - ay) * q - (glide ? 0 : Math.sin(q * Math.PI) * (46 + dist * 0.18));
      air = !glide && q > 0 && q < 1 ? Math.sin(q * Math.PI) : 0;
      const pre = interpolate(t, [st - 0.07, st], [0, 1], clamp) * (t < st ? 1 : 0);
      if (pre > 0 && !glide) { sx = 1 + 0.16 * pre; sy = 1 - 0.2 * pre; }
    }
  }
  if (air > 0) { sx = 1 - 0.1 * air; sy = 1 + 0.14 * air; }
  const landed = targets.filter((g) => g.at <= t).pop();
  if (landed && landed.click !== false) {
    const lt = t - landed.at;
    if (lt >= 0 && lt < 0.16) { const s2 = Math.sin((lt / 0.16) * Math.PI); sx = 1 + 0.2 * s2; sy = 1 - 0.22 * s2; }
  }
  const outro = interpolate(t, [last.at + hold, last.at + hold + 0.25], [1, 0], clamp);
  const intro = k(t, first.at - 0.4, 0.12);
  const blink = Math.floor(t * 10) % 31 === 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, zIndex: 40, pointerEvents: "none" }}>
      {targets.filter((g) => g.click !== false).map((g, j) => {
        const r = t - g.at;
        if (r < 0 || r > 0.42) return null;
        const [gx, gy] = g.p();
        const q = r / 0.42;
        return (
          <React.Fragment key={j}>
            <div style={{ position: "absolute", left: gx, top: gy, width: 16 + 64 * q, height: 16 + 64 * q, transform: "translate(-50%,-50%)", borderRadius: "50%", border: `${4 - 2.5 * q}px solid ${CO}`, opacity: 1 - q, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: gx, top: gy, width: 22, height: 22, transform: `translate(-50%,-50%) scale(${1 - q})`, borderRadius: "50%", background: "rgba(217,119,87,0.45)" }} />
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: x, top: y - 6, transform: `translate(-50%, -100%) scale(${sx * intro * outro}, ${sy * intro * outro})`, transformOrigin: "50% 100%", opacity: Math.min(intro, outro) }}>
        <MascotSprite blink={blink} />
      </div>
    </div>
  );
};

// ---------- examples (invented tenders) ----------
const TENDERS = [
  { t: "Elektroinstallation Grundschule", a: "Stadt Musterstadt", f: "28.10.", v: "85.000 €" },
  { t: "Wartung Brandmeldeanlagen", a: "Landkreis Beispiel", f: "04.11.", v: "Rahmenvertrag" },
  { t: "LED-Umrüstung Rathaus", a: "Gemeinde Probedorf", f: "11.11.", v: "42.000 €" },
  { t: "E-Check Verwaltungsgebäude", a: "Kreisverwaltung", f: "19.11.", v: "18.000 €" },
];
const CRIT = [
  { l: "Umsatz > 250.000 €", s: "ok" },
  { l: "3 Referenzen öffentlich", s: "ok" },
  { l: "Fachbetrieb, Meister", s: "ok" },
  { l: "Zertifikat DGUV V3", s: "fehlt" },
];
const CHECK = ["Formblatt 124 Eigenerklärung", "Unbedenklichkeitsbescheinigung Finanzamt", "Angebotsfrist 28.10., 10:00 Uhr", "Referenzliste mit Ansprechpartnern", "Versicherungsnachweis", "Abgabe elektronisch, Textform"];

const StepBar: React.FC<{ t: number; active: number; at0: number }> = ({ t, active, at0 }) => (
  <div style={{ position: "absolute", left: 50, right: 50, top: 36, display: "flex", gap: 14, ...popStyle(t, at0, 10, 0.94) }}>
    {["Suchen", "Prüfen", "Checkliste"].map((l, i) => {
      const on = i === active, done = i < active;
      return (
        <div key={l} style={{ flex: 1, height: 74, borderRadius: 16, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", background: on ? C.ink : "#FFF", boxShadow: shadow, opacity: i > active ? 0.55 : 1 }}>
          <span style={{ width: 42, height: 42, borderRadius: 12, background: done ? C.green : on ? C.orange : "#EFEDE7", color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{done ? <Check size={28} /> : i + 1}</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 29, color: on ? "#FFF" : C.ink, whiteSpace: "nowrap" }}>{l}</span>
        </div>
      );
    })}
  </div>
);
const Building: React.FC<{ size: number; color?: string }> = ({ size, color = C.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round"><path d="M3 21h18M5 21V10M19 21V10M9 21v-6h6v6M2 10l10-6 10 6z" /></svg>
);

// ---------- Scene 0: hook (0 - "Dabei") ----------
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const bn = interpolate(t, [0, A.milliarden + 0.4], [40, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
  const shake = shakeAt(t, A.keinen, 6);
  const drift = 1 + 0.025 * k(t, 0, 4, Easing.inOut(Easing.sin));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translateX(${shake}px) scale(${drift})`, transformOrigin: "50% 45%" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 34, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 76, color: C.ink, letterSpacing: -2, lineHeight: 1.05, whiteSpace: "nowrap" }}>Aufträge vom Staat.</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 76, color: "#FFF", background: C.ink, borderRadius: 16, padding: "4px 24px 12px", letterSpacing: -2, lineHeight: 1.05, whiteSpace: "nowrap" }}><span style={{ background: C.orange, borderRadius: 12, padding: "0 12px" }}>Claude</span> findet sie.</div>
      </div>
      <Card style={{ left: 50, top: 280, width: 600, height: 330, padding: "26px 30px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Building size={40} /><span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: C.dim }}>ÖFFENTLICHE AUFTRÄGE / JAHR</span></div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 20 }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 130, color: C.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.05em" }}>{bn > 99.5 ? "100+" : Math.round(bn)}</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 44, color: C.ink }}>Mrd. €</span>
        </div>
        <div style={{ fontFamily: fonts.medium, fontSize: 20, color: C.dim, marginTop: 14 }}>Bund, Länder, Kommunen · Vergabestatistik 2024: 135 Mrd. €</div>
      </Card>
      {/* coins / contracts flying past */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (t * 0.7 + i * 0.2) % 1;
        return <div key={i} style={{ position: "absolute", left: 700 + (i % 2) * 150, top: 640 - a * 420, opacity: Math.sin(a * Math.PI) * k(t, 0.3, 0.3), transform: `rotate(${(i - 2) * 6}deg)` }}><Tag text={["AUFTRAG", "RAHMENVERTRAG", "LOS 2", "AUFTRAG", "WARTUNG"][i]} color={i % 2 ? C.green : C.ink} size={18} /></div>;
      })}
      <Card style={{ left: 50, top: 640, width: 600, height: 230, padding: "22px 28px", boxSizing: "border-box", border: `3px solid ${C.red}`, ...popStyle(t, A.keinen - 0.25, 24, 0.85) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: C.red }}>DEINE BEWERBUNGEN</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 10 }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 110, color: C.red, lineHeight: 1 }}>0</span>
          <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>in diesem Jahr</span>
        </div>
      </Card>
      <Stamp t={t} at={A.beworben} text="NIE BEWORBEN" color={C.red} size={44} rot={-8} style={{ left: 820, top: 760 }} />
    </div>
  );
};

// ---------- Scene 1: Claude finds the right ones in 10 minutes (Dabei - Schritt eins) ----------
const ScenePromise: React.FC<{ t: number }> = ({ t }) => {
  const s = A.dabei - 0.05;
  const mins = Math.round(interpolate(t, [A.zehn - 0.2, A.minuten + 0.3], [0, 10], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", justifyContent: "center", gap: 18, alignItems: "center", ...popStyle(t, s, 12, 0.8) }}>
        <ClaudeMark size={72} /><span style={{ fontFamily: fonts.bold, fontSize: 72, color: C.ink, letterSpacing: -2 }}>findet die passenden</span>
      </div>
      <Card style={{ left: 290, top: 260, width: 500, height: 420, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...popStyle(t, s + 0.15, 30, 0.85) }}>
        <div style={{ position: "relative", width: 220, height: 220 }}>
          <svg width={220} height={220} viewBox="0 0 220 220"><circle cx="110" cy="110" r="96" fill="none" stroke="#EFEDE7" strokeWidth="18" /><circle cx="110" cy="110" r="96" fill="none" stroke={C.orange} strokeWidth="18" strokeLinecap="round" strokeDasharray={603} strokeDashoffset={603 * (1 - mins / 10)} transform="rotate(-90 110 110)" /></svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 70, color: C.ink }}>{mins}</div>
        </div>
        <div style={{ fontFamily: fonts.bold, fontSize: 40, color: C.ink, marginTop: 14 }}>Minuten</div>
      </Card>
      <div style={{ position: "absolute", left: 0, right: 0, top: 740, display: "flex", justifyContent: "center", ...popStyle(t, A.minuten + 0.2, 10, 0.6) }}><LabelChip text="statt tagelang Portale durchklicken" dot={C.green} size={30} /></div>
    </>
  );
};

// ---------- Scene 2: step 1, branch + region in, Claude searches the portals, lists tenders with deadlines ----------
const SceneSuche: React.FC<{ t: number }> = ({ t }) => {
  const s = A.schritt0 - 0.05;
  const listAt = A.listet - 0.1;
  return (
    <>
      <StepBar t={t} active={0} at0={s} />
      <Card style={{ left: 50, top: 140, width: 980, height: 120, padding: "0 28px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 18, background: C.claudeBg, ...popStyle(t, A.branche - 0.2, 20, 0.95) }}>
        <ClaudeMark size={40} />
        <span style={{ fontFamily: fonts.medium, fontSize: 30, color: C.ink, whiteSpace: "nowrap" }}>
          Branche: <b>{typed("Elektroinstallation", t, A.branche - 0.1, A.region - 0.1)}</b>{t > A.region - 0.1 ? <> · Region: <b>{typed("Münsterland", t, A.region - 0.1, A.durchsucht - 0.1)}</b></> : null}
        </span>
      </Card>
      <div style={{ position: "absolute", left: 50, top: 280, display: "flex", gap: 10, ...popStyle(t, A.durchsucht - 0.05, 10, 0.8) }}>
        {["service.bund.de", "evergabe-online", "DTVP", "TED"].map((p, i) => (
          <span key={p} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: fonts.semibold, fontSize: 22, color: C.ink, background: "#FFF", borderRadius: 999, padding: "8px 16px", boxShadow: shadow, ...popStyle(t, A.durchsucht + i * 0.1, 6, 0.6) }}>
            {t < listAt ? <Spinner t={t} size={20} /> : <Check size={20} color={C.green} />}{p}
          </span>
        ))}
      </div>
      <Card style={{ left: 50, top: 350, width: 980, height: 560, overflow: "hidden", ...popStyle(t, listAt, 30, 0.95) }}>
        <div style={{ display: "flex", padding: "14px 22px", background: "#F4F2EC", fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.12em", color: C.dim }}>
          <span style={{ width: 520 }}>AUSSCHREIBUNG</span><span style={{ width: 200 }}>WERT</span><span>FRIST</span>
        </div>
        {TENDERS.map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", height: 118, padding: "0 22px", borderBottom: `1.5px solid ${C.line}`, ...popStyle(t, listAt + 0.12 + i * 0.12, 8, 0.97) }}>
            <div style={{ width: 520 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 28, color: C.ink }}>{x.t}</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 21, color: C.dim, marginTop: 4 }}>{x.a}</div>
            </div>
            <span style={{ width: 200, fontFamily: MONO, fontWeight: 800, fontSize: 24, color: C.ink }}>{x.v}</span>
            <span style={{ ...popStyle(t, A.frist0 - 0.05 + i * 0.06, 6, 0.6) }}><Tag text={`BIS ${x.f}`} color={i === 0 ? C.orange : C.ink} size={18} /></span>
          </div>
        ))}
      </Card>
    </>
  );
};

// ---------- Scene 3: step 2, upload the tender documents, Claude checks the requirements, marks what's missing ----------
const ScenePruefen: React.FC<{ t: number }> = ({ t }) => {
  const s = A.schritt1 - 0.05;
  const critAt = (i: number) => A.prueft + 0.1 + i * Math.max(0.15, (A.markiert - A.prueft - 0.1) / CRIT.length);
  return (
    <>
      <StepBar t={t} active={1} at0={s - 1} />
      <div style={{ position: "absolute", left: 50, top: 150, display: "flex", gap: 14 }}>
        {[{ n: "Leistungsbeschreibung.pdf", c: C.red }, { n: "Bewerbungsbedingungen.pdf", c: C.red }, { n: "Formblätter.zip", c: C.ink }].map((f, i) => (
          <div key={i} style={popStyle(t, A.unterlagen - 0.1 + i * 0.12, 20, 0.7)}><FileChip name={f.n} kind="Vergabeunterlagen" ext={f.n.endsWith("zip") ? "ZIP" : "PDF"} color={f.c} /></div>
        ))}
      </div>
      <Card style={{ left: 50, top: 260, width: 980, height: 600, padding: "24px 28px", boxSizing: "border-box", ...popStyle(t, A.prueft - 0.15, 30, 0.95) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ClaudeMark size={34} /><span style={{ fontFamily: fonts.bold, fontSize: 30, color: C.ink }}>Anforderungen vs. dein Betrieb</span>
        </div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {CRIT.map((c, i) => {
            const done = t > critAt(i);
            const miss = c.s === "fehlt" && t > A.markiert - 0.05;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 96, borderRadius: 14, padding: "0 20px", background: miss ? C.redSoft : done ? C.greenSoft : "#F7F6F2", ...popStyle(t, A.prueft + i * 0.08, 8, 0.96) }}>
                <span style={{ width: 52, height: 52, borderRadius: "50%", background: miss ? C.red : done ? C.green : "#FFF", border: done || miss ? "none" : `3px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  {miss ? <Cross size={32} p={k(t, A.markiert, 0.25)} /> : done ? <Check size={32} p={k(t, critAt(i), 0.25)} /> : <Spinner t={t} size={36} color={C.dim} />}
                </span>
                <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: C.ink }}>{c.l}</span>
                {miss ? <span style={{ marginLeft: "auto", ...popStyle(t, A.fehlt - 0.05, 6, 0.5) }}><Tag text="FEHLT" color={C.red} size={20} /></span> : done ? <span style={{ marginLeft: "auto" }}><Tag text="ERFÜLLT" color={C.green} size={18} /></span> : null}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};

// ---------- Scene 4: the trick, step 3, checklist for the offer (Und jetzt - Viele) ----------
const SceneCheckliste: React.FC<{ t: number }> = ({ t }) => {
  const s = A.jetzt - 0.15;
  const itemAt = (i: number) => A.jede0 - 0.1 + i * Math.max(0.2, (A.formfehler - A.jede0) / CHECK.length);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", opacity: 1 - k(t, A.schritt2 - 0.1, 0.25) }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 96, color: C.ink, letterSpacing: -3, ...popStyle(t, s, 14, 0.7) }}>Der <span style={{ color: "#FFF", background: C.orange, borderRadius: 18, padding: "0 20px" }}>Trick</span></div>
      </div>
      {t > A.schritt2 - 0.15 ? <StepBar t={t} active={2} at0={A.schritt2 - 0.15} /> : null}
      {t > A.schritt2 - 0.1 ? (
        <Card style={{ left: 50, top: 140, width: 980, height: 760, padding: "24px 30px", boxSizing: "border-box", ...popStyle(t, A.checkliste - 0.1, 30, 0.95) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ClaudeMark size={34} /><span style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink }}>Checkliste · Angebot Grundschule</span>
          </div>
          <div style={{ marginTop: 16 }}>
            {CHECK.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 96, borderBottom: `2px solid ${C.line}`, ...popStyle(t, itemAt(i), 8, 0.96) }}>
                <span style={{ width: 44, height: 44, borderRadius: 10, border: `3px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", background: t > itemAt(i) + 0.35 ? C.green : "#FFF", borderColor: t > itemAt(i) + 0.35 ? C.green : C.ink }}>{t > itemAt(i) + 0.35 ? <Check size={30} p={k(t, itemAt(i) + 0.35, 0.2)} /> : null}</span>
                <span style={{ fontFamily: fonts.semibold, fontSize: 31, color: C.ink }}>{c}</span>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
      <Stamp t={t} at={A.formfehler + 0.1} text="KEIN FORMFEHLER" color={C.green} size={44} rot={-6} style={{ left: 760, top: 830 }} />
    </>
  );
};

// ---------- Scene 5: many never bid - your chance ----------
const ScenePayoff: React.FC<{ t: number }> = ({ t }) => {
  const s = A.viele - 0.1;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: fonts.bold, fontSize: 64, color: C.ink, letterSpacing: -2, ...popStyle(t, s, 12, 0.85) }}>Wer bietet mit?</div>
      <Card style={{ left: 50, top: 210, width: 980, height: 560, padding: "26px 30px", boxSizing: "border-box", ...popStyle(t, s + 0.1, 24, 0.95) }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink }}>Elektroinstallation Grundschule</div>
        <div style={{ display: "flex", gap: 18, marginTop: 30, flexWrap: "wrap" }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 200, height: 140, borderRadius: 16, background: "#F7F6F2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.semibold, fontSize: 26, color: C.dim, ...popStyle(t, s + 0.2 + i * 0.12, 10, 0.8) }}>Angebot {i + 1}</div>)}
          <div style={{ width: 260, height: 140, borderRadius: 16, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 34, color: "#FFF", boxShadow: "0 16px 34px rgba(217,119,87,0.35)", ...popStyle(t, A.chance - 0.1, 14, 0.5) }}>Deins</div>
        </div>
        <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 14, ...popStyle(t, A.nie - 0.05, 10, 0.7) }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: C.red }}>3</span>
          <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: C.ink }}>Angebote. Viele Betriebe bieten nie mit.</span>
        </div>
      </Card>
      <Stamp t={t} at={A.chance + 0.1} text="DEINE CHANCE" color={C.green} size={44} rot={-6} style={{ left: 760, top: 820 }} />
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: A.dabei - 0.05, origin: "50% 50%", El: SceneHook },
  { from: A.dabei - 0.05, to: A.schritt0 - 0.05, origin: "50% 45%", El: ScenePromise },
  { from: A.schritt0 - 0.05, to: A.schritt1 - 0.05, origin: "50% 45%", El: SceneSuche },
  { from: A.schritt1 - 0.05, to: A.jetzt - 0.15, origin: "50% 45%", El: ScenePruefen },
  { from: A.jetzt - 0.15, to: A.viele - 0.1, origin: "50% 45%", El: SceneCheckliste },
  { from: A.viele - 0.1, to: 999, origin: "50% 50%", El: ScenePayoff },
];
// ---------- captions: orange pill, active word in a black pill ----------
const chunks = (() => {
  const out: { start: number; end: number; words: { w: string; s: number }[] }[] = [];
  let cur: Cap[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => ({ w: c.text.replace(/[.,!?]/g, "").toUpperCase(), s: c.startMs / 1000 })) });
    cur = [];
  };
  for (const c of CAPS) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 20) || (cur.length && len > 22)) flush();
    cur.push(c);
    if (/[.,!?]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
})();
const SeamCaption: React.FC<{ t: number; y: number }> = ({ t, y }) => {
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = pop(t, c.start - 0.04, 0.16);
  // long single words (GOOGLE-BEWERTUNG) get a smaller font so the pill stays inside the frame
  const chars = c.words.reduce((m, w) => m + w.w.length, 0) + c.words.length - 1;
  const fs = chars > 18 ? 40 : 46;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.08), background: "#D97757", borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: MONO, fontWeight: 700, fontSize: fs, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(120,50,25,0.30)" }}>
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

// ---------- guide scroll: the real guide PDF (7 pages), fast, tilted, motion blur ----------
const PAGES = Array.from({ length: 4 }, (_, i) => staticFile(`fpn-auftraege/gb-${i + 1}.png`));
const GD = { left: 110, top: 150, w: 860, h: 760, bar: 70, pw: 700, ph: Math.round(700 * 1.4142), gap: 24 };
const PITCH = GD.ph + GD.gap;
const SCROLL_A = G_IN + 0.3, SCROLL_B = G_OUT - 0.1;
const SAMPLES = 8, SHUTTER = 0.6 / FPS;
const scrollY = (t: number) => interpolate(t, [SCROLL_A, SCROLL_B], [0, (PAGES.length - 1) * PITCH], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const GuidePanel: React.FC<{ t: number }> = ({ t }) => {
  const y = scrollY(t);
  const page = Math.min(PAGES.length, Math.max(1, Math.floor((y + (GD.h - GD.bar) / 2) / PITCH) + 1));
  const inQ = k(t, G_IN + 0.05, 0.4, Easing.out(Easing.back(1.2)));
  const tilt = -4 + 1.5 * Math.sin((t - G_IN) * 2);
  return (
    <>
      <div style={{ position: "absolute", left: GD.left, top: GD.top, width: GD.w, height: GD.h, perspective: 1600 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden", background: "#E9E7E1", boxShadow: "0 40px 90px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)", transform: `translateY(${(1 - inQ) * 500}px) rotateX(8deg) rotateZ(${tilt}deg)`, transformOrigin: "50% 100%" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: GD.bar, background: C.chip, display: "flex", alignItems: "center", padding: "0 24px", gap: 14, zIndex: 2 }}>
            <div style={{ width: 32, height: 38, borderRadius: 6, background: C.red, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 11, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 5, boxSizing: "border-box" }}>PDF</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF", whiteSpace: "nowrap" }}>Öffentliche Aufträge · Prompts.pdf</div>
            <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 22, color: "#FFF", background: C.orange, borderRadius: 10, padding: "6px 12px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>SEITE {page}/{PAGES.length}</div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: GD.bar, bottom: 0, overflow: "hidden" }}>
            {Array.from({ length: SAMPLES }, (_, j) => {
              const yy = scrollY(t - (j / (SAMPLES - 1)) * SHUTTER);
              return (
                <div key={j} style={{ position: "absolute", left: (GD.w - GD.pw) / 2, top: 22 - yy, opacity: 1 / (j + 1) }}>
                  {PAGES.map((src, i) => (
                    <Img key={i} src={src} style={{ position: "absolute", left: 0, top: i * PITCH, width: GD.pw, height: GD.ph, borderRadius: 6, boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 50, top: 800, zIndex: 5, transform: "rotate(-6deg)" }}><div style={popStyle(t, G_IN + 0.3, 12, 0.5)}><Tag text="3 PROMPTS" color={C.orange} size={34} /></div></div>
      <div style={{ position: "absolute", right: 50, top: 860, zIndex: 5, transform: "rotate(5deg)" }}><div style={popStyle(t, A.guide, 12, 0.5)}><Tag text="PORTAL-LISTE" color={C.green} size={26} /></div></div>
    </>
  );
};

// ---------- master ----------
const FOCUS = { x: 0.513, y: 0.595, scale: 1.0 }; // overwritten after facefocus if needed
const V_TOP_SPLIT = 400;
const CHEST_Y = 1610;
export const AuftraegeOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // split until the CTA, guide panel uses the same split; then avatar full frame
  const sp = 1 - k(t, G_OUT, 0.42, Easing.inOut(Easing.cubic));
  const inGuide = t >= G_IN - 0.02;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = camera(t, scene.from, Math.min(scene.to, G_IN));
  const dx = Math.sin(t * 0.6) * 6, dy = Math.cos(t * 0.45) * 5;
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTop = V_TOP_SPLIT * sp;
  const push = 1 + 0.03 * (1 - sp) * k(t, G_OUT + 0.4, 2.4, Easing.inOut(Easing.sin));
  const si = Math.max(0, SENT.filter((x) => x <= t).length - 1);
  const sA = SENT[si], sB = SENT[si + 1] ?? AU_END;
  const sp01 = interpolate(t, [sA, sB], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const avZoom = 1 + 0.035 * (si % 2 === 0 ? sp01 : 1 - sp01);
  const El = scene.El;
  const capY = PH * sp + CHEST_Y * (1 - sp);
  // guide: quick whip-out of the scene content before the guide flies in
  const guideCut = k(t, G_IN - 0.1, 0.15);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${push * avZoom})`, transformOrigin: `${FOCUS.x * 100}% ${FOCUS.y * 100}%` }}>
        <OffthreadVideo src={staticFile("fpn-auftraege/tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {sp > 0 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * (1 - sp), width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4 + (t < A.dabei ? -t * 18 : 0)}px, ${dy * 0.4 + (t < A.dabei ? -t * 30 : 0)}px) scale(${1 + (cam - 1) * 0.4})` }} />
          {inGuide ? (
            <GuidePanel t={t} />
          ) : (
            <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translate(${dx}px, ${dy - 60 * guideCut}px) scale(${cam})`, transformOrigin: scene.origin, opacity: 1 - guideCut }}>
              <El t={t} />
            </div>
          )}
        </div>
      ) : null}
      {/* CTA: trigger-word pill */}
      {t > A.komm - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.komm - 0.05, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, letterSpacing: "0.12em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 26px", display: "flex", alignItems: "center" }}>KOMMENTIERE:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, letterSpacing: "0.1em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "8px 28px 8px 32px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>AUFTRAG</div>
          </div>
          <div style={popStyle(t, A.auftragL + 0.15, 10, 0.6)}><LabelChip text="3 Prompts + Portal-Liste · per DM" dot={C.green} size={28} /></div>
        </div>
      ) : null}
      <div style={{ position: "absolute", inset: 0, zIndex: 50, opacity: sp <= 0 || sp >= 1 ? 1 : sp > 0.88 ? (sp - 0.88) / 0.12 : sp < 0.12 ? 1 - sp / 0.12 : 0 }}>
        <SeamCaption t={t} y={capY} />
      </div>
    </AbsoluteFill>
  );
};
