import React from "react";
import { Composition } from "remotion";
import { GptParkinsonGreen, PK_FRAMES } from "./GptParkinsonGreen";

export const ParkinsonGreenRoot: React.FC = () => (
  <Composition id="GptParkinsonGreen" component={GptParkinsonGreen} durationInFrames={PK_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
