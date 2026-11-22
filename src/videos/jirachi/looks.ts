// The Jirachi reel's cast looks (flat toon outfits). Shared by cast.ts and the framed photo on the family shelf (sets.ts).
import { Outfit } from "../../engine/toon";
export const AVERY_LOOK: Outfit = { jacket: "#a9cfe8", pants: "#a9cfe8", boots: "#f4f1ea", hat: "beanie", cap: "#3f6fd8", skin: "#e8b896", build: "kid" };
export const LOOKS = {
  seller: { jacket: "#8a8f9a", pants: "#2a2c33", boots: "#15131a", hat: "cap", cap: "#1d1b22", skin: "#f2c4a4" } as Outfit,
  avery: AVERY_LOOK,
  mum: { jacket: "#7a2a3a", pants: "#3b3f52", boots: "#5a3b2a", hat: "hair", hair: "#2a201a", skin: "#d9a07a", dress: "#7a2a3a" } as Outfit,
  dad: { jacket: "#3f7a55", pants: "#3b3f52", boots: "#3a2a20", hat: "hair", hair: "#1d1b22", skin: "#d9a07a", glasses: true } as Outfit,
  artist: { jacket: "#f4f1ea", pants: "#3b3f52", boots: "#2a2c33", hat: "hair", hair: "#15131a", skin: "#f2d0b0", glasses: true, dress: "#f4f1ea" } as Outfit,
};
