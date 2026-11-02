import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { TerminOpus, TM_FRAMES } from "./TerminOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadSerif("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext"] });
loadSerif("italic", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });

export const TerminRoot: React.FC = () => (
  <>
    <Composition id="TerminOpus" component={TerminOpus} durationInFrames={TM_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
  </>
);
