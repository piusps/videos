import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { fonts } from "../theme";
import captions from "../../runs/fpn-amazon/captions.json";
import { PixelBot } from "../components/PixelBot";
import { GreenRoomPlate, LandlordPlate, OfficePlate, PlazaPlate, StorefrontPlate } from "../components/PixelTown";
import {
  Bot, C, CARD, CL, Card, Cap, Check, ClaudeMark, FileChip, Ico, I, LabelChip, LETTER, MONO, OpusMaster, OpusScene, PIXEL, PixelCard,
  PixelPaper, PixelText, Pointer, Ribbon, Sprite, Stamp, Tag, clamp, eur, k, makeTimeline, popStyle, shadow, shakeAt, typed,
} from "../components/OpusKit";

// FP-N "Amazon-Rechnungen" (Henri 2026-10-23) in the opusjake style we built for MieteOpus: pixel-world cards on the
// off-white panel, anthracite seam captions, card-only pages and one fullscreen pixel town. Anchored to
// runs/fpn-amazon/captions.json (tightened timeline); the avatar is the existing skin-graded render.

const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
export const AP_FRAMES = TL.frames;
export const A = {
  buero: at("bürostühle"), amazon0: at("amazon", 0), vier0: at("vierhundert", 0), viel: at("viel"), denn: at("denn"), haendler: at("amazonhändler"),
  keine: at("keine"), rechnung0: at("rechnung", 0), zehn: at("zehn"), stuehle: at("stühle"), zweihundert: at("zweihundertfünfzig"), euro1: at("euro", 1),
  stecken: at("stecken"), vier1: at("vierhundert", 1), mwst: at("mehrwertsteuer"), ohne: at("ohne"), nichts: at("nichts"), zurueck: at("zurück"),
  ab: at("ab"), holt: at("holt"), fehlende: at("fehlende"), direkt: at("direkt"), browser: at("browser"),
  du2: at("du", 2), amazon1: at("amazon", 1), scannt: at("scannt"), bestellungen: at("bestellungen"), sucht: at("sucht"), geschaeft: at("geschäft"),
  fehlen: at("fehlen"), bei: at("bei"), oeffnet: at("öffnet"), laedt: at("lädt"), runter: at("runter"), schaust: at("schaust"),
  dann: at("dann"), prueft: at("prüft"), firma: at("firma"), ust: at("umsatzsteuer"), datum: at("leistungsdatum"),
  und3: at("und", 3), klickt: at("klickt"), haendler2: at("händler"), anfordern: at("anfordern"), schreibt: at("schreibt"), fehlt1: at("fehlt", 1),
  einloggen: at("einloggen"), musst: at("musst"), selbst2: at("selbst", 2), den: at("den"), rest: at("rest"), komm: at("kommentiere"), amazon2: at("amazon", 2),
  prompts: at("prompts"), nutze: at("nutze"),
};

// ---------- pixel props ----------
const CHAIR = {
  rows: ["..KKKKKK..", ".KBBBBBBK.", ".KBHBBBBK.", ".KBBBBBBK.", ".KBBBBBBK.", "..KKKKKK..", "....KK....", "KKKKKKKKKK", "KBBBBBBBBK", "KKKKKKKKKK", "....KK....", "....KK....", ".KKKKKKKK.", "K..K..K..K"],
  pal: { K: "#1E242E", B: "#3E4A5E", H: "#6A7A94" },
};
const BOX = {
  rows: ["BBBBBBBBBB", "BLLLTTLLLB", "BLLLTTLLLB", "BBBBBBBBBB", "BLLLLLLLLB", "BLLLLLLLLB", "BLLLLLLLLB", "BBBBBBBBBB"],
  pal: { B: "#8A5A34", L: "#C8955E", T: "#E8D9B5" },
};
const COIN = { rows: [".YYYY.", "YYWYYY", "YWYYYY", "YYYYYD", "YYYYDD", ".DDDD."], pal: { Y: "#F5C542", W: "#FFF3B0", D: "#C9A227" } };
const chairX = (i: number) => 40 + i * 84;

// frame-0 hook (readable without animation at t=0)
const HookLines: React.FC<{ t: number }> = ({ t }) => {
  if (t > A.denn) return null;
  const out = k(t, A.denn - 0.2, 0.2);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 46, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: 1 - out, zIndex: 9 }}>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.1em", color: "#FFF", background: C.pill, borderRadius: 14, padding: "12px 30px" }}>10 BÜROSTÜHLE</div>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 46, letterSpacing: "0.08em", color: "#FFF", background: C.red, borderRadius: 12, padding: "6px 22px" }}>400 € ZU VIEL BEZAHLT</div>
    </div>
  );
};

// 1 · ten office chairs in the office, 400 € gone
const SceneHook: React.FC<{ t: number }> = ({ t }) => (
  <PixelCard plate={<OfficePlate cell={CARD.cell} />}>
    {Array.from({ length: 10 }, (_, i) => {
      const b = Math.max(0, 1 - Math.abs(t - (A.buero + i * 0.06)) / 0.15);
      return <div key={i} style={{ position: "absolute", left: chairX(i), top: 356 - b * 18 }}><Sprite {...CHAIR} px={5} /></div>;
    })}
    <div style={{ position: "absolute", left: 600, top: 120, ...popStyle(t, A.amazon0 - 0.1, 20, 0.5) }}><Sprite {...BOX} px={9} /></div>
    <Stamp t={t} at={A.vier0} text="−400 €" size={56} rot={-8} style={{ left: 330, top: 150 }} />
  </PixelCard>
);

// 2 · the marketplace seller ships the chairs with a slip, not a real invoice
const SceneHaendler: React.FC<{ t: number }> = ({ t }) => {
  const c = CARD.cell;
  const fly = k(t, A.keine - 0.35, 0.45, Easing.out(Easing.cubic));
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 130, ...popStyle(t, A.haendler, 10, 0.8) }}><Tag text="AMAZON-HÄNDLER" color={C.ink} size={34} /></div>
      <PixelCard plate={<StorefrontPlate cell={c} />}>
        <div style={{ position: "absolute", left: 58 * c, top: 10 * c, width: 64 * c, height: 10 * c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PIXEL, fontSize: 28, color: "#F3E9D2" }}>VERSAND</div>
        <Bot t={t} x={84 * c} y={72 * c - 78} px={6} hat="cap" prop="none" seed={2} />
        <div style={{ position: "absolute", left: 140, top: 270 }}><Sprite {...BOX} px={7} /></div>
        <div style={{ position: "absolute", left: 470 + (1 - fly) * 40, top: 60 + (1 - fly) * 220, transform: `rotate(${-4 + (1 - fly) * 30}deg) scale(${0.4 + 0.6 * fly})`, opacity: k(t, A.keine - 0.35, 0.1) }}>
          <PixelPaper w={330} h={250}>
            <div style={{ fontSize: 26 }}>LIEFERSCHEIN</div>
            <div style={{ height: 4, background: "#2C2420", margin: "12px 0" }} />
            <div style={{ fontSize: 17 }}>10 × BÜROSTUHL</div>
            <div style={{ fontSize: 15, color: C.red, marginTop: 14 }}>KEINE UST-ID</div>
            <div style={{ fontSize: 15, color: C.red, marginTop: 6 }}>KEIN LEISTUNGSDATUM</div>
            <div style={{ fontSize: 15, color: C.red, marginTop: 6 }}>KEINE FIRMA</div>
          </PixelPaper>
        </div>
      </PixelCard>
      <Ribbon t={t} at={A.rechnung0} text="KEINE RICHTIGE RECHNUNG" bg={C.red} size={40} rot={-3} style={{ left: 150, top: 560 }} />
    </>
  );
};

// 3 · page: 10 × 250 € on top, the 400 € VAT inside them below the seam
const coinAt = (i: number) => A.stecken + i * ((A.mwst + 0.3 - A.stecken) / 10);
const SceneMwst: React.FC<{ t: number }> = ({ t }) => {
  const vat = interpolate(t, [A.vier1 - 0.2, A.mwst + 0.4], [0, 399.16], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 40, ...popStyle(t, A.zehn - 0.05, 10, 0.8) }}><LabelChip text="10 × 250 € = 2.500 €" size={30} /></div>
      <PixelCard top={130} plate={<GreenRoomPlate cell={CARD.cell} />}>
        {Array.from({ length: 10 }, (_, i) => {
          const a = A.zehn - 0.05 + i * ((A.zweihundert + 0.3 - A.zehn) / 10);
          const coin = coinAt(i);
          const q = interpolate(t, [coin, coin + 0.4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: chairX(i) - 4, top: 330, ...popStyle(t, a, 20, 0.5) }}><Sprite {...CHAIR} px={6} /></div>
              {t > a + 0.1 ? <div style={{ position: "absolute", left: chairX(i) - 6, top: 288, ...popStyle(t, a + 0.1, 8, 0.6) }}><Tag text="250 €" color={C.ink} size={14} /></div> : null}
              {t > coin && q < 1 ? <div style={{ position: "absolute", left: chairX(i) + 12 + (420 - chairX(i)) * q, top: 320 - (200 * q) - Math.sin(q * Math.PI) * 60 }}><Sprite {...COIN} px={5} /></div> : null}
            </React.Fragment>
          );
        })}
        {t > A.stecken ? (
          <div style={{ position: "absolute", left: 360, top: 50, display: "flex", alignItems: "center", gap: 16, ...popStyle(t, A.stecken, 10, 0.6) }}>
            <Sprite {...COIN} px={9} />
            <PixelText text={`MWST ${eur(vat)}`} size={34} color={C.gold} />
          </div>
        ) : null}
      </PixelCard>
      <Card style={{ left: 90, top: 840, width: 900, height: 600, padding: "34px 40px", boxSizing: "border-box", ...popStyle(t, A.zehn + 0.2, 30, 0.9) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim }}>BESTELLUNG · 10 BÜROSTÜHLE</div>
        <div style={{ borderTop: `3px dashed ${C.line}`, margin: "18px 0 10px" }} />
        {[
          { l: "10 × Bürostuhl à 250 €", v: "2.500,00 €", a: A.zweihundert, c: C.ink },
          { l: "netto", v: "2.100,84 €", a: A.euro1, c: C.dim },
          { l: "davon MwSt. 19 %", v: "399,16 €", a: A.mwst, c: C.orange },
        ].map((r, i) => (t > r.a - 0.1 ? (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 74, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: r.c, borderRadius: 10, padding: "0 12px", background: i === 2 ? C.orangeSoft : "transparent", ...popStyle(t, r.a - 0.1, 8, 0.85) }}>
            <span>{r.l}</span><span>{r.v}</span>
          </div>
        ) : null))}
        <div style={{ borderTop: `3px dashed ${C.line}`, margin: "16px 0 18px" }} />
        {t > A.mwst + 0.2 ? (
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", ...popStyle(t, A.mwst + 0.2, 8, 0.8) }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, letterSpacing: "0.12em", color: C.ink }}>ZURÜCK VOM FINANZAMT</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 70, color: C.green }}>≈ 400 €</span>
          </div>
        ) : null}
        <div style={{ fontFamily: fonts.medium, fontSize: 24, color: C.dim, marginTop: 18, opacity: k(t, A.mwst + 0.4, 0.3) }}>… aber nur mit richtiger Rechnung.</div>
      </Card>
    </>
  );
};

// 4 · without the invoice: the tax office keeps the door shut, 400 € → 0 €
const SceneFinanzamt: React.FC<{ t: number }> = ({ t }) => {
  const c = CARD.cell;
  const v = interpolate(t, [A.nichts - 0.1, A.zurueck + 0.1], [400, 0], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 130, ...popStyle(t, A.ohne, 10, 0.8) }}><Tag text="OHNE RECHNUNG" color={C.ink} size={34} /></div>
      <div style={{ position: "absolute", right: 90, top: 118 }}><PixelText text={`VORSTEUER ${eur(v)}`} size={32} color={v < 1 ? C.red : C.gold} style={{ transform: `translateX(${shakeAt(t, A.nichts, 6)}px)` }} /></div>
      <PixelCard plate={<LandlordPlate cell={c} />}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 6, display: "flex", justifyContent: "center" }}><PixelText text="FINANZAMT" size={22} /></div>
        <Bot t={t} x={90 * c - 40} y={62 * c - 78} px={6} hat="glasses" seed={3} hopAmp={3} />
        <Bot t={t} x={640} y={86 * c - 98} px={7} prop="pdf" seed={4} style={{ transform: `translateX(${shakeAt(t, A.zurueck, 7)}px)` }} />
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 760 + (i % 3) * 22, top: 380 - Math.floor(i / 3) * 18 - (t > A.nichts ? k(t, A.nichts + i * 0.05, 0.3) * 260 : 0), opacity: 1 - k(t, A.nichts + i * 0.05, 0.3) }}><Sprite {...COIN} px={5} /></div>
        ))}
      </PixelCard>
      <Ribbon t={t} at={A.zurueck} text="0 € ZURÜCK" bg={C.red} size={48} rot={-4} style={{ left: 300, top: 430 }} />
    </>
  );
};

// generic light browser window (address bar + optional Claude side panel)
const Browser: React.FC<{ url: string; style?: React.CSSProperties; panel?: React.ReactNode; panelW?: number; children?: React.ReactNode }> = ({ url, style, panel, panelW = 300, children }) => (
  <div style={{ position: "absolute", background: "#FFF", borderRadius: 16, boxShadow: shadow, overflow: "hidden", border: `1px solid ${CL.border}`, ...style }}>
    <div style={{ height: 56, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", background: "#F2F0EB", borderBottom: `1px solid ${CL.border}` }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((col) => <span key={col} style={{ width: 14, height: 14, borderRadius: "50%", background: col }} />)}
      <div style={{ marginLeft: 14, flex: 1, height: 34, borderRadius: 10, background: "#FFF", border: `1px solid ${CL.border}`, display: "flex", alignItems: "center", padding: "0 14px", fontFamily: MONO, fontSize: 18, color: CL.sub, whiteSpace: "nowrap" }}>{url}</div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 56, bottom: 0, right: panel ? panelW : 0, overflow: "hidden" }}>{children}</div>
    {panel ? (
      <div style={{ position: "absolute", right: 0, top: 56, bottom: 0, width: panelW, background: CL.page, borderLeft: `1px solid ${CL.border}`, padding: "16px 18px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><ClaudeMark size={26} /><span style={{ fontFamily: fonts.semibold, fontSize: 22, color: CL.text }}>Claude</span></div>
        {panel}
      </div>
    ) : null}
  </div>
);
const Skel: React.FC<{ w: string; h?: number; c?: string; mt?: number }> = ({ w, h = 14, c = C.line, mt = 12 }) => <div style={{ width: w, height: h, borderRadius: 7, background: c, marginTop: mt }} />;

// 5 · from today Claude fetches every missing invoice, right in your browser
const SceneBrowser: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 90, top: 130, ...popStyle(t, A.ab - 0.05, 10, 0.8) }}><LabelChip text="Ab heute holt Claude sie selbst" size={30} /></div>
    <Browser url="amazon.de/gp/your-account/order-history" style={{ left: 90, top: 215, width: 900, height: 480, ...popStyle(t, A.ab, 20, 0.9) }}
      panel={<div style={{ background: "#FFF", border: `1px solid ${CL.border}`, borderRadius: 14, padding: "12px 14px", fontFamily: fonts.medium, fontSize: 21, lineHeight: 1.35, color: CL.text, minHeight: 90 }}>{typed("Ich hole dir jede fehlende Rechnung.", t, A.holt, A.fehlende + 0.6)}</div>}>
      <div style={{ padding: "22px 26px" }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 30, color: CL.text }}>Meine Bestellungen</div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, paddingBottom: 14, borderBottom: `1px solid ${C.line}` }}>
            <div style={{ width: 62, height: 62, borderRadius: 10, background: "#F2EFE8", display: "flex", alignItems: "center", justifyContent: "center" }}>{i === 0 ? <Sprite {...CHAIR} px={3} /> : <Sprite {...BOX} px={4} />}</div>
            <div style={{ flex: 1 }}><Skel w={`${70 - i * 8}%`} mt={0} /><Skel w="40%" h={10} /></div>
          </div>
        ))}
      </div>
    </Browser>
    <Bot t={t} x={830} y={100} px={7} prop="folder" seed={5} a={A.holt} />
    <Ribbon t={t} at={A.direkt} text="DIREKT IM BROWSER" bg={C.orange} size={38} rot={-3} style={{ left: 230, top: 600 }} />
  </>
);

// 6 · page: Claude scans the orders (top) and sorts business vs private (pixel card below the seam)
const ORDERS = [
  { l: "10 × Bürostuhl", biz: true, miss: true, sprite: CHAIR },
  { l: "Monitor 27 Zoll", biz: true, miss: true, sprite: BOX },
  { l: "Kaffeebohnen 1 kg", biz: false, miss: false, sprite: BOX },
  { l: "Druckerpapier A4", biz: true, miss: false, sprite: BOX },
  { l: "Headset", biz: true, miss: true, sprite: BOX },
  { l: "Kinderbuch", biz: false, miss: false, sprite: BOX },
];
const tagAt = (i: number) => A.sucht + i * ((A.geschaeft + 0.3 - A.sucht) / ORDERS.length);
const SceneScan: React.FC<{ t: number }> = ({ t }) => {
  const scanY = interpolate(t, [A.scannt, A.sucht], [0, 6 * 68], clamp);
  const c = CARD.cell;
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 30, ...popStyle(t, A.du2 - 0.05, 10, 0.8) }}><LabelChip text="Claude scannt deine Bestellungen" size={28} /></div>
      <Browser url="amazon.de/gp/your-account/order-history" style={{ left: 90, top: 110, width: 900, height: 570 }}
        panel={<div style={{ fontFamily: MONO, fontSize: 17, lineHeight: 1.6, color: CL.sub }}>{typed("Scanne 48 Bestellungen …", t, A.scannt, A.bestellungen + 0.3)}{t > A.geschaeft ? <div style={{ color: C.orange, fontWeight: 800 }}>4 geschäftlich</div> : null}{t > A.fehlen ? <div style={{ color: C.red, fontWeight: 800 }}>3 ohne Rechnung</div> : null}</div>} panelW={230}>
        <div style={{ padding: "14px 22px", position: "relative" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 28, color: CL.text, marginBottom: 6 }}>Meine Bestellungen</div>
          {ORDERS.map((o, i) => {
            const tg = t > tagAt(i);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, height: 68, borderBottom: `1px solid ${C.line}` }}>
                <div style={{ width: 50, height: 50, borderRadius: 8, background: "#F2EFE8", display: "flex", alignItems: "center", justifyContent: "center" }}><Sprite {...o.sprite} px={o.sprite === CHAIR ? 3 : 4} /></div>
                <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: tg && !o.biz ? C.dim : CL.text, flex: 1 }}>{o.l}</span>
                {tg ? <span style={popStyle(t, tagAt(i), 6, 0.6)}><Tag text={o.biz ? "GESCHÄFT" : "PRIVAT"} color={o.biz ? C.orange : "#B9B4AC"} size={15} /></span> : null}
                {o.miss && t > A.fehlen - 0.05 + i * 0.05 ? <span style={popStyle(t, A.fehlen - 0.05 + i * 0.05, 6, 0.6)}><Tag text="RECHNUNG FEHLT" color={C.red} size={15} /></span> : null}
              </div>
            );
          })}
          {t > A.scannt && t < A.sucht + 0.2 ? <div style={{ position: "absolute", left: 0, right: 0, top: 58 + scanY, height: 6, background: C.orange, boxShadow: "0 0 24px rgba(217,119,87,0.8)", opacity: 1 - k(t, A.sucht, 0.2) }} /> : null}
        </div>
      </Browser>
      <PixelCard top={830} plate={<OfficePlate cell={c} />}>
        <Bot t={t} x={400} y={250} px={8} prop="magnifier" seed={6} />
        {[{ x: 60, label: "GESCHÄFT", col: C.orange }, { x: 660, label: "PRIVAT", col: "#8A877F" }].map((b) => (
          <div key={b.label} style={{ position: "absolute", left: b.x, top: 300 }}>
            <div style={{ width: 180, height: 110, background: "#8A5A34", border: "6px solid #5E3520", boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: -48, display: "flex", justifyContent: "center" }}><Tag text={b.label} color={b.col} size={18} /></div>
          </div>
        ))}
        {ORDERS.map((o, i) => {
          const a = tagAt(i);
          if (t < a) return null;
          const q = interpolate(t, [a, a + 0.4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          const tx = o.biz ? 90 + (i % 3) * 30 : 700 + (i % 2) * 40, ty = 270 - Math.floor(i / 3) * 14;
          return <div key={i} style={{ position: "absolute", left: 450 + (tx - 450) * q, top: 230 + (ty - 230) * q - Math.sin(q * Math.PI) * 140 }}><Sprite {...BOX} px={5} /></div>;
        })}
        {[0, 1, 4].map((i, j) => (t > A.fehlen + j * 0.08 ? <div key={i} style={{ position: "absolute", left: 70 + j * 56, top: 200, ...popStyle(t, A.fehlen + j * 0.08, 8, 0.5) }}><Tag text="!" color={C.red} size={22} /></div> : null))}
      </PixelCard>
    </>
  );
};

// 7 · fullscreen town: the bot runs from seller to seller and brings back each invoice, you just watch
const CELL = 5;
const SHOPS = [{ x: 27, y: 104 }, { x: 80, y: 104 }, { x: 126, y: 104 }];
const FILES = ["Rechnung_Buerostuehle.pdf", "Rechnung_Monitor.pdf", "Rechnung_Headset.pdf"];
const visitAt = (i: number) => A.oeffnet + i * ((A.runter + 0.3 - A.oeffnet) / SHOPS.length);
const FullTown: React.FC<{ t: number }> = ({ t }) => {
  let bx = SHOPS[0].x * CELL, by = SHOPS[0].y * CELL + 40;
  SHOPS.forEach((s, i) => {
    const a = visitAt(i) - 0.35;
    const q = interpolate(t, [a, a + 0.35], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    if (i > 0 && q > 0) { bx = SHOPS[i - 1].x * CELL + (s.x - SHOPS[i - 1].x) * CELL * q; by = s.y * CELL + 40 - Math.sin(q * Math.PI) * 60; }
  });
  const got = SHOPS.filter((_, i) => t > visitAt(i) + 0.2).length;
  return (
    <AbsoluteFill style={{ background: "#A9DCF0", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.03 * k(t, A.bei, 3, Easing.inOut(Easing.sin))})`, transformOrigin: "50% 30%" }}>
        <PlazaPlate cell={CELL} t={t} />
        {SHOPS.map((s, i) => (t > visitAt(i) ? (
          <div key={i} style={{ position: "absolute", left: s.x * CELL - 40, top: s.y * CELL - 170 - k(t, visitAt(i), 0.5) * 30, opacity: 1 - k(t, visitAt(i) + 0.5, 0.2), ...popStyle(t, visitAt(i), 10, 0.5) }}><Sprite {...LETTER} px={10} /></div>
        ) : null))}
        <Bot t={t} x={bx - 50} y={by - 104} px={8} prop="folder" seed={7} />
        {t > A.schaust - 0.1 ? (
          <div style={{ position: "absolute", left: 60, top: 660, ...popStyle(t, A.schaust - 0.1, 14, 0.5) }}>
            <PixelBot px={8} t={t} grey prop="phone" seed={8} />
            <div style={{ marginTop: 10 }}><Tag text="DU SCHAUST ZU" color={C.ink} size={22} /></div>
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 90, top: 34, ...popStyle(t, A.bei - 0.05, 10, 0.8) }}><LabelChip text="Öffnen + runterladen" size={30} /></div>
      <div style={{ position: "absolute", right: 90, top: 30 }}><PixelText text={`RECHNUNGEN ${got}/3`} size={30} color={C.gold} /></div>
      <Card style={{ left: 90, top: 900, width: 900, height: 420, padding: "28px 34px", boxSizing: "border-box", ...popStyle(t, A.oeffnet - 0.1, 30, 0.9) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Ico d={I.doc} size={30} color={C.orange} sw={2.2} /><span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, letterSpacing: "0.14em", color: C.ink }}>DOWNLOADS</span></div>
        <div style={{ borderTop: `3px dashed ${C.line}`, margin: "18px 0 12px" }} />
        {FILES.map((f, i) => (t > visitAt(i) + 0.3 ? (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 92, ...popStyle(t, visitAt(i) + 0.3, 8, 0.85) }}>
            <FileChip name={f} meta="PDF · HERUNTERGELADEN" size={0.95} />
            <span style={{ marginLeft: "auto", width: 44, height: 44, borderRadius: 10, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={32} p={k(t, visitAt(i) + 0.4, 0.2)} /></span>
          </div>
        ) : null))}
      </Card>
    </AbsoluteFill>
  );
};

// 8 · check every invoice: company, VAT, service date
const CHECKS = [
  { l: "Deine Firma drauf", ok: true, at: () => A.firma },
  { l: "Umsatzsteuer ausgewiesen", ok: true, at: () => A.ust },
  { l: "Leistungsdatum", ok: false, at: () => A.datum },
];
const ScenePruefen: React.FC<{ t: number }> = ({ t }) => {
  const hl = (i: number) => (t > CHECKS[i].at() ? (CHECKS[i].ok ? C.greenSoft : C.redSoft) : "transparent");
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 130, ...popStyle(t, A.prueft - 0.05, 10, 0.8) }}><Tag text="PRÜFT JEDE EINZELNE" color={C.ink} size={34} /></div>
      <Card style={{ left: 90, top: 215, width: 430, height: 480, padding: "26px 28px", boxSizing: "border-box", ...popStyle(t, A.dann, 20, 0.9) }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 800, fontSize: 22, color: C.ink }}><span>RECHNUNG</span><span style={{ color: C.dim }}>Nr. 4711</span></div>
        <div style={{ fontFamily: fonts.medium, fontSize: 18, color: C.dim, marginTop: 6 }}>TechStore24 · Monitor 27 Zoll</div>
        <div style={{ marginTop: 20, padding: "10px 12px", borderRadius: 10, background: hl(0), fontFamily: fonts.semibold, fontSize: 22, color: C.ink }}>an: Deine Firma GmbH</div>
        <Skel w="80%" mt={16} /><Skel w="60%" />
        <div style={{ marginTop: 16, padding: "10px 12px", borderRadius: 10, background: hl(1), fontFamily: MONO, fontSize: 20, color: C.ink, display: "flex", justifyContent: "space-between" }}><span>USt. 19 %</span><span>47,73 €</span></div>
        <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: hl(2), fontFamily: MONO, fontSize: 20, color: t > A.datum ? C.red : C.ink, display: "flex", justifyContent: "space-between" }}><span>Leistungsdatum</span><span>—</span></div>
      </Card>
      <Card style={{ left: 560, top: 300, width: 430, height: 330, padding: "18px 24px", boxSizing: "border-box", ...popStyle(t, A.prueft, 20, 0.9) }}>
        {CHECKS.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, height: 98, borderBottom: i < 2 ? `1px solid ${C.line}` : "none" }}>
            <span style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: t > c.at() ? (c.ok ? C.green : C.red) : C.line, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: "#FFF" }}>
              {t > c.at() ? (c.ok ? <Check size={34} p={k(t, c.at(), 0.2)} /> : "✕") : null}
            </span>
            <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: C.ink }}>{c.l}</span>
          </div>
        ))}
      </Card>
      <Bot t={t} x={780} y={150} px={8} hat="glasses" prop="magnifier" seed={9} hopAmp={4} />
      <Stamp t={t} at={A.datum + 0.25} text="FEHLT" size={40} rot={-10} style={{ left: 300, top: 600 }} />
    </>
  );
};

// 9 · page: Claude clicks "Rechnung anfordern" at the seller and writes what is missing
const MSG = "Hallo, auf Ihrer Rechnung fehlt das Leistungsdatum. Bitte senden Sie mir eine korrigierte Rechnung. Danke!";
const SceneAnfordern: React.FC<{ t: number }> = ({ t }) => {
  const BTN = { x: 90 + 40, y: 110 + 56 + 330, w: 330, h: 64 };
  const clicked = t > A.anfordern;
  return (
    <>
      <Browser url="amazon.de/gp/your-account/order-details" style={{ left: 90, top: 110, width: 900, height: 560 }}>
        <div style={{ padding: "24px 40px" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 30, color: CL.text }}>Bestelldetails</div>
          <div style={{ display: "flex", gap: 22, marginTop: 22, alignItems: "center" }}>
            <div style={{ width: 120, height: 120, borderRadius: 12, background: "#F2EFE8", display: "flex", alignItems: "center", justifyContent: "center" }}><Sprite {...BOX} px={8} /></div>
            <div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: CL.text }}>Monitor 27 Zoll</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub, marginTop: 8 }}>Verkauf durch: TechStore24</div>
              <div style={{ fontFamily: MONO, fontSize: 20, color: C.red, marginTop: 8 }}>Rechnung unvollständig</div>
            </div>
          </div>
          <Skel w="70%" mt={30} /><Skel w="45%" />
        </div>
        <div style={{ position: "absolute", left: 40, top: 330, width: BTN.w, height: BTN.h, borderRadius: 999, border: `2px solid ${clicked ? C.green : "#C9C2B4"}`, background: clicked ? C.greenSoft : "#FFF", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: fonts.semibold, fontSize: 24, color: clicked ? C.green : CL.text, transform: `scale(${clicked && t < A.anfordern + 0.2 ? 0.96 : 1})` }}>
          {clicked ? <><Check size={26} color={C.green} />Angefordert</> : "Rechnung anfordern"}
        </div>
        <div style={{ position: "absolute", left: 400, top: 330, width: 300, height: 64, borderRadius: 999, border: "2px solid #E3DFD5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.semibold, fontSize: 24, color: CL.sub }}>Verkäufer kontaktieren</div>
      </Browser>
      <Pointer t={t} path={[
        { x: 820, y: 600, at: A.klickt - 0.1 },
        { x: BTN.x + 120, y: BTN.y + 36, at: A.anfordern, click: true },
        { x: 700, y: 620, at: A.anfordern + 0.7 },
      ]} />
      <div style={{ position: "absolute", left: 90, top: 840, width: 900, height: 560, ...popStyle(t, A.schreibt - 0.15, 30, 0.9) }}>
        <Card style={{ inset: 0, padding: "28px 34px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><ClaudeMark size={30} /><span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.ink }}>NACHRICHT AN TECHSTORE24</span></div>
          <div style={{ borderTop: `3px dashed ${C.line}`, margin: "18px 0" }} />
          <div style={{ fontFamily: fonts.medium, fontSize: 32, lineHeight: 1.35, color: C.ink }}>
            {typed(MSG, t, A.schreibt, A.fehlt1 + 0.3)}
            {t < A.fehlt1 + 0.3 ? <span style={{ display: "inline-block", width: 3, height: 34, background: C.orange, marginLeft: 3, verticalAlign: "middle" }} /> : null}
          </div>
          {t > A.fehlt1 + 0.35 ? <div style={{ position: "absolute", right: 34, bottom: 28, ...popStyle(t, A.fehlt1 + 0.35, 8, 0.6) }}><Tag text="✓ GESENDET" color={C.green} size={26} /></div> : null}
        </Card>
      </div>
    </>
  );
};

// 10 · log in yourself, the rest is Claude
const SceneLogin: React.FC<{ t: number }> = ({ t }) => {
  const done = t > A.selbst2 + 0.1;
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 130, ...popStyle(t, A.einloggen - 0.05, 10, 0.8) }}><Tag text="NUR DAS MACHST DU" color={C.ink} size={34} /></div>
      <Card style={{ left: 90, top: 215, width: 600, height: 480, padding: "34px 40px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, color: C.ink }}>Anmelden</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 22, color: C.dim, marginTop: 24 }}>E-Mail</div>
        <div style={{ height: 60, borderRadius: 10, border: `2px solid ${C.line}`, marginTop: 8, display: "flex", alignItems: "center", padding: "0 16px", fontFamily: fonts.medium, fontSize: 24, color: C.ink }}>{typed("du@deinefirma.de", t, A.einloggen, A.musst)}</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 22, color: C.dim, marginTop: 18 }}>Passwort</div>
        <div style={{ height: 60, borderRadius: 10, border: `2px solid ${C.line}`, marginTop: 8, display: "flex", alignItems: "center", padding: "0 16px", fontFamily: MONO, fontSize: 30, letterSpacing: "0.2em", color: C.ink }}>{"•".repeat(Math.round(interpolate(t, [A.einloggen + 0.5, A.selbst2], [0, 10], clamp)))}</div>
        <div style={{ height: 60, borderRadius: 999, marginTop: 26, background: done ? C.green : C.orange, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: fonts.semibold, fontSize: 26, color: "#FFF" }}>{done ? <><Check size={28} />Eingeloggt</> : "Weiter"}</div>
      </Card>
      <Bot t={t} x={760} y={330} px={10} prop="key" seed={10} hopAmp={done ? 12 : 4} />
    </>
  );
};

// 12 · end: comment + follow
const SceneEnd: React.FC<{ t: number }> = ({ t }) => {
  const followed = t > A.prompts + 0.2;
  const num = (n: number) => <span style={{ width: 62, height: 62, borderRadius: "50%", background: C.ink, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>;
  return (
    <>
      <Bot t={t} x={470} y={92} px={10} prop="letter" seed={14} a={A.komm - 0.1} />
      <Card style={{ left: 90, top: 255, width: 900, height: 440, padding: "40px 46px", boxSizing: "border-box", ...popStyle(t, A.komm - 0.12, 26, 0.85) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, height: 120 }}>
          {num(1)}
          <span style={{ fontFamily: fonts.bold, fontSize: 44, color: C.ink }}>Kommentiere</span>
          <span style={{ marginLeft: "auto", minWidth: 290, textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 54, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: 14, padding: "10px 24px", boxShadow: "0 12px 26px rgba(217,119,87,0.35)" }}>{typed("AMAZON", t, A.amazon2 - 0.08, A.amazon2 + 0.3) || " "}</span>
        </div>
        <div style={{ height: 1, background: C.line, margin: "14px 0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 22, height: 120, ...popStyle(t, A.amazon2 + 0.4, 10, 0.85) }}>
          {num(2)}
          <span style={{ fontFamily: fonts.bold, fontSize: 44, color: C.ink }}>Folgen</span>
          <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: C.dim }}>@florent_preusser</span>
          <span style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: followed ? C.green : C.blue, borderRadius: 999, padding: "12px 26px" }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
        </div>
        <div style={{ position: "absolute", left: 46, bottom: 30, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: C.dim }}>ICH SCHICK DIR ALLE PROMPTS PER DM</div>
      </Card>
    </>
  );
};

const None: React.FC<{ t: number }> = () => null;
const SCENES: OpusScene[] = [
  { from: 0, to: A.denn - 0.05, kind: "split", El: SceneHook },
  { from: A.denn - 0.05, to: A.zehn - 0.05, kind: "split", El: SceneHaendler },
  { from: A.zehn - 0.05, to: A.ohne - 0.05, kind: "page", El: SceneMwst },
  { from: A.ohne - 0.05, to: A.ab - 0.05, kind: "split", El: SceneFinanzamt },
  { from: A.ab - 0.05, to: A.du2 - 0.05, kind: "split", El: SceneBrowser },
  { from: A.du2 - 0.05, to: A.bei - 0.05, kind: "page", El: SceneScan },
  { from: A.bei - 0.05, to: A.dann - 0.05, kind: "full", El: FullTown },
  { from: A.dann - 0.05, to: A.und3 - 0.05, kind: "split", El: ScenePruefen },
  { from: A.und3 - 0.05, to: A.einloggen - 0.05, kind: "page", El: SceneAnfordern },
  { from: A.einloggen - 0.05, to: A.den - 0.05, kind: "split", El: SceneLogin },
  { from: A.den - 0.05, to: A.komm - 0.12, kind: "face", El: None },
  { from: A.komm - 0.12, to: 999, kind: "split", El: SceneEnd },
];

export const AmazonPixelOpus: React.FC = () => (
  <OpusMaster src="render-fpn-amazon-tightened-skin.mp4" scenes={SCENES} caps={CAPS} overlay={HookLines} />
);
