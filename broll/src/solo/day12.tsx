// standalone entry for Tag 12 (the shared Root can be broken by other sessions' work in progress)
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Agents100Day12, AGENTS_DAY12_SECONDS } from "../compositions/Agents100Day12";
const SoloRoot: React.FC = () => <Composition id="Agents100Day12" component={Agents100Day12} durationInFrames={Math.round(AGENTS_DAY12_SECONDS * 30)} fps={30} width={1080} height={1920} />;
registerRoot(SoloRoot);
