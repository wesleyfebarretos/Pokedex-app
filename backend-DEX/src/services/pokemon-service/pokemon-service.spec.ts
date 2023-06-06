import { PokemonEntity } from "../../entities/pokemon-entity";
import { BadRequestError, NotFoundError } from "../../helpers/api-errors";
import { abilityRepository } from "../../repositories/abilities-repository";
import { pokemonRepository } from "../../repositories/pokemon-repository";
import { spriteRepository } from "../../repositories/sprite-reposository";
import { typeRepository } from "../../repositories/types-repository";
import { PokemonService } from "./pokemon-service";

jest.mock("../../repositories/pokemon-repository");
jest.mock("../../repositories/abilities-repository");
jest.mock("../../repositories/types-repository");
jest.mock("../../repositories/sprite-reposository");

describe("Pokemon Service Test", () => {
    let pokemonService: PokemonService;
    let poke1: PokemonEntity;
    let poke2: PokemonEntity;

    beforeAll(() => {
        pokemonService = new PokemonService(pokemonRepository, typeRepository, abilityRepository, spriteRepository);
        poke1 = {
            id: 1,
            name: "poke1",
            abilities: [],
            sprites: [],
            types: []
        };
        poke2 = {
            id: 2,
            name: "poke2",
            abilities: [],
            sprites: [],
            types: []
        };
    });

    describe("CREATE", () => {
        it("should be able to create a pokemon", async () => {
            const abilities = [1, 2];
            const types = [1, 2];
            const sprites = [
                { id: 1, img: "a.com.br", name: "front_default", pokemon: poke1 },
                { id: 2, img: "b.com.br", name: "front_shiny", pokemon: poke1 },
                { id: 3, img: "c.com.br", name: "back_default", pokemon: poke1 },
                { id: 4, img: "d.com.br", name: "back_shiny", pokemon: poke1 }
            ];

            const findOneMethod = pokemonRepository.findOne as jest.MockedFunction<typeof pokemonRepository.findOne>;

            const spriteFindOneMethod = spriteRepository.findOne as jest.MockedFunction<typeof spriteRepository.findOne>;

            const abilityFindOneByMethod = abilityRepository.findOneBy as jest.MockedFunction<typeof abilityRepository.findOneBy>;

            const typeFindOneByMethod = typeRepository.findOneBy as jest.MockedFunction<typeof typeRepository.findOneBy>;

            const createMethod = (pokemonRepository.create as jest.MockedFunction<typeof pokemonRepository.create>).mockReturnValue({
                id: 1,
                name: "TestPokemonName",
                abilities: [],
                types: [],
                sprites
            });

            const saveMethod = (pokemonRepository.save as jest.MockedFunction<typeof pokemonRepository.save>).mockImplementation(() =>
                Promise.resolve({
                    id: 1,
                    name: "TestPokemonName",
                    abilities: [],
                    types: [],
                    sprites
                })
            );

            await pokemonService.create("TestPokemonName", abilities, types, sprites);

            expect(findOneMethod).toBeCalledWith({
                where: { name: "TestPokemonName" },
                relations: { abilities: true, types: true, sprites: true }
            });
            for (const sprite of sprites) {
                expect(spriteFindOneMethod).toBeCalledWith({
                    where: { img: sprite.img }
                });
            }
            for (const ability of abilities) {
                expect(abilityFindOneByMethod).toBeCalledWith({
                    id: ability
                });
            }
            for (const type of types) {
                expect(typeFindOneByMethod).toBeCalledWith({
                    id: type
                });
            }
            expect(createMethod).toBeCalledWith({
                name: "TestPokemonName",
                abilities: [],
                types: [],
                sprites
            });
            expect(saveMethod).toBeCalledWith({
                id: 1,
                name: "TestPokemonName",
                abilities: [],
                types: [],
                sprites
            });
        });

        it("should be not able to create a pokemon because already exist", async () => {
            const findOneMethod = pokemonRepository.findOne as jest.MockedFunction<typeof pokemonRepository.findOne>;
            findOneMethod.mockImplementation(() => Promise.resolve(poke1));

            await expect(pokemonService.create("test", [], [], [])).rejects.toThrow(new BadRequestError(`Pokemon ${poke1.name} already exist`));
        });

        it("should be not able to create a pokemon because abilities is equal to 0 or greater than 3", async () => {
            const findOneMethod = pokemonRepository.findOne as jest.MockedFunction<typeof pokemonRepository.findOne>;
            findOneMethod.mockImplementation(() => Promise.resolve(null));

            await expect(pokemonService.create("test", [1, 2, 3, 4], [], [])).rejects.toThrow(
                new BadRequestError("Add the abilities correctly, they cannot be equal to 0 or greater than 3")
            );
        });

        it("should be not able to create a pokemon because types is equal to 0 or greater than 2", async () => {
            const findOneMethod = pokemonRepository.findOne as jest.MockedFunction<typeof pokemonRepository.findOne>;
            findOneMethod.mockImplementation(() => Promise.resolve(null));

            await expect(pokemonService.create("test", [1, 2], [], [])).rejects.toThrow(
                new BadRequestError("Add the types correctly, they cannot be equal to 0 or greater than 2")
            );
        });

        it("should be not able to create a pokemon because sprites is equal to 0 or greater than 4", async () => {
            const findOneMethod = pokemonRepository.findOne as jest.MockedFunction<typeof pokemonRepository.findOne>;
            findOneMethod.mockImplementation(() => Promise.resolve(null));

            await expect(pokemonService.create("test", [1, 2], [1, 2], [])).rejects.toThrow(
                new BadRequestError("Add the sprites correctly, they cannot be equal to 0 or greater than 4")
            );
        });

        it("should be not able to create a pokemon because sprite.name is wrong", async () => {
            const sprites = [
                { id: 1, img: "a.com.br", name: "front_default", pokemon: poke1 },
                { id: 2, img: "b.com.br", name: "front_shiny", pokemon: poke1 },
                { id: 3, img: "c.com.br", name: "back_default", pokemon: poke1 },
                { id: 4, img: "d.com.br", name: "back_wrong", pokemon: poke1 }
            ];

            const findOneMethod = pokemonRepository.findOne as jest.MockedFunction<typeof pokemonRepository.findOne>;
            findOneMethod.mockImplementation(() => Promise.resolve(null));

            await expect(pokemonService.create("test", [1, 2], [1, 2], sprites)).rejects.toThrow(
                new BadRequestError("sprite.name only accepts values like: front_shiny/ back_shiny/ front_default/ back_default")
            );
        });

        it("should be not able to create a pokemon because sprite.img already exist", async () => {
            const sprites = [
                { id: 1, img: "a.com.br", name: "front_default", pokemon: poke1 },
                { id: 2, img: "a.com.br", name: "front_shiny", pokemon: poke1 },
                { id: 3, img: "c.com.br", name: "back_default", pokemon: poke1 },
                { id: 4, img: "d.com.br", name: "back_shiny", pokemon: poke1 }
            ];

            const findOneMethod = pokemonRepository.findOne as jest.MockedFunction<typeof pokemonRepository.findOne>;
            findOneMethod.mockImplementation(() => Promise.resolve(null));

            const spriteFindOneMethod = spriteRepository.findOne as jest.MockedFunction<typeof spriteRepository.findOne>;
            spriteFindOneMethod.mockImplementation(() => Promise.resolve(sprites[0]));

            await expect(pokemonService.create("test", [1, 2], [1, 2], sprites)).rejects.toThrow(new BadRequestError("img: a.com.br already exist"));
        });
    });

    describe("GET", () => {
        it("should be able to get all pokemons", async () => {
            const findMethod = (pokemonRepository.find as jest.MockedFunction<typeof pokemonRepository.find>).mockImplementation(() =>
                Promise.resolve([poke1, poke2])
            );

            const result = await pokemonService.getAll(0, 24);

            expect(result.results).toEqual([poke1, poke2]);
            expect(result.next).toBe("http://localhost:8080/pokemon?offset=24&limit=24");
            expect(findMethod).toBeCalledWith({
                order: {
                    id: "ASC"
                },
                relations: { abilities: true, types: true, sprites: true },
                skip: 0,
                take: 24
            });
        });

        it("should be able to get a pokemon", async () => {
            const findOneMethod = (pokemonRepository.findOne as jest.MockedFunction<typeof pokemonRepository.findOne>).mockImplementation(() =>
                Promise.resolve(poke1)
            );

            const result = await pokemonService.getOne(`${poke1.id}`);

            expect(findOneMethod).toBeCalledWith({
                where: { id: poke1.id },
                relations: { abilities: true, types: true, sprites: true }
            });
            expect(result).toEqual(poke1);
        });

        it("should be not able to get a pokemon", async () => {
            const findOneMethod = pokemonRepository.findOne as jest.MockedFunction<typeof pokemonRepository.findOne>;

            findOneMethod.mockImplementation(() => Promise.resolve(null));

            await expect(pokemonService.getOne("1")).rejects.toThrow(new NotFoundError("Pokemon not found"));
        });
    });

    describe("UPDATE", () => {
        it("should be able to update pokemon name", async () => {
            const updateMethod = pokemonRepository.update as jest.MockedFunction<typeof pokemonRepository.update>;

            const findOneByMethod = (pokemonRepository.findOneBy as jest.MockedFunction<typeof pokemonRepository.findOneBy>).mockImplementation(() =>
                Promise.resolve(poke1)
            );

            await pokemonService.updateName("NameChanged", poke1.name);

            expect(updateMethod).toBeCalledWith({ name: poke1.name }, { name: "NameChanged" });
            expect(findOneByMethod).toBeCalledWith({ name: poke1.name });
        });

        it("should be able to update pokemon abilities", async () => {
            const saveMethod = pokemonRepository.save as jest.MockedFunction<typeof pokemonRepository.save>;

            const findOneByMethod = (pokemonRepository.findOneBy as jest.MockedFunction<typeof pokemonRepository.findOneBy>).mockImplementation(() =>
                Promise.resolve(poke2)
            );

            const abilityFindOneByMethod = abilityRepository.findOneBy as jest.MockedFunction<typeof abilityRepository.findOneBy>;

            const abilities = [1, 2];

            await pokemonService.updateAbilities(abilities, poke2.name);

            expect(findOneByMethod).toBeCalledWith({ name: poke2.name });
            for (const ability of abilities) {
                expect(abilityFindOneByMethod).toBeCalledWith({ id: ability });
            }
            expect(saveMethod).toBeCalledWith(poke2);
        });

        it("should be able to update pokemon types", async () => {
            const saveMethod = pokemonRepository.save as jest.MockedFunction<typeof pokemonRepository.save>;

            const findOneByMethod = (pokemonRepository.findOneBy as jest.MockedFunction<typeof pokemonRepository.findOneBy>).mockImplementation(() =>
                Promise.resolve(poke1)
            );

            const typesFindOneByMethod = typeRepository.findOneBy as jest.MockedFunction<typeof typeRepository.findOneBy>;

            const types = [1, 2];

            await pokemonService.updateTypes(types, poke1.name);

            expect(findOneByMethod).toHaveBeenCalledWith({ name: poke1.name });
            for (const type of types) {
                expect(typesFindOneByMethod).toHaveBeenCalledWith({
                    id: type
                });
            }
            expect(saveMethod).toHaveBeenCalledWith(poke1);
        });

        it("should be able to update pokemon sprites", async () => {
            const saveMethod = pokemonRepository.save as jest.MockedFunction<typeof pokemonRepository.save>;

            const findOneByMethod = (pokemonRepository.findOneBy as jest.MockedFunction<typeof pokemonRepository.findOneBy>).mockImplementation(() =>
                Promise.resolve(poke1)
            );

            const spriteFindOneByMethod = spriteRepository.findOneBy as jest.MockedFunction<typeof spriteRepository.findOneBy>;

            const sprites = [
                { id: 1, img: "a.com.br", name: "front_default", pokemon: poke1 },
                { id: 2, img: "b.com.br", name: "front_shiny", pokemon: poke1 },
                { id: 3, img: "c.com.br", name: "back_default", pokemon: poke1 },
                { id: 4, img: "d.com.br", name: "back_shiny", pokemon: poke1 }
            ];

            await pokemonService.updateSprites(sprites, "3");

            expect(findOneByMethod).toHaveBeenCalledWith({ id: 3 });
            for (const sprite of sprites) {
                expect(spriteFindOneByMethod).toHaveBeenCalledWith({
                    img: sprite.img
                });
            }
            expect(saveMethod).toHaveBeenCalledWith(poke1);
        });

        it("should be not able to update pokemon name", async () => {
            const findOneByMethod = pokemonRepository.findOneBy as jest.MockedFunction<typeof pokemonRepository.findOneBy>;
            findOneByMethod.mockImplementation(() => Promise.resolve(null));

            await expect(pokemonService.updateName("whatever", poke1.name)).rejects.toThrow(new NotFoundError("Pokemon not found"));
        });

        it("should be not able to update pokemon abilities", async () => {
            const findOneByMethod = pokemonRepository.findOneBy as jest.MockedFunction<typeof pokemonRepository.findOneBy>;
            findOneByMethod.mockImplementation(() => Promise.resolve(null));

            await expect(pokemonService.updateAbilities([], poke1.name)).rejects.toThrow(new NotFoundError("Pokemon not found"));
        });

        it("should be not able to update pokemon types", async () => {
            const findOneByMethod = pokemonRepository.findOneBy as jest.MockedFunction<typeof pokemonRepository.findOneBy>;
            findOneByMethod.mockImplementation(() => Promise.resolve(null));

            await expect(pokemonService.updateTypes([], poke1.name)).rejects.toThrow(new NotFoundError("Pokemon not found"));
        });

        it("should be not able to update pokemon sprites", async () => {
            const findOneByMethod = pokemonRepository.findOneBy as jest.MockedFunction<typeof pokemonRepository.findOneBy>;
            findOneByMethod.mockImplementation(() => Promise.resolve(null));

            await expect(pokemonService.updateSprites([], poke1.name)).rejects.toThrow(new NotFoundError("Pokemon not found"));
        });
    });

    describe("DELETE", () => {
        it("should be able to delete a pokemon", async () => {
            const deleteMethod = pokemonRepository.delete as jest.MockedFunction<typeof pokemonRepository.delete>;

            const findOneByMethod = (pokemonRepository.findOneBy as jest.MockedFunction<typeof pokemonRepository.findOneBy>).mockImplementation(() =>
                Promise.resolve(poke1)
            );

            await pokemonService.delete("1");

            expect(findOneByMethod).toHaveBeenCalledWith({ id: 1 });
            expect(deleteMethod).toHaveBeenCalledWith({ id: 1 });
        });

        it("should not be able to delete a pokemon", async () => {
            const findOneByMethod = pokemonRepository.findOneBy as jest.MockedFunction<typeof pokemonRepository.findOneBy>;
            findOneByMethod.mockImplementation(() => Promise.resolve(null));

            await expect(pokemonService.delete(`${poke1.id}`)).rejects.toThrow(new NotFoundError("Pokemon not found"));
        });
    });
});
