import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-google-bewertung/captions.json";

// FP-N "Google-Bewertung" (2026-10-15), same pattern as NeueFirmenOpus (approved/posted v4, "mittlere Dopamin-Stufe"):
// Split from frame 0 (Henri 14.10.: full-frame B-roll at the start is less trustworthy; facecheck needs a face in every frame).
// 0 - "Wer": dopamine hook inside the panel (Maps card, rating 4.8 -> 4.1, 1-star review, inquiries dropping, phone goes silent),
// text hook integrated at the top, fully visible on frame 0 (thumbnail).
// Then off-white grid panel on top (0-960 px), avatar below, captions as Claude-orange pill on the seam.
// CTA: panel slides away, avatar full frame, comment pill LÖSCHEN, then the guide panel slides back in with a fast tilted
// scroll through the mock guide (7 pages), then avatar full frame again.
// All timings anchored to the word timings of the tightened timeline (runs/fpn-google-bewertung/captions.json).
// Speed ramp 1.1x, music and SFX are applied afterwards (runs/fpn-google-bewertung/make-sfx.mjs).

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 960; // panel height = seam in the split (panelFrac 0.5, below the 0.52 max)

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
  falsche: at("falsche"), gbew: at("googlebewertung"), kostet: at("kostet"), auftraege: at("aufträge"), bevor: at("bevor"), jemand: at("jemand"), anruft: at("anruft"),
  wer: at("wer"), googelt: at("googelt"), sieht: at("sieht"), stern: at("stern"), fragt: at("fragt"), naechsten: at("nächsten"), an: at("an"),
  ich: at("ich", 0), drei: at("drei"), schritten: at("schritten"), wie: at("wie"), wehrst: at("wehrst"),
  hinnehmen: at("hinnehmen"), nicht: at("nicht"), war: at("war"), bewerter: at("bewerter"), nie: at("nie"), kunde: at("kunde"), muss0: at("muss", 0), google0: at("google", 0), pruefen: at("prüfen"),
  sobald: at("sobald"), du1: at("du", 2), dein: at("dein"), macht: at("macht"), meldest: at("meldest"), begruendest: at("begründest"),
  die: at("die", 1), begruendung: at("begründung"), claude0: at("claude", 0), kundenliste: at("kundenliste"), bewertung2: at("bewertung", 1), rein: at("rein"),
  claude1: at("claude", 1), sucht: at("sucht"), name: at("name"), gekauft: at("gekauft"), hat: at("hat"),
  dann0: at("dann", 0), gleicht: at("gleicht"), bewertung3: at("bewertung", 2), regeln: at("regeln"), google1: at("google", 1), ab: at("ab"), schreibt: at("schreibt"), meldung0: at("meldung", 0),
  kurz: at("kurz"), sachlich: at("sachlich"), ohne: at("ohne"), wut: at("wut"),
  ob: at("ob", 1), geloescht: at("gelöscht"), entscheidet: at("entscheidet"), aber: at("aber"), jetzt: at("jetzt"), hinschauen: at("hinschauen"),
  komm: at("kommentier"), loeschen: at("löschen"), schick: at("schick"), vorlage: at("vorlage"), meldung1: at("meldung", 1),
};
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const G_IN = A.vorlage - 0.3; // guide panel slides in
export const G_OUT = LAST_END + 0.9; // guide panel slides out
export const GB_END = G_OUT + 0.65; // short avatar full-frame tail
export const GB_FRAMES = Math.round(GB_END * FPS);

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

// generic placeholders (no real firms, no real people)
const BIZ = "Muster Haustechnik GmbH";
const RIVAL = "Beispiel Sanitär GmbH";
const REVIEWER = "T. Mustermann";
const REVIEW_TXT = "Nie wieder. Total unzuverlässig.";
const CUSTOMERS = ["Anna Beispiel", "Ben Muster", "Clara Probe", "David Vorlage", "Eva Test", "Felix Demo", "Greta Muster", "Hans Beispiel", "Ida Probe", "Jan Vorlage", "Klara Test", "Lukas Demo", "Mia Beispiel", "Noah Muster", "Olga Probe", "Paul Vorlage"];

// ---------- Scene 0: hook inside the panel (0 - "Wer") ----------
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const rating = interpolate(t, [A.gbew, A.kostet + 0.25], [4.8, 4.1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const rStep = Math.round(rating * 10) / 10;
  const bad = k(t, A.gbew, 0.8);
  const inq = Math.round(interpolate(t, [A.kostet, A.bevor], [14, 5], { ...clamp, easing: Easing.out(Easing.quad) }));
  const reviewAt = A.falsche - 0.03;
  const ringing = t > A.bevor && t < A.anruft;
  const ring = ringing ? Math.sin((t - A.bevor) * 55) * 9 : 0;
  const silent = k(t, A.anruft, 0.2);
  const shake = shakeAt(t, reviewAt, 7) + shakeAt(t, A.anruft, 5);
  const drift = 1 + 0.025 * k(t, 0, 3.8, Easing.inOut(Easing.sin));
  // rating digit pulse on every 0.1 step
  const stepPulse = (() => { const f = (4.8 - rating) * 10; const frac = f - Math.floor(f); return t > A.gbew && t < A.kostet + 0.25 ? (1 - frac) * 0.06 : 0; })();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translateX(${shake}px) scale(${drift})`, transformOrigin: "50% 45%" }}>
      {/* text hook, fully visible at frame 0 (thumbnail) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 34, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 70, color: C.ink, letterSpacing: -2, lineHeight: 1.05, whiteSpace: "nowrap" }}>1 Stern von jemandem,</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 70, color: "#FFF", background: C.ink, borderRadius: 16, padding: "4px 24px 12px", letterSpacing: -2, lineHeight: 1.05, whiteSpace: "nowrap" }}>der nie Kunde war?</div>
      </div>
      {/* Maps business card */}
      <Card style={{ left: 50, top: 250, width: 620, height: 400, padding: "24px 30px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Pin size={26} />
          <GoogleWord size={24} /><span style={{ fontFamily: fonts.medium, fontSize: 22, color: C.dim }}>Maps</span>
          <span style={{ marginLeft: "auto" }}><Tag text="UNTERNEHMEN" color={C.ink} size={14} /></span>
        </div>
        <div style={{ fontFamily: fonts.bold, fontSize: 38, color: C.ink, marginTop: 18, whiteSpace: "nowrap" }}>{BIZ}</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 21, color: C.dim, marginTop: 4 }}>Sanitär & Heizung · Musterstadt</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 92, lineHeight: 1, color: bad > 0.5 ? C.red : C.ink, fontVariantNumeric: "tabular-nums", transform: `scale(${1 + stepPulse})`, transformOrigin: "0% 60%", letterSpacing: "-0.04em" }}>{rStep.toFixed(1).replace(".", ",")}</div>
          <div>
            <Stars value={rating} size={42} />
            <div style={{ fontFamily: fonts.medium, fontSize: 20, color: C.dim, marginTop: 6 }}>{t > reviewAt ? 133 : 132} Rezensionen</div>
          </div>
        </div>
        {/* histogram */}
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 7 }}>
          {[5, 1].map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, color: C.dim, width: 14 }}>{s}</span>
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#EFEDE7", overflow: "hidden" }}>
                <div style={{ height: "100%", width: s === 5 ? `${88 - 10 * bad}%` : `${3 + 30 * bad}%`, background: s === 5 ? C.star : C.red, borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
      {/* 1-star review pops in */}
      {t > reviewAt - 0.02 ? (
        <Card style={{ left: 40, top: 664, width: 640, height: 210, padding: "20px 26px", boxSizing: "border-box", border: `3px solid ${C.red}`, transform: `translateX(${(1 - k(t, reviewAt, 0.3, Easing.out(Easing.back(1.4)))) * 720}px) rotate(${-2 + (1 - k(t, reviewAt, 0.3)) * 8}deg)`, zIndex: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar letter="T" size={50} />
            <div>
              <div style={{ fontFamily: fonts.bold, fontSize: 26, color: C.ink }}>{REVIEWER}</div>
              <div style={{ fontFamily: fonts.regular, fontSize: 18, color: C.dim }}>vor 2 Tagen · 1 Rezension</div>
            </div>
            <div style={{ marginLeft: "auto" }}><Stars value={1} size={30} /></div>
          </div>
          <div style={{ fontFamily: fonts.medium, fontSize: 28, color: "#2E2B27", marginTop: 16 }}>„{REVIEW_TXT}“</div>
        </Card>
      ) : null}
      {/* inquiries counter */}
      <Card style={{ left: 700, top: 250, width: 330, height: 270, padding: "22px 24px", boxSizing: "border-box", ...popStyle(t, A.kostet - 0.06, 18, 0.85) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: C.dim }}>ANFRAGEN / WOCHE</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 104, color: C.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.04em" }}>{inq}</div>
          <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: k(t, A.kostet + 0.1, 0.2) }}><path d="M12 4v15M5 12l7 7 7-7" /></svg>
        </div>
        {/* mini bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 58, marginTop: 12 }}>
          {[1, 0.92, 0.95, 0.8, 0.45, 0.32].map((h, i) => {
            const hh = i < 4 ? h : interpolate(t, [A.auftraege + (i - 4) * 0.15, A.auftraege + 0.3 + (i - 4) * 0.15], [0.9, h], { ...clamp, easing: Easing.out(Easing.cubic) });
            return <div key={i} style={{ flex: 1, height: `${hh * 100}%`, borderRadius: 5, background: i < 4 ? "#D9D5CC" : C.red }} />;
          })}
        </div>
      </Card>
      <div style={{ position: "absolute", left: 830, top: 232, zIndex: 6, ...popStyle(t, A.auftraege, 10, 0.5) }}><Tag text="− AUFTRÄGE" color={C.red} size={20} /></div>
      {/* phone tile: rings, then goes silent */}
      <Card style={{ left: 700, top: 540, width: 330, height: 334, padding: "22px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", ...popStyle(t, A.bevor - 0.08, 18, 0.85) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: C.dim, alignSelf: "flex-start" }}>ANRUFE HEUTE</div>
        <div style={{ position: "relative", marginTop: 20, width: 130, height: 130, borderRadius: "50%", background: silent > 0.5 ? "#EFEDE7" : C.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {ringing ? [0, 1].map((j) => {
            const q = ((t - A.bevor) * 1.8 + j * 0.5) % 1;
            return <div key={j} style={{ position: "absolute", inset: -q * 34, borderRadius: "50%", border: `3px solid ${C.green}`, opacity: 1 - q }} />;
          }) : null}
          <div style={{ transform: `rotate(${ring}deg)` }}><PhoneIcon size={64} color={silent > 0.5 ? "#B9B4A9" : C.green} /></div>
          {silent > 0 ? <div style={{ position: "absolute", left: 18, right: 18, top: 63, height: 7, borderRadius: 4, background: C.red, transform: `rotate(-45deg) scaleX(${silent})` }} /> : null}
        </div>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, color: silent > 0.5 ? C.red : C.ink, marginTop: 18 }}>{silent > 0.5 ? "0 Anrufe" : "Klingelt …"}</div>
      </Card>
    </div>
  );
};

// ---------- Scene 1: who googles you sees one star, asks the next (wer - ich) ----------
const SceneGoogeln: React.FC<{ t: number }> = ({ t }) => {
  const s = A.wer;
  const q = "Sanitär Musterstadt";
  const res = A.googelt + 0.35;
  const hl = k(t, A.stern - 0.05, 0.2);
  const pick = A.naechsten;
  const rivalCall: [number, number] = [880, 700];
  const flyQ = k(t, A.an - 0.05, 0.45, Easing.inOut(Easing.cubic));
  return (
    <>
      {/* search bar */}
      <Card style={{ left: 50, top: 40, width: 980, height: 96, borderRadius: 48, display: "flex", alignItems: "center", padding: "0 34px", gap: 18, ...popStyle(t, s, 20, 0.92) }}>
        <GoogleWord size={34} />
        <div style={{ width: 2, height: 44, background: C.line }} />
        <span style={{ fontFamily: fonts.medium, fontSize: 34, color: C.ink, whiteSpace: "nowrap" }}>{typed(q, t, s + 0.05, A.googelt + 0.25)}</span>
        {t < res ? <span style={{ width: 3, height: 38, background: C.blue, marginLeft: -14 }} /> : null}
        <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth={2.6} strokeLinecap="round" style={{ marginLeft: "auto" }}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
      </Card>
      {/* our listing */}
      <Card style={{ left: 50, top: 170, width: 980, height: 360, padding: "24px 30px", boxSizing: "border-box", boxShadow: hl > 0 ? `${shadow}, 0 0 0 ${5 * hl}px ${C.red}` : shadow, ...popStyle(t, res, 24, 0.95) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Pin size={30} />
          <span style={{ fontFamily: fonts.bold, fontSize: 36, color: C.ink }}>{BIZ}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 30, color: C.red }}>4,1</span><Stars value={4.1} size={30} /><span style={{ fontFamily: fonts.regular, fontSize: 22, color: C.dim }}>(133) · Sanitär</span>
        </div>
        <div style={{ marginTop: 18, borderRadius: 14, background: hl > 0 ? `rgba(229,72,77,${0.08 * hl})` : "#F7F6F2", border: `2px solid ${hl > 0.5 ? C.red : C.line}`, padding: "16px 20px", transform: `scale(${1 + 0.04 * press(t, A.stern - 0.05)})`, transformOrigin: "0% 50%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar letter="T" size={38} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 23, color: C.ink }}>{REVIEWER}</span>
            <Stars value={1} size={26} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: "0.12em", color: C.dim, marginLeft: "auto" }}>NEUESTE</span>
          </div>
          <div style={{ fontFamily: fonts.medium, fontSize: 25, color: "#2E2B27", marginTop: 10 }}>„{REVIEW_TXT}“</div>
        </div>
      </Card>
      <div style={{ position: "absolute", left: 640, top: 150, zIndex: 6, ...popStyle(t, A.stern, 10, 0.5) }}><Tag text="1 STERN GANZ OBEN" color={C.red} size={20} /></div>
      {/* rival listing */}
      <Card style={{ left: 50, top: 560, width: 980, height: 230, padding: "24px 30px", boxSizing: "border-box", boxShadow: t > pick ? `${shadow}, 0 0 0 5px ${C.green}` : shadow, ...popStyle(t, res + 0.18, 24, 0.95) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Pin size={30} color="#34A853" />
          <span style={{ fontFamily: fonts.bold, fontSize: 36, color: C.ink }}>{RIVAL}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 30, color: C.ink }}>4,7</span><Stars value={4.7} size={30} /><span style={{ fontFamily: fonts.regular, fontSize: 22, color: C.dim }}>(98) · Sanitär</span>
        </div>
        <span style={{ position: "absolute", right: 30, bottom: 26, height: 62, padding: "0 28px", borderRadius: 31, background: t > pick ? C.green : "#E8F0FE", color: t > pick ? "#FFF" : "#1A56DB", fontFamily: fonts.semibold, fontSize: 26, display: "flex", alignItems: "center", gap: 10, transform: `scale(${1 - 0.12 * press(t, pick)})` }}>
          <PhoneIcon size={26} color={t > pick ? "#FFF" : "#1A56DB"} />Anrufen
        </span>
      </Card>
      {/* inquiry flies from us to the rival */}
      {t > A.an - 0.08 ? (
        <div style={{ position: "absolute", left: 640 + 120 * flyQ, top: 470 + 250 * flyQ - Math.sin(flyQ * Math.PI) * 90, zIndex: 20, opacity: k(t, A.an - 0.08, 0.1) * (1 - k(t, A.an + 0.6, 0.15)), transform: `rotate(${-6 + 12 * flyQ}deg)` }}>
          <Tag text="ANFRAGE →" color={C.ink} size={22} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 60, top: 820, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={popStyle(t, A.fragt, 10, 0.6)}><LabelChip text="Anfrage" size={26} /></div>
        <div style={{ ...popStyle(t, A.fragt + 0.18, 10, 0.6) }}><svg width={54} height={30} viewBox="0 0 54 30" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"><path d="M3 15h44M37 5l10 10-10 10" strokeDasharray={70} strokeDashoffset={70 * (1 - k(t, A.fragt + 0.18, 0.3))} /></svg></div>
        <div style={popStyle(t, A.naechsten, 10, 0.6)}><LabelChip text="Konkurrenz" dot={C.green} size={26} /></div>
      </div>
      <Mascot t={t} targets={[{ at: pick, p: () => rivalCall }]} hold={0.3} />
    </>
  );
};

// ---------- Scene 2: three steps, shown once (ich - hinnehmen) ----------
const STEPS = [
  { n: "1", t1: "Kundenliste", t2: "abgleichen", icon: "M4 6h16M4 12h16M4 18h10" },
  { n: "2", t1: "Google-Regeln", t2: "prüfen", icon: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" },
  { n: "3", t1: "Meldung", t2: "schreiben", icon: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" },
];
const SceneSchritte: React.FC<{ t: number }> = ({ t }) => {
  const s = A.ich;
  const stepAt = [A.drei - 0.05, A.schritten + 0.12, A.wie + 0.15];
  const done = A.wehrst - 0.05;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 84, color: C.ink, letterSpacing: -2, ...popStyle(t, s, 14, 0.8) }}>In</div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 120, color: "#FFF", background: C.orange, borderRadius: 22, padding: "0 30px", lineHeight: 1.15, ...popStyle(t, A.drei - 0.05, 14, 0.5), boxShadow: "0 16px 34px rgba(217,119,87,0.35)" }}>3</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 84, color: C.ink, letterSpacing: -2, ...popStyle(t, A.schritten, 14, 0.8) }}>Schritten</div>
      </div>
      {STEPS.map((_, i) => (
        <div key={`slot${i}`} style={{ position: "absolute", left: 50 + i * 333, top: 270, width: 314, height: 470, borderRadius: 18, border: "3px dashed #D6D1C6", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 88, color: "#DDD8CE", opacity: k(t, s + i * 0.08, 0.15) * (t < stepAt[i] + 0.3 ? 1 : 0), transform: `scale(${0.9 + 0.1 * pop(t, s + i * 0.08)})` }}>{i + 1}</div>
      ))}
      {STEPS.map((st, i) => (
        <Card key={i} style={{ left: 50 + i * 333, top: 270, width: 314, height: 470, padding: "30px 26px", boxSizing: "border-box", boxShadow: t > done + i * 0.08 ? `${shadow}, 0 0 0 5px ${C.green}` : shadow, ...popStyle(t, stepAt[i], 40, 0.8) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 88, color: C.orange, lineHeight: 1 }}>{st.n}</div>
          <div style={{ marginTop: 34, width: 86, height: 86, borderRadius: 22, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={50} height={50} viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round"><path d={st.icon} /></svg>
          </div>
          <div style={{ fontFamily: fonts.bold, fontSize: 36, color: C.ink, marginTop: 34, lineHeight: 1.15 }}>{st.t1}<br /><span style={{ color: "#5B5852" }}>{st.t2}</span></div>
          {t > done + i * 0.08 ? (
            <div style={{ position: "absolute", right: 22, top: 26, width: 52, height: 52, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(t, done + i * 0.08)})` }}><Check size={32} p={k(t, done + i * 0.08, 0.25)} /></div>
          ) : null}
        </Card>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", ...popStyle(t, done, 10, 0.6) }}><LabelChip text="So wehrst du dich" dot={C.green} size={30} /></div>
    </>
  );
};

// ---------- Scene 3: don't accept it, never a customer -> Google must check, report + reason (hinnehmen - die) ----------
// v2: the review card is on screen from "Hinnehmen" with [Hinnehmen] [Melden] buttons ("nicht" crosses out Hinnehmen),
// a "Kundenkontakt" check fills the lower half on "nie / dein / Kunde", the mascot opens the report dialog on "Sobald".
const SceneMelden: React.FC<{ t: number }> = ({ t }) => {
  const strike = k(t, A.nicht, 0.25, Easing.inOut(Easing.cubic));
  const rv = A.hinnehmen - 0.03;
  const openAt = A.sobald - 0.05; // mascot clicks "Melden" on the review card
  const dlgAt = openAt + 0.1;
  const melden = A.meldest + 0.05; // mascot submits the dialog
  const grund = A.begruendest - 0.05;
  const lift = k(t, dlgAt, 0.35, Easing.inOut(Easing.cubic));
  const cardTop = 180 - 130 * lift;
  const cardBtn: [number, number] = [935, cardTop + 286];
  const subBtn: [number, number] = [880, 838];
  const shake = shakeAt(t, A.nicht, 6);
  const checks = [
    { l: "Auftrag", a: A.nie },
    { l: "Rechnung", a: A.nie + 0.15 + (A.kunde - A.nie - 0.15) * 0.4 },
    { l: "Termin", a: A.kunde },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 22, opacity: 1 - lift, transform: `translateY(${-60 * lift}px)` }}>
        <div style={{ position: "relative", fontFamily: fonts.bold, fontSize: 80, color: C.ink, letterSpacing: -2, ...popStyle(t, A.hinnehmen, 12, 0.85), transformOrigin: "0% 50%" }}>
          Hinnehmen?
          <div style={{ position: "absolute", left: -6, top: "54%", height: 9, borderRadius: 5, background: C.red, width: `${strike * 104}%` }} />
        </div>
        <div style={{ fontFamily: fonts.bold, fontSize: 80, color: "#FFF", background: C.ink, borderRadius: 16, padding: "0 22px 8px", letterSpacing: -2, ...popStyle(t, A.nicht + 0.05, 12, 0.5) }}>Nein.</div>
      </div>
      {/* the review, with actions, later flagged */}
      <Card style={{ left: 50, top: cardTop, width: 980, height: 330, padding: "26px 32px", boxSizing: "border-box", border: `3px solid ${t > A.nie ? C.red : C.line}`, ...popStyle(t, rv, 40, 0.9) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar letter="T" size={62} />
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink }}>
              <span style={{ background: `rgba(229,72,77,${0.16 * k(t, A.bewerter, 0.2)})`, boxShadow: `inset 0 -${4 * k(t, A.bewerter, 0.2)}px 0 ${C.red}`, padding: "2px 6px", borderRadius: 6 }}>{REVIEWER}</span>
            </div>
            <div style={{ fontFamily: fonts.regular, fontSize: 20, color: C.dim, marginTop: 4 }}>vor 2 Tagen · 1 Rezension</div>
          </div>
          <div style={{ marginLeft: "auto" }}><Stars value={1} size={36} /></div>
        </div>
        <div style={{ fontFamily: fonts.medium, fontSize: 32, color: "#2E2B27", marginTop: 20 }}>„{REVIEW_TXT}“</div>
        <div style={{ position: "absolute", left: 32, bottom: 26, display: "inline-flex", alignItems: "center", gap: 10, background: C.red, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 21, letterSpacing: "0.1em", borderRadius: 10, padding: "10px 16px", ...popStyle(t, A.nie, 10, 0.5) }}>
          <FlagIcon size={22} />BEWERTER WAR NIE KUNDE
        </div>
        {/* actions */}
        <div style={{ position: "absolute", right: 28, bottom: 22, display: "flex", gap: 12 }}>
          <span style={{ position: "relative", height: 56, padding: "0 22px", borderRadius: 12, border: `2.5px solid ${strike > 0 ? C.red : C.line}`, background: "#FFF", color: strike > 0.5 ? "#B9B4A9" : C.ink, fontFamily: fonts.semibold, fontSize: 23, display: "flex", alignItems: "center", transform: `translateX(${shake}px)` }}>
            Hinnehmen
            <span style={{ position: "absolute", left: 10, right: 10, top: "50%", height: 4, borderRadius: 2, background: C.red, transform: `scaleX(${strike})`, transformOrigin: "0% 50%" }} />
          </span>
          <span style={{ height: 56, padding: "0 24px", borderRadius: 12, background: t > openAt ? C.green : C.orange, color: "#FFF", fontFamily: fonts.semibold, fontSize: 23, display: "flex", alignItems: "center", gap: 8, transform: `scale(${1 + 0.06 * press(t, A.nicht + 0.15) - 0.12 * press(t, openAt)})`, boxShadow: strike > 0.5 ? "0 0 0 5px rgba(217,119,87,0.25)" : "none" }}>
            <FlagIcon size={20} />Melden
          </span>
        </div>
      </Card>
      {/* customer contact check (lower half, before the dialog) */}
      {lift < 1 ? (
        <Card style={{ left: 50, top: 545, width: 600, height: 375, padding: "22px 28px", boxSizing: "border-box", opacity: (1 - lift) * k(t, A.war - 0.05, 0.15), transform: `translateY(${(1 - k(t, A.war - 0.05, 0.3)) * 30 + 40 * lift}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 17, letterSpacing: "0.14em", color: C.dim }}>KUNDENKONTAKT · {REVIEWER.toUpperCase()}</span>
          </div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {checks.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 76, borderRadius: 12, padding: "0 18px", background: t > c.a ? C.redSoft : "#F7F6F2", transform: `scale(${1 + 0.04 * press(t, c.a)})`, ...(t < A.war + 0.3 ? popStyle(t, A.war + i * 0.08, 10, 0.94) : {}) }}>
                <span style={{ position: "relative", width: 44, height: 44, flex: "none" }}>
                  {t < c.a + 0.1 ? <span style={{ position: "absolute", inset: 0 }}><Spinner t={t} size={44} color={C.dim} /></span> : null}
                  {t > c.a ? <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(t, c.a)})` }}><Cross size={28} p={k(t, c.a, 0.22)} /></span> : null}
                </span>
                <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: C.ink }}>{c.l}</span>
                <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: t > c.a ? C.red : C.dim }}>{t > c.a ? "KEINER" : "PRÜFE …"}</span>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
      {t > A.google0 - 0.08 && lift < 1 ? (
        <div style={{ position: "absolute", left: 680, top: 560, zIndex: 7, opacity: 1 - lift }}>
          <div style={popStyle(t, A.google0 - 0.05, 12, 0.6)}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FFF", borderRadius: 999, padding: "12px 24px", boxShadow: shadow }}><GoogleWord size={32} /><span style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>muss prüfen</span></div>
          </div>
        </div>
      ) : null}
      {lift < 0.99 ? <div style={{ position: "absolute", inset: 0, opacity: 1 - lift }}><Stamp t={t} at={A.pruefen} text="PRÜFPFLICHT" color={C.green} size={48} rot={-7} style={{ left: 845, top: 760 }} /></div> : null}
      {/* report dialog */}
      {t > dlgAt ? (
        <Card style={{ left: 50, top: 400, width: 980, height: 520, padding: "26px 32px", boxSizing: "border-box", ...popStyle(t, dlgAt, 40, 0.94) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.bold, fontSize: 32, color: C.ink }}><FlagIcon size={30} color={C.ink} />Rezension melden</div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {["Interessenkonflikt", "Fake-Interaktion · kein Kundenkontakt", "Beleidigung"].map((o, i) => {
              const sel = i === 1 && t > A.du1 - 0.05;
              return (
                <div key={o} style={{ display: "flex", alignItems: "center", gap: 14, height: 56, borderRadius: 12, padding: "0 16px", background: sel ? C.orangeSoft : "#F7F6F2", border: `2px solid ${sel ? C.orange : "transparent"}`, fontFamily: fonts.medium, fontSize: 25, color: C.ink, ...popStyle(t, dlgAt + 0.06 + i * 0.06, 8, 0.96) }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", border: `3px solid ${sel ? C.orange : "#B9B4A9"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{sel ? <span style={{ width: 12, height: 12, borderRadius: "50%", background: C.orange }} /> : null}</span>{o}
                </div>
              );
            })}
          </div>
          {/* reason field */}
          <div style={{ marginTop: 16, height: 96, borderRadius: 12, border: `2.5px ${t > grund ? "solid" : "dashed"} ${t > grund ? C.orange : "#D6D1C6"}`, padding: "12px 16px", boxSizing: "border-box", opacity: k(t, grund - 0.1, 0.2), transform: `scale(${1 + 0.03 * press(t, grund)})` }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: "0.14em", color: C.dim }}>BEGRÜNDUNG</div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 8, fontFamily: fonts.medium, fontSize: 24, color: "#B9B4A9" }}>
              {Math.floor(t * 2.5) % 2 === 0 && t > grund ? <span style={{ width: 3, height: 28, background: C.orange, marginRight: 6 }} /> : <span style={{ width: 9 }} />}Warum verstößt die Bewertung?
            </div>
          </div>
          <span style={{ position: "absolute", right: 32, bottom: 26, height: 60, padding: "0 30px", borderRadius: 12, background: t > melden ? C.green : C.ink, color: "#FFF", fontFamily: fonts.semibold, fontSize: 26, display: "flex", alignItems: "center", gap: 10, transform: `scale(${1 - 0.12 * press(t, melden)})` }}>
            {t > melden ? <><Check size={28} p={k(t, melden, 0.25)} />Gemeldet</> : "Melden"}
          </span>
        </Card>
      ) : null}
      <Stamp t={t} at={A.begruendest + 0.15} text="+ BEGRÜNDUNG" color={C.orange} size={36} rot={-6} style={{ left: 760, top: 735 }} />
      <Mascot t={t} targets={[{ at: openAt, p: () => cardBtn }, { at: melden, p: () => subBtn }]} hold={0.35} />
    </>
  );
};

// ---------- Claude window shared by scenes 4 + 5 ----------
const CW = { x: 50, y: 92, w: 980, h: 836 };
const ClaudeFrame: React.FC<{ children?: React.ReactNode; title: string }> = ({ children, title }) => (
  <Card style={{ left: CW.x, top: CW.y, width: CW.w, height: CW.h, overflow: "hidden", background: C.claudeBg }}>
    <div style={{ height: 56, background: "#F0EEE6", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 10, fontFamily: fonts.semibold, fontSize: 21, color: "#6E6B65" }}>
      <ClaudeMark size={22} />Claude<span style={{ color: "#B9B4A9" }}>/</span><span style={{ color: C.ink }}>{title}</span>
    </div>
    {children}
  </Card>
);

// ---------- Scene 4: Claude does the reason: customer list + review in, search the name (die - dann+0.4) ----------
// v2: no idle welcome screen. "Begründung" types the task headline, "Kundenliste" drops a big CSV preview into the drop zone,
// "Bewertung" drops the review screenshot, "rein" sends (both shrink into the message), the table is there at once and
// scrolls on "sucht", "Name" highlights the search, "gekauft" reveals "Kein Treffer in 1.240 Kunden" (held > 1 s).
export const SUCHE_END = A.dann0 + 0.4;
const SceneSuche: React.FC<{ t: number }> = ({ t }) => {
  const s = A.die - 0.05;
  const f1 = A.kundenliste - 0.04, f2 = A.bewertung2 - 0.04;
  const PROMPT = "Hat T. Mustermann je bei mir gekauft?";
  const pA = A.bewertung2 + 0.1, sendAt = A.rein + 0.02;
  const sent = t >= sendAt + 0.05;
  const shrink = k(t, sendAt, 0.28, Easing.in(Easing.cubic));
  const searchA = A.sucht - 0.05, searchB = A.gekauft - 0.05;
  const scanned = Math.round(interpolate(t, [searchA, searchB], [0, 1240], { ...clamp, easing: Easing.inOut(Easing.quad) }));
  const resultAt = A.gekauft - 0.03;
  const drop = (a: number, from: number): React.CSSProperties => {
    const f = k(t, a, 0.38, Easing.out(Easing.back(1.25)));
    return { opacity: k(t, a, 0.08) * (1 - shrink), transform: `translate(${(1 - f) * from + shrink * 260}px, ${(1 - f) * -520 - shrink * 300}px) rotate(${(1 - f) * (from > 0 ? 10 : -10) + (f >= 1 ? (from > 0 ? 2 : -2) : 0)}deg) scale(${1 - 0.75 * shrink})` };
  };
  const sendP: [number, number] = [CW.x + CW.w - 22 - 30, CW.y + CW.h - 16 - 30];
  const rowH = 46;
  const scroll = Math.max(0, Math.min(t, searchB) - searchA) * 1000;
  const headline = typed("Begründung für die Meldung", t, A.begruendung - 0.02, A.macht + 0.1);
  return (
    <>
      <div style={{ position: "absolute", left: CW.x, top: 22, display: "flex", gap: 14, zIndex: 3 }}>
        <div style={popStyle(t, s, 10, 0.6)}><LabelChip text="Claude" size={24} /></div>
        <div style={popStyle(t, A.claude0 - 0.04, 10, 0.6)}><LabelChip text="macht die Begründung" dot={C.green} size={24} /></div>
      </div>
      <div style={{ position: "absolute", inset: 0, ...popStyle(t, s, 30, 0.95) }}>
        <ClaudeFrame title="Bewertung prüfen">
          {!sent ? (
            <>
              {/* task headline */}
              <div style={{ position: "absolute", left: 30, right: 30, top: 80, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ transform: `rotate(${t > A.claude0 - 0.05 ? (t - A.claude0) * 260 : 0}deg) scale(${1 + 0.25 * press(t, A.claude0)})` }}><ClaudeMark size={48} /></div>
                <div style={{ fontFamily: fonts.bold, fontSize: 40, color: C.ink, whiteSpace: "nowrap" }}>{headline}{t < A.kundenliste ? <span style={{ display: "inline-block", width: 3, height: 38, background: C.orange, marginLeft: 3, verticalAlign: "-5px" }} /> : null}</div>
              </div>
              {/* drop zone */}
              <div style={{ position: "absolute", left: 30, right: 30, top: 160, height: 430, borderRadius: 18, border: `3px dashed ${t > f1 - 0.15 ? C.orange : "#D6D1C6"}`, background: t > f1 - 0.15 ? "rgba(217,119,87,0.05)" : "transparent", opacity: k(t, s + 0.1, 0.2) }}>
                {t < f1 ? (
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, color: C.dim, fontFamily: fonts.medium, fontSize: 28, transform: `scale(${1 + 0.03 * Math.sin(t * 9)})` }}>
                    <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V4M7 9l5-5 5 5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" /></svg>
                    Kundenliste + Bewertung hier ablegen
                  </div>
                ) : null}
              </div>
              {/* big CSV preview */}
              {t > f1 ? (
                <div style={{ position: "absolute", left: 50, top: 185, width: 430, height: 380, borderRadius: 16, background: "#FFF", boxShadow: "0 18px 40px rgba(20,20,20,0.16)", overflow: "hidden", ...drop(f1, -420) }}>
                  <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", background: C.greenSoft, borderBottom: `2px solid ${C.line}` }}>
                    <span style={{ width: 36, height: 42, borderRadius: 6, background: C.green, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 11, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 5, boxSizing: "border-box" }}>CSV</span>
                    <span style={{ fontFamily: fonts.bold, fontSize: 25, color: C.ink }}>kundenliste.csv</span>
                  </div>
                  {CUSTOMERS.slice(0, 6).map((n, i) => (
                    <div key={n} style={{ display: "flex", alignItems: "center", height: 44, padding: "0 16px", borderBottom: `1.5px solid ${C.line}`, fontSize: 21, ...popStyle(t, f1 + 0.2 + i * 0.05, 6, 0.98) }}>
                      <span style={{ width: 60, fontFamily: MONO, fontSize: 16, color: C.dim }}>{String(i + 1).padStart(4, "0")}</span>
                      <span style={{ fontFamily: fonts.medium, color: C.ink }}>{n}</span>
                    </div>
                  ))}
                  <div style={{ position: "absolute", left: 16, bottom: 12 }}><Tag text="1.240 KUNDEN" color={C.green} size={18} /></div>
                </div>
              ) : null}
              {/* review screenshot */}
              {t > f2 ? (
                <div style={{ position: "absolute", left: 500, top: 215, width: 430, height: 300, borderRadius: 16, background: "#FFF", boxShadow: "0 18px 40px rgba(20,20,20,0.16)", border: `3px solid ${C.red}`, padding: "18px 20px", boxSizing: "border-box", ...drop(f2, 420) }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <span style={{ width: 36, height: 42, borderRadius: 6, background: C.blue, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 11, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 5, boxSizing: "border-box" }}>PNG</span>
                    <span style={{ fontFamily: fonts.bold, fontSize: 23, color: C.ink }}>bewertung.png</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar letter="T" size={42} />
                    <span style={{ fontFamily: fonts.bold, fontSize: 24, color: C.ink }}>{REVIEWER}</span>
                  </div>
                  <div style={{ marginTop: 10 }}><Stars value={1} size={30} /></div>
                  <div style={{ fontFamily: fonts.medium, fontSize: 23, color: "#2E2B27", marginTop: 10 }}>„{REVIEW_TXT}“</div>
                </div>
              ) : null}
            </>
          ) : (
            <>
              {/* user message */}
              <div style={{ position: "absolute", right: 22, top: 74, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, ...popStyle(t, sendAt + 0.05, 12, 0.92) }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontFamily: fonts.semibold, fontSize: 18, color: C.dim, border: `2px solid ${C.line}`, background: "#FFF", borderRadius: 10, padding: "6px 12px" }}>CSV · 1.240 Kunden</span>
                  <span style={{ fontFamily: fonts.semibold, fontSize: 18, color: C.dim, border: `2px solid ${C.line}`, background: "#FFF", borderRadius: 10, padding: "6px 12px" }}>PNG · Bewertung</span>
                </div>
                <div style={{ background: "#ECE9E1", borderRadius: 16, padding: "10px 18px", fontFamily: fonts.medium, fontSize: 24, color: C.ink, whiteSpace: "nowrap" }}>{PROMPT}</div>
              </div>
              {/* Claude answer */}
              <div style={{ position: "absolute", left: 22, right: 22, top: 196 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, height: 40 }}>
                  <div style={{ transform: `rotate(${t < resultAt ? (t - sendAt) * 260 : 0}deg)` }}><ClaudeMark size={32} /></div>
                  {t < resultAt ? <span style={{ fontFamily: fonts.medium, fontSize: 24, color: C.dim }}>{t < searchA ? "Öffnet kundenliste.csv …" : "Sucht „Mustermann“ in 1.240 Kunden …"}</span> : <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.ink }}>Ergebnis der Suche:</span>}
                </div>
                {/* CSV viewport */}
                <div style={{ position: "relative", marginTop: 12, height: 470, borderRadius: 12, border: `2px solid ${C.line}`, background: "#FFF", overflow: "hidden", ...popStyle(t, sendAt + 0.08, 14, 0.96) }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 46, background: "#F4F2EC", display: "flex", alignItems: "center", padding: "0 18px", fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.12em", color: C.dim, zIndex: 2 }}>
                    <span style={{ width: 90 }}>NR</span><span style={{ width: 340 }}>NAME</span><span>LETZTER AUFTRAG</span>
                    <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF", border: `2px solid ${C.orange}`, borderRadius: 8, padding: "2px 10px", color: C.ink, letterSpacing: 0, fontFamily: fonts.semibold, fontSize: 18, ...popStyle(t, A.name - 0.05, 6, 0.6) }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth={3} strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>Mustermann
                    </span>
                  </div>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 46, bottom: 0, overflow: "hidden", filter: t > searchA && t < searchB ? "blur(0.7px)" : "none" }}>
                    {Array.from({ length: 11 }, (_, i) => {
                      const y = ((i * rowH - scroll) % (11 * rowH) + 11 * rowH) % (11 * rowH) - rowH;
                      const idx = Math.floor((i * rowH + scroll) / (11 * rowH)) * 11 + i;
                      const nm = CUSTOMERS[(idx * 7) % CUSTOMERS.length];
                      return (
                        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: rowH, borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 18px", fontSize: 22 }}>
                          <span style={{ width: 90, fontFamily: MONO, color: C.dim, fontSize: 17 }}>{String(1 + (idx % 1240)).padStart(4, "0")}</span>
                          <span style={{ width: 340, fontFamily: fonts.medium, color: C.ink }}>{nm}</span>
                          <span style={{ fontFamily: fonts.regular, color: "#5B5852" }}>{`${String(1 + (idx % 28)).padStart(2, "0")}.0${1 + (idx % 9)}.2026`}</span>
                        </div>
                      );
                    })}
                    {t > A.name - 0.05 && t < resultAt ? <div style={{ position: "absolute", left: 0, right: 0, top: 138, height: rowH, background: "rgba(217,119,87,0.16)", borderTop: `2px solid ${C.orange}`, borderBottom: `2px solid ${C.orange}` }} /> : null}
                  </div>
                  <div style={{ position: "absolute", right: 14, bottom: 12, zIndex: 3, fontFamily: MONO, fontWeight: 800, fontSize: 22, color: "#FFF", background: C.ink, borderRadius: 8, padding: "6px 12px", fontVariantNumeric: "tabular-nums" }}>{scanned.toLocaleString("de-DE")} / 1.240 geprüft</div>
                  {t > resultAt ? <div style={{ position: "absolute", inset: 0, background: `rgba(244,243,239,${0.7 * k(t, resultAt, 0.2)})`, zIndex: 2 }} /> : null}
                </div>
                {/* result banner: the key reveal, big and held until the scene ends */}
                {t > resultAt ? (
                  <div style={{ position: "absolute", left: 20, right: 20, top: 170, zIndex: 5, display: "flex", alignItems: "center", gap: 24, background: "#FFF", border: `4px solid ${C.red}`, borderRadius: 22, padding: "30px 30px", boxShadow: "0 28px 70px rgba(20,20,20,0.25)", ...popStyle(t, resultAt, 20, 0.7) }}>
                    <div style={{ width: 96, height: 96, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Cross size={60} p={k(t, resultAt, 0.25)} /></div>
                    <div>
                      <div style={{ fontFamily: fonts.bold, fontSize: 50, color: C.ink, whiteSpace: "nowrap", letterSpacing: -1, lineHeight: 1.05 }}>Kein Treffer</div>
                      <div style={{ fontFamily: fonts.bold, fontSize: 42, color: C.red, whiteSpace: "nowrap", letterSpacing: -1, marginTop: 4 }}>in 1.240 Kunden</div>
                      <div style={{ fontFamily: fonts.medium, fontSize: 22, color: C.dim, marginTop: 8 }}>„T. Mustermann“ hat nie bei dir gekauft</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}
          {/* composer */}
          <div style={{ position: "absolute", left: 22, right: 22, bottom: 16, height: 64, borderRadius: 16, border: `2px solid ${!sent && t > pA - 0.1 ? C.orange : C.line}`, background: "#FFF", padding: "10px 14px 10px 18px", boxSizing: "border-box" }}>
            <div style={{ position: "absolute", left: 18, right: 80, bottom: 10, minHeight: 42, display: "flex", alignItems: "center", fontFamily: fonts.medium, fontSize: 25, color: sent || t < pA ? "#AAA69E" : C.ink, whiteSpace: "nowrap", overflow: "hidden" }}>
              {sent ? "Antworte Claude …" : t < pA ? "Schreib Claude …" : <>{typed(PROMPT, t, pA, sendAt - 0.06)}<span style={{ display: "inline-block", width: 3, height: 28, background: C.orange, marginLeft: 2 }} /></>}
            </div>
            <span style={{ position: "absolute", right: 8, bottom: 8, transform: `scale(${1 - 0.18 * press(t, sendAt)})`, width: 44, height: 44, borderRadius: 12, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: fonts.bold, fontSize: 26 }}>↑</span>
          </div>
        </ClaudeFrame>
      </div>
      <Stamp t={t} at={A.hat} text="KEIN KUNDE" color={C.red} size={44} rot={-7} style={{ left: 800, top: 300 }} />
      <Mascot t={t} targets={[{ at: sendAt, p: () => sendP }]} hold={0.3} />
    </>
  );
};

// ---------- Scene 5: Claude checks Google's rules and writes the report; short, factual, no anger (dann - ob) ----------
const RULES = [
  { r: "Fake-Interaktion · kein echter Kundenkontakt", hit: true },
  { r: "Interessenkonflikt", hit: false },
  { r: "Thema verfehlt", hit: false },
  { r: "Beleidigung / Hassrede", hit: false },
];
const MELDUNG = "Die Bewertung von T. Mustermann beruht nicht auf einer echten Erfahrung. In unseren Kundendaten (1.240 Kunden) gibt es keinen Auftrag und keine Anfrage unter diesem Namen. Verstoß gegen die Richtlinie zu gefälschten Interaktionen. Bitte prüfen.";
const SceneMeldung: React.FC<{ t: number }> = ({ t }) => {
  const rulesAt = Math.max(A.gleicht - 0.05, SUCHE_END);
  const rowAt = (i: number) => rulesAt + 0.12 + i * 0.14;
  const scanA = A.regeln - 0.05, scanB = A.ab - 0.05;
  const scanRow = interpolate(t, [scanA, scanB], [3, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const hitAt = A.ab;
  const mAt = A.schreibt - 0.08;
  const up = k(t, A.kurz - 0.12, 0.4, Easing.inOut(Easing.cubic));
  const mTop = 470 - 300 * up;
  const chips = [{ x: "Kurz.", a: A.kurz }, { x: "Sachlich.", a: A.sachlich }, { x: "Ohne Wut.", a: A.wut - 0.06 }];
  return (
    <>
      <div style={{ position: "absolute", left: CW.x, top: 22, display: "flex", gap: 14, zIndex: 3 }}>
        <LabelChip text="Claude" size={24} />
        <div style={popStyle(t, A.regeln, 10, 0.6)}><div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FFF", borderRadius: 999, padding: "8px 20px", boxShadow: "0 10px 24px rgba(0,0,0,0.12)" }}><GoogleWord size={26} /><span style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.ink }}>Richtlinien</span></div></div>
      </div>
      <ClaudeFrame title="Bewertung prüfen">
        {/* rules check */}
        <div style={{ position: "absolute", left: 22, right: 22, top: 74, height: 470, borderRadius: 14, border: `2px solid ${C.line}`, background: "#FFF", padding: "18px 20px", boxSizing: "border-box", opacity: 1 - up, transform: `translateY(${-80 * up}px)`, ...(t < rulesAt + 0.4 ? popStyle(t, rulesAt, 20, 0.95) : {}) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.bold, fontSize: 28, color: C.ink }}>
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth={2.4} strokeLinejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" /></svg>
            Richtlinien für Rezensionen
            <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: "0.12em", color: C.dim }}>ABGLEICH</span>
          </div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
            {t > scanA && t < scanB + 0.05 ? <div style={{ position: "absolute", left: -6, right: -6, top: scanRow * 88 - 4, height: 82, borderRadius: 12, border: `2.5px solid ${C.orange}`, background: "rgba(217,119,87,0.08)" }} /> : null}
            {RULES.map((r, i) => {
              const hit = r.hit && t > hitAt;
              const checked = !r.hit && t > hitAt + 0.1;
              return (
                <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, height: 78, borderRadius: 12, padding: "0 16px", background: hit ? C.greenSoft : "#F7F6F2", fontFamily: r.hit ? fonts.semibold : fonts.medium, fontSize: 28, color: checked ? "#A9A49A" : C.ink, ...popStyle(t, rowAt(i), 8, 0.96) }}>
                  <span style={{ width: 34, height: 34, borderRadius: 9, background: hit ? C.green : "#FFF", border: hit ? "none" : `2.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", transform: `scale(${hit ? 1 + 0.3 * press(t, hitAt) : 1})` }}>{hit ? <Check size={24} p={k(t, hitAt, 0.25)} /> : checked ? <span style={{ width: 12, height: 3, background: "#C9C4BA" }} /> : null}</span>
                  {r.r}
                  {hit ? <span style={{ marginLeft: "auto", ...popStyle(t, hitAt + 0.05, 6, 0.5) }}><Tag text="VERSTOSS" color={C.green} size={16} /></span> : null}
                </div>
              );
            })}
          </div>
        </div>
        {/* the report */}
        {t > mAt ? (
          <div style={{ position: "absolute", left: 22, right: 22, top: mTop, height: 420, borderRadius: 14, background: "#FFF", border: `2px solid ${C.line}`, borderLeft: `8px solid ${C.orange}`, padding: "18px 24px", boxSizing: "border-box", boxShadow: "0 18px 40px rgba(20,20,20,0.12)", ...popStyle(t, mAt, 60, 0.95) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ClaudeMark size={26} />
              <span style={{ fontFamily: fonts.bold, fontSize: 28, color: C.ink }}>Meldung an Google</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.12em", color: C.dim, ...popStyle(t, A.kurz, 6, 0.6) }}>35 WÖRTER</span>
            </div>
            <div style={{ fontFamily: fonts.regular, fontSize: 27, lineHeight: 1.45, color: "#2E2B27", marginTop: 14 }}>
              {typed(MELDUNG, t, mAt + 0.15, A.sachlich + 0.3)}
              {t < A.sachlich + 0.3 ? <span style={{ display: "inline-block", width: 3, height: 28, background: C.orange, marginLeft: 2, verticalAlign: "-4px" }} /> : null}
            </div>
          </div>
        ) : null}
        {/* short. factual. no anger. */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", gap: 18 }}>
          {chips.map((c, i) => (
            <div key={i} style={popStyle(t, c.a, 16, 0.5)}><LabelChip text={c.x} dot={C.green} size={36} /></div>
          ))}
        </div>
      </ClaudeFrame>
    </>
  );
};

// ---------- Scene 6: Google decides, but now Google has to look (ob - CTA) ----------
const SceneEntscheidung: React.FC<{ t: number }> = ({ t }) => {
  const s = A.ob - 0.05;
  const decAt = A.entscheidet;
  const runAt = A.aber - 0.05;
  const lookAt = A.hinschauen - 0.05;
  const rows = [
    { l: "Meldung gesendet", a: s + 0.1, state: "done" },
    { l: "Prüfung läuft", a: s + 0.25, state: t > runAt ? "run" : "wait" },
    { l: "Entscheidung: Google", a: s + 0.4, state: t > decAt ? "focus" : "wait" },
  ];
  const prog = interpolate(t, [runAt, runAt + 1.6], [0.08, 0.62], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 70, color: C.ink, letterSpacing: -2, ...popStyle(t, A.geloescht - 0.05, 12, 0.85), transformOrigin: "0% 50%" }}>Gelöscht?</div>
        <div style={{ ...popStyle(t, decAt, 12, 0.5) }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#FFF", borderRadius: 16, padding: "10px 22px", boxShadow: shadow }}><span style={{ fontFamily: fonts.bold, fontSize: 40, color: C.ink }}>entscheidet</span><GoogleWord size={44} /></div>
        </div>
      </div>
      <Card style={{ left: 50, top: 180, width: 980, height: 560, padding: "28px 34px", boxSizing: "border-box", ...popStyle(t, s, 30, 0.94) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <FlagIcon size={30} color={C.ink} />
          <span style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink }}>Rezension von {REVIEWER}</span>
          <span style={{ marginLeft: "auto" }}><Stars value={1} size={30} /></span>
        </div>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, height: 88, borderRadius: 16, padding: "0 22px", background: r.state === "run" ? C.orangeSoft : r.state === "focus" ? "#EEF3FE" : "#F7F6F2", border: `2.5px solid ${r.state === "run" ? C.orange : r.state === "focus" ? "#4285F4" : "transparent"}`, ...popStyle(t, r.a, 10, 0.95) }}>
              <span style={{ width: 50, height: 50, borderRadius: "50%", background: r.state === "done" ? C.green : "#FFF", border: r.state === "done" ? "none" : `3px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                {r.state === "done" ? <Check size={30} /> : r.state === "run" ? <Spinner t={t} size={36} /> : r.state === "focus" ? <span style={{ fontFamily: fonts.bold, fontSize: 26, color: "#4285F4" }}>G</span> : null}
              </span>
              <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: r.state === "wait" ? "#A9A49A" : C.ink }}>{r.l}</span>
              {r.state === "run" ? <span style={{ marginLeft: "auto", ...popStyle(t, runAt, 6, 0.6) }}><Tag text="LÄUFT" color={C.orange} size={18} /></span> : null}
              {r.state === "focus" ? <span style={{ marginLeft: "auto", ...popStyle(t, decAt, 6, 0.6) }}><Tag text="NICHT DU" color="#4285F4" size={18} /></span> : null}
            </div>
          ))}
        </div>
        {/* progress */}
        <div style={{ position: "absolute", left: 34, right: 34, bottom: 34, opacity: k(t, runAt, 0.2) }}>
          <div style={{ height: 16, borderRadius: 8, background: "#EFEDE7", overflow: "hidden", position: "relative" }}>
            <div style={{ height: "100%", width: `${prog * 100}%`, background: C.orange, borderRadius: 8 }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, width: 80, left: `${((t * 0.9) % 1) * 110 - 10}%`, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.6), rgba(255,255,255,0))" }} />
          </div>
        </div>
      </Card>
      {/* Google is looking */}
      {t > lookAt ? (
        <div style={{ position: "absolute", left: 760, top: 610, zIndex: 8, ...popStyle(t, lookAt, 20, 0.5) }}>
          <div style={{ width: 150, height: 150, borderRadius: "50%", background: "#FFF", boxShadow: "0 18px 40px rgba(20,20,20,0.2)", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${Math.sin((t - lookAt) * 6) * 8}deg)` }}>
            <svg width={84} height={84} viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth={2.4} strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
          </div>
        </div>
      ) : null}
      <Stamp t={t} at={A.hinschauen + 0.15} text="IN PRÜFUNG" color={C.orange} size={44} rot={-7} style={{ left: 360, top: 800 }} />
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: A.wer, origin: "50% 50%", El: SceneHook },
  { from: A.wer, to: A.ich, origin: "50% 50%", El: SceneGoogeln },
  { from: A.ich, to: A.hinnehmen, origin: "50% 40%", El: SceneSchritte },
  { from: A.hinnehmen, to: A.die, origin: "50% 50%", El: SceneMelden },
  { from: A.die, to: SUCHE_END, origin: "50% 55%", El: SceneSuche },
  { from: SUCHE_END, to: A.ob, origin: "50% 50%", El: SceneMeldung },
  { from: A.ob, to: 999, origin: "50% 50%", El: SceneEntscheidung },
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

// ---------- CTA guide scroll: mock guide "Vorlage: Meldung an Google" (7 pages), fast, tilted, motion blur ----------
const PAGES = Array.from({ length: 7 }, (_, i) => staticFile(`fpn-google-bewertung/gb-${i + 1}.png`));
const GD = { left: 110, top: 205, w: 860, h: 720, bar: 70, pw: 700, ph: Math.round((700 * 1754) / 1240), gap: 24 };
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
            <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF", whiteSpace: "nowrap" }}>Vorlage: Meldung an Google.pdf</div>
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
      <div style={{ position: "absolute", left: 50, top: 820, zIndex: 5, transform: "rotate(-6deg)" }}><div style={popStyle(t, G_IN + 0.3, 12, 0.5)}><Tag text="7 SEITEN" color={C.green} size={34} /></div></div>
    </>
  );
};

// ---------- master ----------
// avatar framing: facefocus.txt focus 0.513/0.595, faceH ~508 px. Panel 960 px, video top 380 -> face top >= ~1256,
// head top (face - 0.45 h) >= ~1027 > seam pill bottom ~1003; chin <= ~1820.
const FOCUS = { x: 0.513, y: 0.595, scale: 1.0 };
const CTA = A.komm - 0.12;
const V_TOP_SPLIT = 400;
const CHEST_Y = 1610; // full frame: caption centre on chest height (chin max ~1416 in full frame)
export const GoogleBewertungOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // split amount: 1 = panel + avatar below, 0 = avatar full frame
  const guideAmt = k(t, G_IN, 0.4, Easing.inOut(Easing.cubic)) - k(t, G_OUT, 0.4, Easing.inOut(Easing.cubic));
  const sp = Math.max(0, Math.min(1, 1 - k(t, CTA, 0.42, Easing.inOut(Easing.cubic)) + guideAmt));
  const inGuide = t >= G_IN - 0.02;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = camera(t, scene.from, Math.min(scene.to, CTA));
  const dx = Math.sin(t * 0.6) * 6, dy = Math.cos(t * 0.45) * 5;
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTop = V_TOP_SPLIT * sp;
  const push = 1 + 0.025 * (1 - sp) * k(t, CTA + 0.4, 2.4, Easing.inOut(Easing.sin));
  // v2: subtle speaker push per sentence (in on even sentences, out on odd ones -> no jumps), scaled around the face centre
  const si = Math.max(0, SENT.filter((x) => x <= t).length - 1);
  const sA = SENT[si], sB = SENT[si + 1] ?? GB_END;
  const sp01 = interpolate(t, [sA, sB], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const avZoom = 1 + 0.035 * (si % 2 === 0 ? sp01 : 1 - sp01);
  const El = scene.El;
  const capY = PH * sp + CHEST_Y * (1 - sp);
  // CTA pill: above the head in full frame, at the top of the guide panel while it is in
  const pillY = 380 + (64 - 380) * guideAmt;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${push * avZoom})`, transformOrigin: `${FOCUS.x * 100}% ${FOCUS.y * 100}%` }}>
        <OffthreadVideo src={staticFile("fpn-google-bewertung/tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {sp > 0 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * (1 - sp), width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4 + (t < A.wer ? -t * 18 : 0)}px, ${dy * 0.4 + (t < A.wer ? -t * 30 : 0)}px) scale(${1 + (cam - 1) * 0.4})` }} />
          {inGuide ? (
            <GuidePanel t={t} />
          ) : (
            <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
              <El t={t} />
            </div>
          )}
        </div>
      ) : null}
      {/* CTA: trigger-word pill (outro pill "Kommentiere LÖSCHEN") */}
      {t > A.loeschen - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: pillY, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.loeschen - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, letterSpacing: "0.12em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 26px", display: "flex", alignItems: "center" }}>KOMMENTIERE:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, letterSpacing: "0.1em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "8px 28px 8px 32px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>LÖSCHEN</div>
          </div>
          <div style={{ opacity: 1 - guideAmt }}><div style={popStyle(t, A.schick - 0.05, 10, 0.6)}><LabelChip text="Vorlage für die Meldung · per DM" dot={C.green} size={28} /></div></div>
        </div>
      ) : null}
      {/* hide the caption while it travels between seam and chest height, so it never crosses the face */}
      <div style={{ position: "absolute", inset: 0, zIndex: 50, opacity: sp <= 0 || sp >= 1 ? 1 : sp > 0.88 ? (sp - 0.88) / 0.12 : sp < 0.12 ? 1 - sp / 0.12 : 0 }}>
        <SeamCaption t={t} y={capY} />
      </div>
    </AbsoluteFill>
  );
};
