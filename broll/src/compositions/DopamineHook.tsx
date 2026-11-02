import React from "react";
import { DopamineHookProps, DopamineHookScene, DOPAMINE_HOOK_DEFAULTS } from "../components/HookKit";

// DopamineHook (Henri 2026-10-08): reusable full-frame hook B-Roll for normal reels (FP-N, GPT-N, BX-C, never satire).
// Render per reel with --props (see ~/.claude/skills/video-broll/SKILL.md "Hook-Dopamin-B-Roll") and drop it into
// broll-windows.json as the first window (startSec 0). Duration = props.seconds (default 4.5 s).
export const DopamineHook: React.FC<DopamineHookProps> = (props) => <DopamineHookScene {...props} />;
export const dopamineHookDefaults = DOPAMINE_HOOK_DEFAULTS;
export const dopamineHookMetadata = ({ props }: { props: DopamineHookProps }) => ({ durationInFrames: Math.round((props.seconds ?? DOPAMINE_HOOK_DEFAULTS.seconds) * 25) });
