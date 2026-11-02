import { registerRoot } from "remotion";
import { ZinsenGreenRoot } from "./ZinsenGreenRoot";

// GPT-N "Zinsen" in the 2026-10-15 look (GptGreenKit). Own entry so the other compositions stay untouched.
// Render: npx remotion render src/opus/zinsengreen-entry.ts GptZinsenGreen out.mp4
registerRoot(ZinsenGreenRoot);
