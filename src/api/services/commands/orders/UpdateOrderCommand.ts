// services/commands/UpdateOrderCommand.ts
import { orderStatus } from "../../../entities/Order.entity";
import { Product } from "../../../entities/Product.entity";

export interface UpdateOrderCommand {
  price?: number;
  isPaid?: boolean;
  status?: orderStatus;
  products?: Product[];
}