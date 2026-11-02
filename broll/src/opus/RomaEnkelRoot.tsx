import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadGoogleSans } from "@remotion/google-fonts/GoogleSans";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { RomaEnkelOpus, RE_FRAMES } from "./RomaEnkelOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadSerif("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });
loadGoogleSans("normal", { weights: ["400", "500", "700"], subsets: ["latin", "latin-ext"] });
loadCaveat("normal", { weights: ["400", "600", "700"], subsets: ["latin", "latin-ext"] });

export const RomaEnkelRoot: React.FC = () => (
  <Composition id="RomaEnkelOpus" component={RomaEnkelOpus} durationInFrames={RE_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
