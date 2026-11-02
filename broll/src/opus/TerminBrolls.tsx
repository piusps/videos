import React from "react";
import { Easing, interpolate } from "remotion";
import { fonts } from "../theme";
import { PK, paperShadow, Sheen, InkStamp } from "./PremiumKit";
import { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, tilt, Logo, Mono, Pill, CheckDot, Ico, Glint, Ring, Pointer, PanelStage, Odometer } from "./DuetBrolls";
import { Win, Beispiel, I2, TopTag, PdfIcon, Composer } from "./KontoBrolls";
import { Stopwatch3D, DeadlineCalendar3D } from "./TerminObjects3D";

// FP-N "Terminplaner für deinen Steuerberater" (2026-11-02) - split-panel scenes (1080 x 820), pure functions of (t, dur, at);
// TerminOpus anchors `at` to captions.json word times. Invented "Kanzlei Muster", all questions/amounts/dates BEISPIEL.
// Zeitgebühr § 13 StBVV: 16,50–41 € je angefangene Viertelstunde (only where a time fee applies) - shown as "bis 41 €".

export type SceneP = { t: number; dur: number; at?: Record<string, number> };
const mk = (dur: number, at: Record<string, number> | undefined) => (name: string, frac: number) => (at && at[name] !== undefined ? at[name] : frac * dur);
const ez = Easing.inOut(Easing.cubic);

// the four example questions (all BEISPIEL)
export const QS = [
  { messy: "der Laptop, 1.400 irgendwas … komplett absetzen?", q: "Laptop dieses Jahr komplett absetzen?", short: "Laptop komplett absetzen?", beleg: "01_Laptop.pdf", betrag: "1.428 €", a: "JA" },
  { messy: "Vorauszahlung Q4 ist doch viel zu hoch??", q: "Vorauszahlung Q4 anpassen lassen?", short: "Vorauszahlung Q4 anpassen?", beleg: "02_Vorausz_Q4.pdf", betrag: "2.100 €", a: "JA" },
  { messy: "reicht die Caterer-Rechnung eigentlich", q: "Reicht die Caterer-Rechnung als Beleg?", short: "Caterer-Rechnung als Beleg?", beleg: "03_Catering.pdf", betrag: "640 €", a: "NEIN" },
  { messy: "ach ja, Handy-Abo, zählt das?", q: "Handy-Abo als Betriebsausgabe?", short: "Handy-Abo als Ausgabe?", beleg: "04_Handy.pdf", betrag: "39 €/Mon.", a: "JA" },
];
const ANS_C = (a: string) => (a === "JA" ? C.green : C.red);

// ---------- shared: the question list card ----------
const QList: React.FC<{ t: number; rowsAt: number[]; belegAt?: number; betragAt?: number; jnAt?: number; answersAt?: number; w: number; compact?: boolean }> = ({ t, rowsAt, belegAt = -9, betragAt = -9, jnAt = -9, answersAt = 999, w, compact }) => {
  const RH = compact ? 92 : 112;
  return (
    <div style={{ position: "relative", width: w }}>
      {QS.map((q, i) => {
        const a = rowsAt[i];
        const b = belegAt + i * 0.07, m = betragAt + i * 0.07, j = jnAt + i * 0.07, ans = answersAt + i * 0.16;
        const answered = t > ans;
        return (
          <div key={i} style={{ position: "relative", height: RH - 12, marginBottom: 12, background: "#FFF", borderRadius: 18, border: `1.5px solid ${answered ? ANS_C(q.a) : CL.border}`, boxShadow: "0 8px 20px -10px rgba(70,35,10,0.35)", padding: compact ? "10px 16px" : "14px 18px", boxSizing: "border-box", ...ps(t, a, 16, 0.85) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: C.orangeSoft, color: PK.orangeDeep, fontFamily: MONO, fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontFamily: fonts.bold, fontSize: compact ? 23 : 26, color: PK.ink, whiteSpace: "nowrap", overflow: "hidden" }}>{typed(compact ? q.short : q.q, t, a, a + 0.35)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: compact ? 6 : 10, marginLeft: compact ? 0 : 46 }}>
              {t > b ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F3EFE8", borderRadius: 8, padding: "3px 10px 3px 4px", ...ps(t, b, 8, 0.6) }}><PdfIcon size={22} /><span style={{ fontFamily: MONO, fontWeight: 700, fontSize: compact ? 13 : 15, color: CL.text, whiteSpace: "nowrap" }}>{q.beleg}</span></span> : null}
              {t > m ? <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: compact ? 16 : 19, color: "#FFF", background: PK.ink, borderRadius: 8, padding: compact ? "3px 7px" : "3px 10px", whiteSpace: "nowrap", ...ps(t, m, 8, 0.6) }}>{q.betrag}</span> : null}
              {t > j ? (
                <span style={{ marginLeft: "auto", display: "inline-flex", gap: 6, ...ps(t, j, 8, 0.6) }}>
                  {["JA", "NEIN"].map((x) => {
                    const on = answered && q.a === x;
                    return <span key={x} style={{ fontFamily: MONO, fontWeight: 800, fontSize: compact ? 13 : 15, letterSpacing: compact ? "0.02em" : "0.08em", color: on ? "#FFF" : CL.sub, background: on ? ANS_C(x) : "#FFF", border: `1.5px solid ${on ? ANS_C(x) : CL.border}`, borderRadius: 8, padding: compact ? "3px 7px" : "3px 10px", transform: `scale(${on ? 1 + 0.15 * (1 - k(t, ans, 0.3)) : 1})` }}>{x}</span>;
                  })}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ================= 0. HOOK: 3D stopwatch 10:00 + finished question list (frame 0 = output); runs over the quarter hour (+41 €), snaps back =================
export const hookMinutes = (t: number, viertel: number, claude: number) => {
  if (t < viertel - 0.5) return 10;
  if (t < viertel + 0.35) return interpolate(t, [viertel - 0.5, viertel + 0.35], [10, 15.03], { ...clamp, easing: Easing.in(Easing.quad) });
  if (t < claude - 0.1) return 15.03 + (t - viertel - 0.35) * 0.9;
  return interpolate(t, [claude - 0.1, claude + 0.45], [15.03 + (claude - 0.1 - viertel - 0.35) * 0.9, 10], { ...clamp, easing: ez });
};
const mmss = (m: number) => `${String(Math.floor(m)).padStart(2, "0")}:${String(Math.floor((m % 1) * 60)).padStart(2, "0")}`;
export const HookTermin: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const zehn = m("zehn", 0.1), viertel = m("viertel", 0.35), euro = m("euro", 0.55), claude = m("claude", 0.7), reicht = m("reicht", 0.92);
  const mins = hookMinutes(t, viertel, claude);
  const cross = viertel + 0.33;
  const over = mins > 15 && t < claude + 0.3;
  const back = k(t, claude + 0.35, 0.3);
  return (
    <PanelStage t={t} dur={dur} seed={71}>
      <div style={{ position: "absolute", left: -30, top: 130, width: 600, height: 600 }}>
        <Stopwatch3D t={t} w={600} h={600} minutes={mins} kick={t > cross ? (t - cross) / 0.5 : 0} />
      </div>
      {/* digital readout */}
      <div style={{ position: "absolute", left: 90, top: 668, width: 360, display: "flex", justifyContent: "center", zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#FFF", borderRadius: 999, padding: "8px 22px 8px 12px", boxShadow: paperShadow, border: `2px solid ${over ? C.red : C.green}` }}>
          <span style={{ width: 34, height: 34, borderRadius: "50%", background: over ? C.red : C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18" size={22} color="#FFF" sw={2.4} /></span>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: over ? C.red : PK.ink, fontVariantNumeric: "tabular-nums" }}>{mmss(mins)}</span>
          <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: CL.sub, whiteSpace: "nowrap" }}>Termin</span>
        </div>
      </div>
      {/* +41 € when the second quarter hour starts */}
      {t > cross && t < claude + 0.35 ? (
        <div style={{ position: "absolute", left: 330, top: 250, zIndex: 25, transform: `scale(${0.4 + 0.6 * pop(t, cross, 0.4)}) rotate(-6deg)`, opacity: 1 - k(t, claude + 0.1, 0.25) }}>
          <div style={{ background: C.red, color: "#FFF", borderRadius: 20, padding: "10px 22px", boxShadow: "0 16px 30px rgba(160,40,30,0.35)", textAlign: "center" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 54, lineHeight: 1, transform: `scale(${1 + 0.18 * (t > euro - 0.1 ? 1 - k(t, euro - 0.1, 0.35) : 0)})` }}>+41 €</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 15, letterSpacing: "0.08em", marginTop: 6 }}>2. VIERTELSTUNDE ANGEFANGEN</div>
          </div>
        </div>
      ) : null}
      {/* back to 10 min */}
      {back > 0 ? (
        <div style={{ position: "absolute", left: 120, top: 250, zIndex: 25, transform: `scale(${0.5 + 0.5 * pop(t, claude + 0.35, 0.4)}) rotate(-4deg)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.green, color: "#FFF", borderRadius: 18, padding: "10px 20px" }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 40 }}>10 Min</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 16, letterSpacing: "0.06em" }}>1 VIERTELSTUNDE ✓</span>
          </div>
        </div>
      ) : null}
      {/* finished Fragenliste (output on frame 0) */}
      <div style={{ position: "absolute", left: 540, top: 205, width: 510, transform: `${tilt(t, 3, -10)} scale(${1 + 0.04 * k(t, claude - 0.1, 0.3) * (1 - k(t, reicht + 0.4, 0.4))})`, transformOrigin: "50% 50%", zIndex: 10 }}>
        <div style={{ background: CL.page, borderRadius: 24, border: `2px solid ${t > claude - 0.1 ? C.orange : CL.border}`, boxShadow: paperShadow, padding: "16px 16px 6px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Logo name="claude" size={32} />
            <span style={{ fontFamily: fonts.bold, fontSize: 24, color: PK.ink, whiteSpace: "nowrap" }}>Fragen für die Kanzlei</span>
            <span style={{ marginLeft: "auto" }}><Pill text="4 × JA/NEIN" color="#FFF" bg={C.orange} size={14} dot={false} /></span>
          </div>
          <QList t={t} rowsAt={[-1, -1, -1, -1]} belegAt={-1} betragAt={-1} jnAt={-1} answersAt={reicht - 0.1} w={478} compact />
          <Sheen p={k(t, claude, 0.7)} />
        </div>
      </div>
      <Beispiel style={{ left: 36, top: 770 }} />
      <Ring t={t} at={cross} x={420} y={300} r={200} color={C.red} />
      <Ring t={t} at={claude + 0.35} x={250} y={290} r={200} color={C.green} />
      <Glint t={t} at={zehn + 0.2} x={460} y={740} size={32} />
      <Glint t={t} at={reicht} x={1010} y={240} size={34} />
    </PanelStage>
  );
};

// ================= 1. "Folg mir, wenn du keins meiner Systeme mehr verpassen willst." =================
export const SceneFollow: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const mir = m("mir", 0.08), systeme = m("systeme", 0.45), verpassen = m("verpassen", 0.7);
  const followed = t > mir + 0.28;
  const SYS = [
    { n: "Belegkasse", s: "Bon per Foto", ic: I2.card },
    { n: "Bescheid-Check", s: "Jede Streichung", ic: I2.doc },
    { n: "Terminplaner", s: "NEU", ic: I2.list, hot: true },
  ];
  return (
    <PanelStage t={t} dur={dur} seed={72}>
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

// ================= 2. "Denn dafür habe ich ein komplettes System entwickelt: den Terminplaner für deinen Steuerberater." =================
export const SceneSystem: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const mods = [m("m1", 0.1), m("m2", 0.3), m("m3", 0.42), m("m4", 0.55)];
  const title = m("title", 0.62), stb = m("stb", 0.9);
  const tile = (bg: string, ic: string, col: string) => <div style={{ width: 60, height: 60, borderRadius: 16, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={ic} size={32} color={col} sw={2} /></div>;
  const MIC = "M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM5.5 11a6.5 6.5 0 0013 0M12 17.5V21";
  const MODS: { x: number; y: number; logo: React.ReactNode; h: string; s: string; from: [number, number] }[] = [
    { x: 40, y: 96, logo: tile(C.orangeSoft, MIC, PK.orangeDeep), h: "Sprachnotiz", s: "einfach reinreden", from: [-300, -80] },
    { x: 780, y: 96, logo: tile(C.amberSoft, I2.list, "#9A6410"), h: "Fragenliste", s: "Ja / Nein", from: [300, -80] },
    { x: 40, y: 590, logo: tile("#E4ECF8", I2.mail, "#2A4E8A"), h: "Mail vorab", s: "an die Kanzlei", from: [-300, 80] },
    { x: 780, y: 590, logo: tile(C.greenSoft, "M7 3v3M17 3v3M4 7h16v13H4zM4 11h16M9 15l2 2 4-4", C.green), h: "Protokoll", s: "To-dos + Fristen", from: [300, 80] },
  ];
  const CARD = { x: 290, y: 255, w: 500, h: 300 };
  const anchors = [[CARD.x, CARD.y + 50], [CARD.x + CARD.w, CARD.y + 50], [CARD.x, CARD.y + CARD.h - 50], [CARD.x + CARD.w, CARD.y + CARD.h - 50]];
  const tileC = (i: number) => [MODS[i].x + (i % 2 === 0 ? 270 : 0), MODS[i].y + 50];
  return (
    <PanelStage t={t} dur={dur} seed={73}>
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
            <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: CL.bubble, borderRadius: 999, padding: "5px 14px 5px 8px", fontFamily: fonts.semibold, fontSize: 22, color: CL.text }}><Logo name="claude" size={26} />in Claude</span>
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 64, color: PK.ink, marginTop: 18, lineHeight: 1, minHeight: 64, whiteSpace: "nowrap" }}>
            {typed("Terminplaner", t, title - 0.15, title + 0.45) || <span style={{ color: CL.border }}>Terminplaner</span>}
          </div>
          <div style={{ fontFamily: fonts.medium, fontSize: 25, color: CL.sub, marginTop: 16, opacity: k(t, stb - 0.2, 0.3) }}>für deinen Steuerberater</div>
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

// ================= 3. "Vor dem Termin sprichst du Claude einfach alles rein, was dich gerade beschäftigt. Durcheinander, so wie es dir einfällt." =================
const FRAG_POS = [
  { x: 70, y: 150, r: -7 }, { x: 560, y: 120, r: 6 }, { x: 110, y: 330, r: 4 }, { x: 590, y: 300, r: -5 },
];
export const SceneVoice: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const sprichst = m("sprichst", 0.1), rein = m("rein", 0.3), besch = m("besch", 0.42), durch = m("durch", 0.6), faellt = m("faellt", 0.85);
  const recOn = t > sprichst - 0.15;
  const fragAt = (i: number) => rein - 0.2 + i * Math.max(0.25, (faellt - rein + 0.1) / 4);
  const secs = Math.floor(interpolate(t, [sprichst - 0.15, dur], [0, 42], clamp));
  const shake = t > durch - 0.1 && t < durch + 0.6 ? Math.sin(t * 50) * 5 * (1 - (t - durch + 0.1) / 0.7) : 0;
  return (
    <PanelStage t={t} dur={dur} seed={74}>
      <div style={{ position: "absolute", left: 30, top: 26, width: 1020, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Terminplaner Steuerberater" style={{ inset: 0 }} right={recOn ? <Pill text={`● SPRACHNOTIZ 0:${String(secs).padStart(2, "0")}`} color="#FFF" bg={C.red} size={16} dot={false} /> : undefined}>
          {/* messy transcript fragments */}
          {QS.map((q, i) => {
            const a = fragAt(i), p = FRAG_POS[i];
            const st = ps(t, a, 26, 0.6);
            return (
              <div key={i} style={{ position: "absolute", left: p.x + shake * (i % 2 ? 1 : -1), top: p.y, maxWidth: 400, zIndex: 3 + i, ...st, transform: `${(st.transform as string) ?? ""} rotate(${p.r + Math.sin(t * 2 + i) * 1.2}deg)` }}>
                <div style={{ background: i % 2 ? "#FFF6D9" : "#FFF", borderRadius: 14, padding: "14px 18px", boxShadow: "0 12px 24px -10px rgba(70,35,10,0.4)", border: `1.5px solid ${i % 2 ? "#F0DFA8" : CL.border}`, fontFamily: fonts.medium, fontStyle: "italic", fontSize: 26, color: CL.text, lineHeight: 1.25 }}>
                  „{typed(q.messy, t, a + 0.05, a + 0.45)}“
                </div>
              </div>
            );
          })}
          {t > durch - 0.1 ? <div style={{ position: "absolute", right: 40, top: 445, zIndex: 20 }}><InkStamp id="durch" text="DURCHEINANDER" p={k(t, durch - 0.08, 0.25)} color={C.amber} size={32} rot={-7} /></div> : null}
          <Composer t={t} focus={recOn} placeholder="Antworten …" style={{ left: 30, right: 30, bottom: 26, height: 190 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, height: 60 }}>
              {Array.from({ length: 46 }, (_, j) => {
                const live = recOn ? 0.25 + 0.75 * Math.abs(Math.sin(t * 9 + j * 0.7) * Math.cos(t * 5.3 + j * 0.31)) : 0.08;
                return <span key={j} style={{ width: 9, height: 8 + live * 50, borderRadius: 5, background: recOn ? C.orange : CL.border, opacity: 0.55 + 0.45 * live }} />;
              })}
              <span style={{ marginLeft: "auto", width: 64, height: 64, borderRadius: "50%", background: recOn ? C.red : CL.bubble, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: recOn ? `0 0 0 ${8 + 6 * Math.abs(Math.sin(t * 4))}px rgba(210,64,58,0.18)` : "none" }}>
                <Ico d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM5.5 11a6.5 6.5 0 0013 0M12 17.5V21" size={34} color={recOn ? "#FFF" : CL.text} sw={2.2} />
              </span>
            </div>
          </Composer>
        </Win>
      </div>
      <Pointer t={t} path={[{ x: 700, y: 860, at: 0 }, { x: 958, y: 712, at: sprichst - 0.2, click: true }, { x: 900, y: 860, at: besch }]} size={52} />
      <Ring t={t} at={sprichst - 0.1} x={958} y={712} r={130} color={C.red} />
      <Glint t={t} at={faellt} x={980} y={120} size={34} />
    </PanelStage>
  );
};

// ================= 4. "Claude macht daraus eine Liste. Jede Frage kurz und klar, mit dem passenden Beleg und dem Betrag. Und so gestellt, dass er sie mit Ja oder Nein beantworten kann." =================
export const SceneListe: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const liste = m("liste", 0.1), kurz = m("kurz", 0.25), beleg = m("beleg", 0.45), betrag = m("betrag", 0.58), gestellt = m("gestellt", 0.68), ja = m("ja", 0.82), nein = m("nein", 0.88);
  const fly = (i: number) => k(t, liste - 0.3 + i * 0.1, 0.45, ez);
  const rowsAt = QS.map((_, i) => liste + 0.1 + i * 0.1);
  return (
    <PanelStage t={t} dur={dur} seed={75}>
      <div style={{ position: "absolute", left: 30, top: 26, width: 1020, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Terminplaner Steuerberater" style={{ inset: 0 }} right={<Pill text={t > nein ? "4 × JA/NEIN" : "FRAGENLISTE"} color={t > nein ? "#FFF" : PK.orangeDeep} bg={t > nein ? C.green : C.orangeSoft} size={16} dot={false} />}>
          <div style={{ position: "absolute", left: 30, top: 22, display: "flex", alignItems: "center", gap: 12, ...ps(t, liste - 0.3, 8, 0.7) }}>
            <Logo name="claude" size={36} /><span style={{ fontFamily: fonts.semibold, fontSize: 27, color: CL.text }}>Deine Fragen für die Kanzlei:</span>
          </div>
          {/* column legend */}
          <div style={{ position: "absolute", left: 96, top: 82, display: "flex", gap: 18 }}>
            {[{ l: "FRAGE", a: kurz }, { l: "BELEG", a: beleg }, { l: "BETRAG", a: betrag }, { l: "JA / NEIN", a: gestellt }].map((x, i) => (
              <span key={i} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 15, letterSpacing: "0.1em", color: t > x.a - 0.05 ? PK.orangeDeep : CL.border }}>{x.l}</span>
            ))}
          </div>
          <div style={{ position: "absolute", left: 30, top: 118 }}>
            <QList t={t} rowsAt={rowsAt} belegAt={beleg - 0.05} betragAt={betrag - 0.05} jnAt={ja - 0.15} w={960} />
          </div>
        </Win>
      </div>
      {/* the messy fragments of the voice note fly into the rows */}
      {QS.map((q, i) => {
        const p = fly(i);
        if (p >= 1) return null;
        const s = FRAG_POS[i];
        return (
          <div key={i} style={{ position: "absolute", left: s.x + (60 - s.x) * p, top: s.y + (200 + i * 112 - s.y) * p, maxWidth: 400, zIndex: 30, opacity: 1 - p * 0.9, transform: `rotate(${s.r * (1 - p)}deg) scale(${1 - 0.3 * p})` }}>
            <div style={{ background: i % 2 ? "#FFF6D9" : "#FFF", borderRadius: 14, padding: "14px 18px", boxShadow: "0 12px 24px -10px rgba(70,35,10,0.4)", fontFamily: fonts.medium, fontStyle: "italic", fontSize: 26, color: CL.text }}>„{q.messy}“</div>
          </div>
        );
      })}
      {t > nein ? <div style={{ position: "absolute", right: 46, top: 700, zIndex: 30 }}><InkStamp id="jn" text="JA ODER NEIN" p={k(t, nein, 0.25)} color={C.green} size={34} rot={-6} /></div> : null}
      <Beispiel style={{ left: 50, top: 760 }} />
      <Ring t={t} at={beleg} x={420} y={260} r={170} />
      <Ring t={t} at={ja} x={930} y={260} r={150} color={C.green} />
      <Glint t={t} at={betrag + 0.1} x={600} y={260} size={32} />
    </PanelStage>
  );
};

// ================= 5. "Die Liste geht vorher per Mail an deinen Steuerberater. Im Termin geht es dann nur noch um die Antworten." =================
export const SceneMail: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const vorher = m("vorher", 0.12), mail = m("mail", 0.25), stb = m("stb", 0.38), termin = m("termin", 0.55), antworten = m("antworten", 0.85);
  const send = mail + 0.15;
  const flyP = k(t, send + 0.15, 0.55, Easing.in(Easing.cubic));
  const P2 = Math.min(termin - 0.25, send + 0.55);
  const phase2 = k(t, P2, 0.4, ez);
  return (
    <PanelStage t={t} dur={dur} seed={76}>
      {/* mail compose (Outlook-neutral, light) */}
      {phase2 < 1 ? (
        <div style={{ position: "absolute", left: 60, top: 40, width: 960, height: 740, opacity: 1 - phase2, transform: `${tilt(t, 4, 0)} translate(${flyP * 700}px, ${-flyP * 500}px) scale(${1 - 0.6 * flyP}) rotate(${flyP * 14}deg)`, transformOrigin: "50% 50%" }}>
          <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `1px solid ${CL.border}`, overflow: "hidden" }}>
            <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", background: "#F7F5F0", borderBottom: `1px solid ${CL.border}` }}>
              <Ico d={I2.mail} size={30} color={PK.orangeDeep} />
              <span style={{ fontFamily: fonts.semibold, fontSize: 25, color: CL.text }}>Neue Nachricht</span>
              <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: t > send ? C.green : "#2A6FDB", color: "#FFF", borderRadius: 12, padding: "8px 20px", fontFamily: fonts.bold, fontSize: 22, transform: `scale(${t > send - 0.05 && t < send + 0.1 ? 0.9 : 1})` }}><Ico d={I2.send} size={22} color="#FFF" sw={2.2} />{t > send ? "Gesendet" : "Senden"}</span>
            </div>
            <div style={{ padding: "16px 28px" }}>
              {[{ l: "An", v: "kanzlei@muster-stb.de" }, { l: "Betreff", v: "Fragen für unseren Termin am 12.11." }].map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 14, height: 50, alignItems: "center", borderBottom: "1px solid #EFEBE4" }}>
                  <span style={{ width: 90, fontFamily: fonts.medium, fontSize: 21, color: CL.sub }}>{r.l}</span>
                  <span style={{ fontFamily: fonts.semibold, fontSize: 23, color: CL.text, whiteSpace: "nowrap" }}>{typed(r.v, t, vorher - 0.4 + i * 0.25, vorher + i * 0.25)}</span>
                </div>
              ))}
              <div style={{ fontFamily: fonts.medium, fontSize: 21, color: CL.text, marginTop: 14 }}>Guten Tag Frau Muster, hier meine Fragen, jede mit Ja oder Nein zu beantworten:</div>
              {QS.map((q, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, height: 46, fontFamily: fonts.semibold, fontSize: 21, color: CL.text, ...ps(t, -0.2 + i * 0.08, 8, 0.8) }}>
                  <span style={{ fontFamily: MONO, fontWeight: 800, color: PK.orangeDeep }}>{i + 1}.</span>{q.q}<span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 19 }}>{q.betrag}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                {QS.map((q, i) => <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F3EFE8", borderRadius: 10, padding: "5px 12px 5px 6px", ...ps(t, mail - 0.3 + i * 0.07, 8, 0.6) }}><PdfIcon size={26} /><span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15, color: CL.text }}>{q.beleg}</span></span>)}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {t > stb - 0.2 && phase2 < 1 ? (
        <div style={{ position: "absolute", left: 640, top: 600, zIndex: 20, opacity: 1 - phase2, ...ps(t, stb - 0.2, 10, 0.6) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "10px 22px 10px 12px", fontFamily: fonts.bold, fontSize: 24 }}>
            <span style={{ width: 40, height: 40, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M5 12.5l4.5 4.5L19 7.5" size={24} color="#FFF" sw={2.6} /></span>
            3 Tage vor dem Termin
          </div>
        </div>
      ) : null}
      {/* in the meeting: only answers */}
      {phase2 > 0 ? (
        <div style={{ position: "absolute", left: 40, top: 30, width: 1000, height: 760, opacity: phase2, transform: `${tilt(t, 3, 0)} scale(${0.94 + 0.06 * phase2})` }}>
          <div style={{ position: "absolute", inset: 0, background: CL.page, borderRadius: 26, boxShadow: paperShadow, border: `1px solid ${CL.border}`, padding: "20px 22px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M7 3v3M17 3v3M4 7h16v13H4zM4 11h16" size={26} color={PK.orangeDeep} sw={2} /></span>
              <span style={{ fontFamily: fonts.bold, fontSize: 28, color: PK.ink }}>Termin · Do 12.11.</span>
              <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: C.green, color: "#FFF", borderRadius: 12, padding: "6px 16px", fontFamily: MONO, fontWeight: 800, fontSize: 24, fontVariantNumeric: "tabular-nums" }}>
                {mmss(interpolate(t, [termin, antworten + 0.8], [0, 9.8], clamp))} / 10:00
              </span>
            </div>
            <QList t={t} rowsAt={[P2, P2 + 0.06, P2 + 0.12, P2 + 0.18]} belegAt={P2} betragAt={P2} jnAt={P2} answersAt={antworten - 0.35} w={956} />
          </div>
        </div>
      ) : null}
      {t > antworten - 0.1 ? <div style={{ position: "absolute", left: 560, top: 690, zIndex: 30 }}><InkStamp id="antw" text="NUR ANTWORTEN" p={k(t, antworten - 0.08, 0.25)} color={C.green} size={34} rot={-6} /></div> : null}
      <Pointer t={t} path={[{ x: 500, y: 860, at: 0 }, { x: 920, y: 110, at: send - 0.05, click: true }, { x: 980, y: 400, at: termin }]} size={52} />
      <Ring t={t} at={send} x={920} y={110} r={150} color={C.green} />
      <Beispiel style={{ left: 50, top: 770 }} />
      <Glint t={t} at={antworten} x={1000} y={140} size={34} />
    </PanelStage>
  );
};

// ================= 6. "Nach dem Termin schreibt Claude dir auf, was ihr besprochen habt und bis wann du was erledigen musst." =================
const TODOS = [
  { was: "Handy-Rechnungen 2026 nachreichen", wer: "Ich", bis: "Fr 20.11." },
  { was: "Antrag Vorauszahlung Q4", wer: "Kanzlei", bis: "Mo 30.11." },
  { was: "Neue Bewirtungsbelege mit Anlass", wer: "Ich", bis: "laufend" },
];
export const SceneProtokoll: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const schreibt = m("schreibt", 0.2), besprochen = m("besprochen", 0.45), wann = m("wann", 0.7), erledigen = m("erledigen", 0.85);
  const todoAt = (i: number) => besprochen + 0.2 + i * Math.max(0.15, (wann - besprochen - 0.1) / 3);
  return (
    <PanelStage t={t} dur={dur} seed={77}>
      <div style={{ position: "absolute", left: -60, top: 60, width: 520, height: 760 }}>
        <DeadlineCalendar3D t={t} w={520} h={760} dates={["2026-11-12", "2026-11-16", "2026-11-20"]} flipFrom={wann - 0.6} flipTo={wann - 0.05} ring={erledigen - 0.05} />
      </div>
      <div style={{ position: "absolute", left: 400, top: 30, width: 650, height: 770, transform: tilt(t, 3, -6), zIndex: 5 }}>
        <Win title="Protokoll" crumb="Terminplaner" style={{ inset: 0 }} right={<Pill text="12.11." color={PK.orangeDeep} bg={C.orangeSoft} size={15} dot={false} />}>
          <div style={{ position: "absolute", left: 22, right: 22, top: 18, bottom: 18, background: `linear-gradient(160deg, #FFF, ${PK.paper})`, borderRadius: 12, boxShadow: paperShadow, padding: "18px 22px", boxSizing: "border-box", overflow: "hidden", ...ps(t, schreibt - 0.3, 16, 0.9) }}>
            <Mono text="BESPROCHEN" size={14} />
            {QS.map((q, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, height: 40, fontFamily: fonts.medium, fontSize: 19, color: CL.text, ...ps(t, schreibt - 0.1 + i * 0.12, 8, 0.8) }}>
                <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 13, color: "#FFF", background: ANS_C(q.a), borderRadius: 6, padding: "2px 7px", minWidth: 40, textAlign: "center" }}>{q.a}</span>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{q.q}</span>
              </div>
            ))}
            <div style={{ marginTop: 14, ...ps(t, besprochen, 8, 0.8) }}><Mono text="TO-DOS · WER · BIS WANN" size={14} /></div>
            {TODOS.map((td, i) => {
              const a = todoAt(i);
              const hot = i === 0 && t > wann - 0.05;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, background: hot ? C.redSoft : "#FFF", border: `1.5px solid ${hot ? C.red : CL.border}`, borderRadius: 12, padding: "10px 12px", ...ps(t, a, 10, 0.8) }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${CL.sub}` }} />
                  <span style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 19, color: CL.text, whiteSpace: "nowrap", overflow: "hidden" }}>{typed(td.was, t, a, a + 0.3)}</span>
                  <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 14, color: CL.sub }}>{td.wer.toUpperCase()}</span>
                  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 17, color: hot ? "#FFF" : CL.text, background: hot ? C.red : "#F3EFE8", borderRadius: 8, padding: "3px 8px", whiteSpace: "nowrap" }}>{td.bis}</span>
                </div>
              );
            })}
            <Sheen p={k(t, erledigen, 0.7)} />
          </div>
        </Win>
      </div>
      {t > erledigen - 0.06 ? <div style={{ position: "absolute", left: 120, top: 40, zIndex: 30 }}><InkStamp id="frist" text="FRIST 20.11." p={k(t, erledigen - 0.04, 0.25)} color={C.red} size={36} rot={-8} /></div> : null}
      <Beispiel style={{ left: 40, top: 770 }} />
      <Ring t={t} at={wann} x={780} y={500} r={200} color={C.red} />
      <Glint t={t} at={erledigen + 0.1} x={1000} y={130} size={34} />
    </PanelStage>
  );
};

// ================= 7. guide background (PDF scroll sits on top) =================
export const SceneGuideBg: React.FC<SceneP> = ({ t, dur }) => (
  <PanelStage t={t} dur={dur} seed={79}>
    <Glint t={t} at={0.4} x={110} y={200} size={34} />
  </PanelStage>
);

export { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, Pill, PK, InkStamp, Odometer, CheckDot };
