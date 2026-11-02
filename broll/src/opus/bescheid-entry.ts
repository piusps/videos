import { registerRoot } from "remotion";
import { BescheidRoot } from "./BescheidRoot";

// FP-N "Bescheid-Check" (2026-11-01): master BescheidOpus.
// Render: npx remotion render src/opus/bescheid-entry.ts BescheidOpus runs/fpn-bescheid/raw.mp4 --gl=angle
registerRoot(BescheidRoot);
