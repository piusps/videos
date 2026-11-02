import React from "react";
import { fonts } from "../theme";
import { AvatarSrc, Count, Crowd, Fly, Logo, P, PanelSplit, PdfBadge, PropLens, PropStamp, Rail, Slam, Stamp, Walker, popAt, ramp, useSec } from "../components/PanelKit";

// FP-N "Gewerbemietvertrag prüfen" (runs/fpn-gewerbemiete, 2026-10-07), PanelKit style like BpPanelBrolls with the
// Superkind smiley. Times are seconds from each window start. All clauses and amounts are invented examples.

export type GmProps = { seconds?: number; avatar: AvatarSrc };
const G = 690;

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: P.card, borderRadius: 26, border: `2px solid ${P.line}`, boxShadow: "0 18px 44px rgba(0,0,0,0.08)", ...style }}>{children}</div>
);

/** 0 · Hook (0-3.9): lawyer invoice counts to 500 € on "fünfhundert" (3.06). */
export const GmHook: React.FC<GmProps> = ({ avatar }) => {
  const t = useSec();
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", inset: 0, background: "#F3EFE6" }} />
      <div style={{ position: "absolute", left: 60, top: 54, fontFamily: fonts.bold, fontSize: 22, letterSpacing: 5, color: "#B4673C" }}>SUPERKIND · MITTELSTAND</div>
      <div style={{ position: "absolute", left: 60, top: 100, width: 560, fontFamily: "Georgia, serif", fontSize: 76, lineHeight: 1.02, color: "#1A1410" }}>Gewerbemiet­vertrag? <span style={{ fontStyle: "italic", color: "#E24E17" }}>Erst Claude</span>, dann Anwalt.</div>
      <Fly t={t} at={0.9} from="right" style={{ left: 650, top: 150 }}>
        <Card style={{ width: 360, padding: "26px 28px", boxSizing: "border-box", transform: "rotate(3deg)" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 18, letterSpacing: 3, color: P.dim }}>KANZLEI · RECHNUNG</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: P.text, marginTop: 10 }}>Prüfung Mietvertrag</div>
          {[220, 260, 180].map((w, i) => <div key={i} style={{ width: w, height: 10, borderRadius: 5, background: "#E6E3DC", marginTop: 16 }} />)}
          <Count from={0} to={500} t={t} a={2.9} b={3.5} suffix=" €" style={{ display: "block", marginTop: 22, fontFamily: fonts.bold, fontSize: 70, color: P.red }} />
        </Card>
      </Fly>
      <Walker t={t} size={110} mood={t > 3.4 ? "shock" : "happy"} prop={PropLens} keys={[{ t: 0, x: 120, y: G - 30 }, { t: 1.5, x: 520, y: G - 30 }, { t: 3.3, x: 520, y: G - 30 }, { t: 3.5, x: 520, y: G - 30, hop: 80 }]} />
    </PanelSplit>
  );
};

/** 1 · Claude, 10 Minuten (3.96-5.9). */
export const GmErgebnis: React.FC<GmProps> = ({ avatar }) => {
  const t = useSec();
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 60, display: "flex", alignItems: "center", gap: 20, transform: `scale(${popAt(t, 0)})`, transformOrigin: "0 50%" }}>
        <Logo name="claude" size={110} />
        <span style={{ fontFamily: fonts.bold, fontSize: 64, color: P.text }}>macht die Vorarbeit</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily: fonts.bold, fontSize: 220, color: P.green, letterSpacing: -8, transform: `scale(${popAt(t, 1.3)})` }}>
        <Count from={0} to={10} t={t} a={1.3} b={1.8} /> Min.
      </div>
      <div style={{ position: "absolute", left: 160, top: 500, fontFamily: fonts.bold, fontSize: 60, color: "#A3A3A3", opacity: ramp(t, 0.2, 0.4) }}>
        500 €<div style={{ position: "absolute", left: -8, right: -8, top: "52%", height: 9, background: P.red, transform: `scaleX(${ramp(t, 1.2, 1.5)})`, transformOrigin: "0 50%" }} />
      </div>
      <Walker t={t} size={100} arms="up" mood="proud" keys={[{ t: 0, x: 900, y: G - 30 }, { t: 1.3, x: 900, y: G - 30 }, { t: 1.55, x: 900, y: G - 30, hop: 90 }]} />
    </PanelSplit>
  );
};

/** 2 · Schritt 1: contract PDF flies into Claude (6.12-8.7). Beats: Vertrag 1.4, PDF 2.07, hoch 2.26. */
export const GmUpload: React.FC<GmProps> = ({ avatar }) => {
  const t = useSec();
  const fly = ramp(t, 1.8, 2.4);
  return (
    <PanelSplit avatar={avatar}>
      <Rail active={1} t={t} y={34} />
      <div style={{ position: "absolute", left: 120 + 520 * fly, top: 220 - 40 * Math.sin(Math.PI * fly), transform: `scale(${popAt(t, 1.3) * (1 - 0.5 * fly)}) rotate(${-6 + 12 * fly}deg)`, opacity: 1 - ramp(t, 2.35, 2.5) }}>
        <Card style={{ width: 260, height: 340, padding: 24, boxSizing: "border-box" }}>
          <PdfBadge size={64} />
          <div style={{ fontFamily: fonts.bold, fontSize: 24, color: P.text, marginTop: 14 }}>Gewerbe­mietvertrag.pdf</div>
          {[180, 200, 150, 190].map((w, i) => <div key={i} style={{ width: w, height: 9, borderRadius: 5, background: "#E6E3DC", marginTop: 14 }} />)}
        </Card>
      </div>
      <div style={{ position: "absolute", left: 640, top: 200, transform: `scale(${popAt(t, 0.3) + 0.12 * Math.max(0, 1 - Math.abs(t - 2.45) * 5)})` }}>
        <Card style={{ width: 360, height: 360, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
          <Logo name="claude" size={140} tile={false} />
          <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.dim }}>{t > 2.45 ? "liest 30 Seiten …" : "Datei hochladen"}</div>
        </Card>
      </div>
      <Walker t={t} size={100} keys={[{ t: 0, x: 120, y: G - 20 }, { t: 1.5, x: 140, y: G - 20 }, { t: 2.0, x: 560, y: G - 20, hop: 60 }]} />
    </PanelSplit>
  );
};

/** 3 · Full panel: clauses get marked red (8.76-16.9). Beats: markiert 0.51, Klausel 1.16, Indexmiete 4.1, Nebenkosten 5.5. */
export const GmKlauseln: React.FC<GmProps> = ({ avatar }) => {
  const t = useSec();
  const rows: [string, string, string, number][] = [
    ["§ 3 Mietzins", "Staffel nach Vereinbarung", P.green, 1.2],
    ["§ 4 Indexmiete", "ohne Obergrenze", P.red, 4.1],
    ["§ 6 Laufzeit", "10 Jahre fest", P.yellow, 2.0],
    ["§ 7 Nebenkosten", "alle Kosten umlegbar", P.red, 5.5],
    ["§ 12 Rückbau", "Ursprungszustand", P.yellow, 2.6],
  ];
  return (
    <PanelSplit avatar={avatar} full>
      <div style={{ position: "absolute", left: 60, top: -250, display: "flex", alignItems: "center", gap: 18 }}>
        <Logo name="claude" size={80} />
        <span style={{ fontFamily: fonts.bold, fontSize: 56, color: P.text }}>markiert jede Klausel</span>
      </div>
      <Card style={{ position: "absolute", left: 60, top: -60, width: 960, padding: "20px 36px", boxSizing: "border-box" }}>
        {rows.map(([k, d, c, at], i) => {
          const a = ramp(t, 0.3 + i * 0.15, 0.5 + i * 0.15);
          const hit = ramp(t, at, at + 0.25);
          return (
            <div key={k} style={{ position: "relative", display: "flex", alignItems: "center", gap: 22, height: 128, borderTop: i ? `2px solid ${P.line}` : "none", opacity: a }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: hit > 0.5 ? c : P.line }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.semibold, fontSize: 40, color: P.text }}>{k}</div>
                <div style={{ fontFamily: fonts.medium, fontSize: 28, color: P.dim }}>{d}</div>
              </div>
              {c === P.red ? <div style={{ position: "absolute", left: -20, right: -20, top: 10, bottom: 10, border: `5px solid ${P.red}`, borderRadius: 18, opacity: hit, background: "rgba(229,72,77,0.05)" }} /> : null}
            </div>
          );
        })}
      </Card>
      <Stamp text="TEUER" t={t} at={4.3} x={700} y={110} size={40} rot={-8} />
      <Stamp text="TEUER" t={t} at={5.7} x={700} y={366} size={40} rot={6} />
      <div style={{ position: "absolute", left: 60, top: 700, display: "flex", gap: 18 }}>
        {[["2", P.red, "teuer"], ["2", P.yellow, "verhandeln"], ["1", P.green, "ok"]].map(([n, c, l], i) => (
          <div key={l} style={{ transform: `scale(${popAt(t, 6.3 + i * 0.2)})`, background: "#fff", border: `3px solid ${c}`, borderRadius: 22, padding: "14px 26px", fontFamily: fonts.bold, fontSize: 36, color: c as string }}>{n} {l}</div>
        ))}
      </div>
      <Walker t={t} size={110} prop={PropLens} mood={t > 4.2 ? "shock" : "happy"} keys={[{ t: 0, x: 980, y: 820 }, { t: 1.0, x: 980, y: 820 }, { t: 4.0, x: 980, y: 820 }, { t: 4.2, x: 980, y: 820, hop: 90 }, { t: 5.5, x: 980, y: 820, hop: 60 }]} />
    </PanelSplit>
  );
};

/** 4 · Schritt 2: worst case in euro (17.36-22.5). Beats: erklärt 0.65, schlimmsten 3.3, Betrag 4.84. */
export const GmBetrag: React.FC<GmProps> = ({ avatar }) => {
  const t = useSec();
  return (
    <PanelSplit avatar={avatar}>
      <Rail active={2} t={t} y={34} />
      <Card style={{ position: "absolute", left: 60, top: 160, width: 600, padding: "26px 30px", boxSizing: "border-box", opacity: ramp(t, 0.5, 0.7) }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 32, color: P.red }}>§ 4 Indexmiete ohne Obergrenze</div>
        <div style={{ fontFamily: fonts.regular, fontSize: 30, color: P.text, marginTop: 12, lineHeight: 1.35 }}>Die Miete steigt mit der Inflation, ohne Deckel. Bei 4 % pro Jahr zahlst du im zehnten Jahr rund 42 % mehr.</div>
      </Card>
      <div style={{ position: "absolute", left: 700, top: 170, textAlign: "center", transform: `scale(${popAt(t, 3.2)})` }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim }}>schlimmster Fall</div>
        <Count from={0} to={18400} t={t} a={3.3} b={4.7} prefix="+" suffix=" €" style={{ fontFamily: fonts.bold, fontSize: 76, color: P.red }} />
        <div style={{ fontFamily: fonts.medium, fontSize: 24, color: P.dim }}>über 10 Jahre · Beispiel</div>
      </div>
      <Stamp text="IN EURO" t={t} at={4.8} x={720} y={440} size={36} color={P.text} rot={-5} />
      <Walker t={t} size={96} mood={t > 4.6 ? "shock" : "happy"} keys={[{ t: 0, x: 980, y: G - 20 }, { t: 4.5, x: 980, y: G - 20 }, { t: 4.7, x: 980, y: G - 20, hop: 90 }]} />
    </PanelSplit>
  );
};

/** 5 · Full: DER TRICK + counter-proposals + mail to the landlord (22.64-29.45). Beats: Trick 0.81, Gegenvorschlag 4.2, schicken 6.1. */
export const GmTrick: React.FC<GmProps> = ({ avatar }) => {
  const t = useSec();
  const pairs: [string, string][] = [["Indexmiete ohne Deckel", "max. 3 % pro Jahr"], ["alle Nebenkosten", "abschließende Liste"], ["Rückbau komplett", "nur eigene Einbauten"]];
  const mail = ramp(t, 5.9, 6.5);
  return (
    <PanelSplit avatar={avatar} full>
      <Slam text="TRICK" accent="DER" t={t} at={0.7} y={-260} size={170} />
      {pairs.map(([a, b], i) => {
        const at = 3.9 + i * 0.4;
        const k = ramp(t, at, at + 0.3);
        return (
          <div key={a} style={{ position: "absolute", left: 60, right: 60, top: -20 + i * 190, display: "flex", alignItems: "center", gap: 20, opacity: ramp(t, 1.4 + i * 0.25, 1.6 + i * 0.25) }}>
            <Card style={{ flex: 1, padding: "26px 28px", fontFamily: fonts.semibold, fontSize: 34, color: "#A3A3A3", textDecoration: k > 0.5 ? "line-through" : "none" }}>{a}</Card>
            <span style={{ fontFamily: fonts.bold, fontSize: 50, color: P.orange, opacity: k }}>→</span>
            <Card style={{ flex: 1, padding: "26px 28px", fontFamily: fonts.bold, fontSize: 34, color: P.green, border: `3px solid ${P.green}`, opacity: k, transform: `scale(${0.9 + 0.1 * k})` }}>{b}</Card>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 300 + 420 * mail, top: 640 - 120 * mail, opacity: t > 5.8 ? 1 - ramp(t, 6.5, 6.8) : 0, transform: `rotate(${-8 * mail}deg)` }}>
        <Card style={{ padding: "22px 30px", fontFamily: fonts.semibold, fontSize: 32, color: P.text }}>✉️ An den Vermieter</Card>
      </div>
      <Stamp text="GESENDET" t={t} at={6.5} x={620} y={560} size={40} color={P.green} rot={-6} />
      <Walker t={t} size={110} prop={PropStamp} keys={[{ t: 0, x: 1150, y: 860 }, { t: 0.7, x: 540, y: 860 }, { t: 0.95, x: 540, y: 860, hop: 90 }, { t: 3.9, x: 540, y: 860 }, { t: 4.1, x: 540, y: 860, hop: 60 }]} />
    </PanelSplit>
  );
};

/** 6 · Anwalt nur letzter Blick (29.5-32.5). Beats: Anwalt 0.1, letzten Blick 1.4, ganze Arbeit 2.5. */
export const GmAnwalt: React.FC<GmProps> = ({ avatar }) => {
  const t = useSec();
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: fonts.semibold, fontSize: 44, color: P.dim }}>Dein Anwalt</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: fonts.bold, fontSize: 150, color: P.green, letterSpacing: -5, transform: `scale(${popAt(t, 1.3)})` }}>letzter Blick</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontFamily: fonts.bold, fontSize: 84, color: "#A3A3A3", opacity: ramp(t, 1.9, 2.1) }}>
        <span style={{ position: "relative" }}>statt ganze Arbeit<span style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 9, background: P.red, transform: `scaleX(${ramp(t, 2.4, 2.65)})`, transformOrigin: "0 50%" }} /></span>
      </div>
      <Crowd t={t} at={2.6} cols={10} rows={1} x={100} y={600} gap={98} size={60} step={0.03} mood="proud" />
    </PanelSplit>
  );
};

/** 7 · CTA (32.56-37.36): comment MIETE, follow. Beats: Prompts 0.5, Guide 2.7, Kommentiere 3.2, Miete 3.8, folg 4.25. */
export const GmCta: React.FC<GmProps> = ({ avatar }) => {
  const t = useSec();
  const word = "MIETE";
  const n = Math.max(0, Math.min(word.length, Math.floor((t - 3.7) / 0.08)));
  const followed = t > 4.4;
  return (
    <PanelSplit avatar={avatar}>
      <Card style={{ position: "absolute", left: 60, top: 110, width: 960, height: 420, padding: 36, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Logo name="instagram" size={66} />
          <span style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text, flex: 1 }}>florent_preusser</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#FFF", background: followed ? "#BDBDBD" : P.orange, borderRadius: 16, padding: "12px 30px", transform: `scale(${t > 4.3 && t < 4.55 ? 1.12 : 1})` }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
        </div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim, marginTop: 44 }}>Kommentare</div>
        <div style={{ marginTop: 18, height: 96, borderRadius: 48, border: `2px solid ${P.line}`, display: "flex", alignItems: "center", padding: "0 36px", fontFamily: fonts.bold, fontSize: 46, color: P.text }}>
          {word.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0, color: P.orange }}>|</span>
        </div>
      </Card>
      <Fly t={t} at={0.5} from="bottom" style={{ left: 60, top: 572 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><PdfBadge size={60} /><span style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.text }}>Guide: alle Prompts + Klausel-Checkliste</span></div>
      </Fly>
      <Walker t={t} size={100} arms="point" keys={[{ t: 0.2, x: 1150, y: G - 20 }, { t: 1.2, x: 900, y: G - 20 }, { t: 4.1, x: 900, y: G - 20 }, { t: 4.35, x: 900, y: 120, hop: 80 }, { t: 4.6, x: 900, y: 150 }, { t: 4.85, x: 960, y: G - 20, hop: 40 }]} />
    </PanelSplit>
  );
};
