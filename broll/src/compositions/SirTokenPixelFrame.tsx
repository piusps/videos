import React from "react";
import { THEMES, Stage, PixelMascot, PixelSprite, Slot, CheckBadge, StepBadge, MiniGrid, PillCaptions, Odometer, Stamp, SpeechBubble, Word, FLOOR_Y, DUMBBELL_ROWS } from "../components/PixelKit";

// Key frame for the trainer reel in the Pixelwelt look: step 3, four trainers on the plan at once.
const WORDS: Word[] = [
  { w: "Claude", s: 0.0, e: 0.3 }, { w: "setzt", s: 0.3, e: 0.5 }, { w: "vier", s: 0.5, e: 0.8 },
  { w: "Trainer", s: 1.0, e: 1.4 }, { w: "gleichzeitig", s: 1.4, e: 2.1 }, { w: "an", s: 2.3, e: 2.4 },
];
const card = (bg: string, emoji: string) => (
  <div style={{ height: 150, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 92 }}>{emoji}</div>
);

export const SirTokenPixelFrame: React.FC = () => {
  const th = THEMES.gym;
  return (
    <Stage theme={th}>
      <StepBadge n={3} at={-1} theme={th} />
      <MiniGrid total={7} current={3} theme={th} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, textAlign: "center", fontFamily: "Rubik", fontWeight: 800, fontSize: 52, letterSpacing: 6, color: th.cream, opacity: 0.9 }}>DEIN TRAININGSPLAN</div>
      <Slot x={70} y={380} w={210} h={180} theme={th} filledAt={-1} label="ATHLETIK">{card("#7FD1FF", "🏃")}</Slot>
      <Slot x={310} y={380} w={210} h={180} theme={th} filledAt={-1} label="PHYSIO">{card("#9BE89B", "🩺")}</Slot>
      <Slot x={560} y={380} w={210} h={180} theme={th} filledAt={-1} label="KRAFT">{card("#FFB27F", "🏋️")}</Slot>
      <Slot x={800} y={380} w={210} h={180} theme={th} filledAt={1.5} label="EXPLOSIV">{card("#FFE07A", "⚡")}</Slot>
      <CheckBadge x={265} y={395} at={-1} size={74} />
      <CheckBadge x={505} y={395} at={-1} size={74} />
      <CheckBadge x={755} y={395} at={-1} size={74} />
      <Odometer x={300} y={700} from={0} to={4} at={-1} dur={0.1} label="TRAINER GLEICHZEITIG" theme={th} digits={2} />
      <Stamp text="GRATIS" x={790} y={770} at={1.0} color={th.accent} size={84} rot={-8} />
      <SpeechBubble text="Jede Übung wird geprüft!" x={460} y={930} w={500} at={-1} theme={th} />
      <PixelMascot x={290} at={-1} px={14} expr="happy" />
      <div style={{ position: "absolute", left: 800, top: FLOOR_Y - 5 * 16 }}>
        <PixelSprite rows={DUMBBELL_ROWS} palette={{ K: "#2B2F3A", M: "#9AA3B5" }} px={16} />
      </div>
      <PillCaptions words={WORDS} theme={th} />
    </Stage>
  );
};
