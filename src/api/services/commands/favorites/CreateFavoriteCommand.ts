import { User } from '../../../entities/User.entity';
import { Product } from '../../../entities/Product.entity';


export interface CreateFavoriteCommand {
    user: User;
    product: Product;
}