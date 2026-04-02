/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddScreenshotAlt1775121224933 {
    name = 'AddScreenshotAlt1775121224933'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "software" ADD COLUMN "screenshots" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`
            UPDATE "software"
            SET "screenshots" = COALESCE(
                (SELECT jsonb_agg(jsonb_build_object('url', elem))
                 FROM unnest("screenshotUrls") AS elem),
                '[]'::jsonb
            )
        `);
        await queryRunner.query(`ALTER TABLE "software" DROP COLUMN "screenshotUrls"`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "software" ADD COLUMN "screenshotUrls" text[] NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`
            UPDATE "software"
            SET "screenshotUrls" = ARRAY(
                SELECT elem->>'url' FROM jsonb_array_elements("screenshots") AS elem
            )
        `);
        await queryRunner.query(`ALTER TABLE "software" DROP COLUMN "screenshots"`);
    }
}
