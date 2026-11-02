import { registerRoot } from "remotion";
import { BonRoot } from "./BonRoot";

// FP-N "Belegkasse" (2026-11-01): master BonOpus.
// Render: npx remotion render src/opus/bon-entry.ts BonOpus runs/fpn-bon/raw.mp4 --gl=angle
registerRoot(BonRoot);
