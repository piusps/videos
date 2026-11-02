import { registerRoot } from "remotion";
import { BewirtungRoot } from "./BewirtungRoot";

// FP-N "Bewirtungsbeleg" (2026-10-25), Stil wie ReisekostenOpus.
// Render: npx remotion render src/opus/bewirtung-entry.ts BewirtungOpus out.mp4
registerRoot(BewirtungRoot);
