require('dotenv/config');
const { DataSource } = require('typeorm');

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,

    entities: [__dirname + '/../dist/modules/**/*.entity.js'],
    migrations: [__dirname + '/migrations/*.js'],

    synchronize: false,
});

module.exports = { dataSource };
