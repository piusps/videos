import { registerRoot } from "remotion";
import { NeueFirmenRoot } from "./NeueFirmenRoot";

// FP-N "Neue Firmen" (2026-10-14). Own entry so the other opus compositions stay untouched.
// Render: npx remotion render src/opus/neuefirmen-entry.ts NeueFirmenOpus out.mp4
registerRoot(NeueFirmenRoot);
