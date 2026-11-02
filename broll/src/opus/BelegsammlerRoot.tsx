import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { BelegsammlerOpus, BS_FRAMES } from "./BelegsammlerOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadSerif("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext"] });
loadSerif("italic", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });

export const BelegsammlerRoot: React.FC = () => (
  <>
    <Composition id="BelegsammlerOpus" component={BelegsammlerOpus} durationInFrames={BS_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
  </>
);
