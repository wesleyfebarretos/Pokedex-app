import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PokemonService } from "./pokemon-service";

export class PokemonController {
    constructor(private pokemonService: PokemonService) {
        this.pokemonService = pokemonService;
    }

    getAll = async (req: Request, res: Response) => {
        const offset = Number(req.query.offset) || 0;
        const limit = Number(req.query.limit) || 24;

        const result = await this.pokemonService.getAll(offset, limit);

        res.json(result);
    };

    getOne = async (req: Request, res: Response) => {
        const { pokemon } = req.params;

        const result = await this.pokemonService.getOne(pokemon);

        res.json(result);
    };

    create = async (req: Request, res: Response) => {
        const { name, abilities, types, sprites } = req.body;

        const result = await this.pokemonService.create(name, abilities, types, sprites);

        res.status(StatusCodes.CREATED).json({
            id: result,
            message: `New pokemon ${name} created successfully`
        });
    };

    updateName = async (req: Request, res: Response) => {
        const { name } = req.body;
        const { pokemon } = req.params;

        await this.pokemonService.updateName(name, pokemon);

        res.json({ message: `Pokemon ${pokemon} successfully updated` });
    };

    updateAbilities = async (req: Request, res: Response) => {
        const { abilities } = req.body;
        const { pokemon } = req.params;

        await this.pokemonService.updateAbilities(abilities, pokemon);

        res.json({ message: `Pokemon ${pokemon} successfully updated` });
    };

    updateTypes = async (req: Request, res: Response) => {
        const { types } = req.body;
        const { pokemon } = req.params;

        await this.pokemonService.updateTypes(types, pokemon);

        res.json({ message: `Pokemon ${pokemon} successfully updated` });
    };

    updateSprites = async (req: Request, res: Response) => {
        const { sprites } = req.body;
        const { pokemon } = req.params;

        await this.pokemonService.updateSprites(sprites, pokemon);

        res.json({ message: `Pokemon ${pokemon} successfully updated` });
    };

    delete = async (req: Request, res: Response) => {
        const { pokemon } = req.params;

        await this.pokemonService.delete(pokemon);

        res.status(StatusCodes.NO_CONTENT).send();
    };
}
