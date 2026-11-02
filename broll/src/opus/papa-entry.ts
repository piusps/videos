import { registerRoot } from "remotion";
import { PapaRoot } from "./PapaRoot";

// Separate entry for @florentgpt Satire "Papa hat Screenshots" (2026-10-14), shared Root.tsx stays untouched.
// Render: npx remotion render src/opus/papa-entry.ts GptPapaScreenshots out.mp4 --concurrency=3
registerRoot(PapaRoot);
