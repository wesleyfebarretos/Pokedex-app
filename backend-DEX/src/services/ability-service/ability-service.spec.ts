import { AbilityEntity } from "../../entities/ability-entity";
import { NotFoundError } from "../../helpers/api-errors";
import { abilityRepository } from "../../repositories/abilities-repository";
import { AbilityService } from "./ability-service";

jest.mock("../../repositories/abilities-repository");

describe("Ability Service Test", () => {
    let abilityService: AbilityService;
    let mockedAbility: AbilityEntity;
    let mockedAbility2: AbilityEntity;

    beforeAll(() => {
        abilityService = new AbilityService(abilityRepository);
        mockedAbility = {
            id: 1,
            name: "teste",
            isHidden: true,
            pokemons: []
        };
        mockedAbility2 = {
            id: 2,
            name: "teste2",
            isHidden: true,
            pokemons: []
        };
    });

    it("should be able to get all abilities", async () => {
        const findMethod = abilityRepository.find as jest.MockedFunction<typeof abilityRepository.find>;

        findMethod.mockImplementation(() => Promise.resolve([mockedAbility, mockedAbility2]));

        const result = await abilityService.getAll();

        expect(result).toEqual([mockedAbility, mockedAbility2]);
        expect(findMethod).toBeCalledWith({
            order: {
                id: "ASC"
            }
        });
    });

    it("should be able to get a ability", async () => {
        const findOneMethod = abilityRepository.findOne as jest.MockedFunction<typeof abilityRepository.findOne>;

        findOneMethod.mockImplementation(() => Promise.resolve(mockedAbility));

        const result = await abilityService.getOne(mockedAbility.name);

        expect(result).toEqual(mockedAbility);
        expect(findOneMethod).toBeCalledWith({
            where: { name: mockedAbility.name },
            relations: { pokemons: true },
            order: {
                pokemons: { id: "ASC" }
            }
        });
    });

    it("should not be able to get a ability", async () => {
        const findOneMethod = abilityRepository.findOne as jest.MockedFunction<typeof abilityRepository.findOne>;

        findOneMethod.mockImplementation(() => Promise.resolve(null));

        expect(async () => {
            return await abilityService.getOne("1");
        }).rejects.toThrow(new NotFoundError("Ability not found"));
    });
});
