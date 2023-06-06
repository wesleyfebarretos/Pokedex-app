import { Router } from "express";
import { abilityRepository } from "../repositories/abilities-repository";
import { AbilityController } from "../services/ability-service/ability-controller";
import { AbilityService } from "../services/ability-service/ability-service";

export const abilityRouter = Router();
const abilityService = new AbilityService(abilityRepository);
const abilityController = new AbilityController(abilityService);

abilityRouter.get("", abilityController.getAll);
abilityRouter.get("/:ability", abilityController.getOne);
