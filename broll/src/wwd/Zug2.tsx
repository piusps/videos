// Zug v2 — Florent's HeyGen voice, ≤45 s, rounded numbers. Reuses the scenes from Zug.tsx.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BigNumber, Captions, Counter, FollowPill, Grade, HookTitle, InfoCard, TopPill, Word, beatsFrom, buildDots, cl, ease, findPhrase, fmt, useGeo, SANS, SERIF } from "./kit";
import { MapScene } from "./Zug";
import { BoardHD, DoorHD, HookHD, LongHD, NoseHD, SideHD, SignalHD, WalkHD } from "./ZugHD";
import { Exposure, Post } from "./look";
import wordsJson from "../../public/wwd/zug2/words.json";

const words = wordsJson as Word[];
const A = "#F0503C";
const W = 1080, H = 1920;
export const ZG2_END = words[words.length - 1].e + 1.9;
const B = beatsFrom(words, ["Was wäre", "83Millionen", "Ein ICE", "Hintereinander:", "Alle Gleise", "Durchsage: Heute", "Dann: Türen", "Wir legen", "Die Lok will", "Durchsage: Verzögerung", "In welchem"], ZG2_END);
const ws = (ph: string, from = 0) => words[findPhrase(words, ph, from)].s;
const T = {
  rund: ws("rund"), laenger: ws("Der Zug ist länger"), ende: ws("am anderen Ende."), fuss: ws("Zu Fuß:"),
  tueren: ws("Türen zu."), und: ws("Und direkt"), direkt: ws("direkt vor"), unser: ws("Unser eigener"), wir: ws("Der vorausfahrende Zug"),
};

const Bars: React.FC<{ t: number; a: number; op: number }> = ({ t, a, op }) => {
  const k1 = ease((t - a) / 0.6), k2 = ease((t - a - 0.4) / 0.9);
  const Row = ({ label, val, w, c }: { label: string; val: string; w: number; c: string }) => (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: "rgba(255,255,255,.85)" }}><span>{label}</span><span style={{ fontFamily: SERIF, fontWeight: 400, letterSpacing: 0, fontSize: 30 }}>{val}</span></div>
      <div style={{ height: 22, marginTop: 8, borderRadius: 11, background: "rgba(255,255,255,.12)", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${w}%`, background: c, borderRadius: 11 }} />
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", top: 380, left: 60, right: 60, opacity: op, background: "rgba(16,17,22,.62)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 18, padding: "18px 30px 28px" }}>
      <Row label="ALLE GLEISE" val="33.000 km" w={92 * k1} c="#E8ECF2" />
      <Row label="DER ZUG" val="34.000 km" w={95 * k2} c={A} />
      <div style={{ fontFamily: SANS, fontSize: 16, color: "rgba(255,255,255,.55)", marginTop: 14 }}>Quelle: DB InfraGO 2025 · ICE 4 (DB) · gerundet</div>
    </div>
  );
};

const Overlay: React.FC<{ t: number }> = ({ t }) => {
  const fi = (a: number, d = 0.3) => cl((t - a) / d);
  const ab = (i: number) => t >= B[i].a && t < B[i].b;
  const fo = (i: number) => cl((B[i].b - t) / 0.2);
  const op = (i: number) => (ab(i) ? Math.min(fi(B[i].a + 0.15), fo(i)) : 0);
  const up = (a: number, b: number, d: number) => ease((t - a) / d) * b;
  return (
    <>
      <TopPill />
      {ab(0) && <HookTitle lines={["Was wäre, wenn", "ganz Deutschland", "in einen einzigen Zug steigt?"]} accent={A} op={fi(0.05, 0.25)} y={470} />}
      {ab(1) && <Counter label="FAHRGÄSTE" value={fmt(Math.round(up(B[1].a + 0.1, 83000000, 1.2)))} sub="ein Ticket · ein Zug" accent={A} op={op(1)} />}
      {ab(2) && (t < T.rund - 0.1
        ? <InfoCard label="ECHTE ZAHL" text="Ein ICE 4 mit 13 Wagen: 374 Meter, 918 Sitzplätze." source="Deutsche Bahn" accent={A} op={fi(B[2].a + 0.15) * cl((T.rund - 0.1 - t) / 0.2)} />
        : <Counter label="ICE HINTEREINANDER" value={fmt(Math.round(up(T.rund - 0.1, 91000, 1.0)))} sub="83 Mio. ÷ 918 Plätze" accent={A} op={fi(T.rund - 0.1) * fo(2)} />)}
      {ab(3) && <Counter label="ZUGLÄNGE" value={fmt(Math.round(up(B[3].a + 0.2, 34000, 1.4))) + " km"} sub="91.000 × 374 m" accent={A} op={op(3)} />}
      {ab(4) && (t < T.laenger - 0.1
        ? <Counter label="ALLE GLEISE IN DEUTSCHLAND" value={fmt(Math.round(up(B[4].a + 0.9, 33000, 1.2))) + " km"} sub="DB-Netz, Ende 2025" accent="#E8ECF2" op={op(4)} />
        : <Bars t={t} a={T.laenger - 0.1} op={fi(T.laenger - 0.1) * fo(4)} />)}
      {ab(5) && (t < T.fuss - 0.1
        ? (t > T.ende - 0.3 ? <Counter label="DEIN WEG ZU DEINEM WAGEN" value={fmt(Math.round(up(T.ende - 0.3, 34000, 0.8))) + " km"} sub="umgekehrte Wagenreihung" accent={A} op={fi(T.ende - 0.3) * cl((T.fuss - 0.1 - t) / 0.2)} /> : null)
        : <BigNumber value="9 Monate" sub="ZU FUSS · 5 KM/H · OHNE PAUSE" accent={A} op={fi(T.fuss - 0.1, 0.25) * fo(5)} />)}
      {ab(7) && <InfoCard label="ANNAHME" text="Alle Gleise werden zu einem einzigen Kreis verbunden." accent={A} op={op(7)} />}
      {ab(8) && t < T.und && <BigNumber value="+ 630 km" sub="MEHR ZUG ALS GLEIS" source="34.019 km − 33.389 km" accent={A} op={fi(B[8].a + 0.1) * cl((T.und - t) / 0.2)} />}
      <FollowPill text="Folg – dann siehst du, ob der Zug ankommt." op={Math.min(fi(B[6].a + 0.2), cl((B[7].a + 1.6 - t) / 0.3))} y={1420} />
      <Captions words={words} t={t} hideUntil={B[1].a - 0.05} />
    </>
  );
};

const ZUG_ROWS: [string, string, string, string][] = [["0:00", "ICE 1", "Ganz Deutschland", "Wagen 1–1.183.000"], ["", "", "Umgekehrte Wagenreihung", "Gleis 1"]];

export const Zug2: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const geo = useGeo();
  const dm = React.useMemo(() => (geo ? buildDots(geo) : null), [geo]);
  if (!dm) return null;
  const cur = B.findIndex((b) => t >= b.a && t < b.b);
  const lt = cur >= 0 ? t - B[cur].a : 0;
  let scene: React.ReactNode = null;
  const map = (el: React.ReactNode) => <><Exposure v={1} />{el}</>;
  // post settings per beat: [bloom, threshold, focus distance]
  let post: [number, number, number] = [0.3, 0.9, 0];
  switch (cur) {
    case 0: scene = <HookHD t={lt} />; post = [0.25, 0.9, 13 - lt * 1.4]; break;
    case 1: scene = map(<MapScene t={lt} dm={dm} reveal={ease(lt / 1.4)} />); post = [0.9, 0.3, 0]; break;
    case 2: scene = <SideHD t={lt} pull={(t - T.rund + 0.3) / 2.0} />; post = [0.25, 0.9, 0]; break;
    case 3: scene = <LongHD t={lt} />; break;
    case 4: scene = map(<MapScene t={lt} dm={dm} reveal={1} net={ease(lt / 2.0)} cam="top" />); post = [0.9, 0.3, 0]; break;
    case 5: scene = t < T.ende - 0.4 ? <BoardHD t={lt} rows={ZUG_ROWS} ticker="+++ Heute in umgekehrter Wagenreihung +++ Ihr Wagen hält am anderen Ende des Zuges +++" /> : <WalkHD t={t - T.ende + 0.4} />; post = t < T.ende - 0.4 ? [0.3, 0.85, 10.5 - lt * 0.35] : [0.25, 0.9, 5.6]; break;
    case 6: scene = <DoorHD t={lt} close={T.tueren - B[6].a} />; post = [0.4, 0.85, 5]; break;
    case 7: scene = map(<MapScene t={lt} dm={dm} reveal={1} net={1} netOp={1 - ease(lt / 1.0)} ring={ease((lt - 0.2) / 1.4)} cam="high" />); post = [0.9, 0.3, 0]; break;
    case 8: if (t < T.und - 0.1) { scene = map(<MapScene t={lt + 2} dm={dm} reveal={1} ring={1} train={ease(lt / 0.6)} over={ease((lt - 0.4) / 0.5)} cam="high" />); post = [0.9, 0.3, 0]; }
      else { scene = <NoseHD t={t - T.und + 0.1} reveal={T.direkt - T.und + 0.1} />; post = [0.35, 0.97, 0]; } break;
    case 9: if (t < T.wir - 0.2) { scene = <SignalHD t={lt} />; post = [0.7, 0.8, 0]; } else { scene = <BoardHD t={t - T.wir} rows={[["0:00", "ICE 1", "Ganz Deutschland", "+ ∞ Min."], ["", "", "Grund:", "Vorausfahrender Zug (wir)"]]} ticker="+++ Verzögerung durch einen vorausfahrenden Zug +++ Der vorausfahrende Zug sind wir +++" />; post = [0.3, 0.85, 10.5]; } break;
    default: scene = <LongHD t={lt} night up={1} />; post = [1.1, 0.5, 0];
  }
  const sfx = (name: string, at: number, vol = 0.5) => <Sequence from={Math.max(0, Math.round(at * 30))} durationInFrames={210}><Audio src={staticFile(`wwd/zug2/sfx/${name}.mp3`)} volume={vol} /></Sequence>;
  const endF = ZG2_END * 30;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        {scene}
        <Post bloom={post[0]} threshold={post[1]} focus={post[2]} />
      </ThreeCanvas>
      <Grade />
      <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.18) 30%, transparent 45%, transparent 58%, rgba(0,0,0,.35) 80%, rgba(0,0,0,.2))" }} />
      <Overlay t={t} />
      <Audio src={staticFile("wwd/zug2/voice.mp3")} />
      <Audio src={staticFile("wwd/zug2/music.mp3")} volume={(fr) => 0.42 * Math.min(1, fr / 10) * Math.min(1, (endF - fr) / 30)} />
      {B.slice(1).map((b, i) => <React.Fragment key={i}>{sfx("whoosh", b.a - 0.15, 0.18)}</React.Fragment>)}
      {sfx("crowd", 0, 0.2)}
      {sfx("horn", 0.6, 0.28)}
      {sfx("tick", B[1].a + 0.1, 0.3)}
      {sfx("clack", B[2].a + 0.3, 0.22)}
      {sfx("tick", T.rund, 0.3)}
      {sfx("hit", T.laenger - 0.05, 0.4)}
      {sfx("gong", B[5].a - 0.35, 0.3)}
      {sfx("steps", T.fuss - 0.4, 0.4)}
      {sfx("doors", T.tueren - 0.3, 0.45)}
      {sfx("hit", B[8].a + 0.5, 0.35)}
      {sfx("brake", T.direkt - 0.2, 0.4)}
      {sfx("hit", T.unser, 0.45)}
      {sfx("gong", B[9].a - 0.35, 0.3)}
      {sfx("sigh", T.wir + 1.0, 0.4)}
    </AbsoluteFill>
  );
};
