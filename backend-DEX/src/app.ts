import cors from "cors";
import "dotenv/config";
import express, { Express } from "express";
import "express-async-errors";
import { AppDataSource } from "./data-source";
import { errorMiddleware } from "./middlewares/error-middlewares";
import { abilityRouter } from "./router/ability-router";
import { pokemonRouter } from "./router/pokemon-router";
import { typeRouter } from "./router/type-router";

export async function setup(): Promise<Express> {
    await AppDataSource.initialize();
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use("/pokemon", pokemonRouter);
    app.use("/type", typeRouter);
    app.use("/ability", abilityRouter);
    app.use(errorMiddleware);

    return app;
}
