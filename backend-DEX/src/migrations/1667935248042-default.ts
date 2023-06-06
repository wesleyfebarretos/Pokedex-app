import { MigrationInterface, QueryRunner } from "typeorm";

export class default1667935248042 implements MigrationInterface {
    name = "default1667935248042";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "sprite" DROP CONSTRAINT "FK_ee2a4e1b57db5392145fe6eefbd"');
        await queryRunner.query(
            'ALTER TABLE "sprite" ADD CONSTRAINT "FK_ee2a4e1b57db5392145fe6eefbd" FOREIGN KEY ("pokemonId") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "sprite" DROP CONSTRAINT "FK_ee2a4e1b57db5392145fe6eefbd"');
        await queryRunner.query(
            'ALTER TABLE "sprite" ADD CONSTRAINT "FK_ee2a4e1b57db5392145fe6eefbd" FOREIGN KEY ("pokemonId") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
        );
    }
}
