// The Lucas reel's cast looks (flat toon outfits). Everyone is a generic house cartoon (no likenesses).
import { Outfit, townsfolk } from "../../engine/toon";
export const LUCAS: Outfit = { jacket: "#3f6fa8", pants: "#4a5f86", boots: "#3a2a20", hat: "hair", hair: "#6a4a2a", skin: "#f2c4a4" };
export const LOOKS = {
  lucas: LUCAS,
  lucasShades: { ...LUCAS, shades: true } as Outfit,
  fiance: { jacket: "#7fc8a9", pants: "#3b3f52", boots: "#5a3b2a", hat: "hair", hair: "#a0482a", skin: "#f5d0b4", dress: "#7fc8a9" } as Outfit,
  dealer: { jacket: "#22232a", pants: "#2f3240", boots: "#15131a", hat: "cap", cap: "#15131a", skin: "#d9a07a", moustache: "#2a201a" } as Outfit,
  dealerShades: { jacket: "#22232a", pants: "#2f3240", boots: "#15131a", hat: "cap", cap: "#15131a", skin: "#d9a07a", moustache: "#2a201a", shades: true } as Outfit,
  clerk: { jacket: "#c23a32", pants: "#2f3240", boots: "#2a2c33", hat: "hair", hair: "#1d1b22", skin: "#c99067", glasses: true } as Outfit,
  f1: { jacket: "#e8822c", pants: "#3b3f52", boots: "#2a2c33", hat: "hair", hair: "#2a201a", skin: "#f5c9a0" } as Outfit,
  f2: { jacket: "#7b5ac9", pants: "#2f3240", boots: "#2a2c33", hat: "cap", cap: "#2f9a55", skin: "#c99067" } as Outfit,
  f3: { jacket: "#4f8a3a", pants: "#3b3f52", boots: "#2a2c33", hat: "hair", hair: "#d9a441", skin: "#ecd0b6", dress: "#4f8a3a" } as Outfit,
  q0: { ...townsfolk(0), hat: "cap", cap: "#c23a32" } as Outfit,
  q1: { ...townsfolk(1), hat: "hair", hair: "#2a201a" } as Outfit,
  q2: { ...townsfolk(2), hat: "hair", hair: "#5a3b2a" } as Outfit,
  q3: { ...townsfolk(3), hat: "cap", cap: "#2f5fb4" } as Outfit,
  q4: { ...townsfolk(4), hat: "hair", hair: "#1d1b22" } as Outfit,
  q5: { ...townsfolk(5), hat: "hair", hair: "#a0482a" } as Outfit,
  q6: { ...townsfolk(6), hat: "cap", cap: "#e7a43a" } as Outfit,
};
