import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, BaseEntity,
    ManyToMany,
    OneToMany
  } from "typeorm";
  import { User } from "../entities/User.entity";
import { Category } from "./Category.entity";
import { Notification } from "./Notification.entity";
import { Order } from "./Order.entity";

export enum ProductStatus {
  SOLD = 1,
  AVAILABLE = 0,
}
  
  @Entity("products")
  export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    name!: string;
  
    @Column("decimal")
    price!: number;

  
    @Column()
    image!: string;

    @Column({type: "enum", enum: ProductStatus, default: ProductStatus.AVAILABLE})
    status!: ProductStatus;

    @ManyToOne(() => User, (user) => user.products, { onDelete: "CASCADE" })
    seller!: User;

   @ManyToOne (() => Category, (category) =>category.products, { onDelete: "CASCADE", eager: true } )
   category!: Category;

   @OneToMany(() => Notification, (notification) => notification.product)
   notifications!: Notification[];

   @ManyToMany(() => User, (user) => user.favoriteProducts)
  favoriteUsers!: User[];


  }
  