// The channel logo (Supercycle), static, top right of every story reel. Laid out on the 1080 x 1920 composition,
// matching the position the user marked (about x 771-1023, y 118-268), so it scales with the render like everything else.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export const LOGO_BOX = { left: 771, top: 118, width: 252 };
export const Logo: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <Img src={staticFile("brand/supercycle_logo.png")} style={{ position: "absolute", left: LOGO_BOX.left, top: LOGO_BOX.top, width: LOGO_BOX.width, height: "auto" }} />
  </AbsoluteFill>
);
