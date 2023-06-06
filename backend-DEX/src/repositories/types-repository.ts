import { AppDataSource } from "../data-source";
import { TypeEntity } from "../entities/type-entity";

export const typeRepository = AppDataSource.getRepository(TypeEntity);
