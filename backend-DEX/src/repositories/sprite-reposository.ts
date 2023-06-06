import { AppDataSource } from "../data-source";
import { SpriteEntity } from "../entities/sprite-entity";

export const spriteRepository = AppDataSource.getRepository(SpriteEntity);
