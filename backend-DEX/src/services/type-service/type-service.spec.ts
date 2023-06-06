import { TypeEntity } from "../../entities/type-entity";
import { NotFoundError } from "../../helpers/api-errors";
import { typeRepository } from "../../repositories/types-repository";
import { TypeService } from "./type-service";

jest.mock("../../repositories/types-repository");

describe("Test Service Test", () => {
    let typeService: TypeService;
    let mockedType: TypeEntity;
    let mockedType2: TypeEntity;
    let mockedType3: TypeEntity;

    beforeAll(() => {
        typeService = new TypeService(typeRepository);
        mockedType = {
            id: 1,
            name: "grass",
            pokemons: []
        };
        mockedType2 = {
            id: 2,
            name: "poison",
            pokemons: []
        };
        mockedType3 = {
            id: 3,
            name: "water",
            pokemons: []
        };
    });

    it("should be able to get all types", async () => {
        const findMethod = typeRepository.find as jest.MockedFunction<typeof typeRepository.find>;

        findMethod.mockImplementation(() => Promise.resolve([mockedType, mockedType2, mockedType3]));

        const result = await typeService.getAll();

        expect(result).toEqual([mockedType, mockedType2, mockedType3]);
        expect(findMethod).toBeCalledWith({
            order: {
                id: "ASC"
            }
        });
    });

    it("should be able to get a type", async () => {
        const findOneMethod = typeRepository.findOne as jest.MockedFunction<typeof typeRepository.findOne>;

        findOneMethod.mockImplementation(() => Promise.resolve(mockedType));

        const result = await typeService.getOne(`${mockedType.id}`);

        expect(result).toEqual(mockedType);
        expect(findOneMethod).toBeCalledWith({
            where: { id: mockedType.id },
            relations: { pokemons: true },
            order: {
                pokemons: { id: "ASC" }
            }
        });
    });

    it("should not be able to get a type", async () => {
        const findOneMethod = typeRepository.findOne as jest.MockedFunction<typeof typeRepository.findOne>;

        findOneMethod.mockImplementation(() => Promise.resolve(null));

        expect(async () => {
            await typeService.getOne("1");
        }).rejects.toThrow(new NotFoundError("Type not found"));
    });
});
