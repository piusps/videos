import React from "react";
import { Composition } from "remotion";
import { GptAccountWeb, ACCW_FRAMES } from "./GptAccountWeb";

export const AccountWebRoot: React.FC = () => (
  <Composition id="GptAccountWeb" component={GptAccountWeb} durationInFrames={ACCW_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
