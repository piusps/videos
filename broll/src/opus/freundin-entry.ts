import { registerRoot } from "remotion";
import { FreundinRoot } from "./FreundinRoot";

// Separate entry for @florentgpt Satire "KI Freundin" (2026-10-14), shared Root.tsx stays untouched.
// Render: npx remotion render src/opus/freundin-entry.ts GptKiFreundin out.mp4
registerRoot(FreundinRoot);
