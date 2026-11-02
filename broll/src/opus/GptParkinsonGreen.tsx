import React from "react";
import { Easing } from "remotion";
import { Backdrop, bump, Check, count, ez, G, GF, Glass, Glint, GreenReel, GreenScene, HW, Odometer, PopWords, Ripple, useSp, Word } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpts-effekt-parkinson/captions.json";

// GPT-S Effekt-Satire "Parkinsonsches Gesetz" (Umzug), runs/gpts-effekt-parkinson, 2026-10-17.
// Same build as GptJevonsGreen: look c4f527e4 (turquoise), white + dark green GptGreenKit panels, calm full-frame punchline.
// All times anchored to word starts on the tightened timeline (captions.json). Scene-internal t is relative to the scene start.

const WORDS = captionsJson as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WORDS) if ((w === "parkinson" ? norm(x.text).startsWith(w) : norm(x.text) === w) && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const END = WORDS[WORDS.length - 1].endMs / 1000;
export const PK_FRAMES = Math.round((END + 0.9) * 25);
const AVATAR = { src: "gpts-effekt-parkinson/avatar.mp4", focus: { x: 0.445, y: 0.646 }, scale: 1.08, faceAt: 0.57 };

const A = {
  zwei: at("zwei"), wochen: at("wochen"), umzug: at("umzug"), gepackt: at("gepackt"), letzten: at("letzten"), abend: at("abend"),
  drei: at("drei"), stunden: at("stunden"), oekonomen: at("ökonomen"), parkinson: at("parkinson"), arbeit: at("arbeit"), dauert: at("dauert"),
  zeit2: at("zeit", 2), da: at("da"), und: at("und"), chatgpt: at("chatgpt"), praesentation: at("präsentation"), zehn: at("zehn"), minuten: at("minuten"),
  abgabe: at("abgabe"), freitag1: at("freitag", 1), also: at("also"), farbe: at("farbe"), folien: at("folien"), dann: at("dann"), schriftart: at("schriftart"),
  freitag2: at("freitag", 2), vier: at("vier"), fertig: at("fertig"), genau3: at("genau", 3), geplant: at("geplant"),
  lenas: at("lenas"), kartons: at("umzugskartons"), ausgepackt: at("ausgepackt"), noch: at("noch"), zeit3: at("zeit", 3),
};

const LINE = "rgba(11,61,44,0.12)";
const Tag: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: G.white, background: G.green, borderRadius: 10, padding: "8px 14px", whiteSpace: "nowrap", ...style }}>{text}</span>
);
const Box: React.FC<{ s: number; label?: string; style?: React.CSSProperties }> = ({ s, label, style }) => (
  <div style={{ width: s, height: s * 0.78, borderRadius: 8, background: "#D9B98A", border: "3px solid #B8925C", boxSizing: "border-box", position: "relative", boxShadow: "0 8px 18px rgba(11,61,44,0.15)", ...style }}>
    <div style={{ position: "absolute", left: "45%", width: "10%", top: 0, bottom: 0, background: "rgba(184,146,92,0.55)" }} />
    {label ? <div style={{ position: "absolute", left: 8, bottom: 8, fontFamily: GF.mono, fontWeight: 800, fontSize: s * 0.11, color: "#6B4E25" }}>{label}</div> : null}
  </div>
);

// ---------- 1 · Hook: two weeks, packed on the last evening in three hours (0 → "Ökonomen") ----------
const DAYS = 14;
const Hook: React.FC<{ t: number }> = ({ t }) => {
  // the days fly by until "letzten Abend", progress stays flat, then jumps to 100 % on "drei Stunden"
  const dayP = ez(t, 0.2, A.letzten, Easing.inOut(Easing.quad));
  const day = Math.max(1, Math.min(DAYS, Math.ceil(dayP * DAYS)));
  const prog = count(t, A.drei - 0.1, A.stunden + 0.5, 100, 0);
  const boxes = Math.round(ez(t, A.drei - 0.1, A.stunden + 0.5) * 8);
  return (
    <>
      <Backdrop t={t} variant={0} />
      <PopWords text="Mehr Zeit macht dich nicht schneller." hi="nicht" at={-1} style={{ position: "absolute", left: 60, right: 60, top: 96, fontFamily: GF.tight, fontWeight: 900, fontSize: 84, lineHeight: 1.04, letterSpacing: -3, color: G.green }} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 390, height: 480, padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: G.dim }}>LENAS UMZUG</div>
            <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 52, color: G.ink, letterSpacing: -1 }}>Tag {day} von {DAYS}</div>
          </div>
          <Tag text={t > A.letzten - 0.1 ? "LETZTER ABEND" : "NOCH VIEL ZEIT"} style={{ background: t > A.letzten - 0.1 ? G.ink : G.green }} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
          {Array.from({ length: DAYS }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 42, borderRadius: 8, background: i < day ? (i === DAYS - 1 && t > A.letzten - 0.1 ? G.green : G.mint) : "rgba(11,61,44,0.07)" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 28 }}>
          <div>
            <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", color: G.dim }}>GEPACKT</div>
            <div style={{ transform: `scale(${1 + 0.15 * bump(t, A.stunden + 0.45, 0.35)})`, transformOrigin: "0 100%" }}><Odometer value={Math.round(prog.v)} speed={prog.speed} size={110} suffix=" %" /></div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap-reverse", gap: 10, width: 430, justifyContent: "flex-end" }}>
            {Array.from({ length: boxes }, (_, i) => <Box key={i} s={96} />)}
          </div>
        </div>
        {t > A.drei - 0.1 ? <div style={{ position: "absolute", right: 32, top: 120, opacity: ez(t, A.drei - 0.1, A.drei + 0.1) }}><Tag text="IN 3 STUNDEN" /></div> : null}
      </Glass>
      <Ripple t={t} at={A.stunden + 0.5} x={300} y={760} r={220} />
    </>
  );
};

// ---------- 2 · the law: work fills the time available ----------
const Gesetz: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const term = sp(T(A.parkinson) - 0.05, 11, 230);
  const zeitW = ez(t, T(A.zeit2) - 0.2, T(A.da) + 0.2, Easing.inOut(Easing.cubic));
  const arbW = ez(t, T(A.dauert) - 0.1, T(A.da) + 0.35, Easing.inOut(Easing.cubic));
  return (
    <>
      <Backdrop t={t} variant={2} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 100, textAlign: "center" }}>
        <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.16em", color: G.dim, opacity: ez(t, 0, 0.3) }}>ÖKONOMEN NENNEN DAS</div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 18, transform: `scale(${term})`, opacity: Math.min(1, term * 2) }}>
          <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 104, color: G.green, letterSpacing: -4, lineHeight: 1 }}>Parkinsonsches Gesetz</span>
          <div style={{ height: 10, borderRadius: 5, background: G.mint, marginTop: 8, transformOrigin: "0 50%", transform: `scaleX(${ez(t, T(A.parkinson) + 0.3, T(A.parkinson) + 0.8)})` }} />
        </div>
      </div>
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 420, padding: "34px 36px", opacity: ez(t, T(A.arbeit) - 0.2, T(A.arbeit)) }}>
        {[{ l: "Zeit, die da ist", w: zeitW, c: G.mint, tc: G.ink }, { l: "Arbeit", w: arbW, c: G.green, tc: G.white }].map((b, i) => (
          <div key={i} style={{ marginTop: i ? 28 : 0 }}>
            <div style={{ fontFamily: GF.tight, fontWeight: 800, fontSize: 40, color: G.ink, marginBottom: 12 }}>{b.l}</div>
            <div style={{ height: 64, borderRadius: 16, background: "rgba(11,61,44,0.07)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.max(8, b.w * 100)}%`, background: b.c, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 18, boxSizing: "border-box" }}>
                <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 24, color: b.tc }}>{i ? `${Math.round(1 + 13 * b.w)} TAGE` : "14 TAGE"}</span>
              </div>
            </div>
          </div>
        ))}
        {t > T(A.da) + 0.3 ? <div style={{ position: "absolute", right: 36, top: 26, opacity: ez(t, T(A.da) + 0.3, T(A.da) + 0.5) }}><Tag text="IMMER GLEICH LANG" /></div> : null}
      </Glass>
    </>
  );
};

// ---------- 3 · ChatGPT: deck in 10 minutes, deadline Friday, five days of colours and fonts ----------
const SWATCH = ["#0B3D2C", "#2F6BFF", "#E5484D", "#F5B400", "#7B61FF", "#1E9E57"];
const FONTS = ["Arial", "Helvetica", "Calibri", "Futura", "Comic Sans", "Arial"];
const Team: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const mins = count(t, T(A.zehn) - 0.3, T(A.minuten) + 0.4, 10, 0);
  const deckIn = sp(0.05, 12, 220);
  const deadline = sp(T(A.abgabe) - 0.05, 11, 220);
  const debate = t > T(A.also) - 0.1;
  const day = Math.min(5, Math.max(1, Math.ceil(ez(t, T(A.also), T(A.freitag2) - 0.2) * 5)));
  const colorI = Math.floor(Math.max(0, t - T(A.farbe)) * 5) % SWATCH.length;
  const fontI = Math.floor(Math.max(0, t - T(A.schriftart)) * 4) % FONTS.length;
  const done = t > T(A.fertig) - 0.05;
  const slideColor = t > T(A.farbe) - 0.05 ? SWATCH[colorI] : G.green;
  const slideFont = t > T(A.schriftart) - 0.05 ? FONTS[fontI] : "Inter";
  return (
    <>
      <Backdrop t={t} variant={3} />
      {/* top row: ChatGPT timer + deadline */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 70, display: "flex", gap: 20, alignItems: "stretch" }}>
        <Glass style={{ flex: 1, padding: "18px 24px", transform: `scale(${deckIn})` }}>
          <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: G.dim }}>CHATGPT BAUT DIE FOLIEN</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6 }}>
            <Odometer value={Math.round(mins.v)} speed={mins.speed} size={64} suffix=" Min" />
            {t > T(A.minuten) + 0.35 ? <Check size={46} p={ez(t, T(A.minuten) + 0.35, T(A.minuten) + 0.7)} /> : null}
          </div>
        </Glass>
        <Glass style={{ flex: 1, padding: "18px 24px", transform: `scale(${deadline})`, opacity: Math.min(1, deadline * 2), background: done ? "rgba(11,61,44,0.92)" : undefined }}>
          <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: done ? G.mint : G.dim }}>{debate ? `MEETING-TAG ${day} / 5` : "ABGABE"}</div>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 60, color: done ? G.white : G.ink, letterSpacing: -1.5, marginTop: 4 }}>{done ? "Fr, 16:00 ✓" : "Freitag"}</div>
        </Glass>
      </div>
      {/* the slide that is "finished" after 10 min and then debated for 5 days */}
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 280, height: 420, padding: 0, transform: `scale(${deckIn})` }}>
        <div style={{ position: "absolute", inset: 22, borderRadius: 18, background: G.white, border: `2px solid ${LINE}`, overflow: "hidden" }}>
          <div style={{ height: 120, background: slideColor, display: "flex", alignItems: "center", padding: "0 34px" }}>
            <span style={{ fontFamily: slideFont === "Inter" ? GF.inter : slideFont, fontWeight: 700, fontSize: 52, color: G.white, whiteSpace: "nowrap" }}>Q4 Strategie</span>
          </div>
          {[88, 72, 80, 56].map((w, i) => <div key={i} style={{ height: 22, width: `${w}%`, margin: "22px 34px 0", borderRadius: 11, background: "rgba(11,61,44,0.1)", opacity: ez(t, 0.2 + i * 0.15, 0.4 + i * 0.15) }} />)}
          {t > T(A.minuten) + 0.35 ? <div style={{ position: "absolute", right: 24, bottom: 20, opacity: ez(t, T(A.minuten) + 0.35, T(A.minuten) + 0.6) }}><Tag text="FERTIG NACH 10 MIN" /></div> : null}
        </div>
      </Glass>
      {/* the debate: comment bubbles about colour and font */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 730, display: "flex", gap: 14, flexWrap: "nowrap" }}>
        {[
          { a: T(A.farbe) - 0.05, x: "Lieber dunkler?" },
          { a: T(A.folien) + 0.1, x: "Mehr Blau." },
          { a: T(A.schriftart) - 0.05, x: "Andere Schrift?" },
          { a: T(A.schriftart) + 0.45, x: "Doch Arial." },
        ].map((b, i) => (t > b.a ? (
          <div key={i} style={{ background: G.white, border: `2px solid ${LINE}`, borderRadius: 18, borderTopLeftRadius: 6, padding: "12px 18px", fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: G.ink, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(11,61,44,0.12)", transform: `scale(${0.85 + 0.15 * ez(t, b.a, b.a + 0.2)})`, opacity: ez(t, b.a, b.a + 0.15) }}>{b.x}</div>
        ) : null))}
      </div>
      {done ? <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center" }}><div style={{ transform: `scale(${sp(T(A.genau3) - 0.05, 9, 260)}) rotate(-6deg)`, background: G.green, color: G.white, fontFamily: GF.tight, fontWeight: 900, fontSize: 64, borderRadius: 18, padding: "10px 28px", boxShadow: "0 18px 40px rgba(11,61,44,0.3)" }}>Genau wie geplant.<Glint t={t} at={T(A.genau3) + 0.3} /></div></div> : null}
    </>
  );
};

const SCENES: GreenScene[] = [
  { start: 0, end: A.oekonomen - 0.15, El: Hook },
  { start: A.oekonomen - 0.15, end: A.und - 0.1, El: (p) => <Gesetz t={p.t} s={A.oekonomen - 0.15} />, joinPrev: true },
  // "Und genau deshalb macht KI deine Firma nicht schneller." = Vollbild
  { start: A.chatgpt - 0.15, end: A.lenas - 0.2, El: (p) => <Team t={p.t} s={A.chatgpt - 0.15} /> },
];

/** Punchline in full frame: small card above the head, never over the face. */
const Pointe: React.FC<{ t: number }> = ({ t }) => {
  if (t < A.kartons - 0.3) return null;
  const a = ez(t, A.kartons - 0.25, A.kartons + 0.1);
  const zeit = ez(t, A.zeit3 - 0.1, A.zeit3 + 0.2);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", opacity: a, transform: `translateY(${(1 - a) * 16}px)` }}>
      <Glass style={{ padding: "22px 28px", borderRadius: 26, display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ display: "flex", gap: 8 }}>{[0, 1, 2].map((i) => <Box key={i} s={70} />)}</div>
        <div>
          <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: G.dim }}>AUSGEPACKT</div>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 48, color: G.ink }}>0 von 27</div>
        </div>
        {t > A.zeit3 - 0.1 ? <div style={{ opacity: zeit }}><Tag text="NOCH ZEIT" /></div> : null}
      </Glass>
    </div>
  );
};

export const GptParkinsonGreen: React.FC = () => <GreenReel avatar={AVATAR} scenes={SCENES} words={WORDS} overlay={(t) => <Pointe t={t} />} />;
void HW;
