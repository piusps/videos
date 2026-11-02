import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-wissen/captions.json";

// FP-N "Wissens-Klon" (2026-10-16), built on GoogleBewertungOpus (Opus-Stil, see video-post-production/references/fpn-opus-stil-2026-10-15.md).
// Split from frame 0, off-white grid panel on top (960 px), avatar below, Claude-orange caption pill on the seam.
// Hook: text hook "Sie geht. / Ihr Wissen bleibt." visible on frame 0; knowledge chips fly out of the door, then back into a Skill.
// Guide is mentioned BEFORE the CTA here ("Die dreißig Interviewfragen stehen im Guide. Kommentiere Wissen …"):
// guide scroll on "dreißig … Guide", then avatar full frame with the KOMMENTIERE: WISSEN pill.
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
  kuendigt: at("kündigt"), zwanzig: at("zwanzig"), wissen0: at("wissen", 0), tuer: at("tür"), raus: at("raus"),
  ausser: at("außer"), claude0: at("claude", 0), interviewt0: at("interviewt", 0),
  dann: at("dann"), beantwortet: at("beantwortet"), frage: at("frage"), team0: at("team", 0), laengst: at("längst"), weg: at("weg"),
  so: at("so"), schritt0: at("schritt", 0), interviewt1: at("interviewt", 1), stunde0: at("stunde", 0),
  nicht: at("nicht"), warum: at("warum"), welcher: at("welcher"), sonderpreise: at("sonderpreise"), kriegt: at("kriegt"),
  macht: at("macht"), lieferung: at("lieferung"), haengt: at("hängt"),
  schritt1: at("schritt", 1), gespraech: at("gespräch"), baut: at("baut"), skill: at("skill"), anleitung: at("anleitung"), dauerhaft: at("dauerhaft"), merkt: at("merkt"),
  und: at("und", 0), trick: at("trick"), schritt2: at("schritt", 2), fragt: at("fragt"), einfach: at("einfach"), bekommt: at("bekommt"), antwort: at("antwort"), gegeben: at("gegeben"),
  nachfolgerin: at("nachfolgerin"), das: at("das"), monate: at("monate"), hier: at("hier"), stunde1: at("stunde", 1),
  dreissig: at("dreißig"), guide: at("guide"), komm: at("kommentiere"), wissenL: at("wissen", 9), folg: at("folg"),
};
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const G_IN = A.dreissig + 0.2; // guide panel slides in
export const G_OUT = A.komm - 0.1; // guide out, avatar full frame with the CTA pill
export const WI_END = LAST_END + 0.8;
export const WI_FRAMES = Math.round(WI_END * FPS);

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

// ---------- examples (invented) ----------
const PERSON = "Sabine K.";
const CHIPS = [
  { x: "Müller Bau: 8 % Sonderrabatt", x0: 560, y0: 300 },
  { x: "Lieferung hängt? Herrn Kaya anrufen", x0: 520, y0: 390 },
  { x: "Lieferant B nur auf dem Papier gut", x0: 600, y0: 480 },
  { x: "Reklamation: erst zurückrufen", x0: 540, y0: 570 },
  { x: "Jahresbonus Kunde Rehm", x0: 620, y0: 660 },
  { x: "Wer bei Sonnhof wirklich entscheidet", x0: 500, y0: 750 },
];
const DOOR = { x: 960, y: 520 };
const SKILLBOX = { x: 800, y: 560 };

const StepBar: React.FC<{ t: number; active: number; at0: number }> = ({ t, active, at0 }) => (
  <div style={{ position: "absolute", left: 50, right: 50, top: 36, display: "flex", gap: 14, ...popStyle(t, at0, 10, 0.94) }}>
    {["Interview", "Skill", "Team fragt"].map((l, i) => {
      const on = i === active, done = i < active;
      return (
        <div key={l} style={{ flex: 1, height: 74, borderRadius: 16, display: "flex", alignItems: "center", gap: 14, padding: "0 20px", background: on ? C.ink : "#FFF", boxShadow: shadow, opacity: i > active ? 0.55 : 1 }}>
          <span style={{ width: 42, height: 42, borderRadius: 12, background: done ? C.green : on ? C.orange : "#EFEDE7", color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{done ? <Check size={28} /> : i + 1}</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 30, color: on ? "#FFF" : C.ink, whiteSpace: "nowrap" }}>{l}</span>
        </div>
      );
    })}
  </div>
);

// ---------- Scene 0: hook (0 - "Dann") ----------
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const out = k(t, A.tuer - 0.15, 0.7, Easing.in(Easing.cubic));
  const back = k(t, A.claude0 - 0.05, 0.7, Easing.out(Easing.cubic));
  const meter = Math.round(100 - 88 * out + 88 * back);
  const years = Math.round(interpolate(t, [A.zwanzig - 0.2, A.zwanzig + 0.5], [0, 20], { ...clamp, easing: Easing.out(Easing.quad) }));
  const doorOpen = k(t, A.tuer - 0.25, 0.3) * (1 - k(t, A.ausser, 0.25));
  const shake = shakeAt(t, A.kuendigt, 6) + shakeAt(t, A.raus, 5);
  const drift = 1 + 0.025 * k(t, 0, 4, Easing.inOut(Easing.sin));
  const boxOn = k(t, A.claude0 - 0.1, 0.3);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translateX(${shake}px) scale(${drift})`, transformOrigin: "50% 45%" }}>
      {/* text hook, fully visible on frame 0 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 34, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 76, color: C.ink, letterSpacing: -2, lineHeight: 1.05, whiteSpace: "nowrap" }}>Sie geht.</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 76, color: "#FFF", background: C.ink, borderRadius: 16, padding: "4px 24px 12px", letterSpacing: -2, lineHeight: 1.05, whiteSpace: "nowrap" }}>Ihr <span style={{ background: C.orange, borderRadius: 12, padding: "0 12px" }}>Wissen</span> bleibt.</div>
      </div>
      {/* employee card + resignation */}
      <Card style={{ left: 50, top: 270, width: 400, height: 300, padding: "24px 26px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar letter="S" size={66} color={C.orange} />
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 32, color: C.ink }}>{PERSON}</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 21, color: C.dim }}>Einkauf · seit 2006</div>
          </div>
        </div>
        <div style={{ marginTop: 20, fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: C.dim }}>ERFAHRUNG</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, opacity: k(t, A.zwanzig - 0.25, 0.12) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 92, color: C.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.04em" }}>{years}</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 34, color: C.ink }}>Jahre</div>
        </div>
      </Card>
      <Card style={{ left: 50, top: 600, width: 400, height: 300, padding: "22px 26px", boxSizing: "border-box", border: `3px solid ${C.red}`, transform: `translateY(${(1 - k(t, A.kuendigt - 0.25, 0.35, Easing.out(Easing.back(1.3)))) * 360}px) rotate(-2deg)` }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: C.red }}>SCHREIBEN</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 42, color: C.ink, marginTop: 8 }}>Kündigung</div>
        {[90, 78, 84, 60].map((w, i) => <div key={i} style={{ height: 12, width: `${w}%`, borderRadius: 6, background: "#EFEDE7", marginTop: 14 }} />)}
        <div style={{ fontFamily: fonts.medium, fontSize: 22, color: C.dim, marginTop: 16 }}>zum 31.12. · {PERSON}</div>
      </Card>
      <Stamp t={t} at={A.kuendigt} text="GEKÜNDIGT" color={C.red} size={40} rot={-8} style={{ left: 250, top: 760 }} />
      {/* door on the right */}
      <div style={{ position: "absolute", left: DOOR.x - 70, top: DOOR.y - 190, width: 140, height: 380, borderRadius: 10, background: "#2B2925", boxShadow: "inset 0 0 0 6px #1A1916", opacity: k(t, A.tuer - 0.4, 0.2) * (1 - back * 0.85) }}>
        <div style={{ position: "absolute", inset: 6, background: "#E9E2D2", transformOrigin: "0% 50%", transform: `perspective(600px) rotateY(${-70 * doorOpen}deg)`, borderRadius: 4 }}>
          <div style={{ position: "absolute", right: 14, top: "50%", width: 12, height: 12, borderRadius: "50%", background: "#8A877F" }} />
        </div>
      </div>
      {/* skill box (after "Außer, Claude …") */}
      {boxOn > 0 ? (
        <div style={{ position: "absolute", left: SKILLBOX.x - 130, top: SKILLBOX.y - 120, width: 260, height: 240, borderRadius: 26, background: C.ink, boxShadow: `0 24px 60px rgba(217,119,87,${0.25 + 0.25 * back})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: `scale(${pop(t, A.claude0 - 0.1)})`, zIndex: 3 }}>
          <div style={{ transform: `rotate(${(t - A.claude0) * 120}deg)` }}><ClaudeMark size={80} /></div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, letterSpacing: "0.14em", color: "#FFF" }}>SKILL</div>
          {t > A.interviewt0 ? <div style={{ position: "absolute", bottom: -26, ...popStyle(t, A.interviewt0, 8, 0.5) }}><Tag text="INTERVIEWT ✓" color={C.green} size={18} /></div> : null}
        </div>
      ) : null}
      {/* knowledge chips: around the person -> out the door -> back into the skill */}
      {CHIPS.map((c, i) => {
        const o = k(t, A.tuer - 0.2 + i * 0.07, 0.55, Easing.in(Easing.cubic));
        const b = k(t, A.claude0 + i * 0.06, 0.55, Easing.out(Easing.cubic));
        const x = c.x0 + (DOOR.x - c.x0) * o + (SKILLBOX.x - DOOR.x) * b;
        const y = c.y0 + (DOOR.y - c.y0) * o + (SKILLBOX.y - DOOR.y) * b;
        const sc = 1 - 0.55 * o + 0.35 * b - 0.55 * b;
        const op = 1 * (1 - 0.9 * o * (1 - b)) * (1 - b);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${sc}) rotate(${(i % 2 ? 3 : -3) * (1 - o)}deg)`, opacity: op, zIndex: 4 }}>
            <span style={{ display: "inline-block", fontFamily: fonts.semibold, fontSize: 26, color: C.ink, background: "#FFF", border: `2px solid ${C.line}`, borderLeft: `6px solid ${C.orange}`, borderRadius: 12, padding: "10px 16px", whiteSpace: "nowrap", boxShadow: "0 8px 18px rgba(20,20,20,0.08)" }}>{c.x}</span>
          </div>
        );
      })}
      {/* meter */}
      <div style={{ position: "absolute", left: 480, top: 840, width: 550, opacity: k(t, A.wissen0 - 0.1, 0.2) }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: C.dim }}><span>WISSEN IM BETRIEB</span><span style={{ color: meter < 50 ? C.red : C.green, fontWeight: 800 }}>{meter} %</span></div>
        <div style={{ height: 16, borderRadius: 8, background: "#EFEDE7", marginTop: 8, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${meter}%`, background: meter < 50 ? C.red : C.green, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
};

// ---------- Scene 1: the team asks, her knowledge answers, even though she is gone (Dann - So) ----------
const ANSWER = "8 %. Müller Bau bekommt seit 2011 Sonderrabatt, weil sie immer pünktlich zahlen.";
const SceneTeam: React.FC<{ t: number }> = ({ t }) => {
  const s = A.dann - 0.05;
  const ansA = A.team0 - 0.1;
  const goneAt = A.laengst - 0.05;
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 40, display: "flex", gap: 14, alignItems: "center" }}>
        <div style={popStyle(t, s, 10, 0.6)}><LabelChip text="Team-Chat · Einkauf" size={26} /></div>
        <div style={popStyle(t, A.beantwortet, 10, 0.6)}><LabelChip text="Claude antwortet mit ihrem Wissen" dot={C.green} size={26} /></div>
      </div>
      <Card style={{ left: 50, top: 140, width: 980, height: 560, padding: "26px 30px", boxSizing: "border-box", background: C.claudeBg, ...popStyle(t, s, 30, 0.95) }}>
        <div style={{ display: "flex", justifyContent: "flex-end", ...popStyle(t, A.dann + 0.1, 12, 0.9) }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
            <div style={{ background: "#ECE9E1", borderRadius: 18, padding: "14px 22px", fontFamily: fonts.medium, fontSize: 32, color: C.ink, maxWidth: 640 }}>Welchen Rabatt bekommt Müller Bau?</div>
            <Avatar letter="T" size={56} color="#2F6BFF" />
          </div>
        </div>
        <div style={{ fontFamily: fonts.medium, fontSize: 20, color: C.dim, textAlign: "right", marginTop: 8, marginRight: 70, opacity: k(t, A.dann + 0.2, 0.2) }}>Tom · seit 2 Wochen dabei</div>
        <div style={{ display: "flex", gap: 16, marginTop: 30, ...popStyle(t, ansA, 12, 0.92) }}>
          <div style={{ transform: `rotate(${t < ansA + 0.4 ? (t - ansA) * 300 : 0}deg)` }}><ClaudeMark size={50} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.medium, fontSize: 34, lineHeight: 1.4, color: C.ink }}>{typed(ANSWER, t, ansA + 0.15, A.laengst - 0.2)}</div>
            <div style={{ marginTop: 16, ...popStyle(t, A.laengst - 0.15, 8, 0.6) }}><Tag text={`AUS ${PERSON.toUpperCase()}S WISSEN`} color={C.orange} size={20} /></div>
          </div>
        </div>
      </Card>
      <Card style={{ left: 560, top: 730, width: 470, height: 170, padding: "20px 24px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 18, ...popStyle(t, goneAt, 20, 0.85) }}>
        <div style={{ filter: "grayscale(1)", opacity: 0.6 }}><Avatar letter="S" size={76} color={C.orange} /></div>
        <div>
          <div style={{ fontFamily: fonts.bold, fontSize: 32, color: "#8A877F" }}>{PERSON}</div>
          <div style={{ fontFamily: fonts.medium, fontSize: 22, color: C.dim }}>ausgeschieden · seit 3 Monaten</div>
        </div>
      </Card>
      <Stamp t={t} at={A.weg} text="WEG. WISSEN DA." color={C.green} size={36} rot={-6} style={{ left: 290, top: 815 }} />
    </>
  );
};

// ---------- Scene 2: step 1, Claude interviews her for an hour, asks WHY (So - Schritt zwei) ----------
const QA = [
  { q: "Welcher Kunde kriegt Sonderpreise, und warum?", a: "Müller Bau, 8 %. Zahlen seit 2011 immer pünktlich.", qa: () => A.welcher - 0.1, aa: () => A.kriegt + 0.1 },
  { q: "Was machst du, wenn eine Lieferung hängt?", a: "Erst Herrn Kaya direkt anrufen. Nie die Hotline.", qa: () => A.macht - 0.25, aa: () => A.haengt + 0.05 },
];
const SceneInterview: React.FC<{ t: number }> = ({ t }) => {
  const s = A.so - 0.05;
  const mins = Math.round(interpolate(t, [A.stunde0 - 0.2, A.stunde0 + 0.7], [0, 60], { ...clamp, easing: Easing.inOut(Easing.quad) }));
  const strike = k(t, A.nicht + 0.05, 0.3, Easing.inOut(Easing.cubic));
  const whyOn = A.warum - 0.05;
  const qaOn = A.welcher - 0.25;
  const lift = k(t, qaOn, 0.35, Easing.inOut(Easing.cubic));
  return (
    <>
      <StepBar t={t} active={0} at0={A.schritt0 - 0.05} />
      <Card style={{ left: 50, top: 140, width: 980, height: 780, background: C.claudeBg, overflow: "hidden", ...popStyle(t, s, 30, 0.95) }}>
        <div style={{ height: 64, background: "#F0EEE6", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 12, fontFamily: fonts.semibold, fontSize: 23, color: "#6E6B65" }}>
          <ClaudeMark size={24} />Claude<span style={{ color: "#B9B4A9" }}>/</span><span style={{ color: C.ink }}>Wissens-Interview · {PERSON}</span>
          <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 800, fontSize: 22, color: "#FFF", background: C.red, borderRadius: 8, padding: "4px 12px", ...popStyle(t, A.interviewt1 - 0.05, 6, 0.6) }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFF", opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 5)) }} />REC {String(mins).padStart(2, "0")}:00
          </span>
        </div>
        {/* was vs warum */}
        <div style={{ position: "absolute", left: 40, right: 40, top: 110, display: "flex", gap: 24, opacity: 1 - lift, transform: `translateY(${-120 * lift}px)` }}>
          <div style={{ flex: 1, height: 220, borderRadius: 20, background: "#FFF", border: `2px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, ...popStyle(t, A.nicht - 0.1, 14, 0.85) }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: C.dim }}>NICHT</div>
            <div style={{ position: "relative", fontFamily: fonts.bold, fontSize: 56, color: strike > 0.5 ? "#B9B4A9" : C.ink }}>Was tust du?
              <div style={{ position: "absolute", left: -6, top: "54%", height: 8, borderRadius: 4, background: C.red, width: `${strike * 104}%` }} />
            </div>
          </div>
          <div style={{ flex: 1, height: 220, borderRadius: 20, background: C.orange, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 18px 40px rgba(217,119,87,0.35)", ...popStyle(t, whyOn, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: "rgba(255,255,255,0.8)" }}>SONDERN</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 64, color: "#FFF" }}>Warum?</div>
          </div>
        </div>
        {/* Q/A */}
        <div style={{ position: "absolute", left: 30, right: 30, top: 110 + 300 * (1 - lift), opacity: lift }}>
          {QA.map((x, i) => (
            <div key={i} style={{ marginBottom: 26 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", ...popStyle(t, x.qa(), 12, 0.92) }}>
                <ClaudeMark size={40} />
                <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: C.ink, lineHeight: 1.3, maxWidth: 820 }}>{x.q}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14, ...popStyle(t, x.aa(), 12, 0.92) }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                  <div style={{ background: "#ECE9E1", borderRadius: 18, padding: "14px 22px", fontFamily: fonts.medium, fontSize: 30, color: C.ink, maxWidth: 700 }}>{typed(x.a, t, x.aa(), x.aa() + 0.7)}</div>
                  <Avatar letter="S" size={50} color={C.orange} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 22, display: "flex", gap: 10, opacity: k(t, A.lieferung, 0.2) }}>
          <Tag text="30 FRAGEN" color={C.ink} size={18} /><Tag text="NACHHAKEN: WARUM?" color={C.orange} size={18} />
        </div>
      </Card>
    </>
  );
};

// ---------- Scene 3: step 2, the conversation becomes a Skill Claude keeps (Schritt zwei - Und jetzt) ----------
const SKILL_LINES = [
  { s: "---", c: C.dim }, { s: "name: sabine-wissen", c: C.orange }, { s: "description: Einkauf, Kunden, Lieferanten", c: C.orange }, { s: "---", c: C.dim },
  { s: "## Sonderpreise", c: C.ink }, { s: "- Müller Bau: 8 %, weil pünktlich seit 2011", c: "#2E2B27" },
  { s: "## Wenn eine Lieferung hängt", c: C.ink }, { s: "- Herrn Kaya direkt anrufen, nie die Hotline", c: "#2E2B27" },
  { s: "## Ausnahmen", c: C.ink }, { s: "- Rehm: Jahresbonus erst nach Abschluss", c: "#2E2B27" },
];
const SceneSkill: React.FC<{ t: number }> = ({ t }) => {
  const s = A.schritt1 - 0.05;
  const fileAt = A.baut - 0.05;
  const lineAt = (i: number) => fileAt + 0.25 + i * Math.max(0.09, (A.merkt - fileAt - 0.5) / SKILL_LINES.length);
  const squash = k(t, A.gespraech - 0.05, 0.5, Easing.in(Easing.cubic));
  return (
    <>
      <StepBar t={t} active={1} at0={s - 1} />
      {/* transcript pages squash into the file */}
      {squash < 1 ? [0, 1, 2].map((i) => (
        <Card key={i} style={{ left: 70 + i * 40, top: 170 + i * 26, width: 380, height: 480, padding: 26, boxSizing: "border-box", opacity: (1 - squash) * k(t, s, 0.2), transform: `translate(${squash * (380 - i * 40)}px, ${squash * 60}px) scale(${1 - 0.7 * squash}) rotate(${(i - 1) * 4 * (1 - squash)}deg)`, zIndex: 3 - i }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: C.dim }}>INTERVIEW · TEIL {i + 1}</div>
          {[92, 70, 84, 60, 88, 74, 66, 80].map((w, j) => <div key={j} style={{ height: 12, width: `${w}%`, borderRadius: 6, background: j % 3 === 0 ? C.orangeSoft : "#EFEDE7", marginTop: 18 }} />)}
        </Card>
      )) : null}
      {/* SKILL.md */}
      <Card style={{ left: 230, top: 150, width: 800, height: 640, background: "#0F0F0E", overflow: "hidden", ...popStyle(t, fileAt, 30, 0.85) }}>
        <div style={{ height: 60, display: "flex", alignItems: "center", gap: 12, padding: "0 22px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          {[C.orange, "#5A5852", "#5A5852"].map((c, i) => <span key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />)}
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: "rgba(255,255,255,0.7)", marginLeft: 10 }}>sabine-wissen/SKILL.md</span>
        </div>
        <div style={{ padding: "18px 28px" }}>
          {SKILL_LINES.map((l, i) => (
            <div key={i} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 25, lineHeight: 1.75, color: l.c === C.ink ? "#FFF" : l.c === "#2E2B27" ? "rgba(255,255,255,0.78)" : l.c, whiteSpace: "nowrap", opacity: k(t, lineAt(i), 0.12) }}>{typed(l.s, t, lineAt(i), lineAt(i) + 0.18)}</div>
          ))}
        </div>
      </Card>
      <div style={{ position: "absolute", left: 60, top: 820, display: "flex", gap: 14 }}>
        <div style={popStyle(t, A.anleitung, 10, 0.6)}><LabelChip text="Anleitung für Claude" size={28} /></div>
        <div style={popStyle(t, A.dauerhaft, 10, 0.6)}><LabelChip text="dauerhaft gespeichert" dot={C.green} size={28} /></div>
      </div>
      <Stamp t={t} at={A.merkt + 0.05} text="GEMERKT" color={C.green} size={44} rot={-7} style={{ left: 880, top: 700 }} />
    </>
  );
};

// ---------- Scene 4: the trick, step 3, the team just asks Claude (Und jetzt - Eine Nachfolgerin) ----------
const ASKS = [
  { who: "T", col: "#2F6BFF", q: "Rabatt für Müller Bau?", a: "8 %, weil pünktlich seit 2011", y: 210 },
  { who: "L", col: "#7B61FF", q: "Lieferung hängt, wen anrufen?", a: "Herrn Kaya direkt, nie die Hotline", y: 420 },
  { who: "M", col: "#1E9E57", q: "Bonus für Rehm schon zahlen?", a: "Erst nach Jahresabschluss", y: 630 },
];
const SceneTrick: React.FC<{ t: number }> = ({ t }) => {
  const s = A.und - 0.05;
  const qAt = (i: number) => A.fragt - 0.1 + i * Math.max(0.2, (A.bekommt - A.fragt) / 3);
  const aAt = (i: number) => A.antwort - 0.1 + i * 0.22;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", opacity: 1 - k(t, A.schritt2 - 0.1, 0.25) }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 96, color: C.ink, letterSpacing: -3, ...popStyle(t, s, 14, 0.7) }}>Der <span style={{ color: "#FFF", background: C.orange, borderRadius: 18, padding: "0 20px" }}>Trick</span></div>
      </div>
      {t > A.schritt2 - 0.15 ? <StepBar t={t} active={2} at0={A.schritt2 - 0.15} /> : null}
      {t > A.schritt2 - 0.1 ? (
        <>
          <div style={{ position: "absolute", left: 540 - 70, top: 400, width: 140, height: 140, borderRadius: 34, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px rgba(217,119,87,0.35)", ...popStyle(t, A.schritt2, 14, 0.5) }}>
            <div style={{ transform: `rotate(${(t - A.schritt2) * 90}deg)` }}><ClaudeMark size={80} /></div>
          </div>
          {ASKS.map((x, i) => (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: 50, top: x.y, width: 400, display: "flex", alignItems: "center", gap: 12, ...popStyle(t, qAt(i), 12, 0.8) }}>
                <Avatar letter={x.who} size={52} color={x.col} />
                <div style={{ background: "#FFF", borderRadius: 16, padding: "12px 16px", fontFamily: fonts.semibold, fontSize: 25, color: C.ink, boxShadow: shadow }}>{x.q}</div>
              </div>
              <div style={{ position: "absolute", left: 630, top: x.y - 10, width: 400, ...popStyle(t, aAt(i), 12, 0.8) }}>
                <div style={{ background: "#FFF", borderRadius: 16, padding: "12px 16px", borderLeft: `6px solid ${C.orange}`, boxShadow: shadow }}>
                  <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: C.ink }}>{x.a}</div>
                  <div style={{ marginTop: 8 }}><Tag text="WIE SABINE" color={C.green} size={14} /></div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </>
      ) : null}
      <Stamp t={t} at={A.gegeben} text="IHRE ANTWORT" color={C.green} size={44} rot={-6} style={{ left: 540, top: 870 }} />
    </>
  );
};

// ---------- Scene 5: payoff, months vs one hour (Eine Nachfolgerin - dreißig) ----------
const ScenePayoff: React.FC<{ t: number }> = ({ t }) => {
  const s = A.nachfolgerin - 0.3;
  const longW = k(t, A.monate - 0.2, 0.7, Easing.out(Easing.cubic));
  const shortW = k(t, A.stunde1 - 0.15, 0.4, Easing.out(Easing.back(1.4)));
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 60, fontFamily: fonts.bold, fontSize: 64, color: C.ink, letterSpacing: -2, ...popStyle(t, s, 12, 0.85) }}>Was kostet dich das?</div>
      <Card style={{ left: 50, top: 210, width: 980, height: 280, padding: "28px 34px", boxSizing: "border-box", ...popStyle(t, s + 0.1, 24, 0.95) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 38, color: C.ink }}>Nachfolgerin einarbeiten</span>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: C.red, ...popStyle(t, A.monate, 8, 0.5) }}>MONATE</span>
        </div>
        <div style={{ height: 40, borderRadius: 12, background: "#EFEDE7", marginTop: 30, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${100 * longW}%`, background: C.red, borderRadius: 12 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.dim }}><span>JAN</span><span>MÄR</span><span>MAI</span><span>JUL</span></div>
      </Card>
      <Card style={{ left: 50, top: 520, width: 980, height: 280, padding: "28px 34px", boxSizing: "border-box", border: `3px solid ${t > A.stunde1 ? C.green : C.line}`, ...popStyle(t, A.das - 0.1, 24, 0.95) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 38, color: C.ink }}>Wissens-Interview mit Claude</span>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: C.green, ...popStyle(t, A.stunde1, 8, 0.5) }}>1 STUNDE</span>
        </div>
        <div style={{ height: 40, borderRadius: 12, background: "#EFEDE7", marginTop: 30, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${4 * shortW}%`, minWidth: shortW > 0 ? 36 : 0, background: C.green, borderRadius: 12 }} />
        </div>
      </Card>
      <Stamp t={t} at={A.stunde1 + 0.3} text="WISSEN GESICHERT" color={C.green} size={40} rot={-6} style={{ left: 700, top: 860 }} />
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: A.dann - 0.05, origin: "50% 50%", El: SceneHook },
  { from: A.dann - 0.05, to: A.so - 0.05, origin: "50% 50%", El: SceneTeam },
  { from: A.so - 0.05, to: A.schritt1 - 0.05, origin: "50% 45%", El: SceneInterview },
  { from: A.schritt1 - 0.05, to: A.und - 0.05, origin: "50% 45%", El: SceneSkill },
  { from: A.und - 0.05, to: A.nachfolgerin - 0.3, origin: "50% 50%", El: SceneTrick },
  { from: A.nachfolgerin - 0.3, to: 999, origin: "50% 45%", El: ScenePayoff },
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
const PAGES = Array.from({ length: 7 }, (_, i) => staticFile(`fpn-wissen/gb-${i + 1}.png`));
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
            <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF", whiteSpace: "nowrap" }}>Wissens-Klon · 30 Interviewfragen.pdf</div>
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
      <div style={{ position: "absolute", left: 50, top: 800, zIndex: 5, transform: "rotate(-6deg)" }}><div style={popStyle(t, G_IN + 0.3, 12, 0.5)}><Tag text="30 FRAGEN" color={C.orange} size={34} /></div></div>
      <div style={{ position: "absolute", right: 50, top: 860, zIndex: 5, transform: "rotate(5deg)" }}><div style={popStyle(t, A.guide, 12, 0.5)}><Tag text="7 SEITEN" color={C.green} size={30} /></div></div>
    </>
  );
};

// ---------- master ----------
const FOCUS = { x: 0.513, y: 0.595, scale: 1.0 }; // overwritten after facefocus if needed
const V_TOP_SPLIT = 400;
const CHEST_Y = 1610;
export const WissenOpus: React.FC = () => {
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
  const sA = SENT[si], sB = SENT[si + 1] ?? WI_END;
  const sp01 = interpolate(t, [sA, sB], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const avZoom = 1 + 0.035 * (si % 2 === 0 ? sp01 : 1 - sp01);
  const El = scene.El;
  const capY = PH * sp + CHEST_Y * (1 - sp);
  // guide: quick whip-out of the scene content before the guide flies in
  const guideCut = k(t, G_IN - 0.1, 0.15);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${push * avZoom})`, transformOrigin: `${FOCUS.x * 100}% ${FOCUS.y * 100}%` }}>
        <OffthreadVideo src={staticFile("fpn-wissen/tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {sp > 0 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * (1 - sp), width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4 + (t < A.dann ? -t * 18 : 0)}px, ${dy * 0.4 + (t < A.dann ? -t * 30 : 0)}px) scale(${1 + (cam - 1) * 0.4})` }} />
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
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, letterSpacing: "0.1em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "8px 28px 8px 32px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>WISSEN</div>
          </div>
          <div style={popStyle(t, A.wissenL + 0.15, 10, 0.6)}><LabelChip text="30 Interviewfragen + Skill-Vorlage · per DM" dot={C.green} size={28} /></div>
        </div>
      ) : null}
      <div style={{ position: "absolute", inset: 0, zIndex: 50, opacity: sp <= 0 || sp >= 1 ? 1 : sp > 0.88 ? (sp - 0.88) / 0.12 : sp < 0.12 ? 1 - sp / 0.12 : 0 }}>
        <SeamCaption t={t} y={capY} />
      </div>
    </AbsoluteFill>
  );
};
