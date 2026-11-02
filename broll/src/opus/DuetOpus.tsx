import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { PK, paperShadow, Glass, Highlight } from "./PremiumKit";
import captions from "../../runs/fpn-claude-duet/captions.json";
import {
  PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, tilt, Logo, ClaudeAppIcon, Mono, Pill, CheckDot, Ico, IC, Glint, Ring, Pointer, PanelStage, GLogo,
  SceneNews, SceneLock, SceneCost, SceneBriefing, ScenePhoneOff, SceneApprove, SceneWaitlist,
} from "./DuetBrolls";

// FP-N "Claude Duet" (2026-10-28) - Opus master: split from frame 0 (panel 820 px, speaker below), one scene per sentence
// anchored to captions.json, orange seam captions, hook pills on frame 0, 3 hard zooms (Gamechanger / richtig krank / Ein Klick),
// guide scroll with the real PDF pages, CTA trigger pill. Kunde "Kessler Bau" + Beträge sind Beispiele.

const FPS = 25;
const W = 1080;
const H = 1920;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const DU_END = LAST_END + 0.7;
export const DU_FRAMES = Math.round(DU_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  update: at("update"), gamechanger: at("gamechanger"), claude1: at("claude", 1), schreibt0: at("schreibt", 0), zuerst: at("zuerst"), nicht0: at("nicht", 0),
  das: at("das", 1), macht: at("macht"), einer: at("einer"), euro: at("euro"), monat: at("monat"), kriegst: at("kriegst"), liste: at("liste"),
  mail: at("mail"), termin0: at("termin", 0), kunde: at("kunde"), frage: at("frage"), und2: at("und", 2), richtig: at("richtig"), krank: at("krank"),
  duet1: at("duet", 1), handy: at("handy"), schreibt1: at("schreibt", 1), mahnung: at("mahnung"), schickt: at("schickt"), termin1: at("termin", 1), wartet: at("wartet"), okay: at("okay"),
  ein2: at("ein", 2), klick: at("klick"), fertig: at("fertig"), der: at("der"), duet2: at("duet", 2), usa: at("usa"), aber: at("aber"),
  grossteil: at("großteil"), davon: at("davon"), baust: at("baust"), claude3: at("claude", 3), nach: at("nach"),
  alle: at("alle"), drei: at("drei"), prompts: at("prompts"), guide: at("guide"), komm: at("kommentiere"), trigger: at("duet", 3), folg: at("folg"),
};

const SENT = [0, ...CAPS.flatMap((c, i) => (i > 0 && /[.!?:]$/.test(CAPS[i - 1].text) ? [c.startMs / 1000] : []))];

// ---------- extra scenes (Nachbau in Claude, guide chips) ----------
const PROMPT = "Prüf jeden Morgen meine Mails, Termine und offenen Rechnungen und schick mir ein Briefing.";
const SceneNachbau: React.FC<{ t: number; dur: number; at: Record<string, number> }> = ({ t, dur, at: a }) => {
  const conn = [a.c1, a.c2];
  return (
    <PanelStage t={t} dur={dur} seed={8}>
      <div style={{ position: "absolute", left: 50, top: 34, display: "inline-flex", alignItems: "center", gap: 12, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "10px 22px 10px 14px", fontFamily: fonts.semibold, fontSize: 26, ...ps(t, -0.25, 10, 0.8) }}>
        <Logo name="claude" size={28} /> Heute schon in Claude
      </div>
      <div style={{ position: "absolute", left: 50, top: 112, width: 980, height: 560, transform: tilt(t, 5, 0), transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", inset: 0, background: CL.page, borderRadius: 28, boxShadow: paperShadow, border: `1px solid ${CL.border}`, overflow: "hidden" }}>
          <div style={{ height: 66, display: "flex", alignItems: "center", gap: 12, padding: "0 26px", borderBottom: `1px solid ${CL.border}`, background: "#FFF" }}>
            <Logo name="claude" size={30} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: CL.text }}>Neuer Chat</span>
            <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 15, letterSpacing: "0.1em", color: CL.sub }}>CLAUDE.AI</span>
          </div>
          <div style={{ padding: "26px 34px" }}>
            {/* connectors */}
            <div style={{ display: "flex", gap: 16 }}>
              {[["gmail.svg", "Gmail"], ["calendar.svg", "Google Calendar"]].map(([f, n], i) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 16, padding: "10px 18px 10px 10px", ...ps(t, conn[i], 16, 0.7) }}>
                  <GLogo file={f} size={46} />
                  <span style={{ fontFamily: fonts.semibold, fontSize: 23, color: CL.text }}>{n}</span>
                  <CheckDot size={26} p={k(t, conn[i] + 0.12, 0.25)} />
                </div>
              ))}
            </div>
            {/* composer */}
            <div style={{ marginTop: 24, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 24, padding: "20px 24px 16px", boxShadow: "0 14px 34px rgba(20,20,20,0.07)", height: 250, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: fonts.medium, fontSize: 30, color: CL.text, lineHeight: 1.32, flex: 1 }}>
                {typed(PROMPT, t, a.type, a.typeEnd) || <span style={{ color: CL.sub }}>Wie kann ich dir heute helfen?</span>}
                {t > a.type && t < a.send ? <span style={{ display: "inline-block", width: 3, height: 32, background: C.orange, marginLeft: 3, verticalAlign: "middle" }} /> : null}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, border: `1.5px solid ${CL.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M12 5v14M5 12h14" size={24} /></div>
                {t > a.plan - 0.05 ? (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orangeSoft, color: PK.orangeDeep, borderRadius: 12, padding: "8px 14px", fontFamily: fonts.semibold, fontSize: 21, ...ps(t, a.plan, 8, 0.6) }}>
                    <Ico d="M12 7v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z" size={22} color={PK.orangeDeep} sw={2.2} /> Zeitplan · werktags 7:30
                  </div>
                ) : null}
                <div style={{ marginLeft: "auto", fontFamily: fonts.medium, fontSize: 21, color: CL.sub }}>Opus 5.5</div>
                <div style={{ width: 50, height: 50, borderRadius: 13, background: CL.send, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${t > a.send && t < a.send + 0.12 ? 0.86 : 1})` }}><Ico d="M12 19V6M6 11.5L12 5.5l6 6" size={28} color="#FFF" sw={2.4} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {t > a.send + 0.05 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", ...ps(t, a.send + 0.05, 14, 0.6) }}>
          <Pill text="LÄUFT AB MORGEN 7:30" color={C.green} bg={C.greenSoft} size={22} />
        </div>
      ) : null}
      <Pointer t={t} path={[{ x: 900, y: 760, at: 0 }, { x: 990, y: 620, at: a.send, click: true }, { x: 1040, y: 760, at: a.send + 0.6 }]} size={56} />
      <Glint t={t} at={conn[0] + 0.2} x={300} y={190} size={30} />
      <Glint t={t} at={conn[1] + 0.2} x={640} y={190} size={30} />
    </PanelStage>
  );
};
const SceneEnd: React.FC<{ t: number; dur: number }> = ({ t, dur }) => (
  <PanelStage t={t} dur={dur} seed={9}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: SERIF, fontSize: 90, color: PK.ink }}>3 Prompts im Guide</div>
  </PanelStage>
);

type Scene = { from: number; to: number; El: React.FC<{ t: number; dur: number }>; full?: boolean };
const rel = (from: number, o: Record<string, number>) => Object.fromEntries(Object.entries(o).map(([key, v]) => [key, v - from]));
const mkScene = (from: number, to: number, S: React.FC<{ t: number; dur: number; at?: Record<string, number>; topSafe?: number }>, abs: Record<string, number>, topSafe?: number): Scene => {
  const a = rel(from, abs);
  const El: React.FC<{ t: number; dur: number }> = ({ t, dur }) => <S t={t} dur={dur} at={a} topSafe={topSafe} />;
  return { from, to, El };
};
const T_LOCK = A.claude1 - 0.1;
const T_COST = A.das - 0.08;
const T_BRIEF = A.kriegst - 0.1;
const T_KRANK = A.und2 - 0.1;
const T_OFF = A.duet1 - 0.1;
const T_APPROVE = A.ein2 - 0.1;
const T_WAIT = A.der - 0.1;
const T_NACH = A.aber - 0.1;
const T_END = A.alle - 0.1;
const SCENES: Scene[] = [
  mkScene(0, T_LOCK, SceneNews, { update: A.update - 0.05, game: A.gamechanger - 0.08 }, 210),
  mkScene(T_LOCK, T_COST, SceneLock, { notif: A.schreibt0 - 0.1, notif2: A.zuerst + 0.22, flip: A.nicht0 - 0.05 }),
  mkScene(T_COST, T_BRIEF, SceneCost, { count: A.einer, countEnd: A.euro, strike: A.monat - 0.05, duet: A.macht - 0.05 }),
  mkScene(T_BRIEF, T_KRANK, SceneBriefing, { mail: A.mail - 0.12, termin: A.termin0 - 0.12, kunde: A.kunde - 0.12, zero: A.frage - 0.2 }),
  { from: T_KRANK, to: T_OFF, El: () => null, full: true },
  mkScene(T_OFF, T_APPROVE, ScenePhoneOff, { off: A.handy, type: A.schreibt1, typeEnd: A.schickt + 0.2, termin: A.termin1 - 0.25, wait: A.wartet - 0.05 }),
  mkScene(T_APPROVE, T_WAIT, SceneApprove, { press: A.klick - 0.04, done: A.fertig - 0.05 }),
  mkScene(T_WAIT, T_NACH, SceneWaitlist, { ticket: A.duet2 - 0.05, usa: A.usa - 0.1, de: 999 }),
  (() => {
    const a = rel(T_NACH, { c1: A.grossteil - 0.1, c2: A.davon - 0.05, type: A.baust - 0.05, typeEnd: A.claude3 + 0.15, plan: A.claude3 - 0.05, send: A.nach });
    return { from: T_NACH, to: T_END, El: ({ t, dur }: { t: number; dur: number }) => <SceneNachbau t={t} dur={dur} at={a} /> };
  })(),
  { from: T_END, to: 999, El: SceneEnd },
];

// ---------- hook pills (frame 0 = thumbnail): "Assistenz 3.000 €" / "Claude 0 Fragen" ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const m = k(t, 0.9, 0.35, Easing.inOut(Easing.cubic));
  const strike = k(t, 0.45, 0.25);
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 66, padding: "8px 28px 12px", borderRadius: 18, whiteSpace: "nowrap", lineHeight: 1.15 };
  const out = k(t, T_LOCK - 0.25, 0.2);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 25, opacity: 1 - out, transform: `translateY(${-out * 30}px)` }}>
      <div style={{ ...pill, background: "#FFF", color: PK.ink, boxShadow: "0 16px 36px rgba(60,35,15,0.22)" }}>
        Assistenz{" "}
        <span style={{ position: "relative", display: "inline-block", color: C.red }}>
          3.000 €
          <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 7, background: C.red, borderRadius: 4, transform: `scaleX(${strike})`, transformOrigin: "0% 50%" }} />
        </span>
      </div>
      <div style={{ ...pill, marginTop: -8 }}>
        Claude{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -10, right: -10, top: 8, bottom: 4, background: C.orange, borderRadius: 10, transform: `scaleX(${t < 0.04 ? 1 : 0.35 + 0.65 * m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>0 Fragen</span>
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
  const fs = c.words.reduce((n, w) => n + w.w.length + 1, 0) > 19 ? 40 : 46;
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
const NPAGES = 14;
const PAGES = Array.from({ length: NPAGES }, (_, i) => staticFile(`fpn-claude-duet/guide/p${i + 1}.png`));
const PDF = { left: 150, top: 26, w: 780, h: 770, bar: 70, pw: 700, ph: Math.round((700 * 1348) / 952), gap: 24 };
const PITCH = PDF.ph + PDF.gap;
const PDF_IN = A.alle - 0.08;
const PDF_OUT = A.komm - 0.3;
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
        <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF", whiteSpace: "nowrap" }}>Claude Duet – Guide.pdf</div>
        <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 24, color: "#FFF", background: C.orange, borderRadius: 10, padding: "5px 12px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{page} / {NPAGES}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: PDF.bar, bottom: 0, overflow: "hidden" }}>
        {Array.from({ length: SAMPLES }, (_, j) => {
          const yy = scrollY(t - (j / (SAMPLES - 1)) * SHUTTER);
          return (
            <div key={j} style={{ position: "absolute", left: (PDF.w - PDF.pw) / 2, top: 20 - yy, opacity: 1 / (j + 1) }}>
              {PAGES.map((src, i) => <Img key={i} src={src} style={{ position: "absolute", left: 0, top: i * PITCH, width: PDF.pw, height: PDF.ph, borderRadius: 6, boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />)}
            </div>
          );
        })}
      </div>
      {t > A.drei - 0.05 ? <div style={{ position: "absolute", right: 22, bottom: 22, zIndex: 3, ...ps(t, A.drei - 0.05, 10, 0.5) }}><Pill text={`3 PROMPTS · ${NPAGES} SEITEN`} color="#FFF" bg={C.green} size={22} dot={false} /></div> : null}
    </div>
  );
};

// ---------- master ----------
const FOCUS = { x: 0.512, y: 0.597, scale: 1.0 };
const SPLIT_SRC_TOP = 430;
const CTA = A.komm - 0.12;
const CHEST_Y = 1600;
// hard zooms: fast ease-in (0.14 s), hold the phrase, ease out
const ZOOMS = [
  { a: A.gamechanger - 0.06, b: T_LOCK - 0.1, s: 1.2 },
  { a: A.richtig - 0.06, b: T_OFF - 0.12, s: 1.3 },
  { a: A.ein2 - 0.04, b: T_WAIT - 0.12, s: 1.2 },
];
const hardZoom = (t: number) => ZOOMS.reduce((acc, z) => acc * (1 + (z.s - 1) * k(t, z.a, 0.14, Easing.out(Easing.cubic)) * (1 - k(t, z.b, 0.25, Easing.inOut(Easing.cubic)))), 1);
const flashAt = (t: number) => ZOOMS.reduce((m, z) => Math.max(m, t >= z.a && t < z.a + 0.12 ? 1 - (t - z.a) / 0.12 : 0), 0);

export const DuetOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  // full-frame amount: the "richtig krank" beat and the CTA
  const krank = k(t, T_KRANK, 0.22, Easing.inOut(Easing.cubic)) * (1 - k(t, T_OFF - 0.18, 0.2, Easing.inOut(Easing.cubic)));
  const full = Math.max(krank, k(t, CTA, 0.42, Easing.inOut(Easing.cubic)));
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTop = Math.min(PH, Math.max(H - vh, PH - SPLIT_SRC_TOP * s)) * (1 - full);
  const opening = 1 + 0.07 * k(t, 0, 4.4, Easing.inOut(Easing.sin)); // gentle push from frame 0, whole face stays in frame
  const breathe = 1 + 0.02 * Math.abs(Math.sin((t - scene.from) * 0.9));
  const ctaPush = t > CTA ? 1 + 0.05 * k(t, CTA + 0.45, 2.0, Easing.inOut(Easing.sin)) : 1;
  const avScale = (t < T_LOCK ? opening : breathe) * hardZoom(t) * ctaPush;
  const El = scene.El;
  const panelUp = full; // panel slides up when the speaker goes full frame
  const followed = t > A.folg + 0.25;
  const flash = flashAt(t);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${avScale})`, transformOrigin: `${FOCUS.x * 100}% ${FOCUS.y * 100 - 4}%` }}>
        <OffthreadVideo src={staticFile("fpn-claude-duet/tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {panelUp < 1 && !scene.full ? (
        <div style={{ position: "absolute", left: 0, top: -PH * panelUp, width: W, height: PH, overflow: "hidden", background: PK.cream, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <El t={t - scene.from} dur={scene.to - scene.from} />
          {t < T_LOCK ? <HookPills t={t} /> : null}
          <PdfScroll t={t} />
        </div>
      ) : null}
      {/* during the krank transition the panel of the neighbouring scene slides */}
      {scene.full && panelUp < 1 ? (
        <div style={{ position: "absolute", left: 0, top: -PH * panelUp, width: W, height: PH, overflow: "hidden", background: PK.cream }}>
          {t < (T_KRANK + T_OFF) / 2 ? <SceneBriefing t={t - T_BRIEF} dur={T_KRANK - T_BRIEF} at={rel(T_BRIEF, { mail: A.mail - 0.12, termin: A.termin0 - 0.12, kunde: A.kunde - 0.12, zero: A.frage - 0.2 })} /> : <ScenePhoneOff t={t - T_OFF} dur={T_APPROVE - T_OFF} at={rel(T_OFF, { off: A.handy, type: A.schreibt1, typeEnd: A.schickt + 0.2, termin: A.termin1 - 0.25, wait: A.wartet - 0.05 })} />}
        </div>
      ) : null}
      {flash > 0 ? <div style={{ position: "absolute", inset: 0, background: "#FFF8F0", opacity: flash * 0.35, zIndex: 48 }} /> : null}
      {t > A.komm - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, zIndex: 45 }}>
          <div style={{ display: "flex", ...ps(t, A.komm - 0.08, 14, 0.5) }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#FFF", background: "#141414", borderRadius: "16px 0 0 16px", padding: "20px 18px 20px 28px", display: "flex", alignItems: "center" }}>KOMMENTIERE:</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: "0 16px 16px 0", padding: "10px 28px 10px 30px", display: "flex", alignItems: "center", boxShadow: "0 12px 26px rgba(217,119,87,0.4)", minWidth: 160 }}>{typed("DUET", t, A.komm + 0.05, A.komm + 0.35) || " "}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(20,20,20,0.82)", borderRadius: 999, padding: "10px 22px", ...ps(t, A.komm + 0.15, 8, 0.6) }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.green }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", color: "#FFF" }}>FÜR DEN GUIDE · {NPAGES} SEITEN · PER DM</span>
          </div>
          {t > A.folg - 0.08 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#FFF", borderRadius: 999, padding: "12px 14px 12px 26px", boxShadow: "0 12px 26px rgba(0,0,0,0.25)", ...ps(t, A.folg - 0.08, 10, 0.6) }}>
              <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: PK.ink }}>@florent_preusser</span>
              <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#FFF", background: followed ? C.green : "#3E8EF7", borderRadius: 999, padding: "10px 22px" }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
            </div>
          ) : null}
        </div>
      ) : null}
      <SeamCaption t={t} y={PH + (CHEST_Y - PH) * full} />
    </AbsoluteFill>
  );
};
