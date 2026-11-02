import React from "react";
import { fonts } from "../theme";
import { AvatarSrc, Count, Crowd, Fly, Logo, P, PanelSplit, PdfBadge, PropCap, PropClipboard, PropLens, PropMegaphone, PropStamp, Rail, Receipt, Slam, Smiley, Stamp, Walker, popAt, ramp, serif, serifItalic, useSec } from "../components/PanelKit";

// Betriebsprüfung, PanelKit cut v4 (opusjake pass: grid, a new picture ~every second, props per beat,
// full-panel windows 4/5/7 without the speaker, crowds for quantities). Was v3 (2026-10-06, Pius: smiley needs a job, real logos, clean layout, constant motion).
// Panel grid: 1080×768, side margin 60, rail row y 34-126, content y 160-640, ground line y 690 where the
// smiley walks. Times are seconds from each window's start (runs/fpn-betriebspruefung/captions.json).
// All figures and accounts are invented examples.

export type BpPProps = { seconds?: number; avatar: AvatarSrc };
const GROUND = 690;

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: P.card, borderRadius: 26, border: `2px solid ${P.line}`, boxShadow: "0 18px 44px rgba(0,0,0,0.08)", ...style }}>{children}</div>
);

const Row: React.FC<{ icon: React.ReactNode; title: string; sub?: string; right?: React.ReactNode; size?: number }> = ({ icon, title, sub, right, size = 36 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    {icon}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: fonts.semibold, fontSize: size, color: P.text, whiteSpace: "nowrap" }}>{title}</div>
      {sub ? <div style={{ fontFamily: fonts.medium, fontSize: size * 0.7, color: P.dim, marginTop: 2 }}>{sub}</div> : null}
    </div>
    {right}
  </div>
);

const Folder: React.FC<{ label: string; color: string; w?: number }> = ({ label, color, w = 200 }) => (
  <div style={{ position: "relative", width: w, height: w * 0.72 }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: w * 0.42, height: w * 0.16, borderRadius: `${w * 0.05}px ${w * 0.05}px 0 0`, background: color, filter: "brightness(0.85)" }} />
    <div style={{ position: "absolute", left: 0, top: w * 0.1, width: w, height: w * 0.62, borderRadius: w * 0.06, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: w * 0.17, color: "#FFF", boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}>{label}</div>
  </div>
);

const Lens = PropLens;

// 0 · Cover: magazine headline left, folder stack right; the smiley walks in and hops onto the stack with a lens.
export const BpP0Cover: React.FC<BpPProps> = ({ avatar }) => {
  const t = useSec();
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", inset: 0, background: "#F3EFE6" }} />
      <div style={{ position: "absolute", left: 60, top: 54, fontFamily: fonts.bold, fontSize: 22, letterSpacing: 5, color: "#B4673C" }}>SUPERKIND · MITTELSTAND</div>
      <div style={{ position: "absolute", left: 60, top: 96, width: 560, fontFamily: serif, fontSize: 80, lineHeight: 1.0, color: "#1A1410", letterSpacing: -2 }}>
        Betriebsprüfung? <span style={{ fontFamily: serifItalic, color: "#E24E17" }}>In einer Stunde</span> vorbereitet.
      </div>
      <div style={{ position: "absolute", left: 60, top: 470, width: 520, fontFamily: fonts.medium, fontSize: 27, color: "#5C5048", lineHeight: 1.35, opacity: 1 - ramp(t, 0.95, 1.1) }}>Was der Prüfer sehen will, welche Belege fehlen, welche Fragen kommen.</div>
      <Fly t={t} at={1.0} from="left" style={{ left: 60, top: 452 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#FFF", borderRadius: 18, padding: "14px 22px", boxShadow: "0 12px 30px rgba(0,0,0,0.12)", transform: "rotate(-2deg)" }}>
          <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: P.dim }}>Rechnung Steuerberater</span>
          <Count from={0} to={2000} t={t} a={1.05} b={1.7} suffix=" €" style={{ fontFamily: fonts.bold, fontSize: 44, color: P.red }} />
        </div>
      </Fly>
      <div style={{ position: "absolute", left: 60, top: 590, transform: "rotate(-5deg)", border: "6px solid #E24E17", color: "#E24E17", borderRadius: 14, padding: "4px 20px", fontFamily: fonts.bold, fontSize: 38, letterSpacing: 4 }}>PRÜFUNG</div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", left: 700 + (i % 2) * 22, top: 520 - i * 104, transform: `rotate(${(i % 2 ? 3 : -3) + Math.sin(t * 2.5 + i) * 1.2}deg)` }}>
          <Folder label={["2022", "2023", "2024", "USt"][i]} color={["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"][i]} w={220} />
        </div>
      ))}
      <Walker t={t} size={120} mood="proud" arms="point" prop={Lens} keys={[{ t: 0, x: 640, y: 640 }, { t: 0.5, x: 640, y: 640 }, { t: 0.95, x: 810, y: 150, hop: 120 }]} />
    </PanelSplit>
  );
};

// 1 · Result (beats: Claude 1.28, Unterlagen 1.8, Stunde 2.55, sortiert 2.82, So geht's 3.45): Claude tile pops,
// a pile of loose receipts flies in, snaps into four sorted rows, 1 Std. stamp, then SO GEHT'S slams over it.
export const BpP1Ergebnis: React.FC<BpPProps> = ({ avatar }) => {
  const t = useSec();
  const items: [React.ReactNode, string][] = [[<Logo name="datev" size={64} />, "Buchungen"], [<Logo name="googledrive" size={64} />, "Belege"], [<PdfBadge size={64} />, "Verträge"], [<Logo name="googlesheets" size={64} />, "Kasse"]];
  const sorted = ramp(t, 2.8, 3.1);
  const outro = ramp(t, 3.4, 3.55);
  return (
    <PanelSplit avatar={avatar}>
      {/* 0-1.25 s ("…vorzubereiten"): the 2.000 € invoice carries over from the cover and gets struck out */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", opacity: 1 - ramp(t, 1.15, 1.35), transform: `scale(${popAt(t, 0, 0.3)})` }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 38, color: P.dim }}>Steuerberater, nur Vorbereitung</div>
        <div style={{ position: "relative", display: "inline-block", fontFamily: fonts.bold, fontSize: 200, color: P.text, letterSpacing: -6 }}>
          2.000 €
          <div style={{ position: "absolute", left: -12, right: -12, top: "52%", height: 16, background: P.red, borderRadius: 8, transform: `scaleX(${ramp(t, 0.55, 0.8)}) rotate(-5deg)`, transformOrigin: "0 50%" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, top: 44, display: "flex", alignItems: "center", gap: 18, transform: `scale(${popAt(t, 1.25)})`, transformOrigin: "0 50%" }}>
        <Logo name="claude" size={92} />
        <span style={{ fontFamily: fonts.bold, fontSize: 54, color: P.text, letterSpacing: -1 }}>sortiert</span>
      </div>
      <div style={{ position: "absolute", right: 60, top: 40, fontFamily: fonts.bold, fontSize: 104, color: P.green, letterSpacing: -3, transform: `scale(${popAt(t, 2.5)})`, transformOrigin: "100% 50%" }}>1 Std.</div>
      {/* loose receipts: fly in on "Unterlagen", collapse into the card on "sortiert" */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = 1.75 + i * 0.05;
        const k = popAt(t, a, 0.25);
        const x = 120 + (i * 97) % 820;
        const y = 210 + ((i * 53) % 3) * 120;
        return (
          <div key={i} style={{ position: "absolute", left: x + (540 - x) * sorted, top: y + (380 - y) * sorted, opacity: Math.min(1, k) * (1 - sorted), transform: `scale(${Math.min(k, 1.1) * (1 - 0.6 * sorted)})` }}>
            <Receipt w={80} rot={((i * 37) % 30) - 15} />
          </div>
        );
      })}
      <Card style={{ position: "absolute", left: 180, top: 200, width: 720, height: 430, padding: "28px 36px", boxSizing: "border-box", opacity: sorted * (1 - outro * 0.75), transform: `scale(${0.9 + 0.1 * sorted})` }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text, marginBottom: 18 }}>Ordner Betriebsprüfung</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 34, columnGap: 30 }}>
          {items.map(([ic, l], i) => {
            const k = ramp(t, 2.85 + i * 0.1, 3.05 + i * 0.1);
            return (
              <div key={l} style={{ opacity: k, transform: `translateY(${(1 - k) * -30}px)` }}>
                <Row icon={ic} title={l} right={<span style={{ width: 40, height: 40, borderRadius: 20, background: k > 0.95 ? P.green : P.line, color: "#FFF", fontFamily: fonts.bold, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>} size={32} />
              </div>
            );
          })}
        </div>
      </Card>
      <Slam text="GEHT'S" accent="SO" t={t} at={3.45} y={330} size={150} />
      <Walker t={t} size={100} prop={PropClipboard} keys={[{ t: 1.6, x: 1000, y: GROUND - 20 }, { t: 2.0, x: 1000, y: GROUND - 20 }, { t: 2.85, x: 960, y: GROUND - 20, hop: 80 }, { t: 3.45, x: 960, y: GROUND - 20 }, { t: 3.6, x: 960, y: GROUND - 20, hop: 70 }]} arms="up" enter={1.6} />
    </PanelSplit>
  );
};

// 2 · Schritt 1: letter flies in, the smiley hops next to each fact as it appears.
export const BpP2Schritt1: React.FC<BpPProps> = ({ avatar }) => {
  const t = useSec();
  const facts: [React.ReactNode, string, string, number][] = [
    [<Logo name="googlecalendar" size={70} />, "Prüfungszeitraum", "2022 bis 2024", 3.5],
    [<div style={{ width: 70, height: 70, borderRadius: 17, background: "#FFF", border: `1.5px solid ${P.line}`, boxShadow: "0 6px 18px rgba(0,0,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 44, color: P.orange }}>§</div>, "Steuerarten", "USt · GewSt · KSt", 4.42],
    [<Logo name="googledrive" size={70} />, "Unterlagen", "Belege, Verträge, Kasse", 5.16],
  ];
  return (
    <PanelSplit avatar={avatar}>
      <Rail active={1} t={t} y={34} />
      <Fly t={t} at={1.1} from="left" style={{ left: 60, top: 160 }}>
        <div style={{ width: 340, height: 460, borderRadius: 18, background: "#FBFAF6", padding: 28, boxSizing: "border-box", boxShadow: "0 18px 44px rgba(0,0,0,0.12)", transform: `rotate(${-2 + Math.sin(t * 2) * 0.8}deg)` }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 18, letterSpacing: 3, color: "#8A8A8A" }}>FINANZAMT</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 30, color: "#151515", marginTop: 6 }}>Prüfungs­anordnung</div>
          {[280, 240, 290, 190, 260, 220, 270].map((w, i) => {
            const hl = (i === 1 && t > 3.5) || (i === 3 && t > 4.42) || (i === 5 && t > 5.16);
            return <div key={i} style={{ width: w, height: 14, borderRadius: 7, marginTop: 24, background: hl ? "#FFD166" : "#DDDAD3" }} />;
          })}
        </div>
      </Fly>
      <Fly t={t} at={2.2} from="bottom" style={{ left: 120, top: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: P.text, borderRadius: 30, padding: "10px 22px 10px 12px" }}>
          <Logo name="claude" size={44} />
          <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: "#FFF" }}>liest mit …</span>
        </div>
      </Fly>
      {t > 2.3 && t < 3.4 ? <div style={{ position: "absolute", left: 70, width: 320, top: 200 + ((t - 2.3) / 1.1) * 380, height: 6, borderRadius: 3, background: P.orange, boxShadow: "0 0 24px rgba(255,107,53,0.8)" }} /> : null}
      {facts.map(([ic, ti, sub, at], i) => (
        <Fly key={ti} t={t} at={at} from="right" style={{ left: 450, top: 160 + i * 156 }}>
          <Card style={{ width: 500, height: 132, padding: "0 28px", boxSizing: "border-box", display: "flex", alignItems: "center" }}>
            <Row icon={ic} title={ti} sub={sub} size={34} />
          </Card>
        </Fly>
      ))}
      <Walker t={t} size={96} arms="point" enter={2.0} prop={t > 5.8 ? PropClipboard : PropLens} keys={[{ t: 2.0, x: 1010, y: GROUND }, { t: 3.3, x: 1010, y: GROUND }, { t: 3.6, x: 1010, y: 226, hop: 60 }, { t: 4.3, x: 1010, y: 226 }, { t: 4.55, x: 1010, y: 382, hop: 50 }, { t: 5.05, x: 1010, y: 382 }, { t: 5.3, x: 1010, y: 538, hop: 50 }]} />
    </PanelSplit>
  );
};

// 3 · Schritt 2: DATEV export table, the smiley walks down the rows with a lens, FEHLT stamps, shock.
export const BpP3Schritt2: React.FC<BpPProps> = ({ avatar }) => {
  const t = useSec();
  const rows: [string, string, string][] = [["4650 Bewirtung", "+62 %", P.yellow], ["4530 Fahrzeug", "Fahrtenbuch?", P.red], ["1000 Kasse", "3 Belege?", P.red], ["4210 Miete", "ok", P.green]];
  const rowY = (i: number) => 160 + 84 + 48 + i * 96;
  const flow = ramp(t, 0.9, 1.25);
  return (
    <PanelSplit avatar={avatar} full>
      {/* above the panel: DATEV export travels into Claude (beat "Export" 1.33) */}
      <div style={{ position: "absolute", left: 60, right: 60, top: -250, height: 150, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: ramp(t, 0.5, 0.75) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Logo name="datev" size={110} /><span style={{ fontFamily: fonts.bold, fontSize: 36, color: P.text }}>Export</span></div>
        <div style={{ flex: 1, height: 6, margin: "0 30px", borderRadius: 3, background: P.line, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${flow * 100}%`, background: P.orange }} />
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", top: -9, left: `${((t * 0.9 + i / 3) % 1) * 100}%`, width: 24, height: 24, borderRadius: 6, background: P.orange, opacity: flow }} />)}
        </div>
        <div style={{ transform: `scale(${popAt(t, 1.2)})` }}><Logo name="claude" size={110} /></div>
      </div>
      <Rail active={2} t={t} y={34} />
      <Card style={{ position: "absolute", left: 60, top: 160, width: 840, height: 480, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, height: 84, padding: "0 30px", boxSizing: "border-box", borderBottom: `2px solid ${P.line}`, opacity: ramp(t, 1.2, 1.4) }}>
          <Logo name="datev" size={48} />
          <span style={{ fontFamily: fonts.bold, fontSize: 30, color: P.text }}>Export 2022 bis 2024</span>
        </div>
        {rows.map(([k, v, c], i) => {
          const at = 1.5 + i * 0.4;
          const a = ramp(t, at, at + 0.2);
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, height: 96, padding: "0 30px", boxSizing: "border-box", borderBottom: i < 3 ? `2px solid ${P.line}` : "none", opacity: a, background: c === P.red && t > 3.3 + (i - 1) * 0.3 ? "rgba(229,72,77,0.06)" : "transparent" }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
              <span style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 36, color: P.text }}>{k}</span>
              <span style={{ fontFamily: fonts.bold, fontSize: 30, color: c }}>{v}</span>
            </div>
          );
        })}
      </Card>
      <Stamp text="FEHLT" t={t} at={3.3} x={430} y={rowY(1) - 30} size={34} rot={-8} />
      <Stamp text="FEHLT" t={t} at={3.6} x={430} y={rowY(2) - 30} size={34} rot={6} />
      <Walker t={t} size={96} prop={Lens} mood={t > 3.4 ? "shock" : "happy"} arms={t > 3.4 ? "up" : "point"} enter={1.2}
        keys={[{ t: 1.2, x: 990, y: 200 }, { t: 1.6, x: 990, y: rowY(0) }, { t: 2.0, x: 990, y: rowY(1) }, { t: 2.4, x: 990, y: rowY(2) }, { t: 2.8, x: 990, y: rowY(3) }, { t: 3.2, x: 990, y: GROUND }, { t: 3.5, x: 990, y: GROUND, hop: 70 }]} />
      {/* below the panel: the receipt row with gaps (beat "fehlende Belege" 3.36 / "Lücken" 4.0) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const miss = i === 2 || i === 5 || i === 6;
        const a = 3.3 + i * 0.08;
        const k = popAt(t, a, 0.25);
        return (
          <div key={i} style={{ position: "absolute", left: 60 + i * 122, top: 770, opacity: Math.min(1, k), transform: `translateY(${(1 - Math.min(1, k)) * 60}px)` }}>
            <Receipt w={96} missing={miss && t > 4.0} rot={((i * 23) % 10) - 5} />
          </div>
        );
      })}
      <Fly t={t} at={5.1} from="bottom" style={{ left: 60, top: 980 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFF", border: `3px solid ${P.red}`, borderRadius: 24, padding: "14px 26px", fontFamily: fonts.bold, fontSize: 36, color: P.red }}>⚠ Bevor es der Prüfer findet</div>
      </Fly>
    </PanelSplit>
  );
};

// 4 · DER TRICK: the smiley runs in and jumps under the word.
export const BpP4Trick: React.FC<BpPProps> = ({ avatar }) => {
  const t = useSec();
  return (
    <PanelSplit avatar={avatar} full>
      <Slam text="eigentliche" t={t} at={0.5} y={120} size={70} color={P.dim} />
      <Slam text="TRICK" accent="DER" t={t} at={0.85} y={250} size={180} />
      <Crowd t={t} at={0.0} cols={12} rows={3} x={70} y={820} gap={86} size={60} step={0.012} mood="proud" />
      <Walker t={t} size={110} arms="up" mood="proud" keys={[{ t: 0, x: 1150, y: GROUND - 20 }, { t: 0.45, x: 540, y: GROUND - 20 }, { t: 0.75, x: 540, y: GROUND - 20 }, { t: 0.95, x: 540, y: GROUND - 20, hop: 90 }]} />
    </PanelSplit>
  );
};

// 5 · Schritt 3: the smiley wears the examiner cap and hops with every question; your answer, ÜBERZEUGEND.
export const BpP5Schritt3: React.FC<BpPProps> = ({ avatar }) => {
  const t = useSec();
  const qs: [string, number][] = [["Warum +62 % Bewirtung?", 1.55], ["Wo ist das Fahrtenbuch?", 2.0], ["Was sind die Barbelege?", 2.45]];
  const cap = PropCap;
  return (
    <PanelSplit avatar={avatar}>
      <Rail active={3} t={t} y={34} />
      <Walker t={t} size={130} mood="proud" arms="point" prop={cap} enter={0.5} keys={[{ t: 0.5, x: 150, y: 330 }, { t: 1.5, x: 150, y: 330 }, { t: 1.62, x: 150, y: 330, hop: 40 }, { t: 2.0, x: 150, y: 330 }, { t: 2.12, x: 150, y: 330, hop: 40 }, { t: 2.45, x: 150, y: 330 }, { t: 2.57, x: 150, y: 330, hop: 40 }]} />
      {qs.map(([q, at], i) => (
        <Fly key={q} t={t} at={at} from="right" style={{ left: 290, top: 160 + i * 110, opacity: t > 4.1 && i < 2 ? 0.4 : undefined }}>
          <Card style={{ height: 88, padding: "0 30px", display: "flex", alignItems: "center", borderRadius: 44 }}>
            <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: P.text, whiteSpace: "nowrap" }}>{q}</span>
          </Card>
        </Fly>
      ))}
      <Fly t={t} at={4.05} from="bottom" style={{ right: 60, top: 500 }}>
        <div style={{ height: 88, padding: "0 30px", display: "flex", alignItems: "center", borderRadius: 44, background: P.orange, boxShadow: "0 18px 44px rgba(255,107,53,0.25)", fontFamily: fonts.semibold, fontSize: 32, color: "#FFF", whiteSpace: "nowrap" }}>Zwei Kundenevents, Belege liegen vor.</div>
      </Fly>
      <Fly t={t} at={3.6} from="left" style={{ left: 60, top: 520 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: P.card, border: `2px solid ${P.line}`, borderRadius: 20, padding: "12px 18px" }}>
          <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: P.dim }}>Übung</span>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 30, height: 30, borderRadius: 15, background: t > 3.75 + i * 0.3 ? P.green : P.line }} />)}
        </div>
      </Fly>
      <Stamp text="ÜBERZEUGEND" t={t} at={4.7} x={620} y={612} color={P.green} size={32} rot={-5} />
    </PanelSplit>
  );
};

// 6 · Steuerberater prüft statt sucht: the smiley walks in and jumps when "statt sucht" gets struck out.
export const BpP6Berater: React.FC<BpPProps> = ({ avatar }) => {
  const t = useSec();
  const strike = ramp(t, 1.1, 1.3);
  return (
    <PanelSplit avatar={avatar} full>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: fonts.semibold, fontSize: 44, color: P.dim, opacity: ramp(t, 0, 0.2) }}>Dein Steuerberater</div>
      <Fly t={t} at={2.2} from="bottom" style={{ left: 140, top: 780 }}>
        <Card style={{ width: 800, padding: "26px 34px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.bold, fontSize: 32, color: P.text }}>
            <span>Vorbereitung beim Start</span>
            <Count from={0} to={80} t={t} a={2.8} b={3.3} suffix=" %" style={{ color: P.green }} />
          </div>
          <div style={{ marginTop: 18, height: 26, borderRadius: 13, background: P.line, overflow: "hidden" }}>
            <div style={{ width: `${80 * ramp(t, 2.8, 3.3)}%`, height: "100%", background: P.green, borderRadius: 13 }} />
          </div>
        </Card>
      </Fly>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: fonts.bold, fontSize: 170, color: P.green, letterSpacing: -5, transform: `scale(${popAt(t, 0.3)})` }}>prüft</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: fonts.bold, fontSize: 96, color: "#A3A3A3", opacity: ramp(t, 0.7, 0.9) }}>
        <span style={{ position: "relative" }}>statt sucht<span style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 10, background: P.red, transform: `scaleX(${strike})`, transformOrigin: "0 50%" }} /></span>
      </div>
      <Walker t={t} size={100} arms="point" prop={PropStamp} keys={[{ t: 0.4, x: -80, y: GROUND - 30 }, { t: 0.95, x: 220, y: GROUND - 30 }, { t: 1.15, x: 220, y: GROUND - 30, hop: 70 }, { t: 2.4, x: 220, y: GROUND - 30 }, { t: 2.9, x: 180, y: GROUND - 30 }]} />
      <Fly t={t} at={2.55} from="bottom" style={{ left: 330, top: 530 }}>
        <Card style={{ height: 86, padding: "0 30px", display: "flex", alignItems: "center", gap: 14, borderRadius: 43 }}>
          <span style={{ width: 40, height: 40, borderRadius: 20, background: P.green, color: "#FFF", fontFamily: fonts.bold, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
          <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: P.text }}>fängt nicht bei null an</span>
        </Card>
      </Fly>
    </PanelSplit>
  );
};

// 7 · CTA: Instagram card, PRÜFUNG gets typed, the smiley walks over and taps "Folgen".
export const BpP7Cta: React.FC<BpPProps> = ({ avatar }) => {
  const t = useSec();
  const word = "PRÜFUNG";
  const n = Math.max(0, Math.min(word.length, Math.floor((t - 1.5) / 0.09)));
  const followed = t > 2.8;
  return (
    <PanelSplit avatar={avatar}>
      <Card style={{ position: "absolute", left: 60, top: 110, width: 960, height: 420, padding: 36, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Logo name="instagram" size={66} />
          <span style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text, flex: 1 }}>florent_preusser</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#FFF", background: followed ? "#BDBDBD" : P.orange, borderRadius: 16, padding: "12px 30px", transform: `scale(${t > 2.75 && t < 3.0 ? 1.12 : 1})` }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
        </div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim, marginTop: 44 }}>Kommentare</div>
        <div style={{ marginTop: 18, height: 96, borderRadius: 48, border: `2px solid ${P.line}`, display: "flex", alignItems: "center", padding: "0 36px", fontFamily: fonts.bold, fontSize: 46, color: P.text }}>
          {word.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0, color: P.orange }}>|</span>
        </div>
      </Card>
      <Fly t={t} at={2.3} from="bottom" style={{ left: 60, top: 572 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><PdfBadge size={60} /><span style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.text }}>Guide mit allen 3 Nachrichten</span></div>
      </Fly>
      <Walker t={t} size={100} arms="point" prop={t > 1.4 && t < 2.6 ? PropMegaphone : undefined} keys={[{ t: 0.2, x: 1150, y: GROUND - 20 }, { t: 1.2, x: 900, y: GROUND - 20 }, { t: 2.5, x: 900, y: GROUND - 20 }, { t: 2.78, x: 900, y: 120, hop: 80 }, { t: 3.0, x: 900, y: 150 }, { t: 3.25, x: 960, y: GROUND - 20, hop: 40 }]} />
    </PanelSplit>
  );
};
