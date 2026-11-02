import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPixel } from "@remotion/google-fonts/Silkscreen";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { GewinnOpus, GW_FRAMES } from "./GewinnOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadPixel("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
loadHand("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });

export const GewinnRoot: React.FC = () => (
  <Composition id="GewinnOpus" component={GewinnOpus} durationInFrames={GW_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
