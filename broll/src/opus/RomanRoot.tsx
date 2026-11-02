import React from "react";
import { Composition } from "remotion";
import { GptRomanSchlussmachen, GRS_FRAMES } from "./GptRomanSchlussmachen";

export const RomanRoot: React.FC = () => (
  <>
    <Composition id="GptRomanSchlussmachen" component={GptRomanSchlussmachen} durationInFrames={GRS_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
  </>
);
