import React from "react";
import {
  AvatarSource, Board, Chip, ex, Icon, Place, Pop, RowCard, Split, StatusBadge, Title, useFloat, useT,
} from "../components/ExplainerKit";
import { fonts } from "../theme";

// "Abmahnung" reel (2026-10-01, ersetzt-radar B-032), Explainer style. cues = seconds from the window
// start at which the matching spoken words begin. Vision captions sit at y 0.5 during B-Roll, so full
// boards keep 880-1060 px free and split boards keep content above ~880 px.

export type AbmProps = { seconds: number; avatar: AvatarSource; cues: number[] };
const at = (cues: number[], i: number, fallback: number) => (cues[i] ?? fallback) - 0.08;
const RED = "#E5484D";
const RED_BG = "#FDE7E8";

const Page: React.FC<{ w: number; h: number; title: string; lines?: number; children?: React.ReactNode }> = ({ w, h, title, lines = 10, children }) => (
  <div style={{ position: "relative", width: w, height: h, background: ex.white, borderRadius: 22, boxShadow: "0 24px 60px rgba(0,0,0,0.14)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 44, top: 36, fontFamily: fonts.bold, fontSize: 32, color: ex.ink, letterSpacing: -0.5 }}>{title}</div>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 44, top: 104 + i * 34, height: 12, width: `${[80, 70, 86, 62, 76, 68, 84, 58, 74, 66][i % 10]}%`, borderRadius: 6, background: "#E6E6E6" }} />
    ))}
    {children}
  </div>
);

const Clause: React.FC<{ p: number; top: number; text: string }> = ({ p, top, text }) => (
  <div style={{ position: "absolute", left: 30, right: 30, top, opacity: Math.min(1, p * 1.4), transform: `scale(${0.96 + 0.04 * Math.min(1, p)})`, transformOrigin: "0 50%", padding: "14px 18px 14px 60px", borderRadius: 14, background: RED_BG, border: `3px solid ${RED}`, boxShadow: `0 0 ${22 * Math.min(1, p)}px ${RED}55` }}>
    <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, borderRadius: 15, background: RED, display: "grid", placeItems: "center" }}>
      <svg width={16} height={16} viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="#fff" strokeWidth={4} strokeLinecap="round" /></svg>
    </div>
    <span style={{ fontFamily: fonts.semibold, fontSize: 25, lineHeight: 1.3, color: ex.ink }}>{text}</span>
  </div>
);

// 1 "Claude hat sie in fünf Minuten auseinandergenommen."  cues: [Claude, fünf, auseinandergenommen] — full board
export const AbmBrief: React.FC<AbmProps> = ({ cues }) => {
  const { pop, ramp } = useT();
  const f = useFloat(6);
  const split = ramp(at(cues, 2, 1.2), at(cues, 2, 1.2) + 0.5);
  const parts = [{ t: "Vorwurf", i: "info", dx: -330, dy: 40 }, { t: "Frist", i: "clock", dx: 0, dy: -30 }, { t: "Forderung", i: "euro", dx: 330, dy: 40 }];
  return (
    <Board>
      <Place top={130}><Title text="In 5 Minuten" at={-0.15} size={100} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 300 + f, left: 0, width: 1080, display: "flex", justifyContent: "center", opacity: 1 - split, transform: `scale(${1 - 0.25 * split})` }}>
        <Pop p={pop(0)} from={0.9}>
          <Page w={620} h={520} title="Abmahnung" lines={6}>
            <div style={{ position: "absolute", right: 34, top: 30, padding: "8px 16px", borderRadius: 10, border: `4px solid ${RED}`, color: RED, fontFamily: fonts.bold, fontSize: 26, transform: "rotate(-6deg)" }}>FRIST</div>
            <div style={{ position: "absolute", left: 44, bottom: 40, fontFamily: fonts.bold, fontSize: 64, color: ex.ink, letterSpacing: -2 }}>2.000 €</div>
          </Page>
        </Pop>
      </div>
      {parts.map((pt, k) => {
        const p = pop(at(cues, 2, 1.2) + 0.15 + k * 0.1);
        return (
          <div key={pt.t} style={{ position: "absolute", top: 470 + pt.dy * Math.min(1, p), left: 540 - 140 + pt.dx * Math.min(1, p), width: 280, opacity: split, transform: `scale(${0.7 + 0.3 * Math.min(1.05, p)})` }}>
            <div style={{ background: ex.white, borderRadius: 24, boxShadow: "0 18px 44px rgba(0,0,0,0.14)", padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ width: 76, height: 76, borderRadius: 38, background: ex.tileTop, display: "grid", placeItems: "center" }}><Icon name={pt.i} size={40} color={ex.white} /></div>
              <span style={{ fontFamily: fonts.bold, fontSize: 38, color: ex.ink }}>{pt.t}</span>
            </div>
          </div>
        );
      })}
      <Place top={1110}><Pop p={pop(at(cues, 1, 0.6))}><Chip text="Claude · 5 Min." icon="clock" big /></Pop></Place>
    </Board>
  );
};

// 2 "Ich lade den Brief hoch. Claude erklärt mir, was uns genau vorgeworfen wird. Bis wann ich reagieren muss. Und ob die Forderung überhaupt plausibel ist."
// cues: [lade, vorgeworfen, reagieren, plausibel] — split
export const AbmAnalyse: React.FC<AbmProps> = ({ avatar, cues }) => {
  const { pop } = useT();
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Claude erklärt" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={150}>
        <Pop p={pop(at(cues, 0, 0.2))} from={0.85}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 26px", background: ex.chip, borderRadius: 18, boxShadow: "0 12px 26px rgba(0,0,0,0.2)" }}>
            <Icon name="file" size={34} color={ex.tileTop} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: ex.chipText }}>Abmahnung.pdf hochgeladen</span>
          </div>
        </Pop>
      </Place>
      <Place top={270}>
        <RowCard rows={["Vorwurf: in einfachen Worten", "Frist: bis wann reagieren", "Forderung: plausibel?"]} at={at(cues, 1, 1.5)} times={[1, 2, 3].map((i) => at(cues, i, 1 + i * 0.9))} width={800} />
      </Place>
    </Split>
  );
};

// 3 "Und das Wichtigste. Es markiert jeden Satz in der Unterlassungserklärung, den ich so auf keinen Fall unterschreiben sollte."
// cues: [Wichtigste, markiert, Unterlassungserklärung, unterschreiben] — split
export const AbmKlauseln: React.FC<AbmProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const items = [
    { text: "… verpflichtet sich, es künftig zu unterlassen, …", top: 110, i: 1 },
    { text: "Vertragsstrafe von 5.100 € für jeden Fall der Zuwiderhandlung", top: 230, i: 2 },
    { text: "… erkennt die Kostenforderung in voller Höhe an.", top: 370, i: 3 },
  ];
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Nicht unterschreiben" at={-0.15} size={80} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={150}>
        <Pop p={pop(0.05)} from={0.9} y={80}>
          <Page w={880} h={520} title="Unterlassungserklärung" lines={12}>
            {items.map((c, k) => <Clause key={k} p={ramp(at(cues, c.i, 1 + k), at(cues, c.i, 1 + k) + 0.3)} top={c.top} text={c.text} />)}
          </Page>
        </Pop>
      </Place>
      <div style={{ position: "absolute", top: 700, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(at(cues, 3, 3) + 0.3)}><StatusBadge text="Erst mit dem Anwalt besprechen" /></Pop>
      </div>
    </Split>
  );
};

// 4 "Vorher, Panik und ein teurer Anwaltstermin. Jetzt, fünf Minuten, …"  cues: [Vorher, Panik, Anwaltstermin, Jetzt, fünf] — full board
export const AbmVorherNachher: React.FC<AbmProps> = ({ cues }) => {
  const { pop } = useT();
  const f = useFloat(6);
  const Card: React.FC<{ p: number; label: string; lines: string[]; hot?: boolean }> = ({ p, label, lines, hot }) => (
    <Pop p={p} from={0.8}>
      <div style={{ width: 420, height: 500, borderRadius: 30, background: hot ? ex.rowCard : ex.white, border: `4px solid ${hot ? ex.tileTop : "#DADADA"}`, boxShadow: "0 22px 50px rgba(0,0,0,0.14)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, padding: 30 }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 30, letterSpacing: 3, color: hot ? ex.tileTop : "#9A9A9A" }}>{label}</div>
        {lines.map((l, i) => <div key={i} style={{ fontFamily: fonts.bold, fontSize: i === 0 ? 64 : 36, letterSpacing: -1.5, color: hot ? ex.ink : "#7A7A7A", textAlign: "center", lineHeight: 1.1 }}>{l}</div>)}
      </div>
    </Pop>
  );
  return (
    <Board>
      <div style={{ position: "absolute", top: 260 + f, left: 0, width: 1080, display: "flex", justifyContent: "center", gap: 50 }}>
        <Card p={pop(at(cues, 0, 0.1))} label="VORHER" lines={["Panik", "+ teurer Anwaltstermin"]} />
        <Card p={pop(at(cues, 3, 1.9))} label="JETZT" lines={["5 Min.", "+ klare Fragen an den Anwalt"]} hot />
      </div>
    </Board>
  );
};
