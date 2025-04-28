import { IsDate, IsObject, IsString } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product.entity";
import { User } from "./User.entity";

export type NotificationType =
  | "ORDER_ACCEPTED"
  | "ORDER_REFUSED";

@Entity("notifications")
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  userId!: number;

  @ManyToOne(() => User, (user) => user.notifications, { cascade: true })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ nullable: true })
  productId!: number;

  @ManyToOne(() => Product, (product) => product.notifications, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column()
  @IsString()
  type!: NotificationType;

  @Column({ type: "json" })
  @IsObject()
  data!: object;

  @Column({ default: false })
  isSeen!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @IsDate()
  createdAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  @IsDate()
  seenAt!: Date | null;
}
