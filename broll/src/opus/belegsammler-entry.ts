import { registerRoot } from "remotion";
import { BelegsammlerRoot } from "./BelegsammlerRoot";

// FP-N "Belegsammler" (2026-10-31): master BelegsammlerOpus.
// Render: npx remotion render src/opus/belegsammler-entry.ts BelegsammlerOpus runs/fpn-belegsammler/raw.mp4 --gl=angle
registerRoot(BelegsammlerRoot);
