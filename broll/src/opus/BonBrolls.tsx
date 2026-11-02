import React from "react";
import { Easing, interpolate } from "remotion";
import { fonts } from "../theme";
import { PK, paperShadow, Highlight, Sheen, InkStamp, Paper } from "./PremiumKit";
import { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, tilt, Logo, Mono, Pill, CheckDot, Ico, Glint, Ring, Pointer, PanelStage, Odometer } from "./DuetBrolls";
import { Win, Beispiel, I2, TopTag, Composer } from "./KontoBrolls";
import { BonScene3D, drawReceipt, bonSm as sm, bonLerp as lerp, PhonePose } from "./BonObjects3D";

// FP-N "Belegkasse" (2026-11-01) - split-panel scenes (1080 x 820), pure functions of (t, dur, at);
// BonOpus anchors `at` to captions.json word times. All firms, people and amounts are invented (BEISPIEL).

export type SceneP = { t: number; dur: number; at?: Record<string, number> };
const mk = (dur: number, at: Record<string, number> | undefined) => (name: string, frac: number) => (at && at[name] !== undefined ? at[name] : frac * dur);
const ez = Easing.inOut(Easing.cubic);
const IC2 = {
  camera: "M4 8h3l1.5-2.5h7L17 8h3v11H4zM12 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
  users: "M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.3a3.5 3.5 0 010 6.4M18 14.8c2 .6 3.2 2.4 3.5 5.2",
  table: "M3.5 5h17v14h-17zM3.5 10h17M3.5 14.5h17M9.5 5v14",
  tag: "M3 12V4h8l10 10-8 8zM7.5 8.5h.01",
  mic: "M12 3a3 3 0 013 3v6a3 3 0 01-6 0V6a3 3 0 013-3zM5.5 11a6.5 6.5 0 0013 0M12 17.5V21",
  cal: "M4 6h16v14H4zM4 10h16M8 3.5v4M16 3.5v4",
};

// receipt drawn on a DOM canvas (same artwork as the 3D receipt)
const ReceiptImg: React.FC<{ w: number; h: number; ink?: number; style?: React.CSSProperties }> = ({ w, h, ink = 1, style }) => (
  <canvas width={w * 2} height={h * 2} style={{ width: w, height: h, display: "block", ...style }}
    ref={(el) => { if (el) { const g = el.getContext("2d")!; g.clearRect(0, 0, w * 2, h * 2); drawReceipt(g, 0, 0, w * 2, h * 2, ink); } }} />
);
// restaurant bill (invented)
const RestaurantImg: React.FC<{ w: number; h: number; style?: React.CSSProperties }> = ({ w, h, style }) => {
  const L: [string, string][] = [["2x Vitello tonnato", "29,80"], ["2x Saltimbocca", "61,00"], ["1x Tiramisu", "8,90"], ["Speisen 7 %", "99,70"], ["1 Fl. Primitivo", "46,00"], ["2x Wasser 0,75", "15,80"], ["2x Espresso", "6,40"], ["Getränke 19 %", "68,20"]];
  return (
    <div style={{ width: w, height: h, background: "#FBFAF6", fontFamily: MONO, color: "#22201E", padding: "18px 16px", boxSizing: "border-box", ...style }}>
      <div style={{ textAlign: "center", fontWeight: 800, fontSize: 21 }}>TRATTORIA DA MARCO</div>
      <div style={{ textAlign: "center", fontSize: 11, opacity: 0.8 }}>Severinstr. 8 · 50678 Köln</div>
      <div style={{ fontSize: 12, marginTop: 10 }}>12.11.2026 21:47 · Tisch 6</div>
      <div style={{ borderTop: "1.5px dashed #999", margin: "8px 0" }} />
      {L.map(([a, b], i) => <div key={i} style={{ display: "flex", fontSize: 12.5, fontWeight: a.includes("%") ? 800 : 500, marginTop: a.includes("%") ? 2 : 0, marginBottom: a.includes("%") ? 6 : 1 }}><span>{a}</span><span style={{ marginLeft: "auto" }}>{b}</span></div>)}
      <div style={{ borderTop: "1.5px dashed #999", margin: "6px 0" }} />
      <div style={{ display: "flex", fontWeight: 800, fontSize: 18 }}><span>SUMME</span><span style={{ marginLeft: "auto" }}>167,90</span></div>
      <div style={{ fontSize: 10.5, marginTop: 8, opacity: 0.75 }}>TSE-Signatur: MEYCIQC9…</div>
      <div style={{ fontSize: 10.5, opacity: 0.75, textAlign: "center", marginTop: 8, color: "#8A6A2A", fontWeight: 800 }}>BEISPIEL</div>
    </div>
  );
};

// ================= 0. HOOK: phone with the Claude result over the counter | lost receipt costs up to 50 % =================
// pose: phone leaning toward the camera over the counter, receipt fading on the counter
const PHONE_SHOW: PhonePose = { pos: [1.15, 2.75, 0.9], rot: [-0.8, -0.22, -0.05] };
export const HookBon: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const verl = m("verlierst", 0.15), haelfte = m("haelfte", 0.3), betrag = m("betrag", 0.38), mwst = m("mwst", 0.6), absetzen = m("absetzen", 0.85);
  const ink = interpolate(t, [0, verl + 0.6], [0.95, 0.22], { ...clamp, easing: Easing.in(Easing.quad) });
  const lossP = 0.72 + 0.28 * k(t, haelfte - 0.08, 0.6, ez); // frame 0 already shows the loss
  const lost = 43.25 * lossP;
  const bob = Math.sin(t * 1.4) * 0.05;
  return (
    <PanelStage t={t} dur={dur} seed={61}>
      <div style={{ position: "absolute", left: -10, top: 120, width: 660, height: 700 }}>
        <BonScene3D t={t} w={660} h={700} ink={ink}
          cam={{ pos: [Math.sin(t * 0.25) * 0.5 - 0.2, 7.2, 7.4 - t * 0.05], look: [0.1, 1.2, -0.2], fov: 38 }}
          receipt={{ pos: [-1.9, 0.03, 0.9], rotZ: 0.32 }}
          phone={{ pos: [PHONE_SHOW.pos[0] - 0.2, PHONE_SHOW.pos[1] + bob, PHONE_SHOW.pos[2]], rot: [PHONE_SHOW.rot[0], PHONE_SHOW.rot[1] + Math.sin(t * 0.6) * 0.04, PHONE_SHOW.rot[2]] }}
          screen={{ mode: "result", rows: [1, 1, 1, 1, 1], konto: 1 }} />
      </div>
      {/* saved chip next to the phone */}
      <div style={{ position: "absolute", left: 360, top: 690, zIndex: 22, ...ps(t, -0.3, 8, 0.9) }}><Pill text="IN CLAUDE GESICHERT" color="#FFF" bg={C.green} size={18} dot={false} /></div>
      <div style={{ position: "absolute", left: 40, top: 600, zIndex: 22, opacity: k(t, verl, 0.3) }}><Pill text="VERBLASST" color={C.red} bg={C.redSoft} size={16} dot={false} /></div>
      {/* loss card */}
      <div style={{ position: "absolute", left: 620, top: 248, width: 420, zIndex: 21, transform: `${tilt(t, 3, -8)} scale(${1 + 0.05 * pop(t, haelfte - 0.06, 0.3) * (1 - k(t, betrag + 0.4, 0.3))})`, ...ps(t, -0.3, 10, 0.9) }}>
        <div style={{ background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `2px solid ${t > haelfte - 0.05 ? C.red : CL.border}`, padding: "20px 24px", position: "relative", overflow: "hidden" }}>
          <Mono text="TANKBON · VERLOREN" size={16} color={C.red} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 4 }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 52, color: PK.ink, letterSpacing: "-0.02em" }}>84,37 €</span>
            <span style={{ fontFamily: fonts.medium, fontSize: 20, color: CL.sub }}>brutto</span>
          </div>
          {/* loss bar */}
          <div style={{ marginTop: 10, height: 26, borderRadius: 13, background: "#F3EEE6", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${51 * lossP}%`, background: `linear-gradient(90deg, #E5605A, ${C.red})`, borderRadius: 13 }} />
            <div style={{ position: "absolute", left: "50%", top: -2, bottom: -2, width: 3, background: PK.ink, opacity: 0.5 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
            <Odometer value={lost} size={36} color={C.red} speed={t > haelfte && t < haelfte + 0.6 ? 0.7 : 0} prefix="−" suffix=" €" />
            <span style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 26, color: "#FFF", background: C.red, borderRadius: 10, padding: "3px 12px", transform: `scale(${0.6 + 0.4 * pop(t, haelfte, 0.35)})`, opacity: k(t, haelfte - 0.05, 0.15), whiteSpace: "nowrap" }}>≈ die Hälfte</span>
          </div>
          {[
            { a: mwst, l: "Vorsteuer 19 %", v: "−13,47 €" },
            { a: absetzen, l: "Steuer absetzen", v: "−29,78 €" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, height: 50, borderTop: "1px solid #EFEBE4", marginTop: i ? 0 : 10, transform: `scale(${1 + 0.06 * pop(t, r.a - 0.1, 0.35)})`, transformOrigin: "0% 50%" }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: fonts.bold, fontSize: 18 }}>✕</span>
              <span style={{ fontFamily: fonts.semibold, fontSize: 23, color: CL.text, whiteSpace: "nowrap" }}>{r.l}</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 23, color: C.red }}>{r.v}</span>
            </div>
          ))}
          <div style={{ fontFamily: fonts.medium, fontSize: 15, color: CL.sub, marginTop: 4 }}>Beispiel: 42 % Steuersatz auf 70,90 € netto</div>
          <Sheen p={k(t, haelfte, 0.6)} />
        </div>
      </div>
      <Beispiel style={{ left: 620, top: 210 }} />
      <Ring t={t} at={haelfte - 0.04} x={830} y={450} r={240} color={C.red} />
      <Glint t={t} at={0.3} x={560} y={300} size={34} />
      <Glint t={t} at={mwst + 0.1} x={1010} y={560} size={30} />
      <Glint t={t} at={absetzen + 0.1} x={1010} y={610} size={30} />
    </PanelStage>
  );
};

// ================= 1. "Folg mir, wenn du keins meiner Systeme mehr verpassen willst." =================
export const SceneFollow: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const mir = m("mir", 0.08), systeme = m("systeme", 0.45), verpassen = m("verpassen", 0.7);
  const followed = t > mir + 0.28;
  const SYS = [
    { n: "Belegsammler", s: "Rechnungen im Ordner", ic: I2.folder },
    { n: "Gebührencheck", s: "Kontoauszug geprüft", ic: I2.card },
    { n: "Belegkasse", s: "NEU", ic: IC2.camera, hot: true },
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

// ================= 2. "Denn dafür habe ich ein komplettes System entwickelt: die Belegkasse in Claude." =================
export const SceneSystem: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const mods = [m("m1", 0.1), m("m2", 0.3), m("m3", 0.42), m("m4", 0.55)];
  const title = m("title", 0.62), claude = m("claude", 0.9);
  const tile = (d: string, bg: string, col: string) => <div style={{ width: 60, height: 60, borderRadius: 16, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={d} size={32} color={col} sw={2} /></div>;
  const MODS: { x: number; y: number; logo: React.ReactNode; h: string; s: string; from: [number, number] }[] = [
    { x: 40, y: 96, logo: tile(IC2.camera, C.orange, "#FFF"), h: "Foto", s: "direkt an der Kasse", from: [-300, -80] },
    { x: 780, y: 96, logo: tile(IC2.tag, C.orangeSoft, PK.orangeDeep), h: "Konto", s: "SKR03 / SKR04", from: [300, -80] },
    { x: 40, y: 590, logo: tile(IC2.users, "#E7EEF9", "#2C5FB0"), h: "Geschäftsessen", s: "mit wem, warum", from: [-300, 80] },
    { x: 780, y: 590, logo: tile(IC2.table, C.greenSoft, C.green), h: "Monatsliste", s: "fertige Tabelle", from: [300, 80] },
  ];
  const CARD = { x: 290, y: 255, w: 500, h: 300 };
  const anchors = [[CARD.x, CARD.y + 50], [CARD.x + CARD.w, CARD.y + 50], [CARD.x, CARD.y + CARD.h - 50], [CARD.x + CARD.w, CARD.y + CARD.h - 50]];
  const tileC = (i: number) => [MODS[i].x + (i % 2 === 0 ? 260 : 0), MODS[i].y + 50];
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
            <Ico d={IC2.camera} size={28} color={CL.sub} />
            <Mono text="MEIN SYSTEM" size={18} />
            {t > claude - 0.05 ? <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: CL.bubble, borderRadius: 999, padding: "5px 14px 5px 8px", fontFamily: fonts.semibold, fontSize: 22, color: CL.text, ...ps(t, claude, 8, 0.5) }}><Logo name="claude" size={26} />in Claude</span> : null}
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 64, color: PK.ink, marginTop: 18, lineHeight: 1, minHeight: 64, whiteSpace: "nowrap" }}>
            {typed("Belegkasse", t, title - 0.15, title + 0.45) || <span style={{ color: CL.border }}>Belegkasse</span>}
          </div>
          <div style={{ fontFamily: fonts.medium, fontSize: 25, color: CL.sub, marginTop: 16 }}>Jeder Bon. Ein Foto.</div>
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
                <div style={{ fontFamily: fonts.bold, fontSize: md.h.length > 10 ? 24 : 28, color: PK.ink, whiteSpace: "nowrap" }}>{md.h}</div>
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

// ================= 3. "Du bekommst einen Bon und machst direkt an der Kasse ein Foto in der Claude-App." (3D) =================
export const SceneKasse: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const bon = m("bon", 0.2), machst = m("machst", 0.3), kasse = m("kasse", 0.55), foto = m("foto", 0.75), app = m("app", 0.9);
  const slide = k(t, bon - 0.45, 0.5, Easing.out(Easing.cubic));
  // phone: from above → hovering flat over the receipt (camera) → after the shot rises and turns to the viewer (result)
  const down = sm((t - (machst - 0.2)) / 0.6);
  const up = sm((t - (foto + 0.25)) / 0.55);
  const hover: PhonePose = { pos: [0.05, 2.35, 0.75], rot: [-1.38, 0, 0.04] };
  const start: PhonePose = { pos: [0.9, 3.2, -0.6], rot: [-1.25, 0.15, 0.25] };
  const show: PhonePose = { pos: [0.9, 1.7, 0.6], rot: [-0.95, -0.2, -0.04] };
  const P = (a: PhonePose, b: PhonePose, u: number): PhonePose => ({ pos: [0, 1, 2].map((i) => lerp(a.pos[i], b.pos[i], u)) as [number, number, number], rot: [0, 1, 2].map((i) => lerp(a.rot[i], b.rot[i], u)) as [number, number, number] });
  const pose = up > 0 ? P(hover, show, up) : P(start, hover, down);
  const flash = t > foto - 0.05 && t < foto + 0.3 ? 1 - (t - foto + 0.05) / 0.35 : 0;
  const aim = k(t, machst + 0.2, Math.max(0.3, kasse - machst), ez);
  const mode = t < foto + 0.3 ? "camera" : "result";
  const sent = k(t, foto + 0.3, 0.3);
  const rowsP = [0, 1, 2, 3, 4].map((i) => k(t, app + 0.15 + i * 0.1, 0.2));
  const cam = { pos: [lerp(-0.3, 0.4, sm(t / dur)), lerp(8.4, 7.4, sm(t / dur)), lerp(5.2, 6.2, sm(t / dur))] as [number, number, number], look: [0.2, 0.9, -0.1] as [number, number, number], fov: 40 };
  return (
    <PanelStage t={t} dur={dur} seed={64}>
      <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH }}>
        <BonScene3D t={t} w={PW} h={PH} cam={cam} receipt={{ pos: [-0.05, 0.03, 0.75], rotZ: 0.05, slide }} phone={pose}
          screen={{ mode, aim, flash: Math.max(0, flash), rows: rowsP, konto: 0, sent }} />
      </div>
      {flash > 0 ? <div style={{ position: "absolute", inset: 0, background: "#FFF", opacity: flash * 0.55, zIndex: 30 }} /> : null}
      <TopTag t={t} text="AN DER KASSE" at={-0.1} style={{ left: 40, top: 30 }} />
      {t > foto + 0.25 ? <div style={{ position: "absolute", left: 40, top: 100, zIndex: 25, display: "flex", alignItems: "center", gap: 10, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 999, padding: "8px 20px 8px 10px", boxShadow: paperShadow, ...ps(t, foto + 0.25, 10, 0.7) }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: "linear-gradient(160deg, #F7F4EC, #EEE9DE)", display: "flex", alignItems: "center", justifyContent: "center" }}><Logo name="claude" size={28} /></div>
        <span style={{ fontFamily: fonts.bold, fontSize: 25, color: CL.text }}>Claude-App</span><CheckDot size={26} p={k(t, foto + 0.4, 0.3)} />
      </div> : null}
      <div style={{ position: "absolute", right: 40, top: 34, zIndex: 25, display: "flex", alignItems: "center", gap: 8, ...ps(t, kasse - 0.1, 8, 0.7) }}><Pill text="1 FOTO · 2 SEK." color={PK.orangeDeep} bg={C.orangeSoft} size={18} dot={false} /></div>
      <Beispiel style={{ right: 40, bottom: 34 }} />
      <Ring t={t} at={foto} x={540} y={420} r={300} color="#FFF" />
      <Glint t={t} at={foto + 0.1} x={720} y={260} size={44} />
    </PanelStage>
  );
};

// ================= 4. "Claude liest Firma, Datum, Betrag und Mehrwertsteuer und schreibt das passende Konto dazu." =================
// receipt-photo coordinates (fractions of the receipt height) of the fields Claude reads
const FIELD_Y = [[0.04, 0.13], [0.21, 0.245], [0.405, 0.455], [0.47, 0.505], [0.31, 0.37]];
export const SceneLiest: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const liest = m("liest", 0.08), firma = m("firma", 0.18), datum = m("datum", 0.3), betrag = m("betrag", 0.42), mwst = m("mwst", 0.55), schreibt = m("schreibt", 0.72), passende = m("passende", 0.82), konto = m("konto", 0.9);
  const marks = [firma, datum, betrag, mwst, konto];
  const ROWS: [string, string, string][] = [["FIRMA", "Tankstelle Am Ring", ""], ["DATUM", "03.11.2026", "08:14"], ["BETRAG", "84,37 €", "brutto"], ["MWST.", "19 % · 13,47 €", "netto 70,90 €"], ["KONTO", "4530 · Kfz laufend", "SKR04: 6530"]];
  const HLC = ["rgba(217,119,87,0.30)", "rgba(62,123,217,0.25)", "rgba(30,158,87,0.25)", "rgba(217,144,30,0.30)", "rgba(217,119,87,0.30)"];
  const scan = interpolate(t, [liest - 0.1, mwst + 0.3], [0, 1], clamp);
  const PHOTO = { x: 40, y: 34, w: 300, h: 640 };
  const ROW0 = { x: 400, y: 130, h: 96 };
  const cur = marks.reduce((acc, a, i) => (t > a - 0.08 ? i : acc), -1);
  return (
    <PanelStage t={t} dur={dur} seed={65}>
      <div style={{ position: "absolute", left: 24, top: 22, width: 1032, height: 778, transform: tilt(t, 3, 0), transformOrigin: "50% 100%" }}>
        <Win title="Belegkasse" style={{ inset: 0 }} right={<Pill text="BELEGE 2026-11" color={PK.orangeDeep} bg={C.orangeSoft} size={16} dot={false} />}>
          {/* user photo bubble */}
          <div style={{ position: "absolute", left: PHOTO.x - 14, top: PHOTO.y - 14, width: PHOTO.w + 28, height: PHOTO.h + 28, background: CL.bubble, borderRadius: 26, ...ps(t, -0.25, 12, 0.9) }}>
            <div style={{ position: "absolute", left: 14, top: 14, width: PHOTO.w, height: PHOTO.h, borderRadius: 16, overflow: "hidden", background: "#C9BFAF" }}>
              <ReceiptImg w={PHOTO.w - 40} h={PHOTO.h - 20} style={{ position: "absolute", left: 20, top: 10, transform: "rotate(-1.2deg)", boxShadow: "0 8px 18px rgba(0,0,0,0.25)" }} />
              {marks.map((a, i) => {
                const p = k(t, a - 0.08, 0.2);
                const [y0, y1] = FIELD_Y[i];
                return p > 0 ? <div key={i} style={{ position: "absolute", left: 26, width: PHOTO.w - 52, top: 10 + y0 * (PHOTO.h - 20) - 4, height: (y1 - y0) * (PHOTO.h - 20) + 8, border: `3px solid ${i === cur ? C.orange : "rgba(217,119,87,0.55)"}`, background: HLC[i], borderRadius: 8, opacity: p, transform: `scale(${1.15 - 0.15 * p})` }} /> : null;
              })}
              {scan > 0 && scan < 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: scan * PHOTO.h - 3, height: 6, background: C.orange, boxShadow: `0 0 26px 8px rgba(217,119,87,0.55)` }} /> : null}
            </div>
          </div>
          {/* Claude answer: one row per field */}
          <div style={{ position: "absolute", left: ROW0.x, top: 28, display: "flex", alignItems: "center", gap: 12, ...ps(t, liest - 0.2, 8, 0.8) }}>
            <Logo name="claude" size={36} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 27, color: CL.text }}>{t < firma ? "Lese den Bon …" : "Gelesen. Eine Zeile für die Liste:"}</span>
          </div>
          <div style={{ position: "absolute", left: ROW0.x, right: 26, top: ROW0.y - 20, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 22, padding: "10px 22px", boxShadow: "0 14px 34px rgba(20,20,20,0.06)" }}>
            {ROWS.map(([lab, val, sub], i) => {
              const p = k(t, marks[i] - 0.05, 0.25);
              const isK = i === 4;
              return (
                <div key={i} style={{ height: ROW0.h, display: "flex", alignItems: "center", gap: 14, borderTop: i ? "1px solid #EFEBE4" : "none", opacity: 0.15 + 0.85 * p, transform: `translateX(${(1 - p) * 24}px)` }}>
                  <span style={{ width: 120, fontFamily: MONO, fontWeight: 800, fontSize: 19, letterSpacing: "0.1em", color: i === cur ? PK.orangeDeep : CL.sub }}>{lab}</span>
                  {isK ? (
                    <span style={{ fontFamily: fonts.bold, fontSize: 31, color: "#FFF", background: C.orange, borderRadius: 12, padding: "6px 16px", whiteSpace: "nowrap", transform: `scale(${0.7 + 0.3 * pop(t, konto - 0.05, 0.4)})`, transformOrigin: "0% 50%" }}>{val}</span>
                  ) : (
                    <span style={{ position: "relative", fontFamily: fonts.bold, fontSize: 33, color: CL.text, whiteSpace: "nowrap" }}><Highlight p={k(t, marks[i], 0.3)} color={HLC[i]} /><span style={{ position: "relative" }}>{val}</span></span>
                  )}
                  {sub ? <span style={{ marginLeft: "auto", fontFamily: fonts.medium, fontSize: 20, color: CL.sub, whiteSpace: "nowrap" }}>{sub}</span> : null}
                  <span style={{ marginLeft: sub ? 6 : "auto" }}><CheckDot size={26} p={k(t, marks[i] + 0.15, 0.25)} /></span>
                </div>
              );
            })}
          </div>
          {t > schreibt - 0.1 ? <div style={{ position: "absolute", left: ROW0.x, top: ROW0.y + 5 * ROW0.h + 10, display: "flex", alignItems: "center", gap: 10, ...ps(t, schreibt - 0.1, 8, 0.7) }}>
            <Pill text="KONTO PASSEND ZUGEORDNET" color={C.green} bg={C.greenSoft} size={17} />
            <span style={{ fontFamily: fonts.medium, fontSize: 19, color: CL.sub }}>Vorschlag für die Kanzlei</span>
          </div> : null}
        </Win>
        {t > passende ? <div style={{ position: "absolute", right: 40, top: 580, zIndex: 30 }}><InkStamp id="konto" text="KONTO ✓" p={k(t, passende, 0.25)} color={C.green} size={44} rot={-10} /></div> : null}
      </div>
      <Beispiel style={{ left: 380, bottom: 30 }} />
      <Ring t={t} at={konto} x={620} y={560} r={200} />
      <Glint t={t} at={betrag + 0.1} x={1000} y={330} size={32} />
      <Glint t={t} at={konto + 0.15} x={780} y={560} size={34} />
    </PanelStage>
  );
};

// ================= 5. "Bei einem Geschäftsessen fragt Claude sofort, mit wem und warum." =================
export const SceneEssen: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const essen = m("essen", 0.25), fragt = m("fragt", 0.4), sofort = m("sofort", 0.55), wem = m("wem", 0.72), warum = m("warum", 0.9);
  const Q = [{ q: "Mit wem?", a: wem - 0.12, ic: IC2.users }, { q: "Warum?", a: warum - 0.1, ic: I2.doc }, { q: "Trinkgeld?", a: warum + 0.22, ic: I2.card }];
  return (
    <PanelStage t={t} dur={dur} seed={66}>
      <div style={{ position: "absolute", left: 24, top: 22, width: 1032, height: 778, transform: tilt(t, 3, 0), transformOrigin: "50% 100%" }}>
        <Win title="Belegkasse" style={{ inset: 0 }} right={<Pill text="BELEGE 2026-11" color={PK.orangeDeep} bg={C.orangeSoft} size={16} dot={false} />}>
          <div style={{ position: "absolute", left: 26, top: 22, width: 300, height: 600, background: CL.bubble, borderRadius: 26, padding: 14, boxSizing: "border-box", ...ps(t, -0.3, 30, 0.9) }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 16, overflow: "hidden", background: "#3A2B22", position: "relative" }}>
              <RestaurantImg w={236} h={510} style={{ position: "absolute", left: 18, top: 28, transform: "rotate(2deg)", boxShadow: "0 10px 22px rgba(0,0,0,0.4)" }} />
            </div>
          </div>
          {t > essen - 0.1 ? <div style={{ position: "absolute", left: 60, top: 560, zIndex: 5, ...ps(t, essen - 0.1, 10, 0.6) }}><Pill text="GESCHÄFTSESSEN?" color="#FFF" bg="#2C5FB0" size={18} dot={false} /></div> : null}
          {/* Claude asks */}
          <div style={{ position: "absolute", left: 370, right: 30, top: 30, ...ps(t, fragt - 0.15, 10, 0.8) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="claude" size={36} /><span style={{ fontFamily: fonts.semibold, fontSize: 27, color: CL.text }}>{typed("Trattoria, 167,90 €. Sieht nach Geschäftsessen aus.", t, fragt - 0.1, sofort + 0.25)}</span></div>
            <div style={{ fontFamily: fonts.medium, fontSize: 26, color: CL.sub, marginTop: 14, marginLeft: 48, opacity: k(t, sofort, 0.25) }}>Kurz, solange du es noch weißt:</div>
          </div>
          {Q.map((q, i) => (
            <div key={i} style={{ position: "absolute", left: 418, top: 190 + i * 112, width: 560, ...ps(t, q.a, 16, 0.6), transform: `${(ps(t, q.a, 16, 0.6).transform as string) ?? ""} scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - q.a - 0.25) / 0.25)})` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#FFF", border: `2px solid ${C.orange}`, borderRadius: 20, padding: "16px 22px", boxShadow: "0 14px 30px -12px rgba(120,60,30,0.35)" }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={q.ic} size={30} color={PK.orangeDeep} sw={2} /></div>
                <span style={{ fontFamily: fonts.bold, fontSize: 36, color: PK.ink }}>{q.q}</span>
                <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 18, color: PK.orangeDeep }}>{`0${i + 1}`}</span>
              </div>
            </div>
          ))}
          {/* voice answer */}
          {t > warum + 0.45 ? <div style={{ position: "absolute", left: 418, top: 540, width: 560, zIndex: 4, ...ps(t, warum + 0.45, 10, 0.8) }}>
            <div style={{ background: CL.bubble, borderRadius: 22, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={IC2.mic} size={26} color="#FFF" sw={2} /></div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, height: 40 }}>
                {Array.from({ length: 22 }, (_, j) => <span key={j} style={{ width: 5, borderRadius: 3, background: "#B4532F", height: 8 + 26 * Math.abs(Math.sin(j * 1.7 + t * 9)) * (t < warum + 1.3 ? 1 : 0.3) }} />)}
              </div>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 700, fontSize: 18, color: CL.sub }}>0:06</span>
            </div>
          </div> : null}
        </Win>
      </div>
      <Beispiel style={{ left: 50, bottom: 40 }} />
      <Ring t={t} at={sofort} x={560} y={140} r={200} />
      {Q.map((q, i) => <Glint key={i} t={t} at={q.a + 0.2} x={980} y={230 + i * 112} size={28} />)}
    </PanelStage>
  );
};

// ================= 6. "Das braucht dein Steuerberater, und in drei Monaten weißt du es nicht mehr." =================
export const SceneGedaechtnis: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const stb = m("stb", 0.2), drei = m("drei", 0.5), monaten = m("monaten", 0.58), weisst = m("weisst", 0.7), nicht = m("nicht", 0.85);
  const F: [string, string][] = [["ORT", "Trattoria da Marco, Köln"], ["TAG", "12.11.2026"], ["TEILNEHMER", "M. Weber (Weber GmbH), ich"], ["ANLASS", "Rahmenvertrag 2027 verhandelt"], ["HÖHE", "167,90 € + 10,00 € Trinkgeld"]];
  const MONTHS = ["NOV 2026", "DEZ 2026", "JAN 2027", "FEB 2027"];
  const mi = Math.min(3, Math.floor(interpolate(t, [drei - 0.1, monaten + 0.4], [0, 3.99], clamp)));
  const flip = (t - (drei - 0.1)) * 4 % 1;
  const blur = interpolate(t, [weisst - 0.2, nicht + 0.1], [0, 7], clamp);
  return (
    <PanelStage t={t} dur={dur} seed={67}>
      {/* Bewirtungsbeleg (left) */}
      <div style={{ position: "absolute", left: 40, top: 60, width: 560, height: 700, transform: tilt(t, 3, 6), ...ps(t, -0.25, 20, 0.9) }}>
        <Paper style={{ inset: 0, padding: "28px 30px", boxSizing: "border-box" }}>
          <Mono text="BEWIRTUNGSBELEG" size={18} color={PK.orangeDeep} />
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 40, color: PK.ink, marginTop: 6 }}>Geschäftsessen</div>
          {F.map(([a, b], i) => (
            <div key={i} style={{ marginTop: 14, borderBottom: "1.5px solid #EDE5D8", paddingBottom: 8, ...ps(t, 0.05 + i * 0.12, 8, 0.85) }}>
              <Mono text={a} size={14} />
              <div style={{ position: "relative", display: "inline-block", fontFamily: fonts.bold, fontSize: 25, color: PK.ink, marginTop: 2 }}>
                {i === 2 || i === 3 ? <Highlight p={k(t, 0.3 + i * 0.12, 0.3)} /> : null}<span style={{ position: "relative" }}>{b}</span>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <Pill text="70 % · 4650" color={C.green} bg={C.greenSoft} size={16} dot={false} />
            <Pill text="30 % · 4654" color={CL.sub} bg="#EFEBE4" size={16} dot={false} />
          </div>
        </Paper>
        {t > stb - 0.05 ? <div style={{ position: "absolute", right: -30, bottom: 70, zIndex: 5 }}><InkStamp id="stb" text="FÜR DEN STEUERBERATER" p={k(t, stb - 0.03, 0.25)} color={C.green} size={30} rot={-9} /></div> : null}
      </div>
      {/* calendar + memory (right) */}
      <div style={{ position: "absolute", left: 650, top: 80, width: 390, ...ps(t, drei - 0.35, 16, 0.85) }}>
        <div style={{ background: "#FFF", borderRadius: 24, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, overflow: "hidden" }}>
          <div style={{ background: C.red, height: 56, display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}><Ico d={IC2.cal} size={28} color="#FFF" sw={2} /><Mono text="+ 3 MONATE" size={18} color="#FFF" /></div>
          <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", perspective: 600 }}>
            <span key={mi} style={{ fontFamily: fonts.bold, fontSize: 54, color: PK.ink, display: "inline-block", transform: `rotateX(${t < monaten + 0.4 && t > drei - 0.1 ? (1 - Math.min(1, flip * 3)) * -80 : 0}deg)` }}>{MONTHS[mi]}</span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 650, top: 330, width: 390, ...ps(t, weisst - 0.3, 14, 0.85) }}>
        <div style={{ background: "#FFF", borderRadius: 24, boxShadow: paperShadow, border: `2px solid ${t > nicht ? C.red : CL.border}`, padding: "20px 22px" }}>
          <Mono text="KANZLEI FRAGT" size={15} color={C.red} />
          <div style={{ fontFamily: fonts.bold, fontSize: 28, color: PK.ink, marginTop: 6 }}>„Essen 12.11., 167,90 €: mit wem, warum?“</div>
          <div style={{ marginTop: 14, fontFamily: fonts.semibold, fontSize: 26, color: CL.sub, filter: `blur(${blur}px)` }}>Weber? Oder Krause? Irgendwas mit Vertrag …</div>
        </div>
        {t > nicht - 0.05 ? <div style={{ position: "absolute", right: -10, bottom: -40 }}><InkStamp id="weg" text="VERGESSEN" p={k(t, nicht - 0.03, 0.25)} color={C.red} size={38} rot={-8} /></div> : null}
      </div>
      <Beispiel style={{ left: 50, top: 24 }} />
      <Ring t={t} at={stb} x={330} y={640} r={220} color={C.green} />
      <Ring t={t} at={nicht} x={840} y={440} r={220} color={C.red} />
      <Glint t={t} at={stb + 0.2} x={560} y={110} size={34} />
    </PanelStage>
  );
};

// ================= 7. "Am Monatsende sagst du nur Monatsliste. Claude macht dir aus allen Fotos die fertige Tabelle für deinen Steuerberater." =================
const LIST: [string, string, string, string][] = [
  ["03.11.", "Tankstelle Am Ring", "84,37", "4530"], ["05.11.", "Bürobedarf Weiß", "23,80", "4930"], ["07.11.", "Parkhaus Dom", "12,00", "4580"],
  ["12.11.", "Trattoria da Marco", "177,90", "4650/54"], ["14.11.", "Tankstelle Nord", "71,12", "4530"], ["19.11.", "Post Filiale", "8,95", "4910"],
  ["21.11.", "Café Kranz", "38,60", "4650/54"], ["26.11.", "Tankstelle Am Ring", "79,44", "4530"],
];
export const SceneMonat: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const ende = m("ende", 0.08), liste = m("liste", 0.25), claude = m("claude", 0.38), fotos = m("fotos", 0.55), fertige = m("fertige", 0.65), tabelle = m("tabelle", 0.72), stb = m("stb", 0.9);
  const sendAt = liste + 0.4;
  const rowAt = (i: number) => fotos - 0.05 + i * Math.max(0.08, (tabelle + 0.3 - fotos) / LIST.length);
  const nRows = LIST.filter((_, i) => t > rowAt(i) + 0.25).length;
  const total = LIST.slice(0, nRows).reduce((s, r) => s + parseFloat(r[2].replace(",", ".")), 0);
  const sent = t > stb + 0.15;
  const ART = { x: 360, y: 20, w: 650, h: 700 };
  return (
    <PanelStage t={t} dur={dur} seed={68}>
      <div style={{ position: "absolute", left: 24, top: 22, width: 1032, height: 778, transform: tilt(t, 3, 0), transformOrigin: "50% 100%" }}>
        <Win title="Belegkasse" style={{ inset: 0 }} right={<Pill text="BELEGE 2026-11 · 31 FOTOS" color={PK.orangeDeep} bg={C.orangeSoft} size={16} dot={false} />}>
          {/* photo stack (left) */}
          {Array.from({ length: 9 }, (_, i) => {
            const fly = k(t, fotos - 0.1 + i * 0.07, 0.35, ez);
            const gx = 30 + (i % 3) * 102, gy = 30 + Math.floor(i / 3) * 150;
            return (
              <div key={i} style={{ position: "absolute", left: lerp(gx, ART.x + 80, fly), top: lerp(gy, ART.y + 160, fly), width: 92, height: 136, borderRadius: 10, overflow: "hidden", background: "#C9BFAF", opacity: 1 - fly * 0.95, transform: `scale(${1 - fly * 0.6}) rotate(${(i % 3 - 1) * 4}deg)`, boxShadow: "0 8px 16px rgba(0,0,0,0.18)", zIndex: 6 }}>
                <ReceiptImg w={76} h={124} style={{ margin: "6px auto 0" }} />
              </div>
            );
          })}
          {/* composer */}
          <Composer t={t} focus={t > ende && t < sendAt + 0.1} text={typed("Monatsliste", t, liste - 0.25, liste + 0.25)} sendAt={sendAt} placeholder="Antworten …" style={{ left: 22, top: 500, width: 320, height: 186 }} />
          {/* artifact: Excel */}
          <div style={{ position: "absolute", left: ART.x, top: ART.y, width: ART.w, height: ART.h, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 22, boxShadow: "0 16px 38px rgba(20,20,20,0.08)", overflow: "hidden", opacity: k(t, claude - 0.2, 0.3), transform: `translateX(${(1 - k(t, claude - 0.2, 0.35)) * 60}px)` }}>
            <div style={{ height: 70, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", borderBottom: `1.5px solid ${CL.border}`, background: "#FBFAF7" }}>
              <div style={{ width: 40, height: 46, borderRadius: 7, background: "#1E7A47", color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 12, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 5, boxSizing: "border-box" }}>XLSX</div>
              <div><div style={{ fontFamily: fonts.bold, fontSize: 24, color: CL.text }}>Belege_2026-11.xlsx</div><Mono text={`${Math.round(interpolate(t, [fotos, tabelle + 0.3], [0, 31], clamp))} BELEGE · SKR03`} size={13} /></div>
              <div style={{ marginLeft: "auto", fontFamily: fonts.semibold, fontSize: 20, color: sent ? "#FFF" : CL.text, background: sent ? C.green : "#FFF", border: `1.5px solid ${sent ? C.green : CL.border}`, borderRadius: 12, padding: "8px 14px", whiteSpace: "nowrap", transform: `scale(${t > stb && t < stb + 0.15 ? 0.9 : 1})` }}>{sent ? "An Kanzlei ✓" : "An Kanzlei"}</div>
            </div>
            <div style={{ display: "flex", height: 40, alignItems: "center", padding: "0 20px", gap: 0, background: "#F4F1EA", fontFamily: MONO, fontWeight: 800, fontSize: 14, letterSpacing: "0.08em", color: CL.sub }}>
              <span style={{ width: 90 }}>DATUM</span><span style={{ flex: 1 }}>FIRMA</span><span style={{ width: 110, textAlign: "right" }}>BRUTTO</span><span style={{ width: 120, textAlign: "right" }}>KONTO</span>
            </div>
            {LIST.map((r, i) => {
              const p = k(t, rowAt(i), 0.25);
              return (
                <div key={i} style={{ display: "flex", height: 54, alignItems: "center", padding: "0 20px", borderTop: "1px solid #EFEBE4", opacity: p, transform: `translateY(${(1 - p) * 14}px)`, background: i % 2 ? "#FCFBF8" : "#FFF" }}>
                  <span style={{ width: 90, fontFamily: MONO, fontWeight: 700, fontSize: 18, color: CL.sub }}>{r[0]}</span>
                  <span style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 21, color: CL.text, whiteSpace: "nowrap" }}>{r[1]}</span>
                  <span style={{ width: 110, textAlign: "right", fontFamily: MONO, fontWeight: 800, fontSize: 19, color: CL.text }}>{r[2]}</span>
                  <span style={{ width: 120, textAlign: "right" }}><span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 16, color: PK.orangeDeep, background: C.orangeSoft, borderRadius: 7, padding: "3px 8px" }}>{r[3]}</span></span>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, borderTop: `2px solid ${PK.ink}`, display: "flex", alignItems: "center", padding: "0 20px", background: "#FBFAF7", opacity: k(t, fertige, 0.3) }}>
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 18, color: CL.sub, letterSpacing: "0.1em" }}>SUMME NOVEMBER</span>
              <span style={{ marginLeft: "auto" }}><Odometer value={total + interpolate(t, [tabelle, stb], [0, 1342.67 - 496.18], clamp)} size={30} speed={t > fotos && t < stb ? 0.5 : 0} suffix=" €" /></span>
            </div>
            <Sheen p={k(t, tabelle + 0.2, 0.7)} strength={0.5} />
          </div>
        </Win>
        {sent ? <div style={{ position: "absolute", right: 30, top: 90, zIndex: 30 }}><InkStamp id="fertig" text="FERTIG" p={k(t, stb + 0.15, 0.25)} color={C.green} size={44} rot={-10} /></div> : null}
      </div>
      <Pointer t={t} path={[{ x: 200, y: 760, at: 0 }, { x: 320, y: 690, at: sendAt, click: true }, { x: 900, y: 120, at: stb, click: true }]} size={52} />
      <Beispiel style={{ left: 40, bottom: 30 }} />
      <Ring t={t} at={sendAt} x={320} y={690} r={140} />
      <Ring t={t} at={stb} x={900} y={110} r={170} color={C.green} />
      <Glint t={t} at={tabelle + 0.2} x={1000} y={300} size={34} />
    </PanelStage>
  );
};

// ================= 8. guide background (PDF scroll sits on top) =================
export const SceneGuideBg: React.FC<SceneP> = ({ t, dur }) => (
  <PanelStage t={t} dur={dur} seed={69}>
    <Glint t={t} at={0.4} x={110} y={200} size={34} />
  </PanelStage>
);

export { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, Pill, PK, InkStamp };
