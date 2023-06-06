import { Request, Response } from "express";
import { AbilityService } from "./ability-service";

export class AbilityController {
    constructor(private abilityService: AbilityService) {
        this.abilityService = abilityService;
    }

    getAll = async (_: Request, res: Response) => {
        const result = await this.abilityService.getAll();
        res.json(result);
    };

    getOne = async (req: Request, res: Response) => {
        const { ability } = req.params;

        const result = await this.abilityService.getOne(ability);
        res.json(result);
    };
}
