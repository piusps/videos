import React from "react";
import { AvatarSource, Board, Chip, ex, Place, Pop, RowCard, Split, Title, useFloat, useT } from "../components/ExplainerKit";
import { fonts } from "../theme";

// "AGB" reel (2026-10-05, Ersetzt-Radar B-034), Explainer style like SteuerbescheidBrolls.
// cues = seconds from the window start at which the matching spoken words begin. Vision captions sit at
// y 0.5 during B-Roll: full boards keep 880-1060 px free, split boards keep content above ~880 px.
// Prices, clauses and the invoice are invented examples.

export type AgProps = { seconds: number; avatar: AvatarSource; cues: number[] };
const at = (cues: number[], i: number, fallback: number) => (cues[i] ?? fallback) - 0.08;
const RED = "#E5484D";
const GREEN = "#2E9E5B";
const AMBER = "#E8A33D";

// 1 "Claude hat den Entwurf in fünfzehn Minuten geschrieben."  cues: [Claude, fünfzehn] — full board
export const AgKosten: React.FC<AgProps> = ({ cues }) => {
  const { pop, ramp } = useT();
  const f = useFloat(6);
  const strike = ramp(at(cues, 0, 0.3), at(cues, 0, 0.3) + 0.3);
  return (
    <Board>
      <Place top={130}><Title text="AGB schreiben" at={-0.15} size={100} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 330 + f, left: 0, width: 1080, display: "flex", justifyContent: "center", gap: 40 }}>
        <Pop p={pop(0)} from={0.9}>
          <div style={{ position: "relative", width: 440, height: 440, background: ex.white, borderRadius: 30, boxShadow: "0 24px 60px rgba(0,0,0,0.16)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 1 - 0.4 * strike }}>
            <div style={{ fontFamily: fonts.semibold, fontSize: 34, color: "#8A8A8A" }}>Anwalt</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 112, color: ex.ink, letterSpacing: -4 }}>1.500 €</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 28, color: "#8A8A8A" }}>2 bis 3 Wochen</div>
            <div style={{ position: "absolute", left: 30, right: 30, top: "50%", height: 10, borderRadius: 5, background: RED, transform: `scaleX(${strike}) rotate(-8deg)`, transformOrigin: "0 50%" }} />
          </div>
        </Pop>
        <Pop p={pop(at(cues, 1, 0.9))} from={0.8}>
          <div style={{ width: 440, height: 440, background: ex.white, borderRadius: 30, boxShadow: "0 24px 60px rgba(0,0,0,0.16)", border: `6px solid ${GREEN}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: fonts.semibold, fontSize: 34, color: GREEN }}>Claude</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 112, color: ex.ink, letterSpacing: -4 }}>15 Min.</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 28, color: "#8A8A8A" }}>fertiger Entwurf</div>
          </div>
        </Pop>
      </div>
      <Place top={1110}><Pop p={pop(at(cues, 1, 0.9) + 0.4)}><Chip text="Anwalt liest nur noch gegen" icon="check" big /></Pop></Place>
    </Board>
  );
};

// 2 "Du gibst Claude deine Website, dein Angebot und ein paar Antworten zu Zahlung, Lieferung und Haftung."
// cues: [Website, Angebot, Zahlung, Lieferung, Haftung] — split
export const AgFragen: React.FC<AgProps> = ({ avatar, cues }) => {
  const { pop } = useT();
  const items: [string, string][] = [["🌐", "Website"], ["📄", "Angebot"], ["💶", "Zahlung"], ["🚚", "Lieferung"], ["🛡️", "Haftung"]];
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Schritt 1: Eckdaten" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 190, left: 90, right: 90, display: "flex", flexWrap: "wrap", gap: 26, justifyContent: "center" }}>
        {items.map(([ic, l], i) => (
          <Pop key={l} p={pop(at(cues, i, 0.2 + i * 0.45))} from={0.7}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 38px", background: ex.white, borderRadius: 26, boxShadow: "0 14px 34px rgba(0,0,0,0.12)", fontFamily: fonts.bold, fontSize: 46, color: ex.ink }}>
              <span style={{ fontSize: 50 }}>{ic}</span>{l}
            </div>
          </Pop>
        ))}
      </div>
      <Place top={720}><Pop p={pop(at(cues, 4, 2.2) + 0.4)}><Chip text="Claude fragt, was fehlt" icon="info" /></Pop></Place>
    </Split>
  );
};

// 3 "Claude schreibt dir komplette AGB, mit Zahlungsfristen, Haftung, Widerruf und Gerichtsstand, genau passend zu deinem Geschäft."
// cues: [komplette, Zahlungsfristen, Haftung, Widerruf, Gerichtsstand] — split
export const AgEntwurf: React.FC<AgProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const paras = ["§ 1 Geltungsbereich", "§ 2 Vertragsschluss", "§ 3 Preise und Zahlungsfristen", "§ 4 Lieferung", "§ 5 Haftung", "§ 6 Widerruf", "§ 7 Gerichtsstand"];
  const hl: Record<number, number> = { 2: 1, 4: 2, 5: 3, 6: 4 };
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Schritt 2: AGB fertig" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={160}>
        <Pop p={pop(at(cues, 0, 0.1))} from={0.92}>
          <div style={{ width: 860, background: ex.white, borderRadius: 22, boxShadow: "0 18px 44px rgba(0,0,0,0.14)", padding: "28px 40px", textAlign: "left" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 34, color: ex.ink, marginBottom: 10 }}>Allgemeine Geschäftsbedingungen</div>
            {paras.map((p, i) => {
              const a = ramp(at(cues, 0, 0.1) + 0.15 + i * 0.12, at(cues, 0, 0.1) + 0.4 + i * 0.12);
              const h = hl[i] !== undefined ? ramp(at(cues, hl[i], 1 + i * 0.4), at(cues, hl[i], 1 + i * 0.4) + 0.2) : 0;
              return (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 16, padding: "9px 14px", margin: "4px -14px", borderRadius: 12, background: `rgba(46,158,91,${0.14 * h})`, opacity: a }}>
                  <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: ex.ink, flex: 1 }}>{p}</span>
                  <div style={{ width: 180, height: 10, borderRadius: 5, background: "#E6E6E6" }} />
                  <span style={{ fontFamily: fonts.bold, fontSize: 30, color: GREEN, opacity: h }}>✓</span>
                </div>
              );
            })}
          </div>
        </Pop>
      </Place>
    </Split>
  );
};

// 4 "Du lässt Claude jede einzelne Klausel gegen das AGB Recht prüfen und markieren, welche vor Gericht unwirksam sein könnte."
// cues: [Klausel, prüfen, markieren, unwirksam] — split
export const AgPruefung: React.FC<AgProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const rows: [string, string, string][] = [
    ["§ 3 Zahlung 14 Tage", GREEN, "ok"],
    ["§ 4 Lieferfristen", GREEN, "ok"],
    ["§ 5 Haftung komplett ausgeschlossen", RED, "unwirksam"],
    ["§ 6 Gewährleistung 6 Monate", AMBER, "prüfen"],
  ];
  const mark = at(cues, 3, 2.4);
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Schritt 3: Claude prüft" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={170}>
        <Pop p={pop(at(cues, 0, 0.1))} from={0.92}>
          <div style={{ width: 900, background: ex.white, borderRadius: 24, boxShadow: "0 18px 44px rgba(0,0,0,0.14)", padding: "16px 28px", textAlign: "left" }}>
            {rows.map(([l, c, s], i) => {
              const a = ramp(at(cues, 1, 0.8) + i * 0.2, at(cues, 1, 0.8) + i * 0.2 + 0.25);
              const red = c === RED ? ramp(mark, mark + 0.25) : 0;
              return (
                <div key={l} style={{ position: "relative", display: "flex", alignItems: "center", gap: 20, padding: "20px 0", borderBottom: i < rows.length - 1 ? "2px solid #F2F2F2" : "none", opacity: a }}>
                  <div style={{ width: 30, height: 30, borderRadius: 15, background: c, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 31, color: ex.ink }}>{l}</span>
                  <span style={{ fontFamily: fonts.bold, fontSize: 28, color: c }}>{s}</span>
                  {c === RED ? <div style={{ position: "absolute", left: -16, right: -16, top: 4, bottom: 4, border: `5px solid ${RED}`, borderRadius: 14, opacity: red, transform: `scale(${1.04 - 0.04 * red})` }} /> : null}
                </div>
              );
            })}
          </div>
        </Pop>
      </Place>
      <Place top={720}><Pop p={pop(mark + 0.5)}><Chip text="Vorschlag: Haftung nur begrenzen" icon="info" /></Pop></Place>
    </Split>
  );
};

// 5 "Das kostet dich eine Stunde statt fünfzehnhundert Euro."  cues: [Stunde, fünfzehnhundert] — full board
export const AgSumme: React.FC<AgProps> = ({ cues }) => {
  const { pop } = useT();
  const f = useFloat(6);
  return (
    <Board>
      <Place top={130}><Title text="Am Ende" at={-0.15} size={100} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 330 + f, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(at(cues, 0, 0.1))} from={0.7}>
          <div style={{ fontFamily: fonts.bold, fontSize: 240, lineHeight: 1, color: GREEN, letterSpacing: -8 }}>1 Std.</div>
        </Pop>
      </div>
      <Place top={1110}>
        <RowCard rows={["statt 1.500 €", "Anwalt liest gegen"]} at={at(cues, 1, 0.6)} times={[at(cues, 1, 0.6), at(cues, 1, 0.6) + 0.35]} width={640} icon="check" />
      </Place>
    </Board>
  );
};
