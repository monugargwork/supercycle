// The Roush reel's cast looks (flat toon outfits). Generic cartoon people: no likenesses (the creator is not drawn after the real
// person). Bright palette (quality bar): no greys, no near-black navy.
import { Outfit } from "../../engine/toon";
export const LOOKS = {
  creator: { jacket: "#f28ab0", pants: "#7fb6ea", boots: "#f4f1ea", hat: "hair", hair: "#f2c86a", skin: "#f2c8a8" } as Outfit,
  viewer: { jacket: "#2f9a9a", pants: "#3f6fc4", boots: "#f4f1ea", hat: "cap", cap: "#f2a33a", skin: "#e2a882" } as Outfit,
  seller: { jacket: "#c0323c", pants: "#3f6fc4", boots: "#f4f1ea", hat: "cap", cap: "#f2c23a", skin: "#c98a62", shades: true, chest: "$", chestCol: "#f2c23a" } as Outfit,
  courier: { jacket: "#a8682e", pants: "#8a5230", boots: "#5a3420", hat: "cap", cap: "#8a5230", skin: "#e8b896", badge: "#f2c23a" } as Outfit,
  tinman: { jacket: "#d8322f", pants: "#2f4a8a", boots: "#2a1a14", hat: "hair", hair: "#3a2418", skin: "#f2c4a4", tie: "#f2c23a" } as Outfit,
  tout: { jacket: "#c9a46a", pants: "#5a3f2a", boots: "#2a1a14", hat: "cap", cap: "#8a5a34", skin: "#e2a882", shades: true } as Outfit,
  v1: { jacket: "#2f9a9a", pants: "#5a3f2a", boots: "#2a1a14", hat: "hair", hair: "#8a5a34", skin: "#f2c8a8", glasses: true } as Outfit,
  v2: { jacket: "#f2a33a", pants: "#2f4a8a", boots: "#2a1a14", hat: "cap", cap: "#2f9a55", skin: "#a8714f" } as Outfit,
  v3: { jacket: "#2f9a55", pants: "#3f6fc4", boots: "#f4f1ea", hat: "hair", hair: "#2a1a14", skin: "#e8b896" } as Outfit,
  v4: { jacket: "#e85a9a", pants: "#2f4a8a", boots: "#5a3420", hat: "hair", hair: "#5a3420", skin: "#f2c8a8" } as Outfit,
  v5: { jacket: "#4fb0e8", pants: "#3b4a8a", boots: "#f4f1ea", hat: "cap", cap: "#f2c23a", skin: "#a8714f" } as Outfit,
  v6: { jacket: "#f2785a", pants: "#2f4a8a", boots: "#2a1a14", hat: "hair", hair: "#3a2418", skin: "#e2a882" } as Outfit,
  v7: { jacket: "#f2c23a", pants: "#3f6fc4", boots: "#d8322f", hat: "hair", hair: "#c98a3e", skin: "#efbe98" } as Outfit,
};
