import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { fonts } from "../theme";
import captions from "../../runs/fpn-klage/captions.json";
import { OfficePlate } from "../components/PixelTown";
import { COURT_CARD_SIGN, CourthousePlate, CourtPlazaPlate, FriezeSign, PixelRope, PLAZA_COURT, POST } from "../components/PixelCourt";
import {
  Bot, C, CARD, CL, Card, Cap, Check, ClaudeMark, ClaudeWin, Composer, FileChip, LabelChip, LETTER, MONO, OpusMaster, OpusScene, PIXEL, PixelCard,
  PixelPaper, PixelText, Pointer, Ribbon, Sprite, Stamp, Tag, clamp, eur, k, makeTimeline, popStyle, shakeAt, typed,
} from "../components/OpusKit";

// FP-N "Klage ohne Anwalt" (2026-10-27), Version 2 im opusjake-Pixelstil (OpusKit + PixelCourt).
// Gleiche Tonspur/Avatar wie KlageOpus (3D-Version), Anker aus runs/fpn-klage/captions.json. Kunde und Betrieb erfunden.

const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
export const KP_FRAMES = TL.frames;
const A = {
  januar: at("januar"), verklagen: at("verklagen"), bis0: at("bis", 0), zehn0: at("zehntausend", 0), anwalt0: at("anwalt", 0), claude0: at("claude", 0), schreibt0: at("schreibt", 0), klage0: at("klage", 0),
  bis1: at("bis", 1), fuenf: at("fünftausend"), landgericht: at("landgericht"), dort: at("dort"), anwalt1: at("anwalt", 1), kostete: at("kostete"), tausend: at("tausend"), euro2: at("euro", 2),
  jetzt: at("jetzt"), zehn1: at("zehntausend", 1), amts0: at("amtsgericht", 0),
  du2: at("du", 2), rechnung: at("rechnung"), mahnungen: at("mahnungen"), mails: at("mails"),
  claude2: at("claude", 2), ordnet: at("ordnet"), datum: at("datum"), rechnet: at("rechnet"), verzugszinsen: at("verzugszinsen"), sucht: at("sucht"), amts1: at("amtsgericht", 1), zustaendig: at("zuständig"),
  und4: at("und", 4), fertige: at("fertige"), antrag: at("antrag"), begruendung: at("begründung"), liste: at("liste"), anlagen: at("anlagen"),
  du3: at("du", 3), liest: at("liest"), durch: at("durch"), unterschreibst: at("unterschreibst"), schickst: at("schickst"), ab: at("ab"),
  alle: at("alle"), fuenfP: at("fünf"), prompts: at("prompts"), checkliste: at("checkliste"), komm: at("kommentiere"), trigger: at("klage", 3), folg: at("folg"),
};

const YOU = "#4A7FD0";
const LAWYER = "#3A3A46";
const cell = CARD.cell;
const SIGN = { x: COURT_CARD_SIGN.x * cell, y: COURT_CARD_SIGN.y * cell, w: COURT_CARD_SIGN.w * cell, h: COURT_CARD_SIGN.h * cell };
const GROUND = COURT_CARD_SIGN.groundY * cell;
const lerp = (t: number, a: number, b: number, x0: number, x1: number, e = Easing.inOut(Easing.cubic)) => interpolate(t, [a, b], [x0, x1], { ...clamp, easing: e });

// frame-0 hook (split panel, readable without animation)
const HookLines: React.FC<{ t: number }> = ({ t }) => {
  if (t > A.bis0) return null;
  const out = k(t, A.bis0 - 0.2, 0.2);
  const m = k(t, 1.0, 0.35, Easing.inOut(Easing.cubic));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: 1 - out, zIndex: 9 }}>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 54, letterSpacing: "0.08em", color: "#FFF", background: C.pill, borderRadius: 14, padding: "12px 30px" }}>KUNDE ZAHLT NICHT</div>
      <div style={{ position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 54, letterSpacing: "0.08em", color: "#FFF", padding: "8px 26px" }}>
        <span style={{ position: "absolute", inset: 0, background: C.orange, borderRadius: 12, transform: `scale(${1 + 0.06 * Math.sin(Math.PI * m)})` }} />
        <span style={{ position: "relative" }}>CLAUDE KLAGT</span>
      </div>
    </div>
  );
};

const Invoice: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <PixelPaper w={300} h={250} style={style}>
    <div style={{ fontSize: 24 }}>RECHNUNG</div>
    <div style={{ height: 4, background: "#2C2420", margin: "10px 0" }} />
    <div style={{ fontSize: 15 }}>AN KESSLER BAU GMBH</div>
    <div style={{ fontSize: 34, marginTop: 14 }}>6.480 €</div>
    <div style={{ fontSize: 15, color: C.red, marginTop: 14 }}>2 MAHNUNGEN</div>
    <div style={{ fontSize: 15, color: C.red, marginTop: 6 }}>KEINE ZAHLUNG</div>
  </PixelPaper>
);

// 1 · the customer doesn't pay: you walk up to the Amtsgericht with your invoice
const SceneHook: React.FC<{ t: number }> = ({ t }) => (
  <PixelCard plate={<CourthousePlate cell={cell} tone="amts" t={t} />}>
    <FriezeSign text="AMTSGERICHT" {...SIGN} />
    <Bot t={t} x={lerp(t, 0.3, 2.2, 40, 250)} y={GROUND - 66} px={6} hat="helmet" prop="letter" color={YOU} seed={1} hopAmp={5} />
    <Invoice style={{ left: 570, top: 70, transform: `rotate(4deg) translateX(${shakeAt(t, A.verklagen, 6)}px)` }} />
    <Stamp t={t} at={A.verklagen} text="KLAGE" size={54} rot={-10} style={{ left: 610, top: 210 }} />
  </PixelCard>
);

// 2 · up to 10.000 €, no lawyer, Claude writes the lawsuit
const SceneOhne: React.FC<{ t: number }> = ({ t }) => {
  const gone = t > A.anwalt0 + 0.1;
  const wr = interpolate(t, [A.schreibt0, A.klage0 + 0.3], [0, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 120, ...popStyle(t, A.zehn0 - 0.1, 10, 0.6) }}><PixelText text="BIS 10.000 €" size={40} color={C.gold} /></div>
      <div style={{ position: "absolute", right: 90, top: 130, ...popStyle(t, A.anwalt0 - 0.05, 10, 0.6) }}><Tag text="OHNE ANWALT" color={C.red} size={34} /></div>
      <PixelCard plate={<OfficePlate cell={cell} />}>
        <Bot t={t} x={150} y={250} px={9} hat="tophat" prop="calc" color={LAWYER} grey={gone} seed={3} hopAmp={gone ? 0 : 5} style={{ opacity: 1 - 0.35 * k(t, A.anwalt0 + 0.1, 0.3) }} />
        {gone ? <div style={{ position: "absolute", left: 150, top: 230, fontFamily: PIXEL, fontSize: 150, lineHeight: 1, color: C.red, ...popStyle(t, A.anwalt0 + 0.1, 0, 0.3) }}>✕</div> : null}
        <Bot t={t} x={420} y={250} px={9} prop="pen" seed={4} a={A.claude0 - 0.1} />
        <div style={{ position: "absolute", left: 600, top: 40, ...popStyle(t, A.claude0, 20, 0.6) }}>
          <PixelPaper w={250} h={330}>
            <div style={{ fontSize: 28 }}>KLAGE</div>
            <div style={{ height: 4, background: "#2C2420", margin: "10px 0 14px" }} />
            {[0.9, 0.7, 0.85, 0.6, 0.8, 0.5].map((w, i) => (
              <div key={i} style={{ height: 10, width: `${w * 100 * Math.min(1, Math.max(0, wr * 6 - i))}%`, background: i === 0 || i === 3 ? C.orange : "#B8AE97", marginTop: 14 }} />
            ))}
          </PixelPaper>
        </div>
      </PixelCard>
      <Ribbon t={t} at={A.klage0 - 0.1} text="CLAUDE SCHREIBT DIE KLAGE" bg={C.orange} size={36} rot={-3} style={{ left: 140, top: 620 }} />
    </>
  );
};

// 3 · fullscreen: until 2025 everything over 5.000 € went to the Landgericht, rope "NUR MIT ANWALT", lawyer bill > 1.000 €
const PX = 5;
const BILL_ROWS = [
  { l: "VERFAHRENSGEBÜHR 1,3", at: () => A.kostete },
  { l: "TERMINSGEBÜHR 1,2", at: () => A.kostete + 0.25 },
  { l: "AUSLAGEN + 19 % UST", at: () => A.tausend - 0.1 },
];
const FullLand: React.FC<{ t: number }> = ({ t }) => {
  const zoom = 1 + 0.05 * k(t, A.bis1, 6, Easing.inOut(Easing.sin));
  const ropeY = (PLAZA_COURT.groundY + 14) * PX;
  const fee = interpolate(t, [A.kostete, A.euro2], [0, 1000], { ...clamp, easing: Easing.out(Easing.cubic) });
  const billIn = k(t, A.kostete - 0.2, 0.45, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill style={{ background: "#B7C4CE", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}>
        <CourtPlazaPlate cell={PX} tone="land" t={t} />
        <FriezeSign text="LANDGERICHT" x={PLAZA_COURT.signX * PX} y={PLAZA_COURT.signY * PX} w={PLAZA_COURT.signW * PX} h={PLAZA_COURT.signH * PX} glow={k(t, A.landgericht - 0.1, 0.3) * (1 - k(t, A.dort, 0.4))} />
        {[150, 882].map((x) => <div key={x} style={{ position: "absolute", left: x, top: ropeY - 16 }}><Sprite {...POST} px={8} /></div>)}
        {t > A.dort - 0.15 ? <div style={{ position: "absolute", inset: 0, ...popStyle(t, A.dort - 0.15, 30, 0.6) }}><PixelRope x1={176} x2={906} y={ropeY} px={8} sag={44} sign="NUR MIT ANWALT" signSize={34} /></div> : null}
        <Bot t={t} x={lerp(t, A.bis1, A.landgericht, 120, 330)} y={ropeY + 160} px={10} hat="helmet" prop="letter" color={YOU} seed={1} hopAmp={t > A.dort ? 2 : 6} style={{ transform: `translateX(${shakeAt(t, A.dort + 0.1, 8)}px)` }} />
        {t > A.dort + 0.15 ? <div style={{ position: "absolute", left: 420, top: ropeY + 110, ...popStyle(t, A.dort + 0.15, 10, 0.4) }}><PixelText text="?" size={44} /></div> : null}
        <Bot t={t} x={lerp(t, A.anwalt1 - 0.4, A.anwalt1 + 0.3, 1120, 640)} y={ropeY + 150} px={11} hat="tophat" prop="calc" color={LAWYER} seed={3} hopAmp={4} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 60, ...popStyle(t, A.bis1, 10, 0.8) }}><LabelChip text="Bis 2025" size={34} /></div>
      <div style={{ position: "absolute", right: 60, top: 52, ...popStyle(t, A.fuenf - 0.1, 10, 0.6) }}><PixelText text="AB 5.000 €" size={40} color={C.gold} /></div>
      {t > A.kostete - 0.2 ? (
        <div style={{ position: "absolute", left: 150, top: 1420, transform: `translateY(${(1 - billIn) * 500}px) rotate(${-3 + (1 - billIn) * 12}deg)` }}>
          <PixelPaper w={780} h={420} style={{ padding: "22px 34px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 34 }}>KANZLEI-RECHNUNG</span><span style={{ fontSize: 18, color: "#8A7B66" }}>RVG</span></div>
            <div style={{ height: 5, background: "#2C2420", margin: "14px 0 6px" }} />
            {BILL_ROWS.map((r, i) => (t > r.at() ? <div key={i} style={{ fontSize: 22, marginTop: 14, ...popStyle(t, r.at(), 6, 0.8) }}>{r.l}</div> : null))}
            <div style={{ height: 5, background: "#2C2420", margin: "20px 0 10px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 24 }}>SUMME</span>
              <span style={{ fontSize: 60, color: C.red }}>{t > A.euro2 - 0.1 ? "ÜBER 1.000 €" : eur(fee)}</span>
            </div>
          </PixelPaper>
          <Stamp t={t} at={A.euro2 + 0.1} text="FÄLLIG" size={52} rot={-12} style={{ left: 500, top: -100 }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 4 · now: everything up to 10.000 € stays at the Amtsgericht, the rope opens
const SceneAmts: React.FC<{ t: number }> = ({ t }) => {
  const openAt = A.zehn1 + 0.25;
  const o = interpolate(t, [openAt, openAt + 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.bounce) });
  const limit = interpolate(t, [A.zehn1 - 0.15, A.zehn1 + 0.45], [5000, 10000], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ry = GROUND - 30;
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 120, ...popStyle(t, A.jetzt - 0.05, 10, 0.6) }}><PixelText text={`BIS ${eur(limit)}`} size={40} color={limit > 9999 ? "#7CE38B" : C.gold} /></div>
      <div style={{ position: "absolute", right: 90, top: 130, ...popStyle(t, A.jetzt, 10, 0.8) }}><LabelChip text="Seit 2026" dot={C.green} size={30} /></div>
      <PixelCard plate={<CourthousePlate cell={cell} tone="amts" t={t} />}>
        <FriezeSign text="AMTSGERICHT" {...SIGN} glow={k(t, A.amts0 - 0.1, 0.3)} />
        {[300, 600].map((x) => <div key={x} style={{ position: "absolute", left: x, top: ry - 8 }}><Sprite {...POST} px={4} /></div>)}
        <PixelRope x1={312} x2={612} y={ry} px={4} sag={18} open={o} sign="NUR MIT ANWALT" signSize={14} />
        <Bot t={t} x={lerp(t, openAt + 0.3, A.du2, 90, 420)} y={GROUND - 62} px={6} hat="helmet" prop="letter" color={YOU} seed={1} hopAmp={o > 0.9 ? 9 : 3} />
      </PixelCard>
      <Ribbon t={t} at={A.amts0} text="KEIN ANWALTSZWANG" bg={C.green} size={38} rot={-3} style={{ left: 200, top: 610 }} />
    </>
  );
};

// 5 · give Claude the invoice, the reminders and the mails
const FILES = [
  { name: "Rechnung_2026-041.pdf", at: () => A.rechnung - 0.1 },
  { name: "1_Mahnung.pdf", at: () => A.mahnungen - 0.1 },
  { name: "2_Mahnung.pdf", at: () => A.mahnungen + 0.15 },
  { name: "Mails_Kessler.pdf", at: () => A.mails - 0.1 },
];
const PROMPT = "Kessler Bau zahlt nicht. Schreib mir die Klage.";
const SceneUpload: React.FC<{ t: number }> = ({ t }) => {
  const sendAt = A.claude2 - 0.3;
  const sent = t > sendAt;
  const COMP = { x: 130, y: 330, w: 820, h: 330 };
  return (
    <>
      <ClaudeWin title="Klage Kessler Bau" style={{ left: 90, top: 40, width: 900, height: 690, ...popStyle(t, A.du2 - 0.08, 20, 0.92) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: fonts.semibold, fontSize: 34, color: CL.text, opacity: sent ? 0 : 1 }}>Kunde zahlt nicht?</div>
        {sent ? (
          <div style={{ position: "absolute", right: 36, top: 30, maxWidth: 640, background: CL.bubble, borderRadius: 18, padding: "16px 22px", fontFamily: fonts.medium, fontSize: 26, color: CL.text, ...popStyle(t, sendAt, 12, 0.85) }}>{PROMPT}</div>
        ) : null}
        <Composer w={COMP.w} h={COMP.h} text={sent ? "" : typed(PROMPT, t, A.mails + 0.15, sendAt - 0.08)} caret={!sent} plusOn={t > A.rechnung - 0.3 && t < A.mails} sendOn={!sent && t > A.mails + 0.2} fs={26}
          style={{ left: (900 - COMP.w) / 2, top: sent ? 470 : 120 + 0, transition: "none" }}
          file={sent ? null : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {FILES.map((f, i) => (t > f.at() ? <div key={i} style={popStyle(t, f.at(), 10, 0.6)}><FileChip name={f.name} meta="PDF" size={0.78} /></div> : null))}
            </div>
          )} />
      </ClaudeWin>
      <Pointer t={t} path={[
        { x: 900, y: 690, at: A.rechnung - 0.6 },
        { x: 202, y: 40 + 58 + 120 + COMP.h - 40, at: A.rechnung - 0.15, click: true },
        { x: 202, y: 40 + 58 + 120 + COMP.h - 40, at: A.mahnungen - 0.15, click: true },
        { x: 202, y: 40 + 58 + 120 + COMP.h - 40, at: A.mails - 0.15, click: true },
        { x: 90 + (900 - COMP.w) / 2 + COMP.w - 46, y: 40 + 58 + 120 + COMP.h - 40, at: sendAt, click: true },
      ]} />
      <Bot t={t} x={800} y={600} px={7} hat="helmet" prop="folder" color={YOU} seed={5} a={A.du2} />
    </>
  );
};

// 6 · page: Claude sorts by date and computes interest (top), finds the competent Amtsgericht (pixel card below)
const TIMELINE = [
  { d: "17.02.26", l: "Rechnung 6.480 €" },
  { d: "17.03.26", l: "fällig, nicht bezahlt" },
  { d: "24.03.26", l: "1. Mahnung" },
  { d: "14.04.26", l: "2. Mahnung" },
  { d: "02.05.26", l: "Mail: „zahlen nächste Woche“" },
];
const SceneOrdnet: React.FC<{ t: number }> = ({ t }) => {
  const zins = t > A.rechnet - 0.1;
  return (
    <>
      <ClaudeWin title="Klage Kessler Bau" style={{ left: 90, top: 50, width: 900, height: 670 }}>
        <div style={{ padding: "22px 34px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><ClaudeMark size={30} /><span style={{ fontFamily: fonts.semibold, fontSize: 30, color: CL.text }}>Chronologie</span>{t > A.datum ? <span style={popStyle(t, A.datum, 6, 0.6)}><Tag text="NACH DATUM" color={C.orange} size={15} /></span> : null}</div>
          {TIMELINE.map((r, i) => {
            const a = A.ordnet + i * 0.12;
            return t > a ? (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 52, borderBottom: `1px solid ${C.line}`, ...popStyle(t, a, 8, 0.85) }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.orange, width: 120 }}>{r.d}</span>
                <span style={{ fontFamily: fonts.medium, fontSize: 25, color: CL.text }}>{r.l}</span>
              </div>
            ) : null;
          })}
          {zins ? (
            <div style={{ marginTop: 22, borderRadius: 14, background: C.orangeSoft, padding: "16px 22px", ...popStyle(t, A.rechnet - 0.1, 10, 0.9) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontFamily: fonts.semibold, fontSize: 28, color: CL.text }}>Verzugszinsen</span><Tag text="§ 288 BGB" color={C.ink} size={14} /></div>
              {[{ k: "Hauptforderung", v: "6.480,00 €" }, { k: "Zinsen seit 17.03.2026", v: "9 %-Pkt. über Basiszins" }].map((r, i) => (
                t > A.verzugszinsen - 0.1 + i * 0.2 ? <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 21, color: CL.text, marginTop: 10, ...popStyle(t, A.verzugszinsen - 0.1 + i * 0.2, 6, 0.85) }}><span>{r.k}</span><span style={{ fontWeight: 800 }}>{r.v}</span></div> : null
              ))}
            </div>
          ) : null}
        </div>
      </ClaudeWin>
      <PixelCard top={840} plate={<CourthousePlate cell={cell} tone="amts" t={t} />}>
        <FriezeSign text={typed("AMTSGERICHT", t, A.amts1 - 0.1, A.amts1 + 0.4)} {...SIGN} glow={k(t, A.zustaendig, 0.3)} />
        <Bot t={t} x={lerp(t, A.sucht - 0.2, A.amts1 + 0.2, 60, 330)} y={GROUND - 72} px={7} prop="magnifier" seed={6} hopAmp={4} />
        {t > A.zustaendig - 0.05 ? <div style={{ position: "absolute", left: 600, top: 290, ...popStyle(t, A.zustaendig - 0.05, 8, 0.5) }}><Tag text="✓ ZUSTÄNDIG" color={C.green} size={26} /></div> : null}
      </PixelCard>
      <Card style={{ left: 90, top: 1320, width: 900, height: 150, padding: "0 34px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 20, ...popStyle(t, A.sucht - 0.05, 20, 0.9) }}>
        <div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: C.dim }}>SITZ DES KUNDEN</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 34, color: C.ink, marginTop: 6 }}>Augsburg</div>
        </div>
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: C.orange }}>→</span>
        <div style={{ fontFamily: fonts.bold, fontSize: 38, color: C.ink, minHeight: 46 }}>{typed("Amtsgericht Augsburg", t, A.amts1 - 0.1, A.amts1 + 0.45)}</div>
      </Card>
    </>
  );
};

// 7 · the finished lawsuit: Antrag, Begründung, Anlagen
const SECS = [
  { h: "I. ANTRAG", at: () => A.antrag - 0.1, lines: [0.95, 0.8, 0.6] },
  { h: "II. BEGRÜNDUNG", at: () => A.begruendung - 0.1, lines: [0.9, 0.95, 0.7] },
  { h: "III. ANLAGEN K1–K4", at: () => A.liste - 0.1, lines: [] },
];
const SceneKlage: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 110, top: 40, ...popStyle(t, A.und4 - 0.05, 30, 0.85) }}>
      <PixelPaper w={600} h={680} style={{ padding: "24px 30px", transform: "rotate(-1.5deg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: 46 }}>KLAGE</span><span style={{ fontSize: 15, color: "#8A7B66" }}>AN DAS AMTSGERICHT AUGSBURG</span></div>
        <div style={{ fontSize: 14, marginTop: 10, color: "#5E5346" }}>KLÄGER: DEIN BETRIEB · BEKLAGTE: KESSLER BAU GMBH</div>
        <div style={{ height: 5, background: "#2C2420", margin: "12px 0 4px" }} />
        {SECS.map((s, i) => (t > s.at() ? (
          <div key={i} style={{ marginTop: 18, ...popStyle(t, s.at(), 8, 0.85) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, color: C.orange }}>{s.h}<span style={{ width: 28, height: 28, background: C.green, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Check size={22} p={k(t, s.at() + 0.2, 0.2)} /></span></div>
            {s.lines.map((w, j) => <div key={j} style={{ height: 10, width: `${w * 100 * interpolate(t, [s.at() + j * 0.12, s.at() + j * 0.12 + 0.3], [0, 1], clamp)}%`, background: "#B8AE97", marginTop: 12 }} />)}
          </div>
        ) : null))}
        {t > A.anlagen - 0.1 ? (
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            {["K1", "K2", "K3", "K4"].map((x, i) => (
              <div key={x} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, ...popStyle(t, A.anlagen - 0.1 + i * 0.1, 10, 0.5) }}><Sprite {...LETTER} px={7} /><span style={{ fontSize: 14 }}>{x}</span></div>
            ))}
          </div>
        ) : null}
      </PixelPaper>
    </div>
    <Bot t={t} x={760} y={300} px={11} prop="pen" seed={7} a={A.und4} hopAmp={5} />
    {t > A.fertige ? <div style={{ position: "absolute", left: 760, top: 160, ...popStyle(t, A.fertige, 10, 0.6) }}><PixelText text="FERTIG" size={36} color="#7CE38B" /></div> : null}
  </>
);

// 8 · read once, sign, send it off
const SceneSend: React.FC<{ t: number }> = ({ t }) => {
  const fly = interpolate(t, [A.schickst - 0.05, A.ab + 0.1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const sig = k(t, A.unterschreibst - 0.05, 0.7, Easing.inOut(Easing.cubic));
  const doorX = 90 * cell - 20, doorY = 46 * cell;
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 34, ...popStyle(t, A.du3 - 0.05, 14, 0.8) }}>
        <PixelPaper w={440} h={196} style={{ padding: "16px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 24 }}>KLAGE</span>{t > A.durch + 0.15 ? <span style={{ fontSize: 16, color: C.green, ...popStyle(t, A.durch + 0.15, 6, 0.6) }}>✓ GELESEN</span> : null}</div>
          <div style={{ height: 8, width: "88%", background: "#B8AE97", marginTop: 14 }} />
          <div style={{ height: 8, width: "70%", background: "#B8AE97", marginTop: 10 }} />
          <svg width={220} height={56} viewBox="0 0 220 56" style={{ position: "absolute", left: 22, bottom: 14, overflow: "visible" }}>
            <path d="M4 40 C 20 8, 34 52, 50 26 S 76 10, 86 36 S 118 48, 132 20 S 168 30, 210 24" fill="none" stroke="#1F3F8F" strokeWidth={5} strokeLinecap="round" strokeDasharray={340} strokeDashoffset={340 * (1 - sig)} />
            <line x1={0} y1={50} x2={214} y2={50} stroke="#2C2420" strokeWidth={3} />
          </svg>
        </PixelPaper>
      </div>
      <div style={{ position: "absolute", right: 90, top: 100, ...popStyle(t, A.unterschreibst, 10, 0.6) }}><Tag text="UNTERSCHRIEBEN" color={C.ink} size={26} /></div>
      <PixelCard plate={<CourthousePlate cell={cell} tone="amts" t={t} />}>
        <FriezeSign text="AMTSGERICHT" {...SIGN} />
        <Bot t={t} x={80} y={GROUND - 66} px={6} hat="helmet" color={YOU} seed={1} hopAmp={t > A.ab ? 9 : 4} />
        {t > A.schickst - 0.05 && fly < 1 ? (
          <div style={{ position: "absolute", left: 150 + (doorX - 150) * fly, top: GROUND - 90 + (doorY - (GROUND - 90)) * fly - Math.sin(fly * Math.PI) * 170, transform: `rotate(${fly * 360}deg) scale(${1.4 - 0.6 * fly})` }}><Sprite {...LETTER} px={8} /></div>
        ) : null}
      </PixelCard>
      <Stamp t={t} at={A.ab + 0.15} text="EINGEREICHT" size={48} rot={-6} style={{ left: 300, top: 560 }} />
    </>
  );
};

// 9 · page: the real guide scrolls past
const PAGES = Array.from({ length: 11 }, (_, i) => staticFile(`klage-guide/p${i + 1}.png`));
const PDF = { left: 120, top: 520, w: 840, h: 1260, bar: 76, pw: 780, ph: Math.round((780 * 936) / 662), gap: 26 };
const PITCH = PDF.ph + PDF.gap;
const PDF_IN = A.alle - 0.05, PDF_OUT = A.komm - 0.32;
const SAMPLES = 8, SHUTTER = 0.6 / 25;
const scrollY = (t: number) => interpolate(t, [PDF_IN + 0.3, PDF_OUT - 0.1], [0, (PAGES.length - 1) * PITCH], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const SceneGuide: React.FC<{ t: number }> = ({ t }) => {
  const inY = interpolate(t, [PDF_IN, PDF_IN + 0.3], [PDF.h + 700, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const y = scrollY(t);
  const page = Math.min(PAGES.length, Math.max(1, Math.floor((y + (PDF.h - PDF.bar) / 2) / PITCH) + 1));
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 90, ...popStyle(t, A.fuenfP - 0.05, 10, 0.6) }}><PixelText text="5 PROMPTS" size={44} color={C.gold} /></div>
      <div style={{ position: "absolute", left: 90, top: 200, ...popStyle(t, A.checkliste - 0.05, 10, 0.6) }}><PixelText text="+ CHECKLISTE" size={44} color="#7CE38B" /></div>
      <Bot t={t} x={780} y={150} px={11} prop="pdf" seed={8} a={A.alle} />
      <div style={{ position: "absolute", left: PDF.left, top: PDF.top, width: PDF.w, height: PDF.h, borderRadius: 18, overflow: "hidden", background: "#E9E7E1", border: "6px solid #2C2420", boxShadow: "12px 12px 0 rgba(0,0,0,0.22)", transform: `translateY(${inY}px) rotate(${interpolate(t, [PDF_IN, PDF_IN + 0.3], [-4, 0], clamp)}deg)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: PDF.bar, background: "#2C2420", display: "flex", alignItems: "center", padding: "0 24px", gap: 14, zIndex: 2 }}>
          <span style={{ fontFamily: PIXEL, fontSize: 26, color: "#FFF" }}>KLAGE-GUIDE.PDF</span>
          <span style={{ marginLeft: "auto", fontFamily: PIXEL, fontSize: 26, color: "#2C2420", background: C.gold, padding: "6px 12px" }}>{page}/{PAGES.length}</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: PDF.bar, bottom: 0, overflow: "hidden" }}>
          {Array.from({ length: SAMPLES }, (_, j) => {
            const yy = scrollY(t - (j / (SAMPLES - 1)) * SHUTTER);
            return (
              <div key={j} style={{ position: "absolute", left: (PDF.w - 12 - PDF.pw) / 2, top: 22 - yy, opacity: 1 / (j + 1) }}>
                {PAGES.map((src, i) => <Img key={i} src={src} style={{ position: "absolute", left: 0, top: i * PITCH, width: PDF.pw, height: PDF.ph, borderRadius: 4, boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />)}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

// 10 · end: comment KLAGE + follow
const SceneEnd: React.FC<{ t: number }> = ({ t }) => {
  const followed = t > A.folg + 0.25;
  const num = (n: number) => <span style={{ width: 62, height: 62, borderRadius: "50%", background: C.ink, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>;
  return (
    <>
      <Bot t={t} x={470} y={92} px={10} prop="letter" seed={14} a={A.komm - 0.1} />
      <Card style={{ left: 90, top: 255, width: 900, height: 440, padding: "40px 46px", boxSizing: "border-box", ...popStyle(t, A.komm - 0.12, 26, 0.85) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, height: 120 }}>
          {num(1)}
          <span style={{ fontFamily: fonts.bold, fontSize: 44, color: C.ink }}>Kommentiere</span>
          <span style={{ marginLeft: "auto", minWidth: 260, textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 54, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: 14, padding: "10px 24px", boxShadow: "0 12px 26px rgba(217,119,87,0.35)" }}>{typed("KLAGE", t, A.trigger - 0.1, A.trigger + 0.3) || " "}</span>
        </div>
        <div style={{ height: 1, background: C.line, margin: "14px 0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 22, height: 120, ...popStyle(t, A.folg - 0.1, 10, 0.85) }}>
          {num(2)}
          <span style={{ fontFamily: fonts.bold, fontSize: 44, color: C.ink }}>Folgen</span>
          <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: C.dim }}>@florent_preusser</span>
          <span style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: followed ? C.green : C.blue, borderRadius: 999, padding: "12px 26px" }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
        </div>
        <div style={{ position: "absolute", left: 46, bottom: 30, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: C.dim }}>GUIDE · 11 SEITEN · PER DM</div>
      </Card>
    </>
  );
};

const SCENES: OpusScene[] = [
  { from: 0, to: A.bis0 - 0.05, kind: "split", El: SceneHook },
  { from: A.bis0 - 0.05, to: A.bis1 - 0.05, kind: "split", El: SceneOhne },
  { from: A.bis1 - 0.05, to: A.jetzt - 0.05, kind: "full", El: FullLand },
  { from: A.jetzt - 0.05, to: A.du2 - 0.05, kind: "split", El: SceneAmts },
  { from: A.du2 - 0.05, to: A.claude2 - 0.05, kind: "split", El: SceneUpload },
  { from: A.claude2 - 0.05, to: A.und4 - 0.05, kind: "page", El: SceneOrdnet },
  { from: A.und4 - 0.05, to: A.du3 - 0.05, kind: "split", El: SceneKlage },
  { from: A.du3 - 0.05, to: A.alle - 0.05, kind: "split", El: SceneSend },
  { from: A.alle - 0.05, to: A.komm - 0.12, kind: "page", El: SceneGuide },
  { from: A.komm - 0.12, to: 999, kind: "split", El: SceneEnd },
];

export const KlagePixelOpus: React.FC = () => (
  <OpusMaster src="render-fpn-klage-tightened-skin.mp4" scenes={SCENES} caps={CAPS} overlay={HookLines} splitSrcTop={380} />
);
