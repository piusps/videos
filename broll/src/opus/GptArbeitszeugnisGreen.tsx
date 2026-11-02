import React from "react";
import { Easing, interpolate } from "remotion";
import { Logo } from "../components/PanelKit";
import { Backdrop, bump, Check, Chip, clamp, count, ez, FollowCard, G, GF, Glass, Glint, GreenReel, GreenScene, HW, Odometer, PdfScroll, PopWords, Ripple, Step, TriggerPill, useSp, Word } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpt-arbeitszeugnis/captions.json";

// GPT-N "Arbeitszeugnis in echte Noten" (runs/gpt-arbeitszeugnis, 2026-10-15) im GPT-Look Weiß + Dunkelgrün.
// Times on the tightened timeline; scene-internal times relative to the scene start, from captions.json (noted per beat).
// Grades: BAG 9 AZR 584/13 ("zur vollen Zufriedenheit" = befriedigend), Karrierebibel scale. Answer rows are examples.

const WORDS = captionsJson as Word[];
export const AZ_FRAMES = 936; // tightened.mp4 = 37.45 s @ 25 fps
const AVATAR = { src: "render-gpt-arbeitszeugnis-tightened.mp4", focus: { x: 0.445, y: 0.646 }, scale: 1.08, faceAt: 0.57 }; // facefocus.py 2026-10-15

/** Paper-like glass sheet of a work reference. */
const Sheet: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <Glass style={{ padding: "30px 38px", ...style }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 40, color: G.green, letterSpacing: -1 }}>Arbeitszeugnis</span>
      <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 24, color: G.dim, border: "1.5px solid rgba(11,61,44,0.2)", borderRadius: 999, padding: "4px 14px" }}>Beispiel</span>
    </div>
    {children}
  </Glass>
);
const Line: React.FC<{ w: string; o?: number }> = ({ w, o = 1 }) => <div style={{ height: 14, width: w, borderRadius: 7, background: "rgba(11,61,44,0.12)", marginTop: 14, opacity: o }} />;
/** Text marker that sweeps under a phrase. */
const Mark: React.FC<{ t: number; at: number; children: React.ReactNode }> = ({ t, at, children }) => (
  <span style={{ backgroundImage: `linear-gradient(${G.mint}, ${G.mint})`, backgroundRepeat: "no-repeat", backgroundSize: `${ez(t, at, at + 0.45, Easing.inOut(Easing.quad)) * 100}% 100%`, borderRadius: 6, padding: "0 4px" }}>{children}</span>
);
/** Grade tile: odometer + label. */
const Grade: React.FC<{ t: number; label: string; from: number; to: number; a: number; b: number; size?: number; dark?: boolean }> = ({ t, label, from, to, a, b, size = 120, dark }) => {
  const c = count(t, a, b, to, from);
  const land = bump(t, b, 0.3);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${1 + 0.15 * land})` }}>
      {label ? <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 26, color: G.dim }}>{label}</span> : null}
      <div style={{ background: dark ? G.green : "rgba(255,255,255,0.8)", borderRadius: 28, padding: "10px 30px", boxShadow: "0 16px 34px rgba(11,61,44,0.25)" }}>
        <Odometer value={c.v} speed={c.speed} size={size} color={dark ? G.white : G.green} />
      </div>
    </div>
  );
};

// ---------- 0 · Hook (0; klingt 1.13, Arbeitszeugnis 2.33, Drei 3.40; frame 0 = thumbnail) ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const real = sp(2.6, 11, 240);
  return (
    <>
      <Backdrop t={t} variant={0} />
      <PopWords text="Dein Zeugnis ist schlechter, als du denkst." hi="schlechter" at={-1} style={{ position: "absolute", left: 60, right: 160, top: 110, fontFamily: GF.tight, fontWeight: 900, fontSize: 92, lineHeight: 1.04, letterSpacing: -3, color: G.green }} />
      <Sheet style={{ position: "absolute", left: 60, width: 560, top: 440 }}>
        <div style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 31, lineHeight: 1.4, color: G.ink }}>
          … erledigte die Aufgaben <Mark t={t} at={0.15}>zur vollen Zufriedenheit</Mark>.
        </div>
        <Line w="92%" /><Line w="78%" /><Line w="64%" o={0.7} />
      </Sheet>
      <div style={{ position: "absolute", left: 640, right: 40, top: 430, display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
        <div style={{ opacity: ez(t, 1.1, 1.3), transform: `translateY(${(1 - ez(t, 1.1, 1.4)) * 30}px)` }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 26, color: G.dim }}>klingt nach</span>
            <span style={{ position: "relative", fontFamily: GF.tight, fontWeight: 900, fontSize: 110, color: G.dim, lineHeight: 1 }}>
              1
              <span style={{ position: "absolute", left: -14, right: -14, top: "50%", height: 8, borderRadius: 4, background: G.green, transformOrigin: "0 50%", transform: `scaleX(${ez(t, 3.3, 3.55)}) rotate(-12deg)` }} />
            </span>
          </div>
        </div>
        <div style={{ transform: `scale(${real})`, opacity: Math.min(1, real * 2) }}>
          <Grade t={t} label="echte Note" from={1} to={3} a={2.75} b={3.4} size={150} dark />
        </div>
      </div>
      <Ripple t={t} at={3.4} x={850} y={760} r={260} />
    </>
  );
};

// ---------- 1 · Wohlwollen (6.85; freundlich 0.92, Drei 3.02, Lob 3.44) ----------
const Wohlwollen: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const l = sp(0.3, 13, 200), r = sp(2.6, 11, 240);
  const arrow = ez(t, 2.2, 2.6);
  return (
    <>
      <Backdrop t={t} variant={1} />
      <PopWords text="Freundlich formuliert, trotzdem nur befriedigend" at={0.7} step={0.06} style={{ position: "absolute", left: 60, right: 60, top: 110, fontFamily: GF.tight, fontWeight: 900, fontSize: 68, lineHeight: 1.05, letterSpacing: -2, color: G.green }} />
      <Glass style={{ position: "absolute", left: 60, width: 440, top: 420, padding: "28px 30px", transform: `translateX(${(1 - l) * -600}px) rotate(${(1 - l) * -6}deg)` }}>
        <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 26, color: G.dim }}>Was drinsteht</div>
        <div style={{ fontFamily: GF.tight, fontWeight: 800, fontSize: 44, color: G.ink, lineHeight: 1.15, marginTop: 12 }}>„zur vollen Zufriedenheit“</div>
        <div style={{ marginTop: 16 }}><Chip text="klingt nach Lob" t={t} at={1.2} /></div>
      </Glass>
      <svg style={{ position: "absolute", left: 505, top: 560 }} width={90} height={60} viewBox="0 0 90 60">
        <path d="M5 30 H75 M60 12 L80 30 L60 48" stroke={G.green} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} />
      </svg>
      <Glass style={{ position: "absolute", left: 600, right: 60, top: 420, padding: "28px 30px", transform: `scale(${r})`, opacity: Math.min(1, r * 2) }}>
        <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 26, color: G.dim }}>Was es heißt</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: 8 }}>
          <Grade t={t} label="" from={1} to={3} a={2.6} b={3.0} size={120} dark />
        </div>
        <div style={{ fontFamily: GF.tight, fontWeight: 800, fontSize: 34, color: G.green, marginTop: 10 }}>befriedigend</div>
        <Glint t={t} at={3.1} />
      </Glass>
      <Ripple t={t} at={3.0} x={815} y={600} r={240} />
    </>
  );
};

// ---------- 2 · Notenleiter (10.5; Stets 0.1, Zufriedenheit 1.33, Zwei 2.46, Fehlt 2.9, stets 3.94, Drei 4.93, Personaler 5.35) ----------
const ROWS = [
  { pre: "stets", txt: "zu unserer vollsten Zufriedenheit", g: 1 },
  { pre: "stets", txt: "zu unserer vollen Zufriedenheit", g: 2 },
  { pre: "", txt: "zur vollen Zufriedenheit", g: 3 },
  { pre: "", txt: "zur Zufriedenheit", g: 4 },
];
const Leiter: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const sel = t < 4.85 ? 1 : 2; // highlight moves from "stets … vollen" to "zur vollen" when "Drei" lands
  const strike = ez(t, 3.85, 4.2);
  const hiY = interpolate(t, [4.75, 5.0], [1, 2], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const hiOn = ez(t, 1.25, 1.5);
  return (
    <>
      <Backdrop t={t} variant={2} />
      <PopWords text="Die Notenleiter im Zeugnis" at={0} style={{ position: "absolute", left: 60, right: 60, top: 110, fontFamily: GF.tight, fontWeight: 900, fontSize: 72, letterSpacing: -2.2, color: G.green }} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 240, padding: "18px 26px" }}>
        <div style={{ position: "absolute", left: 14, right: 14, top: 18 + 100 * hiY, height: 92, borderRadius: 22, background: G.green, opacity: hiOn, boxShadow: "0 12px 26px rgba(11,61,44,0.28)" }} />
        {ROWS.map((r, i) => {
          const a = sp(0.15 + i * 0.1, 12, 230);
          const on = hiOn > 0.5 && i === sel;
          return (
            <div key={i} style={{ position: "relative", height: 100, display: "flex", alignItems: "center", gap: 18, padding: "0 16px", transform: `translateX(${(1 - a) * 700}px)`, opacity: Math.min(1, a * 2) }}>
              <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 32, color: on ? G.white : G.ink, flex: 1, whiteSpace: "nowrap" }}>
                {r.pre ? (
                  <span style={{ position: "relative", fontWeight: 800 }}>
                    {r.pre}
                    {i === 1 ? <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 6, borderRadius: 3, background: on ? G.white : G.green, transformOrigin: "0 50%", transform: `scaleX(${strike})` }} /> : null}
                  </span>
                ) : null}
                {r.pre ? " " : ""}{r.txt}
              </span>
              <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 56, color: on ? G.white : G.green, width: 60, textAlign: "center" }}>{r.g}</span>
            </div>
          );
        })}
      </Glass>
      <Ripple t={t} at={2.46} x={930} y={390} r={160} />
      <Ripple t={t} at={4.93} x={930} y={490} r={220} />
      <div style={{ position: "absolute", left: 60, top: 720, display: "flex", gap: 16 }}>
        <Chip text="ohne „stets“ eine Note schlechter" t={t} at={4.0} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 810 }}><Chip text="Personaler lesen das sofort" t={t} at={5.3} /></div>
    </>
  );
};

// ---------- 3 · Erstens: Foto, Namen schwärzen (18.1; Foto 0.97, schwärz 2.25, Namen 3.24) ----------
const Foto: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const card = sp(0.3, 13, 190);
  const flash = Math.max(0, 1 - Math.abs(t - 1.0) / 0.12) * 0.85;
  const bar = ez(t, 2.3, 2.75, Easing.inOut(Easing.cubic));
  return (
    <>
      <Backdrop t={t} variant={0} />
      <Step n={1} text="Foto machen" at={0} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 250, transform: `translateY(${(1 - card) * 500}px) rotate(${(1 - card) * 5 - 2}deg) scale(${1 - 0.04 * bump(t, 0.98, 0.25)})` }}>
        <Sheet>
          <div style={{ position: "relative", display: "inline-block", fontFamily: GF.tight, fontWeight: 800, fontSize: 40, color: G.ink }}>
            Max Mustermann
            <span style={{ position: "absolute", left: -8, top: -4, bottom: -4, width: `calc(${bar * 100}% + 16px)`, background: G.ink, borderRadius: 8 }} />
          </div>
          <div style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 28, lineHeight: 1.4, color: G.ink, marginTop: 12 }}>war vom 01.03.2021 bis 30.09.2026 bei uns beschäftigt …</div>
          <Line w="94%" /><Line w="86%" /><Line w="70%" o={0.7} />
        </Sheet>
        <div style={{ position: "absolute", inset: -10, borderRadius: 40, border: `6px solid ${G.green}`, opacity: ez(t, 0.75, 0.95) * (1 - ez(t, 1.6, 1.9)) }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: flash, zIndex: 40 }} />
      <Ripple t={t} at={1.0} x={540} y={430} r={360} />
      <div style={{ position: "absolute", left: 60, top: 760 }}><Chip text="Namen schwärzen" t={t} at={2.4} /></div>
    </>
  );
};

// ---------- ChatGPT composer with attachment ----------
const Q = "Übersetz jeden Satz in eine Schulnote und markier alles, was mich schlechter macht.";
const Prompt: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const att = sp(0.45, 11, 240);
  const typed = Q.slice(0, Math.floor(Q.length * interpolate(t, [2.5, 6.0], [0, 1], { ...clamp, easing: Easing.linear })));
  const send = bump(t, 6.15, 0.3);
  return (
    <>
      <Backdrop t={t} variant={1} />
      <Step n={2} text="An ChatGPT schicken" at={0} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 250, padding: "26px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <Logo name="openai" size={44} tile={false} />
          <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 30, color: G.ink }}>ChatGPT</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, transform: `scale(${att})`, opacity: Math.min(1, att * 2), transformOrigin: "0 50%" }}>
          <div style={{ width: 92, height: 120, borderRadius: 14, background: "rgba(255,255,255,0.9)", border: "2px solid rgba(11,61,44,0.15)", padding: "12px 10px", boxSizing: "border-box" }}>
            <div style={{ height: 10, width: "70%", background: G.green, borderRadius: 4 }} />
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ height: 7, width: `${90 - i * 12}%`, background: "rgba(11,61,44,0.15)", borderRadius: 4, marginTop: 9 }} />)}
          </div>
          <div>
            <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: G.ink }}>Zeugnis.jpg</div>
            <div style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 24, color: G.dim }}>Name geschwärzt</div>
          </div>
        </div>
        <div style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 38, lineHeight: 1.32, color: typed ? G.ink : "#8A9A94", minHeight: 150 }}>{typed || "Frag irgendwas"}<span style={{ color: G.green, opacity: Math.floor(t * 3) % 2 }}>|</span></div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: typed ? G.green : "#C7D3CE", color: G.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.tight, fontWeight: 900, fontSize: 34, transform: `scale(${1 + 0.25 * send})` }}>↑</div>
        </div>
        <Glint t={t} at={6.2} />
      </Glass>
      <Ripple t={t} at={6.15} x={950} y={720} r={150} />
      <div style={{ position: "absolute", left: 60, top: 820, display: "flex", gap: 16 }}>
        <Chip text="jeder Satz eine Note" t={t} at={4.0} />
        <Chip text="alles markiert" t={t} at={5.3} />
      </div>
    </>
  );
};

// ---------- 4 · Drittens: Gesamtnote + bessere Sätze (28.0; Gesamtnote 1.0, bessere 2.16, Chef 3.79) ----------
// only sourced grades as numbers; the closing line is a flag, not a grade
const ANSWER = [
  { k: "Arbeitsweise", v: "zur vollen Zufriedenheit", g: "3" },
  { k: "Ergebnisse", v: "stets zu unserer vollen …", g: "2" },
  { k: "Schlusssatz", v: "kein Bedauern, kein Dank", g: "!" },
];
const Ergebnis: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const total = count(t, 0.9, 1.7, 2.7, 1);
  const better = sp(2.15, 11, 240);
  return (
    <>
      <Backdrop t={t} variant={2} />
      <Step n={3} text="Gesamtnote holen" at={0} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 250, padding: "18px 30px 22px" }}>
        {ANSWER.map((r, i) => {
          const a = sp(0.2 + i * 0.15, 12, 230);
          return (
            <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderTop: i ? "2px solid rgba(11,61,44,0.1)" : "none", transform: `translateX(${(1 - a) * 700}px)`, opacity: Math.min(1, a * 2) }}>
              <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 26, color: G.dim, width: 170 }}>{r.k}</span>
              <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 30, color: G.ink, flex: 1 }}>{r.v}</span>
              <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 46, color: G.green, width: 50, textAlign: "center" }}>{r.g}</span>
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, paddingTop: 14, borderTop: `3px solid ${G.green}` }}>
          <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 40, color: G.green }}>Gesamtnote</span>
          <div style={{ transform: `scale(${1 + 0.15 * bump(t, 1.7, 0.3)})`, transformOrigin: "100% 50%" }}><Odometer value={total.v} speed={total.speed} decimals={1} size={70} /></div>
        </div>
        <Glint t={t} at={1.75} />
      </Glass>
      <Ripple t={t} at={1.7} x={900} y={590} r={200} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 700, padding: "18px 26px", transform: `translateY(${(1 - better) * 300}px)`, opacity: Math.min(1, better * 2) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Check size={44} p={ez(t, 2.3, 2.6)} />
          <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 30, color: G.ink }}>Besser: „<b style={{ color: G.green }}>stets</b> zu unserer vollen Zufriedenheit“</span>
        </div>
      </Glass>
      <div style={{ position: "absolute", left: 60, top: 840 }}><Chip text="freundlich beim alten Chef anfragen" t={t} at={3.7} /></div>
    </>
  );
};

const SCENES: GreenScene[] = [
  { start: 0, end: 4.5, El: Hook },
  { start: 6.85, end: 10.5, El: Wohlwollen },
  { start: 10.5, end: 17.0, El: Leiter, joinPrev: true },
  { start: 18.1, end: 21.6, El: Foto },
  { start: 21.6, end: 28.0, El: Prompt, joinPrev: true },
  { start: 28.0, end: 32.5, El: Ergebnis, joinPrev: true },
];

const PAGES = [1, 2, 3, 4, 5, 6, 7].map((n) => `az-guide/p${n}.png`);
const GUIDE_IN = 32.8; // "komplette Notentabelle" 33.02
const GUIDE_OUT = 35.25; // before "folg" 35.40
const FOLG = 35.4, WORD_AT = 36.17;

export const GptArbeitszeugnisGreen: React.FC = () => (
  <GreenReel
    avatar={AVATAR}
    scenes={SCENES}
    words={WORDS}
    overlay={(t) => (
      <>
        <PdfScroll t={t} pages={PAGES} title="Zeugnis – Notentabelle.pdf" inAt={GUIDE_IN} outAt={GUIDE_OUT} />
        <TriggerPill t={t} at={FOLG - 0.05} word="Zeugnis" top={360} />
        <FollowCard t={t} followAt={FOLG} wordAt={WORD_AT} word="Zeugnis" />
        <Ripple t={t} at={WORD_AT} x={HW / 2} y={680} r={260} />
      </>
    )}
  />
);
