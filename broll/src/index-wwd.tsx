// Separate entry for the "Was wäre wenn" series (3D thought experiments in the @was.wenn.dann look).
import React from "react";
import { Composition, registerRoot } from "remotion";
import { BlackFriday, BF_END } from "./wwd/BlackFriday";
import { Weihnachtstafel, WT_END } from "./wwd/Weihnachtstafel";
import { Zug, ZG_END } from "./wwd/Zug";
import { TikTok, TT_END } from "./wwd/TikTok";
import { Zug2, ZG2_END } from "./wwd/Zug2";

const Root: React.FC = () => (
  <>
    <Composition id="WwdBlackFriday" component={BlackFriday} durationInFrames={Math.ceil(BF_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="WwdWeihnachtstafel" component={Weihnachtstafel} durationInFrames={Math.ceil(WT_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="WwdZug" component={Zug} durationInFrames={Math.ceil(ZG_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="WwdZug2" component={Zug2} durationInFrames={Math.ceil(ZG2_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="WwdTikTok" component={TikTok} durationInFrames={Math.ceil(TT_END * 30)} fps={30} width={1080} height={1920} />
  </>
);
registerRoot(Root);
