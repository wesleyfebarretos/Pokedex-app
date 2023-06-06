import { Router } from "express";
import { typeRepository } from "../repositories/types-repository";
import { TypeController } from "../services/type-service/type-controller";
import { TypeService } from "../services/type-service/type-service";

export const typeRouter = Router();
const typeService = new TypeService(typeRepository);
const typeController = new TypeController(typeService);

typeRouter.get("", typeController.getAll);
typeRouter.get("/:type", typeController.getOne);
