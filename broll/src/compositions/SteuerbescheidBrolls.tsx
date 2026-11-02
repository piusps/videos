import React from "react";
import { AvatarSource, Board, Chip, ex, Place, Pop, RowCard, Split, Title, useFloat, useT } from "../components/ExplainerKit";
import { fonts } from "../theme";

// "Einspruch Steuerbescheid" reel (2026-10-04, Ersetzt-Radar), Explainer style like MahnbescheidBrolls.
// cues = seconds from the window start at which the matching spoken words begin. Vision captions sit at
// y 0.5 during B-Roll: full boards keep 880-1060 px free, split boards keep content above ~880 px.
// All numbers, positions and the letter are invented examples.

export type SbProps = { seconds: number; avatar: AvatarSource; cues: number[] };
const at = (cues: number[], i: number, fallback: number) => (cues[i] ?? fallback) - 0.08;
const RED = "#E5484D";
const GREEN = "#2E9E5B";

const Envelope: React.FC<{ w: number }> = ({ w }) => {
  const s = w / 640;
  return (
    <div style={{ position: "relative", width: w, height: 420 * s, background: "#F3F1EA", borderRadius: 18 * s, boxShadow: "0 24px 60px rgba(0,0,0,0.18)", overflow: "hidden", border: `${2 * s}px solid #DAD6CA` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 0, borderLeft: `${w / 2}px solid transparent`, borderRight: `${w / 2}px solid transparent`, borderTop: `${190 * s}px solid #E6E2D6` }} />
      <div style={{ position: "absolute", left: 40 * s, top: 210 * s, width: 170 * s, height: 70 * s, border: `${3 * s}px solid #B9B4A6`, borderRadius: 8 * s }} />
      <div style={{ position: "absolute", left: 40 * s, bottom: 40 * s, fontFamily: fonts.bold, fontSize: 40 * s, color: "#2B2B2B" }}>Finanzamt</div>
      <div style={{ position: "absolute", left: 40 * s, bottom: 92 * s, fontFamily: fonts.semibold, fontSize: 24 * s, color: "#6B6B6B", letterSpacing: 2 }}>STEUERBESCHEID 2025</div>
      <div style={{ position: "absolute", right: 36 * s, bottom: 36 * s, padding: `${8 * s}px ${16 * s}px`, border: `${4 * s}px solid ${RED}`, color: RED, fontFamily: fonts.bold, fontSize: 28 * s, transform: "rotate(-6deg)", borderRadius: 8 * s }}>GESTRICHEN</div>
    </div>
  );
};

// 1 "Claude zeigt dir in fünf Minuten, wo der Bescheid von deiner Erklärung abweicht."  cues: [Claude, fünf, abweicht] — full board
export const SbZeit: React.FC<SbProps> = ({ cues }) => {
  const { pop } = useT();
  const f = useFloat(6);
  return (
    <Board>
      <Place top={130}><Title text="In 5 Minuten" at={-0.15} size={100} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 330 + f, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(0)} from={0.9}><Envelope w={640} /></Pop>
      </div>
      <Place top={1110}><Pop p={pop(at(cues, 1, 0.7))}><Chip text="Claude · 5 Min." icon="clock" big /></Pop></Place>
    </Board>
  );
};

type Row = { label: string; mine: string; theirs: string; diff?: boolean };
const ROWS: Row[] = [
  { label: "Werbungskosten", mine: "3.840 €", theirs: "3.840 €" },
  { label: "Arbeitszimmer", mine: "1.260 €", theirs: "0 €", diff: true },
  { label: "Spenden", mine: "300 €", theirs: "300 €" },
  { label: "Handwerker", mine: "900 €", theirs: "600 €", diff: true },
];

// 2 "Du lädst beides hoch. Claude legt sie nebeneinander und markiert jede Zahl, die nicht übereinstimmt."
// cues: [lädst, nebeneinander, markiert] — split
export const SbVergleich: React.FC<SbProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const mark = at(cues, 2, 2.2);
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Claude vergleicht" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={160}>
        <Pop p={pop(at(cues, 0, 0.1))} from={0.9}>
          <div style={{ width: 900, background: ex.white, borderRadius: 24, boxShadow: "0 18px 44px rgba(0,0,0,0.14)", padding: "18px 28px", textAlign: "left" }}>
            <div style={{ display: "flex", fontFamily: fonts.semibold, fontSize: 26, color: "#8A8A8A", padding: "8px 0 12px", borderBottom: "2px solid #EEE" }}>
              <span style={{ flex: 1.4 }}>Position</span>
              <span style={{ flex: 1, textAlign: "right" }}>Deine Erklärung</span>
              <span style={{ flex: 1, textAlign: "right" }}>Bescheid</span>
            </div>
            {ROWS.map((r, i) => {
              const appear = ramp(at(cues, 1, 0.9) + i * 0.18, at(cues, 1, 0.9) + i * 0.18 + 0.25);
              const hit = r.diff ? ramp(mark + (i > 1 ? 0.3 : 0), mark + (i > 1 ? 0.3 : 0) + 0.25) : 0;
              return (
                <div key={r.label} style={{ position: "relative", display: "flex", alignItems: "center", fontFamily: fonts.semibold, fontSize: 32, color: ex.ink, padding: "16px 0", borderBottom: i < ROWS.length - 1 ? "2px solid #F2F2F2" : "none", opacity: appear }}>
                  <span style={{ flex: 1.4 }}>{r.label}</span>
                  <span style={{ flex: 1, textAlign: "right" }}>{r.mine}</span>
                  <span style={{ flex: 1, textAlign: "right", color: hit > 0.5 ? RED : ex.ink, fontFamily: hit > 0.5 ? fonts.bold : fonts.semibold }}>{r.theirs}</span>
                  {r.diff ? <div style={{ position: "absolute", left: -14, right: -14, top: 4, bottom: 4, border: `5px solid ${RED}`, borderRadius: 14, opacity: hit, transform: `scale(${1.04 - 0.04 * hit})` }} /> : null}
                </div>
              );
            })}
          </div>
        </Pop>
      </Place>
      <Place top={720}><Pop p={pop(mark + 0.5)}><Chip text="2 Abweichungen · 1.560 €" icon="info" /></Pop></Place>
    </Split>
  );
};

// 3 "Und jetzt kommt's. Es schreibt dir den Einspruch gleich mit, samt Begründung, fertig zum Abschicken."
// cues: [Einspruch, Begründung, Abschicken] — split
export const SbEinspruch: React.FC<SbProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const lines: [string, boolean][] = [
    ["Einspruch gegen den Einkommensteuerbescheid 2025", true],
    ["Hiermit lege ich gegen den oben genannten Bescheid Einspruch ein.", false],
    ["Begründung: Das Arbeitszimmer wurde nicht berücksichtigt. Mietvertrag und Grundriss liegen bei.", false],
    ["Die Handwerkerleistungen betragen laut Rechnung 900 €, nicht 600 €.", false],
    ["Ich bitte um Änderung des Bescheids.", false],
  ];
  const start = at(cues, 0, 0.2);
  const reason = at(cues, 1, 1.0);
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Einspruch fertig" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={160}>
        <Pop p={pop(start)} from={0.92}>
          <div style={{ width: 880, background: ex.white, borderRadius: 22, boxShadow: "0 18px 44px rgba(0,0,0,0.14)", padding: "30px 36px", textAlign: "left" }}>
            {lines.map(([l, h], i) => {
              const a = ramp((i < 2 ? start : reason) + (i < 2 ? i : i - 2) * 0.28, (i < 2 ? start : reason) + (i < 2 ? i : i - 2) * 0.28 + 0.3);
              return (
                <div key={i} style={{ fontFamily: h ? fonts.bold : fonts.medium, fontSize: h ? 32 : 28, lineHeight: 1.4, color: ex.ink, marginBottom: 12, opacity: a, transform: `translateY(${(1 - a) * 10}px)` }}>{l}</div>
              );
            })}
          </div>
        </Pop>
      </Place>
      <Place top={720}><Pop p={pop(at(cues, 2, 2.2))}><Chip text="Fertig zum Abschicken" icon="check" /></Pop></Place>
    </Split>
  );
};

// 4 "Der Einspruch selbst kostet dich keinen Cent."  cues: [Einspruch, keinen] — full board
export const SbKosten: React.FC<SbProps> = ({ cues }) => {
  const { pop } = useT();
  const f = useFloat(6);
  return (
    <Board>
      <Place top={130}><Title text="Einspruch kostet" at={-0.15} size={100} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 320 + f, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(0.1)} from={0.7}>
          <div style={{ fontFamily: fonts.bold, fontSize: 300, lineHeight: 1, color: GREEN, letterSpacing: -10 }}>0 €</div>
        </Pop>
      </div>
      <Place top={1110}>
        <RowCard rows={["Keine Gebühr", "Frist: 1 Monat"]} at={0.45} times={[0.45, 0.8]} width={640} icon="check" />
      </Place>
    </Board>
  );
};
