import { MigrationInterface, QueryRunner } from "typeorm";

export class default1664399359921 implements MigrationInterface {
    name = "default1664399359921";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static up: any;

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "ability" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "is_hidden" boolean NOT NULL, CONSTRAINT "PK_5643559d435d01ec126981417a2" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "sprite" ("id" SERIAL NOT NULL, "img" character varying, "name" character varying NOT NULL, "pokemonId" integer, CONSTRAINT "UQ_85bd67ab9fdf8a7ea3d5bc82ff7" UNIQUE ("img"), CONSTRAINT "PK_0c2ab4b884c704710daa4810b71" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_40410d6bf0bedb43f9cadae6fef" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "pokemon" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_0b503db1369f46c43f8da0a6a0a" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "pokemon_ability" ("pokemonId" integer NOT NULL, "abilityId" integer NOT NULL, CONSTRAINT "PK_89d255c168ac322786101427b2a" PRIMARY KEY ("pokemonId", "abilityId"))'
        );
        await queryRunner.query('CREATE INDEX "IDX_b9ac9776808218b4d101c1ac05" ON "pokemon_ability" ("pokemonId") ');
        await queryRunner.query('CREATE INDEX "IDX_3dcbd700cbbcb7743ca087c51f" ON "pokemon_ability" ("abilityId") ');
        await queryRunner.query(
            'CREATE TABLE "pokemon_type" ("pokemonId" integer NOT NULL, "typeId" integer NOT NULL, CONSTRAINT "PK_7b313bac0f72545d23b2658e436" PRIMARY KEY ("pokemonId", "typeId"))'
        );
        await queryRunner.query('CREATE INDEX "IDX_99e8337dbdbf13810886df23d4" ON "pokemon_type" ("pokemonId") ');
        await queryRunner.query('CREATE INDEX "IDX_39f167908aef55aaf04a0d0ec1" ON "pokemon_type" ("typeId") ');
        await queryRunner.query(
            'ALTER TABLE "sprite" ADD CONSTRAINT "FK_ee2a4e1b57db5392145fe6eefbd" FOREIGN KEY ("pokemonId") REFERENCES "pokemon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "pokemon_ability" ADD CONSTRAINT "FK_b9ac9776808218b4d101c1ac05a" FOREIGN KEY ("pokemonId") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE'
        );
        await queryRunner.query(
            'ALTER TABLE "pokemon_ability" ADD CONSTRAINT "FK_3dcbd700cbbcb7743ca087c51f1" FOREIGN KEY ("abilityId") REFERENCES "ability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "pokemon_type" ADD CONSTRAINT "FK_99e8337dbdbf13810886df23d4c" FOREIGN KEY ("pokemonId") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE'
        );
        await queryRunner.query(
            'ALTER TABLE "pokemon_type" ADD CONSTRAINT "FK_39f167908aef55aaf04a0d0ec1c" FOREIGN KEY ("typeId") REFERENCES "type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "pokemon_type" DROP CONSTRAINT "FK_39f167908aef55aaf04a0d0ec1c"');
        await queryRunner.query('ALTER TABLE "pokemon_type" DROP CONSTRAINT "FK_99e8337dbdbf13810886df23d4c"');
        await queryRunner.query('ALTER TABLE "pokemon_ability" DROP CONSTRAINT "FK_3dcbd700cbbcb7743ca087c51f1"');
        await queryRunner.query('ALTER TABLE "pokemon_ability" DROP CONSTRAINT "FK_b9ac9776808218b4d101c1ac05a"');
        await queryRunner.query('ALTER TABLE "sprite" DROP CONSTRAINT "FK_ee2a4e1b57db5392145fe6eefbd"');
        await queryRunner.query('DROP INDEX "public"."IDX_39f167908aef55aaf04a0d0ec1"');
        await queryRunner.query('DROP INDEX "public"."IDX_99e8337dbdbf13810886df23d4"');
        await queryRunner.query('DROP TABLE "pokemon_type"');
        await queryRunner.query('DROP INDEX "public"."IDX_3dcbd700cbbcb7743ca087c51f"');
        await queryRunner.query('DROP INDEX "public"."IDX_b9ac9776808218b4d101c1ac05"');
        await queryRunner.query('DROP TABLE "pokemon_ability"');
        await queryRunner.query('DROP TABLE "pokemon"');
        await queryRunner.query('DROP TABLE "type"');
        await queryRunner.query('DROP TABLE "sprite"');
        await queryRunner.query('DROP TABLE "ability"');
    }
}
