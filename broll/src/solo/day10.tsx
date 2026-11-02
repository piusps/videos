// standalone entry for Tag 10 (the shared Root can be broken by other sessions' work in progress)
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Agents100Day10, AGENTS_DAY10_SECONDS } from "../compositions/Agents100Day10";
const SoloRoot: React.FC = () => <Composition id="Agents100Day10" component={Agents100Day10} durationInFrames={Math.round(AGENTS_DAY10_SECONDS * 30)} fps={30} width={1080} height={1920} />;
registerRoot(SoloRoot);
