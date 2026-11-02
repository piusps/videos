// Separate entry for Niklas-Lifestyle (NL) subtitle overlays, rendered transparent and laid over the reel by render.py.
import { Composition, registerRoot } from "remotion";
import { NLSubs, NLSubsProps } from "./compositions/NLSubs";

const Root: React.FC = () => (
  <Composition
    id="NLSubs"
    component={NLSubs}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={30}
    defaultProps={{ chunks: [], y: 1240, seconds: 1 } as NLSubsProps}
    calculateMetadata={({ props }) => ({ durationInFrames: Math.ceil(props.seconds * 30) })}
  />
);
registerRoot(Root);
