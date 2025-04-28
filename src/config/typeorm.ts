import "reflect-metadata";
import { DataSource } from "typeorm";

// Configuration de la base de donnée avec l'ORM :
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: ['src/api/entities/*.entity.ts'],
})