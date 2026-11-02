import { registerRoot } from "remotion";
import { ParkinsonGreenRoot } from "./ParkinsonGreenRoot";

// GPT-S "Parkinsonsches Gesetz" (Umzug), GPT look white + dark green (2026-10-17). Render: npx remotion render src/opus/parkinsongreen-entry.ts GptParkinsonGreen out.mp4
registerRoot(ParkinsonGreenRoot);
