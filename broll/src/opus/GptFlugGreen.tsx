import React from "react";
import { Easing, interpolate } from "remotion";
import { Logo } from "../components/PanelKit";
import { Backdrop, bump, Check, Chip, clamp, count, ez, FollowCard, G, GF, Glass, Glint, GreenReel, GreenScene, HW, Odometer, PdfScroll, PopWords, Ripple, Step, Ticks, TriggerPill, useSp, Word } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpt-flugverspaetung/captions.json";

// GPT-N "Flugverspätung → bis zu 600 €" (runs/gpt-flugverspaetung, 2026-10-21) im GPT-Look Weiß + Dunkelgrün.
// Times on the tightened timeline; scene-internal times relative to the scene start (from captions.json, noted per beat).
// Amounts: VO (EG) 261/2004 Art. 7 (250/400/600 €), EuGH Sturgeon (ab 3 h Ankunft). Example flight FRA→JFK with 4:10 h
// delay, so the full 600 € applies (3–4 h on long haul may be halved, Art. 7 Abs. 2).

const WORDS = captionsJson as Word[];
export const FLUG_FRAMES = 911; // tightened.mp4 = 36.44 s @ 25 fps
const AVATAR = { src: "render-gpt-flugverspaetung-tightened.mp4", focus: { x: 0.444, y: 0.648 }, scale: 1.08, faceAt: 0.57 }; // facefocus.py 2026-10-21

/** Flight status row: route + planned/landed times. */
const FlightCard: React.FC<{ t: number; delayAt: number; style?: React.CSSProperties }> = ({ t, delayAt, style }) => {
  const sp = useSp();
  const d = sp(delayAt, 10, 260);
  return (
    <Glass style={{ padding: "26px 32px", ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 24, color: G.dim }}>Flug LH 400 · Beispiel</span>
        <span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 22, color: G.white, background: G.green, borderRadius: 999, padding: "4px 14px", transform: `scale(${d})`, opacity: Math.min(1, d * 2) }}>VERSPÄTET</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
        <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 76, color: G.ink, letterSpacing: -2 }}>FRA</span>
        <svg width={120} height={40} viewBox="0 0 120 40">
          <path d="M4 20 H104" stroke={G.green} strokeWidth={5} strokeDasharray="10 8" />
          <path d="M98 8 L114 20 L98 32" stroke={G.green} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 76, color: G.ink, letterSpacing: -2 }}>JFK</span>
      </div>
      <div style={{ display: "flex", gap: 26, marginTop: 10, alignItems: "flex-end" }}>
        <div>
          <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 22, color: G.dim }}>geplant</div>
          <div style={{ position: "relative", fontFamily: GF.tight, fontWeight: 800, fontSize: 44, color: G.dim }}>
            14:05
            <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 5, borderRadius: 3, background: G.green, transformOrigin: "0 50%", transform: `scaleX(${ez(t, delayAt, delayAt + 0.3)})` }} />
          </div>
        </div>
        <div style={{ opacity: ez(t, delayAt + 0.1, delayAt + 0.3) }}>
          <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 22, color: G.dim }}>gelandet</div>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 44, color: G.green }}>18:15</div>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: GF.tight, fontWeight: 900, fontSize: 40, color: G.white, background: G.green, borderRadius: 18, padding: "8px 18px", transform: `scale(${d * (1 + 0.15 * bump(t, delayAt + 0.15, 0.3))})` }}>+4:10 h</div>
      </div>
    </Glass>
  );
};

// ---------- 0 · Hook (0; Stunden 0.75, gelandet 1.45, Airline 2.73, sechshundert 3.48, Euro 4.20; frame 0 = thumbnail) ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const money = sp(3.15, 11, 240);
  const c = count(t, 3.3, 4.15, 600);
  return (
    <>
      <Backdrop t={t} variant={0} />
      <PopWords text="Flug verspätet? Bis zu 600 € für dich." hi="600" at={-1} style={{ position: "absolute", left: 60, right: 120, top: 100, fontFamily: GF.tight, fontWeight: 900, fontSize: 92, lineHeight: 1.04, letterSpacing: -3, color: G.green }} />
      <FlightCard t={t} delayAt={0.7} style={{ position: "absolute", left: 60, width: 620, top: 430 }} />
      <div style={{ position: "absolute", left: 700, right: 40, top: 470, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${money * (1 + 0.15 * bump(t, 4.15, 0.3))})`, opacity: Math.min(1, money * 2) }}>
        <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 26, color: G.dim }}>dir stehen zu</span>
        <div style={{ position: "relative", overflow: "hidden", background: G.green, borderRadius: 28, padding: "14px 22px", boxShadow: "0 16px 34px rgba(11,61,44,0.3)" }}>
          <Odometer value={c.v} speed={c.speed} size={84} color={G.white} suffix="€" />
          <Glint t={t} at={4.2} />
        </div>
      </div>
      <Ticks t={t} from={3.3} to={4.15} every={0.14} text="+ €" x={850} y={560} />
      <Ripple t={t} at={4.15} x={860} y={560} r={240} />
    </>
  );
};

// ---------- 1 · EU-Recht (7.2; Recht 1.36, drei Jahren 3.19/3.36, Unwetter 4.47, nicht 6.17) ----------
const TIERS = [
  { k: "bis 1.500 km", v: 250 },
  { k: "bis 3.500 km", v: 400 },
  { k: "darüber", v: 600 },
];
const Recht: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  return (
    <>
      <Backdrop t={t} variant={1} />
      <PopWords text="Steht so im EU-Recht" hi="EU-Recht" at={0.05} style={{ position: "absolute", left: 60, right: 60, top: 100, fontFamily: GF.tight, fontWeight: 900, fontSize: 78, letterSpacing: -2.4, color: G.green }} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 240, padding: "14px 30px" }}>
        {TIERS.map((r, i) => {
          const a = sp(0.5 + i * 0.22, 12, 230);
          const c = count(t, 0.6 + i * 0.22, 1.2 + i * 0.22, r.v);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", height: 104, borderTop: i ? "2px solid rgba(11,61,44,0.1)" : "none", transform: `translateX(${(1 - a) * 700}px)`, opacity: Math.min(1, a * 2) }}>
              <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 36, color: G.ink, flex: 1 }}>{r.k}</span>
              <Odometer value={c.v} speed={c.speed} size={60} suffix="€" />
            </div>
          );
        })}
        <Glint t={t} at={1.5} />
      </Glass>
      <Ripple t={t} at={1.36} x={880} y={520} r={200} />
      <div style={{ position: "absolute", left: 60, top: 600, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
        <Chip text="auch Flüge der letzten 3 Jahre" t={t} at={2.0} />
        <Chip text="Ausnahme: echtes Unwetter" t={t} at={4.3} />
      </div>
    </>
  );
};

// ---------- 2 · Nur wenn du fragst (13.7; zahlt 0.4, nur 0.67, fragst 1.28) ----------
const Fragen: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const stamp = sp(1.25, 9, 300);
  return (
    <>
      <Backdrop t={t} variant={2} />
      <PopWords text="Die Airline zahlt nur, wenn du fragst." hi="fragst." at={0.05} step={0.08} style={{ position: "absolute", left: 60, right: 60, top: 150, fontFamily: GF.tight, fontWeight: 900, fontSize: 104, lineHeight: 1.04, letterSpacing: -3.2, color: G.green }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 54, color: G.green, border: `7px solid ${G.green}`, borderRadius: 22, padding: "8px 28px", transform: `scale(${2.2 - 1.2 * stamp}) rotate(-6deg)`, opacity: Math.min(1, stamp * 2), letterSpacing: 2 }}>ANTRAG NÖTIG</div>
      </div>
      <Ripple t={t} at={1.45} x={HW / 2} y={740} r={300} />
    </>
  );
};

// ---------- 3 · Erstens: Screenshot + echte Landezeit (16.7; Screenshot 0.96, Buchung 1.91, gelandet 3.83) ----------
const Screenshot: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const card = sp(0.25, 13, 190);
  const flash = Math.max(0, 1 - Math.abs(t - 1.0) / 0.12) * 0.85;
  const note = sp(3.3, 11, 240);
  return (
    <>
      <Backdrop t={t} variant={0} />
      <Step n={1} text="Screenshot machen" at={0} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 250, transform: `translateY(${(1 - card) * 500}px) rotate(${(1 - card) * 5 - 1.5}deg) scale(${1 - 0.04 * bump(t, 0.98, 0.25)})` }}>
        <Glass style={{ padding: "26px 32px" }}>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 38, color: G.green }}>Buchungsbestätigung</div>
          {[["Flug", "LH 400 · FRA → JFK"], ["Datum", "12.08.2026"], ["Buchungsnr.", "K7Q2XM"]].map(([k, v], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "2px solid rgba(11,61,44,0.1)", marginTop: i ? 0 : 12, opacity: ez(t, 0.4 + i * 0.1, 0.6 + i * 0.1) }}>
              <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: G.dim }}>{k}</span>
              <span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 30, color: G.ink }}>{v}</span>
            </div>
          ))}
        </Glass>
        <div style={{ position: "absolute", inset: -10, borderRadius: 40, border: `6px solid ${G.green}`, opacity: ez(t, 0.75, 0.95) * (1 - ez(t, 1.6, 1.9)) }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: flash, zIndex: 40 }} />
      <Ripple t={t} at={1.0} x={540} y={420} r={360} />
      <div style={{ position: "absolute", left: 140, top: 640, transform: `translateY(${(1 - note) * 200}px) rotate(${-3 + (1 - note) * 8}deg)`, opacity: Math.min(1, note * 2), background: G.mint, borderRadius: 18, padding: "16px 26px", boxShadow: "0 14px 30px rgba(11,61,44,0.2)" }}>
        <span style={{ fontFamily: GF.tight, fontWeight: 800, fontSize: 40, color: G.green }}>wirklich gelandet: 18:15</span>
      </div>
    </>
  );
};

// ---------- 4 · Zweitens: an ChatGPT schicken (21.3; schick 0.74, ChatGPT 1.51, Rechne 2.64, Airline 6.05) ----------
const Q = "Rechne aus, wie viel Entschädigung mir zusteht, und schreib mir die Forderung an die Airline.";
const Prompt: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const att = sp(0.7, 11, 240);
  const typed = Q.slice(0, Math.floor(Q.length * interpolate(t, [2.6, 6.0], [0, 1], { ...clamp, easing: Easing.linear })));
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
            <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: G.ink }}>Buchung.png</div>
            <div style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 24, color: G.dim }}>gelandet 18:15</div>
          </div>
        </div>
        <div style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 38, lineHeight: 1.32, color: typed ? G.ink : "#8A9A94", minHeight: 150 }}>{typed || "Frag irgendwas"}<span style={{ color: G.green, opacity: Math.floor(t * 3) % 2 }}>|</span></div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: typed ? G.green : "#C7D3CE", color: G.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.tight, fontWeight: 900, fontSize: 34, transform: `scale(${1 + 0.25 * send})` }}>↑</div>
        </div>
        <Glint t={t} at={6.2} />
      </Glass>
      <Ripple t={t} at={6.15} x={950} y={740} r={150} />
    </>
  );
};

// ---------- 5 · Drittens: abschicken + Frist (27.95; Formular 1.05, Airline 1.48, Frist 2.51, Wochen 3.08) ----------
const Abschicken: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const c = count(t, 0.3, 1.0, 600);
  const fields = [["Buchungsnummer", "K7Q2XM"], ["Strecke", "6.200 km"]];
  const sent = sp(2.0, 11, 240);
  return (
    <>
      <Backdrop t={t} variant={2} />
      <Step n={3} text="Abschicken + Frist" at={0} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 250, padding: "20px 30px 24px" }}>
        <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 26, color: G.dim }}>Formular der Airline · Entschädigung</div>
        {fields.map(([k, v], i) => {
          const a = sp(0.15 + i * 0.12, 12, 230);
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderTop: "2px solid rgba(11,61,44,0.1)", marginTop: i ? 0 : 10, transform: `translateX(${(1 - a) * 700}px)`, opacity: Math.min(1, a * 2) }}>
              <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: G.dim, flex: 1 }}>{k}</span>
              <span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 32, color: G.ink }}>{v}</span>
              <Check size={40} p={ez(t, 0.4 + i * 0.12, 0.7 + i * 0.12)} />
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: `3px solid ${G.green}` }}>
          <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 40, color: G.green }}>Forderung</span>
          <div style={{ transform: `scale(${1 + 0.15 * bump(t, 1.0, 0.3)})`, transformOrigin: "100% 50%" }}><Odometer value={c.v} speed={c.speed} size={70} suffix="€" /></div>
        </div>
        <div style={{ marginTop: 18, height: 70, borderRadius: 18, background: sent > 0.5 ? G.tint : G.green, color: sent > 0.5 ? G.green : G.white, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: GF.inter, fontWeight: 700, fontSize: 32, transform: `scale(${1 - 0.08 * bump(t, 1.9, 0.2)})` }}>
          {sent > 0.5 ? <><Check size={38} p={ez(t, 2.1, 2.4)} />Abgeschickt</> : "Absenden"}
        </div>
        <Glint t={t} at={1.1} />
      </Glass>
      <Ripple t={t} at={1.0} x={900} y={540} r={200} />
      <div style={{ position: "absolute", left: 60, top: 800 }}><Chip text="Frist: 2 Wochen" t={t} at={2.45} /></div>
    </>
  );
};

const SCENES: GreenScene[] = [
  { start: 0, end: 4.5, El: Hook },
  { start: 7.2, end: 13.7, El: Recht },
  { start: 13.7, end: 15.45, El: Fragen, joinPrev: true },
  { start: 16.7, end: 21.3, El: Screenshot },
  { start: 21.3, end: 27.95, El: Prompt, joinPrev: true },
  { start: 27.95, end: 31.45, El: Abschicken, joinPrev: true },
];

const PAGES = [1, 2, 3, 4, 5, 6].map((n) => `flug-guide/p${n}.png`);
const GUIDE_IN = 31.5; // "Wenn du alle Vorlagen" 31.52
const GUIDE_OUT = 34.2; // before "folg" 34.36
const FOLG = 34.36, WORD_AT = 35.15;

export const GptFlugGreen: React.FC = () => (
  <GreenReel
    avatar={AVATAR}
    scenes={SCENES}
    words={WORDS}
    overlay={(t) => (
      <>
        <PdfScroll t={t} pages={PAGES} title="Flug – Vorlagen + Beträge.pdf" inAt={GUIDE_IN} outAt={GUIDE_OUT} />
        <TriggerPill t={t} at={FOLG - 0.05} word="Flug" top={360} />
        <FollowCard t={t} followAt={FOLG} wordAt={WORD_AT} word="Flug" />
        <Ripple t={t} at={WORD_AT} x={HW / 2} y={680} r={260} />
      </>
    )}
  />
);
