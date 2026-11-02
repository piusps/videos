import React from "react";
import { Composition } from "remotion";
import { GptHuehnersuppe, GHS_FRAMES } from "./GptHuehnersuppe";

export const SuppeRoot: React.FC = () => (
  <>
    <Composition id="GptHuehnersuppe" component={GptHuehnersuppe} durationInFrames={GHS_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
  </>
);
