import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { SpielOpus, SP_FRAMES } from "./SpielOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadSerif("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext"] });
loadSerif("italic", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });

export const SpielRoot: React.FC = () => (
  <>
    <Composition id="SpielOpus" component={SpielOpus} durationInFrames={SP_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
  </>
);
