import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadGoogleSans } from "@remotion/google-fonts/GoogleSans";
import { KlageOpus, KL_FRAMES } from "./KlageOpus";
import { CourtTest, CourtNowTest } from "./KlageCourt3D";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadSerif("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });
loadGoogleSans("normal", { weights: ["400", "500", "700"], subsets: ["latin", "latin-ext"] });

export const KlageRoot: React.FC = () => (
  <>
    <Composition id="KlageOpus" component={KlageOpus} durationInFrames={KL_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
    <Composition id="CourtNowTest" component={CourtNowTest} durationInFrames={75} fps={25} width={1080} height={820} defaultProps={{}} />
    <Composition id="CourtTest" component={CourtTest} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{}} />
  </>
);
