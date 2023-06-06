import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PokemonEntity } from "./pokemon-entity";

@Entity({ name: "sprite" })
export class SpriteEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "img", unique: true, nullable: true })
    img: string;

    @Column({ name: "name" })
    name: string;

    @ManyToOne(() => PokemonEntity, pokemon => pokemon.sprites, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    pokemon: PokemonEntity;
}
