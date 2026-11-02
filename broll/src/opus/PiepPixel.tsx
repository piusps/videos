import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-pain-of-paying/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "Piep" (Pain of Paying, Prelec & Simester 2001, 2026-10-29) im Pixel-Niklas-Look wie DripPixel.
// Figur "dein Kumpel" (Share-Mechanik), Studie mit echten MIT-Folien (Aufbau + "$29 cash, $61 credit card").
// Pointe "Er sagt übrigens …" ruhig auf dem Gesicht, danach Gegenmittel #4 (Ausgaben-Check + Wochenbudget), Wort PIEP, "schick ihm das Video".

const W = 1080, H = 1920, PH = 960;
const GOLD = "#FFC83D", INK = "#141414", RED = "#D8463A", GREEN = "#4C9A5A", BLUE = "#3E7CC9", TEAL = "#2FD3B0";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
const END = CAPS[CAPS.length - 1].endMs / 1000;
export const PP_FRAMES = Math.round((END + 0.9) * 25);
export const A = {
  kumpel: at("kumpel", 0), apple: at("apple"), doener: at("döner"), piep0: at("piep", 0), spaeti: at("späti"), piep1: at("piep", 1), taxi: at("taxi"), piep2: at("piep", 2),
  fuenfzehnten: at("fünfzehnten"), zwanzig: at("zwanzig"), leihen: at("leihen"),
  heisst: at("heißt"), pain: at("pain"), bargeld: at("bargeld"), weh0: at("weh", 0), schein: at("schein"), handy: at("handy"), nichts: at("nichts"), hoert: at("hört"),
  forscher: at("forscher"), mit: at("mit", 0), bar: at("bar"), karte0: at("karte", 0), karte1: at("karte", 1), doppelt: at("doppelt"), gleichen: at("gleichen"),
  find: at("find"), fair: at("fair"), wehtun: at("wehtun"), kontostand: at("kontostand"),
  sagt: at("sagt"), piep3: at("piep", 3),
  damit: at("damit"), chatgpt: at("chatgpt"), gebaut: at("gebaut"), umsaetzen: at("umsätzen"), geld: at("geld"), wochenbudget: at("wochenbudget"), schafft: at("schafft"),
  schreib: at("schreib"), piep4: at("piep", 4), schick0: at("schick", 0), schick1: at("schick", 1), video: at("video"),
};

// ---------- pixel plates ----------
type Op = [number, number, number, number, string];
const painter = () => {
  const ops: Op[] = [];
  const R = (x: number, y: number, w: number, h: number, c: string) => { ops.push([x, y, w, h, c]); };
  const P = (x: number, y: number, c: string) => R(x, y, 1, 1, c);
  return { ops, R, P };
};
// night street: dark sky, shop fronts (Döner, Späti), pavement
const drawStreet = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#1E2A4A"); for (let i = 0; i < 26; i++) P((i * 37) % 180, (i * 23) % 50, "#FFF");
  R(150, 10, 8, 8, "#F4E9B0");
  R(0, 52, 180, 76, "#3A3F4A"); for (let y = 56; y < 128; y += 8) R(0, y, 180, 1, "#343944");
  R(8, 70, 70, 50, "#2A2E36"); R(8, 62, 70, 10, RED); R(14, 78, 58, 30, "#F4D58A");
  R(100, 70, 72, 50, "#2A2E36"); R(100, 62, 72, 10, GREEN); R(106, 78, 60, 30, "#BDE6F2");
  R(0, 128, 180, 32, "#6E6A64"); for (let x = 0; x < 180; x += 20) R(x, 128, 1, 32, "#5E5A55"); R(0, 128, 180, 1, "#8A857E");
  return p.ops;
};
const drawDark = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#22262E"); for (let y = 3; y < 160; y += 7) for (let x = (y % 2) * 5; x < 180; x += 11) P(x, y, "#2C313B");
  R(0, 132, 180, 28, "#1A1D23"); R(0, 132, 180, 1, GOLD);
  return p.ops;
};
const drawDesk = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#5B3B26"); for (let y = 2; y < 160; y += 5) for (let x = (y % 3) * 4; x < 180; x += 13) P(x, y, "#6B4730");
  for (let y = 0; y < 160; y += 16) R(0, y, 180, 1, "#4E321F");
  return p.ops;
};
// living room for the bank balance
const drawRoom = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 118, "#E9DFCF"); for (let y = 6; y < 118; y += 10) for (let x = (y / 10) % 2 ? 0 : 10; x < 180; x += 20) P(x, y, "#DDD0BC");
  R(0, 118, 180, 42, "#B98B5E"); for (let y = 122; y < 160; y += 6) R(0, y, 180, 1, "#A97B50");
  return p.ops;
};
const PLATES = { street: drawStreet(), dark: drawDark(), desk: drawDesk(), room: drawRoom() };
const Plate = React.memo<{ id: keyof typeof PLATES }>(({ id }) => (
  <svg width={W + 48} height={PH + 48} viewBox="0 0 180 160" preserveAspectRatio="none" shapeRendering="crispEdges" style={{ position: "absolute", left: -24, top: -24 }}>
    {PLATES[id].map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w + 0.02} height={h + 0.02} fill={c} />)}
  </svg>
));
const PLATE_BG = { street: "#1E2A4A", dark: "#22262E", desk: "#5B3B26", room: "#E9DFCF" };

// ---------- people ----------
const NK = [
  "....hhhhhh....", "...hHHLLHHh...", "..hHHHHLLHHh..", "..HHhSSSSHHH..", "..HSSSSSSSSH..", "..SSESSSSESS..", "..sSSSSSSSSs..", "..SSSSssSSSS..",
  "..sSbbbbbbSs..", "...sbbSSbbs...", "....sSSSSs....", "..nNNWWWWNNn..", ".nNNNNWZWNNNn.", ".NNNNNNZNNNNN.", ".NNnNNNZNNNnNN", ".NN.NNNZNNN.NN",
  ".NN.NNNZNNN.NF", ".SS.NNNNNNN.Ff", "....NNNNNNN.Ff", "....PPPPPPP...", "....PPP.PPP...", "....PPP.PPP...", "....PPP.PPP...", "....PPP.PPP...", "...BBBB.BBBB..",
];
const SK = { S: "#F2C6A4", s: "#D9A27F" };
const PAL = {
  niklas: { h: "#8A5A30", H: "#B07A45", L: "#C99A63", ...SK, E: "#2B2B2B", b: "#B58A62", N: "#1E2433", n: "#2E3650", W: "#F5F5F5", Z: "#C9C9C9", P: "#3A3F4A", B: "#151515", F: "#111111", f: "#7FD3FF" },
  kumpel: { h: "#2B1E16", H: "#3D2B1F", L: "#5A4030", ...SK, E: "#2B2B2B", b: "#9A6A48", N: "#C0503A", n: "#9E3F2D", W: "#F5F5F5", Z: "#9E3F2D", P: "#2E3650", B: "#151515", F: "#111111", f: TEAL },
};
type Who = keyof typeof PAL;
const Person: React.FC<{ t: number; who: Who; x: number; y: number; px?: number; flip?: boolean; seed?: number; a?: number; bob?: number; speed?: number; style?: React.CSSProperties }> = ({ t, who, x, y, px = 12, flip, seed = 0, a = -1, bob = 1, speed = 3.2, style }) => {
  const st = a >= 0 ? popStyle(t, a, 30, 0.4) : {};
  const hop = Math.floor(t * speed + seed) % 2 ? -px * bob : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 4, ...st, ...style }}>
      <div style={{ position: "absolute", left: px * 3, top: NK.length * px - px * 0.6, width: px * 9, height: px * 1.2, background: "rgba(0,0,0,0.28)" }} />
      <div style={{ transform: `translateY(${hop}px) scaleX(${flip ? -1 : 1})` }}><Sprite rows={NK} pal={PAL[who]} px={px} /></div>
    </div>
  );
};

// ---------- props ----------
const DOENER = { rows: ["....KKKK....", "...KBBBBK...", "..KBGRGRBK..", "..KBRGRGBK..", "..KBWWWWBK..", "...KBBBBK...", "....KPPK....", "....KPPK....", ".....KK....."], pal: { K: INK, B: "#E8C27A", G: GREEN, R: RED, W: "#FFF", P: "#F5F5F5" } };
const BOTTLE = { rows: ["...KK...", "...KK...", "..KGGK..", ".KGGGGK.", ".KGWWGK.", ".KGWWGK.", ".KGGGGK.", ".KGGGGK.", "..KKKK.."], pal: { K: INK, G: "#7A4B2A", W: GOLD } };
const TAXI = { rows: ["....KKKKKK......", "...KYKBBKYK.....", "..KYYKBBKYYK....", "KKKKKKKKKKKKKKKK", "KYYYYYYYYYYYYYYK", "KYYKKYYYYYYKKYYK", ".KKWWKKKKKKWWKK.", "..KKK......KKK.."], pal: { K: INK, Y: GOLD, B: "#9ED3F0", W: "#888" } };
const COIN = { rows: [".YY.", "YyYY", "YYyY", ".YY."], pal: { Y: GOLD, y: "#FFF3B0" } };
const NOTE = { rows: ["KKKKKKKKKKKK", "KGGGGGGGGGGK", "KGgGGGGGGgGK", "KGGGGWWGGGGK", "KGGGWGGWGGGK", "KGGGGWWGGGGK", "KGgGGGGGGgGK", "KKKKKKKKKKKK"], pal: { K: INK, G: "#9CC79A", g: "#6FA56C", W: "#2F6B3A" } };
const CAL = { rows: ["KKKKKKKKKK", "KRRRRRRRRK", "KKKKKKKKKK", "KWKWKWKWWK", "KWWWWWWWWK", "KWKWKWKWWK", "KWWWWWWWWK", "KWKWKWKWWK", "KKKKKKKKKK"], pal: { K: INK, R: RED, W: "#FFFFFF" } };
const ROBOT = { rows: ["....KK....", "....RR....", ".KKKKKKKK.", "KWWWWWWWWK", "KWBBWWBBWK", "KWBBWWBBWK", "KWWWWWWWWK", "KWWRRRRWWK", "KWWWWWWWWK", ".KKKKKKKK."], pal: { K: INK, W: "#F5F5F5", B: GREEN, R: RED } };
const PLANE = { rows: ["K.........", "KKK.......", "KWWKK.....", "KWWWWKK...", "KWWWWWWKK.", "KWWWWKK...", "KWWKK.....", "KKK.......", "K........."], pal: { K: INK, W: "#FFF" } };

// ---------- pixel UI pieces ----------
const PxBox: React.FC<{ bg?: string; color?: string; size?: number; border?: string; shadow?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({ bg = GOLD, color = INK, size = 28, border = INK, shadow = true, style, children }) => (
  <div style={{ position: "absolute", fontFamily: PX, fontSize: size, lineHeight: 1.25, color, background: bg, border: `${Math.max(4, Math.round(size / 6))}px solid ${border}`, padding: `${size * 0.55}px ${size * 0.6}px ${size * 0.4}px`, boxShadow: shadow ? `6px 6px 0 ${INK}` : undefined, whiteSpace: "nowrap", zIndex: 8, ...style }}>{children}</div>
);
const Stamp: React.FC<{ t: number; a: number; text: string; bg?: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, a, text, bg = GOLD, color = INK, size = 44, rot = -6, style }) => {
  if (t < a) return null;
  const p = interpolate(t, [a, a + 0.14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <PxBox bg={bg} color={color} size={size} style={{ transform: `rotate(${rot}deg) scale(${2 - p})`, opacity: p, zIndex: 12, ...style }}>{text}</PxBox>;
};
const Pill: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 36, top: 36, background: INK, color: "#FFF", fontFamily: SM, fontWeight: 700, fontSize: 24, padding: "10px 20px 10px 16px", borderRadius: 999, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 0 rgba(0,0,0,.15)", zIndex: 20 }}>
    <i style={{ width: 12, height: 12, borderRadius: "50%", background: GOLD, display: "block" }} />{text}
  </div>
);
const spark = (t: number, a: number, cx: number, cy: number, n = 8, r0 = 40, r1 = 130, col = GOLD) => {
  const u = (t - a) / 0.45;
  if (u < 0 || u > 1) return null;
  return Array.from({ length: n }, (_, i) => {
    const ang = (i / n) * Math.PI * 2 + 0.3;
    const r = r0 + (r1 - r0) * Easing.out(Easing.cubic)(u);
    const s = Math.round(14 * (1 - u)) + 4;
    return <div key={i} style={{ position: "absolute", left: cx + Math.cos(ang) * r - s / 2, top: cy + Math.sin(ang) * r - s / 2, width: s, height: s, background: i % 2 ? col : "#FFFFFF", border: `2px solid ${INK}`, zIndex: 11 }} />;
  });
};
const ease = Easing.inOut(Easing.cubic);
const lerp = (t: number, a: number, b: number, v0: number, v1: number) => interpolate(t, [a, b], [v0, v1], { ...clamp, easing: ease });
const eur = (v: number) => v.toFixed(2).replace(".", ",") + " €";
const bump = (t: number, a: number, amt = 0.14, w = 0.2) => 1 + amt * Math.max(0, 1 - Math.abs(t - a) / w);

// "PIEP" burst with contactless rings
const Piep: React.FC<{ t: number; a: number; x: number; y: number; size?: number }> = ({ t, a, x, y, size = 30 }) => {
  if (t < a - 0.05) return null;
  const u = Math.min(1, (t - a + 0.05) / 0.5);
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 10 }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: -20 - i * 16 - u * 20, top: -20 - i * 16 - u * 20, width: 40 + i * 32 + u * 40, height: 40 + i * 32 + u * 40, border: `5px solid ${TEAL}`, borderRadius: "50%", opacity: (1 - u) * (1 - i * 0.25) }} />)}
      <PxBox bg={TEAL} size={size} style={{ left: 30, top: -40, transform: `rotate(-6deg) scale(${interpolate(t, [a - 0.05, a + 0.1], [1.8, 1], { ...clamp, easing: Easing.out(Easing.cubic) })})` }}>PIEP</PxBox>
    </div>
  );
};

// ---------- scenes ----------
// 1 · Hook: every friend group has this one guy. Döner piep, Späti piep, Taxi piep → the 15th: "leihst du mir 20 €?"
const BUYS: [keyof typeof A, keyof typeof A, string, number][] = [["doener", "piep0", "DÖNER", 8.5], ["spaeti", "piep1", "SPÄTI", 6.2], ["taxi", "piep2", "TAXI", 23.4]];
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const late = t > A.fuenfzehnten - 0.15;
  const spent = BUYS.reduce((s, [, p, , v]) => s + v * k(t, A[p] - 0.05, 0.3), 0);
  return (
    <>
      <Plate id="street" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 30, color: "#FFF", background: INK, padding: "22px 26px 14px", boxShadow: `6px 6px 0 rgba(0,0,0,.35)`, transform: `scale(${bump(t, 0.2, 0.06)})` }}>
          DEIN KUMPEL: <span style={{ color: TEAL }}>ALLES MIT HANDY</span>
        </div>
      </div>
      <Person t={t} who="kumpel" x={90} y={500} px={13} a={0.1} bob={late ? 0 : 1} />
      {/* the three buys, each with a PIEP */}
      {!late ? BUYS.map(([w, p, label], i) => (t < A[w] - 0.15 ? null : (
        <div key={i} style={{ position: "absolute", left: 470 + (i % 2) * 40, top: 230 + i * 190, zIndex: 7, ...popStyle(t, A[w] - 0.15, 14, 0.5) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ background: "#FFF", border: `5px solid ${INK}`, padding: 10, boxShadow: `6px 6px 0 ${INK}` }}>
              <Sprite rows={i === 0 ? DOENER.rows : i === 1 ? BOTTLE.rows : TAXI.rows} pal={i === 0 ? DOENER.pal : i === 1 ? BOTTLE.pal : TAXI.pal} px={i === 2 ? 6 : 8} />
            </div>
            <PxBox bg="#FFF" size={20} style={{ position: "relative" }}>{label}</PxBox>
          </div>
          <Piep t={t} a={A[p]} x={330} y={50} size={20} />
        </div>
      ))) : null}
      {/* running total */}
      {t > A.piep0 - 0.05 && !late ? <PxBox bg={INK} color={TEAL} size={22} style={{ left: 60, top: 400, transform: `scale(${bump(t, A.piep2, 0.1)})` }}>{eur(spent)}</PxBox> : null}
      {/* the 15th: calendar + "can you lend me 20 €?" */}
      {late ? (
        <>
          <div style={{ position: "absolute", left: 540, top: 300, zIndex: 7, ...popStyle(t, A.fuenfzehnten - 0.15, 16, 0.5) }}>
            <Sprite rows={CAL.rows} pal={CAL.pal} px={26} />
            <div style={{ position: "absolute", left: 66, top: 104, fontFamily: PX, fontSize: 64, color: RED }}>15.</div>
          </div>
          {t > A.zwanzig - 0.3 ? <PxBox bg="#FFF" size={24} style={{ left: 60, top: 330, ...popStyle(t, A.zwanzig - 0.3, 12, 0.5) }}>LEIHST DU MIR 20 €?</PxBox> : null}
          {t > A.leihen - 0.05 ? <Stamp t={t} a={A.leihen - 0.05} text="KONTO: 0,00 €" bg={RED} color="#FFF" size={28} rot={-5} style={{ left: 470, top: 740 }} /> : null}
        </>
      ) : null}
    </>
  );
};

// 2 · The term: PAIN OF PAYING typed; cash hurts (note flies away, "AUA"), the phone doesn't, so he doesn't stop (coins stream)
const SceneTerm: React.FC<{ t: number }> = ({ t }) => {
  const l1 = typed("PAIN OF PAYING", t, A.pain - 0.1, A.pain + 0.55);
  const fly = k(t, A.schein - 0.1, 0.7, ease);
  const stream = t > A.hoert - 0.1;
  return (
    <>
      <Plate id="dark" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 62, lineHeight: 1.1, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "30px 32px 18px", boxShadow: `0 8px 0 #6B4528`, ...popStyle(t, A.heisst, 16, 0.7) }}>
          {l1}<span style={{ opacity: 0 }}>{"PAIN OF PAYING".slice(l1.length)}</span>
        </div>
      </div>
      {/* left: cash hurts */}
      {t > A.bargeld - 0.15 ? (
        <div style={{ position: "absolute", left: 90, top: 340, width: 380, zIndex: 7, ...popStyle(t, A.bargeld - 0.15, 16, 0.5) }}>
          <PxBox bg="#FFF" size={20} style={{ position: "relative", display: "inline-block" }}>BARGELD</PxBox>
          <div style={{ position: "relative", height: 260 }}>
            <div style={{ position: "absolute", left: 40 + fly * 260, top: 60 - fly * 220, transform: `rotate(${fly * 40}deg)`, opacity: 1 - fly * 0.6 }}><Sprite rows={NOTE.rows} pal={NOTE.pal} px={18} /></div>
          </div>
          {t > A.weh0 - 0.1 ? <Stamp t={t} a={A.weh0 - 0.1} text="TUT WEH" bg={RED} color="#FFF" size={26} rot={-6} style={{ left: 10, top: 330 }} /> : null}
        </div>
      ) : null}
      {/* right: phone doesn't */}
      {t > A.handy - 0.15 ? (
        <div style={{ position: "absolute", left: 600, top: 340, width: 400, zIndex: 7, ...popStyle(t, A.handy - 0.15, 16, 0.5) }}>
          <PxBox bg="#FFF" size={20} style={{ position: "relative", display: "inline-block" }}>HANDY</PxBox>
          <div style={{ position: "relative", marginTop: 20, marginLeft: 60, width: 150, height: 250, background: INK, borderRadius: 22, padding: 10 }}>
            <div style={{ width: "100%", height: "100%", background: TEAL, borderRadius: 14 }} />
          </div>
          <Piep t={t} a={A.handy + 0.1} x={230} y={120} size={18} />
          {t > A.nichts - 0.1 ? <Stamp t={t} a={A.nichts - 0.1} text="TUT NICHTS" bg={GREEN} color="#FFF" size={24} rot={4} style={{ left: 30, top: 330 }} /> : null}
        </div>
      ) : null}
      {stream ? Array.from({ length: 10 }, (_, i) => {
        const u = ((t - A.hoert) * 1.4 + i / 10) % 1;
        return <div key={i} style={{ position: "absolute", left: 720 + Math.sin(i * 2.1) * 120, top: 620 + u * 320, opacity: 1 - u, zIndex: 9 }}><Sprite rows={COIN.rows} pal={COIN.pal} px={10} /></div>;
      }) : null}
      {stream ? <PxBox bg={GOLD} size={22} style={{ left: 330, top: 820, ...popStyle(t, A.hoert - 0.1, 10, 0.5) }}>HÖRT NICHT AUF</PxBox> : null}
    </>
  );
};

// 3 · The study with real MIT slides: design (Celtics tickets, half cash / half card) → result "$29 cash, $61 credit card"
const IMG = (n: string) => staticFile(`gpts-pain-of-paying/${n}.png`);
const SceneStudy: React.FC<{ t: number }> = ({ t }) => {
  const p2 = A.doppelt - 0.45;
  const ph = t < p2 ? 1 : 2;
  const zoom = k(t, A.doppelt - 0.1, 0.6, ease);
  return (
    <>
      <Plate id="desk" />
      {ph === 1 ? (
        <div style={{ position: "absolute", left: 70, top: 120, width: 940, zIndex: 4, transform: `rotate(${interpolate(t, [A.forscher, p2], [-1.2, 0.4], clamp)}deg)`, ...popStyle(t, A.forscher - 0.1, 24, 0.8) }}>
          <div style={{ background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.45)`, lineHeight: 0 }}>
            <Img src={IMG("study-design")} style={{ width: "100%" }} />
          </div>
          {t > A.bar - 0.1 ? <Stamp t={t} a={A.bar - 0.1} text="½ BAR" bg={GREEN} color="#FFF" size={26} rot={-5} style={{ left: 40, top: 560 }} /> : null}
          {t > A.karte0 - 0.1 ? <Stamp t={t} a={A.karte0 - 0.1} text="½ KARTE" bg={BLUE} color="#FFF" size={26} rot={4} style={{ left: 560, top: 560 }} /> : null}
        </div>
      ) : null}
      {ph === 2 ? (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * zoom})`, transformOrigin: "540px 330px", zIndex: 4 }}>
          <div style={{ position: "absolute", left: 50, top: 170, width: 980, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.45)`, lineHeight: 0, ...popStyle(t, p2, 24, 0.8) }}>
            <Img src={IMG("study-result")} style={{ width: "100%" }} />
          </div>
        </div>
      ) : null}
      {ph === 2 && t > A.doppelt - 0.1 ? (
        <>
          <PxBox bg={GREEN} color="#FFF" size={30} style={{ left: 90, top: 600, ...popStyle(t, A.doppelt - 0.1, 12, 0.5) }}>BAR 29 $</PxBox>
          <PxBox bg={BLUE} color="#FFF" size={30} style={{ left: 560, top: 600, transform: `scale(${bump(t, A.doppelt + 0.15, 0.15)})`, ...popStyle(t, A.doppelt + 0.05, 12, 0.5) }}>KARTE 61 $</PxBox>
          <Stamp t={t} a={A.doppelt + 0.3} text="2× SO VIEL" bg={RED} color="#FFF" size={34} rot={-4} style={{ left: 320, top: 760 }} />
        </>
      ) : null}
      {ph === 2 && t > A.gleichen - 0.1 ? <PxBox bg="#FFF" size={18} style={{ left: 560, top: 455, ...popStyle(t, A.gleichen - 0.1, 8, 0.5) }}>GLEICHE TICKETS</PxBox> : null}
      <PxBox bg={INK} color="#FFF" size={15} shadow={false} style={{ right: 40, top: 40, ...popStyle(t, A.forscher, 10, 0.5) }}>MIT · PRELEC & SIMESTER 2001</PxBox>
    </>
  );
};

// 4 · "Ich find das fair. Bezahlen soll ja nicht wehtun. Das übernimmt bei ihm dann der Kontostand."
const SceneFair: React.FC<{ t: number }> = ({ t }) => {
  const drop = lerp(t, A.kontostand - 0.2, A.kontostand + 0.5, 312.4, -48.7);
  return (
    <>
      <Plate id="room" />
      <Person t={t} who="niklas" x={60} y={480} px={11} a={A.find - 0.1} />
      {t > A.fair - 0.05 ? <PxBox bg={GOLD} size={24} style={{ left: 50, top: 380, ...popStyle(t, A.fair - 0.05, 10, 0.5) }}>FAIR.</PxBox> : null}
      {t > A.wehtun - 0.2 ? <PxBox bg="#FFF" size={18} style={{ left: 430, top: 200, ...popStyle(t, A.wehtun - 0.2, 8, 0.5) }}>TUT JA NICHT WEH</PxBox> : null}
      {t > A.kontostand - 0.3 ? (
        <div style={{ position: "absolute", left: 420, top: 300, width: 560, zIndex: 7, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}`, ...popStyle(t, A.kontostand - 0.3, 16, 0.5) }}>
          <div style={{ background: INK, padding: "14px 16px 10px", fontFamily: PX, fontSize: 16, color: "#FFF" }}>KONTOSTAND</div>
          <div style={{ padding: "34px 20px", fontFamily: PX, fontSize: 52, color: drop < 0 ? RED : INK, textAlign: "center", transform: `scale(${bump(t, A.kontostand + 0.5, 0.12)})` }}>{eur(drop)}</div>
        </div>
      ) : null}
      {t > A.kontostand + 0.5 ? <Stamp t={t} a={A.kontostand + 0.5} text="AUA" bg={RED} color="#FFF" size={40} rot={-6} style={{ left: 640, top: 640 }} /> : null}
    </>
  );
};

// 5 · Outro (animated to the last frame): cover → ChatGPT sorts the spending → week budget → "PIEP" comment → DM with PDF → "an Kumpel senden"
const PAGE = (n: number) => staticFile(`gpts-pain-of-paying/guide-${n === 1 ? "cover" : `p${n}`}.png`);
const CHECK: [string, string, boolean?][] = [["ESSEN UNTERWEGS", "214 €"], ["SPÄTI", "96 €"], ["TAXI", "118 €"], ["UNTER 15 €", "387 €", true]];
const SceneOutro: React.FC<{ t: number }> = ({ t }) => {
  const a = A.damit - 0.05;
  const bS = A.chatgpt, cS = A.wochenbudget - 0.25, dS = A.schreib - 0.2, eS = A.schick1 - 0.15;
  const fl = Math.sin(t * 2.2) * 6, rot = Math.sin(t * 1.3) * 1.2;
  const cx = t < bS ? 320 : t < dS ? lerp(t, bS, bS + 0.4, 320, 40) : lerp(t, dS, dS + 0.4, 40, 60);
  const cw = t < bS ? 440 : t < dS ? lerp(t, bS, bS + 0.4, 440, 340) : lerp(t, dS, dS + 0.4, 340, 250);
  const cy = t < dS ? 90 : lerp(t, dS, dS + 0.4, 90, 70);
  const cr = t < bS ? interpolate(t, [a, a + 0.5], [-9, -4], clamp) : t < dS ? -5 : -7;
  // spending check
  const docIn = t > bS - 0.1 && t < cS + 0.4;
  const docX = t < cS ? lerp(t, bS - 0.1, bS + 0.3, 1100, 400) : lerp(t, cS, cS + 0.4, 400, 1150);
  const typeA = A.umsaetzen - 0.1, typeB = A.geld + 0.5, per = (typeB - typeA) / CHECK.length;
  // week budget
  const budIn = t > cS - 0.05 && t < dS + 0.3;
  const budX = t < dS ? lerp(t, cS - 0.05, cS + 0.35, 1100, 420) : lerp(t, dS, dS + 0.4, 420, 1150);
  const fill = k(t, A.wochenbudget, 1.0, ease) * 0.72;
  // comment + DM + share
  const word = typed("PIEP", t, A.schreib + 0.05, A.piep4 + 0.2);
  const sent = t > A.piep4 + 0.3;
  const dmA = A.schick0 - 0.25;
  const blink = Math.floor(t * 3) % 2 === 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#FFF6D6", backgroundImage: "radial-gradient(rgba(20,20,20,.10) 2px, transparent 2.5px)", backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", left: cx, top: cy + fl, width: cw, zIndex: 6, transform: `rotate(${cr + rot}deg) translateY(${interpolate(t, [a, a + 0.5], [60, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)`, opacity: k(t, a, 0.25), border: `6px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, lineHeight: 0 }}>
        <Img src={PAGE(1)} style={{ width: "100%" }} />
      </div>
      {t > A.damit && t < bS + 0.3 ? <PxBox bg={GOLD} size={22} style={{ left: 40, top: 720, transform: `rotate(-3deg) translateY(${fl * 0.5}px)`, ...popStyle(t, A.damit, 10, 0.5) }}>GEGENMITTEL #4</PxBox> : null}
      {/* ChatGPT sorts where the money went */}
      {docIn ? (
        <div style={{ position: "absolute", left: docX, top: 140 + fl * 0.4, width: 630, zIndex: 8, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}` }}>
          <div style={{ background: INK, padding: "14px 16px 10px", fontFamily: PX, fontSize: 16, color: "#FFF" }}>WOHIN DAS GELD GEHT</div>
          <div style={{ padding: "16px 20px 14px" }}>
            {CHECK.map(([kk, v, hot], i) => {
              const s0 = typeA + i * per;
              if (t < s0) return <div key={i} style={{ height: 60 }} />;
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 60, borderBottom: hot ? "none" : "3px dashed #C9C2B0", fontFamily: PX, background: hot ? RED : "transparent", color: hot ? "#FFF" : INK, padding: hot ? "0 10px" : 0, marginTop: hot ? 8 : 0 }}>
                  <span style={{ fontSize: 16 }}>{kk}</span><span style={{ fontSize: 22 }}>{typed(v, t, s0, s0 + per * 0.7)}</span>
                </div>
              );
            })}
            {t < typeB && blink ? <div style={{ width: 16, height: 26, background: INK, marginTop: 8 }} /> : null}
          </div>
          {t > A.chatgpt - 0.1 ? <PxBox bg="#FFF" size={15} style={{ left: -20, top: -46, ...popStyle(t, A.chatgpt - 0.1, 8, 0.5) }}>CHATGPT SORTIERT</PxBox> : null}
          <div style={{ position: "absolute", right: -24, bottom: -56, background: "#FFF", border: `5px solid ${INK}`, padding: 10, boxShadow: `6px 6px 0 ${INK}`, ...popStyle(t, A.chatgpt, 14, 0.4) }}><Sprite rows={ROBOT.rows} pal={ROBOT.pal} px={7} /></div>
        </div>
      ) : null}
      {/* week budget he can manage */}
      {budIn ? (
        <div style={{ position: "absolute", left: budX, top: 150 + fl * 0.4, width: 610, zIndex: 8, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: INK, padding: "14px 16px 10px" }}>
            <span style={{ fontFamily: PX, fontSize: 16, color: "#FFF" }}>WOCHENBUDGET</span>
            <span style={{ fontFamily: PX, fontSize: 16, color: INK, background: GOLD, padding: "8px 10px 4px" }}>150 €</span>
          </div>
          <div style={{ padding: "26px 20px 18px" }}>
            <div style={{ height: 46, border: `5px solid ${INK}`, background: "#F2F0EA", position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: GREEN }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: PX, fontSize: 15, color: "#8A857A", marginTop: 14 }}><span>MO</span><span>{Math.round(fill * 150)} € VON 150 €</span><span>SO</span></div>
          </div>
          {t > A.schafft - 0.1 ? <Stamp t={t} a={A.schafft - 0.1} text="SCHAFFBAR ✓" bg={GREEN} color="#FFF" size={22} rot={-4} style={{ left: 40, bottom: -50 }} /> : null}
        </div>
      ) : null}
      {/* comment field: PIEP typed + sent */}
      {t > dS ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: 150 + fl * 0.3, zIndex: 9, ...popStyle(t, dS, 20, 0.6) }}>
          <div style={{ fontFamily: PX, fontSize: 18, color: INK, marginBottom: 16 }}>KOMMENTARE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "16px 18px" }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: GREEN, border: `4px solid ${INK}`, flexShrink: 0 }} />
            <div style={{ flex: 1, fontFamily: PX, fontSize: 30, color: INK }}>{sent ? "" : word}{!sent && blink ? "▌" : ""}{sent ? <span style={{ color: "#B0AA9E", fontSize: 18 }}>KOMMENTAR …</span> : null}</div>
            <div style={{ fontFamily: PX, fontSize: 16, color: "#FFF", background: word.length === 4 ? BLUE : "#9AA3AD", padding: "12px 12px 8px", transform: `scale(${1 - 0.15 * Math.max(0, 1 - Math.abs(t - A.piep4 - 0.25) / 0.1)})` }}>POSTEN</div>
          </div>
          {sent ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, ...popStyle(t, A.piep4 + 0.3, 12, 0.6) }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: GREEN, border: `4px solid ${INK}` }} />
              <div style={{ fontFamily: PX, fontSize: 24, color: INK, background: "#FFF", border: `5px solid ${INK}`, padding: "14px 16px 8px" }}>PIEP</div>
              <div style={{ fontFamily: PX, fontSize: 14, color: GREEN }}>✓ GEPOSTET</div>
            </div>
          ) : null}
        </div>
      ) : null}
      {/* DM with the PDF */}
      {t > dmA ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: lerp(t, dmA, dmA + 0.35, 980, 450) + fl * 0.5, zIndex: 10, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${GOLD}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: INK, padding: "12px 16px" }}>
            <i style={{ width: 14, height: 14, borderRadius: "50%", background: GOLD, display: "block" }} />
            <span style={{ fontFamily: SM, fontWeight: 700, fontSize: 24, color: "#FFF" }}>Florent GPT</span>
            <span style={{ marginLeft: "auto", fontFamily: PX, fontSize: 12, color: GOLD }}>NEUE NACHRICHT</span>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", padding: 18 }}>
            <div style={{ width: 92, border: `4px solid ${INK}`, lineHeight: 0, flexShrink: 0, transform: `rotate(${Math.sin(t * 3) * 3}deg)` }}><Img src={PAGE(1)} style={{ width: "100%" }} /></div>
            <div style={{ fontFamily: PX, lineHeight: 1.5 }}>
              <div style={{ fontSize: 18, color: INK }}>PIEP-GUIDE.PDF</div>
              <div style={{ fontSize: 13, color: "#8A857A", marginTop: 6 }}>AUSGABEN + WOCHENBUDGET</div>
              <div style={{ display: "inline-block", fontSize: 14, color: INK, background: GOLD, border: `4px solid ${INK}`, padding: "8px 10px 4px", marginTop: 10, transform: `scale(${1 + 0.06 * Math.abs(Math.sin(t * 5))})` }}>ÖFFNEN</div>
            </div>
          </div>
          {spark(t, dmA + 0.35, 350, 120, 10, 40, 170)}
        </div>
      ) : null}
      {/* share to your friend */}
      {t > eS ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: lerp(t, eS, eS + 0.3, 980, 690) + fl * 0.4, zIndex: 12, display: "flex", alignItems: "center", gap: 18, background: BLUE, border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "16px 20px" }}>
          <div style={{ transform: `translateX(${Math.sin(t * 4) * 6}px)` }}><Sprite rows={PLANE.rows} pal={PLANE.pal} px={6} /></div>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#C0503A", border: `4px solid ${INK}`, flexShrink: 0 }} />
          <div style={{ fontFamily: PX, fontSize: 18, color: "#FFF" }}>AN KUMPEL SENDEN</div>
          {spark(t, eS + 0.3, 520, 40, 8, 30, 120)}
        </div>
      ) : null}
      {t > A.schreib - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", zIndex: 11, ...popStyle(t, A.schreib - 0.1, 10, 0.7) }}>
          <div style={{ fontFamily: SM, fontWeight: 700, fontSize: 32, letterSpacing: "0.08em", color: "#FFF", background: INK, borderRadius: 999, padding: "12px 32px", transform: `scale(${1 + 0.03 * Math.sin(t * 6)})` }}>SCHREIB <span style={{ color: GOLD }}>„PIEP“</span></div>
        </div>
      ) : null}
    </>
  );
};

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; bg?: string };
const SCENES: Scene[] = [
  { from: 0, to: A.heisst - 0.05, El: SceneHook, pill: "Dein Kumpel", bg: PLATE_BG.street },
  { from: A.heisst - 0.05, to: A.forscher - 0.1, El: SceneTerm, pill: "Verhaltensökonomie", bg: PLATE_BG.dark },
  { from: A.forscher - 0.1, to: A.find - 0.1, El: SceneStudy, pill: "Die Studie", bg: PLATE_BG.desk },
  { from: A.find - 0.1, to: A.sagt - 0.3, El: SceneFair, pill: "Meine Meinung", bg: PLATE_BG.room },
  { from: A.sagt - 0.3, to: A.damit - 0.1 },
  { from: A.damit - 0.1, to: 999, El: SceneOutro, pill: "Gegenmittel #4", bg: "#FFF6D6" },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["kumpel", "apple", "pay", "döner", "späti", "taxi", "piep", "fünfzehnten", "pain", "paying", "bargeld", "weh", "handy", "mit", "karte", "doppelt", "fair", "kontostand", "chatgpt", "umsätzen", "geld", "wochenbudget", "video"]);
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const SHOW: Record<string, string> = { zwanzig: "20", fünfzehnten: "15." };
const show = (w: string) => { const n = norm(w); return SHOW[n] ?? w.replace(/[.,!?:]/g, ""); };
type Chunk = { start: number; end: number; words: string[] };
const makeChunks = (caps: Cap[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Cap[] = [];
  const flush = () => { if (cur.length) out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => show(c.text)) }); cur = []; };
  for (const c of caps) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 17) || (cur.length && len > 20)) flush();
    cur.push(c);
    if (/[.,!?:]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
};
const Caption: React.FC<{ t: number; y: number; chunks: Chunk[] }> = ({ t, y, chunks }) => {
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = pop(t, c.start - 0.04, 0.18);
  const keyIdx = c.words.findIndex((w) => KEY.has(norm(w)) || /^\d/.test(w));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.06), display: "inline-flex", alignItems: "center", gap: 14, fontFamily: SM, fontWeight: 700, fontSize: 44, letterSpacing: "0.12em", textTransform: "uppercase", padding: "8px 18px", background: INK, color: "#FFF", borderRadius: 8, whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>
        {c.words.map((w, i) => (i === keyIdx ? <b key={i} style={{ background: GOLD, color: INK, padding: "0 10px", borderRadius: 4 }}>{w}</b> : <span key={i}>{w}</span>))}
      </div>
    </div>
  );
};

const ORDER = Array.from({ length: 12 * 11 }, (_, i) => ((i * 53) % 131) / 131);
const Dissolve: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const u = (t - a) / 0.24;
  if (a <= 0 || u < 0 || u > 1) return null;
  return <>{ORDER.map((o, i) => (o > u ? <div key={i} style={{ position: "absolute", left: (i % 12) * 90, top: Math.floor(i / 12) * 90, width: 90, height: 90, background: INK, zIndex: 30 }} /> : null))}</>;
};

// avatar framing in the split (from facefocus.txt)
const SPLIT_SRC_TOP = 860, SPLIT_SCALE = 1.0, FOCUS_X = 0.444;

export const PiepPixel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = React.useMemo(() => makeChunks(CAPS), []);
  const sc = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const face = !sc.El;
  const cam = TL.camera(t, sc.from, sc.to);
  const dx = Math.sin(t * 0.6) * 4, dy = Math.cos(t * 0.45) * 3;
  const s = face ? 1.04 + 0.03 * k(t, sc.from, 0.9) : SPLIT_SCALE * (1 + 0.02 * Math.abs(Math.sin((t - sc.from) * 0.8)));
  const vw = W * s, vh = H * s;
  const left = Math.min(0, Math.max(W - vw, W / 2 - FOCUS_X * vw));
  const top = face ? (H - vh) * 0.4 : PH - SPLIT_SRC_TOP * s;
  const El = sc.El;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left, top, width: vw, height: vh }}>
        <OffthreadVideo src={staticFile("render-gpts-pain-of-paying-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {El ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: sc.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }}>
          <div style={{ position: "absolute", inset: -20, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: "50% 55%" }}>
            <div style={{ position: "absolute", left: 20, top: 20, width: W, height: PH }}><El t={t} /></div>
          </div>
          {sc.pill ? <Pill text={sc.pill} /> : null}
          <Dissolve t={t} a={sc.from} />
        </div>
      ) : null}
      <Caption t={t} y={face ? 1740 : PH} chunks={chunks} />
    </AbsoluteFill>
  );
};
