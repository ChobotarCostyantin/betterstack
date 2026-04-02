/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class MoveProfileToUser1774002814837 {
    name = 'MoveProfileToUser1774002814837'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "software_reviews" DROP CONSTRAINT "FK_416d45fb982789c47b27583da03"`);
        await queryRunner.query(`ALTER TABLE "software_comparison_reviews" DROP CONSTRAINT "FK_73d179e493fca7084b708d3cb3d"`);
        
        await queryRunner.query(`ALTER TABLE "users" ADD "fullName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatarUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "websiteUrl" character varying`);

        await queryRunner.query(`
            UPDATE "users" u
            SET "fullName" = ad."fullName",
                "bio" = ad."bio",
                "avatarUrl" = ad."avatarUrl",
                "websiteUrl" = ad."websiteUrl"
            FROM "author_details" ad
            WHERE ad."userId" = u."id"
        `);
        
        await queryRunner.query(`ALTER TABLE "author_details" DROP CONSTRAINT "FK_7c6ad68b7aea460b4c4e6dd5dd2"`);
        await queryRunner.query(`DROP TABLE "author_details"`);

        await queryRunner.query(`ALTER TABLE "software_reviews" RENAME COLUMN "authorDetailsId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "software_comparison_reviews" RENAME COLUMN "authorDetailsId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "software_reviews" ADD CONSTRAINT "FK_c10404e4754e420163332bdc998" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "software_comparison_reviews" ADD CONSTRAINT "FK_4b82d69558f47bc28486b7d3052" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "software_comparison_reviews" DROP CONSTRAINT "FK_4b82d69558f47bc28486b7d3052"`);
        await queryRunner.query(`ALTER TABLE "software_reviews" DROP CONSTRAINT "FK_c10404e4754e420163332bdc998"`);
        await queryRunner.query(`ALTER TABLE "software_comparison_reviews" RENAME COLUMN "userId" TO "authorDetailsId"`);
        await queryRunner.query(`ALTER TABLE "software_reviews" RENAME COLUMN "userId" TO "authorDetailsId"`);
        
        await queryRunner.query(`CREATE TABLE "author_details" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "fullName" character varying NOT NULL, "bio" text NOT NULL, "avatarUrl" character varying, "websiteUrl" character varying, CONSTRAINT "REL_7c6ad68b7aea460b4c4e6dd5dd" UNIQUE ("userId"), CONSTRAINT "PK_4d89a641b20091fdfaef122a997" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "author_details" ADD CONSTRAINT "FK_7c6ad68b7aea460b4c4e6dd5dd2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`
            INSERT INTO "author_details" ("userId", "fullName", "bio", "avatarUrl", "websiteUrl")
            SELECT "id", "fullName", "bio", "avatarUrl", "websiteUrl"
            FROM "users"
            WHERE "fullName" IS NOT NULL OR "bio" IS NOT NULL
        `);

        await queryRunner.query(`ALTER TABLE "software_comparison_reviews" ADD CONSTRAINT "FK_73d179e493fca7084b708d3cb3d" FOREIGN KEY ("authorDetailsId") REFERENCES "author_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "software_reviews" ADD CONSTRAINT "FK_416d45fb982789c47b27583da03" FOREIGN KEY ("authorDetailsId") REFERENCES "author_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "websiteUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
    }
}
