import React from "react";
import { AbsoluteFill, Easing, Img, getStaticFiles, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import captions from "../../runs/fpn-erklaerfilm/captions.json";
import {
  PH, MONO, C, PK, clamp, k, pop, ps, typed, Pill,
  HookFilm, SceneSystem, SceneSetup, SceneFotos, SceneMotion, SceneCut, SceneExport, SceneHaken, SceneGuideBg,
} from "./ErklaerfilmBrolls";

// FP-N "Erklaerfilm" (2026-10-29) - Opus master: split from frame 0 (panel 820 px, speaker below). 0 .. end of sentence 2 =
// three.js image film of the example roofer "Holzmann Dachtechnik" (BEISPIEL, invented), then one scene per sentence anchored
// to captions.json, orange seam captions, hook pills on frame 0, 3 hard zooms (zehn Minuten / komplettes System / Der Haken),
// guide scroll with the real PDF pages, follow pill (Folg mir) before the trigger pill (kommentiere FILM).

const FPS = 25;
const W = 1080;
const H = 1920;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const EF_END = LAST_END + 0.7;
export const EF_FRAMES = Math.round(EF_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  zehn: at("zehn"), aus: at("aus"), paar: at("paar"), handy: at("handyfotos"),
  daraus: at("daraus"), komplettes0: at("komplettes", 0), system0: at("system", 0), entwickelt: at("entwickelt"), dein0: at("dein", 0), filmstudio: at("filmstudio"), claude1: at("claude", 1),
  nach0: at("nach", 0), auftrag0: at("auftrag", 0), neuer: at("neuer"), clip0: at("clip", 0),
  einmal: at("einmal"), einrichten: at("einrichten"), projekt0: at("projekt", 0), logo0: at("logo", 0), farben: at("farben"), drei: at("drei"), macht: at("macht"), kennt: at("kennt"), look: at("look"),
  nach1: at("nach", 1), fotografierst: at("fotografierst"), fertige: at("fertige"), arbeit0: at("arbeit", 0), ziehst: at("ziehst"), projekt1: at("projekt", 1),
  dann0: at("dann", 0), schraeg: at("schrägstrich"), und2: at("und", 2), startest: at("startest"), regie: at("regiesystem"),
  das0: at("das", 0), sagt: at("sagt"), problem: at("problem"), deine1: at("deine", 1), logo1: at("logo", 1),
  raus: at("raus"), dreissig: at("dreißig"), fertig: at("fertig"), website: at("website"), stellen: at("stellenanzeige"), instagram: at("instagram"),
  der: at("der"), haken: at("haken"), motion1: at("motion", 1), teamplan: at("teamplan"), testversion: at("testversion"),
  mein1: at("mein", 1), komplettes1: at("komplettes", 1), guide: at("guide"), folg: at("folg"), komm: at("kommentiere"), film: at("film"),
};

type Scene = { from: number; to: number; El: React.FC<{ t: number; dur: number }> };
const rel = (from: number, o: Record<string, number>) => Object.fromEntries(Object.entries(o).map(([key, v]) => [key, v - from]));
const mkScene = (from: number, to: number, S: React.FC<{ t: number; dur: number; at?: Record<string, number> }>, abs: Record<string, number>): Scene => {
  const a = rel(from, abs);
  const El: React.FC<{ t: number; dur: number }> = ({ t, dur }) => <S t={t} dur={dur} at={a} />;
  return { from, to, El };
};
const T_SYS = A.daraus - 0.1;
const T_SET = A.einmal - 0.1;
const T_FOTO = A.nach1 - 0.1;
const T_MOT = A.dann0 - 0.1;
const T_CUT = A.das0 - 0.1;
const T_EXP = A.raus - 0.1;
const T_HAK = A.der - 0.1;
const T_GUIDE = A.mein1 - 0.1;
const SCENES: Scene[] = [
  mkScene(0, T_SYS, HookFilm, { collapse: A.aus - 0.12, ph1: A.aus, ph2: A.paar, ph3: A.handy, beam: A.handy + 0.3 }),
  mkScene(T_SYS, T_SET, SceneSystem, { proj: A.daraus, regie: A.system0 - 0.05, fotos: A.entwickelt, export: A.dein0, title: A.filmstudio, claude: A.claude1 - 0.05, shift: A.nach0 - 0.08, c1: A.auftrag0 - 0.05, c2: A.neuer, c3: A.clip0 }),
  mkScene(T_SET, T_FOTO, SceneSetup, { name: A.einrichten - 0.1, proj: A.projekt0, logo: A.logo0 - 0.05, farben: A.farben - 0.05, saetze: A.drei - 0.05, saetzeEnd: A.macht + 0.25, kennt: A.kennt - 0.05, look: A.look }),
  mkScene(T_FOTO, T_MOT, SceneFotos, { shot1: A.fotografierst, shot2: A.fertige, shot3: A.arbeit0, drag: A.ziehst - 0.05, drop: A.projekt1 }),
  mkScene(T_MOT, T_CUT, SceneMotion, { slash: A.schraeg - 0.12, typeEnd: A.schraeg + 0.5, menu: A.schraeg + 0.15, pick: A.und2 - 0.25, chip: A.startest, regie: A.regie }),
  mkScene(T_CUT, T_EXP, SceneCut, { sagt: A.sagt, problem: A.problem - 0.1, arbeit: A.deine1 - 0.05, logo: A.logo1 - 0.15 }),
  mkScene(T_EXP, T_HAK, SceneExport, { sec: A.dreissig, fertig: A.fertig, web: A.website, job: A.stellen, ig: A.instagram }),
  mkScene(T_HAK, T_GUIDE, SceneHaken, { motion: A.haken + 0.12, team: A.teamplan, test: A.testversion }),
  { from: T_GUIDE, to: 999, El: SceneGuideBg },
];

// ---------- hook pills (frame 0 = thumbnail): "Agentur 2.500 €" (struck) / "Claude 10 Min" ----------
const PILLS_OUT = A.zehn + 0.62;
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const m = k(t, 0.9, 0.35, Easing.inOut(Easing.cubic));
  const strike = t < 0.04 ? 1 : k(t, 0.45, 0.25);
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 68, padding: "8px 28px 12px", borderRadius: 18, whiteSpace: "nowrap", lineHeight: 1.15 };
  const out = k(t, PILLS_OUT, 0.22);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 52, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 25, opacity: 1 - out, transform: `translateY(${-out * 30}px)` }}>
      <div style={{ ...pill, background: "#FFF", color: PK.ink, boxShadow: "0 16px 36px rgba(60,35,15,0.22)" }}>
        Agentur{" "}
        <span style={{ position: "relative", display: "inline-block", color: C.red }}>
          2.500 €
          <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 7, background: C.red, borderRadius: 4, transform: `scaleX(${strike})`, transformOrigin: "0% 50%" }} />
        </span>
      </div>
      <div style={{ ...pill, marginTop: -8 }}>
        Claude{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -10, right: -10, top: 8, bottom: 4, background: C.orange, borderRadius: 10, transform: `scaleX(${t < 0.04 ? 1 : 0.35 + 0.65 * m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>10 Min</span>
        </span>
      </div>
    </div>
  );
};

// ---------- seam captions (orange pill, active word in black) ----------
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
  const chars = c.words.reduce((n, w) => n + w.w.length + 1, 0);
  const fs = chars > 23 ? 34 : chars > 19 ? 40 : 46;
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
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.08), background: C.orange, borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: MONO, fontWeight: 700, fontSize: fs, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(120,50,25,0.30)" }}>
        <div style={{ position: "relative", display: "flex", gap: gapW }}>
          <div style={{ position: "absolute", left: px - 12, top: -4, width: pw + 24, bottom: -4, background: "#111111", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.22)" }} />
          {c.words.map((w, j) => <span key={j} style={{ position: "relative", display: "inline-block", color: "#FFFFFF" }}>{w.w}</span>)}
        </div>
      </div>
    </div>
  );
};

// ---------- guide scroll (real PDF pages, inside the panel so the face stays in frame) ----------
const GUIDE_FILES = getStaticFiles().filter((f) => /^fpn-erklaerfilm\/guide\/p\d+\.png$/.test(f.name));
const NPAGES = Math.max(1, GUIDE_FILES.length);
const PAGES = Array.from({ length: NPAGES }, (_, i) => staticFile(`fpn-erklaerfilm/guide/p${i + 1}.png`));
const PDF = { left: 150, top: 26, w: 780, h: 770, bar: 70, pw: 700, ph: Math.round((700 * 1348) / 952), gap: 24 };
const PITCH = PDF.ph + PDF.gap;
const PDF_IN = A.mein1 - 0.08;
const PDF_OUT = A.folg - 0.3;
const SCROLL_A = PDF_IN + 0.22, SCROLL_B = PDF_OUT - 0.08;
const SAMPLES = 8, SHUTTER = 0.6 / FPS;
const scrollY = (t: number) => interpolate(t, [SCROLL_A, SCROLL_B], [0, (NPAGES - 1) * PITCH], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const PdfScroll: React.FC<{ t: number }> = ({ t }) => {
  if (t < PDF_IN || t > PDF_OUT + 0.3) return null;
  const inY = interpolate(t, [PDF_IN, PDF_IN + 0.25], [PH + 200, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const outY = interpolate(t, [PDF_OUT, PDF_OUT + 0.28], [0, -PH - 200], { ...clamp, easing: Easing.in(Easing.cubic) });
  const y = scrollY(t);
  const page = Math.min(NPAGES, Math.max(1, Math.floor((y + (PDF.h - PDF.bar) / 2) / PITCH) + 1));
  const rot = interpolate(t, [PDF_IN, PDF_IN + 0.25], [-5, -1.5], clamp);
  return (
    <div style={{ position: "absolute", left: PDF.left, top: PDF.top, width: PDF.w, height: PDF.h, borderRadius: 24, overflow: "hidden", background: "#E9E7E1", boxShadow: "0 40px 90px rgba(60,30,10,0.45), 0 6px 16px rgba(0,0,0,0.25)", transform: `perspective(2000px) translateY(${inY + outY}px) rotateX(6deg) rotate(${rot}deg)`, zIndex: 40 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: PDF.bar, background: "#141414", display: "flex", alignItems: "center", padding: "0 24px", gap: 14, zIndex: 2 }}>
        <div style={{ width: 34, height: 40, borderRadius: 6, background: C.red, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 11, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, boxSizing: "border-box" }}>PDF</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF", whiteSpace: "nowrap" }}>Claude Filmstudio – Guide.pdf</div>
        <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 24, color: "#FFF", background: C.orange, borderRadius: 10, padding: "5px 12px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{page} / {NPAGES}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: PDF.bar, bottom: 0, overflow: "hidden" }}>
        {Array.from({ length: SAMPLES }, (_, j) => {
          const yy = scrollY(t - (j / (SAMPLES - 1)) * SHUTTER);
          return (
            <div key={j} style={{ position: "absolute", left: (PDF.w - PDF.pw) / 2, top: 20 - yy, opacity: 1 / (j + 1) }}>
              {PAGES.map((src, i) => {
                const top = i * PITCH - yy;
                if (top > PDF.h + 200 || top + PDF.ph < -200) return null; // only pages near the window
                return <Img key={i} src={src} style={{ position: "absolute", left: 0, top: i * PITCH, width: PDF.pw, height: PDF.ph, borderRadius: 6, boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />;
              })}
            </div>
          );
        })}
      </div>
      {t > A.komplettes1 - 0.05 ? <div style={{ position: "absolute", right: 22, bottom: 22, zIndex: 3, ...ps(t, A.komplettes1 - 0.05, 10, 0.5) }}><Pill text={`KOMPLETTES SYSTEM · ${NPAGES} SEITEN`} color="#FFF" bg={C.green} size={22} dot={false} /></div> : null}
    </div>
  );
};

// ---------- master ----------
const FOCUS = { x: 0.509, y: 0.596, scale: 1.0 };
const SPLIT_SRC_TOP = 430;
const CTA = A.folg - 0.12;
const CHEST_Y = 1600;
// hard zooms: fast ease-in (0.14 s), hold the phrase, ease out
const ZOOMS = [
  { a: A.zehn - 0.06, b: A.aus - 0.15, s: 1.2 },
  { a: A.komplettes0 - 0.06, b: A.dein0 - 0.12, s: 1.25 },
  { a: A.haken - 0.06, b: A.motion1 + 0.45, s: 1.25 },
];
const hardZoom = (t: number) => ZOOMS.reduce((acc, z) => acc * (1 + (z.s - 1) * k(t, z.a, 0.14, Easing.out(Easing.cubic)) * (1 - k(t, z.b, 0.25, Easing.inOut(Easing.cubic)))), 1);
const flashAt = (t: number) => ZOOMS.reduce((m, z) => Math.max(m, t >= z.a && t < z.a + 0.12 ? 1 - (t - z.a) / 0.12 : 0), 0);

export const ErklaerfilmOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const full = k(t, CTA, 0.42, Easing.inOut(Easing.cubic));
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTop = Math.min(PH, Math.max(H - vh, PH - SPLIT_SRC_TOP * s)) * (1 - full);
  const opening = 1 + 0.07 * k(t, 0, 4.4, Easing.inOut(Easing.sin)); // gentle push from frame 0, whole face stays in frame
  const breathe = 1 + 0.02 * Math.abs(Math.sin((t - scene.from) * 0.9));
  const ctaPush = t > CTA ? 1 + 0.05 * k(t, CTA + 0.45, 2.0, Easing.inOut(Easing.sin)) : 1;
  const avScale = (t < T_SYS ? opening : breathe) * hardZoom(t) * ctaPush;
  const El = scene.El;
  const followed = t > A.folg + 0.45;
  const flash = flashAt(t);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${avScale})`, transformOrigin: `${FOCUS.x * 100}% ${FOCUS.y * 100 - 4}%` }}>
        <OffthreadVideo src={staticFile("fpn-erklaerfilm/tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {full < 1 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * full, width: W, height: PH, overflow: "hidden", background: PK.cream, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <El t={t - scene.from} dur={scene.to - scene.from} />
          {t < PILLS_OUT + 0.3 ? <HookPills t={t} /> : null}
          <PdfScroll t={t} />
        </div>
      ) : null}
      {flash > 0 ? <div style={{ position: "absolute", inset: 0, background: "#FFF8F0", opacity: flash * 0.35, zIndex: 48 }} /> : null}
      {/* CTA: follow first ("Folg mir"), then the trigger ("kommentiere Film") */}
      {t > A.folg - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, zIndex: 45 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#FFF", borderRadius: 999, padding: "12px 14px 12px 26px", boxShadow: "0 12px 26px rgba(0,0,0,0.25)", ...ps(t, A.folg - 0.08, 10, 0.6) }}>
            <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: PK.ink }}>@florent_preusser</span>
            <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#FFF", background: followed ? C.green : "#3E8EF7", borderRadius: 999, padding: "10px 22px", transform: `scale(${t > A.folg + 0.4 && t < A.folg + 0.52 ? 0.9 : 1})` }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
          </div>
          {t > A.komm - 0.1 ? (
            <>
              <div style={{ display: "flex", ...ps(t, A.komm - 0.08, 14, 0.5) }}>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: "#141414", borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px", display: "flex", alignItems: "center" }}>KOMMENTIERE:</div>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 28px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)", minWidth: 160 }}>{typed("FILM", t, A.komm + 0.05, A.komm + 0.35) || " "}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(20,20,20,0.82)", borderRadius: 999, padding: "10px 22px", ...ps(t, A.komm + 0.15, 8, 0.6) }}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.green }} />
                <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", color: "#FFF" }}>FÜR DEN GUIDE · {NPAGES} SEITEN · PER DM</span>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
      <SeamCaption t={t} y={PH + (CHEST_Y - PH) * full} />
    </AbsoluteFill>
  );
};
