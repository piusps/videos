import { registerRoot } from "remotion";
import { JaggedRoot } from "./JaggedRoot";

// FP study reel "Jagged Frontier" (Dell'Acqua et al. 2023). Own entry so the other opus compositions stay untouched.
// Render: npx remotion render src/opus/jagged-entry.ts JaggedOpus out.mp4 --concurrency=3
registerRoot(JaggedRoot);
