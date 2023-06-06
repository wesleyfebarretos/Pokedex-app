import { Express } from "express";
import { StatusCodes } from "http-status-codes";
import request, { SuperTest, Test } from "supertest";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { setup } from "../../app";
import { AppDataSource } from "../../data-source";
import { AbilityEntity } from "../../entities/ability-entity";
import { PokemonEntity } from "../../entities/pokemon-entity";
import { TypeEntity } from "../../entities/type-entity";
import { abilityRepository } from "../../repositories/abilities-repository";
import { pokemonRepository } from "../../repositories/pokemon-repository";
import { typeRepository } from "../../repositories/types-repository";
import { PaginateObject } from "../../services/pokemon-service/pokemon-service";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe("Pokemon Controller", () => {
    let app: Express;
    let server: SuperTest<Test>;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let container: StartedTestContainer;
    jest.setTimeout(1000 * 180);
    beforeAll(async () => {
        //docker run --name some-postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres
        container = await new GenericContainer("postgres")
            .withEnvironment({
                POSTGRES_PASSWORD: "password"
            })
            .withExposedPorts({
                container: 5432,
                host: 5432
            })
            .start();

        await sleep(1000);
        app = await setup();
        server = request(app);
    });

    beforeEach(async () => {
        await AppDataSource.synchronize();
    });

    afterEach(async () => {
        await AppDataSource.dropDatabase();
    });

    describe("GET", () => {
        it("findAll", async () => {
            await createPokemon("testGetAll");
            const response = await server.get("/pokemon");
            const pokemonList: PaginateObject<PokemonEntity> = response.body;
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(pokemonList.next).toBe("http://localhost:8080/pokemon?offset=24&limit=24");
            expect(pokemonList.results.length).toBeGreaterThan(0);
        });

        it("findOneByName", async () => {
            const pokemon = await createPokemon("bulbasaur");
            const response = await serverGetPokemonResponse(pokemon.name);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.id).toBe(1);
            expect(response.body.name).toBe(pokemon.name);
            expect(response.body.types).toEqual([
                { id: 1, name: pokemon.types[0].name },
                { id: 2, name: pokemon.types[1].name }
            ]);
        });

        it("findOneById", async () => {
            const pokemon = await createPokemon("charizard");
            const response = await serverGetPokemonResponse(pokemon.id);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.id).toBe(pokemon.id);
            expect(response.body.name).toBe(pokemon.name);
            expect(response.body.types).toEqual([
                { id: 1, name: pokemon.types[0].name },
                { id: 2, name: pokemon.types[1].name }
            ]);
        });

        it("findOneError", async () => {
            const response = await serverGetPokemonResponse("stringToForceError");
            expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        });
    });

    describe("POST", () => {
        it("create", async () => {
            const ability1 = await createAbility("overgrow");
            const ability2 = await createAbility("fireball");
            const type1 = await createType("dark");
            const type2 = await createType("water");

            const response = await server.post("/pokemon").send({
                name: "davifodao",
                abilities: [ability1.id, ability2.id],
                types: [type1.id, type2.id],
                sprites: [
                    {
                        img: "aaaaaaa",
                        name: "back_default"
                    },
                    {
                        img: "aaaaaasdsda",
                        name: "back_shiny"
                    },
                    {
                        img: "ddddad",
                        name: "front_default"
                    },
                    {
                        img: "bbbabb",
                        name: "front_shiny"
                    }
                ]
            });
            const createdPokemon = await pokemonRepoFind("davifodao");
            expect(createdPokemon).toBeTruthy();
            expect(response.statusCode).toBe(StatusCodes.CREATED);
        });
    });

    describe("DELETE", () => {
        it("delete", async () => {
            const pokemon = await createPokemon("zertofodao");
            const response = await server.delete(`/pokemon/${pokemon.name}`);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
        });
    });

    describe("PUT", () => {
        it("updateName", async () => {
            const pokemon = await createPokemon("weslynfodao");

            const response = await server.put(`/pokemon/${pokemon.name}/name`).send({ name: "davifodao" });
            const createdPokemon = await pokemonRepoFind("davifodao");
            expect(createdPokemon).toBeTruthy();
            expect(response.status).toBe(StatusCodes.OK);
        });

        it("updateAbilities", async () => {
            const pokemon = await createPokemon("albegordura");
            const newAbility = await createAbility("firecover");

            const response = await server.put(`/pokemon/${pokemon.id}/abilities`).send({ abilities: [newAbility.id] });
            const createdPokemon = await pokemonRepoFind(pokemon.name);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(createdPokemon).toBeTruthy();
            expect(createdPokemon?.abilities[0].name).toBe(newAbility.name);
            expect(createdPokemon?.abilities.length).toBe(1);
        });

        it("updateTypes", async () => {
            const pokemon = await createPokemon("nngrotrosa");
            const newType = await createType("zertoOut");
            const newType2 = await createType("daviOut");

            const response = await server.put(`/pokemon/${pokemon.name}/types`).send({ types: [newType.id, newType2.id] });
            const createdPokemon = await pokemonRepoFind(pokemon.name);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(createPokemon).toBeTruthy();
            expect(createdPokemon?.types.length).toBe(2);
            expect(createdPokemon?.types[0].name).toBe(newType.name);
            expect(createdPokemon?.types[1].name).toBe(newType2.name);
        });

        it("updateSprites", async () => {
            const pokemon = await createPokemon("egirldozerto");

            const response = await server.put(`/pokemon/${pokemon.name}/sprites`).send({
                sprites: [
                    {
                        img: "goodzerto2",
                        name: "back_default"
                    },
                    {
                        img: "evilzerto2",
                        name: "back_shiny"
                    },
                    {
                        img: "goodDavi2",
                        name: "front_default"
                    },
                    {
                        img: "evilDavi2",
                        name: "front_shiny"
                    }
                ]
            });
            const createdPokemon = await pokemonRepoFind(pokemon.name);

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(createPokemon).toBeTruthy();
            expect(createdPokemon?.sprites.length).toBe(4);
            expect(createdPokemon?.sprites[0].img).toBe("goodzerto2");
            expect(createdPokemon?.sprites[1].img).toBe("evilzerto2");
            expect(createdPokemon?.sprites[2].img).toBe("goodDavi2");
            expect(createdPokemon?.sprites[3].img).toBe("evilDavi2");
        });
    });

    describe("Ability Controller", () => {
        describe("GET", () => {
            it("findAll", async () => {
                await createAbility("overgrow");
                await createAbility("regenerate");
                await createAbility("waterfall");

                const response = await server.get("/ability");
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.length).toBe(3);
            });

            it("findOneById", async () => {
                const ability = await createAbility("flash cannon");

                const response = await server.get(`/ability/${ability.id}`);
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.name).toEqual(ability.name);
                expect(response.body.id).toEqual(ability.id);
            });

            it("findOneByName", async () => {
                const ability = await createAbility("solar beam");

                const response = await server.get(`/ability/${ability.name}`);
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.isHidden).toEqual(ability.isHidden);
                expect(response.body.name).toEqual(ability.name);
                expect(response.body.id).toEqual(ability.id);
            });

            it("findOneError", async () => {
                const response = await server.get("/ability/kamehameha");
                expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
            });
        });
    });

    describe("Type Controller", () => {
        describe("GET", () => {
            it("findAll", async () => {
                await createType("water");
                await createType("fire");

                const response = await server.get("/type");
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.length).toBe(2);
            });

            it("findOneById", async () => {
                const type = await createType("dark");

                const response = await server.get(`/type/${type.id}`);
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.name).toBe(type.name);
                expect(response.body.id).toBe(type.id);
            });

            it("findOneByName", async () => {
                const type = await createType("fire");

                const response = await server.get(`/type/${type.name}`);
                expect(response.statusCode).toBe(StatusCodes.OK);
                expect(response.body.name).toBe(type.name);
                expect(response.body.id).toBe(type.id);
            });

            it("findOneError", async () => {
                const response = await server.get("/type/light");
                expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
            });
        });
    });

    async function createPokemon(name: string): Promise<PokemonEntity> {
        const ability1 = await createAbility("overgrow");
        const ability2 = await createAbility("fireball");

        const type1 = await createType("dark");
        const type2 = await createType("water");

        return await pokemonRepository.save({
            name: name,
            abilities: [ability1, ability2],
            types: [type1, type2],
            sprites: [
                {
                    img: "aaaaaaa",
                    name: "back_default"
                },
                {
                    img: "aaaaaasdsda",
                    name: "back_shiny"
                },
                {
                    img: "ddddad",
                    name: "front_default"
                },
                {
                    img: "bbbabb",
                    name: "front_shiny"
                }
            ]
        });
    }

    async function createAbility(name: string): Promise<AbilityEntity> {
        return await abilityRepository.save({
            name: name,
            isHidden: false
        });
    }

    async function createType(name: string): Promise<TypeEntity> {
        return await typeRepository.save({
            name: name
        });
    }

    async function serverGetPokemonResponse(path: string | number) {
        return await server.get(`/pokemon/${path}`);
    }

    async function pokemonRepoFind(nameQuery: string) {
        return await pokemonRepository.findOne({
            where: { name: nameQuery },
            relations: { abilities: true, types: true, sprites: true }
        });
    }
});
