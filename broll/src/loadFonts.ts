import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { fonts } from "./theme";

const files: Record<string, string> = {
  [fonts.regular]: "Inter-Regular.ttf",
  [fonts.medium]: "Inter-Medium.ttf",
  [fonts.semibold]: "Inter-SemiBold.ttf",
  [fonts.bold]: "Inter-Bold.ttf",
};

// Loads the same static Inter TTFs used by the Guidebook PDF generator, so
// spoken-script B-Roll and the PDF lead magnet share pixel-identical type.
// Call this once at the top of Root.tsx.
export const loadFonts = () => {
  loadAnton("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });

  Object.entries(files).forEach(([family, file]) => {
    const handle = delayRender(`Loading font: ${family}`);
    const fontFace = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`);
    fontFace
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch((err: unknown) => {
        console.error(`Failed to load font ${family}`, err);
        continueRender(handle);
      });
  });
};
