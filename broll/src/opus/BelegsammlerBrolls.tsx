import React from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";
import { fonts } from "../theme";
import { PK, paperShadow, Highlight, Sheen, InkStamp } from "./PremiumKit";
import { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, tilt, Logo, Mono, Pill, CheckDot, Ico, Glint, Ring, Pointer, PanelStage, Odometer } from "./DuetBrolls";
import { Win, Beispiel, I2, TopTag, PdfIcon, Composer } from "./KontoBrolls";
import { FolderInvoices3D, FI_N } from "./BelegsammlerObjects3D";
import { BL } from "./belegLogos";

// FP-N "Belegsammler" (2026-10-31) - split-panel scenes (1080 x 820), pure functions of (t, dur, at);
// BelegsammlerOpus anchors `at` to captions.json word times. All firms, files and amounts are invented (BEISPIEL).
// Logos: official marks (Simple Icons CC0 / public/logos), never self-drawn.

export type SceneP = { t: number; dur: number; at?: Record<string, number> };
const mk = (dur: number, at: Record<string, number> | undefined) => (name: string, frac: number) => (at && at[name] !== undefined ? at[name] : frac * dur);
const ez = Easing.inOut(Easing.cubic);

// ---------- brand marks ----------
type Brand = "gmail" | "amazon" | "paypal" | "uber";
const MARK_BG: Record<Brand, string> = { gmail: "#FFFFFF", amazon: "#232F3E", paypal: "#FFFFFF", uber: "#000000" };
export const Mark: React.FC<{ b: Brand; size: number; tile?: boolean; style?: React.CSSProperties }> = ({ b, size, tile = true, style }) => {
  const inner = b === "gmail"
    ? <svg width={size * 0.62} height={size * 0.62} viewBox={BL.gmail.viewBox.join(" ")}>{BL.gmail.paths.map((p, i) => <path key={i} d={p.d} fill={p.fill} />)}</svg>
    : <svg width={size * (b === "uber" ? 0.66 : 0.58)} height={size * (b === "uber" ? 0.66 : 0.58)} viewBox="0 0 24 24"><path d={BL[b].d} fill={b === "amazon" ? "#FF9900" : b === "uber" ? "#FFFFFF" : BL[b].hex} /></svg>;
  if (!tile) return inner;
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.24, background: MARK_BG[b], border: MARK_BG[b] === "#FFFFFF" ? `1.5px solid ${CL.border}` : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 8px 18px -8px rgba(60,35,15,0.45)", ...style }}>{inner}</div>
  );
};
const Word: React.FC<{ b: "amazon" | "paypal" | "uber"; h: number }> = ({ b, h }) => (
  b === "uber" ? <Img src={staticFile("logos/uber.png")} style={{ height: h * 0.8, width: "auto" }} />
    : <Img src={staticFile(`logos/${b}.svg`)} style={{ height: h, width: "auto" }} />
);

// clock helper: seconds → m:ss
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// ================= 0. HOOK: 3D tiles shoot invoices into the box | advisor stopwatch 150 €/Std | Claude result =================
export const HOOK_FLY = (end: number) => {
  // 5 invoices already filed on frame 0, 2 in flight on frame 0, the rest during the hook
  const pre = [-3, -2.6, -2.2, -1.8, -1.4, -0.32, -0.12];
  const rest = Array.from({ length: FI_N - pre.length }, (_, i) => 0.5 + (i * (end - 1.2)) / (FI_N - pre.length - 1));
  return [...pre, ...rest];
};
export const HookBeleg: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const steuer = m("steuer", 0.2), zeit = m("zeit", 0.32), hundert = m("hundert", 0.4), stunde = m("stunde", 0.52);
  const amazon = m("amazon", 0.7), paypal = m("paypal", 0.76), uber = m("uber", 0.82), postfach = m("postfach", 0.92);
  const flyAt = HOOK_FLY(dur);
  const nIn = flyAt.filter((a) => t > a + 0.55).length;
  // stopwatch runs from "Zeit" (fast), € at 150 €/h (BEISPIEL)
  const secs = interpolate(t, [zeit - 0.1, dur], [0, 47 * 60], { ...clamp, easing: Easing.in(Easing.quad) });
  const eur = (secs / 3600) * 150;
  const rateP = k(t, hundert - 0.08, 0.3);
  const LIST = { x: 650, y: 520, w: 400, h: 270 };
  return (
    <PanelStage t={t} dur={dur} seed={51}>
      <div style={{ position: "absolute", left: -30, top: 175, width: 690, height: 690 }}>
        <FolderInvoices3D t={t} w={690} h={690} flyAt={flyAt} pulse={[postfach, amazon, paypal, uber]} />
      </div>
      <Beispiel style={{ left: 30, top: 238 }} />
      {/* advisor stopwatch: Belegsuche nach Zeit */}
      <div style={{ position: "absolute", left: 650, top: 236, width: 400, zIndex: 22, transform: `${tilt(t, 3, -7)} scale(${1 + 0.06 * pop(t, hundert - 0.06, 0.3) * (1 - k(t, stunde + 0.3, 0.3))})`, ...ps(t, -0.3, 10, 0.9) }}>
        <div style={{ background: "#FFF", borderRadius: 24, boxShadow: paperShadow, border: `2px solid ${t > steuer ? C.red : CL.border}`, padding: "18px 22px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "#2A3A5C", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.calc} size={30} color="#FFF" sw={2} /></div>
            <div><Mono text="STEUERBERATER" size={16} color={C.red} /><div style={{ fontFamily: fonts.bold, fontSize: 26, color: PK.ink, whiteSpace: "nowrap" }}>Belege suchen</div></div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 12 }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 50, color: PK.ink, fontVariantNumeric: "tabular-nums" }}>{mmss(secs)}</span>
            <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: CL.sub }}>Std.</span>
            <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: C.red, opacity: t > zeit && Math.floor(t * 3) % 2 === 0 ? 1 : 0.25 }} />
              <Mono text="LÄUFT" size={14} color={C.red} />
            </span>
          </div>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ position: "relative", display: "inline-flex", alignItems: "center", fontFamily: fonts.bold, fontSize: 34, color: "#FFF", background: C.red, borderRadius: 12, padding: "4px 14px", transform: `scale(${0.7 + 0.3 * rateP})`, opacity: rateP, transformOrigin: "0% 50%" }}>150 €/Std</span>
            <Odometer value={eur} size={34} color={C.red} speed={t > zeit && t < dur ? 0.6 : 0} suffix=" €" />
          </div>
          <Sheen p={k(t, hundert, 0.6)} />
        </div>
      </div>
      {/* Claude result: the filled folder */}
      <div style={{ position: "absolute", left: LIST.x, top: LIST.y, width: LIST.w, height: LIST.h, transform: tilt(t, 4, -7), zIndex: 21 }}>
        <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 24, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, overflow: "hidden" }}>
          <div style={{ height: 58, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderBottom: `1.5px solid ${CL.border}`, background: "#FBFAF7" }}>
            <Logo name="claude" size={28} />
            <span style={{ fontFamily: fonts.bold, fontSize: 23, color: PK.ink, whiteSpace: "nowrap" }}>Belege Okt.</span>
            <span style={{ marginLeft: "auto" }}><Pill text={`${Math.min(34, 22 + nIn)} PDFs`} color={C.green} bg={C.greenSoft} size={16} dot={false} /></span>
          </div>
          {[["2026-10-03_Amazon_89,90", "amazon"], ["2026-10-07_Uber_23,40", "uber"], ["2026-10-09_Shop_134,00", "paypal"], ["2026-10-12_Telekom_59,95", "gmail"]].map(([f, b], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, height: 50, padding: "0 16px", borderTop: i ? "1px solid #EFEBE4" : "none" }}>
              <Mark b={b as Brand} size={30} />
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16.5, color: CL.text, whiteSpace: "nowrap" }}>{f}.pdf</span>
              <span style={{ marginLeft: "auto" }}><CheckDot size={22} /></span>
            </div>
          ))}
        </div>
      </div>
      <Ring t={t} at={hundert - 0.04} x={850} y={420} r={230} color={C.red} />
      <Ring t={t} at={postfach + 0.1} x={300} y={520} r={260} />
      <Glint t={t} at={stunde + 0.1} x={1010} y={300} size={36} />
      <Glint t={t} at={amazon} x={140} y={330} size={30} />
      <Glint t={t} at={uber} x={520} y={330} size={30} />
    </PanelStage>
  );
};

// ================= 1. "Folg mir, wenn du keins meiner Systeme mehr verpassen willst." =================
export const SceneFollow: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const mir = m("mir", 0.08), systeme = m("systeme", 0.45), verpassen = m("verpassen", 0.7);
  const followed = t > mir + 0.28;
  const SYS = [
    { n: "Buchungsmappe", s: "Belege sortiert", ic: I2.layers },
    { n: "Gebührencheck", s: "Kontoauszug geprüft", ic: I2.card },
    { n: "Belegsammler", s: "NEU", ic: I2.folder, hot: true },
  ];
  return (
    <PanelStage t={t} dur={dur} seed={52}>
      <div style={{ position: "absolute", left: 140, top: 70, width: 800, ...ps(t, -0.25, 20, 0.85), transform: tilt(t, 3, 0) }}>
        <div style={{ background: "#FFF", borderRadius: 30, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, padding: "26px 30px", display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: `conic-gradient(${C.orange}, #F2B24C, ${C.orange})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 86, height: 86, borderRadius: "50%", background: PK.ink, color: "#FFF", fontFamily: fonts.bold, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>FP</div>
          </div>
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 36, color: PK.ink }}>@florent_preusser</div>
            <Mono text="SYSTEME FÜR UNTERNEHMER" size={17} />
          </div>
          <div style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: followed ? C.green : "#3E8EF7", borderRadius: 16, padding: "14px 30px", transform: `scale(${t > mir + 0.22 && t < mir + 0.34 ? 0.9 : 1})`, whiteSpace: "nowrap" }}>{followed ? "Gefolgt ✓" : "Folgen"}</div>
        </div>
      </div>
      {SYS.map((s, i) => {
        const a = systeme - 0.25 + i * 0.16;
        return (
          <div key={i} style={{ position: "absolute", left: 70 + i * 320, top: 330, width: 300, zIndex: 5, ...ps(t, a, 26, 0.7), transform: `${(ps(t, a, 26, 0.7).transform as string) ?? ""} rotate(${(i - 1) * 3}deg)` }}>
            <div style={{ background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `${s.hot ? 3 : 1.5}px solid ${s.hot ? C.orange : CL.border}`, padding: "24px 22px", height: 300, boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
              <div style={{ width: 70, height: 70, borderRadius: 20, background: s.hot ? C.orange : C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={s.ic} size={38} color={s.hot ? "#FFF" : PK.orangeDeep} sw={2} /></div>
              <div style={{ fontFamily: fonts.bold, fontSize: 32, color: PK.ink, marginTop: 22 }}>{s.n}</div>
              <div style={{ marginTop: 8 }}>{s.hot ? <Pill text="NEU" color="#FFF" bg={C.orange} size={18} dot={false} /> : <Mono text={s.s.toUpperCase()} size={15} />}</div>
              <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, display: "flex", alignItems: "center", gap: 8 }}><Logo name="claude" size={24} /><span style={{ fontFamily: fonts.medium, fontSize: 20, color: CL.sub }}>in Claude</span></div>
              {s.hot ? <Sheen p={k(t, a + 0.3, 0.6)} /> : null}
            </div>
          </div>
        );
      })}
      {/* bell: don't miss the next system */}
      {t > verpassen - 0.15 ? (
        <div style={{ position: "absolute", left: 830, top: 650, zIndex: 20, display: "flex", alignItems: "center", gap: 10, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "10px 22px 10px 12px", fontFamily: fonts.bold, fontSize: 24, ...ps(t, verpassen - 0.12, 12, 0.6), transform: `${(ps(t, verpassen - 0.12, 12, 0.6).transform as string) ?? ""} rotate(${Math.sin((t - verpassen) * 30) * 8 * Math.max(0, 1 - (t - verpassen) / 0.5)}deg)` }}>
          <span style={{ width: 40, height: 40, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15zM10 20.5a2 2 0 004 0" size={24} color="#FFF" sw={2} /></span>
          nichts verpassen
        </div>
      ) : null}
      <Pointer t={t} path={[{ x: 600, y: 760, at: 0 }, { x: 860, y: 140, at: mir + 0.24, click: true }, { x: 900, y: 460, at: systeme + 0.6 }]} size={56} />
      <Ring t={t} at={mir + 0.26} x={860} y={135} r={160} color={C.green} />
      <Glint t={t} at={systeme + 0.35} x={960} y={350} size={36} />
    </PanelStage>
  );
};

// ================= 2. "Denn dafür habe ich ein komplettes System entwickelt: den Belegsammler in Claude." =================
export const SceneSystem: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const mods = [m("m1", 0.1), m("m2", 0.3), m("m3", 0.42), m("m4", 0.55)];
  const title = m("title", 0.62), claude = m("claude", 0.9);
  const MODS: { x: number; y: number; logo: React.ReactNode; h: string; s: string; from: [number, number] }[] = [
    { x: 40, y: 96, logo: <Mark b="gmail" size={60} />, h: "Postfach", s: "jede Rechnung", from: [-300, -80] },
    { x: 780, y: 96, logo: <div style={{ display: "flex" }}><Mark b="amazon" size={44} /><Mark b="paypal" size={44} style={{ marginLeft: -14 }} /><Mark b="uber" size={44} style={{ marginLeft: -14 }} /></div>, h: "Konten", s: "im Browser", from: [300, -80] },
    { x: 40, y: 590, logo: <div style={{ width: 60, height: 60, borderRadius: 16, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.folder} size={32} color={PK.orangeDeep} sw={2} /></div>, h: "Ordner", s: "sauber benannt", from: [-300, 80] },
    { x: 780, y: 590, logo: <div style={{ width: 60, height: 60, borderRadius: 16, background: C.redSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.list} size={32} color={C.red} sw={2} /></div>, h: "Fehlt-Liste", s: "was noch fehlt", from: [300, 80] },
  ];
  const CARD = { x: 290, y: 255, w: 500, h: 300 };
  const anchors = [[CARD.x, CARD.y + 50], [CARD.x + CARD.w, CARD.y + 50], [CARD.x, CARD.y + CARD.h - 50], [CARD.x + CARD.w, CARD.y + CARD.h - 50]];
  const tileC = (i: number) => [MODS[i].x + (i % 2 === 0 ? 260 : 0), MODS[i].y + 50];
  return (
    <PanelStage t={t} dur={dur} seed={53}>
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
            <Mono text="MEIN SYSTEM" size={18} />
            {t > claude - 0.05 ? <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: CL.bubble, borderRadius: 999, padding: "5px 14px 5px 8px", fontFamily: fonts.semibold, fontSize: 22, color: CL.text, ...ps(t, claude, 8, 0.5) }}><Logo name="claude" size={26} />in Claude</span> : null}
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 60, color: PK.ink, marginTop: 18, lineHeight: 1, minHeight: 60, whiteSpace: "nowrap" }}>
            {typed("Belegsammler", t, title - 0.15, title + 0.45) || <span style={{ color: CL.border }}>Belegsammler</span>}
          </div>
          <div style={{ fontFamily: fonts.medium, fontSize: 25, color: CL.sub, marginTop: 16 }}>Jede Rechnung in einem Ordner</div>
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
              {md.logo}
              <div>
                <div style={{ fontFamily: fonts.bold, fontSize: 28, color: PK.ink, whiteSpace: "nowrap" }}>{md.h}</div>
                <div style={{ fontFamily: fonts.medium, fontSize: 19, color: CL.sub, whiteSpace: "nowrap" }}>{md.s}</div>
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

// ================= 3. "Claude geht durch dein Postfach und findet jede Rechnung vom letzten Monat." =================
const MAILS = [
  { b: "amazon" as Brand, from: "Amazon.de", sub: "Ihre Rechnung zu Bestellung 302-…", pdf: true },
  { b: "gmail" as Brand, from: "Telekom", sub: "Ihre Mobilfunk-Rechnung Oktober", pdf: true },
  { b: "paypal" as Brand, from: "PayPal", sub: "Sie haben eine Zahlung gesendet", pdf: false },
  { b: "uber" as Brand, from: "Uber", sub: "Deine Fahrt am Dienstag", pdf: false },
  { b: "gmail" as Brand, from: "Adobe", sub: "Invoice Creative Cloud 10/2026", pdf: true },
];
export const ScenePostfach: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const geht = m("geht", 0.1), postfach = m("postfach", 0.3), findet = m("findet", 0.45), rechnung = m("rechnung", 0.6), letzten = m("letzten", 0.75), monat = m("monat", 0.85);
  const rowAt = (i: number) => findet - 0.1 + i * Math.max(0.1, (letzten - findet + 0.2) / MAILS.length);
  const found = Math.round(interpolate(t, [findet, monat + 0.4], [0, 23], clamp));
  return (
    <PanelStage t={t} dur={dur} seed={54}>
      <div style={{ position: "absolute", left: 30, top: 26, width: 1020, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Belegsammler" style={{ inset: 0 }} right={<Pill text="GMAIL VERBUNDEN" color={C.green} bg={C.greenSoft} size={16} />}>
          {/* user message */}
          <div style={{ position: "absolute", right: 28, top: 22, maxWidth: 560, background: CL.bubble, borderRadius: 22, padding: "14px 22px", fontFamily: fonts.medium, fontSize: 27, color: CL.text, ...ps(t, -0.2, 10, 0.8) }}>Sammel alle Belege vom Oktober.</div>
          {/* tool call: Gmail search */}
          <div style={{ position: "absolute", left: 26, right: 26, top: 104, display: "flex", alignItems: "center", gap: 14, background: "#FFF", border: `1.5px solid ${t > postfach ? C.orange : CL.border}`, borderRadius: 18, padding: "12px 18px", ...ps(t, geht - 0.1, 10, 0.7) }}>
            <Mark b="gmail" size={46} />
            <div style={{ minWidth: 0 }}>
              <Mono text="GMAIL · SUCHE" size={14} />
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, color: CL.text, whiteSpace: "nowrap" }}>{typed("Rechnung OR Invoice OR Beleg has:attachment", t, postfach - 0.1, findet + 0.1)}</div>
            </div>
            <span style={{ marginLeft: "auto", position: "relative" }}>
              <span style={{ position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 20, color: t > letzten ? "#FFF" : PK.orangeDeep, background: t > letzten ? C.orange : C.orangeSoft, borderRadius: 10, padding: "6px 12px", whiteSpace: "nowrap" }}>01.–31.10.2026</span>
            </span>
          </div>
          {/* results */}
          <div style={{ position: "absolute", left: 26, right: 26, top: 200, background: "#FFF", borderRadius: 20, border: `1.5px solid ${CL.border}`, overflow: "hidden" }}>
            {MAILS.map((r, i) => {
              const a = rowAt(i);
              const hit = t > a + 0.2;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, height: 84, padding: "0 18px", borderTop: i ? "1px solid #EFEBE4" : "none", background: hit ? (r.pdf ? "rgba(30,158,87,0.06)" : "rgba(217,119,87,0.07)") : "#FFF", ...ps(t, a, 8, 0.85) }}>
                  <Mark b={r.b} size={50} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontFamily: fonts.bold, fontSize: 24, color: CL.text }}>{r.from}</div>
                    <div style={{ fontFamily: fonts.medium, fontSize: 21, color: CL.sub, whiteSpace: "nowrap", overflow: "hidden" }}>{r.sub}</div>
                  </div>
                  {r.pdf ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><PdfIcon size={36} /><CheckDot size={30} p={k(t, a + 0.2, 0.3)} /></span>
                    : hit ? <Pill text="NUR IM KONTO" color={PK.orangeDeep} bg={C.orangeSoft} size={15} dot={false} style={{ ...ps(t, a + 0.2, 6, 0.6) }} /> : null}
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 26, bottom: 22, display: "flex", alignItems: "center", gap: 12, ...ps(t, findet, 8, 0.7) }}>
            <Logo name="claude" size={34} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: CL.text }}><span style={{ fontFamily: MONO, fontWeight: 800, color: C.green }}>{found}</span> Rechnungen gefunden</span>
          </div>
        </Win>
      </div>
      <Beispiel style={{ right: 50, bottom: 40 }} />
      <Ring t={t} at={rechnung} x={520} y={420} r={300} />
      <Glint t={t} at={monat + 0.2} x={940} y={150} size={36} />
    </PanelStage>
  );
};

// ================= 4. "Dann öffnet Claude im Browser deine Konten bei Amazon, PayPal und Uber und lädt jede Rechnung runter, die nie per Mail kam." =================
const PORTAL: Record<"amazon" | "paypal" | "uber", { url: string; head: string; rows: [string, string][]; btn: string; bg: string }> = {
  amazon: { url: "amazon.de/your-orders", head: "Meine Bestellungen", rows: [["14. Oktober 2026", "212,49 €"], ["3. Oktober 2026", "89,90 €"], ["25. Oktober 2026", "64,99 €"]], btn: "Rechnung", bg: "#FFFFFF" },
  paypal: { url: "paypal.com/myaccount/activities", head: "Aktivitäten", rows: [["22. Okt. · Shop", "−48,00 €"], ["9. Okt. · Shop", "−134,00 €"], ["2. Okt. · Software", "−19,99 €"]], btn: "Rechnung", bg: "#F5F7FA" },
  uber: { url: "riders.uber.com/trips", head: "Meine Fahrten", rows: [["28. Okt. · Flughafen", "18,70 €"], ["18. Okt. · Kunde Weber", "31,10 €"], ["7. Okt. · Bahnhof", "23,40 €"]], btn: "Beleg", bg: "#FFFFFF" },
};
const DL_FILES = ["Amazon_Rechnung_302.pdf", "Amazon_Rechnung_118.pdf", "Shop_Rechnung_9.pdf", "Uber_Beleg_1028.pdf", "Uber_Beleg_1018.pdf", "Amazon_Rechnung_771.pdf", "Uber_Beleg_1007.pdf", "Shop_Rechnung_22.pdf"];
export const SceneBrowser: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const oeffnet = m("oeffnet", 0.05), browser = m("browser", 0.18), amazon = m("amazon", 0.38), paypal = m("paypal", 0.47), uber = m("uber", 0.55);
  const laedt = m("laedt", 0.62), runter = m("runter", 0.72), nie = m("nie", 0.82), kam = m("kam", 0.95);
  const tab: "amazon" | "paypal" | "uber" = t < paypal - 0.05 ? "amazon" : t < uber - 0.05 ? "paypal" : "uber";
  const tabAt = tab === "amazon" ? oeffnet + 0.1 : tab === "paypal" ? paypal - 0.05 : uber - 0.05;
  const P = PORTAL[tab];
  const open = k(t, oeffnet - 0.15, 0.4, ez);
  // downloads: during "lädt jede Rechnung runter"
  const dlAt = DL_FILES.map((_, i) => (i < 2 ? browser + 0.5 + i * 0.4 : laedt - 0.1 + (i - 2) * Math.max(0.1, (nie - laedt) / 6)));
  const nDl = dlAt.filter((a) => t > a + 0.3).length;
  const SIDE = 330;
  const btnY = (i: number) => 288 + i * 112;
  return (
    <PanelStage t={t} dur={dur} seed={55}>
      <div style={{ position: "absolute", left: 24, top: 24, width: 1032, height: 776, transform: `${tilt(t, 4, 0)} scale(${0.9 + 0.1 * open})`, opacity: open, transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden", background: "#FFF", boxShadow: paperShadow, border: `1px solid ${CL.border}` }}>
          {/* chrome tab strip */}
          <div style={{ height: 58, background: "#E8EAED", display: "flex", alignItems: "flex-end", padding: "0 14px", gap: 6 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", alignSelf: "center", marginRight: 10 }}>{["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />)}</div>
            {(["amazon", "paypal", "uber"] as const).map((b, i) => {
              const a = [oeffnet + 0.3, paypal, uber][i] - 0.25;
              if (t < a && i > 0) return null;
              const act = b === tab;
              return (
                <div key={b} style={{ height: 46, width: 200, borderRadius: "14px 14px 0 0", background: act ? "#FFF" : "transparent", display: "flex", alignItems: "center", gap: 10, padding: "0 14px", ...ps(t, a, 6, 0.8) }}>
                  <Mark b={b} size={26} />
                  <span style={{ fontFamily: fonts.medium, fontSize: 19, color: act ? CL.text : CL.sub, whiteSpace: "nowrap" }}>{b === "amazon" ? "Bestellungen" : b === "paypal" ? "Aktivitäten" : "Fahrten"}</span>
                </div>
              );
            })}
            <div style={{ marginLeft: "auto", alignSelf: "center", position: "relative", width: 46, height: 40, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.18 * dlAt.reduce((mm, a) => Math.max(mm, Math.max(0, 1 - Math.abs(t - a - 0.3) / 0.12)), 0)})` }}>
              <Ico d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" size={28} color={nDl ? C.orange : CL.sub} sw={2.2} />
              {nDl ? <span style={{ position: "absolute", right: -6, top: -6, minWidth: 24, height: 24, borderRadius: 12, background: C.orange, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>{nDl}</span> : null}
            </div>
          </div>
          {/* url bar */}
          <div style={{ height: 52, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", borderBottom: `1px solid ${CL.border}` }}>
            <div style={{ flex: 1, marginRight: SIDE - 20, height: 36, borderRadius: 18, background: "#F1F3F4", display: "flex", alignItems: "center", padding: "0 16px", fontFamily: fonts.medium, fontSize: 19, color: "#3C4043", whiteSpace: "nowrap", overflow: "hidden" }}>🔒&nbsp;{typed(P.url, t, tabAt, tabAt + 0.25)}</div>
          </div>
          {/* page */}
          <div style={{ position: "absolute", left: 0, top: 110, bottom: 0, right: SIDE, background: P.bg, overflow: "hidden" }}>
            <div key={tab} style={{ padding: "22px 28px", ...ps(t, tabAt, 12, 0.94) }}>
              <div style={{ height: 50, display: "flex", alignItems: "center" }}><Word b={tab} h={tab === "paypal" ? 40 : 44} /></div>
              <div style={{ fontFamily: fonts.bold, fontSize: 30, color: CL.text, marginTop: 14 }}>{P.head}</div>
              {P.rows.map(([d, a], i) => (
                <div key={i} style={{ marginTop: 14, height: 96, borderRadius: 16, border: `1.5px solid ${CL.border}`, background: "#FFF", display: "flex", alignItems: "center", padding: "0 18px", gap: 14 }}>
                  <div><div style={{ fontFamily: fonts.semibold, fontSize: 22, color: CL.text, whiteSpace: "nowrap" }}>{d}</div><div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: CL.sub }}>{a}</div></div>
                  <span style={{ marginLeft: "auto", fontFamily: fonts.semibold, fontSize: 20, color: tab === "amazon" ? "#0F1111" : "#FFF", background: tab === "amazon" ? "#FFD814" : tab === "paypal" ? "#0070E0" : "#000", borderRadius: 999, padding: "10px 20px", whiteSpace: "nowrap" }}>{P.btn} ↓</span>
                </div>
              ))}
            </div>
          </div>
          {/* Claude in Chrome side panel */}
          <div style={{ position: "absolute", right: 0, top: 110, bottom: 0, width: SIDE, background: CL.page, borderLeft: `1px solid ${CL.border}`, padding: "18px 18px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Logo name="claude" size={30} /><span style={{ fontFamily: fonts.bold, fontSize: 22, color: CL.text }}>Claude</span><span style={{ marginLeft: "auto" }}><Pill text="CHROME" color={PK.orangeDeep} bg={C.orangeSoft} size={13} dot={false} /></span></div>
            {[
              { b: "amazon" as const, a: oeffnet + 0.3, n: 3 },
              { b: "paypal" as const, a: paypal, n: 2 },
              { b: "uber" as const, a: uber, n: 3 },
            ].map((s, i) => {
              const done = t > (i < 2 ? [paypal, uber][i] - 0.1 : nie);
              return t > s.a - 0.2 ? (
                <div key={i} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, background: "#FFF", border: `1.5px solid ${done ? "rgba(30,158,87,0.4)" : C.orange}`, borderRadius: 14, padding: "10px 12px", ...ps(t, s.a - 0.2, 8, 0.7) }}>
                  <Mark b={s.b} size={34} />
                  <span style={{ fontFamily: fonts.semibold, fontSize: 19, color: CL.text, whiteSpace: "nowrap" }}>{done ? `${s.n} Rechnungen` : "lädt …"}</span>
                  <span style={{ marginLeft: "auto" }}>{done ? <CheckDot size={24} /> : <span style={{ width: 22, height: 22, borderRadius: "50%", border: `3px solid ${C.orangeSoft}`, borderTopColor: C.orange, display: "inline-block", transform: `rotate(${t * 720}deg)` }} />}</span>
                </div>
              ) : null;
            })}
            
          </div>
          {/* "nie per Mail" stamp over the page */}
          {t > nie - 0.08 ? <div style={{ position: "absolute", left: 300, top: 380, zIndex: 30 }}><InkStamp id="niemail" text="NIE PER MAIL" p={k(t, nie - 0.06, 0.25)} color={C.red} size={46} rot={-10} /></div> : null}
        </div>
      </div>
      {/* flying PDFs: button → download icon */}
      {dlAt.map((a, i) => {
        const u = k(t, a, 0.32, Easing.inOut(Easing.quad));
        if (t < a || u >= 1) return null;
        const sx = 600, sy = btnY(i % 3) + 24, ex = 1000, ey = 60;
        return <div key={i} style={{ position: "absolute", left: sx + (ex - sx) * u, top: sy + (ey - sy) * u - Math.sin(u * Math.PI) * 120, zIndex: 50, transform: `scale(${1 - 0.5 * u}) rotate(${u * 20}deg)` }}><PdfIcon size={60} /></div>;
      })}
      {/* downloads shelf */}
      {t > laedt - 0.05 ? (
        <div style={{ position: "absolute", left: 60, top: 600, width: 620, zIndex: 45, background: "#16130F", borderRadius: 20, padding: "14px 18px", boxShadow: "0 24px 40px -10px rgba(0,0,0,0.45)", ...ps(t, laedt - 0.05, 16, 0.8) }}>
          <Mono text={`DOWNLOADS · ${nDl} PDFs`} size={15} color="#F2B9A1" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {DL_FILES.slice(0, nDl).slice(-4).map((f) => <span key={f} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15, color: "#FFF", background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 9px", whiteSpace: "nowrap" }}>{f}</span>)}
          </div>
        </div>
      ) : null}
      <Beispiel style={{ left: 420, top: 740 }} />
      <Pointer t={t} path={[{ x: 520, y: 800, at: 0 }, { x: 590, y: btnY(0) + 24, at: browser + 0.5, click: true }, { x: 590, y: btnY(1) + 24, at: browser + 0.9, click: true }, { x: 590, y: btnY(1) + 24, at: paypal + 0.15, click: true }, { x: 590, y: btnY(0) + 24, at: uber + 0.15, click: true }, { x: 590, y: btnY(2) + 24, at: laedt + 0.2, click: true }, { x: 590, y: btnY(1) + 24, at: runter + 0.1, click: true }, { x: 590, y: btnY(0) + 24, at: nie - 0.15, click: true }]} size={54} />
      <Ring t={t} at={nie} x={460} y={460} r={260} color={C.red} />
      <Glint t={t} at={kam} x={980} y={70} size={36} />
    </PanelStage>
  );
};

// ================= 5. "Am Ende liegt alles in einem Ordner. Jede Datei sauber benannt, mit Datum, Firma und Betrag." =================
const FILES = [
  { old: "invoice_8834-DE.pdf", d: "2026-10-03", f: "Amazon", a: "89,90", b: "amazon" as Brand },
  { old: "Rechnung (3).pdf", d: "2026-10-07", f: "Uber", a: "23,40", b: "uber" as Brand },
  { old: "receipt-2X91.pdf", d: "2026-10-09", f: "Shop", a: "134,00", b: "paypal" as Brand },
  { old: "RE_0045121187.pdf", d: "2026-10-12", f: "Telekom", a: "59,95", b: "gmail" as Brand },
  { old: "download.pdf", d: "2026-10-14", f: "Amazon", a: "212,49", b: "amazon" as Brand },
];
export const SceneOrdner: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const ende = m("ende", 0.05), ordner = m("ordner", 0.22), datei = m("datei", 0.35), benannt = m("benannt", 0.5), datum = m("datum", 0.66), firma = m("firma", 0.78), betrag = m("betrag", 0.9);
  const renAt = (i: number) => datei + 0.05 + i * Math.max(0.12, (benannt + 0.4 - datei) / FILES.length);
  const HL = [{ a: datum, c: "rgba(62,123,217,0.22)", tc: "#2C5FB0" }, { a: firma, c: "rgba(217,119,87,0.25)", tc: PK.orangeDeep }, { a: betrag, c: "rgba(30,158,87,0.22)", tc: "#16794A" }];
  return (
    <PanelStage t={t} dur={dur} seed={56}>
      {/* big folder header */}
      <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 18, zIndex: 5, ...ps(t, ordner - 0.2, 14, 0.7) }}>
        <div style={{ width: 92, height: 76, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 44, height: 20, borderRadius: "10px 10px 0 0", background: "#B4532F" }} />
          <div style={{ position: "absolute", left: 0, top: 12, right: 0, bottom: 0, borderRadius: 12, background: `linear-gradient(170deg, #E58A66, ${C.orange})`, boxShadow: "0 12px 22px -8px rgba(120,50,25,0.5)" }} />
        </div>
        <div><Mono text="ORDNER" size={17} /><div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 52, color: PK.ink, lineHeight: 1 }}>Belege / 2026-10</div></div>
        <span style={{ marginLeft: 18 }}><Pill text="34 PDFs" color={C.green} bg={C.greenSoft} size={20} dot={false} /></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 150, width: 1000, height: 640, transform: tilt(t, 3, 0), transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, overflow: "hidden" }}>
          <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 24px", gap: 18, borderBottom: `1.5px solid ${CL.border}`, background: "#FBFAF7" }}>
            {[["DATUM", 0], ["FIRMA", 1], ["BETRAG", 2]].map(([l, i]) => <span key={l as string} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 16, letterSpacing: "0.12em", color: t > HL[i as number].a - 0.05 ? HL[i as number].tc : CL.sub, background: t > HL[i as number].a - 0.05 ? HL[i as number].c : "transparent", borderRadius: 8, padding: "4px 10px" }}>{l}</span>)}
            <span style={{ marginLeft: "auto" }}><Logo name="claude" size={28} /></span>
          </div>
          {FILES.map((f, i) => {
            const a = renAt(i);
            const done = t > a + 0.25;
            const flip = k(t, a, 0.25, ez);
            return (
              <div key={i} style={{ height: 112, display: "flex", alignItems: "center", gap: 16, padding: "0 24px", borderTop: i ? "1px solid #EFEBE4" : "none", ...ps(t, ende + i * 0.06, 8, 0.85) }}>
                <PdfIcon size={52} />
                <div style={{ position: "relative", height: 40, flex: 1 }}>
                  <div style={{ position: "absolute", left: 0, top: 0, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: CL.sub, opacity: 1 - flip, transform: `translateY(${-flip * 20}px)`, whiteSpace: "nowrap", textDecoration: "line-through" }}>{f.old}</div>
                  <div style={{ position: "absolute", left: 0, top: 0, fontFamily: MONO, fontWeight: 800, fontSize: 27, color: CL.text, opacity: flip, transform: `translateY(${(1 - flip) * 20}px)`, whiteSpace: "nowrap", display: "flex" }}>
                    {[f.d, f.f, f.a].map((seg, j) => (
                      <React.Fragment key={j}>
                        <span style={{ position: "relative", color: t > HL[j].a ? HL[j].tc : CL.text }}>
                          <Highlight p={k(t, HL[j].a - 0.05 + i * 0.04, 0.25)} color={HL[j].c} />
                          <span style={{ position: "relative" }}>{seg}</span>
                        </span>
                        <span>{j < 2 ? "_" : ".pdf"}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <Mark b={f.b} size={44} />
                <CheckDot size={30} p={done ? k(t, a + 0.25, 0.3) : 0} />
              </div>
            );
          })}
          <Sheen p={k(t, betrag + 0.3, 0.7)} strength={0.6} />
        </div>
      </div>
      <Beispiel style={{ right: 60, top: 160 }} />
      <Ring t={t} at={ordner} x={90} y={70} r={160} />
      <Glint t={t} at={betrag + 0.2} x={980} y={240} size={36} />
    </PanelStage>
  );
};

// ================= 6. "Dazu eine Liste, was noch fehlt." =================
export const SceneFehlt: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const liste = m("liste", 0.3), fehlt = m("fehlt", 0.75);
  const ROWSF = [
    { d: "ARAL Tankstelle", a: "84,37 €", w: "Kassenbon im Auto" },
    { d: "Farben Schmidt", a: "233,10 €", w: "beim Lieferanten anfordern" },
  ];
  return (
    <PanelStage t={t} dur={dur} seed={57} shake={t > fehlt && t < fehlt + 0.3 ? Math.sin((t - fehlt) * 80) * 4 : 0}>
      <div style={{ position: "absolute", left: 120, top: 70, width: 840, transform: tilt(t, 3, -4), ...ps(t, -0.2, 22, 0.85) }}>
        <div style={{ background: "#FFF", borderRadius: 28, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, padding: "26px 30px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Logo name="claude" size={36} />
            <span style={{ fontFamily: fonts.bold, fontSize: 32, color: PK.ink }}>Liste · Oktober</span>
            <span style={{ marginLeft: "auto" }}><Pill text="31 VON 33 DA" color={C.green} bg={C.greenSoft} size={18} dot={false} /></span>
          </div>
          <div style={{ marginTop: 20, borderRadius: 18, background: C.redSoft, border: "2px solid rgba(210,64,58,0.35)", padding: "14px 18px", ...ps(t, liste - 0.45, 10, 0.8) }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, color: "#FFF", background: C.red, borderRadius: 8, padding: "4px 12px" }}>FEHLT</span>
            {ROWSF.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, height: 84, borderTop: i ? "1px solid rgba(210,64,58,0.2)" : "none", marginTop: i ? 0 : 10, ...ps(t, liste - 0.3 + i * 0.12, 8, 0.8) }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, border: `3px solid ${C.red}` }} />
                <div><div style={{ fontFamily: fonts.bold, fontSize: 28, color: "#9B231E" }}>{r.d}</div><div style={{ fontFamily: fonts.medium, fontSize: 21, color: "#B4534E" }}>{r.w}</div></div>
                <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 28, color: "#9B231E" }}>{r.a}</span>
              </div>
            ))}
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, height: 62, borderTop: "1px solid #EFEBE4", opacity: 0.55 }}>
              <CheckDot size={24} /><span style={{ height: 12, width: 260 + i * 40, borderRadius: 4, background: "#ECE8E1" }} /><span style={{ marginLeft: "auto", height: 12, width: 90, borderRadius: 4, background: "#E2DDD3" }} />
            </div>
          ))}
        </div>
        {t > fehlt - 0.08 ? <div style={{ position: "absolute", right: -20, top: 60 }}><InkStamp id="fehlt" text="NOCH 2" p={k(t, fehlt - 0.06, 0.25)} color={C.red} size={50} rot={-12} /></div> : null}
      </div>
      <Beispiel style={{ left: 40, top: 40 }} />
      <Ring t={t} at={fehlt} x={540} y={330} r={280} color={C.red} />
    </PanelStage>
  );
};

// ================= 7. "Den Ordner schickst du deinem Steuerberater. Er sucht nichts mehr, und du zahlst nichts mehr fürs Suchen." =================
export const SceneStb: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const ordner = m("ordner", 0.05), schickst = m("schickst", 0.12), stb = m("stb", 0.25), er = m("er", 0.4), sucht = m("sucht", 0.45), nichts0 = m("nichts0", 0.52), zahlst = m("zahlst", 0.68), nichts1 = m("nichts1", 0.75), suchen = m("suchen", 0.92);
  const fly = k(t, schickst - 0.05, Math.max(0.4, stb - schickst + 0.2), ez);
  const landed = fly >= 1;
  const eur = interpolate(t, [nichts1 - 0.05, suchen + 0.3], [150, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const stop = t > nichts0;
  return (
    <PanelStage t={t} dur={dur} seed={58}>
      {/* advisor card */}
      <div style={{ position: "absolute", left: 470, top: 90, width: 560, transform: tilt(t, 4, -8), ...ps(t, -0.2, 20, 0.85) }}>
        <div style={{ background: "#FFF", borderRadius: 30, boxShadow: paperShadow, border: `${landed ? 3 : 1.5}px solid ${landed ? C.green : CL.border}`, padding: "26px 28px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "#2A3A5C", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.calc} size={34} color="#FFF" sw={2} /></div>
            <div><div style={{ fontFamily: fonts.bold, fontSize: 32, color: PK.ink }}>Steuerberater</div><Mono text="KANZLEI" size={16} /></div>
          </div>
          <div style={{ marginTop: 20, height: 92, borderRadius: 18, border: `2px dashed ${landed ? C.green : CL.border}`, background: landed ? "rgba(30,158,87,0.06)" : "#FAF8F4", display: "flex", alignItems: "center", padding: "0 18px", gap: 12 }}>
            {landed ? <><Ico d={I2.folder} size={38} color={C.green} sw={2} /><span style={{ fontFamily: fonts.bold, fontSize: 25, color: CL.text }}>Belege 2026-10 · 34 PDFs</span><span style={{ marginLeft: "auto" }}><CheckDot size={30} p={k(t, stb, 0.3)} /></span></>
              : <span style={{ fontFamily: fonts.medium, fontSize: 23, color: CL.sub }}>Eingang</span>}
          </div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14 }}>
            <Mono text="BELEGSUCHE" size={18} color={stop ? C.green : C.red} />
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: stop ? C.green : C.red, fontVariantNumeric: "tabular-nums" }}>{stop ? "0:00" : mmss(47 * 60 + t * 40)}</span>
            {t > sucht - 0.05 ? <span style={{ fontFamily: fonts.bold, fontSize: 24, color: "#FFF", background: C.green, borderRadius: 999, padding: "6px 16px", ...ps(t, sucht - 0.05, 6, 0.6) }}>sucht nichts</span> : null}
          </div>
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14 }}>
            <Mono text="FÜRS SUCHEN" size={18} />
            <span style={{ position: "relative" }}>
              <Odometer value={t > zahlst - 0.1 ? eur : 150} size={44} color={eur < 1 ? C.green : C.red} speed={t > nichts1 && t < suchen ? 0.8 : 0} suffix=" €" />
            </span>
          </div>
          <Sheen p={k(t, suchen, 0.6)} />
        </div>
        {t > suchen - 0.05 ? <div style={{ position: "absolute", right: -16, top: -18 }}><InkStamp id="null" text="0 €" p={k(t, suchen - 0.03, 0.25)} color={C.green} size={56} rot={-10} /></div> : null}
      </div>
      {/* folder flies from left into the advisor's inbox */}
      {!landed ? (
        <div style={{ position: "absolute", left: 70 + (560 - 70) * fly, top: 330 + (230 - 330) * fly - Math.sin(fly * Math.PI) * 160, zIndex: 30, transform: `scale(${1 - 0.35 * fly}) rotate(${Math.sin(fly * Math.PI) * -8}deg)`, ...ps(t, ordner - 0.2, 12, 0.7) }}>
          <div style={{ width: 300, background: "#FFF", borderRadius: 24, boxShadow: paperShadow, border: `2px solid ${C.orange}`, padding: "20px 22px" }}>
            <div style={{ width: 92, height: 72, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 42, height: 18, borderRadius: "9px 9px 0 0", background: "#B4532F" }} />
              <div style={{ position: "absolute", left: 0, top: 11, right: 0, bottom: 0, borderRadius: 11, background: `linear-gradient(170deg, #E58A66, ${C.orange})` }} />
            </div>
            <div style={{ fontFamily: fonts.bold, fontSize: 28, color: PK.ink, marginTop: 12 }}>Belege 2026-10</div>
            <Mono text="34 PDFs · BENANNT" size={15} />
          </div>
        </div>
      ) : null}
      <Beispiel style={{ left: 40, top: 40 }} />
      <Ring t={t} at={stb} x={750} y={250} r={240} color={C.green} />
      <Ring t={t} at={suchen} x={760} y={520} r={260} color={C.green} />
      <Glint t={t} at={nichts0 + 0.1} x={1000} y={130} size={38} />
    </PanelStage>
  );
};

// ================= 8. guide background (PDF scroll sits on top) =================
export const SceneGuideBg: React.FC<SceneP> = ({ t, dur }) => (
  <PanelStage t={t} dur={dur} seed={59}>
    <Glint t={t} at={0.4} x={110} y={200} size={34} />
  </PanelStage>
);

export { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, Pill, PK, InkStamp };
