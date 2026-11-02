import React from "react";
import { Composition } from "remotion";
import { GptKiFreundinGreen, GKFG_FRAMES } from "./GptKiFreundinGreen";

export const FreundinGreenRoot: React.FC = () => (
  <Composition id="GptKiFreundinGreen" component={GptKiFreundinGreen} durationInFrames={GKFG_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
