import { User } from '../../../entities/User.entity';
import { Product } from '../../../entities/Product.entity';


export interface CreateBasketCommand {
    user: User;
    product: Product;
}