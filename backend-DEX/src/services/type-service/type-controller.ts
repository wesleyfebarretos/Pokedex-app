import { Request, Response } from "express";
import { TypeService } from "./type-service";

export class TypeController {
    constructor(private typeService: TypeService) {
        this.typeService = typeService;
    }

    getAll = async (_: Request, res: Response) => {
        const result = await this.typeService.getAll();

        res.json(result);
    };

    getOne = async (req: Request, res: Response) => {
        const { type } = req.params;

        const result = await this.typeService.getOne(type);

        res.json(result);
    };
}
