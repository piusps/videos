import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-eingliederungszuschuss/captions.json";

// FP-N "Eingliederungszuschuss" (Henri 2026-10-13), opusjake style like KonkurrenzOpus: split from frame 0,
// B-Roll panel on top (0-820 px, off-white grid canvas, real UI cards, stamps/badges), avatar below,
// captions as Claude-orange pill on the seam with a black pill around the active word.
// CTA: panel slides away, avatar goes full frame, captions drop to chest height.
// All timings are anchored to the word timings of the tightened timeline (captions.json).
// Speed ramp 1.15x, music and SFX are applied afterwards (make-sfx.mjs).

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820; // panel height = seam

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
// v2: +1.03 s tail so the avatar + pill come back after the PDF scroll (source holds its last frame)
export const EZ_END = LAST_END + 1.03;
export const EZ_FRAMES = Math.round(EZ_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false, prefix = false) => {
  const m = WORDS.filter((x) => (prefix ? x.w.startsWith(word) : x.w === word));
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  haelfte: at("hälfte", 0), gehalt: at("gehalt", 0), mitarbeiters: at("mitarbeiters"), jahr: at("jahr"),
  verschenken: at("verschenken"), geld: at("geld", 0), einen: at("einen"), spaet: at("spät"),
  dahinter: at("dahinter"), eglz: at("eingliederungszuschuss"), agentur1: at("arbeitsagentur", 0), sgb: at("sozialgesetzbuch"),
  wer: at("wer", 0), bewerber: at("bewerber", 0), arbeitsmarkt: at("arbeitsmarkt"), schwerer: at("schwerer"),
  laenger: at("länger", 0), aelter: at("älter"), keinen: at("keinen"), oft: at("oft"), aussortiert: at("aussortiert"), haettest: at("hättest"),
  ob: at("ob"), prueft: at("prüft"), gib: at("gib"), lebenslauf: at("lebenslauf"), stellenanzeige: at("stellenanzeige"),
  claude2: at("claude", 1), sagt: at("sagt"), agentur2: at("arbeitsagentur", 1), antrag: at("antrag", 0), gehoert: at("gehört"),
  wie: at("wie"), haelfte2: at("hälfte", 1), zwoelf: at("zwölf"), schwerb: at("schwerbehinderung"), mehr: at("mehr"), laenger2: at("länger", 1),
  wichtig: at("wichtig"), zeitpunkt: at("zeitpunkt"), beantragen: at("beantragen"), bevor: at("bevor"), anfaengt: at("anfängt"),
  hat: at("hat"), angefangen: at("angefangen"), geld2: at("geld", 1), weg: at("weg"),
  komm: at("kommentier"), zuschuss: at("zuschuss", 1), checkliste: at("checkliste"), unterschrift: at("unterschrift"),
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
  link: "#1F4FD1",
  chip: "#141414",
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
const Stars: React.FC<{ n: number; size?: number }> = ({ n, size = 20 }) => (
  <span style={{ color: "#F2A531", fontSize: size, letterSpacing: 1 }}>{"★★★★★".slice(0, Math.round(n))}<span style={{ color: "#D9D5CC" }}>{"★★★★★".slice(Math.round(n))}</span></span>
);
const Globe: React.FC<{ size: number; color?: string }> = ({ size, color = C.dim }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>
);
const Magnifier: React.FC<{ size: number; color?: string }> = ({ size, color = C.dim }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
);
const BrowserBar: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ height: 50, background: "#F6F5F1", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 8, borderRadius: "18px 18px 0 0" }}>
    {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />)}
    <div style={{ marginLeft: 12, flex: 1, height: 30, borderRadius: 8, background: "#FFF", border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 12px", gap: 8, fontFamily: fonts.medium, fontSize: 18, color: "#6E6B65", whiteSpace: "nowrap", overflow: "hidden" }}>
      <Globe size={16} />{label}
    </div>
  </div>
);
/** Painted-wall photo placeholder (no stock photo, no real business). */
const WallPhoto: React.FC<{ w: number; h: number; hue?: string; style?: React.CSSProperties }> = ({ w, h, hue = "#C9D8C5", style }) => (
  <div style={{ width: w, height: h, borderRadius: 10, background: `linear-gradient(135deg, ${hue} 0%, #EDEBE4 58%, #DCD7CC 100%)`, position: "relative", overflow: "hidden", ...style }}>
    <div style={{ position: "absolute", left: "8%", bottom: 0, width: "26%", height: "58%", background: "rgba(255,255,255,0.55)", borderRadius: "6px 6px 0 0" }} />
    <div style={{ position: "absolute", right: "10%", top: "18%", width: "30%", height: "36%", border: "4px solid rgba(255,255,255,0.7)", borderRadius: 4 }} />
  </div>
);

// ---------- Claude-Code-style mascot cursor (same sprite as KontoauszugOpus) ----------
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
type Tgt = { at: number; p: () => [number, number]; click?: boolean };
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
      const d = Math.min(0.42, b.at - a.at - 0.1);
      const st = b.at - d;
      const q = interpolate(t, [st, b.at], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
      const [bx, by] = b.p();
      const dist = Math.hypot(bx - ax, by - ay);
      x = ax + (bx - ax) * q;
      y = ay + (by - ay) * q - Math.sin(q * Math.PI) * (46 + dist * 0.18);
      air = q > 0 && q < 1 ? Math.sin(q * Math.PI) : 0;
      const pre = interpolate(t, [st - 0.07, st], [0, 1], clamp) * (t < st ? 1 : 0);
      if (pre > 0) { sx = 1 + 0.16 * pre; sy = 1 - 0.2 * pre; }
    }
  }
  if (air > 0) { sx = 1 - 0.1 * air; sy = 1 + 0.14 * air; }
  const landed = targets.filter((g) => g.at <= t).pop();
  if (landed) {
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


const fmt = (n: number) => Math.round(n).toLocaleString("de-DE");
const Stamp: React.FC<{ t: number; at: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, at: a, text, color = C.red, size = 64, rot = -8, style }) => {
  if (t < a) return null;
  const sp = interpolate(t, [a, a + 0.24], [1.8, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
  return (
    <div style={{ position: "absolute", transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${sp})`, opacity: k(t, a, 0.07), zIndex: 30, ...style }}>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color, border: `${size * 0.11}px solid ${color}`, borderRadius: 16, padding: `${size * 0.16}px ${size * 0.42}px ${size * 0.16}px ${size * 0.54}px`, background: "rgba(255,255,255,0.9)", whiteSpace: "nowrap", boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}>{text}</div>
    </div>
  );
};
const shakeAt = (t: number, a: number, amp = 5) => { const r = t - a; return r > 0.05 && r < 0.4 ? Math.sin(r * 90) * amp * (1 - r / 0.4) : 0; };

// ---------- Scene A: hook, salary card halves (0 - dahinter) ----------
const SC = { x: 100, y: 205, w: 880, h: 420 };
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const cut = A.haelfte;                       // dashed cut line draws
  const sep = k(t, cut + 0.14, 0.32, Easing.out(Easing.back(1.6)));
  const swap = k(t, A.gehalt + 0.02, 0.18);     // halves get their own content
  const roll = interpolate(t, [A.gehalt + 0.06, A.mitarbeiters - 0.08], [3000, 1500], { ...clamp, easing: Easing.out(Easing.cubic) });
  const glide = k(t, A.mitarbeiters, 0.5, Easing.out(Easing.cubic)); // AA card glides away
  const gone = k(t, A.verschenken, 0.45, Easing.in(Easing.cubic));  // ... and leaves the frame
  const badge = pop(t, A.jahr, 0.4);
  const months = interpolate(t, [A.jahr + 0.05, A.jahr + 0.55], [0, 12], clamp);
  const calAt = A.einen - 0.02;
  const stampAt = A.spaet;
  const dimLeft = k(t, stampAt, 0.25) * 0.35;
  const half = SC.w / 2;
  const shake = shakeAt(t, stampAt, 6);
  const settle = interpolate(t, [0, 0.35], [0.965, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const CardFace: React.FC = () => (
    <div style={{ width: SC.w, height: SC.h, padding: "36px 46px", boxSizing: "border-box" }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.14em", color: C.dim }}>GEHALTSABRECHNUNG · BEISPIEL</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22 }}>
        <span style={{ width: 64, height: 64, borderRadius: "50%", background: C.orangeSoft, color: C.orange, fontFamily: fonts.bold, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>NM</span>
        <span style={{ fontFamily: fonts.semibold, fontSize: 36, color: C.ink }}>Neuer Mitarbeiter</span>
      </div>
      <div style={{ fontFamily: fonts.medium, fontSize: 32, color: C.dim, marginTop: 34 }}>Bruttogehalt / Monat</div>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 124, color: C.ink, letterSpacing: "-0.02em", marginTop: 2 }}>3.000 €</div>
    </div>
  );
  const halfStyle = (side: 0 | 1): React.CSSProperties => {
    const dir = side ? 1 : -1;
    let x = dir * 26 * sep, y = 0, r = dir * 2.2 * sep, sc = 1, op = 1;
    if (side) { x += 250 * glide + 700 * gone; y += 150 * glide; r += 4 * glide; sc = 1 - 0.12 * glide; op = 1 - gone; }
    return { position: "absolute", left: SC.x + side * half, top: SC.y, width: half, height: SC.h, overflow: "hidden", background: C.card, borderRadius: side ? "0 18px 18px 0" : "18px 0 0 18px", boxShadow: shadow, transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${sc})`, opacity: op * (side ? 1 : 1 - dimLeft) };
  };
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translateX(${shake}px)` }}>
      {/* text hook, fully visible at frame 0 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 54, display: "flex", justifyContent: "center", fontFamily: fonts.bold, fontSize: 74, color: C.ink, letterSpacing: -1, transform: `scale(${1 + 0.035 * (1 - k(t, 0, 0.5))})` }}>
        Staat zahlt&nbsp;<span style={{ background: C.orange, color: "#FFF", borderRadius: 14, padding: "0 16px" }}>50 %</span>&nbsp;Gehalt
      </div>
      {/* full card until the cut separates it */}
      {[0, 1].map((side) => (
        <div key={side} style={{ ...halfStyle(side as 0 | 1), transform: `${halfStyle(side as 0 | 1).transform} scale(${settle})` }}>
          <div style={{ position: "absolute", left: -side * half, top: 0, opacity: 1 - swap }}><CardFace /></div>
          {/* own content after the split */}
          <div style={{ position: "absolute", inset: 0, padding: "40px 36px", boxSizing: "border-box", opacity: swap }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: side ? C.green : C.dim }}>{side ? "ARBEITSAGENTUR" : "DU ZAHLST"}</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 28, color: C.dim, marginTop: 30 }}>pro Monat</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 88, color: side ? C.green : C.ink, letterSpacing: "-0.03em", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{side ? "1.500" : fmt(roll)}<span style={{ fontSize: 56 }}> €</span></div>
            {side ? <div style={{ marginTop: 36, ...popStyle(t, A.mitarbeiters + 0.15, 8, 0.6) }}><Tag text="ZUSCHUSS" color={C.green} size={22} /></div> : (
              <div style={{ display: "flex", gap: 6, marginTop: 44 }}>
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} style={{ width: 25, height: 25, borderRadius: 6, background: months > i + 0.5 ? C.orange : C.line, transform: `scale(${months > i + 0.5 && months < i + 1.6 ? 1.18 : 1})` }} />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {/* single card until the cut (no seam between the two halves) */}
      {t < cut + 0.14 ? (
        <div style={{ position: "absolute", left: SC.x, top: SC.y, width: SC.w, height: SC.h, background: C.card, borderRadius: 18, boxShadow: shadow, overflow: "hidden", transform: `scale(${settle})` }}><CardFace /></div>
      ) : null}
      {/* dashed cut line */}
      {t > cut - 0.02 && sep < 0.6 ? (
        <svg width={20} height={SC.h + 60} style={{ position: "absolute", left: SC.x + half - 10, top: SC.y - 30, overflow: "visible" }}>
          <line x1={10} y1={0} x2={10} y2={(SC.h + 60) * k(t, cut, 0.14)} stroke={C.orange} strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" />
        </svg>
      ) : null}
      {/* 12 Monate badge */}
      {t > A.jahr ? (
        <div style={{ position: "absolute", left: SC.x - 24, top: SC.y - 40, transform: `rotate(-6deg) scale(${badge})`, transformOrigin: "50% 50%", zIndex: 20 }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, letterSpacing: "0.1em", color: "#FFF", background: C.ink, borderRadius: 12, padding: "10px 18px 10px 22px", boxShadow: "0 10px 24px rgba(0,0,0,0.22)" }}>12 MONATE</div>
        </div>
      ) : null}
      {/* "verschenkt" tag where the AA card left */}
      <div style={{ position: "absolute", left: 560, top: 660, ...popStyle(t, A.geld - 0.25, 10, 0.5), opacity: k(t, A.geld - 0.25, 0.12) * (1 - k(t, calAt - 0.1, 0.15)) }}>
        <Tag text="1.500 € / MONAT VERSCHENKT" color={C.red} size={24} />
      </div>
      {/* calendar: one day too late */}
      {t > calAt ? (
        <Card style={{ left: 575, top: 230, width: 420, height: 340, padding: "24px 28px", boxSizing: "border-box", ...popStyle(t, calAt, 22, 0.85) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 28, color: C.ink }}>März</span>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: "0.12em", color: C.dim }}>KALENDER</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 14 }}>
            {Array.from({ length: 14 }, (_, i) => {
              const d = i + 1;
              const start = d === 1, antrag = d === 2;
              return (
                <div key={i} style={{ height: 46, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.semibold, fontSize: 22, color: start ? "#FFF" : antrag ? C.red : C.ink, background: start ? C.ink : antrag ? C.redSoft : "#F6F5F1", border: antrag ? `2.5px solid ${C.red}` : "none" }}>{d}</div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <Tag text="1. START" color={C.ink} size={18} />
            <Tag text="2. ANTRAG" color={C.red} size={18} />
          </div>
        </Card>
      ) : null}
      <Stamp t={t} at={stampAt} text="ZU SPÄT" size={66} style={{ left: 785, top: 470 }} />
    </div>
  );
};

// ---------- Scene B: what it is (dahinter - wer) ----------
const SceneWas: React.FC<{ t: number }> = ({ t }) => {
  const s = A.dahinter;
  const title1 = "Eingliederungs-", title2 = "zuschuss";
  const tA = A.eglz - 0.05, tB = A.eglz + 0.75;
  const full = title1 + title2;
  const shown = typed(full, t, tA, tB);
  const l1 = shown.slice(0, title1.length), l2 = shown.slice(title1.length);
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 40, display: "flex", gap: 14 }}>
        <div style={popStyle(t, s, 10, 0.6)}><LabelChip text="Förderung" size={24} /></div>
        <div style={popStyle(t, A.agentur1, 10, 0.6)}><LabelChip text="Arbeitsagentur" dot={C.green} size={24} /></div>
      </div>
      <Card style={{ left: 90, top: 118, width: 900, height: 640, overflow: "hidden", ...popStyle(t, s, 26, 0.94) }}>
        <div style={{ height: 58, background: "#F6F5F1", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 28px", fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: C.dim, justifyContent: "space-between" }}>
          <span>ANTRAG · ARBEITGEBER</span><span>SEITE 1/4</span>
        </div>
        <div style={{ padding: "30px 40px" }}>
          <div style={{ fontFamily: fonts.medium, fontSize: 28, color: C.dim }}>Antrag auf</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 72, lineHeight: 1.05, color: C.ink, letterSpacing: -1, minHeight: 152, marginTop: 4 }}>
            {l1}{l2 ? <br /> : null}{l2 ? <span style={{ color: C.orange }}>{l2}</span> : null}
            <span style={{ display: "inline-block", width: 5, height: 64, background: C.orange, verticalAlign: "-8px", marginLeft: 4, opacity: t < tB + 0.1 || Math.floor(t * 3) % 2 ? 1 : 0 }} />
          </div>
          {[["Arbeitgeber", "Dein Betrieb"], ["Arbeitnehmer", "Neuer Mitarbeiter"], ["Beginn", "vor Arbeitsbeginn beantragen"]].map(([l, v], i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: i ? 18 : 34, ...popStyle(t, A.eglz + 0.5 + i * 0.12, 8, 0.96) }}>
              <span style={{ width: 230, fontFamily: fonts.medium, fontSize: 28, color: C.dim }}>{l}</span>
              <span style={{ flex: 1, height: 66, borderRadius: 12, border: `2.5px solid ${i === 2 ? C.orange : C.line}`, display: "flex", alignItems: "center", padding: "0 20px", fontFamily: fonts.semibold, fontSize: 29, color: C.ink }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>
      <Stamp t={t} at={A.sgb} text="§ 88 SGB III" color={C.orange} size={44} rot={-6} style={{ left: 820, top: 196 }} />
    </>
  );
};

// ---------- Scene C: who counts (wer - ob) ----------
const CRIT = [
  { l: "Länger ohne Job", v: "z. B. 14 Monate", at: () => A.laenger, icon: "cal" },
  { l: "Älter", v: "z. B. 58 Jahre", at: () => A.aelter, icon: "age" },
  { l: "Kein Abschluss", v: "ohne Berufsabschluss", at: () => A.keinen, icon: "cap" },
];
const CritIcon: React.FC<{ kind: string }> = ({ kind }) => (
  <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    {kind === "cal" ? <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></> : kind === "age" ? <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></> : <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></>}
  </svg>
);
const SceneWer: React.FC<{ t: number }> = ({ t }) => {
  const s = A.wer;
  const hl = k(t, A.oft, 0.3);
  const tagAt = A.aussortiert - 0.05;
  const strike = k(t, A.haettest - 0.05, 0.25, Easing.inOut(Easing.quad));
  const ok = A.haettest + 0.25;
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 34, fontFamily: fonts.bold, fontSize: 66, color: C.ink, letterSpacing: -1, ...popStyle(t, s, 12, 0.8), transformOrigin: "0% 50%" }}>
        Wer <span style={{ background: C.ink, color: "#FFF", borderRadius: 14, padding: "0 16px" }}>zählt?</span>
      </div>
      {/* candidate card */}
      <Card style={{ left: 70, top: 160, width: 400, height: 590, padding: "30px 30px", boxSizing: "border-box", ...popStyle(t, A.bewerber - 0.05, 24, 0.9), boxShadow: `${shadow}, 0 0 0 ${4 * hl}px ${C.orange}` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 17, letterSpacing: "0.14em", color: C.dim }}>BEWERBUNG</div>
        <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg,#E7E2D8,#D6CFC2)", marginTop: 22, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#C4BBAC", marginBottom: -20 }} />
        </div>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, color: C.ink, marginTop: 20 }}>Kandidat 03</div>
        <div style={{ fontFamily: fonts.regular, fontSize: 22, color: C.dim, marginTop: 4 }}>Lager & Logistik</div>
        {[0, 1, 2].map((i) => <div key={i} style={{ height: 14, borderRadius: 7, background: "#EFEDE7", width: `${[92, 76, 84][i]}%`, marginTop: i ? 12 : 26 }} />)}
        <div style={{ marginTop: 26, ...popStyle(t, A.schwerer, 8, 0.6) }}><Tag text="SCHWER VERMITTELBAR" color={C.dim} size={16} /></div>
        {t > tagAt ? (
          <div style={{ position: "absolute", left: 200, top: 300, transform: `translate(-50%,-50%) rotate(-8deg) scale(${interpolate(t, [tagAt, tagAt + 0.22], [1.6, 1], { ...clamp, easing: Easing.out(Easing.back(2)) })})`, opacity: k(t, tagAt, 0.07) }}>
            <div style={{ position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 40, letterSpacing: "0.1em", color: C.red, border: `5px solid ${C.red}`, borderRadius: 12, padding: "8px 18px 8px 22px", background: "rgba(255,255,255,0.92)", opacity: 1 - 0.45 * strike }}>
              AUSSORTIERT
              <div style={{ position: "absolute", left: -10, top: "50%", height: 7, width: `${strike * 112}%`, background: C.ink, borderRadius: 4, transform: "rotate(-3deg)" }} />
            </div>
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 30, bottom: 30, ...popStyle(t, ok, 10, 0.5) }}><Tag text="✓ ZUSCHUSS MÖGLICH" color={C.green} size={19} /></div>
      </Card>
      {/* criteria cards */}
      {CRIT.map((c, i) => {
        const a = c.at() - 0.08;
        const f = k(t, a, 0.34, Easing.out(Easing.cubic));
        return (
          <Card key={c.l} style={{ left: 500 + (1 - f) * 420, top: 170 + i * 192, width: 510, height: 168, padding: "0 30px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 24, opacity: k(t, a, 0.12), transform: `rotate(${(1 - f) * 6}deg)` }}>
            <span style={{ width: 76, height: 76, borderRadius: 18, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><CritIcon kind={c.icon} /></span>
            <div>
              <div style={{ fontFamily: fonts.bold, fontSize: 36, color: C.ink }}>{c.l}</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 23, color: C.dim, marginTop: 4 }}>{c.v}</div>
            </div>
            <span style={{ marginLeft: "auto", width: 40, height: 40, borderRadius: 10, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", opacity: k(t, a + 0.25, 0.15) }}><Check size={28} p={k(t, a + 0.25, 0.25)} /></span>
          </Card>
        );
      })}
    </>
  );
};

// ---------- Scene D: Claude checks the candidate (ob - wie) ----------
const CD = { x: 70, y: 100, w: 940, h: 700 };
const FileChip: React.FC<{ name: string; kind: string; style?: React.CSSProperties }> = ({ name, kind, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#FFF", border: `2px solid ${C.line}`, borderRadius: 12, padding: "8px 16px 8px 10px", boxShadow: "0 6px 14px rgba(20,20,20,0.07)", ...style }}>
    <span style={{ width: 38, height: 44, borderRadius: 7, background: C.orange, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 12, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6, boxSizing: "border-box" }}>PDF</span>
    <div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 22, color: C.ink, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontFamily: fonts.regular, fontSize: 16, color: C.dim }}>{kind}</div>
    </div>
  </div>
);
const SceneClaude: React.FC<{ t: number }> = ({ t }) => {
  const s = A.ob;
  const f1 = A.lebenslauf - 0.05, f2 = A.stellenanzeige - 0.05;
  const PROMPT = "Zählt er für den Zuschuss?";
  const sendAt = A.claude2 - 0.12;
  const sent = t >= sendAt + 0.05;
  const inputY = CD.y + CD.h - 16 - 50;
  const sendP: [number, number] = [CD.x + CD.w - 22 - 10 - 26, inputY];
  const r1 = A.sagt + 0.05, r2 = A.agentur2 - 0.1, r3 = A.antrag - 0.1;
  const flyIn = (a: number) => { const f = k(t, a, 0.35, Easing.out(Easing.cubic)); return { opacity: k(t, a, 0.1), transform: `translate(${(1 - f) * -60}px, ${(1 - f) * -220}px) rotate(${(1 - f) * -10}deg)` }; };
  const thinking = t > sendAt && t < r1 + 0.1;
  return (
    <>
      <div style={{ position: "absolute", left: CD.x, top: 30, display: "flex", gap: 14 }}>
        <div style={popStyle(t, s, 10, 0.6)}><LabelChip text="Claude" size={24} /></div>
        <div style={popStyle(t, A.prueft, 10, 0.6)}><LabelChip text="Förder-Check" dot={C.green} size={24} /></div>
      </div>
      <Card style={{ left: CD.x, top: CD.y, width: CD.w, height: CD.h, overflow: "hidden", ...popStyle(t, s, 24, 0.95) }}>
        <div style={{ height: 56, background: "#F6F5F1", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: fonts.semibold, fontSize: 22, color: "#6E6B65" }}>
          <ClaudeMark size={20} />Claude
        </div>
        {/* empty state before the files */}
        {!sent ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: 1 - k(t, f1, 0.2) * 0.6 }}>
            <div style={{ transform: `rotate(${(t - s) * 40}deg)` }}><ClaudeMark size={64} /></div>
            <div style={{ fontFamily: fonts.medium, fontSize: 40, color: C.ink, letterSpacing: -0.3 }}>Passt dein Kandidat?</div>
          </div>
        ) : null}
        {/* user message after send */}
        {sent ? (
          <div style={{ position: "absolute", right: 26, top: 74, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, ...popStyle(t, sendAt + 0.05, 12, 0.92) }}>
            <div style={{ display: "flex", gap: 10 }}>
              <FileChip name="Lebenslauf.pdf" kind="Kandidat 03" />
              <FileChip name="Stellenanzeige.pdf" kind="Lagerist (m/w/d)" />
            </div>
            <div style={{ background: "#F1EFEA", borderRadius: 16, padding: "12px 20px", fontFamily: fonts.medium, fontSize: 26, color: C.ink }}>{PROMPT}</div>
          </div>
        ) : null}
        {/* Claude answer */}
        {sent ? (
          <div style={{ position: "absolute", left: 26, top: 238, right: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ transform: `rotate(${thinking ? (t - sendAt) * 260 : 0}deg)` }}><ClaudeMark size={34} /></div>
              {thinking ? <span style={{ fontFamily: fonts.medium, fontSize: 24, color: C.dim }}>Liest Lebenslauf und Anzeige …</span> : null}
            </div>
            {[
              { at: r1, head: "Passt", col: C.green, body: "14 Monate ohne Job, kein Berufsabschluss", icon: "check" },
              { at: r2, head: "Das sagst du der Agentur", col: C.ink, body: "„Längere Arbeitslosigkeit, braucht Einarbeitung“", icon: "talk" },
              { at: r3, head: "Das gehört in den Antrag", col: C.orange, body: "Einarbeitungsplan · Gehalt · Startdatum", icon: "doc" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", marginTop: i ? 14 : 12, padding: "14px 18px", borderRadius: 14, background: i === 0 ? C.greenSoft : "#F8F7F3", border: `2px solid ${i === 0 ? "rgba(30,158,87,0.35)" : C.line}`, ...popStyle(t, b.at, 14, 0.94) }}>
                <span style={{ width: 40, height: 40, borderRadius: 10, background: b.col, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", marginTop: 2 }}>
                  {b.icon === "check" ? <Check size={28} p={k(t, b.at + 0.1, 0.25)} /> : <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 20, color: "#FFF" }}>{i + 1}</span>}
                </span>
                <div>
                  <div style={{ fontFamily: fonts.bold, fontSize: 29, color: b.col === C.ink ? C.ink : b.col }}>{b.head}</div>
                  <div style={{ fontFamily: fonts.medium, fontSize: 25, color: "#4F4C46", marginTop: 3 }}>{typed(b.body, t, b.at + 0.12, b.at + 0.75)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {/* composer with attachments */}
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 16, height: sent ? 66 : 150, borderRadius: 16, border: `2px solid ${t > f1 - 0.1 && !sent ? C.orange : C.line}`, background: "#FFF", padding: "12px 12px 12px 18px", boxSizing: "border-box" }}>
          {!sent ? (
            <div style={{ display: "flex", gap: 12, height: 64 }}>
              {t > f1 ? <div style={flyIn(f1)}><FileChip name="Lebenslauf.pdf" kind="Kandidat 03" /></div> : null}
              {t > f2 ? <div style={flyIn(f2)}><FileChip name="Stellenanzeige.pdf" kind="Lagerist (m/w/d)" /></div> : null}
            </div>
          ) : null}
          <div style={{ position: "absolute", left: 18, right: 80, bottom: 14, height: 36, display: "flex", alignItems: "center", fontFamily: fonts.medium, fontSize: 26, color: sent || t < f2 + 0.25 ? "#AAA69E" : C.ink }}>
            {sent || t < f2 + 0.25 ? "Antworte Claude …" : <>{typed(PROMPT, t, f2 + 0.25, sendAt - 0.08)}<span style={{ display: "inline-block", width: 3, height: 28, background: C.orange, marginLeft: 2 }} /></>}
          </div>
          <span style={{ position: "absolute", right: 10, bottom: 9, transform: `scale(${1 - 0.18 * press(t, sendAt)})`, width: 48, height: 48, borderRadius: 12, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: fonts.bold, fontSize: 28 }}>↑</span>
        </div>
      </Card>
      <Mascot t={t} targets={[{ at: sendAt, p: () => sendP }]} hold={0.35} />
    </>
  );
};

// ---------- Scene E: how much (wie - wichtig) ----------
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const SceneWieviel: React.FC<{ t: number }> = ({ t }) => {
  const s = A.wie;
  const pA = A.haelfte2 - 0.05, pB = A.haelfte2 + 0.55;
  const pct = interpolate(t, [pA, pB], [0, 50], { ...clamp, easing: Easing.out(Easing.cubic) });
  const land = t > pB ? Math.max(0, 1 - (t - pB) / 0.3) : 0;
  const mA = A.zwoelf - 0.05, mB = A.zwoelf + 0.55;
  const m = interpolate(t, [mA, mB], [0, 12], clamp);
  const sbAt = A.schwerb - 0.05;
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 34, fontFamily: fonts.bold, fontSize: 66, color: C.ink, letterSpacing: -1, ...popStyle(t, s, 12, 0.8), transformOrigin: "0% 50%" }}>
        Wie <span style={{ background: C.orange, color: "#FFF", borderRadius: 14, padding: "0 16px" }}>viel?</span>
      </div>
      {/* percent ring */}
      <Card style={{ left: 70, top: 150, width: 440, height: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...popStyle(t, s + 0.15, 22, 0.9) }}>
        <div style={{ position: "relative", width: 250, height: 250 }}>
          <svg width={250} height={250} viewBox="0 0 250 250" style={{ position: "absolute", inset: 0 }}>
            <circle cx={125} cy={125} r={105} fill="none" stroke={C.line} strokeWidth={22} />
            <circle cx={125} cy={125} r={105} fill="none" stroke={C.orange} strokeWidth={22} strokeLinecap="round" strokeDasharray={660} strokeDashoffset={660 * (1 - pct / 100)} transform="rotate(-90 125 125)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 70, color: C.ink, transform: `scale(${1 + 0.1 * land})`, fontVariantNumeric: "tabular-nums" }}>{Math.round(pct)}%</div>
        </div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: C.dim, marginTop: 14 }}>vom Gehalt</div>
      </Card>
      {/* 12 months */}
      <Card style={{ left: 540, top: 150, width: 470, height: 380, padding: "28px 30px", boxSizing: "border-box", ...popStyle(t, mA - 0.1, 22, 0.9) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: C.dim }}>DAUER</div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: C.ink, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{Math.round(m)} <span style={{ fontSize: 34 }}>Monate</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginTop: 22 }}>
          {MONTHS.map((x, i) => {
            const on = m > i + 0.5;
            return <div key={i} style={{ height: 54, borderRadius: 10, background: on ? C.orange : "#F2F0EB", color: on ? "#FFF" : C.dim, fontFamily: fonts.bold, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on && m < i + 1.8 ? 1.12 : 1})` }}>{x}</div>;
          })}
        </div>
      </Card>
      {/* severe disability */}
      <Card style={{ left: 70, top: 562, width: 940, height: 150, padding: "0 34px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 22, ...popStyle(t, sbAt, 22, 0.92) }}>
        <div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 17, letterSpacing: "0.14em", color: C.dim }}>BEI SCHWERBEHINDERUNG</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 34, color: C.ink, marginTop: 6 }}>sogar mehr und länger</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <div style={popStyle(t, A.mehr - 0.05, 10, 0.5)}><Tag text="BIS 70 %" color={C.orange} size={24} /></div>
          <div style={popStyle(t, A.laenger2 - 0.05, 10, 0.5)}><Tag text="LÄNGER MÖGLICH" color={C.ink} size={24} /></div>
        </div>
      </Card>
    </>
  );
};

// ---------- Scene F: timing (wichtig - komm) ----------
const Node: React.FC<{ label: string; sub: string; dark?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({ label, sub, dark, style, children }) => (
  <div style={{ position: "absolute", width: 280, height: 170, borderRadius: 18, background: dark ? C.ink : C.card, boxShadow: shadow, padding: "22px 22px", boxSizing: "border-box", ...style }}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: dark ? "#BDB9B0" : C.dim }}>{sub}</div>
    <div style={{ fontFamily: fonts.bold, fontSize: 37, color: dark ? "#FFF" : C.ink, marginTop: 8, lineHeight: 1.1 }}>{label}</div>
    {children}
  </div>
);
const SceneZeit: React.FC<{ t: number }> = ({ t }) => {
  const s = A.wichtig;
  const n1 = A.beantragen - 0.1, n2 = A.bevor - 0.05, n3 = A.anfaengt - 0.05;
  const frame = k(t, n1 + 0.25, 0.3);
  const row2 = A.hat - 0.05;
  const xAt = A.geld2 - 0.05;
  const shake = shakeAt(t, xAt, 5);
  const xs = [60, 400, 740];
  const lineQ = (a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translateX(${shake}px)` }}>
      <div style={{ position: "absolute", left: 70, top: 34, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={popStyle(t, s, 10, 0.6)}><LabelChip text="Wichtig" dot={C.red} size={26} /></div>
        <div style={{ fontFamily: fonts.bold, fontSize: 52, color: C.ink, letterSpacing: -0.8, ...popStyle(t, A.zeitpunkt - 0.05, 10, 0.85), transformOrigin: "0% 50%" }}>Der Zeitpunkt</div>
      </div>
      {/* row 1: right order */}
      <div style={{ position: "absolute", left: 70, top: 128, ...popStyle(t, n1, 8, 0.6) }}><Tag text="SO RICHTIG" color={C.green} size={18} /></div>
      {[0, 1].map((i) => (
        <div key={i} style={{ position: "absolute", left: xs[i] + 280, top: 274, width: 60 * lineQ([n1, n2][i] + 0.2, [n2, n3][i]), height: 6, background: C.ink, borderRadius: 3 }} />
      ))}
      <Node label="Antrag" sub="1 · ZUERST" style={{ left: xs[0], top: 190, ...popStyle(t, n1, 18, 0.85), boxShadow: `${shadow}, 0 0 0 ${6 * frame}px ${C.red}` }} />
      <Node label="Unterschrift" sub="2 · VERTRAG" style={{ left: xs[1], top: 190, ...popStyle(t, n2, 18, 0.85) }} />
      <Node label="Erster Arbeitstag" sub="3 · START" dark style={{ left: xs[2], top: 190, ...popStyle(t, n3, 18, 0.85) }} />
      <div style={{ position: "absolute", left: xs[0] + 6, top: 376, ...popStyle(t, n1 + 0.3, 8, 0.5) }}><Tag text="ANTRAG ZUERST" color={C.red} size={20} /></div>
      {/* row 2: wrong order */}
      <div style={{ position: "absolute", left: 60, top: 452, ...popStyle(t, row2, 8, 0.6) }}><Tag text="ZU SPÄT" color={C.red} size={18} /></div>
      <div style={{ position: "absolute", left: xs[0] + 280, top: 584, width: 400 * lineQ(row2 + 0.15, A.angefangen + 0.2), height: 6, background: "#CFCAC0", borderRadius: 3 }} />
      <Node label="Erster Arbeitstag" sub="START" dark style={{ left: xs[0], top: 500, ...popStyle(t, row2, 18, 0.85) }} />
      <Node label="Antrag" sub="DANACH" style={{ left: xs[2], top: 500, ...popStyle(t, A.angefangen, 18, 0.85), opacity: k(t, A.angefangen, 0.12) * (1 - 0.35 * k(t, xAt, 0.2)) }}>
        {t > xAt ? (
          <div style={{ position: "absolute", right: -18, top: -18, width: 64, height: 64, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(t, [xAt, xAt + 0.22], [1.7, 1], { ...clamp, easing: Easing.out(Easing.back(2)) })})`, boxShadow: "0 8px 18px rgba(229,72,77,0.35)" }}><Cross size={40} p={k(t, xAt, 0.2)} /></div>
        ) : null}
      </Node>
      <div style={{ position: "absolute", left: 465, top: 545, ...popStyle(t, A.weg - 0.05, 10, 0.5) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, color: C.red, background: "#FFF", border: `4px solid ${C.red}`, borderRadius: 14, padding: "6px 20px", boxShadow: shadow }}>0 €</div>
      </div>
    </div>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: A.dahinter, origin: "50% 50%", El: SceneHook },
  { from: A.dahinter, to: A.wer, origin: "50% 45%", El: SceneWas },
  { from: A.wer, to: A.ob, origin: "50% 50%", El: SceneWer },
  { from: A.ob, to: A.wie, origin: "50% 60%", El: SceneClaude },
  { from: A.wie, to: A.wichtig, origin: "50% 50%", El: SceneWieviel },
  { from: A.wichtig, to: 999, origin: "50% 45%", El: SceneZeit },
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
          // JetBrains Mono: advance 0.6 em + 0.14 em tracking -> fixed char width; one sliding #111 pill behind the active word.
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

// ---------- v2 CTA: the real guide PDF scrolls through fast (Henri 2026-10-13) ----------
// Pages = PNGs of lohnzuschuss-guidebook.pdf (public/ez-guide). Motion blur = equal-weight average of
// SAMPLES positions across the shutter (layer k gets opacity 1/k), so it only smears while it moves.
const PAGES = [1, 2, 3, 4, 5].map((n) => staticFile(`ez-guide/p${n}.png`));
const PDF = { left: 120, top: 640, w: 840, h: 1220, bar: 76, pw: 780, ph: Math.round((780 * 2263) / 1600), gap: 26 };
const PITCH = PDF.ph + PDF.gap;
export const PDF_IN = A.zuschuss + 0.44; // on "und ich schick dir …"
export const PDF_OUT = A.unterschrift + 0.65;
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
        <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: "#FFF", whiteSpace: "nowrap" }}>Lohnzuschuss – Guidebook.pdf</div>
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
// avatar framing: facefocus.py on tightened.mp4 (panel 0.427): focus 0.511/0.599, faceTop_min 1094, chin_max 1656 at faceAt 0.5
const FOCUS = { x: 0.511, y: 0.599, scale: 1.0, faceAt: 0.54 };
const CTA = A.komm - 0.12;
const SPLIT_SRC_TOP = 430; // source row that sits on the seam in the split
const CHEST_Y = 1540; // full frame: caption centre on chest/shoulder height (chin ~1440 in the source)
export const EingliederungOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = camera(t, scene.from, Math.min(scene.to, CTA));
  const dx = Math.sin(t * 0.6) * 6, dy = Math.cos(t * 0.45) * 5;
  const full = k(t, CTA, 0.42, Easing.inOut(Easing.cubic));
  const s = FOCUS.scale, vw = W * s, vh = H * s, h = H - PH;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  // Henri: not too close in the split - hair top (~source y 640) gets ~210 px air under the seam, shoulders + mic hand in frame.
  const vTopSplit = Math.min(PH, Math.max(H - vh, PH - SPLIT_SRC_TOP * s));
  const vTop = vTopSplit * (1 - full);
  const push = 1 + 0.05 * k(t, CTA + 0.45, 2.6, Easing.inOut(Easing.sin));
  const El = scene.El;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${push})`, transformOrigin: "50% 45%" }}>
        <OffthreadVideo src={staticFile("render-fpn-eingliederung-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {full < 1 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * full, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
          </div>
        </div>
      ) : null}
      <PdfScroll t={t} />
      {/* CTA: trigger-word pill above the head */}
      {t > A.zuschuss - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.zuschuss - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 26px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>ZUSCHUSS</div>
          </div>
          <div style={popStyle(t, A.checkliste - 0.05, 10, 0.6)}><LabelChip text="Checkliste · vor der Unterschrift" dot={C.green} size={28} /></div>
        </div>
      ) : null}
      <SeamCaption t={t} y={PH + (CHEST_Y - PH) * full} />
    </AbsoluteFill>
  );
};
