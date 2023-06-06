/* eslint-disable @typescript-eslint/no-explicit-any */
import { IsNull, Repository } from "typeorm";
import { AbilityEntity } from "../../entities/ability-entity";
import { PokemonEntity } from "../../entities/pokemon-entity";
import { SpriteEntity } from "../../entities/sprite-entity";
import { TypeEntity } from "../../entities/type-entity";
import { BadRequestError, NotFoundError } from "../../helpers/api-errors";

export interface PaginateObject<T> {
    next: string;
    results: Array<T>;
}

interface QueryParameter {
    id?: number;
    name?: string;
}
export class PokemonService {
    constructor(
        private pokemonRepository: Repository<PokemonEntity>,
        private typeRepository: Repository<TypeEntity>,
        private abilityRepository: Repository<AbilityEntity>,
        private spriteRepository: Repository<SpriteEntity>
    ) {
        this.pokemonRepository = pokemonRepository;
        this.typeRepository = typeRepository;
        this.abilityRepository = abilityRepository;
        this.spriteRepository = spriteRepository;
    }
    async getAll(offset: number, limit: number): Promise<PaginateObject<PokemonEntity>> {
        const result = await this.pokemonRepository.find({
            order: {
                id: "ASC"
            },
            relations: { abilities: true, types: true, sprites: true },
            skip: offset,
            take: limit
        });

        return {
            next: `http://localhost:8080/pokemon?offset=${offset + limit}&limit=${limit}`,
            results: result
        };
    }

    async getOne(pokemon: string): Promise<PokemonEntity> {
        const query = this.buildFindPokemonQuery(pokemon);

        const result = await this.pokemonRepository.findOne({
            where: query,
            relations: { abilities: true, types: true, sprites: true }
        });
        if (!result) {
            throw new NotFoundError("Pokemon not found");
        }

        return result;
    }

    async create(name: string, abilities: number[], types: number[], sprites: SpriteEntity[]): Promise<number> {
        const pokemon = await this.pokemonRepository.findOne({
            where: { name: name },
            relations: { abilities: true, types: true, sprites: true }
        });

        if (pokemon) {
            throw new BadRequestError(`Pokemon ${pokemon.name} already exist`);
        }

        if (abilities.length == 0 || abilities.length > 3) {
            throw new BadRequestError("Add the abilities correctly, they cannot be equal to 0 or greater than 3");
        }
        if (types.length == 0 || types.length > 2) {
            throw new BadRequestError("Add the types correctly, they cannot be equal to 0 or greater than 2");
        }

        if (sprites.length == 0 || sprites.length > 4) {
            throw new BadRequestError("Add the sprites correctly, they cannot be equal to 0 or greater than 4");
        }

        for (const sprite of sprites) {
            if (sprite.name != "front_default" && sprite.name != "back_default" && sprite.name != "back_shiny" && sprite.name != "front_shiny") {
                throw new BadRequestError("sprite.name only accepts values like: front_shiny/ back_shiny/ front_default/ back_default");
            }

            const imgExist = await this.spriteRepository.findOne({
                where: {
                    img: sprite.img
                }
            });

            if (imgExist) {
                throw new BadRequestError(`img: ${sprite.img} already exist`);
            }
        }

        const allAbilities: any = [];

        for (const ability of abilities) {
            const reqAbilities = await this.abilityRepository.findOneBy({
                id: ability
            });
            allAbilities.push(reqAbilities);
        }

        const allTypes: any = [];

        for (const type of types) {
            const reqTypes = await this.typeRepository.findOneBy({ id: type });
            allTypes.push(reqTypes);
        }

        const newPokemon = this.pokemonRepository.create({
            name,
            abilities: allAbilities,
            types: allTypes,
            sprites
        });

        const savedPokemon = await this.pokemonRepository.save(newPokemon);
        return savedPokemon.id;
    }

    async updateName(name: string, pokemon: string) {
        const query = this.buildFindPokemonQuery(pokemon);
        await this.findPokemonByNameOrId(query);

        await this.pokemonRepository.update(query, {
            name: name
        });
    }

    async updateAbilities(abilities: number[], pokemon: string) {
        const query = this.buildFindPokemonQuery(pokemon);
        const result = await this.findPokemonByNameOrId(query);

        const allAbilities: any = [];
        for (const ability of abilities) {
            const reqAbilities = await this.abilityRepository.findOneBy({
                id: ability
            });
            allAbilities.push(reqAbilities);
        }

        result.abilities = allAbilities;

        await this.pokemonRepository.save(result);
    }

    async updateTypes(types: number[], pokemon: string) {
        const query = this.buildFindPokemonQuery(pokemon);
        const result = await this.findPokemonByNameOrId(query);

        const allTypes: any = [];
        for (const type of types) {
            const reqTypes = await this.typeRepository.findOneBy({ id: type });
            allTypes.push(reqTypes);
        }

        result.types = allTypes;

        await this.pokemonRepository.save(result);
    }

    async updateSprites(sprites: SpriteEntity[], pokemon: string) {
        const query = this.buildFindPokemonQuery(pokemon);
        const result = await this.findPokemonByNameOrId(query);

        for (const sprite of sprites) {
            const checkSprite = await this.spriteRepository.findOneBy({
                img: sprite.img
            });

            if (checkSprite) {
                throw new BadRequestError("IMG already exist");
            }
        }

        result.sprites = sprites;

        await this.pokemonRepository.save(result);
        await this.spriteRepository.delete({ pokemon: IsNull() });
    }

    async delete(pokemon: string) {
        const query = this.buildFindPokemonQuery(pokemon);
        await this.findPokemonByNameOrId(query);

        await this.pokemonRepository.delete(query);
    }

    buildFindPokemonQuery(pokemon: string): QueryParameter {
        if (!isNaN(+pokemon)) {
            return { id: Number(pokemon) };
        }

        return { name: pokemon };
    }

    async findPokemonByNameOrId(query: QueryParameter): Promise<PokemonEntity> {
        const result = await this.pokemonRepository.findOneBy(query);

        if (!result) {
            throw new NotFoundError("Pokemon not found");
        }

        return result;
    }
}
