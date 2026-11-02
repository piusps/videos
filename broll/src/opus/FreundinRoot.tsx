import React from "react";
import { Composition } from "remotion";
import { GptKiFreundin, GKF_FRAMES } from "./GptKiFreundin";

export const FreundinRoot: React.FC = () => (
  <>
    <Composition id="GptKiFreundin" component={GptKiFreundin} durationInFrames={GKF_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
  </>
);
