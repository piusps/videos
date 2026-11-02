import React from "react";
import { AbsoluteFill } from "remotion";
import { THEMES, Stage, PixelMascot, Slot, CheckBadge, StepBadge, MiniGrid, PillCaptions, Odometer, Stamp, CommentCard, Checklist, Word } from "../components/PixelKit";

// Test sheet for PixelKit (skill pixelwelt-look): one step scene at ~3 s, end card at ~6 s.
const WORDS: Word[] = [
  { w: "Claude", s: 0.4, e: 0.8 }, { w: "setzt", s: 0.8, e: 1.1 }, { w: "vier", s: 1.1, e: 1.4 },
  { w: "Trainer", s: 1.4, e: 1.9 }, { w: "an", s: 1.9, e: 2.1 }, { w: "deinen", s: 2.1, e: 2.4 }, { w: "Plan.", s: 2.4, e: 3.0 },
];
const box = (bg: string, txt: string) => (
  <div style={{ height: 150, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90 }}>{txt}</div>
);

export const PixelKitDemo: React.FC<{ mode?: "step" | "end" }> = ({ mode = "step" }) => {
  const th = THEMES.gym;
  if (mode === "end") {
    return (
      <Stage theme={th}>
        <Checklist title="TRAININGSPLAN" items={["Ziel", "Equipment", "4 Trainer", "Check", "Form-Check", "App", "Sonntag"]} x={140} y={560} w={800} at={0} theme={th} />
        <CommentCard keyword="TRAINER" at={0} y={220} theme={th} />
        <PixelMascot x={540} at={0} expr="happy" />
      </Stage>
    );
  }
  return (
    <AbsoluteFill>
      <Stage theme={th}>
        <StepBadge n={3} at={0} theme={th} />
        <MiniGrid total={7} current={3} theme={th} />
        <Slot x={90} y={420} w={200} h={180} theme={th} filledAt={0.3} label="ATHLETIK">{box("#7FD1FF", "🏃")}</Slot>
        <Slot x={320} y={420} w={200} h={180} theme={th} filledAt={0.6} label="PHYSIO">{box("#9BE89B", "🩺")}</Slot>
        <Slot x={560} y={420} w={200} h={180} theme={th} filledAt={0.9} label="KRAFT">{box("#FFB27F", "🏋️")}</Slot>
        <Slot x={790} y={420} w={200} h={180} theme={th} label="EXPLOSIV" />
        <CheckBadge x={300} y={430} at={0.5} />
        <Odometer x={540} y={720} from={0} to={4} at={0} dur={0.5} label="TRAINER GLEICHZEITIG" theme={th} digits={2} />
        <Stamp text="GRATIS" x={800} y={950} at={0.5} color={th.accent} />
        <PixelMascot x={330} at={0} expr="normal" />
        <PillCaptions words={WORDS} theme={th} />
      </Stage>
    </AbsoluteFill>
  );
};
