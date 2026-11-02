import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { PauschaleOpus, PA_FRAMES } from "./PauschaleOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadSerif("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext"] });
loadSerif("italic", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });

export const PauschaleRoot: React.FC = () => (
  <>
    <Composition id="PauschaleOpus" component={PauschaleOpus} durationInFrames={PA_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
  </>
);
