import React from "react";
import {
  AvatarSource, Chip, Connector, CounterPill, IsoTile, lerp, Place, Pop, RowCard, Split, StatusBadge, Title, useFloat, useT,
} from "../components/ExplainerKit";
import { ScreenFlow } from "../components/ScreenFlow";

// Showcase test (2026-09-29): the Postfach B footage (tightened, 25 s) with the
// three new building blocks in one reel — Explainer B-Roll, vision captions and
// an app click path. Times inside each clip are seconds from the window start,
// taken from runs/postfach-b/captions.json.

type Props = { seconds: number; avatar: AvatarSource };
const AVATAR = "showcase/tightened.mp4";
export const showcaseProps = (seconds: number, startSec: number): Props => ({ seconds, avatar: { src: AVATAR, startSec } });

// Window 5.00-9.95: "Schritt eins: Claude liest jeden Morgen dein Postfach und sortiert alles nach dringend und unwichtig."
export const ShowcaseSortieren: React.FC<Props> = ({ avatar }) => {
  const { pop, ramp } = useT();
  const f = useFloat(8);
  const s = ramp(1.5, 1.95);
  const conn = (x: number, a: number) => <Connector from={[540, 470]} to={[x, 690]} p={ramp(a, a + 0.35)} curve={(x - 540) * 0.25} />;
  return (
    <Split split={s} avatar={avatar}>
      <Place top={lerp(470, 55, s)} scale={lerp(1, 0.8, s)}>
        <Title text="Dein Posteingang" at={-0.15} size={120} style={{ width: 1000 }} />
      </Place>
      <Place top={lerp(690, 190, s) + f} scale={lerp(1, 0.58, s)}>
        <Pop p={pop(0.25)}><IsoTile size={340} icon="mail" /></Pop>
      </Place>
      <Place top={lerp(1010, 375, s)} scale={lerp(1.1, 0.82, s)}>
        <Pop p={pop(0.6)}><CounterPill from={0} to={40} p={ramp(0.6, 1.5)} suffix="neue Mails" icon="mail" /></Pop>
      </Place>
      {s > 0.99 && conn(270, 2.7)}
      {s > 0.99 && conn(810, 2.9)}
      <div style={{ position: "absolute", top: 700, left: 270 }}>
        <div style={{ transform: "translateX(-50%)" }}>
          <Pop p={pop(3.0)}><CounterPill from={0} to={3} p={ramp(3.6, 4.0)} suffix="dringend" icon="bolt" /></Pop>
        </div>
      </div>
      <div style={{ position: "absolute", top: 700, left: 810 }}>
        <div style={{ transform: "translateX(-50%)", opacity: lerp(1, 0.55, ramp(4.5, 4.9)) }}>
          <Pop p={pop(3.2)}><CounterPill from={0} to={37} p={ramp(4.3, 4.9)} suffix="unwichtig" icon="file" /></Pop>
        </div>
      </div>
    </Split>
  );
};

// Window 11.00-15.62: "Schritt zwei: … schreibt Claude die Antwort vor, in deinem Ton. Du klickst nur noch auf Senden."
// Click path on the real superkind.ai/warteliste form (technique demo), final click lands on "Senden".
export const ShowcaseKlickpfad: React.FC<Props> = ({ avatar }) => {
  const R = {
    email: { x: 446, y: 480, w: 410, h: 48 },
    weiter: { x: 862, y: 480, w: 132, h: 48 },
    phone: { x: 446, y: 480, w: 355, h: 48 },
    submit: { x: 807, y: 480, w: 187, h: 48 },
    emailText: { x: 464, y: 480, w: 113.5, h: 48 },
    phoneText: { x: 464, y: 480, w: 132.8, h: 48 },
  };
  const c = (r: { x: number; y: number; w: number; h: number }, dx = 0) => ({ x: r.x + r.w / 2 + dx, y: r.y + r.h / 2 });
  return (
    <Split split={1} avatar={avatar}>
      <ScreenFlow
        dir="showcase"
        viewport={{ width: 1440, height: 900 }}
        url="superkind.ai/warteliste"
        box={{ x: 40, y: 64, w: 1000, h: 840 }}
        screens={[{ at: 0, shot: "s2-start.png" }, { at: 2.1, shot: "s3-start.png" }]}
        typing={[
          { from: 0.6, to: 1.5, shot: "s2-filled.png", text: R.emailText, chars: 12, field: R.email },
          { from: 2.6, to: 3.4, shot: "s3-filled.png", text: R.phoneText, chars: 14, field: R.phone },
        ]}
        cursor={[
          { t: 0, x: 1050, y: 660 },
          { t: 0.45, ...c(R.email, -60), click: true },
          { t: 1.55, ...c(R.email, -60) },
          { t: 1.95, ...c(R.weiter), click: true },
          { t: 2.1, ...c(R.weiter) },
          { t: 2.5, ...c(R.phone, -40), click: true },
          { t: 3.4, ...c(R.phone, -40) },
          { t: 4.0, ...c(R.submit) },
          { t: 4.22, ...c(R.submit), click: true },
        ]}
        camera={[
          { t: 0, cx: 640, cy: 505, zoom: 2.0 },
          { t: 1.5, cx: 650, cy: 505, zoom: 2.05 },
          { t: 1.95, cx: 770, cy: 505, zoom: 2.05 },
          { t: 2.5, cx: 655, cy: 505, zoom: 2.05 },
          { t: 3.4, cx: 680, cy: 505, zoom: 2.1 },
          { t: 4.0, cx: 820, cy: 505, zoom: 2.2 },
          { t: 4.62, cx: 830, cy: 505, zoom: 2.25 },
        ]}
        highlights={[
          { from: 0.2, to: 1.6, rect: R.email },
          { from: 1.6, to: 2.15, rect: R.weiter },
          { from: 2.25, to: 3.5, rect: R.phone },
          { from: 3.6, to: 4.62, rect: R.submit },
        ]}
      />
    </Split>
  );
};

// Window 15.68-19.30: "Schritt drei: Claude erkennt Termine in deinen Mails und trägt sie in deinen Kalender ein."
export const ShowcaseKalender: React.FC<Props> = ({ avatar }) => {
  const { pop, ramp } = useT();
  return (
    <Split split={1} avatar={avatar}>
      <Place top={55}>
        <Title text="Termine erkannt" at={-0.15} size={104} style={{ width: 1000 }} />
      </Place>
      <Place top={220}>
        <Pop p={pop(0.9)}><Chip text="Mail: „Passt Dienstag 14 Uhr?“" icon="mail" big /></Pop>
      </Place>
      <Connector from={[540, 320]} to={[540, 410]} p={ramp(1.5, 1.8)} />
      <Place top={420}>
        <Pop p={pop(1.7)} from={0.85}>
          <RowCard rows={["Di · 14:00 · Kaya", "Do · 09:30 · Meier"]} at={1.9} step={0.45} width={640} icon="clock" />
        </Pop>
      </Place>
      <Place top={730}>
        <Pop p={pop(2.9)}><StatusBadge text="im Kalender eingetragen" /></Pop>
      </Place>
    </Split>
  );
};
