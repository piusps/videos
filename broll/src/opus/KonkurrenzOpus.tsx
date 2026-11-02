import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-konkurrenz-check/captions.json";

// FP-N "Konkurrenz-Check mit Claude" (Henri 2026-10-12), opusjake style like KontoauszugOpus: split from frame 0,
// B-Roll panel on top (0-820 px, off-white grid canvas, floating UI cards, one stamp as payoff), avatar below,
// captions as Claude-orange pill on the seam with a black pill around the active word (Henri 19:40).
// All scene timings are anchored to the word timings of the tightened timeline (captions.json), so the
// composition follows the voice. Speed ramp 1.15x, music and SFX are applied afterwards.

const FPS = 25;
const W = 1080;
const PH = 820; // panel height = seam

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const KK_END = LAST_END + 0.55;
export const KK_FRAMES = Math.round(KK_END * FPS);

// ---------- word anchors ----------
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
/** start (or end) of the n-th word that equals `word` (or starts with it when `prefix`). */
const at = (word: string, n = 0, end = false, prefix = false) => {
  const m = WORDS.filter((x) => (prefix ? x.w.startsWith(word) : x.w === word));
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  gegoogelt: at("gegoog", 0, false, true),
  konkurrenten: at("konkurrent", 0, false, true),
  angefragt: at("angefragt"),
  claude1: at("claude", 0),
  warum1: at("warum", 0),
  bei: at("bei", 0),
  preis: at("preis", 0),
  beiDir: at("bei", 1),
  nicht: at("nicht"),
  den: at("den", 0),
  website: at("website", 0),
  stadt: at("stadt", 0),
  stadtEnd: at("stadt", 0, true),
  sucht: at("sucht"),
  leistung: at("leistung"),
  auftaucht: at("auftaucht"),
  liest: at("liest"),
  genau: at("genau"),
  zurueck: at("zurück"),
  tabelle: at("tabelle"),
  bewertungen: at("bewertungen"),
  fotos: at("fotos"),
  schnell: at("schnell"),
  zeile: at("zeile"),
  vorne: at("vorne"),
  dann1: at("dann", 1),
  ersten: at("ersten"),
  startseite: at("startseite"),
  neu: at("neu"),
  drei: at("drei"),
  warum2: at("warum", 1),
  du2: at("du", 1),
  speicher: at("speicher"),
  liste1: at("liste", 0),
  website2: at("website", 1),
  komm: at("kommentier", 0, false, true),
  liste2: at("liste", 1),
  schick: at("schick"),
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

// ---------- Scene A: search + results, hook (0 - claude1) ----------
const QUERY = "maler augsburg";
const RESULTS = [
  { n: "Malerbetrieb Kraus", r: 4.9, c: 148, info: "ab 490 €  ·  Antwort in 24 h", you: false },
  { n: "Dein Betrieb", r: 4.6, c: 12, info: "Preis auf Anfrage", you: true },
  { n: "Farbwerk Lindner", r: 4.7, c: 63, info: "ab 22 €/m²  ·  Fotos ansehen", you: false },
];
const SA = { left: 70, top: 262, w: 940, barH: 84, rowTop: 372, rowH: 128 };
const rowCenter = (i: number): [number, number] => [SA.left + 560, SA.rowTop + i * SA.rowH + 44];
const SceneSearch: React.FC<{ t: number }> = ({ t }) => {
  const typeA = 0, typeB = 0.5;
  const q = QUERY.slice(0, Math.max(2, Math.round(interpolate(t, [typeA, typeB], [2, QUERY.length], clamp))));
  const resAt = (i: number) => 0.55 + i * 0.16;
  const hoverAt = Math.min(A.gegoogelt + 0.05, A.konkurrenten - 0.6);
  const clickAt = A.angefragt + 0.1;
  const targets: Tgt[] = [
    { at: hoverAt, p: () => rowCenter(1), click: false },
    { at: clickAt, p: () => rowCenter(0) },
  ];
  const line2 = A.angefragt - 0.05;
  const sent = k(t, clickAt, 0.2);
  return (
    <>
      {/* text hook, fully visible at frame 0 */}
      <div style={{ position: "absolute", left: 70, top: 58, fontFamily: fonts.bold, fontSize: 76, lineHeight: 1.06, color: C.ink, letterSpacing: -1 }}>
        <div style={{ transform: `scale(${1 + 0.04 * (1 - k(t, 0, 0.5))})`, transformOrigin: "0% 50%" }}>
          Gegoogelt: <span style={{ background: C.ink, color: "#FFF", borderRadius: 14, padding: "0 16px" }}>dich.</span>
        </div>
        <div style={{ marginTop: 14, ...popStyle(t, line2, 16, 0.6), transformOrigin: "0% 50%" }}>
          Angefragt: <span style={{ background: C.orange, color: "#FFF", borderRadius: 14, padding: "0 16px" }}>ihn.</span>
        </div>
      </div>
      {/* search field */}
      <Card style={{ left: SA.left, top: SA.top, width: SA.w, height: SA.barH, borderRadius: 999, display: "flex", alignItems: "center", gap: 18, padding: "0 34px", boxSizing: "border-box" }}>
        <Magnifier size={34} />
        <span style={{ fontFamily: fonts.medium, fontSize: 38, color: C.ink }}>
          {q}
          <span style={{ display: "inline-block", width: 3, height: 38, background: C.ink, verticalAlign: "-6px", marginLeft: 3, opacity: t < 0.6 || Math.floor(t * 3) % 2 === 0 ? 1 : 0 }} />
        </span>
        <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: C.dim }}>SUCHE</span>
      </Card>
      {/* results */}
      {RESULTS.map((r, i) => {
        const a = resAt(i);
        const hov = r.you ? k(t, hoverAt, 0.15) * (1 - k(t, clickAt - 0.3, 0.2)) : 0;
        const isSent = i === 0 ? sent : 0;
        const dim = r.you ? k(t, clickAt + 0.15, 0.25) : 0;
        return (
          <Card key={i} style={{ left: SA.left, top: SA.rowTop + i * SA.rowH, width: SA.w, height: SA.rowH - 18, padding: "16px 30px", boxSizing: "border-box", ...popStyle(t, a, 26, 0.9), boxShadow: `${shadow}, 0 0 0 ${3 * Math.max(hov, isSent)}px ${isSent > 0.1 ? C.green : C.orange}`, background: isSent > 0.1 ? `rgba(230,245,236,${isSent})` : "#FFF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: C.link, opacity: 1 - 0.45 * dim }}>{r.n}</span>
              {r.you ? <Tag text="DU" color={C.ink} size={16} style={{ opacity: k(t, hoverAt, 0.15) }} /> : null}
              {i === 0 ? <Tag text="ANGEFRAGT ✓" color={C.green} size={17} style={{ marginLeft: "auto", ...popStyle(t, clickAt + 0.08, 8, 0.5) }} /> : null}
              {r.you ? <Tag text="0 ANFRAGEN" color={C.red} size={17} style={{ marginLeft: "auto", ...popStyle(t, clickAt + 0.3, 8, 0.5) }} /> : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8, fontFamily: fonts.regular, fontSize: 24, color: "#5F5C55", opacity: 1 - 0.45 * dim }}>
              <Stars n={r.r} size={22} />
              <span style={{ fontFamily: fonts.medium }}>{r.r.toLocaleString("de-DE")} ({r.c})</span>
              <span>·</span>
              <span style={{ color: r.you ? C.dim : C.ink }}>{r.info}</span>
            </div>
          </Card>
        );
      })}
      <Mascot t={t} targets={targets} hold={1.5} />
    </>
  );
};

// ---------- Scene B: "Claude zeigt dir, warum." (claude1 - bei) ----------
const SceneWhy: React.FC<{ t: number }> = ({ t }) => {
  const s = A.claude1;
  const ans = "Ich vergleiche deine Seite mit seiner.";
  return (
    <>
      <Card style={{ left: 70, top: 120, width: 940, height: 600, overflow: "hidden", ...popStyle(t, s, 20, 0.94) }}>
        <div style={{ height: 60, background: "#F6F5F1", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: fonts.semibold, fontSize: 24, color: "#6E6B65", borderRadius: "18px 18px 0 0" }}>
          <ClaudeMark size={22} />Claude
        </div>
        <div style={{ position: "absolute", right: 30, top: 100, maxWidth: 640, background: "#F1EFEA", borderRadius: 20, padding: "22px 28px", fontFamily: fonts.medium, fontSize: 38, color: C.ink, ...popStyle(t, s, 16, 0.92) }}>
          Warum fragen die bei <b>ihm</b> an?
        </div>
        <div style={{ position: "absolute", left: 30, top: 270, display: "flex", gap: 18, alignItems: "flex-start", ...popStyle(t, s + 0.25, 14, 0.9) }}>
          <div style={{ transform: `rotate(${(t - s) * 160}deg)` }}><ClaudeMark size={56} /></div>
          <div style={{ fontFamily: fonts.medium, fontSize: 40, lineHeight: 1.3, color: C.ink, maxWidth: 760 }}>
            {typed(ans, t, s + 0.3, A.bei - 0.1)}
            <span style={{ display: "inline-block", width: 3, height: 40, background: C.orange, verticalAlign: "-6px", marginLeft: 3 }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 30, top: 470, display: "flex", gap: 16 }}>
          {["Preis", "Bewertungen", "Fotos", "Kontakt"].map((x, i) => (
            <div key={x} style={popStyle(t, A.warum1 - 0.1 + i * 0.08, 10, 0.6)}><Tag text={x.toUpperCase()} color={i % 2 ? C.ink : C.orange} size={20} /></div>
          ))}
        </div>
      </Card>
    </>
  );
};

// ---------- Scene C: price vs. no price + inquiry counters (bei - den) ----------
const SitePreview: React.FC<{ name: string; hue: string; price: React.ReactNode; style?: React.CSSProperties; children?: React.ReactNode }> = ({ name, hue, price, style, children }) => (
  <Card style={{ width: 450, height: 420, ...style }}>
    <BrowserBar label={name} />
    <div style={{ padding: "18px 22px" }}>
      <WallPhoto w={406} h={150} hue={hue} />
      <div style={{ fontFamily: fonts.bold, fontSize: 30, color: C.ink, marginTop: 14 }}>{name}</div>
      <div style={{ fontFamily: fonts.regular, fontSize: 20, color: C.dim, marginTop: 2 }}>Malerarbeiten · Augsburg</div>
      <div style={{ marginTop: 14, position: "relative" }}>{price}</div>
    </div>
    {children}
  </Card>
);
const ScenePreis: React.FC<{ t: number }> = ({ t }) => {
  const s = A.bei;
  const circ = k(t, A.preis, 0.45, Easing.inOut(Easing.quad));
  const bad = k(t, A.nicht - 0.05, 0.25);
  const count = Math.floor(interpolate(t, [A.preis + 0.2, A.den - 0.1], [0, 14], { ...clamp, easing: Easing.out(Easing.quad) }));
  const shake = bad > 0 && t < A.nicht + 0.4 ? Math.sin(t * 70) * 5 * (1 - bad) : 0;
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 44, ...popStyle(t, s, 10, 0.6) }}><LabelChip text="Bei ihm" dot={C.green} size={26} /></div>
      <div style={{ position: "absolute", left: 560, top: 44, ...popStyle(t, A.beiDir, 10, 0.6) }}><LabelChip text="Bei dir" dot={C.red} size={26} /></div>
      <SitePreview name="Malerbetrieb Kraus" hue="#C9D8C5" style={{ left: 70, top: 120, ...popStyle(t, s, 24, 0.92) }}
        price={
          <span style={{ position: "relative", display: "inline-block", fontFamily: MONO, fontWeight: 800, fontSize: 44, color: C.green, padding: "4px 14px" }}>
            ab 490 €
            <svg width={290} height={96} viewBox="0 0 290 96" style={{ position: "absolute", left: -30, top: -18, overflow: "visible" }}>
              <ellipse cx={145} cy={48} rx={138} ry={42} fill="none" stroke={C.green} strokeWidth={5} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - circ)} transform="rotate(-4 145 48)" />
            </svg>
          </span>
        } />
      <SitePreview name="Dein Betrieb" hue="#D8CFC5" style={{ left: 560 + shake, top: 120, ...popStyle(t, A.beiDir - 0.15, 24, 0.92) }}
        price={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12, fontFamily: fonts.semibold, fontSize: 30, color: bad > 0.5 ? C.red : C.dim, background: `rgba(253,232,232,${bad})`, border: `3px solid rgba(229,72,77,${bad})`, borderRadius: 10, padding: "8px 14px" }}>
            Preis auf Anfrage
            <span style={{ width: 30, height: 30, borderRadius: 7, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", opacity: bad }}><Cross size={24} p={bad} /></span>
          </span>
        } />
      {/* inquiry counters */}
      {[{ x: 70, v: count, col: C.green, label: "ANFRAGEN", at: A.preis }, { x: 560, v: 0, col: C.red, label: "ANFRAGEN", at: A.nicht }].map((c, i) => (
        <div key={i} style={{ position: "absolute", left: c.x, top: 580, width: 450, display: "flex", justifyContent: "center", ...popStyle(t, c.at, 14, 0.6) }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 22, background: "#FFF", border: `3px solid ${c.col}`, borderRadius: 16, padding: "14px 30px", boxShadow: shadow, fontFamily: MONO }}>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.14em", color: c.col }}>{c.label}</span>
            <span style={{ fontSize: 62, fontWeight: 800, color: i ? C.red : C.ink, fontVariantNumeric: "tabular-nums", transform: `scale(${1 + (i === 0 ? 0.08 * Math.max(0, Math.sin(t * 22)) * (t < A.den - 0.1 ? 1 : 0) : 0)})` }}>{c.v}</span>
          </div>
        </div>
      ))}
    </>
  );
};

// ---------- Scene D: Claude chat with web search (den - zurueck) ----------
const IN1 = "dein-betrieb.de";
const IN2 = "  ·  Augsburg";
const SOURCES = ["Malerbetrieb Kraus", "Farbwerk Lindner", "Maler Sommerfeld", "Malerei Brandt"];
const CD = { x: 70, y: 110, w: 940, h: 690 };
const SceneSearchClaude: React.FC<{ t: number }> = ({ t }) => {
  const s = A.den;
  const sendAt = Math.min(A.stadtEnd + 0.08, A.sucht - 0.1);
  const typed1 = typed(IN1, t, A.website - 0.05, A.website + 0.5);
  const typed2 = typed(IN2, t, A.stadt - 0.1, A.stadtEnd - 0.05);
  const sent = t >= sendAt + 0.05;
  const inputY = CD.y + CD.h - 16 - 31;
  const sendP: [number, number] = [CD.x + CD.w - 22 - 10 - 24, inputY];
  const chipAt = (i: number) => A.auftaucht - 0.35 + i * 0.16;
  const scanA = A.liest + 0.05, scanB = Math.min(A.genau + 0.3, A.zurueck - 0.3);
  const scanQ = interpolate(t, [scanA, scanB], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const found = [
    { l: "PREIS: AB 490 €", c: C.green, q: 0.25 },
    { l: "148 BEWERTUNGEN", c: C.green, q: 0.5 },
    { l: "24 FOTOS", c: C.green, q: 0.75 },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: CD.x, top: 36, display: "flex", gap: 14 }}>
        <div style={popStyle(t, s, 10, 0.6)}><LabelChip text="Claude" size={24} /></div>
        <div style={popStyle(t, s + 0.18, 10, 0.6)}><LabelChip text="Websuche an" dot={C.green} size={24} /></div>
      </div>
      <Card style={{ left: CD.x, top: CD.y, width: CD.w, height: CD.h, overflow: "hidden", ...popStyle(t, s, 24, 0.95) }}>
        <div style={{ height: 56, background: "#F6F5F1", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: fonts.semibold, fontSize: 22, color: "#6E6B65" }}>
          <ClaudeMark size={20} />Claude
        </div>
        {/* user message after send */}
        {sent ? (
          <div style={{ position: "absolute", right: 26, top: 76, background: "#F1EFEA", borderRadius: 16, padding: "14px 22px", fontFamily: fonts.medium, fontSize: 28, color: C.ink, ...popStyle(t, sendAt + 0.05, 12, 0.9) }}>
            {IN1}{IN2} · Maler
          </div>
        ) : null}
        {/* Claude status */}
        {t > A.sucht - 0.15 ? (
          <div style={{ position: "absolute", left: 26, top: 150, display: "flex", alignItems: "center", gap: 14, ...popStyle(t, A.sucht - 0.15, 10, 0.9) }}>
            <div style={{ transform: `rotate(${t < A.auftaucht + 0.4 ? (t - A.sucht) * 200 : 0}deg)` }}><ClaudeMark size={36} /></div>
            <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>{t < chipAt(3) + 0.2 ? "Sucht im Web" : "4 Betriebe in der Nähe gefunden"}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.dim, background: "#F4F3EF", borderRadius: 999, padding: "6px 14px", ...popStyle(t, A.leistung - 0.1, 6, 0.7) }}><Magnifier size={18} />maler augsburg</span>
          </div>
        ) : null}
        {/* source chips */}
        {SOURCES.map((n, i) => {
          const a = chipAt(i);
          const f = k(t, a, 0.32, Easing.out(Easing.cubic));
          const gx = 26 + (i % 2) * 450, gy = 214 + Math.floor(i / 2) * 70;
          return (
            <div key={n} style={{ position: "absolute", left: gx + (1 - f) * 500, top: gy - (1 - f) * 40, opacity: k(t, a, 0.12), transform: `rotate(${(1 - f) * 8}deg)` }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FFF", border: `2px solid ${C.line}`, borderRadius: 12, padding: "10px 18px", boxShadow: "0 8px 18px rgba(20,20,20,0.08)", fontFamily: fonts.semibold, fontSize: 25, color: C.ink, whiteSpace: "nowrap" }}>
                <Globe size={22} color={C.orange} />{n}
              </div>
            </div>
          );
        })}
        {/* page being read */}
        {t > A.liest - 0.2 ? (
          <div style={{ position: "absolute", left: 26, top: 368, width: 888, height: 232, borderRadius: 14, border: `2px solid ${C.line}`, overflow: "hidden", background: "#FFF", ...popStyle(t, A.liest - 0.2, 16, 0.94) }}>
            <BrowserBar label="Malerbetrieb Kraus" />
            <div style={{ display: "flex", gap: 20, padding: "16px 20px" }}>
              <WallPhoto w={230} h={146} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.bold, fontSize: 28, color: C.ink }}>Wände und Fassaden in Augsburg</div>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: C.green, marginTop: 8 }}>ab 490 €</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, fontFamily: fonts.medium, fontSize: 20, color: "#5F5C55" }}><Stars n={4.9} size={20} />4,9 (148)</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  {[0, 1, 2, 3].map((j) => <WallPhoto key={j} w={52} h={36} hue={["#C9D8C5", "#CFD5E2", "#E2D6C5", "#D5E2D9"][j]} />)}
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 50 + scanQ * 180, height: 4, background: C.orange, boxShadow: "0 0 18px 4px rgba(217,119,87,0.55)", opacity: k(t, scanA - 0.05, 0.1) * (1 - k(t, scanB, 0.2)) }} />
            <div style={{ position: "absolute", right: 16, top: 62, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              {found.map((f) => <div key={f.l} style={popStyle(t, scanA + f.q * (scanB - scanA), 6, 0.5)}><Tag text={f.l} color={f.c} size={16} /></div>)}
            </div>
          </div>
        ) : null}
        {/* "genau wie dein Kunde" */}
        <div style={{ position: "absolute", left: 26, top: 612, ...popStyle(t, A.genau, 8, 0.6) }}>
          <Tag text="LIEST WIE DEIN KUNDE" color={C.ink} size={18} />
        </div>
        {/* input */}
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 16, height: 62, borderRadius: 16, border: `2px solid ${t > A.website - 0.1 && !sent ? C.orange : C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px 0 22px", background: "#FFF" }}>
          <span style={{ fontFamily: fonts.medium, fontSize: 27, color: sent || !typed1 ? "#AAA69E" : C.ink }}>
            {sent || !typed1 ? "Antworte Claude …" : <>{typed1}{typed2}<span style={{ display: "inline-block", width: 3, height: 28, background: C.orange, verticalAlign: "-5px", marginLeft: 2 }} /></>}
          </span>
          <span style={{ transform: `scale(${1 - 0.18 * press(t, sendAt)})`, width: 46, height: 46, borderRadius: 12, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: fonts.bold, fontSize: 28 }}>↑</span>
        </div>
      </Card>
      <Mascot t={t} targets={[{ at: sendAt, p: () => sendP }]} hold={0.35} />
    </>
  );
};

// ---------- Scene E: comparison table (zurueck - dann1) ----------
const ROWS = [
  { l: "Preis sichtbar", him: "ab 490 €", you: "auf Anfrage", at: () => A.tabelle + 0.15 },
  { l: "Bewertungen", him: "4,9 ★ (148)", you: "4,6 ★ (12)", at: () => A.bewertungen },
  { l: "Fotos echter Aufträge", him: "24 Fotos", you: "nur Stockfotos", at: () => A.fotos },
  { l: "Erreichbar, 1 Klick", him: "WhatsApp · 24 h", you: "nur Formular", at: () => A.schnell },
];
const TB = { x: 60, y: 104, w: 960, col0: 330, col: 300, head: 64, rowH: 104 };
const SceneTable: React.FC<{ t: number }> = ({ t }) => {
  const s = A.zurueck;
  const redAt = (i: number) => A.zeile + 0.05 + i * 0.16;
  const greenAt = (i: number) => A.vorne - 0.05 + i * 0.1;
  const scanQ = interpolate(t, [A.zeile - 0.05, A.vorne + 0.3], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return (
    <>
      <div style={{ position: "absolute", left: TB.x, top: 34, display: "flex", gap: 14, alignItems: "center" }}>
        <div style={popStyle(t, s, 10, 0.6)}><LabelChip text="Claude" size={24} /></div>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, color: C.ink, ...popStyle(t, s + 0.12, 8, 0.9) }}>Vergleich · Maler Augsburg</div>
      </div>
      <Card style={{ left: TB.x, top: TB.y, width: TB.w, height: TB.head + ROWS.length * TB.rowH + 20, overflow: "hidden", ...popStyle(t, s, 24, 0.95) }}>
        <div style={{ display: "flex", height: TB.head, alignItems: "center", borderBottom: `2px solid ${C.line}`, fontFamily: MONO, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: C.dim }}>
          <span style={{ width: TB.col0, paddingLeft: 28 }}>KRITERIUM</span>
          <span style={{ width: TB.col, paddingLeft: 20, color: C.ink }}>KRAUS</span>
          <span style={{ width: TB.col, paddingLeft: 20, color: C.ink }}>DU</span>
        </div>
        {ROWS.map((r, i) => {
          const a = k(t, r.at() - 0.05, 0.25);
          const red = k(t, redAt(i), 0.22);
          const green = k(t, greenAt(i), 0.22);
          return (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: TB.head + i * TB.rowH, height: TB.rowH, display: "flex", alignItems: "center", borderBottom: i < ROWS.length - 1 ? `1.5px solid ${C.line}` : "none", opacity: a, transform: `translateX(${(1 - a) * 40}px)` }}>
              <span style={{ width: TB.col0, paddingLeft: 28, boxSizing: "border-box", fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>{r.l}</span>
              <span style={{ width: TB.col, height: TB.rowH - 20, margin: "0 0", display: "flex", alignItems: "center", gap: 10, paddingLeft: 20, boxSizing: "border-box", borderRadius: 10, background: `rgba(230,245,236,${green})`, fontFamily: fonts.semibold, fontSize: 27, color: green > 0.5 ? C.green : C.ink }}>
                {r.him}
                {green > 0.05 ? <span style={popStyle(t, greenAt(i), 4, 0.4)}><Tag text="VORNE" color={C.green} size={14} /></span> : null}
              </span>
              <span style={{ width: TB.col - 10, height: TB.rowH - 20, marginLeft: 10, display: "flex", alignItems: "center", gap: 10, paddingLeft: 18, boxSizing: "border-box", borderRadius: 10, background: `rgba(253,232,232,${red})`, border: `3px solid rgba(229,72,77,${red})`, fontFamily: fonts.semibold, fontSize: 27, color: red > 0.5 ? C.red : C.ink }}>
                <span style={{ width: 28, height: 28, borderRadius: 7, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", opacity: red, flex: "none" }}><Cross size={22} p={red} /></span>
                {r.you}
              </span>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: TB.head + scanQ * ROWS.length * TB.rowH - 2, height: 4, background: C.orange, boxShadow: "0 0 18px 4px rgba(217,119,87,0.5)", opacity: k(t, A.zeile - 0.1, 0.1) * (1 - k(t, A.vorne + 0.3, 0.2)) }} />
      </Card>
      <div style={{ position: "absolute", left: 0, right: 0, top: TB.y + TB.head + ROWS.length * TB.rowH + 50, display: "flex", justifyContent: "center", ...popStyle(t, A.vorne + 0.25, 10, 0.6) }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, fontFamily: MONO, fontWeight: 800, fontSize: 26, letterSpacing: "0.12em", color: "#FFF", background: C.red, borderRadius: 12, padding: "12px 22px" }}>4 LÜCKEN BEI DIR</div>
      </div>
    </>
  );
};

// ---------- Scene F: new first sentence + stamp (dann1 - speicher) ----------
const OLD = "Ihr Partner für Qualität und Zuverlässigkeit seit 1998.";
const NEW = "Wände und Fassaden in Augsburg. Festpreis nach einem Termin.";
const SceneSatz: React.FC<{ t: number }> = ({ t }) => {
  const s = A.dann1;
  const hl = k(t, A.ersten, 0.3);
  const strike = k(t, A.neu - 0.25, 0.3, Easing.inOut(Easing.quad));
  const newTxt = typed(NEW, t, A.neu, Math.min(A.drei, A.neu + 1.4));
  const stampAt = Math.min(A.du2, A.warum2 - 0.3);
  const st = t - stampAt;
  const sp = interpolate(t, [stampAt, stampAt + 0.28], [1.7, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
  const shake = st > 0.2 && st < 0.5 ? Math.sin(st * 90) * 4 * (1 - (st - 0.2) / 0.3) : 0;
  const ring = interpolate(t, [A.drei, A.drei + 1.0], [0, 1], clamp);
  const fixes = ["Preis", "Bewertungen", "Fotos", "Kontakt"];
  const greenAt = (i: number) => A.drei + 0.1 + i * 0.12;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, transform: `translateX(${shake}px)` }}>
      <div style={{ position: "absolute", left: 90, top: 36, display: "flex", gap: 14 }}>
        <div style={popStyle(t, s, 10, 0.6)}><LabelChip text="Claude" size={24} /></div>
        <div style={popStyle(t, A.startseite, 10, 0.6)}><LabelChip text="Deine Startseite" dot={C.ink} size={24} /></div>
      </div>
      <Card style={{ left: 90, top: 112, width: 900, height: 430, overflow: "hidden", ...popStyle(t, s, 24, 0.95) }}>
        <BrowserBar label="Dein Betrieb · Startseite" />
        <div style={{ padding: "26px 40px" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: C.dim }}>MALERBETRIEB · AUGSBURG</div>
          <div style={{ position: "relative", display: "inline-block", marginTop: 12, fontFamily: fonts.bold, fontSize: 40, lineHeight: 1.18, color: strike > 0.5 ? "#AAA69E" : C.ink, backgroundImage: `linear-gradient(${C.orangeSoft}, ${C.orangeSoft})`, backgroundRepeat: "no-repeat", backgroundSize: `${hl * (1 - strike) * 100}% 100%` }}>
            {OLD}
            <div style={{ position: "absolute", left: 0, top: "50%", height: 5, width: `${strike * 100}%`, background: C.red, borderRadius: 3 }} />
          </div>
          {newTxt ? (
            <div style={{ marginTop: 18, fontFamily: fonts.bold, fontSize: 44, lineHeight: 1.16, color: C.ink }}>
              <span style={{ background: C.greenSoft, borderRadius: 8, padding: "0 6px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{newTxt}</span>
              <span style={{ display: "inline-block", width: 4, height: 44, background: C.orange, verticalAlign: "-7px", marginLeft: 3, opacity: t < A.drei + 0.2 || Math.floor(t * 3) % 2 ? 1 : 0 }} />
            </div>
          ) : null}
        </div>
      </Card>
      {/* 3-second timer */}
      <div style={{ position: "absolute", right: 70, top: 470, ...popStyle(t, A.drei - 0.05, 12, 0.5), opacity: k(t, A.drei - 0.05, 0.14) * (1 - k(t, stampAt - 0.1, 0.15)) }}>
        <div style={{ position: "relative", width: 128, height: 128, borderRadius: "50%", background: "#FFF", boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={128} height={128} viewBox="0 0 128 128" style={{ position: "absolute", left: 0, top: 0 }}>
            <circle cx={64} cy={64} r={54} fill="none" stroke={C.line} strokeWidth={9} />
            <circle cx={64} cy={64} r={54} fill="none" stroke={C.orange} strokeWidth={9} strokeLinecap="round" strokeDasharray={339} strokeDashoffset={339 * (1 - ring)} transform="rotate(-90 64 64)" />
          </svg>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: C.ink }}>3 s</span>
        </div>
      </div>
      {/* red fields turn green */}
      <div style={{ position: "absolute", left: 90, top: 580, display: "flex", gap: 14 }}>
        {fixes.map((f, i) => {
          const g = k(t, greenAt(i), 0.22);
          return (
            <div key={f} style={{ ...popStyle(t, A.startseite + 0.1 + i * 0.08, 8, 0.6) }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 12, padding: "12px 18px", fontFamily: fonts.semibold, fontSize: 26, color: "#FFF", background: g > 0.5 ? C.green : C.red, transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, g) * Math.PI)})` }}>
                {g > 0.5 ? <Check size={24} p={g} /> : <Cross size={22} />}{f}
              </div>
            </div>
          );
        })}
      </div>
      {st > 0 ? (
        <div style={{ position: "absolute", left: 640, top: 610, transform: `translate(-50%, -50%) rotate(-7deg) scale(${sp})`, opacity: k(t, stampAt, 0.08), zIndex: 20 }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 72, letterSpacing: "0.12em", color: C.orange, border: `8px solid ${C.orange}`, borderRadius: 18, padding: "14px 34px 14px 40px", background: "rgba(255,255,255,0.88)", whiteSpace: "nowrap", boxShadow: "0 12px 30px rgba(217,119,87,0.22)" }}>✓ ANFRAGE</div>
        </div>
      ) : null}
    </div>
  );
};

// ---------- Scene G: calm checklist, save moment (speicher - komm) ----------
const CHECK = ["Preis sichtbar", "Bewertungen", "Fotos von echten Aufträgen", "Kontakt mit einem Klick", "Klarer erster Satz"];
const SceneListe: React.FC<{ t: number }> = ({ t }) => {
  const s = A.speicher;
  const saved = k(t, A.speicher + 0.35, 0.25);
  return (
    <>
      <Card style={{ left: 130, top: 70, width: 820, height: 680, padding: "30px 40px", boxSizing: "border-box", opacity: k(t, s, 0.2), transform: `translateY(${(1 - k(t, s, 0.35)) * 16}px)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: C.dim }}>CHECKLISTE</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 42, color: C.ink, marginTop: 6, letterSpacing: -0.3 }}>Konkurrenz-Check</div>
          </div>
          <div style={{ width: 70, height: 70, borderRadius: 16, background: saved > 0.5 ? C.orange : "#FFF", border: `3px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.15 * Math.sin(Math.min(1, saved) * Math.PI)})` }}>
            <svg width={30} height={36} viewBox="0 0 30 36"><path d="M3 3h24v30l-12-8-12 8z" fill={saved > 0.5 ? "#FFF" : "none"} stroke={saved > 0.5 ? "#FFF" : C.orange} strokeWidth={3.5} strokeLinejoin="round" /></svg>
          </div>
        </div>
        <div style={{ borderTop: `2px solid ${C.line}`, marginTop: 20 }} />
        {CHECK.map((c, i) => (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: 22, height: 96, borderBottom: i < CHECK.length - 1 ? `1.5px solid ${C.line}` : "none", opacity: k(t, s + 0.05 + i * 0.07, 0.25) }}>
            <span style={{ width: 38, height: 38, borderRadius: 9, border: "3px solid #CFCAC0", boxSizing: "border-box" }} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: C.ink }}>{c}</span>
          </div>
        ))}
      </Card>
      <div style={{ position: "absolute", right: 160, top: 46, ...popStyle(t, A.speicher + 0.4, 8, 0.6) }}><Tag text="GESPEICHERT" color={C.orange} size={18} /></div>
    </>
  );
};

// ---------- Scene H: guide scroll + zoom on the prompt page (komm - end) ----------
const GUIDE_PAGES = 7;
const GUIDE_AT = Math.min(A.speicher + 2.0, A.komm - 0.2); // checklist stands ~2 s (save moment), then the guide scroll
const PROMPT_PAGE = 5;
const SceneGuide: React.FC<{ t: number }> = ({ t }) => {
  const GS_A = GUIDE_AT;
  const GS_B = Math.max(GS_A + 1.2, A.liste2 - 0.1);
  const pw = 400, ph = Math.round(400 * 1.414), gap = 34;
  const span = GUIDE_PAGES * (ph + gap) - 520;
  const q = interpolate(t, [GS_A + 0.05, GS_B], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const v = Math.abs(interpolate(t + 0.04, [GS_A + 0.05, GS_B], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }) - q) * span;
  const scrollY = 130 - q * span;
  const enter = k(t, GS_A, 0.22, Easing.out(Easing.back(1.4)));
  const zoom = k(t, GS_B - 0.05, 0.4, Easing.inOut(Easing.cubic));
  const page = Math.min(GUIDE_PAGES, 1 + Math.floor(q * GUIDE_PAGES * 0.999));
  const blur = Math.min(5, v * 0.05);
  const strip = (dy: number, op: number, key: string) => (
    <div key={key} style={{ position: "absolute", left: 0, top: scrollY + dy, width: pw, opacity: op }}>
      {Array.from({ length: GUIDE_PAGES }, (_, i) => (
        <div key={i} style={{ width: pw, height: ph, marginBottom: gap, borderRadius: 10, overflow: "hidden", background: "#FFF", boxShadow: "0 26px 50px rgba(20,20,20,0.20), 0 4px 10px rgba(20,20,20,0.10)" }}>
          <Img src={staticFile(`kk-guide/p${i + 1}.png`)} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
      ))}
    </div>
  );
  // zoom: the prompt page, flat, large, showing its upper part (heading + prompt box)
  const zw = 980, zh = Math.round(zw * 1.414);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - zoom }}>
        <div style={{ position: "absolute", inset: 0, perspective: 1500, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: (W - pw) / 2 + 40, top: 0, width: pw, height: PH, transform: `rotateX(14deg) rotateY(-16deg) rotateZ(4deg) scale(${0.85 + 0.15 * enter}) translateY(${(1 - Math.min(enter, 1)) * 120}px)`, transformStyle: "preserve-3d", filter: `blur(${blur}px)` }}>
            {v > 8 ? [strip(v * 0.5, 0.18, "g2"), strip(v * 0.25, 0.28, "g1")] : null}
            {strip(0, 1, "main")}
          </div>
        </div>
        <div style={{ position: "absolute", left: 70, top: 120, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <div style={popStyle(t, GS_A, 12, 0.5)}><LabelChip text="Guide · PDF" size={26} /></div>
          <div style={popStyle(t, GS_A + 0.15, 12, 0.5)}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, letterSpacing: "0.1em", color: "#FFF", background: C.orange, borderRadius: 12, padding: "12px 20px 12px 24px", boxShadow: "0 12px 26px rgba(217,119,87,0.32)" }}>{GUIDE_PAGES} SEITEN</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 64, top: 130, ...popStyle(t, GS_A + 0.25, 10, 0.6) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em", color: C.ink, background: "#FFF", border: `2.5px solid ${C.ink}`, borderRadius: 10, padding: "10px 14px 10px 18px", fontVariantNumeric: "tabular-nums" }}>SEITE {page}/{GUIDE_PAGES}</div>
        </div>
      </div>
      {zoom > 0 ? (
        <div style={{ position: "absolute", left: (W - zw) / 2, top: 40 - zh * 0.06 * zoom, width: zw, height: zh, opacity: zoom, transform: `scale(${0.7 + 0.3 * zoom})`, transformOrigin: "50% 10%", borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 60px rgba(20,20,20,0.22)" }}>
          <Img src={staticFile(`kk-guide/p${PROMPT_PAGE}.png`)} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", alignItems: "center", gap: 0, zIndex: 35 }}>
        <div style={{ display: "flex", ...popStyle(t, A.liste2 - 0.05, 12, 0.5) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "14px 0 0 14px", padding: "18px 18px 18px 28px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 46, letterSpacing: "0.14em", color: "#FFF", background: C.orange, borderRadius: "0 14px 14px 0", padding: "10px 24px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.32)" }}>LISTE</div>
        </div>
      </div>
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: A.claude1, origin: "50% 55%", El: SceneSearch },
  { from: A.claude1, to: A.bei, origin: "50% 45%", El: SceneWhy },
  { from: A.bei, to: A.den, origin: "50% 55%", El: ScenePreis },
  { from: A.den, to: A.zurueck, origin: "50% 60%", El: SceneSearchClaude },
  { from: A.zurueck, to: A.dann1, origin: "50% 50%", El: SceneTable },
  { from: A.dann1, to: A.speicher, origin: "50% 50%", El: SceneSatz },
  { from: A.speicher, to: GUIDE_AT, origin: "50% 50%", El: SceneListe },
  { from: GUIDE_AT, to: 999, origin: "50% 45%", El: SceneGuide },
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
const SeamCaption: React.FC<{ t: number }> = ({ t }) => {
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = pop(t, c.start - 0.04, 0.16);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: PH, display: "flex", justifyContent: "center", zIndex: 50 }}>
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

// ---------- master ----------
// avatar framing: from facefocus.py on tightened.mp4 (panel 0.427), filled in after Stage A
const FOCUS = { x: 0.516, y: 0.593, scale: 1.0, faceAt: 0.54 }; // facefocus.py: faceTop_min 1095, chin_max 1663 at faceAt 0.5
export const KonkurrenzOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = camera(t, scene.from, Math.min(scene.to, KK_END));
  const dx = Math.sin(t * 0.6) * 6, dy = Math.cos(t * 0.45) * 5;
  const H = 1920;
  const s = FOCUS.scale, vw = W * s, vh = H * s, h = H - PH;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTop = PH + Math.min(0, Math.max(h - vh, h * FOCUS.faceAt - FOCUS.y * vh));
  const El = scene.El;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh }}>
        <OffthreadVideo src={staticFile("render-fpn-konkurrenz-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
        <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
        <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
          <El t={t} />
        </div>
      </div>
      <SeamCaption t={t} />
    </AbsoluteFill>
  );
};
