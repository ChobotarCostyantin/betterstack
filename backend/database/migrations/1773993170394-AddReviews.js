/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class RemoveFullDescription1773993170394 {
    name = 'RemoveFullDescription1773993170394'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "software_comparison_reviews" ("id" SERIAL NOT NULL, "softwareSlugA" character varying NOT NULL, "softwareSlugB" character varying NOT NULL, "content" text NOT NULL, "authorDetailsId" integer NOT NULL, CONSTRAINT "UQ_9d929cf160118ad8c88ffb12af3" UNIQUE ("softwareSlugA", "softwareSlugB"), CONSTRAINT "PK_ff216e02f6541d3604b81fbeeec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "author_details" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "fullName" character varying NOT NULL, "bio" text NOT NULL, "avatarUrl" character varying, "websiteUrl" character varying, CONSTRAINT "REL_7c6ad68b7aea460b4c4e6dd5dd" UNIQUE ("userId"), CONSTRAINT "PK_4d89a641b20091fdfaef122a997" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "software_reviews" ("id" SERIAL NOT NULL, "softwareSlug" character varying NOT NULL, "content" text NOT NULL, "authorDetailsId" integer NOT NULL, CONSTRAINT "UQ_3ef37eeef2d7eccce43481de989" UNIQUE ("softwareSlug"), CONSTRAINT "PK_f2c6aa9aed0efddd23f4ccac565" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "software" DROP COLUMN "fullDescription"`);
        await queryRunner.query(`ALTER TABLE "software_comparison_reviews" ADD CONSTRAINT "FK_73d179e493fca7084b708d3cb3d" FOREIGN KEY ("authorDetailsId") REFERENCES "author_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "author_details" ADD CONSTRAINT "FK_7c6ad68b7aea460b4c4e6dd5dd2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "software_reviews" ADD CONSTRAINT "FK_416d45fb982789c47b27583da03" FOREIGN KEY ("authorDetailsId") REFERENCES "author_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "software_reviews" DROP CONSTRAINT "FK_416d45fb982789c47b27583da03"`);
        await queryRunner.query(`ALTER TABLE "author_details" DROP CONSTRAINT "FK_7c6ad68b7aea460b4c4e6dd5dd2"`);
        await queryRunner.query(`ALTER TABLE "software_comparison_reviews" DROP CONSTRAINT "FK_73d179e493fca7084b708d3cb3d"`);
        await queryRunner.query(`ALTER TABLE "software" ADD "fullDescription" text`);
        await queryRunner.query(`DROP TABLE "software_reviews"`);
        await queryRunner.query(`DROP TABLE "author_details"`);
        await queryRunner.query(`DROP TABLE "software_comparison_reviews"`);
    }
}
