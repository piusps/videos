import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPixel } from "@remotion/google-fonts/Silkscreen";
import { KlagePixelOpus, KP_FRAMES } from "./KlagePixelOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadPixel("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });

export const KlagePixelRoot: React.FC = () => (
  <Composition id="KlagePixelOpus" component={KlagePixelOpus} durationInFrames={KP_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
