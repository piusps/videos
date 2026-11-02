import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts } from "../theme";
import { AnswerBlock, C, Camera, ClaudeMark, InputBox, RedFrame, prog, typed, useT } from "../components/ClaudeKit";
import { Ask, Chip, INPUT, Paper, PlusUpload, ResultCard } from "./GptBatchBrolls";

// @florentgpt batch for 2026-10-04 (H-001 Codes, H-014 Rabatt, H-018 Nebenkosten), ClaudeKit click paths.
// Plus menu + "Websuche" from runs/gpt-urlaub-mallorca/klickpfad (the Rabatt reel reuses GUPlus for that
// exact path). Every answer, deal, code, amount and letter shown here is an invented example.

// ---------- H-001 Codes ----------

export type GCItemProps = { seconds?: number; n: number; text: string; head: string; body: string; table?: [string, string][]; chips?: string[] };

const Progress: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
    <div style={{ fontFamily: fonts.bold, fontSize: 64, color: C.text, backgroundColor: C.orange, borderRadius: 999, padding: "10px 46px" }}>{n} / 10</div>
    <div style={{ display: "flex", gap: 14 }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ width: i + 1 === n ? 46 : 18, height: 18, borderRadius: 9, backgroundColor: i < n ? C.orange : C.panelBorder }} />
      ))}
    </div>
  </div>
);

export const GCItem: React.FC<GCItemProps> = ({ n, text, head, body, table, chips }) => {
  const t = useT();
  const ans = prog(t, 1.05, 1.35);
  return (
    <Camera keys={[[0, 540, 900, 1.0], [3, 540, 900, 1.04]]}>
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        <Progress n={n} />
        <InputBox x={INPUT.x} y={420} w={INPUT.w} text={typed(text, t, 0.05, 0.85)} caret={t < 0.95} />
        <RedFrame x={INPUT.x - 10} y={410} w={INPUT.w + 20} h={270} at={0.9} />
        <div style={{ position: "absolute", left: 60, right: 60, top: 760, display: "flex", alignItems: "center", gap: 16, opacity: ans }}>
          <ClaudeMark size={44} />
          <span style={{ fontFamily: fonts.regular, fontSize: 32, color: C.dim }}>Claude</span>
        </div>
        {table ? (
          <div style={{ position: "absolute", left: 60, right: 60, top: 840, border: `2px solid ${C.panelBorder}`, borderRadius: 20, overflow: "hidden", opacity: ans }}>
            {table.map(([a, b], i) => (
              <div key={i} style={{ display: "flex", backgroundColor: i === 0 ? C.panel : "transparent", borderTop: i ? `2px solid ${C.panelBorder}` : "none" }}>
                <span style={{ flex: 1, padding: "16px 22px", fontFamily: i === 0 ? fonts.bold : fonts.regular, fontSize: 32, color: C.text }}>{a}</span>
                <span style={{ flex: 1, padding: "16px 22px", fontFamily: i === 0 ? fonts.bold : fonts.regular, fontSize: 32, color: C.text, borderLeft: `2px solid ${C.panelBorder}` }}>{b}</span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <AnswerBlock y={840} heading={head} body={body} appear={ans} />
            {chips ? (
              <div style={{ position: "absolute", left: 60, right: 60, top: 1010, opacity: prog(t, 1.3, 1.6) }}>
                {chips.map((c) => <Chip key={c} text={c} tone="green" />)}
              </div>
            ) : null}
          </>
        )}
      </AbsoluteFill>
    </Camera>
  );
};

/** Right after the hook: the same question without and with a sentence in front. */
export const GCErgebnis: React.FC = () => {
  const t = useT();
  const a = prog(t, 0, 0.35);
  const b = prog(t, 0.9, 1.25);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1B1B1A" }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 110, backgroundColor: C.bg, border: `2px solid ${C.panelBorder}`, borderRadius: 28, padding: "30px 36px", opacity: a * (1 - 0.45 * b) }}>
        <div style={{ fontFamily: fonts.medium, fontSize: 26, color: C.faint, letterSpacing: 2 }}>OHNE SATZ</div>
        <div style={{ fontFamily: fonts.regular, fontSize: 34, color: C.dim, lineHeight: 1.45, marginTop: 10 }}>Strom sparen kann man auf viele Arten. Grundsätzlich ist es sinnvoll, Geräte auszuschalten, wenn man sie nicht nutzt, und außerdem …</div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 470, backgroundColor: C.bg, border: `3px solid ${C.orange}`, borderRadius: 28, padding: "30px 36px", opacity: b, transform: `translateY(${(1 - b) * 40}px)`, boxShadow: "0 30px 90px rgba(0,0,0,0.6)" }}>
        <div style={{ fontFamily: fonts.medium, fontSize: 26, color: C.orange, letterSpacing: 2 }}>MIT „ERST DAS ERGEBNIS“</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 40, color: C.text, marginTop: 12 }}>Spart dir ca. 180 € im Jahr:</div>
        {["Standby aus: ca. 70 €", "Waschen bei 30 °C: ca. 50 €", "Kühlschrank auf 7 °C: ca. 60 €"].map((l, i) => (
          <div key={l} style={{ fontFamily: fonts.regular, fontSize: 34, color: C.text, marginTop: 12, opacity: prog(t, 1.2 + i * 0.2, 1.45 + i * 0.2) }}>✓ {l}</div>
        ))}
      </div>
      <RedFrame x={50} y={460} w={980} h={400} at={1.9} />
    </AbsoluteFill>
  );
};

// ---------- H-014 Rabatt ----------

const GR_N1 = "Ich buche diese Reise. Such mir alle aktuellen Gutscheincodes, Cashback und Rabatte dafür, jeweils mit Link.";
const GR_N2 = "Welche davon kann ich kombinieren, und was spare ich insgesamt?";

const Deal: React.FC<{ y: number; title: string; sub: string; save: string; appear: number }> = ({ y, title, sub, save, appear }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: y, display: "flex", alignItems: "center", gap: 20, padding: "22px 26px", backgroundColor: C.panel, border: `2px solid ${C.panelBorder}`, borderRadius: 22, opacity: appear, transform: `translateX(${(1 - appear) * 30}px)` }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: fonts.bold, fontSize: 36, color: C.text }}>{title}</div>
      <div style={{ fontFamily: fonts.regular, fontSize: 28, color: C.blue, marginTop: 6 }}>{sub} ↗</div>
    </div>
    <div style={{ fontFamily: fonts.bold, fontSize: 40, color: "#4CAF50" }}>{save}</div>
  </div>
);

export const GRErgebnis: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1B1B1A" }}>
    <ResultCard
      kicker="CLAUDE · FÜR DEINE REISE GEFUNDEN"
      rows={[
        ["Gutscheincode beim Anbieter", "10 % auf die Unterkunft · Quelle: Anbieter-Newsletter"],
        ["Geld zurück über ein Bonusportal", "4 % vom Reisepreis · Quelle: Portal-Seite"],
        ["Vorteil deiner Kreditkarte", "Reiserücktritt inklusive · Quelle: Kartenbedingungen"],
      ]}
      times={[0.6, 1.0, 1.4]}
    />
  </AbsoluteFill>
);

export const GRNachricht1: React.FC = () => (
  <Ask msg={GR_N1} status="Web durchsucht · 14 Quellen" typeTo={5.2} sendAt={5.6} camera={[[0, 540, 1560, 1.08], [5.5, 540, 1560, 1.08], [5.95, 540, 900, 1.0], [9.6, 540, 940, 1.02]]}>
    {(t) => (
      <>
        <Deal y={560} title="10 % Gutscheincode" sub="anbieter.de/newsletter" save="−64 €" appear={prog(t, 6.3, 6.6)} />
        <Deal y={720} title="4 % Geld zurück" sub="bonusportal.de/reisen" save="−26 €" appear={prog(t, 6.6, 6.9)} />
        <Deal y={880} title="Frühbucher-Rabatt" sub="anbieter.de/angebote" save="−40 €" appear={prog(t, 6.9, 7.2)} />
        <RedFrame x={50} y={550} w={980} h={480} at={7.6} />
      </>
    )}
  </Ask>
);

export const GRNachricht2: React.FC = () => (
  <Ask msg={GR_N2} status="Rechnet nach" typeTo={2.8} sendAt={3.0} camera={[[0, 540, 1560, 1.08], [2.9, 540, 1560, 1.08], [3.35, 540, 860, 1.0], [6.8, 540, 900, 1.03]]}>
    {(t) => (
      <>
        <AnswerBlock y={420} heading="Kombinierbar" body="Gutscheincode + Geld zurück über das Bonusportal. Der Frühbucher-Rabatt gilt nicht zusammen mit dem Code." appear={prog(t, 3.4, 3.7)} />
        <div style={{ position: "absolute", left: 60, right: 60, top: 760, backgroundColor: C.panel, border: `3px solid #4CAF50`, borderRadius: 26, padding: "30px 36px", opacity: prog(t, 3.9, 4.2), transform: `scale(${0.95 + 0.05 * prog(t, 3.9, 4.2)})` }}>
          <div style={{ fontFamily: fonts.medium, fontSize: 28, color: C.dim }}>Du sparst insgesamt</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 96, color: "#4CAF50", lineHeight: 1.1 }}>ca. 90 €</div>
          <div style={{ fontFamily: fonts.regular, fontSize: 30, color: C.dim }}>Reise statt 640 € nur noch ca. 550 €</div>
        </div>
        <RedFrame x={50} y={750} w={980} h={290} at={4.5} />
      </>
    )}
  </Ask>
);

// ---------- H-018 Nebenkosten ----------

const NK_ROWS: [string, string, boolean][] = [
  ["Grundsteuer", "312,00 €", false],
  ["Wasser / Abwasser", "418,50 €", false],
  ["Müllabfuhr", "196,20 €", false],
  ["Verwaltung", "240,00 €", true],
  ["Hausmeister", "286,40 €", false],
  ["Reparatur Treppenhaus", "180,00 €", true],
];

const Statement: React.FC<{ w: number; markAt: number }> = ({ w, markAt }) => {
  const t = useT();
  const s = w / 800;
  return (
    <div style={{ width: w, backgroundColor: "#FBFAF6", borderRadius: 10 * s, boxShadow: "0 30px 80px rgba(0,0,0,0.55)", padding: `${46 * s}px ${50 * s}px`, boxSizing: "border-box" }}>
      <div style={{ fontFamily: fonts.bold, fontSize: 40 * s, color: "#1A1A1A" }}>Nebenkostenabrechnung 2025</div>
      <div style={{ fontFamily: fonts.regular, fontSize: 24 * s, color: "#666", margin: `${6 * s}px 0 ${24 * s}px` }}>Wohnung 3. OG links · 68 m²</div>
      {NK_ROWS.map(([l, v, bad], i) => {
        const m = bad ? prog(t, markAt + (i > 3 ? 0.3 : 0), markAt + (i > 3 ? 0.3 : 0) + 0.25) : 0;
        return (
          <div key={l} style={{ position: "relative", display: "flex", justifyContent: "space-between", fontFamily: fonts.regular, fontSize: 30 * s, color: "#1A1A1A", padding: `${12 * s}px 0`, borderTop: "2px solid #ECEAE3" }}>
            <span>{l}</span>
            <span style={{ fontFamily: fonts.semibold }}>{v}</span>
            {bad ? (
              <>
                <div style={{ position: "absolute", left: -12 * s, right: -12 * s, top: 2, bottom: 2, border: `${5 * s}px solid #E53935`, borderRadius: 10 * s, opacity: m }} />
                <div style={{ position: "absolute", left: 0, top: "50%", height: 4 * s, width: `${m * 100}%`, backgroundColor: "#E53935" }} />
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export const GNErgebnis: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ backgroundColor: "#1B1B1A" }}>
      <div style={{ position: "absolute", left: 90, top: 110, opacity: prog(t, 0, 0.35), transform: `rotate(-2deg)` }}><Statement w={900} markAt={0.8} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", opacity: prog(t, 1.5, 1.8) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 52, color: "#fff", backgroundColor: "#C62828", borderRadius: 999, padding: "16px 40px" }}>420 € zu viel berechnet</span>
      </div>
    </AbsoluteFill>
  );
};

const NK_THUMB = <Paper w={110} title="Abrechnung" lines={8} />;
export const GNPlus: React.FC = () => <PlusUpload thumb={NK_THUMB} />;

export const GNNachricht1: React.FC = () => (
  <Ask msg="Prüf meine Nebenkostenabrechnung auf Fehler." thumb={NK_THUMB} status="Bild gelesen" typeTo={2.0} sendAt={2.3} camera={[[0, 540, 1560, 1.08], [2.2, 540, 1560, 1.08], [2.65, 540, 900, 1.0], [8.3, 540, 930, 1.03]]}>
    {(t) => (
      <>
        <AnswerBlock y={470} heading="Diese Posten darf dein Vermieter nicht umlegen" body="" appear={prog(t, 2.8, 3.1)} />
        <div style={{ position: "absolute", left: 60, right: 60, top: 560, opacity: prog(t, 3.0, 3.3) }}>
          <Chip text="Verwaltung · 240 €" />
          <Chip text="Reparatur Treppenhaus · 180 €" />
        </div>
        <AnswerBlock y={770} heading="Das passt" body="Grundsteuer, Wasser, Müll und Hausmeister sind umlagefähig. Der Zeitraum umfasst zwölf Monate." appear={prog(t, 5.0, 5.3)} />
        <RedFrame x={50} y={460} w={980} h={270} at={4.0} />
      </>
    )}
  </Ask>
);

export const GNBrief: React.FC = () => (
  <Ask msg="Schreib mir den Brief an meinen Vermieter." status="Brief wird geschrieben" typeTo={0.8} sendAt={0.95} camera={[[0, 540, 1560, 1.08], [0.9, 540, 1560, 1.08], [1.35, 540, 900, 1.0], [4.5, 540, 960, 1.04]]}>
    {(t) => {
      const lines: [string, boolean][] = [
        ["Einwände gegen die Nebenkostenabrechnung 2025", true],
        ["Sehr geehrte Frau Muster,", false],
        ["gegen die Abrechnung erhebe ich folgende Einwände:", false],
        ["1. Verwaltungskosten (240 €) sind nicht umlagefähig.", false],
        ["2. Die Reparatur im Treppenhaus (180 €) ist Instandhaltung.", false],
        ["Bitte korrigieren Sie die Abrechnung und schicken Sie mir die Belege.", false],
      ];
      return (
        <>
          <div style={{ position: "absolute", left: 50, right: 50, top: 320, backgroundColor: "#FBFAF6", borderRadius: 22, padding: "40px 44px", opacity: prog(t, 1.3, 1.6), boxShadow: "0 24px 70px rgba(0,0,0,0.5)" }}>
            {lines.map(([l, h], i) => (
              <div key={i} style={{ fontFamily: h ? fonts.bold : fonts.regular, fontSize: h ? 36 : 31, lineHeight: 1.5, color: "#1A1A1A", marginBottom: h ? 10 : 2, opacity: prog(t, 1.5 + i * 0.22, 1.7 + i * 0.22) }}>
                {l}
              </div>
            ))}
          </div>
          <RedFrame x={60} y={569} w={960} h={138} at={2.9} />
        </>
      );
    }}
  </Ask>
);
