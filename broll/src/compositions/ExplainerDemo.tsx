import React from "react";
import {
  AvatarSource, CardGrid, Chip, Connector, CounterPill, Gear, Icon, IsoCube, IsoTile, lerp, Place, Pop, RowCard, Split, StatusBadge, Title, useFloat, useT,
} from "../components/ExplainerKit";

// Style test for the video-broll-explainer skill (2026-09-29): three beats from the
// Superkind launch script, built with ExplainerKit. The speaker panel uses the
// Postfach B tightened avatar as a stand-in until the launch avatar is rendered.

type Props = { seconds: number; avatar: AvatarSource };

const DEMO_AVATAR = "explainer-demo-avatar.mp4";
export const demoProps = (seconds: number, startSec: number): Props => ({ seconds, avatar: { src: DEMO_AVATAR, startSec } });

// "Ein guter AI Engineer kostet … Einer, der weiß, was geht. Einer, der Use Cases findet. Einer, der baut. Einer, der's am Laufen hält."
// Full board (title → tile → counter), then the speaker slides in and the role list builds.
export const EngineerKostenBroll: React.FC<Props> = ({ avatar }) => {
  const { pop, ramp } = useT();
  const f = useFloat(8);
  const s = ramp(1.9, 2.4);
  return (
    <Split split={s} avatar={avatar}>
      <Place top={lerp(470, 60, s)} scale={lerp(1, 0.78, s)}>
        <Title text="Ein AI Engineer" at={-0.15} size={124} style={{ width: 1000 }} />
      </Place>
      <Place top={lerp(680, 185, s) + f} scale={lerp(1, 0.6, s)}>
        <Pop p={pop(0.15)}><IsoTile size={340} icon="user" /></Pop>
      </Place>
      <Place top={lerp(1000, 350, s)} scale={lerp(1.1, 0.85, s)}>
        <Pop p={pop(0.8)}><CounterPill from={0} to={200000} p={ramp(0.8, 1.8)} suffix="€ / Jahr" icon="euro" /></Pop>
      </Place>
      <Place top={470}>
        <Pop p={pop(2.2)} from={0.85}>
          <RowCard rows={["Weiß, was geht", "Findet Use Cases", "Baut", "Hält es am Laufen"]} at={2.35} step={0.3} width={680} icon="user" />
        </Pop>
      </Place>
    </Split>
  );
};

// "Dein Firmenwissen wird zum Company Brain: wer Angebote freigibt, wohin Reklamationen gehen, wie ihr mit Kunden sprecht. Und es wächst mit …"
// Hard cut straight into the split; cube + tree of rules, the cube turns "active" at the end.
export const CompanyBrainBroll: React.FC<Props> = ({ avatar }) => {
  const { pop, ramp } = useT();
  const f = useFloat(7);
  const chips = [
    { text: "Freigaben", icon: "check", x: 210, y: 700 },
    { text: "Reklamationen", icon: "mail", x: 540, y: 770 },
    { text: "Tonfall", icon: "message", x: 870, y: 700 },
  ];
  return (
    <Split split={1} avatar={avatar}>
      <Gear size={260} style={{ position: "absolute", left: 120, top: 250, opacity: 0.85 }} />
      <Gear size={170} speed={-0.9} style={{ position: "absolute", left: 790, top: 400, opacity: 0.85 }} />
      <Place top={50}>
        <Title text="Company Brain" at={-0.15} size={116} style={{ width: 1000 }} />
      </Place>
      <Place top={200 + f}>
        <Pop p={pop(0.1)}><IsoCube size={270} top="brain" left="book" right="shield" glow={ramp(3.0, 3.6)} /></Pop>
      </Place>
      <Place top={230} left={690}>
        <Pop p={pop(3.4)}><StatusBadge text="lernt jeden Tag dazu" /></Pop>
      </Place>
      {chips.map((c, i) => (
        <React.Fragment key={c.text}>
          <Connector from={[540, 500]} to={[c.x, c.y]} p={ramp(0.9 + i * 0.45, 1.3 + i * 0.45)} curve={(c.x - 540) * 0.25} />
          <div style={{ position: "absolute", top: c.y, left: c.x }}>
            <div style={{ transform: "translateX(-50%)" }}>
              <Pop p={pop(1.2 + i * 0.45)}><Chip text={c.text} icon={c.icon} big /></Pop>
            </div>
          </div>
        </React.Fragment>
      ))}
    </Split>
  );
};

// "Wir waren genau dieses Team. Zwei Jahre lang, in über zwanzig Unternehmen."
// Grid fills up full-frame, then the speaker slides in and the counter lands.
export const ZwanzigFirmenBroll: React.FC<Props> = ({ avatar }) => {
  const { pop, ramp } = useT();
  const s = ramp(2.6, 3.1);
  const items = Array.from({ length: 20 }).map((_, i) => (
    <Icon key={i} name={i % 3 === 0 ? "building" : i % 3 === 1 ? "users" : "file"} size={62} color={i % 4 === 0 ? "#FF6B35" : "#CFCFCF"} />
  ));
  return (
    <Split split={s} avatar={avatar}>
      <Place top={lerp(380, 50, s)} scale={lerp(1, 0.8, s)}>
        <Title text="Über 20 Unternehmen" at={-0.15} size={112} style={{ width: 1000 }} />
      </Place>
      <Place top={lerp(640, 250, s)} scale={lerp(1 + ramp(0, 2.4) * 0.05, 0.72, s)}>
        <CardGrid items={items} cols={5} at={0.1} step={0.06} cell={150} gap={18} />
      </Place>
      <Place top={lerp(1430, 790, s)} scale={lerp(1.1, 0.85, s)}>
        <Pop p={pop(2.9)}><CounterPill from={0} to={20} p={ramp(2.9, 3.8)} suffix="Unternehmen" icon="building" /></Pop>
      </Place>
    </Split>
  );
};
