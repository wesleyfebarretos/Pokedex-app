import "reflect-metadata";
import { DataSource } from "typeorm";
import { AbilityEntity } from "./entities/ability-entity";
import { PokemonEntity } from "./entities/pokemon-entity";
import { SpriteEntity } from "./entities/sprite-entity";
import { TypeEntity } from "./entities/type-entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: false,
    logging: false,
    entities: [PokemonEntity, AbilityEntity, SpriteEntity, TypeEntity],
    subscribers: [],
    migrations: ["./src/migratios/*.ts"]
});
