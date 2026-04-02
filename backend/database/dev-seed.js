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
            {
                positiveVariant: 'Statically typed',
                negativeVariant: 'Dynamically typed',
            },
            {
                positiveVariant: 'Memory safe',
                negativeVariant: 'Manual memory management',
            },
            {
                positiveVariant: 'ACID compliant',
                negativeVariant: 'Eventual consistency',
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

        const [
            fastStartup,
            lowMemory,
            goodIntellisense,
            richPlugins,
            freeOss,
            statType,
            memSafe,
            acidComp
        ] = factors;

        // ------------------------------------------------------------------ //
        // Metrics
        // ------------------------------------------------------------------ //
        const metricRows = [
            { name: 'Indexing time (s)', higherIsBetter: false },
            { name: 'Memory footprint (MB)', higherIsBetter: false },
            { name: 'GitHub stars', higherIsBetter: true },
            { name: 'Extensions count', higherIsBetter: true },
            { name: 'Release year', higherIsBetter: false },
            { name: 'StackOverflow questions', higherIsBetter: true },
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

        const [
            indexingTime,
            memoryFootprint,
            githubStars,
            extensionsCount,
            releaseYear,
            soQuestions
        ] = metrics;

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

        const [idesCategory, databasesCategory, languagesCategory] = categories;

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

        for (const factor of [acidComp, freeOss]) {
            const exists = await qr.manager.query(
                `SELECT 1 FROM category_factors WHERE category_id = $1 AND factor_id = $2`,
                [databasesCategory.id, factor.id],
            );
            if (!exists.length) {
                await qr.manager.query(
                    `INSERT INTO category_factors (category_id, factor_id) VALUES ($1, $2)`,
                    [databasesCategory.id, factor.id],
                );
            }
        }

        for (const metric of [memoryFootprint, releaseYear, githubStars]) {
            const exists = await qr.manager.query(
                `SELECT 1 FROM category_metrics WHERE category_id = $1 AND metric_id = $2`,
                [databasesCategory.id, metric.id],
            );
            if (!exists.length) {
                await qr.manager.query(
                    `INSERT INTO category_metrics (category_id, metric_id) VALUES ($1, $2)`,
                    [databasesCategory.id, metric.id],
                );
            }
        }

        for (const factor of [statType, memSafe, freeOss]) {
            const exists = await qr.manager.query(
                `SELECT 1 FROM category_factors WHERE category_id = $1 AND factor_id = $2`,
                [languagesCategory.id, factor.id],
            );
            if (!exists.length) {
                await qr.manager.query(
                    `INSERT INTO category_factors (category_id, factor_id) VALUES ($1, $2)`,
                    [languagesCategory.id, factor.id],
                );
            }
        }

        for (const metric of [releaseYear, soQuestions, githubStars]) {
            const exists = await qr.manager.query(
                `SELECT 1 FROM category_metrics WHERE category_id = $1 AND metric_id = $2`,
                [languagesCategory.id, metric.id],
            );
            if (!exists.length) {
                await qr.manager.query(
                    `INSERT INTO category_metrics (category_id, metric_id) VALUES ($1, $2)`,
                    [languagesCategory.id, metric.id],
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
                logoUrl: 'https://www.vectorlogo.zone/logos/jetbrains/jetbrains-icon.svg',
                                websiteUrl: 'https://jetbrains.com/rider',
                screenshotUrls: [],
            },
            {
                slug: 'visual-studio-code',
                name: 'Visual Studio Code',
                developer: 'Microsoft',
                shortDescription: 'A highly customizable and popular code editor.',
                logoUrl: 'https://www.vectorlogo.zone/logos/visualstudio_code/visualstudio_code-icon.svg',
                                websiteUrl: 'https://code.visualstudio.com/',
                gitRepoUrl: 'https://github.com/microsoft/vscode',
                screenshotUrls: [
                    'https://code.visualstudio.com/assets/home/swimlane-customized.png',
                    'https://code.visualstudio.com/assets/home/swimlane-anywhere.png'
                ],
            },
            {
                slug: 'vim',
                name: 'Vim',
                developer: 'Bram Moolenaar',
                shortDescription: 'A highly configurable text editor built to make creating and changing any kind of text very efficient.',
                logoUrl: 'https://www.vectorlogo.zone/logos/vim/vim-icon.svg',
                                websiteUrl: 'https://www.vim.org/',
                gitRepoUrl: 'https://github.com/vim/vim',
                screenshotUrls: [
                    'https://geo-jobe.com/wp-content/uploads/2023/05/image2.gif',
                    'https://www.vim.org/images/0xbabaf000l.png'
                ],
            },
            {
                slug: 'postgresql',
                name: 'PostgreSQL',
                developer: 'PostgreSQL Global Development Group',
                shortDescription: 'The world\'s most advanced open source relational database.',
                logoUrl: 'https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg',
                                websiteUrl: 'https://www.postgresql.org/',
                gitRepoUrl: 'https://github.com/postgres/postgres',
                screenshotUrls: [],
            },
            {
                slug: 'redis',
                name: 'Redis',
                developer: 'Redis Ltd.',
                shortDescription: 'The open source, in-memory data store used as a database, cache, and message broker.',
                logoUrl: 'https://www.vectorlogo.zone/logos/redis/redis-icon.svg',
                                websiteUrl: 'https://redis.io/',
                gitRepoUrl: 'https://github.com/redis/redis',
                screenshotUrls: [],
            },
            {
                slug: 'mongodb',
                name: 'MongoDB',
                developer: 'MongoDB Inc.',
                shortDescription: 'A source-available cross-platform document-oriented database program.',
                logoUrl: 'https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg',
                                websiteUrl: 'https://www.mongodb.com/',
                gitRepoUrl: 'https://github.com/mongodb/mongo',
                screenshotUrls: [
                    'https://serverspace.io/wp-content/uploads/2023/12/main_page-2048x964.png',
                    'https://serverspace.io/wp-content/uploads/2023/12/main-tab-2048x320.png',
                    'https://serverspace.io/wp-content/uploads/2023/12/monitor-2048x1200.png',
                    'https://serverspace.io/wp-content/uploads/2023/12/connect-1-1-e1702836457328-2048x727.png'
                ],
            },
            {
                slug: 'mysql',
                name: 'MySQL',
                developer: 'Oracle Corporation',
                shortDescription: 'An open-source relational database management system.',
                logoUrl: 'https://www.vectorlogo.zone/logos/mysql/mysql-icon.svg',
                                websiteUrl: 'https://www.mysql.com/',
                gitRepoUrl: 'https://github.com/mysql/mysql-server',
                screenshotUrls: [],
            },
            {
                slug: 'python',
                name: 'Python',
                developer: 'Python Software Foundation',
                shortDescription: 'A programming language that lets you work quickly and integrate systems more effectively.',
                logoUrl: 'https://www.vectorlogo.zone/logos/python/python-icon.svg',
                                websiteUrl: 'https://www.python.org/',
                gitRepoUrl: 'https://github.com/python/cpython',
                screenshotUrls: [],
            },
            {
                slug: 'go',
                name: 'Go',
                developer: 'Google',
                shortDescription: 'An open source programming language supported by Google, built for simple, fast, and reliable software.',
                logoUrl: 'https://www.vectorlogo.zone/logos/golang/golang-icon.svg',
                                websiteUrl: 'https://go.dev/',
                gitRepoUrl: 'https://github.com/golang/go',
                screenshotUrls: [],
            },
            {
                slug: 'rust',
                name: 'Rust',
                developer: 'Rust Foundation',
                shortDescription: 'A language empowering everyone to build reliable and efficient software.',
                logoUrl: 'https://www.vectorlogo.zone/logos/rust-lang/rust-lang-icon.svg',
                                websiteUrl: 'https://www.rust-lang.org/',
                gitRepoUrl: 'https://github.com/rust-lang/rust',
                screenshotUrls: [],
            },
            {
                slug: 'typescript',
                name: 'TypeScript',
                developer: 'Microsoft',
                shortDescription: 'A strongly typed programming language that builds on JavaScript.',
                logoUrl: 'https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg',
                                websiteUrl: 'https://www.typescriptlang.org/',
                gitRepoUrl: 'https://github.com/microsoft/TypeScript',
                screenshotUrls: [],
            },
            {
                slug: 'javascript',
                name: 'JavaScript',
                developer: 'ECMA International',
                shortDescription: 'The programming language of the Web.',
                logoUrl: 'https://www.vectorlogo.zone/logos/javascript/javascript-icon.svg',
                                websiteUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
                screenshotUrls: [],
            }
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

        const [
            rider, vscode, vim, 
            postgresql, redis, mongodb, mysql, 
            python, go, rust, typescript, javascript
        ] = softwareItems;

        for (const sw of [rider, vscode, vim]) {
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

        for (const sw of [postgresql, redis, mongodb, mysql]) {
            const exists = await qr.manager.query(
                `SELECT 1 FROM software_categories WHERE software_id = $1 AND category_id = $2`,
                [sw.id, databasesCategory.id],
            );
            if (!exists.length) {
                await qr.manager.query(
                    `INSERT INTO software_categories (software_id, category_id) VALUES ($1, $2)`,
                    [sw.id, databasesCategory.id],
                );
            }
        }

        for (const sw of [python, go, rust, typescript, javascript]) {
            const exists = await qr.manager.query(
                `SELECT 1 FROM software_categories WHERE software_id = $1 AND category_id = $2`,
                [sw.id, languagesCategory.id],
            );
            if (!exists.length) {
                await qr.manager.query(
                    `INSERT INTO software_categories (software_id, category_id) VALUES ($1, $2)`,
                    [sw.id, languagesCategory.id],
                );
            }
        }

        // ------------------------------------------------------------------ //
        // SoftwareFactors
        // ------------------------------------------------------------------ //
        const softwareFactorRows = [
            // Rider
            { softwareId: rider.id, factorId: goodIntellisense.id, factorName: goodIntellisense.positiveVariant, isPositive: true },
            { softwareId: rider.id, factorId: richPlugins.id, factorName: richPlugins.negativeVariant, isPositive: false },
            { softwareId: rider.id, factorId: freeOss.id, factorName: freeOss.negativeVariant, isPositive: false },
            // VS Code
            { softwareId: vscode.id, factorId: fastStartup.id, factorName: fastStartup.positiveVariant, isPositive: true },
            { softwareId: vscode.id, factorId: lowMemory.id, factorName: lowMemory.negativeVariant, isPositive: false },
            { softwareId: vscode.id, factorId: richPlugins.id, factorName: richPlugins.positiveVariant, isPositive: true },
            { softwareId: vscode.id, factorId: freeOss.id, factorName: freeOss.positiveVariant, isPositive: true },
            // Vim
            { softwareId: vim.id, factorId: fastStartup.id, factorName: fastStartup.positiveVariant, isPositive: true },
            { softwareId: vim.id, factorId: lowMemory.id, factorName: lowMemory.positiveVariant, isPositive: true },
            { softwareId: vim.id, factorId: richPlugins.id, factorName: richPlugins.positiveVariant, isPositive: true },
            { softwareId: vim.id, factorId: freeOss.id, factorName: freeOss.positiveVariant, isPositive: true },
            // PostgreSQL
            { softwareId: postgresql.id, factorId: acidComp.id, factorName: acidComp.positiveVariant, isPositive: true },
            { softwareId: postgresql.id, factorId: freeOss.id, factorName: freeOss.positiveVariant, isPositive: true },
            // Redis
            { softwareId: redis.id, factorId: acidComp.id, factorName: acidComp.negativeVariant, isPositive: false },
            { softwareId: redis.id, factorId: freeOss.id, factorName: freeOss.positiveVariant, isPositive: true },
            // MongoDB
            { softwareId: mongodb.id, factorId: acidComp.id, factorName: acidComp.negativeVariant, isPositive: false },
            { softwareId: mongodb.id, factorId: freeOss.id, factorName: freeOss.positiveVariant, isPositive: true },
            // MySQL
            { softwareId: mysql.id, factorId: acidComp.id, factorName: acidComp.positiveVariant, isPositive: true },
            { softwareId: mysql.id, factorId: freeOss.id, factorName: freeOss.positiveVariant, isPositive: true },
            // Python
            { softwareId: python.id, factorId: statType.id, factorName: statType.negativeVariant, isPositive: false },
            { softwareId: python.id, factorId: memSafe.id, factorName: memSafe.positiveVariant, isPositive: true },
            { softwareId: python.id, factorId: freeOss.id, factorName: freeOss.positiveVariant, isPositive: true },
            // Go
            { softwareId: go.id, factorId: statType.id, factorName: statType.positiveVariant, isPositive: true },
            { softwareId: go.id, factorId: memSafe.id, factorName: memSafe.positiveVariant, isPositive: true },
            { softwareId: go.id, factorId: freeOss.id, factorName: freeOss.positiveVariant, isPositive: true },
            // Rust
            { softwareId: rust.id, factorId: statType.id, factorName: statType.positiveVariant, isPositive: true },
            { softwareId: rust.id, factorId: memSafe.id, factorName: memSafe.positiveVariant, isPositive: true },
            { softwareId: rust.id, factorId: freeOss.id, factorName: freeOss.positiveVariant, isPositive: true },
            // TypeScript
            { softwareId: typescript.id, factorId: statType.id, factorName: statType.positiveVariant, isPositive: true },
            { softwareId: typescript.id, factorId: memSafe.id, factorName: memSafe.positiveVariant, isPositive: true },
            { softwareId: typescript.id, factorId: freeOss.id, factorName: freeOss.positiveVariant, isPositive: true },
            // JavaScript
            { softwareId: javascript.id, factorId: statType.id, factorName: statType.negativeVariant, isPositive: false },
            { softwareId: javascript.id, factorId: memSafe.id, factorName: memSafe.positiveVariant, isPositive: true },
            { softwareId: javascript.id, factorId: freeOss.id, factorName: freeOss.positiveVariant, isPositive: true },
        ];

        for (const row of softwareFactorRows) {
            const exists = await qr.manager.query(
                `SELECT 1 FROM software_factors WHERE software_id = $1 AND factor_id = $2`,
                [row.softwareId, row.factorId],
            );
            if (!exists.length) {
                await qr.manager.query(
                    `INSERT INTO software_factors (software_id, factor_id, "factorName", "isPositive") VALUES ($1, $2, $3, $4)`,
                    [row.softwareId, row.factorId, row.factorName, row.isPositive],
                );
            }
        }

        // ------------------------------------------------------------------ //
        // SoftwareMetrics
        // ------------------------------------------------------------------ //
        const softwareMetricRows = [
            // Rider
            { softwareId: rider.id, metricId: indexingTime.id, metricName: indexingTime.name, value: 12.4 },
            { softwareId: rider.id, metricId: memoryFootprint.id, metricName: memoryFootprint.name, value: 820 },
            { softwareId: rider.id, metricId: githubStars.id, metricName: githubStars.name, value: 0 },
            // VS Code
            { softwareId: vscode.id, metricId: indexingTime.id, metricName: indexingTime.name, value: 3.1 },
            { softwareId: vscode.id, metricId: memoryFootprint.id, metricName: memoryFootprint.name, value: 310 },
            { softwareId: vscode.id, metricId: githubStars.id, metricName: githubStars.name, value: 165000 },
            { softwareId: vscode.id, metricId: extensionsCount.id, metricName: extensionsCount.name, value: 50000 },
            // Vim
            { softwareId: vim.id, metricId: indexingTime.id, metricName: indexingTime.name, value: 0.1 },
            { softwareId: vim.id, metricId: memoryFootprint.id, metricName: memoryFootprint.name, value: 15 },
            { softwareId: vim.id, metricId: githubStars.id, metricName: githubStars.name, value: 36000 },
            { softwareId: vim.id, metricId: extensionsCount.id, metricName: extensionsCount.name, value: 10000 },
            // PostgreSQL
            { softwareId: postgresql.id, metricId: memoryFootprint.id, metricName: memoryFootprint.name, value: 150 },
            { softwareId: postgresql.id, metricId: releaseYear.id, metricName: releaseYear.name, value: 1996 },
            { softwareId: postgresql.id, metricId: githubStars.id, metricName: githubStars.name, value: 15000 },
            // Redis
            { softwareId: redis.id, metricId: memoryFootprint.id, metricName: memoryFootprint.name, value: 25 },
            { softwareId: redis.id, metricId: releaseYear.id, metricName: releaseYear.name, value: 2009 },
            { softwareId: redis.id, metricId: githubStars.id, metricName: githubStars.name, value: 65000 },
            // MongoDB
            { softwareId: mongodb.id, metricId: memoryFootprint.id, metricName: memoryFootprint.name, value: 450 },
            { softwareId: mongodb.id, metricId: releaseYear.id, metricName: releaseYear.name, value: 2009 },
            { softwareId: mongodb.id, metricId: githubStars.id, metricName: githubStars.name, value: 26000 },
            // MySQL
            { softwareId: mysql.id, metricId: memoryFootprint.id, metricName: memoryFootprint.name, value: 350 },
            { softwareId: mysql.id, metricId: releaseYear.id, metricName: releaseYear.name, value: 1995 },
            { softwareId: mysql.id, metricId: githubStars.id, metricName: githubStars.name, value: 10000 },
            // Python
            { softwareId: python.id, metricId: releaseYear.id, metricName: releaseYear.name, value: 1991 },
            { softwareId: python.id, metricId: soQuestions.id, metricName: soQuestions.name, value: 2200000 },
            { softwareId: python.id, metricId: githubStars.id, metricName: githubStars.name, value: 63000 },
            // Go
            { softwareId: go.id, metricId: releaseYear.id, metricName: releaseYear.name, value: 2009 },
            { softwareId: go.id, metricId: soQuestions.id, metricName: soQuestions.name, value: 380000 },
            { softwareId: go.id, metricId: githubStars.id, metricName: githubStars.name, value: 125000 },
            // Rust
            { softwareId: rust.id, metricId: releaseYear.id, metricName: releaseYear.name, value: 2015 },
            { softwareId: rust.id, metricId: soQuestions.id, metricName: soQuestions.name, value: 120000 },
            { softwareId: rust.id, metricId: githubStars.id, metricName: githubStars.name, value: 100000 },
            // TypeScript
            { softwareId: typescript.id, metricId: releaseYear.id, metricName: releaseYear.name, value: 2012 },
            { softwareId: typescript.id, metricId: soQuestions.id, metricName: soQuestions.name, value: 450000 },
            { softwareId: typescript.id, metricId: githubStars.id, metricName: githubStars.name, value: 98000 },
            // JavaScript
            { softwareId: javascript.id, metricId: releaseYear.id, metricName: releaseYear.name, value: 1995 },
            { softwareId: javascript.id, metricId: soQuestions.id, metricName: soQuestions.name, value: 2500000 },
            { softwareId: javascript.id, metricId: githubStars.id, metricName: githubStars.name, value: 0 },
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