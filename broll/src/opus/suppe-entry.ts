import { registerRoot } from "remotion";
import { SuppeRoot } from "./SuppeRoot";

// Separate entry for @florentgpt Satire "Huehnersuppe-Agent" (2026-10-13), shared Root.tsx stays untouched.
// Render: npx remotion render src/opus/suppe-entry.ts GptHuehnersuppe out.mp4
registerRoot(SuppeRoot);
