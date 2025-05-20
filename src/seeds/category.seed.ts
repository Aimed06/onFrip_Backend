import 'dotenv/config';
import { AppDataSource } from "../config/typeorm";

import mockCategory from "./category.mocks";
import { Category } from '../api/entities/Category.entity';

async function seed() {
    
    await AppDataSource.initialize().then(() => {
        console.log("[SEEDS]: Connection established");
    });

    try {
        // Insérer les données des catégories
        await Category.createQueryBuilder()
            .insert()
            .values(mockCategory)
            .execute();

        console.log("[SEEDS] Categories mock data inserted successfully");
    } catch (error) {
        console.error("[SEEDS] An error occurred while inserting categories mock data :", error);
    }

    // Fermer la connexion à la base de données
    await AppDataSource.destroy();
}

seed();