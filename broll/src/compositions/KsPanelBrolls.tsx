import React from "react";
import { fonts } from "../theme";
import { AvatarSrc, Crowd, Fly, Logo, P, PanelSplit, PdfBadge, PropClipboard, PropLens, PropMegaphone, Rail, Slam, Stamp, Walker, popAt, ramp, useSec } from "../components/PanelKit";

// FP-N "Kunden über Stellenanzeigen" (runs/fpn-kunden-stellenanzeigen, 2026-10-08), PanelKit style with the Superkind smiley.
// Template: JaPanelBrolls.tsx. Times are seconds from each window start. Firms, people and cities are invented examples.

export type KsProps = { seconds?: number; avatar: AvatarSrc };
const G = 690;

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: P.card, borderRadius: 26, border: `2px solid ${P.line}`, boxShadow: "0 18px 44px rgba(0,0,0,0.08)", ...style }}>{children}</div>
);

const typed = (s: string, t: number, a: number, cps = 28) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((t - a) * cps))));

/** 0 · Hook (0-4.55): job ad → OFFENER AUFTRAG, Claude sends offer. Beats: Firmen 0.69, suchen 2.86, schreibt 3.4, Angebot 4.13. */
export const KsHook: React.FC<KsProps> = ({ avatar }) => {
  const t = useSec();
  const fly = ramp(t, 3.5, 4.2);
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", inset: 0, background: "#F3EFE6" }} />
      <div style={{ position: "absolute", left: 60, top: 54, fontFamily: fonts.bold, fontSize: 22, letterSpacing: 5, color: "#B4673C" }}>SUPERKIND · MITTELSTAND</div>
      <div style={{ position: "absolute", left: 60, top: 100, width: 560, fontFamily: "Georgia, serif", fontSize: 74, lineHeight: 1.02, color: "#1A1410" }}>Stellen­anzeige <span style={{ fontStyle: "italic", color: "#E24E17" }}>= offener Auftrag.</span></div>
      <Fly t={t} at={0.6} from="right" style={{ left: 650, top: 130 }}>
        <Card style={{ width: 360, padding: "26px 28px", boxSizing: "border-box", transform: "rotate(3deg)" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 18, letterSpacing: 3, color: P.dim }}>STELLENANZEIGE</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.text, marginTop: 10 }}>Wir suchen: Buchhaltung (m/w/d)</div>
          {[240, 280, 200].map((w, i) => <div key={i} style={{ width: w, height: 10, borderRadius: 5, background: "#E6E3DC", marginTop: 16 }} />)}
        </Card>
      </Fly>
      <Stamp text="OFFENER AUFTRAG" t={t} at={2.85} x={640} y={420} size={34} rot={-8} color={P.green} />
      <div style={{ position: "absolute", left: 60, top: 470, display: "flex", alignItems: "center", gap: 16, transform: `scale(${popAt(t, 3.35)})` }}>
        <Logo name="claude" size={84} />
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: P.text }}>schreibt dein Angebot</span>
      </div>
      <div style={{ position: "absolute", left: 120 + fly * 700, top: 590 - fly * 120, opacity: fly > 0 && fly < 1 ? 1 : 0, transform: `rotate(${-10 + fly * 20}deg)` }}><Logo name="gmail" size={70} /></div>
      <Walker t={t} size={100} prop={PropLens} keys={[{ t: 0, x: 120, y: G - 30 }, { t: 1.6, x: 470, y: G - 30 }, { t: 2.8, x: 470, y: G - 30 }, { t: 3.0, x: 470, y: G - 30, hop: 80 }]} />
    </PanelSplit>
  );
};

/** 1 · Problem + Budget, nobody offers (4.66-10.1). Beats: Stellenanzeige 0.4, Problem 2.2, Budget 2.77, Nur 3.46, Selbstständiger 4.64. */
export const KsBudget: React.FC<KsProps> = ({ avatar }) => {
  const t = useSec();
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 50, fontFamily: fonts.bold, fontSize: 52, color: P.text, opacity: ramp(t, 0.2, 0.5) }}>Eine Stellenanzeige heißt:</div>
      <div style={{ position: "absolute", left: 300, top: 190, transform: `scale(${popAt(t, 0.4) * (1 - ramp(t, 1.9, 2.1))}) rotate(3deg)` }}>
        <Card style={{ padding: "16px 26px", fontFamily: fonts.bold, fontSize: 44, color: P.text }}>📌 Wir suchen (m/w/d)</Card>
      </div>
      <Fly t={t} at={2.1} from="left" style={{ left: 60, top: 150 }}>
        <Card style={{ width: 450, height: 150, display: "flex", alignItems: "center", gap: 18, padding: "0 30px", boxSizing: "border-box", borderLeft: `10px solid ${P.red}` }}>
          <span style={{ fontSize: 58 }}>🔥</span><span style={{ fontFamily: fonts.bold, fontSize: 46, color: P.text }}>Problem</span>
        </Card>
      </Fly>
      <Fly t={t} at={2.7} from="right" style={{ left: 570, top: 150 }}>
        <Card style={{ width: 450, height: 150, display: "flex", alignItems: "center", gap: 18, padding: "0 30px", boxSizing: "border-box", borderLeft: `10px solid ${P.green}` }}>
          <span style={{ fontSize: 58 }}>💶</span><span style={{ fontFamily: fonts.bold, fontSize: 46, color: P.text }}>Budget</span>
        </Card>
      </Fly>
      <div style={{ position: "absolute", left: 60, top: 350, fontFamily: fonts.semibold, fontSize: 34, color: P.dim, opacity: ramp(t, 3.4, 3.7) }}>Wer sich meldet:</div>
      <div style={{ position: "absolute", left: 60, top: 410, fontFamily: fonts.semibold, fontSize: 34, color: P.text, opacity: ramp(t, 3.5, 3.8) }}>Bewerber</div>
      <Crowd t={t} at={3.6} cols={8} rows={1} x={300} y={440} gap={64} size={44} step={0.04} />
      <div style={{ position: "absolute", left: 60, top: 520, fontFamily: fonts.semibold, fontSize: 34, color: P.text, opacity: ramp(t, 4.5, 4.8) }}>Selbstständige</div>
      <div style={{ position: "absolute", left: 340, top: 508, fontFamily: fonts.bold, fontSize: 56, color: P.red, transform: `scale(${popAt(t, 4.7)})` }}>fast nie</div>
      <Walker t={t} size={96} mood={t > 4.7 ? "shock" : "happy"} keys={[{ t: 0, x: 1150, y: G - 20 }, { t: 1.8, x: 940, y: G - 20 }, { t: 4.7, x: 940, y: G - 20 }, { t: 4.9, x: 940, y: G - 20, hop: 70 }]} />
    </PanelSplit>
  );
};

/** 2 · Schritt 1: offer + city (11.22-14.05). Beats: sag 1.0, anbietest 1.64, Stadt 2.5. */
export const KsAngebot: React.FC<KsProps> = ({ avatar }) => {
  const t = useSec();
  const msg = "Ich biete Buchhaltung für kleine Firmen an. Stadt: Köln.";
  return (
    <PanelSplit avatar={avatar}>
      <Rail active={1} t={t} y={34} />
      <Card style={{ position: "absolute", left: 60, top: 170, width: 960, height: 330, padding: "30px 36px", boxSizing: "border-box", opacity: ramp(t, 0.3, 0.6) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Logo name="claude" size={64} /><span style={{ fontFamily: fonts.bold, fontSize: 32, color: P.text }}>Claude</span></div>
        <div style={{ marginTop: 28, minHeight: 130, borderRadius: 24, border: `2px solid ${P.line}`, padding: "22px 28px", fontFamily: fonts.semibold, fontSize: 38, lineHeight: 1.3, color: P.text }}>
          {typed(msg, t, 0.6, 42)}<span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0, color: P.orange }}>|</span>
        </div>
      </Card>
      <div style={{ position: "absolute", left: 60, top: 540, display: "flex", gap: 20 }}>
        <div style={{ transform: `scale(${popAt(t, 1.6)})` }}><Card style={{ padding: "14px 26px", borderRadius: 40, fontFamily: fonts.bold, fontSize: 30, color: P.text }}>💼 Angebot</Card></div>
        <div style={{ transform: `scale(${popAt(t, 2.2)})` }}><Card style={{ padding: "14px 26px", borderRadius: 40, fontFamily: fonts.bold, fontSize: 30, color: P.text }}>📍 Stadt</Card></div>
      </div>
      <Walker t={t} size={96} prop={PropClipboard} keys={[{ t: 0, x: 1150, y: G - 20 }, { t: 1.2, x: 930, y: G - 20 }, { t: 2.5, x: 930, y: G - 20, hop: 70 }]} />
    </PanelSplit>
  );
};

/** 3 · Full: Schritt 2, web search → 10 firms with contact (14.14-21.55). Beats: sucht 1.28, Stellenanzeigen 2.4, zehn Firmen 4.6, Ansprechpartner 5.46, Anzeige 6.76. */
export const KsListe: React.FC<KsProps> = ({ avatar }) => {
  const t = useSec();
  const q = "Stellenanzeigen Buchhaltung Köln";
  const rows: [string, string][] = [["Firma A · Maschinenbau", "Frau K., HR"], ["Firma B · Logistik", "Herr M., GF"], ["Firma C · Handwerk", "—"], ["Firma D · Agentur", "Frau S., Office"], ["Firma E · Praxis", "Herr T., Inhaber"]];
  return (
    <PanelSplit avatar={avatar} full>
      <div style={{ position: "absolute", left: 60, top: -270, display: "flex", alignItems: "center", gap: 18, opacity: ramp(t, 0.1, 0.4) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, letterSpacing: 4, color: P.orange }}>SCHRITT 2</span>
      </div>
      <Card style={{ position: "absolute", left: 60, top: -210, width: 960, height: 110, display: "flex", alignItems: "center", gap: 20, padding: "0 30px", boxSizing: "border-box", borderRadius: 55, opacity: ramp(t, 1.1, 1.4) }}>
        <Logo name="claude" size={64} />
        <span style={{ fontSize: 38 }}>🔎</span>
        <span style={{ fontFamily: fonts.semibold, fontSize: 36, color: P.text }}>{typed(q, t, 1.4, 30)}</span>
      </Card>
      <Card style={{ position: "absolute", left: 60, top: -60, width: 960, padding: "10px 36px", boxSizing: "border-box", opacity: ramp(t, 4.4, 4.7) }}>
        <div style={{ display: "flex", height: 84, alignItems: "center", fontFamily: fonts.bold, fontSize: 28, color: P.dim, borderBottom: `2px solid ${P.line}` }}>
          <span style={{ flex: 1.3 }}>Firma (aktuelle Anzeige)</span><span style={{ flex: 1, opacity: ramp(t, 5.4, 5.6) }}>Ansprechpartner</span>
        </div>
        {rows.map(([f, a], i) => {
          const k = ramp(t, 4.6 + i * 0.15, 4.8 + i * 0.15);
          const c = ramp(t, 5.5 + i * 0.2, 5.7 + i * 0.2);
          return (
            <div key={f} style={{ display: "flex", height: 92, alignItems: "center", fontFamily: fonts.semibold, fontSize: 32, color: P.text, borderBottom: `2px solid ${P.line}`, opacity: k, transform: `translateX(${(1 - k) * 40}px)` }}>
              <span style={{ flex: 1.3 }}>{f}</span><span style={{ flex: 1, color: a === "—" ? P.dim : P.green, opacity: c }}>{a}</span>
            </div>
          );
        })}
        <div style={{ height: 70, display: "flex", alignItems: "center", fontFamily: fonts.semibold, fontSize: 28, color: P.dim, opacity: ramp(t, 5.4, 5.7) }}>… 5 weitere · Beispiel</div>
      </Card>
      <Stamp text="10 FIRMEN" t={t} at={4.7} x={620} y={-110} size={44} rot={-6} color={P.green} />
      <Fly t={t} at={6.7} from="bottom" style={{ left: 60, top: 640 }}>
        <Card style={{ height: 80, padding: "0 28px", display: "flex", alignItems: "center", gap: 14, borderRadius: 40 }}>
          <span style={{ fontSize: 32 }}>📄</span><span style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.text }}>Kontakt nur, wenn er in der Anzeige steht</span>
        </Card>
      </Fly>
      <Walker t={t} size={110} prop={PropLens} keys={[{ t: 0, x: 980, y: 1100 }, { t: 4.5, x: 980, y: 1100 }, { t: 4.7, x: 980, y: 1100, hop: 80 }, { t: 6.7, x: 980, y: 1100, hop: 60 }]} />
    </PanelSplit>
  );
};

/** 4 · Full: DER TRICK + short message instead of CV (21.66-29.5). Beats: Trick 0.56, Nachricht 2.99, Lebenslauf 3.64, ich kann 4.79, einstellen 7.2. */
export const KsTrick: React.FC<KsProps> = ({ avatar }) => {
  const t = useSec();
  const msg = "Hallo Frau K., ich kann das ab nächster Woche übernehmen, ohne dass ihr jemanden einstellen müsst.";
  const cv = ramp(t, 3.4, 3.7);
  const strike = ramp(t, 3.9, 4.3);
  return (
    <PanelSplit avatar={avatar} full>
      <Slam text="TRICK" accent="DER" t={t} at={0.5} y={-260} size={170} />
      <Card style={{ position: "absolute", left: 700, top: -60, width: 300, height: 210, padding: "22px 24px", boxSizing: "border-box", opacity: cv * (1 - ramp(t, 4.6, 4.9)), transform: "rotate(4deg)" }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 28, color: P.text }}>📄 Lebenslauf</div>
        {[220, 180, 240].map((w, i) => <div key={i} style={{ width: w, height: 10, borderRadius: 5, background: "#E6E3DC", marginTop: 18 }} />)}
        <div style={{ position: "absolute", left: 10, top: 100, width: 280 * strike, height: 10, background: P.red, borderRadius: 5, transform: "rotate(-20deg)" }} />
      </Card>
      <Card style={{ position: "absolute", left: 60, top: -60, width: 620, padding: "28px 32px", boxSizing: "border-box", opacity: ramp(t, 2.9, 3.2), transform: `scale(${0.95 + 0.05 * ramp(t, 2.9, 3.2)})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Logo name="gmail" size={56} /><span style={{ fontFamily: fonts.bold, fontSize: 30, color: P.text }}>Kurze Nachricht</span></div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 36, lineHeight: 1.3, color: P.text, marginTop: 22, minHeight: 280 }}>{typed(msg, t, 4.7, 42)}</div>
      </Card>
      <Stamp text="KEIN LEBENSLAUF" t={t} at={3.9} x={600} y={250} size={36} rot={-6} />
      <Fly t={t} at={7.1} from="bottom" style={{ left: 60, top: 560 }}>
        <Card style={{ height: 86, padding: "0 30px", display: "flex", alignItems: "center", gap: 14, borderRadius: 43 }}>
          <span style={{ width: 40, height: 40, borderRadius: 20, background: P.green, color: "#FFF", fontFamily: fonts.bold, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
          <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: P.text }}>keine Einstellung nötig</span>
        </Card>
      </Fly>
      <Walker t={t} size={110} prop={PropClipboard} keys={[{ t: 0, x: 1150, y: 860 }, { t: 0.5, x: 540, y: 860 }, { t: 0.7, x: 540, y: 860, hop: 90 }, { t: 7.1, x: 540, y: 860 }, { t: 7.3, x: 540, y: 860, hop: 80 }]} />
    </PanelSplit>
  );
};

/** 5 · Send instead of waiting (29.62-31.6). Beats: schickst 0.06, Anfragen 1.06, warten 1.6. */
export const KsSenden: React.FC<KsProps> = ({ avatar }) => {
  const t = useSec();
  const click = t > 0.35;
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 60, transform: `scale(${popAt(t, 0.05)})`, transformOrigin: "left top" }}>
        <div style={{ height: 120, padding: "0 50px", borderRadius: 60, background: click ? P.green : P.orange, display: "flex", alignItems: "center", gap: 18, fontFamily: fonts.bold, fontSize: 52, color: "#FFF", transform: `scale(${t > 0.3 && t < 0.5 ? 0.92 : 1})` }}>{click ? "10× gesendet ✓" : "Senden"}</div>
      </div>
      {Array.from({ length: 10 }).map((_, i) => {
        const k = ramp(t, 0.4 + i * 0.06, 1.0 + i * 0.06);
        return <div key={i} style={{ position: "absolute", left: 120 + k * (500 + i * 40), top: 330 - k * (180 - i * 22), opacity: k > 0 && k < 1 ? 1 : 0 }}><Logo name="gmail" size={56} /></div>;
      })}
      <div style={{ position: "absolute", left: 60, top: 460, display: "flex", alignItems: "center", gap: 20, opacity: ramp(t, 1.0, 1.2) }}>
        <span style={{ fontFamily: fonts.semibold, fontSize: 40, color: P.dim, textDecoration: ramp(t, 1.5, 1.6) > 0.5 ? "line-through" : "none" }}>⏳ auf Anfragen warten</span>
      </div>
      <Walker t={t} size={96} prop={PropMegaphone} keys={[{ t: 0, x: 900, y: G - 20 }, { t: 0.35, x: 900, y: G - 20, hop: 80 }, { t: 1.5, x: 900, y: G - 20 }, { t: 1.7, x: 900, y: G - 20, hop: 50 }]} />
    </PanelSplit>
  );
};

/** 6 · CTA (31.74-37.0). Beats: Nachricht 0.14, Vorlagen 1.27, Kommentiere 3.32, Kunden 3.96, folg 4.54. */
export const KsCta: React.FC<KsProps> = ({ avatar }) => {
  const t = useSec();
  const word = "KUNDEN";
  const n = Math.max(0, Math.min(word.length, Math.floor((t - 3.9) / 0.07)));
  const followed = t > 4.65;
  return (
    <PanelSplit avatar={avatar}>
      <Card style={{ position: "absolute", left: 60, top: 110, width: 960, height: 420, padding: 36, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Logo name="instagram" size={66} />
          <span style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text, flex: 1 }}>florent_preusser</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#FFF", background: followed ? "#BDBDBD" : P.orange, borderRadius: 16, padding: "12px 30px", transform: `scale(${t > 4.55 && t < 4.8 ? 1.12 : 1})` }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
        </div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim, marginTop: 44 }}>Kommentare</div>
        <div style={{ marginTop: 18, height: 96, borderRadius: 48, border: `2px solid ${P.line}`, display: "flex", alignItems: "center", padding: "0 36px", fontFamily: fonts.bold, fontSize: 46, color: P.text }}>
          {word.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0, color: P.orange }}>|</span>
        </div>
      </Card>
      <Fly t={t} at={0.2} from="bottom" style={{ left: 60, top: 572 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><PdfBadge size={60} /><span style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.text }}>Guide: Nachricht an Claude + 3 Vorlagen</span></div>
      </Fly>
      <Walker t={t} size={100} arms="point" keys={[{ t: 0.2, x: 1150, y: G - 20 }, { t: 1.0, x: 900, y: G - 20 }, { t: 4.35, x: 900, y: G - 20 }, { t: 4.6, x: 900, y: 120, hop: 80 }, { t: 4.8, x: 900, y: 150 }, { t: 5.0, x: 960, y: G - 20, hop: 40 }]} />
    </PanelSplit>
  );
};
