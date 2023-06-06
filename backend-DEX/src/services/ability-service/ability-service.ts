import { Repository } from "typeorm";
import { AbilityEntity } from "../../entities/ability-entity";
import { NotFoundError } from "../../helpers/api-errors";

export class AbilityService {
    constructor(private abilityRepository: Repository<AbilityEntity>) {
        this.abilityRepository = abilityRepository;
    }

    async getAll(): Promise<AbilityEntity[]> {
        const result = await this.abilityRepository.find({
            order: {
                id: "ASC"
            }
        });
        return result;
    }

    async getOne(ability: string): Promise<AbilityEntity> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let param: any = { name: ability };

        if (!isNaN(+ability)) {
            param = { id: Number(ability) };
        }

        const result = await this.abilityRepository.findOne({
            where: param,
            relations: { pokemons: true },
            order: {
                pokemons: { id: "ASC" }
            }
        });
        if (!result) {
            throw new NotFoundError("Ability not found");
        }

        return result;
    }
}
