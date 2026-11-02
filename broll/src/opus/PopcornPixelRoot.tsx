import React from "react";
import { Composition } from "remotion";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadPixel } from "@remotion/google-fonts/PressStart2P";
import { PopcornPixel, PC_FRAMES } from "./PopcornPixel";

loadMono("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
loadPixel("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });

export const PopcornPixelRoot: React.FC = () => (
  <Composition id="PopcornPixel" component={PopcornPixel} durationInFrames={PC_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
