import React from "react";
import { Easing } from "remotion";
import { Backdrop, bump, Check, count, ez, G, GF, Glass, Glint, GreenReel, GreenScene, Odometer, PopWords, Ripple, useSp, Word } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpts-ki-workshop/captions.json";

// GPT-S Gründer-Satire "KI-Workshop" (Gesetz der Trivialität), runs/gpts-ki-workshop, 2026-10-18.
// Same build as GptParkinsonGreen / GptJevonsGreen: look c4f527e4 (turquoise), GptGreenKit panels, calm full-frame punchline.

const WORDS = captionsJson as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WORDS) if (norm(x.text) === w && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const END = WORDS[WORDS.length - 1].endMs / 1000;
export const WS_FRAMES = Math.round((END + 0.9) * 25);
const AVATAR = { src: "gpts-ki-workshop/avatar.mp4", focus: { x: 0.445, y: 0.646 }, scale: 1.08, faceAt: 0.57 };

const A = {
  chef: at("chef"), ich: at("ich"), verkauft: at("verkauft"), erst: at("erst"), dreihundert: at("dreihundert"), lizenzen: at("lizenzen"), benutzt: at("benutzt"), vier: at("vier"),
  dann: at("dann"), workshop: at("workshop"), stunden: at("stunden"), strategie: at("strategie"), diskutiert: at("diskutiert"), frage: at("frage"), chatbot: at("chatbot"),
  das2: at("das", 2), gesetz: at("gesetz"), atom: at("atomkraftwerk"), fuenf: at("fünf"), minuten: at("minuten"), schuppen1: at("fahrradschuppen", 1), streitet: at("streitet"),
  schuppen2: at("fahrradschuppen", 2), jeder: at("jeder"), mitreden: at("mitreden"),
  kalle: at("kalle"), hund: at("hund"), naechste: at("nächste"), logo: at("logo"), rechne: at("rechne"),
};

const LINE = "rgba(11,61,44,0.12)";
const Tag: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: G.white, background: G.green, borderRadius: 10, padding: "8px 14px", whiteSpace: "nowrap", ...style }}>{text}</span>
);
const Bubble: React.FC<{ who: string; text: string; style?: React.CSSProperties }> = ({ who, text, style }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, ...style }}>
    <div style={{ width: 56, height: 56, borderRadius: "50%", background: G.mint, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.tight, fontWeight: 800, fontSize: 26, color: G.green, flexShrink: 0 }}>{who}</div>
    <div style={{ background: G.white, border: `1.5px solid ${LINE}`, borderRadius: 22, borderBottomLeftRadius: 6, padding: "14px 20px", fontFamily: GF.inter, fontWeight: 600, fontSize: 30, color: G.ink, boxShadow: "0 10px 24px rgba(11,61,44,0.1)" }}>{text}</div>
  </div>
);

// ---------- 1 · Hook: the boss wants "something with AI", I sell it to him (0 → "Erst") ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const inv = sp(A.ich - 0.1, 11, 230);
  const eur = count(t, A.ich, A.verkauft + 0.3, 24800, 0);
  return (
    <>
      <Backdrop t={t} variant={0} />
      <PopWords text="Dein Chef will KI. Ich verkauf sie ihm." hi="verkauf" at={-1} style={{ position: "absolute", left: 60, right: 60, top: 96, fontFamily: GF.tight, fontWeight: 900, fontSize: 84, lineHeight: 1.04, letterSpacing: -3, color: G.green }} />
      <div style={{ position: "absolute", left: 60, top: 420 }}><Bubble who="C" text="Wir müssen jetzt was mit KI machen!" /></div>
      <Glass style={{ position: "absolute", left: 420, right: 60, top: 560, padding: "26px 30px", transform: `translateY(${(1 - inv) * 60}px) scale(${0.9 + 0.1 * inv})`, opacity: Math.min(1, inv * 2) }}>
        <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: G.dim }}>ANGEBOT · KI-TRANSFORMATION</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
          <Odometer value={Math.round(eur.v)} speed={eur.speed} size={80} suffix=" €" />
        </div>
        <div style={{ marginTop: 10 }}><Tag text="LIZENZEN + WORKSHOP" /></div>
        <Glint t={t} at={A.verkauft + 0.3} />
      </Glass>
      <Ripple t={t} at={A.verkauft + 0.3} x={760} y={680} r={220} />
    </>
  );
};

// ---------- 2 · 300 licences, 4 used ----------
const Lizenzen: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const lic = count(t, T(A.dreihundert) - 0.2, T(A.lizenzen) + 0.4, 300, 0);
  const used = t > T(A.vier) - 0.1;
  const DOTS = 300;
  return (
    <>
      <Backdrop t={t} variant={1} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 80, display: "flex", gap: 20 }}>
        <Glass style={{ flex: 1, padding: "20px 26px" }}>
          <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: G.dim }}>LIZENZEN GEKAUFT</div>
          <Odometer value={Math.round(lic.v)} speed={lic.speed} size={90} />
        </Glass>
        <Glass style={{ flex: 1, padding: "20px 26px", background: used ? "rgba(11,61,44,0.92)" : undefined, opacity: ez(t, T(A.benutzt) - 0.2, T(A.benutzt)) }}>
          <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: used ? G.mint : G.dim }}>AKTIV GENUTZT</div>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 90, color: used ? G.white : G.ink, lineHeight: 1.1, transform: `scale(${1 + 0.2 * bump(t, T(A.vier), 0.35)})`, transformOrigin: "0 50%" }}>{used ? 4 : "…"}</div>
        </Glass>
      </div>
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 330, height: 520, padding: 26 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Array.from({ length: DOTS }, (_, i) => {
            const on = i < Math.round(lic.v);
            const active = used && i < 4;
            return <span key={i} style={{ width: 40, height: 40, borderRadius: 10, background: active ? G.green : on ? (used ? "rgba(11,61,44,0.08)" : G.mint) : "transparent", transition: "none" }} />;
          })}
        </div>
      </Glass>
    </>
  );
};

// ---------- 3 · two-hour workshop, the only question: what is the chatbot called ----------
const NAMES = [{ n: "FirmenBrain", v: 0.22 }, { n: "AskMax", v: 0.31 }, { n: "Kalle", v: 0.18 }, { n: "Lumi", v: 0.29 }];
const Workshop: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const cal = sp(0.05, 12, 220);
  const pollIn = ez(t, T(A.frage) - 0.1, T(A.frage) + 0.2);
  const hrs = Math.min(120, Math.max(0, (t - T(A.diskutiert)) * 40));
  const wobble = (i: number) => 0.06 * Math.sin(t * 3 + i * 1.7);
  return (
    <>
      <Backdrop t={t} variant={2} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 70, padding: "20px 26px", display: "flex", alignItems: "center", gap: 22, transform: `scale(${cal})` }}>
        <div style={{ width: 100, height: 110, borderRadius: 16, border: `2px solid ${LINE}`, overflow: "hidden", textAlign: "center", flexShrink: 0 }}>
          <div style={{ background: G.green, color: G.white, fontFamily: GF.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", padding: "4px 0" }}>DO</div>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 52, color: G.ink }}>14</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 46, color: G.ink }}>Workshop: KI-Strategie</div>
          <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 26, color: G.dim }}>09:00 – 11:00 · 2 Stunden · 14 Teilnehmer</div>
        </div>
        {t > T(A.diskutiert) - 0.1 ? <div style={{ textAlign: "right" }}><div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 16, letterSpacing: "0.12em", color: G.dim }}>DISKUTIERT</div><div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 40, color: G.green }}>{Math.floor(hrs / 60)}:{String(Math.round(hrs % 60)).padStart(2, "0")} h</div></div> : null}
      </Glass>
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 290, padding: "26px 30px", opacity: pollIn, transform: `translateY(${(1 - pollIn) * 40}px)` }}>
        <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 44, color: G.ink }}>Wie soll unser Chatbot heißen?</div>
        {NAMES.map((x, i) => {
          const w = Math.max(0.05, x.v + wobble(i)) * ez(t, T(A.frage) + 0.1 + i * 0.1, T(A.chatbot) + 0.4);
          return (
            <div key={x.n} style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: GF.inter, fontWeight: 700, fontSize: 30, color: G.ink }}><span>{x.n}</span><span style={{ fontFamily: GF.mono, color: G.dim }}>{Math.round(w * 100)} %</span></div>
              <div style={{ height: 22, borderRadius: 11, background: "rgba(11,61,44,0.07)", marginTop: 6 }}><div style={{ width: `${w * 260}%`, maxWidth: "100%", height: "100%", borderRadius: 11, background: i === 2 ? G.green : G.mint }} /></div>
            </div>
          );
        })}
      </Glass>
    </>
  );
};

// ---------- 4 · law of triviality: nuclear plant in 5 minutes, bike shed all day ----------
const Gesetz: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const term = sp(T(A.gesetz) - 0.05, 11, 230);
  const atomIn = ez(t, T(A.atom) - 0.15, T(A.atom) + 0.15);
  const shedIn = ez(t, T(A.schuppen1) - 0.15, T(A.schuppen1) + 0.15);
  const shedH = Math.min(8, Math.max(0, (t - T(A.streitet)) * 6));
  const crowd = t > T(A.jeder) - 0.1;
  return (
    <>
      <Backdrop t={t} variant={3} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 70, textAlign: "center" }}>
        <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: G.dim }}>DAS NENNT MAN</div>
        <div style={{ display: "inline-block", marginTop: 12, transform: `scale(${term})`, opacity: Math.min(1, term * 2) }}>
          <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 92, color: G.green, letterSpacing: -3, lineHeight: 1 }}>Gesetz der Trivialität</span>
          <div style={{ height: 10, borderRadius: 5, background: G.mint, marginTop: 8, transformOrigin: "0 50%", transform: `scaleX(${ez(t, T(A.gesetz) + 0.3, T(A.gesetz) + 0.8)})` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 330, display: "flex", gap: 24 }}>
        <Glass style={{ flex: 1, padding: "26px 28px", opacity: atomIn, transform: `translateY(${(1 - atomIn) * 40}px)` }}>
          <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: G.dim }}>ATOMKRAFTWERK</div>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 70, color: G.ink, marginTop: 8 }}>5 Min</div>
          {t > T(A.minuten) ? <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}><Check size={40} p={ez(t, T(A.minuten), T(A.minuten) + 0.3)} /><span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 26, color: G.green }}>durchgewunken</span></div> : null}
        </Glass>
        <Glass style={{ flex: 1, padding: "26px 28px", opacity: shedIn, transform: `translateY(${(1 - shedIn) * 40}px)`, background: shedH > 1 ? "rgba(11,61,44,0.92)" : undefined }}>
          <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: shedH > 1 ? G.mint : G.dim }}>FAHRRADSCHUPPEN</div>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 70, color: shedH > 1 ? G.white : G.ink, marginTop: 8 }}>{shedH.toFixed(0)} Std</div>
          {shedH > 1 ? <div style={{ marginTop: 10 }}><Tag text="NOCH OFFEN" style={{ background: G.white, color: G.green }} /></div> : null}
        </Glass>
      </div>
      {crowd ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: 640, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["Lieber grün?", "Holz!", "Mit Dach?", "Ich hätte da eine Idee", "Und die Farbe?"].map((x, i) => (
            <div key={i} style={{ background: G.white, border: `2px solid ${LINE}`, borderRadius: 18, padding: "10px 16px", fontFamily: GF.inter, fontWeight: 600, fontSize: 26, color: G.ink, boxShadow: "0 8px 18px rgba(11,61,44,0.1)", opacity: ez(t, T(A.jeder) - 0.1 + i * 0.1, T(A.jeder) + 0.05 + i * 0.1), transform: `scale(${0.85 + 0.15 * ez(t, T(A.jeder) - 0.1 + i * 0.1, T(A.jeder) + 0.1 + i * 0.1)})` }}>{x}</div>
          ))}
        </div>
      ) : null}
    </>
  );
};

const SCENES: GreenScene[] = [
  { start: 0, end: A.erst - 0.12, El: Hook },
  { start: A.erst - 0.12, end: A.dann + 0.35, El: (p) => <Lizenzen t={p.t} s={A.erst - 0.12} />, joinPrev: true },
  { start: A.dann + 0.35, end: A.das2 - 0.12, El: (p) => <Workshop t={p.t} s={A.dann + 0.35} />, joinPrev: true },
  { start: A.das2 - 0.12, end: A.kalle - 0.35, El: (p) => <Gesetz t={p.t} s={A.das2 - 0.12} />, joinPrev: true },
];

/** Punchline in full frame: name badge, then the invoice per hour; above the head, never over the face. */
const Pointe: React.FC<{ t: number }> = ({ t }) => {
  if (t < A.kalle - 0.25) return null;
  const a = ez(t, A.kalle - 0.2, A.kalle + 0.15);
  const inv = ez(t, A.logo - 0.1, A.logo + 0.25);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center", gap: 18, opacity: a, transform: `translateY(${(1 - a) * 16}px)` }}>
      <Glass style={{ padding: "18px 26px", borderRadius: 24, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 16, background: G.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.tight, fontWeight: 900, fontSize: 30, color: G.white }}>K</div>
        <div>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 42, color: G.ink }}>Kalle</div>
          <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 20, color: G.dim, opacity: ez(t, A.hund - 0.1, A.hund + 0.2) }}>wie der Hund vom Chef</div>
        </div>
      </Glass>
      {t > A.logo - 0.15 ? (
        <Glass style={{ padding: "18px 24px", borderRadius: 24, opacity: inv, transform: `scale(${0.9 + 0.1 * inv})` }}>
          <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 16, letterSpacing: "0.12em", color: G.dim }}>NÄCHSTE WOCHE</div>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 34, color: G.ink }}>Workshop: Logo</div>
          {t > A.rechne - 0.1 ? <div style={{ marginTop: 6, opacity: ez(t, A.rechne - 0.1, A.rechne + 0.15) }}><Tag text="PRO STUNDE" style={{ fontSize: 18 }} /></div> : null}
        </Glass>
      ) : null}
    </div>
  );
};

export const GptWorkshopGreen: React.FC = () => <GreenReel avatar={AVATAR} scenes={SCENES} words={WORDS} overlay={(t) => <Pointe t={t} />} />;
