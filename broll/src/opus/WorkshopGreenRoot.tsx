import React from "react";
import { Composition } from "remotion";
import { GptWorkshopGreen, WS_FRAMES } from "./GptWorkshopGreen";

export const WorkshopGreenRoot: React.FC = () => (
  <Composition id="GptWorkshopGreen" component={GptWorkshopGreen} durationInFrames={WS_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
