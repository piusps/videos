import React from "react";
import { Easing, interpolate } from "remotion";
import { fonts } from "../theme";
import { PK, paperShadow, Highlight, Sheen, InkStamp } from "./PremiumKit";
import { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, tilt, Logo, Mono, Pill, CheckDot, Ico, Glint, Ring, Pointer, PanelStage, Odometer } from "./DuetBrolls";
import { Win, Beispiel, I2, TopTag, PdfIcon, Composer, FileChip } from "./KontoBrolls";
import { ReceiptBinder3D, TABS, RB_N } from "./PauschaleObjects3D";

// FP-N "Steuerberater-Pauschale" (2026-10-30) - split-panel scenes (1080 x 820), pure functions of (t, dur, at);
// PauschaleOpus anchors `at` to captions.json word times. All receipts, firms and amounts are invented (BEISPIEL).
// Example: Pauschale 200 €/Monat × 12 = 2.400 €/Jahr. § 33 StBVV wording: Abs. 1 2/10–12/10, Abs. 3 1/10–6/10.

export type SceneP = { t: number; dur: number; at?: Record<string, number> };
const mk = (dur: number, at: Record<string, number> | undefined) => (name: string, frac: number) => (at && at[name] !== undefined ? at[name] : frac * dur);
const ez = Easing.inOut(Easing.cubic);

// sorted rows (Claude output), tab colours match the 3D binder tabs
type Row = { d: string; a: string; acc: string; accN: string; tab: number; miss?: boolean };
export const ROWS: Row[] = [
  { d: "ARAL Tankstelle", a: "84,37", acc: "4530", accN: "Kfz-Kosten", tab: 0 },
  { d: "Farben Schmidt", a: "412,80", acc: "3400", accN: "Wareneingang", tab: 1 },
  { d: "Adobe CC", a: "71,39", acc: "4964", accN: "Software/Lizenzen", tab: 2 },
  { d: "Telekom", a: "59,95", acc: "4920", accN: "Telefon", tab: 3 },
  { d: "Shell Tankstelle", a: "91,12", acc: "4530", accN: "Kfz-Kosten", tab: 0 },
  { d: "Microsoft 365", a: "12,60", acc: "4964", accN: "Software/Lizenzen", tab: 2 },
];
const MISSING = [
  { d: "Bauhaus Filiale", a: "129,95", why: "Beleg fehlt" },
  { d: "Farben Schmidt", a: "233,10", why: "Beleg fehlt" },
  { d: "Restaurant Il Porto", a: "86,50", why: "Anlass + Gäste fehlen" },
];
const Tab: React.FC<{ i: number; size?: number }> = ({ i, size = 14 }) => <span style={{ width: size, height: size * 1.6, borderRadius: 4, background: TABS[i], flexShrink: 0 }} />;
const AccPill: React.FC<{ acc: string; p?: number }> = ({ acc, p = 1 }) => (
  <span style={{ display: "inline-flex", fontFamily: MONO, fontWeight: 800, fontSize: 22, color: PK.orangeDeep, background: C.orangeSoft, borderRadius: 8, padding: "3px 10px", transform: `scale(${0.6 + 0.4 * p})`, opacity: p > 0 ? 1 : 0 }}>{acc}</span>
);
const Receipt: React.FC<{ w: number; shop: string; sum: string; style?: React.CSSProperties; rot?: number }> = ({ w, shop, sum, style, rot = 0 }) => (
  <div style={{ position: "absolute", width: w, height: w * 1.45, background: "#FFF", borderRadius: 6, boxShadow: "0 14px 26px -10px rgba(70,35,10,0.4)", border: `1px solid ${CL.border}`, padding: w * 0.09, boxSizing: "border-box", transform: `rotate(${rot}deg)`, ...style }}>
    <div style={{ fontFamily: fonts.bold, fontSize: w * 0.12, color: PK.ink, textAlign: "center", whiteSpace: "nowrap" }}>{shop}</div>
    <div style={{ height: 2, borderTop: `2px dashed ${CL.border}`, margin: `${w * 0.06}px 0` }} />
    {[0.7, 0.5, 0.62, 0.4].map((f, i) => <div key={i} style={{ width: `${f * 100}%`, height: w * 0.035, borderRadius: 2, background: "#ECE8E1", marginTop: w * 0.05 }} />)}
    <div style={{ position: "absolute", left: w * 0.09, right: w * 0.09, bottom: w * 0.1, display: "flex", fontFamily: MONO, fontWeight: 800, fontSize: w * 0.085, color: PK.ink }}><span>SUMME</span><span style={{ marginLeft: "auto" }}>{sum} €</span></div>
  </div>
);

// ================= 0. HOOK: 3D receipts → binder | Claude list | 2.400 € | § 33 StBVV "halb" | 10 Min =================
export const HOOK_SORT = (und: number, minuten: number) => {
  // first 5 receipts are already in the binder on frame 0 (result visible), the rest fly in between "Und" and "Minuten"
  const pre = [-3, -2.6, -2.2, -1.8, -1.4];
  const rest = Array.from({ length: RB_N - pre.length }, (_, i) => und + 0.1 + (i * (minuten - und - 0.75)) / (RB_N - pre.length - 1));
  return [...pre, ...rest];
};
export const HookPauschale: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const zwei = m("zwei", 0.12), jahr = m("jahr", 0.22), buchen = m("buchen", 0.27), aber = m("aber", 0.33), gebo = m("gebo", 0.42), sortiert = m("sortiert", 0.6);
  const halb = m("halb", 0.72), vor = m("vor", 0.78), und = m("und", 0.82), zehn = m("zehn", 0.94), minuten = m("minuten", 0.96);
  const sortAt = HOOK_SORT(und, minuten);
  const nIn = sortAt.filter((a) => t > a + 0.5).length;
  const doc = k(t, aber - 0.1, 0.4, ez) * (1 - k(t, und - 0.15, 0.35, ez));
  const yr = interpolate(t, [zwei - 0.1, zwei + 0.7], [200, 2400], { ...clamp, easing: Easing.out(Easing.cubic) });
  const LIST = { x: 548, y: 222, w: 500, h: 570 };
  return (
    <PanelStage t={t} dur={dur} seed={41}>
      {/* 3D: receipt pile → binder */}
      <div style={{ position: "absolute", left: -20, top: 200, width: 600, height: 620 }}>
        <ReceiptBinder3D t={t} w={600} h={620} sortAt={sortAt} closeAt={minuten - 0.2} />
      </div>
      <Beispiel style={{ left: 30, top: 228 }} />
      {/* Steuerberater invoice chip: 200 €/Monat → 2.400 €/Jahr */}
      <div style={{ position: "absolute", left: 40, top: 700, zIndex: 22, ...ps(t, -0.3, 10, 0.9) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFF", borderRadius: 20, boxShadow: paperShadow, border: `2px solid ${t > zwei - 0.06 ? C.red : CL.border}`, padding: "10px 20px", transform: `scale(${1 + 0.07 * pop(t, zwei - 0.06, 0.3) * (1 - k(t, buchen, 0.3))})`, transformOrigin: "0% 50%" }}>
          <Ico d={I2.doc} size={30} color={C.red} sw={2.1} />
          <div>
            <Mono text="STEUERBERATER · BUCHEN" size={15} color={C.red} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <Odometer value={yr} size={50} color={C.red} speed={t > zwei && t < zwei + 0.6 ? 1 : 0} suffix=" €" />
              <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: CL.sub }}>{t > zwei ? "/ Jahr" : "/ Monat"}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Claude's sorted list (result on frame 0) */}
      <div style={{ position: "absolute", left: LIST.x, top: LIST.y, width: LIST.w, height: LIST.h, transform: tilt(t, 4, -6) }}>
        <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 24, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, overflow: "hidden" }}>
          <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", borderBottom: `1.5px solid ${CL.border}`, background: "#FBFAF7" }}>
            <Logo name="claude" size={30} />
            <span style={{ fontFamily: fonts.bold, fontSize: 25, color: PK.ink }}>Buchungsmappe Okt.</span>
            <span style={{ marginLeft: "auto" }}><Pill text={`${Math.min(14, 9 + Math.max(0, nIn - 5))}/14`} color={C.green} bg={C.greenSoft} size={17} dot={false} /></span>
          </div>
          <div style={{ margin: "12px 14px 6px", padding: "8px 12px", borderRadius: 12, background: C.redSoft, border: "1.5px solid rgba(210,64,58,0.35)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 16, color: "#FFF", background: C.red, borderRadius: 6, padding: "2px 8px" }}>FEHLT</span>
            <span style={{ fontFamily: fonts.semibold, fontSize: 21, color: "#9B231E", whiteSpace: "nowrap" }}>Bauhaus · 129,95 €</span>
          </div>
          {ROWS.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, height: 64, padding: "0 18px", borderTop: "1px solid #EFEBE4" }}>
              <Tab i={r.tab} size={12} />
              <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: CL.text, whiteSpace: "nowrap", width: 214, overflow: "hidden" }}>{r.d}</span>
              <AccPill acc={r.acc} />
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 21, color: CL.text, whiteSpace: "nowrap" }}>{r.a}</span>
              <CheckDot size={24} />
            </div>
          ))}
          <Sheen p={k(t, minuten, 0.6)} strength={0.6} />
        </div>
      </div>
      {/* § 33 StBVV paper slides over the list */}
      {doc > 0 ? (
        <div style={{ position: "absolute", left: 470, top: 214, width: 580, zIndex: 30, opacity: doc, transform: `translateX(${(1 - doc) * 320}px) rotate(${(1 - doc) * 8 - 1.5}deg)` }}>
          <div style={{ background: PK.paper, borderRadius: 18, boxShadow: paperShadow, border: `1.5px solid ${PK.paperEdge}`, padding: "22px 26px 24px", position: "relative", overflow: "hidden" }}>
            <Mono text="GEBÜHRENORDNUNG · StBVV" size={17} color={CL.sub} />
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 40, color: PK.ink, marginTop: 6 }}>§ 33 Buchführung</div>
            {[
              { n: "(1)", txt: "Buchführung einschließlich Kontieren der Belege", fee: "2/10 – 12/10", hot: false, a: gebo },
              { n: "(3)", txt: "nach vom Auftraggeber kontierten Belegen", fee: "1/10 – 6/10", hot: true, a: sortiert - 0.3 },
            ].map((r, i) => {
              const on = t > r.a;
              const hot = r.hot && t > sortiert;
              return (
                <div key={i} style={{ marginTop: 16, padding: "12px 14px", borderRadius: 14, background: hot ? "rgba(30,158,87,0.10)" : "#F6F3EC", border: `2px solid ${hot ? C.green : "transparent"}`, opacity: on ? 1 : 0.35, position: "relative" }}>
                  <div style={{ fontFamily: SERIF, fontSize: 27, color: PK.ink, lineHeight: 1.2 }}><b>{r.n}</b> {r.txt}</div>
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: r.hot ? C.green : C.red }}>
                      {r.hot ? <Highlight p={k(t, halb - 0.05, 0.3)} color="rgba(30,158,87,0.22)" /> : null}
                      <span style={{ position: "relative" }}>{r.fee}</span>
                      {!r.hot ? <span style={{ position: "absolute", left: -4, right: -4, top: "52%", height: 4, background: C.red, transform: `scaleX(${k(t, halb - 0.1, 0.25)})`, transformOrigin: "0 50%" }} /> : null}
                    </span>
                    <span style={{ fontFamily: fonts.medium, fontSize: 19, color: CL.sub }}>einer vollen Gebühr</span>
                  </div>
                </div>
              );
            })}
            <Sheen p={k(t, halb, 0.6)} />
          </div>
          {t > halb - 0.08 ? <div style={{ position: "absolute", right: -18, top: 70 }}><InkStamp id="halb" text="HALB" p={k(t, halb - 0.06, 0.25)} color={C.green} size={54} rot={-12} /></div> : null}
        </div>
      ) : null}
      {/* Claude 10 Min */}
      {t > zehn - 0.1 ? (
        <div style={{ position: "absolute", left: 620, top: 690, zIndex: 32, ...ps(t, zehn - 0.08, 16, 0.5) }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "10px 24px 10px 10px", fontFamily: fonts.bold, fontSize: 30, boxShadow: "0 14px 28px rgba(0,0,0,0.3)" }}>
            <CheckDot size={40} p={k(t, zehn + 0.05, 0.3)} />sortiert · 10 Min
          </span>
        </div>
      ) : null}
      <Ring t={t} at={zwei - 0.04} x={200} y={740} r={200} color={C.red} />
      <Ring t={t} at={halb} x={760} y={540} r={260} color={C.green} />
      <Ring t={t} at={minuten + 0.25} x={360} y={500} r={240} />
      <Glint t={t} at={jahr + 0.1} x={330} y={700} size={36} />
      <Glint t={t} at={vor} x={1000} y={330} size={40} />
      <Glint t={t} at={minuten + 0.4} x={420} y={440} size={40} />
    </PanelStage>
  );
};

// ================= 1. "komplettes System … die Buchungsmappe in Claude" =================
export const SceneSystem: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const mods = [m("m1", 0.05), m("m2", 0.3), m("m3", 0.4), m("m4", 0.55)];
  const title = m("title", 0.6), claude = m("claude", 0.9);
  const MODS = [
    { x: 40, y: 96, ic: I2.doc, h: "Belege", s: "Fotos + PDFs", from: [-300, -80] },
    { x: 780, y: 96, ic: I2.list, h: "Abgleich", s: "Beleg ↔ Zahlung", from: [300, -80] },
    { x: 40, y: 590, ic: I2.layers, h: "Fehlt-Liste", s: "ganz oben", from: [-300, 80] },
    { x: 780, y: 590, ic: I2.mail, h: "Mail", s: "an die Kanzlei", from: [300, 80] },
  ];
  const CARD = { x: 290, y: 255, w: 500, h: 300 };
  const anchors = [[CARD.x, CARD.y + 50], [CARD.x + CARD.w, CARD.y + 50], [CARD.x, CARD.y + CARD.h - 50], [CARD.x + CARD.w, CARD.y + CARD.h - 50]];
  const tileC = (i: number) => [MODS[i].x + (i % 2 === 0 ? 260 : 0), MODS[i].y + 50];
  return (
    <PanelStage t={t} dur={dur} seed={42}>
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
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 56, color: PK.ink, marginTop: 18, lineHeight: 1, minHeight: 56, whiteSpace: "nowrap" }}>
            {typed("Buchungsmappe", t, title - 0.15, title + 0.45) || <span style={{ color: CL.border }}>Buchungsmappe</span>}
          </div>
          <div style={{ fontFamily: fonts.medium, fontSize: 25, color: CL.sub, marginTop: 16 }}>Belege fertig für den Steuerberater</div>
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
                <div style={{ fontFamily: fonts.bold, fontSize: 29, color: PK.ink, whiteSpace: "nowrap" }}>{md.h}</div>
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

// ================= 2. "Du gibst Claude alle Belege von einem Monat und deinen Kontoauszug" =================
const SHOPS = [["ARAL", "84,37"], ["Adobe", "71,39"], ["Telekom", "59,95"], ["Shell", "91,12"], ["Farben", "412,80"], ["Il Porto", "86,50"]];
export const SceneUpload: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const grab = m("grab", 0.2), drop = m("drop", 0.5), grab2 = m("grab2", 0.6), drop2 = m("drop2", 0.8), send = m("send", 0.95);
  const dp = k(t, grab + 0.05, Math.max(0.3, drop - grab - 0.1), ez);
  const dp2 = k(t, grab2 + 0.05, Math.max(0.25, drop2 - grab2 - 0.08), ez);
  const landed = t > drop, landed2 = t > drop2;
  const stack = { x: 60, y: 140 };
  const zone = { x: 110, y: 430 };
  return (
    <PanelStage t={t} dur={dur} seed={43}>
      <div style={{ position: "absolute", left: 40, top: 26, width: 1000, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Buchungsmappe" style={{ inset: 0 }}>
          <div style={{ position: "absolute", left: 380, right: 30, top: 34, fontFamily: SERIF, fontSize: 44, color: CL.text, lineHeight: 1.12 }}>
            <Logo name="claude" size={40} /> <span style={{ verticalAlign: "middle" }}>Belege + Kontoauszug</span>
          </div>
          <Composer t={t} focus={t > grab} text={typed("Mach die Buchungsmappe für Oktober.", t, drop + 0.15, drop2 - 0.05)} sendAt={send} style={{ left: 30, right: 30, bottom: 28, height: 400 }}>
            {landed ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} style={{ width: 140, height: 76, borderRadius: 12, border: `1.5px solid ${CL.border}`, background: "#F7F5F1", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", boxSizing: "border-box", ...ps(t, drop + i * 0.05, 12, 0.6) }}>
                    <div style={{ width: 40, height: 56, borderRadius: 4, background: "#FFF", border: `1px solid ${CL.border}`, flexShrink: 0 }} />
                    <div><div style={{ fontFamily: fonts.bold, fontSize: 18, color: CL.text, whiteSpace: "nowrap" }}>{SHOPS[i][0]}</div><Mono text="FOTO" size={12} /></div>
                  </div>
                ))}
                <div style={{ width: 140, height: 76, borderRadius: 12, background: PK.ink, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 22, ...ps(t, drop + 0.35, 12, 0.6) }}>+ 31</div>
                {landed2 ? <div style={{ ...ps(t, drop2, 12, 0.6) }}><FileChip name="Kontoauszug 10/26" sub="PDF · GESCHÄFTSKONTO" w={330} check={k(t, drop2 + 0.2, 0.3)} /></div> : null}
              </div>
            ) : (
              <div style={{ height: 200, borderRadius: 18, border: `3px dashed ${t > grab ? C.orange : CL.border}`, background: t > grab ? "rgba(217,119,87,0.07)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.medium, fontSize: 28, color: t > grab ? PK.orangeDeep : CL.sub, gap: 12 }}>
                <Ico d={I2.up} size={34} color={t > grab ? C.orange : CL.sub} />Dateien hierher ziehen
              </div>
            )}
          </Composer>
        </Win>
      </div>
      {/* receipt pile → composer */}
      {!landed ? (
        <div style={{ position: "absolute", left: stack.x + (zone.x + 240 - stack.x) * dp, top: stack.y + (zone.y + 40 - stack.y) * dp - Math.sin(dp * Math.PI) * 90, zIndex: 40, transform: `scale(${1 - 0.4 * dp})`, transformOrigin: "0 0" }}>
          {SHOPS.map(([s, a], i) => <Receipt key={i} w={150} shop={s} sum={a} rot={(i - 2.5) * 6} style={{ left: i * 26, top: (i % 2) * 18 }} />)}
          <div style={{ position: "absolute", left: -10, top: -56, zIndex: 5, transform: `scale(${pop(t, -0.1, 0.35)})` }}><Pill text="37 BELEGE · OKTOBER" color="#FFF" bg={C.orange} size={22} dot={false} /></div>
        </div>
      ) : null}
      {/* bank statement → composer */}
      {!landed2 ? (
        <div style={{ position: "absolute", left: 640 + (330 - 640) * dp2, top: 150 + (560 - 150) * dp2 - Math.sin(dp2 * Math.PI) * 80, zIndex: 41, transform: `rotate(${(1 - dp2) * 5}deg) scale(${1 - 0.3 * dp2})`, opacity: k(t, grab - 0.1, 0.2), transformOrigin: "0 0" }}>
          <div style={{ width: 330, background: "#FFF", borderRadius: 16, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><PdfIcon size={48} /><div><div style={{ fontFamily: fonts.bold, fontSize: 25, color: PK.ink }}>Kontoauszug</div><Mono text="OKTOBER 2026 · PDF" size={15} /></div></div>
            {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ display: "flex", marginTop: 10, gap: 10 }}><span style={{ flex: 1, height: 11, borderRadius: 4, background: "#ECE8E1" }} /><span style={{ width: 64, height: 11, borderRadius: 4, background: "#E2DDD3" }} /></div>)}
          </div>
        </div>
      ) : null}
      <Pointer t={t} path={[{ x: 700, y: 860, at: 0 }, { x: stack.x + 150, y: stack.y + 150, at: grab, click: true }, { x: zone.x + 360, y: zone.y + 120, at: drop - 0.02, click: true }, { x: 800, y: 260, at: grab2, click: true }, { x: zone.x + 420, y: zone.y + 160, at: drop2 - 0.02, click: true }, { x: 983, y: 742, at: send, click: true }]} size={56} />
      <Ring t={t} at={drop} x={zone.x + 380} y={zone.y + 140} r={240} />
      <Glint t={t} at={drop2 + 0.3} x={600} y={560} size={36} />
    </PanelStage>
  );
};

// ================= 3. "legt jeden Beleg neben die passende Zahlung und schreibt das Konto dazu. Tanken, Material, Software." =================
const PAY = [
  { d: "02.10. ARAL Station 4711", a: "−84,37", r: 0, hl: "tanken" },
  { d: "04.10. Adobe Systems", a: "−71,39", r: 2, hl: "software" },
  { d: "06.10. Farben Schmidt GmbH", a: "−412,80", r: 1, hl: "material" },
  { d: "12.10. Telekom Deutschland", a: "−59,95", r: 3, hl: "" },
  { d: "14.10. Shell Station", a: "−91,12", r: 4, hl: "tanken" },
];
export const SceneMatch: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const legt = m("legt", 0.1), neben = m("neben", 0.2), zahlung = m("zahlung", 0.35), konto = m("konto", 0.55);
  const tanken = m("tanken", 0.68), material = m("material", 0.78), software = m("software", 0.88);
  const hlAt: Record<string, number> = { tanken, material, software };
  const rowAt = (i: number) => neben - 0.1 + i * Math.max(0.12, (zahlung + 0.3 - neben) / 4);
  const accAt = (i: number) => konto - 0.05 + i * 0.09;
  return (
    <PanelStage t={t} dur={dur} seed={44}>
      <div style={{ position: "absolute", left: 30, top: 26, width: 1020, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Buchungsmappe Okt." style={{ inset: 0 }} right={<Pill text="SKR03" color={PK.orangeDeep} bg={C.orangeSoft} size={17} dot={false} />}>
          <div style={{ position: "absolute", left: 26, top: 20, display: "flex", alignItems: "center", gap: 12, ...ps(t, legt - 0.2, 8, 0.7) }}>
            <Logo name="claude" size={34} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: CL.sub }}>37 Belege · 41 Zahlungen gelesen</span>
            <CheckDot size={26} p={k(t, legt, 0.3)} />
          </div>
          <div style={{ position: "absolute", left: 26, right: 26, top: 74, display: "flex", padding: "8px 16px", background: "#F4F1EA", borderRadius: 12, fontFamily: MONO, fontWeight: 800, fontSize: 16, letterSpacing: "0.1em", color: CL.sub }}>
            <span style={{ width: 380 }}>ZAHLUNG (KONTOAUSZUG)</span><span style={{ width: 230 }}>BELEG</span><span>KONTO</span>
          </div>
          {PAY.map((p, i) => {
            const a = rowAt(i);
            const bp = interpolate(t, [a - 0.05, a + 0.3], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
            const ap = pop(t, accAt(i), 0.35);
            const hot = p.hl && hlAt[p.hl] !== undefined && t > hlAt[p.hl] - 0.08 && t < hlAt[p.hl] + 0.9;
            const r = ROWS[p.r];
            return (
              <div key={i} style={{ position: "absolute", left: 26, right: 26, top: 128 + i * 112, height: 100, display: "flex", alignItems: "center", padding: "0 16px", borderRadius: 16, background: hot ? "rgba(217,119,87,0.12)" : "#FFF", border: `2px solid ${hot ? C.orange : "#EFEBE4"}`, transform: `scale(${hot ? 1.02 : 1})` }}>
                <div style={{ width: 380 }}>
                  <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: CL.text, whiteSpace: "nowrap" }}>{p.d}</div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, color: C.red }}>{p.a} €</div>
                </div>
                <div style={{ width: 230, height: 84, position: "relative" }}>
                  {t > a - 0.05 ? (
                    <div style={{ position: "absolute", left: 0, top: 6, display: "flex", alignItems: "center", gap: 10, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 12, padding: "6px 12px 6px 6px", boxShadow: "0 8px 16px rgba(80,40,15,0.14)", transform: `translateX(${(1 - bp) * 380}px) rotate(${(1 - bp) * 10}deg)`, opacity: k(t, a - 0.05, 0.08) }}>
                      <div style={{ width: 44, height: 60, borderRadius: 4, background: "#FBFAF7", border: `1px solid ${CL.border}`, position: "relative" }}><span style={{ position: "absolute", right: -6, top: 8 }}><Tab i={r.tab} size={10} /></span></div>
                      <div><div style={{ fontFamily: fonts.bold, fontSize: 19, color: CL.text, whiteSpace: "nowrap" }}>Beleg {i + 1}</div><Mono text={`${r.a} €`} size={14} /></div>
                      <span style={{ marginLeft: 4 }}><CheckDot size={24} p={k(t, a + 0.25, 0.25)} /></span>
                    </div>
                  ) : <div style={{ position: "absolute", left: 0, top: 6, width: 190, height: 70, borderRadius: 12, border: `2px dashed ${CL.border}` }} />}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {t > accAt(i) - 0.02 ? <><AccPill acc={r.acc} p={ap} /><span style={{ fontFamily: fonts.medium, fontSize: 20, color: CL.sub, whiteSpace: "nowrap", opacity: ap }}>{r.accN}</span></> : <span style={{ fontFamily: MONO, fontSize: 22, color: CL.border }}>…</span>}
                </div>
              </div>
            );
          })}
        </Win>
      </div>
      {[["tanken", "TANKEN", 0], ["material", "MATERIAL", 1], ["software", "SOFTWARE", 2]].map(([key, label, tab], i) => {
        const a = hlAt[key as string];
        if (t < a - 0.1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 640 + i * 10, top: 120 + i * 0, zIndex: 30 + i, ...ps(t, a - 0.08, 14, 0.5), opacity: k(t, a - 0.08, 0.1) * (1 - k(t, (i < 2 ? hlAt[["material", "software"][i]] : 99) - 0.1, 0.12)) }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "10px 24px 10px 14px", fontFamily: MONO, fontWeight: 800, fontSize: 30, letterSpacing: "0.1em", boxShadow: "0 14px 28px rgba(0,0,0,0.3)" }}>
              <Tab i={tab as number} size={18} />{label as string}
            </span>
          </div>
        );
      })}
      <Beispiel style={{ left: 930, top: 36 }} />
      <Ring t={t} at={konto} x={900} y={300} r={240} />
      <Glint t={t} at={zahlung + 0.3} x={560} y={200} size={34} />
      <Glint t={t} at={software + 0.2} x={1000} y={420} size={34} />
    </PanelStage>
  );
};

// ================= 4. "Was fehlt, steht ganz oben auf der Liste." =================
export const SceneFehlt: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const fehlt = m("fehlt", 0.08), oben = m("oben", 0.45), liste = m("liste", 0.7);
  const rise = k(t, fehlt + 0.1, Math.max(0.35, oben - fehlt), ez);
  const OK_H = 74, MISS_H = 84;
  return (
    <PanelStage t={t} dur={dur} seed={45}>
      <div style={{ position: "absolute", left: 130, top: 30, width: 820, height: 770, transform: tilt(t, 4, -3) }}>
        <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, overflow: "hidden" }}>
          <div style={{ height: 70, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: `1.5px solid ${CL.border}`, background: "#FBFAF7" }}>
            <Logo name="claude" size={32} /><span style={{ fontFamily: fonts.bold, fontSize: 27, color: PK.ink }}>Buchungsmappe Okt.</span>
            <span style={{ marginLeft: "auto" }}><Pill text="3 OFFEN" color="#FFF" bg={C.red} size={17} dot={false} /></span>
          </div>
          {/* missing block rises from below the OK rows to the top */}
          {(() => {
            const topOk = 90 + rise * (MISSING.length * MISS_H + 40);
            const topMiss = 90 + (1 - rise) * (ROWS.length * OK_H + 20);
            return (
              <>
                {ROWS.map((r, i) => (
                  <div key={i} style={{ position: "absolute", left: 20, right: 20, top: topOk + i * OK_H, height: OK_H - 8, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", borderRadius: 12, background: "#FAF8F4", opacity: 0.55 + 0.45 * (1 - rise) }}>
                    <Tab i={r.tab} size={12} /><span style={{ fontFamily: fonts.semibold, fontSize: 23, color: CL.text, width: 300, whiteSpace: "nowrap" }}>{r.d}</span><AccPill acc={r.acc} />
                    <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 22 }}>{r.a}</span><CheckDot size={24} />
                  </div>
                ))}
                <div style={{ position: "absolute", left: 14, right: 14, top: topMiss - 8, padding: 8, borderRadius: 18, background: C.redSoft, border: `2.5px solid ${rise > 0.95 ? C.red : "rgba(210,64,58,0.35)"}`, boxShadow: rise > 0.2 && rise < 1 ? "0 30px 50px -18px rgba(160,30,25,0.45)" : "none", transform: `scale(${1 + 0.03 * Math.sin(rise * Math.PI)})` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px 8px" }}>
                    <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 20, color: "#FFF", background: C.red, borderRadius: 7, padding: "3px 10px" }}>FEHLT</span>
                    <span style={{ fontFamily: fonts.semibold, fontSize: 21, color: "#9B231E" }}>bitte nachreichen</span>
                  </div>
                  {MISSING.map((r, i) => (
                    <div key={i} style={{ height: MISS_H - 12, marginTop: 4, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", borderRadius: 12, background: "#FFF", ...ps(t, fehlt - 0.25 + i * 0.08, 8, 0.85) }}>
                      <span style={{ width: 30, height: 30, borderRadius: 8, border: `2.5px solid ${C.red}`, flexShrink: 0 }} />
                      <span style={{ fontFamily: fonts.bold, fontSize: 25, color: PK.ink, whiteSpace: "nowrap" }}>{r.d}</span>
                      <span style={{ fontFamily: fonts.medium, fontSize: 20, color: "#9B231E", whiteSpace: "nowrap" }}>{r.why}</span>
                      <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 23, color: C.red }}>{r.a} €</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
          <Sheen p={k(t, liste, 0.6)} />
        </div>
      </div>
      {t > oben - 0.1 ? <div style={{ position: "absolute", left: 40, top: 70, zIndex: 20, ...ps(t, oben - 0.08, 12, 0.5) }}><Pill text="↑ GANZ OBEN" color="#FFF" bg="#16130F" size={24} dot={false} /></div> : null}
      <Beispiel style={{ left: 960, top: 24 }} />
      <Ring t={t} at={oben} x={540} y={200} r={300} color={C.red} />
      <Glint t={t} at={liste} x={930} y={110} size={36} />
    </PanelStage>
  );
};

// ================= 5. "Mail an deinen Steuerberater. Mit der fertigen Liste und genau diesem Satz … was das ab Januar kostet." =================
export const SceneMail: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const s0 = m("s0", 0.03), liste = m("liste", 0.38), satz = m("satz", 0.5), gebo = m("gebo", 0.6), fragst = m("fragst", 0.75), januar = m("januar", 0.88), sendAt = m("send", 0.95);
  const seg1 = "Sehr geehrte Frau Berger,\nab Januar bekommen Sie jeden Monat die fertige Buchungsmappe.";
  const t1 = typed(seg1, t, s0 + 0.1, liste - 0.2);
  const q1 = "Was kostet die Buchhaltung ";
  const tq = typed(q1, t, fragst - 0.05, januar - 0.08);
  const sent = t > sendAt + 0.05;
  const scroll = interpolate(t, [fragst - 0.3, fragst + 0.2], [0, 70], { ...clamp, easing: ez });
  return (
    <PanelStage t={t} dur={dur} seed={46}>
      <div style={{ position: "absolute", left: 40, top: 26, width: 1000, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Mail an deinen Steuerberater" crumb="Buchungsmappe" style={{ inset: 0 }} right={<span style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1.5px solid ${CL.border}`, borderRadius: 12, padding: "6px 14px", fontFamily: fonts.semibold, fontSize: 20, color: CL.sub }}><Ico d={I2.copy} size={22} color={CL.sub} />Kopieren</span>}>
          <div style={{ position: "absolute", left: 34, right: 34, top: 18 - scroll, bottom: 110, overflow: "visible" }}>
            {[["An", "Kanzlei Berger · Steuerberatung"], ["Betreff", "Vorkontierte Belege ab Januar"]].map(([l, v], i) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 0", borderBottom: `1.5px solid ${CL.border}`, ...ps(t, -0.2 + i * 0.1, 8, 0.9) }}>
                <span style={{ width: 120, fontFamily: fonts.medium, fontSize: 25, color: CL.sub }}>{l}</span>
                <span style={{ fontFamily: fonts.semibold, fontSize: 27, color: CL.text }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 18, fontFamily: fonts.medium, fontSize: 30, color: CL.text, lineHeight: 1.45, whiteSpace: "pre-wrap", minHeight: 90 }}>{t1}</div>
            {t > liste - 0.1 ? (
              <div style={{ marginTop: 12, ...ps(t, liste - 0.08, 14, 0.6) }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 14, padding: "8px 16px 8px 8px", boxShadow: "0 6px 14px rgba(0,0,0,0.06)" }}>
                  <div style={{ width: 44, height: 52, borderRadius: 8, background: C.green, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 13, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6, boxSizing: "border-box" }}>XLSX</div>
                  <div><div style={{ fontFamily: fonts.bold, fontSize: 23, color: CL.text }}>Buchungsmappe_2026-10.xlsx</div><Mono text="37 BELEGE · SKR03 · FERTIGE LISTE" size={14} /></div>
                  <CheckDot size={28} p={k(t, liste + 0.15, 0.3)} />
                </div>
              </div>
            ) : null}
            {t > satz - 0.15 ? (
              <div style={{ marginTop: 16, position: "relative", padding: "14px 20px 14px 24px", borderLeft: `6px solid ${C.green}`, background: t > gebo ? "rgba(30,158,87,0.10)" : "#F6F3EC", borderRadius: "0 14px 14px 0", ...ps(t, satz - 0.12, 12, 0.7) }}>
                <div style={{ fontFamily: SERIF, fontSize: 29, color: PK.ink, lineHeight: 1.3 }}>
                  „Nach <b>§ 33 Abs. 3 StBVV</b> sieht die Gebührenordnung bei vom Mandanten kontierten Belegen <span style={{ position: "relative" }}><Highlight p={k(t, gebo, 0.4)} color="rgba(30,158,87,0.25)" /><b style={{ position: "relative" }}>1/10 bis 6/10</b></span> vor statt 2/10 bis 12/10.“
                </div>
              </div>
            ) : null}
            {t > fragst - 0.1 ? (
              <div style={{ marginTop: 18, fontFamily: fonts.medium, fontSize: 32, color: CL.text }}>
                {tq}{t > januar - 0.08 ? <span style={{ position: "relative", display: "inline-block", fontFamily: fonts.bold, color: "#FFF", padding: "0 10px", transform: `scale(${0.7 + 0.3 * pop(t, januar - 0.06, 0.35)})` }}><span style={{ position: "absolute", inset: "2px 0 0", background: C.orange, borderRadius: 10 }} /><span style={{ position: "relative" }}>ab Januar?</span></span> : null}
                {!sent ? <span style={{ display: "inline-block", width: 3, height: 34, background: C.orange, marginLeft: 3, verticalAlign: "middle" }} /> : null}
              </div>
            ) : null}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 100, background: "linear-gradient(180deg, rgba(250,249,245,0), #FAF9F5 40%)" }} />
          <div style={{ position: "absolute", right: 34, bottom: 26, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: sent ? C.green : CL.send, color: "#FFF", borderRadius: 16, padding: "14px 28px", fontFamily: fonts.bold, fontSize: 29, transform: `scale(${t > sendAt && t < sendAt + 0.12 ? 0.9 : 1})`, boxShadow: "0 14px 28px rgba(120,50,25,0.25)" }}>
              {sent ? <CheckDot size={32} color="rgba(255,255,255,0.25)" /> : <Ico d={I2.send} size={26} color="#FFF" sw={2.2} />}{sent ? "Gesendet" : "Senden"}
            </span>
          </div>
          <div style={{ position: "absolute", left: 34, bottom: 36, display: "flex", alignItems: "center", gap: 10, opacity: k(t, s0 + 0.2, 0.2) }}><Logo name="claude" size={28} /><span style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub }}>Entwurf von Claude</span></div>
        </Win>
      </div>
      <Pointer t={t} path={[{ x: 700, y: 870, at: 0 }, { x: 760, y: 760, at: sendAt - 0.45 }, { x: 905, y: 718, at: sendAt, click: true }, { x: 960, y: 800, at: sendAt + 0.6 }]} size={56} />
      <Ring t={t} at={gebo} x={420} y={520} r={260} color={C.green} />
      <Ring t={t} at={sendAt + 0.05} x={890} y={718} r={200} color={C.green} />
      <Glint t={t} at={liste + 0.2} x={640} y={330} size={34} />
      <Glint t={t} at={januar + 0.2} x={760} y={600} size={34} />
    </PanelStage>
  );
};

// ================= 6. "Das Buchen bleibt bei ihm. Die Sortierarbeit nicht." =================
export const SceneSplit: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const buchen = m("buchen", 0.1), ihm = m("ihm", 0.35), sort = m("sort", 0.55), nicht = m("nicht", 0.8);
  const fly = k(t, sort - 0.05, 0.45, ez);
  const CARD = (x: number, title: string, sub: string, icon: React.ReactNode, a: number, hl: boolean) => (
    <div style={{ position: "absolute", left: x, top: 150, width: 460, height: 560, transform: tilt(t + x, 4, x < 500 ? 6 : -6), ...ps(t, a, 20, 0.85) }}>
      <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 30, boxShadow: paperShadow, border: `${hl ? 3 : 1.5}px solid ${hl ? C.orange : CL.border}`, padding: "28px 30px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>{icon}<div><div style={{ fontFamily: fonts.bold, fontSize: 34, color: PK.ink }}>{title}</div><Mono text={sub} size={16} /></div></div>
      </div>
    </div>
  );
  const Item: React.FC<{ txt: string; a: number; x: number; y: number; strike?: number }> = ({ txt, a, x, y, strike = 0 }) => (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 10, display: "flex", alignItems: "center", gap: 14, background: "#FAF8F4", borderRadius: 16, padding: "14px 20px", width: 390, boxSizing: "border-box", ...ps(t, a, 12, 0.7) }}>
      <CheckDot size={34} p={k(t, a + 0.15, 0.3)} />
      <span style={{ position: "relative", fontFamily: fonts.bold, fontSize: 30, color: PK.ink, whiteSpace: "nowrap" }}>{txt}</span>
    </div>
  );
  return (
    <PanelStage t={t} dur={dur} seed={47}>
      {CARD(50, "Steuerberater", "KANZLEI", <div style={{ width: 64, height: 64, borderRadius: 18, background: "#2A3A5C", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.calc} size={34} color="#FFF" sw={2} /></div>, -0.2, false)}
      {CARD(570, "Du + Claude", "BUCHUNGSMAPPE", <div style={{ width: 64, height: 64, borderRadius: 18, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Logo name="claude" size={40} /></div>, -0.1, t > nicht)}
      <Item txt="Buchen" a={buchen - 0.08} x={85} y={290} />
      <Item txt="Prüfen" a={ihm - 0.15} x={85} y={384} />
      <Item txt="Verantworten" a={ihm} x={85} y={478} />
      {/* "Sortieren" starts in the advisor card and flies over to Claude */}
      {t > sort - 0.35 ? (
        <div style={{ position: "absolute", left: 85 + fly * 520, top: 572 - fly * 282 - Math.sin(fly * Math.PI) * 120, zIndex: 12, display: "flex", alignItems: "center", gap: 14, background: fly > 0.95 ? "rgba(217,119,87,0.14)" : C.redSoft, borderRadius: 16, padding: "14px 20px", width: 390, boxSizing: "border-box", transform: `rotate(${Math.sin(fly * Math.PI) * -6}deg) scale(${1 + 0.08 * Math.sin(fly * Math.PI)})`, boxShadow: fly > 0 && fly < 1 ? "0 24px 40px -14px rgba(120,50,25,0.45)" : "none", ...ps(t, sort - 0.33, 10, 0.7) }}>
          <span style={{ width: 34, height: 34, borderRadius: "50%", background: fly > 0.95 ? C.orange : C.red, color: "#FFF", fontFamily: fonts.bold, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{fly > 0.95 ? "✓" : "→"}</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 30, color: PK.ink, whiteSpace: "nowrap" }}>Sortierarbeit</span>
          {t > nicht ? <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 18, color: PK.orangeDeep, ...ps(t, nicht, 6, 0.6) }}>10 MIN</span> : null}
        </div>
      ) : null}
      <Ring t={t} at={sort + 0.4} x={830} y={310} r={220} />
      <Glint t={t} at={nicht} x={1000} y={200} size={40} />
    </PanelStage>
  );
};

// ================= 7. guide background (PDF scroll sits on top) =================
export const SceneGuideBg: React.FC<SceneP> = ({ t, dur }) => (
  <PanelStage t={t} dur={dur} seed={48}>
    <Glint t={t} at={0.4} x={110} y={200} size={34} />
  </PanelStage>
);

export { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, Pill, PK, InkStamp };
