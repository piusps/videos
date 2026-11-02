import React from "react";
import { AvatarSource, Board, Chip, ex, Place, Pop, RowCard, Split, Title, useFloat, useT } from "../components/ExplainerKit";
import { fonts } from "../theme";

// "Betriebsprüfung" reel (2026-10-05, Ersetzt-Radar, Pius' pick), Explainer style like AgbNeuBrolls.
// cues = seconds from the window start at which the matching spoken words begin. Vision captions sit at
// y 0.5 during B-Roll: split boards keep content above ~880 px. All years, accounts and figures are invented.

export type BpProps = { seconds: number; avatar: AvatarSource; cues: number[] };
const at = (cues: number[], i: number, fallback: number) => (cues[i] ?? fallback) - 0.08;
const RED = "#E5484D";
const GREEN = "#2E9E5B";
const AMBER = "#E8A33D";

const Letter: React.FC<{ w: number }> = ({ w }) => {
  const s = w / 600;
  return (
    <div style={{ width: w, height: 300 * s, background: "#FBFAF6", borderRadius: 14 * s, boxShadow: "0 20px 50px rgba(0,0,0,0.16)", padding: `${26 * s}px ${32 * s}px`, boxSizing: "border-box", textAlign: "left" }}>
      <div style={{ fontFamily: fonts.semibold, fontSize: 20 * s, color: "#7A7A7A", letterSpacing: 2 }}>FINANZAMT</div>
      <div style={{ fontFamily: fonts.bold, fontSize: 34 * s, color: ex.ink, marginTop: 6 * s }}>Prüfungsanordnung</div>
      {[460, 520, 380, 500, 300].map((l, i) => (
        <div key={i} style={{ width: l * s, height: 11 * s, borderRadius: 6 * s, background: "#E2E0DA", marginTop: 16 * s }} />
      ))}
    </div>
  );
};

// 1 "Du lädst die Prüfungsanordnung hoch, und Claude sagt dir genau, welche Jahre, welche Steuern und welche Unterlagen der Prüfer sehen will."
// cues: [Prüfungsanordnung, Jahre, Steuern, Unterlagen] — split
export const BpAnordnung: React.FC<BpProps> = ({ avatar, cues }) => {
  const { pop } = useT();
  const rows: [string, string, number][] = [["📅", "Jahre: 2022 bis 2024", 1], ["🧾", "Umsatz-, Gewerbe-, Körperschaftsteuer", 2], ["📂", "Belege, Verträge, Kasse, Fahrtenbuch", 3]];
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Schritt 1: Was wird geprüft?" at={-0.15} size={78} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={140}><Pop p={pop(at(cues, 0, 0.2))} from={0.9}><Letter w={680} /></Pop></Place>
      <div style={{ position: "absolute", top: 520, left: 50, right: 50, display: "flex", flexDirection: "column", gap: 16 }}>
        {rows.map(([ic, l, ci]) => (
          <Pop key={l} p={pop(at(cues, ci, 1 + ci))} from={0.85}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 30px", background: ex.white, borderRadius: 22, boxShadow: "0 12px 30px rgba(0,0,0,0.12)", fontFamily: fonts.bold, fontSize: 42, color: ex.ink }}>
              <span style={{ fontSize: 46 }}>{ic}</span>{l}
            </div>
          </Pop>
        ))}
      </div>
    </Split>
  );
};

// 2 "Du gibst Claude den Export aus deiner Buchhaltung, und es zeigt dir fehlende Belege, Lücken und alles, was einem Prüfer auffallen würde."
// cues: [Export, fehlende, Lücken, auffallen] — split
export const BpLuecken: React.FC<BpProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const rows: [string, string, string, string][] = [
    ["4650 Bewirtung", "+62 % zum Vorjahr", AMBER, "erklären"],
    ["4530 Fahrzeugkosten", "Fahrtenbuch fehlt", RED, "fehlt"],
    ["1000 Kasse", "3 Belege ohne Nachweis", RED, "fehlt"],
    ["4210 Miete", "Vertrag vorhanden", GREEN, "ok"],
  ];
  const mark = at(cues, 3, 4.5);
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Schritt 2: Lücken finden" at={-0.15} size={78} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={150}>
        <Pop p={pop(at(cues, 0, 0.2))} from={0.92}>
          <div style={{ width: 990, background: ex.white, borderRadius: 24, boxShadow: "0 18px 44px rgba(0,0,0,0.14)", padding: "14px 28px", textAlign: "left" }}>
            {rows.map(([k, d, c, s], i) => {
              const a = ramp(at(cues, 1, 2) + i * 0.22, at(cues, 1, 2) + i * 0.22 + 0.25);
              const hit = c === RED ? ramp(mark + (i - 1) * 0.2, mark + (i - 1) * 0.2 + 0.25) : 0;
              return (
                <div key={k} style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, padding: "22px 0", borderBottom: i < rows.length - 1 ? "2px solid #F2F2F2" : "none", opacity: a }}>
                  <div style={{ width: 26, height: 26, borderRadius: 13, background: c, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: fonts.semibold, fontSize: 38, color: ex.ink }}>{k}</div>
                    <div style={{ fontFamily: fonts.medium, fontSize: 29, color: "#8A8A8A" }}>{d}</div>
                  </div>
                  <span style={{ fontFamily: fonts.bold, fontSize: 34, color: c }}>{s}</span>
                  {c === RED ? <div style={{ position: "absolute", left: -14, right: -14, top: 4, bottom: 4, border: `5px solid ${RED}`, borderRadius: 14, opacity: hit }} /> : null}
                </div>
              );
            })}
          </div>
        </Pop>
      </Place>
      <Place top={790}><Pop p={pop(mark + 0.6)}><Chip text="Bevor es der Prüfer findet" icon="info" /></Pop></Place>
    </Split>
  );
};

// 3 "Claude stellt dir die Fragen, die der Prüfer wahrscheinlich stellt, und du übst die Antworten, bevor er im Haus ist."
// cues: [Fragen, übst, Antworten] — split. Three examiner questions fly in fast, then your answer and the rating.
export const BpFragen: React.FC<BpProps> = ({ avatar, cues }) => {
  const { pop } = useT();
  const q0 = at(cues, 0, 1.5);
  const qs = [
    "Warum sind die Bewirtungskosten 2023 um 62 % gestiegen?",
    "Wo ist das Fahrtenbuch für den Firmenwagen?",
    "Was sind die drei Barbelege vom März?",
  ];
  const card = (text: string, me: boolean, p: number, top: number, dim = 0) => (
    <div style={{ position: "absolute", top, left: me ? 200 : 50, right: me ? 50 : 200, opacity: p * (1 - dim), transform: `translateY(${(1 - p) * 22}px) scale(${0.96 + 0.04 * p})` }}>
      <div style={{ background: me ? "#1F6FEB" : ex.white, color: me ? "#FFF" : ex.ink, borderRadius: 24, padding: "18px 26px", fontFamily: fonts.semibold, fontSize: 34, lineHeight: 1.3, boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}>{text}</div>
    </div>
  );
  const ans = at(cues, 2, 3.9);
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Schritt 3: Prüfer-Fragen" at={-0.15} size={78} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      {qs.map((q, i) => card(q, false, pop(q0 + i * 0.45), 150 + i * 150, i < 1 ? 0.45 * pop(ans) : 0))}
      {card("Zwei Kundenevents. Einladungen und Belege liegen vor.", true, pop(ans), 610)}
      <Place top={790}><Pop p={pop(ans + 0.5)}><Chip text="Überzeugend, Belege bereithalten" icon="check" /></Pop></Place>
    </Split>
  );
};

// 4 "Dein Steuerberater begleitet die Prüfung trotzdem, aber er fängt nicht mehr bei null an."  cues: [Steuerberater, null] — full board
export const BpSumme: React.FC<BpProps> = ({ cues }) => {
  const { pop } = useT();
  const f = useFloat(6);
  return (
    <Board>
      <Place top={130}><Title text="Dein Steuerberater" at={-0.15} size={96} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 340 + f, left: 0, width: 1080, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Pop p={pop(at(cues, 0, 0.1) + 0.2)} from={0.7}>
          <div style={{ fontFamily: fonts.bold, fontSize: 150, lineHeight: 1, color: GREEN, letterSpacing: -5 }}>prüft</div>
        </Pop>
        <Pop p={pop(at(cues, 0, 0.1) + 0.6)} from={0.7}>
          <div style={{ fontFamily: fonts.bold, fontSize: 96, lineHeight: 1.1, color: "#9A9A9A", textDecoration: "line-through", textDecorationColor: RED, textDecorationThickness: 10 }}>statt sucht</div>
        </Pop>
      </div>
      <Place top={1110}>
        <RowCard rows={["fängt nicht bei null an", "Vorbereitung: 1 Std."]} at={at(cues, 1, 2.9) - 0.3} times={[at(cues, 1, 2.9) - 0.3, at(cues, 1, 2.9) + 0.1]} width={720} icon="check" />
      </Place>
    </Board>
  );
};

// 0 "Claude hat die Unterlagen in einer Stunde sortiert."  cues: [Unterlagen, Stunde, sortiert] — full board, the result right after the hook
export const BpErgebnis: React.FC<BpProps> = ({ cues }) => {
  const { pop, ramp } = useT();
  const f = useFloat(6);
  const items = ["Prüfungszeitraum 2022 bis 2024", "Belege nach Konten sortiert", "3 Lücken gefunden und geklärt", "Fragenkatalog für den Prüfer"];
  return (
    <Board>
      <Place top={130}><Title text="Nach 1 Stunde" at={-0.15} size={100} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 300 + f, left: 70, right: 70 }}>
        <Pop p={pop(0)} from={0.92}>
          <div style={{ background: ex.white, borderRadius: 30, boxShadow: "0 24px 60px rgba(0,0,0,0.16)", padding: "26px 36px" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 40, color: ex.ink, marginBottom: 8 }}>Ordner Betriebsprüfung</div>
            {items.map((it, i) => {
              const a = ramp(0.15 + i * 0.22, 0.4 + i * 0.22);
              return (
                <div key={it} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 0", borderTop: "2px solid #F2F2F2", opacity: a, transform: `translateX(${(1 - a) * 24}px)` }}>
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: GREEN, color: "#FFF", fontFamily: fonts.bold, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
                  <span style={{ fontFamily: fonts.semibold, fontSize: 36, color: ex.ink }}>{it}</span>
                </div>
              );
            })}
          </div>
        </Pop>
      </div>
      <Place top={1110}><Pop p={pop(at(cues, 2, 1.4))}><Chip text="bereit für den Prüfer" icon="check" big /></Pop></Place>
    </Board>
  );
};
