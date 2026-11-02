import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadGoogleSans } from "@remotion/google-fonts/GoogleSans";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { RomaOpus, RO_FRAMES } from "./RomaOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadSerif("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });
loadGoogleSans("normal", { weights: ["400", "500", "700"], subsets: ["latin", "latin-ext"] });
loadCaveat("normal", { weights: ["400", "600", "700"], subsets: ["latin", "latin-ext"] });

export const RomaRoot: React.FC = () => (
  <Composition id="RomaOpus" component={RomaOpus} durationInFrames={RO_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
