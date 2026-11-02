import React from "react";
import { Composition } from "remotion";
import { GptHingeProfile, HINGE2_FRAMES } from "./GptHingeProfile";

export const HingeProfileRoot: React.FC = () => (
  <Composition id="GptHingeProfile" component={GptHingeProfile} durationInFrames={HINGE2_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
