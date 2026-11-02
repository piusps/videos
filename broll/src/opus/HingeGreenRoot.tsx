import React from "react";
import { Composition } from "remotion";
import { GptHingeGreen, HINGE_FRAMES } from "./GptHingeGreen";

export const HingeGreenRoot: React.FC = () => (
  <Composition id="GptHingeGreen" component={GptHingeGreen} durationInFrames={HINGE_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
