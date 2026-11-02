import { registerRoot } from "remotion";
import { SpielRoot } from "./SpielRoot";

// FP-N "Marken-Spiel" (2026-10-30): master SpielOpus.
// Render: npx remotion render src/opus/spiel-entry.ts SpielOpus runs/fpn-spiel/raw.mp4 --gl=angle
registerRoot(SpielRoot);
