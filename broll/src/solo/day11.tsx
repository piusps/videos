// standalone entry for Tag 11 (the shared Root can be broken by other sessions' work in progress)
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Agents100Day11, AGENTS_DAY11_SECONDS } from "../compositions/Agents100Day11";
const SoloRoot: React.FC = () => <Composition id="Agents100Day11" component={Agents100Day11} durationInFrames={Math.round(AGENTS_DAY11_SECONDS * 30)} fps={30} width={1080} height={1920} />;
registerRoot(SoloRoot);
