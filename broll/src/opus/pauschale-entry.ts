import { registerRoot } from "remotion";
import { PauschaleRoot } from "./PauschaleRoot";

// FP-N "Steuerberater-Pauschale" (2026-10-30): master PauschaleOpus.
// Render: npx remotion render src/opus/pauschale-entry.ts PauschaleOpus runs/fpn-pauschale/raw.mp4 --gl=angle
registerRoot(PauschaleRoot);
