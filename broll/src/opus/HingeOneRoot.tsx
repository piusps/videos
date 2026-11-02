import React from "react";
import { Composition } from "remotion";
import { GptHingeOne, HINGE3_FRAMES } from "./GptHingeOne";

export const HingeOneRoot: React.FC = () => (
  <Composition id="GptHingeOne" component={GptHingeOne} durationInFrames={HINGE3_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
