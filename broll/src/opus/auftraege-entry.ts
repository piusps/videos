import { registerRoot } from "remotion";
import { AuftraegeRoot } from "./AuftraegeRoot";

// FP-N "Öffentliche Aufträge" (2026-10-18), Opus-Stil. Render: npx remotion render src/opus/auftraege-entry.ts AuftraegeOpus out.mp4
registerRoot(AuftraegeRoot);
