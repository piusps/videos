import React from "react";
import { fonts } from "../theme";
import { AvatarSrc, Count, Crowd, Fly, Logo, P, PanelSplit, PdfBadge, PropClipboard, PropLens, Rail, Slam, Stamp, Walker, popAt, ramp, useSec } from "../components/PanelKit";

// FP-N "Jahresabschluss vorbereiten" (runs/fpn-jahresabschluss, 2026-10-07), PanelKit style with the Superkind smiley.
// Times are seconds from each window start. All accounts, amounts and counts are invented examples.

export type JaProps = { seconds?: number; avatar: AvatarSrc };
const G = 690;

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: P.card, borderRadius: 26, border: `2px solid ${P.line}`, boxShadow: "0 18px 44px rgba(0,0,0,0.08)", ...style }}>{children}</div>
);

/** 0 · Hook (0-3.25): Steuerberater invoice counts to 4.000 € on "tausend" (2.56). */
export const JaHook: React.FC<JaProps> = ({ avatar }) => {
  const t = useSec();
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", inset: 0, background: "#F3EFE6" }} />
      <div style={{ position: "absolute", left: 60, top: 54, fontFamily: fonts.bold, fontSize: 22, letterSpacing: 5, color: "#B4673C" }}>SUPERKIND · MITTELSTAND</div>
      <div style={{ position: "absolute", left: 60, top: 100, width: 560, fontFamily: "Georgia, serif", fontSize: 76, lineHeight: 1.02, color: "#1A1410" }}>Jahres­abschluss? <span style={{ fontStyle: "italic", color: "#E24E17" }}>Die Vorarbeit</span> macht Claude.</div>
      <Fly t={t} at={0.8} from="right" style={{ left: 650, top: 150 }}>
        <Card style={{ width: 360, padding: "26px 28px", boxSizing: "border-box", transform: "rotate(3deg)" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 18, letterSpacing: 3, color: P.dim }}>STEUERBERATER · RECHNUNG</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: P.text, marginTop: 10 }}>Jahresabschluss</div>
          {[220, 260, 180].map((w, i) => <div key={i} style={{ width: w, height: 10, borderRadius: 5, background: "#E6E3DC", marginTop: 16 }} />)}
          <Count from={0} to={4000} t={t} a={2.4} b={3.0} suffix=" €" style={{ display: "block", marginTop: 22, fontFamily: fonts.bold, fontSize: 66, color: P.red }} />
        </Card>
      </Fly>
      <Walker t={t} size={110} mood={t > 2.9 ? "shock" : "happy"} keys={[{ t: 0, x: 120, y: G - 30 }, { t: 1.4, x: 520, y: G - 30 }, { t: 2.9, x: 520, y: G - 30 }, { t: 3.1, x: 520, y: G - 30, hop: 80 }]} />
    </PanelSplit>
  );
};

/** 1 · Most of it is groundwork (3.32-6.65). Beats: größten 0.6, Vorarbeit 1.66, Claude 2.36, übernimmt 2.8. */
export const JaVorarbeit: React.FC<JaProps> = ({ avatar }) => {
  const t = useSec();
  const fill = ramp(t, 0.5, 1.6);
  const shares: [string, number, string][] = [["Suchen & Sortieren", 70, P.red], ["Prüfen & Beraten", 30, P.green]];
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 50, fontFamily: fonts.bold, fontSize: 56, color: P.text }}>Wofür du zahlst</div>
      {shares.map(([l, v, c], i) => (
        <div key={l} style={{ position: "absolute", left: 60, right: 60, top: 170 + i * 150 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 34, color: P.text }}><span>{l}</span><span style={{ color: c }}>{Math.round(v * fill)} %</span></div>
          <div style={{ marginTop: 12, height: 40, borderRadius: 20, background: P.line, overflow: "hidden" }}><div style={{ width: `${v * fill}%`, height: "100%", background: c, borderRadius: 20 }} /></div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 60, top: 470, fontFamily: fonts.medium, fontSize: 24, color: P.dim, opacity: ramp(t, 1.6, 1.8) }}>Beispiel</div>
      <div style={{ position: "absolute", left: 340, top: 470, display: "flex", alignItems: "center", gap: 16, transform: `scale(${popAt(t, 2.3)})` }}>
        <Logo name="claude" size={90} />
        <span style={{ fontFamily: fonts.bold, fontSize: 46, color: P.text }}>übernimmt die 70 %</span>
      </div>
      <Walker t={t} size={96} prop={PropClipboard} keys={[{ t: 0, x: 1150, y: G - 20 }, { t: 1.6, x: 960, y: G - 20 }, { t: 2.8, x: 960, y: G - 20, hop: 80 }]} />
    </PanelSplit>
  );
};

/** 2 · Schritt 1: export → findings (6.72-13.0). Beats: Export 1.51, offene Posten 3.43, doppelte 4.36, fehlende Belege 5.41. */
export const JaExport: React.FC<JaProps> = ({ avatar }) => {
  const t = useSec();
  const flow = ramp(t, 1.4, 2.2);
  const finds: [string, string, string, number][] = [["Offene Posten", "7 älter als 60 Tage", P.yellow, 3.4], ["Doppelte Buchungen", "3 gefunden", P.red, 4.35], ["Fehlende Belege", "12 Buchungen", P.red, 5.4]];
  return (
    <PanelSplit avatar={avatar}>
      <Rail active={1} t={t} y={34} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 150, height: 110, display: "flex", alignItems: "center", opacity: ramp(t, 1.2, 1.4) }}>
        <Logo name="datev" size={92} />
        <div style={{ flex: 1, height: 6, margin: "0 24px", borderRadius: 3, background: P.line, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, width: `${flow * 100}%`, background: P.orange }} />
        </div>
        <div style={{ transform: `scale(${popAt(t, 2.1)})` }}><Logo name="claude" size={92} /></div>
      </div>
      {finds.map(([h, d, c, at], i) => (
        <Fly key={h} t={t} at={at} from="right" style={{ left: 60 + i * 330, top: 320 }}>
          <Card style={{ width: 300, height: 220, padding: "24px 26px", boxSizing: "border-box", borderTop: `8px solid ${c}` }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 32, color: P.text }}>{h}</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: c, marginTop: 14 }}>{d}</div>
          </Card>
        </Fly>
      ))}
      <Walker t={t} size={96} prop={PropLens} mood={t > 4.4 ? "shock" : "happy"} keys={[{ t: 0, x: 120, y: G - 20 }, { t: 3.3, x: 200, y: G - 20 }, { t: 3.6, x: 200, y: G - 20, hop: 50 }, { t: 4.3, x: 530, y: G - 20, hop: 60 }, { t: 5.3, x: 860, y: G - 20, hop: 60 }]} />
    </PanelSplit>
  );
};

/** 3 · Full panel: bank vs. books (13.08-18.45). Beats: Bankkonten 1.59, Abweichung 3.84, Heute 5.15. */
export const JaBank: React.FC<JaProps> = ({ avatar }) => {
  const t = useSec();
  const rows: [string, string, string, boolean][] = [["03.02.", "-1.190,00 €", "-1.190,00 €", true], ["17.04.", "-249,90 €", "—", false], ["30.06.", "+8.400,00 €", "+8.400,00 €", true], ["12.09.", "-58,30 €", "-85,30 €", false], ["31.12.", "+3.200,00 €", "+3.200,00 €", true]];
  return (
    <PanelSplit avatar={avatar} full>
      <div style={{ position: "absolute", left: 60, top: -250, display: "flex", alignItems: "center", gap: 18 }}>
        <Logo name="claude" size={80} />
        <span style={{ fontFamily: fonts.bold, fontSize: 56, color: P.text }}>gleicht Bank und Buchhaltung ab</span>
      </div>
      <Card style={{ position: "absolute", left: 60, top: -80, width: 960, padding: "10px 36px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", height: 90, alignItems: "center", fontFamily: fonts.bold, fontSize: 30, color: P.dim, borderBottom: `2px solid ${P.line}` }}>
          <span style={{ width: 160 }}>Datum</span><span style={{ flex: 1 }}>🏦 Bank</span><span style={{ flex: 1 }}>📒 Buchhaltung</span>
        </div>
        {rows.map(([d, b, k, ok], i) => {
          const a = ramp(t, 1.5 + i * 0.25, 1.7 + i * 0.25);
          const bad = !ok && t > 3.8 + (i === 3 ? 0.3 : 0);
          return (
            <div key={d} style={{ position: "relative", display: "flex", height: 104, alignItems: "center", fontFamily: fonts.semibold, fontSize: 34, color: P.text, borderBottom: i < 4 ? `2px solid ${P.line}` : "none", opacity: a, background: bad ? "rgba(229,72,77,0.06)" : "transparent" }}>
              <span style={{ width: 160 }}>{d}</span><span style={{ flex: 1 }}>{b}</span><span style={{ flex: 1, color: bad ? P.red : P.text }}>{k}</span>
              <span style={{ fontSize: 40, color: ok ? P.green : P.red, opacity: t > 3.6 ? 1 : 0 }}>{ok ? "✓" : "✗"}</span>
            </div>
          );
        })}
      </Card>
      <Stamp text="2 ABWEICHUNGEN" t={t} at={4.1} x={500} y={620} size={40} rot={-6} />
      <Slam text="HEUTE." t={t} at={5.1} y={820} size={140} color={P.orange} />
      <Walker t={t} size={110} prop={PropLens} keys={[{ t: 0, x: 980, y: 1100 }, { t: 3.9, x: 980, y: 1100 }, { t: 4.1, x: 980, y: 1100, hop: 80 }, { t: 5.1, x: 980, y: 1100, hop: 60 }]} />
    </PanelSplit>
  );
};

/** 4 · Full: DER TRICK + handover folder builds (18.52-26.7). Beats: Trick 0.95, Übergabe 3.22, Anlagenverzeichnis 5.07, offene Posten 6.27, Fragen 7.53. */
export const JaTrick: React.FC<JaProps> = ({ avatar }) => {
  const t = useSec();
  const items: [React.ReactNode, string, string, number][] = [
    [<Logo name="googlesheets" size={64} />, "Anlagenverzeichnis", "9 Anschaffungen, AfA-Vorschlag", 5.0],
    [<Logo name="datev" size={64} />, "Offene Posten", "alle kommentiert", 6.2],
    [<PdfBadge size={64} />, "Fragenliste", "6 Fragen an den Steuerberater", 7.45],
  ];
  return (
    <PanelSplit avatar={avatar} full>
      <Slam text="TRICK" accent="DER" t={t} at={0.85} y={-260} size={170} />
      <Card style={{ position: "absolute", left: 60, top: -40, width: 960, padding: "30px 36px", boxSizing: "border-box", opacity: ramp(t, 3.1, 3.4), transform: `scale(${0.95 + 0.05 * ramp(t, 3.1, 3.4)})` }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 40, color: P.text, marginBottom: 16 }}>📁 Übergabe an deinen Steuerberater</div>
        {items.map(([ic, h, d, at]) => {
          const k = ramp(t, at, at + 0.3);
          return (
            <div key={h} style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 0", borderTop: `2px solid ${P.line}`, opacity: k, transform: `translateX(${(1 - k) * 40}px)` }}>
              {ic}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.semibold, fontSize: 38, color: P.text }}>{h}</div>
                <div style={{ fontFamily: fonts.medium, fontSize: 28, color: P.dim }}>{d}</div>
              </div>
              <span style={{ width: 50, height: 50, borderRadius: 25, background: k > 0.95 ? P.green : P.line, color: "#fff", fontFamily: fonts.bold, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
            </div>
          );
        })}
      </Card>
      <Stamp text="FERTIG" t={t} at={7.9} x={640} y={560} size={48} color={P.green} rot={-8} />
      <Walker t={t} size={110} prop={PropClipboard} keys={[{ t: 0, x: 1150, y: 860 }, { t: 0.85, x: 540, y: 860 }, { t: 1.05, x: 540, y: 860, hop: 90 }, { t: 7.8, x: 540, y: 860 }, { t: 8.0, x: 540, y: 860, hop: 80 }]} />
    </PanelSplit>
  );
};

/** 5 · Stunden fürs Prüfen statt Suchen (26.8-31.45). Beats: Prüfen 1.7, Suchen 2.58, bleibt bei ihm 4.1. */
export const JaBerater: React.FC<JaProps> = ({ avatar }) => {
  const t = useSec();
  const bars: [string, number, number, string][] = [["Suchen", 12, 2, P.red], ["Prüfen", 4, 4, P.green]];
  const k = ramp(t, 2.5, 3.2);
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 50, fontFamily: fonts.bold, fontSize: 52, color: P.text }}>Stunden beim Steuerberater</div>
      {bars.map(([l, a, b, c], i) => {
        const v = a + (b - a) * k;
        return (
          <div key={l} style={{ position: "absolute", left: 60, right: 60, top: 170 + i * 140, opacity: ramp(t, 0.3 + i * 0.3, 0.5 + i * 0.3) }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 34, color: P.text }}><span>{l}</span><span style={{ color: c }}>{v.toFixed(0)} Std.</span></div>
            <div style={{ marginTop: 10, height: 40, borderRadius: 20, background: P.line, overflow: "hidden" }}><div style={{ width: `${(v / 12) * 100}%`, height: "100%", background: c, borderRadius: 20 }} /></div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 60, top: 470, fontFamily: fonts.medium, fontSize: 24, color: P.dim }}>Beispiel</div>
      <Fly t={t} at={4.0} from="bottom" style={{ left: 300, top: 520 }}>
        <Card style={{ height: 86, padding: "0 30px", display: "flex", alignItems: "center", gap: 14, borderRadius: 43 }}>
          <span style={{ width: 40, height: 40, borderRadius: 20, background: P.green, color: "#FFF", fontFamily: fonts.bold, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
          <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: P.text }}>Steuerberatung bleibt bei ihm</span>
        </Card>
      </Fly>
      <Crowd t={t} at={2.7} cols={6} rows={1} x={720} y={640} gap={56} size={44} step={0.04} mood="proud" />
    </PanelSplit>
  );
};

/** 6 · CTA (31.48-34.66). Beats: Prompts 0.5, Kommentiere 1.56, Abschluss 2.08, folg 2.64. */
export const JaCta: React.FC<JaProps> = ({ avatar }) => {
  const t = useSec();
  const word = "ABSCHLUSS";
  const n = Math.max(0, Math.min(word.length, Math.floor((t - 2.0) / 0.06)));
  const followed = t > 2.75;
  return (
    <PanelSplit avatar={avatar}>
      <Card style={{ position: "absolute", left: 60, top: 110, width: 960, height: 420, padding: 36, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Logo name="instagram" size={66} />
          <span style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text, flex: 1 }}>florent_preusser</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#FFF", background: followed ? "#BDBDBD" : P.orange, borderRadius: 16, padding: "12px 30px", transform: `scale(${t > 2.65 && t < 2.9 ? 1.12 : 1})` }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
        </div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim, marginTop: 44 }}>Kommentare</div>
        <div style={{ marginTop: 18, height: 96, borderRadius: 48, border: `2px solid ${P.line}`, display: "flex", alignItems: "center", padding: "0 36px", fontFamily: fonts.bold, fontSize: 46, color: P.text }}>
          {word.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0, color: P.orange }}>|</span>
        </div>
      </Card>
      <Fly t={t} at={0.4} from="bottom" style={{ left: 60, top: 572 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><PdfBadge size={60} /><span style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.text }}>Guide: 3 Prompts + Übergabe-Checkliste</span></div>
      </Fly>
      <Walker t={t} size={100} arms="point" keys={[{ t: 0.2, x: 1150, y: G - 20 }, { t: 1.0, x: 900, y: G - 20 }, { t: 2.45, x: 900, y: G - 20 }, { t: 2.7, x: 900, y: 120, hop: 80 }, { t: 2.9, x: 900, y: 150 }, { t: 3.1, x: 960, y: G - 20, hop: 40 }]} />
    </PanelSplit>
  );
};
