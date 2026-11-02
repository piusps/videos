import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-iban/captions.json";

// FP-N "Falsche IBAN" (2026-10-17), built on WissenOpus / GoogleBewertungOpus (Opus-Stil, see video-post-production/references/fpn-opus-stil-2026-10-15.md).
// Split from frame 0, off-white grid panel on top (960 px), avatar below, Claude-orange caption pill on the seam.
// Hook: text hook "Rechnung echt. / IBAN falsch." on frame 0, invoice with a new IBAN, 48.000 € leave the account.
// Guide is mentioned BEFORE the CTA here ("Die Prüfvorlage und die Checkliste bekommst du im Guide. Kommentiere Iban …"):
// guide scroll on "Prüfvorlage … Guide", then avatar full frame with the KOMMENTIERE: IBAN pill.
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
  rechnung0: at("rechnung", 0), gleicher: at("gleicher"), logo: at("logo"), iban0: at("iban", 0), neu: at("neu"), acht0: at("achtundvierzigtausend", 0), weg: at("weg"),
  claude0: at("claude", 0), prueft: at("prüft"), zahlst: at("zahlst"), drei: at("drei", 0), schritten: at("schritten"),
  schritt0: at("schritt", 0), lieferantenliste: at("lieferantenliste"), bankverbindungen: at("bankverbindungen"), gleicht: at("gleicht"), iban1: at("iban", 1), sofort: at("sofort"), rot: at("rot"),
  schritt1: at("schritt", 1), liest: at("liest"), mail0: at("mail", 0), buchstabe: at("buchstabe"), absenderadresse: at("absenderadresse"), zeitdruck: at("zeitdruck"), betrugsmails: at("betrugsmails"),
  schritt2: at("schritt", 2), schreibt: at("schreibt"), rueckfrage: at("rückfrage"), rufst: at("rufst"), nummer: at("nummer"), kennst: at("kennst"), nie: at("nie"), mail1: at("mail", 1),
  eine1: at("eine", 1), minute: at("minute"), acht1: at("achtundvierzigtausend", 1), pruefvorlage: at("prüfvorlage"), checkliste: at("checkliste"), guide: at("guide"), komm: at("kommentiere"), ibanL: at("iban", 2), folg: at("folg"),
};
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const G_IN = A.pruefvorlage - 0.2; // guide panel slides in
export const G_OUT = A.komm - 0.1; // guide out, avatar full frame with the CTA pill
export const IB_END = LAST_END + 0.8;
export const IB_FRAMES = Math.round(IB_END * FPS);

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

// ---------- examples (invented, IBANs are test/sample numbers) ----------
const SUP = "Muster Stahl GmbH";
const OLD_IBAN = "DE89 3704 0044 0532 0130 00";
const NEW_IBAN = "LT12 1000 0111 0100 1000";
const OK_DOMAIN = "rechnung@musterstahl.de";
const BAD_DOMAIN = "rechnung@musterstah1.de";

const StepBar: React.FC<{ t: number; active: number; at0: number }> = ({ t, active, at0 }) => (
  <div style={{ position: "absolute", left: 50, right: 50, top: 36, display: "flex", gap: 14, ...popStyle(t, at0, 10, 0.94) }}>
    {["IBAN abgleichen", "Mail lesen", "Rückfrage"].map((l, i) => {
      const on = i === active, done = i < active;
      return (
        <div key={l} style={{ flex: 1, height: 74, borderRadius: 16, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", background: on ? C.ink : "#FFF", boxShadow: shadow, opacity: i > active ? 0.55 : 1 }}>
          <span style={{ width: 42, height: 42, borderRadius: 12, background: done ? C.green : on ? C.orange : "#EFEDE7", color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{done ? <Check size={28} /> : i + 1}</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 27, color: on ? "#FFF" : C.ink, whiteSpace: "nowrap" }}>{l}</span>
        </div>
      );
    })}
  </div>
);
const Ampel: React.FC<{ state: "off" | "green" | "yellow" | "red"; size?: number }> = ({ state, size = 46 }) => (
  <div style={{ display: "inline-flex", flexDirection: "column", gap: size * 0.2, background: C.ink, borderRadius: size * 0.5, padding: size * 0.22 }}>
    {(["red", "yellow", "green"] as const).map((c) => {
      const col = { red: C.red, yellow: C.star, green: C.green }[c];
      const on = state === c;
      return <span key={c} style={{ width: size, height: size, borderRadius: "50%", background: on ? col : "#3A3833", boxShadow: on ? `0 0 ${size * 0.5}px ${col}` : "none" }} />;
    })}
  </div>
);
const InvoiceCard: React.FC<{ t: number; ibanHot: number; style?: React.CSSProperties }> = ({ t, ibanHot, style }) => (
  <Card style={{ padding: "24px 28px", boxSizing: "border-box", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span style={{ width: 56, height: 56, borderRadius: 12, background: "#2F3E52", color: "#FFF", fontFamily: fonts.bold, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>MS</span>
      <div>
        <div style={{ fontFamily: fonts.bold, fontSize: 30, color: C.ink }}>{SUP}</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 19, color: C.dim }}>Rechnung Nr. 2026-1184</div>
      </div>
      <span style={{ marginLeft: "auto" }}><Tag text="RECHNUNG" color={C.ink} size={15} /></span>
    </div>
    {[86, 70, 78].map((w, i) => <div key={i} style={{ height: 11, width: `${w}%`, borderRadius: 6, background: "#EFEDE7", marginTop: 14 }} />)}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 18 }}>
      <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: C.dim }}>Betrag</span>
      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: C.ink }}>48.000,00 €</span>
    </div>
    <div style={{ marginTop: 14, borderRadius: 12, padding: "12px 16px", background: ibanHot > 0 ? `rgba(229,72,77,${0.12 * ibanHot})` : "#F7F6F2", border: `2.5px solid ${ibanHot > 0.5 ? C.red : C.line}`, transform: `scale(${1 + 0.04 * press(t, A.iban0)})`, transformOrigin: "0 50%" }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: "0.14em", color: ibanHot > 0.5 ? C.red : C.dim }}>BANKVERBINDUNG {ibanHot > 0.5 ? "· NEU" : ""}</div>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: C.ink, marginTop: 4, whiteSpace: "nowrap" }}>{NEW_IBAN}</div>
    </div>
  </Card>
);

// ---------- Scene 0: hook (0 - "Claude") ----------
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const ibanHot = k(t, A.iban0 - 0.05, 0.25);
  const bal = interpolate(t, [A.acht0 - 0.1, A.acht0 + 0.8], [61240, 13240], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const fly = k(t, A.acht0, 0.7, Easing.in(Easing.cubic));
  const shake = shakeAt(t, A.weg, 7) + shakeAt(t, A.iban0, 4);
  const drift = 1 + 0.025 * k(t, 0, 4, Easing.inOut(Easing.sin));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translateX(${shake}px) scale(${drift})`, transformOrigin: "50% 45%" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 34, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 76, color: C.ink, letterSpacing: -2, lineHeight: 1.05, whiteSpace: "nowrap" }}>Rechnung echt.</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 76, color: "#FFF", background: C.ink, borderRadius: 16, padding: "4px 24px 12px", letterSpacing: -2, lineHeight: 1.05, whiteSpace: "nowrap" }}><span style={{ background: C.red, borderRadius: 12, padding: "0 12px" }}>IBAN</span> falsch.</div>
      </div>
      <InvoiceCard t={t} ibanHot={ibanHot} style={{ left: 50, top: 270, width: 600, height: 470 }} />
      <div style={{ position: "absolute", left: 60, top: 760, display: "flex", gap: 12 }}>
        <div style={popStyle(t, A.gleicher - 0.05, 10, 0.6)}><LabelChip text="gleicher Betrag ✓" dot={C.green} size={24} /></div>
        <div style={popStyle(t, A.logo - 0.05, 10, 0.6)}><LabelChip text="gleiches Logo ✓" dot={C.green} size={24} /></div>
      </div>
      <div style={{ position: "absolute", left: 60, top: 840, ...popStyle(t, A.neu, 10, 0.6) }}><LabelChip text="neue IBAN" dot={C.red} size={24} /></div>
      {/* bank account */}
      <Card style={{ left: 680, top: 270, width: 350, height: 300, padding: "22px 24px", boxSizing: "border-box", ...popStyle(t, A.iban0 + 0.2, 18, 0.85) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: C.dim }}>GESCHÄFTSKONTO</div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 50, color: t > A.acht0 ? C.red : C.ink, marginTop: 14, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.04em" }}>{Math.round(bal).toLocaleString("de-DE")} €</div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, opacity: k(t, A.acht0, 0.2) }}>
          <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v15M5 12l7 7 7-7" /></svg>
          <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: C.red }}>Überweisung ausgeführt</span>
        </div>
      </Card>
      {/* money flies away */}
      {t > A.acht0 - 0.05 && fly < 1 ? (
        <div style={{ position: "absolute", left: 760 + 260 * fly, top: 600 - 260 * fly, opacity: 1 - fly, transform: `rotate(${20 * fly}deg) scale(${1 - 0.4 * fly})`, zIndex: 8 }}>
          <Tag text="− 48.000 €" color={C.red} size={34} />
        </div>
      ) : null}
      <Stamp t={t} at={A.weg} text="WEG" color={C.red} size={80} rot={-10} style={{ left: 855, top: 720 }} />
    </div>
  );
};

// ---------- Scene 1: Claude checks every invoice before you pay, in 3 steps (Claude - Schritt eins) ----------
const ScenePromise: React.FC<{ t: number }> = ({ t }) => {
  const s = A.claude0 - 0.05;
  const scan = ((t - s) * 0.9) % 1;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, display: "flex", justifyContent: "center", gap: 18, alignItems: "center", ...popStyle(t, s, 12, 0.8) }}>
        <ClaudeMark size={70} />
        <span style={{ fontFamily: fonts.bold, fontSize: 70, color: C.ink, letterSpacing: -2 }}>prüft jede Rechnung</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", ...popStyle(t, A.zahlst - 0.1, 10, 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 56, color: "#FFF", background: C.orange, borderRadius: 16, padding: "2px 22px 8px" }}>bevor du zahlst</span>
      </div>
      {/* stack of invoices passing a scanner */}
      <div style={{ position: "absolute", left: 120, top: 290, width: 560, height: 420, ...popStyle(t, s + 0.15, 30, 0.9) }}>
        {[2, 1, 0].map((i) => (
          <Card key={i} style={{ left: i * 22, top: i * 18, width: 480, height: 360, padding: 24, boxSizing: "border-box" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 26, color: C.ink }}>Rechnung {1184 - i}</div>
            {[88, 70, 80, 60, 74].map((w, j) => <div key={j} style={{ height: 11, width: `${w}%`, borderRadius: 6, background: "#EFEDE7", marginTop: 16 }} />)}
            {i === 0 ? <div style={{ position: "absolute", left: 0, right: 0, top: 20 + scan * 320, height: 4, background: C.orange, boxShadow: `0 0 18px ${C.orange}` }} /> : null}
          </Card>
        ))}
      </div>
      <div style={{ position: "absolute", left: 760, top: 300, ...popStyle(t, A.prueft, 16, 0.6) }}><Ampel state={t < A.zahlst ? "green" : t < A.drei ? "yellow" : "red"} size={64} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", ...popStyle(t, A.drei - 0.05, 10, 0.6) }}><LabelChip text="In 3 Schritten" dot={C.green} size={32} /></div>
    </>
  );
};

// ---------- Scene 2: step 1, supplier list with the real bank data, compare, new IBAN = red (Schritt eins - Schritt zwei) ----------
const ROWS = [
  { n: SUP, iban: OLD_IBAN },
  { n: "Beispiel Logistik AG", iban: "DE12 5001 0517 0648 4898 90" },
  { n: "Probe Verpackung KG", iban: "DE44 1001 0010 0123 4567 89" },
];
const SceneAbgleich: React.FC<{ t: number }> = ({ t }) => {
  const s = A.schritt0 - 0.05;
  const listAt = A.lieferantenliste - 0.05;
  const cmpAt = A.gleicht - 0.05;
  const redAt = A.iban1 - 0.05;
  const shake = shakeAt(t, A.rot, 6);
  return (
    <>
      <StepBar t={t} active={0} at0={s} />
      <Card style={{ left: 50, top: 140, width: 980, height: 330, overflow: "hidden", ...popStyle(t, listAt, 30, 0.92) }}>
        <div style={{ height: 58, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", background: C.greenSoft, borderBottom: `2px solid ${C.line}` }}>
          <span style={{ width: 34, height: 40, borderRadius: 6, background: C.green, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 11, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 5, boxSizing: "border-box" }}>CSV</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 24, color: C.ink }}>lieferanten.csv</span>
          <span style={{ marginLeft: "auto", ...popStyle(t, A.bankverbindungen, 6, 0.6) }}><Tag text="ECHTE BANKDATEN" color={C.green} size={16} /></span>
        </div>
        {ROWS.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", height: 84, padding: "0 22px", borderBottom: `1.5px solid ${C.line}`, background: i === 0 && t > cmpAt ? C.orangeSoft : "#FFF", ...popStyle(t, listAt + 0.15 + i * 0.1, 8, 0.97) }}>
            <span style={{ width: 380, fontFamily: fonts.semibold, fontSize: 27, color: C.ink }}>{r.n}</span>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 25, color: "#2E2B27" }}>{r.iban}</span>
          </div>
        ))}
      </Card>
      {/* comparison */}
      <Card style={{ left: 50, top: 500, width: 980, height: 400, padding: "24px 28px", boxSizing: "border-box", transform: `translateX(${shake}px)`, border: `3px solid ${t > redAt ? C.red : C.line}`, ...popStyle(t, cmpAt, 30, 0.94) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <ClaudeMark size={34} />
          <span style={{ fontFamily: fonts.bold, fontSize: 30, color: C.ink }}>Abgleich · Rechnung {SUP}</span>
          <span style={{ marginLeft: "auto" }}><Ampel state={t > redAt ? "red" : "off"} size={26} /></span>
        </div>
        {[{ l: "IN DEINER LISTE", v: OLD_IBAN, c: C.green }, { l: "AUF DER RECHNUNG", v: NEW_IBAN, c: t > redAt ? C.red : C.ink }].map((x, i) => (
          <div key={i} style={{ marginTop: 20, borderRadius: 14, padding: "14px 18px", background: i && t > redAt ? C.redSoft : "#F7F6F2", ...popStyle(t, cmpAt + 0.15 + i * 0.2, 8, 0.96) }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: C.dim }}>{x.l}</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: x.c, marginTop: 4, whiteSpace: "nowrap" }}>{x.v}</div>
          </div>
        ))}
      </Card>
      <Stamp t={t} at={A.sofort} text="STOPP · IBAN NEU" color={C.red} size={44} rot={-6} style={{ left: 740, top: 820 }} />
    </>
  );
};

// ---------- Scene 3: step 2, Claude reads the mail: one letter off, sudden time pressure (Schritt zwei - Schritt drei) ----------
const SceneMail: React.FC<{ t: number }> = ({ t }) => {
  const s = A.schritt1 - 0.05;
  const letterAt = A.buchstabe - 0.05;
  const pressAt = A.zeitdruck - 0.1;
  const zoom = k(t, letterAt, 0.35, Easing.inOut(Easing.cubic)) * (1 - k(t, pressAt - 0.15, 0.3));
  return (
    <>
      <StepBar t={t} active={1} at0={s - 1} />
      <Card style={{ left: 50, top: 140, width: 980, height: 560, padding: "24px 30px", boxSizing: "border-box", ...popStyle(t, A.liest - 0.1, 30, 0.94) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.semibold, fontSize: 22, color: C.dim }}>
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth={2.2}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>Posteingang
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 14, alignItems: "baseline" }}>
          <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.dim, width: 90 }}>Von:</span>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: C.ink, transform: `scale(${1 + 0.25 * zoom})`, transformOrigin: "0 50%", display: "inline-block" }}>
            rechnung@musterstah<span style={{ background: t > letterAt ? C.red : "transparent", color: t > letterAt ? "#FFF" : C.ink, borderRadius: 6, padding: "0 4px" }}>1</span>.de
          </span>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 14, alignItems: "baseline", opacity: k(t, letterAt + 0.2, 0.2) }}>
          <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.dim, width: 90 }}>Echt:</span>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: C.green }}>{OK_DOMAIN}</span>
          <Check size={34} color={C.green} p={k(t, letterAt + 0.3, 0.25)} />
        </div>
        <div style={{ marginTop: 22, borderTop: `2px solid ${C.line}`, paddingTop: 18 }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink }}>
            <span style={{ background: t > pressAt ? C.redSoft : "transparent", boxShadow: t > pressAt ? `inset 0 -4px 0 ${C.red}` : "none", padding: "2px 6px", borderRadius: 6 }}>DRINGEND: bitte heute noch überweisen</span>
          </div>
          <div style={{ fontFamily: fonts.medium, fontSize: 27, color: "#2E2B27", marginTop: 14, lineHeight: 1.45 }}>
            unser Konto wurde wegen einer Prüfung umgestellt. Bitte nutzen Sie ab sofort die neue Bankverbindung im Anhang.
          </div>
        </div>
      </Card>
      <div style={{ position: "absolute", left: 50, top: 730, display: "flex", gap: 14 }}>
        <div style={popStyle(t, letterAt + 0.1, 10, 0.6)}><LabelChip text="1 Buchstabe anders" dot={C.red} size={28} /></div>
        <div style={popStyle(t, pressAt + 0.1, 10, 0.6)}><LabelChip text="Zeitdruck" dot={C.red} size={28} /></div>
      </div>
      <Stamp t={t} at={A.betrugsmails} text="BETRUGSMAIL" color={C.red} size={48} rot={-7} style={{ left: 780, top: 800 }} />
    </>
  );
};

// ---------- Scene 4: step 3, Claude writes the follow-up, you call the number you already know, never the one from the mail ----------
const RUECK = "Guten Tag Frau Beispiel, auf Ihrer Rechnung 2026-1184 steht eine neue Bankverbindung. Bevor wir zahlen, rufe ich Sie kurz an.";
const SceneRueckruf: React.FC<{ t: number }> = ({ t }) => {
  const s = A.schritt2 - 0.05;
  const callAt = A.rufst - 0.1;
  const nieAt = A.nie - 0.05;
  const ring = t > callAt && t < nieAt ? Math.sin(t * 50) * 6 : 0;
  return (
    <>
      <StepBar t={t} active={2} at0={s - 1} />
      <Card style={{ left: 50, top: 140, width: 980, height: 300, padding: "22px 28px", boxSizing: "border-box", borderLeft: `8px solid ${C.orange}`, ...popStyle(t, A.schreibt - 0.1, 30, 0.94) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><ClaudeMark size={28} /><span style={{ fontFamily: fonts.bold, fontSize: 28, color: C.ink }}>Rückfrage an {SUP}</span></div>
        <div style={{ fontFamily: fonts.regular, fontSize: 29, lineHeight: 1.45, color: "#2E2B27", marginTop: 14 }}>{typed(RUECK, t, A.schreibt + 0.1, A.rufst - 0.15)}</div>
      </Card>
      <Card style={{ left: 50, top: 470, width: 470, height: 280, padding: "22px 24px", boxSizing: "border-box", border: `3px solid ${C.green}`, transform: `rotate(${ring * 0.3}deg)`, ...popStyle(t, callAt, 24, 0.85) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: C.green }}>AUS DEINER LISTE</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
          <span style={{ width: 80, height: 80, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${ring}deg)` }}><PhoneIcon size={42} color="#FFF" /></span>
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 30, color: C.ink }}>Frau Beispiel</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: C.ink }}>0211 123456</div>
          </div>
        </div>
        <div style={{ marginTop: 18, ...popStyle(t, A.kennst - 0.05, 8, 0.6) }}><Tag text="BEKANNTE NUMMER ✓" color={C.green} size={18} /></div>
      </Card>
      <Card style={{ left: 560, top: 470, width: 470, height: 280, padding: "22px 24px", boxSizing: "border-box", border: `3px solid ${C.red}`, ...popStyle(t, nieAt, 24, 0.85) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: C.red }}>AUS DER MAIL</div>
        <div style={{ position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 32, color: "#B9B4A9", marginTop: 22 }}>
          0151 9876 5432
          <div style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 7, borderRadius: 4, background: C.red, transformOrigin: "0 50%", transform: `scaleX(${k(t, nieAt + 0.15, 0.3)})` }} />
        </div>
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 52, height: 52, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}><Cross size={32} p={k(t, nieAt + 0.2, 0.25)} /></span>
          <span style={{ fontFamily: fonts.bold, fontSize: 34, color: C.red }}>Nie anrufen</span>
        </div>
      </Card>
      <Mascot t={t} targets={[{ at: callAt + 0.15, p: () => [130, 580] }]} hold={0.4} />
    </>
  );
};

// ---------- Scene 5: payoff, one minute vs 48.000 € ----------
const ScenePayoff: React.FC<{ t: number }> = ({ t }) => {
  const s = A.eine1 - 0.1;
  const tilt = interpolate(t, [A.acht1 - 0.1, A.acht1 + 0.5], [0, 9], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: fonts.bold, fontSize: 66, color: C.ink, letterSpacing: -2, ...popStyle(t, s, 12, 0.85) }}>Was kostet die Prüfung?</div>
      <div style={{ position: "absolute", left: 140, top: 330, width: 800, height: 12, borderRadius: 6, background: C.ink, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 50%" }} />
      <div style={{ position: "absolute", left: 530, top: 340, width: 20, height: 330, background: C.ink, borderRadius: 10 }} />
      <div style={{ position: "absolute", left: 120, top: 380 - Math.sin((tilt * Math.PI) / 180) * 380, ...popStyle(t, A.minute - 0.1, 20, 0.6) }}>
        <Card style={{ position: "relative", width: 330, height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `3px solid ${C.green}` }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: C.green }}>1 Min</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.dim }}>Prüfung mit Claude</div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 630, top: 380 + Math.sin((tilt * Math.PI) / 180) * 380, ...popStyle(t, A.acht1 - 0.15, 20, 0.6) }}>
        <Card style={{ position: "relative", width: 330, height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `3px solid ${C.red}` }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 56, color: C.red }}>48.000 €</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.dim }}>eine falsche Zahlung</div>
        </Card>
      </div>
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: A.claude0 - 0.05, origin: "50% 50%", El: SceneHook },
  { from: A.claude0 - 0.05, to: A.schritt0 - 0.05, origin: "50% 45%", El: ScenePromise },
  { from: A.schritt0 - 0.05, to: A.schritt1 - 0.05, origin: "50% 45%", El: SceneAbgleich },
  { from: A.schritt1 - 0.05, to: A.schritt2 - 0.05, origin: "50% 45%", El: SceneMail },
  { from: A.schritt2 - 0.05, to: A.eine1 - 0.1, origin: "50% 45%", El: SceneRueckruf },
  { from: A.eine1 - 0.1, to: 999, origin: "50% 50%", El: ScenePayoff },
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
const PAGES = Array.from({ length: 4 }, (_, i) => staticFile(`fpn-iban/gb-${i + 1}.png`));
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
            <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF", whiteSpace: "nowrap" }}>Falsche IBAN · Prüfvorlage.pdf</div>
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
      <div style={{ position: "absolute", left: 50, top: 800, zIndex: 5, transform: "rotate(-6deg)" }}><div style={popStyle(t, G_IN + 0.3, 12, 0.5)}><Tag text="PRÜF-PROMPT" color={C.orange} size={34} /></div></div>
      <div style={{ position: "absolute", right: 50, top: 860, zIndex: 5, transform: "rotate(5deg)" }}><div style={popStyle(t, A.guide, 12, 0.5)}><Tag text="10-PUNKTE-CHECKLISTE" color={C.green} size={26} /></div></div>
    </>
  );
};

// ---------- master ----------
const FOCUS = { x: 0.513, y: 0.595, scale: 1.0 }; // overwritten after facefocus if needed
const V_TOP_SPLIT = 400;
const CHEST_Y = 1610;
export const IbanOpus: React.FC = () => {
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
  const sA = SENT[si], sB = SENT[si + 1] ?? IB_END;
  const sp01 = interpolate(t, [sA, sB], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const avZoom = 1 + 0.035 * (si % 2 === 0 ? sp01 : 1 - sp01);
  const El = scene.El;
  const capY = PH * sp + CHEST_Y * (1 - sp);
  // guide: quick whip-out of the scene content before the guide flies in
  const guideCut = k(t, G_IN - 0.1, 0.15);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${push * avZoom})`, transformOrigin: `${FOCUS.x * 100}% ${FOCUS.y * 100}%` }}>
        <OffthreadVideo src={staticFile("fpn-iban/tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {sp > 0 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * (1 - sp), width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4 + (t < A.claude0 ? -t * 18 : 0)}px, ${dy * 0.4 + (t < A.claude0 ? -t * 30 : 0)}px) scale(${1 + (cam - 1) * 0.4})` }} />
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
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, letterSpacing: "0.1em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "8px 28px 8px 32px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>IBAN</div>
          </div>
          <div style={popStyle(t, A.ibanL + 0.15, 10, 0.6)}><LabelChip text="Prüfvorlage + Checkliste · per DM" dot={C.green} size={28} /></div>
        </div>
      ) : null}
      <div style={{ position: "absolute", inset: 0, zIndex: 50, opacity: sp <= 0 || sp >= 1 ? 1 : sp > 0.88 ? (sp - 0.88) / 0.12 : sp < 0.12 ? 1 - sp / 0.12 : 0 }}>
        <SeamCaption t={t} y={capY} />
      </div>
    </AbsoluteFill>
  );
};
