import React from "react";
import { Composition } from "remotion";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadPixel } from "@remotion/google-fonts/PressStart2P";
import { UrlaubPixel, URLAUB_FRAMES } from "./UrlaubPixel";

loadMono("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });
loadPixel("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });

export const UrlaubPixelRoot: React.FC = () => (
  <Composition id="UrlaubPixel" component={UrlaubPixel} durationInFrames={URLAUB_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
