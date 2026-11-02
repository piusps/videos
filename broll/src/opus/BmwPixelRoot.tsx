import React from "react";
import { Composition } from "remotion";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadPixel } from "@remotion/google-fonts/PressStart2P";
import { BmwPixel, BMW_FRAMES } from "./BmwPixel";

loadMono("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
loadPixel("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });

export const BmwPixelRoot: React.FC = () => (
  <Composition id="BmwPixel" component={BmwPixel} durationInFrames={BMW_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
