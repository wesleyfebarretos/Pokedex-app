import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PokemonEntity } from "./pokemon-entity";

@Entity({ name: "ability" })
export class AbilityEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "is_hidden" })
    isHidden: boolean;

    @ManyToMany(() => PokemonEntity, pokemon => pokemon.abilities)
    pokemons: PokemonEntity[];
}
