import { registerRoot } from "remotion";
import { KlageRoot } from "./KlageRoot";

// FP-N "Klage ohne Anwalt" (2026-10-27), Gerüst wie MapsOpus.
// Render: npx remotion render src/opus/klage-entry.ts KlageOpus out.mp4
registerRoot(KlageRoot);
