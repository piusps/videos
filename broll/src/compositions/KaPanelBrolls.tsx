import React from "react";
import { fonts } from "../theme";
import { AvatarSrc, Crowd, Fly, Logo, P, PanelSplit, PdfBadge, PropClipboard, PropLens, PropMegaphone, Rail, Receipt, Slam, Stamp, Walker, popAt, ramp, useSec } from "../components/PanelKit";

// FP-N "Kontoauszug: vergessene Betriebsausgaben" (runs/fpn-kontoauszug, 2026-10-08), PanelKit style 1:1 after JaPanelBrolls.
// Times are seconds from each window start (captions.json). All bookings, names and amounts are invented examples.

export type KaProps = { seconds?: number; avatar: AvatarSrc };
const G = 690;

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: P.card, borderRadius: 26, border: `2px solid ${P.line}`, boxShadow: "0 18px 44px rgba(0,0,0,0.08)", ...style }}>{children}</div>
);
const Check: React.FC<{ on: boolean; size?: number }> = ({ on, size = 44 }) => (
  <span style={{ width: size, height: size, borderRadius: size / 2, background: on ? P.green : P.line, color: "#FFF", fontFamily: fonts.bold, fontSize: size * 0.55, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</span>
);

/** 0 · Hook (0-3.40). Beats: Claude 0.11, Kontoauszug 1.12, absetzen 2.76. Statement scrolls, a lens finds lines. */
export const KaHook: React.FC<KaProps> = ({ avatar }) => {
  const t = useSec();
  const rows: [string, string, boolean][] = [["REWE Markt", "-42,18 €", false], ["Adobe Creative Cloud", "-66,45 €", true], ["Netflix", "-13,99 €", false], ["Restaurant Lindenhof", "-87,40 €", true], ["Amazon Ladekabel", "-19,99 €", true], ["Miete Wohnung", "-1.150,00 €", false]];
  const scroll = ramp(t, 0.2, 2.6) * 120;
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", inset: 0, background: "#F3EFE6" }} />
      <div style={{ position: "absolute", left: 60, top: 54, fontFamily: fonts.bold, fontSize: 22, letterSpacing: 5, color: "#B4673C" }}>SUPERKIND · MITTELSTAND</div>
      <div style={{ position: "absolute", left: 60, top: 100, width: 480, fontFamily: "Georgia, serif", fontSize: 66, lineHeight: 1.05, color: "#1A1410" }}>Vergessene<br />Ausgaben =<br /><span style={{ fontStyle: "italic", color: "#E24E17", whiteSpace: "nowrap" }}>zu viel Steuer.</span></div>
      <Fly t={t} at={-0.4} from="right" style={{ left: 560, top: 110 }}>
        <Card style={{ width: 470, height: 540, padding: "22px 24px", boxSizing: "border-box", overflow: "hidden", transform: "rotate(2deg)" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 18, letterSpacing: 3, color: P.dim }}>KONTOAUSZUG · UMSÄTZE</div>
          <div style={{ marginTop: 14, height: 460, overflow: "hidden" }}><div style={{ marginTop: -scroll * 0.4 }}>
            {rows.concat(rows.slice(0, 2)).map(([n, v, hit], i) => {
              const on = hit && t > 1.1 + i * 0.35;
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 72, borderBottom: `2px solid ${P.line}`, fontFamily: fonts.semibold, fontSize: 25, color: P.text, background: on ? "rgba(255,107,53,0.12)" : "transparent", padding: "0 8px" }}>
                  <span style={{ whiteSpace: "nowrap" }}>{n}</span><span style={{ color: on ? P.orange : P.text }}>{v}</span>
                </div>
              );
            })}
          </div></div>
        </Card>
      </Fly>
      <div style={{ position: "absolute", left: 60, top: 430, display: "flex", alignItems: "center", gap: 16, transform: `scale(${popAt(t, -0.4)})`, transformOrigin: "0 50%" }}>
        <Logo name="claude" size={84} />
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: P.text }}>findet es</span>
      </div>
      <Stamp text="ABSETZBAR?" t={t} at={2.75} x={60} y={560} size={40} color={P.orange} rot={-6} />
      <Walker t={t} size={100} prop={PropLens} enter={-0.4} keys={[{ t: 0, x: 980, y: G - 30 }, { t: 1.1, x: 980, y: G - 30 }, { t: 1.5, x: 470, y: 330, hop: 60 }, { t: 2.3, x: 470, y: 470 }, { t: 2.8, x: 470, y: 470, hop: 50 }]} />
    </PanelSplit>
  );
};

/** 1 · Steuerberater bucht nur, was du ihm gibst (3.44-6.25). Beats: Steuerberater 0.48, bucht 1.28, gibst 2.34. */
export const KaBerater: React.FC<KaProps> = ({ avatar }) => {
  const t = useSec();
  const bel = [0, 1, 2, 3, 4, 5];
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 50, fontFamily: fonts.bold, fontSize: 52, color: P.text, opacity: ramp(t, 0, 0.2) }}>Dein Steuerberater bucht</div>
      <Fly t={t} at={-0.2} from="right" style={{ left: 640, top: 180 }}>
        <Card style={{ width: 380, height: 380, padding: 28, boxSizing: "border-box" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 30, color: P.text }}>📒 Buchhaltung</div>
          {[0, 1, 2].map((i) => {
            const k = ramp(t, 1.3 + i * 0.3, 1.5 + i * 0.3);
            return <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26, opacity: k }}><Check on={k > 0.9} size={36} /><div style={{ width: 220, height: 14, borderRadius: 7, background: "#DDDAD3" }} /></div>;
          })}
        </Card>
      </Fly>
      {bel.map((i) => {
        const sent = i < 3;
        const a = -0.3 + i * 0.05;
        const k = popAt(t, a, 0.25);
        const go = sent ? ramp(t, 1.3 + i * 0.3, 1.6 + i * 0.3) : 0;
        const x0 = 70 + (i % 3) * 170;
        const y0 = 190 + Math.floor(i / 3) * 230;
        return (
          <div key={i} style={{ position: "absolute", left: x0 + (720 - x0) * go, top: y0 + (300 - y0) * go, opacity: Math.min(1, k) * (1 - go), transform: `scale(${Math.min(1, k) * (1 - 0.5 * go)})` }}>
            <Receipt w={110} rot={((i * 37) % 16) - 8} missing={!sent && t > 2.3} />
          </div>
        );
      })}
      <Fly t={t} at={2.3} from="bottom" style={{ left: 60, top: 640 }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, color: P.red }}>Nicht abgegeben = nicht gebucht</div>
      </Fly>
      <Walker t={t} size={90} prop={PropClipboard} keys={[{ t: 0, x: 1150, y: G - 30 }, { t: 0.9, x: 1000, y: G - 30 }, { t: 2.3, x: 1000, y: G - 30 }, { t: 2.5, x: 1000, y: G - 30, hop: 60 }]} mood={t > 2.4 ? "shock" : "happy"} />
    </PanelSplit>
  );
};

/** 2 · Full: privately paid items (6.32-11.40). Beats: privat 0.76, Softwareabo 1.95, Geschäftsessen 2.85, Ladekabel 4.0, fehlt 4.81. */
export const KaPrivat: React.FC<KaProps> = ({ avatar }) => {
  const t = useSec();
  const items: [string, string, string, number][] = [["💻", "Softwareabo", "-29,99 €", 1.9], ["🍽", "Geschäftsessen", "-87,40 €", 2.8], ["🔌", "Ladekabel", "-19,99 €", 3.95]];
  return (
    <PanelSplit avatar={avatar} full>
      <div style={{ position: "absolute", left: 60, top: -270, display: "flex", alignItems: "center", gap: 20, transform: `scale(${popAt(t, -0.3)})`, transformOrigin: "0 50%" }}>
        <div style={{ width: 150, height: 96, borderRadius: 16, background: "linear-gradient(135deg,#3A3A3A,#111)", boxShadow: "0 12px 30px rgba(0,0,0,0.25)", position: "relative" }}>
          <div style={{ position: "absolute", left: 16, top: 26, width: 30, height: 22, borderRadius: 4, background: "#D9B45A" }} />
          <div style={{ position: "absolute", left: 16, bottom: 14, fontFamily: fonts.semibold, fontSize: 14, color: "#DDD", letterSpacing: 2 }}>PRIVAT</div>
        </div>
        <span style={{ fontFamily: fonts.bold, fontSize: 64, color: P.text }}>privat bezahlt</span>
      </div>
      {items.map(([ic, n, v, at], i) => (
        <Fly key={n} t={t} at={at} from={i % 2 ? "left" : "right"} style={{ left: 60, top: -110 + i * 250 }}>
          <Card style={{ width: 960, height: 210, padding: "0 44px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 30 }}>
            <span style={{ fontSize: 90 }}>{ic}</span>
            <span style={{ flex: 1, fontFamily: fonts.bold, fontSize: 60, color: P.text, whiteSpace: "nowrap" }}>{n}</span>
            <span style={{ fontFamily: fonts.bold, fontSize: 52, color: P.text, whiteSpace: "nowrap" }}>{v}</span>
          </Card>
        </Fly>
      ))}
      <Stamp text="FEHLT" t={t} at={4.8} x={700} y={50} size={42} rot={-8} />
      <Stamp text="FEHLT" t={t} at={4.9} x={720} y={300} size={42} rot={5} />
      <Stamp text="FEHLT" t={t} at={5.0} x={700} y={550} size={42} rot={-4} />
      <Fly t={t} at={4.85} from="bottom" style={{ left: 60, top: 680 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#FFF", border: `3px solid ${P.red}`, borderRadius: 24, padding: "18px 30px", fontFamily: fonts.bold, fontSize: 44, color: P.red }}>📒 nicht in der Buchhaltung</div>
      </Fly>
      <Walker t={t} size={110} mood={t > 4.8 ? "shock" : "happy"} keys={[{ t: 0, x: 120, y: 950 }, { t: 1.5, x: 300, y: 950 }, { t: 2.8, x: 600, y: 950 }, { t: 3.9, x: 880, y: 950 }, { t: 4.8, x: 880, y: 950 }, { t: 5.0, x: 880, y: 950, hop: 90 }]} />
    </PanelSplit>
  );
};

/** 3 · Steuern zu viel + SO HOLST DU ES DIR (11.44-14.75). Beats: Steuern 0.75, nicht zahlen 1.42, So holst 2.48. */
export const KaSteuer: React.FC<KaProps> = ({ avatar }) => {
  const t = useSec();
  const bar = 0.35 + 0.65 * ramp(t, 0.0, 1.2);
  const out = ramp(t, 2.35, 2.5);
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ opacity: 1 - out }}>
        <div style={{ position: "absolute", left: 60, top: 50, fontFamily: fonts.bold, fontSize: 52, color: P.text }}>Deine Steuer</div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 170 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 34, color: P.text }}><span>was du zahlen müsstest</span><span style={{ color: P.green }}>✓</span></div>
          <div style={{ marginTop: 12, height: 44, borderRadius: 22, background: P.line, overflow: "hidden" }}><div style={{ width: `${70 * bar}%`, height: "100%", background: P.green, borderRadius: 22 }} /></div>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 330, opacity: ramp(t, 1.3, 1.5) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 34, color: P.text }}><span>was du wirklich zahlst</span><span style={{ color: P.red }}>zu viel</span></div>
          <div style={{ marginTop: 12, height: 44, borderRadius: 22, background: P.line, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "70%", background: P.green }} />
            <div style={{ position: "absolute", left: "70%", top: 0, bottom: 0, width: `${22 * ramp(t, 1.4, 2.0)}%`, background: P.red }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 60, top: 470, fontFamily: fonts.medium, fontSize: 24, color: P.dim }}>Schema</div>
        <Crowd t={t} at={1.5} cols={5} rows={1} x={620} y={600} gap={70} size={50} step={0.06} mood="shock" />
      </div>
      <Slam text="HOLST DU ES DIR" accent="SO" t={t} at={2.45} y={300} size={104} />
      {t > 2.38 ? <Walker t={t} size={100} arms="point" prop={PropMegaphone} enter={2.4} keys={[{ t: 2.4, x: 540, y: G - 40 }, { t: 2.6, x: 540, y: G - 40, hop: 80 }, { t: 3.0, x: 540, y: G - 40 }, { t: 3.2, x: 540, y: G - 40, hop: 50 }]} /> : null}
    </PanelSplit>
  );
};

/** 4 · Schritt 1: CSV → Claude, whole year (14.80-18.85). Beats: Schritt 0, Kontoauszug 1.22, Datei 2.06, Claude 2.56, ganze Jahr 3.59. */
export const KaUpload: React.FC<KaProps> = ({ avatar }) => {
  const t = useSec();
  const fly = ramp(t, 2.0, 2.6);
  const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  return (
    <PanelSplit avatar={avatar}>
      <Rail active={1} t={t} y={34} />
      <div style={{ position: "absolute", left: 60 + 560 * fly, top: 170 - 10 * Math.sin(Math.PI * fly) * 8, transform: `scale(${popAt(t, 1.1) * (1 - 0.35 * fly)}) rotate(${-4 + 4 * fly}deg)`, opacity: 1 - ramp(t, 2.55, 2.7) }}>
        <Card style={{ width: 300, height: 220, padding: 26, boxSizing: "border-box" }}>
          <div style={{ width: 90, height: 90, borderRadius: 16, background: "#1F9D55", color: "#FFF", fontFamily: fonts.bold, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>CSV</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.text, marginTop: 18 }}>kontoauszug.csv</div>
        </Card>
      </div>
      <Card style={{ position: "absolute", left: 560, top: 160, width: 460, height: 250, padding: 28, boxSizing: "border-box", border: `3px solid ${t > 2.5 ? P.orange : P.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Logo name="claude" size={60} /><span style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text }}>Claude</span></div>
        <div style={{ marginTop: 22, height: 80, borderRadius: 20, background: "#F5F5F5", display: "flex", alignItems: "center", padding: "0 20px", gap: 14, fontFamily: fonts.semibold, fontSize: 26, color: P.dim }}>
          <span style={{ fontSize: 36, color: P.text }}>+</span>{t > 2.6 ? <span style={{ color: P.text }}>📎 kontoauszug.csv</span> : "Datei hochladen"}
        </div>
      </Card>
      <div style={{ position: "absolute", left: 60, right: 60, top: 470, display: "flex", gap: 10, opacity: ramp(t, 3.3, 3.45) }}>
        {months.map((m, i) => {
          const on = t > 3.45 + i * 0.04;
          return <div key={m} style={{ flex: 1, height: 84, borderRadius: 16, background: on ? P.orange : P.card, border: `2px solid ${on ? P.orange : P.line}`, color: on ? "#FFF" : P.dim, fontFamily: fonts.bold, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{m}</div>;
        })}
      </div>
      <Fly t={t} at={3.6} from="bottom" style={{ left: 60, top: 590 }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: P.text }}>am besten das <span style={{ color: P.orange }}>ganze Jahr</span></span>
      </Fly>
      <Walker t={t} size={90} keys={[{ t: 0, x: 1150, y: G - 20 }, { t: 1.0, x: 980, y: G - 20 }, { t: 2.5, x: 980, y: G - 20 }, { t: 2.7, x: 980, y: G - 20, hop: 70 }, { t: 3.5, x: 980, y: G - 20 }, { t: 3.7, x: 980, y: G - 20, hop: 60 }]} arms="up" />
    </PanelSplit>
  );
};

/** 5 · Full: Schritt 2, Beruf + marked bookings (18.88-25.85). Beats: Schritt 0, schreib 0.78, beruflich 1.62, Claude 2.56, Buchung 3.18, markiert 3.91, Betriebsausgabe 4.77, Begründung 6.48. */
export const KaMarkiert: React.FC<KaProps> = ({ avatar }) => {
  const t = useSec();
  const rows: [string, string, string | null][] = [["Adobe Creative Cloud", "-66,45 €", "Design-Software für Kundenaufträge"], ["REWE Markt", "-42,18 €", null], ["Restaurant Lindenhof", "-87,40 €", "Essen mit Kunde? Bewirtung"], ["Thalia Fachbuch", "-34,00 €", "Fachliteratur"], ["Netflix", "-13,99 €", null], ["Amazon Ladekabel", "-19,99 €", "Arbeitsmittel fürs Firmenhandy"]];
  const typed = "Ich bin Grafikdesignerin, selbstständig.";
  const n = Math.max(0, Math.min(typed.length, Math.floor((t - 0.8) / 0.03)));
  return (
    <PanelSplit avatar={avatar} full>
      <Rail active={2} t={t} y={-330} />
      <Card style={{ position: "absolute", left: 60, top: -200, width: 960, height: 100, padding: "0 30px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: P.dim }}>Beruf:</span>
        <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: P.text }}>{typed.slice(0, n)}<span style={{ color: P.orange, opacity: Math.floor(t * 3) % 2 ? 1 : 0 }}>|</span></span>
      </Card>
      <Card style={{ position: "absolute", left: 60, top: -70, width: 960, padding: "6px 30px", boxSizing: "border-box", opacity: ramp(t, 2.5, 2.7) }}>
        {rows.map(([name, v, why], i) => {
          const scan = 3.1 + i * 0.35;
          const a = ramp(t, 2.6 + i * 0.08, 2.8 + i * 0.08);
          const hit = why && t > scan;
          const reason = why && t > 4.8 + i * 0.25;
          return (
            <div key={name} style={{ padding: "14px 10px", borderBottom: i < rows.length - 1 ? `2px solid ${P.line}` : "none", opacity: a * (why || t < scan ? 1 : 0.4), background: hit ? "rgba(255,107,53,0.10)" : "transparent", borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: hit ? P.orange : P.line }} />
                <span style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 34, color: P.text }}>{name}</span>
                <span style={{ fontFamily: fonts.bold, fontSize: 30, color: hit ? P.orange : P.text }}>{v}</span>
              </div>
              {reason ? <div style={{ marginLeft: 36, marginTop: 6, fontFamily: fonts.medium, fontSize: 26, color: P.dim, opacity: ramp(t, 4.8 + i * 0.25, 5.0 + i * 0.25) }}>→ {why}</div> : null}
            </div>
          );
        })}
      </Card>
      {t > 3.0 && t < 5.2 ? <div style={{ position: "absolute", left: 70, width: 940, top: -60 + ((t - 3.0) / 2.2) * 560, height: 6, borderRadius: 3, background: P.orange, boxShadow: "0 0 24px rgba(255,107,53,0.8)" }} /> : null}
      <Stamp text="BETRIEBSAUSGABE?" t={t} at={4.75} x={520} y={-150} size={34} color={P.orange} rot={-5} />
      <Fly t={t} at={6.4} from="bottom" style={{ left: 60, top: 760 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: P.orange, borderRadius: 24, padding: "14px 26px", fontFamily: fonts.bold, fontSize: 36, color: "#FFF" }}>✓ jede mit Begründung</div>
      </Fly>
      {t > 2.58 ? <Walker t={t} size={100} prop={PropLens} mood="happy" arms="point" enter={2.6}
        keys={[{ t: 2.6, x: 1000, y: 930 }, { t: 3.1, x: 1000, y: 930 }, { t: 3.4, x: 1000, y: 930, hop: 60 }, { t: 4.1, x: 1000, y: 930, hop: 60 }, { t: 4.8, x: 1000, y: 930, hop: 60 }, { t: 6.5, x: 1000, y: 930 }, { t: 6.7, x: 1000, y: 930, hop: 70 }]} /> : null}
    </PanelSplit>
  );
};

/** 6 · Full: DER TRICK + Schritt 3 list for the Steuerberater (25.88-29.60). Beats: Trick 0.55, Schritt 0.84, Liste 2.36, Steuerberater 2.96. */
export const KaListe: React.FC<KaProps> = ({ avatar }) => {
  const t = useSec();
  const cats: [string, string, number][] = [["Software", "4 Buchungen", 1.9], ["Bewirtung", "3 Buchungen", 2.2], ["Arbeitsmittel", "5 Buchungen", 2.5], ["Rückfragen", "2 Buchungen", 2.8]];
  const card = ramp(t, 1.5, 1.8);
  return (
    <PanelSplit avatar={avatar} full>
      <Slam text="TRICK" accent="DER" t={t} at={-0.2} y={-300} size={150} />
      <Rail active={3} t={t} at={0.85} y={-130} />
      <Card style={{ position: "absolute", left: 60, top: 0, width: 960, padding: "28px 36px", boxSizing: "border-box", opacity: card, transform: `scale(${0.95 + 0.05 * card})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <Logo name="googlesheets" size={60} />
          <span style={{ fontFamily: fonts.bold, fontSize: 38, color: P.text }}>Liste für deinen Steuerberater</span>
        </div>
        {cats.map(([h, d, at]) => {
          const k = ramp(t, at, at + 0.25);
          return (
            <div key={h} style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 0", borderTop: `2px solid ${P.line}`, opacity: k, transform: `translateX(${(1 - k) * 40}px)` }}>
              <span style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 36, color: P.text }}>{h}</span>
              <span style={{ fontFamily: fonts.medium, fontSize: 28, color: P.dim }}>{d}</span>
              <Check on={k > 0.95} />
            </div>
          );
        })}
      </Card>
      <Fly t={t} at={2.95} from="bottom" style={{ left: 60, top: 640 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><PdfBadge size={64} /><span style={{ fontFamily: fonts.bold, fontSize: 36, color: P.text }}>→ an den Steuerberater</span></div>
      </Fly>
      <Walker t={t} size={110} prop={PropClipboard} enter={-0.4} keys={[{ t: 0, x: 900, y: 860 }, { t: 0.4, x: 540, y: 860 }, { t: 0.65, x: 540, y: 860, hop: 90 }, { t: 2.9, x: 540, y: 860 }, { t: 3.4, x: 900, y: 860, hop: 60 }]} />
    </PanelSplit>
  );
};

/** 7 · Er entscheidet, die Suche ist erledigt (29.63-31.80). Beats: entscheidet 0.01, Suche 0.82, abgenommen 1.59. */
export const KaEntscheidet: React.FC<KaProps> = ({ avatar }) => {
  const t = useSec();
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 60, fontFamily: fonts.semibold, fontSize: 40, color: P.dim }}>Dein Steuerberater</div>
      <div style={{ position: "absolute", left: 60, top: 120, fontFamily: fonts.bold, fontSize: 130, color: P.text, letterSpacing: -4, transform: `scale(${popAt(t, 0.05)})`, transformOrigin: "0 50%" }}>entscheidet</div>
      <Fly t={t} at={0.8} from="right" style={{ left: 60, top: 340 }}>
        <Card style={{ width: 960, height: 120, padding: "0 36px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 50 }}>🔎</span>
          <span style={{ flex: 1, fontFamily: fonts.bold, fontSize: 44, color: P.text }}>Die Suche</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 40, color: P.green, opacity: ramp(t, 1.5, 1.7) }}>erledigt</span>
          <Check on={t > 1.6} size={56} />
        </Card>
      </Fly>
      <Stamp text="ABGENOMMEN" t={t} at={1.6} x={520} y={500} size={40} color={P.green} rot={-6} />
      <Walker t={t} size={100} arms="up" mood="proud" keys={[{ t: 0, x: -80, y: G - 20 }, { t: 0.8, x: 220, y: G - 20 }, { t: 1.55, x: 220, y: G - 20 }, { t: 1.75, x: 220, y: G - 20, hop: 80 }]} />
    </PanelSplit>
  );
};

/** 8 · CTA (31.84-38.28). Beats: Nachricht 0.41, Checkliste 1.56, zwanzig 2.21, Guide 4.23, Kommentiere 4.64, Absetzen 5.18, folg 5.84. */
export const KaCta: React.FC<KaProps> = ({ avatar }) => {
  const t = useSec();
  const word = "ABSETZEN";
  const n = Math.max(0, Math.min(word.length, Math.floor((t - 5.1) / 0.06)));
  const followed = t > 5.95;
  const guide = 1 - ramp(t, 4.4, 4.6);
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ opacity: guide }}>
        <Fly t={t} at={0.35} from="left" style={{ left: 60, top: 70 }}>
          <Card style={{ width: 460, height: 560, padding: 30, boxSizing: "border-box", transform: "rotate(-2deg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}><PdfBadge size={60} /><span style={{ fontFamily: fonts.bold, fontSize: 32, color: P.text }}>Guide</span></div>
            <div style={{ marginTop: 24, fontFamily: fonts.semibold, fontSize: 26, color: P.dim }}>Nachricht an Claude</div>
            <div style={{ marginTop: 10, borderRadius: 14, background: "#FFF3EC", padding: 16 }}>{[300, 340, 260].map((w, i) => <div key={i} style={{ width: w, height: 10, borderRadius: 5, background: "#F2B79C", marginTop: i ? 12 : 0 }} />)}</div>
            <div style={{ marginTop: 24, fontFamily: fonts.semibold, fontSize: 26, color: P.dim }}>Checkliste</div>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}><Check on={t > 1.7 + i * 0.2} size={30} /><div style={{ width: 250, height: 10, borderRadius: 5, background: "#DDDAD3" }} /></div>)}
          </Card>
        </Fly>
        <div style={{ position: "absolute", left: 580, top: 140, textAlign: "center", width: 440, transform: `scale(${popAt(t, 2.2)})` }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 220, color: P.orange, lineHeight: 1, letterSpacing: -8 }}>20</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 40, color: P.text, marginTop: 10 }}>oft vergessene Ausgaben</div>
        </div>
      </div>
      <div style={{ opacity: ramp(t, 4.45, 4.65) }}>
        <Card style={{ position: "absolute", left: 60, top: 110, width: 960, height: 420, padding: 36, boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Logo name="instagram" size={66} />
            <span style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text, flex: 1 }}>florent_preusser</span>
            <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#FFF", background: followed ? "#BDBDBD" : P.orange, borderRadius: 16, padding: "12px 30px", transform: `scale(${t > 5.85 && t < 6.1 ? 1.12 : 1})` }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
          </div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim, marginTop: 44 }}>Kommentare</div>
          <div style={{ marginTop: 18, height: 96, borderRadius: 48, border: `2px solid ${P.line}`, display: "flex", alignItems: "center", padding: "0 36px", fontFamily: fonts.bold, fontSize: 46, color: P.text }}>
            {word.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0, color: P.orange }}>|</span>
          </div>
        </Card>
      </div>
      <Walker t={t} size={100} arms="point" keys={[{ t: 0.2, x: 1150, y: G - 20 }, { t: 1.2, x: 960, y: G - 20 }, { t: 2.2, x: 960, y: G - 20, hop: 70 }, { t: 5.6, x: 900, y: G - 20 }, { t: 5.9, x: 900, y: 120, hop: 80 }, { t: 6.1, x: 900, y: 150 }, { t: 6.35, x: 960, y: G - 20, hop: 40 }]} />
    </PanelSplit>
  );
};
