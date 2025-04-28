import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { IsBoolean, IsEmail, IsNumber, IsPositive, Length } from "class-validator";
import { User } from "./User.entity";
import { Product } from "./Product.entity";

export enum orderStatus {
  WAITING = 0,
  CONFIRMED = 1,
  REFUSED = 2,
  CANCELED = 3,
}

export enum paymentMethod {
  ONLINE = "ONLINE",
  CASH = "CASH",
}

@Entity("orders")
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: orderStatus, default: orderStatus.WAITING })
  status!: orderStatus;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    name: 'created_at'
  })
  createdAt!: Date


  @Column({ default: 0 })
  @IsNumber()
  @IsPositive()
  price!: number

  @Column({ default: false })
  @IsBoolean()
  isPaid!: boolean

  @Column({ type: 'enum', enum: paymentMethod, default: paymentMethod.CASH })
  paymentMethod!: string

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column()
  user_id!: number;

  @ManyToOne(() => Product ,{ onDelete: "CASCADE", nullable: false })
  product!: Product

  


}
