import { registerRoot } from "remotion";
import { AngebotRoot } from "./AngebotRoot";

// FP-N "Angebot aus der Sprachnachricht" (Pius 2026-10-19). Own entry so the other opus compositions stay untouched.
// Render: npx remotion render src/opus/angebot-entry.ts AngebotOpus out.mp4
registerRoot(AngebotRoot);
