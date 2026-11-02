import { registerRoot } from "remotion";
import { ZweierteamRoot } from "./ZweierteamRoot";

// FP study reel "Allein mit KI = Zweierteam" (Henri 2026-10-13). Own entry so the other opus compositions stay untouched.
// Render: npx remotion render src/opus/zweierteam-entry.ts ZweierteamOpus out.mp4
registerRoot(ZweierteamRoot);
