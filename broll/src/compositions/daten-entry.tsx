import React from "react";
import { Composition, registerRoot } from "remotion";
import { loadFonts } from "../loadFonts";
import { SatireDatenGeschuetzt } from "./SatireDatenGeschuetzt";

// FP-S "Daten, geschützt vor uns" (2026-10-21). Render: npx remotion render src/compositions/daten-entry.tsx SatireDatenGeschuetzt out.mp4 --props runs/fps-daten-geschuetzt/props.json
loadFonts();
const DatenRoot: React.FC = () => (
  <Composition id="SatireDatenGeschuetzt" component={SatireDatenGeschuetzt} durationInFrames={100} fps={25} width={1080} height={1920}
    defaultProps={{ src: "", seconds: 18, words: [], c: { euch: 2.2, Kundenliste: 3.2, Laptop: 5.4, Urlaub: 7.2, Du: 7.9, Nein: 10.6, Datenschutz: 11.0, Juergen3: 12.0, private: 13.3, Pool: 14.8, Keiner: 15.6, Sicherer: 17.0 } as Record<string, number> }}
    calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
);
registerRoot(DatenRoot);
