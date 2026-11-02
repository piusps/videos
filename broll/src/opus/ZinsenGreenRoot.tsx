import React from "react";
import { Composition } from "remotion";
import { GptZinsenGreen, ZG_FRAMES } from "./GptZinsenGreen";

export const ZinsenGreenRoot: React.FC = () => (
  <Composition id="GptZinsenGreen" component={GptZinsenGreen} durationInFrames={ZG_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
