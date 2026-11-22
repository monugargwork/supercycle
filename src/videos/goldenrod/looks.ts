// The Goldenrod heist reel's cast looks (flat toon outfits). Generic cartoon people: masked burglars, no likenesses.
// A knit balaclava = a dark slate skin + a matching beanie over the hair + the eye-hole band (mask).
import { Outfit } from "../../engine/toon";
const KNIT = "#3c4054";
export const LOOKS = {
  A: { jacket: "#22232b", pants: "#2c2f3a", boots: "#15131a", hat: "beanie", cap: KNIT, skin: KNIT, mask: true } as Outfit,
  B: { jacket: "#2f5a3a", pants: "#2c2f3a", boots: "#15131a", hat: "beanie", cap: KNIT, skin: KNIT, mask: true } as Outfit,
  C: { jacket: "#7a2f3a", pants: "#2c2f3a", boots: "#15131a", hat: "beanie", cap: KNIT, skin: KNIT, mask: true } as Outfit,
  D: { jacket: "#6a6e78", pants: "#2c2f3a", boots: "#15131a", hat: "beanie", cap: KNIT, skin: KNIT, mask: true } as Outfit,
  clerk: { jacket: "#f2c84a", pants: "#2f3a52", boots: "#2a2c33", hat: "hair", hair: "#5a3b2a", skin: "#e8b896", chest: "RENTAL", chestCol: "#1d2a44" } as Outfit,
  det: { jacket: "#8a5a34", pants: "#3a3d46", boots: "#15131a", hat: "hair", hair: "#a9adb5", skin: "#f2c8a8", tie: "#2f5fb4" } as Outfit,
  sarge: { jacket: "#1d2a44", pants: "#1d2a44", boots: "#15131a", hat: "cap", cap: "#141c30", skin: "#d9a07a", badge: "#e2b23a" } as Outfit,
  cop: { jacket: "#1d2a44", pants: "#1d2a44", boots: "#15131a", hat: "cap", cap: "#141c30", skin: "#f2c4a4", badge: "#e2b23a" } as Outfit,
};
