import { registerRoot } from "remotion";
import { RomaEnkelRoot } from "./RomaEnkelRoot";

// ROMA Enkel-Format "Waschmaschine" (2026-10-28), Schnitt wie Folge 1.
// Render: npx remotion render src/opus/roma-enkel-entry.ts RomaEnkelOpus out.mp4
registerRoot(RomaEnkelRoot);
