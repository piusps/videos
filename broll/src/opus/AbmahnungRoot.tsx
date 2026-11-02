import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { AbmahnungOpus, AB_FRAMES } from "./AbmahnungOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadSerif("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });

export const AbmahnungRoot: React.FC = () => (
  <Composition id="AbmahnungOpus" component={AbmahnungOpus} durationInFrames={AB_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
