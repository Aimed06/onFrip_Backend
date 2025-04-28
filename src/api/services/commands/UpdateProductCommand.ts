import { Category } from "../../entities/Category.entity";

export interface UpdateProductCommand {
    name?: string;
    price?: number;
    image?: string;
    category?: Category; // Assuming category is a number (ID)
}