import { registerRoot } from "remotion";
import { GoogleBewertungRoot } from "./GoogleBewertungRoot";

// FP-N "Google-Bewertung" (2026-10-15). Own entry so the other opus compositions stay untouched.
// Render: npx remotion render src/opus/googlebewertung-entry.ts GoogleBewertungOpus out.mp4
registerRoot(GoogleBewertungRoot);
