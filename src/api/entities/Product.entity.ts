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
  
    @ManyToOne(() => User, (user) => user.products, { onDelete: "CASCADE" })
    seller!: User;

   @ManyToOne (() => Category, (category) =>category.products, { onDelete: "CASCADE", eager: true } )
   category!: Category;

   @OneToMany(() => Notification, (notification) => notification.product)
   notifications!: Notification[];

   @ManyToMany(() => User, (user) => user.favoriteProducts)
  favoriteUsers!: User[];

  @OneToMany (() => Order, (order) => order.product)
  orders!: Order[];
  }
  