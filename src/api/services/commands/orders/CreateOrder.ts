import { Product } from "../../../entities/Product.entity";
import { User } from "../../../entities/User.entity";
import { orderStatus } from "../../../entities/Order.entity";
export interface CreateOrderCommand {
  price: number;
  isPaid: boolean;
  status?: orderStatus;
  products: Product[];
}