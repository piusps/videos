import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-neue-firmen/captions.json";

// FP-N "Neue Firmen" (2026-10-14), same panel style as EingliederungOpus ("mittlere Dopamin-Stufe"):
// 0 - "Fast": full-frame dopamine hook (counter 0 -> 400, company cards, stamps), no avatar.
// Then split: off-white grid panel on top (0-820 px) with UI cards, avatar below, captions as orange pill on the seam.
// CTA: panel slides away, avatar full frame, captions at chest height, comment pill NEU + guide PDF scroll.
// All timings anchored to the word timings of the tightened timeline (runs/fpn-neue-firmen/captions.json).
// Speed ramp 1.1x, music and SFX are applied afterwards (runs/fpn-neue-firmen/make-sfx.mjs).

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820; // panel height = seam in the split

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const NF_END = LAST_END + 1.0; // ~1 s avatar back after the PDF scroll
export const NF_FRAMES = Math.round(NF_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  jeden: at("jeden"), morgen: at("morgen"), liste: at("liste"), firmen0: at("firmen", 0), jemanden: at("jemanden"), dich: at("dich"), brauchen: at("brauchen"),
  fast: at("fast"), vierhundert: at("vierhundert"), neue: at("neue"), firmen1: at("firmen", 1), tag: at("tag"), claude0: at("claude", 0), schreibt: at("schreibt"), jeder: at("jeder"), brief0: at("brief", 0),
  leg: at("leg"), claude1: at("claude", 1), projekt: at("projekt"), angebot: at("angebot"), zwei: at("zwei"), deiner0: at("deiner", 0), briefe: at("briefe"), damit: at("damit"), klingt: at("klingt"),
  unter: at("unter"), bekannt: at("bekanntmachungen"), hr: at("handelsregister"), neueintr: at("neueintragungen"), kostenlos: at("kostenlos"), chef: at("chef"), vorhaben0: at("vorhaben", 0),
  kopier: at("kopier"), stadt: at("stadt"), rein: at("rein"),
  wer: at("wer"), braucht: at("braucht"), mich: at("mich"), schreib: at("schreib"), jedem: at("jedem"), brief1: at("brief", 1), seinem: at("seinem"), vorhaben1: at("vorhaben", 1),
  per: at("per", 0), post: at("post"), nicht: at("nicht"), mail: at("mail"), sonst: at("sonst"), droht: at("droht"), abmahnung: at("abmahnung"),
  komm: at("kommentier"), neu: at("neu"), schick: at("schick"), fertigen: at("fertigen"), claude2: at("claude", 2), skill: at("skill"),
};

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
  sel: "rgba(47,107,255,0.20)",
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
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color, border: `${size * 0.11}px solid ${color}`, borderRadius: 16, padding: `${size * 0.16}px ${size * 0.42}px ${size * 0.16}px ${size * 0.54}px`, background: "rgba(255,255,255,0.92)", whiteSpace: "nowrap", boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}>{text}</div>
    </div>
  );
};
const PdfIcon: React.FC<{ w?: number; h?: number; color?: string }> = ({ w = 38, h = 44, color = C.orange }) => (
  <span style={{ width: w, height: h, borderRadius: 7, background: color, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: w * 0.32, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: h * 0.13, boxSizing: "border-box", flex: "none" }}>PDF</span>
);
const FileChip: React.FC<{ name: string; kind: string; style?: React.CSSProperties; icon?: React.ReactNode }> = ({ name, kind, style, icon }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#FFF", border: `2px solid ${C.line}`, borderRadius: 12, padding: "8px 16px 8px 10px", boxShadow: "0 6px 14px rgba(20,20,20,0.07)", ...style }}>
    {icon ?? <PdfIcon />}
    <div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 22, color: C.ink, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontFamily: fonts.regular, fontSize: 16, color: C.dim, whiteSpace: "nowrap" }}>{kind}</div>
    </div>
  </div>
);
const Envelope: React.FC<{ w: number; flap?: number }> = ({ w, flap = 0 }) => {
  const h = w * 0.64;
  return (
    <svg width={w} height={h} viewBox="0 0 100 64" style={{ display: "block", overflow: "visible" }}>
      <rect x="1" y="1" width="98" height="62" rx="5" fill="#FFFDF8" stroke="#D9D3C6" strokeWidth="1.6" />
      <path d="M1 62 L40 30 M99 62 L60 30" stroke="#E4DED2" strokeWidth="1.4" fill="none" />
      <path d={`M1 3 L50 ${3 + 34 * (1 - flap)} L99 3`} fill="#F6F1E6" stroke="#D9D3C6" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="80" y="8" width="13" height="15" rx="1.5" fill={C.orange} opacity="0.9" />
      <rect x="12" y="40" width="34" height="3" rx="1.5" fill="#CFC8BA" />
      <rect x="12" y="47" width="26" height="3" rx="1.5" fill="#CFC8BA" />
    </svg>
  );
};

// ---------- Claude-Code-style mascot cursor (same sprite as EingliederungOpus) ----------
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

// generic placeholder companies (no real firms, no real people)
const FIRMS = [
  { n: "Muster Bau GmbH", gf: "M. Mustermann", v: "Bau und Sanierung von Wohnhäusern", hook: "Startet Neubauprojekte" },
  { n: "Beispiel Digital UG", gf: "E. Musterfrau", v: "Onlineshop für Wohnaccessoires", hook: "Shop geht bald live" },
  { n: "Probe Café GmbH", gf: "T. Beispiel", v: "Betrieb eines Cafés mit Röstung", hook: "Eröffnung im Frühjahr" },
  { n: "Vorlage Pflege GmbH", gf: "S. Muster", v: "Ambulanter Pflegedienst", hook: "Sucht erste Kunden" },
  { n: "Test Logistik GmbH", gf: "K. Probe", v: "Kurier- und Lagerdienste", hook: "" },
  { n: "Demo Studio UG", gf: "L. Vorlage", v: "Fotografie und Videoproduktion", hook: "" },
];

// ---------- Scene 0: full-frame hook (0 - fast) ----------
const HOOK_CARDS = [
  // v3 (Henri 14.10.): hook lives in the split panel (0-820 px), avatar visible from frame 0; cards at 0.78 scale
  { f: 0, at: () => -0.4, x: 20, y: 420, r: -4, from: -1 },
  { f: 1, at: () => A.morgen, x: 690, y: 415, r: 4, from: 1 },
  { f: 2, at: () => A.liste, x: 355, y: 445, r: 2, from: -1 },
  { f: 3, at: () => A.firmen0, x: 20, y: 590, r: 3, from: 1 },
  { f: 4, at: () => A.jemanden, x: 690, y: 585, r: -3, from: -1 },
  { f: 5, at: () => A.dich - 0.1, x: 355, y: 615, r: -2, from: 1 },
];
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const n = interpolate(t, [0.05, 2.75], [0, 400], { ...clamp, easing: Easing.out(Easing.quad) });
  const land = t > 2.75 ? Math.max(0, 1 - (t - 2.75) / 0.3) : 0;
  const shake = shakeAt(t, A.brauchen, 6);
  // the counter pulses on every card landing
  const pulse = HOOK_CARDS.reduce((m, c) => Math.max(m, press(t, c.at() + 0.12) * 0.5), 0);
  const drift = 1 + 0.03 * k(t, 0, 3, Easing.inOut(Easing.sin));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translateX(${shake}px) scale(${drift})`, transformOrigin: "50% 40%" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", justifyContent: "center", gap: 14 }}>
        <LabelChip text="Handelsregister" size={30} />
        <div style={popStyle(t, A.morgen, 10, 0.6)}><LabelChip text="Jeden Morgen" dot={C.green} size={30} /></div>
      </div>
      {/* counter */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 84, display: "flex", justifyContent: "center", alignItems: "baseline" }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 200, letterSpacing: "-0.04em", color: C.orange, fontVariantNumeric: "tabular-nums", lineHeight: 1, transform: `scale(${1 + 0.08 * land + 0.05 * pulse})`, textShadow: "0 18px 40px rgba(217,119,87,0.25)" }}>{Math.round(n)}</div>
      </div>
      {/* text hook, fully visible at frame 0 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 72, color: C.ink, letterSpacing: -2, lineHeight: 1 }}>neue Firmen.</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 72, color: "#FFF", background: C.ink, borderRadius: 16, padding: "6px 22px 10px", letterSpacing: -2, lineHeight: 1 }}>Jeden Tag.</div>
      </div>
      {/* company cards fly in */}
      {HOOK_CARDS.map((c, i) => {
        const a = c.at() - 0.06;
        if (t < a) return null;
        const f = k(t, a, 0.3, Easing.out(Easing.back(1.3)));
        const firm = FIRMS[c.f];
        const match = i === 5;
        return (
          <Card key={i} style={{ left: c.x + (1 - f) * c.from * 700, top: c.y, width: 470, height: 170, padding: "22px 26px", boxSizing: "border-box", transform: `rotate(${c.r + (1 - f) * c.from * 12}deg) scale(0.78)`, transformOrigin: "0 0", opacity: k(t, a, 0.08), boxShadow: match && t > A.brauchen ? `${shadow}, 0 0 0 6px ${C.green}` : shadow }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: C.dim }}>NEUEINTRAGUNG</span>
              <Tag text="NEU" color={C.orange} size={16} />
            </div>
            <div style={{ fontFamily: fonts.bold, fontSize: 34, color: C.ink, marginTop: 12, whiteSpace: "nowrap" }}>{firm.n}</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 21, color: C.dim, marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{firm.v}</div>
          </Card>
        );
      })}
      <Stamp t={t} at={A.brauchen} text="BRAUCHT DICH" color={C.green} size={44} rot={-7} style={{ left: 790, top: 560 }} />
    </div>
  );
};

// ---------- Scene 1: 400 a day, Claude writes every one a letter (fast - leg) ----------
const SceneFlut: React.FC<{ t: number }> = ({ t }) => {
  const s = A.fast;
  const n = interpolate(t, [A.vierhundert - 0.05, A.neue + 0.1], [0, 400], { ...clamp, easing: Easing.out(Easing.cubic) });
  const scroll = (t - s) * 260;
  const rowH = 92;
  const claudeAt = A.claude0 - 0.08;
  const letter = "Glückwunsch zur Gründung! Für Ihre ersten Bauprojekte …";
  const fan = k(t, A.jeder - 0.05, 0.35, Easing.out(Easing.back(1.4)));
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 40, display: "flex", gap: 14 }}>
        <div style={popStyle(t, s, 10, 0.6)}><LabelChip text="Neu im Handelsregister" size={24} /></div>
        <div style={popStyle(t, A.tag - 0.05, 10, 0.6)}><LabelChip text="pro Tag" dot={C.green} size={24} /></div>
      </div>
      {/* scrolling list */}
      <Card style={{ left: 70, top: 120, width: 470, height: 640, overflow: "hidden", ...popStyle(t, s, 24, 0.94) }}>
        <div style={{ height: 112, background: "#F6F5F1", borderBottom: `1.5px solid ${C.line}`, padding: "16px 24px", boxSizing: "border-box", position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: C.dim }}>NEUEINTRAGUNGEN HEUTE</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, color: C.orange, fontVariantNumeric: "tabular-nums", lineHeight: 1.15 }}>{Math.round(n)}<span style={{ fontSize: 26, color: C.dim }}> Firmen</span></div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 112, bottom: 0, overflow: "hidden" }}>
          {Array.from({ length: 14 }, (_, i) => {
            const y = ((i * rowH - scroll) % (14 * rowH) + 14 * rowH) % (14 * rowH) - rowH;
            const firm = FIRMS[i % FIRMS.length];
            return (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: rowH, borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", gap: 16, padding: "0 22px" }}>
                <span style={{ width: 46, height: 46, borderRadius: 12, background: C.orangeSoft, color: C.orange, fontFamily: fonts.bold, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{firm.n[0]}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: C.ink, whiteSpace: "nowrap" }}>{firm.n}</div>
                  <div style={{ fontFamily: fonts.regular, fontSize: 18, color: C.dim, whiteSpace: "nowrap" }}>GF: {firm.gf}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      {/* Claude writes a letter for each */}
      {t > claudeAt ? (
        <>
          {[2, 1].map((j) => (
            <div key={j} style={{ position: "absolute", left: 600, top: 170, width: 410, height: 540, borderRadius: 18, background: "#FFF", boxShadow: shadow, transform: `translate(${fan * j * 16}px, ${fan * j * -14}px) rotate(${fan * j * 4}deg)`, opacity: fan }} />
          ))}
          <Card style={{ left: 600, top: 170, width: 410, height: 540, padding: "26px 28px", boxSizing: "border-box", ...popStyle(t, claudeAt, 30, 0.85) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.semibold, fontSize: 22, color: "#6E6B65" }}>
              <div style={{ transform: `rotate(${t < A.brief0 ? (t - claudeAt) * 200 : 0}deg)` }}><ClaudeMark size={28} /></div>Claude schreibt …
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: "0.14em", color: C.dim, marginTop: 26 }}>AN: MUSTER BAU GMBH</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: C.ink, marginTop: 16 }}>Sehr geehrter Herr Mustermann,</div>
            <div style={{ fontFamily: fonts.regular, fontSize: 24, lineHeight: 1.45, color: "#3F3C37", marginTop: 10, minHeight: 140 }}>{typed(letter, t, A.schreibt, A.brief0 - 0.05)}</div>
            {[88, 72, 80].map((w, i) => <div key={i} style={{ height: 12, borderRadius: 6, background: "#EFEDE7", width: `${w}%`, marginTop: 14, opacity: k(t, A.jeder + i * 0.1, 0.2) }} />)}
          </Card>
          <div style={{ position: "absolute", left: 640, top: 646, ...popStyle(t, A.jeder, 8, 0.5) }}><Tag text="1 BRIEF / FIRMA" color={C.ink} size={20} /></div>
        </>
      ) : null}
      <Stamp t={t} at={A.brief0} text="✉ BRIEF" color={C.orange} size={50} rot={-8} style={{ left: 840, top: 500 }} />
    </>
  );
};

// ---------- Scene 2: Claude project (leg - unter) ----------
const PJ = { x: 70, y: 100, w: 940, h: 690 };
const SceneProjekt: React.FC<{ t: number }> = ({ t }) => {
  const s = A.leg;
  const nameA = A.projekt - 0.05, nameB = A.projekt + 0.45;
  const instr = "Ich baue Websites für Gründer in Musterstadt. Festpreis, in 2 Wochen online.";
  const iA = A.angebot - 0.1, iB = A.zwei - 0.05;
  const f1 = A.deiner0 - 0.05, f2 = A.briefe;
  const doneAt = A.klingt - 0.12;
  const btn: [number, number] = [PJ.x + PJ.w - 150, PJ.y + PJ.h - 50];
  const fly = (a: number, i: number): React.CSSProperties => {
    const f = k(t, a, 0.4, Easing.out(Easing.cubic));
    return { opacity: k(t, a, 0.1), transform: `translate(${(1 - f) * (-260 - i * 40)}px, ${(1 - f) * -300}px) rotate(${(1 - f) * -14}deg) scale(${1 + 0.15 * (1 - f)})` };
  };
  return (
    <>
      <div style={{ position: "absolute", left: PJ.x, top: 26, display: "flex", gap: 14 }}>
        <div style={popStyle(t, s, 10, 0.6)}><LabelChip text="Claude" size={24} /></div>
        <div style={popStyle(t, A.projekt, 10, 0.6)}><LabelChip text="Neues Projekt" dot={C.green} size={24} /></div>
      </div>
      <Card style={{ left: PJ.x, top: PJ.y, width: PJ.w, height: PJ.h, overflow: "hidden", background: C.claudeBg, ...popStyle(t, s + 0.05, 24, 0.95) }}>
        <div style={{ height: 56, background: "#F0EEE6", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 10, fontFamily: fonts.semibold, fontSize: 21, color: "#6E6B65" }}>
          <ClaudeMark size={22} />Claude<span style={{ color: "#B9B4A9" }}>/</span>Projekte<span style={{ color: "#B9B4A9" }}>/</span><span style={{ color: C.ink }}>Neues Projekt</span>
        </div>
        <div style={{ padding: "22px 30px" }}>
          <div style={{ fontFamily: fonts.medium, fontSize: 21, color: C.dim }}>Projektname</div>
          <div style={{ marginTop: 8, height: 70, borderRadius: 14, border: `2.5px solid ${t > nameA - 0.1 && t < iA ? C.orange : C.line}`, background: "#FFF", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: fonts.bold, fontSize: 38, color: C.ink }}>
            {t < nameA ? <span style={{ color: "#B9B4A9", fontFamily: fonts.medium, fontSize: 30 }}>Woran arbeitest du?</span> : typed("Gründerbriefe", t, nameA, nameB)}
            {t > nameA - 0.1 && t < iA ? <span style={{ width: 3, height: 40, background: C.orange, marginLeft: 3 }} /> : null}
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 22 }}>
            {/* instructions */}
            <div style={{ flex: 1.25, height: 404, borderRadius: 16, border: `2.5px solid ${t > iA - 0.1 && t < f1 ? C.orange : C.line}`, background: "#FFF", padding: "18px 22px", boxSizing: "border-box", ...popStyle(t, iA - 0.15, 12, 0.96) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.bold, fontSize: 25, color: C.ink }}>
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth={2.4} strokeLinecap="round"><path d="M5 5h14M5 10h14M5 15h9" /></svg>Projektanweisungen
              </div>
              <div style={{ fontFamily: fonts.medium, fontSize: 18, color: C.dim, marginTop: 4 }}>Dein Angebot</div>
              <div style={{ fontFamily: fonts.regular, fontSize: 26, lineHeight: 1.45, color: "#2E2B27", marginTop: 14 }}>
                {typed(instr, t, iA, iB)}
                {t > iA && t < f1 ? <span style={{ display: "inline-block", width: 3, height: 28, background: C.orange, marginLeft: 2, verticalAlign: "-4px" }} /> : null}
              </div>
            </div>
            {/* files */}
            <div style={{ flex: 1, height: 404, borderRadius: 16, border: `2.5px ${t > f1 - 0.2 && t < doneAt ? "solid" : "dashed"} ${t > f1 - 0.2 && t < doneAt ? C.orange : "#D6D1C6"}`, background: "#FFF", padding: "18px 18px", boxSizing: "border-box", ...popStyle(t, iA, 12, 0.96) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.bold, fontSize: 25, color: C.ink }}>
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /></svg>Projektdateien
              </div>
              <div style={{ fontFamily: fonts.medium, fontSize: 18, color: C.dim, marginTop: 4 }}>{t > f2 + 0.3 ? "2 Dateien" : t > f1 + 0.3 ? "1 Datei" : "Dateien hier ablegen"}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
                {t > f1 ? <div style={fly(f1, 0)}><FileChip name="Brief_Kunde_A.pdf" kind="Beispielbrief" /></div> : null}
                {t > f2 ? <div style={fly(f2, 1)}><FileChip name="Brief_Kunde_B.pdf" kind="Beispielbrief" /></div> : null}
              </div>
              <div style={{ marginTop: 20, ...popStyle(t, A.damit, 8, 0.5) }}><Tag text="✓ KLINGT NACH DIR" color={C.green} size={18} /></div>
            </div>
          </div>
        </div>
        <span style={{ position: "absolute", right: 24, bottom: 20, transform: `scale(${1 - 0.12 * press(t, doneAt)})`, height: 58, padding: "0 26px", borderRadius: 12, background: t > doneAt ? C.green : C.ink, color: "#FFF", fontFamily: fonts.semibold, fontSize: 24, display: "flex", alignItems: "center", gap: 10 }}>
          {t > doneAt ? <><Check size={26} p={k(t, doneAt, 0.25)} />Erstellt</> : "Projekt erstellen"}
        </span>
      </Card>
      <Mascot t={t} targets={[{ at: doneAt, p: () => btn }]} hold={0.3} />
    </>
  );
};

// ---------- Scene 3: SceneRegister (unter - wer) ----------
// Kept as its own block with its own anchors on purpose (content may still change).
// Neutral register card, generic placeholder firms, NO menu path.
const RG = { x: 70, y: 100, w: 940, h: 690, rowTop: 168, rowH: 120 };
const REG_ANCHOR = {
  card: A.unter, title: A.hr - 0.05, rows: A.bekannt + 0.05, neu: A.neueintr, free: A.kostenlos - 0.05, chef: A.chef - 0.05, vorhaben: A.vorhaben0 - 0.05,
  selA: A.kopier - 0.02, selB: A.kopier + 0.42, copy: A.kopier + 0.5, city: A.stadt - 0.05, paste: A.rein - 0.02,
};
const SceneRegister: React.FC<{ t: number }> = ({ t }) => {
  const R = REG_ANCHOR;
  const rows = FIRMS.slice(0, 4);
  const sel = interpolate(t, [R.selA, R.selB], [0, rows.length], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const pasteF = k(t, R.paste, 0.32, Easing.out(Easing.cubic));
  const cardShift = pasteF; // register card moves up/back when pasting into Claude
  const cityPulse = press(t, R.city + 0.05);
  const hlChef = k(t, R.chef, 0.2), hlVor = k(t, R.vorhaben, 0.2);
  const rowY = (i: number) => RG.y + RG.rowTop + i * RG.rowH;
  const composer = { x: 120, y: 600, w: 840, h: 150 };
  return (
    <>
      <div style={{ position: "absolute", left: RG.x, top: 26, display: "flex", gap: 12, opacity: 1 - pasteF }}>
        <div style={popStyle(t, R.title, 10, 0.6)}><LabelChip text="Handelsregister" size={24} /></div>
        <div style={popStyle(t, R.free, 10, 0.6)}><LabelChip text="kostenlos" dot={C.green} size={24} /></div>
        <div style={popStyle(t, R.chef, 10, 0.6)}><LabelChip text="Chef" dot={C.blue} size={24} /></div>
        <div style={popStyle(t, R.vorhaben, 10, 0.6)}><LabelChip text="Vorhaben" size={24} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translateY(${-70 * cardShift}px) scale(${1 - 0.1 * cardShift})`, transformOrigin: "50% 0%", opacity: 1 - 0.35 * cardShift }}>
        <Card style={{ left: RG.x, top: RG.y, width: RG.w, height: RG.h, overflow: "hidden", ...popStyle(t, R.card, 24, 0.95) }}>
          <div style={{ height: 76, background: "#F6F5F1", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 26px", gap: 14 }}>
            <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth={2} strokeLinejoin="round"><path d="M3 9l9-5 9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" /></svg>
            <span style={{ fontFamily: fonts.bold, fontSize: 30, color: C.ink }}>Handelsregister</span>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: C.dim, marginLeft: 6 }}>NEUEINTRAGUNGEN</span>
            <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: fonts.semibold, fontSize: 22, color: C.ink, background: "#FFF", border: `2.5px solid ${cityPulse > 0 || (t > R.city && t < R.paste) ? C.orange : C.line}`, borderRadius: 10, padding: "6px 14px", transform: `scale(${1 + 0.1 * cityPulse})` }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill={C.orange}><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>Musterstadt
            </span>
          </div>
          <div style={{ height: 52, display: "flex", alignItems: "center", padding: "0 26px", fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: "0.12em", color: C.dim, borderBottom: `1.5px solid ${C.line}` }}>
            <span style={{ width: 360 }}>FIRMA</span><span style={{ width: 200 }}>GESCHÄFTSFÜHRUNG</span><span>GEGENSTAND</span>
          </div>
          {rows.map((f, i) => {
            const a = R.rows + i * 0.14;
            const selW = Math.max(0, Math.min(1, sel - i));
            return (
              <div key={f.n} style={{ position: "absolute", left: 0, right: 0, top: RG.rowTop - 40 + i * RG.rowH, height: RG.rowH, borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 26px", ...popStyle(t, a, 14, 0.96) }}>
                <div style={{ position: "absolute", left: 14, top: 8, bottom: 8, width: `calc(${selW * 100}% - 28px)`, background: C.sel, borderRadius: 6 }} />
                <div style={{ width: 360, position: "relative" }}>
                  <div style={{ fontFamily: fonts.bold, fontSize: 27, color: C.ink, whiteSpace: "nowrap" }}>{f.n}</div>
                  <div style={{ marginTop: 6 }}><span style={{ display: "inline-block", transform: `scale(${1 + 0.45 * press(t, R.neu + i * 0.08)})` }}><Tag text="NEU" color={C.orange} size={13} /></span> <span style={{ fontFamily: fonts.regular, fontSize: 17, color: C.dim, marginLeft: 6 }}>HRB 1{i}{i + 3}4{i + 1}</span></div>
                </div>
                <div style={{ width: 200, position: "relative", fontFamily: fonts.semibold, fontSize: 22, color: C.ink, whiteSpace: "nowrap" }}>
                  <span style={{ background: `rgba(47,107,255,${0.16 * hlChef})`, boxShadow: `inset 0 -${4 * hlChef}px 0 ${C.blue}`, padding: "2px 4px", borderRadius: 4 }}>{f.gf}</span>
                </div>
                <div style={{ flex: 1, position: "relative", fontFamily: fonts.regular, fontSize: 21, lineHeight: 1.3, color: "#3F3C37" }}>
                  <span style={{ background: `rgba(217,119,87,${0.18 * hlVor})`, boxShadow: `inset 0 -${4 * hlVor}px 0 ${C.orange}`, padding: "2px 4px", borderRadius: 4 }}>{f.v}</span>
                </div>
              </div>
            );
          })}
        </Card>
        <Stamp t={t} at={R.free} text="0 €" color={C.green} size={46} rot={-8} style={{ left: 900, top: 700 }} />
      </div>
      {/* copy key */}
      {t > R.copy && t < R.paste + 0.3 ? (
        <div style={{ position: "absolute", left: 790, top: 520, display: "flex", gap: 8, zIndex: 35, ...popStyle(t, R.copy, 10, 0.5), opacity: k(t, R.copy, 0.1) * (1 - k(t, R.paste, 0.2)) }}>
          {["⌘", "C"].map((x) => <span key={x} style={{ width: 70, height: 70, borderRadius: 14, background: C.ink, color: "#FFF", fontFamily: fonts.bold, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 0 #000, 0 14px 24px rgba(0,0,0,0.25)" }}>{x}</span>)}
        </div>
      ) : null}
      {/* paste into Claude */}
      {t > R.paste - 0.02 ? (
        <div style={{ position: "absolute", left: composer.x, top: composer.y + (1 - pasteF) * 260, width: composer.w, height: composer.h, borderRadius: 18, background: "#FFF", border: `2.5px solid ${C.orange}`, boxShadow: "0 24px 60px rgba(20,20,20,0.22)", padding: "14px 18px", boxSizing: "border-box", zIndex: 36, opacity: k(t, R.paste, 0.1) }}>
          <div style={popStyle(t, R.paste + 0.12, 10, 0.8)}><FileChip name="Neueintragungen_Musterstadt.txt" kind="Eingefügt · 37 Firmen" icon={<span style={{ width: 38, height: 44, borderRadius: 7, background: C.ink, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 12, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6, boxSizing: "border-box" }}>TXT</span>} /></div>
          <div style={{ position: "absolute", left: 18, bottom: 14, display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.medium, fontSize: 22, color: "#AAA69E" }}><ClaudeMark size={22} />Antworte Claude …</div>
        </div>
      ) : null}
      <Mascot t={t} hold={0.3} targets={[
        { at: R.selA, p: () => [RG.x + 30, rowY(0) - 20], click: false },
        { at: R.selB, p: () => [RG.x + RG.w - 40, rowY(3) + 20], click: false, glide: true },
        { at: R.paste + 0.2, p: () => [composer.x + 420, composer.y + 60] },
      ]} />
    </>
  );
};

// ---------- Scene 4: who needs me, letters (wer - per) ----------
const BF = { x: 70, y: 96, w: 940, h: 700 };
const SceneBriefe: React.FC<{ t: number }> = ({ t }) => {
  const PROMPT = "Wer braucht mich? Schreib jedem einen Brief zu seinem Vorhaben.";
  const tA = A.wer - 0.1, sendAt = A.schreib + 0.02;
  const sent = t >= sendAt + 0.05;
  const thinking = t > sendAt && t < A.jedem + 0.05;
  const rowAt = [A.jedem, A.jedem + 0.16, A.jedem + 0.32];
  const brA = A.brief1 + 0.05;
  const brief = "Glückwunsch zur Gründung der Muster Bau GmbH! Für Ihre ersten Neubauprojekte baue ich Ihnen eine Website, auf der Bauherren Sie finden.";
  const sendP: [number, number] = [BF.x + BF.w - 22 - 34, BF.y + BF.h - 16 - 33];
  return (
    <>
      <div style={{ position: "absolute", left: BF.x, top: 24, display: "flex", gap: 14 }}>
        <LabelChip text="Projekt: Gründerbriefe" size={24} />
        <div style={popStyle(t, A.jedem, 10, 0.6)}><LabelChip text="Jedem ein Brief" dot={C.green} size={24} /></div>
      </div>
      <Card style={{ left: BF.x, top: BF.y, width: BF.w, height: BF.h, overflow: "hidden", background: C.claudeBg }}>
        <div style={{ height: 54, background: "#F0EEE6", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: fonts.semibold, fontSize: 21, color: "#6E6B65" }}>
          <ClaudeMark size={20} />Gründerbriefe
        </div>
        {sent ? (
          <div style={{ position: "absolute", right: 22, top: 68, display: "flex", alignItems: "center", gap: 10, ...popStyle(t, sendAt + 0.05, 12, 0.92) }}>
            <span style={{ fontFamily: fonts.semibold, fontSize: 18, color: C.dim, border: `2px solid ${C.line}`, background: "#FFF", borderRadius: 10, padding: "8px 12px" }}>TXT · 37 Firmen</span>
            <div style={{ background: "#ECE9E1", borderRadius: 16, padding: "10px 18px", fontFamily: fonts.medium, fontSize: 23, color: C.ink, whiteSpace: "nowrap" }}>Wer braucht mich? Schreib jedem …</div>
          </div>
        ) : null}
        {sent ? (
          <div style={{ position: "absolute", left: 22, right: 22, top: 130 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, height: 34 }}>
              <div style={{ transform: `rotate(${thinking ? (t - sendAt) * 260 : 0}deg)` }}><ClaudeMark size={30} /></div>
              {thinking ? <span style={{ fontFamily: fonts.medium, fontSize: 22, color: C.dim }}>Liest 37 Neueintragungen …</span> : <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: C.ink }}>3 passen zu deinem Angebot:</span>}
            </div>
            {/* table */}
            <div style={{ marginTop: 10, borderRadius: 12, border: `2px solid ${C.line}`, background: "#FFF", overflow: "hidden", ...popStyle(t, rowAt[0] - 0.08, 10, 0.97) }}>
              <div style={{ display: "flex", background: "#F4F2EC", fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: "0.12em", color: C.dim, padding: "9px 16px" }}>
                <span style={{ width: 300 }}>FIRMA</span><span style={{ width: 210 }}>CHEF</span><span>AUFHÄNGER</span>
              </div>
              {FIRMS.slice(0, 3).map((f, i) => (
                <div key={f.n} style={{ display: "flex", alignItems: "center", padding: "0 16px", height: 50, borderTop: `1.5px solid ${C.line}`, fontSize: 22, ...popStyle(t, rowAt[i], 8, 0.97) }}>
                  <span style={{ width: 300, fontFamily: fonts.semibold, color: C.ink, whiteSpace: "nowrap" }}>{f.n}</span>
                  <span style={{ width: 210, fontFamily: fonts.regular, color: "#3F3C37", whiteSpace: "nowrap" }}>{f.gf}</span>
                  <span style={{ fontFamily: fonts.medium, color: C.orange, whiteSpace: "nowrap" }}>{f.hook}</span>
                </div>
              ))}
            </div>
            {/* letter excerpt */}
            <div style={{ marginTop: 12, borderRadius: 12, background: "#FFF", border: `2px solid ${C.line}`, borderLeft: `6px solid ${C.orange}`, padding: "12px 18px", height: 156, boxSizing: "border-box", ...popStyle(t, brA, 10, 0.96) }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 14, letterSpacing: "0.14em", color: C.dim }}>BRIEF 1/3 · MUSTER BAU GMBH</div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 22, color: C.ink, marginTop: 6 }}>Sehr geehrter Herr Mustermann,</div>
              <div style={{ fontFamily: fonts.regular, fontSize: 21, lineHeight: 1.4, color: "#3F3C37", marginTop: 4 }}>{typed(brief, t, brA + 0.1, A.per - 0.1)}</div>
            </div>
          </div>
        ) : (
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <ClaudeMark size={60} />
            <div style={{ fontFamily: fonts.medium, fontSize: 38, color: C.ink }}>Wer braucht dich heute?</div>
          </div>
        )}
        {/* composer */}
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 16, height: sent ? 66 : 170, borderRadius: 16, border: `2px solid ${sent ? C.line : C.orange}`, background: "#FFF", padding: "12px 12px 12px 18px", boxSizing: "border-box" }}>
          {!sent ? <FileChip name="Neueintragungen_Musterstadt.txt" kind="Eingefügt · 37 Firmen" icon={<span style={{ width: 38, height: 44, borderRadius: 7, background: C.ink, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 12, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6, boxSizing: "border-box" }}>TXT</span>} /> : null}
          <div style={{ position: "absolute", left: 18, right: 80, bottom: 12, minHeight: 40, display: "flex", alignItems: "center", fontFamily: fonts.medium, fontSize: 25, color: sent ? "#AAA69E" : C.ink, whiteSpace: "nowrap", overflow: "hidden" }}>
            {sent ? "Antworte Claude …" : <>{typed(PROMPT, t, tA, sendAt - 0.08).slice(-44)}<span style={{ display: "inline-block", width: 3, height: 28, background: C.orange, marginLeft: 2 }} /></>}
          </div>
          <span style={{ position: "absolute", right: 10, bottom: 9, transform: `scale(${1 - 0.18 * press(t, sendAt)})`, width: 48, height: 48, borderRadius: 12, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: fonts.bold, fontSize: 28 }}>↑</span>
        </div>
      </Card>
      <Stamp t={t} at={A.vorhaben1} text="✓ PERSÖNLICH" color={C.green} size={44} rot={-7} style={{ left: 740, top: 680 }} />
      <Mascot t={t} targets={[{ at: sendAt, p: () => sendP }]} hold={0.3} />
    </>
  );
};

// ---------- Scene 5: post, not mail (per - kommentier) ----------
const ScenePost: React.FC<{ t: number }> = ({ t }) => {
  const envAt = A.post - 0.12, mailAt = A.nicht - 0.05, xAt = A.mail + 0.05;
  const shake = shakeAt(t, A.abmahnung, 6);
  const flap = k(t, envAt + 0.35, 0.3, Easing.inOut(Easing.cubic));
  const drop = interpolate(t, [envAt + 0.15, envAt + 0.5], [-90, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translateX(${shake}px)` }}>
      <div style={{ position: "absolute", left: 70, top: 34, fontFamily: fonts.bold, fontSize: 64, color: C.ink, letterSpacing: -1, ...popStyle(t, A.per, 12, 0.8), transformOrigin: "0% 50%" }}>
        Per <span style={{ background: C.orange, color: "#FFF", borderRadius: 14, padding: "0 16px" }}>Post.</span>
      </div>
      {/* mail card (left) */}
      <Card style={{ left: 70, top: 170, width: 440, height: 520, overflow: "hidden", ...popStyle(t, mailAt, 22, 0.9), opacity: k(t, mailAt, 0.12) * (1 - 0.3 * k(t, xAt, 0.2)) }}>
        <div style={{ height: 52, background: "#F6F5F1", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 10, fontFamily: fonts.semibold, fontSize: 21, color: "#6E6B65" }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#6E6B65" strokeWidth={2}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>Neue E-Mail
        </div>
        <div style={{ padding: "18px 22px" }}>
          {[["An", "info@muster-bau.example"], ["Betreff", "Ihre neue Firma"]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", gap: 12, borderBottom: `1.5px solid ${C.line}`, padding: "10px 0", fontSize: 20 }}>
              <span style={{ fontFamily: fonts.medium, color: C.dim, width: 74 }}>{l}</span><span style={{ fontFamily: fonts.medium, color: C.ink, whiteSpace: "nowrap" }}>{v}</span>
            </div>
          ))}
          {[90, 80, 86, 60].map((w, i) => <div key={i} style={{ height: 12, borderRadius: 6, background: "#EFEDE7", width: `${w}%`, marginTop: i ? 14 : 24 }} />)}
          <div style={{ marginTop: 30, display: "inline-flex", height: 52, padding: "0 24px", borderRadius: 12, background: C.blue, color: "#FFF", fontFamily: fonts.semibold, fontSize: 22, alignItems: "center", opacity: 0.85 }}>Senden</div>
        </div>
        {t > xAt ? (
          <div style={{ position: "absolute", inset: 0, background: `rgba(229,72,77,${0.1 * k(t, xAt, 0.2)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 170, height: 170, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(t, [xAt, xAt + 0.24], [1.7, 1], { ...clamp, easing: Easing.out(Easing.back(2)) })})`, boxShadow: "0 14px 30px rgba(229,72,77,0.4)" }}><Cross size={110} p={k(t, xAt, 0.22)} /></div>
          </div>
        ) : null}
      </Card>
      {/* envelope (right) */}
      <Card style={{ left: 550, top: 170, width: 460, height: 520, display: "flex", flexDirection: "column", alignItems: "center", padding: "34px 30px", boxSizing: "border-box", ...popStyle(t, envAt, 22, 0.9) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 17, letterSpacing: "0.14em", color: C.dim, alignSelf: "flex-start" }}>BRIEF · DEUTSCHE POST</div>
        <div style={{ position: "relative", marginTop: 34, width: 380, height: 244 }}>
          {/* letter sliding into the envelope */}
          <div style={{ position: "absolute", left: 40, top: drop - 20, width: 300, height: 180, background: "#FFF", border: `1.5px solid ${C.line}`, borderRadius: 6, padding: 16, boxSizing: "border-box", opacity: 1 - k(t, envAt + 0.5, 0.15), zIndex: 1 }}>
            <div style={{ fontFamily: fonts.semibold, fontSize: 16, color: C.ink }}>Sehr geehrter Herr Mustermann,</div>
            {[90, 76, 84].map((w, i) => <div key={i} style={{ height: 8, borderRadius: 4, background: "#EFEDE7", width: `${w}%`, marginTop: 10 }} />)}
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, zIndex: 2 }}><Envelope w={380} flap={1 - flap} /></div>
        </div>
        <div style={{ marginTop: 34, ...popStyle(t, A.post + 0.15, 10, 0.5) }}><Tag text="✓ PER POST" color={C.green} size={26} /></div>
      </Card>
      <div style={{ position: "absolute", left: 120, top: 712, ...popStyle(t, A.droht - 0.05, 10, 0.5) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, letterSpacing: "0.08em", color: "#FFF", background: C.ink, borderRadius: 12, padding: "8px 20px 8px 22px", boxShadow: "0 10px 24px rgba(0,0,0,0.22)" }}>§ 7 UWG</div>
      </div>
      <Stamp t={t} at={A.abmahnung} text="ABMAHNUNG" color={C.red} size={52} rot={-9} style={{ left: 290, top: 420 }} />
    </div>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: A.fast, to: A.leg, origin: "50% 50%", El: SceneFlut },
  { from: A.leg, to: A.unter, origin: "50% 50%", El: SceneProjekt },
  { from: A.unter, to: A.wer, origin: "50% 40%", El: SceneRegister },
  { from: A.wer, to: A.per, origin: "50% 55%", El: SceneBriefe },
  { from: A.per, to: 999, origin: "50% 50%", El: ScenePost },
];

// ---------- captions: orange pill on the seam, active word in a black pill ----------
const chunks = (() => {
  const out: { start: number; end: number; words: { w: string; s: number }[] }[] = [];
  let cur: Cap[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => ({ w: c.text.replace(/[.,!?]/g, "").toUpperCase(), s: c.startMs / 1000 })) });
    cur = [];
  };
  for (const c of captions as Cap[]) {
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
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.08), background: "#D97757", borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: MONO, fontWeight: 700, fontSize: 46, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(120,50,25,0.30)" }}>
        {(() => {
          const cw = 46 * 0.74, gapW = 46 * 0.5;
          const xs: number[] = []; let acc = 0;
          c.words.forEach((w) => { xs.push(acc); acc += w.w.length * cw + gapW; });
          const ws = c.words.map((w) => w.w.length * cw - 46 * 0.14);
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

// ---------- CTA: real Gruenderbriefe guide (10 pages) scrolls through fast (like PdfScroll in EingliederungOpus) ----------
const PAGES = Array.from({ length: 10 }, (_, i) => i + 1).map((n) => staticFile(`fpn-neue-firmen/gb-${n}.png`));
const PDF = { left: 120, top: 640, w: 840, h: 1220, bar: 76, pw: 780, ph: Math.round((780 * 1754) / 1240), gap: 26 };
const PITCH = PDF.ph + PDF.gap;
export const PDF_IN = A.schick - 0.04;
export const PDF_OUT = A.skill + 0.12;
const SCROLL_A = PDF_IN + 0.32, SCROLL_B = PDF_OUT - 0.12;
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
        <div style={{ width: 34, height: 40, borderRadius: 6, background: C.red, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 12, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 5, boxSizing: "border-box" }}>PDF</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: "#FFF", whiteSpace: "nowrap" }}>Gründerbriefe – Guide.pdf</div>
        <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 26, color: "#FFF", background: C.orange, borderRadius: 10, padding: "6px 14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{page} / {PAGES.length}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: PDF.bar, bottom: 0, overflow: "hidden" }}>
        {Array.from({ length: SAMPLES }, (_, j) => {
          const yy = scrollY(t - (j / (SAMPLES - 1)) * SHUTTER);
          return (
            <div key={j} style={{ position: "absolute", left: (PDF.w - PDF.pw) / 2, top: 22 - yy, opacity: 1 / (j + 1) }}>
              {PAGES.map((src, i) => (
                <Img key={i} src={src} style={{ position: "absolute", left: 0, top: i * PITCH, width: PDF.pw, height: PDF.ph, borderRadius: 6, boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- master ----------
// avatar framing: facefocus.txt (panel 0.427): focus 0.513/0.596, faceTop_min 1112, chin_max 1638 at faceAt 0.5 (same blue look as Eingliederung)
const FOCUS = { x: 0.513, y: 0.596, scale: 1.0 };
const CTA = A.komm - 0.12;
const SPLIT_SRC_TOP = 430; // source row that sits on the seam in the split
const CHEST_Y = 1540; // full frame: caption centre on chest/shoulder height
const HOOK_CAP_Y = 1745; // full-frame hook: caption low, under the cards
export const NeueFirmenOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // hook -> split: the full-frame panel shrinks to the seam on "Fast"
  const split = 1; // v3: split from frame 0 (Henri 14.10.: full-frame B-roll at the start is less trustworthy)
  const panelH = H + (PH - H) * split;
  const inHook = t < A.fast + 0.3;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? (t < A.fast ? SCENES[0] : SCENES[SCENES.length - 1]);
  const cam = camera(t, scene.from, Math.min(scene.to, CTA));
  const dx = Math.sin(t * 0.6) * 6, dy = Math.cos(t * 0.45) * 5;
  const full = k(t, CTA, 0.42, Easing.inOut(Easing.cubic));
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTopSplit = Math.min(PH, Math.max(H - vh, PH - SPLIT_SRC_TOP * s));
  // avatar rises from below while the hook panel shrinks
  const vTop = (vTopSplit + (1 - split) * 260) * (1 - full);
  const push = 1 + 0.05 * k(t, CTA + 0.45, 2.6, Easing.inOut(Easing.sin));
  const El = scene.El;
  const hookOut = k(t, A.fast - 0.08, 0.26);
  const capY = PH + (CHEST_Y - PH) * full;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${push})`, transformOrigin: "50% 45%" }}>
        <OffthreadVideo src={staticFile("fpn-neue-firmen/tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {full < 1 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * full, width: W, height: panelH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4 + (inHook ? -t * 18 : 0)}px, ${dy * 0.4 + (inHook ? -t * 30 : 0)}px) scale(${1 + (cam - 1) * 0.4})` }} />
          {inHook ? (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - hookOut, transform: `translateY(${-180 * hookOut}px) scale(${1 - 0.12 * hookOut})`, transformOrigin: "50% 0%" }}>
              <SceneHook t={t} />
            </div>
          ) : null}
          {t >= A.fast ? (
            <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
              <El t={t} />
            </div>
          ) : null}
        </div>
      ) : null}
      <PdfScroll t={t} />
      {/* CTA: trigger-word pill above the head */}
      {t > A.neu - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.neu - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 56, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "8px 30px 8px 34px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>NEU</div>
          </div>
          <div style={popStyle(t, A.fertigen - 0.05, 10, 0.6)}><LabelChip text="Fertiger Claude Skill · per DM" dot={C.green} size={28} /></div>
        </div>
      ) : null}
      {/* hide the caption while it travels from the seam to chest height, so it never crosses the face */}
      <div style={{ position: "absolute", inset: 0, zIndex: 50, opacity: full <= 0 || full >= 1 ? 1 : full < 0.12 ? 1 - full / 0.12 : full > 0.88 ? (full - 0.88) / 0.12 : 0 }}>
        <SeamCaption t={t} y={capY} />
      </div>
    </AbsoluteFill>
  );
};
