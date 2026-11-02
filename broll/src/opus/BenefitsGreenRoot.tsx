import React from "react";
import { Composition } from "remotion";
import { GptBenefitsGreen, BEN_FRAMES } from "./GptBenefitsGreen";

export const BenefitsGreenRoot: React.FC = () => (
  <Composition id="GptBenefitsGreen" component={GptBenefitsGreen} durationInFrames={BEN_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
