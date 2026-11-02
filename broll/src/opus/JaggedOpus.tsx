import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fps-jagged-frontier/captions.json";
import figs from "../../runs/fps-jagged-frontier/figs.json";
import framing from "../../runs/fps-jagged-frontier/framing.json";

// FP study reel "Jagged Frontier" (Dell'Acqua et al. 2023, HBS WP 24-013), built 1:1 in the approved style of
// ZweierteamOpus: split from frame 0, panel on top (0-820 px, off-white grid canvas) with the ORIGINAL study figures,
// red frames on bars/curves, yellow wipe marker only on text, push-ins until the spot fills ~70 % of the width,
// camera travel spot 1 -> spot 2, Claude-orange caption pill on the seam (active word in a black pill), save card,
// CTA: panel slides away, avatar full frame, comment pill. No guide PDF, no source bar.
// All timings anchored to captions.json (tightened timeline); 1.1x, music and SFX afterwards (make-sfx.mjs).

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const JF_END = LAST_END + 1.0;
export const JF_FRAMES = Math.round(JF_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const x = WORDS.filter((y) => y.w === word)[n];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  vierzig: at("vierzig"), arbeit: at("arbeit"), nur: at("nur"), sorte: at("sorte"), falsch: at("falsch"), ohne0: at("ohne", 0),
  wenn: at("wenn"), claude: at("claude", 0), arbeitest: at("arbeitest"), wissen: at("wissen"), welche: at("welche", 0),
  getestet: at("getestet"), harvard: at("harvard"), boston: at("boston"), group: at("group"), n758: at("siebenhundertachtundfünfzig"),
  beratern: at("beratern"), schwaechsten: at("schwächsten"), mit3: at("mit", 3), n43: at("dreiundvierzig"), besser: at("besser"),
  dann: at("dann"), aufgabe1: at("aufgabe", 1), antwort: at("antwort", 0), tabellen: at("tabellen"), interview: at("interviewnotizen"),
  ohne1: at("ohne", 1), n84: at("vierundachtzig"), richtig: at("richtig"), mit4: at("mit", 4), sechzig: at("sechzig"),
  steckt: at("steckt"), antwortSave: at("antwort", 1), zahlen: at("zahlen"), pruef: at("prüf"), sagt: at("sagt"), welche2: at("welche", 1), nie: at("nie"),
};

const C = {
  bg: "#F4F3EF", grid: "rgba(0,0,0,0.045)", ink: "#151515", dim: "#8A877F", line: "#E7E4DD", card: "#FFFFFF",
  orange: "#D97757", orangeSoft: "#F8E1D7", green: "#1E9E57", red: "#E5484D", blue: "#2F6FE4", yellow: "#F5C518",
  marker: "rgba(255, 214, 10, 0.55)", chip: "#141414", cream: "#FAF9F5",
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
const fade = (t: number, a: number, b: number) => k(t, a, 0.12) * (1 - k(t, b, 0.15));

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
const Badge: React.FC<{ text: string; color: string; size?: number }> = ({ text, color, size = 64 }) => (
  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, color: "#FFF", background: color, borderRadius: 16, padding: "6px 24px", boxShadow: "0 14px 30px rgba(0,0,0,0.22)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{text}</div>
);
const ClaudeMark: React.FC<{ size: number; color?: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={SIMPLE_ICONS.claude.d} fill={color ?? SIMPLE_ICONS.claude.hex} /></svg>
);

// ---------- original study figure with camera + frames/markers in image coordinates ----------
type Box = [number, number, number, number];
type Fig = { src: string; w: number; h: number; boxes: Record<string, Box> };
const FIG = figs as unknown as Record<string, Fig>;
const box = (f: string, name: string) => FIG[f].boxes[name];
/** fill: fraction of the rect WIDTH the box should take (view is widened to the rect's aspect around the box centre) */
type Cam = { at: number; box?: Box; pad?: number; fill?: number };
type Mark = { box: Box; from: number; to?: number; color: string; kind?: "frame" | "marker" };
type Wipe = { box: Box; from: number; d: number };
const pad = (b: Box, p: number): Box => [b[0] - p, b[1] - p, b[2] + 2 * p, b[3] + 2 * p];

const FigureShot: React.FC<{ t: number; fig: string; rect: { x: number; y: number; w: number; h: number }; cams: Cam[]; marks?: Mark[]; wipes?: Wipe[]; enter?: number; exit?: number }> = ({ t, fig, rect, cams, marks = [], wipes = [], enter = 0, exit = 999 }) => {
  const f = FIG[fig];
  const full: Box = [0, 0, f.w, f.h];
  const view = (c: Cam): Box => {
    if (!c.box) return full;
    if (c.fill) {
      const vw = c.box[2] / c.fill, vh = (vw * rect.h) / rect.w;
      const cx = c.box[0] + c.box[2] / 2, cy = c.box[1] + c.box[3] / 2;
      return [cx - vw / 2, cy - vh / 2, vw, vh];
    }
    return pad(c.box, c.pad ?? 40);
  };
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
        {wipes.map((w, i) => {
          const q = k(t, w.from, w.d, Easing.inOut(Easing.quad));
          if (q >= 1) return null;
          return <div key={`w${i}`} style={{ position: "absolute", left: w.box[0] + w.box[2] * q, top: w.box[1], width: w.box[2] * (1 - q), height: w.box[3], background: "#FFF" }} />;
        })}
        {marks.map((m, i) => {
          if (t < m.from || (m.to !== undefined && t > m.to + 0.2)) return null;
          const off = m.to !== undefined ? 1 - k(t, m.to, 0.2) : 1;
          if (m.kind === "marker") {
            const q = k(t, m.from, 0.45, Easing.inOut(Easing.quad));
            return <div key={i} style={{ position: "absolute", left: m.box[0] - 3, top: m.box[1] - 2, width: (m.box[2] + 6) * q, height: m.box[3] + 4, background: C.marker, mixBlendMode: "multiply", borderRadius: 3, opacity: off }} />;
          }
          const q = pop(t, m.from, 0.3);
          const sw = 7 / s;
          const g = 10 / s;
          return (
            <div key={i} style={{ position: "absolute", left: m.box[0] - g, top: m.box[1] - g, width: m.box[2] + 2 * g, height: m.box[3] + 2 * g, border: `${sw}px solid ${m.color}`, borderRadius: 10 / s, boxShadow: `0 0 0 ${3 / s}px rgba(255,255,255,0.85), 0 ${6 / s}px ${18 / s}px rgba(0,0,0,0.18)`, transform: `scale(${1.25 - 0.25 * Math.min(q, 1.1)})`, opacity: k(t, m.from, 0.1) * off, boxSizing: "border-box" }} />
          );
        })}
      </div>
    </div>
  );
};

const FULL = { x: 60, y: 60, w: 960, h: 720 };

// ---------- Scene A: hook, quality distribution (0 - nur) ----------
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const q = "quality";
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${1 + 0.03 * (1 - k(t, 0, 0.5))})` }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 70, color: C.ink, letterSpacing: -1, whiteSpace: "nowrap" }}>
          Mit <span style={{ background: C.orange, color: "#FFF", borderRadius: 14, padding: "0 14px" }}>KI</span> 40 % besser.
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, letterSpacing: "0.08em", color: C.ink, whiteSpace: "nowrap" }}>
          BIS AUF <span style={{ background: C.chip, color: "#FFF", borderRadius: 10, padding: "4px 14px" }}>EINE</span> AUFGABE.
        </div>
      </div>
      <FigureShot t={t} fig={q} rect={{ x: 70, y: 230, w: 940, h: 560 }} enter={-1}
        cams={[{ at: 0 }, { at: 0.25, box: box(q, "curves"), pad: 10 }, { at: A.vierzig - 0.2, box: box(q, "shift"), fill: 0.6 }]}
        marks={[{ box: box(q, "shift"), from: 0.55, color: C.red }]} />
      <div style={{ position: "absolute", left: 90, top: 720, ...popStyle(t, 0.7, 10, 0.5) }}><Tag text="QUALITÄT MIT KI" color={C.red} size={24} /></div>
      <div style={{ position: "absolute", right: 90, top: 590, ...popStyle(t, A.vierzig - 0.05, 14, 0.4) }}><Badge text="+40 %" color={C.red} /></div>
    </div>
  );
};

// ---------- Scene B: teaser, the 60 % bar (nur - wenn) ----------
const SceneTeaser: React.FC<{ t: number }> = ({ t }) => {
  const o = "outside";
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH }}>
      <FigureShot t={t} fig={o} rect={FULL} enter={A.nur - 0.05}
        cams={[{ at: A.nur - 0.05, box: box(o, "plot"), pad: 20 }, { at: A.sorte, box: box(o, "genai"), fill: 0.55 }]}
        marks={[{ box: box(o, "genai"), from: A.falsch - 0.05, color: C.red }]} />
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, A.sorte, 10, 0.5) }}><Tag text="EINE SORTE AUFGABE" color={C.ink} size={26} /></div>
      <div style={{ position: "absolute", right: 90, top: 80, ...popStyle(t, A.falsch - 0.05, 14, 0.4) }}><Badge text="ÖFTER FALSCH" color={C.red} size={52} /></div>
    </div>
  );
};

// ---------- Scene C: Claude window (wenn - getestet) ----------
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(interpolate(t, [a, b], [0, s.length], clamp)));
const FileChip: React.FC<{ name: string; color: string; ext: string }> = ({ name, color, ext }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#FFF", border: `2px solid ${C.line}`, borderRadius: 14, padding: "10px 18px 10px 10px", fontFamily: fonts.semibold, fontSize: 26, color: C.ink }}>
    <span style={{ width: 44, height: 50, borderRadius: 8, background: color, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 13, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6, boxSizing: "border-box" }}>{ext}</span>
    {name}
  </span>
);
const SceneClaude: React.FC<{ t: number }> = ({ t }) => {
  const a = A.wenn - 0.05;
  const reply = "Standort Nord liegt vorne. Die Marge ist dort 12 % über Plan.";
  return (
    <div style={{ position: "absolute", left: 60, top: 70, width: 960, height: 700, background: C.cream, borderRadius: 24, boxShadow: shadow, overflow: "hidden", ...popStyle(t, a, 30, 0.9) }}>
      <div style={{ height: 76, background: "#FFF", borderBottom: `2px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 28px", gap: 14 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c }} />)}
        <span style={{ marginLeft: 18, display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}><ClaudeMark size={32} /> Claude</span>
      </div>
      <div style={{ padding: "30px 34px", display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ alignSelf: "flex-end", maxWidth: 700, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, ...popStyle(t, a + 0.25, 16, 0.85) }}>
          <div style={{ display: "flex", gap: 12 }}>
            <FileChip name="Umsatz_Q3.xlsx" color={C.green} ext="XLSX" />
            <FileChip name="Interviews.docx" color={C.blue} ext="DOCX" />
          </div>
          <div style={{ background: "#ECE9E1", borderRadius: 20, padding: "18px 24px", fontFamily: fonts.medium, fontSize: 32, color: C.ink, lineHeight: 1.3 }}>Welcher Standort läuft am besten?</div>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", opacity: k(t, A.claude, 0.15) }}>
          <span style={{ width: 56, height: 56, borderRadius: 16, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ClaudeMark size={38} /></span>
          <div style={{ fontFamily: fonts.medium, fontSize: 34, color: C.ink, lineHeight: 1.35, maxWidth: 760, paddingTop: 6 }}>
            {typed(reply, t, A.claude + 0.1, A.wissen)}
            {t < A.wissen + 0.3 ? <span style={{ display: "inline-block", width: 14, height: 34, background: C.orange, marginLeft: 4, verticalAlign: "middle", borderRadius: 3, opacity: Math.floor(t * 4) % 2 ? 1 : 0.3 }} /> : null}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", ...popStyle(t, A.welche - 0.05, 14, 0.4) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, color: "#FFF", background: C.red, borderRadius: 16, padding: "8px 28px", boxShadow: "0 14px 30px rgba(229,72,77,0.35)", transform: "rotate(-3deg)" }}>STIMMT DAS?</div>
      </div>
    </div>
  );
};

// ---------- Scene D: the study (getestet - beratern) ----------
const SceneStudy: React.FC<{ t: number }> = ({ t }) => {
  const f = "title";
  const roll = interpolate(t, [A.n758 - 0.05, A.beratern], [0, 758], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH }}>
      <FigureShot t={t} fig={f} rect={FULL} enter={A.getestet - 0.05}
        cams={[{ at: A.getestet - 0.05 }, { at: A.harvard - 0.15, box: box(f, "title"), pad: 30 }, { at: A.boston - 0.1, box: box(f, "abstract_lines"), fill: 0.92 }]}
        marks={[{ box: box(f, "bcg"), from: A.boston + 0.35, color: C.yellow, kind: "marker" }, { box: box(f, "n758"), from: A.n758, color: C.yellow, kind: "marker" }]} />
      <div style={{ position: "absolute", left: 90, top: 90, display: "flex", gap: 16 }}>
        <div style={popStyle(t, A.harvard, 10, 0.5)}><LabelChip text="Harvard" dot={C.red} size={30} /></div>
        <div style={popStyle(t, A.boston, 10, 0.5)}><LabelChip text="BCG" dot={C.green} size={30} /></div>
      </div>
      <div style={{ position: "absolute", right: 90, top: 90, display: "flex", alignItems: "center", gap: 14, ...popStyle(t, A.n758 - 0.05, 12, 0.5) }}>
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: "#FFF", background: C.chip, borderRadius: 16, padding: "4px 22px", fontVariantNumeric: "tabular-nums", minWidth: 150, textAlign: "center" }}>{fmt(roll)}</span>
        <Tag text="BERATER" color={C.orange} size={26} />
      </div>
    </div>
  );
};

// ---------- Scene E: 54 lines, all rise (beratern - mit3) ----------
const SceneLines: React.FC<{ t: number }> = ({ t }) => {
  const f = "lines";
  const a = A.beratern - 0.05;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH }}>
      <FigureShot t={t} fig={f} rect={FULL} enter={a}
        cams={[{ at: a, box: box(f, "plot"), pad: 10 }, { at: A.schwaechsten, box: [560, 50, 430, 520], pad: 10 }]}
        wipes={[{ box: [118, 52, 850, 528], from: a + 0.15, d: 0.8 }]}
        marks={[{ box: box(f, "treatment"), from: A.schwaechsten + 0.3, color: C.red }]} />
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, a + 0.2, 10, 0.5) }}><Tag text="18 AUFGABEN · 54 LINIEN" color={C.ink} size={26} /></div>
      <div style={{ position: "absolute", right: 90, top: 660, ...popStyle(t, a + 0.9, 14, 0.5) }}><LabelChip text="alle steigen mit KI" dot={C.green} size={32} /></div>
    </div>
  );
};

// ---------- Scene F: weakest +43 %, top +17 % (mit3 - dann) ----------
const SceneHalves: React.FC<{ t: number }> = ({ t }) => {
  const f = "fig5";
  const a = A.mit3 - 0.1;
  const top = A.besser + 0.15;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH }}>
      <FigureShot t={t} fig={f} rect={FULL} enter={a}
        cams={[{ at: a }, { at: a + 0.2, box: box(f, "bottom"), fill: 0.5 }, { at: top, box: box(f, "top"), fill: 0.5 }]}
        marks={[{ box: box(f, "bottom"), from: A.n43 - 0.05, color: C.red, to: top + 0.1 }, { box: box(f, "top"), from: top + 0.35, color: C.dim }]} />
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, a + 0.15, 10, 0.5), opacity: fade(t, a + 0.15, top) }}><Tag text="DIE SCHWÄCHSTEN" color={C.red} size={26} /></div>
      <div style={{ position: "absolute", right: 40, top: 360, ...popStyle(t, A.n43 - 0.05, 14, 0.4), opacity: fade(t, A.n43 - 0.05, top) }}><Badge text="+43 %" color={C.red} /></div>
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, top + 0.2, 10, 0.5) }}><Tag text="DIE STÄRKSTEN: +17 %" color={C.ink} size={26} /></div>
    </div>
  );
};

// ---------- Scene G: the task outside the frontier (dann - steckt) ----------
const SceneOutside: React.FC<{ t: number }> = ({ t }) => {
  const o = "outside";
  const a = A.dann - 0.05;
  const toCtrl = A.ohne1 - 0.1, toAi = A.mit4 - 0.1;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", ...popStyle(t, a, 14, 0.5), opacity: k(t, a, 0.1) * (1 - k(t, A.antwort - 0.2, 0.15)) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 74, color: C.ink, background: C.card, borderRadius: 26, padding: "14px 40px", boxShadow: shadow, whiteSpace: "nowrap" }}>Dann kam <span style={{ color: C.orange }}>diese</span> Aufgabe.</span>
      </div>
      <FigureShot t={t} fig={o} rect={FULL} enter={A.antwort - 0.2}
        cams={[{ at: A.antwort - 0.2, box: box(o, "plot"), pad: 20 }, { at: toCtrl, box: box(o, "control"), fill: 0.45 }, { at: toAi, box: box(o, "genai"), fill: 0.56 }]}
        marks={[{ box: box(o, "control"), from: A.n84 - 0.05, color: C.blue, to: toAi + 0.2 }, { box: box(o, "genai"), from: A.sechzig - 0.05, color: C.red }]} />
      <div style={{ position: "absolute", left: 90, top: 90, display: "flex", gap: 16, opacity: 1 - k(t, toCtrl, 0.15) }}>
        <div style={popStyle(t, A.tabellen - 0.05, 10, 0.5)}><LabelChip text="Tabellen" dot={C.green} size={32} /></div>
        <div style={popStyle(t, A.interview - 0.05, 10, 0.5)}><LabelChip text="Interviewnotizen" dot={C.blue} size={32} /></div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, toCtrl + 0.1, 10, 0.5), opacity: fade(t, toCtrl + 0.1, toAi) }}><Tag text="OHNE KI: RICHTIG" color={C.blue} size={26} /></div>
      <div style={{ position: "absolute", right: 22, top: 360, ...popStyle(t, A.n84 - 0.05, 14, 0.4), opacity: fade(t, A.n84 - 0.05, toAi) }}><Badge text="84,5 %" color={C.blue} /></div>
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, toAi + 0.15, 10, 0.5) }}><Tag text="MIT KI: RICHTIG" color={C.red} size={26} /></div>
      <div style={{ position: "absolute", right: 22, top: 360, ...popStyle(t, A.sechzig - 0.05, 14, 0.4) }}><Badge text="60,0 %" color={C.red} /></div>
    </div>
  );
};

// ---------- Scene H: save card (steckt - CTA) ----------
const SaveRow: React.FC<{ t: number; a: number; label: string; children: React.ReactNode }> = ({ t, a, label, children }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "40px 34px", background: "#FAF9F6", borderRadius: 18, border: `2px solid ${C.line}`, ...popStyle(t, a, 18, 0.85) }}>
    <span style={{ fontFamily: fonts.bold, fontSize: 42, color: C.ink, lineHeight: 1.08, maxWidth: 400, marginRight: 24 }}>{label}</span>
    <span style={{ display: "flex", alignItems: "center", gap: 12, ...popStyle(t, a + 0.15, 8, 0.6) }}>{children}</span>
  </div>
);
const Pill: React.FC<{ text: string; bg: string; icon?: React.ReactNode }> = ({ text, bg, icon }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, background: bg, color: "#FFF", borderRadius: 999, padding: "10px 20px 10px 12px", fontFamily: fonts.semibold, fontSize: 28, whiteSpace: "nowrap" }}>{icon}{text}</span>
);
const ClaudeDot = () => <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFF", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><ClaudeMark size={26} /></span>;
const SceneSave: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 60, top: 90, width: 960, background: C.card, borderRadius: 24, boxShadow: shadow, padding: "34px 34px 38px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 24, ...popStyle(t, A.steckt - 0.05, 30, 0.9) }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em", color: C.dim }}>ZUM SPEICHERN</span>
      <Tag text="STUDIE · HARVARD × BCG" color={C.ink} size={18} />
    </div>
    <SaveRow t={t} a={A.antwortSave - 0.1} label="Antwort in deinen Zahlen?">
      <Pill text="Tabellen" bg={C.chip} /><Pill text="Notizen" bg={C.chip} />
    </SaveRow>
    <SaveRow t={t} a={A.pruef - 0.1} label="Gegenprüfen">
      <Pill text="Claude" bg={C.orange} icon={<ClaudeDot />} /><span style={{ fontFamily: fonts.bold, fontSize: 40, color: C.dim }}>→</span><Pill text="du rechnest nach" bg={C.chip} />
    </SaveRow>
    <div style={{ display: "flex", justifyContent: "center", ...popStyle(t, A.sagt - 0.1, 10, 0.6) }}><LabelChip text="mit KI nur 60 % richtig statt 84,5 %" dot={C.red} size={30} /></div>
  </div>
);

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: A.nur - 0.05, origin: "50% 55%", El: SceneHook },
  { from: A.nur - 0.05, to: A.wenn - 0.05, origin: "50% 50%", El: SceneTeaser },
  { from: A.wenn - 0.05, to: A.getestet - 0.05, origin: "50% 50%", El: SceneClaude },
  { from: A.getestet - 0.05, to: A.beratern - 0.05, origin: "50% 50%", El: SceneStudy },
  { from: A.beratern - 0.05, to: A.mit3 - 0.1, origin: "50% 50%", El: SceneLines },
  { from: A.mit3 - 0.1, to: A.dann - 0.05, origin: "50% 50%", El: SceneHalves },
  { from: A.dann - 0.05, to: A.steckt - 0.05, origin: "50% 50%", El: SceneOutside },
  { from: A.steckt - 0.05, to: 999, origin: "50% 40%", El: SceneSave },
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
  // very long single words (SIEBENHUNDERTACHTUNDFÜNFZIG) get a smaller font so the pill stays inside 1080 px
  const longest = Math.max(...c.words.map((w) => w.w.length));
  const total = c.words.reduce((n, w) => n + w.w.length, 0) + c.words.length - 1;
  const fs = Math.min(46, 900 / (Math.max(total, longest) * 0.74 + 2));
  const p = pop(t, c.start - 0.04, 0.16);
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
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.08), background: C.orange, borderRadius: 16, padding: `16px 22px 16px 30px`, fontFamily: MONO, fontWeight: 700, fontSize: fs, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(120,50,25,0.30)" }}>
        <div style={{ position: "relative", display: "flex", gap: gapW }}>
          <div style={{ position: "absolute", left: px - 12, top: -4, width: pw + 24, bottom: -4, background: "#111111", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.22)" }} />
          {c.words.map((w, j) => <span key={j} style={{ position: "relative", display: "inline-block", color: "#FFFFFF" }}>{w.w}</span>)}
        </div>
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
const FOCUS = framing as { x: number; scale: number; splitSrcTop: number; chestY: number };
const CTA = A.welche2 - 0.12;
export const JaggedOpus: React.FC = () => {
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
        <OffthreadVideo src={staticFile("fps-jagged-frontier/tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {full < 1 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * full, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
          </div>
        </div>
      ) : null}
      {/* CTA: comment pill above the head */}
      {t > A.welche2 - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 0, zIndex: 45, ...popStyle(t, A.welche2 - 0.08, 14, 0.5) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 32, letterSpacing: "0.14em", color: "#FFF", background: C.chip, borderRadius: "16px 16px 0 0", padding: "14px 30px 12px" }}>KOMMENTIER:</div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.08em", color: "#FFF", background: C.orange, borderRadius: 16, padding: "12px 30px", boxShadow: "0 12px 26px rgba(217,119,87,0.4)", whiteSpace: "nowrap" }}>WELCHE AUFGABE NIE?</div>
        </div>
      ) : null}
      {/* hide the caption while it travels from the seam to chest height, so it never crosses the face */}
      <div style={{ position: "absolute", inset: 0, zIndex: 50, opacity: full <= 0 || full >= 1 ? 1 : full < 0.12 ? 1 - full / 0.12 : full > 0.88 ? (full - 0.88) / 0.12 : 0 }}>
        <SeamCaption t={t} y={PH + (FOCUS.chestY - PH) * full} />
      </div>
    </AbsoluteFill>
  );
};
