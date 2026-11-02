import React from "react";
import { Easing, interpolate } from "remotion";
import { fonts } from "../theme";
import { PK, paperShadow, Highlight, Sheen, InkStamp, Brush } from "./PremiumKit";
import { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, tilt, Logo, Mono, Pill, CheckDot, Ico, Glint, Ring, Pointer, PanelStage, Odometer } from "./DuetBrolls";
import { Win, Beispiel, I2, TopTag, PdfIcon, Composer, FileChip } from "./KontoBrolls";
import { BescheidDesk3D, FristCalendar3D, ROWS } from "./BescheidObjects3D";

// FP-N "Bescheid-Check" (2026-11-01) - split-panel scenes (1080 x 820), pure functions of (t, dur, at);
// BescheidOpus anchors `at` to captions.json word times. Neutral Bescheid look (invented "Finanzamt Musterstadt", no logo/eagle,
// no ELSTER UI). All numbers BEISPIEL: Arbeitszimmer gestrichen −1.260 €, Fahrtkosten gekürzt −710 €, Bewirtung gekürzt −144 €
// = −2.114 € ≈ 740 € Steuer at 35 %. Frist example = guide example A: Bescheid 29.10.2026 → Bekanntgabe Mo 02.11. → Mi 02.12.2026.

export type SceneP = { t: number; dur: number; at?: Record<string, number> };
const mk = (dur: number, at: Record<string, number> | undefined) => (name: string, frac: number) => (at && at[name] !== undefined ? at[name] : frac * dur);
const ez = Easing.inOut(Easing.cubic);
const DEV = ROWS.slice(0, 3);
const TAX = ["≈ 441 €", "≈ 249 €", "≈ 50 €"];
const DEV_C = [C.red, C.amber, C.amber];

// ================= 0. HOOK: 3D desk - Erklärung | Bescheid, Claude has marked every cut; fine print gets highlighted =================
export const HookBescheid: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const streicht = m("streicht", 0.1), klein = m("klein", 0.4), erl = m("erl", 0.5), claude = m("claude", 0.62), findet = m("findet", 0.68), minute = m("minute", 0.9);
  // frame 0: all three marks already set = the thumbnail shows the full result (2.114 €, matches the hook pill); ring accents "streicht"
  const marks = [-1, -0.8, -0.6];
  const zoomIn = klein - 0.35, zoomOut = claude - 0.2;
  const secs = Math.round(interpolate(t, [findet - 0.2, minute + 0.2], [12, 58], clamp));
  const sum = 2114;
  const card = k(t, claude - 0.15, 0.35, ez);
  return (
    <PanelStage t={t} dur={dur} seed={61}>
      <div style={{ position: "absolute", left: 0, top: 140, width: 1080, height: 680 }}>
        <BescheidDesk3D t={t} w={1080} h={680} marks={marks} erl={erl} zoomIn={zoomIn} zoomOut={zoomOut} />
      </div>
      <Beispiel style={{ left: 34, top: 760 }} />
      {/* Claude result chip: always visible (frame 0 = output), grows to a card on "Claude findet" */}
      <div style={{ position: "absolute", left: 300, top: 690, zIndex: 22, transform: `translateY(${-card * 40}px) scale(${1 + 0.08 * card})`, transformOrigin: "50% 100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFF", borderRadius: 999, padding: "10px 24px 10px 12px", boxShadow: paperShadow, border: `2px solid ${t > claude ? C.orange : CL.border}` }}>
          <Logo name="claude" size={42} />
          <span style={{ fontFamily: fonts.bold, fontSize: 30, color: PK.ink, whiteSpace: "nowrap" }}>3 Abweichungen</span>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: "#FFF", background: C.red, borderRadius: 12, padding: "2px 12px", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>−{Math.round(sum).toLocaleString("de-DE")} €</span>
          {t > findet - 0.25 ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8, ...ps(t, findet - 0.25, 6, 0.6) }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", border: `3px solid ${C.green}`, position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: 3, width: 3, height: 11, background: C.green, transformOrigin: "50% 100%", transform: `rotate(${secs * 6}deg)` }} />
              </span>
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: C.green, fontVariantNumeric: "tabular-nums" }}>0:{String(secs).padStart(2, "0")}</span>
            </span>
          ) : null}
        </div>
      </div>
      {/* "nur ganz klein": loupe label while the camera is in the fine print */}
      {t > klein - 0.2 && t < zoomOut + 0.3 ? (
        <div style={{ position: "absolute", left: 640, top: 250, zIndex: 24, ...ps(t, klein - 0.15, 10, 0.6), opacity: 1 - k(t, zoomOut, 0.25) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "10px 22px 10px 12px", fontFamily: MONO, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em" }}>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M10.5 4a6.5 6.5 0 104.6 11.1L20 20M10.5 4a6.5 6.5 0 010 13" size={20} color="#FFF" sw={2.4} /></span>
            ERLÄUTERUNGEN · 9 PT
          </div>
        </div>
      ) : null}
      <Ring t={t} at={streicht} x={860} y={330} r={220} color={C.red} />
      <Ring t={t} at={minute} x={540} y={680} r={240} color={C.green} />
      <Glint t={t} at={streicht + 0.2} x={1010} y={260} size={36} />
      <Glint t={t} at={minute + 0.1} x={820} y={650} size={32} />
    </PanelStage>
  );
};

// ================= 1. "Folg mir, wenn du keins meiner Systeme mehr verpassen willst." =================
export const SceneFollow: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const mir = m("mir", 0.08), systeme = m("systeme", 0.45), verpassen = m("verpassen", 0.7);
  const followed = t > mir + 0.28;
  const SYS = [
    { n: "Belegsammler", s: "Belege in einem Ordner", ic: I2.folder },
    { n: "Gebührencheck", s: "Kontoauszug geprüft", ic: I2.card },
    { n: "Bescheid-Check", s: "NEU", ic: I2.doc, hot: true },
  ];
  return (
    <PanelStage t={t} dur={dur} seed={62}>
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
        const st = ps(t, a, 26, 0.7);
        return (
          <div key={i} style={{ position: "absolute", left: 70 + i * 320, top: 330, width: 300, zIndex: 5, ...st, transform: `${(st.transform as string) ?? ""} rotate(${(i - 1) * 3}deg)` }}>
            <div style={{ background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `${s.hot ? 3 : 1.5}px solid ${s.hot ? C.orange : CL.border}`, padding: "24px 22px", height: 300, boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
              <div style={{ width: 70, height: 70, borderRadius: 20, background: s.hot ? C.orange : C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={s.ic} size={38} color={s.hot ? "#FFF" : PK.orangeDeep} sw={2} /></div>
              <div style={{ fontFamily: fonts.bold, fontSize: 31, color: PK.ink, marginTop: 22, whiteSpace: "nowrap" }}>{s.n}</div>
              <div style={{ marginTop: 8 }}>{s.hot ? <Pill text="NEU" color="#FFF" bg={C.orange} size={18} dot={false} /> : <Mono text={s.s.toUpperCase()} size={15} />}</div>
              <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, display: "flex", alignItems: "center", gap: 8 }}><Logo name="claude" size={24} /><span style={{ fontFamily: fonts.medium, fontSize: 20, color: CL.sub }}>in Claude</span></div>
              {s.hot ? <Sheen p={k(t, a + 0.3, 0.6)} /> : null}
            </div>
          </div>
        );
      })}
      {t > verpassen - 0.15 ? (() => {
        const st = ps(t, verpassen - 0.12, 12, 0.6);
        return (
          <div style={{ position: "absolute", left: 830, top: 650, zIndex: 20, display: "flex", alignItems: "center", gap: 10, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "10px 22px 10px 12px", fontFamily: fonts.bold, fontSize: 24, ...st, transform: `${(st.transform as string) ?? ""} rotate(${Math.sin((t - verpassen) * 30) * 8 * Math.max(0, 1 - (t - verpassen) / 0.5)}deg)` }}>
            <span style={{ width: 40, height: 40, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15zM10 20.5a2 2 0 004 0" size={24} color="#FFF" sw={2} /></span>
            nichts verpassen
          </div>
        );
      })() : null}
      <Pointer t={t} path={[{ x: 600, y: 760, at: 0 }, { x: 860, y: 140, at: mir + 0.24, click: true }, { x: 900, y: 460, at: systeme + 0.6 }]} size={56} />
      <Ring t={t} at={mir + 0.26} x={860} y={135} r={160} color={C.green} />
      <Glint t={t} at={systeme + 0.35} x={960} y={350} size={36} />
    </PanelStage>
  );
};

// ================= 2. "Denn dafür habe ich ein komplettes System entwickelt: den Bescheid-Check in Claude." =================
export const SceneSystem: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const mods = [m("m1", 0.1), m("m2", 0.3), m("m3", 0.42), m("m4", 0.55)];
  const title = m("title", 0.62), claude = m("claude", 0.9);
  const tile = (bg: string, ic: string, col: string) => <div style={{ width: 60, height: 60, borderRadius: 16, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={ic} size={32} color={col} sw={2} /></div>;
  const MODS: { x: number; y: number; logo: React.ReactNode; h: string; s: string; from: [number, number] }[] = [
    { x: 40, y: 96, logo: tile(C.orangeSoft, "M4 5h7v14H4zM13 5h7v14h-7M6.5 9h2M15.5 9h2M6.5 12h2M15.5 12h2", PK.orangeDeep), h: "Vergleich", s: "Zeile für Zeile", from: [-300, -80] },
    { x: 780, y: 96, logo: tile(C.amberSoft, "M10.5 4a6.5 6.5 0 104.6 11.1L20 20M10.5 4a6.5 6.5 0 010 13", "#9A6410"), h: "Kleingedrucktes", s: "übersetzt", from: [300, -80] },
    { x: 40, y: 590, logo: tile(C.redSoft, "M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 2.6 4.5 3 4.5 1.4 4.5 3.2-2 3.3-4.5 3.3-4.5-1.4-4.5-3", C.red), h: "Betrag", s: "je Abweichung", from: [-300, 80] },
    { x: 780, y: 590, logo: tile(C.greenSoft, "M7 3v3M17 3v3M4 7h16v13H4zM4 11h16M9 15l2 2 4-4", C.green), h: "Einspruch", s: "mit Frist", from: [300, 80] },
  ];
  const CARD = { x: 290, y: 255, w: 500, h: 300 };
  const anchors = [[CARD.x, CARD.y + 50], [CARD.x + CARD.w, CARD.y + 50], [CARD.x, CARD.y + CARD.h - 50], [CARD.x + CARD.w, CARD.y + CARD.h - 50]];
  const tileC = (i: number) => [MODS[i].x + (i % 2 === 0 ? 270 : 0), MODS[i].y + 50];
  return (
    <PanelStage t={t} dur={dur} seed={63}>
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
            <Ico d={I2.doc} size={28} color={CL.sub} />
            <Mono text="MEIN SYSTEM" size={18} />
            {t > claude - 0.05 ? <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: CL.bubble, borderRadius: 999, padding: "5px 14px 5px 8px", fontFamily: fonts.semibold, fontSize: 22, color: CL.text, ...ps(t, claude, 8, 0.5) }}><Logo name="claude" size={26} />in Claude</span> : null}
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 60, color: PK.ink, marginTop: 18, lineHeight: 1, minHeight: 60, whiteSpace: "nowrap" }}>
            {typed("Bescheid-Check", t, title - 0.15, title + 0.45) || <span style={{ color: CL.border }}>Bescheid-Check</span>}
          </div>
          <div style={{ fontFamily: fonts.medium, fontSize: 25, color: CL.sub, marginTop: 16 }}>Jede Streichung finden. Vor der Frist.</div>
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
          <div key={i} style={{ position: "absolute", left: md.x + (1 - p) * md.from[0], top: md.y + (1 - p) * md.from[1], width: 270, opacity: k(t, a - 0.1, 0.1), transform: `rotate(${(1 - p) * (i % 2 ? 8 : -8)}deg) scale(${1 + snap * 0.06})` }}>
            <div style={{ background: "#FFF", borderRadius: 22, border: `1.5px solid ${snap > 0 ? C.orange : CL.border}`, boxShadow: "0 18px 34px -14px rgba(90,55,30,0.4)", padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
              {md.logo}
              <div>
                <div style={{ fontFamily: fonts.bold, fontSize: 26, color: PK.ink, whiteSpace: "nowrap" }}>{md.h}</div>
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

// ================= 3. "Du lädst deinen Bescheid und deine Steuererklärung in Claude." =================
const MiniDoc: React.FC<{ w: number; kind: "besch" | "erkl"; style?: React.CSSProperties }> = ({ w, kind, style }) => (
  <div style={{ position: "absolute", width: w, height: w * 1.414, background: "#FFF", borderRadius: 8, boxShadow: "0 16px 30px -10px rgba(70,35,10,0.45)", border: `1px solid ${CL.border}`, padding: w * 0.08, boxSizing: "border-box", ...style }}>
    <div style={{ fontFamily: fonts.medium, fontSize: w * 0.05, color: CL.sub }}>{kind === "besch" ? "Finanzamt Musterstadt" : "Übermittelt 14.06.2026"}</div>
    <div style={{ fontFamily: fonts.bold, fontSize: w * 0.085, color: PK.ink, marginTop: w * 0.05, lineHeight: 1.1 }}>{kind === "besch" ? "Bescheid für 2025" : "Steuererklärung 2025"}</div>
    <div style={{ height: w * 0.018, background: kind === "besch" ? "#2A3A5C" : C.orange, marginTop: w * 0.05 }} />
    {Array.from({ length: 7 }, (_, i) => (
      <div key={i} style={{ display: "flex", gap: w * 0.04, marginTop: w * 0.05 }}>
        <span style={{ flex: 1, height: w * 0.03, borderRadius: 2, background: "#ECE8E1" }} />
        <span style={{ width: w * 0.2, height: w * 0.03, borderRadius: 2, background: "#E2DDD3" }} />
      </div>
    ))}
    {kind === "besch" ? <div style={{ marginTop: w * 0.07 }}>{[0, 1, 2].map((i) => <div key={i} style={{ height: w * 0.016, width: `${90 - i * 12}%`, background: "#EFEBE4", borderRadius: 2, marginTop: w * 0.022 }} />)}</div> : null}
  </div>
);
export const SceneUpload: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const laedst = m("laedst", 0.1), bescheid = m("bescheid", 0.3), erkl = m("erkl", 0.6), claude = m("claude", 0.85);
  const d1 = k(t, bescheid - 0.15, 0.45, ez), d2 = k(t, erkl - 0.15, 0.45, ez);
  const zone = { x: 70, y: 380 };
  return (
    <PanelStage t={t} dur={dur} seed={64}>
      <div style={{ position: "absolute", left: 40, top: 26, width: 1000, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Bescheid-Check" style={{ inset: 0 }}>
          <div style={{ position: "absolute", left: 30, right: 30, top: 40, fontFamily: SERIF, fontSize: 46, color: CL.text, lineHeight: 1.12, textAlign: "center" }}>
            <Logo name="claude" size={40} /> <span style={{ verticalAlign: "middle" }}>Lade Bescheid und Erklärung hoch</span>
          </div>
          <Composer t={t} focus={t > laedst} text={typed("Leg beide nebeneinander. Was wurde gestrichen?", t, claude - 0.35, claude + 0.45)} sendAt={dur + 1} style={{ left: 30, right: 30, bottom: 28, height: 380 }}>
            <div style={{ display: "flex", gap: 14, minHeight: 66 }}>
              {d1 >= 1 ? <div style={{ ...ps(t, bescheid + 0.3, 10, 0.7) }}><FileChip name="Bescheid_2025.pdf" sub="PDF · 4 SEITEN" w={330} check={k(t, bescheid + 0.45, 0.3)} /></div> : null}
              {d2 >= 1 ? <div style={{ ...ps(t, erkl + 0.3, 10, 0.7) }}><FileChip name="Erklaerung_2025.pdf" sub="PDF · 12 SEITEN" w={350} check={k(t, erkl + 0.45, 0.3)} /></div> : null}
              {d1 < 1 || d2 < 1 ? <div style={{ flex: 1, height: 66, borderRadius: 16, border: `3px dashed ${t > laedst ? C.orange : CL.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.medium, fontSize: 24, color: t > laedst ? PK.orangeDeep : CL.sub, gap: 10 }}><Ico d={I2.up} size={28} color={t > laedst ? C.orange : CL.sub} />Dateien hierher ziehen</div> : null}
            </div>
          </Composer>
        </Win>
      </div>
      {/* two documents fly from the desk into the composer */}
      {d1 < 1 ? <div style={{ position: "absolute", left: 110 + (zone.x + 90 - 110) * d1, top: 150 + (zone.y + 120 - 150) * d1 - Math.sin(d1 * Math.PI) * 80, zIndex: 40, transform: `scale(${1 - 0.6 * d1}) rotate(${-6 + 6 * d1}deg)`, transformOrigin: "0 0" }}><MiniDoc w={240} kind="besch" /><div style={{ position: "absolute", left: 120, top: -26 }}><Pill text="BESCHEID" color="#FFF" bg="#2A3A5C" size={18} dot={false} /></div></div> : null}
      {d2 < 1 ? <div style={{ position: "absolute", left: 730 + (zone.x + 440 - 730) * d2, top: 160 + (zone.y + 120 - 160) * d2 - Math.sin(d2 * Math.PI) * 80, zIndex: 40, transform: `scale(${1 - 0.6 * d2}) rotate(${6 - 6 * d2}deg)`, transformOrigin: "0 0", ...ps(t, -0.2, 14, 0.8) }}><MiniDoc w={240} kind="erkl" /><div style={{ position: "absolute", left: 80, top: -26 }}><Pill text="ERKLÄRUNG" color="#FFF" bg={C.orange} size={18} dot={false} /></div></div> : null}
      <Pointer t={t} path={[{ x: 620, y: 860, at: 0 }, { x: 230, y: 320, at: bescheid - 0.2, click: true }, { x: 260, y: 560, at: bescheid + 0.25 }, { x: 850, y: 330, at: erkl - 0.2, click: true }, { x: 600, y: 560, at: erkl + 0.25 }, { x: 960, y: 720, at: claude + 0.5 }]} size={56} />
      <Ring t={t} at={erkl + 0.35} x={540} y={560} r={260} />
      <Beispiel style={{ right: 60, top: 120 }} />
    </PanelStage>
  );
};

// ================= 4. "Claude legt beide nebeneinander und geht jede Zeile durch. Wo hat das Finanzamt etwas gestrichen, gekürzt oder anders angesetzt?" =================
const ALL_ROWS = [...ROWS, { n: "Kfz-Kosten (Anteil)", e: "1.840,00", b: "1.840,00" }];
export const SceneCompare: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const legt = m("legt", 0.05), neben = m("neben", 0.15), zeile = m("zeile", 0.3), durch = m("durch", 0.36), gestrichen = m("gestrichen", 0.6), gekuerzt = m("gekuerzt", 0.72), anders = m("anders", 0.85);
  const split = k(t, neben - 0.15, 0.45, ez);
  const scanA = zeile - 0.1, scanB = gestrichen - 0.15;
  const scanRow = interpolate(t, [scanA, scanB], [0, ALL_ROWS.length], clamp);
  const flagAt = [gestrichen - 0.05, gekuerzt - 0.05, gekuerzt + 0.25];
  const ROW = 62, TOP = 128;
  const colW = 450;
  const leftX = interpolate(split, [0, 1], [260, 24]), rightX = interpolate(split, [0, 1], [260, 24 + colW + 34]);
  return (
    <PanelStage t={t} dur={dur} seed={65}>
      <div style={{ position: "absolute", left: 30, top: 26, width: 1020, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Bescheid-Check" style={{ inset: 0 }} right={<Pill text={t > anders ? "3 ABWEICHUNGEN" : `ZEILE ${Math.min(ALL_ROWS.length, Math.floor(scanRow) + 1)} / ${ALL_ROWS.length}`} color={t > anders ? "#FFF" : PK.orangeDeep} bg={t > anders ? C.red : C.orangeSoft} size={16} dot={false} />}>
          {[{ x: leftX, kind: "erkl" as const, head: "Deine Erklärung", col: C.orange }, { x: rightX, kind: "besch" as const, head: "Bescheid", col: "#2A3A5C" }].map((d, di) => (
            <div key={di} style={{ position: "absolute", left: d.x, top: 18, width: colW, height: 650, background: "#FFF", borderRadius: 18, border: `1.5px solid ${CL.border}`, boxShadow: "0 10px 26px -12px rgba(70,35,10,0.35)", overflow: "hidden", zIndex: di ? 2 : 1, opacity: di ? k(t, legt - 0.2, 0.25) : 1 }}>
              <div style={{ height: 70, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", borderBottom: `4px solid ${d.col}` }}>
                <PdfIcon size={40} />
                <div><div style={{ fontFamily: fonts.bold, fontSize: 24, color: PK.ink }}>{d.head}</div><Mono text={d.kind === "besch" ? "FINANZAMT MUSTERSTADT · 2025" : "ANLAGE EÜR · 2025"} size={13} /></div>
              </div>
              {ALL_ROWS.map((r, i) => {
                const fi = i < 3 ? flagAt[i] : 999;
                const flagged = t > fi;
                const scanned = scanRow > i + 0.5;
                const bg = flagged ? (di ? "rgba(210,64,58,0.12)" : "rgba(217,119,87,0.10)") : scanned ? "rgba(30,158,87,0.05)" : "#FFF";
                return (
                  <div key={i} style={{ position: "absolute", left: 0, right: 0, top: TOP - 40 + i * ROW, height: ROW, display: "flex", alignItems: "center", padding: "0 18px", background: bg, borderTop: "1px solid #EFEBE4" }}>
                    <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: CL.text, whiteSpace: "nowrap" }}>{r.n}</span>
                    <span style={{ marginLeft: "auto", position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 22, color: flagged && di ? C.red : CL.text }}>
                      {di ? r.b : r.e}
                      {flagged && di && i === 0 ? <Brush w={110} p={k(t, fi, 0.25)} sw={6} style={{ left: -10, top: -6 }} /> : null}
                    </span>
                    {di ? <span style={{ width: 34, marginLeft: 10, display: "flex", justifyContent: "flex-end" }}>{flagged ? <span style={{ width: 26, height: 26, borderRadius: "50%", background: DEV_C[i], color: "#FFF", fontFamily: fonts.bold, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>!</span> : scanned ? <CheckDot size={24} /> : null}</span> : null}
                  </div>
                );
              })}
              {di ? <div style={{ position: "absolute", left: 18, right: 18, bottom: 18 }}><Mono text="ERLÄUTERUNGEN" size={13} />{[0, 1, 2].map((j) => <div key={j} style={{ height: 8, width: `${92 - j * 14}%`, background: "#EFEBE4", borderRadius: 3, marginTop: 8 }} />)}</div> : null}
            </div>
          ))}
          {/* scan line sweeping both columns */}
          {t > scanA && t < scanB + 0.2 ? <div style={{ position: "absolute", left: 14, right: 14, top: 18 + TOP - 40 + scanRow * ROW, height: 4, background: C.orange, boxShadow: "0 0 18px 4px rgba(217,119,87,0.55)", zIndex: 5, opacity: 1 - k(t, scanB, 0.2) }} /> : null}
          {/* connector dots between matching rows */}
          {split > 0.95 ? ALL_ROWS.map((_, i) => {
            const on = scanRow > i + 0.5;
            const y = 18 + TOP - 40 + i * ROW + ROW / 2;
            return on ? <span key={i} style={{ position: "absolute", left: 24 + colW + 6, top: y - 4, width: 22, height: 8, borderRadius: 4, background: i < 3 && t > flagAt[i] ? C.red : C.orange, zIndex: 6 }} /> : null;
          }) : null}
        </Win>
      </div>
      {/* labels: gestrichen / gekürzt / anders angesetzt */}
      {[{ a: gestrichen, txt: "GESTRICHEN", c: C.red, y: 220 }, { a: gekuerzt, txt: "GEKÜRZT", c: C.amber, y: 282 }, { a: anders, txt: "ANDERS ANGESETZT?", c: "#2A3A5C", y: 470 }].map((l, i) => (
        t > l.a - 0.06 ? <div key={i} style={{ position: "absolute", right: 40, top: l.y, zIndex: 30 }}><InkStamp id={`cmp${i}`} text={l.txt} p={k(t, l.a - 0.05, 0.25)} color={l.c} size={i === 2 ? 30 : 36} rot={-8 + i * 3} /></div> : null
      ))}
      <Beispiel style={{ left: 50, top: 740 }} />
      <Ring t={t} at={gestrichen} x={800} y={250} r={200} color={C.red} />
      <Glint t={t} at={neben + 0.3} x={540} y={90} size={34} />
    </PanelStage>
  );
};

// ================= 5. "Jede Abweichung erklärt dir Claude in einem Satz. Mit dem Betrag, den sie dich kostet." =================
const SENT = [
  "Das Arbeitszimmer wurde gestrichen, weil der Mittelpunkt deiner Tätigkeit nicht nachgewiesen ist.",
  "Die Fahrtkosten wurden um 710 € gekürzt: nur Fahrten mit Nachweis zählen.",
  "Bewirtung nur zu 70 % abziehbar, darum 144 € weniger.",
];
export const SceneSatz: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const abw = m("abw", 0.05), satz = m("satz", 0.35), betrag = m("betrag", 0.6), kostet = m("kostet", 0.85);
  const cardAt = (i: number) => abw - 0.05 + i * Math.max(0.18, (satz + 0.2 - abw) / 3);
  const taxP = k(t, betrag - 0.1, 0.3);
  const total = interpolate(t, [kostet - 0.15, kostet + 0.45], [0, 740], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <PanelStage t={t} dur={dur} seed={66}>
      {/* fine print paper behind, highlighted line feeding the first sentence */}
      <div style={{ position: "absolute", left: 40, top: 40, width: 360, height: 300, background: `linear-gradient(160deg, #FFF, ${PK.paper})`, borderRadius: 8, boxShadow: paperShadow, padding: "20px 22px", boxSizing: "border-box", transform: `${tilt(t, 6, 10)} rotate(-4deg)`, ...ps(t, -0.25, 14, 0.85), zIndex: 1 }}>
        <Mono text="ERLÄUTERUNGEN" size={14} />
        <div style={{ fontFamily: fonts.medium, fontSize: 15, lineHeight: 1.45, color: "#6A665E", marginTop: 10 }}>
          <span style={{ position: "relative" }}><Highlight p={k(t, abw, 0.4)} /><span style={{ position: "relative" }}>Die Aufwendungen für das häusliche Arbeitszimmer konnten nicht berücksichtigt werden, da der Mittelpunkt der Tätigkeit nicht nachgewiesen wurde.</span></span> Fahrtkosten wurden nur in Höhe der nachgewiesenen Fahrten angesetzt. Bewirtungsaufwendungen sind nur zu 70 % abziehbar.
        </div>
      </div>
      <div style={{ position: "absolute", left: 300, top: 30, width: 750, height: 770, transform: tilt(t, 3, -4), zIndex: 5 }}>
        <Win title="Bescheid-Check" style={{ inset: 0 }}>
          <div style={{ position: "absolute", left: 24, top: 18, display: "flex", alignItems: "center", gap: 10 }}><Logo name="claude" size={34} /><span style={{ fontFamily: fonts.semibold, fontSize: 24, color: CL.text }}>3 Abweichungen, je ein Satz:</span></div>
          {SENT.map((s, i) => {
            const a = cardAt(i);
            return (
              <div key={i} style={{ position: "absolute", left: 24, right: 24, top: 70 + i * 170, height: 152, background: "#FFF", borderRadius: 18, border: `1.5px solid ${CL.border}`, borderLeft: `8px solid ${DEV_C[i]}`, padding: "14px 18px", boxSizing: "border-box", ...ps(t, a, 14, 0.8) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 15, letterSpacing: "0.1em", color: "#FFF", background: DEV_C[i], borderRadius: 6, padding: "3px 8px" }}>{DEV[i].dev}</span>
                  <span style={{ fontFamily: fonts.bold, fontSize: 22, color: PK.ink }}>{DEV[i].n}</span>
                  <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 22, color: DEV_C[i] }}>{DEV[i].d}</span>
                </div>
                <div style={{ fontFamily: fonts.medium, fontSize: 21, color: CL.text, marginTop: 8, lineHeight: 1.3 }}>{typed(s, t, a + 0.05, a + 0.6)}</div>
                {t > betrag - 0.1 ? <div style={{ position: "absolute", right: 16, bottom: 12, display: "flex", alignItems: "center", gap: 8, opacity: taxP, transform: `scale(${0.8 + 0.2 * taxP})` }}><Mono text="KOSTET DICH" size={13} /><span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, color: "#FFF", background: C.red, borderRadius: 8, padding: "2px 10px" }}>{TAX[i]}</span></div> : null}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 24, right: 24, bottom: 18, height: 70, borderRadius: 16, background: "#16130F", display: "flex", alignItems: "center", padding: "0 22px", ...ps(t, kostet - 0.2, 10, 0.8) }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 18, letterSpacing: "0.1em", color: "#F2B9A1" }}>KOSTET DICH ZUSAMMEN</span>
            <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 36, color: "#FFF", fontVariantNumeric: "tabular-nums" }}>≈ {Math.round(total)} €</span>
          </div>
        </Win>
      </div>
      <Beispiel style={{ left: 60, top: 370 }} />
      <Mono text="BEI 35 % STEUERSATZ" size={15} style={{ position: "absolute", left: 60, top: 410 }} />
      <Ring t={t} at={kostet + 0.2} x={680} y={740} r={240} color={C.red} />
      <Glint t={t} at={betrag} x={1000} y={160} size={34} />
    </PanelStage>
  );
};

// ================= 6. "Und wenn sich ein Einspruch lohnt, schreibt Claude ihn dir gleich fertig." =================
const LETTER = [
  { b: true, s: "Einspruch gegen den Einkommensteuerbescheid 2025 vom 29.10.2026" },
  { s: "Steuernummer 123/456/78901" },
  { s: "Sehr geehrte Damen und Herren," },
  { s: "hiermit lege ich gegen den oben genannten Bescheid Einspruch ein." },
  { s: "1. Arbeitszimmer: erklärt 1.260 €, angesetzt 0 €. Nachweis anbei (Anlage 1)." },
  { s: "2. Fahrtkosten: erklärt 2.140 €, angesetzt 1.430 €. Fahrtenliste anbei (Anlage 2)." },
  { s: "Ich beantrage, den Bescheid insoweit zu ändern." },
];
export const SceneEinspruch: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const lohnt = m("lohnt", 0.2), schreibt = m("schreibt", 0.45), fertig = m("fertig", 0.85);
  const lineAt = (i: number) => schreibt - 0.2 + i * Math.max(0.12, (fertig - schreibt + 0.2) / LETTER.length);
  return (
    <PanelStage t={t} dur={dur} seed={67}>
      <div style={{ position: "absolute", left: 30, top: 26, width: 1020, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Bescheid-Check" style={{ inset: 0 }} right={<span style={{ display: "flex", gap: 10 }}><Pill text="ENTWURF" color={PK.orangeDeep} bg={C.orangeSoft} size={16} dot={false} /><span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: fonts.semibold, fontSize: 18, color: CL.text, border: `1.5px solid ${CL.border}`, borderRadius: 10, padding: "4px 10px" }}><Ico d={I2.copy} size={18} />Kopieren</span></span>}>
          {/* chat side */}
          <div style={{ position: "absolute", left: 22, top: 22, width: 300 }}>
            <div style={{ background: CL.bubble, borderRadius: 18, padding: "12px 16px", fontFamily: fonts.medium, fontSize: 21, color: CL.text, ...ps(t, -0.2, 10, 0.8) }}>Lohnt sich ein Einspruch für 1 und 2?</div>
            <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "flex-start", ...ps(t, lohnt - 0.7, 10, 0.8) }}>
              <Logo name="claude" size={30} />
              <div style={{ fontFamily: fonts.medium, fontSize: 19, color: CL.text, lineHeight: 1.35 }}>Für beide hast du Belege. Ich schreib dir den Einspruch. Entscheiden tust du oder deine Kanzlei.</div>
            </div>
            <div style={{ marginTop: 18, ...ps(t, schreibt, 8, 0.7) }}><Pill text="§ 357 AO · FORM OK" color={C.green} bg={C.greenSoft} size={15} dot={false} /></div>
          </div>
          {/* artifact: the letter on real paper */}
          <div style={{ position: "absolute", left: 345, top: 18, right: 22, bottom: 22, background: `linear-gradient(160deg, #FFF, ${PK.paper})`, borderRadius: 10, boxShadow: paperShadow, padding: "26px 30px", boxSizing: "border-box", overflow: "hidden", ...ps(t, schreibt - 0.3, 16, 0.9) }}>
            <Mono text="FLORENT MUSTER · MUSTERWEG 1 · 12345 MUSTERSTADT" size={12} />
            <div style={{ fontFamily: fonts.medium, fontSize: 16, color: CL.sub, marginTop: 6 }}>An das Finanzamt Musterstadt</div>
            {LETTER.map((l, i) => {
              const a = lineAt(i);
              return (
                <div key={i} style={{ fontFamily: l.b ? fonts.bold : fonts.medium, fontSize: l.b ? 23 : 19, color: PK.ink, marginTop: i === 0 ? 22 : 12, lineHeight: 1.3, minHeight: l.b ? 60 : 24 }}>
                  {typed(l.s, t, a, a + 0.35)}
                </div>
              );
            })}
            <div style={{ position: "absolute", right: 30, bottom: 26, fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: "#2A3A5C", opacity: k(t, fertig, 0.3) }}>F. Muster</div>
            <Sheen p={k(t, fertig, 0.7)} />
          </div>
        </Win>
      </div>
      {t > fertig - 0.06 ? <div style={{ position: "absolute", left: 560, top: 600, zIndex: 30 }}><InkStamp id="fertig" text="FERTIG" p={k(t, fertig - 0.04, 0.25)} color={C.green} size={52} rot={-9} /></div> : null}
      <Pointer t={t} path={[{ x: 200, y: 860, at: 0 }, { x: 980, y: 66, at: fertig + 0.2, click: true }]} size={52} />
      <Beispiel style={{ left: 50, top: 740 }} />
      <Glint t={t} at={fertig + 0.1} x={980} y={120} size={34} />
    </PanelStage>
  );
};

// ================= 7. "Du hast dafür nur einen Monat Zeit, und Claude sagt dir den letzten Tag." =================
export const SceneFrist: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const monat = m("monat", 0.2), zeit = m("zeit", 0.32), claude = m("claude", 0.5), letzten = m("letzten", 0.78), tag = m("tag", 0.88);
  return (
    <PanelStage t={t} dur={dur} seed={68}>
      <div style={{ position: "absolute", left: -40, top: 40, width: 620, height: 780 }}>
        <FristCalendar3D t={t} w={620} h={780} flipFrom={monat - 0.15} flipTo={letzten - 0.1} ring={tag - 0.05} />
      </div>
      {/* Claude's Fristrechner card */}
      <div style={{ position: "absolute", left: 540, top: 90, width: 500, transform: tilt(t, 3, -8), ...ps(t, -0.2, 18, 0.85), zIndex: 10 }}>
        <div style={{ background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, padding: "22px 26px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Logo name="claude" size={32} /><span style={{ fontFamily: fonts.bold, fontSize: 26, color: PK.ink }}>Fristrechner</span><span style={{ marginLeft: "auto" }}><Pill text="§ 355 AO" color={PK.orangeDeep} bg={C.orangeSoft} size={15} dot={false} /></span></div>
          {[
            { l: "BESCHEID VOM", v: "Do 29.10.2026", a: -0.2 },
            { l: "BEKANNTGABE · 4. TAG", v: "Mo 02.11.2026", a: monat - 0.1 },
            { l: "+ 1 MONAT", v: "Mi 02.12.2026", a: zeit },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", height: 62, borderTop: i ? "1px solid #EFEBE4" : "none", marginTop: i ? 0 : 12, ...ps(t, r.a, 8, 0.7) }}>
              <Mono text={r.l} size={15} />
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 24, color: CL.text }}>{r.v}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, borderRadius: 18, background: t > letzten - 0.05 ? C.red : "#F3EFE8", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, transform: `scale(${1 + 0.06 * pop(t, letzten - 0.05, 0.35) * (1 - k(t, letzten + 0.5, 0.3))})` }}>
            <Ico d="M7 3v3M17 3v3M4 7h16v13H4zM4 11h16" size={30} color={t > letzten - 0.05 ? "#FFF" : CL.sub} sw={2} />
            <div>
              <Mono text="LETZTER TAG FÜR DEN EINSPRUCH" size={14} color={t > letzten - 0.05 ? "#FFE4DC" : CL.sub} />
              <div style={{ fontFamily: fonts.bold, fontSize: 36, color: t > letzten - 0.05 ? "#FFF" : CL.border, whiteSpace: "nowrap" }}>Mi, 02.12.2026</div>
            </div>
          </div>
          <Sheen p={k(t, tag, 0.6)} />
        </div>
      </div>
      {/* the finished Einspruch with the deadline stamped on it */}
      <div style={{ position: "absolute", left: 600, top: 560, width: 400, zIndex: 12, transform: `rotate(${-3 + Math.sin(t) * 0.5}deg)`, ...ps(t, claude - 0.1, 20, 0.85) }}>
        <div style={{ background: `linear-gradient(160deg, #FFF, ${PK.paper})`, borderRadius: 8, boxShadow: paperShadow, padding: "18px 22px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><PdfIcon size={36} /><div><div style={{ fontFamily: fonts.bold, fontSize: 21, color: PK.ink }}>Einspruch_ESt_2025.pdf</div><Mono text="FERTIG · 2 ANLAGEN" size={13} color={C.green} /></div></div>
          {t > tag - 0.05 ? <div style={{ position: "absolute", right: -20, top: -34 }}><InkStamp id="frist" text="BIS 02.12." p={k(t, tag - 0.03, 0.25)} color={C.red} size={34} rot={-10} /></div> : null}
        </div>
      </div>
      <Beispiel style={{ left: 40, top: 30 }} />
      <Ring t={t} at={letzten} x={790} y={420} r={240} color={C.red} />
      <Glint t={t} at={tag + 0.1} x={1010} y={380} size={36} />
    </PanelStage>
  );
};

// ================= 8. guide background (PDF scroll sits on top) =================
export const SceneGuideBg: React.FC<SceneP> = ({ t, dur }) => (
  <PanelStage t={t} dur={dur} seed={69}>
    <Glint t={t} at={0.4} x={110} y={200} size={34} />
  </PanelStage>
);

export { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, Pill, PK, InkStamp, Odometer };
