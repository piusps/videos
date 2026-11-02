import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { DuetOpus, DU_FRAMES } from "./DuetOpus";
import { DuetNews, DuetLock, DuetCost, DuetBriefing, DuetPhoneOff, DuetApprove, DuetWaitlist, PW, PH, DuetClipProps } from "./DuetBrolls";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadSerif("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });
loadSerif("italic", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });

// FP-N "Claude Duet" split-panel B-rolls (1080 x 820). Length = props.seconds; key moments = props.at (s from clip start).
const meta = ({ props }: { props: DuetClipProps }) => ({ durationInFrames: Math.max(10, Math.round(props.seconds * 25)) });
const clips: [string, React.FC<DuetClipProps>, DuetClipProps][] = [
  ["DuetNews", DuetNews, { seconds: 3.5, topSafe: 200 }],
  ["DuetLock", DuetLock, { seconds: 3.0 }],
  ["DuetCost", DuetCost, { seconds: 3.0 }],
  ["DuetBriefing", DuetBriefing, { seconds: 3.5 }],
  ["DuetPhoneOff", DuetPhoneOff, { seconds: 3.5 }],
  ["DuetApprove", DuetApprove, { seconds: 2.5 }],
  ["DuetWaitlist", DuetWaitlist, { seconds: 2.5 }],
];
export const DuetRoot: React.FC = () => (
  <>
    <Composition id="DuetOpus" component={DuetOpus} durationInFrames={DU_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
    {clips.map(([id, C, p]) => (
      <Composition key={id} id={id} component={C} durationInFrames={Math.round(p.seconds * 25)} fps={25} width={PW} height={PH} defaultProps={p} calculateMetadata={meta} />
    ))}
  </>
);
