import React from "react";
import { Composition } from "remotion";
import { GptJevonsGreen, JV_FRAMES } from "./GptJevonsGreen";

export const JevonsGreenRoot: React.FC = () => (
  <Composition id="GptJevonsGreen" component={GptJevonsGreen} durationInFrames={JV_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
