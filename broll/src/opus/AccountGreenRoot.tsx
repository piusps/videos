import React from "react";
import { Composition } from "remotion";
import { GptAccountGreen, ACC_FRAMES } from "./GptAccountGreen";

export const AccountGreenRoot: React.FC = () => (
  <Composition id="GptAccountGreen" component={GptAccountGreen} durationInFrames={ACC_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
