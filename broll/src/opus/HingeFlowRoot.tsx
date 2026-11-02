import React from "react";
import { Composition } from "remotion";
import { GptHingeFlow, HINGE4_FRAMES } from "./GptHingeFlow";

export const HingeFlowRoot: React.FC = () => (
  <Composition id="GptHingeFlow" component={GptHingeFlow} durationInFrames={HINGE4_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
