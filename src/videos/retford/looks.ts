// The Chicago reel's cast looks (flat toon outfits). Generic cartoon people: no likenesses (the owner is not drawn as Nick Bruni,
// and the thief was never described). Bright palette (quality bar): no greys, no near-black navy.
import { Outfit } from "../../engine/toon";
export const LOOKS = {
  owner: { jacket: "#2f9a55", pants: "#2f5fb4", boots: "#5a3420", hat: "cap", cap: "#d8322f", skin: "#f2c8a8", glasses: true, chest: "OLD SKOOL", chestCol: "#fbf3dc" } as Outfit,
  man: { jacket: "#c98a3e", pants: "#3f6fc4", boots: "#6a3f22", hat: "hair", hair: "#3a2418", skin: "#e2a882" } as Outfit,
  kid: { jacket: "#f2c23a", pants: "#2f5fb4", boots: "#d8322f", hat: "hair", hair: "#5a3420", skin: "#f2c4a4", build: "kid" } as Outfit,
  teen: { jacket: "#4fb0e8", pants: "#3b4a8a", boots: "#f4f1ea", hat: "cap", cap: "#f2c23a", skin: "#a8714f" } as Outfit,
  woman: { jacket: "#d8322f", pants: "#2f4a8a", boots: "#5a3420", hat: "hair", hair: "#2a1a14", skin: "#e8b896" } as Outfit,
  teal: { jacket: "#2f9a9a", pants: "#5a3f2a", boots: "#2a1a14", hat: "hair", hair: "#8a5a34", skin: "#f2c8a8", glasses: true } as Outfit,
  cop: { jacket: "#8fc4ec", pants: "#2f4a8a", boots: "#2a1a14", hat: "cap", cap: "#2f4a8a", skin: "#c98a62", badge: "#f2c23a", tie: "#2f4a8a" } as Outfit,
};
