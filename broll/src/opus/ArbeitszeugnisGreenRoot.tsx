import React from "react";
import { Composition } from "remotion";
import { GptArbeitszeugnisGreen, AZ_FRAMES } from "./GptArbeitszeugnisGreen";

export const ArbeitszeugnisGreenRoot: React.FC = () => (
  <Composition id="GptArbeitszeugnisGreen" component={GptArbeitszeugnisGreen} durationInFrames={AZ_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
