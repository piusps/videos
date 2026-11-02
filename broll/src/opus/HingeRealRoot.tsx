import React from "react";
import { Composition } from "remotion";
import { GptHingeReal, HINGE5_FRAMES } from "./GptHingeReal";

export const HingeRealRoot: React.FC = () => (
  <Composition id="GptHingeReal" component={GptHingeReal} durationInFrames={HINGE5_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
