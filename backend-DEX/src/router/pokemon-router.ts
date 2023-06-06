import { Router } from "express";
import { abilityRepository } from "../repositories/abilities-repository";
import { pokemonRepository } from "../repositories/pokemon-repository";
import { spriteRepository } from "../repositories/sprite-reposository";
import { typeRepository } from "../repositories/types-repository";
import { PokemonController } from "../services/pokemon-service/pokemon-controller";
import { PokemonService } from "../services/pokemon-service/pokemon-service";

export const pokemonRouter = Router();
const pokemonService = new PokemonService(pokemonRepository, typeRepository, abilityRepository, spriteRepository);
const pokemonController = new PokemonController(pokemonService);

pokemonRouter.get("", pokemonController.getAll);
pokemonRouter.get("/:pokemon", pokemonController.getOne);
pokemonRouter.post("", pokemonController.create);
pokemonRouter.delete("/:pokemon", pokemonController.delete);
pokemonRouter.put("/:pokemon/name", pokemonController.updateName);
pokemonRouter.put("/:pokemon/abilities", pokemonController.updateAbilities);
pokemonRouter.put("/:pokemon/types", pokemonController.updateTypes);
pokemonRouter.put("/:pokemon/sprites", pokemonController.updateSprites);
