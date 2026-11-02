import { registerRoot } from "remotion";
import { RomanRoot } from "./RomanRoot";

// Separate entry for @florentgpt Satire "Roman zum Schlussmachen" (2026-10-13), shared Root.tsx stays untouched.
// Render: npx remotion render src/opus/roman-entry.ts GptRomanSchlussmachen out.mp4
registerRoot(RomanRoot);
