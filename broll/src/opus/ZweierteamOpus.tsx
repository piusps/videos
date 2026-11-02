import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fps-zweierteam/captions.json";
import figs from "../../runs/fps-zweierteam/figs.json";

// FP study reel "Allein mit KI = Zweierteam" (Henri 2026-10-13), FP style of EingliederungOpus / KontoauszugOpus:
// split from frame 0, panel on top (0-820 px, off-white grid canvas) showing the ORIGINAL study figures
// (Dell'Acqua et al. 2025, "The Cybernetic Teammate"): each proof is shown complete first, then the camera pushes
// into the key spot; red/blue/yellow frames around bars, yellow wipe marker on text. Avatar below, captions as
// Claude-orange pill on the seam (active word in a black pill). CTA: panel slides away, avatar full frame,
// comment pill + guide PDF scroll. All timings anchored to captions.json (tightened timeline); 1.1x, music and
// SFX afterwards (make-sfx.mjs).

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820; // panel height = seam

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const ZW_END = LAST_END + 1.0;
export const ZW_FRAMES = Math.round(ZW_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[n];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
/** first occurrence of `word` at or after time `from` */
const after = (word: string, from: number, end = false) => {
  const x = WORDS.find((y) => y.w === word && y.s >= from - 0.001);
  if (!x) throw new Error(`anchor not found: ${word} after ${from}`);
  return end ? x.e : x.s;
};
const getestet = at("getestet");
const allein2 = at("allein", 2); // "Allein ohne KI: ganz unten"
const spannend = at("spannend");
const nur = at("nur");
const fuer = after("für", nur);
const mitWem = after("wem", fuer);
export const A = {
  allein0: at("allein", 0), harvard: at("harvard"), genauso: at("genauso", 0), zwei: at("zwei", 0), leute: at("leute"), ohne0: at("ohne", 0),
  getestet, forscher: at("forscher"), siebenhundert: at("siebenhundert"), profis: at("profis"), procter: at("procter"), gamble: at("gamble"),
  echte: at("echte"), aufgaben: at("aufgaben"), produkte: at("produkte"),
  manche: at("manche", 0), manche2: at("manche", 1), zweit: at("zweit", 0), mal: at("mal", 0), mal2: at("mal", 1),
  allein2, unten: after("unten", allein2), zuZweit: after("zweit", allein2), besser: after("besser", allein2),
  allein3: at("allein", 3), mindestens: at("mindestens"), team: after("team", allein2), schneller: at("schneller"), fertig: at("fertig"),
  spannend, warum: at("warum"), techniker: at("techniker"), verkaeufer: at("verkäufer"), verkaufsideen: at("verkaufsideen"),
  mitKi: after("mit", at("verkaufsideen")), unterschied: at("unterschied"), weg: at("weg"), seite: at("seite"), fehlt: at("fehlt"),
  nur, richtig: at("richtig"), besten: at("besten"), zehn: at("zehn"), nicht: after("nicht", nur), einzelnen: at("einzelnen"),
  zwei2: after("zwei", at("einzelnen")), menschen: after("menschen", nur), mehr: after("mehr", nur), doppelt: at("doppelt"),
  fuer, heisst: at("heißt"), alltag: at("alltag"), ersetzt: at("ersetzt"), kollegen: at("kollegen"),
  grossen: at("großen"), entscheidungen: at("entscheidungen", 0), menschen2: after("menschen", at("großen")), tisch: at("tisch"),
  mitWem: after("mit", mitWem - 0.6), wem: mitWem, wichtigsten: at("wichtigsten"), schreib: at("schreib"), kommentare: at("kommentare"),
  schick: at("schick"), prompt: at("prompt"), sparring: at("sparringspartner"),
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
  red: "#E5484D",
  blue: "#2F6FE4",
  yellow: "#F5C518",
  marker: "rgba(255, 214, 10, 0.55)",
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
const fmt = (n: number) => Math.round(n).toLocaleString("de-DE");

// ---------- building blocks ----------
const LabelChip: React.FC<{ text: string; dot?: string; style?: React.CSSProperties; size?: number }> = ({ text, dot = C.orange, style, size = 28 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.chip, color: "#FFF", fontFamily: fonts.semibold, fontSize: size, padding: `${size * 0.36}px ${size * 0.8}px ${size * 0.36}px ${size * 0.6}px`, borderRadius: 999, boxShadow: "0 10px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap", ...style }}>
    <span style={{ width: size * 0.48, height: size * 0.48, borderRadius: "50%", background: dot }} />
    {text}
  </div>
);
const Tag: React.FC<{ text: string; color: string; size?: number; style?: React.CSSProperties }> = ({ text, color, size = 18, style }) => (
  <span style={{ display: "inline-block", fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color: "#FFF", background: color, padding: `${size * 0.33}px ${size * 0.55}px ${size * 0.33}px ${size * 0.66}px`, borderRadius: 8, whiteSpace: "nowrap", boxShadow: "0 8px 18px rgba(0,0,0,0.16)", ...style }}>{text}</span>
);
const ClaudeMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={SIMPLE_ICONS.claude.d} fill={SIMPLE_ICONS.claude.hex} /></svg>
);
const Person: React.FC<{ size: number; color?: string }> = ({ size, color = C.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><circle cx="12" cy="7.5" r="4.2" /><path d="M3.5 21c0-4.7 3.8-8 8.5-8s8.5 3.3 8.5 8z" /></svg>
);

// ---------- original study figure with camera + frames/markers in image coordinates ----------
type Box = [number, number, number, number];
type Fig = { src: string; w: number; h: number; boxes: Record<string, Box | Box[]> };
const FIG = figs as unknown as Record<string, Fig>;
const box = (f: string, name: string) => FIG[f].boxes[name] as Box;
const boxes = (f: string, name: string) => FIG[f].boxes[name] as Box[];
type Cam = { at: number; box?: Box; pad?: number };
type Mark = { box: Box; from: number; to?: number; color: string; kind?: "frame" | "marker" };
const pad = (b: Box, p: number): Box => [b[0] - p, b[1] - p, b[2] + 2 * p, b[3] + 2 * p];

const FigureShot: React.FC<{ t: number; fig: string; rect: { x: number; y: number; w: number; h: number }; cams: Cam[]; marks?: Mark[]; enter?: number; exit?: number }> = ({ t, fig, rect, cams, marks = [], enter = 0, exit = 999 }) => {
  const f = FIG[fig];
  const full: Box = [0, 0, f.w, f.h];
  const view = (c: Cam): Box => (c.box ? pad(c.box, c.pad ?? 40) : full);
  // view rect: eased transition between consecutive camera keys (0.45 s), contain-fit into rect
  let v = view(cams[0]);
  for (let i = 1; i < cams.length; i++) {
    const q = interpolate(t, [cams[i].at, cams[i].at + 0.45], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    if (q <= 0) break;
    const b = view(cams[i]);
    v = [v[0] + (b[0] - v[0]) * q, v[1] + (b[1] - v[1]) * q, v[2] + (b[2] - v[2]) * q, v[3] + (b[3] - v[3]) * q];
  }
  const s = Math.min(rect.w / v[2], rect.h / v[3]);
  const cx = v[0] + v[2] / 2, cy = v[1] + v[3] / 2;
  const tx = rect.w / 2 - cx * s, ty = rect.h / 2 - cy * s;
  const inQ = k(t, enter, 0.32, Easing.out(Easing.back(1.3)));
  const outQ = k(t, exit, 0.25, Easing.in(Easing.cubic));
  if (t < enter - 0.01 || t > exit + 0.3) return null;
  return (
    <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderRadius: 20, overflow: "hidden", background: "#FFF", boxShadow: shadow, opacity: k(t, enter, 0.12) * (1 - outQ), transform: `translateY(${(1 - inQ) * 40 + outQ * -30}px) scale(${0.94 + 0.06 * inQ})` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: f.w, height: f.h, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
        <Img src={staticFile(f.src)} style={{ position: "absolute", left: 0, top: 0, width: f.w, height: f.h }} />
        {marks.map((m, i) => {
          if (t < m.from || (m.to !== undefined && t > m.to + 0.2)) return null;
          const off = m.to !== undefined ? 1 - k(t, m.to, 0.2) : 1;
          if (m.kind === "marker") {
            const q = k(t, m.from, 0.45, Easing.inOut(Easing.quad));
            return <div key={i} style={{ position: "absolute", left: m.box[0] - 4, top: m.box[1] - 2, width: (m.box[2] + 8) * q, height: m.box[3] + 4, background: C.marker, mixBlendMode: "multiply", borderRadius: 4, opacity: off }} />;
          }
          const q = pop(t, m.from, 0.3);
          const sw = 7 / s; // ~7 px on screen whatever the zoom
          const g = 10 / s;
          return (
            <div key={i} style={{ position: "absolute", left: m.box[0] - g, top: m.box[1] - g, width: m.box[2] + 2 * g, height: m.box[3] + 2 * g, border: `${sw}px solid ${m.color}`, borderRadius: 10 / s, boxShadow: `0 0 0 ${3 / s}px rgba(255,255,255,0.85), 0 ${6 / s}px ${18 / s}px rgba(0,0,0,0.18)`, transform: `scale(${1.25 - 0.25 * Math.min(q, 1.1)})`, opacity: k(t, m.from, 0.1) * off, boxSizing: "border-box" }} />
          );
        })}
      </div>
    </div>
  );
};

// ---------- Scene A: hook, quality chart (0 - getestet) ----------
const FULL = { x: 60, y: 60, w: 960, h: 720 };
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const q = "quality";
  const roll = interpolate(t, [0.05, 1.3], [0, 776], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH }}>
      {/* text hook, fully visible at frame 0 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${1 + 0.03 * (1 - k(t, 0, 0.5))})` }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 70, color: C.ink, letterSpacing: -1, whiteSpace: "nowrap" }}>
          Allein + <span style={{ background: C.orange, color: "#FFF", borderRadius: 14, padding: "0 14px" }}>KI</span> = Zweierteam.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontWeight: 800, fontSize: 34, letterSpacing: "0.08em", color: C.ink }}>
          <span>HARVARD,</span>
          <span style={{ background: C.chip, color: "#FFF", borderRadius: 10, padding: "4px 14px", fontVariantNumeric: "tabular-nums", minWidth: 96, textAlign: "center" }}>{fmt(roll)}</span>
          <span>PROFIS.</span>
        </div>
      </div>
      <FigureShot t={t} fig={q} rect={{ x: 70, y: 230, w: 940, h: 560 }} enter={-1}
        cams={[{ at: 0 }, { at: A.zwei - 0.1, box: box(q, "all_bars"), pad: 30 }]}
        marks={[{ box: box(q, "ind_ai"), from: 0.35, color: C.red }, { box: box(q, "team_noai"), from: A.zwei, color: C.blue }]} />
      {/* chips that name the two framed bars */}
      <div style={{ position: "absolute", left: 90, top: 250, ...popStyle(t, 0.55, 10, 0.5) }}><Tag text="ALLEIN + KI" color={C.red} size={24} /></div>
      <div style={{ position: "absolute", right: 90, top: 250, ...popStyle(t, A.zwei + 0.1, 10, 0.5) }}><Tag text="ZU ZWEIT OHNE KI" color={C.blue} size={24} /></div>
      {t > A.genauso - 0.05 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 236, display: "flex", justifyContent: "center", ...popStyle(t, A.genauso - 0.05, 8, 0.4) }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#FFF", background: C.ink, borderRadius: 12, padding: "0 18px" }}>=</span>
        </div>
      ) : null}
    </div>
  );
};

// ---------- Scene B: who was tested (getestet - allein2) ----------
const COND = [
  { who: 1, ai: false, label: "ALLEIN" }, { who: 2, ai: false, label: "ZU ZWEIT" },
  { who: 1, ai: true, label: "ALLEIN + KI" }, { who: 2, ai: true, label: "ZU ZWEIT + KI" },
];
const SceneTest: React.FC<{ t: number }> = ({ t }) => {
  const title = "title", ab = "abstract";
  const absIn = A.echte - 0.1;
  const gridIn = A.manche - 0.08;
  const lines = boxes(ab, "matched_lines");
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH }}>
      <FigureShot t={t} fig={title} rect={FULL} enter={getestet} exit={absIn}
        cams={[{ at: getestet }, { at: A.siebenhundert - 0.15, box: box(title, "authors"), pad: 140 }]}
        marks={[{ box: box(title, "authors"), from: A.siebenhundert, color: C.red }]} />
      <div style={{ position: "absolute", left: 80, top: 640, ...popStyle(t, A.procter - 0.05, 10, 0.5), opacity: k(t, A.procter - 0.05, 0.12) * (1 - k(t, absIn, 0.15)) }}>
        <LabelChip text="776 Profis · Procter & Gamble" dot={C.blue} size={30} />
      </div>
      <FigureShot t={t} fig={ab} rect={FULL} enter={absIn} exit={gridIn}
        cams={[{ at: absIn }, { at: A.aufgaben + 0.1, box: [100, 480, 1820, 260], pad: 10 }]}
        marks={lines.map((l, i) => ({ box: l, from: A.aufgaben + 0.35 + i * 0.4, color: C.yellow, kind: "marker" as const }))} />
      {/* 2x2 conditions */}
      {t > gridIn ? (
        <div style={{ position: "absolute", left: 90, top: 110, width: 900, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
          {COND.map((c, i) => {
            const a = [A.manche, A.manche2, A.mal, A.mal2][i] - 0.05;
            return (
              <div key={i} style={{ height: 270, background: C.card, borderRadius: 20, boxShadow: shadow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, ...popStyle(t, a, 20, 0.8) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {Array.from({ length: c.who }, (_, j) => <Person key={j} size={84} />)}
                  {c.ai ? <span style={{ marginLeft: 10, width: 84, height: 84, borderRadius: 20, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><ClaudeMark size={56} /></span> : null}
                </div>
                <Tag text={c.label} color={c.ai ? C.orange : C.ink} size={24} />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

// ---------- Scene C: results (allein2 - spannend) ----------
const SceneResult: React.FC<{ t: number }> = ({ t }) => {
  const q = "quality";
  const b = (n: string) => box(q, n);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH }}>
      <FigureShot t={t} fig={q} rect={FULL} enter={allein2 - 0.05}
        cams={[{ at: allein2 - 0.05 }, { at: allein2 + 0.2, box: [120, 80, 1000, 1300], pad: 0 }, { at: A.zuZweit - 0.1, box: [380, 80, 1000, 1300], pad: 0 }, { at: A.allein3 - 0.1, box: [760, 80, 1000, 1300], pad: 0 }, { at: A.schneller - 0.2, box: b("all_bars"), pad: 40 }]}
        marks={[{ box: b("ind_noai"), from: A.unten - 0.1, color: C.dim, to: A.zuZweit }, { box: b("team_noai"), from: A.zuZweit, color: C.blue }, { box: b("ind_ai"), from: A.allein3 + 0.05, color: C.yellow }]} />
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, A.unten, 10, 0.5), opacity: k(t, A.unten, 0.12) * (1 - k(t, A.zuZweit, 0.15)) }}><Tag text="GANZ UNTEN" color={C.ink} size={26} /></div>
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, A.besser - 0.05, 10, 0.5), opacity: k(t, A.besser - 0.05, 0.12) * (1 - k(t, A.allein3, 0.15)) }}><Tag text="DEUTLICH BESSER" color={C.blue} size={26} /></div>
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, A.mindestens - 0.05, 10, 0.5) }}><Tag text="GENAUSO GUT WIE DAS TEAM" color={C.orange} size={26} /></div>
      <div style={{ position: "absolute", right: 90, top: 680, ...popStyle(t, A.schneller - 0.05, 12, 0.5) }}><LabelChip text="und schneller fertig" dot={C.green} size={30} /></div>
    </div>
  );
};

// ---------- Scene D: why (spannend - nur) ----------
const SceneWhy: React.FC<{ t: number }> = ({ t }) => {
  const e = "expertise";
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", ...popStyle(t, spannend, 14, 0.5), opacity: k(t, spannend, 0.1) * (1 - k(t, A.techniker - 0.25, 0.15)) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 110, color: C.ink, background: C.card, borderRadius: 26, padding: "10px 40px", boxShadow: shadow }}>Warum<span style={{ color: C.orange }}>?</span></span>
      </div>
      <FigureShot t={t} fig={e} rect={FULL} enter={A.techniker - 0.25}
        cams={[{ at: A.techniker - 0.25 }, { at: A.verkaeufer - 0.2, box: box(e, "without_ai"), pad: 40 }, { at: A.mitKi - 0.1, box: box(e, "with_ai"), pad: 40 }, { at: A.seite - 0.1 }]}
        marks={[{ box: box(e, "without_ai"), from: A.techniker, color: C.red, to: A.mitKi + 0.2 }, { box: box(e, "with_ai"), from: A.unterschied, color: C.red }]} />
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, A.techniker, 10, 0.5), opacity: k(t, A.techniker, 0.12) * (1 - k(t, A.mitKi, 0.15)) }}><Tag text="OHNE KI: GETRENNT" color={C.ink} size={26} /></div>
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, A.weg - 0.05, 10, 0.5) }}><Tag text="MIT KI: UNTERSCHIED WEG" color={C.orange} size={26} /></div>
    </div>
  );
};

// ---------- Scene E: the catch (nur - fuer) ----------
const SceneTop: React.FC<{ t: number }> = ({ t }) => {
  const f = "top10";
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH }}>
      <FigureShot t={t} fig={f} rect={FULL} enter={nur - 0.05}
        cams={[{ at: nur - 0.05 }, { at: A.zwei2 - 0.1, box: box(f, "team_ai"), pad: 90 }]}
        marks={[{ box: box(f, "ind_ai"), from: A.einzelnen - 0.05, color: C.yellow }, { box: box(f, "team_ai"), from: A.zwei2, color: C.red }]} />
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, A.besten - 0.05, 10, 0.5) }}><Tag text="TOP 10 % DER IDEEN" color={C.ink} size={26} /></div>
      <div style={{ position: "absolute", right: 90, top: 660, ...popStyle(t, A.doppelt - 0.05, 14, 0.4) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: "#FFF", background: C.red, borderRadius: 16, padding: "6px 24px", boxShadow: "0 14px 30px rgba(229,72,77,0.35)" }}>2× +</div>
      </div>
    </div>
  );
};

// ---------- Scene F: save card (fuer - mitWem) ----------
const SaveRow: React.FC<{ t: number; a: number; label: string; parts: ("du" | "mensch" | "claude")[] }> = ({ t, a, label, parts }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "44px 34px", background: "#FAF9F6", borderRadius: 18, border: `2px solid ${C.line}`, ...popStyle(t, a, 18, 0.85) }}>
    <span style={{ fontFamily: fonts.bold, fontSize: 44, color: C.ink, lineHeight: 1.05, maxWidth: 300 }}>{label}</span>
    <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {i ? <span style={{ fontFamily: fonts.bold, fontSize: 40, color: C.dim }}>+</span> : null}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: p === "claude" ? C.orange : C.chip, color: "#FFF", borderRadius: 999, padding: "10px 18px 10px 12px", fontFamily: fonts.semibold, fontSize: 30, ...popStyle(t, a + 0.12 + i * 0.14, 8, 0.6) }}>
            {p === "claude" ? <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#FFF", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><ClaudeMark size={24} /></span> : <Person size={30} color="#FFF" />}
            {p === "du" ? "du" : p === "mensch" ? "Mensch" : "Claude"}
          </span>
        </React.Fragment>
      ))}
    </span>
  </div>
);
const SceneSave: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 60, top: 90, width: 960, background: C.card, borderRadius: 24, boxShadow: shadow, padding: "34px 34px 38px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 24, ...popStyle(t, fuer - 0.05, 30, 0.9) }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em", color: C.dim }}>ZUM SPEICHERN</span>
      <Tag text="STUDIE · HARVARD" color={C.ink} size={18} />
    </div>
    <SaveRow t={t} a={A.alltag - 0.1} label="Alltag" parts={["du", "claude"]} />
    <SaveRow t={t} a={A.grossen - 0.1} label="Große Entscheidung" parts={["du", "mensch", "claude"]} />
    <div style={{ display: "flex", justifyContent: "center", ...popStyle(t, A.tisch - 0.1, 10, 0.6) }}><LabelChip text="Claude sitzt mit am Tisch" dot={C.orange} size={30} /></div>
  </div>
);

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: getestet, origin: "50% 55%", El: SceneHook },
  { from: getestet, to: allein2 - 0.05, origin: "50% 50%", El: SceneTest },
  { from: allein2 - 0.05, to: spannend, origin: "50% 50%", El: SceneResult },
  { from: spannend, to: nur - 0.05, origin: "50% 50%", El: SceneWhy },
  { from: nur - 0.05, to: fuer - 0.05, origin: "50% 50%", El: SceneTop },
  { from: fuer - 0.05, to: 999, origin: "50% 40%", El: SceneSave },
];

// ---------- captions: orange pill on the seam, active word in a black pill ----------
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
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.08), background: C.orange, borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: MONO, fontWeight: 700, fontSize: 46, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(120,50,25,0.30)" }}>
        <div style={{ position: "relative", display: "flex", gap: gapW }}>
          <div style={{ position: "absolute", left: px - 12, top: -4, width: pw + 24, bottom: -4, background: "#111111", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.22)" }} />
          {c.words.map((w, j) => <span key={j} style={{ position: "relative", display: "inline-block", color: "#FFFFFF" }}>{w.w}</span>)}
        </div>
      </div>
    </div>
  );
};

// ---------- CTA: the real guide PDF scrolls through fast ----------
import guide from "../../runs/fps-zweierteam/guide-pages.json";
const GP = guide as { n: number; w: number; h: number };
const PAGES = Array.from({ length: GP.n }, (_, i) => staticFile(`fps-zweierteam/gb-${i}.png`));
const PDF = { left: 120, top: 640, w: 840, h: 1220, bar: 76, pw: 780, ph: Math.round((780 * GP.h) / GP.w), gap: 26 };
const PITCH = PDF.ph + PDF.gap;
export const PDF_IN = A.schick - 0.1;
export const PDF_OUT = A.sparring + 0.75;
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
        <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: "#FFF", whiteSpace: "nowrap" }}>Claude als Sparringspartner.pdf</div>
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

// ---------- camera push per sentence inside the panel ----------
const SENT = [0, ...CAPS.flatMap((c, i) => (i > 0 && /[.!?:]$/.test(CAPS[i - 1].text) ? [c.startMs / 1000] : []))];
const camera = (t: number, from: number, to: number) => {
  const s = SENT.filter((x) => x >= from && x < to);
  if (!s.length) s.push(from);
  const amt = Math.min(0.02, 0.05 / s.length);
  let sc = 1;
  s.forEach((a, i) => {
    const b = i + 1 < s.length ? s[i + 1] : to;
    sc += amt * interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  });
  return sc;
};

// ---------- master ----------
import framing from "../../runs/fps-zweierteam/framing.json";
const FOCUS = framing as { x: number; scale: number; splitSrcTop: number; chestY: number };
const CTA = A.mitWem - 0.12;
export const ZweierteamOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = camera(t, scene.from, Math.min(scene.to, CTA));
  const dx = Math.sin(t * 0.6) * 5, dy = Math.cos(t * 0.45) * 4;
  const full = k(t, CTA, 0.42, Easing.inOut(Easing.cubic));
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTopSplit = Math.min(PH, Math.max(H - vh, PH - FOCUS.splitSrcTop * s));
  const vTop = vTopSplit * (1 - full);
  const push = 1 + 0.05 * k(t, CTA + 0.45, 2.6, Easing.inOut(Easing.sin));
  const El = scene.El;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${push})`, transformOrigin: "50% 45%" }}>
        <OffthreadVideo src={staticFile("fps-zweierteam/tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
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
      {/* CTA: comment pill above the head */}
      {t > A.schreib - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, zIndex: 45 }}>
          <div style={{ display: "flex", ...popStyle(t, A.schreib - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px", display: "flex", alignItems: "center" }}>KOMMENTIER:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 26px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)" }}>MIT WEM?</div>
          </div>
          <div style={popStyle(t, A.prompt - 0.05, 10, 0.6)}><LabelChip text="Prompt · Claude als Sparringspartner" dot={C.green} size={28} /></div>
        </div>
      ) : null}
      <SeamCaption t={t} y={PH + (FOCUS.chestY - PH) * full} />
    </AbsoluteFill>
  );
};
