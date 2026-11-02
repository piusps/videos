import React from "react";
import {
  AvatarSource, Board, Chip, ex, Icon, Place, Pop, RowCard, Split, StatusBadge, Title, useFloat, useT,
} from "../components/ExplainerKit";
import { fonts } from "../theme";

// "AGB" reel (2026-10-02, ersetzt-radar B-034), Explainer style like AbmahnungBrolls. cues = seconds from
// the window start at which the matching spoken words begin. Vision captions sit at y 0.5 during B-Roll,
// so full boards keep 880-1060 px free and split boards keep content above ~880 px.

export type AgbProps = { seconds: number; avatar: AvatarSource; cues: number[] };
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

// 1 "Claude schreibt sie dir in fünfzehn Minuten."  cues: [Claude, fünfzehn, Minuten] — full board
// The lawyer's 1.500 € invoice gets struck through, the Claude chip lands on "fünfzehn".
export const AgbTempo: React.FC<AgbProps> = ({ cues }) => {
  const { pop, ramp, t } = useT();
  const f = useFloat(6);
  const strike = ramp(at(cues, 1, 0.6), at(cues, 1, 0.6) + 0.35);
  const mins = Math.min(15, Math.round(15 * ramp(at(cues, 1, 0.6), at(cues, 2, 1.1) + 0.4)));
  return (
    <Board>
      <Place top={130}><Title text="AGB in 15 Minuten" at={-0.15} size={96} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 320 + f, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(0)} from={0.9}>
          <Page w={620} h={470} title="Rechnung · Kanzlei" lines={5}>
            <div style={{ position: "absolute", left: 44, bottom: 120, fontFamily: fonts.semibold, fontSize: 28, color: "#8A8A8A" }}>Erstellung AGB</div>
            <div style={{ position: "absolute", left: 44, bottom: 36, fontFamily: fonts.bold, fontSize: 72, color: ex.ink, letterSpacing: -2 }}>
              1.500 €
              <div style={{ position: "absolute", left: -8, top: "52%", height: 8, borderRadius: 4, background: RED, width: `${108 * strike}%` }} />
            </div>
          </Page>
        </Pop>
      </div>
      <Place top={1110}>
        <Pop p={pop(at(cues, 0, 0.1))}>
          <Chip text={`Claude · ${t < at(cues, 1, 0.6) ? 0 : mins} Min.`} icon="clock" big />
        </Pop>
      </Place>
    </Board>
  );
};

// 2 "Zuerst fragt es dich aus. Was du verkaufst, an wen, wie bezahlt und geliefert wird."
// cues: [fragt, verkaufst, wen, bezahlt, geliefert] — split
export const AgbFragen: React.FC<AgbProps> = ({ avatar, cues }) => {
  const { pop } = useT();
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Claude fragt dich aus" at={-0.15} size={80} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={160}>
        <RowCard
          rows={["Was verkaufst du?", "An wen? Firmen oder Privat", "Wie wird bezahlt?", "Wie wird geliefert?"]}
          at={at(cues, 1, 0.8)}
          times={[1, 2, 3, 4].map((i) => at(cues, i, 0.4 + i * 0.6))}
          width={820}
          icon="message"
        />
      </Place>
    </Split>
  );
};

// 3 "Dann schreibt es alle Abschnitte, die rein müssen, in klarem Deutsch."
// cues: [schreibt, Abschnitte, klarem] — full board: the AGB document fills paragraph by paragraph.
export const AgbAbschnitte: React.FC<AgbProps> = ({ cues }) => {
  const { pop, t } = useT();
  const f = useFloat(5);
  const paras = ["§ 1 Geltungsbereich", "§ 2 Vertragsschluss", "§ 3 Preise & Versand", "§ 4 Zahlung", "§ 5 Lieferung", "§ 6 Widerruf", "§ 7 Gewährleistung", "§ 8 Haftung"];
  const start = at(cues, 0, 0.1);
  const end = at(cues, 2, 1.6);
  const step = Math.max(0.12, (end - start) / paras.length);
  return (
    <Board>
      <Place top={110}><Title text="Alle Abschnitte" at={-0.15} size={92} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 270 + f, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(0)} from={0.92}>
          <div style={{ position: "relative", width: 760, height: 580, background: ex.white, borderRadius: 22, boxShadow: "0 24px 60px rgba(0,0,0,0.14)", padding: "34px 44px", boxSizing: "border-box" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 34, color: ex.ink, marginBottom: 16 }}>Allgemeine Geschäftsbedingungen</div>
            {paras.map((p, i) => {
              const pp = pop(start + i * step);
              return (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 16, height: 58, opacity: Math.min(1, pp * 1.4), transform: `translateX(${(1 - Math.min(1, pp)) * -24}px)` }}>
                  <div style={{ width: 34, height: 34, borderRadius: 17, background: t > start + i * step + 0.25 ? ex.active : "#DDD", display: "grid", placeItems: "center" }}>
                    <Icon name="check" size={20} color={ex.white} stroke={3.2} />
                  </div>
                  <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: ex.ink, letterSpacing: -0.4 }}>{p}</span>
                </div>
              );
            })}
          </div>
        </Pop>
      </div>
      <Place top={1110}><Pop p={pop(at(cues, 2, 1.6))}><Chip text="In klarem Deutsch" icon="book" big /></Pop></Place>
    </Board>
  );
};

const Clause: React.FC<{ p: number; top: number; text: string }> = ({ p, top, text }) => (
  <div style={{ position: "absolute", left: 30, right: 30, top, opacity: Math.min(1, p * 1.4), transform: `scale(${0.96 + 0.04 * Math.min(1, p)})`, transformOrigin: "0 50%", padding: "14px 18px 14px 60px", borderRadius: 14, background: RED_BG, border: `3px solid ${RED}`, boxShadow: `0 0 ${22 * Math.min(1, p)}px ${RED}55` }}>
    <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, borderRadius: 15, background: RED, display: "grid", placeItems: "center" }}>
      <svg width={16} height={16} viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="#fff" strokeWidth={4} strokeLinecap="round" /></svg>
    </div>
    <span style={{ fontFamily: fonts.semibold, fontSize: 25, lineHeight: 1.3, color: ex.ink }}>{text}</span>
  </div>
);

// 4 "Es prüft jede Klausel auf das, was vor Gericht kippt, und sagt dir, was raus muss."
// cues: [prüft, Klausel, Gericht, raus] — split
export const AgbKlauseln: React.FC<AgbProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const items = [
    { text: "Wir haften nicht für Schäden jeglicher Art.", top: 110, i: 1 },
    { text: "Gewährleistung für Neuware: 6 Monate.", top: 220, i: 2 },
    { text: "Gerichtsstand ist immer unser Firmensitz.", top: 330, i: 3 },
  ];
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Kippt vor Gericht" at={-0.15} size={80} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={150}>
        <Pop p={pop(0.05)} from={0.9} y={80}>
          <Page w={880} h={480} title="Deine AGB · Prüfung" lines={11}>
            {items.map((c, k) => <Clause key={k} p={ramp(at(cues, c.i, 0.8 + k * 0.7), at(cues, c.i, 0.8 + k * 0.7) + 0.3)} top={c.top} text={c.text} />)}
          </Page>
        </Pop>
      </Place>
      <div style={{ position: "absolute", top: 660, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(at(cues, 3, 2.6))}><StatusBadge text="3 Klauseln müssen raus" /></Pop>
      </div>
    </Split>
  );
};

// 5 "Beim Anwalt, fünfzehnhundert Euro. Mit Claude, fünfzehn Minuten, …"  cues: [Anwalt, fünfzehnhundert, Claude, fünfzehn] — full board
export const AgbVorherNachher: React.FC<AgbProps> = ({ cues }) => {
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
        <Card p={pop(at(cues, 0, 0.1))} label="ANWALT" lines={["1.500 €", "+ Wochen warten"]} />
        <Card p={pop(at(cues, 2, 1.5))} label="CLAUDE" lines={["15 Min.", "+ Anwalt liest nur gegen"]} hot />
      </div>
    </Board>
  );
};
