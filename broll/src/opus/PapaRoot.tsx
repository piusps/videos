import React from "react";
import { Composition } from "remotion";
import { GptPapaScreenshots, PAPA_FRAMES } from "./GptPapaScreenshots";

export const PapaRoot: React.FC = () => (
  <>
    <Composition id="GptPapaScreenshots" component={GptPapaScreenshots} durationInFrames={PAPA_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
  </>
);
