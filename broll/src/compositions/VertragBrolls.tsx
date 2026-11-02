import React from "react";
import {
  AvatarSource, Board, Chip, CounterPill, ex, Icon, IsoTile, lerp, Place, Pop, Split, StatusBadge, Title, useFloat, useT,
} from "../components/ExplainerKit";
import { fonts } from "../theme";

// "Vertrag" reel (2026-09-30), Explainer style. cues = seconds from the window start at which the
// matching spoken words begin (from captions.json). During B-Roll the vision caption sits centred at
// y 0.5, so full boards keep 880-1060 px free and split boards keep content above ~880 px.

export type VertragProps = { seconds: number; avatar: AvatarSource; cues: number[] };
const at = (cues: number[], i: number, fallback: number) => (cues[i] ?? fallback) - 0.08;

const RED = "#E5484D";
const RED_BG = "#FDE7E8";
const YEL = "#F5A524";
const YEL_BG = "#FEF3DC";
const GREEN = "#2FA36B";
const GREEN_BG = "#E3F5EC";

// A paper contract page with text lines; `children` render on top in page coordinates.
const Page: React.FC<{ w: number; h: number; title: string; children?: React.ReactNode; lines?: number }> = ({ w, h, title, children, lines = 14 }) => (
  <div style={{ position: "relative", width: w, height: h, background: ex.white, borderRadius: 22, boxShadow: "0 24px 60px rgba(0,0,0,0.14)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 44, top: 36, fontFamily: fonts.bold, fontSize: 30, color: ex.ink, letterSpacing: -0.5 }}>{title}</div>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 44, top: 100 + i * 34, height: 12, width: `${[78, 88, 70, 84, 62, 90, 74, 82, 66, 86, 72, 80, 60, 76][i % 14]}%`, maxWidth: w - 88, borderRadius: 6, background: "#E6E6E6" }} />
    ))}
    {children}
  </div>
);

// A highlighted clause box on the page (fades in, soft glow).
const Clause: React.FC<{ p: number; top: number; left?: number; width: number; tone: "red" | "yellow" | "green"; text: string; strike?: number }> = ({ p, top, left = 34, width, tone, text, strike = 0 }) => {
  const c = tone === "red" ? RED : tone === "yellow" ? YEL : GREEN;
  const bg = tone === "red" ? RED_BG : tone === "yellow" ? YEL_BG : GREEN_BG;
  return (
    <div style={{ position: "absolute", left, top, width, opacity: Math.min(1, p * 1.4), transform: `scale(${0.96 + 0.04 * Math.min(1, p)})`, transformOrigin: "0 50%", padding: "14px 18px", borderRadius: 14, background: bg, border: `3px solid ${c}`, boxShadow: `0 0 ${24 * Math.min(1, p)}px ${c}55` }}>
      <span style={{ fontFamily: fonts.semibold, fontSize: 25, lineHeight: 1.3, color: ex.ink, textDecoration: strike > 0.5 ? "line-through" : "none", textDecorationColor: RED, textDecorationThickness: 3 }}>{text}</span>
    </div>
  );
};

// 1 "Eine automatische Verlängerung um drei Jahre, und du zahlst für etwas, das du längst kündigen wolltest."
// cues: [automatische, drei, zahlst, kündigen]  — full board
export const VertragFalle: React.FC<VertragProps> = ({ cues }) => {
  const { pop, ramp } = useT();
  const f = useFloat(6);
  return (
    <Board>
      <Place top={120}><Title text="Seite 9, § 12" at={-0.15} size={96} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={270 + f}>
        <Pop p={pop(0.05)} from={0.9}>
          <Page w={820} h={560} title="Leasingvertrag">
            <Clause p={ramp(at(cues, 0, 0.3), at(cues, 0, 0.3) + 0.35)} top={200} width={740} tone="red"
              text="§ 12 Der Vertrag verlängert sich automatisch um 36 Monate, sofern nicht 6 Monate vor Ablauf gekündigt wird." />
          </Page>
        </Pop>
      </Place>
      <Place top={1110}>
        <Pop p={pop(at(cues, 1, 1.2))}><CounterPill from={0} to={50400} p={ramp(at(cues, 1, 1.2), at(cues, 3, 2.8))} suffix="€ · 36 × 1.400 €" icon="euro" /></Pop>
      </Place>
      <Place top={1250}>
        <Pop p={pop(at(cues, 3, 2.8))}><Chip text="Kündigung verpasst" icon="clock" big /></Pop>
      </Place>
    </Board>
  );
};

// 2 "Schritt eins: Du lädst den Vertrag hoch, und Claude markiert jede Klausel, die dich Geld kosten kann. Verlängerung, Haftung, Preiserhöhung."
// cues: [lädst, markiert, Verlängerung, Haftung, Preiserhöhung]  — split
export const VertragScan: React.FC<VertragProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const scan = ramp(at(cues, 1, 1.2), at(cues, 2, 2.4), (x) => x);
  const items = [
    { tone: "red" as const, text: "Automatische Verlängerung: 36 Monate", top: 150, i: 2, chip: "Verlängerung" },
    { tone: "red" as const, text: "Haftung: unbegrenzt", top: 250, i: 3, chip: "Haftung" },
    { tone: "yellow" as const, text: "Preisanpassung jährlich nach Ermessen", top: 350, i: 4, chip: "Preiserhöhung" },
  ];
  return (
    <Split split={1} avatar={avatar}>
      <Place top={40}><Title text="Schritt 1" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={150}>
        <Pop p={pop(0.05)} from={0.85} y={120}>
          <Page w={880} h={500} title="Vertrag.pdf" lines={12}>
            {scan > 0 && scan < 1 && <div style={{ position: "absolute", left: 0, right: 0, top: 80 + scan * 380, height: 6, background: ex.tileTop, boxShadow: `0 0 26px ${ex.tileTop}` }} />}
            {items.map((c) => <Clause key={c.text} p={ramp(at(cues, c.i, 2.5), at(cues, c.i, 2.5) + 0.3)} top={c.top} width={800} tone={c.tone} text={c.text} />)}
          </Page>
        </Pop>
      </Place>
      <div style={{ position: "absolute", top: 690, left: 0, width: 1080, display: "flex", justifyContent: "center", gap: 16 }}>
        {items.map((c) => <Pop key={c.chip} p={pop(at(cues, c.i, 2.5) + 0.05)}><Chip text={c.chip} icon={c.tone === "red" ? "info" : "clock"} big /></Pop>)}
      </div>
    </Split>
  );
};

// 3 "Schritt zwei: Claude schreibt zu jeder Klausel einen fairen Gegenvorschlag, den du direkt zurückschicken kannst."
// cues: [schreibt, Gegenvorschlag, zurückschicken]  — split
export const VertragGegenvorschlag: React.FC<VertragProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const newText = "Der Vertrag verlängert sich um 12 Monate. Kündigung mit 3 Monaten Frist.";
  const typed = ramp(at(cues, 1, 1.2), at(cues, 1, 1.2) + 1.4, (x) => x);
  return (
    <Split split={1} avatar={avatar}>
      <Place top={40}><Title text="Schritt 2" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={160}>
        <Pop p={pop(0.05)} from={0.9}>
          <Page w={880} h={470} title="§ 12 Laufzeit" lines={0}>
            <Clause p={1} top={100} width={800} tone="red" strike={ramp(at(cues, 0, 0.4), at(cues, 0, 0.4) + 0.2)} text="Der Vertrag verlängert sich automatisch um 36 Monate, sofern nicht 6 Monate vor Ablauf gekündigt wird." />
            <Clause p={ramp(at(cues, 1, 1.2) - 0.2, at(cues, 1, 1.2))} top={250} width={800} tone="green" text={newText.slice(0, Math.round(newText.length * typed)) + (typed < 1 ? "|" : "")} />
          </Page>
        </Pop>
      </Place>
      <Place top={680}>
        <Pop p={pop(at(cues, 2, 2.6))}><StatusBadge text="Gegenvorschlag per Mail verschickt" /></Pop>
      </Place>
    </Split>
  );
};

// 4 "Schritt drei: Claude prüft alle deine Verträge auf einmal und trägt jede Kündigungsfrist in deinen Kalender ein. Nie wieder eine Frist verpasst."
// cues: [alle, Kündigungsfrist, Kalender, Nie]  — split
export const VertragKalender: React.FC<VertragProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const docs = ["Leasing", "Software", "Telefon", "Wartung", "Versicherung"];
  const into = ramp(at(cues, 1, 1.8), at(cues, 2, 2.6));
  const events = [{ d: 3, label: "Leasing" }, { d: 9, label: "Software" }, { d: 16, label: "Wartung" }, { d: 24, label: "Telefon" }];
  return (
    <Split split={1} avatar={avatar}>
      <Place top={40}><Title text="Schritt 3" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      {/* The stack of contracts, then they shrink into the calendar */}
      <div style={{ position: "absolute", top: 170, left: 0, width: 1080, display: "flex", justifyContent: "center", gap: 14, opacity: 1 - into, transform: `translateY(${into * 120}px) scale(${1 - 0.4 * into})` }}>
        {docs.map((d, i) => (
          <Pop key={d} p={pop(0.05 + i * 0.08)} from={0.7}>
            <div style={{ width: 170, height: 220, background: ex.white, borderRadius: 16, boxShadow: "0 12px 28px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <Icon name="file" size={60} color={ex.tileTop} />
              <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: ex.ink }}>{d}</div>
            </div>
          </Pop>
        ))}
      </div>
      <div style={{ position: "absolute", top: 160, left: 120, width: 840, opacity: into, transform: `scale(${0.9 + 0.1 * into})`, transformOrigin: "50% 0" }}>
        <div style={{ background: ex.white, borderRadius: 26, boxShadow: "0 18px 44px rgba(0,0,0,0.12)", padding: 26 }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 34, color: ex.ink, marginBottom: 14 }}>Kalender · Kündigungsfristen</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
            {Array.from({ length: 28 }).map((_, i) => {
              const ev = events.findIndex((e) => e.d === i + 1);
              const ep = ev >= 0 ? pop(at(cues, 2, 2.6) + ev * 0.18) : 0;
              return (
                <div key={i} style={{ height: 66, borderRadius: 10, background: "#F4F4F4", padding: 6, position: "relative" }}>
                  <div style={{ fontFamily: fonts.medium, fontSize: 18, color: "#9A9A9A" }}>{i + 1}</div>
                  {ev >= 0 && (
                    <div style={{ position: "absolute", left: 4, right: 4, bottom: 6, height: 24, borderRadius: 7, background: RED, opacity: Math.min(1, ep), transform: `scale(${0.6 + 0.4 * Math.min(1.1, ep)})`, display: "grid", placeItems: "center", fontFamily: fonts.semibold, fontSize: 14, color: "#fff" }}>{events[ev].label}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Place top={740}>
        <Pop p={pop(at(cues, 3, 3.6))}><StatusBadge text="Nie wieder eine Frist verpasst" /></Pop>
      </Place>
    </Split>
  );
};

// 5 "Den letzten Blick macht dein Anwalt, in zehn Minuten statt zwei Stunden."
// cues: [Anwalt, zehn, zwei]  — full board
export const VertragAnwalt: React.FC<VertragProps> = ({ cues }) => {
  const { pop, ramp } = useT();
  const f = useFloat(7);
  return (
    <Board>
      <Place top={160}><Title text="Dein Anwalt" at={-0.15} size={110} style={{ width: 1000 }} /></Place>
      <Place top={330 + f}><Pop p={pop(0.1)}><IsoTile size={300} icon="shield" /></Pop></Place>
      <div style={{ position: "absolute", top: 1110, left: 0, width: 1080, display: "flex", justifyContent: "center", gap: 30, alignItems: "center" }}>
        <Pop p={pop(at(cues, 2, 1.6))}>
          <div style={{ fontFamily: fonts.bold, fontSize: 64, color: "#A0A0A0", textDecoration: ramp(at(cues, 2, 1.6) + 0.3, at(cues, 2, 1.6) + 0.5) > 0.5 ? "line-through" : "none" }}>2 Std.</div>
        </Pop>
        <Pop p={pop(at(cues, 1, 1))}><div style={{ fontFamily: fonts.bold, fontSize: 96, color: ex.tileTop, letterSpacing: -3 }}>10 Min.</div></Pop>
      </div>
      <Place top={1270}><Pop p={pop(at(cues, 2, 1.6) + 0.4)}><Chip text="nur noch der letzte Blick" icon="check" big /></Pop></Place>
    </Board>
  );
};
