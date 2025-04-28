import { IsNumber } from "class-validator";
import { BaseEntity, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { User } from "./User.entity";
import { Product } from "./Product.entity";

@Entity("favorites")
@Unique(["userId", "productId"]) // Add unique constraint
export class Favorite extends BaseEntity {
  @ManyToOne(() => User, (user) => user.favoriteProducts, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user!: User;

  @ManyToOne(() => Product, (product) => product.favoriteUsers, {
    cascade: true,
    onDelete: "CASCADE",
  })
  product!: Product;

  @PrimaryColumn()
  @IsNumber()
  userId!: number;

  @PrimaryColumn()
  @IsNumber()
  productId!: number;
}
