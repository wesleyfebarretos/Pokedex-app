import { Sprite } from "./sprite";
import { Type } from "./type";

export interface Pokemon {
  id: number;
  name: string;
  types: Type[];
  sprites: Sprite[];
}
