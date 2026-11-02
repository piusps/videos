import React from "react";
import { interpolate } from "remotion";
import { colors, fonts } from "../theme";
import { clamp, glass, In, mono, Stage, useClip } from "../components/GlassKit";

// Type-A B-Rolls for the E-Rechnung reel (2026-09-28), one per script beat.
// Each is ~3 s, hard cut-in, in motion from frame 0.

const W = 1080;
const PAD = 60;
const label: React.CSSProperties = { fontFamily: fonts.semibold, fontSize: 28, color: "rgba(255,255,255,0.6)" };

const XML_LINES = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  "<ubl:Invoice xmlns:ubl=\"urn:oasis:names\">",
  "  <cbc:CustomizationID>urn:cen.eu:en16931",
  "  <cbc:ID>RE-2026-0412</cbc:ID>",
  "  <cbc:IssueDate>2026-09-28</cbc:IssueDate>",
  "  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>",
  "  <cbc:DocumentCurrencyCode>EUR",
  "  <cbc:BuyerReference>04011000-1234",
  "  <cac:AccountingSupplierParty>",
  "    <cac:Party><cbc:EndpointID schemeID",
  "      <cac:PartyName><cbc:Name>Müller",
  "      <cac:PostalAddress><cbc:StreetName>",
  "  <cac:TaxTotal><cbc:TaxAmount currencyID",
  "    <cac:TaxSubtotal><cbc:TaxableAmount",
  "  <cac:LegalMonetaryTotal>",
  "    <cbc:LineExtensionAmount>2000.00",
  "    <cbc:PayableAmount>2380.00</cbc:Payable",
  "  <cac:InvoiceLine><cbc:ID>1</cbc:ID>",
  "    <cbc:InvoicedQuantity unitCode=\"HUR\">",
  "    <cac:Item><cbc:Name>Wartung</cbc:Name>",
  "  <cac:InvoiceLine><cbc:ID>2</cbc:ID>",
  "</ubl:Invoice>",
];

const XmlLine: React.FC<{ text: string; size?: number }> = ({ text, size = 26 }) => (
  <div style={{ fontFamily: mono, fontSize: size, lineHeight: 1.55, whiteSpace: "nowrap", color: "rgba(255,255,255,0.55)" }}>
    {text.split(/(<\/?[\w:]+|>)/).map((part, i) =>
      part.startsWith("<") || part === ">" ? (
        <span key={i} style={{ color: colors.accent }}>{part}</span>
      ) : (
        <span key={i}>{part}</span>
      ),
    )}
  </div>
);

// 1 — "…wenn die erste unlesbare Datei im Postfach liegt"
export const InboxXmlBroll: React.FC<{ seconds: number }> = () => {
  const { frame, at } = useClip();
  const arrive = at(0, 0.18);
  const open = at(0.32, 0.55);
  const scroll = at(0.4, 1, (x) => x);
  const mails = [
    { from: "Lieferant Müller GmbH", subj: "Rechnung RE-2026-0412", file: "rechnung.xml", hot: true },
    { from: "Steuerbüro Weber", subj: "Unterlagen Q3", file: "belege.pdf" },
    { from: "Stadtwerke", subj: "Abschlag Oktober", file: "abschlag.pdf" },
  ];
  return (
    <Stage>
      {/* Mail app */}
      <div style={{ ...glass, position: "absolute", left: PAD, top: 140, width: W - PAD * 2, height: 760, padding: 40, boxSizing: "border-box", opacity: 1 - open * 0.55, transform: `scale(${1 - open * 0.06})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 52, color: colors.white }}>Posteingang</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 28, color: colors.white, background: colors.accent, borderRadius: 999, padding: "8px 22px", boxShadow: `0 0 30px ${colors.accent}aa` }}>
            {Math.round(interpolate(arrive, [0, 1], [2, 3]))} neu
          </div>
        </div>
        {mails.map((m, i) => {
          const y = i === 0 ? (1 - arrive) * -140 : arrive * 0;
          return (
            <div key={i} style={{ marginTop: i === 0 ? 40 : 22, transform: `translateY(${y}px)`, opacity: i === 0 ? arrive : 1, padding: 30, borderRadius: 26, background: m.hot ? "rgba(255,107,53,0.14)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${m.hot ? `${colors.accent}88` : "rgba(255,255,255,0.08)"}` }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 34, color: colors.white }}>{m.from}</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 28, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>{m.subj}</div>
              <div style={{ display: "inline-block", marginTop: 14, fontFamily: mono, fontSize: 24, color: m.hot ? colors.accent : "rgba(255,255,255,0.5)", border: "1.5px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: "6px 14px" }}>📎 {m.file}</div>
            </div>
          );
        })}
      </div>

      {/* Opened attachment: nothing but code */}
      <div style={{ ...glass, position: "absolute", left: 40, right: 40, top: 520 - open * 120, height: 1240, overflow: "hidden", padding: "40px 44px", boxSizing: "border-box", opacity: open, transform: `translateY(${(1 - open) * 300}px) scale(${0.9 + 0.1 * open})`, background: "linear-gradient(145deg, rgba(20,20,20,0.92), rgba(12,12,12,0.96))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
          <div style={{ fontFamily: mono, fontSize: 30, color: colors.white }}>rechnung.xml</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 28, color: colors.white, background: "rgba(255,90,70,0.2)", border: "1.5px solid rgba(255,90,70,0.7)", borderRadius: 999, padding: "8px 20px", opacity: 0.7 + 0.3 * Math.sin(frame / 3) }}>
            Nicht lesbar
          </div>
        </div>
        <div style={{ transform: `translateY(${-scroll * 520}px)` }}>
          {[...XML_LINES, ...XML_LINES].map((l, i) => (
            <XmlLine key={i} text={l} />
          ))}
        </div>
      </div>
    </Stage>
  );
};

// 2 — "Claude prüft deine letzten Rechnungen und sagt dir, welche Pflichtangaben fehlen"
export const PflichtCheckBroll: React.FC<{ seconds: number }> = () => {
  const { at } = useClip();
  const scan = at(0, 0.75, (x) => x);
  const items = [
    { t: "Rechnungsnummer", ok: true },
    { t: "Leistungsdatum", ok: true },
    { t: "USt-IdNr.", ok: true },
    { t: "Käuferreferenz", ok: false },
    { t: "Bankverbindung", ok: true },
    { t: "Leitweg-ID", ok: false },
  ];
  return (
    <Stage>
      <In p={1} style={{ position: "absolute", left: PAD, top: 120 }}>
        <div style={{ ...glass, borderRadius: 999, padding: "14px 30px", display: "inline-flex", gap: 14, alignItems: "center", fontFamily: fonts.semibold, fontSize: 30, color: colors.white }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: colors.accent, boxShadow: `0 0 16px ${colors.accent}` }} />
          Claude prüft 5 Rechnungen · {Math.min(5, 1 + Math.floor(scan * 5))}/5
        </div>
      </In>

      {/* Invoice being scanned */}
      <div style={{ ...glass, position: "absolute", left: PAD, top: 250, width: 420, height: 560, padding: 34, boxSizing: "border-box", overflow: "hidden", transform: "rotate(-3deg)" }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 30, color: colors.white }}>RECHNUNG</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 20, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>RE-2026-0412</div>
        {[0.9, 0.7, 0.8, 0.5, 0.85, 0.6, 0.75, 0.4, 0.65].map((w, i) => (
          <div key={i} style={{ height: 14, width: `${w * 100}%`, borderRadius: 7, background: "rgba(255,255,255,0.12)", marginTop: i === 0 ? 34 : 20 }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 20 + scan * 520, height: 6, background: colors.accent, boxShadow: `0 0 40px 10px ${colors.accent}88` }} />
      </div>

      {/* Checklist */}
      <div style={{ position: "absolute", left: 520, top: 260, width: 500 }}>
        {items.map((it, i) => {
          const p = interpolate(scan, [i * 0.13, i * 0.13 + 0.12], [0, 1], clamp);
          return (
            <In key={i} p={p} y={30} style={{ ...glass, borderRadius: 24, padding: "22px 26px", marginBottom: 18, display: "flex", alignItems: "center", gap: 18, border: it.ok ? glass.border : `1.5px solid ${colors.accent}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, display: "grid", placeItems: "center", fontFamily: fonts.bold, fontSize: 26, background: it.ok ? "rgba(255,255,255,0.14)" : colors.accent, color: colors.white, flex: "none" }}>{it.ok ? "✓" : "!"}</div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: colors.white, flex: 1 }}>{it.t}</div>
              {!it.ok && <div style={{ fontFamily: fonts.bold, fontSize: 22, color: colors.accent }}>fehlt</div>}
            </In>
          );
        })}
      </div>

      {/* Result */}
      <In p={at(0.62, 0.85)} style={{ ...glass, position: "absolute", left: PAD, right: PAD, top: 1120, padding: 44 }}>
        <div style={label}>Ergebnis</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 84, color: colors.white, letterSpacing: -3, marginTop: 8 }}>
          2 Angaben <span style={{ color: colors.accent }}>fehlen</span>
        </div>
        <div style={{ fontFamily: fonts.medium, fontSize: 32, color: "rgba(255,255,255,0.6)", marginTop: 12 }}>Checkliste für deine Rechnungssoftware erstellt</div>
      </In>
    </Stage>
  );
};

// 3 — "Eine E-Rechnung ist reiner Code. Claude übersetzt sie in Klartext"
export const XmlToKlartextBroll: React.FC<{ seconds: number }> = () => {
  const { frame, at } = useClip();
  const morph = at(0.18, 0.55);
  const rows = [
    { k: "Lieferant", v: "Müller GmbH" },
    { k: "Wartung Server · 10 h", v: "1.500,00 €" },
    { k: "Lizenzen · 5 Stück", v: "500,00 €" },
    { k: "USt 19 %", v: "380,00 €" },
  ];
  const total = interpolate(at(0.5, 0.8), [0, 1], [0, 2380]);
  return (
    <Stage>
      {/* Code, dissolving */}
      <div style={{ ...glass, position: "absolute", left: PAD, right: PAD, top: 110, height: 520, overflow: "hidden", padding: 36, boxSizing: "border-box", opacity: 1 - morph * 0.65, filter: `blur(${morph * 6}px)`, transform: `scale(${1 - morph * 0.08})` }}>
        <div style={{ transform: `translateY(${-frame * 3}px)` }}>
          {XML_LINES.map((l, i) => (
            <XmlLine key={i} text={l} size={24} />
          ))}
        </div>
      </div>

      {/* Claude pill */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, color: colors.white, background: colors.accent, borderRadius: 999, padding: "16px 36px", boxShadow: `0 0 ${40 + Math.sin(frame / 4) * 16}px ${colors.accent}`, transform: `scale(${1 + Math.sin(frame / 5) * 0.03})` }}>
          ✦ Claude übersetzt …
        </div>
      </div>

      {/* Clean invoice */}
      <In p={at(0.12, 0.4)} y={120} style={{ ...glass, position: "absolute", left: PAD, right: PAD, top: 740, padding: 48, background: "linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 50, color: colors.white }}>Rechnung RE-0412</div>
          <div style={label}>fällig in 30 Tagen</div>
        </div>
        {rows.map((r, i) => {
          const p = at(0.25 + i * 0.07, 0.4 + i * 0.07);
          return (
            <In key={i} p={p} y={24} style={{ display: "flex", justifyContent: "space-between", padding: "22px 0", borderBottom: "1.5px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontFamily: fonts.medium, fontSize: 32, color: "rgba(255,255,255,0.72)" }}>{r.k}</span>
              <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: colors.white }}>{r.v}</span>
            </In>
          );
        })}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 26 }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 36, color: colors.white }}>Summe</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 76, color: colors.white, letterSpacing: -2, textShadow: `0 0 40px ${colors.accent}88` }}>
            {total.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </span>
        </div>
      </In>

      <In p={at(0.78, 0.95)} y={30} style={{ position: "absolute", left: PAD, right: PAD, top: 1620, display: "flex", justifyContent: "center" }}>
        <div style={{ ...glass, borderRadius: 999, padding: "20px 34px", fontFamily: fonts.semibold, fontSize: 32, color: colors.white, border: `1.5px solid ${colors.accent}` }}>
          <span style={{ color: colors.accent }}>✓</span> Stimmt mit Bestellung #4471 überein
        </div>
      </In>
    </Stage>
  );
};

// 4 — "Claude sortiert jede Rechnung vor, bevor sie in deiner Buchhaltung landet"
export const VorsortierenBroll: React.FC<{ seconds: number }> = () => {
  const { frame, d, at } = useClip();
  const folders = [
    { t: "Material", x: 60 },
    { t: "Software", x: 390 },
    { t: "Fahrzeuge", x: 720 },
  ];
  const chips = [
    { s: "Baustoff Kern", a: "1.240 €", f: 0 },
    { s: "Adobe", a: "59 €", f: 1 },
    { s: "Aral", a: "86 €", f: 2 },
    { s: "Würth", a: "312 €", f: 0 },
    { s: "Microsoft", a: "126 €", f: 1 },
    { s: "Leasing Auto", a: "489 €", f: 2 },
    { s: "Hornbach", a: "74 €", f: 0 },
    { s: "Lexware", a: "35 €", f: 1 },
  ];
  const step = (d * 0.8) / chips.length;
  const landed = (fi: number) => chips.filter((c, i) => c.f === fi && frame > i * step + step * 1.4).length;
  return (
    <Stage>
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 120, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={label}>Rechnungseingang · diese Woche</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 88, color: colors.white, letterSpacing: -3 }}>
            {chips.filter((_, i) => frame > i * step + step * 1.4).length + 4} vorsortiert
          </div>
        </div>
      </div>

      {/* Flying invoices */}
      {chips.map((c, i) => {
        const t = interpolate(frame, [i * step - step, i * step + step * 1.4], [0, 1], clamp);
        if (t <= 0 || t >= 1) return null;
        const fx = folders[c.f].x + 20;
        const x = interpolate(t, [0, 1], [300 + ((i * 97) % 200), fx]);
        const y = interpolate(t, [0, 0.4, 1], [360, 620, 1180]);
        return (
          <div key={i} style={{ ...glass, position: "absolute", left: x, top: y, width: 280, padding: "20px 24px", borderRadius: 22, opacity: interpolate(t, [0, 0.15, 0.85, 1], [0, 1, 1, 0]), transform: `rotate(${(1 - t) * (i % 2 ? 8 : -8)}deg) scale(${1 - t * 0.3})` }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 28, color: colors.white }}>{c.s}</div>
            <div style={{ fontFamily: mono, fontSize: 24, color: colors.accent, marginTop: 6 }}>{c.a}</div>
          </div>
        );
      })}

      {/* Folders */}
      {folders.map((f, i) => {
        const n = landed(i);
        const bump = n > 0 ? Math.max(0, 1 - ((frame - chips.findIndex((c, ci) => c.f === i && frame > ci * step + step * 1.4)) % step) / 6) : 0;
        return (
          <div key={i} style={{ ...glass, position: "absolute", left: f.x, top: 1280, width: 300, height: 360, padding: 32, boxSizing: "border-box", borderColor: n ? `${colors.accent}aa` : undefined, transform: `scale(${1 + bump * 0.02})` }}>
            <div style={{ width: 70, height: 54, borderRadius: 12, background: `linear-gradient(135deg, ${colors.accent}, #FFB36B)`, boxShadow: `0 0 30px ${colors.accent}88` }} />
            <div style={{ fontFamily: fonts.bold, fontSize: 36, color: colors.white, marginTop: 28 }}>{f.t}</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 64, color: colors.white, marginTop: 10 }}>{n + [2, 1, 1][i]}</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 24, color: "rgba(255,255,255,0.55)" }}>Rechnungen</div>
          </div>
        );
      })}

      <In p={at(0.7, 0.9)} y={30} style={{ position: "absolute", left: 0, right: 0, top: 1720, display: "flex", justifyContent: "center" }}>
        <div style={{ ...glass, borderRadius: 999, padding: "18px 32px", fontFamily: fonts.semibold, fontSize: 30, color: colors.white }}>
          <span style={{ color: colors.accent }}>✓</span> Bereit für die Buchhaltung · 0 Rückfragen
        </div>
      </In>
    </Stage>
  );
};
