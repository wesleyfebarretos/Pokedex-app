import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbilityEntity } from "./ability-entity";
import { SpriteEntity } from "./sprite-entity";
import { TypeEntity } from "./type-entity";

@Entity({ name: "pokemon" })
export class PokemonEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "name" })
    name: string;

    @ManyToMany(() => AbilityEntity, ability => ability.pokemons, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    @JoinTable({ name: "pokemon_ability" })
    abilities: AbilityEntity[];

    @OneToMany(() => SpriteEntity, sprite => sprite.pokemon, { cascade: true })
    @JoinTable({ name: "pokemon_sprite" })
    sprites: SpriteEntity[];

    @ManyToMany(() => TypeEntity, type => type.pokemons, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    @JoinTable({ name: "pokemon_type" })
    types: TypeEntity[];
}
