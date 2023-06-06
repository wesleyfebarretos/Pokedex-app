import { AppDataSource } from "../data-source";
import { AbilityEntity } from "../entities/ability-entity";

export const abilityRepository = AppDataSource.getRepository(AbilityEntity);
