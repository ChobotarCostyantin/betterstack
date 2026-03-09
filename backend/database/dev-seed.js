/**
 * Dev seed — populates the database with representative sample data for
 * local development and manual testing.
 *
 * Usage:
 *   npm run db:seed:dev
 *
 * Safe to re-run: skips any top-level entity that already exists (by unique
 * key) and only inserts what is missing, so it won't duplicate data.
 */

require('dotenv/config');
const { dataSource } = require('./data-source');

async function seed() {
    await dataSource.initialize();
    const qr = dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
        // ------------------------------------------------------------------ //
        // Factors
        // ------------------------------------------------------------------ //
        const factorRows = [
            {
                positiveVariant: 'Fast startup',
                negativeVariant: 'Slow startup',
            },
            {
                positiveVariant: 'Low memory usage',
                negativeVariant: 'High memory usage',
            },
            {
                positiveVariant: 'Good IntelliSense',
                negativeVariant: 'Poor IntelliSense',
            },
            {
                positiveVariant: 'Rich plugin ecosystem',
                negativeVariant: 'Limited plugins',
            },
            {
                positiveVariant: 'Free / open source',
                negativeVariant: 'Paid / proprietary',
            },
        ];

        const factors = [];
        for (const row of factorRows) {
            let factor = await qr.manager.findOneBy('factors', {
                positiveVariant: row.positiveVariant,
            });
            if (!factor) {
                const result = await qr.manager
                    .createQueryBuilder()
                    .insert()
                    .into('factors')
                    .values(row)
                    .returning('*')
                    .execute();
                factor = result.generatedMaps[0];
            }
            factors.push(factor);
        }

        const [fastStartup, lowMemory, goodIntellisense, richPlugins, freeOss] =
            factors;

        // ------------------------------------------------------------------ //
        // Metrics
        // ------------------------------------------------------------------ //
        const metricRows = [
            { name: 'Indexing time (s)', higherIsBetter: false },
            { name: 'Memory footprint (MB)', higherIsBetter: false },
            { name: 'GitHub stars', higherIsBetter: true },
            { name: 'Extensions count', higherIsBetter: true },
        ];

        const metrics = [];
        for (const row of metricRows) {
            let metric = await qr.manager.findOneBy('metrics', {
                name: row.name,
            });
            if (!metric) {
                const result = await qr.manager
                    .createQueryBuilder()
                    .insert()
                    .into('metrics')
                    .values(row)
                    .returning('*')
                    .execute();
                metric = result.generatedMaps[0];
            }
            metrics.push(metric);
        }

        const [indexingTime, memoryFootprint, githubStars, extensionsCount] =
            metrics;

        // ------------------------------------------------------------------ //
        // Categories
        // ------------------------------------------------------------------ //
        const categoryRows = [
            { slug: 'ides', name: 'IDEs & Editors' },
            { slug: 'databases', name: 'Database Clients' },
            { slug: 'languages', name: 'Programming Languages' },
        ];

        const categories = [];
        for (const row of categoryRows) {
            let category = await qr.manager.findOneBy('categories', {
                slug: row.slug,
            });
            if (!category) {
                const result = await qr.manager
                    .createQueryBuilder()
                    .insert()
                    .into('categories')
                    .values(row)
                    .returning('*')
                    .execute();
                category = result.generatedMaps[0];
            }
            categories.push(category);
        }

        const [idesCategory] = categories;

        // Assign factors and metrics to the IDEs category
        for (const factor of [
            fastStartup,
            lowMemory,
            goodIntellisense,
            richPlugins,
            freeOss,
        ]) {
            const exists = await qr.manager.query(
                `SELECT 1 FROM category_factors WHERE category_id = $1 AND factor_id = $2`,
                [idesCategory.id, factor.id],
            );
            if (!exists.length) {
                await qr.manager.query(
                    `INSERT INTO category_factors (category_id, factor_id) VALUES ($1, $2)`,
                    [idesCategory.id, factor.id],
                );
            }
        }

        for (const metric of [
            indexingTime,
            memoryFootprint,
            githubStars,
            extensionsCount,
        ]) {
            const exists = await qr.manager.query(
                `SELECT 1 FROM category_metrics WHERE category_id = $1 AND metric_id = $2`,
                [idesCategory.id, metric.id],
            );
            if (!exists.length) {
                await qr.manager.query(
                    `INSERT INTO category_metrics (category_id, metric_id) VALUES ($1, $2)`,
                    [idesCategory.id, metric.id],
                );
            }
        }

        // ------------------------------------------------------------------ //
        // Software
        // ------------------------------------------------------------------ //
        const softwareRows = [
            {
                slug: 'jetbrains-rider',
                name: 'JetBrains Rider',
                developer: 'JetBrains',
                shortDescription: 'The cross-platform .NET IDE.',
                fullDescription:
                    '## Overview\nRider is an excellent choice for .NET developers.',
                websiteUrl: 'https://jetbrains.com/rider',
                screenshotUrls: [],
            },
            {
                slug: 'visual-studio-code',
                name: 'Visual Studio Code',
                developer: 'Microsoft',
                shortDescription: 'The code editor.',
                logoUrl:
                    'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg',
                websiteUrl: 'https://code.visualstudio.com/',
                screenshotUrls: [],
            },
        ];

        const softwareItems = [];
        for (const row of softwareRows) {
            let sw = await qr.manager.findOneBy('software', { slug: row.slug });
            if (!sw) {
                const result = await qr.manager
                    .createQueryBuilder()
                    .insert()
                    .into('software')
                    .values(row)
                    .returning('*')
                    .execute();
                sw = result.generatedMaps[0];
            }
            softwareItems.push(sw);
        }

        const [rider, vscode] = softwareItems;

        // Link software → IDEs category
        for (const sw of [rider, vscode]) {
            const exists = await qr.manager.query(
                `SELECT 1 FROM software_categories WHERE software_id = $1 AND category_id = $2`,
                [sw.id, idesCategory.id],
            );
            if (!exists.length) {
                await qr.manager.query(
                    `INSERT INTO software_categories (software_id, category_id) VALUES ($1, $2)`,
                    [sw.id, idesCategory.id],
                );
            }
        }

        // ------------------------------------------------------------------ //
        // SoftwareFactors
        // ------------------------------------------------------------------ //
        const softwareFactorRows = [
            // Rider
            {
                softwareId: rider.id,
                factorId: goodIntellisense.id,
                factorName: goodIntellisense.positiveVariant,
                isPositive: true,
            },
            {
                softwareId: rider.id,
                factorId: richPlugins.id,
                factorName: richPlugins.negativeVariant,
                isPositive: false,
            },
            {
                softwareId: rider.id,
                factorId: freeOss.id,
                factorName: freeOss.negativeVariant,
                isPositive: false,
            },
            // VS Code
            {
                softwareId: vscode.id,
                factorId: fastStartup.id,
                factorName: fastStartup.positiveVariant,
                isPositive: true,
            },
            {
                softwareId: vscode.id,
                factorId: lowMemory.id,
                factorName: lowMemory.negativeVariant,
                isPositive: false,
            },
            {
                softwareId: vscode.id,
                factorId: richPlugins.id,
                factorName: richPlugins.positiveVariant,
                isPositive: true,
            },
            {
                softwareId: vscode.id,
                factorId: freeOss.id,
                factorName: freeOss.positiveVariant,
                isPositive: true,
            },
        ];

        for (const row of softwareFactorRows) {
            const exists = await qr.manager.query(
                `SELECT 1 FROM software_factors WHERE software_id = $1 AND factor_id = $2`,
                [row.softwareId, row.factorId],
            );
            if (!exists.length) {
                await qr.manager.query(
                    `INSERT INTO software_factors (software_id, factor_id, "factorName", "isPositive") VALUES ($1, $2, $3, $4)`,
                    [
                        row.softwareId,
                        row.factorId,
                        row.factorName,
                        row.isPositive,
                    ],
                );
            }
        }

        // ------------------------------------------------------------------ //
        // SoftwareMetrics
        // ------------------------------------------------------------------ //
        const softwareMetricRows = [
            // Rider
            {
                softwareId: rider.id,
                metricId: indexingTime.id,
                metricName: indexingTime.name,
                value: 12.4,
            },
            {
                softwareId: rider.id,
                metricId: memoryFootprint.id,
                metricName: memoryFootprint.name,
                value: 820,
            },
            {
                softwareId: rider.id,
                metricId: githubStars.id,
                metricName: githubStars.name,
                value: 0,
            },
            // VS Code
            {
                softwareId: vscode.id,
                metricId: indexingTime.id,
                metricName: indexingTime.name,
                value: 3.1,
            },
            {
                softwareId: vscode.id,
                metricId: memoryFootprint.id,
                metricName: memoryFootprint.name,
                value: 310,
            },
            {
                softwareId: vscode.id,
                metricId: githubStars.id,
                metricName: githubStars.name,
                value: 165000,
            },
            {
                softwareId: vscode.id,
                metricId: extensionsCount.id,
                metricName: extensionsCount.name,
                value: 50000,
            },
        ];

        for (const row of softwareMetricRows) {
            const exists = await qr.manager.query(
                `SELECT 1 FROM software_metrics WHERE software_id = $1 AND metric_id = $2`,
                [row.softwareId, row.metricId],
            );
            if (!exists.length) {
                await qr.manager.query(
                    `INSERT INTO software_metrics (software_id, metric_id, "metricName", value) VALUES ($1, $2, $3, $4)`,
                    [row.softwareId, row.metricId, row.metricName, row.value],
                );
            }
        }

        await qr.commitTransaction();
        console.log('Dev seed completed successfully.');
    } catch (err) {
        await qr.rollbackTransaction();
        console.error('Dev seed failed, transaction rolled back:', err);
        process.exit(1);
    } finally {
        await qr.release();
        await dataSource.destroy();
    }
}

seed();
