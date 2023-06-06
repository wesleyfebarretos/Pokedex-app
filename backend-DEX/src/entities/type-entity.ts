import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PokemonEntity } from "./pokemon-entity";

@Entity({ name: "type" })
export class TypeEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "name" })
    name: string;

    @ManyToMany(() => PokemonEntity, pokemon => pokemon.types)
    pokemons: PokemonEntity[];
}
