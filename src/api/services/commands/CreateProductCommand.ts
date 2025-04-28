import { Category } from "../../entities/Category.entity";
import { User } from "../../entities/User.entity";

export interface CreateProductCommand {
    name: string;
    price: number;
    image: string;
    // seller: User; // Assuming seller is a user ID
    productCategory: Category; // Assuming category is a number (ID)
}
