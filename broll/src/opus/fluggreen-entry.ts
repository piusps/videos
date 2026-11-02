import { registerRoot } from "remotion";
import { FlugGreenRoot } from "./FlugGreenRoot";

// GPT-N "Flugverspätung" im GPT-Look Weiß + Dunkelgrün (2026-10-21). Render: npx remotion render src/opus/fluggreen-entry.ts GptFlugGreen out.mp4
registerRoot(FlugGreenRoot);
