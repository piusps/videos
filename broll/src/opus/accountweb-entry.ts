import { registerRoot } from "remotion";
import { AccountWebRoot } from "./AccountWebRoot";

// GPT-S "Geteilter Account" v4 (real ChatGPT web UI, 2026-10-21). Render: npx remotion render src/opus/accountweb-entry.ts GptAccountWeb out.mp4
registerRoot(AccountWebRoot);
