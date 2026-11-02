import React from "react";
import { Easing, interpolate } from "remotion";
import { fonts } from "../theme";
import { PK, paperShadow, Highlight, Sheen, InkStamp } from "./PremiumKit";
import { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, tilt, Logo, Mono, Pill, CheckDot, Ico, Glint, Ring, Pointer, PanelStage, Odometer } from "./DuetBrolls";
import { Win, Beispiel, I2, TopTag, PdfIcon, Composer, FileChip } from "./KontoBrolls";
import { Invoice3D } from "./StbRechnungObjects3D";

// FP-N "Steuerberater-Rechnung" (2026-10-31) - split-panel scenes (1080 x 820), pure functions of (t, dur, at);
// StbRechnungOpus anchors `at` to captions.json word times. Kanzlei, numbers and invoice are invented (BEISPIEL).
// § 9 Abs. 2 StBVV: einzelne Gebühren, Gebührentatbestand, angewandte Vorschriften, bei Wertgebühren Gegenstandswert.
// § 24 Abs. 1 Nr. 1 StBVV: ESt-Erklärung 1/10 – 6/10 (Mittelgebühr 3,5/10). Example sum: 2.030,00 + 19 % = 2.415,70, invoice says 2.495,70.

export type SceneP = { t: number; dur: number; at?: Record<string, number> };
const mk = (dur: number, at: Record<string, number> | undefined) => (name: string, frac: number) => (at && at[name] !== undefined ? at[name] : frac * dur);
const ez = Easing.inOut(Easing.cubic);

const Mark: React.FC<{ ok: boolean | null; size?: number; p?: number }> = ({ ok, size = 30, p = 1 }) =>
  ok === true ? <CheckDot size={size} p={p} /> : (
    <span style={{ width: size, height: size, borderRadius: "50%", background: ok === false ? C.red : C.amber, color: "#FFF", fontFamily: fonts.bold, fontSize: size * 0.62, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transform: `scale(${p})` }}>{ok === false ? "✕" : "?"}</span>
  );

// ================= 0. HOOK: 3D invoice with "§ fehlt" circled (frame 0) | § 9 StBVV | Claude 1 Min =================
export const HookRechnung: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const paragraf = m("paragraf", 0.3), geld = m("geld", 0.45), verlangen = m("verlangen", 0.55), und = m("und", 0.65), findet = m("findet", 0.75), minute = m("minute", 0.92);
  const law = k(t, geld - 0.15, 0.35, ez);
  const CHECKS: { txt: string; ok: boolean | null; a: number }[] = [
    { txt: "Gebühren einzeln", ok: true, a: findet - 0.05 },
    { txt: "Paragraf", ok: false, a: findet + 0.15 },
    { txt: "Gegenstandswert", ok: false, a: findet + 0.35 },
    { txt: "Summe", ok: false, a: findet + 0.55 },
  ];
  return (
    <PanelStage t={t} dur={dur} seed={51}>
      {/* 3D invoice on the desk */}
      <div style={{ position: "absolute", left: -30, top: 160, width: 700, height: 660 }}>
        <Invoice3D t={t} w={700} h={660} stampAt={verlangen + 0.05} />
      </div>
      <Beispiel style={{ left: 30, top: 236 }} />
      {/* § 9 StBVV paper (right) */}
      <div style={{ position: "absolute", left: 560, top: 230, width: 490, zIndex: 20, opacity: law, transform: `translateX(${(1 - law) * 300}px) rotate(${(1 - law) * 8 + 1.5}deg)` }}>
        <div style={{ background: PK.paper, borderRadius: 18, boxShadow: paperShadow, border: `1.5px solid ${PK.paperEdge}`, padding: "20px 24px 22px", position: "relative", overflow: "hidden" }}>
          <Mono text="GEBÜHRENORDNUNG · StBVV" size={16} color={CL.sub} />
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 40, color: PK.ink, marginTop: 4 }}>§ 9 Berechnung</div>
          <div style={{ marginTop: 10, fontFamily: SERIF, fontSize: 26, color: PK.ink, lineHeight: 1.3 }}>
            Der Steuerberater kann die Vergütung <span style={{ position: "relative" }}><Highlight p={k(t, verlangen - 0.2, 0.4)} color="rgba(210,64,58,0.22)" /><b style={{ position: "relative" }}>nur aufgrund einer</b></span> mitgeteilten <b>Berechnung</b> fordern …
          </div>
          <div style={{ marginTop: 10, fontFamily: SERIF, fontSize: 22, color: CL.sub, lineHeight: 1.3 }}>(2) … die angewandten Vorschriften dieser Gebührenverordnung …</div>
          <Sheen p={k(t, verlangen, 0.6)} />
        </div>
      </div>
      {/* Claude check card (appears at "Und Claude findet") */}
      {t > und - 0.15 ? (
        <div style={{ position: "absolute", left: 600, top: 470, width: 440, zIndex: 30, ...ps(t, und - 0.12, 26, 0.8) }}>
          <div style={{ background: "#FFF", borderRadius: 22, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, overflow: "hidden" }}>
            <div style={{ height: 56, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderBottom: `1.5px solid ${CL.border}`, background: "#FBFAF7" }}>
              <Logo name="claude" size={28} /><span style={{ fontFamily: fonts.bold, fontSize: 23, color: PK.ink }}>Rechnungscheck</span>
            </div>
            {CHECKS.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, height: 54, padding: "0 18px", borderTop: i ? "1px solid #EFEBE4" : "none", opacity: t > c.a ? 1 : 0.3 }}>
                <span style={{ fontFamily: fonts.semibold, fontSize: 23, color: CL.text }}>{c.txt}</span>
                <span style={{ marginLeft: "auto" }}>{t > c.a ? <Mark ok={c.ok} size={28} p={pop(t, c.a, 0.3)} /> : <span style={{ fontFamily: MONO, color: CL.border }}>…</span>}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {t > minute - 0.1 ? (
        <div style={{ position: "absolute", left: 640, top: 735, zIndex: 32, ...ps(t, minute - 0.08, 16, 0.5) }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "8px 22px 8px 8px", fontFamily: fonts.bold, fontSize: 28, boxShadow: "0 14px 28px rgba(0,0,0,0.3)" }}>
            <CheckDot size={36} p={k(t, minute + 0.05, 0.3)} />geprüft · 1 Min
          </span>
        </div>
      ) : null}
      <Ring t={t} at={paragraf} x={250} y={420} r={230} color={C.red} />
      <Ring t={t} at={verlangen + 0.05} x={330} y={690} r={200} color={C.red} />
      <Ring t={t} at={minute + 0.2} x={820} y={600} r={240} />
      <Glint t={t} at={geld} x={1000} y={260} size={36} />
      <Glint t={t} at={minute + 0.35} x={1010} y={500} size={40} />
    </PanelStage>
  );
};

// ================= 1. "Folg mir … komplettes System … den Rechnungscheck für deinen Steuerberater" =================
export const SceneSystem: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const folg = m("folg", 0.02), systeme = m("systeme", 0.2);
  const mods = [m("m1", 0.5), m("m2", 0.6), m("m3", 0.7), m("m4", 0.8)];
  const title = m("title", 0.85), stb = m("stb", 0.95);
  const followed = t > folg + 0.5;
  const sys = k(t, mods[0] - 0.3, 0.4, ez);
  const MODS = [
    { x: 40, y: 96, ic: I2.list, h: "Pflichtangaben", s: "§ 9 StBVV", from: [-300, -80] },
    { x: 780, y: 96, ic: I2.layers, h: "Gebührensatz", s: "passt zur Arbeit?", from: [300, -80] },
    { x: 40, y: 590, ic: I2.calc, h: "Nachrechnen", s: "Summe mit Code", from: [-300, 80] },
    { x: 780, y: 590, ic: I2.mail, h: "Mail", s: "an die Kanzlei", from: [300, 80] },
  ];
  const CARD = { x: 290, y: 255, w: 500, h: 300 };
  const anchors = [[CARD.x, CARD.y + 50], [CARD.x + CARD.w, CARD.y + 50], [CARD.x, CARD.y + CARD.h - 50], [CARD.x + CARD.w, CARD.y + CARD.h - 50]];
  const tileC = (i: number) => [MODS[i].x + (i % 2 === 0 ? 260 : 0), MODS[i].y + 50];
  return (
    <PanelStage t={t} dur={dur} seed={52}>
      {/* follow card ("Folg mir, wenn du keins meiner Systeme mehr verpassen willst") */}
      {sys < 1 ? (
        <div style={{ position: "absolute", left: 190, top: 210, width: 700, opacity: 1 - sys, transform: `scale(${1 - 0.2 * sys}) translateY(${-sys * 80}px)`, ...ps(t, folg - 0.25, 20, 0.85) }}>
          <div style={{ background: "#FFF", borderRadius: 30, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, padding: "30px 34px", display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 110, height: 110, borderRadius: "50%", background: `linear-gradient(135deg, ${C.orange}, #F2B48F)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 48, color: "#FFF", flexShrink: 0 }}>F</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 36, color: PK.ink }}>@florent_preusser</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 24, color: CL.sub, marginTop: 4 }}>{t > systeme - 0.1 ? "Jeden Tag ein neues System" : "Claude-Systeme für Unternehmer"}</div>
            </div>
            <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: followed ? C.green : "#3E8EF7", borderRadius: 16, padding: "14px 26px", transform: `scale(${t > folg + 0.42 && t < folg + 0.55 ? 0.9 : 1})`, whiteSpace: "nowrap" }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
          </div>
          <Pointer t={t} path={[{ x: 520, y: 330, at: 0 }, { x: 600, y: 90, at: folg + 0.45, click: true }, { x: 650, y: 200, at: folg + 1.2 }]} size={56} />
        </div>
      ) : null}
      {sys > 0 ? (
        <>
          <svg width={PW} height={PH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {MODS.map((_, i) => {
              const p = k(t, mods[i] + 0.25, 0.3);
              const [x1, y1] = tileC(i), [x2, y2] = anchors[i];
              return <path key={i} d={`M${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`} fill="none" stroke={C.orange} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" strokeDashoffset={-t * 40} opacity={p} />;
            })}
          </svg>
          <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, opacity: sys, transform: `scale(${0.85 + 0.15 * sys})` }}>
            <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 28, border: `1.5px solid ${CL.border}`, boxShadow: paperShadow, padding: "28px 32px", boxSizing: "border-box", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Ico d={I2.folder} size={28} color={CL.sub} />
                <Mono text="PROJEKT" size={18} />
                <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: CL.bubble, borderRadius: 999, padding: "5px 14px 5px 8px", fontFamily: fonts.semibold, fontSize: 22, color: CL.text }}><Logo name="claude" size={26} />in Claude</span>
              </div>
              <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 54, color: PK.ink, marginTop: 18, lineHeight: 1, minHeight: 56, whiteSpace: "nowrap" }}>
                {typed("Rechnungscheck", t, title - 0.15, title + 0.45) || <span style={{ color: CL.border }}>Rechnungscheck</span>}
              </div>
              <div style={{ fontFamily: fonts.medium, fontSize: 25, color: t > stb - 0.1 ? PK.orangeDeep : CL.sub, marginTop: 16 }}>für deinen Steuerberater</div>
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
                    <div style={{ fontFamily: fonts.bold, fontSize: 27, color: PK.ink, whiteSpace: "nowrap" }}>{md.h}</div>
                    <div style={{ fontFamily: fonts.medium, fontSize: 20, color: CL.sub, whiteSpace: "nowrap" }}>{md.s}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {mods.map((a, i) => <Glint key={i} t={t} at={a + 0.25} x={anchors[i][0]} y={anchors[i][1]} size={30} />)}
          <TopTag t={t} text="KOMPLETTES SYSTEM" at={mods[0] - 0.2} style={{ left: 380, top: 30 }} />
        </>
      ) : null}
    </PanelStage>
  );
};

// ================= 2. "Du lädst seine Rechnung in Claude. Claude legt sie neben seine Gebührenordnung. Steht jede Leistung einzeln drauf? Mit Paragraf, Gegenstandswert und Gebührensatz?" =================
export const SceneCheck: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const grab = m("grab", 0.05), drop = m("drop", 0.15), send = m("send", 0.22), legt = m("legt", 0.3), gebo = m("gebo", 0.4);
  const steht = m("steht", 0.5), einzeln = m("einzeln", 0.6), paragraf = m("paragraf", 0.75), gw = m("gw", 0.85), satz = m("satz", 0.95);
  const dp = k(t, grab + 0.05, Math.max(0.3, drop - grab - 0.05), ez);
  const landed = t > drop;
  const split = k(t, legt - 0.15, 0.5, ez); // upload view → side-by-side compare
  const ROWS: { txt: string; a: number; ok: boolean | null; note: string }[] = [
    { txt: "Leistung einzeln", a: einzeln, ok: true, note: "3 Positionen" },
    { txt: "Paragraf", a: paragraf, ok: false, note: "fehlt bei Pos. 1" },
    { txt: "Gegenstandswert", a: gw, ok: false, note: "fehlt (Wertgebühr)" },
    { txt: "Gebührensatz", a: satz, ok: true, note: "6/10" },
  ];
  return (
    <PanelStage t={t} dur={dur} seed={53}>
      {/* upload view */}
      {split < 1 ? (
        <div style={{ position: "absolute", left: 40, top: 26, width: 1000, height: 770, opacity: 1 - split, transform: `${tilt(t, 4, 0)} scale(${1 - 0.1 * split})`, transformOrigin: "50% 100%" }}>
          <Win title="Rechnungscheck" style={{ inset: 0 }}>
            <div style={{ position: "absolute", left: 380, right: 30, top: 34, fontFamily: SERIF, fontSize: 44, color: CL.text, lineHeight: 1.12 }}>
              <Logo name="claude" size={40} /> <span style={{ verticalAlign: "middle" }}>Rechnung prüfen</span>
            </div>
            <Composer t={t} focus={t > grab} text={typed("Prüf die Rechnung gegen die StBVV.", t, drop + 0.05, send - 0.05)} sendAt={send} style={{ left: 30, right: 30, bottom: 28, height: 380 }}>
              {landed ? <div style={{ ...ps(t, drop, 12, 0.6) }}><FileChip name="Rechnung_Kanzlei_Berger.pdf" sub="PDF · 14.10.2026" w={420} check={k(t, drop + 0.15, 0.3)} /></div> : (
                <div style={{ height: 180, borderRadius: 18, border: `3px dashed ${t > grab ? C.orange : CL.border}`, background: t > grab ? "rgba(217,119,87,0.07)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.medium, fontSize: 28, color: t > grab ? PK.orangeDeep : CL.sub, gap: 12 }}>
                  <Ico d={I2.up} size={34} color={t > grab ? C.orange : CL.sub} />Datei hierher ziehen
                </div>
              )}
            </Composer>
          </Win>
          {!landed ? (
            <div style={{ position: "absolute", left: 600 + (200 - 600) * dp, top: 60 + (420 - 60) * dp - Math.sin(dp * Math.PI) * 80, zIndex: 40, transform: `rotate(${(1 - dp) * 6}deg) scale(${1 - 0.3 * dp})`, transformOrigin: "0 0" }}>
              <div style={{ width: 300, background: "#FFF", borderRadius: 16, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}><PdfIcon size={48} /><div><div style={{ fontFamily: fonts.bold, fontSize: 25, color: PK.ink }}>Rechnung</div><Mono text="KANZLEI BERGER · PDF" size={14} /></div></div>
                {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ display: "flex", marginTop: 10, gap: 10 }}><span style={{ flex: 1, height: 11, borderRadius: 4, background: "#ECE8E1" }} /><span style={{ width: 64, height: 11, borderRadius: 4, background: "#E2DDD3" }} /></div>)}
              </div>
            </div>
          ) : null}
          <Pointer t={t} path={[{ x: 760, y: 700, at: 0 }, { x: 700, y: 140, at: grab, click: true }, { x: 420, y: 520, at: drop - 0.02, click: true }, { x: 943, y: 716, at: send, click: true }]} size={56} />
        </div>
      ) : null}
      {/* compare view: invoice | StBVV, checklist below */}
      {split > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: split }}>
          <div style={{ position: "absolute", left: 30 - (1 - split) * 200, top: 40, width: 470, height: 470, transform: `${tilt(t, 3, 7)}` }}>
            <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 18, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, padding: "18px 22px", boxSizing: "border-box", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontFamily: fonts.bold, fontSize: 26, color: PK.ink }}>Kanzlei Berger</span><span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 15, color: PK.orangeDeep }}>BEISPIEL</span></div>
              <div style={{ fontFamily: fonts.bold, fontSize: 34, color: PK.ink, marginTop: 10 }}>RECHNUNG</div>
              {[["ESt-Erklärung 2025", "6/10", "1.170,00", paragraf], ["Buchführung 2025", "§ 33", "840,00", 99], ["Auslagen", "§ 16", "20,00", 99]].map(([d, s, a, hl], i) => (
                <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "12px 6px", borderBottom: "1px solid #EFEBE4", marginTop: i ? 0 : 10 }}>
                  {i === 0 ? <Highlight p={k(t, hl as number, 0.35)} color="rgba(210,64,58,0.16)" /> : null}
                  <span style={{ position: "relative", fontFamily: fonts.semibold, fontSize: 22, color: CL.text, width: 220, whiteSpace: "nowrap" }}>{d}</span>
                  <span style={{ position: "relative", fontFamily: MONO, fontSize: 19, color: CL.sub, width: 70 }}>{s}</span>
                  <span style={{ position: "relative", marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 21, color: CL.text }}>{a}</span>
                </div>
              ))}
              {t > paragraf ? <div style={{ position: "absolute", left: 250, top: 112, ...ps(t, paragraf, 8, 0.5) }}><Pill text="§ ?" color="#FFF" bg={C.red} size={20} dot={false} /></div> : null}
              <div style={{ marginTop: 16, display: "flex", fontFamily: fonts.bold, fontSize: 26, color: PK.ink }}><span>Gesamt</span><span style={{ marginLeft: "auto", fontFamily: MONO }}>2.495,70 €</span></div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 560 + (1 - split) * 300, top: 40, width: 490, height: 470, transform: `${tilt(t + 1, 3, -7)}`, opacity: k(t, gebo - 0.2, 0.35) }}>
            <div style={{ position: "absolute", inset: 0, background: PK.paper, borderRadius: 18, boxShadow: paperShadow, border: `1.5px solid ${PK.paperEdge}`, padding: "18px 22px", boxSizing: "border-box", overflow: "hidden" }}>
              <Mono text="GEBÜHRENORDNUNG · StBVV" size={15} />
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 34, color: PK.ink, marginTop: 4 }}>§ 9 (2) Berechnung</div>
              {[["Beträge der einzelnen Gebühren", einzeln], ["Bezeichnung des Gebührentatbestands", steht], ["angewandte Vorschriften der StBVV", paragraf], ["bei Wertgebühren: Gegenstandswert", gw]].map(([txt, a], i) => (
                <div key={i} style={{ position: "relative", marginTop: 12, padding: "8px 12px", borderRadius: 12, background: t > (a as number) ? "rgba(217,119,87,0.12)" : "#F6F3EC", fontFamily: SERIF, fontSize: 23, color: PK.ink, lineHeight: 1.2, border: `2px solid ${t > (a as number) && t < (a as number) + 0.9 ? C.orange : "transparent"}` }}>{txt as string}</div>
              ))}
              <div style={{ marginTop: 12, fontFamily: SERIF, fontSize: 21, color: CL.sub }}>§ 24 (1) Nr. 1: ESt-Erklärung 1/10 – 6/10</div>
            </div>
          </div>
          {/* connector line invoice ↔ law */}
          <svg width={PW} height={PH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path d="M 500 200 C 530 180, 540 220, 560 200" fill="none" stroke={C.orange} strokeWidth={5} strokeDasharray="2 12" strokeLinecap="round" strokeDashoffset={-t * 40} opacity={k(t, gebo, 0.3)} />
          </svg>
          {/* checklist strip */}
          <div style={{ position: "absolute", left: 30, right: 30, top: 540, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {ROWS.map((r, i) => {
              const on = t > r.a - 0.05;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "#FFF", borderRadius: 18, border: `2px solid ${on ? (r.ok ? C.green : C.red) : CL.border}`, padding: "14px 18px", boxShadow: on ? "0 14px 26px -12px rgba(90,55,30,0.4)" : "none", opacity: k(t, steht - 0.3 + i * 0.06, 0.3), transform: `scale(${on ? 1 + 0.05 * Math.sin(Math.min(1, (t - r.a) / 0.3) * Math.PI) : 1})` }}>
                  {on ? <Mark ok={r.ok} size={34} p={pop(t, r.a - 0.05, 0.3)} /> : <span style={{ width: 34, height: 34, borderRadius: "50%", border: `2.5px solid ${CL.border}` }} />}
                  <div>
                    <div style={{ fontFamily: fonts.bold, fontSize: 26, color: PK.ink, whiteSpace: "nowrap" }}>{r.txt}</div>
                    <div style={{ fontFamily: fonts.medium, fontSize: 19, color: on ? (r.ok ? C.green : C.red) : CL.sub, whiteSpace: "nowrap" }}>{on ? r.note : "…"}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Ring t={t} at={paragraf} x={280} y={680} r={220} color={C.red} />
          <Glint t={t} at={gebo + 0.2} x={1010} y={70} size={34} />
          <Glint t={t} at={satz + 0.2} x={1010} y={600} size={34} />
        </div>
      ) : null}
    </PanelStage>
  );
};

// ================= 3. "Dann rechnet Claude nach. Passt der Satz zu der Arbeit, die er wirklich hatte? Und stimmt am Ende die Summe?" =================
export const SceneRechnen: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const rechnet = m("rechnet", 0.05), passt = m("passt", 0.2), satz = m("satz", 0.28), arbeit = m("arbeit", 0.4), wirklich = m("wirklich", 0.5), stimmt = m("stimmt", 0.7), summe = m("summe", 0.85);
  const marker = interpolate(t, [satz - 0.1, satz + 0.5], [1, 6], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sumP = k(t, Math.min(stimmt - 0.25, wirklich + 0.5), 0.4, ez);
  const calc = interpolate(t, [stimmt - 0.1, summe + 0.1], [0, 2415.7], { ...clamp, easing: Easing.out(Easing.cubic) });
  const LINES = [["ESt-Erklärung", "1.170,00"], ["Buchführung", "840,00"], ["Auslagen", "20,00"], ["Netto", "2.030,00"], ["+ 19 % USt", "385,70"]];
  return (
    <PanelStage t={t} dur={dur} seed={54}>
      <div style={{ position: "absolute", left: 40, top: 26, width: 1000, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Rechnungscheck" crumb="Kanzlei Berger" style={{ inset: 0 }} right={<Pill text="NACHGERECHNET" color={PK.orangeDeep} bg={C.orangeSoft} size={17} dot={false} />}>
          <div style={{ position: "absolute", left: 26, top: 20, display: "flex", alignItems: "center", gap: 12, ...ps(t, rechnet - 0.2, 8, 0.7) }}>
            <Logo name="claude" size={34} /><span style={{ fontFamily: fonts.semibold, fontSize: 24, color: CL.sub }}>Claude rechnet nach …</span><CheckDot size={26} p={k(t, rechnet + 0.3, 0.3)} />
          </div>
          {/* Gebührensatz scale */}
          <div style={{ position: "absolute", left: 26, right: 26, top: 80, height: 290, borderRadius: 20, background: "#FFF", border: `2px solid ${t > wirklich ? C.amber : "#EFEBE4"}`, padding: "18px 24px", boxSizing: "border-box", opacity: k(t, passt - 0.3, 0.3) }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 28, color: PK.ink }}>Gebührensatz · ESt-Erklärung</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 18, color: CL.sub }}>§ 24 (1) Nr. 1 StBVV</span>
            </div>
            <div style={{ position: "relative", marginTop: 54, height: 20, borderRadius: 10, background: "linear-gradient(90deg, #E6F5EC, #FBEFD9 60%, #FDE8E8)" }}>
              {[1, 2, 3, 4, 5, 6].map((n) => <span key={n} style={{ position: "absolute", left: `${((n - 1) / 5) * 100}%`, top: 28, transform: "translateX(-50%)", fontFamily: MONO, fontWeight: 700, fontSize: 20, color: CL.sub }}>{n}/10</span>)}
              <span style={{ position: "absolute", left: "50%", top: -34, transform: "translateX(-50%)", fontFamily: MONO, fontSize: 16, color: CL.sub, whiteSpace: "nowrap" }}>MITTEL 3,5/10</span>
              <span style={{ position: "absolute", left: "50%", top: -8, width: 3, height: 36, background: CL.sub, opacity: 0.5 }} />
              <div style={{ position: "absolute", left: `${((marker - 1) / 5) * 100}%`, top: -18, transform: "translateX(-50%)" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.red, border: "5px solid #FFF", boxShadow: "0 8px 18px rgba(160,30,25,0.4)" }} />
              </div>
            </div>
            <div style={{ marginTop: 62, display: "flex", gap: 14, alignItems: "center" }}>
              {t > arbeit - 0.1 ? <span style={{ ...ps(t, arbeit - 0.08, 10, 0.6), display: "inline-flex", alignItems: "center", gap: 10, background: "#F6F3EC", borderRadius: 12, padding: "8px 14px", fontFamily: fonts.semibold, fontSize: 22, color: CL.text }}>Belege kamen vollständig, keine Rückfragen</span> : null}
              {t > wirklich - 0.05 ? <span style={{ ...ps(t, wirklich, 10, 0.5), display: "inline-flex", alignItems: "center", gap: 8, background: C.amberSoft, borderRadius: 12, padding: "8px 14px", fontFamily: fonts.bold, fontSize: 22, color: "#8A5A10", whiteSpace: "nowrap" }}><Mark ok={null} size={26} />Höchstsatz: warum?</span> : null}
            </div>
          </div>
          {/* sum check */}
          <div style={{ position: "absolute", left: 26, right: 26, top: 390, bottom: 24, borderRadius: 20, background: "#FFF", border: `2px solid ${t > summe + 0.2 ? C.red : "#EFEBE4"}`, padding: "14px 24px", boxSizing: "border-box", opacity: sumP, transform: `translateY(${(1 - sumP) * 40}px)` }}>
            <div style={{ display: "flex", gap: 30 }}>
              <div style={{ flex: 1 }}>
                {LINES.map(([l, v], i) => (
                  <div key={i} style={{ display: "flex", padding: "5px 0", borderTop: i === 3 ? `2px solid ${CL.border}` : "none", fontFamily: i >= 3 ? fonts.bold : fonts.medium, fontSize: 23, color: CL.text, opacity: k(t, stimmt - 0.2 + i * 0.07, 0.15) }}>
                    <span>{l}</span><span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ width: 380, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: C.greenSoft, borderRadius: 14, padding: "10px 16px" }}>
                  <Mono text="CLAUDE RECHNET" size={15} color={C.green} />
                  <Odometer value={calc} size={40} color={C.green} speed={t > stimmt && t < summe ? 1 : 0} suffix=" €" />
                </div>
                <div style={{ background: C.redSoft, borderRadius: 14, padding: "10px 16px", opacity: k(t, summe - 0.1, 0.25) }}>
                  <Mono text="AUF DER RECHNUNG" size={15} color={C.red} />
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: C.red }}>2.495,70 €</div>
                </div>
              </div>
            </div>
          </div>
        </Win>
      </div>
      {t > summe + 0.15 ? <div style={{ position: "absolute", left: 640, top: 690, zIndex: 30, ...ps(t, summe + 0.15, 14, 0.5) }}><span style={{ display: "inline-flex", background: C.red, color: "#FFF", borderRadius: 999, padding: "10px 26px", fontFamily: MONO, fontWeight: 800, fontSize: 32, boxShadow: "0 14px 28px rgba(160,30,25,0.35)" }}>Δ 80,00 €</span></div> : null}
      <Beispiel style={{ left: 930, top: 36 }} />
      <Ring t={t} at={satz + 0.4} x={940} y={250} r={160} color={C.red} />
      <Ring t={t} at={summe + 0.2} x={760} y={720} r={230} color={C.red} />
      <Glint t={t} at={rechnet + 0.3} x={560} y={80} size={34} />
    </PanelStage>
  );
};

// ================= 4. "Findet Claude etwas, schreibt es dir die Mail. Freundlich, ohne Vorwurf … korrigierte Rechnung. Bezahlt wird erst, wenn die stimmt." =================
export const SceneMail: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const schreibt = m("schreibt", 0.08), freundlich = m("freundlich", 0.3), vorwurf = m("vorwurf", 0.4), bitte = m("bitte", 0.5), korr = m("korr", 0.6), bezahlt = m("bezahlt", 0.75), stimmt = m("stimmt", 0.92);
  const seg1 = "Sehr geehrte Frau Berger,\nvielen Dank für Ihre Rechnung Nr. 2026-0417. Uns sind beim Prüfen zwei Punkte aufgefallen:";
  const t1 = typed(seg1, t, schreibt + 0.05, vorwurf);
  const scroll = interpolate(t, [bezahlt - 0.4, bezahlt + 0.1], [0, 150], { ...clamp, easing: ez });
  const ok = t > stimmt + 0.05;
  return (
    <PanelStage t={t} dur={dur} seed={55}>
      <div style={{ position: "absolute", left: 40, top: 26, width: 1000, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Mail an die Kanzlei" crumb="Rechnungscheck" style={{ inset: 0 }} right={<span style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1.5px solid ${CL.border}`, borderRadius: 12, padding: "6px 14px", fontFamily: fonts.semibold, fontSize: 20, color: CL.sub }}><Ico d={I2.copy} size={22} color={CL.sub} />Kopieren</span>}>
          <div style={{ position: "absolute", left: 34, right: 34, top: 18 - scroll, bottom: 110 }}>
            {[["An", "Kanzlei Berger · Steuerberatung"], ["Betreff", "Kurze Rückfrage zur Rechnung 2026-0417"]].map(([l, v], i) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 0", borderBottom: `1.5px solid ${CL.border}`, ...ps(t, -0.2 + i * 0.1, 8, 0.9) }}>
                <span style={{ width: 120, fontFamily: fonts.medium, fontSize: 25, color: CL.sub }}>{l}</span>
                <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: CL.text, whiteSpace: "nowrap" }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 18, fontFamily: fonts.medium, fontSize: 29, color: CL.text, lineHeight: 1.42, whiteSpace: "pre-wrap", minHeight: 130 }}>{t1}</div>
            {t > vorwurf - 0.05 ? (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8, fontFamily: fonts.medium, fontSize: 27, color: CL.text, ...ps(t, vorwurf - 0.05, 10, 0.7) }}>
                <div>1. Bei Pos. 1 fehlen Vorschrift und Gegenstandswert.</div>
                <div>2. Die Summe weicht um 80,00 € ab.</div>
              </div>
            ) : null}
            {t > bitte - 0.1 ? (
              <div style={{ marginTop: 16, fontFamily: fonts.medium, fontSize: 29, color: CL.text, lineHeight: 1.4, ...ps(t, bitte - 0.1, 10, 0.7) }}>
                Könnten Sie uns eine{" "}
                <span style={{ position: "relative", display: "inline-block" }}><Highlight p={k(t, korr - 0.05, 0.35)} color="rgba(30,158,87,0.25)" /><b style={{ position: "relative" }}>korrigierte Rechnung</b></span>{" "}
                nach § 9 StBVV schicken? Wir überweisen dann umgehend.
              </div>
            ) : null}
            {t > bezahlt - 0.2 ? <div style={{ marginTop: 14, fontFamily: fonts.medium, fontSize: 29, color: CL.text, ...ps(t, bezahlt - 0.2, 8, 0.7) }}>Viele Grüße</div> : null}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 100, background: "linear-gradient(180deg, rgba(250,249,245,0), #FAF9F5 40%)" }} />
          <div style={{ position: "absolute", left: 34, bottom: 36, display: "flex", alignItems: "center", gap: 10, opacity: k(t, schreibt + 0.2, 0.2) }}><Logo name="claude" size={28} /><span style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub }}>Entwurf von Claude</span></div>
        </Win>
      </div>
      {/* tone tags */}
      {[["FREUNDLICH", freundlich], ["OHNE VORWURF", vorwurf]].map(([txt, a], i) => (t > (a as number) - 0.1 ? (
        <div key={i} style={{ position: "absolute", left: 600 + i * 30, top: 150 + i * 70, zIndex: 30, ...ps(t, (a as number) - 0.08, 14, 0.5), opacity: 1 - k(t, bitte, 0.25) }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "10px 22px 10px 10px", fontFamily: MONO, fontWeight: 800, fontSize: 26, letterSpacing: "0.08em", boxShadow: "0 14px 28px rgba(0,0,0,0.3)" }}><CheckDot size={34} />{txt as string}</span>
        </div>
      ) : null))}
      {/* payment status card: "Bezahlt wird erst, wenn die stimmt" */}
      {t > bezahlt - 0.15 ? (
        <div style={{ position: "absolute", left: 300, top: 520, width: 480, zIndex: 35, ...ps(t, bezahlt - 0.12, 24, 0.8) }}>
          <div style={{ background: "#FFF", borderRadius: 24, boxShadow: paperShadow, border: `3px solid ${ok ? C.green : C.amber}`, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: ok ? C.greenSoft : C.amberSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.card} size={34} color={ok ? C.green : C.amber} sw={2} /></div>
            <div>
              <Mono text="ÜBERWEISUNG · 2.415,70 €" size={16} />
              <div style={{ fontFamily: fonts.bold, fontSize: 30, color: ok ? C.green : "#8A5A10", whiteSpace: "nowrap" }}>{ok ? "Rechnung stimmt ✓" : "wartet auf Korrektur"}</div>
            </div>
          </div>
        </div>
      ) : null}
      <Ring t={t} at={korr} x={420} y={430} r={240} color={C.green} />
      <Ring t={t} at={stimmt + 0.05} x={540} y={570} r={220} color={C.green} />
      <Glint t={t} at={freundlich + 0.1} x={960} y={160} size={34} />
      <Glint t={t} at={stimmt + 0.2} x={770} y={540} size={36} />
    </PanelStage>
  );
};

// ================= 5. guide background (PDF scroll sits on top) =================
export const SceneGuideBg: React.FC<SceneP> = ({ t, dur }) => (
  <PanelStage t={t} dur={dur} seed={56}>
    <Glint t={t} at={0.4} x={110} y={200} size={34} />
  </PanelStage>
);

export { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, Pill, PK, InkStamp };
