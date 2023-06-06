import { AppDataSource } from "../data-source";
import { PokemonEntity } from "../entities/pokemon-entity";

export const pokemonRepository = AppDataSource.getRepository(PokemonEntity);
