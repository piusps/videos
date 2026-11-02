import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadGoogleSans } from "@remotion/google-fonts/GoogleSans";
import { MapsOpus, MP_FRAMES } from "./MapsOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadSerif("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });
loadGoogleSans("normal", { weights: ["400", "500", "700"], subsets: ["latin", "latin-ext"] });

export const MapsRoot: React.FC = () => (
  <Composition id="MapsOpus" component={MapsOpus} durationInFrames={MP_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
