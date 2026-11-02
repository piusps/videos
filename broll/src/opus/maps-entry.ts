import { registerRoot } from "remotion";
import { MapsRoot } from "./MapsRoot";

// FP-N "Bei Google Maps unsichtbar" (2026-10-26), Stil wie BewirtungOpus.
// Render: npx remotion render src/opus/maps-entry.ts MapsOpus out.mp4
registerRoot(MapsRoot);
