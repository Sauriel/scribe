import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_POSTGRES_HOST,
    port: Number(process.env.DB_POSTGRES_PORT),
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    synchronize: true, // should be false in production
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
