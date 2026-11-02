import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { GptHook } from "../components/GptHook";

// @florentgpt cover still: a hand-picked, colour-corrected avatar frame + the GPT-N hook box.
export const GptCover: React.FC<{ bg: string; hook: string }> = ({ bg, hook }) => (
  <AbsoluteFill>
    <Img src={staticFile(bg)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
    <GptHook text={hook} startFrame={0} endFrame={100} frameWidth={1080} />
  </AbsoluteFill>
);
