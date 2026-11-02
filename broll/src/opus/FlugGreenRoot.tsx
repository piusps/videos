import React from "react";
import { Composition } from "remotion";
import { GptFlugGreen, FLUG_FRAMES } from "./GptFlugGreen";

export const FlugGreenRoot: React.FC = () => (
  <Composition id="GptFlugGreen" component={GptFlugGreen} durationInFrames={FLUG_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
