import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPixel } from "@remotion/google-fonts/Silkscreen";
import { DatenschutzOpus, DS_FRAMES } from "./DatenschutzOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadPixel("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });

export const DatenschutzRoot: React.FC = () => (
  <Composition id="DatenschutzOpus" component={DatenschutzOpus} durationInFrames={DS_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
