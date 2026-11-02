import React from "react";
import { Backdrop, bump, Check, count, ez, G, GF, Glass, Glint, GreenReel, GreenScene, Odometer, PopWords, Ripple, useSp, Word } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpts-benefits/captions.json";

// GPT-S Satire-Urteil v5 "Benefits statt Gehalt" (kompensierende Lohndifferenziale), runs/gpts-benefits, 2026-10-20.
// Same build as GptWorkshopGreen: look c4f527e4 (turquoise), GptGreenKit panels, calm full-frame punchline.

const WORDS = captionsJson as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WORDS) if (norm(x.text) === w && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const END = WORDS[WORDS.length - 1].endMs / 1000;
export const BEN_FRAMES = Math.round((END + 0.9) * 25);
const AVATAR = { src: "gpts-benefits/avatar.mp4", focus: { x: 0.45, y: 0.645 }, scale: 1.08, faceAt: 0.57 };

const A = {
  benefits: at("benefits"), gehalt1: at("gehalt", 1), obst1: at("obstkorb", 1), jobrad: at("jobrad"), kicker: at("kicker"), flache: at("flache"),
  hund: at("hund"), gehalt2: at("gehalt", 2), attraktiv: at("attraktiv"),
  oekonomen: at("ökonomen"), smith: at("smith"), kompensierende: at("kompensierende"), annehmlichkeit: at("annehmlichkeit"), lohn: at("lohn"),
  amerika: at("amerika"), bewerber: at("bewerber"), acht: at("acht"), hause: at("hause"),
  den: at("den"), obst2: at("obstkorb", 2), selbst: at("selbst"), aufpreis: at("aufpreis"),
  anzeige: at("anzeige"), chatgpt: at("chatgpt"), vierzehn: at("vierzehn"), sekunden: at("sekunden"), zahl: at("zahl"),
  ich: at("ich"), attraktives: at("attraktives"), hoch: at("hoch"), teuerste: at("teuerste"), obst3: at("obstkorb", 3),
};

const LINE = "rgba(11,61,44,0.12)";
const Tag: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: G.white, background: G.green, borderRadius: 10, padding: "8px 14px", whiteSpace: "nowrap", ...style }}>{text}</span>
);
const Label: React.FC<{ text: string; color?: string }> = ({ text, color = G.dim }) => (
  <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color }}>{text}</div>
);
/** red rubber stamp, slams in */
const Stamp: React.FC<{ t: number; at: number; text: string; style?: React.CSSProperties }> = ({ t, at: a, text, style }) => {
  if (t < a) return null;
  const p = ez(t, a, a + 0.16);
  return <div style={{ position: "absolute", fontFamily: GF.mono, fontWeight: 800, fontSize: 40, letterSpacing: "0.08em", color: "#C8372D", border: "5px solid #C8372D", borderRadius: 12, padding: "4px 16px", background: "rgba(255,255,255,0.92)", transform: `rotate(-7deg) scale(${2.1 - 1.1 * p})`, opacity: p, whiteSpace: "nowrap", ...style }}>{text}</div>;
};
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(Math.max(0, Math.min(1, (t - a) / (b - a))) * s.length));

// ---------- the job ad (hook + perks list) ----------
const PERKS: { n: string; k: keyof typeof A }[] = [
  { n: "Obstkorb", k: "obst1" }, { n: "Jobrad", k: "jobrad" }, { n: "Kicker", k: "kicker" }, { n: "Flache Hierarchien", k: "flache" }, { n: "Hund im Büro", k: "hund" },
];
const Ad: React.FC<{ t: number; s: number; hook?: boolean }> = ({ t, s, hook }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const inn = hook ? 1 : sp(0.02, 12, 220);
  const shown = PERKS.filter((p) => t > T(A[p.k]) - 0.08).length;
  const pay = t > T(A.gehalt2) - 0.05;
  return (
    <Glass style={{ position: "absolute", left: 60, right: 60, top: hook ? 330 : 110, padding: "30px 34px", transform: `translateY(${(1 - inn) * 60}px)`, opacity: Math.min(1, inn * 2) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 70, height: 70, borderRadius: 18, background: G.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.tight, fontWeight: 900, fontSize: 36, color: G.white }}>N</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 50, color: G.ink, lineHeight: 1.1 }}>Marketing Manager (m/w/d)</div>
          <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 24, color: G.dim }}>NovaWorks GmbH · Köln · Vollzeit</div>
        </div>
      </div>
      {hook ? null : (
        <>
          <div style={{ marginTop: 22 }}><Label text={`DAS BIETEN WIR · ${shown}`} /></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
            {PERKS.map((p, i) => {
              const a = T(A[p.k]) - 0.08;
              if (t < a) return null;
              const q = ez(t, a, a + 0.22);
              return (
                <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 10, background: G.tint, border: `1.5px solid ${LINE}`, borderRadius: 18, padding: "16px 22px", transform: `scale(${0.7 + 0.3 * q + 0.08 * bump(t, a + 0.2, 0.25)})`, opacity: q }}>
                  <Check size={38} p={ez(t, a + 0.05, a + 0.3)} />
                  <span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 42, color: G.ink }}>{p.n}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 26, borderTop: `1.5px solid ${LINE}`, paddingTop: 20, display: "flex", alignItems: "baseline", gap: 18, opacity: ez(t, T(A.gehalt2) - 0.1, T(A.gehalt2) + 0.1) }}>
            <Label text="GEHALT" />
            <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 76, color: G.green, fontStyle: "italic" }}>{pay ? typed("attraktiv", t, T(A.attraktiv) - 0.05, T(A.attraktiv) + 0.35) : ""}</span>
          </div>
          <Stamp t={t} at={T(A.attraktiv) + 0.55} text="KEINE ZAHL" style={{ right: 40, bottom: 34 }} />
        </>
      )}
    </Glass>
  );
};

// ---------- 1 · Hook: the verdict as a title, frame 0 = thumbnail ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const perks = count(t, 0.2, A.gehalt1 + 0.2, 14, 3);
  const pay = count(t, 0.2, A.gehalt1 + 0.2, 0, 100);
  return (
    <>
      <Backdrop t={t} variant={0} />
      <PopWords text="Mehr Benefits. Weniger Gehalt." hi="Weniger" at={-1} style={{ position: "absolute", left: 60, right: 60, top: 90, fontFamily: GF.tight, fontWeight: 900, fontSize: 92, lineHeight: 1.02, letterSpacing: -3, color: G.green }} />
      <Ad t={t} s={0} hook />
      <div style={{ position: "absolute", left: 60, right: 60, top: 520, display: "flex", gap: 20 }}>
        <Glass style={{ flex: 1, padding: "20px 26px" }}>
          <Label text="BENEFITS" />
          <Odometer value={Math.round(perks.v)} speed={perks.speed} size={96} />
        </Glass>
        <Glass style={{ flex: 1, padding: "20px 26px" }}>
          <Label text="GEHALT IN DER ANZEIGE" />
          <Odometer value={Math.round(pay.v)} speed={pay.speed} size={96} suffix=" %" color={pay.v < 30 ? "#C8372D" : G.green} />
        </Glass>
      </div>
      <Ripple t={t} at={A.gehalt1} x={760} y={640} r={200} />
    </>
  );
};

// ---------- 2 · the perks pop in one by one, salary: "attraktiv" ----------
const Perks: React.FC<{ t: number; s: number }> = ({ t, s }) => (
  <>
    <Backdrop t={t} variant={1} />
    <Ad t={t} s={s} />
  </>
);

// ---------- 3 · Adam Smith: compensating wage differentials ----------
const Smith: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const term = sp(T(A.kompensierende) - 0.05, 11, 230);
  const tilt = ez(t, T(A.annehmlichkeit), T(A.lohn) + 0.4);
  return (
    <>
      <Backdrop t={t} variant={2} />
      <Glass style={{ position: "absolute", left: 60, top: 70, padding: "16px 22px", display: "flex", alignItems: "center", gap: 16, opacity: ez(t, T(A.oekonomen) - 0.1, T(A.oekonomen) + 0.15) }}>
        <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 36, color: G.ink }}>Adam Smith</div>
        <Tag text="1776" />
      </Glass>
      <div style={{ position: "absolute", left: 60, right: 60, top: 200, textAlign: "center", transform: `scale(${term})`, opacity: Math.min(1, term * 2) }}>
        <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 80, color: G.green, letterSpacing: -2.5, lineHeight: 1.02 }}>Kompensierende<br />Lohndifferenziale</div>
        <div style={{ height: 10, borderRadius: 5, background: G.mint, margin: "12px auto 0", width: "70%", transformOrigin: "0 50%", transform: `scaleX(${ez(t, T(A.kompensierende) + 0.4, T(A.kompensierende) + 0.9)})` }} />
      </div>
      {/* the seesaw: perks go up, pay goes down */}
      <div style={{ position: "absolute", left: 140, right: 140, top: 560, height: 300, opacity: ez(t, T(A.annehmlichkeit) - 0.2, T(A.annehmlichkeit)) }}>
        <div style={{ position: "absolute", left: "50%", top: 190, width: 0, height: 0, marginLeft: -40, borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderBottom: `70px solid ${G.green}` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 182, height: 12, borderRadius: 6, background: G.ink, transform: `rotate(${-12 * tilt}deg)`, transformOrigin: "50% 50%" }}>
          <Glass style={{ position: "absolute", left: -20, top: -110, padding: "14px 20px", textAlign: "center" }}>
            <Label text="ANNEHMLICHKEIT" />
            <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 52, color: G.green }}>+</div>
          </Glass>
          <Glass style={{ position: "absolute", right: -20, top: -110, padding: "14px 20px", textAlign: "center", opacity: ez(t, T(A.lohn) - 0.15, T(A.lohn) + 0.1) }}>
            <Label text="LOHN" color="#C8372D" />
            <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 52, color: "#C8372D" }}>−</div>
          </Glass>
        </div>
      </div>
    </>
  );
};

// ---------- 4 · the US study: 8 % less pay for working from home ----------
const Studie: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const card = sp(0.02, 12, 220);
  const on = t > T(A.hause) - 0.15;
  const pay = count(t, T(A.acht) - 0.1, T(A.acht) + 0.7, 92, 100);
  return (
    <>
      <Backdrop t={t} variant={3} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 70, padding: "24px 30px", transform: `translateY(${(1 - card) * 50}px)`, opacity: Math.min(1, card * 2) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Tag text="STUDIE · USA" /><Label text="BEWERBER WÄHLEN ZWISCHEN ZWEI JOBS" /></div>
        <div style={{ display: "flex", gap: 20, marginTop: 22 }}>
          <div style={{ flex: 1, background: G.tint, borderRadius: 20, padding: "20px 22px", border: `1.5px solid ${LINE}` }}>
            <Label text="JOB A · BÜRO" />
            <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 70, color: G.ink }}>100 %</div>
            <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 24, color: G.dim }}>Gehalt</div>
          </div>
          <div style={{ flex: 1, background: on ? "rgba(11,61,44,0.92)" : G.tint, borderRadius: 20, padding: "20px 22px", border: `1.5px solid ${LINE}` }}>
            <Label text="JOB B · HOMEOFFICE" color={on ? G.mint : G.dim} />
            <Odometer value={Math.round(pay.v)} speed={pay.speed} size={70} suffix=" %" color={on ? G.white : G.ink} />
            <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 24, color: on ? G.mint : G.dim }}>Gehalt</div>
          </div>
        </div>
      </Glass>
      {t > T(A.hause) - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 16, opacity: ez(t, T(A.hause) - 0.1, T(A.hause) + 0.2) }}>
          <Glass style={{ padding: "20px 28px", display: "flex", alignItems: "center", gap: 16 }}>
            <Check size={48} p={ez(t, T(A.hause), T(A.hause) + 0.3)} />
            <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 48, color: G.ink }}>Gewählt: Job B</span>
          </Glass>
        </div>
      ) : null}
      {t > T(A.hause) + 0.3 ? <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center" }}><Tag text="− 8 % GEHALT, FREIWILLIG" style={{ fontSize: 30, background: "#C8372D", opacity: ez(t, T(A.hause) + 0.3, T(A.hause) + 0.5) }} /></div> : null}
      <Ripple t={t} at={T(A.hause)} x={760} y={300} r={220} />
    </>
  );
};

// ---------- 5 · you pay for the fruit basket yourself, with a mark-up ----------
const Rechnung: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const inn = sp(0.02, 12, 220);
  const fruit = 25, waiver = count(t, T(A.selbst) - 0.2, T(A.selbst) + 0.6, 340, 0);
  const rows = [
    { l: "Obstkorb · Wert pro Monat", v: `${fruit} €`, at: T(A.obst2) },
    { l: "Gehaltsverzicht pro Monat", v: null, at: T(A.selbst) - 0.2 },
  ];
  return (
    <>
      <Backdrop t={t} variant={0} />
      <Glass style={{ position: "absolute", left: 90, right: 90, top: 110, padding: "36px 42px", transform: `translateY(${(1 - inn) * 50}px) rotate(-1deg)`, opacity: Math.min(1, inn * 2) }}>
        <div style={{ textAlign: "center" }}><Label text="RECHNUNG · AN DICH" /></div>
        <div style={{ textAlign: "center", fontFamily: GF.tight, fontWeight: 900, fontSize: 66, color: G.ink, marginTop: 6 }}>Dein Obstkorb</div>
        <div style={{ borderTop: `2px dashed ${LINE}`, marginTop: 18 }} />
        {rows.map((r, i) => (t > r.at - 0.1 ? (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 20, opacity: ez(t, r.at - 0.1, r.at + 0.15) }}>
            <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 36, color: G.ink }}>{r.l}</span>
            {r.v ? <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 34, color: G.ink }}>{r.v}</span> : <Odometer value={Math.round(waiver.v)} speed={waiver.speed} size={44} suffix=" €" color={G.ink} />}
          </div>) : null))}
        <div style={{ borderTop: `2px dashed ${LINE}`, marginTop: 22 }} />
        {t > T(A.aufpreis) - 0.15 ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 18, opacity: ez(t, T(A.aufpreis) - 0.15, T(A.aufpreis) + 0.1) }}>
            <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 52, color: "#C8372D" }}>Aufpreis</span>
            <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 58, color: "#C8372D" }}>+ 315 €</span>
          </div>
        ) : null}
        <Glint t={t} at={T(A.aufpreis) + 0.2} />
      </Glass>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontFamily: GF.inter, fontWeight: 600, fontSize: 26, color: G.dim, opacity: ez(t, T(A.selbst), T(A.selbst) + 0.3) }}>Beispiel: 8 % von 4.250 € brutto</div>
    </>
  );
};

// ---------- 6 · ChatGPT writes the ad: 14 perks in 10 seconds, no number ----------
const BEN = ["Obstkorb", "Jobrad", "Kicker", "Hund im Büro", "Flache Hierarchien", "Team-Events", "Kaffee-Flatrate", "Duz-Kultur", "Yoga am Mittwoch", "Sommerfest", "Moderne Hardware", "Weiterbildung", "Firmenhandy", "Corporate Benefits"];
const Chat: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const inn = sp(0.02, 12, 220);
  const gen0 = T(A.chatgpt) + 0.15, gen1 = T(A.sekunden) + 0.2;
  const n = Math.max(0, Math.min(14, Math.floor(((t - gen0) / (gen1 - gen0)) * 14)));
  const secs = count(t, gen0, gen1, 10, 0);
  return (
    <>
      <Backdrop t={t} variant={1} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 60, padding: "18px 24px", transform: `translateY(${(1 - inn) * 40}px)`, opacity: Math.min(1, inn * 2) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1, background: G.tint, borderRadius: 18, padding: "14px 18px", fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: G.ink }}>{typed("Schreib eine Stellenanzeige. Viele Benefits.", t, 0.1, T(A.chatgpt))}</div>
          <div style={{ textAlign: "right" }}><Label text="ZEIT" /><Odometer value={Math.round(secs.v)} speed={secs.speed} size={44} suffix=" s" /></div>
        </div>
      </Glass>
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 210, height: 560, padding: "18px 24px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><Label text="DAS BIETEN WIR" /><Tag text={`${n} BENEFITS`} style={{ fontSize: 20, padding: "6px 12px" }} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 18px", marginTop: 14 }}>
          {BEN.slice(0, n).map((b, i) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: GF.inter, fontWeight: 700, fontSize: 28, color: G.ink }}>
              <Check size={26} p={1} /><span>{b}</span>
            </div>
          ))}
        </div>
        {t > T(A.zahl) - 0.2 ? (
          <div style={{ position: "absolute", left: 24, right: 24, bottom: 20, borderTop: `1.5px solid ${LINE}`, paddingTop: 14, display: "flex", alignItems: "baseline", gap: 16, opacity: ez(t, T(A.zahl) - 0.2, T(A.zahl)) }}>
            <Label text="GEHALT" />
            <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 48, color: G.green, fontStyle: "italic" }}>attraktiv</span>
          </div>
        ) : null}
        <Stamp t={t} at={T(A.zahl) + 0.15} text="0 ZAHLEN" style={{ right: 30, bottom: 26 }} />
      </Glass>
    </>
  );
};

const SCENES: GreenScene[] = [
  { start: 0, end: A.obst1 - 0.15, El: Hook },
  { start: A.obst1 - 0.15, end: A.oekonomen - 0.12, El: (p) => <Perks t={p.t} s={A.obst1 - 0.15} />, joinPrev: true },
  { start: A.oekonomen - 0.12, end: A.amerika - 0.25, El: (p) => <Smith t={p.t} s={A.oekonomen - 0.12} />, joinPrev: true },
  { start: A.amerika - 0.25, end: A.den - 0.12, El: (p) => <Studie t={p.t} s={A.amerika - 0.25} />, joinPrev: true },
  { start: A.den - 0.12, end: A.anzeige - 0.3, El: (p) => <Rechnung t={p.t} s={A.den - 0.12} />, joinPrev: true },
  { start: A.anzeige - 0.3, end: A.ich - 0.3, El: (p) => <Chat t={p.t} s={A.anzeige - 0.3} />, joinPrev: true },
];

/** Punchline in full frame: the verdict as a quiet card above the head, never over the face. */
const Pointe: React.FC<{ t: number }> = ({ t }) => {
  if (t < A.ich - 0.2) return null;
  const a = ez(t, A.ich - 0.15, A.ich + 0.2);
  const cross = ez(t, A.hoch - 0.1, A.hoch + 0.3);
  const fin = ez(t, A.teuerste - 0.1, A.teuerste + 0.25);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: a, transform: `translateY(${(1 - a) * 16}px) scale(1.45)`, transformOrigin: "50% 0%" }}>
      <Glass style={{ padding: "16px 26px", borderRadius: 24, display: "flex", alignItems: "baseline", gap: 16 }}>
        <Label text="GEHALT" />
        <span style={{ position: "relative", fontFamily: GF.tight, fontWeight: 900, fontSize: 46, color: G.green, fontStyle: "italic" }}>
          attraktiv
          <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 6, borderRadius: 3, background: "#C8372D", transformOrigin: "0 50%", transform: `scaleX(${cross})` }} />
        </span>
      </Glass>
      {t > A.teuerste - 0.15 ? (
        <Glass style={{ padding: "16px 24px", borderRadius: 24, opacity: fin, transform: `scale(${0.9 + 0.1 * fin})`, display: "flex", alignItems: "center", gap: 14 }}>
          <Label text="TEUERSTES IM BÜRO" />
          <Tag text="OBSTKORB" style={{ fontSize: 28 }} />
        </Glass>
      ) : null}
    </div>
  );
};

export const GptBenefitsGreen: React.FC = () => <GreenReel avatar={AVATAR} scenes={SCENES} words={WORDS} overlay={(t) => <Pointe t={t} />} />;
