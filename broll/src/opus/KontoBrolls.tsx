import React from "react";
import { Easing, interpolate } from "remotion";
import { fonts } from "../theme";
import { PK, paperShadow, Highlight, Sheen, InkStamp } from "./PremiumKit";
import { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, tilt, Logo, Mono, Pill, CheckDot, Ico, Glint, Ring, Pointer, PanelStage, Odometer } from "./DuetBrolls";
import { FeeJar3D } from "./KontoObjects3D";

// FP-N "Konto" (2026-10-29) - split-panel scenes (1080 x 820). Every scene is a pure function of (t, dur, at);
// KontoOpus anchors `at` to captions.json word times. All numbers are an invented example (BEISPIEL), generic bank,
// no real bank names or logos.
// Example maths: 2.400 Buchungen/Jahr (≈200/Monat) × 0,40 € = 960 € + Grundpreis 9,90 €×12 = 118,80 € + Karten 7,10 €×12 = 85,20 €
// = 1.164 €/Jahr. Models with the same bookings: Online Basis 1.104 €, Komfort (aktuell) 1.164 €, Business Flat 359 €.

export type SceneP = { t: number; dur: number; at?: Record<string, number> };
const mk = (dur: number, at: Record<string, number> | undefined) => (name: string, frac: number) => (at && at[name] !== undefined ? at[name] : frac * dur);
const ez = Easing.inOut(Easing.cubic);
const eur = (v: number, dec = 2) => v.toLocaleString("de-DE", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// ---------- shared pieces ----------
export const I2 = {
  folder: "M3 7.5A2.5 2.5 0 015.5 5H10l2 2.5h6.5A2.5 2.5 0 0121 10v7.5a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 17.5z",
  doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  up: "M12 19V6M6 11.5L12 5.5l6 6",
  plus: "M12 5v14M5 12h14",
  calc: "M6 3h12v18H6zM9 7h6M9 11h1M12 11h1M15 11h0M9 14h1M12 14h1M9 17h1M12 17h1M15 14v3",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  mail: "M3.5 6h17v12h-17zM4 6.5l8 6 8-6",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  card: "M3 6h18v12H3zM3 10h18M6.5 15h4",
  send: "M3 11l18-7-7 18-2.5-7.5z",
  copy: "M8 8h11v12H8zM5 16V4h11",
};
export const Win: React.FC<{ title: string; crumb?: string; style?: React.CSSProperties; children?: React.ReactNode; right?: React.ReactNode }> = ({ title, crumb = "Projects", style, children, right }) => (
  <div style={{ position: "absolute", background: CL.page, borderRadius: 26, boxShadow: paperShadow, border: `1px solid ${CL.border}`, overflow: "hidden", ...style }}>
    <div style={{ height: 66, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: `1px solid ${CL.border}`, background: "#FFF" }}>
      <Logo name="claude" size={32} />
      <span style={{ fontFamily: fonts.medium, fontSize: 24, color: CL.sub, whiteSpace: "nowrap" }}>{crumb} /</span>
      <span style={{ fontFamily: fonts.semibold, fontSize: 25, color: CL.text, whiteSpace: "nowrap" }}>{title}</span>
      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>{right ?? <span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "0.1em", color: CL.sub }}>CLAUDE.AI</span>}</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 66, bottom: 0 }}>{children}</div>
  </div>
);
export const TopTag: React.FC<{ t: number; text: string; at?: number; color?: string; style?: React.CSSProperties }> = ({ t, text, at = -0.2, color = C.orange, style }) => (
  <div style={{ position: "absolute", left: 50, top: 26, zIndex: 20, display: "inline-flex", alignItems: "center", gap: 12, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "10px 22px 10px 14px", fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", ...ps(t, at, 10, 0.8), ...style }}>
    <span style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />{text}
  </div>
);
export const Beispiel: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <span style={{ position: "absolute", zIndex: 30, fontFamily: MONO, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: "#8A6A2A", background: "rgba(255,248,232,0.92)", border: "1.5px solid #E0C78F", borderRadius: 8, padding: "4px 10px", ...style }}>BEISPIEL</span>
);
// generic bank mark (invented): ink tile with a stylised "K"-free monogram of two stacked bars
const BankTile: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.26, background: "linear-gradient(150deg, #2A3A5C, #17213A)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: size * 0.09, flexShrink: 0, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)" }}>
    <span style={{ width: size * 0.52, height: size * 0.12, borderRadius: size * 0.06, background: "#FFF" }} />
    <span style={{ width: size * 0.52, height: size * 0.12, borderRadius: size * 0.06, background: "#9FB4DA" }} />
  </div>
);
// redacted bar (geschwärzt)
const Redact: React.FC<{ w: number; h?: number; p?: number; style?: React.CSSProperties }> = ({ w, h = 18, p = 1, style }) => (
  <span style={{ display: "inline-block", width: w, height: h, borderRadius: 4, background: "#16130F", transform: `scaleX(${p})`, transformOrigin: "0% 50%", verticalAlign: "middle", ...style }} />
);
export const PdfIcon: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <div style={{ width: size * 0.82, height: size, borderRadius: size * 0.12, background: "#FFF", border: `1.5px solid ${CL.border}`, position: "relative", flexShrink: 0, boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}>
    <div style={{ position: "absolute", left: -size * 0.08, bottom: size * 0.14, background: C.red, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: size * 0.24, borderRadius: size * 0.06, padding: `${size * 0.02}px ${size * 0.08}px` }}>PDF</div>
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: size * 0.16, right: size * 0.16, top: size * (0.16 + i * 0.13), height: size * 0.05, borderRadius: 2, background: "#E2DDD3" }} />)}
  </div>
);

// ================= 0. HOOK: statement scrolls, every fee line flies into the glass jar =================
type Row = { d: string; a: string; fee?: boolean; who?: string };
const NORMAL: Row[] = [
  { d: "Gehalt M. Krüger", a: "−3.240,00", who: "MK" }, { d: "Gutschrift Kunde Weber", a: "+2.380,00", who: "KW" }, { d: "Miete Büro Okt.", a: "−1.450,00", who: "MB" },
  { d: "Lastschrift Telekom", a: "−89,90", who: "LT" }, { d: "Überweisung Lieferant", a: "−612,40", who: "ÜL" }, { d: "Gutschrift Kunde Arslan", a: "+1.120,00", who: "KA" },
  { d: "Gehalt S. Yilmaz", a: "−2.910,00", who: "SY" }, { d: "Lastschrift Versicherung", a: "−148,20", who: "LV" }, { d: "Gutschrift Kunde Lenz", a: "+760,00", who: "KL" },
];
const FEES: Row[] = [
  { d: "Buchungsposten", a: "−0,40" }, { d: "Buchungsposten Lastschrift", a: "−0,40" }, { d: "Entgelt Kontoführung", a: "−9,90" },
  { d: "Buchungsposten Gutschrift", a: "−0,40" }, { d: "Kartengebühr Debit", a: "−3,55" }, { d: "Buchungsposten Überweisung", a: "−0,40" },
];
const N_EV = 15;
export const HOOK_EV = Array.from({ length: N_EV }, (_, i) => 0.15 + i * 0.27); // fee line hits the scan line
const ROWS: Row[] = [];
const FEE_IDX: number[] = [];
for (let i = 0; i < N_EV + 4; i++) {
  const nn = i % 3 === 1 ? 2 : 1;
  for (let j = 0; j < nn; j++) ROWS.push(NORMAL[(ROWS.length * 7 + j) % NORMAL.length]);
  FEE_IDX.push(ROWS.length);
  ROWS.push({ ...FEES[i % FEES.length], fee: true });
}
for (let j = 0; j < 6; j++) ROWS.push(NORMAL[(j * 4 + 2) % NORMAL.length]);
const RH = 66;
const SCAN_Y = 250; // inside the rows area
export const JAR_DROPS = HOOK_EV.flatMap((e, i) => [0, 0.06, 0.12].map((d) => e + 0.3 + d + (i % 2) * 0.02));
const counterVals = HOOK_EV.map((_, i) => 97 + ((1164 - 97) * (i + 1)) / N_EV);
export const hookCounter = (t: number) => interpolate(t, [0, ...HOOK_EV.map((e) => e + 0.36)], [97, ...counterVals], { ...clamp, easing: Easing.out(Easing.cubic) });

export const HookBank: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const tausend = m("tausend", 0.47), jahr = m("jahr", 0.6), claude = m("claude", 0.68), cent = m("cent", 0.8), fuenf = m("fuenf", 0.88);
  const last = HOOK_EV[N_EV - 1];
  const stopY = (FEE_IDX[N_EV - 1] + 2.5) * RH;
  const off = t <= last
    ? interpolate(t, HOOK_EV, FEE_IDX.slice(0, N_EV).map((r) => r * RH), { extrapolateLeft: "extend", extrapolateRight: "clamp" })
    : interpolate(t, [last, claude - 0.1], [FEE_IDX[N_EV - 1] * RH, stopY], { ...clamp, easing: Easing.out(Easing.cubic) });
  const vel = Math.abs(off - (t <= last ? interpolate(t - 0.04, HOOK_EV, FEE_IDX.slice(0, N_EV).map((r) => r * RH), { extrapolateLeft: "extend", extrapolateRight: "clamp" }) : off)) / 0.04;
  const CARD = { x: 36, y: 248, w: 600, h: 640 };
  const HEAD = 84;
  const beam = interpolate(t, [claude, claude + 1.15], [-40, CARD.h - HEAD + 40], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const beamOn = t > claude - 0.05 && t < claude + 1.4;
  const val = hookCounter(t);
  const hitT = HOOK_EV.find((e) => t >= e + 0.33 && t < e + 0.5);
  const big = t > tausend - 0.06 ? 1 : 0;
  const JAR = { x: 610, y: 150, w: 470, h: 600 };
  const mouth = { x: 838, y: 300 };
  return (
    <PanelStage t={t} dur={dur} seed={21} shake={hitT !== undefined ? Math.sin((t - hitT) * 90) * 2 : 0}>
      <Beispiel style={{ left: 34, top: 28 }} />
      {/* glass jar */}
      <div style={{ position: "absolute", left: JAR.x, top: JAR.y, width: JAR.w, height: JAR.h }}>
        <FeeJar3D t={t} w={JAR.w} h={JAR.h} drops={JAR_DROPS} glow={k(t, tausend - 0.1, 0.3) * (1 - k(t, claude, 0.6))} />
      </div>
      {/* bank statement */}
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, transform: tilt(t, 7, 9), transformOrigin: "40% 0%" }}>
        <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, overflow: "hidden" }}>
          <div style={{ height: HEAD, display: "flex", alignItems: "center", gap: 14, padding: "0 22px", borderBottom: `1.5px solid ${CL.border}`, background: "#FBFAF7" }}>
            <BankTile size={48} />
            <div>
              <div style={{ fontFamily: fonts.bold, fontSize: 27, color: PK.ink, lineHeight: 1.1 }}>Girokonto Business</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: CL.sub, letterSpacing: "0.06em", marginTop: 4 }}>DE<Redact w={130} h={16} style={{ margin: "0 8px" }} />4821</div>
            </div>
            <span style={{ marginLeft: "auto" }}><Pill text="UMSÄTZE" color={CL.sub} bg={CL.bubble} size={16} dot={false} /></span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: HEAD, bottom: 0, overflow: "hidden" }}>
            {[...NORMAL.slice(0, 8).map((r) => ({ ...r })), ...ROWS].map((r, ii) => {
              const i = ii - 8;
              const y = SCAN_Y + i * RH - off - RH / 2;
              if (y < -RH || y > CARD.h) return null;
              const fi = FEE_IDX.indexOf(i);
              const e = fi >= 0 && fi < N_EV ? HOOK_EV[fi] : 999;
              const hot = r.fee && t > e - 0.06;
              const flash = r.fee ? interpolate(t, [e - 0.06, e, e + 0.3], [0, 1, 0.35], clamp) : 0;
              const found = r.fee && t > claude && y + RH / 2 < beam;
              return (
                <div key={ii} style={{ position: "absolute", left: 0, right: 0, top: y, height: RH, display: "flex", alignItems: "center", gap: 14, padding: "0 22px", borderBottom: "1px solid #EFEBE4", background: found ? "rgba(217,119,87,0.13)" : hot ? `rgba(229,72,77,${0.06 + flash * 0.16})` : "#FFF" }}>
                  {r.fee ? (
                    <span style={{ width: 40, height: 40, borderRadius: 12, background: hot ? C.red : "#F1EEE8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico d={r.d.startsWith("Karten") ? I2.card : I2.list} size={24} color={hot ? "#FFF" : CL.sub} sw={2.2} /></span>
                  ) : (
                    <span style={{ width: 40, height: 40, borderRadius: "50%", background: "#EDE8DF", fontFamily: fonts.bold, fontSize: 15, color: "#6E675C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.who}</span>
                  )}
                  <span style={{ fontFamily: r.fee ? fonts.bold : fonts.medium, fontSize: 25, color: hot ? "#A3201C" : CL.text, whiteSpace: "nowrap" }}>{r.d}</span>
                  <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 25, color: r.a.startsWith("+") ? C.green : hot ? C.red : CL.text, whiteSpace: "nowrap" }}>{r.a} €</span>
                  {found ? <span style={{ position: "absolute", left: 6, top: RH / 2 - 15 }}><CheckDot size={30} color={C.orange} /></span> : null}
                </div>
              );
            })}
            {/* scan line */}
            <div style={{ position: "absolute", left: 0, right: 0, top: SCAN_Y - RH / 2 - 2, height: RH + 4, border: `3px solid ${t < claude ? "rgba(229,72,77,0.55)" : "rgba(0,0,0,0)"}`, borderRadius: 8, pointerEvents: "none" }} />
            {/* Claude beam */}
            {beamOn ? (
              <>
                <div style={{ position: "absolute", left: 0, right: 0, top: beam - 70, height: 70, background: "linear-gradient(180deg, rgba(217,119,87,0), rgba(217,119,87,0.28))" }} />
                <div style={{ position: "absolute", left: 0, right: 0, top: beam - 2, height: 5, background: C.orange, boxShadow: "0 0 18px 4px rgba(217,119,87,0.7)" }} />
              </>
            ) : null}
          </div>
          {/* motion blur veil while scrolling fast */}
          <div style={{ position: "absolute", left: 0, right: 0, top: HEAD, height: 60, background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0))", opacity: Math.min(1, vel / 400) }} />
        </div>
        {beamOn ? (
          <div style={{ position: "absolute", left: 300, top: HEAD + beam - 26, zIndex: 5, opacity: k(t, claude, 0.12) * (1 - k(t, claude + 1.2, 0.2)) }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FFF", border: `2px solid ${C.orange}`, borderRadius: 999, padding: "6px 18px 6px 8px", fontFamily: fonts.bold, fontSize: 24, color: PK.ink, boxShadow: "0 10px 24px rgba(120,50,25,0.25)" }}><Logo name="claude" size={32} />Claude prüft</span>
          </div>
        ) : null}
      </div>
      {/* fee chips flying from the scan line into the jar */}
      {HOOK_EV.map((e, i) => {
        const u = (t - e) / 0.36;
        if (u < 0 || u > 1) return null;
        const q = Easing.inOut(Easing.cubic)(u);
        const x0 = CARD.x + 420, y0 = CARD.y + HEAD + SCAN_Y - 18;
        const x = x0 + (mouth.x - x0) * q, y = y0 + (mouth.y - y0) * q - Math.sin(q * Math.PI) * 150;
        const fee = FEES[i % FEES.length];
        return (
          <div key={i} style={{ position: "absolute", left: x - 70, top: y - 22, zIndex: 25, transform: `scale(${1.1 - 0.6 * q}) rotate(${q * 25}deg)`, opacity: 1 - k(u, 0.85, 0.15) }}>
            <span style={{ display: "inline-flex", fontFamily: MONO, fontWeight: 800, fontSize: 28, color: "#FFF", background: C.red, borderRadius: 12, padding: "6px 14px", boxShadow: "0 10px 20px rgba(160,30,25,0.35)", whiteSpace: "nowrap" }}>{fee.a} €</span>
          </div>
        );
      })}
      {/* counter */}
      <div style={{ position: "absolute", left: 640, top: 628, zIndex: 20, ...ps(t, -0.4, 10, 0.9) }}>
        <div style={{ position: "relative", background: "#FFF", borderRadius: 24, boxShadow: paperShadow, border: `2px solid ${t > claude ? C.orange : big ? C.red : CL.border}`, padding: "14px 26px 12px", minWidth: 330, overflow: "hidden", transform: `scale(${1 + 0.08 * (hitT !== undefined ? 1 - (t - hitT - 0.33) / 0.17 : 0) + 0.06 * pop(t, tausend - 0.06, 0.3) * (1 - k(t, jahr + 0.3, 0.3))})`, transformOrigin: "50% 50%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {t > claude ? <Logo name="claude" size={24} /> : <span style={{ width: 12, height: 12, borderRadius: "50%", background: C.red }} />}
            <Mono text={t > claude ? "GEFUNDEN · PRO JAHR" : "GEBÜHREN · PRO JAHR"} size={18} color={t > claude ? PK.orangeDeep : C.red} />
          </div>
          <div style={{ marginTop: 2, display: "flex", alignItems: "baseline", gap: 8 }}>
            <Odometer value={val} size={78} color={t > claude ? PK.ink : C.red} />
            <span style={{ fontFamily: fonts.bold, fontSize: 52, color: t > claude ? PK.ink : C.red }}>€</span>
          </div>
          <Sheen p={k(t, jahr, 0.6)} strength={0.7} />
        </div>
      </div>
      {/* Claude: 5 min */}
      {t > fuenf - 0.08 ? (
        <div style={{ position: "absolute", left: 690, top: 520, zIndex: 26, ...ps(t, fuenf - 0.06, 16, 0.5) }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "10px 24px 10px 10px", fontFamily: fonts.bold, fontSize: 30, boxShadow: "0 14px 28px rgba(0,0,0,0.3)" }}>
            <CheckDot size={40} p={k(t, fuenf + 0.05, 0.3)} />jeder Cent · 5 Min
          </span>
        </div>
      ) : null}
      <Ring t={t} at={tausend - 0.04} x={805} y={680} r={260} color={C.red} />
      <Ring t={t} at={claude} x={330} y={330} r={240} />
      <Glint t={t} at={jahr + 0.1} x={1010} y={620} size={40} />
      <Glint t={t} at={cent} x={560} y={420} size={34} />
      <Glint t={t} at={fuenf + 0.2} x={1000} y={540} size={36} />
    </PanelStage>
  );
};

// ================= 1. "komplettes System … den Gebührencheck in Claude" =================
export const SceneSystem: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const mods = [m("m1", 0.05), m("m2", 0.3), m("m3", 0.4), m("m4", 0.55)];
  const title = m("title", 0.6), claude = m("claude", 0.9);
  const MODS = [
    { x: 40, y: 96, ic: I2.doc, h: "Auszüge", s: "12 Monate, anonym", from: [-300, -80] },
    { x: 780, y: 96, ic: I2.calc, h: "Zählen", s: "jede Buchung", from: [300, -80] },
    { x: 40, y: 590, ic: I2.layers, h: "Modelle", s: "Preisverzeichnis", from: [-300, 80] },
    { x: 780, y: 590, ic: I2.mail, h: "Mail", s: "an deine Bank", from: [300, 80] },
  ];
  const CARD = { x: 290, y: 255, w: 500, h: 300 };
  const anchors = [[CARD.x, CARD.y + 50], [CARD.x + CARD.w, CARD.y + 50], [CARD.x, CARD.y + CARD.h - 50], [CARD.x + CARD.w, CARD.y + CARD.h - 50]];
  const tileC = (i: number) => [MODS[i].x + (i % 2 === 0 ? 260 : 0), MODS[i].y + 50];
  return (
    <PanelStage t={t} dur={dur} seed={22}>
      <svg width={PW} height={PH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {MODS.map((_, i) => {
          const p = k(t, mods[i] + 0.25, 0.3);
          const [x1, y1] = tileC(i), [x2, y2] = anchors[i];
          return <path key={i} d={`M${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`} fill="none" stroke={C.orange} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" strokeDashoffset={-t * 40} opacity={p} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, ...ps(t, -0.25, 20, 0.85) }}>
        <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 28, border: `1.5px solid ${CL.border}`, boxShadow: paperShadow, padding: "28px 32px", boxSizing: "border-box", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Ico d={I2.folder} size={28} color={CL.sub} />
            <Mono text="PROJEKT" size={18} />
            {t > claude - 0.05 ? <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: CL.bubble, borderRadius: 999, padding: "5px 14px 5px 8px", fontFamily: fonts.semibold, fontSize: 22, color: CL.text, ...ps(t, claude, 8, 0.5) }}><Logo name="claude" size={26} />in Claude</span> : null}
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 60, color: PK.ink, marginTop: 18, lineHeight: 1, minHeight: 60, whiteSpace: "nowrap" }}>
            {typed("Gebührencheck", t, title - 0.15, title + 0.45) || <span style={{ color: CL.border }}>Gebührencheck</span>}
          </div>
          <div style={{ fontFamily: fonts.medium, fontSize: 25, color: CL.sub, marginTop: 16 }}>Was kostet dich deine Bank?</div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            {mods.map((a, i) => <span key={i} style={{ width: 64, height: 9, borderRadius: 5, background: t > a + 0.3 ? C.orange : CL.border }} />)}
          </div>
          <Sheen p={k(t, title + 0.3, 0.7)} strength={0.8} />
        </div>
      </div>
      <Ring t={t} at={title + 0.3} x={CARD.x + CARD.w / 2} y={CARD.y + CARD.h / 2} r={330} />
      {MODS.map((md, i) => {
        const a = mods[i];
        const p = interpolate(t, [a - 0.1, a + 0.32], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
        const snap = t > a + 0.22 && t < a + 0.4 ? 1 - (t - a - 0.22) / 0.18 : 0;
        return (
          <div key={i} style={{ position: "absolute", left: md.x + (1 - p) * md.from[0], top: md.y + (1 - p) * md.from[1], width: 260, opacity: k(t, a - 0.1, 0.1), transform: `rotate(${(1 - p) * (i % 2 ? 8 : -8)}deg) scale(${1 + snap * 0.06})` }}>
            <div style={{ background: "#FFF", borderRadius: 22, border: `1.5px solid ${snap > 0 ? C.orange : CL.border}`, boxShadow: "0 18px 34px -14px rgba(90,55,30,0.4)", padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico d={md.ic} size={32} color={PK.orangeDeep} sw={2} /></div>
              <div>
                <div style={{ fontFamily: fonts.bold, fontSize: 29, color: PK.ink }}>{md.h}</div>
                <div style={{ fontFamily: fonts.medium, fontSize: 20, color: CL.sub, whiteSpace: "nowrap" }}>{md.s}</div>
              </div>
            </div>
          </div>
        );
      })}
      {mods.map((a, i) => <Glint key={i} t={t} at={a + 0.25} x={anchors[i][0]} y={anchors[i][1]} size={30} />)}
      <TopTag t={t} text="KOMPLETTES SYSTEM" at={-0.1} style={{ left: 380, top: 30 }} />
    </PanelStage>
  );
};

// ================= 2. "vierzig Cent für jede einzelne Buchung. Lohn, Lastschrift, Gutschrift, jede Überweisung." =================
const BOOK4 = [
  { w: "Lohn", d: "Gehalt M. Krüger", a: "−3.240,00", who: "MK" },
  { w: "Lastschrift", d: "Lastschrift Telekom", a: "−89,90", who: "LT" },
  { w: "Gutschrift", d: "Gutschrift Kunde Weber", a: "+2.380,00", who: "KW" },
  { w: "Überweisung", d: "Überweisung Lieferant", a: "−612,40", who: "ÜL" },
];
export const SceneBuchung: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const manche = m("manche", 0.02), vierzig = m("vierzig", 0.18), jede = m("jede", 0.3), buchung = m("buchung", 0.4);
  const rows = [m("r1", 0.5), m("r2", 0.56), m("r3", 0.7), m("r4", 0.88)];
  const n = rows.filter((a) => t >= a + 0.18).length;
  const slam = pop(t, vierzig - 0.05, 0.4);
  return (
    <PanelStage t={t} dur={dur} seed={23}>
      <div style={{ position: "absolute", left: 50, top: 40, width: 400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, ...ps(t, manche - 0.1, 10, 0.8) }}><BankTile size={42} /><Mono text="MANCHE BANKEN" size={22} color={CL.sub} /></div>
        <div style={{ marginTop: 22, opacity: k(t, vierzig - 0.06, 0.08), transform: `scale(${1.5 - 0.5 * slam}) rotate(${-3 * slam}deg)`, transformOrigin: "0% 50%" }}>
          <span style={{ display: "inline-block", fontFamily: fonts.bold, fontSize: 118, color: "#FFF", background: C.red, borderRadius: 26, padding: "4px 26px 10px", whiteSpace: "nowrap", letterSpacing: "-0.03em", boxShadow: "0 24px 44px -12px rgba(160,30,25,0.5)", lineHeight: 1.05 }}>0,40 €</span>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 50, color: PK.ink, marginTop: 26, lineHeight: 1.1, minHeight: 110 }}>
          {typed("für jede einzelne", t, jede - 0.1, jede + 0.35)}<br />
          <span style={{ position: "relative", display: "inline-block" }}>
            <Highlight p={k(t, buchung, 0.35)} color="rgba(242,120,100,0.35)" />
            <i style={{ position: "relative" }}>{typed("Buchung.", t, buchung - 0.05, buchung + 0.25)}</i>
          </span>
        </div>
        {n > 0 ? (
          <div style={{ marginTop: 26, display: "inline-flex", alignItems: "center", gap: 12, background: "#16130F", borderRadius: 18, padding: "12px 22px", ...ps(t, rows[0] + 0.18, 10, 0.7) }}>
            <Mono text={`${n} BUCHUNGEN`} size={22} color="#FFF" />
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: "#FF8E86" }}>= {eur(n * 0.4)} €</span>
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 480, top: 40, width: 560, height: 740, transform: tilt(t, 3, -7) }}>
        {BOOK4.map((b, i) => {
          const a = rows[i];
          const p = interpolate(t, [a - 0.18, a + 0.15], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
          const tag = pop(t, a + 0.12, 0.32);
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: i * 178, width: 560, height: 150, opacity: k(t, a - 0.18, 0.1), transform: `translateX(${(1 - p) * 260}px)` }}>
              <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 24, boxShadow: paperShadow, border: `2px solid ${t > a + 0.12 ? "rgba(229,72,77,0.55)" : CL.border}`, display: "flex", alignItems: "center", gap: 18, padding: "0 26px" }}>
                <span style={{ width: 66, height: 66, borderRadius: "50%", background: "#EDE8DF", fontFamily: fonts.bold, fontSize: 24, color: "#6E675C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{b.who}</span>
                <div>
                  <div style={{ fontFamily: fonts.bold, fontSize: 38, color: PK.ink }}>{b.w}</div>
                  <div style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub, whiteSpace: "nowrap" }}>{b.d}</div>
                </div>
                <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 26, color: b.a.startsWith("+") ? C.green : CL.text, whiteSpace: "nowrap" }}>{b.a} €</div>
              </div>
              <div style={{ position: "absolute", right: -16, top: -20, transform: `scale(${tag}) rotate(${6 - 10 * tag}deg)`, opacity: k(t, a + 0.12, 0.08) }}>
                <span style={{ display: "inline-flex", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: "#FFF", background: C.red, borderRadius: 12, padding: "6px 14px", boxShadow: "0 10px 20px rgba(160,30,25,0.35)" }}>+0,40 €</span>
              </div>
            </div>
          );
        })}
      </div>
      {rows.map((a, i) => <Glint key={i} t={t} at={a + 0.2} x={1030} y={60 + i * 178} size={32} />)}
      <Ring t={t} at={vierzig} x={220} y={190} r={220} color={C.red} />
    </PanelStage>
  );
};

// ================= 3. "zweihundert Buchungen im Monat, dazu Grundpreis und Karten" =================
export const SceneHundert: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const fillA = m("fillA", 0.15), zwei = m("zwei", 0.3), monat = m("monat", 0.5), grund = m("grund", 0.72), karten = m("karten", 0.88);
  const fillB = monat - 0.1;
  const nFill = Math.round(interpolate(t, [fillA, fillB], [0, 200], { ...clamp, easing: Easing.in(Easing.quad) }));
  const COLS = 20, TS = 22, GAP = 4;
  const total = interpolate(t, [monat, monat + 0.3, grund, grund + 0.3, karten, karten + 0.3], [0, 80, 80, 89.9, 89.9, 97], clamp);
  return (
    <PanelStage t={t} dur={dur} seed={24}>
      <div style={{ position: "absolute", left: 50, top: 36, width: 540 }}>
        <Mono text="MIT TEAM · PRO MONAT" size={22} color={CL.sub} style={{ ...ps(t, -0.2, 10, 0.8) }} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 6 }}>
          <Odometer value={nFill} size={150} color={PK.ink} speed={t < fillB ? 1 : 0} />
          <span style={{ fontFamily: SERIF, fontSize: 52, color: PK.ink, opacity: k(t, zwei, 0.2) }}><i>Buchungen</i></span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 50, top: 250, padding: 22, background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, transform: tilt(t, 6, 6), ...ps(t, -0.2, 20, 0.92) }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, ${TS}px)`, gap: GAP }}>
          {Array.from({ length: 200 }, (_, i) => {
            const on = i < nFill;
            const fresh = on && i > nFill - 6;
            return <span key={i} style={{ width: TS, height: TS, borderRadius: 6, background: on ? (fresh ? "#FF7C70" : C.red) : "#EFEBE4", transform: `scale(${fresh ? 1.25 : 1})` }} />;
          })}
        </div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 22, height: 22, borderRadius: 6, background: C.red }} />
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, color: CL.sub, letterSpacing: "0.08em" }}>= 1 BUCHUNG · 0,40 €</span>
        </div>
      </div>
      {/* bill */}
      <div style={{ position: "absolute", left: 650, top: 60, width: 390, transform: tilt(t, 4, -8), ...ps(t, -0.15, 20, 0.9) }}>
        <div style={{ background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, padding: "24px 26px", position: "relative", overflow: "hidden" }}>
          <Mono text="DEINE BANK · MONAT" size={19} color={CL.sub} />
          {[
            { a: monat, l: "200 × 0,40 €", v: "80,00 €", ic: I2.list },
            { a: grund, l: "Grundpreis", v: "9,90 €", ic: I2.doc },
            { a: karten, l: "Karten", v: "7,10 €", ic: I2.card },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, padding: "12px 14px", borderRadius: 16, background: t > r.a ? C.redSoft : "#F7F5F1", border: `1.5px solid ${t > r.a ? "rgba(229,72,77,0.4)" : "transparent"}`, opacity: t > r.a - 0.1 ? 1 : 0.35, transform: `scale(${t > r.a - 0.1 ? 0.92 + 0.08 * pop(t, r.a - 0.1, 0.35) : 0.92})` }}>
              <Ico d={r.ic} size={30} color={t > r.a ? C.red : CL.sub} sw={2.1} />
              <span style={{ fontFamily: fonts.bold, fontSize: 30, color: PK.ink, whiteSpace: "nowrap" }}>{r.l}</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 28, color: C.red, whiteSpace: "nowrap" }}>{t > r.a ? `+${r.v}` : "…"}</span>
            </div>
          ))}
          <div style={{ height: 2, background: CL.border, margin: "22px 0 14px" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <Mono text="SUMME" size={20} color={CL.sub} />
            <span style={{ marginLeft: "auto" }}><Odometer value={total} size={64} color={C.red} suffix=" €" /></span>
          </div>
          <Sheen p={k(t, karten + 0.35, 0.6)} />
        </div>
      </div>
      <Beispiel style={{ left: 930, top: 24 }} />
      <Ring t={t} at={monat} x={840} y={200} r={200} color={C.red} />
      <Glint t={t} at={grund + 0.2} x={1020} y={290} size={32} />
      <Glint t={t} at={karten + 0.2} x={1020} y={390} size={32} />
    </PanelStage>
  );
};

// ---------- Claude composer (light claude.ai) ----------
export const Composer: React.FC<{ t: number; focus: boolean; children?: React.ReactNode; text?: string; placeholder?: string; sendAt?: number; style?: React.CSSProperties }> = ({ t, focus, children, text, placeholder = "Wie kann ich dir heute helfen?", sendAt = 999, style }) => (
  <div style={{ position: "absolute", background: "#FFF", border: `1.5px solid ${focus ? C.orange : CL.border}`, borderRadius: 28, boxShadow: focus ? "0 0 0 6px rgba(217,119,87,0.12), 0 14px 34px rgba(20,20,20,0.07)" : "0 14px 34px rgba(20,20,20,0.07)", padding: "20px 24px 18px", boxSizing: "border-box", display: "flex", flexDirection: "column", ...style }}>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
      {children}
      <div style={{ fontFamily: fonts.medium, fontSize: 30, color: text ? CL.text : CL.sub, minHeight: 38 }}>{text || placeholder}{text && t < sendAt ? <span style={{ display: "inline-block", width: 3, height: 32, background: C.orange, marginLeft: 3, verticalAlign: "middle" }} /> : null}</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
      <div style={{ width: 50, height: 50, borderRadius: 14, border: `1.5px solid ${CL.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.plus} size={26} /></div>
      <div style={{ marginLeft: "auto", fontFamily: fonts.medium, fontSize: 23, color: CL.sub }}>Opus 5.5</div>
      <div style={{ width: 54, height: 54, borderRadius: 14, background: CL.send, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${t > sendAt && t < sendAt + 0.12 ? 0.82 : 1})` }}><Ico d={I2.up} size={30} color="#FFF" sw={2.4} /></div>
    </div>
  </div>
);
export const FileChip: React.FC<{ name: string; sub: string; w?: number; style?: React.CSSProperties; check?: number }> = ({ name, sub, w = 214, style, check }) => (
  <div style={{ width: w, display: "flex", alignItems: "center", gap: 10, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 14, padding: "8px 10px", boxSizing: "border-box", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", ...style }}>
    <PdfIcon size={40} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: fonts.bold, fontSize: 22, color: CL.text, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 14, color: CL.sub, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{sub}</div>
    </div>
    {check !== undefined ? <span style={{ marginLeft: "auto" }}><CheckDot size={26} p={check} /></span> : null}
  </div>
);
// mini statement page with redaction bars
const MiniStatement: React.FC<{ w: number; red: number; style?: React.CSSProperties; month: string }> = ({ w, red, style, month }) => (
  <div style={{ position: "absolute", width: w, height: w * 1.38, background: "#FFF", borderRadius: 10, boxShadow: "0 14px 26px -10px rgba(70,35,10,0.4)", border: `1px solid ${CL.border}`, padding: w * 0.08, boxSizing: "border-box", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><BankTile size={w * 0.14} /><span style={{ fontFamily: fonts.bold, fontSize: w * 0.08, color: PK.ink }}>Kontoauszug {month}</span></div>
    <div style={{ marginTop: w * 0.06, fontFamily: MONO, fontWeight: 700, fontSize: w * 0.06, color: CL.sub, display: "flex", alignItems: "center", gap: 4 }}>IBAN <span style={{ position: "relative", display: "inline-block", width: w * 0.55, height: w * 0.07 }}><span style={{ position: "absolute", inset: 0, background: "#DAD5CC", borderRadius: 2 }} /><Redact w={w * 0.55} h={w * 0.07} p={red} style={{ position: "absolute", left: 0, top: 0 }} /></span></div>
    <div style={{ marginTop: w * 0.03, fontFamily: MONO, fontWeight: 700, fontSize: w * 0.06, color: CL.sub, display: "flex", alignItems: "center", gap: 4 }}>NAME <span style={{ position: "relative", display: "inline-block", width: w * 0.45, height: w * 0.07 }}><span style={{ position: "absolute", inset: 0, background: "#DAD5CC", borderRadius: 2 }} /><Redact w={w * 0.45} h={w * 0.07} p={red} style={{ position: "absolute", left: 0, top: 0 }} /></span></div>
    {Array.from({ length: 8 }, (_, i) => (
      <div key={i} style={{ display: "flex", gap: 6, marginTop: w * 0.045 }}>
        <span style={{ flex: 1, height: w * 0.035, borderRadius: 2, background: i % 3 === 1 ? "#F5C4C0" : "#ECE8E1" }} />
        <span style={{ width: w * 0.18, height: w * 0.035, borderRadius: 2, background: i % 3 === 1 ? "#F09A93" : "#E2DDD3" }} />
      </div>
    ))}
  </div>
);
const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

// ================= 4. "Du lädst Claude die Kontoauszüge der letzten zwölf Monate hoch" =================
export const SceneUpload: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const redA = m("redA", 0.08), grab = m("grab", 0.3), drop = m("drop", 0.66), hoch = m("hoch", 0.85);
  const dp = k(t, grab + 0.05, Math.max(0.3, drop - grab - 0.1), ez);
  const landed = t > drop;
  const stack = { x: 70, y: 150 };
  const zone = { x: 120, y: 420 };
  return (
    <PanelStage t={t} dur={dur} seed={25}>
      <div style={{ position: "absolute", left: 40, top: 26, width: 1000, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Gebührencheck" style={{ inset: 0 }} right={landed ? <span style={{ ...ps(t, drop + 0.6, 6, 0.6) }}><Pill text="IBAN GESCHWÄRZT" color="#FFF" bg="#16130F" size={17} /></span> : undefined}>
          <div style={{ position: "absolute", left: 360, right: 30, top: 34, fontFamily: SERIF, fontSize: 46, color: CL.text, lineHeight: 1.12 }}>
            <Logo name="claude" size={40} /> <span style={{ verticalAlign: "middle" }}>Lade deine Auszüge hoch</span>
          </div>
          <Composer t={t} focus={t > grab} text={typed("Zähle jede Buchung und jeden Cent Gebühr.", t, hoch - 0.25, hoch + 0.4)} sendAt={dur + 1} style={{ left: 30, right: 30, bottom: 28, height: 400 }}>
            {landed ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 208px)", gap: 10 }}>
                {MONTHS.map((mo, i) => <div key={mo} style={{ ...ps(t, drop + i * 0.04, 14, 0.6) }}><FileChip name={`Auszug ${mo}/26`} sub="PDF · 2 SEITEN" w={208} /></div>)}
              </div>
            ) : (
              <div style={{ height: 228, borderRadius: 18, border: `3px dashed ${t > grab ? C.orange : CL.border}`, background: t > grab ? "rgba(217,119,87,0.07)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.medium, fontSize: 28, color: t > grab ? PK.orangeDeep : CL.sub, gap: 12 }}>
                <Ico d={I2.up} size={34} color={t > grab ? C.orange : CL.sub} />Dateien hierher ziehen
              </div>
            )}
          </Composer>
        </Win>
      </div>
      {/* statement stack: gets redacted, then dragged into the composer */}
      {!landed ? (
        <div style={{ position: "absolute", left: stack.x + (zone.x + 240 - stack.x) * dp, top: stack.y + (zone.y + 40 - stack.y) * dp - Math.sin(dp * Math.PI) * 90, zIndex: 40, transform: `scale(${1 - 0.35 * dp})`, transformOrigin: "0 0" }}>
          {[0, 1, 2, 3].map((i) => <MiniStatement key={i} w={230} month={`${MONTHS[11 - i]}/26`} red={k(t, redA + (3 - i) * 0.12, 0.2)} style={{ left: i * 14, top: i * -12, transform: `rotate(${(i - 1.5) * 4}deg)` }} />)}
          <div style={{ position: "absolute", left: 200, top: -40, zIndex: 5, transform: `scale(${pop(t, redA, 0.35)})` }}><Pill text="12 PDFs" color="#FFF" bg={C.orange} size={24} dot={false} /></div>
        </div>
      ) : null}
      {!landed && t > redA ? <div style={{ position: "absolute", left: 60, top: 530, zIndex: 41, opacity: 1 - dp, ...ps(t, redA + 0.3, 8, 0.6) }}><Pill text="NAME + IBAN GESCHWÄRZT" color="#FFF" bg="#16130F" size={20} /></div> : null}
      <Pointer t={t} path={[{ x: 700, y: 860, at: 0 }, { x: stack.x + 140, y: stack.y + 160, at: grab, click: true }, { x: zone.x + 360, y: zone.y + 130, at: drop - 0.02, click: true }, { x: zone.x + 520, y: zone.y + 260, at: drop + 0.6 }]} size={56} />
      <Ring t={t} at={drop} x={zone.x + 380} y={zone.y + 140} r={240} />
      <Glint t={t} at={drop + 0.3} x={980} y={420} size={36} />
    </PanelStage>
  );
};

// ================= 5. "Claude zählt jede Buchung und jeden Cent Gebühr" =================
const BOOKS = [196, 204, 188, 210, 201, 199, 193, 207, 202, 198, 195, 207];
const FEE_M = BOOKS.map((b) => +(b * 0.4 + 17).toFixed(2));
const MN = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
export const SceneZaehlt: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const fetched = m("fetched", 0.05), r0 = m("r0", 0.2), r1 = m("r1", 0.75), sum = m("sum", 0.85);
  const rowAt = (i: number) => r0 + ((r1 - r0) * i) / 11;
  const nRows = MONTHS.filter((_, i) => t >= rowAt(i)).length;
  const sumFee = FEE_M.slice(0, nRows).reduce((a, b) => a + b, 0);
  const sumB = BOOKS.slice(0, nRows).reduce((a, b) => a + b, 0);
  const sumShown = interpolate(t, [r0, r1 + 0.2], [0, 1164], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <PanelStage t={t} dur={dur} seed={26}>
      <div style={{ position: "absolute", left: 40, top: 26, width: 1000, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Gebührencheck" style={{ inset: 0 }}>
          <div style={{ position: "absolute", right: 30, top: 22, maxWidth: 640, background: CL.bubble, borderRadius: 20, padding: "12px 20px", fontFamily: fonts.medium, fontSize: 25, color: CL.text, display: "flex", alignItems: "center", gap: 10 }}>
            <PdfIcon size={30} /><b>12</b>&nbsp;Auszüge · Zähle jede Buchung und jeden Cent Gebühr.
          </div>
          <div style={{ position: "absolute", left: 30, top: 100, display: "flex", alignItems: "center", gap: 12, ...ps(t, fetched, 8, 0.7) }}>
            <Logo name="claude" size={36} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1.5px solid ${CL.border}`, borderRadius: 999, padding: "6px 16px", background: "#FFF", fontFamily: fonts.semibold, fontSize: 21, color: CL.sub }}>12 Dateien gelesen <CheckDot size={24} p={k(t, fetched + 0.2, 0.3)} /></span>
          </div>
          <div style={{ position: "absolute", left: 30, right: 30, top: 160, display: "flex", gap: 22 }}>
            {[0, 1].map((col) => (
              <div key={col} style={{ flex: 1, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 18, overflow: "hidden" }}>
                <div style={{ display: "flex", padding: "10px 18px", background: "#F4F1EA", fontFamily: MONO, fontWeight: 800, fontSize: 17, letterSpacing: "0.1em", color: CL.sub }}>
                  <span style={{ width: 90 }}>MONAT</span><span style={{ width: 150 }}>BUCHUNGEN</span><span style={{ marginLeft: "auto" }}>GEBÜHR</span>
                </div>
                {MONTHS.slice(col * 6, col * 6 + 6).map((_, j) => {
                  const i = col * 6 + j;
                  const a = rowAt(i);
                  const on = t >= a;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", padding: "0 18px", height: 58, borderTop: "1px solid #EFEBE4", background: on && t < a + 0.25 ? "rgba(217,119,87,0.14)" : "#FFF", opacity: on ? 1 : 0.25 }}>
                      <span style={{ width: 90, fontFamily: fonts.bold, fontSize: 27, color: PK.ink }}>{MN[i]}</span>
                      <span style={{ width: 150, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: CL.text }}>{on ? BOOKS[i] : "—"}</span>
                      <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 27, color: C.red, transform: `scale(${on ? 0.8 + 0.2 * pop(t, a, 0.3) : 1})` }}>{on ? `${eur(FEE_M[i])} €` : ""}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 30, right: 30, bottom: 26, height: 96, background: "#16130F", borderRadius: 20, display: "flex", alignItems: "center", padding: "0 26px", gap: 20, ...ps(t, r0 - 0.1, 14, 0.9) }}>
            <Mono text="SUMME 12 MONATE" size={20} color="rgba(255,255,255,0.7)" />
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: "#FFF" }}><Odometer value={sumB} size={30} color="#FFF" /> Buchungen</span>
            <span style={{ marginLeft: "auto" }}><Odometer value={t > sum ? 1164 : Math.min(sumShown, sumFee + 40)} size={58} color="#FF8E86" suffix=" €" /></span>
          </div>
        </Win>
      </div>
      <Glint t={t} at={sum} x={990} y={720} size={40} />
      <Ring t={t} at={sum} x={880} y={720} r={200} />
    </PanelStage>
  );
};

// ================= 6. "Am Ende steht eine Zahl: was dich deine Bank wirklich kostet" =================
export const SceneZahl: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const zahl = m("zahl", 0.3), wirklich = m("wirklich", 0.65), kostet = m("kostet", 0.8);
  const zin = k(t, -0.1, 0.9, ez);
  const v = interpolate(t, [0, zahl], [0, 1164], { ...clamp, easing: Easing.out(Easing.cubic) });
  const PARTS = [
    { l: "Buchungen", v: 960, c: C.red },
    { l: "Grundpreis", v: 118.8, c: "#E9785F" },
    { l: "Karten", v: 85.2, c: "#F2A68C" },
  ];
  return (
    <PanelStage t={t} dur={dur} seed={27}>
      <div style={{ position: "absolute", left: 90, top: 60, width: 900, height: 470, transform: `${tilt(t, 3, -3)} scale(${0.86 + 0.14 * zin})`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 36, boxShadow: paperShadow, border: `2px solid ${t > zahl ? C.red : CL.border}`, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><BankTile size={40} /><Mono text="DEINE BANK KOSTET DICH" size={26} color={CL.sub} /></div>
          <div style={{ position: "relative", marginTop: 6 }}>
            <Highlight p={k(t, wirklich - 0.05, 0.35)} color="rgba(242,120,100,0.28)" />
            <span style={{ position: "relative", display: "flex", alignItems: "baseline" }}>
              <Odometer value={v} size={210} color={C.red} speed={t < zahl ? 1 : 0} />
              <span style={{ fontFamily: fonts.bold, fontSize: 150, color: C.red, marginLeft: 16 }}>€</span>
            </span>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 60, color: PK.ink, marginTop: -6 }}><i>pro Jahr</i></div>
          <Sheen p={k(t, zahl, 0.7)} />
        </div>
        <Beispiel style={{ right: 26, top: 22 }} />
      </div>
      {/* breakdown bar */}
      <div style={{ position: "absolute", left: 90, top: 580, width: 900, opacity: k(t, kostet - 0.25, 0.15) }}>
        <div style={{ display: "flex", height: 30, borderRadius: 15, overflow: "hidden", background: "#EFEBE4" }}>
          {PARTS.map((p, i) => <span key={i} style={{ width: `${(p.v / 1164) * 100 * k(t, kostet - 0.2 + i * 0.12, 0.35)}%`, background: p.c }} />)}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
          {PARTS.map((p, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FFF", borderRadius: 999, padding: "8px 18px 8px 12px", boxShadow: "0 8px 18px rgba(80,40,15,0.14)", fontFamily: fonts.bold, fontSize: 26, color: PK.ink, whiteSpace: "nowrap", ...ps(t, kostet - 0.15 + i * 0.12, 10, 0.6) }}>
              <span style={{ width: 16, height: 16, borderRadius: "50%", background: p.c }} />{p.l} <span style={{ fontFamily: MONO, color: C.red }}>{eur(p.v, p.v % 1 ? 2 : 0)} €</span>
            </span>
          ))}
        </div>
      </div>
      <Ring t={t} at={zahl} x={540} y={300} r={420} color={C.red} />
      <Glint t={t} at={zahl + 0.1} x={940} y={170} size={44} />
    </PanelStage>
  );
};

// ================= 7. "Preisverzeichnis deiner Bank … rechnet jedes Kontomodell … durch" =================
const MODELS = [
  { n: "Online Basis", r: "4,90 € + 0,40 €/Buchung", v: 1104 },
  { n: "Komfort", r: "9,90 € + 0,40 €/Buchung", v: 1164, cur: true },
  { n: "Business Flat", r: "29,90 € · 250 Buchungen inkl.", v: 359, best: true },
];
export const SceneModelle: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const grab = m("grab", 0.08), drop = m("drop", 0.2), send = m("send", 0.4), rechnet = m("rechnet", 0.53), cards = m("cards", 0.6), echten = m("echten", 0.8), durch = m("durch", 0.93);
  const out = k(t, rechnet - 0.15, 0.4, ez);
  const dp = k(t, grab + 0.05, Math.max(0.25, drop - grab - 0.08), ez);
  const landed = t > drop;
  return (
    <PanelStage t={t} dur={dur} seed={28}>
      {/* phase 1: price list into the composer */}
      {out < 1 ? (
        <div style={{ position: "absolute", left: 40, top: 26, width: 1000, height: 770, transform: `${tilt(t, 4, 0)} translateY(${-out * 900}px)`, transformOrigin: "50% 100%" }}>
          <Win title="Gebührencheck" style={{ inset: 0 }}>
            <div style={{ position: "absolute", left: 30, right: 30, top: 40, fontFamily: SERIF, fontSize: 50, color: CL.text, textAlign: "center" }}><Logo name="claude" size={42} /> <span style={{ verticalAlign: "middle" }}>Welches Modell passt zu dir?</span></div>
            <Composer t={t} focus={t > grab} text={typed("Rechne jedes Kontomodell mit meinen Buchungen durch.", t, drop + 0.1, send - 0.08)} sendAt={send} style={{ left: 30, right: 30, bottom: 28, height: 330 }}>
              {landed ? <div style={{ ...ps(t, drop, 14, 0.6) }}><FileChip name="Preis- und Leistungsverzeichnis" sub="PDF · DEINE BANK · 24 SEITEN" w={600} check={k(t, drop + 0.2, 0.3)} /></div> : <div style={{ height: 70 }} />}
            </Composer>
          </Win>
        </div>
      ) : null}
      {!landed ? (
        <div style={{ position: "absolute", left: 560 + (150 - 560) * dp, top: 150 + (420 - 150) * dp - Math.sin(dp * Math.PI) * 100, zIndex: 40, transform: `rotate(${(1 - dp) * 6}deg) scale(${1.15 - 0.15 * dp})`, ...ps(t, -0.25, 20, 0.8) }}>
          <div style={{ width: 400, background: "#FFF", borderRadius: 18, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><PdfIcon size={56} /><div><div style={{ fontFamily: fonts.bold, fontSize: 26, color: PK.ink, lineHeight: 1.1 }}>Preis- und Leistungs&shy;verzeichnis</div><Mono text="DEINE BANK · PDF" size={15} /></div></div>
            {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ display: "flex", marginTop: 12, gap: 10 }}><span style={{ flex: 1, height: 12, borderRadius: 4, background: "#ECE8E1" }} /><span style={{ width: 70, height: 12, borderRadius: 4, background: "#E2DDD3" }} /></div>)}
          </div>
        </div>
      ) : null}
      {/* phase 2: models recalculated */}
      {t > cards - 0.3 ? (
        <>
          <div style={{ position: "absolute", left: 50, top: 34, display: "flex", alignItems: "center", gap: 14, ...ps(t, cards - 0.3, 12, 0.8) }}>
            <Logo name="claude" size={40} />
            <span style={{ fontFamily: SERIF, fontSize: 46, color: PK.ink }}>Mit deinen <span style={{ position: "relative" }}><Highlight p={k(t, echten, 0.35)} /><b style={{ position: "relative", fontFamily: fonts.bold }}>2.400 Buchungen</b></span></span>
          </div>
          {MODELS.map((md, i) => {
            const a = cards + i * 0.14;
            const p = interpolate(t, [a - 0.15, a + 0.3], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
            const v = interpolate(t, [echten - 0.1 + i * 0.08, durch - 0.08], [0, md.v], { ...clamp, easing: Easing.out(Easing.cubic) });
            const win = md.best && t > durch;
            return (
              <div key={i} style={{ position: "absolute", left: 28 + i * 338, top: 150 + (1 - p) * 260, width: 320, height: 470, opacity: k(t, a - 0.15, 0.1), transform: `${tilt(t + i, 3, (i - 1) * -5)} scale(${win ? 1 + 0.05 * pop(t, durch, 0.4) : 1})` }}>
                <div style={{ position: "absolute", inset: 0, background: win ? "#F3FBF6" : "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `${win ? 4 : 1.5}px solid ${win ? C.green : md.cur ? "rgba(229,72,77,0.5)" : CL.border}`, padding: "26px 24px", boxSizing: "border-box", overflow: "hidden" }}>
                  <div style={{ height: 34 }}>{md.cur ? <Pill text="AKTUELL" color={C.red} bg={C.redSoft} size={17} /> : md.best ? <Pill text="FLAT" color={PK.orangeDeep} bg={C.orangeSoft} size={17} /> : <Pill text="ONLINE" color={CL.sub} bg={CL.bubble} size={17} />}</div>
                  <div style={{ fontFamily: fonts.bold, fontSize: 38, color: PK.ink, marginTop: 14, whiteSpace: "nowrap" }}>{md.n}</div>
                  <div style={{ fontFamily: fonts.medium, fontSize: 21, color: CL.sub, marginTop: 6, minHeight: 56 }}>{md.r}</div>
                  <div style={{ height: 2, background: CL.border, margin: "16px 0" }} />
                  <Mono text="PRO JAHR" size={17} />
                  <div style={{ marginTop: 4 }}><Odometer value={v} size={70} color={win ? C.green : md.cur ? C.red : PK.ink} speed={t < durch - 0.1 && t > echten ? 1 : 0} suffix=" €" /></div>
                  {win ? <div style={{ marginTop: 14, ...ps(t, durch + 0.1, 8, 0.6) }}><Pill text="−805 € / JAHR" color="#FFF" bg={C.green} size={21} dot={false} /></div> : null}
                  <Sheen p={win ? k(t, durch + 0.05, 0.6) : 0} />
                </div>
                {win ? <div style={{ position: "absolute", right: -14, top: -16, transform: `scale(${pop(t, durch, 0.4)})` }}><CheckDot size={62} p={k(t, durch + 0.08, 0.3)} /></div> : null}
              </div>
            );
          })}
          <Beispiel style={{ left: 940, top: 40 }} />
        </>
      ) : null}
      <Pointer t={t} path={[{ x: 900, y: 860, at: 0 }, { x: 640, y: 210, at: grab, click: true }, { x: 420, y: 520, at: drop - 0.02, click: true }, { x: 985, y: 735, at: send, click: true }, { x: 960, y: 420, at: durch - 0.3 }, { x: 1000, y: 175, at: durch, click: true }]} size={56} />
      <Ring t={t} at={durch} x={880} y={380} r={260} color={C.green} />
      <Glint t={t} at={durch + 0.15} x={1010} y={150} size={44} />
    </PanelStage>
  );
};

// ================= 8. "schreibt dir die Mail an deine Bank, mit deiner Jahressumme und dem passenden Modell" =================
export const SceneMail: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const s0 = m("s0", 0.03), summe = m("summe", 0.5), modell = m("modell", 0.78), sendAt = m("send", 0.9);
  const seg1 = "Guten Tag,\nmeine Kontogebühren der letzten 12 Monate: ";
  const seg2 = ". Für meine Buchungen passt das Modell ";
  const seg3 = " besser. Bitte stellen Sie mein Konto um.";
  const t1 = typed(seg1, t, s0 + 0.1, summe - 0.12);
  const t2 = typed(seg2, t, summe + 0.15, modell - 0.12);
  const t3 = typed(seg3, t, modell + 0.15, sendAt - 0.15);
  const sent = t > sendAt + 0.05;
  const hl = (on: boolean, a: number, txt: string, color: string) => (on ? (
    <span style={{ position: "relative", display: "inline-block", fontFamily: fonts.bold, color: "#FFF", padding: "0 10px", margin: "0 2px", transform: `scale(${0.7 + 0.3 * pop(t, a, 0.35)})` }}>
      <span style={{ position: "absolute", inset: "2px 0 0", background: color, borderRadius: 10 }} /><span style={{ position: "relative" }}>{txt}</span>
    </span>
  ) : null);
  return (
    <PanelStage t={t} dur={dur} seed={29}>
      <div style={{ position: "absolute", left: 40, top: 26, width: 1000, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Mail an deine Bank" crumb="Gebührencheck" style={{ inset: 0 }} right={<span style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1.5px solid ${CL.border}`, borderRadius: 12, padding: "6px 14px", fontFamily: fonts.semibold, fontSize: 20, color: CL.sub }}><Ico d={I2.copy} size={22} color={CL.sub} />Kopieren</span>}>
          <div style={{ position: "absolute", left: 34, right: 34, top: 24 }}>
            {[["An", "Kundenservice · deine Bank"], ["Betreff", "Wechsel meines Kontomodells"]].map(([l, v], i) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 0", borderBottom: `1.5px solid ${CL.border}`, ...ps(t, -0.2 + i * 0.1, 8, 0.9) }}>
                <span style={{ width: 120, fontFamily: fonts.medium, fontSize: 26, color: CL.sub }}>{l}</span>
                <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: CL.text }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 22, fontFamily: fonts.medium, fontSize: 33, color: CL.text, lineHeight: 1.5, whiteSpace: "pre-wrap", minHeight: 300 }}>
              {t1}{hl(t > summe - 0.05, summe - 0.05, "1.164 €", C.red)}{t2}{hl(t > modell - 0.05, modell - 0.05, "Business Flat", C.green)}{t3}
              {!sent && t > s0 ? <span style={{ display: "inline-block", width: 3, height: 34, background: C.orange, marginLeft: 3, verticalAlign: "middle" }} /> : null}
            </div>
          </div>
          <div style={{ position: "absolute", right: 34, bottom: 30, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: sent ? C.green : CL.send, color: "#FFF", borderRadius: 16, padding: "16px 30px", fontFamily: fonts.bold, fontSize: 30, transform: `scale(${t > sendAt && t < sendAt + 0.12 ? 0.9 : 1})`, boxShadow: "0 14px 28px rgba(120,50,25,0.25)" }}>
              {sent ? <CheckDot size={34} color="rgba(255,255,255,0.25)" /> : <Ico d={I2.send} size={28} color="#FFF" sw={2.2} />}{sent ? "Gesendet" : "Senden"}
            </span>
          </div>
          <div style={{ position: "absolute", left: 34, bottom: 38, display: "flex", alignItems: "center", gap: 10, opacity: k(t, s0 + 0.2, 0.2) }}><Logo name="claude" size={28} /><span style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub }}>Entwurf von Claude</span></div>
        </Win>
      </div>
      <Pointer t={t} path={[{ x: 700, y: 860, at: 0 }, { x: 760, y: 760, at: sendAt - 0.4 }, { x: 900, y: 715, at: sendAt, click: true }, { x: 960, y: 790, at: sendAt + 0.6 }]} size={56} />
      <Ring t={t} at={sendAt + 0.05} x={890} y={715} r={200} color={C.green} />
      <Glint t={t} at={summe + 0.2} x={700} y={330} size={34} />
      <Glint t={t} at={modell + 0.2} x={500} y={400} size={34} />
    </PanelStage>
  );
};

// ================= 9. guide background (PDF scroll sits on top) =================
export const SceneGuideBg: React.FC<SceneP> = ({ t, dur }) => (
  <PanelStage t={t} dur={dur} seed={30}>
    <Glint t={t} at={0.4} x={110} y={200} size={34} />
  </PanelStage>
);

export { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, Pill, PK, InkStamp };
